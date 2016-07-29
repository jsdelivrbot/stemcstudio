(function(global, define) {
  var globalDefine = global.define;
/**
 * @license almond 0.3.2 Copyright jQuery Foundation and other contributors.
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

define("../bower_components/almond/almond", function(){});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('geocas/math/Algebra',["require", "exports"], function (require, exports) {
    "use strict";
    var wedgeBlades = function (a, b) {
        var result = [];
        var aLen = a.length;
        var bLen = b.length;
        for (var i = 0; i < aLen; i++) {
            var av = a[i];
            if (b.indexOf(av) < 0) {
                result.push(av);
            }
            else {
                return null;
            }
        }
        for (var i = 0; i < bLen; i++) {
            result.push(b[i]);
        }
        return result;
    };
    var Expr = (function () {
        function Expr(env, type) {
            this.env = env;
            this.type = type;
        }
        Expr.prototype.isChanged = function () {
            throw new Error(this.type + ".isChanged is not implemented.");
        };
        Expr.prototype.copy = function (dirty) {
            throw new Error(this.type + ".copy is not implemented.");
        };
        Expr.prototype.reset = function () {
            throw new Error(this.type + ".reset is not implemented.");
        };
        Expr.prototype.simplify = function () {
            throw new Error(this.type + ".simplify is not implemented.");
        };
        Expr.prototype.toPrefix = function () {
            throw new Error(this.type + ".toPrefix is not implemented.");
        };
        Expr.prototype.toString = function () {
            throw new Error(this.type + ".toString is not implemented.");
        };
        Expr.prototype.__add__ = function (rhs) {
            if (rhs instanceof Expr) {
                return new AddExpr(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return new AddExpr(this, new ScalarExpr(this.env, rhs));
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Expr) {
                return new AddExpr(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return new AddExpr(new ScalarExpr(this.env, lhs), this);
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Expr) {
                return new SubExpr(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return new SubExpr(this, new ScalarExpr(this.env, rhs));
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Expr) {
                return new SubExpr(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return new SubExpr(new ScalarExpr(this.env, lhs), this);
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__mul__ = function (rhs) {
            if (rhs instanceof Expr) {
                return new MultiplyExpr(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return new MultiplyExpr(this, new ScalarExpr(this.env, rhs));
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Expr) {
                return new MultiplyExpr(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return new MultiplyExpr(new ScalarExpr(this.env, lhs), this);
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__div__ = function (rhs) {
            if (rhs instanceof Expr) {
                return new DivideExpr(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return new DivideExpr(this, new ScalarExpr(this.env, rhs));
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Expr) {
                return new DivideExpr(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return new DivideExpr(new ScalarExpr(this.env, lhs), this);
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Expr) {
                return new VBarExpr(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return new VBarExpr(this, new ScalarExpr(this.env, rhs));
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Expr) {
                return new VBarExpr(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return new VBarExpr(new ScalarExpr(this.env, lhs), this);
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Expr) {
                return new LContractExpr(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return new LContractExpr(this, new ScalarExpr(this.env, rhs));
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Expr) {
                return new LContractExpr(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return new LContractExpr(new ScalarExpr(this.env, lhs), this);
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Expr) {
                return new RContractExpr(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return new RContractExpr(this, new ScalarExpr(this.env, rhs));
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Expr) {
                return new RContractExpr(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return new RContractExpr(new ScalarExpr(this.env, lhs), this);
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Expr) {
                return new WedgeExpr(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return new WedgeExpr(this, new ScalarExpr(this.env, rhs));
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Expr) {
                return new WedgeExpr(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return new WedgeExpr(new ScalarExpr(this.env, lhs), this);
            }
            else {
                return void 0;
            }
        };
        Expr.prototype.__tilde__ = function () {
            return new ReverseExpr(this);
        };
        Expr.prototype.__bang__ = function () {
            return new InverseExpr(this);
        };
        Expr.prototype.__neg__ = function () {
            return new NegExpr(this);
        };
        Expr.prototype.__pos__ = function () {
            return new PosExpr(this);
        };
        return Expr;
    }());
    exports.Expr = Expr;
    var BinaryExpr = (function (_super) {
        __extends(BinaryExpr, _super);
        function BinaryExpr(lhs, rhs, type) {
            _super.call(this, lhs.env, type);
            this.lhs = lhs;
            this.rhs = rhs;
            if (!(lhs instanceof Expr)) {
                throw new Error(type + ".lhs must be an Expr: " + typeof lhs);
            }
            if (!(rhs instanceof Expr)) {
                throw new Error(type + ".rhs must be an Expr: " + typeof rhs);
            }
        }
        return BinaryExpr;
    }(Expr));
    exports.BinaryExpr = BinaryExpr;
    var AddExpr = (function (_super) {
        __extends(AddExpr, _super);
        function AddExpr(lhs, rhs, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, lhs, rhs, 'AddExpr');
            this.dirty = dirty;
        }
        AddExpr.prototype.isChanged = function () {
            return this.dirty || this.lhs.isChanged() || this.rhs.isChanged();
        };
        AddExpr.prototype.copy = function (dirty) {
            return new AddExpr(this.lhs, this.rhs, dirty);
        };
        AddExpr.prototype.reset = function () {
            return new AddExpr(this.lhs.reset(), this.rhs.reset());
        };
        AddExpr.prototype.simplify = function () {
            var a = this.lhs.simplify();
            var b = this.rhs.simplify();
            if (b instanceof ScalarExpr && typeof b.value === 'number' && b.value === 0) {
                return a.copy(true);
            }
            else if (a instanceof MultiplyExpr && b instanceof MultiplyExpr) {
                if (a.lhs instanceof ScalarExpr && b.lhs instanceof ScalarExpr && a.rhs === b.rhs) {
                    var sa = a.lhs;
                    var sb = b.lhs;
                    if (typeof sa.value === 'number' && typeof sb.value === 'number') {
                        var s = new ScalarExpr(this.env, sa.value + sb.value);
                        return new MultiplyExpr(s, a.rhs, true);
                    }
                    else {
                        return new AddExpr(a, b);
                    }
                }
                else {
                    return new AddExpr(a, b);
                }
            }
            else if (a instanceof ScalarExpr && b instanceof ScalarExpr) {
                if (typeof a.value === 'number' && typeof b.value === 'number') {
                    return new ScalarExpr(this.env, a.value + b.value, true);
                }
                else {
                    return new AddExpr(a, b);
                }
            }
            else {
                return new AddExpr(a, b);
            }
        };
        AddExpr.prototype.toPrefix = function () {
            return "add(" + this.lhs.toPrefix() + ", " + this.rhs.toPrefix() + ")";
        };
        AddExpr.prototype.toString = function () {
            return this.lhs + " + " + this.rhs;
        };
        return AddExpr;
    }(BinaryExpr));
    exports.AddExpr = AddExpr;
    var SubExpr = (function (_super) {
        __extends(SubExpr, _super);
        function SubExpr(lhs, rhs, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, lhs, rhs, 'SubExpr');
            this.dirty = dirty;
        }
        SubExpr.prototype.isChanged = function () {
            return this.dirty || this.lhs.isChanged() || this.rhs.isChanged();
        };
        SubExpr.prototype.copy = function (dirty) {
            return new SubExpr(this.lhs, this.rhs, dirty);
        };
        SubExpr.prototype.reset = function () {
            return new SubExpr(this.lhs.reset(), this.rhs.reset());
        };
        SubExpr.prototype.simplify = function () {
            var a = this.lhs.simplify();
            var b = this.rhs.simplify();
            return new SubExpr(a, b);
        };
        SubExpr.prototype.toPrefix = function () {
            return "sub(" + this.lhs.toPrefix() + ", " + this.rhs.toPrefix() + ")";
        };
        SubExpr.prototype.toString = function () {
            return this.lhs + " - " + this.rhs;
        };
        return SubExpr;
    }(BinaryExpr));
    exports.SubExpr = SubExpr;
    var MultiplyExpr = (function (_super) {
        __extends(MultiplyExpr, _super);
        function MultiplyExpr(lhs, rhs, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, lhs, rhs, 'MultiplyExpr');
            this.dirty = dirty;
        }
        MultiplyExpr.prototype.isChanged = function () {
            return this.dirty || this.lhs.isChanged() || this.rhs.isChanged();
        };
        MultiplyExpr.prototype.copy = function (dirty) {
            return new MultiplyExpr(this.lhs, this.rhs, dirty);
        };
        MultiplyExpr.prototype.reset = function () {
            return new MultiplyExpr(this.lhs.reset(), this.rhs.reset());
        };
        MultiplyExpr.prototype.simplify = function () {
            var a = this.lhs.simplify();
            var b = this.rhs.simplify();
            if (a instanceof MultiplyExpr) {
                var aL = a.lhs;
                var aR = a.rhs;
                if (aL instanceof ScalarExpr) {
                    return new MultiplyExpr(aL, new MultiplyExpr(aR, b), true);
                }
                else {
                    return new MultiplyExpr(a, b);
                }
            }
            else if (b instanceof MultiplyExpr) {
                var bL = b.lhs;
                var bR = b.rhs;
                if (bL instanceof ScalarExpr) {
                    return new MultiplyExpr(bL, new MultiplyExpr(a, bR), true);
                }
                else {
                    return new MultiplyExpr(a, b);
                }
            }
            if (a instanceof ScalarExpr) {
                if (typeof a.value === 'number' && a.value === 0) {
                    return a.copy(true);
                }
                else if (typeof a.value === 'number' && a.value === 1) {
                    return b.copy(true);
                }
                else if (b instanceof ScalarExpr) {
                    if (typeof a.value === 'number' && a.value === 1) {
                        return b;
                    }
                    else if (typeof a.value === 'number' && typeof b.value === 'number') {
                        return new ScalarExpr(this.env, a.value * b.value, true);
                    }
                    else if (typeof a.value !== 'number' && typeof b.value === 'number') {
                        return new MultiplyExpr(b, a, true);
                    }
                    else {
                        return new MultiplyExpr(a, b);
                    }
                }
                else {
                    return new MultiplyExpr(a, b);
                }
            }
            else if (a instanceof BasisBladeExpr) {
                if (b instanceof MultiplyExpr) {
                    var bL = b.lhs;
                    var bR = b.rhs;
                    if (bL instanceof BasisBladeExpr) {
                        if (a.vectors[0] === bL.vectors[0]) {
                            return new MultiplyExpr(new MultiplyExpr(a, bL), bR, true);
                        }
                        else {
                            return new MultiplyExpr(a, b);
                        }
                    }
                    else {
                        return new MultiplyExpr(a, b);
                    }
                }
                else if (b instanceof BasisBladeExpr) {
                    if (a === b) {
                        return new VBarExpr(a, b, true);
                    }
                    else {
                        return new MultiplyExpr(a, b);
                    }
                }
                else if (b instanceof ScalarExpr) {
                    return new MultiplyExpr(b, a, true);
                }
                else {
                    return new MultiplyExpr(a, b);
                }
            }
            else {
                return new MultiplyExpr(a, b);
            }
        };
        MultiplyExpr.prototype.toPrefix = function () {
            return "mul(" + this.lhs.toPrefix() + ", " + this.rhs.toPrefix() + ")";
        };
        MultiplyExpr.prototype.toString = function () {
            return this.lhs + " * " + this.rhs;
        };
        return MultiplyExpr;
    }(BinaryExpr));
    exports.MultiplyExpr = MultiplyExpr;
    var DivideExpr = (function (_super) {
        __extends(DivideExpr, _super);
        function DivideExpr(lhs, rhs, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, lhs, rhs, 'SubExpr');
            this.dirty = dirty;
        }
        DivideExpr.prototype.isChanged = function () {
            return this.dirty || this.lhs.isChanged() || this.rhs.isChanged();
        };
        DivideExpr.prototype.copy = function (dirty) {
            return new DivideExpr(this.lhs, this.rhs, dirty);
        };
        DivideExpr.prototype.reset = function () {
            return new DivideExpr(this.lhs.reset(), this.rhs.reset());
        };
        DivideExpr.prototype.simplify = function () {
            var a = this.lhs.simplify();
            var b = this.rhs.simplify();
            return new DivideExpr(a, b);
        };
        DivideExpr.prototype.toPrefix = function () {
            return "div(" + this.lhs.toPrefix() + ", " + this.rhs.toPrefix() + ")";
        };
        DivideExpr.prototype.toString = function () {
            return this.lhs + " / " + this.rhs;
        };
        return DivideExpr;
    }(BinaryExpr));
    exports.DivideExpr = DivideExpr;
    var LContractExpr = (function (_super) {
        __extends(LContractExpr, _super);
        function LContractExpr(lhs, rhs, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, lhs, rhs, 'LContractExpr');
            this.dirty = dirty;
        }
        LContractExpr.prototype.isChanged = function () {
            return this.dirty || this.lhs.isChanged() || this.rhs.isChanged();
        };
        LContractExpr.prototype.copy = function (dirty) {
            return new LContractExpr(this.lhs, this.rhs, dirty);
        };
        LContractExpr.prototype.reset = function () {
            return new LContractExpr(this.lhs.reset(), this.rhs.reset());
        };
        LContractExpr.prototype.simplify = function () {
            var a = this.lhs.simplify();
            var b = this.rhs.simplify();
            return new LContractExpr(a, b);
        };
        LContractExpr.prototype.toPrefix = function () {
            return "lco(" + this.lhs.toPrefix() + ", " + this.rhs.toPrefix() + ")";
        };
        LContractExpr.prototype.toString = function () {
            return this.lhs + " << " + this.rhs;
        };
        return LContractExpr;
    }(BinaryExpr));
    exports.LContractExpr = LContractExpr;
    var RContractExpr = (function (_super) {
        __extends(RContractExpr, _super);
        function RContractExpr(lhs, rhs, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, lhs, rhs, 'RContractExpr');
            this.dirty = dirty;
        }
        RContractExpr.prototype.isChanged = function () {
            return this.dirty || this.lhs.isChanged() || this.rhs.isChanged();
        };
        RContractExpr.prototype.copy = function (dirty) {
            return new RContractExpr(this.lhs, this.rhs, dirty);
        };
        RContractExpr.prototype.reset = function () {
            return new RContractExpr(this.lhs.reset(), this.rhs.reset());
        };
        RContractExpr.prototype.simplify = function () {
            var a = this.lhs.simplify();
            var b = this.rhs.simplify();
            return new RContractExpr(a, b);
        };
        RContractExpr.prototype.toPrefix = function () {
            return "rco(" + this.lhs.toPrefix() + ", " + this.rhs.toPrefix() + ")";
        };
        RContractExpr.prototype.toString = function () {
            return this.lhs + " >> " + this.rhs;
        };
        return RContractExpr;
    }(BinaryExpr));
    exports.RContractExpr = RContractExpr;
    var BasisBladeExpr = (function (_super) {
        __extends(BasisBladeExpr, _super);
        function BasisBladeExpr(env, vectors, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, env, 'BasisBladeExpr');
            this.vectors = vectors;
            this.dirty = dirty;
            if (!Array.isArray(vectors)) {
                throw new Error('vectors must be a number[]');
            }
        }
        BasisBladeExpr.prototype.isChanged = function () {
            return this.dirty;
        };
        BasisBladeExpr.prototype.copy = function (dirty) {
            return new BasisBladeExpr(this.env, this.vectors, dirty);
        };
        BasisBladeExpr.prototype.reset = function () {
            if (this.dirty) {
                return new BasisBladeExpr(this.env, this.vectors, false);
            }
            else {
                return this;
            }
        };
        BasisBladeExpr.prototype.simplify = function () {
            return this;
        };
        BasisBladeExpr.prototype.toPrefix = function () {
            return this.env.bladeName(this.vectors);
        };
        BasisBladeExpr.prototype.toString = function () {
            return this.env.bladeName(this.vectors);
        };
        return BasisBladeExpr;
    }(Expr));
    exports.BasisBladeExpr = BasisBladeExpr;
    var ScalarExpr = (function (_super) {
        __extends(ScalarExpr, _super);
        function ScalarExpr(env, value, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, env, 'ScalarExpr');
            this.value = value;
            this.dirty = dirty;
        }
        ScalarExpr.prototype.isChanged = function () {
            return false;
        };
        ScalarExpr.prototype.copy = function (dirty) {
            return new ScalarExpr(this.env, this.value, dirty);
        };
        ScalarExpr.prototype.reset = function () {
            if (this.dirty) {
                return new ScalarExpr(this.env, this.value, false);
            }
            else {
                return this;
            }
        };
        ScalarExpr.prototype.simplify = function () {
            return this;
        };
        ScalarExpr.prototype.toPrefix = function () {
            return "" + this.value;
        };
        ScalarExpr.prototype.toPrefixLong = function () {
            return "ScalarExpr('" + this.value + "')";
        };
        ScalarExpr.prototype.toString = function () {
            return "" + this.value;
        };
        return ScalarExpr;
    }(Expr));
    exports.ScalarExpr = ScalarExpr;
    var VBarExpr = (function (_super) {
        __extends(VBarExpr, _super);
        function VBarExpr(lhs, rhs, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, lhs, rhs, 'VBarExpr');
            this.dirty = dirty;
        }
        VBarExpr.prototype.isChanged = function () {
            return this.dirty || this.lhs.isChanged() || this.rhs.isChanged();
        };
        VBarExpr.prototype.reset = function () {
            return new VBarExpr(this.lhs.reset(), this.rhs.reset());
        };
        VBarExpr.prototype.simplify = function () {
            var a = this.lhs.simplify();
            var b = this.rhs.simplify();
            if (a instanceof BasisBladeExpr && b instanceof BasisBladeExpr) {
                return this.env.g(a, b);
            }
            else if (a instanceof AddExpr && b instanceof BasisBladeExpr) {
                var aL = a.lhs;
                var aR = a.rhs;
                return new AddExpr(new VBarExpr(aL, b), new VBarExpr(aR, b), true);
            }
            else if (a instanceof BasisBladeExpr && b instanceof AddExpr) {
                var bL = b.lhs;
                var bR = b.rhs;
                return new AddExpr(new VBarExpr(a, bL), new VBarExpr(a, bR), true);
            }
            else if (a instanceof MultiplyExpr && b instanceof Expr) {
                var aL = a.lhs;
                var aR = a.rhs;
                if (aL instanceof ScalarExpr && aR instanceof BasisBladeExpr) {
                    return new MultiplyExpr(aL, new VBarExpr(aR, b), true);
                }
                else {
                    return new VBarExpr(a, b);
                }
            }
            else if (a instanceof BasisBladeExpr && b instanceof MultiplyExpr) {
                var bL = b.lhs;
                var bR = b.rhs;
                if (bL instanceof ScalarExpr && bR instanceof BasisBladeExpr) {
                    return new MultiplyExpr(bL, new VBarExpr(a, bR), true);
                }
                else {
                    return new VBarExpr(a, b);
                }
            }
            else {
                return new VBarExpr(a, b);
            }
        };
        VBarExpr.prototype.toPrefix = function () {
            return "scp(" + this.lhs.toPrefix() + ", " + this.rhs.toPrefix() + ")";
        };
        VBarExpr.prototype.toString = function () {
            return this.lhs + " | " + this.rhs;
        };
        return VBarExpr;
    }(BinaryExpr));
    exports.VBarExpr = VBarExpr;
    var WedgeExpr = (function (_super) {
        __extends(WedgeExpr, _super);
        function WedgeExpr(lhs, rhs, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, lhs, rhs, 'WedgeExpr');
            this.dirty = dirty;
        }
        WedgeExpr.prototype.isChanged = function () {
            return this.dirty || this.lhs.isChanged() || this.rhs.isChanged();
        };
        WedgeExpr.prototype.reset = function () {
            return new WedgeExpr(this.lhs.reset(), this.rhs.reset());
        };
        WedgeExpr.prototype.simplify = function () {
            var a = this.lhs.simplify();
            var b = this.rhs.simplify();
            if (a instanceof ScalarExpr) {
                if (b instanceof ScalarExpr) {
                    return new ScalarExpr(this.env, 0, true);
                }
                else if (typeof a.value === 'number' && a.value === 1) {
                    return b.copy(true);
                }
                else {
                    return new WedgeExpr(a, b);
                }
            }
            else if (b instanceof ScalarExpr) {
                if (a instanceof ScalarExpr) {
                    return new ScalarExpr(this.env, 0, true);
                }
                else if (typeof b.value === 'number' && b.value === 1) {
                    if (a instanceof BasisBladeExpr) {
                        return a.copy(true);
                    }
                    else {
                        return new WedgeExpr(a, b);
                    }
                }
                else {
                    return new WedgeExpr(a, b);
                }
            }
            else if (a instanceof BasisBladeExpr && b instanceof BasisBladeExpr) {
                var blade = wedgeBlades(a.vectors, b.vectors);
                if (Array.isArray(blade)) {
                    return new BasisBladeExpr(this.env, blade, true);
                }
                else {
                    return new ScalarExpr(this.env, 0, true);
                }
            }
            else if (a instanceof BasisBladeExpr && b instanceof BasisBladeExpr) {
                if (a === b) {
                    return new ScalarExpr(this.env, 0, true);
                }
                else {
                    return new AddExpr(new MultiplyExpr(a, b), new MultiplyExpr(new ScalarExpr(this.env, -1), new VBarExpr(a, b)), true);
                }
            }
            else {
                return new WedgeExpr(a, b);
            }
        };
        WedgeExpr.prototype.toPrefix = function () {
            return "ext(" + this.lhs + ", " + this.rhs + ")";
        };
        WedgeExpr.prototype.toString = function () {
            return this.lhs + " ^ " + this.rhs;
        };
        return WedgeExpr;
    }(BinaryExpr));
    exports.WedgeExpr = WedgeExpr;
    var ReverseExpr = (function (_super) {
        __extends(ReverseExpr, _super);
        function ReverseExpr(inner, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, inner.env, 'ReverseExpr');
            this.inner = inner;
            this.dirty = dirty;
        }
        ReverseExpr.prototype.isChanged = function () {
            return this.dirty || this.inner.isChanged();
        };
        ReverseExpr.prototype.copy = function (dirty) {
            return new ReverseExpr(this.inner, dirty);
        };
        ReverseExpr.prototype.reset = function () {
            return new ReverseExpr(this.inner.reset(), false);
        };
        ReverseExpr.prototype.simplify = function () {
            return new ReverseExpr(this.inner.simplify());
        };
        ReverseExpr.prototype.toPrefix = function () {
            return "reverse(" + this.inner + ")";
        };
        ReverseExpr.prototype.toString = function () {
            return "~" + this.inner;
        };
        return ReverseExpr;
    }(Expr));
    exports.ReverseExpr = ReverseExpr;
    var InverseExpr = (function (_super) {
        __extends(InverseExpr, _super);
        function InverseExpr(inner, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, inner.env, 'InverseExpr');
            this.inner = inner;
            this.dirty = dirty;
        }
        InverseExpr.prototype.isChanged = function () {
            return this.dirty || this.inner.isChanged();
        };
        InverseExpr.prototype.copy = function (dirty) {
            return new InverseExpr(this.inner, dirty);
        };
        InverseExpr.prototype.reset = function () {
            return new InverseExpr(this.inner.reset(), false);
        };
        InverseExpr.prototype.simplify = function () {
            return new InverseExpr(this.inner.simplify());
        };
        InverseExpr.prototype.toPrefix = function () {
            return "inverse(" + this.inner + ")";
        };
        InverseExpr.prototype.toString = function () {
            return "!" + this.inner;
        };
        return InverseExpr;
    }(Expr));
    exports.InverseExpr = InverseExpr;
    var NegExpr = (function (_super) {
        __extends(NegExpr, _super);
        function NegExpr(inner, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, inner.env, 'NegExpr');
            this.inner = inner;
            this.dirty = dirty;
        }
        NegExpr.prototype.isChanged = function () {
            return this.dirty || this.inner.isChanged();
        };
        NegExpr.prototype.copy = function (dirty) {
            return new NegExpr(this.inner, dirty);
        };
        NegExpr.prototype.reset = function () {
            return new NegExpr(this.inner.reset(), false);
        };
        NegExpr.prototype.simplify = function () {
            return new NegExpr(this.inner.simplify());
        };
        NegExpr.prototype.toPrefix = function () {
            return "neg(" + this.inner + ")";
        };
        NegExpr.prototype.toString = function () {
            return "-" + this.inner;
        };
        return NegExpr;
    }(Expr));
    exports.NegExpr = NegExpr;
    var PosExpr = (function (_super) {
        __extends(PosExpr, _super);
        function PosExpr(inner, dirty) {
            if (dirty === void 0) { dirty = false; }
            _super.call(this, inner.env, 'PosExpr');
            this.inner = inner;
            this.dirty = dirty;
        }
        PosExpr.prototype.isChanged = function () {
            return this.dirty || this.inner.isChanged();
        };
        PosExpr.prototype.copy = function (dirty) {
            return new PosExpr(this.inner, dirty);
        };
        PosExpr.prototype.reset = function () {
            return new PosExpr(this.inner.reset(), false);
        };
        PosExpr.prototype.simplify = function () {
            return new PosExpr(this.inner.simplify());
        };
        PosExpr.prototype.toPrefix = function () {
            return "pos(" + this.inner + ")";
        };
        PosExpr.prototype.toString = function () {
            return "+" + this.inner;
        };
        return PosExpr;
    }(Expr));
    exports.PosExpr = PosExpr;
    var Algebra = (function () {
        function Algebra(g, unused) {
            this.basis = [];
            this._bnames = [];
            this._metric = g;
            this.basis.push(new BasisBladeExpr(this, []));
            this._bnames[0] = '1';
            for (var i = 0; i < this._metric.length; i++) {
                var vector = new BasisBladeExpr(this, [i]);
                var bLength = this.basis.length;
                for (var j = 0; j < bLength; j++) {
                    var existing = this.basis[j];
                    var extended = new WedgeExpr(existing, vector);
                    var blade = this.simplify(extended);
                    if (blade instanceof BasisBladeExpr) {
                        this.basis.push(blade);
                    }
                    else {
                        throw new Error(extended + " must simplify to a BasisBladeExpr");
                    }
                }
            }
        }
        Algebra.prototype.bladeName = function (vectors) {
            var _this = this;
            if (vectors.length > 0) {
                return vectors.map(function (i) {
                    if (_this._bnames) {
                        var basisIndex = Math.pow(2, i);
                        if (_this._bnames[basisIndex]) {
                            return _this._bnames[basisIndex];
                        }
                    }
                    return "e" + (i + 1);
                }).join(' ^ ');
            }
            else {
                return this._bnames[0];
            }
        };
        Algebra.prototype.g = function (u, v) {
            var i = u.vectors[0];
            var j = v.vectors[0];
            return new ScalarExpr(this, this._metric[i][j]);
        };
        Algebra.prototype.scalar = function (value) {
            return new ScalarExpr(this, value);
        };
        Algebra.prototype.simplify = function (expr) {
            var count = 0;
            if (expr instanceof Expr) {
                expr = expr.reset();
                expr = expr.simplify();
                while (expr.isChanged()) {
                    expr = expr.reset();
                    count++;
                    if (count < 100) {
                        expr = expr.simplify();
                    }
                }
                return expr;
            }
            else {
                throw new Error("expr must be an Expr");
            }
        };
        return Algebra;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Algebra;
});

define('geocas/config',["require", "exports"], function (require, exports) {
    "use strict";
    var GeoCAS = (function () {
        function GeoCAS() {
            this.GITHUB = 'https://github.com/geometryzen/GeoCAS';
            this.LAST_MODIFIED = '2016-07-20';
            this.NAMESPACE = 'GeoCAS';
            this.VERSION = '1.0.0';
        }
        GeoCAS.prototype.log = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.log(message);
        };
        GeoCAS.prototype.info = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.info(message);
        };
        GeoCAS.prototype.warn = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.warn(message);
        };
        GeoCAS.prototype.error = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.error(message);
        };
        return GeoCAS;
    }());
    var config = new GeoCAS();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});

define('geocas',["require", "exports", './geocas/math/Algebra', './geocas/config'], function (require, exports, Algebra_1, config_1) {
    "use strict";
    var GeoCAS = {
        get LAST_MODIFIED() { return config_1.default.LAST_MODIFIED; },
        get VERSION() { return config_1.default.VERSION; },
        get Algebra() { return Algebra_1.default; },
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GeoCAS;
});

  var library = require('geocas').default;
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['GeoCAS'] = library;
  }
}(this));
