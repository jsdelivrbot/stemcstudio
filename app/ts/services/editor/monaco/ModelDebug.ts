/**
 * Experiment in containg the model.
 */
export class ModelDebug implements monaco.editor.IModel {
    /**
     * 
     */
    constructor(private model: monaco.editor.IModel) {
    }

    get id(): string {
        return this.model.id;
    }
    set id(id: string) {
        throw new Error("id is readonly");
    }
    get uri(): monaco.Uri {
        return this.model.uri;
    }
    set uri(uri: monaco.Uri) {
        // console.warn(`uri => ${JSON.stringify(uri)}`);
        // this.model.uri = uri;
    }

    mightContainRTL(): boolean {
        return this.model.mightContainRTL();
    }

    mightContainNonBasicASCII(): boolean {
        return this.model.mightContainNonBasicASCII();
    }

    forceTokenization(lineNumber: number): void {
        return this.model.forceTokenization(lineNumber);
    }

    setMode(languageIdentifier: monaco.editor.LanguageIdentifier): void {
        return this.model.setMode(languageIdentifier);
    }

    findMatchingBracketUp(bracket: string, position: monaco.IPosition): monaco.Range {
        return this.model.findMatchingBracketUp(bracket, position);
    }

    matchBracket(position: monaco.IPosition): [monaco.Range, monaco.Range] {
        return this.model.matchBracket(position);
    }

    getLanguageIdAtPosition(lineNumber: number, column: number): monaco.editor.LanguageId {
        return this.model.getLanguageIdAtPosition(lineNumber, column);
    }

    getLineTokens(lineNumber: number): monaco.editor.LineTokens {
        return this.model.getLineTokens(lineNumber);
    }

    setValueFromTextSource(newValue: monaco.editor.ITextSource): void {
        return this.model.setValueFromTextSource(newValue);
    }

    equals(other: monaco.editor.ITextSource): boolean {
        return this.model.equals(other);
    }

    getIndentLevel(lineNumber: number): number {
        return this.model.getIndentLevel(lineNumber);
    }

    getIndentRanges(): monaco.editor.IndentRange[] {
        return this.model.getIndentRanges();
    }

    getLineIndentGuide(lineNumber: number): number {
        return this.model.getLineIndentGuide(lineNumber);
    }

    _addMarker(internalDecorationId: number, lineNumber: number, column: number, stickToPreviousCharacter: boolean): string {
        return this.model._addMarker(internalDecorationId, lineNumber, column, stickToPreviousCharacter);
    }

    /**
     * @internal
     */
    _changeMarker(id: string, newLineNumber: number, newColumn: number): void {
        return this.model._changeMarker(id, newLineNumber, newColumn);
    }

    /**
     * @internal
     */
    _changeMarkerStickiness(id: string, newStickToPreviousCharacter: boolean): void {
        return this.model._changeMarkerStickiness(id, newStickToPreviousCharacter);
    }

    /**
     * @internal
     */
    _getMarker(id: string): monaco.Position {
        return this.model._getMarker(id);
    }

    /**
     * @internal
     */
    _removeMarker(id: string): void {
        return this.model._removeMarker(id);
    }
    /**
     * Undo edit operations until the first previous stop point created by `pushStackElement`.
     * The inverse edit operations will be pushed on the redo stack.
     * @internal
     */
    undo(): monaco.Selection[] {
        return this.model.undo();
    }

    /**
     * Redo edit operations until the next stop point created by `pushStackElement`.
     * The inverse edit operations will be pushed on the undo stack.
     * @internal
     */
    redo(): monaco.Selection[] {
        return this.model.redo();
    }

    /**
     * Set an editable range on the model.
     * @internal
     */
    setEditableRange(range: monaco.IRange): void {
        return this.model.setEditableRange(range);
    }

    /**
     * Check if the model has an editable range.
     * @internal
     */
    hasEditableRange(): boolean {
        return this.model.hasEditableRange();
    }

    /**
     * Get the editable range on the model.
     * @internal
     */
    getEditableRange(): monaco.Range {
        return this.model.getEditableRange();
    }

    normalizeIndentation(str: string): string {
        return this.model.normalizeIndentation(str);
    }

    getOneIndent(): string {
        return this.model.getOneIndent();
    }

    updateOptions(newOpts: monaco.editor.ITextModelUpdateOptions): void {
        return this.model.updateOptions(newOpts);
    }

