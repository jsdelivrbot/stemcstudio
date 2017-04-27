import Delta from '../Delta';
import { DefaultLanguageServiceHost } from './typescript/DefaultLanguageServiceHost';
import DocumentRegistryInspector from './typescript/DocumentRegistryInspector';
import { IConfigurationFile } from './typescript/tslint/configuration';
import Linter from './typescript/tslint/linter';
import { RuleFailure } from './typescript/tslint/language/rule/rule';
import transpileModule from './transpileModule';
import WorkerCallback from "../WorkerCallback";
import { EVENT_APPLY_DELTA } from './LanguageServiceEvents';
import { EVENT_DEFAULT_LIB_CONTENT } from './LanguageServiceEvents';
import { EVENT_ENSURE_MODULE_MAPPING } from './LanguageServiceEvents';
import { EVENT_ENSURE_SCRIPT } from './LanguageServiceEvents';
import { EVENT_GET_COMPLETIONS_AT_POSITION } from './LanguageServiceEvents';
import { EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT } from './LanguageServiceEvents';
import { EVENT_GET_LINT_ERRORS } from './LanguageServiceEvents';
import { EVENT_GET_OUTPUT_FILES } from './LanguageServiceEvents';
import { EVENT_GET_QUICK_INFO_AT_POSITION } from './LanguageServiceEvents';
import { EVENT_GET_SEMANTIC_ERRORS } from './LanguageServiceEvents';
import { EVENT_GET_SYNTAX_ERRORS } from './LanguageServiceEvents';
import { EVENT_REMOVE_MODULE_MAPPING } from './LanguageServiceEvents';
import { EVENT_REMOVE_SCRIPT } from './LanguageServiceEvents';
import { EVENT_SET_MODULE_KIND } from './LanguageServiceEvents';
import { EVENT_SET_OPERATOR_OVERLOADING } from './LanguageServiceEvents';
import { EVENT_SET_SCRIPT_TARGET } from './LanguageServiceEvents';
import { EVENT_SET_TRACE } from './LanguageServiceEvents';
import { EVENT_SET_TS_CONFIG } from './LanguageServiceEvents';

import { EnsureModuleMappingRequest } from './LanguageServiceEvents';
import { EnsureScriptRequest } from './LanguageServiceEvents';
import { GetOutputFilesRequest } from './LanguageServiceEvents';
import { RemoveModuleMappingRequest } from './LanguageServiceEvents';
import { RemoveScriptRequest } from './LanguageServiceEvents';
import { SetOperatorOverloadingRequest } from './LanguageServiceEvents';
import { SetModuleKindRequest } from './LanguageServiceEvents';
import { SetTraceRequest } from './LanguageServiceEvents';
import { SetScriptTargetRequest } from './LanguageServiceEvents';
import { SetTsConfigRequest } from './LanguageServiceEvents';
import { changedCompilerSettings, compilerOptionsFromTsConfig } from './LanguageServiceHelpers';
import { tsConfigFromCompilerOptions } from './LanguageServiceHelpers';

/**
 *
 */
const useCaseSensitiveFileNames = true;

/**
 * systemModuleName(void 0, 'Foo.ts', 'js'))   => Foo.js
 * systemModuleName('./',   'Foo.ts', 'js'))   => ./Foo.js
 * systemModuleName(void 0, 'Foo.ts', 'd.ts')) => Foo.d.ts
 */
