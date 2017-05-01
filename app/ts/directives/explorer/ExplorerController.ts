import IExplorer from './IExplorer';
import { WsModel } from '../../modules/wsmodel/WsModel';
import { WORKSPACE_MODEL_UUID } from '../../modules/wsmodel/IWorkspaceModel';

export default class ExplorerController implements IExplorer {

    public static $inject: string[] = [WORKSPACE_MODEL_UUID];

    constructor(private wsModel: WsModel) {
        // Do nothing
    }

    $onInit(): void {
        // Do nothing
    }

    $onDestroy(): void {
        // Do nothing
    }

    openFile(path: string): void {
        this.wsModel.openFile(path);
        this.wsModel.selectFile(path);
    }

    closeFile(path: string): void {
        this.wsModel.closeFile(path);
    }

    selectFile(path: string): void {
        this.wsModel.selectFile(path);
    }
}
