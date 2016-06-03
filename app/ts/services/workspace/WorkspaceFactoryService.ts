import WorkspaceFactory from './WorkspaceFactory';
import Workspace from './Workspace';
import WorkspaceService from './WorkspaceService';

export default class WorkspaceFactoryService implements WorkspaceFactory {
    public static $inject: string[] = ['$q'];
    constructor(private $q: ng.IQService) {
        // Do nothing.
    }
    public createWorkspace(callback: (err: any, workspace: Workspace) => any): void {
        const workspace = new WorkspaceService(this.$q);
        workspace.initialize(function(err: any) {
            if (!err) {
                callback(void 0, workspace);
            }
            else {
                callback(err, void 0);
            }
        });
    }
}
