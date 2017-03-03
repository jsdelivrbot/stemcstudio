import Delta from '../Delta';
import DefaultLanguageServiceHost from './typescript/DefaultLanguageServiceHost';
import DocumentRegistryInspector from './typescript/DocumentRegistryInspector';
import Linter from './typescript/tslint/linter';
import { IConfigurationFile } from './typescript/tslint/configuration';
import { RuleArgumentType } from "./typescript/tslint/language/rule/rule";
import WorkerCallback from "../WorkerCallback";

/**
 *
 */
const useCaseSensitiveFileNames = true;

const EVENT_APPLY_DELTA = 'applyDelta';
const EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';
const EVENT_ENSURE_SCRIPT = 'ensureScript';
const EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition';
const EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT = 'getFormattingEditsForDocument';
const EVENT_GET_OUTPUT_FILES = 'getOutputFiles';
const EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors';
const EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors';
const EVENT_GET_LINT_ERRORS = 'getLintErrors';
const EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition';
const EVENT_REMOVE_SCRIPT = 'removeScript';
const EVENT_SET_MODULE_KIND = 'setModuleKind';
const EVENT_SET_SCRIPT_TARGET = 'setScriptTarget';
const EVENT_SET_TRACE = 'setTrace';

/**
 * systemModuleName(void 0, 'Foo.ts', 'js'))   => Foo.js
 * systemModuleName('./',   'Foo.ts', 'js'))   => ./Foo.js
 * systemModuleName(void 0, 'Foo.ts', 'd.ts')) => Foo.d.ts
 */
function systemModuleName(prefix: string, fileName: string, extension: string): string {
    const lastPeriod = fileName.lastIndexOf('.');
    if (lastPeriod >= 0) {
        const name = fileName.substring(0, lastPeriod);
        /* const suffix = */ fileName.substring(lastPeriod + 1);
        if (typeof extension === 'string') {
            return [prefix, name, '.', extension].join('');
        }
        else {
            return [prefix, name].join('');
        }
    }
    else {
        if (typeof extension === 'string') {
            return [prefix, fileName, '.', extension].join('');
        }
        else {
            return [prefix, fileName].join('');
        }
    }
}

/**
 *
 */
export default class LanguageServiceWorker {

    /**
     * Used to control tracing from the client side.
     */
    private trace = true;

    /**
     * The host contains the file contents and compiler options.
     */
    private readonly host_: DefaultLanguageServiceHost;

    /**
     * The language service answers the tough queries.
     * It is created lazily.
     */
    private languageService_: ts.LanguageService;

    /**
     * The document registry is the same for the lifetime of the application and shared across language services.
     * Entries in the document registry have a count of the number of services using them.
     */
    private readonly documentRegistry_: DocumentRegistryInspector;

