import isUndefined from './isUndefined';

export default class Fuzzy<T> {
    private _value: T;
    private _reason: any;
    reset(): void {
        this._value = void 0;
        this._reason = void 0;
    }
    resolve(value: T): void {
        this._value = value;
        this._reason = void 0;
    }
    reject(reason: any): void {
        this._value = void 0;
        this._reason = reason;
    }
    isDefined(): boolean {
        return this.isResolved() || this.isRejected();
    }
    isUndefined(): boolean {
        return isUndefined(this._value) && isUndefined(this._reason);
    }
    get value(): T {
        return this._value;
    }
    get reason(): any {
        return this._reason;
    }
    isResolved(): boolean {
        return !isUndefined(this._value) && isUndefined(this._reason);
    }
    isRejected(): boolean {
        return isUndefined(this._value) && !isUndefined(this._reason);
    }
}
