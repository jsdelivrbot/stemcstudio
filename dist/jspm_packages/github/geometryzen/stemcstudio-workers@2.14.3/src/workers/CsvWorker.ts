import { Annotation } from "../editor/Annotation";
import { Mirror } from "./Mirror";
import { WorkerCallback } from "./WorkerCallback";
import { parse, CSVError } from 'davinci-csv';

/**
 *
 */
export class CsvWorker extends Mirror {

    /**
     *
     */
    constructor(host: WorkerCallback) {
        super(host, 200);
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
    public onUpdate(): void {

        const value = this.doc.getValue();

        const annotations: Annotation[] = [];
        try {
            const errors: CSVError[] = [];
            parse(value, {}, errors);
            for (const error of errors) {
                const pos = this.doc.indexToPosition(error.index);
                const row = pos.row;
                const column = pos.column;
                const annotation: Annotation = { row, column, text: error.message, type: 'error' };
                annotations.push(annotation);
            }
        }
        catch (e) {
            // Fallback in case the parser throws...
            console.log(`e => ${JSON.stringify(e, null, 2)}`);
            if (e instanceof CSVError) {
                const text = e.message;
                const pos = this.doc.indexToPosition(e.index);
                const row = pos.row;
                const column = pos.column;
                const annotation: Annotation = { row, column, text, type: 'error' };
                annotations.push(annotation);
            }
            else {
                const text = `${e}`;
                const annotation: Annotation = { row: 0, column: 0, text, type: 'error' };
                annotations.push(annotation);
            }
        }
        this.emitAnnotations(annotations);
    }
}
