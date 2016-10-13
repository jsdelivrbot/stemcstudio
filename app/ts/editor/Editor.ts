import Anchor from "./Anchor";
import {mixin} from "./lib/oop";
import {computedStyle, hasCssClass} from "./lib/dom";
import createDelayedCall from './lib/lang/createDelayedCall';
import DelayedCall from './lib/lang/DelayedCall';
import Disposable from './base/Disposable';
import {stringRepeat} from "./lib/lang";
import {isIE, isMac, isMobile, isOldIE, isWebKit} from "./lib/useragent";
import GutterLayer from "./layer/GutterLayer";
import GutterTooltip from './GutterTooltip';
import KeyboardHandler from "./keyboard/KeyboardHandler";
import KeyBinding from "./keyboard/KeyBinding";
import TextInput from "./keyboard/TextInput";
import Delta from "./Delta";
import EditorAction from "./keyboard/EditorAction";
import EditSession from "./EditSession";
import Search from "./Search";
import {assembleRegExp} from './Search';
import FirstAndLast from "./FirstAndLast";
import LanguageMode from './LanguageMode';
import Position from "./Position";
import Range from "./Range";
import RangeList from './RangeList';
import TextAndSelection from "./TextAndSelection";
import EventBus from "./EventBus";
import EventEmitterClass from "./lib/EventEmitterClass";
import Command from "./commands/Command";
import CommandManager from "./commands/CommandManager";
import defaultCommands from "./commands/default_commands";
import TokenIterator from "./TokenIterator";
import {COMMAND_NAME_AUTO_COMPLETE} from './editor_protocol';
import {COMMAND_NAME_BACKSPACE} from './editor_protocol';
import {COMMAND_NAME_DEL} from './editor_protocol';
import {COMMAND_NAME_INSERT_STRING} from './editor_protocol';
import Renderer from './Renderer';
import Completer from "./autocomplete/Completer";
import CompletionManager from "./autocomplete/CompletionManager";
import SearchOptions from './SearchOptions';
import Selection from './Selection';
import SnippetManager from './SnippetManager';
import {addListener, addMouseWheelListener, addMultiMouseDownListener, capture, getButton, preventDefault, stopEvent, stopPropagation} from "./lib/event";
import {touchManager} from './touch/touch';
import TabstopManager from './TabstopManager';
import Tooltip from "./Tooltip";
import EditorChangeSessionEvent from './events/EditorChangeSessionEvent';
import SessionChangeEditorEvent from './events/SessionChangeEditorEvent';
import SessionChangeCursorEvent from './events/SessionChangeCursorEvent';
import AnchorChangeEvent from './events/AnchorChangeEvent';
import SelectionAddRangeEvent from './events/SelectionAddRangeEvent';
import SelectionRemoveRangeEvent from './events/SelectionRemoveRangeEvent';
import SelectionMultiSelectEvent from './events/SelectionMultiSelectEvent';
import SelectionSingleSelectEvent from './events/SelectionSingleSelectEvent';

const search = new Search();
const DRAG_OFFSET = 0; // pixels

function find(session: EditSession, needle: string | RegExp, dir: number): Range {
    search.$options.wrap = true;
    search.$options.needle = needle;
    search.$options.backwards = (dir === -1);
    return search.find(session);
}

// var DragdropHandler = require("./mouse/dragdrop_handler").DragdropHandler;

/**
 * The `Editor` acts as a controller, mediating between the editSession and renderer.
 *
 * @class Editor
 */
export default class Editor implements Disposable, EventBus<any, Editor> {

    /**
     *
     */
    public renderer: Renderer;

    /**
     *
     */
    public session: EditSession;

    /**
     * @property eventBus
     * @type EventEmitterClass
     * @private
     */
    private eventBus: EventEmitterClass<any, Editor>;

    private $mouseHandler: IGestureHandler;
    public $isFocused;

    /**
     * @property commands
     * @type CommandManager
     */
    public commands: CommandManager;

    /**
     * @property keyBinding
     * @type KeyBinding
     */
    public keyBinding: KeyBinding;

    /**
     * @property completers
     * @type Completer[]
     */
    public completers: Completer[] = [];

    /**
     * @property completionManager
     * @type {CompletionManager}
     */
    public completionManager: CompletionManager;

    public widgetManager;

    /**
     * The renderer container element.
     */
    public container: HTMLElement;
    public textInput: TextInput;
    public inMultiSelectMode: boolean;

    /**
     * @property multiSelect
     * @type Selection
     */
    public multiSelect: Selection;

    public inVirtualSelectionMode: boolean;
    public $blockSelectEnabled: boolean;

    private $cursorStyle: string;
    private $keybindingId;
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
    private $mergeUndoDeltas;
    public $readOnly = false;
    private $scrollAnchor: HTMLDivElement;
    /**
     * Used by SearchBox.
     */
    public $search: Search;
    private _$emitInputEvent: DelayedCall;

    /**
     * @property selections
     * @type Range[]
     * @private
     */
    private selections: Range[];

    /**
     *
     */
    private $selectionStyle: 'line' | 'text' = 'line';
    private $opResetTimer: DelayedCall;
    private curOp;
    private prevOp: { command?; args?};
    private lastFileJumpPos;
    private previousCommand;
    private $mergeableCommands: string[];
    private mergeNextCommand;
    private $mergeNextCommand;
    private sequenceStartTime: number;
    private $onDocumentChange;
    private $onChangeMode;
    private $onTokenizerUpdate;
    private $onChangeTabSize: (event, editSession: EditSession) => any;
    private $onChangeWrapLimit;
    private $onChangeWrapMode;
    private $onChangeFold;
    private $onChangeFrontMarker;
    private $onChangeBackMarker;
    private $onChangeBreakpoint;
    private $onChangeAnnotation;
    private $onCursorChange;
    private $onScrollTopChange;
    private $onScrollLeftChange;

    /**
     * 
     */
    private removeChangeSelectionHandler: () => void;

    /**
     * 
     */
    public exitMultiSelectMode: () => any;

    /**
     * @property snippetManager
     * @type SnippetManager
     */
    public snippetManager = new SnippetManager();
    public tabstopManager: TabstopManager;

