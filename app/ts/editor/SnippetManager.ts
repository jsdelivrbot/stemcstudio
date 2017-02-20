import EventEmitterClass from "./lib/EventEmitterClass";
import { escapeRegExp } from "./lib/lang";
import Tokenizer from "./Tokenizer";
import Editor from './Editor';
import EditSession from './EditSession';
import EventBus from './EventBus';
import Position from "./Position";
import Range from "./Range";
import Rule from './Rule';
import Snippet from "./Snippet";
import SnippetOptions from './SnippetOptions';
import Tabstop from "./Tabstop";
import TabstopManager from "./TabstopManager";
import Token from "./Token";

/**
 * This hack is used by the velocity language only.
 */
const INCLUDE_SCOPES = 'includeScopes';

function escape(ch: string): string {
    return "(?:[^\\\\" + ch + "]|\\\\.)";
}

/**
 * 
 */
function tabstopTokenArray(value: string, state: string, stack: any): { tabstopId: number }[] | { text: string }[] {
    value = value.substr(1);
    if (/^\d+$/.test(value) && !stack.inFormatString) {
        return [{ tabstopId: parseInt(value, 10) }];
    }
    return [{ text: value }];
}

/**
 * I don't know what this is yet.
 */
/*
interface Blobby {
    changeCase?: 'u' | 'l' | 'U' | 'L' | 'E';
    local?: boolean;
    skip?: boolean;
    processed?: number;
    text?: string;
    fmtString?;
    elseBranch?: Blobby;
    expectIf?;
    tabstopId?: number;
}
*/

/**
 *
 */
export default class SnippetManager implements EventBus<any, SnippetManager> {

    /**
     * A map from scope to an array of Snippet.
     * FIXME: Mapping to an array does not properly admit additional properties
     * At the level of a collection of snippets, e.g., includeScopes: string[],
     * which is used by the velocity language (Java templating).
     */
    public snippetMap: { [scope: string]: Snippet[] } = {};

    /**
     * A map from name to Snippet.
     */
    private snippetNameMap: { [scope: string]: { [name: string]: Snippet } } = {};

    /**
     *
     */
    private variables: { [varName: string]: any } = {};

    /**
     *
     */
    private eventBus: EventEmitterClass<any, SnippetManager>;

    /**
     *
     */
    constructor() {
        this.eventBus = new EventEmitterClass<any, SnippetManager>(this);
    }

    private static $tokenizer = new Tokenizer({
        start: [
            {
                regex: /:/,
                onMatch: function (value: string, state: string, stack: any[]): string | any[] {
                    if (stack.length && stack[0]['expectIf']) {
                        const blobby = stack[0];
                        blobby.expectIf = false;
                        blobby.elseBranch = blobby;
                        // stack[0]['expectIf'] = false;
                        // stack[0]['elseBranch'] = stack[0];
                        return [blobby];
                    }
                    return ":";
                }
            },
            {
                regex: /\\./,
                onMatch: function (value: string, state: string, stack: any[]): string[] | any[] {
                    const ch = value[1];
                    if (ch === "}" && stack.length) {
                        return [ch];
                    }
                    else if ("`$\\".indexOf(ch) !== -1) {
                        return [ch];
                    }
                    else if (stack['inFormatString']) {
                        if (ch === "n")
                            return ["\n"];
                        else if (ch === "t")
                            return ["\n"];
                        else if ("ulULE".indexOf(ch) !== -1) {
                            return [{ changeCase: ch, local: ch > "a" }];
                        }
                    }
                    else {
                        return [value];
                    }
                    return void 0;
                }
            },
            {
                regex: /}/,
                onMatch: function (value: string, state: string, stack: any[]) {
                    return [stack.length ? stack.shift() : value];
                }
            },
            {
                regex: /\$(?:\d+|\w+)/,
                onMatch: tabstopTokenArray
            },
            {
                regex: /\$\{[\dA-Z_a-z]+/,
                onMatch: function (value: string, state, stack: any[]) {
                    const tokens = tabstopTokenArray(value.substr(1), state, stack);
                    stack.unshift(tokens[0]);
                    return tokens;
                },
                next: "snippetVar"
            },
            {
                regex: /\n/,
                token: "newline",
                merge: false
            }
        ],
        snippetVar: [
            {
                regex: "\\|" + escape("\\|") + "*\\|",
                onMatch: function (value: string, state: string, stack: any[]) {
                    // FIXME: Wierd typing.
                    stack[0].choices = value.slice(1, -1).split(",");
                },
                next: "start"
            },
            {
                regex: "/(" + escape("/") + "+)/(?:(" + escape("/") + "*)/)(\\w*):?",
                onMatch: function (this: Rule, fmtString: string, state: string, stack: any[]) {
                    // It would seem that we have a very decorated Range!
                    const ts = <Range>(<any>stack[0]);
                    ts.fmtString = fmtString;

                    const value = this.splitRegex.exec(fmtString);
                    ts.guard = value[1];
                    ts.fmt = value[2];
                    ts.flag = value[3];
                    return "";
                }, next: "start"
            },
            {
                regex: "`" + escape("`") + "*`", onMatch: function (value: any, state, stack) {
                    stack[0]['code'] = value.splice(1, -1);
                    return "";
                }, next: "start"
            },
            {
                regex: "\\?",
                // FIXME: Wierd typing.
                onMatch: function (value: string, state: string, stack: any[]) {
                    if (stack[0]) {
                        stack[0].expectIf = true;
                    }
                },
                next: "start"
            },
            { regex: "([^:}\\\\]|\\\\.)*:?", token: "", next: "start" }
        ],
        formatString: [
            { regex: "/(" + escape("/") + "+)/", token: "regex" },
            {
                regex: "",
                onMatch: function (val, state, stack: any) {
                    stack.inFormatString = true;
                },
                next: "start"
            }
        ]
    });

