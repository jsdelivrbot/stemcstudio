import { Injectable } from '@angular/core';

import { Command } from '../../virtual/editor';
import { Completer } from '../../virtual/editor';
import { Direction } from '../../virtual/editor';
import { Document } from '../../virtual/editor';
import { Editor } from '../../virtual/editor';
import { EditorAction } from '../../virtual/editor';
import { EditorEventHandler } from '../../virtual/editor';
import { EditorEventType } from '../../virtual/editor';
import { EditorService } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';
import { KeyboardHandler } from '../../virtual/editor';
import { LineWidget } from '../../virtual/editor';
import { PixelPosition } from '../../virtual/editor';
import { Position } from '../../virtual/editor';
import { QuickInfoTooltip } from '../../virtual/editor';
import { QuickInfoTooltipHost } from '../../virtual/editor';
import { Range } from '../../virtual/editor';
import { Snippet } from '../../virtual/editor';
import { SnippetOptions } from '../../virtual/editor';
import { TabstopManager } from '../../virtual/editor';
import { UndoManager } from '../../virtual/editor';

import LineWidgetManager from '../../editor/LineWidgetManager';
import { Document as NativeDocument } from '../../editor/Document';
import { Editor as NativeEditor } from '../../editor/Editor';
import { EditSession as NativeEditSession } from '../../editor/EditSession';
import NativeKeyboardHandler from '../../editor/keyboard/KeyboardHandler';
import NativeUndoManager from '../../editor/UndoManager';
import NativeQuickInfoTooltip from '../../editor/workspace/QuickInfoTooltip';
import Renderer from '../../editor/Renderer';

/**
 * AngularJS dependency injection registry identifier.
 */
export const NATIVE_EDITOR_SERVICE_UUID = 'native-editor.service.uuid';

@Injectable()
export class NativeEditorService implements EditorService {
    constructor() {
        // Nothing to do because native editor is ready to go.
    }
    createDocument(text: string): Document {
        return new NativeDocument(text);
    }
    createSession(doc: Document): EditSession {
        return new NativeEditSession(doc as NativeDocument);
    }
    createEditor(container: HTMLElement): Editor {
        return new NativeEditorAdapter(container);
    }
}

