import ExplorerFilesScope from './ExplorerFilesScope';
import IDoodleFile from '../../services/doodles/IDoodleFile';
import IDoodleManager from '../../services/doodles/IDoodleManager';

/**
 * @class ExplorerFilesController
 */
export default class ExplorerFilesController {

    /**
     * @property $inject
     * @type string[]
     * @static
     */
    public static $inject: string[] = ['$scope', 'doodles']

    /**
     * @class ExplorerFilesController
     * @constructor
     * @param $scope {ExplorerFilesScope}
     * @param doodles {IDoodleManager}
     */
    constructor($scope: ExplorerFilesScope, private doodles: IDoodleManager) {
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
        const name = window.prompt("Enter the name of the new file")
        if (name !== null) {
            const doodle = this.doodles.current()
            if (doodle) {
                try {
                    doodle.newFile(name)
                    doodle.selectFile(name)
                }
                catch (e) {
                    window.alert(`${e}`)
                }
            }
            else {
                console.warn(`newFile(${name})`)
            }
        }
        else {
            // The user cancelled the request.
        }
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
        const newName = window.prompt("Enter the new name of the file", oldName)
        if (newName !== null) {
            const doodle = this.doodles.current()
            if (doodle) {
                try {
                    doodle.renameFile(oldName, newName)
                }
                catch (e) {
                    window.alert(`${e}`)
                }
            }
            else {
                console.warn(`renameFile(${oldName}, ${newName})`)
            }
        }
    }

    /**
     * @method deleteFile
     * @param name {string}
     * @return {void}
     */
    public deleteFile(name: string): void {
        const doodle = this.doodles.current()
        if (doodle) {
            doodle.deleteFile(name)
        }
        else {
            console.warn(`deleteFile(${name})`)
        }
    }
}
