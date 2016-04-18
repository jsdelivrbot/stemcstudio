import {
IComputedEvent,
INPUT_START,
INPUT_CANCEL,
INPUT_END,
Recognizer,
STATE_RECOGNIZED,
STATE_FAILED,
TOUCH_ACTION_AUTO
} from '../hammer';
import {setTimeoutContext} from '../utils';

export class PressRecognizer extends Recognizer {
    private _timer;
    private _input;
    private pointers = 1;
    private time = 500; // minimal time of the pointer to be pressed
    private threshold = 5; // a minimal movement is ok, but keep it low
    /**
     * Press
     * Recognized when the pointer is down for x ms without any movement.
     * @constructor
     * @extends Recognizer
     */
    constructor(eventName: string, enabled: boolean) {
        super(eventName ? eventName : 'press', enabled);

        this._timer = null;
        this._input = null;
    }

    getTouchAction(): string[] {
        return [TOUCH_ACTION_AUTO];
    }

    process(input: IComputedEvent): number {
        var validPointers = input.touchesLength === this.pointers;
        var validMovement = input.distance < this.threshold;
        var validTime = input.deltaTime > this.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        }
        else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, this.time, this);
        }
        else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    }

    reset(): void {
        clearTimeout(this._timer);
    }

    emit(): void {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        var event = new Event('press');
        this.manager.emit(this.eventName, event);
    }
}
