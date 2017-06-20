import { MatchOffset } from './MatchOffset';

/**
 * Returns the last element in an array.
 */
export function last<T>(a: T[]): T {
    return a[a.length - 1];
}

export function stringReverse(s: string): string {
    return s.split("").reverse().join("");
}

export function stringRepeat(s: string, count: number) {
    let result = '';
    while (count > 0) {
        if (count & 1) {
            result += s;
        }

        if (count >>= 1) {
            s += s;
        }
    }
    return result;
}

const trimBeginRegexp = /^\s\s*/;
const trimEndRegexp = /\s\s*$/;

export function stringTrimLeft(s: string): string {
    return s.replace(trimBeginRegexp, '');
}

export function stringTrimRight(s: string): string {
    return s.replace(trimEndRegexp, '');
}

export function copyObject(obj: Object) {
    const copy = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = obj[key];
        }
    }
    return copy;
}

/*
export function copyArray<T>(array: T[]): T[] {
    const copy: T[] = [];
    for (let i = 0, l = array.length; i < l; i++) {
        if (array[i] && typeof array[i] === "object")
            copy[i] = <T[]>copyObject(array[i]);
        else
            copy[i] = array[i];
    }
    return copy;
}
*/

export function deepCopy<T>(obj: T): T {
    if (typeof obj !== "object" || !obj)
        return obj;
    const cons = obj.constructor;
    if (cons === RegExp)
        return obj;

    const copy = cons();
    for (const key in obj) {
        if (typeof obj[key] === "object") {
            copy[key] = deepCopy(obj[key]);
        } else {
            copy[key] = obj[key];
        }
    }
    return copy;
}

export function arrayToMap<T>(xs: string[], value?: T): { [name: string]: T | undefined } {
    const map: { [name: string]: T | undefined } = {};
    for (let i = 0, iLength = xs.length; i < iLength; i++) {
        map[xs[i]] = value;
    }
    return map;
}

export function createMap(props: Object): { [name: string]: any } {
    const map: { [name: string]: any } = Object.create(null);
    for (let i in props) {
        if (props.hasOwnProperty(i)) {
            map[i] = props[i];
        }
    }
    return map;
}

/**
 * splice out of 'array' anything that === 'value'
 */
export function arrayRemove<T>(array: T[], value: T): void {
    for (let i = 0; i <= array.length; i++) {
        if (value === array[i]) {
            array.splice(i, 1);
        }
    }
}

export function escapeRegExp(str: string): string {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
}

/**
 * 
 */
export function getMatchOffsets(s: string, searchValue: RegExp): MatchOffset[] {
    const matches: MatchOffset[] = [];

    s.replace(searchValue, function (str: string) {
        matches.push({
            offset: arguments[arguments.length - 2],
            length: str.length
        });
        // FIXME: This is required for the TypeScript compiler.
        // It should not impact the function?
        return "lang.getMatchOffsets";
    });

    return matches;
}

/* deprecated */
export function deferredCall(fcn: Function) {

    let timer: number | null = null;
    const callback = function () {
        timer = null;
        fcn();
    };

    const deferred: any = function (timeout: number) {
        deferred.cancel();
        timer = window.setTimeout(callback, timeout || 0);
        return deferred;
    };

    deferred.schedule = deferred;

    deferred.call = function () {
        deferred.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function () {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        return deferred;
    };

    deferred.isPending = function () {
        return timer;
    };

    return deferred;
}
