import { EVENT_APPLY_DELTA } from '../../src/mode/LanguageServiceEvents';
import { EVENT_DEFAULT_LIB_CONTENT } from '../../src/mode/LanguageServiceEvents';
import { EVENT_ENSURE_MODULE_MAPPING } from '../../src/mode/LanguageServiceEvents';
import { EVENT_GET_COMPLETIONS_AT_POSITION } from '../../src/mode/LanguageServiceEvents';
import { EVENT_GET_DEFINITION_AT_POSITION } from '../../src/mode/LanguageServiceEvents';
import { EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT } from '../../src/mode/LanguageServiceEvents';
import { EVENT_GET_LINT_ERRORS } from '../../src/mode/LanguageServiceEvents';
import { EVENT_GET_OUTPUT_FILES } from '../../src/mode/LanguageServiceEvents';
import { EVENT_GET_QUICK_INFO_AT_POSITION } from '../../src/mode/LanguageServiceEvents';
import { EVENT_GET_SCRIPT_CONTENT } from '../../src/mode/LanguageServiceEvents';
import { EVENT_GET_SEMANTIC_ERRORS } from '../../src/mode/LanguageServiceEvents';
import { EVENT_GET_SYNTAX_ERRORS } from '../../src/mode/LanguageServiceEvents';
import { EVENT_REMOVE_MODULE_MAPPING } from '../../src/mode/LanguageServiceEvents';
import { EVENT_REMOVE_SCRIPT } from '../../src/mode/LanguageServiceEvents';
import { EVENT_SET_MODULE_KIND } from '../../src/mode/LanguageServiceEvents';
import { EVENT_SET_OPERATOR_OVERLOADING } from '../../src/mode/LanguageServiceEvents';
import { EVENT_SET_SCRIPT_CONTENT } from '../../src/mode/LanguageServiceEvents';
import { EVENT_SET_SCRIPT_TARGET } from '../../src/mode/LanguageServiceEvents';
import { EVENT_SET_TRACE } from '../../src/mode/LanguageServiceEvents';
import { EVENT_SET_TS_CONFIG } from '../../src/mode/LanguageServiceEvents';

import { GetOutputFilesRequest } from '../../src/mode/LanguageServiceEvents';
import { EnsureModuleMappingRequest, RemoveModuleMappingRequest } from '../../src/mode/LanguageServiceEvents';
import { GetScriptContentRequest, SetScriptContentRequest, RemoveScriptRequest } from '../../src/mode/LanguageServiceEvents';
import { SetOperatorOverloadingRequest } from '../../src/mode/LanguageServiceEvents';
import { SetTraceRequest } from '../../src/mode/LanguageServiceEvents';

import LanguageServiceWorker from '../../src/mode/LanguageServiceWorker';
import WorkerCallback from '../../src/WorkerCallback';

interface SourceMap {
    version: number;
    file: string;
    sourceRoot: string;
    sources: string[];
    names: string[];
    mappings: string;
}

class MockWorkerCallback implements WorkerCallback {
    /**
     * The callback functions are made available for the proxy to simulate messages from the main thread.
     */
    public callbacks: { [eventName: string]: (e: any) => void } = {};
    /**
     * The resolve callbacks
     */
    public resolutions: { [callbackId: number]: { eventName: string, value: any } } = {};
    constructor() {
        // console.log("MockWorkerCallback");
    }

