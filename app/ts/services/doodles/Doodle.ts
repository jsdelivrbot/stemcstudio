import DoodleFile from './DoodleFile';
import modeFromName from '../../utils/modeFromName';

export default class Doodle {
    public gistId: string;
    public uuid: string;
    public description: string;
    public isCodeVisible: boolean;
    public isViewVisible: boolean;
    public focusEditor: string;
    public lastKnownJs: { [name: string]: string };
    public operatorOverloading: boolean;
    public files: { [name: string]: DoodleFile };
    public trash: { [name: string]: DoodleFile } = {};
    public dependencies: string[];
    public created_at: string;
    public updated_at: string;

    constructor() {
        this.description = ""
        this.isCodeVisible = true
        this.isViewVisible = false
        this.lastKnownJs = {}
        this.operatorOverloading = true
        this.dependencies = []
    }

    /**
     * @method closeFile
     * @param name {string}
     * @return {void}
     */
    closeFile(name: string): void {
        // console.log(`Doodle.closeFile(${name})`)
        const file = this.findFileByName(name)
        if (file) {
            // We assume someone is watching this property, ready to pounce.
            // TODO: Replace with openPending flag?
            file.isOpen = false
            file.selected = false
            // console.log(`${name} => isOpen is now true`)
        }
        else {
            // Do nothing
            console.log(`${name} => was not found`)
        }
        // Select the first open file that we find.
        this.deselectAll()

        const names = Object.keys(this.files)
        const iLen = names.length
        for (let i = 0; i < iLen; i++) {
            const name = names[i]
            const file = this.files[name]
            if (file.isOpen) {
                file.selected = true
                return
            }
        }
    }

    private deselectAll() {
        const names = Object.keys(this.files)
        const iLen = names.length
        for (let i = 0; i < iLen; i++) {
            const name = names[i]
            const file = this.files[name]
            file.selected = false
        }
    }
    /**
     * Empties the map containing Gist files that are marked for deletion.
     * 
     * @method emtyTrash
     * @return {void}
     */
    emptyTrash(): void {
        this.trash = {}
    }

    private moveFileToTrash(name: string): void {
        const unwantedFile = this.files[name]
        if (unwantedFile) {
            const conflictFile = this.trash[name]
            if (!conflictFile) {
                this.trash[name] = unwantedFile
                delete this.files[name]
            }
            else {
                throw new Error(`${name} cannot be moved to trash because of a naming conflict with an existing file.`)
            }
        }
        else {
            throw new Error(`${name} cannot be moved to trash because it does not exist.`)
        }
    }

    /**
     * @method restoreFileFromTrash
     * @param name {string}
     * @return {void}
     */
    private restoreFileFromTrash(name: string): void {
        const wantedFile = this.trash[name]
        if (wantedFile) {
            const conflictFile = this.files[name]
            if (!conflictFile) {
                delete this.trash[name]
                this.files[name] = wantedFile
            }
            else {
                throw new Error(`${name} cannot be restored from trash because of a naming conflict with an existing file.`)
            }
        }
        else {
            throw new Error(`${name} cannot be restored from trash because it does not exist.`)
        }
    }

    /**
     * @method findFileByName
     * @param name {string}
     */
    findFileByName(name: string): DoodleFile {
        return this.files[name]
    }

    /**
     *
     */
    newFile(name: string): DoodleFile {
        const mode = modeFromName(name)
        if (!mode) {
            throw new Error(`${name} is not a recognized language.`)
        }
        const conflictFile = this.findFileByName(name)
        if (!conflictFile) {
            const trashedFile = this.trash[name]
            if (!trashedFile) {
                const file = new DoodleFile()
                file.language = mode
                this.files[name] = file
                return file
            }
            else {
                this.restoreFileFromTrash(name)
                trashedFile.language = mode
                return trashedFile
            }
        }
        else {
            throw new Error(`${name} already exists. The name must be unique.`)
        }
    }

    /**
     * @method openFile
     * @param name {string}
     * @return {void}
     */
    openFile(name: string): void {
        // console.log(`Doodle.openFile(${name})`)
        const file = this.findFileByName(name)
        if (file) {
            // We assume someone is watching this property, ready to pounce.
            // TODO: Replace with openPending flag?
            file.isOpen = true
            // console.log(`${name} => isOpen is now true`)
        }
        else {
            // Do nothing
            console.log(`${name} => was not found`)
        }
    }

    renameFile(oldName: string, newName: string): void {
        const mode = modeFromName(newName)
        if (!mode) {
            throw new Error(`${newName} is not a recognized language.`)
        }
        const oldFile = this.findFileByName(oldName)
        if (oldFile) {
            const existing = this.findFileByName(newName)
            if (!existing) {
                if (oldFile.raw_url) {
                    this.moveFileToTrash(oldName)
                }
                const newFile = oldFile.clone()

                // Make it clear that this file did not come from GitHub.
                newFile.raw_url = void 0
                newFile.size = void 0
                newFile.truncated = void 0
                newFile.type = void 0

                // Initialize properties that depend upon the new name.
                newFile.language = mode

                this.files[newName] = newFile
            }
            else {
                throw new Error(`${newName} already exists. The new name must be unique.`)
            }
        }
        else {
            throw new Error(`${oldName} does not exist. The old name must be the name of an existing file.`)
        }
    }

    /**
     *
     */
    selectFile(name: string): void {
        // console.log(`Doodle.selectFile(${name})`)
        const file = this.findFileByName(name)
        if (file && file.isOpen) {
            const names = Object.keys(this.files)
            const iLen = names.length
            for (let i = 0; i < iLen; i++) {
                const file = this.files[names[i]]
                if (file.isOpen) {
                    file.selected = names[i] === name
                    // console.log(`${name}.selected => ${file.selected}, ${names[i]}, ${name}`)
                }
            }
        }
        else {
            // Do nothing
            console.log(`${name} => was not found or is not open`)
        }
    }

    /**
     *
     */
    deleteFile(name: string): void {
        const file = this.findFileByName(name)
        if (file) {
            // Determine whether the file exists in GitHub so that we can delete it upon upload.
            // Use the raw_url as the sentinel. Keep it in trash for later deletion.
            if (file.raw_url) {
                this.trash[name] = this.files[name]
            }
            delete this.files[name]
            delete this.lastKnownJs[name]
        }
        else {
            console.warn(`deleteFile(${name}), ${name} was not found.`)
        }
    }
}
