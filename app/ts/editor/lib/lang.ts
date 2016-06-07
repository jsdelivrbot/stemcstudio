/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Returns the last element in an array.
 * @param {T[]} a
 */
export function last<T>(a: T[]): T {
    return a[a.length - 1];
}

export function stringReverse(s: string): string {
    return s.split("").reverse().join("");
}

export function stringRepeat(s: string, count: number) {
    var result = '';
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

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

export function stringTrimLeft(s: string): string {
    return s.replace(trimBeginRegexp, '');
};

export function stringTrimRight(s: string): string {
    return s.replace(trimEndRegexp, '');
}

export function copyObject(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
}

export function copyArray<T>(array: T[]): T[] {
    var copy: T[] = [];
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] && typeof array[i] == "object")
            copy[i] = this.copyObject(array[i]);
        else
            copy[i] = array[i];
    }
    return copy;
}

export function deepCopy<T>(obj: T): T {
    if (typeof obj !== "object" || !obj)
        return obj;
    var cons = obj.constructor;
    if (cons === RegExp)
        return obj;

    var copy = cons();
    for (var key in obj) {
        if (typeof obj[key] === "object") {
            copy[key] = deepCopy(obj[key]);
        } else {
            copy[key] = obj[key];
        }
    }
    return copy;
}

export function arrayToMap<T>(xs: string[], value: T): { [name: string]: T } {
    const map: { [name: string]: T } = {};
    for (let i = 0, iLength = xs.length; i < iLength; i++) {
        map[xs[i]] = value;
    }
    return map;
}

export function createMap(props) {
    var map = Object.create(null);
    for (var i in props) {
        map[i] = props[i];
    }
    return map;
}

/**
 * splice out of 'array' anything that === 'value'
 */
export function arrayRemove(array, value) {
    for (var i = 0; i <= array.length; i++) {
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
export function getMatchOffsets(s: string, searchValue: RegExp) {
    var matches: { offset: number; length: number }[] = [];

    s.replace(searchValue, function(str) {
        matches.push({
            offset: arguments[arguments.length - 2],
            length: str.length
        });
        // FIXME: This is required for the TypeScript compiler.
        // It should not impact the function?
        return "lang.getMatchOffsets";
    });

    return matches;
};

/* deprecated */
export function deferredCall(fcn) {

    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var deferred: any = function(timeout) {
        deferred.cancel();
        timer = setTimeout(callback, timeout || 0);
        return deferred;
    };

    deferred.schedule = deferred;

    deferred.call = function() {
        this.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function() {
        clearTimeout(timer);
        timer = null;
        return deferred;
    };

    deferred.isPending = function() {
        return timer;
    };

    return deferred;
};
