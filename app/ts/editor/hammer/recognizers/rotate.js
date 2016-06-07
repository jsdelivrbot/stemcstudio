var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './attribute', '../hammer'], function (require, exports, attribute_1, hammer_1) {
    var RotateRecognizer = (function (_super) {
        __extends(RotateRecognizer, _super);
        function RotateRecognizer(eventName, enabled) {
            _super.call(this, eventName, enabled, 2);
            this.threshold = 0;
        }
        RotateRecognizer.prototype.getTouchAction = function () {
            return [hammer_1.TOUCH_ACTION_NONE];
        };
        RotateRecognizer.prototype.attributeTest = function (input) {
            return _super.prototype.attributeTest.call(this, input) && (Math.abs(input.rotation) > this.threshold || (this.state & hammer_1.STATE_BEGAN) > 0);
        };
        return RotateRecognizer;
    })(attribute_1.ContinuousRecognizer);
    exports.RotateRecognizer = RotateRecognizer;
});
