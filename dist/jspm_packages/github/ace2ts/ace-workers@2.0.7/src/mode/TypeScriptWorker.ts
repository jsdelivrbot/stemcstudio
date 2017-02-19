import mixin from '../lib/mixin';
import Annotation from "../Annotation";
import Mirror from '../worker/Mirror';
import WorkerCallback from "../WorkerCallback";

/**
 * Doesn't really do much because TypeScript requires the concept of a workspace.
 * 
 * However, does provide some notifications to trigger further actions.
 */
export default class TypeScriptWorker extends Mirror {

    /**
     *
     */
    private options;

    /**
     *
     */
    constructor(host: WorkerCallback) {
        super(host, 500);
        this.setOptions();
    }

    /**
     *
     */
    private setOptions(options?) {
        this.options = options || {};
    }

    /**
     *
     */
    public changeOptions(options): void {
        mixin(this.options, options);
        this.deferredUpdate.schedule(100);
    }

    /**
     *
     */
    protected onUpdate(): void {
        const annotations: Annotation[] = [];
        this.emitAnnotations(annotations);
    }
}
