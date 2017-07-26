import { TextMode } from "./TextMode";
import { hookAnnotations, hookTerminate, initWorker } from './TextMode';
import { PythonHighlightRules } from "./PythonHighlightRules";
import { MatchingBraceOutdent } from "./MatchingBraceOutdent";
import { WorkerClient } from "../worker/WorkerClient";
import { Range } from '../Range';
import { Token } from '../Token';
import { PythonFoldMode } from './folding/PythonFoldMode';
import { EditSession } from '../EditSession';

const outdents = {
    "pass": 1,
    "return": 1,
    "raise": 1,
    "break": 1,
    "continue": 1
};

export class PythonMode extends TextMode {
    $outdent: MatchingBraceOutdent;

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "Python";
        this.lineCommentStart = "#";
        this.HighlightRules = PythonHighlightRules;
        this.foldingRules = new PythonFoldMode("\\:");
        this.$behaviour = this.$defaultBehaviour;
        this.blockComment = { start: "'''", end: "'''" };
    }

    getNextLineIndent(state: string, line: string, tab: string): string {
        let indent = this.$getIndent(line);

        const tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        const tokens = tokenizedLine.tokens;

        if (tokens.length && tokens[tokens.length - 1].type === "comment") {
            return indent;
        }

        if (state === "start") {
            const match = line.match(/^.*[\{\(\[\:]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    }

    checkOutdent(state: string, line: string, input: string): boolean {
        if (input !== "\r\n" && input !== "\r" && input !== "\n")
            return false;

        const tokens = this.getTokenizer().getLineTokens(line.trim(), state).tokens;

        if (!tokens)
            return false;

        // ignore trailing comments
        let last: Token | undefined;
        do {
            last = tokens.pop();
        } while (last && (last.type === "comment" || (last.type === "text" && last.value.match(/^\s+$/))));

        if (!last) {
            return false;
        }

        return (last.type === "keyword" && outdents[last.value]);
    }

    autoOutdent(state: string, doc: EditSession, row: number): void {
        // outdenting in python is slightly different because it always applies
        // to the next line and only of a new line is inserted

        row += 1;
        const indent = this.$getIndent(doc.getLine(row));
        const tab = doc.getTabString();
        if (indent.slice(-tab.length) === tab) {
            doc.remove(new Range(row, indent.length - tab.length, row, indent.length));
        }
    }

    createWorker(session: EditSession, callback: (err: any, worker?: WorkerClient) => void): void {

        const worker = new WorkerClient(this.workerUrl);
        const tearDown = hookAnnotations(worker, session, true);
        hookTerminate(worker, session, tearDown);

        initWorker(worker, 'stemcstudio-workers.js', 'PythonWorker', this.scriptImports, session, callback);
    }
}
