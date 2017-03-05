import TypeScriptMode from './TypeScriptMode';

export class TsxMode extends TypeScriptMode {

    $id = "ace/mode/tsx";

    constructor(workerUrl: string, scriptImports: string[]) {
        super(workerUrl, scriptImports);
        this.$highlightRuleConfig = { jsx: true };
    }
}

export default TsxMode;
