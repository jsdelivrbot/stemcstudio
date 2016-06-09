import * as ng from 'angular';
import addMissingFilesToWorkspace from './addMissingFilesToWorkspace';
import allEditsRaw from './allEditsRaw';
// FIXME: Code Organization.
import dependenciesMap from '../../services/doodles/dependenciesMap';
import dependencyNames from '../../services/doodles/dependencyNames';
import Delta from '../../editor/Delta';
import Disposable from '../../base/Disposable';
import Document from '../../editor/Document';
import Editor from '../../editor/Editor';
import EditSession from '../../editor/EditSession';
import Workspace from '../../editor/workspace/Workspace';
// FIXME: Code Organization.
import IDoodleConfig from '../../services/doodles/IDoodleConfig';
import IOptionManager from '../../services/options/IOptionManager';
import PromiseManager from './PromiseManager';
import modeFromName from '../../utils/modeFromName';
import MwEditor from '../../synchronization/MwEditor';
import MwEdits from '../../synchronization/MwEdits';
import MwUnit from '../../synchronization/MwUnit';
import MwWorkspace from '../../synchronization/MwWorkspace';
import RoomAgent from '../../modules/rooms/services/RoomAgent';
import StringShareableMap from '../../collections/StringShareableMap';
import WsFile from './WsFile';
import setOptionalBooleanProperty from '../../services/doodles/setOptionalBooleanProperty';
import setOptionalStringProperty from '../../services/doodles/setOptionalStringProperty';
import setOptionalStringArrayProperty from '../../services/doodles/setOptionalStringArrayProperty';
import UnitListener from './UnitListener';
import removeUnwantedFilesFromWorkspace from './removeUnwantedFilesFromWorkspace';

/**
 * Symbolic constant for the package.json file.
 */
const FILENAME_META = 'package.json';

const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js'];
const workerImports: string[] = systemImports.concat(['/js/ace-workers.js']);
const typescriptServices = ['/js/typescriptServices.js'];

enum WorkspaceState {
    CONSTRUCTED,
    INIT_PENDING,
    INIT_FAILED,
    OPERATIONAL,
    TERM_PENDING,
    TERM_FAILED,
    TERMINATED
}

const DEBOUNCE_DURATION_MILLISECONDS = 100;

function debounce(next: () => any, delay: number) {

    /**
     * The timer handle.
     */
    let timer: number;

    return function(delta: Delta, session: EditSession) {
        if (timer) {
            window.clearTimeout(timer);
        }
        timer = setTimeout(function() {
            timer = void 0;
            next();
        }, delay);
    };
}

function uploadFileEditsToRoom(fileId: string, unit: MwUnit, room: RoomAgent) {
    return function() {
        const edits = unit.getEdits(room.id);
        room.setEdits(fileId, edits);
    };
}

/**
 * The workspace data model.
 */
export default class WsModel implements Disposable, MwWorkspace {

    /**
     * The owner's login.
     */
    owner: string;

    /**
     * 
     */
    gistId: string;

    /**
     * The repository identifier property.
     */
    repo: string;

    /**
     * 
     */
    created_at: string;

    /**
     * 
     */
    updated_at: string;

    /**
     * 
     */
    lastKnownJs: { [path: string]: string } = {};

    /**
     * 
     */
    isCodeVisible = true;

    /**
     * 
     */
    isViewVisible = false;

    /**
     * 
     */
    public files: StringShareableMap<WsFile> = new StringShareableMap<WsFile>();

    /**
     * 
     */
    public trash: StringShareableMap<WsFile> = new StringShareableMap<WsFile>();

    public trace: boolean = false;
    private state: WorkspaceState;
    private workspace: Workspace;

    /**
     * 
     */
    private promises: PromiseManager;

    private roomListener: UnitListener;
    /**
     * Keep track of the change handlers so that we can remove them when we stop listening.
     */
    private changeHandlers: { [fileName: string]: (delta: Delta, session: EditSession) => any } = {};