    private getTokenizer(): Tokenizer {
        SnippetManager.prototype.getTokenizer = function () {
            return SnippetManager.$tokenizer;
        };
        return SnippetManager.$tokenizer;
    }

    private tokenizeTmSnippet(str: string, startState?: string): (string | Token)[] {
        return this.getTokenizer().getLineTokens(str, startState).tokens.map(function (x: Token) {
            return x.value || x;
        });
    }

    private $getDefaultValue(editor: Editor, name: string) {

        if (/^[A-Z]\d+$/.test(name)) {
            const i = name.substr(1);
            return (this.variables[name[0] + "__"] || {})[i];
        }

        if (/^\d+$/.test(name)) {
            return (this.variables['__'] || {})[name];
        }

        name = name.replace(/^TM_/, "");

        if (!editor)
            return;
        const s = editor.session;
        switch (name) {
            case "CURRENT_WORD":
                const r = s.getWordRange(editor.getCursorPosition().row, editor.getCursorPosition().column);
            /* falls through */
            case "SELECTION":
            case "SELECTED_TEXT":
                return s.getTextRange(r);
            case "CURRENT_LINE":
                return s.getLine(editor.getCursorPosition().row);
            case "PREV_LINE": // not possible in textmate
                return s.getLine(editor.getCursorPosition().row - 1);
            case "LINE_INDEX":
                return editor.getCursorPosition().column;
            case "LINE_NUMBER":
                return editor.getCursorPosition().row + 1;
            case "SOFT_TABS":
                return s.getUseSoftTabs() ? "YES" : "NO";
            case "TAB_SIZE":
                return s.getTabSize();
            // default but can't fill :(
            case "FILENAME":
            case "FILEPATH":
                return "";
            case "FULLNAME":
                return "Ace";
        }
    }

    /**
     * @param editor
     * @param varName
     */
    private getVariableValue(editor: Editor, varName: string): any {
        if (this.variables.hasOwnProperty(varName))
            return this.variables[varName](editor, varName) || "";
        return this.$getDefaultValue(editor, varName) || "";
    }

