import { comparePositions } from "editor-document";
import { createDelayedCall } from "./lib/lang/createDelayedCall";
import { Delta } from "editor-document";
import { Editor } from "./Editor";
import { Command } from './commands/Command';
import { KeyboardHandler } from "./keyboard/KeyboardHandler";
import { Position } from "editor-document";
import { Range } from "./Range";
import { clone, contains } from "./RangeHelpers";
import { Selection } from "./Selection";
import { Tabstop, TabstopRange } from './Tabstop';
import { OrientedRange } from '../editor/RangeBasic';

function movePoint(point: Position, diff: Position): void {
    if (point.row === 0) {
        point.column += diff.column;
    }
    point.row += diff.row;
}

function moveRelative(point: Position, start: Position): void {
    if (point.row === start.row) {
        point.column -= start.column;
    }
    point.row -= start.row;
}

enum Direction { FORWARD = +1, BACKWARD = -1 }

/**
 *
 */
export class TabstopManager {
    /**
     * The current tabstop index.
     */
    private index: number;
    /**
     *
     */
    private ranges: TabstopRange[] | null;
    private tabstops: Tabstop[] | null;
    private $openTabstops: Tabstop[] | null;
    private selectedTabstop: Tabstop | null;
    /**
     * The attach and detach lifecycle means that the editor comes and goes.
     */
    private editor: Editor | null;
    private keyboardHandler = new KeyboardHandler<Editor>();
    private $onChangeSelection: (timeout: number) => void;
    private $inChange: boolean;

    /**
     *
     */
    constructor(editor: Editor) {

        this.$onChangeSelection = createDelayedCall(this.onChangeSelection).schedule;

        this.attach(editor);
        this.keyboardHandler.bindKeys(
            {
                "Tab": (editor) => {
                    if (editor.expandSnippetWithTab()) {
                        return;
                    }
                    this.tabNext(Direction.FORWARD);
                },
                "Shift-Tab": (editor) => {
                    this.tabNext(Direction.BACKWARD);
                },
                "Esc": (editor) => {
                    this.detach();
                },
                "Return": function (editor) {
                    return false;
                }
            });
    }

    /**
     *
     */
    private attach(editor: Editor): void {
        editor.tabstopManager = this;
        this.index = 0;
        this.ranges = [];
        this.tabstops = [];
        this.$openTabstops = null;
        this.selectedTabstop = null;

        this.editor = editor;
        this.editor.on("change", this.onChange);
        this.editor.on("changeSelection", this.$onChangeSelection);
        this.editor.on("changeSession", this.onChangeSession);
        this.editor.commands.on("afterExec", this.onAfterExec);
        this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
    }

    /**
     *
     */
    private detach(): void {
        if (this.tabstops) {
            this.tabstops.forEach(this.removeTabstopMarkers, this);
        }
        this.ranges = null;
        this.tabstops = null;
        this.selectedTabstop = null;
        if (this.editor) {
            this.editor.off("change", this.onChange);
            this.editor.off("changeSelection", this.$onChangeSelection);
            this.editor.off("changeSession", this.onChangeSession);
            this.editor.commands.off("afterExec", this.onAfterExec);
            this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
            this.editor.tabstopManager = null;
            this.editor = null;
        }
    }

