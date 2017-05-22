import { DoodleFile } from './DoodleFile';
import { PackageSettings } from '../../modules/wsmodel/WsModel';
import { modeFromName } from '../../utils/modeFromName';
import { setOptionalBooleanProperty } from './setOptionalBooleanProperty';
import { setOptionalStringProperty } from './setOptionalStringProperty';
import { setOptionalStringArrayProperty } from './setOptionalStringArrayProperty';

const PACKAGE_DOT_JSON = 'package.json';

/**
 * TODO: Eliminate DEAD CODE.
 */
export class Doodle {

    /**
     * The GitHub Gist identifier.
     */
    public gistId: string | undefined;

    /**
     * The owner's login name.
     */
    public owner: string | undefined;

    /**
     * The repository name property.
     */
    public repo: string | undefined;

    /**
     * The room identifier (collaboration).
     */
    public roomId: string;

    public isCodeVisible: boolean;
    public isViewVisible: boolean;
    public lastKnownJs: { [name: string]: string };
    public lastKnownJsMap: { [name: string]: string };
    public files: { [path: string]: DoodleFile };
    public trash: { [path: string]: DoodleFile } = {};
    public created_at: string | undefined;
    public updated_at: string | undefined;

    constructor() {
        this.isCodeVisible = true;
        this.isViewVisible = false;
        this.lastKnownJs = {};
        this.lastKnownJsMap = {};
    }

    get packageInfo(): Partial<PackageSettings> {
        try {
            // Beware: We could have a package.json that doesn't parse.
            // We must ensure that the user can recover the situation.
            const file = this.ensurePackageJson();
            return JSON.parse(file.content);
        }
        catch (e) {
            console.warn(`Unable to parse file '${PACKAGE_DOT_JSON}' as JSON.`);
            const file = this.ensurePackageJson();
            console.warn(file.content);
            throw new Error();
        }
    }

