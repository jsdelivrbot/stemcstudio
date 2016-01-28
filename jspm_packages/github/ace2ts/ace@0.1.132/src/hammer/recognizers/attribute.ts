"use strict";

import {
decodeEventType,
IComputedEvent,
INPUT_CANCEL,
INPUT_END,
INPUT_MOVE,
INPUT_START,
Recognizer,
STATE_BEGAN,
STATE_CANCELLED,
STATE_CHANGED,
STATE_FAILED,
STATE_RECOGNIZED
} from '../hammer';

export class ContinuousRecognizer extends Recognizer {
    private pointers: number;
    /**
     * This recognizer is just used as a base for the simple attribute recognizers.
     * @constructor
     * @extends Recognizer
     */
    constructor(eventName: string, enabled: boolean, pointers: number) {
        super(eventName, enabled);
        this.pointers = pointers;
    }

    /**
     * Used to check if the recognizer receives valid input, like input.distance > 10.
     * @memberof ContinuousRecognizer
     * @param {IComputedEvent} input
     * @return {Boolean} recognized
     */
    attributeTest(input: IComputedEvent): boolean {
        switch (input.eventType) {
            case INPUT_START: {
                return input.touchesLength === this.pointers;
            }
                break;
            case INPUT_MOVE: {
                return input.touchesLength === this.pointers;
            }
                break;
            case INPUT_END: {
                return input.touchesLength === this.pointers - 1;
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

    /**
     * Process the input and return the state for the recognizer
     * @memberof ContinuousRecognizer
     * @param {Object} input
     * @return {*} State
     */
    process(input: IComputedEvent): number {

        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attributeTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        }
        else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_RECOGNIZED;
            }
            else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            else {
                return state | STATE_CHANGED;
            }
        }
        return STATE_FAILED;
    }
}
