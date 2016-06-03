import Workspace from './Workspace';

interface WorkspaceFactory {
    /**
     * The callback is only returned when the thread of the workspace has been initialized.
     */
    createWorkspace(callback: (err: any, workspace: Workspace) => any): void;
}

export default WorkspaceFactory;
