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
import { QuickInfoTooltip, QuickInfoTooltipHost } from '../../virtual/editor';
import { Range } from '../../virtual/editor';
import { Snippet } from '../../virtual/editor';
import { SnippetOptions } from '../../virtual/editor';
import { TabstopManager } from '../../virtual/editor';
import { UndoManager } from '../../virtual/editor';

/**
 * AngularJS dependency injection registry identifier.
 */
export const MONACO_EDITOR_SERVICE_UUID = 'monaco-editor.service.uuid';

@Injectable()
export class MonacoEditorService implements EditorService {
    constructor() {
        console.log(`MonacoEditorService.constructor()`);
    }
    createDocument(textOrLines: string | string[]): Document {
        throw new Error("MonacoEditorService.createDocument");
    }
    createSession(doc: Document): EditSession {
        throw new Error("MonacoEditorService.createSession");
    }
    createEditor(container: HTMLElement): Editor {
        return new MonacoEditorAdapter(container);
    }
}

class MonacoEditorAdapter implements Editor {
    private editor: monaco.editor.IStandaloneCodeEditor;
    constructor(container: HTMLElement) {
        this.editor = monaco.editor.create(container);
    }
    addCommand(command: Command): void {
        throw new Error("MonacoCodeEditor.addCommand");
    }
    addCompleter(completer: Completer<Editor>): void {
        throw new Error("MonacoCodeEditor.addCompleter");
    }
    addKeyboardHandler(keyboardHandler: KeyboardHandler): void {
        throw new Error("MonacoCodeEditor.addKeyboardHandler");
    }
    addLineWidget(widget: LineWidget): LineWidget {
        throw new Error("MonacoCodeEditor.addLineWidget");
    }
    blur(): void {
        throw new Error("MonacoCodeEditor.blur");
    }
    createKeyboardHandler(): KeyboardHandler {
        throw new Error("MonacoCodeEditor.createKeyboardHandler");
    }
    createQuickInfoTooltip(path: string, host: QuickInfoTooltipHost): QuickInfoTooltip {
        throw new Error("MonacoCodeEditor.createQuickInfoTooltip");
    }
    dispose(): void {
        this.editor.dispose();
    }
    enableLineWidgets(): void {
        throw new Error("MonacoCodeEditor.enableLineWidgets");
    }
    enableTabStops(): TabstopManager {
        throw new Error("MonacoCodeEditor.enableTabStops");
    }
    execCommand(command: Command) {
        throw new Error("MonacoCodeEditor.createQuickInfoTooltip");
    }
    expandSnippetWithTab(options: SnippetOptions): boolean {
        throw new Error("MonacoCodeEditor.createQuickInfoTooltip");
    }
    find(): Range | null | undefined {
        throw new Error("MonacoCodeEditor.find");
    }
    findAll(): number {
        throw new Error("MonacoCodeEditor.findAll");
    }
    findSearchBox(match: boolean): void {
        throw new Error("MonacoCodeEditor.findSearchBox");
    }
    focus(): void {
        this.editor.focus();
    }
    forEachSelection(action: EditorAction, args: any, options?: { keepOrder?: boolean; $byLines?: boolean }): any {
        throw new Error("MonacoCodeEditor.forEachSelection");
    }
    getCommandByName(commandName: string): Command {
        throw new Error("MonacoCodeEditor.getCommandByName");
    }
    getCursorPixelPosition(pos?: Position): PixelPosition {
        throw new Error("MonacoCodeEditor.getCursorPixelPosition");
    }
    getCursorPosition(): Position {
        throw new Error("MonacoCodeEditor.getCursorPosition");
    }
    getContainer(): HTMLElement {
        return this.editor.getDomNode();
    }
    getGutterAnnotations(): ({ className: string | undefined; text: string[] } | null)[] {
        throw new Error("MonacoCodeEditor.getGutterAnnotations");
    }
    getGutterWidth(): number {
        throw new Error("MonacoCodeEditor.getGutterWidth");
    }
    getKeyboardHandlers(): KeyboardHandler[] {
        throw new Error("MonacoCodeEditor.getKeyboardHandlers");
    }
    getLineWidgetsAtRow(row: number): LineWidget[] {
        throw new Error("MonacoCodeEditor.getLineWidgetsAtRow");
    }
    getReadOnly(): boolean {
        throw new Error("MonacoCodeEditor.getReadOnly");
    }
    getSearchRegExp(): RegExp {
        throw new Error("MonacoCodeEditor.getSearchRegExp");
    }
    getSelectionIndex(): number {
        throw new Error("MonacoCodeEditor.getSelectionIndex");
    }
    getSelectionRange(): Range {
        throw new Error("MonacoCodeEditor.getSelectionRange");
    }
    getSession(): EditSession | undefined {
        throw new Error("MonacoCodeEditor.getSession");
    }
    gotoLine(lineNumber: number, column: number): void {
        throw new Error("MonacoCodeEditor.gotoLine");
    }
    isMousePressed(): boolean {
        throw new Error("MonacoCodeEditor.isMousePressed");
    }
    isSnippetSelectionMode(): boolean {
        throw new Error("MonacoCodeEditor.isSnippetSelectionMode");
    }
    moveSelectionToPosition(pos: Position): void {
        throw new Error("MonacoCodeEditor.moveSelectionToPosition");
    }
    on(eventName: EditorEventType, callback: EditorEventHandler): () => void {
        throw new Error("MonacoCodeEditor.on");
    }
    off(eventName: EditorEventType, callback: EditorEventHandler): void {
        throw new Error("MonacoCodeEditor.off");
    }
    registerSnippets(snippets: Snippet[]): void {
        throw new Error("MonacoCodeEditor.registerSnippets");
    }
    removeKeyboardHandler(keyboardHandler: KeyboardHandler): boolean {
        throw new Error("MonacoCodeEditor.removeKeyboardHandler");
    }
    removeLineWidget(widget: LineWidget): void {
        throw new Error("MonacoCodeEditor.removeLineWidget");
    }
    replace(replacement: string): number {
        throw new Error("MonacoCodeEditor.replace");
    }
    replaceAll(replacement: string): number {
        throw new Error("MonacoCodeEditor.replaceAll");
    }
    resize(force?: boolean | undefined): void {
        throw new Error("MonacoCodeEditor.resize");
    }
    scrollCursorIntoView(cursor?: Position | null, offset?: number, $viewMargin?: { top?: number; bottom?: number }): void {
        throw new Error("MonacoCodeEditor.scrollCursorIntoView");
    }
    sessionOrThrow(): EditSession {
        throw new Error("MonacoCodeEditor.sessionOrThrow");
    }
    setDisplayIndentGuides(displayIndentGuides: boolean): void {
        throw new Error("MonacoCodeEditor.setDisplayIndentGuides");
    }
    setFontSize(fontSize: string | null): void {
        throw new Error("MonacoCodeEditor.setFontSize");
    }
    setPadding(padding: number): void {
        throw new Error("MonacoCodeEditor.setPadding");
    }
    setReadOnly(readOnly: boolean): void {
        throw new Error("MonacoCodeEditor.setReadOnly");
    }
    setSession(session: EditSession): void {
        throw new Error("MonacoCodeEditor.setSession");
    }
    setTabSize(tabSize: number): void {
        throw new Error("MonacoCodeEditor.setTabSize");
    }
    setThemeCss(themeId: string, href?: string): void {
        throw new Error("MonacoCodeEditor.setThemeCss");
    }
    setThemeDark(isDark: boolean): void {
        throw new Error("MonacoCodeEditor.setThemeDark");
    }
    setShowFoldWidgets(showFoldWidgets: boolean): void {
        throw new Error("MonacoCodeEditor.setShowFoldWidgets");
    }
    setShowGutter(showGutter: boolean): void {
        throw new Error("MonacoCodeEditor.setShowGutter");
    }
    setShowInvisibles(showInvisibles: boolean): void {
        throw new Error("MonacoCodeEditor.setShowInvisibles");
    }
    setShowLineNumbers(showLineNumbers: boolean): void {
        throw new Error("MonacoCodeEditor.setShowLineNumbers");
    }
    setShowPrintMargin(showPrintMargin: boolean): void {
        throw new Error("MonacoCodeEditor.setShowPrintMargin");
    }
    setUseSoftTabs(useSoftTabs: boolean): void {
        throw new Error("MonacoCodeEditor.setUseSoftTabs");
    }
    setUndoManager(undoManager: UndoManager): void {
        throw new Error("MonacoCodeEditor.setUndoManager");
    }
    setWrapBehavioursEnabled(wrapBehaviorEnabled: boolean): void {
        throw new Error("MonacoCodeEditor.setWrapBehavioursEnabled");
    }
    tabNext(direction?: Direction): void {
        throw new Error("MonacoCodeEditor.tabNext");
    }
    updateBackMarkers(): void {
        throw new Error("MonacoCodeEditor.updateBackMarkers");
    }
    updateFrontMarkers(): void {
        throw new Error("MonacoCodeEditor.updateFrontMarkers");
    }
    updateFull(): void {
        throw new Error("MonacoCodeEditor.updateFull");
    }
}