    /**
     * Formats according to
     * http://manual.macromates.com/en/regular_expressions#replacement_string_syntax_format_strings
     *
     * @param str
     * @param ch
     * @param editor
     */
    public tmStrFormat(str: string, ch: { flag?: string; guard: string, fmt: string }, editor?: Editor): string {

        const flag = ch.flag || "";
        const re = new RegExp(ch.guard, flag.replace(/[^gi]/, ""));
        const fmtTokens = this.tokenizeTmSnippet(ch.fmt, "formatString");

        const self = this;
        const formatted = str.replace(re, function () {
            // TS2496: The 'arguments' object cannot be referenced in an arrow function.
            // Instead, we use a standard function and capture this in the self variable.
            self.variables['__'] = arguments;
            // FIXME: Why is editor a required parameter in this method call?
            const fmtParts = self.resolveVariables(fmtTokens, editor);
            let gChangeCase = "E";
            for (let i = 0; i < fmtParts.length; i++) {
                const ch = fmtParts[i];
                if (typeof ch === 'string') {
                    if (gChangeCase === "U") {
                        fmtParts[i] = ch.toUpperCase();
                    }
                    else if (gChangeCase === "L") {
                        fmtParts[i] = ch.toLowerCase();
                    }
                }
                else {
                    fmtParts[i] = "";
                    if (ch.changeCase && ch.local) {
                        const next = fmtParts[i + 1];
                        if (next && typeof next === "string") {
                            if (ch.changeCase === "u")
                                fmtParts[i] = next[0].toUpperCase();
                            else
                                fmtParts[i] = next[0].toLowerCase();
                            fmtParts[i + 1] = next.substr(1);
                        }
                    }
                    else if (ch.changeCase) {
                        gChangeCase = ch.changeCase;
                    }
                }
            }
            return fmtParts.join("");
        });
        self.variables['__'] = null;
        return formatted;
    }

    /**
     * @param snippet
     * @param editor
     */
    private resolveVariables(snippet: any[], editor: Editor): any[] {
        const result: string[] = [];
        let i: number;
        for (i = 0; i < snippet.length; i++) {
            const ch = snippet[i];
            if (typeof ch === "string") {
                result.push(ch);
            }
            else if (typeof ch !== "object") {
                continue;
            }
            else if (ch.skip) {
                gotoNext(ch);
            }
            else if (ch.processed < i) {
                continue;
            }
            else if (ch.text) {
                let value = this.getVariableValue(editor, ch.text);
                if (value && ch.fmtString)
                    value = this.tmStrFormat(value, ch);
                ch.processed = i;
                if (ch.expectIf == null) {
                    if (value) {
                        result.push(value);
                        gotoNext(ch);
                    }
                }
                else {
                    if (value) {
                        ch.skip = ch.elseBranch;
                    } else
                        gotoNext(ch);
                }
            }
            else if (ch.tabstopId != null) {
                result.push(ch);
            }
            else if (ch.changeCase != null) {
                result.push(ch);
            }
        }
        function gotoNext(ch: string): void {
            const i1 = snippet.indexOf(ch, i + 1);
            if (i1 !== -1)
                i = i1;
        }
        return result;
    }

