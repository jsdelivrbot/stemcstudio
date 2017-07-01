import { TextMode } from "./TextMode";
import { AsciiDocHighlightRules } from './AsciiDocHighlightRules';
import { AsciiDocFoldMode } from './folding/AsciiDocFoldMode';

/**
 *
 */
export class AsciiDocMode extends TextMode {
    // type = "text";
    /**
     *
     */
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "AsciiDoc";
        this.HighlightRules = AsciiDocHighlightRules;
        this.foldingRules = new AsciiDocFoldMode();
    }
    /**
     *
     */
    getNextLineIndent(state: string, line: string, tab: string): string {
        if (state === "listblock") {
            const match = /^((?:.+)?)([-+*][ ]+)/.exec(line);
            if (match) {
                return new Array(match[1].length + 1).join(" ") + match[2];
            }
            else {
                return "";
            }
        }
        else {
            return this.$getIndent(line);
        }
    }
}
