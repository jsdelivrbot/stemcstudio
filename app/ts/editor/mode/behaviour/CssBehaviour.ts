import { CstyleBehaviour } from "./CstyleBehaviour";
import { TokenIterator } from "../../TokenIterator";
import { Editor } from "../../Editor";
import { EditSession } from "../../EditSession";
import { Range } from "../../Range";
import { isMultiLine } from "../../RangeHelpers";

export class CssBehaviour extends CstyleBehaviour {
    constructor() {
        super();

        this.inherit(new CstyleBehaviour());

        this.add("colon", "insertion",
            function callback(this: void, state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] } | undefined {
                if (text === ':') {
                    const cursor = editor.getCursorPosition();
                    const iterator = new TokenIterator(session, cursor.row, cursor.column);
                    let token = iterator.getCurrentToken();
                    if (token && token.value.match(/\s+/)) {
                        token = iterator.stepBackward();
                    }
                    if (token && token.type === 'support.type') {
                        const line = session.docOrThrow().getLine(cursor.row);
                        const rightChar = line.substring(cursor.column, cursor.column + 1);
                        if (rightChar === ':') {
                            return {
                                text: '',
                                selection: [1, 1]
                            };
                        }
                        if (!line.substring(cursor.column).match(/^\s*;/)) {
                            return {
                                text: ':;',
                                selection: [1, 1]
                            };
                        }
                    }
                }
                return void 0;
            }
        );

        this.add("colon", "deletion",
            function callback(this: void, state: string, action: string, editor: Editor, session: EditSession, range: Range): Range | undefined {
                const selected = session.docOrThrow().getTextRange(range);
                if (!isMultiLine(range) && selected === ':') {
                    const cursor = editor.getCursorPosition();
                    const iterator = new TokenIterator(session, cursor.row, cursor.column);
                    let token = iterator.getCurrentToken();
                    if (token && token.value.match(/\s+/)) {
                        token = iterator.stepBackward();
                    }
                    if (token && token.type === 'support.type') {
                        const line = session.docOrThrow().getLine(range.start.row);
                        const rightChar = line.substring(range.end.column, range.end.column + 1);
                        if (rightChar === ';') {
                            range.end.column++;
                            return range;
                        }
                    }
                }
                return void 0;
            }
        );

        this.add("semicolon", "insertion",
            function callback(this: void, state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] } | undefined {
                if (text === ';') {
                    const cursor = editor.getCursorPosition();
                    const line = session.docOrThrow().getLine(cursor.row);
                    const rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar === ';') {
                        return {
                            text: '',
                            selection: [1, 1]
                        };
                    }
                }
                return void 0;
            }
        );
    }
}
