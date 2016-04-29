var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './attribute', '../hammer'], function (require, exports, attribute_1, hammer_1) {
    var PinchRecognizer = (function (_super) {
        __extends(PinchRecognizer, _super);
        function PinchRecognizer(eventName, enabled) {
            _super.call(this, eventName, enabled, 2);
            this.threshold = 2;
            this.scale = 1;
        }
        PinchRecognizer.prototype.getTouchAction = function () {
            return [hammer_1.TOUCH_ACTION_NONE];
        };
        PinchRecognizer.prototype.attributeTest = function (input) {
            var isBegan = (this.state & hammer_1.STATE_BEGAN) > 0;
            this.scale = input.scale;
            return _super.prototype.attributeTest.call(this, input) && (Math.abs(this.scale - 1) > this.threshold || isBegan);
        };
        PinchRecognizer.prototype.emit = function () {
            if (this.scale !== 1) {
                var inOut = this.scale < 1 ? 'in' : 'out';
                var event = new Event('pinch');
                this.manager.emit(this.eventName + inOut, event);
            }
        };
        return PinchRecognizer;
    })(attribute_1.ContinuousRecognizer);
    exports.PinchRecognizer = PinchRecognizer;
});
