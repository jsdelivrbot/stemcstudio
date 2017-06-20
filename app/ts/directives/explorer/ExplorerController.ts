import { IExplorer } from './IExplorer';
import { WsModel } from '../../modules/wsmodel/WsModel';
import { WsFile } from '../../modules/wsmodel/WsFile';
import { WORKSPACE_MODEL_UUID } from '../../modules/wsmodel/IWorkspaceModel';

/**
 * The current (closed) list of configuration files.
 */
const configFiles = ['package.json', 'tsconfig.json', 'system.config.json', 'tslint.json', 'types.config.json'];

function isConfigFile(path: string): boolean {
    return configFiles.indexOf(path) >= 0;
}

function isHiddenFile(path: string, hideConfigFiles: boolean): boolean {
    return hideConfigFiles ? isConfigFile(path) : false;
}

/*
export interface ExplorerFile {
    path: string;
    isOpen: boolean;
    selected: boolean;
    tainted: boolean;
}
*/

/**
 * This class is registered directly with the `explorer` directive where it is aliased to `$ctrl`.
 */
export class ExplorerController implements IExplorer {

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

    public filesByPath(): { [path: string]: WsFile } {
        const hideConfigFiles = this.wsModel.hideConfigFiles;
        // Problems with $digest() right now so clutching at straws until resolved...
        const paths = Object.keys(this.wsModel.filesByPath).sort();
        const map: { [path: string]: WsFile } = {};
        for (const path of paths) {
            if (!isHiddenFile(path, hideConfigFiles)) {
                map[path] = this.wsModel.getFileWeakRef(path) as WsFile;
            }
        }
        return map;
    }

    //
    // Problems with $digest() infinite loops (maybe due to use of WsFile and WsModel in scope?).
    //
    /*
    public filesList(): ExplorerFile[] {
        const files = this.filesByPath();
        const paths = Object.keys(files);
        const sortedPaths = paths.sort();
        return sortedPaths.map(function (path) {
            const file = files[path];
            return { path, isOpen: file.isOpen, selected: file.selected, tainted: file.tainted };
        });
    }
    */

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
