import MwEditor from '../../modules/synchronization/MwEditor';
import MwWorkspace from '../../modules/synchronization/MwWorkspace';
import Workspace from '../workspace/Workspace';

export default class WorkspaceAdapter implements MwWorkspace {
    constructor(workspace: Workspace) {
        // console.log("WorkspaceAdapter.constructor");
    }
    createEditor(): MwEditor {
        throw new Error("TODO: createEditor");
    }
    deleteEditor(editor: MwEditor): void {
        throw new Error("TODO: deleteEditor");
    }
}
