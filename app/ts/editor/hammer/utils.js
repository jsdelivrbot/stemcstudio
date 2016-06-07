define(["require", "exports"], function (require, exports) {
    var VENDOR_PREFIXES = ['', 'webkit', 'moz', 'MS', 'ms', 'o'];
    exports.TEST_ELEMENT = document.createElement('div');
    var TYPE_FUNCTION = 'function';
    var round = Math.round;
    var abs = Math.abs;
    var now = Date.now;
    function setTimeoutContext(fn, timeout, context) {
        return setTimeout(bindFn(fn, context), timeout);
    }
    exports.setTimeoutContext = setTimeoutContext;
    function invokeArrayArg(arg, fn, context) {
        if (Array.isArray(arg)) {
            each(arg, context[fn], context);
            return true;
        }
        return false;
    }
    exports.invokeArrayArg = invokeArrayArg;
    function each(obj, iterator, context) {
        var i;
        if (!obj) {
            return;
        }
        if (obj.forEach) {
            obj.forEach(iterator, context);
        }
        else if (obj.length !== undefined) {
            i = 0;
            while (i < obj.length) {
                iterator.call(context, obj[i], i, obj);
                i++;
            }
        }
        else {
            for (i in obj) {
                obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
            }
        }
    }
    exports.each = each;
    function extend(dest, src, merge) {
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
    exports.extend = extend;
    function merge(dest, src) {
        return extend(dest, src, true);
    }
    exports.merge = merge;
    function inherit(child, base, properties) {
        var baseP = base.prototype, childP;
        childP = child.prototype = Object.create(baseP);
        childP.constructor = child;
        childP._super = baseP;
        if (properties) {
            extend(childP, properties);
        }
    }
    exports.inherit = inherit;
    function bindFn(fn, context) {
        return function boundFn() {
            return fn.apply(context, arguments);
        };
    }
    exports.bindFn = bindFn;
    function ifUndefined(val1, val2) {
        return (val1 === undefined) ? val2 : val1;
    }
    exports.ifUndefined = ifUndefined;
    function addEventListeners(eventTarget, types, handler) {
        each(splitStr(types), function (type) {
            eventTarget.addEventListener(type, handler, false);
        });
    }
    exports.addEventListeners = addEventListeners;
    function removeEventListeners(eventTarget, types, handler) {
        each(splitStr(types), function (type) {
            eventTarget.removeEventListener(type, handler, false);
        });
    }
    exports.removeEventListeners = removeEventListeners;
    function hasParent(node, parent) {
        while (node) {
            if (node == parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
    exports.hasParent = hasParent;
    function inStr(str, find) {
        return str.indexOf(find) > -1;
    }
    exports.inStr = inStr;
    function splitStr(str) {
        return str.trim().split(/\s+/g);
    }
    exports.splitStr = splitStr;
    function inArray(src, find, findByKey) {
        if (src.indexOf && !findByKey) {
            return src.indexOf(find);
        }
        else {
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
    exports.inArray = inArray;
    function toArray(obj) {
        return Array.prototype.slice.call(obj, 0);
    }
    exports.toArray = toArray;
    function uniqueArray(src, key, sort) {
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
            }
            else {
                results = results.sort(function sortUniqueArray(a, b) {
                    return a[key] > b[key] ? 1 : 0;
                });
            }
        }
        return results;
    }
    exports.uniqueArray = uniqueArray;
    function prefixed(obj, property) {
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
    exports.prefixed = prefixed;
    var _uniqueId = 1;
    function uniqueId() {
        return _uniqueId++;
    }
    exports.uniqueId = uniqueId;
    function getWindowForElement(element) {
        var doc = element.ownerDocument;
        if (doc) {
            return doc.defaultView || window;
        }
        else {
            return window;
        }
    }
    exports.getWindowForElement = getWindowForElement;
});
