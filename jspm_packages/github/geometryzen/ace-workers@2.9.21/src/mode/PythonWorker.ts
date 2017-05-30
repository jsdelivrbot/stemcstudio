import { Annotation } from "../Annotation";
import { Mirror } from "../worker/Mirror";
import { WorkerCallback } from "../WorkerCallback";
import { transpileModule, ParseError } from 'typhon-lang';

export class PythonWorker extends Mirror {

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

        const sourceText = this.doc.getValue();

        const annotations: Annotation[] = [];
        try {
            const result = transpileModule(sourceText);
            console.log(result.code);
            /* const result: Node | Node[] = */ // parse(value);
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                if (e.name === 'ParseError') {
                    console.log(JSON.stringify(e, null, 2));
                    const parseError: ParseError = e;
                    if (parseError.begin) {
                        const row = parseError.begin.row;
                        const column = parseError.begin.column;
                        const annotation: Annotation = { row, column, text: e.message, type: 'error' };
                        annotations.push(annotation);
                    }
                    else {
                        const annotation: Annotation = { row: 0, text: e.message, type: 'error' };
                        annotations.push(annotation);
                        console.warn(JSON.stringify(e, null, 2));
                    }
                }
                else {
                    const annotation: Annotation = { row: 0, text: e.message, type: 'error' };
                    annotations.push(annotation);
                    console.warn(JSON.stringify(e, null, 2));
                }
            }
            else {
                console.warn(JSON.stringify(e, null, 2));
            }
        }
        this.emitAnnotations(annotations);
    }
}
