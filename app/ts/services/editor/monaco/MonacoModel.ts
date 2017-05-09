import Delta from '../../../editor/Delta';
import { EditSession } from '../../../editor/EditSession';
import { rowToLineNumber, columnToMonaco } from './virtualToMonaco';
import { lineNumberToRow, monacoToNativePosition } from './monacoToNative';

/**
 * Experiment in containing the model.
 * WARNING: This uses many undocumented APIs in Monaco.
 */
export class MonacoModel implements monaco.editor.IModel {

    /**
     * 
     */
    constructor(private session: EditSession) {
        // The session will be released in the dispose method.
        this.session.addRef();
    }

    get id(): string {
        return this.session.id;
    }
    set id(id: string) {
        throw new Error("id is readonly");
    }
    get uri(): monaco.Uri {
        return this.session.uri;
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
        this.session.getTokens(lineNumberToRow(lineNumber));
    }

    setMode(languageIdentifier: monaco.editor.LanguageIdentifier): void {
        const language = languageIdentifier.language as any;
        this.session.setLanguage(language);
    }

    findMatchingBracketUp(bracket: string, position: monaco.IPosition): monaco.Range {
        return this.session.modeOrThrow().getMatching.findMatchingBracketUp(bracket, position);
    }

    matchBracket(position: monaco.IPosition): [monaco.Range, monaco.Range] {
        const range = this.session.getBracketRange(monacoToNativePosition(position));
        if (range) {
            //
        }
        else {
            //
        }
    }

    getLanguageIdAtPosition(lineNumber: number, column: number): monaco.editor.LanguageId {
        return this.session.getLanguageIdAtPosition(lineNumber, column);
    }

    getLineTokens(lineNumber: number): monaco.editor.LineTokens {
        return this.session.getLineTokens(lineNumber);
    }

    setValueFromTextSource(newValue: monaco.editor.ITextSource): void {
        return this.session.setValueFromTextSource(newValue);
    }

    equals(other: monaco.editor.ITextSource): boolean {
        return this.session.equals(other);
    }

    getIndentLevel(lineNumber: number): number {
        return this.session.getIndentLevel(lineNumber);
    }

    getIndentRanges(): monaco.editor.IndentRange[] {
        return this.session.getIndentRanges();
    }

    getLineIndentGuide(lineNumber: number): number {
        return this.session.getLineIndentGuide(lineNumber);
    }

    _addMarker(internalDecorationId: number, lineNumber: number, column: number, stickToPreviousCharacter: boolean): string {
        // this.session.addMarker()
        // return this.session._addMarker(internalDecorationId, lineNumber, column, stickToPreviousCharacter);
    }

    /**
     * @internal
     */
    _changeMarker(id: string, newLineNumber: number, newColumn: number): void {
        // return this.session._changeMarker(id, newLineNumber, newColumn);
    }

    /**
     * @internal
     */
    _changeMarkerStickiness(id: string, newStickToPreviousCharacter: boolean): void {
        // return this.session._changeMarkerStickiness(id, newStickToPreviousCharacter);
    }

    /**
     * @internal
     */
    _getMarker(id: string): monaco.Position {
        // return this.session.._getMarker(id);
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
        const range = this.session.getUndoManager().undo();
        if (range) {
            const selectionStartLineNumber = rowToLineNumber(range.start.row);
            const selectionStartColumn = columnToMonaco(range.start.column);
            const positionLineNumber = rowToLineNumber(range.end.row);
            const positionColumn = columnToMonaco(range.end.column);
            return [new monaco.Selection(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn)];
        }
        else {
            return [];
        }
    }

    /**
     * Redo edit operations until the next stop point created by `pushStackElement`.
     * The inverse edit operations will be pushed on the undo stack.
     * @internal
     */
    redo(): monaco.Selection[] {
        const range = this.session.getUndoManager().redo();
        if (range) {
            const selectionStartLineNumber = rowToLineNumber(range.start.row);
            const selectionStartColumn = columnToMonaco(range.start.column);
            const positionLineNumber = rowToLineNumber(range.end.row);
            const positionColumn = columnToMonaco(range.end.column);
            return [new monaco.Selection(selectionStartLineNumber, selectionStartColumn, positionLineNumber, positionColumn)];
        }
        else {
            return [];
        }
    }

    /**
     * Set an editable range on the model.
     * @internal
     */
    setEditableRange(range: monaco.IRange): void {
        return this.session.setEditableRange(range);
    }

    /**
     * Check if the model has an editable range.
     * @internal
     */
    hasEditableRange(): boolean {
        return this.session.hasEditableRange();
    }

    /**
     * Get the editable range on the model.
     * @internal
     */
    getEditableRange(): monaco.Range {
        return this.session.getBracketRange.getEditableRange();
    }

    normalizeIndentation(str: string): string {
        return this.session.normalizeIndentation(str);
    }

    getOneIndent(): string {
        return this.session.getTabString();
    }

    updateOptions(newOpts: monaco.editor.ITextModelUpdateOptions): void {
        // return this.session.updateOptions(newOpts);
    }

    detectIndentation(defaultInsertSpaces: boolean, defaultTabSize: number): void {
        // return this.session..detectIndentation(defaultInsertSpaces, defaultTabSize);
    }

    /**
     * Push a marker onto the undo-redo stack.
     */
    pushStackElement(): void {
        // this.session.getUndoManager().
    }

