import * as ng from 'angular';

/**
 * Helper class to manage outstanding promises used to control a distributed Finite State Machine.
 * (The Workspace service makes calls to a Web Worker).
 * While such calls aren't likely to fail, knowing when they are done is important for state transitions.
 */
export default class PromiseManager {
    private deferals: ng.IDeferred<any>[] = [];
    private promises: ng.IPromise<any>[] = [];
    private purposes: string[] = [];
    private outstanding = 0;
    private pLength: number = 0;
    constructor(private $q: ng.IQService) {
    }
    public defer(purpose: string): number {
        const deferred: ng.IDeferred<any> = this.$q.defer<any>();
        return this.captureDeferred(deferred, purpose)
    }
    public reject(deferId: number, reason: any) {
        const deferred = this.releaseDeferred(deferId)
        deferred.reject(reason)
    }
    public resolve(deferId: number, value?: any) {
        const deferred = this.releaseDeferred(deferId)
        deferred.resolve(value)
    }
    public getOutstandingPurposes(): string[] {
        const outstanding: string[] = [];
        for (let p = 0; p < this.pLength; p++) {
            const candidate = this.purposes[p]
            if (candidate) {
                outstanding.push(candidate)
            }
        }
        return outstanding
    }
    public synchronize(): ng.IPromise<any> {
        const deferred: ng.IDeferred<any> = this.$q.defer<any>();
        this.$q.all(this.getOutstandingPromises())
            .then(() => {
                deferred.resolve()
            })
            .catch((err) => {
                deferred.reject()
            })
        return deferred.promise
    }
    private getOutstandingPromises(): ng.IPromise<any>[] {
        const outstanding: ng.IPromise<any>[] = [];
        for (let p = 0; p < this.pLength; p++) {
            const candidate = this.promises[p]
            if (candidate) {
                outstanding.push(candidate)
            }
        }
        return outstanding
    }
    private captureDeferred(deferred: ng.IDeferred<any>, purpose: string): number {
        const deferId = this.pLength;
        this.deferals[deferId] = deferred;
        this.promises[deferId] = deferred.promise;
        this.purposes[deferId] = purpose;
        this.pLength += 1;
        this.outstanding++;
        return deferId;
    }
    private releaseDeferred(deferId: number): ng.IDeferred<any> {
        const deferred = this.deferals[deferId];
        if (deferred) {
            this.deferals[deferId] = void 0;
            this.promises[deferId] = void 0;
            this.purposes[deferId] = void 0;
            // No change in pLength, we're just creating a hole.
            this.outstanding--;
            if (this.outstanding === 0) {
                this.housekeeping();
            }
            return deferred;
        }
        else {
            throw new Error(`deferId (${deferId}) must be...`)
        }
    }
    public reset(): void {
        this.deferals = []
        this.promises = []
        this.purposes = []
        this.outstanding = 0;
        this.pLength = 0;
    }
    private housekeeping(): void {
        if (this.outstanding === 0) {
            // Manage the index.
            this.pLength = 0;
        }
        else {
            throw new Error(`outstanding (${this.outstanding}) must be zero for housekeeping.`)
        }
    }
    get length(): number {
        return this.outstanding;
    }
}
