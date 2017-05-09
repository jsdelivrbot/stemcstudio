import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { Delta } from '../../../virtual/editor';
import { Document } from '../../../virtual/editor';
import { Position } from '../../../virtual/editor';
import { Range } from '../../../virtual/editor';

import { MonacoModel } from './MonacoModel';

/**
 * @deprecated
 * This can only be used for single file editing.
 */
export class MonacoDocument implements Document {
    readonly changeEvents: Observable<Delta>;
    private refCount = 1;
    constructor(public model: MonacoModel) {
        //
        // The wiring for change events is standard boilerplate so long as it is done
        // in terms of the existing functions. When those are deprecated it will
        // be implemented more compactly.
        //
        this.changeEvents = new Observable<Delta>((observer: Observer<Delta>) => {
            function changeListener(delta: Delta, source: Document) {
                // console.warn(`changeEvents ${JSON.stringify(delta, null, 2)}`);
                observer.next(delta);
            }
            this.addChangeListener(changeListener);
            return () => {
                this.removeChangeListener(changeListener);
            };
        });
    }
    protected destructor(): void {
        // console.warn(`Document.destructor()`);
        this.model.dispose();
    }
    addChangeListener(callback: (delta: Delta, source: Document) => void): () => void {
        // console.warn(`Document.addChangeListener()`);
        const monacoChangeHandler = (event: monaco.editor.IModelContentChangedEvent2) => {
            // console.warn(`Document.changed ${JSON.stringify(event, null, 2)}`);
            const delta: Delta = { action: 'insert', start: { row: 0, column: 0 }, end: { row: 0, column: 0 }, lines: [] };
            callback(delta, this);
        };
        const disposable: monaco.IDisposable = this.model.onDidChangeContent(monacoChangeHandler);
        return function removeChangeListener() {
            disposable.dispose();
        };
    }
    addRef(): number {
        this.refCount++;
        return this.refCount;
    }
    getAllLines(): string[] {
        console.warn("Document.getAllLines");
        return [];
    }
    getTextRange(range: Range): string {
        console.warn("Document.getTextRange");
        return '';
    }
    getValue(): string {
        return this.model.getValue();
    }
    indexToPosition(index: number, startRow?: number): Position {
        console.warn("Document.indexToPosition");
        // return this.model.getPositionAt(index);
        return { row: 0, column: 0 };
    }
    insert(position: Position, text: string): void {
        console.warn("Document.insert");
    }
    positionToIndex(position: Position): number {
        console.warn("Document.positionToIndex");
        return 0;
    }
    release(): number {
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        return this.refCount;
    }
    remove(range: Readonly<Range>): Position {
        console.warn("Document.remove");
        return { row: 0, column: 0 };
    }
    removeChangeListener(callback: (event: Delta, source: Document) => void): void {
        // console.warn(`Document.removeChangeListener()`);
    }
    removeInLine(row: number, startColumn: number, endColumn: number): Position {
        console.warn("Document.removeInLine");
        return { row: 0, column: 0 };
    }
    setValue(value: string): void {
        this.model.setValue(value);
    }
}
