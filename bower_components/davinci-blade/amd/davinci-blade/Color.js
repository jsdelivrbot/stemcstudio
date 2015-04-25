define(["require", "exports"], function (require, exports) {
    var Color = (function () {
        function Color(red, green, blue) {
            this._red = red;
            this._green = green;
            this._blue = blue;
        }
        Color.prototype.luminance = function () {
            return Color.luminance(this._red, this._green, this._blue);
        };
        Color.prototype.toString = function () {
            return "Color(" + this._red + ", " + this._green + ", " + this._blue + ")";
        };
        Color.prototype.asFillStyle = function () {
            return "rgb(" + Math.floor(this._red * 255) + ", " + Math.floor(this._green * 255) + ", " + Math.floor(this._blue * 255) + ")";
        };
        Color.luminance = function (red, green, blue) {
            var gamma = 2.2;
            return 0.2126 * Math.pow(red, gamma) + 0.7152 * Math.pow(green, gamma) + 0.0722 * Math.pow(blue, gamma);
        };
        /**
         * Converts an angle, radius, height to a color on a color wheel.
         */
        Color.fromHSL = function (H, S, L) {
            var C = (1 - Math.abs(2 * L - 1)) * S;
            function normalizeAngle(angle) {
                if (angle > 2 * Math.PI) {
                    return normalizeAngle(angle - 2 * Math.PI);
                }
                else if (angle < 0) {
                    return normalizeAngle(angle + 2 * Math.PI);
                }
                else {
                    return angle;
                }
            }
            function matchLightness(R, G, B) {
                var x = Color.luminance(R, G, B);
                var m = L - (0.5 * C);
                return new Color(R + m, G + m, B + m);
            }
            var sextant = ((normalizeAngle(H) / Math.PI) * 3) % 6;
            var X = C * (1 - Math.abs(sextant % 2 - 1));
            if (sextant >= 0 && sextant < 1) {
                return matchLightness(C, X, 0.0);
            }
            else if (sextant >= 1 && sextant < 2) {
                return matchLightness(X, C, 0.0);
            }
            else if (sextant >= 2 && sextant < 3) {
                return matchLightness(0.0, C, C * (sextant - 2));
            }
            else if (sextant >= 3 && sextant < 4) {
                return matchLightness(0.0, C * (4 - sextant), C);
            }
            else if (sextant >= 4 && sextant < 5) {
                return matchLightness(X, 0.0, C);
            }
            else if (sextant >= 5 && sextant < 6) {
                return matchLightness(C, 0.0, X);
            }
            else {
                return matchLightness(0.0, 0.0, 0.0);
            }
        };
        return Color;
    })();
    return Color;
});
