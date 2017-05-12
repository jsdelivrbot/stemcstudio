import { EventBus } from './EventBus';
//
// RxJS imports
//
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

export interface Action<NAME, EVENT> {
    type: NAME;
    data: EVENT;
}

/**
 * A connection point for broadcasting and subscribing to events.
 */
export class EventHub<NAME extends string, EVENT, SOURCE> {
    /**
     * 
     */
    private readonly eventBus: EventBus<NAME, EVENT, SOURCE>;

    /**
     * 
     */
    public readonly events: Observable<Action<NAME, EVENT>>;

    /**
     * 
     */
    constructor(eventNames: NAME[], source: SOURCE) {
        this.eventBus = new EventBus<NAME, EVENT, SOURCE>(source);
        this.events = new Observable<Action<NAME, EVENT>>((observer: Observer<Action<NAME, EVENT>>) => {
            const tearDowns = eventNames.map((eventName) => {
                return this.eventBus.watch(eventName, (data) => {
                    observer.next({ type: eventName, data });
                });
            });
            return function () {
                for (const tearDown of tearDowns) {
                    tearDown();
                }
            };
        });
    }

    /**
     *
     */
    emitAsync(eventName: NAME, event?: EVENT): void {
        return this.eventBus.emitAsync(eventName, event);
    }
}
