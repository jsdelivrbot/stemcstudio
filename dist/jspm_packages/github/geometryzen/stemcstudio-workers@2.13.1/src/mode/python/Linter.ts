import { PythonLanguageService } from './PythonLanguageService';

export interface IRuleFailurePositionJson {
    character: number;
    line: number;
    position: number;
}

export class RuleFailurePosition {
    constructor(private position: number, private lineAndCharacter: ts.LineAndCharacter) {
    }

    public getPosition() {
        return this.position;
    }

    public getLineAndCharacter() {
        return this.lineAndCharacter;
    }

    public toJson(): IRuleFailurePositionJson {
        return {
            character: this.lineAndCharacter.character,
            line: this.lineAndCharacter.line,
            position: this.position,
        };
    }

    public equals(ruleFailurePosition: RuleFailurePosition) {
        const ll = this.lineAndCharacter;
        const rr = ruleFailurePosition.lineAndCharacter;

        return this.position === ruleFailurePosition.position
            && ll.line === rr.line
            && ll.character === rr.character;
    }
}

export class Replacement {
    public static applyAll(content: string, replacements: Replacement[]) {
        // sort in reverse so that diffs are properly applied
        replacements.sort((a, b) => b.end - a.end);
        return replacements.reduce((text, r) => r.apply(text), content);
    }

    public static replaceFromTo(start: number, end: number, text: string) {
        return new Replacement(start, end - start, text);
    }

    public static deleteText(start: number, length: number) {
        return new Replacement(start, length, "");
    }

    public static deleteFromTo(start: number, end: number) {
        return new Replacement(start, end - start, "");
    }

    public static appendText(start: number, text: string) {
        return new Replacement(start, 0, text);
    }

    constructor(private innerStart: number, private innerLength: number, private innerText: string) {
    }

    get start() {
        return this.innerStart;
    }

    get length() {
        return this.innerLength;
    }

    get end() {
        return this.innerStart + this.innerLength;
    }

    get text() {
        return this.innerText;
    }

    public apply(content: string) {
        return content.substring(0, this.start) + this.text + content.substring(this.start + this.length);
    }
}

export class Fix {
    public static applyAll(content: string, fixes: Fix[]) {
        // accumulate replacements
        let replacements: Replacement[] = [];
        for (const fix of fixes) {
            replacements = replacements.concat(fix.replacements);
        }
        return Replacement.applyAll(content, replacements);
    }

    constructor(private innerRuleName: string, private innerReplacements: Replacement[]) {
    }

    get ruleName() {
        return this.innerRuleName;
    }

    get replacements() {
        return this.innerReplacements;
    }

    public apply(content: string) {
        return Replacement.applyAll(content, this.innerReplacements);
    }
}

export interface IRuleFailureJson {
    endPosition: IRuleFailurePositionJson;
    failure: string;
    fix?: Fix;
    name: string;
    ruleName: string;
    startPosition: IRuleFailurePositionJson;
}

export class RuleFailure {
    private fileName: string;
    private startPosition: RuleFailurePosition;
    private endPosition: RuleFailurePosition;
    private rawLines: string;

    constructor(private sourceFile: ts.SourceFile,
        start: number,
        end: number,
        private failure: string,
        private ruleName: string,
        private fix?: Fix) {

        this.fileName = sourceFile.fileName;
        this.startPosition = this.createFailurePosition(start);
        this.endPosition = this.createFailurePosition(end);
        this.rawLines = sourceFile.text;
    }

    public getFileName(): string {
        return this.fileName;
    }

    public getRuleName(): string {
        return this.ruleName;
    }

    public getStartPosition(): RuleFailurePosition {
        return this.startPosition;
    }

    public getEndPosition(): RuleFailurePosition {
        return this.endPosition;
    }

    /**
     * The message describing why the rule failed.
     */
    public getFailure(): string {
        return this.failure;
    }

    public hasFix(): boolean {
        return this.fix !== undefined;
    }

    public getFix(): Fix {
        return this.fix;
    }

    public getRawLines(): string {
        return this.rawLines;
    }

    public toJson(): IRuleFailureJson {
        return {
            endPosition: this.endPosition.toJson(),
            failure: this.failure,
            fix: this.fix,
            name: this.fileName,
            ruleName: this.ruleName,
            startPosition: this.startPosition.toJson(),
        };
    }

    public equals(ruleFailure: RuleFailure) {
        return this.failure === ruleFailure.getFailure()
            && this.fileName === ruleFailure.getFileName()
            && this.startPosition.equals(ruleFailure.getStartPosition())
            && this.endPosition.equals(ruleFailure.getEndPosition());
    }

    private createFailurePosition(position: number) {
        const lineAndCharacter = this.sourceFile.getLineAndCharacterOfPosition(position);
        return new RuleFailurePosition(position, lineAndCharacter);
    }
}

export class Linter {
    private failures: RuleFailure[] = [];
    // private fixes: RuleFailure[] = [];

    constructor(options: {}, languageService: PythonLanguageService) {
        // Do nothin yet.
    }
    lint(fileName: string, configuration: {}): void {
        // console.warn(`lint('${fileName}') is not yet implemented.`);
    }
    public getRuleFailures(): RuleFailure[] {
        return this.failures;
    }
}