    public static $inject: string[] = ['options', '$q'];

    constructor(private options: IOptionManager, private $q: ng.IQService) {
        // This will be called once, lazily, when this class is deployed as a singleton service.
        this.workspace = new Workspace('/js/worker.js', workerImports.concat(typescriptServices));
        this.workspace.trace = false;
        this.state = WorkspaceState.CONSTRUCTED;
        this.promises = new PromiseManager($q);
    }

    recycle(): void {
        // console.lg("WsModel.recyle");
    }
    dispose(): void {
        /// console.lg("WsModel.dispose");
    }

    /**
     *
     */
    initialize(callback: (err: any) => any): void {
        if (this.promises.length) {
            console.warn(`outstanding promises prior to reset: ${this.promises.length}, ${JSON.stringify(this.promises.getOutstandingPurposes(), null, 2)}`);
        }
        this.promises.reset();
        const deferred = this.promises.defer('init');
        this.state = WorkspaceState.INIT_PENDING;
        this.workspace.init((err: any) => {
            if (err) {
                console.warn(`init() => ${err}`);
                this.state = WorkspaceState.INIT_FAILED;
                this.promises.reject(deferred, err);
                callback(err);
            }
            else {
                this.state = WorkspaceState.OPERATIONAL;
                this.promises.resolve(deferred);
                callback(void 0);
            }
        });
    }

    synchronize(): ng.IPromise<any> {
        const deferred: ng.IDeferred<any> = this.$q.defer<any>();
        this.promises.synchronize()
            .then(() => {
                deferred.resolve();
            })
            .catch((err) => {
                console.warn(`synchronize failed ${err}.`);
                deferred.reject();
            });
        return deferred.promise;
    }

    /**
     * @method terminate
     * @return {void}
     */
    terminate(): void {
        this.detachEditors();
        this.removeScripts();
        this.synchronize().then(() => {
            this.state = WorkspaceState.TERM_PENDING;
            this.workspace.terminate((err: any) => {
                if (!err) {
                    this.state = WorkspaceState.TERMINATED;
                }
                else {
                    this.state = WorkspaceState.TERM_FAILED;
                    console.warn(`terminate() => ${err}`);
                }
            });
        });
    }

    /**
     * @method setDefaultLibrary
     * @param url {string}
     * @return {void}
     */
    setDefaultLibrary(url: string): void {
        switch (this.state) {
            case WorkspaceState.OPERATIONAL: {
                const deferred = this.promises.defer('setDefaultLibrary');
                this.workspace.setDefaultLibrary(url, (err: any) => {
                    if (err) {
                        console.warn(`setDefaultLibrary(${url}) => ${err}`);
                        this.promises.reject(deferred, err);
                    }
                    else {
                        this.promises.resolve(deferred, true);
                    }
                });
                break;
            }
            case WorkspaceState.INIT_PENDING: {
                this.synchronize()
                    .then(() => {
                        this.state = WorkspaceState.OPERATIONAL;
                        // Using recursion allows me to avoid creating a stack of commands.
                        // Of course, the approaches are equivalent.
                        this.setDefaultLibrary(url);
                    })
                    .catch((reason: any) => {
                        this.state = WorkspaceState.INIT_FAILED;
                    });
                break;
            }
            case WorkspaceState.CONSTRUCTED: {
                throw new Error("TODO: setDefaultLibrary while CONSTRUCTED");
            }
            case WorkspaceState.INIT_FAILED: {
                throw new Error("TODO: setDefaultLibrary while INIT_FAILED");
            }
            default: {
                throw new Error("TODO: setDefaultLibrary before OPERATIONAL");
            }
        }
    }

