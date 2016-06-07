import UndoManager from './UndoManager';
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

    const doc: Document = new Document(text);
    const session: EditSession = new EditSession(doc);
    const renderer: Renderer = new Renderer(container);
    const editor: Editor = new Editor(renderer, session);
    const undoManager = new UndoManager();
    editor.getSession().setUndoManager(undoManager);
    return editor;
}
