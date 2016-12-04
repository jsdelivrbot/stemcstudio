import Anchor from '../Anchor';
import EditorAction from '../keyboard/EditorAction';
import Completer from './Completer';
import Completion from '../Completion';
import CompletionList from '../CompletionList';
import createDelayedCall from '../lib/lang/createDelayedCall';
import DelayedCall from '../lib/lang/DelayedCall';
import Editor from '../Editor';
import EditSession from '../EditSession';
import getCompletionPrefix from './getCompletionPrefix';
import KeyboardHandler from '../keyboard/KeyboardHandler';
import ListViewPopup from './ListViewPopup';
import PixelPosition from '../PixelPosition';
import Position from '../Position';
import Range from '../Range';
// import retrievePrecedingIdentifier from "./retrievePrecedingIdentifier";
import {COMMAND_NAME_INSERT_STRING} from '../editor_protocol';

const completionCompareFn = function (a: Completion, b: Completion) {
    return a.caption.toLowerCase() > b.caption.toLowerCase() ? +1 : -1;
};

//
// Flow:
// attach => updateCompletions => openPopup
//
// TODO:
// Make the logic manifest (keepPopupPosition, base, completions)
//

/**
 *
 */
export default class CompletionManager {

    /**
     *
     */
    public popup: ListViewPopup;

    /**
     * The editor with which the completion manager is interacting.
     */
    private editor: Editor;

    /**
     * The completion manager
     *
     * @property keyboardHandler
     * @type KeyboardHandler
     */
    private keyboardHandler = new KeyboardHandler();
    // FIXME: Make this a readOnly property.
    /**
     * The completion manager is activated when the attach(editor) method is invoked and remains
     * so until the completion manager is detached from the editor.
     * @property activated
     * @type boolean
     */
    public activated: boolean;
    private changeTimer: DelayedCall;
    private gatherCompletionsId = 0;
    private base: Anchor;
    private completions: CompletionList;
    private commands: { [name: string]: EditorAction };

    /**
     * Determines what happens when the autocomplete list is presented.
     *
     * @property autoSelect
     * @type boolean
     */
    public autoSelect: boolean;

    /**
     * Determines what happens when there is only one completion.
     *
     * @property autoInsert
     * @type boolean
     */
    public autoInsert: boolean;

    /**
     * @property exactMatch
     * @type boolean
     */
    private exactMatch: boolean;

    private tooltipNode: HTMLDivElement;
    private tooltipTimer: DelayedCall;

    /**
     *
     */
    constructor() {
        this.autoInsert = false;
        this.autoSelect = true;
        this.exactMatch = false;

        /**
         *
         */
        const DETACH: EditorAction = (editor: Editor) => { this.detach(); };
        const DOWN: EditorAction = (editor: Editor) => { this.down(); };

        this.commands = {
            "Up": (editor: Editor) => { this.goTo("up"); },
            "Ctrl-Up|Ctrl-Home": (editor: Editor) => { this.goTo("start"); },
            "Ctrl-Down|Ctrl-End": (editor: Editor) => { this.goTo("end"); },

            "Space": (editor: Editor) => { this.detach(); editor.insert(" ", false); },
            "Return": (editor: Editor) => { return this.insertMatch(); },
            "Shift-Return": (editor: Editor) => { this.insertMatch(true); },
            "Tab": (editor: Editor) => {
                var result = this.insertMatch();
                if (!result && !editor.tabstopManager) {
                    this.goTo("down");
                }
                else
                    return result;
            },

            "PageUp": (editor: Editor) => { this.goTo('pageUp'); },
            "PageDown": (editor: Editor) => { this.goTo('pageDown'); }
        };

        this.keyboardHandler.bindKey("Down", DOWN);
        this.keyboardHandler.bindKey("Esc", DETACH);

        this.keyboardHandler.bindKeys(this.commands);

        // FIXME: This binding to methods is a bit klunky by ES6 standards.
        // We should be able to say...
        this.blurListener = () => {
            // Do something.
        };
        this.blurListener = this.blurListener.bind(this);
        this.editorChangeSelectionListener = this.editorChangeSelectionListener.bind(this);
        this.mousedownListener = this.mousedownListener.bind(this);
        this.mousewheelListener = this.mousewheelListener.bind(this);

        // By not specifying a timeout value, the callback will be called ASAP.
        this.changeTimer = createDelayedCall(() => {
            this.updateCompletions(true);
        });

        this.tooltipTimer = createDelayedCall(() => {
            this.updateDocTooltip();
        }, 50);
    }

