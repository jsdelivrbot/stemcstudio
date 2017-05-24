import { Behaviour } from "../Behaviour";
import { BehaviorCallbackThis } from '../../BehaviourCallback';
import { TokenIterator } from "../../TokenIterator";
import { stringRepeat } from "../../lib/lang";
import { Editor } from "../../Editor";
import { EditSession } from "../../EditSession";
import { Position } from "../../Position";
import { Range } from "../../Range";
import { Token } from "../../Token";
import { isMultiLine } from "../../RangeHelpers";

const SAFE_INSERT_IN_TOKENS =
    ["text", "paren.rparen", "punctuation.operator"];
const SAFE_INSERT_BEFORE_TOKENS =
    ["text", "paren.rparen", "punctuation.operator", "comment"];

interface BehaviourContext {
    autoInsertedBrackets: number;
    autoInsertedRow: number;
    autoInsertedLineEnd: string;
    maybeInsertedBrackets: number;
    maybeInsertedRow: number;
    maybeInsertedLineStart: string;
    maybeInsertedLineEnd: string;
}

let context: BehaviourContext;
let contextCache: { rangeCount?: number } = {};
const initContext = function (editor: Editor): void {
    let id = -1;
    // FIXME: multiSelect looks like a kind of Selection.
    // rangeCount is a property of Selection.
    if (editor.multiSelect) {
        id = editor.selectionOrThrow()['id'];
        if (contextCache.rangeCount !== editor.multiSelect.rangeCount) {
            contextCache = { rangeCount: editor.multiSelect.rangeCount };
        }
    }
    if (contextCache[id]) {
        return context = contextCache[id];
    }
    context = contextCache[id] = {
        autoInsertedBrackets: 0,
        autoInsertedRow: -1,
        autoInsertedLineEnd: "",
        maybeInsertedBrackets: 0,
        maybeInsertedRow: -1,
        maybeInsertedLineStart: "",
        maybeInsertedLineEnd: ""
    };
};

/**
 *
 */
export class CstyleBehaviour extends Behaviour {

