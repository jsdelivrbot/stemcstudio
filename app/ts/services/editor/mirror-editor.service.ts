import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Action } from '../../virtual/editor';
import { Annotation } from '../../virtual/editor';
import { Command } from '../../virtual/editor';
import { Completer } from '../../virtual/editor';
import { Direction } from '../../virtual/editor';
import { Editor } from '../../virtual/editor';
import { EditorEventHandler } from '../../virtual/editor';
import { EditorEventType } from '../../virtual/editor';
import { EditorService } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';
import { KeyboardHandler } from '../../virtual/editor';
import { Fold } from '../../virtual/EditorFoldable';
import { LineWidget } from '../../virtual/editor';
import { MarkerType, MarkerRange, MarkerRenderer } from '../../virtual/editor';
import { PixelPosition } from '../../virtual/editor';
import { Position } from '../../virtual/editor';
import { QuickInfoTooltip } from '../../virtual/editor';
import { QuickInfoTooltipHost } from '../../virtual/editor';
import { Range } from '../../virtual/editor';
import { OrientedRange } from '../../virtual/editor';
import { RangeWithCollapseChildren } from '../../virtual/editor';
import { Snippet } from '../../virtual/editor';
import { SnippetOptions } from '../../virtual/editor';
import { TabstopManager } from '../../virtual/editor';
import { UndoManager } from '../../virtual/editor';

import { Document as NativeDocument } from '../../editor/Document';
// import { Editor as NativeEditor } from '../../editor/Editor';
import { EditSession as NativeEditSession } from '../../editor/EditSession';

/**
 * AngularJS dependency injection registry identifier.
 */
export const MIRROR_EDITOR_SERVICE_UUID = 'mirror-editor.service.uuid';

@Injectable()
export class MirrorEditorService implements EditorService {
    constructor() {
        // Nothing to do because native editor is ready to go.
    }
    createSession(text: string): EditSession {
        const doc = new NativeDocument(text);
        const session = new NativeEditSession(doc);
        doc.release();
        return session;
    }
    createEditor(container: HTMLElement): Editor {
        return new MirrorEditorAdapter(container);
    }
}

