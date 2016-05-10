// import * as uib from 'angular-bootstrap';
import ExplorerFilesScope from './ExplorerFilesScope';
import IDoodleFile from '../../services/doodles/IDoodleFile';
import IDoodleManager from '../../services/doodles/IDoodleManager';
import ModalDialog from '../../services/modalService/ModalDialog';
import AlertOptions from '../../services/modalService/AlertOptions';
import ConfirmOptions from '../../services/modalService/ConfirmOptions';
import PromptOptions from '../../services/modalService/PromptOptions';

/**
 * @class ExplorerFilesController
 */
export default class ExplorerFilesController {

    /**
     * @property $inject
     * @type string[]
     * @static
     */
    public static $inject: string[] = ['$scope', 'doodles', 'modalDialog']

    /**
     * @class ExplorerFilesController
     * @constructor
     * @param $scope {ExplorerFilesScope}
     * @param doodles {IDoodleManager}
     */
    constructor($scope: ExplorerFilesScope, private doodles: IDoodleManager, private modalService: ModalDialog) {
        // Define the context menu used by the files.
        $scope.menu = (name: string, file: IDoodleFile) => {
            return [
                { label: "Open", action: () => { this.openFile(name) } },
                null,   // divider
                { label: "Rename", action: () => { this.renameFile(name) } },
                { label: "Delete", action: () => { this.deleteFile(name) } },
            ]
        }
    }

    /**
     * @method newFile
     * @return {void}
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
            .then((name) => {
                const doodle = this.doodles.current()
                if (doodle) {
                    try {
                        doodle.newFile(name)
                        doodle.selectFile(name)
                        this.doodles.updateStorage()
                    }
                    catch (e) {
                        const alertOptions: AlertOptions = { title: "Error", message: e.toString() }
                        this.modalService.alert(alertOptions)
                    }
                }
                else {
                    console.warn(`newFile(${name})`)
                }
            })
            .catch(function(reason: any) {
                // Do nothing.
            })
    }

    /**
     * @method openFile
     * @param name {string}
     * @return {void}
     */
    public openFile(name: string): void {
        const doodle = this.doodles.current()
        if (doodle) {
            doodle.openFile(name)
            doodle.selectFile(name)
        }
        else {
            console.warn(`openFile(${name})`)
        }
    }

    /**
     * @method renameFile
     * @param oldName {string}
     * @return {void}
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
                const doodle = this.doodles.current()
                if (doodle) {
                    try {
                        doodle.renameFile(oldName, newName)
                        this.doodles.updateStorage()
                    }
                    catch (e) {
                        this.modalService.alert({ title: "Error", message: e.toString() })
                    }
                }
                else {
                    console.warn(`renameFile(${oldName}, ${newName})`)
                }
            })
            .catch(function(reason: any) {
                // Do nothing.
            })
    }

    /**
     * @method deleteFile
     * @param name {string}
     * @return {void}
     */
    public deleteFile(name: string): void {
        const options: ConfirmOptions = {
            title: `Delete '${name}'`,
            message: `Are you sure you want to delete '${name}'?`,
            actionButtonText: 'Delete File'
        };
        this.modalService.confirm(options)
            .then((result) => {
                const doodle = this.doodles.current()
                if (doodle) {
                    doodle.deleteFile(name)
                    this.doodles.updateStorage()
                }
                else {
                    console.warn(`deleteFile(${name})`)
                }
            })
            .catch(function(reason: any) {
                // Do nothing.
            })
    }
}
