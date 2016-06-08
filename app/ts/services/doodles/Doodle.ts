import DoodleFile from './DoodleFile';
import IDoodleConfig from './IDoodleConfig';
import modeFromName from '../../utils/modeFromName';
import dependencyNames from './dependencyNames';
import dependenciesMap from './dependenciesMap';
import IOptionManager from '../options/IOptionManager';
import setOptionalBooleanProperty from './setOptionalBooleanProperty';
import setOptionalStringProperty from './setOptionalStringProperty';
import setOptionalStringArrayProperty from './setOptionalStringArrayProperty';

const FILENAME_META = 'package.json';

export default class Doodle {
    /**
     * The owner's login name.
     */
    public owner: string;
    /**
     * The repository name property.
     */
    public repo: string;
    public gistId: string;
    public isCodeVisible: boolean;
    public isViewVisible: boolean;
    public lastKnownJs: { [name: string]: string };
    public files: { [path: string]: DoodleFile };
    public trash: { [path: string]: DoodleFile } = {};
    public created_at: string;
    public updated_at: string;

    constructor(private options: IOptionManager) {
        this.isCodeVisible = true;
        this.isViewVisible = false;
        this.lastKnownJs = {};
    }

    get packageInfo(): IDoodleConfig {
        try {
            // Beware: We could have a package.json that doesn't parse.
            // We must ensure that the user can recover the situation.
            const file = this.ensurePackageJson();
            return JSON.parse(file.content);
        }
        catch (e) {
            console.warn(`Unable to parse file '${FILENAME_META}' as JSON.`);
            const file = this.ensurePackageJson();
            console.warn(file.content);
            return void 0;
        }
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
            const metaInfo: IDoodleConfig = JSON.parse(file.content);
            metaInfo.name = name;
            file.content = JSON.stringify(metaInfo, null, 2);
        }
        catch (e) {
            console.warn(`Unable to set name property in file '${FILENAME_META}'.`);
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
        const metaInfo: IDoodleConfig = JSON.parse(file.content);
        metaInfo.version = version;
        file.content = JSON.stringify(metaInfo, null, 2);
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
        const metaInfo: IDoodleConfig = JSON.parse(file.content);
        setOptionalStringProperty('author', author, metaInfo);
        file.content = JSON.stringify(metaInfo, null, 2);
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
        const metaInfo: IDoodleConfig = JSON.parse(file.content);
        setOptionalStringProperty('description', description, metaInfo);
        file.content = JSON.stringify(metaInfo, null, 2);
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
        const metaInfo: IDoodleConfig = JSON.parse(file.content);
        setOptionalStringArrayProperty('keywords', keywords, metaInfo);
        file.content = JSON.stringify(metaInfo, null, 2);
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
            const metaInfo: IDoodleConfig = JSON.parse(file.content);
            setOptionalBooleanProperty('operatorOverloading', operatorOverloading, metaInfo);
            file.content = JSON.stringify(metaInfo, null, 2);
        }
        catch (e) {
            console.warn(`Unable to set operatorOverloading property in file '${FILENAME_META}'.`);
        }
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
            const metaInfo: IDoodleConfig = JSON.parse(file.content);
            metaInfo.dependencies = dependenciesMap(dependencies, this.options);
            file.content = JSON.stringify(metaInfo, null, 2);
        }
        catch (e) {
            console.warn(`Unable to set dependencies property in file '${FILENAME_META}'.`);
        }
    }

    private existsPackageJson(): boolean {
        return this.existsFile(FILENAME_META);
    }

    private ensurePackageJson(): DoodleFile {
        return this.ensureFile(FILENAME_META, '{}');
    }

    private ensureFile(name: string, content: string): DoodleFile {
        if (!this.existsFile(name)) {
            const file = this.newFile(name);
            file.content = content;
            file.language = modeFromName(name);
            return file;
        }
        else {
            return this.findFileByName(name);
        }
    }

    /**
     * @method closeFile
     * @param name {string}
     * @return {void}
     */
    closeFile(name: string): void {
        const file = this.findFileByName(name);
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

        const names = Object.keys(this.files);
        const iLen = names.length;
        for (let i = 0; i < iLen; i++) {
            const name = names[i];
            const file = this.files[name];
            if (file.isOpen) {
                file.selected = true;
                return;
            }
        }
    }

    /**
     * @method deleteFile
     * @param name {string}
     * @return {void}
     */
    deleteFile(name: string): void {
        const file = this.findFileByName(name);
        if (file) {
            // Determine whether the file exists in GitHub so that we can delete it upon upload.
            // Use the raw_url as the sentinel. Keep it in trash for later deletion.
            if (file.raw_url) {
                this.moveFileToTrash(name);
            }
            else {
                // It's a file that does not exist on GitHub.
                delete this.files[name];
                delete this.lastKnownJs[name];
            }
        }
        else {
            console.warn(`deleteFile(${name}), ${name} was not found.`);
        }
    }

    private deselectAll() {
        const names = Object.keys(this.files);
        const iLen = names.length;
        for (let i = 0; i < iLen; i++) {
            const name = names[i];
            const file = this.files[name];
            file.selected = false;
        }
    }

    /**
     * Empties the map containing Gist files that are marked for deletion.
     * 
     * @method emtyTrash
     * @return {void}
     */
    emptyTrash(): void {
        this.trash = {};
    }

    /**
     * @method existsFile
     * @param name {string}
     * @return {boolean}
     */
    existsFile(name: string): boolean {
        return this.findFileByName(name) ? true : false;
    }

    /**
     * @method existsFileInTrash
     * @param name {string}
     * @return {boolean}
     */
    existsFileInTrash(name: string): boolean {
        return this.trash[name] ? true : false;
    }

    /**
     * @method getPreviewFile
     * @return {string}
     */
    getPreviewFile(): string {
        const names = Object.keys(this.files);
        const iLen = names.length;
        for (let i = 0; i < iLen; i++) {
            const name = names[i];
            if (this.files[name].preview) {
                return name;
            }
        }
        return void 0;
    }

    /**
     * If a file has been explicitly marked as being the preview file then use it.
     * Otherwise, make a best guess from the available files.
     * This will improve the user experience.
     *
     * getPreviewFileOrBestAvailable
     * @return {string}
     */
    getPreviewFileOrBestAvailable(): string {
        const previewFile = this.getPreviewFile();
        if (previewFile) {
            return previewFile;
        }
        else {
            let bestFile: string;
            const names = Object.keys(this.files);
            const iLen = names.length;
            for (let i = 0; i < iLen; i++) {
                const name = names[i];
                const mode = modeFromName(name);
                if (mode === 'HTML') {
                    if (name === 'index.html') {
                        return name;
                    }
                    else if (name.toLowerCase() === 'specrunner.html') {
                        bestFile = name;
                    }
                    else if (typeof bestFile === 'undefined') {
                        bestFile = name;
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
     * @method moveFileToTrash
     * @param name {string}
     * @return {void}
     */
    private moveFileToTrash(name: string): void {
        const unwantedFile = this.files[name];
        if (unwantedFile) {
            // Notice that the conflict could be with a TRASHED file.
            const conflictFile = this.trash[name];
            if (!conflictFile) {
                // There is no conflict, proceed with the move.
                this.trash[name] = unwantedFile;
                delete this.files[name];
                if (this.existsFile(name)) {
                    throw new Error(`${name} was not physically deleted from files.`);
                }
            }
            else {
                throw new Error(`${name} cannot be moved to trash because of a naming conflict with an existing file.`);
            }
        }
        else {
            throw new Error(`${name} cannot be moved to trash because it does not exist.`);
        }
    }

    /**
     * @method restoreFileFromTrash
     * @param name {string}
     * @return {void}
     */
    private restoreFileFromTrash(name: string): void {
        const wantedFile = this.trash[name];
        if (wantedFile) {
            const conflictFile = this.files[name];
            if (!conflictFile) {
                delete this.trash[name];
                this.files[name] = wantedFile;
            }
            else {
                throw new Error(`${name} cannot be restored from trash because of a naming conflict with an existing file.`);
            }
        }
        else {
            throw new Error(`${name} cannot be restored from trash because it does not exist.`);
        }
    }

    /**
     * @method findFileByName
     * @param name {string}
     * @return {DoodleFile}
     */
    findFileByName(name: string): DoodleFile {
        if (this.files) {
            return this.files[name];
        }
        else {
            return void 0;
        }
    }

    /**
     * @method newFile
     * @param path {string}
     * @return {DoodleFile}
     */
    newFile(path: string): DoodleFile {
        const mode = modeFromName(path);
        const conflictFile = this.findFileByName(path);
        if (!conflictFile) {
            const trashedFile = this.trash[path];
            if (!trashedFile) {
                const file = new DoodleFile();
                file.language = mode;
                if (!this.files) {
                    this.files = {};
                }
                this.files[path] = file;
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

    /**
     * @method openFile
     * @param name {string}
     * @return {void}
     */
    openFile(name: string): void {
        const file = this.findFileByName(name);
        if (file) {
            // We assume someone is watching this property, ready to pounce.
            // TODO: Replace with openPending flag?
            file.isOpen = true;
        }
        else {
            // Do nothing
        }
    }

    renameFile(oldName: string, newName: string): void {
        const mode = modeFromName(newName);
        if (!mode) {
            throw new Error(`${newName} is not a recognized language.`);
        }
        // Make sure that the file we want to rename really does exist.
        const oldFile = this.findFileByName(oldName);
        if (oldFile) {
            if (!this.existsFile(newName)) {
                // Determine whether we can recycle a file from trash or must create a new file.
                if (!this.existsFileInTrash(newName)) {
                    // We must create a new file.
                    const newFile = oldFile.clone();

                    // Make it clear that this file did not come from GitHub.
                    newFile.raw_url = void 0;
                    newFile.size = void 0;
                    newFile.truncated = void 0;
                    newFile.type = void 0;

                    // Initialize properties that depend upon the new name.
                    newFile.language = mode;

                    this.files[newName] = newFile;
                }
                else {
                    // We can recycle a file from trash.
                    this.restoreFileFromTrash(newName);
                    const theFile = this.findFileByName(newName);
                    // Initialize properties that depend upon the new name.
                    theFile.language = mode;
                }
                // Delete the file by the old name.
                this.deleteFile(oldName);
            }
            else {
                throw new Error(`${newName} already exists. The new name must be unique.`);
            }
        }
        else {
            throw new Error(`${oldName} does not exist. The old name must be the name of an existing file.`);
        }
    }

    /**
     * @method selectFile
     * @param name {string}
     * @return {void}
     */
    selectFile(name: string): void {
        const file = this.findFileByName(name);
        if (file && file.isOpen) {
            const names = Object.keys(this.files);
            const iLen = names.length;
            for (let i = 0; i < iLen; i++) {
                const file = this.files[names[i]];
                if (file.isOpen) {
                    file.selected = names[i] === name;
                }
            }
        }
        else {
            // Do nothing
        }
    }

    /**
     * @method setPreviewFile
     * @param name {string}
     * @return {void}
     */
    setPreviewFile(name: string): void {
        const file = this.findFileByName(name);
        if (file) {
            const names = Object.keys(this.files);
            const iLen = names.length;
            for (let i = 0; i < iLen; i++) {
                const name = names[i];
                this.files[name].preview = false;
            }
            file.preview = true;
        }
        else {
            // Do nothing
        }
    }
}
