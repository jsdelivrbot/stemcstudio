import EventEmitterClass from './event_emitter';
import WorkerCallback from '../WorkerCallback';

/**
 * Used in Web Workers.
 * Uses postMessage to communicate with a taget window.
 */
export default class Sender extends EventEmitterClass implements WorkerCallback {
    private target: WorkerGlobalScope;
    constructor(target: WorkerGlobalScope) {
        super();
        this.target = target;
    }
    // FIXME: I'm not sure why we extend EventEmitterClass? Convenience?
    callback(data: any, callbackId: number) {
        this.target.postMessage({ type: "call", id: callbackId, data: data });
    }
    // FIXME: I'm not sure why we extend EventEmitterClass? Convenience?
    emit(name: string, data?: any) {
        this.target.postMessage({ type: "event", name: name, data: data });
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