//
// ace.d.ts
//
// version 0.1.163
//
// This file was created manually in order to support the Ace library.
//
// These declarations are appropriate when using the library through a system loader
// with the module name 'ace.js'.
//
// These declarations are appropriate when using the library through the global
// variable, 'ace'.
//

/**
 * Browser Code Editor targeting ES6 written in TypeScript.
 * The name 'ace' will be reported in compiler diagnostics.
 */
declare module ace {

    function edit(container: HTMLElement): Editor;

    interface AbstractLayer {
        element: HTMLDivElement;
        setCssClass(className: string, include: boolean): void;
    }

    function createAnchor(doc: Document, row: number, column: number): Anchor;

    interface Anchor extends EventBus<Anchor>, Position {
        column: number;
        row: number;
        attach(doc: Document): void;
        detach(): void;
        getDocument(): Document;
        getPosition(): Position;
        off(eventName: string, callback: (event: any, source: Anchor) => any): void;
        on(eventName: string, callback: (event: any, source: Anchor) => any): void;
        setPosition(row: number, column: number, noClip?: boolean): void;
    }

    interface Annotation {

        /**
         *
         */
        className: string;

        /**
         *
         */
        column?: number;

        /**
         *
         */
        html?: string;

        /**
         *
         */
        row: number;

        /**
         *
         */
        text: string;

        /**
         * "error", "info", or "warning".
         */
        type: string;
    }

    interface Command {
        aceCommandGroup?: string;
        bindKey?: string | { win: string; mac: string };
        exec: EditorAction;
        isAvailable?: (editor: Editor) => boolean;
        multiSelectAction?: any;
        name: string;
        passEvent?: boolean;
        readOnly?: boolean;
        scrollIntoView?: boolean;
    }

    interface CommandManager {
        hashHandler: KeyboardHandler;
        addCommand(command: Command): void;
        getCommandByName(name: string): Command;
        off(eventName: string, callback: (event: any, source: CommandManager) => any): void;
        on(eventName: string, callback: (event: any, source: CommandManager) => any): void;
    }

    interface Completion {

        /**
         *
         */
        caption?: string;

        /**
         *
         */
        exactMatch?: number;

        /**
         *
         */
        identifierRegex?: RegExp;

        /**
         *
         */
        matchMask?: number;

        /**
         *
         */
        meta?: string;

        /**
         *
         */
        score?: number;

        /**
         *
         */
        snippet?: string;

        /**
         *
         */
        value?: string;
    }

    interface CompletionEntry {
        kind: string;
        kindModifiers: string;
        name: string;
        sortText: string;
    }

    interface CursorConfig extends LayerConfig {
        characterWidth: number;
        height: number;
        offset: number;
    }

    function createCursorLayer(parent: HTMLElement): CursorLayer;

    interface CursorLayer extends AbstractLayer {
        destroy(): void;
        getPixelPosition(position?: Position, onScreen?: boolean): PixelPosition;
        hideCursor(): void;
        restartTimer(): void;
        setPadding(padding: number): void;
        setSession(session: EditSession): void;
        setSmoothBlinking(smoothBlinking: boolean): void;
        showCursor(): void;
        update(config: CursorConfig): void;
    }

    interface Delta {

        /**
         *
         */
        action: string;

        /**
         *
         */
        deltas?: Delta[];

        /**
         *
         */
        end: Position;

        /**
         *
         */
        folds?: Fold[];

        /**
         *
         */
        group?: string;

        /**
         *
         */
        ignore?: boolean;

        /**
         *
         */
        lines?: string[];

        /**
         *
         */
        start: Position;
    }

    function createDocument(textOrLines: string | string[]): Document;

