var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './attribute', './pan', '../hammer'], function (require, exports, attribute_1, pan_1, hammer_1) {
    var SwipeRecognizer = (function (_super) {
        __extends(SwipeRecognizer, _super);
        function SwipeRecognizer(eventName, enabled) {
            _super.call(this, eventName, enabled, 1);
            this.displacementThreshold = 10;
            this.speedThreshold = 0.65;
            this.direction = hammer_1.DIRECTION_HORIZONTAL | hammer_1.DIRECTION_VERTICAL;
        }
        SwipeRecognizer.prototype.getTouchAction = function () {
            return pan_1.PanRecognizer.prototype.getTouchAction.call(this);
        };
        SwipeRecognizer.prototype.attributeTest = function (input) {
            var speed;
            if (this.direction & (hammer_1.DIRECTION_HORIZONTAL | hammer_1.DIRECTION_VERTICAL)) {
                speed = input.velocity.norm();
            }
            else if (this.direction & hammer_1.DIRECTION_HORIZONTAL) {
                speed = Math.abs(input.velocity.x);
            }
            else if (this.direction & hammer_1.DIRECTION_VERTICAL) {
                speed = Math.abs(input.velocity.y);
            }
            var isParallel = (this.direction & input.direction) > 0;
            var isFarEnough = input.distance > this.displacementThreshold;
            var isFastEnough = speed > this.speedThreshold;
            var isEndEventType = (input.eventType & hammer_1.INPUT_END) > 0;
            return _super.prototype.attributeTest.call(this, input) && isParallel && isFarEnough && isFastEnough && isEndEventType;
        };
        SwipeRecognizer.prototype.emit = function () {
            var direction = undefined;
            var event = new Event('swipe');
            if (direction) {
                this.manager.emit(this.eventName + direction, event);
            }
            this.manager.emit(this.eventName, event);
        };
        return SwipeRecognizer;
    })(attribute_1.ContinuousRecognizer);
    exports.SwipeRecognizer = SwipeRecognizer;
});
