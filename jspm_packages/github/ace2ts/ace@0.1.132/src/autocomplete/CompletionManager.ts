import Anchor from '../Anchor';
import EditorAction from '../keyboard/EditorAction';
import Completer from './Completer';
import Completion from '../Completion';
import CompletionList from '../CompletionList';
import {delayedCall} from "../lib/lang";
import Editor from '../Editor';
import EditSession from '../EditSession';
import KeyboardHandler from '../keyboard/KeyboardHandler';
import ListViewPopup from './ListViewPopup';
import PixelPosition from '../PixelPosition';
import Position from '../Position';
import Range from '../Range';
import {retrievePrecedingIdentifier} from "./util";
import {COMMAND_NAME_INSERT_STRING} from '../editor_protocol';

var DOWN: EditorAction = function(editor: Editor) { editor.completionManager.down(); };
var DETACH: EditorAction = function(editor: Editor) { editor.completionManager.detach(); };

//
// 
//
// showPopup => updateCompletions => openPopup
//

/**
 * @class CompletionManager
 */
export default class CompletionManager {

    /**
     * @property popup
     * @type ListViewPopup
     */
    public popup: ListViewPopup;

    /**
     * The editor with which the completion manager is interating.
     *
     * @property editor
     * @type Editor
     * @private
     */
    private editor: Editor;

    private keyboardHandler = new KeyboardHandler();
    public activated: boolean;
    private changeTimer;
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
    public autoSelect = true;

    /**
     * Determines what happens when there is only one completion.
     *
     * @property autoInsert
     * @type boolean
     */
    public autoInsert = true;

