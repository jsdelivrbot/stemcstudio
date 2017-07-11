import { addCommandKeyListener, addListener, capture, preventDefault } from "../lib/event";
import { isChrome, isGecko, isIE, isMac, isTouchPad, isWebKit, isWin } from "../lib/useragent";
import { createElement } from "../lib/dom";
import { createDelayedCall } from "../lib/lang/createDelayedCall";
import { DelayedCall } from "../lib/lang/DelayedCall";
import { Editor } from "../Editor";
import { COMMAND_NAME_BACKSPACE } from '../editor_protocol';
import { COMMAND_NAME_DEL } from '../editor_protocol';
import { RangeBasic } from '../../editor/RangeBasic';

const BROKEN_SETDATA = <number>isChrome < 18;
const USE_IE_MIME_TYPE = isIE;
const PLACEHOLDER = "\u2028\u2028";
const PLACEHOLDER_CHAR_FIRST = PLACEHOLDER.charAt(0);

interface InComposition {
    range?: RangeBasic;
    lastValue?: string;
    canUndo?: boolean;
}


/**
 *
 */
export class TextInput {

    /**
     *
     */
    private text: HTMLTextAreaElement;

    /**
     *
     */
    private editor: Editor;

    /**
     *
     */
    public _isFocused: boolean;

    private tempStyle: string;

    private afterContextMenu: boolean;

    private inComposition: InComposition | boolean;

    private inputHandler: ((data: string) => string) | null;

    private selectionStart: number;
    private selectionEnd: number;

    private pasted: boolean;

    private syncValue: DelayedCall;