    detectIndentation(defaultInsertSpaces: boolean, defaultTabSize: number): void {
        return this.model.detectIndentation(defaultInsertSpaces, defaultTabSize);
    }

    pushStackElement(): void {
        return this.model.pushStackElement();
    }

    pushEditOperations(beforeCursorState: monaco.Selection[], editOperations: monaco.editor.IIdentifiedSingleEditOperation[], cursorStateComputer: monaco.editor.ICursorStateComputer): monaco.Selection[] {
        return this.model.pushEditOperations(beforeCursorState, editOperations, cursorStateComputer);
    }

    applyEdits(operations: monaco.editor.IIdentifiedSingleEditOperation[]): monaco.editor.IIdentifiedSingleEditOperation[] {
        return this.model.applyEdits(operations);
    }

    addBulkListener(listener: monaco.editor.BulkListenerCallback): monaco.IDisposable {
        return this.model.addBulkListener(listener);
    }

    getModeId(): string {
        return this.model.getModeId();
    }

    deltaDecorations(oldDecorations: string[], newDecorations: monaco.editor.IModelDeltaDecoration[], ownerId?: number): string[] {
        return this.model.deltaDecorations(oldDecorations, newDecorations, ownerId);
    }

    removeAllDecorationsWithOwnerId(ownerId: number): void {
        return this.model.removeAllDecorationsWithOwnerId(ownerId);
    }

    getDecorationOptions(id: string): monaco.editor.IModelDecorationOptions {
        return this.model.getDecorationOptions(id);
    }

    getDecorationRange(id: string): monaco.Range {
        return this.model.getDecorationRange(id);
    }

    getLineDecorations(lineNumber: number, ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        return this.model.getLineDecorations(lineNumber, ownerId, filterOutValidation);
    }

    getLinesDecorations(startLineNumber: number, endLineNumber: number, ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        return this.model.getLinesDecorations(startLineNumber, endLineNumber, ownerId, filterOutValidation);
    }

    getDecorationsInRange(range: monaco.IRange, ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        return this.model.getDecorationsInRange(range, ownerId, filterOutValidation);
    }

    getAllDecorations(ownerId?: number, filterOutValidation?: boolean): monaco.editor.IModelDecoration[] {
        return this.model.getAllDecorations(ownerId, filterOutValidation);
    }

    getWordAtPosition(position: monaco.IPosition): monaco.editor.IWordAtPosition {
        return this.model.getWordAtPosition(position);
    }

    getWordUntilPosition(position: monaco.IPosition): monaco.editor.IWordAtPosition {
        return this.model.getWordUntilPosition(position);
    }

    getOptions(): monaco.editor.TextModelResolvedOptions {
        return this.model.getOptions();
    }

    getVersionId(): number {
        return this.model.getVersionId();
    }

    getAlternativeVersionId(): number {
        return this.model.getAlternativeVersionId();
    }

    getValueLength(eol?: monaco.editor.EndOfLinePreference, preserveBOM?: boolean): number {
        return this.model.getValueLength(eol, preserveBOM);
    }

    getValueInRange(range: monaco.IRange, eol?: monaco.editor.EndOfLinePreference): string {
        return this.model.getValueInRange(range, eol);
    }

    getValueLengthInRange(range: monaco.IRange): number {
        return this.model.getValueLengthInRange(range);
    }

    getLineCount(): number {
        return this.model.getLineCount();
    }

    getLineContent(lineNumber: number): string {
        return this.model.getLineContent(lineNumber);
    }

    getLinesContent(): string[] {
        return this.model.getLinesContent();
    }

    getEOL(): string {
        return this.model.getEOL();
    }

    setEOL(eol: monaco.editor.EndOfLineSequence): void {
        return this.model.setEOL(eol);
    }

    getLineMinColumn(lineNumber: number): number {
        return this.model.getLineMinColumn(lineNumber);
    }

    getLineMaxColumn(lineNumber: number): number {
        return this.model.getLineMaxColumn(lineNumber);
    }

    getLineFirstNonWhitespaceColumn(lineNumber: number): number {
        return this.model.getLineFirstNonWhitespaceColumn(lineNumber);
    }

    getLineLastNonWhitespaceColumn(lineNumber: number): number {
        return this.model.getLineLastNonWhitespaceColumn(lineNumber);
    }

