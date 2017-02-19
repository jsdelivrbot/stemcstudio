import Delta from '../../Delta';
import Document from '../../Document';

/**
 *
 */
export default class ScriptInfo {

    private readonly doc: Document;

    /**
     *
     */
    public version: number;

    /**
     *
     */
    constructor(textOrLines: string) {
        this.version = 1;
        this.doc = new Document(textOrLines);
    }

    /**
     * Updates the content and bumps the version number.
     */
    public updateContent(content: string): void {
        this.doc.setValue(content);
        this.version++;
    }

    /**
     * 
     */
    public applyDelta(delta: Delta): void {
        this.doc.applyDelta(delta);
        this.version++;
    }

    /**
     *
     */
    public getValue(): string {
        return this.doc.getValue();
    }
}
