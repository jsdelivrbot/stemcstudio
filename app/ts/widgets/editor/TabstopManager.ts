import comparePoints from "./comparePoints";
import createDelayedCall from "./lib/lang/createDelayedCall";
import Delta from "./Delta";

import Command from './commands/Command';
import KeyboardHandler from "./keyboard/KeyboardHandler";
import Editor from './Editor';
import Position from "./Position";
import Range from "./Range";
import Selection from "./Selection";
import Tabstop from './Tabstop';

function movePoint(point: Position, diff: Position) {
    if (point.row === 0) {
        point.column += diff.column;
    }
    point.row += diff.row;
}

function moveRelative(point: Position, start: Position) {
    if (point.row === start.row) {
        point.column -= start.column;
    }
    point.row -= start.row;
}

/**
 *
 */
export default class TabstopManager {
    /**
     * The current tabstop index.
     */
    private index: number;
    private ranges: Range[];
    private tabstops: Tabstop[];
    private $openTabstops: Tabstop[];
    private selectedTabstop: Tabstop;
    private editor: Editor;
    private keyboardHandler = new KeyboardHandler();
    private $onChange;
    private $onChangeSelection;
    private $onChangeSession;
    private $onAfterExec;
    private $inChange: boolean;

    /**
     *
     * @param editor
     */
    constructor(editor: Editor) {

        this.$onChange = this.onChange.bind(this);
        this.$onChangeSelection = createDelayedCall(this.onChangeSelection.bind(this)).schedule;
        this.$onChangeSession = this.onChangeSession.bind(this);
        this.$onAfterExec = this.onAfterExec.bind(this);

        this.attach(editor);
        this.keyboardHandler.bindKeys(
            {
                "Tab": (editor: Editor) => {
                    if (editor.snippetManager && editor.snippetManager.expandWithTab(editor)) {
                        return;
                    }
                    else {
                        this.tabNext(1);
                    }
                },
                "Shift-Tab": (editor: Editor) => {
                    this.tabNext(-1);
                },
                "Esc": (editor: Editor) => {
                    this.detach();
                },
                "Return": function(editor: Editor) {
                    editor.tabstopManager.tabNext(1);
                    return false;
                }
            });
    }

    /**
     * @method attach
     * @param editor {Editor}
     * @return {void}
     * @private
     */
    private attach(editor: Editor): void {
        editor.tabstopManager = this;
        this.index = 0;
        this.ranges = [];
        this.tabstops = [];
        this.$openTabstops = null;
        this.selectedTabstop = null;

        this.editor = editor;
        this.editor.on("change", this.$onChange);
        this.editor.on("changeSelection", this.$onChangeSelection);
        this.editor.on("changeSession", this.$onChangeSession);
        this.editor.commands.on("afterExec", this.$onAfterExec);
        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    }

    /**
     * @method detach
     * @return {void}
     * @private
     */
    private detach(): void {
        this.tabstops.forEach(this.removeTabstopMarkers, this);
        this.ranges = null;
        this.tabstops = null;
        this.selectedTabstop = null;
        this.editor.off("change", this.$onChange);
        this.editor.off("changeSelection", this.$onChangeSelection);
        this.editor.off("changeSession", this.$onChangeSession);
        this.editor.commands.off("afterExec", this.$onAfterExec);
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.tabstopManager = null;
        this.editor = null;
    }

    private onChange(delta: Delta, editor: Editor) {

        var isRemove = delta.action === "remove";

        var start = delta.start;
        var end = delta.end;
        var startRow = start.row;
        var endRow = end.row;
        var lineDif = endRow - startRow;
        var colDiff = end.column - start.column;

        if (isRemove) {
            lineDif = -lineDif;
            colDiff = -colDiff;
        }
        if (!this.$inChange && isRemove) {
            var ts = this.selectedTabstop;
            var changedOutside = ts && !ts.some(function(range: Range) {
                return comparePoints(range.start, start) <= 0 && comparePoints(range.end, end) >= 0;
            });
            if (changedOutside)
                return this.detach();
        }
        var ranges = this.ranges;
        for (var i = 0; i < ranges.length; i++) {
            let r = ranges[i];
            if (r.end.row < start.row)
                continue;

            if (isRemove && comparePoints(start, r.start) < 0 && comparePoints(end, r.end) > 0) {
                this.removeRange(r);
                i--;
                continue;
            }

            if (r.start.row === startRow && r.start.column > start.column)
                r.start.column += colDiff;
            if (r.end.row === startRow && r.end.column >= start.column)
                r.end.column += colDiff;
            if (r.start.row >= startRow)
                r.start.row += lineDif;
            if (r.end.row >= startRow)
                r.end.row += lineDif;

            if (comparePoints(r.start, r.end) > 0)
                this.removeRange(r);
        }
        if (!ranges.length)
            this.detach();
    }

    private updateLinkedFields() {

        var ts = this.selectedTabstop;

        if (!ts || !ts.hasLinkedRanges) {
            return;
        }

        this.$inChange = true;
        var session = this.editor.getSession();
        var text = session.getTextRange(ts.firstNonLinked);
        for (var i = ts.length; i--;) {
            var range = ts[i];
            if (!range.linked) {
                continue;
            }
            var fmt = this.editor.snippetManager.tmStrFormat(text, range.original);
            session.replace(range, fmt);
        }
        this.$inChange = false;
    }

    // TODO: CommandManagerAfterExecEvent.
    private onAfterExec(e: { command: Command }) {
        if (e.command && !e.command.readOnly)
            this.updateLinkedFields();
    }