class MirrorEditorAdapter implements Editor {
    private editor: CodeMirror.Editor;
    commands: any;
    gotoDefinitionEvents: Observable<Position>;
    inMultiSelectMode: boolean;
    sortLines: any;
    constructor(container: HTMLElement) {
        this.editor = CodeMirror(container);
    }
    addCommand(command: Command<Editor>): void {
        throw new Error();
    }
    addCompleter(completer: Completer<Editor>): void {
        throw new Error();
    }
    addKeyboardHandler(keyboardHandler: KeyboardHandler<Editor>): void {
        throw new Error();
    }
    addLineWidget(widget: LineWidget): LineWidget {
        // this.editor.addLineWidget()
        throw new Error();
    }
    blur(): void {
        throw new Error();
    }
    changeStatus(): void {
        throw new Error();
    }
    createKeyboardHandler(): KeyboardHandler<Editor> {
        throw new Error();
    }
    createQuickInfoTooltip(path: string, host: QuickInfoTooltipHost): QuickInfoTooltip | undefined {
        return void 0;
    }
    dispose(): void {
        // return this.editor..dispose();
    }
    enableLineWidgets(): void {
        throw new Error();
    }
    enableTabStops(): TabstopManager {
        throw new Error();
    }
    execCommand(command: Command<Editor>): void {
        throw new Error();
    }
    expandSnippetWithTab(options: SnippetOptions): boolean {
        return false;
    }
    find(needle: string): Range | null | undefined {
        return undefined;
    }
    findAll(needle: string): number {
        return 0;
    }
    findAnnotations(row: number, direction: Direction): Annotation[] | undefined {
        return [];
    }
    findSearchBox(match: boolean): void {
        return void 0;
    }
    focus(): void {
        return this.editor.focus();
    }
    forEachSelection(action: Action<Editor>, args: any, options?: { keepOrder?: boolean; $byLines?: boolean }): any {
        console.warn(`forEachSelection`);
    }
    getCommandByName(commandName: string): Command<Editor> {
        throw new Error();
    }
    getCursorPixelPosition(pos?: Position): PixelPosition {
        throw new Error();
    }
    getCursorPosition(): Position {
        throw new Error();
    }
    getContainer(): HTMLElement {
        throw new Error();
    }
    getGutterAnnotations(): ({ className: string | undefined; text: string[] } | null)[] {
        throw new Error();
    }
    getGutterWidth(): number {
        throw new Error();
    }
    getKeyboardHandlers(): KeyboardHandler<Editor>[] {
        throw new Error();
    }
    getLineWidgetsAtRow(row: number): LineWidget[] {
        throw new Error();
    }
    get readOnly(): boolean {
        throw new Error();
    }
    getSearchRegExp(): RegExp {
        throw new Error();
    }
    getSelectionIndex(): number {
        throw new Error();
    }
    getSelectionRange(): Range {
        throw new Error();
    }
    getSession(): EditSession | undefined {
        throw new Error();
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
        throw new Error();
    }
    isMousePressed(): boolean {
        throw new Error();
    }
    isSnippetSelectionMode(): boolean {
        throw new Error();
    }
    moveSelectionToPosition(pos: Position): void {
        throw new Error();
    }
    on(eventName: EditorEventType, callback: EditorEventHandler): () => void {
        throw new Error();
    }
    off(eventName: EditorEventType, callback: EditorEventHandler): void {
        throw new Error();
    }
    registerSnippets(snippets: Snippet[]): void {
        throw new Error();
    }
    removeKeyboardHandler(keyboardHandler: KeyboardHandler<Editor>): boolean {
        throw new Error();
    }
    removeLineWidget(widget: LineWidget): void {
        throw new Error();
    }
    replace(replacement: string): number {
        throw new Error();
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

    replaceAll(replacement: string): number {
        throw new Error();
    }
    resize(force?: boolean | undefined): void {
        throw new Error();
    }
    scrollCursorIntoView(cursor?: Position | null, offset?: number, $viewMargin?: { top?: number; bottom?: number }): void {
        throw new Error();
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
        throw new Error();
    }
    setDisplayIndentGuides(displayIndentGuides: boolean): void {
        throw new Error();
    }
    setFontSize(fontSize: string | null): void {
        throw new Error();
    }
    setPadding(padding: number): void {
        throw new Error();
    }
    setReadOnly(readOnly: boolean): void {
        throw new Error();
    }
    setSession(session: EditSession): void {
        throw new Error();
    }
    setTabSize(tabSize: number): void {
        throw new Error();
    }
    setThemeCss(themeId: string, href?: string): void {
        throw new Error();
    }
    setThemeDark(isDark: boolean): void {
        throw new Error();
    }
    setShowFoldWidgets(showFoldWidgets: boolean): void {
        throw new Error();
    }
    setShowGutter(showGutter: boolean): void {
        throw new Error();
    }
    setShowInvisibles(showInvisibles: boolean): void {
        throw new Error();
    }
    setShowLineNumbers(showLineNumbers: boolean): void {
        throw new Error();
    }
    setShowPrintMargin(showPrintMargin: boolean): void {
        throw new Error();
    }
    setUseSoftTabs(useSoftTabs: boolean): void {
        throw new Error();
    }
    setUndoManager(undoManager: UndoManager): void {
        throw new Error();
    }
    setWrapBehavioursEnabled(wrapBehaviorEnabled: boolean): void {
        throw new Error();
    }
    tabNext(direction?: Direction): void {
        throw new Error();
    }
    updateBackMarkers(): void {
        throw new Error();
    }
    updateFrontMarkers(): void {
        throw new Error();
    }
    updateFull(): void {
        throw new Error();
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
