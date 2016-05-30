import Position from './Position';

export default function comparePoints(p1: Position, p2: Position) {
    return p1.row - p2.row || p1.column - p2.column;
}
