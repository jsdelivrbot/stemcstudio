import { Annotation } from "../Annotation";
import { Mirror } from "../worker/Mirror";
import { WorkerCallback } from "../WorkerCallback";
import { parse } from './glsl/parse';

export class GlslWorker extends Mirror {

    constructor(host: WorkerCallback) {
        super(host, 200);
        this.setOptions();
    }

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

    protected onUpdate(): void {

        const value = this.doc.getValue();

        const annotations: Annotation[] = [];
        try {
            /* const result: Node | Node[] = */ parse(value);
        }
        catch (e) {
            // const index: number = e.at - 1;
            const text: string = e.message;
            // const pos = this.doc.indexToPosition(index);
            // const row = pos.row;
            // const column = pos.column;
            /**
             * row is zero-based whereas line is 1-based.
             */
            const row = e.line - 1;
            const column = e.column;
            const annotation: Annotation = { row, column, text, type: 'error' };
            annotations.push(annotation);
        }
        this.emitAnnotations(annotations);
    }
}
