import { Anchor } from '../Anchor';
import { Action } from '../keyboard/Action';
import { Completer } from '../Completer';
import { Completion } from '../Completion';
import { CompletionList } from '../CompletionList';
import { createDelayedCall } from '../lib/lang/createDelayedCall';
import { DelayedCall } from '../lib/lang/DelayedCall';
import { Editor } from '../Editor';
import { EditorMouseEvent } from '../EditorMouseEvent';
import { getCompletionPrefix } from './getCompletionPrefix';
import { KeyboardHandler } from '../keyboard/KeyboardHandler';
import { ListViewPopup } from './ListViewPopup';
import { PixelPosition } from '../PixelPosition';
import { Position } from 'editor-document';
import { Range } from '../Range';
// import retrievePrecedingIdentifier from "./retrievePrecedingIdentifier";
import { COMMAND_NAME_INSERT_STRING } from '../editor_protocol';

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
export class CompletionManager {

    /**
     *
     */
    public popup: ListViewPopup;
    /**
     * The tear-down function for the 'click' event on the popup.
     */
    private popupClickRemover: (() => void) | undefined;
    /**
     * The tear-down function for the 'show' event on the popup.
     */
    private popupShowRemover: (() => void) | undefined;
    /**
     * The tear-down function for the 'select' event on the popup.
     */
    private popupSelectRemover: (() => void) | undefined;
    /**
     * The tear-down function for the 'changeHoverMarker' event on the popup.
     */
    private popupHoverRemover: (() => void) | undefined;

    /**
     * The editor with which this completion manager is interacting.
     */
    private editor: Editor;

    /**
     * The completion manager
     */
    private readonly keyboardHandler = new KeyboardHandler<Editor>();

    /**
     * The completion manager is activated when the attach(editor) method is invoked and remains
     * so until the completion manager is detached from the editor.
     * TODO: This seems redundant. It is synonymous with being attached which should be indicated by the editor.
     */
    private activated: boolean;

    private changeTimer: DelayedCall;
    private gatherCompletionsId = 0;
    private base: Anchor | null;
    private completions: CompletionList | null;
    private commands: { [name: string]: Action<Editor> };

    /**
     * Determines what happens when the autocomplete list is presented.
     */
    public autoSelect = true;

    /**
     * Determines what happens when there is only one completion.
     */
    public autoInsert = false;

    /**
     *
     */
    // private exactMatch = false;

    private tooltipNode: HTMLDivElement | null;
    private tooltipTimer: DelayedCall;

    /**
     *
     */
    constructor() {
        /**
         *
         */
        const detachAction: Action<Editor> = (editor: Editor) => {
            this.detach();
        };
        /**
         *
         */
        const downAction: Action<Editor> = (editor: Editor) => {
            this.down();
        };

        this.commands = {
            "Up": (editor: Editor) => { this.goTo("up"); },
            "Down": (editor: Editor) => { this.goTo("down"); },
            "Ctrl-Up|Ctrl-Home": (editor: Editor) => { this.goTo("start"); },
            "Ctrl-Down|Ctrl-End": (editor: Editor) => { this.goTo("end"); },

            // "Space": (editor: Editor) => { this.detach(); editor.insert(" ", false); },
            "Esc": (editor: Editor) => { this.detach(); },
            "Return": (editor: Editor) => { return this.insertMatch(); },
            "Shift-Return": (editor: Editor) => { this.insertMatch(null, { deleteSuffix: true }); },
            "Tab": (editor: Editor) => {
                const result = this.insertMatch();
                if (!result) {
                    this.goTo("down");
                }
                else {
                    return result;
                }
            },

            "PageUp": (editor: Editor) => { this.goTo('pageUp'); },
            "PageDown": (editor: Editor) => { this.goTo('pageDown'); }
        };

        this.keyboardHandler.bindKey("Down", downAction);
        this.keyboardHandler.bindKey("Esc", detachAction);

        this.keyboardHandler.bindKeys(this.commands);

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
     *
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
        this.closePopup();

        if (this.base) {
            this.base.detach();
            this.base = null;
        }
        this.activated = false;
        this.completions = null;
    }

