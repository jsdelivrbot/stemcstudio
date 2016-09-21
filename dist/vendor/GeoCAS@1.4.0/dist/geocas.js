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
            if (!(a instanceof ScalarExpr) && b instanceof ScalarExpr) {
                return new MultiplyExpr(b, a, true);
            }
            else if (a instanceof MultiplyExpr) {
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
            else if (a instanceof ScalarExpr) {
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('geocas/math/BigInteger',["require", "exports"], function (require, exports) {
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
        return void 0;
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

define('geocas/math/BigRational',["require", "exports", './BigInteger', './BigInteger'], function (require, exports, BigInteger_1, BigInteger_2) {
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

define('geocas/mother/bitCount',["require", "exports"], function (require, exports) {
    "use strict";
    function bitCount(i) {
        i = i - ((i >> 1) & 0x55555555);
        i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
        i = (i + (i >> 4)) & 0x0F0F0F0F;
        i = i + (i >> 8);
        i = i + (i >> 16);
        return i & 0x0000003F;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = bitCount;
});

define('geocas/mother/canonicalReorderingSign',["require", "exports", './bitCount'], function (require, exports, bitCount_1) {
    "use strict";
    function canonicalReorderingSign(a, b) {
        a >>= 1;
        var sum = 0;
        while (a !== 0) {
            sum += bitCount_1.default(a & b);
            a >>= 1;
        }
        return ((sum & 1) === 0) ? 1 : -1;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = canonicalReorderingSign;
});

define('geocas/checks/isUndefined',["require", "exports"], function (require, exports) {
    "use strict";
    function isUndefined(arg) {
        return (typeof arg === 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isUndefined;
});

define('geocas/mother/minusOnePow',["require", "exports"], function (require, exports) {
    "use strict";
    function minusOnePow(i) {
        return ((i & 1) === 0) ? 1 : -1;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = minusOnePow;
});

define('geocas/mother/Blade',["require", "exports", './bitCount', './canonicalReorderingSign', '../checks/isUndefined', './minusOnePow'], function (require, exports, bitCount_1, canonicalReorderingSign_1, isUndefined_1, minusOnePow_1) {
    "use strict";
    var SCALAR = 0;
    function blade(b, weight, adapter) {
        var that = {
            get bitmap() {
                return b;
            },
            get weight() {
                return weight;
            },
            __neg__: function () {
                return blade(b, adapter.neg(weight), adapter);
            },
            __vbar__: function (rhs, m) {
                if (b !== rhs.bitmap) {
                    return blade(SCALAR, adapter.zero(), adapter);
                }
                else {
                    return blade(SCALAR, adapter.mul(weight, rhs.weight), adapter);
                }
            },
            __wedge__: function (rhs) {
                if (b & rhs.bitmap) {
                    return blade(SCALAR, adapter.zero(), adapter);
                }
                else {
                    var bitmap = b ^ rhs.bitmap;
                    var sign = canonicalReorderingSign_1.default(b, rhs.bitmap);
                    var newScale = adapter.mul(weight, rhs.weight);
                    return blade(bitmap, sign > 0 ? newScale : adapter.neg(newScale), adapter);
                }
            },
            grade: function () {
                return bitCount_1.default(b);
            },
            reverse: function () {
                var x = that.grade();
                var sign = minusOnePow_1.default(x * (x - 1) / 2);
                return blade(b, sign > 0 ? weight : adapter.neg(weight), adapter);
            },
            gradeInversion: function () {
                var x = that.grade();
                var sign = minusOnePow_1.default(x);
                return blade(b, sign > 0 ? weight : adapter.neg(weight), adapter);
            },
            cliffordConjugate: function () {
                var x = that.grade();
                var sign = minusOnePow_1.default(x * (x + 1) / 2);
                return blade(b, sign > 0 ? weight : adapter.neg(weight), adapter);
            },
            zero: function () {
                return blade(SCALAR, adapter.zero(), adapter);
            },
            asString: function (names) {
                var bladePart = "";
                var i = 1;
                var x = b;
                while (x !== 0) {
                    if ((x & 1) !== 0) {
                        if (bladePart.length > 0)
                            bladePart += " ^ ";
                        if (isUndefined_1.default(names) || (names === null) || (i > names.length) || (names[i - 1] == null)) {
                            bladePart = bladePart + "e" + i;
                        }
                        else {
                            bladePart = bladePart + names[i - 1];
                        }
                    }
                    x >>= 1;
                    i++;
                }
                if (bladePart.length === 0) {
                    return adapter.asString(weight);
                }
                else {
                    if (adapter.isOne(weight)) {
                        return bladePart;
                    }
                    else {
                        return adapter.asString(weight) + " * " + bladePart;
                    }
                }
            },
            toString: function () {
                return that.asString(void 0);
            }
        };
        return that;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = blade;
});

define('geocas/mother/gpE',["require", "exports", './Blade', './canonicalReorderingSign'], function (require, exports, Blade_1, canonicalReorderingSign_1) {
    "use strict";
    function gpE(a, b, adapter) {
        var bitmap = a.bitmap ^ b.bitmap;
        var sign = canonicalReorderingSign_1.default(a.bitmap, b.bitmap);
        var scale = adapter.mul(a.weight, b.weight);
        if (sign > 0) {
            return Blade_1.default(bitmap, scale, adapter);
        }
        else {
            return Blade_1.default(bitmap, adapter.neg(scale), adapter);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gpE;
});

define('geocas/mother/gpL',["require", "exports", './Blade', './gpE'], function (require, exports, Blade_1, gpE_1) {
    "use strict";
    function gpL(a, b, m, adapter) {
        var temp = gpE_1.default(a, b, adapter);
        var weight = temp.weight;
        var bitmap = a.bitmap & b.bitmap;
        var i = 0;
        while (bitmap !== 0) {
            if ((bitmap & 1) !== 0) {
                weight = adapter.scale(weight, m[i]);
            }
            i++;
            bitmap = bitmap >> 1;
        }
        return Blade_1.default(temp.bitmap, weight, adapter);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gpL;
});

define('geocas/mother/bladesToArray',["require", "exports"], function (require, exports) {
    "use strict";
    function bladesToArray(map) {
        var bitmaps = Object.keys(map);
        var rez = [];
        for (var i = 0; i < bitmaps.length; i++) {
            var bitmap = bitmaps[i];
            var blade = map[bitmap];
            rez.push(blade);
        }
        return rez;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = bladesToArray;
});

define('geocas/mother/simplify',["require", "exports", './Blade', './bladesToArray'], function (require, exports, Blade_1, bladesToArray_1) {
    "use strict";
    function simplify(blades, adapter) {
        var map = {};
        for (var i = 0; i < blades.length; i++) {
            var B = blades[i];
            var existing = map[B.bitmap];
            if (existing) {
                var scale = adapter.add(existing.weight, B.weight);
                if (adapter.isZero(scale)) {
                    delete map[B.bitmap];
                }
                else {
                    map[B.bitmap] = Blade_1.default(B.bitmap, scale, adapter);
                }
            }
            else {
                if (!adapter.isZero(B.weight)) {
                    map[B.bitmap] = B;
                }
            }
        }
        return bladesToArray_1.default(map);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = simplify;
});

define('geocas/mother/gpG',["require", "exports", './gpL', './simplify'], function (require, exports, gpL_1, simplify_1) {
    "use strict";
    function gpG(a, b, m, adapter) {
        var A = m.toEigenBasis(a);
        var B = m.toEigenBasis(b);
        var M = m.getEigenMetric();
        var rez = [];
        for (var i = 0; i < A.length; i++) {
            for (var k = 0; k < B.length; k++) {
                rez.push(gpL_1.default(A[i], B[k], M, adapter));
            }
        }
        return m.toMetricBasis(simplify_1.default(rez, adapter));
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = gpG;
});

define('geocas/mother/grade',["require", "exports", './bitCount'], function (require, exports, bitCount_1) {
    "use strict";
    function grade(bitmap) {
        return bitCount_1.default(bitmap);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = grade;
});

define('geocas/mother/lcoE',["require", "exports", './gpE', './grade'], function (require, exports, gpE_1, grade_1) {
    "use strict";
    function lcoE(a, b, adapter) {
        var ga = a.grade();
        var gb = b.grade();
        if (ga > gb) {
            return a.zero();
        }
        else {
            var bitmap = a.bitmap ^ b.bitmap;
            var g = grade_1.default(bitmap);
            if (g !== (gb - ga)) {
                return a.zero();
            }
            else {
                return gpE_1.default(a, b, adapter);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = lcoE;
});

define('geocas/mother/lcoL',["require", "exports", './gpL', './grade'], function (require, exports, gpL_1, grade_1) {
    "use strict";
    function lcoL(a, b, m, adapter) {
        var ga = a.grade();
        var gb = b.grade();
        if (ga > gb) {
            return a.zero();
        }
        else {
            var bitmap = a.bitmap ^ b.bitmap;
            var g = grade_1.default(bitmap);
            if (g !== (gb - ga)) {
                return a.zero();
            }
            else {
                return gpL_1.default(a, b, m, adapter);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = lcoL;
});

define('geocas/mother/lcoG',["require", "exports", './gpG', './grade'], function (require, exports, gpG_1, grade_1) {
    "use strict";
    function lcoG(a, b, m, adapter) {
        var ga = a.grade();
        var gb = b.grade();
        if (ga > gb) {
            return [];
        }
        else {
            var bitmap = a.bitmap ^ b.bitmap;
            var g = grade_1.default(bitmap);
            if (g !== (gb - ga)) {
                return [];
            }
            else {
                return gpG_1.default(a, b, m, adapter);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = lcoG;
});

define('geocas/mother/rcoE',["require", "exports", './gpE', './grade'], function (require, exports, gpE_1, grade_1) {
    "use strict";
    function rcoE(a, b, adapter) {
        var ga = a.grade();
        var gb = b.grade();
        if (ga < gb) {
            return a.zero();
        }
        else {
            var bitmap = a.bitmap ^ b.bitmap;
            var g = grade_1.default(bitmap);
            if (g !== (ga - gb)) {
                return a.zero();
            }
            else {
                return gpE_1.default(a, b, adapter);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rcoE;
});

define('geocas/mother/rcoL',["require", "exports", './gpL', './grade'], function (require, exports, gpL_1, grade_1) {
    "use strict";
    function rcoL(a, b, m, adapter) {
        var ga = a.grade();
        var gb = b.grade();
        if (ga < gb) {
            return a.zero();
        }
        else {
            var bitmap = a.bitmap ^ b.bitmap;
            var g = grade_1.default(bitmap);
            if (g !== (ga - gb)) {
                return a.zero();
            }
            else {
                return gpL_1.default(a, b, m, adapter);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rcoL;
});

define('geocas/mother/rcoG',["require", "exports", './gpG', './grade'], function (require, exports, gpG_1, grade_1) {
    "use strict";
    function rcoG(a, b, m, adapter) {
        var ga = a.grade();
        var gb = b.grade();
        if (ga < gb) {
            return [];
        }
        else {
            var bitmap = a.bitmap ^ b.bitmap;
            var g = grade_1.default(bitmap);
            if (g !== (ga - gb)) {
                return [];
            }
            else {
                return gpG_1.default(a, b, m, adapter);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rcoG;
});

define('geocas/checks/isArray',["require", "exports"], function (require, exports) {
    "use strict";
    function isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isArray;
});

define('geocas/checks/isNumber',["require", "exports"], function (require, exports) {
    "use strict";
    function isNumber(x) {
        return (typeof x === 'number');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isNumber;
});

define('geocas/checks/mustSatisfy',["require", "exports"], function (require, exports) {
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

define('geocas/checks/isDefined',["require", "exports"], function (require, exports) {
    "use strict";
    function isDefined(arg) {
        return (typeof arg !== 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isDefined;
});

define('geocas/checks/mustBeDefined',["require", "exports", '../checks/mustSatisfy', '../checks/isDefined'], function (require, exports, mustSatisfy_1, isDefined_1) {
    "use strict";
    function beDefined() {
        return "not be 'undefined'";
    }
    function mustBeDefined(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isDefined_1.default(value), beDefined, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeDefined;
});

define('geocas/checks/isInteger',["require", "exports", '../checks/isNumber'], function (require, exports, isNumber_1) {
    "use strict";
    function isInteger(x) {
        return isNumber_1.default(x) && x % 1 === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isInteger;
});

define('geocas/checks/mustBeInteger',["require", "exports", '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, mustSatisfy_1, isInteger_1) {
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

define('geocas/mother/Multivector',["require", "exports", './Blade', './gpE', './gpL', './gpG', './lcoE', './lcoL', './lcoG', './rcoE', './rcoL', './rcoG', '../checks/isArray', '../checks/isNumber', '../checks/isUndefined', '../checks/mustBeDefined', '../checks/mustBeInteger', '../checks/mustSatisfy', './simplify'], function (require, exports, Blade_1, gpE_1, gpL_1, gpG_1, lcoE_1, lcoL_1, lcoG_1, rcoE_1, rcoL_1, rcoG_1, isArray_1, isNumber_1, isUndefined_1, mustBeDefined_1, mustBeInteger_1, mustSatisfy_1, simplify_1) {
    "use strict";
    function isMultivector(arg) {
        if (arg) {
            return typeof arg['extractGrade'] === 'function';
        }
        else {
            return false;
        }
    }
    function mul(lhs, rhs, metric, adapter) {
        if (adapter.isField(lhs) && isMultivector(rhs)) {
            return rhs.mulByScalar(lhs);
        }
        else if (isMultivector(lhs) && adapter.isField(rhs)) {
            return lhs.mulByScalar(rhs);
        }
        else {
            if (isMultivector(lhs) && isMultivector(rhs)) {
                var rez = [];
                for (var i = 0; i < lhs.blades.length; i++) {
                    var B1 = lhs.blades[i];
                    for (var k = 0; k < rhs.blades.length; k++) {
                        var B2 = rhs.blades[k];
                        if (isNumber_1.default(metric)) {
                            var B = gpE_1.default(B1, B2, adapter);
                            rez.push(B);
                        }
                        else if (isArray_1.default(metric)) {
                            var B = gpL_1.default(B1, B2, metric, adapter);
                            rez.push(B);
                        }
                        else {
                            var B = gpG_1.default(B1, B2, metric, adapter);
                            for (var b = 0; b < B.length; b++) {
                                rez.push(B[b]);
                            }
                        }
                    }
                }
                return mv(simplify_1.default(rez, adapter), metric, adapter);
            }
            else {
                return void 0;
            }
        }
    }
    function div(lhs, rhs, metric, adapter) {
        if (adapter.isField(lhs) && isMultivector(rhs)) {
            throw new Error("Multivector division is not yet supported.");
        }
        else if (isMultivector(lhs) && adapter.isField(rhs)) {
            return lhs.divByScalar(rhs);
        }
        else {
            if (isMultivector(lhs) && isMultivector(rhs)) {
                throw new Error("Multivector division is not yet supported.");
            }
            else {
                return void 0;
            }
        }
    }
    function getBasisVector(index, metric, adapter) {
        mustBeInteger_1.default('index', index);
        mustBeDefined_1.default('metric', metric);
        mustBeDefined_1.default('adapter', adapter);
        var B = Blade_1.default(1 << index, adapter.one(), adapter);
        return mv([B], metric, adapter);
    }
    exports.getBasisVector = getBasisVector;
    function getScalar(weight, metric, adapter) {
        mustBeDefined_1.default('metric', metric);
        mustBeDefined_1.default('adapter', adapter);
        mustSatisfy_1.default('weight', adapter.isField(weight), function () { return "be a field value"; });
        var B = Blade_1.default(0, weight, adapter);
        return mv([B], metric, adapter);
    }
    exports.getScalar = getScalar;
    function mv(blades, metric, adapter) {
        if (!isArray_1.default(blades)) {
            throw new Error("blades must be Blade<T>[]");
        }
        if (isUndefined_1.default(metric)) {
            throw new Error("metric must be defined");
        }
        if (isUndefined_1.default(adapter)) {
            throw new Error("adapter must be defined");
        }
        var extractGrade = function (grade) {
            var rez = [];
            for (var i = 0; i < blades.length; i++) {
                var B = blades[i];
                if (B.grade() === grade) {
                    rez.push(B);
                }
            }
            return mv(rez, metric, adapter);
        };
        var that = {
            get blades() {
                return blades;
            },
            __add__: function (rhs) {
                var rez = [];
                for (var i = 0; i < blades.length; i++) {
                    rez.push(blades[i]);
                }
                for (var k = 0; k < rhs.blades.length; k++) {
                    rez.push(rhs.blades[k]);
                }
                return mv(simplify_1.default(rez, adapter), metric, adapter);
            },
            __sub__: function (rhs) {
                var rez = [];
                for (var i = 0; i < blades.length; i++) {
                    rez.push(blades[i]);
                }
                for (var k = 0; k < rhs.blades.length; k++) {
                    rez.push(rhs.blades[k].__neg__());
                }
                return mv(simplify_1.default(rez, adapter), metric, adapter);
            },
            inv: function () {
                var reverse = that.rev();
                var denom = that.mul(reverse);
                if (denom.blades.length === 1 && denom.blades[0].bitmap === 0) {
                    return reverse.divByScalar(denom.scalarCoordinate());
                }
                else {
                    throw new Error("non-invertible multivector (versor inverse)");
                }
            },
            mul: function (rhs) {
                return mul(that, rhs, metric, adapter);
            },
            mulByScalar: function (α) {
                var rez = [];
                for (var i = 0; i < blades.length; i++) {
                    var B = blades[i];
                    var scale = adapter.mul(B.weight, α);
                    if (!adapter.isZero(scale)) {
                        rez.push(Blade_1.default(B.bitmap, scale, adapter));
                    }
                }
                return mv(rez, metric, adapter);
            },
            __mul__: function (rhs) {
                return mul(that, rhs, metric, adapter);
            },
            __rmul__: function (lhs) {
                return mul(lhs, that, metric, adapter);
            },
            __div__: function (rhs) {
                return div(that, rhs, metric, adapter);
            },
            __lshift__: function (rhs) {
                var rez = [];
                for (var i = 0; i < blades.length; i++) {
                    var B1 = blades[i];
                    for (var k = 0; k < rhs.blades.length; k++) {
                        var B2 = rhs.blades[k];
                        if (isNumber_1.default(metric)) {
                            var B = lcoE_1.default(B1, B2, adapter);
                            rez.push(B);
                        }
                        else if (isArray_1.default(metric)) {
                            var B = lcoL_1.default(B1, B2, metric, adapter);
                            rez.push(B);
                        }
                        else {
                            var B = lcoG_1.default(B1, B2, metric, adapter);
                            for (var b = 0; b < B.length; b++) {
                                rez.push(B[b]);
                            }
                        }
                    }
                }
                return mv(simplify_1.default(rez, adapter), metric, adapter);
            },
            __rshift__: function (rhs) {
                var rez = [];
                for (var i = 0; i < blades.length; i++) {
                    var B1 = blades[i];
                    for (var k = 0; k < rhs.blades.length; k++) {
                        var B2 = rhs.blades[k];
                        if (isNumber_1.default(metric)) {
                            var B = rcoE_1.default(B1, B2, adapter);
                            rez.push(B);
                        }
                        else if (isArray_1.default(metric)) {
                            var B = rcoL_1.default(B1, B2, metric, adapter);
                            rez.push(B);
                        }
                        else {
                            var B = rcoG_1.default(B1, B2, metric, adapter);
                            for (var b = 0; b < B.length; b++) {
                                rez.push(B[b]);
                            }
                        }
                    }
                }
                return mv(simplify_1.default(rez, adapter), metric, adapter);
            },
            __vbar__: function (rhs) {
                return that.__mul__(rhs).extractGrade(0);
            },
            __wedge__: function (rhs) {
                var rez = [];
                for (var i = 0; i < blades.length; i++) {
                    var B1 = blades[i];
                    for (var k = 0; k < rhs.blades.length; k++) {
                        var B2 = rhs.blades[k];
                        var B = B1.__wedge__(B2);
                        rez.push(B);
                    }
                }
                return mv(simplify_1.default(rez, adapter), metric, adapter);
            },
            __pos__: function () {
                return that;
            },
            __neg__: function () {
                var rez = [];
                for (var i = 0; i < blades.length; i++) {
                    var B = blades[i];
                    rez.push(B.__neg__());
                }
                return mv(rez, metric, adapter);
            },
            exp: function () {
                var B = extractGrade(2);
                var Brev = B.rev();
                var θ = adapter.sqrt(B.__vbar__(Brev).scalarCoordinate());
                var i = B.divByScalar(θ);
                var cosθ = mv([Blade_1.default(0, adapter.cos(θ), adapter)], metric, adapter);
                var sinθ = mv([Blade_1.default(0, adapter.sin(θ), adapter)], metric, adapter);
                return cosθ.__add__(i.__mul__(sinθ));
            },
            extractGrade: extractGrade,
            div: function (rhs) {
                return that.mul(rhs.inv());
            },
            divByScalar: function (α) {
                var rez = [];
                for (var i = 0; i < blades.length; i++) {
                    var B = blades[i];
                    var scale = adapter.div(B.weight, α);
                    if (!adapter.isZero(scale)) {
                        rez.push(Blade_1.default(B.bitmap, scale, adapter));
                    }
                }
                return mv(rez, metric, adapter);
            },
            dual: function () {
                if (isUndefined_1.default(metric)) {
                    throw new Error("metric must be number | number[] | Metric<T>");
                }
                else if (isNumber_1.default(metric)) {
                    return that;
                }
                else {
                    throw new Error("metric must be number | number[] | Metric<T>");
                }
            },
            rev: function () {
                var rez = [];
                for (var i = 0; i < blades.length; i++) {
                    var B = blades[i];
                    rez.push(B.reverse());
                }
                return mv(rez, metric, adapter);
            },
            scalarCoordinate: function () {
                for (var i = 0; i < blades.length; i++) {
                    var B = blades[i];
                    if (B.bitmap === 0) {
                        return B.weight;
                    }
                }
                return adapter.zero();
            },
            scp: function (rhs) {
                return that.__vbar__(rhs).scalarCoordinate();
            },
            asString: function (names) {
                if (blades.length === 0) {
                    return "0";
                }
                else {
                    var result = "";
                    for (var i = 0; i < blades.length; i++) {
                        var B = blades[i];
                        var s = B.asString(names);
                        if (i === 0) {
                            result += s;
                        }
                        else {
                            if (s.charAt(0) === '-') {
                                result += ' - ';
                                result += s.substring(1);
                            }
                            else {
                                result += ' + ';
                                result += s;
                            }
                        }
                    }
                    return result;
                }
            },
            toString: function () {
                return that.asString(void 0);
            }
        };
        return that;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mv;
});

define('geocas/mother/NumberFieldAdapter',["require", "exports"], function (require, exports) {
    "use strict";
    var NumberFieldAdapter = (function () {
        function NumberFieldAdapter() {
        }
        NumberFieldAdapter.prototype.abs = function (arg) {
            return Math.abs(arg);
        };
        NumberFieldAdapter.prototype.add = function (lhs, rhs) {
            return lhs + rhs;
        };
        NumberFieldAdapter.prototype.sub = function (lhs, rhs) {
            return lhs - rhs;
        };
        NumberFieldAdapter.prototype.mul = function (lhs, rhs) {
            return lhs * rhs;
        };
        NumberFieldAdapter.prototype.div = function (lhs, rhs) {
            return lhs / rhs;
        };
        NumberFieldAdapter.prototype.neg = function (arg) {
            return -arg;
        };
        NumberFieldAdapter.prototype.asString = function (arg) {
            return arg.toString();
        };
        NumberFieldAdapter.prototype.cos = function (arg) {
            return Math.cos(arg);
        };
        NumberFieldAdapter.prototype.isField = function (arg) {
            return typeof arg === 'number';
        };
        NumberFieldAdapter.prototype.isOne = function (arg) {
            return arg === 1;
        };
        NumberFieldAdapter.prototype.isZero = function (arg) {
            return arg === 0;
        };
        NumberFieldAdapter.prototype.one = function () {
            return 1;
        };
        NumberFieldAdapter.prototype.scale = function (arg, alpha) {
            return arg * alpha;
        };
        NumberFieldAdapter.prototype.sin = function (arg) {
            return Math.sin(arg);
        };
        NumberFieldAdapter.prototype.sqrt = function (arg) {
            return Math.sqrt(arg);
        };
        NumberFieldAdapter.prototype.zero = function () {
            return 0;
        };
        return NumberFieldAdapter;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NumberFieldAdapter;
});

define('geocas/config',["require", "exports"], function (require, exports) {
    "use strict";
    var GeoCAS = (function () {
        function GeoCAS() {
            this.GITHUB = 'https://github.com/geometryzen/GeoCAS';
            this.LAST_MODIFIED = '2016-09-21';
            this.NAMESPACE = 'GeoCAS';
            this.VERSION = '1.4.0';
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

define('geocas',["require", "exports", './geocas/math/Algebra', './geocas/math/BigInteger', './geocas/math/BigRational', './geocas/mother/Blade', './geocas/mother/Multivector', './geocas/mother/NumberFieldAdapter', './geocas/mother/Multivector', './geocas/config'], function (require, exports, Algebra_1, BigInteger_1, BigRational_1, Blade_1, Multivector_1, NumberFieldAdapter_1, Multivector_2, config_1) {
    "use strict";
    var GeoCAS = {
        get LAST_MODIFIED() { return config_1.default.LAST_MODIFIED; },
        get VERSION() { return config_1.default.VERSION; },
        get Algebra() { return Algebra_1.default; },
        get bigInt() { return BigInteger_1.default; },
        get bigRat() { return BigRational_1.default; },
        get blade() { return Blade_1.default; },
        get mv() { return Multivector_1.default; },
        get NumberFieldAdapter() { return NumberFieldAdapter_1.default; },
        get getScalar() { return Multivector_2.getScalar; },
        get getBasisVector() { return Multivector_2.getBasisVector; }
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
