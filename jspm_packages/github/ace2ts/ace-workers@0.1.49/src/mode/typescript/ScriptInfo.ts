import Delta from '../../Delta';
import Document from '../../Document';

/**
 * @class ScriptInfo
 */
export default class ScriptInfo {

    private doc: Document;

    /**
     * @property version
     * @type number
     */
    public version: number;

    /**
     * @class ScriptInfo
     * @constructor
     * @param textOrLines {string}
     */
    constructor(textOrLines: string) {
        this.version = 1;
        this.doc = new Document(textOrLines);
    }

    /**
     * Updates the content and bumps the version number.
     *
     * @method updateContent
     * @param content {string}
     * @return {void}
     */
    public updateContent(content: string): void {
        this.doc.setValue(content);
        this.version++;
    }

    /**
     * @method applyDelta
     * @param delta {Delta}
     * @return {void}
     */
    public applyDelta(delta: Delta): void {
        this.doc.applyDelta(delta);
        this.version++;
    }

    /**
     * @method getValue
     * @return {string}
     */
    public getValue(): string {
        return this.doc.getValue();
    }
}