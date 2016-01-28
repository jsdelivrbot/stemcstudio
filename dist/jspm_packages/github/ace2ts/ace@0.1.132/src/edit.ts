import createDocument from './createDocument';
import createEditor from './createEditor';
import createEditSession from './createEditSession';
import createRenderer from './createRenderer';
import createUndoManager from './createUndoManager';
import Document from './Document';
import Editor from './Editor';
import EditSession from './EditSession';
import Renderer from './Renderer';

/**
 *
 */
export default function edit(container: HTMLElement): Editor {

    let text = "";
    if (container && /input|textarea/i.test(container.tagName)) {
        const oldNode = <HTMLInputElement>container;
        text = oldNode.value;
        container = container.ownerDocument.createElement('pre');
        oldNode.parentNode.replaceChild(container, oldNode);
    }
    else if (container) {
        text = container.innerHTML;
        container.innerHTML = "";
    }

    const doc: Document = createDocument(text);
    const session: EditSession = createEditSession(doc);
    const renderer: Renderer = createRenderer(container);
    const editor: Editor = createEditor(renderer, session);
    const undoManager = createUndoManager();
    editor.getSession().setUndoManager(undoManager);
    return editor;
}
