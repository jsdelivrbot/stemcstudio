"use strict";

import { ContinuousRecognizer } from './attribute';
import {
DIRECTION_ALL,
DIRECTION_DOWN,
DIRECTION_HORIZONTAL,
DIRECTION_LEFT,
DIRECTION_RIGHT,
DIRECTION_UNDEFINED,
DIRECTION_UP,
DIRECTION_VERTICAL,
IComputedEvent,
STATE_BEGAN,
TOUCH_ACTION_PAN_X,
TOUCH_ACTION_PAN_Y,
VectorE2
} from '../hammer';

/**
 *
 */
export class PanRecognizer extends ContinuousRecognizer {
    private pX: number;
    private pY: number;
    private direction: number = DIRECTION_ALL;
    private threshold = 10;
    private movement: VectorE2;
    constructor(eventName: string, enabled: boolean) {
        super(eventName, enabled, 1);
    }
    setDirection(direction: number): PanRecognizer {
        this.direction = direction;
        return this;
    }
    setThreshold(threshold: number): PanRecognizer {
        this.threshold = threshold;
        return this;
    }
    getTouchAction(): string[] {
        var actions: string[] = [];
        if (this.direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (this.direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    }

    directionTest(input: IComputedEvent): boolean {
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.movement.x;
        var y = input.movement.y;

        // lock to axis?
        if (!(direction & this.direction)) {
            if (this.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_UNDEFINED : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.movement.x);
            }
            else {
                direction = (y === 0) ? DIRECTION_UNDEFINED : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.movement.y);
            }
        }
        var directionAllowed: boolean = (direction & this.direction) > 0;
        return hasMoved && distance > this.threshold && directionAllowed;
    }

    attributeTest(input: IComputedEvent): boolean {
        this.movement = input.movement;
        // The first and last events will not have movement defined.
        // The direction test requires movement!
        if (input.movement) {
            var directionOK: boolean = this.directionTest(input);
            var began: boolean = (this.state & STATE_BEGAN) > 0;
            return super.attributeTest(input) && (began || (!began && directionOK));
        }
        else {
            return true;
        }
    }

    emit(): void {
        if (this.movement) {
            this.manager.emit(this.eventName, this.movement);
        }
    }
}
