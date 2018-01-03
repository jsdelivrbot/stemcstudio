import { CompletionEntry } from './CompletionEntry';
import { DefinitionInfo } from './DefinitionInfo';
import { Delta } from 'editor-document';
import { Diagnostic } from './Diagnostic';
import { FormatCodeSettings } from './FormatCodeSettings';
import { TextChange } from './TextChange';
import { RuleFailure } from './RuleFailure';
import { QuickInfo } from './QuickInfo';
import { WorkerClient } from '../worker/WorkerClient';
import { TsLintSettings } from './TsLintSettings';
import { EVENT_APPLY_DELTA } from './LanguageServiceEvents';
import { EVENT_DEFAULT_LIB_CONTENT } from './LanguageServiceEvents';
import { EVENT_ENSURE_MODULE_MAPPING } from './LanguageServiceEvents';
import { EVENT_GET_LINT_ERRORS } from './LanguageServiceEvents';
import { EVENT_GET_SCRIPT_CONTENT } from './LanguageServiceEvents';
import { EVENT_GET_SYNTAX_ERRORS } from './LanguageServiceEvents';
import { EVENT_GET_SEMANTIC_ERRORS } from './LanguageServiceEvents';
import { EVENT_GET_COMPLETIONS_AT_POSITION } from './LanguageServiceEvents';
import { EVENT_GET_DEFINITION_AT_POSITION } from './LanguageServiceEvents';
import { EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT } from './LanguageServiceEvents';
import { EVENT_GET_QUICK_INFO_AT_POSITION } from './LanguageServiceEvents';
import { EVENT_GET_OUTPUT_FILES } from './LanguageServiceEvents';
import { EVENT_REMOVE_MODULE_MAPPING } from './LanguageServiceEvents';
import { EVENT_REMOVE_SCRIPT } from './LanguageServiceEvents';
import { EVENT_SET_OPERATOR_OVERLOADING } from './LanguageServiceEvents';
import { EVENT_SET_SCRIPT_CONTENT } from './LanguageServiceEvents';
import { EVENT_SET_TRACE } from './LanguageServiceEvents';
import { EVENT_SET_TS_CONFIG } from './LanguageServiceEvents';
import { EnsureModuleMappingRequest, RemoveModuleMappingRequest } from './LanguageServiceEvents';
import { GetScriptContentRequest, SetScriptContentRequest, RemoveScriptRequest } from './LanguageServiceEvents';
import { GetDefinitionAtPositionRequest } from './LanguageServiceEvents';
import { GetOutputFilesRequest } from './LanguageServiceEvents';
import { GetOutputFilesResponse } from './LanguageServiceEvents';
import { SetOperatorOverloadingRequest } from './LanguageServiceEvents';
import { SetTraceRequest } from './LanguageServiceEvents';
import { SetTsConfigRequest, TsConfigSettings } from './LanguageServiceEvents';

interface WorkerClientData<T> {
    err?: any;
    value?: T;
    callbackId: number;
}

interface RequestMessage<T> {
    data: T;
}

function missingCallbackMessage(eventName: string): string {
    return ``;
}

/**
 * Lowercase string constants corresponding to the Language Service ScriptTarget enumeration.
 */
export type ScriptTarget = 'es2015' | 'es2016' | 'es2017' | 'es3' | 'es5' | 'esnext' | 'latest';

type CallbackFunction = (err: any, results?: any) => void;

interface CallbackEntry {
    callback: CallbackFunction;
    description: string;
    time: number;
}

/**
 * This class is consumed by the WsModel.
 */
export class LanguageServiceProxy {

    /**
     *
     */
    private readonly worker: WorkerClient;

    /**
     *
     */
    private readonly callbacks: { [id: number]: CallbackEntry } = {};

    /**
     * The identifier for the next callback.
     */
    private callbackId = 1;

