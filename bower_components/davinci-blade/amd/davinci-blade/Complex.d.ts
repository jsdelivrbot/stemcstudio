declare class Complex {
    /**
     * The real part of the complex number.
     */
    x: number;
    /**
     * The imaginary part of the complex number.
     */
    y: number;
    /**
     * Constructs a complex number z = (x, y).
     * @param x The real part of the complex number.
     * @param y The imaginary part of the complex number.
     */
    constructor(x: number, y: number);
    /**
     * __add__ supports operator +(Complex, any)
     */
    __add__(other: any): Complex;
    /**
     * __radd__ supports operator +(any, Complex)
     */
    __radd__(other: any): Complex;
    __sub__(other: any): Complex;
    __rsub__(other: any): Complex;
    __mul__(other: any): Complex;
    __rmul__(other: any): Complex;
    __div__(other: any): Complex;
    __rdiv__(other: any): Complex;
    norm(): number;
    quad(): number;
    arg(): number;
    toString(): string;
}
export = Complex;
