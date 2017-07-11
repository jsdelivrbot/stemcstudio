import { EventEmitterClass } from "./lib/EventEmitterClass";
import { escapeRegExp } from "./lib/lang";
import { Tokenizer } from "./Tokenizer";
import { EventBus } from './EventBus';
import { Rule } from './Rule';
import { Snippet } from "./Snippet";
import { SnippetOptions } from './SnippetOptions';
import { ChangeCase, ChangeCaseElement, Tabstop, TabstopIndex, TabstopText, TabstopToken, TmFormat, TmFormatPart, TmFormatToken } from "./Tabstop";
import { UPPERCASE_NEXT_LETTER } from "./Tabstop";
import { LOWERCASE_NEXT_LETTER } from "./Tabstop";
import { UPPERCASE_UNTIL_CHANGE } from "./Tabstop";
import { LOWERCASE_UNTIL_CHANGE } from "./Tabstop";
import { END_CHANGE_CASE } from "./Tabstop";
//
// Editor Abstraction Layer
//
import { Position } from 'editor-document';
import { Editor } from '../editor/Editor';

/**
 * This hack is used by the velocity language only.
 */
const INCLUDE_SCOPES = 'includeScopes';

function escape(ch: string): string {
    return "(?:[^\\\\" + ch + "]|\\\\.)";
}

function isTabstopIndex(thing: any): thing is TabstopIndex {
    const candidate = <TabstopIndex>thing;
    return typeof candidate.tabstopId === 'number';
}

type TabstopStackElement = string | ChangeCaseElement | TabstopIndex | TabstopText | TabstopToken;

interface TabstopStack extends Array<TabstopStackElement> {
    inFormatString: boolean;
}

type TabstopRule = Rule<TabstopToken, TabstopStackElement, TabstopStack>;

type MatchResult = string | (TabstopStackElement)[] | undefined;

function isExpectingIf(element: TabstopToken): element is TabstopToken {
    if (element.expectIf) {
        return true;
    }
    else {
        return false;
    }
}

export type TokenizerStateName = 'start' | 'snippetVar' | 'formatString';

/**
 * 
 */
function tabstopTokenArray(value: string, state: string, stack: TabstopStack): (TabstopIndex | TabstopText)[] {
    value = value.substr(1);
    if (/^\d+$/.test(value) && !stack.inFormatString) {
        return [{ tabstopId: parseInt(value, 10) }];
    }
    return [{ text: value }];
}

interface Variable {
    (editor: Editor | null | undefined, varName: string): string;
}

const startRuleColon: TabstopRule = {
    regex: /:/,
    onMatch: function (this: TabstopRule, value: string, state: string, stack: TabstopStack): MatchResult {
        const stackZero = <TabstopToken>stack[0];
        if (stack.length && isExpectingIf(stackZero)) {
            const token = stackZero;
            token.expectIf = false;
            token.elseBranch = token;
            return [token];
        }
        return ":";
    }
};

const startRuleAnyChar: TabstopRule = {
    regex: /\\./,
    onMatch: function (this: TabstopRule, value: string, state: string, stack: TabstopStack): MatchResult {
        const ch = value[1];
        if (ch === "}" && stack.length) {
            return [ch];
        }
        else if ("`$\\".indexOf(ch) !== -1) {
            return [ch];
        }
        else if (stack.inFormatString) {
            if (ch === "n") {
                return ["\n"];
            }
            else if (ch === "t") {
                return ["\n"];
            }
            else if ("ulULE".indexOf(ch) !== -1) {
                const changeCase = <ChangeCase>ch;
                const local = ch > 'a';
                return [new ChangeCaseElement(changeCase, local)];
            }
        }
        else {
            return [value];
        }
        return void 0;
    }
};

const startRuleAnyDigitOrChar: TabstopRule = {
    regex: /\$\{[\dA-Z_a-z]+/,
    onMatch: function (this: TabstopRule, value: string, state: string, stack: TabstopStack): MatchResult {
        const tokens = tabstopTokenArray(value.substr(1), state, stack);
        stack.unshift(tokens[0]);
        return tokens;
    },
    next: "snippetVar"
};


const startRuleClosingBrace: TabstopRule = {
    regex: /}/,
    onMatch: function (this: TabstopRule, value: string, state: string, stack: TabstopStack): MatchResult {
        return [stack.length ? <TabstopStackElement>stack.shift() : value];
    }
};

