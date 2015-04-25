declare class Color {
    private _red;
    private _green;
    private _blue;
    constructor(red: number, green: number, blue: number);
    luminance(): number;
    toString(): string;
    asFillStyle(): string;
    static luminance(red: number, green: number, blue: number): number;
    /**
     * Converts an angle, radius, height to a color on a color wheel.
     */
    static fromHSL(H: number, S: number, L: number): Color;
}
export = Color;
