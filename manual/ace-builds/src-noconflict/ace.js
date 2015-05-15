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
 * Define a module along with a payload
 * @param module a name for the payload
 * @param payload a function to call with (require, exports, module) params
 */

(function() {

var ACE_NAMESPACE = "ace";

var global = (function() {
    return this;
})();


if (!ACE_NAMESPACE && typeof requirejs !== "undefined")
    return;


var _define = function(module, deps, payload) {
    if (typeof module !== 'string') {
        if (_define.original)
            _define.original.apply(window, arguments);
        else {
            console.error('dropping module because define wasn\'t a string.');
            console.trace();
        }
        return;
    }

    if (arguments.length == 2)
        payload = deps;

    if (!_define.modules) {
        _define.modules = {};
        _define.payloads = {};
    }
    
    _define.payloads[module] = payload;
    _define.modules[module] = null;
};

/**
 * Get at functionality ace.define()ed using the function above
 */
var _require = function(parentId, module, callback) {
    if (Object.prototype.toString.call(module) === "[object Array]") {
        var params = [];
        for (var i = 0, l = module.length; i < l; ++i) {
            var dep = lookup(parentId, module[i]);
            if (!dep && _require.original)
                return _require.original.apply(window, arguments);
            params.push(dep);
        }
        if (callback) {
            callback.apply(null, params);
        }
    }
    else if (typeof module === 'string') {
        var payload = lookup(parentId, module);
        if (!payload && _require.original)
            return _require.original.apply(window, arguments);

        if (callback) {
            callback();
        }

        return payload;
    }
    else {
        if (_require.original)
            return _require.original.apply(window, arguments);
    }
};

var normalizeModule = function(parentId, moduleName) {
    // normalize plugin requires
    if (moduleName.indexOf("!") !== -1) {
        var chunks = moduleName.split("!");
        return normalizeModule(parentId, chunks[0]) + "!" + normalizeModule(parentId, chunks[1]);
    }
    // normalize relative requires
    if (moduleName.charAt(0) == ".") {
        var base = parentId.split("/").slice(0, -1).join("/");
        moduleName = base + "/" + moduleName;

        while(moduleName.indexOf(".") !== -1 && previous != moduleName) {
            var previous = moduleName;
            moduleName = moduleName.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
    }

    return moduleName;
};

/**
 * Internal function to lookup moduleNames and resolve them by calling the
 * definition function if needed.
 */
var lookup = function(parentId, moduleName) {

    moduleName = normalizeModule(parentId, moduleName);

    var module = _define.modules[moduleName];
    if (!module) {
        module = _define.payloads[moduleName];
        if (typeof module === 'function') {
            var exports = {};
            var mod = {
                id: moduleName,
                uri: '',
                exports: exports,
                packaged: true
            };

            var req = function(module, callback) {
                return _require(moduleName, module, callback);
            };

            var returnValue = module(req, exports, mod);
            exports = returnValue || mod.exports;
            _define.modules[moduleName] = exports;
            delete _define.payloads[moduleName];
        }
        module = _define.modules[moduleName] = exports || module;
    }
    return module;
};

function exportAce(ns) {
    var require = function(module, callback) {
        return _require("", module, callback);
    };    

    var root = global;
    if (ns) {
        if (!global[ns])
            global[ns] = {};
        root = global[ns];
    }

    if (!root.define || !root.define.packaged) {
        _define.original = root.define;
        root.define = _define;
        root.define.packaged = true;
    }

    if (!root.require || !root.require.packaged) {
        _require.original = root.require;
        root.require = require;
        root.require.packaged = true;
    }
}

exportAce(ACE_NAMESPACE);

})();

ace.define("ace/lib/regexp",["require","exports","module"], function(require, exports, module) {
"use strict";

    var real = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },
        compliantExecNpcg = real.exec.call(/()??/, "")[1] === undefined, // check `exec` handling of nonparticipating capturing groups
        compliantLastIndexIncrement = function () {
            var x = /^/g;
            real.test.call(x, "");
            return !x.lastIndex;
        }();

    if (compliantLastIndexIncrement && compliantExecNpcg)
        return;
    RegExp.prototype.exec = function (str) {
        var match = real.exec.apply(this, arguments),
            name, r2;
        if ( typeof(str) == 'string' && match) {
            if (!compliantExecNpcg && match.length > 1 && indexOf(match, "") > -1) {
                r2 = RegExp(this.source, real.replace.call(getNativeFlags(this), "g", ""));
                real.replace.call(str.slice(match.index), r2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                        if (arguments[i] === undefined)
                            match[i] = undefined;
                    }
                });
            }
            if (this._xregexp && this._xregexp.captureNames) {
                for (var i = 1; i < match.length; i++) {
                    name = this._xregexp.captureNames[i - 1];
                    if (name)
                       match[name] = match[i];
                }
            }
            if (!compliantLastIndexIncrement && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
        }
        return match;
    };
    if (!compliantLastIndexIncrement) {
        RegExp.prototype.test = function (str) {
            var match = real.exec.call(this, str);
            if (match && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
            return !!match;
        };
    }

    function getNativeFlags (regex) {
        return (regex.global     ? "g" : "") +
               (regex.ignoreCase ? "i" : "") +
               (regex.multiline  ? "m" : "") +
               (regex.extended   ? "x" : "") + // Proposed for ES4; included in AS3
               (regex.sticky     ? "y" : "");
    }

    function indexOf (array, item, from) {
        if (Array.prototype.indexOf) // Use the native array method if available
            return array.indexOf(item, from);
        for (var i = from || 0; i < array.length; i++) {
            if (array[i] === item)
                return i;
        }
        return -1;
    }

});

ace.define("ace/lib/es5-shim",["require","exports","module"], function(require, exports, module) {

function Empty() {}

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        var target = this;
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        var args = slice.call(arguments, 1); // for normal call
        var bound = function () {

            if (this instanceof bound) {

                var result = target.apply(
                    this,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        if(target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }
        return bound;
    };
}
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}
if ([1,2].splice(0).length != 2) {
    if(function() { // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
            var a = new Array(l+2);
            a[0] = a[1] = 0;
            return a;
        }
        var array = [], lengthBefore;
        
        array.splice.apply(array, makeArray(20));
        array.splice.apply(array, makeArray(26));

        lengthBefore = array.length; //46
        array.splice(5, 0, "XXX"); // add one element

        lengthBefore + 1 == array.length

        if (lengthBefore + 1 == array.length) {
            return true;// has right splice implementation without bugs
        }
    }()) {//IE 6/7
        var array_splice = Array.prototype.splice;
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(slice.call(arguments, 2)))
            }
        };
    } else {//IE8
        Array.prototype.splice = function(pos, removeCount){
            var length = this.length;
            if (pos > 0) {
                if (pos > length)
                    pos = length;
            } else if (pos == void 0) {
                pos = 0;
            } else if (pos < 0) {
                pos = Math.max(length + pos, 0);
            }

            if (!(pos+removeCount < length))
                removeCount = length - pos;

            var removed = this.slice(pos, pos+removeCount);
            var insert = slice.call(arguments, 2);
            var add = insert.length;            
            if (pos === length) {
                if (add) {
                    this.push.apply(this, insert);
                }
            } else {
                var remove = Math.min(removeCount, length - pos);
                var tailOldPos = pos + remove;
                var tailNewPos = tailOldPos + add - remove;
                var tailCount = length - tailOldPos;
                var lengthAfterRemove = length - remove;

                if (tailNewPos < tailOldPos) { // case A
                    for (var i = 0; i < tailCount; ++i) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } else if (tailNewPos > tailOldPos) { // case B
                    for (i = tailCount; i--; ) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } // else, add == remove (nothing to do)

                if (add && pos === lengthAfterRemove) {
                    this.length = lengthAfterRemove; // truncate array
                    this.push.apply(this, insert);
                } else {
                    this.length = lengthAfterRemove + add; // reserves space
                    for (i = 0; i < add; ++i) {
                        this[pos+i] = insert[i];
                    }
                }
            }
            return removed;
        };
    }
}
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}
var boxedString = Object("a"),
    splitString = boxedString[0] != "a" || !(0 in boxedString);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                fun.call(thisp, self[i], i, object);
            }
        }
    };
}
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, object);
        }
        return result;
    };
}
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                    object,
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, object)) {
                return false;
            }
        }
        return true;
    };
}
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }
        if (!length && arguments.length == 1) {
            throw new TypeError("reduce of empty array with no initial value");
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }
                if (++i >= length) {
                    throw new TypeError("reduce of empty array with no initial value");
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        }

        return result;
    };
}
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }
        if (!length && arguments.length == 1) {
            throw new TypeError("reduceRight of empty array with no initial value");
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }
                if (--i < 0) {
                    throw new TypeError("reduceRight of empty array with no initial value");
                }
            } while (true);
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        } while (i--);

        return result;
    };
}
if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}
if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}
if (!Object.getPrototypeOf) {
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor ?
            object.constructor.prototype :
            prototypeOfObject
        );
    };
}
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        if (!owns(object, property))
            return;

        var descriptor, getter, setter;
        descriptor =  { enumerable: true, configurable: true };
        if (supportsAccessors) {
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;
                return descriptor;
            }
        }
        descriptor.value = object[property];
        return descriptor;
    };
}
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}
if (!Object.create) {
    var createEmpty;
    if (Object.prototype.__proto__ === null) {
        createEmpty = function () {
            return { "__proto__": null };
        };
    } else {
        createEmpty = function () {
            var empty = {};
            for (var i in empty)
                empty[i] = null;
            empty.constructor =
            empty.hasOwnProperty =
            empty.propertyIsEnumerable =
            empty.isPrototypeOf =
            empty.toLocaleString =
            empty.toString =
            empty.valueOf =
            empty.__proto__ = null;
            return empty;
        }
    }

    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = createEmpty();
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            object.__proto__ = prototype;
        }
        if (properties !== void 0)
            Object.defineProperties(object, properties);
        return object;
    };
}

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
    }
}
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
            }
        }
        if (owns(descriptor, "value")) {

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                delete object[property];
                object[property] = descriptor.value;
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}
if (!Object.seal) {
    Object.seal = function seal(object) {
        return object;
    };
}
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        return object;
    };
}
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        return object;
    };
}
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        if (Object(object) === object) {
            throw new TypeError(); // TODO message
        }
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}
if (!Object.keys) {
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if (
            (typeof object != "object" && typeof object != "function") ||
            object === null
        ) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

function toInteger(n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

function isPrimitive(input) {
    var type = typeof input;
    return (
        input === null ||
        type === "undefined" ||
        type === "boolean" ||
        type === "number" ||
        type === "string"
    );
}

function toPrimitive(input) {
    var val, valueOf, toString;
    if (isPrimitive(input)) {
        return input;
    }
    valueOf = input.valueOf;
    if (typeof valueOf === "function") {
        val = valueOf.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    toString = input.toString;
    if (typeof toString === "function") {
        val = toString.call(input);
        if (isPrimitive(val)) {
            return val;
        }
    }
    throw new TypeError();
}
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    return Object(o);
};

});

ace.define("ace/lib/fixoldbrowsers",["require","exports","module","ace/lib/regexp","ace/lib/es5-shim"], function(require, exports, module) {
"use strict";

require("./regexp");
require("./es5-shim");

});

ace.define("ace/lib/dom",["require","exports","module"], function(require, exports, module) {
"no use strict";
if (typeof document == "undefined") {
    return;
}

var XHTML_NS = "http://www.w3.org/1999/xhtml";

function getDocumentHead(doc) {
    if (!doc)
        doc = document;
    return (doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement);
}
exports.getDocumentHead = getDocumentHead;

function createElement(tagName, namespaceURI) {
    return document.createElementNS ? document.createElementNS(namespaceURI || XHTML_NS, tagName) : document.createElement(tagName);
}
exports.createElement = createElement;

function hasCssClass(el, name) {
    var classes = el.className.split(/\s+/g);
    return classes.indexOf(name) !== -1;
}
exports.hasCssClass = hasCssClass;
function addCssClass(el, name) {
    if (!exports.hasCssClass(el, name)) {
        el.className += " " + name;
    }
}
exports.addCssClass = addCssClass;
function removeCssClass(el, name) {
    var classes = el.className.split(/\s+/g);
    while (true) {
        var index = classes.indexOf(name);
        if (index == -1) {
            break;
        }
        classes.splice(index, 1);
    }
    el.className = classes.join(" ");
}
exports.removeCssClass = removeCssClass;

function toggleCssClass(el, name) {
    var classes = el.className.split(/\s+/g), add = true;
    while (true) {
        var index = classes.indexOf(name);
        if (index == -1) {
            break;
        }
        add = false;
        classes.splice(index, 1);
    }
    if (add)
        classes.push(name);

    el.className = classes.join(" ");
    return add;
}
exports.toggleCssClass = toggleCssClass;
function setCssClass(node, className, include) {
    if (include) {
        exports.addCssClass(node, className);
    } else {
        exports.removeCssClass(node, className);
    }
}
exports.setCssClass = setCssClass;

function hasCssString(id, doc) {
    var index = 0, sheets;
    doc = doc || document;

    if (doc.createStyleSheet && (sheets = doc.styleSheets)) {
        while (index < sheets.length)
            if (sheets[index++].owningElement.id === id)
                return true;
    } else if ((sheets = doc.getElementsByTagName("style"))) {
        while (index < sheets.length)
            if (sheets[index++].id === id)
                return true;
    }

    return false;
}
exports.hasCssString = hasCssString;

function importCssString(cssText, id, doc) {
    doc = doc || document;
    if (id && exports.hasCssString(id, doc)) {
        return;
    }

    var style;

    if (doc.createStyleSheet) {
        style = doc.createStyleSheet();
        style.cssText = cssText;
        if (id)
            style.owningElement.id = id;
    } else {
        style = doc.createElementNS ? doc.createElementNS(XHTML_NS, "style") : doc.createElement("style");

        style.appendChild(doc.createTextNode(cssText));
        if (id)
            style.id = id;

        exports.getDocumentHead(doc).appendChild(style);
    }
}
exports.importCssString = importCssString;

function importCssStylsheet(uri, doc) {
    if (doc.createStyleSheet) {
        doc.createStyleSheet(uri);
    } else {
        var link = exports.createElement('link');
        link['rel'] = 'stylesheet';
        link['href'] = uri;

        exports.getDocumentHead(doc).appendChild(link);
    }
}
exports.importCssStylsheet = importCssStylsheet;


function getInnerWidth(element) {
    return (parseInt(exports.computedStyle(element, "paddingLeft"), 10) + parseInt(exports.computedStyle(element, "paddingRight"), 10) + element.clientWidth);
}
exports.getInnerWidth = getInnerWidth;

function getInnerHeight(element) {
    return (parseInt(exports.computedStyle(element, "paddingTop"), 10) + parseInt(exports.computedStyle(element, "paddingBottom"), 10) + element.clientHeight);
}
exports.getInnerHeight = getInnerHeight;

if (window.pageYOffset !== undefined) {
    exports.getPageScrollTop = function () {
        return window.pageYOffset;
    };

    exports.getPageScrollLeft = function () {
        return window.pageXOffset;
    };
} else {
    exports.getPageScrollTop = function () {
        return document.body.scrollTop;
    };

    exports.getPageScrollLeft = function () {
        return document.body.scrollLeft;
    };
}

function makeComputedStyle() {
    if (window.getComputedStyle) {
        return function (element, style) {
            if (style) {
                return (window.getComputedStyle(element, "") || {})[style] || "";
            }
            return window.getComputedStyle(element, "") || {};
        };
    } else {
        return function (element, style) {
            if (style) {
                return element.currentStyle[style];
            }
            return element.currentStyle;
        };
    }
}

exports.computedStyle = makeComputedStyle();

if (window.getComputedStyle)
    exports.computedStyle = function (element, style) {
        if (style)
            return (window.getComputedStyle(element, "") || {})[style] || "";
        return window.getComputedStyle(element, "") || {};
    };
else
    exports.computedStyle = function (element, style) {
        if (style)
            return element.currentStyle[style];
        return element.currentStyle;
    };

function scrollbarWidth(document) {
    var inner = exports.createElement("ace_inner");
    inner.style.width = "100%";
    inner.style.minWidth = "0px";
    inner.style.height = "200px";
    inner.style.display = "block";

    var outer = exports.createElement("ace_outer");
    var style = outer.style;

    style.position = "absolute";
    style.left = "-10000px";
    style.overflow = "hidden";
    style.width = "200px";
    style.minWidth = "0px";
    style.height = "150px";
    style.display = "block";

    outer.appendChild(inner);

    var body = document.documentElement;
    body.appendChild(outer);

    var noScrollbar = inner.offsetWidth;

    style.overflow = "scroll";
    var withScrollbar = inner.offsetWidth;

    if (noScrollbar == withScrollbar) {
        withScrollbar = outer.clientWidth;
    }

    body.removeChild(outer);

    return noScrollbar - withScrollbar;
}
exports.scrollbarWidth = scrollbarWidth;
function setInnerHtml(el, innerHtml) {
    var element = el.cloneNode(false);
    element.innerHTML = innerHtml;
    el.parentNode.replaceChild(element, el);
    return element;
}
exports.setInnerHtml = setInnerHtml;

function makeGetInnerText() {
    if ("textContent" in document.documentElement) {
        return function (el) {
            return el.textContent;
        };
    } else {
        return function (el) {
            return el.innerText;
        };
    }
}

function makeSetInnerText() {
    if ("textContent" in document.documentElement) {
        return function (el, innerText) {
            el.textContent = innerText;
        };
    } else {
        return function (el, innerText) {
            el.innerText = innerText;
        };
    }
}

exports.getInnerText = makeGetInnerText();
exports.setInnerText = makeSetInnerText();

function getParentWindow(document) {
    return document.defaultView || document.parentWindow;
}
exports.getParentWindow = getParentWindow;
});

ace.define("ace/lib/oop",["require","exports","module"], function(require, exports, module) {
"no use strict";
function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}
exports.inherits = inherits;
function mixin(obj, base) {
    for (var key in base) {
        obj[key] = base[key];
    }
    return obj;
}
exports.mixin = mixin;
function implement(proto, base) {
    exports.mixin(proto, base);
}
exports.implement = implement;
});

ace.define("ace/lib/keys",["require","exports","module","ace/lib/oop"], function(require, exports, module) {
"no use strict";
var oop = require("./oop");
var Keys = {
    MODIFIER_KEYS: {
        16: 'Shift', 17: 'Ctrl', 18: 'Alt', 224: 'Meta'
    },
    KEY_MODS: {
        "ctrl": 1, "alt": 2, "option": 2, "shift": 4,
        "super": 8, "meta": 8, "command": 8, "cmd": 8
    },
    FUNCTION_KEYS: {
        8: "Backspace",
        9: "Tab",
        13: "Return",
        19: "Pause",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "Print",
        45: "Insert",
        46: "Delete",
        96: "Numpad0",
        97: "Numpad1",
        98: "Numpad2",
        99: "Numpad3",
        100: "Numpad4",
        101: "Numpad5",
        102: "Numpad6",
        103: "Numpad7",
        104: "Numpad8",
        105: "Numpad9",
        '-13': "NumpadEnter",
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "Numlock",
        145: "Scrolllock"
    },
    PRINTABLE_KEYS: {
        32: ' ', 48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5',
        54: '6', 55: '7', 56: '8', 57: '9', 59: ';', 61: '=', 65: 'a',
        66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h',
        73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n', 79: 'o',
        80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v',
        87: 'w', 88: 'x', 89: 'y', 90: 'z', 107: '+', 109: '-', 110: '.',
        187: '=', 188: ',', 189: '-', 190: '.', 191: '/', 192: '`', 219: '[',
        220: '\\', 221: ']', 222: '\''
    },
    enter: 13,
    esc: 27,
    escape: 27,
    del: 46
};
var name, i;
for (i in Keys.FUNCTION_KEYS) {
    name = Keys.FUNCTION_KEYS[i].toLowerCase();
    Keys[name] = parseInt(i, 10);
}

for (i in Keys.PRINTABLE_KEYS) {
    name = Keys.PRINTABLE_KEYS[i].toLowerCase();
    Keys[name] = parseInt(i, 10);
}
oop.mixin(Keys, Keys.MODIFIER_KEYS);
oop.mixin(Keys, Keys.PRINTABLE_KEYS);
oop.mixin(Keys, Keys.FUNCTION_KEYS);
Keys[173] = '-';

(function () {
    var mods = ["cmd", "ctrl", "alt", "shift"];
    for (var i = Math.pow(2, mods.length); i--;) {
        var f = function (s) {
            return i & Keys.KEY_MODS[s];
        };
        var filtrate = mods.filter(f);
        Keys.KEY_MODS[i] = mods.filter(f).join("-") + "-";
    }
})();

exports.FUNCTION_KEYS = Keys.FUNCTION_KEYS;
exports.PRINTABLE_KEYS = Keys.PRINTABLE_KEYS;
exports.MODIFIER_KEYS = Keys.MODIFIER_KEYS;
exports.KEY_MODS = Keys.KEY_MODS;
exports.enter = Keys["return"];
exports.escape = Keys.esc;
exports.del = Keys["delete"];

oop.mixin(exports, Keys);

function keyCodeToString(keyCode) {
    var keyString = Keys[keyCode];
    if (typeof keyString != "string")
        keyString = String.fromCharCode(keyCode);
    return keyString.toLowerCase();
}
exports.keyCodeToString = keyCodeToString;
});

"use strict";
ace.define("ace/lib/useragent",["require","exports","module"], function(require, exports, module) {
"no use strict";
exports.OS = {
    LINUX: "LINUX",
    MAC: "MAC",
    WINDOWS: "WINDOWS"
};
function getOS() {
    if (exports.isMac) {
        return exports.OS.MAC;
    } else if (exports.isLinux) {
        return exports.OS.LINUX;
    } else {
        return exports.OS.WINDOWS;
    }
}
exports.getOS = getOS;
if (typeof navigator != "object")
    return;

var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
var ua = navigator.userAgent;
exports.isWin = (os == "win");
exports.isMac = (os == "mac");
exports.isLinux = (os == "linux");
exports.isIE = (navigator.appName == "Microsoft Internet Explorer" || navigator.appName.indexOf("MSAppHost") >= 0) ? parseFloat((ua.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]) : parseFloat((ua.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]);

exports.isOldIE = exports.isIE && exports.isIE < 9;
exports.isGecko = (('Controllers' in window) || ('controllers' in window)) && window.navigator.product === "Gecko";
exports.isMozilla = exports.isGecko;
exports.isOldGecko = exports.isGecko && parseInt((ua.match(/rv\:(\d+)/) || [])[1], 10) < 4;
exports.isOpera = ('opera' in window) && Object.prototype.toString.call(window['opera']) == "[object Opera]";
exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

exports.isChrome = parseFloat(ua.split(" Chrome/")[1]) || undefined;

exports.isAIR = ua.indexOf("AdobeAIR") >= 0;

exports.isIPad = ua.indexOf("iPad") >= 0;

exports.isTouchPad = ua.indexOf("TouchPad") >= 0;

exports.isChromeOS = ua.indexOf(" CrOS ") >= 0;
});

ace.define("ace/lib/event",["require","exports","module","ace/lib/keys","ace/lib/useragent"], function(require, exports, module) {
"no use strict";
var keys = require("./keys");
var useragent = require("./useragent");

function addListener(target, type, callback, useCapture) {
    if (target.addEventListener) {
        return target.addEventListener(type, callback, false);
    }
    if (target.attachEvent) {
        var wrapper = function () {
            callback.call(target, window.event);
        };
        callback._wrapper = wrapper;
        target.attachEvent("on" + type, wrapper);
    }
}
exports.addListener = addListener;

function removeListener(target, type, callback, useCapture) {
    if (target.removeEventListener) {
        return target.removeEventListener(type, callback, false);
    }
    if (target.detachEvent) {
        target.detachEvent("on" + type, callback._wrapper || callback);
    }
}
exports.removeListener = removeListener;
function stopEvent(e) {
    exports.stopPropagation(e);
    exports.preventDefault(e);
    return false;
}
exports.stopEvent = stopEvent;

function stopPropagation(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}
exports.stopPropagation = stopPropagation;

function preventDefault(e) {
    var RETURN_VALUE_DEPRECATED = 'returnValue';
    if (e.preventDefault) {
        e.preventDefault();
    } else if (e[RETURN_VALUE_DEPRECATED]) {
        e[RETURN_VALUE_DEPRECATED] = false;
    }
}
exports.preventDefault = preventDefault;
function getButton(e) {
    if (e.type == "dblclick")
        return 0;
    if (e.type == "contextmenu" || (useragent.isMac && (e.ctrlKey && !e.altKey && !e.shiftKey)))
        return 2;
    if (e.preventDefault) {
        return e.button;
    } else {
        return { 1: 0, 2: 2, 4: 1 }[e.button];
    }
}
exports.getButton = getButton;
function capture(unused, acquireCaptureHandler, releaseCaptureHandler) {
    var element = document;

    function releaseMouse(e) {
        acquireCaptureHandler && acquireCaptureHandler(e);

        releaseCaptureHandler && releaseCaptureHandler(e);

        exports.removeListener(element, "mousemove", acquireCaptureHandler, true);
        exports.removeListener(element, "mouseup", releaseMouse, true);
        exports.removeListener(element, "dragstart", releaseMouse, true);
    }

    exports.addListener(element, "mousemove", acquireCaptureHandler, true);
    exports.addListener(element, "mouseup", releaseMouse, true);
    exports.addListener(element, "dragstart", releaseMouse, true);

    return releaseMouse;
}
exports.capture = capture;
function addMouseWheelListener(element, callback) {
    if ("onmousewheel" in element) {
        exports.addListener(element, "mousewheel", function (e) {
            var factor = 8;
            if (e['wheelDeltaX'] !== undefined) {
                e['wheelX'] = -e['wheelDeltaX'] / factor;
                e['wheelY'] = -e['wheelDeltaY'] / factor;
            } else {
                e['wheelX'] = 0;
                e['wheelY'] = -e.wheelDelta / factor;
            }
            callback(e);
        });
    } else if ("onwheel" in element) {
        exports.addListener(element, "wheel", function (e) {
            var factor = 0.35;
            switch (e.deltaMode) {
                case e.DOM_DELTA_PIXEL:
                    e.wheelX = e.deltaX * factor || 0;
                    e.wheelY = e.deltaY * factor || 0;
                    break;
                case e.DOM_DELTA_LINE:
                case e.DOM_DELTA_PAGE:
                    e.wheelX = (e.deltaX || 0) * 5;
                    e.wheelY = (e.deltaY || 0) * 5;
                    break;
            }
            callback(e);
        });
    } else {
        exports.addListener(element, "DOMMouseScroll", function (e) {
            if (e.axis && e.axis == e.HORIZONTAL_AXIS) {
                e.wheelX = (e.detail || 0) * 5;
                e.wheelY = 0;
            } else {
                e.wheelX = 0;
                e.wheelY = (e.detail || 0) * 5;
            }
            callback(e);
        });
    }
}
exports.addMouseWheelListener = addMouseWheelListener;

function addMultiMouseDownListener(el, timeouts, eventHandler, callbackName) {
    var clicks = 0;
    var startX, startY, timer;
    var eventNames = {
        2: "dblclick",
        3: "tripleclick",
        4: "quadclick"
    };

    exports.addListener(el, "mousedown", function (e) {
        if (exports.getButton(e) !== 0) {
            clicks = 0;
        } else if (e.detail > 1) {
            clicks++;
            if (clicks > 4)
                clicks = 1;
        } else {
            clicks = 1;
        }
        if (useragent.isIE) {
            var isNewClick = Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5;
            if (!timer || isNewClick)
                clicks = 1;
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(function () {
                timer = null;
            }, timeouts[clicks - 1] || 600);

            if (clicks == 1) {
                startX = e.clientX;
                startY = e.clientY;
            }
        }
        e['_clicks'] = clicks;

        eventHandler[callbackName]("mousedown", e);

        if (clicks > 4)
            clicks = 0;
        else if (clicks > 1)
            return eventHandler[callbackName](eventNames[clicks], e);
    });

    if (useragent.isOldIE) {
        exports.addListener(el, "dblclick", function (e) {
            clicks = 2;
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(function () {
                timer = null;
            }, timeouts[clicks - 1] || 600);
            eventHandler[callbackName]("mousedown", e);
            eventHandler[callbackName](eventNames[clicks], e);
        });
    }
}
exports.addMultiMouseDownListener = addMultiMouseDownListener;

var getModifierHash = useragent.isMac && useragent.isOpera && !("KeyboardEvent" in window) ? function (e) {
    return 0 | (e.metaKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.ctrlKey ? 8 : 0);
} : function (e) {
    return 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
};

function getModifierString(e) {
    return keys.KEY_MODS[getModifierHash(e)];
}
exports.getModifierString = getModifierString;

function normalizeCommandKeys(callback, e, keyCode) {
    var hashId = getModifierHash(e);

    if (!useragent.isMac && pressedKeys) {
        if (pressedKeys[91] || pressedKeys[92])
            hashId |= 8;
        if (pressedKeys.altGr) {
            if ((3 & hashId) != 3)
                pressedKeys.altGr = 0;
            else
                return;
        }
        if (keyCode === 18 || keyCode === 17) {
            if (keyCode === 17 && e.location === 1) {
                ts = e.timeStamp;
            } else if (keyCode === 18 && hashId === 3 && e.location === 2) {
                var dt = -ts;
                ts = e.timeStamp;
                dt += ts;
                if (dt < 3)
                    pressedKeys.altGr = true;
            }
        }
    }

    if (keyCode in keys.MODIFIER_KEYS) {
        switch (keys.MODIFIER_KEYS[keyCode]) {
            case "Alt":
                hashId = 2;
                break;
            case "Shift":
                hashId = 4;
                break;
            case "Ctrl":
                hashId = 1;
                break;
            default:
                hashId = 8;
                break;
        }
        keyCode = -1;
    }

    if (hashId & 8 && (keyCode === 91 || keyCode === 93)) {
        keyCode = -1;
    }

    if (!hashId && keyCode === 13) {
        if (e.location === 3) {
            callback(e, hashId, -keyCode);
            if (e.defaultPrevented)
                return;
        }
    }

    if (useragent.isChromeOS && hashId & 8) {
        callback(e, hashId, keyCode);
        if (e.defaultPrevented)
            return;
        else
            hashId &= ~8;
    }
    if (!hashId && !(keyCode in keys.FUNCTION_KEYS) && !(keyCode in keys.PRINTABLE_KEYS)) {
        return false;
    }

    return callback(e, hashId, keyCode);
}

var pressedKeys = null;

function resetPressedKeys(e) {
    pressedKeys = Object.create(null);
}

var ts = 0;
function addCommandKeyListener(el, callback) {
    if (useragent.isOldGecko || (useragent.isOpera && !("KeyboardEvent" in window))) {
        var lastKeyDownKeyCode = null;
        exports.addListener(el, "keydown", function (e) {
            lastKeyDownKeyCode = e.keyCode;
        });
        exports.addListener(el, "keypress", function (e) {
            return normalizeCommandKeys(callback, e, lastKeyDownKeyCode);
        });
    } else {
        var lastDefaultPrevented = null;

        exports.addListener(el, "keydown", function (e) {
            pressedKeys[e.keyCode] = true;
            var result = normalizeCommandKeys(callback, e, e.keyCode);
            lastDefaultPrevented = e.defaultPrevented;
            return result;
        });

        exports.addListener(el, 'keypress', function (e) {
            if (lastDefaultPrevented && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
                exports.stopEvent(e);
                lastDefaultPrevented = null;
            }
        });

        exports.addListener(el, 'keyup', function (e) {
            pressedKeys[e.keyCode] = null;
        });

        if (!pressedKeys) {
            pressedKeys = Object.create(null);
            exports.addListener(window, 'focus', resetPressedKeys);
        }
    }
}
exports.addCommandKeyListener = addCommandKeyListener;

if (window.postMessage && !useragent.isOldIE) {
    var postMessageId = 1;
    exports.nextTick = function (callback, win) {
        win = win || window;
        var messageName = "zero-timeout-message-" + postMessageId;
        exports.addListener(win, "message", function listener(e) {
            if (e.data == messageName) {
                exports.stopPropagation(e);
                exports.removeListener(win, "message", listener);
                callback();
            }
        });
        win.postMessage(messageName, "*");
    };
}

var nextFrameCandidate = window.requestAnimationFrame || window['mozRequestAnimationFrame'] || window['webkitRequestAnimationFrame'] || window.msRequestAnimationFrame || window['oRequestAnimationFrame'];

if (nextFrameCandidate) {
    nextFrameCandidate = nextFrameCandidate.bind(window);
} else {
    nextFrameCandidate = function (callback) {
        setTimeout(callback, 17);
    };
}
exports.requestAnimationFrame = nextFrameCandidate;
});

ace.define("ace/keyboard/hash_handler",["require","exports","module","ace/lib/keys","ace/lib/useragent"], function(require, exports, module) {
"no use strict";
var keyUtil = require("../lib/keys");
var useragent = require("../lib/useragent");

var HashHandler = (function () {
    function HashHandler(config, platform) {
        this.platform = platform || (useragent.isMac ? "mac" : "win");
        this.commands = {};
        this.commandKeyBinding = {};

        this.addCommands(config);
    }
    HashHandler.prototype.addCommand = function (command) {
        if (this.commands[command.name])
            this.removeCommand(command);

        this.commands[command.name] = command;

        if (command.bindKey)
            this._buildKeyHash(command);
    };

    HashHandler.prototype.removeCommand = function (command) {
        var name = (typeof command === 'string' ? command : command.name);
        command = this.commands[name];
        delete this.commands[name];
        var ckb = this.commandKeyBinding;
        for (var hashId in ckb) {
            for (var key in ckb[hashId]) {
                if (ckb[hashId][key] == command)
                    delete ckb[hashId][key];
            }
        }
    };

    HashHandler.prototype.bindKey = function (key, command) {
        if (!key)
            return;
        if (typeof command === "function") {
            this.addCommand({ exec: command, bindKey: key, name: command.name || key });
            return;
        }

        var ckb = this.commandKeyBinding;
        key.split("|").forEach(function (keyPart) {
            var binding = this.parseKeys(keyPart, command);
            var hashId = binding.hashId;
            (ckb[hashId] || (ckb[hashId] = {}))[binding.key] = command;
        }, this);
    };

    HashHandler.prototype.addCommands = function (commands) {
        commands && Object.keys(commands).forEach(function (name) {
            var command = commands[name];
            if (!command) {
                return;
            }

            if (typeof command === "string") {
                return this.bindKey(command, name);
            }

            if (typeof command === "function") {
                command = { exec: command };
            }

            if (typeof command !== "object") {
                return;
            }

            if (!command.name)
                command.name = name;

            this.addCommand(command);
        }, this);
    };

    HashHandler.prototype.removeCommands = function (commands) {
        Object.keys(commands).forEach(function (name) {
            this.removeCommand(commands[name]);
        }, this);
    };

    HashHandler.prototype.bindKeys = function (keyList) {
        Object.keys(keyList).forEach(function (key) {
            this.bindKey(key, keyList[key]);
        }, this);
    };

    HashHandler.prototype._buildKeyHash = function (command) {
        var binding = command.bindKey;
        if (!binding)
            return;

        var key = typeof binding == "string" ? binding : binding[this.platform];
        this.bindKey(key, command);
    };
    HashHandler.prototype.parseKeys = function (keys) {
        if (keys.indexOf(" ") != -1)
            keys = keys.split(/\s+/).pop();

        var parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function (x) {
            return x;
        });
        var key = parts.pop();

        var keyCode = keyUtil[key];
        if (keyUtil.FUNCTION_KEYS[keyCode])
            key = keyUtil.FUNCTION_KEYS[keyCode].toLowerCase();
        else if (!parts.length)
            return { key: key, hashId: -1 };
        else if (parts.length == 1 && parts[0] == "shift")
            return { key: key.toUpperCase(), hashId: -1 };

        var hashId = 0;
        for (var i = parts.length; i--;) {
            var modifier = keyUtil.KEY_MODS[parts[i]];
            if (modifier === null) {
                if (typeof console != "undefined")
                    console.error("invalid modifier " + parts[i] + " in " + keys);
                return false;
            }
            hashId |= modifier;
        }
        return { key: key, hashId: hashId };
    };

    HashHandler.prototype.findKeyCommand = function (hashId, keyString) {
        var ckbr = this.commandKeyBinding;
        return ckbr[hashId] && ckbr[hashId][keyString];
    };

    HashHandler.prototype.handleKeyboard = function (data, hashId, keyString, keyCode) {
        var response = {
            command: this.findKeyCommand(hashId, keyString)
        };
        return response;
    };
    return HashHandler;
})();
exports.HashHandler = HashHandler;
});

ace.define("ace/lib/event_emitter",["require","exports","module"], function(require, exports, module) {
"no use strict";
var stopPropagation = function () {
    this.propagationStopped = true;
};
var preventDefault = function () {
    this.defaultPrevented = true;
};
var EventEmitterClass = (function () {
    function EventEmitterClass() {
    }
    EventEmitterClass.prototype._dispatchEvent = function (eventName, e) {
        this._eventRegistry || (this._eventRegistry = {});
        this._defaultHandlers || (this._defaultHandlers = {});

        var listeners = this._eventRegistry[eventName] || [];
        var defaultHandler = this._defaultHandlers[eventName];
        if (!listeners.length && !defaultHandler)
            return;

        if (typeof e != "object" || !e)
            e = {};

        if (!e.type)
            e.type = eventName;
        if (!e.stopPropagation)
            e.stopPropagation = stopPropagation;
        if (!e.preventDefault)
            e.preventDefault = preventDefault;

        listeners = listeners.slice();
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](e, this);
            if (e.propagationStopped)
                break;
        }

        if (defaultHandler && !e.defaultPrevented)
            return defaultHandler(e, this);
    };
    EventEmitterClass.prototype._emit = function (eventName, e) {
        return this._dispatchEvent(eventName, e);
    };
    EventEmitterClass.prototype._signal = function (eventName, e) {
        var listeners = (this._eventRegistry || {})[eventName];
        if (!listeners)
            return;
        listeners = listeners.slice();
        for (var i = 0; i < listeners.length; i++)
            listeners[i](e, this);
    };

    EventEmitterClass.prototype.once = function (eventName, callback) {
        var _self = this;
        callback && this.addEventListener(eventName, function newCallback() {
            _self.removeEventListener(eventName, newCallback);
            callback.apply(null, arguments);
        });
    };

    EventEmitterClass.prototype.setDefaultHandler = function (eventName, callback) {
        var handlers = this._defaultHandlers;
        if (!handlers)
            handlers = this._defaultHandlers = { _disabled_: {} };

        if (handlers[eventName]) {
            var old = handlers[eventName];
            var disabled = handlers._disabled_[eventName];
            if (!disabled)
                handlers._disabled_[eventName] = disabled = [];
            disabled.push(old);
            var i = disabled.indexOf(callback);
            if (i != -1)
                disabled.splice(i, 1);
        }
        handlers[eventName] = callback;
    };

    EventEmitterClass.prototype.removeDefaultHandler = function (eventName, callback) {
        var handlers = this._defaultHandlers;
        if (!handlers)
            return;
        var disabled = handlers._disabled_[eventName];

        if (handlers[eventName] == callback) {
            var old = handlers[eventName];
            if (disabled)
                this.setDefaultHandler(eventName, disabled.pop());
        } else if (disabled) {
            var i = disabled.indexOf(callback);
            if (i != -1)
                disabled.splice(i, 1);
        }
    };

    EventEmitterClass.prototype.addEventListener = function (eventName, callback, capturing) {
        this._eventRegistry = this._eventRegistry || {};

        var listeners = this._eventRegistry[eventName];
        if (!listeners)
            listeners = this._eventRegistry[eventName] = [];

        if (listeners.indexOf(callback) == -1)
            listeners[capturing ? "unshift" : "push"](callback);
        return callback;
    };

    EventEmitterClass.prototype.on = function (eventName, callback, capturing) {
        return this.addEventListener(eventName, callback, capturing);
    };

    EventEmitterClass.prototype.removeEventListener = function (eventName, callback) {
        this._eventRegistry = this._eventRegistry || {};

        var listeners = this._eventRegistry[eventName];
        if (!listeners)
            return;

        var index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };

    EventEmitterClass.prototype.removeListener = function (eventName, callback) {
        return this.removeEventListener(eventName, callback);
    };

    EventEmitterClass.prototype.off = function (eventName, callback) {
        return this.removeEventListener(eventName, callback);
    };

    EventEmitterClass.prototype.removeAllListeners = function (eventName) {
        if (this._eventRegistry)
            this._eventRegistry[eventName] = [];
    };
    return EventEmitterClass;
})();
exports.EventEmitterClass = EventEmitterClass;
exports.EventEmitter = new EventEmitterClass();
});

ace.define("ace/mode/typescript/AutoCompleteView",["require","exports","module","ace/keyboard/hash_handler"], function(require, exports, module) {
"no use strict";

var hhm = require('../../keyboard/hash_handler');

var CLASSNAME = 'ace_autocomplete';
var CLASSNAME_SELECTED = 'ace_autocomplete_selected';

var AutoCompleteView = (function () {
    function AutoCompleteView(editor, autoComplete) {
        this.handler = new hhm.HashHandler();
        if (typeof editor === 'undefined') {
            throw new Error('editor must be defined');
        }
        if (typeof autoComplete === 'undefined') {
            throw new Error('autoComplete must be defined');
        }
        this.editor = editor;
        this.autoComplete = autoComplete;
        this.selectedClassName = CLASSNAME_SELECTED;
        this.wrap = document.createElement('div');
        this.listElement = document.createElement('ul');
        this.wrap.className = CLASSNAME;
        this.wrap.appendChild(this.listElement);

        this.editor.container.appendChild(this.wrap);

        this.wrap.style.display = 'none';
        this.listElement.style.listStyleType = 'none';
        this.wrap.style.position = 'fixed';
        this.wrap.style.zIndex = '1000';
    }
    AutoCompleteView.prototype.show = function (coords) {
        this.setPosition(coords);
        return this.wrap.style.display = 'block';
    };
    AutoCompleteView.prototype.hide = function () {
        return this.wrap.style.display = 'none';
    };
    AutoCompleteView.prototype.setPosition = function (coords) {
        var bottom, editorBottom, top;
        top = coords.pageY + 20;
        editorBottom = $(this.editor.container).offset().top + $(this.editor.container).height();
        bottom = top + $(this.wrap).height();
        if (bottom < editorBottom) {
            this.wrap.style.top = top + 'px';
            return this.wrap.style.left = coords.pageX + 'px';
        } else {
            this.wrap.style.top = (top - $(this.wrap).height() - 20) + 'px';
            return this.wrap.style.left = coords.pageX + 'px';
        }
    };
    AutoCompleteView.prototype.current = function () {
        var child, children, i;
        children = this.listElement.childNodes;
        for (i in children) {
            child = children[i];
            if (child.className === this.selectedClassName) {
                return child;
            }
        }
        return null;
    };
    AutoCompleteView.prototype.focusNext = function () {
        var curr, focus;
        curr = this.current();
        focus = curr.nextSibling;
        if (focus) {
            curr.className = '';
            focus.className = this.selectedClassName;
            return this.adjustPosition();
        }
    };
    AutoCompleteView.prototype.focusPrev = function () {
        var curr, focus;
        curr = this.current();
        focus = curr.previousSibling;
        if (focus) {
            curr.className = '';
            focus.className = this.selectedClassName;
            return this.adjustPosition();
        }
    };
    AutoCompleteView.prototype.ensureFocus = function () {
        if (!this.current()) {
            if (this.listElement.firstChild) {
                var firstChild = this.listElement.firstChild;
                firstChild.className = this.selectedClassName;
                return this.adjustPosition();
            }
        }
    };
    AutoCompleteView.prototype.adjustPosition = function () {
        var elm, elmOuterHeight, newMargin, pos, preMargin, wrapHeight;
        elm = this.current();
        if (elm) {
            newMargin = '';
            wrapHeight = $(this.wrap).height();
            elmOuterHeight = $(elm).outerHeight();
            preMargin = parseInt($(this.listElement).css("margin-top").replace('px', ''), 10);
            pos = $(elm).position();
            if (pos.top >= (wrapHeight - elmOuterHeight)) {
                newMargin = (preMargin - elmOuterHeight) + 'px';
                $(this.listElement).css("margin-top", newMargin);
            }
            if (pos.top < 0) {
                newMargin = (-pos.top + preMargin) + 'px';
                return $(this.listElement).css("margin-top", newMargin);
            }
        }
    };
    return AutoCompleteView;
})();
    return AutoCompleteView;
});

ace.define("ace/mode/typescript/autoComplete",["require","exports","module","ace/keyboard/hash_handler","ace/lib/event_emitter","ace/mode/typescript/AutoCompleteView"], function(require, exports, module) {
"no use strict";
var hhm = require('../../keyboard/hash_handler');

var eve = require('../../lib/event_emitter');

var AutoCompleteView = require('../../mode/typescript/AutoCompleteView');
function makeCompareFn(text) {
    return function (a, b) {
        var matchFunc = function (entry) {
            return entry.name.indexOf(text) === 0 ? 1 : 0;
        };
        var matchCompare = function () {
            return matchFunc(b) - matchFunc(a);
        };
        var textCompare = function () {
            if (a.name === b.name) {
                return 0;
            } else {
                return (a.name > b.name) ? 1 : -1;
            }
        };
        var ret = matchCompare();
        return (ret !== 0) ? ret : textCompare();
    };
}
var autoComplete = function (editor, fileNameProvider, completionService) {
    var AutoComplete = function () {
    };
    var that = new AutoComplete();
    that.isActive = isActive;
    that.activate = activate;
    that.deactivate = deactivate;
    var _eventEmitter = new eve.EventEmitterClass();
    var _active = false;
    var _handler = new hhm.HashHandler();
    var _view = new AutoCompleteView(editor, that);
    var _inputText = '';

    _handler.attach = function () {
        editor.addEventListener("change", onEditorChange);

        _eventEmitter._emit("attach", { 'sender': that });
        _active = true;
    };

    _handler.detach = function () {
        editor.removeEventListener("change", onEditorChange);
        _view.hide();
        _eventEmitter._emit("detach", { 'sender': that });
        _active = false;
    };

    _handler.handleKeyboard = function (data, hashId, key, keyCode) {
        if (hashId == -1) {
            if (" -=,[]_/()!';:<>".indexOf(key) != -1) {
                deactivate();
            }
            return null;
        }

        var command = _handler.findKeyCommand(hashId, key);

        if (!command) {
            var defaultCommand = editor.commands.findKeyCommand(hashId, key);
            if (defaultCommand) {
                if (defaultCommand.name == "backspace") {
                    return null;
                }
                deactivate();
            }
            return null;
        }

        if (typeof command !== "string") {
            var args = command.args;
            command = command.command;
        }

        if (typeof command === "string") {
            command = this.commands[command];
        }

        return { 'command': command, 'args': args };
    };

    _handler.bindKeys({ "Up|Ctrl-p": "moveprev", "Down|Ctrl-n": "movenext", "esc|Ctrl-g": "cancel", "Return|Tab": "insert" });

    _handler.addCommands({
        movenext: function (editor) {
            _view.focusNext();
        },
        moveprev: function (editor) {
            _view.focusPrev();
        },
        cancel: function (editor) {
            deactivate();
        },
        insert: function (editor) {
            editor.removeEventListener("change", onEditorChange);

            for (var i = 0; i < _inputText.length; i++) {
                editor.remove("left");
            }
            var curr = _view.current();
            if (curr) {
                editor.insert($(curr).data("name"));
            }
            deactivate();
        }
    });

    function isActive() {
        return _active;
    }
    function activateUsingCursor(cursor) {
        completionService.getCompletionsAtCursor(fileNameProvider(), cursor, function (err, completionInfo) {
            if (!err) {
                var text = completionService.matchText;

                _inputText = text;

                var completions = completionInfo ? completionInfo.entries : null;

                if (completions && _inputText.length > 0) {
                    completions = completions.filter(function (elm) {
                        return elm.name.toLowerCase().indexOf(_inputText.toLowerCase()) === 0;
                    });
                }

                completions = completions ? completions.sort(makeCompareFn(_inputText)) : completions;

                showCompletions(completions);

                var count = completions ? completions.length : 0;
                if (count > 0) {
                    editor.keyBinding.addKeyboardHandler(_handler);
                }
            }
            function showCompletions(infos) {
                if (infos && infos.length > 0) {
                    editor.container.appendChild(_view.wrap);
                    var html = '';
                    for (var n in infos) {
                        var info = infos[n];
                        var name = '<span class="label-name">' + info.name + '</span>';
                        var kind = '<span class="label-kind label-kind-' + info.kind + '">' + info.kind.charAt(0) + '</span>';

                        html += '<li data-name="' + info.name + '">' + kind + name + '</li>';
                    }
                    var coords = editor.renderer.textToScreenCoordinates(cursor.row, cursor.column - text.length);
                    var lineHeight = 9;
                    var topdownOnly = false;
                    _view.show(coords);
                    _view.listElement.innerHTML = html;
                    _view.ensureFocus();
                } else {
                    _view.hide();
                }
            }
        });
    }
    function onEditorChange(event) {
        var cursor = editor.getCursorPosition();
        if (event.data.action == "insertText") {
            activateUsingCursor({ row: cursor.row, column: cursor.column + 1 });
        } else if (event.data.action == "removeText") {
            if (event.data.text == '\n') {
                deactivate();
            } else {
                activateUsingCursor(cursor);
            }
        } else {
            activateUsingCursor(cursor);
        }
    }

    function activate() {
        activateUsingCursor(editor.getCursorPosition());
    }

    function deactivate() {
        editor.keyBinding.removeKeyboardHandler(_handler);
    }

    return that;
};
    return autoComplete;
});

ace.define("ace/mode/typescript/EditorPosition",["require","exports","module"], function(require, exports, module) {
"no use strict";
var EditorPosition = (function () {
    function EditorPosition(editor) {
        this.editor = editor;
    }
    EditorPosition.prototype.getPositionChars = function (pos) {
        var doc = this.editor.getSession().getDocument();
        return this.getChars(doc, pos);
    };
    EditorPosition.prototype.getPositionFromChars = function (chars) {
        var doc = this.editor.getSession().getDocument();
        return this.getPosition(doc, chars);
    };
    EditorPosition.prototype.getCurrentPositionChars = function () {
        return this.getPositionChars(this.editor.getCursorPosition());
    };
    EditorPosition.prototype.getCurrentLeftChar = function () {
        return this.getPositionLeftChar(this.editor.getCursorPosition());
    };
    EditorPosition.prototype.getTextAtCursorPosition = function (cursor) {
        var range;
        range = {
            start: {
                row: cursor.row,
                column: cursor.column
            },
            end: {
                row: cursor.row,
                column: cursor.column + 1
            }
        };
        return this.editor.getSession().getDocument().getTextRange(range);
    };
    EditorPosition.prototype.getPositionLeftChar = function (cursor) {
        var range;
        range = {
            start: {
                row: cursor.row,
                column: cursor.column
            },
            end: {
                row: cursor.row,
                column: cursor.column - 1
            }
        };
        return this.editor.getSession().getDocument().getTextRange(range);
    };
    EditorPosition.prototype.getLinesChars = function (lines) {
        var count = 0;
        lines.forEach(function (line) {
            return count += line.length + 1;
        });
        return count;
    };

    EditorPosition.prototype.getChars = function (doc, pos) {
        return this.getLinesChars(doc.getLines(0, pos.row - 1)) + pos.column;
    };

    EditorPosition.prototype.getPosition = function (doc, chars) {
        var i;
        var line;
        var lines = doc.getAllLines();
        var count = 0;
        var row = 0;

        for (i in lines) {
            line = lines[i];
            if (chars < (count + (line.length + 1))) {
                return {
                    row: row,
                    column: chars - count
                };
            }
            count += line.length + 1;
            row += 1;
        }
        return {
            row: row,
            column: chars - count
        };
    };
    return EditorPosition;
})();
    return EditorPosition;
});

ace.define("ace/mode/typescript/CompletionService",["require","exports","module","ace/mode/typescript/EditorPosition"], function(require, exports, module) {
"no use strict";
var EditorPosition = require('./EditorPosition');

var CompletionService = (function () {
    function CompletionService(editor, workspace) {
        this._editor = editor;
        this._workspace = workspace;
        this._editorPos = new EditorPosition(editor);
    }
    CompletionService.prototype._getCompletionsAtPosition = function (fileName, position, memberMode, callback) {
        if (typeof this._workspace !== 'undefined') {
            var args = { 'fileName': fileName, 'position': position, 'memberMode': memberMode };
            this._workspace.getCompletionsAtPosition(fileName, position, memberMode, callback);
        } else {
            callback(new Error("Completions are not available at this time."));
        }
    };
    CompletionService.prototype.getCompletionsAtCursor = function (fileName, cursor, callback) {
        var position = this._editorPos.getPositionChars(cursor);
        var memberMode = false;

        var text = this._editor.session.getLine(cursor.row).slice(0, cursor.column);
        var matches = text.match(/\.([a-zA-Z_0-9\$]*$)/);
        if (matches && matches.length > 0) {
            this.matchText = matches[1];
            memberMode = true;
            position -= this.matchText.length;
        } else {
            matches = text.match(/[a-zA-Z_0-9\$]*$/);
            this.matchText = matches[0];
            memberMode = false;
        }
        this._getCompletionsAtPosition(fileName, position, memberMode, callback);
    };
    return CompletionService;
})();
    return CompletionService;
});

ace.define("ace/mode/typescript/DocumentPositionUtil",["require","exports","module"], function(require, exports, module) {
"no use strict";
function getLinesChars(lines) {
    var count = 0;
    lines.forEach(function (line) {
        count += line.length + 1;
        return;
    });
    return count;
}
exports.getLinesChars = getLinesChars;

function getChars(doc, pos) {
    return exports.getLinesChars(doc.getLines(0, pos.row - 1)) + pos.column;
}
exports.getChars = getChars;
;

function getPosition(doc, chars) {
    var i;
    var line;

    var lines = doc.getAllLines();
    var count = 0;
    var row = 0;

    for (i in lines) {
        line = lines[i];
        if (chars < (count + (line.length + 1))) {
            return { 'row': row, 'column': chars - count };
        }
        count += line.length + 1;
        row += 1;
    }
    return { 'row': row, 'column': chars - count };
}
exports.getPosition = getPosition;
;
});

ace.define("ace/lib/async",["require","exports","module"], function(require, exports, module) {
"no use strict";
function only_once(fn) {
    var called = false;
    return function () {
        if (called)
            throw new Error("Callback was already called.");
        called = true;
        fn.apply(this, arguments);
    };
}
var _toString = Object.prototype.toString;

var _isArray = Array.isArray || function (obj) {
    return _toString.call(obj) === '[object Array]';
};

var _each = function (arr, iterator) {
    if (arr.forEach) {
        return arr.forEach(iterator);
    }
    for (var i = 0; i < arr.length; i += 1) {
        iterator(arr[i], i, arr);
    }
};

var _map = function (arr, iterator) {
    if (arr.map) {
        return arr.map(iterator);
    }
    var results = [];
    _each(arr, function (x, i, a) {
        results.push(iterator(x, i, a));
    });
    return results;
};

var _reduce = function (arr, iterator, memo) {
    if (arr.reduce) {
        return arr.reduce(iterator, memo);
    }
    _each(arr, function (x, i, a) {
        memo = iterator(memo, x, i, a);
    });
    return memo;
};

var _keys = function (obj) {
    if (Object.keys) {
        return Object.keys(obj);
    }
    var keys = [];
    for (var k in obj) {
        if (obj.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys;
};
function nextTick(callback) {
    throw new Error("nextTick not implemented");
}
exports.nextTick = nextTick;

function setImmediate(callback) {
    throw new Error("setImmediate not implemented");
}
exports.setImmediate = setImmediate;
function each(arr, iterator, callback) {
    callback = callback || function () {
    };
    if (!arr.length) {
        return callback();
    }
    var completed = 0;
    _each(arr, function (x) {
        iterator(x, only_once(done));
    });
    function done(err) {
        if (err) {
            callback(err);
            callback = function () {
            };
        } else {
            completed += 1;
            if (completed >= arr.length) {
                callback();
            }
        }
    }
}
exports.each = each;
exports.forEach = exports.each;

function eachSeries(arr, iterator, callback) {
    callback = callback || function () {
    };
    if (!arr.length) {
        return callback();
    }
    var completed = 0;
    var iterate = function () {
        iterator(arr[completed], function (err) {
            if (err) {
                callback(err);
                callback = function () {
                };
            } else {
                completed += 1;
                if (completed >= arr.length) {
                    callback();
                } else {
                    iterate();
                }
            }
        });
    };
    iterate();
}
exports.eachSeries = eachSeries;
exports.forEachSeries = exports.eachSeries;

function eachLimit(arr, limit, iterator, callback) {
    var fn = _eachLimit(limit);
    fn.apply(null, [arr, iterator, callback]);
}
exports.eachLimit = eachLimit;
exports.forEachLimit = exports.eachLimit;

var _eachLimit = function (limit) {
    return function (arr, iterator, callback) {
        callback = callback || function () {
        };
        if (!arr.length || limit <= 0) {
            return callback();
        }
        var completed = 0;
        var started = 0;
        var running = 0;

        (function replenish() {
            if (completed >= arr.length) {
                return callback();
            }

            while (running < limit && started < arr.length) {
                started += 1;
                running += 1;
                iterator(arr[started - 1], function (err) {
                    if (err) {
                        callback(err);
                        callback = function () {
                        };
                    } else {
                        completed += 1;
                        running -= 1;
                        if (completed >= arr.length) {
                            callback();
                        } else {
                            replenish();
                        }
                    }
                });
            }
        })();
    };
};

var doParallel = function (fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return fn.apply(null, [exports.each].concat(args));
    };
};
var doParallelLimit = function (limit, fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return fn.apply(null, [_eachLimit(limit)].concat(args));
    };
};
var doSeries = function (fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return fn.apply(null, [exports.eachSeries].concat(args));
    };
};

var _asyncMap = function (eachfn, arr, iterator, callback) {
    arr = _map(arr, function (x, i) {
        return { index: i, value: x };
    });
    if (!callback) {
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err) {
                callback(err);
            });
        });
    } else {
        var results = [];
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }
};
exports.map = doParallel(_asyncMap);
exports.mapSeries = doSeries(_asyncMap);
function mapLimit(arr, limit, iterator, callback) {
    return _mapLimit(limit)(arr, iterator, callback);
}
exports.mapLimit = mapLimit;

var _mapLimit = function (limit) {
    return doParallelLimit(limit, _asyncMap);
};
function reduce(arr, memo, iterator, callback) {
    exports.eachSeries(arr, function (x, callback) {
        iterator(memo, x, function (err, v) {
            memo = v;
            callback(err);
        });
    }, function (err) {
        callback(err, memo);
    });
}
exports.reduce = reduce;
exports.inject = exports.reduce;
exports.foldl = exports.reduce;

function reduceRight(arr, memo, iterator, callback) {
    var reversed = _map(arr, function (x) {
        return x;
    }).reverse();
    exports.reduce(reversed, memo, iterator, callback);
}
exports.reduceRight = reduceRight;
exports.foldr = exports.reduceRight;

var _filter = function (eachfn, arr, iterator, callback) {
    var results = [];
    arr = _map(arr, function (x, i) {
        return { index: i, value: x };
    });
    eachfn(arr, function (x, callback) {
        iterator(x.value, function (v) {
            if (v) {
                results.push(x);
            }
            callback();
        });
    }, function (err) {
        callback(_map(results.sort(function (a, b) {
            return a.index - b.index;
        }), function (x) {
            return x.value;
        }));
    });
};
exports.filter = doParallel(_filter);
exports.filterSeries = doSeries(_filter);
exports.select = exports.filter;
exports.selectSeries = exports.filterSeries;

var _reject = function (eachfn, arr, iterator, callback) {
    var results = [];
    arr = _map(arr, function (x, i) {
        return { index: i, value: x };
    });
    eachfn(arr, function (x, callback) {
        iterator(x.value, function (v) {
            if (!v) {
                results.push(x);
            }
            callback();
        });
    }, function (err) {
        callback(_map(results.sort(function (a, b) {
            return a.index - b.index;
        }), function (x) {
            return x.value;
        }));
    });
};
exports.reject = doParallel(_reject);
exports.rejectSeries = doSeries(_reject);

var _detect = function (eachfn, arr, iterator, main_callback) {
    eachfn(arr, function (x, callback) {
        iterator(x, function (result) {
            if (result) {
                main_callback(x);
                main_callback = function () {
                };
            } else {
                callback();
            }
        });
    }, function (err) {
        main_callback();
    });
};
exports.detect = doParallel(_detect);
exports.detectSeries = doSeries(_detect);

function some(arr, iterator, main_callback) {
    exports.each(arr, function (x, callback) {
        iterator(x, function (v) {
            if (v) {
                main_callback(true);
                main_callback = function () {
                };
            }
            callback();
        });
    }, function (err) {
        main_callback(false);
    });
}
exports.some = some;
exports.any = exports.some;

function every(arr, iterator, main_callback) {
    exports.each(arr, function (x, callback) {
        iterator(x, function (v) {
            if (!v) {
                main_callback(false);
                main_callback = function () {
                };
            }
            callback();
        });
    }, function (err) {
        main_callback(true);
    });
}
exports.every = every;
exports.all = exports.every;

function sortBy(arr, iterator, callback) {
    exports.map(arr, function (x, callback) {
        iterator(x, function (err, criteria) {
            if (err) {
                callback(err);
            } else {
                callback(null, { value: x, criteria: criteria });
            }
        });
    }, function (err, results) {
        if (err) {
            return callback(err);
        } else {
            var fn = function (left, right) {
                var a = left.criteria, b = right.criteria;
                return a < b ? -1 : a > b ? 1 : 0;
            };
            callback(null, _map(results.sort(fn), function (x) {
                return x.value;
            }));
        }
    });
}
exports.sortBy = sortBy;

function auto(tasks, callback) {
    callback = callback || function () {
    };
    var keys = _keys(tasks);
    var remainingTasks = keys.length;
    if (!remainingTasks) {
        return callback();
    }

    var results = {};

    var listeners = [];
    var addListener = function (fn) {
        listeners.unshift(fn);
    };
    var removeListener = function (fn) {
        for (var i = 0; i < listeners.length; i += 1) {
            if (listeners[i] === fn) {
                listeners.splice(i, 1);
                return;
            }
        }
    };
    var taskComplete = function () {
        remainingTasks--;
        _each(listeners.slice(0), function (fn) {
            fn();
        });
    };

    addListener(function () {
        if (!remainingTasks) {
            var theCallback = callback;
            callback = function () {
            };

            theCallback(null, results);
        }
    });

    _each(keys, function (k) {
        var task = _isArray(tasks[k]) ? tasks[k] : [tasks[k]];
        var taskCallback = function (err) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (args.length <= 1) {
                args = args[0];
            }
            if (err) {
                var safeResults = {};
                _each(_keys(results), function (rkey) {
                    safeResults[rkey] = results[rkey];
                });
                safeResults[k] = args;
                callback(err, safeResults);
                callback = function () {
                };
            } else {
                results[k] = args;
                exports.setImmediate(taskComplete);
            }
        };
        var requires = task.slice(0, Math.abs(task.length - 1)) || [];
        var ready = function () {
            return _reduce(requires, function (a, x) {
                return (a && results.hasOwnProperty(x));
            }, true) && !results.hasOwnProperty(k);
        };
        if (ready()) {
            task[task.length - 1](taskCallback, results);
        } else {
            var listener = function () {
                if (ready()) {
                    removeListener(listener);
                    task[task.length - 1](taskCallback, results);
                }
            };
            addListener(listener);
        }
    });
}
exports.auto = auto;

function retry(times, task, callback) {
    var DEFAULT_TIMES = 5;
    var attempts = [];
    if (typeof times === 'function') {
        callback = task;
        task = times;
        times = DEFAULT_TIMES;
    }
    times = parseInt(times, 10) || DEFAULT_TIMES;
    var wrappedTask = function (wrappedCallback, wrappedResults) {
        var retryAttempt = function (task, finalAttempt) {
            return function (seriesCallback) {
                task(function (err, result) {
                    seriesCallback(!err || finalAttempt, { err: err, result: result });
                }, wrappedResults);
            };
        };
        while (times) {
            attempts.push(retryAttempt(task, !(times -= 1)));
        }
        exports.series(attempts, function (done, data) {
            data = data[data.length - 1];
            (wrappedCallback || callback)(data.err, data.result);
        });
    };
    return callback ? wrappedTask() : wrappedTask;
}
exports.retry = retry;

function waterfall(tasks, callback) {
    callback = callback || function () {
    };
    if (!_isArray(tasks)) {
        var err = new Error('First argument to waterfall must be an array of functions');
        return callback(err);
    }
    if (!tasks.length) {
        return callback();
    }
    var wrapIterator = function (iterator) {
        return function (err) {
            if (err) {
                callback.apply(null, arguments);
                callback = function () {
                };
            } else {
                var args = Array.prototype.slice.call(arguments, 1);
                var next = iterator.next();
                if (next) {
                    args.push(wrapIterator(next));
                } else {
                    args.push(callback);
                }
                exports.setImmediate(function () {
                    iterator.apply(null, args);
                });
            }
        };
    };
    wrapIterator(exports.iterator(tasks))();
}
exports.waterfall = waterfall;

var _parallel = function (eachfn, tasks, callback) {
    callback = callback || function () {
    };
    if (_isArray(tasks)) {
        eachfn.map(tasks, function (fn, callback) {
            if (fn) {
                fn(function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    callback.call(null, err, args);
                });
            }
        }, callback);
    } else {
        var results = {};
        eachfn.each(_keys(tasks), function (k, callback) {
            tasks[k](function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                results[k] = args;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }
};

function parallel(tasks, callback) {
    _parallel({ map: exports.map, each: exports.each }, tasks, callback);
}
exports.parallel = parallel;

function parallelLimit(tasks, limit, callback) {
    _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
}
exports.parallelLimit = parallelLimit;

function series(tasks, callback) {
    callback = callback || function () {
    };
    if (_isArray(tasks)) {
        exports.mapSeries(tasks, function (fn, callback) {
            if (fn) {
                fn(function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    callback.call(null, err, args);
                });
            }
        }, callback);
    } else {
        var results = {};
        exports.eachSeries(_keys(tasks), function (k, callback) {
            tasks[k](function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                results[k] = args;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }
}
exports.series = series;

function iterator(tasks) {
    var makeCallback = function (index) {
        var fn = function () {
            if (tasks.length) {
                tasks[index].apply(null, arguments);
            }
            return fn.next();
        };
        fn.next = function () {
            return (index < tasks.length - 1) ? makeCallback(index + 1) : null;
        };
        return fn;
    };
    return makeCallback(0);
}
exports.iterator = iterator;

function apply(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        return fn.apply(null, args.concat(Array.prototype.slice.call(arguments)));
    };
}
exports.apply = apply;

var _concat = function (eachfn, arr, fn, callback) {
    var r = [];
    eachfn(arr, function (x, cb) {
        fn(x, function (err, y) {
            r = r.concat(y || []);
            cb(err);
        });
    }, function (err) {
        callback(err, r);
    });
};
exports.concat = doParallel(_concat);
exports.concatSeries = doSeries(_concat);

function whilst(test, iterator, callback) {
    if (test()) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            exports.whilst(test, iterator, callback);
        });
    } else {
        callback();
    }
}
exports.whilst = whilst;

function doWhilst(iterator, test, callback) {
    iterator(function (err) {
        if (err) {
            return callback(err);
        }
        var args = Array.prototype.slice.call(arguments, 1);
        if (test.apply(null, args)) {
            exports.doWhilst(iterator, test, callback);
        } else {
            callback();
        }
    });
}
exports.doWhilst = doWhilst;

function until(test, iterator, callback) {
    if (!test()) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            exports.until(test, iterator, callback);
        });
    } else {
        callback();
    }
}
exports.until = until;

function doUntil(iterator, test, callback) {
    iterator(function (err) {
        if (err) {
            return callback(err);
        }
        var args = Array.prototype.slice.call(arguments, 1);
        if (!test.apply(null, args)) {
            exports.doUntil(iterator, test, callback);
        } else {
            callback();
        }
    });
}
exports.doUntil = doUntil;

function queue(worker, concurrency) {
    if (concurrency === undefined) {
        concurrency = 1;
    }
    function _insert(q, data, pos, callback) {
        if (!q.started) {
            q.started = true;
        }
        if (!_isArray(data)) {
            data = [data];
        }
        if (data.length == 0) {
            return exports.setImmediate(function () {
                if (q.drain) {
                    q.drain();
                }
            });
        }
        _each(data, function (task) {
            var item = {
                data: task,
                callback: typeof callback === 'function' ? callback : null
            };

            if (pos) {
                q.tasks.unshift(item);
            } else {
                q.tasks.push(item);
            }

            if (q.saturated && q.tasks.length === q.concurrency) {
                q.saturated();
            }
            exports.setImmediate(q.process);
        });
    }

    var workers = 0;
    var q = {
        tasks: [],
        concurrency: concurrency,
        saturated: null,
        empty: null,
        drain: null,
        started: false,
        paused: false,
        push: function (data, callback) {
            _insert(q, data, false, callback);
        },
        kill: function () {
            q.drain = null;
            q.tasks = [];
        },
        unshift: function (data, callback) {
            _insert(q, data, true, callback);
        },
        process: function () {
            if (!q.paused && workers < q.concurrency && q.tasks.length) {
                var task = q.tasks.shift();
                if (q.empty && q.tasks.length === 0) {
                    q.empty();
                }
                workers += 1;
                var next = function () {
                    workers -= 1;
                    if (task.callback) {
                        task.callback.apply(task, arguments);
                    }
                    if (q.drain && q.tasks.length + workers === 0) {
                        q.drain();
                    }
                    q.process();
                };
                var cb = only_once(next);
                worker(task.data, cb);
            }
        },
        length: function () {
            return q.tasks.length;
        },
        running: function () {
            return workers;
        },
        idle: function () {
            return q.tasks.length + workers === 0;
        },
        pause: function () {
            if (q.paused === true) {
                return;
            }
            q.paused = true;
            q.process();
        },
        resume: function () {
            if (q.paused === false) {
                return;
            }
            q.paused = false;
            q.process();
        }
    };
    return q;
}
exports.queue = queue;

function priorityQueue(worker, concurrency) {
    function _compareTasks(a, b) {
        return a.priority - b.priority;
    }
    ;

    function _binarySearch(sequence, item, compare) {
        var beg = -1, end = sequence.length - 1;
        while (beg < end) {
            var mid = beg + ((end - beg + 1) >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
                beg = mid;
            } else {
                end = mid - 1;
            }
        }
        return beg;
    }

    function _insert(q, data, priority, callback) {
        if (!q.started) {
            q.started = true;
        }
        if (!_isArray(data)) {
            data = [data];
        }
        if (data.length == 0) {
            return exports.setImmediate(function () {
                if (q.drain) {
                    q.drain();
                }
            });
        }
        _each(data, function (task) {
            var item = {
                data: task,
                priority: priority,
                callback: typeof callback === 'function' ? callback : null
            };

            q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

            if (q.saturated && q.tasks.length === q.concurrency) {
                q.saturated();
            }
            exports.setImmediate(q.process);
        });
    }
    var q = exports.queue(worker, concurrency);
    q.push = function (data, priority, callback) {
        _insert(q, data, priority, callback);
    };
    delete q.unshift;

    return q;
}
exports.priorityQueue = priorityQueue;

function cargo(worker, payload) {
    var working = false, tasks = [];

    var cargo = {
        tasks: tasks,
        payload: payload,
        saturated: null,
        empty: null,
        drain: null,
        drained: true,
        push: function (data, callback) {
            if (!_isArray(data)) {
                data = [data];
            }
            _each(data, function (task) {
                tasks.push({
                    data: task,
                    callback: typeof callback === 'function' ? callback : null
                });
                cargo.drained = false;
                if (cargo.saturated && tasks.length === payload) {
                    cargo.saturated();
                }
            });
            exports.setImmediate(cargo.process);
        },
        process: function process() {
            if (working)
                return;
            if (tasks.length === 0) {
                if (cargo.drain && !cargo.drained)
                    cargo.drain();
                cargo.drained = true;
                return;
            }

            var ts = typeof payload === 'number' ? tasks.splice(0, payload) : tasks.splice(0, tasks.length);

            var ds = _map(ts, function (task) {
                return task.data;
            });

            if (cargo.empty)
                cargo.empty();
            working = true;
            worker(ds, function () {
                working = false;

                var args = arguments;
                _each(ts, function (data) {
                    if (data.callback) {
                        data.callback.apply(null, args);
                    }
                });

                process();
            });
        },
        length: function () {
            return tasks.length;
        },
        running: function () {
            return working;
        }
    };
    return cargo;
}
exports.cargo = cargo;

var _console_fn = function (name) {
    return function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    } else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
    };
};
exports.log = _console_fn('log');
exports.dir = _console_fn('dir');
function memoize(fn, hasher) {
    var memo = {};
    var queues = {};
    hasher = hasher || function (x) {
        return x;
    };
    var memoized = function () {
        var args = Array.prototype.slice.call(arguments);
        var callback = args.pop();
        var key = hasher.apply(null, args);
        if (key in memo) {
            exports.nextTick(function () {
                callback.apply(null, memo[key]);
            });
        } else if (key in queues) {
            queues[key].push(callback);
        } else {
            queues[key] = [callback];
            fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, arguments);
                    }
                }]));
        }
    };
    memoized.memo = memo;
    memoized.unmemoized = fn;
    return memoized;
}
exports.memoize = memoize;

function unmemoize(fn) {
    return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
    };
}
exports.unmemoize = unmemoize;

function times(count, iterator, callback) {
    var counter = [];
    for (var i = 0; i < count; i++) {
        counter.push(i);
    }
    return exports.map(counter, iterator, callback);
}
exports.times = times;

function timesSeries(count, iterator, callback) {
    var counter = [];
    for (var i = 0; i < count; i++) {
        counter.push(i);
    }
    return exports.mapSeries(counter, iterator, callback);
}
exports.timesSeries = timesSeries;

function seq( /* functions... */ ) {
    var fns = arguments;
    return function () {
        var that = this;
        var args = Array.prototype.slice.call(arguments);
        var callback = args.pop();
        exports.reduce(fns, args, function (newargs, fn, cb) {
            fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]));
        }, function (err, results) {
            callback.apply(that, [err].concat(results));
        });
    };
}
exports.seq = seq;

function compose( /* functions... */ ) {
    return exports.seq.apply(null, Array.prototype.reverse.call(arguments));
}
exports.compose = compose;

var _applyEach = function (eachfn, fns /*args...*/ ) {
    var go = function () {
        var that = this;
        var args = Array.prototype.slice.call(arguments);
        var callback = args.pop();
        return eachfn(fns, function (fn, cb) {
            fn.apply(that, args.concat([cb]));
        }, callback);
    };
    if (arguments.length > 2) {
        var args = Array.prototype.slice.call(arguments, 2);
        return go.apply(this, args);
    } else {
        return go;
    }
};
exports.applyEach = doParallel(_applyEach);
exports.applyEachSeries = doSeries(_applyEach);

function forever(fn, callback) {
    function next(err) {
        if (err) {
            if (callback) {
                return callback(err);
            }
            throw err;
        }
        fn(next);
    }
    next();
}
exports.forever = forever;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/range",["require","exports","module"], function(require, exports, module) {
"no use strict";
var comparePoints = function (p1, p2) {
    return p1.row - p2.row || p1.column - p2.column;
};
var Range = (function () {
    function Range(startRow, startColumn, endRow, endColumn) {
        this.start = {
            row: startRow,
            column: startColumn
        };

        this.end = {
            row: endRow,
            column: endColumn
        };
    }
    Range.prototype.isEqual = function (range) {
        return this.start.row === range.start.row && this.end.row === range.end.row && this.start.column === range.start.column && this.end.column === range.end.column;
    };
    Range.prototype.toString = function () {
        return ("Range: [" + this.start.row + "/" + this.start.column + "] -> [" + this.end.row + "/" + this.end.column + "]");
    };
    Range.prototype.contains = function (row, column) {
        return this.compare(row, column) === 0;
    };
    Range.prototype.compareRange = function (range) {
        var cmp, end = range.end, start = range.start;

        cmp = this.compare(end.row, end.column);
        if (cmp == 1) {
            cmp = this.compare(start.row, start.column);
            if (cmp == 1) {
                return 2;
            } else if (cmp === 0) {
                return 1;
            } else {
                return 0;
            }
        } else if (cmp == -1) {
            return -2;
        } else {
            cmp = this.compare(start.row, start.column);
            if (cmp == -1) {
                return -1;
            } else if (cmp == 1) {
                return 42;
            } else {
                return 0;
            }
        }
    };
    Range.prototype.comparePoint = function (p) {
        return this.compare(p.row, p.column);
    };
    Range.prototype.containsRange = function (range) {
        return this.comparePoint(range.start) === 0 && this.comparePoint(range.end) === 0;
    };
    Range.prototype.intersects = function (range) {
        var cmp = this.compareRange(range);
        return (cmp === -1 || cmp === 0 || cmp === 1);
    };
    Range.prototype.isEnd = function (row, column) {
        return this.end.row == row && this.end.column == column;
    };
    Range.prototype.isStart = function (row, column) {
        return this.start.row == row && this.start.column == column;
    };
    Range.prototype.setStart = function (row, column) {
        if (typeof row == "object") {
            this.start.column = row.column;
            this.start.row = row.row;
        } else {
            this.start.row = row;
            this.start.column = column;
        }
    };
    Range.prototype.setEnd = function (row, column) {
        if (typeof row == "object") {
            this.end.column = row.column;
            this.end.row = row.row;
        } else {
            this.end.row = row;
            this.end.column = column;
        }
    };
    Range.prototype.inside = function (row, column) {
        if (this.compare(row, column) === 0) {
            if (this.isEnd(row, column) || this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    Range.prototype.insideStart = function (row, column) {
        if (this.compare(row, column) === 0) {
            if (this.isEnd(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    Range.prototype.insideEnd = function (row, column) {
        if (this.compare(row, column) === 0) {
            if (this.isStart(row, column)) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };
    Range.prototype.compare = function (row, column) {
        if (!this.isMultiLine()) {
            if (row === this.start.row) {
                return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
            }
        }

        if (row < this.start.row)
            return -1;

        if (row > this.end.row)
            return 1;

        if (this.start.row === row)
            return column >= this.start.column ? 0 : -1;

        if (this.end.row === row)
            return column <= this.end.column ? 0 : 1;

        return 0;
    };
    Range.prototype.compareStart = function (row, column) {
        if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    };
    Range.prototype.compareEnd = function (row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else {
            return this.compare(row, column);
        }
    };
    Range.prototype.compareInside = function (row, column) {
        if (this.end.row == row && this.end.column == column) {
            return 1;
        } else if (this.start.row == row && this.start.column == column) {
            return -1;
        } else {
            return this.compare(row, column);
        }
    };
    Range.prototype.clipRows = function (firstRow, lastRow) {
        var start;
        var end;
        if (this.end.row > lastRow)
            end = { row: lastRow + 1, column: 0 };
        else if (this.end.row < firstRow)
            end = { row: firstRow, column: 0 };

        if (this.start.row > lastRow)
            start = { row: lastRow + 1, column: 0 };
        else if (this.start.row < firstRow)
            start = { row: firstRow, column: 0 };

        return Range.fromPoints(start || this.start, end || this.end);
    };
    Range.prototype.extend = function (row, column) {
        var cmp = this.compare(row, column);

        if (cmp === 0)
            return this;
        else if (cmp == -1)
            var start = { row: row, column: column };
        else
            var end = { row: row, column: column };

        return Range.fromPoints(start || this.start, end || this.end);
    };

    Range.prototype.isEmpty = function () {
        return (this.start.row === this.end.row && this.start.column === this.end.column);
    };
    Range.prototype.isMultiLine = function () {
        return (this.start.row !== this.end.row);
    };
    Range.prototype.clone = function () {
        return Range.fromPoints(this.start, this.end);
    };
    Range.prototype.collapseRows = function () {
        if (this.end.column === 0)
            return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
        else
            return new Range(this.start.row, 0, this.end.row, 0);
    };
    Range.prototype.toScreenRange = function (session) {
        var screenPosStart = session.documentToScreenPosition(this.start.row, this.start.column);
        var screenPosEnd = session.documentToScreenPosition(this.end.row, this.end.column);

        return new Range(screenPosStart.row, screenPosStart.column, screenPosEnd.row, screenPosEnd.column);
    };
    Range.prototype.moveBy = function (row, column) {
        this.start.row += row;
        this.start.column += column;
        this.end.row += row;
        this.end.column += column;
    };
    Range.fromPoints = function (start, end) {
        return new Range(start.row, start.column, end.row, end.column);
    };

    Range.comparePoints = function (p1, p2) {
        return p1.row - p2.row || p1.column - p2.column;
    };
    return Range;
})();
exports.Range = Range;

var OrientedRange = (function (_super) {
    __extends(OrientedRange, _super);
    function OrientedRange(startRow, startColumn, endRow, endColumn, cursor, desiredColumn) {
        _super.call(this, startRow, startColumn, endRow, endColumn);
        this.cursor = cursor;
        this.desiredColumn = desiredColumn;
    }
    return OrientedRange;
})(Range);
exports.OrientedRange = OrientedRange;
});

ace.define("ace/lib/lang",["require","exports","module"], function(require, exports, module) {
"no use strict";
function last(a) {
    return a[a.length - 1];
}
exports.last = last;

function stringReverse(s) {
    return s.split("").reverse().join("");
}
exports.stringReverse = stringReverse;

function stringRepeat(s, count) {
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
exports.stringRepeat = stringRepeat;

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

function stringTrimLeft(s) {
    return s.replace(trimBeginRegexp, '');
}
exports.stringTrimLeft = stringTrimLeft;
;

function stringTrimRight(s) {
    return s.replace(trimEndRegexp, '');
}
exports.stringTrimRight = stringTrimRight;

function copyObject(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
}
exports.copyObject = copyObject;

function copyArray(array) {
    var copy = [];
    for (var i = 0, l = array.length; i < l; i++) {
        if (array[i] && typeof array[i] == "object")
            copy[i] = this.copyObject(array[i]);
        else
            copy[i] = array[i];
    }
    return copy;
}
exports.copyArray = copyArray;

function deepCopy(obj) {
    if (typeof obj !== "object" || !obj)
        return obj;
    var cons = obj.constructor;
    if (cons === RegExp)
        return obj;

    var copy = cons();
    for (var key in obj) {
        if (typeof obj[key] === "object") {
            copy[key] = exports.deepCopy(obj[key]);
        } else {
            copy[key] = obj[key];
        }
    }
    return copy;
}
exports.deepCopy = deepCopy;

function arrayToMap(arr) {
    var map = {};
    for (var i = 0; i < arr.length; i++) {
        map[arr[i]] = 1;
    }
    return map;
}
exports.arrayToMap = arrayToMap;

function createMap(props) {
    var map = Object.create(null);
    for (var i in props) {
        map[i] = props[i];
    }
    return map;
}
exports.createMap = createMap;
function arrayRemove(array, value) {
    for (var i = 0; i <= array.length; i++) {
        if (value === array[i]) {
            array.splice(i, 1);
        }
    }
}
exports.arrayRemove = arrayRemove;

function escapeRegExp(str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
}
exports.escapeRegExp = escapeRegExp;

function escapeHTML(str) {
    return str.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
}
exports.escapeHTML = escapeHTML;
;
function getMatchOffsets(s, searchValue) {
    var matches = [];

    s.replace(searchValue, function (str) {
        matches.push({
            offset: arguments[arguments.length - 2],
            length: str.length
        });
        return "lang.getMatchOffsets";
    });

    return matches;
}
exports.getMatchOffsets = getMatchOffsets;
;
function deferredCall(fcn) {
    var timer = null;
    var callback = function () {
        timer = null;
        fcn();
    };

    var deferred = function (timeout) {
        deferred.cancel();
        timer = setTimeout(callback, timeout || 0);
        return deferred;
    };

    deferred.schedule = deferred;

    deferred.call = function () {
        this.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function () {
        clearTimeout(timer);
        timer = null;
        return deferred;
    };

    deferred.isPending = function () {
        return timer;
    };

    return deferred;
}
exports.deferredCall = deferredCall;
;

function delayedCall(fcn, defaultTimeout) {
    var timer = null;

    var callback = function () {
        timer = null;
        fcn();
    };

    var _self = function (timeout) {
        if (timer == null)
            timer = setTimeout(callback, timeout || defaultTimeout);
    };

    _self.delay = function (timeout) {
        timer && clearTimeout(timer);
        timer = setTimeout(callback, timeout || defaultTimeout);
    };
    _self.schedule = _self;

    _self.call = function () {
        this.cancel();
        fcn();
    };

    _self.cancel = function () {
        timer && clearTimeout(timer);
        timer = null;
    };

    _self.isPending = function () {
        return timer;
    };

    return _self;
}
exports.delayedCall = delayedCall;
;
});

ace.define("ace/tooltip",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"no use strict";
var dom = require("./lib/dom");
var Tooltip = (function () {
    function Tooltip(parentElement) {
        this.isOpen = false;
        this.$element = null;
        this.$parentElement = parentElement;
    }
    Tooltip.prototype.$init = function () {
        this.$element = dom.createElement('div');
        this.$element.className = "ace_tooltip";
        this.$element.style.display = "none";
        this.$parentElement.appendChild(this.$element);
        return this.$element;
    };
    Tooltip.prototype.getElement = function () {
        return this.$element || this.$init();
    };
    Tooltip.prototype.setText = function (text) {
        dom.setInnerText(this.getElement(), text);
    };
    Tooltip.prototype.setHtml = function (html) {
        this.getElement().innerHTML = html;
    };
    Tooltip.prototype.setPosition = function (left, top) {
        var style = this.getElement().style;
        style.left = left + "px";
        style.top = top + "px";
    };
    Tooltip.prototype.setClassName = function (className) {
        dom.addCssClass(this.getElement(), className);
    };
    Tooltip.prototype.show = function (text, left, top) {
        if (text != null)
            this.setText(text);
        if (left != null && top != null)
            this.setPosition(left, top);
        if (!this.isOpen) {
            this.getElement().style.display = 'block';
            this.isOpen = true;
        }
    };
    Tooltip.prototype.hide = function () {
        if (this.isOpen) {
            this.getElement().style.display = 'none';
            this.isOpen = false;
        }
    };
    Tooltip.prototype.getHeight = function () {
        return this.getElement().offsetHeight;
    };
    Tooltip.prototype.getWidth = function () {
        return this.getElement().offsetWidth;
    };
    return Tooltip;
})();
exports.Tooltip = Tooltip;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/typeInfoTip",["require","exports","module","ace/tooltip"], function(require, exports, module) {
"no use strict";
var ttm = require('./tooltip');
var TypeInfoTooltip = (function (_super) {
    __extends(TypeInfoTooltip, _super);
    function TypeInfoTooltip(parentElement) {
        _super.call(this, parentElement);
    }
    return TypeInfoTooltip;
})(ttm.Tooltip);

var typeInfoTip = function (doc, editor, workspace, fileNameProvider, rootElement) {
    var _tooltip = new TypeInfoTooltip(editor.container);

    var _mouseMoveTimer;

    function _onMouseMove(event) {
        _tooltip.hide();
        clearTimeout(_mouseMoveTimer);
        var elem = event.srcElement;
        if (elem['className'] === 'ace_content') {
            _mouseMoveTimer = setTimeout(function () {
                showInfo();
            }, 800);
        }
        function showInfo() {
            function getDocumentPositionFromScreenOffset(x, y) {
                var r = editor.renderer;
                var offset = (x - r.$padding) / r.characterWidth;
                var correction = r.scrollTop ? 7 : 0;

                var row = Math.floor((y + r.scrollTop - correction) / r.lineHeight);
                var col = Math.round(offset);
                return editor.getSession().screenToDocumentPosition(row, col);
            }
            var documentPosition = getDocumentPositionFromScreenOffset(event.offsetX, event.offsetY);
            var fileName = fileNameProvider();
            if (workspace && typeof fileName === 'string') {
                workspace.getTypeAtDocumentPosition(fileName, documentPosition, function (err, results) {
                    if (!err) {
                        if (results) {
                            _tooltip.show(tipString(), event.x, event.y + 10);
                        } else {
                        }
                    } else {
                        console.log("getTypeAtDocumentPosition() => err.\n" + err);
                        _tooltip.show("Something is rotten in the state of Denmark.\n" + err, event.x, event.y + 10);
                    }
                    function tipString() {
                        var tip = "";
                        if (results.description) {
                            tip += results.description;
                        }
                        if (tip.length && results.docComment) {
                            tip += "\n" + results.docComment;
                        }
                        return tip;
                    }
                });
            }
        }
    }

    var that = {
        startUp: function () {
            rootElement.addEventListener("mousemove", _onMouseMove);
        },
        tearDown: function () {
            rootElement.removeEventListener("mousemove", _onMouseMove);
        }
    };
    return that;
};
    return typeInfoTip;
});

ace.define("ace/lib/net",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"no use strict";
var dom = require("./dom");

function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            callback(xhr.responseText);
        }
    };
    xhr.send(null);
}
exports.get = get;

function loadScript(path, callback) {
    var head = dom.getDocumentHead();
    var s = document.createElement('script');

    s.src = path;
    head.appendChild(s);

    s.onload = s.onreadystatechange = function (_, isAbort) {
        if (isAbort || !s.readyState || s.readyState == "loaded" || s.readyState == "complete") {
            s = s.onload = s.onreadystatechange = null;
            if (!isAbort) {
                callback();
            }
        }
    };
}
exports.loadScript = loadScript;
;
function qualifyURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return a.href;
}
exports.qualifyURL = qualifyURL;
});

ace.define("ace/config",["require","exports","module","ace/lib/lang","ace/lib/oop","ace/lib/net","ace/lib/event_emitter"], function(require, exports, module) {
"no use strict";
var lang = require("./lib/lang");
var oop = require("./lib/oop");
var net = require("./lib/net");
var eve = require('./lib/event_emitter');

var global = (function () {
    return this || typeof window !== 'undefined' && window;
})();

var options = {
    packaged: false,
    workerPath: null,
    modePath: null,
    themePath: null,
    basePath: "",
    suffix: ".js",
    $moduleUrls: {}
};

function get(key) {
    if (!options.hasOwnProperty(key))
        throw new Error("Unknown config key: " + key);

    return options[key];
}
exports.get = get;

function set(key, value) {
    if (!options.hasOwnProperty(key))
        throw new Error("Unknown config key: " + key);

    options[key] = value;
}
exports.set = set;

function all() {
    return lang.copyObject(options);
}
exports.all = all;

oop.implement(exports, eve.EventEmitter);

function _emit(eventName, e) {
    return eve.EventEmitter._emit(eventName, e);
}
exports._emit = _emit;
function _signal(eventName, e) {
    return eve.EventEmitter._signal(eventName, e);
}
exports._signal = _signal;

function moduleUrl(name, component) {
    if (options.$moduleUrls[name]) {
        return options.$moduleUrls[name];
    }

    var parts = name.split("/");
    component = component || parts[parts.length - 2] || "";
    var sep = component == "snippets" ? "/" : "-";
    var base = parts[parts.length - 1];
    if (component === 'worker' && sep === '-') {
        var re = new RegExp("^" + component + "[\\-_]|[\\-_]" + component + "$", "g");
        base = base.replace(re, "");
    }

    if ((!base || base == component) && parts.length > 1) {
        base = parts[parts.length - 2];
    }
    var path = options[component + "Path"];
    if (path == null) {
        path = options.basePath;
    } else if (sep == "/") {
        component = sep = "";
    }
    if (path && path.slice(-1) != "/") {
        path += "/";
    }
    return path + component + sep + base + this.get("suffix");
}
exports.moduleUrl = moduleUrl;

function setModuleUrl(name, subst) {
    return options.$moduleUrls[name] = subst;
}
exports.setModuleUrl = setModuleUrl;

exports.$loading = {};
function loadModule(moduleName, onLoad) {
    var module, moduleType;
    if (Array.isArray(moduleName)) {
        moduleType = moduleName[0];
        moduleName = moduleName[1];
    }

    try  {
        module = require(moduleName);
    } catch (e) {
    }
    if (module && !exports.$loading[moduleName])
        return onLoad && onLoad(module);

    if (!exports.$loading[moduleName])
        exports.$loading[moduleName] = [];

    exports.$loading[moduleName].push(onLoad);

    if (exports.$loading[moduleName].length > 1)
        return;

    var afterLoad = function () {
        require([moduleName], function (module) {
            exports._emit("load.module", { name: moduleName, module: module });
            var listeners = exports.$loading[moduleName];
            exports.$loading[moduleName] = null;
            listeners.forEach(function (onLoad) {
                onLoad && onLoad(module);
            });
        });
    };

    if (!exports.get("packaged"))
        return afterLoad();
    net.loadScript(exports.moduleUrl(moduleName, moduleType), afterLoad);
}
exports.loadModule = loadModule;

init(true);function init(packaged) {

    options.packaged = packaged || require['packaged'] || module.packaged || (global.define && define['packaged']);

    if (!global.document)
        return "";

    var scriptOptions = {};
    var scriptUrl = "";
    var currentScript = (document['currentScript'] || document['_currentScript']);
    var currentDocument = currentScript && currentScript.ownerDocument || document;

    var scripts = currentDocument.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];

        var src = script.src || script.getAttribute("src");
        if (!src)
            continue;

        var attributes = script.attributes;
        for (var j = 0, l = attributes.length; j < l; j++) {
            var attr = attributes[j];
            if (attr.name.indexOf("data-ace-") === 0) {
                scriptOptions[deHyphenate(attr.name.replace(/^data-ace-/, ""))] = attr.value;
            }
        }

        var m = src.match(/^(.*)\/ace(\-\w+)?\.js(\?|$)/);
        if (m)
            scriptUrl = m[1];
    }

    if (scriptUrl) {
        scriptOptions['base'] = scriptOptions['base'] || scriptUrl;
        scriptOptions['packaged'] = true;
    }

    scriptOptions['basePath'] = scriptOptions['base'];
    scriptOptions['workerPath'] = scriptOptions['workerPath'] || scriptOptions['base'];
    scriptOptions['modePath'] = scriptOptions['modePath'] || scriptOptions['base'];
    scriptOptions['themePath'] = scriptOptions['themePath'] || scriptOptions['base'];
    delete scriptOptions['base'];

    for (var key in scriptOptions)
        if (typeof scriptOptions[key] !== "undefined")
            exports.set(key, scriptOptions[key]);
}
exports.init = init;
;

function deHyphenate(str) {
    return str.replace(/-(.)/g, function (m, m1) {
        return m1.toUpperCase();
    });
}

var optionsProvider = {
    setOptions: function (optList) {
        Object.keys(optList).forEach(function (key) {
            this.setOption(key, optList[key]);
        }, this);
    },
    getOptions: function (optionNames) {
        var result = {};
        if (!optionNames) {
            optionNames = Object.keys(this.$options);
        } else if (!Array.isArray(optionNames)) {
            result = optionNames;
            optionNames = Object.keys(result);
        }
        optionNames.forEach(function (key) {
            result[key] = this.getOption(key);
        }, this);
        return result;
    },
    setOption: function (name, value) {
        if (this["$" + name] === value)
            return;
        var opt = this.$options[name];
        if (!opt) {
            if (typeof console != "undefined" && console.warn)
                console.warn('misspelled option "' + name + '"');
            return undefined;
        }
        if (opt.forwardTo)
            return this[opt.forwardTo] && this[opt.forwardTo].setOption(name, value);

        if (!opt.handlesSet)
            this["$" + name] = value;
        if (opt && opt.set)
            opt.set.call(this, value);
    },
    getOption: function (name) {
        var opt = this.$options[name];
        if (!opt) {
            if (typeof console != "undefined" && console.warn)
                console.warn('misspelled option "' + name + '"');
            return undefined;
        }
        if (opt.forwardTo)
            return this[opt.forwardTo] && this[opt.forwardTo].getOption(name);
        return opt && opt.get ? opt.get.call(this) : this["$" + name];
    }
};

var defaultOptions = {};
function defineOptions(obj, path, options) {
    if (!obj.$options)
        defaultOptions[path] = obj.$options = {};

    Object.keys(options).forEach(function (key) {
        var opt = options[key];
        if (typeof opt == "string")
            opt = { forwardTo: opt };

        opt.name || (opt.name = key);
        obj.$options[opt.name] = opt;
        if ("initialValue" in opt)
            obj["$" + opt.name] = opt.initialValue;
    });
    oop.implement(obj, optionsProvider);

    return this;
}
exports.defineOptions = defineOptions;

function resetOptions(obj) {
    Object.keys(obj.$options).forEach(function (key) {
        var opt = obj.$options[key];
        if ("value" in opt)
            obj.setOption(key, opt.value);
    });
}
exports.resetOptions = resetOptions;

function setDefaultValue(path, name, value) {
    var opts = defaultOptions[path] || (defaultOptions[path] = {});
    if (opts[name]) {
        if (opts.forwardTo)
            exports.setDefaultValue(opts.forwardTo, name, value);
        else
            opts[name].value = value;
    }
}
exports.setDefaultValue = setDefaultValue;

function setDefaultValues(path, optionHash) {
    Object.keys(optionHash).forEach(function (key) {
        exports.setDefaultValue(path, key, optionHash[key]);
    });
}
exports.setDefaultValues = setDefaultValues;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/worker/worker_client",["require","exports","module","ace/lib/net","ace/lib/event_emitter","ace/config"], function(require, exports, module) {
"no use strict";
var net = require('../lib/net');
var eve = require('../lib/event_emitter');
var config = require("../config");
var WorkerClient = (function (_super) {
    __extends(WorkerClient, _super);
    function WorkerClient(topLevelNamespaces, mod, classname, workerUrl) {
        _super.call(this);
        this.callbacks = {};
        this.callbackId = 1;
        this.$sendDeltaQueue = this.$sendDeltaQueue.bind(this);
        this.changeListener = this.changeListener.bind(this);
        this.onMessage = this.onMessage.bind(this);
        if (require['nameToUrl'] && !require.toUrl) {
            require.toUrl = require['nameToUrl'];
        }

        if (config.get("packaged") || !require.toUrl) {
            workerUrl = workerUrl || config.moduleUrl(mod, "worker");
        } else {
            var normalizePath = this.$normalizePath;
            workerUrl = workerUrl || normalizePath(require.toUrl("ace/worker/worker.js"));

            var tlns = {};
            topLevelNamespaces.forEach(function (ns) {
                tlns[ns] = normalizePath(require.toUrl(ns).replace(/(\.js)?(\?.*)?$/, ""));
            });
        }

        try  {
            this.$worker = new Worker(workerUrl);
        } catch (e) {
            if (e instanceof window['DOMException']) {
                var blob = this.$workerBlob(workerUrl);
                var URL = window['URL'] || window['webkitURL'];
                var blobURL = URL.createObjectURL(blob);

                this.$worker = new Worker(blobURL);
                URL.revokeObjectURL(blobURL);
            } else {
                throw e;
            }
        }
        this.$worker.postMessage({
            init: true,
            tlns: tlns,
            module: mod,
            classname: classname
        });

        this.$worker.onmessage = this.onMessage;
    }
    WorkerClient.prototype.onMessage = function (e) {
        var msg = e.data;
        switch (msg.type) {
            case "log":
                window.console && console.log && console.log.apply(console, msg.data);
                break;

            case "event":
                this._signal(msg.name, { data: msg.data });
                break;

            case "call":
                var callback = this.callbacks[msg.id];
                if (callback) {
                    callback(msg.data);
                    delete this.callbacks[msg.id];
                }
                break;
        }
    };

    WorkerClient.prototype.$normalizePath = function (path) {
        return net.qualifyURL(path);
    };

    WorkerClient.prototype.terminate = function () {
        this._signal("terminate", {});
        this.deltaQueue = null;
        this.$worker.terminate();
        this.$worker = null;
        this.detachFromDocument();
    };

    WorkerClient.prototype.send = function (cmd, args) {
        this.$worker.postMessage({ command: cmd, args: args });
    };

    WorkerClient.prototype.call = function (cmd, args, callback) {
        if (callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            args.push(id);
        }
        this.send(cmd, args);
    };

    WorkerClient.prototype.emit = function (event, data) {
        try  {
            this.$worker.postMessage({ event: event, data: { data: data.data } });
        } catch (ex) {
            console.error(ex.stack);
        }
    };

    WorkerClient.prototype.attachToDocument = function (doc) {
        if (this.$doc) {
            this.terminate();
        }
        this.$doc = doc;
        this.call("setValue", [doc.getValue()]);
        doc.addEventListener('change', this.changeListener);
    };

    WorkerClient.prototype.detachFromDocument = function () {
        this.$doc.removeEventListener('change', this.changeListener);
        this.$doc = null;
    };
    WorkerClient.prototype.changeListener = function (e) {
        if (!this.deltaQueue) {
            this.deltaQueue = [e.data];
            setTimeout(this.$sendDeltaQueue, 0);
        } else {
            this.deltaQueue.push(e.data);
        }
    };

    WorkerClient.prototype.$sendDeltaQueue = function () {
        var doc = this.$doc;
        var q = this.deltaQueue;
        if (!q)
            return;
        this.deltaQueue = null;
        if (q.length > 20 && q.length > doc.getLength() >> 1) {
            this.call("setValue", [doc.getValue()]);
        } else
            this.emit("change", { data: q });
    };

    WorkerClient.prototype.$workerBlob = function (workerUrl) {
        var script = "importScripts('" + net.qualifyURL(workerUrl) + "');";
        try  {
            return new Blob([script], { "type": "application/javascript" });
        } catch (e) {
            var BlobBuilder = window['BlobBuilder'] || window['WebKitBlobBuilder'] || window['MozBlobBuilder'];
            var blobBuilder = new BlobBuilder();
            blobBuilder.append(script);
            return blobBuilder.getBlob("application/javascript");
        }
    };
    return WorkerClient;
})(eve.EventEmitterClass);
exports.WorkerClient = WorkerClient;
});

ace.define("ace/workspace/workspace_protocol",["require","exports","module"], function(require, exports, module) {
"no use strict";
exports.EVENT_NAME_COMPLETIONS = "completions";
});

ace.define("ace/workspace/workspace",["require","exports","module","ace/worker/worker_client","ace/workspace/workspace_protocol"], function(require, exports, module) {
"no use strict";
var wcm = require('../worker/worker_client');
var protocol = require('./workspace_protocol');
exports.workspace = function () {
    var workerProxy = new wcm.WorkerClient(['ace'], 'ace/workspace/workspace_worker', 'WorkspaceWorker');
    var callbacks = {};
    var callbackId = 1;

    workerProxy.on("initAfter", function (event) {
    });

    workerProxy.on("fileNames", function (response) {
        var data = response.data;
        var names = data.names;
        var id = data.callbackId;
        var callback = callbacks[id];
        delete callbacks[id];
        callback(null, names);
    });

    workerProxy.on("syntaxErrors", function (response) {
        var data = response.data;
        var errors = data.errors;
        var id = data.callbackId;
        var callback = callbacks[id];
        delete callbacks[id];
        callback(null, errors);
    });

    workerProxy.on("semanticErrors", function (response) {
        var data = response.data;
        var errors = data.errors;
        var id = data.callbackId;
        var callback = callbacks[id];
        delete callbacks[id];
        callback(null, errors);
    });

    workerProxy.on(protocol.EVENT_NAME_COMPLETIONS, function (response) {
        var data = response.data;
        var id = data.callbackId;
        var callback = callbacks[id];
        delete callbacks[id];
        if ('err' in data) {
            callback(data.err);
        } else {
            callback(null, data.completions);
        }
    });

    workerProxy.on("typeAtDocumentPosition", function (response) {
        doCallback(response.data);
    });

    workerProxy.on("outputFiles", function (response) {
        doCallback(response.data);
    });

    function doCallback(data) {
        var info = data.results;
        var id = data.callbackId;
        var callback = callbacks[id];
        delete callbacks[id];
        if (data.err) {
            callback(data.err);
        } else {
            callback(null, data.results);
        }
    }

    function ensureScript(fileName, content) {
        var message = {
            data: { 'fileName': fileName, 'content': content.replace(/\r\n?/g, '\n') }
        };
        workerProxy.emit("ensureScript", message);
    }

    function editScript(fileName, start, end, text) {
        var message = {
            data: { fileName: fileName, start: start, end: end, text: text }
        };
        workerProxy.emit("editScript", message);
    }

    function removeScript(fileName) {
        workerProxy.emit("removeScript", { data: { 'fileName': fileName } });
    }

    function getFileNames(callback) {
        var id = callbackId++;
        callbacks[id] = callback;
        var message = { data: { callbackId: id } };
        workerProxy.emit("getFileNames", message);
    }

    function getSyntaxErrors(fileName, callback) {
        var id = callbackId++;
        callbacks[id] = callback;
        var message = { data: { fileName: fileName, callbackId: id } };
        workerProxy.emit("getSyntaxErrors", message);
    }

    function getSemanticErrors(fileName, callback) {
        var id = callbackId++;
        callbacks[id] = callback;
        var message = { data: { fileName: fileName, callbackId: id } };
        workerProxy.emit("getSemanticErrors", message);
    }

    function getCompletionsAtPosition(fileName, position, memberMode, callback) {
        var id = callbackId++;
        callbacks[id] = callback;
        var message = { data: { fileName: fileName, position: position, memberMode: memberMode, callbackId: id } };
        workerProxy.emit("getCompletionsAtPosition", message);
    }

    function getTypeAtDocumentPosition(fileName, documentPosition, callback) {
        var id = callbackId++;
        callbacks[id] = callback;
        var message = { data: { fileName: fileName, documentPosition: documentPosition, callbackId: id } };
        workerProxy.emit("getTypeAtDocumentPosition", message);
    }

    function getOutputFiles(fileName, callback) {
        var id = callbackId++;
        callbacks[id] = callback;
        var message = { data: { fileName: fileName, callbackId: id } };
        workerProxy.emit("getOutputFiles", message);
    }

    var that = {
        ensureScript: ensureScript,
        editScript: editScript,
        removeScript: removeScript,
        getFileNames: getFileNames,
        getSyntaxErrors: getSyntaxErrors,
        getSemanticErrors: getSemanticErrors,
        getCompletionsAtPosition: getCompletionsAtPosition,
        getTypeAtDocumentPosition: getTypeAtDocumentPosition,
        getOutputFiles: getOutputFiles
    };
    return that;
};
});

ace.define("ace/editor_protocol",["require","exports","module"], function(require, exports, module) {
"no use strict";
exports.COMMAND_NAME_AUTO_COMPLETE = "autoComplete";
});

ace.define("ace/deuce",["require","exports","module","ace/mode/typescript/autoComplete","ace/mode/typescript/CompletionService","ace/mode/typescript/EditorPosition","ace/mode/typescript/DocumentPositionUtil","ace/lib/async","ace/range","ace/lib/lang","ace/typeInfoTip","ace/workspace/workspace","ace/editor_protocol"], function(require, exports, module) {
"no use strict";
var autoCompleteNew = require('./mode/typescript/autoComplete');
var CompletionService = require('./mode/typescript/CompletionService');
var EditorPosition = require('./mode/typescript/EditorPosition');
var DocumentPositionUtil = require('./mode/typescript/DocumentPositionUtil');
var async = require("./lib/async");

var ram = require('./range');
var lang = require("./lib/lang");
var typeInfoTip = require("./typeInfoTip");
var wsm = require('./workspace/workspace');
var protocol = require('./editor_protocol');

var deferredCall = lang.deferredCall;

function wrap(editor, rootElement, workspace, doc) {
    if (typeof doc === "undefined") { doc = window.document; }
    function show() {
        rootElement.style.display = "block";
        editor.focus();
    }

    function hide() {
        rootElement.style.display = 'none';
    }

    var _fileName;
    var _completionService = new CompletionService(editor, workspace);
    var _editorPositionService = new EditorPosition(editor);
    var _syncStop = false;
    var _refMarkers = [];
    var _errorMarkers = [];

    var _typeInfo = typeInfoTip(doc, editor, workspace, function () {
        return _fileName;
    }, rootElement);
    var _autoComplete = autoCompleteNew(editor, function () {
        return _fileName;
    }, _completionService);

    _typeInfo.startUp();

    function changeFile(content, fileName) {
        if (_fileName) {
            if (workspace) {
                workspace.removeScript(_fileName);
            }
            _fileName = null;
        }
        _fileName = fileName;
        _syncStop = true;
        var data = content.replace(/\r\n?/g, '\n');
        editor.setValue(data);
        if (workspace) {
            workspace.ensureScript(fileName, editor.getSession().getDocument().getValue());
        }
        _syncStop = false;
    }

    editor.commands.addCommands([{
            name: protocol.COMMAND_NAME_AUTO_COMPLETE,
            bindKey: "Ctrl-Space",
            exec: function (editor) {
                if (!_autoComplete.isActive()) {
                    _autoComplete.activate();
                }
            }
        }]);

    editor.addEventListener("mousedown", function (event) {
        if (_autoComplete.isActive()) {
            _autoComplete.deactivate();
        }
    });
    editor.addEventListener("changeCursor", function (event) {
    });

    function showOccurrences() {
    }

    var deferredShowOccurrences = deferredCall(showOccurrences);
    editor.addEventListener("changeSelection", function (event) {
        if (!_syncStop) {
            try  {
                deferredShowOccurrences.schedule(200);
            } catch (ex) {
            }
        }
    });
    editor.addEventListener("change", function (event) {
        var data = event.data;
        var action = data.action;
        var range = data.range;
        if (_fileName) {
            if (!_syncStop) {
                try  {
                    updateWorkspaceFile();
                    updateMarkerModels();
                } catch (e) {
                    console.log("exception updating models: " + e);
                }
            }
        }
        function updateWorkspaceFile() {
            function editLanguageServiceScript(start, end, text) {
                if (workspace) {
                    workspace.editScript(_fileName, start, end, text);
                }
            }
            var end;
            var start = _editorPositionService.getPositionChars(range.start);
            if (action == "insertText") {
                editLanguageServiceScript(start, start, data.text);
            } else if (action == "removeText") {
                end = start + data.text.length;
                editLanguageServiceScript(start, end, "");
            } else if (action == "insertLines") {
                var text = data.lines.map(function (line) {
                    return line + '\n';
                }).join('');
                editLanguageServiceScript(start, start, text);
            } else if (action == "removeLines") {
                var len = _editorPositionService.getLinesChars(data.lines);
                end = start + len;
                editLanguageServiceScript(start, end, "");
            } else {
                console.log("Unhandled action: " + action);
            }
        }
        function updateMarkerModels() {
            var markers = editor.getSession().getMarkers(true);
            var line_count = 0;
            var isNewLine = editor.getSession().getDocument().isNewLine;
            if (action === "insertText") {
                if (isNewLine(data.text)) {
                    line_count = 1;
                }
            } else if (action === "insertLines") {
                line_count = data.lines.length;
            } else if (action === "removeText") {
                if (isNewLine(data.text)) {
                    line_count = -1;
                }
            } else if (action === "removeLines") {
                line_count = -data.lines.length;
            }
            if (line_count !== 0) {
                var markerUpdate = function (id) {
                    var marker = markers[id];
                    var row = range.start.row;
                    if (line_count > 0) {
                        row = +1;
                    }
                    if (marker && marker.range.start.row > row) {
                        marker.range.start.row += line_count;
                        marker.range.end.row += line_count;
                    }
                };
                _errorMarkers.forEach(markerUpdate);
                _refMarkers.forEach(markerUpdate);
                editor.onChangeFrontMarker();
            }
        }
    });
    editor.getSession().on("compiled", function (message) {
        var session = editor.getSession();
        var doc = session.getDocument();
        function convertError(error) {
            var minChar = error.start;
            var limChar = minChar + error.length;
            var pos = DocumentPositionUtil.getPosition(doc, minChar);
            return { row: pos.row, column: pos.column, text: error.message, type: 'error' };
        }
        function getSyntaxErrors(callback) {
            if (workspace && typeof _fileName === 'string') {
                workspace.getSyntaxErrors(_fileName, callback);
            } else {
                callback(null, []);
            }
        }
        function getSemanticErrors(callback) {
            if (workspace && typeof _fileName === 'string') {
                workspace.getSemanticErrors(_fileName, callback);
            } else {
                callback(null, []);
            }
        }
        async.parallel([getSyntaxErrors, getSemanticErrors], function (err, results) {
            if (!err) {
                var errors = results[0].concat(results[1]);
                var annotations = [];
                if (errors && errors.length) {
                    errors.forEach(function (error) {
                        annotations.push(convertError(error));
                    });
                }
                session.setAnnotations(annotations);
                _errorMarkers.forEach(function (id) {
                    session.removeMarker(id);
                });
                errors.forEach(function (error) {
                    var minChar = error.start;
                    var limChar = minChar + error.length;
                    var start = _editorPositionService.getPositionFromChars(minChar);
                    var end = _editorPositionService.getPositionFromChars(limChar);
                    var range = new ram.Range(start.row, start.column, end.row, end.column);
                    _errorMarkers.push(session.addMarker(range, "typescript-error", "text", true));
                });
            } else {
                console.log("" + err);
            }
        });
        if (workspace && typeof _fileName === 'string') {
            workspace.getOutputFiles(_fileName, function (err, outputFiles) {
                session._emit("outputFiles", { data: outputFiles });
            });
        }
    });

    var editorWrapper = {
        get fileName() {
            return _fileName;
        },
        set fileName(value) {
            _fileName = value;
        },
        get commands() {
            return editor.commands;
        },
        get container() {
            return editor.container;
        },
        get session() {
            return editor.session;
        },
        getCursorPosition: function () {
            return editor.getCursorPosition();
        },
        getSelection: function () {
            return editor.getSelection();
        },
        getValue: function () {
            return editor.getValue();
        },
        gotoLine: function (lineNumber, column, animate) {
            return editor.gotoLine(lineNumber, column, animate);
        },
        focus: function () {
            return editor.focus();
        },
        indent: function () {
            return editor.indent();
        },
        moveCursorTo: function (row, column, animate) {
            return editor.moveCursorTo(row, column, animate);
        },
        resize: function (force) {
            return editor.resize(force);
        },
        setAutoScrollEditorIntoView: function (enable) {
            return editor.setAutoScrollEditorIntoView(enable);
        },
        setFontSize: function (fontSize) {
            return editor.setFontSize(fontSize);
        },
        setOption: function (name, value) {
            return editor.setOption(name, value);
        },
        setOptions: function (options) {
            return editor.setOptions(options);
        },
        setShowInvisibles: function (showInvisibles) {
            return editor.setShowInvisibles(showInvisibles);
        },
        setTheme: function (theme, callback) {
            return editor.setTheme(theme, callback);
        },
        setValue: function (val, cursorPos) {
            return editor.setValue(val, cursorPos);
        },
        getSession: function () {
            return editor.getSession();
        },
        addEventListener: function (eventName, callback, capturing) {
            return editor.addEventListener(eventName, callback, capturing);
        },
        get onTextInput() {
            return editor.onTextInput;
        },
        set onTextInput(value) {
            editor.onTextInput = value;
        },
        getDisplayIndentGuides: function () {
            return editor.getDisplayIndentGuides();
        },
        setDisplayIndentGuides: function (displayIndentGuides) {
            return editor.setDisplayIndentGuides(displayIndentGuides);
        },
        getShowPrintMargin: function () {
            return editor.getShowPrintMargin();
        },
        setShowPrintMargin: function (showPrintMargin) {
            return editor.setShowPrintMargin(showPrintMargin);
        },
        changeFile: changeFile
    };

    return editorWrapper;
}
exports.wrap = wrap;
function edit(source, workspace, doc) {
    if (typeof doc === "undefined") { doc = window.document; }
    var rootElement = (function () {
        if (typeof source === "string") {
            var element = doc.getElementById(source);
            if (element) {
                return element;
            } else {
                throw new Error(source + " must be an element id");
            }
        } else {
            return source;
        }
    })();

    var _editor = (function (element) {
        throw new Error("edit is currently unsupported");
    })(rootElement);

    return exports.wrap(_editor, rootElement, workspace, doc);
}

function workspace() {
    return wsm.workspace();
}
exports.workspace = workspace;
});

ace.define("ace/keyboard/textinput",["require","exports","module","ace/lib/event","ace/lib/useragent","ace/lib/dom","ace/lib/lang"], function(require, exports, module) {
"use strict";

var event = require("../lib/event");
var useragent = require("../lib/useragent");
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var BROKEN_SETDATA = useragent.isChrome < 18;
var USE_IE_MIME_TYPE =  useragent.isIE;

var TextInput = function(parentNode, host) {
    var text = dom.createElement("textarea");
    text.className = "ace_text-input";

    if (useragent.isTouchPad)
        text.setAttribute("x-palm-disable-auto-cap", true);

    text.wrap = "off";
    text.autocorrect = "off";
    text.autocapitalize = "off";
    text.spellcheck = false;

    text.style.opacity = "0";
    parentNode.insertBefore(text, parentNode.firstChild);

    var PLACEHOLDER = "\x01\x01";

    var copied = false;
    var pasted = false;
    var inComposition = false;
    var tempStyle = '';
    var isSelectionEmpty = true;
    try { var isFocused = document.activeElement === text; } catch(e) {}
    
    event.addListener(text, "blur", function() {
        host.onBlur();
        isFocused = false;
    });
    event.addListener(text, "focus", function() {
        isFocused = true;
        host.onFocus();
        resetSelection();
    });
    this.focus = function() { text.focus(); };
    this.blur = function() { text.blur(); };
    this.isFocused = function() {
        return isFocused;
    };
    var syncSelection = lang.delayedCall(function() {
        isFocused && resetSelection(isSelectionEmpty);
    });
    var syncValue = lang.delayedCall(function() {
         if (!inComposition) {
            text.value = PLACEHOLDER;
            isFocused && resetSelection();
         }
    });

    function resetSelection(isEmpty) {
        if (inComposition)
            return;
        if (inputHandler) {
            selectionStart = 0;
            selectionEnd = isEmpty ? 0 : text.value.length - 1;
        } else {
            var selectionStart = isEmpty ? 2 : 1;
            var selectionEnd = 2;
        }
        try {
            text.setSelectionRange(selectionStart, selectionEnd);
        } catch(e){}
    }

    function resetValue() {
        if (inComposition)
            return;
        text.value = PLACEHOLDER;
        if (useragent.isWebKit)
            syncValue.schedule();
    }

    useragent.isWebKit || host.addEventListener('changeSelection', function() {
        if (host.selection.isEmpty() != isSelectionEmpty) {
            isSelectionEmpty = !isSelectionEmpty;
            syncSelection.schedule();
        }
    });

    resetValue();
    if (isFocused)
        host.onFocus();


    var isAllSelected = function(text) {
        return text.selectionStart === 0 && text.selectionEnd === text.value.length;
    };
    if (!text.setSelectionRange && text.createTextRange) {
        text.setSelectionRange = function(selectionStart, selectionEnd) {
            var range = this.createTextRange();
            range.collapse(true);
            range.moveStart('character', selectionStart);
            range.moveEnd('character', selectionEnd);
            range.select();
        };
        isAllSelected = function(text) {
            try {
                var range = text.ownerDocument.selection.createRange();
            }catch(e) {}
            if (!range || range.parentElement() != text) return false;
                return range.text == text.value;
        }
    }
    if (useragent.isOldIE) {
        var inPropertyChange = false;
        var onPropertyChange = function(e){
            if (inPropertyChange)
                return;
            var data = text.value;
            if (inComposition || !data || data == PLACEHOLDER)
                return;
            if (e && data == PLACEHOLDER[0])
                return syncProperty.schedule();

            sendText(data);
            inPropertyChange = true;
            resetValue();
            inPropertyChange = false;
        };
        var syncProperty = lang.delayedCall(onPropertyChange);
        event.addListener(text, "propertychange", onPropertyChange);

        var keytable = { 13:1, 27:1 };
        event.addListener(text, "keyup", function (e) {
            if (inComposition && (!text.value || keytable[e.keyCode]))
                setTimeout(onCompositionEnd, 0);
            if ((text.value.charCodeAt(0)||0) < 129) {
                return syncProperty.call();
            }
            inComposition ? onCompositionUpdate() : onCompositionStart();
        });
        event.addListener(text, "keydown", function (e) {
            syncProperty.schedule(50);
        });
    }

    var onSelect = function(e) {
        if (copied) {
            copied = false;
        } else if (isAllSelected(text)) {
            host.selectAll();
            resetSelection();
        } else if (inputHandler) {
            resetSelection(host.selection.isEmpty());
        }
    };

    var inputHandler = null;
    this.setInputHandler = function(cb) {inputHandler = cb};
    this.getInputHandler = function() {return inputHandler};
    var afterContextMenu = false;
    
    var sendText = function(data) {
        if (inputHandler) {
            data = inputHandler(data);
            inputHandler = null;
        }
        if (pasted) {
            resetSelection();
            if (data)
                host.onPaste(data);
            pasted = false;
        } else if (data == PLACEHOLDER.charAt(0)) {
            if (afterContextMenu)
                host.execCommand("del", {source: "ace"});
            else // some versions of android do not fire keydown when pressing backspace
                host.execCommand("backspace", {source: "ace"});
        } else {
            if (data.substring(0, 2) == PLACEHOLDER)
                data = data.substr(2);
            else if (data.charAt(0) == PLACEHOLDER.charAt(0))
                data = data.substr(1);
            else if (data.charAt(data.length - 1) == PLACEHOLDER.charAt(0))
                data = data.slice(0, -1);
            if (data.charAt(data.length - 1) == PLACEHOLDER.charAt(0))
                data = data.slice(0, -1);
            
            if (data)
                host.onTextInput(data);
        }
        if (afterContextMenu)
            afterContextMenu = false;
    };
    var onInput = function(e) {
        if (inComposition)
            return;
        var data = text.value;
        sendText(data);
        resetValue();
    };
    
    var handleClipboardData = function(e, data) {
        var clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData || BROKEN_SETDATA)
            return;
        var mime = USE_IE_MIME_TYPE ? "Text" : "text/plain";
        if (data) {
            return clipboardData.setData(mime, data) !== false;
        } else {
            return clipboardData.getData(mime);
        }
    };

    var doCopy = function(e, isCut) {
        var data = host.getCopyText();
        if (!data)
            return event.preventDefault(e);

        if (handleClipboardData(e, data)) {
            isCut ? host.onCut() : host.onCopy();
            event.preventDefault(e);
        } else {
            copied = true;
            text.value = data;
            text.select();
            setTimeout(function(){
                copied = false;
                resetValue();
                resetSelection();
                isCut ? host.onCut() : host.onCopy();
            });
        }
    };
    
    var onCut = function(e) {
        doCopy(e, true);
    };
    
    var onCopy = function(e) {
        doCopy(e, false);
    };
    
    var onPaste = function(e) {
        var data = handleClipboardData(e);
        if (typeof data == "string") {
            if (data)
                host.onPaste(data);
            if (useragent.isIE)
                setTimeout(resetSelection);
            event.preventDefault(e);
        }
        else {
            text.value = "";
            pasted = true;
        }
    };

    event.addCommandKeyListener(text, host.onCommandKey.bind(host));

    event.addListener(text, "select", onSelect);

    event.addListener(text, "input", onInput);

    event.addListener(text, "cut", onCut);
    event.addListener(text, "copy", onCopy);
    event.addListener(text, "paste", onPaste);
    if (!('oncut' in text) || !('oncopy' in text) || !('onpaste' in text)){
        event.addListener(parentNode, "keydown", function(e) {
            if ((useragent.isMac && !e.metaKey) || !e.ctrlKey)
                return;

            switch (e.keyCode) {
                case 67:
                    onCopy(e);
                    break;
                case 86:
                    onPaste(e);
                    break;
                case 88:
                    onCut(e);
                    break;
            }
        });
    }
    var onCompositionStart = function(e) {
        if (inComposition || !host.onCompositionStart || host.$readOnly) 
            return;
        inComposition = {};
        host.onCompositionStart();
        setTimeout(onCompositionUpdate, 0);
        host.on("mousedown", onCompositionEnd);
        if (!host.selection.isEmpty()) {
            host.insert("");
            host.session.markUndoGroup();
            host.selection.clearSelection();
        }
        host.session.markUndoGroup();
    };

    var onCompositionUpdate = function() {
        if (!inComposition || !host.onCompositionUpdate || host.$readOnly)
            return;
        var val = text.value.replace(/\x01/g, "");
        if (inComposition.lastValue === val) return;
        
        host.onCompositionUpdate(val);
        if (inComposition.lastValue)
            host.undo();
        inComposition.lastValue = val;
        if (inComposition.lastValue) {
            var r = host.selection.getRange();
            host.insert(inComposition.lastValue);
            host.session.markUndoGroup();
            inComposition.range = host.selection.getRange();
            host.selection.setRange(r);
            host.selection.clearSelection();
        }
    };

    var onCompositionEnd = function(e) {
        if (!host.onCompositionEnd || host.$readOnly) return;
        var c = inComposition;
        inComposition = false;
        var timer = setTimeout(function() {
            timer = null;
            var str = text.value.replace(/\x01/g, "");
            if (inComposition)
                return;
            else if (str == c.lastValue)
                resetValue();
            else if (!c.lastValue && str) {
                resetValue();
                sendText(str);
            }
        });
        inputHandler = function compositionInputHandler(str) {
            if (timer)
                clearTimeout(timer);
            str = str.replace(/\x01/g, "");
            if (str == c.lastValue)
                return "";
            if (c.lastValue && timer)
                host.undo();
            return str;
        };
        host.onCompositionEnd();
        host.removeListener("mousedown", onCompositionEnd);
        if (e.type == "compositionend" && c.range) {
            host.selection.setRange(c.range);
        }
    };
    
    

    var syncComposition = lang.delayedCall(onCompositionUpdate, 50);

    event.addListener(text, "compositionstart", onCompositionStart);
    if (useragent.isGecko) {
        event.addListener(text, "text", function(){syncComposition.schedule()});
    } else {
        event.addListener(text, "keyup", function(){syncComposition.schedule()});
        event.addListener(text, "keydown", function(){syncComposition.schedule()});
    }
    event.addListener(text, "compositionend", onCompositionEnd);

    this.getElement = function() {
        return text;
    };

    this.setReadOnly = function(readOnly) {
       text.readOnly = readOnly;
    };

    this.onContextMenu = function(e) {
        afterContextMenu = true;
        resetSelection(host.selection.isEmpty());
        host._emit("nativecontextmenu", {target: host, domEvent: e});
        this.moveToMouse(e, true);
    };
    
    this.moveToMouse = function(e, bringToFront) {
        if (!tempStyle)
            tempStyle = text.style.cssText;
        text.style.cssText = (bringToFront ? "z-index:100000;" : "")
            + "height:" + text.style.height + ";"
            + (useragent.isIE ? "opacity:0.1;" : "");

        var rect = host.container.getBoundingClientRect();
        var style = dom.computedStyle(host.container);
        var top = rect.top + (parseInt(style.borderTopWidth) || 0);
        var left = rect.left + (parseInt(rect.borderLeftWidth) || 0);
        var maxTop = rect.bottom - top - text.clientHeight -2;
        var move = function(e) {
            text.style.left = e.clientX - left - 2 + "px";
            text.style.top = Math.min(e.clientY - top - 2, maxTop) + "px";
        }; 
        move(e);

        if (e.type != "mousedown")
            return;

        if (host.renderer.$keepTextAreaAtCursor)
            host.renderer.$keepTextAreaAtCursor = null;
        if (useragent.isWin)
            event.capture(host.container, move, onContextMenuClose);
    };

    this.onContextMenuClose = onContextMenuClose;
    function onContextMenuClose() {
        setTimeout(function () {
            if (tempStyle) {
                text.style.cssText = tempStyle;
                tempStyle = '';
            }
            if (host.renderer.$keepTextAreaAtCursor == null) {
                host.renderer.$keepTextAreaAtCursor = true;
                host.renderer.$moveTextAreaToCursor();
            }
        }, 0);
    }

    var onContextMenu = function(e) {
        host.textInput.onContextMenu(e);
        onContextMenuClose();
    };
    event.addListener(host.renderer.scroller, "contextmenu", onContextMenu);
    event.addListener(text, "contextmenu", onContextMenu);
};

exports.TextInput = TextInput;
});

ace.define("ace/keyboard/keybinding",["require","exports","module","ace/lib/keys","ace/lib/event"], function(require, exports, module) {
"use strict";

var keyUtil  = require("../lib/keys");
var event = require("../lib/event");

var KeyBinding = function(editor) {
    this.$editor = editor;
    this.$data = {editor: editor};
    this.$handlers = [];
    this.setDefaultHandler(editor.commands);
};

(function() {
    this.setDefaultHandler = function(kb) {
        this.removeKeyboardHandler(this.$defaultHandler);
        this.$defaultHandler = kb;
        this.addKeyboardHandler(kb, 0);
    };

    this.setKeyboardHandler = function(kb) {
        var h = this.$handlers;
        if (h[h.length - 1] == kb)
            return;

        while (h[h.length - 1] && h[h.length - 1] != this.$defaultHandler)
            this.removeKeyboardHandler(h[h.length - 1]);

        this.addKeyboardHandler(kb, 1);
    };

    this.addKeyboardHandler = function(kb, pos) {
        if (!kb)
            return;
        if (typeof kb == "function" && !kb.handleKeyboard)
            kb.handleKeyboard = kb;
        var i = this.$handlers.indexOf(kb);
        if (i != -1)
            this.$handlers.splice(i, 1);

        if (pos == undefined)
            this.$handlers.push(kb);
        else
            this.$handlers.splice(pos, 0, kb);

        if (i == -1 && kb.attach)
            kb.attach(this.$editor);
    };

    this.removeKeyboardHandler = function(kb) {
        var i = this.$handlers.indexOf(kb);
        if (i == -1)
            return false;
        this.$handlers.splice(i, 1);
        kb.detach && kb.detach(this.$editor);
        return true;
    };

    this.getKeyboardHandler = function() {
        return this.$handlers[this.$handlers.length - 1];
    };

    this.$callKeyboardHandlers = function (hashId, keyString, keyCode, e) {
        var toExecute;
        var success = false;
        var commands = this.$editor.commands;

        for (var i = this.$handlers.length; i--;) {
            toExecute = this.$handlers[i].handleKeyboard(
                this.$data, hashId, keyString, keyCode, e
            );
            if (!toExecute || !toExecute.command)
                continue;
            if (toExecute.command == "null") {
                success = true;
            } else {
                success = commands.exec(toExecute.command, this.$editor, toExecute.args, e);                
            }
            if (success && e && hashId != -1 && 
                toExecute.passEvent != true && toExecute.command.passEvent != true
            ) {
                event.stopEvent(e);
            }
            if (success)
                break;
        }
        return success;
    };

    this.onCommandKey = function(e, hashId, keyCode) {
        var keyString = keyUtil.keyCodeToString(keyCode);
        this.$callKeyboardHandlers(hashId, keyString, keyCode, e);
    };

    this.onTextInput = function(text) {
        var success = this.$callKeyboardHandlers(-1, text);
        if (!success)
            this.$editor.commands.exec("insertstring", this.$editor, text);
    };

}).call(KeyBinding.prototype);

exports.KeyBinding = KeyBinding;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/selection",["require","exports","module","ace/lib/lang","ace/lib/event_emitter","ace/range"], function(require, exports, module) {
"no use strict";
var lang = require("./lib/lang");
var evem = require("./lib/event_emitter");
var rng = require("./range");
var Selection = (function (_super) {
    __extends(Selection, _super);
    function Selection(session) {
        _super.call(this);
        this.session = session;
        this.doc = session.getDocument();

        this.clearSelection();
        this.lead = this.selectionLead = this.doc.createAnchor(0, 0);
        this.anchor = this.selectionAnchor = this.doc.createAnchor(0, 0);

        var self = this;
        this.lead.on("change", function (e) {
            self._emit("changeCursor");
            if (!self.$isEmpty)
                self._emit("changeSelection");
            if (!self.$keepDesiredColumnOnChange && e.old.column != e.value.column)
                self.$desiredColumn = null;
        });

        this.selectionAnchor.on("change", function () {
            if (!self.$isEmpty)
                self._emit("changeSelection");
        });
    }
    Selection.prototype.isEmpty = function () {
        return (this.$isEmpty || (this.anchor.row == this.lead.row && this.anchor.column == this.lead.column));
    };
    Selection.prototype.isMultiLine = function () {
        if (this.isEmpty()) {
            return false;
        }

        return this.getRange().isMultiLine();
    };
    Selection.prototype.getCursor = function () {
        return this.lead.getPosition();
    };
    Selection.prototype.setSelectionAnchor = function (row, column) {
        this.anchor.setPosition(row, column);

        if (this.$isEmpty) {
            this.$isEmpty = false;
            this._emit("changeSelection");
        }
    };
    Selection.prototype.getSelectionAnchor = function () {
        if (this.$isEmpty)
            return this.getSelectionLead();
        else
            return this.anchor.getPosition();
    };
    Selection.prototype.getSelectionLead = function () {
        return this.lead.getPosition();
    };
    Selection.prototype.shiftSelection = function (columns) {
        if (this.$isEmpty) {
            this.moveCursorTo(this.lead.row, this.lead.column + columns);
            return;
        }

        var anchor = this.getSelectionAnchor();
        var lead = this.getSelectionLead();

        var isBackwards = this.isBackwards();

        if (!isBackwards || anchor.column !== 0)
            this.setSelectionAnchor(anchor.row, anchor.column + columns);

        if (isBackwards || lead.column !== 0) {
            this.$moveSelection(function () {
                this.moveCursorTo(lead.row, lead.column + columns);
            });
        }
    };
    Selection.prototype.isBackwards = function () {
        var anchor = this.anchor;
        var lead = this.lead;
        return (anchor.row > lead.row || (anchor.row == lead.row && anchor.column > lead.column));
    };
    Selection.prototype.getRange = function () {
        var anchor = this.anchor;
        var lead = this.lead;

        if (this.isEmpty())
            return rng.Range.fromPoints(lead, lead);

        if (this.isBackwards()) {
            return rng.Range.fromPoints(lead, anchor);
        } else {
            return rng.Range.fromPoints(anchor, lead);
        }
    };
    Selection.prototype.clearSelection = function () {
        if (!this.$isEmpty) {
            this.$isEmpty = true;
            this._emit("changeSelection");
        }
    };
    Selection.prototype.selectAll = function () {
        var lastRow = this.doc.getLength() - 1;
        this.setSelectionAnchor(0, 0);
        this.moveCursorTo(lastRow, this.doc.getLine(lastRow).length);
    };
    Selection.prototype.setRange = function (range, reverse) {
        this.setSelectionRange(range, reverse);
    };
    Selection.prototype.setSelectionRange = function (range, reverse) {
        if (reverse) {
            this.setSelectionAnchor(range.end.row, range.end.column);
            this.selectTo(range.start.row, range.start.column);
        } else {
            this.setSelectionAnchor(range.start.row, range.start.column);
            this.selectTo(range.end.row, range.end.column);
        }
        if (this.getRange().isEmpty())
            this.$isEmpty = true;
        this.$desiredColumn = null;
    };

    Selection.prototype.$moveSelection = function (mover) {
        var lead = this.lead;
        if (this.$isEmpty)
            this.setSelectionAnchor(lead.row, lead.column);

        mover.call(this);
    };
    Selection.prototype.selectTo = function (row, column) {
        this.$moveSelection(function () {
            this.moveCursorTo(row, column);
        });
    };
    Selection.prototype.selectToPosition = function (pos) {
        this.$moveSelection(function () {
            this.moveCursorToPosition(pos);
        });
    };
    Selection.prototype.moveTo = function (row, column) {
        this.clearSelection();
        this.moveCursorTo(row, column);
    };
    Selection.prototype.moveToPosition = function (pos) {
        this.clearSelection();
        this.moveCursorToPosition(pos);
    };
    Selection.prototype.selectUp = function () {
        this.$moveSelection(this.moveCursorUp);
    };
    Selection.prototype.selectDown = function () {
        this.$moveSelection(this.moveCursorDown);
    };
    Selection.prototype.selectRight = function () {
        this.$moveSelection(this.moveCursorRight);
    };
    Selection.prototype.selectLeft = function () {
        this.$moveSelection(this.moveCursorLeft);
    };
    Selection.prototype.selectLineStart = function () {
        this.$moveSelection(this.moveCursorLineStart);
    };
    Selection.prototype.selectLineEnd = function () {
        this.$moveSelection(this.moveCursorLineEnd);
    };
    Selection.prototype.selectFileEnd = function () {
        this.$moveSelection(this.moveCursorFileEnd);
    };
    Selection.prototype.selectFileStart = function () {
        this.$moveSelection(this.moveCursorFileStart);
    };
    Selection.prototype.selectWordRight = function () {
        this.$moveSelection(this.moveCursorWordRight);
    };
    Selection.prototype.selectWordLeft = function () {
        this.$moveSelection(this.moveCursorWordLeft);
    };
    Selection.prototype.getWordRange = function (row, column) {
        if (typeof column == "undefined") {
            var cursor = row || this.lead;
            row = cursor.row;
            column = cursor.column;
        }
        return this.session.getWordRange(row, column);
    };
    Selection.prototype.selectWord = function () {
        this.setSelectionRange(this.getWordRange());
    };
    Selection.prototype.selectAWord = function () {
        var cursor = this.getCursor();
        var range = this.session.getAWordRange(cursor.row, cursor.column);
        this.setSelectionRange(range);
    };

    Selection.prototype.getLineRange = function (row, excludeLastChar) {
        var rowStart = typeof row == "number" ? row : this.lead.row;
        var rowEnd;

        var foldLine = this.session.getFoldLine(rowStart);
        if (foldLine) {
            rowStart = foldLine.start.row;
            rowEnd = foldLine.end.row;
        } else {
            rowEnd = rowStart;
        }

        if (excludeLastChar) {
            return new rng.Range(rowStart, 0, rowEnd, this.session.getLine(rowEnd).length);
        } else {
            return new rng.Range(rowStart, 0, rowEnd + 1, 0);
        }
    };
    Selection.prototype.selectLine = function () {
        this.setSelectionRange(this.getLineRange());
    };
    Selection.prototype.moveCursorUp = function () {
        this.moveCursorBy(-1, 0);
    };
    Selection.prototype.moveCursorDown = function () {
        this.moveCursorBy(1, 0);
    };
    Selection.prototype.moveCursorLeft = function () {
        var cursor = this.lead.getPosition(), fold;

        if (fold = this.session.getFoldAt(cursor.row, cursor.column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
        } else if (cursor.column === 0) {
            if (cursor.row > 0) {
                this.moveCursorTo(cursor.row - 1, this.doc.getLine(cursor.row - 1).length);
            }
        } else {
            var tabSize = this.session.getTabSize();
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column - tabSize, cursor.column).split(" ").length - 1 == tabSize)
                this.moveCursorBy(0, -tabSize);
            else
                this.moveCursorBy(0, -1);
        }
    };
    Selection.prototype.moveCursorRight = function () {
        var cursor = this.lead.getPosition(), fold;
        if (fold = this.session.getFoldAt(cursor.row, cursor.column, 1)) {
            this.moveCursorTo(fold.end.row, fold.end.column);
        } else if (this.lead.column == this.doc.getLine(this.lead.row).length) {
            if (this.lead.row < this.doc.getLength() - 1) {
                this.moveCursorTo(this.lead.row + 1, 0);
            }
        } else {
            var tabSize = this.session.getTabSize();
            var cursor = this.lead;
            if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column, cursor.column + tabSize).split(" ").length - 1 == tabSize)
                this.moveCursorBy(0, tabSize);
            else
                this.moveCursorBy(0, 1);
        }
    };
    Selection.prototype.moveCursorLineStart = function () {
        var row = this.lead.row;
        var column = this.lead.column;
        var screenRow = this.session.documentToScreenRow(row, column);
        var firstColumnPosition = this.session.screenToDocumentPosition(screenRow, 0);
        var beforeCursor = this.session.getDisplayLine(row, null, firstColumnPosition.row, firstColumnPosition.column);

        var leadingSpace = beforeCursor.match(/^\s*/);
        if (leadingSpace[0].length != column && !this.session.$useEmacsStyleLineStart)
            firstColumnPosition.column += leadingSpace[0].length;
        this.moveCursorToPosition(firstColumnPosition);
    };
    Selection.prototype.moveCursorLineEnd = function () {
        var lead = this.lead;
        var lineEnd = this.session.getDocumentLastRowColumnPosition(lead.row, lead.column);
        if (this.lead.column == lineEnd.column) {
            var line = this.session.getLine(lineEnd.row);
            if (lineEnd.column == line.length) {
                var textEnd = line.search(/\s+$/);
                if (textEnd > 0)
                    lineEnd.column = textEnd;
            }
        }

        this.moveCursorTo(lineEnd.row, lineEnd.column);
    };
    Selection.prototype.moveCursorFileEnd = function () {
        var row = this.doc.getLength() - 1;
        var column = this.doc.getLine(row).length;
        this.moveCursorTo(row, column);
    };
    Selection.prototype.moveCursorFileStart = function () {
        this.moveCursorTo(0, 0);
    };
    Selection.prototype.moveCursorLongWordRight = function () {
        var row = this.lead.row;
        var column = this.lead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var match;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            this.moveCursorTo(fold.end.row, fold.end.column);
            return;
        }
        if (match = this.session.nonTokenRe.exec(rightOfCursor)) {
            column += this.session.nonTokenRe.lastIndex;
            this.session.nonTokenRe.lastIndex = 0;
            rightOfCursor = line.substring(column);
        }
        if (column >= line.length) {
            this.moveCursorTo(row, line.length);
            this.moveCursorRight();
            if (row < this.doc.getLength() - 1)
                this.moveCursorWordRight();
            return;
        }
        if (match = this.session.tokenRe.exec(rightOfCursor)) {
            column += this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };
    Selection.prototype.moveCursorLongWordLeft = function () {
        var row = this.lead.row;
        var column = this.lead.column;
        var fold;
        if (fold = this.session.getFoldAt(row, column, -1)) {
            this.moveCursorTo(fold.start.row, fold.start.column);
            return;
        }

        var str = this.session.getFoldStringAt(row, column, -1);
        if (str == null) {
            str = this.doc.getLine(row).substring(0, column);
        }

        var leftOfCursor = lang.stringReverse(str);
        var match;
        this.session.nonTokenRe.lastIndex = 0;
        this.session.tokenRe.lastIndex = 0;
        if (match = this.session.nonTokenRe.exec(leftOfCursor)) {
            column -= this.session.nonTokenRe.lastIndex;
            leftOfCursor = leftOfCursor.slice(this.session.nonTokenRe.lastIndex);
            this.session.nonTokenRe.lastIndex = 0;
        }
        if (column <= 0) {
            this.moveCursorTo(row, 0);
            this.moveCursorLeft();
            if (row > 0)
                this.moveCursorWordLeft();
            return;
        }
        if (match = this.session.tokenRe.exec(leftOfCursor)) {
            column -= this.session.tokenRe.lastIndex;
            this.session.tokenRe.lastIndex = 0;
        }

        this.moveCursorTo(row, column);
    };

    Selection.prototype.$shortWordEndIndex = function (rightOfCursor) {
        var match, index = 0, ch;
        var whitespaceRe = /\s/;
        var tokenRe = this.session.tokenRe;

        tokenRe.lastIndex = 0;
        if (match = this.session.tokenRe.exec(rightOfCursor)) {
            index = this.session.tokenRe.lastIndex;
        } else {
            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                index++;

            if (index < 1) {
                tokenRe.lastIndex = 0;
                while ((ch = rightOfCursor[index]) && !tokenRe.test(ch)) {
                    tokenRe.lastIndex = 0;
                    index++;
                    if (whitespaceRe.test(ch)) {
                        if (index > 2) {
                            index--;
                            break;
                        } else {
                            while ((ch = rightOfCursor[index]) && whitespaceRe.test(ch))
                                index++;
                            if (index > 2)
                                break;
                        }
                    }
                }
            }
        }
        tokenRe.lastIndex = 0;

        return index;
    };

    Selection.prototype.moveCursorShortWordRight = function () {
        var row = this.lead.row;
        var column = this.lead.column;
        var line = this.doc.getLine(row);
        var rightOfCursor = line.substring(column);

        var fold = this.session.getFoldAt(row, column, 1);
        if (fold)
            return this.moveCursorTo(fold.end.row, fold.end.column);

        if (column == line.length) {
            var l = this.doc.getLength();
            do {
                row++;
                rightOfCursor = this.doc.getLine(row);
            } while(row < l && /^\s*$/.test(rightOfCursor));

            if (!/^\s+/.test(rightOfCursor))
                rightOfCursor = "";
            column = 0;
        }

        var index = this.$shortWordEndIndex(rightOfCursor);

        this.moveCursorTo(row, column + index);
    };

    Selection.prototype.moveCursorShortWordLeft = function () {
        var row = this.lead.row;
        var column = this.lead.column;

        var fold;
        if (fold = this.session.getFoldAt(row, column, -1))
            return this.moveCursorTo(fold.start.row, fold.start.column);

        var line = this.session.getLine(row).substring(0, column);
        if (column == 0) {
            do {
                row--;
                line = this.doc.getLine(row);
            } while(row > 0 && /^\s*$/.test(line));

            column = line.length;
            if (!/\s+$/.test(line))
                line = "";
        }

        var leftOfCursor = lang.stringReverse(line);
        var index = this.$shortWordEndIndex(leftOfCursor);

        return this.moveCursorTo(row, column - index);
    };

    Selection.prototype.moveCursorWordRight = function () {
        if (this.session.$selectLongWords)
            this.moveCursorLongWordRight();
        else
            this.moveCursorShortWordRight();
    };

    Selection.prototype.moveCursorWordLeft = function () {
        if (this.session.$selectLongWords)
            this.moveCursorLongWordLeft();
        else
            this.moveCursorShortWordLeft();
    };
    Selection.prototype.moveCursorBy = function (rows, chars) {
        var screenPos = this.session.documentToScreenPosition(this.lead.row, this.lead.column);

        if (chars === 0) {
            if (this.$desiredColumn)
                screenPos.column = this.$desiredColumn;
            else
                this.$desiredColumn = screenPos.column;
        }

        var docPos = this.session.screenToDocumentPosition(screenPos.row + rows, screenPos.column);

        if (rows !== 0 && chars === 0 && docPos.row === this.lead.row && docPos.column === this.lead.column) {
            if (this.session.lineWidgets && this.session.lineWidgets[docPos.row])
                docPos.row++;
        }
        this.moveCursorTo(docPos.row, docPos.column + chars, chars === 0);
    };
    Selection.prototype.moveCursorToPosition = function (position) {
        this.moveCursorTo(position.row, position.column);
    };
    Selection.prototype.moveCursorTo = function (row, column, keepDesiredColumn) {
        var fold = this.session.getFoldAt(row, column, 1);
        if (fold) {
            row = fold.start.row;
            column = fold.start.column;
        }

        this.$keepDesiredColumnOnChange = true;
        this.lead.setPosition(row, column);
        this.$keepDesiredColumnOnChange = false;

        if (!keepDesiredColumn)
            this.$desiredColumn = null;
    };
    Selection.prototype.moveCursorToScreen = function (row, column, keepDesiredColumn) {
        var pos = this.session.screenToDocumentPosition(row, column);
        this.moveCursorTo(pos.row, pos.column, keepDesiredColumn);
    };
    Selection.prototype.detach = function () {
        this.lead.detach();
        this.anchor.detach();
        this.session = this.doc = null;
    };

    Selection.prototype.fromOrientedRange = function (range) {
        this.setSelectionRange(range, range.cursor == range.start);
        this.$desiredColumn = range.desiredColumn || this.$desiredColumn;
    };

    Selection.prototype.toOrientedRange = function (range) {
        var r = this.getRange();
        if (range) {
            range.start.column = r.start.column;
            range.start.row = r.start.row;
            range.end.column = r.end.column;
            range.end.row = r.end.row;
        } else {
            range = r;
        }

        range.cursor = this.isBackwards() ? range.start : range.end;
        range.desiredColumn = this.$desiredColumn;
        return range;
    };
    Selection.prototype.getRangeOfMovements = function (func) {
        var start = this.getCursor();
        try  {
            func.call(null, this);
            var end = this.getCursor();
            return rng.Range.fromPoints(start, end);
        } catch (e) {
            return rng.Range.fromPoints(start, start);
        } finally {
            this.moveCursorToPosition(start);
        }
    };

    Selection.prototype.toJSON = function () {
        if (this.rangeCount) {
            var data = this.ranges.map(function (r) {
                var r1 = r.clone();
                r1.isBackwards = r.cursor == r.start;
                return r1;
            });
        } else {
            var data = this.getRange();
            data.isBackwards = this.isBackwards();
        }
        return data;
    };

    Selection.prototype.toSingleRange = function (data) {
        throw new Error("Selection.toSingleRange is unsupported");
    };

    Selection.prototype.addRange = function (data, something) {
        throw new Error("Selection.addRange is unsupported");
    };

    Selection.prototype.fromJSON = function (data) {
        if (data.start == undefined) {
            if (this.rangeList) {
                this.toSingleRange(data[0]);
                for (var i = data.length; i--;) {
                    var r = rng.Range.fromPoints(data[i].start, data[i].end);
                    if (data.isBackwards)
                        r.cursor = r.start;
                    this.addRange(r, true);
                }
                return;
            } else
                data = data[0];
        }
        if (this.rangeList)
            this.toSingleRange(data);
        this.setSelectionRange(data, data.isBackwards);
    };

    Selection.prototype.isEqual = function (data) {
        if ((data.length || this.rangeCount) && data.length != this.rangeCount)
            return false;
        if (!data.length || !this.ranges)
            return this.getRange().isEqual(data);

        for (var i = this.ranges.length; i--;) {
            if (!this.ranges[i].isEqual(data[i]))
                return false;
        }
        return true;
    };
    return Selection;
})(evem.EventEmitterClass);
exports.Selection = Selection;
});

ace.define("ace/tokenizer",["require","exports","module"], function(require, exports, module) {
"no use strict";
var MAX_TOKEN_COUNT = 1000;
var Tokenizer = (function () {
    function Tokenizer(rules) {
        this.states = rules;

        this.regExps = {};
        this.matchMappings = {};
        for (var key in this.states) {
            var state = this.states[key];
            var ruleRegExps = [];
            var matchTotal = 0;
            var mapping = this.matchMappings[key] = { defaultToken: "text" };
            var flag = "g";

            var splitterRules = [];
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                if (rule.defaultToken)
                    mapping.defaultToken = rule.defaultToken;
                if (rule.caseInsensitive)
                    flag = "gi";
                if (rule.regex == null)
                    continue;

                if (rule.regex instanceof RegExp)
                    rule.regex = rule.regex.toString().slice(1, -1);
                var adjustedregex = rule.regex;
                var matchcount = new RegExp("(?:(" + adjustedregex + ")|(.))").exec("a").length - 2;
                if (Array.isArray(rule.token)) {
                    if (rule.token.length == 1 || matchcount == 1) {
                        rule.token = rule.token[0];
                    } else if (matchcount - 1 != rule.token.length) {
                        throw new Error("number of classes and regexp groups in '" + rule.token + "'\n'" + rule.regex + "' doesn't match\n" + (matchcount - 1) + "!=" + rule.token.length);
                    } else {
                        rule.tokenArray = rule.token;
                        rule.token = null;
                        rule.onMatch = this.$arrayTokens;
                    }
                } else if (typeof rule.token == "function" && !rule.onMatch) {
                    if (matchcount > 1)
                        rule.onMatch = this.$applyToken;
                    else
                        rule.onMatch = rule.token;
                }

                if (matchcount > 1) {
                    if (/\\\d/.test(rule.regex)) {
                        adjustedregex = rule.regex.replace(/\\([0-9]+)/g, function (match, digit) {
                            return "\\" + (parseInt(digit, 10) + matchTotal + 1);
                        });
                    } else {
                        matchcount = 1;
                        adjustedregex = this.removeCapturingGroups(rule.regex);
                    }
                    if (!rule.splitRegex && typeof rule.token != "string")
                        splitterRules.push(rule); // flag will be known only at the very end
                }

                mapping[matchTotal] = i;
                matchTotal += matchcount;

                ruleRegExps.push(adjustedregex);
                if (!rule.onMatch)
                    rule.onMatch = null;
            }

            if (!ruleRegExps.length) {
                mapping[0] = 0;
                ruleRegExps.push("$");
            }

            splitterRules.forEach(function (rule) {
                rule.splitRegex = this.createSplitterRegexp(rule.regex, flag);
            }, this);

            this.regExps[key] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
        }
    }
    Tokenizer.prototype.$setMaxTokenCount = function (m) {
        MAX_TOKEN_COUNT = m | 0;
    };

    Tokenizer.prototype.$applyToken = function (str) {
        var values = this.splitRegex.exec(str).slice(1);
        var types = this.token.apply(this, values);
        if (typeof types === "string")
            return [{ type: types, value: str }];

        var tokens = [];
        for (var i = 0, l = types.length; i < l; i++) {
            if (values[i])
                tokens[tokens.length] = {
                    type: types[i],
                    value: values[i]
                };
        }
        return tokens;
    };

    Tokenizer.prototype.$arrayTokens = function (str) {
        if (!str)
            return [];
        var values = this.splitRegex.exec(str);
        if (!values)
            return "text";
        var tokens = [];
        var types = this.tokenArray;
        for (var i = 0, l = types.length; i < l; i++) {
            if (values[i + 1])
                tokens[tokens.length] = {
                    type: types[i],
                    value: values[i + 1]
                };
        }
        return tokens;
    };

    Tokenizer.prototype.removeCapturingGroups = function (src) {
        var r = src.replace(/\[(?:\\.|[^\]])*?\]|\\.|\(\?[:=!]|(\()/g, function (x, y) {
            return y ? "(?:" : x;
        });
        return r;
    };

    Tokenizer.prototype.createSplitterRegexp = function (src, flag) {
        if (src.indexOf("(?=") != -1) {
            var stack = 0;
            var inChClass = false;
            var lastCapture = {};
            src.replace(/(\\.)|(\((?:\?[=!])?)|(\))|([\[\]])/g, function (m, esc, parenOpen, parenClose, square, index) {
                if (inChClass) {
                    inChClass = square != "]";
                } else if (square) {
                    inChClass = true;
                } else if (parenClose) {
                    if (stack == lastCapture.stack) {
                        lastCapture.end = index + 1;
                        lastCapture.stack = -1;
                    }
                    stack--;
                } else if (parenOpen) {
                    stack++;
                    if (parenOpen.length != 1) {
                        lastCapture.stack = stack;
                        lastCapture.start = index;
                    }
                }
                return m;
            });

            if (lastCapture.end != null && /^\)*$/.test(src.substr(lastCapture.end)))
                src = src.substring(0, lastCapture.start) + src.substr(lastCapture.end);
        }
        return new RegExp(src, (flag || "").replace("g", ""));
    };
    Tokenizer.prototype.getLineTokens = function (line, startState) {
        var stack;
        if (startState && typeof startState !== 'string') {
            stack = startState.slice(0);
            startState = stack[0];
            if (startState === '#tmp') {
                stack.shift();
                startState = stack.shift();
            }
        } else {
            stack = [];
        }

        var currentState = startState || "start";
        var state = this.states[currentState];
        if (!state) {
            currentState = "start";
            state = this.states[currentState];
        }
        var mapping = this.matchMappings[currentState];
        var re = this.regExps[currentState];
        re.lastIndex = 0;

        var match, tokens = [];
        var lastIndex = 0;

        var token = { type: null, value: "" };

        while (match = re.exec(line)) {
            var type = mapping.defaultToken;
            var rule = null;
            var value = match[0];
            var index = re.lastIndex;

            if (index - value.length > lastIndex) {
                var skipped = line.substring(lastIndex, index - value.length);
                if (token.type == type) {
                    token.value += skipped;
                } else {
                    if (token.type)
                        tokens.push(token);
                    token = { type: type, value: skipped };
                }
            }

            for (var i = 0; i < match.length - 2; i++) {
                if (match[i + 1] === undefined)
                    continue;

                rule = state[mapping[i]];

                if (rule.onMatch)
                    type = rule.onMatch(value, currentState, stack);
                else
                    type = rule.token;

                if (rule.next) {
                    if (typeof rule.next === 'string') {
                        currentState = rule.next;
                    } else {
                        currentState = rule.next(currentState, stack);
                    }

                    state = this.states[currentState];
                    if (!state) {
                        window.console && console.error && console.error(currentState, "doesn't exist");
                        currentState = "start";
                        state = this.states[currentState];
                    }
                    mapping = this.matchMappings[currentState];
                    lastIndex = index;
                    re = this.regExps[currentState];
                    re.lastIndex = index;
                }
                break;
            }

            if (value) {
                if (typeof type == "string") {
                    if ((!rule || rule.merge !== false) && token.type === type) {
                        token.value += value;
                    } else {
                        if (token.type)
                            tokens.push(token);
                        token = { type: type, value: value };
                    }
                } else if (type) {
                    if (token.type)
                        tokens.push(token);
                    token = { type: null, value: "" };
                    for (var i = 0; i < type.length; i++)
                        tokens.push(type[i]);
                }
            }

            if (lastIndex == line.length)
                break;

            lastIndex = index;

            if (tokens.length > MAX_TOKEN_COUNT) {
                while (lastIndex < line.length) {
                    if (token.type)
                        tokens.push(token);
                    token = {
                        value: line.substring(lastIndex, lastIndex += 2000),
                        type: "overflow"
                    };
                }
                currentState = "start";
                stack = [];
                break;
            }
        }

        if (token.type)
            tokens.push(token);

        if (stack.length > 1) {
            if (stack[0] !== currentState) {
                stack.unshift('#tmp', currentState);
            }
        }

        return {
            tokens: tokens,
            state: stack.length ? stack : currentState
        };
    };
    return Tokenizer;
})();
exports.Tokenizer = Tokenizer;
});

ace.define("ace/mode/text_highlight_rules",["require","exports","module","ace/lib/lang"], function(require, exports, module) {
"use strict";

var lang = require("../lib/lang");

var TextHighlightRules = function() {

    this.$rules = {
        "start" : [{
            token : "empty_line",
            regex : '^$'
        }, {
            defaultToken : "text"
        }]
    };
};

(function() {

    this.addRules = function(rules, prefix) {
        if (!prefix) {
            for (var key in rules)
                this.$rules[key] = rules[key];
            return;
        }
        for (var key in rules) {
            var state = rules[key];
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                if (rule.next || rule.onMatch) {
                    if (typeof rule.next != "string") {
                        if (rule.nextState && rule.nextState.indexOf(prefix) !== 0)
                            rule.nextState = prefix + rule.nextState;
                    } else {
                        if (rule.next.indexOf(prefix) !== 0)
                            rule.next = prefix + rule.next;
                    }
                }
            }
            this.$rules[prefix + key] = state;
        }
    };

    this.getRules = function() {
        return this.$rules;
    };

    this.embedRules = function (HighlightRules, prefix, escapeRules, states, append) {
        var embedRules = typeof HighlightRules == "function"
            ? new HighlightRules().getRules()
            : HighlightRules;
        if (states) {
            for (var i = 0; i < states.length; i++)
                states[i] = prefix + states[i];
        } else {
            states = [];
            for (var key in embedRules)
                states.push(prefix + key);
        }

        this.addRules(embedRules, prefix);

        if (escapeRules) {
            var addRules = Array.prototype[append ? "push" : "unshift"];
            for (var i = 0; i < states.length; i++)
                addRules.apply(this.$rules[states[i]], lang.deepCopy(escapeRules));
        }

        if (!this.$embeds)
            this.$embeds = [];
        this.$embeds.push(prefix);
    };

    this.getEmbeds = function() {
        return this.$embeds;
    };

    var pushState = function(currentState, stack) {
        if (currentState != "start" || stack.length)
            stack.unshift(this.nextState, currentState);
        return this.nextState;
    };
    var popState = function(currentState, stack) {
        stack.shift();
        return stack.shift() || "start";
    };

    this.normalizeRules = function() {
        var id = 0;
        var rules = this.$rules;
        function processState(key) {
            var state = rules[key];
            state.processed = true;
            for (var i = 0; i < state.length; i++) {
                var rule = state[i];
                if (!rule.regex && rule.start) {
                    rule.regex = rule.start;
                    if (!rule.next)
                        rule.next = [];
                    rule.next.push({
                        defaultToken: rule.token
                    }, {
                        token: rule.token + ".end",
                        regex: rule.end || rule.start,
                        next: "pop"
                    });
                    rule.token = rule.token + ".start";
                    rule.push = true;
                }
                var next = rule.next || rule.push;
                if (next && Array.isArray(next)) {
                    var stateName = rule.stateName;
                    if (!stateName)  {
                        stateName = rule.token;
                        if (typeof stateName != "string")
                            stateName = stateName[0] || "";
                        if (rules[stateName])
                            stateName += id++;
                    }
                    rules[stateName] = next;
                    rule.next = stateName;
                    processState(stateName);
                } else if (next == "pop") {
                    rule.next = popState;
                }

                if (rule.push) {
                    rule.nextState = rule.next || rule.push;
                    rule.next = pushState;
                    delete rule.push;
                }

                if (rule.rules) {
                    for (var r in rule.rules) {
                        if (rules[r]) {
                            if (rules[r].push)
                                rules[r].push.apply(rules[r], rule.rules[r]);
                        } else {
                            rules[r] = rule.rules[r];
                        }
                    }
                }
                if (rule.include || typeof rule == "string") {
                    var includeName = rule.include || rule;
                    var toInsert = rules[includeName];
                } else if (Array.isArray(rule))
                    toInsert = rule;

                if (toInsert) {
                    var args = [i, 1].concat(toInsert);
                    if (rule.noEscape)
                        args = args.filter(function(x) {return !x.next;});
                    state.splice.apply(state, args);
                    i--;
                    toInsert = null;
                }
                
                if (rule.keywordMap) {
                    rule.token = this.createKeywordMapper(
                        rule.keywordMap, rule.defaultToken || "text", rule.caseInsensitive
                    );
                    delete rule.defaultToken;
                }
            }
        }
        Object.keys(rules).forEach(processState, this);
    };

    this.createKeywordMapper = function(map, defaultToken, ignoreCase, splitChar) {
        var keywords = Object.create(null);
        Object.keys(map).forEach(function(className) {
            var a = map[className];
            if (ignoreCase)
                a = a.toLowerCase();
            var list = a.split(splitChar || "|");
            for (var i = list.length; i--; )
                keywords[list[i]] = className;
        });
        if (Object.getPrototypeOf(keywords)) {
            keywords.__proto__ = null;
        }
        this.$keywordList = Object.keys(keywords);
        map = null;
        return ignoreCase
            ? function(value) {return keywords[value.toLowerCase()] || defaultToken }
            : function(value) {return keywords[value] || defaultToken };
    };

    this.getKeywords = function() {
        return this.$keywords;
    };

}).call(TextHighlightRules.prototype);

exports.TextHighlightRules = TextHighlightRules;
});

ace.define("ace/mode/behaviour",["require","exports","module"], function(require, exports, module) {
"no use strict";
var Behaviour = (function () {
    function Behaviour() {
        this.$behaviours = {};
    }
    Behaviour.prototype.add = function (name, action, callback) {
        switch (undefined) {
            case this.$behaviours:
                this.$behaviours = {};
            case this.$behaviours[name]:
                this.$behaviours[name] = {};
        }
        this.$behaviours[name][action] = callback;
    };

    Behaviour.prototype.addBehaviours = function (behaviours) {
        for (var key in behaviours) {
            for (var action in behaviours[key]) {
                this.add(key, action, behaviours[key][action]);
            }
        }
    };

    Behaviour.prototype.remove = function (name) {
        if (this.$behaviours && this.$behaviours[name]) {
            delete this.$behaviours[name];
        }
    };

    Behaviour.prototype.inherit = function (mode, filter) {
        if (typeof mode === 'function') {
            var behaviours = new mode().getBehaviours(filter);
        } else {
            var behaviours = mode.getBehaviours(filter);
        }
        this.addBehaviours(behaviours);
    };

    Behaviour.prototype.getBehaviours = function (filter) {
        if (!filter) {
            return this.$behaviours;
        } else {
            var ret = {};
            for (var i = 0; i < filter.length; i++) {
                if (this.$behaviours[filter[i]]) {
                    ret[filter[i]] = this.$behaviours[filter[i]];
                }
            }
            return ret;
        }
    };
    return Behaviour;
})();
exports.Behaviour = Behaviour;
});

"use strict";
ace.define("ace/unicode",["require","exports","module"], function(require, exports, module) {
"no use strict";
exports.packages = { L: undefined, Mn: undefined, Mc: undefined, Nd: undefined, Pc: undefined };

addUnicodePackage({
    L: "0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05250531-055605590561-058705D0-05EA05F0-05F20621-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280904-0939093D09500958-0961097109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510D0-10FA10FC1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209421022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2D00-2D252D30-2D652D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A65FA662-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78BA78CA7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
    Ll: "0061-007A00AA00B500BA00DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F0521052305250561-05871D00-1D2B1D62-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7C2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2D00-2D25A641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CFB00-FB06FB13-FB17FF41-FF5A",
    Lu: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E0520052205240531-055610A0-10C51E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CEDA640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BFF21-FF3A",
    Lt: "01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",
    Lm: "02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D611D781D9B-1DBF2071207F2090-20942C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A9CFAA70AADDFF70FF9EFF9F",
    Lo: "01BB01C0-01C3029405D0-05EA05F0-05F20621-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150904-0939093D09500958-096109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF12135-21382D30-2D652D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
    M: "0300-036F0483-04890591-05BD05BF05C105C205C405C505C70610-061A064B-065E067006D6-06DC06DE-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0900-0903093C093E-094E0951-0955096209630981-098309BC09BE-09C409C709C809CB-09CD09D709E209E30A01-0A030A3C0A3E-0A420A470A480A4B-0A4D0A510A700A710A750A81-0A830ABC0ABE-0AC50AC7-0AC90ACB-0ACD0AE20AE30B01-0B030B3C0B3E-0B440B470B480B4B-0B4D0B560B570B620B630B820BBE-0BC20BC6-0BC80BCA-0BCD0BD70C01-0C030C3E-0C440C46-0C480C4A-0C4D0C550C560C620C630C820C830CBC0CBE-0CC40CC6-0CC80CCA-0CCD0CD50CD60CE20CE30D020D030D3E-0D440D46-0D480D4A-0D4D0D570D620D630D820D830DCA0DCF-0DD40DD60DD8-0DDF0DF20DF30E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F3E0F3F0F71-0F840F860F870F90-0F970F99-0FBC0FC6102B-103E1056-1059105E-10601062-10641067-106D1071-10741082-108D108F109A-109D135F1712-17141732-1734175217531772177317B6-17D317DD180B-180D18A91920-192B1930-193B19B0-19C019C819C91A17-1A1B1A55-1A5E1A60-1A7C1A7F1B00-1B041B34-1B441B6B-1B731B80-1B821BA1-1BAA1C24-1C371CD0-1CD21CD4-1CE81CED1CF21DC0-1DE61DFD-1DFF20D0-20F02CEF-2CF12DE0-2DFF302A-302F3099309AA66F-A672A67CA67DA6F0A6F1A802A806A80BA823-A827A880A881A8B4-A8C4A8E0-A8F1A926-A92DA947-A953A980-A983A9B3-A9C0AA29-AA36AA43AA4CAA4DAA7BAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1ABE3-ABEAABECABEDFB1EFE00-FE0FFE20-FE26",
    Mn: "0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065E067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0900-0902093C0941-0948094D0951-095509620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F90-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135F1712-17141732-1734175217531772177317B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1DC0-1DE61DFD-1DFF20D0-20DC20E120E5-20F02CEF-2CF12DE0-2DFF302A-302F3099309AA66FA67CA67DA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",
    Mc: "0903093E-09400949-094C094E0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1C24-1C2B1C341C351CE11CF2A823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BABE3ABE4ABE6ABE7ABE9ABEAABEC",
    Me: "0488048906DE20DD-20E020E2-20E4A670-A672",
    N: "0030-003900B200B300B900BC-00BE0660-066906F0-06F907C0-07C90966-096F09E6-09EF09F4-09F90A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BF20C66-0C6F0C78-0C7E0CE6-0CEF0D66-0D750E50-0E590ED0-0ED90F20-0F331040-10491090-10991369-137C16EE-16F017E0-17E917F0-17F91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C5920702074-20792080-20892150-21822185-21892460-249B24EA-24FF2776-27932CFD30073021-30293038-303A3192-31953220-32293251-325F3280-328932B1-32BFA620-A629A6E6-A6EFA830-A835A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
    Nd: "0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
    Nl: "16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",
    No: "00B200B300B900BC-00BE09F4-09F90BF0-0BF20C78-0C7E0D70-0D750F2A-0F331369-137C17F0-17F920702074-20792080-20892150-215F21892460-249B24EA-24FF2776-27932CFD3192-31953220-32293251-325F3280-328932B1-32BFA830-A835",
    P: "0021-00230025-002A002C-002F003A003B003F0040005B-005D005F007B007D00A100AB00B700BB00BF037E0387055A-055F0589058A05BE05C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E0964096509700DF40E4F0E5A0E5B0F04-0F120F3A-0F3D0F850FD0-0FD4104A-104F10FB1361-13681400166D166E169B169C16EB-16ED1735173617D4-17D617D8-17DA1800-180A1944194519DE19DF1A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601C3B-1C3F1C7E1C7F1CD32010-20272030-20432045-20512053-205E207D207E208D208E2329232A2768-277527C527C627E6-27EF2983-299829D8-29DB29FC29FD2CF9-2CFC2CFE2CFF2E00-2E2E2E302E313001-30033008-30113014-301F3030303D30A030FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFABEBFD3EFD3FFE10-FE19FE30-FE52FE54-FE61FE63FE68FE6AFE6BFF01-FF03FF05-FF0AFF0C-FF0FFF1AFF1BFF1FFF20FF3B-FF3DFF3FFF5BFF5DFF5F-FF65",
    Pd: "002D058A05BE140018062010-20152E172E1A301C303030A0FE31FE32FE58FE63FF0D",
    Ps: "0028005B007B0F3A0F3C169B201A201E2045207D208D23292768276A276C276E27702772277427C527E627E827EA27EC27EE2983298529872989298B298D298F299129932995299729D829DA29FC2E222E242E262E283008300A300C300E3010301430163018301A301DFD3EFE17FE35FE37FE39FE3BFE3DFE3FFE41FE43FE47FE59FE5BFE5DFF08FF3BFF5BFF5FFF62",
    Pe: "0029005D007D0F3B0F3D169C2046207E208E232A2769276B276D276F27712773277527C627E727E927EB27ED27EF298429862988298A298C298E2990299229942996299829D929DB29FD2E232E252E272E293009300B300D300F3011301530173019301B301E301FFD3FFE18FE36FE38FE3AFE3CFE3EFE40FE42FE44FE48FE5AFE5CFE5EFF09FF3DFF5DFF60FF63",
    Pi: "00AB2018201B201C201F20392E022E042E092E0C2E1C2E20",
    Pf: "00BB2019201D203A2E032E052E0A2E0D2E1D2E21",
    Pc: "005F203F20402054FE33FE34FE4D-FE4FFF3F",
    Po: "0021-00230025-0027002A002C002E002F003A003B003F0040005C00A100B700BF037E0387055A-055F058905C005C305C605F305F40609060A060C060D061B061E061F066A-066D06D40700-070D07F7-07F90830-083E0964096509700DF40E4F0E5A0E5B0F04-0F120F850FD0-0FD4104A-104F10FB1361-1368166D166E16EB-16ED1735173617D4-17D617D8-17DA1800-18051807-180A1944194519DE19DF1A1E1A1F1AA0-1AA61AA8-1AAD1B5A-1B601C3B-1C3F1C7E1C7F1CD3201620172020-20272030-2038203B-203E2041-20432047-205120532055-205E2CF9-2CFC2CFE2CFF2E002E012E06-2E082E0B2E0E-2E162E182E192E1B2E1E2E1F2E2A-2E2E2E302E313001-3003303D30FBA4FEA4FFA60D-A60FA673A67EA6F2-A6F7A874-A877A8CEA8CFA8F8-A8FAA92EA92FA95FA9C1-A9CDA9DEA9DFAA5C-AA5FAADEAADFABEBFE10-FE16FE19FE30FE45FE46FE49-FE4CFE50-FE52FE54-FE57FE5F-FE61FE68FE6AFE6BFF01-FF03FF05-FF07FF0AFF0CFF0EFF0FFF1AFF1BFF1FFF20FF3CFF61FF64FF65",
    S: "0024002B003C-003E005E0060007C007E00A2-00A900AC00AE-00B100B400B600B800D700F702C2-02C502D2-02DF02E5-02EB02ED02EF-02FF03750384038503F604820606-0608060B060E060F06E906FD06FE07F609F209F309FA09FB0AF10B700BF3-0BFA0C7F0CF10CF20D790E3F0F01-0F030F13-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F13601390-139917DB194019E0-19FF1B61-1B6A1B74-1B7C1FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE20442052207A-207C208A-208C20A0-20B8210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B2140-2144214A-214D214F2190-2328232B-23E82400-24262440-244A249C-24E92500-26CD26CF-26E126E326E8-26FF2701-27042706-2709270C-27272729-274B274D274F-27522756-275E2761-276727942798-27AF27B1-27BE27C0-27C427C7-27CA27CC27D0-27E527F0-29822999-29D729DC-29FB29FE-2B4C2B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F309B309C319031913196-319F31C0-31E33200-321E322A-32503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A700-A716A720A721A789A78AA828-A82BA836-A839AA77-AA79FB29FDFCFDFDFE62FE64-FE66FE69FF04FF0BFF1C-FF1EFF3EFF40FF5CFF5EFFE0-FFE6FFE8-FFEEFFFCFFFD",
    Sm: "002B003C-003E007C007E00AC00B100D700F703F60606-060820442052207A-207C208A-208C2140-2144214B2190-2194219A219B21A021A321A621AE21CE21CF21D221D421F4-22FF2308-230B23202321237C239B-23B323DC-23E125B725C125F8-25FF266F27C0-27C427C7-27CA27CC27D0-27E527F0-27FF2900-29822999-29D729DC-29FB29FE-2AFF2B30-2B442B47-2B4CFB29FE62FE64-FE66FF0BFF1C-FF1EFF5CFF5EFFE2FFE9-FFEC",
    Sc: "002400A2-00A5060B09F209F309FB0AF10BF90E3F17DB20A0-20B8A838FDFCFE69FF04FFE0FFE1FFE5FFE6",
    Sk: "005E006000A800AF00B400B802C2-02C502D2-02DF02E5-02EB02ED02EF-02FF0375038403851FBD1FBF-1FC11FCD-1FCF1FDD-1FDF1FED-1FEF1FFD1FFE309B309CA700-A716A720A721A789A78AFF3EFF40FFE3",
    So: "00A600A700A900AE00B000B60482060E060F06E906FD06FE07F609FA0B700BF3-0BF80BFA0C7F0CF10CF20D790F01-0F030F13-0F170F1A-0F1F0F340F360F380FBE-0FC50FC7-0FCC0FCE0FCF0FD5-0FD8109E109F13601390-1399194019E0-19FF1B61-1B6A1B74-1B7C210021012103-21062108210921142116-2118211E-2123212521272129212E213A213B214A214C214D214F2195-2199219C-219F21A121A221A421A521A7-21AD21AF-21CD21D021D121D321D5-21F32300-2307230C-231F2322-2328232B-237B237D-239A23B4-23DB23E2-23E82400-24262440-244A249C-24E92500-25B625B8-25C025C2-25F72600-266E2670-26CD26CF-26E126E326E8-26FF2701-27042706-2709270C-27272729-274B274D274F-27522756-275E2761-276727942798-27AF27B1-27BE2800-28FF2B00-2B2F2B452B462B50-2B592CE5-2CEA2E80-2E992E9B-2EF32F00-2FD52FF0-2FFB300430123013302030363037303E303F319031913196-319F31C0-31E33200-321E322A-32503260-327F328A-32B032C0-32FE3300-33FF4DC0-4DFFA490-A4C6A828-A82BA836A837A839AA77-AA79FDFDFFE4FFE8FFEDFFEEFFFCFFFD",
    Z: "002000A01680180E2000-200A20282029202F205F3000",
    Zs: "002000A01680180E2000-200A202F205F3000",
    Zl: "2028",
    Zp: "2029",
    C: "0000-001F007F-009F00AD03780379037F-0383038B038D03A20526-05300557055805600588058B-059005C8-05CF05EB-05EF05F5-0605061C061D0620065F06DD070E070F074B074C07B2-07BF07FB-07FF082E082F083F-08FF093A093B094F095609570973-097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF00AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B72-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D290D3A-0D3C0D450D490D4E-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EDE-0EFF0F480F6D-0F700F8C-0F8F0F980FBD0FCD0FD9-0FFF10C6-10CF10FD-10FF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B-135E137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17B417B517DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BAB-1BAD1BBA-1BFF1C38-1C3A1C4A-1C4C1C80-1CCF1CF3-1CFF1DE7-1DFC1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF200B-200F202A-202E2060-206F20722073208F2095-209F20B9-20CF20F1-20FF218A-218F23E9-23FF2427-243F244B-245F26CE26E226E4-26E727002705270A270B2728274C274E2753-2755275F27602795-279727B027BF27CB27CD-27CF2B4D-2B4F2B5A-2BFF2C2F2C5F2CF2-2CF82D26-2D2F2D66-2D6E2D70-2D7F2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E32-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31B8-31BF31E4-31EF321F32FF4DB6-4DBF9FCC-9FFFA48D-A48FA4C7-A4CFA62C-A63FA660A661A674-A67BA698-A69FA6F8-A6FFA78D-A7FAA82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAE0-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-F8FFFA2EFA2FFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBB2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFD-FF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFFBFFFEFFFF",
    Cc: "0000-001F007F-009F",
    Cf: "00AD0600-060306DD070F17B417B5200B-200F202A-202E2060-2064206A-206FFEFFFFF9-FFFB",
    Co: "E000-F8FF",
    Cs: "D800-DFFF",
    Cn: "03780379037F-0383038B038D03A20526-05300557055805600588058B-059005C8-05CF05EB-05EF05F5-05FF06040605061C061D0620065F070E074B074C07B2-07BF07FB-07FF082E082F083F-08FF093A093B094F095609570973-097809800984098D098E0991099209A909B109B3-09B509BA09BB09C509C609C909CA09CF-09D609D8-09DB09DE09E409E509FC-0A000A040A0B-0A0E0A110A120A290A310A340A370A3A0A3B0A3D0A43-0A460A490A4A0A4E-0A500A52-0A580A5D0A5F-0A650A76-0A800A840A8E0A920AA90AB10AB40ABA0ABB0AC60ACA0ACE0ACF0AD1-0ADF0AE40AE50AF00AF2-0B000B040B0D0B0E0B110B120B290B310B340B3A0B3B0B450B460B490B4A0B4E-0B550B58-0B5B0B5E0B640B650B72-0B810B840B8B-0B8D0B910B96-0B980B9B0B9D0BA0-0BA20BA5-0BA70BAB-0BAD0BBA-0BBD0BC3-0BC50BC90BCE0BCF0BD1-0BD60BD8-0BE50BFB-0C000C040C0D0C110C290C340C3A-0C3C0C450C490C4E-0C540C570C5A-0C5F0C640C650C70-0C770C800C810C840C8D0C910CA90CB40CBA0CBB0CC50CC90CCE-0CD40CD7-0CDD0CDF0CE40CE50CF00CF3-0D010D040D0D0D110D290D3A-0D3C0D450D490D4E-0D560D58-0D5F0D640D650D76-0D780D800D810D840D97-0D990DB20DBC0DBE0DBF0DC7-0DC90DCB-0DCE0DD50DD70DE0-0DF10DF5-0E000E3B-0E3E0E5C-0E800E830E850E860E890E8B0E8C0E8E-0E930E980EA00EA40EA60EA80EA90EAC0EBA0EBE0EBF0EC50EC70ECE0ECF0EDA0EDB0EDE-0EFF0F480F6D-0F700F8C-0F8F0F980FBD0FCD0FD9-0FFF10C6-10CF10FD-10FF1249124E124F12571259125E125F1289128E128F12B112B612B712BF12C112C612C712D7131113161317135B-135E137D-137F139A-139F13F5-13FF169D-169F16F1-16FF170D1715-171F1737-173F1754-175F176D17711774-177F17DE17DF17EA-17EF17FA-17FF180F181A-181F1878-187F18AB-18AF18F6-18FF191D-191F192C-192F193C-193F1941-1943196E196F1975-197F19AC-19AF19CA-19CF19DB-19DD1A1C1A1D1A5F1A7D1A7E1A8A-1A8F1A9A-1A9F1AAE-1AFF1B4C-1B4F1B7D-1B7F1BAB-1BAD1BBA-1BFF1C38-1C3A1C4A-1C4C1C80-1CCF1CF3-1CFF1DE7-1DFC1F161F171F1E1F1F1F461F471F4E1F4F1F581F5A1F5C1F5E1F7E1F7F1FB51FC51FD41FD51FDC1FF01FF11FF51FFF2065-206920722073208F2095-209F20B9-20CF20F1-20FF218A-218F23E9-23FF2427-243F244B-245F26CE26E226E4-26E727002705270A270B2728274C274E2753-2755275F27602795-279727B027BF27CB27CD-27CF2B4D-2B4F2B5A-2BFF2C2F2C5F2CF2-2CF82D26-2D2F2D66-2D6E2D70-2D7F2D97-2D9F2DA72DAF2DB72DBF2DC72DCF2DD72DDF2E32-2E7F2E9A2EF4-2EFF2FD6-2FEF2FFC-2FFF3040309730983100-3104312E-3130318F31B8-31BF31E4-31EF321F32FF4DB6-4DBF9FCC-9FFFA48D-A48FA4C7-A4CFA62C-A63FA660A661A674-A67BA698-A69FA6F8-A6FFA78D-A7FAA82C-A82FA83A-A83FA878-A87FA8C5-A8CDA8DA-A8DFA8FC-A8FFA954-A95EA97D-A97FA9CEA9DA-A9DDA9E0-A9FFAA37-AA3FAA4EAA4FAA5AAA5BAA7C-AA7FAAC3-AADAAAE0-ABBFABEEABEFABFA-ABFFD7A4-D7AFD7C7-D7CAD7FC-D7FFFA2EFA2FFA6EFA6FFADA-FAFFFB07-FB12FB18-FB1CFB37FB3DFB3FFB42FB45FBB2-FBD2FD40-FD4FFD90FD91FDC8-FDEFFDFEFDFFFE1A-FE1FFE27-FE2FFE53FE67FE6C-FE6FFE75FEFDFEFEFF00FFBF-FFC1FFC8FFC9FFD0FFD1FFD8FFD9FFDD-FFDFFFE7FFEF-FFF8FFFEFFFF"
});

function addUnicodePackage(pack) {
    var codePoint = /\w{4}/g;
    for (var name in pack)
        exports.packages[name] = pack[name].replace(codePoint, "\\u$&");
}
});

ace.define("ace/token_iterator",["require","exports","module"], function(require, exports, module) {
"no use strict";
var TokenIterator = (function () {
    function TokenIterator(session, initialRow, initialColumn) {
        this.$session = session;
        this.$row = initialRow;
        this.$rowTokens = session.getTokens(initialRow);

        var token = session.getTokenAt(initialRow, initialColumn);
        this.$tokenIndex = token ? token.index : -1;
    }
    TokenIterator.prototype.stepBackward = function () {
        this.$tokenIndex -= 1;

        while (this.$tokenIndex < 0) {
            this.$row -= 1;
            if (this.$row < 0) {
                this.$row = 0;
                return null;
            }

            this.$rowTokens = this.$session.getTokens(this.$row);
            this.$tokenIndex = this.$rowTokens.length - 1;
        }

        return this.$rowTokens[this.$tokenIndex];
    };
    TokenIterator.prototype.stepForward = function () {
        this.$tokenIndex += 1;
        var rowCount;
        while (this.$tokenIndex >= this.$rowTokens.length) {
            this.$row += 1;
            if (!rowCount)
                rowCount = this.$session.getLength();
            if (this.$row >= rowCount) {
                this.$row = rowCount - 1;
                return null;
            }

            this.$rowTokens = this.$session.getTokens(this.$row);
            this.$tokenIndex = 0;
        }

        return this.$rowTokens[this.$tokenIndex];
    };
    TokenIterator.prototype.getCurrentToken = function () {
        return this.$rowTokens[this.$tokenIndex];
    };
    TokenIterator.prototype.getCurrentTokenRow = function () {
        return this.$row;
    };
    TokenIterator.prototype.getCurrentTokenColumn = function () {
        var rowTokens = this.$rowTokens;
        var tokenIndex = this.$tokenIndex;
        var column = rowTokens[tokenIndex].start;
        if (column !== undefined)
            return column;

        column = 0;
        while (tokenIndex > 0) {
            tokenIndex -= 1;
            column += rowTokens[tokenIndex].value.length;
        }

        return column;
    };
    return TokenIterator;
})();
exports.TokenIterator = TokenIterator;
});

ace.define("ace/mode/text",["require","exports","module","ace/tokenizer","ace/mode/text_highlight_rules","ace/mode/behaviour","ace/unicode","ace/lib/lang","ace/token_iterator","ace/range"], function(require, exports, module) {
"no use strict";
var Tokenizer = require("../tokenizer").Tokenizer;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var bm = require("./behaviour");
var unicode = require("../unicode");
var lang = require("../lib/lang");
var tkim = require("../token_iterator");
var rng = require("../range");

var Mode = (function () {
    function Mode() {
        this.HighlightRules = TextHighlightRules;
        this.$behaviour = new bm.Behaviour();
        this.tokenRe = new RegExp("^[" + unicode.packages.L + unicode.packages.Mn + unicode.packages.Mc + unicode.packages.Nd + unicode.packages.Pc + "\\$_]+", "g");
        this.nonTokenRe = new RegExp("^(?:[^" + unicode.packages.L + unicode.packages.Mn + unicode.packages.Mc + unicode.packages.Nd + unicode.packages.Pc + "\\$_]|\\s])+", "g");
        this.lineCommentStart = "";
        this.blockComment = "";
        this.$id = "ace/mode/text";
    }
    Mode.prototype.getTokenizer = function () {
        if (!this.$tokenizer) {
            this.$highlightRules = this.$highlightRules || new this.HighlightRules();
            this.$tokenizer = new Tokenizer(this.$highlightRules.getRules());
        }
        return this.$tokenizer;
    };

    Mode.prototype.toggleCommentLines = function (state, session, startRow, endRow) {
        var doc = session.doc;

        var ignoreBlankLines = true;
        var shouldRemove = true;
        var minIndent = Infinity;
        var tabSize = session.getTabSize();
        var insertAtTabStop = false;

        if (!this.lineCommentStart) {
            if (!this.blockComment)
                return false;
            var lineCommentStart = this.blockComment.start;
            var lineCommentEnd = this.blockComment.end;
            var regexpStart = new RegExp("^(\\s*)(?:" + lang.escapeRegExp(lineCommentStart) + ")");
            var regexpEnd = new RegExp("(?:" + lang.escapeRegExp(lineCommentEnd) + ")\\s*$");

            var comment = function (line, i) {
                if (testRemove(line, i))
                    return;
                if (!ignoreBlankLines || /\S/.test(line)) {
                    doc.insertInLine({ row: i, column: line.length }, lineCommentEnd);
                    doc.insertInLine({ row: i, column: minIndent }, lineCommentStart);
                }
            };

            var uncomment = function (line, i) {
                var m;
                if (m = line.match(regexpEnd))
                    doc.removeInLine(i, line.length - m[0].length, line.length);
                if (m = line.match(regexpStart))
                    doc.removeInLine(i, m[1].length, m[0].length);
            };

            var testRemove = function (line, row) {
                if (regexpStart.test(line))
                    return true;
                var tokens = session.getTokens(row);
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].type === 'comment')
                        return true;
                }
            };
        } else {
            if (Array.isArray(this.lineCommentStart)) {
                var regexpStartString = this.lineCommentStart.map(lang.escapeRegExp).join("|");
                var lineCommentStart = this.lineCommentStart[0];
            } else {
                var regexpStartString = lang.escapeRegExp(this.lineCommentStart);
                var lineCommentStart = this.lineCommentStart;
            }
            regexpStart = new RegExp("^(\\s*)(?:" + regexpStartString + ") ?");

            insertAtTabStop = session.getUseSoftTabs();

            var uncomment = function (line, i) {
                var m = line.match(regexpStart);
                if (!m)
                    return;
                var start = m[1].length, end = m[0].length;
                if (!shouldInsertSpace(line, start, end) && m[0][end - 1] == " ")
                    end--;
                doc.removeInLine(i, start, end);
            };
            var commentWithSpace = lineCommentStart + " ";
            var comment = function (line, i) {
                if (!ignoreBlankLines || /\S/.test(line)) {
                    if (shouldInsertSpace(line, minIndent, minIndent))
                        doc.insertInLine({ row: i, column: minIndent }, commentWithSpace);
                    else
                        doc.insertInLine({ row: i, column: minIndent }, lineCommentStart);
                }
            };
            var testRemove = function (line, i) {
                return regexpStart.test(line);
            };

            var shouldInsertSpace = function (line, before, after) {
                var spaces = 0;
                while (before-- && line.charAt(before) == " ")
                    spaces++;
                if (spaces % tabSize != 0)
                    return false;
                var spaces = 0;
                while (line.charAt(after++) == " ")
                    spaces++;
                if (tabSize > 2)
                    return spaces % tabSize != tabSize - 1;
                else
                    return spaces % tabSize == 0;
                return true;
            };
        }

        function iter(fun) {
            for (var i = startRow; i <= endRow; i++)
                fun(doc.getLine(i), i);
        }

        var minEmptyLength = Infinity;
        iter(function (line, row) {
            var indent = line.search(/\S/);
            if (indent !== -1) {
                if (indent < minIndent)
                    minIndent = indent;
                if (shouldRemove && !testRemove(line, row))
                    shouldRemove = false;
            } else if (minEmptyLength > line.length) {
                minEmptyLength = line.length;
            }
        });

        if (minIndent == Infinity) {
            minIndent = minEmptyLength;
            ignoreBlankLines = false;
            shouldRemove = false;
        }

        if (insertAtTabStop && minIndent % tabSize != 0)
            minIndent = Math.floor(minIndent / tabSize) * tabSize;

        iter(shouldRemove ? uncomment : comment);
    };

    Mode.prototype.toggleBlockComment = function (state, session, range, cursor) {
        var comment = this.blockComment;
        if (!comment)
            return;
        if (!comment.start && comment[0])
            comment = comment[0];

        var iterator = new tkim.TokenIterator(session, cursor.row, cursor.column);
        var token = iterator.getCurrentToken();

        var sel = session.selection;
        var initialRange = session.selection.toOrientedRange();
        var startRow, colDiff;

        if (token && /comment/.test(token.type)) {
            var startRange, endRange;
            while (token && /comment/.test(token.type)) {
                var i = token.value.indexOf(comment.start);
                if (i != -1) {
                    var row = iterator.getCurrentTokenRow();
                    var column = iterator.getCurrentTokenColumn() + i;
                    startRange = new rng.Range(row, column, row, column + comment.start.length);
                    break;
                }
                token = iterator.stepBackward();
            }

            var iterator = new tkim.TokenIterator(session, cursor.row, cursor.column);
            var token = iterator.getCurrentToken();
            while (token && /comment/.test(token.type)) {
                var i = token.value.indexOf(comment.end);
                if (i != -1) {
                    var row = iterator.getCurrentTokenRow();
                    var column = iterator.getCurrentTokenColumn() + i;
                    endRange = new rng.Range(row, column, row, column + comment.end.length);
                    break;
                }
                token = iterator.stepForward();
            }
            if (endRange)
                session.remove(endRange);
            if (startRange) {
                session.remove(startRange);
                startRow = startRange.start.row;
                colDiff = -comment.start.length;
            }
        } else {
            colDiff = comment.start.length;
            startRow = range.start.row;
            session.insert(range.end, comment.end);
            session.insert(range.start, comment.start);
        }
        if (initialRange.start.row == startRow)
            initialRange.start.column += colDiff;
        if (initialRange.end.row == startRow)
            initialRange.end.column += colDiff;
        session.selection.fromOrientedRange(initialRange);
    };

    Mode.prototype.getNextLineIndent = function (state, line, tab) {
        return this.$getIndent(line);
    };

    Mode.prototype.checkOutdent = function (state, line, input) {
        return false;
    };

    Mode.prototype.autoOutdent = function (state, doc, row) {
    };

    Mode.prototype.$getIndent = function (line) {
        return line.match(/^\s*/)[0];
    };

    Mode.prototype.createWorker = function (session) {
        return null;
    };

    Mode.prototype.createModeDelegates = function (mapping) {
        this.$embeds = [];
        this.$modes = {};
        for (var p in mapping) {
            if (mapping[p]) {
                this.$embeds.push(p);
                this.$modes[p] = new mapping[p]();
            }
        }

        var delegations = [
            'toggleBlockComment', 'toggleCommentLines', 'getNextLineIndent',
            'checkOutdent', 'autoOutdent', 'transformAction', 'getCompletions'];

        for (var k = 0; k < delegations.length; k++) {
            (function (scope) {
                var functionName = delegations[k];
                var defaultHandler = scope[functionName];
                scope[delegations[k]] = function () {
                    return this.$delegator(functionName, arguments, defaultHandler);
                };
            }(this));
        }
    };

    Mode.prototype.$delegator = function (method, args, defaultHandler) {
        var state = args[0];
        if (typeof state != "string")
            state = state[0];
        for (var i = 0; i < this.$embeds.length; i++) {
            if (!this.$modes[this.$embeds[i]])
                continue;

            var split = state.split(this.$embeds[i]);
            if (!split[0] && split[1]) {
                args[0] = split[1];
                var mode = this.$modes[this.$embeds[i]];
                return mode[method].apply(mode, args);
            }
        }
        var ret = defaultHandler.apply(this, args);
        return defaultHandler ? ret : undefined;
    };

    Mode.prototype.transformAction = function (state, action, editor, session, param) {
        if (this.$behaviour) {
            var behaviours = this.$behaviour.getBehaviours();
            for (var key in behaviours) {
                if (behaviours[key][action]) {
                    var ret = behaviours[key][action].apply(this, arguments);
                    if (ret) {
                        return ret;
                    }
                }
            }
        }
    };

    Mode.prototype.getKeywords = function (append) {
        if (!this.completionKeywords) {
            var rules = this.$tokenizer.rules;
            var completionKeywords = [];
            for (var rule in rules) {
                var ruleItr = rules[rule];
                for (var r = 0, l = ruleItr.length; r < l; r++) {
                    if (typeof ruleItr[r].token === "string") {
                        if (/keyword|support|storage/.test(ruleItr[r].token))
                            completionKeywords.push(ruleItr[r].regex);
                    } else if (typeof ruleItr[r].token === "object") {
                        for (var a = 0, aLength = ruleItr[r].token.length; a < aLength; a++) {
                            if (/keyword|support|storage/.test(ruleItr[r].token[a])) {
                                var rule = ruleItr[r].regex.match(/\(.+?\)/g)[a];
                                completionKeywords.push(rule.substr(1, rule.length - 2));
                            }
                        }
                    }
                }
            }
            this.completionKeywords = completionKeywords;
        }
        if (!append)
            return this.$keywordList;
        return completionKeywords.concat(this.$keywordList || []);
    };

    Mode.prototype.$createKeywordList = function () {
        if (!this.$highlightRules)
            this.getTokenizer();
        return this.$keywordList = this.$highlightRules.$keywordList || [];
    };

    Mode.prototype.getCompletions = function (state, session, pos, prefix) {
        var keywords = this.$keywordList || this.$createKeywordList();
        return keywords.map(function (word) {
            return {
                name: word,
                value: word,
                score: 0,
                meta: "keyword"
            };
        });
    };
    return Mode;
})();
exports.Mode = Mode;
});

ace.define("ace/lib/asserts",["require","exports","module"], function(require, exports, module) {
"no use strict";
exports.ENABLE_ASSERTS = true;

var AssertionError = (function () {
    function AssertionError(message, args) {
        this.name = 'AssertionError';
        this.message = message;
    }
    return AssertionError;
})();
exports.AssertionError = AssertionError;

function doAssertFailure(defaultMessage, defaultArgs, givenMessage, givenArgs) {
    var message = 'Assertion failed';
    if (givenMessage) {
        message += ': ' + givenMessage;
        var args = givenArgs;
    } else if (defaultMessage) {
        message += ': ' + defaultMessage;
        args = defaultArgs;
    }

    throw new AssertionError('' + message, args || []);
}

function assert(condition, message, args) {
    if (exports.ENABLE_ASSERTS && !condition) {
        doAssertFailure('', null, message, Array.prototype.slice.call(arguments, 2));
    }
    return condition;
}
exports.assert = assert;
;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/anchor",["require","exports","module","ace/lib/event_emitter","ace/lib/asserts"], function(require, exports, module) {
"no use strict";
var eve = require('./lib/event_emitter');
var asserts = require('./lib/asserts');
var Anchor = (function (_super) {
    __extends(Anchor, _super);
    function Anchor(doc, row, column) {
        _super.call(this);
        asserts.assert(typeof row === 'number', "row must be a number");
        asserts.assert(typeof column === 'number', "column must be a number");
        this.$onChange = this.onChange.bind(this);
        this.attach(doc);
        this.setPosition(row, column);
        this.$insertRight = false;
    }
    Anchor.prototype.getPosition = function () {
        return this.$clipPositionToDocument(this.row, this.column);
    };
    Anchor.prototype.getDocument = function () {
        return this.document;
    };
    Anchor.prototype.onChange = function (e) {
        var delta = e.data;
        var range = delta.range;

        if (range.start.row == range.end.row && range.start.row != this.row)
            return;

        if (range.start.row > this.row)
            return;

        if (range.start.row == this.row && range.start.column > this.column)
            return;

        var row = this.row;
        var column = this.column;
        var start = range.start;
        var end = range.end;

        if (delta.action === "insertText") {
            if (start.row === row && start.column <= column) {
                if (start.column === column && this.$insertRight) {
                } else if (start.row === end.row) {
                    column += end.column - start.column;
                } else {
                    column -= start.column;
                    row += end.row - start.row;
                }
            } else if (start.row !== end.row && start.row < row) {
                row += end.row - start.row;
            }
        } else if (delta.action === "insertLines") {
            if (start.row === row && column === 0 && this.$insertRight) {
            } else if (start.row <= row) {
                row += end.row - start.row;
            }
        } else if (delta.action === "removeText") {
            if (start.row === row && start.column < column) {
                if (end.column >= column)
                    column = start.column;
                else
                    column = Math.max(0, column - (end.column - start.column));
            } else if (start.row !== end.row && start.row < row) {
                if (end.row === row)
                    column = Math.max(0, column - end.column) + start.column;
                row -= (end.row - start.row);
            } else if (end.row === row) {
                row -= end.row - start.row;
                column = Math.max(0, column - end.column) + start.column;
            }
        } else if (delta.action == "removeLines") {
            if (start.row <= row) {
                if (end.row <= row)
                    row -= end.row - start.row;
                else {
                    row = start.row;
                    column = 0;
                }
            }
        }

        this.setPosition(row, column, true);
    };
    Anchor.prototype.setPosition = function (row, column, noClip) {
        var pos;
        if (noClip) {
            pos = {
                row: row,
                column: column
            };
        } else {
            pos = this.$clipPositionToDocument(row, column);
        }

        if (this.row == pos.row && this.column == pos.column)
            return;

        var old = {
            row: this.row,
            column: this.column
        };

        this.row = pos.row;
        this.column = pos.column;
        this._signal("change", {
            old: old,
            value: pos
        });
    };
    Anchor.prototype.detach = function () {
        this.document.removeEventListener("change", this.$onChange);
    };

    Anchor.prototype.attach = function (doc) {
        this.document = doc || this.document;
        this.document.on("change", this.$onChange);
    };
    Anchor.prototype.$clipPositionToDocument = function (row, column) {
        var pos = { row: 0, column: 0 };

        if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
        } else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        } else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
        }

        if (column < 0)
            pos.column = 0;

        return pos;
    };
    return Anchor;
})(eve.EventEmitterClass);
exports.Anchor = Anchor;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/document",["require","exports","module","ace/lib/event_emitter","ace/range","ace/anchor"], function(require, exports, module) {
"no use strict";
var eve = require('./lib/event_emitter');
var rangeModule = require('./range');
var anchorModule = require('./anchor');

var Anchor = anchorModule.Anchor;
var Range = rangeModule.Range;

var $split = (function () {
    function foo(text) {
        return text.replace(/\r\n|\r/g, "\n").split("\n");
    }
    function bar(text) {
        return text.split(/\r\n|\r|\n/);
    }
    if ("aaa".split(/a/).length === 0) {
        return foo;
    } else {
        return bar;
    }
})();

function $clipPosition(doc, position) {
    var length = doc.getLength();
    if (position.row >= length) {
        position.row = Math.max(0, length - 1);
        position.column = doc.getLine(length - 1).length;
    } else if (position.row < 0) {
        position.row = 0;
    }
    return position;
}
var Document = (function (_super) {
    __extends(Document, _super);
    function Document(text) {
        _super.call(this);
        this.$lines = [];
        this.$autoNewLine = "";
        this.$newLineMode = "auto";
        if (text.length === 0) {
            this.$lines = [""];
        } else if (Array.isArray(text)) {
            this._insertLines(0, text);
        } else {
            this.insert({ row: 0, column: 0 }, text);
        }
    }
    Document.prototype.setValue = function (text) {
        var len = this.getLength();
        this.remove(new Range(0, 0, len, this.getLine(len - 1).length));
        this.insert({ row: 0, column: 0 }, text);
    };
    Document.prototype.getValue = function () {
        return this.getAllLines().join(this.getNewLineCharacter());
    };
    Document.prototype.createAnchor = function (row, column) {
        return new Anchor(this, row, column);
    };
    Document.prototype.$detectNewLine = function (text) {
        var match = text.match(/^.*?(\r\n|\r|\n)/m);
        this.$autoNewLine = match ? match[1] : "\n";
        this._signal("changeNewLineMode");
    };
    Document.prototype.getNewLineCharacter = function () {
        switch (this.$newLineMode) {
            case "windows":
                return "\r\n";
            case "unix":
                return "\n";
            default:
                return this.$autoNewLine || "\n";
        }
    };
    Document.prototype.setNewLineMode = function (newLineMode) {
        if (this.$newLineMode === newLineMode)
            return;

        this.$newLineMode = newLineMode;
        this._signal("changeNewLineMode");
    };
    Document.prototype.getNewLineMode = function () {
        return this.$newLineMode;
    };
    Document.prototype.isNewLine = function (text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };
    Document.prototype.getLine = function (row) {
        return this.$lines[row] || "";
    };
    Document.prototype.getLines = function (firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow + 1);
    };
    Document.prototype.getAllLines = function () {
        return this.getLines(0, this.getLength());
    };
    Document.prototype.getLength = function () {
        return this.$lines.length;
    };
    Document.prototype.getTextRange = function (range) {
        if (range.start.row == range.end.row) {
            return this.getLine(range.start.row).substring(range.start.column, range.end.column);
        }
        var lines = this.getLines(range.start.row, range.end.row);
        lines[0] = (lines[0] || "").substring(range.start.column);
        var l = lines.length - 1;
        if (range.end.row - range.start.row == l) {
            lines[l] = lines[l].substring(0, range.end.column);
        }
        return lines.join(this.getNewLineCharacter());
    };
    Document.prototype.insert = function (position, text) {
        if (!text || text.length === 0)
            return position;

        position = $clipPosition(this, position);
        if (this.getLength() <= 1) {
            this.$detectNewLine(text);
        }

        var lines = $split(text);
        var firstLine = lines.splice(0, 1)[0];
        var lastLine = lines.length == 0 ? null : lines.splice(lines.length - 1, 1)[0];

        position = this.insertInLine(position, firstLine);
        if (lastLine !== null) {
            position = this.insertNewLine(position); // terminate first line
            position = this._insertLines(position.row, lines);
            position = this.insertInLine(position, lastLine || "");
        }
        return position;
    };
    Document.prototype.insertLines = function (row, lines) {
        if (row >= this.getLength())
            return this.insert({ row: row, column: 0 }, "\n" + lines.join("\n"));
        return this._insertLines(Math.max(row, 0), lines);
    };

    Document.prototype._insertLines = function (row, lines) {
        if (lines.length == 0)
            return { row: row, column: 0 };

        while (lines.length > 0xF000) {
            var end = this._insertLines(row, lines.slice(0, 0xF000));
            lines = lines.slice(0xF000);
            row = end.row;
        }

        var args = [row, 0];
        args.push.apply(args, lines);
        this.$lines.splice.apply(this.$lines, args);

        var range = new Range(row, 0, row + lines.length, 0);
        var delta = {
            action: "insertLines",
            range: range,
            lines: lines
        };
        this._signal("change", { data: delta });
        return range.end;
    };
    Document.prototype.insertNewLine = function (position) {
        position = $clipPosition(this, position);
        var line = this.$lines[position.row] || "";

        this.$lines[position.row] = line.substring(0, position.column);
        this.$lines.splice(position.row + 1, 0, line.substring(position.column, line.length));

        var end = {
            row: position.row + 1,
            column: 0
        };

        var delta = {
            action: "insertText",
            range: Range.fromPoints(position, end),
            text: this.getNewLineCharacter()
        };
        this._signal("change", { data: delta });

        return end;
    };
    Document.prototype.insertInLine = function (position, text) {
        if (text.length == 0)
            return position;

        var line = this.$lines[position.row] || "";

        this.$lines[position.row] = line.substring(0, position.column) + text + line.substring(position.column);

        var end = {
            row: position.row,
            column: position.column + text.length
        };

        var delta = { action: "insertText", range: Range.fromPoints(position, end), text: text };
        this._signal("change", { data: delta });

        return end;
    };
    Document.prototype.remove = function (range) {
        if (!(range instanceof Range))
            range = Range.fromPoints(range.start, range.end);
        range.start = $clipPosition(this, range.start);
        range.end = $clipPosition(this, range.end);

        if (range.isEmpty())
            return range.start;

        var firstRow = range.start.row;
        var lastRow = range.end.row;

        if (range.isMultiLine()) {
            var firstFullRow = range.start.column == 0 ? firstRow : firstRow + 1;
            var lastFullRow = lastRow - 1;

            if (range.end.column > 0)
                this.removeInLine(lastRow, 0, range.end.column);

            if (lastFullRow >= firstFullRow)
                this._removeLines(firstFullRow, lastFullRow);

            if (firstFullRow != firstRow) {
                this.removeInLine(firstRow, range.start.column, this.getLine(firstRow).length);
                this.removeNewLine(range.start.row);
            }
        } else {
            this.removeInLine(firstRow, range.start.column, range.end.column);
        }
        return range.start;
    };
    Document.prototype.removeInLine = function (row, startColumn, endColumn) {
        if (startColumn == endColumn)
            return;

        var range = new Range(row, startColumn, row, endColumn);
        var line = this.getLine(row);
        var removed = line.substring(startColumn, endColumn);
        var newLine = line.substring(0, startColumn) + line.substring(endColumn, line.length);
        this.$lines.splice(row, 1, newLine);

        var delta = {
            action: "removeText",
            range: range,
            text: removed
        };
        this._signal("change", { data: delta });
        return range.start;
    };
    Document.prototype.removeLines = function (firstRow, lastRow) {
        if (firstRow < 0 || lastRow >= this.getLength())
            return this.remove(new Range(firstRow, 0, lastRow + 1, 0));
        return this._removeLines(firstRow, lastRow);
    };

    Document.prototype._removeLines = function (firstRow, lastRow) {
        var range = new Range(firstRow, 0, lastRow + 1, 0);
        var removed = this.$lines.splice(firstRow, lastRow - firstRow + 1);

        var delta = {
            action: "removeLines",
            range: range,
            nl: this.getNewLineCharacter(),
            lines: removed
        };
        this._signal("change", { data: delta });
        return removed;
    };
    Document.prototype.removeNewLine = function (row) {
        var firstLine = this.getLine(row);
        var secondLine = this.getLine(row + 1);

        var range = new Range(row, firstLine.length, row + 1, 0);
        var line = firstLine + secondLine;

        this.$lines.splice(row, 2, line);

        var delta = {
            action: "removeText",
            range: range,
            text: this.getNewLineCharacter()
        };
        this._signal("change", { data: delta });
    };
    Document.prototype.replace = function (range, text) {
        if (!(range instanceof Range)) {
            range = Range.fromPoints(range.start, range.end);
        }
        if (text.length == 0 && range.isEmpty())
            return range.start;
        if (text == this.getTextRange(range))
            return range.end;

        this.remove(range);
        if (text) {
            var end = this.insert(range.start, text);
        } else {
            end = range.start;
        }

        return end;
    };
    Document.prototype.applyDeltas = function (deltas) {
        for (var i = 0; i < deltas.length; i++) {
            var delta = deltas[i];
            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this.insertLines(range.start.row, delta.lines);
            else if (delta.action == "insertText")
                this.insert(range.start, delta.text);
            else if (delta.action == "removeLines")
                this._removeLines(range.start.row, range.end.row - 1);
            else if (delta.action == "removeText")
                this.remove(range);
        }
    };
    Document.prototype.revertDeltas = function (deltas) {
        for (var i = deltas.length - 1; i >= 0; i--) {
            var delta = deltas[i];

            var range = Range.fromPoints(delta.range.start, delta.range.end);

            if (delta.action == "insertLines")
                this._removeLines(range.start.row, range.end.row - 1);
            else if (delta.action == "insertText")
                this.remove(range);
            else if (delta.action == "removeLines")
                this._insertLines(range.start.row, delta.lines);
            else if (delta.action == "removeText")
                this.insert(range.start, delta.text);
        }
    };
    Document.prototype.indexToPosition = function (index, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        for (var i = startRow || 0, l = lines.length; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
                return { row: i, column: index + lines[i].length + newlineLength };
        }
        return { row: l - 1, column: lines[l - 1].length };
    };
    Document.prototype.positionToIndex = function (pos, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        var index = 0;
        var row = Math.min(pos.row, lines.length);
        for (var i = startRow || 0; i < row; ++i)
            index += lines[i].length + newlineLength;

        return index + pos.column;
    };
    return Document;
})(eve.EventEmitterClass);
exports.Document = Document;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/background_tokenizer",["require","exports","module","ace/lib/event_emitter"], function(require, exports, module) {
"no use strict";
var eve = require("./lib/event_emitter");
var BackgroundTokenizer = (function (_super) {
    __extends(BackgroundTokenizer, _super);
    function BackgroundTokenizer(tokenizer, editor) {
        _super.call(this);
        this.running = 0;
        this.lines = [];
        this.states = [];
        this.currentLine = 0;
        this.tokenizer = tokenizer;

        var self = this;

        this.$worker = function () {
            if (!self.running) {
                return;
            }

            var workerStart = new Date();
            var currentLine = self.currentLine;
            var endLine = -1;
            var doc = self.doc;

            while (self.lines[currentLine])
                currentLine++;

            var startLine = currentLine;

            var len = doc.getLength();
            var processedLines = 0;
            self.running = 0;
            while (currentLine < len) {
                self.$tokenizeRow(currentLine);
                endLine = currentLine;
                do {
                    currentLine++;
                } while(self.lines[currentLine]);
                processedLines++;
                if ((processedLines % 5 === 0) && (new Date().getTime() - workerStart.getTime()) > 20) {
                    self.running = setTimeout(self.$worker, 20);
                    break;
                }
            }
            self.currentLine = currentLine;

            if (startLine <= endLine)
                self.fireUpdateEvent(startLine, endLine);
        };
    }
    BackgroundTokenizer.prototype.setTokenizer = function (tokenizer) {
        this.tokenizer = tokenizer;
        this.lines = [];
        this.states = [];

        this.start(0);
    };
    BackgroundTokenizer.prototype.setDocument = function (doc) {
        this.doc = doc;
        this.lines = [];
        this.states = [];

        this.stop();
    };
    BackgroundTokenizer.prototype.fireUpdateEvent = function (firstRow, lastRow) {
        var data = {
            first: firstRow,
            last: lastRow
        };
        this._signal("update", { data: data });
    };
    BackgroundTokenizer.prototype.start = function (startRow) {
        this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength());
        this.lines.splice(this.currentLine, this.lines.length);
        this.states.splice(this.currentLine, this.states.length);

        this.stop();
        this.running = setTimeout(this.$worker, 700);
    };

    BackgroundTokenizer.prototype.scheduleStart = function () {
        if (!this.running)
            this.running = setTimeout(this.$worker, 700);
    };

    BackgroundTokenizer.prototype.$updateOnChange = function (delta) {
        var range = delta.range;
        var startRow = range.start.row;
        var len = range.end.row - startRow;

        if (len === 0) {
            this.lines[startRow] = null;
        } else if (delta.action == "removeText" || delta.action == "removeLines") {
            this.lines.splice(startRow, len + 1, null);
            this.states.splice(startRow, len + 1, null);
        } else {
            var args = Array(len + 1);
            args.unshift(startRow, 1);
            this.lines.splice.apply(this.lines, args);
            this.states.splice.apply(this.states, args);
        }

        this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength());

        this.stop();
    };
    BackgroundTokenizer.prototype.stop = function () {
        if (this.running) {
            clearTimeout(this.running);
        }
        this.running = 0;
    };
    BackgroundTokenizer.prototype.getTokens = function (row) {
        return this.lines[row] || this.$tokenizeRow(row);
    };
    BackgroundTokenizer.prototype.getState = function (row) {
        if (this.currentLine == row) {
            this.$tokenizeRow(row);
        }
        return this.states[row] || "start";
    };

    BackgroundTokenizer.prototype.$tokenizeRow = function (row) {
        var line = this.doc.getLine(row);
        var state = this.states[row - 1];
        var data = this.tokenizer.getLineTokens(line, state);

        if (this.states[row] + "" !== data.state + "") {
            this.states[row] = data.state;
            this.lines[row + 1] = null;
            if (this.currentLine > row + 1)
                this.currentLine = row + 1;
        } else if (this.currentLine == row) {
            this.currentLine = row + 1;
        }

        return this.lines[row] = data.tokens;
    };
    return BackgroundTokenizer;
})(eve.EventEmitterClass);
exports.BackgroundTokenizer = BackgroundTokenizer;
});

ace.define("ace/search_highlight",["require","exports","module","ace/lib/lang","ace/range"], function(require, exports, module) {
"no use strict";
var lang = require("./lib/lang");

var rmo = require("./range");
var MAX_RANGES = 500;

var SearchHighlight = (function () {
    function SearchHighlight(regExp, clazz, type) {
        this.setRegexp(regExp);
        this.clazz = clazz;
        this.type = type || "text";
    }
    SearchHighlight.prototype.setRegexp = function (regExp) {
        if (this.regExp + "" == regExp + "")
            return;
        this.regExp = regExp;
        this.cache = [];
    };

    SearchHighlight.prototype.update = function (html, markerLayer, session, config) {
        if (!this.regExp)
            return;
        var start = config.firstRow, end = config.lastRow;

        for (var i = start; i <= end; i++) {
            var ranges = this.cache[i];
            if (ranges == null) {
                var matches = lang.getMatchOffsets(session.getLine(i), this.regExp);
                if (matches.length > MAX_RANGES) {
                    matches = matches.slice(0, MAX_RANGES);
                }
                ranges = matches.map(function (match) {
                    return new rmo.Range(i, match.offset, i, match.offset + match.length);
                });
                this.cache[i] = ranges.length ? ranges : [];
            }

            for (var j = ranges.length; j--;) {
                markerLayer.drawSingleLineMarker(html, ranges[j].toScreenRange(session), this.clazz, config);
            }
        }
    };
    return SearchHighlight;
})();
exports.SearchHighlight = SearchHighlight;
});

ace.define("ace/edit_session/bracket_match",["require","exports","module","ace/token_iterator","ace/range"], function(require, exports, module) {
"no use strict";
var tkm = require("../token_iterator");
var ram = require("../range");
var BracketMatchService = (function () {
    function BracketMatchService(host) {
        this.$brackets = {
            ")": "(",
            "(": ")",
            "]": "[",
            "[": "]",
            "{": "}",
            "}": "{"
        };
        this.$host = host;
    }
    BracketMatchService.prototype.findMatchingBracket = function (position, chr) {
        if (position.column === 0)
            return null;

        var charBeforeCursor = chr || this.$host.getLine(position.row).charAt(position.column - 1);
        if (charBeforeCursor === "")
            return null;

        var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
        if (!match)
            return null;

        if (match[1])
            return this.$findClosingBracket(match[1], position);
        else
            return this.$findOpeningBracket(match[2], position);
    };

    BracketMatchService.prototype.getBracketRange = function (pos) {
        var line = this.$host.getLine(pos.row);
        var before = true;
        var range;

        var chr = line.charAt(pos.column - 1);
        var match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
        if (!match) {
            chr = line.charAt(pos.column);
            pos = { row: pos.row, column: pos.column + 1 };
            match = chr && chr.match(/([\(\[\{])|([\)\]\}])/);
            before = false;
        }
        if (!match)
            return null;

        if (match[1]) {
            var closingPos = this.$findClosingBracket(match[1], pos);
            if (!closingPos)
                return null;
            range = ram.Range.fromPoints(pos, closingPos);
            if (!before) {
                range.end.column++;
                range.start.column--;
            }
            range['cursor'] = range.end;
        } else {
            var openingPos = this.$findOpeningBracket(match[2], pos);
            if (!openingPos)
                return null;
            range = ram.Range.fromPoints(openingPos, pos);
            if (!before) {
                range.start.column++;
                range.end.column--;
            }
            range['cursor'] = range.start;
        }

        return range;
    };

    BracketMatchService.prototype.$findOpeningBracket = function (bracket, position, typeRe) {
        var openBracket = this.$brackets[bracket];
        var depth = 1;

        var iterator = new tkm.TokenIterator(this.$host, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token)
            token = iterator.stepForward();
        if (!token)
            return;

        if (!typeRe) {
            typeRe = new RegExp("(\\.?" + token.type.replace(".", "\\.").replace("rparen", ".paren").replace(/\b(?:end|start|begin)\b/, "") + ")+");
        }
        var valueIndex = position.column - iterator.getCurrentTokenColumn() - 2;
        var value = token.value;

        while (true) {
            while (valueIndex >= 0) {
                var chr = value.charAt(valueIndex);
                if (chr == openBracket) {
                    depth -= 1;
                    if (depth === 0) {
                        return {
                            row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn() };
                    }
                } else if (chr === bracket) {
                    depth += 1;
                }
                valueIndex -= 1;
            }

            do {
                token = iterator.stepBackward();
            } while(token && !typeRe.test(token.type));

            if (token === null)
                break;

            value = token.value;
            valueIndex = value.length - 1;
        }

        return null;
    };

    BracketMatchService.prototype.$findClosingBracket = function (bracket, position, typeRe) {
        var closingBracket = this.$brackets[bracket];
        var depth = 1;

        var iterator = new tkm.TokenIterator(this.$host, position.row, position.column);
        var token = iterator.getCurrentToken();
        if (!token)
            token = iterator.stepForward();

        if (!token)
            return;

        if (!typeRe) {
            typeRe = new RegExp("(\\.?" + token.type.replace(".", "\\.").replace("lparen", ".paren").replace(/\b(?:end|start|begin)\b/, "") + ")+");
        }
        var valueIndex = position.column - iterator.getCurrentTokenColumn();

        while (true) {
            var value = token.value;
            var valueLength = value.length;
            while (valueIndex < valueLength) {
                var chr = value.charAt(valueIndex);
                if (chr == closingBracket) {
                    depth -= 1;
                    if (depth === 0) {
                        return {
                            row: iterator.getCurrentTokenRow(),
                            column: valueIndex + iterator.getCurrentTokenColumn() };
                    }
                } else if (chr === bracket) {
                    depth += 1;
                }
                valueIndex += 1;
            }

            do {
                token = iterator.stepForward();
            } while(token && !typeRe.test(token.type));

            if (token === null)
                break;

            valueIndex = 0;
        }

        return null;
    };
    return BracketMatchService;
})();
exports.BracketMatchService = BracketMatchService;
});

ace.define("ace/edit_session/fold_line",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
function FoldLine(foldData, folds) {
    this.foldData = foldData;
    if (Array.isArray(folds)) {
        this.folds = folds;
    } else {
        folds = this.folds = [ folds ];
    }

    var last = folds[folds.length - 1];
    this.range = new Range(folds[0].start.row, folds[0].start.column,
                           last.end.row, last.end.column);
    this.start = this.range.start;
    this.end   = this.range.end;

    this.folds.forEach(function(fold) {
        fold.setFoldLine(this);
    }, this);
}

(function() {
    this.shiftRow = function(shift) {
        this.start.row += shift;
        this.end.row += shift;
        this.folds.forEach(function(fold) {
            fold.start.row += shift;
            fold.end.row += shift;
        });
    };

    this.addFold = function(fold) {
        if (fold.sameRow) {
            if (fold.start.row < this.startRow || fold.endRow > this.endRow) {
                throw new Error("Can't add a fold to this FoldLine as it has no connection");
            }
            this.folds.push(fold);
            this.folds.sort(function(a, b) {
                return -a.range.compareEnd(b.start.row, b.start.column);
            });
            if (this.range.compareEnd(fold.start.row, fold.start.column) > 0) {
                this.end.row = fold.end.row;
                this.end.column =  fold.end.column;
            } else if (this.range.compareStart(fold.end.row, fold.end.column) < 0) {
                this.start.row = fold.start.row;
                this.start.column = fold.start.column;
            }
        } else if (fold.start.row == this.end.row) {
            this.folds.push(fold);
            this.end.row = fold.end.row;
            this.end.column = fold.end.column;
        } else if (fold.end.row == this.start.row) {
            this.folds.unshift(fold);
            this.start.row = fold.start.row;
            this.start.column = fold.start.column;
        } else {
            throw new Error("Trying to add fold to FoldRow that doesn't have a matching row");
        }
        fold.foldLine = this;
    };

    this.containsRow = function(row) {
        return row >= this.start.row && row <= this.end.row;
    };

    this.walk = function(callback, endRow, endColumn) {
        var lastEnd = 0,
            folds = this.folds,
            fold,
            cmp, stop, isNewRow = true;

        if (endRow == null) {
            endRow = this.end.row;
            endColumn = this.end.column;
        }

        for (var i = 0; i < folds.length; i++) {
            fold = folds[i];

            cmp = fold.range.compareStart(endRow, endColumn);
            if (cmp == -1) {
                callback(null, endRow, endColumn, lastEnd, isNewRow);
                return;
            }

            stop = callback(null, fold.start.row, fold.start.column, lastEnd, isNewRow);
            stop = !stop && callback(fold.placeholder, fold.start.row, fold.start.column, lastEnd);
            if (stop || cmp === 0) {
                return;
            }
            isNewRow = !fold.sameRow;
            lastEnd = fold.end.column;
        }
        callback(null, endRow, endColumn, lastEnd, isNewRow);
    };

    this.getNextFoldTo = function(row, column) {
        var fold, cmp;
        for (var i = 0; i < this.folds.length; i++) {
            fold = this.folds[i];
            cmp = fold.range.compareEnd(row, column);
            if (cmp == -1) {
                return {
                    fold: fold,
                    kind: "after"
                };
            } else if (cmp === 0) {
                return {
                    fold: fold,
                    kind: "inside"
                };
            }
        }
        return null;
    };

    this.addRemoveChars = function(row, column, len) {
        var ret = this.getNextFoldTo(row, column),
            fold, folds;
        if (ret) {
            fold = ret.fold;
            if (ret.kind == "inside"
                && fold.start.column != column
                && fold.start.row != row)
            {
                window.console && window.console.log(row, column, fold);
            } else if (fold.start.row == row) {
                folds = this.folds;
                var i = folds.indexOf(fold);
                if (i === 0) {
                    this.start.column += len;
                }
                for (i; i < folds.length; i++) {
                    fold = folds[i];
                    fold.start.column += len;
                    if (!fold.sameRow) {
                        return;
                    }
                    fold.end.column += len;
                }
                this.end.column += len;
            }
        }
    };

    this.split = function(row, column) {
        var pos = this.getNextFoldTo(row, column);
        
        if (!pos || pos.kind == "inside")
            return null;
            
        var fold = pos.fold;
        var folds = this.folds;
        var foldData = this.foldData;
        
        var i = folds.indexOf(fold);
        var foldBefore = folds[i - 1];
        this.end.row = foldBefore.end.row;
        this.end.column = foldBefore.end.column;
        folds = folds.splice(i, folds.length - i);

        var newFoldLine = new FoldLine(foldData, folds);
        foldData.splice(foldData.indexOf(this) + 1, 0, newFoldLine);
        return newFoldLine;
    };

    this.merge = function(foldLineNext) {
        var folds = foldLineNext.folds;
        for (var i = 0; i < folds.length; i++) {
            this.addFold(folds[i]);
        }
        var foldData = this.foldData;
        foldData.splice(foldData.indexOf(foldLineNext), 1);
    };

    this.toString = function() {
        var ret = [this.range.toString() + ": [" ];

        this.folds.forEach(function(fold) {
            ret.push("  " + fold.toString());
        });
        ret.push("]");
        return ret.join("\n");
    };

    this.idxToPosition = function(idx) {
        var lastFoldEndColumn = 0;

        for (var i = 0; i < this.folds.length; i++) {
            var fold = this.folds[i];

            idx -= fold.start.column - lastFoldEndColumn;
            if (idx < 0) {
                return {
                    row: fold.start.row,
                    column: fold.start.column + idx
                };
            }

            idx -= fold.placeholder.length;
            if (idx < 0) {
                return fold.start;
            }

            lastFoldEndColumn = fold.end.column;
        }

        return {
            row: this.end.row,
            column: this.end.column + idx
        };
    };
}).call(FoldLine.prototype);

exports.FoldLine = FoldLine;
});

ace.define("ace/range_list",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";
var Range = require("./range").Range;
var comparePoints = Range.comparePoints;

var RangeList = function() {
    this.ranges = [];
};

(function() {
    this.comparePoints = comparePoints;

    this.pointIndex = function(pos, excludeEdges, startIndex) {
        var list = this.ranges;

        for (var i = startIndex || 0; i < list.length; i++) {
            var range = list[i];
            var cmpEnd = comparePoints(pos, range.end);
            if (cmpEnd > 0)
                continue;
            var cmpStart = comparePoints(pos, range.start);
            if (cmpEnd === 0)
                return excludeEdges && cmpStart !== 0 ? -i-2 : i;
            if (cmpStart > 0 || (cmpStart === 0 && !excludeEdges))
                return i;

            return -i-1;
        }
        return -i - 1;
    };

    this.add = function(range) {
        var excludeEdges = !range.isEmpty();
        var startIndex = this.pointIndex(range.start, excludeEdges);
        if (startIndex < 0)
            startIndex = -startIndex - 1;

        var endIndex = this.pointIndex(range.end, excludeEdges, startIndex);

        if (endIndex < 0)
            endIndex = -endIndex - 1;
        else
            endIndex++;
        return this.ranges.splice(startIndex, endIndex - startIndex, range);
    };

    this.addList = function(list) {
        var removed = [];
        for (var i = list.length; i--; ) {
            removed.push.call(removed, this.add(list[i]));
        }
        return removed;
    };

    this.substractPoint = function(pos) {
        var i = this.pointIndex(pos);

        if (i >= 0)
            return this.ranges.splice(i, 1);
    };
    this.merge = function() {
        var removed = [];
        var list = this.ranges;
        
        list = list.sort(function(a, b) {
            return comparePoints(a.start, b.start);
        });
        
        var next = list[0], range;
        for (var i = 1; i < list.length; i++) {
            range = next;
            next = list[i];
            var cmp = comparePoints(range.end, next.start);
            if (cmp < 0)
                continue;

            if (cmp == 0 && !range.isEmpty() && !next.isEmpty())
                continue;

            if (comparePoints(range.end, next.end) < 0) {
                range.end.row = next.end.row;
                range.end.column = next.end.column;
            }

            list.splice(i, 1);
            removed.push(next);
            next = range;
            i--;
        }
        
        this.ranges = list;

        return removed;
    };

    this.contains = function(row, column) {
        return this.pointIndex({row: row, column: column}) >= 0;
    };

    this.containsPoint = function(pos) {
        return this.pointIndex(pos) >= 0;
    };

    this.rangeAtPoint = function(pos) {
        var i = this.pointIndex(pos);
        if (i >= 0)
            return this.ranges[i];
    };


    this.clipRows = function(startRow, endRow) {
        var list = this.ranges;
        if (list[0].start.row > endRow || list[list.length - 1].start.row < startRow)
            return [];

        var startIndex = this.pointIndex({row: startRow, column: 0});
        if (startIndex < 0)
            startIndex = -startIndex - 1;
        var endIndex = this.pointIndex({row: endRow, column: 0}, startIndex);
        if (endIndex < 0)
            endIndex = -endIndex - 1;

        var clipped = [];
        for (var i = startIndex; i < endIndex; i++) {
            clipped.push(list[i]);
        }
        return clipped;
    };

    this.removeAll = function() {
        return this.ranges.splice(0, this.ranges.length);
    };

    this.attach = function(session) {
        if (this.session)
            this.detach();

        this.session = session;
        this.onChange = this.$onChange.bind(this);

        this.session.on('change', this.onChange);
    };

    this.detach = function() {
        if (!this.session)
            return;
        this.session.removeListener('change', this.onChange);
        this.session = null;
    };

    this.$onChange = function(e) {
        var changeRange = e.data.range;
        if (e.data.action[0] == "i"){
            var start = changeRange.start;
            var end = changeRange.end;
        } else {
            var end = changeRange.start;
            var start = changeRange.end;
        }
        var startRow = start.row;
        var endRow = end.row;
        var lineDif = endRow - startRow;

        var colDiff = -start.column + end.column;
        var ranges = this.ranges;

        for (var i = 0, n = ranges.length; i < n; i++) {
            var r = ranges[i];
            if (r.end.row < startRow)
                continue;
            if (r.start.row > startRow)
                break;

            if (r.start.row == startRow && r.start.column >= start.column ) {
                if (r.start.column == start.column && this.$insertRight) {
                } else {
                    r.start.column += colDiff;
                    r.start.row += lineDif;
                }
            }
            if (r.end.row == startRow && r.end.column >= start.column) {
                if (r.end.column == start.column && this.$insertRight) {
                    continue;
                }
                if (r.end.column == start.column && colDiff > 0 && i < n - 1) {                
                    if (r.end.column > r.start.column && r.end.column == ranges[i+1].start.column)
                        r.end.column -= colDiff;
                }
                r.end.column += colDiff;
                r.end.row += lineDif;
            }
        }

        if (lineDif != 0 && i < n) {
            for (; i < n; i++) {
                var r = ranges[i];
                r.start.row += lineDif;
                r.end.row += lineDif;
            }
        }
    };

}).call(RangeList.prototype);

exports.RangeList = RangeList;
});

ace.define("ace/edit_session/fold",["require","exports","module","ace/range","ace/range_list","ace/lib/oop"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
var RangeList = require("../range_list").RangeList;
var oop = require("../lib/oop")
var Fold = exports.Fold = function(range, placeholder) {
    this.foldLine = null;
    this.placeholder = placeholder;
    this.range = range;
    this.start = range.start;
    this.end = range.end;

    this.sameRow = range.start.row == range.end.row;
    this.subFolds = this.ranges = [];
};

oop.inherits(Fold, RangeList);

(function() {

    this.toString = function() {
        return '"' + this.placeholder + '" ' + this.range.toString();
    };

    this.setFoldLine = function(foldLine) {
        this.foldLine = foldLine;
        this.subFolds.forEach(function(fold) {
            fold.setFoldLine(foldLine);
        });
    };

    this.clone = function() {
        var range = this.range.clone();
        var fold = new Fold(range, this.placeholder);
        this.subFolds.forEach(function(subFold) {
            fold.subFolds.push(subFold.clone());
        });
        fold.collapseChildren = this.collapseChildren;
        return fold;
    };

    this.addSubFold = function(fold) {
        if (this.range.isEqual(fold))
            return;

        if (!this.range.containsRange(fold))
            throw new Error("A fold can't intersect already existing fold" + fold.range + this.range);
        consumeRange(fold, this.start);

        var row = fold.start.row, column = fold.start.column;
        for (var i = 0, cmp = -1; i < this.subFolds.length; i++) {
            cmp = this.subFolds[i].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        var afterStart = this.subFolds[i];

        if (cmp == 0)
            return afterStart.addSubFold(fold);
        var row = fold.range.end.row, column = fold.range.end.column;
        for (var j = i, cmp = -1; j < this.subFolds.length; j++) {
            cmp = this.subFolds[j].range.compare(row, column);
            if (cmp != 1)
                break;
        }
        var afterEnd = this.subFolds[j];

        if (cmp == 0)
            throw new Error("A fold can't intersect already existing fold" + fold.range + this.range);

        var consumedFolds = this.subFolds.splice(i, j - i, fold);
        fold.setFoldLine(this.foldLine);

        return fold;
    };
    
    this.restoreRange = function(range) {
        return restoreRange(range, this.start);
    };

}).call(Fold.prototype);

function consumePoint(point, anchor) {
    point.row -= anchor.row;
    if (point.row == 0)
        point.column -= anchor.column;
}
function consumeRange(range, anchor) {
    consumePoint(range.start, anchor);
    consumePoint(range.end, anchor);
}
function restorePoint(point, anchor) {
    if (point.row == 0)
        point.column += anchor.column;
    point.row += anchor.row;
}
function restoreRange(range, anchor) {
    restorePoint(range.start, anchor);
    restorePoint(range.end, anchor);
}

});

ace.define("ace/edit_session/folding",["require","exports","module","ace/range","ace/edit_session/fold_line","ace/edit_session/fold","ace/token_iterator"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;
var FoldLine = require("./fold_line").FoldLine;
var Fold = require("./fold").Fold;
var TokenIterator = require("../token_iterator").TokenIterator;

function Folding() {
    this.getFoldAt = function(row, column, side) {
        var foldLine = this.getFoldLine(row);
        if (!foldLine)
            return null;

        var folds = foldLine.folds;
        for (var i = 0; i < folds.length; i++) {
            var fold = folds[i];
            if (fold.range.contains(row, column)) {
                if (side == 1 && fold.range.isEnd(row, column)) {
                    continue;
                } else if (side == -1 && fold.range.isStart(row, column)) {
                    continue;
                }
                return fold;
            }
        }
    };
    this.getFoldsInRange = function(range) {
        var start = range.start;
        var end = range.end;
        var foldLines = this.$foldData;
        var foundFolds = [];

        start.column += 1;
        end.column -= 1;

        for (var i = 0; i < foldLines.length; i++) {
            var cmp = foldLines[i].range.compareRange(range);
            if (cmp == 2) {
                continue;
            }
            else if (cmp == -2) {
                break;
            }

            var folds = foldLines[i].folds;
            for (var j = 0; j < folds.length; j++) {
                var fold = folds[j];
                cmp = fold.range.compareRange(range);
                if (cmp == -2) {
                    break;
                } else if (cmp == 2) {
                    continue;
                } else
                if (cmp == 42) {
                    break;
                }
                foundFolds.push(fold);
            }
        }
        start.column -= 1;
        end.column += 1;

        return foundFolds;
    };

    this.getFoldsInRangeList = function(ranges) {
        if (Array.isArray(ranges)) {
            var folds = [];
            ranges.forEach(function(range) {
                folds = folds.concat(this.getFoldsInRange(range));
            }, this);
        } else {
            var folds = this.getFoldsInRange(ranges);
        }
        return folds;
    }
    this.getAllFolds = function() {
        var folds = [];
        var foldLines = this.$foldData;
        
        for (var i = 0; i < foldLines.length; i++)
            for (var j = 0; j < foldLines[i].folds.length; j++)
                folds.push(foldLines[i].folds[j]);

        return folds;
    };
    this.getFoldStringAt = function(row, column, trim, foldLine) {
        foldLine = foldLine || this.getFoldLine(row);
        if (!foldLine)
            return null;

        var lastFold = {
            end: { column: 0 }
        };
        var str, fold;
        for (var i = 0; i < foldLine.folds.length; i++) {
            fold = foldLine.folds[i];
            var cmp = fold.range.compareEnd(row, column);
            if (cmp == -1) {
                str = this
                    .getLine(fold.start.row)
                    .substring(lastFold.end.column, fold.start.column);
                break;
            }
            else if (cmp === 0) {
                return null;
            }
            lastFold = fold;
        }
        if (!str)
            str = this.getLine(fold.start.row).substring(lastFold.end.column);

        if (trim == -1)
            return str.substring(0, column - lastFold.end.column);
        else if (trim == 1)
            return str.substring(column - lastFold.end.column);
        else
            return str;
    };

    this.getFoldLine = function(docRow, startFoldLine) {
        var foldData = this.$foldData;
        var i = 0;
        if (startFoldLine)
            i = foldData.indexOf(startFoldLine);
        if (i == -1)
            i = 0;
        for (i; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (foldLine.start.row <= docRow && foldLine.end.row >= docRow) {
                return foldLine;
            } else if (foldLine.end.row > docRow) {
                return null;
            }
        }
        return null;
    };
    this.getNextFoldLine = function(docRow, startFoldLine) {
        var foldData = this.$foldData;
        var i = 0;
        if (startFoldLine)
            i = foldData.indexOf(startFoldLine);
        if (i == -1)
            i = 0;
        for (i; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (foldLine.end.row >= docRow) {
                return foldLine;
            }
        }
        return null;
    };

    this.getFoldedRowCount = function(first, last) {
        var foldData = this.$foldData, rowCount = last-first+1;
        for (var i = 0; i < foldData.length; i++) {
            var foldLine = foldData[i],
                end = foldLine.end.row,
                start = foldLine.start.row;
            if (end >= last) {
                if(start < last) {
                    if(start >= first)
                        rowCount -= last-start;
                    else
                        rowCount = 0;//in one fold
                }
                break;
            } else if(end >= first){
                if (start >= first) //fold inside range
                    rowCount -=  end-start;
                else
                    rowCount -=  end-first+1;
            }
        }
        return rowCount;
    };

    this.$addFoldLine = function(foldLine) {
        this.$foldData.push(foldLine);
        this.$foldData.sort(function(a, b) {
            return a.start.row - b.start.row;
        });
        return foldLine;
    };
    this.addFold = function(placeholder, range) {
        var foldData = this.$foldData;
        var added = false;
        var fold;
        
        if (placeholder instanceof Fold)
            fold = placeholder;
        else {
            fold = new Fold(range, placeholder);
            fold.collapseChildren = range.collapseChildren;
        }
        this.$clipRangeToDocument(fold.range);

        var startRow = fold.start.row;
        var startColumn = fold.start.column;
        var endRow = fold.end.row;
        var endColumn = fold.end.column;
        if (!(startRow < endRow || 
            startRow == endRow && startColumn <= endColumn - 2))
            throw new Error("The range has to be at least 2 characters width");

        var startFold = this.getFoldAt(startRow, startColumn, 1);
        var endFold = this.getFoldAt(endRow, endColumn, -1);
        if (startFold && endFold == startFold)
            return startFold.addSubFold(fold);

        if (
            (startFold && !startFold.range.isStart(startRow, startColumn))
            || (endFold && !endFold.range.isEnd(endRow, endColumn))
        ) {
            throw new Error("A fold can't intersect already existing fold" + fold.range + startFold.range);
        }
        var folds = this.getFoldsInRange(fold.range);
        if (folds.length > 0) {
            this.removeFolds(folds);
            folds.forEach(function(subFold) {
                fold.addSubFold(subFold);
            });
        }

        for (var i = 0; i < foldData.length; i++) {
            var foldLine = foldData[i];
            if (endRow == foldLine.start.row) {
                foldLine.addFold(fold);
                added = true;
                break;
            } else if (startRow == foldLine.end.row) {
                foldLine.addFold(fold);
                added = true;
                if (!fold.sameRow) {
                    var foldLineNext = foldData[i + 1];
                    if (foldLineNext && foldLineNext.start.row == endRow) {
                        foldLine.merge(foldLineNext);
                        break;
                    }
                }
                break;
            } else if (endRow <= foldLine.start.row) {
                break;
            }
        }

        if (!added)
            foldLine = this.$addFoldLine(new FoldLine(this.$foldData, fold));

        if (this.$useWrapMode)
            this.$updateWrapData(foldLine.start.row, foldLine.start.row);
        else
            this.$updateRowLengthCache(foldLine.start.row, foldLine.start.row);
        this.$modified = true;
        this._emit("changeFold", { data: fold, action: "add" });

        return fold;
    };

    this.addFolds = function(folds) {
        folds.forEach(function(fold) {
            this.addFold(fold);
        }, this);
    };

    this.removeFold = function(fold) {
        var foldLine = fold.foldLine;
        var startRow = foldLine.start.row;
        var endRow = foldLine.end.row;

        var foldLines = this.$foldData;
        var folds = foldLine.folds;
        if (folds.length == 1) {
            foldLines.splice(foldLines.indexOf(foldLine), 1);
        } else
        if (foldLine.range.isEnd(fold.end.row, fold.end.column)) {
            folds.pop();
            foldLine.end.row = folds[folds.length - 1].end.row;
            foldLine.end.column = folds[folds.length - 1].end.column;
        } else
        if (foldLine.range.isStart(fold.start.row, fold.start.column)) {
            folds.shift();
            foldLine.start.row = folds[0].start.row;
            foldLine.start.column = folds[0].start.column;
        } else
        if (fold.sameRow) {
            folds.splice(folds.indexOf(fold), 1);
        } else
        {
            var newFoldLine = foldLine.split(fold.start.row, fold.start.column);
            folds = newFoldLine.folds;
            folds.shift();
            newFoldLine.start.row = folds[0].start.row;
            newFoldLine.start.column = folds[0].start.column;
        }

        if (!this.$updating) {
            if (this.$useWrapMode)
                this.$updateWrapData(startRow, endRow);
            else
                this.$updateRowLengthCache(startRow, endRow);
        }
        this.$modified = true;
        this._emit("changeFold", { data: fold, action: "remove" });
    };

    this.removeFolds = function(folds) {
        var cloneFolds = [];
        for (var i = 0; i < folds.length; i++) {
            cloneFolds.push(folds[i]);
        }

        cloneFolds.forEach(function(fold) {
            this.removeFold(fold);
        }, this);
        this.$modified = true;
    };

    this.expandFold = function(fold) {
        this.removeFold(fold);
        fold.subFolds.forEach(function(subFold) {
            fold.restoreRange(subFold);
            this.addFold(subFold);
        }, this);
        if (fold.collapseChildren > 0) {
            this.foldAll(fold.start.row+1, fold.end.row, fold.collapseChildren-1);
        }
        fold.subFolds = [];
    };

    this.expandFolds = function(folds) {
        folds.forEach(function(fold) {
            this.expandFold(fold);
        }, this);
    };

    this.unfold = function(location, expandInner) {
        var range, folds;
        if (location == null) {
            range = new Range(0, 0, this.getLength(), 0);
            expandInner = true;
        } else if (typeof location == "number")
            range = new Range(location, 0, location, this.getLine(location).length);
        else if ("row" in location)
            range = Range.fromPoints(location, location);
        else
            range = location;
        
        folds = this.getFoldsInRangeList(range);
        if (expandInner) {
            this.removeFolds(folds);
        } else {
            var subFolds = folds;
            while (subFolds.length) {
                this.expandFolds(subFolds);
                subFolds = this.getFoldsInRangeList(range);
            }
        }
        if (folds.length)
            return folds;
    };
    this.isRowFolded = function(docRow, startFoldRow) {
        return !!this.getFoldLine(docRow, startFoldRow);
    };

    this.getRowFoldEnd = function(docRow, startFoldRow) {
        var foldLine = this.getFoldLine(docRow, startFoldRow);
        return foldLine ? foldLine.end.row : docRow;
    };

    this.getRowFoldStart = function(docRow, startFoldRow) {
        var foldLine = this.getFoldLine(docRow, startFoldRow);
        return foldLine ? foldLine.start.row : docRow;
    };

    this.getFoldDisplayLine = function(foldLine, endRow, endColumn, startRow, startColumn) {
        if (startRow == null)
            startRow = foldLine.start.row;
        if (startColumn == null)
            startColumn = 0;
        if (endRow == null)
            endRow = foldLine.end.row;
        if (endColumn == null)
            endColumn = this.getLine(endRow).length;
        var doc = this.doc;
        var textLine = "";

        foldLine.walk(function(placeholder, row, column, lastColumn) {
            if (row < startRow)
                return;
            if (row == startRow) {
                if (column < startColumn)
                    return;
                lastColumn = Math.max(startColumn, lastColumn);
            }

            if (placeholder != null) {
                textLine += placeholder;
            } else {
                textLine += doc.getLine(row).substring(lastColumn, column);
            }
        }, endRow, endColumn);
        return textLine;
    };

    this.getDisplayLine = function(row, endColumn, startRow, startColumn) {
        var foldLine = this.getFoldLine(row);

        if (!foldLine) {
            var line;
            line = this.doc.getLine(row);
            return line.substring(startColumn || 0, endColumn || line.length);
        } else {
            return this.getFoldDisplayLine(
                foldLine, row, endColumn, startRow, startColumn);
        }
    };

    this.$cloneFoldData = function() {
        var fd = [];
        fd = this.$foldData.map(function(foldLine) {
            var folds = foldLine.folds.map(function(fold) {
                return fold.clone();
            });
            return new FoldLine(fd, folds);
        });

        return fd;
    };

    this.toggleFold = function(tryToUnfold) {
        var selection = this.selection;
        var range = selection.getRange();
        var fold;
        var bracketPos;

        if (range.isEmpty()) {
            var cursor = range.start;
            fold = this.getFoldAt(cursor.row, cursor.column);

            if (fold) {
                this.expandFold(fold);
                return;
            } else if (bracketPos = this.findMatchingBracket(cursor)) {
                if (range.comparePoint(bracketPos) == 1) {
                    range.end = bracketPos;
                } else {
                    range.start = bracketPos;
                    range.start.column++;
                    range.end.column--;
                }
            } else if (bracketPos = this.findMatchingBracket({row: cursor.row, column: cursor.column + 1})) {
                if (range.comparePoint(bracketPos) == 1)
                    range.end = bracketPos;
                else
                    range.start = bracketPos;

                range.start.column++;
            } else {
                range = this.getCommentFoldRange(cursor.row, cursor.column) || range;
            }
        } else {
            var folds = this.getFoldsInRange(range);
            if (tryToUnfold && folds.length) {
                this.expandFolds(folds);
                return;
            } else if (folds.length == 1 ) {
                fold = folds[0];
            }
        }

        if (!fold)
            fold = this.getFoldAt(range.start.row, range.start.column);

        if (fold && fold.range.toString() == range.toString()) {
            this.expandFold(fold);
            return;
        }

        var placeholder = "...";
        if (!range.isMultiLine()) {
            placeholder = this.getTextRange(range);
            if(placeholder.length < 4)
                return;
            placeholder = placeholder.trim().substring(0, 2) + "..";
        }

        this.addFold(placeholder, range);
    };

    this.getCommentFoldRange = function(row, column, dir) {
        var iterator = new TokenIterator(this, row, column);
        var token = iterator.getCurrentToken();
        if (token && /^comment|string/.test(token.type)) {
            var range = new Range();
            var re = new RegExp(token.type.replace(/\..*/, "\\."));
            if (dir != 1) {
                do {
                    token = iterator.stepBackward();
                } while(token && re.test(token.type));
                iterator.stepForward();
            }
            
            range.start.row = iterator.getCurrentTokenRow();
            range.start.column = iterator.getCurrentTokenColumn() + 2;

            iterator = new TokenIterator(this, row, column);
            
            if (dir != -1) {
                do {
                    token = iterator.stepForward();
                } while(token && re.test(token.type));
                token = iterator.stepBackward();
            } else
                token = iterator.getCurrentToken();

            range.end.row = iterator.getCurrentTokenRow();
            range.end.column = iterator.getCurrentTokenColumn() + token.value.length - 2;
            return range;
        }
    };

    this.foldAll = function(startRow, endRow, depth) {
        if (depth == undefined)
            depth = 100000; // JSON.stringify doesn't hanle Infinity
        var foldWidgets = this.foldWidgets;
        if (!foldWidgets)
            return; // mode doesn't support folding
        endRow = endRow || this.getLength();
        startRow = startRow || 0;
        for (var row = startRow; row < endRow; row++) {
            if (foldWidgets[row] == null)
                foldWidgets[row] = this.getFoldWidget(row);
            if (foldWidgets[row] != "start")
                continue;

            var range = this.getFoldWidgetRange(row);
            if (range && range.isMultiLine()
                && range.end.row <= endRow
                && range.start.row >= startRow
            ) {
                row = range.end.row;
                try {
                    var fold = this.addFold("...", range);
                    if (fold)
                        fold.collapseChildren = depth;
                } catch(e) {}
            }
        }
    };
    this.$foldStyles = {
        "manual": 1,
        "markbegin": 1,
        "markbeginend": 1
    };
    this.$foldStyle = "markbegin";
    this.setFoldStyle = function(style) {
        if (!this.$foldStyles[style])
            throw new Error("invalid fold style: " + style + "[" + Object.keys(this.$foldStyles).join(", ") + "]");
        
        if (this.$foldStyle == style)
            return;

        this.$foldStyle = style;
        
        if (style == "manual")
            this.unfold();
        var mode = this.$foldMode;
        this.$setFolding(null);
        this.$setFolding(mode);
    };

    this.$setFolding = function(foldMode) {
        if (this.$foldMode == foldMode)
            return;
            
        this.$foldMode = foldMode;
        
        this.removeListener('change', this.$updateFoldWidgets);
        this._emit("changeAnnotation");
        
        if (!foldMode || this.$foldStyle == "manual") {
            this.foldWidgets = null;
            return;
        }
        
        this.foldWidgets = [];
        this.getFoldWidget = foldMode.getFoldWidget.bind(foldMode, this, this.$foldStyle);
        this.getFoldWidgetRange = foldMode.getFoldWidgetRange.bind(foldMode, this, this.$foldStyle);
        
        this.$updateFoldWidgets = this.updateFoldWidgets.bind(this);
        this.on('change', this.$updateFoldWidgets);
        
    };

    this.getParentFoldRangeData = function (row, ignoreCurrent) {
        var fw = this.foldWidgets;
        if (!fw || (ignoreCurrent && fw[row]))
            return {};

        var i = row - 1, firstRange;
        while (i >= 0) {
            var c = fw[i];
            if (c == null)
                c = fw[i] = this.getFoldWidget(i);

            if (c == "start") {
                var range = this.getFoldWidgetRange(i);
                if (!firstRange)
                    firstRange = range;
                if (range && range.end.row >= row)
                    break;
            }
            i--;
        }

        return {
            range: i !== -1 && range,
            firstRange: firstRange
        };
    }

    this.onFoldWidgetClick = function(row, e) {
        e = e.domEvent;
        var options = {
            children: e.shiftKey,
            all: e.ctrlKey || e.metaKey,
            siblings: e.altKey
        };
        
        var range = this.$toggleFoldWidget(row, options);
        if (!range) {
            var el = (e.target || e.srcElement)
            if (el && /ace_fold-widget/.test(el.className))
                el.className += " ace_invalid";
        }
    };
    
    this.$toggleFoldWidget = function(row, options) {
        if (!this.getFoldWidget)
            return;
        var type = this.getFoldWidget(row);
        var line = this.getLine(row);

        var dir = type === "end" ? -1 : 1;
        var fold = this.getFoldAt(row, dir === -1 ? 0 : line.length, dir);

        if (fold) {
            if (options.children || options.all)
                this.removeFold(fold);
            else
                this.expandFold(fold);
            return;
        }

        var range = this.getFoldWidgetRange(row, true);
        if (range && !range.isMultiLine()) {
            fold = this.getFoldAt(range.start.row, range.start.column, 1);
            if (fold && range.isEqual(fold.range)) {
                this.removeFold(fold);
                return;
            }
        }
        
        if (options.siblings) {
            var data = this.getParentFoldRangeData(row);
            if (data.range) {
                var startRow = data.range.start.row + 1;
                var endRow = data.range.end.row;
            }
            this.foldAll(startRow, endRow, options.all ? 10000 : 0);
        } else if (options.children) {
            endRow = range ? range.end.row : this.getLength();
            this.foldAll(row + 1, range.end.row, options.all ? 10000 : 0);
        } else if (range) {
            if (options.all) 
                range.collapseChildren = 10000;
            this.addFold("...", range);
        }
        
        return range;
    };
    
    
    
    this.toggleFoldWidget = function(toggleParent) {
        var row = this.selection.getCursor().row;
        row = this.getRowFoldStart(row);
        var range = this.$toggleFoldWidget(row, {});
        
        if (range)
            return;
        var data = this.getParentFoldRangeData(row, true);
        range = data.range || data.firstRange;
        
        if (range) {
            row = range.start.row;
            var fold = this.getFoldAt(row, this.getLine(row).length, 1);

            if (fold) {
                this.removeFold(fold);
            } else {
                this.addFold("...", range);
            }
        }
    };

    this.updateFoldWidgets = function(e) {
        var delta = e.data;
        var range = delta.range;
        var firstRow = range.start.row;
        var len = range.end.row - firstRow;

        if (len === 0) {
            this.foldWidgets[firstRow] = null;
        } else if (delta.action == "removeText" || delta.action == "removeLines") {
            this.foldWidgets.splice(firstRow, len + 1, null);
        } else {
            var args = Array(len + 1);
            args.unshift(firstRow, 1);
            this.foldWidgets.splice.apply(this.foldWidgets, args);
        }
    };

}

exports.Folding = Folding;

});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/edit_session",["require","exports","module","ace/lib/lang","ace/config","ace/lib/event_emitter","ace/selection","ace/mode/text","ace/range","ace/document","ace/background_tokenizer","ace/search_highlight","ace/lib/asserts","ace/edit_session/bracket_match","ace/edit_session/folding"], function(require, exports, module) {
"no use strict";
var lang = require("./lib/lang");
var config = require("./config");
var eve = require("./lib/event_emitter");
var sem = require("./selection");
var txm = require("./mode/text");
var rng = require("./range");
var docm = require("./document");
var btm = require("./background_tokenizer");
var shm = require("./search_highlight");
var asserts = require('./lib/asserts');
var bkm = require("./edit_session/bracket_match");
var CHAR = 1, CHAR_EXT = 2, PLACEHOLDER_START = 3, PLACEHOLDER_BODY = 4, PUNCTUATION = 9, SPACE = 10, TAB = 11, TAB_SPACE = 12;
function isFullWidth(c) {
    if (c < 0x1100)
        return false;
    return c >= 0x1100 && c <= 0x115F || c >= 0x11A3 && c <= 0x11A7 || c >= 0x11FA && c <= 0x11FF || c >= 0x2329 && c <= 0x232A || c >= 0x2E80 && c <= 0x2E99 || c >= 0x2E9B && c <= 0x2EF3 || c >= 0x2F00 && c <= 0x2FD5 || c >= 0x2FF0 && c <= 0x2FFB || c >= 0x3000 && c <= 0x303E || c >= 0x3041 && c <= 0x3096 || c >= 0x3099 && c <= 0x30FF || c >= 0x3105 && c <= 0x312D || c >= 0x3131 && c <= 0x318E || c >= 0x3190 && c <= 0x31BA || c >= 0x31C0 && c <= 0x31E3 || c >= 0x31F0 && c <= 0x321E || c >= 0x3220 && c <= 0x3247 || c >= 0x3250 && c <= 0x32FE || c >= 0x3300 && c <= 0x4DBF || c >= 0x4E00 && c <= 0xA48C || c >= 0xA490 && c <= 0xA4C6 || c >= 0xA960 && c <= 0xA97C || c >= 0xAC00 && c <= 0xD7A3 || c >= 0xD7B0 && c <= 0xD7C6 || c >= 0xD7CB && c <= 0xD7FB || c >= 0xF900 && c <= 0xFAFF || c >= 0xFE10 && c <= 0xFE19 || c >= 0xFE30 && c <= 0xFE52 || c >= 0xFE54 && c <= 0xFE66 || c >= 0xFE68 && c <= 0xFE6B || c >= 0xFF01 && c <= 0xFF60 || c >= 0xFFE0 && c <= 0xFFE6;
}
var EditSession = (function (_super) {
    __extends(EditSession, _super);
    function EditSession(doc, mode) {
        _super.call(this);
        this.$breakpoints = [];
        this.$decorations = [];
        this.$frontMarkers = {};
        this.$backMarkers = {};
        this.$markerId = 1;
        this.$undoSelect = true;
        this.$foldData = [];
        this.$defaultUndoManager = { undo: function () {
            }, redo: function () {
            }, reset: function () {
            } };
        this.$overwrite = false;
        this.$modes = {};
        this.$mode = null;
        this.$modeId = null;
        this.$scrollTop = 0;
        this.$scrollLeft = 0;
        this.$wrapLimit = 80;
        this.$useWrapMode = false;
        this.$wrapLimitRange = {
            min: null,
            max: null
        };
        this.lineWidgets = null;
        this.$onChange = this.onChange.bind(this);
        this.$bracketMatcher = new bkm.BracketMatchService(this);
        this.getAnnotations = function () {
            return this.$annotations || [];
        };
        this.$foldData.toString = function () {
            return this.join("\n");
        };
        this.on("changeFold", this.onChangeFold.bind(this));

        if (typeof doc != "object" || !doc.getLine) {
            this.setDocument(new docm.Document(doc));
        }

        this.selection = new sem.Selection(this);

        config.resetOptions(this);
        this.setMode(mode);
        config._signal("session", this);
    }
    EditSession.prototype.setDocument = function (doc) {
        if (this.doc) {
            this.doc.removeListener("change", this.$onChange);
        }

        this.doc = doc;
        doc.on("change", this.$onChange);

        if (this.bgTokenizer) {
            this.bgTokenizer.setDocument(this.getDocument());
        }

        this.resetCaches();
    };
    EditSession.prototype.getDocument = function () {
        return this.doc;
    };
    EditSession.prototype.$resetRowCache = function (docRow) {
        if (!docRow) {
            this.$docRowCache = [];
            this.$screenRowCache = [];
            return;
        }
        var l = this.$docRowCache.length;
        var i = this.$getRowCacheIndex(this.$docRowCache, docRow) + 1;
        if (l > i) {
            this.$docRowCache.splice(i, l);
            this.$screenRowCache.splice(i, l);
        }
    };

    EditSession.prototype.$getRowCacheIndex = function (cacheArray, val) {
        var low = 0;
        var hi = cacheArray.length - 1;

        while (low <= hi) {
            var mid = (low + hi) >> 1;
            var c = cacheArray[mid];

            if (val > c)
                low = mid + 1;
            else if (val < c)
                hi = mid - 1;
            else
                return mid;
        }

        return low - 1;
    };

    EditSession.prototype.resetCaches = function () {
        this.$modified = true;
        this.$wrapData = [];
        this.$rowLengthCache = [];
        this.$resetRowCache(0);
        if (this.bgTokenizer)
            this.bgTokenizer.start(0);
    };

    EditSession.prototype.onChangeFold = function (e) {
        var fold = e.data;
        this.$resetRowCache(fold.start.row);
    };

    EditSession.prototype.onChange = function (e) {
        var delta = e.data;
        this.$modified = true;

        this.$resetRowCache(delta.range.start.row);

        var removedFolds = this.$updateInternalDataOnChange(e);
        if (!this.$fromUndo && this.$undoManager && !delta.ignore) {
            this.$deltasDoc.push(delta);
            if (removedFolds && removedFolds.length != 0) {
                this.$deltasFold.push({
                    action: "removeFolds",
                    folds: removedFolds
                });
            }

            this.$informUndoManager.schedule();
        }

        this.bgTokenizer.$updateOnChange(delta);
        this._signal("change", e);
    };
    EditSession.prototype.setValue = function (text) {
        this.doc.setValue(text);
        this.selection.moveTo(0, 0);

        this.$resetRowCache(0);
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];
        this.setUndoManager(this.$undoManager);
        this.getUndoManager().reset();
    };
    EditSession.prototype.toString = function () {
        return this.getValue();
    };
    EditSession.prototype.getValue = function () {
        return this.doc.getValue();
    };
    EditSession.prototype.getSelection = function () {
        return this.selection;
    };
    EditSession.prototype.getState = function (row) {
        return this.bgTokenizer.getState(row);
    };
    EditSession.prototype.getTokens = function (row) {
        return this.bgTokenizer.getTokens(row);
    };
    EditSession.prototype.getTokenAt = function (row, column) {
        var tokens = this.bgTokenizer.getTokens(row);
        var token, c = 0;
        if (column == null) {
            i = tokens.length - 1;
            c = this.getLine(row).length;
        } else {
            for (var i = 0; i < tokens.length; i++) {
                c += tokens[i].value.length;
                if (c >= column)
                    break;
            }
        }
        token = tokens[i];
        if (!token)
            return null;
        token.index = i;
        token.start = c - token.value.length;
        return token;
    };
    EditSession.prototype.setUndoManager = function (undoManager) {
        this.$undoManager = undoManager;
        this.$deltas = [];
        this.$deltasDoc = [];
        this.$deltasFold = [];

        if (this.$informUndoManager)
            this.$informUndoManager.cancel();

        if (undoManager) {
            var self = this;

            this.$syncInformUndoManager = function () {
                self.$informUndoManager.cancel();

                if (self.$deltasFold.length) {
                    self.$deltas.push({
                        group: "fold",
                        deltas: self.$deltasFold
                    });
                    self.$deltasFold = [];
                }

                if (self.$deltasDoc.length) {
                    self.$deltas.push({
                        group: "doc",
                        deltas: self.$deltasDoc
                    });
                    self.$deltasDoc = [];
                }

                if (self.$deltas.length > 0) {
                    undoManager.execute({
                        action: "aceupdate",
                        args: [self.$deltas, self],
                        merge: self.mergeUndoDeltas
                    });
                }
                self.mergeUndoDeltas = false;
                self.$deltas = [];
            };
            this.$informUndoManager = lang.delayedCall(this.$syncInformUndoManager);
        }
    };
    EditSession.prototype.markUndoGroup = function () {
        if (this.$syncInformUndoManager)
            this.$syncInformUndoManager();
    };
    EditSession.prototype.getUndoManager = function () {
        return this.$undoManager || this.$defaultUndoManager;
    };
    EditSession.prototype.getTabString = function () {
        if (this.getUseSoftTabs()) {
            return lang.stringRepeat(" ", this.getTabSize());
        } else {
            return "\t";
        }
    };
    EditSession.prototype.setUseSoftTabs = function (val) {
        this.setOption("useSoftTabs", val);
    };
    EditSession.prototype.getUseSoftTabs = function () {
        return this.$useSoftTabs && !this.$mode.$indentWithTabs;
    };
    EditSession.prototype.setTabSize = function (tabSize) {
        this.setOption("tabSize", tabSize);
    };
    EditSession.prototype.getTabSize = function () {
        return this.$tabSize;
    };
    EditSession.prototype.isTabStop = function (position) {
        return this.$useSoftTabs && (position.column % this.$tabSize === 0);
    };
    EditSession.prototype.setOverwrite = function (overwrite) {
        this.setOption("overwrite", overwrite);
    };
    EditSession.prototype.getOverwrite = function () {
        return this.$overwrite;
    };
    EditSession.prototype.toggleOverwrite = function () {
        this.setOverwrite(!this.$overwrite);
    };
    EditSession.prototype.addGutterDecoration = function (row, className) {
        if (!this.$decorations[row])
            this.$decorations[row] = "";
        this.$decorations[row] += " " + className;
        this._signal("changeBreakpoint", {});
    };
    EditSession.prototype.removeGutterDecoration = function (row, className) {
        this.$decorations[row] = (this.$decorations[row] || "").replace(" " + className, "");
        this._signal("changeBreakpoint", {});
    };
    EditSession.prototype.getBreakpoints = function () {
        return this.$breakpoints;
    };
    EditSession.prototype.setBreakpoints = function (rows) {
        this.$breakpoints = [];
        for (var i = 0; i < rows.length; i++) {
            this.$breakpoints[rows[i]] = "ace_breakpoint";
        }
        this._signal("changeBreakpoint", {});
    };
    EditSession.prototype.clearBreakpoints = function () {
        this.$breakpoints = [];
        this._signal("changeBreakpoint", {});
    };
    EditSession.prototype.setBreakpoint = function (row, className) {
        if (className === undefined)
            className = "ace_breakpoint";
        if (className)
            this.$breakpoints[row] = className;
        else
            delete this.$breakpoints[row];
        this._signal("changeBreakpoint", {});
    };
    EditSession.prototype.clearBreakpoint = function (row) {
        delete this.$breakpoints[row];
        this._signal("changeBreakpoint", {});
    };
    EditSession.prototype.addMarker = function (range, clazz, type, inFront) {
        var id = this.$markerId++;

        var marker = {
            range: range,
            type: type || "line",
            renderer: typeof type == "function" ? type : null,
            clazz: clazz,
            inFront: !!inFront,
            id: id
        };

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this._signal("changeFrontMarker");
        } else {
            this.$backMarkers[id] = marker;
            this._signal("changeBackMarker");
        }

        return id;
    };
    EditSession.prototype.addDynamicMarker = function (marker, inFront) {
        if (!marker.update)
            return;
        var id = this.$markerId++;
        marker.id = id;
        marker.inFront = !!inFront;

        if (inFront) {
            this.$frontMarkers[id] = marker;
            this._signal("changeFrontMarker");
        } else {
            this.$backMarkers[id] = marker;
            this._signal("changeBackMarker");
        }

        return marker;
    };
    EditSession.prototype.removeMarker = function (markerId) {
        var marker = this.$frontMarkers[markerId] || this.$backMarkers[markerId];
        if (!marker)
            return;

        var markers = marker.inFront ? this.$frontMarkers : this.$backMarkers;
        if (marker) {
            delete (markers[markerId]);
            this._signal(marker.inFront ? "changeFrontMarker" : "changeBackMarker");
        }
    };
    EditSession.prototype.getMarkers = function (inFront) {
        return inFront ? this.$frontMarkers : this.$backMarkers;
    };

    EditSession.prototype.highlight = function (re) {
        if (!this.$searchHighlight) {
            var highlight = new shm.SearchHighlight(null, "ace_selected-word", "text");
            this.$searchHighlight = this.addDynamicMarker(highlight);
        }
        this.$searchHighlight.setRegexp(re);
    };
    EditSession.prototype.highlightLines = function (startRow, endRow, clazz, inFront) {
        if (typeof endRow != "number") {
            clazz = endRow;
            endRow = startRow;
        }
        if (!clazz)
            clazz = "ace_step";

        var range = new rng.Range(startRow, 0, endRow, Infinity);
        range.id = this.addMarker(range, clazz, "fullLine", inFront);
        return range;
    };
    EditSession.prototype.setAnnotations = function (annotations) {
        this.$annotations = annotations;
        this._signal("changeAnnotation", {});
    };
    EditSession.prototype.clearAnnotations = function () {
        this.setAnnotations([]);
    };
    EditSession.prototype.$detectNewLine = function (text) {
        var match = text.match(/^.*?(\r?\n)/m);
        if (match) {
            this.$autoNewLine = match[1];
        } else {
            this.$autoNewLine = "\n";
        }
    };
    EditSession.prototype.getWordRange = function (row, column) {
        var line = this.getLine(row);

        var inToken = false;
        if (column > 0)
            inToken = !!line.charAt(column - 1).match(this.tokenRe);

        if (!inToken)
            inToken = !!line.charAt(column).match(this.tokenRe);

        if (inToken)
            var re = this.tokenRe;
        else if (/^\s+$/.test(line.slice(column - 1, column + 1)))
            var re = /\s/;
        else
            var re = this.nonTokenRe;

        var start = column;
        if (start > 0) {
            do {
                start--;
            } while(start >= 0 && line.charAt(start).match(re));
            start++;
        }

        var end = column;
        while (end < line.length && line.charAt(end).match(re)) {
            end++;
        }

        return new rng.Range(row, start, row, end);
    };
    EditSession.prototype.getAWordRange = function (row, column) {
        var wordRange = this.getWordRange(row, column);
        var line = this.getLine(wordRange.end.row);

        while (line.charAt(wordRange.end.column).match(/[ \t]/)) {
            wordRange.end.column += 1;
        }
        return wordRange;
    };
    EditSession.prototype.setNewLineMode = function (newLineMode) {
        this.doc.setNewLineMode(newLineMode);
    };
    EditSession.prototype.getNewLineMode = function () {
        return this.doc.getNewLineMode();
    };
    EditSession.prototype.setUseWorker = function (useWorker) {
        this.setOption("useWorker", useWorker);
    };
    EditSession.prototype.getUseWorker = function () {
        return this.$useWorker;
    };
    EditSession.prototype.onReloadTokenizer = function (e) {
        var rows = e.data;
        this.bgTokenizer.start(rows.first);
        this._signal("tokenizerUpdate", e);
    };
    EditSession.prototype.setMode = function (mode, cb) {
        if (mode && typeof mode === "object") {
            if (mode.getTokenizer) {
                return this.$onChangeMode(mode);
            }
            var options = mode;
            var path = options.path;
        } else {
            path = mode || "ace/mode/text";
        }
        if (!this.$modes["ace/mode/text"])
            this.$modes["ace/mode/text"] = new txm.Mode();

        if (this.$modes[path] && !options) {
            this.$onChangeMode(this.$modes[path]);
            cb && cb();
            return;
        }
        this.$modeId = path;
        config.loadModule(["mode", path], function (m) {
            if (this.$modeId !== path)
                return cb && cb();
            if (this.$modes[path] && !options)
                return this.$onChangeMode(this.$modes[path]);
            if (m && m.Mode) {
                m = new m.Mode(options);
                if (!options) {
                    this.$modes[path] = m;
                    m.$id = path;
                }
                this.$onChangeMode(m);
                cb && cb();
            }
        }.bind(this));
        if (!this.$mode) {
            this.$onChangeMode(this.$modes["ace/mode/text"], true);
        }
    };

    EditSession.prototype.$onChangeMode = function (mode, $isPlaceholder) {
        if (!$isPlaceholder)
            this.$modeId = mode.$id;
        if (this.$mode === mode)
            return;

        this.$mode = mode;

        this.$stopWorker();

        if (this.$useWorker)
            this.$startWorker();

        var tokenizer = mode.getTokenizer();

        if (tokenizer.addEventListener !== undefined) {
            var onReloadTokenizer = this.onReloadTokenizer.bind(this);
            tokenizer.addEventListener("update", onReloadTokenizer);
        }

        if (!this.bgTokenizer) {
            this.bgTokenizer = new btm.BackgroundTokenizer(tokenizer);
            var _self = this;
            this.bgTokenizer.addEventListener("update", function (e) {
                _self._signal("tokenizerUpdate", e);
            });
        } else {
            this.bgTokenizer.setTokenizer(tokenizer);
        }

        this.bgTokenizer.setDocument(this.getDocument());

        this.tokenRe = mode.tokenRe;
        this.nonTokenRe = mode.nonTokenRe;

        if (!$isPlaceholder) {
            this.$options.wrapMethod.set.call(this, this.$wrapMethod);
            this.$setFolding(mode.foldingRules);
            this.bgTokenizer.start(0);
            this._emit("changeMode");
        }
    };

    EditSession.prototype.$stopWorker = function () {
        if (this.$worker) {
            this.$worker.terminate();
        }

        this.$worker = null;
    };

    EditSession.prototype.$startWorker = function () {
        try  {
            this.$worker = this.$mode.createWorker(this);
        } catch (e) {
            console.log("Could not load worker");
            console.log(e);
            this.$worker = null;
        }
    };
    EditSession.prototype.getMode = function () {
        return this.$mode;
    };
    EditSession.prototype.setScrollTop = function (scrollTop) {
        if (this.$scrollTop === scrollTop || isNaN(scrollTop)) {
            return;
        }
        this.$scrollTop = scrollTop;
        this._signal("changeScrollTop", scrollTop);
    };
    EditSession.prototype.getScrollTop = function () {
        return this.$scrollTop;
    };
    EditSession.prototype.setScrollLeft = function (scrollLeft) {
        if (this.$scrollLeft === scrollLeft || isNaN(scrollLeft))
            return;

        this.$scrollLeft = scrollLeft;
        this._signal("changeScrollLeft", scrollLeft);
    };
    EditSession.prototype.getScrollLeft = function () {
        return this.$scrollLeft;
    };
    EditSession.prototype.getScreenWidth = function () {
        this.$computeWidth();
        if (this.lineWidgets)
            return Math.max(this.getLineWidgetMaxWidth(), this.screenWidth);
        return this.screenWidth;
    };

    EditSession.prototype.getLineWidgetMaxWidth = function () {
        if (this.lineWidgetsWidth != null)
            return this.lineWidgetsWidth;
        var width = 0;
        this.lineWidgets.forEach(function (w) {
            if (w && w.screenWidth > width)
                width = w.screenWidth;
        });
        return this.lineWidgetWidth = width;
    };

    EditSession.prototype.$computeWidth = function (force) {
        if (this.$modified || force) {
            this.$modified = false;

            if (this.$useWrapMode)
                return this.screenWidth = this.$wrapLimit;

            var lines = this.doc.getAllLines();
            var cache = this.$rowLengthCache;
            var longestScreenLine = 0;
            var foldIndex = 0;
            var foldLine = this.$foldData[foldIndex];
            var foldStart = foldLine ? foldLine.start.row : Infinity;
            var len = lines.length;

            for (var i = 0; i < len; i++) {
                if (i > foldStart) {
                    i = foldLine.end.row + 1;
                    if (i >= len)
                        break;
                    foldLine = this.$foldData[foldIndex++];
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }

                if (cache[i] == null)
                    cache[i] = this.$getStringScreenWidth(lines[i])[0];

                if (cache[i] > longestScreenLine)
                    longestScreenLine = cache[i];
            }
            this.screenWidth = longestScreenLine;
        }
    };
    EditSession.prototype.getLine = function (row) {
        return this.doc.getLine(row);
    };
    EditSession.prototype.getLines = function (firstRow, lastRow) {
        return this.doc.getLines(firstRow, lastRow);
    };
    EditSession.prototype.getLength = function () {
        return this.doc.getLength();
    };
    EditSession.prototype.getTextRange = function (range) {
        return this.doc.getTextRange(range || this.selection.getRange());
    };
    EditSession.prototype.insert = function (position, text) {
        return this.doc.insert(position, text);
    };
    EditSession.prototype.remove = function (range) {
        return this.doc.remove(range);
    };
    EditSession.prototype.undoChanges = function (deltas, dontSelect) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        var lastUndoRange = null;
        for (var i = deltas.length - 1; i != -1; i--) {
            var delta = deltas[i];
            if (delta.group == "doc") {
                this.doc.revertDeltas(delta.deltas);
                lastUndoRange = this.$getUndoSelection(delta.deltas, true, lastUndoRange);
            } else {
                delta.deltas.forEach(function (foldDelta) {
                    this.addFolds(foldDelta.folds);
                }, this);
            }
        }
        this.$fromUndo = false;
        lastUndoRange && this.$undoSelect && !dontSelect && this.selection.setSelectionRange(lastUndoRange);
        return lastUndoRange;
    };
    EditSession.prototype.redoChanges = function (deltas, dontSelect) {
        if (!deltas.length)
            return;

        this.$fromUndo = true;
        var lastUndoRange = null;
        for (var i = 0; i < deltas.length; i++) {
            var delta = deltas[i];
            if (delta.group == "doc") {
                this.doc.applyDeltas(delta.deltas);
                lastUndoRange = this.$getUndoSelection(delta.deltas, false, lastUndoRange);
            }
        }
        this.$fromUndo = false;
        lastUndoRange && this.$undoSelect && !dontSelect && this.selection.setSelectionRange(lastUndoRange);
        return lastUndoRange;
    };
    EditSession.prototype.setUndoSelect = function (enable) {
        this.$undoSelect = enable;
    };

    EditSession.prototype.$getUndoSelection = function (deltas, isUndo, lastUndoRange) {
        function isInsert(delta) {
            var insert = delta.action === "insertText" || delta.action === "insertLines";
            return isUndo ? !insert : insert;
        }

        var delta = deltas[0];
        var range, point;
        var lastDeltaIsInsert = false;
        if (isInsert(delta)) {
            range = rng.Range.fromPoints(delta.range.start, delta.range.end);
            lastDeltaIsInsert = true;
        } else {
            range = rng.Range.fromPoints(delta.range.start, delta.range.start);
            lastDeltaIsInsert = false;
        }

        for (var i = 1; i < deltas.length; i++) {
            delta = deltas[i];
            if (isInsert(delta)) {
                point = delta.range.start;
                if (range.compare(point.row, point.column) == -1) {
                    range.setStart(delta.range.start);
                }
                point = delta.range.end;
                if (range.compare(point.row, point.column) == 1) {
                    range.setEnd(delta.range.end);
                }
                lastDeltaIsInsert = true;
            } else {
                point = delta.range.start;
                if (range.compare(point.row, point.column) == -1) {
                    range = rng.Range.fromPoints(delta.range.start, delta.range.start);
                }
                lastDeltaIsInsert = false;
            }
        }
        if (lastUndoRange != null) {
            if (rng.Range.comparePoints(lastUndoRange.start, range.start) === 0) {
                lastUndoRange.start.column += range.end.column - range.start.column;
                lastUndoRange.end.column += range.end.column - range.start.column;
            }

            var cmp = lastUndoRange.compareRange(range);
            if (cmp == 1) {
                range.setStart(lastUndoRange.start);
            } else if (cmp == -1) {
                range.setEnd(lastUndoRange.end);
            }
        }

        return range;
    };
    EditSession.prototype.replace = function (range, text) {
        return this.doc.replace(range, text);
    };
    EditSession.prototype.moveText = function (fromRange, toPosition, copy) {
        var text = this.getTextRange(fromRange);
        var folds = this.getFoldsInRange(fromRange);
        var rowDiff;
        var colDiff;

        var toRange = rng.Range.fromPoints(toPosition, toPosition);
        if (!copy) {
            this.remove(fromRange);
            rowDiff = fromRange.start.row - fromRange.end.row;
            colDiff = rowDiff ? -fromRange.end.column : fromRange.start.column - fromRange.end.column;
            if (colDiff) {
                if (toRange.start.row == fromRange.end.row && toRange.start.column > fromRange.end.column) {
                    toRange.start.column += colDiff;
                }
                if (toRange.end.row == fromRange.end.row && toRange.end.column > fromRange.end.column) {
                    toRange.end.column += colDiff;
                }
            }
            if (rowDiff && toRange.start.row >= fromRange.end.row) {
                toRange.start.row += rowDiff;
                toRange.end.row += rowDiff;
            }
        }

        toRange.end = this.insert(toRange.start, text);
        if (folds.length) {
            var oldStart = fromRange.start;
            var newStart = toRange.start;
            rowDiff = newStart.row - oldStart.row;
            colDiff = newStart.column - oldStart.column;
            this.addFolds(folds.map(function (x) {
                x = x.clone();
                if (x.start.row == oldStart.row) {
                    x.start.column += colDiff;
                }
                if (x.end.row == oldStart.row) {
                    x.end.column += colDiff;
                }
                x.start.row += rowDiff;
                x.end.row += rowDiff;
                return x;
            }));
        }

        return toRange;
    };
    EditSession.prototype.indentRows = function (startRow, endRow, indentString) {
        indentString = indentString.replace(/\t/g, this.getTabString());
        for (var row = startRow; row <= endRow; row++)
            this.insert({ row: row, column: 0 }, indentString);
    };
    EditSession.prototype.outdentRows = function (range) {
        var rowRange = range.collapseRows();
        var deleteRange = new rng.Range(0, 0, 0, 0);
        var size = this.getTabSize();

        for (var i = rowRange.start.row; i <= rowRange.end.row; ++i) {
            var line = this.getLine(i);

            deleteRange.start.row = i;
            deleteRange.end.row = i;
            for (var j = 0; j < size; ++j)
                if (line.charAt(j) != ' ')
                    break;
            if (j < size && line.charAt(j) == '\t') {
                deleteRange.start.column = j;
                deleteRange.end.column = j + 1;
            } else {
                deleteRange.start.column = 0;
                deleteRange.end.column = j;
            }
            this.remove(deleteRange);
        }
    };

    EditSession.prototype.$moveLines = function (firstRow, lastRow, dir) {
        firstRow = this.getRowFoldStart(firstRow);
        lastRow = this.getRowFoldEnd(lastRow);
        if (dir < 0) {
            var row = this.getRowFoldStart(firstRow + dir);
            if (row < 0)
                return 0;
            var diff = row - firstRow;
        } else if (dir > 0) {
            var row = this.getRowFoldEnd(lastRow + dir);
            if (row > this.doc.getLength() - 1)
                return 0;
            var diff = row - lastRow;
        } else {
            firstRow = this.$clipRowToDocument(firstRow);
            lastRow = this.$clipRowToDocument(lastRow);
            var diff = lastRow - firstRow + 1;
        }

        var range = new rng.Range(firstRow, 0, lastRow, Number.MAX_VALUE);
        var folds = this.getFoldsInRange(range).map(function (x) {
            x = x.clone();
            x.start.row += diff;
            x.end.row += diff;
            return x;
        });

        var lines = dir == 0 ? this.doc.getLines(firstRow, lastRow) : this.doc.removeLines(firstRow, lastRow);
        this.doc.insertLines(firstRow + diff, lines);
        folds.length && this.addFolds(folds);
        return diff;
    };
    EditSession.prototype.moveLinesUp = function (firstRow, lastRow) {
        return this.$moveLines(firstRow, lastRow, -1);
    };
    EditSession.prototype.moveLinesDown = function (firstRow, lastRow) {
        return this.$moveLines(firstRow, lastRow, 1);
    };
    EditSession.prototype.duplicateLines = function (firstRow, lastRow) {
        return this.$moveLines(firstRow, lastRow, 0);
    };

    EditSession.prototype.$clipRowToDocument = function (row) {
        return Math.max(0, Math.min(row, this.doc.getLength() - 1));
    };

    EditSession.prototype.$clipColumnToRow = function (row, column) {
        if (column < 0)
            return 0;
        return Math.min(this.doc.getLine(row).length, column);
    };

    EditSession.prototype.$clipPositionToDocument = function (row, column) {
        column = Math.max(0, column);

        if (row < 0) {
            row = 0;
            column = 0;
        } else {
            var len = this.doc.getLength();
            if (row >= len) {
                row = len - 1;
                column = this.doc.getLine(len - 1).length;
            } else {
                column = Math.min(this.doc.getLine(row).length, column);
            }
        }

        return {
            row: row,
            column: column
        };
    };

    EditSession.prototype.$clipRangeToDocument = function (range) {
        if (range.start.row < 0) {
            range.start.row = 0;
            range.start.column = 0;
        } else {
            range.start.column = this.$clipColumnToRow(range.start.row, range.start.column);
        }

        var len = this.doc.getLength() - 1;
        if (range.end.row > len) {
            range.end.row = len;
            range.end.column = this.doc.getLine(len).length;
        } else {
            range.end.column = this.$clipColumnToRow(range.end.row, range.end.column);
        }
        return range;
    };
    EditSession.prototype.setUseWrapMode = function (useWrapMode) {
        if (useWrapMode != this.$useWrapMode) {
            this.$useWrapMode = useWrapMode;
            this.$modified = true;
            this.$resetRowCache(0);
            if (useWrapMode) {
                var len = this.getLength();
                this.$wrapData = Array(len);
                this.$updateWrapData(0, len - 1);
            }

            this._signal("changeWrapMode");
        }
    };
    EditSession.prototype.getUseWrapMode = function () {
        return this.$useWrapMode;
    };
    EditSession.prototype.setWrapLimitRange = function (min, max) {
        if (this.$wrapLimitRange.min !== min || this.$wrapLimitRange.max !== max) {
            this.$wrapLimitRange = {
                min: min,
                max: max
            };
            this.$modified = true;
            this._signal("changeWrapMode");
        }
    };
    EditSession.prototype.adjustWrapLimit = function (desiredLimit, $printMargin) {
        var limits = this.$wrapLimitRange;
        if (limits.max < 0)
            limits = { min: $printMargin, max: $printMargin };
        var wrapLimit = this.$constrainWrapLimit(desiredLimit, limits.min, limits.max);
        if (wrapLimit != this.$wrapLimit && wrapLimit > 1) {
            this.$wrapLimit = wrapLimit;
            this.$modified = true;
            if (this.$useWrapMode) {
                this.$updateWrapData(0, this.getLength() - 1);
                this.$resetRowCache(0);
                this._signal("changeWrapLimit");
            }
            return true;
        }
        return false;
    };

    EditSession.prototype.$constrainWrapLimit = function (wrapLimit, min, max) {
        if (min)
            wrapLimit = Math.max(min, wrapLimit);

        if (max)
            wrapLimit = Math.min(max, wrapLimit);

        return wrapLimit;
    };
    EditSession.prototype.getWrapLimit = function () {
        return this.$wrapLimit;
    };
    EditSession.prototype.setWrapLimit = function (limit) {
        this.setWrapLimitRange(limit, limit);
    };
    EditSession.prototype.getWrapLimitRange = function () {
        return {
            min: this.$wrapLimitRange.min,
            max: this.$wrapLimitRange.max
        };
    };

    EditSession.prototype.$updateInternalDataOnChange = function (e) {
        var useWrapMode = this.$useWrapMode;
        var len;
        var action = e.data.action;
        var firstRow = e.data.range.start.row;
        var lastRow = e.data.range.end.row;
        var start = e.data.range.start;
        var end = e.data.range.end;
        var removedFolds = null;

        if (action.indexOf("Lines") != -1) {
            if (action == "insertLines") {
                lastRow = firstRow + (e.data.lines.length);
            } else {
                lastRow = firstRow;
            }
            len = e.data.lines ? e.data.lines.length : lastRow - firstRow;
        } else {
            len = lastRow - firstRow;
        }

        this.$updating = true;
        if (len != 0) {
            if (action.indexOf("remove") != -1) {
                this[useWrapMode ? "$wrapData" : "$rowLengthCache"].splice(firstRow, len);

                var foldLines = this.$foldData;
                removedFolds = this.getFoldsInRange(e.data.range);
                this.removeFolds(removedFolds);

                var foldLine = this.getFoldLine(end.row);
                var idx = 0;
                if (foldLine) {
                    foldLine.addRemoveChars(end.row, end.column, start.column - end.column);
                    foldLine.shiftRow(-len);

                    var foldLineBefore = this.getFoldLine(firstRow);
                    if (foldLineBefore && foldLineBefore !== foldLine) {
                        foldLineBefore.merge(foldLine);
                        foldLine = foldLineBefore;
                    }
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= end.row) {
                        foldLine.shiftRow(-len);
                    }
                }

                lastRow = firstRow;
            } else {
                var args = Array(len);
                args.unshift(firstRow, 0);
                var arr = useWrapMode ? this.$wrapData : this.$rowLengthCache;
                arr.splice.apply(arr, args);
                var foldLines = this.$foldData;
                var foldLine = this.getFoldLine(firstRow);
                var idx = 0;
                if (foldLine) {
                    var cmp = foldLine.range.compareInside(start.row, start.column);
                    if (cmp == 0) {
                        foldLine = foldLine.split(start.row, start.column);
                        foldLine.shiftRow(len);
                        foldLine.addRemoveChars(lastRow, 0, end.column - start.column);
                    } else // Infront of the foldLine but same row. Need to shift column.
                    if (cmp == -1) {
                        foldLine.addRemoveChars(firstRow, 0, end.column - start.column);
                        foldLine.shiftRow(len);
                    }
                    idx = foldLines.indexOf(foldLine) + 1;
                }

                for (idx; idx < foldLines.length; idx++) {
                    var foldLine = foldLines[idx];
                    if (foldLine.start.row >= firstRow) {
                        foldLine.shiftRow(len);
                    }
                }
            }
        } else {
            len = Math.abs(e.data.range.start.column - e.data.range.end.column);
            if (action.indexOf("remove") != -1) {
                removedFolds = this.getFoldsInRange(e.data.range);
                this.removeFolds(removedFolds);

                len = -len;
            }
            var foldLine = this.getFoldLine(firstRow);
            if (foldLine) {
                foldLine.addRemoveChars(firstRow, start.column, len);
            }
        }

        if (useWrapMode && this.$wrapData.length != this.doc.getLength()) {
            console.error("doc.getLength() and $wrapData.length have to be the same!");
        }
        this.$updating = false;

        if (useWrapMode)
            this.$updateWrapData(firstRow, lastRow);
        else
            this.$updateRowLengthCache(firstRow, lastRow);

        return removedFolds;
    };

    EditSession.prototype.$updateRowLengthCache = function (firstRow, lastRow, b) {
        this.$rowLengthCache[firstRow] = null;
        this.$rowLengthCache[lastRow] = null;
    };

    EditSession.prototype.$updateWrapData = function (firstRow, lastRow) {
        var lines = this.doc.getAllLines();
        var tabSize = this.getTabSize();
        var wrapData = this.$wrapData;
        var wrapLimit = this.$wrapLimit;
        var tokens;
        var foldLine;

        var row = firstRow;
        lastRow = Math.min(lastRow, lines.length - 1);
        while (row <= lastRow) {
            foldLine = this.getFoldLine(row, foldLine);
            if (!foldLine) {
                tokens = this.$getDisplayTokens(lines[row]);
                wrapData[row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row++;
            } else {
                tokens = [];
                foldLine.walk(function (placeholder, row, column, lastColumn) {
                    var walkTokens;
                    if (placeholder != null) {
                        walkTokens = this.$getDisplayTokens(placeholder, tokens.length);
                        walkTokens[0] = PLACEHOLDER_START;
                        for (var i = 1; i < walkTokens.length; i++) {
                            walkTokens[i] = PLACEHOLDER_BODY;
                        }
                    } else {
                        walkTokens = this.$getDisplayTokens(lines[row].substring(lastColumn, column), tokens.length);
                    }
                    tokens = tokens.concat(walkTokens);
                }.bind(this), foldLine.end.row, lines[foldLine.end.row].length + 1);

                wrapData[foldLine.start.row] = this.$computeWrapSplits(tokens, wrapLimit, tabSize);
                row = foldLine.end.row + 1;
            }
        }
    };

    EditSession.prototype.$computeWrapSplits = function (tokens, wrapLimit, tabSize) {
        if (tokens.length == 0) {
            return [];
        }

        var splits = [];
        var displayLength = tokens.length;
        var lastSplit = 0, lastDocSplit = 0;

        var isCode = this.$wrapAsCode;

        function addSplit(screenPos) {
            var displayed = tokens.slice(lastSplit, screenPos);
            var len = displayed.length;
            displayed.join("").replace(/12/g, function () {
                len -= 1;
            }).replace(/2/g, function () {
                len -= 1;
            });

            lastDocSplit += len;
            splits.push(lastDocSplit);
            lastSplit = screenPos;
        }

        while (displayLength - lastSplit > wrapLimit) {
            var split = lastSplit + wrapLimit;
            if (tokens[split - 1] >= SPACE && tokens[split] >= SPACE) {
                addSplit(split);
                continue;
            }
            if (tokens[split] == PLACEHOLDER_START || tokens[split] == PLACEHOLDER_BODY) {
                for (split; split != lastSplit - 1; split--) {
                    if (tokens[split] == PLACEHOLDER_START) {
                        break;
                    }
                }
                if (split > lastSplit) {
                    addSplit(split);
                    continue;
                }
                split = lastSplit + wrapLimit;
                for (split; split < tokens.length; split++) {
                    if (tokens[split] != PLACEHOLDER_BODY) {
                        break;
                    }
                }
                if (split == tokens.length) {
                    break;
                }
                addSplit(split);
                continue;
            }
            var minSplit = Math.max(split - (isCode ? 10 : wrapLimit - (wrapLimit >> 2)), lastSplit - 1);
            while (split > minSplit && tokens[split] < PLACEHOLDER_START) {
                split--;
            }
            if (isCode) {
                while (split > minSplit && tokens[split] < PLACEHOLDER_START) {
                    split--;
                }
                while (split > minSplit && tokens[split] == PUNCTUATION) {
                    split--;
                }
            } else {
                while (split > minSplit && tokens[split] < SPACE) {
                    split--;
                }
            }
            if (split > minSplit) {
                addSplit(++split);
                continue;
            }
            split = lastSplit + wrapLimit;
            addSplit(split);
        }
        return splits;
    };
    EditSession.prototype.$getDisplayTokens = function (str, offset) {
        var arr = [];
        var tabSize;
        offset = offset || 0;

        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if (c == 9) {
                tabSize = this.getScreenTabSize(arr.length + offset);
                arr.push(TAB);
                for (var n = 1; n < tabSize; n++) {
                    arr.push(TAB_SPACE);
                }
            } else if (c == 32) {
                arr.push(SPACE);
            } else if ((c > 39 && c < 48) || (c > 57 && c < 64)) {
                arr.push(PUNCTUATION);
            } else if (c >= 0x1100 && isFullWidth(c)) {
                arr.push(CHAR, CHAR_EXT);
            } else {
                arr.push(CHAR);
            }
        }
        return arr;
    };
    EditSession.prototype.$getStringScreenWidth = function (str, maxScreenColumn, screenColumn) {
        if (maxScreenColumn == 0)
            return [0, 0];
        if (maxScreenColumn == null)
            maxScreenColumn = Infinity;
        screenColumn = screenColumn || 0;

        var c, column;
        for (column = 0; column < str.length; column++) {
            c = str.charCodeAt(column);
            if (c == 9) {
                screenColumn += this.getScreenTabSize(screenColumn);
            } else if (c >= 0x1100 && isFullWidth(c)) {
                screenColumn += 2;
            } else {
                screenColumn += 1;
            }
            if (screenColumn > maxScreenColumn) {
                break;
            }
        }

        return [screenColumn, column];
    };
    EditSession.prototype.getRowLength = function (row) {
        if (this.lineWidgets)
            var h = this.lineWidgets[row] && this.lineWidgets[row].rowCount || 0;
        else
            h = 0;
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1 + h;
        } else {
            return this.$wrapData[row].length + 1 + h;
        }
    };

    EditSession.prototype.getRowLineCount = function (row) {
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1;
        } else {
            return this.$wrapData[row].length + 1;
        }
    };

    EditSession.prototype.getRowWrapIndent = function (screenRow) {
        if (this.$useWrapMode) {
            var pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE);
            var splits = this.$wrapData[pos.row];
            return splits.length && splits[0] < pos.column ? splits.indent : 0;
        } else {
            return 0;
        }
    };
    EditSession.prototype.getScreenLastRowColumn = function (screenRow) {
        var pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE);
        return this.documentToScreenColumn(pos.row, pos.column);
    };
    EditSession.prototype.getDocumentLastRowColumn = function (docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.getScreenLastRowColumn(screenRow);
    };
    EditSession.prototype.getDocumentLastRowColumnPosition = function (docRow, docColumn) {
        var screenRow = this.documentToScreenRow(docRow, docColumn);
        return this.screenToDocumentPosition(screenRow, Number.MAX_VALUE / 10);
    };
    EditSession.prototype.getRowSplitData = function (row) {
        if (!this.$useWrapMode) {
            return undefined;
        } else {
            return this.$wrapData[row];
        }
    };
    EditSession.prototype.getScreenTabSize = function (screenColumn) {
        return this.$tabSize - screenColumn % this.$tabSize;
    };

    EditSession.prototype.screenToDocumentRow = function (screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).row;
    };

    EditSession.prototype.screenToDocumentColumn = function (screenRow, screenColumn) {
        return this.screenToDocumentPosition(screenRow, screenColumn).column;
    };
    EditSession.prototype.screenToDocumentPosition = function (screenRow, screenColumn) {
        if (screenRow < 0) {
            return { row: 0, column: 0 };
        }

        var line;
        var docRow = 0;
        var docColumn = 0;
        var column;
        var row = 0;
        var rowLength = 0;

        var rowCache = this.$screenRowCache;
        var i = this.$getRowCacheIndex(rowCache, screenRow);
        var l = rowCache.length;
        if (l && i >= 0) {
            var row = rowCache[i];
            var docRow = this.$docRowCache[i];
            var doCache = screenRow > rowCache[l - 1];
        } else {
            var doCache = !l;
        }

        var maxRow = this.getLength() - 1;
        var foldLine = this.getNextFoldLine(docRow);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (row <= screenRow) {
            rowLength = this.getRowLength(docRow);
            if (row + rowLength > screenRow || docRow >= maxRow) {
                break;
            } else {
                row += rowLength;
                docRow++;
                if (docRow > foldStart) {
                    docRow = foldLine.end.row + 1;
                    foldLine = this.getNextFoldLine(docRow, foldLine);
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }
            }

            if (doCache) {
                this.$docRowCache.push(docRow);
                this.$screenRowCache.push(row);
            }
        }

        if (foldLine && foldLine.start.row <= docRow) {
            line = this.getFoldDisplayLine(foldLine);
            docRow = foldLine.start.row;
        } else if (row + rowLength <= screenRow || docRow > maxRow) {
            return {
                row: maxRow,
                column: this.getLine(maxRow).length
            };
        } else {
            line = this.getLine(docRow);
            foldLine = null;
        }

        if (this.$useWrapMode) {
            var splits = this.$wrapData[docRow];
            if (splits) {
                var splitIndex = Math.floor(screenRow - row);
                column = splits[splitIndex];
                if (splitIndex > 0 && splits.length) {
                    docColumn = splits[splitIndex - 1] || splits[splits.length - 1];
                    line = line.substring(docColumn);
                }
            }
        }

        docColumn += this.$getStringScreenWidth(line, screenColumn)[1];
        if (this.$useWrapMode && docColumn >= column)
            docColumn = column - 1;

        if (foldLine)
            return foldLine.idxToPosition(docColumn);

        return { row: docRow, column: docColumn };
    };
    EditSession.prototype.documentToScreenPosition = function (docRow, docColumn) {
        var pos;
        if (typeof docColumn === "undefined") {
            pos = this.$clipPositionToDocument(docRow['row'], docRow['column']);
        } else {
            asserts.assert(typeof docRow === 'number', "docRow must be a number");
            asserts.assert(typeof docColumn === 'number', "docColumn must be a number");
            pos = this.$clipPositionToDocument(docRow, docColumn);
        }

        docRow = pos.row;
        docColumn = pos.column;
        asserts.assert(typeof docRow === 'number', "docRow must be a number");
        asserts.assert(typeof docColumn === 'number', "docColumn must be a number");

        var screenRow = 0;
        var foldStartRow = null;
        var fold = null;
        fold = this.getFoldAt(docRow, docColumn, 1);
        if (fold) {
            docRow = fold.start.row;
            docColumn = fold.start.column;
        }

        var rowEnd, row = 0;

        var rowCache = this.$docRowCache;
        var i = this.$getRowCacheIndex(rowCache, docRow);
        var l = rowCache.length;
        if (l && i >= 0) {
            var row = rowCache[i];
            var screenRow = this.$screenRowCache[i];
            var doCache = docRow > rowCache[l - 1];
        } else {
            var doCache = !l;
        }

        var foldLine = this.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (row < docRow) {
            if (row >= foldStart) {
                rowEnd = foldLine.end.row + 1;
                if (rowEnd > docRow)
                    break;
                foldLine = this.getNextFoldLine(rowEnd, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            } else {
                rowEnd = row + 1;
            }

            screenRow += this.getRowLength(row);
            row = rowEnd;

            if (doCache) {
                this.$docRowCache.push(row);
                this.$screenRowCache.push(screenRow);
            }
        }
        var textLine = "";
        if (foldLine && row >= foldStart) {
            textLine = this.getFoldDisplayLine(foldLine, docRow, docColumn);
            foldStartRow = foldLine.start.row;
        } else {
            textLine = this.getLine(docRow).substring(0, docColumn);
            foldStartRow = docRow;
        }
        if (this.$useWrapMode) {
            var wrapRow = this.$wrapData[foldStartRow];
            if (wrapRow) {
                var screenRowOffset = 0;
                while (textLine.length >= wrapRow[screenRowOffset]) {
                    screenRow++;
                    screenRowOffset++;
                }
                textLine = textLine.substring(wrapRow[screenRowOffset - 1] || 0, textLine.length);
            }
        }

        return {
            row: screenRow,
            column: this.$getStringScreenWidth(textLine)[0]
        };
    };
    EditSession.prototype.documentToScreenColumn = function (docRow, docColumn) {
        return this.documentToScreenPosition(docRow, docColumn).column;
    };
    EditSession.prototype.documentToScreenRow = function (docRow, docColumn) {
        return this.documentToScreenPosition(docRow, docColumn).row;
    };
    EditSession.prototype.getScreenLength = function () {
        var screenRows = 0;
        var fold = null;
        if (!this.$useWrapMode) {
            screenRows = this.getLength();
            var foldData = this.$foldData;
            for (var i = 0; i < foldData.length; i++) {
                fold = foldData[i];
                screenRows -= fold.end.row - fold.start.row;
            }
        } else {
            var lastRow = this.$wrapData.length;
            var row = 0, i = 0;
            var fold = this.$foldData[i++];
            var foldStart = fold ? fold.start.row : Infinity;

            while (row < lastRow) {
                var splits = this.$wrapData[row];
                screenRows += splits ? splits.length + 1 : 1;
                row++;
                if (row > foldStart) {
                    row = fold.end.row + 1;
                    fold = this.$foldData[i++];
                    foldStart = fold ? fold.start.row : Infinity;
                }
            }
        }
        if (this.lineWidgets) {
            screenRows += this.$getWidgetScreenLength();
        }

        return screenRows;
    };
    EditSession.prototype.$setFontMetrics = function (fm) {
    };

    EditSession.prototype.findMatchingBracket = function (position, chr) {
        return this.$bracketMatcher.findMatchingBracket(position, chr);
    };

    EditSession.prototype.getBracketRange = function (position) {
        return this.$bracketMatcher.getBracketRange(position);
    };

    EditSession.prototype.$findOpeningBracket = function (bracket, position, typeRe) {
        return this.$bracketMatcher.$findOpeningBracket(bracket, position, typeRe);
    };

    EditSession.prototype.$findClosingBracket = function (bracket, position, typeRe) {
        return this.$bracketMatcher.$findClosingBracket(bracket, position, typeRe);
    };
    return EditSession;
})(eve.EventEmitterClass);
exports.EditSession = EditSession;

require("./edit_session/folding").Folding.call(EditSession.prototype);

config.defineOptions(EditSession.prototype, "session", {
    wrap: {
        set: function (value) {
            if (!value || value == "off")
                value = false;
            else if (value == "free")
                value = true;
            else if (value == "printMargin")
                value = -1;
            else if (typeof value == "string")
                value = parseInt(value, 10) || false;

            if (this.$wrap == value)
                return;
            if (!value) {
                this.setUseWrapMode(false);
            } else {
                var col = typeof value == "number" ? value : null;
                this.setWrapLimitRange(col, col);
                this.setUseWrapMode(true);
            }
            this.$wrap = value;
        },
        get: function () {
            if (this.getUseWrapMode()) {
                if (this.$wrap == -1)
                    return "printMargin";
                if (!this.getWrapLimitRange().min)
                    return "free";
                return this.$wrap;
            }
            return "off";
        },
        handlesSet: true
    },
    wrapMethod: {
        set: function (val) {
            val = val == "auto" ? this.$mode.type != "text" : val != "text";
            if (val != this.$wrapAsCode) {
                this.$wrapAsCode = val;
                if (this.$useWrapMode) {
                    this.$modified = true;
                    this.$resetRowCache(0);
                    this.$updateWrapData(0, this.getLength() - 1);
                }
            }
        },
        initialValue: "auto"
    },
    firstLineNumber: {
        set: function () {
            this._signal("changeBreakpoint");
        },
        initialValue: 1
    },
    useWorker: {
        set: function (useWorker) {
            this.$useWorker = useWorker;

            this.$stopWorker();
            if (useWorker)
                this.$startWorker();
        },
        initialValue: true
    },
    useSoftTabs: { initialValue: true },
    tabSize: {
        set: function (tabSize) {
            if (isNaN(tabSize) || this.$tabSize === tabSize)
                return;

            this.$modified = true;
            this.$rowLengthCache = [];
            this.$tabSize = tabSize;
            this._signal("changeTabSize");
        },
        initialValue: 4,
        handlesSet: true
    },
    overwrite: {
        set: function (val) {
            this._signal("changeOverwrite");
        },
        initialValue: false
    },
    newLineMode: {
        set: function (val) {
            this.doc.setNewLineMode(val);
        },
        get: function () {
            return this.doc.getNewLineMode();
        },
        handlesSet: true
    },
    mode: {
        set: function (val) {
            this.setMode(val);
        },
        get: function () {
            return this.$modeId;
        }
    }
});
});

ace.define("ace/search",["require","exports","module","ace/lib/lang","ace/lib/oop","ace/range"], function(require, exports, module) {
"use strict";

var lang = require("./lib/lang");
var oop = require("./lib/oop");
var Range = require("./range").Range;

var Search = function() {
    this.$options = {};
};

(function() {
    this.set = function(options) {
        oop.mixin(this.$options, options);
        return this;
    };
    this.getOptions = function() {
        return lang.copyObject(this.$options);
    };
    this.setOptions = function(options) {
        this.$options = options;
    };
    this.find = function(session) {
        var iterator = this.$matchIterator(session, this.$options);

        if (!iterator)
            return false;

        var firstRange = null;
        iterator.forEach(function(range, row, offset) {
            if (!range.start) {
                var column = range.offset + (offset || 0);
                firstRange = new Range(row, column, row, column+range.length);
            } else
                firstRange = range;
            return true;
        });

        return firstRange;
    };
    this.findAll = function(session) {
        var options = this.$options;
        if (!options.needle)
            return [];
        this.$assembleRegExp(options);

        var range = options.range;
        var lines = range
            ? session.getLines(range.start.row, range.end.row)
            : session.doc.getAllLines();

        var ranges = [];
        var re = options.re;
        if (options.$isMultiLine) {
            var len = re.length;
            var maxRow = lines.length - len;
            var prevRange;
            outer: for (var row = re.offset || 0; row <= maxRow; row++) {
                for (var j = 0; j < len; j++)
                    if (lines[row + j].search(re[j]) == -1)
                        continue outer;
                
                var startLine = lines[row];
                var line = lines[row + len - 1];
                var startIndex = startLine.length - startLine.match(re[0])[0].length;
                var endIndex = line.match(re[len - 1])[0].length;
                
                if (prevRange && prevRange.end.row === row &&
                    prevRange.end.column > startIndex
                ) {
                    continue;
                }
                ranges.push(prevRange = new Range(
                    row, startIndex, row + len - 1, endIndex
                ));
                if (len > 2)
                    row = row + len - 2;
            }
        } else {
            for (var i = 0; i < lines.length; i++) {
                var matches = lang.getMatchOffsets(lines[i], re);
                for (var j = 0; j < matches.length; j++) {
                    var match = matches[j];
                    ranges.push(new Range(i, match.offset, i, match.offset + match.length));
                }
            }
        }

        if (range) {
            var startColumn = range.start.column;
            var endColumn = range.start.column;
            var i = 0, j = ranges.length - 1;
            while (i < j && ranges[i].start.column < startColumn && ranges[i].start.row == range.start.row)
                i++;

            while (i < j && ranges[j].end.column > endColumn && ranges[j].end.row == range.end.row)
                j--;
            
            ranges = ranges.slice(i, j + 1);
            for (i = 0, j = ranges.length; i < j; i++) {
                ranges[i].start.row += range.start.row;
                ranges[i].end.row += range.start.row;
            }
        }

        return ranges;
    };
    this.replace = function(input, replacement) {
        var options = this.$options;

        var re = this.$assembleRegExp(options);
        if (options.$isMultiLine)
            return replacement;

        if (!re)
            return;

        var match = re.exec(input);
        if (!match || match[0].length != input.length)
            return null;
        
        replacement = input.replace(re, replacement);
        if (options.preserveCase) {
            replacement = replacement.split("");
            for (var i = Math.min(input.length, input.length); i--; ) {
                var ch = input[i];
                if (ch && ch.toLowerCase() != ch)
                    replacement[i] = replacement[i].toUpperCase();
                else
                    replacement[i] = replacement[i].toLowerCase();
            }
            replacement = replacement.join("");
        }
        
        return replacement;
    };

    this.$matchIterator = function(session, options) {
        var re = this.$assembleRegExp(options);
        if (!re)
            return false;

        var self = this, callback, backwards = options.backwards;

        if (options.$isMultiLine) {
            var len = re.length;
            var matchIterator = function(line, row, offset) {
                var startIndex = line.search(re[0]);
                if (startIndex == -1)
                    return;
                for (var i = 1; i < len; i++) {
                    line = session.getLine(row + i);
                    if (line.search(re[i]) == -1)
                        return;
                }

                var endIndex = line.match(re[len - 1])[0].length;

                var range = new Range(row, startIndex, row + len - 1, endIndex);
                if (re.offset == 1) {
                    range.start.row--;
                    range.start.column = Number.MAX_VALUE;
                } else if (offset)
                    range.start.column += offset;

                if (callback(range))
                    return true;
            };
        } else if (backwards) {
            var matchIterator = function(line, row, startIndex) {
                var matches = lang.getMatchOffsets(line, re);
                for (var i = matches.length-1; i >= 0; i--)
                    if (callback(matches[i], row, startIndex))
                        return true;
            };
        } else {
            var matchIterator = function(line, row, startIndex) {
                var matches = lang.getMatchOffsets(line, re);
                for (var i = 0; i < matches.length; i++)
                    if (callback(matches[i], row, startIndex))
                        return true;
            };
        }

        return {
            forEach: function(_callback) {
                callback = _callback;
                self.$lineIterator(session, options).forEach(matchIterator);
            }
        };
    };

    this.$assembleRegExp = function(options, $disableFakeMultiline) {
        if (options.needle instanceof RegExp)
            return options.re = options.needle;

        var needle = options.needle;

        if (!options.needle)
            return options.re = false;

        if (!options.regExp)
            needle = lang.escapeRegExp(needle);

        if (options.wholeWord)
            needle = "\\b" + needle + "\\b";

        var modifier = options.caseSensitive ? "g" : "gi";

        options.$isMultiLine = !$disableFakeMultiline && /[\n\r]/.test(needle);
        if (options.$isMultiLine)
            return options.re = this.$assembleMultilineRegExp(needle, modifier);

        try {
            var re = new RegExp(needle, modifier);
        } catch(e) {
            re = false;
        }
        return options.re = re;
    };

    this.$assembleMultilineRegExp = function(needle, modifier) {
        var parts = needle.replace(/\r\n|\r|\n/g, "$\n^").split("\n");
        var re = [];
        for (var i = 0; i < parts.length; i++) try {
            re.push(new RegExp(parts[i], modifier));
        } catch(e) {
            return false;
        }
        if (parts[0] == "") {
            re.shift();
            re.offset = 1;
        } else {
            re.offset = 0;
        }
        return re;
    };

    this.$lineIterator = function(session, options) {
        var backwards = options.backwards == true;
        var skipCurrent = options.skipCurrent != false;

        var range = options.range;
        var start = options.start;
        if (!start)
            start = range ? range[backwards ? "end" : "start"] : session.selection.getRange();
         
        if (start.start)
            start = start[skipCurrent != backwards ? "end" : "start"];

        var firstRow = range ? range.start.row : 0;
        var lastRow = range ? range.end.row : session.getLength() - 1;

        var forEach = backwards ? function(callback) {
                var row = start.row;

                var line = session.getLine(row).substring(0, start.column);
                if (callback(line, row))
                    return;

                for (row--; row >= firstRow; row--)
                    if (callback(session.getLine(row), row))
                        return;

                if (options.wrap == false)
                    return;

                for (row = lastRow, firstRow = start.row; row >= firstRow; row--)
                    if (callback(session.getLine(row), row))
                        return;
            } : function(callback) {
                var row = start.row;

                var line = session.getLine(row).substr(start.column);
                if (callback(line, row, start.column))
                    return;

                for (row = row+1; row <= lastRow; row++)
                    if (callback(session.getLine(row), row))
                        return;

                if (options.wrap == false)
                    return;

                for (row = firstRow, lastRow = start.row; row <= lastRow; row++)
                    if (callback(session.getLine(row), row))
                        return;
            };
        
        return {forEach: forEach};
    };

}).call(Search.prototype);

exports.Search = Search;
});

ace.define("ace/lib/mix",["require","exports","module"], function(require, exports, module) {
"no use strict";
function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
exports.applyMixins = applyMixins;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/commands/command_manager",["require","exports","module","ace/lib/mix","ace/keyboard/hash_handler","ace/lib/event_emitter"], function(require, exports, module) {
"no use strict";
var mix = require("../lib/mix");

var hhm = require("../keyboard/hash_handler");
var eem = require("../lib/event_emitter");

var CommandManager = (function (_super) {
    __extends(CommandManager, _super);
    function CommandManager(platform, commands) {
        _super.call(this);
        this.hashHandler = new hhm.HashHandler();
        hhm.HashHandler.call(this, commands, platform);
        this.byName = this.hashHandler.commands;
        this.setDefaultHandler("exec", function (e) {
            return e.command.exec(e.editor, e.args || {});
        });
    }
    Object.defineProperty(CommandManager.prototype, "commands", {
        get: function () {
            return this.hashHandler.commands;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CommandManager.prototype, "commandKeyBinding", {
        get: function () {
            return this.hashHandler.commandKeyBinding;
        },
        enumerable: true,
        configurable: true
    });

    CommandManager.prototype.bindKey = function (key, command) {
        return this.hashHandler.bindKey(key, command);
    };

    CommandManager.prototype.bindKeys = function (keyList) {
        return this.hashHandler.bindKeys(keyList);
    };

    CommandManager.prototype.addCommand = function (command) {
        this.hashHandler.addCommand(command);
    };

    CommandManager.prototype.removeCommand = function (commandName) {
        this.hashHandler.removeCommand(commandName);
    };

    CommandManager.prototype.findKeyCommand = function (hashId, keyString) {
        return this.hashHandler.findKeyCommand(hashId, keyString);
    };

    CommandManager.prototype.parseKeys = function (keys) {
        return this.hashHandler.parseKeys(keys);
    };

    CommandManager.prototype.addCommands = function (commands) {
        this.hashHandler.addCommands(commands);
    };

    CommandManager.prototype.removeCommands = function (commands) {
        this.hashHandler.removeCommands(commands);
    };

    CommandManager.prototype.handleKeyboard = function (data, hashId, keyString, keyCode) {
        return this.hashHandler.handleKeyboard(data, hashId, keyString, keyCode);
    };

    CommandManager.prototype.exec = function (command, editor, args) {
        if (typeof command === 'string') {
            command = this.hashHandler.commands[command];
        }

        if (!command) {
            return false;
        }

        if (editor && editor.$readOnly && !command.readOnly) {
            return false;
        }

        var e = { editor: editor, command: command, args: args };
        var retvalue = this._emit("exec", e);
        this._signal("afterExec", e);

        return retvalue === false ? false : true;
    };

    CommandManager.prototype.toggleRecording = function (editor) {
        if (this.$inReplay)
            return;

        editor && editor._emit("changeStatus");
        if (this.recording) {
            this.macro.pop();
            this.removeEventListener("exec", this.$addCommandToMacro);

            if (!this.macro.length)
                this.macro = this.oldMacro;

            return this.recording = false;
        }
        if (!this.$addCommandToMacro) {
            this.$addCommandToMacro = function (e) {
                this.macro.push([e.command, e.args]);
            }.bind(this);
        }

        this.oldMacro = this.macro;
        this.macro = [];
        this.on("exec", this.$addCommandToMacro);
        return this.recording = true;
    };

    CommandManager.prototype.replay = function (editor) {
        if (this.$inReplay || !this.macro)
            return;

        if (this.recording)
            return this.toggleRecording(editor);

        try  {
            this.$inReplay = true;
            this.macro.forEach(function (x) {
                if (typeof x == "string")
                    this.exec(x, editor);
                else
                    this.exec(x[0], editor, x[1]);
            }, this);
        } finally {
            this.$inReplay = false;
        }
    };

    CommandManager.prototype.trimMacro = function (m) {
        return m.map(function (x) {
            if (typeof x[0] != "string")
                x[0] = x[0].name;
            if (!x[1])
                x = x[0];
            return x;
        });
    };
    return CommandManager;
})(eem.EventEmitterClass);
exports.CommandManager = CommandManager;

mix.applyMixins(CommandManager, [hhm.HashHandler]);
});

ace.define("ace/commands/default_commands",["require","exports","module","ace/lib/lang","ace/config","ace/range"], function(require, exports, module) {
"use strict";

var lang = require("../lib/lang");
var config = require("../config");
var Range = require("../range").Range;

function bindKey(win, mac) {
    return {win: win, mac: mac};
}
exports.commands = [{
    name: "showSettingsMenu",
    bindKey: bindKey("Ctrl-,", "Command-,"),
    exec: function(editor) {
        config.loadModule("ace/ext/settings_menu", function(module) {
            module.init(editor);
            editor.showSettingsMenu();
        });
    },
    readOnly: true
}, {
    name: "goToNextError",
    bindKey: bindKey("Alt-E", "Ctrl-E"),
    exec: function(editor) {
        config.loadModule("ace/ext/error_marker", function(module) {
            module.showErrorMarker(editor, 1);
        });
    },
    scrollIntoView: "animate",
    readOnly: true
}, {
    name: "goToPreviousError",
    bindKey: bindKey("Alt-Shift-E", "Ctrl-Shift-E"),
    exec: function(editor) {
        config.loadModule("ace/ext/error_marker", function(module) {
            module.showErrorMarker(editor, -1);
        });
    },
    scrollIntoView: "animate",
    readOnly: true
}, {
    name: "selectall",
    bindKey: bindKey("Ctrl-A", "Command-A"),
    exec: function(editor) { editor.selectAll(); },
    readOnly: true
}, {
    name: "centerselection",
    bindKey: bindKey(null, "Ctrl-L"),
    exec: function(editor) { editor.centerSelection(); },
    readOnly: true
}, {
    name: "gotoline",
    bindKey: bindKey("Ctrl-L", "Command-L"),
    exec: function(editor) {
        var line = parseInt(prompt("Enter line number:"), 10);
        if (!isNaN(line)) {
            editor.gotoLine(line);
        }
    },
    readOnly: true
}, {
    name: "fold",
    bindKey: bindKey("Alt-L|Ctrl-F1", "Command-Alt-L|Command-F1"),
    exec: function(editor) { editor.session.toggleFold(false); },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "unfold",
    bindKey: bindKey("Alt-Shift-L|Ctrl-Shift-F1", "Command-Alt-Shift-L|Command-Shift-F1"),
    exec: function(editor) { editor.session.toggleFold(true); },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "toggleFoldWidget",
    bindKey: bindKey("F2", "F2"),
    exec: function(editor) { editor.session.toggleFoldWidget(); },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "toggleParentFoldWidget",
    bindKey: bindKey("Alt-F2", "Alt-F2"),
    exec: function(editor) { editor.session.toggleFoldWidget(true); },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "foldall",
    bindKey: bindKey("Ctrl-Alt-0", "Ctrl-Command-Option-0"),
    exec: function(editor) { editor.session.foldAll(); },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "foldOther",
    bindKey: bindKey("Alt-0", "Command-Option-0"),
    exec: function(editor) { 
        editor.session.foldAll();
        editor.session.unfold(editor.selection.getAllRanges());
    },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "unfoldall",
    bindKey: bindKey("Alt-Shift-0", "Command-Option-Shift-0"),
    exec: function(editor) { editor.session.unfold(); },
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "findnext",
    bindKey: bindKey("Ctrl-K", "Command-G"),
    exec: function(editor) { editor.findNext(); },
    multiSelectAction: "forEach",
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "findprevious",
    bindKey: bindKey("Ctrl-Shift-K", "Command-Shift-G"),
    exec: function(editor) { editor.findPrevious(); },
    multiSelectAction: "forEach",
    scrollIntoView: "center",
    readOnly: true
}, {
    name: "selectOrFindNext",
    bindKey: bindKey("Alt-K", "Ctrl-G"),
    exec: function(editor) {
        if (editor.selection.isEmpty())
            editor.selection.selectWord();
        else
            editor.findNext(); 
    },
    readOnly: true
}, {
    name: "selectOrFindPrevious",
    bindKey: bindKey("Alt-Shift-K", "Ctrl-Shift-G"),
    exec: function(editor) { 
        if (editor.selection.isEmpty())
            editor.selection.selectWord();
        else
            editor.findPrevious();
    },
    readOnly: true
}, {
    name: "find",
    bindKey: bindKey("Ctrl-F", "Command-F"),
    exec: function(editor) {
        config.loadModule("ace/ext/searchbox", function(e) {e.Search(editor)});
    },
    readOnly: true
}, {
    name: "overwrite",
    bindKey: "Insert",
    exec: function(editor) { editor.toggleOverwrite(); },
    readOnly: true
}, {
    name: "selecttostart",
    bindKey: bindKey("Ctrl-Shift-Home", "Command-Shift-Up"),
    exec: function(editor) { editor.getSelection().selectFileStart(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    aceCommandGroup: "fileJump"
}, {
    name: "gotostart",
    bindKey: bindKey("Ctrl-Home", "Command-Home|Command-Up"),
    exec: function(editor) { editor.navigateFileStart(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    aceCommandGroup: "fileJump"
}, {
    name: "selectup",
    bindKey: bindKey("Shift-Up", "Shift-Up"),
    exec: function(editor) { editor.getSelection().selectUp(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "golineup",
    bindKey: bindKey("Up", "Up|Ctrl-P"),
    exec: function(editor, args) { editor.navigateUp(args.times); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selecttoend",
    bindKey: bindKey("Ctrl-Shift-End", "Command-Shift-Down"),
    exec: function(editor) { editor.getSelection().selectFileEnd(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    aceCommandGroup: "fileJump"
}, {
    name: "gotoend",
    bindKey: bindKey("Ctrl-End", "Command-End|Command-Down"),
    exec: function(editor) { editor.navigateFileEnd(); },
    multiSelectAction: "forEach",
    readOnly: true,
    scrollIntoView: "animate",
    aceCommandGroup: "fileJump"
}, {
    name: "selectdown",
    bindKey: bindKey("Shift-Down", "Shift-Down"),
    exec: function(editor) { editor.getSelection().selectDown(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "golinedown",
    bindKey: bindKey("Down", "Down|Ctrl-N"),
    exec: function(editor, args) { editor.navigateDown(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectwordleft",
    bindKey: bindKey("Ctrl-Shift-Left", "Option-Shift-Left"),
    exec: function(editor) { editor.getSelection().selectWordLeft(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotowordleft",
    bindKey: bindKey("Ctrl-Left", "Option-Left"),
    exec: function(editor) { editor.navigateWordLeft(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selecttolinestart",
    bindKey: bindKey("Alt-Shift-Left", "Command-Shift-Left"),
    exec: function(editor) { editor.getSelection().selectLineStart(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotolinestart",
    bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
    exec: function(editor) { editor.navigateLineStart(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectleft",
    bindKey: bindKey("Shift-Left", "Shift-Left"),
    exec: function(editor) { editor.getSelection().selectLeft(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotoleft",
    bindKey: bindKey("Left", "Left|Ctrl-B"),
    exec: function(editor, args) { editor.navigateLeft(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectwordright",
    bindKey: bindKey("Ctrl-Shift-Right", "Option-Shift-Right"),
    exec: function(editor) { editor.getSelection().selectWordRight(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotowordright",
    bindKey: bindKey("Ctrl-Right", "Option-Right"),
    exec: function(editor) { editor.navigateWordRight(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selecttolineend",
    bindKey: bindKey("Alt-Shift-Right", "Command-Shift-Right"),
    exec: function(editor) { editor.getSelection().selectLineEnd(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotolineend",
    bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
    exec: function(editor) { editor.navigateLineEnd(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectright",
    bindKey: bindKey("Shift-Right", "Shift-Right"),
    exec: function(editor) { editor.getSelection().selectRight(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "gotoright",
    bindKey: bindKey("Right", "Right|Ctrl-F"),
    exec: function(editor, args) { editor.navigateRight(args.times); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectpagedown",
    bindKey: "Shift-PageDown",
    exec: function(editor) { editor.selectPageDown(); },
    readOnly: true
}, {
    name: "pagedown",
    bindKey: bindKey(null, "Option-PageDown"),
    exec: function(editor) { editor.scrollPageDown(); },
    readOnly: true
}, {
    name: "gotopagedown",
    bindKey: bindKey("PageDown", "PageDown|Ctrl-V"),
    exec: function(editor) { editor.gotoPageDown(); },
    readOnly: true
}, {
    name: "selectpageup",
    bindKey: "Shift-PageUp",
    exec: function(editor) { editor.selectPageUp(); },
    readOnly: true
}, {
    name: "pageup",
    bindKey: bindKey(null, "Option-PageUp"),
    exec: function(editor) { editor.scrollPageUp(); },
    readOnly: true
}, {
    name: "gotopageup",
    bindKey: "PageUp",
    exec: function(editor) { editor.gotoPageUp(); },
    readOnly: true
}, {
    name: "scrollup",
    bindKey: bindKey("Ctrl-Up", null),
    exec: function(e) { e.renderer.scrollBy(0, -2 * e.renderer.layerConfig.lineHeight); },
    readOnly: true
}, {
    name: "scrolldown",
    bindKey: bindKey("Ctrl-Down", null),
    exec: function(e) { e.renderer.scrollBy(0, 2 * e.renderer.layerConfig.lineHeight); },
    readOnly: true
}, {
    name: "selectlinestart",
    bindKey: "Shift-Home",
    exec: function(editor) { editor.getSelection().selectLineStart(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "selectlineend",
    bindKey: "Shift-End",
    exec: function(editor) { editor.getSelection().selectLineEnd(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "togglerecording",
    bindKey: bindKey("Ctrl-Alt-E", "Command-Option-E"),
    exec: function(editor) { editor.commands.toggleRecording(editor); },
    readOnly: true
}, {
    name: "replaymacro",
    bindKey: bindKey("Ctrl-Shift-E", "Command-Shift-E"),
    exec: function(editor) { editor.commands.replay(editor); },
    readOnly: true
}, {
    name: "jumptomatching",
    bindKey: bindKey("Ctrl-P", "Ctrl-P"),
    exec: function(editor) { editor.jumpToMatching(); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "selecttomatching",
    bindKey: bindKey("Ctrl-Shift-P", "Ctrl-Shift-P"),
    exec: function(editor) { editor.jumpToMatching(true); },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "passKeysToBrowser",
    bindKey: bindKey("null", "null"),
    exec: function() {},
    passEvent: true,
    readOnly: true
},
{
    name: "cut",
    exec: function(editor) {
        var range = editor.getSelectionRange();
        editor._emit("cut", range);

        if (!editor.selection.isEmpty()) {
            editor.session.remove(range);
            editor.clearSelection();
        }
    },
    scrollIntoView: "cursor",
    multiSelectAction: "forEach"
}, {
    name: "removeline",
    bindKey: bindKey("Ctrl-D", "Command-D"),
    exec: function(editor) { editor.removeLines(); },
    scrollIntoView: "cursor",
    multiSelectAction: "forEachLine"
}, {
    name: "duplicateSelection",
    bindKey: bindKey("Ctrl-Shift-D", "Command-Shift-D"),
    exec: function(editor) { editor.duplicateSelection(); },
    scrollIntoView: "cursor",
    multiSelectAction: "forEach"
}, {
    name: "sortlines",
    bindKey: bindKey("Ctrl-Alt-S", "Command-Alt-S"),
    exec: function(editor) { editor.sortLines(); },
    scrollIntoView: "selection",
    multiSelectAction: "forEachLine"
}, {
    name: "togglecomment",
    bindKey: bindKey("Ctrl-/", "Command-/"),
    exec: function(editor) { editor.toggleCommentLines(); },
    multiSelectAction: "forEachLine",
    scrollIntoView: "selectionPart"
}, {
    name: "toggleBlockComment",
    bindKey: bindKey("Ctrl-Shift-/", "Command-Shift-/"),
    exec: function(editor) { editor.toggleBlockComment(); },
    multiSelectAction: "forEach",
    scrollIntoView: "selectionPart"
}, {
    name: "modifyNumberUp",
    bindKey: bindKey("Ctrl-Shift-Up", "Alt-Shift-Up"),
    exec: function(editor) { editor.modifyNumber(1); },
    multiSelectAction: "forEach"
}, {
    name: "modifyNumberDown",
    bindKey: bindKey("Ctrl-Shift-Down", "Alt-Shift-Down"),
    exec: function(editor) { editor.modifyNumber(-1); },
    multiSelectAction: "forEach"
}, {
    name: "replace",
    bindKey: bindKey("Ctrl-H", "Command-Option-F"),
    exec: function(editor) {
        config.loadModule("ace/ext/searchbox", function(e) {e.Search(editor, true)});
    }
}, {
    name: "undo",
    bindKey: bindKey("Ctrl-Z", "Command-Z"),
    exec: function(editor) { editor.undo(); }
}, {
    name: "redo",
    bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
    exec: function(editor) { editor.redo(); }
}, {
    name: "copylinesup",
    bindKey: bindKey("Alt-Shift-Up", "Command-Option-Up"),
    exec: function(editor) { editor.copyLinesUp(); },
    scrollIntoView: "cursor"
}, {
    name: "movelinesup",
    bindKey: bindKey("Alt-Up", "Option-Up"),
    exec: function(editor) { editor.moveLinesUp(); },
    scrollIntoView: "cursor"
}, {
    name: "copylinesdown",
    bindKey: bindKey("Alt-Shift-Down", "Command-Option-Down"),
    exec: function(editor) { editor.copyLinesDown(); },
    scrollIntoView: "cursor"
}, {
    name: "movelinesdown",
    bindKey: bindKey("Alt-Down", "Option-Down"),
    exec: function(editor) { editor.moveLinesDown(); },
    scrollIntoView: "cursor"
}, {
    name: "del",
    bindKey: bindKey("Delete", "Delete|Ctrl-D|Shift-Delete"),
    exec: function(editor) { editor.remove("right"); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "backspace",
    bindKey: bindKey(
        "Shift-Backspace|Backspace",
        "Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"
    ),
    exec: function(editor) { editor.remove("left"); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "cut_or_delete",
    bindKey: bindKey("Shift-Delete", null),
    exec: function(editor) { 
        if (editor.selection.isEmpty()) {
            editor.remove("left");
        } else {
            return false;
        }
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removetolinestart",
    bindKey: bindKey("Alt-Backspace", "Command-Backspace"),
    exec: function(editor) { editor.removeToLineStart(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removetolineend",
    bindKey: bindKey("Alt-Delete", "Ctrl-K"),
    exec: function(editor) { editor.removeToLineEnd(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removewordleft",
    bindKey: bindKey("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
    exec: function(editor) { editor.removeWordLeft(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "removewordright",
    bindKey: bindKey("Ctrl-Delete", "Alt-Delete"),
    exec: function(editor) { editor.removeWordRight(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "outdent",
    bindKey: bindKey("Shift-Tab", "Shift-Tab"),
    exec: function(editor) { editor.blockOutdent(); },
    multiSelectAction: "forEach",
    scrollIntoView: "selectionPart"
}, {
    name: "indent",
    bindKey: bindKey("Tab", "Tab"),
    exec: function(editor) { editor.indent(); },
    multiSelectAction: "forEach",
    scrollIntoView: "selectionPart"
}, {
    name: "blockoutdent",
    bindKey: bindKey("Ctrl-[", "Ctrl-["),
    exec: function(editor) { editor.blockOutdent(); },
    multiSelectAction: "forEachLine",
    scrollIntoView: "selectionPart"
}, {
    name: "blockindent",
    bindKey: bindKey("Ctrl-]", "Ctrl-]"),
    exec: function(editor) { editor.blockIndent(); },
    multiSelectAction: "forEachLine",
    scrollIntoView: "selectionPart"
}, {
    name: "insertstring",
    exec: function(editor, str) { editor.insert(str); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "inserttext",
    exec: function(editor, args) {
        editor.insert(lang.stringRepeat(args.text  || "", args.times || 1));
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "splitline",
    bindKey: bindKey(null, "Ctrl-O"),
    exec: function(editor) { editor.splitLine(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "transposeletters",
    bindKey: bindKey("Ctrl-T", "Ctrl-T"),
    exec: function(editor) { editor.transposeLetters(); },
    multiSelectAction: function(editor) {editor.transposeSelections(1); },
    scrollIntoView: "cursor"
}, {
    name: "touppercase",
    bindKey: bindKey("Ctrl-U", "Ctrl-U"),
    exec: function(editor) { editor.toUpperCase(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "tolowercase",
    bindKey: bindKey("Ctrl-Shift-U", "Ctrl-Shift-U"),
    exec: function(editor) { editor.toLowerCase(); },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor"
}, {
    name: "expandtoline",
    bindKey: bindKey("Ctrl-Shift-L", "Command-Shift-L"),
    exec: function(editor) {
        var range = editor.selection.getRange();

        range.start.column = range.end.column = 0;
        range.end.row++;
        editor.selection.setRange(range, false);
    },
    multiSelectAction: "forEach",
    scrollIntoView: "cursor",
    readOnly: true
}, {
    name: "joinlines",
    bindKey: bindKey(null, null),
    exec: function(editor) {
        var isBackwards = editor.selection.isBackwards();
        var selectionStart = isBackwards ? editor.selection.getSelectionLead() : editor.selection.getSelectionAnchor();
        var selectionEnd = isBackwards ? editor.selection.getSelectionAnchor() : editor.selection.getSelectionLead();
        var firstLineEndCol = editor.session.doc.getLine(selectionStart.row).length
        var selectedText = editor.session.doc.getTextRange(editor.selection.getRange());
        var selectedCount = selectedText.replace(/\n\s*/, " ").length;
        var insertLine = editor.session.doc.getLine(selectionStart.row);

        for (var i = selectionStart.row + 1; i <= selectionEnd.row + 1; i++) {
            var curLine = lang.stringTrimLeft(lang.stringTrimRight(editor.session.doc.getLine(i)));
            if (curLine.length !== 0) {
                curLine = " " + curLine;
            }
            insertLine += curLine;
        };

        if (selectionEnd.row + 1 < (editor.session.doc.getLength() - 1)) {
            insertLine += editor.session.doc.getNewLineCharacter();
        }

        editor.clearSelection();
        editor.session.doc.replace(new Range(selectionStart.row, 0, selectionEnd.row + 2, 0), insertLine);

        if (selectedCount > 0) {
            editor.selection.moveCursorTo(selectionStart.row, selectionStart.column);
            editor.selection.selectTo(selectionStart.row, selectionStart.column + selectedCount);
        } else {
            firstLineEndCol = editor.session.doc.getLine(selectionStart.row).length > firstLineEndCol ? (firstLineEndCol + 1) : firstLineEndCol;
            editor.selection.moveCursorTo(selectionStart.row, firstLineEndCol);
        }
    },
    multiSelectAction: "forEach",
    readOnly: true
}, {
    name: "invertSelection",
    bindKey: bindKey(null, null),
    exec: function(editor) {
        var endRow = editor.session.doc.getLength() - 1;
        var endCol = editor.session.doc.getLine(endRow).length;
        var ranges = editor.selection.rangeList.ranges;
        var newRanges = [];
        if (ranges.length < 1) {
            ranges = [editor.selection.getRange()];
        }

        for (var i = 0; i < ranges.length; i++) {
            if (i == (ranges.length - 1)) {
                if (!(ranges[i].end.row === endRow && ranges[i].end.column === endCol)) {
                    newRanges.push(new Range(ranges[i].end.row, ranges[i].end.column, endRow, endCol));
                }
            }

            if (i === 0) {
                if (!(ranges[i].start.row === 0 && ranges[i].start.column === 0)) {
                    newRanges.push(new Range(0, 0, ranges[i].start.row, ranges[i].start.column));
                }
            } else {
                newRanges.push(new Range(ranges[i-1].end.row, ranges[i-1].end.column, ranges[i].start.row, ranges[i].start.column));
            }
        }

        editor.exitMultiSelectMode();
        editor.clearSelection();

        for(var i = 0; i < newRanges.length; i++) {
            editor.selection.addRange(newRanges[i], false);
        }
    },
    readOnly: true,
    scrollIntoView: "none"
}];

});

ace.define("ace/mouse/default_gutter_handler",["require","exports","module","ace/lib/dom","ace/lib/oop","ace/lib/event","ace/tooltip"], function(require, exports, module) {
"use strict";
var dom = require("../lib/dom");
var oop = require("../lib/oop");
var event = require("../lib/event");
var Tooltip = require("../tooltip").Tooltip;

function GutterHandler(mouseHandler) {
    var editor = mouseHandler.editor;
    var gutter = editor.renderer.$gutterLayer;
    var tooltip = new GutterTooltip(editor.container);

    mouseHandler.editor.setDefaultHandler("guttermousedown", function(e) {
        if (!editor.isFocused() || e.getButton() != 0)
            return;
        var gutterRegion = gutter.getRegion(e);

        if (gutterRegion == "foldWidgets")
            return;

        var row = e.getDocumentPosition().row;
        var selection = editor.session.selection;

        if (e.getShiftKey())
            selection.selectTo(row, 0);
        else {
            if (e.domEvent.detail == 2) {
                editor.selectAll();
                return e.preventDefault();
            }
            mouseHandler.$clickSelection = editor.selection.getLineRange(row);
        }
        mouseHandler.setState("selectByLines");
        mouseHandler.captureMouse(e);
        return e.preventDefault();
    });


    var tooltipTimeout, mouseEvent, tooltipAnnotation;

    function showTooltip() {
        var row = mouseEvent.getDocumentPosition().row;
        var annotation = gutter.$annotations[row];
        if (!annotation)
            return hideTooltip();

        var maxRow = editor.session.getLength();
        if (row == maxRow) {
            var screenRow = editor.renderer.pixelToScreenCoordinates(0, mouseEvent.y).row;
            var pos = mouseEvent.$pos;
            if (screenRow > editor.session.documentToScreenRow(pos.row, pos.column))
                return hideTooltip();
        }

        if (tooltipAnnotation == annotation)
            return;
        tooltipAnnotation = annotation.text.join("<br/>");

        tooltip.setHtml(tooltipAnnotation);
        tooltip.show();
        editor.on("mousewheel", hideTooltip);

        if (mouseHandler.$tooltipFollowsMouse) {
            moveTooltip(mouseEvent);
        } else {
            var gutterElement = gutter.$cells[editor.session.documentToScreenRow(row, 0)].element;
            var rect = gutterElement.getBoundingClientRect();
            var style = tooltip.getElement().style;
            style.left = rect.right + "px";
            style.top = rect.bottom + "px";
        }
    }

    function hideTooltip() {
        if (tooltipTimeout)
            tooltipTimeout = clearTimeout(tooltipTimeout);
        if (tooltipAnnotation) {
            tooltip.hide();
            tooltipAnnotation = null;
            editor.removeEventListener("mousewheel", hideTooltip);
        }
    }

    function moveTooltip(e) {
        tooltip.setPosition(e.x, e.y);
    }

    mouseHandler.editor.setDefaultHandler("guttermousemove", function(e) {
        var target = e.domEvent.target || e.domEvent.srcElement;
        if (dom.hasCssClass(target, "ace_fold-widget"))
            return hideTooltip();

        if (tooltipAnnotation && mouseHandler.$tooltipFollowsMouse)
            moveTooltip(e);

        mouseEvent = e;
        if (tooltipTimeout)
            return;
        tooltipTimeout = setTimeout(function() {
            tooltipTimeout = null;
            if (mouseEvent && !mouseHandler.isMousePressed)
                showTooltip();
            else
                hideTooltip();
        }, 50);
    });

    event.addListener(editor.renderer.$gutter, "mouseout", function(e) {
        mouseEvent = null;
        if (!tooltipAnnotation || tooltipTimeout)
            return;

        tooltipTimeout = setTimeout(function() {
            tooltipTimeout = null;
            hideTooltip();
        }, 50);
    });
    
    editor.on("changeSession", hideTooltip);
}

function GutterTooltip(parentNode) {
    Tooltip.call(this, parentNode);
}

oop.inherits(GutterTooltip, Tooltip);

(function(){
    this.setPosition = function(x, y) {
        var windowWidth = window.innerWidth || document.documentElement.clientWidth;
        var windowHeight = window.innerHeight || document.documentElement.clientHeight;
        var width = this.getWidth();
        var height = this.getHeight();
        x += 15;
        y += 15;
        if (x + width > windowWidth) {
            x -= (x + width) - windowWidth;
        }
        if (y + height > windowHeight) {
            y -= 20 + height;
        }
        Tooltip.prototype.setPosition.call(this, x, y);
    };

}).call(GutterTooltip.prototype);



exports.GutterHandler = GutterHandler;

});

ace.define("ace/mouse/dragdrop_handler",["require","exports","module","ace/lib/dom","ace/lib/event","ace/lib/useragent"], function(require, exports, module) {
"use strict";

var dom = require("../lib/dom");
var event = require("../lib/event");
var useragent = require("../lib/useragent");

var AUTOSCROLL_DELAY = 200;
var SCROLL_CURSOR_DELAY = 200;
var SCROLL_CURSOR_HYSTERESIS = 5;

function DragdropHandler(mouseHandler) {

    var editor = mouseHandler.editor;

    var blankImage = dom.createElement("img");
    blankImage.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    if (useragent.isOpera)
        blankImage.style.cssText = "width:1px;height:1px;position:fixed;top:0;left:0;z-index:2147483647;opacity:0;";

    var exports = ["dragWait", "dragWaitEnd", "startDrag", "dragReadyEnd", "onMouseDrag"];

     exports.forEach(function(x) {
         mouseHandler[x] = this[x];
    }, this);
    editor.addEventListener("mousedown", this.onMouseDown.bind(mouseHandler));


    var mouseTarget = editor.container;
    var dragSelectionMarker, x, y;
    var timerId, range;
    var dragCursor, counter = 0;
    var dragOperation;
    var isInternal;
    var autoScrollStartTime;
    var cursorMovedTime;
    var cursorPointOnCaretMoved;

    this.onDragStart = function(e) {
        if (this.cancelDrag || !mouseTarget.draggable) {
            var self = this;
            setTimeout(function(){
                self.startSelect();
                self.captureMouse(e);
            }, 0);
            return e.preventDefault();
        }
        range = editor.getSelectionRange();

        var dataTransfer = e.dataTransfer;
        dataTransfer.effectAllowed = editor.getReadOnly() ? "copy" : "copyMove";
        if (useragent.isOpera) {
            editor.container.appendChild(blankImage);
            blankImage.scrollTop = 0;
        }
        dataTransfer.setDragImage && dataTransfer.setDragImage(blankImage, 0, 0);
        if (useragent.isOpera) {
            editor.container.removeChild(blankImage);
        }
        dataTransfer.clearData();
        dataTransfer.setData("Text", editor.session.getTextRange());

        isInternal = true;
        this.setState("drag");
    };

    this.onDragEnd = function(e) {
        mouseTarget.draggable = false;
        isInternal = false;
        this.setState(null);
        if (!editor.getReadOnly()) {
            var dropEffect = e.dataTransfer.dropEffect;
            if (!dragOperation && dropEffect == "move")
                editor.session.remove(editor.getSelectionRange());
            editor.renderer.$cursorLayer.setBlinking(true);
        }
        this.editor.unsetStyle("ace_dragging");
    };

    this.onDragEnter = function(e) {
        if (editor.getReadOnly() || !canAccept(e.dataTransfer))
            return;
        x = e.clientX;
        y = e.clientY;
        if (!dragSelectionMarker)
            addDragMarker();
        counter++;
        e.dataTransfer.dropEffect = dragOperation = getDropEffect(e);
        return event.preventDefault(e);
    };

    this.onDragOver = function(e) {
        if (editor.getReadOnly() || !canAccept(e.dataTransfer))
            return;
        x = e.clientX;
        y = e.clientY;
        if (!dragSelectionMarker) {
            addDragMarker();
            counter++;
        }
        if (onMouseMoveTimer !== null)
            onMouseMoveTimer = null;

        e.dataTransfer.dropEffect = dragOperation = getDropEffect(e);
        return event.preventDefault(e);
    };

    this.onDragLeave = function(e) {
        counter--;
        if (counter <= 0 && dragSelectionMarker) {
            clearDragMarker();
            dragOperation = null;
            return event.preventDefault(e);
        }
    };

    this.onDrop = function(e) {
        if (!dragCursor)
            return;
        var dataTransfer = e.dataTransfer;
        if (isInternal) {
            switch (dragOperation) {
                case "move":
                    if (range.contains(dragCursor.row, dragCursor.column)) {
                        range = {
                            start: dragCursor,
                            end: dragCursor
                        };
                    } else {
                        range = editor.moveText(range, dragCursor);
                    }
                    break;
                case "copy":
                    range = editor.moveText(range, dragCursor, true);
                    break;
            }
        } else {
            var dropData = dataTransfer.getData('Text');
            range = {
                start: dragCursor,
                end: editor.session.insert(dragCursor, dropData)
            };
            editor.focus();
            dragOperation = null;
        }
        clearDragMarker();
        return event.preventDefault(e);
    };

    event.addListener(mouseTarget, "dragstart", this.onDragStart.bind(mouseHandler));
    event.addListener(mouseTarget, "dragend", this.onDragEnd.bind(mouseHandler));
    event.addListener(mouseTarget, "dragenter", this.onDragEnter.bind(mouseHandler));
    event.addListener(mouseTarget, "dragover", this.onDragOver.bind(mouseHandler));
    event.addListener(mouseTarget, "dragleave", this.onDragLeave.bind(mouseHandler));
    event.addListener(mouseTarget, "drop", this.onDrop.bind(mouseHandler));

    function scrollCursorIntoView(cursor, prevCursor) {
        var now = Date.now();
        var vMovement = !prevCursor || cursor.row != prevCursor.row;
        var hMovement = !prevCursor || cursor.column != prevCursor.column;
        if (!cursorMovedTime || vMovement || hMovement) {
            editor.$blockScrolling += 1;
            editor.moveCursorToPosition(cursor);
            editor.$blockScrolling -= 1;
            cursorMovedTime = now;
            cursorPointOnCaretMoved = {x: x, y: y};
        } else {
            var distance = calcDistance(cursorPointOnCaretMoved.x, cursorPointOnCaretMoved.y, x, y);
            if (distance > SCROLL_CURSOR_HYSTERESIS) {
                cursorMovedTime = null;
            } else if (now - cursorMovedTime >= SCROLL_CURSOR_DELAY) {
                editor.renderer.scrollCursorIntoView();
                cursorMovedTime = null;
            }
        }
    }

    function autoScroll(cursor, prevCursor) {
        var now = Date.now();
        var lineHeight = editor.renderer.layerConfig.lineHeight;
        var characterWidth = editor.renderer.layerConfig.characterWidth;
        var editorRect = editor.renderer.scroller.getBoundingClientRect();
        var offsets = {
           x: {
               left: x - editorRect.left,
               right: editorRect.right - x
           },
           y: {
               top: y - editorRect.top,
               bottom: editorRect.bottom - y
           }
        };
        var nearestXOffset = Math.min(offsets.x.left, offsets.x.right);
        var nearestYOffset = Math.min(offsets.y.top, offsets.y.bottom);
        var scrollCursor = {row: cursor.row, column: cursor.column};
        if (nearestXOffset / characterWidth <= 2) {
            scrollCursor.column += (offsets.x.left < offsets.x.right ? -3 : +2);
        }
        if (nearestYOffset / lineHeight <= 1) {
            scrollCursor.row += (offsets.y.top < offsets.y.bottom ? -1 : +1);
        }
        var vScroll = cursor.row != scrollCursor.row;
        var hScroll = cursor.column != scrollCursor.column;
        var vMovement = !prevCursor || cursor.row != prevCursor.row;
        if (vScroll || (hScroll && !vMovement)) {
            if (!autoScrollStartTime)
                autoScrollStartTime = now;
            else if (now - autoScrollStartTime >= AUTOSCROLL_DELAY)
                editor.renderer.scrollCursorIntoView(scrollCursor);
        } else {
            autoScrollStartTime = null;
        }
    }

    function onDragInterval() {
        var prevCursor = dragCursor;
        dragCursor = editor.renderer.screenToTextCoordinates(x, y);
        scrollCursorIntoView(dragCursor, prevCursor);
        autoScroll(dragCursor, prevCursor);
    }

    function addDragMarker() {
        range = editor.selection.toOrientedRange();
        dragSelectionMarker = editor.session.addMarker(range, "ace_selection", editor.getSelectionStyle());
        editor.clearSelection();
        if (editor.isFocused())
            editor.renderer.$cursorLayer.setBlinking(false);
        clearInterval(timerId);
        onDragInterval();
        timerId = setInterval(onDragInterval, 20);
        counter = 0;
        event.addListener(document, "mousemove", onMouseMove);
    }

    function clearDragMarker() {
        clearInterval(timerId);
        editor.session.removeMarker(dragSelectionMarker);
        dragSelectionMarker = null;
        editor.$blockScrolling += 1;
        editor.selection.fromOrientedRange(range);
        editor.$blockScrolling -= 1;
        if (editor.isFocused() && !isInternal)
            editor.renderer.$cursorLayer.setBlinking(!editor.getReadOnly());
        range = null;
        dragCursor = null;
        counter = 0;
        autoScrollStartTime = null;
        cursorMovedTime = null;
        event.removeListener(document, "mousemove", onMouseMove);
    }
    var onMouseMoveTimer = null;
    function onMouseMove() {
        if (onMouseMoveTimer == null) {
            onMouseMoveTimer = setTimeout(function() {
                if (onMouseMoveTimer != null && dragSelectionMarker)
                    clearDragMarker();
            }, 20);
        }
    }

    function canAccept(dataTransfer) {
        var types = dataTransfer.types;
        return !types || Array.prototype.some.call(types, function(type) {
            return type == 'text/plain' || type == 'Text';
        });
    }

    function getDropEffect(e) {
        var copyAllowed = ['copy', 'copymove', 'all', 'uninitialized'];
        var moveAllowed = ['move', 'copymove', 'linkmove', 'all', 'uninitialized'];

        var copyModifierState = useragent.isMac ? e.altKey : e.ctrlKey;
        var effectAllowed = "uninitialized";
        try {
            effectAllowed = e.dataTransfer.effectAllowed.toLowerCase();
        } catch (e) {}
        var dropEffect = "none";

        if (copyModifierState && copyAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "copy";
        else if (moveAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "move";
        else if (copyAllowed.indexOf(effectAllowed) >= 0)
            dropEffect = "copy";

        return dropEffect;
    }
}

(function() {

    this.dragWait = function() {
        var interval = Date.now() - this.mousedownEvent.time;
        if (interval > this.editor.getDragDelay())
            this.startDrag();
    };

    this.dragWaitEnd = function() {
        var target = this.editor.container;
        target.draggable = false;
        this.startSelect(this.mousedownEvent.getDocumentPosition());
        this.selectEnd();
    };

    this.dragReadyEnd = function(e) {
        this.editor.renderer.$cursorLayer.setBlinking(!this.editor.getReadOnly());
        this.editor.unsetStyle("ace_dragging");
        this.dragWaitEnd();
    };

    this.startDrag = function(){
        this.cancelDrag = false;
        var target = this.editor.container;
        target.draggable = true;
        this.editor.renderer.$cursorLayer.setBlinking(false);
        this.editor.setStyle("ace_dragging");
        this.setState("dragReady");
    };

    this.onMouseDrag = function(e) {
        var target = this.editor.container;
        if (useragent.isIE && this.state == "dragReady") {
            var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
            if (distance > 3)
                target.dragDrop();
        }
        if (this.state === "dragWait") {
            var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
            if (distance > 0) {
                target.draggable = false;
                this.startSelect(this.mousedownEvent.getDocumentPosition());
            }
        }
    };

    this.onMouseDown = function(e) {
        if (!this.$dragEnabled)
            return;
        this.mousedownEvent = e;
        var editor = this.editor;

        var inSelection = e.inSelection();
        var button = e.getButton();
        var clickCount = e.domEvent.detail || 1;
        if (clickCount === 1 && button === 0 && inSelection) {
            if (e.editor.inMultiSelectMode && (e.getAccelKey() || e.getShiftKey()))
                return;
            this.mousedownEvent.time = Date.now();
            var eventTarget = e.domEvent.target || e.domEvent.srcElement;
            if ("unselectable" in eventTarget)
                eventTarget.unselectable = "on";
            if (editor.getDragDelay()) {
                if (useragent.isWebKit) {
                    this.cancelDrag = true;
                    var mouseTarget = editor.container;
                    mouseTarget.draggable = true;
                }
                this.setState("dragWait");
            } else {
                this.startDrag();
            }
            this.captureMouse(e, this.onMouseDrag.bind(this));
            e.defaultPrevented = true;
        }
    };

}).call(DragdropHandler.prototype);


function calcDistance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

exports.DragdropHandler = DragdropHandler;

});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/editor",["require","exports","module","ace/lib/fixoldbrowsers","ace/lib/oop","ace/lib/dom","ace/lib/lang","ace/lib/useragent","ace/keyboard/textinput","ace/keyboard/keybinding","ace/edit_session","ace/search","ace/range","ace/lib/event_emitter","ace/commands/command_manager","ace/commands/default_commands","ace/config","ace/token_iterator","ace/editor_protocol","ace/lib/event","ace/mouse/default_gutter_handler","ace/mouse/dragdrop_handler"], function(require, exports, module) {
"no use strict";
require("./lib/fixoldbrowsers");

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var lang = require("./lib/lang");
var useragent = require("./lib/useragent");
var TextInput = require("./keyboard/textinput").TextInput;
var KeyBinding = require("./keyboard/keybinding").KeyBinding;
var esm = require("./edit_session");
var Search = require("./search").Search;
var rng = require("./range");
var eve = require("./lib/event_emitter");
var cmm = require("./commands/command_manager");
var defaultCommands = require("./commands/default_commands").commands;
var config = require("./config");
var tkm = require("./token_iterator");
var protocol = require('./editor_protocol');

var event = require("./lib/event");
var DefaultGutterHandler = require("./mouse/default_gutter_handler").GutterHandler;
var DragdropHandler = require("./mouse/dragdrop_handler").DragdropHandler;
var Editor = (function (_super) {
    __extends(Editor, _super);
    function Editor(renderer, session) {
        _super.call(this);
        this.commands = new cmm.CommandManager(useragent.isMac ? "mac" : "win", defaultCommands);
        this.curOp = null;
        this.prevOp = {};
        this.$mergeableCommands = ["backspace", "del", "insertstring"];
        this.container = renderer.getContainerElement();
        this.renderer = renderer;

        this.textInput = new TextInput(renderer.getTextAreaContainer(), this);
        this.renderer.textarea = this.textInput.getElement();
        this.keyBinding = new KeyBinding(this);
        this.$mouseHandler = new MouseHandler(this);
        new FoldHandler(this);

        this.$blockScrolling = 0;
        this.$search = new Search().set({
            wrap: true
        });

        this.$historyTracker = this.$historyTracker.bind(this);
        this.commands.on("exec", this.$historyTracker);

        this.$initOperationListeners();

        this._$emitInputEvent = lang.delayedCall(function () {
            this._signal("input", {});
            this.session.bgTokenizer && this.session.bgTokenizer.scheduleStart();
        }.bind(this));

        this.on("change", function (_, _self) {
            _self._$emitInputEvent.schedule(31);
        });

        this.setSession(session || new esm.EditSession(""));
        config.resetOptions(this);
        config._signal("editor", this);
    }
    Editor.prototype.cancelMouseContextMenu = function () {
        this.$mouseHandler.cancelContextMenu();
    };

    Object.defineProperty(Editor.prototype, "selection", {
        get: function () {
            return this.session.getSelection();
        },
        enumerable: true,
        configurable: true
    });

    Editor.prototype.$initOperationListeners = function () {
        function last(a) {
            return a[a.length - 1];
        }

        this.selections = [];
        this.commands.on("exec", function (e) {
            this.startOperation(e);

            var command = e.command;
            if (command.aceCommandGroup == "fileJump") {
                var prev = this.prevOp;
                if (!prev || prev.command.aceCommandGroup != "fileJump") {
                    this.lastFileJumpPos = last(this.selections);
                }
            } else {
                this.lastFileJumpPos = null;
            }
        }.bind(this), true);

        this.commands.on("afterExec", function (e) {
            var command = e.command;

            if (command.aceCommandGroup == "fileJump") {
                if (this.lastFileJumpPos && !this.curOp.selectionChanged) {
                    this.selection.fromJSON(this.lastFileJumpPos);
                }
            }
            this.endOperation(e);
        }.bind(this), true);

        this.$opResetTimer = lang.delayedCall(this.endOperation.bind(this));

        this.on("change", function () {
            this.curOp || this.startOperation();
            this.curOp.docChanged = true;
        }.bind(this), true);

        this.on("changeSelection", function () {
            this.curOp || this.startOperation();
            this.curOp.selectionChanged = true;
        }.bind(this), true);
    };

    Editor.prototype.startOperation = function (commadEvent) {
        if (this.curOp) {
            if (!commadEvent || this.curOp.command)
                return;
            this.prevOp = this.curOp;
        }
        if (!commadEvent) {
            this.previousCommand = null;
            commadEvent = {};
        }

        this.$opResetTimer.schedule();
        this.curOp = {
            command: commadEvent.command || {},
            args: commadEvent.args,
            scrollTop: this.renderer.scrollTop
        };

        var command = this.curOp.command;
        if (command && command.scrollIntoView)
            this.$blockScrolling++;

        this.selections.push(this.selection.toJSON());
    };

    Editor.prototype.endOperation = function () {
        if (this.curOp) {
            var command = this.curOp.command;
            if (command && command.scrollIntoView) {
                this.$blockScrolling--;
                switch (command.scrollIntoView) {
                    case "center":
                        this.renderer.scrollCursorIntoView(null, 0.5);
                        break;
                    case "animate":
                    case "cursor":
                        this.renderer.scrollCursorIntoView();
                        break;
                    case "selectionPart":
                        var range = this.selection.getRange();
                        var config = this.renderer.layerConfig;
                        if (range.start.row >= config.lastRow || range.end.row <= config.firstRow) {
                            this.renderer.scrollSelectionIntoView(this.selection.anchor, this.selection.lead);
                        }
                        break;
                    default:
                        break;
                }
                if (command.scrollIntoView == "animate")
                    this.renderer.animateScrolling(this.curOp.scrollTop);
            }

            this.prevOp = this.curOp;
            this.curOp = null;
        }
    };

    Editor.prototype.$historyTracker = function (e) {
        if (!this.$mergeUndoDeltas)
            return;

        var prev = this.prevOp;
        var mergeableCommands = this.$mergeableCommands;
        var shouldMerge = prev.command && (e.command.name == prev.command.name);
        if (e.command.name == "insertstring") {
            var text = e.args;
            if (this.mergeNextCommand === undefined)
                this.mergeNextCommand = true;

            shouldMerge = shouldMerge && this.mergeNextCommand && (!/\s/.test(text) || /\s/.test(prev.args)); // previous insertion was of same type

            this.mergeNextCommand = true;
        } else {
            shouldMerge = shouldMerge && mergeableCommands.indexOf(e.command.name) !== -1; // the command is mergeable
        }

        if (this.$mergeUndoDeltas != "always" && Date.now() - this.sequenceStartTime > 2000) {
            shouldMerge = false; // the sequence is too long
        }

        if (shouldMerge)
            this.session.mergeUndoDeltas = true;
        else if (mergeableCommands.indexOf(e.command.name) !== -1)
            this.sequenceStartTime = Date.now();
    };
    Editor.prototype.setKeyboardHandler = function (keyboardHandler) {
        if (!keyboardHandler) {
            this.keyBinding.setKeyboardHandler(null);
        } else if (typeof keyboardHandler === "string") {
            this.$keybindingId = keyboardHandler;
            var _self = this;
            config.loadModule(["keybinding", keyboardHandler], function (module) {
                if (_self.$keybindingId == keyboardHandler)
                    _self.keyBinding.setKeyboardHandler(module && module.handler);
            });
        } else {
            this.$keybindingId = null;
            this.keyBinding.setKeyboardHandler(keyboardHandler);
        }
    };
    Editor.prototype.getKeyboardHandler = function () {
        return this.keyBinding.getKeyboardHandler();
    };
    Editor.prototype.setSession = function (session) {
        if (this.session == session)
            return;

        var oldSession = this.session;
        if (oldSession) {
            this.session.removeEventListener("change", this.$onDocumentChange);
            this.session.removeEventListener("changeMode", this.$onChangeMode);
            this.session.removeEventListener("tokenizerUpdate", this.$onTokenizerUpdate);
            this.session.removeEventListener("changeTabSize", this.$onChangeTabSize);
            this.session.removeEventListener("changeWrapLimit", this.$onChangeWrapLimit);
            this.session.removeEventListener("changeWrapMode", this.$onChangeWrapMode);
            this.session.removeEventListener("onChangeFold", this.$onChangeFold);
            this.session.removeEventListener("changeFrontMarker", this.$onChangeFrontMarker);
            this.session.removeEventListener("changeBackMarker", this.$onChangeBackMarker);
            this.session.removeEventListener("changeBreakpoint", this.$onChangeBreakpoint);
            this.session.removeEventListener("changeAnnotation", this.$onChangeAnnotation);
            this.session.removeEventListener("changeOverwrite", this.$onCursorChange);
            this.session.removeEventListener("changeScrollTop", this.$onScrollTopChange);
            this.session.removeEventListener("changeScrollLeft", this.$onScrollLeftChange);

            var selection = this.session.getSelection();
            selection.removeEventListener("changeCursor", this.$onCursorChange);
            selection.removeEventListener("changeSelection", this.$onSelectionChange);
        }

        this.session = session;
        if (session) {
            this.$onDocumentChange = this.onDocumentChange.bind(this);
            session.addEventListener("change", this.$onDocumentChange);
            this.renderer.setSession(session);

            this.$onChangeMode = this.onChangeMode.bind(this);
            session.addEventListener("changeMode", this.$onChangeMode);

            this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
            session.addEventListener("tokenizerUpdate", this.$onTokenizerUpdate);

            this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(this.renderer);
            session.addEventListener("changeTabSize", this.$onChangeTabSize);

            this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
            session.addEventListener("changeWrapLimit", this.$onChangeWrapLimit);

            this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
            session.addEventListener("changeWrapMode", this.$onChangeWrapMode);

            this.$onChangeFold = this.onChangeFold.bind(this);
            session.addEventListener("changeFold", this.$onChangeFold);

            this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(this);
            this.session.addEventListener("changeFrontMarker", this.$onChangeFrontMarker);

            this.$onChangeBackMarker = this.onChangeBackMarker.bind(this);
            this.session.addEventListener("changeBackMarker", this.$onChangeBackMarker);

            this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
            this.session.addEventListener("changeBreakpoint", this.$onChangeBreakpoint);

            this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
            this.session.addEventListener("changeAnnotation", this.$onChangeAnnotation);

            this.$onCursorChange = this.onCursorChange.bind(this);
            this.session.addEventListener("changeOverwrite", this.$onCursorChange);

            this.$onScrollTopChange = this.onScrollTopChange.bind(this);
            this.session.addEventListener("changeScrollTop", this.$onScrollTopChange);

            this.$onScrollLeftChange = this.onScrollLeftChange.bind(this);
            this.session.addEventListener("changeScrollLeft", this.$onScrollLeftChange);

            this.selection = session.getSelection();
            this.selection.addEventListener("changeCursor", this.$onCursorChange);

            this.$onSelectionChange = this.onSelectionChange.bind(this);
            this.selection.addEventListener("changeSelection", this.$onSelectionChange);

            this.onChangeMode();

            this.$blockScrolling += 1;
            this.onCursorChange();
            this.$blockScrolling -= 1;

            this.onScrollTopChange();
            this.onScrollLeftChange();
            this.onSelectionChange();
            this.onChangeFrontMarker();
            this.onChangeBackMarker();
            this.onChangeBreakpoint();
            this.onChangeAnnotation();
            this.session.getUseWrapMode() && this.renderer.adjustWrapLimit();
            this.renderer.updateFull();
        }

        this._signal("changeSession", {
            session: session,
            oldSession: oldSession
        });

        oldSession && oldSession._signal("changeEditor", { oldEditor: this });
        session && session._signal("changeEditor", { editor: this });
    };
    Editor.prototype.getSession = function () {
        return this.session;
    };
    Editor.prototype.setValue = function (val, cursorPos) {
        this.session.doc.setValue(val);

        if (!cursorPos) {
            this.selectAll();
        } else if (cursorPos == 1) {
            this.navigateFileEnd();
        } else if (cursorPos == -1) {
            this.navigateFileStart();
        }
        return val;
    };
    Editor.prototype.getValue = function () {
        return this.session.getValue();
    };
    Editor.prototype.getSelection = function () {
        return this.selection;
    };
    Editor.prototype.resize = function (force) {
        this.renderer.onResize(force);
    };
    Editor.prototype.setTheme = function (theme, cb) {
        this.renderer.setTheme(theme, cb);
    };
    Editor.prototype.getTheme = function () {
        return this.renderer.getTheme();
    };
    Editor.prototype.setStyle = function (style) {
        this.renderer.setStyle(style);
    };
    Editor.prototype.unsetStyle = function (style) {
        this.renderer.unsetStyle(style);
    };
    Editor.prototype.getFontSize = function () {
        return this.getOption("fontSize") || dom.computedStyle(this.container, "fontSize");
    };
    Editor.prototype.setFontSize = function (fontSize) {
        this.setOption("fontSize", fontSize);
    };

    Editor.prototype.$highlightBrackets = function () {
        if (this.session.$bracketHighlight) {
            this.session.removeMarker(this.session.$bracketHighlight);
            this.session.$bracketHighlight = null;
        }

        if (this.$highlightPending) {
            return;
        }
        var self = this;
        this.$highlightPending = true;
        setTimeout(function () {
            self.$highlightPending = false;

            var pos = self.session.findMatchingBracket(self.getCursorPosition());
            if (pos) {
                var range = new rng.Range(pos.row, pos.column, pos.row, pos.column + 1);
            } else if (self.session.$mode.getMatching) {
                var range = self.session.$mode.getMatching(self.session);
            }
            if (range)
                self.session.$bracketHighlight = self.session.addMarker(range, "ace_bracket", "text");
        }, 50);
    };
    Editor.prototype.$highlightTags = function () {
        var session = this.session;

        if (this.$highlightTagPending) {
            return;
        }
        var self = this;
        this.$highlightTagPending = true;
        setTimeout(function () {
            self.$highlightTagPending = false;

            var pos = self.getCursorPosition();
            var iterator = new tkm.TokenIterator(self.session, pos.row, pos.column);
            var token = iterator.getCurrentToken();

            if (!token || token.type.indexOf('tag-name') === -1) {
                session.removeMarker(session.$tagHighlight);
                session.$tagHighlight = null;
                return;
            }

            var tag = token.value;
            var depth = 0;
            var prevToken = iterator.stepBackward();

            if (prevToken.value == '<') {
                do {
                    prevToken = token;
                    token = iterator.stepForward();

                    if (token && token.value === tag && token.type.indexOf('tag-name') !== -1) {
                        if (prevToken.value === '<') {
                            depth++;
                        } else if (prevToken.value === '</') {
                            depth--;
                        }
                    }
                } while(token && depth >= 0);
            } else {
                do {
                    token = prevToken;
                    prevToken = iterator.stepBackward();

                    if (token && token.value === tag && token.type.indexOf('tag-name') !== -1) {
                        if (prevToken.value === '<') {
                            depth++;
                        } else if (prevToken.value === '</') {
                            depth--;
                        }
                    }
                } while(prevToken && depth <= 0);
                iterator.stepForward();
            }

            if (!token) {
                session.removeMarker(session.$tagHighlight);
                session.$tagHighlight = null;
                return;
            }

            var row = iterator.getCurrentTokenRow();
            var column = iterator.getCurrentTokenColumn();
            var range = new rng.Range(row, column, row, column + token.value.length);
            if (session.$tagHighlight && range.compareRange(session.$backMarkers[session.$tagHighlight].range) !== 0) {
                session.removeMarker(session.$tagHighlight);
                session.$tagHighlight = null;
            }

            if (range && !session.$tagHighlight)
                session.$tagHighlight = session.addMarker(range, "ace_bracket", "text");
        }, 50);
    };
    Editor.prototype.focus = function () {
        var _self = this;
        setTimeout(function () {
            _self.textInput.focus();
        });
        this.textInput.focus();
    };
    Editor.prototype.isFocused = function () {
        return this.textInput.isFocused();
    };
    Editor.prototype.blur = function () {
        this.textInput.blur();
    };
    Editor.prototype.onFocus = function () {
        if (this.$isFocused)
            return;
        this.$isFocused = true;
        this.renderer.showCursor();
        this.renderer.visualizeFocus();
        this._emit("focus");
    };
    Editor.prototype.onBlur = function () {
        if (!this.$isFocused)
            return;
        this.$isFocused = false;
        this.renderer.hideCursor();
        this.renderer.visualizeBlur();
        this._emit("blur");
    };

    Editor.prototype.$cursorChange = function () {
        this.renderer.updateCursor();
    };
    Editor.prototype.onDocumentChange = function (e) {
        var delta = e.data;
        var range = delta.range;
        var lastRow;

        if (range.start.row == range.end.row && delta.action != "insertLines" && delta.action != "removeLines")
            lastRow = range.end.row;
        else
            lastRow = Infinity;

        var r = this.renderer;
        r.updateLines(range.start.row, lastRow, this.session.$useWrapMode);

        this._signal("change", e);
        this.$cursorChange();
        this.$updateHighlightActiveLine();
    };

    Editor.prototype.onTokenizerUpdate = function (e) {
        var rows = e.data;
        this.renderer.updateLines(rows.first, rows.last);
    };

    Editor.prototype.onScrollTopChange = function () {
        this.renderer.scrollToY(this.session.getScrollTop());
    };

    Editor.prototype.onScrollLeftChange = function () {
        this.renderer.scrollToX(this.session.getScrollLeft());
    };
    Editor.prototype.onCursorChange = function () {
        this.$cursorChange();

        if (!this.$blockScrolling) {
            this.renderer.scrollCursorIntoView();
        }

        this.$highlightBrackets();
        this.$highlightTags();
        this.$updateHighlightActiveLine();
        this._signal("changeSelection");
    };

    Editor.prototype.$updateHighlightActiveLine = function () {
        var session = this.getSession();

        var highlight;
        if (this.$highlightActiveLine) {
            if ((this.$selectionStyle != "line" || !this.selection.isMultiLine()))
                highlight = this.getCursorPosition();
            if (this.renderer.$maxLines && this.session.getLength() === 1 && !(this.renderer.$minLines > 1))
                highlight = false;
        }

        if (session.$highlightLineMarker && !highlight) {
            session.removeMarker(session.$highlightLineMarker.id);
            session.$highlightLineMarker = null;
        } else if (!session.$highlightLineMarker && highlight) {
            var range = new rng.Range(highlight.row, highlight.column, highlight.row, Infinity);
            range.id = session.addMarker(range, "ace_active-line", "screenLine");
            session.$highlightLineMarker = range;
        } else if (highlight) {
            session.$highlightLineMarker.start.row = highlight.row;
            session.$highlightLineMarker.end.row = highlight.row;
            session.$highlightLineMarker.start.column = highlight.column;
            session._signal("changeBackMarker");
        }
    };

    Editor.prototype.onSelectionChange = function (e) {
        var session = this.session;

        if (session.$selectionMarker) {
            session.removeMarker(session.$selectionMarker);
        }
        session.$selectionMarker = null;

        if (!this.selection.isEmpty()) {
            var range = this.selection.getRange();
            var style = this.getSelectionStyle();
            session.$selectionMarker = session.addMarker(range, "ace_selection", style);
        } else {
            this.$updateHighlightActiveLine();
        }

        var re = this.$highlightSelectedWord && this.$getSelectionHighLightRegexp();
        this.session.highlight(re);

        this._signal("changeSelection");
    };

    Editor.prototype.$getSelectionHighLightRegexp = function () {
        var session = this.session;

        var selection = this.getSelectionRange();
        if (selection.isEmpty() || selection.isMultiLine())
            return;

        var startOuter = selection.start.column - 1;
        var endOuter = selection.end.column + 1;
        var line = session.getLine(selection.start.row);
        var lineCols = line.length;
        var needle = line.substring(Math.max(startOuter, 0), Math.min(endOuter, lineCols));
        if ((startOuter >= 0 && /^[\w\d]/.test(needle)) || (endOuter <= lineCols && /[\w\d]$/.test(needle)))
            return;

        needle = line.substring(selection.start.column, selection.end.column);
        if (!/^[\w\d]+$/.test(needle))
            return;

        var re = this.$search.$assembleRegExp({
            wholeWord: true,
            caseSensitive: true,
            needle: needle
        });

        return re;
    };

    Editor.prototype.onChangeFrontMarker = function () {
        this.renderer.updateFrontMarkers();
    };

    Editor.prototype.onChangeBackMarker = function () {
        this.renderer.updateBackMarkers();
    };

    Editor.prototype.onChangeBreakpoint = function () {
        this.renderer.updateBreakpoints();
    };

    Editor.prototype.onChangeAnnotation = function () {
        this.renderer.setAnnotations(this.session.getAnnotations());
    };

    Editor.prototype.onChangeMode = function (e) {
        this.renderer.updateText();
        this._emit("changeMode", e);
    };

    Editor.prototype.onChangeWrapLimit = function () {
        this.renderer.updateFull();
    };

    Editor.prototype.onChangeWrapMode = function () {
        this.renderer.onResize(true);
    };

    Editor.prototype.onChangeFold = function () {
        this.$updateHighlightActiveLine();
        this.renderer.updateFull();
    };
    Editor.prototype.getSelectedText = function () {
        return this.session.getTextRange(this.getSelectionRange());
    };
    Editor.prototype.getCopyText = function () {
        var text = this.getSelectedText();
        this._signal("copy", text);
        return text;
    };
    Editor.prototype.onCopy = function () {
        this.commands.exec("copy", this);
    };
    Editor.prototype.onCut = function () {
        this.commands.exec("cut", this);
    };
    Editor.prototype.onPaste = function (text) {
        if (this.$readOnly)
            return;
        var e = { text: text };
        this._signal("paste", e);
        this.insert(e.text, true);
    };

    Editor.prototype.execCommand = function (command, args) {
        this.commands.exec(command, this, args);
    };
    Editor.prototype.insert = function (text, pasted) {
        var session = this.session;
        var mode = session.getMode();
        var cursor = this.getCursorPosition();

        if (this.getBehavioursEnabled() && !pasted) {
            var transform = mode.transformAction(session.getState(cursor.row), 'insertion', this, session, text);
            if (transform) {
                if (text !== transform.text) {
                    this.session.mergeUndoDeltas = false;
                    this.$mergeNextCommand = false;
                }
                text = transform.text;
            }
        }

        if (text == "\t")
            text = this.session.getTabString();
        if (!this.selection.isEmpty()) {
            var range = this.getSelectionRange();
            cursor = this.session.remove(range);
            this.clearSelection();
        } else if (this.session.getOverwrite()) {
            var range = rng.Range.fromPoints(cursor, cursor);
            range.end.column += text.length;
            this.session.remove(range);
        }

        if (text == "\n" || text == "\r\n") {
            var line = session.getLine(cursor.row);
            if (cursor.column > line.search(/\S|$/)) {
                var d = line.substr(cursor.column).search(/\S|$/);
                session.doc.removeInLine(cursor.row, cursor.column, cursor.column + d);
            }
        }
        this.clearSelection();

        var start = cursor.column;
        var lineState = session.getState(cursor.row);
        var line = session.getLine(cursor.row);
        var shouldOutdent = mode.checkOutdent(lineState, line, text);
        var end = session.insert(cursor, text);

        if (transform && transform.selection) {
            if (transform.selection.length == 2) {
                this.selection.setSelectionRange(new rng.Range(cursor.row, start + transform.selection[0], cursor.row, start + transform.selection[1]));
            } else {
                this.selection.setSelectionRange(new rng.Range(cursor.row + transform.selection[0], transform.selection[1], cursor.row + transform.selection[2], transform.selection[3]));
            }
        }

        if (session.getDocument().isNewLine(text)) {
            var lineIndent = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());

            session.insert({ row: cursor.row + 1, column: 0 }, lineIndent);
        }
        if (shouldOutdent)
            mode.autoOutdent(lineState, session, cursor.row);
    };

    Editor.prototype.onTextInput = function (text) {
        this.keyBinding.onTextInput(text);
        if (text === '.') {
            this.commands.exec(protocol.COMMAND_NAME_AUTO_COMPLETE);
        } else if (this.getSession().getDocument().isNewLine(text)) {
            var lineNumber = this.getCursorPosition().row;
        }
    };

    Editor.prototype.onCommandKey = function (e, hashId, keyCode) {
        this.keyBinding.onCommandKey(e, hashId, keyCode);
    };
    Editor.prototype.setOverwrite = function (overwrite) {
        this.session.setOverwrite(overwrite);
    };
    Editor.prototype.getOverwrite = function () {
        return this.session.getOverwrite();
    };
    Editor.prototype.toggleOverwrite = function () {
        this.session.toggleOverwrite();
    };
    Editor.prototype.setScrollSpeed = function (speed) {
        this.setOption("scrollSpeed", speed);
    };
    Editor.prototype.getScrollSpeed = function () {
        return this.getOption("scrollSpeed");
    };
    Editor.prototype.setDragDelay = function (dragDelay) {
        this.setOption("dragDelay", dragDelay);
    };
    Editor.prototype.getDragDelay = function () {
        return this.getOption("dragDelay");
    };
    Editor.prototype.setSelectionStyle = function (val) {
        this.setOption("selectionStyle", val);
    };
    Editor.prototype.getSelectionStyle = function () {
        return this.getOption("selectionStyle");
    };
    Editor.prototype.setHighlightActiveLine = function (shouldHighlight) {
        this.setOption("highlightActiveLine", shouldHighlight);
    };
    Editor.prototype.getHighlightActiveLine = function () {
        return this.getOption("highlightActiveLine");
    };

    Editor.prototype.setHighlightGutterLine = function (shouldHighlight) {
        this.setOption("highlightGutterLine", shouldHighlight);
    };

    Editor.prototype.getHighlightGutterLine = function () {
        return this.getOption("highlightGutterLine");
    };
    Editor.prototype.setHighlightSelectedWord = function (shouldHighlight) {
        this.setOption("highlightSelectedWord", shouldHighlight);
    };
    Editor.prototype.getHighlightSelectedWord = function () {
        return this.$highlightSelectedWord;
    };

    Editor.prototype.setAnimatedScroll = function (shouldAnimate) {
        this.renderer.setAnimatedScroll(shouldAnimate);
    };

    Editor.prototype.getAnimatedScroll = function () {
        return this.renderer.getAnimatedScroll();
    };
    Editor.prototype.setShowInvisibles = function (showInvisibles) {
        this.renderer.setShowInvisibles(showInvisibles);
    };
    Editor.prototype.getShowInvisibles = function () {
        return this.renderer.getShowInvisibles();
    };

    Editor.prototype.setDisplayIndentGuides = function (displayIndentGuides) {
        this.renderer.setDisplayIndentGuides(displayIndentGuides);
    };

    Editor.prototype.getDisplayIndentGuides = function () {
        return this.renderer.getDisplayIndentGuides();
    };
    Editor.prototype.setShowPrintMargin = function (showPrintMargin) {
        this.renderer.setShowPrintMargin(showPrintMargin);
    };
    Editor.prototype.getShowPrintMargin = function () {
        return this.renderer.getShowPrintMargin();
    };
    Editor.prototype.setPrintMarginColumn = function (showPrintMargin) {
        this.renderer.setPrintMarginColumn(showPrintMargin);
    };
    Editor.prototype.getPrintMarginColumn = function () {
        return this.renderer.getPrintMarginColumn();
    };
    Editor.prototype.setReadOnly = function (readOnly) {
        this.setOption("readOnly", readOnly);
    };
    Editor.prototype.getReadOnly = function () {
        return this.getOption("readOnly");
    };
    Editor.prototype.setBehavioursEnabled = function (enabled) {
        this.setOption("behavioursEnabled", enabled);
    };
    Editor.prototype.getBehavioursEnabled = function () {
        return this.getOption("behavioursEnabled");
    };
    Editor.prototype.setWrapBehavioursEnabled = function (enabled) {
        this.setOption("wrapBehavioursEnabled", enabled);
    };
    Editor.prototype.getWrapBehavioursEnabled = function () {
        return this.getOption("wrapBehavioursEnabled");
    };
    Editor.prototype.setShowFoldWidgets = function (show) {
        this.setOption("showFoldWidgets", show);
    };
    Editor.prototype.getShowFoldWidgets = function () {
        return this.getOption("showFoldWidgets");
    };

    Editor.prototype.setFadeFoldWidgets = function (fade) {
        this.setOption("fadeFoldWidgets", fade);
    };

    Editor.prototype.getFadeFoldWidgets = function () {
        return this.getOption("fadeFoldWidgets");
    };
    Editor.prototype.remove = function (dir) {
        if (this.selection.isEmpty()) {
            if (dir == "left")
                this.selection.selectLeft();
            else
                this.selection.selectRight();
        }

        var range = this.getSelectionRange();
        if (this.getBehavioursEnabled()) {
            var session = this.session;
            var state = session.getState(range.start.row);
            var new_range = session.getMode().transformAction(state, 'deletion', this, session, range);

            if (range.end.column === 0) {
                var text = session.getTextRange(range);
                if (text[text.length - 1] == "\n") {
                    var line = session.getLine(range.end.row);
                    if (/^\s+$/.test(line)) {
                        range.end.column = line.length;
                    }
                }
            }
            if (new_range)
                range = new_range;
        }

        this.session.remove(range);
        this.clearSelection();
    };
    Editor.prototype.removeWordRight = function () {
        if (this.selection.isEmpty())
            this.selection.selectWordRight();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };
    Editor.prototype.removeWordLeft = function () {
        if (this.selection.isEmpty())
            this.selection.selectWordLeft();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };
    Editor.prototype.removeToLineStart = function () {
        if (this.selection.isEmpty())
            this.selection.selectLineStart();

        this.session.remove(this.getSelectionRange());
        this.clearSelection();
    };
    Editor.prototype.removeToLineEnd = function () {
        if (this.selection.isEmpty())
            this.selection.selectLineEnd();

        var range = this.getSelectionRange();
        if (range.start.column == range.end.column && range.start.row == range.end.row) {
            range.end.column = 0;
            range.end.row++;
        }

        this.session.remove(range);
        this.clearSelection();
    };
    Editor.prototype.splitLine = function () {
        if (!this.selection.isEmpty()) {
            this.session.remove(this.getSelectionRange());
            this.clearSelection();
        }

        var cursor = this.getCursorPosition();
        this.insert("\n");
        this.moveCursorToPosition(cursor);
    };
    Editor.prototype.transposeLetters = function () {
        if (!this.selection.isEmpty()) {
            return;
        }

        var cursor = this.getCursorPosition();
        var column = cursor.column;
        if (column === 0)
            return;

        var line = this.session.getLine(cursor.row);
        var swap, range;
        if (column < line.length) {
            swap = line.charAt(column) + line.charAt(column - 1);
            range = new rng.Range(cursor.row, column - 1, cursor.row, column + 1);
        } else {
            swap = line.charAt(column - 1) + line.charAt(column - 2);
            range = new rng.Range(cursor.row, column - 2, cursor.row, column);
        }
        this.session.replace(range, swap);
    };
    Editor.prototype.toLowerCase = function () {
        var originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        var range = this.getSelectionRange();
        var text = this.session.getTextRange(range);
        this.session.replace(range, text.toLowerCase());
        this.selection.setSelectionRange(originalRange);
    };
    Editor.prototype.toUpperCase = function () {
        var originalRange = this.getSelectionRange();
        if (this.selection.isEmpty()) {
            this.selection.selectWord();
        }

        var range = this.getSelectionRange();
        var text = this.session.getTextRange(range);
        this.session.replace(range, text.toUpperCase());
        this.selection.setSelectionRange(originalRange);
    };
    Editor.prototype.indent = function () {
        var session = this.session;
        var range = this.getSelectionRange();

        if (range.start.row < range.end.row) {
            var rows = this.$getSelectedRows();
            session.indentRows(rows.first, rows.last, "\t");
            return;
        } else if (range.start.column < range.end.column) {
            var text = session.getTextRange(range);
            if (!/^\s+$/.test(text)) {
                var rows = this.$getSelectedRows();
                session.indentRows(rows.first, rows.last, "\t");
                return;
            }
        }

        var line = session.getLine(range.start.row);
        var position = range.start;
        var size = session.getTabSize();
        var column = session.documentToScreenColumn(position.row, position.column);

        if (this.session.getUseSoftTabs()) {
            var count = (size - column % size);
            var indentString = lang.stringRepeat(" ", count);
        } else {
            var count = column % size;
            while (line[range.start.column] == " " && count) {
                range.start.column--;
                count--;
            }
            this.selection.setSelectionRange(range);
            indentString = "\t";
        }
        return this.insert(indentString);
    };
    Editor.prototype.blockIndent = function () {
        var rows = this.$getSelectedRows();
        this.session.indentRows(rows.first, rows.last, "\t");
    };
    Editor.prototype.blockOutdent = function () {
        var selection = this.session.getSelection();
        this.session.outdentRows(selection.getRange());
    };
    Editor.prototype.sortLines = function () {
        var rows = this.$getSelectedRows();
        var session = this.session;

        var lines = [];
        for (i = rows.first; i <= rows.last; i++)
            lines.push(session.getLine(i));

        lines.sort(function (a, b) {
            if (a.toLowerCase() < b.toLowerCase())
                return -1;
            if (a.toLowerCase() > b.toLowerCase())
                return 1;
            return 0;
        });

        var deleteRange = new rng.Range(0, 0, 0, 0);
        for (var i = rows.first; i <= rows.last; i++) {
            var line = session.getLine(i);
            deleteRange.start.row = i;
            deleteRange.end.row = i;
            deleteRange.end.column = line.length;
            session.replace(deleteRange, lines[i - rows.first]);
        }
    };
    Editor.prototype.toggleCommentLines = function () {
        var state = this.session.getState(this.getCursorPosition().row);
        var rows = this.$getSelectedRows();
        this.session.getMode().toggleCommentLines(state, this.session, rows.first, rows.last);
    };

    Editor.prototype.toggleBlockComment = function () {
        var cursor = this.getCursorPosition();
        var state = this.session.getState(cursor.row);
        var range = this.getSelectionRange();
        this.session.getMode().toggleBlockComment(state, this.session, range, cursor);
    };
    Editor.prototype.getNumberAt = function (row, column) {
        var _numberRx = /[\-]?[0-9]+(?:\.[0-9]+)?/g;
        _numberRx.lastIndex = 0;

        var s = this.session.getLine(row);
        while (_numberRx.lastIndex < column) {
            var m = _numberRx.exec(s);
            if (m.index <= column && m.index + m[0].length >= column) {
                var number = {
                    value: m[0],
                    start: m.index,
                    end: m.index + m[0].length
                };
                return number;
            }
        }
        return null;
    };
    Editor.prototype.modifyNumber = function (amount) {
        var row = this.selection.getCursor().row;
        var column = this.selection.getCursor().column;
        var charRange = new rng.Range(row, column - 1, row, column);

        var c = parseFloat(this.session.getTextRange(charRange));
        if (!isNaN(c) && isFinite(c)) {
            var nr = this.getNumberAt(row, column);
            if (nr) {
                var fp = nr.value.indexOf(".") >= 0 ? nr.start + nr.value.indexOf(".") + 1 : nr.end;
                var decimals = nr.start + nr.value.length - fp;

                var t = parseFloat(nr.value);
                t *= Math.pow(10, decimals);

                if (fp !== nr.end && column < fp) {
                    amount *= Math.pow(10, nr.end - column - 1);
                } else {
                    amount *= Math.pow(10, nr.end - column);
                }

                t += amount;
                t /= Math.pow(10, decimals);
                var nnr = t.toFixed(decimals);
                var replaceRange = new rng.Range(row, nr.start, row, nr.end);
                this.session.replace(replaceRange, nnr);
                this.moveCursorTo(row, Math.max(nr.start + 1, column + nnr.length - nr.value.length));
            }
        }
    };
    Editor.prototype.removeLines = function () {
        var rows = this.$getSelectedRows();
        var range;
        if (rows.first === 0 || rows.last + 1 < this.session.getLength())
            range = new rng.Range(rows.first, 0, rows.last + 1, 0);
        else
            range = new rng.Range(rows.first - 1, this.session.getLine(rows.first - 1).length, rows.last, this.session.getLine(rows.last).length);
        this.session.remove(range);
        this.clearSelection();
    };

    Editor.prototype.duplicateSelection = function () {
        var sel = this.selection;
        var doc = this.session;
        var range = sel.getRange();
        var reverse = sel.isBackwards();
        if (range.isEmpty()) {
            var row = range.start.row;
            doc.duplicateLines(row, row);
        } else {
            var point = reverse ? range.start : range.end;
            var endPoint = doc.insert(point, doc.getTextRange(range));
            range.start = point;
            range.end = endPoint;

            sel.setSelectionRange(range, reverse);
        }
    };
    Editor.prototype.moveLinesDown = function () {
        this.$moveLines(function (firstRow, lastRow) {
            return this.session.moveLinesDown(firstRow, lastRow);
        });
    };
    Editor.prototype.moveLinesUp = function () {
        this.$moveLines(function (firstRow, lastRow) {
            return this.session.moveLinesUp(firstRow, lastRow);
        });
    };
    Editor.prototype.moveText = function (range, toPosition, copy) {
        return this.session.moveText(range, toPosition, copy);
    };
    Editor.prototype.copyLinesUp = function () {
        this.$moveLines(function (firstRow, lastRow) {
            this.session.duplicateLines(firstRow, lastRow);
            return 0;
        });
    };
    Editor.prototype.copyLinesDown = function () {
        this.$moveLines(function (firstRow, lastRow) {
            return this.session.duplicateLines(firstRow, lastRow);
        });
    };
    Editor.prototype.$moveLines = function (mover) {
        var selection = this.selection;
        if (!selection['inMultiSelectMode'] || this.inVirtualSelectionMode) {
            var range = selection.toOrientedRange();
            var rows = this.$getSelectedRows();
            var linesMoved = mover.call(this, rows.first, rows.last);
            range.moveBy(linesMoved, 0);
            selection.fromOrientedRange(range);
        } else {
            var ranges = selection.rangeList.ranges;
            selection.rangeList.detach(this.session);

            for (var i = ranges.length; i--;) {
                var rangeIndex = i;
                var rows = ranges[i].collapseRows();
                var last = rows.end.row;
                var first = rows.start.row;
                while (i--) {
                    rows = ranges[i].collapseRows();
                    if (first - rows.end.row <= 1)
                        first = rows.end.row;
                    else
                        break;
                }
                i++;

                var linesMoved = mover.call(this, first, last);
                while (rangeIndex >= i) {
                    ranges[rangeIndex].moveBy(linesMoved, 0);
                    rangeIndex--;
                }
            }
            selection.fromOrientedRange(selection.ranges[0]);
            selection.rangeList.attach(this.session);
        }
    };
    Editor.prototype.$getSelectedRows = function () {
        var range = this.getSelectionRange().collapseRows();

        return {
            first: this.session.getRowFoldStart(range.start.row),
            last: this.session.getRowFoldEnd(range.end.row)
        };
    };

    Editor.prototype.onCompositionStart = function (text) {
        this.renderer.showComposition(this.getCursorPosition());
    };

    Editor.prototype.onCompositionUpdate = function (text) {
        this.renderer.setCompositionText(text);
    };

    Editor.prototype.onCompositionEnd = function () {
        this.renderer.hideComposition();
    };
    Editor.prototype.getFirstVisibleRow = function () {
        return this.renderer.getFirstVisibleRow();
    };
    Editor.prototype.getLastVisibleRow = function () {
        return this.renderer.getLastVisibleRow();
    };
    Editor.prototype.isRowVisible = function (row) {
        return (row >= this.getFirstVisibleRow() && row <= this.getLastVisibleRow());
    };
    Editor.prototype.isRowFullyVisible = function (row) {
        return (row >= this.renderer.getFirstFullyVisibleRow() && row <= this.renderer.getLastFullyVisibleRow());
    };
    Editor.prototype.$getVisibleRowCount = function () {
        return this.renderer.getScrollBottomRow() - this.renderer.getScrollTopRow() + 1;
    };

    Editor.prototype.$moveByPage = function (dir, select) {
        var renderer = this.renderer;
        var config = this.renderer.layerConfig;
        var rows = dir * Math.floor(config.height / config.lineHeight);

        this.$blockScrolling++;
        if (select === true) {
            this.selection.$moveSelection(function () {
                this.moveCursorBy(rows, 0);
            });
        } else if (select === false) {
            this.selection.moveCursorBy(rows, 0);
            this.selection.clearSelection();
        }
        this.$blockScrolling--;

        var scrollTop = renderer.scrollTop;

        renderer.scrollBy(0, rows * config.lineHeight);
        if (select != null)
            renderer.scrollCursorIntoView(null, 0.5);

        renderer.animateScrolling(scrollTop);
    };
    Editor.prototype.selectPageDown = function () {
        this.$moveByPage(1, true);
    };
    Editor.prototype.selectPageUp = function () {
        this.$moveByPage(-1, true);
    };
    Editor.prototype.gotoPageDown = function () {
        this.$moveByPage(1, false);
    };
    Editor.prototype.gotoPageUp = function () {
        this.$moveByPage(-1, false);
    };
    Editor.prototype.scrollPageDown = function () {
        this.$moveByPage(1);
    };
    Editor.prototype.scrollPageUp = function () {
        this.$moveByPage(-1);
    };
    Editor.prototype.scrollToRow = function (row) {
        this.renderer.scrollToRow(row);
    };
    Editor.prototype.scrollToLine = function (line, center, animate, callback) {
        this.renderer.scrollToLine(line, center, animate, callback);
    };
    Editor.prototype.centerSelection = function () {
        var range = this.getSelectionRange();
        var pos = {
            row: Math.floor(range.start.row + (range.end.row - range.start.row) / 2),
            column: Math.floor(range.start.column + (range.end.column - range.start.column) / 2)
        };
        this.renderer.alignCursor(pos, 0.5);
    };
    Editor.prototype.getCursorPosition = function () {
        return this.selection.getCursor();
    };
    Editor.prototype.getCursorPositionScreen = function () {
        var cursor = this.getCursorPosition();
        return this.session.documentToScreenPosition(cursor.row, cursor.column);
    };
    Editor.prototype.getSelectionRange = function () {
        return this.selection.getRange();
    };
    Editor.prototype.selectAll = function () {
        this.$blockScrolling += 1;
        this.selection.selectAll();
        this.$blockScrolling -= 1;
    };
    Editor.prototype.clearSelection = function () {
        this.selection.clearSelection();
    };
    Editor.prototype.moveCursorTo = function (row, column, animate) {
        this.selection.moveCursorTo(row, column, animate);
    };
    Editor.prototype.moveCursorToPosition = function (pos) {
        this.selection.moveCursorToPosition(pos);
    };
    Editor.prototype.jumpToMatching = function (select) {
        var cursor = this.getCursorPosition();
        var iterator = new tkm.TokenIterator(this.session, cursor.row, cursor.column);
        var prevToken = iterator.getCurrentToken();
        var token = prevToken;

        if (!token)
            token = iterator.stepForward();

        if (!token)
            return;
        var matchType;
        var found = false;
        var depth = {};
        var i = cursor.column - token.start;
        var bracketType;
        var brackets = {
            ")": "(",
            "(": "(",
            "]": "[",
            "[": "[",
            "{": "{",
            "}": "{"
        };

        do {
            if (token.value.match(/[{}()\[\]]/g)) {
                for (; i < token.value.length && !found; i++) {
                    if (!brackets[token.value[i]]) {
                        continue;
                    }

                    bracketType = brackets[token.value[i]] + '.' + token.type.replace("rparen", "lparen");

                    if (isNaN(depth[bracketType])) {
                        depth[bracketType] = 0;
                    }

                    switch (token.value[i]) {
                        case '(':
                        case '[':
                        case '{':
                            depth[bracketType]++;
                            break;
                        case ')':
                        case ']':
                        case '}':
                            depth[bracketType]--;

                            if (depth[bracketType] === -1) {
                                matchType = 'bracket';
                                found = true;
                            }
                            break;
                    }
                }
            } else if (token && token.type.indexOf('tag-name') !== -1) {
                if (isNaN(depth[token.value])) {
                    depth[token.value] = 0;
                }

                if (prevToken.value === '<') {
                    depth[token.value]++;
                } else if (prevToken.value === '</') {
                    depth[token.value]--;
                }

                if (depth[token.value] === -1) {
                    matchType = 'tag';
                    found = true;
                }
            }

            if (!found) {
                prevToken = token;
                token = iterator.stepForward();
                i = 0;
            }
        } while(token && !found);
        if (!matchType) {
            return;
        }

        var range;
        if (matchType === 'bracket') {
            range = this.session.getBracketRange(cursor);
            if (!range) {
                range = new rng.Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + i - 1, iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + i - 1);
                if (!range)
                    return;
                var pos = range.start;
                if (pos.row === cursor.row && Math.abs(pos.column - cursor.column) < 2)
                    range = this.session.getBracketRange(pos);
            }
        } else if (matchType === 'tag') {
            if (token && token.type.indexOf('tag-name') !== -1)
                var tag = token.value;
            else
                return;

            var range = new rng.Range(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() - 2, iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() - 2);
            if (range.compare(cursor.row, cursor.column) === 0) {
                found = false;
                do {
                    token = prevToken;
                    prevToken = iterator.stepBackward();

                    if (prevToken) {
                        if (prevToken.type.indexOf('tag-close') !== -1) {
                            range.setEnd(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + 1);
                        }

                        if (token.value === tag && token.type.indexOf('tag-name') !== -1) {
                            if (prevToken.value === '<') {
                                depth[tag]++;
                            } else if (prevToken.value === '</') {
                                depth[tag]--;
                            }

                            if (depth[tag] === 0)
                                found = true;
                        }
                    }
                } while(prevToken && !found);
            }
            if (token && token.type.indexOf('tag-name')) {
                var pos = range.start;
                if (pos.row == cursor.row && Math.abs(pos.column - cursor.column) < 2)
                    pos = range.end;
            }
        }

        pos = range && range['cursor'] || pos;
        if (pos) {
            if (select) {
                if (range && range.isEqual(this.getSelectionRange()))
                    this.clearSelection();
                else
                    this.selection.selectTo(pos.row, pos.column);
            } else {
                this.selection.moveTo(pos.row, pos.column);
            }
        }
    };
    Editor.prototype.gotoLine = function (lineNumber, column, animate) {
        this.selection.clearSelection();
        this.session.unfold({ row: lineNumber - 1, column: column || 0 });

        this.$blockScrolling += 1;
        this.exitMultiSelectMode && this.exitMultiSelectMode();
        this.moveCursorTo(lineNumber - 1, column || 0);
        this.$blockScrolling -= 1;

        if (!this.isRowFullyVisible(lineNumber - 1))
            this.scrollToLine(lineNumber - 1, true, animate);
    };
    Editor.prototype.navigateTo = function (row, column) {
        this.selection.moveTo(row, column);
    };
    Editor.prototype.navigateUp = function (times) {
        if (this.selection.isMultiLine() && !this.selection.isBackwards()) {
            var selectionStart = this.selection.anchor.getPosition();
            return this.moveCursorToPosition(selectionStart);
        }
        this.selection.clearSelection();
        this.selection.moveCursorBy(-times || -1, 0);
    };
    Editor.prototype.navigateDown = function (times) {
        if (this.selection.isMultiLine() && this.selection.isBackwards()) {
            var selectionEnd = this.selection.anchor.getPosition();
            return this.moveCursorToPosition(selectionEnd);
        }
        this.selection.clearSelection();
        this.selection.moveCursorBy(times || 1, 0);
    };
    Editor.prototype.navigateLeft = function (times) {
        if (!this.selection.isEmpty()) {
            var selectionStart = this.getSelectionRange().start;
            this.moveCursorToPosition(selectionStart);
        } else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorLeft();
            }
        }
        this.clearSelection();
    };
    Editor.prototype.navigateRight = function (times) {
        if (!this.selection.isEmpty()) {
            var selectionEnd = this.getSelectionRange().end;
            this.moveCursorToPosition(selectionEnd);
        } else {
            times = times || 1;
            while (times--) {
                this.selection.moveCursorRight();
            }
        }
        this.clearSelection();
    };
    Editor.prototype.navigateLineStart = function () {
        this.selection.moveCursorLineStart();
        this.clearSelection();
    };
    Editor.prototype.navigateLineEnd = function () {
        this.selection.moveCursorLineEnd();
        this.clearSelection();
    };
    Editor.prototype.navigateFileEnd = function () {
        this.selection.moveCursorFileEnd();
        this.clearSelection();
    };
    Editor.prototype.navigateFileStart = function () {
        this.selection.moveCursorFileStart();
        this.clearSelection();
    };
    Editor.prototype.navigateWordRight = function () {
        this.selection.moveCursorWordRight();
        this.clearSelection();
    };
    Editor.prototype.navigateWordLeft = function () {
        this.selection.moveCursorWordLeft();
        this.clearSelection();
    };
    Editor.prototype.replace = function (replacement, options) {
        if (options)
            this.$search.set(options);

        var range = this.$search.find(this.session);
        var replaced = 0;
        if (!range)
            return replaced;

        if (this.$tryReplace(range, replacement)) {
            replaced = 1;
        }
        if (range !== null) {
            this.selection.setSelectionRange(range);
            this.renderer.scrollSelectionIntoView(range.start, range.end);
        }

        return replaced;
    };
    Editor.prototype.replaceAll = function (replacement, options) {
        if (options) {
            this.$search.set(options);
        }

        var ranges = this.$search.findAll(this.session);
        var replaced = 0;
        if (!ranges.length)
            return replaced;

        this.$blockScrolling += 1;

        var selection = this.getSelectionRange();
        this.selection.moveTo(0, 0);

        for (var i = ranges.length - 1; i >= 0; --i) {
            if (this.$tryReplace(ranges[i], replacement)) {
                replaced++;
            }
        }

        this.selection.setSelectionRange(selection);
        this.$blockScrolling -= 1;

        return replaced;
    };

    Editor.prototype.$tryReplace = function (range, replacement) {
        var input = this.session.getTextRange(range);
        replacement = this.$search.replace(input, replacement);
        if (replacement !== null) {
            range.end = this.session.replace(range, replacement);
            return range;
        } else {
            return null;
        }
    };
    Editor.prototype.getLastSearchOptions = function () {
        return this.$search.getOptions();
    };
    Editor.prototype.find = function (needle, options, animate) {
        if (!options)
            options = {};

        if (typeof needle == "string" || needle instanceof RegExp)
            options.needle = needle;
        else if (typeof needle == "object")
            oop.mixin(options, needle);

        var range = this.selection.getRange();
        if (options.needle == null) {
            needle = this.session.getTextRange(range) || this.$search.$options.needle;
            if (!needle) {
                range = this.session.getWordRange(range.start.row, range.start.column);
                needle = this.session.getTextRange(range);
            }
            this.$search.set({ needle: needle });
        }

        this.$search.set(options);
        if (!options.start)
            this.$search.set({ start: range });

        var newRange = this.$search.find(this.session);
        if (options.preventScroll)
            return newRange;
        if (newRange) {
            this.revealRange(newRange, animate);
            return newRange;
        }
        if (options.backwards)
            range.start = range.end;
        else
            range.end = range.start;
        this.selection.setRange(range);
    };
    Editor.prototype.findNext = function (options, animate) {
        this.find({ skipCurrent: true, backwards: false }, options, animate);
    };
    Editor.prototype.findPrevious = function (options, animate) {
        this.find(options, { skipCurrent: true, backwards: true }, animate);
    };

    Editor.prototype.revealRange = function (range, animate) {
        this.$blockScrolling += 1;
        this.session.unfold(range);
        this.selection.setSelectionRange(range);
        this.$blockScrolling -= 1;

        var scrollTop = this.renderer.scrollTop;
        this.renderer.scrollSelectionIntoView(range.start, range.end, 0.5);
        if (animate !== false)
            this.renderer.animateScrolling(scrollTop);
    };
    Editor.prototype.undo = function () {
        this.$blockScrolling++;
        this.session.getUndoManager().undo();
        this.$blockScrolling--;
        this.renderer.scrollCursorIntoView(null, 0.5);
    };
    Editor.prototype.redo = function () {
        this.$blockScrolling++;
        this.session.getUndoManager().redo();
        this.$blockScrolling--;
        this.renderer.scrollCursorIntoView(null, 0.5);
    };
    Editor.prototype.destroy = function () {
        this.renderer.destroy();
        this._signal("destroy", this);
    };
    Editor.prototype.setAutoScrollEditorIntoView = function (enable) {
        if (!enable)
            return;
        var rect;
        var self = this;
        var shouldScroll = false;
        if (!this.$scrollAnchor)
            this.$scrollAnchor = document.createElement("div");
        var scrollAnchor = this.$scrollAnchor;
        scrollAnchor.style.cssText = "position:absolute";
        this.container.insertBefore(scrollAnchor, this.container.firstChild);
        var onChangeSelection = this.on("changeSelection", function () {
            shouldScroll = true;
        });
        var onBeforeRender = this.renderer.on("beforeRender", function () {
            if (shouldScroll)
                rect = self.renderer.container.getBoundingClientRect();
        });
        var onAfterRender = this.renderer.on("afterRender", function () {
            if (shouldScroll && rect && self.isFocused()) {
                var renderer = self.renderer;
                var pos = renderer.$cursorLayer.$pixelPos;
                var config = renderer.layerConfig;
                var top = pos.top - config.offset;
                if (pos.top >= 0 && top + rect.top < 0) {
                    shouldScroll = true;
                } else if (pos.top < config.height && pos.top + rect.top + config.lineHeight > window.innerHeight) {
                    shouldScroll = false;
                } else {
                    shouldScroll = null;
                }
                if (shouldScroll != null) {
                    scrollAnchor.style.top = top + "px";
                    scrollAnchor.style.left = pos.left + "px";
                    scrollAnchor.style.height = config.lineHeight + "px";
                    scrollAnchor.scrollIntoView(shouldScroll);
                }
                shouldScroll = rect = null;
            }
        });
        this.setAutoScrollEditorIntoView = function (enable) {
            if (enable)
                return;
            delete this.setAutoScrollEditorIntoView;
            this.removeEventListener("changeSelection", onChangeSelection);
            this.renderer.removeEventListener("afterRender", onAfterRender);
            this.renderer.removeEventListener("beforeRender", onBeforeRender);
        };
    };

    Editor.prototype.$resetCursorStyle = function () {
        var style = this.$cursorStyle || "ace";
        var cursorLayer = this.renderer.$cursorLayer;
        if (!cursorLayer)
            return;
        cursorLayer.setSmoothBlinking(/smooth/.test(style));
        cursorLayer.isBlinking = !this.$readOnly && style != "wide";
        dom.setCssClass(cursorLayer.element, "ace_slim-cursors", /slim/.test(style));
    };
    return Editor;
})(eve.EventEmitterClass);
exports.Editor = Editor;

config.defineOptions(Editor.prototype, "editor", {
    selectionStyle: {
        set: function (style) {
            this.onSelectionChange();
            this._signal("changeSelectionStyle", { data: style });
        },
        initialValue: "line"
    },
    highlightActiveLine: {
        set: function () {
            this.$updateHighlightActiveLine();
        },
        initialValue: true
    },
    highlightSelectedWord: {
        set: function (shouldHighlight) {
            this.$onSelectionChange();
        },
        initialValue: true
    },
    readOnly: {
        set: function (readOnly) {
            this.$resetCursorStyle();
        },
        initialValue: false
    },
    cursorStyle: {
        set: function (val) {
            this.$resetCursorStyle();
        },
        values: ["ace", "slim", "smooth", "wide"],
        initialValue: "ace"
    },
    mergeUndoDeltas: {
        values: [false, true, "always"],
        initialValue: true
    },
    behavioursEnabled: { initialValue: true },
    wrapBehavioursEnabled: { initialValue: true },
    autoScrollEditorIntoView: {
        set: function (val) {
            this.setAutoScrollEditorIntoView(val);
        }
    },
    hScrollBarAlwaysVisible: "renderer",
    vScrollBarAlwaysVisible: "renderer",
    highlightGutterLine: "renderer",
    animatedScroll: "renderer",
    showInvisibles: "renderer",
    showPrintMargin: "renderer",
    printMarginColumn: "renderer",
    printMargin: "renderer",
    fadeFoldWidgets: "renderer",
    showFoldWidgets: "renderer",
    showLineNumbers: "renderer",
    showGutter: "renderer",
    displayIndentGuides: "renderer",
    fontSize: "renderer",
    fontFamily: "renderer",
    maxLines: "renderer",
    minLines: "renderer",
    scrollPastEnd: "renderer",
    fixedWidthGutter: "renderer",
    theme: "renderer",
    scrollSpeed: "$mouseHandler",
    dragDelay: "$mouseHandler",
    dragEnabled: "$mouseHandler",
    focusTimout: "$mouseHandler",
    tooltipFollowsMouse: "$mouseHandler",
    firstLineNumber: "session",
    overwrite: "session",
    newLineMode: "session",
    useWorker: "session",
    useSoftTabs: "session",
    tabSize: "session",
    wrap: "session",
    foldStyle: "session",
    mode: "session"
});

var FoldHandler = (function () {
    function FoldHandler(editor) {
        editor.on("click", function (e) {
            var position = e.getDocumentPosition();
            var session = editor.session;
            var fold = session.getFoldAt(position.row, position.column, 1);
            if (fold) {
                if (e.getAccelKey()) {
                    session.removeFold(fold);
                } else {
                    session.expandFold(fold);
                }
                e.stop();
            }
        });

        editor.on("gutterclick", function (e) {
            var gutterRegion = editor.renderer.$gutterLayer.getRegion(e);

            if (gutterRegion == "foldWidgets") {
                var row = e.getDocumentPosition().row;
                var session = editor.session;
                if (session['foldWidgets'] && session['foldWidgets'][row])
                    editor.session['onFoldWidgetClick'](row, e);
                if (!editor.isFocused())
                    editor.focus();
                e.stop();
            }
        });

        editor.on("gutterdblclick", function (e) {
            var gutterRegion = editor.renderer.$gutterLayer.getRegion(e);

            if (gutterRegion == "foldWidgets") {
                var row = e.getDocumentPosition().row;
                var session = editor.session;
                var data = session['getParentFoldRangeData'](row, true);
                var range = data.range || data.firstRange;

                if (range) {
                    row = range.start.row;
                    var fold = session.getFoldAt(row, session.getLine(row).length, 1);

                    if (fold) {
                        session.removeFold(fold);
                    } else {
                        session['addFold']("...", range);
                        editor.renderer.scrollCursorIntoView({ row: range.start.row, column: 0 });
                    }
                }
                e.stop();
            }
        });
    }
    return FoldHandler;
})();

var MouseHandler = (function () {
    function MouseHandler(editor) {
        this.$scrollSpeed = 2;
        this.$dragDelay = 0;
        this.$dragEnabled = true;
        this.$focusTimout = 0;
        this.$tooltpFollowsMouse = true;
        this.$clickSelection = null;
        var _self = this;
        this.editor = editor;
        editor.setDefaultHandler('mousedown', makeMouseDownHandler(editor, this));
        editor.setDefaultHandler('mousewheel', makeMouseWheelHandler(editor, this));
        editor.setDefaultHandler("dblclick", makeDoubleClickHandler(editor, this));
        editor.setDefaultHandler("tripleclick", makeTripleClickHandler(editor, this));
        editor.setDefaultHandler("quadclick", makeQuadClickHandler(editor, this));

        this.selectByLines = makeExtendSelectionBy(editor, this, "getLineRange");
        this.selectByWords = makeExtendSelectionBy(editor, this, "getWordRange");

        new DefaultGutterHandler(this);
        new DragdropHandler(this);

        var onMouseDown = function (e) {
            if (!editor.isFocused() && editor.textInput) {
                editor.textInput.moveToMouse(e);
            }
            editor.focus();
        };

        var mouseTarget = editor.renderer.getMouseEventTarget();
        event.addListener(mouseTarget, "click", this.onMouseEvent.bind(this, "click"));
        event.addListener(mouseTarget, "mousemove", this.onMouseMove.bind(this, "mousemove"));
        event.addMultiMouseDownListener(mouseTarget, [400, 300, 250], this, "onMouseEvent");
        if (editor.renderer.scrollBarV) {
            event.addMultiMouseDownListener(editor.renderer.scrollBarV.inner, [400, 300, 250], this, "onMouseEvent");
            event.addMultiMouseDownListener(editor.renderer.scrollBarH.inner, [400, 300, 250], this, "onMouseEvent");
            if (useragent.isIE) {
                event.addListener(editor.renderer.scrollBarV.element, "mousedown", onMouseDown);
                event.addListener(editor.renderer.scrollBarH.element, "mousemove", onMouseDown);
            }
        }
        event.addMouseWheelListener(editor.container, this.emitEditorMouseWheelEvent.bind(this, "mousewheel"));

        var gutterEl = editor.renderer.$gutter;
        event.addListener(gutterEl, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"));
        event.addListener(gutterEl, "click", this.onMouseEvent.bind(this, "gutterclick"));
        event.addListener(gutterEl, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"));
        event.addListener(gutterEl, "mousemove", this.onMouseEvent.bind(this, "guttermousemove"));

        event.addListener(mouseTarget, "mousedown", onMouseDown);

        event.addListener(gutterEl, "mousedown", function (e) {
            editor.focus();
            return event.preventDefault(e);
        });

        editor.on("mousemove", function (e) {
            if (_self.state || _self.$dragDelay || !_self.$dragEnabled)
                return;

            var char = editor.renderer.screenToTextCoordinates(e.x, e.y);
            var range = editor.session.selection.getRange();
            var renderer = editor.renderer;

            if (!range.isEmpty() && range.insideStart(char.row, char.column)) {
                renderer.setCursorStyle("default");
            } else {
                renderer.setCursorStyle("");
            }
        });
    }
    MouseHandler.prototype.onMouseEvent = function (name, e) {
        this.editor._emit(name, new EditorMouseEvent(e, this.editor));
    };

    MouseHandler.prototype.onMouseMove = function (name, e) {
        var listeners = this.editor._eventRegistry && this.editor._eventRegistry.mousemove;
        if (!listeners || !listeners.length) {
            return;
        }

        this.editor._emit(name, new EditorMouseEvent(e, this.editor));
    };

    MouseHandler.prototype.emitEditorMouseWheelEvent = function (name, e) {
        var mouseEvent = new EditorMouseEvent(e, this.editor);
        mouseEvent.speed = this.$scrollSpeed * 2;
        mouseEvent.wheelX = e['wheelX'];
        mouseEvent.wheelY = e['wheelY'];
        this.editor._emit(name, mouseEvent);
    };

    MouseHandler.prototype.setState = function (state) {
        this.state = state;
    };

    MouseHandler.prototype.textCoordinates = function () {
        return this.editor.renderer.screenToTextCoordinates(this.x, this.y);
    };

    MouseHandler.prototype.captureMouse = function (ev, mouseMoveHandler) {
        this.x = ev.x;
        this.y = ev.y;

        this.isMousePressed = true;
        var renderer = this.editor.renderer;
        if (renderer.$keepTextAreaAtCursor) {
            renderer.$keepTextAreaAtCursor = null;
        }

        var onMouseMove = (function (editor, mouseHandler) {
            return function (mouseEvent) {
                if (!mouseEvent)
                    return;
                if (useragent.isWebKit && !mouseEvent.which && mouseHandler.releaseMouse) {
                    return mouseHandler.releaseMouse(undefined);
                }

                mouseHandler.x = mouseEvent.clientX;
                mouseHandler.y = mouseEvent.clientY;
                mouseMoveHandler && mouseMoveHandler(mouseEvent);
                mouseHandler.mouseEvent = new EditorMouseEvent(mouseEvent, editor);
                mouseHandler.$mouseMoved = true;
            };
        })(this.editor, this);

        var onCaptureEnd = (function (mouseHandler) {
            return function (e) {
                clearInterval(timerId);
                onCaptureInterval();
                mouseHandler[mouseHandler.state + "End"] && mouseHandler[mouseHandler.state + "End"](e);
                mouseHandler.state = "";
                if (renderer.$keepTextAreaAtCursor == null) {
                    renderer.$keepTextAreaAtCursor = true;
                    renderer.$moveTextAreaToCursor();
                }
                mouseHandler.isMousePressed = false;
                mouseHandler.$onCaptureMouseMove = mouseHandler.releaseMouse = null;
                e && mouseHandler.onMouseEvent("mouseup", e);
            };
        })(this);

        var onCaptureInterval = (function (mouseHandler) {
            return function () {
                mouseHandler[mouseHandler.state] && mouseHandler[mouseHandler.state]();
                mouseHandler.$mouseMoved = false;
            };
        })(this);

        if (useragent.isOldIE && ev.domEvent.type == "dblclick") {
            return setTimeout(function () {
                onCaptureEnd(ev);
            });
        }

        this.$onCaptureMouseMove = onMouseMove;
        this.releaseMouse = event.capture(this.editor.container, onMouseMove, onCaptureEnd);
        var timerId = setInterval(onCaptureInterval, 20);
    };

    MouseHandler.prototype.cancelContextMenu = function () {
        var stop = function (e) {
            if (e && e.domEvent && e.domEvent.type != "contextmenu") {
                return;
            }
            this.editor.off("nativecontextmenu", stop);
            if (e && e.domEvent) {
                event.stopEvent(e.domEvent);
            }
        }.bind(this);
        setTimeout(stop, 10);
        this.editor.on("nativecontextmenu", stop);
    };

    MouseHandler.prototype.select = function () {
        var anchor;
        var cursor = this.editor.renderer.screenToTextCoordinates(this.x, this.y);

        if (this.$clickSelection) {
            var cmp = this.$clickSelection.comparePoint(cursor);

            if (cmp == -1) {
                anchor = this.$clickSelection.end;
            } else if (cmp == 1) {
                anchor = this.$clickSelection.start;
            } else {
                var orientedRange = calcRangeOrientation(this.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            this.editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        this.editor.selection.selectToPosition(cursor);

        this.editor.renderer.scrollCursorIntoView();
    };

    MouseHandler.prototype.selectByLinesEnd = function () {
        this.$clickSelection = null;
        this.editor.unsetStyle("ace_selecting");
        if (this.editor.renderer.scroller.releaseCapture) {
            this.editor.renderer.scroller.releaseCapture();
        }
    };

    MouseHandler.prototype.startSelect = function (pos, waitForClickSelection) {
        pos = pos || this.editor.renderer.screenToTextCoordinates(this.x, this.y);
        var editor = this.editor;
        if (this.mousedownEvent.getShiftKey()) {
            editor.selection.selectToPosition(pos);
        } else if (!waitForClickSelection) {
            editor.selection.moveToPosition(pos);
        }

        if (!waitForClickSelection) {
            this.select();
        }

        if (this.editor.renderer.scroller.setCapture) {
            this.editor.renderer.scroller.setCapture();
        }
        editor.setStyle("ace_selecting");
        this.setState("select");
    };

    MouseHandler.prototype.selectEnd = function () {
        this.selectByLinesEnd();
    };

    MouseHandler.prototype.selectAllEnd = function () {
        this.selectByLinesEnd();
    };

    MouseHandler.prototype.selectByWordsEnd = function () {
        this.selectByLinesEnd();
    };

    MouseHandler.prototype.focusWait = function () {
        var distance = calcDistance(this.mousedownEvent.x, this.mousedownEvent.y, this.x, this.y);
        var time = Date.now();

        if (distance > DRAG_OFFSET || time - this.mousedownEvent.time > this.$focusTimout) {
            this.startSelect(this.mousedownEvent.getDocumentPosition());
        }
    };
    return MouseHandler;
})();

config.defineOptions(MouseHandler.prototype, "mouseHandler", {
    scrollSpeed: { initialValue: 2 },
    dragDelay: { initialValue: (useragent.isMac ? 150 : 0) },
    dragEnabled: { initialValue: true },
    focusTimout: { initialValue: 0 },
    tooltipFollowsMouse: { initialValue: true }
});
var EditorMouseEvent = (function () {
    function EditorMouseEvent(domEvent, editor) {
        this.propagationStopped = false;
        this.defaultPrevented = false;
        this.getAccelKey = useragent.isMac ? function () {
            return this.domEvent.metaKey;
        } : function () {
            return this.domEvent.ctrlKey;
        };
        this.domEvent = domEvent;
        this.editor = editor;

        this.x = this.clientX = domEvent.clientX;
        this.y = this.clientY = domEvent.clientY;

        this.$pos = null;
        this.$inSelection = null;
    }
    Object.defineProperty(EditorMouseEvent.prototype, "toElement", {
        get: function () {
            return this.domEvent.toElement;
        },
        enumerable: true,
        configurable: true
    });

    EditorMouseEvent.prototype.stopPropagation = function () {
        event.stopPropagation(this.domEvent);
        this.propagationStopped = true;
    };

    EditorMouseEvent.prototype.preventDefault = function () {
        event.preventDefault(this.domEvent);
        this.defaultPrevented = true;
    };

    EditorMouseEvent.prototype.stop = function () {
        this.stopPropagation();
        this.preventDefault();
    };
    EditorMouseEvent.prototype.getDocumentPosition = function () {
        if (!this.$pos) {
            this.$pos = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
        }
        return this.$pos;
    };
    EditorMouseEvent.prototype.inSelection = function () {
        if (this.$inSelection !== null)
            return this.$inSelection;

        var editor = this.editor;

        var selectionRange = editor.getSelectionRange();
        if (selectionRange.isEmpty())
            this.$inSelection = false;
        else {
            var pos = this.getDocumentPosition();
            this.$inSelection = selectionRange.contains(pos.row, pos.column);
        }

        return this.$inSelection;
    };
    EditorMouseEvent.prototype.getButton = function () {
        return event.getButton(this.domEvent);
    };
    EditorMouseEvent.prototype.getShiftKey = function () {
        return this.domEvent.shiftKey;
    };
    return EditorMouseEvent;
})();

var DRAG_OFFSET = 0;

function makeMouseDownHandler(editor, mouseHandler) {
    return function (ev) {
        var inSelection = ev.inSelection();
        var pos = ev.getDocumentPosition();
        mouseHandler.mousedownEvent = ev;

        var button = ev.getButton();
        if (button !== 0) {
            var selectionRange = editor.getSelectionRange();
            var selectionEmpty = selectionRange.isEmpty();

            if (selectionEmpty)
                editor.selection.moveToPosition(pos);
            editor.textInput.onContextMenu(ev.domEvent);
            return;
        }

        mouseHandler.mousedownEvent.time = Date.now();
        if (inSelection && !editor.isFocused()) {
            editor.focus();
            if (mouseHandler.$focusTimout && !mouseHandler.$clickSelection && !editor.inMultiSelectMode) {
                mouseHandler.setState("focusWait");
                mouseHandler.captureMouse(ev);
                return;
            }
        }

        mouseHandler.captureMouse(ev);
        mouseHandler.startSelect(pos, ev.domEvent['_clicks'] > 1);
        return ev.preventDefault();
    };
}

function makeMouseWheelHandler(editor, mouseHandler) {
    return function (ev) {
        if (ev.getAccelKey()) {
            return;
        }
        if (ev.getShiftKey() && ev.wheelY && !ev.wheelX) {
            ev.wheelX = ev.wheelY;
            ev.wheelY = 0;
        }

        var t = ev.domEvent.timeStamp;
        var dt = t - (mouseHandler.$lastScrollTime || 0);

        var isScrolable = editor.renderer.isScrollableBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed);
        if (isScrolable || dt < 200) {
            mouseHandler.$lastScrollTime = t;
            editor.renderer.scrollBy(ev.wheelX * ev.speed, ev.wheelY * ev.speed);
            return ev.stop();
        }
    };
}

function makeDoubleClickHandler(editor, mouseHandler) {
    return function (editorMouseEvent) {
        var pos = editorMouseEvent.getDocumentPosition();
        var session = editor.session;

        var range = session.getBracketRange(pos);
        if (range) {
            if (range.isEmpty()) {
                range.start.column--;
                range.end.column++;
            }
            mouseHandler.setState("select");
        } else {
            range = editor.selection.getWordRange(pos.row, pos.column);
            mouseHandler.setState("selectByWords");
        }
        mouseHandler.$clickSelection = range;
        mouseHandler.select();
    };
}

function makeTripleClickHandler(editor, mouseHandler) {
    return function (editorMouseEvent) {
        var pos = editorMouseEvent.getDocumentPosition();

        mouseHandler.setState("selectByLines");
        var range = editor.getSelectionRange();
        if (range.isMultiLine() && range.contains(pos.row, pos.column)) {
            mouseHandler.$clickSelection = editor.selection.getLineRange(range.start.row);
            mouseHandler.$clickSelection.end = editor.selection.getLineRange(range.end.row).end;
        } else {
            mouseHandler.$clickSelection = editor.selection.getLineRange(pos.row);
        }
        mouseHandler.select();
    };
}

function makeQuadClickHandler(editor, mouseHandler) {
    return function (editorMouseEvent) {
        editor.selectAll();
        mouseHandler.$clickSelection = editor.getSelectionRange();
        mouseHandler.setState("selectAll");
    };
}

function makeExtendSelectionBy(editor, mouseHandler, unitName) {
    return function () {
        var anchor;
        var cursor = mouseHandler.textCoordinates();
        var range = editor.selection[unitName](cursor.row, cursor.column);

        if (mouseHandler.$clickSelection) {
            var cmpStart = mouseHandler.$clickSelection.comparePoint(range.start);
            var cmpEnd = mouseHandler.$clickSelection.comparePoint(range.end);

            if (cmpStart == -1 && cmpEnd <= 0) {
                anchor = mouseHandler.$clickSelection.end;
                if (range.end.row != cursor.row || range.end.column != cursor.column)
                    cursor = range.start;
            } else if (cmpEnd == 1 && cmpStart >= 0) {
                anchor = mouseHandler.$clickSelection.start;
                if (range.start.row != cursor.row || range.start.column != cursor.column)
                    cursor = range.end;
            } else if (cmpStart == -1 && cmpEnd == 1) {
                cursor = range.end;
                anchor = range.start;
            } else {
                var orientedRange = calcRangeOrientation(mouseHandler.$clickSelection, cursor);
                cursor = orientedRange.cursor;
                anchor = orientedRange.anchor;
            }
            editor.selection.setSelectionAnchor(anchor.row, anchor.column);
        }
        editor.selection.selectToPosition(cursor);

        editor.renderer.scrollCursorIntoView();
    };
}

function calcDistance(ax, ay, bx, by) {
    return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
}

function calcRangeOrientation(range, cursor) {
    if (range.start.row == range.end.row) {
        var cmp = 2 * cursor.column - range.start.column - range.end.column;
    } else if (range.start.row == range.end.row - 1 && !range.start.column && !range.end.column) {
        var cmp = cursor.column - 4;
    } else {
        var cmp = 2 * cursor.row - range.start.row - range.end.row;
    }

    if (cmp < 0) {
        return { cursor: range.start, anchor: range.end };
    } else {
        return { cursor: range.end, anchor: range.start };
    }
}
});

ace.define("ace/undomanager",["require","exports","module"], function(require, exports, module) {
"no use strict";
var UndoManager = (function () {
    function UndoManager() {
        this.reset();
    }
    UndoManager.prototype.execute = function (options) {
        var deltas = options.args[0];
        this.$doc = options.args[1];
        if (options.merge && this.hasUndo()) {
            this.dirtyCounter--;
            deltas = this.$undoStack.pop().concat(deltas);
        }
        this.$undoStack.push(deltas);
        this.$redoStack = [];

        if (this.dirtyCounter < 0) {
            this.dirtyCounter = NaN;
        }
        this.dirtyCounter++;
    };
    UndoManager.prototype.undo = function (dontSelect) {
        var deltas = this.$undoStack.pop();
        var undoSelectionRange = null;
        if (deltas) {
            undoSelectionRange = this.$doc.undoChanges(deltas, dontSelect);
            this.$redoStack.push(deltas);
            this.dirtyCounter--;
        }

        return undoSelectionRange;
    };
    UndoManager.prototype.redo = function (dontSelect) {
        var deltas = this.$redoStack.pop();
        var redoSelectionRange = null;
        if (deltas) {
            redoSelectionRange = this.$doc.redoChanges(deltas, dontSelect);
            this.$undoStack.push(deltas);
            this.dirtyCounter++;
        }

        return redoSelectionRange;
    };
    UndoManager.prototype.reset = function () {
        this.$undoStack = [];
        this.$redoStack = [];
        this.dirtyCounter = 0;
    };
    UndoManager.prototype.hasUndo = function () {
        return this.$undoStack.length > 0;
    };
    UndoManager.prototype.hasRedo = function () {
        return this.$redoStack.length > 0;
    };
    UndoManager.prototype.markClean = function () {
        this.dirtyCounter = 0;
    };
    UndoManager.prototype.isClean = function () {
        return this.dirtyCounter === 0;
    };
    return UndoManager;
})();
exports.UndoManager = UndoManager;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/layer/gutter",["require","exports","module","ace/lib/dom","ace/lib/lang","ace/lib/event_emitter"], function(require, exports, module) {
"no use strict";
var dom = require("../lib/dom");

var lang = require("../lib/lang");
var evem = require("../lib/event_emitter");

var Gutter = (function (_super) {
    __extends(Gutter, _super);
    function Gutter(parentEl) {
        _super.call(this);
        this.gutterWidth = 0;
        this.$annotations = [];
        this.$cells = [];
        this.$fixedWidth = false;
        this.$showLineNumbers = true;
        this.$renderer = "";
        this.$showFoldWidgets = true;
        this.element = dom.createElement("div");
        this.element.className = "ace_layer ace_gutter-layer";
        parentEl.appendChild(this.element);
        this.setShowFoldWidgets(this.$showFoldWidgets);
        this.$updateAnnotations = this.$updateAnnotations.bind(this);
    }
    Gutter.prototype.setSession = function (session) {
        if (this.session)
            this.session.removeEventListener("change", this.$updateAnnotations);
        this.session = session;
        session.on("change", this.$updateAnnotations);
    };

    Gutter.prototype.addGutterDecoration = function (row, className) {
        if (window.console)
            console.warn && console.warn("deprecated use session.addGutterDecoration");
        this.session.addGutterDecoration(row, className);
    };

    Gutter.prototype.removeGutterDecoration = function (row, className) {
        if (window.console)
            console.warn && console.warn("deprecated use session.removeGutterDecoration");
        this.session.removeGutterDecoration(row, className);
    };

    Gutter.prototype.setAnnotations = function (annotations) {
        this.$annotations = [];
        for (var i = 0; i < annotations.length; i++) {
            var annotation = annotations[i];
            var row = annotation.row;
            var rowInfo = this.$annotations[row];
            if (!rowInfo)
                rowInfo = this.$annotations[row] = { text: [] };

            var annoText = annotation.text;
            annoText = annoText ? lang.escapeHTML(annoText) : annotation.html || "";

            if (rowInfo.text.indexOf(annoText) === -1)
                rowInfo.text.push(annoText);

            var type = annotation.type;
            if (type == "error")
                rowInfo.className = " ace_error";
            else if (type == "warning" && rowInfo.className != " ace_error")
                rowInfo.className = " ace_warning";
            else if (type == "info" && (!rowInfo.className))
                rowInfo.className = " ace_info";
        }
    };

    Gutter.prototype.$updateAnnotations = function (e) {
        if (!this.$annotations.length)
            return;
        var delta = e.data;
        var range = delta.range;
        var firstRow = range.start.row;
        var len = range.end.row - firstRow;
        if (len === 0) {
        } else if (delta.action == "removeText" || delta.action == "removeLines") {
            this.$annotations.splice(firstRow, len + 1, null);
        } else {
            var args = new Array(len + 1);
            args.unshift(firstRow, 1);
            this.$annotations.splice.apply(this.$annotations, args);
        }
    };

    Gutter.prototype.update = function (config) {
        var session = this.session;
        var firstRow = config.firstRow;
        var lastRow = Math.min(config.lastRow + config.gutterOffset, session.getLength() - 1);
        var fold = session.getNextFoldLine(firstRow);
        var foldStart = fold ? fold.start.row : Infinity;
        var foldWidgets = this.$showFoldWidgets && session.foldWidgets;
        var breakpoints = session.$breakpoints;
        var decorations = session.$decorations;
        var firstLineNumber = session.$firstLineNumber;
        var lastLineNumber = 0;

        var gutterRenderer = session.gutterRenderer || this.$renderer;

        var cell = null;
        var index = -1;
        var row = firstRow;
        while (true) {
            if (row > foldStart) {
                row = fold.end.row + 1;
                fold = session.getNextFoldLine(row, fold);
                foldStart = fold ? fold.start.row : Infinity;
            }
            if (row > lastRow) {
                while (this.$cells.length > index + 1) {
                    cell = this.$cells.pop();
                    this.element.removeChild(cell.element);
                }
                break;
            }

            cell = this.$cells[++index];
            if (!cell) {
                cell = { element: null, textNode: null, foldWidget: null };
                cell.element = dom.createElement("div");
                cell.textNode = document.createTextNode('');
                cell.element.appendChild(cell.textNode);
                this.element.appendChild(cell.element);
                this.$cells[index] = cell;
            }

            var className = "ace_gutter-cell ";
            if (breakpoints[row])
                className += breakpoints[row];
            if (decorations[row])
                className += decorations[row];
            if (this.$annotations[row])
                className += this.$annotations[row].className;
            if (cell.element.className != className)
                cell.element.className = className;

            var height = session.getRowLength(row) * config.lineHeight + "px";
            if (height != cell.element.style.height)
                cell.element.style.height = height;

            if (foldWidgets) {
                var c = foldWidgets[row];
                if (c == null)
                    c = foldWidgets[row] = session.getFoldWidget(row);
            }

            if (c) {
                if (!cell.foldWidget) {
                    cell.foldWidget = dom.createElement("span");
                    cell.element.appendChild(cell.foldWidget);
                }
                var className = "ace_fold-widget ace_" + c;
                if (c == "start" && row == foldStart && row < fold.end.row)
                    className += " ace_closed";
                else
                    className += " ace_open";
                if (cell.foldWidget.className != className)
                    cell.foldWidget.className = className;

                var height = config.lineHeight + "px";
                if (cell.foldWidget.style.height != height)
                    cell.foldWidget.style.height = height;
            } else {
                if (cell.foldWidget) {
                    cell.element.removeChild(cell.foldWidget);
                    cell.foldWidget = null;
                }
            }

            var text = lastLineNumber = gutterRenderer ? gutterRenderer.getText(session, row) : row + firstLineNumber;
            if (text != cell.textNode.data)
                cell.textNode.data = text;

            row++;
        }

        this.element.style.height = config.minHeight + "px";

        if (this.$fixedWidth || session.$useWrapMode)
            lastLineNumber = session.getLength() + firstLineNumber;

        var gutterWidth = gutterRenderer ? gutterRenderer.getWidth(session, lastLineNumber, config) : lastLineNumber.toString().length * config.characterWidth;

        var padding = this.$padding || this.$computePadding();
        gutterWidth += padding.left + padding.right;
        if (gutterWidth !== this.gutterWidth && !isNaN(gutterWidth)) {
            this.gutterWidth = gutterWidth;
            this.element.style.width = Math.ceil(this.gutterWidth) + "px";
            this._emit("changeGutterWidth", gutterWidth);
        }
    };

    Gutter.prototype.setShowLineNumbers = function (show) {
        this.$renderer = !show && {
            getWidth: function () {
                return "";
            },
            getText: function () {
                return "";
            }
        };
    };

    Gutter.prototype.getShowLineNumbers = function () {
        return this.$showLineNumbers;
    };

    Gutter.prototype.setShowFoldWidgets = function (show) {
        if (show)
            dom.addCssClass(this.element, "ace_folding-enabled");
        else
            dom.removeCssClass(this.element, "ace_folding-enabled");

        this.$showFoldWidgets = show;
        this.$padding = null;
    };

    Gutter.prototype.getShowFoldWidgets = function () {
        return this.$showFoldWidgets;
    };

    Gutter.prototype.$computePadding = function () {
        if (!this.element.firstChild)
            return { left: 0, right: 0 };
        var style = dom.computedStyle(this.element.firstChild);
        this.$padding = {};
        this.$padding.left = parseInt(style.paddingLeft) + 1 || 0;
        this.$padding.right = parseInt(style.paddingRight) || 0;
        return this.$padding;
    };

    Gutter.prototype.getRegion = function (point) {
        var padding = this.$padding || this.$computePadding();
        var rect = this.element.getBoundingClientRect();
        if (point.x < padding.left + rect.left)
            return "markers";
        if (this.$showFoldWidgets && point.x > rect.right - padding.right)
            return "foldWidgets";
    };
    return Gutter;
})(evem.EventEmitterClass);
exports.Gutter = Gutter;
});

ace.define("ace/layer/marker",["require","exports","module","ace/range","ace/lib/dom"], function(require, exports, module) {
"no use strict";
var rng = require("../range");
var dom = require("../lib/dom");

var Marker = (function () {
    function Marker(parentEl) {
        this.$padding = 0;
        this.element = dom.createElement("div");
        this.element.className = "ace_layer ace_marker-layer";
        parentEl.appendChild(this.element);
    }
    Marker.prototype.setPadding = function (padding) {
        this.$padding = padding;
    };

    Marker.prototype.setSession = function (session) {
        this.session = session;
    };

    Marker.prototype.setMarkers = function (markers) {
        this.markers = markers;
    };

    Marker.prototype.update = function (config) {
        var config = config || this.config;
        if (!config)
            return;

        this.config = config;

        var html = [];
        for (var key in this.markers) {
            var marker = this.markers[key];

            if (!marker.range) {
                marker.update(html, this, this.session, config);
                continue;
            }

            var range = marker.range.clipRows(config.firstRow, config.lastRow);
            if (range.isEmpty())
                continue;

            range = range.toScreenRange(this.session);
            if (marker.renderer) {
                var top = this.$getTop(range.start.row, config);
                var left = this.$padding + range.start.column * config.characterWidth;
                marker.renderer(html, range, left, top, config);
            } else if (marker.type == "fullLine") {
                this.drawFullLineMarker(html, range, marker.clazz, config);
            } else if (marker.type == "screenLine") {
                this.drawScreenLineMarker(html, range, marker.clazz, config);
            } else if (range.isMultiLine()) {
                if (marker.type == "text")
                    this.drawTextMarker(html, range, marker.clazz, config);
                else
                    this.drawMultiLineMarker(html, range, marker.clazz, config);
            } else {
                this.drawSingleLineMarker(html, range, marker.clazz + " ace_start ace_br15", config);
            }
        }
        this.element.innerHTML = html.join("");
    };

    Marker.prototype.$getTop = function (row, layerConfig) {
        return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
    };
    Marker.prototype.drawTextMarker = function (stringBuilder, range, clazz, layerConfig, extraStyle) {
        function getBorderClass(tl, tr, br, bl) {
            return (tl ? 1 : 0) | (tr ? 2 : 0) | (br ? 4 : 0) | (bl ? 8 : 0);
        }

        var session = this.session;
        var start = range.start.row;
        var end = range.end.row;
        var row = start;
        var prev = 0;
        var curr = 0;
        var next = session.getScreenLastRowColumn(row);
        var lineRange = new rng.Range(row, range.start.column, row, curr);
        for (; row <= end; row++) {
            lineRange.start.row = lineRange.end.row = row;
            lineRange.start.column = row == start ? range.start.column : session.getRowWrapIndent(row);
            lineRange.end.column = next;
            prev = curr;
            curr = next;
            next = row + 1 < end ? session.getScreenLastRowColumn(row + 1) : row == end ? 0 : range.end.column;
            this.drawSingleLineMarker(stringBuilder, lineRange, clazz + (row == start ? " ace_start" : "") + " ace_br" + getBorderClass(row == start || row == start + 1 && range.start.column, prev < curr, curr > next, row == end), layerConfig, row == end ? 0 : 1, extraStyle);
        }
    };
    Marker.prototype.drawMultiLineMarker = function (stringBuilder, range, clazz, config, extraStyle) {
        var padding = this.$padding;
        var height = config.lineHeight;
        var top = this.$getTop(range.start.row, config);
        var left = padding + range.start.column * config.characterWidth;

        extraStyle = extraStyle || "";

        stringBuilder.push("<div class='", clazz, " ace_br1 ace_start' style='", "height:", height, "px;", "right:0;", "top:", top, "px;", "left:", left, "px;", extraStyle, "'></div>");
        top = this.$getTop(range.end.row, config);
        var width = range.end.column * config.characterWidth;

        stringBuilder.push("<div class='", clazz, " ace_br12' style='", "height:", height, "px;", "width:", width, "px;", "top:", top, "px;", "left:", padding, "px;", extraStyle, "'></div>");
        height = (range.end.row - range.start.row - 1) * config.lineHeight;
        if (height < 0) {
            return;
        }
        top = this.$getTop(range.start.row + 1, config);

        var radiusClass = (range.start.column ? 1 : 0) | (range.end.column ? 0 : 8);

        stringBuilder.push("<div class='", clazz, (radiusClass ? " ace_br" + radiusClass : ""), "' style='", "height:", height, "px;", "right:0;", "top:", top, "px;", "left:", padding, "px;", extraStyle, "'></div>");
    };
    Marker.prototype.drawSingleLineMarker = function (stringBuilder, range, clazz, config, extraLength, extraStyle) {
        var height = config.lineHeight;
        var width = (range.end.column + (extraLength || 0) - range.start.column) * config.characterWidth;

        var top = this.$getTop(range.start.row, config);
        var left = this.$padding + range.start.column * config.characterWidth;

        stringBuilder.push("<div class='", clazz, "' style='", "height:", height, "px;", "width:", width, "px;", "top:", top, "px;", "left:", left, "px;", extraStyle || "", "'></div>");
    };

    Marker.prototype.drawFullLineMarker = function (stringBuilder, range, clazz, config, extraStyle) {
        var top = this.$getTop(range.start.row, config);
        var height = config.lineHeight;
        if (range.start.row != range.end.row) {
            height += this.$getTop(range.end.row, config) - top;
        }

        stringBuilder.push("<div class='", clazz, "' style='", "height:", height, "px;", "top:", top, "px;", "left:0;right:0;", extraStyle || "", "'></div>");
    };

    Marker.prototype.drawScreenLineMarker = function (stringBuilder, range, clazz, config, extraStyle) {
        var top = this.$getTop(range.start.row, config);
        var height = config.lineHeight;

        stringBuilder.push("<div class='", clazz, "' style='", "height:", height, "px;", "top:", top, "px;", "left:0;right:0;", extraStyle || "", "'></div>");
    };
    return Marker;
})();
exports.Marker = Marker;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/layer/text",["require","exports","module","ace/lib/dom","ace/lib/lang","ace/lib/event_emitter"], function(require, exports, module) {
"no use strict";
var dom = require("../lib/dom");
var lang = require("../lib/lang");

var eve = require("../lib/event_emitter");

var Text = (function (_super) {
    __extends(Text, _super);
    function Text(parentEl) {
        _super.call(this);
        this.element = dom.createElement("div");
        this.$padding = 0;
        this.EOF_CHAR = "\xB6";
        this.EOL_CHAR_LF = "\xAC";
        this.EOL_CHAR_CRLF = "\xa4";
        this.TAB_CHAR = "\u2192";
        this.SPACE_CHAR = "\xB7";
        this.showInvisibles = false;
        this.displayIndentGuides = true;
        this.$tabStrings = [];
        this.$textToken = { "text": true, "rparen": true, "lparen": true };
        this.element.className = "ace_layer ace_text-layer";
        parentEl.appendChild(this.element);
        this.$updateEolChar = this.$updateEolChar.bind(this);
        this.EOL_CHAR = this.EOL_CHAR_LF;
    }
    Text.prototype.$updateEolChar = function () {
        var EOL_CHAR = this.session.doc.getNewLineCharacter() == "\n" ? this.EOL_CHAR_LF : this.EOL_CHAR_CRLF;
        if (this.EOL_CHAR != EOL_CHAR) {
            this.EOL_CHAR = EOL_CHAR;
            return true;
        }
    };

    Text.prototype.setPadding = function (padding) {
        this.$padding = padding;
        this.element.style.padding = "0 " + padding + "px";
    };

    Text.prototype.getLineHeight = function () {
        return this.$fontMetrics.$characterSize.height || 0;
    };

    Text.prototype.getCharacterWidth = function () {
        return this.$fontMetrics.$characterSize.width || 0;
    };

    Text.prototype.$setFontMetrics = function (measure) {
        this.$fontMetrics = measure;
        this.$fontMetrics.on("changeCharacterSize", function (e) {
            this._signal("changeCharacterSize", e);
        }.bind(this));
        this.$pollSizeChanges();
    };

    Text.prototype.checkForSizeChanges = function () {
        this.$fontMetrics.checkForSizeChanges();
    };

    Text.prototype.$pollSizeChanges = function () {
        return this.$pollSizeChangesTimer = this.$fontMetrics.$pollSizeChanges();
    };

    Text.prototype.setSession = function (session) {
        this.session = session;
        this.$computeTabString();
    };

    Text.prototype.setShowInvisibles = function (showInvisibles) {
        if (this.showInvisibles == showInvisibles)
            return false;

        this.showInvisibles = showInvisibles;
        this.$computeTabString();
        return true;
    };

    Text.prototype.setDisplayIndentGuides = function (displayIndentGuides) {
        if (this.displayIndentGuides === displayIndentGuides) {
            return false;
        } else {
            this.displayIndentGuides = displayIndentGuides;
            this.$computeTabString();
            return true;
        }
    };
    Text.prototype.$computeTabString = function () {
        var tabSize = this.session.getTabSize();
        this.tabSize = tabSize;
        var tabStr = this.$tabStrings = ["0"];
        for (var i = 1; i < tabSize + 1; i++) {
            if (this.showInvisibles) {
                tabStr.push("<span class='ace_invisible ace_invisible_tab'>" + this.TAB_CHAR + lang.stringRepeat("\xa0", i - 1) + "</span>");
            } else {
                tabStr.push(lang.stringRepeat("\xa0", i));
            }
        }
        if (this.displayIndentGuides) {
            this.$indentGuideRe = /\s\S| \t|\t |\s$/;
            var className = "ace_indent-guide";
            var spaceClass = "";
            var tabClass = "";
            if (this.showInvisibles) {
                className += " ace_invisible";
                spaceClass = " ace_invisible_space";
                tabClass = " ace_invisible_tab";
                var spaceContent = lang.stringRepeat(this.SPACE_CHAR, this.tabSize);
                var tabContent = this.TAB_CHAR + lang.stringRepeat("\xa0", this.tabSize - 1);
            } else {
                var spaceContent = lang.stringRepeat("\xa0", this.tabSize);
                var tabContent = spaceContent;
            }

            this.$tabStrings[" "] = "<span class='" + className + spaceClass + "'>" + spaceContent + "</span>";
            this.$tabStrings["\t"] = "<span class='" + className + tabClass + "'>" + tabContent + "</span>";
        }
    };

    Text.prototype.updateLines = function (config, firstRow, lastRow) {
        if (this.config.lastRow != config.lastRow || this.config.firstRow != config.firstRow) {
            this.scrollLines(config);
        }
        this.config = config;

        var first = Math.max(firstRow, config.firstRow);
        var last = Math.min(lastRow, config.lastRow);

        var lineElements = this.element.childNodes;
        var lineElementsIdx = 0;

        for (var row = config.firstRow; row < first; row++) {
            var foldLine = this.session.getFoldLine(row);
            if (foldLine) {
                if (foldLine.containsRow(first)) {
                    first = foldLine.start.row;
                    break;
                } else {
                    row = foldLine.end.row;
                }
            }
            lineElementsIdx++;
        }

        var row = first;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row + 1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            }
            if (row > last)
                break;

            var lineElement = lineElements[lineElementsIdx++];
            if (lineElement) {
                var html = [];
                this.$renderLine(html, row, !this.$useLineGroups(), row == foldStart ? foldLine : false);
                lineElement.style.height = config.lineHeight * this.session.getRowLength(row) + "px";
                lineElement.innerHTML = html.join("");
            }
            row++;
        }
    };

    Text.prototype.scrollLines = function (config) {
        var oldConfig = this.config;
        this.config = config;

        if (!oldConfig || oldConfig.lastRow < config.firstRow)
            return this.update(config);

        if (config.lastRow < oldConfig.firstRow)
            return this.update(config);

        var el = this.element;
        if (oldConfig.firstRow < config.firstRow)
            for (var row = this.session.getFoldedRowCount(oldConfig.firstRow, config.firstRow - 1); row > 0; row--)
                el.removeChild(el.firstChild);

        if (oldConfig.lastRow > config.lastRow)
            for (var row = this.session.getFoldedRowCount(config.lastRow + 1, oldConfig.lastRow); row > 0; row--)
                el.removeChild(el.lastChild);

        if (config.firstRow < oldConfig.firstRow) {
            var fragment = this.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1);
            if (el.firstChild)
                el.insertBefore(fragment, el.firstChild);
            else
                el.appendChild(fragment);
        }

        if (config.lastRow > oldConfig.lastRow) {
            var fragment = this.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow);
            el.appendChild(fragment);
        }
    };

    Text.prototype.$renderLinesFragment = function (config, firstRow, lastRow) {
        var fragment = this.element.ownerDocument.createDocumentFragment();
        var row = firstRow;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row + 1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            }
            if (row > lastRow)
                break;

            var container = dom.createElement("div");

            var html = [];
            this.$renderLine(html, row, false, row == foldStart ? foldLine : false);
            container.innerHTML = html.join("");
            if (this.$useLineGroups()) {
                container.className = 'ace_line_group';
                fragment.appendChild(container);
                container.style.height = config.lineHeight * this.session.getRowLength(row) + "px";
            } else {
                while (container.firstChild)
                    fragment.appendChild(container.firstChild);
            }

            row++;
        }
        return fragment;
    };

    Text.prototype.update = function (config) {
        this.config = config;

        var html = [];
        var firstRow = config.firstRow, lastRow = config.lastRow;

        var row = firstRow;
        var foldLine = this.session.getNextFoldLine(row);
        var foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                row = foldLine.end.row + 1;
                foldLine = this.session.getNextFoldLine(row, foldLine);
                foldStart = foldLine ? foldLine.start.row : Infinity;
            }
            if (row > lastRow)
                break;

            if (this.$useLineGroups())
                html.push("<div class='ace_line_group' style='height:", config.lineHeight * this.session.getRowLength(row), "px'>");

            this.$renderLine(html, row, false, row == foldStart ? foldLine : false);

            if (this.$useLineGroups())
                html.push("</div>"); // end the line group

            row++;
        }
        this.element.innerHTML = html.join("");
    };

    Text.prototype.$renderToken = function (stringBuilder, screenColumn, token, value) {
        var self = this;
        var replaceReg = /\t|&|<|( +)|([\x00-\x1f\x80-\xa0\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\u3000\uFEFF])|[\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]/g;
        var replaceFunc = function (c, a, b, tabIdx, idx4) {
            if (a) {
                return self.showInvisibles ? "<span class='ace_invisible ace_invisible_space'>" + lang.stringRepeat(self.SPACE_CHAR, c.length) + "</span>" : lang.stringRepeat("\xa0", c.length);
            } else if (c == "&") {
                return "&#38;";
            } else if (c == "<") {
                return "&#60;";
            } else if (c == "\t") {
                var tabSize = self.session.getScreenTabSize(screenColumn + tabIdx);
                screenColumn += tabSize - 1;
                return self.$tabStrings[tabSize];
            } else if (c == "\u3000") {
                var classToUse = self.showInvisibles ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                var space = self.showInvisibles ? self.SPACE_CHAR : "";
                screenColumn += 1;
                return "<span class='" + classToUse + "' style='width:" + (self.config.characterWidth * 2) + "px'>" + space + "</span>";
            } else if (b) {
                return "<span class='ace_invisible ace_invisible_space ace_invalid'>" + self.SPACE_CHAR + "</span>";
            } else {
                screenColumn += 1;
                return "<span class='ace_cjk' style='width:" + (self.config.characterWidth * 2) + "px'>" + c + "</span>";
            }
        };

        var output = value.replace(replaceReg, replaceFunc);

        if (!this.$textToken[token.type]) {
            var classes = "ace_" + token.type.replace(/\./g, " ace_");
            var style = "";
            if (token.type == "fold")
                style = " style='width:" + (token.value.length * this.config.characterWidth) + "px;' ";
            stringBuilder.push("<span class='", classes, "'", style, ">", output, "</span>");
        } else {
            stringBuilder.push(output);
        }
        return screenColumn + value.length;
    };

    Text.prototype.renderIndentGuide = function (stringBuilder, value, max) {
        var cols = value.search(this.$indentGuideRe);
        if (cols <= 0 || cols >= max)
            return value;
        if (value[0] == " ") {
            cols -= cols % this.tabSize;
            stringBuilder.push(lang.stringRepeat(this.$tabStrings[" "], cols / this.tabSize));
            return value.substr(cols);
        } else if (value[0] == "\t") {
            stringBuilder.push(lang.stringRepeat(this.$tabStrings["\t"], cols));
            return value.substr(cols);
        }
        return value;
    };

    Text.prototype.$renderWrappedLine = function (stringBuilder, tokens, splits, onlyContents) {
        var chars = 0;
        var split = 0;
        var splitChars = splits[0];
        var screenColumn = 0;

        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var value = token.value;
            if (i == 0 && this.displayIndentGuides) {
                chars = value.length;
                value = this.renderIndentGuide(stringBuilder, value, splitChars);
                if (!value)
                    continue;
                chars -= value.length;
            }

            if (chars + value.length < splitChars) {
                screenColumn = this.$renderToken(stringBuilder, screenColumn, token, value);
                chars += value.length;
            } else {
                while (chars + value.length >= splitChars) {
                    screenColumn = this.$renderToken(stringBuilder, screenColumn, token, value.substring(0, splitChars - chars));
                    value = value.substring(splitChars - chars);
                    chars = splitChars;

                    if (!onlyContents) {
                        stringBuilder.push("</div>", "<div class='ace_line' style='height:", this.config.lineHeight, "px'>");
                    }

                    split++;
                    screenColumn = 0;
                    splitChars = splits[split] || Number.MAX_VALUE;
                }
                if (value.length != 0) {
                    chars += value.length;
                    screenColumn = this.$renderToken(stringBuilder, screenColumn, token, value);
                }
            }
        }
    };

    Text.prototype.$renderSimpleLine = function (stringBuilder, tokens) {
        var screenColumn = 0;
        var token = tokens[0];
        var value = token.value;
        if (this.displayIndentGuides)
            value = this.renderIndentGuide(stringBuilder, value);
        if (value)
            screenColumn = this.$renderToken(stringBuilder, screenColumn, token, value);
        for (var i = 1; i < tokens.length; i++) {
            token = tokens[i];
            value = token.value;
            screenColumn = this.$renderToken(stringBuilder, screenColumn, token, value);
        }
    };
    Text.prototype.$renderLine = function (stringBuilder, row, onlyContents, foldLine) {
        if (!foldLine && foldLine != false)
            foldLine = this.session.getFoldLine(row);

        if (foldLine)
            var tokens = this.$getFoldLineTokens(row, foldLine);
        else
            var tokens = this.session.getTokens(row);

        if (!onlyContents) {
            stringBuilder.push("<div class='ace_line' style='height:", this.config.lineHeight * (this.$useLineGroups() ? 1 : this.session.getRowLength(row)), "px'>");
        }

        if (tokens.length) {
            var splits = this.session.getRowSplitData(row);
            if (splits && splits.length)
                this.$renderWrappedLine(stringBuilder, tokens, splits, onlyContents);
            else
                this.$renderSimpleLine(stringBuilder, tokens);
        }

        if (this.showInvisibles) {
            if (foldLine)
                row = foldLine.end.row;

            stringBuilder.push("<span class='ace_invisible ace_invisible_eol'>", row == this.session.getLength() - 1 ? this.EOF_CHAR : this.EOL_CHAR, "</span>");
        }
        if (!onlyContents)
            stringBuilder.push("</div>");
    };

    Text.prototype.$getFoldLineTokens = function (row, foldLine) {
        var session = this.session;
        var renderTokens = [];

        function addTokens(tokens, from, to) {
            var idx = 0, col = 0;
            while ((col + tokens[idx].value.length) < from) {
                col += tokens[idx].value.length;
                idx++;

                if (idx == tokens.length)
                    return;
            }
            if (col != from) {
                var value = tokens[idx].value.substring(from - col);
                if (value.length > (to - from))
                    value = value.substring(0, to - from);

                renderTokens.push({
                    type: tokens[idx].type,
                    value: value
                });

                col = from + value.length;
                idx += 1;
            }

            while (col < to && idx < tokens.length) {
                var value = tokens[idx].value;
                if (value.length + col > to) {
                    renderTokens.push({
                        type: tokens[idx].type,
                        value: value.substring(0, to - col)
                    });
                } else
                    renderTokens.push(tokens[idx]);
                col += value.length;
                idx += 1;
            }
        }

        var tokens = session.getTokens(row);
        foldLine.walk(function (placeholder, row, column, lastColumn, isNewRow) {
            if (placeholder != null) {
                renderTokens.push({
                    type: "fold",
                    value: placeholder
                });
            } else {
                if (isNewRow)
                    tokens = session.getTokens(row);

                if (tokens.length)
                    addTokens(tokens, lastColumn, column);
            }
        }, foldLine.end.row, this.session.getLine(foldLine.end.row).length);

        return renderTokens;
    };

    Text.prototype.$useLineGroups = function () {
        return this.session.getUseWrapMode();
    };

    Text.prototype.destroy = function () {
        clearInterval(this.$pollSizeChangesTimer);
        if (this.$measureNode)
            this.$measureNode.parentNode.removeChild(this.$measureNode);
        delete this.$measureNode;
    };
    return Text;
})(eve.EventEmitterClass);
exports.Text = Text;
});

ace.define("ace/layer/cursor",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"no use strict";
var dom = require("../lib/dom");

var IE8;

var Cursor = (function () {
    function Cursor(parentEl) {
        this.isVisible = false;
        this.isBlinking = true;
        this.blinkInterval = 1000;
        this.smoothBlinking = false;
        this.cursors = [];
        this.$padding = 0;
        this.element = dom.createElement("div");
        this.element.className = "ace_layer ace_cursor-layer";
        parentEl.appendChild(this.element);

        if (IE8 === undefined)
            IE8 = "opacity" in this.element;

        this.cursor = this.addCursor();
        dom.addCssClass(this.element, "ace_hidden-cursors");
        this.$updateCursors = this.$updateVisibility.bind(this);
    }
    Cursor.prototype.$updateVisibility = function (val) {
        var cursors = this.cursors;
        for (var i = cursors.length; i--;)
            cursors[i].style.visibility = val ? "" : "hidden";
    };

    Cursor.prototype.$updateOpacity = function (val) {
        var cursors = this.cursors;
        for (var i = cursors.length; i--;)
            cursors[i].style.opacity = val ? "" : "0";
    };

    Cursor.prototype.setPadding = function (padding) {
        this.$padding = padding;
    };

    Cursor.prototype.setSession = function (session) {
        this.session = session;
    };

    Cursor.prototype.setBlinking = function (blinking) {
        if (blinking != this.isBlinking) {
            this.isBlinking = blinking;
            this.restartTimer();
        }
    };

    Cursor.prototype.setBlinkInterval = function (blinkInterval) {
        if (blinkInterval != this.blinkInterval) {
            this.blinkInterval = blinkInterval;
            this.restartTimer();
        }
    };

    Cursor.prototype.setSmoothBlinking = function (smoothBlinking) {
        if (smoothBlinking != this.smoothBlinking && !IE8) {
            this.smoothBlinking = smoothBlinking;
            dom.setCssClass(this.element, "ace_smooth-blinking", smoothBlinking);
            this.$updateCursors(true);
            this.$updateCursors = (smoothBlinking ? this.$updateOpacity : this.$updateVisibility).bind(this);
            this.restartTimer();
        }
    };

    Cursor.prototype.addCursor = function () {
        var el = dom.createElement("div");
        el.className = "ace_cursor";
        this.element.appendChild(el);
        this.cursors.push(el);
        return el;
    };

    Cursor.prototype.removeCursor = function () {
        if (this.cursors.length > 1) {
            var el = this.cursors.pop();
            el.parentNode.removeChild(el);
            return el;
        }
    };

    Cursor.prototype.hideCursor = function () {
        this.isVisible = false;
        dom.addCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    };

    Cursor.prototype.showCursor = function () {
        this.isVisible = true;
        dom.removeCssClass(this.element, "ace_hidden-cursors");
        this.restartTimer();
    };

    Cursor.prototype.restartTimer = function () {
        var update = this.$updateCursors;
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
        if (this.smoothBlinking) {
            dom.removeCssClass(this.element, "ace_smooth-blinking");
        }

        update(true);

        if (!this.isBlinking || !this.blinkInterval || !this.isVisible)
            return;

        if (this.smoothBlinking) {
            setTimeout(function () {
                dom.addCssClass(this.element, "ace_smooth-blinking");
            }.bind(this));
        }

        var blink = function () {
            this.timeoutId = setTimeout(function () {
                update(false);
            }, 0.6 * this.blinkInterval);
        }.bind(this);

        this.intervalId = setInterval(function () {
            update(true);
            blink();
        }, this.blinkInterval);

        blink();
    };

    Cursor.prototype.getPixelPosition = function (position, onScreen) {
        if (!this.config || !this.session)
            return { left: 0, top: 0 };

        if (!position) {
            position = this.session.selection.getCursor();
        }
        var pos = this.session.documentToScreenPosition(position.row, position.column);
        var cursorLeft = this.$padding + pos.column * this.config.characterWidth;
        var cursorTop = (pos.row - (onScreen ? this.config.firstRowScreen : 0)) * this.config.lineHeight;

        return { left: cursorLeft, top: cursorTop };
    };

    Cursor.prototype.update = function (config) {
        this.config = config;
        var selections = this.session['$selectionMarkers'];
        var i = 0, cursorIndex = 0;

        if (selections === undefined || selections.length === 0) {
            selections = [{ cursor: null }];
        }

        for (var i = 0, n = selections.length; i < n; i++) {
            var pixelPos = this.getPixelPosition(selections[i].cursor, true);
            if ((pixelPos.top > config.height + config.offset || pixelPos.top < 0) && i > 1) {
                continue;
            }

            var style = (this.cursors[cursorIndex++] || this.addCursor()).style;

            style.left = pixelPos.left + "px";
            style.top = pixelPos.top + "px";
            style.width = config.characterWidth + "px";
            style.height = config.lineHeight + "px";
        }
        while (this.cursors.length > cursorIndex)
            this.removeCursor();

        var overwrite = this.session.getOverwrite();
        this.$setOverwrite(overwrite);
        this.$pixelPos = pixelPos;
        this.restartTimer();
    };

    Cursor.prototype.$setOverwrite = function (overwrite) {
        if (overwrite != this.overwrite) {
            this.overwrite = overwrite;
            if (overwrite)
                dom.addCssClass(this.element, "ace_overwrite-cursors");
            else
                dom.removeCssClass(this.element, "ace_overwrite-cursors");
        }
    };

    Cursor.prototype.destroy = function () {
        clearInterval(this.intervalId);
        clearTimeout(this.timeoutId);
    };
    return Cursor;
})();
exports.Cursor = Cursor;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/scrollbar",["require","exports","module","ace/lib/dom","ace/lib/event","ace/lib/event_emitter"], function(require, exports, module) {
"no use strict";
var dom = require("./lib/dom");
var event = require("./lib/event");
var eem = require("./lib/event_emitter");
var ScrollBar = (function (_super) {
    __extends(ScrollBar, _super);
    function ScrollBar(parent, classSuffix) {
        _super.call(this);
        this.element = dom.createElement("div");
        this.element.className = "ace_scrollbar ace_scrollbar" + classSuffix;

        this.inner = dom.createElement("div");
        this.inner.className = "ace_scrollbar-inner";
        this.element.appendChild(this.inner);

        parent.appendChild(this.element);

        this.setVisible(false);
        this.skipEvent = false;

        event.addListener(this.element, "mousedown", event.preventDefault);
    }
    ScrollBar.prototype.setVisible = function (isVisible) {
        this.element.style.display = isVisible ? "" : "none";
        this.isVisible = isVisible;
    };
    return ScrollBar;
})(eem.EventEmitterClass);
exports.ScrollBar = ScrollBar;
var VScrollBar = (function (_super) {
    __extends(VScrollBar, _super);
    function VScrollBar(parent, renderer) {
        _super.call(this, parent, '-v');
        this._scrollTop = 0;
        renderer.$scrollbarWidth = this._width = dom.scrollbarWidth(parent.ownerDocument);
        this.inner.style.width = this.element.style.width = (this._width || 15) + 5 + "px";
        event.addListener(this.element, "scroll", this.onScroll.bind(this));
    }
    VScrollBar.prototype.onScroll = function () {
        if (!this.skipEvent) {
            this._scrollTop = this.element.scrollTop;
            this._emit("scroll", { data: this._scrollTop });
        }
        this.skipEvent = false;
    };

    Object.defineProperty(VScrollBar.prototype, "width", {
        get: function () {
            return this.isVisible ? this._width : 0;
        },
        enumerable: true,
        configurable: true
    });
    VScrollBar.prototype.setHeight = function (height) {
        this.element.style.height = height + "px";
    };
    VScrollBar.prototype.setInnerHeight = function (height) {
        this.inner.style.height = height + "px";
    };
    VScrollBar.prototype.setScrollHeight = function (height) {
        this.inner.style.height = height + "px";
    };
    VScrollBar.prototype.setScrollTop = function (scrollTop) {
        if (this._scrollTop != scrollTop) {
            this.skipEvent = true;
            this._scrollTop = this.element.scrollTop = scrollTop;
        }
    };

    Object.defineProperty(VScrollBar.prototype, "scrollTop", {
        get: function () {
            return this._scrollTop;
        },
        enumerable: true,
        configurable: true
    });
    return VScrollBar;
})(ScrollBar);
exports.VScrollBar = VScrollBar;
var HScrollBar = (function (_super) {
    __extends(HScrollBar, _super);
    function HScrollBar(parent, renderer) {
        _super.call(this, parent, '-h');
        this._scrollLeft = 0;
        this._height = renderer.$scrollbarWidth;
        this.inner.style.height = this.element.style.height = (this._height || 15) + 5 + "px";
        event.addListener(this.element, "scroll", this.onScroll.bind(this));
    }
    HScrollBar.prototype.onScroll = function () {
        if (!this.skipEvent) {
            this._scrollLeft = this.element.scrollLeft;
            this._emit("scroll", { data: this._scrollLeft });
        }
        this.skipEvent = false;
    };

    Object.defineProperty(HScrollBar.prototype, "height", {
        get: function () {
            return this.isVisible ? this._height : 0;
        },
        enumerable: true,
        configurable: true
    });
    HScrollBar.prototype.setWidth = function (width) {
        this.element.style.width = width + "px";
    };
    HScrollBar.prototype.setInnerWidth = function (width) {
        this.inner.style.width = width + "px";
    };
    HScrollBar.prototype.setScrollWidth = function (width) {
        this.inner.style.width = width + "px";
    };
    HScrollBar.prototype.setScrollLeft = function (scrollLeft) {
        if (this._scrollLeft != scrollLeft) {
            this.skipEvent = true;
            this._scrollLeft = this.element.scrollLeft = scrollLeft;
        }
    };
    return HScrollBar;
})(ScrollBar);
exports.HScrollBar = HScrollBar;
});

ace.define("ace/renderloop",["require","exports","module","ace/lib/event"], function(require, exports, module) {
"no use strict";
var event = require("./lib/event");
var RenderLoop = (function () {
    function RenderLoop(onRender, $window) {
        this.pending = false;
        this.changes = 0;
        this.onRender = onRender;
        this.$window = $window || window;
    }
    RenderLoop.prototype.schedule = function (change) {
        this.changes = this.changes | change;
        if (!this.pending && this.changes) {
            this.pending = true;
            var _self = this;
            event.requestAnimationFrame(function () {
                _self.pending = false;
                var changes;
                while (changes = _self.changes) {
                    _self.changes = 0;
                    _self.onRender(changes);
                }
            }, this.$window);
        }
    };
    return RenderLoop;
})();
exports.RenderLoop = RenderLoop;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/layer/font_metrics",["require","exports","module","ace/lib/dom","ace/lib/lang","ace/lib/useragent","ace/lib/event_emitter"], function(require, exports, module) {
"no use strict";
var dom = require("../lib/dom");
var lang = require("../lib/lang");
var useragent = require("../lib/useragent");
var eve = require("../lib/event_emitter");

var CHAR_COUNT = 0;

var FontMetrics = (function (_super) {
    __extends(FontMetrics, _super);
    function FontMetrics(parentEl, interval) {
        _super.call(this);
        this.$characterSize = { width: 0, height: 0 };
        this.el = dom.createElement("div");
        this.$setMeasureNodeStyles(this.el.style, true);

        this.$main = dom.createElement("div");
        this.$setMeasureNodeStyles(this.$main.style);

        this.$measureNode = dom.createElement("div");
        this.$setMeasureNodeStyles(this.$measureNode.style);

        this.el.appendChild(this.$main);
        this.el.appendChild(this.$measureNode);
        parentEl.appendChild(this.el);

        if (!CHAR_COUNT)
            this.$testFractionalRect();
        this.$measureNode.innerHTML = lang.stringRepeat("X", CHAR_COUNT);

        this.$characterSize = { width: 0, height: 0 };
        this.checkForSizeChanges();
    }
    FontMetrics.prototype.$testFractionalRect = function () {
        var el = dom.createElement("div");
        this.$setMeasureNodeStyles(el.style);
        el.style.width = "0.2px";
        document.documentElement.appendChild(el);
        var w = el.getBoundingClientRect().width;
        if (w > 0 && w < 1)
            CHAR_COUNT = 1;
        else
            CHAR_COUNT = 100;
        el.parentNode.removeChild(el);
    };

    FontMetrics.prototype.$setMeasureNodeStyles = function (style, isRoot) {
        style.width = style.height = "auto";
        style.left = style.top = "-100px";
        style.visibility = "hidden";
        style.position = "fixed";
        style.whiteSpace = "pre";

        if (useragent.isIE < 8) {
            style["font-family"] = "inherit";
        } else {
            style.font = "inherit";
        }
        style.overflow = isRoot ? "hidden" : "visible";
    };

    FontMetrics.prototype.checkForSizeChanges = function () {
        var size = this.$measureSizes();
        if (size && (this.$characterSize.width !== size.width || this.$characterSize.height !== size.height)) {
            this.$measureNode.style.fontWeight = "bold";
            var boldSize = this.$measureSizes();
            this.$measureNode.style.fontWeight = "";
            this.$characterSize = size;
            this.charSizes = Object.create(null);
            this.allowBoldFonts = boldSize && boldSize.width === size.width && boldSize.height === size.height;
            this._emit("changeCharacterSize", { data: size });
        }
    };

    FontMetrics.prototype.$pollSizeChanges = function () {
        if (this.$pollSizeChangesTimer)
            return this.$pollSizeChangesTimer;
        var self = this;
        return this.$pollSizeChangesTimer = setInterval(function () {
            self.checkForSizeChanges();
        }, 500);
    };

    FontMetrics.prototype.setPolling = function (val) {
        if (val) {
            this.$pollSizeChanges();
        } else {
            if (this.$pollSizeChangesTimer)
                this.$pollSizeChangesTimer;
        }
    };

    FontMetrics.prototype.$measureSizes = function () {
        if (CHAR_COUNT === 1) {
            var rect = null;
            try  {
                rect = this.$measureNode.getBoundingClientRect();
            } catch (e) {
                rect = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 };
            }
            var size = {
                height: rect.height,
                width: rect.width
            };
        } else {
            var size = {
                height: this.$measureNode.clientHeight,
                width: this.$measureNode.clientWidth / CHAR_COUNT
            };
        }
        if (size.width === 0 || size.height === 0)
            return null;
        return size;
    };

    FontMetrics.prototype.$measureCharWidth = function (ch) {
        this.$main.innerHTML = lang.stringRepeat(ch, CHAR_COUNT);
        var rect = this.$main.getBoundingClientRect();
        return rect.width / CHAR_COUNT;
    };

    FontMetrics.prototype.getCharacterWidth = function (ch) {
        var w = this.charSizes[ch];
        if (w === undefined) {
            this.charSizes[ch] = this.$measureCharWidth(ch) / this.$characterSize.width;
        }
        return w;
    };

    FontMetrics.prototype.destroy = function () {
        clearInterval(this.$pollSizeChangesTimer);
        if (this.el && this.el.parentNode)
            this.el.parentNode.removeChild(this.el);
    };
    return FontMetrics;
})(eve.EventEmitterClass);
exports.FontMetrics = FontMetrics;
});

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
ace.define("ace/virtual_renderer",["require","exports","module","ace/lib/dom","ace/config","ace/lib/useragent","ace/layer/gutter","ace/layer/marker","ace/layer/text","ace/layer/cursor","ace/scrollbar","ace/renderloop","ace/layer/font_metrics","ace/lib/event_emitter"], function(require, exports, module) {
"no use strict";
var dom = require("./lib/dom");
var config = require("./config");
var useragent = require("./lib/useragent");
var gum = require("./layer/gutter");
var mam = require("./layer/marker");
var txm = require("./layer/text");
var csm = require("./layer/cursor");
var scrollbar = require("./scrollbar");
var rlm = require("./renderloop");
var fmm = require("./layer/font_metrics");
var eve = require("./lib/event_emitter");

var editorCss = ".ace_editor {\
position: relative;\
overflow: hidden;\
font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;\
direction: ltr;\
}\
.ace_scroller {\
position: absolute;\
overflow: hidden;\
top: 0;\
bottom: 0;\
background-color: inherit;\
-ms-user-select: none;\
-moz-user-select: none;\
-webkit-user-select: none;\
user-select: none;\
cursor: text;\
}\
.ace_content {\
position: absolute;\
-moz-box-sizing: border-box;\
-webkit-box-sizing: border-box;\
box-sizing: border-box;\
min-width: 100%;\
}\
.ace_dragging .ace_scroller:before{\
position: absolute;\
top: 0;\
left: 0;\
right: 0;\
bottom: 0;\
content: '';\
background: rgba(250, 250, 250, 0.01);\
z-index: 1000;\
}\
.ace_dragging.ace_dark .ace_scroller:before{\
background: rgba(0, 0, 0, 0.01);\
}\
.ace_selecting, .ace_selecting * {\
cursor: text !important;\
}\
.ace_gutter {\
position: absolute;\
overflow : hidden;\
width: auto;\
top: 0;\
bottom: 0;\
left: 0;\
cursor: default;\
z-index: 4;\
-ms-user-select: none;\
-moz-user-select: none;\
-webkit-user-select: none;\
user-select: none;\
}\
.ace_gutter-active-line {\
position: absolute;\
left: 0;\
right: 0;\
}\
.ace_scroller.ace_scroll-left {\
box-shadow: 17px 0 16px -16px rgba(0, 0, 0, 0.4) inset;\
}\
.ace_gutter-cell {\
padding-left: 19px;\
padding-right: 6px;\
background-repeat: no-repeat;\
}\
.ace_gutter-cell.ace_error {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABOFBMVEX/////////QRswFAb/Ui4wFAYwFAYwFAaWGAfDRymzOSH/PxswFAb/SiUwFAYwFAbUPRvjQiDllog5HhHdRybsTi3/Tyv9Tir+Syj/UC3////XurebMBIwFAb/RSHbPx/gUzfdwL3kzMivKBAwFAbbvbnhPx66NhowFAYwFAaZJg8wFAaxKBDZurf/RB6mMxb/SCMwFAYwFAbxQB3+RB4wFAb/Qhy4Oh+4QifbNRcwFAYwFAYwFAb/QRzdNhgwFAYwFAbav7v/Uy7oaE68MBK5LxLewr/r2NXewLswFAaxJw4wFAbkPRy2PyYwFAaxKhLm1tMwFAazPiQwFAaUGAb/QBrfOx3bvrv/VC/maE4wFAbRPBq6MRO8Qynew8Dp2tjfwb0wFAbx6eju5+by6uns4uH9/f36+vr/GkHjAAAAYnRSTlMAGt+64rnWu/bo8eAA4InH3+DwoN7j4eLi4xP99Nfg4+b+/u9B/eDs1MD1mO7+4PHg2MXa347g7vDizMLN4eG+Pv7i5evs/v79yu7S3/DV7/498Yv24eH+4ufQ3Ozu/v7+y13sRqwAAADLSURBVHjaZc/XDsFgGIBhtDrshlitmk2IrbHFqL2pvXf/+78DPokj7+Fz9qpU/9UXJIlhmPaTaQ6QPaz0mm+5gwkgovcV6GZzd5JtCQwgsxoHOvJO15kleRLAnMgHFIESUEPmawB9ngmelTtipwwfASilxOLyiV5UVUyVAfbG0cCPHig+GBkzAENHS0AstVF6bacZIOzgLmxsHbt2OecNgJC83JERmePUYq8ARGkJx6XtFsdddBQgZE2nPR6CICZhawjA4Fb/chv+399kfR+MMMDGOQAAAABJRU5ErkJggg==\");\
background-repeat: no-repeat;\
background-position: 2px center;\
}\
.ace_gutter-cell.ace_warning {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAmVBMVEX///8AAAD///8AAAAAAABPSzb/5sAAAAB/blH/73z/ulkAAAAAAAD85pkAAAAAAAACAgP/vGz/rkDerGbGrV7/pkQICAf////e0IsAAAD/oED/qTvhrnUAAAD/yHD/njcAAADuv2r/nz//oTj/p064oGf/zHAAAAA9Nir/tFIAAAD/tlTiuWf/tkIAAACynXEAAAAAAAAtIRW7zBpBAAAAM3RSTlMAABR1m7RXO8Ln31Z36zT+neXe5OzooRDfn+TZ4p3h2hTf4t3k3ucyrN1K5+Xaks52Sfs9CXgrAAAAjklEQVR42o3PbQ+CIBQFYEwboPhSYgoYunIqqLn6/z8uYdH8Vmdnu9vz4WwXgN/xTPRD2+sgOcZjsge/whXZgUaYYvT8QnuJaUrjrHUQreGczuEafQCO/SJTufTbroWsPgsllVhq3wJEk2jUSzX3CUEDJC84707djRc5MTAQxoLgupWRwW6UB5fS++NV8AbOZgnsC7BpEAAAAABJRU5ErkJggg==\");\
background-position: 2px center;\
}\
.ace_gutter-cell.ace_info {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAJ0Uk5TAAB2k804AAAAPklEQVQY02NgIB68QuO3tiLznjAwpKTgNyDbMegwisCHZUETUZV0ZqOquBpXj2rtnpSJT1AEnnRmL2OgGgAAIKkRQap2htgAAAAASUVORK5CYII=\");\
background-position: 2px center;\
}\
.ace_dark .ace_gutter-cell.ace_info {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUAAAChoaGAgIAqKiq+vr6tra1ZWVmUlJSbm5s8PDxubm56enrdgzg3AAAAAXRSTlMAQObYZgAAAClJREFUeNpjYMAPdsMYHegyJZFQBlsUlMFVCWUYKkAZMxZAGdxlDMQBAG+TBP4B6RyJAAAAAElFTkSuQmCC\");\
}\
.ace_scrollbar {\
position: absolute;\
right: 0;\
bottom: 0;\
z-index: 6;\
}\
.ace_scrollbar-inner {\
position: absolute;\
cursor: text;\
left: 0;\
top: 0;\
}\
.ace_scrollbar-v{\
overflow-x: hidden;\
overflow-y: scroll;\
top: 0;\
}\
.ace_scrollbar-h {\
overflow-x: scroll;\
overflow-y: hidden;\
left: 0;\
}\
.ace_print-margin {\
position: absolute;\
height: 100%;\
}\
.ace_text-input {\
position: absolute;\
z-index: 0;\
width: 0.5em;\
height: 1em;\
opacity: 0;\
background: transparent;\
-moz-appearance: none;\
appearance: none;\
border: none;\
resize: none;\
outline: none;\
overflow: hidden;\
font: inherit;\
padding: 0 1px;\
margin: 0 -1px;\
text-indent: -1em;\
-ms-user-select: text;\
-moz-user-select: text;\
-webkit-user-select: text;\
user-select: text;\
}\
.ace_text-input.ace_composition {\
background: inherit;\
color: inherit;\
z-index: 1000;\
opacity: 1;\
text-indent: 0;\
}\
.ace_layer {\
z-index: 1;\
position: absolute;\
overflow: hidden;\
word-wrap: normal;\
white-space: pre;\
height: 100%;\
width: 100%;\
-moz-box-sizing: border-box;\
-webkit-box-sizing: border-box;\
box-sizing: border-box;\
pointer-events: none;\
}\
.ace_gutter-layer {\
position: relative;\
width: auto;\
text-align: right;\
pointer-events: auto;\
}\
.ace_text-layer {\
font: inherit !important;\
}\
.ace_cjk {\
display: inline-block;\
text-align: center;\
}\
.ace_cursor-layer {\
z-index: 4;\
}\
.ace_cursor {\
z-index: 4;\
position: absolute;\
-moz-box-sizing: border-box;\
-webkit-box-sizing: border-box;\
box-sizing: border-box;\
border-left: 2px solid\
}\
.ace_slim-cursors .ace_cursor {\
border-left-width: 1px;\
}\
.ace_overwrite-cursors .ace_cursor {\
border-left-width: 0;\
border-bottom: 1px solid;\
}\
.ace_hidden-cursors .ace_cursor {\
opacity: 0.2;\
}\
.ace_smooth-blinking .ace_cursor {\
-webkit-transition: opacity 0.18s;\
transition: opacity 0.18s;\
}\
.ace_editor.ace_multiselect .ace_cursor {\
border-left-width: 1px;\
}\
.ace_marker-layer .ace_step, .ace_marker-layer .ace_stack {\
position: absolute;\
z-index: 3;\
}\
.ace_marker-layer .ace_selection {\
position: absolute;\
z-index: 5;\
}\
.ace_marker-layer .ace_bracket {\
position: absolute;\
z-index: 6;\
}\
.ace_marker-layer .ace_active-line {\
position: absolute;\
z-index: 2;\
}\
.ace_marker-layer .ace_selected-word {\
position: absolute;\
z-index: 4;\
-moz-box-sizing: border-box;\
-webkit-box-sizing: border-box;\
box-sizing: border-box;\
}\
.ace_line .ace_fold {\
-moz-box-sizing: border-box;\
-webkit-box-sizing: border-box;\
box-sizing: border-box;\
display: inline-block;\
height: 11px;\
margin-top: -2px;\
vertical-align: middle;\
background-image:\
url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII=\"),\
url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACJJREFUeNpi+P//fxgTAwPDBxDxD078RSX+YeEyDFMCIMAAI3INmXiwf2YAAAAASUVORK5CYII=\");\
background-repeat: no-repeat, repeat-x;\
background-position: center center, top left;\
color: transparent;\
border: 1px solid black;\
border-radius: 2px;\
cursor: pointer;\
pointer-events: auto;\
}\
.ace_dark .ace_fold {\
}\
.ace_fold:hover{\
background-image:\
url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII=\"),\
url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACBJREFUeNpi+P//fz4TAwPDZxDxD5X4i5fLMEwJgAADAEPVDbjNw87ZAAAAAElFTkSuQmCC\");\
}\
.ace_tooltip {\
background-color: #FFF;\
background-image: -webkit-linear-gradient(top, transparent, rgba(0, 0, 0, 0.1));\
background-image: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.1));\
border: 1px solid gray;\
border-radius: 1px;\
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);\
color: black;\
max-width: 100%;\
padding: 3px 4px;\
position: fixed;\
z-index: 999999;\
-moz-box-sizing: border-box;\
-webkit-box-sizing: border-box;\
box-sizing: border-box;\
cursor: default;\
white-space: pre;\
word-wrap: break-word;\
line-height: normal;\
font-style: normal;\
font-weight: normal;\
letter-spacing: normal;\
pointer-events: none;\
}\
.ace_folding-enabled > .ace_gutter-cell {\
padding-right: 13px;\
}\
.ace_fold-widget {\
-moz-box-sizing: border-box;\
-webkit-box-sizing: border-box;\
box-sizing: border-box;\
margin: 0 -12px 0 1px;\
display: none;\
width: 11px;\
vertical-align: top;\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42mWKsQ0AMAzC8ixLlrzQjzmBiEjp0A6WwBCSPgKAXoLkqSot7nN3yMwR7pZ32NzpKkVoDBUxKAAAAABJRU5ErkJggg==\");\
background-repeat: no-repeat;\
background-position: center;\
border-radius: 3px;\
border: 1px solid transparent;\
cursor: pointer;\
}\
.ace_folding-enabled .ace_fold-widget {\
display: inline-block;   \
}\
.ace_fold-widget.ace_end {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42m3HwQkAMAhD0YzsRchFKI7sAikeWkrxwScEB0nh5e7KTPWimZki4tYfVbX+MNl4pyZXejUO1QAAAABJRU5ErkJggg==\");\
}\
.ace_fold-widget.ace_closed {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAGCAYAAAAG5SQMAAAAOUlEQVR42jXKwQkAMAgDwKwqKD4EwQ26sSOkVWjgIIHAzPiCgaqiqnJHZnKICBERHN194O5b9vbLuAVRL+l0YWnZAAAAAElFTkSuQmCCXA==\");\
}\
.ace_fold-widget:hover {\
border: 1px solid rgba(0, 0, 0, 0.3);\
background-color: rgba(255, 255, 255, 0.2);\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);\
}\
.ace_fold-widget:active {\
border: 1px solid rgba(0, 0, 0, 0.4);\
background-color: rgba(0, 0, 0, 0.05);\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);\
}\
.ace_dark .ace_fold-widget {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHklEQVQIW2P4//8/AzoGEQ7oGCaLLAhWiSwB146BAQCSTPYocqT0AAAAAElFTkSuQmCC\");\
}\
.ace_dark .ace_fold-widget.ace_end {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAH0lEQVQIW2P4//8/AxQ7wNjIAjDMgC4AxjCVKBirIAAF0kz2rlhxpAAAAABJRU5ErkJggg==\");\
}\
.ace_dark .ace_fold-widget.ace_closed {\
background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAFCAYAAACAcVaiAAAAHElEQVQIW2P4//+/AxAzgDADlOOAznHAKgPWAwARji8UIDTfQQAAAABJRU5ErkJggg==\");\
}\
.ace_dark .ace_fold-widget:hover {\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);\
background-color: rgba(255, 255, 255, 0.1);\
}\
.ace_dark .ace_fold-widget:active {\
box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);\
}\
.ace_fold-widget.ace_invalid {\
background-color: #FFB4B4;\
border-color: #DE5555;\
}\
.ace_fade-fold-widgets .ace_fold-widget {\
-webkit-transition: opacity 0.4s ease 0.05s;\
transition: opacity 0.4s ease 0.05s;\
opacity: 0;\
}\
.ace_fade-fold-widgets:hover .ace_fold-widget {\
-webkit-transition: opacity 0.05s ease 0.05s;\
transition: opacity 0.05s ease 0.05s;\
opacity:1;\
}\
.ace_underline {\
text-decoration: underline;\
}\
.ace_bold {\
font-weight: bold;\
}\
.ace_nobold .ace_bold {\
font-weight: normal;\
}\
.ace_italic {\
font-style: italic;\
}\
.ace_error-marker {\
background-color: rgba(255, 0, 0,0.2);\
position: absolute;\
z-index: 9;\
}\
.ace_highlight-marker {\
background-color: rgba(255, 255, 0,0.2);\
position: absolute;\
z-index: 8;\
}\
.ace_br1 {border-top-left-radius    : 3px;}\
.ace_br2 {border-top-right-radius   : 3px;}\
.ace_br3 {border-top-left-radius    : 3px; border-top-right-radius:    3px;}\
.ace_br4 {border-bottom-right-radius: 3px;}\
.ace_br5 {border-top-left-radius    : 3px; border-bottom-right-radius: 3px;}\
.ace_br6 {border-top-right-radius   : 3px; border-bottom-right-radius: 3px;}\
.ace_br7 {border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px;}\
.ace_br8 {border-bottom-left-radius : 3px;}\
.ace_br9 {border-top-left-radius    : 3px; border-bottom-left-radius:  3px;}\
.ace_br10{border-top-right-radius   : 3px; border-bottom-left-radius:  3px;}\
.ace_br11{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-left-radius:  3px;}\
.ace_br12{border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}\
.ace_br13{border-top-left-radius    : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}\
.ace_br14{border-top-right-radius   : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}\
.ace_br15{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;}\
";

dom.importCssString(editorCss, "ace_editor");

var CHANGE_CURSOR = 1;
var CHANGE_MARKER = 2;
var CHANGE_GUTTER = 4;
var CHANGE_SCROLL = 8;
var CHANGE_LINES = 16;
var CHANGE_TEXT = 32;
var CHANGE_SIZE = 64;
var CHANGE_MARKER_BACK = 128;
var CHANGE_MARKER_FRONT = 256;
var CHANGE_FULL = 512;
var CHANGE_H_SCROLL = 1024;
var VirtualRenderer = (function (_super) {
    __extends(VirtualRenderer, _super);
    function VirtualRenderer(container, theme) {
        _super.call(this);
        this.scrollLeft = 0;
        this.scrollTop = 0;
        this.layerConfig = {
            width: 1,
            padding: 0,
            firstRow: 0,
            firstRowScreen: 0,
            lastRow: 0,
            lineHeight: 0,
            characterWidth: 0,
            minHeight: 1,
            maxHeight: 1,
            offset: 0,
            height: 1,
            gutterOffset: 1
        };
        this.$padding = 0;
        this.$frozen = false;
        this.STEPS = 8;
        this.scrollMargin = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            v: 0,
            h: 0
        };
        this.$changes = 0;

        var _self = this;

        this.container = container || dom.createElement("div");
        this.$keepTextAreaAtCursor = !useragent.isOldIE;

        dom.addCssClass(this.container, "ace_editor");

        this.setTheme(theme);

        this.$gutter = dom.createElement("div");
        this.$gutter.className = "ace_gutter";
        this.container.appendChild(this.$gutter);

        this.scroller = dom.createElement("div");
        this.scroller.className = "ace_scroller";
        this.container.appendChild(this.scroller);

        this.content = dom.createElement("div");
        this.content.className = "ace_content";
        this.scroller.appendChild(this.content);

        this.$gutterLayer = new gum.Gutter(this.$gutter);
        this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));

        this.$markerBack = new mam.Marker(this.content);

        var textLayer = this.$textLayer = new txm.Text(this.content);
        this.canvas = textLayer.element;

        this.$markerFront = new mam.Marker(this.content);

        this.$cursorLayer = new csm.Cursor(this.content);
        this.$horizScroll = false;
        this.$vScroll = false;

        this.scrollBarV = new scrollbar.VScrollBar(this.container, this);
        this.scrollBarH = new scrollbar.HScrollBar(this.container, this);
        this.scrollBarV.addEventListener("scroll", function (e) {
            if (!_self.$scrollAnimation) {
                _self.session.setScrollTop(e.data - _self.scrollMargin.top);
            }
        });
        this.scrollBarH.addEventListener("scroll", function (e) {
            if (!_self.$scrollAnimation) {
                _self.session.setScrollLeft(e.data - _self.scrollMargin.left);
            }
        });

        this.cursorPos = {
            row: 0,
            column: 0
        };

        this.$fontMetrics = new fmm.FontMetrics(this.container, 500);
        this.$textLayer.$setFontMetrics(this.$fontMetrics);
        this.$textLayer.addEventListener("changeCharacterSize", function (e) {
            _self.updateCharacterSize();
            _self.onResize(true, _self.gutterWidth, _self.$size.width, _self.$size.height);
            _self._signal("changeCharacterSize", e);
        });

        this.$size = {
            width: 0,
            height: 0,
            scrollerHeight: 0,
            scrollerWidth: 0,
            $dirty: true
        };

        this.$loop = new rlm.RenderLoop(this.$renderChanges.bind(this), this.container.ownerDocument.defaultView);
        this.$loop.schedule(CHANGE_FULL);

        this.updateCharacterSize();
        this.setPadding(4);
        config.resetOptions(this);
        config._emit("renderer", this);
    }
    Object.defineProperty(VirtualRenderer.prototype, "maxLines", {
        set: function (maxLines) {
            this.$maxLines = maxLines;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(VirtualRenderer.prototype, "keepTextAreaAtCursor", {
        set: function (keepTextAreaAtCursor) {
            this.$keepTextAreaAtCursor = keepTextAreaAtCursor;
        },
        enumerable: true,
        configurable: true
    });

    VirtualRenderer.prototype.setDefaultCursorStyle = function () {
        this.content.style.cursor = "default";
    };
    VirtualRenderer.prototype.setCursorLayerOff = function () {
        var noop = function () {
        };
        this.$cursorLayer.restartTimer = noop;
        this.$cursorLayer.element.style.opacity = "0";
    };

    VirtualRenderer.prototype.updateCharacterSize = function () {
        if (this.$textLayer.allowBoldFonts != this.$allowBoldFonts) {
            this.$allowBoldFonts = this.$textLayer.allowBoldFonts;
            this.setStyle("ace_nobold", !this.$allowBoldFonts);
        }

        this.layerConfig.characterWidth = this.characterWidth = this.$textLayer.getCharacterWidth();
        this.layerConfig.lineHeight = this.lineHeight = this.$textLayer.getLineHeight();
        this.$updatePrintMargin();
    };
    VirtualRenderer.prototype.setSession = function (session) {
        if (this.session)
            this.session.doc.off("changeNewLineMode", this.onChangeNewLineMode);

        this.session = session;
        if (!session)
            return;

        if (this.scrollMargin.top && session.getScrollTop() <= 0)
            session.setScrollTop(-this.scrollMargin.top);

        this.$cursorLayer.setSession(session);
        this.$markerBack.setSession(session);
        this.$markerFront.setSession(session);
        this.$gutterLayer.setSession(session);
        this.$textLayer.setSession(session);
        this.$loop.schedule(CHANGE_FULL);
        this.session.$setFontMetrics(this.$fontMetrics);

        this.onChangeNewLineMode = this.onChangeNewLineMode.bind(this);
        this.onChangeNewLineMode();
        this.session.doc.on("changeNewLineMode", this.onChangeNewLineMode);
    };
    VirtualRenderer.prototype.updateLines = function (firstRow, lastRow, force) {
        if (lastRow === undefined) {
            lastRow = Infinity;
        }

        if (!this.$changedLines) {
            this.$changedLines = { firstRow: firstRow, lastRow: lastRow };
        } else {
            if (this.$changedLines.firstRow > firstRow) {
                this.$changedLines.firstRow = firstRow;
            }

            if (this.$changedLines.lastRow < lastRow) {
                this.$changedLines.lastRow = lastRow;
            }
        }
        if (this.$changedLines.lastRow < this.layerConfig.firstRow) {
            if (force) {
                this.$changedLines.lastRow = this.layerConfig.lastRow;
            } else {
                return;
            }
        }

        if (this.$changedLines.firstRow > this.layerConfig.lastRow) {
            return;
        }
        this.$loop.schedule(CHANGE_LINES);
    };

    VirtualRenderer.prototype.onChangeNewLineMode = function () {
        this.$loop.schedule(CHANGE_TEXT);
        this.$textLayer.$updateEolChar();
    };

    VirtualRenderer.prototype.onChangeTabSize = function () {
        if (this.$loop) {
            if (this.$loop.schedule) {
                this.$loop.schedule(CHANGE_TEXT | CHANGE_MARKER);
            } else {
            }
        } else {
        }
        if (this.$textLayer) {
            if (this.$textLayer.onChangeTabSize) {
                this.$textLayer.onChangeTabSize();
            } else {
            }
        } else {
        }
    };
    VirtualRenderer.prototype.updateText = function () {
        this.$loop.schedule(CHANGE_TEXT);
    };
    VirtualRenderer.prototype.updateFull = function (force) {
        if (force)
            this.$renderChanges(CHANGE_FULL, true);
        else
            this.$loop.schedule(CHANGE_FULL);
    };
    VirtualRenderer.prototype.updateFontSize = function () {
        this.$textLayer.checkForSizeChanges();
    };

    VirtualRenderer.prototype.$updateSizeAsync = function () {
        if (this.$loop.pending)
            this.$size.$dirty = true;
        else
            this.onResize();
    };
    VirtualRenderer.prototype.onResize = function (force, gutterWidth, width, height) {
        if (this.resizing > 2)
            return;
        else if (this.resizing > 0)
            this.resizing++;
        else
            this.resizing = force ? 1 : 0;
        var el = this.container;
        if (!height)
            height = el.clientHeight || el.scrollHeight;
        if (!width)
            width = el.clientWidth || el.scrollWidth;
        var changes = this.$updateCachedSize(force, gutterWidth, width, height);

        if (!this.$size.scrollerHeight || (!width && !height))
            return this.resizing = 0;

        if (force)
            this.$gutterLayer.$padding = null;

        if (force)
            this.$renderChanges(changes | this.$changes, true);
        else
            this.$loop.schedule(changes | this.$changes);

        if (this.resizing)
            this.resizing = 0;
    };

    VirtualRenderer.prototype.$updateCachedSize = function (force, gutterWidth, width, height) {
        height -= (this.$extraHeight || 0);
        var changes = 0;
        var size = this.$size;
        var oldSize = {
            width: size.width,
            height: size.height,
            scrollerHeight: size.scrollerHeight,
            scrollerWidth: size.scrollerWidth
        };
        if (height && (force || size.height != height)) {
            size.height = height;
            changes |= CHANGE_SIZE;

            size.scrollerHeight = size.height;
            if (this.$horizScroll)
                size.scrollerHeight -= this.scrollBarH.height;

            this.scrollBarV.element.style.bottom = this.scrollBarH.height + "px";

            changes = changes | CHANGE_SCROLL;
        }

        if (width && (force || size.width != width)) {
            changes |= CHANGE_SIZE;
            size.width = width;

            if (gutterWidth == null)
                gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;

            this.gutterWidth = gutterWidth;

            this.scrollBarH.element.style.left = this.scroller.style.left = gutterWidth + "px";
            size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBarV.width);

            this.scrollBarH.element.style.right = this.scroller.style.right = this.scrollBarV.width + "px";
            this.scroller.style.bottom = this.scrollBarH.height + "px";

            if (this.session && this.session.getUseWrapMode() && this.adjustWrapLimit() || force)
                changes |= CHANGE_FULL;
        }

        size.$dirty = !width || !height;

        if (changes)
            this._signal("resize", oldSize);

        return changes;
    };

    VirtualRenderer.prototype.onGutterResize = function () {
        var gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;
        if (gutterWidth != this.gutterWidth)
            this.$changes |= this.$updateCachedSize(true, gutterWidth, this.$size.width, this.$size.height);

        if (this.session.getUseWrapMode() && this.adjustWrapLimit()) {
            this.$loop.schedule(CHANGE_FULL);
        } else if (this.$size.$dirty) {
            this.$loop.schedule(CHANGE_FULL);
        } else {
            this.$computeLayerConfig();
            this.$loop.schedule(CHANGE_MARKER);
        }
    };
    VirtualRenderer.prototype.adjustWrapLimit = function () {
        var availableWidth = this.$size.scrollerWidth - this.$padding * 2;
        var limit = Math.floor(availableWidth / this.characterWidth);
        return this.session.adjustWrapLimit(limit, this.$showPrintMargin && this.$printMarginColumn);
    };
    VirtualRenderer.prototype.setAnimatedScroll = function (shouldAnimate) {
        this.setOption("animatedScroll", shouldAnimate);
    };
    VirtualRenderer.prototype.getAnimatedScroll = function () {
        return this.$animatedScroll;
    };
    VirtualRenderer.prototype.setShowInvisibles = function (showInvisibles) {
        this.setOption("showInvisibles", showInvisibles);
    };
    VirtualRenderer.prototype.getShowInvisibles = function () {
        return this.getOption("showInvisibles");
    };

    VirtualRenderer.prototype.getDisplayIndentGuides = function () {
        return this.getOption("displayIndentGuides");
    };

    VirtualRenderer.prototype.setDisplayIndentGuides = function (displayIndentGuides) {
        this.setOption("displayIndentGuides", displayIndentGuides);
    };
    VirtualRenderer.prototype.setShowPrintMargin = function (showPrintMargin) {
        this.setOption("showPrintMargin", showPrintMargin);
    };
    VirtualRenderer.prototype.getShowPrintMargin = function () {
        return this.getOption("showPrintMargin");
    };
    VirtualRenderer.prototype.setPrintMarginColumn = function (printMarginColumn) {
        this.setOption("printMarginColumn", printMarginColumn);
    };
    VirtualRenderer.prototype.getPrintMarginColumn = function () {
        return this.getOption("printMarginColumn");
    };
    VirtualRenderer.prototype.getShowGutter = function () {
        return this.getOption("showGutter");
    };
    VirtualRenderer.prototype.setShowGutter = function (show) {
        return this.setOption("showGutter", show);
    };

    VirtualRenderer.prototype.getFadeFoldWidgets = function () {
        return this.getOption("fadeFoldWidgets");
    };

    VirtualRenderer.prototype.setFadeFoldWidgets = function (show) {
        this.setOption("fadeFoldWidgets", show);
    };

    VirtualRenderer.prototype.setHighlightGutterLine = function (shouldHighlight) {
        this.setOption("highlightGutterLine", shouldHighlight);
    };

    VirtualRenderer.prototype.getHighlightGutterLine = function () {
        return this.getOption("highlightGutterLine");
    };

    VirtualRenderer.prototype.$updateGutterLineHighlight = function () {
        var pos = this.$cursorLayer.$pixelPos;
        var height = this.layerConfig.lineHeight;
        if (this.session.getUseWrapMode()) {
            var cursor = this.session.selection.getCursor();
            cursor.column = 0;
            pos = this.$cursorLayer.getPixelPosition(cursor, true);
            height *= this.session.getRowLength(cursor.row);
        }
        this.$gutterLineHighlight.style.top = pos.top - this.layerConfig.offset + "px";
        this.$gutterLineHighlight.style.height = height + "px";
    };

    VirtualRenderer.prototype.$updatePrintMargin = function () {
        if (!this.$showPrintMargin && !this.$printMarginEl)
            return;

        if (!this.$printMarginEl) {
            var containerEl = dom.createElement("div");
            containerEl.className = "ace_layer ace_print-margin-layer";
            this.$printMarginEl = dom.createElement("div");
            this.$printMarginEl.className = "ace_print-margin";
            containerEl.appendChild(this.$printMarginEl);
            this.content.insertBefore(containerEl, this.content.firstChild);
        }

        var style = this.$printMarginEl.style;
        style.left = ((this.characterWidth * this.$printMarginColumn) + this.$padding) + "px";
        style.visibility = this.$showPrintMargin ? "visible" : "hidden";

        if (this.session && this.session['$wrap'] == -1)
            this.adjustWrapLimit();
    };
    VirtualRenderer.prototype.getContainerElement = function () {
        return this.container;
    };
    VirtualRenderer.prototype.getMouseEventTarget = function () {
        return this.content;
    };
    VirtualRenderer.prototype.getTextAreaContainer = function () {
        return this.container;
    };
    VirtualRenderer.prototype.$moveTextAreaToCursor = function () {
        if (!this.$keepTextAreaAtCursor)
            return;
        var config = this.layerConfig;
        var posTop = this.$cursorLayer.$pixelPos.top;
        var posLeft = this.$cursorLayer.$pixelPos.left;
        posTop -= config.offset;

        var h = this.lineHeight;
        if (posTop < 0 || posTop > config.height - h)
            return;

        var w = this.characterWidth;
        if (this.$composition) {
            var val = this.textarea.value.replace(/^\x01+/, "");
            w *= (this.session.$getStringScreenWidth(val)[0] + 2);
            h += 2;
            posTop -= 1;
        }
        posLeft -= this.scrollLeft;
        if (posLeft > this.$size.scrollerWidth - w)
            posLeft = this.$size.scrollerWidth - w;

        posLeft -= this.scrollBarV.width;

        this.textarea.style.height = h + "px";
        this.textarea.style.width = w + "px";
        this.textarea.style.right = Math.max(0, this.$size.scrollerWidth - posLeft - w) + "px";
        this.textarea.style.bottom = Math.max(0, this.$size.height - posTop - h) + "px";
    };
    VirtualRenderer.prototype.getFirstVisibleRow = function () {
        return this.layerConfig.firstRow;
    };
    VirtualRenderer.prototype.getFirstFullyVisibleRow = function () {
        return this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1);
    };
    VirtualRenderer.prototype.getLastFullyVisibleRow = function () {
        var flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight);
        return this.layerConfig.firstRow - 1 + flint;
    };
    VirtualRenderer.prototype.getLastVisibleRow = function () {
        return this.layerConfig.lastRow;
    };
    VirtualRenderer.prototype.setPadding = function (padding) {
        this.$padding = padding;
        this.$textLayer.setPadding(padding);
        this.$cursorLayer.setPadding(padding);
        this.$markerFront.setPadding(padding);
        this.$markerBack.setPadding(padding);
        this.$loop.schedule(CHANGE_FULL);
        this.$updatePrintMargin();
    };

    VirtualRenderer.prototype.setScrollMargin = function (top, bottom, left, right) {
        var sm = this.scrollMargin;
        sm.top = top | 0;
        sm.bottom = bottom | 0;
        sm.right = right | 0;
        sm.left = left | 0;
        sm.v = sm.top + sm.bottom;
        sm.h = sm.left + sm.right;
        if (sm.top && this.scrollTop <= 0 && this.session)
            this.session.setScrollTop(-sm.top);
        this.updateFull();
    };
    VirtualRenderer.prototype.getHScrollBarAlwaysVisible = function () {
        return this.$hScrollBarAlwaysVisible;
    };
    VirtualRenderer.prototype.setHScrollBarAlwaysVisible = function (alwaysVisible) {
        this.setOption("hScrollBarAlwaysVisible", alwaysVisible);
    };
    VirtualRenderer.prototype.getVScrollBarAlwaysVisible = function () {
        return this.$vScrollBarAlwaysVisible;
    };
    VirtualRenderer.prototype.setVScrollBarAlwaysVisible = function (alwaysVisible) {
        this.setOption("vScrollBarAlwaysVisible", alwaysVisible);
    };

    VirtualRenderer.prototype.$updateScrollBarV = function () {
        var scrollHeight = this.layerConfig.maxHeight;
        var scrollerHeight = this.$size.scrollerHeight;
        if (!this.$maxLines && this.$scrollPastEnd) {
            scrollHeight -= (scrollerHeight - this.lineHeight) * this.$scrollPastEnd;
            if (this.scrollTop > scrollHeight - scrollerHeight) {
                scrollHeight = this.scrollTop + scrollerHeight;
                this.scrollBarV.scrollTop = null;
            }
        }
        this.scrollBarV.setScrollHeight(scrollHeight + this.scrollMargin.v);
        this.scrollBarV.setScrollTop(this.scrollTop + this.scrollMargin.top);
    };

    VirtualRenderer.prototype.$updateScrollBarH = function () {
        this.scrollBarH.setScrollWidth(this.layerConfig.width + 2 * this.$padding + this.scrollMargin.h);
        this.scrollBarH.setScrollLeft(this.scrollLeft + this.scrollMargin.left);
    };

    VirtualRenderer.prototype.freeze = function () {
        this.$frozen = true;
    };

    VirtualRenderer.prototype.unfreeze = function () {
        this.$frozen = false;
    };

    VirtualRenderer.prototype.$renderChanges = function (changes, force) {
        if (this.$changes) {
            changes |= this.$changes;
            this.$changes = 0;
        }
        if ((!this.session || !this.container.offsetWidth || this.$frozen) || (!changes && !force)) {
            this.$changes |= changes;
            return;
        }
        if (this.$size.$dirty) {
            this.$changes |= changes;
            return this.onResize(true);
        }
        if (!this.lineHeight) {
            this.$textLayer.checkForSizeChanges();
        }
        this._signal("beforeRender");
        var config = this.layerConfig;
        if (changes & CHANGE_FULL || changes & CHANGE_SIZE || changes & CHANGE_TEXT || changes & CHANGE_LINES || changes & CHANGE_SCROLL || changes & CHANGE_H_SCROLL) {
            changes |= this.$computeLayerConfig();
            if (config.firstRow != this.layerConfig.firstRow && config.firstRowScreen == this.layerConfig.firstRowScreen) {
                this.scrollTop = this.scrollTop + (config.firstRow - this.layerConfig.firstRow) * this.lineHeight;
                changes = changes | CHANGE_SCROLL;
                changes |= this.$computeLayerConfig();
            }
            config = this.layerConfig;
            this.$updateScrollBarV();
            if (changes & CHANGE_H_SCROLL)
                this.$updateScrollBarH();
            this.$gutterLayer.element.style.marginTop = (-config.offset) + "px";
            this.content.style.marginTop = (-config.offset) + "px";
            this.content.style.width = config.width + 2 * this.$padding + "px";
            this.content.style.height = config.minHeight + "px";
        }
        if (changes & CHANGE_H_SCROLL) {
            this.content.style.marginLeft = -this.scrollLeft + "px";
            this.scroller.className = this.scrollLeft <= 0 ? "ace_scroller" : "ace_scroller ace_scroll-left";
        }
        if (changes & CHANGE_FULL) {
            this.$textLayer.update(config);
            if (this.$showGutter)
                this.$gutterLayer.update(config);
            this.$markerBack.update(config);
            this.$markerFront.update(config);
            this.$cursorLayer.update(config);
            this.$moveTextAreaToCursor();
            this.$highlightGutterLine && this.$updateGutterLineHighlight();
            this._signal("afterRender");
            return;
        }
        if (changes & CHANGE_SCROLL) {
            if (changes & CHANGE_TEXT || changes & CHANGE_LINES)
                this.$textLayer.update(config);
            else
                this.$textLayer.scrollLines(config);

            if (this.$showGutter)
                this.$gutterLayer.update(config);
            this.$markerBack.update(config);
            this.$markerFront.update(config);
            this.$cursorLayer.update(config);
            this.$highlightGutterLine && this.$updateGutterLineHighlight();
            this.$moveTextAreaToCursor();
            this._signal("afterRender");
            return;
        }

        if (changes & CHANGE_TEXT) {
            this.$textLayer.update(config);
            if (this.$showGutter)
                this.$gutterLayer.update(config);
        } else if (changes & CHANGE_LINES) {
            if (this.$updateLines() || (changes & CHANGE_GUTTER) && this.$showGutter)
                this.$gutterLayer.update(config);
        } else if (changes & CHANGE_TEXT || changes & CHANGE_GUTTER) {
            if (this.$showGutter)
                this.$gutterLayer.update(config);
        }

        if (changes & CHANGE_CURSOR) {
            this.$cursorLayer.update(config);
            this.$moveTextAreaToCursor();
            this.$highlightGutterLine && this.$updateGutterLineHighlight();
        }

        if (changes & (CHANGE_MARKER | CHANGE_MARKER_FRONT)) {
            this.$markerFront.update(config);
        }

        if (changes & (CHANGE_MARKER | CHANGE_MARKER_BACK)) {
            this.$markerBack.update(config);
        }

        this._signal("afterRender");
    };

    VirtualRenderer.prototype.$autosize = function () {
        var height = this.session.getScreenLength() * this.lineHeight;
        var maxHeight = this.$maxLines * this.lineHeight;
        var desiredHeight = Math.max((this.$minLines || 1) * this.lineHeight, Math.min(maxHeight, height)) + this.scrollMargin.v + (this.$extraHeight || 0);
        var vScroll = height > maxHeight;

        if (desiredHeight != this.desiredHeight || this.$size.height != this.desiredHeight || vScroll != this.$vScroll) {
            if (vScroll != this.$vScroll) {
                this.$vScroll = vScroll;
                this.scrollBarV.setVisible(vScroll);
            }

            var w = this.container.clientWidth;
            this.container.style.height = desiredHeight + "px";
            this.$updateCachedSize(true, this.$gutterWidth, w, desiredHeight);
            this.desiredHeight = desiredHeight;
        }
    };

    VirtualRenderer.prototype.$computeLayerConfig = function () {
        if (this.$maxLines && this.lineHeight > 1) {
            this.$autosize();
        }

        var session = this.session;
        var size = this.$size;

        var hideScrollbars = size.height <= 2 * this.lineHeight;
        var screenLines = this.session.getScreenLength();
        var maxHeight = screenLines * this.lineHeight;

        var offset = this.scrollTop % this.lineHeight;
        var minHeight = size.scrollerHeight + this.lineHeight;

        var longestLine = this.$getLongestLine();

        var horizScroll = !hideScrollbars && (this.$hScrollBarAlwaysVisible || size.scrollerWidth - longestLine - 2 * this.$padding < 0);

        var hScrollChanged = this.$horizScroll !== horizScroll;
        if (hScrollChanged) {
            this.$horizScroll = horizScroll;
            this.scrollBarH.setVisible(horizScroll);
        }

        if (!this.$maxLines && this.$scrollPastEnd) {
            maxHeight += (size.scrollerHeight - this.lineHeight) * this.$scrollPastEnd;
        }

        var vScroll = !hideScrollbars && (this.$vScrollBarAlwaysVisible || size.scrollerHeight - maxHeight < 0);
        var vScrollChanged = this.$vScroll !== vScroll;
        if (vScrollChanged) {
            this.$vScroll = vScroll;
            this.scrollBarV.setVisible(vScroll);
        }

        this.session.setScrollTop(Math.max(-this.scrollMargin.top, Math.min(this.scrollTop, maxHeight - size.scrollerHeight + this.scrollMargin.bottom)));

        this.session.setScrollLeft(Math.max(-this.scrollMargin.left, Math.min(this.scrollLeft, longestLine + 2 * this.$padding - size.scrollerWidth + this.scrollMargin.right)));

        var lineCount = Math.ceil(minHeight / this.lineHeight) - 1;
        var firstRow = Math.max(0, Math.round((this.scrollTop - offset) / this.lineHeight));
        var lastRow = firstRow + lineCount;
        var firstRowScreen, firstRowHeight;
        var lineHeight = this.lineHeight;
        firstRow = session.screenToDocumentRow(firstRow, 0);
        var foldLine = session.getFoldLine(firstRow);
        if (foldLine) {
            firstRow = foldLine.start.row;
        }

        firstRowScreen = session.documentToScreenRow(firstRow, 0);
        firstRowHeight = session.getRowLength(firstRow) * lineHeight;

        lastRow = Math.min(session.screenToDocumentRow(lastRow, 0), session.getLength() - 1);
        minHeight = size.scrollerHeight + session.getRowLength(lastRow) * lineHeight + firstRowHeight;

        offset = this.scrollTop - firstRowScreen * lineHeight;

        var changes = 0;
        if (this.layerConfig.width != longestLine)
            changes = CHANGE_H_SCROLL;
        if (hScrollChanged || vScrollChanged) {
            changes = this.$updateCachedSize(true, this.gutterWidth, size.width, size.height);
            this._signal("scrollbarVisibilityChanged");
            if (vScrollChanged)
                longestLine = this.$getLongestLine();
        }

        this.layerConfig = {
            width: longestLine,
            padding: this.$padding,
            firstRow: firstRow,
            firstRowScreen: firstRowScreen,
            lastRow: lastRow,
            lineHeight: lineHeight,
            characterWidth: this.characterWidth,
            minHeight: minHeight,
            maxHeight: maxHeight,
            offset: offset,
            gutterOffset: Math.max(0, Math.ceil((offset + size.height - size.scrollerHeight) / lineHeight)),
            height: this.$size.scrollerHeight
        };
        return changes;
    };

    VirtualRenderer.prototype.$updateLines = function () {
        var firstRow = this.$changedLines.firstRow;
        var lastRow = this.$changedLines.lastRow;
        this.$changedLines = null;

        var layerConfig = this.layerConfig;

        if (firstRow > layerConfig.lastRow + 1) {
            return;
        }
        if (lastRow < layerConfig.firstRow) {
            return;
        }
        if (lastRow === Infinity) {
            if (this.$showGutter)
                this.$gutterLayer.update(layerConfig);
            this.$textLayer.update(layerConfig);
            return;
        }
        this.$textLayer.updateLines(layerConfig, firstRow, lastRow);
        return true;
    };

    VirtualRenderer.prototype.$getLongestLine = function () {
        var charCount = this.session.getScreenWidth();
        if (this.showInvisibles && !this.session.$useWrapMode)
            charCount += 1;

        return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(charCount * this.characterWidth));
    };
    VirtualRenderer.prototype.updateFrontMarkers = function () {
        this.$markerFront.setMarkers(this.session.getMarkers(true));
        this.$loop.schedule(CHANGE_MARKER_FRONT);
    };
    VirtualRenderer.prototype.updateBackMarkers = function () {
        this.$markerBack.setMarkers(this.session.getMarkers(false));
        this.$loop.schedule(CHANGE_MARKER_BACK);
    };
    VirtualRenderer.prototype.addGutterDecoration = function (row, className) {
        this.$gutterLayer.addGutterDecoration(row, className);
    };
    VirtualRenderer.prototype.removeGutterDecoration = function (row, className) {
        this.$gutterLayer.removeGutterDecoration(row, className);
    };
    VirtualRenderer.prototype.updateBreakpoints = function () {
        this.$loop.schedule(CHANGE_GUTTER);
    };
    VirtualRenderer.prototype.setAnnotations = function (annotations) {
        this.$gutterLayer.setAnnotations(annotations);
        this.$loop.schedule(CHANGE_GUTTER);
    };
    VirtualRenderer.prototype.updateCursor = function () {
        this.$loop.schedule(CHANGE_CURSOR);
    };
    VirtualRenderer.prototype.hideCursor = function () {
        this.$cursorLayer.hideCursor();
    };
    VirtualRenderer.prototype.showCursor = function () {
        this.$cursorLayer.showCursor();
    };

    VirtualRenderer.prototype.scrollSelectionIntoView = function (anchor, lead, offset) {
        this.scrollCursorIntoView(anchor, offset);
        this.scrollCursorIntoView(lead, offset);
    };
    VirtualRenderer.prototype.scrollCursorIntoView = function (cursor, offset, $viewMargin) {
        if (this.$size.scrollerHeight === 0)
            return;

        var pos = this.$cursorLayer.getPixelPosition(cursor);

        var left = pos.left;
        var top = pos.top;

        var topMargin = $viewMargin && $viewMargin.top || 0;
        var bottomMargin = $viewMargin && $viewMargin.bottom || 0;

        var scrollTop = this.$scrollAnimation ? this.session.getScrollTop() : this.scrollTop;

        if (scrollTop + topMargin > top) {
            if (offset)
                top -= offset * this.$size.scrollerHeight;
            if (top === 0)
                top = -this.scrollMargin.top;
            this.session.setScrollTop(top);
        } else if (scrollTop + this.$size.scrollerHeight - bottomMargin < top + this.lineHeight) {
            if (offset)
                top += offset * this.$size.scrollerHeight;
            this.session.setScrollTop(top + this.lineHeight - this.$size.scrollerHeight);
        }

        var scrollLeft = this.scrollLeft;

        if (scrollLeft > left) {
            if (left < this.$padding + 2 * this.layerConfig.characterWidth)
                left = -this.scrollMargin.left;
            this.session.setScrollLeft(left);
        } else if (scrollLeft + this.$size.scrollerWidth < left + this.characterWidth) {
            this.session.setScrollLeft(Math.round(left + this.characterWidth - this.$size.scrollerWidth));
        } else if (scrollLeft <= this.$padding && left - scrollLeft < this.characterWidth) {
            this.session.setScrollLeft(0);
        }
    };
    VirtualRenderer.prototype.getScrollTop = function () {
        return this.session.getScrollTop();
    };
    VirtualRenderer.prototype.getScrollLeft = function () {
        return this.session.getScrollLeft();
    };
    VirtualRenderer.prototype.getScrollTopRow = function () {
        return this.scrollTop / this.lineHeight;
    };
    VirtualRenderer.prototype.getScrollBottomRow = function () {
        return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
    };
    VirtualRenderer.prototype.scrollToRow = function (row) {
        this.session.setScrollTop(row * this.lineHeight);
    };

    VirtualRenderer.prototype.alignCursor = function (cursor, alignment) {
        if (typeof cursor == "number")
            cursor = { row: cursor, column: 0 };

        var pos = this.$cursorLayer.getPixelPosition(cursor);
        var h = this.$size.scrollerHeight - this.lineHeight;
        var offset = pos.top - h * (alignment || 0);

        this.session.setScrollTop(offset);
        return offset;
    };

    VirtualRenderer.prototype.$calcSteps = function (fromValue, toValue) {
        var i = 0;
        var l = this.STEPS;
        var steps = [];

        var func = function (t, x_min, dx) {
            return dx * (Math.pow(t - 1, 3) + 1) + x_min;
        };

        for (i = 0; i < l; ++i)
            steps.push(func(i / this.STEPS, fromValue, toValue - fromValue));

        return steps;
    };
    VirtualRenderer.prototype.scrollToLine = function (line, center, animate, callback) {
        var pos = this.$cursorLayer.getPixelPosition({ row: line, column: 0 });
        var offset = pos.top;
        if (center)
            offset -= this.$size.scrollerHeight / 2;

        var initialScroll = this.scrollTop;
        this.session.setScrollTop(offset);
        if (animate !== false)
            this.animateScrolling(initialScroll, callback);
    };

    VirtualRenderer.prototype.animateScrolling = function (fromValue, callback) {
        var toValue = this.scrollTop;
        if (!this.$animatedScroll)
            return;
        var _self = this;

        if (fromValue == toValue)
            return;

        if (this.$scrollAnimation) {
            var oldSteps = this.$scrollAnimation.steps;
            if (oldSteps.length) {
                fromValue = oldSteps[0];
                if (fromValue == toValue)
                    return;
            }
        }

        var steps = _self.$calcSteps(fromValue, toValue);
        this.$scrollAnimation = { from: fromValue, to: toValue, steps: steps };

        clearInterval(this.$timer);

        _self.session.setScrollTop(steps.shift());
        _self.session.$scrollTop = toValue;
        this.$timer = setInterval(function () {
            if (steps.length) {
                _self.session.setScrollTop(steps.shift());
                _self.session.$scrollTop = toValue;
            } else if (toValue != null) {
                _self.session.$scrollTop = -1;
                _self.session.setScrollTop(toValue);
                toValue = null;
            } else {
                _self.$timer = clearInterval(_self.$timer);
                _self.$scrollAnimation = null;
                callback && callback();
            }
        }, 10);
    };
    VirtualRenderer.prototype.scrollToY = function (scrollTop) {
        if (this.scrollTop !== scrollTop) {
            this.$loop.schedule(CHANGE_SCROLL);
            this.scrollTop = scrollTop;
        }
    };
    VirtualRenderer.prototype.scrollToX = function (scrollLeft) {
        if (this.scrollLeft !== scrollLeft)
            this.scrollLeft = scrollLeft;
        this.$loop.schedule(CHANGE_H_SCROLL);
    };
    VirtualRenderer.prototype.scrollTo = function (x, y) {
        this.session.setScrollTop(y);
        this.session.setScrollLeft(y);
    };
    VirtualRenderer.prototype.scrollBy = function (deltaX, deltaY) {
        deltaY && this.session.setScrollTop(this.session.getScrollTop() + deltaY);
        deltaX && this.session.setScrollLeft(this.session.getScrollLeft() + deltaX);
    };
    VirtualRenderer.prototype.isScrollableBy = function (deltaX, deltaY) {
        if (deltaY < 0 && this.session.getScrollTop() >= 1 - this.scrollMargin.top)
            return true;
        if (deltaY > 0 && this.session.getScrollTop() + this.$size.scrollerHeight - this.layerConfig.maxHeight < -1 + this.scrollMargin.bottom)
            return true;
        if (deltaX < 0 && this.session.getScrollLeft() >= 1 - this.scrollMargin.left)
            return true;
        if (deltaX > 0 && this.session.getScrollLeft() + this.$size.scrollerWidth - this.layerConfig.width < -1 + this.scrollMargin.right)
            return true;
    };

    VirtualRenderer.prototype.pixelToScreenCoordinates = function (x, y) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var offset = (x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth;
        var row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);
        var col = Math.round(offset);

        return { row: row, column: col, side: offset - col > 0 ? 1 : -1 };
    };

    VirtualRenderer.prototype.screenToTextCoordinates = function (x, y) {
        var canvasPos = this.scroller.getBoundingClientRect();

        var col = Math.round((x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth);

        var row = (y + this.scrollTop - canvasPos.top) / this.lineHeight;

        return this.session.screenToDocumentPosition(row, Math.max(col, 0));
    };
    VirtualRenderer.prototype.textToScreenCoordinates = function (row, column) {
        var canvasPos = this.scroller.getBoundingClientRect();
        var pos = this.session.documentToScreenPosition(row, column);

        var x = this.$padding + Math.round(pos.column * this.characterWidth);
        var y = pos.row * this.lineHeight;

        return {
            pageX: canvasPos.left + x - this.scrollLeft,
            pageY: canvasPos.top + y - this.scrollTop
        };
    };
    VirtualRenderer.prototype.visualizeFocus = function () {
        dom.addCssClass(this.container, "ace_focus");
    };
    VirtualRenderer.prototype.visualizeBlur = function () {
        dom.removeCssClass(this.container, "ace_focus");
    };
    VirtualRenderer.prototype.showComposition = function (position) {
        if (!this.$composition)
            this.$composition = {
                keepTextAreaAtCursor: this.$keepTextAreaAtCursor,
                cssText: this.textarea.style.cssText
            };

        this.$keepTextAreaAtCursor = true;
        dom.addCssClass(this.textarea, "ace_composition");
        this.textarea.style.cssText = "";
        this.$moveTextAreaToCursor();
    };
    VirtualRenderer.prototype.setCompositionText = function (text) {
        this.$moveTextAreaToCursor();
    };
    VirtualRenderer.prototype.hideComposition = function () {
        if (!this.$composition)
            return;

        dom.removeCssClass(this.textarea, "ace_composition");
        this.$keepTextAreaAtCursor = this.$composition.keepTextAreaAtCursor;
        this.textarea.style.cssText = this.$composition.cssText;
        this.$composition = null;
    };
    VirtualRenderer.prototype.setTheme = function (theme, cb) {
        var _self = this;
        this.$themeId = theme;
        _self._dispatchEvent('themeChange', { theme: theme });

        if (!theme || typeof theme == "string") {
            var moduleName = theme || this.$options.theme.initialValue;
            config.loadModule(["theme", moduleName], afterLoad);
        } else {
            afterLoad(theme);
        }

        function afterLoad(module) {
            if (_self.$themeId != theme)
                return cb && cb();
            if (!module.cssClass)
                return;
            dom.importCssString(module.cssText, module.cssClass, _self.container.ownerDocument);

            if (_self.theme)
                dom.removeCssClass(_self.container, _self.theme.cssClass);

            var padding = "padding" in module ? module.padding : "padding" in (_self.theme || {}) ? 4 : _self.$padding;

            if (_self.$padding && padding != _self.$padding) {
                _self.setPadding(padding);
            }
            _self.$theme = module.cssClass;

            _self.theme = module;
            dom.addCssClass(_self.container, module.cssClass);
            dom.setCssClass(_self.container, "ace_dark", module.isDark);
            if (_self.$size) {
                _self.$size.width = 0;
                _self.$updateSizeAsync();
            }

            _self._dispatchEvent('themeLoaded', { theme: module });
            cb && cb();
        }
    };
    VirtualRenderer.prototype.getTheme = function () {
        return this.$themeId;
    };
    VirtualRenderer.prototype.setStyle = function (style, include) {
        dom.setCssClass(this.container, style, include !== false);
    };
    VirtualRenderer.prototype.unsetStyle = function (style) {
        dom.removeCssClass(this.container, style);
    };

    VirtualRenderer.prototype.setCursorStyle = function (style) {
        if (this.content.style.cursor != style)
            this.content.style.cursor = style;
    };
    VirtualRenderer.prototype.setMouseCursor = function (cursorStyle) {
        this.content.style.cursor = cursorStyle;
    };
    VirtualRenderer.prototype.destroy = function () {
        this.$textLayer.destroy();
        this.$cursorLayer.destroy();
    };
    return VirtualRenderer;
})(eve.EventEmitterClass);
exports.VirtualRenderer = VirtualRenderer;

config.defineOptions(VirtualRenderer.prototype, "renderer", {
    animatedScroll: { initialValue: false },
    showInvisibles: {
        set: function (value) {
            if (this.$textLayer.setShowInvisibles(value))
                this.$loop.schedule(this.CHANGE_TEXT);
        },
        initialValue: false
    },
    showPrintMargin: {
        set: function () {
            this.$updatePrintMargin();
        },
        initialValue: true
    },
    printMarginColumn: {
        set: function () {
            this.$updatePrintMargin();
        },
        initialValue: 80
    },
    printMargin: {
        set: function (val) {
            if (typeof val == "number")
                this.$printMarginColumn = val;
            this.$showPrintMargin = !!val;
            this.$updatePrintMargin();
        },
        get: function () {
            return this.$showPrintMargin && this.$printMarginColumn;
        }
    },
    showGutter: {
        set: function (show) {
            this.$gutter.style.display = show ? "block" : "none";
            this.$loop.schedule(this.CHANGE_FULL);
            this.onGutterResize();
        },
        initialValue: true
    },
    fadeFoldWidgets: {
        set: function (show) {
            dom.setCssClass(this.$gutter, "ace_fade-fold-widgets", show);
        },
        initialValue: false
    },
    showFoldWidgets: {
        set: function (show) {
            this.$gutterLayer.setShowFoldWidgets(show);
        },
        initialValue: true
    },
    showLineNumbers: {
        set: function (show) {
            this.$gutterLayer.setShowLineNumbers(show);
            this.$loop.schedule(this.CHANGE_GUTTER);
        },
        initialValue: true
    },
    displayIndentGuides: {
        set: function (show) {
            if (this.$textLayer.setDisplayIndentGuides(show))
                this.$loop.schedule(this.CHANGE_TEXT);
        },
        initialValue: true
    },
    highlightGutterLine: {
        set: function (shouldHighlight) {
            if (!this.$gutterLineHighlight) {
                this.$gutterLineHighlight = dom.createElement("div");
                this.$gutterLineHighlight.className = "ace_gutter-active-line";
                this.$gutter.appendChild(this.$gutterLineHighlight);
                return;
            }

            this.$gutterLineHighlight.style.display = shouldHighlight ? "" : "none";
            if (this.$cursorLayer.$pixelPos)
                this.$updateGutterLineHighlight();
        },
        initialValue: false,
        value: true
    },
    hScrollBarAlwaysVisible: {
        set: function (val) {
            if (!this.$hScrollBarAlwaysVisible || !this.$horizScroll)
                this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: false
    },
    vScrollBarAlwaysVisible: {
        set: function (val) {
            if (!this.$vScrollBarAlwaysVisible || !this.$vScroll)
                this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: false
    },
    fontSize: {
        set: function (size) {
            if (typeof size == "number")
                size = size + "px";
            this.container.style.fontSize = size;
            this.updateFontSize();
        },
        initialValue: 12
    },
    fontFamily: {
        set: function (name) {
            this.container.style.fontFamily = name;
            this.updateFontSize();
        }
    },
    maxLines: {
        set: function (val) {
            this.updateFull();
        }
    },
    minLines: {
        set: function (val) {
            this.updateFull();
        }
    },
    scrollPastEnd: {
        set: function (val) {
            val = +val || 0;
            if (this.$scrollPastEnd == val)
                return;
            this.$scrollPastEnd = val;
            this.$loop.schedule(this.CHANGE_SCROLL);
        },
        initialValue: 0,
        handlesSet: true
    },
    fixedWidthGutter: {
        set: function (val) {
            this.$gutterLayer.$fixedWidth = !!val;
            this.$loop.schedule(this.CHANGE_GUTTER);
        }
    },
    theme: {
        set: function (val) {
            this.setTheme(val);
        },
        get: function () {
            return this.$themeId || this.theme;
        },
        initialValue: "./theme/textmate",
        handlesSet: true
    }
});
});

ace.define("ace/placeholder",["require","exports","module","ace/range","ace/lib/event_emitter","ace/lib/oop"], function(require, exports, module) {
"use strict";

var Range = require("./range").Range;
var EventEmitter = require("./lib/event_emitter").EventEmitter;
var oop = require("./lib/oop");

var PlaceHolder = function(session, length, pos, others, mainClass, othersClass) {
    var _self = this;
    this.length = length;
    this.session = session;
    this.doc = session.getDocument();
    this.mainClass = mainClass;
    this.othersClass = othersClass;
    this.$onUpdate = this.onUpdate.bind(this);
    this.doc.on("change", this.$onUpdate);
    this.$others = others;
    
    this.$onCursorChange = function() {
        setTimeout(function() {
            _self.onCursorChange();
        });
    };
    
    this.$pos = pos;
    var undoStack = session.getUndoManager().$undoStack || session.getUndoManager().$undostack || {length: -1};
    this.$undoStackDepth =  undoStack.length;
    this.setup();

    session.selection.on("changeCursor", this.$onCursorChange);
};

(function() {

    oop.implement(this, EventEmitter);
    this.setup = function() {
        var _self = this;
        var doc = this.doc;
        var session = this.session;
        var pos = this.$pos;
        
        this.selectionBefore = session.selection.toJSON();
        if (session.selection.inMultiSelectMode)
            session.selection.toSingleRange();

        this.pos = doc.createAnchor(pos.row, pos.column);
        this.markerId = session.addMarker(new Range(pos.row, pos.column, pos.row, pos.column + this.length), this.mainClass, null, false);
        this.pos.on("change", function(event) {
            session.removeMarker(_self.markerId);
            _self.markerId = session.addMarker(new Range(event.value.row, event.value.column, event.value.row, event.value.column+_self.length), _self.mainClass, null, false);
        });
        this.others = [];
        this.$others.forEach(function(other) {
            var anchor = doc.createAnchor(other.row, other.column);
            _self.others.push(anchor);
        });
        session.setUndoSelect(false);
    };
    this.showOtherMarkers = function() {
        if(this.othersActive) return;
        var session = this.session;
        var _self = this;
        this.othersActive = true;
        this.others.forEach(function(anchor) {
            anchor.markerId = session.addMarker(new Range(anchor.row, anchor.column, anchor.row, anchor.column+_self.length), _self.othersClass, null, false);
            anchor.on("change", function(event) {
                session.removeMarker(anchor.markerId);
                anchor.markerId = session.addMarker(new Range(event.value.row, event.value.column, event.value.row, event.value.column+_self.length), _self.othersClass, null, false);
            });
        });
    };
    this.hideOtherMarkers = function() {
        if(!this.othersActive) return;
        this.othersActive = false;
        for (var i = 0; i < this.others.length; i++) {
            this.session.removeMarker(this.others[i].markerId);
        }
    };
    this.onUpdate = function(event) {
        var delta = event.data;
        var range = delta.range;
        if(range.start.row !== range.end.row) return;
        if(range.start.row !== this.pos.row) return;
        if (this.$updating) return;
        this.$updating = true;
        var lengthDiff = delta.action === "insertText" ? range.end.column - range.start.column : range.start.column - range.end.column;
        
        if(range.start.column >= this.pos.column && range.start.column <= this.pos.column + this.length + 1) {
            var distanceFromStart = range.start.column - this.pos.column;
            this.length += lengthDiff;
            if(!this.session.$fromUndo) {
                if(delta.action === "insertText") {
                    for (var i = this.others.length - 1; i >= 0; i--) {
                        var otherPos = this.others[i];
                        var newPos = {row: otherPos.row, column: otherPos.column + distanceFromStart};
                        if(otherPos.row === range.start.row && range.start.column < otherPos.column)
                            newPos.column += lengthDiff;
                        this.doc.insert(newPos, delta.text);
                    }
                } else if(delta.action === "removeText") {
                    for (var i = this.others.length - 1; i >= 0; i--) {
                        var otherPos = this.others[i];
                        var newPos = {row: otherPos.row, column: otherPos.column + distanceFromStart};
                        if(otherPos.row === range.start.row && range.start.column < otherPos.column)
                            newPos.column += lengthDiff;
                        this.doc.remove(new Range(newPos.row, newPos.column, newPos.row, newPos.column - lengthDiff));
                    }
                }
                if(range.start.column === this.pos.column && delta.action === "insertText") {
                    setTimeout(function() {
                        this.pos.setPosition(this.pos.row, this.pos.column - lengthDiff);
                        for (var i = 0; i < this.others.length; i++) {
                            var other = this.others[i];
                            var newPos = {row: other.row, column: other.column - lengthDiff};
                            if(other.row === range.start.row && range.start.column < other.column)
                                newPos.column += lengthDiff;
                            other.setPosition(newPos.row, newPos.column);
                        }
                    }.bind(this), 0);
                }
                else if(range.start.column === this.pos.column && delta.action === "removeText") {
                    setTimeout(function() {
                        for (var i = 0; i < this.others.length; i++) {
                            var other = this.others[i];
                            if(other.row === range.start.row && range.start.column < other.column) {
                                other.setPosition(other.row, other.column - lengthDiff);
                            }
                        }
                    }.bind(this), 0);
                }
            }
            this.pos._emit("change", {value: this.pos});
            for (var i = 0; i < this.others.length; i++) {
                this.others[i]._emit("change", {value: this.others[i]});
            }
        }
        this.$updating = false;
    };

    this.onCursorChange = function(event) {
        if (this.$updating || !this.session) return;
        var pos = this.session.selection.getCursor();
        if (pos.row === this.pos.row && pos.column >= this.pos.column && pos.column <= this.pos.column + this.length) {
            this.showOtherMarkers();
            this._emit("cursorEnter", event);
        } else {
            this.hideOtherMarkers();
            this._emit("cursorLeave", event);
        }
    };    
    this.detach = function() {
        this.session.removeMarker(this.markerId);
        this.hideOtherMarkers();
        this.doc.removeEventListener("change", this.$onUpdate);
        this.session.selection.removeEventListener("changeCursor", this.$onCursorChange);
        this.pos.detach();
        for (var i = 0; i < this.others.length; i++) {
            this.others[i].detach();
        }
        this.session.setUndoSelect(true);
        this.session = null;
    };
    this.cancel = function() {
        if(this.$undoStackDepth === -1)
            throw Error("Canceling placeholders only supported with undo manager attached to session.");
        var undoManager = this.session.getUndoManager();
        var undosRequired = (undoManager.$undoStack || undoManager.$undostack).length - this.$undoStackDepth;
        for (var i = 0; i < undosRequired; i++) {
            undoManager.undo(true);
        }
        if (this.selectionBefore)
            this.session.selection.fromJSON(this.selectionBefore);
    };
}).call(PlaceHolder.prototype);


exports.PlaceHolder = PlaceHolder;
});

ace.define("ace/mouse/multi_select_handler",["require","exports","module","ace/lib/event","ace/lib/useragent"], function(require, exports, module) {

var event = require("../lib/event");
var useragent = require("../lib/useragent");
function isSamePoint(p1, p2) {
    return p1.row == p2.row && p1.column == p2.column;
}

function onMouseDown(e) {
    var ev = e.domEvent;
    var alt = ev.altKey;
    var shift = ev.shiftKey;
    var ctrl = ev.ctrlKey;
    var accel = e.getAccelKey();
    var button = e.getButton();
    
    if (ctrl && useragent.isMac)
        button = ev.button;

    if (e.editor.inMultiSelectMode && button == 2) {
        e.editor.textInput.onContextMenu(e.domEvent);
        return;
    }
    
    if (!ctrl && !alt && !accel) {
        if (button === 0 && e.editor.inMultiSelectMode)
            e.editor.exitMultiSelectMode();
        return;
    }
    
    if (button !== 0)
        return;

    var editor = e.editor;
    var selection = editor.selection;
    var isMultiSelect = editor.inMultiSelectMode;
    var pos = e.getDocumentPosition();
    var cursor = selection.getCursor();
    var inSelection = e.inSelection() || (selection.isEmpty() && isSamePoint(pos, cursor));

    var mouseX = e.x, mouseY = e.y;
    var onMouseSelection = function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    };
    
    var session = editor.session;
    var screenAnchor = editor.renderer.pixelToScreenCoordinates(mouseX, mouseY);
    var screenCursor = screenAnchor;
    
    var selectionMode;
    if (editor.$mouseHandler.$enableJumpToDef) {
        if (ctrl && alt || accel && alt)
            selectionMode = "add";
        else if (alt)
            selectionMode = "block";
    } else {
        if (accel && !alt) {
            selectionMode = "add";
            if (!isMultiSelect && shift)
                return;
        } else if (alt) {
            selectionMode = "block";
        }
    }
    
    if (selectionMode && useragent.isMac && ev.ctrlKey) {
        editor.$mouseHandler.cancelContextMenu();
    }

    if (selectionMode == "add") {
        if (!isMultiSelect && inSelection)
            return; // dragging

        if (!isMultiSelect) {
            var range = selection.toOrientedRange();
            editor.addSelectionMarker(range);
        }

        var oldRange = selection.rangeList.rangeAtPoint(pos);
        
        
        editor.$blockScrolling++;
        editor.inVirtualSelectionMode = true;
        
        if (shift) {
            oldRange = null;
            range = selection.ranges[0];
            editor.removeSelectionMarker(range);
        }
        editor.once("mouseup", function() {
            var tmpSel = selection.toOrientedRange();

            if (oldRange && tmpSel.isEmpty() && isSamePoint(oldRange.cursor, tmpSel.cursor))
                selection.substractPoint(tmpSel.cursor);
            else {
                if (shift) {
                    selection.substractPoint(range.cursor);
                } else if (range) {
                    editor.removeSelectionMarker(range);
                    selection.addRange(range);
                }
                selection.addRange(tmpSel);
            }
            editor.$blockScrolling--;
            editor.inVirtualSelectionMode = false;
        });

    } else if (selectionMode == "block") {
        e.stop();
        editor.inVirtualSelectionMode = true;        
        var initialRange;
        var rectSel = [];
        var blockSelect = function() {
            var newCursor = editor.renderer.pixelToScreenCoordinates(mouseX, mouseY);
            var cursor = session.screenToDocumentPosition(newCursor.row, newCursor.column);

            if (isSamePoint(screenCursor, newCursor) && isSamePoint(cursor, selection.lead))
                return;
            screenCursor = newCursor;

            editor.selection.moveToPosition(cursor);
            editor.renderer.scrollCursorIntoView();

            editor.removeSelectionMarkers(rectSel);
            rectSel = selection.rectangularRangeBlock(screenCursor, screenAnchor);
            if (editor.$mouseHandler.$clickSelection && rectSel.length == 1 && rectSel[0].isEmpty())
                rectSel[0] = editor.$mouseHandler.$clickSelection.clone();
            rectSel.forEach(editor.addSelectionMarker, editor);
            editor.updateSelectionMarkers();
        };
        
        if (isMultiSelect && !accel) {
            selection.toSingleRange();
        } else if (!isMultiSelect && accel) {
            initialRange = selection.toOrientedRange();
            editor.addSelectionMarker(initialRange);
        }
        
        if (shift)
            screenAnchor = session.documentToScreenPosition(selection.lead);            
        else
            selection.moveToPosition(pos);
        
        screenCursor = {row: -1, column: -1};

        var onMouseSelectionEnd = function(e) {
            clearInterval(timerId);
            editor.removeSelectionMarkers(rectSel);
            if (!rectSel.length)
                rectSel = [selection.toOrientedRange()];
            editor.$blockScrolling++;
            if (initialRange) {
                editor.removeSelectionMarker(initialRange);
                selection.toSingleRange(initialRange);
            }
            for (var i = 0; i < rectSel.length; i++)
                selection.addRange(rectSel[i]);
            editor.inVirtualSelectionMode = false;
            editor.$mouseHandler.$clickSelection = null;
            editor.$blockScrolling--;
        };

        var onSelectionInterval = blockSelect;

        event.capture(editor.container, onMouseSelection, onMouseSelectionEnd);
        var timerId = setInterval(function() {onSelectionInterval();}, 20);

        return e.preventDefault();
    }
}


exports.onMouseDown = onMouseDown;

});

ace.define("ace/commands/multi_select_commands",["require","exports","module","ace/keyboard/hash_handler"], function(require, exports, module) {
exports.defaultCommands = [{
    name: "addCursorAbove",
    exec: function(editor) { editor.selectMoreLines(-1); },
    bindKey: {win: "Ctrl-Alt-Up", mac: "Ctrl-Alt-Up"},
    readonly: true
}, {
    name: "addCursorBelow",
    exec: function(editor) { editor.selectMoreLines(1); },
    bindKey: {win: "Ctrl-Alt-Down", mac: "Ctrl-Alt-Down"},
    readonly: true
}, {
    name: "addCursorAboveSkipCurrent",
    exec: function(editor) { editor.selectMoreLines(-1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Up", mac: "Ctrl-Alt-Shift-Up"},
    readonly: true
}, {
    name: "addCursorBelowSkipCurrent",
    exec: function(editor) { editor.selectMoreLines(1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Down", mac: "Ctrl-Alt-Shift-Down"},
    readonly: true
}, {
    name: "selectMoreBefore",
    exec: function(editor) { editor.selectMore(-1); },
    bindKey: {win: "Ctrl-Alt-Left", mac: "Ctrl-Alt-Left"},
    readonly: true
}, {
    name: "selectMoreAfter",
    exec: function(editor) { editor.selectMore(1); },
    bindKey: {win: "Ctrl-Alt-Right", mac: "Ctrl-Alt-Right"},
    readonly: true
}, {
    name: "selectNextBefore",
    exec: function(editor) { editor.selectMore(-1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Left", mac: "Ctrl-Alt-Shift-Left"},
    readonly: true
}, {
    name: "selectNextAfter",
    exec: function(editor) { editor.selectMore(1, true); },
    bindKey: {win: "Ctrl-Alt-Shift-Right", mac: "Ctrl-Alt-Shift-Right"},
    readonly: true
}, {
    name: "splitIntoLines",
    exec: function(editor) { editor.multiSelect.splitIntoLines(); },
    bindKey: {win: "Ctrl-Alt-L", mac: "Ctrl-Alt-L"},
    readonly: true
}, {
    name: "alignCursors",
    exec: function(editor) { editor.alignCursors(); },
    bindKey: {win: "Ctrl-Alt-A", mac: "Ctrl-Alt-A"}
}, {
    name: "findAll",
    exec: function(editor) { editor.findAll(); },
    bindKey: {win: "Ctrl-Alt-K", mac: "Ctrl-Alt-G"},
    readonly: true
}];
exports.multiSelectCommands = [{
    name: "singleSelection",
    bindKey: "esc",
    exec: function(editor) { editor.exitMultiSelectMode(); },
    readonly: true,
    isAvailable: function(editor) {return editor && editor.inMultiSelectMode}
}];

var HashHandler = require("../keyboard/hash_handler").HashHandler;
exports.keyboardHandler = new HashHandler(exports.multiSelectCommands);

});

ace.define("ace/multi_select",["require","exports","module","ace/range_list","ace/range","ace/selection","ace/mouse/multi_select_handler","ace/lib/event","ace/lib/lang","ace/commands/multi_select_commands","ace/search","ace/edit_session","ace/editor","ace/config"], function(require, exports, module) {

var RangeList = require("./range_list").RangeList;
var Range = require("./range").Range;
var Selection = require("./selection").Selection;
var onMouseDown = require("./mouse/multi_select_handler").onMouseDown;
var event = require("./lib/event");
var lang = require("./lib/lang");
var commands = require("./commands/multi_select_commands");
exports.commands = commands.defaultCommands.concat(commands.multiSelectCommands);
var Search = require("./search").Search;
var search = new Search();

function find(session, needle, dir) {
    search.$options.wrap = true;
    search.$options.needle = needle;
    search.$options.backwards = dir == -1;
    return search.find(session);
}
var EditSession = require("./edit_session").EditSession;
(function() {
    this.getSelectionMarkers = function() {
        return this.$selectionMarkers;
    };
}).call(EditSession.prototype);
(function() {
    this.ranges = null;
    this.rangeList = null;
    this.addRange = function(range, $blockChangeEvents) {
        if (!range)
            return;

        if (!this.inMultiSelectMode && this.rangeCount === 0) {
            var oldRange = this.toOrientedRange();
            this.rangeList.add(oldRange);
            this.rangeList.add(range);
            if (this.rangeList.ranges.length != 2) {
                this.rangeList.removeAll();
                return $blockChangeEvents || this.fromOrientedRange(range);
            }
            this.rangeList.removeAll();
            this.rangeList.add(oldRange);
            this.$onAddRange(oldRange);
        }

        if (!range.cursor)
            range.cursor = range.end;

        var removed = this.rangeList.add(range);

        this.$onAddRange(range);

        if (removed.length)
            this.$onRemoveRange(removed);

        if (this.rangeCount > 1 && !this.inMultiSelectMode) {
            this._signal("multiSelect");
            this.inMultiSelectMode = true;
            this.session.$undoSelect = false;
            this.rangeList.attach(this.session);
        }

        return $blockChangeEvents || this.fromOrientedRange(range);
    };

    this.toSingleRange = function(range) {
        range = range || this.ranges[0];
        var removed = this.rangeList.removeAll();
        if (removed.length)
            this.$onRemoveRange(removed);

        range && this.fromOrientedRange(range);
    };
    this.substractPoint = function(pos) {
        var removed = this.rangeList.substractPoint(pos);
        if (removed) {
            this.$onRemoveRange(removed);
            return removed[0];
        }
    };
    this.mergeOverlappingRanges = function() {
        var removed = this.rangeList.merge();
        if (removed.length)
            this.$onRemoveRange(removed);
        else if(this.ranges[0])
            this.fromOrientedRange(this.ranges[0]);
    };

    this.$onAddRange = function(range) {
        this.rangeCount = this.rangeList.ranges.length;
        this.ranges.unshift(range);
        this._signal("addRange", {range: range});
    };

    this.$onRemoveRange = function(removed) {
        this.rangeCount = this.rangeList.ranges.length;
        if (this.rangeCount == 1 && this.inMultiSelectMode) {
            var lastRange = this.rangeList.ranges.pop();
            removed.push(lastRange);
            this.rangeCount = 0;
        }

        for (var i = removed.length; i--; ) {
            var index = this.ranges.indexOf(removed[i]);
            this.ranges.splice(index, 1);
        }

        this._signal("removeRange", {ranges: removed});

        if (this.rangeCount === 0 && this.inMultiSelectMode) {
            this.inMultiSelectMode = false;
            this._signal("singleSelect");
            this.session.$undoSelect = true;
            this.rangeList.detach(this.session);
        }

        lastRange = lastRange || this.ranges[0];
        if (lastRange && !lastRange.isEqual(this.getRange()))
            this.fromOrientedRange(lastRange);
    };
    this.$initRangeList = function() {
        if (this.rangeList)
            return;

        this.rangeList = new RangeList();
        this.ranges = [];
        this.rangeCount = 0;
    };
    this.getAllRanges = function() {
        return this.rangeCount ? this.rangeList.ranges.concat() : [this.getRange()];
    };

    this.splitIntoLines = function () {
        if (this.rangeCount > 1) {
            var ranges = this.rangeList.ranges;
            var lastRange = ranges[ranges.length - 1];
            var range = Range.fromPoints(ranges[0].start, lastRange.end);

            this.toSingleRange();
            this.setSelectionRange(range, lastRange.cursor == lastRange.start);
        } else {
            var range = this.getRange();
            var isBackwards = this.isBackwards();
            var startRow = range.start.row;
            var endRow = range.end.row;
            if (startRow == endRow) {
                if (isBackwards)
                    var start = range.end, end = range.start;
                else
                    var start = range.start, end = range.end;
                
                this.addRange(Range.fromPoints(end, end));
                this.addRange(Range.fromPoints(start, start));
                return;
            }

            var rectSel = [];
            var r = this.getLineRange(startRow, true);
            r.start.column = range.start.column;
            rectSel.push(r);

            for (var i = startRow + 1; i < endRow; i++)
                rectSel.push(this.getLineRange(i, true));

            r = this.getLineRange(endRow, true);
            r.end.column = range.end.column;
            rectSel.push(r);

            rectSel.forEach(this.addRange, this);
        }
    };
    this.toggleBlockSelection = function () {
        if (this.rangeCount > 1) {
            var ranges = this.rangeList.ranges;
            var lastRange = ranges[ranges.length - 1];
            var range = Range.fromPoints(ranges[0].start, lastRange.end);

            this.toSingleRange();
            this.setSelectionRange(range, lastRange.cursor == lastRange.start);
        } else {
            var cursor = this.session.documentToScreenPosition(this.selectionLead);
            var anchor = this.session.documentToScreenPosition(this.selectionAnchor);

            var rectSel = this.rectangularRangeBlock(cursor, anchor);
            rectSel.forEach(this.addRange, this);
        }
    };
    this.rectangularRangeBlock = function(screenCursor, screenAnchor, includeEmptyLines) {
        var rectSel = [];

        var xBackwards = screenCursor.column < screenAnchor.column;
        if (xBackwards) {
            var startColumn = screenCursor.column;
            var endColumn = screenAnchor.column;
        } else {
            var startColumn = screenAnchor.column;
            var endColumn = screenCursor.column;
        }

        var yBackwards = screenCursor.row < screenAnchor.row;
        if (yBackwards) {
            var startRow = screenCursor.row;
            var endRow = screenAnchor.row;
        } else {
            var startRow = screenAnchor.row;
            var endRow = screenCursor.row;
        }

        if (startColumn < 0)
            startColumn = 0;
        if (startRow < 0)
            startRow = 0;

        if (startRow == endRow)
            includeEmptyLines = true;

        for (var row = startRow; row <= endRow; row++) {
            var range = Range.fromPoints(
                this.session.screenToDocumentPosition(row, startColumn),
                this.session.screenToDocumentPosition(row, endColumn)
            );
            if (range.isEmpty()) {
                if (docEnd && isSamePoint(range.end, docEnd))
                    break;
                var docEnd = range.end;
            }
            range.cursor = xBackwards ? range.start : range.end;
            rectSel.push(range);
        }

        if (yBackwards)
            rectSel.reverse();

        if (!includeEmptyLines) {
            var end = rectSel.length - 1;
            while (rectSel[end].isEmpty() && end > 0)
                end--;
            if (end > 0) {
                var start = 0;
                while (rectSel[start].isEmpty())
                    start++;
            }
            for (var i = end; i >= start; i--) {
                if (rectSel[i].isEmpty())
                    rectSel.splice(i, 1);
            }
        }

        return rectSel;
    };
}).call(Selection.prototype);
var Editor = require("./editor").Editor;
(function() {
    this.updateSelectionMarkers = function() {
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };
    this.addSelectionMarker = function(orientedRange) {
        if (!orientedRange.cursor)
            orientedRange.cursor = orientedRange.end;

        var style = this.getSelectionStyle();
        orientedRange.marker = this.session.addMarker(orientedRange, "ace_selection", style);

        this.session.$selectionMarkers.push(orientedRange);
        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
        return orientedRange;
    };
    this.removeSelectionMarker = function(range) {
        if (!range.marker)
            return;
        this.session.removeMarker(range.marker);
        var index = this.session.$selectionMarkers.indexOf(range);
        if (index != -1)
            this.session.$selectionMarkers.splice(index, 1);
        this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
    };

    this.removeSelectionMarkers = function(ranges) {
        var markerList = this.session.$selectionMarkers;
        for (var i = ranges.length; i--; ) {
            var range = ranges[i];
            if (!range.marker)
                continue;
            this.session.removeMarker(range.marker);
            var index = markerList.indexOf(range);
            if (index != -1)
                markerList.splice(index, 1);
        }
        this.session.selectionMarkerCount = markerList.length;
    };

    this.$onAddRange = function(e) {
        this.addSelectionMarker(e.range);
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onRemoveRange = function(e) {
        this.removeSelectionMarkers(e.ranges);
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onMultiSelect = function(e) {
        if (this.inMultiSelectMode)
            return;
        this.inMultiSelectMode = true;

        this.setStyle("ace_multiselect");
        this.keyBinding.addKeyboardHandler(commands.keyboardHandler);
        this.commands.setDefaultHandler("exec", this.$onMultiSelectExec);

        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
    };

    this.$onSingleSelect = function(e) {
        if (this.session.multiSelect.inVirtualMode)
            return;
        this.inMultiSelectMode = false;

        this.unsetStyle("ace_multiselect");
        this.keyBinding.removeKeyboardHandler(commands.keyboardHandler);

        this.commands.removeDefaultHandler("exec", this.$onMultiSelectExec);
        this.renderer.updateCursor();
        this.renderer.updateBackMarkers();
        this._emit("changeSelection");
    };

    this.$onMultiSelectExec = function(e) {
        var command = e.command;
        var editor = e.editor;
        if (!editor.multiSelect)
            return;
        if (!command.multiSelectAction) {
            var result = command.exec(editor, e.args || {});
            editor.multiSelect.addRange(editor.multiSelect.toOrientedRange());
            editor.multiSelect.mergeOverlappingRanges();
        } else if (command.multiSelectAction == "forEach") {
            result = editor.forEachSelection(command, e.args);
        } else if (command.multiSelectAction == "forEachLine") {
            result = editor.forEachSelection(command, e.args, true);
        } else if (command.multiSelectAction == "single") {
            editor.exitMultiSelectMode();
            result = command.exec(editor, e.args || {});
        } else {
            result = command.multiSelectAction(editor, e.args || {});
        }
        return result;
    }; 
    this.forEachSelection = function(cmd, args, options) {
        if (this.inVirtualSelectionMode)
            return;
        var keepOrder = options && options.keepOrder;
        var $byLines = options == true || options && options.$byLines
        var session = this.session;
        var selection = this.selection;
        var rangeList = selection.rangeList;
        var ranges = (keepOrder ? selection : rangeList).ranges;
        var result;
        
        if (!ranges.length)
            return cmd.exec ? cmd.exec(this, args || {}) : cmd(this, args || {});
        
        var reg = selection._eventRegistry;
        selection._eventRegistry = {};

        var tmpSel = new Selection(session);
        this.inVirtualSelectionMode = true;
        for (var i = ranges.length; i--;) {
            if ($byLines) {
                while (i > 0 && ranges[i].start.row == ranges[i - 1].end.row)
                    i--;
            }
            tmpSel.fromOrientedRange(ranges[i]);
            tmpSel.index = i;
            this.selection = session.selection = tmpSel;
            var cmdResult = cmd.exec ? cmd.exec(this, args || {}) : cmd(this, args || {});
            if (!result && cmdResult !== undefined)
                result = cmdResult;
            tmpSel.toOrientedRange(ranges[i]);
        }
        tmpSel.detach();

        this.selection = session.selection = selection;
        this.inVirtualSelectionMode = false;
        selection._eventRegistry = reg;
        selection.mergeOverlappingRanges();
        
        var anim = this.renderer.$scrollAnimation;
        this.onCursorChange();
        this.onSelectionChange();
        if (anim && anim.from == anim.to)
            this.renderer.animateScrolling(anim.from);
        
        return result;
    };
    this.exitMultiSelectMode = function() {
        if (!this.inMultiSelectMode || this.inVirtualSelectionMode)
            return;
        this.multiSelect.toSingleRange();
    };

    this.getSelectedText = function() {
        var text = "";
        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
            var ranges = this.multiSelect.rangeList.ranges;
            var buf = [];
            for (var i = 0; i < ranges.length; i++) {
                buf.push(this.session.getTextRange(ranges[i]));
            }
            var nl = this.session.getDocument().getNewLineCharacter();
            text = buf.join(nl);
            if (text.length == (buf.length - 1) * nl.length)
                text = "";
        } else if (!this.selection.isEmpty()) {
            text = this.session.getTextRange(this.getSelectionRange());
        }
        return text;
    };
    
    this.$checkMultiselectChange = function(e, anchor) {
        if (this.inMultiSelectMode && !this.inVirtualSelectionMode) {
            var range = this.multiSelect.ranges[0];
            if (this.multiSelect.isEmpty() && anchor == this.multiSelect.anchor)
                return;
            var pos = anchor == this.multiSelect.anchor
                ? range.cursor == range.start ? range.end : range.start
                : range.cursor;
            if (!isSamePoint(pos, anchor))
                this.multiSelect.toSingleRange(this.multiSelect.toOrientedRange());
        }
    };
    this.onPaste = function(text) {
        if (this.$readOnly)
            return;


        var e = {text: text};
        this._signal("paste", e);
        text = e.text;
        if (!this.inMultiSelectMode || this.inVirtualSelectionMode)
            return this.insert(text);

        var lines = text.split(/\r\n|\r|\n/);
        var ranges = this.selection.rangeList.ranges;

        if (lines.length > ranges.length || lines.length < 2 || !lines[1])
            return this.commands.exec("insertstring", this, text);

        for (var i = ranges.length; i--;) {
            var range = ranges[i];
            if (!range.isEmpty())
                this.session.remove(range);

            this.session.insert(range.start, lines[i]);
        }
    };
    this.findAll = function(needle, options, additive) {
        options = options || {};
        options.needle = needle || options.needle;
        if (options.needle == undefined) {
            var range = this.selection.isEmpty()
                ? this.selection.getWordRange()
                : this.selection.getRange();
            options.needle = this.session.getTextRange(range);
        }    
        this.$search.set(options);
        
        var ranges = this.$search.findAll(this.session);
        if (!ranges.length)
            return 0;

        this.$blockScrolling += 1;
        var selection = this.multiSelect;

        if (!additive)
            selection.toSingleRange(ranges[0]);

        for (var i = ranges.length; i--; )
            selection.addRange(ranges[i], true);
        if (range && selection.rangeList.rangeAtPoint(range.start))
            selection.addRange(range, true);
        
        this.$blockScrolling -= 1;

        return ranges.length;
    };
    this.selectMoreLines = function(dir, skip) {
        var range = this.selection.toOrientedRange();
        var isBackwards = range.cursor == range.end;

        var screenLead = this.session.documentToScreenPosition(range.cursor);
        if (this.selection.$desiredColumn)
            screenLead.column = this.selection.$desiredColumn;

        var lead = this.session.screenToDocumentPosition(screenLead.row + dir, screenLead.column);

        if (!range.isEmpty()) {
            var screenAnchor = this.session.documentToScreenPosition(isBackwards ? range.end : range.start);
            var anchor = this.session.screenToDocumentPosition(screenAnchor.row + dir, screenAnchor.column);
        } else {
            var anchor = lead;
        }

        if (isBackwards) {
            var newRange = Range.fromPoints(lead, anchor);
            newRange.cursor = newRange.start;
        } else {
            var newRange = Range.fromPoints(anchor, lead);
            newRange.cursor = newRange.end;
        }

        newRange.desiredColumn = screenLead.column;
        if (!this.selection.inMultiSelectMode) {
            this.selection.addRange(range);
        } else {
            if (skip)
                var toRemove = range.cursor;
        }

        this.selection.addRange(newRange);
        if (toRemove)
            this.selection.substractPoint(toRemove);
    };
    this.transposeSelections = function(dir) {
        var session = this.session;
        var sel = session.multiSelect;
        var all = sel.ranges;

        for (var i = all.length; i--; ) {
            var range = all[i];
            if (range.isEmpty()) {
                var tmp = session.getWordRange(range.start.row, range.start.column);
                range.start.row = tmp.start.row;
                range.start.column = tmp.start.column;
                range.end.row = tmp.end.row;
                range.end.column = tmp.end.column;
            }
        }
        sel.mergeOverlappingRanges();

        var words = [];
        for (var i = all.length; i--; ) {
            var range = all[i];
            words.unshift(session.getTextRange(range));
        }

        if (dir < 0)
            words.unshift(words.pop());
        else
            words.push(words.shift());

        for (var i = all.length; i--; ) {
            var range = all[i];
            var tmp = range.clone();
            session.replace(range, words[i]);
            range.start.row = tmp.start.row;
            range.start.column = tmp.start.column;
        }
    };
    this.selectMore = function(dir, skip, stopAtFirst) {
        var session = this.session;
        var sel = session.multiSelect;

        var range = sel.toOrientedRange();
        if (range.isEmpty()) {
            range = session.getWordRange(range.start.row, range.start.column);
            range.cursor = dir == -1 ? range.start : range.end;
            this.multiSelect.addRange(range);
            if (stopAtFirst)
                return;
        }
        var needle = session.getTextRange(range);

        var newRange = find(session, needle, dir);
        if (newRange) {
            newRange.cursor = dir == -1 ? newRange.start : newRange.end;
            this.$blockScrolling += 1;
            this.session.unfold(newRange);
            this.multiSelect.addRange(newRange);
            this.$blockScrolling -= 1;
            this.renderer.scrollCursorIntoView(null, 0.5);
        }
        if (skip)
            this.multiSelect.substractPoint(range.cursor);
    };
    this.alignCursors = function() {
        var session = this.session;
        var sel = session.multiSelect;
        var ranges = sel.ranges;
        var row = -1;
        var sameRowRanges = ranges.filter(function(r) {
            if (r.cursor.row == row)
                return true;
            row = r.cursor.row;
        });
        
        if (!ranges.length || sameRowRanges.length == ranges.length - 1) {
            var range = this.selection.getRange();
            var fr = range.start.row, lr = range.end.row;
            var guessRange = fr == lr;
            if (guessRange) {
                var max = this.session.getLength();
                var line;
                do {
                    line = this.session.getLine(lr);
                } while (/[=:]/.test(line) && ++lr < max);
                do {
                    line = this.session.getLine(fr);
                } while (/[=:]/.test(line) && --fr > 0);
                
                if (fr < 0) fr = 0;
                if (lr >= max) lr = max - 1;
            }
            var lines = this.session.doc.removeLines(fr, lr);
            lines = this.$reAlignText(lines, guessRange);
            this.session.doc.insert({row: fr, column: 0}, lines.join("\n") + "\n");
            if (!guessRange) {
                range.start.column = 0;
                range.end.column = lines[lines.length - 1].length;
            }
            this.selection.setRange(range);
        } else {
            sameRowRanges.forEach(function(r) {
                sel.substractPoint(r.cursor);
            });

            var maxCol = 0;
            var minSpace = Infinity;
            var spaceOffsets = ranges.map(function(r) {
                var p = r.cursor;
                var line = session.getLine(p.row);
                var spaceOffset = line.substr(p.column).search(/\S/g);
                if (spaceOffset == -1)
                    spaceOffset = 0;

                if (p.column > maxCol)
                    maxCol = p.column;
                if (spaceOffset < minSpace)
                    minSpace = spaceOffset;
                return spaceOffset;
            });
            ranges.forEach(function(r, i) {
                var p = r.cursor;
                var l = maxCol - p.column;
                var d = spaceOffsets[i] - minSpace;
                if (l > d)
                    session.insert(p, lang.stringRepeat(" ", l - d));
                else
                    session.remove(new Range(p.row, p.column, p.row, p.column - l + d));

                r.start.column = r.end.column = maxCol;
                r.start.row = r.end.row = p.row;
                r.cursor = r.end;
            });
            sel.fromOrientedRange(ranges[0]);
            this.renderer.updateCursor();
            this.renderer.updateBackMarkers();
        }
    };

    this.$reAlignText = function(lines, forceLeft) {
        var isLeftAligned = true, isRightAligned = true;
        var startW, textW, endW;

        return lines.map(function(line) {
            var m = line.match(/(\s*)(.*?)(\s*)([=:].*)/);
            if (!m)
                return [line];

            if (startW == null) {
                startW = m[1].length;
                textW = m[2].length;
                endW = m[3].length;
                return m;
            }

            if (startW + textW + endW != m[1].length + m[2].length + m[3].length)
                isRightAligned = false;
            if (startW != m[1].length)
                isLeftAligned = false;

            if (startW > m[1].length)
                startW = m[1].length;
            if (textW < m[2].length)
                textW = m[2].length;
            if (endW > m[3].length)
                endW = m[3].length;

            return m;
        }).map(forceLeft ? alignLeft :
            isLeftAligned ? isRightAligned ? alignRight : alignLeft : unAlign);

        function spaces(n) {
            return lang.stringRepeat(" ", n);
        }

        function alignLeft(m) {
            return !m[2] ? m[0] : spaces(startW) + m[2]
                + spaces(textW - m[2].length + endW)
                + m[4].replace(/^([=:])\s+/, "$1 ");
        }
        function alignRight(m) {
            return !m[2] ? m[0] : spaces(startW + textW - m[2].length) + m[2]
                + spaces(endW, " ")
                + m[4].replace(/^([=:])\s+/, "$1 ");
        }
        function unAlign(m) {
            return !m[2] ? m[0] : spaces(startW) + m[2]
                + spaces(endW)
                + m[4].replace(/^([=:])\s+/, "$1 ");
        }
    };
}).call(Editor.prototype);


function isSamePoint(p1, p2) {
    return p1.row == p2.row && p1.column == p2.column;
}
exports.onSessionChange = function(e) {
    var session = e.session;
    if (session && !session.multiSelect) {
        session.$selectionMarkers = [];
        session.selection.$initRangeList();
        session.multiSelect = session.selection;
    }
    this.multiSelect = session && session.multiSelect;

    var oldSession = e.oldSession;
    if (oldSession) {
        oldSession.multiSelect.off("addRange", this.$onAddRange);
        oldSession.multiSelect.off("removeRange", this.$onRemoveRange);
        oldSession.multiSelect.off("multiSelect", this.$onMultiSelect);
        oldSession.multiSelect.off("singleSelect", this.$onSingleSelect);
        oldSession.multiSelect.lead.off("change",  this.$checkMultiselectChange);
        oldSession.multiSelect.anchor.off("change",  this.$checkMultiselectChange);
    }

    if (session) {
        session.multiSelect.on("addRange", this.$onAddRange);
        session.multiSelect.on("removeRange", this.$onRemoveRange);
        session.multiSelect.on("multiSelect", this.$onMultiSelect);
        session.multiSelect.on("singleSelect", this.$onSingleSelect);
        session.multiSelect.lead.on("change",  this.$checkMultiselectChange);
        session.multiSelect.anchor.on("change",  this.$checkMultiselectChange);
    }

    if (session && this.inMultiSelectMode != session.selection.inMultiSelectMode) {
        if (session.selection.inMultiSelectMode)
            this.$onMultiSelect();
        else
            this.$onSingleSelect();
    }
};
function MultiSelect(editor) {
    if (editor.$multiselectOnSessionChange)
        return;
    editor.$onAddRange = editor.$onAddRange.bind(editor);
    editor.$onRemoveRange = editor.$onRemoveRange.bind(editor);
    editor.$onMultiSelect = editor.$onMultiSelect.bind(editor);
    editor.$onSingleSelect = editor.$onSingleSelect.bind(editor);
    editor.$multiselectOnSessionChange = exports.onSessionChange.bind(editor);
    editor.$checkMultiselectChange = editor.$checkMultiselectChange.bind(editor);

    editor.$multiselectOnSessionChange(editor);
    editor.on("changeSession", editor.$multiselectOnSessionChange);

    editor.on("mousedown", onMouseDown);
    editor.commands.addCommands(commands.defaultCommands);

    addAltCursorListeners(editor);
}

function addAltCursorListeners(editor){
    var el = editor.textInput.getElement();
    var altCursor = false;
    event.addListener(el, "keydown", function(e) {
        if (e.keyCode == 18 && !(e.ctrlKey || e.shiftKey || e.metaKey)) {
            if (!altCursor) {
                editor.renderer.setMouseCursor("crosshair");
                altCursor = true;
            }
        } else if (altCursor) {
            reset();
        }
    });

    event.addListener(el, "keyup", reset);
    event.addListener(el, "blur", reset);
    function reset(e) {
        if (altCursor) {
            editor.renderer.setMouseCursor("");
            altCursor = false;
        }
    }
}

exports.MultiSelect = MultiSelect;


require("./config").defineOptions(Editor.prototype, "editor", {
    enableMultiselect: {
        set: function(val) {
            MultiSelect(this);
            if (val) {
                this.on("changeSession", this.$multiselectOnSessionChange);
                this.on("mousedown", onMouseDown);
            } else {
                this.off("changeSession", this.$multiselectOnSessionChange);
                this.off("mousedown", onMouseDown);
            }
        },
        value: true
    }
});



});

ace.define("ace/mode/folding/fold_mode",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../../range").Range;

var FoldMode = exports.FoldMode = function() {};

(function() {

    this.foldingStartMarker = null;
    this.foldingStopMarker = null;
    this.getFoldWidget = function(session, foldStyle, row) {
        var line = session.getLine(row);
        if (this.foldingStartMarker.test(line))
            return "start";
        if (foldStyle == "markbeginend"
                && this.foldingStopMarker
                && this.foldingStopMarker.test(line))
            return "end";
        return "";
    };

    this.getFoldWidgetRange = function(session, foldStyle, row) {
        return null;
    };

    this.indentationBlock = function(session, row, column) {
        var re = /\S/;
        var line = session.getLine(row);
        var startLevel = line.search(re);
        if (startLevel == -1)
            return;

        var startColumn = column || line.length;
        var maxRow = session.getLength();
        var startRow = row;
        var endRow = row;

        while (++row < maxRow) {
            var level = session.getLine(row).search(re);

            if (level == -1)
                continue;

            if (level <= startLevel)
                break;

            endRow = row;
        }

        if (endRow > startRow) {
            var endColumn = session.getLine(endRow).length;
            return new Range(startRow, startColumn, endRow, endColumn);
        }
    };

    this.openingBracketBlock = function(session, bracket, row, column, typeRe) {
        var start = {row: row, column: column + 1};
        var end = session.$findClosingBracket(bracket, start, typeRe);
        if (!end)
            return;

        var fw = session.foldWidgets[end.row];
        if (fw == null)
            fw = session.getFoldWidget(end.row);

        if (fw == "start" && end.row > start.row) {
            end.row --;
            end.column = session.getLine(end.row).length;
        }
        return Range.fromPoints(start, end);
    };

    this.closingBracketBlock = function(session, bracket, row, column, typeRe) {
        var end = {row: row, column: column};
        var start = session.$findOpeningBracket(bracket, end);

        if (!start)
            return;

        start.column++;
        end.column--;

        return  Range.fromPoints(start, end);
    };
}).call(FoldMode.prototype);

});

ace.define("ace/theme/textmate",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
"use strict";

exports.isDark = false;
exports.cssClass = "ace-tm";
exports.cssText = ".ace-tm .ace_gutter {\
background: #f0f0f0;\
color: #333;\
}\
.ace-tm .ace_print-margin {\
width: 1px;\
background: #e8e8e8;\
}\
.ace-tm .ace_fold {\
background-color: #6B72E6;\
}\
.ace-tm {\
background-color: #FFFFFF;\
color: black;\
}\
.ace-tm .ace_cursor {\
color: black;\
}\
.ace-tm .ace_invisible {\
color: rgb(191, 191, 191);\
}\
.ace-tm .ace_storage,\
.ace-tm .ace_keyword {\
color: blue;\
}\
.ace-tm .ace_constant {\
color: rgb(197, 6, 11);\
}\
.ace-tm .ace_constant.ace_buildin {\
color: rgb(88, 72, 246);\
}\
.ace-tm .ace_constant.ace_language {\
color: rgb(88, 92, 246);\
}\
.ace-tm .ace_constant.ace_library {\
color: rgb(6, 150, 14);\
}\
.ace-tm .ace_invalid {\
background-color: rgba(255, 0, 0, 0.1);\
color: red;\
}\
.ace-tm .ace_support.ace_function {\
color: rgb(60, 76, 114);\
}\
.ace-tm .ace_support.ace_constant {\
color: rgb(6, 150, 14);\
}\
.ace-tm .ace_support.ace_type,\
.ace-tm .ace_support.ace_class {\
color: rgb(109, 121, 222);\
}\
.ace-tm .ace_keyword.ace_operator {\
color: rgb(104, 118, 135);\
}\
.ace-tm .ace_string {\
color: rgb(3, 106, 7);\
}\
.ace-tm .ace_comment {\
color: rgb(76, 136, 107);\
}\
.ace-tm .ace_comment.ace_doc {\
color: rgb(0, 102, 255);\
}\
.ace-tm .ace_comment.ace_doc.ace_tag {\
color: rgb(128, 159, 191);\
}\
.ace-tm .ace_constant.ace_numeric {\
color: rgb(0, 0, 205);\
}\
.ace-tm .ace_variable {\
color: rgb(49, 132, 149);\
}\
.ace-tm .ace_xml-pe {\
color: rgb(104, 104, 91);\
}\
.ace-tm .ace_entity.ace_name.ace_function {\
color: #0000A2;\
}\
.ace-tm .ace_heading {\
color: rgb(12, 7, 255);\
}\
.ace-tm .ace_list {\
color:rgb(185, 6, 144);\
}\
.ace-tm .ace_meta.ace_tag {\
color:rgb(0, 22, 142);\
}\
.ace-tm .ace_string.ace_regex {\
color: rgb(255, 0, 0)\
}\
.ace-tm .ace_marker-layer .ace_selection {\
background: rgb(181, 213, 255);\
}\
.ace-tm.ace_multiselect .ace_selection.ace_start {\
box-shadow: 0 0 3px 0px white;\
}\
.ace-tm .ace_marker-layer .ace_step {\
background: rgb(252, 255, 0);\
}\
.ace-tm .ace_marker-layer .ace_stack {\
background: rgb(164, 229, 101);\
}\
.ace-tm .ace_marker-layer .ace_bracket {\
margin: -1px 0 0 -1px;\
border: 1px solid rgb(192, 192, 192);\
}\
.ace-tm .ace_marker-layer .ace_active-line {\
background: rgba(0, 0, 0, 0.07);\
}\
.ace-tm .ace_gutter-active-line {\
background-color : #dcdcdc;\
}\
.ace-tm .ace_marker-layer .ace_selected-word {\
background: rgb(250, 250, 255);\
border: 1px solid rgb(200, 200, 250);\
}\
.ace-tm .ace_indent-guide {\
background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;\
}\
";

var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});

ace.define("ace/line_widgets",["require","exports","module","ace/lib/oop","ace/lib/dom","ace/range"], function(require, exports, module) {
"use strict";

var oop = require("./lib/oop");
var dom = require("./lib/dom");
var Range = require("./range").Range;


function LineWidgets(session) {
    this.session = session;
    this.session.widgetManager = this;
    this.session.getRowLength = this.getRowLength;
    this.session.$getWidgetScreenLength = this.$getWidgetScreenLength;
    this.updateOnChange = this.updateOnChange.bind(this);
    this.renderWidgets = this.renderWidgets.bind(this);
    this.measureWidgets = this.measureWidgets.bind(this);
    this.session._changedWidgets = [];
    this.detach = this.detach.bind(this);
    
    this.session.on("change", this.updateOnChange);
}

(function() {
    this.getRowLength = function(row) {
        var h;
        if (this.lineWidgets)
            h = this.lineWidgets[row] && this.lineWidgets[row].rowCount || 0;
        else 
            h = 0;
        if (!this.$useWrapMode || !this.$wrapData[row]) {
            return 1 + h;
        } else {
            return this.$wrapData[row].length + 1 + h;
        }
    };

    this.$getWidgetScreenLength = function() {
        var screenRows = 0;
        this.lineWidgets.forEach(function(w){
            if (w && w.rowCount)
                screenRows +=w.rowCount;
        });
        return screenRows;
    };    
    
    this.attach = function(editor) {
        if (editor.widgetManager && editor.widgetManager != this)
            editor.widgetManager.detach();

        if (this.editor == editor)
            return;

        this.detach();
        this.editor = editor;
        
        this.editor.on("changeSession", this.detach);
        
        editor.widgetManager = this;

        editor.renderer.on("beforeRender", this.measureWidgets);
        editor.renderer.on("afterRender", this.renderWidgets);
    };
    this.detach = function(e) {
        if (e && e.session == this.session)
            return; // sometimes attach can be called before setSession
        var editor = this.editor;
        if (!editor)
            return;

        editor.off("changeSession", this.detach);
        
        this.editor = null;
        editor.widgetManager = null;
        
        editor.renderer.off("beforeRender", this.measureWidgets);
        editor.renderer.off("afterRender", this.renderWidgets);
        var lineWidgets = this.session.lineWidgets;
        lineWidgets && lineWidgets.forEach(function(w) {
            if (w && w.el && w.el.parentNode) {
                w._inDocument = false;
                w.el.parentNode.removeChild(w.el);
            }
        });
    };

    this.updateOnChange = function(e) {
        var lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) return;
            
        var delta = e.data;
        var range = delta.range;
        var startRow = range.start.row;
        var len = range.end.row - startRow;

        if (len === 0) {
        } else if (delta.action == "removeText" || delta.action == "removeLines") {
            var removed = lineWidgets.splice(startRow + 1, len);
            removed.forEach(function(w) {
                w && this.removeLineWidget(w);
            }, this);
            this.$updateRows();
        } else {
            var args = new Array(len);
            args.unshift(startRow, 0);
            lineWidgets.splice.apply(lineWidgets, args);
            this.$updateRows();
        }
    };
    
    this.$updateRows = function() {
        var lineWidgets = this.session.lineWidgets;
        if (!lineWidgets) return;
        var noWidgets = true;
        lineWidgets.forEach(function(w, i) {
            if (w) {
                noWidgets = false;
                w.row = i;
            }
        });
        if (noWidgets)
            this.session.lineWidgets = null;
    };

    this.addLineWidget = function(w) {
        if (!this.session.lineWidgets)
            this.session.lineWidgets = new Array(this.session.getLength());
        
        this.session.lineWidgets[w.row] = w;
        
        var renderer = this.editor.renderer;
        if (w.html && !w.el) {
            w.el = dom.createElement("div");
            w.el.innerHTML = w.html;
        }
        if (w.el) {
            dom.addCssClass(w.el, "ace_lineWidgetContainer");
            w.el.style.position = "absolute";
            w.el.style.zIndex = 5;
            renderer.container.appendChild(w.el);
            w._inDocument = true;
        }
        
        if (!w.coverGutter) {
            w.el.style.zIndex = 3;
        }
        if (!w.pixelHeight) {
            w.pixelHeight = w.el.offsetHeight;
        }
        if (w.rowCount == null)
            w.rowCount = w.pixelHeight / renderer.layerConfig.lineHeight;
        
        this.session._emit("changeFold", {data:{start:{row: w.row}}});
        
        this.$updateRows();
        this.renderWidgets(null, renderer);
        return w;
    };
    
    this.removeLineWidget = function(w) {
        w._inDocument = false;
        if (w.el && w.el.parentNode)
            w.el.parentNode.removeChild(w.el);
        if (w.editor && w.editor.destroy) try {
            w.editor.destroy();
        } catch(e){}
        if (this.session.lineWidgets)
            this.session.lineWidgets[w.row] = undefined;
        this.session._emit("changeFold", {data:{start:{row: w.row}}});
        this.$updateRows();
    };
    
    this.onWidgetChanged = function(w) {
        this.session._changedWidgets.push(w);
        this.editor && this.editor.renderer.updateFull();
    };
    
    this.measureWidgets = function(e, renderer) {
        var changedWidgets = this.session._changedWidgets;
        var config = renderer.layerConfig;
        
        if (!changedWidgets || !changedWidgets.length) return;
        var min = Infinity;
        for (var i = 0; i < changedWidgets.length; i++) {
            var w = changedWidgets[i];
            if (!w._inDocument) {
                w._inDocument = true;
                renderer.container.appendChild(w.el);
            }
            
            w.h = w.el.offsetHeight;
            
            if (!w.fixedWidth) {
                w.w = w.el.offsetWidth;
                w.screenWidth = Math.ceil(w.w / config.characterWidth);
            }
            
            var rowCount = w.h / config.lineHeight;
            if (w.coverLine) {
                rowCount -= this.session.getRowLineCount(w.row);
                if (rowCount < 0)
                    rowCount = 0;
            }
            if (w.rowCount != rowCount) {
                w.rowCount = rowCount;
                if (w.row < min)
                    min = w.row;
            }
        }
        if (min != Infinity) {
            this.session._emit("changeFold", {data:{start:{row: min}}});
            this.session.lineWidgetWidth = null;
        }
        this.session._changedWidgets = [];
    };
    
    this.renderWidgets = function(e, renderer) {
        var config = renderer.layerConfig;
        var lineWidgets = this.session.lineWidgets;
        if (!lineWidgets)
            return;
        var first = Math.min(this.firstRow, config.firstRow);
        var last = Math.max(this.lastRow, config.lastRow, lineWidgets.length);
        
        while (first > 0 && !lineWidgets[first])
            first--;
        
        this.firstRow = config.firstRow;
        this.lastRow = config.lastRow;

        renderer.$cursorLayer.config = config;
        for (var i = first; i <= last; i++) {
            var w = lineWidgets[i];
            if (!w || !w.el) continue;

            if (!w._inDocument) {
                w._inDocument = true;
                renderer.container.appendChild(w.el);
            }
            var top = renderer.$cursorLayer.getPixelPosition({row: i, column:0}, true).top;
            if (!w.coverLine)
                top += config.lineHeight * this.session.getRowLineCount(w.row);
            w.el.style.top = top - config.offset + "px";
            
            var left = w.coverGutter ? 0 : renderer.gutterWidth;
            if (!w.fixedWidth)
                left -= renderer.scrollLeft;
            w.el.style.left = left + "px";

            if (w.fixedWidth) {
                w.el.style.right = renderer.scrollBar.getWidth() + "px";
            } else {
                w.el.style.right = "";
            }
        }
    };
    
}).call(LineWidgets.prototype);


exports.LineWidgets = LineWidgets;

});

ace.define("ace/ext/error_marker",["require","exports","module","ace/line_widgets","ace/lib/dom","ace/range"], function(require, exports, module) {
"use strict";
var LineWidgets = require("ace/line_widgets").LineWidgets;
var dom = require("ace/lib/dom");
var Range = require("ace/range").Range;

function binarySearch(array, needle, comparator) {
    var first = 0;
    var last = array.length - 1;

    while (first <= last) {
        var mid = (first + last) >> 1;
        var c = comparator(needle, array[mid]);
        if (c > 0)
            first = mid + 1;
        else if (c < 0)
            last = mid - 1;
        else
            return mid;
    }
    return -(first + 1);
}

function findAnnotations(session, row, dir) {
    var annotations = session.getAnnotations().sort(Range.comparePoints);
    if (!annotations.length)
        return;
    
    var i = binarySearch(annotations, {row: row, column: -1}, Range.comparePoints);
    if (i < 0)
        i = -i - 1;
    
    if (i >= annotations.length - 1)
        i = dir > 0 ? 0 : annotations.length - 1;
    else if (i === 0 && dir < 0)
        i = annotations.length - 1;
    
    var annotation = annotations[i];
    if (!annotation || !dir)
        return;

    if (annotation.row === row) {
        do {
            annotation = annotations[i += dir];
        } while (annotation && annotation.row === row);
        if (!annotation)
            return annotations.slice();
    }
    
    
    var matched = [];
    row = annotation.row;
    do {
        matched[dir < 0 ? "unshift" : "push"](annotation);
        annotation = annotations[i += dir];
    } while (annotation && annotation.row == row);
    return matched.length && matched;
}

exports.showErrorMarker = function(editor, dir) {
    var session = editor.session;
    if (!session.widgetManager) {
        session.widgetManager = new LineWidgets(session);
        session.widgetManager.attach(editor);
    }
    
    var pos = editor.getCursorPosition();
    var row = pos.row;
    var oldWidget = session.lineWidgets && session.lineWidgets[row];
    if (oldWidget) {
        oldWidget.destroy();
    } else {
        row -= dir;
    }
    var annotations = findAnnotations(session, row, dir);
    var gutterAnno;
    if (annotations) {
        var annotation = annotations[0];
        pos.column = (annotation.pos && typeof annotation.column != "number"
            ? annotation.pos.sc
            : annotation.column) || 0;
        pos.row = annotation.row;
        gutterAnno = editor.renderer.$gutterLayer.$annotations[pos.row];
    } else if (oldWidget) {
        return;
    } else {
        gutterAnno = {
            text: ["Looks good!"],
            className: "ace_ok"
        };
    }
    editor.session.unfold(pos.row);
    editor.selection.moveToPosition(pos);
    
    var w = {
        row: pos.row, 
        fixedWidth: true,
        coverGutter: true,
        el: dom.createElement("div")
    };
    var el = w.el.appendChild(dom.createElement("div"));
    var arrow = w.el.appendChild(dom.createElement("div"));
    arrow.className = "error_widget_arrow " + gutterAnno.className;
    
    var left = editor.renderer.$cursorLayer
        .getPixelPosition(pos).left;
    arrow.style.left = left + editor.renderer.gutterWidth - 5 + "px";
    
    w.el.className = "error_widget_wrapper";
    el.className = "error_widget " + gutterAnno.className;
    el.innerHTML = gutterAnno.text.join("<br>");
    
    el.appendChild(dom.createElement("div"));
    
    var kb = function(_, hashId, keyString) {
        if (hashId === 0 && (keyString === "esc" || keyString === "return")) {
            w.destroy();
            return {command: "null"};
        }
    };
    
    w.destroy = function() {
        if (editor.$mouseHandler.isMousePressed)
            return;
        editor.keyBinding.removeKeyboardHandler(kb);
        session.widgetManager.removeLineWidget(w);
        editor.off("changeSelection", w.destroy);
        editor.off("changeSession", w.destroy);
        editor.off("mouseup", w.destroy);
        editor.off("change", w.destroy);
    };
    
    editor.keyBinding.addKeyboardHandler(kb);
    editor.on("changeSelection", w.destroy);
    editor.on("changeSession", w.destroy);
    editor.on("mouseup", w.destroy);
    editor.on("change", w.destroy);
    
    editor.session.widgetManager.addLineWidget(w);
    
    w.el.onmousedown = editor.focus.bind(editor);
    
    editor.renderer.scrollCursorIntoView(null, 0.5, {bottom: w.el.offsetHeight});
};


dom.importCssString("\
    .error_widget_wrapper {\
        background: inherit;\
        color: inherit;\
        border:none\
    }\
    .error_widget {\
        border-top: solid 2px;\
        border-bottom: solid 2px;\
        margin: 5px 0;\
        padding: 10px 40px;\
        white-space: pre-wrap;\
    }\
    .error_widget.ace_error, .error_widget_arrow.ace_error{\
        border-color: #ff5a5a\
    }\
    .error_widget.ace_warning, .error_widget_arrow.ace_warning{\
        border-color: #F1D817\
    }\
    .error_widget.ace_info, .error_widget_arrow.ace_info{\
        border-color: #5a5a5a\
    }\
    .error_widget.ace_ok, .error_widget_arrow.ace_ok{\
        border-color: #5aaa5a\
    }\
    .error_widget_arrow {\
        position: absolute;\
        border: solid 5px;\
        border-top-color: transparent!important;\
        border-right-color: transparent!important;\
        border-left-color: transparent!important;\
        top: -5px;\
    }\
", "");

});

ace.define("ace/ace",["require","exports","module","ace/lib/fixoldbrowsers","ace/lib/dom","ace/lib/event","ace/deuce","ace/editor","ace/edit_session","ace/undomanager","ace/virtual_renderer","ace/workspace/workspace","ace/config","ace/worker/worker_client","ace/keyboard/hash_handler","ace/placeholder","ace/multi_select","ace/mode/folding/fold_mode","ace/theme/textmate","ace/ext/error_marker"], function(require, exports, module) {
"no use strict";
require("./lib/fixoldbrowsers");

var dom = require("./lib/dom");
var event = require("./lib/event");

var deuce = require('./deuce');
var edm = require("./editor");
var esm = require("./edit_session");
var undo = require("./undomanager");
var vrm = require("./virtual_renderer");
var wsm = require("./workspace/workspace");
var cfg = require('./config');
require("./worker/worker_client");
require("./keyboard/hash_handler");
require("./placeholder");
require("./multi_select");
require("./mode/folding/fold_mode");
require("./theme/textmate");
require("./ext/error_marker");

exports.config = cfg;
function edit(source, workspace) {
    var element;
    if (typeof source === 'string') {
        var id = source;
        element = document.getElementById(id);
        if (!element) {
            throw new Error("edit can't find div #" + id);
        }
    } else {
        element = source;
    }

    if (element && element['env'] && element['env'].editor instanceof edm.Editor) {
        return element['env'].editor;
    }

    var value = "";
    if (element && /input|textarea/i.test(element.tagName)) {
        var oldNode = element;
        value = oldNode.value;
        element = document.createElement("pre");
        oldNode.parentNode.replaceChild(element, oldNode);
    } else {
        value = dom.getInnerText(element);
        element.innerHTML = '';
    }

    var editSession = exports.createEditSession(value);

    var editor = new edm.Editor(new vrm.VirtualRenderer(element));
    editor.setSession(editSession);
    var env = {
        document: editSession,
        editor: editor,
        onResize: editor.resize.bind(editor, null)
    };

    if (oldNode)
        env['textarea'] = oldNode;
    event.addListener(window, "resize", env.onResize);
    editor.on("destroy", function () {
        event.removeListener(window, "resize", env.onResize);
        env.editor.container['env'] = null; // prevent memory leak on old ie
    });
    editor.container['env'] = editor['env'] = env;
    return deuce.wrap(editor, element, workspace, document);
}
exports.edit = edit;
;
function workspace() {
    return wsm.workspace();
}
exports.workspace = workspace;
;
function createEditSession(text, mode) {
    var doc = new esm.EditSession(text, mode);
    doc.setUndoManager(new undo.UndoManager());
    return doc;
}
exports.createEditSession = createEditSession;
;

exports.EditSession = esm.EditSession;

exports.UndoManager = undo.UndoManager;
});
;
            (function() {
                ace.require(["ace/ace"], function(a) {
                    a && a.config.init(true);
                    if (!window.ace)
                        window.ace = a;
                    for (var key in a) if (a.hasOwnProperty(key))
                        window.ace[key] = a[key];
                });
            })();
        