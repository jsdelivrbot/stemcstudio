import { Annotation } from '../../../virtual/editor';
import { Document } from '../../../virtual/editor';
import { EditSession } from '../../../virtual/editor';
import { EditSessionEventType } from '../../../virtual/editor';
import { EditSessionEventHandler } from '../../../virtual/editor';
import { LanguageMode } from '../../../virtual/editor';
import { LanguageModeId } from '../../../virtual/editor';
import { Marker } from '../../../virtual/editor';
import { MarkerRenderer } from '../../../virtual/editor';
import { MarkerType } from '../../../virtual/editor';
import { Position } from '../../../virtual/editor';
import { Range } from '../../../virtual/editor';

import { rowToLineNumber } from './virtualToMonaco';

import { MonacoDocument } from './MonacoDocument';
import { MonacoModel } from './MonacoModel';

/**
 * @deprecated
 * This can only be used for single file editing.
 */
export class MonacoEditSession implements EditSession {
    private doc: MonacoDocument | undefined;
    private mode: LanguageMode;
    private refCount = 1;
    constructor(doc: MonacoDocument, private model: MonacoModel) {
        // console.warn(`EditSession.constructor()`);
        this.doc = doc;
        if (this.doc) {
            this.doc.addRef();
        }
    }
    protected destructor(): void {
        // console.warn(`EditSession.destructor()`);
        if (this.doc) {
            this.doc.release();
            this.doc = void 0;
        }
    }
    addMarker(range: Range, clazz: string, type: MarkerType, renderer?: MarkerRenderer | null, inFront?: boolean): number {
        console.warn(`EditSession.addMarker()`);
        return 0;
    }
    addRef(): number {
        this.refCount++;
        return this.refCount;
    }
    docOrThrow(): MonacoDocument {
        if (this.doc) {
            return this.doc;
        }
        else {
            throw new Error("doc is not defined");
        }
    }
    getAnnotations(): Annotation[] {
        console.warn(`EditSession.getAnnotations()`);
        return [];
    }
    getDocument(): Document | undefined {
        return this.doc;
    }
    getLine(row: number): string {
        console.warn(`EditSession.getLine(${row})`);
        return this.model.getLineContent(rowToLineNumber(row));
    }
    getMarkers(inFront: boolean): { [id: number]: Marker } {
        // console.warn(`EditSession.getMarkers(${inFront})`);
        return {};
    }
    getState(row: number): string {
        console.warn(`EditSession.getState(${row})`);
        return "";
    }
    getTabSize(): number {
        console.warn(`EditSession.getTabSize()`);
        return 4;
    }
    getTabString(): string {
        console.warn(`EditSession.getTabString()`);
        return '    ';
    }
    getTextRange(range?: Range): string {
        console.warn(`EditSession.getTextRange(${range})`);
        return "";
    }
    getUseSoftTabs(): boolean {
        console.warn(`EditSession.getUseSoftTabs()`);
        return true;
    }
    getWordRange(row: number, column: number): Range {
        console.warn(`EditSession.getWordRange(${row}, ${column})`);
        return { start: { row: 0, column: 0 }, end: { row: 0, column: 0 } };
    }
    highlight(re: RegExp): void {
        console.warn(`EditSession.highlight(...)`);
    }
    modeOrThrow(): LanguageMode {
        if (this.mode) {
            return this.mode;
        }
        else {
            throw new Error("mode is not defined");
        }
    }
    on(eventName: EditSessionEventType, callback: EditSessionEventHandler): () => void {
        // console.warn(`EditSession.on(${eventName})`);
        return () => {
            this.off(eventName, callback);
        };
    }
    off(eventName: EditSessionEventType, callback: EditSessionEventHandler): void {
        // console.warn(`EditSession.off(${eventName})`);
    }
    release(): number {
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        return this.refCount;
    }
    replace(range: Range, newText: string): Position {
        console.warn(`EditSession.replace(${range}, ${newText})`);
        return { row: 0, column: 0 };
    }
    removeMarker(markerId: number): void {
        console.warn(`EditSession.removeMarker(${markerId})`);
    }
    setAnnotations(annotations: Annotation[]): void {
        // console.warn(`EditSession.setAnnotations(${JSON.stringify(annotations, null, 2)})`);
    }
    setLanguage(mode: LanguageModeId): Promise<void> {
        if (this.doc) {
            // Converting the language mode identifiers to lower case is good enough for now.
            // We cast out model to an IModel to keep the compiler happy and see what happens.
            monaco.editor.setModelLanguage(this.doc.model as monaco.editor.IModel, mode.toLowerCase());
        }
        return Promise.resolve();
    }
    setUseWorker(useWorker: boolean): void {
        // console.warn(`EditSession.setUseWorker(${useWorker})`);
    }
    setUseWrapMode(useWrapMode: boolean): void {
        // console.warn(`EditSession.setUseWrapMode(${useWrapMode})`);
    }
    unfold(row: number): void {
        console.warn(`EditSession.unfold(${row})`);
    }
}