    /**
     *
     */
    private insertMatch(data?: Completion | null, options?: { deleteSuffix: boolean }): void {
        if (!data) {
            if (this.popup) {
                data = this.popup.getCompletionAtRow(this.popup.getRow());
            }
            else {
                return;
            }
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
            // TODO: add support for options.deleteSuffix
            // If we have filterText, remove that from the editor before performing the full insert.
            if (this.completions && this.completions.filterText) {
                const ranges = this.editor.selectionOrThrow().getAllRanges();
                for (const range of ranges) {
                    range.start.column -= this.completions.filterText.length;
                    this.editor.sessionOrThrow().remove(range);
                }
            }

            const insertstringCommand = this.editor.commands.getCommandByName(COMMAND_NAME_INSERT_STRING);
            this.editor.execCommand(insertstringCommand, data.value || data);
        }
        this.detach();
    }

    /**
     *
     */
    private goTo(where: 'up' | 'down' | 'start' | 'end' | 'pageUp' | 'pageDown'): void {

        if (this.popup) {
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
    }

    /**
     *
     */
    private down(): void {
        if (this.popup) {
            let row = this.popup.getRow();
            const maxRow = this.popup.getLength() - 1;
            row = (row >= maxRow) ? -1 : row + 1;
            this.popup.setRow(row);
        }
    }

    /**
     * 
     */
    private gatherCompletions(editor: Editor, position: Position, prefix: string, callback: (err: any, results?: { prefix: string; matches: Completion[]; finished: boolean }) => void): boolean {
        const session = editor.sessionOrThrow();

        this.base = new Anchor(session.docOrThrow(), position.row, position.column - prefix.length);
        this.base.insertRight = true;

        let matches: Completion[] = [];
        let total = editor.completers.length;

        editor.completers.forEach(function (completer: Completer, index: number) {
            completer.getCompletionsAtPosition(editor, position, prefix)
                .then((results) => {
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
                })
                .catch((err) => {
                    callback(err);
                });
        });
        return true;
    }

    /**
     * @param keepPopupPosition
     */
    private updateCompletions(keepPopupPosition: boolean): void {
        const editor = this.editor;
        const pos: Position = editor.getCursorPosition();
        // const session = editor.getSession();
        // const line = session.getLine(pos.row);
        if (keepPopupPosition && this.base && this.completions) {
            const range = new Range(this.base.row, this.base.column, pos.row, pos.column);
            const prefix = editor.sessionOrThrow().getTextRange(range);
            if (prefix === this.completions.filterText) {
                return;
            }
            this.completions.setFilter(prefix);
            if (!this.completions.filtered.length)
                return this.detach();

            if (this.completions.filtered.length === 1 && this.completions.filtered[0].value === prefix) {
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
                    const detachIfFinished = () => {
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
                    if (filtered.length === 1 && filtered[0].value === prefix)
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
     * @param editor
     * @param prefix
     * @param keepPopupPosition
     */
    private openPopup(editor: Editor, prefix: string, keepPopupPosition: boolean): void {

        if (!this.popup) {
            this.popup = new ListViewPopup(document.body || document.documentElement);
            this.popupClickRemover = this.popup.on("click", (e: EditorMouseEvent) => {
                this.insertMatch();
                e.stop();
            });
            this.popup.focus = this.editor.focus.bind(this.editor);
            this.popupShowRemover = this.popup.on('show', this.tooltipTimer.bind(null, null));
            this.popupSelectRemover = this.popup.on('select', this.tooltipTimer.bind(null, null));
            this.popupHoverRemover = this.popup.on('changeHoverMarker', this.tooltipTimer.bind(null, null));
        }

        if (this.completions) {
            this.popup.setCompletions(this.completions.filtered.sort(completionCompareFn));
        }
        else {
            this.popup.setCompletions([]);
        }

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

    /**
     * 
     */
    private closePopup(): void {
        if (this.popup && this.popup.isOpen) {
            this.popup.hide();
        }
        if (this.popupClickRemover) {
            this.popupClickRemover();
            this.popupClickRemover = void 0;
        }
        if (this.popupShowRemover) {
            this.popupShowRemover();
            this.popupShowRemover = void 0;
        }
        if (this.popupSelectRemover) {
            this.popupSelectRemover();
            this.popupSelectRemover = void 0;
        }
        if (this.popupHoverRemover) {
            this.popupHoverRemover();
            this.popupHoverRemover = void 0;
        }
    }

    /**
     * To make this fire, enter a period '.' when there is already a property.
     * Then use the right and left arrow keys.
     * As the number of characters selected increases, the items in the list are filtered.
     * 
     * We use the fat arrow to bind the method correctly so that we can used it directly as a handler. 
     */
    private editorChangeSelectionListener = () => {

        if (this.editor.selection) {
            const cursor = this.editor.selection.lead;
            if (this.base) {
                if (cursor.row !== this.base.row || cursor.column < this.base.column) {
                    this.detach();
                }
            }
        }

        if (this.activated) {
            this.changeTimer.schedule();
        }
        else {
            this.detach();
        }
    }

    /**
     * Clicking your mouse anywhere outside of the editor with which we are interacting will fire this listener.
     * 
     * We use the fat arrow to bind the method correctly so that we can used it directly as a handler. 
     */
    private blurListener = (e: FocusEvent) => {
        // We have to check if activeElement is a child of popup because
        // on IE preventDefault doesn't stop scrollbar from being focussed
        const el = document.activeElement;
        const textArea = this.editor.textInput.getElement();
        const fromTooltip = e.relatedTarget && this.tooltipNode && this.tooltipNode.contains(e.relatedTarget as Node);
        // const fromTooltip = e.relatedTarget && e.relatedTarget === this.tooltipNode;
        const container = this.popup && this.popup.container;
        if (el !== textArea && el.parentNode !== container && !fromTooltip && el !== this.tooltipNode && e.relatedTarget !== textArea) {
            this.detach();
        }
    }

    /**
     * Fires when the user clicks outside of the completions list.
     */
    private mousedownListener = (e: EditorMouseEvent) => {
        this.detach();
    }

    /**
     * Fires when the user scrolls the mouse outside of the completions list.
     */
    private mousewheelListener = (e: EditorMouseEvent) => {
        this.detach();
    }

    /**
     *
     */
    public cancelContextMenu(): void {
        this.editor.cancelMouseContextMenu();
    }

    /**
     *
     */
    private updateDocTooltip(): void {
        if (this.popup) {
            const popup = this.popup;
            const all = popup.getCompletions();
            const selected = all && (all[popup.getHoveredRow()] || all[popup.getRow()]);
            let doc: any = null;
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
    }

    /**
     *
     */
    private showDocTooltip(item: { docHTML?: string; docText?: string }): void {
        if (!this.tooltipNode) {
            this.tooltipNode = this.editor.container.ownerDocument.createElement('div');
            this.tooltipNode.className = "ace_tooltip ace_doc-tooltip";
            this.tooltipNode.style.margin = '0';
            this.tooltipNode.style.pointerEvents = "auto";
            this.tooltipNode.tabIndex = -1;
            this.tooltipNode.onblur = this.blurListener;
        }

        const tooltipNode = this.tooltipNode;
        if (item.docHTML) {
            tooltipNode.innerHTML = item.docHTML;
        } else if (item.docText) {
            tooltipNode.textContent = item.docText;
        }

        if (!tooltipNode.parentNode) {
            document.body.appendChild(tooltipNode);
        }
        if (this.popup) {
            const popup = this.popup;
            const rect = popup.container.getBoundingClientRect();
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
        }
        tooltipNode.style.display = "block";
    }

    /**
     *
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
