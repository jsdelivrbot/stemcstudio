import Document from '../../editor/Document';
import EditSession from '../../editor/EditSession';
import Shareable from '../../base/Shareable';

export default class WsFile implements Shareable {

    /**
     *
     */
    editSession: EditSession;

    /**
     * This might equally well be called the 'mode' because we don't change the language easily.
     * Note that the editSession contains a $mode: LanguageMode.
     * TODO: Rename to 'mode'.
     * TODO: Eventually, we would like the mode to be extensible.
     */
    language: string;

    /**
     * The file is open for editing.
     */
    public isOpen = true;

    /**
     * 
     */
    public preview = false;

    /**
     * Let's us know if this file exists in GitHub.
     */
    public raw_url: string;

    /**
     * 
     */
    public selected: boolean = false;

    /**
     * 
     */
    private refCount = 1;

    constructor(editSession: EditSession) {
        // console.lg("WsFile.constructor");
        if (!(editSession instanceof EditSession)) {
            throw new TypeError("editSession must be an EditSession");
        }
        this.editSession = editSession;
    }

    clone(): WsFile {
        // There is currently no clone() method on an EditSession so we lose information.
        const editSession = new EditSession(new Document(this.editSession.getValue()));
        const copy = new WsFile(editSession);
        copy.isOpen = this.isOpen;
        copy.language = this.language;
        copy.raw_url = this.raw_url;
        copy.selected = this.selected;
        // copy.size = this.size;
        // copy.truncated = this.truncated;
        // copy.type = this.type;
        return copy;
    }

    /**
     * 
     */
    addRef(): number {
        this.refCount++;
        return this.refCount;
    }

    /**
     * 
     */
    release(): number {
        this.refCount--;
        return this.refCount;
    }

    /**
     * 
     */
    protected destructor(): void {
        console.log("WsFile.destructor");
    }
}