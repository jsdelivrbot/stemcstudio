import { Position } from "./Position";

export interface Delta {
    action: 'insert' | 'remove';
    start: Position;
    end: Position;
    lines: string[];
}
