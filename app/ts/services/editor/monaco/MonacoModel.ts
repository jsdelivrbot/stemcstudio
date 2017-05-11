import Delta from '../../../editor/Delta';
import { EditSession } from '../../../editor/EditSession';
// import { rowToLineNumber, columnToMonaco } from './virtualToMonaco';
// import { lineNumberToRow } from './monacoToNative';

/**
 * Experiment in containing the model.
 * WARNING: This uses many undocumented APIs in Monaco.
 * 
 * Difficulties in mapping:
 * 1. The monaco IModel API is not well documented (it's what is in monaco.d.ts).
 * 2. May not be able to hook all needed aspects to use workspace.
 * 3. Using many undocumented APIs (not even in the original d.ts but called anyway).
 */
export class MonacoModel implements monaco.editor.IModel {
    private uri_: monaco.Uri;
    private versionId_ = 0;
    /**
     * 
     */
    constructor(private session: EditSession) {
        // The session will be released in the dispose method.
        this.session.addRef();
    }

    get id(): string {
        throw new Error("get id");
    }
    set id(id: string) {
        throw new Error("id is readonly");
    }
    get uri(): monaco.Uri {
        return this.uri_;
    }
    set uri(uri: monaco.Uri) {
        console.warn(`uri => ${JSON.stringify(uri)}`);
        // this.session.uri = uri;
    }

    mightContainRTL(): boolean {
        return false;
        // return this.session.mightContainRTL();
    }

    mightContainNonBasicASCII(): boolean {
        return false;
        // return this.session.mightContainNonBasicASCII();
    }

    forceTokenization(lineNumber: number): void {
        throw new Error();
    }

    setMode(languageIdentifier: monaco.editor.LanguageIdentifier): void {
        throw new Error();
    }

    findMatchingBracketUp(bracket: string, position: monaco.IPosition): monaco.Range {
        throw new Error();
    }

    matchBracket(position: monaco.IPosition): [monaco.Range, monaco.Range] {
        throw new Error();
    }

    getLanguageIdAtPosition(lineNumber: number, column: number): monaco.editor.LanguageId {
        throw new Error();
    }

    getLineTokens(lineNumber: number): monaco.editor.LineTokens {
        throw new Error();
    }

    setValueFromTextSource(newValue: monaco.editor.ITextSource): void {
        throw new Error();
    }

    equals(other: monaco.editor.ITextSource): boolean {
        throw new Error();
    }

    getIndentLevel(lineNumber: number): number {
        throw new Error();
    }

    getIndentRanges(): monaco.editor.IndentRange[] {
        throw new Error();
    }

    getLineIndentGuide(lineNumber: number): number {
        throw new Error();
    }

    _addMarker(internalDecorationId: number, lineNumber: number, column: number, stickToPreviousCharacter: boolean): string {
        throw new Error();
    }

    /**
     * @internal
     */
    _changeMarker(id: string, newLineNumber: number, newColumn: number): void {
        throw new Error();
    }

    /**
     * @internal
     */
    _changeMarkerStickiness(id: string, newStickToPreviousCharacter: boolean): void {
        throw new Error();
    }

    /**
     * @internal
     */
    _getMarker(id: string): monaco.Position {
        throw new Error();
    }

    /**
     * @internal
     */
    _removeMarker(id: string): void {
        return this.session.removeMarker(parseInt(id, 10));
    }
    /**
     * Undo edit operations until the first previous stop point created by `pushStackElement`.
     * The inverse edit operations will be pushed on the redo stack.
     * @internal
     */
    undo(): monaco.Selection[] {
        throw new Error();
    }

    /**
     * Redo edit operations until the next stop point created by `pushStackElement`.
     * The inverse edit operations will be pushed on the undo stack.
     * @internal
     */
    redo(): monaco.Selection[] {
        throw new Error();
    }

    /**
     * Set an editable range on the model.
     * @internal
     */
    setEditableRange(range: monaco.IRange): void {
        throw new Error();
    }

    /**
     * Check if the model has an editable range.
     * @internal
     */
    hasEditableRange(): boolean {
        throw new Error();
    }

    /**
     * Get the editable range on the model.
     * @internal
     */
    getEditableRange(): monaco.Range {
        throw new Error();
    }

    normalizeIndentation(str: string): string {
        throw new Error();
    }

    getOneIndent(): string {
        return this.session.getTabString();
    }

    updateOptions(newOpts: monaco.editor.ITextModelUpdateOptions): void {
        throw new Error();
    }

    detectIndentation(defaultInsertSpaces: boolean, defaultTabSize: number): void {
        throw new Error();
    }

    /**
     * Push a marker onto the undo-redo stack.
     */
    pushStackElement(): void {
        throw new Error();
    }

