import Document from '../../editor/Document';
import Shareable from '../../base/Shareable';

export default class WsFile implements Shareable {

    /**
     * TODO: This will probably get replaced by an EditSession (but not an Editor).
     */
    document: Document;

    /**
     * This might equally well be called the 'mode' because we don't change the language easily.
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

    constructor(document: Document) {
        // console.lg("WsFile.constructor");
        if (!(document instanceof Document)) {
            throw new TypeError("document must be a Document");
        }
        this.document = document;
    }

    clone(): WsFile {
        const copy = new WsFile(new Document(this.document.getValue()));
        // copy.content = this.content;
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