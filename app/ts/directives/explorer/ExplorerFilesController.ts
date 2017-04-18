import ExplorerFilesScope from './ExplorerFilesScope';
import ModalDialog from '../../services/modalService/ModalDialog';
import AlertOptions from '../../services/modalService/AlertOptions';
import ConfirmOptions from '../../services/modalService/ConfirmOptions';
import PromptOptions from '../../services/modalService/PromptOptions';
import WsFile from '../../modules/wsmodel/WsFile';
import WsModel from '../../modules/wsmodel/WsModel';
import { WORKSPACE_MODEL_UUID } from '../../modules/wsmodel/IWorkspaceModel';

/**
 * This controller is mostly used to define and manage the context menu for the files in the explorer.
 * It also handles a request to create a new file.
 */
export default class ExplorerFilesController {

    public static $inject: string[] = ['$scope', 'modalDialog', WORKSPACE_MODEL_UUID];

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

    /**
     * Handler for the "New File" button.
     */
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
                    this.wsModel.beginDocumentMonitoring(path, (monitoringError) => {
                        if (!monitoringError) {
                            this.wsModel.openFile(path);
                            this.wsModel.selectFile(path);
                            this.wsModel.updateStorage();
                        }
                        else {
                            const alertOptions: AlertOptions = { title: "Error", message: `${monitoringError}` };
                            this.modalService.alert(alertOptions);
                        }
                    });
                }
                catch (e) {
                    const alertOptions: AlertOptions = { title: "Error", message: e.toString() };
                    this.modalService.alert(alertOptions);
                }
            })
            .catch(function (reason: any) {
                // Do nothing.
            });
    }

    /**
     * Handler for the context menu "Open" menu item.
     */
    public openFile(path: string): void {
        this.wsModel.openFile(path);
        this.wsModel.selectFile(path);
        this.wsModel.updateStorage();
    }

    /**
     * Handler for the context menu "Close" menu item.
     */
    public closeFile(path: string): void {
        this.wsModel.closeFile(path);
        this.wsModel.updateStorage();
    }

    /**
     * Handler for the context menu "Rename" menu item.
     */
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
                    this.wsModel.endDocumentMonitoring(oldName, (endMonitoringError) => {
                        if (!endMonitoringError) {
                            this.wsModel.renameFileUnmonitored(oldName, newName);
                            this.wsModel.beginDocumentMonitoring(newName, (beginMonitoringError) => {
                                if (!beginMonitoringError) {
                                    this.wsModel.updateStorage();
                                }
                                else {
                                    this.modalService.alert({ title: "Error", message: `${beginMonitoringError}` });
                                }
                            });
                        }
                        else {
                            this.modalService.alert({ title: "Error", message: `${endMonitoringError}` });
                        }
                    });
                }
                catch (e) {
                    this.modalService.alert({ title: "Error", message: e.toString() });
                }
            })
            .catch(function (reason: any) {
                // Do nothing.
            });
    }

    /**
     * Handler for the context menu "Delete" menu item.
     */
    public deleteFile(path: string): void {
        const options: ConfirmOptions = {
            title: `Delete '${path}'`,
            message: `Are you sure you want to delete '${path}'?`,
            actionButtonText: 'Delete File'
        };
        this.modalService.confirm(options)
            .then((result) => {
                this.wsModel.deleteFile(path, true)
                    .then(() => {
                        // Do nothing.
                        // This has already been done.
                        // this.wsModel.updateStorage();
                    })
                    .catch((reason) => {
                        console.warn(`Unable to delete file ${path}. Cause: ${reason}`);
                    });
            })
            .catch(function (reason) {
                // Do nothing.
            });
    }
}
