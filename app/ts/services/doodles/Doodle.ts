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
        const existing = this.findFileByName(name)
        if (!existing) {
            const file = new DoodleFile()
            file.language = mode
            this.files[name] = file
            return file
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
            throw new Error(`${name} is not a recognized language.`)
        }
        const file = this.findFileByName(oldName)
        if (file) {
            const existing = this.findFileByName(newName)
            if (!existing) {
                this.files[newName] = file
                file.language = mode
                delete this.files[oldName]
                this.lastKnownJs[newName] = this.lastKnownJs[oldName]
                delete this.lastKnownJs[oldName]
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
            delete this.files[name]
            delete this.lastKnownJs[name]
        }
        else {
            console.warn(`deleteFile(${name}), ${name} was not found.`)
        }
    }
}
