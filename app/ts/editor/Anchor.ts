import { AnchorChangeEvent } from './events/AnchorChangeEvent';
import { Delta, Document, Position } from "editor-document";
import { EventEmitterClass } from './lib/EventEmitterClass';
import { EventBus } from "./EventBus";

function pointsInOrder(this: void, point1: Position, point2: Position, equalPointsInOrder: boolean): boolean {
    const bColIsAfter = equalPointsInOrder ? point1.column <= point2.column : point1.column < point2.column;
    return (point1.row < point2.row) || (point1.row === point2.row && bColIsAfter);
}

function getTransformedPoint(this: void, delta: Delta, point: Position, moveIfEqual: boolean): Position {
    // Get delta info.
    const deltaIsInsert = delta.action === "insert";
    const deltaRowShift = (deltaIsInsert ? 1 : -1) * (delta.end.row - delta.start.row);
    const deltaColShift = (deltaIsInsert ? 1 : -1) * (delta.end.column - delta.start.column);
    const deltaStart = delta.start;
    const deltaEnd = deltaIsInsert ? deltaStart : delta.end; // Collapse insert range.

    // DELTA AFTER POINT: No change needed.
    if (pointsInOrder(point, deltaStart, moveIfEqual)) {
        return { column: point.column, row: point.row };
    }

    // DELTA BEFORE POINT: Move point by delta shift.
    if (pointsInOrder(deltaEnd, point, !moveIfEqual)) {
        return {
            column: point.column + (point.row === deltaEnd.row ? deltaColShift : 0),
            row: point.row + deltaRowShift
        };
    }

    // DELTA ENVELOPS POINT (delete only): Move point to delta start.
    // TODO warn if delta.action != "remove" ?

    return { column: deltaStart.column, row: deltaStart.row };
}

export type AnchorEventName = 'change';

/**
 * Defines a floating pointer in the document.
 * An anchor adjusts its position as text is changed around it.
 * Whenever text is inserted or deleted before the cursor,
 * the position of the anchor is updated.
 */
export class Anchor implements EventBus<AnchorEventName, AnchorChangeEvent, Anchor>, Position {

    /**
     *
     */
    public row: number;

    /**
     *
     */
    public column: number;

    /**
     *
     */
    private document: Document;

    /**
     * Callback function for when the document changes.
     *
     */
    private documentChangeHandler: (delta: Delta, doc: Document) => void;

    /**
     * Experimental: Allows anchor to stick to the next on the left.
     */
    public insertRight: boolean;

    /**
     *
     */
    private readonly eventBus: EventEmitterClass<AnchorEventName, AnchorChangeEvent, Anchor>;

    /**
     * <p>
     * Defines the floating pointer in the document.
     * Whenever text is inserted or deleted before the cursor, the position of the cursor is updated.
     * </p>
     * <p>
     * Creates a new <code>Anchor</code> and associates it with a document.
     * </p>
     *
     * @param doc The document to associate with the anchor.
     * @param row The starting row position.
     * @param column The starting column position.
     */
    constructor(doc: Document, row: number, column: number) {

        this.eventBus = new EventEmitterClass<AnchorEventName, AnchorChangeEvent, Anchor>(this);

        this.documentChangeHandler = (delta: Delta, doc: Document): void => {
            if (delta.start.row === delta.end.row && delta.start.row !== this.row) {
                return;
            }
            if (delta.start.row > this.row) {
                return;
            }
            const point: Position = getTransformedPoint(delta, { row: this.row, column: this.column }, this.insertRight);
            this.setPosition(point.row, point.column, true);
        };

        this.attach(doc);

        this.setPosition(row, column);

        this.insertRight = false;
    }

    /**
     * Returns an object identifying the `row` and `column` position of the current anchor.
     */
    public getPosition(): Position {
        return this.clipPositionToDocument(this.row, this.column);
    }

    /**
     * Returns the current document.
     */
    public getDocument(): Document {
        return this.document;
    }

    /**
     * Sets the anchor position to the specified row and column.
     * If `noClip` is `true`, the position is not clipped.
     *
     * @param row The row index to move the anchor to
     * @param column The column index to move the anchor to
     * @param noClip Identifies if you want the position to be clipped.
     */
    public setPosition(row: number, column: number, noClip?: boolean): void {
        let pos: Position;
        if (noClip) {
            pos = { row: row, column: column };
        }
        else {
            pos = this.clipPositionToDocument(row, column);
        }

        if (this.row === pos.row && this.column === pos.column) {
            return;
        }
        else {
            const old: Position = { row: this.row, column: this.column };

            this.row = pos.row;
            this.column = pos.column;

            /**
             * Fires whenever the anchor position changes.
             */
            const event: AnchorChangeEvent = { oldPosition: old, position: pos };
            this.eventBus._signal("change", event);
        }
    }

    /**
     * When called, the `'change'` event listener is removed.
     */
    public detach(): void {
        this.document.removeChangeListener(this.documentChangeHandler);
    }

    /**
     *
     */
    public attach(doc?: Document): void {
        this.document = doc || this.document;
        this.document.addChangeListener(this.documentChangeHandler);
    }

    /**
     * @param eventName
     * @param callback
     */
    public on(eventName: AnchorEventName, callback: (event: AnchorChangeEvent, source: Anchor) => any): () => void {
        return this.eventBus.on(eventName, callback, false);
    }

    /**
     * @param eventName
     * @param callback
     */
    public off(eventName: AnchorEventName, callback: (event: AnchorChangeEvent, source: Anchor) => any): void {
        this.eventBus.off(eventName, callback, false);
    }

    /**
     * Clips the anchor position to the specified row and column.
     *
     * @param row The row index to clip the anchor to
     * @param  column The column index to clip the anchor to.
     */
    private clipPositionToDocument(row: number, column: number): Position {

        const pos: Position = { column: 0, row: 0 };

        if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
        }
        else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        }
        else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
        }

        if (column < 0) {
            pos.column = 0;
        }

        return pos;
    }
}