    interface Document extends EventBus<Document> {
        applyDelta(delta: Delta): void;
        applyDeltas(deltas: Delta[]): void;
        createAnchor(row: number, column: number): Anchor;
        getAllLines(): string[];
        getLength(): number;
        getLine(row: number): string;
        getLines(firstRow?: number, lastRow?: number): string[];
        getLinesForRange(range: Range): string[];
        getNewLineCharacter(): string;
        getNewLineMode(): string;
        getTextRange(range: Range): string;
        getValue(): string;
        indexToPosition(index: number, startRow: number): Position;
        insert(position: Position, text: string): Position;
        isNewLine(text: string): boolean;
        off(eventName: string, callback: (event: any, source: Document) => any): void;
        on(eventName: string, callback: (event: any, source: Document) => any, capturing?: boolean): void;
        positionToIndex(position: Position, startRow: number): number;
        remove(range: Range): Position;
        removeInLine(row: number, startColumn: number, endColumn: number): Position;
        removeNewLine(row: number): void;
        replace(range: Range, text: string): Position;
        revertDeltas(deltas: Delta[]): void;
        setNewLineMode(newLineMode: string): void;
        setValue(text: string): void;
    }

    interface LayerConfig {
        firstRowScreen: number;
        lineHeight: number;
    }

    interface Marker {
        clazz: string;
        id?: number;
        inFront?: boolean;
        range?: Range;
        renderer?: MarkerRenderer;
        type: string;
        update?: (html: (number | string)[], markerLayer: MarkerLayer, session: EditSession, config: MarkerConfig) => void;
    }

    interface MarkerConfig extends LayerConfig {

        /**
         * TODO: Is this distinct from firstRowScreen?
         * @property firstRow
         * @type number
         */
        firstRow: number;

        /**
         * @property lastRow
         * @type number
         */
        lastRow: number;

        /**
         * @property characterWidth
         * @type number
         */
        characterWidth: number;
    }

    interface MarkerRenderer {
        (html: (number | string)[], range: Range, left: number, top: number, config: MarkerConfig): void;
    }

    function createEditSession(doc: Document): EditSession;

