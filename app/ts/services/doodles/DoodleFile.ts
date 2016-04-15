import IDoodleFile from './IDoodleFile';

export default class DoodleFile implements IDoodleFile {
    public content: string;
    /**
     * The file is open for editing.
     */
    public isOpen: boolean;
    public language: string;
    public selected: boolean;
    constructor() {
        this.content = ""
        this.isOpen = true
        this.selected = false
    }
}
