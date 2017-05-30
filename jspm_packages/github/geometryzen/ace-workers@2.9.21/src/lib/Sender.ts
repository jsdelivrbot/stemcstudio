import { EventEmitterClass } from './event_emitter';
import { WorkerCallback } from '../WorkerCallback';

/**
 * Used in Web Workers.
 * Uses postMessage to communicate with a taget window.
 */
export class Sender extends EventEmitterClass implements WorkerCallback {
    constructor(private target: WorkerGlobalScope) {
        super();
    }
    // TODO: I'm not sure why we extend EventEmitterClass? Convenience?
    callback(message: any, callbackId: number) {
        this.target.postMessage({ type: "call", id: callbackId, data: message });
    }
    // TODO: I'm not sure why we extend EventEmitterClass? Convenience?
    emit(eventName: string, message?: any) {
        this.target.postMessage({ type: "event", name: eventName, data: message });
    }

    /**
     * Helper function for resolving a request.
     */
    resolve(eventName: string, value: any, callbackId: number) {
        const response = { value: value, callbackId };
        this.emit(eventName, response);
    }

    /**
     * Helper function for rejecting a request.
     */
    reject(eventName: string, reason: any, callbackId: number) {
        // TODO: Does it make sense to convert the reason?
        const response = { err: `${reason}`, callbackId };
        this.emit(eventName, response);
    }
}
