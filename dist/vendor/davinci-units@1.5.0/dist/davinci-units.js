(function(global, define) {
  var globalDefine = global.define;
/**
 * @license almond 0.3.3 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    //Creates a parts array for a relName where first part is plugin ID,
    //second part is resource ID. Assumes relName has already been normalized.
    function makeRelParts(relName) {
        return relName ? splitPrefix(relName) : [];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relParts) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0],
            relResourceName = relParts[1];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relResourceName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relResourceName));
            } else {
                name = normalize(name, relResourceName);
            }
        } else {
            name = normalize(name, relResourceName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i, relParts,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;
        relParts = makeRelParts(relName);

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relParts);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, makeRelParts(callback)).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../bower_components/almond/almond", function(){});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-units/math/BigInteger',["require", "exports"], function (require, exports) {
    "use strict";
    var BASE = 1e7;
    var LOG_BASE = 7;
    var MAX_INT = 9007199254740992;
    var MAX_INT_ARR = smallToArray(MAX_INT);
    var LOG_MAX_INT = Math.log(MAX_INT);
    var parseBase = function (text, base) {
        var val = Integer[0];
        var pow = Integer[1];
        var length = text.length;
        if (2 <= base && base <= 36) {
            if (length <= LOG_MAX_INT / Math.log(base)) {
                return new SmallInteger(parseInt(text, base));
            }
        }
        var baseParsed = parseValue(base);
        var digits = [];
        var isNegative = text[0] === "-";
        for (var i_1 = isNegative ? 1 : 0; i_1 < text.length; i_1++) {
            var c = text[i_1].toLowerCase(), charCode = c.charCodeAt(0);
            if (48 <= charCode && charCode <= 57)
                digits.push(parseValue(c));
            else if (97 <= charCode && charCode <= 122)
                digits.push(parseValue(c.charCodeAt(0) - 87));
            else if (c === "<") {
                var start = i_1;
                do {
                    i_1++;
                } while (text[i_1] !== ">");
                digits.push(parseValue(text.slice(start + 1, i_1)));
            }
            else
                throw new Error(c + " is not a valid character");
        }
        digits.reverse();
        for (var i_2 = 0; i_2 < digits.length; i_2++) {
            val = val.add(digits[i_2].times(pow));
            pow = pow.times(baseParsed);
        }
        return isNegative ? val.negate() : val;
    };
    var powersOfTwo = [1];
    while (powersOfTwo[powersOfTwo.length - 1] <= BASE) {
        powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
    }
    var powers2Length = powersOfTwo.length;
    var highestPower2 = powersOfTwo[powers2Length - 1];
    var Integer = (function () {
        function Integer(v, radix) {
            if (typeof v === "undefined")
                return Integer[0];
            if (typeof radix !== "undefined")
                return +radix === 10 ? parseValue(v) : parseBase(v, radix);
            return parseValue(v);
        }
        Integer.prototype.add = function (v) {
            throw new Error();
        };
        Integer.prototype.plus = function (v) {
            throw new Error();
        };
        Integer.prototype.subtract = function (v) {
            throw new Error();
        };
        Integer.prototype.isPositive = function () {
            throw new Error();
        };
        Integer.prototype.isNegative = function () {
            throw new Error();
        };
        Integer.prototype.isUnit = function () {
            throw new Error();
        };
        Integer.prototype.isOdd = function () {
            throw new Error();
        };
        Integer.prototype.divmod = function (v) {
            var result = divModAny(this, v);
            return {
                quotient: result[0],
                remainder: result[1]
            };
        };
        Integer.prototype.divide = function (v) {
            return divModAny(this, v)[0];
        };
        Integer.prototype.over = function (v) {
            return this.divide(v);
        };
        Integer.prototype.mod = function (v) {
            return divModAny(this, v)[1];
        };
        Integer.prototype.remainder = function (v) {
            return this.mod(v);
        };
        Integer.prototype.pow = function (v) {
            var n = parseValue(v);
            var a = this['value'];
            var b = n['value'];
            var value;
            if (b === 0)
                return Integer[1];
            if (a === 0)
                return Integer[0];
            if (a === 1)
                return Integer[1];
            if (a === -1)
                return n.isEven() ? Integer[1] : Integer[-1];
            if (n.sign) {
                return Integer[0];
            }
            if (!n.isSmall)
                throw new Error("The exponent " + n.toString() + " is too large.");
            if (this.isSmall) {
                if (isPrecise(value = Math.pow(a, b)))
                    return new SmallInteger(truncate(value));
            }
            var x = this;
            var y = Integer[1];
            while (true) {
                if ((b & 1) === 1) {
                    y = y.times(x);
                    --b;
                }
                if (b === 0)
                    break;
                b /= 2;
                x = x.square();
            }
            return y;
        };
        Integer.prototype.modPow = function (expIn, modIn) {
            var exp = parseValue(expIn);
            var mod = parseValue(modIn);
            if (mod.isZero())
                throw new Error("Cannot take modPow with modulus 0");
            var r = Integer[1], base = this.mod(mod);
            while (exp.isPositive()) {
                if (base.isZero())
                    return Integer[0];
                if (exp.isOdd())
                    r = r.multiply(base).mod(mod);
                exp = exp.divide(2);
                base = base.square().mod(mod);
            }
            return r;
        };
        Integer.prototype._multiplyBySmall = function (a) {
            throw new Error();
        };
        Integer.prototype.compare = function (v) {
            throw new Error();
        };
        Integer.prototype.compareAbs = function (v) {
            throw new Error();
        };
        Integer.prototype.equals = function (v) {
            return this.compare(v) === 0;
        };
        Integer.prototype.eq = function (v) {
            return this.equals(v);
        };
        Integer.prototype.notEquals = function (v) {
            return this.compare(v) !== 0;
        };
        Integer.prototype.neq = function (v) {
            return this.notEquals(v);
        };
        Integer.prototype.greater = function (v) {
            return this.compare(v) > 0;
        };
        Integer.prototype.gt = function (v) {
            return this.greater(v);
        };
        Integer.prototype.lesser = function (v) {
            return this.compare(v) < 0;
        };
        Integer.prototype.lt = function (v) {
            return this.lesser(v);
        };
        Integer.prototype.greaterOrEquals = function (v) {
            return this.compare(v) >= 0;
        };
        Integer.prototype.geq = function (v) {
            return this.greaterOrEquals(v);
        };
        Integer.prototype.lesserOrEquals = function (v) {
            return this.compare(v) <= 0;
        };
        Integer.prototype.leq = function (v) {
            return this.lesserOrEquals(v);
        };
        Integer.prototype.isEven = function () {
            throw new Error();
        };
        Integer.prototype.isDivisibleBy = function (v) {
            var n = parseValue(v);
            var value = n['value'];
            if (value === 0)
                return false;
            if (value === 1)
                return true;
            if (value === 2)
                return this.isEven();
            return this.mod(n).equals(Integer[0]);
        };
        Integer.prototype.abs = function () {
            throw new Error();
        };
        Integer.prototype.next = function () {
            throw new Error();
        };
        Integer.prototype.prev = function () {
            throw new Error();
        };
        Integer.prototype.times = function (v) {
            throw new Error();
        };
        Integer.prototype.square = function () {
            throw new Error();
        };
        Integer.prototype.isPrime = function () {
            var isPrime = isBasicPrime(this);
            if (isPrime !== undefined)
                return isPrime;
            var n = this.abs();
            var nPrev = n.prev();
            var a = [2, 3, 5, 7, 11, 13, 17, 19];
            var b = nPrev;
            while (b.isEven())
                b = b.divide(2);
            for (var i_3 = 0; i_3 < a.length; i_3++) {
                var x = bigInt(a[i_3]).modPow(b, n);
                if (x.equals(Integer[1]) || x.equals(nPrev))
                    continue;
                var t = void 0;
                var d = void 0;
                for (t = true, d = b; t && d.lesser(nPrev); d = d.multiply(2)) {
                    x = x.square().mod(n);
                    if (x.equals(nPrev))
                        t = false;
                }
                if (t)
                    return false;
            }
            return true;
        };
        Integer.prototype.minus = function (v) {
            throw new Error();
        };
        Integer.prototype.isProbablePrime = function (iterations) {
            var isPrime = isBasicPrime(this);
            if (isPrime !== undefined)
                return isPrime;
            var n = this.abs();
            var t = iterations === undefined ? 5 : iterations;
            for (var i = 0; i < t; i++) {
                var a = randBetween(2, n.minus(2));
                if (!a.modPow(n.prev(), n).isUnit())
                    return false;
            }
            return true;
        };
        Integer.prototype.multiply = function (v) {
            throw new Error();
        };
        Integer.prototype.shiftLeft = function (nIn) {
            if (!shift_isSmall(nIn)) {
                throw new Error(String(nIn) + " is too large for shifting.");
            }
            var n = +nIn;
            if (n < 0)
                return this.shiftRight(-n);
            var result = this;
            while (n >= powers2Length) {
                result = result.multiply(highestPower2);
                n -= powers2Length - 1;
            }
            return result.multiply(powersOfTwo[n]);
        };
        Integer.prototype.isZero = function () {
            throw new Error();
        };
        Integer.prototype.shiftRight = function (nIn) {
            var remQuo;
            if (!shift_isSmall(nIn)) {
                throw new Error(String(nIn) + " is too large for shifting.");
            }
            var n = +nIn;
            if (n < 0)
                return this.shiftLeft(-n);
            var result = this;
            while (n >= powers2Length) {
                if (result.isZero())
                    return result;
                remQuo = divModAny(result, highestPower2);
                result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
                n -= powers2Length - 1;
            }
            remQuo = divModAny(result, powersOfTwo[n]);
            return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
        };
        Integer.prototype.negate = function () {
            throw new Error();
        };
        Integer.prototype.not = function () {
            return this.negate().prev();
        };
        Integer.prototype.and = function (n) {
            return bitwise(this, n, function (a, b) { return a & b; });
        };
        Integer.prototype.or = function (n) {
            return bitwise(this, n, function (a, b) { return a | b; });
        };
        Integer.prototype.xor = function (n) {
            return bitwise(this, n, function (a, b) { return a ^ b; });
        };
        Integer.prototype.valueOf = function () {
            throw new Error();
        };
        Integer.prototype.toJSNumber = function () {
            return this.valueOf();
        };
        Integer.prototype.toStringEx = function (radix) {
            throw new Error();
        };
        Integer.prototype.toString = function () {
            return this.toStringEx();
        };
        return Integer;
    }());
    exports.Integer = Integer;
    var BigInteger = (function (_super) {
        __extends(BigInteger, _super);
        function BigInteger(value, sign) {
            _super.call(this, void 0, void 0);
            this.value = value;
            this.sign = sign;
            this.isSmall = false;
        }
        BigInteger.prototype.add = function (v) {
            var n = parseValue(v);
            if (this.sign !== n.sign) {
                return this.subtract(n.negate());
            }
            var a = this.value;
            if (n.isSmall) {
                var b = n.value;
                return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
            }
            else {
                var b = n.value;
                return new BigInteger(addAny(a, b), this.sign);
            }
        };
        BigInteger.prototype.plus = function (v) {
            return this.add(v);
        };
        BigInteger.prototype.__add__ = function (rhs) {
            return this.add(rhs);
        };
        BigInteger.prototype.__radd__ = function (lhs) {
            var n = parseValue(lhs);
            return n.add(this);
        };
        BigInteger.prototype.subtract = function (v) {
            var n = parseValue(v);
            if (this.sign !== n.sign) {
                return this.add(n.negate());
            }
            var a = this.value;
            if (n.isSmall) {
                var b = n.value;
                return subtractSmall(a, Math.abs(b), this.sign);
            }
            else {
                var b = n.value;
                return subtractAny(a, b, this.sign);
            }
        };
        BigInteger.prototype.minus = function (v) {
            return this.subtract(v);
        };
        BigInteger.prototype.__sub__ = function (rhs) {
            return this.subtract(rhs);
        };
        BigInteger.prototype.__rsub__ = function (lhs) {
            var n = parseValue(lhs);
            return n.subtract(this);
        };
        BigInteger.prototype.negate = function () {
            return new BigInteger(this.value, !this.sign);
        };
        BigInteger.prototype.neg = function () {
            return new BigInteger(this.value, !this.sign);
        };
        BigInteger.prototype.__neg__ = function () {
            return this.negate();
        };
        BigInteger.prototype.__pos__ = function () {
            return this;
        };
        BigInteger.prototype.abs = function () {
            return new BigInteger(this.value, false);
        };
        BigInteger.prototype.inv = function () {
            throw new Error("inv() is not supported for BigInteger");
        };
        BigInteger.prototype.multiply = function (v) {
            var n = parseValue(v);
            var a = this.value;
            var sign = this.sign !== n.sign;
            var rhs;
            if (n.isSmall) {
                var b = n.value;
                if (b === 0)
                    return Integer[0];
                if (b === 1)
                    return this;
                if (b === -1)
                    return this.negate();
                var abs = Math.abs(b);
                if (abs < BASE) {
                    return new BigInteger(multiplySmall(a, abs), sign);
                }
                rhs = smallToArray(abs);
            }
            else {
                rhs = n.value;
            }
            if (useKaratsuba(a.length, rhs.length))
                return new BigInteger(multiplyKaratsuba(a, rhs), sign);
            return new BigInteger(multiplyLong(a, rhs), sign);
        };
        BigInteger.prototype.times = function (v) {
            return this.multiply(v);
        };
        BigInteger.prototype.__mul__ = function (rhs) {
            return this.multiply(rhs);
        };
        BigInteger.prototype.__rmul__ = function (lhs) {
            var n = parseValue(lhs);
            return n.multiply(this);
        };
        BigInteger.prototype._multiplyBySmall = function (a) {
            if (a.value === 0)
                return Integer[0];
            if (a.value === 1)
                return this;
            if (a.value === -1)
                return this.negate();
            return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
        };
        BigInteger.prototype.square = function () {
            return new BigInteger(square(this.value), false);
        };
        BigInteger.prototype.compareAbs = function (v) {
            var n = parseValue(v);
            var a = this.value;
            if (n.isSmall) {
                return 1;
            }
            else {
                var b = n.value;
                return compareAbs(a, b);
            }
        };
        BigInteger.prototype.compare = function (v) {
            if (v === Infinity) {
                return -1;
            }
            if (v === -Infinity) {
                return 1;
            }
            var n = parseValue(v);
            var a = this.value;
            if (this.sign !== n.sign) {
                return n.sign ? 1 : -1;
            }
            if (n.isSmall) {
                return this.sign ? -1 : 1;
            }
            else {
                var b = n.value;
                return compareAbs(a, b) * (this.sign ? -1 : 1);
            }
        };
        BigInteger.prototype.compareTo = function (v) {
            return this.compare(v);
        };
        BigInteger.prototype.isEven = function () {
            return (this.value[0] & 1) === 0;
        };
        BigInteger.prototype.isOdd = function () {
            return (this.value[0] & 1) === 1;
        };
        BigInteger.prototype.isPositive = function () {
            return !this.sign;
        };
        BigInteger.prototype.isNegative = function () {
            return this.sign;
        };
        BigInteger.prototype.isOne = function () {
            return false;
        };
        BigInteger.prototype.isUnit = function () {
            return false;
        };
        BigInteger.prototype.isZero = function () {
            return false;
        };
        BigInteger.prototype.next = function () {
            var value = this.value;
            if (this.sign) {
                return subtractSmall(value, 1, this.sign);
            }
            return new BigInteger(addSmall(value, 1), this.sign);
        };
        BigInteger.prototype.prev = function () {
            var value = this.value;
            if (this.sign) {
                return new BigInteger(addSmall(value, 1), true);
            }
            return subtractSmall(value, 1, this.sign);
        };
        BigInteger.prototype.toStringEx = function (radix) {
            if (radix === undefined)
                radix = 10;
            if (radix !== 10)
                return toBase(this, radix);
            var v = this.value;
            var l = v.length;
            var str = String(v[--l]);
            var zeros = "0000000";
            while (--l >= 0) {
                var digit = String(v[l]);
                str += zeros.slice(digit.length) + digit;
            }
            var sign = this.sign ? "-" : "";
            return sign + str;
        };
        BigInteger.prototype.valueOf = function () {
            return +this.toStringEx();
        };
        return BigInteger;
    }(Integer));
    var SmallInteger = (function (_super) {
        __extends(SmallInteger, _super);
        function SmallInteger(value) {
            _super.call(this, void 0, void 0);
            this.value = value;
            this.sign = value < 0;
            this.isSmall = true;
        }
        SmallInteger.prototype.add = function (v) {
            var n = parseValue(v);
            var a = this.value;
            if (a < 0 !== n.sign) {
                return this.subtract(n.negate());
            }
            var rhs;
            if (n.isSmall) {
                var b = n.value;
                if (isPrecise(a + b))
                    return new SmallInteger(a + b);
                rhs = smallToArray(Math.abs(b));
            }
            else {
                rhs = n.value;
            }
            return new BigInteger(addSmall(rhs, Math.abs(a)), a < 0);
        };
        SmallInteger.prototype.plus = function (v) {
            return this.add(v);
        };
        SmallInteger.prototype.__add__ = function (rhs) {
            return this.add(rhs);
        };
        SmallInteger.prototype.__radd__ = function (lhs) {
            var n = parseValue(lhs);
            return n.add(this);
        };
        SmallInteger.prototype.subtract = function (v) {
            var n = parseValue(v);
            var a = this.value;
            if (a < 0 !== n.sign) {
                return this.add(n.negate());
            }
            if (n.isSmall) {
                var b = n.value;
                return new SmallInteger(a - b);
            }
            else {
                var b = n.value;
                return subtractSmall(b, Math.abs(a), a >= 0);
            }
        };
        SmallInteger.prototype.minus = function (v) {
            return this.subtract(v);
        };
        SmallInteger.prototype.__sub__ = function (rhs) {
            return this.subtract(rhs);
        };
        SmallInteger.prototype.__rsub__ = function (lhs) {
            var n = parseValue(lhs);
            return n.subtract(this);
        };
        SmallInteger.prototype.negate = function () {
            var sign = this.sign;
            var small = new SmallInteger(-this.value);
            small.sign = !sign;
            return small;
        };
        SmallInteger.prototype.neg = function () {
            return this.negate();
        };
        SmallInteger.prototype.__neg__ = function () {
            return this.negate();
        };
        SmallInteger.prototype.__pos__ = function () {
            return this;
        };
        SmallInteger.prototype.abs = function () {
            return new SmallInteger(Math.abs(this.value));
        };
        SmallInteger.prototype.inv = function () {
            throw new Error("inv() is not supported");
        };
        SmallInteger.prototype._multiplyBySmall = function (a) {
            if (isPrecise(a.value * this.value)) {
                return new SmallInteger(a.value * this.value);
            }
            return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
        };
        SmallInteger.prototype.multiply = function (v) {
            return parseValue(v)._multiplyBySmall(this);
        };
        SmallInteger.prototype.times = function (v) {
            return this.multiply(v);
        };
        SmallInteger.prototype.__mul__ = function (rhs) {
            return this.multiply(rhs);
        };
        SmallInteger.prototype.__rmul__ = function (lhs) {
            var n = parseValue(lhs);
            return n.multiply(this);
        };
        SmallInteger.prototype.square = function () {
            var value = this.value * this.value;
            if (isPrecise(value))
                return new SmallInteger(value);
            return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
        };
        SmallInteger.prototype.compareAbs = function (v) {
            var n = parseValue(v);
            var a = Math.abs(this.value);
            if (n.isSmall) {
                var value = n.value;
                var b = Math.abs(value);
                return a === b ? 0 : a > b ? 1 : -1;
            }
            return -1;
        };
        SmallInteger.prototype.compare = function (v) {
            if (v === Infinity) {
                return -1;
            }
            if (v === -Infinity) {
                return 1;
            }
            var n = parseValue(v);
            var a = this.value;
            if (n.isSmall) {
                var b = n.value;
                return a === b ? 0 : a > b ? 1 : -1;
            }
            if (a < 0 !== n.sign) {
                return a < 0 ? -1 : 1;
            }
            return a < 0 ? 1 : -1;
        };
        SmallInteger.prototype.compareTo = function (v) {
            return this.compare(v);
        };
        SmallInteger.prototype.isEven = function () {
            return (this.value & 1) === 0;
        };
        SmallInteger.prototype.isOdd = function () {
            return (this.value & 1) === 1;
        };
        SmallInteger.prototype.isPositive = function () {
            return this.value > 0;
        };
        SmallInteger.prototype.isNegative = function () {
            return this.value < 0;
        };
        SmallInteger.prototype.isOne = function () {
            return this.isUnit();
        };
        SmallInteger.prototype.isUnit = function () {
            return Math.abs(this.value) === 1;
        };
        SmallInteger.prototype.isZero = function () {
            return this.value === 0;
        };
        SmallInteger.prototype.next = function () {
            var value = this.value;
            if (value + 1 < MAX_INT)
                return new SmallInteger(value + 1);
            return new BigInteger(MAX_INT_ARR, false);
        };
        SmallInteger.prototype.prev = function () {
            var value = this.value;
            if (value - 1 > -MAX_INT)
                return new SmallInteger(value - 1);
            return new BigInteger(MAX_INT_ARR, true);
        };
        SmallInteger.prototype.toStringEx = function (radix) {
            if (radix === undefined)
                radix = 10;
            if (radix !== 10)
                return toBase(this, radix);
            return String(this.value);
        };
        SmallInteger.prototype.valueOf = function () {
            return this.value;
        };
        return SmallInteger;
    }(Integer));
    function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
    }
    function smallToArray(n) {
        if (n < 1e7)
            return [n];
        if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
    }
    function arrayToSmall(arr) {
        trim(arr);
        var length = arr.length;
        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
                case 0: return 0;
                case 1: return arr[0];
                case 2: return arr[0] + arr[1] * BASE;
                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
        }
        return arr;
    }
    function trim(v) {
        var i = v.length;
        while (v[--i] === 0)
            ;
        v.length = i + 1;
    }
    function createArray(length) {
        var x = new Array(length);
        var i = -1;
        while (++i < length) {
            x[i] = 0;
        }
        return x;
    }
    function truncate(n) {
        if (n > 0)
            return Math.floor(n);
        return Math.ceil(n);
    }
    function add(a, b) {
        var l_a = a.length;
        var l_b = b.length;
        var r = new Array(l_a);
        var carry = 0;
        var base = BASE;
        var sum;
        var i;
        for (i = 0; i < l_b; i++) {
            sum = a[i] + b[i] + carry;
            carry = sum >= base ? 1 : 0;
            r[i] = sum - carry * base;
        }
        while (i < l_a) {
            sum = a[i] + carry;
            carry = sum === base ? 1 : 0;
            r[i++] = sum - carry * base;
        }
        if (carry > 0)
            r.push(carry);
        return r;
    }
    function addAny(a, b) {
        if (a.length >= b.length)
            return add(a, b);
        return add(b, a);
    }
    function addSmall(a, carry) {
        var l = a.length;
        var r = new Array(l);
        var base = BASE;
        var i;
        for (i = 0; i < l; i++) {
            var sum = a[i] - base + carry;
            carry = Math.floor(sum / base);
            r[i] = sum - carry * base;
            carry += 1;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }
    function subtract(a, b) {
        var a_l = a.length;
        var b_l = b.length;
        var r = new Array(a_l);
        var borrow = 0;
        var base = BASE;
        var i;
        var difference;
        for (i = 0; i < b_l; i++) {
            difference = a[i] - borrow - b[i];
            if (difference < 0) {
                difference += base;
                borrow = 1;
            }
            else
                borrow = 0;
            r[i] = difference;
        }
        for (i = b_l; i < a_l; i++) {
            difference = a[i] - borrow;
            if (difference < 0)
                difference += base;
            else {
                r[i++] = difference;
                break;
            }
            r[i] = difference;
        }
        for (; i < a_l; i++) {
            r[i] = a[i];
        }
        trim(r);
        return r;
    }
    function subtractAny(a, b, sign) {
        var diff;
        if (compareAbs(a, b) >= 0) {
            diff = subtract(a, b);
        }
        else {
            diff = subtract(b, a);
            sign = !sign;
        }
        var value = arrayToSmall(diff);
        if (typeof value === "number") {
            if (sign)
                value = -value;
            return new SmallInteger(value);
        }
        else {
            return new BigInteger(value, sign);
        }
    }
    function subtractSmall(a, b, sign) {
        var l = a.length;
        var r0 = new Array(l);
        var carry = -b;
        var base = BASE;
        for (var i_4 = 0; i_4 < l; i_4++) {
            var difference = a[i_4] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r0[i_4] = difference < 0 ? difference + base : difference;
        }
        var r = arrayToSmall(r0);
        if (typeof r === "number") {
            if (sign) {
                r = -r;
            }
            return new SmallInteger(r);
        }
        else {
            return new BigInteger(r, sign);
        }
    }
    function multiplyLong(a, b) {
        var a_l = a.length;
        var b_l = b.length;
        var l = a_l + b_l;
        var r = createArray(l);
        var base = BASE;
        for (var i_5 = 0; i_5 < a_l; ++i_5) {
            var a_i = a[i_5];
            for (var j = 0; j < b_l; ++j) {
                var b_j = b[j];
                var product = a_i * b_j + r[i_5 + j];
                var carry = Math.floor(product / base);
                r[i_5 + j] = product - carry * base;
                r[i_5 + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }
    function multiplySmall(a, b) {
        var l = a.length;
        var r = new Array(l);
        var base = BASE;
        var carry = 0;
        var i;
        for (i = 0; i < l; i++) {
            var product = a[i] * b + carry;
            carry = Math.floor(product / base);
            r[i] = product - carry * base;
        }
        while (carry > 0) {
            r[i++] = carry % base;
            carry = Math.floor(carry / base);
        }
        return r;
    }
    function shiftLeft(x, n) {
        var r = [];
        while (n-- > 0)
            r.push(0);
        return r.concat(x);
    }
    function multiplyKaratsuba(x, y) {
        var n = Math.max(x.length, y.length);
        if (n <= 30)
            return multiplyLong(x, y);
        n = Math.ceil(n / 2);
        var b = x.slice(n), a = x.slice(0, n), d = y.slice(n), c = y.slice(0, n);
        var ac = multiplyKaratsuba(a, c), bd = multiplyKaratsuba(b, d), abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));
        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim(product);
        return product;
    }
    function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
    }
    function multiplySmallAndArray(a, b, sign) {
        if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
    }
    function square(a) {
        var l = a.length;
        var r = createArray(l + l);
        var base = BASE;
        for (var i_6 = 0; i_6 < l; i_6++) {
            var a_i = a[i_6];
            for (var j = 0; j < l; j++) {
                var a_j = a[j];
                var product = a_i * a_j + r[i_6 + j];
                var carry = Math.floor(product / base);
                r[i_6 + j] = product - carry * base;
                r[i_6 + j + 1] += carry;
            }
        }
        trim(r);
        return r;
    }
    function divMod1(a, b) {
        var a_l = a.length;
        var b_l = b.length;
        var base = BASE;
        var result = createArray(b.length);
        var divisorMostSignificantDigit = b[b_l - 1];
        var lambda = Math.ceil(base / (2 * divisorMostSignificantDigit));
        var remainder = multiplySmall(a, lambda);
        var divisor = multiplySmall(b, lambda);
        var quotientDigit;
        var shift;
        if (remainder.length <= a_l)
            remainder.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            var carry = 0;
            var borrow = 0;
            var l = divisor.length;
            for (var i_7 = 0; i_7 < l; i_7++) {
                carry += quotientDigit * divisor[i_7];
                var q = Math.floor(carry / base);
                borrow += remainder[shift + i_7] - (carry - q * base);
                carry = q;
                if (borrow < 0) {
                    remainder[shift + i_7] = borrow + base;
                    borrow = -1;
                }
                else {
                    remainder[shift + i_7] = borrow;
                    borrow = 0;
                }
            }
            while (borrow !== 0) {
                quotientDigit -= 1;
                carry = 0;
                for (var i_8 = 0; i_8 < l; i_8++) {
                    carry += remainder[shift + i_8] - base + divisor[i_8];
                    if (carry < 0) {
                        remainder[shift + i_8] = carry + base;
                        carry = 0;
                    }
                    else {
                        remainder[shift + i_8] = carry;
                        carry = 1;
                    }
                }
                borrow += carry;
            }
            result[shift] = quotientDigit;
        }
        remainder = divModSmall(remainder, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder)];
    }
    function divMod2(a, b) {
        var a_l = a.length;
        var b_l = b.length;
        var result = [];
        var part = [];
        var base = BASE;
        while (a_l) {
            part.unshift(a[--a_l]);
            if (compareAbs(part, b) < 0) {
                result.push(0);
                continue;
            }
            var xlen = part.length;
            var highx = part[xlen - 1] * base + part[xlen - 2];
            var highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
                highx = (highx + 1) * base;
            }
            var guess = Math.ceil(highx / highy);
            var check = void 0;
            do {
                check = multiplySmall(b, guess);
                if (compareAbs(check, part) <= 0)
                    break;
                guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
    }
    function divModSmall(value, lambda) {
        var length = value.length;
        var quotient = createArray(length);
        var base = BASE;
        var remainder = 0;
        for (var i_9 = length - 1; i_9 >= 0; --i_9) {
            var divisor = remainder * base + value[i_9];
            var q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i_9] = q | 0;
        }
        return [quotient, remainder | 0];
    }
    function divModAny(self, v) {
        var value;
        var n = parseValue(v);
        var a = self['value'];
        var b = n['value'];
        var quotient;
        if (b === 0)
            throw new Error("Cannot divide by zero");
        if (self.isSmall) {
            if (n.isSmall) {
                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
        }
        if (n.isSmall) {
            if (b === +1)
                return [self, Integer[0]];
            if (b === -1)
                return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
                value = divModSmall(a, abs);
                quotient = arrayToSmall(value[0]);
                var remainder = value[1];
                if (self.sign)
                    remainder = -remainder;
                if (typeof quotient === "number") {
                    if (self.sign !== n.sign)
                        quotient = -quotient;
                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
                }
                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
        }
        var lhs = a;
        var rhs = b;
        var comparison = compareAbs(lhs, rhs);
        if (comparison === -1)
            return [Integer[0], self];
        if (comparison === 0)
            return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];
        if (lhs.length + rhs.length <= 200) {
            value = divMod1(lhs, rhs);
        }
        else {
            value = divMod2(lhs, rhs);
        }
        quotient = value[0];
        var qSign = self.sign !== n.sign, mod = value[1], mSign = self.sign;
        var quotientInteger;
        if (typeof quotient === "number") {
            if (qSign)
                quotient = -quotient;
            quotientInteger = new SmallInteger(quotient);
        }
        else {
            quotientInteger = new BigInteger(quotient, qSign);
        }
        if (typeof mod === "number") {
            if (mSign)
                mod = -mod;
            return [quotientInteger, new SmallInteger(mod)];
        }
        else {
            return [quotientInteger, new BigInteger(mod, mSign)];
        }
    }
    function compareAbs(a, b) {
        if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
        }
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i] !== b[i])
                return a[i] > b[i] ? 1 : -1;
        }
        return 0;
    }
    function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit())
            return false;
        if (n.equals(2) || n.equals(3) || n.equals(5))
            return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5))
            return false;
        if (n.lesser(25))
            return true;
    }
    function shift_isSmall(n) {
        return ((typeof n === "number" || typeof n === "string") && +Math.abs(n) <= BASE) ||
            (n instanceof BigInteger && n.value.length <= 1);
    }
    function bitwise(x, yIn, fn) {
        var y = parseValue(yIn);
        var xSign = x.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x.not() : x, yRem = ySign ? y.not() : y;
        var xBits = [];
        var yBits = [];
        var xStop = false;
        var yStop = false;
        while (!xStop || !yStop) {
            if (xRem.isZero()) {
                xStop = true;
                xBits.push(xSign ? 1 : 0);
            }
            else if (xSign)
                xBits.push(xRem.isEven() ? 1 : 0);
            else
                xBits.push(xRem.isEven() ? 0 : 1);
            if (yRem.isZero()) {
                yStop = true;
                yBits.push(ySign ? 1 : 0);
            }
            else if (ySign)
                yBits.push(yRem.isEven() ? 1 : 0);
            else
                yBits.push(yRem.isEven() ? 0 : 1);
            xRem = xRem.over(2);
            yRem = yRem.over(2);
        }
        var result = [];
        for (var i_10 = 0; i_10 < xBits.length; i_10++)
            result.push(fn(xBits[i_10], yBits[i_10]));
        var sum = bigInt(result.pop()).negate().times(bigInt(2).pow(result.length));
        while (result.length) {
            sum = sum.add(bigInt(result.pop()).times(bigInt(2).pow(result.length)));
        }
        return sum;
    }
    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
    function roughLOB(n) {
        var v = n['value'];
        var x = typeof v === "number" ? v | LOBMASK_I : v[0] + v[1] * BASE | LOBMASK_BI;
        return x & -x;
    }
    function max(aIn, bIn) {
        var a = parseValue(aIn);
        var b = parseValue(bIn);
        return a.greater(b) ? a : b;
    }
    exports.max = max;
    function min(aIn, bIn) {
        var a = parseValue(aIn);
        var b = parseValue(bIn);
        return a.lesser(b) ? a : b;
    }
    exports.min = min;
    function gcd(aIn, bIn) {
        var a = parseValue(aIn).abs();
        var b = parseValue(bIn).abs();
        if (a.equals(b))
            return a;
        if (a.isZero())
            return b;
        if (b.isZero())
            return a;
        var c = Integer[1];
        while (a.isEven() && b.isEven()) {
            var d = Math.min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
        }
        while (a.isEven()) {
            a = a.divide(roughLOB(a));
        }
        do {
            while (b.isEven()) {
                b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
                var t = b;
                b = a;
                a = t;
            }
            b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
    }
    exports.gcd = gcd;
    function lcm(aIn, bIn) {
        var a = parseValue(aIn).abs();
        var b = parseValue(bIn).abs();
        return a.divide(gcd(a, b)).multiply(b);
    }
    exports.lcm = lcm;
    function randBetween(a, b) {
        if (typeof a === 'undefined') {
            throw new Error("a must be number | string | Integer");
        }
        if (typeof b === 'undefined') {
            throw new Error("b must be number | string | Integer");
        }
        a = parseValue(a);
        b = parseValue(b);
        var low = min(a, b), high = max(a, b);
        var range = high.subtract(low);
        if (range.isSmall) {
            return low.add(Math.round(Math.random() * range.valueOf()));
        }
        var length = range.value.length - 1;
        var temp = [];
        var restricted = true;
        for (var i = length; i >= 0; i--) {
            var top = restricted ? range.value[i] : BASE;
            var digit = truncate(Math.random() * top);
            temp.unshift(digit);
            if (digit < top)
                restricted = false;
        }
        var result = arrayToSmall(temp);
        return low.add(typeof result === "number" ? new SmallInteger(result) : new BigInteger(result, false));
    }
    exports.randBetween = randBetween;
    function stringify(digit) {
        var digitValue = digit['value'];
        var value;
        if (typeof digitValue === "number") {
            value = [digitValue];
        }
        else {
            value = digitValue;
        }
        if (value.length === 1 && value[0] <= 35) {
            return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(value[0]);
        }
        return "<" + value + ">";
    }
    function toBase(n, baseIn) {
        var base = bigInt(baseIn);
        if (base.isZero()) {
            if (n.isZero())
                return "0";
            throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
            if (n.isZero())
                return "0";
            if (n.isNegative())
                return new Array(1 - n.valueOf()).join("10");
            return "1" + new Array(+n).join("01");
        }
        var minusSign = "";
        if (n.isNegative() && base.isPositive()) {
            minusSign = "-";
            n = n.abs();
        }
        if (base.equals(1)) {
            if (n.isZero())
                return "0";
            return minusSign + new Array(+n + 1).join("" + 1);
        }
        var out = [];
        var left = n;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
            var divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
                digit = base.minus(digit).abs();
                left = left.next();
            }
            out.push(stringify(digit));
        }
        out.push(stringify(left));
        return minusSign + out.reverse().join("");
    }
    function parseStringValue(v) {
        if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
                return new SmallInteger(x);
            throw "Invalid integer: " + v;
        }
        var sign = v[0] === "-";
        if (sign)
            v = v.slice(1);
        var split = v.split(/e/i);
        if (split.length > 2)
            throw new Error("Invalid integer: " + split.join("e"));
        if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+")
                exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp))
                throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
                exp -= text.length - decimalPlace - 1;
                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0)
                throw new Error("Cannot include negative exponent part for integers");
            text += (new Array(exp + 1)).join("0");
            v = text;
        }
        var isValid = /^([0-9][0-9]*)$/.test(v);
        if (!isValid)
            throw new Error("Invalid integer: " + v);
        var r = [];
        var max = v.length;
        var l = LOG_BASE;
        var min = max - l;
        while (max > 0) {
            r.push(+v.slice(min, max));
            min -= l;
            if (min < 0)
                min = 0;
            max -= l;
        }
        trim(r);
        return new BigInteger(r, sign);
    }
    function parseNumberValue(v) {
        if (isPrecise(v)) {
            if (v !== truncate(v))
                throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
    }
    function parseValue(v) {
        if (typeof v === "number") {
            return parseNumberValue(v);
        }
        else if (typeof v === "string") {
            return parseStringValue(v);
        }
        else if (v instanceof Integer) {
            return v;
        }
        throw new Error("v must be a number or a string or Integer: Found " + typeof v);
    }
    for (var i = 0; i < 1000; i++) {
        Integer[i] = new SmallInteger(i);
        if (i > 0)
            Integer[-i] = new SmallInteger(-i);
    }
    exports.one = Integer[1];
    exports.zero = Integer[0];
    exports.minusOne = Integer[-1];
    function isInstance(x) { return x instanceof BigInteger || x instanceof SmallInteger; }
    exports.isInstance = isInstance;
    ;
    function bigInt(v, radix) {
        return new Integer(v, radix);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = bigInt;
});

define('davinci-units/math/BigRational',["require", "exports", './BigInteger', './BigInteger'], function (require, exports, BigInteger_1, BigInteger_2) {
    "use strict";
    var BigRational = (function () {
        function BigRational(numer, denom) {
            this.numer = numer;
            this.denom = denom;
            if (denom.isZero())
                throw "Denominator cannot be 0.";
        }
        BigRational.prototype.add = function (n, d) {
            var v = interpret(n, d);
            var multiple = BigInteger_2.lcm(this.denom, v.denom);
            var a = multiple.divide(this.denom);
            var b = multiple.divide(v.denom);
            a = this.numer.times(a);
            b = v.numer.times(b);
            return reduce(a.add(b), multiple);
        };
        BigRational.prototype.plus = function (n, d) {
            return this.add(n, d);
        };
        BigRational.prototype.__add__ = function (rhs) {
            return this.add(rhs);
        };
        BigRational.prototype.__radd__ = function (lhs) {
            var v = interpret(lhs);
            return v.add(this);
        };
        BigRational.prototype.subtract = function (n, d) {
            var v = interpret(n, d);
            return this.add(v.negate());
        };
        BigRational.prototype.minus = function (n, d) {
            return this.subtract(n, d);
        };
        BigRational.prototype.__sub__ = function (rhs) {
            return this.subtract(rhs);
        };
        BigRational.prototype.__rsub__ = function (lhs) {
            var v = interpret(lhs);
            return v.subtract(this);
        };
        BigRational.prototype.multiply = function (n, d) {
            var v = interpret(n, d);
            return reduce(this.numer.times(v.numer), this.denom.times(v.denom));
        };
        BigRational.prototype.times = function (n, d) {
            return this.multiply(n, d);
        };
        BigRational.prototype.__mul__ = function (rhs) {
            return this.multiply(rhs);
        };
        BigRational.prototype.__rmul__ = function (lhs) {
            var v = interpret(lhs);
            return v.multiply(this);
        };
        BigRational.prototype.divide = function (n, d) {
            var v = interpret(n, d);
            return reduce(this.numer.times(v.denom), this.denom.times(v.numer));
        };
        BigRational.prototype.__div__ = function (rhs) {
            return this.divide(rhs);
        };
        BigRational.prototype.__rdiv__ = function (lhs) {
            var v = interpret(lhs);
            return v.divide(this);
        };
        BigRational.prototype.inv = function () {
            return this.reciprocate();
        };
        BigRational.prototype.over = function (n, d) {
            return this.divide(n, d);
        };
        BigRational.prototype.reciprocate = function () {
            return new BigRational(this.denom, this.numer);
        };
        BigRational.prototype.mod = function (n, d) {
            var v = interpret(n, d);
            return this.minus(v.times(this.over(v).floor()));
        };
        BigRational.prototype.pow = function (n) {
            var v = BigInteger_1.default(n);
            var num = this.numer.pow(v);
            var denom = this.denom.pow(v);
            return reduce(num, denom);
        };
        BigRational.prototype.floor = function (toBigInt) {
            var divmod = this.numer.divmod(this.denom);
            var floor;
            if (divmod.remainder.isZero() || !divmod.quotient.sign) {
                floor = divmod.quotient;
            }
            else
                floor = divmod.quotient.prev();
            if (toBigInt)
                return floor;
            return new BigRational(floor, BigInteger_2.one);
        };
        BigRational.prototype.ceil = function (toBigInt) {
            var divmod = this.numer.divmod(this.denom);
            var ceil;
            if (divmod.remainder.isZero() || divmod.quotient.sign) {
                ceil = divmod.quotient;
            }
            else
                ceil = divmod.quotient.next();
            if (toBigInt)
                return ceil;
            return new BigRational(ceil, BigInteger_2.one);
        };
        BigRational.prototype.round = function (toBigInt) {
            return this.add(1, 2).floor(toBigInt);
        };
        BigRational.prototype.compareAbs = function (n, d) {
            var v = interpret(n, d);
            if (this.denom.equals(v.denom)) {
                return this.numer.compareAbs(v.numer);
            }
            return this.numer.times(v.denom).compareAbs(v.numer.times(this.denom));
        };
        BigRational.prototype.compare = function (n, d) {
            var v = interpret(n, d);
            if (this.denom.equals(v.denom)) {
                return this.numer.compare(v.numer);
            }
            var comparison = this.denom.sign === v.denom.sign ? 1 : -1;
            return comparison * this.numer.times(v.denom).compare(v.numer.times(this.denom));
        };
        BigRational.prototype.compareTo = function (n, d) {
            return this.compare(n, d);
        };
        BigRational.prototype.equals = function (n, d) {
            return this.compare(n, d) === 0;
        };
        BigRational.prototype.eq = function (n, d) {
            return this.equals(n, d);
        };
        BigRational.prototype.__eq__ = function (rhs) {
            return this.eq(rhs);
        };
        BigRational.prototype.notEquals = function (n, d) {
            return this.compare(n, d) !== 0;
        };
        BigRational.prototype.neq = function (n, d) {
            return this.notEquals(n, d);
        };
        BigRational.prototype.__ne__ = function (rhs) {
            return this.neq(rhs);
        };
        BigRational.prototype.lesser = function (n, d) {
            return this.compare(n, d) < 0;
        };
        BigRational.prototype.lt = function (n, d) {
            return this.lesser(n, d);
        };
        BigRational.prototype.__lt__ = function (rhs) {
            return this.lt(rhs);
        };
        BigRational.prototype.lesserOrEquals = function (n, d) {
            return this.compare(n, d) <= 0;
        };
        BigRational.prototype.leq = function (n, d) {
            return this.lesserOrEquals(n, d);
        };
        BigRational.prototype.__le__ = function (rhs) {
            return this.leq(rhs);
        };
        BigRational.prototype.greater = function (n, d) {
            return this.compare(n, d) > 0;
        };
        BigRational.prototype.gt = function (n, d) {
            return this.greater(n, d);
        };
        BigRational.prototype.__gt__ = function (rhs) {
            return this.gt(rhs);
        };
        BigRational.prototype.greaterOrEquals = function (n, d) {
            return this.compare(n, d) >= 0;
        };
        BigRational.prototype.geq = function (n, d) {
            return this.greaterOrEquals(n, d);
        };
        BigRational.prototype.__ge__ = function (rhs) {
            return this.geq(rhs);
        };
        BigRational.prototype.abs = function () {
            if (this.isPositive())
                return this;
            return this.negate();
        };
        BigRational.prototype.__pos__ = function () {
            return this;
        };
        BigRational.prototype.__neg__ = function () {
            return this.negate();
        };
        BigRational.prototype.neg = function () {
            return this.negate();
        };
        BigRational.prototype.negate = function () {
            if (this.denom.sign) {
                return new BigRational(this.numer, this.denom.negate());
            }
            return new BigRational(this.numer.negate(), this.denom);
        };
        BigRational.prototype.isNegative = function () {
            return this.numer.sign !== this.denom.sign && !this.numer.isZero();
        };
        BigRational.prototype.isOne = function () {
            return this.numer.isUnit() && this.denom.isUnit();
        };
        BigRational.prototype.isPositive = function () {
            return this.numer.sign === this.denom.sign && !this.numer.isZero();
        };
        BigRational.prototype.isZero = function () {
            return this.numer.isZero();
        };
        BigRational.prototype.__vbar__ = function (rhs) {
            return this.multiply(rhs);
        };
        BigRational.prototype.__rvbar__ = function (lhs) {
            var v = interpret(lhs);
            return v.multiply(this);
        };
        BigRational.prototype.__wedge__ = function (rhs) {
            return bigRat(0);
        };
        BigRational.prototype.__rwedge__ = function (rhs) {
            return bigRat(0);
        };
        BigRational.prototype.__lshift__ = function (rhs) {
            return this.__vbar__(rhs);
        };
        BigRational.prototype.__rlshift__ = function (rhs) {
            return this.__vbar__(rhs);
        };
        BigRational.prototype.__rshift__ = function (rhs) {
            return this.__vbar__(rhs);
        };
        BigRational.prototype.__rrshift__ = function (rhs) {
            return this.__vbar__(rhs);
        };
        BigRational.prototype.__bang__ = function () {
            return void 0;
        };
        BigRational.prototype.__tilde__ = function () {
            return void 0;
        };
        BigRational.prototype.toDecimal = function (digits) {
            if (digits === void 0) { digits = 10; }
            var n = this.numer.divmod(this.denom);
            var intPart = n.quotient.abs().toString();
            var remainder = bigRat(n.remainder.abs(), this.denom);
            var shiftedRemainder = remainder.times(BigInteger_1.default("1e" + digits));
            var decPart = shiftedRemainder.numer.over(shiftedRemainder.denom).toString();
            if (decPart.length < digits) {
                decPart = new Array(digits - decPart.length + 1).join("0") + decPart;
            }
            if (shiftedRemainder.numer.mod(shiftedRemainder.denom).isZero()) {
                while (decPart.slice(-1) === "0") {
                    decPart = decPart.slice(0, -1);
                }
            }
            if (this.isNegative()) {
                intPart = "-" + intPart;
            }
            if (decPart === "") {
                return intPart;
            }
            return intPart + "." + decPart;
        };
        BigRational.prototype.toString = function () {
            return String(this.numer) + "/" + String(this.denom);
        };
        BigRational.prototype.valueOf = function () {
            return this.numer.valueOf() / this.denom.valueOf();
        };
        return BigRational;
    }());
    function reduce(n, d) {
        var divisor = BigInteger_2.gcd(n, d);
        var numer = n.over(divisor);
        var denom = d.over(divisor);
        if (denom.isNegative()) {
            return new BigRational(numer.negate(), denom.negate());
        }
        return new BigRational(numer, denom);
    }
    function interpret(n, d) {
        return bigRat(n, d);
    }
    function parseDecimal(n) {
        var parts = n.split(/e/i);
        if (parts.length > 2) {
            throw new Error("Invalid input: too many 'e' tokens");
        }
        if (parts.length > 1) {
            var isPositive = true;
            if (parts[1][0] === "-") {
                parts[1] = parts[1].slice(1);
                isPositive = false;
            }
            if (parts[1][0] === "+") {
                parts[1] = parts[1].slice(1);
            }
            var significand = parseDecimal(parts[0]);
            var exponent = new BigRational(BigInteger_1.default(10).pow(parts[1]), BigInteger_2.one);
            if (isPositive) {
                return significand.times(exponent);
            }
            else {
                return significand.over(exponent);
            }
        }
        parts = n.trim().split(".");
        if (parts.length > 2) {
            throw new Error("Invalid input: too many '.' tokens");
        }
        if (parts.length > 1) {
            var isNegative = parts[0][0] === '-';
            if (isNegative)
                parts[0] = parts[0].slice(1);
            var intPart = new BigRational(BigInteger_1.default(parts[0]), BigInteger_2.one);
            var length = parts[1].length;
            while (parts[1][0] === "0") {
                parts[1] = parts[1].slice(1);
            }
            var exp = "1" + Array(length + 1).join("0");
            var decPart = reduce(BigInteger_1.default(parts[1]), BigInteger_1.default(exp));
            intPart = intPart.add(decPart);
            if (isNegative)
                intPart = intPart.negate();
            return intPart;
        }
        return new BigRational(BigInteger_1.default(n), BigInteger_2.one);
    }
    function bigRat(a, b) {
        if (!a) {
            return new BigRational(BigInteger_1.default(0), BigInteger_2.one);
        }
        if (b) {
            return reduce(BigInteger_1.default(a), BigInteger_1.default(b));
        }
        if (BigInteger_2.isInstance(a)) {
            return new BigRational(a, BigInteger_2.one);
        }
        if (a instanceof BigRational)
            return a;
        var numer;
        var denom;
        var text = String(a);
        var texts = text.split("/");
        if (texts.length > 2) {
            throw new Error("Invalid input: too many '/' tokens");
        }
        if (texts.length > 1) {
            var parts = texts[0].split("_");
            if (parts.length > 2) {
                throw new Error("Invalid input: too many '_' tokens");
            }
            if (parts.length > 1) {
                var isPositive = parts[0][0] !== "-";
                numer = BigInteger_1.default(parts[0]).times(texts[1]);
                if (isPositive) {
                    numer = numer.add(parts[1]);
                }
                else {
                    numer = numer.subtract(parts[1]);
                }
                denom = BigInteger_1.default(texts[1]);
                return reduce(numer, denom);
            }
            return reduce(BigInteger_1.default(texts[0]), BigInteger_1.default(texts[1]));
        }
        return parseDecimal(text);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = bigRat;
    exports.zero = bigRat(0);
    exports.one = bigRat(1);
    exports.minusOne = bigRat(-1);
});

define('davinci-units/checks/mustSatisfy',["require", "exports"], function (require, exports) {
    "use strict";
    function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
        if (!condition) {
            var message = messageBuilder ? messageBuilder() : "satisfy some condition";
            var context = contextBuilder ? " in " + contextBuilder() : "";
            throw new Error(name + " must " + message + context + ".");
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustSatisfy;
});

define('davinci-units/checks/isNumber',["require", "exports"], function (require, exports) {
    "use strict";
    function isNumber(x) {
        return (typeof x === 'number');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isNumber;
});

define('davinci-units/checks/isInteger',["require", "exports", '../checks/isNumber'], function (require, exports, isNumber_1) {
    "use strict";
    function isInteger(x) {
        return isNumber_1.default(x) && x % 1 === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isInteger;
});

define('davinci-units/checks/mustBeInteger',["require", "exports", '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, mustSatisfy_1, isInteger_1) {
    "use strict";
    function beAnInteger() {
        return "be an integer";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isInteger_1.default(value), beAnInteger, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeInteger;
});

define('davinci-units/checks/isString',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(s) {
        return (typeof s === 'string');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isString;
});

define('davinci-units/checks/mustBeString',["require", "exports", '../checks/mustSatisfy', '../checks/isString'], function (require, exports, mustSatisfy_1, isString_1) {
    "use strict";
    function beAString() {
        return "be a string";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isString_1.default(value), beAString, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-units/i18n/readOnly',["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString_1) {
    "use strict";
    function readOnly(name) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "Property `" + name + "` is readonly.";
            }
        };
        return message;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = readOnly;
});

define('davinci-units/math/QQ',["require", "exports", '../checks/mustBeInteger', '../i18n/readOnly'], function (require, exports, mustBeInteger_1, readOnly_1) {
    "use strict";
    var magicCode = Math.random();
    var QQ = (function () {
        function QQ(n, d, code) {
            if (code !== magicCode) {
                throw new Error("Use the static create method instead of the constructor");
            }
            mustBeInteger_1.default('n', n);
            mustBeInteger_1.default('d', d);
            var g;
            var gcd = function (a, b) {
                var temp;
                if (a < 0) {
                    a = -a;
                }
                if (b < 0) {
                    b = -b;
                }
                if (b > a) {
                    temp = a;
                    a = b;
                    b = temp;
                }
                while (true) {
                    a %= b;
                    if (a === 0) {
                        return b;
                    }
                    b %= a;
                    if (b === 0) {
                        return a;
                    }
                }
            };
            if (d === 0) {
                throw new Error("denominator must not be zero");
            }
            if (n === 0) {
                g = 1;
            }
            else {
                g = gcd(Math.abs(n), Math.abs(d));
            }
            if (d < 0) {
                n = -n;
                d = -d;
            }
            this._numer = n / g;
            this._denom = d / g;
        }
        Object.defineProperty(QQ.prototype, "numer", {
            get: function () {
                return this._numer;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('numer').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
            get: function () {
                return this._denom;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('denom').message);
            },
            enumerable: true,
            configurable: true
        });
        QQ.prototype.add = function (rhs) {
            return QQ.valueOf(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.sub = function (rhs) {
            return QQ.valueOf(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.mul = function (rhs) {
            return QQ.valueOf(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.div = function (rhs) {
            var numer = this._numer * rhs._denom;
            var denom = this._denom * rhs._numer;
            if (numer === 0) {
                if (denom === 0) {
                    return QQ.valueOf(numer, denom);
                }
                else {
                    return QQ.ZERO;
                }
            }
            else {
                if (denom === 0) {
                    return QQ.valueOf(numer, denom);
                }
                else {
                    return QQ.valueOf(numer, denom);
                }
            }
        };
        QQ.prototype.isOne = function () {
            return this._numer === 1 && this._denom === 1;
        };
        QQ.prototype.isZero = function () {
            return this._numer === 0 && this._denom === 1;
        };
        QQ.prototype.hashCode = function () {
            return 37 * this.numer + 13 * this.denom;
        };
        QQ.prototype.inv = function () {
            return QQ.valueOf(this._denom, this._numer);
        };
        QQ.prototype.neg = function () {
            return QQ.valueOf(-this._numer, this._denom);
        };
        QQ.prototype.equals = function (other) {
            if (other instanceof QQ) {
                return this._numer * other._denom === this._denom * other._numer;
            }
            else {
                return false;
            }
        };
        QQ.prototype.toString = function () {
            return "" + this._numer + "/" + this._denom + "";
        };
        QQ.prototype.__add__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.add(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__radd__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.add(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__sub__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.sub(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.sub(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__mul__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.mul(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.mul(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__div__ = function (rhs) {
            if (rhs instanceof QQ) {
                return this.div(rhs);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof QQ) {
                return lhs.div(this);
            }
            else {
                return void 0;
            }
        };
        QQ.prototype.__pos__ = function () {
            return this;
        };
        QQ.prototype.__neg__ = function () {
            return this.neg();
        };
        QQ.valueOf = function (n, d) {
            if (n === 0) {
                if (d !== 0) {
                    return QQ.ZERO;
                }
                else {
                }
            }
            else if (d === 0) {
            }
            else if (n === d) {
                return QQ.ONE;
            }
            else if (n === 1) {
                if (d === 2) {
                    return QQ.POS_01_02;
                }
                else if (d === 3) {
                    return QQ.POS_01_03;
                }
                else if (d === 4) {
                    return QQ.POS_01_04;
                }
                else if (d === 5) {
                    return QQ.POS_01_05;
                }
                else if (d === -3) {
                    return QQ.NEG_01_03;
                }
            }
            else if (n === -1) {
                if (d === 1) {
                    return QQ.NEG_01_01;
                }
                else if (d === 3) {
                    return QQ.NEG_01_03;
                }
            }
            else if (n === 2) {
                if (d === 1) {
                    return QQ.POS_02_01;
                }
                else if (d === 3) {
                    return QQ.POS_02_03;
                }
            }
            else if (n === -2) {
                if (d === 1) {
                    return QQ.NEG_02_01;
                }
            }
            else if (n === 3) {
                if (d === 1) {
                    return QQ.POS_03_01;
                }
            }
            else if (n === -3) {
                if (d === 1) {
                    return QQ.NEG_03_01;
                }
            }
            else if (n === 4) {
                if (d === 1) {
                    return QQ.POS_04_01;
                }
            }
            else if (n === 5) {
                if (d === 1) {
                    return QQ.POS_05_01;
                }
            }
            else if (n === 6) {
                if (d === 1) {
                    return QQ.POS_06_01;
                }
            }
            else if (n === 7) {
                if (d === 1) {
                    return QQ.POS_07_01;
                }
            }
            else if (n === 8) {
                if (d === 1) {
                    return QQ.POS_08_01;
                }
            }
            return new QQ(n, d, magicCode);
        };
        QQ.POS_08_01 = new QQ(8, 1, magicCode);
        QQ.POS_07_01 = new QQ(7, 1, magicCode);
        QQ.POS_06_01 = new QQ(6, 1, magicCode);
        QQ.POS_05_01 = new QQ(5, 1, magicCode);
        QQ.POS_04_01 = new QQ(4, 1, magicCode);
        QQ.POS_03_01 = new QQ(3, 1, magicCode);
        QQ.POS_02_01 = new QQ(2, 1, magicCode);
        QQ.ONE = new QQ(1, 1, magicCode);
        QQ.POS_01_02 = new QQ(1, 2, magicCode);
        QQ.POS_01_03 = new QQ(1, 3, magicCode);
        QQ.POS_01_04 = new QQ(1, 4, magicCode);
        QQ.POS_01_05 = new QQ(1, 5, magicCode);
        QQ.ZERO = new QQ(0, 1, magicCode);
        QQ.NEG_01_03 = new QQ(-1, 3, magicCode);
        QQ.NEG_01_01 = new QQ(-1, 1, magicCode);
        QQ.NEG_02_01 = new QQ(-2, 1, magicCode);
        QQ.NEG_03_01 = new QQ(-3, 1, magicCode);
        QQ.POS_02_03 = new QQ(2, 3, magicCode);
        return QQ;
    }());
    exports.QQ = QQ;
});

define('davinci-units/i18n/notSupported',["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString_1) {
    "use strict";
    function default_1(name) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "Method `" + name + "` is not supported.";
            }
        };
        return message;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-units/math/Dimensions',["require", "exports", '../math/QQ', '../i18n/notSupported'], function (require, exports, QQ_1, notSupported_1) {
    "use strict";
    var R0 = QQ_1.QQ.valueOf(0, 1);
    var R1 = QQ_1.QQ.valueOf(1, 1);
    var R2 = QQ_1.QQ.valueOf(2, 1);
    var M1 = QQ_1.QQ.valueOf(-1, 1);
    function assertArgRational(name, arg) {
        if (arg instanceof QQ_1.QQ) {
            return arg;
        }
        else {
            throw new Error("Argument '" + arg + "' must be a QQ");
        }
    }
    var Dimensions = (function () {
        function Dimensions(M, L, T, Q, temperature, amount, intensity) {
            this.M = M;
            this.L = L;
            this.T = T;
            this.Q = Q;
            this.temperature = temperature;
            this.amount = amount;
            this.intensity = intensity;
            assertArgRational('M', M);
            assertArgRational('L', L);
            assertArgRational('T', T);
            assertArgRational('Q', Q);
            assertArgRational('temperature', temperature);
            assertArgRational('amount', amount);
            assertArgRational('intensity', intensity);
            if (arguments.length !== 7) {
                throw new Error("Expecting 7 arguments");
            }
        }
        Dimensions.prototype.compatible = function (rhs) {
            if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
                return this;
            }
            else {
                if (this.isOne()) {
                    if (rhs.isOne()) {
                        throw new Error();
                    }
                    else {
                        throw new Error("Dimensions must be equal (dimensionless, " + rhs + ")");
                    }
                }
                else {
                    if (rhs.isOne()) {
                        throw new Error("Dimensions must be equal (" + this + ", dimensionless)");
                    }
                    else {
                        throw new Error("Dimensions must be equal (" + this + ", " + rhs + ")");
                    }
                }
            }
        };
        Dimensions.prototype.mul = function (rhs) {
            return new Dimensions(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        Dimensions.prototype.div = function (rhs) {
            return new Dimensions(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        Dimensions.prototype.pow = function (exponent) {
            return new Dimensions(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        Dimensions.prototype.sqrt = function () {
            return new Dimensions(this.M.div(R2), this.L.div(R2), this.T.div(R2), this.Q.div(R2), this.temperature.div(R2), this.amount.div(R2), this.intensity.div(R2));
        };
        Dimensions.prototype.isOne = function () {
            return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        Dimensions.prototype.inv = function () {
            return new Dimensions(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
        };
        Dimensions.prototype.neg = function () {
            throw new Error(notSupported_1.default('neg').message);
        };
        Dimensions.prototype.toString = function () {
            var stringify = function (rational, label) {
                if (rational.numer === 0) {
                    return null;
                }
                else if (rational.denom === 1) {
                    if (rational.numer === 1) {
                        return "" + label;
                    }
                    else {
                        return "" + label + " ** " + rational.numer;
                    }
                }
                return "" + label + " ** " + rational;
            };
            return [stringify(this.M, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function (x) {
                return typeof x === 'string';
            }).join(" * ");
        };
        Dimensions.prototype.__add__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.compatible(rhs);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.compatible(this);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.compatible(rhs);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.compatible(this);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.mul(rhs);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.mul(this);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__div__ = function (rhs) {
            if (rhs instanceof Dimensions) {
                return this.div(rhs);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Dimensions) {
                return lhs.div(this);
            }
            else {
                return void 0;
            }
        };
        Dimensions.prototype.__pos__ = function () {
            return this;
        };
        Dimensions.prototype.__neg__ = function () {
            return this;
        };
        Dimensions.ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0);
        Dimensions.MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0);
        Dimensions.LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0);
        Dimensions.TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0);
        Dimensions.CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0);
        Dimensions.CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0);
        Dimensions.TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0);
        Dimensions.AMOUNT = new Dimensions(R0, R0, R0, R0, R0, R1, R0);
        Dimensions.INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1);
        return Dimensions;
    }());
    exports.Dimensions = Dimensions;
});

define('davinci-units/math/bezier2',["require", "exports"], function (require, exports) {
    "use strict";
    function b2p0(t, p) {
        var k = 1 - t;
        return k * k * p;
    }
    function b2p1(t, p) {
        return 2 * (1 - t) * t * p;
    }
    function b2p2(t, p) {
        return t * t * p;
    }
    function b2(t, begin, control, end) {
        return b2p0(t, begin) + b2p1(t, control) + b2p2(t, end);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = b2;
});

define('davinci-units/math/bezier3',["require", "exports"], function (require, exports) {
    "use strict";
    function b3p0(t, p) {
        var k = 1 - t;
        return k * k * k * p;
    }
    function b3p1(t, p) {
        var k = 1 - t;
        return 3 * k * k * t * p;
    }
    function b3p2(t, p) {
        var k = 1 - t;
        return 3 * k * t * t * p;
    }
    function b3p3(t, p) {
        return t * t * t * p;
    }
    function default_1(t, p0, p1, p2, p3) {
        return b3p0(t, p0) + b3p1(t, p1) + b3p2(t, p2) + b3p3(t, p3);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-units/math/extE2',["require", "exports"], function (require, exports) {
    "use strict";
    function extE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a2 * b0);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = extE2;
});

define('davinci-units/math/gauss',["require", "exports"], function (require, exports) {
    "use strict";
    var abs = Math.abs;
    function makeColumnVector(n, v) {
        var a = [];
        for (var i = 0; i < n; i++) {
            a.push(v);
        }
        return a;
    }
    function rowWithMaximumInColumn(A, column, N) {
        var biggest = abs(A[column][column]);
        var maxRow = column;
        for (var row = column + 1; row < N; row++) {
            if (abs(A[row][column]) > biggest) {
                biggest = abs(A[row][column]);
                maxRow = row;
            }
        }
        return maxRow;
    }
    function swapRows(A, i, j, N) {
        var colLength = N + 1;
        for (var column = i; column < colLength; column++) {
            var temp = A[j][column];
            A[j][column] = A[i][column];
            A[i][column] = temp;
        }
    }
    function makeZeroBelow(A, i, N) {
        for (var row = i + 1; row < N; row++) {
            var c = -A[row][i] / A[i][i];
            for (var column = i; column < N + 1; column++) {
                if (i === column) {
                    A[row][column] = 0;
                }
                else {
                    A[row][column] += c * A[i][column];
                }
            }
        }
    }
    function solve(A, N) {
        var x = makeColumnVector(N, 0);
        for (var i = N - 1; i > -1; i--) {
            x[i] = A[i][N] / A[i][i];
            for (var k = i - 1; k > -1; k--) {
                A[k][N] -= A[k][i] * x[i];
            }
        }
        return x;
    }
    function gauss(A, b) {
        var N = A.length;
        for (var i = 0; i < N; i++) {
            var Ai = A[i];
            var bi = b[i];
            Ai.push(bi);
        }
        for (var j = 0; j < N; j++) {
            swapRows(A, j, rowWithMaximumInColumn(A, j, N), N);
            makeZeroBelow(A, j, N);
        }
        return solve(A, N);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gauss;
});

define('davinci-units/math/lcoE2',["require", "exports"], function (require, exports) {
    "use strict";
    function lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 - a2 * b3);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b3);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = lcoE2;
});

define('davinci-units/math/mulE2',["require", "exports"], function (require, exports) {
    "use strict";
    function mulE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulE2;
});

define('davinci-units/i18n/notImplemented',["require", "exports", '../checks/mustBeString'], function (require, exports, mustBeString_1) {
    "use strict";
    function default_1(name) {
        mustBeString_1.default('name', name);
        var message = {
            get message() {
                return "'" + name + "' method is not yet implemented.";
            }
        };
        return message;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-units/math/rcoE2',["require", "exports"], function (require, exports) {
    "use strict";
    function rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
                }
                break;
            case 1:
                {
                    x = +(-a1 * b0 - a3 * b2);
                }
                break;
            case 2:
                {
                    x = +(-a2 * b0 + a3 * b1);
                }
                break;
            case 3:
                {
                    x = +(a3 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rcoE2;
});

define('davinci-units/math/scpE2',["require", "exports"], function (require, exports) {
    "use strict";
    function scpE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        switch (index) {
            case 0:
                return a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
            case 1:
                return 0;
            case 2:
                return 0;
            case 3:
                return 0;
            default:
                throw new Error("index must be in the range [0..3]");
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = scpE2;
});

define('davinci-units/checks/isDefined',["require", "exports"], function (require, exports) {
    "use strict";
    function isDefined(arg) {
        return (typeof arg !== 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isDefined;
});

define('davinci-units/checks/isArray',["require", "exports"], function (require, exports) {
    "use strict";
    function isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isArray;
});

define('davinci-units/checks/mustBeArray',["require", "exports", '../checks/mustSatisfy', '../checks/isArray'], function (require, exports, mustSatisfy_1, isArray_1) {
    "use strict";
    function beAnArray() {
        return "be an array";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isArray_1.default(value), beAnArray, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-units/math/stringFromCoordinates',["require", "exports", '../checks/isDefined', '../checks/mustBeArray'], function (require, exports, isDefined_1, mustBeArray_1) {
    "use strict";
    function isLabelOne(label) {
        if (typeof label === 'string') {
            return label === "1";
        }
        else {
            var labels = mustBeArray_1.default('label', label);
            if (labels.length === 2) {
                return isLabelOne(labels[0]) && isLabelOne(labels[1]);
            }
            else if (labels.length === 1) {
                return isLabelOne(labels[0]);
            }
            else {
                return false;
            }
        }
    }
    function appendLabel(coord, label, sb) {
        if (typeof label === 'string') {
            sb.push(label);
        }
        else {
            var labels = mustBeArray_1.default('label', label);
            if (labels.length === 2) {
                sb.push(coord > 0 ? labels[1] : labels[0]);
            }
            else if (labels.length === 1) {
                sb.push(labels[0]);
            }
            else if (labels.length === 0) {
            }
            else {
                throw new Error("Unexpected basis label array length: " + labels.length);
            }
        }
    }
    function appendCoord(coord, numberToString, label, sb) {
        if (coord !== 0) {
            if (coord >= 0) {
                if (sb.length > 0) {
                    sb.push("+");
                }
            }
            else {
                if (typeof label === 'string') {
                    sb.push("-");
                }
                else {
                    var labels = mustBeArray_1.default('label', label);
                    if (labels.length === 2) {
                        if (labels[0] !== labels[1]) {
                            if (sb.length > 0) {
                                sb.push("+");
                            }
                        }
                        else {
                            sb.push("-");
                        }
                    }
                    else if (labels.length === 1) {
                        sb.push("-");
                    }
                    else {
                        sb.push("-");
                    }
                }
            }
            var n = Math.abs(coord);
            if (n === 1) {
                appendLabel(coord, label, sb);
            }
            else {
                sb.push(numberToString(n));
                if (!isLabelOne(label)) {
                    sb.push("*");
                    appendLabel(coord, label, sb);
                }
                else {
                }
            }
        }
        else {
        }
    }
    function stringFromCoordinates(coordinates, numberToString, labels) {
        var sb = [];
        for (var i = 0, iLength = coordinates.length; i < iLength; i++) {
            var coord = coordinates[i];
            if (isDefined_1.default(coord)) {
                appendCoord(coord, numberToString, labels[i], sb);
            }
            else {
                return void 0;
            }
        }
        return sb.length > 0 ? sb.join("") : "0";
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = stringFromCoordinates;
});

define('davinci-units/math/Unit',["require", "exports", '../math/Dimensions', '../i18n/notImplemented', '../i18n/notSupported'], function (require, exports, Dimensions_1, notImplemented_1, notSupported_1) {
    "use strict";
    var SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];
    var patterns = [
        [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
        [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1]
    ];
    var decodes = [
        ["F/m"],
        ["S"],
        ["F"],
        ["C/kg"],
        ["C/m ** 3"],
        ["J/kg"],
        ["Hz"],
        ["A"],
        ["m/s ** 2"],
        ["m/s"],
        ["kg·m/s"],
        ["Pa"],
        ["Pa·s"],
        ["W/m ** 2"],
        ["N/m"],
        ["T"],
        ["W/(m·K)"],
        ["V/m"],
        ["N"],
        ["H/m"],
        ["J/K"],
        ["J/(kg·K)"],
        ["J/(mol·K)"],
        ["J/mol"],
        ["J"],
        ["J·s"],
        ["W"],
        ["V"],
        ["Ω"],
        ["H"],
        ["Wb"]
    ];
    var dumbString = function (multiplier, formatted, dimensions, labels) {
        var stringify = function (rational, label) {
            if (rational.numer === 0) {
                return null;
            }
            else if (rational.denom === 1) {
                if (rational.numer === 1) {
                    return "" + label;
                }
                else {
                    return "" + label + " ** " + rational.numer;
                }
            }
            return "" + label + " ** " + rational;
        };
        var operatorStr = multiplier === 1 || dimensions.isOne() ? "" : " ";
        var scaleString = multiplier === 1 ? "" : formatted;
        var unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
            return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
    };
    var unitString = function (multiplier, formatted, dimensions, labels, compact) {
        var M = dimensions.M;
        var L = dimensions.L;
        var T = dimensions.T;
        var Q = dimensions.Q;
        var temperature = dimensions.temperature;
        var amount = dimensions.amount;
        var intensity = dimensions.intensity;
        for (var i = 0, len = patterns.length; i < len; i++) {
            var pattern = patterns[i];
            if (M.numer === pattern[0] && M.denom === pattern[1] &&
                L.numer === pattern[2] && L.denom === pattern[3] &&
                T.numer === pattern[4] && T.denom === pattern[5] &&
                Q.numer === pattern[6] && Q.denom === pattern[7] &&
                temperature.numer === pattern[8] && temperature.denom === pattern[9] &&
                amount.numer === pattern[10] && amount.denom === pattern[11] &&
                intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
                if (!compact) {
                    return multiplier + " * " + decodes[i][0];
                }
                else {
                    if (multiplier !== 1) {
                        return multiplier + " * " + decodes[i][0];
                    }
                    else {
                        return decodes[i][0];
                    }
                }
            }
        }
        return dumbString(multiplier, formatted, dimensions, labels);
    };
    function add(lhs, rhs) {
        return new Unit(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function sub(lhs, rhs) {
        return new Unit(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function mul(lhs, rhs) {
        return new Unit(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
    }
    function scale(α, unit) {
        return new Unit(α * unit.multiplier, unit.dimensions, unit.labels);
    }
    function div(lhs, rhs) {
        return new Unit(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
    }
    var Unit = (function () {
        function Unit(multiplier, dimensions, labels) {
            this.multiplier = multiplier;
            this.dimensions = dimensions;
            this.labels = labels;
            if (labels.length !== 7) {
                throw new Error("Expecting 7 elements in the labels array.");
            }
            this.multiplier = multiplier;
            this.dimensions = dimensions;
            this.labels = labels;
        }
        Unit.prototype.compatible = function (rhs) {
            if (rhs instanceof Unit) {
                this.dimensions.compatible(rhs.dimensions);
                return this;
            }
            else {
                throw new Error("Illegal Argument for Unit.compatible: " + rhs);
            }
        };
        Unit.prototype.add = function (rhs) {
            return add(this, rhs);
        };
        Unit.prototype.__add__ = function (rhs) {
            if (rhs instanceof Unit) {
                return add(this, rhs);
            }
            else {
                return;
            }
        };
        Unit.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Unit) {
                return add(lhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.sub = function (rhs) {
            return sub(this, rhs);
        };
        Unit.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Unit) {
                return sub(this, rhs);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Unit) {
                return sub(lhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.mul = function (rhs) {
            return mul(this, rhs);
        };
        Unit.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Unit) {
                return mul(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return scale(rhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Unit) {
                return mul(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return scale(lhs, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.div = function (rhs) {
            return div(this, rhs);
        };
        Unit.prototype.divByScalar = function (α) {
            return new Unit(this.multiplier / α, this.dimensions, this.labels);
        };
        Unit.prototype.__div__ = function (other) {
            if (other instanceof Unit) {
                return div(this, other);
            }
            else if (typeof other === 'number') {
                return new Unit(this.multiplier / other, this.dimensions, this.labels);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rdiv__ = function (other) {
            if (other instanceof Unit) {
                return div(other, this);
            }
            else if (typeof other === 'number') {
                return new Unit(other / this.multiplier, this.dimensions.inv(), this.labels);
            }
            else {
                return;
            }
        };
        Unit.prototype.pattern = function () {
            var ns = [];
            ns.push(this.dimensions.M.numer);
            ns.push(this.dimensions.M.denom);
            ns.push(this.dimensions.L.numer);
            ns.push(this.dimensions.L.denom);
            ns.push(this.dimensions.T.numer);
            ns.push(this.dimensions.T.denom);
            ns.push(this.dimensions.Q.numer);
            ns.push(this.dimensions.Q.denom);
            ns.push(this.dimensions.temperature.numer);
            ns.push(this.dimensions.temperature.denom);
            ns.push(this.dimensions.amount.numer);
            ns.push(this.dimensions.amount.denom);
            ns.push(this.dimensions.intensity.numer);
            ns.push(this.dimensions.intensity.denom);
            return JSON.stringify(ns);
        };
        Unit.prototype.pow = function (exponent) {
            return new Unit(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
        };
        Unit.prototype.inv = function () {
            return new Unit(1 / this.multiplier, this.dimensions.inv(), this.labels);
        };
        Unit.prototype.neg = function () {
            return new Unit(-this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.isOne = function () {
            return this.dimensions.isOne() && (this.multiplier === 1);
        };
        Unit.prototype.isZero = function () {
            return this.multiplier === 0;
        };
        Unit.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        Unit.prototype.norm = function () {
            return new Unit(Math.abs(this.multiplier), this.dimensions, this.labels);
        };
        Unit.prototype.quad = function () {
            return new Unit(this.multiplier * this.multiplier, this.dimensions.mul(this.dimensions), this.labels);
        };
        Unit.prototype.reflect = function (n) {
            return this;
        };
        Unit.prototype.rotate = function (rotor) {
            return this;
        };
        Unit.prototype.scale = function (α) {
            return new Unit(this.multiplier * α, this.dimensions, this.labels);
        };
        Unit.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        Unit.prototype.sqrt = function () {
            return new Unit(Math.sqrt(this.multiplier), this.dimensions.sqrt(), this.labels);
        };
        Unit.prototype.stress = function (σ) {
            throw new Error(notSupported_1.default('stress').message);
        };
        Unit.prototype.toExponential = function (fractionDigits, compact) {
            return unitString(this.multiplier, this.multiplier.toExponential(fractionDigits), this.dimensions, this.labels, compact);
        };
        Unit.prototype.toFixed = function (fractionDigits, compact) {
            return unitString(this.multiplier, this.multiplier.toFixed(fractionDigits), this.dimensions, this.labels, compact);
        };
        Unit.prototype.toPrecision = function (precision, compact) {
            return unitString(this.multiplier, this.multiplier.toPrecision(precision), this.dimensions, this.labels, compact);
        };
        Unit.prototype.toString = function (radix, compact) {
            return unitString(this.multiplier, this.multiplier.toString(radix), this.dimensions, this.labels, compact);
        };
        Unit.prototype.__pos__ = function () {
            return this;
        };
        Unit.prototype.__neg__ = function () {
            return this.neg();
        };
        Unit.isOne = function (uom) {
            if (uom === void 0) {
                return true;
            }
            else if (uom instanceof Unit) {
                return uom.isOne();
            }
            else {
                throw new Error("isOne argument must be a Unit or undefined.");
            }
        };
        Unit.assertDimensionless = function (uom) {
            if (!Unit.isOne(uom)) {
                throw new Error("uom must be dimensionless.");
            }
        };
        Unit.compatible = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.compatible(rhs);
                }
                else {
                    if (lhs.isOne()) {
                        return void 0;
                    }
                    else {
                        throw new Error(lhs + " is incompatible with 1");
                    }
                }
            }
            else {
                if (rhs) {
                    if (rhs.isOne()) {
                        return void 0;
                    }
                    else {
                        throw new Error("1 is incompatible with " + rhs);
                    }
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.mul = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.mul(rhs);
                }
                else if (Unit.isOne(rhs)) {
                    return lhs;
                }
                else {
                    return void 0;
                }
            }
            else if (Unit.isOne(lhs)) {
                return rhs;
            }
            else {
                return void 0;
            }
        };
        Unit.div = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.div(rhs);
                }
                else {
                    return lhs;
                }
            }
            else {
                if (rhs) {
                    return rhs.inv();
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.sqrt = function (uom) {
            if (typeof uom !== 'undefined') {
                if (!uom.isOne()) {
                    return new Unit(Math.sqrt(uom.multiplier), uom.dimensions.sqrt(), uom.labels);
                }
                else {
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        };
        Unit.ZERO = new Unit(0.0, Dimensions_1.Dimensions.ONE, SYMBOLS_SI);
        Unit.ONE = new Unit(1.0, Dimensions_1.Dimensions.ONE, SYMBOLS_SI);
        Unit.KILOGRAM = new Unit(1.0, Dimensions_1.Dimensions.MASS, SYMBOLS_SI);
        Unit.METER = new Unit(1.0, Dimensions_1.Dimensions.LENGTH, SYMBOLS_SI);
        Unit.SECOND = new Unit(1.0, Dimensions_1.Dimensions.TIME, SYMBOLS_SI);
        Unit.COULOMB = new Unit(1.0, Dimensions_1.Dimensions.CHARGE, SYMBOLS_SI);
        Unit.AMPERE = new Unit(1.0, Dimensions_1.Dimensions.CURRENT, SYMBOLS_SI);
        Unit.KELVIN = new Unit(1.0, Dimensions_1.Dimensions.TEMPERATURE, SYMBOLS_SI);
        Unit.MOLE = new Unit(1.0, Dimensions_1.Dimensions.AMOUNT, SYMBOLS_SI);
        Unit.CANDELA = new Unit(1.0, Dimensions_1.Dimensions.INTENSITY, SYMBOLS_SI);
        return Unit;
    }());
    exports.Unit = Unit;
});

define('davinci-units/math/G2',["require", "exports", './bezier2', './bezier3', './extE2', './gauss', './lcoE2', './mulE2', '../i18n/notImplemented', '../i18n/notSupported', '../i18n/readOnly', './rcoE2', './scpE2', './stringFromCoordinates', './Unit'], function (require, exports, bezier2_1, bezier3_1, extE2_1, gauss_1, lcoE2_1, mulE2_1, notImplemented_1, notSupported_1, readOnly_1, rcoE2_1, scpE2_1, stringFromCoordinates_1, Unit_1) {
    "use strict";
    var COORD_SCALAR = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_PSEUDO = 3;
    function add00(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a00 + b00);
    }
    function add01(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a01 + b01);
    }
    function add10(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a10 + b10);
    }
    function add11(a00, a01, a10, a11, b00, b01, b10, b11) {
        a00 = +a00;
        a01 = +a01;
        a10 = +a10;
        a11 = +a11;
        b00 = +b00;
        b01 = +b01;
        b10 = +b10;
        b11 = +b11;
        return +(a11 + b11);
    }
    function subE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 - b0);
                }
                break;
            case 1:
                {
                    x = +(a1 - b1);
                }
                break;
            case 2:
                {
                    x = +(a2 - b2);
                }
                break;
            case 3:
                {
                    x = +(a3 - b3);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
    }
    var G2 = (function () {
        function G2(α, x, y, β, uom) {
            if (α === void 0) { α = 0; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (β === void 0) { β = 0; }
            this._coords = [0, 0, 0, 0];
            this._coords[COORD_SCALAR] = α;
            this._coords[COORD_X] = x;
            this._coords[COORD_Y] = y;
            this._coords[COORD_PSEUDO] = β;
            this.uom = uom;
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this._coords[COORD_SCALAR] *= multiplier;
                this._coords[COORD_X] *= multiplier;
                this._coords[COORD_Y] *= multiplier;
                this._coords[COORD_PSEUDO] *= multiplier;
                this.uom = new Unit_1.Unit(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(G2, "zero", {
            get: function () {
                return G2._zero;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('zero').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "one", {
            get: function () {
                return G2._one;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('one').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "e1", {
            get: function () {
                return G2._e1;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('e1').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "e2", {
            get: function () {
                return G2._e2;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('e2').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2, "I", {
            get: function () {
                return G2._I;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('I').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "a", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('a').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "x", {
            get: function () {
                return this._coords[COORD_X];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "y", {
            get: function () {
                return this._coords[COORD_Y];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G2.prototype, "b", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('b').message);
            },
            enumerable: true,
            configurable: true
        });
        G2.fromCartesian = function (α, x, y, β, uom) {
            return new G2(α, x, y, β, uom);
        };
        Object.defineProperty(G2.prototype, "coords", {
            get: function () {
                return [this.a, this.x, this.y, this.b];
            },
            enumerable: true,
            configurable: true
        });
        G2.prototype.coordinate = function (index) {
            switch (index) {
                case 0:
                    return this.a;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.b;
                default:
                    throw new Error("index must be in the range [0..3]");
            }
        };
        G2.add = function (a, b) {
            var a00 = a[0];
            var a01 = a[1];
            var a10 = a[2];
            var a11 = a[3];
            var b00 = b[0];
            var b01 = b[1];
            var b10 = b[2];
            var b11 = b[3];
            var x00 = add00(a00, a01, a10, a11, b00, b01, b10, b11);
            var x01 = add01(a00, a01, a10, a11, b00, b01, b10, b11);
            var x10 = add10(a00, a01, a10, a11, b00, b01, b10, b11);
            var x11 = add11(a00, a01, a10, a11, b00, b01, b10, b11);
            return [x00, x01, x10, x11];
        };
        G2.prototype.add = function (rhs) {
            var xs = G2.add(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.Unit.compatible(this.uom, rhs.uom));
        };
        G2.prototype.addPseudo = function (β) {
            return new G2(this.a, this.x, this.y, this.b + β.multiplier, Unit_1.Unit.compatible(this.uom, β));
        };
        G2.prototype.addScalar = function (α) {
            return new G2(this.a + α.multiplier, this.x, this.y, this.b, Unit_1.Unit.compatible(this.uom, α));
        };
        G2.prototype.__add__ = function (other) {
            if (other instanceof G2) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return this.add(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__radd__ = function (other) {
            if (other instanceof G2) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).add(this);
            }
        };
        G2.prototype.adj = function () {
            throw new Error(notImplemented_1.default('adj').message);
        };
        G2.prototype.angle = function () {
            return this.log().grade(2);
        };
        G2.prototype.conj = function () {
            throw new Error(notImplemented_1.default('conj').message);
        };
        G2.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var α = bezier3_1.default(t, this.a, controlBegin.a, controlEnd.a, endPoint.a);
            var x = bezier3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = bezier3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var β = bezier3_1.default(t, this.b, controlBegin.b, controlEnd.b, endPoint.b);
            return new G2(α, x, y, β, this.uom);
        };
        G2.prototype.direction = function () {
            var m = this.magnitudeSansUnits();
            if (m !== 1) {
                return new G2(this.a / m, this.x / m, this.y / m, this.b / m);
            }
            else {
                if (this.uom) {
                    return new G2(this.a, this.x, this.y, this.b);
                }
                else {
                    return this;
                }
            }
        };
        G2.prototype.distanceTo = function (point) {
            throw new Error(notImplemented_1.default('distanceTo').message);
        };
        G2.prototype.equals = function (point) {
            throw new Error(notImplemented_1.default('equals').message);
        };
        G2.sub = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.sub = function (rhs) {
            var xs = G2.sub(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.Unit.compatible(this.uom, rhs.uom));
        };
        G2.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G2) {
                return this.sub(rhs);
            }
            else if (rhs instanceof Unit_1.Unit) {
                return this.addScalar(rhs.neg());
            }
            else if (typeof rhs === 'number') {
                return this.sub(new G2(rhs, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G2) {
                return lhs.sub(this);
            }
            else if (lhs instanceof Unit_1.Unit) {
                return this.neg().addScalar(lhs);
            }
            else if (typeof lhs === 'number') {
                return new G2(lhs, 0, 0, 0, undefined).sub(this);
            }
        };
        G2.prototype.mul = function (rhs) {
            var a0 = this.a;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.b;
            var b0 = rhs.a;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.b;
            var c0 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var c1 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var c2 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var c3 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return new G2(c0, c1, c2, c3, Unit_1.Unit.mul(this.uom, rhs.uom));
        };
        G2.prototype.__mul__ = function (other) {
            if (other instanceof G2) {
                return this.mul(other);
            }
            else if (typeof other === 'number') {
                return this.mul(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rmul__ = function (other) {
            if (other instanceof G2) {
                var lhs = other;
                return lhs.mul(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new G2(w, 0, 0, 0, undefined).mul(this);
            }
        };
        G2.prototype.scale = function (α) {
            return new G2(this.a * α, this.x * α, this.y * α, this.b * α, this.uom);
        };
        G2.prototype.div = function (rhs) {
            return this.mul(rhs.inv());
        };
        G2.prototype.divByScalar = function (α) {
            return new G2(this.a / α, this.x / α, this.y / α, this.b / α, this.uom);
        };
        G2.prototype.__div__ = function (other) {
            if (other instanceof G2) {
                return this.div(other);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.div(new G2(w, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rdiv__ = function (other) {
            if (other instanceof G2) {
                return other.div(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).div(this);
            }
        };
        G2.prototype.scp = function (rhs) {
            var a0 = this.a;
            var a1 = this.x;
            var a2 = this.y;
            var a3 = this.b;
            var b0 = rhs.a;
            var b1 = rhs.x;
            var b2 = rhs.y;
            var b3 = rhs.b;
            var c0 = scpE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            return new G2(c0, 0, 0, 0, Unit_1.Unit.mul(this.uom, rhs.uom));
        };
        G2.ext = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.ext = function (rhs) {
            var xs = G2.ext(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.Unit.mul(this.uom, rhs.uom));
        };
        G2.prototype.__wedge__ = function (other) {
            if (other instanceof G2) {
                var rhs = other;
                return this.ext(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.ext(new G2(w, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rwedge__ = function (other) {
            if (other instanceof G2) {
                var lhs = other;
                return lhs.ext(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new G2(w, 0, 0, 0, undefined).ext(this);
            }
        };
        G2.lshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        G2.prototype.lco = function (rhs) {
            var xs = G2.lshift(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.Unit.mul(this.uom, rhs.uom));
        };
        G2.prototype.__lshift__ = function (other) {
            if (other instanceof G2) {
                var rhs = other;
                return this.lco(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.lco(new G2(w, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rlshift__ = function (other) {
            if (other instanceof G2) {
                var lhs = other;
                return lhs.lco(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new G2(w, 0, 0, 0, undefined).lco(this);
            }
        };
        G2.rshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        G2.prototype.rco = function (rhs) {
            var xs = G2.rshift(this.coords, rhs.coords);
            return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.Unit.mul(this.uom, rhs.uom));
        };
        G2.prototype.__rshift__ = function (other) {
            if (other instanceof G2) {
                return this.rco(other);
            }
            else if (typeof other === 'number') {
                return this.rco(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rrshift__ = function (other) {
            if (other instanceof G2) {
                return other.rco(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).rco(this);
            }
        };
        G2.prototype.__vbar__ = function (other) {
            if (other instanceof G2) {
                return this.scp(other);
            }
            else if (typeof other === 'number') {
                return this.scp(new G2(other, 0, 0, 0, undefined));
            }
        };
        G2.prototype.__rvbar__ = function (other) {
            if (other instanceof G2) {
                return other.scp(this);
            }
            else if (typeof other === 'number') {
                return new G2(other, 0, 0, 0, undefined).scp(this);
            }
        };
        G2.prototype.pow = function (exponent) {
            throw new Error(notImplemented_1.default('pow').message);
        };
        G2.prototype.__bang__ = function () {
            return this.inv();
        };
        G2.prototype.__pos__ = function () {
            return this;
        };
        G2.prototype.neg = function () {
            return new G2(-this.a, -this.x, -this.y, -this.b, this.uom);
        };
        G2.prototype.__neg__ = function () {
            return this.neg();
        };
        G2.prototype.__tilde__ = function () {
            return this.rev();
        };
        G2.prototype.grade = function (grade) {
            switch (grade) {
                case 0:
                    return new G2(this.a, 0, 0, 0, this.uom);
                case 1:
                    return new G2(0, this.x, this.y, 0, this.uom);
                case 2:
                    return new G2(0, 0, 0, this.b, this.uom);
                default:
                    return new G2(0, 0, 0, 0, this.uom);
            }
        };
        G2.prototype.cos = function () {
            throw new Error(notImplemented_1.default('cos').message);
        };
        G2.prototype.cosh = function () {
            throw new Error(notImplemented_1.default('cosh').message);
        };
        G2.prototype.exp = function () {
            Unit_1.Unit.assertDimensionless(this.uom);
            if (this.isSpinor()) {
                var expα = Math.exp(this.a);
                var cosβ = Math.cos(this.b);
                var sinβ = Math.sin(this.b);
                return new G2(expα * cosβ, 0, 0, expα * sinβ);
            }
            else {
                throw new Error(notImplemented_1.default("exp(" + this.toString() + ")").message);
            }
        };
        G2.prototype.inv = function () {
            var α = this.a;
            var x = this.x;
            var y = this.y;
            var β = this.b;
            var A = [
                [α, x, y, -β],
                [x, α, β, -y],
                [y, -β, α, x],
                [β, -y, x, α]
            ];
            var b = [1, 0, 0, 0];
            var X = gauss_1.default(A, b);
            var uom = this.uom ? this.uom.inv() : void 0;
            return new G2(X[0], X[1], X[2], X[3], uom);
        };
        G2.prototype.isSpinor = function () {
            return this.x === 0 && this.y === 0;
        };
        G2.prototype.log = function () {
            Unit_1.Unit.assertDimensionless(this.uom);
            if (this.isSpinor()) {
                var α = this.a;
                var β = this.b;
                var a = Math.log(Math.sqrt(α * α + β * β));
                var b = Math.atan2(β, α);
                return new G2(a, 0, 0, b, void 0);
            }
            else {
                throw new Error(notImplemented_1.default("log(" + this.toString() + ")").message);
            }
        };
        G2.prototype.magnitude = function () {
            return this.norm();
        };
        G2.prototype.magnitudeSansUnits = function () {
            return Math.sqrt(this.squaredNormSansUnits());
        };
        G2.prototype.norm = function () {
            return new G2(this.magnitudeSansUnits(), 0, 0, 0, this.uom);
        };
        G2.prototype.quad = function () {
            return new G2(this.squaredNormSansUnits(), 0, 0, 0, Unit_1.Unit.mul(this.uom, this.uom));
        };
        G2.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var α = bezier2_1.default(t, this.a, controlPoint.a, endPoint.a);
            var x = bezier2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = bezier2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var β = bezier2_1.default(t, this.b, controlPoint.b, endPoint.b);
            return new G2(α, x, y, β, this.uom);
        };
        G2.prototype.squaredNorm = function () {
            return this.quad();
        };
        G2.prototype.squaredNormSansUnits = function () {
            var α = this.a;
            var x = this.x;
            var y = this.y;
            var β = this.b;
            return α * α + x * x + y * y + β * β;
        };
        G2.prototype.stress = function (σ) {
            throw new Error(notSupported_1.default('stress').message);
        };
        G2.prototype.reflect = function (n) {
            var m = G2.fromVectorE2(n);
            return m.mul(this).mul(m).scale(-1);
        };
        G2.prototype.rev = function () {
            return new G2(this.a, this.x, this.y, -this.b, this.uom);
        };
        G2.prototype.rotate = function (spinor) {
            var x = this.x;
            var y = this.y;
            var α = spinor.a;
            var β = spinor.b;
            var α2 = α * α;
            var β2 = β * β;
            var p = α2 - β2;
            var q = 2 * α * β;
            var s = α2 + β2;
            return new G2(s * this.a, p * x + q * y, p * y - q * x, s * this.b, this.uom);
        };
        G2.prototype.sin = function () {
            throw new Error(notImplemented_1.default('sin').message);
        };
        G2.prototype.sinh = function () {
            throw new Error(notImplemented_1.default('sinh').message);
        };
        G2.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        G2.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        G2.prototype.isOne = function () { return this.a === 1 && this.x === 0 && this.y === 0 && this.b === 0; };
        G2.prototype.isNaN = function () { return isNaN(this.a) || isNaN(this.x) || isNaN(this.y) || isNaN(this.b); };
        G2.prototype.isScalar = function () { return this.x === 0 && this.y === 0 && this.b === 0; };
        G2.prototype.isZero = function () { return this.a === 0 && this.x === 0 && this.y === 0 && this.b === 0; };
        G2.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
            if (this.uom) {
                var unitString = this.uom.toString().trim();
                if (unitString) {
                    return quantityString + ' ' + unitString;
                }
                else {
                    return quantityString;
                }
            }
            else {
                return quantityString;
            }
        };
        G2.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toStringIJK = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
        };
        G2.prototype.__eq__ = function (rhs) {
            if (rhs instanceof G2) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in equality expression: " + this.uom.dimensions + " === " + rhs.uom.dimensions);
                }
                return this.a === rhs.a && this.x === rhs.x && this.y === rhs.y && this.b === rhs.b;
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__ne__ = function (rhs) {
            if (rhs instanceof G2) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in inequality expression: " + this.uom.dimensions + " !== " + rhs.uom.dimensions);
                }
                return this.a !== rhs.a ||
                    this.x !== rhs.x ||
                    this.y !== rhs.y ||
                    this.b !== this.b;
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__ge__ = function (rhs) {
            if (rhs instanceof G2) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in comparison expression: " + this.uom.dimensions + " >= " + rhs.uom.dimensions);
                }
                if (!this.isScalar()) {
                    throw new Error("left operand (" + this + ") in comparison expression must be a scalar.");
                }
                if (!rhs.isScalar()) {
                    throw new Error("right operand (" + rhs + ") in comparison expression must be a scalar.");
                }
                return this.a >= rhs.a;
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__gt__ = function (rhs) {
            if (rhs instanceof G2) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in comparison expression: " + this.uom.dimensions + " > " + rhs.uom.dimensions);
                }
                if (!this.isScalar()) {
                    throw new Error("left operand (" + this + ") in comparison expression must be a scalar.");
                }
                if (!rhs.isScalar()) {
                    throw new Error("right operand (" + rhs + ") in comparison expression must be a scalar.");
                }
                return this.a > rhs.a;
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__le__ = function (rhs) {
            if (rhs instanceof G2) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in comparison expression: " + this.uom.dimensions + " <= " + rhs.uom.dimensions);
                }
                if (!this.isScalar()) {
                    throw new Error("left operand (" + this + ") in comparison expression must be a scalar.");
                }
                if (!rhs.isScalar()) {
                    throw new Error("right operand (" + rhs + ") in comparison expression must be a scalar.");
                }
                return this.a <= rhs.a;
            }
            else {
                return void 0;
            }
        };
        G2.prototype.__lt__ = function (rhs) {
            if (rhs instanceof G2) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in comparison expression: " + this.uom.dimensions + " < " + rhs.uom.dimensions);
                }
                if (!this.isScalar()) {
                    throw new Error("left operand (" + this + ") in comparison expression must be a scalar.");
                }
                if (!rhs.isScalar()) {
                    throw new Error("right operand (" + rhs + ") in comparison expression must be a scalar.");
                }
                return this.a < rhs.a;
            }
            else {
                return void 0;
            }
        };
        G2.copy = function (m) {
            if (m instanceof G2) {
                return m;
            }
            else {
                return new G2(m.a, m.x, m.y, m.b, void 0);
            }
        };
        G2.fromVectorE2 = function (vector) {
            if (vector) {
                if (vector instanceof G2) {
                    return new G2(0, vector.x, vector.y, 0, vector.uom);
                }
                else {
                    return new G2(0, vector.x, vector.y, 0, void 0);
                }
            }
            else {
                return void 0;
            }
        };
        G2.vector = function (x, y, uom) {
            return new G2(0, x, y, 0, uom);
        };
        G2._zero = new G2(0, 0, 0, 0);
        G2._one = new G2(1, 0, 0, 0);
        G2._e1 = new G2(0, 1, 0, 0);
        G2._e2 = new G2(0, 0, 1, 0);
        G2._I = new G2(0, 0, 0, 1);
        G2.kilogram = new G2(1, 0, 0, 0, Unit_1.Unit.KILOGRAM);
        G2.meter = new G2(1, 0, 0, 0, Unit_1.Unit.METER);
        G2.second = new G2(1, 0, 0, 0, Unit_1.Unit.SECOND);
        G2.coulomb = new G2(1, 0, 0, 0, Unit_1.Unit.COULOMB);
        G2.ampere = new G2(1, 0, 0, 0, Unit_1.Unit.AMPERE);
        G2.kelvin = new G2(1, 0, 0, 0, Unit_1.Unit.KELVIN);
        G2.mole = new G2(1, 0, 0, 0, Unit_1.Unit.MOLE);
        G2.candela = new G2(1, 0, 0, 0, Unit_1.Unit.CANDELA);
        return G2;
    }());
    exports.G2 = G2;
});

define('davinci-units/math/compG3Get',["require", "exports"], function (require, exports) {
    "use strict";
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_XYZ = 7;
    function gcompE3(m, index) {
        switch (index) {
            case COORD_W: {
                return m.a;
            }
            case COORD_X: {
                return m.x;
            }
            case COORD_Y: {
                return m.y;
            }
            case COORD_Z: {
                return m.z;
            }
            case COORD_XY: {
                return m.xy;
            }
            case COORD_YZ: {
                return m.yz;
            }
            case COORD_ZX: {
                return m.zx;
            }
            case COORD_XYZ: {
                return m.b;
            }
            default: {
                throw new Error("index => " + index);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gcompE3;
});

define('davinci-units/math/extE3',["require", "exports"], function (require, exports) {
    "use strict";
    function extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a2 * b0);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 + a3 * b0);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a1 * b2 - a2 * b1 + a4 * b0);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a2 * b3 - a3 * b2 + a5 * b0);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 - a1 * b3 + a3 * b1 + a6 * b0);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = extE3;
});

define('davinci-units/math/compG3Set',["require", "exports"], function (require, exports) {
    "use strict";
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_XYZ = 7;
    function compG3Set(m, index, value) {
        switch (index) {
            case COORD_W:
                {
                    m.a = value;
                }
                break;
            case COORD_X:
                {
                    m.x = value;
                }
                break;
            case COORD_Y:
                {
                    m.y = value;
                }
                break;
            case COORD_Z:
                {
                    m.z = value;
                }
                break;
            case COORD_XY:
                {
                    m.xy = value;
                }
                break;
            case COORD_YZ:
                {
                    m.yz = value;
                }
                break;
            case COORD_ZX:
                {
                    m.zx = value;
                }
                break;
            case COORD_XYZ:
                {
                    m.b = value;
                }
                break;
            default:
                throw new Error("index => " + index);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = compG3Set;
});

define('davinci-units/math/extG3',["require", "exports", '../math/compG3Get', '../math/extE3', '../math/compG3Set'], function (require, exports, compG3Get_1, extE3_1, compG3Set_1) {
    "use strict";
    function extG3(a, b, out) {
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set_1.default(out, i, extE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = extG3;
});

define('davinci-units/math/lcoE3',["require", "exports"], function (require, exports) {
    "use strict";
    function lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 - a2 * b4 + a3 * b6 - a5 * b7);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b4 - a3 * b5 - a6 * b7);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 - a1 * b6 + a2 * b5 - a4 * b7);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a3 * b7);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a1 * b7);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 + a2 * b7);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = lcoE3;
});

define('davinci-units/math/lcoG3',["require", "exports", '../math/compG3Get', '../math/lcoE3', '../math/compG3Set'], function (require, exports, compG3Get_1, lcoE3_1, compG3Set_1) {
    "use strict";
    function lcoG3(a, b, out) {
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set_1.default(out, i, lcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = lcoG3;
});

define('davinci-units/math/mulE3',["require", "exports"], function (require, exports) {
    "use strict";
    function mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5);
                }
                break;
            case 2:
                {
                    x = +(a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6);
                }
                break;
            case 3:
                {
                    x = +(a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4);
                }
                break;
            case 4:
                {
                    x = +(a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3);
                }
                break;
            case 5:
                {
                    x = +(a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1);
                }
                break;
            case 6:
                {
                    x = +(a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2);
                }
                break;
            case 7:
                {
                    x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulE3;
});

define('davinci-units/math/mulG3',["require", "exports", '../math/compG3Get', '../math/mulE3'], function (require, exports, compG3Get_1, mulE3_1) {
    "use strict";
    function default_1(a, b, out) {
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.z;
        var a4 = a.xy;
        var a5 = a.yz;
        var a6 = a.zx;
        var a7 = a.b;
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        var iLen = out.length;
        for (var i = 0; i < iLen; i++) {
            out[i] = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-units/math/quadSpinorE3',["require", "exports", '../checks/isDefined', '../checks/isNumber'], function (require, exports, isDefined_1, isNumber_1) {
    "use strict";
    function quadSpinorE3(s) {
        if (isDefined_1.default(s)) {
            var α = s.a;
            var x = s.yz;
            var y = s.zx;
            var z = s.xy;
            if (isNumber_1.default(α) && isNumber_1.default(x) && isNumber_1.default(y) && isNumber_1.default(z)) {
                return α * α + x * x + y * y + z * z;
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = quadSpinorE3;
});

define('davinci-units/math/rcoE3',["require", "exports"], function (require, exports) {
    "use strict";
    function rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        a0 = +a0;
        a1 = +a1;
        a2 = +a2;
        a3 = +a3;
        a4 = +a4;
        a5 = +a5;
        a6 = +a6;
        a7 = +a7;
        b0 = +b0;
        b1 = +b1;
        b2 = +b2;
        b3 = +b3;
        b4 = +b4;
        b5 = +b5;
        b6 = +b6;
        b7 = +b7;
        index = index | 0;
        var x = 0.0;
        switch (~(~index)) {
            case 0:
                {
                    x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
                }
                break;
            case 1:
                {
                    x = +(+a1 * b0 + a4 * b2 - a6 * b3 - a7 * b5);
                }
                break;
            case 2:
                {
                    x = +(+a2 * b0 - a4 * b1 + a5 * b3 - a7 * b6);
                }
                break;
            case 3:
                {
                    x = +(+a3 * b0 - a5 * b2 + a6 * b1 - a7 * b4);
                }
                break;
            case 4:
                {
                    x = +(+a4 * b0 + a7 * b3);
                }
                break;
            case 5:
                {
                    x = +(+a5 * b0 + a7 * b1);
                }
                break;
            case 6:
                {
                    x = +(+a6 * b0 + a7 * b2);
                }
                break;
            case 7:
                {
                    x = +(+a7 * b0);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rcoE3;
});

define('davinci-units/math/rcoG3',["require", "exports", '../math/compG3Get', '../math/rcoE3', '../math/compG3Set'], function (require, exports, compG3Get_1, rcoE3_1, compG3Set_1) {
    "use strict";
    function rcoG3(a, b, out) {
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        for (var i = 0; i < 8; i++) {
            compG3Set_1.default(out, i, rcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
        }
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rcoG3;
});

define('davinci-units/math/scpG3',["require", "exports", '../math/compG3Get', '../math/mulE3', '../math/compG3Set'], function (require, exports, compG3Get_1, mulE3_1, compG3Set_1) {
    "use strict";
    function scpG3(a, b, out) {
        var a0 = compG3Get_1.default(a, 0);
        var a1 = compG3Get_1.default(a, 1);
        var a2 = compG3Get_1.default(a, 2);
        var a3 = compG3Get_1.default(a, 3);
        var a4 = compG3Get_1.default(a, 4);
        var a5 = compG3Get_1.default(a, 5);
        var a6 = compG3Get_1.default(a, 6);
        var a7 = compG3Get_1.default(a, 7);
        var b0 = compG3Get_1.default(b, 0);
        var b1 = compG3Get_1.default(b, 1);
        var b2 = compG3Get_1.default(b, 2);
        var b3 = compG3Get_1.default(b, 3);
        var b4 = compG3Get_1.default(b, 4);
        var b5 = compG3Get_1.default(b, 5);
        var b6 = compG3Get_1.default(b, 6);
        var b7 = compG3Get_1.default(b, 7);
        compG3Set_1.default(out, 0, mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
        compG3Set_1.default(out, 1, 0);
        compG3Set_1.default(out, 2, 0);
        compG3Set_1.default(out, 3, 0);
        compG3Set_1.default(out, 4, 0);
        compG3Set_1.default(out, 5, 0);
        compG3Set_1.default(out, 6, 0);
        compG3Set_1.default(out, 7, 0);
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = scpG3;
});

define('davinci-units/math/squaredNormG3',["require", "exports"], function (require, exports) {
    "use strict";
    function squaredNormG3(m) {
        var a = m.a;
        var x = m.x;
        var y = m.y;
        var z = m.z;
        var yz = m.yz;
        var zx = m.zx;
        var xy = m.xy;
        var b = m.b;
        return a * a + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + b * b;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = squaredNormG3;
});

define('davinci-units/math/BASIS_LABELS_G3_GEOMETRIC',["require", "exports"], function (require, exports) {
    "use strict";
    var SCALAR_POS_SYMBOL = "1";
    var E1_NEG_SYMBOL = "←";
    var E1_POS_SYMBOL = "→";
    var E2_POS_SYMBOL = "↑";
    var E2_NEG_SYMBOL = "↓";
    var E3_POS_SYMBOL = "⊙";
    var E3_NEG_SYMBOL = "⊗";
    var E12_NEG_SYMBOL = "↻";
    var E12_POS_SYMBOL = "↺";
    var E31_POS_SYMBOL = "⊶";
    var E31_NEG_SYMBOL = "⊷";
    var E23_NEG_SYMBOL = "⬘";
    var E23_POS_SYMBOL = "⬙";
    var PSEUDO_POS_SYMBOL = "☐";
    var PSEUDO_NEG_SYMBOL = "■";
    var BASIS_LABELS_G3_GEOMETRIC = [
        [SCALAR_POS_SYMBOL, SCALAR_POS_SYMBOL],
        [E1_NEG_SYMBOL, E1_POS_SYMBOL],
        [E2_NEG_SYMBOL, E2_POS_SYMBOL],
        [E3_NEG_SYMBOL, E3_POS_SYMBOL],
        [E12_NEG_SYMBOL, E12_POS_SYMBOL],
        [E23_NEG_SYMBOL, E23_POS_SYMBOL],
        [E31_NEG_SYMBOL, E31_POS_SYMBOL],
        [PSEUDO_NEG_SYMBOL, PSEUDO_POS_SYMBOL]
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BASIS_LABELS_G3_GEOMETRIC;
});

define('davinci-units/math/BASIS_LABELS_G3_HAMILTON',["require", "exports"], function (require, exports) {
    "use strict";
    var SCALAR_SYMBOL = "1";
    var E1_SYMBOL = "i";
    var E2_SYMBOL = "j";
    var E3_SYMBOL = "k";
    var E12_SYMBOL = "ij";
    var E23_SYMBOL = "jk";
    var E31_SYMBOL = "ki";
    var PSEUDO_SYMBOL = "ijk";
    var BASIS_LABELS_G3_HAMILTON = [
        [SCALAR_SYMBOL],
        [E1_SYMBOL],
        [E2_SYMBOL],
        [E3_SYMBOL],
        [E12_SYMBOL],
        [E23_SYMBOL],
        [E31_SYMBOL],
        [PSEUDO_SYMBOL]
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BASIS_LABELS_G3_HAMILTON;
});

define('davinci-units/math/BASIS_LABELS_G3_STANDARD',["require", "exports"], function (require, exports) {
    "use strict";
    var SCALAR_SYMBOL = "1";
    var E1_SYMBOL = "e1";
    var E2_SYMBOL = "e2";
    var E3_SYMBOL = "e3";
    var E12_SYMBOL = "e12";
    var E23_SYMBOL = "e23";
    var E31_SYMBOL = "e31";
    var PSEUDO_SYMBOL = "I";
    var BASIS_LABELS_G3_STANDARD = [
        [SCALAR_SYMBOL],
        [E1_SYMBOL],
        [E2_SYMBOL],
        [E3_SYMBOL],
        [E12_SYMBOL],
        [E23_SYMBOL],
        [E31_SYMBOL],
        [PSEUDO_SYMBOL]
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BASIS_LABELS_G3_STANDARD;
});

define('davinci-units/math/BASIS_LABELS_G3_STANDARD_HTML',["require", "exports"], function (require, exports) {
    "use strict";
    var SCALAR_SYMBOL = "1";
    var E1_SYMBOL = "<b>e</b><sub>1</sub>";
    var E2_SYMBOL = "<b>e</b><sub>2</sub>";
    var E3_SYMBOL = "<b>e</b><sub>3</sub>";
    var E12_SYMBOL = E1_SYMBOL + E2_SYMBOL;
    var E23_SYMBOL = E2_SYMBOL + E3_SYMBOL;
    var E31_SYMBOL = E3_SYMBOL + E1_SYMBOL;
    var PSEUDO_SYMBOL = E1_SYMBOL + E2_SYMBOL + E3_SYMBOL;
    var BASIS_LABELS_G3_STANDARD_HTML = [
        [SCALAR_SYMBOL],
        [E1_SYMBOL],
        [E2_SYMBOL],
        [E3_SYMBOL],
        [E12_SYMBOL],
        [E23_SYMBOL],
        [E31_SYMBOL],
        [PSEUDO_SYMBOL]
    ];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BASIS_LABELS_G3_STANDARD_HTML;
});

define('davinci-units/math/G3',["require", "exports", './bezier2', './bezier3', './extG3', './gauss', './lcoG3', './mulG3', '../i18n/notImplemented', '../i18n/notSupported', './quadSpinorE3', '../i18n/readOnly', './rcoG3', './scpG3', './squaredNormG3', './stringFromCoordinates', './Unit', './BASIS_LABELS_G3_GEOMETRIC', './BASIS_LABELS_G3_HAMILTON', './BASIS_LABELS_G3_STANDARD', './BASIS_LABELS_G3_STANDARD_HTML'], function (require, exports, bezier2_1, bezier3_1, extG3_1, gauss_1, lcoG3_1, mulG3_1, notImplemented_1, notSupported_1, quadSpinorE3_1, readOnly_1, rcoG3_1, scpG3_1, squaredNormG3_1, stringFromCoordinates_1, Unit_1, BASIS_LABELS_G3_GEOMETRIC_1, BASIS_LABELS_G3_HAMILTON_1, BASIS_LABELS_G3_STANDARD_1, BASIS_LABELS_G3_STANDARD_HTML_1) {
    "use strict";
    var COORD_SCALAR = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_PSEUDO = 7;
    var G3 = (function () {
        function G3(α, x, y, z, xy, yz, zx, β, uom) {
            this._coords = [0, 0, 0, 0, 0, 0, 0, 0];
            this._coords[COORD_SCALAR] = α;
            this._coords[COORD_X] = x;
            this._coords[COORD_Y] = y;
            this._coords[COORD_Z] = z;
            this._coords[COORD_XY] = xy;
            this._coords[COORD_YZ] = yz;
            this._coords[COORD_ZX] = zx;
            this._coords[COORD_PSEUDO] = β;
            this.uom = uom;
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this._coords[COORD_SCALAR] *= multiplier;
                this._coords[COORD_X] *= multiplier;
                this._coords[COORD_Y] *= multiplier;
                this._coords[COORD_Z] *= multiplier;
                this._coords[COORD_XY] *= multiplier;
                this._coords[COORD_YZ] *= multiplier;
                this._coords[COORD_ZX] *= multiplier;
                this._coords[COORD_PSEUDO] *= multiplier;
                this.uom = new Unit_1.Unit(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(G3, "BASIS_LABELS_GEOMETRIC", {
            get: function () { return BASIS_LABELS_G3_GEOMETRIC_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_HAMILTON", {
            get: function () { return BASIS_LABELS_G3_HAMILTON_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_STANDARD", {
            get: function () { return BASIS_LABELS_G3_STANDARD_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_STANDARD_HTML", {
            get: function () { return BASIS_LABELS_G3_STANDARD_HTML_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3.prototype, "a", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('a').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "x", {
            get: function () {
                return this._coords[COORD_X];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "y", {
            get: function () {
                return this._coords[COORD_Y];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "z", {
            get: function () {
                return this._coords[COORD_Z];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('z').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "xy", {
            get: function () {
                return this._coords[COORD_XY];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('xy').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "yz", {
            get: function () {
                return this._coords[COORD_YZ];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('yz').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "zx", {
            get: function () {
                return this._coords[COORD_ZX];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('zx').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "b", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('b').message);
            },
            enumerable: true,
            configurable: true
        });
        G3.fromCartesian = function (α, x, y, z, xy, yz, zx, β, uom) {
            return new G3(α, x, y, z, xy, yz, zx, β, uom);
        };
        Object.defineProperty(G3.prototype, "coords", {
            get: function () {
                return [this.a, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.b];
            },
            enumerable: true,
            configurable: true
        });
        G3.prototype.coordinate = function (index) {
            switch (index) {
                case 0:
                    return this.a;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.z;
                case 4:
                    return this.xy;
                case 5:
                    return this.yz;
                case 6:
                    return this.zx;
                case 7:
                    return this.b;
                default:
                    throw new Error("index must be in the range [0..7]");
            }
        };
        G3.prototype.add = function (rhs) {
            var a = this.a + rhs.a;
            var x = this.x + rhs.x;
            var y = this.y + rhs.y;
            var z = this.z + rhs.z;
            var xy = this.xy + rhs.xy;
            var yz = this.yz + rhs.yz;
            var zx = this.zx + rhs.zx;
            var b = this.b + rhs.b;
            var uom = Unit_1.Unit.compatible(this.uom, rhs.uom);
            return new G3(a, x, y, z, xy, yz, zx, b, uom);
        };
        G3.prototype.addPseudo = function (β) {
            return new G3(this.a, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.b + β.multiplier, Unit_1.Unit.compatible(this.uom, β));
        };
        G3.prototype.addScalar = function (α) {
            return new G3(this.a + α.multiplier, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.b, Unit_1.Unit.compatible(this.uom, α));
        };
        G3.prototype.__add__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.add(rhs);
            }
            else if (rhs instanceof Unit_1.Unit) {
                return this.addScalar(rhs);
            }
        };
        G3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.add(this);
            }
            else if (lhs instanceof Unit_1.Unit) {
                return this.addScalar(lhs);
            }
        };
        G3.prototype.adj = function () {
            throw new Error(notImplemented_1.default('adj').message);
        };
        G3.prototype.angle = function () {
            return this.log().grade(2);
        };
        G3.prototype.conj = function () {
            return new G3(this.a, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.b, this.uom);
        };
        G3.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var a = bezier3_1.default(t, this.a, controlBegin.a, controlEnd.a, endPoint.a);
            var x = bezier3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = bezier3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var z = bezier3_1.default(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
            var b = bezier3_1.default(t, this.b, controlBegin.b, controlEnd.b, endPoint.b);
            return new G3(a, x, y, z, 0, 0, 0, b, this.uom);
        };
        G3.prototype.direction = function () {
            return this.div(this.norm());
        };
        G3.prototype.sub = function (rhs) {
            var a = this.a - rhs.a;
            var x = this.x - rhs.x;
            var y = this.y - rhs.y;
            var z = this.z - rhs.z;
            var xy = this.xy - rhs.xy;
            var yz = this.yz - rhs.yz;
            var zx = this.zx - rhs.zx;
            var b = this.b - rhs.b;
            var uom = Unit_1.Unit.compatible(this.uom, rhs.uom);
            return new G3(a, x, y, z, xy, yz, zx, b, uom);
        };
        G3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.sub(rhs);
            }
            else if (rhs instanceof Unit_1.Unit) {
                return this.addScalar(rhs.neg());
            }
        };
        G3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.sub(this);
            }
            else if (lhs instanceof Unit_1.Unit) {
                return this.neg().addScalar(lhs);
            }
        };
        G3.prototype.mul = function (rhs) {
            var out = new G3(0, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.mul(this.uom, rhs.uom));
            mulG3_1.default(this, rhs, out._coords);
            return out;
        };
        G3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        G3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        G3.prototype.scale = function (α) {
            return new G3(this.a * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.b * α, this.uom);
        };
        G3.prototype.div = function (rhs) {
            return this.mul(rhs.inv());
        };
        G3.prototype.divByScalar = function (α) {
            return new G3(this.a / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.b / α, this.uom);
        };
        G3.prototype.__div__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.div(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.divByScalar(rhs);
            }
        };
        G3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.div(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
            }
        };
        G3.prototype.dual = function () {
            throw new Error(notImplemented_1.default('dual').message);
        };
        G3.prototype.scp = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.mul(this.uom, rhs.uom));
            scpG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.ext = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.mul(this.uom, rhs.uom));
            extG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scp(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        G3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.scp(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
            }
        };
        G3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        G3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.ext(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        G3.prototype.lco = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.mul(this.uom, rhs.uom));
            lcoG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.lco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        G3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.lco(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
            }
        };
        G3.prototype.rco = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.mul(this.uom, rhs.uom));
            rcoG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.rco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        G3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.rco(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
            }
        };
        G3.prototype.pow = function (exponent) {
            throw new Error('pow');
        };
        G3.prototype.__bang__ = function () {
            return this.inv();
        };
        G3.prototype.__pos__ = function () {
            return this;
        };
        G3.prototype.neg = function () {
            return new G3(-this.a, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.b, this.uom);
        };
        G3.prototype.__neg__ = function () {
            return this.neg();
        };
        G3.prototype.rev = function () {
            return new G3(this.a, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.b, this.uom);
        };
        G3.prototype.__tilde__ = function () {
            return this.rev();
        };
        G3.prototype.grade = function (grade) {
            switch (grade) {
                case 0:
                    return G3.fromCartesian(this.a, 0, 0, 0, 0, 0, 0, 0, this.uom);
                case 1:
                    return G3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
                case 2:
                    return G3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
                case 3:
                    return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.b, this.uom);
                default:
                    return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        G3.prototype.cross = function (vector) {
            var x;
            var x2;
            var y;
            var y1;
            var y2;
            var z;
            var z1;
            var z2;
            var x1 = this.x;
            y1 = this.y;
            z1 = this.z;
            x2 = vector.x;
            y2 = vector.y;
            z2 = vector.z;
            x = y1 * z2 - z1 * y2;
            y = z1 * x2 - x1 * z2;
            z = x1 * y2 - y1 * x2;
            return new G3(0, x, y, z, 0, 0, 0, 0, Unit_1.Unit.mul(this.uom, vector.uom));
        };
        G3.prototype.isOne = function () {
            return (this.a === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.b === 0);
        };
        G3.prototype.isScalar = function () {
            return (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.b === 0);
        };
        G3.prototype.isZero = function () {
            return (this.a === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.b === 0);
        };
        G3.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        G3.prototype.cos = function () {
            Unit_1.Unit.assertDimensionless(this.uom);
            var cosW = Math.cos(this.a);
            return new G3(cosW, 0, 0, 0, 0, 0, 0, 0);
        };
        G3.prototype.cosh = function () {
            throw new Error(notImplemented_1.default('cosh').message);
        };
        G3.prototype.distanceTo = function (point) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        };
        G3.prototype.equals = function (other) {
            if (this.a === other.a && this.x === other.x && this.y === other.y && this.z === other.z && this.xy === other.xy && this.yz === other.yz && this.zx === other.zx && this.b === other.b) {
                if (this.uom) {
                    if (other.uom) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (other.uom) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
            else {
                return false;
            }
        };
        G3.prototype.exp = function () {
            Unit_1.Unit.assertDimensionless(this.uom);
            var bivector = this.grade(2);
            var a = bivector.norm();
            if (!a.isZero()) {
                var c = a.cos();
                var s = a.sin();
                var B = bivector.direction();
                return c.add(B.mul(s));
            }
            else {
                return new G3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        G3.prototype.inv = function () {
            var α = this.a;
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var xy = this.xy;
            var yz = this.yz;
            var zx = this.zx;
            var β = this.b;
            var A = [
                [α, x, y, z, -xy, -yz, -zx, -β],
                [x, α, xy, -zx, -y, -β, z, -yz],
                [y, -xy, α, yz, x, -z, -β, -zx],
                [z, zx, -yz, α, -β, y, -x, -xy],
                [xy, -y, x, β, α, zx, -yz, z],
                [yz, β, -z, y, -zx, α, xy, x],
                [zx, z, β, -x, yz, -xy, α, y],
                [β, yz, zx, xy, z, x, y, α]
            ];
            var b = [1, 0, 0, 0, 0, 0, 0, 0];
            var X = gauss_1.default(A, b);
            var uom = this.uom ? this.uom.inv() : void 0;
            return new G3(X[0], X[1], X[2], X[3], X[4], X[5], X[6], X[7], uom);
        };
        G3.prototype.log = function () {
            throw new Error(notImplemented_1.default('log').message);
        };
        G3.prototype.magnitude = function () {
            return this.norm();
        };
        G3.prototype.magnitudeSansUnits = function () {
            return Math.sqrt(this.squaredNormSansUnits());
        };
        G3.prototype.norm = function () {
            return new G3(this.magnitudeSansUnits(), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.quad = function () {
            return this.squaredNorm();
        };
        G3.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = bezier2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = bezier2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var z = bezier2_1.default(t, this.z, controlPoint.z, endPoint.z);
            return new G3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.squaredNorm = function () {
            return new G3(this.squaredNormSansUnits(), 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.mul(this.uom, this.uom));
        };
        G3.prototype.squaredNormSansUnits = function () {
            return squaredNormG3_1.default(this);
        };
        G3.prototype.stress = function (σ) {
            throw new Error(notSupported_1.default('stress').message);
        };
        G3.prototype.reflect = function (n) {
            var m = G3.fromVector(n);
            return m.mul(this).mul(m).scale(-1);
        };
        G3.prototype.rotate = function (R) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var α = R.a;
            var quadR = quadSpinorE3_1.default(R);
            var ix = α * x - c * z + a * y;
            var iy = α * y - a * x + b * z;
            var iz = α * z - b * y + c * x;
            var iα = b * x + c * y + a * z;
            var αOut = quadR * this.a;
            var xOut = ix * α + iα * b + iy * a - iz * c;
            var yOut = iy * α + iα * c + iz * b - ix * a;
            var zOut = iz * α + iα * a + ix * c - iy * b;
            var βOut = quadR * this.b;
            return G3.fromCartesian(αOut, xOut, yOut, zOut, 0, 0, 0, βOut, this.uom);
        };
        G3.prototype.sin = function () {
            Unit_1.Unit.assertDimensionless(this.uom);
            var sinW = Math.sin(this.a);
            return new G3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        G3.prototype.sinh = function () {
            throw new Error(notImplemented_1.default('sinh').message);
        };
        G3.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        G3.prototype.sqrt = function () {
            return new G3(Math.sqrt(this.a), 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.sqrt(this.uom));
        };
        G3.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        G3.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
            if (this.uom) {
                var unitString = this.uom.toString().trim();
                if (unitString) {
                    return quantityString + ' ' + unitString;
                }
                else {
                    return quantityString;
                }
            }
            else {
                return quantityString;
            }
        };
        G3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.__eq__ = function (rhs) {
            if (rhs instanceof G3) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in equality expression: " + this.uom.dimensions + " === " + rhs.uom.dimensions);
                }
                return this.a === rhs.a &&
                    this.x === rhs.x &&
                    this.y === rhs.y &&
                    this.z === rhs.z &&
                    this.xy === rhs.xy &&
                    this.yz === rhs.yz &&
                    this.zx === rhs.zx &&
                    this.b === rhs.b;
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__ne__ = function (rhs) {
            if (rhs instanceof G3) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in inequality expression: " + this.uom.dimensions + " !== " + rhs.uom.dimensions);
                }
                return this.a !== rhs.a ||
                    this.x !== rhs.x ||
                    this.y !== rhs.y ||
                    this.z !== rhs.z ||
                    this.xy !== rhs.xy ||
                    this.yz !== rhs.yz ||
                    this.zx !== rhs.zx ||
                    this.b !== this.b;
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__ge__ = function (rhs) {
            if (rhs instanceof G3) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in comparison expression: " + this.uom.dimensions + " >= " + rhs.uom.dimensions);
                }
                if (!this.isScalar()) {
                    throw new Error("left operand (" + this + ") in comparison expression must be a scalar.");
                }
                if (!rhs.isScalar()) {
                    throw new Error("right operand (" + rhs + ") in comparison expression must be a scalar.");
                }
                return this.a >= rhs.a;
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__gt__ = function (rhs) {
            if (rhs instanceof G3) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in comparison expression: " + this.uom.dimensions + " > " + rhs.uom.dimensions);
                }
                if (!this.isScalar()) {
                    throw new Error("left operand (" + this + ") in comparison expression must be a scalar.");
                }
                if (!rhs.isScalar()) {
                    throw new Error("right operand (" + rhs + ") in comparison expression must be a scalar.");
                }
                return this.a > rhs.a;
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__le__ = function (rhs) {
            if (rhs instanceof G3) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in comparison expression: " + this.uom.dimensions + " <= " + rhs.uom.dimensions);
                }
                if (!this.isScalar()) {
                    throw new Error("left operand (" + this + ") in comparison expression must be a scalar.");
                }
                if (!rhs.isScalar()) {
                    throw new Error("right operand (" + rhs + ") in comparison expression must be a scalar.");
                }
                return this.a <= rhs.a;
            }
            else {
                return void 0;
            }
        };
        G3.prototype.__lt__ = function (rhs) {
            if (rhs instanceof G3) {
                try {
                    Unit_1.Unit.compatible(this.uom, rhs.uom);
                }
                catch (e) {
                    throw new Error("Dimensions mismatch in comparison expression: " + this.uom.dimensions + " < " + rhs.uom.dimensions);
                }
                if (!this.isScalar()) {
                    throw new Error("left operand (" + this + ") in comparison expression must be a scalar.");
                }
                if (!rhs.isScalar()) {
                    throw new Error("right operand (" + rhs + ") in comparison expression must be a scalar.");
                }
                return this.a < rhs.a;
            }
            else {
                return void 0;
            }
        };
        G3.mutator = function (M) {
            var that = {
                set a(value) {
                    M._coords[COORD_SCALAR] = value;
                },
                set x(value) {
                    M._coords[COORD_X] = value;
                },
                set y(value) {
                    M._coords[COORD_Y] = value;
                },
                set z(value) {
                    M._coords[COORD_Z] = value;
                },
                set yz(value) {
                    M._coords[COORD_YZ] = value;
                },
                set zx(value) {
                    M._coords[COORD_ZX] = value;
                },
                set xy(value) {
                    M._coords[COORD_XY] = value;
                },
                set b(value) {
                    M._coords[COORD_PSEUDO] = value;
                }
            };
            return that;
        };
        G3.copy = function (m, uom) {
            return new G3(m.a, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.b, uom);
        };
        G3.direction = function (vector) {
            if (vector) {
                return new G3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0).direction();
            }
            else {
                return void 0;
            }
        };
        G3.fromSpinor = function (spinor) {
            if (spinor) {
                return new G3(spinor.a, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0);
            }
            else {
                return void 0;
            }
        };
        G3.fromVector = function (vector, uom) {
            if (vector) {
                return new G3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, uom);
            }
            else {
                return void 0;
            }
        };
        G3.random = function (uom) {
            return new G3(Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), uom);
        };
        G3.scalar = function (α, uom) {
            return new G3(α, 0, 0, 0, 0, 0, 0, 0, uom);
        };
        G3.vector = function (x, y, z, uom) {
            return new G3(0, x, y, z, 0, 0, 0, 0, uom);
        };
        G3.BASIS_LABELS = BASIS_LABELS_G3_STANDARD_1.default;
        G3.zero = new G3(0, 0, 0, 0, 0, 0, 0, 0);
        G3.one = new G3(1, 0, 0, 0, 0, 0, 0, 0);
        G3.e1 = new G3(0, 1, 0, 0, 0, 0, 0, 0);
        G3.e2 = new G3(0, 0, 1, 0, 0, 0, 0, 0);
        G3.e3 = new G3(0, 0, 0, 1, 0, 0, 0, 0);
        G3.kilogram = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.KILOGRAM);
        G3.meter = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.METER);
        G3.second = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.SECOND);
        G3.coulomb = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.COULOMB);
        G3.ampere = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.AMPERE);
        G3.kelvin = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.KELVIN);
        G3.mole = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.MOLE);
        G3.candela = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.Unit.CANDELA);
        return G3;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = G3;
});

define('davinci-units/math/mathcore',["require", "exports"], function (require, exports) {
    "use strict";
    var abs = Math.abs;
    var acos = Math.acos;
    var asin = Math.asin;
    var atan = Math.atan;
    var cos = Math.cos;
    var exp = Math.exp;
    var log = Math.log;
    var sin = Math.sin;
    var sqrt = Math.sqrt;
    var tan = Math.tan;
    function isCallableMethod(x, name) {
        return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
    }
    function makeUnaryUniversalFunction(methodName, primitiveFunction) {
        return function (x) {
            var something = x;
            if (isCallableMethod(x, methodName)) {
                return something[methodName]();
            }
            else if (typeof x === 'number') {
                var n = something;
                var thing = primitiveFunction(n);
                return thing;
            }
            else {
                throw new TypeError("x must support " + methodName + "(x)");
            }
        };
    }
    function cosh(x) {
        return (exp(x) + exp(-x)) / 2;
    }
    function sinh(x) {
        return (exp(x) - exp(-x)) / 2;
    }
    function tanh(x) {
        return sinh(x) / cosh(x);
    }
    function quad(x) {
        return x * x;
    }
    var mathcore = {
        acos: makeUnaryUniversalFunction('acos', acos),
        asin: makeUnaryUniversalFunction('asin', asin),
        atan: makeUnaryUniversalFunction('atan', atan),
        cos: makeUnaryUniversalFunction('cos', cos),
        cosh: makeUnaryUniversalFunction('cosh', cosh),
        exp: makeUnaryUniversalFunction('exp', exp),
        log: makeUnaryUniversalFunction('log', log),
        norm: makeUnaryUniversalFunction('norm', abs),
        quad: makeUnaryUniversalFunction('quad', quad),
        sin: makeUnaryUniversalFunction('sin', sin),
        sinh: makeUnaryUniversalFunction('sinh', sinh),
        sqrt: makeUnaryUniversalFunction('sqrt', sqrt),
        tan: makeUnaryUniversalFunction('tan', tan),
        tanh: makeUnaryUniversalFunction('tanh', tanh),
        Math: {
            cosh: cosh,
            sinh: sinh
        }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mathcore;
});

define('davinci-units/config',["require", "exports"], function (require, exports) {
    "use strict";
    var Units = (function () {
        function Units() {
            this.GITHUB = 'https://github.com/geometryzen/davinci-units';
            this.LAST_MODIFIED = '2016-09-19';
            this.NAMESPACE = 'UNITS';
            this.VERSION = '1.5.0';
        }
        Units.prototype.log = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.log(message);
        };
        Units.prototype.info = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.info(message);
        };
        Units.prototype.warn = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.warn(message);
        };
        Units.prototype.error = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.error(message);
        };
        return Units;
    }());
    var config = new Units();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});

define('davinci-units',["require", "exports", './davinci-units/math/BigInteger', './davinci-units/math/BigRational', './davinci-units/math/Dimensions', './davinci-units/math/G2', './davinci-units/math/G3', './davinci-units/math/mathcore', './davinci-units/math/QQ', './davinci-units/math/Unit', './davinci-units/config'], function (require, exports, BigInteger_1, BigRational_1, Dimensions_1, G2_1, G3_1, mathcore_1, QQ_1, Unit_1, config_1) {
    "use strict";
    var units = {
        get LAST_MODIFIED() { return config_1.default.LAST_MODIFIED; },
        get VERSION() { return config_1.default.VERSION; },
        get Dimensions() { return Dimensions_1.Dimensions; },
        get Unit() { return Unit_1.Unit; },
        get G2() { return G2_1.G2; },
        get G3() { return G3_1.default; },
        get QQ() { return QQ_1.QQ; },
        get bigInt() { return BigInteger_1.default; },
        get bigRat() { return BigRational_1.default; },
        get cos() { return mathcore_1.default.cos; },
        get cosh() { return mathcore_1.default.cosh; },
        get exp() { return mathcore_1.default.exp; },
        get log() { return mathcore_1.default.log; },
        get norm() { return mathcore_1.default.norm; },
        get quad() { return mathcore_1.default.quad; },
        get sin() { return mathcore_1.default.sin; },
        get sinh() { return mathcore_1.default.sinh; },
        get sqrt() { return mathcore_1.default.sqrt; },
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = units;
});

  var library = require('davinci-units').default;
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['UNITS'] = library;
  }
}(this));
