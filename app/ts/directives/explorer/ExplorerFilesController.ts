// import * as uib from 'angular-bootstrap';
import ExplorerFilesScope from './ExplorerFilesScope';
import ModalDialog from '../../services/modalService/ModalDialog';
import AlertOptions from '../../services/modalService/AlertOptions';
import ConfirmOptions from '../../services/modalService/ConfirmOptions';
import PromptOptions from '../../services/modalService/PromptOptions';
import WsFile from '../../wsmodel/services/WsFile';
import WsModel from '../../wsmodel/services/WsModel';

export default class ExplorerFilesController {

    public static $inject: string[] = ['$scope', 'modalDialog', 'wsModel'];

    constructor($scope: ExplorerFilesScope, private modalService: ModalDialog, private wsModel: WsModel) {
        // Define the context menu used by the files.
        $scope.menu = (path: string, file: WsFile) => {
            return [
                { label: file.isOpen ? "Close" : "Open", action: () => { file.isOpen ? this.closeFile(path) : this.openFile(path); } },
                null,   // divider
                { label: "Rename", action: () => { this.renameFile(path); } },
                { label: "Delete", action: () => { this.deleteFile(path); } },
            ];
        };
    }

    public newFile(): void {
        const options: PromptOptions = {
            title: 'New File',
            text: '',
            placeholder: "name.extension",
            actionButtonText: 'Create File',
            message: "Enter the name of the new file."
        };
        this.modalService.prompt(options)
            .then((path) => {
                try {
                    this.wsModel.newFile(path);
                    this.wsModel.selectFile(path);
                    this.wsModel.updateStorage();
                }
                catch (e) {
                    const alertOptions: AlertOptions = { title: "Error", message: e.toString() };
                    this.modalService.alert(alertOptions);
                }
            })
            .catch(function(reason: any) {
                // Do nothing.
            });
    }

    public openFile(path: string): void {
        this.wsModel.openFile(path);
        this.wsModel.selectFile(path);
        this.wsModel.updateStorage();
    }

    public closeFile(path: string): void {
        this.wsModel.closeFile(path);
        this.wsModel.updateStorage();
    }

    public renameFile(oldName: string): void {
        const options: PromptOptions = {
            title: `Rename '${oldName}'`,
            text: oldName,
            placeholder: "name.extension",
            actionButtonText: 'Rename File',
            message: "Enter the new name of the file."
        };
        this.modalService.prompt(options)
            .then((newName) => {
                try {
                    this.wsModel.renameFile(oldName, newName);
                    this.wsModel.updateStorage();
                }
                catch (e) {
                    this.modalService.alert({ title: "Error", message: e.toString() });
                }
            })
            .catch(function(reason: any) {
                // Do nothing.
            });
    }

    public deleteFile(path: string): void {
        const options: ConfirmOptions = {
            title: `Delete '${path}'`,
            message: `Are you sure you want to delete '${path}'?`,
            actionButtonText: 'Delete File'
        };
        this.modalService.confirm(options)
            .then((result) => {
                this.wsModel.deleteFile(path, (reason: Error) => {
                    // This has already been done.
                    // this.wsModel.updateStorage();
                });
            })
            .catch(function(reason) {
                // Do nothing.
            });
    }
}