const startRules: TabstopRule[] = [
    startRuleColon,
    startRuleAnyChar,
    startRuleClosingBrace,
    {
        regex: /\$(?:\d+|\w+)/,
        onMatch: tabstopTokenArray
    },
    startRuleAnyDigitOrChar,
    {
        regex: /\n/,
        token: "newline",
        merge: false
    }
];

const snippetVarRules: TabstopRule[] = [
    {
        regex: "\\|" + escape("\\|") + "*\\|",
        onMatch: function (this: TabstopRule, value: string, state: string, stack: TabstopStack): MatchResult {
            // TODO
            (<any>stack[0]).choices = value.slice(1, -1).split(",");
            return void 0;
        },
        next: "start"
    },
    {
        regex: "/(" + escape("/") + "+)/(?:(" + escape("/") + "*)/)(\\w*):?",
        onMatch: function (this: TabstopRule, fmtString: string, state: string, stack: TabstopStack): MatchResult {
            const ts = <TabstopToken>stack[0];
            ts.fmtString = fmtString;

            const value = (<RegExp>this.splitRegex).exec(fmtString);
            if (Array.isArray(value)) {
                ts.guard = value[1];
                ts.fmt = value[2];
                ts.flag = value[3];
            }
            else {
                console.warn(`value => ${value} is not an array`);
            }
            return "";
        },
        next: "start"
    },
    {
        regex: "`" + escape("`") + "*`",
        onMatch: function (this: TabstopRule, value: string, state: string, stack: TabstopStack): MatchResult {
            // FIXME: What is happening here?
            stack[0]['code'] = (<any>value).splice(1, -1);
            return "";
        },
        next: "start"
    },
    {
        regex: "\\?",
        onMatch: function (this: TabstopRule, value: string, state: string, stack: TabstopStack): MatchResult {
            const stackZero = <TabstopToken>stack[0];
            if (stackZero) {
                stackZero.expectIf = true;
            }
            return void 0;
        },
        next: "start"
    },
    {
        regex: "([^:}\\\\]|\\\\.)*:?",
        token: "",
        next: "start"
    }
];

const formatStringRules: TabstopRule[] = [
    {
        regex: "/(" + escape("/") + "+)/",
        token: "regex"
    },
    {
        regex: "",
        onMatch: function (this: TabstopRule, value: string, state: string, stack: TabstopStack): MatchResult {
            stack.inFormatString = true;
            return void 0;
        },
        next: "start"
    }
];

export type SnippetManagerEventName = 'registerSnippets';

/*
export interface SnippetManagerEditor {
    enableTabStops(): TabstopManager;
    isSnippetSelectionMode(): boolean;
    forEachSelection(action: Action<SnippetManagerEditor>, args: any, options?: { keepOrder?: boolean; $byLines?: boolean }): any;
    getCursorPosition(): Position;
    getSelectionIndex(): number;
    getSelectionRange(): Range;
    sessionOrThrow(): EditSession;
    tabNext(): void;
}
*/

export type TokenizedSnippetPart = (string | ChangeCaseElement | TabstopIndex | TabstopText);
export type TokenizedSnippet = TokenizedSnippetPart[];

/**
 *
 */
export class SnippetManager implements EventBus<SnippetManagerEventName, any, SnippetManager> {

    /**
     * A map from scope to an array of Snippet.
     * FIXME: Mapping to an array does not properly admit additional properties
     * At the level of a collection of snippets, e.g., includeScopes: string[],
     * which is used by the velocity language (Java templating).
     */
    public readonly snippetMap: { [scope: string]: Snippet[] } = {};

    /**
     * A map from name to Snippet.
     */
    private readonly snippetNameMap: { [scope: string]: { [name: string]: Snippet } } = {};

    /**
     *
     */
    private readonly variables: { [varName: string]: Variable | string[] | null } = {};

    /**
     *
     */
    private readonly eventBus: EventEmitterClass<SnippetManagerEventName, any, SnippetManager>;

    /**
     *
     */
    constructor() {
        this.eventBus = new EventEmitterClass<SnippetManagerEventName, any, SnippetManager>(this);
    }

    private static $tokenizer = new Tokenizer<TabstopToken, TabstopStackElement, TabstopStack>({
        'start': startRules,
        'snippetVar': snippetVarRules,
        'formatString': formatStringRules
    });

