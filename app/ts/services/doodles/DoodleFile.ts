import IDoodleFile from './IDoodleFile';

/**
 * @class DoodleFile
 */
export default class DoodleFile implements IDoodleFile {
    public content: string;
    /**
     * The file is open for editing.
     */
    public isOpen: boolean;
    /**
     * The mode of the file refers to the computing language canonical name.
     */
    public language: string;
    public preview: boolean;
    public raw_url: string;
    public selected: boolean;
    public size: number;
    public truncated: boolean;
    public type: string;

    /**
     * @class DoodleFile
     * @constructor
     */
    constructor() {
        this.content = ""
        this.isOpen = true
        this.preview = false
        this.selected = false
    }

    /**
     * @method clone
     * @return {DoodleFile}
     */
    clone(): DoodleFile {
        const copy = new DoodleFile()
        copy.content = this.content
        copy.isOpen = this.isOpen
        copy.language = this.language
        copy.raw_url = this.raw_url
        copy.selected = this.selected
        copy.size = this.size
        copy.truncated = this.truncated
        copy.type = this.type
        return copy
    }
}