    /**
     * FIXME: The choice of string | Token makes it very difficult to impose type safety.
     *
     * @param editor
     * @param snippetText
     */
    private insertSnippetForSelection(editor: Editor, snippetText: string): void {
        const cursor = editor.getCursorPosition();
        const session = editor.getSession();
        const line = session.getLine(cursor.row);
        const tabString = session.getTabString();
        let indentString = line.match(/^\s*/)[0];

        if (cursor.column < indentString.length)
            indentString = indentString.slice(0, cursor.column);

        let tokens = this.tokenizeTmSnippet(snippetText);
        tokens = this.resolveVariables(tokens, editor);
        // indent
        tokens = tokens.map(function (x) {
            if (x === "\n") {
                return x + indentString;
            }
            if (typeof x === "string") {
                return x.replace(/\t/g, tabString);
            }
            return x;
        });

        // tabstop values
        const tabstops: Tabstop[] = [];
        tokens.forEach(function (p: any, i: number) {
            if (typeof p !== "object")
                return;
            const id = p.tabstopId;
            let ts = tabstops[id];
            if (!ts) {
                // The cast is required because a Tabstop is more than just an Array<Range>.
                ts = tabstops[id] = <Tabstop>[];
                ts.index = id;
                ts.value = "";
            }
            if (ts.indexOf(p) !== -1)
                return;
            ts.push(p);
            const i1 = tokens.indexOf(p, i + 1);
            if (i1 === -1)
                return;

            const value = tokens.slice(i + 1, i1);
            const isNested = value.some(function (t) { return typeof t === "object"; });
            if (isNested && !ts.value) {
                // TODO: Don't know why we need the cast.
                ts.value = <any>value;
            }
            else if (value.length && (!ts.value || typeof ts.value !== "string")) {
                ts.value = value.join("");
            }
        });

        // expand tabstop values
        tabstops.forEach(function (ts) { ts.length = 0; });
        const expanding = {};
        function copyValue(val: any[]) {
            const copy = [];
            for (let i = 0; i < val.length; i++) {
                let p = val[i];
                if (typeof p === "object") {
                    if (expanding[p.tabstopId])
                        continue;
                    const j = val.lastIndexOf(p, i - 1);
                    p = copy[j] || { tabstopId: p.tabstopId };
                }
                copy[i] = p;
            }
            return copy;
        }
        for (let i = 0; i < tokens.length; i++) {
            const p: any = tokens[i];
            if (typeof p !== "object")
                continue;
            const id = p.tabstopId;
            const i1 = tokens.indexOf(p, i + 1);
            if (expanding[id]) {
                // if reached closing bracket clear expanding state
                if (expanding[id] === p)
                    expanding[id] = null;
                // otherwise just ignore recursive tabstop
                continue;
            }

            const ts = tabstops[id];
            const arg = (typeof ts.value === "string") ? [ts.value] : copyValue(<any[]>ts.value);
            arg.unshift(i + 1, Math.max(0, i1 - i));
            arg.push(p);
            expanding[id] = p;
            tokens.splice.apply(tokens, arg);

            if (ts.indexOf(p) === -1)
                ts.push(p);
        }

        // convert to plain text
        let row = 0, column = 0;
        let text = "";
        // FIXME: t should be string or Token, but below we use start and end.
        // That looks more like a Range!
        tokens.forEach(function (t: any) {
            if (typeof t === "string") {
                if (t[0] === "\n") {
                    column = t.length - 1;
                    row++;
                } else
                    column += t.length;
                text += t;
            }
            else {
                if (!t.start)
                    t.start = { row: row, column: column };
                else
                    t.end = { row: row, column: column };
            }
        });

        const range = editor.getSelectionRange();
        const end = editor.getSession().replace(range, text);

        const tsManager = editor.tabstopManager ? editor.tabstopManager : new TabstopManager(editor);
        const selectionId = editor.inVirtualSelectionMode && editor.selection.index;
        tsManager.addTabstops(tabstops, range.start, end, selectionId);
    }

    /**
     * @param editor
     * @param snippetText
     * @param options
     */
    public insertSnippet(editor: Editor, snippetText: string, options?: SnippetOptions): void {

        if (editor.inVirtualSelectionMode) {
            return this.insertSnippetForSelection(editor, snippetText);
        }

        editor.forEachSelection(() => { this.insertSnippetForSelection(editor, snippetText); }, null, { keepOrder: true });
        if (editor.tabstopManager) {
            editor.tabstopManager.tabNext();
        }
    }

    /**
     * Essentially returns the language mode identifier of the editor.
     * 
     * There is some additional logic for HTML and PHP that should be generalized
     * through the LanguageMode for languages with embedded languages.
     *
     * @param editor
     */
    private $getScope(editor: Editor): string {
        const session = editor.getSession();
        let scope = session.$mode.$id || "";
        scope = scope.split("/").pop();
        if (scope === "html" || scope === "php") {
            // FIXME: Coupling to PHP?
            // PHP is actually HTML
            if (scope === "php" && !session.$mode['inlinePhp'])
                scope = "html";
            const c = editor.getCursorPosition();
            let state = session.getState(c.row);
            if (typeof state === "object") {
                state = state[0];
            }
            if (state.substring) {
                if (state.substring(0, 3) === "js-")
                    scope = "javascript";
                else if (state.substring(0, 4) === "css-")
                    scope = "css";
                else if (state.substring(0, 4) === "php-")
                    scope = "php";
            }
        }

        return scope;
    }

