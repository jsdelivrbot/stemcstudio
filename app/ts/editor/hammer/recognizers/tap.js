var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../hammer', '../utils'], function (require, exports, hammer_1, utils_1) {
    "use strict";
    function isCorrectTouchCount(input) {
        switch (input.eventType) {
            case hammer_1.INPUT_START:
                {
                    return input.touchesLength === 1;
                }
                break;
            case hammer_1.INPUT_MOVE:
                {
                    return input.touchesLength === 1;
                }
                break;
            case hammer_1.INPUT_END:
                {
                    return input.touchesLength === 0;
                }
                break;
            case hammer_1.INPUT_CANCEL:
                {
                    return true;
                }
                break;
            default: {
                throw new Error(hammer_1.decodeEventType(input.eventType));
            }
        }
    }
    var TapRecognizer = (function (_super) {
        __extends(TapRecognizer, _super);
        function TapRecognizer(eventName, enabled) {
            _super.call(this, eventName ? eventName : 'tap', enabled);
            this.count = 0;
            this.taps = 1;
            this.pointers = 1;
            this.time = 250;
            this.threshold = 6;
            this.interval = 300;
            this.posThreshold = 10;
        }
        TapRecognizer.prototype.getTouchAction = function () {
            return [hammer_1.TOUCH_ACTION_MANIPULATION];
        };
        TapRecognizer.prototype.process = function (input) {
            this.reset();
            if (!isCorrectTouchCount(input)) {
                return hammer_1.STATE_FAILED;
            }
            if ((input.eventType & hammer_1.INPUT_START) && (this.count === 0)) {
                this.center = input.center;
                return this.failTimeout();
            }
            if (input.distance >= this.threshold) {
                return hammer_1.STATE_FAILED;
            }
            if (input.deltaTime >= this.time) {
                return hammer_1.STATE_FAILED;
            }
            if (input.eventType !== hammer_1.INPUT_END) {
                this.center = input.center;
                return this.failTimeout();
            }
            else {
            }
            var validInterval = this.pTime ? (input.timeStamp - this.pTime < this.interval) : true;
            var validMultiTap = !this.pCenter || hammer_1.getDistance(this.pCenter, input.center) < this.posThreshold;
            this.pTime = input.timeStamp;
            this.pCenter = input.center;
            if (!validMultiTap || !validInterval) {
                this.count = 1;
            }
            else {
                this.count += 1;
            }
            var tapCount = this.count % this.taps;
            if (tapCount === 0) {
                if (!this.hasRequireFailures()) {
                    return hammer_1.STATE_RECOGNIZED;
                }
                else {
                    this._timer = utils_1.setTimeoutContext(function () {
                        this.state = hammer_1.STATE_RECOGNIZED;
                        this.tryEmit();
                    }, this.interval, this);
                    return hammer_1.STATE_BEGAN;
                }
            }
            return hammer_1.STATE_FAILED;
        };
        TapRecognizer.prototype.failTimeout = function () {
            this._timer = utils_1.setTimeoutContext(function () {
                this.state = hammer_1.STATE_FAILED;
            }, this.interval, this);
            return hammer_1.STATE_FAILED;
        };
        TapRecognizer.prototype.reset = function () {
            clearTimeout(this._timer);
        };
        TapRecognizer.prototype.emit = function () {
            if (this.state === hammer_1.STATE_RECOGNIZED) {
                this.manager.emit(this.eventName, this.center);
            }
        };
        return TapRecognizer;
    })(hammer_1.Recognizer);
    exports.TapRecognizer = TapRecognizer;
});
