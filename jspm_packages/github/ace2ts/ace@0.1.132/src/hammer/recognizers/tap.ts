"use strict";

import {
ClientLocation,
decodeEventType,
getDistance,
IComputedEvent,
INPUT_START,
INPUT_MOVE,
INPUT_END,
INPUT_CANCEL,
Recognizer,
STATE_BEGAN,
STATE_FAILED,
STATE_RECOGNIZED,
TOUCH_ACTION_MANIPULATION
} from '../hammer';
import {setTimeoutContext} from '../utils';

function isCorrectTouchCount(input: IComputedEvent): boolean {
    switch (input.eventType) {
        case INPUT_START: {
            return input.touchesLength === 1;
        }
            break;
        case INPUT_MOVE: {
            return input.touchesLength === 1;
        }
            break;
        case INPUT_END: {
            return input.touchesLength === 0;
        }
            break;
        case INPUT_CANCEL: {
            return true;
        }
            break;
        default: {
            throw new Error(decodeEventType(input.eventType));
        }
    }
}

export class TapRecognizer extends Recognizer {
    // previous time and center,
    // used for tap counting
    private pTime: number;
    private pCenter: ClientLocation;
    private _timer;
    //private _input: IComputedEvent;
    private count = 0;
    private taps = 1;
    private pointers = 1;
    private time = 250; // max time of the pointer to be down (like finger on the screen)
    private threshold = 6; // a minimal movement is ok, but keep it low
    private interval = 300; // max time between the multi-tap taps
    private posThreshold = 10; // a multi-tap can be a bit off the initial position
    private center: ClientLocation;
    constructor(eventName: string, enabled: boolean) {
        super(eventName ? eventName : 'tap', enabled);
    }
    getTouchAction(): string[] {
        return [TOUCH_ACTION_MANIPULATION];
    }
    process(input: IComputedEvent): number {

        this.reset();

        if (!isCorrectTouchCount(input)) {
            return STATE_FAILED;
        }

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            this.center = input.center;
            return this.failTimeout();
        }

        if (input.distance >= this.threshold) {
            return STATE_FAILED;
        }

        if (input.deltaTime >= this.time) {
            return STATE_FAILED;
        }

        // and we've reached an end event, so a tap is possible
        if (input.eventType !== INPUT_END) {
            this.center = input.center;
            return this.failTimeout();
        }
        else {
            // We are in the end state so there will be no touches.
        }

        var validInterval = this.pTime ? (input.timeStamp - this.pTime < this.interval) : true;
        var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < this.posThreshold;

        this.pTime = input.timeStamp;
        this.pCenter = input.center;

        if (!validMultiTap || !validInterval) {
            this.count = 1;
        }
        else {
            this.count += 1;
        }

        // if tap count matches we have recognized it,
        // else it has began recognizing...
        var tapCount = this.count % this.taps;
        if (tapCount === 0) {
            // no failing requirements, immediately trigger the tap event
            // or wait as long as the multitap interval to trigger
            if (!this.hasRequireFailures()) {
                return STATE_RECOGNIZED;
            }
            else {
                this._timer = setTimeoutContext(function() {
                    this.state = STATE_RECOGNIZED;
                    this.tryEmit();
                }, this.interval, this);
                return STATE_BEGAN;
            }
        }
        return STATE_FAILED;
    }

    failTimeout() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.interval, this);
        return STATE_FAILED;
    }

    reset() {
        clearTimeout(this._timer);
    }

    emit(): void {
        if (this.state === STATE_RECOGNIZED) {
            this.manager.emit(this.eventName, this.center);
        }
    }
}
