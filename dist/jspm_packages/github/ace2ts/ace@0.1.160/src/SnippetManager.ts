import createDelayedCall from './lib/lang/createDelayedCall';
import ensureHTMLStyleElement from "./dom/ensureHTMLStyleElement";
import EventEmitterClass from "./lib/EventEmitterClass";
import {escapeRegExp} from "./lib/lang";
import comparePoints from "./comparePoints"
import Anchor from "./Anchor";
import KeyboardHandler from "./keyboard/KeyboardHandler";
import Tokenizer from "./Tokenizer";
import Editor from './Editor';
import EditSession from './EditSession';
import EventBus from './EventBus';
import Delta from "./Delta";
import Position from "./Position";
import Range from "./Range";
import Snippet from "./Snippet";
import SnippetOptions from './SnippetOptions';
import Tabstop from "./Tabstop";
import TabstopManager from "./TabstopManager";
import Token from "./Token";

/**
 * This hack is used by the velocity language only.
 */
var INCLUDE_SCOPES = 'includeScopes';

function escape(ch: string): string {
    return "(?:[^\\\\" + ch + "]|\\\\.)";
}

function tabstopTokenArray(str: string, _, stack): any[] {
    str = str.substr(1);
    if (/^\d+$/.test(str) && !stack.inFormatString) {
        return [{ tabstopId: parseInt(str, 10) }];
    }
    return [{ text: str }];
}

/**
 * @class SnippetManager
 */
export default class SnippetManager implements EventBus<SnippetManager> {

    /**
     * A map from scope to an array of Snippet.
     * FIXME: Mapping to an array does not properly admit additional properties
     * At the level of a collection of snippets, e.g., includeScopes: string[],
     * which is used by the velocity language (Java templating).
     *
     * @property snippetMap
     * @type { [scope: string]: Snippet[] }
     */
    public snippetMap: { [scope: string]: Snippet[] } = {};

    /**
     * A map from name to Snippet.
     *
     * @property snippetNameMap
     * @private
     */
    private snippetNameMap: { [scope: string]: { [name: string]: Snippet } } = {};

    /**
     *
     * @property vaiables
     * @private
     */
    private variables: { [varName: string]: any } = {};

    /**
     * @property eventBus
     * @type {EventEmitterClass}
     * @private
     */
    private eventBus: EventEmitterClass<SnippetManager>;

    /**
     * @class SnippetManager
     * @constructor
     */
    constructor() {
        this.eventBus = new EventEmitterClass<SnippetManager>(this);
    }

