import { Delta } from 'editor-document';
import { DefaultLanguageServiceHost } from '../mode/typescript/DefaultLanguageServiceHost';
import { Diagnostic } from '../mode/typescript/LanguageServiceDispatcher';
import { IConfigurationFile } from '../mode/tslint/configuration';
import { LanguageServiceDispatcher } from '../mode/typescript/LanguageServiceDispatcher';
import { WorkerCallback } from "./WorkerCallback";
import { EVENT_APPLY_DELTA } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_DEFAULT_LIB_CONTENT } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_ENSURE_MODULE_MAPPING } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_GET_COMPLETIONS_AT_POSITION } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_GET_DEFINITION_AT_POSITION } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_GET_LINT_ERRORS } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_GET_OUTPUT_FILES } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_GET_QUICK_INFO_AT_POSITION } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_GET_SCRIPT_CONTENT } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_GET_SEMANTIC_ERRORS } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_GET_SYNTAX_ERRORS } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_REMOVE_MODULE_MAPPING } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_SET_MODULE_KIND } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_SET_OPERATOR_OVERLOADING } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_SET_SCRIPT_TARGET } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_SET_TRACE } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_SET_TS_CONFIG } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_SET_SCRIPT_CONTENT } from '../mode/typescript/LanguageServiceEvents';
import { EVENT_REMOVE_SCRIPT } from '../mode/typescript/LanguageServiceEvents';

import { EnsureModuleMappingRequest } from '../mode/typescript/LanguageServiceEvents';
import { GetDefinitionAtPositionRequest } from '../mode/typescript/LanguageServiceEvents';
import { GetOutputFilesRequest } from '../mode/typescript/LanguageServiceEvents';
import { GetScriptContentRequest } from '../mode/typescript/LanguageServiceEvents';
import { RemoveModuleMappingRequest } from '../mode/typescript/LanguageServiceEvents';
import { RemoveScriptRequest } from '../mode/typescript/LanguageServiceEvents';
import { SetOperatorOverloadingRequest } from '../mode/typescript/LanguageServiceEvents';
import { SetModuleKindRequest } from '../mode/typescript/LanguageServiceEvents';
import { SetTraceRequest } from '../mode/typescript/LanguageServiceEvents';
import { SetScriptContentRequest } from '../mode/typescript/LanguageServiceEvents';
import { SetScriptTargetRequest } from '../mode/typescript/LanguageServiceEvents';
import { SetTsConfigRequest } from '../mode/typescript/LanguageServiceEvents';
import { compilerOptionsFromTsConfig } from '../mode/typescript/LanguageServiceHelpers';
import { tsConfigFromCompilerOptions } from '../mode/typescript/LanguageServiceHelpers';

/// <reference path="../../../typings/typescriptServices.d.ts" />

/**
 * A worker for the TypeScript LanguageService.
 * The constructor is consistent with the WorkerClient - WorkerCallback architecture.
 */
export class LanguageServiceWorker {

    /**
     * Used to control tracing from the client side.
     * This is public for testing purposes.
     * Tracing is not enabled by default.
     */
    public trace = false;
    public traceB = false;

    /**
     * Dispatches requests to the appropriate Language Service based upon the file type.
     * Coordinates the synchronization of the various Language Services.
     * Contains the file contents and compiler options for all files.
     */
    private readonly dispatcher: LanguageServiceDispatcher;

    /**
     * Contains the file contents and compiler options for JavaScript files.
     */
    private readonly jsLSHost: DefaultLanguageServiceHost;
    /**
     * Contains the file contents and compiler options for Python files.
     */
    private readonly pyLSHost: DefaultLanguageServiceHost;
    /**
     * Contains the file contents and compiler options for TypeScript files.
     */
    private readonly tsLSHost: DefaultLanguageServiceHost;

