import mixin from '../lib/mixin';
import Annotation from "../Annotation";
import Mirror from '../worker/Mirror';
import Document from '../Document';
import WorkerCallback from "../WorkerCallback";

/**
 * Doesn't really do much because TypeScript requires the concept of a workspace.
 * 
 * However, does provide some notifications to trigger further actions.
 *
 * @class TypeScriptWorker
 * @extends Mirror
 */
export default class TypeScriptWorker extends Mirror {

    /**
     * @property options
     * @private
     */
    private options;

    /**
     * @class TypeScriptWorker
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
     * @private
     */
    private setOptions(options?) {
        this.options = options || {};
    }

    /**
     * @method changeOptions
     * @param options
     * @return {void}
     * @private
     */
    private changeOptions(options): void {
        mixin(this.options, options);
        this.deferredUpdate.schedule(100);
    }

    /**
     * @method onUpdate
     * @return {void}
     * @protected
     */
    protected onUpdate(): void {
        const annotations: Annotation[] = [];
        this.emitAnnotations(annotations);
    }
}