    private getTokenizer(): Tokenizer<TabstopToken, TabstopStackElement, TabstopStack> {
        SnippetManager.prototype.getTokenizer = function () {
            return SnippetManager.$tokenizer;
        };
        return SnippetManager.$tokenizer;
    }

    /**
     * 
     */
    public tokenizeTmSnippet(str: string, startState?: TokenizerStateName): TokenizedSnippet {
        return this.getTokenizer().getLineTokens(str, startState).tokens.map(function (tsToken) {
            // TODO: Perhaps the SnippetManager should have a custom tokenizer?
            return tsToken.value || <TokenizedSnippetPart>(tsToken as any);
        });
    }

    /**
     * Returns undefined if the editor is not defined.
     */
    private $getDefaultValue(editor: Editor | null | undefined, name: string): number | string | undefined {

        if (/^[A-Z]\d+$/.test(name)) {
            const i = name.substr(1);
            return (this.variables[name[0] + "__"] || {})[i];
        }

        if (/^\d+$/.test(name)) {
            return (this.variables['__'] || {})[name];
        }

        // Replace any name starting with "TM_" by dropping the leading "TM_".
        name = name.replace(/^TM_/, "");

        if (!editor) {
            return void 0;
        }
        // const session = editor.sessionOrThrow();
        switch (name) {
            case "CURRENT_WORD":
                const r = editor.getWordRange(editor.getCursorPosition().row, editor.getCursorPosition().column);
                return editor.getTextRange(r);
            case "SELECTION":
            case "SELECTED_TEXT":
                return editor.getTextRange();
            case "CURRENT_LINE":
                return editor.getLine(editor.getCursorPosition().row);
            case "PREV_LINE": // not possible in textmate
                return editor.getLine(editor.getCursorPosition().row - 1);
            case "LINE_INDEX":
                return editor.getCursorPosition().column;
            case "LINE_NUMBER":
                return editor.getCursorPosition().row + 1;
            case "SOFT_TABS":
                return editor.getUseSoftTabs() ? "YES" : "NO";
            case "TAB_SIZE":
                return editor.getTabSize();
            // default but can't fill :(
            case "FILENAME":
            case "FILEPATH":
                return "";
            case "FULLNAME":
                return "Ace";
        }
        return void 0;
    }

    /**
     *
     */
    private getVariableValue(editor: Editor | null | undefined, varName: string): number | string | undefined {
        if (this.variables.hasOwnProperty(varName)) {
            return (<Variable>this.variables[varName])(editor, varName) || "";
        }
        return this.$getDefaultValue(editor, varName) || "";
    }

    /**
     * The purpose of this method is to reformat the snippet text such that it can be inserted into the editor.
     * This involves resolving variables used in the snippet.
     * Other formatting may occur, as defined by the snippet text.
     * This method is called by the tabstop manager during the updating of linked fields and also recusively in resolving variables.
     * Formats according to
     * http://manual.macromates.com/en/regular_expressions#replacement_string_syntax_format_strings
     */
    public tmStrFormat(snippetText: string, chIn: TmFormat, editor?: Editor): string {

        const flag = chIn.flag || "";
        const re = new RegExp(chIn.guard, flag.replace(/[^gi]/, ""));
        const fmtTokens = this.tokenizeTmSnippet(chIn.fmt, "formatString");

        const self = this;
        const formatted = snippetText.replace(re, function () {
            // TS2496: The 'arguments' object cannot be referenced in an arrow function.
            // Instead, we use a standard function and capture this in the self variable.
            self.variables['__'] = <any>arguments;
            // FIXME: Why is editor a required parameter in this method call?
            // FIXME: Problem with typing here.
            const fmtParts = self.resolveVariables(fmtTokens as any, editor);
            /**
             * Global change case state.
             */
            let gChangeCase: ChangeCase = END_CHANGE_CASE;
            for (let i = 0; i < fmtParts.length; i++) {
                const ch = fmtParts[i];
                if (typeof ch === 'string') {
                    if (gChangeCase === UPPERCASE_UNTIL_CHANGE) {
                        fmtParts[i] = ch.toUpperCase();
                    }
                    else if (gChangeCase === LOWERCASE_UNTIL_CHANGE) {
                        fmtParts[i] = ch.toLowerCase();
                    }
                    else {
                        // Do nothing.
                    }
                }
                else if (typeof ch === 'number') {
                    console.warn(`ch => ${ch} was not expected`);
                }
                else {
                    fmtParts[i] = "";
                    if (ch instanceof ChangeCaseElement) {
                        if (ch.local) {
                            const next = fmtParts[i + 1];
                            if (typeof next === "string") {
                                if (next.length > 0) {
                                    if (ch.changeCase === UPPERCASE_NEXT_LETTER) {
                                        fmtParts[i] = next[0].toUpperCase();
                                    }
                                    else if (ch.changeCase === LOWERCASE_NEXT_LETTER) {
                                        fmtParts[i] = next[0].toLowerCase();
                                    }
                                    else {
                                        // Do nothing?
                                        fmtParts[i] = next[0];
                                        // fmtParts[i] = next[0].toLowerCase();
                                    }
                                    fmtParts[i + 1] = next.substr(1);
                                }
                            }
                            else {
                                // next is a TabstopToken.
                            }
                        }
                        else {
                            gChangeCase = ch.changeCase;
                        }
                    }
                }
            }
            return fmtParts.join("");
        });
        self.variables['__'] = null;
        return formatted;
    }