    /**
     * Creates the underlying WorkerClient and establishes listeners.
     * This method DOES NOT start the thread.
     *
     * workerUrl is the URL of the JavaScript file for the worker.
     */
    constructor(workerUrl: string) {

        this.worker = new WorkerClient(workerUrl);

        this.worker.on(EVENT_APPLY_DELTA, (response: { data: WorkerClientData<number> }) => {
            // The value is the version number of the document after the delta has been applied.
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_APPLY_DELTA));
            }
        });

        this.worker.on(EVENT_DEFAULT_LIB_CONTENT, (response: { data: WorkerClientData<any> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_DEFAULT_LIB_CONTENT));
            }
        });

        this.worker.on(EVENT_GET_SCRIPT_CONTENT, (response: { data: WorkerClientData<string> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_GET_SCRIPT_CONTENT));
            }
        });

        this.worker.on(EVENT_SET_SCRIPT_CONTENT, (response: { data: WorkerClientData<boolean> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_SET_SCRIPT_CONTENT));
            }
        });

        this.worker.on(EVENT_ENSURE_MODULE_MAPPING, (response: { data: WorkerClientData<string | undefined> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_ENSURE_MODULE_MAPPING));
            }
        });

        this.worker.on(EVENT_REMOVE_MODULE_MAPPING, (response: { data: WorkerClientData<string | undefined> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_REMOVE_MODULE_MAPPING));
            }
        });

        this.worker.on(EVENT_REMOVE_SCRIPT, (response: { data: WorkerClientData<boolean> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                if (!err) {
                    if (typeof value === 'boolean') {
                        callback(err, value);
                    }
                    else {
                        // Worker thread not abiding by contract.
                        console.warn(`${EVENT_REMOVE_SCRIPT} returned ${value} with type ${typeof value}.`);
                        callback(err, true);
                    }
                }
                else {
                    callback(err);
                }
            }
            else {
                console.warn(missingCallbackMessage(EVENT_REMOVE_SCRIPT));
            }
        });

        this.worker.on(EVENT_GET_LINT_ERRORS, (response: { data: WorkerClientData<RuleFailure[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_GET_LINT_ERRORS));
            }
        });

        this.worker.on(EVENT_GET_SYNTAX_ERRORS, (response: { data: WorkerClientData<Diagnostic[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_GET_SYNTAX_ERRORS));
            }
        });

        this.worker.on(EVENT_GET_SEMANTIC_ERRORS, (response: { data: WorkerClientData<Diagnostic[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_GET_SEMANTIC_ERRORS));
            }
        });

        this.worker.on(EVENT_GET_COMPLETIONS_AT_POSITION, (response: { data: WorkerClientData<CompletionEntry[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_GET_COMPLETIONS_AT_POSITION));
            }
        });

        this.worker.on(EVENT_GET_DEFINITION_AT_POSITION, (response: { data: WorkerClientData<DefinitionInfo<number>[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_GET_DEFINITION_AT_POSITION));
            }
        });

        this.worker.on(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, (response: { data: WorkerClientData<TextChange<number>[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT));
            }
        });

        this.worker.on(EVENT_GET_QUICK_INFO_AT_POSITION, (response: { data: WorkerClientData<QuickInfo> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_GET_QUICK_INFO_AT_POSITION));
            }
        });

        this.worker.on(EVENT_GET_OUTPUT_FILES, (response: { data: WorkerClientData<GetOutputFilesResponse> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_GET_OUTPUT_FILES));
            }
        });

        this.worker.on(EVENT_SET_OPERATOR_OVERLOADING, (response: { data: WorkerClientData<boolean> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_SET_OPERATOR_OVERLOADING));
            }
        });

        this.worker.on(EVENT_SET_TRACE, (response: { data: WorkerClientData<boolean> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_SET_TRACE));
            }
        });

        this.worker.on(EVENT_SET_TS_CONFIG, (response: { data: WorkerClientData<TsConfigSettings> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
            else {
                console.warn(missingCallbackMessage(EVENT_SET_TS_CONFIG));
            }
        });
    }

    /**
     * 
     * @param scriptImports 
     * @param moduleName The name of the JavaScript module. e.g. 'stemcstudio-workspace.js'.
     * @param className The name of the worker class. e.g. 'LanguageServiceWorker'. 
     * @param callback 
     */
    initialize(scriptImports: string[], moduleName: string, className: string, callback: (err: any) => any): void {
        this.worker.init(scriptImports, moduleName, className, function (err: any) {
            if (err) {
                console.warn(`worker.init() failed ${err}`);
            }
            callback(err);
        });
    }

    /**
     * Calls the terminate method of the underlying worker thread.
     */
    terminate(): void {
        this.worker.dispose();
    }

    setDefaultLibContent(content: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            function callback(err: any) {
                if (!err) {
                    resolve();
                }
                else {
                    reject();
                }
            }
            const callbackId = this.captureCallback("setDefaultLibContent", callback);
            const message = { data: { content, callbackId } };
            this.worker.emit(EVENT_DEFAULT_LIB_CONTENT, message);
        });
    }

    /**
     * Exchanges the callback function for a numeric token.
     * This token is posted to the worker thread along with the request.
     * When the response arrives, the token is used to find the original callback function.
     */
    private captureCallback(description: string, callback: CallbackFunction): number {
        if (callback) {
            const callbackId = this.callbackId++;
            this.callbacks[callbackId] = { callback, description, time: Date.now() };
            return callbackId;
        }
        else {
            throw new Error("callback must be supplied.");
        }
    }

    private releaseCallback(callbackId: number): CallbackFunction | undefined {
        if (typeof callbackId === 'number') {
            const entry = this.callbacks[callbackId];
            delete this.callbacks[callbackId];
            // console.lg(`${entry.description} took ${Date.now() - entry.time} ms`);
            return entry.callback;
        }
        else {
            return void 0;
        }
    }

    /**
     * Applies a Delta to the specified file.
     */
    applyDelta(fileName: string, delta: Delta, callback: (err: any, version: number) => void): void {
        // console.lg(`applyDelta(fileName = ${fileName})`);
        const callbackId = this.captureCallback(`applyDelta(${fileName}, ${delta.action}, ${delta.lines.join('\n')})`, callback);
        const message = { data: { fileName, delta, callbackId } };
        this.worker.emit(EVENT_APPLY_DELTA, message);
    }

    /**
     * Ensures that a mapping exists from moduleName to fileName.
     * The promise returns any previous mapping value.
     * This may be a fileName but normally will be undefined.
     */
    ensureModuleMapping(moduleName: string, fileName: string): Promise<string | undefined> {
        // console.lg(`ensureModuleMapping(moduleName = ${moduleName}, fileName = ${fileName})`);
        return new Promise<string | undefined>((resolve, reject) => {
            const callback = function (err: any, previousFileName: string | undefined) {
                if (!err) {
                    resolve(previousFileName);
                }
                else {
                    reject(err);
                }
            };
            const callbackId = this.captureCallback(`ensureModuleMapping(${moduleName})`, callback);
            const message: { data: EnsureModuleMappingRequest } = { data: { moduleName, fileName, callbackId } };
            this.worker.emit(EVENT_ENSURE_MODULE_MAPPING, message);
        });
    }

    /**
     * Removes a mapping from moduleName.
     * The promise returns any previous mapped value.
     * This will normally be a fileName but may be undefined.
     */
    removeModuleMapping(moduleName: string): Promise<string | undefined> {
        return new Promise<string | undefined>((resolve, reject) => {
            const callback = function (err: any, previousFileName: string | undefined) {
                if (!err) {
                    resolve(previousFileName);
                }
                else {
                    reject(err);
                }
            };
            const callbackId = this.captureCallback(`removeModuleMapping(${moduleName})`, callback);
            const message: { data: RemoveModuleMappingRequest } = { data: { moduleName, callbackId } };
            this.worker.emit(EVENT_REMOVE_MODULE_MAPPING, message);
        });
    }

    getScriptContent(fileName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            function callback(err: any, content?: string) {
                if (!err) {
                    resolve(content);
                }
                else {
                    reject(err);
                }
            }
            const callbackId = this.captureCallback(`getScriptContent(${fileName})`, callback);
            const message: { data: GetScriptContentRequest } = { data: { fileName, callbackId } };
            this.worker.emit(EVENT_GET_SCRIPT_CONTENT, message);
        });
    }

    /**
     * Ensures that there is a mapping from the path to the script content.
     * The return boolean promise indicates whether there was an addition (true) or update (false).
     */
    setScriptContent(fileName: string, content: string): Promise<boolean> {
        // console.lg(`setScriptContent(fileName = ${fileName})`);
        return new Promise<boolean>((resolve, reject) => {
            function callback(err: any, added?: boolean) {
                if (!err) {
                    resolve(added);
                }
                else {
                    reject(err);
                }
            }
            const callbackId = this.captureCallback(`setScriptContent(${fileName})`, callback);
            const message: { data: SetScriptContentRequest } = { data: { fileName, content, callbackId } };
            this.worker.emit(EVENT_SET_SCRIPT_CONTENT, message);
        });
    }

    /**
     * Removes the mapping from the path to a script.
     * The returned promise indicates whether a removal happened (true) or path missing (false).
     */
    removeScript(fileName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const callback = function (err: any, removed?: boolean) {
                if (!err) {
                    resolve(removed);
                }
                else {
                    reject(err);
                }
            };
            const callbackId = this.captureCallback(`removeScript(${fileName})`, callback);
            const message: { data: RemoveScriptRequest } = { data: { fileName, callbackId } };
            this.worker.emit(EVENT_REMOVE_SCRIPT, message);
        });
    }

    /**
     * Sets the Language Service operator overloading property.
     * The previous value is returned in the Promise.
     */
    public setOperatorOverloading(operatorOverloading: boolean): Promise<boolean> {
        // console.lg(`setOperatorOverloading(operatorOverloading = ${operatorOverloading})`);
        return new Promise<boolean>((resolve, reject) => {
            function callback(err: any, oldValue: boolean) {
                if (!err) {
                    // console.warn(`LanguageServiceProxy.setOperatorOverloading(${operatorOverloading}) oldValue => ${JSON.stringify(oldValue)}`);
                    resolve(oldValue);
                }
                else {
                    reject(err);
                }
            }
            try {
                const callbackId = this.captureCallback("setOperatorOverloading", callback);
                const message: { data: SetOperatorOverloadingRequest } = { data: { operatorOverloading, callbackId } };
                this.worker.emit(EVENT_SET_OPERATOR_OVERLOADING, message);
            }
            catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Sets the trace flag in the worker thread.
     * Returns the previous setting of the trace flag.
     */
    public setTrace(trace: boolean): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            function callback(err: any, oldValue: boolean) {
                if (!err) {
                    resolve(oldValue);
                }
                else {
                    reject(err);
                }
            }
            const callbackId = this.captureCallback("setTrace", callback);
            const message: RequestMessage<SetTraceRequest> = { data: { trace, callbackId } };
            this.worker.emit(EVENT_SET_TRACE, message);
        });
    }

    public setTsConfig(settings: TsConfigSettings): Promise<TsConfigSettings> {
        // console.lg(`setTsConfig(settings = ${JSON.stringify(settings)})`);
        return new Promise<TsConfigSettings>((resolve, reject) => {
            function callback(err: any, settings: TsConfigSettings) {
                if (!err) {
                    resolve(settings);
                }
                else {
                    reject(err);
                }
            }
            const callbackId = this.captureCallback("setTsConfig", callback);
            const message: RequestMessage<SetTsConfigRequest> = { data: { settings, callbackId } };
            this.worker.emit(EVENT_SET_TS_CONFIG, message);
        });
    }

    public getLintErrors(fileName: string, configuration: TsLintSettings, callback: (err: any, results: Diagnostic[]) => void): void {
        const callbackId = this.captureCallback(`getLintErrors(${fileName})`, callback);
        const message = { data: { fileName, configuration, callbackId } };
        this.worker.emit(EVENT_GET_LINT_ERRORS, message);
    }

    public getSyntaxErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        // console.lg(`getSyntaxErrors(fileName = ${fileName})`);
        const callbackId = this.captureCallback(`getSyntaxErrors(${fileName})`, callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_SYNTAX_ERRORS, message);
    }

    public getSemanticErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        // console.lg(`getSemanticErrors(fileName = ${fileName})`);
        const callbackId = this.captureCallback(`getSemanticErrors(${fileName})`, callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_SEMANTIC_ERRORS, message);
    }

    private _getCompletionsAtPosition(fileName: string, position: number, prefix: string, callback: (err: any, completions: CompletionEntry[]) => void): void {
        const callbackId = this.captureCallback(`getCompletionsAtPosition(${fileName})`, callback);
        const message = { data: { fileName, position, prefix, callbackId } };
        this.worker.emit(EVENT_GET_COMPLETIONS_AT_POSITION, message);
    }

    getCompletionsAtPosition(fileName: string, position: number, prefix: string): Promise<CompletionEntry[]> {
        return new Promise<CompletionEntry[]>((resolve, reject) => {
            this._getCompletionsAtPosition(fileName, position, prefix, function (err: any, completions: CompletionEntry[]) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(completions);
                }
            });
        });
    }

    getDefinitionAtPosition(fileName: string, position: number): Promise<DefinitionInfo<number>[]> {
        return new Promise<DefinitionInfo<number>[]>((resolve, reject) => {
            function callback(err: any, definitionInfo: DefinitionInfo<number>[]) {
                if (!err) {
                    resolve(definitionInfo);
                }
                else {
                    reject(err);
                }
            }
            const callbackId = this.captureCallback(`getDefinitionatPosition(${fileName})`, callback);
            const message: RequestMessage<GetDefinitionAtPositionRequest> = { data: { fileName, position, callbackId } };
            this.worker.emit(EVENT_GET_DEFINITION_AT_POSITION, message);
        });
    }

    public getFormattingEditsForDocument(fileName: string, settings: FormatCodeSettings, callback: (err: any, textChanges: TextChange<number>[]) => any): void {
        const callbackId = this.captureCallback(`getFormattingEditsForDocument(${fileName})`, callback);
        const message = { data: { fileName, settings, callbackId } };
        this.worker.emit(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, message);
    }

    public getQuickInfoAtPosition(fileName: string, position: number, callback: (err: any, quickInfo: QuickInfo) => any): void {
        const callbackId = this.captureCallback(`getQuickInfoAtPosition(${fileName})`, callback);
        const message = { data: { fileName, position, callbackId } };
        this.worker.emit(EVENT_GET_QUICK_INFO_AT_POSITION, message);
    }

    getOutputFiles(fileName: string, callback: (err: any, data: GetOutputFilesResponse) => any): void {
        // console.lg(`getOutputFiles(fileName = ${fileName})`);
        const callbackId = this.captureCallback(`getOutputFiles(${fileName})`, callback);
        const message: RequestMessage<GetOutputFilesRequest> = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_OUTPUT_FILES, message);
    }
}
