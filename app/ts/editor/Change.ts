export interface Change {
    action: string;
    data: { start: { row: number; column: number }; end: { row: number; column: number } };
}
