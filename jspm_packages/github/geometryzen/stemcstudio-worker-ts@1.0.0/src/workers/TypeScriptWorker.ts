// mixin is being used to merge options that we don't actually use!
import { mixin } from '../fp/mixin';
import { Annotation } from "../editor/Annotation";
import { Mirror } from './Mirror';
import { WorkerCallback } from "./WorkerCallback";

/**
 * Doesn't really do much because TypeScript requires the concept of a workspace.
 *
 * However, does provide some notifications to trigger further actions.
 */
export class TypeScriptWorker extends Mirror {

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
    private setOptions(options?: {}) {
        this.options = options || {};
        if (this.doc.getValue()) {
            this.deferredUpdate.schedule(100);
        }
    }

    /**
     *
     */
    public changeOptions(options): void {
        mixin(this.options, options);
        if (this.doc.getValue()) {
            this.deferredUpdate.schedule(100);
        }
    }

    /**
     * Emits an empty list of annotations.
     * This method is public in order to support unit testing.
     */
    public onUpdate(): void {
        const annotations: Annotation[] = [];
        this.emitAnnotations(annotations);
    }
}