    /**
     * Creates a new `Editor` object.
     *
     * @class Editor
     * @constructor
     * @param renderer {Renderer} The view.
     * @param session {EditSession} The model.
     */
    constructor(renderer: Renderer, session: EditSession) {
        this.eventBus = new EventEmitterClass<any, Editor>(this);
        this.curOp = null;
        this.prevOp = {};
        this.$mergeableCommands = [COMMAND_NAME_BACKSPACE, COMMAND_NAME_DEL, COMMAND_NAME_INSERT_STRING];
        this.commands = new CommandManager(isMac ? "mac" : "win", defaultCommands);
        this.container = renderer.getContainerElement();
        this.renderer = renderer;

        this.textInput = new TextInput(renderer.getTextAreaContainer(), this);
        this.renderer.textarea = this.textInput.getElement();
        this.keyBinding = new KeyBinding(this);

        this.$mouseHandler = new MouseHandler(this);

        new FoldHandler(this);

        this.$blockScrolling = 0;
        this.$search = new Search().set({ wrap: true });

        this.$historyTracker = this.$historyTracker.bind(this);
        this.commands.on("exec", this.$historyTracker);

        this.$initOperationListeners();

        this._$emitInputEvent = createDelayedCall(() => {
            this._signal("input", {});
            if (this.session.bgTokenizer) {
                this.session.bgTokenizer.scheduleStart();
            }
        });

        this.on("change", () => {
            this._$emitInputEvent.schedule(31);
        });

        this.on("changeSession", (e: EditorChangeSessionEvent, editor: Editor) => {

            var session = this.session;

            if (session && !session.multiSelect) {
                session.$selectionMarkers = [];
                session.selection.$initRangeList();
                session.multiSelect = session.selection;
            }
            this.multiSelect = session && session.multiSelect;

            const onAddRange = (event: SelectionAddRangeEvent, selection: Selection) => {
                this.addSelectionMarker(event.range);
                this.renderer.updateCursor();
                this.renderer.updateBackMarkers();
            };

            const onRemoveRange = (event: SelectionRemoveRangeEvent, selection: Selection) => {
                this.removeSelectionMarkers(event.ranges);
                this.renderer.updateCursor();
                this.renderer.updateBackMarkers();
            };

            let keyboardMultiSelect = new KeyboardHandler([{
                name: "singleSelection",
                bindKey: "esc",
                exec: function (editor: Editor) { editor.exitMultiSelectMode(); },
                scrollIntoView: "cursor",
                readOnly: true,
                isAvailable: function (editor: Editor) { return editor && editor.inMultiSelectMode; }
            }]);

            let onMultiSelect = (unused: SelectionMultiSelectEvent, selection: Selection) => {
                if (this.inMultiSelectMode) {
                    return;
                }
                this.inMultiSelectMode = true;

                this.setStyle("ace_multiselect");
                this.keyBinding.addKeyboardHandler(keyboardMultiSelect);
                this.commands.setDefaultHandler("exec", onMultiSelectExec);

                this.renderer.updateCursor();
                this.renderer.updateBackMarkers();
            };

            let onSingleSelect = (unused: SelectionSingleSelectEvent, selection: Selection) => {
                if (this.session.multiSelect.inVirtualMode) {
                    return;
                }
                this.inMultiSelectMode = false;

                this.unsetStyle("ace_multiselect");
                this.keyBinding.removeKeyboardHandler(keyboardMultiSelect);

                this.commands.removeDefaultHandler("exec", onMultiSelectExec);
                this.renderer.updateCursor();
                this.renderer.updateBackMarkers();
                this._emit("changeSelection");
            };

            let onMultiSelectExec = function (e: { command: Command, editor: Editor, args: any }) {
                var command: Command = e.command;
                var editor: Editor = e.editor;
                if (!editor.multiSelect)
                    return;
                if (!command.multiSelectAction) {
                    var result = command.exec(editor, e.args || {});
                    editor.multiSelect.addRange(editor.multiSelect.toOrientedRange());
                    editor.multiSelect.mergeOverlappingRanges();
                }
                else if (command.multiSelectAction === "forEach") {
                    result = editor.forEachSelection(command.exec, e.args);
                }
                else if (command.multiSelectAction === "forEachLine") {
                    result = editor.forEachSelection(command.exec, e.args, { $byLines: true });
                }
                else if (command.multiSelectAction === "single") {
                    editor.exitMultiSelectMode();
                    result = command.exec(editor, e.args || {});
                }
                else {
                    if (typeof command.multiSelectAction === 'function') {
                        // FIXME: Better if this was not a polymorphic type.
                        const action: EditorAction = <EditorAction>command.multiSelectAction;
                        result = action(editor, e.args || {});
                    }
                    else {
                        throw new TypeError("multiSelectAction");
                    }
                }
                return result;
            };

            let checkMultiselectChange = (unused: AnchorChangeEvent, anchor: Anchor) => {
                if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
                    const range = this.multiSelect.ranges[0];
                    if (this.multiSelect.isEmpty() && anchor === this.multiSelect.anchor)
                        return;
                    const pos = anchor === this.multiSelect.anchor
                        ? range.cursor === range.start ? range.end : range.start
                        : range.cursor;
                    if (pos.row !== anchor.row
                        || this.session.$clipPositionToDocument(pos.row, pos.column).column !== anchor.column)
                        this.multiSelect.toSingleRange(this.multiSelect.toOrientedRange());
                }
            };

            const oldSession = e.oldSession;
            if (oldSession) {
                oldSession.multiSelect.off("addRange", onAddRange);
                oldSession.multiSelect.off("removeRange", onRemoveRange);
                oldSession.multiSelect.off("multiSelect", onMultiSelect);
                oldSession.multiSelect.off("singleSelect", onSingleSelect);
                oldSession.multiSelect.lead.off("change", checkMultiselectChange);
                oldSession.multiSelect.anchor.off("change", checkMultiselectChange);
            }

            if (session) {
                session.multiSelect.on("addRange", onAddRange);
                session.multiSelect.on("removeRange", onRemoveRange);
                session.multiSelect.on("multiSelect", onMultiSelect);
                session.multiSelect.on("singleSelect", onSingleSelect);
                session.multiSelect.lead.on("change", checkMultiselectChange);
                session.multiSelect.anchor.on("change", checkMultiselectChange);
            }

            if (session && this.inMultiSelectMode !== session.selection.inMultiSelectMode) {
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

    /**
     * Cleans up the entire editor.
     */
    dispose(): void {
        this.renderer.dispose();
        if (this.session) {
            this.setSession(void 0);
        }
        /**
         * @event destroy
         * @param this {Editor}
         */
        this._signal("destroy", this);
    }

    /**
     * @method cancelMouseContextMenu
     * @return {void}
     */
    cancelMouseContextMenu(): void {
        this.$mouseHandler.cancelContextMenu();
    }

    /**
     *
     */
    get selection(): Selection {
        const session = this.session;
        if (session) {
            return session.getSelection();
        }
        else {
            return void 0;
        }
    }

    set selection(selection: Selection) {
        this.session.setSelection(selection);
    }

    /** 
     * Adds the selection and cursor.
     *
     * @method addSelectionMarker
     * @param {Range} orientedRange A range containing a cursor.
     * @returns {Range}
     */
    addSelectionMarker(orientedRange: Range): Range {
        if (!orientedRange.cursor) {
            orientedRange.cursor = orientedRange.end;
        }

        const style = this.getSelectionStyle();
        orientedRange.markerId = this.session.addMarker(orientedRange, "ace_selection", style);

        this.session.$selectionMarkers.push(orientedRange);
        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
        return orientedRange;
    }

    /**
     * @method removeSelectionMarkers
     * @param ranges {Range[]}
     * @return {void}
     */
    removeSelectionMarkers(ranges: Range[]): void {
        var markerList: Range[] = this.session.$selectionMarkers;
        for (var i = ranges.length; i--;) {
            var range: Range = ranges[i];
            if (!range.markerId) {
                continue;
            }
            this.session.removeMarker(range.markerId);
            var index = markerList.indexOf(range);
            if (index !== -1) {
                markerList.splice(index, 1);
            }
        }
        this.session.selectionMarkerCount = markerList.length;
    }

    /** 
     * Executes a command for each selection range.
     *
     * @method forEachSelection
     * @param action {EditorAction} The action to execute.
     * @param {String} args Any arguments for the command.
     * @param [options]
     * @return {any}
     */
    forEachSelection(action: EditorAction, args, options?: { keepOrder?: boolean; $byLines?: boolean }): any {

        if (this.inVirtualSelectionMode) {
            return;
        }

        var keepOrder: boolean = options && options.keepOrder;
        var $byLines: boolean = options && options.$byLines;
        var session: EditSession = this.session;
        var selection: Selection = this.selection;
        var rangeList: RangeList = selection.rangeList;
        var ranges = (keepOrder ? selection.ranges : rangeList.ranges);
        var result;

        if (!ranges.length) {
            return action(this, args || {});
        }

        var reg = selection._eventRegistry;
        selection._eventRegistry = {};

        var tmpSel = new Selection(session);
        this.inVirtualSelectionMode = true;
        for (var i = ranges.length; i--;) {
            if ($byLines) {
                while (i > 0 && ranges[i].start.row === ranges[i - 1].end.row)
                    i--;
            }
            tmpSel.fromOrientedRange(ranges[i]);
            tmpSel.index = i;
            this.selection = session.selection = tmpSel;
            var actionResult = action(this, args || {});
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

        var anim = this.renderer.$scrollAnimation;
        this.onCursorChange(void 0, this.session);
        this.onSelectionChange(void 0, this.selection);
        if (anim && anim.from === anim.to) {
            this.renderer.animateScrolling(anim.from);
        }

        // FIXME: Who cares and why don't we return an array?
        return result;
    }

    /**
     * Adds a cursor above or below the active cursor.
     * 
     * @method selectMoreLines 
     * @param dir {number} The direction of lines to select: -1 for up, 1 for down
     * @param [skip] {boolean} If `true`, removes the active selection range.
     * @return {void}
     */
    selectMoreLines(dir: number, skip?: boolean): void {
        var range: Range = this.selection.toOrientedRange();
        var isBackwards = range.cursor === range.end;

        var screenLead: Position = this.session.documentToScreenPosition(range.cursor.row, range.cursor.column);
        if (this.selection.$desiredColumn)
            screenLead.column = this.selection.$desiredColumn;

        var lead = this.session.screenToDocumentPosition(screenLead.row + dir, screenLead.column);

        var anchor: Position;
        if (!range.isEmpty()) {
            var row = isBackwards ? range.end.row : range.start.row;
            var column = isBackwards ? range.end.column : range.start.column;
            var screenAnchor: Position = this.session.documentToScreenPosition(row, column);
            anchor = this.session.screenToDocumentPosition(screenAnchor.row + dir, screenAnchor.column);
        }
        else {
            anchor = lead;
        }

        var newRange: Range;
        if (isBackwards) {
            newRange = Range.fromPoints(lead, anchor);
            newRange.cursor = newRange.start;
        }
        else {
            newRange = Range.fromPoints(anchor, lead);
            newRange.cursor = newRange.end;
        }

        newRange.desiredColumn = screenLead.column;
        if (!this.selection.inMultiSelectMode) {
            this.selection.addRange(range);
        }
        else {
            if (skip) {
                var toRemove: Position = range.cursor;
            }
        }

        this.selection.addRange(newRange);
        if (toRemove) {
            // FIXME: substract really?
            this.selection.substractPoint(toRemove);
        }
    }

    /** 
     * Finds the next occurence of text in an active selection and adds it to the selections.
     *
     * @method selectMore
     * @param dir {number} The direction of lines to select: -1 for up, 1 for down
     * @param [skip] {boolean} If `true`, removes the active selection range.
     * @param [stopAtFirst] {boolean}
     * @return {void}
     */
    selectMore(dir: number, skip?: boolean, stopAtFirst?: boolean): void {
        const session = this.session;
        const sel = session.multiSelect;

        let range = sel.toOrientedRange();
        if (range.isEmpty()) {
            range = session.getWordRange(range.start.row, range.start.column);
            range.cursor = dir === -1 ? range.start : range.end;
            this.multiSelect.addRange(range);
            if (stopAtFirst)
                return;
        }

        const needle = session.getTextRange(range);

        const newRange = find(session, needle, dir);
        if (newRange) {
            newRange.cursor = (dir === -1) ? newRange.start : newRange.end;
            this.$blockScrolling += 1;
            try {
                this.session.unfold(newRange);
                this.multiSelect.addRange(newRange);
            }
            finally {
                this.$blockScrolling -= 1;
            }
            this.renderer.scrollCursorIntoView(null, 0.5);
        }
        if (skip) {
            this.multiSelect.substractPoint(range.cursor);
        }
    }

    /** 
     * Aligns the cursors or selected text.
     *
     * @method alignCursors
     * @return {void}
     */
    alignCursors(): void {
        var session = this.session;
        var sel = session.multiSelect;
        var ranges = sel.ranges;
        // filter out ranges on same row
        var row = -1;
        var sameRowRanges = ranges.filter(function (r) {
            if (r.cursor.row === row)
                return true;
            row = r.cursor.row;
        });

        if (!ranges.length || sameRowRanges.length === ranges.length - 1) {
            var range = this.selection.getRange();
            var fr = range.start.row, lr = range.end.row;
            var guessRange = (fr === lr);
            if (guessRange) {
                var max = this.session.getLength();
                var line;
                do {
                    line = this.session.getLine(lr);
                } while (/[=:]/.test(line) && ++lr < max);
                do {
                    line = this.session.getLine(fr);
                } while (/[=:]/.test(line) && --fr > 0);

                if (fr < 0) fr = 0;
                if (lr >= max) lr = max - 1;
            }
            var lines = this.session.removeFullLines(fr, lr);
            lines = this.$reAlignText(lines, guessRange);
            this.session.insert({ row: fr, column: 0 }, lines.join("\n") + "\n");
            if (!guessRange) {
                range.start.column = 0;
                range.end.column = lines[lines.length - 1].length;
            }
            this.selection.setRange(range);
        }
        else {
            sameRowRanges.forEach(function (r: Range) {
                sel.substractPoint(r.cursor);
            });

            var maxCol = 0;
            var minSpace = Infinity;
            var spaceOffsets = ranges.map(function (r) {
                var p = r.cursor;
                var line = session.getLine(p.row);
                var spaceOffset = line.substr(p.column).search(/\S/g);
                if (spaceOffset === -1)
                    spaceOffset = 0;

                if (p.column > maxCol)
                    maxCol = p.column;
                if (spaceOffset < minSpace)
                    minSpace = spaceOffset;
                return spaceOffset;
            });
            ranges.forEach(function (r, i) {
                var p = r.cursor;
                var l = maxCol - p.column;
                var d = spaceOffsets[i] - minSpace;
                if (l > d)
                    session.insert(p, stringRepeat(" ", l - d));
                else
                    session.remove(new Range(p.row, p.column, p.row, p.column - l + d));

                r.start.column = r.end.column = maxCol;
                r.start.row = r.end.row = p.row;
                r.cursor = r.end;
            });
            sel.fromOrientedRange(ranges[0]);
            this.renderer.updateCursor();
            this.renderer.updateBackMarkers();
        }
    }

    /**
     * @method $reAlignText
     * @param lines {string[]}
     * @param forceLeft {boolean}
     * @return {string[]}
     * @private
     */
    private $reAlignText(lines: string[], forceLeft: boolean): string[] {
        var isLeftAligned = true;
        var isRightAligned = true;
        var startW: number;
        var textW: number;
        var endW: number;

        return lines.map(function (line) {
            var m = line.match(/(\s*)(.*?)(\s*)([=:].*)/);
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
     * @method $initOperationListeners
     * @return {void}
     * @private
     */
    private $initOperationListeners(): void {

        function last<T>(a: T[]): T { return a[a.length - 1]; }

        this.selections = [];
        this.commands.on("exec", (e: { command: Command }) => {
            this.startOperation(e);

            var command = e.command;
            if (command.aceCommandGroup === "fileJump") {
                var prev = this.prevOp;
                if (!prev || prev.command.aceCommandGroup !== "fileJump") {
                    this.lastFileJumpPos = last(this.selections);
                }
            } else {
                this.lastFileJumpPos = null;
            }
        }, true);

        this.commands.on("afterExec", (e: { command: Command }, cm: CommandManager) => {
            var command = e.command;

            if (command.aceCommandGroup === "fileJump") {
                if (this.lastFileJumpPos && !this.curOp.selectionChanged) {
                    this.selection.fromJSON(this.lastFileJumpPos);
                }
            }
            this.endOperation(e);
        }, true);

        this.$opResetTimer = createDelayedCall(this.endOperation.bind(this));

        this.eventBus.on("change", () => {
            this.curOp || this.startOperation();
            this.curOp.docChanged = true;
        }, true);

        this.eventBus.on("changeSelection", () => {
            this.curOp || this.startOperation();
            this.curOp.selectionChanged = true;
        }, true);
    }

    /**
     * @method startOperation
     * @param [commandEvent]
     * @return {void}
     * @private
     */
    private startOperation(commandEvent?): void {
        if (this.curOp) {
            if (!commandEvent || this.curOp.command)
                return;
            this.prevOp = this.curOp;
        }
        if (!commandEvent) {
            this.previousCommand = null;
            commandEvent = {};
        }

        this.$opResetTimer.schedule();
        this.curOp = {
            command: commandEvent.command || {},
            args: commandEvent.args,
            scrollTop: this.renderer.scrollTop
        };

        var command = this.curOp.command;
        if (command && command.scrollIntoView) {
            this.$blockScrolling++;
        }

        this.selection.toJSON().forEach((range: Range) => {
            this.selections.push(range);
        });
    }

    // FIXME: This probably doesn't require the argument
    /**
     * @method endOperation
     * @param [unused]
     * @rerurn {void}
     * @private
     */
    private endOperation(unused?: any): void {
        if (this.curOp) {
            var command = this.curOp.command;
            if (command && command.scrollIntoView) {
                this.$blockScrolling--;
                switch (command.scrollIntoView) {
                    case "center":
                        this.renderer.scrollCursorIntoView(null, 0.5);
                        break;
                    case "animate":
                    case "cursor":
                        this.renderer.scrollCursorIntoView();
                        break;
                    case "selectionPart":
                        var range = this.selection.getRange();
                        var config = this.renderer.layerConfig;
                        if (range.start.row >= config.lastRow || range.end.row <= config.firstRow) {
                            this.renderer.scrollSelectionIntoView(this.selection.anchor, this.selection.lead);
                        }
                        break;
                    default:
                        break;
                }
                if (command.scrollIntoView === "animate")
                    this.renderer.animateScrolling(this.curOp.scrollTop);
            }

            this.prevOp = this.curOp;
            this.curOp = null;
        }
    }

    /**
     * @method $historyTracker
     * @param e
     * @return {void}
     * @private
     */
    private $historyTracker(e: { command: Command; args }): void {
        if (!this.$mergeUndoDeltas)
            return;

        var prev = this.prevOp;
        var mergeableCommands = this.$mergeableCommands;
        // previous command was the same
        var shouldMerge = prev.command && (e.command.name === prev.command.name);
        if (e.command.name === COMMAND_NAME_INSERT_STRING) {
            var text = e.args;
            if (this.mergeNextCommand === undefined)
                this.mergeNextCommand = true;

            shouldMerge = shouldMerge
                && this.mergeNextCommand // previous command allows to coalesce with
                && (!/\s/.test(text) || /\s/.test(prev.args)); // previous insertion was of same type

            this.mergeNextCommand = true;
        }
        else {
            shouldMerge = shouldMerge
                && mergeableCommands.indexOf(e.command.name) !== -1; // the command is mergeable
        }

        if (
            this.$mergeUndoDeltas !== "always"
            && Date.now() - this.sequenceStartTime > 2000
        ) {
            shouldMerge = false; // the sequence is too long
        }

        if (shouldMerge)
            this.session.mergeUndoDeltas = true;
        else if (mergeableCommands.indexOf(e.command.name) !== -1)
            this.sequenceStartTime = Date.now();
    }

    /**
     * Sets a new key handler, such as "vim" or "windows".
     *
     * @param keyboardHandler The new key handler.
     */
    setKeyboardHandler(keyboardHandler: KeyboardHandler): void {
        if (!keyboardHandler) {
            this.keyBinding.setKeyboardHandler(null);
        }
        else {
            this.$keybindingId = null;
            this.keyBinding.setKeyboardHandler(keyboardHandler);
        }
    }

    /**
     * Returns the keyboard handler, such as "vim" or "windows".
     *
     * @method getKeyboardHandler
     * @return {KeyboardHandler}
     */
    getKeyboardHandler(): KeyboardHandler {
        return this.keyBinding.getKeyboardHandler();
    }

    /**
     * Sets the EditSession to use.
     * This method also emits the `'changeSession'` event.
     *
     * @param session The new session to use.
     */
    setSession(session: EditSession): void {
        if (this.session === session) {
            return;
        }

        const oldSession = this.session;
        if (oldSession) {
            this.session.off("change", this.$onDocumentChange);
            this.session.off("changeMode", this.$onChangeMode);
            this.session.off("tokenizerUpdate", this.$onTokenizerUpdate);
            this.session.off("changeTabSize", this.$onChangeTabSize);
            this.session.off("changeWrapLimit", this.$onChangeWrapLimit);
            this.session.off("changeWrapMode", this.$onChangeWrapMode);
            this.session.off("onChangeFold", this.$onChangeFold);
            this.session.off("changeFrontMarker", this.$onChangeFrontMarker);
            this.session.off("changeBackMarker", this.$onChangeBackMarker);
            this.session.off("changeBreakpoint", this.$onChangeBreakpoint);
            this.session.off("changeAnnotation", this.$onChangeAnnotation);
            this.session.off("changeOverwrite", this.$onCursorChange);
            this.session.off("changeScrollTop", this.$onScrollTopChange);
            this.session.off("changeScrollLeft", this.$onScrollLeftChange);

            var selection = this.session.getSelection();
            selection.off("changeCursor", this.$onCursorChange);

            if (this.removeChangeSelectionHandler) {
                this.removeChangeSelectionHandler();
                this.removeChangeSelectionHandler = void 0;
            }
        }

        this.session = session;
        if (session) {
            this.$onDocumentChange = this.onDocumentChange.bind(this);
            session.on("change", this.$onDocumentChange);
            this.renderer.setSession(session);

            this.$onChangeMode = this.onChangeMode.bind(this);
            session.on("changeMode", this.$onChangeMode);

            this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
            session.on("tokenizerUpdate", this.$onTokenizerUpdate);

            this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(this.renderer);
            session.on("changeTabSize", this.$onChangeTabSize);

            this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
            session.on("changeWrapLimit", this.$onChangeWrapLimit);

            this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
            session.on("changeWrapMode", this.$onChangeWrapMode);

            this.$onChangeFold = this.onChangeFold.bind(this);
            session.on("changeFold", this.$onChangeFold);

            this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(this);
            session.on("changeFrontMarker", this.$onChangeFrontMarker);

            this.$onChangeBackMarker = this.onChangeBackMarker.bind(this);
            session.on("changeBackMarker", this.$onChangeBackMarker);

            this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
            session.on("changeBreakpoint", this.$onChangeBreakpoint);

            this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
            session.on("changeAnnotation", this.$onChangeAnnotation);

            this.$onCursorChange = this.onCursorChange.bind(this);
            session.on("changeOverwrite", this.$onCursorChange);

            this.$onScrollTopChange = this.onScrollTopChange.bind(this);
            session.on("changeScrollTop", this.$onScrollTopChange);

            this.$onScrollLeftChange = this.onScrollLeftChange.bind(this);
            session.on("changeScrollLeft", this.$onScrollLeftChange);

            this.selection = session.getSelection();
            this.selection.on("changeCursor", this.$onCursorChange);

            const onSelectionChange = (unused: any, selection: Selection) => {
                this.onSelectionChange(unused, selection)
            }
            this.removeChangeSelectionHandler = this.selection.on("changeSelection", onSelectionChange);

            this.onChangeMode(void 0, this.session);

            this.$blockScrolling += 1;
            try {
                this.onCursorChange(void 0, this.session);
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
            session.getUseWrapMode() && this.renderer.adjustWrapLimit();
            this.renderer.updateFull();
        }

        const changeSessionEvent: EditorChangeSessionEvent = { session: session, oldSession: oldSession };
        this.eventBus._signal("changeSession", changeSessionEvent);

        if (oldSession) {
            let changeEditorEvent: SessionChangeEditorEvent = { oldEditor: this };
            oldSession._signal("changeEditor", changeEditorEvent);
            oldSession.release();
        }

        if (session) {
            let changeEditorEvent: SessionChangeEditorEvent = { editor: this };
            session._signal("changeEditor", changeEditorEvent);
            session.addRef();
        }
    }

    /**
     * Returns the current session being used.
     */
    getSession(): EditSession {
        return this.session;
    }

    /**
     * Determines whether this editor has an EditSession.
     */
    hasSession(): boolean {
        return this.session ? true : false;
    }

    /**
     * @method setPadding
     * @param padding {number}
     * @return {void}
     */
    setPadding(padding: number): void {
        return this.renderer.setPadding(padding);
    }

    /**
     * @method setThemeCss
     * @param themeId {string}
     * @param [href] {string}
     * @return {void}
     */
    setThemeCss(themeId: string, href?: string): void {
        return this.renderer.setThemeCss(themeId, href);
    }

    /**
     * @method setThemeDark
     * @param isDark {boolean}
     * @return {void}
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
     *
     * @method getValue
     * @return {string}
     */
    getValue(): string {
        return this.session.getValue();
    }

    /**
     * Returns the currently highlighted selection.
     *
     * @method getSelection
     * @return {Selection} The highlighted selection
     */
    getSelection(): Selection {
        return this.selection;
    }

    /**
     * @method resize
     * @param [force] {boolean} force If `true`, recomputes the size, even if the height and width haven't changed.
     * @return {void}
     */
    resize(force?: boolean): void {
        this.renderer.onResize(force);
    }

    /**
     * @method getTheme
     * @return {string} The set theme
     */
    getTheme(): string {
        return this.renderer.getTheme();
    }

    /**
     * @method setStyle
     * @param style {string} A class name
     * @return {void}
     */
    setStyle(style: string): void {
        this.renderer.setStyle(style);
    }

    /**
     * @method unsetStyle
     * @param style {string}
     * @return {void}
     */
    unsetStyle(style: string): void {
        this.renderer.unsetStyle(style);
    }

    /**
     * Gets the current font size of the editor text.
     */
    getFontSize(): string {
        return this.renderer.getFontSize() || computedStyle(this.container, "fontSize").fontSize;
    }

    /**
     * Set a new font size (in pixels) for the editor text.
     *
     * @param fontSize A font size, e.g. "12px")
     */
    setFontSize(fontSize: string): void {
        this.renderer.setFontSize(fontSize);
    }

    /**
     * @method insertSnippet
     * @param content {string}
     * @param [options]
     * @return {void}
     */
    insertSnippet(content: string, options?: any): void {
        return this.snippetManager.insertSnippet(this, content, options);
    }

    /**
     * @method expandSnippet
     * @param [options]
     * @return {boolean}
     */
    expandSnippet(options?: any): boolean {
        return this.snippetManager.expandWithTab(this, options);
    }

    /**
     * @method $highlightBrackets
     * @return {void}
     * @private
     */
    private $highlightBrackets(): void {
        if (this.session.$bracketHighlight) {
            this.session.removeMarker(this.session.$bracketHighlight);
            this.session.$bracketHighlight = void 0;
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
            if (this.session) {
                const pos = this.session.findMatchingBracket(this.getCursorPosition());
                let range: Range;
                if (pos) {
                    range = new Range(pos.row, pos.column, pos.row, pos.column + 1);
                }
                else if (this.session.$mode && this.session.$mode.getMatching) {
                    range = this.session.$mode.getMatching(this.session);
                }
                if (range) {
                    this.session.$bracketHighlight = this.session.addMarker(range, "ace_bracket", "text");
                }
            }
        }, 50);
    }

    /**
     * @method $highlightTags
     * @return {void}
     * @private
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
                session.removeMarker(session.$tagHighlight);
                session.$tagHighlight = null;
                return;
            }

            const tag = token.value;
            let depth = 0;
            let prevToken = iterator.stepBackward();

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

                    if (token && token.value === tag && token.type.indexOf('tag-name') !== -1) {
                        if (prevToken.value === '<') {
                            depth++;
                        }
                        else if (prevToken.value === '</') {
                            depth--;
                        }
                    }
                } while (prevToken && depth <= 0);

                // Select tag again.
                iterator.stepForward();
            }

            if (!token) {
                session.removeMarker(session.$tagHighlight);
                session.$tagHighlight = null;
                return;
            }

            const row = iterator.getCurrentTokenRow();
            const column = iterator.getCurrentTokenColumn();
            const range = new Range(row, column, row, column + token.value.length);

            // Remove range if different.
            if (session.$tagHighlight && range.compareRange(session.$backMarkers[session.$tagHighlight].range) !== 0) {
                session.removeMarker(session.$tagHighlight);
                session.$tagHighlight = null;
            }

            if (range && !session.$tagHighlight)
                session.$tagHighlight = session.addMarker(range, "ace_bracket", "text");
        }, 50);
    }

    /**
     * Brings the current `textInput` into focus.
     *
     * @method focus
     * @return {void}
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
     *
     * @method isFocused
     * @return {boolean}
     */
    isFocused(): boolean {
        return this.textInput.isFocused();
    }

    /**
     * Blurs the current `textInput`.
     *
     * @method blur
     * @return {void}
     */
    blur(): void {
        this.textInput.blur();
    }

    /**
     * Emitted once the editor comes into focus.
     *
     * @method onFocus
     * @return {void}
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
     * @method onBlur
     * @return {void}
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
     *
     * @method $cursorChange
     * @return {void}
     * @private
     */
    private $cursorChange(): void {
        this.renderer.updateCursor();
    }

    /**
     * Emitted whenever the document is changed.
     *
     * @method onDocumentChange
     * @param delta {Delta}
     * @param session {EditSession}
     * @return {void}
     * @private
     */
    private onDocumentChange(delta: Delta, session: EditSession): void {
        // Rerender and emit "change" event.
        const wrap = this.session.$useWrapMode;
        const lastRow = (delta.start.row === delta.end.row ? delta.end.row : Infinity);
        this.renderer.updateLines(delta.start.row, lastRow, wrap);

        /**
         * @event change
         * @param delta {Delta}
         */
        this.eventBus._signal("change", delta);

        // update cursor because tab characters can influence the cursor position
        this.$cursorChange();
        this.$updateHighlightActiveLine();
    }

    private onTokenizerUpdate(event: { data: FirstAndLast }, session: EditSession) {
        const {first, last} = event.data;
        this.renderer.updateLines(first, last);
    }


    private onScrollTopChange(event, session: EditSession) {
        this.renderer.scrollToY(session.getScrollTop());
    }

    private onScrollLeftChange(event, session: EditSession) {
        this.renderer.scrollToX(session.getScrollLeft());
    }

    /**
     * Handler for cursor or selection changes.
     * 
     * @method onCursorChange
     * @param event {SessionChangeCursorEvent}
     * @param session {EditSession}
     * @return {void}
     * @private
     */
    private onCursorChange(event: SessionChangeCursorEvent, session: EditSession): void {

        this.$cursorChange();

        if (this.$blockScrolling === 0) {
            this.renderer.scrollCursorIntoView();
        }

        this.$highlightBrackets();
        this.$highlightTags();
        this.$updateHighlightActiveLine();
        // TODO; How is signal different from emit?
        /**
         * @event changeSelection
         */
        this.eventBus._signal("changeSelection");
    }

    /**
     * @method $updateHighlightActiveLine
     * @return {void}
     */
    public $updateHighlightActiveLine(): void {

        const session = this.session;
        const renderer = this.renderer;

        let highlight: Position;
        if (this.$highlightActiveLine) {
            if ((this.$selectionStyle !== "line" || !this.selection.isMultiLine())) {
                highlight = this.getCursorPosition();
            }
            if (renderer.$maxLines && session.getLength() === 1 && !(renderer.$minLines > 1)) {
                // FiXME: This just makes life more difficult, with stupid casting.
                highlight = <any>false;
            }
        }

        if (session.$highlightLineMarker && !highlight) {
            session.removeMarker(session.$highlightLineMarker.markerId);
            session.$highlightLineMarker = null;
        }
        else if (!session.$highlightLineMarker && highlight) {
            const range: Range = new Range(highlight.row, highlight.column, highlight.row, Infinity);
            range.markerId = session.addMarker(range, "ace_active-line", "screenLine");
            session.$highlightLineMarker = range;
        }
        else if (highlight) {
            session.$highlightLineMarker.start.row = highlight.row;
            session.$highlightLineMarker.end.row = highlight.row;
            session.$highlightLineMarker.start.column = highlight.column;
            session._signal("changeBackMarker");
        }
    }

    /**
     * @method onSelectionChange
     * @param unused
     * @param selection {Selection}
     * @return {void}
     * @private
     */
    private onSelectionChange(unused, selection: Selection): void {

        var session = this.session;

        if (typeof session.$selectionMarker === 'number') {
            session.removeMarker(session.$selectionMarker);
            session.$selectionMarker = null;
        }

        if (!this.selection.isEmpty()) {
            var range = this.selection.getRange();
            var style = this.getSelectionStyle();
            session.$selectionMarker = session.addMarker(range, "ace_selection", style);
        }
        else {
            this.$updateHighlightActiveLine();
        }

        var re: RegExp = this.$highlightSelectedWord && this.$getSelectionHighLightRegexp();
        this.session.highlight(re);

        this.eventBus._signal("changeSelection");
    }

    private $getSelectionHighLightRegexp(): RegExp {
        var session = this.session;

        var selection = this.getSelectionRange();
        if (selection.isEmpty() || selection.isMultiLine())
            return;

        var startOuter = selection.start.column - 1;
        var endOuter = selection.end.column + 1;
        var line = session.getLine(selection.start.row);
        var lineCols = line.length;
        var needle = line.substring(Math.max(startOuter, 0),
            Math.min(endOuter, lineCols));

        // Make sure the outer characters are not part of the word.
        if ((startOuter >= 0 && /^[\w\d]/.test(needle)) ||
            (endOuter <= lineCols && /[\w\d]$/.test(needle)))
            return;

        needle = line.substring(selection.start.column, selection.end.column);
        if (!/^[\w\d]+$/.test(needle))
            return;

        // When the needle is a string, the return type will be a RegExp.
        // TODO: Split out this functionality for cleaner type safety.
        const re = <RegExp>assembleRegExp({ wholeWord: true, caseSensitive: true, needle: needle });

        return re;
    }

    /**
     * @method onChangeFrontMarker
     * @param event
     * @param session {EditSession}
     * @return {void}
     * @private
     */
    private onChangeFrontMarker(event, session: EditSession): void {
        this.renderer.updateFrontMarkers();
    }

    /**
     * @method onChangeBackMarker
     * @param event
     * @param session {EditSession}
     * @return {void}
     * @private
     */
    private onChangeBackMarker(event, session: EditSession): void {
        this.renderer.updateBackMarkers();
    }

    private onChangeBreakpoint(event, editSession: EditSession) {
        this.renderer.updateBreakpoints();
        /**
         * @event changeBreakpoint
         */
        this.eventBus._emit("changeBreakpoint", event);
    }

    private onChangeAnnotation(event, session: EditSession) {
        this.renderer.setAnnotations(session.getAnnotations());
        /**
         * @event changeAnnotation
         */
        this.eventBus._emit("changeAnnotation", event);
    }


    private onChangeMode(event, session: EditSession) {

        this.renderer.updateText();

        /**
         * @event changeMode
         */
        this.eventBus._emit("changeMode", event);
    }


    private onChangeWrapLimit(event, session: EditSession) {
        this.renderer.updateFull();
    }

    private onChangeWrapMode(event, session: EditSession) {
        this.renderer.onResize(true);
    }


    private onChangeFold(event, session: EditSession) {
        // Update the active line marker as due to folding changes the current
        // line range on the screen might have changed.
        this.$updateHighlightActiveLine();
        // TODO: This might be too much updating. Okay for now.
        this.renderer.updateFull();
    }

    /**
     * Returns the string of text currently highlighted.
     *
     * @method getSelectedText
     * @return {string}
     */
    getSelectedText(): string {
        return this.session.getTextRange(this.getSelectionRange());
    }

    /**
     * Called whenever a text "copy" happens.
     *
     * @method onCopy
     * @return {void} 
     */
    public onCopy(): void {
        const copyCommand = this.commands.getCommandByName("copy");
        if (copyCommand) {
            this.commands.exec(copyCommand, this);
        }
    }

    /**
     * Called whenever a text "cut" happens.
     *
     * @method onCut
     * @return {void}
     */
    public onCut(): void {
        const cutCommand = this.commands.getCommandByName("cut");
        if (cutCommand) {
            this.commands.exec(cutCommand, this);
        }
    }

    /**
     * Called whenever a text "paste" happens.
     *
     * @method onPaste
     * @param text {string} The pasted text
     * @return {void}
     */
    onPaste(text: string): void {
        // todo this should change when paste becomes a command
        if (this.$readOnly)
            return;
        var e = { text: text };
        /**
         * @event paste
         */
        this.eventBus._signal("paste", e);
        this.insert(e.text, true);
    }

    /**
     * @method execCommand
     * @param command {Command}
     * @param [args] {any}
     * @return {void}
     */
    execCommand(command: Command, args?: any): void {
        this.commands.exec(command, this, args);
    }

    /**
     * Inserts `text` into wherever the cursor is pointing.
     *
     * @method insert
     * @param text {string} The new text to add.
     * @param [pasted] {boolean}
     * @return {void}
     */
    insert(text: string, pasted?: boolean): void {

        var session = this.session;
        var mode = session.getMode();
        var cursor: Position = this.getCursorPosition();
        var transform: TextAndSelection;

        if (this.getBehavioursEnabled() && !pasted) {
            // Get a transform if the current mode wants one.
            transform = mode && <TextAndSelection>mode.transformAction(session.getState(cursor.row), 'insertion', this, session, text);
            if (transform) {
                if (text !== transform.text) {
                    this.session.mergeUndoDeltas = false;
                    this.$mergeNextCommand = false;
                }
                text = transform.text;
            }
        }

        if (text === "\t") {
            text = this.session.getTabString();
        }

        // Remove selected text.
        if (!this.selection.isEmpty()) {
            var range = this.getSelectionRange();
            cursor = this.session.remove(range);
            this.clearSelection();
        }
        else if (this.session.getOverwrite()) {
            var range = Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            this.session.remove(range);
        }

        if (text === "\n" || text === "\r\n") {
            var line = session.getLine(cursor.row);
            if (cursor.column > line.search(/\S|$/)) {
                var d = line.substr(cursor.column).search(/\S|$/);
                session.doc.removeInLine(cursor.row, cursor.column, cursor.column + d);
            }
        }

        this.clearSelection();

        var start = cursor.column;
        var lineState = session.getState(cursor.row);
        var line = session.getLine(cursor.row);
        var shouldOutdent = mode.checkOutdent(lineState, line, text);
        var end = session.insert(cursor, text);

        if (transform && transform.selection) {
            if (transform.selection.length === 2) { // Transform relative to the current column
                this.selection.setSelectionRange(
                    new Range(cursor.row, start + transform.selection[0],
                        cursor.row, start + transform.selection[1]));
            }
            else { // Transform relative to the current row.
                this.selection.setSelectionRange(
                    new Range(cursor.row + transform.selection[0],
                        transform.selection[1],
                        cursor.row + transform.selection[2],
                        transform.selection[3]));
            }
        }

        if (session.getDocument().isNewLine(text)) {
            var lineIndent = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());
            session.insert({ row: cursor.row + 1, column: 0 }, lineIndent);
        }

        if (shouldOutdent) {
            mode.autoOutdent(lineState, session, cursor.row);
        }
    }

    /**
     * @param eventName
     * @param callback
     * @param capturing
     */
    on(eventName: string, callback: (data: any, editor: Editor) => any, capturing?: boolean) {
        this.eventBus.on(eventName, callback, capturing);
        return () => {
            this.off(eventName, callback, capturing);
        }
    }

    /**
     * @method off
     * @param eventName {string}
     * @param callback
     * @return {void}
     */
    off(eventName: string, callback: (data: any, source: Editor) => any, capturing?: boolean): void {
        this.eventBus.off(eventName, callback/*, capturing*/);
    }

    setDefaultHandler(eventName: string, callback: (data: any, source: Editor) => any) {
        this.eventBus.setDefaultHandler(eventName, callback);
    }

    _emit(eventName: string, event?: any): void {
        this.eventBus._emit(eventName, event);
    }

    _signal(eventName: string, event?: any): void {
        this.eventBus._signal(eventName, event);
    }

    hasListeners(eventName: string): boolean {
        return this.eventBus.hasListeners(eventName);
    }

    /**
     * This method is called as a result of the use typing.
     * The text will probably be a single character.
     *
     * @method onTextInput
     * @param text {string}
     * @return {void}
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
        else if (this.getSession().getDocument().isNewLine(text)) {
            var lineNumber = this.getCursorPosition().row;
            //            var option = new Services.EditorOptions();
            //            option.NewLineCharacter = "\n";
            // FIXME: Smart Indenting
            /*
            var indent = languageService.getSmartIndentAtLineNumber(currentFileName, lineNumber, option);
            if(indent > 0)
            {
                editor.commands.exec("inserttext", editor, {text:" ", times:indent});
            }
            */
        }
    }

    /**
     * @method onCommandKey
     * @param e {KeyboardEvent}
     * @param hashId {number}
     * @param keyCode {number}
     * @return {void}
     */
    public onCommandKey(e: KeyboardEvent, hashId: number, keyCode: number): void {
        this.keyBinding.onCommandKey(e, hashId, keyCode);
    }

    /**
     * Pass in `true` to enable overwrites in your session, or `false` to disable.
     * If overwrites is enabled, any text you enter will type over any text after it.
     * If the value of `overwrite` changes, this function also emites the `changeOverwrite` event.
     *
     * @method setOverwrite
     * @param overwrite {boolean} Defines wheter or not to set overwrites
     * @return {void}
     */
    setOverwrite(overwrite: boolean): void {
        this.session.setOverwrite(overwrite);
    }

    /**
     * Returns `true` if overwrites are enabled; `false` otherwise.
     *
     * @method getOverwrite
     * @return {boolean}
     */
    getOverwrite(): boolean {
        return this.session.getOverwrite();
    }

    /**
     * Sets the value of overwrite to the opposite of whatever it currently is.
     *
     * @method toggleOverwrite
     * @return {void}
     */
    toggleOverwrite(): void {
        this.session.toggleOverwrite();
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
        this.renderer.setHighlightGutterLine(highlightGutterLine);
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
     * @method setAnimatedScroll
     * @param animatedScroll {boolean}
     * @return {void}
     */
    setAnimatedScroll(animatedScroll: boolean): void {
        this.renderer.setAnimatedScroll(animatedScroll);
    }

    /**
     * @method getAnimatedScroll
     * @return {boolean}
     */
    getAnimatedScroll(): boolean {
        return this.renderer.getAnimatedScroll();
    }

    /**
     * If `showInvisibles` is set to `true`, invisible characters&mdash;like spaces or new lines&mdash;are show in the editor.
     *
     * @method setShowInvisibles
     * @param showInvisibles {boolean} Specifies whether or not to show invisible characters.
     * @return {void}
     */
    setShowInvisibles(showInvisibles: boolean): void {
        this.renderer.setShowInvisibles(showInvisibles);
    }

    /**
     * Returns `true` if invisible characters are being shown.
     *
     * @method getShowInvisibles
     * @return {boolean}
     */
    getShowInvisibles(): boolean {
        return this.renderer.getShowInvisibles();
    }

    /**
     * @method setDisplayIndentGuides
     * @param displayIndentGuides {boolean}
     * @return {void}
     */
    setDisplayIndentGuides(displayIndentGuides: boolean): void {
        this.renderer.setDisplayIndentGuides(displayIndentGuides);
    }

    /**
     * @method getDisplayIndentGuides
     * @return {boolean}
     */
    getDisplayIndentGuides(): boolean {
        return this.renderer.getDisplayIndentGuides();
    }

    /**
     * If `showPrintMargin` is set to `true`, the print margin is shown in the editor.
     *
     * @method setShowPrintMargin
     * @param showPrintMargin {boolean} Specifies whether or not to show the print margin.
     * @return {void}
     */
    setShowPrintMargin(showPrintMargin: boolean): void {
        this.renderer.setShowPrintMargin(showPrintMargin);
    }

    /**
     * Returns `true` if the print margin is being shown.
     *
     * @method getShowPrintMargin
     * @return {boolean}
     */
    getShowPrintMargin(): boolean {
        return this.renderer.getShowPrintMargin();
    }

    /**
     * Sets the column defining where the print margin should be.
     *
     * @method setPrintMarginColumn
     * @param printMarginColumn {number} Specifies the new print margin column.
     * @return {void}
     */
    setPrintMarginColumn(printMarginColumn: number): void {
        this.renderer.setPrintMarginColumn(printMarginColumn);
    }

    /**
     * Returns the column number of where the print margin is.
     *
     * @method getPrintMarginColumn
     * @return {number}
     */
    getPrintMarginColumn(): number {
        return this.renderer.getPrintMarginColumn();
    }

    /**
     * If `readOnly` is true, then the editor is set to read-only mode, and none of the content can change.
     *
     * @method setReadOnly
     * @param {Boolean} readOnly Specifies whether the editor can be modified or not.
     * @return {void}
     */
    setReadOnly(readOnly: boolean): void {
        this.$readOnly = readOnly;
        // disabled to not break vim mode!
        this.textInput.setReadOnly(readOnly);
        this.$resetCursorStyle();
    }

    /**
     * Returns `true` if the editor is set to read-only mode.
     *
     * @method getReadOnly
     * @return {boolean}
     */
    getReadOnly(): boolean {
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
     *
     * @param showFoldWidgets Specifies whether the fold widgets are shown.
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

    /**
     * Removes words of text from the editor.
     * A "word" is defined as a string of characters bookended by whitespace.
     *
     * @method remove
     * @param direction {string} The direction of the deletion to occur, either "left" or "right".
     * @return {void}
     */
    remove(direction: string): void {
        if (this.selection.isEmpty()) {
            if (direction === "left")
                this.selection.selectLeft();
            else
                this.selection.selectRight();
        }

        var selectionRange = this.getSelectionRange();
        if (this.getBehavioursEnabled()) {
            var session = this.session;
            var state = session.getState(selectionRange.start.row);
            var newRange: Range = <Range>session.getMode().transformAction(state, 'deletion', this, session, selectionRange);

            if (selectionRange.end.column === 0) {
                var text = session.getTextRange(selectionRange);
                if (text[text.length - 1] === "\n") {
                    var line = session.getLine(selectionRange.end.row);
                    if (/^\s+$/.test(line)) {
                        selectionRange.end.column = line.length;
                    }
                }
            }
            if (newRange) {
                selectionRange = newRange;
            }
        }

        this.session.remove(selectionRange);
        this.clearSelection();
    }

    /**
     * Removes the word directly to the right of the current selection.
     *
     * @method removeWordRight
     * @return {void}
     */
    removeWordRight(): void {
        if (this.selection.isEmpty()) {
            this.selection.selectWordRight();
        }

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    }

    /**
     * Removes the word directly to the left of the current selection.
     *
     * @method removeWordLeft
     * @return {void}
     */
    removeWordLeft() {
        if (this.selection.isEmpty())
            this.selection.selectWordLeft();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    }

    /**
     * Removes all the words to the left of the current selection, until the start of the line.
     *
     * @method removeToLineStart
     * @rerurn {void}
     */
    removeToLineStart(): void {
        if (this.selection.isEmpty())
            this.selection.selectLineStart();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    }

    /**
     * Removes all the words to the right of the current selection, until the end of the line.
     *
     * @method removeToLineEnd
     * @return {void}
     */
    removeToLineEnd(): void {
        if (this.selection.isEmpty())
            this.selection.selectLineEnd();

        var range = this.getSelectionRange();
        if (range.start.column === range.end.column && range.start.row === range.end.row) {
            range.end.column = 0;
            range.end.row++;
        }

        this.session.remove(range);
        this.clearSelection();
    }

    /**
     * Splits the line at the current selection (by inserting an `'\n'`).
     *
     * @method splitLine
     * @return {void}
     */
    splitLine(): void {
        if (!this.selection.isEmpty()) {
            this.session.remove(this.getSelectionRange());
            this.clearSelection();
        }

        var cursor = this.getCursorPosition();
        this.insert("\n", false);
        this.moveCursorToPosition(cursor);
    }

    /**
     * Transposes current line.
     *
     * @method transposeLetters
     * @return {void}
     */
    transposeLetters(): void {
        if (!this.selection.isEmpty()) {
            return;
        }

        var cursor = this.getCursorPosition();
        var column = cursor.column;
        if (column === 0)
            return;

        var line = this.session.getLine(cursor.row);
        var swap, range;
        if (column < line.length) {
            swap = line.charAt(column) + line.charAt(column - 1);
            range = new Range(cursor.row, column - 1, cursor.row, column + 1);
        }
        else {
            swap = line.charAt(column - 1) + line.charAt(column - 2);
            range = new Range(cursor.row, column - 2, cursor.row, column);
        }
        this.session.replace(range, swap);
    }

    /**
     * Converts the current selection entirely into lowercase.
     *
     * @method toLowerCase
     * @return {void}
     */
    toLowerCase(): void {
        const originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        const range = this.getSelectionRange();
        const text = this.session.getTextRange(range);
        this.session.replace(range, text.toLowerCase());
        this.selection.setSelectionRange(originalRange);
    }

    /**
     * Converts the current selection entirely into uppercase.
     *
     * @method toUpperCase
     * @return {void}
     */
    toUpperCase(): void {
        const originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        const range = this.getSelectionRange();
        const text = this.session.getTextRange(range);
        this.session.replace(range, text.toUpperCase());
        this.selection.setSelectionRange(originalRange);
    }

    /**
     * Inserts an indentation into the current cursor position or indents the selected lines.
     */
    indent(): void {
        const session = this.session;
        const range = this.getSelectionRange();

        if (range.start.row < range.end.row) {
            const {first, last} = this.$getSelectedRows();
            session.indentRows(first, last, "\t");
            return;
        }
        else if (range.start.column < range.end.column) {
            const text = session.getTextRange(range);
            if (!/^\s+$/.test(text)) {
                const {first, last} = this.$getSelectedRows();
                session.indentRows(first, last, "\t");
                return;
            }
        }

        const line = session.getLine(range.start.row);
        const position = range.start;
        const size = session.getTabSize();
        const column = session.documentToScreenColumn(position.row, position.column);

        let indentString: string;
        if (this.session.getUseSoftTabs()) {
            const count = (size - column % size);
            indentString = stringRepeat(" ", count);
        }
        else {
            let count = column % size;
            while (line[range.start.column - 1] === " " && count) {
                range.start.column--;
                count--;
            }
            this.selection.setSelectionRange(range);
            indentString = "\t";
        }
        return this.insert(indentString, false);
    }

    /**
     * Indents the current line.
     *
     * @method blockIndent
     * @return {void}
     */
    blockIndent(): void {
        const rows = this.$getSelectedRows();
        this.session.indentRows(rows.first, rows.last, "\t");
    }

    /**
     * Outdents the current line.
     *
     * @method blockOutdent
     * @return {void}
     */
    blockOutdent(): void {
        const selection = this.session.getSelection();
        this.session.outdentRows(selection.getRange());
    }

    // TODO: move out of core when we have good mechanism for managing extensions.
    /**
     *
     */
    sortLines(): void {
        const rows: FirstAndLast = this.$getSelectedRows();
        const session = this.session;

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
     *
     * @method toggleCommentLines
     * @return {void}
     */
    toggleCommentLines(): void {
        const state = this.session.getState(this.getCursorPosition().row);
        const rows = this.$getSelectedRows();
        this.session.getMode().toggleCommentLines(state, this.session, rows.first, rows.last);
    }

    /**
     * @method toggleBlockComment
     * @return {void}
     */
    toggleBlockComment(): void {
        const cursor = this.getCursorPosition();
        const state = this.session.getState(cursor.row);
        const range = this.getSelectionRange();
        this.session.getMode().toggleBlockComment(state, this.session, range, cursor);
    }

    /**
     * Works like [[EditSession.getTokenAt]], except it returns a number.
     *
     * @method getNumberAt
     * @param row {number}
     * @param column {number}
     * @return {{value: string; start: number; end: number}}
     */
    getNumberAt(row: number, column: number): { value: string; start: number; end: number } {
        var _numberRx = /[\-]?[0-9]+(?:\.[0-9]+)?/g;
        _numberRx.lastIndex = 0;

        var s = this.session.getLine(row);
        while (_numberRx.lastIndex < column) {
            var m: RegExpExecArray = _numberRx.exec(s);
            if (m.index <= column && m.index + m[0].length >= column) {
                var retval = {
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
     * @method modifyNumber
     * @param amount {number} The value to change the numeral by (can be negative to decrease value).
     * @return {void}
     */
    modifyNumber(amount: number): void {
        var row = this.selection.getCursor().row;
        var column = this.selection.getCursor().column;

        // get the char before the cursor
        var charRange = new Range(row, column - 1, row, column);

        var c = parseFloat(this.session.getTextRange(charRange));
        // if the char is a digit
        if (!isNaN(c) && isFinite(c)) {
            // get the whole number the digit is part of
            var nr = this.getNumberAt(row, column);
            // if number found
            if (nr) {
                var fp = nr.value.indexOf(".") >= 0 ? nr.start + nr.value.indexOf(".") + 1 : nr.end;
                var decimals = nr.start + nr.value.length - fp;

                var t = parseFloat(nr.value);
                t *= Math.pow(10, decimals);


                if (fp !== nr.end && column < fp) {
                    amount *= Math.pow(10, nr.end - column - 1);
                } else {
                    amount *= Math.pow(10, nr.end - column);
                }

                t += amount;
                t /= Math.pow(10, decimals);
                var nnr = t.toFixed(decimals);

                // update number
                var replaceRange = new Range(row, nr.start, row, nr.end);
                this.session.replace(replaceRange, nnr);

                // reposition the cursor
                this.moveCursorTo(row, Math.max(nr.start + 1, column + nnr.length - nr.value.length));

            }
        }
    }

    /**
     * Removes all the lines in the current selection.
     *
     * @method removeLines
     * @return {void}
     */
    removeLines(): void {
        const rows = this.$getSelectedRows();
        let range;
        if (rows.first === 0 || rows.last + 1 < this.session.getLength())
            range = new Range(rows.first, 0, rows.last + 1, 0);
        else
            range = new Range(
                rows.first - 1, this.session.getLine(rows.first - 1).length,
                rows.last, this.session.getLine(rows.last).length
            );
        this.session.remove(range);
        this.clearSelection();
    }

    /**
     * @method duplicateSelection
     * @return {void}
     */
    duplicateSelection(): void {
        const selection = this.selection;
        const session = this.session;
        const range = selection.getRange();
        const reverse = selection.isBackwards();
        if (range.isEmpty()) {
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

    /**
     * Shifts all the selected lines down one row.
     *
     * @method moveLinesDown
     * @return {Number} On success, it returns -1.
     * @related EditSession.moveLinesUp
     */
    moveLinesDown() {
        // FIXME: Return type is broken.
        this.$moveLines((firstRow: number, lastRow: number) => {
            return this.session.moveLinesDown(firstRow, lastRow);
        });
    }

    /**
     * Shifts all the selected lines up one row.
     * 
     * @method moveLinesUp
     * @return {Number} On success, it returns -1.
     * @related EditSession.moveLinesDown
     */
    moveLinesUp(): void {
        // FIXME: Return type is broken.
        this.$moveLines((firstRow, lastRow) => {
            return this.session.moveLinesUp(firstRow, lastRow);
        });
    }

    /**
     * Moves a range of text from the given range to the given position.
     *
     * @method moveText
     * @param range {Range} The range of text you want moved within the document
     * @param toPosition {Position} The location (row and column) where you want to move the text to
     * @param copy {boolean}
     * @return {Range} The new range where the text was moved to.
     */
    moveText(range: Range, toPosition: Position, copy: boolean): Range {
        return this.session.moveText(range, toPosition, copy);
    }

    /**
     * Copies all the selected lines up one row.
     *
     * @method copyLinesUp
     * @return {Number} On success, returns 0.
     */
    copyLinesUp(): void {
        // FIXME: The return types are broken.
        this.$moveLines((firstRow, lastRow) => {
            this.session.duplicateLines(firstRow, lastRow);
            return 0;
        });
    }

    /**
     * Copies all the selected lines down one row.
     *
     * @method copyLinesDown
     * @return {Number} On success, returns the number of new rows added; in other words, `lastRow - firstRow + 1`.
     */
    copyLinesDown(): void {
        // FIXME: The return types are broken.
        this.$moveLines((firstRow, lastRow) => {
            return this.session.duplicateLines(firstRow, lastRow);
        });
    }

    /**
     * Executes a specific function, which can be anything that manipulates selected lines, such as copying them, duplicating them, or shifting them.
     *
     * @method $moveLines
     * @param {Function} mover A method to call on each selected row.
     * @retrurn {void}
     * @private
     */
    private $moveLines(mover: (firstRow: number, lastRow: number) => any): void {
        const selection = this.selection;
        if (!selection.inMultiSelectMode || this.inVirtualSelectionMode) {
            const range = selection.toOrientedRange();
            const selectedRows: { first: number; last: number } = this.$getSelectedRows();
            const linesMoved = mover.call(this, selectedRows.first, selectedRows.last);
            range.moveBy(linesMoved, 0);
            selection.fromOrientedRange(range);
        }
        else {
            const ranges = selection.rangeList.ranges;
            selection.rangeList.detach();

            for (let i = ranges.length; i--;) {
                let rangeIndex = i;
                let collapsedRows = ranges[i].collapseRows();
                const last = collapsedRows.end.row;
                let first = collapsedRows.start.row;
                while (i--) {
                    collapsedRows = ranges[i].collapseRows();
                    if (first - collapsedRows.end.row <= 1)
                        first = collapsedRows.end.row;
                    else
                        break;
                }
                i++;

                const linesMoved = mover.call(this, first, last);
                while (rangeIndex >= i) {
                    ranges[rangeIndex].moveBy(linesMoved, 0);
                    rangeIndex--;
                }
            }
            selection.fromOrientedRange(selection.ranges[0]);
            selection.rangeList.attach(this.session);
        }
    }

    /**
     * Returns an object indicating the currently selected rows.
     *
     * @method $getSelectedRows
     * @return {FirstAndLast}
     * @private
     */
    private $getSelectedRows(): FirstAndLast {
        const range = this.getSelectionRange().collapseRows();

        return {
            first: this.session.getRowFoldStart(range.start.row),
            last: this.session.getRowFoldEnd(range.end.row)
        };
    }

    onCompositionStart(text?: string) {
        this.renderer.showComposition(this.getCursorPosition());
    }

    onCompositionUpdate(text?: string) {
        this.renderer.setCompositionText(text);
    }

    onCompositionEnd() {
        this.renderer.hideComposition();
    }

    /**
     * @method getFirstVisibleRow
     * @return {number}
     */
    getFirstVisibleRow(): number {
        return this.renderer.getFirstVisibleRow();
    }

    /**
     * @method getLastVisibleRow
     * @return {number}
     */
    getLastVisibleRow(): number {
        return this.renderer.getLastVisibleRow();
    }

    /**
     * Indicates if the row is currently visible on the screen.
     *
     * @method isRowVisible
     * @param row {number} The row to check
     * @return {boolean}
     */
    isRowVisible(row: number): boolean {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    }

    /**
     * Indicates if the entire row is currently visible on the screen.
     *
     * @method isRowFullyVisible
     * @param row {number} The row to check
     * @return {boolean}
     */
    isRowFullyVisible(row: number): boolean {
        return (row >= this.renderer.getFirstFullyVisibleRow() && row <= this.renderer.getLastFullyVisibleRow());
    }

    /**
     * Returns the number of currently visibile rows.
     *
     * @method $getVisibleRowCount
     * @return {number}
     * @private
     */
    private $getVisibleRowCount(): number {
        return this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1;
    }

    /**
     * FIXME: The semantics of select are not easily understood.
     *
     * @method $moveByPage
     * @param direction {number} +1 for page down, -1 for page up. Maybe N for N pages?
     * @param [select] {boolean} true | false | undefined
     * @return {void}
     * @private
     */
    private $moveByPage(direction: number, select?: boolean): void {
        const renderer = this.renderer;
        const config = this.renderer.layerConfig;
        const rows = direction * Math.floor(config.height / config.lineHeight);

        this.$blockScrolling++;
        try {
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
        finally {
            this.$blockScrolling--;
        }

        const scrollTop = renderer.scrollTop;

        renderer.scrollBy(0, rows * config.lineHeight);
        // Why don't we assert our args and do typeof select === 'undefined'?
        if (select != null) {
            // This is called when select is undefined.
            renderer.scrollCursorIntoView(null, 0.5);
        }

        renderer.animateScrolling(scrollTop);
    }

    /**
     * Selects the text from the current position of the document until where a "page down" finishes.
     *
     * @method selectPageDown
     * @return {void}
     */
    selectPageDown(): void {
        this.$moveByPage(+1, true);
    }

    /**
     * Selects the text from the current position of the document until where a "page up" finishes.
     *
     * @method selectPageUp
     * @return {void}
     */
    selectPageUp(): void {
        this.$moveByPage(-1, true);
    }

    /**
     * Shifts the document to wherever "page down" is, as well as moving the cursor position.
     *
     * @method gotoPageDown
     * @return {void}
     */
    gotoPageDown(): void {
        this.$moveByPage(+1, false);
    }

    /**
     * Shifts the document to wherever "page up" is, as well as moving the cursor position.
     *
     * @method gotoPageUp
     * @return {void}
     */
    gotoPageUp(): void {
        this.$moveByPage(-1, false);
    }

    /**
     * Scrolls the document to wherever "page down" is, without changing the cursor position.
     *
     * @method scrollPageDown
     * @return {void}
     */
    scrollPageDown(): void {
        this.$moveByPage(1);
    }

    /**
     * Scrolls the document to wherever "page up" is, without changing the cursor position.
     *
     * @method scrollPageUp
     * @return {void}
     */
    scrollPageUp(): void {
        this.$moveByPage(-1);
    }

    /**
     * Moves the editor to the specified row.
     *
     * @method scrollToRow
     * @param row {number}
     * @return {void}
     */
    scrollToRow(row: number): void {
        this.renderer.scrollToRow(row);
    }

    /**
     * Scrolls to a line.
     * If `center` is `true`, it puts the line in middle of screen (or attempts to).
     *
     * @method scrollToLine
     * @param {Number} line The line to scroll to
     * @param {Boolean} center If `true`
     * @param {Boolean} animate If `true` animates scrolling
     * @param {Function} callback Function to be called when the animation has finished
     * @return {void}
     */
    scrollToLine(line: number, center: boolean, animate: boolean, callback?: () => any): void {
        this.renderer.scrollToLine(line, center, animate, callback);
    }

    /**
     * Attempts to center the current selection on the screen.
     *
     * @method centerSelection
     * @return {void}
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
     */
    getCursorPosition(): Position {
        const selection = this.selection;
        if (selection) {
            return selection.getCursor();
        }
        else {
            return void 0;
        }
    }

    /**
     * Returns the screen position of the cursor.
     *
     * @method getCursorPositionScreen
     * @return {Position}
     */
    getCursorPositionScreen(): Position {
        const cursor = this.getCursorPosition();
        return this.session.documentToScreenPosition(cursor.row, cursor.column);
    }

    /**
     * @method getSelectionRange
     * @return {Range}
     */
    getSelectionRange(): Range {
        return this.selection.getRange();
    }

    /**
     * Selects all the text in editor.
     *
     * @method selectAll
     * @return {void}
     */
    selectAll(): void {
        this.$blockScrolling += 1;
        this.selection.selectAll();
        this.$blockScrolling -= 1;
    }

    /**
     * @method clearSelection
     * @return {void}
     */
    clearSelection(): void {
        this.selection.clearSelection();
    }

    /**
     * Moves the cursor to the specified row and column.
     * Note that this does not de-select the current selection.
     *
     * @method moveCursorTo
     * @param {Number} row The new row number
     * @param {Number} column The new column number
     * @param {boolean} animate
     * @return {void}
     */
    moveCursorTo(row: number, column: number, animate?: boolean): void {
        this.selection.moveCursorTo(row, column, animate);
    }

    /**
     * Moves the cursor to the position specified by `position.row` and `position.column`.
     *
     * @method moveCursorToPosition
     * @param position {Position} An object with two properties, row and column
     * @return {void}
     */
    moveCursorToPosition(position: Position): void {
        return this.selection.moveCursorToPosition(position);
    }

    /**
     * Moves the cursor's row and column to the next matching bracket or HTML tag.
     *
     * @method jumpToMatching
     * @param [select] {boolean}
     * @return {void}
     */
    jumpToMatching(select?: boolean): void {
        var cursor = this.getCursorPosition();
        var iterator = new TokenIterator(this.session, cursor.row, cursor.column);
        var prevToken = iterator.getCurrentToken();
        var token = prevToken;

        if (!token)
            token = iterator.stepForward();

        if (!token)
            return;

        // get next closing tag or bracket
        var matchType;
        var found = false;
        var depth = {};
        var i = cursor.column - token.start;
        var bracketType;
        var brackets = {
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

                if (prevToken.value === '<') {
                    depth[token.value]++;
                }
                else if (prevToken.value === '</') {
                    depth[token.value]--;
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

        var range: Range;
        if (matchType === 'bracket') {
            range = this.session.getBracketRange(cursor);
            if (!range) {
                range = new Range(
                    iterator.getCurrentTokenRow(),
                    iterator.getCurrentTokenColumn() + i - 1,
                    iterator.getCurrentTokenRow(),
                    iterator.getCurrentTokenColumn() + i - 1
                );
                if (!range)
                    return;
                var pos = range.start;
                if (pos.row === cursor.row && Math.abs(pos.column - cursor.column) < 2)
                    range = this.session.getBracketRange(pos);
            }
        }
        else if (matchType === 'tag') {
            if (token && token.type.indexOf('tag-name') !== -1)
                var tag = token.value;
            else
                return;

            var range = new Range(
                iterator.getCurrentTokenRow(),
                iterator.getCurrentTokenColumn() - 2,
                iterator.getCurrentTokenRow(),
                iterator.getCurrentTokenColumn() - 2
            );

            // find matching tag
            if (range.compare(cursor.row, cursor.column) === 0) {
                found = false;
                do {
                    token = prevToken;
                    prevToken = iterator.stepBackward();

                    if (prevToken) {
                        if (prevToken.type.indexOf('tag-close') !== -1) {
                            range.setEnd(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 1);
                        }

                        if (token.value === tag && token.type.indexOf('tag-name') !== -1) {
                            if (prevToken.value === '<') {
                                depth[tag]++;
                            } else if (prevToken.value === '</') {
                                depth[tag]--;
                            }

                            if (depth[tag] === 0)
                                found = true;
                        }
                    }
                } while (prevToken && !found);
            }

            // we found it
            if (token && token.type.indexOf('tag-name')) {
                var pos = range.start;
                if (pos.row === cursor.row && Math.abs(pos.column - cursor.column) < 2)
                    pos = range.end;
            }
        }

        pos = range && range['cursor'] || pos;
        if (pos) {
            if (select) {
                if (range && range.isEqual(this.getSelectionRange()))
                    this.clearSelection();
                else
                    this.selection.selectTo(pos.row, pos.column);
            }
            else {
                this.selection.moveTo(pos.row, pos.column);
            }
        }
    }

    /**
     * Moves the cursor to the specified line number, and also into the indiciated column.
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
        this.exitMultiSelectMode && this.exitMultiSelectMode();
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
     * @method navigateTo
     * @param {Number} row The new row number
     * @param {Number} column The new column number
     * @return {void}
     */
    navigateTo(row: number, column: number): void {
        this.selection.moveTo(row, column);
    }

    /**
     * Moves the cursor up in the document the specified number of times.
     * Note that this does de-select the current selection.
     *
     * @method navigateUp
     * @param times {number} The number of times to change navigation.
     * @return {void}
     */
    navigateUp(times: number): void {
        if (this.selection.isMultiLine() && !this.selection.isBackwards()) {
            var selectionStart = this.selection.anchor.getPosition();
            return this.moveCursorToPosition(selectionStart);
        }
        this.selection.clearSelection();
        this.selection.moveCursorBy(-times || -1, 0);
    }

    /**
     * Moves the cursor down in the document the specified number of times.
     * Note that this does de-select the current selection.
     *
     * @method navigateDown
     * @param {Number} times The number of times to change navigation
     * @return {void}
     */
    navigateDown(times: number): void {
        if (this.selection.isMultiLine() && this.selection.isBackwards()) {
            var selectionEnd = this.selection.anchor.getPosition();
            return this.moveCursorToPosition(selectionEnd);
        }
        this.selection.clearSelection();
        this.selection.moveCursorBy(times || 1, 0);
    }

    /**
     * Moves the cursor left in the document the specified number of times.
     * Note that this does de-select the current selection.
     *
     * @method navigateLeft
     * @param {Number} times The number of times to change navigation
     * @return {void}
     */
    navigateLeft(times: number): void {
        if (!this.selection.isEmpty()) {
            var selectionStart = this.getSelectionRange().start;
            this.moveCursorToPosition(selectionStart);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorLeft();
            }
        }
        this.clearSelection();
    }

    /**
     * Moves the cursor right in the document the specified number of times.
     * Note that this does de-select the current selection.
     *
     * @method navigateRight
     * @param {Number} times The number of times to change navigation
     * @return {void}
     */
    navigateRight(times: number): void {
        if (!this.selection.isEmpty()) {
            var selectionEnd = this.getSelectionRange().end;
            this.moveCursorToPosition(selectionEnd);
        }
        else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorRight();
            }
        }
        this.clearSelection();
    }

    /**
     * Moves the cursor to the start of the current line.
     * Note that this does de-select the current selection.
     *
     * @method navigateLineStart
     * @return {void}
     */
    navigateLineStart(): void {
        this.selection.moveCursorLineStart();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the end of the current line.
     * Note that this does de-select the current selection.
     *
     * @method navigateLineEnd
     * @return {void}
     */
    navigateLineEnd(): void {
        this.selection.moveCursorLineEnd();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the end of the current file.
     * Note that this does de-select the current selection.
     *
     * @method navigateFileEnd
     * @return {void}
     */
    navigateFileEnd(): void {
        this.selection.moveCursorFileEnd();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the start of the current file.
     * Note that this also de-selects the current selection.
     *
     * @method navigateFileStart
     * @return {void}
     */
    navigateFileStart(): void {
        this.selection.moveCursorFileStart();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the word immediately to the right of the current position.
     * Note that this does de-select the current selection.
     *
     * @method navigateWordRight
     * @return {void}
     */
    navigateWordRight(): void {
        this.selection.moveCursorWordRight();
        this.clearSelection();
    }

    /**
     * Moves the cursor to the word immediately to the left of the current position.
     * Note that this does de-select the current selection.
     *
     * @method navigateWordLeft
     * @return {void}
     */
    navigateWordLeft(): void {
        this.selection.moveCursorWordLeft();
        this.clearSelection();
    }

    /**
     * Replaces the first occurance of `options.needle` with the value in `replacement`.
     *
     * @method replace
     * @param replacement {string} The text to replace with.
     * @param options {SearchOptions} The options to use.
     * @return {number}
     */
    replace(replacement: string, options?: SearchOptions): number {
        if (options) {
            this.$search.set(options);
        }

        const range = this.$search.find(this.session);
        let replaced = 0;
        if (!range)
            return replaced;

        if (this.$tryReplace(range, replacement)) {
            replaced = 1;
        }
        if (range !== null) {
            this.selection.setSelectionRange(range);
            this.renderer.scrollSelectionIntoView(range.start, range.end);
        }

        return replaced;
    }

    /**
     * Replaces all occurances of `options.needle` with the value in `replacement`.
     *
     * @method replaceAll
     * @param replacement {string} The text to replace with
     * @param options {SearchOptions} The options to use.
     * @return {number}
     */
    replaceAll(replacement: string, options?: SearchOptions): number {
        if (options) {
            this.$search.set(options);
        }

        const ranges = this.$search.findAll(this.session);
        let replaced = 0;
        if (!ranges.length) {
            return replaced;
        }

        this.$blockScrolling += 1;

        const selection = this.getSelectionRange();
        this.selection.moveTo(0, 0);

        for (let i = ranges.length - 1; i >= 0; --i) {
            if (this.$tryReplace(ranges[i], replacement)) {
                replaced++;
            }
        }

        this.selection.setSelectionRange(selection);
        this.$blockScrolling -= 1;

        return replaced;
    }

    private $tryReplace(range: Range, replacement: string): Range {
        var input = this.session.getTextRange(range);
        replacement = this.$search.replace(input, replacement);
        if (replacement !== null) {
            range.end = this.session.replace(range, replacement);
            return range;
        }
        else {
            return null;
        }
    }

    /**
     * @method getLastSearchOptions
     * @return {SearchOptions}
     */
    getLastSearchOptions(): SearchOptions {
        return this.$search.getOptions();
    }

    /**
     * Finds and selects all the occurences of `needle`.
     *
     * @method findAll
     * @param [needle] {string|RegExp} The text to find.
     * @param [options={}] {SearchOptions} The search options.
     * @param [additive] {boolean} keeps
     * @returns {number} The cumulative count of all found matches 
     */
    findAll(needle?: (string | RegExp), options: SearchOptions = {}, additive?: boolean): number {

        options.needle = needle || options.needle;
        if (options.needle === void 0) {
            var range = this.selection.isEmpty()
                ? this.selection.getWordRange()
                : this.selection.getRange();
            options.needle = this.session.getTextRange(range);
        }
        this.$search.set(options);

        var ranges = this.$search.findAll(this.session);
        if (!ranges.length)
            return 0;

        this.$blockScrolling += 1;
        var selection = this.multiSelect;

        if (!additive)
            selection.toSingleRange(ranges[0]);

        for (var i = ranges.length; i--;)
            selection.addRange(ranges[i], true);

        // Keep existing selection as primary if possible.
        if (range && selection.rangeList.rangeAtPoint(range.start)) {
            selection.addRange(range, true);
        }

        this.$blockScrolling -= 1;

        return ranges.length;
    };

    /**
     * Attempts to find `needle` within the document.
     * For more information on `options`, see [[Search `Search`]].
     *
     * @method find
     * @param [needle] {string | RegExp} The text to search for.
     * @param [options] {SearchOptions} An object defining various search properties
     * @param [animate] {boolean} If `true` animate scrolling
     * @return {Range}
     */
    find(needle?: (string | RegExp), options: SearchOptions = {}, animate?: boolean): Range {
        if (typeof needle === "string" || needle instanceof RegExp) {
            options.needle = needle;
        }
        else if (typeof needle === "object") {
            mixin(options, needle);
        }

        let range = this.selection.getRange();
        if (options.needle == null) {
            needle = this.session.getTextRange(range) || this.$search.$options.needle;
            if (!needle) {
                range = this.session.getWordRange(range.start.row, range.start.column);
                needle = this.session.getTextRange(range);
            }
            this.$search.set({ needle: needle });
        }

        this.$search.set(options);
        if (!options.start) {
            this.$search.set({ start: range });
        }

        const newRange = this.$search.find(this.session);
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
        this.selection.setRange(range);
    }

    /**
     * Performs another search for `needle` in the document.
     * For more information on `options`, see [[Search `Search`]].
     *
     * @method findNext
     * @param [needle] {string | RegExp}
     * @param [animate] {boolean} If `true` animate scrolling
     * @return {void}
     */
    findNext(needle?: (string | RegExp), animate?: boolean): void {
        this.find(needle, { skipCurrent: true, backwards: false }, animate);
    }

    /**
     * Performs a search for `needle` backwards.
     * For more information on `options`, see [[Search `Search`]].
     *
     * @method findPrevious
     * @param [needle] {string | RegExp}
     * @param [animate] {boolean} If `true` animate scrolling
     * @return {void}
     */
    findPrevious(needle?: (string | RegExp), animate?: boolean): void {
        this.find(needle, { skipCurrent: true, backwards: true }, animate);
    }

    /**
     * @method revealRange
     * @param range {Range}
     * @param animate {boolean}
     * @return {void}
     */
    revealRange(range: Range, animate: boolean): void {
        this.$blockScrolling += 1;
        this.session.unfold(range);
        this.selection.setSelectionRange(range);
        this.$blockScrolling -= 1;

        var scrollTop = this.renderer.scrollTop;
        this.renderer.scrollSelectionIntoView(range.start, range.end, 0.5);
        if (animate !== false) {
            this.renderer.animateScrolling(scrollTop);
        }
    }

    /**
     * @method undo
     * @return {void}
     */
    undo(): void {
        this.$blockScrolling++;
        this.session.getUndoManager().undo();
        this.$blockScrolling--;
        this.renderer.scrollCursorIntoView(void 0, 0.5);
    }

    /**
     * @method redo
     * @return {void}
     */
    redo(): void {
        this.$blockScrolling++;
        this.session.getUndoManager().redo();
        this.$blockScrolling--;
        this.renderer.scrollCursorIntoView(void 0, 0.5);
    }

    /**
     * Enables automatic scrolling of the cursor into view when editor itself is inside scrollable element.
     *
     * @param enable
     */
    setAutoScrollEditorIntoView(enable: boolean): void {
        if (!enable) {
            return;
        }
        var rect;
        var shouldScroll = false;
        if (!this.$scrollAnchor)
            this.$scrollAnchor = document.createElement("div");
        var scrollAnchor = this.$scrollAnchor;
        scrollAnchor.style.cssText = "position:absolute";
        this.container.insertBefore(scrollAnchor, this.container.firstChild);
        let onChangeSelection = this.on("changeSelection", function () {
            shouldScroll = true;
        });
        // needed to not trigger sync reflow
        let removeBeforeRenderHandler = this.renderer.on("beforeRender", () => {
            if (shouldScroll)
                rect = this.renderer.container.getBoundingClientRect();
        });
        let removeAfterRenderHandler = this.renderer.on("afterRender", () => {
            if (shouldScroll && rect && this.isFocused()) {
                const renderer = this.renderer;
                var pos = renderer.cursorLayer.$pixelPos;
                var config = renderer.layerConfig;
                var top = pos.top - config.offset;
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
        this.setAutoScrollEditorIntoView = (enable) => {
            if (enable)
                return;

            delete this.setAutoScrollEditorIntoView;

            onChangeSelection();
            onChangeSelection = void 0;

            removeBeforeRenderHandler();
            removeBeforeRenderHandler = void 0;

            removeAfterRenderHandler();
            removeAfterRenderHandler = void 0;
        };
    }

    /**
     * @method $resetCursorStyle
     * @return {void}
     */
    public $resetCursorStyle(): void {
        var style = this.$cursorStyle || "ace";
        var cursorLayer = this.renderer.cursorLayer;
        if (!cursorLayer) {
            return;
        }
        cursorLayer.setSmoothBlinking(/smooth/.test(style));
        cursorLayer.isBlinking = !this.$readOnly && style !== "wide";
        cursorLayer.setCssClass("ace_slim-cursors", /slim/.test(style));
    }
}
/*
defOptions(Editor.prototype, "editor", {
    cursorStyle: {
        set: function(val) {
            var that: Editor = this;
            that.$resetCursorStyle();
        },
        values: ["ace", "slim", "smooth", "wide"],
        initialValue: "ace"
    },
    mergeUndoDeltas: {
        values: [false, true, "always"],
        initialValue: true
    },
    autoScrollEditorIntoView: {
        set: function(enable: boolean) {
            var that: Editor = this;
            that.setAutoScrollEditorIntoView(enable);
        }
    },

    hScrollBarAlwaysVisible: "renderer",
    vScrollBarAlwaysVisible: "renderer",
    animatedScroll: "renderer",
    showInvisibles: "renderer",
    showPrintMargin: "renderer",
    printMarginColumn: "renderer",
    printMargin: "renderer",
    fadeFoldWidgets: "renderer",
    showFoldWidgets: "renderer",
    showLineNumbers: "renderer",
    showGutter: "renderer",
    displayIndentGuides: "renderer",
    fontSize: "renderer",
    fontFamily: "renderer",
    maxLines: "renderer",
    minLines: "renderer",
    scrollPastEnd: "renderer",
    fixedWidthGutter: "renderer",
    theme: "renderer",

    scrollSpeed: "$mouseHandler",
    dragDelay: "$mouseHandler",
    dragEnabled: "$mouseHandler",
    focusTimout: "$mouseHandler",
    tooltipFollowsMouse: "$mouseHandler",

    firstLineNumber: "session",
    overwrite: "session",
    newLineMode: "session",
    useWorker: "session",
    useSoftTabs: "session",
    tabSize: "session",
    wrap: "session",
    foldStyle: "session",
    mode: "session"
});
*/

class FoldHandler {
    constructor(editor: Editor) {

        // The following handler detects clicks in the editor (not gutter) region
        // to determine whether to remove or expand a fold.
        editor.on("click", function (e: EditorMouseEvent) {
            const position = e.getDocumentPosition();
            const session = editor.getSession();

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
            const gutterRegion = editor.renderer.$gutterLayer.getRegion(e);
            if (gutterRegion === 'foldWidgets') {
                const row = e.getDocumentPosition().row;
                const session = editor.getSession();
                if (session['foldWidgets'] && session['foldWidgets'][row]) {
                    session['onFoldWidgetClick'](row, e);
                }
                if (!editor.isFocused()) {
                    editor.focus();
                }
                e.stop();
            }
        });

        editor.on('gutterdblclick', function (e: EditorMouseEvent) {
            const gutterRegion = editor.renderer.$gutterLayer.getRegion(e);

            if (gutterRegion === 'foldWidgets') {
                let row = e.getDocumentPosition().row;
                const session = editor.getSession();
                const data = session['getParentFoldRangeData'](row, true);
                const range = data.range || data.firstRange;

                if (range) {
                    row = range.start.row;
                    const fold = session.getFoldAt(row, session.getLine(row).length, 1);

                    if (fold) {
                        session.removeFold(fold);
                    }
                    else {
                        session['addFold']("...", range);
                        editor.renderer.scrollCursorIntoView({ row: range.start.row, column: 0 });
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
    cancelContextMenu(): void;
}

class MouseHandler implements IGestureHandler {
    public editor: Editor;
    public $scrollSpeed: number = 2;
    public $dragDelay: number = 0;
    private $dragEnabled: boolean = true;
    public $focusTimout: number = 0;
    public $tooltipFollowsMouse: boolean = true;
    private state: string;
    private clientX: number;
    private clientY: number;
    public isMousePressed: boolean;
    /**
     * The function to call to release a captured mouse.
     */
    private releaseMouse: (event: MouseEvent) => void;
    private mouseEvent: EditorMouseEvent;
    public mousedownEvent: EditorMouseEvent;
    private $mouseMoved;
    private $onCaptureMouseMove;
    public $clickSelection: Range = null;
    public $lastScrollTime: number;
    public selectByLines: () => void;
    public selectByWords: () => void;
    constructor(editor: Editor) {
        // FIXME: Did I mention that `this`, `new`, `class`, `bind` are the 4 horsemen?
        // FIXME: Function Scoping is the answer.
        var _self = this;
        this.editor = editor;

        // FIXME: We should be cleaning up these handlers in a dispose method...
        editor.setDefaultHandler('mousedown', makeMouseDownHandler(editor, this));
        editor.setDefaultHandler('mousewheel', makeMouseWheelHandler(editor, this));
        editor.setDefaultHandler("dblclick", makeDoubleClickHandler(editor, this));
        editor.setDefaultHandler("tripleclick", makeTripleClickHandler(editor, this));
        editor.setDefaultHandler("quadclick", makeQuadClickHandler(editor, this));

        this.selectByLines = makeExtendSelectionBy(editor, this, "getLineRange");
        this.selectByWords = makeExtendSelectionBy(editor, this, "getWordRange");

        new GutterHandler(this);
        //      FIXME: new DragdropHandler(this);

        const onMouseDown = function (e: MouseEvent) {
            if (!editor.isFocused() && editor.textInput) {
                editor.textInput.moveToMouse(e);
            }
            editor.focus();
        };

        const mouseTarget: HTMLDivElement = editor.renderer.getMouseEventTarget();
        addListener(mouseTarget, "click", this.onMouseEvent.bind(this, "click"));
        addListener(mouseTarget, "mousemove", this.onMouseMove.bind(this, "mousemove"));
        addMultiMouseDownListener(mouseTarget, [400, 300, 250], this, "onMouseEvent");
        if (editor.renderer.scrollBarV) {
            addMultiMouseDownListener(editor.renderer.scrollBarV.inner, [400, 300, 250], this, "onMouseEvent");
            addMultiMouseDownListener(editor.renderer.scrollBarH.inner, [400, 300, 250], this, "onMouseEvent");
            if (isIE) {
                addListener(editor.renderer.scrollBarV.element, "mousedown", onMouseDown);
                // TODO: I wonder if we should be responding to mousedown (by symmetry)?
                addListener(editor.renderer.scrollBarH.element, "mousemove", onMouseDown);
            }
        }

        // We hook 'mousewheel' using the portable 
        addMouseWheelListener(editor.container, this.emitEditorMouseWheelEvent.bind(this, "mousewheel"));

        var gutterEl = editor.renderer.$gutter;
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
            var char = editor.renderer.screenToTextCoordinates(e.x, e.y);
            var range = editor.getSession().getSelection().getRange();
            var renderer = editor.renderer;

            if (!range.isEmpty() && range.insideStart(char.row, char.column)) {
                renderer.setCursorStyle('default');
            }
            else {
                renderer.setCursorStyle("");
            }
        });
    }

    onMouseEvent(name: string, e: MouseEvent) {
        this.editor._emit(name, new EditorMouseEvent(e, this.editor));
    }

    onMouseMove(name: string, e: MouseEvent) {
        // If nobody is listening, avoid the creation of the temporary wrapper.
        // optimization, because mousemove doesn't have a default handler.
        if (this.editor.hasListeners('mousemove')) {
            this.editor._emit(name, new EditorMouseEvent(e, this.editor));
        }
    }

    emitEditorMouseWheelEvent(name: string, e: MouseWheelEvent) {
        var mouseEvent = new EditorMouseEvent(e, this.editor);
        mouseEvent.speed = this.$scrollSpeed * 2;
        mouseEvent.wheelX = e['wheelX'];
        mouseEvent.wheelY = e['wheelY'];
        this.editor._emit(name, mouseEvent);
    }

    setState(state: string) {
        this.state = state;
    }

    textCoordinates(): { row: number; column: number } {
        return this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
    }

    captureMouse(ev: EditorMouseEvent, mouseMoveHandler?: (mouseEvent: MouseEvent) => void) {
        this.clientX = ev.clientX;
        this.clientY = ev.clientY;

        this.isMousePressed = true;

        // do not move textarea during selection
        var renderer = this.editor.renderer;
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
                mouseMoveHandler && mouseMoveHandler(mouseEvent);
                mouseHandler.mouseEvent = new EditorMouseEvent(mouseEvent, editor);
                mouseHandler.$mouseMoved = true;
            };
        })(this.editor, this);

        const onCaptureEnd = (function (mouseHandler: MouseHandler) {
            return function (e) {
                clearInterval(timerId);
                onCaptureInterval();
                mouseHandler[mouseHandler.state + "End"] && mouseHandler[mouseHandler.state + "End"](e);
                mouseHandler.state = "";
                if (renderer.$keepTextAreaAtCursor == null) {
                    renderer.$keepTextAreaAtCursor = true;
                    renderer.$moveTextAreaToCursor();
                }
                mouseHandler.isMousePressed = false;
                mouseHandler.$onCaptureMouseMove = mouseHandler.releaseMouse = null;
                e && mouseHandler.onMouseEvent("mouseup", e);
            };
        })(this);

        const onCaptureInterval = (function (mouseHandler: MouseHandler) {
            return function () {
                mouseHandler[mouseHandler.state] && mouseHandler[mouseHandler.state]();
                mouseHandler.$mouseMoved = false;
            };
        })(this);

        if (isOldIE && ev.domEvent.type === "dblclick") {
            return setTimeout(function () { onCaptureEnd(ev); });
        }

        this.$onCaptureMouseMove = onMouseMove;
        this.releaseMouse = capture(this.editor.container, onMouseMove, onCaptureEnd);
        var timerId = setInterval(onCaptureInterval, 20);
    }

    cancelContextMenu(): void {
        var stop = function (e: EditorMouseEvent) {
            if (e && e.domEvent && e.domEvent.type !== "contextmenu") {
                return;
            }
            this.editor.off("nativecontextmenu", stop);
            if (e && e.domEvent) {
                stopEvent(e.domEvent);
            }
        }.bind(this);
        setTimeout(stop, 10);
        this.editor.on("nativecontextmenu", stop);
    }

    select() {
        var anchor: { row: number; column: number };
        var cursor = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);

        if (this.$clickSelection) {
            const cmp = this.$clickSelection.comparePoint(cursor);

            if (cmp === -1) {
                anchor = this.$clickSelection.end;
            } else if (cmp === 1) {
                anchor = this.$clickSelection.start;
            } else {
                var orientedRange = calcRangeOrientation(this.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            this.editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        this.editor.selection.selectToPosition(cursor);

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
        var editor = this.editor;
        // allow double/triple click handlers to change selection

        if (this.mousedownEvent.getShiftKey()) {
            editor.selection.selectToPosition(pos);
        }
        else if (!waitForClickSelection) {
            editor.selection.moveToPosition(pos);
        }

        if (!waitForClickSelection) {
            this.select();
        }

        if (this.editor.renderer.scroller['setCapture']) {
            this.editor.renderer.scroller['setCapture']();
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
        var distance = calcDistance(this.mousedownEvent.clientX, this.mousedownEvent.clientY, this.clientX, this.clientY);
        var time = Date.now();

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

// FIXME: This should be exposed so that users can be strongly typed. 
/**
 * Custom Ace mouse event
 *
 * @class EditorMouseEvent
 */
class EditorMouseEvent {
    /**
     * The original DOM mouse event.
     */
    public domEvent: MouseEvent;
    private editor: Editor;

    /**
     * @property clientX
     * @ype number
     */
    public clientX: number;

    /**
     * @propery clientY
     * @ype number
     */
    public clientY: number;

    /**
     * Cached text coordinates following getDocumentPosition()
     */
    private $pos: Position;
    private $inSelection: boolean;
    private propagationStopped = false;
    private defaultPrevented = false;
    public time: number;
    // wheelY, wheelY and speed are for 'mousewheel' events.
    public wheelX: number;
    public wheelY: number;
    public speed: number;

    /**
     * @class EditorMouseEvent
     * @constructor
     * @param domEvent {MouseEvent}
     * @param editor {Editor}
     */
    constructor(domEvent: MouseEvent, editor: Editor) {
        this.domEvent = domEvent;
        this.editor = editor;

        this.clientX = domEvent.clientX;
        this.clientY = domEvent.clientY;

        this.$pos = null;
        this.$inSelection = null;
    }

    get toElement() {
        return this.domEvent.toElement;
    }

    stopPropagation(): void {
        stopPropagation(this.domEvent);
        this.propagationStopped = true;
    }

    preventDefault() {
        preventDefault(this.domEvent);
        this.defaultPrevented = true;
    }

    stop() {
        this.stopPropagation();
        this.preventDefault();
    }

    /**
     * Get the document position below the mouse cursor
     *
     * @method getDocumentPosition
     * @return {Position} 'row' and 'column' of the document position
     */
    getDocumentPosition(): Position {
        if (!this.$pos) {
            this.$pos = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
        }
        return this.$pos;
    }

    /*
     * Check if the mouse cursor is inside of the text selection
     *
     * @method inSelection
     * @return {Boolean} whether the mouse cursor is inside of the selection
     */
    inSelection() {
        if (this.$inSelection !== null)
            return this.$inSelection;

        var editor = this.editor;


        var selectionRange = editor.getSelectionRange();
        if (selectionRange.isEmpty())
            this.$inSelection = false;
        else {
            var pos = this.getDocumentPosition();
            this.$inSelection = selectionRange.contains(pos.row, pos.column);
        }

        return this.$inSelection;
    }

    /*
     * Get the clicked mouse button
     * 
     * @return {Number} 0 for left button, 1 for middle button, 2 for right button
     */
    getButton() {
        return getButton(this.domEvent);
    }

    /*
     * @return {Boolean} whether the shift key was pressed when the event was emitted
     */
    getShiftKey() {
        return this.domEvent.shiftKey;
    }

    getAccelKey = isMac ? function () { return this.domEvent.metaKey; } : function () { return this.domEvent.ctrlKey; };
}

function makeMouseDownHandler(editor: Editor, mouseHandler: MouseHandler) {
    return function (ev: EditorMouseEvent) {
        const inSelection = ev.inSelection();
        const pos = ev.getDocumentPosition();
        mouseHandler.mousedownEvent = ev;

        const button = ev.getButton();
        if (button !== 0) {
            var selectionRange = editor.getSelectionRange();
            var selectionEmpty = selectionRange.isEmpty();

            if (selectionEmpty)
                editor.selection.moveToPosition(pos);

            // 2: contextmenu, 1: linux paste
            editor.textInput.onContextMenu(ev.domEvent);
            return; // stopping event here breaks contextmenu on ff mac
        }

        mouseHandler.mousedownEvent.time = Date.now();
        // if this click caused the editor to be focused should not clear the
        // selection
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
        var pos = editorMouseEvent.getDocumentPosition();
        var session = editor.getSession();

        var range = session.getBracketRange(pos);
        if (range) {
            if (range.isEmpty()) {
                range.start.column--;
                range.end.column++;
            }
            mouseHandler.setState("select");
        }
        else {
            range = editor.selection.getWordRange(pos.row, pos.column);
            mouseHandler.setState("selectByWords");
        }
        mouseHandler.$clickSelection = range;
        mouseHandler.select();
    };
}

function makeTripleClickHandler(editor: Editor, mouseHandler: MouseHandler) {
    return function (editorMouseEvent: EditorMouseEvent) {
        var pos = editorMouseEvent.getDocumentPosition();

        mouseHandler.setState("selectByLines");
        var range = editor.getSelectionRange();
        if (range.isMultiLine() && range.contains(pos.row, pos.column)) {
            mouseHandler.$clickSelection = editor.selection.getLineRange(range.start.row);
            mouseHandler.$clickSelection.end = editor.selection.getLineRange(range.end.row).end;
        }
        else {
            mouseHandler.$clickSelection = editor.selection.getLineRange(pos.row);
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

function makeExtendSelectionBy(editor: Editor, mouseHandler: MouseHandler, unitName: string) {
    return function () {
        var anchor;
        var cursor = mouseHandler.textCoordinates();
        const range: Range = editor.selection[unitName](cursor.row, cursor.column);

        if (mouseHandler.$clickSelection) {
            var cmpStart = mouseHandler.$clickSelection.comparePoint(range.start);
            var cmpEnd = mouseHandler.$clickSelection.comparePoint(range.end);

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
                var orientedRange = calcRangeOrientation(mouseHandler.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        editor.selection.selectToPosition(cursor);

        editor.renderer.scrollCursorIntoView();
    };
}

function calcDistance(ax: number, ay: number, bx: number, by: number) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

function calcRangeOrientation(range: Range, cursor: { row: number; column: number }): { cursor: { row: number; column: number }; anchor: { row: number; column: number } } {
    if (range.start.row === range.end.row) {
        var cmp = 2 * cursor.column - range.start.column - range.end.column;
    }
    else if (range.start.row === range.end.row - 1 && !range.start.column && !range.end.column) {
        var cmp = cursor.column - 4;
    }
    else {
        var cmp = 2 * cursor.row - range.start.row - range.end.row;
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
            const selection = editor.getSession().getSelection();

            if (e.getShiftKey()) {
                selection.selectTo(row, 0);
            }
            else {
                if (e.domEvent.detail === 2) {
                    editor.selectAll();
                    return e.preventDefault();
                }
                mouseHandler.$clickSelection = editor.selection.getLineRange(row);
            }
            mouseHandler.setState("selectByLines");
            mouseHandler.captureMouse(e);
            return e.preventDefault();
        });


        var tooltipTimeout: number;
        var mouseEvent: EditorMouseEvent;
        var tooltipAnnotation: string;

        function showTooltip() {
            const row = mouseEvent.getDocumentPosition().row;
            const annotation = gutter.$annotations[row];
            if (!annotation) {
                return hideTooltip(void 0, editor);
            }

            const session = editor.getSession();
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
                var gutterElement = gutter.$cells[editor.getSession().documentToScreenRow(row, 0)].element;
                var rect = gutterElement.getBoundingClientRect();
                var style = tooltip.getElement().style;
                style.left = rect.right + "px";
                style.top = rect.bottom + "px";
            }
        }

        function hideTooltip(event: EditorChangeSessionEvent, editor: Editor) {
            if (tooltipTimeout) {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = undefined;
            }
            if (tooltipAnnotation) {
                tooltip.hide();
                tooltipAnnotation = null;
                editor.off("mousewheel", hideTooltip);
            }
        }

        function moveTooltip(event: EditorMouseEvent) {
            tooltip.setPosition(event.clientX, event.clientY);
        }

        mouseHandler.editor.setDefaultHandler("guttermousemove", function (e: EditorMouseEvent) {
            // FIXME: Obfuscating the type of target to thwart compiler.
            var target: any = e.domEvent.target || e.domEvent.srcElement;
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
            tooltipTimeout = setTimeout(function () {
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

            tooltipTimeout = setTimeout(function () {
                tooltipTimeout = null;
                hideTooltip(void 0, editor);
            }, 50);
        });

        editor.on("changeSession", hideTooltip);
    }
}
