import {ContinuousRecognizer} from './attribute';
import {IComputedEvent, STATE_BEGAN, TOUCH_ACTION_NONE} from '../hammer';

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends ContinuousRecognizer
 */
export class RotateRecognizer extends ContinuousRecognizer {

    private threshold = 0;

    constructor(eventName: string, enabled: boolean) {
        super(eventName, enabled, 2);
    }

    getTouchAction(): string[] {
        return [TOUCH_ACTION_NONE];
    }

    attributeTest(input: IComputedEvent): boolean {
        return super.attributeTest(input) && (Math.abs(input.rotation) > this.threshold || (this.state & STATE_BEGAN) > 0);
    }
}
