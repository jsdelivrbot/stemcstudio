import { Anchor } from "./Anchor";
import { mixin } from "./lib/oop";
import { computedStyle, hasCssClass } from "./lib/dom";
import { createDelayedCall } from './lib/lang/createDelayedCall';
import { DelayedCall } from './lib/lang/DelayedCall';
import { stringRepeat } from "./lib/lang";
import { isIE, isMac, isWebKit, isMozilla } from "./lib/useragent";
import { EditorMouseEvent } from './EditorMouseEvent';
import { EditSession as NativeEditSession } from './EditSession';
import { GutterLayer } from "./layer/GutterLayer";
import { GutterTooltip } from './GutterTooltip';
import { KeyboardHandler as KeyboardHandlerClazz } from "./keyboard/KeyboardHandler";
import { KeyBinding } from "./keyboard/KeyBinding";
import { TextInput } from "./keyboard/TextInput";
import { Delta } from "editor-document";
import { Action } from "./keyboard/Action";
import { Search } from "./Search";
import { assembleRegExp } from './Search';
import { FirstAndLast } from "./FirstAndLast";
import { Fold } from "./Fold";
import { LineWidget } from './LineWidget';
import { LineWidgetManager } from './LineWidgetManager';
import { Position } from "editor-document";
import { Range } from "./Range";
import { RangeBasic } from "./RangeBasic";
import { collapseRows, contains, compare, comparePoint, compareRange, insideStart, isEmpty, isEqual, isMultiLine, moveBy, setEnd } from "./RangeHelpers";
import { RangeList } from './RangeList';
import { TextAndSelection } from "./TextAndSelection";
import { EventEmitterClass } from "./lib/EventEmitterClass";
import { Command } from "./commands/Command";
import { CommandManager } from "./commands/CommandManager";
import { TokenIterator } from "./TokenIterator";
import { COMMAND_NAME_AUTO_COMPLETE } from './editor_protocol';
import { COMMAND_NAME_BACKSPACE } from './editor_protocol';
import { COMMAND_NAME_COPY } from './editor_protocol';
import { COMMAND_NAME_CUT } from './editor_protocol';
import { COMMAND_NAME_DEL } from './editor_protocol';
import { COMMAND_NAME_INSERT_STRING } from './editor_protocol';
import { COMMAND_NAME_PASTE } from './editor_protocol';
import { Renderer } from './Renderer';
import { Completer } from "./Completer";
import { CompletionManager } from "./autocomplete/CompletionManager";
import { refChange } from './refChange';
import { SearchOptions } from './SearchOptions';
import { Selection } from './Selection';
import { stringTrimLeft, stringTrimRight } from "./lib/lang";
import { addListener, addMouseWheelListener, addMultiMouseDownListener, capture, preventDefault, stopEvent } from "./lib/event";
import { EditorChangeSessionEvent } from './events/EditorChangeSessionEvent';
import { SessionChangeEditorEvent } from './events/SessionChangeEditorEvent';
import { SessionChangeCursorEvent } from './events/SessionChangeCursorEvent';
import { AnchorChangeEvent } from './events/AnchorChangeEvent';
import { SelectionAddRangeEvent } from './events/SelectionAddRangeEvent';
import { SelectionRemoveRangeEvent } from './events/SelectionRemoveRangeEvent';
import { SelectionMultiSelectEvent } from './events/SelectionMultiSelectEvent';
import { SelectionSingleSelectEvent } from './events/SelectionSingleSelectEvent';
import { UndoManager as NativeUndoManager } from './UndoManager';
import { QuickInfoTooltip as NativeQuickInfoTooltip } from './workspace/QuickInfoTooltip';
import { Annotation } from './Annotation';
import { EditSession } from './EditSession';
import { Direction } from '../editor/Direction';
import { KeyboardHandler } from '../editor/keyboard/KeyboardHandler';
import { MarkerType } from '../editor/Marker';
import { MarkerRenderer } from '../editor/layer/MarkerRenderer';
import { OrientedRange } from './RangeBasic';
import { PixelPosition } from './PixelPosition';
import { QuickInfoTooltip } from '../editor/workspace/QuickInfoTooltip';
import { QuickInfoTooltipHost } from '../editor/workspace/QuickInfoTooltipHost';
import { RangeWithCollapseChildren } from '../editor/RangeBasic';
import { RangeSelectionMarker } from '../editor/RangeBasic';
import { TokenWithIndex } from './Token';
import { UndoManager } from './UndoManager';

const search = new Search();
const DRAG_OFFSET = 0; // pixels

type CursorStyle = 'ace' | 'slim' | 'smooth' | 'wide';
export type EditorStyle = 'ace_selecting' | 'ace_multiselect';

