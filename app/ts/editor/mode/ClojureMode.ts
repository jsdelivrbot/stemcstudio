import { TextMode } from "./TextMode";
import { hookAnnotations, hookTerminate, initWorker } from './TextMode';
import { ClojureHighlightRules } from "./ClojureHighlightRules";
import { MatchingParensOutdent } from "./MatchingParensOutdent";
import { WorkerClient } from "../worker/WorkerClient";
import { EditSession } from '../EditSession';

const minorIndentFunctions = ["defn", "defn-", "defmacro", "def", "deftest", "testing"];
const outdent = new MatchingParensOutdent();

export class ClojureMode extends TextMode {
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.HighlightRules = ClojureHighlightRules;
        this.lineCommentStart = ";";
        this.$id = "Clojure";
    }

    private $toIndent(str: string): string {
        return str.split('').map(function (ch) {
            if (/\s/.exec(ch)) {
                return ch;
            }
            else {
                return ' ';
            }
        }).join('');
    }

    private $calculateIndent(line: string, tab: string): string {
        let baseIndent = this.$getIndent(line);
        let delta = 0;
        let isParen = false;
        let ch: string;
        // Walk back from end of line, find matching braces
        let i: number;
        for (i = line.length - 1; i >= 0; i--) {
            ch = line[i];
            if (ch === '(') {
                delta--;
                isParen = true;
            }
            else if (ch === '(' || ch === '[' || ch === '{') {
                delta--;
                isParen = false;
            }
            else if (ch === ')' || ch === ']' || ch === '}') {
                delta++;
            }
            if (delta < 0) {
                break;
            }
        }
        if (delta < 0 && isParen) {
            // Were more brackets opened than closed and was a ( left open?
            i += 1;
            const iBefore = i;
            let fn = '';
            while (true) {
                ch = line[i];
                if (ch === ' ' || ch === '\t') {
                    if (minorIndentFunctions.indexOf(fn) !== -1) {
                        return this.$toIndent(line.substring(0, iBefore - 1) + tab);
                    } else {
                        return this.$toIndent(line.substring(0, i + 1));
                    }
                } else if (ch === undefined) {
                    return this.$toIndent(line.substring(0, iBefore - 1) + tab);
                }
                fn += line[i];
                i++;
            }
        }
        else if (delta < 0 && !isParen) {
            // Were more brackets openend than closed and was it not a (?
            return this.$toIndent(line.substring(0, i + 1));
        }
        else if (delta > 0) {
            // Mere more brackets closed than opened? Outdent.
            baseIndent = baseIndent.substring(0, baseIndent.length - tab.length);
            return baseIndent;
        }
        else {
            // Were they nicely matched? Just indent like line before.
            return baseIndent;
        }
    }

    getNextLineIndent(state: string, line: string, tab: string): string {
        return this.$calculateIndent(line, tab);
    }

    checkOutdent(state: string, line: string, text: string): boolean {
        return outdent.checkOutdent(line, text);
    }

    autoOutdent(state: string, session: EditSession, row: number): void {
        outdent.autoOutdent(session, row);
    }

    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => any): void {
        const worker = new WorkerClient(this.workerUrl);
        const tearDown = hookAnnotations(worker, session, true);
        hookTerminate(worker, session, tearDown);
        initWorker(worker, 'stemcstudio-workers.js', 'ClojureWorker', this.scriptImports, session, callback);
    }
}
