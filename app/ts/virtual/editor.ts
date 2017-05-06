import { Observable } from 'rxjs/Observable';

export interface Annotation {
    row: number;
    column?: number;
}

export interface Command {

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

/**
 * A convenient wrapper for the contents of a text-based editor.
 */
export interface Document {
    readonly changeEvents: Observable<Delta>;
    addChangeListener(callback: (event: Delta, source: Document) => void): () => void;
    addRef(): number;
    getAllLines(): string[];
    getTextRange(range: Range): string;
    getValue(): string;
    indexToPosition(index: number, startRow?: number): Position;
    insert(position: Position, text: string): void;
    positionToIndex(position: Position): number;
    release(): number;
    remove(range: Readonly<Range>): Position;
    removeChangeListener(callback: (event: Delta, source: Document) => void): void;
    removeInLine(row: number, startColumn: number, endColumn: number): Position;
    setValue(value: string): void;
}

export interface EditorEventHandler {
    (event: any, editor: Editor): void;
}

export enum Direction { FORWARD = +1, BACKWARD = -1 }

export type EditorEventType = 'change' | 'changeAnnotation' | 'changeSelection' | 'changeSession' | 'mouseup';

/**
 * A wrapper around an HTMLElement for controlling an editor.
 * The editor can be thought of as a controller containing a model and a view.
 */
export interface Editor {
    addCommand(command: Command): void;
    addCompleter(completer: Completer<Editor>): void;
    addKeyboardHandler(keyboardHandler: KeyboardHandler): void;
    addLineWidget(widget: LineWidget): LineWidget;
    blur(): void;
    createKeyboardHandler(): KeyboardHandler;
    createQuickInfoTooltip(path: string, host: QuickInfoTooltipHost): QuickInfoTooltip | undefined;
    dispose(): void;
    enableLineWidgets(): void;
    enableTabStops(): TabstopManager;
    execCommand(command: Command): void;
    expandSnippetWithTab(options: { dryRun: boolean }): boolean;
    find(value: string, options: {}): Range | null | undefined;
    findAll(value: string, options: {}): number;
    findSearchBox(match: boolean): void;
    focus(): void;
    forEachSelection(action: EditorAction, args: any, options?: { keepOrder?: boolean; $byLines?: boolean }): any;
    getCommandByName(name: string): Command;
    getCursorPosition(): Position;
    getCursorPixelPosition(pos: Position): PixelPosition;
    getContainer(): HTMLElement;
    getGutterAnnotations(): ({ className: string | undefined; text: string[] } | null)[];
    getGutterWidth(): number;
    getKeyboardHandlers(): KeyboardHandler[];
    getLineWidgetsAtRow(row: number): LineWidget[];
    getReadOnly(): boolean;
    getSearchRegExp(): RegExp;
    getSelectionIndex(): number;
    getSelectionRange(): Range;
    getSession(): EditSession | undefined;
    gotoLine(lineNumber: number, column: number): void;
    isMousePressed(): boolean;
    isSnippetSelectionMode(): boolean;
    moveSelectionToPosition(pos: Position): void;
    on(eventName: EditorEventType, callback: EditorEventHandler): void;
    off(eventName: EditorEventType, callback: EditorEventHandler): void;
    registerSnippets(snippets: Snippet[]): void;
    removeKeyboardHandler(keyboardHandler: KeyboardHandler): boolean;
    removeLineWidget(widget: LineWidget): void;
    replace(value: string): void;
    replaceAll(value: string): void;
    resize(force?: boolean): void;
    scrollCursorIntoView(cursor?: Position | null, offset?: number, $viewMargin?: { top?: number; bottom?: number }): void;
    sessionOrThrow(): EditSession;
    setDisplayIndentGuides(displayIndentGuides: boolean): void;
    setFontSize(fontSize: string): void;
    setPadding(padding: number): void;
    setReadOnly(readOnly: boolean): void;
    setShowFoldWidgets(showFoldWidgets: boolean): void;
    setShowGutter(showGutter: boolean): void;
    setShowInvisibles(showInvisibles: boolean): void;
    setShowLineNumbers(showLineNumbers: boolean): void;
    setShowPrintMargin(showPrintMargin: boolean): void;
    setSession(session: EditSession): void;
    setTabSize(tabSize: number): void;
    setThemeCss(themeId: string, href?: string): void;
    setThemeDark(isdark: boolean): void;
    setUndoManager(undoManager: UndoManager): void;
    setUseSoftTabs(useSoftTabs: boolean): void;
    setWrapBehavioursEnabled(wrapBehaviorsEnabled: boolean): void;
    tabNext(direction?: Direction): void;
    updateBackMarkers(): void;
    updateFrontMarkers(): void;
    updateFull(): void;
}

export interface EditorAction {
    (editor: Editor, args?: any): void;

}

/**
 * The editor service is a factory for creating editors, sessions, and documents.
 * 
 * The ordering of creation is normally...
 * 1. Document - when a Gist is loaded.
 * 2. Editor - when the UI requires one because a file has been opened.
 * 3. EditSession - injected into the editor as needed.
 */
export interface EditorService {
    /**
     * 
     */
    createDocument(text: string): Document;
    createSession(doc: Document): EditSession;
    createEditor(container: HTMLElement): Editor;
}

export interface EditSessionEventHandler {
    (data: any, session: EditSession): void;
}

export interface EditSessionChangeHandler {
    (delta: Delta, session: EditSession): void;
}

export type EditSessionEventType = 'change' | 'workerCompleted';

export interface EditSession {
    addMarker(range: Range, clazz: string, type: MarkerType, renderer?: MarkerRenderer | null, inFront?: boolean): number;
    addRef(): number;
    docOrThrow(): Document;
    getAnnotations(): Annotation[];
    getDocument(): Document | undefined;
    getLine(row: number): string;
    getMarkers(inFront: boolean): { [id: number]: Marker };
    getState(row: number): string;
    getTabSize(): number;
    getTabString(): string;
    getTextRange(range?: Range): string;
    getUseSoftTabs(): boolean;
    getWordRange(row: number, column: number): Range;
    highlight(re: RegExp): void;
    modeOrThrow(): LanguageMode;
    on(eventName: EditSessionEventType, callback: EditSessionEventHandler): () => void;
    off(eventName: EditSessionEventType, callback: EditSessionEventHandler): void;
    release(): number;
    replace(range: Range, newText: string): Position;
    removeMarker(markerId: number): void;
    setAnnotations(annotations: Annotation[]): void;
    setLanguageMode(mode: LanguageMode, callback: (err: any) => void): void;
    setUseWorker(useWorker: boolean): void;
    setUseWrapMode(useWrapMode: boolean): void;
    unfold(row: number): void;
}

export interface KeyboardResponse {
    command: Command | null;
}

export interface KeyboardHandler {
    commandKeyBinding: { [hashId: number]: { [name: string]: Command } };
    handleKeyboard: (data: any, hashId: number, keyString: string, keyCode?: number, e?: KeyboardEvent) => KeyboardResponse | undefined;
}

export interface LanguageMode {
    $id: string;
    getCompletions(state: string, session: EditSession, position: Position, prefix: string): Completion[];
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
    range?: Range;

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

export interface Tabstop {

}

export interface TabstopManager {
    addTabstops(tabstops: Tabstop[], start: Position, end: Position, selectionIndex: number | false): void;
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
