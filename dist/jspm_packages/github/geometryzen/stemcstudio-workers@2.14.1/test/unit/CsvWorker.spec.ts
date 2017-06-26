import { CsvWorker } from '../../src/workers/CsvWorker';
import { WorkerCallback } from '../../src/workers/WorkerCallback';

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
            case 'change': {
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
        switch (eventName) {
            case 'annotations': {
                console.log(`MockWorkerCallback.emit(eventName = ${eventName}, data = ${JSON.stringify(data)})`);
                break;
            }
            default: {
                console.warn(`MockWorkerCallback.emit(${eventName})`);
            }
        }
    }

    resolve(eventName: string, value: any, callbackId: number): void {
        switch (eventName) {
            /*
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
            */
            default: {
                console.warn(`MockWorkerCallback.resolve(${eventName})`);
            }
        }
    }

    reject(eventName: string, reason: any, callbackId: number): void {
        console.warn(`MockWorkerCallback.reject(${eventName})`);
    }
}

describe("CsvWorker", function () {
    describe("valid", function () {
        const host = new MockWorkerCallback();
        const worker = new CsvWorker(host);
        const sourceText = [
            "1,2,3"
        ].join('\n');
        it("", function () {
            worker.setValue(sourceText);
            worker.getValue(42);
            expect(true).toBe(true);
        });

    });
    describe("invalid", function () {
        const host = new MockWorkerCallback();
        const worker = new CsvWorker(host);
        const sourceText = [
            "1,'2,3"
        ].join('\n');
        it("", function () {
            worker.setValue(sourceText);
            worker.onUpdate();
            expect(true).toBe(true);
        });

    });
});
