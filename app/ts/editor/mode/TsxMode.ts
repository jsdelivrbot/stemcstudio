import { TypeScriptMode } from './TypeScriptMode';

/**
 * The tsx mode extends the TypeScript mode.
 */
export class TsxMode extends TypeScriptMode {
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "TSX";
        this.$highlightRuleConfig = { jsx: true };
    }
}