    // TODO: EditorChangeSelectionEvent?
    private onChangeSelection(event, editor: Editor) {
        if (!this.editor)
            return;
        var lead = this.editor.selection.lead;
        var anchor = this.editor.selection.anchor;
        var isEmpty = this.editor.selection.isEmpty();
        for (var i = this.ranges.length; i--;) {
            if (this.ranges[i].linked)
                continue;
            var containsLead = this.ranges[i].contains(lead.row, lead.column);
            var containsAnchor = isEmpty || this.ranges[i].contains(anchor.row, anchor.column);
            if (containsLead && containsAnchor)
                return;
        }
        this.detach();
    }

    // TODO: EditorChangeSessionEvent.
    private onChangeSession(event, editor: Editor) {
        this.detach();
    }

    /**
     * @method tabNext
     * @param [dir] {number}
     * @return {void}
     */
    public tabNext(dir?: number): void {
        var max = this.tabstops.length;
        var index = this.index + (dir || 1);
        index = Math.min(Math.max(index, 1), max);
        if (index === max) {
            index = 0;
        }
        this.selectTabstop(index);
        if (index === 0) {
            this.detach();
        }
    }

    /**
     * @method selectTabstop
     * @param index {number}
     * @return {void}
     * @private
     */
    private selectTabstop(index: number): void {
        this.$openTabstops = null;
        var ts = this.tabstops[this.index];
        if (ts) {
            this.addTabstopMarkers(ts);
        }
        this.index = index;
        ts = this.tabstops[this.index];
        if (!ts || !ts.length) {
            return;
        }

        this.selectedTabstop = ts;

        if (!this.editor.inVirtualSelectionMode) {
            var sel: Selection = this.editor.multiSelect;
            sel.toSingleRange(ts.firstNonLinked.clone());
            for (var i = ts.length; i--;) {
                if (ts.hasLinkedRanges && ts[i].linked) {
                    continue;
                }
                sel.addRange(ts[i].clone(), true);
            }
            // todo investigate why is this needed
            if (sel.ranges[0])
                sel.addRange(sel.ranges[0].clone());
        }
        else {
            this.editor.selection.setRange(ts.firstNonLinked);
        }

        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    }

    /**
     * @method addTabstops
     * @param tabstops {Tabstop[]}
     * @param start {Position}
     * @param end {Position}
     * @param selectionIndex {number} This parameter is not being used.
     * @return {void}
     */
    public addTabstops(tabstops: Tabstop[], start: Position, end: Position, selectionIndex: number): void {
        if (!this.$openTabstops) {
            this.$openTabstops = [];
        }
        // add final tabstop if missing
        if (!tabstops[0]) {
            let p: Range = Range.fromPoints(end, end);
            moveRelative(p.start, start);
            moveRelative(p.end, start);
            // This assignment takes care of the Array<Range> part of the Tabstop.
            tabstops[0] = <Tabstop>[p];
            tabstops[0].index = 0;
        }

        var i = this.index;
        var arg: any[] = [i + 1, 0];
        var ranges = this.ranges;
        tabstops.forEach((ts: Tabstop, index: number) => {
            var dest = this.$openTabstops[index] || ts;

            for (var i = ts.length; i--;) {
                let originalRange = ts[i];
                var range: Range = Range.fromPoints(originalRange.start, originalRange.end || originalRange.start);
                movePoint(range.start, start);
                movePoint(range.end, start);
                range.original = originalRange;
                range.tabstop = dest;
                ranges.push(range);

                if (dest !== ts)
                    dest.unshift(range);
                else
                    dest[i] = range;

                if (originalRange.fmtString) {
                    range.linked = true;
                    dest.hasLinkedRanges = true;
                }
                else if (!dest.firstNonLinked) {
                    dest.firstNonLinked = range;
                }
            }
            if (!dest.firstNonLinked)
                dest.hasLinkedRanges = false;
            if (dest === ts) {
                arg.push(dest);
                this.$openTabstops[index] = dest;
            }
            this.addTabstopMarkers(dest);
        });

        if (arg.length > 2) {
            // when adding new snippet inside existing one, make sure 0 tabstop is at the end
            if (this.tabstops.length)
                arg.push(arg.splice(2, 1)[0]);
            this.tabstops.splice.apply(this.tabstops, arg);
        }
    }

    /**
     * @method addTabstopMarker
     * @param ts {Tabstop}
     * @return {void}
     * @private
     */
    private addTabstopMarkers(ts: Tabstop): void {
        var session = this.editor.session;
        ts.forEach(function(range: Range) {
            if (!range.markerId) {
                range.markerId = session.addMarker(range, "ace_snippet-marker", "text");
            }
        });
    }

    /**
     * @method removeTabstopMarkers
     * @param ts {Tabstop}
     * @return {void}
     * @private
     */
    private removeTabstopMarkers(ts: Tabstop): void {
        var session = this.editor.session;
        ts.forEach(function(range: Range) {
            session.removeMarker(range.markerId);
            range.markerId = null;
        });
    }

    /**
     * @method removeRange
     * @param range {Range}
     * @return {void}
     * @private
     */
    private removeRange(range: Range): void {
        var i = range.tabstop.indexOf(range);
        range.tabstop.splice(i, 1);
        i = this.ranges.indexOf(range);
        this.ranges.splice(i, 1);
        this.editor.session.removeMarker(range.markerId);
        if (!range.tabstop.length) {
            i = this.tabstops.indexOf(range.tabstop);
            if (i !== -1)
                this.tabstops.splice(i, 1);
            if (!this.tabstops.length)
                this.detach();
        }
    }
}
