import { refChange } from './refChange';
import { Shareable } from './Shareable';

/**
 * An experiment in monitoring the setInterval, clearInterval calls
 * in order to ensure that handlers are freed.
 */
export class Interval implements Shareable {
    /**
     * The identifier associated with the setInterval and clearInterval calls.
     * setInterval never returns zero, so we use zero as the sentinel value.
     */
    private id = 0;

    /**
     * 
     */
    protected readonly uuid = `${Math.random()}`;

    /**
     * 
     */
    private refCount = 1;

    constructor() {
        refChange(this.uuid, 'Interval', +1);
    }

    protected destructor(): void {
        // Calling clear, which is idempotent, frees any handler resources.
        this.off();
    }

    addRef(): number {
        refChange(this.uuid, 'Interval', +1);
        this.refCount++;
        return this.refCount;
    }

    /**
     * Decrements the reference count on this Interval.
     * When the reference count falls to zero, the destructor will be called,
     * and any resources held will be released.
     */
    release(): number {
        refChange(this.uuid, 'Interval', -1);
        this.refCount--;
        if (this.refCount === 0) {
            this.destructor();
        }
        return this.refCount;
    }

    /**
     * Turns on the interval so that the handler is called.
     * This method is safe to call if there is an existing handler.
     */
    on(handler: () => any, delay: number): void {
        this.off();
        this.id = window.setInterval(handler, delay);
    }

    /**
     * Turns off the interval.
     * This method is idempotent.
     */
    off() {
        if (this.id !== 0) {
            window.clearInterval(this.id);
            this.id = 0;
        }
    }
}