    interface EditSession extends EventBus<EditSession> {
        $clipRangeToDocument(range: Range): Range;
        addDynamicMarker(marker: Marker, inFront?: boolean): Marker;
        addGutterDecoration(row: number, className: string): void;
        addMarker(range: Range, clazz: string, type: Function | string, inFront: boolean): number;
        clearAnnotations(): void;
        clearBreakpoint(row: number): void;
        clearBreakpoints(): void;
        clipPositionToDocument(row: number, column: number): Position;
        documentToScreenColumn(docRow: number, docColumn: number): number;
        documentToScreenPosition(docRow: number, docColumn: number): Position;
        documentToScreenRange(range: Range): Range;
        documentToScreenRow(docRow: number, docColumn: number): number;
        duplicateLines(firstRow: number, lastRow: number): number;
        findClosingBracket(bracket: string, position: Position, typeRe?: RegExp): Position;
        findMatchingBracket(bracket: string, position: Position, typeRe?: RegExp): Position;
        findOpeningBracket(bracket: string, position: Position, typeRe?: RegExp): Position;
        foldAll(startRow?: number, endRow?: number, typeRe?: RegExp): void;
        getAllFolds(): Fold[];
        getAnnotations(): Annotation[];
        getAWordRange(row: number, column: number): Range;
        getBracketRange(position: Position): Range;
        getBreakpoints(): string[];
        getDocument(): Document;
        getDocumentLastRowColumn(docRow: number, docColumn: number): number;
        getDocumentLastRowColumnPosition(docRow: number, docColumn: number): Position;
        getFoldsInRangeList(ranges: RangeBasic[]): Fold[];
        getLength(): number;
        getLine(row: number): string;
        getLines(firstRow: number, lastRow: number): string[];
        getMarkers(inFront: boolean): { [id: number]: Marker };
        getMode(): LanguageMode;
        getNewLineMode(): string;
        getOverwrite(): boolean;
        getRowLength(row: number): number;
        getRowLineCount(row: number): number;
        getRowSplitData(row: number): string;
        getRowWrapIndent(screenRow: number): number;
        getScreenLastRowColumn(screenRow: number): number;
        getScreenLength(): number;
        getScreenTabSize(screenColumn: number): number;
        getScreenWidth(): number;
        getScrollLeft(): number;
        getScrollTop(): number;
        getSelection(): Selection;
        getState(row: number): string;
        getTabSize(): number;
        getTabString(): string;
        getTextRange(range: Range): string;
        getTokenAt(row: number, column: number): Token;
        getTokens(row: number): Token[];
        getUndoManager(): UndoManager;
        getUseSoftTabs(): boolean;
        getUseWorker(): boolean;
        getUseWrapMode(): boolean;
        getValue(): string;
        getWordRange(row: number, column: number): Range;
        getWrapLimitRange(): { min: number; max: number };
        highlight(re: RegExp): void;
        highlightLines(startRow: number, endRow: number, clazz: string, inFront: boolean): Range;
        indentRows(startRow: number, endRow: number, indentString: string): void;
        insert(position: Position, text: string): Position;
        isTabStop(position: Position): boolean;
        markUndoGroup(): void;
        moveLinesDown(firstRow: number, lastRow: number): number;
        moveLinesUp(firstRow: number, lastRow: number): number;
        moveText(fromRange: Range, toPosition: Position, copy: boolean): Range;
        off(eventName: string, callback: (event: any, source: EditSession) => any): void;
        on(eventName: string, callback: (event: any, source: EditSession) => any, capturing?: boolean): void;
        outdentRows(range: Range): void;
        redoChanges(deltas: Delta[], dontSelect?: boolean): Range;
        remove(range: Range): Position;
        removeFullLines(firstRow: number, lastRow: number): string;
        removeGutterDecoration(row: number, className: string): void;
        removeMarker(markerId: number): void;
        replace(range: Range, text: string): Position;
        screenToDocumentPosition(screenRow: number, screenColumn: number): Position;
        setAnnotations(annotations: Annotation[]): void;
        setBreakpoint(row: number, className: string): void;
        setBreakpoints(rows: number[]): void;
        setDocument(doc: Document): void;
        /**
         *
         */
        setLanguageMode(mode: LanguageMode, callback: (err: any, worker: WorkerClient) => any): void;
        setModified(modified: boolean): void;
        setOverwirite(overwrite: boolean): void;
        setScrollLeft(scrollLeft: number): void;
        setScrollTop(scrollTop: number): void;
        setSelection(selection: Selection): void;
        setTabSize(tabSize: number): void;
        setUndoManager(undoManager: UndoManager): void;
        setUndoSelect(enable: boolean): void;
        setUseSoftTabs(useSoftTabs: boolean): EditSession;
        setUseWorker(useWorker: boolean): void;
        setUseWrapMode(useWrapMode: boolean): void;
        setValue(text: string): void;
        setWrapLimitRange(min: number, max: number): void;
        toggleFoldWidget(toggleParent?: boolean): void;
        toggleOverwrite(): void;
        toString(): string;
        undoChanges(deltas: Delta[], dontSelect: boolean): Range;
        unfold(location?: number | Position | Range, expandInner?: boolean): Fold[];
    }

    interface EditorAction {
        (editor: Editor, args?: any): any;
    }

    function createEditor(renderer: Renderer, session: EditSession): Editor;

    interface Editor extends EventBus<Editor> {
        commands: CommandManager;
        // completers: Completer[];
        // completeUI: CompletionManager;
        keyBinding: KeyBinding;
        multiSelect: Selection;
        renderer: Renderer;
        selection: Selection;
        session: EditSession;
        snippetManager: SnippetManager;