    private onChange = (delta: Delta, editor: Editor): boolean | void => {

        const isRemove = delta.action === "remove";

        const start = delta.start;
        const end = delta.end;
        const startRow = start.row;
        const endRow = end.row;
        let lineDif = endRow - startRow;
        let colDiff = end.column - start.column;

        if (isRemove) {
            lineDif = -lineDif;
            colDiff = -colDiff;
        }
        if (!this.$inChange && isRemove) {
            const ts = this.selectedTabstop;
            const changedOutside = ts && !ts.some(function (range) {
                return comparePositions(range.start, start) <= 0 && comparePositions(range.end, end) >= 0;
            });
            if (changedOutside) {
                return this.detach();
            }
        }
        if (this.ranges) {
            const ranges = this.ranges;
            for (let i = 0; i < ranges.length; i++) {
                const r = ranges[i];
                if (r.end.row < start.row)
                    continue;

                if (isRemove && comparePositions(start, r.start) < 0 && comparePositions(end, r.end) > 0) {
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

                if (comparePositions(r.start, r.end) > 0) {
                    this.removeRange(r);
                }
            }
            if (!ranges.length) {
                this.detach();
            }
        }
    }

    private updateLinkedFields() {
        const ts = this.selectedTabstop;
        if (!ts || !ts.hasLinkedRanges) {
            return;
        }
        this.$inChange = true;
        if (this.editor) {
            const session = this.editor.getSession();
            if (session) {
                const text = session.getTextRange(ts.firstNonLinked);
                for (let i = ts.length; i--;) {
                    const range = ts[i];
                    if (!range.linked) {
                        continue;
                    }
                    const fmt = this.editor.snippetManager.tmStrFormat(text, range.original);
                    session.replace(range, fmt);
                }
            }
        }
        this.$inChange = false;
    }

    // TODO: CommandManagerAfterExecEvent.
    private onAfterExec = (e: { command: Command<Editor> }) => {
        if (e.command && !e.command.readOnly) {
            this.updateLinkedFields();
        }
    }

    // TODO: EditorChangeSelectionEvent?
    private onChangeSelection = () => {
        if (!this.editor) {
            return;
        }
        const selection = this.editor.selection;
        if (selection) {
            const lead = selection.lead;
            const anchor = selection.anchor;
            const isEmpty = selection.isEmpty();
            if (this.ranges) {
                const ranges = this.ranges;
                for (let i = ranges.length; i--;) {
                    if (ranges[i].linked) {
                        continue;
                    }
                    const containsLead = contains(ranges[i], lead.row, lead.column);
                    const containsAnchor = isEmpty || contains(ranges[i], anchor.row, anchor.column);
                    if (containsLead && containsAnchor) {
                        return;
                    }
                }
            }
        }
        this.detach();
    }

    // TODO: EditorChangeSessionEvent.
    private onChangeSession = (event: any, editor: Editor) => {
        this.detach();
    }

    /**
     *
     */
    public tabNext(direction: Direction = 1): void {
        if (this.tabstops) {
            const max = this.tabstops.length;
            const index = Math.min(Math.max(this.index + direction, 1), max);
            if (index !== 0 && index !== max) {
                this.selectTabstop(index);
            }
            else {
                this.selectTabstop(0);
                this.detach();
            }
        }
    }

    /**
     *
     */
    private selectTabstop(index: number): void {
        this.$openTabstops = null;
        let ts = this.tabstops ? this.tabstops[this.index] : undefined;
        if (ts) {
            this.addTabstopMarkers(ts);
        }
        this.index = index;
        ts = this.tabstops ? this.tabstops[this.index] : undefined;
        if (!ts || !ts.length) {
            return;
        }

        this.selectedTabstop = ts;

        if (this.editor) {
            const editor = this.editor;
            if (!editor.inVirtualSelectionMode) {
                const sel: Selection = editor.multiSelectOrThrow();
                sel.toSingleRange(ts.firstNonLinked.clone());
                for (let i = ts.length; i--;) {
                    if (ts.hasLinkedRanges && ts[i].linked) {
                        continue;
                    }
                    sel.addRange(ts[i].clone(), true);
                }
                // todo investigate why is this needed
                if (sel.ranges[0]) {
                    sel.addRange(clone(sel.ranges[0]) as OrientedRange);
                }
            }
            else {
                if (editor.selection) {
                    editor.selection.setRange(ts.firstNonLinked);
                }
            }

            this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
        }
    }

    /**
     * selectionIndex is not used.
     */
    public addTabstops(tabstops: Tabstop[], start: Position, end: Position, selectionIndex: number | false): void {
        if (!this.$openTabstops) {
            this.$openTabstops = [];
        }
        // add final tabstop if missing
        if (!tabstops[0]) {
            const p = <TabstopRange>Range.fromPoints(end, end);
            moveRelative(p.start, start);
            moveRelative(p.end, start);
            // This assignment takes care of the Array<Range> part of the Tabstop.
            tabstops[0] = <Tabstop>[p];
            tabstops[0].index = 0;
        }

        const i = this.index;
        const arg: (number | Tabstop)[] = [i + 1, 0];
        if (this.ranges) {
            const ranges = this.ranges;
            tabstops.forEach((ts: Tabstop, index: number) => {
                if (Array.isArray(this.$openTabstops)) {
                    const dest = this.$openTabstops[index] || ts;

                    for (let i = ts.length; i--;) {
                        let originalRange = ts[i];
                        // The cast to a decorated Range is justified by setting additional properties.
                        const range = <TabstopRange>Range.fromPoints(originalRange.start, originalRange.end || originalRange.start);
                        movePoint(range.start, start);
                        movePoint(range.end, start);
                        // TODO: How can this work?
                        // TODO: Answer may be related to snippet formatting only happening for links and nested variables. 
                        range.original = <any>originalRange;
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
                    if (!dest.firstNonLinked) {
                        dest.hasLinkedRanges = false;
                    }
                    if (dest === ts) {
                        arg.push(dest);
                        this.$openTabstops[index] = dest;
                    }
                    this.addTabstopMarkers(dest);
                }
            });
        }

        if (arg.length > 2) {
            // when adding new snippet inside existing one, make sure 0 tabstop is at the end
            if (this.tabstops) {
                if (this.tabstops.length) {
                    arg.push(arg.splice(2, 1)[0]);
                }
                this.tabstops.splice.apply(this.tabstops, arg);
            }
        }
    }

    /**
     *
     */
    private addTabstopMarkers(ts: Tabstop): void {
        const editor = this.editor;
        if (editor) {
            ts.forEach(function (range) {
                if (!range.markerId) {
                    range.markerId = editor.addMarker(range, "ace_snippet-marker", "text");
                }
            });
        }
    }

    /**
     *
     */
    private removeTabstopMarkers(ts: Tabstop): void {
        const editor = this.editor;
        if (editor) {
            ts.forEach(function (range) {
                if (typeof range.markerId === 'number') {
                    editor.removeMarker(range.markerId);
                    range.markerId = null;
                }
            });
        }
    }

    /**
     *
     */
    private removeRange(range: TabstopRange): void {
        const tabstop = range.tabstop;
        if (tabstop) {
            const i = tabstop.indexOf(range);
            tabstop.splice(i, 1);
            if (this.ranges) {
                const i = this.ranges.indexOf(range);
                this.ranges.splice(i, 1);
                if (this.editor) {
                    if (typeof range.markerId === 'number') {
                        const editor = this.editor;
                        if (editor) {
                            editor.removeMarker(range.markerId);
                        }
                    }
                    if (tabstop.length === 0) {
                        if (this.tabstops) {
                            const i = this.tabstops.indexOf(tabstop);
                            if (i >= 0) {
                                this.tabstops.splice(i, 1);
                            }
                            if (this.tabstops.length === 0) {
                                this.detach();
                            }
                        }
                    }
                }
            }
        }
    }
}