    setModuleKind(moduleKind: string): void {
        switch (this.state) {
            case WorkspaceState.OPERATIONAL: {
                const deferred = this.promises.defer('setModuleKind');
                this.workspace.setModuleKind(moduleKind, (err: any) => {
                    if (err) {
                        console.warn(`setModuleKind('${moduleKind}') => ${err}`);
                        this.promises.reject(deferred, err);
                    }
                    else {
                        this.promises.resolve(deferred, moduleKind);
                    }
                });
                break;
            }
            case WorkspaceState.INIT_PENDING: {
                this.synchronize()
                    .then(() => {
                        // TODO: DRY
                        this.state = WorkspaceState.OPERATIONAL;
                        // Using recursion allows me to avoid creating a stack of commands.
                        // Of course, the approaches are equivalent.
                        this.setModuleKind(moduleKind);
                    })
                    .catch((reason: any) => {
                        this.state = WorkspaceState.INIT_FAILED;
                    });
                break;
            }
            default: {
                throw new Error("TODO: setModuleKind before OPERATIONAL");
            }
        }
    }

    setScriptTarget(scriptTarget: string): void {
        const deferred = this.promises.defer('setScriptTarget');
        this.workspace.setScriptTarget(scriptTarget, (err: any) => {
            if (err) {
                console.warn(`setScriptTarget('${scriptTarget}') => ${err}`);
                this.promises.reject(deferred, err);
            }
            else {
                this.promises.resolve(deferred, scriptTarget);
            }
        });
    }

    setTrace(trace: boolean): void {
        const deferred = this.promises.defer('setTrace');
        this.workspace.setTrace(trace, (err: any) => {
            if (err) {
                console.warn(`setTrace('${trace}') => ${err}`);
                this.promises.reject(deferred, err);
            }
            else {
                this.promises.resolve(deferred, trace);
            }
        });
    }

    createEditor(): MwEditor {
        // const editor = this.workspace.getEditor(fileName)
        throw new Error("TODO: createEditor");
    }
    deleteEditor(editor: MwEditor): void {
        throw new Error("TODO: deleteEditor");
    }

    attachEditor(fileName: string, editor: Editor): void {
        const deferred = this.promises.defer(`attachEditor('${fileName}')`);
        this.workspace.attachEditor(fileName, editor, (err: any) => {
            if (!err) {
                this.promises.resolve(deferred, fileName);
            }
            else {
                console.warn(`attachEditor('${fileName}') => ${err}`);
                this.promises.reject(deferred, err);
            }
        });
    }

    detachEditor(fileName: string, editor: Editor): void {
        const deferred = this.promises.defer(`detachEditor('${fileName}')`);
        this.workspace.detachEditor(fileName, editor, (err: any) => {
            if (!err) {
                this.promises.resolve(deferred, fileName);
            }
            else {
                console.warn(`detachEditor('${fileName}') => ${err}`);
                this.promises.reject(deferred, err);
            }
        });
    }

    ensureScript(fileName: string, content: string): void {
        const deferred = this.promises.defer(`ensureScript('${fileName}')`);
        this.workspace.ensureScript(fileName, content, (err: any) => {
            if (err) {
                this.promises.reject(deferred, err);
            }
            else {
                this.promises.resolve(deferred);
            }
        });
    }

    removeScript(fileName: string): void {
        const deferred = this.promises.defer(`removeScript('${fileName}')`);
        this.workspace.removeScript(fileName, (err: any) => {
            if (err) {
                this.promises.reject(deferred, err);
            }
            else {
                this.promises.resolve(deferred);
            }
        });
    }

    detachEditors(): void {
        // Do nothing.
    }

    removeScripts(): void {
        // Do nothing.
    }

    getEditorFileNames(): string[] {
        return this.workspace.getEditorFileNames();
    }

    getEditor(fileName: string): Editor {
        return this.workspace.getEditor(fileName);
    }

    /**
     * 
     */
    semanticDiagnostics(): void {
        this.workspace.semanticDiagnostics();
    }

    /**
     *
     */
    outputFiles(): void {
        this.workspace.outputFiles();
    }