class NativeEditorAdapter implements Editor {
    private editor: NativeEditor;
    constructor(container: HTMLElement) {
        this.editor = new NativeEditor(new Renderer(container), void 0);
    }
    addCommand(command: Command): void {
        this.editor.commands.addCommand(command);
    }
    addCompleter(completer: Completer<Editor>): void {
        this.editor.completers.push(completer);
    }
    addKeyboardHandler(keyboardHandler: KeyboardHandler): void {
        return this.editor.keyBinding.addKeyboardHandler(keyboardHandler as NativeKeyboardHandler);
    }
    addLineWidget(widget: LineWidget): LineWidget {
        return this.editor.sessionOrThrow().widgetManager.addLineWidget(widget);
    }
    blur(): void {
        return this.editor.blur();
    }
    createKeyboardHandler(): KeyboardHandler {
        return new NativeKeyboardHandler();
    }
    createQuickInfoTooltip(path: string, host: QuickInfoTooltipHost): QuickInfoTooltip | undefined {
        return new NativeQuickInfoTooltip(path, this.editor, host);
    }
    dispose(): void {
        return this.editor.dispose();
    }
    enableLineWidgets(): void {
        const session = this.editor.getSession();
        if (session && !session.widgetManager) {
            session.widgetManager = new LineWidgetManager(session);
            session.widgetManager.attach(this.editor);
        }
    }
    enableTabStops(): TabstopManager {
        return this.editor.enableTabStops();
    }
    execCommand(command: Command) {
        return this.editor.execCommand(command);
    }
    expandSnippetWithTab(options: SnippetOptions): boolean {
        return this.editor.expandSnippetWithTab(options);
    }
    find(needle: string): Range | null | undefined {
        return this.editor.find(needle);
    }
    findAll(needle: string): number {
        return this.editor.findAll(needle);
    }
    findSearchBox(match: boolean): void {
        this.editor._emit("findSearchBox", { match });
    }
    focus(): void {
        return this.editor.focus();
    }
    forEachSelection(action: EditorAction, args: any, options?: { keepOrder?: boolean; $byLines?: boolean }): any {
        return this.editor.forEachSelection(action, args, options);
    }
    getCommandByName(commandName: string): Command {
        return this.editor.commands.getCommandByName(commandName);
    }
    getCursorPixelPosition(pos?: Position): PixelPosition {
        return this.editor.renderer.cursorLayer.getPixelPosition(pos);
    }
    getCursorPosition(): Position {
        return this.editor.getCursorPosition();
    }
    getContainer(): HTMLElement {
        return this.editor.container;
    }
    getGutterAnnotations(): ({ className: string | undefined; text: string[] } | null)[] {
        return this.editor.renderer.$gutterLayer.$annotations;
    }
    getGutterWidth(): number {
        return this.editor.renderer.gutterWidth;
    }
    getKeyboardHandlers(): KeyboardHandler[] {
        return this.editor.keyBinding.$handlers;
    }
    getLineWidgetsAtRow(row: number): LineWidget[] {
        return this.editor.sessionOrThrow().widgetManager.getWidgetsAtRow(row);
    }
    getReadOnly(): boolean {
        return this.editor.getReadOnly();
    }
    getSearchRegExp(): RegExp {
        return this.editor.$search.$options.re as RegExp;
    }
    getSelectionIndex(): number {
        return this.editor.getSelectionIndex();
    }
    getSelectionRange(): Range {
        return this.editor.getSelectionRange();
    }
    getSession(): EditSession | undefined {
        return this.editor.getSession();
    }
    gotoLine(lineNumber: number, column: number): void {
        return this.editor.gotoLine(lineNumber, column);
    }
    isMousePressed(): boolean {
        return this.editor.$mouseHandler.isMousePressed;
    }
    isSnippetSelectionMode(): boolean {
        return this.editor.inVirtualSelectionMode;
    }
    moveSelectionToPosition(pos: Position): void {
        const selection = this.editor.selection;
        if (selection) {
            return selection.moveToPosition(pos);
        }
    }
    on(eventName: EditorEventType, callback: EditorEventHandler): () => void {
        const hook = (data: any, editor: NativeEditor) => {
            callback(data, this);
        };
        return this.editor.on(eventName, hook);
    }
    off(eventName: EditorEventType, callback: EditorEventHandler): void {
        const hook = (data: any, editor: NativeEditor) => {
            callback(data, this);
        };
        return this.editor.off(eventName, hook);
    }
    registerSnippets(snippets: Snippet[]): void {
        return this.editor.snippetManager.register(snippets);
    }
    removeKeyboardHandler(keyboardHandler: KeyboardHandler): boolean {
        return this.editor.keyBinding.removeKeyboardHandler(keyboardHandler as NativeKeyboardHandler);
    }
    removeLineWidget(widget: LineWidget): void {
        return this.editor.sessionOrThrow().widgetManager.removeLineWidget(widget);
    }
    replace(replacement: string): number {
        return this.editor.replace(replacement);
    }
    replaceAll(replacement: string): number {
        return this.editor.replaceAll(replacement);
    }
    resize(force?: boolean | undefined): void {
        return this.editor.resize(force);
    }
    scrollCursorIntoView(cursor?: Position | null, offset?: number, $viewMargin?: { top?: number; bottom?: number }): void {
        return this.editor.renderer.scrollCursorIntoView(cursor, offset, $viewMargin);
    }
    sessionOrThrow(): EditSession {
        return this.editor.sessionOrThrow();
    }
    setDisplayIndentGuides(displayIndentGuides: boolean): void {
        return this.editor.setDisplayIndentGuides(displayIndentGuides);
    }
    setFontSize(fontSize: string | null): void {
        return this.editor.setFontSize(fontSize);
    }
    setPadding(padding: number): void {
        return this.editor.setPadding(padding);
    }
    setReadOnly(readOnly: boolean): void {
        return this.editor.setReadOnly(readOnly);
    }
    setSession(session: EditSession): void {
        return this.editor.setSession(session as NativeEditSession | undefined);
    }
    setTabSize(tabSize: number): void {
        return this.editor.setTabSize(tabSize);
    }
    setThemeCss(themeId: string, href?: string): void {
        return this.editor.setThemeCss(themeId, href);
    }
    setThemeDark(isDark: boolean): void {
        return this.editor.setThemeDark(isDark);
    }
    setShowFoldWidgets(showFoldWidgets: boolean): void {
        return this.editor.setShowFoldWidgets(showFoldWidgets);
    }
    setShowGutter(showGutter: boolean): void {
        return this.editor.setShowGutter(showGutter);
    }
    setShowInvisibles(showInvisibles: boolean): void {
        return this.editor.setShowInvisibles(showInvisibles);
    }
    setShowLineNumbers(showLineNumbers: boolean): void {
        return this.editor.setShowLineNumbers(showLineNumbers);
    }
    setShowPrintMargin(showPrintMargin: boolean): void {
        return this.editor.setShowPrintMargin(showPrintMargin);
    }
    setUseSoftTabs(useSoftTabs: boolean): void {
        return this.editor.setUseSoftTabs(useSoftTabs);
    }
    setUndoManager(undoManager: UndoManager): void {
        return this.editor.sessionOrThrow().setUndoManager(undoManager as NativeUndoManager);
    }
    setWrapBehavioursEnabled(wrapBehaviorEnabled: boolean): void {
        return this.editor.setWrapBehavioursEnabled(wrapBehaviorEnabled);
    }
    tabNext(direction?: Direction): void {
        if (this.editor.tabstopManager) {
            this.editor.tabstopManager.tabNext(direction);
        }
    }
    updateBackMarkers(): void {
        this.editor.renderer.updateBackMarkers();
    }
    updateFrontMarkers(): void {
        this.editor.renderer.updateFrontMarkers();
    }
    updateFull(): void {
        return this.editor.renderer.updateFull();
    }
}
