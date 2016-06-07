var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../hammer'], function (require, exports, hammer_1) {
    "use strict";
    var ContinuousRecognizer = (function (_super) {
        __extends(ContinuousRecognizer, _super);
        function ContinuousRecognizer(eventName, enabled, pointers) {
            _super.call(this, eventName, enabled);
            this.pointers = pointers;
        }
        ContinuousRecognizer.prototype.attributeTest = function (input) {
            switch (input.eventType) {
                case hammer_1.INPUT_START:
                    {
                        return input.touchesLength === this.pointers;
                    }
                    break;
                case hammer_1.INPUT_MOVE:
                    {
                        return input.touchesLength === this.pointers;
                    }
                    break;
                case hammer_1.INPUT_END:
                    {
                        return input.touchesLength === this.pointers - 1;
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
        };
        ContinuousRecognizer.prototype.process = function (input) {
            var state = this.state;
            var eventType = input.eventType;
            var isRecognized = state & (hammer_1.STATE_BEGAN | hammer_1.STATE_CHANGED);
            var isValid = this.attributeTest(input);
            if (isRecognized && (eventType & hammer_1.INPUT_CANCEL || !isValid)) {
                return state | hammer_1.STATE_CANCELLED;
            }
            else if (isRecognized || isValid) {
                if (eventType & hammer_1.INPUT_END) {
                    return state | hammer_1.STATE_RECOGNIZED;
                }
                else if (!(state & hammer_1.STATE_BEGAN)) {
                    return hammer_1.STATE_BEGAN;
                }
                else {
                    return state | hammer_1.STATE_CHANGED;
                }
            }
            return hammer_1.STATE_FAILED;
        };
        return ContinuousRecognizer;
    })(hammer_1.Recognizer);
    exports.ContinuousRecognizer = ContinuousRecognizer;
});
