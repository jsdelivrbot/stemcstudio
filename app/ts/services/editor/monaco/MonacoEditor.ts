import { Observable } from 'rxjs/Observable';

import { Command } from '../../../virtual/editor';
import { Completer } from '../../../virtual/editor';
import { Direction } from '../../../virtual/editor';
import { Editor } from '../../../virtual/editor';
import { Action } from '../../../virtual/editor';
import { Annotation } from '../../../virtual/editor';
import { EditorEventHandler } from '../../../virtual/editor';
import { EditorEventType } from '../../../virtual/editor';
import { EditSession } from '../../../virtual/editor';
import { Fold } from '../../../virtual/EditorFoldable';
import { KeyboardHandler } from '../../../virtual/editor';
import { LineWidget } from '../../../virtual/editor';
import { MarkerRange, MarkerType, MarkerRenderer } from '../../../virtual/editor';
import { PixelPosition } from '../../../virtual/editor';
import { Position } from '../../../virtual/editor';
import { QuickInfoTooltip, QuickInfoTooltipHost } from '../../../virtual/editor';
import { Range } from '../../../virtual/editor';
import { OrientedRange } from '../../../virtual/editor';
import { RangeWithCollapseChildren } from '../../../virtual/editor';
import { Snippet } from '../../../virtual/editor';
import { SnippetOptions } from '../../../virtual/editor';
import { TabstopManager } from '../../../virtual/editor';
import { UndoManager } from '../../../virtual/editor';

import { ModelDebug } from './ModelDebug';
// import { MonacoModel } from './MonacoModel';
import { EditSession as NativeEditSession } from '../../../editor/EditSession';

/**
 * It looks like it is going to be hopeless to use the monaco editor in a workspace scenario.
 * There are too many undocumented semantics, too many completely undocumented APIs (which
 * had to be reverse-engineered), and no guarantee that all the extension points will exist.
 */
