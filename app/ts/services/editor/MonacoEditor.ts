import { Command } from '../../virtual/editor';
import { Completer } from '../../virtual/editor';
import { Direction } from '../../virtual/editor';
import { Editor } from '../../virtual/editor';
import { EditorAction } from '../../virtual/editor';
import { EditorEventHandler } from '../../virtual/editor';
import { EditorEventType } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';
import { KeyboardHandler } from '../../virtual/editor';
import { LineWidget } from '../../virtual/editor';
import { PixelPosition } from '../../virtual/editor';
import { Position } from '../../virtual/editor';
import { QuickInfoTooltip, QuickInfoTooltipHost } from '../../virtual/editor';
import { Range } from '../../virtual/editor';
import { Snippet } from '../../virtual/editor';
import { SnippetOptions } from '../../virtual/editor';
import { TabstopManager } from '../../virtual/editor';
import { UndoManager } from '../../virtual/editor';

import { MonacoEditSession } from './MonacoEditSession';

export class MonacoEditor implements Editor {
    private editor: monaco.editor.IStandaloneCodeEditor;
    private session: MonacoEditSession | undefined;
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
    addCommand(command: Command): void {
        // console.warn(`Editor.addCommand(...)`);
    }
    addCompleter(completer: Completer<Editor>): void {
        // console.warn(`Editor.addCompleter(...)`);
    }
    addKeyboardHandler(keyboardHandler: KeyboardHandler): void {
        console.warn("Editor.addKeyboardHandler");
    }
    addLineWidget(widget: LineWidget): LineWidget {
        console.warn("Editor.addLineWidget");
        return widget;
    }
    blur(): void {
        console.warn("Editor.blur");
    }
    createKeyboardHandler(): KeyboardHandler {
        console.warn("Editor.createKeyboardHandler");
        throw new Error();
    }
    createQuickInfoTooltip(path: string, host: QuickInfoTooltipHost): QuickInfoTooltip | undefined {
        // console.warn(`Editor.createQuickInfoTooltip('${path}')`);
        return void 0;
    }
    enableLineWidgets(): void {
        console.warn("Editor.enableLineWidgets");
    }
    enableTabStops(): TabstopManager {
        console.warn("Editor.enableTabStops");
        throw new Error();
    }
    execCommand(command: Command) {
        console.warn("Editor.createQuickInfoTooltip");
    }
    expandSnippetWithTab(options: SnippetOptions): boolean {
        console.warn("Editor.createQuickInfoTooltip");
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
    findSearchBox(match: boolean): void {
        console.warn("Editor.findSearchBox");
    }
    focus(): void {
        this.editor.focus();
    }
    forEachSelection(action: EditorAction, args: any, options?: { keepOrder?: boolean; $byLines?: boolean }): any {
        console.warn("Editor.forEachSelection");
    }
    getCommandByName(commandName: string): Command {
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
    getKeyboardHandlers(): KeyboardHandler[] {
        console.warn("Editor.getKeyboardHandlers");
        throw new Error();
    }
    getLineWidgetsAtRow(row: number): LineWidget[] {
        console.warn("Editor.getLineWidgetsAtRow");
        return [];
    }
    getReadOnly(): boolean {
        console.warn("Editor.getReadOnly");
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
    removeKeyboardHandler(keyboardHandler: KeyboardHandler): boolean {
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
    resize(force?: boolean | undefined): void {
        //        console.warn(`Editor.resize(${force})`);
        this.editor.layout({ height: 800, width: 600 });
        this.editor.render();
    }
    scrollCursorIntoView(cursor?: Position | null, offset?: number, $viewMargin?: { top?: number; bottom?: number }): void {
        console.warn("Editor.scrollCursorIntoView");
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
            if (session instanceof MonacoEditSession) {
                this.session = session;
                this.session.addRef();
                this.editor.setModel(session.docOrThrow().model);
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
        console.warn("Editor.updateFrontMarkers");
    }
    updateFull(): void {
        //      console.warn(`Editor.updateFull()`);
        this.editor.layout();
        this.editor.render();
    }
}
