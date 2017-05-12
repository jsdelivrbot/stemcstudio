import { Position } from './editor';

export interface EditorScrollable {
    // This may not be a command handler.
    scrollCursorIntoView(cursor?: Position | null, offset?: number, viewMargin?: { top?: number; bottom?: number }): void;

    scrollDown(): void;
    scrollUp(): void;

    scrollPageDown(): void;
    scrollPageUp(): void;
}
