import EventBus from './EventBus';
//
// RxJS imports
//
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

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
    public readonly events: Observable<EVENT>;

    /**
     * 
     */
    constructor(private eventName: NAME, source: SOURCE) {
        this.eventBus = new EventBus<NAME, EVENT, SOURCE>(source);
        this.events = new Observable<EVENT>((observer: Observer<EVENT>) => {
            return this.eventBus.watch(eventName, (settings) => {
                observer.next(settings);
            });
        });
    }

    /**
     *
     */
    emitAsync(event?: EVENT): void {
        return this.eventBus.emitAsync(this.eventName, event);
    }
}