        $resetCursorStyle(): void;
        addSelectionMarker(orientedRange: Range): Range;
        alignCursors(): void;
        blockIndent(): void;
        blockOutdent(): void;
        blur(): void;
        cancelMouseContextMenu(): void;
        centerSelection(): void;
        clearSelection(): void;
        destroy(): void;
        execCommand(command: Command, args?: any): void;
        expandSnippet(options?: any): boolean;
        find(needle?: string | RegExp, options?: SearchOptions, animate?: boolean): Range;
        findAll(needle?: string | RegExp, options?: SearchOptions, additive?: boolean): number;
        findNext(needle?: string | RegExp, animate?: boolean): void;
        findPrevious(needle?: string | RegExp, animate?: boolean): void;
        focus(): void;
        forEachSelection(action: EditorAction, args: string, options?: { keepOrder?: boolean; $byLines?: boolean }): any;
        getAnimatedScroll(): boolean;
        getBehavioursEnabled(): boolean;
        getCursorPosition(): Position;
        getCursorPositionScreen(): Position;
        getDisplayIndentGuides(): boolean;
        getDragDelay(): number;
        getFadeFoldWidgets(): boolean;
        getFirstVisibleRow(): number;
        getFontSize(): string;
        getHighlightActiveLine(): boolean;
        getHighlightGutterLine(): boolean;
        getHighlightSelectedWord(): boolean;
        getKeyboardHandler(): KeyboardHandler;
        getLastSearchOptions(): SearchOptions;
        getLastVisibleRow(): number;
        getNumberAt(row: number, column: number): { value: string; start: number; end: number };
        getOverwrite(): boolean;
        getPrintMarginColumn(): number;
        getReadOnly(): boolean;
        getScrollSpeed(): number;
        getSelectedText(): string;
        getSelection(): Selection;
        getSelectionRange(): Range;
        getSelectionStyle(): string;
        getSession(): EditSession;
        getShowFoldWidgets(): boolean;
        getShowInvisibles(): boolean;
        getShowPrintMargin(): boolean;
        getTheme(): string;
        getValue(): string;
        getWrapBehavioursEnabled(): boolean;
        gotoLine(lineNumber: number, column?: number, animate?: boolean): void;
        gotoPageDown(): void;
        gotoPageUp(): void;
        indent(): void;
        insert(text: string, pasted?: boolean): void;
        insertSnippet(content: string, options?: any): void;
        isFocussed(): boolean;
        isRowFullyVisible(row: number): boolean;
        isRowVisible(row: number): boolean;
        jumpToMatching(select?: boolean): void;
        modifyNumber(amount: number): void;
        moveCursorTo(row: number, column: number, animate: boolean): void;
        moveCursorToPosition(position: Position): void;
        moveText(range: Range, toPosition: Position, copy: boolean): Range;
        navigateDown(times: number): void;
        navigateFileEnd(): void;
        navigateFileStart(): void;
        navigateLeft(times: number): void;
        navigateLineEnd(): void;
        navigateLineStart(): void;
        navigateRight(times: number): void;
        navigateTo(row: number, column: number): void;
        navigateUp(times: number): void;
        navigateWordLeft(): void;
        navigateWordRight(): void;
        off(eventName: string, callback: (event: any, source: Editor) => any): void;
        on(eventName: string, callback: (event: any, source: Editor) => any, capturing?: boolean): void;
        onBlur(): void;
        onCommandKey(e: KeyboardEvent, hashId: number, keyCode: number): void;
        onCopy(): void;
        onCut(): void;
        onFocus(): void;
        onPaste(text: string): void;
        onTextInput(text: string): void;
        onSelectionChange(unused: any, session: EditSession): void;
        onTextInput(text: string): void;
        redo(): void;
        remove(direction: string): void;
        removeLines(): void;
        removeSelectionMarkers(ranges: Range[]): void;
        removeToLineEnd(): void;
        removeToLineStart(): void;
        removeWordLeft(): void;
        removeWordRight(): void;
        replace(replacement: string, options: SearchOptions): number;
        replaceAll(replacement: string, options: SearchOptions): number;
        resize(force?: boolean): void;
        revealRange(range: Range, animate: boolean): void;
        scrollPageDown(): void;
        scrollPageUp(): void;
        scrollToLine(line: number, center: boolean, animate: boolean, callback: () => void): void;
        scrollToRow(row: number): void;
        selectAll(): void;
        selectMore(dir: number, skip?: boolean, stopAtFirst?: boolean): void;
        selectMoreLines(dir: number, skip?: boolean): void;
        selectPageDown(): void;
        selectpageUp(): void;
        setAutoScrollEditorIntoView(enable: boolean): void;
        setBehavioursEnabled(behavioursEnabled: boolean): void;
        setDisplayIndentGuides(displayIndentGuides: boolean): void;
        setDragDelay(dragDelay: number): void;
        setFadeFoldWidgets(fadeFoldWidgets: boolean): void;
        setFontSize(fontSize: string): void;
        setHighlightActiveLine(highlightActiveLine: boolean): void;
        setHighlightSelectedWord(highlightSelectedWord: boolean): void;
        setKeyboardHandler(keyboardHandler: string | KeyboardHandler): void;
        setLanguageMode(mode: LanguageMode, callback: (err: any) => any): void;
        setOverwrite(overwrite: boolean): void;
        setPadding(padding: number): void;
        setPrintMarginColumn(printMarginColumn: number): void;
        setReadOnly(readOnly: boolean): void;
        setScrollSpeed(scrollSpeed: number): void;
        setSelectionStyle(selectionStyle: string): void;
        setSession(session: EditSession): void;
        setShowFoldWidgets(showFoldWidgets: boolean): void;
        setShowInvisibles(showInvisibles: boolean): void;
        setShowPrintMargin(showPrintMargin: boolean): void;
        setStyle(style: string): void;
        setTabSize(tabSize: number): void;
        setThemeCss(themeId: string, href?: string): void;
        setThemeDark(isDark: boolean): void;
        setValue(text: string, cursorPos?: number): void;
        setWrapBehavioursEnabled(wrapBehavioursEnabled: boolean): void;
        sortLines(): void;
        splitLine(): void;
        toggleBlockComment(): void;
        toggleCommentLines(): void;
        toggleOverwrite(): void;
        toLowerCase(): void;
        toUpperCase(): void;
        transposeLetters(): void;
        undo(): void;
        unsetStyle(style: string): void;
        updateBackMarkers(): void;
        updateFrontMarkers(): void;
    }

