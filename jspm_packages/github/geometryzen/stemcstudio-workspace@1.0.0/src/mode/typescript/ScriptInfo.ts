import { Delta, Document, Position } from 'editor-document';

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
     * Applies the specified delta and returns the new version number of the document.
     */
    public applyDelta(delta: Delta): number {
        this.doc.applyDelta(delta);
        this.version++;
        return this.version;
    }

    /**
     *
     */
    public getValue(): string {
        return this.doc.getValue();
    }

    /**
     * line is 1-based, column is 0-based.
     */
    public getLineAndColumn(positionIndex: number): { line: number; column: number } {
        const pos = this.doc.indexToPosition(positionIndex);
        if (pos) {
            return { line: pos.row + 1, column: pos.column };
        }
        else {
            return void 0;
        }
    }
    public positionToIndex(pos: Position): number {
        return this.doc.positionToIndex(pos, 0);
    }
    public lineAndColumnToIndex(lineAndColumn: { line: number; column: number }): number {
        return this.doc.positionToIndex({ row: lineAndColumn.line - 1, column: lineAndColumn.column }, 0);
    }
}
