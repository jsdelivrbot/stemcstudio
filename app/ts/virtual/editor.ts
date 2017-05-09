import { Observable } from 'rxjs/Observable';
import { EditorCommandable } from './EditorCommandable';

export interface Annotation {
    row: number;
    column?: number;
}

export interface CommandManager<TARGET> {
    hashHandler: KeyboardHandler<TARGET>;
    exec(command: Command<TARGET>, target?: TARGET, args?: any): boolean;
    getCommandByName(name: string): Command<TARGET>;
}

/**
 *
 */
export interface Command<TARGET> {

    /**
     *
     */
    name?: string;

    /**
     *
     */
    exec?: Action<TARGET>;

    /**
     *
     */
    bindKey?: string | { win: string | null; mac: string | null };

    /**
     * "fileJump", what else?
     */
    group?: 'fileJump';

    /**
     * 'single' is an instruction to exit the multi selection mode.
     */
    multiSelectAction?: 'forEach' | 'forEachLine' | 'single' | Action<TARGET>;

    /**
     *
     */
    passEvent?: boolean;

    /**
     * false if this command should not apply in readOnly mode
     */
    readOnly?: boolean;

    /**
     *
     */
    scrollIntoView?: 'animate' | 'center' | 'cursor' | 'none' | 'selection' | 'selectionPart';

    /**
     * Determines the context for the command.
     */
    isAvailable?: (target: TARGET) => boolean;
}

export interface Completer<T extends Editor> {
    getCompletionsAtPosition(editor: T, position: Position, prefix: string): Promise<Completion[]>;
}

export interface Completion {

}

export interface Delta {
    action: 'insert' | 'remove';
    start: Position;
    end: Position;
    lines: string[];
}

export interface EditorEventHandler {
    (event: any, editor: Editor): void;
}

export enum Direction {
    /**
     * Down.
     */
    FORWARD = +1,
    /**
     * Up
     */
    BACKWARD = -1
}

export type EditorEventType = 'change' | 'changeAnnotation' | 'changeSelection' | 'changeSession' | 'mouseup';

/**
 * A wrapper around an HTMLElement for controlling an editor.
 * The editor can be thought of as a controller containing a model and a view.
 */
export interface Editor extends EditorCommandable {
    addCommand(command: Command<EditorCommandable>): void;
    addCompleter<T extends Editor>(completer: Completer<T>): void;
    blur(): void;
    createQuickInfoTooltip(path: string, host: QuickInfoTooltipHost): QuickInfoTooltip | undefined;
    dispose(): void;
    execCommand(command: Command<EditorCommandable>): void;
    focus(): void;
    getCommandByName(name: string): Command<EditorCommandable>;
    getContainer(): HTMLElement;
    resize(force?: boolean): void;
    selectPageDown(): void;
    selectPageUp(): void;
    setDisplayIndentGuides(displayIndentGuides: boolean): void;
    setFontSize(fontSize: string): void;
    setPadding(padding: number): void;
    setReadOnly(readOnly: boolean): void;
    setShowFoldWidgets(showFoldWidgets: boolean): void;
    setShowGutter(showGutter: boolean): void;
    setShowInvisibles(showInvisibles: boolean): void;
    setShowLineNumbers(showLineNumbers: boolean): void;
    setShowPrintMargin(showPrintMargin: boolean): void;
    setThemeCss(themeId: string, href?: string): void;
    setThemeDark(isdark: boolean): void;
    setWrapBehavioursEnabled(wrapBehaviorsEnabled: boolean): void;
    updateBackMarkers(): void;
    updateFrontMarkers(): void;
    updateFull(): void;
}

export interface Action<TARGET> {
    (target: TARGET, args?: any): void;
}

/**
 * The editor service is a factory for creating editors and sessions.
 */
export interface EditorService {
    createSession(text: string): EditSession;
    createEditor(container: HTMLElement): Editor;
}

export interface EditSessionEventHandler<T> {
    (data: T): void;
}

export interface EditSessionChangeHandler extends EditSessionEventHandler<Delta> {
}

export type EditSessionEventType = 'change' | 'workerCompleted';


export interface Selection {
    fromOrientedRange(range: Range): void;
    getRange(): Range;
    isEmpty(): boolean;
    toOrientedRange(): Range;
    inVirtualMode: boolean;
    ensureRangeList(): void;
}

export interface IndexStart {
    /**
     * The index of the token in the row from which it was taken.
     */
    index: number;

    /**
     * The start column.
     */
    start: number;
}

export interface FoldWidget {

}

export interface EditorMouseEvent {
}

/**
 * Contract between Editor (as a controller) and EditSession.
 */
export interface EditorControllerEditSession {
    /**
     * Used by the Gutter Layer.
     */
    getFirstLineNumber(): number;
    /**
     * Changing the first line number causes a 'breakpoint' event to be emitted.
     */
    setFirstLineNumber(firstLineNumber: number): void;