    get name(): string | undefined {
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

    set name(name: string | undefined) {
        const file = this.ensurePackageJson();
        try {
            const metaInfo: Partial<PackageSettings> = JSON.parse(file.content);
            metaInfo.name = name;
            file.content = JSON.stringify(metaInfo, null, 2);
        }
        catch (e) {
            console.warn(`Unable to set name property in file '${PACKAGE_DOT_JSON}'.`);
        }
    }

    get version(): string | undefined {
        if (this.existsPackageJson()) {
            return this.packageInfo.version;
        }
        else {
            return void 0;
        }
    }

    set version(version: string | undefined) {
        const file = this.ensurePackageJson();
        const metaInfo: Partial<PackageSettings> = JSON.parse(file.content);
        metaInfo.version = version;
        file.content = JSON.stringify(metaInfo, null, 2);
    }

    get author(): string | undefined {
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

    set author(author: string | undefined) {
        const file = this.ensurePackageJson();
        const metaInfo: PackageSettings = JSON.parse(file.content);
        setOptionalStringProperty('author', author, metaInfo);
        file.content = JSON.stringify(metaInfo, null, 2);
    }

    get description(): string | undefined {
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

    set description(description: string | undefined) {
        const file = this.ensurePackageJson();
        const metaInfo: PackageSettings = JSON.parse(file.content);
        setOptionalStringProperty('description', description, metaInfo);
        file.content = JSON.stringify(metaInfo, null, 2);
    }

    get keywords(): string[] {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    if (this.packageInfo.keywords) {
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
        const metaInfo: PackageSettings = JSON.parse(file.content);
        setOptionalStringArrayProperty('keywords', keywords, metaInfo);
        file.content = JSON.stringify(metaInfo, null, 2);
    }

    get linting(): boolean {
        if (this.existsPackageJson()) {
            const pkgInfo = this.packageInfo;
            if (pkgInfo) {
                return pkgInfo.linting ? true : false;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    set linting(linting: boolean) {
        try {
            const file = this.ensurePackageJson();
            const metaInfo: PackageSettings = JSON.parse(file.content);
            setOptionalBooleanProperty('linting', linting, metaInfo);
            file.content = JSON.stringify(metaInfo, null, 2);
        }
        catch (e) {
            console.warn(`Unable to set linting property in file '${PACKAGE_DOT_JSON}'.`);
        }
    }

    get noLoopCheck(): boolean {
        if (this.existsPackageJson()) {
            const pkgInfo = this.packageInfo;
            if (pkgInfo) {
                return pkgInfo.noLoopCheck ? true : false;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    set noLoopCheck(noLoopCheck: boolean) {
        try {
            const file = this.ensurePackageJson();
            const metaInfo: PackageSettings = JSON.parse(file.content);
            setOptionalBooleanProperty('noLoopCheck', noLoopCheck, metaInfo);
            file.content = JSON.stringify(metaInfo, null, 2);
        }
        catch (e) {
            console.warn(`Unable to set noLoopCheck property in file '${PACKAGE_DOT_JSON}'.`);
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
            const metaInfo: PackageSettings = JSON.parse(file.content);
            setOptionalBooleanProperty('operatorOverloading', operatorOverloading, metaInfo);
            file.content = JSON.stringify(metaInfo, null, 2);
        }
        catch (e) {
            console.warn(`Unable to set operatorOverloading property in file '${PACKAGE_DOT_JSON}'.`);
        }
    }

    /**
     * A map from package name to semantic version.
     */
    get dependencies(): { [packageName: string]: string } {
        try {
            if (this.existsPackageJson()) {
                const pkgInfo = this.packageInfo;
                if (pkgInfo) {
                    const dependencyMap = this.packageInfo.dependencies;
                    if (dependencyMap) {
                        return dependencyMap;
                    }
                    else {
                        return {};
                    }
                }
                else {
                    return {};
                }
            }
            else {
                return {};
            }
        }
        catch (e) {
            console.warn(e);
            return {};
        }
    }

    /**
     * A map from package name to semantic version.
     */
    set dependencies(dependencies: { [packageName: string]: string }) {
        try {
            const file = this.ensurePackageJson();
            const metaInfo: PackageSettings = JSON.parse(file.content);
            metaInfo.dependencies = dependencies;
            file.content = JSON.stringify(metaInfo, null, 2);
        }
        catch (e) {
            console.warn(`Unable to set dependencies property in file '${PACKAGE_DOT_JSON}'.`);
        }
    }

    private existsPackageJson(): boolean {
        return this.existsFile(PACKAGE_DOT_JSON);
    }

    private ensurePackageJson(): DoodleFile {
        return this.ensureFile(PACKAGE_DOT_JSON, '{}');
    }

    private ensureFile(path: string, content: string): DoodleFile {
        const existingFile = this.findFileByName(path);
        if (existingFile) {
            return existingFile;
        }
        else {
            const file = this.newFile(path);
            file.content = content;
            file.language = modeFromName(path);
            return file;
        }
    }

    /**
     *
     */
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

        const paths = Object.keys(this.files);
        for (const path of paths) {
            const file = this.files[path];
            if (file.isOpen) {
                file.selected = true;
                return;
            }
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
                delete this.files[path];
                delete this.lastKnownJs[path];
                delete this.lastKnownJsMap[path];
            }
        }
        else {
            console.warn(`deleteFile(${path}), ${path} was not found.`);
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
     *
     */
    getHtmlFileChoice(): string | undefined {
        const names = Object.keys(this.files);
        const iLen = names.length;
        for (let i = 0; i < iLen; i++) {
            const name = names[i];
            if (this.files[name].htmlChoice) {
                return name;
            }
        }
        return void 0;
    }

    /**
     * If a file has been explicitly marked as being the preview file then use it.
     * Otherwise, make a best guess from the available files.
     * This will improve the user experience.
     */
    getHtmlFileChoiceOrBestAvailable(): string | undefined {
        const previewFile = this.getHtmlFileChoice();
        if (previewFile) {
            return previewFile;
        }
        else {
            let bestFile: string | undefined;
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
     *
     */
    findFileByName(path: string): DoodleFile | undefined {
        if (this.files) {
            return this.files[path];
        }
        else {
            return void 0;
        }
    }

    /**
     *
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

                    // Initialize properties that depend upon the new name.
                    newFile.language = mode;

                    this.files[newName] = newFile;
                }
                else {
                    // We can recycle a file from trash.
                    this.restoreFileFromTrash(newName);
                    const theFile = this.findFileByName(newName);
                    if (theFile) {
                        // Initialize properties that depend upon the new name.
                        theFile.language = mode;
                    }
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
     *
     */
    setHtmlFileChoice(name: string): void {
        const file = this.findFileByName(name);
        if (file) {
            const names = Object.keys(this.files);
            const iLen = names.length;
            for (let i = 0; i < iLen; i++) {
                const name = names[i];
                this.files[name].htmlChoice = false;
            }
            file.htmlChoice = true;
        }
        else {
            // Do nothing
        }
    }

    /**
     *
     */
    setMarkdownFileChoice(name: string): void {
        const file = this.findFileByName(name);
        if (file) {
            const names = Object.keys(this.files);
            const iLen = names.length;
            for (let i = 0; i < iLen; i++) {
                const name = names[i];
                this.files[name].markdownChoice = false;
            }
            file.markdownChoice = true;
        }
        else {
            // Do nothing
        }
    }
}
