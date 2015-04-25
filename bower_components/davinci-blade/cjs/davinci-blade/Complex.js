function divide(a, b) {
    var q = b.x * b.x + b.y * b.y;
    var x = (a.x * b.x + a.y * b.y) / q;
    var y = (a.y * b.x - a.x * b.y) / q;
    return new Complex(x, y);
}
var Complex = (function () {
    /**
     * Constructs a complex number z = (x, y).
     * @param x The real part of the complex number.
     * @param y The imaginary part of the complex number.
     */
    function Complex(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * __add__ supports operator +(Complex, any)
     */
    Complex.prototype.__add__ = function (other) {
        if (other instanceof Complex) {
            return new Complex(this.x + other.x, this.y + other.y);
        }
        else if (typeof other === 'number') {
            return new Complex(this.x + other, this.y);
        }
        else {
            return;
        }
    };
    /**
     * __radd__ supports operator +(any, Complex)
     */
    Complex.prototype.__radd__ = function (other) {
        if (other instanceof Complex) {
            return new Complex(other.x + this.x, other.y + this.y);
        }
        else if (typeof other === 'number') {
            return new Complex(other + this.x, this.y);
        }
        else {
            return;
        }
    };
    Complex.prototype.__sub__ = function (other) {
        if (other instanceof Complex) {
            return new Complex(this.x - other.x, this.y - other.y);
        }
        else if (typeof other === 'number') {
            return new Complex(this.x - other, this.y);
        }
        else {
            return;
        }
    };
    Complex.prototype.__rsub__ = function (other) {
        if (other instanceof Complex) {
            return new Complex(other.x - this.x, other.y - this.y);
        }
        else if (typeof other === 'number') {
            return new Complex(other - this.x, -this.y);
        }
        else {
            return;
        }
    };
    Complex.prototype.__mul__ = function (other) {
        if (other instanceof Complex) {
            return new Complex(this.x * other.x - this.y * other.y, this.x * other.y + this.y * other.x);
        }
        else if (typeof other === 'number') {
            return new Complex(this.x * other, this.y * other);
        }
        else {
            return;
        }
    };
    Complex.prototype.__rmul__ = function (other) {
        if (other instanceof Complex) {
            return new Complex(other.x * this.x - other.y * this.y, other.x * this.y + other.y * this.x);
        }
        else if (typeof other === 'number') {
            return new Complex(other * this.x, other * this.y);
        }
        else {
            return;
        }
    };
    Complex.prototype.__div__ = function (other) {
        if (other instanceof Complex) {
            return divide(this, other);
        }
        else if (typeof other === 'number') {
            return new Complex(this.x / other, this.y / other);
        }
        else {
            return;
        }
    };
    Complex.prototype.__rdiv__ = function (other) {
        if (other instanceof Complex) {
            return divide(other, this);
        }
        else if (typeof other === 'number') {
            return divide(new Complex(other, 0), this);
        }
        else {
            return;
        }
    };
    Complex.prototype.norm = function () {
        return Math.sqrt(this.quad());
    };
    Complex.prototype.quad = function () {
        return this.x * this.x + this.y * this.y;
    };
    Complex.prototype.arg = function () {
        return Math.atan2(this.y, this.x);
    };
    Complex.prototype.toString = function () {
        return "Complex(" + this.x + ", " + this.y + ")";
    };
    return Complex;
})();
module.exports = Complex;