    $highlightLineMarker: any;
    $selectionMarker: any;
    $selectionMarkers: any[];
    $tagHighlight: number | null;
    /**
     * This is a marker identifier for which bracket market to highlight.
     */
    $bracketHighlight: number | undefined;
    $backMarkers: { [id: number]: Marker };
    $useWrapMode: boolean;
    selection: Selection | undefined;
    selectionMarkerCount: number;
    foldWidgets: any;
    selectionOrThrow(): Selection;
    setSelection(selection: Selection | undefined): void;
    multiSelect: Selection | undefined;
    bgTokenizer: any;
    $clipPositionToDocument(row: number, column: number): Position;
    addRef(): number;
    release(): number;
    getValue(): string;
    setValue(text: string): void;
    getAllLines(): string[];
    getLength(): number;
    getLine(row: number): string;
    getLines(firstRow: number, lastRow: number): string[];
    getTextRange(range: Range): string;
    highlight(regExp: RegExp | null | undefined): void;
    getAnnotations(): any[];
    modeOrThrow(): any;
    docOrThrow(): any;
    getTabString(): string;
    remove(range: Range): void;
    getState(row: number): string;
    mergeUndoDeltas: boolean;
    getOverwrite(): boolean;
    getTabSize(): number;
    setTabSize(tabSize: number): void;
    getUseSoftTabs(): boolean;

    indentRows(firstRow: number, lastRow: number, indent: string): any;
    outdentRows(range: Range): void;

    getSelection(): Selection | undefined;
    replace(range: Range, newText: string): void;
    removeInLine(row: number, startColumn: number, endColumn: number): Position;
    removeFullLines(firstRow: number, lastRow: number): string[];
    getRowFoldStart(row: number): number;
    getRowFoldEnd(row: number): number;
    duplicateLines(firstRow: number, lastRow: number): void;
    documentToScreenRow(row: number, column: number): number;
    documentToScreenColumn(row: number, column: number): number;
    documentToScreenPosition(row: number, column: number): Position;
    screenToDocumentPosition(row: number, column: number): Position;
    moveText(range: Range, position: Position, copy: boolean): void;
    insert(point: Position, text: string): void;
    /**
     * Shifts all the lines in the document down one, starting from `firstRow` and ending at `lastRow`.
     *
     * @param firstRow The starting row to move down.
     * @param lastRow The final row to move down.
     * @returns If `firstRow` is less-than or equal to 0, this function returns 0.
     * Otherwise, on success, it returns -1.
     */
    moveLinesDown(firstRow: number, lastRow: number): number;
    moveLinesUp(firstRow: number, lastRow: number): void;

    getBracketRange(position: Position): Range | null;

    getWordRange(row: number, column: number): Range;

    on(eventName: string, handler: (event: any, session: EditSession) => void): void;
    off(eventName: string, handler: (event: any, session: EditSession) => void): void;

    getUseWrapMode(): boolean;

    getScrollTop(): number;
    getScrollLeft(): number;

    _signal(eventName: EditSessionEventType, event?: any): void;

    getParentFoldRangeData(row: number, ignoreCurrent?: boolean): { range?: Range; firstRange?: Range };
    onFoldWidgetClick(row: number, e: EditorMouseEvent): void;
}

export interface EditSession extends EditorControllerEditSession {
    readonly changeEvents: Observable<Delta>;
    foldWidgets: (FoldWidget | null)[] | null;
    /**
     * DEPRECATED Use the `changeEvents` observable property instead.
     */
    addChangeListener<T extends EditSession>(callback: (event: Delta, source: T) => void): () => void;
    /**
     * DEPRECATED Use the `changeEvents` observable property instead.
     */
    removeChangeListener<T extends EditSession>(callback: (event: Delta, source: T) => void): void;
    addMarker(range: Range, clazz: string, type: MarkerType, renderer?: MarkerRenderer | null, inFront?: boolean): number;
    addRef(): number;
    clearAnnotations(): void;
    /**
     *
     */
    documentToScreenRange(range: Range): Range;

    findMatchingBracket(position: Position, chr?: string): Position | null;
    findOpeningBracket(bracket: string, position: Position, typeRe?: RegExp): Position | null;
    findClosingBracket(bracket: string, position: Position, typeRe?: RegExp): Position | null;

