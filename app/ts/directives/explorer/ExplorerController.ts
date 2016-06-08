import IExplorer from './IExplorer';
import WsModel from '../../wsmodel/services/WsModel';

export default class ExplorerController implements IExplorer {

    public static $inject: string[] = ['wsModel'];

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
