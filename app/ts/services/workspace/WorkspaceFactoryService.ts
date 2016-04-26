import WorkspaceFactory from './WorkspaceFactory';
import Workspace from './Workspace'
import WorkspaceService from './WorkspaceService'

export default class WorkspaceFactoryService implements WorkspaceFactory {
    public static $inject: string[] = ['$q'];
    constructor(private $q: ng.IQService) {

    }
    public createWorkspace(): Workspace {
        const workspace = new WorkspaceService(this.$q)
        workspace.initialize()
        return workspace;
    }
}
