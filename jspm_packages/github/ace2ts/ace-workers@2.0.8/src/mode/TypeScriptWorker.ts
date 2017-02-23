import mixin from '../lib/mixin';
import Annotation from "../Annotation";
import Mirror from '../worker/Mirror';
import WorkerCallback from "../WorkerCallback";
// import Linter from './typescript/tslint/linter';

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

    // private linter: Linter;

    /**
     *
     */
    constructor(host: WorkerCallback) {
        super(host, 500);
        this.setOptions();
        // this.linter = new Linter({ fix: false }, program);
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
        let value = this.doc.getValue();
        value = value.replace(/^#!.*\n/, "\n");
        if (!value) {
            this.emitAnnotations([]);
            return;
        }

        // this.linter.lint('dunno.ts', value);
        /*
        const failures = this.linter.getRuleFailures();
        const annotations = failures.map(function (ruleFailure) {
            const annotation: Annotation = { row: 7, text: '', type: '' };
            return annotation;
        });
        */
        const annotations: Annotation[] = [];
        this.emitAnnotations(annotations);
    }
}
