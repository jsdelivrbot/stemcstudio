import { comparePositions } from "./Position";
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
    private ranges: Range[] | null;
    private tabstops: Tabstop[] | null;
    private $openTabstops: Tabstop[] | null;
    private selectedTabstop: Tabstop | null;
    /**
     * The attach and detach lifecycle means that the editor comes and goes.
     */
    private editor: Editor | null;
    private keyboardHandler = new KeyboardHandler();
    private $onChange: (delta: Delta, editor: Editor) => void;
    private $onChangeSelection: (timeout: number) => void;
    private $onChangeSession: (event: any, editor: Editor) => void;
    private $onAfterExec: (e: { command: Command }) => void;
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
                "Return": function (editor: Editor) {
                    if (editor.tabstopManager) {
                        editor.tabstopManager.tabNext(1);
                    }
                    return false;
                }
            });
    }

    /**
     * @param editor
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
            this.editor.off("change", this.$onChange);
            this.editor.off("changeSelection", this.$onChangeSelection);
            this.editor.off("changeSession", this.$onChangeSession);
            this.editor.commands.off("afterExec", this.$onAfterExec);
            this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
            this.editor.tabstopManager = null;
            this.editor = null;
        }
    }

    private onChange(delta: Delta, editor: Editor) {

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
            const changedOutside = ts && !ts.some(function (range: Range) {
                return comparePositions(range.start, start) <= 0 && comparePositions(range.end, end) >= 0;
            });
            if (changedOutside)
                return this.detach();
        }
        if (this.ranges) {
            const ranges = this.ranges;
            for (let i = 0; i < ranges.length; i++) {
                let r = ranges[i];
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
            const text = session.getTextRange(ts.firstNonLinked);
            for (let i = ts.length; i--;) {
                const range = ts[i];
                if (!range.linked) {
                    continue;
                }
                if (range.original) {
                    const fmt = this.editor.snippetManager.tmStrFormat(text, range.original);
                    session.replace(range, fmt);
                }
            }
        }
        this.$inChange = false;
    }

    // TODO: CommandManagerAfterExecEvent.
    private onAfterExec(e: { command: Command }) {
        if (e.command && !e.command.readOnly)
            this.updateLinkedFields();
    }

    // TODO: EditorChangeSelectionEvent?
    private onChangeSelection(event: any, editor: Editor) {
        if (!this.editor) {
            return;
        }
        const selection = editor.selection;
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
                    const containsLead = ranges[i].contains(lead.row, lead.column);
                    const containsAnchor = isEmpty || ranges[i].contains(anchor.row, anchor.column);
                    if (containsLead && containsAnchor)
                        return;
                }
            }
        }
        this.detach();
    }

    // TODO: EditorChangeSessionEvent.
    private onChangeSession(event: any, editor: Editor) {
        this.detach();
    }

    /**
     * @param dir
     */
    public tabNext(dir?: number): void {
        if (this.tabstops) {
            const max = this.tabstops.length;
            let index = this.index + (dir || 1);
            index = Math.min(Math.max(index, 1), max);
            if (index === max) {
                index = 0;
            }
            this.selectTabstop(index);
            if (index === 0) {
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
                const sel: Selection = editor.multiSelect;
                sel.toSingleRange(ts.firstNonLinked.clone());
                for (let i = ts.length; i--;) {
                    if (ts.hasLinkedRanges && ts[i].linked) {
                        continue;
                    }
                    sel.addRange(ts[i].clone(), true);
                }
                // todo investigate why is this needed
                if (sel.ranges[0]) {
                    sel.addRange(sel.ranges[0].clone());
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
     * @param tabstops
     * @param start
     * @param end
     * @param selectionIndex This parameter is not being used.
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

        const i = this.index;
        const arg: any[] = [i + 1, 0];
        if (this.ranges) {
            const ranges = this.ranges;
            tabstops.forEach((ts: Tabstop, index: number) => {
                if (Array.isArray(this.$openTabstops)) {
                    const dest = this.$openTabstops[index] || ts;

                    for (let i = ts.length; i--;) {
                        let originalRange = ts[i];
                        const range: Range = Range.fromPoints(originalRange.start, originalRange.end || originalRange.start);
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
        if (this.editor) {
            const session = this.editor.session;
            ts.forEach(function (range: Range) {
                if (!range.markerId) {
                    range.markerId = session.addMarker(range, "ace_snippet-marker", "text");
                }
            });
        }
    }

    /**
     *
     */
    private removeTabstopMarkers(ts: Tabstop): void {
        if (this.editor) {
            const session = this.editor.session;
            ts.forEach(function (range: Range) {
                if (range.markerId) {
                    session.removeMarker(range.markerId);
                    range.markerId = null;
                }
            });
        }
    }

    /**
     * @param range
     */
    private removeRange(range: Range): void {
        if (range.tabstop) {
            let i = range.tabstop.indexOf(range);
            range.tabstop.splice(i, 1);
            if (this.ranges) {
                i = this.ranges.indexOf(range);
                this.ranges.splice(i, 1);
                if (this.editor) {
                    if (typeof range.markerId === 'number')
                        this.editor.session.removeMarker(range.markerId);
                    if (!range.tabstop.length) {
                        if (this.tabstops) {
                            i = this.tabstops.indexOf(range.tabstop);
                            if (i !== -1)
                                this.tabstops.splice(i, 1);
                            if (!this.tabstops.length)
                                this.detach();
                        }
                    }
                }
            }
        }
    }
}
