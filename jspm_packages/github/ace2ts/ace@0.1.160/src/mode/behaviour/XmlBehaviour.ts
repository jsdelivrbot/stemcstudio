import Behaviour from "../Behaviour";
import TokenIterator from "../../TokenIterator";
import Editor from "../../Editor";
import EditSession from "../../EditSession";
import Range from "../../Range";
import Token from "../../Token";

function is(token: Token, type: string): boolean {
    return token.type.lastIndexOf(type + ".xml") > -1;
}

/**
 * @class XmlBehaviour
 * @extends Behaviour
 */
export default class XmlBehaviour extends Behaviour {

    /**
     * @class XmlBehaviour
     * @constructor
     */
    constructor() {
        super();

        this.add("string_dquotes", "insertion", function(state: string, action: string, editor: Editor, session: EditSession, text: string): { text: string; selection: number[] } {
            if (text === '"' || text === "'") {
                var quote = text;
                var selected = session.doc.getTextRange(editor.getSelectionRange());
                if (selected !== "" && selected !== "'" && selected !== '"' && editor.getWrapBehavioursEnabled()) {
                    return {
                        text: quote + selected + quote,
                        selection: void 0
                    };
                }

                var cursor = editor.getCursorPosition();
                var line = session.doc.getLine(cursor.row);
                var rightChar = line.substring(cursor.column, cursor.column + 1);
                var iterator = new TokenIterator(session, cursor.row, cursor.column);
                var token = iterator.getCurrentToken();

                if (rightChar === quote && (is(token, "attribute-value") || is(token, "string"))) {
                    // Ignore input and move right one if we're typing over the closing quote.
                    return {
                        text: "",
                        selection: [1, 1]
                    };
                }

                if (!token)
                    token = iterator.stepBackward();

                if (!token)
                    return;

                while (is(token, "tag-whitespace") || is(token, "whitespace")) {
                    token = iterator.stepBackward();
                }
                var rightSpace = !rightChar || rightChar.match(/\s/);
                if (is(token, "attribute-equals") && (rightSpace || rightChar === '>') || (is(token, "decl-attribute-equals") && (rightSpace || rightChar === '?'))) {
                    return {
                        text: quote + quote,
                        selection: [1, 1]
                    };
                }
            }
        });

        this.add("string_dquotes", "deletion", function(state: string, action: string, editor: Editor, session: EditSession, range: Range): Range {
            const selected: string = session.doc.getTextRange(range);
            if (!range.isMultiLine() && (selected === '"' || selected === "'")) {
                const line = session.doc.getLine(range.start.row);
                const rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                if (rightChar === selected) {
                    range.end.column++;
                    return range;
                }
            }
        });

        this.add("autoclosing", "insertion", function(state: string, action: string, editor: Editor, session: EditSession, text: string) {
            if (text === '>') {
                const position = editor.getCursorPosition();
                const iterator = new TokenIterator(session, position.row, position.column);
                let token = iterator.getCurrentToken() || iterator.stepBackward();

                // exit if we're not in a tag
                if (!token || !(is(token, "tag-name") || is(token, "tag-whitespace") || is(token, "attribute-name") || is(token, "attribute-equals") || is(token, "attribute-value")))
                    return;

                // exit if we're inside of a quoted attribute value
                if (is(token, "reference.attribute-value"))
                    return;
                if (is(token, "attribute-value")) {
                    const firstChar = token.value.charAt(0);
                    if (firstChar === '"' || firstChar === "'") {
                        const lastChar = token.value.charAt(token.value.length - 1);
                        const tokenEnd = iterator.getCurrentTokenColumn() + token.value.length;
                        if (tokenEnd > position.column || tokenEnd === position.column && firstChar !== lastChar)
                            return;
                    }
                }

                // find tag name
                while (!is(token, "tag-name")) {
                    token = iterator.stepBackward();
                }

                const tokenRow = iterator.getCurrentTokenRow();
                const tokenColumn = iterator.getCurrentTokenColumn();

                // exit if the tag is ending
                if (is(iterator.stepBackward(), "end-tag-open"))
                    return;

                let element = token.value;
                if (tokenRow === position.row)
                    element = element.substring(0, position.column - tokenColumn);

                // this refers to the LanguageMode, so we have a bit of a technical problem here.
                if (this.voidElements.hasOwnProperty(element.toLowerCase()))
                    return;

                return {
                    text: '>' + '</' + element + '>',
                    selection: [1, 1]
                };
            }
        });

        this.add('autoindent', 'insertion', function(state: string, action, editor: Editor, session: EditSession, text: string) {
            if (text === "\n") {
                const cursor = editor.getCursorPosition();
                const line = session.getLine(cursor.row);
                const rightChars = line.substring(cursor.column, cursor.column + 2);
                if (rightChars === '</') {
                    const next_indent = this.$getIndent(line);
                    const indent = next_indent + session.getTabString();
                    return {
                        text: '\n' + indent + '\n' + next_indent,
                        selection: [1, indent.length, 1, indent.length]
                    };
                }
            }
        });
    }
}