    /**
     *
     */
    on(eventName: string, callback: (e: any) => void): void {
        switch (eventName) {
            case EVENT_APPLY_DELTA:
            case EVENT_DEFAULT_LIB_CONTENT:
            case EVENT_ENSURE_MODULE_MAPPING:
            case EVENT_GET_COMPLETIONS_AT_POSITION:
            case EVENT_GET_DEFINITION_AT_POSITION:
            case EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT:
            case EVENT_GET_LINT_ERRORS:
            case EVENT_GET_OUTPUT_FILES:
            case EVENT_GET_QUICK_INFO_AT_POSITION:
            case EVENT_GET_SCRIPT_CONTENT:
            case EVENT_GET_SEMANTIC_ERRORS:
            case EVENT_GET_SYNTAX_ERRORS:
            case EVENT_REMOVE_MODULE_MAPPING:
            case EVENT_REMOVE_SCRIPT:
            case EVENT_SET_MODULE_KIND:
            case EVENT_SET_OPERATOR_OVERLOADING:
            case EVENT_SET_SCRIPT_CONTENT:
            case EVENT_SET_SCRIPT_TARGET:
            case EVENT_SET_TRACE:
            case EVENT_SET_TS_CONFIG: {
                // console.log(`MockWorkerCallback.on(${eventName})`);
                this.callbacks[eventName] = callback;
                break;
            }
            default: {
                console.warn(`MockWorkerCallback.on(${eventName})`);
            }
        }
    }

    /**
     *
     */
    callback(data: any, callbackId: number): void {
        //
    }

    /**
     *
     */
    emit(eventName: string, data?: any): void {
        console.warn(`MockWorkerCallback.emit(${eventName})`);
    }

    resolve(eventName: string, value: any, callbackId: number): void {
        switch (eventName) {
            case EVENT_ENSURE_MODULE_MAPPING:
            case EVENT_GET_OUTPUT_FILES:
            case EVENT_GET_SCRIPT_CONTENT:
            case EVENT_REMOVE_MODULE_MAPPING:
            case EVENT_REMOVE_SCRIPT:
            case EVENT_SET_OPERATOR_OVERLOADING:
            case EVENT_SET_SCRIPT_CONTENT:
            case EVENT_SET_TRACE: {
                this.resolutions[callbackId] = { eventName, value };
                break;
            }
            default: {
                console.warn(`MockWorkerCallback.resolve(${eventName})`);
            }
        }
    }

    reject(eventName: string, reason: any, callbackId: number): void {
        console.warn(`MockWorkerCallback.reject(${eventName})`);
    }
}

/**
 * Simulates the proxy in the main thread.
 */
class MockLanguageServiceProxy {
    constructor(private sender: MockWorkerCallback) {
    }
    ensureModuleMapping(moduleName: string, fileName: string, callbackId: number): void {
        const callback = this.sender.callbacks[EVENT_ENSURE_MODULE_MAPPING];
        const data: EnsureModuleMappingRequest = { moduleName, fileName, callbackId };
        callback({ data });
    }
    removeModuleMapping(moduleName: string, callbackId: number): void {
        const callback = this.sender.callbacks[EVENT_REMOVE_MODULE_MAPPING];
        const data: RemoveModuleMappingRequest = { moduleName, callbackId };
        callback({ data });
    }
    getScriptContent(fileName: string, callbackId: number): void {
        const callback = this.sender.callbacks[EVENT_GET_SCRIPT_CONTENT];
        const data: GetScriptContentRequest = { fileName, callbackId };
        callback({ data });
    }
    setScriptContent(fileName: string, content: string, callbackId: number): void {
        const callback = this.sender.callbacks[EVENT_SET_SCRIPT_CONTENT];
        const data: SetScriptContentRequest = { fileName, content, callbackId };
        callback({ data });
    }
    removeScript(fileName: string, callbackId: number): void {
        const callback = this.sender.callbacks[EVENT_REMOVE_SCRIPT];
        const data: RemoveScriptRequest = { fileName, callbackId };
        callback({ data });
    }
    getOutputFiles(fileName: string, callbackId: number): void {
        const callback = this.sender.callbacks[EVENT_GET_OUTPUT_FILES];
        const data: GetOutputFilesRequest = { fileName, callbackId };
        callback({ data });
    }
    setOperatorOverloading(operatorOverloading: boolean, callbackId: number): void {
        const callback = this.sender.callbacks[EVENT_SET_OPERATOR_OVERLOADING];
        const data: SetOperatorOverloadingRequest = { operatorOverloading, callbackId };
        callback({ data });
    }
    setTrace(trace: boolean, callbackId: number): void {
        const callback = this.sender.callbacks[EVENT_SET_TRACE];
        const data: SetTraceRequest = { trace, callbackId };
        callback({ data });
    }
}

