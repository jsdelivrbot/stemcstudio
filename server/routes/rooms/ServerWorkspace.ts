import MwEditor from '../../synchronization/MwEditor';
import MwWorkspace from '../../synchronization/MwWorkspace';
import ServerEditor from './ServerEditor';

export default class ServerWorkspace implements MwWorkspace {
    createEditor(): MwEditor {
        return new ServerEditor();
    }
    deleteEditor(editor: MwEditor) {
        // Ignore.
    }
}