function isRangeSelectionMarker(orientedRange: OrientedRange): orientedRange is RangeSelectionMarker {
    if (orientedRange) {
        const candidate = orientedRange as RangeSelectionMarker;
        if (typeof candidate.markerId === 'number') {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

function compareAnnotations(p1: Annotation, p2: Annotation): number {
    return p1.row - p2.row || (p1.column as number) - (p2.column as number);
}

function comparePoints(p1: { row: number; column: number }, p2: Annotation): number {
    return p1.row - p2.row || (p1.column as number) - (p2.column as number);
}

function binarySearch(annotations: Annotation[], needle: { row: number; column: number }, comparator: (lhs: { row: number; column: number }, rhs: Annotation) => number) {
    let first = 0;
    let last = annotations.length - 1;

    while (first <= last) {
        const mid = (first + last) >> 1;
        const c = comparator(needle, annotations[mid]);
        if (c > 0) {
            first = mid + 1;
        }
        else if (c < 0) {
            last = mid - 1;
        }
        else {
            return mid;
        }
    }

    // Return the nearest lesser index, "-1" means "0, "-2" means "1", etc.
    return -(first + 1);
}

function find(session: EditSession, needle: string | RegExp, direction: Direction): Range | null | undefined {
    search.$options.wrap = true;
    search.$options.needle = needle;
    search.$options.backwards = (direction === Direction.BACKWARD);
    return search.find(session);
}

/**
 * Returns "${operation} is not allowed in readOnly mode."
 */
function verbotenWhenReadOnly(operation: string): string {
    return `${operation} is not allowed in readOnly mode.`;
}

export type EditorEventName = 'blur'
    | 'change'
    | 'changeAnnotation'
    | 'changeBreakpoint'
    | 'changeHoverMarker'
    | 'changeMode'
    | 'changeOverwrite'
    | 'changeSelection'
    | 'changeSelectionStyle'
    | 'changeSession'
    | 'changeStatus'
    | 'click'
    | 'cut'
    | 'dblclick'
    | 'destroy'
    | 'findSearchBox'
    | 'focus'
    | 'gutterclick'
    | 'gutterdblclick'
    | 'guttermousedown'
    | 'guttermousemove'
    | 'hide'
    | 'input'
    | 'mousedown'
    | 'mousemove'
    | 'mouseup'
    | 'mousewheel'
    | 'nativecontextmenu'
    | 'paste'
    | 'quadclick'
    | 'select'
    | 'show'
    | 'tripleclick';

// const DragdropHandler = require("./mouse/dragdrop_handler").DragdropHandler;

export interface EditorEventHandler {
    (event: any, editor: Editor): void;
}

/**
 * The `Editor` acts as a controller, mediating between the session and renderer.
 */
export class Editor {

    /**
     *
     */
    public renderer: Renderer;

    /**
     *
     */
    public session: NativeEditSession | undefined;

    private eventBus: EventEmitterClass<EditorEventName, any, Editor>;

    private readonly gotoDefinitionBus = new EventEmitterClass<'gotoDefinition', Position, Editor>(this);
    public readonly gotoDefinitionEvents = this.gotoDefinitionBus.events('gotoDefinition');

    /**
     * Have to make this public to support error marker extension.
     */
    public $mouseHandler: IGestureHandler;

    /**
     * The command manager.
     * It is initially devoid of commands.
     */
    public readonly commands = new CommandManager<Editor>(isMac ? "mac" : "win", []);

    /**
     *
     */
    public keyBinding: KeyBinding<Editor>;

    /**
     *
     */
    public completers: Completer[] = [];

    /**
     *
     */
    public completionManager: CompletionManager;

    public widgetManager: LineWidgetManager | null;

    /**
     * The renderer container element.
     */
    public container: HTMLElement;
    public textInput: TextInput;
    public inMultiSelectMode: boolean;

    /**
     *
     */
    public multiSelect: Selection | undefined;

    public inVirtualSelectionMode: boolean;
    public $blockSelectEnabled: boolean;

    /**
     * 'ace', 'slim', 'smooth', or 'wide'
     */
    private $cursorStyle: CursorStyle;

    public $isFocused: boolean;
    /**
     * FIXME: Dead code?
     */
    // private $keybindingId: any;
    /**
     *
     */
    private $behavioursEnabled = true;
    private $wrapBehavioursEnabled = true;
    private $blockScrolling: number;
    private $highlightActiveLine = true;
    private $highlightPending: boolean;
    private $highlightSelectedWord = true;
    private $highlightTagPending: boolean;
    /**
     * 
     */
    private $mergeUndoDeltas: boolean | 'always' = true;
    /**
     * The internal representation of the readOnly property.
     * The default setting is `false`, meaning that the editor is writeable.
     */
    private $readOnly = false;
    private readonly $readOnlyBus = new EventEmitterClass<'$readOnly', { oldValue: boolean; newValue: boolean }, Editor>(this);
    public readonly readOnlyEvents = this.$readOnlyBus.events('$readOnly');

    private $scrollAnchor: HTMLDivElement;
    /**
     * Used by SearchBox.
     */
    public $search: Search;
    private _$emitInputEvent: DelayedCall;

    /**
     * Maybe rename to selectionRanges:
     */
    private readonly selectionRanges_: Range[] = [];

    /**
     *
     */
    private $selectionStyle: 'line' | 'text' = 'line';
    private $opResetTimer: DelayedCall;
    private curOp: { command?: Command<Editor>; args?: any; scrollTop?: number; docChanged?: boolean; selectionChanged?: boolean } | null;
    private prevOp: { command?: Command<Editor>; args?: any };
    private lastFileJumpPos: Range | null;
    /**
     * FIXME: Dead code?
     */
    // private previousCommand: Command<Editor> | null;
    private $mergeableCommands: string[];
    private mergeNextCommand: boolean;
    // private $mergeNextCommand: boolean;
    private sequenceStartTime: number;
    // TODO: Remove these by using "fat-arrow" methods.
    private $onDocumentChange: (event: any, session: EditSession) => void;
    private $onChangeMode: (event: any, session: EditSession) => void;
    private $onTokenizerUpdate: (event: any, session: EditSession) => void;
    private $onChangeTabSize: (event: any, editSession: EditSession) => any;
    private $onChangeWrapLimit: (event: any, session: EditSession) => void;
    private $onChangeWrapMode: (event: any, session: EditSession) => void;
    private $onChangeFold: (event: any, session: EditSession) => void;
    private $onChangeBreakpoint: (event: any, session: EditSession) => void;
    private $onChangeAnnotation: (event: any, session: EditSession) => void;
    private $onChangeOverwrite: (event: any, session: EditSession) => void;
    private $onScrollTopChange: (event: any, session: EditSession) => void;
    private $onScrollLeftChange: (event: any, session: EditSession) => void;

    private $onSelectionChangeCursor: (event: any, selection: Selection) => void;

    /**
     * 
     */
    private removeChangeSelectionHandler: (() => void) | undefined;

    /**
     * 
     */
    public exitMultiSelectMode: () => void;

    /**
     * 
     */
    private readonly uuid = `${Math.random()}`;

    /**
     * Creates a new `Editor` object.
     */
    constructor(renderer: Renderer | undefined, session: EditSession | undefined) {
        refChange('start');
        refChange(this.uuid, 'Editor', +1);
        this.eventBus = new EventEmitterClass<EditorEventName, any, Editor>(this);
        this.curOp = null;
        this.prevOp = {};
        this.$mergeableCommands = [COMMAND_NAME_BACKSPACE, COMMAND_NAME_DEL, COMMAND_NAME_INSERT_STRING];

        if (renderer) {
            this.container = renderer.getContainerElement();
            this.renderer = renderer;
            this.textInput = new TextInput(renderer.getTextAreaContainer(), this);
            this.renderer.textarea = this.textInput.getElement();
        }

        this.keyBinding = new KeyBinding<Editor>(this, this.commands.hashHandler);

        this.$mouseHandler = new MouseHandler(this);

        // tslint:disable-next-line:no-unused-expression
        new FoldHandler(this);

        this.$blockScrolling = 0;
        this.$search = new Search().set({ wrap: true });

        this.$historyTracker = this.$historyTracker.bind(this);
        this.commands.on("exec", this.$historyTracker);

        this.$initOperationListeners();

        this._$emitInputEvent = createDelayedCall(() => {
            this._signal("input", {});
            if (this.session && this.session.bgTokenizer) {
                this.session.bgTokenizer.scheduleStart();
            }
        });

        // Throttle the background tokenizer scheduling.
        this.on("change", () => {
            this._$emitInputEvent.schedule(31);
        });

        this.on("changeSession", (e: EditorChangeSessionEvent, editor: Editor) => {

            const session = this.session;

            if (session && !session.multiSelect) {
                session.$selectionMarkers = [];
                if (session.selection) {
                    session.selection.ensureRangeList();
                }
                session.multiSelect = session.selection;
            }
            if (session) {
                this.multiSelect = session.multiSelect;
            }

            const onAddRange = (event: SelectionAddRangeEvent, selection: Selection) => {
                this.addSelectionMarker(event.range);

                const renderer = this.renderer;
                if (renderer) {
                    renderer.updateCursor();
                    renderer.updateBackMarkers();
                }
            };

            const onRemoveRange = (event: SelectionRemoveRangeEvent, selection: Selection) => {
                this.removeSelectionMarkers(event.ranges);

                const renderer = this.renderer;
                if (renderer) {
                    renderer.updateCursor();
                    renderer.updateBackMarkers();
                }
            };

            const keyboardMultiSelect = new KeyboardHandlerClazz<Editor>([{
                name: "singleSelection",
                bindKey: "esc",
                exec: function (editor: Editor) { editor.exitMultiSelectMode(); },
                scrollIntoView: "cursor",
                readOnly: true,
                isAvailable: function (editor: Editor) { return editor && editor.inMultiSelectMode; }
            }]);

            const onMultiSelectExec = function (e: { command: Command<Editor>, editor: Editor, args: any }) {
                const command = e.command;
                const editor = e.editor;
                if (!editor.multiSelect) {
                    return;
                }
                let result: any;
                if (!command.multiSelectAction) {
                    if (command.exec) {
                        result = command.exec(editor, e.args || {});
                    }
                    editor.multiSelect.addRange(editor.multiSelect.toOrientedRange());
                    editor.multiSelect.mergeOverlappingRanges();
                }
                else if (command.multiSelectAction === "forEach") {
                    if (command.exec) {
                        result = editor.forEachSelection(command.exec, e.args);
                    }
                }
                else if (command.multiSelectAction === "forEachLine") {
                    if (command.exec) {
                        result = editor.forEachSelection(command.exec, e.args, { $byLines: true });
                    }
                }
                else if (command.multiSelectAction === "single") {
                    editor.exitMultiSelectMode();
                    if (command.exec) {
                        result = command.exec(editor, e.args || {});
                    }
                }
                else {
                    if (typeof command.multiSelectAction === 'function') {
                        // FIXME: Better if this was not a polymorphic type.
                        const action = command.multiSelectAction;
                        result = action(editor, e.args || {});
                    }
                    else {
                        throw new TypeError("multiSelectAction");
                    }
                }
                return result;
            };

            let onMultiSelect = (unused: SelectionMultiSelectEvent | undefined, selection: Selection) => {
                if (this.inMultiSelectMode) {
                    return;
                }
                this.inMultiSelectMode = true;

                this.setStyle("ace_multiselect");
                this.keyBinding.addKeyboardHandler(keyboardMultiSelect);
                this.commands.setDefaultHandler("exec", onMultiSelectExec);

                const renderer = this.renderer;
                if (renderer) {
                    renderer.updateCursor();
                    renderer.updateBackMarkers();
                }
            };

            const onSingleSelect = (unused: SelectionSingleSelectEvent | undefined, selection: Selection) => {
                if (this.session) {
                    const multiSelect = this.session.multiSelect;
                    if (multiSelect && multiSelect.inVirtualMode) {
                        return;
                    }
                    this.inMultiSelectMode = false;

                    this.unsetStyle("ace_multiselect");
                    this.keyBinding.removeKeyboardHandler(keyboardMultiSelect);

                    this.commands.removeDefaultHandler("exec", onMultiSelectExec);

                    const renderer = this.renderer;
                    if (renderer) {
                        renderer.updateCursor();
                        renderer.updateBackMarkers();
                    }

                    this._emit("changeSelection");
                }
            };


            const checkMultiselectChange = (unused: AnchorChangeEvent, anchor: Anchor) => {
                if (this.session) {
                    const multiSelect = this.session.multiSelect;
                    if (this.inMultiSelectMode && multiSelect && !this.inVirtualSelectionMode) {
                        const range = multiSelect.ranges[0];
                        if (multiSelect.isEmpty() && anchor === multiSelect.anchor) {
                            return;
                        }
                        const pos = anchor === multiSelect.anchor
                            ? range.cursor === range.start ? range.end : range.start
                            : range.cursor;
                        if (pos.row !== anchor.row || this.session.$clipPositionToDocument(pos.row, pos.column).column !== anchor.column) {
                            multiSelect.toSingleRange(multiSelect.toOrientedRange());
                        }
                    }
                }
            };

            const oldSession = e.oldSession;
            if (oldSession && oldSession.multiSelect) {
                oldSession.multiSelect.off("addRange", onAddRange);
                oldSession.multiSelect.off("removeRange", onRemoveRange);
                oldSession.multiSelect.off("multiSelect", onMultiSelect);
                oldSession.multiSelect.off("singleSelect", onSingleSelect);
                oldSession.multiSelect.lead.off("change", checkMultiselectChange);
                oldSession.multiSelect.anchor.off("change", checkMultiselectChange);
            }

            if (session && session.multiSelect) {
                session.multiSelect.on("addRange", onAddRange);
                session.multiSelect.on("removeRange", onRemoveRange);
                session.multiSelect.on("multiSelect", onMultiSelect);
                session.multiSelect.on("singleSelect", onSingleSelect);
                session.multiSelect.lead.on("change", checkMultiselectChange);
                session.multiSelect.anchor.on("change", checkMultiselectChange);
            }

            if (session && session.selection && this.inMultiSelectMode !== session.selection.inMultiSelectMode) {
                if (session.selection.inMultiSelectMode) {
                    onMultiSelect(void 0, session.selection);
                }
                else {
                    onSingleSelect(void 0, session.selection);
                }
            }
        });

        this.setSession(session);
    }

    getContainer(): HTMLElement {
        return this.renderer.container;
    }

    /**
     * Returns all the text corresponding to the range with line terminators.
     * If the range is omitted, the range corresponding to the selection is used.
     * Throws an exception if neither range nor selection are available.
     */
    public getTextRange(range?: RangeBasic): string {
        return this.sessionOrThrow().getTextRange(range);
    }

    addCommand(command: Command<Editor>): void {
        this.commands.addCommand(command);
    }

    addCompleter(completer: Completer): void {
        this.completers.push(completer);
    }
    addLineWidget(widget: LineWidget): LineWidget {
        return this.sessionOrThrow().widgetManager.addLineWidget(widget);
    }

    createQuickInfoTooltip(path: string, host: QuickInfoTooltipHost): QuickInfoTooltip | undefined {
        return new NativeQuickInfoTooltip(path, this, host);
    }

    enableLineWidgets(): void {
        const session = this.getSession();
        if (session && !session.widgetManager) {
            session.widgetManager = new LineWidgetManager(session);
            session.widgetManager.attach(this);
        }
    }
    getCommandByName(commandName: string): Command<Editor> {
        return this.commands.getCommandByName(commandName);
    }
    getCursorPixelPosition(pos?: Position): PixelPosition {
        return this.renderer.cursorLayer.getPixelPosition(pos);
    }
    getGutterAnnotations(): ({ className: string | undefined; text: string[] } | null)[] {
        return this.renderer.$gutterLayer.$annotations;
    }
    getGutterWidth(): number {
        return this.renderer.gutterWidth;
    }
    getLineWidgetsAtRow(row: number): LineWidget[] {
        return this.sessionOrThrow().widgetManager.getWidgetsAtRow(row);
    }
    getTabString(): string {
        return this.sessionOrThrow().getTabString();
    }
    isMousePressed(): boolean {
        return this.$mouseHandler.isMousePressed;
    }
    moveSelectionToPosition(pos: Position): void {
        const selection = this.selection;
        if (selection) {
            return selection.moveToPosition(pos);
        }
    }

    addPlaceholderFold(placeholder: string, range: RangeWithCollapseChildren): Fold | undefined {
        return this.sessionOrThrow().addPlaceholderFold(placeholder, range);
    }

    expandFold(fold: Fold): void {
        return this.sessionOrThrow().expandFold(fold);
    }

    /**
     * Looks up a fold at a given row/column. Possible values for side:
     *   -1: ignore a fold if fold.start = row/column
     *   +1: ignore a fold if fold.end = row/column
     */
    getFoldAt(row: number, column: number, side?: number): Fold | undefined | null {
        return this.sessionOrThrow().getFoldAt(row, column, side);
    }

    removeFold(fold: Fold): void {
        return this.sessionOrThrow().removeFold(fold);
    }

    changeStatus(): void {
        this._emit('changeStatus');
    }

    removeLineWidget(widget: LineWidget): void {
        return this.sessionOrThrow().widgetManager.removeLineWidget(widget);
    }

    /**
     * Cleans up the entire editor.
     * 1. Dispose of the UI elements.
     * 2. 
     */
    dispose(): void {
        this.renderer.dispose();
        if (this.session) {
            this.setSession(void 0);
        }
        refChange(this.uuid, 'Editor', -1);
        refChange('stop');
        this._signal("destroy", this);
    }

    /**
     *
     */
    cancelMouseContextMenu(): void {
        this.$mouseHandler.cancelContextMenu();
    }

    tabNext(direction?: number) {
        // Do nothing.
    }

    selectionOrThrow(): Selection {
        return this.sessionOrThrow().selectionOrThrow();
    }

    multiSelectOrThrow(): Selection {
        const multiSelect = this.multiSelect;
        if (multiSelect) {
            return multiSelect;
        }
        else {
            throw new Error(`multiSelect is ${typeof multiSelect}`);
        }
    }

    /**
     *
     */
    get selection(): Selection | undefined {
        const session = this.session;
        if (session) {
            return session.getSelection();
        }
        else {
            return void 0;
        }
    }

    /**
     * When setting the selection, the session must be defined. 
     */
    set selection(selection: Selection | undefined) {
        if (this.session) {
            this.session.setSelection(selection);
        }
        else {
            throw new Error("");
        }
    }

    /**
     * Convenience method for obtaining the session.
     */
    public sessionOrThrow(): NativeEditSession {
        if (this.session) {
            return this.session;
        }
        else {
            throw new Error("session must exist");
        }
    }



    /** 
     * Adds the selection and cursor using the (oriented) range containing the cursor.
     * This method mutates its argument from an OrientedRange to a RangeSelectionMarker.
     * Throws an exception if there is no session.
     */
    addSelectionMarker(orientedRange: OrientedRange): RangeSelectionMarker {
        const session = this.sessionOrThrow();
        if (!orientedRange.cursor) {
            orientedRange.cursor = orientedRange.end;
        }

        const style = this.getSelectionStyle();
        // TODO: This creates a typesafe issue. The mutation of the OrientedRange means that the
        // marker that we add is actually a RangeSelectionMarker.
        const rangeSelectionMarker = orientedRange as RangeSelectionMarker;
        rangeSelectionMarker.markerId = this.addMarker(rangeSelectionMarker, "ace_selection", style);

        session.$selectionMarkers.push(rangeSelectionMarker);
        session.selectionMarkerCount = session.$selectionMarkers.length;
        return rangeSelectionMarker;
    }

    /**
     *
     */
    removeSelectionMarkers(ranges: OrientedRange[]): void {
        const session = this.session;
        if (session) {
            const markerList: RangeSelectionMarker[] = session.$selectionMarkers;
            for (const range of ranges) {
                if (isRangeSelectionMarker(range)) {
                    session.removeMarker(range.markerId);
                    const index = markerList.indexOf(range);
                    if (index !== -1) {
                        markerList.splice(index, 1);
                    }
                }
            }
            session.selectionMarkerCount = markerList.length;
        }
    }

    findAnnotations(row: number, direction: Direction): Annotation[] | undefined {
        const session = this.sessionOrThrow();
        const annotations = session.getAnnotations().sort(compareAnnotations);
        if (!annotations.length) {
            return void 0;
        }

        let i = binarySearch(annotations, { row: row, column: -1 }, comparePoints);
        if (i < 0)
            i = -i - 1;

        if (i >= annotations.length - 1)
            i = direction > 0 ? 0 : annotations.length - 1;
        else if (i === 0 && direction < 0)
            i = annotations.length - 1;

        let annotation = annotations[i];
        if (!annotation || !direction)
            return void 0;

        if (annotation.row === row) {
            do {
                annotation = annotations[i += direction];
            } while (annotation && annotation.row === row);
            if (!annotation)
                return annotations.slice();
        }

        const matched: Annotation[] = [];
        row = annotation.row;
        do {
            if (direction < 0) {
                matched.unshift(annotation);
            }
            else {
                matched.push(annotation);
            }
            annotation = annotations[i += direction];
        } while (annotation && annotation.row === row);
        if (matched.length) {
            return matched;
        }
        else {
            return void 0;
        }
    }

    /** 
     * Executes a command for each selection range.
     *
     * @param action The action to execute.
     * @param args Any arguments for the command.
     * @param options
     */
    forEachSelection(action: Action<Editor>, args: any, options?: { keepOrder?: boolean; $byLines?: boolean }): any {
        const session = this.sessionOrThrow();
        if (this.inVirtualSelectionMode) {
            return;
        }

        const keepOrder = options && options.keepOrder;
        const $byLines = options && options.$byLines;
        const selection = this.selection;
        if (selection) {
            const rangeList: RangeList<OrientedRange> = selection.rangeList;
            const ranges = (keepOrder ? selection.ranges : rangeList.ranges);
            let result;

            if (!ranges.length) {
                return action(this, args || {});
            }

            const reg = selection._eventRegistry;
            selection._eventRegistry = {};

            const tmpSel = new Selection(session);
            this.inVirtualSelectionMode = true;
            for (let i = ranges.length; i--;) {
                if ($byLines) {
                    while (i > 0 && ranges[i].start.row === ranges[i - 1].end.row)
                        i--;
                }
                tmpSel.fromOrientedRange(ranges[i]);
                tmpSel.index = i;
                this.selection = session.selection = tmpSel;
                const actionResult = action(this, args || {});
                if (!result && actionResult !== undefined) {
                    // TODO: Why do we only return the first?
                    result = actionResult;
                }
                tmpSel.toOrientedRange(ranges[i]);
            }
            tmpSel.detach();

            this.selection = session.selection = selection;
            this.inVirtualSelectionMode = false;
            selection._eventRegistry = reg;
            selection.mergeOverlappingRanges();

            const anim = this.renderer.$scrollAnimation;
            this.onChangeOverwrite({ type: 'changeCursor' }, session);
            this.onSelectionChange(void 0, this.selection);
            if (anim && anim.from === anim.to) {
                this.renderer.animateScrolling(anim.from);
            }

            // FIXME: Who cares and why don't we return an array?
            return result;
        }
    }

    getLine(row: number): string {
        return this.sessionOrThrow().getLine(row);
    }

    invertSelection(): void {
        if (this.session && this.session.doc && this.selection) {
            const endRow = this.session.doc.getLength() - 1;
            const endCol = this.session.doc.getLine(endRow).length;
            let ranges = this.selection.rangeList.ranges;
            const newRanges: OrientedRange[] = [];

            // If multiple selections don't exist, rangeList will return 0 so replace with single range
            if (ranges.length < 1) {
                ranges = [this.selection.getRange()];
            }

            for (let i = 0; i < ranges.length; i++) {
                if (i === (ranges.length - 1)) {
                    // The last selection must connect to the end of the document, unless it already does
                    if (!(ranges[i].end.row === endRow && ranges[i].end.column === endCol)) {
                        newRanges.push(new Range(ranges[i].end.row, ranges[i].end.column, endRow, endCol));
                    }
                }

                if (i === 0) {
                    // The first selection must connect to the start of the document, unless it already does
                    if (!(ranges[i].start.row === 0 && ranges[i].start.column === 0)) {
                        newRanges.push(new Range(0, 0, ranges[i].start.row, ranges[i].start.column));
                    }
                } else {
                    newRanges.push(new Range(ranges[i - 1].end.row, ranges[i - 1].end.column, ranges[i].start.row, ranges[i].start.column));
                }
            }

            this.exitMultiSelectMode();
            this.clearSelection();

            for (let i = 0; i < newRanges.length; i++) {
                this.selection.addRange(newRanges[i], false);
            }
        }
    }

    joinLines(): void {
        if (this.selection) {
            const isBackwards = this.selection.isBackwards();
            const selectionStart = isBackwards ? this.selection.getSelectionLead() : this.selection.getSelectionAnchor();
            const selectionEnd = isBackwards ? this.selection.getSelectionAnchor() : this.selection.getSelectionLead();
            if (this.session && this.session.doc) {
                const firstLineEndCol = this.session.doc.getLine(selectionStart.row).length;
                const selectedText = this.session.doc.getTextRange(this.selection.getRange());
                const selectedCount = selectedText.replace(/\n\s*/, " ").length;
                let insertLine = this.session.doc.getLine(selectionStart.row);

                for (let i = selectionStart.row + 1; i <= selectionEnd.row + 1; i++) {
                    let curLine = stringTrimLeft(stringTrimRight(this.session.doc.getLine(i)));
                    if (curLine.length !== 0) {
                        curLine = " " + curLine;
                    }
                    insertLine += curLine;
                }

                if (selectionEnd.row + 1 < (this.session.doc.getLength() - 1)) {
                    // Don't insert a newline at the end of the document
                    insertLine += this.session.doc.getNewLineCharacter();
                }

                this.clearSelection();
                this.session.doc.replace(new Range(selectionStart.row, 0, selectionEnd.row + 2, 0), insertLine);

                if (selectedCount > 0) {
                    // Select the text that was previously selected
                    this.selection.moveCursorTo(selectionStart.row, selectionStart.column);
                    this.selection.selectTo(selectionStart.row, selectionStart.column + selectedCount);
                }
                else {
                    // If the joined line had something in it, start the cursor at that something
                    const column = this.session.doc.getLine(selectionStart.row).length > firstLineEndCol ? (firstLineEndCol + 1) : firstLineEndCol;
                    this.selection.moveCursorTo(selectionStart.row, column);
                }
            }
        }
    }

    /**
     * Adds a cursor above or below the active cursor.
     */
    selectMoreLines(direction: Direction, skip?: boolean): void {
        const session = this.sessionOrThrow();
        if (this.selection) {
            const range = this.selection.toOrientedRange();
            const isBackwards = range.cursor === range.end;

            const screenLead = session.documentToScreenPosition(range.cursor.row, range.cursor.column);
            if (this.selection.$desiredColumn) {
                screenLead.column = this.selection.$desiredColumn;
            }

            const lead = session.screenToDocumentPosition(screenLead.row + direction, screenLead.column);

            let anchor: Position;
            if (!isEmpty(range)) {
                const row = isBackwards ? range.end.row : range.start.row;
                const column = isBackwards ? range.end.column : range.start.column;
                const screenAnchor = session.documentToScreenPosition(row, column);
                anchor = session.screenToDocumentPosition(screenAnchor.row + direction, screenAnchor.column);
            }
            else {
                anchor = lead;
            }

            let newRange: Range;
            if (isBackwards) {
                newRange = Range.fromPoints(lead, anchor);
                newRange.cursor = newRange.start;
            }
            else {
                newRange = Range.fromPoints(anchor, lead);
                newRange.cursor = newRange.end;
            }

            newRange.desiredColumn = screenLead.column;
            let toRemove: Position | undefined;
            if (!this.selection.inMultiSelectMode) {
                this.selection.addRange(range);
            }
            else {
                if (skip) {
                    toRemove = range.cursor;
                }
            }

            this.selection.addRange(newRange);
            if (toRemove) {
                // FIXME: substract really?
                this.selection.substractPoint(toRemove);
            }
        }
    }

    getWordRange(row: number, column: number): OrientedRange {
        return this.sessionOrThrow().getWordRange(row, column);
    }

    /** 
     * Finds the next occurence of text in an active selection and adds it to the selections.
     */
    selectMore(direction: Direction, skip?: boolean, stopAtFirst?: boolean): void {
        const session = this.sessionOrThrow();
        const multiSelect = session.multiSelect;
        if (multiSelect) {

            let range = multiSelect.toOrientedRange();
            if (isEmpty(range)) {
                range = session.getWordRange(range.start.row, range.start.column);
                range.cursor = direction === Direction.BACKWARD ? range.start : range.end;
                multiSelect.addRange(range);
                if (stopAtFirst) {
                    return;
                }
            }

            const needle = session.getTextRange(range);

            const newRange = find(session, needle, direction);
            if (newRange) {
                newRange.cursor = direction === Direction.BACKWARD ? newRange.start : newRange.end;
                this.$blockScrolling += 1;
                try {
                    session.unfold(newRange);
                    multiSelect.addRange(newRange);
                }
                finally {
                    this.$blockScrolling -= 1;
                }

                const renderer = this.renderer;
                if (renderer) {
                    renderer.scrollCursorIntoView(void 0, 0.5);
                }
            }
            if (skip) {
                multiSelect.substractPoint(range.cursor);
            }
        }
    }

    /** 
     * Aligns the cursors or selected text.
     */
    alignCursors(): void {
        const session = this.sessionOrThrow();
        const multiSelect = session.multiSelect;
        if (multiSelect) {
            const ranges = multiSelect.ranges;
            // filter out ranges on same row
            let row = -1;
            const sameRowRanges = ranges.filter(function (r) {
                if (r.cursor.row === row)
                    return true;
                row = r.cursor.row;
                return void 0;
            });

            if (!ranges.length || sameRowRanges.length === ranges.length - 1) {
                if (this.selection) {
                    const range = this.selection.getRange();
                    let fr = range.start.row;
                    let lr = range.end.row;
                    const guessRange = (fr === lr);
                    if (guessRange) {
                        const max = session.getLength();
                        let line: string;
                        do {
                            line = session.getLine(lr);
                        } while (/[=:]/.test(line) && ++lr < max);
                        do {
                            line = session.getLine(fr);
                        } while (/[=:]/.test(line) && --fr > 0);

                        if (fr < 0) fr = 0;
                        if (lr >= max) lr = max - 1;
                    }
                    let lines = session.removeFullLines(fr, lr);
                    lines = this.$reAlignText(lines, guessRange);
                    session.insert({ row: fr, column: 0 }, lines.join("\n") + "\n");
                    if (!guessRange) {
                        range.start.column = 0;
                        range.end.column = lines[lines.length - 1].length;
                    }
                    this.selection.setRange(range);
                }
            }
            else {
                sameRowRanges.forEach(function (r: Range) {
                    multiSelect.substractPoint(r.cursor);
                });

                let maxCol = 0;
                let minSpace = Infinity;
                const spaceOffsets = ranges.map(function (r) {
                    const p = r.cursor;
                    const line = session.getLine(p.row);
                    let spaceOffset = line.substr(p.column).search(/\S/g);
                    if (spaceOffset === -1)
                        spaceOffset = 0;

                    if (p.column > maxCol)
                        maxCol = p.column;
                    if (spaceOffset < minSpace)
                        minSpace = spaceOffset;
                    return spaceOffset;
                });
                ranges.forEach(function (r, i) {
                    const p = r.cursor;
                    const l = maxCol - p.column;
                    const d = spaceOffsets[i] - minSpace;
                    if (l > d)
                        session.insert(p, stringRepeat(" ", l - d));
                    else
                        session.remove(new Range(p.row, p.column, p.row, p.column - l + d));

                    r.start.column = r.end.column = maxCol;
                    r.start.row = r.end.row = p.row;
                    r.cursor = r.end;
                });
                multiSelect.fromOrientedRange(ranges[0]);

                const renderer = this.renderer;
                if (renderer) {
                    renderer.updateCursor();
                    renderer.updateBackMarkers();
                }
            }
        }
    }

    /**
     *
     */
    private $reAlignText(lines: string[], forceLeft: boolean): string[] {
        let isLeftAligned = true;
        let isRightAligned = true;
        let startW: number;
        let textW: number;
        let endW: number;

        return lines.map(function (line) {
            const m = line.match(/(\s*)(.*?)(\s*)([=:].*)/);
            if (!m)
                return [line];

            if (startW == null) {
                startW = m[1].length;
                textW = m[2].length;
                endW = m[3].length;
                return m;
            }

            if (startW + textW + endW !== m[1].length + m[2].length + m[3].length)
                isRightAligned = false;
            if (startW !== m[1].length)
                isLeftAligned = false;

            if (startW > m[1].length)
                startW = m[1].length;
            if (textW < m[2].length)
                textW = m[2].length;
            if (endW > m[3].length)
                endW = m[3].length;

            return m;
        }).map(forceLeft ? alignLeft :
            isLeftAligned ? isRightAligned ? alignRight : alignLeft : unAlign);

        function spaces(n: number): string {
            return stringRepeat(" ", n);
        }

        function alignLeft(m: RegExpMatchArray): string {
            return !m[2] ? m[0] : spaces(startW) + m[2]
                + spaces(textW - m[2].length + endW)
                + m[4].replace(/^([=:])\s+/, "$1 ");
        }
        function alignRight(m: RegExpMatchArray): string {
            return !m[2] ? m[0] : spaces(startW + textW - m[2].length) + m[2]
                + spaces(endW)
                + m[4].replace(/^([=:])\s+/, "$1 ");
        }
        function unAlign(m: RegExpMatchArray): string {
            return !m[2] ? m[0] : spaces(startW) + m[2]
                + spaces(endW)
                + m[4].replace(/^([=:])\s+/, "$1 ");
        }
    }

    /**
     *
     */
    private $initOperationListeners(): void {

        function last<T>(a: T[]): T { return a[a.length - 1]; }

        this.selectionRanges_.length = 0;
        this.commands.on("exec", (e: { command: Command<Editor> }) => {
            this.startOperation(e);

            const command = e.command;
            if (command.group === "fileJump") {
                const prev = this.prevOp;
                if (!prev || prev.command && prev.command.group !== "fileJump") {
                    this.lastFileJumpPos = last(this.selectionRanges_);
                }
            }
            else {
                this.lastFileJumpPos = null;
            }
        }, true);

        this.commands.on("afterExec", (e: { command: Command<Editor> }, cm: CommandManager<Editor>) => {
            const command = e.command;

            if (command.group === "fileJump") {
                if (this.lastFileJumpPos && this.curOp && !this.curOp.selectionChanged) {
                    if (this.selection) {
                        this.selection.fromJSON(this.lastFileJumpPos);
                    }
                }
            }
            this.endOperation(e);
        }, true);

        this.$opResetTimer = createDelayedCall(this.endOperation.bind(this));

        this.eventBus.on("change", () => {
            if (this.curOp) {
                this.curOp.docChanged = true;
            }
            else {
                this.startOperation();
            }
        }, true);

        this.eventBus.on("changeSelection", () => {
            if (this.curOp) {
                this.curOp.selectionChanged = true;
            }
            else {
                this.startOperation();
            }
        }, true);
    }

    /**
     * By the end of this method, the curOp property should be defined.
     */
    private startOperation(commandEvent?: { command?: Command<Editor>; args?: any }): void {
        if (this.curOp) {
            if (!commandEvent || this.curOp.command) {
                return;
            }
            this.prevOp = this.curOp;
        }
        if (!commandEvent) {
            // this.previousCommand = null;
            commandEvent = {};
        }

        this.$opResetTimer.schedule();
        this.curOp = {
            command: commandEvent.command || {},
            args: commandEvent.args,
            scrollTop: this.renderer ? this.renderer.scrollTop : 0
        };

        const command = this.curOp.command;
        if (command && command.scrollIntoView) {
            this.$blockScrolling++;
        }

        if (this.selection) {
            this.selection.toJSON().forEach((range: Range) => {
                this.selectionRanges_.push(range);
            });
        }
    }

    private endOperation(unused?: { command: Command<Editor> }): void {
        if (this.curOp) {
            const command = this.curOp.command;
            if (command && command.scrollIntoView) {
                this.$blockScrolling--;
                const renderer = this.renderer;
                switch (command.scrollIntoView) {
                    case "center":
                        if (renderer) {
                            renderer.scrollCursorIntoView(void 0, 0.5);
                        }
                        break;
                    case "animate":
                    case "cursor":
                        if (renderer) {
                            this.renderer.scrollCursorIntoView();
                        }
                        break;
                    case "selectionPart":
                        if (this.selection) {
                            const range = this.selection.getRange();
                            if (renderer) {
                                const config = this.renderer.layerConfig;
                                if (range.start.row >= config.lastRow || range.end.row <= config.firstRow) {
                                    this.renderer.scrollSelectionIntoView(this.selection.anchor, this.selection.lead);
                                }
                            }
                        }
                        break;
                    default:
                        break;
                }
                if (command.scrollIntoView === "animate") {
                    // TODO: Capture the invariant of 'animate' implies scrollTop?
                    if (typeof this.curOp.scrollTop === 'number') {
                        this.renderer.animateScrolling(this.curOp.scrollTop);
                    }
                }
            }

            this.prevOp = this.curOp;
            this.curOp = null;
        }
    }

    /**
     * The method is used to listen for 'exec' events from the command manager.
     * A fat arrow is used so that the `this` context is correct without the need for binding.
     */
    private $historyTracker = (e: { command: Command<Editor>; args?: any }): void => {
        if (!this.$mergeUndoDeltas) {
            // false and 'always'
            return;
        }

        const prev = this.prevOp;
        const mergeableCommands = this.$mergeableCommands;
        // previous command was the same
        let shouldMerge = prev.command && (e.command.name === prev.command.name);
        if (e.command.name === COMMAND_NAME_INSERT_STRING) {
            const text = e.args;
            if (this.mergeNextCommand === undefined)
                this.mergeNextCommand = true;

            shouldMerge = shouldMerge
                && this.mergeNextCommand // previous command allows to coalesce with
                && (!/\s/.test(text) || /\s/.test(prev.args)); // previous insertion was of same type

            this.mergeNextCommand = true;
        }
        else if (typeof e.command.name === 'string') {
            shouldMerge = shouldMerge && mergeableCommands.indexOf(e.command.name) !== -1; // the command is mergeable
        }

        if (this.$mergeUndoDeltas !== "always" && Date.now() - this.sequenceStartTime > 2000) {
            shouldMerge = false; // the sequence is too long
        }

        if (shouldMerge) {
            if (this.session) {
                this.session.mergeUndoDeltas = true;
            }
        }
        else if (typeof e.command.name === 'string') {
            if (mergeableCommands.indexOf(e.command.name) !== -1) {
                this.sequenceStartTime = Date.now();
            }
        }
    }

    /**
     * Sets a new key handler, such as "vim" or "windows".
     *
     * @param keyboardHandler The new key handler.
     */
    setKeyboardHandler(keyboardHandler: KeyboardHandler<Editor>): void {
        if (!keyboardHandler) {
            this.keyBinding.setKeyboardHandler(null);
        }
        else {
            // this.$keybindingId = null;
            this.keyBinding.setKeyboardHandler(keyboardHandler);
        }
    }

    /**
     * Returns the keyboard handler, such as "vim" or "windows".
     */
    getKeyboardHandler(): KeyboardHandler<Editor> {
        return this.keyBinding.getKeyboardHandler();
    }

    /**
     * Sets the EditSession to use.
     * This method also emits the `'changeSession'` event.
     * 1. Does nothing if the session is the same as the existing session.
     * 2. Ends and current operations.
     * 3. Removes handlers from the existing session.
     * 4. Adds handlers to the new session.
     * 5. Associates the renderer with the correct session.
     * 6. addRef's the new session.
     * 7. releases the existing session.
     * 8. Schedules a start of the background tokenizer for syntax coloring.
     */
    setSession(session: EditSession | undefined): void {
        if (this.session === session) {
            return;
        }

        // Make sure operationEnd events are not emitted to wrong session.
        if (this.curOp) {
            this.endOperation();
            this.curOp = {};
        }

        const oldSession = this.session;
        if (oldSession) {
            oldSession.off("change", this.$onDocumentChange);
            oldSession.off("changeMode", this.$onChangeMode);
            oldSession.off("tokenizerUpdate", this.$onTokenizerUpdate);
            oldSession.off("changeTabSize", this.$onChangeTabSize);
            oldSession.off("changeWrapLimit", this.$onChangeWrapLimit);
            oldSession.off("changeWrapMode", this.$onChangeWrapMode);
            oldSession.off("changeFold", this.$onChangeFold);
            oldSession.off("changeFrontMarker", this.onChangeFrontMarker);
            oldSession.off("changeBackMarker", this.onChangeBackMarker);
            oldSession.off("changeBreakpoint", this.$onChangeBreakpoint);
            oldSession.off("changeAnnotation", this.$onChangeAnnotation);
            oldSession.off("changeOverwrite", this.$onChangeOverwrite);
            oldSession.off("changeScrollTop", this.$onScrollTopChange);
            oldSession.off("changeScrollLeft", this.$onScrollLeftChange);

            const selection = oldSession.getSelection();
            if (selection) {
                selection.off("changeCursor", this.$onSelectionChangeCursor);
            }

            if (this.removeChangeSelectionHandler) {
                this.removeChangeSelectionHandler();
                this.removeChangeSelectionHandler = void 0;
            }
        }

        if (session) {
            this.session = session as NativeEditSession;

            this.$onDocumentChange = this.onDocumentChange.bind(this);
            this.session.on("change", this.$onDocumentChange);
            if (this.renderer) {
                this.renderer.setSession(this.session);
            }

            this.$onChangeMode = this.onChangeMode.bind(this);
            this.session.on("changeMode", this.$onChangeMode);

            this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
            this.session.on("tokenizerUpdate", this.$onTokenizerUpdate);

            if (this.renderer) {
                this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(this.renderer);
                this.session.on("changeTabSize", this.$onChangeTabSize);
            }

            this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
            this.session.on("changeWrapLimit", this.$onChangeWrapLimit);

            this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
            this.session.on("changeWrapMode", this.$onChangeWrapMode);

            this.$onChangeFold = this.onChangeFold.bind(this);
            this.session.on("changeFold", this.$onChangeFold);

            this.session.on("changeFrontMarker", this.onChangeFrontMarker);

            this.session.on("changeBackMarker", this.onChangeBackMarker);

            this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
            this.session.on("changeBreakpoint", this.$onChangeBreakpoint);

            this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
            this.session.on("changeAnnotation", this.$onChangeAnnotation);

            this.$onChangeOverwrite = this.onChangeOverwrite.bind(this);
            this.session.on("changeOverwrite", this.$onChangeOverwrite);

            this.$onScrollTopChange = this.onScrollTopChange.bind(this);
            this.session.on("changeScrollTop", this.$onScrollTopChange);

            this.$onScrollLeftChange = this.onScrollLeftChange.bind(this);
            this.session.on("changeScrollLeft", this.$onScrollLeftChange);

            this.$onSelectionChangeCursor = this.onSelectionChangeCursor.bind(this);
            this.selection = this.session.getSelection();
            if (this.selection) {
                this.selection.on("changeCursor", this.$onSelectionChangeCursor);
            }

            const onSelectionChange = (unused: any, selection: Selection) => {
                this.onSelectionChange(unused, selection);
            };
            if (this.selection) {
                this.removeChangeSelectionHandler = this.selection.on("changeSelection", onSelectionChange);
            }

            this.onChangeMode(void 0, this.session);

            this.$blockScrolling += 1;
            try {
                this.onChangeOverwrite({ type: 'changeCursor' }, this.session);
            }
            finally {
                this.$blockScrolling -= 1;
            }

            this.onScrollTopChange(void 0, this.session);
            this.onScrollLeftChange(void 0, this.session);

            this.onSelectionChange(void 0, this.selection);

            this.onChangeFrontMarker(void 0, this.session);
            this.onChangeBackMarker(void 0, this.session);
            this.onChangeBreakpoint(void 0, this.session);
            this.onChangeAnnotation(void 0, this.session);

            if (this.renderer) {
                if (session.getUseWrapMode()) {
                    this.renderer.adjustWrapLimit();
                }
                this.renderer.updateFull();
            }
        }
        else {
            // Clear the renderer first in case the layers try to access the selection.
            if (this.renderer) {
                this.renderer.setSession(void 0);
            }

            // Make sure that the selection is cleared BEFORE clearing the session.
            // Defere the following line until strict null checking is done.
            // this.selection = null;

            // Now we can do it.
            this.session = void 0;
        }

        const changeSessionEvent: EditorChangeSessionEvent = { session: this.session, oldSession };
        this.eventBus._signal("changeSession", changeSessionEvent);

        this.curOp = null;

        if (oldSession) {
            const changeEditorEvent: SessionChangeEditorEvent = { oldEditor: this };
            oldSession._signal("changeEditor", changeEditorEvent);
            oldSession.release();
        }

        if (session) {
            const changeEditorEvent: SessionChangeEditorEvent = { editor: this };
            this.sessionOrThrow()._signal("changeEditor", changeEditorEvent);
            session.addRef();
        }

        if (session && session.bgTokenizer) {
            session.bgTokenizer.scheduleStart();
        }
    }

    /**
     * Returns the current session being used.
     * The returned session may be undefined if the editor state has no session.
     */
    getSession(): NativeEditSession | undefined {
        return this.session;
    }

    /**
     * Determines whether this editor has an EditSession.
     */
    hasSession(): boolean {
        return this.session ? true : false;
    }

    /**
     * @param padding
     */
    setPadding(padding: number): void {
        return this.renderer.setPadding(padding);
    }

    /**
     * @param themeId
     * @param href
     */
    setThemeCss(themeId: string, href?: string): void {
        return this.renderer.setThemeCss(themeId, href);
    }

    /**
     * @param isDark
     */
    setThemeDark(isDark: boolean): void {
        return this.renderer.setThemeDark(isDark);
    }

    /**
     * Sets the current session to `text`.
     * This has other side effects that generally reset the session.
     * The other effect of this method is to move the cursor.
     *
     * @param text The new value to set for the document
     * @param cursorPos Where to set the new value.`undefined` or 0 is selectAll, -1 is at the document start, and +1 is at the end.
     */
    setValue(text: string, cursorPos?: number): void {

        if (this.session) {
            this.session.setValue(text);
        }
        else {
            throw new Error(`setValue('...', ${cursorPos}); Editor must have an EditSession before calling setValue.`);
        }

        if (!cursorPos) {
            this.selectAll();
        }
        else if (cursorPos === +1) {
            this.navigateFileEnd();
        }
        else if (cursorPos === -1) {
            this.navigateFileStart();
        }
    }

    /**
     * Returns the current session's content.
     */
    getValue(): string {
        return this.sessionOrThrow().getValue();
    }

    /**
     * Returns the currently highlighted selection.
     */
    getSelection(): Selection | undefined {
        return this.selection;
    }

    /**
     * @param force If `true`, recomputes the size, even if the height and width haven't changed.
     */
    resize(force?: boolean): void {
        this.renderer.onResize(force);
    }

    /**
     * @returns The set theme
     */
    getTheme(): string {
        return this.renderer.getTheme();
    }

    /**
     *
     */
    setStyle(className: EditorStyle): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.setStyle(className);
        }
    }

    /**
     *
     */
    unsetStyle(className: EditorStyle): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.unsetStyle(className);
        }
    }

    /**
     * Gets the current font size of the editor text.
     */
    getFontSize(): string | null {
        return this.renderer.getFontSize() || computedStyle(this.container, "fontSize").fontSize;
    }

    /**
     * Set a new font size (in pixels) for the editor text.
     *
     * @param fontSize A font size, e.g. "12px")
     */
    setFontSize(fontSize: string | null): void {
        this.renderer.setFontSize(fontSize);
    }

    /**
     *
     */
    private $highlightBrackets(): void {
        const session = this.sessionOrThrow();
        if (session.$bracketHighlight) {
            session.removeMarker(session.$bracketHighlight);
            session.$bracketHighlight = void 0;
        }

        if (this.$highlightPending) {
            return;
        }

        // perform highlight async to not block the browser during navigation
        this.$highlightPending = true;
        setTimeout(() => {
            this.$highlightPending = false;
            // The session may be pulled out from under us during the wait time.
            // TODO: We could cancel the timeout if we saved the handle for the timer.
            if (session) {
                const pos = session.findMatchingBracket(this.getCursorPosition());
                let range: OrientedRange | undefined;
                if (pos) {
                    range = new Range(pos.row, pos.column, pos.row, pos.column + 1);
                }
                else {
                    const mode = session.getMode();
                    if (mode && mode.getMatching) {
                        range = mode.getMatching(session);
                    }
                }
                if (range) {
                    session.$bracketHighlight = session.addMarker(range, "ace_bracket", "text");
                }
            }
        }, 50);
    }

    /**
     *
     */
    private $highlightTags(): void {

        if (this.$highlightTagPending) {
            return;
        }

        // Perform highlight async to not block the browser during navigation.
        this.$highlightTagPending = true;
        setTimeout(() => {
            this.$highlightTagPending = false;

            const session = this.session;
            if (!session) {
                return;
            }

            const pos = this.getCursorPosition();
            const iterator = new TokenIterator(session, pos.row, pos.column);
            let token = iterator.getCurrentToken();

            if (!token || token.type.indexOf('tag-name') === -1) {
                if (session.$tagHighlight) {
                    session.removeMarker(session.$tagHighlight);
                    session.$tagHighlight = null;
                }
                return;
            }

            const tag = token.value;
            let depth = 0;
            let prevToken = iterator.stepBackward();

            if (prevToken) {
                if (prevToken.value === '<') {
                    // Find closing tag.
                    do {
                        prevToken = token;
                        token = iterator.stepForward();

                        if (token && token.value === tag && token.type.indexOf('tag-name') !== -1) {
                            if (prevToken.value === '<') {
                                depth++;
                            }
                            else if (prevToken.value === '</') {
                                depth--;
                            }
                        }

                    } while (token && depth >= 0);
                }
                else {
                    // Find opening tag.
                    do {
                        token = prevToken;
                        prevToken = iterator.stepBackward();
                        if (prevToken) {
                            if (token && token.value === tag && token.type.indexOf('tag-name') !== -1) {
                                if (prevToken.value === '<') {
                                    depth++;
                                }
                                else if (prevToken.value === '</') {
                                    depth--;
                                }
                            }
                        }
                    } while (prevToken && depth <= 0);

                    // Select tag again.
                    iterator.stepForward();
                }
            }

            if (!token) {
                if (session.$tagHighlight) {
                    session.removeMarker(session.$tagHighlight);
                    session.$tagHighlight = null;
                }
                return;
            }

            const row = iterator.getCurrentTokenRow();
            const column = iterator.getCurrentTokenColumn();
            const range = new Range(row, column, row, column + token.value.length);

            // Remove range if different.
            if (session.$tagHighlight) {
                const sbm = session.$backMarkers[session.$tagHighlight];
                // Defensive undefined check may indicate a bug elsewhere?
                if (session.$tagHighlight && sbm !== undefined && sbm.range && compareRange(range, sbm.range) !== 0) {
                    session.removeMarker(session.$tagHighlight);
                    session.$tagHighlight = null;
                }
            }

            if (range && !session.$tagHighlight) {
                session.$tagHighlight = session.addMarker(range, "ace_bracket", "text");
            }

        }, 50);
    }

    /**
     * Brings the current `textInput` into focus.
     */
    focus(): void {
        // Safari needs the timeout
        // iOS and Firefox need it called immediately
        // to be on the save side we do both
        setTimeout(() => { this.textInput.focus(); });
        this.textInput.focus();
    }

    /**
     * Returns `true` if the current `textInput` is in focus.
     */
    isFocused(): boolean {
        return this.textInput.isFocused();
    }

    /**
     * Blurs the current `textInput`.
     */
    blur(): void {
        this.textInput.blur();
    }

    /**
     * Emitted once the editor comes into focus.
     */
    onFocus(): void {
        if (this.$isFocused) {
            return;
        }
        this.$isFocused = true;
        this.renderer.showCursor();
        this.renderer.visualizeFocus();
        /**
         * @event focus
         */
        this.eventBus._emit("focus");
    }

    /**
     * Emitted once the editor has been blurred.
     */
    onBlur(): void {
        if (!this.$isFocused) {
            return;
        }
        this.$isFocused = false;
        this.renderer.hideCursor();
        this.renderer.visualizeBlur();
        /**
         * @event blur
         */
        this.eventBus._emit("blur");
    }

    /**
     * Calls the renderer updateCursor method.
     */
    private $cursorChange(): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.updateCursor();
        }
    }

    /**
     * Emitted whenever the document is changed.
     */
    private onDocumentChange(delta: Delta, unused: EditSession): void {

        // Rerender and emit "change" event.
        const session = this.sessionOrThrow();
        const lastRow = (delta.start.row === delta.end.row ? delta.end.row : Infinity);

        const renderer = this.renderer;
        if (renderer) {
            renderer.updateLines(delta.start.row, lastRow, session.$useWrapMode);
        }

        this.eventBus._signal("change", delta);

        // Update cursor because tab characters can influence the cursor position.
        this.$cursorChange();
        this.$updateHighlightActiveLine();
    }

    private onTokenizerUpdate(event: { data: FirstAndLast }, session: NativeEditSession) {
        const { first, last } = event.data;
        this.sessionOrThrow().tokenizerUpdateFoldWidgets(event);
        const renderer = this.renderer;
        if (renderer) {
            renderer.updateLines(first, last);
        }
    }


    private onScrollTopChange(event: any, session: EditSession): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.scrollToY(session.getScrollTop());
        }
    }

    private onScrollLeftChange(event: any, session: EditSession): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.scrollToX(session.getScrollLeft());
        }
    }

    /**
     * Handler for cursor or selection changes.
     */
    private onChangeOverwrite(event: SessionChangeCursorEvent, session: EditSession): void {

        this.$cursorChange();

        if (this.$blockScrolling === 0) {
            const renderer = this.renderer;
            if (renderer) {
                renderer.scrollCursorIntoView();
            }
        }

        this.$highlightBrackets();
        this.$highlightTags();
        this.$updateHighlightActiveLine();
        this.eventBus._signal("changeOverwrite");
    }

    /**
     * Handler for cursor or selection changes.
     */
    private onSelectionChangeCursor(event: SessionChangeCursorEvent, selection: Selection): void {

        this.$cursorChange();

        if (this.$blockScrolling === 0) {
            const renderer = this.renderer;
            if (renderer) {
                renderer.scrollCursorIntoView();
            }
        }

        this.$highlightBrackets();
        this.$highlightTags();
        this.$updateHighlightActiveLine();
        this.eventBus._signal("changeSelection");
    }

    /**
     *
     */
    public $updateHighlightActiveLine(): void {

        const session = this.sessionOrThrow();
        const renderer = this.renderer;
        let highlight: Position | undefined;
        if (this.$highlightActiveLine) {
            const selection = this.selectionOrThrow();
            if ((this.$selectionStyle !== "line" || !selection.isMultiLine())) {
                highlight = this.getCursorPosition();
            }
            if (renderer && renderer.maxLines && session.getLength() === 1 && !(renderer.minLines > 1)) {
                // FIXME: This just makes life more difficult, with stupid casting.
                // The tests that follow are all truthy or falsey, which gives the same
                // result for null, undefined, and false.
                // highlight = <any>false;
            }
        }

        if (session.$highlightLineMarker && !highlight) {
            if (typeof session.$highlightLineMarker.markerId === 'number') {
                session.removeMarker(session.$highlightLineMarker.markerId);
            }
            session.$highlightLineMarker = null;
        }
        else if (!session.$highlightLineMarker && highlight) {
            const range = new Range(highlight.row, highlight.column, highlight.row, Infinity) as RangeSelectionMarker;
            range.markerId = session.addMarker(range, "ace_active-line", "screenLine");
            session.$highlightLineMarker = range;
        }
        else if (highlight) {
            if (session.$highlightLineMarker) {
                session.$highlightLineMarker.start.row = highlight.row;
                session.$highlightLineMarker.end.row = highlight.row;
                session.$highlightLineMarker.start.column = highlight.column;
            }
            session._signal("changeBackMarker");
        }
    }

    /**
     *
     */
    private onSelectionChange(event: any, unused: any): void {

        const session = this.sessionOrThrow();

        if (typeof session.$selectionMarker === 'number') {
            session.removeMarker(session.$selectionMarker);
            session.$selectionMarker = null;
        }

        if (this.selection && !this.selection.isEmpty()) {
            const range = this.selection.getRange();
            const style = this.getSelectionStyle();
            session.$selectionMarker = session.addMarker(range, "ace_selection", style);
        }
        else {
            this.$updateHighlightActiveLine();
        }

        if (this.$highlightSelectedWord) {
            const re = this.$getSelectionHighLightRegexp();
            session.highlight(re);
        }
        else {
            session.highlight(null);
        }

        this.eventBus._signal("changeSelection");
    }

    private $getSelectionHighLightRegexp(): RegExp | undefined {
        const session = this.sessionOrThrow();

        const selection = this.getSelectionRange();
        if (isEmpty(selection) || isMultiLine(selection)) {
            return void 0;
        }

        const startOuter = selection.start.column - 1;
        const endOuter = selection.end.column + 1;
        const line = session.getLine(selection.start.row);
        const lineCols = line.length;
        let needle = line.substring(Math.max(startOuter, 0), Math.min(endOuter, lineCols));

        // Make sure the outer characters are not part of the word.
        if ((startOuter >= 0 && /^[\w\d]/.test(needle)) ||
            (endOuter <= lineCols && /[\w\d]$/.test(needle)))
            return void 0;

        needle = line.substring(selection.start.column, selection.end.column);
        if (!/^[\w\d]+$/.test(needle))
            return void 0;

        // When the needle is a string, the return type will be a RegExp.
        // TODO: Split out this functionality for cleaner type safety.
        const re = <RegExp>assembleRegExp({ wholeWord: true, caseSensitive: true, needle: needle });

        return re;
    }

    /**
     * This must be a fat-arrow method because we use it as an event handler.
     */
    private onChangeFrontMarker = (event: any, session: EditSession): void => {
        const renderer = this.renderer;
        if (renderer) {
            renderer.updateFrontMarkers();
        }
    }

    /**
     * This must be a fat-arrow method because we use it as an event handler.
     */
    private onChangeBackMarker = (event: any, session: EditSession): void => {
        const renderer = this.renderer;
        if (renderer) {
            renderer.updateBackMarkers();
        }
    }

    private onChangeBreakpoint(event: any, editSession: EditSession): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.updateBreakpoints();
        }
        this.eventBus._emit("changeBreakpoint", event);
    }

    private onChangeAnnotation(event: any, session: EditSession): void {
        // The Editor (this) is acting as a controller in MVC.
        // When the session notifies that has changed its annotations,
        // the controller applies them to the renderer.
        // Finally, we propagate this event upwards.
        const renderer = this.renderer;
        if (renderer) {
            renderer.setAnnotations(this.sessionOrThrow().getAnnotations());
        }
        this.eventBus._emit("changeAnnotation", event);
    }


    private onChangeMode(event: any, session: EditSession): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.updateText();
            this.eventBus._emit("changeMode", event);
        }
    }


    private onChangeWrapLimit(event: any, session: EditSession): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.updateFull();
        }
    }

    private onChangeWrapMode(event: any, session: EditSession): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.onResize(true);
        }
    }


    private onChangeFold(event: any, session: EditSession): void {
        // Update the active line marker as due to folding changes the current
        // line range on the screen might have changed.
        this.$updateHighlightActiveLine();
        // TODO: This might be too much updating. Okay for now.
        const renderer = this.renderer;
        if (renderer) {
            renderer.updateFull();
        }
    }

    /**
     * Returns the string of text currently highlighted.
     */
    getSelectedText(): string {
        const session = this.sessionOrThrow();
        return session.getTextRange(this.getSelectionRange());
    }

    /**
     * Called whenever a text "cut" happens.
     */
    public onCut(): void {
        const cutCommand = this.commands.getCommandByName(COMMAND_NAME_CUT);
        if (cutCommand) {
            this.commands.exec(cutCommand, this);
        }
    }

    cut(): void {
        const cutRange = this.getSelectionRange();

        // The 'cut' event announces the range that is about to be cut out.
        this._emit("cut", cutRange);

        if (this.selection && !this.selection.isEmpty()) {
            this.sessionOrThrow().remove(cutRange);
            this.clearSelection();
        }
    }

    /**
     * Called whenever a text "copy" happens.
     */
    public onCopy(): void {
        const copyCommand = this.commands.getCommandByName(COMMAND_NAME_COPY);
        if (copyCommand) {
            this.commands.exec(copyCommand, this);
        }
    }

    copy(): void {
        // Don't expect this to be called. 
        console.warn("Editor.copy called but there is no implementation.");
    }

    /**
     * Called whenever a text "paste" happens.
     * This originates from a ClipboardEvent caught by keyboard/TextInput.
     * The original listener has already ensured that we are only called
     * with strings that are non-zero length.
     *
     * @param text The pasted text.
     */
    onPaste(text: string): void {
        // todo this should change when paste becomes a command
        if (this.$readOnly) {
            return;
        }

        // Original implementation...
        // this.eventBus._signal("paste", { text });
        // this.insert(text, true);

        // Alternatively, run it through the 'paste' command so that we remain DRY.
        const pasteCommand = this.commands.getCommandByName(COMMAND_NAME_PASTE);
        if (pasteCommand.exec) {
            pasteCommand.exec(this, { text });
        }
    }

    /**
     * This is the handler for the 'paste' command.
     * Since we don't currently have a key binding (Ctrl-V, etc), how does it get called?
     */
    paste(args: { text: string }): void {

        this._signal("paste", args);

        const { text } = args;
        if (!this.inMultiSelectMode || this.inVirtualSelectionMode) {
            this.insert(text, true);
        }
        else {
            // We're in multi select mode and not in virtual selection mode.
            const lines = text.split(/\r\n|\r|\n/);
            const ranges = this.selectionOrThrow().rangeList.ranges;

            if (lines.length > ranges.length || lines.length < 2 || !lines[1]) {
                const insertStringCommand = this.commands.getCommandByName(COMMAND_NAME_INSERT_STRING);
                if (insertStringCommand) {
                    this.commands.exec(insertStringCommand, this, text);
                }
                else {
                    console.warn(`command '${COMMAND_NAME_INSERT_STRING}' does not exist.`);
                }
            }

            const session = this.sessionOrThrow();
            for (let i = ranges.length; i--;) {
                const range = ranges[i];
                if (!isEmpty(range)) {
                    session.remove(range);
                }
                session.insert(range.start, lines[i]);
            }
        }
    }

    /**
     * Executes the specified command using the editor's command manager.
     */
    execCommand(command: Command<Editor>, args?: any): void {
        this.commands.exec(command, this, args);
    }

    /**
     * Inserts `text` into wherever the cursor is pointing.
     */
    insert(text: string, pasted?: boolean): void {

        const session = this.sessionOrThrow();
        const doc = session.docOrThrow();
        const mode = session.modeOrThrow();
        let cursor: Position = this.getCursorPosition();
        let transform: TextAndSelection | null | undefined;

        if (this.getBehavioursEnabled() && !pasted) {
            // Get a transform if the current mode wants one.
            transform = mode && <(TextAndSelection | undefined)>mode.transformAction(session.getState(cursor.row), 'insertion', this, session, text);
            if (transform) {
                if (text !== transform.text) {
                    session.mergeUndoDeltas = false;
                    this.mergeNextCommand = false;
                }
                text = transform.text;
            }
        }

        if (text === "\t") {
            text = session.getTabString();
        }

        // Remove selected text.
        if (this.selection && !this.selection.isEmpty()) {
            const range = this.getSelectionRange();
            cursor = session.remove(range);
            this.clearSelection();
        }
        else if (session.getOverwrite()) {
            const range = Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            session.remove(range);
        }

        if (text === "\n" || text === "\r\n") {
            const line = session.getLine(cursor.row);
            if (cursor.column > line.search(/\S|$/)) {
                const d = line.substr(cursor.column).search(/\S|$/);
                doc.removeInLine(cursor.row, cursor.column, cursor.column + d);
            }
        }

        this.clearSelection();

        const start = cursor.column;
        const lineState = session.getState(cursor.row);
        const line = session.getLine(cursor.row);
        const shouldOutdent = mode.checkOutdent(lineState, line, text);
        // Insert the text.
        /* const end = */ session.insert(cursor, text);

        if (transform && transform.selection) {
            if (transform.selection.length === 2) { // Transform relative to the current column
                if (this.selection) {
                    this.selection.setSelectionRange(
                        new Range(cursor.row, start + transform.selection[0],
                            cursor.row, start + transform.selection[1]));
                }
            }
            else { // Transform relative to the current row.
                if (this.selection) {
                    this.selection.setSelectionRange(
                        new Range(cursor.row + transform.selection[0],
                            transform.selection[1],
                            cursor.row + transform.selection[2],
                            transform.selection[3]));
                }
            }
        }

        if (doc.isNewLine(text)) {
            const lineIndent = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());
            session.insert({ row: cursor.row + 1, column: 0 }, lineIndent);
        }

        if (shouldOutdent) {
            mode.autoOutdent(lineState, session, cursor.row);
        }
    }

    /**
     *
     */
    on(eventName: EditorEventName, callback: (data: any, editor: Editor) => any, capturing?: boolean) {
        this.eventBus.on(eventName, callback, capturing);
        return () => {
            this.off(eventName, callback, capturing);
        };
    }

    /**
     *
     */
    off(eventName: EditorEventName, callback: (data: any, source: Editor) => any, capturing?: boolean): void {
        this.eventBus.off(eventName, callback/*, capturing*/);
    }

    setDefaultHandler(eventName: EditorEventName, callback: (data: any, source: Editor) => any) {
        this.eventBus.setDefaultHandler(eventName, callback);
    }

    _emit(eventName: EditorEventName, event?: any): void {
        this.eventBus._emit(eventName, event);
    }

    _signal(eventName: EditorEventName, event?: any): void {
        this.eventBus._signal(eventName, event);
    }

    hasListeners(eventName: EditorEventName): boolean {
        return this.eventBus.hasListeners(eventName);
    }

    /**
     * This method is called as a result of the use typing.
     * The text will probably be a single character.
     */
    onTextInput(text: string): void {
        this.keyBinding.onTextInput(text);
        // TODO: This should be pluggable.
        if (text === '.') {
            // The command can be thought of as an editor action bound to a name.
            const command = this.commands.getCommandByName(COMMAND_NAME_AUTO_COMPLETE);
            if (command) {
                this.commands.exec(command, this);
            }
        }
        else if (this.sessionOrThrow().docOrThrow().isNewLine(text)) {
            // const lineNumber = this.getCursorPosition().row;
            //            const option = new Services.EditorOptions();
            //            option.NewLineCharacter = "\n";
            // FIXME: Smart Indenting
            /*
            const indent = languageService.getSmartIndentAtLineNumber(currentFileName, lineNumber, option);
            if(indent > 0)
            {
                editor.commands.exec("inserttext", editor, {text:" ", times:indent});
            }
            */
        }
    }

    /**
     *
     */
    public onCommandKey(e: KeyboardEvent, hashId: number, keyCode: number): void {
        this.keyBinding.onCommandKey(e, hashId, keyCode);
    }

    /**
     * Pass in `true` to enable overwrites in your session, or `false` to disable.
     * If overwrites is enabled, any text you enter will type over any text after it.
     * If the value of `overwrite` changes, this function also emites the `changeOverwrite` event.
     *
     * @param overwrite Defines whether or not to set overwrites
     */
    setOverwrite(overwrite: boolean): void {
        const session = this.sessionOrThrow();
        session.setOverwrite(overwrite);
    }

    /**
     * Returns `true` if overwrites are enabled; `false` otherwise.
     */
    getOverwrite(): boolean {
        const session = this.sessionOrThrow();
        return session.getOverwrite();
    }

    foldAll(): void {
        return this.sessionOrThrow().foldAll();
    }

    unfold(location?: number | Position | RangeBasic, expandInner?: boolean): Fold[] | undefined {
        return this.sessionOrThrow().unfold(location, expandInner);
    }

    toggleFold(tryToUnfold: boolean): void {
        return this.sessionOrThrow().toggleFold(tryToUnfold);
    }

    toggleFoldWidget(toggleParent?: boolean): void {
        this.sessionOrThrow().toggleFoldWidget(toggleParent);
    }

    //
    // EditorKeyable
    //

    createKeyboardHandler(): KeyboardHandler<Editor> {
        return new KeyboardHandlerClazz<Editor>();
    }
    addKeyboardHandler(keyboardHandler: KeyboardHandler<Editor>): void {
        return this.keyBinding.addKeyboardHandler(keyboardHandler as KeyboardHandlerClazz<Editor>);
    }
    getKeyboardHandlers(): KeyboardHandler<Editor>[] {
        return this.keyBinding.$handlers;
    }
    removeKeyboardHandler(keyboardHandler: KeyboardHandler<Editor>): boolean {
        return this.keyBinding.removeKeyboardHandler(keyboardHandler as KeyboardHandlerClazz<Editor>);
    }

    /**
     * Sets the value of overwrite to the opposite of whatever it currently is.
     */
    toggleOverwrite(): void {
        const session = this.sessionOrThrow();
        session.toggleOverwrite();
    }

    //
    // EditorMarkable
    //

    addMarker(range: OrientedRange, clazz: string, type: MarkerType = 'line', renderer?: MarkerRenderer | null, inFront?: boolean): number {
        return this.sessionOrThrow().addMarker(range, clazz, type, renderer, inFront);
    }

    removeMarker(markerId: number): void {
        return this.sessionOrThrow().removeMarker(markerId);
    }

    /**
     * Sets how fast the mouse scrolling should do.
     *
     * @param speed A value indicating the new speed (in milliseconds).
     */
    setScrollSpeed(scrollSpeed: number): void {
        this.$mouseHandler.$scrollSpeed = scrollSpeed;
    }

    /**
     * Returns the value indicating how fast the mouse scroll speed is (in milliseconds).
     */
    getScrollSpeed(): number {
        return this.$mouseHandler.$scrollSpeed;
    }

    /**
     * Sets the delay (in milliseconds) of the mouse drag.
     *
     * @param dragDelay A value indicating the new delay.
     */
    setDragDelay(dragDelay: number): void {
        this.$mouseHandler.$dragDelay = dragDelay;
    }

    /**
     * Returns the current mouse drag delay.
     */
    getDragDelay(): number {
        return this.$mouseHandler.$dragDelay;
    }

    /**
     * Draw selection markers spanning whole line, or only over selected text.
     *
     * Default value is "line"
     *
     * @param selectionStyle The new selection style "line"|"text".
     */
    setSelectionStyle(selectionStyle: 'line' | 'text'): void {
        this.$selectionStyle = selectionStyle;
        this.onSelectionChange(void 0, this.selection);
        this._signal("changeSelectionStyle", { data: selectionStyle });
    }

    /**
     * Returns the current selection style.
     */
    getSelectionStyle(): 'line' | 'text' {
        return this.$selectionStyle;
    }

    /**
     * Determines whether or not the current line should be highlighted.
     *
     * @param highlightActiveLine Set to `true` to highlight the current line.
     */
    setHighlightActiveLine(highlightActiveLine: boolean): void {
        this.$highlightActiveLine = highlightActiveLine;
        this.$updateHighlightActiveLine();
    }

    /**
     * Returns `true` if current lines are always highlighted.
     */
    getHighlightActiveLine(): boolean {
        return this.$highlightActiveLine;
    }

    /**
     *
     */
    setHighlightGutterLine(highlightGutterLine: boolean): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.setHighlightGutterLine(highlightGutterLine);
        }
    }

    /**
     *
     */
    getHighlightGutterLine(): boolean {
        return this.renderer.getHighlightGutterLine();
    }

    /**
     * Determines if the currently selected word should be highlighted.
     *
     * @param highlightSelectedWord Set to `true` to highlight the currently selected word.
     */
    setHighlightSelectedWord(highlightSelectedWord: boolean): void {
        this.$highlightSelectedWord = highlightSelectedWord;
        this.onSelectionChange(void 0, this.selection);
    }

    /**
     * Returns `true` if currently highlighted words are to be highlighted.
     */
    getHighlightSelectedWord(): boolean {
        return this.$highlightSelectedWord;
    }

    /**
     * @param animatedScroll
     */
    setAnimatedScroll(animatedScroll: boolean): void {
        this.renderer.setAnimatedScroll(animatedScroll);
    }

    /**
     *
     */
    getAnimatedScroll(): boolean {
        return this.renderer.getAnimatedScroll();
    }

    getShowGutter(): boolean {
        return this.renderer.getShowGutter();
    }

    setShowGutter(showGutter: boolean): void {
        this.renderer.setShowGutter(showGutter);
    }

    /**
     * If `showInvisibles` is set to `true`, invisible characters&mdash;like spaces or new lines&mdash;are show in the editor.
     * This method requires the session to be in effect.
     */
    setShowInvisibles(showInvisibles: boolean): void {
        this.renderer.setShowInvisibles(showInvisibles);
    }

    /**
     * Returns `true` if invisible characters are being shown.
     */
    getShowInvisibles(): boolean {
        return this.renderer.getShowInvisibles();
    }

    setShowLineNumbers(showLineNumbers: boolean): void {
        this.renderer.setShowLineNumbers(showLineNumbers);
    }

    /**
     *
     */
    getShowLineNumbers(): boolean {
        return this.renderer.getShowLineNumbers();
    }

    /**
     * This method requires the session to be in effect.
     */
    setDisplayIndentGuides(displayIndentGuides: boolean): void {
        this.renderer.setDisplayIndentGuides(displayIndentGuides);
    }

    /**
     *
     */
    getDisplayIndentGuides(): boolean {
        return this.renderer.getDisplayIndentGuides();
    }

    /**
     * If `showPrintMargin` is set to `true`, the print margin is shown in the editor.
     *
     * @param showPrintMargin Specifies whether or not to show the print margin.
     */
    setShowPrintMargin(showPrintMargin: boolean): void {
        this.renderer.setShowPrintMargin(showPrintMargin);
    }

    /**
     * Returns `true` if the print margin is being shown.
     */
    getShowPrintMargin(): boolean {
        return this.renderer.getShowPrintMargin();
    }

    /**
     * Sets the column defining where the print margin should be.
     *
     * @param printMarginColumn Specifies the new print margin column.
     */
    setPrintMarginColumn(printMarginColumn: number): void {
        this.renderer.setPrintMarginColumn(printMarginColumn);
    }

    /**
     * Returns the column number of where the print margin is.
     */
    getPrintMarginColumn(): number {
        return this.renderer.getPrintMarginColumn();
    }

    setTabSize(tabSize: number): void {
        const session = this.sessionOrThrow();
        session.setTabSize(tabSize);
    }

    getTabSize(): number {
        const session = this.sessionOrThrow();
        return session.getTabSize();
    }

    setUseSoftTabs(useSoftTabs: boolean): void {
        const session = this.sessionOrThrow();
        session.setUseSoftTabs(useSoftTabs);
    }

    getUseSoftTabs(): boolean {
        const session = this.sessionOrThrow();
        return session.getUseSoftTabs();
    }

    /**
     * If `readOnly` is true, then the editor is set to read-only mode, and none of the content can change.
     *
     * @param readOnly Specifies whether the editor can be modified or not.
     */
    setReadOnly(newValue: boolean): void {
        const oldValue = this.$readOnly;
        this.$readOnly = newValue;
        // disabled to not break vim mode!
        this.textInput.setReadOnly(this.$readOnly);
        this.resetCursorStyle();
        this.$readOnlyBus._signal('$readOnly', { oldValue, newValue });
    }

    /**
     * Returns `true` if the editor is set to read-only mode.
     */
    get readOnly(): boolean {
        return this.$readOnly;
    }

    /**
     * Specifies whether to use behaviors or not.
     *
     * "Behaviors" in this case is the auto-pairing of special characters, like quotation marks, parenthesis, or brackets.
     *
     * @param behavioursEnabled Enables or disables behaviors.
     */
    setBehavioursEnabled(behavioursEnabled: boolean): void {
        this.$behavioursEnabled = behavioursEnabled;
    }

    /**
     * Returns `true` if the behaviors are currently enabled.
     */
    getBehavioursEnabled(): boolean {
        return this.$behavioursEnabled;
    }

    /**
     * Specifies whether to use wrapping behaviors or not, i.e. automatically wrapping the selection with characters such as brackets
     * when such a character is typed in.
     * @param wrapBehavioursEnabled Enables or disables wrapping behaviors.
     */
    setWrapBehavioursEnabled(wrapBehavioursEnabled: boolean): void {
        this.$wrapBehavioursEnabled = wrapBehavioursEnabled;
    }

    /**
     * Returns `true` if the wrapping behaviors are currently enabled.
     */
    getWrapBehavioursEnabled(): boolean {
        return this.$wrapBehavioursEnabled;
    }

    /**
     * Indicates whether the fold widgets should be shown or not.
     */
    setShowFoldWidgets(showFoldWidgets: boolean): void {
        this.renderer.setShowFoldWidgets(showFoldWidgets);
    }

    /**
     * Returns `true` if the fold widgets are shown.
     */
    getShowFoldWidgets(): boolean {
        return this.renderer.getShowFoldWidgets();
    }

    setFadeFoldWidgets(fadeFoldWidgets: boolean): void {
        this.renderer.setFadeFoldWidgets(fadeFoldWidgets);
    }

    getFadeFoldWidgets(): boolean {
        return this.renderer.getFadeFoldWidgets();
    }

    removeInLine(row: number, startColumn: number, endColumn: number): Position {
        return this.sessionOrThrow().removeInLine(row, startColumn, endColumn);
    }

    removeRange(range: Readonly<RangeBasic>): Position {
        return this.sessionOrThrow().remove(range);
    }

    /**
     * Removes words of text from the editor.
     * A "word" is defined as a string of characters bookended by whitespace.
     *
     * @param direction The direction of the deletion to occur, either "left" or "right".
     */
    remove(direction: 'left' | 'right'): void {
        if (this.readOnly) {
            throw new Error(verbotenWhenReadOnly(`remove(direction = '${direction}')`));
        }
        const session = this.sessionOrThrow();
        if (this.selection && this.selection.isEmpty()) {
            if (direction === "left")
                this.selection.selectLeft();
            else
                this.selection.selectRight();
        }

        let selectionRange = this.getSelectionRange();
        if (this.getBehavioursEnabled()) {
            const state = session.getState(selectionRange.start.row);
            const newRange: Range = <Range>session.modeOrThrow().transformAction(state, 'deletion', this, session, selectionRange);

            if (selectionRange.end.column === 0) {
                const text = session.getTextRange(selectionRange);
                if (text[text.length - 1] === "\n") {
                    const line = session.getLine(selectionRange.end.row);
                    if (/^\s+$/.test(line)) {
                        selectionRange.end.column = line.length;
                    }
                }
            }
            if (newRange) {
                selectionRange = newRange;
            }
        }

        session.remove(selectionRange);
        this.clearSelection();
    }

    /**
     * Removes the word directly to the right of the current selection.
     */
    removeWordRight(): void {
        const session = this.sessionOrThrow();
        if (this.selection && this.selection.isEmpty()) {
            this.selection.selectWordRight();
        }

        session.remove(this.getSelectionRange());
        this.clearSelection();
    }

    /**
     * Removes the word directly to the left of the current selection.
     */
    removeWordLeft() {
        const session = this.sessionOrThrow();
        if (this.selection && this.selection.isEmpty()) {
            this.selection.selectWordLeft();
        }

        session.remove(this.getSelectionRange());
        this.clearSelection();
    }

    /**
     * Removes all the words to the left of the current selection, until the start of the line.
     */
    removeToLineStart(): void {
        const session = this.sessionOrThrow();
        if (this.selection && this.selection.isEmpty()) {
            this.selection.selectLineStart();
        }

        session.remove(this.getSelectionRange());
        this.clearSelection();
    }

    /**
     * Removes all the words to the right of the current selection, until the end of the line.
     */
    removeToLineEnd(): void {
        const session = this.sessionOrThrow();
        if (this.selection && this.selection.isEmpty()) {
            this.selection.selectLineEnd();
        }

        const range = this.getSelectionRange();
        if (range.start.column === range.end.column && range.start.row === range.end.row) {
            range.end.column = 0;
            range.end.row++;
        }

        session.remove(range);
        this.clearSelection();
    }

    /**
     * Splits all the ranges into lines.
     */
    splitIntoLines() {
        if (this.multiSelect) {
            this.multiSelect.splitIntoLines();
        }
    }

    /**
     * Splits the line at the current selection (by inserting an `'\n'`).
     */
    splitLine(): void {
        const session = this.sessionOrThrow();
        if (this.selection && !this.selection.isEmpty()) {
            session.remove(this.getSelectionRange());
            this.clearSelection();
        }

        const cursor = this.getCursorPosition();
        this.insert("\n", false);
        this.moveCursorToPosition(cursor);
    }

    /**
     * Transposes current line.
     */
    transposeLetters(): void {
        const session = this.sessionOrThrow();
        if (this.selection && !this.selection.isEmpty()) {
            return;
        }

        const cursor = this.getCursorPosition();
        const column = cursor.column;
        if (column === 0)
            return;

        const line = session.getLine(cursor.row);
        let swap: string;
        let range: Range;
        if (column < line.length) {
            swap = line.charAt(column) + line.charAt(column - 1);
            range = new Range(cursor.row, column - 1, cursor.row, column + 1);
        }
        else {
            swap = line.charAt(column - 1) + line.charAt(column - 2);
            range = new Range(cursor.row, column - 2, cursor.row, column);
        }
        session.replace(range, swap);
        if (session.selection) {
            session.selection.moveToPosition(range.end);
        }
    }

    /**
     * Converts the current selection entirely into lowercase.
     */
    toLowerCase(): void {
        const session = this.sessionOrThrow();
        const originalRange = this.getSelectionRange();
        if (this.selection && this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        const range = this.getSelectionRange();
        const text = session.getTextRange(range);
        session.replace(range, text.toLowerCase());
        if (this.selection) {
            this.selection.setSelectionRange(originalRange);
        }
    }

    /**
     * Converts the current selection entirely into uppercase.
     */
    toUpperCase(): void {
        const session = this.sessionOrThrow();
        const originalRange = this.getSelectionRange();
        if (this.selection && this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        const range = this.getSelectionRange();
        const text = session.getTextRange(range);
        session.replace(range, text.toUpperCase());
        if (this.selection) {
            this.selection.setSelectionRange(originalRange);
        }
    }

    /**
     * Inserts an indentation into the current cursor position or indents the selected lines.
     */
    indent(): void {
        const session = this.sessionOrThrow();
        const range = this.getSelectionRange();

        if (range.start.row < range.end.row) {
            const { first, last } = this.$getSelectedRows();
            session.indentRows(first, last, "\t");
            return;
        }
        else if (range.start.column < range.end.column) {
            const text = session.getTextRange(range);
            if (!/^\s+$/.test(text)) {
                const { first, last } = this.$getSelectedRows();
                session.indentRows(first, last, "\t");
                return;
            }
        }

        const line = session.getLine(range.start.row);
        const position = range.start;
        const size = session.getTabSize();
        const column = session.documentToScreenColumn(position.row, position.column);

        let indentString: string;
        if (session.getUseSoftTabs()) {
            const count = (size - column % size);
            indentString = stringRepeat(" ", count);
        }
        else {
            let count = column % size;
            while (line[range.start.column - 1] === " " && count) {
                range.start.column--;
                count--;
            }
            if (this.selection) {
                this.selection.setSelectionRange(range);
            }
            indentString = "\t";
        }
        return this.insert(indentString, false);
    }

    /**
     * Indents the current line.
     */
    blockIndent(): void {
        const session = this.sessionOrThrow();
        const rows = this.$getSelectedRows();
        session.indentRows(rows.first, rows.last, "\t");
    }

    /**
     * Outdents the current line.
     */
    blockOutdent(): void {
        const session = this.sessionOrThrow();
        const selection = session.getSelection();
        if (selection) {
            session.outdentRows(selection.getRange());
        }
    }

    // TODO: move out of core when we have good mechanism for managing extensions.
    /**
     *
     */
    sortLines(): void {
        const session = this.sessionOrThrow();
        const rows: FirstAndLast = this.$getSelectedRows();

        const lines: string[] = [];
        for (let i = rows.first; i <= rows.last; i++)
            lines.push(session.getLine(i));

        lines.sort(function (a, b) {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        });

        const deleteRange = new Range(0, 0, 0, 0);
        for (let i = rows.first; i <= rows.last; i++) {
            const line = session.getLine(i);
            deleteRange.start.row = i;
            deleteRange.end.row = i;
            deleteRange.end.column = line.length;
            session.replace(deleteRange, lines[i - rows.first]);
        }
    }

    /**
     * Given the currently selected range, this function either comments all the lines, or uncomments all of them.
     */
    toggleCommentLines(): void {
        const session: EditSession = this.sessionOrThrow();
        const state = session.getState(this.getCursorPosition().row);
        const rows = this.$getSelectedRows();
        session.modeOrThrow().toggleCommentLines(state, session, rows.first, rows.last);
    }

    /**
     *
     */
    toggleBlockComment(): void {
        const session = this.sessionOrThrow();
        const cursor = this.getCursorPosition();
        const state = session.getState(cursor.row);
        const range = this.getSelectionRange();
        session.modeOrThrow().toggleBlockComment(state, session, range, cursor);
    }

    /**
     * Works like getTokenAt, except it returns a number.
     */
    getNumberAt(row: number, column: number): { value: string; start: number; end: number } | null {
        const session = this.sessionOrThrow();
        const _numberRx = /[\-]?[0-9]+(?:\.[0-9]+)?/g;
        _numberRx.lastIndex = 0;

        const s = session.getLine(row);
        while (_numberRx.lastIndex < column) {
            const m = _numberRx.exec(s);
            if (m && m.index <= column && m.index + m[0].length >= column) {
                const retval = {
                    value: m[0],
                    start: m.index,
                    end: m.index + m[0].length
                };
                return retval;
            }
        }
        return null;
    }

    /**
     * If the character before the cursor is a number, this functions changes its value by `amount`.
     *
     * @param amount The value to change the numeral by (can be negative to decrease value).
     */
    modifyNumber(amount: number): void {
        const session = this.sessionOrThrow();
        if (this.selection) {
            const row = this.selection.getCursor().row;
            const column = this.selection.getCursor().column;

            // get the char before the cursor
            const charRange = new Range(row, column - 1, row, column);

            const c = parseFloat(session.getTextRange(charRange));
            // if the char is a digit
            if (!isNaN(c) && isFinite(c)) {
                // get the whole number the digit is part of
                const nr = this.getNumberAt(row, column);
                // if number found
                if (nr) {
                    const fp = nr.value.indexOf(".") >= 0 ? nr.start + nr.value.indexOf(".") + 1 : nr.end;
                    const decimals = nr.start + nr.value.length - fp;

                    let t = parseFloat(nr.value);
                    t *= Math.pow(10, decimals);


                    if (fp !== nr.end && column < fp) {
                        amount *= Math.pow(10, nr.end - column - 1);
                    } else {
                        amount *= Math.pow(10, nr.end - column);
                    }

                    t += amount;
                    t /= Math.pow(10, decimals);
                    const nnr = t.toFixed(decimals);

                    // update number
                    const replaceRange = new Range(row, nr.start, row, nr.end);
                    session.replace(replaceRange, nnr);

                    // reposition the cursor
                    this.moveCursorTo(row, Math.max(nr.start + 1, column + nnr.length - nr.value.length));

                }
            }
        }
    }

    /**
     * Removes all the lines in the current selection.
     */
    removeLines(): void {
        const session = this.sessionOrThrow();
        const rows = this.$getSelectedRows();
        let range;
        if (rows.first === 0 || rows.last + 1 < session.getLength())
            range = new Range(rows.first, 0, rows.last + 1, 0);
        else
            range = new Range(
                rows.first - 1, session.getLine(rows.first - 1).length,
                rows.last, session.getLine(rows.last).length
            );
        session.remove(range);
        this.clearSelection();
    }

    /**
     *
     */
    duplicateSelection(): void {
        const session = this.sessionOrThrow();
        const selection = this.selection;
        if (selection) {
            const range = selection.getRange();
            const reverse = selection.isBackwards();
            if (isEmpty(range)) {
                const row = range.start.row;
                session.duplicateLines(row, row);
            }
            else {
                const point = reverse ? range.start : range.end;
                const endPoint = session.insert(point, session.getTextRange(range));
                range.start = point;
                range.end = endPoint;

                selection.setSelectionRange(range, reverse);
            }
        }
    }

    /**
     * Shifts all the selected lines down one row.
     */
    moveLinesDown(): void {
        const session = this.sessionOrThrow();
        this.$moveLines((firstRow: number, lastRow: number) => {
            return session.moveLinesDown(firstRow, lastRow);
        });
    }

    /**
     * Shifts all the selected lines up one row.
     */
    moveLinesUp(): void {
        const session = this.sessionOrThrow();
        this.$moveLines((firstRow, lastRow) => {
            return session.moveLinesUp(firstRow, lastRow);
        });
    }

    /**
     * Moves a range of text from the given range to the given position.
     *
     * @param range The range of text you want moved within the document
     * @param toPosition The location (row and column) where you want to move the text to
     * @param copy
     * @returns The new range where the text was moved to.
     */
    moveText(range: Range, toPosition: Position, copy: boolean): Range {
        const session = this.sessionOrThrow();
        return session.moveText(range, toPosition, copy);
    }

    /**
     * Copies all the selected lines up one row.
     */
    copyLinesUp(): void {
        const session = this.sessionOrThrow();
        this.$moveLines((firstRow, lastRow) => {
            session.duplicateLines(firstRow, lastRow);
        });
    }

    /**
     * Copies all the selected lines down one row.
     */
    copyLinesDown(): void {
        const session = this.sessionOrThrow();
        this.$moveLines((firstRow, lastRow) => {
            return session.duplicateLines(firstRow, lastRow);
        });
    }

    /**
     * Executes a specific function, which can be anything that manipulates selected lines, such as copying them, duplicating them, or shifting them.
     *
     * @param mover A method to call on each selected row.
     */
    private $moveLines(mover: (firstRow: number, lastRow: number) => void): void {
        const session = this.sessionOrThrow();
        const selection = this.selection;
        if (selection) {
            if (!selection.inMultiSelectMode || this.inVirtualSelectionMode) {
                /**
                 * This range is a temporary variable, so it's OK to mutate later.
                 */
                const range = selection.toOrientedRange();
                const selectedRows: { first: number; last: number } = this.$getSelectedRows();
                // TODO: This is not typesafe.
                const linesMoved = mover.call(this, selectedRows.first, selectedRows.last);
                moveBy(range, linesMoved, 0);
                selection.fromOrientedRange(range);
            }
            else {
                const ranges = selection.rangeList.ranges;
                selection.rangeList.detach();

                for (let i = ranges.length; i--;) {
                    let rangeIndex = i;
                    let collapsedRows = collapseRows(ranges[i]);
                    const last = collapsedRows.end.row;
                    let first = collapsedRows.start.row;
                    while (i--) {
                        collapsedRows = collapseRows(ranges[i]);
                        if (first - collapsedRows.end.row <= 1)
                            first = collapsedRows.end.row;
                        else
                            break;
                    }
                    i++;

                    const linesMoved = mover.call(this, first, last);
                    while (rangeIndex >= i) {
                        moveBy(ranges[rangeIndex], linesMoved, 0);
                        rangeIndex--;
                    }
                }
                selection.fromOrientedRange(selection.ranges[0]);
                selection.rangeList.attach(session);
            }
        }
    }

    /**
     * Returns an object indicating the currently selected rows.
     */
    private $getSelectedRows(): FirstAndLast {
        const session = this.sessionOrThrow();
        const range = collapseRows(this.getSelectionRange());

        return {
            first: session.getRowFoldStart(range.start.row),
            last: session.getRowFoldEnd(range.end.row)
        };
    }

    onCompositionStart(text?: string): void {
        this.renderer.showComposition(this.getCursorPosition());
    }

    onCompositionUpdate(text?: string): void {
        this.renderer.setCompositionText(text);
    }

    onCompositionEnd(): void {
        this.renderer.hideComposition();
    }

    /**
     *
     */
    getFirstVisibleRow(): number {
        return this.renderer.getFirstVisibleRow();
    }

    /**
     *
     */
    getLastVisibleRow(): number {
        return this.renderer.getLastVisibleRow();
    }

    /**
     * Indicates if the row is currently visible on the screen.
     */
    isRowVisible(row: number): boolean {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    }

    /**
     * Indicates if the entire row is currently visible on the screen.
     */
    isRowFullyVisible(row: number): boolean {
        return (row >= this.renderer.getFirstFullyVisibleRow() && row <= this.renderer.getLastFullyVisibleRow());
    }

    /**
     * FIXME: This does not seem to be used. Why does it have a $ symbol?
     * Returns the number of currently visible rows.
     */
    $getVisibleRowCount(): number {
        return this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1;
    }

    /**
     * @param direction +1 for page down, -1 for page up. Maybe N for N pages?
     * @param select
     */
    private $moveByPage(direction: number, select?: boolean): void {
        const renderer = this.renderer;
        if (renderer) {
            const config = renderer.layerConfig;
            const rows = direction * Math.floor(config.height / config.lineHeight);

            this.$blockScrolling++;
            try {
                if (this.selection) {
                    if (select === true) {
                        this.selection.$moveSelection(function () {
                            this.moveCursorBy(rows, 0);
                        });
                    }
                    else if (select === false) {
                        this.selection.moveCursorBy(rows, 0);
                        this.selection.clearSelection();
                    }
                }
            }
            finally {
                this.$blockScrolling--;
            }

            const scrollTop = renderer.scrollTop;

            renderer.scrollBy(0, rows * config.lineHeight);
            // FIXME: Why don't we assert our args and do typeof select === 'undefined'?
            if (select != null) {
                // This is called when select is undefined.
                renderer.scrollCursorIntoView(void 0, 0.5);
            }

            renderer.animateScrolling(scrollTop);
        }
    }

    selectFileEnd(): void {
        this.selectionOrThrow().selectFileEnd();
    }

    /**
     * Selects the text from the current position of the document until where a "page down" finishes.
     */
    selectPageDown(): void {
        this.$moveByPage(+1, true);
    }

    /**
     * Selects the text from the current position of the document until where a "page up" finishes.
     */
    selectPageUp(): void {
        this.$moveByPage(-1, true);
    }

    selectToFileStart(): void {
        return this.selectionOrThrow().selectFileStart();
    }

    selectDown(): void {
        return this.selectionOrThrow().selectDown();
    }

    selectLeft(): void {
        return this.selectionOrThrow().selectLeft();
    }

    selectRight(): void {
        return this.selectionOrThrow().selectRight();
    }

    selectUp(): void {
        return this.selectionOrThrow().selectUp();
    }

    selectWordLeft(): void {
        return this.selectionOrThrow().selectWordLeft();
    }

    selectWordRight(): void {
        return this.selectionOrThrow().selectWordRight();
    }

    selectWordOrFindNext(): void {
        if (this.selection && this.selection.isEmpty()) {
            this.selection.selectWord();
        }
        else {
            this.findNext();
        }
    }

    selectWordOrFindPrevious(): void {
        if (this.selection && this.selection.isEmpty()) {
            this.selection.selectWord();
        }
        else {
            this.findPrevious();
        }
    }

    selectLineStart(): void {
        return this.selectionOrThrow().selectLineStart();
    }

    selectLineEnd(): void {
        return this.selectionOrThrow().selectLineEnd();
    }
    /**
     * Shifts the document to wherever "page down" is, as well as moving the cursor position.
     */
    gotoPageDown(): void {
        this.$moveByPage(+1, false);
    }

    /**
     * Shifts the document to wherever "page up" is, as well as moving the cursor position.
     */
    gotoPageUp(): void {
        this.$moveByPage(-1, false);
    }

    //
    // EditorChangeable
    //

    deleteLeft(): void {
        if (this.selection && this.selection.isEmpty()) {
            this.remove("left");
            return void 0;
        }
        else {
            // We don't actually listen to the return value of commands at present.
            // return false;
        }
    }

    //
    // EditorRecordable
    //

    toggleRecording(): void {
        this.commands.toggleRecording(this);
    }

    replay(): void {
        this.commands.replay(this);
    }

    //
    // EditorScrollable
    //

    scrollDown(): void {
        const deltaX = 0;
        const deltaY = 2 * this.renderer.layerConfig.lineHeight;
        this.renderer.scrollBy(deltaX, deltaY);
    }

    scrollUp(): void {
        const deltaX = 0;
        const deltaY = -2 * this.renderer.layerConfig.lineHeight;
        this.renderer.scrollBy(deltaX, deltaY);
    }

    /**
     * Scrolls the document to wherever "page down" is, without changing the cursor position.
     */
    scrollPageDown(): void {
        this.$moveByPage(Direction.FORWARD);
    }

    /**
     * Scrolls the document to wherever "page up" is, without changing the cursor position.
     */
    scrollPageUp(): void {
        this.$moveByPage(Direction.BACKWARD);
    }

    scrollCursorIntoView(cursor?: Position | null, offset?: number, viewMargin?: { top?: number; bottom?: number }): void {
        const renderer = this.renderer;
        if (renderer) {
            renderer.scrollCursorIntoView(cursor, offset, viewMargin);
        }
    }

    /**
     * Moves the editor to the specified row.
     *
     * @param row
     */
    scrollToRow(row: number): void {
        this.renderer.scrollToRow(row);
    }

    /**
     * Scrolls to a line.
     * If `center` is `true`, it puts the line in middle of screen (or attempts to).
     *
     * @param line The line to scroll to
     * @param center If `true`
     * @param animate If `true` animates scrolling
     * @param callback Function to be called when the animation has finished.
     */
    scrollToLine(line: number, center: boolean, animate?: boolean, callback?: () => any): void {
        this.renderer.scrollToLine(line, center, animate, callback);
    }

    /**
     * Attempts to center the current selection on the screen.
     */
    centerSelection(): void {
        const range = this.getSelectionRange();
        const pos = {
            row: Math.floor(range.start.row + (range.end.row - range.start.row) / 2),
            column: Math.floor(range.start.column + (range.end.column - range.start.column) / 2)
        };
        this.renderer.alignCursor(pos, 0.5);
    }

    /**
     * Gets the current position of the cursor.
     * Throws an exception if the selection does not exist.
     */
    getCursorPosition(): Position {
        const selection = this.selectionOrThrow();
        return selection.getCursor();
    }

    /**
     * Returns the screen position of the cursor.
     */
    getCursorPositionScreen(): Position {
        const cursor = this.getCursorPosition();
        return this.sessionOrThrow().documentToScreenPosition(cursor.row, cursor.column);
    }

    getSelectionIndex(): number {
        return this.selectionOrThrow().index;
    }

    /**
     *
     */
    getSelectionRange(): OrientedRange {
        return this.selectionOrThrow().getRange();
    }

    //
    // EditorSelectable
    //

    expandToLine(): void {
        if (this.selection) {
            const range = this.selection.getRange();

            range.start.column = range.end.column = 0;
            range.end.row++;
            this.selection.setRange(range, false);
        }

    }

    /**
     * Selects all the text in editor.
     */
    selectAll(): void {
        const selection = this.selectionOrThrow();

        this.$blockScrolling += 1;
        selection.selectAll();
        this.$blockScrolling -= 1;
    }

    /**
     * Empties the selection without actually setting it to null or undefined.
     */
    clearSelection(): void {
        const selection = this.selectionOrThrow();
        selection.clearSelection();
    }

    //
    // EditorTypeAware
    //

    /**
     * Handles the "Go to Definition" request when initiated from the keyboard (F12).
     * The editor itself can't do much.
     * The event is relayed to an observable for those who want to know.
     */
    gotoDefinition(): void {
        const cursorPosition = this.getCursorPosition();
        this.gotoDefinitionBus._signal('gotoDefinition', cursorPosition);
    }

    isGotoDefinitionAvailable(): boolean {
        return true;
    }

    /**
     * Moves the cursor to the specified row and column.
     * Note that this does not de-select the current selection.
     *
     * @param row The new row number
     * @param column The new column number
     * @param animate
     */
    moveCursorTo(row: number, column: number, animate?: boolean): void {
        const selection = this.selectionOrThrow();
        selection.moveCursorTo(row, column, animate);
    }

    /**
     * Moves the cursor to the position specified by `position.row` and `position.column`.
     *
     * @param position An object with two properties, row and column.
     */
    moveCursorToPosition(position: Position): void {
        const selection = this.selectionOrThrow();
        return selection.moveCursorToPosition(position);
    }

    /**
     * Moves the cursor's row and column to the next matching bracket or HTML tag.
     * This is activated by Ctrl-P or Ctrl-Shift-P
     * This may throw an exception if the tokens are not indexed.
     */
    jumpToMatching(select?: boolean): void {
        const session = this.sessionOrThrow();
        const cursor = this.getCursorPosition();
        const iterator = new TokenIterator(session, cursor.row, cursor.column);
        let prevToken = iterator.getCurrentToken();
        let token = prevToken;

        if (!token) {
            token = iterator.stepForward();
        }

        if (!token) {
            return;
        }

        // get next closing tag or bracket
        let matchType: 'bracket' | 'tag' | undefined;
        let found = false;
        const depth = {};
        // FIXME: The following could evaluate to cursor.column or NaN if start is null or undefined.
        if (typeof (token as TokenWithIndex).start !== 'number') {
            throw new Error(`token.start is ${typeof (token as TokenWithIndex).start}`);
        }
        let i = cursor.column - (token as TokenWithIndex).start;
        let bracketType: string;
        const brackets = {
            ")": "(",
            "(": "(",
            "]": "[",
            "[": "[",
            "{": "{",
            "}": "{"
        };

        do {
            if (token.value.match(/[{}()\[\]]/g)) {
                for (; i < token.value.length && !found; i++) {
                    if (!brackets[token.value[i]]) {
                        continue;
                    }

                    bracketType = brackets[token.value[i]] + '.' + token.type.replace("rparen", "lparen");

                    if (isNaN(depth[bracketType])) {
                        depth[bracketType] = 0;
                    }

                    switch (token.value[i]) {
                        case '(':
                        case '[':
                        case '{':
                            depth[bracketType]++;
                            break;
                        case ')':
                        case ']':
                        case '}':
                            depth[bracketType]--;

                            if (depth[bracketType] === -1) {
                                matchType = 'bracket';
                                found = true;
                            }
                            break;
                    }
                }
            }
            else if (token && token.type.indexOf('tag-name') !== -1) {
                if (isNaN(depth[token.value])) {
                    depth[token.value] = 0;
                }

                if (prevToken) {
                    if (prevToken.value === '<') {
                        depth[token.value]++;
                    }
                    else if (prevToken.value === '</') {
                        depth[token.value]--;
                    }
                }
                else {
                    console.warn(`typeof prevToken => ${typeof prevToken}`);
                }

                if (depth[token.value] === -1) {
                    matchType = 'tag';
                    found = true;
                }
            }

            if (!found) {
                prevToken = token;
                token = iterator.stepForward();
                i = 0;
            }
        } while (token && !found);

        // no match found
        if (!matchType) {
            return;
        }

        let range: OrientedRange | null | undefined;
        let tag: string;
        let pos: Position | undefined;
        if (matchType === 'bracket') {
            range = session.getBracketRange(cursor);
            if (!range) {
                range = new Range(
                    iterator.getCurrentTokenRow(),
                    iterator.getCurrentTokenColumn() + i - 1,
                    iterator.getCurrentTokenRow(),
                    iterator.getCurrentTokenColumn() + i - 1
                );
                if (!range)
                    return;
                const pos = range.start;
                if (pos.row === cursor.row && Math.abs(pos.column - cursor.column) < 2) {
                    range = session.getBracketRange(pos);
                }
            }
        }
        else if (matchType === 'tag') {
            if (token && token.type.indexOf('tag-name') !== -1) {
                tag = token.value;
            }
            else {
                return;
            }

            range = new Range(
                iterator.getCurrentTokenRow(),
                iterator.getCurrentTokenColumn() - 2,
                iterator.getCurrentTokenRow(),
                iterator.getCurrentTokenColumn() - 2
            );

            // find matching tag
            if (compare(range, cursor.row, cursor.column) === 0) {
                found = false;
                do {
                    token = prevToken;
                    prevToken = iterator.stepBackward();

                    if (prevToken) {
                        if (prevToken.type.indexOf('tag-close') !== -1) {
                            setEnd(range, iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 1);
                        }

                        if (token) {
                            if (token.value === tag && token.type.indexOf('tag-name') !== -1) {
                                if (prevToken.value === '<') {
                                    depth[tag]++;
                                }
                                else if (prevToken.value === '</') {
                                    depth[tag]--;
                                }

                                if (depth[tag] === 0) {
                                    found = true;
                                }
                            }
                        }
                        else {
                            console.warn(`typeof token => ${typeof token}`);
                        }
                    }
                } while (prevToken && !found);
            }

            // we found it
            if (token && token.type.indexOf('tag-name')) {
                pos = range.start;
                if (pos.row === cursor.row && Math.abs(pos.column - cursor.column) < 2)
                    pos = range.end;
            }
        }

        pos = range && range.cursor || pos;
        if (pos) {
            if (select) {
                if (range && isEqual(range, this.getSelectionRange())) {
                    this.clearSelection();
                }
                else {
                    if (this.selection) {
                        this.selection.selectTo(pos.row, pos.column);
                    }
                }
            }
            else {
                if (this.selection) {
                    this.selection.moveTo(pos.row, pos.column);
                }
            }
        }
    }

    /**
     * Moves the cursor to the specified line number, and also into the indicated column.
     *
     * @param lineNumber The line number to go to.
     * @param column A column number to go to.
     * @param animate If `true` animates scolling.
     */
    gotoLine(lineNumber: number, column?: number, animate?: boolean): void {

        if (this.selection) {
            this.selection.clearSelection();
        }
        else {
            return;
        }

        if (this.session) {
            this.session.unfold({ row: lineNumber - 1, column: column || 0 });
        }
        else {
            return;
        }

        this.$blockScrolling += 1;
        // todo: find a way to automatically exit multiselect mode
        if (this.exitMultiSelectMode) {
            this.exitMultiSelectMode();
        }
        this.moveCursorTo(lineNumber - 1, column || 0);
        this.$blockScrolling -= 1;

        if (!this.isRowFullyVisible(lineNumber - 1)) {
            this.scrollToLine(lineNumber - 1, true, animate);
        }
    }

    /**
     * Moves the cursor to the specified row and column.
     * Note that this does de-select the current selection.
     *
     * @param row The new row number
     * @param column The new column number
     */
    navigateTo(row: number, column: number): void {
        const selection = this.selectionOrThrow();
        selection.moveTo(row, column);
    }

    /**
     * Moves the cursor up in the document the specified number of times.
     * Note that this does de-select the current selection.
     *
     * @param times The number of times to change navigation.
     */
    navigateUp(times: number): void {
        const selection = this.selectionOrThrow();
        if (selection.isMultiLine() && !selection.isBackwards()) {
            const selectionStart = selection.anchor.getPosition();
            return this.moveCursorToPosition(selectionStart);
        }
        selection.clearSelection();
        selection.moveCursorBy(-times || -1, 0);
    }

    /**
     * Moves the cursor down in the document the specified number of times.
     * Note that this does de-select the current selection.
     *
     * @param times The number of times to change navigation
     */
    navigateDown(times: number): void {
        const selection = this.selectionOrThrow();
        if (selection.isMultiLine() && selection.isBackwards()) {
            const selectionEnd = selection.anchor.getPosition();
            return this.moveCursorToPosition(selectionEnd);
        }
        selection.clearSelection();
        selection.moveCursorBy(times || 1, 0);
    }

    /**
     * Moves the cursor left in the document the specified number of times.
     * Note that this does de-select the current selection.
     *
     * @param times The number of times to change navigation
     */
    navigateLeft(times: number): void {
        const selection = this.selectionOrThrow();
        if (!selection.isEmpty()) {
            const selectionStart = this.getSelectionRange().start;
            this.moveCursorToPosition(selectionStart);
        }
        else {
            times = times || 1;
            while (times--) {
                selection.moveCursorLeft();
            }
        }
        this.clearSelection();
    }

    /**
     * Moves the cursor right in the document the specified number of times.
     * Note that this does de-select the current selection.
     *
     * @param times The number of times to change navigation
     */
    navigateRight(times: number): void {
        const selection = this.selectionOrThrow();
        if (!selection.isEmpty()) {
            const selectionEnd = this.getSelectionRange().end;
            this.moveCursorToPosition(selectionEnd);
        }
        else {
            times = times || 1;
            while (times--) {
                selection.moveCursorRight();
            }
        }
        this.clearSelection();
    }

    /**
     * Moves the cursor to the start of the current line.
     * Note that this does de-select the current selection.
     */
    navigateLineStart(): void {
        const selection = this.selectionOrThrow();
        selection.moveCursorLineStart();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the end of the current line.
     * Note that this does de-select the current selection.
     */
    navigateLineEnd(): void {
        const selection = this.selectionOrThrow();
        selection.moveCursorLineEnd();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the end of the current file.
     * Note that this does de-select the current selection.
     */
    navigateFileEnd(): void {
        const selection = this.selectionOrThrow();
        selection.moveCursorFileEnd();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the start of the current file.
     * Note that this also de-selects the current selection.
     */
    navigateFileStart(): void {
        const selection = this.selectionOrThrow();
        selection.moveCursorFileStart();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the word immediately to the right of the current position.
     * Note that this does de-select the current selection.
     */
    navigateWordRight(): void {
        const selection = this.selectionOrThrow();
        selection.moveCursorWordRight();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the word immediately to the left of the current position.
     * Note that this does de-select the current selection.
     */
    navigateWordLeft(): void {
        const selection = this.selectionOrThrow();
        selection.moveCursorWordLeft();
        this.clearSelection();
    }

    getSearchRegExp(): RegExp {
        return this.$search.$options.re as RegExp;
    }

    /**
     * Replaces the first occurence of `options.needle` with the value in `replacement`.
     *
     * @param replacement The text to replace with.
     * @param options The options to use.
     */
    replace(replacement: string, options?: SearchOptions): number {
        const session = this.sessionOrThrow();
        const selection = this.selectionOrThrow();

        if (options) {
            this.$search.set(options);
        }

        const range = this.$search.find(session);
        let replaced = 0;
        if (!range)
            return replaced;

        if (this.$tryReplace(range, replacement)) {
            replaced = 1;
        }
        if (range !== null) {
            selection.setSelectionRange(range);
            this.renderer.scrollSelectionIntoView(range.start, range.end);
        }

        return replaced;
    }

    /**
     * Replaces a range in the document with the `newText`.
     * Returns the end position of the change.
     * This method triggers a change events in the document for removal and insertion.
     */
    public replaceRange(range: RangeBasic, newText: string): Position {
        return this.sessionOrThrow().replace(range, newText);
    }

    /**
     * Replaces all occurences of `options.needle` with the value in `replacement`.
     *
     * @param replacement The text to replace with
     * @param options The options to use.
     */
    replaceAll(replacement: string, options?: SearchOptions): number {
        const session = this.sessionOrThrow();
        const selection = this.selectionOrThrow();

        if (options) {
            this.$search.set(options);
        }

        const ranges = this.$search.findAll(session);
        let replaced = 0;
        if (!ranges.length) {
            return replaced;
        }

        this.$blockScrolling += 1;
        try {
            const selectionRange = this.getSelectionRange();
            selection.moveTo(0, 0);

            for (let i = ranges.length - 1; i >= 0; --i) {
                if (this.$tryReplace(ranges[i], replacement)) {
                    replaced++;
                }
            }

            selection.setSelectionRange(selectionRange);
        }
        finally {
            this.$blockScrolling -= 1;
        }

        return replaced;
    }

    /**
     * 
     */
    private $tryReplace(range: RangeBasic, replacementMe: string): RangeBasic | null {
        const session = this.sessionOrThrow();
        const input = session.getTextRange(range);
        const replacement = this.$search.replace(input, replacementMe);
        if (typeof replacement === 'string') {
            range.end = session.replace(range, replacement);
            return range;
        }
        else {
            return null;
        }
    }

    highlight(re?: RegExp): void {
        const session = this.getSession();
        if (session) {
            if (re) {
                session.highlight(re);
            }
            else {
                session.highlight(this.getSearchRegExp());
            }
        }
        this.updateBackMarkers();
    }

    updateFrontMarkers(): void {
        return this.renderer.updateFrontMarkers();
    }

    updateBackMarkers(): void {
        return this.renderer.updateBackMarkers();
    }

    updateFull(force?: boolean): void {
        return this.renderer.updateFull(force);
    }

    /**
     *
     */
    getLastSearchOptions(): SearchOptions {
        return this.$search.getOptions();
    }

    /**
     * Finds and selects all the occurences of `needle`.
     *
     * @param needle The text to find.
     * @param options The search options.
     * @param additive
     * @returns The cumulative count of all found matches 
     */
    findAll(needle?: (string | RegExp), options: SearchOptions = {}, additive?: boolean): number {
        const session = this.sessionOrThrow();
        const selection = this.selectionOrThrow();
        options.needle = needle || options.needle;
        let range: OrientedRange | undefined;
        if (options.needle === void 0) {
            range = selection.isEmpty() ? selection.getWordRange() : selection.getRange();
            options.needle = session.getTextRange(range);
        }
        this.$search.set(options);

        const ranges = this.$search.findAll(session);
        if (!ranges.length)
            return 0;

        this.$blockScrolling += 1;
        try {
            const multiSelection = this.multiSelect;

            if (!additive) {
                if (multiSelection) {
                    multiSelection.toSingleRange(ranges[0]);
                }
            }

            if (multiSelection) {
                for (let i = ranges.length; i--;) {
                    multiSelection.addRange(ranges[i], true);
                }
            }

            // Keep existing selection as primary if possible.
            if (range && multiSelection && multiSelection.rangeList.rangeAtPoint(range.start)) {
                multiSelection.addRange(range, true);
            }
        }
        finally {
            this.$blockScrolling -= 1;
        }

        return ranges.length;
    }

    /**
     * Attempts to find `needle` within the document.
     * For more information on `options`, see [[Search `Search`]].
     *
     * @param needle The text to search for.
     * @param options An object defining various search properties
     * @param animate If `true` animate scrolling
     */
    find(needle?: (string | RegExp), options: SearchOptions = {}, animate?: boolean): RangeBasic | null | undefined {
        const selection = this.selectionOrThrow();
        const session = this.sessionOrThrow();
        if (typeof needle === "string" || needle instanceof RegExp) {
            options.needle = needle;
        }
        else if (typeof needle === "object") {
            mixin(options, needle);
        }

        let range = selection.getRange();
        if (options.needle == null) {
            needle = session.getTextRange(range) || this.$search.$options.needle;
            if (!needle) {
                range = this.getWordRange(range.start.row, range.start.column);
                needle = session.getTextRange(range);
            }
            this.$search.set({ needle: needle });
        }

        this.$search.set(options);
        if (!options.start) {
            this.$search.set({ start: range });
        }

        const newRange = this.$search.find(session);
        if (options.preventScroll) {
            return newRange;
        }
        if (newRange) {
            this.revealRange(newRange, animate);
            return newRange;
        }
        // clear selection if nothing is found
        if (options.backwards) {
            range.start = range.end;
        }
        else {
            range.end = range.start;
        }
        selection.setRange(range);
        return void 0;
    }

    findSearchBox(match: boolean) {
        this._emit('findSearchBox', { match });
    }

    /**
     * Performs another search for `needle` in the document.
     * For more information on `options`, see [[Search `Search`]].
     *
     * @param needle
     * @param animate If `true` animate scrolling
     */
    findNext(needle?: (string | RegExp), animate?: boolean): void {
        this.find(needle, { skipCurrent: true, backwards: false }, animate);
    }

    /**
     * Performs a search for `needle` backwards.
     * For more information on `options`, see [[Search `Search`]].
     *
     * @param needle
     * @param animate If `true` animate scrolling
     */
    findPrevious(needle?: (string | RegExp), animate?: boolean): void {
        this.find(needle, { skipCurrent: true, backwards: true }, animate);
    }

    /**
     *
     */
    revealRange(range: Range, animate?: boolean): void {
        const session = this.sessionOrThrow();

        this.$blockScrolling += 1;
        session.unfold(range);
        if (this.selection) {
            this.selection.setSelectionRange(range);
        }
        this.$blockScrolling -= 1;

        const scrollTop = this.renderer.scrollTop;
        this.renderer.scrollSelectionIntoView(range.start, range.end, 0.5);
        if (animate) {
            this.renderer.animateScrolling(scrollTop);
        }
    }

    /**
     *
     */
    undo(): void {
        const session = this.sessionOrThrow();

        this.$blockScrolling++;
        session.getUndoManager().undo();
        this.$blockScrolling--;
        const renderer = this.renderer;
        if (renderer) {
            renderer.scrollCursorIntoView(void 0, 0.5);
        }
    }

    /**
     *
     */
    redo(): void {
        const session = this.sessionOrThrow();

        this.$blockScrolling++;
        session.getUndoManager().redo();
        this.$blockScrolling--;
        const renderer = this.renderer;
        if (renderer) {
            renderer.scrollCursorIntoView(void 0, 0.5);
        }
    }

    setUndoManager(undoManager: UndoManager): void {
        return this.sessionOrThrow().setUndoManager(undoManager as NativeUndoManager);
    }

    /**
     * Enables automatic scrolling of the cursor into view when editor itself is inside scrollable element.
     */
    setAutoScrollEditorIntoView(enable: boolean): void {
        if (!enable) {
            return;
        }
        let rect: ClientRect | null;
        let shouldScroll: boolean | null = false;
        if (!this.$scrollAnchor)
            this.$scrollAnchor = document.createElement("div");
        const scrollAnchor = this.$scrollAnchor;
        scrollAnchor.style.cssText = "position:absolute";
        this.container.insertBefore(scrollAnchor, this.container.firstChild);

        let onChangeSelection: (() => void) | undefined = this.on("changeSelection", function () {
            shouldScroll = true;
        });

        // needed to not trigger sync reflow
        let removeBeforeRenderHandler: (() => void) | undefined = this.renderer.on("beforeRender", () => {
            if (shouldScroll)
                rect = this.renderer.container.getBoundingClientRect();
        });
        let removeAfterRenderHandler: (() => void) | undefined = this.renderer.on("afterRender", () => {
            if (shouldScroll && rect && this.isFocused()) {
                const renderer = this.renderer;
                const pos = renderer.cursorLayer.$pixelPos;
                const config = renderer.layerConfig;
                const top = pos.top - config.offset;
                if (pos.top >= 0 && top + rect.top < 0) {
                    shouldScroll = true;
                }
                else if (pos.top < config.height &&
                    pos.top + rect.top + config.lineHeight > window.innerHeight) {
                    shouldScroll = false;
                }
                else {
                    shouldScroll = null;
                }
                if (shouldScroll != null) {
                    scrollAnchor.style.top = top + "px";
                    scrollAnchor.style.left = pos.left + "px";
                    scrollAnchor.style.height = config.lineHeight + "px";
                    scrollAnchor.scrollIntoView(shouldScroll);
                }
                shouldScroll = rect = null;
            }
        });

        //
        // This would appear to install an instance-level method which
        // can also remove itself when no longer required!
        //
        this.setAutoScrollEditorIntoView = (enable) => {
            if (enable) {
                return;
            }

            delete this.setAutoScrollEditorIntoView;

            if (onChangeSelection) {
                onChangeSelection();
                onChangeSelection = void 0;
            }

            if (removeBeforeRenderHandler) {
                removeBeforeRenderHandler();
                removeBeforeRenderHandler = void 0;
            }

            if (removeAfterRenderHandler) {
                removeAfterRenderHandler();
                removeAfterRenderHandler = void 0;
            }
        };
    }

    private resetCursorStyle(): void {
        const style = this.$cursorStyle || "ace";
        const cursorLayer = this.renderer.cursorLayer;
        if (!cursorLayer) {
            return;
        }
        cursorLayer.setSmoothBlinking(/smooth/.test(style));
        // The cursor only blinks if the editor is writeable.
        cursorLayer.isBlinking = !this.$readOnly && style !== "wide";
        cursorLayer.setCssClass("ace_slim-cursors", /slim/.test(style));
    }
}

class FoldHandler {
    constructor(editor: Editor) {

        // The following handler detects clicks in the editor (not gutter) region
        // to determine whether to remove or expand a fold.
        editor.on("click", function (e: EditorMouseEvent) {
            const position = e.getDocumentPosition();
            const session = editor.sessionOrThrow();

            // If the user clicked on a fold, then expand it.
            const fold = session.getFoldAt(position.row, position.column, 1);
            if (fold) {
                if (e.getAccelKey()) {
                    session.removeFold(fold);
                }
                else {
                    session.expandFold(fold);
                }
                e.stop();
            }
            else {
                // Do nothing.
            }
        });

        // The following handler detects clicks on the gutter.
        editor.on('gutterclick', function (e: EditorMouseEvent) {
            const session = editor.sessionOrThrow();
            const renderer = editor.renderer;
            if (renderer) {
                const gutterRegion = renderer.$gutterLayer.getRegion(e);
                if (gutterRegion === 'foldWidgets') {
                    const row = e.getDocumentPosition().row;
                    if (session.foldWidgets && session.foldWidgets[row]) {
                        session.onFoldWidgetClick(row, e);
                    }
                    if (!editor.isFocused()) {
                        editor.focus();
                    }
                    e.stop();
                }
            }
        });

        editor.on('gutterdblclick', function (e: EditorMouseEvent) {
            const session = editor.sessionOrThrow();
            const gutterRegion = editor.renderer.$gutterLayer.getRegion(e);

            if (gutterRegion === 'foldWidgets') {
                let row = e.getDocumentPosition().row;
                const data = session.getParentFoldRangeData(row, true);
                const range = data.range || data.firstRange;

                if (range) {
                    row = range.start.row;
                    const fold = session.getFoldAt(row, session.getLine(row).length, 1);

                    if (fold) {
                        session.removeFold(fold);
                    }
                    else {
                        session.addPlaceholderFold("...", range);
                        const renderer = editor.renderer;
                        if (renderer) {
                            renderer.scrollCursorIntoView({ row: range.start.row, column: 0 });
                        }
                    }
                }
                e.stop();
            }
        });
    }
}

interface IGestureHandler {
    $dragDelay: number;
    $scrollSpeed: number;
    isMousePressed: boolean;
    cancelContextMenu(): void;
}

/**
 * The allowed values of the state property of the MouseHandler.
 */
type MouseHandlerState = 'focusWait' | 'select' | 'selectAll' | 'selectByLines' | 'selectByWords' | '';

class MouseHandler implements IGestureHandler {
    public editor: Editor;
    public $scrollSpeed = 2;
    public $dragDelay = 0;
    private $dragEnabled = true;
    public $focusTimout = 0;
    public $tooltipFollowsMouse = true;
    private state: MouseHandlerState;
    private clientX: number;
    private clientY: number;
    public isMousePressed: boolean;
    /**
     * The function to call to release a captured mouse.
     */
    private releaseMouse: ((event: MouseEvent | undefined) => void) | null;
    // private mouseEvent: EditorMouseEvent;
    public mousedownEvent: EditorMouseEvent;
    // private $mouseMoved: boolean;
    // private $onCaptureMouseMove: ((event: MouseEvent) => void) | null;
    public $clickSelection: OrientedRange | null = null;
    public $lastScrollTime: number;
    public selectByLines: () => void;
    public selectByWords: () => void;
    constructor(editor: Editor) {
        // FIXME: Did I mention that `this`, `new`, `class`, `bind` are the 4 horsemen?
        // FIXME: Function Scoping is the answer.
        const _self = this;
        this.editor = editor;

        // FIXME: We should be cleaning up these handlers in a dispose method...
        editor.setDefaultHandler('mousedown', makeMouseDownHandler(editor, this));
        editor.setDefaultHandler('mousewheel', makeMouseWheelHandler(editor, this));
        editor.setDefaultHandler("dblclick", makeDoubleClickHandler(editor, this));
        editor.setDefaultHandler("tripleclick", makeTripleClickHandler(editor, this));
        editor.setDefaultHandler("quadclick", makeQuadClickHandler(editor, this));

        this.selectByLines = makeExtendSelectionBy(editor, this, "getLineRange");
        this.selectByWords = makeExtendSelectionBy(editor, this, "getWordRange");

        // tslint:disable-next-line:no-unused-expression
        new GutterHandler(this);
        //      FIXME: new DragdropHandler(this);

        const onMouseDown = function (e: MouseEvent) {
            if (!editor.isFocused() && editor.textInput) {
                editor.textInput.moveToMouse(e);
            }
            editor.focus();
        };

        const renderer = editor.renderer;
        if (renderer) {
            const mouseTarget: HTMLDivElement = renderer.getMouseEventTarget();
            addListener(mouseTarget, "click", this.onMouseEvent.bind(this, "click"));
            addListener(mouseTarget, "mousemove", this.onMouseMove.bind(this, "mousemove"));
            addMultiMouseDownListener(mouseTarget, [400, 300, 250], this, "onMouseEvent");
            if (renderer.scrollBarV) {
                addMultiMouseDownListener(renderer.scrollBarV.inner, [400, 300, 250], this, "onMouseEvent");
                addMultiMouseDownListener(renderer.scrollBarH.inner, [400, 300, 250], this, "onMouseEvent");
                if (isIE) {
                    addListener(renderer.scrollBarV.element, "mousedown", onMouseDown);
                    // TODO: I wonder if we should be responding to mousedown (by symmetry)?
                    addListener(renderer.scrollBarH.element, "mousemove", onMouseDown);
                }
            }

            // We hook 'mousewheel' using the portable 
            addMouseWheelListener(editor.container, this.emitEditorMouseWheelEvent.bind(this, "mousewheel"));

            const gutterEl = renderer.$gutter;
            addListener(gutterEl, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"));
            addListener(gutterEl, "click", this.onMouseEvent.bind(this, "gutterclick"));
            addListener(gutterEl, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"));
            addListener(gutterEl, "mousemove", this.onMouseEvent.bind(this, "guttermousemove"));

            addListener(mouseTarget, "mousedown", onMouseDown);

            addListener(gutterEl, "mousedown", function (e) {
                editor.focus();
                return preventDefault(e);
            });

            // Handle `mousemove` while the mouse is over the editing area (and not the gutter).
            editor.on('mousemove', function (e: MouseEvent) {
                if (_self.state || _self.$dragDelay || !_self.$dragEnabled) {
                    return;
                }
                // FIXME: Probably s/b clientXY
                const char = editor.renderer.screenToTextCoordinates(e.x, e.y);
                const session = editor.getSession();
                if (session) {
                    const selection = session.getSelection();
                    if (selection) {
                        const range = selection.getRange();
                        const renderer = editor.renderer;

                        if (!isEmpty(range) && insideStart(range, char.row, char.column)) {
                            renderer.setCursorStyle('default');
                        }
                        else {
                            renderer.setCursorStyle("");
                        }
                    }
                }
                else {
                    console.warn("editor.session is not defined.");
                }
            });
        }
    }

    onMouseEvent(name: EditorEventName, e: MouseEvent) {
        this.editor._emit(name, new EditorMouseEvent(e, this.editor));
    }

    onMouseMove(name: EditorEventName, e: MouseEvent) {
        // If nobody is listening, avoid the creation of the temporary wrapper.
        // optimization, because mousemove doesn't have a default handler.
        if (this.editor.hasListeners('mousemove')) {
            this.editor._emit(name, new EditorMouseEvent(e, this.editor));
        }
    }

    emitEditorMouseWheelEvent(name: EditorEventName, e: MouseWheelEvent) {
        const mouseEvent = new EditorMouseEvent(e, this.editor);
        mouseEvent.speed = this.$scrollSpeed * 2;
        mouseEvent.wheelX = e['wheelX'];
        mouseEvent.wheelY = e['wheelY'];
        this.editor._emit(name, mouseEvent);
    }

    setState(state: MouseHandlerState) {
        this.state = state;
    }

    textCoordinates(): { row: number; column: number } {
        return this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
    }

    /**
     * 
     */
    captureMouse(ev: EditorMouseEvent, mouseMoveHandler?: (mouseEvent: MouseEvent) => void): void {
        this.clientX = ev.clientX;
        this.clientY = ev.clientY;

        this.isMousePressed = true;

        // do not move textarea during selection
        const renderer = this.editor.renderer;
        if (renderer.$keepTextAreaAtCursor) {
            renderer.$keepTextAreaAtCursor = null;
        }

        const onMouseMove = (function (editor: Editor, mouseHandler: MouseHandler) {
            return function (mouseEvent: MouseEvent) {
                if (!mouseEvent) return;
                // if editor is loaded inside iframe, and mouseup event is outside
                // we won't recieve it, so we cancel on first mousemove without button
                if (isWebKit && !mouseEvent.which && mouseHandler.releaseMouse) {
                    // TODO: For backwards compatibility I'm passing undefined,
                    // but it would probably make more sense to pass the mouse event
                    // since that is the final event.
                    return mouseHandler.releaseMouse(undefined);
                }

                mouseHandler.clientX = mouseEvent.clientX;
                mouseHandler.clientY = mouseEvent.clientY;
                if (mouseMoveHandler) {
                    mouseMoveHandler(mouseEvent);
                }
                // mouseHandler.mouseEvent = new EditorMouseEvent(mouseEvent, editor);
                // mouseHandler.$mouseMoved = true;
            };
        })(this.editor, this);

        let timerId: number;

        const onCaptureInterval = (function (mouseHandler: MouseHandler) {
            return function () {
                if (mouseHandler[mouseHandler.state]) {
                    mouseHandler[mouseHandler.state]();
                }
                // mouseHandler.$mouseMoved = false;
            };
        })(this);

        const onCaptureEnd = (function (mouseHandler: MouseHandler) {
            return function (e: MouseEvent) {
                clearInterval(timerId);
                onCaptureInterval();
                if (mouseHandler[mouseHandler.state + "End"]) {
                    mouseHandler[mouseHandler.state + "End"](e);
                }
                mouseHandler.state = "";
                if (renderer.$keepTextAreaAtCursor == null) {
                    renderer.$keepTextAreaAtCursor = true;
                    renderer.$moveTextAreaToCursor();
                }
                mouseHandler.isMousePressed = false;
                // mouseHandler.$onCaptureMouseMove = null;
                mouseHandler.releaseMouse = null;
                if (e) {
                    mouseHandler.onMouseEvent("mouseup", e);
                }
            };
        })(this);

        // this.$onCaptureMouseMove = onMouseMove;
        this.releaseMouse = capture(this.editor.container, onMouseMove, onCaptureEnd);
        timerId = window.setInterval(onCaptureInterval, 20);
    }

    cancelContextMenu(): void {
        const stop = (e: EditorMouseEvent) => {
            if (e && e.domEvent && e.domEvent.type !== "contextmenu") {
                return;
            }
            this.editor.off("nativecontextmenu", stop);
            if (e && e.domEvent) {
                stopEvent(e.domEvent);
            }
        };
        setTimeout(stop, 10);
        this.editor.on("nativecontextmenu", stop);
    }

    select() {
        const editor = this.editor;
        let cursor = editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);

        if (this.$clickSelection) {
            const cmp = comparePoint(this.$clickSelection, cursor);

            let anchor: Position;
            if (cmp === -1) {
                anchor = this.$clickSelection.end;
            }
            else if (cmp === 1) {
                anchor = this.$clickSelection.start;
            }
            else {
                const orientedRange = calcRangeOrientation(this.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            if (editor.selection) {
                editor.selection.setSelectionAnchor(anchor.row, anchor.column);
            }
        }
        if (editor.selection) {
            editor.selection.selectToPosition(cursor);
        }

        this.editor.renderer.scrollCursorIntoView();
    }

    selectByLinesEnd(): void {
        this.$clickSelection = null;
        this.editor.unsetStyle("ace_selecting");
        if (this.editor.renderer.scroller['releaseCapture']) {
            this.editor.renderer.scroller['releaseCapture']();
        }
    }

    startSelect(pos: Position, waitForClickSelection?: boolean): void {
        pos = pos || this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
        const editor = this.editor;
        // allow double/triple click handlers to change selection

        if (this.mousedownEvent.getShiftKey()) {
            if (editor.selection) {
                editor.selection.selectToPosition(pos);
            }
        }
        else if (!waitForClickSelection) {
            if (editor.selection) {
                editor.selection.moveToPosition(pos);
            }
        }

        if (!waitForClickSelection) {
            this.select();
        }

        if (editor.renderer.scroller['setCapture']) {
            editor.renderer.scroller['setCapture']();
        }
        editor.setStyle("ace_selecting");
        this.setState("select");
    }

    selectEnd() {
        this.selectByLinesEnd();
    }

    selectAllEnd() {
        this.selectByLinesEnd();
    }

    selectByWordsEnd() {
        this.selectByLinesEnd();
    }

    focusWait() {
        const distance = calcDistance(this.mousedownEvent.clientX, this.mousedownEvent.clientY, this.clientX, this.clientY);
        const time = Date.now();

        if (distance > DRAG_OFFSET || time - this.mousedownEvent.time > this.$focusTimout) {
            this.startSelect(this.mousedownEvent.getDocumentPosition());
        }
    }

}

/*
defOptions(MouseHandler.prototype, "mouseHandler", {
    scrollSpeed: { initialValue: 2 },
    dragDelay: { initialValue: (isMac ? 150 : 0) },
    dragEnabled: { initialValue: true },
    focusTimout: { initialValue: 0 },
    tooltipFollowsMouse: { initialValue: true }
});
*/

function makeMouseDownHandler(editor: Editor, mouseHandler: MouseHandler) {
    return function mousedown(ev: EditorMouseEvent): void {
        const inSelection = ev.inSelection();
        const pos = ev.getDocumentPosition();
        mouseHandler.mousedownEvent = ev;

        const button = ev.getButton();
        if (button !== 0) {
            const selectionRange = editor.getSelectionRange();
            const selectionEmpty = isEmpty(selectionRange);

            if (selectionEmpty || button === 1) {
                if (editor.selection) {
                    editor.selection.moveToPosition(pos);
                }
            }

            // 2: contextmenu, 1: linux paste
            if (button === 2) {
                editor.textInput.onContextMenu(ev.domEvent);
                if (!isMozilla) {
                    ev.preventDefault();
                }
            }
            // Stopping event here breaks contextmenu on ff mac.
            // Not stopping breaks it on chrome mac.
            return;
        }

        mouseHandler.mousedownEvent.time = Date.now();
        // if this click caused the editor to be focused,
        // should not clear the selection
        if (inSelection && !editor.isFocused()) {
            editor.focus();
            if (mouseHandler.$focusTimout && !mouseHandler.$clickSelection && !editor.inMultiSelectMode) {
                mouseHandler.setState("focusWait");
                mouseHandler.captureMouse(ev);
                return;
            }
        }

        mouseHandler.captureMouse(ev);
        // TODO: _clicks is a custom property added in event.ts by the 'mousedown' listener.
        mouseHandler.startSelect(pos, ev.domEvent['_clicks'] > 1);
        return ev.preventDefault();
    };
}

function makeMouseWheelHandler(editor: Editor, mouseHandler: MouseHandler) {
    return function (ev: EditorMouseEvent) {
        if (ev.getAccelKey()) {
            return;
        }

        // shift wheel to horiz scroll
        if (ev.getShiftKey() && ev.wheelY && !ev.wheelX) {
            ev.wheelX = ev.wheelY;
            ev.wheelY = 0;
        }

        const t = ev.domEvent.timeStamp;
        const dt = t - (mouseHandler.$lastScrollTime || 0);

        const isScrolable = editor.renderer.isScrollableBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed);
        if (isScrolable || dt < 200) {
            mouseHandler.$lastScrollTime = t;
            editor.renderer.scrollBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed);
            return ev.stop();
        }
    };
}

function makeDoubleClickHandler(editor: Editor, mouseHandler: MouseHandler) {
    return function (editorMouseEvent: EditorMouseEvent) {
        const pos = editorMouseEvent.getDocumentPosition();
        const session = editor.sessionOrThrow();

        let range = session.getBracketRange(pos);
        if (range) {
            if (isEmpty(range)) {
                range.start.column--;
                range.end.column++;
            }
            mouseHandler.setState("select");
        }
        else {
            if (editor.selection) {
                range = editor.selection.getWordRange(pos.row, pos.column);
            }
            mouseHandler.setState("selectByWords");
        }
        mouseHandler.$clickSelection = range;
        mouseHandler.select();
    };
}

function makeTripleClickHandler(editor: Editor, mouseHandler: MouseHandler) {
    return function (editorMouseEvent: EditorMouseEvent) {
        const pos = editorMouseEvent.getDocumentPosition();
        const selection = editor.selectionOrThrow();

        mouseHandler.setState("selectByLines");
        const range = editor.getSelectionRange();
        if (isMultiLine(range) && contains(range, pos.row, pos.column)) {
            mouseHandler.$clickSelection = selection.getLineRange(range.start.row);
            mouseHandler.$clickSelection.end = selection.getLineRange(range.end.row).end;
        }
        else {
            mouseHandler.$clickSelection = selection.getLineRange(pos.row);
        }
        mouseHandler.select();
    };
}

function makeQuadClickHandler(editor: Editor, mouseHandler: MouseHandler) {
    return function (editorMouseEvent: EditorMouseEvent) {
        editor.selectAll();
        mouseHandler.$clickSelection = editor.getSelectionRange();
        mouseHandler.setState("selectAll");
    };
}

function makeExtendSelectionBy(editor: Editor, mouseHandler: MouseHandler, unitName: 'getLineRange' | 'getWordRange') {
    return function () {
        let anchor: Position;
        let cursor = mouseHandler.textCoordinates();
        const selection = editor.selectionOrThrow();
        const row = cursor.row;
        const column = cursor.column;
        const range = unitName === 'getLineRange' ? selection.getLineRange(row, column !== 0) : selection.getWordRange(row, column);

        if (mouseHandler.$clickSelection) {
            const cmpStart = comparePoint(mouseHandler.$clickSelection, range.start);
            const cmpEnd = comparePoint(mouseHandler.$clickSelection, range.end);

            if (cmpStart === -1 && cmpEnd <= 0) {
                anchor = mouseHandler.$clickSelection.end;
                if (range.end.row !== cursor.row || range.end.column !== cursor.column)
                    cursor = range.start;
            }
            else if (cmpEnd === 1 && cmpStart >= 0) {
                anchor = mouseHandler.$clickSelection.start;
                if (range.start.row !== cursor.row || range.start.column !== cursor.column)
                    cursor = range.end;
            }
            else if (cmpStart === -1 && cmpEnd === 1) {
                cursor = range.end;
                anchor = range.start;
            }
            else {
                const orientedRange = calcRangeOrientation(mouseHandler.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        selection.selectToPosition(cursor);

        editor.renderer.scrollCursorIntoView();
    };
}

function calcDistance(ax: number, ay: number, bx: number, by: number): number {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

function calcRangeOrientation(range: RangeBasic, cursor: { row: number; column: number }): { cursor: { row: number; column: number }; anchor: { row: number; column: number } } {
    let cmp: number;
    if (range.start.row === range.end.row) {
        cmp = 2 * cursor.column - range.start.column - range.end.column;
    }
    else if (range.start.row === range.end.row - 1 && !range.start.column && !range.end.column) {
        cmp = cursor.column - 4;
    }
    else {
        cmp = 2 * cursor.row - range.start.row - range.end.row;
    }

    if (cmp < 0) {
        return { cursor: range.start, anchor: range.end };
    }
    else {
        return { cursor: range.end, anchor: range.start };
    }
}

class GutterHandler {
    constructor(mouseHandler: MouseHandler) {
        const editor: Editor = mouseHandler.editor;
        const renderer = editor.renderer;
        if (renderer) {
            const gutter: GutterLayer = editor.renderer.$gutterLayer;
            const tooltip = new GutterTooltip(editor.container);

            mouseHandler.editor.setDefaultHandler("guttermousedown", function (e: EditorMouseEvent) {
                if (!editor.isFocused() || e.getButton() !== 0) {
                    return;
                }

                const gutterRegion = gutter.getRegion(e);

                if (gutterRegion === "foldWidgets") {
                    return;
                }

                const row = e.getDocumentPosition().row;
                const selection = editor.selectionOrThrow();

                if (e.getShiftKey()) {
                    selection.selectTo(row, 0);
                }
                else {
                    if (e.domEvent.detail === 2) {
                        editor.selectAll();
                        return e.preventDefault();
                    }
                    mouseHandler.$clickSelection = selection.getLineRange(row);
                }
                mouseHandler.setState("selectByLines");
                mouseHandler.captureMouse(e);
                return e.preventDefault();
            });


            /**
             * The null value is used to indicate that there is no active timer scheduled.
             */
            let tooltipTimeout: number | null | undefined;
            let mouseEvent: EditorMouseEvent | null;
            let tooltipAnnotation: string | null;

            const hideTooltip = function (event: EditorChangeSessionEvent | undefined, editor: Editor) {
                if (tooltipTimeout) {
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = undefined;
                }
                if (tooltipAnnotation) {
                    tooltip.hide();
                    tooltipAnnotation = null;
                    editor.off("mousewheel", hideTooltip);
                }
            };

            const moveTooltip = function (event: EditorMouseEvent) {
                tooltip.setPosition(event.clientX, event.clientY);
            };

            const showTooltip = function () {
                if (mouseEvent) {
                    const session = editor.sessionOrThrow();
                    const row = mouseEvent.getDocumentPosition().row;
                    const annotation = gutter.$annotations[row];
                    if (!annotation) {
                        return hideTooltip(void 0, editor);
                    }

                    const maxRow = session.getLength();
                    if (row === maxRow) {
                        const screenRow = editor.renderer.pixelToScreenCoordinates(0, mouseEvent.clientY).row;
                        const pos = mouseEvent.getDocumentPosition();
                        if (screenRow > session.documentToScreenRow(pos.row, pos.column)) {
                            return hideTooltip(void 0, editor);
                        }
                    }

                    // TODO: Looks like the gutter annotation might also be a string?
                    // This cannot be the case.
                    // if (tooltipAnnotation === annotation) {
                    //     return;
                    // }

                    // TODO: The GutterLayer annotations are subtly different from Annotation
                    // in that the text property is a string[] rather than string.
                    tooltipAnnotation = annotation.text.join("<br/>");

                    tooltip.setHtml(tooltipAnnotation);

                    tooltip.show();

                    editor.on("mousewheel", hideTooltip);

                    if (mouseHandler.$tooltipFollowsMouse) {
                        moveTooltip(mouseEvent);
                    }
                    else {
                        const gutterElement = gutter.$cells[session.documentToScreenRow(row, 0)].element;
                        const rect = gutterElement.getBoundingClientRect();
                        const style = tooltip.getElement().style;
                        style.left = rect.right + "px";
                        style.top = rect.bottom + "px";
                    }
                }
            };

            mouseHandler.editor.setDefaultHandler("guttermousemove", function (e: EditorMouseEvent) {
                // FIXME: Obfuscating the type of target to thwart compiler.
                const target: any = e.domEvent.target || e.domEvent.srcElement;
                if (hasCssClass(target, "ace_fold-widget")) {
                    return hideTooltip(void 0, editor);
                }

                if (tooltipAnnotation && mouseHandler.$tooltipFollowsMouse) {
                    moveTooltip(e);
                }

                mouseEvent = e;
                if (tooltipTimeout) {
                    return;
                }
                tooltipTimeout = window.setTimeout(function () {
                    tooltipTimeout = null;
                    if (mouseEvent && !mouseHandler.isMousePressed)
                        showTooltip();
                    else
                        hideTooltip(void 0, editor);
                }, 50);
            });

            addListener(editor.renderer.$gutter, "mouseout", function (e: MouseEvent) {
                mouseEvent = null;
                if (!tooltipAnnotation || tooltipTimeout)
                    return;

                tooltipTimeout = window.setTimeout(function () {
                    tooltipTimeout = null;
                    hideTooltip(void 0, editor);
                }, 50);
            });

            editor.on("changeSession", hideTooltip);
        }
    }
}
