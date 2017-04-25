import { ACE_WORKER_MODULE_NAME } from '../../constants';
import CompletionEntry from './CompletionEntry';
import Delta from '../Delta';
import Diagnostic from './Diagnostic';
import FormatCodeSettings from './FormatCodeSettings';
import TextChange from './TextChange';
import OutputFile from './OutputFile';
import RuleFailure from './RuleFailure';
import QuickInfo from './QuickInfo';
import WorkerClient from '../worker/WorkerClient';
import setModuleKindCallback from './SetModuleKindCallback';
import StandardErrorCallback from './StandardErrorCallback';
import setScriptTargetCallback from './SetScriptTargetCallback';
import TsLintSettings from '../../modules/tslint/TsLintSettings';
import { EVENT_APPLY_DELTA } from './LanguageServiceEvents';
import { EVENT_DEFAULT_LIB_CONTENT } from './LanguageServiceEvents';
import { EVENT_ENSURE_MODULE_MAPPING } from './LanguageServiceEvents';
import { EVENT_ENSURE_SCRIPT } from './LanguageServiceEvents';
import { EVENT_GET_LINT_ERRORS } from './LanguageServiceEvents';
import { EVENT_GET_SYNTAX_ERRORS } from './LanguageServiceEvents';
import { EVENT_GET_SEMANTIC_ERRORS } from './LanguageServiceEvents';
import { EVENT_GET_COMPLETIONS_AT_POSITION } from './LanguageServiceEvents';
import { EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT } from './LanguageServiceEvents';
import { EVENT_GET_QUICK_INFO_AT_POSITION } from './LanguageServiceEvents';
import { EVENT_GET_OUTPUT_FILES } from './LanguageServiceEvents';
import { EVENT_REMOVE_MODULE_MAPPING } from './LanguageServiceEvents';
import { EVENT_REMOVE_SCRIPT } from './LanguageServiceEvents';
// import { EVENT_SET_LINTING } from './LanguageServiceEvents';
import { EVENT_SET_MODULE_KIND } from './LanguageServiceEvents';
import { EVENT_SET_OPERATOR_OVERLOADING } from './LanguageServiceEvents';
import { EVENT_SET_SCRIPT_TARGET } from './LanguageServiceEvents';
import { EVENT_SET_TRACE } from './LanguageServiceEvents';
import { EVENT_SET_TS_CONFIG } from './LanguageServiceEvents';
import { EnsureModuleMappingRequest, RemoveModuleMappingRequest } from './LanguageServiceEvents';
import { EnsureScriptRequest, RemoveScriptRequest } from './LanguageServiceEvents';
import { GetOutputFilesRequest } from './LanguageServiceEvents';
// import { SetLintingRequest } from './LanguageServiceEvents';
import { SetModuleKindRequest } from './LanguageServiceEvents';
import { SetOperatorOverloadingRequest } from './LanguageServiceEvents';
import { SetTraceRequest } from './LanguageServiceEvents';
import { SetTsConfigRequest, TsConfigSettings } from './LanguageServiceEvents';
import { ModuleKind } from './LanguageServiceEvents';

interface WorkerClientData<T> {
    err?: any;
    value?: T;
    callbackId: number;
}

/**
 * Lowercase string constants corresponding to the Language Service ScriptTarget enumeration.
 */