    get author(): string {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    return pkgInfo.author;
                }
                else {
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        }
        catch (e) {
            console.warn(e);
            return void 0;
        }
    }
    set author(author: string) {
        const file = this.ensurePackageJson();
        const metaInfo: IDoodleConfig = JSON.parse(file.getText());
        setOptionalStringProperty('author', author, metaInfo);
        file.setText(JSON.stringify(metaInfo, null, 2));
    }
    get dependencies(): string[] {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    const dependencyMap = this.packageInfo.dependencies;
                    return dependencyNames(dependencyMap);
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        }
        catch (e) {
            console.warn(e);
            return [];
        }
    }
    set dependencies(dependencies: string[]) {
        try {
            const file = this.ensurePackageJson();
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            metaInfo.dependencies = dependenciesMap(dependencies, this.options);
            file.setText(JSON.stringify(metaInfo, null, 2));
        }
        catch (e) {
            console.warn(`Unable to set dependencies property in file '${FILENAME_META}'.`);
        }
    }
    get description(): string {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    return pkgInfo.description;
                }
                else {
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        }
        catch (e) {
            console.warn(e);
            return void 0;
        }
    }
    set description(description: string) {
        const file = this.ensurePackageJson();
        const metaInfo: IDoodleConfig = JSON.parse(file.getText());
        setOptionalStringProperty('description', description, metaInfo);
        file.setText(JSON.stringify(metaInfo, null, 2));
    }
    get keywords(): string[] {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    return this.packageInfo.keywords;
                }
                else {
                    return [];
                }
            }
            else {
                return [];
            }
        }
        catch (e) {
            console.warn(e);
            return [];
        }
    }
    set keywords(keywords: string[]) {
        const file = this.ensurePackageJson();
        const metaInfo: IDoodleConfig = JSON.parse(file.getText());
        setOptionalStringArrayProperty('keywords', keywords, metaInfo);
        file.setText(JSON.stringify(metaInfo, null, 2));
    }
    get name(): string {
        if (this.existsPackageJson()) {
            const pkgInfo = this.packageInfo;
            if (pkgInfo) {
                return pkgInfo.name;
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    set name(name: string) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            metaInfo.name = name;
            file.setText(JSON.stringify(metaInfo, null, 2));
        }
        catch (e) {
            console.warn(`Unable to set name property in file '${FILENAME_META}'.`);
        }
    }
    get operatorOverloading(): boolean {
        if (this.existsPackageJson()) {
            const pkgInfo = this.packageInfo;
            if (pkgInfo) {
                return pkgInfo.operatorOverloading ? true : false;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    set operatorOverloading(operatorOverloading: boolean) {
        try {
            const file = this.ensurePackageJson();
            const metaInfo: IDoodleConfig = JSON.parse(file.getText());
            setOptionalBooleanProperty('operatorOverloading', operatorOverloading, metaInfo);
            file.setText(JSON.stringify(metaInfo, null, 2));
        }
        catch (e) {
            console.warn(`Unable to set operatorOverloading property in file '${FILENAME_META}'.`);
        }
    }
    get version(): string {
        if (this.existsPackageJson()) {
            return this.packageInfo.version;
        }
        else {
            return void 0;
        }
    }
    set version(version: string) {
        const file = this.ensurePackageJson();
        const metaInfo: IDoodleConfig = JSON.parse(file.getText());
        metaInfo.version = version;
        file.setText(JSON.stringify(metaInfo, null, 2));
    }
    protected destructor(): void {
        // This may never be called when this class is deployed as a singleton service.
        // console.lg("WsModel.destructor");
    }
    newFile(path: string): WsFile {
        const mode = modeFromName(path);
        const conflictFile = this.findFileByName(path);
        if (!conflictFile) {
            const trashedFile = this.trash.getWeakRef(path);
            if (!trashedFile) {
                const file = new WsFile();
                file.setText("");
                file.language = mode;
                if (!this.files) {
                    this.files = new StringShareableMap<WsFile>();
                }
                // The file is captured by the files collection (incrementing the reference count).
                this.files.put(path, file);
                // We return the other reference.
                return file;
            }
            else {
                this.restoreFileFromTrash(path);
                trashedFile.language = mode;
                return trashedFile;
            }
        }
        else {
            throw new Error(`${path} already exists. The path must be unique.`);
        }
    }
    deleteFile(path: string): void {
        const file = this.findFileByName(path);
        if (file) {
            // Determine whether the file exists in GitHub so that we can delete it upon upload.
            // Use the raw_url as the sentinel. Keep it in trash for later deletion.
            if (file.raw_url) {
                this.moveFileToTrash(path);
            }
            else {
                // It's a file that does not exist on GitHub.
                this.files.remove(path).release();
                delete this.lastKnownJs[path];
            }
        }
        else {
            console.warn(`deleteFile(${path}), ${path} was not found.`);
        }
    }

    existsFile(path: string): boolean {
        return this.findFileByName(path) ? true : false;
    }

    openFile(path: string): void {
        const file = this.findFileByName(path);
        if (file) {
            // We assume someone is watching this property, ready to pounce.
            // TODO: Replace with openPending flag?
            file.isOpen = true;
        }
        else {
            // Do nothing
        }
    }

    /**
     * 
     */
    renameFile(oldName: string, newName: string): void {
        const mode = modeFromName(newName);
        if (!mode) {
            throw new Error(`${newName} is not a recognized language.`);
        }
        // Make sure that the file we want to re-path really does exist.
        const oldFile = this.findFileByName(oldName);
        if (oldFile) {
            if (!this.existsFile(newName)) {
                // Determine whether we can recycle a file from trash or must create a new file.
                if (!this.existsFileInTrash(newName)) {
                    // We must create a new file.
                    const newFile = oldFile.clone();

                    // Make it clear that this file did not come from GitHub.
                    newFile.raw_url = void 0;
                    // newFile.size = void 0;
                    // newFile.truncated = void 0;
                    // newFile.type = void 0;

                    // Initialize properties that depend upon the new path.
                    newFile.language = mode;

                    this.files.putWeakRef(newName, newFile);
                }
                else {
                    // We can recycle a file from trash.
                    this.restoreFileFromTrash(newName);
                    const theFile = this.findFileByName(newName);
                    // Initialize properties that depend upon the new path.
                    theFile.language = mode;
                }
                // Delete the file by the old path.
                this.deleteFile(oldName);
            }
            else {
                throw new Error(`${newName} already exists. The new path must be unique.`);
            }
        }
        else {
            throw new Error(`${oldName} does not exist. The old path must be the path of an existing file.`);
        }
    }
    selectFile(path: string): void {
        const file = this.findFileByName(path);
        if (file && file.isOpen) {
            const paths = this.files.keys;
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                const file = this.files.getWeakRef(paths[i]);
                if (file.isOpen) {
                    file.selected = paths[i] === path;
                }
            }
        }
        else {
            // Do nothing
        }
    }
    closeFile(path: string): void {
        const file = this.findFileByName(path);
        if (file) {
            // We assume someone is watching this property, ready to pounce.
            // TODO: Replace with openPending flag?
            file.isOpen = false;
            file.selected = false;
        }
        else {
            // Do nothing
        }

        // Select the first open file that we find.
        this.deselectAll();

        const paths = this.files.keys;
        const iLen = paths.length;
        for (let i = 0; i < iLen; i++) {
            const file = this.files.getWeakRef(paths[i]);
            if (file.isOpen) {
                file.selected = true;
                return;
            }
        }
    }

    emptyTrash(): void {
        throw new Error("TODO: WsModel.emptyTrash");
    }

    existsFileInTrash(path: string): boolean {
        return this.trash.exists(path);
    }

    /**
     *
     */
    getPreviewFile(): string {
        const paths = this.files.keys;
        const iLen = paths.length;
        for (let i = 0; i < iLen; i++) {
            const path = paths[i];
            if (this.files.getWeakRef(path).preview) {
                return path;
            }
        }
        return void 0;
    }

    getPreviewFileOrBestAvailable(): string {
        const previewFile = this.getPreviewFile();
        if (previewFile) {
            return previewFile;
        }
        else {
            let bestFile: string;
            const paths = this.files.keys;
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                const path = paths[i];
                const mode = modeFromName(path);
                if (mode === 'HTML') {
                    if (path === 'index.html') {
                        return path;
                    }
                    else if (path.toLowerCase() === 'specrunner.html') {
                        bestFile = path;
                    }
                    else if (typeof bestFile === 'undefined') {
                        bestFile = path;
                    }
                    else {
                        // Ignore the file.
                    }
                }
                else {
                    // We don't consider other file types for now.
                }
            }
            return bestFile;
        }
    }

    /**
     * Finds the file at the specified path.
     *
     * @returns The file at the specified path.
     */
    findFileByName(path: string): WsFile {
        if (this.files) {
            return this.files.get(path);
        }
        else {
            return void 0;
        }
    }
    getEditSession(path: string): EditSession {
        if (this.files) {
            return this.files.getWeakRef(path).editSession;
        }
        else {
            return void 0;
        }
    }
    setPreviewFile(path: string): void {
        const file = this.findFileByName(path);
        if (file) {
            const paths = this.files.keys;
            const iLen = paths.length;
            for (let i = 0; i < iLen; i++) {
                this.files.getWeakRef(paths[i]).preview = false;
            }
            file.preview = true;
        }
        else {
            // Do nothing
        }
    }

    /**
     * 
     */
    updateStorage(): void {
        // FIXME: Let it go until we need to create stuff.
        console.warn("TODO: WsModel.updateStorage");
    }

    /**
     * Determines whether this workspace has a package.json file.
     */
    private existsPackageJson(): boolean {
        return this.existsFile(FILENAME_META);
    }

    /**
     * 
     */
    get packageInfo(): IDoodleConfig {
        try {
            // Beware: We could have a package.json that doesn't parse.
            // We must ensure that the user can recover the situation.
            const file = this.ensurePackageJson();
            return JSON.parse(file.getText());
        }
        catch (e) {
            console.warn(`Unable to parse file '${FILENAME_META}' as JSON.`);
            const file = this.ensurePackageJson();
            console.warn(file.getText());
            return void 0;
        }
    }

    private deselectAll() {
        const paths = this.files.keys;
        const iLen = paths.length;
        for (let i = 0; i < iLen; i++) {
            const file = this.files.getWeakRef(paths[i]);
            file.selected = false;
        }
    }

    private ensurePackageJson(): WsFile {
        return this.ensureFile(FILENAME_META, '{}');
    }

    /**
     *
     */
    private ensureFile(path: string, content: string): WsFile {
        if (!this.existsFile(path)) {
            const file = this.newFile(path);
            file.setText(content);
            file.language = modeFromName(path);
            return file;
        }
        else {
            return this.findFileByName(path);
        }
    }

    private moveFileToTrash(path: string): void {
        const unwantedFile = this.files.getWeakRef(path);
        if (unwantedFile) {
            // Notice that the conflict could be with a TRASHED file.
            const conflictFile = this.trash.getWeakRef(path);
            if (!conflictFile) {
                // There is no conflict, proceed with the move.
                this.trash.putWeakRef(path, unwantedFile);
                this.files.remove(path);
                if (this.existsFile(path)) {
                    throw new Error(`${path} was not physically deleted from files.`);
                }
            }
            else {
                throw new Error(`${path} cannot be moved to trash because of a naming conflict with an existing file.`);
            }
        }
        else {
            throw new Error(`${path} cannot be moved to trash because it does not exist.`);
        }
    }

    private restoreFileFromTrash(path: string): void {
        const wantedFile = this.trash.getWeakRef(path);
        if (wantedFile) {
            const conflictFile = this.files.getWeakRef(path);
            if (!conflictFile) {
                this.trash.remove(path);
                this.files.putWeakRef(path, wantedFile);
            }
            else {
                throw new Error(`${path} cannot be restored from trash because of a naming conflict with an existing file.`);
            }
        }
        else {
            throw new Error(`${path} cannot be restored from trash because it does not exist.`);
        }
    }
    connectToRoom(room: RoomAgent) {
        if (room) {
            // Enumerate the editors in the workspace and add them to the node.
            // This will enable the node to get/set the editor value, diff and apply patches.
            const fileNames = this.files.keys;
            for (let i = 0; i < fileNames.length; i++) {
                const fileName = fileNames[i];
                const session = this.getEditSession(fileName);
                const file = this.findFileByName(fileName);
                // Create the synchronization node associated with the workspace.
                // This will enable the node to create and destroy editors.
                file.unit = new MwUnit(this);
                file.unit.setEditor(file);
            }

            // Add a listener to the room agent so that edits broadcast from the room are sent to the node.
            this.roomListener = new UnitListener(this);
            room.addListener(this.roomListener);

            // Add listeners for editor changes. These will begin the flow of diffs to the server.
            // We debounce the change events so that the diff is trggered when things go quiet for a second.
            for (let i = 0; i < fileNames.length; i++) {
                const fileName = fileNames[i];
                const session = this.getEditSession(fileName);
                const file = this.findFileByName(fileName);
                const changeHandler = debounce(uploadFileEditsToRoom(fileName, file.unit, room), DEBOUNCE_DURATION_MILLISECONDS);
                session.on('change', changeHandler);
                // Keep track of the handlers so that we can remove them later.
                // FIXME: We can do better because the on method returns a function for the off method.
                this.changeHandlers[fileName] = changeHandler;
            }
        }
        else {
            throw new Error("Must have a workspace and a room.");
        }
    }
    disconnectFromRoom(room: RoomAgent) {
        // Remove listeners on the editor for changes.
        const fileNames = this.files.keys;
        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];
            const session = this.getEditSession(fileName);
            const changeHandler = this.changeHandlers[fileName];
            session.off('change', changeHandler);
            delete this.changeHandlers[fileName];
        }
        // remove the listener on the room agent.
        room.removeListener(this.roomListener);
        this.roomListener = void 0;
        // TODO: We can purge all the units.
    }
    uploadToRoom(room: RoomAgent) {
        if (room) {
            const fileIds = this.files.keys;
            for (let i = 0; i < fileIds.length; i++) {
                const fileId = fileIds[i];
                const file = this.findFileByName(fileId);
                const unit = file.unit;
                const edits: MwEdits = unit.getEdits(room.id);
                room.setEdits(fileId, edits);
            }
        }
        else {
            console.warn("We appear to be missing a room");
        }
    }
    downloadFromRoom(room: RoomAgent) {
        if (room) {
            console.log("TODO: downloadWorkspaceFromRoom");
            // This could also be done through the rooms service.
            room.download((err, files: { [fileName: string]: MwEdits }) => {
                if (!err) {
                    // Verify that all of the edits are Raw to begin with.
                    if (allEditsRaw(files)) {
                        // We make a new Doodle to accept the downloaded workspace.
                        this.dispose();
                        this.recycle();
                        addMissingFilesToWorkspace(this, files);
                        // This will not be required since we are starting with a new Doodle.
                        removeUnwantedFilesFromWorkspace(this, files);
                        // Save the downloaded edits for when the editors come online?
                        // this.files = files;
                    }
                    else {
                        console.warn(JSON.stringify(files, null, 2));
                    }
                }
                else {
                    console.warn(`Unable to download workspace: ${err}`);
                }
            });
            // doodle.files
        }
        else {
            console.warn("We appear to be missing a room");
        }
    }

} 