    pushEditOperations(beforeCursorState: monaco.Selection[], editOperations: monaco.editor.IIdentifiedSingleEditOperation[], cursorStateComputer: monaco.editor.ICursorStateComputer): monaco.Selection[] {
        // return this.session.pushEditOperations(beforeCursorState, editOperations, cursorStateComputer);
        return [];
    }

    applyEdits(operations: monaco.editor.IIdentifiedSingleEditOperation[]): monaco.editor.IIdentifiedSingleEditOperation[] {
        this.session.docOrThrow().applyDeltas([]);
        return [];
    }

    addBulkListener(listener: monaco.editor.BulkListenerCallback): monaco.IDisposable {
        return this.session.addBulkListener(listener);
    }

    getModeId(): string {
        return this.session.getModeId();
    }

    deltaDecorations(oldDecorations: string[], newDecorations: monaco.editor.IModelDeltaDecoration[], ownerId?: number): string[] {
        return this.session.deltaDecorations(oldDecorations, newDecorations, ownerId);
    }

    removeAllDecorationsWithOwnerId(ownerId: number): void {
        return this.session.removeAllDecorationsWithOwnerId(ownerId);
    }

    getDecorationOptions(id: string): monaco.editor.IModelDecorationOptions {
        return this.session.getDecorationOptions(id);
    }

    getDecorationRange(id: string): monaco.Range {
        return this.session..getDecorationRange(id);
    }

    getLineDecorations(lineNumber: number, ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        return this.session.getLineDecorations(lineNumber, ownerId, filterOutValidation);
    }

    getLinesDecorations(startLineNumber: number, endLineNumber: number, ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        return this.session.getLinesDecorations(startLineNumber, endLineNumber, ownerId, filterOutValidation);
    }

    getDecorationsInRange(range: monaco.IRange, ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        return this.session.getDecorationsInRange(range, ownerId, filterOutValidation);
    }

    getAllDecorations(ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        return this.session.getAllDecorations(ownerId, filterOutValidation);
    }

    getWordAtPosition(position: monaco.IPosition): monaco.editor.IWordAtPosition {
        return this.session.getWordAtPosition(position);
    }

    getWordUntilPosition(position: monaco.IPosition): monaco.editor.IWordAtPosition {
        return this.session.getWordUntilPosition(position);
    }

    getOptions(): monaco.editor.TextModelResolvedOptions {
        return this.session.getOptions();
    }

    getVersionId(): number {
        return this.session.getVersionId();
    }

    getAlternativeVersionId(): number {
        return this.session.getAlternativeVersionId();
    }

    getValueLength(eol?: monaco.editor.EndOfLinePreference, preserveBOM?: boolean): number {
        return this.session.getValueLength(eol, preserveBOM);
    }

    getValueInRange(range: monaco.IRange, eol?: monaco.editor.EndOfLinePreference): string {
        return this.session.getValueInRange(range, eol);
    }

    getValueLengthInRange(range: monaco.IRange): number {
        return this.session.getValueLengthInRange(range);
    }

    getLineCount(): number {
        return this.session.docOrThrow().getLength();
    }

    getLineContent(lineNumber: number): string {
        return this.session.getLineContent(lineNumber);
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
        return this.session.getLineMinColumn(lineNumber);
    }

    getLineMaxColumn(lineNumber: number): number {
        return this.session.getLineMaxColumn(lineNumber);
    }

    getLineFirstNonWhitespaceColumn(lineNumber: number): number {
        return this.session.getLineFirstNonWhitespaceColumn(lineNumber);
    }

    getLineLastNonWhitespaceColumn(lineNumber: number): number {
        return this.session.getLineLastNonWhitespaceColumn(lineNumber);
    }

    validatePosition(position: monaco.IPosition): monaco.Position {
        return this.session.validatePosition(position);
    }

    modifyPosition(position: monaco.IPosition, offset: number): monaco.Position {
        return this.session.modifyPosition(position, offset);
    }

    onDidChangeRawContent(listener: (e: monaco.editor.ModelRawContentChangedEvent) => void): monaco.IDisposable {
        return this.session.onDidChangeRawContent(listener);
    }

    validateRange(range: monaco.IRange): monaco.Range {
        return this.session.validateRange(range);
    }

    getOffsetAt(position: monaco.IPosition): number {
        return this.session.getOffsetAt(position);
    }

    getPositionAt(offset: number): monaco.Position {
        return this.session.getPositionAt(offset);
    }

    getFullModelRange(): monaco.Range {
        return this.session.getFullModelRange();
    }

    isDisposed(): boolean {
        return this.session.isDisposed();
    }

    findMatches(searchString: string, searchOnlyEditableRange: boolean | monaco.IRange, isRegex: boolean, matchCase: boolean, wholeWord: boolean, captureMatches: boolean, limitResultCount?: number): monaco.editor.FindMatch[] {
        return this.session.findMatches(searchString, searchOnlyEditableRange, isRegex, matchCase, wholeWord, captureMatches, limitResultCount);
    }

    findNextMatch(searchString: string, searchStart: monaco.IPosition, isRegex: boolean, matchCase: boolean, wholeWord: boolean, captureMatches: boolean): monaco.editor.FindMatch {
        return this.session.findNextMatch(searchString, searchStart, isRegex, matchCase, wholeWord, captureMatches);
    }

    findPreviousMatch(searchString: string, searchStart: monaco.IPosition, isRegex: boolean, matchCase: boolean, wholeWord: boolean, captureMatches: boolean): monaco.editor.FindMatch {
        return this.session.findPreviousMatch(searchString, searchStart, isRegex, matchCase, wholeWord, captureMatches);
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
