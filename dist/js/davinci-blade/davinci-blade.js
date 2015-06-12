(function(global, define) {
  var globalDefine = global.define;
/**
 * @license almond 0.3.1 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
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
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                //Lop off the last part of baseParts, so that . matches the
                //"directory" and not name of the baseName's module. For instance,
                //baseName of "one/two/three", maps to "one/two/three.js", but we
                //want the directory, "one/two" for this normalization.
                name = baseParts.slice(0, baseParts.length - 1).concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
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

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
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
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
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
            return callDep(makeMap(deps, callback).f);
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

define("../vendor/almond/almond", function(){});

define('davinci-blade/core',["require", "exports"], function (require, exports) {
    var blade = {
        /**
         * The version of the blade library.
         */
        VERSION: '1.3.0'
    };
    return blade;
});

define('davinci-blade/Rational',["require", "exports", 'davinci-blade/Unit'], function (require, exports, Unit) {
    function RationalError(message) {
        this.name = 'RationalError';
        this.message = (message || "");
    }
    RationalError.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new RationalError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof Rational) {
            return arg;
        }
        else {
            throw new RationalError("Argument '" + arg + "' must be a Rational");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new RationalError("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    var Rational = (function () {
        /**
         * The Rational class represents a rational number.
         *
         * @class Rational
         * @extends Field
         * @constructor
         * @param {number} n The numerator.
         * @param {number} d The denominator.
         */
        function Rational(n, d) {
            assertArgNumber('n', n);
            assertArgNumber('d', d);
            var g;
            var gcd = function (a, b) {
                assertArgNumber('a', a);
                assertArgNumber('b', b);
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
        Object.defineProperty(Rational.prototype, "numer", {
            get: function () {
                return this._numer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rational.prototype, "denom", {
            get: function () {
                return this._denom;
            },
            enumerable: true,
            configurable: true
        });
        Rational.prototype.add = function (rhs) {
            assertArgRational('rhs', rhs);
            return new Rational(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        Rational.prototype.sub = function (rhs) {
            assertArgRational('rhs', rhs);
            return new Rational(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        Rational.prototype.mul = function (rhs) {
            assertArgRational('rhs', rhs);
            return new Rational(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        // TODO: div testing
        Rational.prototype.div = function (rhs) {
            if (typeof rhs === 'number') {
                return new Rational(this._numer, this._denom * rhs);
            }
            else {
                return new Rational(this._numer * rhs._denom, this._denom * rhs._numer);
            }
        };
        Rational.prototype.isZero = function () {
            return this._numer === 0;
        };
        Rational.prototype.negative = function () {
            return new Rational(-this._numer, this._denom);
        };
        Rational.prototype.equals = function (other) {
            if (other instanceof Rational) {
                return this._numer * other._denom === this._denom * other._numer;
            }
            else {
                return false;
            }
        };
        Rational.prototype.toString = function () {
            return "" + this._numer + "/" + this._denom;
        };
        Rational.ONE = new Rational(1, 1);
        Rational.TWO = new Rational(2, 1);
        Rational.MINUS_ONE = new Rational(-1, 1);
        Rational.ZERO = new Rational(0, 1);
        return Rational;
    })();
    return Rational;
});

define('davinci-blade/Dimensions',["require", "exports", 'davinci-blade/Rational'], function (require, exports, Rational) {
    function DimensionError(message) {
        this.name = 'DimensionError';
        this.message = (message || "");
    }
    DimensionError.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new DimensionError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgDimensions(name, arg) {
        if (arg instanceof Dimensions) {
            return arg;
        }
        else {
            throw new DimensionError("Argument '" + arg + "' must be a Dimensions");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof Rational) {
            return arg;
        }
        else {
            throw new DimensionError("Argument '" + arg + "' must be a Rational");
        }
    }
    var Dimensions = (function () {
        /**
         * The Dimensions class captures the physical dimensions associated with a unit of measure.
         *
         * @class Dimensions
         * @constructor
         * @param {Rational} mass The mass component of the dimensions object.
         * @param {Rational} length The length component of the dimensions object.
         * @param {Rational} time The time component of the dimensions object.
         * @param {Rational} charge The charge component of the dimensions object.
         * @param {Rational} temperature The temperature component of the dimensions object.
         * @param {Rational} amount The amount component of the dimensions object.
         * @param {Rational} intensity The intensity component of the dimensions object.
         */
        function Dimensions(theMass, L, T, Q, temperature, amount, intensity) {
            this.L = L;
            this.T = T;
            this.Q = Q;
            this.temperature = temperature;
            this.amount = amount;
            this.intensity = intensity;
            var length = L;
            var time = T;
            var charge = Q;
            if (arguments.length !== 7) {
                throw {
                    name: "DimensionError",
                    message: "Expecting 7 arguments"
                };
            }
            if (typeof theMass === 'number') {
                this._mass = new Rational(theMass, 1);
            }
            else if (theMass instanceof Rational) {
                this._mass = theMass;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "mass must be a Rational or number"
                };
            }
            if (typeof length === 'number') {
                this.L = new Rational(length, 1);
            }
            else if (length instanceof Rational) {
                this.L = length;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "length must be a Rational or number"
                };
            }
            if (typeof time === 'number') {
                this.T = new Rational(time, 1);
            }
            else if (time instanceof Rational) {
                this.T = time;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "time must be a Rational or number"
                };
            }
            if (typeof charge === 'number') {
                this.Q = new Rational(charge, 1);
            }
            else if (charge instanceof Rational) {
                this.Q = charge;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "charge must be a Rational or number"
                };
            }
            if (typeof temperature === 'number') {
                this.temperature = new Rational(temperature, 1);
            }
            else if (temperature instanceof Rational) {
                this.temperature = temperature;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "(thermodynamic) temperature must be a Rational or number"
                };
            }
            if (typeof amount === 'number') {
                this.amount = new Rational(amount, 1);
            }
            else if (amount instanceof Rational) {
                this.amount = amount;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "amount (of substance) must be a Rational or number"
                };
            }
            if (typeof intensity === 'number') {
                this.intensity = new Rational(intensity, 1);
            }
            else if (intensity instanceof Rational) {
                this.intensity = intensity;
            }
            else {
                throw {
                    name: "DimensionError",
                    message: "(luminous) intensity must be a Rational or number"
                };
            }
        }
        Object.defineProperty(Dimensions.prototype, "M", {
            /**
            * The <em>mass</em> component of this dimensions instance.
            *
            * @property M
            * @type {Rational}
            */
            get: function () {
                return this._mass;
            },
            enumerable: true,
            configurable: true
        });
        Dimensions.prototype.compatible = function (rhs) {
            if (this._mass.equals(rhs._mass) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
                return this;
            }
            else {
                throw new DimensionError("Dimensions must be equal (" + this + ", " + rhs + ")");
            }
        };
        Dimensions.prototype.mul = function (rhs) {
            return new Dimensions(this._mass.add(rhs._mass), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        Dimensions.prototype.div = function (rhs) {
            return new Dimensions(this._mass.sub(rhs._mass), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        Dimensions.prototype.pow = function (exponent) {
            return new Dimensions(this._mass.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        Dimensions.prototype.sqrt = function () {
            return new Dimensions(this._mass.div(Rational.TWO), this.L.div(Rational.TWO), this.T.div(Rational.TWO), this.Q.div(Rational.TWO), this.temperature.div(Rational.TWO), this.amount.div(Rational.TWO), this.intensity.div(Rational.TWO));
        };
        Dimensions.prototype.dimensionless = function () {
            return this._mass.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        /**
        * Determines whether all the components of the Dimensions instance are zero.
        *
        * @method isZero
        * @return {boolean} <code>true</code> if all the components are zero, otherwise <code>false</code>.
        */
        Dimensions.prototype.isZero = function () {
            return this._mass.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        Dimensions.prototype.negative = function () {
            return new Dimensions(this._mass.negative(), this.L.negative(), this.T.negative(), this.Q.negative(), this.temperature.negative(), this.amount.negative(), this.intensity.negative());
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
            return [stringify(this._mass, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function (x) {
                return typeof x === 'string';
            }).join(" * ");
        };
        return Dimensions;
    })();
    return Dimensions;
});

define('davinci-blade/Unit',["require", "exports", 'davinci-blade/Dimensions', 'davinci-blade/Rational'], function (require, exports, Dimensions, Rational) {
    function UnitError(message) {
        this.name = 'UnitError';
        this.message = (message || "");
    }
    UnitError.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new UnitError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgDimensions(name, arg) {
        if (arg instanceof Dimensions) {
            return arg;
        }
        else {
            throw new UnitError("Argument '" + arg + "' must be a Dimensions");
        }
    }
    function assertArgRational(name, arg) {
        if (arg instanceof Rational) {
            return arg;
        }
        else {
            throw new UnitError("Argument '" + arg + "' must be a Rational");
        }
    }
    function assertArgUnit(name, arg) {
        if (arg instanceof Unit) {
            return arg;
        }
        else {
            throw new UnitError("Argument '" + arg + "' must be a Unit");
        }
    }
    var dumbString = function (scale, dimensions, labels) {
        assertArgNumber('scale', scale);
        assertArgDimensions('dimensions', dimensions);
        var operatorStr;
        var scaleString;
        var unitsString;
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
        operatorStr = scale === 1 || dimensions.isZero() ? "" : " ";
        scaleString = scale === 1 ? "" : "" + scale;
        unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
            return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
    };
    var unitString = function (scale, dimensions, labels) {
        var patterns = [
            [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
            [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],
            [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
            [-1, 1, 3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
            [0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
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
            ["N·m ** 2/kg ** 2"],
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
        var M = dimensions.M;
        var L = dimensions.L;
        var T = dimensions.T;
        var Q = dimensions.Q;
        var temperature = dimensions.temperature;
        var amount = dimensions.amount;
        var intensity = dimensions.intensity;
        for (var i = 0, len = patterns.length; i < len; i++) {
            var pattern = patterns[i];
            if (M.numer === pattern[0] && M.denom === pattern[1] && L.numer === pattern[2] && L.denom === pattern[3] && T.numer === pattern[4] && T.denom === pattern[5] && Q.numer === pattern[6] && Q.denom === pattern[7] && temperature.numer === pattern[8] && temperature.denom === pattern[9] && amount.numer === pattern[10] && amount.denom === pattern[11] && intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
                if (scale !== 1) {
                    return scale + " * " + decodes[i][0];
                }
                else {
                    return decodes[i][0];
                }
            }
        }
        return dumbString(scale, dimensions, labels);
    };
    function add(lhs, rhs) {
        return new Unit(lhs.scale + rhs.scale, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function sub(lhs, rhs) {
        return new Unit(lhs.scale - rhs.scale, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function mul(lhs, rhs) {
        return new Unit(lhs.scale * rhs.scale, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
    }
    function scalarMultiply(alpha, unit) {
        return new Unit(alpha * unit.scale, unit.dimensions, unit.labels);
    }
    function div(lhs, rhs) {
        return new Unit(lhs.scale / rhs.scale, lhs.dimensions.div(rhs.dimensions), lhs.labels);
    }
    var Unit = (function () {
        /**
         * The Unit class represents the units for a measure.
         *
         * @class Unit
         * @constructor
         * @param {number} scale
         * @param {Dimensions} dimensions
         * @param {string[]} labels The label strings to use for each dimension.
         */
        function Unit(scale, dimensions, labels) {
            this.scale = scale;
            this.dimensions = dimensions;
            this.labels = labels;
            if (labels.length !== 7) {
                throw new Error("Expecting 7 elements in the labels array.");
            }
            this.scale = scale;
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
            assertArgUnit('rhs', rhs);
            return add(this, rhs);
        };
        Unit.prototype.__add__ = function (other) {
            if (other instanceof Unit) {
                return add(this, other);
            }
            else {
                return;
            }
        };
        Unit.prototype.__radd__ = function (other) {
            if (other instanceof Unit) {
                return add(other, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.sub = function (rhs) {
            assertArgUnit('rhs', rhs);
            return sub(this, rhs);
        };
        Unit.prototype.__sub__ = function (other) {
            if (other instanceof Unit) {
                return sub(this, other);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rsub__ = function (other) {
            if (other instanceof Unit) {
                return sub(other, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.mul = function (rhs) {
            assertArgUnit('rhs', rhs);
            return mul(this, rhs);
        };
        Unit.prototype.__mul__ = function (other) {
            if (other instanceof Unit) {
                return mul(this, other);
            }
            else if (typeof other === 'number') {
                return scalarMultiply(other, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.__rmul__ = function (other) {
            if (other instanceof Unit) {
                return mul(other, this);
            }
            else if (typeof other === 'number') {
                return scalarMultiply(other, this);
            }
            else {
                return;
            }
        };
        Unit.prototype.div = function (rhs) {
            assertArgUnit('rhs', rhs);
            return div(this, rhs);
        };
        Unit.prototype.__div__ = function (other) {
            if (other instanceof Unit) {
                return div(this, other);
            }
            else if (typeof other === 'number') {
                return new Unit(this.scale / other, this.dimensions, this.labels);
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
                return new Unit(other / this.scale, this.dimensions.negative(), this.labels);
            }
            else {
                return;
            }
        };
        Unit.prototype.pow = function (q) {
            assertArgRational('q', q);
            return new Unit(Math.pow(this.scale, q.numer / q.denom), this.dimensions.pow(q), this.labels);
        };
        Unit.prototype.inverse = function () {
            return new Unit(1 / this.scale, this.dimensions.negative(), this.labels);
        };
        Unit.prototype.norm = function () {
            return new Unit(Math.abs(this.scale), this.dimensions, this.labels);
        };
        Unit.prototype.quad = function () {
            return new Unit(this.scale * this.scale, this.dimensions.mul(this.dimensions), this.labels);
        };
        Unit.prototype.toString = function () {
            return unitString(this.scale, this.dimensions, this.labels);
        };
        Unit.isUnity = function (uom) {
            if (typeof uom === 'undefined') {
                return true;
            }
            else if (uom instanceof Unit) {
                return uom.dimensions.dimensionless();
            }
            else {
                throw new Error("isUnity argument must be a Unit or undefined.");
            }
        };
        Unit.compatible = function (lhs, rhs) {
            if (lhs instanceof Unit) {
                if (rhs instanceof Unit) {
                    return lhs.compatible(rhs);
                }
                else {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        };
        Unit.mul = function (lhs, rhs) {
            if (lhs instanceof Unit) {
                if (rhs instanceof Unit) {
                    return lhs.mul(rhs);
                }
                else if (Unit.isUnity(rhs)) {
                    return lhs;
                }
                else {
                    return undefined;
                }
            }
            else if (Unit.isUnity(lhs)) {
                return rhs;
            }
            else {
                return undefined;
            }
        };
        Unit.div = function (lhs, rhs) {
            if (lhs instanceof Unit) {
                if (rhs instanceof Unit) {
                    return lhs.div(rhs);
                }
                else {
                    return lhs;
                }
            }
            else {
                if (rhs instanceof Unit) {
                    return rhs.inverse();
                }
                else {
                    return void 0;
                }
            }
        };
        Unit.sqrt = function (uom) {
            if (typeof uom === 'undefined') {
                if (uom instanceof Unit) {
                    return new Unit(Math.sqrt(uom.scale), uom.dimensions.sqrt(), uom.labels);
                }
                else {
                    throw new Error("uom must be a Unit.");
                }
            }
            else {
                return undefined;
            }
        };
        return Unit;
    })();
    return Unit;
});

define('davinci-blade/Euclidean1',["require", "exports", 'davinci-blade/Unit'], function (require, exports, Unit) {
    function Euclidean1Error(message) {
        this.name = 'Euclidean1Error';
        this.message = (message || "");
    }
    Euclidean1Error.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new Euclidean1Error("Argument '" + name + "' must be a number");
        }
    }
    function assertArgEuclidean1(name, arg) {
        if (arg instanceof Euclidean1) {
            return arg;
        }
        else {
            throw new Euclidean1Error("Argument '" + arg + "' must be a Euclidean1");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new Euclidean1Error("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    var Euclidean1 = (function () {
        /**
         * The Euclidean1 class represents a multivector for a 1-dimensional linear space with a Euclidean metric.
         *
         * @class Euclidean1
         * @constructor
         * @param {number} w The scalar part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param uom The optional unit of measure.
         */
        function Euclidean1(w, x, uom) {
            this.w = assertArgNumber('w', w);
            this.x = assertArgNumber('x', x);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.scale !== 1) {
                var scale = this.uom.scale;
                this.w *= scale;
                this.x *= scale;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Euclidean1.prototype.coordinates = function () {
            return [this.w, this.x];
        };
        Euclidean1.prototype.add = function (rhs) {
            assertArgEuclidean1('rhs', rhs);
            return new Euclidean1(this.w + rhs.w, this.x + rhs.x, Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean1.prototype.sub = function (rhs) {
            assertArgEuclidean1('rhs', rhs);
            return new Euclidean1(this.w - rhs.w, this.x - rhs.x, Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean1.prototype.wedge = function (rhs) {
            throw new Euclidean1Error('wedge');
        };
        Euclidean1.prototype.lshift = function (rhs) {
            throw new Euclidean1Error('lshift');
        };
        Euclidean1.prototype.rshift = function (rhs) {
            throw new Euclidean1Error('rshift');
        };
        Euclidean1.prototype.exp = function () {
            throw new Euclidean1Error('exp');
        };
        Euclidean1.prototype.norm = function () {
            return new Euclidean1(Math.sqrt(this.w * this.w + this.x * this.x), 0, this.uom);
        };
        Euclidean1.prototype.quad = function () {
            return new Euclidean1(this.w * this.w + this.x * this.x, 0, Unit.mul(this.uom, this.uom));
        };
        Euclidean1.prototype.toExponential = function () {
            return "Euclidean1";
        };
        Euclidean1.prototype.toFixed = function (digits) {
            return "Euclidean1";
        };
        Euclidean1.prototype.toString = function () {
            return "Euclidean1";
        };
        return Euclidean1;
    })();
    return Euclidean1;
});

define('davinci-blade/Euclidean2',["require", "exports", 'davinci-blade/Unit'], function (require, exports, Unit) {
    function Euclidean2Error(message) {
        this.name = 'Euclidean2Error';
        this.message = (message || "");
    }
    Euclidean2Error.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new Euclidean2Error("Argument '" + name + "' must be a number");
        }
    }
    function assertArgEuclidean2(name, arg) {
        if (arg instanceof Euclidean2) {
            return arg;
        }
        else {
            throw new Euclidean2Error("Argument '" + arg + "' must be a Euclidean2");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new Euclidean2Error("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
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
    function addE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
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
                    x = +(a0 + b0);
                }
                break;
            case 1:
                {
                    x = +(a1 + b1);
                }
                break;
            case 2:
                {
                    x = +(a2 + b2);
                }
                break;
            case 3:
                {
                    x = +(a3 + b3);
                }
                break;
            default: {
                throw new Error("index must be in the range [0..3]");
            }
        }
        return +x;
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
    function stringFromCoordinates(coordinates, numberToString, labels) {
        var i, _i, _ref;
        var str;
        var sb = [];
        var append = function (coord, label) {
            var n;
            if (coord !== 0) {
                if (coord >= 0) {
                    if (sb.length > 0) {
                        sb.push("+");
                    }
                }
                else {
                    sb.push("-");
                }
                n = Math.abs(coord);
                if (n === 1) {
                    sb.push(label);
                }
                else {
                    sb.push(numberToString(n));
                    if (label !== "1") {
                        sb.push("*");
                        sb.push(label);
                    }
                }
            }
        };
        for (i = _i = 0, _ref = coordinates.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            append(coordinates[i], labels[i]);
        }
        if (sb.length > 0) {
            str = sb.join("");
        }
        else {
            str = "0";
        }
        return str;
    }
    var divide = function (a00, a01, a10, a11, b00, b01, b10, b11, uom, m) {
        var c00, c01, c10, c11, i00, i01, i10, i11, k00, m00, m01, m10, m11, r00, r01, r10, r11, s00, s01, s10, s11, x00, x01, x10, x11;
        r00 = +b00;
        r01 = +b01;
        r10 = +b10;
        r11 = -b11;
        m00 = b00 * r00 + b01 * r01 + b10 * r10 - b11 * r11;
        m01 = 0;
        m10 = 0;
        m11 = 0;
        c00 = +m00;
        c01 = -m01;
        c10 = -m10;
        c11 = -m11;
        s00 = r00 * c00 + r01 * c01 + r10 * c10 - r11 * c11;
        s01 = r00 * c01 + r01 * c00 - r10 * c11 + r11 * c10;
        s10 = r00 * c10 + r01 * c11 + r10 * c00 - r11 * c01;
        s11 = r00 * c11 + r01 * c10 - r10 * c01 + r11 * c00;
        k00 = b00 * s00 + b01 * s01 + b10 * s10 - b11 * s11;
        i00 = s00 / k00;
        i01 = s01 / k00;
        i10 = s10 / k00;
        i11 = s11 / k00;
        x00 = a00 * i00 + a01 * i01 + a10 * i10 - a11 * i11;
        x01 = a00 * i01 + a01 * i00 - a10 * i11 + a11 * i10;
        x10 = a00 * i10 + a01 * i11 + a10 * i00 - a11 * i01;
        x11 = a00 * i11 + a01 * i10 - a10 * i01 + a11 * i00;
        if (typeof m !== 'undefined') {
            assertArgEuclidean2('m', m);
            m.w = x00;
            m.x = x01;
            m.y = x10;
            m.xy = x11;
            m.uom = uom;
        }
        else {
            return new Euclidean2(x00, x01, x10, x11, uom);
        }
    };
    var Euclidean2 = (function () {
        /**
         * The Euclidean2 class represents a multivector for a 2-dimensional linear space with a Euclidean metric.
         *
         * @class Euclidean2
         * @constructor
         * @param {number} w The scalar part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param {number} y The vector component of the multivector in the y-direction.
         * @param {number} xy The pseudoscalar part of the multivector.
         * @param uom The optional unit of measure.
         */
        function Euclidean2(w, x, y, xy, uom) {
            this.w = assertArgNumber('w', w);
            this.x = assertArgNumber('x', x);
            this.y = assertArgNumber('y', y);
            this.xy = assertArgNumber('xy', xy);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.scale !== 1) {
                var scale = this.uom.scale;
                this.w *= scale;
                this.x *= scale;
                this.y *= scale;
                this.xy *= scale;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Euclidean2.prototype.fromCartesian = function (w, x, y, xy, uom) {
            assertArgNumber('w', w);
            assertArgNumber('x', x);
            assertArgNumber('y', y);
            assertArgNumber('xy', xy);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean2(w, x, y, xy, uom);
        };
        Euclidean2.prototype.fromPolar = function (w, r, theta, s, uom) {
            assertArgNumber('w', w);
            assertArgNumber('r', r);
            assertArgNumber('theta', theta);
            assertArgNumber('s', s);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean2(w, r * Math.cos(theta), r * Math.sin(theta), s, uom);
        };
        Euclidean2.prototype.coordinates = function () {
            return [this.w, this.x, this.y, this.xy];
        };
        Euclidean2.prototype.coordinate = function (index) {
            assertArgNumber('index', index);
            switch (index) {
                case 0:
                    return this.w;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.xy;
                default:
                    throw new Euclidean2Error("index must be in the range [0..3]");
            }
        };
        Euclidean2.add = function (a, b) {
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
        Euclidean2.prototype.add = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.add(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__add__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return this.add(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__radd__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).add(this);
            }
        };
        Euclidean2.sub = function (a, b) {
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
        Euclidean2.prototype.sub = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.sub(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__sub__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.sub(other);
            }
            else if (typeof other === 'number') {
                return this.sub(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rsub__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.sub(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).sub(this);
            }
        };
        Euclidean2.mul = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = mulE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.mul = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.mul(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__mul__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.mul(other);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.mul(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rmul__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.mul(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).mul(this);
            }
        };
        Euclidean2.prototype.scalarMultiply = function (rhs) {
            return new Euclidean2(this.w * rhs, this.x * rhs, this.y * rhs, this.xy * rhs, this.uom);
        };
        Euclidean2.prototype.div = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            return divide(this.w, this.x, this.y, this.xy, rhs.w, rhs.x, rhs.y, rhs.xy, Unit.div(this.uom, rhs.uom), undefined);
        };
        Euclidean2.prototype.__div__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.div(other);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.div(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rdiv__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.div(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).div(this);
            }
        };
        Euclidean2.splat = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
            var x1 = 0;
            var x2 = 0;
            var x3 = 0;
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.splat = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.splat(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.wedge = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = extE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.wedge = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.wedge(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__wedge__ = function (other) {
            if (other instanceof Euclidean2) {
                var rhs = other;
                return this.wedge(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.wedge(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rwedge__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.wedge(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).wedge(this);
            }
        };
        Euclidean2.lshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.lshift = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.lshift(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__lshift__ = function (other) {
            if (other instanceof Euclidean2) {
                var rhs = other;
                return this.lshift(rhs);
            }
            else if (typeof other === 'number') {
                var w = other;
                return this.lshift(new Euclidean2(w, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rlshift__ = function (other) {
            if (other instanceof Euclidean2) {
                var lhs = other;
                return lhs.lshift(this);
            }
            else if (typeof other === 'number') {
                var w = other;
                return new Euclidean2(w, 0, 0, 0, undefined).lshift(this);
            }
        };
        Euclidean2.rshift = function (a, b) {
            var a0 = a[0];
            var a1 = a[1];
            var a2 = a[2];
            var a3 = a[3];
            var b0 = b[0];
            var b1 = b[1];
            var b2 = b[2];
            var b3 = b[3];
            var x0 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
            var x1 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
            var x2 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
            var x3 = rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
            return [x0, x1, x2, x3];
        };
        Euclidean2.prototype.rshift = function (rhs) {
            assertArgEuclidean2('rhs', rhs);
            var xs = Euclidean2.rshift(this.coordinates(), rhs.coordinates());
            return new Euclidean2(xs[0], xs[1], xs[2], xs[3], Unit.mul(this.uom, rhs.uom));
        };
        Euclidean2.prototype.__rshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.rshift(other);
            }
            else if (typeof other === 'number') {
                return this.rshift(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rrshift__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.rshift(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).rshift(this);
            }
        };
        Euclidean2.prototype.__vbar__ = function (other) {
            if (other instanceof Euclidean2) {
                return this.splat(other);
            }
            else if (typeof other === 'number') {
                return this.splat(new Euclidean2(other, 0, 0, 0, undefined));
            }
        };
        Euclidean2.prototype.__rvbar__ = function (other) {
            if (other instanceof Euclidean2) {
                return other.splat(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean2(other, 0, 0, 0, undefined).splat(this);
            }
        };
        Euclidean2.prototype.__pos__ = function () {
            return this;
        };
        Euclidean2.prototype.__neg__ = function () {
            return new Euclidean2(-this.w, -this.x, -this.y, -this.xy, this.uom);
        };
        /**
         * ~ (tilde) produces reversion.
         */
        Euclidean2.prototype.__tilde__ = function () {
            return new Euclidean2(this.w, this.x, this.y, -this.xy, this.uom);
        };
        Euclidean2.prototype.grade = function (index) {
            assertArgNumber('index', index);
            switch (index) {
                case 0:
                    return new Euclidean2(this.w, 0, 0, 0, this.uom);
                case 1:
                    return new Euclidean2(0, this.x, this.y, 0, this.uom);
                case 2:
                    return new Euclidean2(0, 0, 0, this.xy, this.uom);
                default:
                    return new Euclidean2(0, 0, 0, 0, this.uom);
            }
        };
        Euclidean2.prototype.exp = function () {
            throw new Euclidean2Error('exp');
        };
        Euclidean2.prototype.norm = function () {
            return new Euclidean2(Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.xy * this.xy), 0, 0, 0, this.uom);
        };
        Euclidean2.prototype.quad = function () {
            return new Euclidean2(this.w * this.w + this.x * this.x + this.y * this.y + this.xy * this.xy, 0, 0, 0, Unit.mul(this.uom, this.uom));
        };
        Euclidean2.prototype.isNaN = function () {
            return isNaN(this.w) || isNaN(this.x) || isNaN(this.y) || isNaN(this.xy);
        };
        Euclidean2.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates(this.coordinates(), coordToString, labels);
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
        Euclidean2.prototype.toExponential = function () {
            var coordToString = function (coord) {
                return coord.toExponential();
            };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toFixed = function (digits) {
            var coordToString = function (coord) {
                return coord.toFixed(digits);
            };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toString = function () {
            var coordToString = function (coord) {
                return coord.toString();
            };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        Euclidean2.prototype.toStringIJK = function () {
            var coordToString = function (coord) {
                return coord.toString();
            };
            return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
        };
        Euclidean2.prototype.toStringLATEX = function () {
            var coordToString = function (coord) {
                return coord.toString();
            };
            return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{12}"]);
        };
        return Euclidean2;
    })();
    return Euclidean2;
});

define('davinci-blade/Euclidean3',["require", "exports", 'davinci-blade/Unit'], function (require, exports, Unit) {
    function Euclidean3Error(message) {
        this.name = 'Euclidean3Error';
        this.message = (message || "");
    }
    Euclidean3Error.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new Euclidean3Error("Argument '" + name + "' must be a number");
        }
    }
    function assertArgEuclidean3(name, arg) {
        if (arg instanceof Euclidean3) {
            return arg;
        }
        else {
            throw new Euclidean3Error("Argument '" + arg + "' must be a Euclidean3");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new Euclidean3Error("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    function compute(f, a, b, coord, pack, uom) {
        var a0 = coord(a, 0);
        var a1 = coord(a, 1);
        var a2 = coord(a, 2);
        var a3 = coord(a, 3);
        var a4 = coord(a, 4);
        var a5 = coord(a, 5);
        var a6 = coord(a, 6);
        var a7 = coord(a, 7);
        var b0 = coord(b, 0);
        var b1 = coord(b, 1);
        var b2 = coord(b, 2);
        var b3 = coord(b, 3);
        var b4 = coord(b, 4);
        var b5 = coord(b, 5);
        var b6 = coord(b, 6);
        var b7 = coord(b, 7);
        var x0 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return pack(x0, x1, x2, x3, x4, x5, x6, x7, uom);
    }
    function addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
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
                    x = +(a0 + b0);
                }
                break;
            case 1:
                {
                    x = +(a1 + b1);
                }
                break;
            case 2:
                {
                    x = +(a2 + b2);
                }
                break;
            case 3:
                {
                    x = +(a3 + b3);
                }
                break;
            case 4:
                {
                    x = +(a4 + b4);
                }
                break;
            case 5:
                {
                    x = +(a5 + b5);
                }
                break;
            case 6:
                {
                    x = +(a6 + b6);
                }
                break;
            case 7:
                {
                    x = +(a7 + b7);
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    function subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
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
            case 4:
                {
                    x = +(a4 - b4);
                }
                break;
            case 5:
                {
                    x = +(a5 - b5);
                }
                break;
            case 6:
                {
                    x = +(a6 - b6);
                }
                break;
            case 7:
                {
                    x = +(a7 - b7);
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    /**
     *
     */
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
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    function scpE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
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
                    x = 0;
                }
                break;
            case 2:
                {
                    x = 0;
                }
                break;
            case 3:
                {
                    x = 0;
                }
                break;
            case 4:
                {
                    x = 0;
                }
                break;
            case 5:
                {
                    x = 0;
                }
                break;
            case 6:
                {
                    x = 0;
                }
                break;
            case 7:
                {
                    x = 0;
                }
                break;
            default: {
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
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
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
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
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
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
                throw new Euclidean3Error("index must be in the range [0..7]");
            }
        }
        return +x;
    }
    var divide = function (a000, a001, a010, a011, a100, a101, a110, a111, b000, b001, b010, b011, b100, b101, b110, b111, uom, dst) {
        var c000, c001, c010, c011, c100, c101, c110, c111, i000, i001, i010, i011, i100, i101, i110, i111, k000, m000, m001, m010, m011, m100, m101, m110, m111, r000, r001, r010, r011, r100, r101, r110, r111, s000, s001, s010, s011, s100, s101, s110, s111, w, x, x000, x001, x010, x011, x100, x101, x110, x111, xy, xyz, y, yz, z, zx;
        r000 = +b000;
        r001 = +b001;
        r010 = +b010;
        r011 = -b011;
        r100 = +b100;
        r101 = -b101;
        r110 = -b110;
        r111 = -b111;
        m000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 0);
        m001 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 1);
        m010 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 2);
        m011 = 0;
        m100 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, r000, r001, r010, r100, r011, r110, -r101, r111, 3);
        m101 = 0;
        m110 = 0;
        m111 = 0;
        c000 = +m000;
        c001 = -m001;
        c010 = -m010;
        c011 = -m011;
        c100 = -m100;
        c101 = -m101;
        c110 = -m110;
        c111 = +m111;
        s000 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 0);
        s001 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 1);
        s010 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 2);
        s011 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 4);
        s100 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 3);
        s101 = -mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 6);
        s110 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 5);
        s111 = mulE3(r000, r001, r010, r100, r011, r110, -r101, r111, c000, c001, c010, c100, c011, c110, -c101, c111, 7);
        k000 = mulE3(b000, b001, b010, b100, b011, b110, -b101, b111, s000, s001, s010, s100, s011, s110, -s101, s111, 0);
        i000 = s000 / k000;
        i001 = s001 / k000;
        i010 = s010 / k000;
        i011 = s011 / k000;
        i100 = s100 / k000;
        i101 = s101 / k000;
        i110 = s110 / k000;
        i111 = s111 / k000;
        x000 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 0);
        x001 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 1);
        x010 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 2);
        x011 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 4);
        x100 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 3);
        x101 = -mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 6);
        x110 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 5);
        x111 = mulE3(a000, a001, a010, a100, a011, a110, -a101, a111, i000, i001, i010, i100, i011, i110, -i101, i111, 7);
        w = x000;
        x = x001;
        y = x010;
        z = x100;
        xy = x011;
        yz = x110;
        zx = -x101;
        xyz = x111;
        if (typeof dst !== 'undefined') {
            dst.w = w;
            dst.x = x;
            dst.y = y;
            dst.z = z;
            dst.xy = xy;
            dst.yz = yz;
            dst.zx = zx;
            dst.xyz = xyz;
            dst.uom = uom;
        }
        else {
            return new Euclidean3(w, x, y, z, xy, yz, zx, xyz, uom);
        }
    };
    function stringFromCoordinates(coordinates, numberToString, labels) {
        var i, _i, _ref;
        var str;
        var sb = [];
        var append = function (coord, label) {
            var n;
            if (coord !== 0) {
                if (coord >= 0) {
                    if (sb.length > 0) {
                        sb.push("+");
                    }
                }
                else {
                    sb.push("-");
                }
                n = Math.abs(coord);
                if (n === 1) {
                    sb.push(label);
                }
                else {
                    sb.push(numberToString(n));
                    if (label !== "1") {
                        sb.push("*");
                        sb.push(label);
                    }
                }
            }
        };
        for (i = _i = 0, _ref = coordinates.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
            append(coordinates[i], labels[i]);
        }
        if (sb.length > 0) {
            str = sb.join("");
        }
        else {
            str = "0";
        }
        return str;
    }
    /**
     * The Euclidean3 class represents a multivector for a 3-dimensional vector space with a Euclidean metric.
     * @class Euclidean3
     */
    var Euclidean3 = (function () {
        /**
         * Constructs a Euclidean3 from its coordinates.
         * @constructor
         * @param {number} w The scalar part of the multivector.
         * @param {number} x The vector component of the multivector in the x-direction.
         * @param {number} y The vector component of the multivector in the y-direction.
         * @param {number} z The vector component of the multivector in the z-direction.
         * @param {number} xy The bivector component of the multivector in the xy-plane.
         * @param {number} yz The bivector component of the multivector in the yz-plane.
         * @param {number} zx The bivector component of the multivector in the zx-plane.
         * @param {number} xyz The pseudoscalar part of the multivector.
         * @param uom The optional unit of measure.
         */
        function Euclidean3(w, x, y, z, xy, yz, zx, xyz, uom) {
            this.w = assertArgNumber('w', w);
            this.x = assertArgNumber('x', x);
            this.y = assertArgNumber('y', y);
            this.z = assertArgNumber('z', z);
            this.xy = assertArgNumber('xy', xy);
            this.yz = assertArgNumber('yz', yz);
            this.zx = assertArgNumber('zx', zx);
            this.xyz = assertArgNumber('xyz', xyz);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.scale !== 1) {
                var scale = this.uom.scale;
                this.w *= scale;
                this.x *= scale;
                this.y *= scale;
                this.z *= scale;
                this.xy *= scale;
                this.yz *= scale;
                this.zx *= scale;
                this.xyz *= scale;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Euclidean3.fromCartesian = function (w, x, y, z, xy, yz, zx, xyz, uom) {
            assertArgNumber('w', w);
            assertArgNumber('x', x);
            assertArgNumber('y', y);
            assertArgNumber('z', z);
            assertArgNumber('xy', xy);
            assertArgNumber('yz', yz);
            assertArgNumber('zx', zx);
            assertArgNumber('xyz', xyz);
            assertArgUnitOrUndefined('uom', uom);
            return new Euclidean3(w, x, y, z, xy, yz, zx, xyz, uom);
        };
        Euclidean3.prototype.coordinates = function () {
            return [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz];
        };
        Euclidean3.prototype.coordinate = function (index) {
            assertArgNumber('index', index);
            switch (index) {
                case 0:
                    return this.w;
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
                    return this.xyz;
                default:
                    throw new Euclidean3Error("index must be in the range [0..7]");
            }
        };
        Euclidean3.prototype.add = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(addE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__add__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return this.add(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__radd__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.add(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).add(this);
            }
        };
        Euclidean3.prototype.sub = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(subE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.compatible(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__sub__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.sub(other);
            }
            else if (typeof other === 'number') {
                return this.sub(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rsub__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.sub(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).sub(this);
            }
        };
        Euclidean3.prototype.mul = function (rhs) {
            if (typeof rhs === 'number') {
                return this.scalarMultiply(rhs);
            }
            else {
                var coord = function (x, n) {
                    return x[n];
                };
                var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                    return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
                };
                return compute(mulE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.mul(this.uom, rhs.uom));
            }
        };
        Euclidean3.prototype.__mul__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.mul(other);
            }
            else if (typeof other === 'number') {
                return this.mul(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rmul__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.mul(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).mul(this);
            }
        };
        Euclidean3.prototype.scalarMultiply = function (rhs) {
            return new Euclidean3(this.w * rhs, this.x * rhs, this.y * rhs, this.z * rhs, this.xy * rhs, this.yz * rhs, this.zx * rhs, this.xyz * rhs, this.uom);
        };
        Euclidean3.prototype.div = function (rhs) {
            assertArgEuclidean3('rhs', rhs);
            return divide(this.w, this.x, this.y, this.xy, this.z, -this.zx, this.yz, this.xyz, rhs.w, rhs.x, rhs.y, rhs.xy, rhs.z, -rhs.zx, rhs.yz, rhs.xyz, Unit.div(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__div__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.div(other);
            }
            else if (typeof other === 'number') {
                return this.div(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rdiv__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.div(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).div(this);
            }
        };
        Euclidean3.prototype.splat = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(scpE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean3.prototype.wedge = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(extE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__vbar__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.splat(other);
            }
            else if (typeof other === 'number') {
                return this.splat(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rvbar__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.splat(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).splat(this);
            }
        };
        Euclidean3.prototype.__wedge__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.wedge(other);
            }
            else if (typeof other === 'number') {
                return this.wedge(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rwedge__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.wedge(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).wedge(this);
            }
        };
        Euclidean3.prototype.lshift = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(lcoE3, this.coordinates(), rhs.coordinates(), coord, pack, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__lshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.lshift(other);
            }
            else if (typeof other === 'number') {
                return this.lshift(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rlshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.lshift(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).lshift(this);
            }
        };
        Euclidean3.prototype.rshift = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return Euclidean3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(rcoE3, [this.w, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.xyz], [rhs.w, rhs.x, rhs.y, rhs.z, rhs.xy, rhs.yz, rhs.zx, rhs.xyz], coord, pack, Unit.mul(this.uom, rhs.uom));
        };
        Euclidean3.prototype.__rshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return this.rshift(other);
            }
            else if (typeof other === 'number') {
                return this.rshift(new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined));
            }
        };
        Euclidean3.prototype.__rrshift__ = function (other) {
            if (other instanceof Euclidean3) {
                return other.rshift(this);
            }
            else if (typeof other === 'number') {
                return new Euclidean3(other, 0, 0, 0, 0, 0, 0, 0, undefined).rshift(this);
            }
        };
        Euclidean3.prototype.__pos__ = function () {
            return this;
        };
        Euclidean3.prototype.__neg__ = function () {
            return new Euclidean3(-this.w, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        /**
         * ~ (tilde) produces reversion.
         */
        Euclidean3.prototype.__tilde__ = function () {
            return new Euclidean3(this.w, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.xyz, this.uom);
        };
        Euclidean3.prototype.grade = function (index) {
            assertArgNumber('index', index);
            switch (index) {
                case 0:
                    return Euclidean3.fromCartesian(this.w, 0, 0, 0, 0, 0, 0, 0, this.uom);
                case 1:
                    return Euclidean3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
                case 2:
                    return Euclidean3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
                case 3:
                    return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.xyz, this.uom);
                default:
                    return Euclidean3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        // FIXME: This should return a Euclidean3
        Euclidean3.prototype.dot = function (vector) {
            return this.x * vector.x + this.y * vector.y + this.z * vector.z;
        };
        Euclidean3.prototype.cross = function (vector) {
            var x, x1, x2, y, y1, y2, z, z1, z2;
            x1 = this.x;
            y1 = this.y;
            z1 = this.z;
            x2 = vector.x;
            y2 = vector.y;
            z2 = vector.z;
            x = y1 * z2 - z1 * y2;
            y = z1 * x2 - x1 * z2;
            z = x1 * y2 - y1 * x2;
            return new Euclidean3(0, x, y, z, 0, 0, 0, 0, Unit.mul(this.uom, vector.uom));
        };
        Euclidean3.prototype.length = function () {
            return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz);
        };
        Euclidean3.prototype.exp = function () {
            throw new Euclidean3Error('exp');
        };
        /**
         * Computes the magnitude of this Euclidean3. The magnitude is the square root of the quadrance.
         */
        Euclidean3.prototype.norm = function () {
            return new Euclidean3(Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        /**
         * Computes the quadrance of this Euclidean3. The quadrance is the square of the magnitude.
         */
        Euclidean3.prototype.quad = function () {
            return new Euclidean3(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z + this.xy * this.xy + this.yz * this.yz + this.zx * this.zx + this.xyz * this.xyz, 0, 0, 0, 0, 0, 0, 0, Unit.mul(this.uom, this.uom));
        };
        Euclidean3.prototype.sqrt = function () {
            return new Euclidean3(Math.sqrt(this.w), 0, 0, 0, 0, 0, 0, 0, Unit.sqrt(this.uom));
        };
        Euclidean3.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates(this.coordinates(), coordToString, labels);
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
        Euclidean3.prototype.toExponential = function () {
            var coordToString = function (coord) {
                return coord.toExponential();
            };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]);
        };
        Euclidean3.prototype.toFixed = function (digits) {
            assertArgNumber('digits', digits);
            var coordToString = function (coord) {
                return coord.toFixed(digits);
            };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]);
        };
        Euclidean3.prototype.toString = function () {
            var coordToString = function (coord) {
                return coord.toString();
            };
            return this.toStringCustom(coordToString, ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"]);
        };
        Euclidean3.prototype.toStringIJK = function () {
            var coordToString = function (coord) {
                return coord.toString();
            };
            return this.toStringCustom(coordToString, ["1", "i", "j", "k", "ij", "jk", "ki", "I"]);
        };
        Euclidean3.prototype.toStringLATEX = function () {
            var coordToString = function (coord) {
                return coord.toString();
            };
            return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{3}", "e_{12}", "e_{23}", "e_{31}", "e_{123}"]);
        };
        return Euclidean3;
    })();
    return Euclidean3;
});

define('davinci-blade/Complex',["require", "exports", 'davinci-blade/Unit'], function (require, exports, Unit) {
    function ComplexError(message) {
        this.name = 'ComplexError';
        this.message = (message || "");
    }
    ComplexError.prototype = new Error();
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new ComplexError("Argument '" + name + "' must be a number");
        }
    }
    function assertArgComplex(name, arg) {
        if (arg instanceof Complex) {
            return arg;
        }
        else {
            throw new ComplexError("Argument '" + arg + "' must be a Complex");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit) {
            return uom;
        }
        else {
            throw new ComplexError("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    function divide(a, b) {
        assertArgComplex('a', a);
        assertArgComplex('b', b);
        var q = b.x * b.x + b.y * b.y;
        var x = (a.x * b.x + a.y * b.y) / q;
        var y = (a.y * b.x - a.x * b.y) / q;
        return new Complex(x, y, Unit.div(a.uom, b.uom));
    }
    var Complex = (function () {
        /**
         * Constructs a complex number z = (x, y).
         * @param x The real part of the complex number.
         * @param y The imaginary part of the complex number.
         */
        function Complex(x, y, uom) {
            this.x = assertArgNumber('x', x);
            this.y = assertArgNumber('y', y);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.scale !== 1) {
                var scale = this.uom.scale;
                this.x *= scale;
                this.y *= scale;
                this.uom = new Unit(1, uom.dimensions, uom.labels);
            }
        }
        Complex.prototype.coordinates = function () {
            return [this.x, this.y];
        };
        Complex.prototype.add = function (rhs) {
            assertArgComplex('rhs', rhs);
            return new Complex(this.x + rhs.x, this.y + rhs.y, Unit.compatible(this.uom, rhs.uom));
        };
        /**
         * __add__ supports operator +(Complex, any)
         */
        Complex.prototype.__add__ = function (other) {
            if (other instanceof Complex) {
                return this.add(other);
            }
            else if (typeof other === 'number') {
                return new Complex(this.x + other, this.y, Unit.compatible(this.uom, undefined));
            }
        };
        /**
         * __radd__ supports operator +(any, Complex)
         */
        Complex.prototype.__radd__ = function (other) {
            if (other instanceof Complex) {
                var lhs = other;
                return new Complex(other.x + this.x, other.y + this.y, Unit.compatible(lhs.uom, this.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(x + this.x, this.y, Unit.compatible(undefined, this.uom));
            }
        };
        Complex.prototype.sub = function (rhs) {
            assertArgComplex('rhs', rhs);
            return new Complex(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
        };
        Complex.prototype.__sub__ = function (other) {
            if (other instanceof Complex) {
                var rhs = other;
                return new Complex(this.x - rhs.x, this.y - rhs.y, Unit.compatible(this.uom, rhs.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(this.x - x, this.y, Unit.compatible(this.uom, undefined));
            }
        };
        Complex.prototype.__rsub__ = function (other) {
            if (other instanceof Complex) {
                var lhs = other;
                return new Complex(lhs.x - this.x, lhs.y - this.y, Unit.compatible(lhs.uom, this.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(x - this.x, -this.y, Unit.compatible(undefined, this.uom));
            }
        };
        Complex.prototype.__mul__ = function (other) {
            if (other instanceof Complex) {
                var rhs = other;
                return new Complex(this.x * rhs.x - this.y * rhs.y, this.x * rhs.y + this.y * rhs.x, Unit.mul(this.uom, rhs.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(this.x * x, this.y * x, this.uom);
            }
        };
        Complex.prototype.__rmul__ = function (other) {
            if (other instanceof Complex) {
                var lhs = other;
                return new Complex(lhs.x * this.x - lhs.y * this.y, lhs.x * this.y + lhs.y * this.x, Unit.mul(lhs.uom, this.uom));
            }
            else if (typeof other === 'number') {
                var x = other;
                return new Complex(x * this.x, x * this.y, this.uom);
            }
        };
        Complex.prototype.__div__ = function (other) {
            if (other instanceof Complex) {
                return divide(this, other);
            }
            else if (typeof other === 'number') {
                return new Complex(this.x / other, this.y / other, this.uom);
            }
        };
        Complex.prototype.__rdiv__ = function (other) {
            if (other instanceof Complex) {
                return divide(other, this);
            }
            else if (typeof other === 'number') {
                return divide(new Complex(other, 0, undefined), this);
            }
        };
        Complex.prototype.wedge = function (rhs) {
            throw new ComplexError('wedge');
        };
        Complex.prototype.lshift = function (rhs) {
            throw new ComplexError('lshift');
        };
        Complex.prototype.rshift = function (rhs) {
            throw new ComplexError('rshift');
        };
        Complex.prototype.norm = function () {
            return new Complex(Math.sqrt(this.x * this.x + this.y * this.y), 0, this.uom);
        };
        Complex.prototype.quad = function () {
            return new Complex(this.x * this.x + this.y * this.y, 0, Unit.mul(this.uom, this.uom));
        };
        Complex.prototype.arg = function () {
            return Math.atan2(this.y, this.x);
        };
        /**
         * Computes the exponential of this complex number.
         */
        Complex.prototype.exp = function () {
            var expX = Math.exp(this.x);
            var x = expX * Math.cos(this.y);
            var y = expX * Math.sin(this.y);
            return new Complex(x, y, this.uom);
        };
        Complex.prototype.toExponential = function () {
            return "Complex(" + this.x.toExponential() + ", " + this.y.toExponential() + ")";
        };
        Complex.prototype.toFixed = function (digits) {
            return "Complex(" + this.x.toFixed(digits) + ", " + this.y.toFixed(digits) + ")";
        };
        Complex.prototype.toString = function () {
            return "Complex(" + this.x + ", " + this.y + ")";
        };
        return Complex;
    })();
    return Complex;
});

define('davinci-blade/Color',["require", "exports"], function (require, exports) {
    var Color = (function () {
        function Color(red, green, blue) {
            this._red = red;
            this._green = green;
            this._blue = blue;
        }
        Color.prototype.luminance = function () {
            return Color.luminance(this._red, this._green, this._blue);
        };
        Color.prototype.toString = function () {
            return "Color(" + this._red + ", " + this._green + ", " + this._blue + ")";
        };
        Color.prototype.asFillStyle = function () {
            return "rgb(" + Math.floor(this._red * 255) + ", " + Math.floor(this._green * 255) + ", " + Math.floor(this._blue * 255) + ")";
        };
        Color.luminance = function (red, green, blue) {
            var gamma = 2.2;
            return 0.2126 * Math.pow(red, gamma) + 0.7152 * Math.pow(green, gamma) + 0.0722 * Math.pow(blue, gamma);
        };
        /**
         * Converts an angle, radius, height to a color on a color wheel.
         */
        Color.fromHSL = function (H, S, L) {
            var C = (1 - Math.abs(2 * L - 1)) * S;
            function normalizeAngle(angle) {
                if (angle > 2 * Math.PI) {
                    return normalizeAngle(angle - 2 * Math.PI);
                }
                else if (angle < 0) {
                    return normalizeAngle(angle + 2 * Math.PI);
                }
                else {
                    return angle;
                }
            }
            function matchLightness(R, G, B) {
                var x = Color.luminance(R, G, B);
                var m = L - (0.5 * C);
                return new Color(R + m, G + m, B + m);
            }
            var sextant = ((normalizeAngle(H) / Math.PI) * 3) % 6;
            var X = C * (1 - Math.abs(sextant % 2 - 1));
            if (sextant >= 0 && sextant < 1) {
                return matchLightness(C, X, 0.0);
            }
            else if (sextant >= 1 && sextant < 2) {
                return matchLightness(X, C, 0.0);
            }
            else if (sextant >= 2 && sextant < 3) {
                return matchLightness(0.0, C, C * (sextant - 2));
            }
            else if (sextant >= 3 && sextant < 4) {
                return matchLightness(0.0, C * (4 - sextant), C);
            }
            else if (sextant >= 4 && sextant < 5) {
                return matchLightness(X, 0.0, C);
            }
            else if (sextant >= 5 && sextant < 6) {
                return matchLightness(C, 0.0, X);
            }
            else {
                return matchLightness(0.0, 0.0, 0.0);
            }
        };
        return Color;
    })();
    return Color;
});

define('davinci-blade/e2ga/scalarE2',["require", "exports", 'davinci-blade/Euclidean2'], function (require, exports, Euclidean2) {
    var scalarE2 = function (w, uom) {
        return new Euclidean2(w, 0, 0, 0, uom);
    };
    return scalarE2;
});

define('davinci-blade/e2ga/vectorE2',["require", "exports", 'davinci-blade/Euclidean2'], function (require, exports, Euclidean2) {
    var vectorE2 = function (x, y, uom) {
        return new Euclidean2(0, x, y, 0, uom);
    };
    return vectorE2;
});

define('davinci-blade/e3ga/scalarE3',["require", "exports", 'davinci-blade/Euclidean3'], function (require, exports, Euclidean3) {
    var scalarE3 = function (w, uom) {
        return new Euclidean3(w, 0, 0, 0, 0, 0, 0, 0, uom);
    };
    return scalarE3;
});

define('davinci-blade/e3ga/vectorE3',["require", "exports", 'davinci-blade/Euclidean3'], function (require, exports, Euclidean3) {
    var vectorE3 = function (x, y, z, uom) {
        return new Euclidean3(0, x, y, z, 0, 0, 0, 0, uom);
    };
    return vectorE3;
});

define('davinci-blade/e3ga/bivectorE3',["require", "exports", 'davinci-blade/Euclidean3'], function (require, exports, Euclidean3) {
    var bivectorE3 = function (xy, yz, zx, uom) {
        return new Euclidean3(0, 0, 0, 0, xy, yz, zx, 0, uom);
    };
    return bivectorE3;
});

define('davinci-blade',["require", "exports", 'davinci-blade/core', 'davinci-blade/Euclidean1', 'davinci-blade/Euclidean2', 'davinci-blade/Euclidean3', 'davinci-blade/Rational', 'davinci-blade/Dimensions', 'davinci-blade/Unit', 'davinci-blade/Complex', 'davinci-blade/Color', 'davinci-blade/e2ga/scalarE2', 'davinci-blade/e2ga/vectorE2', 'davinci-blade/e3ga/scalarE3', 'davinci-blade/e3ga/vectorE3', 'davinci-blade/e3ga/bivectorE3'], function (require, exports, core, Euclidean1, Euclidean2, Euclidean3, Rational, Dimensions, Unit, Complex, Color, scalarE2, vectorE2, scalarE3, vectorE3, bivectorE3) {
    var UNIT_SYMBOLS = ["kg", "m", "s", "C", "K", "mol", "cd"];
    var R0 = Rational.ZERO;
    var R1 = Rational.ONE;
    var N1 = Rational.MINUS_ONE;
    var UNIT_DIMLESS = new Unit(1, new Dimensions(R0, R0, R0, R0, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_KILOGRAM = new Unit(1, new Dimensions(R1, R0, R0, R0, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_METER = new Unit(1, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_SECOND = new Unit(1, new Dimensions(R0, R0, R1, R0, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_AMPERE = new Unit(1, new Dimensions(R0, R0, N1, R1, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_KELVIN = new Unit(1, new Dimensions(R0, R0, R0, R0, R1, R0, R0), UNIT_SYMBOLS);
    var UNIT_MOLE = new Unit(1, new Dimensions(R0, R0, R0, R0, R0, R1, R0), UNIT_SYMBOLS);
    var UNIT_CANDELA = new Unit(1, new Dimensions(R0, R0, R0, R0, R0, R0, R1), UNIT_SYMBOLS);
    var UNIT_COULOMB = new Unit(1, new Dimensions(R0, R0, R0, R1, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_INCH = new Unit(0.0254, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_FOOT = new Unit(0.3048, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_YARD = new Unit(0.9144, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_MILE = new Unit(1609.344, new Dimensions(R0, R1, R0, R0, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_POUND = new Unit(0.45359237, new Dimensions(R1, R0, R0, R0, R0, R0, R0), UNIT_SYMBOLS);
    var UNIT_NEWTON = UNIT_METER.mul(UNIT_KILOGRAM).div(UNIT_SECOND.mul(UNIT_SECOND));
    var UNIT_JOULE = UNIT_NEWTON.mul(UNIT_METER);
    var UNIT_WATT = UNIT_JOULE.div(UNIT_SECOND);
    var UNIT_VOLT = UNIT_JOULE.div(UNIT_COULOMB);
    var UNIT_WEBER = UNIT_VOLT.mul(UNIT_SECOND);
    var UNIT_TESLA = UNIT_WEBER.div(UNIT_METER.mul(UNIT_METER));
    var UNIT_OHM = UNIT_VOLT.div(UNIT_AMPERE);
    var UNIT_SIEMEN = UNIT_AMPERE.div(UNIT_VOLT);
    var UNIT_FARAD = UNIT_COULOMB.div(UNIT_VOLT);
    var UNIT_HENRY = UNIT_TESLA.mul(UNIT_METER.mul(UNIT_METER)).div(UNIT_AMPERE);
    var UNIT_HERTZ = UNIT_DIMLESS.div(UNIT_SECOND);
    var UNIT_PASCAL = UNIT_NEWTON.div(UNIT_METER.mul(UNIT_METER));
    /**
     * Provides the blade module
     *
     * @module blade
     */
    var blade = {
        'VERSION': core.VERSION,
        Color: Color,
        Complex: Complex,
        Euclidean1: Euclidean1,
        Euclidean2: Euclidean2,
        Euclidean3: Euclidean3,
        scalarE3: scalarE3,
        vectorE3: vectorE3,
        bivectorE3: bivectorE3,
        Rational: Rational,
        Dimensions: Dimensions,
        Unit: Unit,
        e2ga: {
            e1: vectorE2(1, 0),
            e2: vectorE2(0, 1),
            units: {
                ampere: scalarE2(1, UNIT_AMPERE),
                candela: scalarE2(1, UNIT_CANDELA),
                coulomb: scalarE2(1, UNIT_COULOMB),
                farad: scalarE2(1, UNIT_FARAD),
                foot: scalarE2(1, UNIT_FOOT),
                henry: scalarE2(1, UNIT_HENRY),
                hertz: scalarE2(1, UNIT_HERTZ),
                inch: scalarE2(1, UNIT_INCH),
                joule: scalarE2(1, UNIT_JOULE),
                kelvin: scalarE2(1, UNIT_KELVIN),
                kilogram: scalarE2(1, UNIT_KILOGRAM),
                meter: scalarE2(1, UNIT_METER),
                mile: scalarE2(1, UNIT_MILE),
                mole: scalarE2(1, UNIT_MOLE),
                newton: scalarE2(1, UNIT_NEWTON),
                ohm: scalarE2(1, UNIT_OHM),
                pascal: scalarE2(1, UNIT_PASCAL),
                pound: scalarE2(1, UNIT_POUND),
                second: scalarE2(1, UNIT_SECOND),
                siemen: scalarE2(1, UNIT_SIEMEN),
                tesla: scalarE2(1, UNIT_TESLA),
                unity: scalarE2(1, UNIT_DIMLESS),
                volt: scalarE2(1, UNIT_VOLT),
                watt: scalarE2(1, UNIT_WATT),
                weber: scalarE2(1, UNIT_WEBER),
                yard: scalarE2(1, UNIT_YARD)
            }
        },
        e3ga: {
            e1: vectorE3(1, 0, 0),
            e2: vectorE3(0, 1, 0),
            e3: vectorE3(0, 0, 1),
            units: {
                ampere: scalarE3(1, UNIT_AMPERE),
                candela: scalarE3(1, UNIT_CANDELA),
                coulomb: scalarE3(1, UNIT_COULOMB),
                farad: scalarE3(1, UNIT_FARAD),
                foot: scalarE3(1, UNIT_FOOT),
                henry: scalarE3(1, UNIT_HENRY),
                hertz: scalarE3(1, UNIT_HERTZ),
                inch: scalarE3(1, UNIT_INCH),
                joule: scalarE3(1, UNIT_JOULE),
                kelvin: scalarE3(1, UNIT_KELVIN),
                kilogram: scalarE3(1, UNIT_KILOGRAM),
                meter: scalarE3(1, UNIT_METER),
                mile: scalarE3(1, UNIT_MILE),
                mole: scalarE3(1, UNIT_MOLE),
                newton: scalarE3(1, UNIT_NEWTON),
                ohm: scalarE3(1, UNIT_OHM),
                pascal: scalarE3(1, UNIT_PASCAL),
                pound: scalarE3(1, UNIT_POUND),
                second: scalarE3(1, UNIT_SECOND),
                siemen: scalarE3(1, UNIT_SIEMEN),
                tesla: scalarE3(1, UNIT_TESLA),
                unity: scalarE3(1, UNIT_DIMLESS),
                volt: scalarE3(1, UNIT_VOLT),
                watt: scalarE3(1, UNIT_WATT),
                weber: scalarE3(1, UNIT_WEBER),
                yard: scalarE3(1, UNIT_YARD)
            }
        },
        units: {
            ampere: UNIT_AMPERE,
            candela: UNIT_CANDELA,
            coulomb: UNIT_COULOMB,
            farad: UNIT_FARAD,
            foot: UNIT_FOOT,
            henry: UNIT_HENRY,
            hertz: UNIT_HERTZ,
            inch: UNIT_INCH,
            joule: UNIT_JOULE,
            kelvin: UNIT_KELVIN,
            kilogram: UNIT_KILOGRAM,
            meter: UNIT_METER,
            mile: UNIT_MILE,
            mole: UNIT_MOLE,
            newton: UNIT_NEWTON,
            ohm: UNIT_OHM,
            pascal: UNIT_PASCAL,
            pound: UNIT_POUND,
            second: UNIT_SECOND,
            siemen: UNIT_SIEMEN,
            tesla: UNIT_TESLA,
            unity: UNIT_DIMLESS,
            volt: UNIT_VOLT,
            watt: UNIT_WATT,
            weber: UNIT_WEBER,
            yard: UNIT_YARD
        }
    };
    return blade;
});

  var library = require('davinci-blade');
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['blade'] = library;
  }
}(this));