    /**
     * @class CompletionManager
     * @constructor
     * @param editor {Editor}
     */
    constructor(editor: Editor) {
        this.editor = editor;
        this.commands = {
            "Up": (editor: Editor) => { this.goTo("up"); },
            "Down": DOWN,
            "Ctrl-Up|Ctrl-Home": (editor: Editor) => { this.goTo("start"); },
            "Ctrl-Down|Ctrl-End": (editor: Editor) => { this.goTo("end"); },

            "Esc": DETACH,
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

        this.keyboardHandler.bindKeys(this.commands);

        this.blurListener = this.blurListener.bind(this);
        this.changeListener = this.changeListener.bind(this);
        this.mousedownListener = this.mousedownListener.bind(this);
        this.mousewheelListener = this.mousewheelListener.bind(this);

        this.changeTimer = delayedCall(function() { this.updateCompletions(true); }.bind(this));
    }

    /**
     * @method insertMatch
     * @param [data]
     */
    public insertMatch(data?) {
        if (!data) {
            data = this.popup.getData(this.popup.getRow());
        }

        if (!data) {
            return;
        }

        if (data.completer && data.completer.insertMatch) {
            data.completer.insertMatch(this.editor);
        }
        else {
            if (this.completions.filterText) {
                var ranges: Range[] = this.editor.selection.rangeList.ranges;
                for (var i = 0, iLength = ranges.length; i < iLength; i++) {
                    var range = ranges[i];
                    range.start.column -= this.completions.filterText.length;
                    this.editor.getSession().remove(range);
                }
            }
            if (data.snippet) {
                // FIXME TODO
                // snippetManager.insertSnippet(this.editor, data.snippet);
            }
            else {
                let insertstringCommand = this.editor.commands.getCommandByName(COMMAND_NAME_INSERT_STRING);
                this.editor.execCommand(insertstringCommand, data.value || data);
            }
        }
        this.detach();
    }

    /**
     * Implementation of the Completer interface.
     */
    public detach() {
        this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
        this.editor.off("changeSelection", this.changeListener);
        this.editor.off("blur", this.blurListener);
        this.editor.off("mousedown", this.mousedownListener);
        this.editor.off("mousewheel", this.mousewheelListener);
        this.changeTimer.cancel();

        if (this.popup && this.popup.isOpen) {
            this.gatherCompletionsId += 1;
            this.popup.hide();
        }

        if (this.base)
            this.base.detach();
        this.activated = false;
        this.completions = this.base = null;
    }

    /**
     * @method goTo
     * @param where {string}
     * @return {void}
     */
    public goTo(where: string): void {

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
     */
    public down(): void {
        let row = this.popup.getRow();
        const max = this.popup.getLength() - 1;
        row = row >= max ? -1 : row + 1;
        this.popup.setRow(row);
    }

    /**
     *
     *
     * @method getCompletions
     * @param editor {Editor}
     * @param session {EditSession}
     * @param pos {Position}
     * @param prefix {string}
     * @param callback {(err, result) => any}
     * @return {boolean}
     */
    public getCompletions(editor: Editor, session: EditSession, pos: Position, prefix: string, callback: (err, results?: { prefix: string; matches: Completion[]; finished: boolean }) => any): boolean {

        this.base = new Anchor(session.doc, pos.row, pos.column - prefix.length);

        let matches: Completion[] = [];
        let total = editor.completers.length;

        editor.completers.forEach(function(completer: Completer, index: number) {
            completer.getCompletions(editor, session, pos, prefix, function(err, results: Completion[]) {
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
    private updateCompletions(keepPopupPosition?: boolean): void {
        var pos: Position = this.editor.getCursorPosition();
        var prefix: string;
        if (keepPopupPosition && this.base && this.completions) {
            var range = new Range(this.base.row, this.base.column, pos.row, pos.column);
            prefix = this.editor.getSession().getTextRange(range);
            if (prefix === this.completions.filterText)
                return;
            this.completions.setFilter(prefix);
            if (!this.completions.filtered.length)
                return this.detach();

            if (this.completions.filtered.length === 1 && this.completions.filtered[0].value === prefix && !this.completions.filtered[0].snippet) {
                return this.detach();
            }

            this.openPopup(this.editor, prefix, keepPopupPosition);
        }
        else {
            // Save current gatherCompletions session, session is close when a match is insert
            var _id = this.gatherCompletionsId;
            var editor = this.editor;
            var session = editor.getSession();
            var line = session.getLine(pos.row);
            prefix = retrievePrecedingIdentifier(line, pos.column);
            this.getCompletions(this.editor, session, this.editor.getCursorPosition(), prefix, (err, results: { prefix: string; matches: Completion[]; finished: boolean }) => {
                if (err) {
                    console.warn(`updateCompletions => ${err}`);
                }
                else {
                    // Only detach if result gathering is finished
                    var detachIfFinished = () => {
                        if (!results.finished) return;
                        return this.detach();
                    };

                    var prefix = results.prefix;
                    var matches = results && results.matches;

                    if (!matches || !matches.length)
                        return detachIfFinished();

                    // Wrong prefix or wrong session -> ignore
                    if (prefix.indexOf(results.prefix) !== 0 || _id !== this.gatherCompletionsId)
                        return;

                    this.completions = new CompletionList(matches);
                    this.completions.setFilter(prefix);
                    var filtered = this.completions.filtered;

                    // No results
                    if (!filtered.length)
                        return detachIfFinished();

                    // One result equals to the prefix
                    if (filtered.length === 1 && filtered[0].value === prefix && !filtered[0].snippet)
                        return detachIfFinished();

                    // Autoinsert if one result
                    if (this.autoInsert && filtered.length === 1) {
                        return this.insertMatch(filtered[0]);
                    }

                    this.openPopup(this.editor, prefix, keepPopupPosition);
                }
            });
        }
    }

    private openPopup(editor: Editor, prefix: string, keepPopupPosition: boolean): void {
        if (!this.popup) {
            this.popup = new ListViewPopup(document.body || document.documentElement);
            this.popup.on("click", (e) => { this.insertMatch(); e.stop(); });
            this.popup.focus = this.editor.focus.bind(this.editor);
        }

        this.popup.setData(this.completions.filtered);

        this.popup.setRow(this.autoSelect ? 0 : -1);

        if (!keepPopupPosition) {
            this.popup.setThemeCss(editor.getTheme(), void 0);
            // TODO: Copy darkness from editor.
            this.popup.setThemeDark(true);
            // TODO: Copy padding from editor.
            // this.popup.setPadding(editor.getPadding())
            this.popup.setFontSize(editor.getFontSize());

            var lineHeight = editor.renderer.layerConfig.lineHeight;

            var pos: PixelPosition = editor.renderer.getPixelPosition(this.base, true);
            pos.left -= this.popup.getTextLeftOffset();

            var rect: ClientRect = editor.container.getBoundingClientRect();
            pos.top += rect.top - editor.renderer.layerConfig.offset;
            pos.left += rect.left - editor.renderer.scrollLeft;
            pos.left += editor.renderer.$gutterLayer.gutterWidth;

            this.popup.show(pos, lineHeight);
        }
    }

    private changeListener(e) {
        var cursor = this.editor.selection.lead;
        if (cursor.row !== this.base.row || cursor.column < this.base.column) {
            this.detach();
        }
        if (this.activated)
            this.changeTimer.schedule();
        else
            this.detach();
    }

    private blurListener() {
        // we have to check if activeElement is a child of popup because
        // on IE preventDefault doesn't stop scrollbar from being focussed
        var el = document.activeElement;
        if (el !== this.editor.textInput.getElement() && el.parentNode !== this.popup.container) {
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
     * This metho
     *
     * @method showPopup
     * @param editor {Editor}
     * @return {void}
     */
    public showPopup(editor: Editor): void {

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
        editor.on("changeSelection", this.changeListener);
        editor.on("blur", this.blurListener);
        editor.on("mousedown", this.mousedownListener);
        editor.on("mousewheel", this.mousewheelListener);

        this.updateCompletions();
    }

    /**
     * @method cancelContextMenu
     * @return {void}
     */
    public cancelContextMenu(): void {
        this.editor.cancelMouseContextMenu();
    }
}
