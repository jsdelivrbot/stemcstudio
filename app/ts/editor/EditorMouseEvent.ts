import { Editor } from './Editor';
import { getButton, preventDefault, stopPropagation } from "./lib/event";
import { isMac } from "./lib/useragent";
import { Position } from "editor-document";
import { contains, isEmpty } from './RangeHelpers';

/**
 * Custom mouse event
 */
export class EditorMouseEvent {
    /**
     * The original DOM mouse event.
     */
    public readonly domEvent: MouseEvent;
    private readonly editor: Editor;

    /**
     *
     */
    public readonly clientX: number;

    /**
     *
     */
    public readonly clientY: number;

    /**
     * Cached text coordinates following getDocumentPosition()
     */
    private $pos: Position | null;
    private $inSelection: boolean | null;
    // private propagationStopped = false;
    // private defaultPrevented = false;
    public time: number;
    // wheelY, wheelY and speed are for 'mousewheel' events.
    public wheelX: number;
    public wheelY: number;
    public speed: number;

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
        // this.propagationStopped = true;
    }

    preventDefault() {
        preventDefault(this.domEvent);
        // this.defaultPrevented = true;
    }

    stop() {
        this.stopPropagation();
        this.preventDefault();
    }

    /**
     * Get the document position below the mouse cursor.
     */
    getDocumentPosition(): Position | null {
        if (!this.$pos) {
            this.$pos = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
        }
        return this.$pos;
    }

    /**
     * Determines whether the mouse cursor is inside of the text selection
     */
    inSelection(): boolean {
        if (this.$inSelection !== null) {
            return this.$inSelection;
        }

        const editor = this.editor;

        const selectionRange = editor.getSelectionRange();
        if (isEmpty(selectionRange)) {
            this.$inSelection = false;
        }
        else {
            const pos = this.getDocumentPosition();
            if (pos) {
                this.$inSelection = contains(selectionRange, pos.row, pos.column);
            }
            else {
                this.$inSelection = false;
            }
        }
        return this.$inSelection;
    }

    /*
     * Get the clicked mouse button
     * 
     * @returns 0 for left button, 1 for middle button, 2 for right button
     */
    getButton(): number {
        return getButton(this.domEvent);
    }

    /*
     * Determines whether the shift key was pressed when the event was emitted
     */
    getShiftKey(): boolean {
        return this.domEvent.shiftKey;
    }

    getAccelKey = isMac ? () => { return this.domEvent.metaKey; } : () => { return this.domEvent.ctrlKey; };
}
