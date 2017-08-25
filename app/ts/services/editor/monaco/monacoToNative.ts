import { Position } from '../../../virtual/editor';

export function lineNumberToRow(lineNumber: number): number {
    return lineNumber - 1;
}

export function columnToNative(column: number): number {
    return column - 1;
}

export function monacoToNativePosition(position: monaco.IPosition): Position {
    const row = lineNumberToRow(position.lineNumber);
    const column = columnToNative(position.column);
    return { row, column };
}
