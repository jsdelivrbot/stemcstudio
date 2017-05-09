import { Annotation } from './editor';
import { Direction } from './editor';
import { EditorEventType, EditorEventHandler } from './editor';
import { EditorSelectable } from './EditorSelectable';
import { OrientedRange } from './editor';
import { PixelPosition, Position } from './editor';

export interface EditorExtensible extends EditorSelectable {
    findAnnotations(row: number, direction: Direction): Annotation[] | undefined;

    getCursorPixelPosition(pos: Position): PixelPosition;
    getCursorPosition(): Position;
    getGutterAnnotations(): ({ className: string | undefined; text: string[] } | null)[];
    getGutterWidth(): number;

    getTabString(): string;
    getWordRange(row: number, column: number): OrientedRange;

    on(eventName: EditorEventType, callback: EditorEventHandler): void;
    off(eventName: EditorEventType, callback: EditorEventHandler): void;
}
