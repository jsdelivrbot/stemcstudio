// FIXME: Code Organization.
import dependenciesMap from '../../services/doodles/dependenciesMap';
import dependencyNames from '../../services/doodles/dependencyNames';
import Disposable from '../../base/Disposable';
import Document from '../../editor/Document';
import EditSession from '../../editor/EditSession';
// FIXME: Code Organization.
import IDoodleConfig from '../../services/doodles/IDoodleConfig';
import IOptionManager from '../../services/options/IOptionManager';
import modeFromName from '../../utils/modeFromName';
import StringShareableMap from '../../collections/StringShareableMap';
import WsFile from './WsFile';
import setOptionalBooleanProperty from '../../services/doodles/setOptionalBooleanProperty';
import setOptionalStringProperty from '../../services/doodles/setOptionalStringProperty';
import setOptionalStringArrayProperty from '../../services/doodles/setOptionalStringArrayProperty';

/**
 * Symbolic constant for the package.json file.
 */
const FILENAME_META = 'package.json';

/**
 * The workspace data model.
 */
export default class WsModel implements Disposable {

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

    public static $inject: string[] = ['options'];

    constructor(private options: IOptionManager) {
        // This will be called once, lazily, when this class is deployed as a singleton service.
    }

    recycle(): void {
        // console.lg("WsModel.recyle");
    }
    dispose(): void {
        /// console.lg("WsModel.dispose");
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
        const metaInfo: IDoodleConfig = JSON.parse(file.editSession.getValue());
        setOptionalStringProperty('author', author, metaInfo);
        file.editSession.setValue(JSON.stringify(metaInfo, null, 2));
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
            const metaInfo: IDoodleConfig = JSON.parse(file.editSession.getValue());
            metaInfo.dependencies = dependenciesMap(dependencies, this.options);
            file.editSession.setValue(JSON.stringify(metaInfo, null, 2));
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
        const metaInfo: IDoodleConfig = JSON.parse(file.editSession.getValue());
        setOptionalStringProperty('description', description, metaInfo);
        file.editSession.setValue(JSON.stringify(metaInfo, null, 2));
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
        const metaInfo: IDoodleConfig = JSON.parse(file.editSession.getValue());
        setOptionalStringArrayProperty('keywords', keywords, metaInfo);
        file.editSession.setValue(JSON.stringify(metaInfo, null, 2));
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
            const metaInfo: IDoodleConfig = JSON.parse(file.editSession.getValue());
            metaInfo.name = name;
            file.editSession.setValue(JSON.stringify(metaInfo, null, 2));
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
            const metaInfo: IDoodleConfig = JSON.parse(file.editSession.getValue());
            setOptionalBooleanProperty('operatorOverloading', operatorOverloading, metaInfo);
            file.editSession.setValue(JSON.stringify(metaInfo, null, 2));
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
        const metaInfo: IDoodleConfig = JSON.parse(file.editSession.getValue());
        metaInfo.version = version;
        file.editSession.setValue(JSON.stringify(metaInfo, null, 2));
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
                const file = new WsFile(new EditSession(new Document("")));
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
            return JSON.parse(file.editSession.getValue());
        }
        catch (e) {
            console.warn(`Unable to parse file '${FILENAME_META}' as JSON.`);
            const file = this.ensurePackageJson();
            console.warn(file.editSession.getValue());
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
            file.editSession.setValue(content);
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

} 