    private static $tokenizer = new Tokenizer({
        start: [
            {
                regex: /:/,
                onMatch: function(value: string, state: string, stack): any {
                    if (stack.length && stack[0].expectIf) {
                        stack[0].expectIf = false;
                        stack[0].elseBranch = stack[0];
                        return [stack[0]];
                    }
                    return ":";
                }
            },
            {
                regex: /\\./,
                onMatch: function(value: string, state: string, stack): string[] | { changeCase: string; local: boolean }[] {
                    var ch = value[1];
                    if (ch == "}" && stack.length) {
                        return [ch];
                    }
                    else if ("`$\\".indexOf(ch) != -1) {
                        return [ch];
                    }
                    else if (stack.inFormatString) {
                        if (ch == "n")
                            return ["\n"];
                        else if (ch == "t")
                            return ["\n"];
                        else if ("ulULE".indexOf(ch) != -1) {
                            return [{ changeCase: ch, local: ch > "a" }];
                        }
                    }
                    else {
                        return [value]
                    }
                }
            },
            {
                regex: /}/,
                onMatch: function(val, state, stack) {
                    return [stack.length ? stack.shift() : val];
                }
            },
            {
                regex: /\$(?:\d+|\w+)/,
                onMatch: tabstopTokenArray
            },
            {
                regex: /\$\{[\dA-Z_a-z]+/,
                onMatch: function(value: string, state, stack) {
                    var tokens = tabstopTokenArray(value.substr(1), state, stack);
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
                onMatch: function(val, state, stack: any) {
                    // FIXME: Wierd typing.
                    stack[0].choices = val.slice(1, -1).split(",");
                },
                next: "start"
            },
            {
                regex: "/(" + escape("/") + "+)/(?:(" + escape("/") + "*)/)(\\w*):?",
                onMatch: function(value: string, state, stack) {
                    // It would seem that we have a very decorated Range!
                    var ts = <Range>stack[0];
                    ts.fmtString = value;

                    // FIXME: What does his refer to? 
                    value = this.splitRegex.exec(value);
                    ts.guard = value[1];
                    ts.fmt = value[2];
                    ts.flag = value[3];
                    return "";
                }, next: "start"
            },
            {
                regex: "`" + escape("`") + "*`", onMatch: function(value: any, state, stack) {
                    stack[0].code = value.splice(1, -1);
                    return "";
                }, next: "start"
            },
            {
                regex: "\\?",
                // FIXME: Wierd typing.
                onMatch: function(val, state, stack: any) {
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
                onMatch: function(val, state, stack: any) {
                    stack.inFormatString = true;
                },
                next: "start"
            }
        ]
    });

    private getTokenizer(): Tokenizer {
        SnippetManager.prototype.getTokenizer = function() {
            return SnippetManager.$tokenizer;
        };
        return SnippetManager.$tokenizer;
    }

    private tokenizeTmSnippet(str: string, startState?: string): (string | Token)[] {
        return this.getTokenizer().getLineTokens(str, startState).tokens.map(function(x: Token) {
            return x.value || x;
        });
    }

    private $getDefaultValue(editor: Editor, name: string) {

        if (/^[A-Z]\d+$/.test(name)) {
            var i = name.substr(1);
            return (this.variables[name[0] + "__"] || {})[i];
        }

        if (/^\d+$/.test(name)) {
            return (this.variables['__'] || {})[name];
        }

        name = name.replace(/^TM_/, "");

        if (!editor)
            return;
        var s = editor.session;
        switch (name) {
            case "CURRENT_WORD":
                var r = s.getWordRange(editor.getCursorPosition().row, editor.getCursorPosition().column);
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
     * @method getVariableValue
     * @param editor {Editor}
     * @param varName {string}
     * @return {any}
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
     * @method tmStrFormat
     * @param str {string}
     * @param ch {{ flag: string; guard: string, fmt: string }}
     * @param [editor] {Editor}
     * @return {string}
     */
    public tmStrFormat(str: string, ch: { flag: string; guard: string, fmt: string }, editor?: Editor): string {

        var flag = ch.flag || "";
        var re = new RegExp(ch.guard, flag.replace(/[^gi]/, ""));
        var fmtTokens = this.tokenizeTmSnippet(ch.fmt, "formatString");

        let self = this;
        var formatted = str.replace(re, function() {
            // TS2496: The 'arguments' object cannot be referenced in an arrow function.
            // Instead, we use a standard function and capture this.
            self.variables['__'] = arguments;
            // FIXME: Why is editor a required parameter in this method call?
            var fmtParts = self.resolveVariables(fmtTokens, editor);
            var gChangeCase = "E";
            for (var i = 0; i < fmtParts.length; i++) {
                var ch = fmtParts[i];
                if (typeof ch === "object") {
                    fmtParts[i] = "";
                    if (ch.changeCase && ch.local) {
                        var next = fmtParts[i + 1];
                        if (next && typeof next == "string") {
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
                else if (gChangeCase === "U") {
                    fmtParts[i] = ch.toUpperCase();
                }
                else if (gChangeCase === "L") {
                    fmtParts[i] = ch.toLowerCase();
                }
            }
            return fmtParts.join("");
        });
        self.variables['__'] = null;
        return formatted;
    }

    /**
     * @method resolveVariables
     * @param snippet
     * @param editor {Editor}
     * @return {any[]}
     */
    private resolveVariables(snippet: any, editor: Editor): any[] {
        var result = [];
        for (var i = 0; i < snippet.length; i++) {
            var ch = snippet[i];
            if (typeof ch == "string") {
                result.push(ch);
            }
            else if (typeof ch != "object") {
                continue;
            }
            else if (ch.skip) {
                gotoNext(ch);
            }
            else if (ch.processed < i) {
                continue;
            }
            else if (ch.text) {
                var value = this.getVariableValue(editor, ch.text);
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
        function gotoNext(ch) {
            var i1 = snippet.indexOf(ch, i + 1);
            if (i1 != -1)
                i = i1;
        }
        return result;
    }

    /**
     * FIXME: The choice of string | Token makes it very difficult to impose type safety.
     *
     * @method insertSnippetForSelection
     * @param editor {Editor}
     * @param snippetText {string}
     * @return {void}
     * @private
     */
    private insertSnippetForSelection(editor: Editor, snippetText: string): void {
        var cursor = editor.getCursorPosition();
        var session = editor.getSession();
        var line = session.getLine(cursor.row);
        var tabString = session.getTabString();
        var indentString = line.match(/^\s*/)[0];

        if (cursor.column < indentString.length)
            indentString = indentString.slice(0, cursor.column);

        var tokens = this.tokenizeTmSnippet(snippetText);
        tokens = this.resolveVariables(tokens, editor);
        // indent
        tokens = tokens.map(function(x: /* string | Token*/any) {
            if (x == "\n") {
                return x + indentString;
            }
            if (typeof x === "string") {
                return x.replace(/\t/g, tabString);
            }
            return x;
        });

        // tabstop values
        var tabstops: Tabstop[] = [];
        tokens.forEach(function(p: any, i: number) {
            if (typeof p != "object")
                return;
            var id = p.tabstopId;
            var ts = tabstops[id];
            if (!ts) {
                // The cast is required because a Tabstop is more than just an Array<Range>.
                ts = tabstops[id] = <Tabstop>[];
                ts.index = id;
                ts.value = "";
            }
            if (ts.indexOf(p) !== -1)
                return;
            ts.push(p);
            var i1 = tokens.indexOf(p, i + 1);
            if (i1 === -1)
                return;

            var value = tokens.slice(i + 1, i1);
            var isNested = value.some(function(t) { return typeof t === "object" });
            if (isNested && !ts.value) {
                // TODO: Don't know why we need the cast.
                ts.value = <any>value;
            }
            else if (value.length && (!ts.value || typeof ts.value !== "string")) {
                ts.value = value.join("");
            }
        });

        // expand tabstop values
        tabstops.forEach(function(ts) { ts.length = 0 });
        var expanding = {};
        function copyValue(val: any[]) {
            var copy = [];
            for (var i = 0; i < val.length; i++) {
                var p = val[i];
                if (typeof p === "object") {
                    if (expanding[p.tabstopId])
                        continue;
                    var j = val.lastIndexOf(p, i - 1);
                    p = copy[j] || { tabstopId: p.tabstopId };
                }
                copy[i] = p;
            }
            return copy;
        }
        for (var i = 0; i < tokens.length; i++) {
            var p: any = tokens[i];
            if (typeof p !== "object")
                continue;
            var id = p.tabstopId;
            var i1 = tokens.indexOf(p, i + 1);
            if (expanding[id]) {
                // if reached closing bracket clear expanding state
                if (expanding[id] === p)
                    expanding[id] = null;
                // otherwise just ignore recursive tabstop
                continue;
            }

            var ts = tabstops[id];
            var arg = (typeof ts.value === "string") ? [ts.value] : copyValue(<any[]>ts.value);
            arg.unshift(i + 1, Math.max(0, i1 - i));
            arg.push(p);
            expanding[id] = p;
            tokens.splice.apply(tokens, arg);

            if (ts.indexOf(p) === -1)
                ts.push(p);
        }

        // convert to plain text
        var row = 0, column = 0;
        var text = "";
        // FIXME: t should be string or Token, but below we use start and end.
        // That looks more like a Range!
        tokens.forEach(function(t: any) {
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

        let range = editor.getSelectionRange();
        let end = editor.getSession().replace(range, text);

        let tsManager = editor.tabstopManager ? editor.tabstopManager : new TabstopManager(editor);
        let selectionId = editor.inVirtualSelectionMode && editor.selection.index;
        tsManager.addTabstops(tabstops, range.start, end, selectionId);
    }

    /**
     * @method insertSnippet
     * @param editor {Editor}
     * @param snippetText
     * @param [options] {SnippetOptions}
     * @return {void}
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
     * @method $getScope
     * @param editor {Editor}
     * @return {string}
     * @private
     */
    private $getScope(editor: Editor): string {
        var session = editor.getSession();
        var scope = session.$mode.$id || "";
        scope = scope.split("/").pop();
        if (scope === "html" || scope === "php") {
            // FIXME: Coupling to PHP?
            // PHP is actually HTML
            if (scope === "php" && !session.$mode['inlinePhp'])
                scope = "html";
            var c = editor.getCursorPosition();
            var state = session.getState(c.row);
            if (typeof state === "object") {
                state = state[0];
            }
            if (state.substring) {
                if (state.substring(0, 3) == "js-")
                    scope = "javascript";
                else if (state.substring(0, 4) == "css-")
                    scope = "css";
                else if (state.substring(0, 4) == "php-")
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
     * @method getActiveScopes
     * @param editor {Editor}
     * @return {string[]}
     */
    public getActiveScopes(editor: Editor): string[] {
        var scope = this.$getScope(editor);
        var scopes = [scope];
        var snippetMap = this.snippetMap;
        if (snippetMap[scope] && snippetMap[scope][INCLUDE_SCOPES]) {
            scopes.push.apply(scopes, snippetMap[scope][INCLUDE_SCOPES]);
        }
        scopes.push("_");
        return scopes;
    }

    /**
     * @method expandWithTab
     * @param editor {Editor}
     * @param [options] {SnippetOptions}
     * @return {boolean}
     */
    public expandWithTab(editor: Editor, options?: SnippetOptions): boolean {
        // FIXME: The result needs some attention.
        var result: boolean = editor.forEachSelection(() => { return this.expandSnippetForSelection(editor, options); }, null, { keepOrder: true });
        if (result && editor.tabstopManager) {
            editor.tabstopManager.tabNext();
        }
        return result;
    }

    /**
     * @method expandSnippetForSelection
     * @param editor {Editor}
     * @param [options] {SnippetOptions}
     * @return {boolean}
     */
    private expandSnippetForSelection(editor: Editor, options?: SnippetOptions): boolean {

        var cursor: Position = editor.getCursorPosition();
        var session: EditSession = editor.getSession();
        var line: string = session.getLine(cursor.row);
        var before: string = line.substring(0, cursor.column);
        var after: string = line.substr(cursor.column);

        var snippetMap = this.snippetMap;
        var snippet;
        var scopes = this.getActiveScopes(editor);

        scopes.some((scope: string) => {
            var snippets = snippetMap[scope];
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
        for (var i = snippetList.length; i--;) {
            var s = snippetList[i];
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
    }

    /**
     * @method on
     * @param eventName {string}
     * @param callback {(event, source: SnippetManager) => any}
     * @return {void}
     */
    on(eventName: string, callback: (event: any, source: SnippetManager) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     * @method off
     * @param eventName {string}
     * @param callback {(event, source: SnippetManager) => any}
     * @return {void}
     */
    off(eventName: string, callback: (event: any, source: SnippetManager) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     * @method register
     * @param snippets {Snippet[]}
     * @param [scope] {string}
     * @return {void}
     */
    public register(snippets: Snippet[], scope?: string): void {
        var snippetMap = this.snippetMap;
        var snippetNameMap = this.snippetNameMap;
        var self = this;

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
                if (re && re[re.length - 1] != "$")
                    re = re + "$";
            } else {
                re = re + guard;
                if (re && re[0] != "^")
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

            var map: { [name: string]: Snippet } = snippetNameMap[scope];
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
            throw new TypeError("snippets must be an array of Snippet.")
        }

        /**
         * @event registerSnippets
         */
        this.eventBus._signal("registerSnippets", { scope: scope });
    }

    /**
     * @method unregister
     * @param snippets {Snippet[]}
     * @param [scope] {string}
     * @return {void}
     */
    unregister(snippets: Snippet[], scope?: string): void {
        var snippetMap = this.snippetMap;
        var snippetNameMap = this.snippetNameMap;

        function removeSnippet(s: Snippet) {
            var nameMap = snippetNameMap[s.scope || scope];
            if (nameMap && nameMap[s.name]) {
                delete nameMap[s.name];
                var map = snippetMap[s.scope || scope];
                var i = map && map.indexOf(s);
                if (i >= 0)
                    map.splice(i, 1);
            }
        }

        if (Array.isArray(snippets)) {
            snippets.forEach(removeSnippet);
        }
        else {
            throw new TypeError("snippets must be an array of Snippet.")
        }
    }

    /**
     * Note: The format of the string is critical (tabs, newlines, etc).
     *
     * @method parseSnippetFile
     * @param str {string}
     * @return {Snippet[]} An array of snippets.
     */
    public parseSnippetFile(str: string): Snippet[] {

        str = str.replace(/\r/g, "");

        var list: Snippet[] = [];

        var snippet: Snippet = {};

        // Group 1 is like { \s \S }
        // Group 2 is like \S
        // Group 3 is like .
        // Group 4 is like \n \t .
        var re: RegExp = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;

        var m: RegExpExecArray;

        while (m = re.exec(str)) {

            if (m[1]) {
                try {
                    snippet = JSON.parse(m[1]);
                    list.push(snippet);
                }
                catch (e) {

                }
            }
            if (m[4]) {
                snippet.content = m[4].replace(/^\t/gm, "");
                list.push(snippet);
                snippet = {};
            }
            else {
                var key: string = m[2];
                var val: string = m[3];
                if (typeof key === 'string') {
                    if (key === "regex") {
                        var guardRe = /\/((?:[^\/\\]|\\.)*)|$/g;
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
     * @method getSnippetByName
     * @param name {string}
     * @param editor {Editor}
     * @return {Snippet}
     * @private
     */
    private getSnippetByName(name: string, editor: Editor): Snippet {
        var snippet: Snippet;
        this.getActiveScopes(editor).some((scope: string) => {
            var snippets: { [sname: string]: Snippet } = this.snippetNameMap[scope];
            if (snippets) {
                snippet = snippets[name];
            }
            return !!snippet;
        }, this);
        return snippet;
    }
}
