import { IExplorer } from './IExplorer';
import { WsFile } from '../../modules/wsmodel/WsFile';
import { WsModel } from '../../modules/wsmodel/WsModel';
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

/**
 * A lightweight alternative to exposing the full WsFile to the AngularJS scope.
 */
export interface ExplorerFile {
    path: string;
    isOpen: boolean;
    selected: boolean;
    tainted: boolean;
}

function removeFilesThatDontExistInModel(files: { [path: string]: ExplorerFile }, wsModel: WsModel): void {
    const hideConfigFiles = wsModel.hideConfigFiles;
    const paths = Object.keys(files);
    for (const path of paths) {
        if (!wsModel.existsFile(path) || isHiddenFile(path, hideConfigFiles)) {
            delete files[path];
        }
    }
}

function ensureFilesThatDoExistInModel(files: { [path: string]: ExplorerFile }, wsModel: WsModel): void {
    const hideConfigFiles = wsModel.hideConfigFiles;
    const paths = Object.keys(wsModel.filesByPath);
    for (const path of paths) {
        if (!isHiddenFile(path, hideConfigFiles)) {
            const file = wsModel.getFileWeakRef(path) as WsFile;
            if (files[path]) {
                files[path].path = path;
                files[path].isOpen = file.isOpen;
                files[path].selected = file.selected;
                files[path].tainted = file.tainted;
            }
            else {
                files[path] = { path, isOpen: file.isOpen, selected: file.selected, tainted: file.tainted };
            }
        }
    }
}

function caseInsensitiveStringCompare(a: string, b: string): 1 | -1 | 0 {
    if (a.toLowerCase() > b.toLowerCase()) return 1;
    if (a.toLowerCase() < b.toLowerCase()) return -1;
    return 0;
}

/**
 * This class is registered directly with the `explorer` directive where it is aliased to `$ctrl`.
 */
export class ExplorerController implements IExplorer {

    public static $inject: string[] = [WORKSPACE_MODEL_UUID];

    /**
     * Error: [$rootScope:infdig] 10 $digest() iterations reached. Aborting!
     * https://docs.angularjs.org/error/$rootScope/infdig
     */
    private readonly cache: { [path: string]: ExplorerFile } = {};
    /**
     * The files used by the 
     */
    private readonly files_: ExplorerFile[] = [];

    constructor(private wsModel: WsModel) {
        // Do nothing
    }

    $onInit(): void {
        // Do nothing
    }

    $onDestroy(): void {
        // Do nothing
    }

    public get files(): ExplorerFile[] {

        removeFilesThatDontExistInModel(this.cache, this.wsModel);

        ensureFilesThatDoExistInModel(this.cache, this.wsModel);

        const paths = Object.keys(this.cache).sort(caseInsensitiveStringCompare);
        this.files_.length = 0;
        for (const path of paths) {
            this.files_.push(this.cache[path]);
        }

        return this.files_;
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