    interface EventBus<T> {
        on(eventName: string, callback: (event: any, source: T) => any, capturing?: boolean): void;
        off(eventName: string, callback: (event: any, source: T) => any): void;
    }

    function createFold(range: Range, placeholder: string): Fold;

    interface Fold {
        ranges: Range[];
        addSubFold(fold: Fold): Fold;
        clone(): Fold;
        pointIndex(pos: Position, excludeEdges?: boolean, startIndex?: number): number;
        restoreRange(range: Fold): void;
        setFoldLine(foldLine: FoldLine): void;
        toString(): string;
    }

    function createFoldLine(foldData: any, folds: Fold[]): FoldLine;

    interface FoldLine {
        action: string;
        data: Fold;
        addFold(fold: Fold): void;
        containsRow(row: number): boolean;
        shiftRow(shift: number): void;
        // FIXME callback is any
        walk(callback: any, endRow: number, endColumn: number): void;
    }

    interface FoldMode {

    }

    interface GutterLayer {

    }

    interface KeyBinding {
        addKeyboardHandler(kb: KeyboardHandler, pos?: number): void;
        getKeyboardHandler(): KeyboardHandler;
        onCommandKey(e: KeyboardEvent, hashId: number, keyCode: number): void;
        onTextInput(text: string): void;
        removeKeyboardHandler(kb: KeyboardHandler): boolean;
        setDefaultHandler(kb: KeyboardHandler): void;
        setKeyboardHandler(kb: KeyboardHandler): void;
    }

    function createKeyboardHandler(commands?: Command[], platform?: string): KeyboardHandler;

    interface KeyboardHandler {
        commandKeyBinding: { [hashId: number]: { [name: string]: Command } };
        commands: { [name: string]: Command };
        platform: String;
        addCommand(command: Command): void;
        _buildKeyHash(command: Command): void;
        addCommand(command: Command): void;
        addCommands(commands: Command[]): void;
        attach(editor: Editor): void;
        bindCommand(key: string, command: Command): void;
        bindKey(key: string, action: EditorAction): void;
        bindKeys(keyList: { [name: string]: EditorAction }): void;
        detach(editor: Editor): void;
        findKeyCommand(hashId: number, keyString: string): Command;
        handleKeyboard(data: any, hashId: number, keyString: string, keyCode?: number, e?: KeyboardEvent): { command: Command };
        parseKeys(keys: string): KeyHash;
        removeCommand(command: string | Command): void;
        removeCommands(commands: { [name: string]: string | Command }): void;
    }

