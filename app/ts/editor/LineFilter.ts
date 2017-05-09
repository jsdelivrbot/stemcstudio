/**
 * A function that examines a line and return yay or nay.
 */
interface LineFilter {
    (line: string, row: number, column?: number): boolean | undefined;
}

export default LineFilter;