describe("LanguageServiceWorker", function () {
    describe("constructor", function () {
        const sender = new MockWorkerCallback();
        const registry = ts.createDocumentRegistry(true);
        const lsw = new LanguageServiceWorker(sender);
        it("lsw should be defined", function () {
            expect(lsw).toBeDefined();
        });
        it("registry should be defined", function () {
            expect(registry).toBeDefined();
        });
        it("trace property should default to false", function () {
            expect(lsw.trace).toBe(false);
        });
    });
    describe("setOperatorOverloading", function () {
        describe("(true)", function () {
            const sender = new MockWorkerCallback();
            const proxy = new MockLanguageServiceProxy(sender);
            const lsw = new LanguageServiceWorker(sender);
            lsw.setOperatorOverloading(false);
            it("should change the operatorOverloading property from false to true", function () {
                expect(lsw.isOperatorOverloadingEnabled()).toBe(false);
                const callbackId = Math.random();
                proxy.setOperatorOverloading(true, callbackId);
                expect(lsw).toBeDefined();
                const resolution = sender.resolutions[callbackId];
                expect(resolution).toBeDefined();
                expect(resolution.eventName).toBe(EVENT_SET_OPERATOR_OVERLOADING);
                expect(lsw.isOperatorOverloadingEnabled()).toBe(true);
            });
        });
        describe("(false)", function () {
            const sender = new MockWorkerCallback();
            const proxy = new MockLanguageServiceProxy(sender);
            const lsw = new LanguageServiceWorker(sender);
            lsw.setOperatorOverloading(true);
            it("should change the operatorOverloading property from true to false", function () {
                expect(lsw.isOperatorOverloadingEnabled()).toBe(true);
                const callbackId = Math.random();
                proxy.setOperatorOverloading(false, callbackId);
                expect(lsw).toBeDefined();
                const resolution = sender.resolutions[callbackId];
                expect(resolution).toBeDefined();
                expect(resolution.eventName).toBe(EVENT_SET_OPERATOR_OVERLOADING);
                expect(lsw.isOperatorOverloadingEnabled()).toBe(false);
            });
        });
    });
    describe("setTrace", function () {
        describe("(true)", function () {
            const sender = new MockWorkerCallback();
            const proxy = new MockLanguageServiceProxy(sender);
            const lsw = new LanguageServiceWorker(sender);
            lsw.trace = false;
            it("should change the trace property from false to true", function () {
                expect(lsw.trace).toBe(false);
                const callbackId = Math.random();
                proxy.setTrace(true, callbackId);
                expect(lsw).toBeDefined();
                const resolution = sender.resolutions[callbackId];
                expect(resolution).toBeDefined();
                expect(resolution.eventName).toBe(EVENT_SET_TRACE);
                expect(lsw.trace).toBe(true);
            });
        });
        describe("(false)", function () {
            const sender = new MockWorkerCallback();
            const proxy = new MockLanguageServiceProxy(sender);
            const lsw = new LanguageServiceWorker(sender);
            lsw.trace = true;
            it("should change the trace property from true to false", function () {
                expect(lsw.trace).toBe(true);
                const callbackId = Math.random();
                proxy.setTrace(false, callbackId);
                expect(lsw).toBeDefined();
                const resolution = sender.resolutions[callbackId];
                expect(resolution).toBeDefined();
                expect(resolution.eventName).toBe(EVENT_SET_TRACE);
                expect(lsw.trace).toBe(false);
            });
        });
    });
    describe("ensureModuleMapping", function () {
        const sender = new MockWorkerCallback();
        const proxy = new MockLanguageServiceProxy(sender);
        const lsw = new LanguageServiceWorker(sender);
        it("should acknowledge", function () {
            const callbackId = Math.random();
            proxy.ensureModuleMapping('rxjs/Rx', 'https://somewhere/Rx.js', callbackId);
            expect(lsw).toBeDefined();
            const resolution = sender.resolutions[callbackId];
            expect(resolution).toBeDefined();
            expect(resolution.eventName).toBe(EVENT_ENSURE_MODULE_MAPPING);
        });
    });
    describe("removeModuleMapping", function () {
        const sender = new MockWorkerCallback();
        const proxy = new MockLanguageServiceProxy(sender);
        const lsw = new LanguageServiceWorker(sender);
        it("should acknowledge", function () {
            const callbackId = Math.random();
            proxy.removeModuleMapping('rxjs/Rx', callbackId);
            expect(lsw).toBeDefined();
            const resolution = sender.resolutions[callbackId];
            expect(resolution).toBeDefined();
            expect(resolution.eventName).toBe(EVENT_REMOVE_MODULE_MAPPING);
        });
    });
    describe("getScriptContent", function () {
        const sender = new MockWorkerCallback();
        const proxy = new MockLanguageServiceProxy(sender);
        const lsw = new LanguageServiceWorker(sender);
        it("should acknowledge", function () {
            const callbackId = Math.random();
            proxy.getScriptContent('index.ts', callbackId);
            expect(lsw).toBeDefined();
            const resolution = sender.resolutions[callbackId];
            expect(resolution).toBeDefined();
            expect(resolution.eventName).toBe(EVENT_GET_SCRIPT_CONTENT);
        });
    });
    describe("setScriptContent", function () {
        const sender = new MockWorkerCallback();
        const proxy = new MockLanguageServiceProxy(sender);
        const lsw = new LanguageServiceWorker(sender);
        it("should acknowledge", function () {
            const callbackId = Math.random();
            proxy.setScriptContent('index.ts', 'const x = 42', callbackId);
            expect(lsw).toBeDefined();
            const resolution = sender.resolutions[callbackId];
            expect(resolution).toBeDefined();
            expect(resolution.eventName).toBe(EVENT_SET_SCRIPT_CONTENT);
        });
    });
    describe("removeScript", function () {
        const sender = new MockWorkerCallback();
        const proxy = new MockLanguageServiceProxy(sender);
        const lsw = new LanguageServiceWorker(sender);
        it("should acknowledge", function () {
            const callbackId = Math.random();
            proxy.removeScript('index.ts', callbackId);
            expect(lsw).toBeDefined();
            const resolution = sender.resolutions[callbackId];
            expect(resolution).toBeDefined();
            expect(resolution.eventName).toBe(EVENT_REMOVE_SCRIPT);
        });
    });
    describe("getOutputFiles", function () {
        const sender = new MockWorkerCallback();
        const proxy = new MockLanguageServiceProxy(sender);
        const lsw = new LanguageServiceWorker(sender);
        it("should acknowledge", function () {
            const one = Math.random();
            proxy.setScriptContent('index.ts', 'const x = 0;\nconst y = 1;', one);
            expect(lsw).toBeDefined();
            const resolution1 = sender.resolutions[one];
            expect(resolution1).toBeDefined();
            expect(resolution1.eventName).toBe(EVENT_SET_SCRIPT_CONTENT);
            const two = Math.random();
            proxy.getOutputFiles('index.ts', two);
            const resolution2 = sender.resolutions[two];
            expect(resolution2).toBeDefined();
            expect(resolution2.eventName).toBe(EVENT_GET_OUTPUT_FILES);
            const outputFiles: ts.OutputFile[] = resolution2.value;
            expect(outputFiles).toBeDefined();
            expect(Array.isArray(outputFiles)).toBe(true);
            expect(outputFiles.length).toBe(2);
            const fileOne = outputFiles[0];
            expect(fileOne).toBeDefined();
            expect(fileOne.name).toBe('index.js');
            expect(fileOne.text).toBe('var x = 0;\nvar y = 1;\n//# sourceMappingURL=index.js.map');
            const fileTwo = outputFiles[1];
            expect(fileTwo).toBeDefined();
            expect(fileTwo.name).toBe('index.js.map');
            const map = <SourceMap>JSON.parse(fileTwo.text);
            expect(map.version).toBe(3);
            expect(map.file).toBe('index.js');
            expect(map.sourceRoot).toBe('');
            expect(map.sources).toEqual(['index.ts']);
            expect(map.names).toEqual([]);
            // console.log(map.mappings);
        });
    });
});