    /**
     *
     */
    constructor(private sender: WorkerCallback) {

        this.jsLSHost = new DefaultLanguageServiceHost();
        this.pyLSHost = new DefaultLanguageServiceHost();
        this.tsLSHost = new DefaultLanguageServiceHost();

        this.dispatcher = new LanguageServiceDispatcher(this.jsLSHost, this.pyLSHost, this.tsLSHost);

        sender.on<SetTraceRequest>(EVENT_SET_TRACE, (message) => {
            const { trace, callbackId } = message.data;
            try {
                // Summarize the values.
                const newTrace = trace;
                const oldTrace = this.trace;
                // Make the updates.
                this.trace = newTrace;
                // Acknowledge using the previous value.
                this.resolve(EVENT_SET_TRACE, oldTrace, callbackId);
            }
            catch (err) {
                this.reject(EVENT_SET_TRACE, err, callbackId);
            }
        });

        sender.on(EVENT_DEFAULT_LIB_CONTENT, (message: { data: { content: string; callbackId: number } }) => {
            const { content, callbackId } = message.data;
            try {
                if (this.traceB) {
                    console.log(`${EVENT_DEFAULT_LIB_CONTENT}(${this.dispatcher.getDefaultLibFileName({})})`);
                }
                const added = this.dispatcher.setScriptContent(this.dispatcher.getDefaultLibFileName({}), content);
                this.resolve(EVENT_DEFAULT_LIB_CONTENT, added, callbackId);
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
                const previousFileName = this.dispatcher.ensureModuleMapping(moduleName, fileName);
                this.resolve(EVENT_ENSURE_MODULE_MAPPING, previousFileName, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_ENSURE_MODULE_MAPPING, reason, callbackId);
            }
        });

        sender.on<GetScriptContentRequest>(EVENT_GET_SCRIPT_CONTENT, (message) => {
            const { fileName, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_GET_SCRIPT_CONTENT}(${fileName})`);
                }
                const content = this.dispatcher.getScriptContent(fileName);
                this.resolve(EVENT_GET_SCRIPT_CONTENT, content, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_SCRIPT_CONTENT, reason, callbackId);
            }
        });

        sender.on<SetScriptContentRequest>(EVENT_SET_SCRIPT_CONTENT, (message) => {
            const { fileName, content, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_SET_SCRIPT_CONTENT}(${fileName})`);
                }
                const added = this.dispatcher.setScriptContent(fileName, content);
                this.resolve(EVENT_SET_SCRIPT_CONTENT, added, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_SET_SCRIPT_CONTENT, reason, callbackId);
            }
        });

        sender.on(EVENT_APPLY_DELTA, (message: { data: { fileName: string; delta: Delta, callbackId: number } }) => {
            const { fileName, delta, callbackId } = message.data;
            try {
                if (this.trace) {
                    console.log(`${EVENT_APPLY_DELTA}(${fileName}, ${JSON.stringify(delta)})`);
                }
                this.dispatcher.applyDelta(fileName, delta);
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
                const mappedFileName = this.dispatcher.removeModuleMapping(moduleName);
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
                const removed = this.dispatcher.removeScript(fileName);
                this.resolve(EVENT_REMOVE_SCRIPT, removed, callbackId);
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
                this.tsLSHost.moduleKind = moduleKind;
                this.resolve(EVENT_SET_MODULE_KIND, this.tsLSHost.moduleKind, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_SET_MODULE_KIND, reason, callbackId);
            }
        });

        sender.on<SetOperatorOverloadingRequest>(EVENT_SET_OPERATOR_OVERLOADING, (message) => {
            const { operatorOverloading, callbackId } = message.data;
            try {
                if (this.traceB) {
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
                this.tsLSHost.scriptTarget = scriptTarget;
                this.resolve(EVENT_SET_SCRIPT_TARGET, this.tsLSHost.scriptTarget, callbackId);
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
                    const operatorOverloading = this.dispatcher.isOperatorOverloadingEnabled();
                    const compilerOptions = compilerOptionsFromTsConfig(settings, operatorOverloading);
                    this.dispatcher.setCompilationSettings(compilerOptions);
                    const updatedSettings = tsConfigFromCompilerOptions(this.dispatcher.getCompilationSettings());
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
                if (this.traceB) {
                    console.log(`${EVENT_GET_SYNTAX_ERRORS}(${fileName})`);
                }
                const diagnostics = this.dispatcher.getSyntaxErrors(fileName);
                this.resolve<Diagnostic[]>(EVENT_GET_SYNTAX_ERRORS, diagnostics, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_SYNTAX_ERRORS, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_SEMANTIC_ERRORS, (message: { data: { fileName: string; callbackId: number } }) => {
            const { fileName, callbackId } = message.data;
            try {
                if (this.traceB) {
                    console.log(`${EVENT_GET_SEMANTIC_ERRORS}(${fileName})`);
                }
                const diagnostics = this.dispatcher.getSemanticErrors(fileName);
                this.resolve<Diagnostic[]>(EVENT_GET_SEMANTIC_ERRORS, diagnostics, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_SEMANTIC_ERRORS, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_COMPLETIONS_AT_POSITION, (message: { data: { fileName: string; position: number; prefix: string; callbackId: number } }) => {
            const { fileName, position, prefix, callbackId } = message.data;
            try {
                if (this.traceB) {
                    console.log(`${EVENT_GET_COMPLETIONS_AT_POSITION}(${fileName}, ${position}, ${prefix})`);
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const completions = this.dispatcher.getCompletionsAtPosition(fileName, position);
                this.resolve<ts.CompletionEntry[]>(EVENT_GET_COMPLETIONS_AT_POSITION, completions, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_COMPLETIONS_AT_POSITION, reason, callbackId);
            }
        });

        sender.on<GetDefinitionAtPositionRequest>(EVENT_GET_DEFINITION_AT_POSITION, (message) => {
            const { fileName, position, callbackId } = message.data;
            try {
                if (this.traceB) {
                    console.log(`${EVENT_GET_DEFINITION_AT_POSITION}(${fileName}, ${position})`);
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const definitionInfo = this.dispatcher.getDefinitionAtPosition(fileName, position);
                this.resolve<ts.DefinitionInfo[]>(EVENT_GET_DEFINITION_AT_POSITION, definitionInfo, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_DEFINITION_AT_POSITION, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_QUICK_INFO_AT_POSITION, (message: { data: { fileName: string; position: number; callbackId: number } }) => {
            const { fileName, position, callbackId } = message.data;
            try {
                if (this.traceB) {
                    console.log(`${EVENT_GET_QUICK_INFO_AT_POSITION}(${fileName}, ${position})`);
                }
                if (typeof position !== 'number' || isNaN(position)) {
                    throw new Error("position must be a number and not NaN");
                }
                const quickInfo: ts.QuickInfo = this.dispatcher.getQuickInfoAtPosition(fileName, position);
                this.resolve<ts.QuickInfo>(EVENT_GET_QUICK_INFO_AT_POSITION, quickInfo, callbackId);
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
                const outputFiles = this.dispatcher.getOutputFiles(fileName);
                this.resolve<ts.OutputFile[]>(EVENT_GET_OUTPUT_FILES, outputFiles, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_OUTPUT_FILES, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, (message: { data: { fileName: string; settings: ts.FormatCodeSettings; callbackId: number } }) => {
            const { fileName, settings, callbackId } = message.data;
            try {
                if (this.traceB) {
                    console.log(`${EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT}(${fileName}, ${settings})`);
                }
                if (typeof settings !== 'object') {
                    throw new Error("settings must be an object and not NaN");
                }
                const textChanges = this.dispatcher.getFormattingEditsForDocument(fileName, settings);
                this.resolve<ts.TextChange[]>(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, textChanges, callbackId);
            }
            catch (reason) {
                this.reject(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, reason, callbackId);
            }
        });

        sender.on(EVENT_GET_LINT_ERRORS, (message: { data: { fileName: string; configuration: IConfigurationFile, callbackId: number } }) => {
            const { fileName, configuration, callbackId } = message.data;
            try {
                if (this.traceB) {
                    console.log(`${EVENT_GET_LINT_ERRORS}(${fileName})`);
                    console.log(`${EVENT_GET_LINT_ERRORS}(${JSON.stringify(configuration, null, 2)})`);
                }
                const diagnostics = this.dispatcher.getLintErrors(fileName, configuration);
                this.resolve<Diagnostic[]>(EVENT_GET_LINT_ERRORS, diagnostics, callbackId);
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
        return this.dispatcher.isOperatorOverloadingEnabled();
    }

    /**
     * Disposes of the Language Service if the operator overloading compiler option changes,
     * forcing it to be lazily created again when required.
     * Returns the previous value of the option.
     */
    setOperatorOverloading(operatorOverloading: boolean): boolean {
        return this.dispatcher.setOperatorOverloading(operatorOverloading);
    }

    /**
     * Helper function for resolving a request.
     * Incorporates conditional tracing.
     */
    resolve<T>(eventName: string, value: T, callbackId: number): void {
        if (this.trace) {
            if (eventName !== EVENT_SET_TRACE) {
                console.log(`resolve(${eventName}, ${JSON.stringify(value, null, 2)})`);
            }
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