export class MonacoEditor implements Editor {
    private editor: monaco.editor.IStandaloneCodeEditor;
    private session: NativeEditSession | undefined;
    commands: any;
    gotoDefinitionEvents: Observable<Position>;
    inMultiSelectMode: boolean;
    sortLines: any;
    constructor(container: HTMLElement) {
        // console.warn(`Editor.constructor()`);
        if (monaco) {
            this.editor = monaco.editor.create(container);
        }
        else {
            console.warn("'monaco' namespace is not available for creating code editor.");
        }
    }
    dispose(): void {
        // console.warn(`Editor.dispose()`);
        if (this.session) {
            this.session.release();
            this.session = void 0;
        }
        this.editor.dispose();
    }
    addCommand(command: Command<Editor>): void {
        // console.warn(`Editor.addCommand(...)`);
    }
    addCompleter(completer: Completer<Editor>): void {
        // console.warn(`Editor.addCompleter(...)`);
    }
    addKeyboardHandler(keyboardHandler: KeyboardHandler<Editor>): void {
        console.warn("Editor.addKeyboardHandler");
    }
    addLineWidget(widget: LineWidget): LineWidget {
        console.warn("Editor.addLineWidget");
        return widget;
    }
    blur(): void {
        console.warn("Editor.blur");
    }
    changeStatus(): void {
        throw new Error();
    }
    createKeyboardHandler(): KeyboardHandler<Editor> {
        console.warn("Editor.createKeyboardHandler");
        throw new Error();
    }
    createQuickInfoTooltip(path: string, host: QuickInfoTooltipHost): QuickInfoTooltip | undefined {
        return void 0;
    }
    enableLineWidgets(): void {
        console.warn("Editor.enableLineWidgets");
    }
    enableTabStops(): TabstopManager {
        console.warn("Editor.enableTabStops");
        throw new Error();
    }
    execCommand(command: Command<Editor>) {
        console.warn("Editor.ececCommand");
    }
    expandSnippetWithTab(options: SnippetOptions): boolean {
        return false;
    }
    find(): Range | null | undefined {
        console.warn("Editor.find");
        return void 0;
    }
    findAll(): number {
        console.warn("Editor.findAll");
        return 0;
    }
    findAnnotations(row: number, direction: Direction): Annotation[] | undefined {
        return [];
    }
    findSearchBox(match: boolean): void {
        console.warn("Editor.findSearchBox");
    }
    focus(): void {
        this.editor.focus();
    }
    forEachSelection(action: Action<Editor>, args: any, options?: { keepOrder?: boolean; $byLines?: boolean }): any {
        console.warn("Editor.forEachSelection");
    }
    getCommandByName(commandName: string): Command<Editor> {
        console.warn("Editor.getCommandByName");
        throw new Error();
    }
    getCursorPixelPosition(pos?: Position): PixelPosition {
        console.warn("Editor.getCursorPixelPosition");
        return { left: 0 };
    }
    getCursorPosition(): Position {
        console.warn("Editor.getCursorPosition");
        throw new Error();
    }
    getContainer(): HTMLElement {
        return this.editor.getDomNode();
    }
    getGutterAnnotations(): ({ className: string | undefined; text: string[] } | null)[] {
        console.warn("Editor.getGutterAnnotations");
        throw new Error();
    }
    getGutterWidth(): number {
        console.warn("Editor.getGutterWidth");
        throw new Error();
    }
    getKeyboardHandlers(): KeyboardHandler<Editor>[] {
        console.warn("Editor.getKeyboardHandlers");
        throw new Error();
    }
    getLineWidgetsAtRow(row: number): LineWidget[] {
        console.warn("Editor.getLineWidgetsAtRow");
        return [];
    }
    get readOnly(): boolean {
        console.warn("Editor.readOnly (get)");
        return false;
    }
    getSearchRegExp(): RegExp {
        console.warn("Editor.getSearchRegExp");
        throw new Error();
    }
    getSelectionIndex(): number {
        console.warn("Editor.getSelectionIndex");
        throw new Error();
    }
    getSelectionRange(): Range {
        console.warn("Editor.getSelectionRange");
        throw new Error();
    }
    getSession(): EditSession | undefined {
        return this.session;
    }
    getTabSize(): number {
        console.warn("Editor.getTabSize");
        throw new Error();
    }
    getTabString(): string {
        console.warn("Editor.getTabString");
        throw new Error();
    }
    getUseSoftTabs(): boolean {
        console.warn("Editor.getUseSoftTabs");
        throw new Error();
    }
    getLine(row: number): string {
        console.warn("Editor.getLine()");
        throw new Error();
    }
    getWordRange(row: number, column: number): OrientedRange {
        console.warn("Editor.getWordRange()");
        throw new Error();
    }
    gotoLine(lineNumber: number, column: number): void {
        this.editor.setPosition({ lineNumber, column });
    }
    isMousePressed(): boolean {
        console.warn("Editor.isMousePressed");
        throw new Error();
    }
    isSnippetSelectionMode(): boolean {
        console.warn("Editor.isSnippetSelectionMode");
        throw new Error();
    }
    moveSelectionToPosition(pos: Position): void {
        console.warn("Editor.moveSelectionToPosition");
    }
    on(eventName: EditorEventType, callback: EditorEventHandler): () => void {
        // console.warn(`Editor.on(${eventName})`);
        return () => {
            this.off(eventName, callback);
        };
    }
    off(eventName: EditorEventType, callback: EditorEventHandler): void {
        // console.warn(`Editor.off(${eventName})`);
    }
    registerSnippets(snippets: Snippet[]): void {
        // console.warn("Editor.registerSnippets(...)");
    }
    removeKeyboardHandler(keyboardHandler: KeyboardHandler<Editor>): boolean {
        console.warn("Editor.removeKeyboardHandler");
        return true;
    }
    removeLineWidget(widget: LineWidget): void {
        console.warn("Editor.removeLineWidget");
    }
    replace(replacement: string): number {
        console.warn("Editor.replace");
        return 0;
    }
    replaceAll(replacement: string): number {
        console.warn("Editor.replaceAll");
        return 0;
    }
    removeInLine(row: number, startColumn: number, endColumn: number): Position {
        console.warn("Editor.removeInLine");
        throw new Error();
    }
    removeRange(range: Readonly<Range>): Position {
        console.warn("Editor.removeRange");
        throw new Error();
    }
    replaceRange(range: Readonly<Range>, newText: string): Position {
        console.warn("Editor.replaceRange");
        throw new Error();
    }
    resize(force?: boolean | undefined): void {
        //        console.warn(`Editor.resize(${force})`);
        this.editor.layout({ height: 800, width: 600 });
        this.editor.render();
    }
    scrollCursorIntoView(cursor?: Position | null, offset?: number, $viewMargin?: { top?: number; bottom?: number }): void {
        console.warn("Editor.scrollCursorIntoView");
    }