    constructor(container: Element, editor: Editor) {

        this.editor = editor;
        this.tempStyle = '';
        this.afterContextMenu = false;
        this.inComposition = false;

        this.text = <HTMLTextAreaElement>createElement("textarea");
        this.text.className = "ace_text-input";

        if (isTouchPad) {
            this.text.setAttribute("x-palm-disable-auto-cap", 'true');
        }

        // autocapitalize is a nonstandard attribute supported by WebKit on iOS.
        // none, sentences, words, characters (on, off are deprecated).
        this.text.setAttribute("autocapitalize", "none");

        // HTML5. We don't want the browser to perform auto complete.
        this.text.setAttribute("autocorrect", "off");

        // HTML5. Setting to true means that the element needs to have its spelling and grammar checked.
        this.text.setAttribute("spellcheck", "false");

        // HTML5. POssible values are (hard, soft). soft is the default value.
        // FIXME: Why off?
        this.text.setAttribute("wrap", "off");

        this.text.style.opacity = "0";
        container.insertBefore(this.text, container.firstChild);

        let copied = false;
        this.pasted = false;
        let isSelectionEmpty = true;

        // FOCUS
        // ie9 throws error if document.activeElement is accessed too soon
        try { this._isFocused = document.activeElement === this.text; } catch (e) {/* Do nothing. */ }

        addListener(this.text, "blur", () => {
            editor.onBlur();
            this._isFocused = false;
        });
        addListener(this.text, "focus", () => {
            this._isFocused = true;
            editor.onFocus();
            this.resetSelection();
        });

        // modifying selection of blured textarea can focus it (chrome mac/linux)
        const syncSelection = createDelayedCall(() => {
            if (this._isFocused) {
                this.resetSelection(isSelectionEmpty);
            }
        });

        this.syncValue = createDelayedCall(() => {
            if (!this.inComposition) {
                this.text.value = PLACEHOLDER;
                if (this._isFocused) {
                    this.resetSelection();
                }
            }
        });

        if (!isWebKit) {
            editor.on('changeSelection', function (event, editor: Editor) {
                if (editor.selection) {
                    if (editor.selection.isEmpty() !== isSelectionEmpty) {
                        isSelectionEmpty = !isSelectionEmpty;
                        syncSelection.schedule();
                    }
                }
            });
        }

        this.resetValue();

        if (this._isFocused) {
            editor.onFocus();
        }


        let isAllSelected = function (text: HTMLTextAreaElement): boolean | undefined {
            return text.selectionStart === 0 && text.selectionEnd === text.value.length;
        };
        // IE8 does not support setSelectionRange
        if (!this.text.setSelectionRange && this.text['createTextRange']) {
            this.text.setSelectionRange = function (this: HTMLTextAreaElement, selectionStart: number, selectionEnd: number) {
                const range = this['createTextRange']();
                range.collapse(true);
                range.moveStart('character', selectionStart);
                range.moveEnd('character', selectionEnd);
                range.select();
            };
            isAllSelected = function (text: HTMLTextAreaElement) {
                try {
                    const range = text.ownerDocument['selection'].createRange();
                    if (!range || range.parentElement() !== text) return false;
                    return range.text === text.value;
                }
                catch (e) {
                    // Do nothing.
                }
                return void 0;
            };
        }
        const onCompositionUpdate = () => {

            if (!this.inComposition || !editor.onCompositionUpdate || editor.readOnly) {
                return;
            }
            const val = this.text.value.replace(/\x01/g, "");
            if (typeof this.inComposition !== 'boolean') {
                if (this.inComposition.lastValue === val) return;

                editor.onCompositionUpdate(val);
                if (this.inComposition.lastValue) {
                    editor.undo();
                }
                if (this.inComposition.canUndo) {
                    this.inComposition.lastValue = val;
                }
                if (this.inComposition.lastValue) {
                    if (editor.selection) {
                        const r = editor.selection.getRange();
                        editor.insert(this.inComposition.lastValue, false);
                        editor.sessionOrThrow().markUndoGroup();
                        this.inComposition.range = editor.selection.getRange();
                        editor.selection.setRange(r);
                        editor.selection.clearSelection();
                    }
                }
            }
            else {
                editor.onCompositionUpdate(val);
            }
        };

        /**
         * The event handler for the 'input' event of the text area.
         */
        const onInput = (e?: any) => {
            if (this.inComposition) {
                return;
            }
            const data = this.text.value;
            // The data is essentially the last character typed because of the reset.
            this.sendText(data);
            this.resetValue();
        };

        const onCompositionEnd: any = (e: Event, editor: Editor) => {

            if (!editor.onCompositionEnd || editor.readOnly) {
                return;
            }

            const c = this.inComposition as InComposition;
            this.inComposition = false;
            let timer: number | null = window.setTimeout(() => {
                timer = null;
                const str = this.text.value.replace(/\x01/g, "");

                if (this.inComposition)
                    return;
                else if (str === c.lastValue)
                    this.resetValue();
                else if (!c.lastValue && str) {
                    this.resetValue();
                    this.sendText(str);
                }
            });

            this.inputHandler = function compositionInputHandler(str: string) {

                if (timer)
                    clearTimeout(timer);
                str = str.replace(/\x01/g, "");
                if (str === c.lastValue)
                    return "";
                if (c.lastValue && timer)
                    editor.undo();
                return str;
            };
            editor.onCompositionEnd();
            editor.off("mousedown", onCompositionEnd);
            if (e.type === "compositionend" && c.range) {
                if (editor.selection) {
                    editor.selection.setRange(c.range);
                }
            }
            // Workaround for accent key composition in Chrome 53+.
            if (isChrome && <number>isChrome >= 53) {
                onInput();
            }
        };

        const onCompositionStart = () => {
            if (this.inComposition || !editor.onCompositionStart || editor.readOnly) {
                return;
            }

            this.inComposition = {};
            editor.onCompositionStart();
            setTimeout(onCompositionUpdate, 0);
            editor.on("mousedown", onCompositionEnd);
            if (editor.selection) {
                if (this.inComposition.canUndo && !editor.selection.isEmpty()) {
                    editor.insert("", false);
                    editor.sessionOrThrow().markUndoGroup();
                    editor.selection.clearSelection();
                }
            }
            editor.sessionOrThrow().markUndoGroup();
        };

        const onSelect = (e: any) => {
            if (copied) {
                copied = false;
            }
            else if (isAllSelected(this.text)) {
                editor.selectAll();
                this.resetSelection();
            }
            else if (this.inputHandler) {
                if (editor.selection) {
                    this.resetSelection(editor.selection.isEmpty());
                }
            }
        };

        const handleClipboardData = function handleClipboardData(e: ClipboardEvent, data?: string): boolean | string | undefined {
            const clipboardData: DataTransfer = e.clipboardData || window['clipboardData'];
            if (!clipboardData || BROKEN_SETDATA)
                return void 0;
            // using "Text" doesn't work on legacy webkit but ie needs it
            // TODO are there other browsers that require "Text"?
            const mime = USE_IE_MIME_TYPE ? "Text" : "text/plain";
            if (data) {
                // Safari 5 has clipboardData object, but does not handle setData()
                return clipboardData.setData(mime, data) !== false;
            }
            else {
                return clipboardData.getData(mime);
            }
        };

        const doCopy = (e: ClipboardEvent, isCut: boolean) => {
            const data: string = editor.getSelectedText();
            if (!data)
                return preventDefault(e);

            if (handleClipboardData(e, data)) {
                isCut ? editor.onCut() : editor.onCopy();
                preventDefault(e);
            }
            else {
                copied = true;
                this.text.value = data;
                this.text.select();
                setTimeout(() => {
                    copied = false;
                    this.resetValue();
                    this.resetSelection();
                    isCut ? editor.onCut() : editor.onCopy();
                });
            }
        };

        const onCut = function onCut(e: ClipboardEvent) {
            doCopy(e, true);
        };

        const onCopy = function onCopy(e: ClipboardEvent) {
            doCopy(e, false);
        };

        // TODO: I don't see this being cleaned up. 
        const onPaste = (e: ClipboardEvent) => {
            const text = handleClipboardData(e);
            if (typeof text === "string") {
                if (text) {
                    editor.onPaste(text);
                }
                if (isIE) {
                    setTimeout(() => { this.resetSelection(); });
                }
                preventDefault(e);
            }
            else {
                // The clipboard 'paste' event has given us a boolean or undefined.
                this.text.value = "";
                this.pasted = true;
            }
        };

        addCommandKeyListener(this.text, editor.onCommandKey.bind(editor));

        addListener(this.text, "select", onSelect);

        addListener(this.text, "input", onInput);

        addListener(this.text, "cut", onCut);
        addListener(this.text, "copy", onCopy);
        addListener(this.text, "paste", onPaste);

        // Opera has no clipboard events
        if (!('oncut' in this.text) || !('oncopy' in this.text) || !('onpaste' in this.text)) {
            addListener(container, "keydown", function (e: KeyboardEvent) {
                if ((isMac && !e.metaKey) || !e.ctrlKey) {
                    return;
                }

                // FIXME: This casting looks suspect. 
                switch (e.keyCode) {
                    case 67:
                        onCopy(<any>e);
                        break;
                    case 86:
                        onPaste(<any>e);
                        break;
                    case 88:
                        onCut(<any>e);
                        break;
                    default: {
                        // Do nothing.
                    }
                }
            });
        }

        const syncComposition = createDelayedCall(onCompositionUpdate, 50);

        addListener(this.text, "compositionstart", onCompositionStart);
        if (isGecko) {
            addListener(this.text, "text", function () { syncComposition.schedule(); });
        }
        else {
            addListener(this.text, "keyup", function () { syncComposition.schedule(); });
            addListener(this.text, "keydown", function () { syncComposition.schedule(); });
        }
        addListener(this.text, "compositionend", onCompositionEnd);

        const onContextMenu = (e: MouseEvent) => {
            editor.textInput.onContextMenu(e);
            this.onContextMenuClose();
        };

        addListener(editor.renderer.scroller, "contextmenu", onContextMenu);
        addListener(this.text, "contextmenu", onContextMenu);
    }