    /**
     * Essentially returns an array of strings containing
     * 1) the language mode identifier, e.g. 'javascript'
     * 2) an underscore '_' (don't know why)
     * 3) other language modes in the special case of embedded languages.
     *
     * @param editor
     */
    public getActiveScopes(editor: Editor): string[] {
        const scope = this.$getScope(editor);
        const scopes = [scope];
        const snippetMap = this.snippetMap;
        if (snippetMap[scope] && snippetMap[scope][INCLUDE_SCOPES]) {
            scopes.push.apply(scopes, snippetMap[scope][INCLUDE_SCOPES]);
        }
        scopes.push("_");
        return scopes;
    }

    /**
     * @param editor
     * @param options
     */
    public expandWithTab(editor: Editor, options?: SnippetOptions): boolean {
        const result: boolean = editor.forEachSelection(() => { return this.expandSnippetForSelection(editor, options); }, null, { keepOrder: true });
        if (result && editor.tabstopManager) {
            editor.tabstopManager.tabNext();
        }
        return result;
    }

    /**
     * @param editor
     * @param options
     */
    private expandSnippetForSelection(editor: Editor, options?: SnippetOptions): boolean {

        const cursor: Position = editor.getCursorPosition();
        const session: EditSession = editor.getSession();
        const line: string = session.getLine(cursor.row);
        const before: string = line.substring(0, cursor.column);
        const after: string = line.substr(cursor.column);

        const snippetMap = this.snippetMap;
        let snippet: Snippet;
        const scopes = this.getActiveScopes(editor);

        scopes.some((scope: string) => {
            const snippets = snippetMap[scope];
            if (snippets) {
                snippet = this.findMatchingSnippet(snippets, before, after);
            }
            return !!snippet;
        });
        if (!snippet) {
            return false;
        }
        if (options && options.dryRun) {
            return true;
        }
        session.doc.removeInLine(cursor.row,
            cursor.column - snippet.replaceBefore.length,
            cursor.column + snippet.replaceAfter.length
        );

        this.variables['M__'] = snippet.matchBefore;
        this.variables['T__'] = snippet.matchAfter;
        this.insertSnippetForSelection(editor, snippet.content);

        this.variables['M__'] = this.variables['T__'] = null;
        return true;
    }

    private findMatchingSnippet(snippetList: Snippet[], before: string, after: string): Snippet {
        for (let i = snippetList.length; i--;) {
            const s = snippetList[i];
            if (s.startRe && !s.startRe.test(before))
                continue;
            if (s.endRe && !s.endRe.test(after))
                continue;
            if (!s.startRe && !s.endRe)
                continue;

            s.matchBefore = s.startRe ? s.startRe.exec(before) : [""];
            s.matchAfter = s.endRe ? s.endRe.exec(after) : [""];
            s.replaceBefore = s.triggerRe ? s.triggerRe.exec(before)[0] : "";
            s.replaceAfter = s.endTriggerRe ? s.endTriggerRe.exec(after)[0] : "";
            return s;
        }
        return void 0;
    }

