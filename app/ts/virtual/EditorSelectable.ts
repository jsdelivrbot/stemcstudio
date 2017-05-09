import { Action } from './editor';
import { Direction } from './editor';
import { Position } from './editor';
import { Range } from './editor';

export interface EditorSelectable {
    inMultiSelectMode: boolean;
    alignCursors(): void;
    centerSelection(): void;
    clearSelection(): void;
    duplicateSelection(): void;
    exitMultiSelectMode(): void;
    expandToLine(): void;
    forEachSelection(action: Action<EditorSelectable>, args: any, options?: { keepOrder?: boolean; $byLines?: boolean }): any;
    getSelectionIndex(): number;
    getSelectionRange(): Range;
    invertSelection(): void;
    joinLines(): void;
    moveSelectionToPosition(pos: Position): void;
    selectAll(): void;
    selectFileEnd(): void;
    selectLineStart(): void;
    selectLineEnd(): void;
    selectToFileStart(): void;
    selectMore(direction: Direction, skip?: boolean, stopAtFirst?: boolean): void;
    selectMoreLines(direction: Direction, skip?: boolean): void;

    selectLeft(): void;
    selectRight(): void;
    selectUp(): void;
    selectDown(): void;

    selectWordLeft(): void;
    selectWordRight(): void;
    selectWordOrFindNext(): void;
    selectWordOrFindPrevious(): void;

    selectPageDown(): void;
    selectPageUp(): void;

    splitIntoLines(): void;
}
