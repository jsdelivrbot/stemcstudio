import MwEditor from '../../synchronization/MwEditor';
import MwWorkspace from '../../synchronization/MwWorkspace';
import Workspace from '../workspace/Workspace';

export default class WorkspaceAdapter implements MwWorkspace {
    constructor(private workspace: Workspace) {
        // console.log("WorkspaceAdapter.constructor");
    }
    createEditor(): MwEditor {
        // const editor = this.workspace.getEditor(fileName)
        throw new Error("TODO: createEditor");
    }
    deleteEditor(editor: MwEditor): void {
        throw new Error("TODO: deleteEditor");
    }
}
