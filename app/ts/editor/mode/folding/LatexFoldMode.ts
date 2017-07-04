import { Range } from "../../Range";
import { FoldMode } from "./FoldMode";
import { EditSession } from "../../EditSession";
import { FoldStyle } from "../../FoldStyle";
import { HighlighterToken } from "../Highlighter";
import { TokenIterator } from '../../TokenIterator';

/**
 *
 */
export class LatexFoldMode extends FoldMode {
    constructor() {
        super();
        this.foldingStartMarker = /^\s*\\(begin)|(section|subsection|paragraph)\b|{\s*$/;
        this.foldingStopMarker = /^\s*\\(end)\b|^\s*}/;
    }
    getFoldWidgetRange(session: EditSession, foldStyle: FoldStyle, row: number): Range | undefined {
        const line = session.docOrThrow().getLine(row);
        let match = (this.foldingStartMarker as RegExp).exec(line);
        if (match) {
            if (match[1])
                return this.latexBlock(session, row, match[0].length - 1);
            if (match[2])
                return this.latexSection(session, row, match[0].length - 1);

            return this.openingBracketBlock(session, "{", row, match.index);
        }

        match = (this.foldingStopMarker as RegExp).exec(line);
        if (match) {
            if (match[1])
                return this.latexBlock(session, row, match[0].length - 1);

            return this.closingBracketBlock(session, "}", row, match.index + match[0].length);
        }
        return void 0;
    }

    latexBlock(session: EditSession, row: number, column: number): Range | undefined {
        const keywords = {
            "\\begin": 1,
            "\\end": -1
        };

        const stream = new TokenIterator(session, row, column);
        let token = stream.getCurrentToken();
        if (!token || !(token.type === "storage.type" || token.type === "constant.character.escape")) {
            return void 0;
        }

        const val = token.value;
        const dir = keywords[val];

        const getType = function () {
            const token = stream.stepForward();
            if (token) {
                const type = token.type === "lparen" ? (stream.stepForward() as HighlighterToken).value : "";
                if (dir === -1) {
                    stream.stepBackward();
                    if (type)
                        stream.stepBackward();
                }
                return type;
            }
            else {
                return void 0;
            }
        };
        const stack = [getType()];
        const startColumn = dir === -1 ? stream.getCurrentTokenColumn() : session.getLine(row).length;
        const startRow = row;

        while (token = (dir === -1 ? stream.stepBackward() : stream.stepForward())) {
            if (!token || !(token.type === "storage.type" || token.type === "constant.character.escape")) {
                continue;
            }
            const level = keywords[token.value];
            if (!level) {
                continue;
            }
            const type = getType();
            if (level === dir) {
                stack.unshift(type);
            }
            else if (stack.shift() !== type || !stack.length) {
                break;
            }
        }

        if (stack.length) {
            return void 0;
        }

        row = stream.getCurrentTokenRow();
        if (dir === -1) {
            return new Range(row, session.getLine(row).length, startRow, startColumn);
        }
        stream.stepBackward();
        return new Range(startRow, startColumn, row, stream.getCurrentTokenColumn());
    }

    latexSection(session: EditSession, row: number, column: number): Range | undefined {
        const keywords = ["\\subsection", "\\section", "\\begin", "\\end", "\\paragraph"];

        const stream = new TokenIterator(session, row, column);
        let token = stream.getCurrentToken();
        if (!token || token.type !== "storage.type")
            return void 0;

        const startLevel = keywords.indexOf(token.value);
        let stackDepth = 0;
        let endRow = row;

        while (token = stream.stepForward()) {
            if (token.type !== "storage.type") {
                continue;
            }
            const level = keywords.indexOf(token.value);

            if (level >= 2) {
                if (!stackDepth)
                    endRow = stream.getCurrentTokenRow() - 1;
                stackDepth += level === 2 ? 1 : - 1;
                if (stackDepth < 0) {
                    break;
                }
            } else if (level >= startLevel)
                break;
        }

        if (!stackDepth)
            endRow = stream.getCurrentTokenRow() - 1;

        while (endRow > row && !/\S/.test(session.getLine(endRow)))
            endRow--;

        return new Range(
            row, session.getLine(row).length,
            endRow, session.getLine(endRow).length
        );
    }
}