    interface KeyHash {
        hashId: number;
        key: string;
    }

    interface LanguageMode {
        $id: string;
        foldingRules: FoldMode;
        indentWithTabs: boolean;
        modes: LanguageMode[];
        nonTokenRe: RegExp;
        tokenRe: RegExp;
        autoOutdent(state: string, session: EditSession, row: number): number;
        checkOutdent(state: string, line: string, text: string): boolean;
        createWorker(session: EditSession): WorkerClient;
        getCompletions(state: string, session: EditSession, position: Position, prefix: string): Completion[];
        getmatching(session: EditSession): Range;
        getNextLineIndent(state: string, line: string, tab: string): string;
        getTokenizer(): Tokenizer;
        toggleBlockComment(state: string, session: EditSession, range: Range, cursor: Position): void;
        toggleCommentLines(state: string, session: EditSession, startRow: number, endRow: number): boolean;
        transformAction(state: string, action: String, editor: Editor, session: EditSession, data: string | Range): TextAndSelection | Range;
    }

    interface MarkerLayer {

    }

    interface OutputFile {
        name: string;
        text: string;
        writeByteOrderMark: boolean;
    }

    interface PixelPosition {
        left: number;
        top: number;
    }

    interface Position {
        column: number;
        row: number;
    }

    interface QuickInfo {
        displayParts: SymbolDisplayPart[];
        documentation: SymbolDisplayPart[];
        kind: string;
        kindModifiers: string;
        textSpan: TextSpan;
    }

    function createRange(startRow: number, startColumn: number, endRow: number, endColumn: number): Range;

    interface Range {
        collapseChildren: number;
        cursor: Position;
        desiredColumn: number;
        end: Position;
        isBackwards: boolean;
        markerId: number;
        start: Position;
        clipRows(firstRow: number, lastRow: number): Range;
        clone(): Range;
        collapseRows(): Range;
        compare(row: number, column: number): number;
        compareEnd(row: number, column: number): number;
        compareInside(row: number, column: number): number;
        comparePoint(point: Position): number;
        compareRange(range: Range): number;
        compareStart(row: number, column: number): number;
        contains(row: number, column: number): boolean;
        containsRange(range: Range): boolean;
        extend(row: number, column: number): Range;
        inside(row: number, column: number): boolean;
        insideEnd(row: number, column: number): boolean;
        insideStart(row: number, column: number): boolean;
        intersects(range: Range): boolean;
        isEmpty(): boolean;
        isEnd(row: number, column: number): boolean;
        isEqual(range: Range): boolean;
        isMultiLine(): boolean;
        isStart(row: number, column: number): boolean;
        setEnd(row: number, column: number): void;
        setStart(row: number, column: number): void;
        toString(): string;
    }

    interface RangeBasic {
        start: Position;
        end: Position;
    }

    interface Rule {
        caseInsensitive?: boolean;
        defaultToken?: string;
        // FIXME: value and stack are any
        onMatch?: (value: any, state: string, stack: any) => any;
        regex?: any;
        splitRegex?: RegExp;
        token?: string;
        tokenArray?: any;
        next?: string;
        merge?: boolean;
    }

    interface ScreenCoordinates {
        pageX: number;
        pageY: number;
    }

    interface SearchOptions {
        $isMultiLine: boolean;
        backwards: boolean;
        caseSensitive: boolean;
        needle: string | RegExp;
        preserveCase: boolean;
        preventScroll: boolean;
        range: Range;
        skipCurrent: boolean;
        start: Position;
        wholeWord: boolean;
        wrap: boolean;
    }

