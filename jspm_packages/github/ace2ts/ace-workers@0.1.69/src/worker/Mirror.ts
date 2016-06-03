import Annotation from "../Annotation";
import Delta from "../Delta";
import Document from "../Document";
import delayedCall from "../lib/delayedCall";
import DelayedFunctionCall from "../lib/DelayedFunctionCall";
import WorkerCallback from "../WorkerCallback";
import Range from "../Range";

/**
 * @class Mirror
 */
export default class Mirror {

    /**
     * @property host
     * @type WorkerCallback
     * @protected
     */
    protected host: WorkerCallback;

    /**
     * The doc(ument) property mirrors the value in the main (UI) thread.
     * The synchronization is performed by the Mirror base class.
     *
     * @property doc
     * @type Document
     * @protected
     */
    protected doc: Document;

    /**
     * The mirror will schedule calls to the derived class onUpdate method
     * approx 500ms after each 'change' event where deltas are received and
     * applied to the mirror document.
     *
     * The derived class may also schedule updates when options change.
     *
     * @property deferredUpdate
     * @type DelayedFunctionCall
     * @protected
     */
    protected deferredUpdate: DelayedFunctionCall;

    /**
     * This timeout is used to control the delay between editor changes
     * and the begin of a validation process. It is typically set to 500ms.
     *
     * @property $timeout
     * @type number
     * @private
     */
    private $timeout: number;

    /**
     * <p>
     * Initializes the 'host' property to the specified argument.
     * </p>
     * <p>
     * Initializes the 'doc' property to a new <code>Document</code>.
     * </p>
     * <p>
     * Initializes the 'deferredUpdate' property to a delayed call to 'onUpdate'.
     * </p>
     * <p>
     * Binds the 'host' "change" event to a function that synchronously updates
     * the thread Document copy and requests an asynchronous callback to the
     * onUpdate method. This triggers the validation processing.
     * </p>
     *
     * @class Mirror
     * @constructor
     * @param host {WorkerCallback}
     * @param [timeout] {number}
     */
    constructor(host: WorkerCallback, timeout: number = 500) {
        if (typeof host !== 'object') {
            throw new TypeError("host must be an object.");
        }
        this.host = host;
        this.$timeout = timeout;
        this.doc = new Document("");

        var deferredUpdate = this.deferredUpdate = delayedCall(this.onUpdate.bind(this));

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
     * @method setTimeout
     * @param timeout {number}
     * @return {void}
     */
    setTimeout(timeout: number): void {
        this.$timeout = timeout;
    }

    /**
     * @method setValue
     * @param value {string}
     * @return {void}
     */
    setValue(value: string): void {
        this.doc.setValue(value);
        this.deferredUpdate.schedule(this.$timeout);
    }

    /**
     * @method getValue
     * @param callbackId {number}
     * @return {void}
     */
    getValue(callbackId: number): void {
        this.host.callback(this.doc.getValue(), callbackId);
    }

    /**
     * @method emitAnnotations
     * @param annotations {Annotation[]}
     * @return {void}
     */
    emitAnnotations(annotations: Annotation[]): void {
        /**
         * @event annotations
         * @param annotations {Annotation[]}
         */
        this.host.emit("annotations", annotations);
    }
    
    /**
     * Called after the timeout period. Derived classes will normally perform
     * a computationally expensive analysis then report annotations to the
     * host.
     *
     * @method onUpdate
     * @return {void}
     * @protected
     */
    protected onUpdate() {
        // abstract method
    }

    /**
     * @method isPending
     * @return {boolean}
     */
    isPending(): boolean {
        return this.deferredUpdate.isPending();
    }
}
