import { Annotation } from "../editor/Annotation";
import { Delta } from "../editor/Delta";
import { Document } from "../editor/Document";
import { delayedCall } from "../lib/delayedCall";
import { DelayedFunctionCall } from "../lib/DelayedFunctionCall";
import { WorkerCallback } from "./WorkerCallback";

/**
 * A wrapper around the standard worker thread callback interface for use with Language Worker implementations.
 * Language Wroker implementations will use this as a base class.
 */
export class Mirror {

    /**
     *
     */
    protected host: WorkerCallback;

    /**
     * The doc(ument) property mirrors the value in the main (UI) thread.
     * The synchronization is performed by the Mirror base class.
     */
    protected doc: Document;

    /**
     * The mirror will schedule calls to the derived class onUpdate method
     * approx 500ms after each 'change' event where deltas are received and
     * applied to the mirror document.
     *
     * The derived class may also schedule updates when options change.
     */
    protected deferredUpdate: DelayedFunctionCall;

    /**
     * This timeout is used to control the delay between editor changes
     * and the begin of a validation process. It is typically set to 500ms.
     */
    private $timeout: number;

    /**
     *
     */
    constructor(host: WorkerCallback, timeout = 500) {
        if (typeof host !== 'object') {
            throw new TypeError("host must be a WorkerCallback.");
        }
        this.host = host;
        this.$timeout = timeout;
        this.doc = new Document("");

        const deferredUpdate = this.deferredUpdate = delayedCall(this.onUpdate.bind(this));

        host.on('change', (e: { data: Delta[] }) => {
            this.doc.applyDeltas(e.data);
            if (this.$timeout) {
                return deferredUpdate.schedule(this.$timeout);
            }
            else {
                // I'm not sure that we need to special-case this code.
                this.onUpdate();
            }
        });
    }

    /**
     * @param timeout
     */
    setTimeout(timeout: number): void {
        this.$timeout = timeout;
    }

    /**
     * @param value
     */
    setValue(value: string): void {
        this.doc.setValue(value);
        this.deferredUpdate.schedule(this.$timeout);
    }

    /**
     * Handles a request from the main thread for the value (string) of the Document in the mirror.
     */
    getValue(callbackId: number): void {
        this.host.callback(this.doc.getValue(), callbackId);
    }

    /**
     * Used to send annotations from the worker to the main thread.
     */
    emitAnnotations(annotations: Annotation[]): void {
        this.host.emit("annotations", annotations);
    }

    /**
     * Called after the timeout period. Derived classes will normally perform
     * a computationally expensive analysis then report annotations to the
     * host.
     */
    protected onUpdate() {
        // abstract method
    }

    /**
     *
     */
    isPending(): boolean {
        return this.deferredUpdate.isPending();
    }
}