    /**
     *
     */
    constructor() {
        super();
        this.add("braces", "insertion",
            function (this: BehaviorCallbackThis, state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] | undefined } | null | undefined {
                const cursor = editor.getCursorPosition();
                const doc = session.docOrThrow();
                const line = doc.getLine(cursor.row);
                if (text === '{') {
                    initContext(editor);
                    const selection = editor.getSelectionRange();
                    const selected = doc.getTextRange(selection);
                    if (selected !== "" && selected !== "{" && editor.getWrapBehavioursEnabled()) {
                        return {
                            text: '{' + selected + '}',
                            selection: void 0
                        };
                    }
                    else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                        if (/[\]\}\)]/.test(line[cursor.column]) || editor.inMultiSelectMode) {
                            CstyleBehaviour.recordAutoInsert(editor, session, "}");
                            return {
                                text: '{}',
                                selection: [1, 1]
                            };
                        }
                        else {
                            CstyleBehaviour.recordMaybeInsert(editor, session, "{");
                            return {
                                text: '{',
                                selection: [1, 1]
                            };
                        }
                    }
                }
                else if (text === '}') {
                    initContext(editor);
                    const rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar === '}') {
                        const matching = session.findOpeningBracket('}', { column: cursor.column + 1, row: cursor.row });
                        if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                            CstyleBehaviour.popAutoInsertedClosing();
                            return { text: '', selection: [1, 1] };
                        }
                    }
                }
                else if (text === "\n" || text === "\r\n") {
                    initContext(editor);
                    let closing = "";
                    if (CstyleBehaviour.isMaybeInsertedClosing(cursor, line)) {
                        closing = stringRepeat("}", context.maybeInsertedBrackets);
                        CstyleBehaviour.clearMaybeInsertedClosing();
                    }
                    const rightChar = line.substring(cursor.column, cursor.column + 1);
                    let next_indent: string;
                    if (rightChar === '}') {
                        const openBracePos = session.findMatchingBracket({ row: cursor.row, column: cursor.column + 1 }, '}');
                        if (!openBracePos)
                            return null;
                        next_indent = this.$getIndent(session.getLine(openBracePos.row));
                    }
                    else if (closing) {
                        next_indent = this.$getIndent(line);
                    }
                    else {
                        CstyleBehaviour.clearMaybeInsertedClosing();
                        return void 0;
                    }
                    const indent = next_indent + session.getTabString();

                    return {
                        text: '\n' + indent + '\n' + next_indent + closing,
                        selection: [1, indent.length, 1, indent.length]
                    };
                }
                else {
                    CstyleBehaviour.clearMaybeInsertedClosing();
                }
                return void 0;
            }
        );

        this.add("braces", "deletion",
            function callback(this: void, state: string, action: string, editor: Editor, session: EditSession, range: Range): Range | undefined {
                const doc = session.docOrThrow();
                const selected: string = doc.getTextRange(range);
                if (!isMultiLine(range) && selected === '{') {
                    initContext(editor);
                    const line = doc.getLine(range.start.row);
                    const rightChar = line.substring(range.end.column, range.end.column + 1);
                    if (rightChar === '}') {
                        range.end.column++;
                        return range;
                    }
                    else {
                        context.maybeInsertedBrackets--;
                    }
                }
                return void 0;
            }
        );

        this.add("parens", "insertion",
            function callback(this: void, state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] | undefined } | undefined {
                if (text === '(') {
                    initContext(editor);
                    const selectionRange = editor.getSelectionRange();
                    const doc = session.docOrThrow();
                    const selected: string = doc.getTextRange(selectionRange);
                    if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                        return { text: '(' + selected + ')', selection: void 0 };
                    }
                    else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                        CstyleBehaviour.recordAutoInsert(editor, session, ")");
                        return { text: '()', selection: [1, 1] };
                    }
                }
                else if (text === ')') {
                    initContext(editor);
                    const cursor = editor.getCursorPosition();
                    const doc = session.docOrThrow();
                    const line = doc.getLine(cursor.row);
                    const rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar === ')') {
                        const matching = session.findOpeningBracket(')', { column: cursor.column + 1, row: cursor.row });
                        if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                            CstyleBehaviour.popAutoInsertedClosing();
                            return { text: '', selection: [1, 1] };
                        }
                    }
                }
                return void 0;
            }
        );

        this.add("parens", "deletion",
            function callback(this: void, state: string, action: string, editor: Editor, session: EditSession, range: Range): Range | undefined {
                const selected: string = session.docOrThrow().getTextRange(range);
                if (!isMultiLine(range) && selected === '(') {
                    initContext(editor);
                    const doc = session.docOrThrow();
                    const line = doc.getLine(range.start.row);
                    const rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                    if (rightChar === ')') {
                        range.end.column++;
                        return range;
                    }
                }
                return void 0;
            }
        );

        this.add("brackets", "insertion",
            function (this: void, state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] | undefined } | undefined {
                if (text === '[') {
                    initContext(editor);
                    const selectionRange = editor.getSelectionRange();
                    const doc = session.docOrThrow();
                    const selected: string = doc.getTextRange(selectionRange);
                    if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                        return { text: '[' + selected + ']', selection: void 0 };
                    }
                    else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                        CstyleBehaviour.recordAutoInsert(editor, session, "]");
                        return { text: '[]', selection: [1, 1] };
                    }
                }
                else if (text === ']') {
                    initContext(editor);
                    const cursor = editor.getCursorPosition();
                    const doc = session.docOrThrow();
                    const line = doc.getLine(cursor.row);
                    const rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar === ']') {
                        const matching = session.findOpeningBracket(']', { column: cursor.column + 1, row: cursor.row });
                        if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                            CstyleBehaviour.popAutoInsertedClosing();
                            return { text: '', selection: [1, 1] };
                        }
                    }
                }
                return void 0;
            }
        );

        this.add("brackets", "deletion",
            function callback(this: void, state: string, action: string, editor: Editor, session: EditSession, range: Range): Range | undefined {
                const doc = session.docOrThrow();
                const selected: string = doc.getTextRange(range);
                if (!isMultiLine(range) && selected === '[') {
                    initContext(editor);
                    const line = session.docOrThrow().getLine(range.start.row);
                    const rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                    if (rightChar === ']') {
                        range.end.column++;
                        return range;
                    }
                }
                return void 0;
            }
        );

        this.add("string_dquotes", "insertion",
            function callback(this: void, state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] | undefined } | null | undefined {
                if (text === '"' || text === "'") {
                    initContext(editor);
                    const quote = text;
                    const selection = editor.getSelectionRange();
                    const doc = session.docOrThrow();
                    const selected = doc.getTextRange(selection);
                    if (selected !== "" && selected !== "'" && selected !== '"' && editor.getWrapBehavioursEnabled()) {
                        return { text: quote + selected + quote, selection: void 0 };
                    }
                    else {
                        const cursor = editor.getCursorPosition();
                        const line = session.docOrThrow().getLine(cursor.row);
                        const leftChar = line.substring(cursor.column - 1, cursor.column);

                        // We're escaped.
                        if (leftChar === '\\') {
                            return null;
                        }

                        // Find what token we're inside.
                        const tokens: Token[] = session.getTokens(selection.start.row);
                        let col = 0;
                        let token: Token | undefined;
                        let quotepos = -1; // Track whether we're inside an open quote.

                        for (let x = 0; x < tokens.length; x++) {
                            token = tokens[x];
                            if (token.type === "string") {
                                quotepos = -1;
                            }
                            else if (quotepos < 0) {
                                quotepos = token.value.indexOf(quote);
                            }
                            if ((token.value.length + col) > selection.start.column) {
                                break;
                            }
                            col += tokens[x].value.length;
                        }

                        // Try and be smart about when we auto insert.
                        if (!token || (quotepos < 0 && token.type !== "comment" && (token.type !== "string" || ((selection.start.column !== token.value.length + col - 1) && token.value.lastIndexOf(quote) === token.value.length - 1)))) {
                            if (!CstyleBehaviour.isSaneInsertion(editor, session)) {
                                return void 0;
                            }
                            return { text: quote + quote, selection: [1, 1] };
                        }
                        else if (token && token.type === "string") {
                            // Ignore input and move right one if we're typing over the closing quote.
                            const rightChar = line.substring(cursor.column, cursor.column + 1);
                            if (rightChar === quote) {
                                return { text: '', selection: [1, 1] };
                            }
                        }
                    }
                }
                return void 0;
            }
        );

        this.add("string_dquotes", "deletion",
            function callback(this: void, state: string, action: string, editor: Editor, session: EditSession, range: Range): Range | undefined {
                const doc = session.docOrThrow();
                const selected: string = doc.getTextRange(range);
                if (!isMultiLine(range) && (selected === '"' || selected === "'")) {
                    initContext(editor);
                    const line = session.docOrThrow().getLine(range.start.row);
                    const rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                    if (rightChar === selected) {
                        range.end.column++;
                        return range;
                    }
                }
                return void 0;
            }
        );
    }
    static isSaneInsertion(editor: Editor, session: EditSession): boolean {
        const cursor = editor.getCursorPosition();
        const iterator = new TokenIterator(session, cursor.row, cursor.column);

        // Don't insert in the middle of a keyword/identifier/lexical.
        if (!this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
            // Look ahead in case we're at the end of a token.
            const iterator2 = new TokenIterator(session, cursor.row, cursor.column + 1);
            if (!this.$matchTokenType(iterator2.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
                return false;
            }
        }

        // Only insert in front of whitespace/comments.
        iterator.stepForward();
        return iterator.getCurrentTokenRow() !== cursor.row ||
            this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_BEFORE_TOKENS);
    }

    static $matchTokenType(token: Token | string, types: string[]): boolean {
        if (typeof token === 'string') {
            return types.indexOf(token) > -1;
        }
        else {
            return types.indexOf(token.type) > -1;
        }
    }

    static recordAutoInsert(editor: Editor, session: EditSession, bracket: string): void {
        const cursor = editor.getCursorPosition();
        const doc = session.docOrThrow();
        const line = doc.getLine(cursor.row);
        // Reset previous state if text or context changed too much.
        if (!this.isAutoInsertedClosing(cursor, line, context.autoInsertedLineEnd[0])) {
            context.autoInsertedBrackets = 0;
        }
        context.autoInsertedRow = cursor.row;
        context.autoInsertedLineEnd = bracket + line.substr(cursor.column);
        context.autoInsertedBrackets++;
    }

    static recordMaybeInsert(editor: Editor, session: EditSession, bracket: string): void {
        const cursor = editor.getCursorPosition();
        const doc = session.docOrThrow();
        const line = doc.getLine(cursor.row);
        if (!this.isMaybeInsertedClosing(cursor, line)) {
            context.maybeInsertedBrackets = 0;
        }
        context.maybeInsertedRow = cursor.row;
        context.maybeInsertedLineStart = line.substr(0, cursor.column) + bracket;
        context.maybeInsertedLineEnd = line.substr(cursor.column);
        context.maybeInsertedBrackets++;
    }

    static isAutoInsertedClosing(cursor: Position, line: string, bracket: string): boolean {
        return context.autoInsertedBrackets > 0 &&
            cursor.row === context.autoInsertedRow &&
            bracket === context.autoInsertedLineEnd[0] &&
            line.substr(cursor.column) === context.autoInsertedLineEnd;
    }

    static isMaybeInsertedClosing(cursor: Position, line: string): boolean {
        return context.maybeInsertedBrackets > 0 &&
            cursor.row === context.maybeInsertedRow &&
            line.substr(cursor.column) === context.maybeInsertedLineEnd &&
            line.substr(0, cursor.column) === context.maybeInsertedLineStart;
    }

    static popAutoInsertedClosing(): void {
        context.autoInsertedLineEnd = context.autoInsertedLineEnd.substr(1);
        context.autoInsertedBrackets--;
    }

    static clearMaybeInsertedClosing(): void {
        if (context) {
            context.maybeInsertedBrackets = 0;
            context.maybeInsertedRow = -1;
        }
    }
}

