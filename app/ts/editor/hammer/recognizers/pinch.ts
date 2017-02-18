import { ContinuousRecognizer } from './attribute';
import { IComputedEvent, STATE_BEGAN, TOUCH_ACTION_NONE } from '../hammer';

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 */
export class PinchRecognizer extends ContinuousRecognizer {
    private threshold = 2;
    private scale = 1;
    constructor(eventName: string, enabled: boolean) {
        super(eventName, enabled, 2);
    }
    getTouchAction(): string[] {
        return [TOUCH_ACTION_NONE];
    }
    attributeTest(input: IComputedEvent): boolean {
        const isBegan: boolean = (this.state & STATE_BEGAN) > 0;
        this.scale = input.scale;
        return super.attributeTest(input) && (Math.abs(this.scale - 1) > this.threshold || isBegan);
    }
    emit(): void {
        if (this.scale !== 1) {
            const inOut = this.scale < 1 ? 'in' : 'out';
            const event = new Event('pinch');
            this.manager.emit(this.eventName + inOut, event);
        }
    }
}