    /**
     * @param eventName
     * @param callback
     */
    on(eventName: string, callback: (event: any, source: SnippetManager) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     * @param eventName
     * @param callback
     */
    off(eventName: string, callback: (event: any, source: SnippetManager) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * @param snippets
     * @param scope
     */
    public register(snippets: Snippet[], scope?: string): void {
        const snippetMap = this.snippetMap;
        const snippetNameMap = this.snippetNameMap;
        const self = this;

        function wrapRegexp(src: string): string {
            if (src && !/^\^?\(.*\)\$?$|^\\b$/.test(src))
                src = "(?:" + src + ")";

            return src || "";
        }

        function guardedRegexp(re: string, guard: string, opening: boolean): RegExp {
            re = wrapRegexp(re);
            guard = wrapRegexp(guard);
            if (opening) {
                re = guard + re;
                if (re && re[re.length - 1] !== "$")
                    re = re + "$";
            } else {
                re = re + guard;
                if (re && re[0] !== "^")
                    re = "^" + re;
            }
            return new RegExp(re);
        }

        function addSnippet(s: Snippet) {
            if (!s.scope)
                s.scope = scope || "_";
            scope = s.scope;
            if (!snippetMap[scope]) {
                snippetMap[scope] = [];
                snippetNameMap[scope] = {};
            }

            const map: { [name: string]: Snippet } = snippetNameMap[scope];
            if (s.name) {
                let existingSnippet: Snippet = map[s.name];
                if (existingSnippet) {
                    self.unregister([existingSnippet]);
                }
                map[s.name] = s;
            }
            snippetMap[scope].push(s);

            if (s.tabTrigger && !s.trigger) {
                if (!s.guard && /^\w/.test(s.tabTrigger))
                    s.guard = "\\b";
                s.trigger = escapeRegExp(s.tabTrigger);
            }

            s.startRe = guardedRegexp(s.trigger, s.guard, true);
            s.triggerRe = new RegExp(s.trigger, "");

            s.endRe = guardedRegexp(s.endTrigger, s.endGuard, true);
            s.endTriggerRe = new RegExp(s.endTrigger, "");
        }

        if (Array.isArray(snippets)) {
            snippets.forEach(addSnippet);
        }
        else {
            throw new TypeError("snippets must be an array of Snippet.");
        }

        /**
         * @event registerSnippets
         */
        this.eventBus._signal("registerSnippets", { scope: scope });
    }

    /**
     * @param snippets
     * @param scope
     */
    unregister(snippets: Snippet[], scope?: string): void {
        const snippetMap = this.snippetMap;
        const snippetNameMap = this.snippetNameMap;

        function removeSnippet(s: Snippet) {
            const nameMap = snippetNameMap[s.scope || scope];
            if (nameMap && nameMap[s.name]) {
                delete nameMap[s.name];
                const map = snippetMap[s.scope || scope];
                const i = map && map.indexOf(s);
                if (i >= 0)
                    map.splice(i, 1);
            }
        }

        if (Array.isArray(snippets)) {
            snippets.forEach(removeSnippet);
        }
        else {
            throw new TypeError("snippets must be an array of Snippet.");
        }
    }

    /**
     * Note: The format of the string is critical (tabs, newlines, etc).
     *
     * @method parseSnippetFile
     * @param str
     * @returns An array of snippets.
     */
    public parseSnippetFile(str: string): Snippet[] {

        str = str.replace(/\r/g, "");

        const list: Snippet[] = [];

        let snippet: Snippet = {};

        // Group 1 is like { \s \S }
        // Group 2 is like \S
        // Group 3 is like .
        // Group 4 is like \n \t .
        const re: RegExp = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;

        let m: RegExpExecArray;

        while (m = re.exec(str)) {

            if (m[1]) {
                try {
                    snippet = JSON.parse(m[1]);
                    list.push(snippet);
                }
                catch (e) {
                    // Ignore.
                }
            }
            if (m[4]) {
                snippet.content = m[4].replace(/^\t/gm, "");
                list.push(snippet);
                snippet = {};
            }
            else {
                const key: string = m[2];
                const val: string = m[3];
                if (typeof key === 'string') {
                    if (key === "regex") {
                        const guardRe = /\/((?:[^\/\\]|\\.)*)|$/g;
                        snippet.guard = guardRe.exec(val)[1];
                        snippet.trigger = guardRe.exec(val)[1];
                        snippet.endTrigger = guardRe.exec(val)[1];
                        snippet.endGuard = guardRe.exec(val)[1];
                    }
                    else if (key === "snippet") {
                        snippet.tabTrigger = val.match(/^\S*/)[0];
                        if (!snippet.name) {
                            snippet.name = val;
                        }
                    }
                    else {
                        snippet[key] = val;
                    }
                }
                else {
                    // key is undefined.
                }
            }
        }
        return list;
    }

    /**
     *
     */
    public getSnippetByName(name: string, editor: Editor): Snippet {
        let snippet: Snippet;
        this.getActiveScopes(editor).some((scope: string) => {
            const snippets: { [sname: string]: Snippet } = this.snippetNameMap[scope];
            if (snippets) {
                snippet = snippets[name];
            }
            return !!snippet;
        });
        return snippet;
    }
}
