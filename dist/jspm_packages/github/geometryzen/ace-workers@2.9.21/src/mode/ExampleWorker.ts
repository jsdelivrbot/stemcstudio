import { Annotation } from "../Annotation";
import { Mirror } from "../worker/Mirror";
import { WorkerCallback } from "../WorkerCallback";

/**
 *
 */
export class ExampleWorker extends Mirror {

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
    setOptions(options?: {}): void {
        if (this.doc.getValue()) {
            this.deferredUpdate.schedule(100);
        }
    }

    /**
     * TODO: Is this dead code?
     */
    changeOptions(options?: {}): void {
        if (this.doc.getValue()) {
            this.deferredUpdate.schedule(100);
        }
    }


    /**
     *
     */
    protected onUpdate(): void {

        /* const value = */ this.doc.getValue();

        // Use value to determine annotations.

        const annotations: Annotation[] = [];

        this.emitAnnotations(annotations);
    }
}