    pushEditOperations(beforeCursorState: monaco.Selection[], editOperations: monaco.editor.IIdentifiedSingleEditOperation[], cursorStateComputer: monaco.editor.ICursorStateComputer): monaco.Selection[] {
        throw new Error();
    }

    applyEdits(operations: monaco.editor.IIdentifiedSingleEditOperation[]): monaco.editor.IIdentifiedSingleEditOperation[] {
        throw new Error();
    }

    addBulkListener(listener: monaco.editor.BulkListenerCallback): monaco.IDisposable {
        // TODO
        // It's not known what the Editor wants to listen for or how the data is formatted.
        // This would have to be reverse engineered by sniffing the traffic.
        return {
            dispose() {
                // Do nothing.
            }
        };
    }

    getModeId(): string {
        throw new Error();
    }

    deltaDecorations(oldDecorations: string[], newDecorations: monaco.editor.IModelDeltaDecoration[], ownerId?: number): string[] {
        throw new Error();
    }

    removeAllDecorationsWithOwnerId(ownerId: number): void {
        throw new Error();
    }

    getDecorationOptions(id: string): monaco.editor.IModelDecorationOptions {
        throw new Error();
    }

    getDecorationRange(id: string): monaco.Range {
        throw new Error();
    }

    getLineDecorations(lineNumber: number, ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        throw new Error();
    }

    getLinesDecorations(startLineNumber: number, endLineNumber: number, ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        throw new Error();
    }

    getDecorationsInRange(range: monaco.IRange, ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        throw new Error();
    }

    getAllDecorations(ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        throw new Error();
    }

    getWordAtPosition(position: monaco.IPosition): monaco.editor.IWordAtPosition {
        throw new Error();
    }

    getWordUntilPosition(position: monaco.IPosition): monaco.editor.IWordAtPosition {
        throw new Error();
    }

    getOptions(): monaco.editor.TextModelResolvedOptions {
        function defaultEOL(session: EditSession): monaco.editor.DefaultEndOfLine {
            switch (session.getNewLineMode()) {
                case 'unix': {
                    return monaco.editor.DefaultEndOfLine.LF;
                }
                case 'windows': {
                    return monaco.editor.DefaultEndOfLine.CRLF;
                }
                case 'auto': {
                    return monaco.editor.DefaultEndOfLine.LF;
                }
            }
        }
        const options: monaco.editor.TextModelResolvedOptions = {
            _textModelResolvedOptionsBrand: void 0,
            defaultEOL: defaultEOL(this.session),
            insertSpaces: true,
            tabSize: this.session.getTabSize(),
            trimAutoWhitespace: true
        };
        return options;
    }

    getVersionId(): number {
        return this.versionId_;
    }

    getAlternativeVersionId(): number {
        throw new Error();
    }

    getValueLength(eol?: monaco.editor.EndOfLinePreference, preserveBOM?: boolean): number {
        throw new Error();
    }

    getValueInRange(range: monaco.IRange, eol?: monaco.editor.EndOfLinePreference): string {
        throw new Error();
    }

    getValueLengthInRange(range: monaco.IRange): number {
        throw new Error();
    }

    getLineCount(): number {
        return this.session.docOrThrow().getLength();
    }

    getLineContent(lineNumber: number): string {
        throw new Error();
    }

    getLinesContent(): string[] {
        // TODO: Does it matter whether the lines are a copy or a mutable array?
        return this.session.docOrThrow().getAllLines();
    }

    getEOL(): string {
        // FIXME: This has to be broken.
        return this.session.getNewLineMode();
    }

    setEOL(eol: monaco.editor.EndOfLineSequence): void {
        switch (eol) {
            case monaco.editor.EndOfLineSequence.CRLF: {
                this.session.setNewLineMode('windows');
                break;
            }
            case monaco.editor.EndOfLineSequence.LF: {
                this.session.setNewLineMode('unix');
                break;
            }
            default: {
                this.session.setNewLineMode('auto');
            }
        }
    }

    getLineMinColumn(lineNumber: number): number {
        throw new Error();
    }

    getLineMaxColumn(lineNumber: number): number {
        throw new Error();
    }

    getLineFirstNonWhitespaceColumn(lineNumber: number): number {
        throw new Error();
    }

    getLineLastNonWhitespaceColumn(lineNumber: number): number {
        throw new Error();
    }

    validatePosition(position: monaco.IPosition): monaco.Position {
        throw new Error();
    }

    modifyPosition(position: monaco.IPosition, offset: number): monaco.Position {
        throw new Error();
    }

    onDidChangeRawContent(listener: (e: monaco.editor.ModelRawContentChangedEvent) => void): monaco.IDisposable {
        throw new Error();
    }

    validateRange(range: monaco.IRange): monaco.Range {
        throw new Error();
    }

    getOffsetAt(position: monaco.IPosition): number {
        throw new Error();
    }

    getPositionAt(offset: number): monaco.Position {
        throw new Error();
    }