    scrollDown(): void {
        throw new Error();
    }
    scrollUp(): void {
        throw new Error();
    }
    scrollPageDown(): void {
        throw new Error();
    }
    scrollPageUp(): void {
        throw new Error();
    }
    sessionOrThrow(): EditSession {
        if (this.session) {
            return this.session;
        }
        else {
            throw new Error("session is not defined.");
        }
    }
    setDisplayIndentGuides(renderIndentGuides: boolean): void {
        this.editor.updateOptions({ renderIndentGuides });
    }
    setFontSize(fontSize: string | null): void {
        //        console.warn(`Editor.setFontSize(${fontSize})`);
    }
    setPadding(padding: number): void {
        //        console.warn(`Editor.setPadding(${padding})`);
    }
    setReadOnly(readOnly: boolean): void {
        this.editor.updateOptions({ readOnly });
    }
    setSession(session: EditSession): void {
        if (session === this.session) {
            return;
        }
        if (this.session) {
            this.session.release();
            this.session = void 0;
            this.editor.setModel(null);
        }
        if (session) {
            if (session instanceof NativeEditSession) {
                this.session = session;
                this.session.addRef();
                // const model = new MonacoModel(session);
                const model = monaco.editor.createModel(session.getValue());
                const debugModel = new ModelDebug(model);
                this.editor.setModel(debugModel);
            }
            else {
                console.warn("session must be an EditSession.");
            }
        }
    }
    setTabSize(tabSize: number): void {
        //        console.warn(`Editor.setTabSize('${tabSize}')`);
    }
    setThemeCss(themeId: string, href?: string): void {
        //        console.warn(`Editor.setThemeCss('${themeId}', '${href}')`);
    }
    setThemeDark(isDark: boolean): void {
        this.editor.updateOptions({ theme: isDark ? 'vs-dark' : 'vs' });
    }
    setShowFoldWidgets(showFoldWidgets: boolean): void {
        //        console.warn(`Editor.setShowFoldWidgets(${showFoldWidgets})`);
    }
    setShowGutter(showGutter: boolean): void {
        //        console.warn(`Editor.setShowGutter(${showGutter})`);
    }
    setShowInvisibles(showInvisibles: boolean): void {
        this.editor.updateOptions({ renderWhitespace: showInvisibles ? 'all' : 'none' });
    }
    setShowLineNumbers(showLineNumbers: boolean): void {
        this.editor.updateOptions({ lineNumbers: showLineNumbers ? 'on' : 'off' });
    }
    setShowPrintMargin(showPrintMargin: boolean): void {
        //        console.warn(`Editor.setShowPrintMargin(${showPrintMargin})`);
    }
    setUseSoftTabs(useSoftTabs: boolean): void {
        //        console.warn(`Editor.setUseSoftTabs(${useSoftTabs})`);
    }
    setUndoManager(undoManager: UndoManager): void {
        // console.warn("Editor.setUndoManager()");
    }
    setWrapBehavioursEnabled(wrapBehaviorEnabled: boolean): void {
        // console.warn("Editor.setWrapBehavioursEnabled");
    }
    tabNext(direction?: Direction): void {
        console.warn("Editor.tabNext");
    }
    updateBackMarkers(): void {
        console.warn("Editor.updateBackMarkers");
    }
    updateFrontMarkers(): void {
        // console.warn("Editor.updateFrontMarkers");
    }
    updateFull(): void {
        //      console.warn(`Editor.updateFull()`);
        this.editor.layout();
        this.editor.render();
    }
    alignCursors(): void {
        throw new Error();
    }
    centerSelection(): void {
        throw new Error();
    }
    clearSelection(): void {
        throw new Error();
    }
    duplicateSelection(): void {
        throw new Error();
    }
    exitMultiSelectMode(): void {
        throw new Error();
    }
    expandToLine(): void {
        throw new Error();
    }

    invertSelection(): void {
        throw new Error();
    }
    joinLines(): void {
        throw new Error();
    }
    selectAll(): void {
        throw new Error();
    }
    selectFileEnd(): void {
        throw new Error();
    }
    selectLeft(): void {
        throw new Error();
    }
    selectLineStart(): void {
        throw new Error();
    }
    selectLineEnd(): void {
        throw new Error();
    }
    selectToFileStart(): void {
        throw new Error();
    }
    selectDown(): void {
        throw new Error();
    }
    selectMore(direction: Direction, skip?: boolean, stopAtFirst?: boolean): void {
        throw new Error();
    }
    selectMoreLines(direction: Direction, skip?: boolean): void {
        throw new Error();
    }
    selectRight(): void {
        throw new Error();
    }
    selectUp(): void {
        throw new Error();
    }
    selectWordLeft(): void {
        throw new Error();
    }
    selectWordRight(): void {
        throw new Error();
    }
    selectWordOrFindNext(): void {
        throw new Error();
    }
    selectWordOrFindPrevious(): void {
        throw new Error();
    }

