import mixin from "../lib/mixin";
import Annotation from "../Annotation";
import Mirror from "../worker/Mirror";
import WorkerCallback from "../WorkerCallback";

import { JSHINT } from "./javascript/jshint";
import JSHintOptions from "./javascript/JSHintOptions";
import JSHintError from "./javascript/JSHintError";

function isValidJS(str: string): boolean {
    try {
        // evaluated code can only create variables in this function
        eval("throw 0;" + str);
    }
    catch (e) {
        if (e === 0)
            return true;
    }
    return false;
}

function startRegex(arr: string[]): RegExp {
    return RegExp("^(" + arr.join("|") + ")");
}

const disabledWarningsRe = startRegex([
    "Bad for in variable '(.+)'.",
    'Missing "use strict"'
]);

const errorsRe = startRegex([
    "Unexpected",
    "Expected ",
    "Confusing (plus|minus)",
    "\\{a\\} unterminated regular expression",
    "Unclosed ",
    "Unmatched ",
    "Unbegun comment",
    "Bad invocation",
    "Missing space after",
    "Missing operator at"
]);

const infoRe = startRegex([
    "Expected an assignment",
    "Bad escapement of EOL",
    "Unexpected comma",
    "Unexpected space",
    "Missing radix parameter.",
    "A leading decimal point can",
    "\\['{a}'\\] is better written in dot notation.",
    "'{a}' used out of scope"
]);

/**
 *
 */
export default class JavaScriptWorker extends Mirror {
    options: JSHintOptions;

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
    setOptions(options?: JSHintOptions): void {
        this.options = options || {
            // undef: true,
            // unused: true,
            esnext: true,
            moz: true,
            devel: true,
            browser: true,
            node: true,
            laxcomma: true,
            laxbreak: true,
            lastsemic: true,
            onevar: false,
            passfail: false,
            maxerr: 100,
            expr: true,
            multistr: true,
            globalstrict: true
        };
        if (this.doc.getValue()) {
            this.deferredUpdate.schedule(100);
        }
    }

    /**
     *
     */
    changeOptions(options: JSHintOptions) {
        mixin(this.options, options);
        if (this.doc.getValue()) {
            this.deferredUpdate.schedule(100);
        }
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
        const annotations: Annotation[] = [];

        // jshint reports many false errors
        // report them as error only if code is actually invalid
        const maxErrorLevel = isValidJS(value) ? "warning" : "error";

        JSHINT(value, this.options);
        const results: JSHintError[] = JSHINT.errors;

        let errorAdded = false;
        for (let i = 0; i < results.length; i++) {
            const error = results[i];
            if (!error)
                continue;
            const raw = error.raw;
            let type = "warning";

            if (raw === "Missing semicolon.") {
                let str = error.evidence.substr(error.character);
                str = str.charAt(str.search(/\S/));
                if (maxErrorLevel === "error" && str && /[\w\d{(['"]/.test(str)) {
                    error.reason = 'Missing ";" before statement';
                    type = "error";
                }
                else {
                    type = "info";
                }
            }
            else if (disabledWarningsRe.test(raw)) {
                continue;
            }
            else if (infoRe.test(raw)) {
                type = "info";
            }
            else if (errorsRe.test(raw)) {
                errorAdded = true;
                type = maxErrorLevel;
            }
            else if (raw === "'{a}' is not defined.") {
                type = "warning";
            }
            else if (raw === "'{a}' is defined but never used.") {
                type = "info";
            }

            annotations.push({
                row: error.line - 1,
                column: error.character - 1,
                text: error.reason,
                type: type
            });

            if (errorAdded) {
                // break;
            }
        }

        this.emitAnnotations(annotations);
    }
}
