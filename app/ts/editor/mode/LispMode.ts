import { LispHighlightRules } from './LispHighlightRules';
import { TextMode } from './TextMode';

export class LispMode extends TextMode {
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.HighlightRules = LispHighlightRules;
        this.lineCommentStart = ";";
        this.$id = 'LISP';
    }
}
