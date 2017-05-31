// mixin is being used to merge options that we don't actually use!
import { mixin } from '../fp/mixin';
import { Annotation } from "../editor/Annotation";
import { Mirror } from "./Mirror";
import { WorkerCallback } from "./WorkerCallback";
// import { transpileModule, ParseError } from 'typhon-lang';
/**
 * Doesn't really do much because TypeScript requires the concept of a workspace.
 *
 * However, does provide some notifications to trigger further actions.
 */
export class PythonWorker extends Mirror {

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
    private setOptions(options?: {}): void {
        this.options = options || {};
        if (this.doc.getValue()) {
            this.deferredUpdate.schedule(100);
        }
    }

    /**
     *
     */
    changeOptions(options?: {}): void {
        mixin(this.options, options);
        if (this.doc.getValue()) {
            this.deferredUpdate.schedule(100);
        }
    }

    /**
     *
     */
    protected onUpdate(): void {
        const annotations: Annotation[] = [];
        /*
                const sourceText = this.doc.getValue();

                try {
                    transpileModule(sourceText);
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
        */
        this.emitAnnotations(annotations);
    }
}
