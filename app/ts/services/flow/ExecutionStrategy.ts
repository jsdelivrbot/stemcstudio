import { IPromise } from 'angular';
import { Flow } from './Flow';
import { RootNode } from './nodes/RootNode';

/**
 *
 */
export class ExecutionStrategy<T> {
    flow: Flow<T>;
    flowAltered: boolean;
    looping: boolean;
    matchUntilHalt: boolean;
    rootNode: RootNode;
    agenda;
    private __halted: boolean;
    private assertHandler: () => void;
    private modifyHandler: () => void;
    private retractHandler: () => void;
    private errorCallback: (reason: any) => void;
    constructor(flow: Flow<T>, matchUnitilHalt?: boolean) {
        this.flow = flow;
        this.agenda = flow.agenda;
        this.matchUntilHalt = !!matchUnitilHalt;
    }

    private onAlter() {
        this.flowAltered = true;
        if (!this.looping && this.matchUntilHalt && !this.__halted) {
            this.callNext();
        }
    }

    setup() {
        const flow = this.flow;
        this.rootNode.resetCounter();

        const assertHandler = () => { this.onAlter(); };
        flow.on("assert", assertHandler);
        this.assertHandler = assertHandler;

        const modifyHandler = () => { this.onAlter(); };
        flow.on("modify", modifyHandler);
        this.modifyHandler = modifyHandler;

        const retractHandler = () => { this.onAlter(); };
        flow.on("retract", retractHandler);
        this.retractHandler = retractHandler;
    }

    tearDown() {
        const flow = this.flow;
        if (this.assertHandler) {
            flow.removeListener("assert", this.assertHandler);
            this.assertHandler = void 0;
        }
        if (this.modifyHandler) {
            flow.removeListener("modify", this.modifyHandler);
            this.modifyHandler = void 0;
        }
        if (this.retractHandler) {
            flow.removeListener("retract", this.retractHandler);
            this.retractHandler = void 0;
        }
    }

    __handleAsyncNext(next: IPromise<any>): any {
        return next.then((promiseValue) => {
            this.looping = false;
            if (!this.agenda.isEmpty()) {
                if (this.flowAltered) {
                    this.rootNode.incrementCounter();
                    this.flowAltered = false;
                }
                if (!this.__halted) {
                    return this.callNext();
                } else {
                    return this.callback();
                }
            } else if (!this.matchUntilHalt || this.__halted) {
                return this.callback();
            }
        }, this.errorCallback);
    }

    callback() {
        this.tearDown();
        throw new Error('ExecutionStrategy.callback()');
    }

    callNext(): void {
        this.looping = true;
        const next = this.agenda.fireNext();
        return this.__handleAsyncNext(next);
    }

    execute(): void {
        this.setup();
        return this.callNext();
    }
}