export type ScriptTarget = 'es2015' | 'es2016' | 'es2017' | 'es3' | 'es5' | 'esnext' | 'latest';

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
    private readonly callbacks: { [id: number]: (err: any, results?: any) => any } = {};

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

        this.worker.on(EVENT_APPLY_DELTA, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err);
            }
        });

        this.worker.on(EVENT_DEFAULT_LIB_CONTENT, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err);
            }
        });

        this.worker.on(EVENT_ENSURE_SCRIPT, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err);
            }
        });

        this.worker.on(EVENT_REMOVE_SCRIPT, (response: { data: WorkerClientData<any> }) => {
            const { err, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err);
            }
        });

        this.worker.on(EVENT_GET_LINT_ERRORS, (response: { data: WorkerClientData<RuleFailure[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_GET_SYNTAX_ERRORS, (response: { data: WorkerClientData<Diagnostic[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_GET_SEMANTIC_ERRORS, (response: { data: WorkerClientData<Diagnostic[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_GET_COMPLETIONS_AT_POSITION, (response: { data: WorkerClientData<CompletionEntry[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, (response: { data: WorkerClientData<TextChange[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_GET_QUICK_INFO_AT_POSITION, (response: { data: WorkerClientData<QuickInfo> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_GET_OUTPUT_FILES, (response: { data: WorkerClientData<OutputFile[]> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_SET_MODULE_KIND, (response: { data: WorkerClientData<ModuleKind> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_SET_OPERATOR_OVERLOADING, (response: { data: WorkerClientData<boolean> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_SET_SCRIPT_TARGET, (response: { data: WorkerClientData<ScriptTarget> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_SET_TRACE, (response: { data: WorkerClientData<boolean> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });

        this.worker.on(EVENT_SET_TS_CONFIG, (response: { data: WorkerClientData<TsConfigSettings> }) => {
            const { err, value, callbackId } = response.data;
            const callback = this.releaseCallback(callbackId);
            if (callback) {
                callback(err, value);
            }
        });
    }

    initialize(scriptImports: string[], callback: (err: any) => any): void {
        this.worker.init(scriptImports, ACE_WORKER_MODULE_NAME, 'LanguageServiceWorker', function (err: any) {
            if (err) {
                console.warn(`worker.init() failed ${err}`);
            }
            callback(err);
        });
    }

    terminate(): void {
        this.worker.dispose();
    }

    setDefaultLibContent(content: string, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { content, callbackId } };
        this.worker.emit(EVENT_DEFAULT_LIB_CONTENT, message);
    }

    /**
     * Exchanges the callback function for a numeric token.
     * This token is posted to the worker thread along with the request.
     * When the response arrives, the token is used to find the original callback function.
     */
    private captureCallback(callback: (err: any, results?: any) => any): number {
        if (callback) {
            const callbackId = this.callbackId++;
            this.callbacks[callbackId] = callback;
            return callbackId;
        }
        else {
            throw new Error("callback must be supplied.");
            // return void 0;
        }
    }

    private releaseCallback(callbackId: number) {
        if (typeof callbackId === 'number') {
            const callback = this.callbacks[callbackId];
            delete this.callbacks[callbackId];
            return callback;
        }
        else {
            return void 0;
        }
    }

    applyDelta(path: string, delta: Delta, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName: path, delta, callbackId } };
        this.worker.emit(EVENT_APPLY_DELTA, message);
    }

    ensureModuleMapping(moduleName: string, fileName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const callback = function (err: any) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            };
            const callbackId = this.captureCallback(callback);
            const message: { data: EnsureModuleMappingRequest } = { data: { moduleName, fileName, callbackId } };
            this.worker.emit(EVENT_ENSURE_MODULE_MAPPING, message);
        });
    }

    removeModuleMapping(moduleName: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const callback = function (err: any) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(true);
                }
            };
            const callbackId = this.captureCallback(callback);
            const message: { data: RemoveModuleMappingRequest } = { data: { moduleName, callbackId } };
            this.worker.emit(EVENT_REMOVE_MODULE_MAPPING, message);
        });
    }

    ensureScript(path: string, content: string, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message: { data: EnsureScriptRequest } = { data: { fileName: path, content, callbackId } };
        this.worker.emit(EVENT_ENSURE_SCRIPT, message);
    }

    removeScript(path: string, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message: { data: RemoveScriptRequest } = { data: { fileName: path, callbackId } };
        this.worker.emit(EVENT_REMOVE_SCRIPT, message);
    }
    /*
    public setLinting(linting: boolean, callback: StandardErrorCallback): void {
        const callbackId = this.captureCallback(callback);
        const message: { data: SetLintingRequest } = { data: { linting, callbackId } };
        this.worker.emit(EVENT_SET_LINTING, message);
    }
    */
    public setModuleKind(moduleKind: string, callback: setModuleKindCallback): void {
        const callbackId = this.captureCallback(callback);
        const message: { data: SetModuleKindRequest } = { data: { moduleKind, callbackId } };
        this.worker.emit(EVENT_SET_MODULE_KIND, message);
    }

    public setOperatorOverloading(operatorOverloading: boolean, callback: StandardErrorCallback): void {
        const callbackId = this.captureCallback(callback);
        const message: { data: SetOperatorOverloadingRequest } = { data: { operatorOverloading, callbackId } };
        this.worker.emit(EVENT_SET_OPERATOR_OVERLOADING, message);
    }

    public setScriptTarget(scriptTarget: ScriptTarget, callback: setScriptTargetCallback): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { scriptTarget, callbackId } };
        this.worker.emit(EVENT_SET_SCRIPT_TARGET, message);
    }

    public setTrace(trace: boolean, callback: (err: any) => any): void {
        const callbackId = this.captureCallback(callback);
        const message: { data: SetTraceRequest } = { data: { trace, callbackId } };
        this.worker.emit(EVENT_SET_TRACE, message);
    }

    public setTsConfig(settings: TsConfigSettings, callback: (err: any, settingsOut: TsConfigSettings) => void): void {
        const callbackId = this.captureCallback(callback);
        const message: { data: SetTsConfigRequest } = { data: { settings, callbackId } };
        this.worker.emit(EVENT_SET_TS_CONFIG, message);
    }

    public getLintErrors(fileName: string, configuration: TsLintSettings, callback: (err: any, results: Diagnostic[]) => void): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, configuration, callbackId } };
        this.worker.emit(EVENT_GET_LINT_ERRORS, message);
    }

    public getSyntaxErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_SYNTAX_ERRORS, message);
    }

    public getSemanticErrors(fileName: string, callback: (err: any, results: Diagnostic[]) => void): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_SEMANTIC_ERRORS, message);
    }

    private _getCompletionsAtPosition(fileName: string, position: number, prefix: string, callback: (err: any, completions: CompletionEntry[]) => void): void {
        const callbackId = this.captureCallback(callback);
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

    public getFormattingEditsForDocument(fileName: string, settings: FormatCodeSettings, callback: (err: any, textChanges: TextChange[]) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, settings, callbackId } };
        this.worker.emit(EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT, message);
    }

    public getQuickInfoAtPosition(fileName: string, position: number, callback: (err: any, quickInfo: QuickInfo) => any): void {
        const callbackId = this.captureCallback(callback);
        const message = { data: { fileName, position, callbackId } };
        this.worker.emit(EVENT_GET_QUICK_INFO_AT_POSITION, message);
    }

    getOutputFiles(fileName: string, callback: (err: any, outputFiles: OutputFile[]) => any): void {
        const callbackId = this.captureCallback(callback);
        const message: { data: GetOutputFilesRequest } = { data: { fileName, callbackId } };
        this.worker.emit(EVENT_GET_OUTPUT_FILES, message);
    }
}