    /**
     *
     */
    getElement(): HTMLTextAreaElement {
        return this.text;
    }

    /**
     *
     */
    isFocused(): boolean {
        return this._isFocused;
    }

    moveToMouse(e: MouseEvent, bringToFront?: boolean): void {

        if (!this.tempStyle) {
            this.tempStyle = this.text.style.cssText;
        }

        this.text.style.cssText = (bringToFront ? "z-index:100000;" : "")
            + "height:" + this.text.style.height + ";"
            + (isIE ? "opacity:0.1;" : "");

        const intFromStringOrNull = function (str: string | null): number {
            if (typeof str === 'string') {
                return parseInt(str, 10) || 0;
            }
            else {
                return 0;
            }
        };

        const rect = this.editor.container.getBoundingClientRect();
        const style = window.getComputedStyle(this.editor.container);
        const top = rect.top + intFromStringOrNull(style.borderTopWidth);
        const left = rect.left + intFromStringOrNull(style.borderLeftWidth);
        const maxTop = rect.bottom - top - this.text.clientHeight - 2;

        const move = (e: MouseEvent) => {
            this.text.style.left = e.clientX - left - 2 + "px";
            this.text.style.top = Math.min(e.clientY - top - 2, maxTop) + "px";
        };

        move(e);

        if (e.type !== "mousedown") {
            return;
        }

        if (this.editor.renderer.$keepTextAreaAtCursor) {
            this.editor.renderer.$keepTextAreaAtCursor = null;
        }

        // on windows context menu is opened after mouseup
        if (isWin) {
            capture(this.editor.container, move, () => { this.onContextMenuClose(); });
        }
    }