    interface Snippet {
        content: string;
        endGuard: string;
        endRe: RegExp;
        endTrigger: string;
        endTriggerRe: RegExp;
        guard: string;
        matchAfter?: any;
        matchBefore?: any;
        name: string;
        replaceAfter?: any;
        replaceBefore?: any;
        scope: string;
        startRe: RegExp;
        tabTrigger: string;
        trigger: string;
        triggerRe: RegExp;
    }

    interface SnippetManager {
        snippetMap: { [scope: string]: Snippet[] };
        expandSnippetForSelection(editor: Editor, options?: SnippetOptions): boolean;
        expandWithTab(editor: Editor, options?: SnippetOptions): boolean;
        getActiveScopes(editor: Editor): string[];
        getVariableValue(editor: Editor, varName: string): any;
        insertSnippet(editor: Editor, snippetText: string, options?: SnippetOptions): void;
        off(eventName: string, callback: (event: any, source: SnippetManager) => any): void;
        on(eventName: string, callback: (event: any, source: SnippetManager) => any): void;
        parseSnippetFile(str: string): Snippet[];
        register(snippets: Snippet[], scope?: string): void;
        resolveVariables(snippet: any, editor: Editor): any[];
        tmStrFormat(str: string, ch: { flag: string; guard: string, fmt: string }, editor?: Editor): string;
        unregister(snippets: Snippet[], scope?: string): void;
    }

    interface SnippetOptions {
        dryRun?: boolean;
    }

    interface SymbolDisplayPart {
        kind: string;
        text: string;
    }

    interface TextAndSelection {
        selection: number;
        text: string;
    }

    interface TextLayer {

    }

    interface TextSpan {
        length: number;
        start: number;
    }

    interface Token {
        index: number;
        start: number;
        type: string;
        value: string;
    }

    interface TokenizedLine {
        state: string;
        tokens: Token[];
    }

    function createTokenizer(rules: { [name: string]: Rule[] }): Tokenizer;

    interface Tokenizer {
        getLineTokens(): TokenizedLine;
    }

    function createUndoManager(): UndoManager;

    interface UndoManager {
        execute(options: { action?: string; args: any[]; merge: boolean }): void;
        hasRedo(): boolean;
        hasUndo(): boolean;
        isClean(): boolean;
        markClean(): void;
        redo(dontSelect?: boolean): Range;
        reset(): void;
        undo(dontSelect?: boolean): Range;
    }

    function createRenderer(container: HTMLElement): Renderer;

    interface Renderer extends EventBus<Renderer> {
        $cursorLayer: CursorLayer;
        $gutterLayer: GutterLayer;
        $markerBack: MarkerLayer;
        $markerFront: MarkerLayer;
        $scrollAnimation: { from: number; to: number; steps: number[] };
        $textLayer: TextLayer;
        characterWidth: number;
        keepTextAreaAtCursor: boolean;
        lineHeight: number;
        maxLines: number;
        $updateSizeAsync(): void;
        addCssClass(cssClass: string): void;
        adjustWrapLimit(): boolean;
        getAnimatedScroll(): boolean;
        getContainerElement(): HTMLElement;
        getDisplayIndentGuides(): boolean;
        getFadeFoldWidgets(): boolean;
        getFirstVisibleRow(): number;
        getLastVisibleRow(): number;
        getPadding(): number;
        getPrintMarginColumn(): number;
        getShowGutter(): boolean;
        getShowInvisibles(): boolean;
        getShowPrintMargin(): boolean;
        getTextAreaContainer(): HTMLElement;
        getTheme(): string;
        off(eventName: string, callback: (event: MessageEvent, source: Renderer) => any): void;
        on(eventName: string, callback: (event: MessageEvent, source: Renderer) => any): void;
        onChangeTabSize(): void;
        scrollBy(deltaX: number, deltaY: number): void;
        scrollCursorIntoView(cursor: Position, offset?: number, $viewMargin?: { top: number, bottom: number }): void;
        scrollSelectionIntoView(anchor: Position, lead: Position, offset?: number): void;
        setAnimatedScroll(animatedScroll: boolean): void;
        setAnnotations(annotations: Annotation[]): void;
        setCssClass(className: string, include: boolean): void;
        setCursorLayerOff(): void;
        setDefaultCursorStyle(): void;
        setDisplayIndentGuides(displayIndentGuides: boolean): void;
        setFadeFoldWidgets(fadeFoldWidgets: boolean): void;
        setHScrollBarAlwaysVisible(hScrollBarAlwaysVisible: boolean): void;
        setPadding(padding: number): void;
        setPrintMarginColumn(printMarginColumn: number): void;
        setSession(session: EditSession): void;
        setShowGutter(showGutter: boolean): void;
        setShowInvisibles(showInvisibles: boolean): void;
        setShowPrintMargin(showPrintMargin: boolean): void;
        setThemeCss(cssClass: string, href: string): void;
        textToScreenCoordinates(row: number, column: number): ScreenCoordinates;
        updateCharacterSize(): void;
        updateFontSize(): void;
        updateFull(force?: boolean): void;
        updateLines(firstRow: number, lastRow: number, force?: boolean): void;
        updateText(): void;
    }

