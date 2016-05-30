import Editor from './Editor';
import EditSession from './EditSession';
import Renderer from './Renderer';

export default function createEditor(renderer: Renderer, session: EditSession): Editor {
    return new Editor(renderer, session);
}
