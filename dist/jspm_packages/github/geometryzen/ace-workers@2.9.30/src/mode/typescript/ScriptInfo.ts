import { Delta } from '../../editor/Delta';
import { Document } from '../../editor/Document';

/**
 *
 */
export class ScriptInfo {

    private readonly doc: Document;

    /**
     *
     */
    public version: number;

    /**
     *
     */
    constructor(textOrLines: string, version: number) {
        this.version = version;
        this.doc = new Document(textOrLines);
    }

    /**
     * Updates the content and bumps the version number.
     */
    public updateContent(content: string): void {
        this.updateContentAndVersionNumber(content, this.version + 1);
    }

    /**
     * Updates the content and sets the version number.
     */
    public updateContentAndVersionNumber(content: string, version: number): void {
        this.doc.setValue(content);
        this.version = version;
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