    /**
     *
     */
    private resolveVariables(fmtTokens: (string | TmFormatToken)[], editor?: Editor): (string | TmFormatPart)[] {
        const result: (string | TmFormatPart)[] = [];
        for (let i = 0; i < fmtTokens.length; i++) {
            const ch = fmtTokens[i];
            if (typeof ch === "string") {
                result.push(ch);
            }
            else if (typeof ch !== "object") {
                // Maybe undefined or something else?
                continue;
            }
            else if (ch.skip) {
                i = gotoNext(ch, i);
            }
            else if (<number>ch.processed < i) {
                continue;
            }
            else if (ch.text) {
                let value = this.getVariableValue(editor, ch.text);
                if (value && ch.fmtString) {
                    value = this.tmStrFormat(<string>value, <TmFormat>ch);
                }
                ch.processed = i;
                // The following line also handles undefined because undefined == null => true
                if (ch.expectIf == null) {
                    if (value) {
                        result.push(<string>value);
                        i = gotoNext(ch, i);
                    }
                }
                else {
                    if (value) {
                        ch.skip = ch.elseBranch;
                    }
                    else {
                        i = gotoNext(ch, i);
                    }
                }
            }
            else if (isTabstopIndex(ch)) {
                result.push(ch);
            }
            else if (ch instanceof ChangeCaseElement) {
                result.push(ch);
            }
        }
        /**
         * Finds the index of the next occurrence of the token, or returns the current index.
         */
        function gotoNext(ch: string | TmFormatToken, currentIndex: number): number {
            const firstOccurIndex = fmtTokens.indexOf(ch, currentIndex + 1);
            if (firstOccurIndex !== -1) {
                return firstOccurIndex;
            }
            else {
                return currentIndex;
            }
        }
        return result;
    }

