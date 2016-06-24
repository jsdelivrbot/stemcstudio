import Annotation from "../Annotation";
import Mirror from "../worker/Mirror";
import WorkerCallback from "../WorkerCallback";
import parse from './json/parse';

/**
 * @class JsonWorker
 * @extends Mirror
 */
export default class JsonWorker extends Mirror {

    /**
     * @class JsonWorker
     * @constructor
     * @param host {WorkerCallback}
     */
    constructor(host: WorkerCallback) {
        super(host, 200);
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
     * TODO: Is this dead code?
     *
     * @method changeOptions
     * @param [options]
     * @return {void}
     */
    changeOptions(options?: {}): void {
        this.doc.getValue() && this.deferredUpdate.schedule(100);
    }

    /**
     * @method onUpdate
     * @return {void}
     * @protected
     */
    protected onUpdate(): void {

        const value = this.doc.getValue();

        const annotations: Annotation[] = [];
        try {
            const result = parse(value);
        }
        catch (e) {
            const index: number = e.at - 1;
            const text: string = e.message;
            const pos = this.doc.indexToPosition(index);
            const row = pos.row;
            const column = pos.column;
            const annotation: Annotation = { row, column, text, type: 'error' };
            annotations.push(annotation)
        }
        this.emitAnnotations(annotations);
    }
}
