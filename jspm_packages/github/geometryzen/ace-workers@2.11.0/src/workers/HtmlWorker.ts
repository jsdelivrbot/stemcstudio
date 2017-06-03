import { Annotation } from "../editor/Annotation";
import { Mirror } from "./Mirror";
import { SAXParser } from "../mode//html/SAXParser";
import { WorkerCallback } from "./WorkerCallback";

// Map certain codes from the SAXParser into an Annotation type.
// Everything else gets mapped to an "error" type.
const codeToAnnotationType = {
    "expected-doctype-but-got-start-tag": "info",
    "expected-doctype-but-got-chars": "info",
    "non-html-root": "info",
};

/**
 *
 */
export class HtmlWorker extends Mirror {

    context;

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
    setOptions(options?: { context }) {
        if (options) {
            this.context = options.context;
        }
        else {
            this.context = void 0;
        }
        if (this.doc.getValue()) {
            this.deferredUpdate.schedule(100);
        }
    }

    /**
     *
     */
    protected onUpdate(): void {
        const annotations: Annotation[] = [];
        const value = this.doc.getValue();
        if (!value) {
            this.emitAnnotations(annotations);
            return;
        }
        const parser = new SAXParser();
        if (parser) {
            const noop = function () {
                // Do nothing.
            };
            parser.contentHandler = {
                startDocument: noop,
                endDocument: noop,
                startElement: noop,
                endElement: noop,
                characters: noop
            };
            parser.errorHandler = {
                error: function (message: string, location: { line: number; column: number }, code: string) {
                    annotations.push({
                        row: location.line,
                        column: location.column,
                        text: message,
                        type: codeToAnnotationType[code] || "error"
                    });
                }
            };
            if (this.context) {
                parser.parseFragment(value, this.context);
            }
            else {
                parser.parse(value);
            }
        }

        this.emitAnnotations(annotations);
    }
}
