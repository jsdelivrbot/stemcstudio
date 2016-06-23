import CppMode from './CppMode';
import CstyleBehaviour from './behaviour/CstyleBehaviour';
import CstyleFoldMode from './folding/CstyleFoldMode';
import GlslHighlightRules from './GlslHighlightRules';
import MatchingBraceOutdent from "./MatchingBraceOutdent";

export default class GlslMode extends CppMode {
    $id = "ace/mode/glsl";
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.HighlightRules = GlslHighlightRules;

        this.$outdent = new MatchingBraceOutdent();
        this.$behaviour = new CstyleBehaviour();
        this.foldingRules = new CstyleFoldMode();
    }
}
