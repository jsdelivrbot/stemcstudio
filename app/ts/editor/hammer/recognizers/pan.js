var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './attribute', '../hammer'], function (require, exports, attribute_1, hammer_1) {
    "use strict";
    var PanRecognizer = (function (_super) {
        __extends(PanRecognizer, _super);
        function PanRecognizer(eventName, enabled) {
            _super.call(this, eventName, enabled, 1);
            this.direction = hammer_1.DIRECTION_ALL;
            this.threshold = 10;
        }
        PanRecognizer.prototype.setDirection = function (direction) {
            this.direction = direction;
            return this;
        };
        PanRecognizer.prototype.setThreshold = function (threshold) {
            this.threshold = threshold;
            return this;
        };
        PanRecognizer.prototype.getTouchAction = function () {
            var actions = [];
            if (this.direction & hammer_1.DIRECTION_HORIZONTAL) {
                actions.push(hammer_1.TOUCH_ACTION_PAN_Y);
            }
            if (this.direction & hammer_1.DIRECTION_VERTICAL) {
                actions.push(hammer_1.TOUCH_ACTION_PAN_X);
            }
            return actions;
        };
        PanRecognizer.prototype.directionTest = function (input) {
            var hasMoved = true;
            var distance = input.distance;
            var direction = input.direction;
            var x = input.movement.x;
            var y = input.movement.y;
            if (!(direction & this.direction)) {
                if (this.direction & hammer_1.DIRECTION_HORIZONTAL) {
                    direction = (x === 0) ? hammer_1.DIRECTION_UNDEFINED : (x < 0) ? hammer_1.DIRECTION_LEFT : hammer_1.DIRECTION_RIGHT;
                    hasMoved = x != this.pX;
                    distance = Math.abs(input.movement.x);
                }
                else {
                    direction = (y === 0) ? hammer_1.DIRECTION_UNDEFINED : (y < 0) ? hammer_1.DIRECTION_UP : hammer_1.DIRECTION_DOWN;
                    hasMoved = y != this.pY;
                    distance = Math.abs(input.movement.y);
                }
            }
            var directionAllowed = (direction & this.direction) > 0;
            return hasMoved && distance > this.threshold && directionAllowed;
        };
        PanRecognizer.prototype.attributeTest = function (input) {
            this.movement = input.movement;
            if (input.movement) {
                var directionOK = this.directionTest(input);
                var began = (this.state & hammer_1.STATE_BEGAN) > 0;
                return _super.prototype.attributeTest.call(this, input) && (began || (!began && directionOK));
            }
            else {
                return true;
            }
        };
        PanRecognizer.prototype.emit = function () {
            if (this.movement) {
                this.manager.emit(this.eventName, this.movement);
            }
        };
        return PanRecognizer;
    })(attribute_1.ContinuousRecognizer);
    exports.PanRecognizer = PanRecognizer;
});
