import { Behaviour } from '../Behaviour';
import { CstyleBehaviour } from './CstyleBehaviour';
import { XmlBehaviour } from "../behaviour/XmlBehaviour";
import { TokenIterator } from "../../TokenIterator";
import { Editor } from "../../Editor";
import { EditSession } from "../../EditSession";

function hasType(token: { type: string }, type: string) {
    let hasType = true;
    const typeList = token.type.split('.');
    const needleList = type.split('.');
    needleList.forEach(function (needle) {
        if (typeList.indexOf(needle) === -1) {
            hasType = false;
            return false;
        }
    });
    return hasType;
}

export class XQueryBehaviour extends Behaviour {
    constructor() {
        super();
        this.inherit(new CstyleBehaviour(), ["braces", "parens", "string_dquotes"]);
        this.inherit(new XmlBehaviour());

        this.add("autoclosing", "insertion", function (state: string, action, editor: Editor, session: EditSession, text: string) {
            if (text === '>') {
                const position = editor.getCursorPosition();
                const iterator = new TokenIterator(session, position.row, position.column);
                let token = iterator.getCurrentToken();
                let atCursor = false;
                const stateStr: string = JSON.parse(state).pop();
                if ((token && token.value === '>') || stateStr !== "StartTag") return;
                if (!token || !hasType(token, 'meta.tag') && !(hasType(token, 'text') && token.value.match('/'))) {
                    do {
                        token = iterator.stepBackward();
                    } while (token && (hasType(token, 'string') || hasType(token, 'keyword.operator') || hasType(token, 'entity.attribute-name') || hasType(token, 'text')));
                } else {
                    atCursor = true;
                }
                const previous = iterator.stepBackward();
                if (!token || !hasType(token, 'meta.tag') || (previous !== null && previous.value.match('/'))) {
                    return;
                }
                let tag = token.value.substring(1);
                if (atCursor) {
                    // TODO: Some work to do here on the type-safety of tokens.
                    tag = tag.substring(0, position.column - token['start']);
                }

                return {
                    text: '>' + '</' + tag + '>',
                    selection: [1, 1]
                };
            }
        });
    }
}