    /**
     *
     */
    constructor(private sender: WorkerCallback) {

        this.host_ = new DefaultLanguageServiceHost();

        this.documentRegistry_ = new DocumentRegistryInspector(ts.createDocumentRegistry(useCaseSensitiveFileNames));

        sender.on(EVENT_SET_TRACE, (message: { data: { trace: boolean, callbackId: number } }) => {
            const { trace, callbackId } = message.data;
            try {
                this.trace = trace;
                this.documentRegistry_.trace = trace;
                if (this.trace) {
                    console.log(`${EVENT_SET_TRACE}(${trace})`);
                }
                this.resolve(EVENT_SET_TRACE, void 0, callbackId);
            }
            catch (err) {
                this.reject(EVENT_SET_TRACE, err, callbackId);
            }
        });

        sender.on(EVENT_DEFAULT_LIB_CONTENT, (message: { data: { content: string; callbackId: number } }) => {
            const { content, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_DEFAULT_LIB_CONTENT}(${this.host_.getDefaultLibFileName({})})`);
                }
                this.host_.ensureScript(this.host_.getDefaultLibFileName({}), content);
                this.resolve(EVENT_DEFAULT_LIB_CONTENT, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_DEFAULT_LIB_CONTENT, reason, callbackId);
            }
        });

        sender.on(EVENT_ENSURE_SCRIPT, (message: { data: { fileName: string; content: string; callbackId: number } }) => {
            const { fileName, content, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_ENSURE_SCRIPT}(${fileName})`);
                }
                this.host_.ensureScript(fileName, content);
                this.resolve(EVENT_ENSURE_SCRIPT, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_ENSURE_SCRIPT, reason, callbackId);
            }
        });

        sender.on(EVENT_APPLY_DELTA, (message: { data: { fileName: string; delta: Delta, callbackId: number } }) => {
            const { fileName, delta, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_APPLY_DELTA}(${fileName}, ${JSON.stringify(delta, null, 2)})`);
                }
                this.host_.applyDelta(fileName, delta);
                this.resolve(EVENT_APPLY_DELTA, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_APPLY_DELTA, reason, callbackId);
            }
        });

        sender.on(EVENT_REMOVE_SCRIPT, (message: { data: { fileName: string; callbackId: number } }) => {
            const { fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_REMOVE_SCRIPT}(${fileName})`);
                }
                this.host_.removeScript(fileName);
                this.resolve(EVENT_REMOVE_SCRIPT, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_REMOVE_SCRIPT, reason, callbackId);
            }
        });

        sender.on(EVENT_SET_MODULE_KIND, (message: { data: { moduleKind: string, callbackId: number } }) => {
            const { moduleKind, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_SET_MODULE_KIND}(${moduleKind})`);
                }
                this.host_.moduleKind = moduleKind;
                this.resolve(EVENT_SET_MODULE_KIND, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_SET_MODULE_KIND, reason, callbackId);
            }
        });

        sender.on(EVENT_SET_SCRIPT_TARGET, (message: { data: { scriptTarget: string, callbackId: number } }) => {
            const { scriptTarget, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_SET_SCRIPT_TARGET}(${scriptTarget})`);
                }
                this.host_.scriptTarget = scriptTarget;
                this.resolve(EVENT_SET_SCRIPT_TARGET, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_SET_SCRIPT_TARGET, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_SYNTAX_ERRORS, (message: { data: { fileName: string; callbackId: number } }) => {
            const { fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_SYNTAX_ERRORS}(${fileName})`);
                }
                const diagnostics = this.ensureLS().getSyntacticDiagnostics(fileName);
                const errors = diagnostics.map(function (diagnostic: ts.Diagnostic) {
                    return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
                });
                this.resolve(EVENT_GET_SYNTAX_ERRORS, errors, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_SYNTAX_ERRORS, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_SEMANTIC_ERRORS, (message: { data: { fileName: string; callbackId: number } }) => {
            const { fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_SEMANTIC_ERRORS}(${fileName})`);
                }
                const diagnostics = this.ensureLS().getSemanticDiagnostics(fileName);
                const errors = diagnostics.map(function (diagnostic: ts.Diagnostic) {
                    return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"), start: diagnostic.start, length: diagnostic.length };
                });
                this.resolve(EVENT_GET_SEMANTIC_ERRORS, errors, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_SEMANTIC_ERRORS, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_COMPLETIONS_AT_POSITION, (message: { data: { fileName: string; position: number; prefix: string; callbackId: number } }) => {
            const { fileName, position, prefix, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_COMPLETIONS_AT_POSITION}(${fileName}, ${position}, ${prefix})`);
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const completionInfo: ts.CompletionInfo = this.ensureLS().getCompletionsAtPosition(fileName, position);
                if (completionInfo) {
                    const completions: ts.CompletionEntry[] = completionInfo.entries;
                    this.resolve(EVENT_GET_COMPLETIONS_AT_POSITION, completions, callbackId);
                }
                else {
                    this.resolve(EVENT_GET_COMPLETIONS_AT_POSITION, [], callbackId);
                }
            }
            catch (reason) {
                this.reject(EVENT_GET_COMPLETIONS_AT_POSITION, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_QUICK_INFO_AT_POSITION, (message: { data: { fileName: string; position: number; callbackId: number } }) => {
            const { fileName, position, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_QUICK_INFO_AT_POSITION}(${fileName}, ${position})`);
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const quickInfo: ts.QuickInfo = this.ensureLS().getQuickInfoAtPosition(fileName, position);
                this.resolve(EVENT_GET_QUICK_INFO_AT_POSITION, quickInfo, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_QUICK_INFO_AT_POSITION, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_OUTPUT_FILES, (message: { data: { fileName: string; callbackId: number } }) => {
            const { fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_OUTPUT_FILES}(${fileName})`);
                }
                // For TypeScript 2.x we must get the source file indirectly.
                const sourceFile: ts.SourceFile = this.ensureLS().getProgram().getSourceFile(fileName);
                // const sourceFile: ts.SourceFile = this.ensureLS().getSourceFile(fileName)
                const input = sourceFile.text;
                const transpileOptions: ts.TranspileOptions = {};
                transpileOptions.compilerOptions = this.host_.getCompilationSettings();
                transpileOptions.fileName = fileName;    // What does this do, exactly?
                // We want named modules so that we can bundle in the Browser.
                // Maybe this could be an optional parameter in future?
                transpileOptions.moduleName = systemModuleName('./', fileName, 'js');
                transpileOptions.reportDiagnostics = false;
                const output: ts.TranspileOutput = ts.transpileModule(input, transpileOptions);
                const outputFiles: ts.OutputFile[] = [];
                outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 });
                // We're currently ignoring the source map.
                // outputFiles.push({ name: systemModuleName(void 0, fileName, 'js.map'), text: output.sourceMapText, writeByteOrderMark: void 0 })
                this.resolve(EVENT_GET_OUTPUT_FILES, outputFiles, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_OUTPUT_FILES, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, (message: { data: { fileName: string; settings: ts.FormatCodeSettings; callbackId: number } }) => {
            const { fileName, settings, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT}(${fileName}, ${settings})`);
                }
                if (typeof settings !== 'object') {
                    throw new Error("settings must be an object and not NaN");
                }
                const textChanges: ts.TextChange[] = this.ensureLS().getFormattingEditsForDocument(fileName, settings);
                this.resolve(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, textChanges, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_LINT_ERRORS, (message: { data: { fileName: string; callbackId: number } }) => {
            const { fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_LINT_ERRORS}(${fileName})`);
                }
                const linter = new Linter({ fix: false }, this.ensureLS());
                const configuration: IConfigurationFile = {};
                const rules: { [name: string]: boolean | RuleArgumentType[] } = {};
                rules['curly'] = true;
                rules['comment-format'] = [true, 'check-space'];
                rules['eofline'] = true;
                rules['forin'] = true;
                rules['jsdoc-format'] = true;
                rules['no-conditional-assignment'] = false;
                rules['no-for-in-array'] = true;
                rules['no-magic-numbers'] = false;
                rules['no-shadowed-variable'] = true;
                rules['no-trailing-whitespace'] = [true, 'ignore-jsdoc'];
                rules['no-var-keyword'] = true;
                rules['one-variable-per-declaration'] = [true, 'ignore-for-loop'];
                rules['prefer-const'] = true;
                rules['prefer-for-of'] = true;
                rules['prefer-function-over-method'] = true;
                rules['semicolon'] = [true];
                rules['trailing-comma'] = [true, { multiline: 'never', singleline: 'never' }];
                rules['triple-equals'] = true;
                configuration.rules = rules;
                linter.lint(fileName, configuration);
                const ruleFailures = linter.getRuleFailures();
                const errors: { message: string; start: number; length: number }[] = ruleFailures.map(function (ruleFailure) {
                    const start: number = ruleFailure.getStartPosition().getPosition();
                    const end: number = ruleFailure.getEndPosition().getPosition();
                    const length = end - start;
                    return { message: ruleFailure.getFailure(), start, length };
                });
                this.resolve(EVENT_GET_LINT_ERRORS, errors, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_LINT_ERRORS, reason, callbackId);
            }
        });

    }

    /**
     * Ensures a LanguageService is cached, until it is invalidated.
     */
    private ensureLS(): ts.LanguageService {
        if (!this.languageService_) {
            if (this.trace) {
                console.log(`LanguageServiceWorker.ensureLS()`);
                console.log("Calling createLanguageService()");
            }
            this.languageService_ = ts.createLanguageService(this.host_, this.documentRegistry_);
        }
        return this.languageService_;
    }

    /**
     * Disposes of the LanguageService.
     * This is needed when files change or compilation settings change.
     */
    public disposeLS(): void {
        if (this.languageService_) {
            if (this.trace) {
                console.log(`LanguageServiceWorker.disposeLS()`);
                console.log(`Calling LanguageService.dispose`);
            }
            this.languageService_.dispose();
            this.languageService_ = void 0;
        }
    }

    /**
     * Helper function for resolving a request.
     * Incorporates conditional tracing.
     */
    resolve(eventName: string, value: any, callbackId: number): void {
        if (this.trace) {
            console.log(`resolve(${eventName}, ${JSON.stringify(value, null, 2)})`);
        }
        this.sender.resolve(eventName, value, callbackId);
    }

    /**
     * Helper function for rejecting a request.
     * Incorporates conditional tracing.
     */
    reject(eventName: string, reason: any, callbackId: number): void {
        if (this.trace) {
            console.warn(`reject(${eventName}, ${reason})`);
        }
        this.sender.reject(eventName, reason, callbackId);
    }
}