    /**
     * @param readOnly
     */
    setReadOnly(readOnly: boolean): void {
        this.text.readOnly = readOnly;
    }

    /**
     *
     */
    focus(): void {
        return this.text.focus();
    }

    /**
     *
     */
    blur() {
        return this.text.blur();
    }

    /**
     *
     */
    onContextMenuClose(): void {
        setTimeout(() => {
            if (this.tempStyle) {
                this.text.style.cssText = this.tempStyle;
                this.tempStyle = '';
            }
            if (this.editor.renderer.$keepTextAreaAtCursor == null) {
                this.editor.renderer.$keepTextAreaAtCursor = true;
                this.editor.renderer.$moveTextAreaToCursor();
            }
        }, 0);
    }

    /**
     * @param e
     */
    onContextMenu(e: MouseEvent): void {
        this.afterContextMenu = true;
        if (this.editor.selection) {
            this.resetSelection(this.editor.selection.isEmpty());
        }
        this.editor._emit("nativecontextmenu", { target: this.editor, domEvent: e });
        this.moveToMouse(e, true);
    }

    /**
     * @param data
     */
    sendText(data: string): void {
        if (this.inputHandler) {
            data = this.inputHandler(data);
            this.inputHandler = null;
        }
        if (this.pasted) {
            this.resetSelection();
            if (data) {
                this.editor.onPaste(data);
            }
            this.pasted = false;
        }
        else if (data === PLACEHOLDER_CHAR_FIRST) {
            if (this.afterContextMenu) {
                const delCommand = this.editor.commands.getCommandByName(COMMAND_NAME_DEL);
                this.editor.execCommand(delCommand, { source: "ace" });
            }
            else {
                // Some versions of Android do not fire keydown when pressing backspace.
                const backCommand = this.editor.commands.getCommandByName(COMMAND_NAME_BACKSPACE);
                this.editor.execCommand(backCommand, { source: "ace" });
            }
        }
        else {
            if (data.substring(0, 2) === PLACEHOLDER) {
                data = data.substr(2);
            }
            else if (data.charAt(0) === PLACEHOLDER_CHAR_FIRST) {
                data = data.substr(1);
            }
            else if (data.charAt(data.length - 1) === PLACEHOLDER_CHAR_FIRST) {
                data = data.slice(0, -1);
            }
            // can happen if undo in textarea isn't stopped
            if (data.charAt(data.length - 1) === PLACEHOLDER_CHAR_FIRST)
                data = data.slice(0, -1);

            if (data) {
                this.editor.onTextInput(data);
            }
        }
        if (this.afterContextMenu) {
            this.afterContextMenu = false;
        }
    }

    resetSelection(isEmpty?: boolean): void {
        if (this.inComposition) {
            return;
        }
        if (this.inputHandler) {
            this.selectionStart = 0;
            this.selectionEnd = isEmpty ? 0 : this.text.value.length - 1;
        }
        else {
            this.selectionStart = isEmpty ? 2 : 1;
            this.selectionEnd = 2;
        }
        // on firefox this throws if textarea is hidden
        try {
            this.text.setSelectionRange(this.selectionStart, this.selectionEnd);
        }
        catch (e) {
            // Do nothing.
        }
    }

    /**
     * @param inputHandler
     */
    setInputHandler(inputHandler: (data: string) => string): void {
        this.inputHandler = inputHandler;
    }

    /**
     *
     */
    getInputHandler(): ((data: string) => string) | null {
        return this.inputHandler;
    }

    /**
     *
     */
    resetValue(): void {
        if (this.inComposition) {
            return;
        }
        this.text.value = PLACEHOLDER;
        // http://code.google.com/p/chromium/issues/detail?id=76516
        if (isWebKit)
            this.syncValue.schedule();
    }
}