    getAnnotations(): Annotation[];
    /**
     * Returns a copy of all lines in the document.
     * These lines do not include the line terminator.
     */
    getAllLines(): string[];
    getFoldWidget: (row: number) => FoldWidget;
    getLength(): number;
    getLine(row: number): string;
    getMarkers(inFront: boolean): { [id: number]: Marker };
    /**
     * Returns the position (on screen) for the last character in the provided screen row.
     */
    getScreenLastRowColumn(screenRow: number): number;
    getState(row: number): string;
    getTabSize(): number;
    getTabString(): string;
    getTokenAt(row: number, column?: number): TokenWithIndex | null | undefined;
    getTokens(row: number): HighlighterToken[];
    getTextRange(range?: Range): string;
    getUseSoftTabs(): boolean;
    getValue(): string;
    getWordRange(row: number, column: number): Range;
    /**
     *
     */
    getRowWrapIndent(screenRow: number): number;
    highlight(re: RegExp): void;
    indexToPosition(index: number, startRow?: number): Position;
    /**
     * Inserts a block of `text` at the indicated `position`.
     * Returns the end position of the inserted text.
     * Triggers a 'change' event on the document.
     * Throws if the document is not defined.
     */
    insert(position: Position, text: string): Position;
    /**
     * Inserts `text` into the `position` at the current row. This method also triggers the `"change"` event.
     * 
     * This differs from the `insert` method in two ways:
     *   1. This does NOT handle newline characters (single-line text only).
     *   2. This is faster than the `insert` method for single-line text insertions.
     */
    insertInLine(position: Readonly<Position>, text: string): Position;
    modeOrThrow(): LanguageMode;
    on(eventName: EditSessionEventType, callback: EditSessionEventHandler<any>): () => void;
    off(eventName: EditSessionEventType, callback: EditSessionEventHandler<any>): void;
    positionToIndex(position: Position): number;
    release(): number;
    removeMarker(markerId: number): void;
    selectionOrThrow(): Selection;
    setAnnotations(annotations: Annotation[]): void;
    setLanguage(mode: LanguageModeId): Promise<void>;
    // This is a reminder that we should be able to register new modes.
    // setLanguageMode(mode: LanguageMode, callback: (err: any) => void): void;
    setUseWorker(useWorker: boolean): void;
    setUseWrapMode(useWrapMode: boolean): void;
    setValue(text: string): void;
    /**
     * The session is expected to emita workerCompleted event.
     */
    onWorkerCompleted(annotations: Annotation[]): void;
}

export interface KeyboardResponse<TARGET> {
    /**
     *
     */
    command: Command<TARGET> | null;
    /**
     *
     */
    args?: any;
    /**
     *
     */
    passEvent?: boolean;
}

export interface KeyboardHandler<TARGET> {
    commandKeyBinding: { [hashId: number]: { [name: string]: Command<TARGET> } };
    handleKeyboard: (data: any, hashId: number, keyString: string, keyCode?: number, e?: KeyboardEvent) => KeyboardResponse<TARGET> | undefined;
    attach(target: TARGET): void;
    detach(target: TARGET): void;
}

/**
 * 
 */
export type LanguageModeId = 'C' | 'C++' | 'Clojure' | 'CSS' | 'CSV' | 'GLSL' | 'Haskell' | 'HTML' | 'JavaScript' | 'JSX' | 'JSON' | 'LESS' | 'Markdown' | 'Python' | 'Scheme' | 'Text' | 'TypeScript' | 'TSX' | 'XML' | 'YAML';

export interface LanguageModeWorker {
    dispose(): void;
}

export type FoldStyle = 'all' | 'manual' | 'markbegin' | 'markbeginend';

export interface FoldMode {
    getFoldWidget(session: EditSession, foldStyle: FoldStyle, row: number): FoldWidget;
    getFoldWidgetRange(session: EditSession, foldStyle: FoldStyle, row: number): Range | null | undefined;
}

/**
 * (type, value)
 */
export interface BasicToken {
    /**
     *
     */
    type: string;

    /**
     *
     */
    value: string;
}

interface TokenizedLine<T extends BasicToken, E, S extends Array<string | E>> {

    /**
     *
     */
    state: string | S;

    /**
     *
     */
    tokens: T[];
}

export interface Tokenizer<T extends BasicToken, E, S extends (string | E)[]> {
    getLineTokens(line: string, startState: string | E | S | null | undefined): TokenizedLine<T, E, S>;
}

export type HighlighterToken = BasicToken;
export type HighlighterStackElement = number | string;
export type HighlighterStack = HighlighterStackElement[];

export interface TextAndSelection {

}

export interface TransformHost {

}

export interface LanguageMode {
    /**
     *
     */
    $id: LanguageModeId;

    /**
     * 
     */
    wrap: 'code' | 'text' | 'auto';

    /**
     *
     */
    $indentWithTabs: boolean;

    /**
     *
     */
    foldingRules: FoldMode;

    /**
     *
     */
    modes: LanguageMode[];

    /**
     *
     */
    nonTokenRe: RegExp;

    /**
     *
     */
    tokenRe: RegExp;

    /**
     * Performs any replacement needed to outdent the current line.
     */
    autoOutdent(state: string, session: EditSession, row: number): void;

