import Annotation from "../Annotation";
import Mirror from "../worker/Mirror";
import WorkerCallback from "../WorkerCallback";
// import {CSSLint} from './css/CSSLint';

/**
 * @class CssWorker
 * @extends Mirror
 */
export default class CssWorker extends Mirror {

    /**
     * @class CssWorker
     * @constructor
     * @param host {WorkerCallback}
     */
    constructor(host: WorkerCallback) {
        super(host, 500);
        this.setOptions();
    }

    /**
     * @method setOptions
     * @param [options]
     * @return {void}
     */
    setOptions(options?: {}): void {
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    }

    /**
     * @method onUpdate
     * @return {void}
     * @protected
     */
    protected onUpdate(): void {

        const value = this.doc.getValue();

        // Use value to determine annotations.

        const annotations: Annotation[] = [];

        this.emitAnnotations(annotations);
    }
}