function systemModuleName(prefix: string, fileName: string, extension: string): string {
    const lastPeriod = fileName.lastIndexOf('.');
    if (lastPeriod >= 0) {
        const name = fileName.substring(0, lastPeriod);
        // const suffix = fileName.substring(lastPeriod + 1);
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

enum DiagnosticCategory {
    Warning = 0,
    Error = 1,
    Message = 2
}

/**
 * The structure expected by the editor for a diagnostic.
 * This differs from the TypeScript structure in several respects.
 * 1) It does not contain the file.
 * 2) messageText has been flattened to message.
 * 3) code supports numeric for TypeScript and string for TsLint.
 */
interface Diagnostic {
    message: string;
    start: number;
    length: number;
    category: DiagnosticCategory;
    code: number | string;
}

/**
 * Maps the TypeScript Diagnostic object to that expected by the editor.
 */
function tsDiagnosticToEditorDiagnostic(diagnostic: ts.Diagnostic): Diagnostic {
    return {
        message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
        start: diagnostic.start,
        length: diagnostic.length,
        category: diagnostic.category,
        code: diagnostic.code
    };
}

function ruleFailureToEditorDiagnostic(ruleFailure: RuleFailure): Diagnostic {
    const start: number = ruleFailure.getStartPosition().getPosition();
    const end: number = ruleFailure.getEndPosition().getPosition();
    const length = end - start;
    const ruleName = ruleFailure.getRuleName();
    return {
        message: ruleFailure.getFailure(),
        start,
        length,
        category: DiagnosticCategory.Warning,
        code: ruleName
    };
}

/**
 * A worker for the TypeScript LanguageService.
 * The constructor is consistent with the WorkerClient - WorkerCallback architecture.
 */
export default class LanguageServiceWorker {

    /**
     * Used to control tracing from the client side.
     * This is public for testing purposes.
     */
    public trace = false;

    /**
     * The host contains the file contents and compiler options.
     */
    private readonly lsHost: DefaultLanguageServiceHost;

    /**
     * The language service answers the tough queries.
     * It is created lazily.
     */
    private languageService: ts.LanguageService;

    /**
     * The document registry is the same for the lifetime of the application and shared across language services.
     * Entries in the document registry have a count of the number of services using them.
     */
    private readonly documentRegistry_: DocumentRegistryInspector;

    /**
     *
     */
    constructor(private sender: WorkerCallback) {

        this.lsHost = new DefaultLanguageServiceHost();

        this.documentRegistry_ = new DocumentRegistryInspector(ts.createDocumentRegistry(useCaseSensitiveFileNames));

        sender.on<SetTraceRequest>(EVENT_SET_TRACE, (message) => {
            const { trace, callbackId } = message.data;
            try {
                this.trace = trace;
                this.documentRegistry_.trace = trace;
                if (this.trace) {
                    console.log(`${EVENT_SET_TRACE}(${trace})`);
                }
                this.resolve(EVENT_SET_TRACE, this.trace, callbackId);
            }
            catch (err) {
                this.reject(EVENT_SET_TRACE, err, callbackId);
            }
        });

        sender.on(EVENT_DEFAULT_LIB_CONTENT, (message: { data: { content: string; callbackId: number } }) => {
            const { content, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_DEFAULT_LIB_CONTENT}(${this.lsHost.getDefaultLibFileName({})})`);
                }
                this.lsHost.ensureScript(this.lsHost.getDefaultLibFileName({}), content);
                this.resolve(EVENT_DEFAULT_LIB_CONTENT, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_DEFAULT_LIB_CONTENT, reason, callbackId);
            }
        });

        sender.on<EnsureModuleMappingRequest>(EVENT_ENSURE_MODULE_MAPPING, (message) => {
            const { moduleName, fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_ENSURE_MODULE_MAPPING}(${moduleName}=>${fileName})`);
                }
                const previousFileName = this.lsHost.ensureModuleMapping(moduleName, fileName);
                this.resolve(EVENT_ENSURE_MODULE_MAPPING, previousFileName, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_ENSURE_MODULE_MAPPING, reason, callbackId);
            }
        });

        sender.on<EnsureScriptRequest>(EVENT_ENSURE_SCRIPT, (message) => {
            const { fileName, content, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_ENSURE_SCRIPT}(${fileName})`);
                }
                this.lsHost.ensureScript(fileName, content);
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
                    console.log(`${EVENT_APPLY_DELTA}(${fileName}, ${JSON.stringify(delta)})`);
                }
                this.lsHost.applyDelta(fileName, delta);
                this.resolve(EVENT_APPLY_DELTA, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_APPLY_DELTA, reason, callbackId);
            }
        });

        sender.on<RemoveModuleMappingRequest>(EVENT_REMOVE_MODULE_MAPPING, (message) => {
            const { moduleName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_REMOVE_MODULE_MAPPING}(${moduleName})`);
                }
                const mappedFileName = this.lsHost.removeModuleMapping(moduleName);
                this.resolve(EVENT_REMOVE_MODULE_MAPPING, mappedFileName, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_REMOVE_MODULE_MAPPING, reason, callbackId);
            }
        });

        sender.on<RemoveScriptRequest>(EVENT_REMOVE_SCRIPT, (message) => {
            const { fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_REMOVE_SCRIPT}(${fileName})`);
                }
                this.lsHost.removeScript(fileName);
                this.resolve(EVENT_REMOVE_SCRIPT, void 0, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_REMOVE_SCRIPT, reason, callbackId);
            }
        });

        sender.on<SetModuleKindRequest>(EVENT_SET_MODULE_KIND, (message) => {
            const { moduleKind, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_SET_MODULE_KIND}(${moduleKind})`);
                }
                this.lsHost.moduleKind = moduleKind;
                this.resolve(EVENT_SET_MODULE_KIND, this.lsHost.moduleKind, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_SET_MODULE_KIND, reason, callbackId);
            }
        });

        sender.on<SetOperatorOverloadingRequest>(EVENT_SET_OPERATOR_OVERLOADING, (message) => {
            const { operatorOverloading, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_SET_OPERATOR_OVERLOADING}(${operatorOverloading})`);
                }
                const oldValue = this.setOperatorOverloading(operatorOverloading);
                this.resolve(EVENT_SET_OPERATOR_OVERLOADING, oldValue, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_SET_OPERATOR_OVERLOADING, reason, callbackId);
            }
        });

        sender.on<SetScriptTargetRequest>(EVENT_SET_SCRIPT_TARGET, (message) => {
            const { scriptTarget, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_SET_SCRIPT_TARGET}(${scriptTarget})`);
                }
                this.lsHost.scriptTarget = scriptTarget;
                this.resolve(EVENT_SET_SCRIPT_TARGET, this.lsHost.scriptTarget, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_SET_SCRIPT_TARGET, reason, callbackId);
            }
        });

        sender.on<SetTsConfigRequest>(EVENT_SET_TS_CONFIG, (message) => {
            const { settings, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_SET_TS_CONFIG}(${JSON.stringify(settings)})`);
                }
                try {
                    // Be careful to make sure that the operator overloading option is not changed.
                    const operatorOverloading = this.lsHost.isOperatorOverloadingEnabled();
                    const compilerOptions = compilerOptionsFromTsConfig(settings, operatorOverloading);
                    this.setCompilationSettings(compilerOptions);
                    const updatedSettings = tsConfigFromCompilerOptions(this.lsHost.getCompilationSettings());
                    this.resolve(EVENT_SET_TS_CONFIG, updatedSettings, callbackId);
                }
                catch (e) {
                    this.reject(EVENT_SET_TS_CONFIG, e, callbackId);
                }
            }
            catch (reason) {
                this.reject(EVENT_SET_TS_CONFIG, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_SYNTAX_ERRORS, (message: { data: { fileName: string; callbackId: number } }) => {
            const { fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_SYNTAX_ERRORS}(${fileName})`);
                }
                const diagnostics = this.ensureLS().getSyntacticDiagnostics(fileName);
                const errors = diagnostics.map(tsDiagnosticToEditorDiagnostic);
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
                const errors = diagnostics.map(tsDiagnosticToEditorDiagnostic);
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

        sender.on<GetOutputFilesRequest>(EVENT_GET_OUTPUT_FILES, (message) => {
            // TODO: Should moduleName be a parameter?
            const { fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_OUTPUT_FILES}(${fileName})`);
                }
                const languageService = this.ensureLS();
                const program = languageService.getProgram();
                const sourceFile: ts.SourceFile = program.getSourceFile(fileName);
                // We want named modules so that we can bundle in the Browser.
                sourceFile.moduleName = systemModuleName('./', fileName, 'js');
                // We implement our own transpileModule in order to use the custom transformers.
                const output: ts.TranspileOutput = transpileModule(program, sourceFile, this.lsHost.getCustomTransformers());
                const outputFiles: ts.OutputFile[] = [];
                if (output.outputText) {
                    outputFiles.push({ name: systemModuleName(void 0, fileName, 'js'), text: output.outputText, writeByteOrderMark: void 0 });
                }
                if (output.sourceMapText) {
                    outputFiles.push({ name: systemModuleName(void 0, fileName, 'js.map'), text: output.sourceMapText, writeByteOrderMark: void 0 });
                }
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

        sender.on(EVENT_GET_LINT_ERRORS, (message: { data: { fileName: string; configuration: IConfigurationFile, callbackId: number } }) => {
            const { fileName, configuration, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_LINT_ERRORS}(${fileName})`);
                    console.log(`${EVENT_GET_LINT_ERRORS}(${JSON.stringify(configuration, null, 2)})`);
                }
                const linter = new Linter({ fix: false }, this.ensureLS());
                linter.lint(fileName, configuration);
                const ruleFailures = linter.getRuleFailures();
                const diagnostics: Diagnostic[] = ruleFailures.map(ruleFailureToEditorDiagnostic);
                this.resolve(EVENT_GET_LINT_ERRORS, diagnostics, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_LINT_ERRORS, reason, callbackId);
            }
        });
    }

    /**
     * This method is provided to support testing.
     */
    isOperatorOverloadingEnabled(): boolean {
        return this.lsHost.isOperatorOverloadingEnabled();
    }

    /**
     * Disposes of the Language Service if the operator overloading compiler option changes,
     * forcing it to be lazily created again when required.
     * Returns the previous value of the option.
     */
    setOperatorOverloading(operatorOverloading: boolean): boolean {
        const oldValue = this.lsHost.isOperatorOverloadingEnabled();
        if (oldValue !== operatorOverloading) {
            // This effectively drops the program, forcing it to be recreated when needed.
            if (this.languageService) {
                this.languageService.cleanupSemanticCache();
            }
            return this.lsHost.setOperatorOverloading(operatorOverloading);
        }
        else {
            return oldValue;
        }
    }

    setCompilationSettings(settings: ts.CompilerOptions): void {
        const oldSettings = this.lsHost.getCompilationSettings();
        this.lsHost.setCompilationSettings(settings);
        const newSettings = this.lsHost.getCompilationSettings();
        if (changedCompilerSettings(oldSettings, newSettings)) {
            if (this.languageService) {
                this.languageService.cleanupSemanticCache();
            }
        }
    }

    /**
     * Ensures a LanguageService is cached, until it is invalidated.
     */
    private ensureLS(): ts.LanguageService {
        if (!this.languageService) {
            if (this.trace) {
                console.log(`LanguageServiceWorker.ensureLS()`);
                console.log("Calling createLanguageService()");
            }
            this.languageService = ts.createLanguageService(this.lsHost, this.documentRegistry_);
        }
        return this.languageService;
    }

    /**
     * Disposes of the LanguageService.
     * This is needed when files change or compilation settings change.
     */
    /*
    private disposeLS(): void {
        if (this.languageService) {
            if (this.trace) {
                console.log(`LanguageServiceWorker.disposeLS()`);
                console.log(`Calling LanguageService.dispose`);
            }
            // signal language service to release source files acquired from document registry.
            // this.languageService.
            this.languageService.dispose();
            this.languageService = void 0;
        }
    }
    */

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
