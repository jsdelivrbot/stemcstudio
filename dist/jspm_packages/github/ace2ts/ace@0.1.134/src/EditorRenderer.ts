import Annotation from "./Annotation";
import Position from "./Position";

/**
 * @class EditorRenderer
 */
// TODO: The HTML nature is leaky.
interface EditorRenderer {
    $keepTextAreaAtCursor: boolean;
    $maxLines: number;
    scroller: HTMLDivElement;
    /**
     * @property scrollTop
     * @type number
     */
    scrollTop: number;
    textarea: HTMLTextAreaElement;

    /**
     * Returns the root element containing this renderer.
     *
     * @method getContainerElement
     * @return {HTMLElement}
     */
    getContainerElement(): HTMLElement;

    /**
     * Move text input over the cursor.
     * Required for iOS and IME.
     *
     * @method $moveTextAreaToCursor
     * @return {void}
     * @private
     */
    $moveTextAreaToCursor(): void;
    /**
     * Sets annotations for the gutter.
     *
     * @method setAnnotations
     * @param {Annotation[]} annotations An array containing annotations.
     * @return {void}
     */
    setAnnotations(annotations: Annotation[]): void;

    setHighlightGutterLine(highlightGutterLine: boolean): void;

    /**
     * Identifies whether you want to show the gutter or not.
     *
     * @method setShowGutter
     * @param showGutter {boolean} Set to `true` to show the gutter
     * @return {void}
     */
    setShowGutter(showGutter: boolean): void;

    screenToTextCoordinates(clientX: number, clientY: number): Position;

    /**
     * Scrolls the editor across both x- and y-axes.
     *
     * @method scrollBy
     * @param deltaX {number} The x value to scroll by
     * @param deltaY {number} The y value to scroll by
     * @return {void}
     */
    scrollBy(deltaX: number, deltaY: number): void;

    /**
     * Scrolls the cursor into the first visibile area of the editor
     */
    scrollCursorIntoView(cursor?: Position, offset?, $viewMargin?): void;
}

export default EditorRenderer;