    validatePosition(position: monaco.IPosition): monaco.Position {
        return this.model.validatePosition(position);
    }

    modifyPosition(position: monaco.IPosition, offset: number): monaco.Position {
        return this.model.modifyPosition(position, offset);
    }

    onDidChangeRawContent(listener: (e: monaco.editor.ModelRawContentChangedEvent) => void): monaco.IDisposable {
        return this.model.onDidChangeRawContent(listener);
    }

    validateRange(range: monaco.IRange): monaco.Range {
        return this.model.validateRange(range);
    }

    getOffsetAt(position: monaco.IPosition): number {
        return this.model.getOffsetAt(position);
    }

    getPositionAt(offset: number): monaco.Position {
        return this.model.getPositionAt(offset);
    }

    getFullModelRange(): monaco.Range {
        return this.model.getFullModelRange();
    }

    isDisposed(): boolean {
        return this.model.isDisposed();
    }

    findMatches(searchString: string, searchOnlyEditableRange: boolean | monaco.IRange, isRegex: boolean, matchCase: boolean, wholeWord: boolean, captureMatches: boolean, limitResultCount?: number): monaco.editor.FindMatch[] {
        return this.model.findMatches(searchString, searchOnlyEditableRange, isRegex, matchCase, wholeWord, captureMatches, limitResultCount);
    }

    findNextMatch(searchString: string, searchStart: monaco.IPosition, isRegex: boolean, matchCase: boolean, wholeWord: boolean, captureMatches: boolean): monaco.editor.FindMatch {
        return this.model.findNextMatch(searchString, searchStart, isRegex, matchCase, wholeWord, captureMatches);
    }

    findPreviousMatch(searchString: string, searchStart: monaco.IPosition, isRegex: boolean, matchCase: boolean, wholeWord: boolean, captureMatches: boolean): monaco.editor.FindMatch {
        return this.model.findPreviousMatch(searchString, searchStart, isRegex, matchCase, wholeWord, captureMatches);
    }

    /**
     * Undocumented (Monaco). 
     */
    changeDecorations<T>(callback: (changeAccessor: monaco.editor.IModelDecorationsChangeAccessor) => T, ownerId?: number): T {
        return this.model.changeDecorations(callback);
    }

    dispose(): void {
        this.model.dispose();
    }

    /**
     * Undocumented (Monaco). 
     */
    getLanguageIdentifier(): monaco.editor.LanguageIdentifier {
        return this.model.getLanguageIdentifier();
    }

    getValue(eol?: monaco.editor.EndOfLinePreference, preserveBOM?: boolean): string {
        return this.model.getValue(eol, preserveBOM);
    }

    /**
     * Undocumented (Monaco). 
     */
    isDominatedByLongLines(): boolean {
        return this.model.isDominatedByLongLines();
    }

    /**
     * Undocumented (Monaco). 
     */
    isTooLargeForHavingAMode(): boolean {
        return this.model.isTooLargeForHavingAMode();
    }

    /**
     * Undocumented (Monaco). 
     */
    isTooLargeForHavingARichMode(): boolean {
        return this.model.isTooLargeForHavingARichMode();
    }

    /**
     * Undocumented (Monaco). 
     */
    onBeforeAttached(): void {
        return this.model.onBeforeAttached();
    }

    /**
     * Undocumented (Monaco). 
     */
    onBeforeDetached(): void {
        return this.model.onBeforeDetached();
    }

    /**
     * 
     */
    onDidChangeContent(listener: (e: monaco.editor.IModelContentChangedEvent2) => void): monaco.IDisposable {
        return this.model.onDidChangeContent(listener);
    }

    onDidChangeDecorations(listener: (e: monaco.editor.IModelDecorationsChangedEvent) => void): monaco.IDisposable {
        return this.model.onDidChangeDecorations(listener);
    }

    onDidChangeOptions(listener: (e: monaco.editor.IModelOptionsChangedEvent) => void): monaco.IDisposable {
        return this.model.onDidChangeOptions(listener);
    }

    onDidChangeLanguage(listener: (e: monaco.editor.IModelLanguageChangedEvent) => void): monaco.IDisposable {
        return this.model.onDidChangeLanguage(listener);
    }

    onWillDispose(listener: () => void): monaco.IDisposable {
        return this.model.onWillDispose(listener);
    }

    setValue(value: string): void {
        this.model.setValue(value);
    }
}