    // TODO: attach and detach should look more complementary.

    /**
     * This method is called in order to display the completions list.
     * It is typically called as part of an editor action.
     *
     * @method attach
     * @param editor {Editor}
     * @return {void}
     */
    public attach(editor: Editor): void {

        if (this.editor) {
            this.detach();
        }

        this.activated = true;

        this.editor = editor;

        if (editor.completionManager !== this) {
            if (editor.completionManager) {
                editor.completionManager.detach();
            }
            editor.completionManager = this;
        }

        editor.keyBinding.addKeyboardHandler(this.keyboardHandler);

        editor.on("changeSelection", this.editorChangeSelectionListener);
        editor.on("blur", this.blurListener);
        editor.on("mousedown", this.mousedownListener);
        editor.on("mousewheel", this.mousewheelListener);

        this.updateCompletions(false);
    }

    /**
     * @method detach
     * @return {void}
     */
    public detach(): void {
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);

        this.editor.off("changeSelection", this.editorChangeSelectionListener);
        this.editor.off("blur", this.blurListener);
        this.editor.off("mousedown", this.mousedownListener);
        this.editor.off("mousewheel", this.mousewheelListener);

        this.changeTimer.cancel();
        this.hideDocTooltip();

        this.gatherCompletionsId += 1;
        if (this.popup && this.popup.isOpen) {
            this.popup.hide();
        }

        if (this.base) {
            this.base.detach();
            this.base = null;
        }
        this.activated = false;
        this.completions = null;