    /**
     *
     */
    private insertSnippetForSelection(editor: Editor, snippetText: string): void {
        const cursor = editor.getCursorPosition();
        // const session = editor.sessionOrThrow();
        const line = editor.getLine(cursor.row);
        const tabString = editor.getTabString();
        let indentString = (<RegExpMatchArray>line.match(/^\s*/))[0];

        if (cursor.column < indentString.length)
            indentString = indentString.slice(0, cursor.column);

        let fmtTokens = this.tokenizeTmSnippet(snippetText);
        // FIXME: Problem wuth typing.
        let fmtParts = this.resolveVariables(fmtTokens as any, editor);
        // indent
        fmtParts = fmtParts.map(function (x) {
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
        fmtParts.forEach(function (fmtPart, i: number) {
            if (typeof fmtPart !== "object") {
                // p must be a string, or maybe null or undefined.
                return;
            }
            const id = <number>fmtPart.tabstopId;
            let ts = tabstops[id];
            if (!ts) {
                // The cast is required because a Tabstop is more than just an Array<Range>.
                ts = tabstops[id] = [] as any;
                ts.index = id;
                ts.value = "";
            }
            // FIXME
            if (ts.indexOf(<any>fmtPart) !== -1) {
                return;
            }
            ts.push(<any>fmtPart);
            const i1 = fmtParts.indexOf(fmtPart, i + 1);
            if (i1 === -1)
                return;

            const value = fmtParts.slice(i + 1, i1);
            const isNested = value.some(function (t) { return typeof t === "object"; });
            if (isNested && !ts.value) {
                ts.value = value;
            }
            else if (value.length && (!ts.value || typeof ts.value !== "string")) {
                ts.value = value.join("");
            }
        });

        // expand tabstop values
        tabstops.forEach(function (ts) { ts.length = 0; });
        const expanding = {};
        function copyValue(parts: (string | TmFormatPart)[]) {
            const copy: (string | TmFormatPart)[] = [];
            for (let i = 0; i < parts.length; i++) {
                let p = parts[i];
                if (typeof p === "object") {
                    if (expanding[<number>p.tabstopId])
                        continue;
                    const j = parts.lastIndexOf(p, i - 1);
                    p = copy[j] || { tabstopId: p.tabstopId };
                }
                copy[i] = p;
            }
            return copy;
        }
        for (let i = 0; i < fmtParts.length; i++) {
            const p = fmtParts[i];
            if (typeof p !== "object")
                continue;
            const id = <number>p.tabstopId;
            const i1 = fmtParts.indexOf(p, i + 1);
            if (expanding[id]) {
                // if reached closing bracket clear expanding state
                if (expanding[id] === p)
                    expanding[id] = null;
                // otherwise just ignore recursive tabstop
                continue;
            }

            const ts = tabstops[id];
            const arg: (string | number | TmFormatPart)[] = (typeof ts.value === "string") ? [ts.value] : copyValue(ts.value);
            arg.unshift(i + 1, Math.max(0, i1 - i));
            arg.push(p);
            expanding[id] = p;
            fmtParts.splice.apply(fmtParts, arg);
            // FIXME
            if (ts.indexOf(<any>p) === -1)
                ts.push(<any>p);
        }

        // convert to plain text
        let row = 0;
        let column = 0;
        let text = "";
        // FIXME: t should be string or Token, but below we use start and end.
        // That looks more like a Range!
        fmtParts.forEach(function (t) {
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
        const end = editor.replaceRange(range, text);

        const tsManager = editor.enableTabStops();
        const selectionIndex = editor.isSnippetSelectionMode() && editor.getSelectionIndex();
        tsManager.addTabstops(tabstops, range.start, end, selectionIndex);
    }

    /**
     * The Editor delegates to this method.
     * The snippet text is inserted for each selection.
     * The editor tabs to the first insertion point.
     */
    public insertSnippet(editor: Editor, snippetText: string, options?: SnippetOptions): void {

        if (editor.isSnippetSelectionMode()) {
            this.insertSnippetForSelection(editor, snippetText);
        }
        else {
            editor.forEachSelection(() => { this.insertSnippetForSelection(editor, snippetText); }, null, { keepOrder: true });
            editor.tabNext();
        }
    }

    /**
     * Essentially returns the language mode identifier of the editor.
     * 
     * There is some additional logic for HTML and PHP that should be generalized
     * through the LanguageMode for languages with embedded languages.
     */
    private $getScope(editor: Editor): string | undefined {
        const session = editor.sessionOrThrow();
        const mode = session.modeOrThrow();
        let scope: string | undefined = mode.$id || "";
        scope = scope.split("/").pop();
        if (scope === "html" || scope === "php") {
            // FIXME: Coupling to PHP?
            // PHP is actually HTML
            if (scope === "php" && !mode['inlinePhp']) {
                scope = "html";
            }
            const c = editor.getCursorPosition();
            const state = session.getState(c.row);
            if (state.substring) {
                if (state.substring(0, 3) === "js-") {
                    scope = "javascript";
                }
                else if (state.substring(0, 4) === "css-") {
                    scope = "css";
                }
                else if (state.substring(0, 4) === "php-") {
                    scope = "php";
                }
            }
        }

        return scope;
    }

    /**
     * Essentially returns an array of strings containing
     * 1) the language mode identifier, e.g. 'javascript'
     * 2) an underscore '_' (don't know why)
     * 3) other language modes in the special case of embedded languages.
     */
    public getActiveScopes(editor: Editor): string[] {
        const scope = this.$getScope(editor);
        if (typeof scope === 'string') {
            const scopes = [scope];
            const snippetMap = this.snippetMap;
            if (snippetMap[scope] && snippetMap[scope][INCLUDE_SCOPES]) {
                scopes.push.apply(scopes, snippetMap[scope][INCLUDE_SCOPES]);
            }
            scopes.push("_");
            return scopes;
        }
        else {
            return [];
        }
    }

    /**
     *
     */
    public expandWithTab(editor: Editor, options?: SnippetOptions): any {
        const result = editor.forEachSelection(() => { return this.expandSnippetForSelection(editor, options); }, null, { keepOrder: true });
        if (result) {
            editor.tabNext();
        }
        return result;
    }

    /**
     *
     */
    private expandSnippetForSelection(editor: Editor, options?: SnippetOptions): boolean {

        const cursor: Position = editor.getCursorPosition();
        // const session: EditSession = editor.sessionOrThrow();
        const line: string = editor.getLine(cursor.row);
        const before: string = line.substring(0, cursor.column);
        const after: string = line.substr(cursor.column);

        const snippetMap = this.snippetMap;
        let snippet: Snippet | undefined;
        const scopes = this.getActiveScopes(editor);

        scopes.some((scope: string) => {
            const snippets = snippetMap[scope];
            if (snippets) {
                snippet = findMatchingSnippet(snippets, before, after);
            }
            return !!snippet;
        });
        if (!snippet) {
            return false;
        }
        if (options && options.dryRun) {
            return true;
        }
        editor.removeInLine(cursor.row,
            cursor.column - (<string>(<Snippet>snippet).replaceBefore).length,
            cursor.column + (<string>(<Snippet>snippet).replaceAfter).length
        );

        this.variables['M__'] = snippet.matchBefore as string[];
        this.variables['T__'] = snippet.matchAfter as string[];
        this.insertSnippetForSelection(editor, snippet.content);

        this.variables['M__'] = this.variables['T__'] = null;
        return true;
    }

    /**
     *
     */
    on(eventName: SnippetManagerEventName, callback: (event: any, source: SnippetManager) => any): void {
        this.eventBus.on(eventName, callback, false);
    }

    /**
     *
     */
    off(eventName: SnippetManagerEventName, callback: (event: any, source: SnippetManager) => any): void {
        this.eventBus.off(eventName, callback);
    }

    /**
     *
     */
    public register(snippets: Snippet[], scope?: string): void {
        const snippetMap = this.snippetMap;
        const snippetNameMap = this.snippetNameMap;
        const self = this;

        function wrapRegexp(src: string): string {
            if (src && !/^\^?\(.*\)\$?$|^\\b$/.test(src)) {
                src = "(?:" + src + ")";
            }

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

        function addSnippet(s: Snippet): void {
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
                if (!s.guard && /^\w/.test(s.tabTrigger)) {
                    s.guard = "\\b";
                }
                s.trigger = escapeRegExp(s.tabTrigger);
            }

            if (s.trigger && s.guard) {
                s.startRe = guardedRegexp(<string>s.trigger, s.guard, true);
                s.triggerRe = new RegExp(s.trigger, "");
            }

            if (s.endTrigger && s.endGuard) {
                s.endRe = guardedRegexp(s.endTrigger, s.endGuard, true);
                s.endTriggerRe = new RegExp(s.endTrigger, "");
            }
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
     *
     */
    unregister(snippets: Snippet[], scope?: string): void {
        const snippetMap = this.snippetMap;
        const snippetNameMap = this.snippetNameMap;

        function removeSnippet(s: Snippet) {
            const nameMap = snippetNameMap[<string>(s.scope || scope)];
            if (nameMap && nameMap[<string>s.name]) {
                delete nameMap[<string>s.name];
                const map = snippetMap[<string>(s.scope || scope)];
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
     *
     */
    public getSnippetByName(name: string, editor: Editor): Snippet | undefined {
        let snippet: Snippet | undefined;
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

function findMatchingSnippet(snippetList: Snippet[], before: string, after: string): Snippet | undefined {
    for (let i = snippetList.length; i--;) {
        const s = snippetList[i];
        if (s.startRe && !s.startRe.test(before))
            continue;
        if (s.endRe && !s.endRe.test(after))
            continue;
        if (!s.startRe && !s.endRe)
            continue;

        s.matchBefore = (s.startRe ? s.startRe.exec(before) : [""]) as RegExpExecArray | string[];
        s.matchAfter = (s.endRe ? s.endRe.exec(after) : [""]) as RegExpExecArray | string[];
        s.replaceBefore = s.triggerRe ? (<RegExpExecArray>s.triggerRe.exec(before))[0] : "";
        s.replaceAfter = s.endTriggerRe ? (<RegExpExecArray>s.endTriggerRe.exec(after))[0] : "";
        return s;
    }
    return void 0;
}