    selectPageDown(): void {
        throw new Error();
    }
    selectPageUp(): void {
        throw new Error();
    }

    splitIntoLines(): void {
        throw new Error();
    }
    blockOutdent(): void {
        throw new Error();
    }
    blockIndent(): void {
        throw new Error();
    }

    copyLinesDown(): void {
        throw new Error();
    }
    copyLinesUp(): void {
        throw new Error();
    }

    cut(): void {
        throw new Error();
    }
    copy(): void {
        throw new Error();
    }
    paste(): void {
        throw new Error();
    }

    deleteLeft(): void {
        throw new Error();
    }

    indent(): void {
        throw new Error();
    }
    insert(text: string): void {
        throw new Error();
    }

    modifyNumber(Value: number): void {
        throw new Error();
    }

    moveLinesDown(): void {
        throw new Error();
    }
    moveLinesUp(): void {
        throw new Error();
    }

    remove(direction: 'left' | 'right'): void {
        throw new Error();
    }

    removeLines(): void {
        throw new Error();
    }

    removeToLineStart(): void {
        throw new Error();
    }
    removeToLineEnd(): void {
        throw new Error();
    }

    removeWordLeft(): void {
        throw new Error();
    }
    removeWordRight(): void {
        throw new Error();
    }

    splitLine(): void {
        throw new Error();
    }

    toggleBlockComment(): void {
        throw new Error();
    }
    toggleCommentLines(): void {
        throw new Error();
    }

    toLowerCase(): void {
        throw new Error();
    }
    toUpperCase(): void {
        throw new Error();
    }

    transposeLetters(): void {
        throw new Error();
    }

    undo(): void {
        throw new Error();
    }
    redo(): void {
        throw new Error();
    }
    addPlaceholderFold(placeholder: string, range: RangeWithCollapseChildren): Fold | undefined {
        throw new Error();
    }
    expandFold(fold: any): void {
        throw new Error();
    }
    foldAll(): void {
        throw new Error();
    }
    /**
     * Looks up a fold at a given row/column. Possible values for side:
     *   -1: ignore a fold if fold.start = row/column
     *   +1: ignore a fold if fold.end = row/column
     */
    getFoldAt(row: number, column: number, side?: number): Fold | undefined | null {
        throw new Error();
    }
    removeFold(fold: any): void {
        throw new Error();
    }
    toggleFold(tryToUnfold: boolean): void {
        throw new Error();
    }
    toggleFoldWidget(toggleParent?: boolean): void {
        throw new Error();
    }
    unfold(location?: number | Position | Range, expandInner?: boolean): Fold[] | undefined {
        throw new Error();
    }
    toggleOverwrite(): void {
        throw new Error();
    }
    addMarker(range: MarkerRange, clazz: 'ace_active-line' | 'ace_bracket' | 'ace_selection' | 'ace_snippet-marker', type: MarkerType, renderer?: MarkerRenderer | null, inFront?: boolean): number {
        throw new Error();
    }
    removeMarker(markerId: number): void {
        throw new Error();
    }

    gotoPageDown(): void {
        throw new Error();
    }
    gotoPageUp(): void {
        throw new Error();
    }

    jumpToMatching(select?: boolean): void {
        throw new Error();
    }

    navigateDown(times: number): void {
        throw new Error();
    }
    navigateLeft(times: number): void {
        throw new Error();
    }
    navigateRight(times: number): void {
        throw new Error();
    }
    navigateUp(times: number): void {
        throw new Error();
    }

    navigateFileStart(): void {
        throw new Error();
    }
    navigateFileEnd(): void {
        throw new Error();
    }

    navigateLineStart(): void {
        throw new Error();
    }
    navigateLineEnd(): void {
        throw new Error();
    }

    navigateWordLeft(): void {
        throw new Error();
    }
    navigateWordRight(): void {
        throw new Error();
    }
    toggleRecording(): void {
        throw new Error();
    }
    replay(): void {
        throw new Error();
    }
    findNext(): void {
        throw new Error();
    }
    findPrevious(): void {
        throw new Error();
    }
    getTextRange(): string {
        throw new Error();
    }
    highlight(re?: RegExp): void {
        throw new Error();
    }
    gotoDefinition(): void {
        throw new Error();
    }
    isGotoDefinitionAvailable(): boolean {
        throw new Error();
    }
}