        // TODO: Shouldn't we set the editor property to undefined?
    }

    /**
     * @method insertMatch
     * @param [data] {Completion}
     * @return {void}
     * @private
     */
    private insertMatch(data?: Completion): void {
        if (!data) {
            data = this.popup.getData(this.popup.getRow());
        }

        if (!data) {
            return;
        }

        // If the completion specifies a completer and that completer supports the
        // insertMatch method, allow the completer to perform the insert.
        if (data.completer && data.completer.insertMatch) {
            data.completer.insertMatch(this.editor);
        }
        else {
            // If we have filterText, remove that from the editor before performing the full insert.
            if (this.completions.filterText) {
                const ranges: Range[] = this.editor.selection.getAllRanges();
                for (let i = 0, iLength = ranges.length; i < iLength; i++) {
                    const range = ranges[i];
                    range.start.column -= this.completions.filterText.length;
                    this.editor.getSession().remove(range);
                }
            }

            if (data.snippet) {
                // FIXME TODO: The existing implementation made use of a global snippet manager.
                // snippetManager.insertSnippet(this.editor, data.snippet);
            }
            else {
                const insertstringCommand = this.editor.commands.getCommandByName(COMMAND_NAME_INSERT_STRING);
                this.editor.execCommand(insertstringCommand, data.value || data);
            }
        }
        this.detach();
    }

    /**
     * @method goTo
     * @param where {string}
     * @return {void}
     */
    private goTo(where: string): void {

        let row = this.popup.getRow();
        const max = this.popup.getLength() - 1;

        switch (where) {
            case "up": row = row <= 0 ? max : row - 1; break;
            case "down": row = row >= max ? -1 : row + 1; break;
            case "start": row = 0; break;
            case "end": row = max; break;
            default: {
                // Do nothing.
            }
        }

        this.popup.setRow(row);
    }

    /**
     * @method down
     * @return {void}
     * @private
     */
    private down(): void {
        let row = this.popup.getRow();
        const max = this.popup.getLength() - 1;
        row = row >= max ? -1 : row + 1;
        this.popup.setRow(row);
    }

    /**
     * 
     */
    private gatherCompletions(editor: Editor, pos: Position, prefix: string, callback: (err, results?: { prefix: string; matches: Completion[]; finished: boolean }) => any): boolean {
        const session: EditSession = editor.getSession();

        this.base = new Anchor(session.doc, pos.row, pos.column - prefix.length);
        this.base.insertRight = true;

        let matches: Completion[] = [];
        let total = editor.completers.length;

        editor.completers.forEach(function (completer: Completer, index: number) {
            completer.getCompletions(editor, session, pos, prefix, function (err, results: Completion[]) {
                if (err) {
                    callback(err);
                }
                else {
                    if (results) {
                        matches = matches.concat(results);
                    }
                    // const pos: Position = editor.getCursorPosition();
                    // const line = session.getLine(pos.row);
                    // prefix = retrievePrecedingIdentifier(line, pos.column, results[0] && results[0].identifierRegex);
                    callback(null, {
                        prefix: prefix,
                        matches: matches,
                        finished: (--total === 0)
                    });
                }
            });
        });
        return true;
    }

    // FIXME: Probably should have an async callback for handling errors.
    /**
     * @method updateCompletions
     * @param keepPopupPosition {boolean}
     * @return {void}
     * @private
     */
    private updateCompletions(keepPopupPosition: boolean): void {
        const editor = this.editor;
        const pos: Position = editor.getCursorPosition();
        // const session = editor.getSession();
        // const line = session.getLine(pos.row);
        if (keepPopupPosition && this.base && this.completions) {
            const range = new Range(this.base.row, this.base.column, pos.row, pos.column);
            const prefix = editor.getSession().getTextRange(range);
            if (prefix === this.completions.filterText) {
                return;
            }
            this.completions.setFilter(prefix);
            if (!this.completions.filtered.length)
                return this.detach();

            if (this.completions.filtered.length === 1 && this.completions.filtered[0].value === prefix && !this.completions.filtered[0].snippet) {
                return this.detach();
            }

            // Here we know keepPopupPosition is true.
            this.openPopup(editor, prefix, keepPopupPosition);
        }
        else {
            // Save current gatherCompletions session, session is close when a match is insert
            const _id = this.gatherCompletionsId;
            const prefix = getCompletionPrefix(editor);
            // const prefix = retrievePrecedingIdentifier(line, pos.column);

            this.gatherCompletions(editor, pos, prefix, (err, results: { prefix: string; matches: Completion[]; finished: boolean }) => {

                if (err) {
                    console.warn(`gatherCompletions => ${err}`);
                }
                else {
                    // Only detach if result gathering is finished
                    var detachIfFinished = () => {
                        if (!results.finished) return;
                        return this.detach();
                    };

                    const prefix = results.prefix;
                    const matches = results && results.matches;

                    if (!matches || !matches.length)
                        return detachIfFinished();

                    // Wrong prefix or wrong session -> ignore
                    if (prefix.indexOf(results.prefix) !== 0 || _id !== this.gatherCompletionsId) {
                        return;
                    }

                    this.completions = new CompletionList(matches);
                    // We could also provide the filterText to the constructor of the CompletionList.
                    this.completions.setFilter(prefix);
                    const filtered = this.completions.filtered;

                    // No results
                    if (!filtered.length)
                        return detachIfFinished();

                    // One result equal to the prefix.
                    if (filtered.length === 1 && filtered[0].value === prefix && !filtered[0].snippet)
                        return detachIfFinished();

                    // Autoinsert if one result
                    if (this.autoInsert && filtered.length === 1) {
                        return this.insertMatch(filtered[0]);
                    }

                    // Here either keepPopupPosition is false or (this.base && this.completions) is false.
                    this.openPopup(editor, prefix, keepPopupPosition);
                }
            });
        }
    }

    /**
     * @method openPopup
     * @param editor {Editor}
     * @param prefix {string}
     * @param keepPopupPosition {boolean}
     * @return {void}
     * @private
     */
    private openPopup(editor: Editor, prefix: string, keepPopupPosition: boolean): void {

        if (!this.popup) {
            this.popup = new ListViewPopup(document.body || document.documentElement);
            // FIXME: TypeSafety on e.
            this.popup.on("click", (e: any) => {
                this.insertMatch();
                e.stop();
            });
            this.popup.focus = this.editor.focus.bind(this.editor);
            this.popup.on('show', this.tooltipTimer.bind(null, null));
            this.popup.on('select', this.tooltipTimer.bind(null, null));
            this.popup.on('changeHoverMarker', this.tooltipTimer.bind(null, null));
        }

        this.popup.setData(this.completions.filtered.sort(completionCompareFn));

        // We've already done this when we attached to the editor.
        // editor.keyBinding.addKeyboardHandler(this.keyboardHandler);

        this.popup.setRow(this.autoSelect ? 0 : -1);

        const renderer = editor.renderer;
        if (!keepPopupPosition) {
            this.popup.setThemeCss(editor.getTheme(), void 0);
            this.popup.setThemeDark(true);
            this.popup.setFontSize(editor.getFontSize());

            const lineHeight = renderer.layerConfig.lineHeight;

            const pos: PixelPosition = renderer.getPixelPosition(this.base, /*onScreen*/true);
            pos.left -= this.popup.getTextLeftOffset();

            const rect: ClientRect = editor.container.getBoundingClientRect();
            pos.top += rect.top - renderer.layerConfig.offset;
            pos.left += rect.left - renderer.scrollLeft;
            pos.left += renderer.gutterWidth;

            this.popup.show(pos, lineHeight);
        }
        else if (keepPopupPosition && !prefix) {
            this.detach();
        }
    }

    private editorChangeSelectionListener(e) {

        const cursor = this.editor.selection.lead;
        if (cursor.row !== this.base.row || cursor.column < this.base.column) {
            this.detach();
        }

        if (this.activated) {
            this.changeTimer.schedule();
        }
        else {
            this.detach();
        }
    }

    private blurListener(e: MouseEvent) {
        // If the user clicked on an anchor in the tooltip, open that before
        // we close the tooltip
        if (e.relatedTarget && e.relatedTarget['nodeName'] === "A" && e.relatedTarget['href']) {
            window.open(e.relatedTarget['href'], "_blank");
        }
        // we have to check if activeElement is a child of popup because
        // on IE preventDefault doesn't stop scrollbar from being focussed
        const el = document.activeElement;
        const textArea = this.editor.textInput.getElement();
        const fromTooltip = e.relatedTarget && e.relatedTarget === this.tooltipNode;
        const container = this.popup && this.popup.container;
        if (el !== textArea && el.parentNode !== container && !fromTooltip && el !== this.tooltipNode && e.relatedTarget !== textArea) {
            this.detach();
        }
    }

    private mousedownListener(e) {
        this.detach();
    }

    private mousewheelListener(e) {
        this.detach();
    }

    /**
     * @method cancelContextMenu
     * @return {void}
     */
    public cancelContextMenu(): void {
        this.editor.cancelMouseContextMenu();
    }

    /**
     * @method updateDocTooltip
     * @return {void}
     * @private
     */
    private updateDocTooltip(): void {
        var popup = this.popup;
        var all = popup.data;
        var selected = all && (all[popup.getHoveredRow()] || all[popup.getRow()]);
        var doc = null;
        if (!selected || !this.editor || !this.popup.isOpen)
            return this.hideDocTooltip();
        this.editor.completers.some(function (completer) {
            if (completer.getDocTooltip) {
                doc = completer.getDocTooltip(selected);
            }
            return doc;
        });
        if (!doc)
            doc = selected;

        if (typeof doc === "string") {
            doc = { docText: doc };
        }
        if (!doc || !(doc.docHTML || doc.docText)) {
            return this.hideDocTooltip();
        }
        this.showDocTooltip(doc);
    }

    /**
     * @method showDocTooltip
     * @param item
     * @return {void}
     */
    private showDocTooltip(item: { docHTML?: string; docText?: string }): void {
        if (!this.tooltipNode) {
            this.tooltipNode = this.editor.container.ownerDocument.createElement('div');
            this.tooltipNode.className = "ace_tooltip ace_doc-tooltip";
            this.tooltipNode.style.margin = '0';
            this.tooltipNode.style.pointerEvents = "auto";
            this.tooltipNode.tabIndex = -1;
            this.tooltipNode.onblur = this.blurListener.bind(this);
        }

        var tooltipNode = this.tooltipNode;
        if (item.docHTML) {
            tooltipNode.innerHTML = item.docHTML;
        } else if (item.docText) {
            tooltipNode.textContent = item.docText;
        }

        if (!tooltipNode.parentNode) {
            document.body.appendChild(tooltipNode);
        }
        var popup = this.popup;
        var rect = popup.container.getBoundingClientRect();
        tooltipNode.style.top = popup.container.style.top;
        tooltipNode.style.bottom = popup.container.style.bottom;

        if (window.innerWidth - rect.right < 320) {
            tooltipNode.style.right = window.innerWidth - rect.left + "px";
            tooltipNode.style.left = "";
        }
        else {
            tooltipNode.style.left = (rect.right + 1) + "px";
            tooltipNode.style.right = "";
        }
        tooltipNode.style.display = "block";
    }

    /**
     * @param hideDocTooltip
     * @return {void}
     * @private
     */
    private hideDocTooltip(): void {
        this.tooltipTimer.cancel();
        if (!this.tooltipNode) return;
        const el = this.tooltipNode;
        if (!this.editor.isFocused() && document.activeElement === el) {
            this.editor.focus();
        }
        this.tooltipNode = null;
        if (el.parentNode) {
            el.parentNode.removeChild(el);
        }
    }
}