    getFullModelRange(): monaco.Range {
        throw new Error();
    }

    isDisposed(): boolean {
        throw new Error();
    }

    findMatches(searchString: string, searchOnlyEditableRange: boolean | monaco.IRange, isRegex: boolean, matchCase: boolean, wholeWord: boolean, captureMatches: boolean, limitResultCount?: number): monaco.editor.FindMatch[] {
        throw new Error();
    }

    findNextMatch(searchString: string, searchStart: monaco.IPosition, isRegex: boolean, matchCase: boolean, wholeWord: boolean, captureMatches: boolean): monaco.editor.FindMatch {
        throw new Error();
    }

    findPreviousMatch(searchString: string, searchStart: monaco.IPosition, isRegex: boolean, matchCase: boolean, wholeWord: boolean, captureMatches: boolean): monaco.editor.FindMatch {
        throw new Error();
    }

    /**
     * Undocumented (Monaco). 
     */
    changeDecorations<T>(callback: (changeAccessor: monaco.editor.IModelDecorationsChangeAccessor) => T, ownerId?: number): T {
        const result = callback({
            addDecoration(range: monaco.IRange, options: monaco.editor.IModelDecorationOptions): string {
                return "";
            },
            changeDecoration(id: string, newRange: monaco.IRange): void {
                // TODO
            },
            changeDecorationOptions(id: string, newOptions: monaco.editor.IModelDecorationOptions): void {
                // TODO
            },
            deltaDecorations(oldDecorations: string[], newDecorations: monaco.editor.IModelDeltaDecoration[]): string[] {
                return [];
            },
            removeDecoration(id: string): void {
                // TODO
            }
        });
        return result;
    }

    dispose(): void {
        this.session.release();
    }

    /**
     * Undocumented (Monaco). 
     */
    getLanguageIdentifier(): monaco.editor.LanguageIdentifier {
        // return this.session.getLanguageIdentifier();
        const mode = this.session.modeOrThrow();
        // TODO: Monaco wants a number.
        // Should we rename $id to language?
        return { language: mode.$id, id: 0 };
    }

    getValue(eol?: monaco.editor.EndOfLinePreference, preserveBOM?: boolean): string {
        // TODO: EditSession API change?
        return this.session.getValue();
    }

    /**
     * Undocumented (Monaco). 
     */
    isDominatedByLongLines(): boolean {
        return false;
        // return this.session.isDominatedByLongLines();
    }

    /**
     * Undocumented (Monaco). 
     */
    isTooLargeForHavingAMode(): boolean {
        return false;
        // return this.session.isTooLargeForHavingAMode();
    }

    /**
     * Undocumented (Monaco). 
     */
    isTooLargeForHavingARichMode(): boolean {
        return false;
        // return this.session.isTooLargeForHavingARichMode();
    }

    /**
     * Undocumented (Monaco). 
     */
    onBeforeAttached(): void {
        // TODO: EditSession API change?
        // return this.session.onBeforeAttached();
    }

    /**
     * Undocumented (Monaco). 
     */
    onBeforeDetached(): void {
        // TODO: EditSession API change?
        // return this.session.onBeforeDetached();
    }

    /**
     * 
     */
    onDidChangeContent(listener: (e: monaco.editor.IModelContentChangedEvent2) => void): monaco.IDisposable {
        const remover = this.session.on('change', (delta: Delta, session: EditSession) => {
            // delta.action
            // delta.start
            // delta.end
            // delta.lines
            /*
            const range: monaco.IRange = { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 };
            listener({
                eol: '\n',
                isRedoing: false,
                isUndoing: false,
                range,
                rangeLength: 2,
                text: '',
                versionId: 10
            });
            */
        });
        return {
            dispose() {
                remover();
            }
        };
    }

    onDidChangeDecorations(listener: (e: monaco.editor.IModelDecorationsChangedEvent) => void): monaco.IDisposable {
        // return this.session.onDidChangeDecorations(listener);
        return {
            dispose() {
                // Do nothing yet.
            }
        };
    }

    onDidChangeOptions(listener: (e: monaco.editor.IModelOptionsChangedEvent) => void): monaco.IDisposable {
        // return this.session.onDidChangeOptions(listener);
        return {
            dispose() {
                // Do nothing yet.
            }
        };
    }

    onDidChangeLanguage(listener: (e: monaco.editor.IModelLanguageChangedEvent) => void): monaco.IDisposable {
        const remover = this.session.on('changeMode', (event: any, session: EditSession) => {
            listener({ oldLanguage: 'a', newLanguage: 'b' });
        });
        return {
            dispose() {
                remover();
            }
        };
    }

    onWillDispose(listener: () => void): monaco.IDisposable {
        // return this.session.onWillDispose(listener);
        return {
            dispose() {
                // Do nothing yet.
            }
        };
    }

    setValue(value: string): void {
        this.session.setValue(value);
    }
}