    /**
     * text is the character sequence entered.
     * Should return true or false on whether to call autoOutdent.
     */
    checkOutdent(state: string, line: string, text: string): boolean;

    /**
     * Called to create a worker which can perform analysis in the background.
     * This analysis is usually for detecting syntax errors.
     */
    createWorker(session: EditSession, callback: (err: any, worker?: LanguageModeWorker) => void): void;

    /**
     *
     */
    getCompletions(state: string, session: EditSession, position: Position, prefix: string): Completion[];

    /**
     *
     */
    getMatching(session: EditSession): OrientedRange;

    /**
     *
     */
    getNextLineIndent(state: string, line: string, tab: string): string;

    /**
     *
     */
    getTokenizer(): Tokenizer<HighlighterToken, HighlighterStackElement, HighlighterStack>;

    /**
     *
     */
    toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): void;

    /**
     *
     */
    toggleBlockComment(state: string, session: EditSession, range: Range, cursor: Position): void;

    /**
     *
     */
    transformAction(state: string, action: string, editor: TransformHost, session: EditSession, data: string | Range): TextAndSelection | Range | undefined;
}

export interface LineWidget {
    coverGutter: boolean;
    el: HTMLDivElement;
    fixedWidth?: boolean;
    row: number;
    type?: 'errorMarker';
    destroy?(): void;
}

export interface MarkerLayer {

}

export interface MarkerConfig {

}

export interface MarkerRange extends Range {
}

export interface Marker {

    /**
     *
     */
    clazz: string;

    /**
     *
     */
    id?: number;

    /**
     *
     */
    inFront?: boolean;

    /**
     *
     */
    range?: MarkerRange;

    /**
     *
     */
    renderer?: MarkerRenderer | null;

    /**
     * One of "fullLine", "line", "text", or "screenLine".
     */
    type: MarkerType;

    /**
     *
     */
    update?: (html: (number | string)[], markerLayer: MarkerLayer, session: EditSession, config: MarkerConfig) => void;
}

export type MarkerType = 'fullLine' | 'line' | 'text' | 'screenLine';

export interface MarkerRenderer {
    (html: (number | string)[], range: Range, left: number, top: number, config: MarkerConfig): void;
}

export interface PixelPosition {
    left: number;
}

export interface Position {
    row: number;
    column: number;
}

/**
 * The vanilla combination of (start, end) positions.
 */
export interface Range {
    /**
     * The starting position of the range.
     */
    start: Position;

    /**
     * The ending position of the range.
     */
    end: Position;
}

export interface RangeWithCollapseChildren extends Range {
    collapseChildren: number;
}

export interface RangeWithMarkerId extends Range {
    markerId: number;
}

export interface OrientedRange extends RangeWithCollapseChildren {
    cursor: Position;
    desiredColumn: number | null;
    isBackwards: boolean;
}

export interface RangeSelectionMarker extends OrientedRange, RangeWithMarkerId {
}

export interface Tabstop {

}

export interface TabstopManager {
    addTabstops(tabstops: Tabstop[], start: Position, end: Position, selectionIndex: number | false): void;
}

export interface Token extends BasicToken, Partial<IndexStart> {
    index: number;
    start: number;
}

/**
 * EditSession promotes BasicToken by adding (index, start)
 */
export interface TokenWithIndex extends BasicToken, IndexStart {
}

export interface UndoManager {

}

export interface QuickInfo {

}

export interface QuickInfoTooltip {
    init(): void;
    terminate(): void;
}

export interface QuickInfoTooltipHost {
    getQuickInfoAtPosition(path: string, position: number): Promise<QuickInfo>;
}

export interface Snippet {
    /**
     * 
     */
    content: string;

    /**
     *
     */
    endRe?: RegExp;

    /**
     * The begin marker for a Trigger (optional).
     */
    trigger?: string;

    /**
     * The end marker for a Trigger (optional)
     */
    endTrigger?: string;

    /**
     *
     */
    endTriggerRe?: RegExp;

    /**
     * The begin marker for a Guard (optional).
     */
    guard?: string;

    /**
     * The end marker for a Guard (optional).
     */
    endGuard?: string;

    /**
     *
     */
    matchAfter?: RegExpExecArray | string[];

    /**
     *
     */
    matchBefore?: RegExpExecArray | string[];

    /**
     *
     */
    name?: string;

    /**
     *
     */
    replaceAfter?: string;

    /**
     *
     */
    replaceBefore?: string;

    /**
     *
     */
    scope?: string;

    /**
     *
     */
    startRe?: RegExp;

    /**
     *
     */
    tabTrigger?: string;

    /**
     *
     */
    triggerRe?: RegExp;
}

export interface SnippetOptions {
    dryRun?: boolean;
}
