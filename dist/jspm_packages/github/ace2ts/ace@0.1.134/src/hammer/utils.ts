var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
export var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given `this` scope.
 * param {Function} fn
 * param {Number} timeout
 * param {Object} context
 * return {number}
 */
export function setTimeoutContext(fn, timeout: number, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * param {*|Array} arg
 * param {String} fn
 * param {Object} [context]
 * return {Boolean}
 */
export function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * param {Object} obj
 * param {Function} iterator
 * param {Object} context
 */
export function each(obj, iterator, context?) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * param {Object} dest
 * param {Object} src
 * param {Boolean} [merge]
 * return {Object} dest
 */
export function extend(dest, src, merge?: boolean) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * param {Object} dest
 * param {Object} src
 * return {Object} dest
 */
export function merge(dest, src) {
    return extend(dest, src, true);
}

/**
 * simple class inheritance
 * param {Function} child
 * param {Function} base
 * param {Object} [properties]
 */
export function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        extend(childP, properties);
    }
}

/**
 * simple function bind
 * param {Function} fn
 * param {Object} context
 * return {Function}
 */
export function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * use the val2 when val1 is undefined
 * param {*} val1
 * param {*} val2
 * return {*}
 */
export function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * param {EventTarget} eventTarget
 * param {String} types
 * param {Function} handler
 */
export function addEventListeners(eventTarget: EventTarget, types: string, handler) {
    each(splitStr(types), function(type) {
        eventTarget.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * param {EventTarget} eventTarget
 * param {String} types
 * param {Function} handler
 */
export function removeEventListeners(eventTarget: EventTarget, types: string, handler) {
    each(splitStr(types), function(type) {
        eventTarget.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * method hasParent
 * param {HTMLElement} node
 * param {HTMLElement} parent
 * return {Boolean} found
 */
export function hasParent(node: any, parent: HTMLElement): boolean {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * param {String} str
 * param {String} find
 * return {Boolean} found
 */
export function inStr(str: string, find: string): boolean {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * param {String} str
 * return {Array} words
 */
export function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * param {Array} src
 * param {String} find
 * param {String} [findByKey]
 * return {Boolean|Number} false when not found, or the index
 */
export function inArray(src: any[], find, findByKey?: string) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * param {Object} obj
 * return {Array}
 */
export function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * param {Array} src [{id:1},{id:2},{id:1}]
 * param {String} [key]
 * param {Boolean} [sort=False]
 * return {Array} [{id:1},{id:2}]
 */
export function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key] ? 1 : 0;
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * param {Object} obj
 * param {String} property
 * return {String|Undefined} prefixed
 */
export function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * return {number} uniqueId
 */
var _uniqueId = 1;
export function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * param {HTMLElement} element
 * return {Window}
 */
export function getWindowForElement(element: HTMLElement): Window {
    var doc = element.ownerDocument;
    if (doc) {
        return doc.defaultView || window;
    }
    else {
        return window;
    }
}
