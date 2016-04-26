import {ContinuousRecognizer} from './attribute';
import {PanRecognizer} from './pan';
import {
DIRECTION_HORIZONTAL,
DIRECTION_VERTICAL,
IComputedEvent,
INPUT_END
} from '../hammer';
import {} from '../utils';
/**
 * Swipe
 * Recognized when the pointer is moving fast enough in the allowed direction.
 * @constructor
 * @extends ContinuousRecognizer
 */
export class SwipeRecognizer extends ContinuousRecognizer {
    private displacementThreshold: number = 10;
    private speedThreshold: number = 0.65;
    private direction: number = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

    constructor(eventName: string, enabled: boolean) {
        super(eventName, enabled, 1)
    }

    getTouchAction(): string[] {
        return PanRecognizer.prototype.getTouchAction.call(this);
    }

    attributeTest(input: IComputedEvent): boolean {
        var speed: number;

        if (this.direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            speed = input.velocity.norm();
        }
        else if (this.direction & DIRECTION_HORIZONTAL) {
            speed = Math.abs(input.velocity.x);
        }
        else if (this.direction & DIRECTION_VERTICAL) {
            speed = Math.abs(input.velocity.y);
        }

        var isParallel: boolean = (this.direction & input.direction) > 0;
        var isFarEnough: boolean = input.distance > this.displacementThreshold;
        var isFastEnough: boolean = speed > this.speedThreshold;
        var isEndEventType: boolean = (input.eventType & INPUT_END) > 0;

        return super.attributeTest(input) && isParallel && isFarEnough && isFastEnough && isEndEventType;
    }

    emit(): void {
        var direction = undefined;//hammer.directionStr(input.direction);
        var event = new Event('swipe');
        if (direction) {
            this.manager.emit(this.eventName + direction, event);
        }
        this.manager.emit(this.eventName, event);
    }
}