    function createWorkerClient(workerUrl: string): WorkerClient;

    interface WorkerClient extends EventBus<WorkerClient> {
        attachToDocument(doc: Document): void;
        call(cmd: string, args: any, callback?: (data: any) => any): void;
        detachFromDocument(): void;
        emit(event: string, data: { data: any }): void;
        init(scriptImports: string[], moduleName: string, className: string, callback: (err: any) => any): void;
        off(eventName: string, callback: (event: MessageEvent, source: WorkerClient) => any): void;
        on(eventName: string, callback: (event: MessageEvent, source: WorkerClient) => any): void;
        send(cmd: string, args: any): void;
        terminate(): void;
    }

    class Workspace {
        trace: boolean;
        constructor(workerUrl: string, scriptImports: string[]);

        /**
         * Attaches the specified editor to the workspace.
         */
        attachEditor(fileName: string, editor: Editor, callback: (err?: any) => void): void;
        
        /**
         * Detaches the specified editor from the workspace.
         */
        detachEditor(fileName: string, editor: Editor, callback: (err?: any) => void): void;

        /**
         * Detaches all editors from the workspace.
         */
        detachEditors(callback: (err?: any) => void): void;

        /**
         * Ensures that the workspace contains the specified script.
         */
        ensureScript(fileName: string, content: string, callback: (err?: any) => void): void;

        /**
         * Sets the 'module' compiler setting.
         */
        setModuleKind(moduleKind: string, callback: (err: any) => void): void;

        /**
         * Sets the 'target' compiler setting.
         */
        setScriptTarget(scriptTarget: string, callback: (err?: any) => void): void;

        /**
         * Sets the trace setting for the worker.
         */
        setTrace(trace: boolean, callback: (err?: any) => void): void;

        /**
         * Initializes the worker.
         */
        init(callback: (err: any) => any): void;

        /**
         * Removes the specified script file from the workspace.
         */
        removeScript(fileName: string, callback: (err?: any) => void): void;

        /**
         * Loads the default library by specifying the URL.
         */
        setDefaultLibrary(url: string, callback: (err: any) => any): void;

        /**
         * Terminates the worker. The workspace cannot be recycled.
         */
        terminate(callback: (err: any) => any): void;

        /**
         * Trigger output files to be emitted to each editor.
         */
        outputFiles(): void;
    }

    function createCssMode(workerUrl: string, scriptImports: string[]): LanguageMode;
    function createHtmlMode(workerUrl: string, scriptImports: string[]): LanguageMode;
    function createJavaScriptMode(workerUrl: string, scriptImports: string[]): LanguageMode;
    function createMarkdownMode(workerUrl: string, scriptImports: string[]): LanguageMode;
    function createTextMode(workerUrl: string, scriptImports: string[]): LanguageMode;
    function createTypeScriptMode(workerUrl: string, scriptImports: string[]): LanguageMode;
    function createXmlMode(workerUrl: string, scriptImports: string[]): LanguageMode;
}

// This is the AMD module name.
declare module 'ace.js' {
    export default ace;
}
