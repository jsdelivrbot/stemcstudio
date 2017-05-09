import TypeScriptMode from './TypeScriptMode';

export class TsxMode extends TypeScriptMode {
    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$id = "TSX";
        this.$highlightRuleConfig = { jsx: true };
    }
}

export default TsxMode;
