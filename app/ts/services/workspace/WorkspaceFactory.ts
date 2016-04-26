import Workspace from './Workspace';

interface WorkspaceFactory {
    createWorkspace(): Workspace;
}

export default WorkspaceFactory;
