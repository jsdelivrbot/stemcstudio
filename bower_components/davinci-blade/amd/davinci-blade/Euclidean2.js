define(["require", "exports"], function (require, exports) {
    function add00(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a00 + b00);
    }
    function add01(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a01 + b01);
    }
    function add10(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a10 + b10);
    }
    function add11(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a11 + b11);
    }
    function addE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 + b0);
                }
                break;
            case 1:
                {
                    x = +(a1 + b1);
                }
                break;
            case 2:
                {
                    x = +(a2 + b2);
                }
                break;
            case 3:
                {
                    x = +(a3 + b3);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    function subE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 - b0);
                }
                break;
            case 1:
                {
                    x = +(a1 - b1);
                }
                break;
            case 2:
                {
                    x = +(a2 - b2);
                }
                break;
            case 3:
                {
                    x = +(a3 - b3);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    function mulE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    function extE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a2 * b0);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    function lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 - a2 * b3);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b3);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    function rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
                }
                break;
            case 1:
                {
                    x = +(-a1 * b0 - a3 * b2);
                }
                break;
            case 2:
                {
                    x = +(-a2 * b0 + a3 * b1);
                }
                break;
            case 3:
                {
                    x = +(a3 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    function stringFromCoordinates(coordinates, labels) {
        var i, _i, _ref;
        var str;
        var sb = [];
        var append = function (coord, label) {
            var n;
            if (coord !== 0) {
                if (coord >= 0) {
                    if (sb.length > 0) {
                        sb.push("+");
                    }
                }
                else {
                    sb.push("-");
                }
                n = Math.abs(coord);
                if (n === 1) {
                    sb.push(label);
                }
                else {
                    sb.push(n.toString());
                    if (label !== "1") {
                        sb.push("*");
                        sb.push(label);
                    }
                }
            }
        };
        for (i = _i = 0, _ref = coordinates.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            append(coordinates[i], labels[i]);
        }
        if (sb.length > 0) {
            str = sb.join("");
        }
        else {
            str = "0";
        }
        return str;
    }
    var divide = function (a00, a01, a10, a11, b00, b01, b10, b11, m) {
        var c00, c01, c10, c11, i00, i01, i10, i11, k00, m00, m01, m10, m11, r00, r01, r10, r11, s00, s01, s10, s11, x00, x01, x10, x11;
        r00 = +b00;
        r01 = +b01;
        r10 = +b10;
        r11 = -b11;
        m00 = b00 * r00 + b01 * r01 + b10 * r10 - b11 * r11;
        m01 = 0;
        m10 = 0;
        m11 = 0;
        c00 = +m00;
        c01 = -m01;
        c10 = -m10;
        c11 = -m11;
        s00 = r00 * c00 + r01 * c01 + r10 * c10 - r11 * c11;
        s01 = r00 * c01 + r01 * c00 - r10 * c11 + r11 * c10;
        s10 = r00 * c10 + r01 * c11 + r10 * c00 - r11 * c01;
        s11 = r00 * c11 + r01 * c10 - r10 * c01 + r11 * c00;
        k00 = b00 * s00 + b01 * s01 + b10 * s10 - b11 * s11;
        i00 = s00 / k00;
        i01 = s01 / k00;
        i10 = s10 / k00;
        i11 = s11 / k00;
        x00 = a00 * i00 + a01 * i01 + a10 * i10 - a11 * i11;
        x01 = a00 * i01 + a01 * i00 - a10 * i11 + a11 * i10;
        x10 = a00 * i10 + a01 * i11 + a10 * i00 - a11 * i01;
        x11 = a00 * i11 + a01 * i10 - a10 * i01 + a11 * i00;
        if (typeof m !== 'undefined') {
            m.w = x00;
            m.x = x01;
            m.y = x10;
            return m.xy = x11;
        }
        else {
            return new Euclidean2(x00, x01, x10, x11);
        }
    };
    var Euclidean2 = (function () {
        /**
         * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
         *
         * @class Euclidean2
         * @constructor
         * @param {number} w The scalar part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param {number} y The vector component of the multivector in the y-direction.
         * @param {number} xy The pseudoscalar part of the multivector.
         */
        function Euclidean2(w, x, y, xy) {
            this.w = w || 0;
            this.x = x;
            this.y = y;
            this.xy = xy;
        }
        Euclidean2.prototype.fromCartesian = function (w, x, y, xy) {
            return new Euclidean2(w, x, y, xy);
        };
        Euclidean2.prototype.fromPolar = function (w, r, theta, s) {
            return new Euclidean2(w, r * Math.cos(theta), r * Math.sin(theta), s);
        };
        Euclidean2.prototype.coordinates = function () {
            return [this.w, this.x, this.y, this.xy];
        };
        Euclidean2.prototype.coordinate = function (index) {
            switch (index) {
                case 0:
                    return this.w;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.xy;
                default:
                    throw new Error("index must be in the range [0..3]");
            }
        };
        Euclidean2.add = function (a, b) {
            var a00, a01, a10, a11, b00, b01, b10, b11, x00, x01, x10, x11;
            a00 = a[0];
            a01 = a[1];
            a10 = a[2];
            a11 = a[3];
            b00 = b[0];
            b01 = b[1];
            b10 = b[2];
            b11 = b[3];
            x00 = add00(a00, a01, a10, a11, b00, b01, b10, b11);
            x01 = add01(a00, a01, a10, a11, b00, b01, b10, b11);
            x10 = add10(a00, a01, a10, a11, b00, b01, b10, b11);
            x11 = add11(a00, a01, a10, a11, b00, b01, b10, b11);
            return [x00, x01, x10, x11];
        };
        Euclidean2.prototype.add = function (rhs) {
            var xs = Euclidean2.add(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
        };
        Euclidean2.prototype.__add__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return this.add(new Euclidean2(other, 0, 0, 0));
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__radd__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0).add(this);
            }
            else {
                return;
            }
        };
        Euclidean2.sub = function (a, b) {
            var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;
            a0 = a[0];
            a1 = a[1];
            a2 = a[2];
            a3 = a[3];
            b0 = b[0];
            b1 = b[1];
            b2 = b[2];
            b3 = b[3];
            x0 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            x1 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            x2 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            x3 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.sub = function (rhs) {
            var xs;
            xs = Euclidean2.sub(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
        };
        Euclidean2.prototype.__sub__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.sub(other);
            }
            else if (typeof other === 'number') {
                return this.sub(new Euclidean2(other, 0, 0, 0));
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__rsub__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.sub(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0).sub(this);
            }
            else {
                return;
            }
        };
        Euclidean2.mul = function (a, b) {
            var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;
            a0 = a[0];
            a1 = a[1];
            a2 = a[2];
            a3 = a[3];
            b0 = b[0];
            b1 = b[1];
            b2 = b[2];
            b3 = b[3];
            x0 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            x1 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            x2 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            x3 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.mul = function (rhs) {
            var xs;
            if (typeof rhs === 'number') {
                return this.scalarMultiply(rhs);
            }
            else {
                xs = Euclidean2.mul(this.coordinates(), rhs.coordinates());
                return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
            }
        };
        Euclidean2.prototype.__mul__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.mul(other);
            }
            else if (typeof other === 'number') {
                return this.mul(new Euclidean2(other, 0, 0, 0));
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__rmul__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.mul(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0).mul(this);
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.scalarMultiply = function (rhs) {
            return new Euclidean2(this.w * rhs, this.x * rhs, this.y * rhs, this.xy * rhs);
        };
        Euclidean2.prototype.div = function (rhs) {
            if (typeof rhs === 'number') {
                return new Euclidean2(this.w / rhs, this.x / rhs, this.y / rhs, this.xy / rhs);
            }
            else {
                return divide(this.w, this.x, this.y, this.xy, rhs.w, rhs.x, rhs.y, rhs.xy, void 0);
            }
        };
        Euclidean2.prototype.__div__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.div(other);
            }
            else if (typeof other === 'number') {
                return this.div(new Euclidean2(other, 0, 0, 0));
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__rdiv__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.div(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0).div(this);
            }
            else {
                return;
            }
        };
        Euclidean2.splat = function (a, b) {
            var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;
            a0 = a[0];
            a1 = a[1];
            a2 = a[2];
            a3 = a[3];
            b0 = b[0];
            b1 = b[1];
            b2 = b[2];
            b3 = b[3];
            x0 = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
            x1 = 0;
            x2 = 0;
            x3 = 0;
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.splat = function (rhs) {
            var xs = Euclidean2.splat(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
        };
        Euclidean2.wedge = function (a, b) {
            var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;
            a0 = a[0];
            a1 = a[1];
            a2 = a[2];
            a3 = a[3];
            b0 = b[0];
            b1 = b[1];
            b2 = b[2];
            b3 = b[3];
            x0 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            x1 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            x2 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            x3 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.wedge = function (rhs) {
            var xs = Euclidean2.wedge(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
        };
        Euclidean2.prototype.__wedge__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.wedge(other);
            }
            else if (typeof other === 'number') {
                return this.wedge(new Euclidean2(other, 0, 0, 0));
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__rwedge__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.wedge(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0).wedge(this);
            }
            else {
                return;
            }
        };
        Euclidean2.lshift = function (a, b) {
            var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;
            a0 = a[0];
            a1 = a[1];
            a2 = a[2];
            a3 = a[3];
            b0 = b[0];
            b1 = b[1];
            b2 = b[2];
            b3 = b[3];
            x0 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            x1 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            x2 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            x3 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.lshift = function (rhs) {
            var xs;
            xs = Euclidean2.lshift(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
        };
        Euclidean2.prototype.__lshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.lshift(other);
            }
            else if (typeof other === 'number') {
                return this.lshift(new Euclidean2(other, 0, 0, 0));
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__rlshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.lshift(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0).lshift(this);
            }
            else {
                return;
            }
        };
        Euclidean2.rshift = function (a, b) {
            var a0, a1, a2, a3, b0, b1, b2, b3, x0, x1, x2, x3;
            a0 = a[0];
            a1 = a[1];
            a2 = a[2];
            a3 = a[3];
            b0 = b[0];
            b1 = b[1];
            b2 = b[2];
            b3 = b[3];
            x0 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            x1 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            x2 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            x3 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.rshift = function (rhs) {
            var xs;
            xs = Euclidean2.rshift(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3]);
        };
        Euclidean2.prototype.__rshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.rshift(other);
            }
            else if (typeof other === 'number') {
                return this.rshift(new Euclidean2(other, 0, 0, 0));
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__rrshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.rshift(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0).rshift(this);
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__vbar__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.splat(other);
            }
            else if (typeof other === 'number') {
                return this.splat(new Euclidean2(other, 0, 0, 0));
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__rvbar__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.splat(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0).splat(this);
            }
            else {
                return;
            }
        };
        Euclidean2.prototype.__pos__ = function () {
            return this;
        };
        Euclidean2.prototype.__neg__ = function () {
            return new Euclidean2(-this.w, -this.x, -this.y, -this.xy);
        };
        /**
         * ~ (tilde) produces reversion.
         */
        Euclidean2.prototype.__tilde__ = function () {
            return new Euclidean2(this.w, this.x, this.y, -this.xy);
        };
        Euclidean2.prototype.grade = function (index) {
            switch (index) {
                case 0:
                    return new Euclidean2(this.w, 0, 0, 0);
                case 1:
                    return new Euclidean2(0, this.x, this.y, 0);
                case 2:
                    return new Euclidean2(0, 0, 0, this.xy);
                default:
                    return new Euclidean2(0, 0, 0, 0);
            }
        };
        Euclidean2.prototype.norm = function () {
            var w, x, xy, y;
            w = this.w;
            x = this.x;
            y = this.y;
            xy = this.xy;
            return new Euclidean2(Math.sqrt(w * w + x * x + y * y + xy * xy), 0, 0, 0);
        };
        Euclidean2.prototype.quad = function () {
            var w, x, xy, y;
            w = this.w;
            x = this.x;
            y = this.y;
            xy = this.xy;
            return new Euclidean2(w * w + x * x + y * y + xy * xy, 0, 0, 0);
        };
        Euclidean2.prototype.isNaN = function () {
            return isNaN(this.w) || isNaN(this.x) || isNaN(this.y) || isNaN(this.xy);
        };
        Euclidean2.prototype.toString = function () {
            return stringFromCoordinates([this.w, this.x, this.y, this.xy], ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toStringIJK = function () {
            return stringFromCoordinates(this.coordinates(), ["1", "i", "j", "I"]);
        };
        Euclidean2.prototype.toStringLATEX = function () {
            return stringFromCoordinates(this.coordinates(), ["1", "e_{1}", "e_{2}", "e_{12}"]);
        };
        return Euclidean2;
    })();
    return Euclidean2;
});
