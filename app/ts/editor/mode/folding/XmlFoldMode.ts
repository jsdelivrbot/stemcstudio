import { mixin } from "../../lib/oop";
import Range from "../../Range";
import FoldMode from "./FoldMode";
import Token from '../../Token';
import TokenIterator from "../../TokenIterator";
import EditSession from "../../EditSession";
import Position from "../../Position";

/**
 *
 */
export default class XmlFoldMode extends FoldMode {
    voidElements: { [name: string]: number };
    optionalEndTags: { [name: string]: number };
    /**
     *
     */
    constructor(voidElements: { [name: string]: number } = {}, optionalEndTags?: { [name: string]: number }) {
        super();
        this.voidElements = voidElements;
        this.optionalEndTags = mixin({}, this.voidElements);
        if (optionalEndTags) {
            mixin(this.optionalEndTags, optionalEndTags);
        }
    }

    /**
     * @param session
     * @param foldStyle
     * @param row
     */
    getFoldWidget(session: EditSession, foldStyle: string, row: number): string {
        const tag = this._getFirstTagInLine(session, row);

        if (!tag)
            return "";

        if (tag.closing || (!tag.tagName && tag.selfClosing))
            return foldStyle === "markbeginend" ? "end" : "";

        if (!tag.tagName || tag.selfClosing || this.voidElements.hasOwnProperty(tag.tagName.toLowerCase()))
            return "";

        if (this._findEndTagInLine(session, row, tag.tagName, tag.end.column))
            return "";

        return "start";
    }

    /*
     * returns a first tag (or a fragment) in a line
     */
    _getFirstTagInLine(session: EditSession, row: number): Tag {
        const tokens = session.getTokens(row);
        const tag = new Tag();

        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            if (is(token, "tag-open")) {
                tag.end.column = tag.start.column + token.value.length;
                tag.closing = is(token, "end-tag-open");
                token = tokens[++i];
                if (!token)
                    return null;
                tag.tagName = token.value;
                tag.end.column += token.value.length;
                for (i++; i < tokens.length; i++) {
                    token = tokens[i];
                    tag.end.column += token.value.length;
                    if (is(token, "tag-close")) {
                        tag.selfClosing = token.value === '/>';
                        break;
                    }
                }
                return tag;
            } else if (is(token, "tag-close")) {
                tag.selfClosing = token.value === '/>';
                return tag;
            }
            tag.start.column += token.value.length;
        }

        return null;
    }

    _findEndTagInLine(session: EditSession, row: number, tagName: string, startColumn: number): boolean {
        const tokens = session.getTokens(row);
        let column = 0;
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            column += token.value.length;
            if (column < startColumn)
                continue;
            if (is(token, "end-tag-open")) {
                token = tokens[i + 1];
                if (token && token.value === tagName)
                    return true;
            }
        }
        return false;
    }

    /*
     * reads a full tag and places the iterator after the tag
     */
    _readTagForward(iterator: TokenIterator): Tag {
        let token = iterator.getCurrentToken();
        if (!token)
            return null;

        const tag = new Tag();
        do {
            if (is(token, "tag-open")) {
                tag.closing = is(token, "end-tag-open");
                tag.start.row = iterator.getCurrentTokenRow();
                tag.start.column = iterator.getCurrentTokenColumn();
            }
            else if (is(token, "tag-name")) {
                tag.tagName = token.value;
            }
            else if (is(token, "tag-close")) {
                tag.selfClosing = token.value === "/>";
                tag.end.row = iterator.getCurrentTokenRow();
                tag.end.column = iterator.getCurrentTokenColumn() + token.value.length;
                iterator.stepForward();
                return tag;
            }
        } while (token = iterator.stepForward());

        return null;
    }

    _readTagBackward(iterator: TokenIterator): Tag {
        let token = iterator.getCurrentToken();
        if (!token)
            return null;

        const tag = new Tag();
        do {
            if (is(token, "tag-open")) {
                tag.closing = is(token, "end-tag-open");
                tag.start.row = iterator.getCurrentTokenRow();
                tag.start.column = iterator.getCurrentTokenColumn();
                iterator.stepBackward();
                return tag;
            }
            else if (is(token, "tag-name")) {
                tag.tagName = token.value;
            }
            else if (is(token, "tag-close")) {
                tag.selfClosing = token.value === "/>";
                tag.end.row = iterator.getCurrentTokenRow();
                tag.end.column = iterator.getCurrentTokenColumn() + token.value.length;
            }
        } while (token = iterator.stepBackward());

        return null;
    }

    private _pop(stack: Tag[], tag: Tag): Tag {
        while (stack.length) {

            const top = stack[stack.length - 1];
            if (!tag || top.tagName === tag.tagName) {
                return stack.pop();
            }
            else if (this.optionalEndTags.hasOwnProperty(tag.tagName)) {
                return null;
            }
            else if (this.optionalEndTags.hasOwnProperty(top.tagName)) {
                stack.pop();
                continue;
            }
            else {
                return null;
            }
        }
        return null;
    }

    getFoldWidgetRange(session: EditSession, foldStyle: string, row: number): Range {
        const firstTag = this._getFirstTagInLine(session, row);

        if (!firstTag) {
            return null;
        }

        const isBackward = firstTag.closing || firstTag.selfClosing;
        const stack: Tag[] = [];
        let tag: Tag;

        if (!isBackward) {
            const iterator = new TokenIterator(session, row, firstTag.start.column);
            const start = {
                row: row,
                column: firstTag.start.column + firstTag.tagName.length + 2
            };
            while (tag = this._readTagForward(iterator)) {
                if (tag.selfClosing) {
                    if (!stack.length) {
                        tag.start.column += tag.tagName.length + 2;
                        tag.end.column -= 2;
                        return Range.fromPoints(tag.start, tag.end);
                    } else
                        continue;
                }

                if (tag.closing) {
                    this._pop(stack, tag);
                    if (stack.length === 0)
                        return Range.fromPoints(start, tag.start);
                }
                else {
                    stack.push(tag);
                }
            }
        }
        else {
            const iterator = new TokenIterator(session, row, firstTag.end.column);
            const end = {
                row: row,
                column: firstTag.start.column
            };

            while (tag = this._readTagBackward(iterator)) {
                if (tag.selfClosing) {
                    if (!stack.length) {
                        tag.start.column += tag.tagName.length + 2;
                        tag.end.column -= 2;
                        return Range.fromPoints(tag.start, tag.end);
                    }
                    else {
                        continue;
                    }
                }

                if (!tag.closing) {
                    this._pop(stack, tag);
                    if (stack.length === 0) {
                        tag.start.column += tag.tagName.length + 2;
                        return Range.fromPoints(tag.start, end);
                    }
                }
                else {
                    stack.push(tag);
                }
            }
        }
        return void 0;
    }
}

export class Tag {
    tagName: string;
    closing: boolean;
    selfClosing: boolean;
    start: Position;
    end: Position;
    constructor() {
        this.tagName = "";
        this.closing = false;
        this.selfClosing = false;
        this.start = { row: 0, column: 0 };
        this.end = { row: 0, column: 0 };
    }
}

function is(token: Token, type: string): boolean {
    return token.type.lastIndexOf(type + ".xml") > -1;
}
