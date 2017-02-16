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

define('davinci-newton/solvers/AdaptiveStepSolver',["require", "exports"], function (require, exports) {
    "use strict";
    var AdaptiveStepSolver = (function () {
        function AdaptiveStepSolver(diffEq, energySystem, diffEqSolver) {
            this.stepUBound = 1;
            this.stepLBound = 1E-5;
            this.diffEq_ = diffEq;
            this.energySystem_ = energySystem;
            this.odeSolver_ = diffEqSolver;
            this.totSteps_ = 0;
            this.secondDiff_ = true;
            this.tolerance_ = 1E-6;
        }
        AdaptiveStepSolver.prototype.step = function (stepSize, uomStep) {
            this.savedState = this.diffEq_.getState();
            var startTime = this.diffEq_.time;
            var d_t = stepSize;
            var steps = 0;
            this.diffEq_.epilog();
            var startEnergy = this.energySystem_.totalEnergy().a;
            var lastEnergyDiff = Number.POSITIVE_INFINITY;
            var value = Number.POSITIVE_INFINITY;
            var firstTime = true;
            if (stepSize < this.stepLBound) {
                return;
            }
            do {
                var t = startTime;
                if (!firstTime) {
                    this.diffEq_.setState(this.savedState);
                    this.diffEq_.epilog();
                    d_t = d_t / 5;
                    if (d_t < this.stepLBound) {
                        throw new Error("time step " + d_t + " too small. startEnergy => " + startEnergy + " lastEnergyDiff => " + lastEnergyDiff);
                    }
                }
                steps = 0;
                while (t < startTime + stepSize) {
                    var h = d_t;
                    if (t + h > startTime + stepSize - 1E-10) {
                        h = startTime + stepSize - t;
                    }
                    steps++;
                    this.odeSolver_.step(h, uomStep);
                    this.diffEq_.epilog();
                    t += h;
                }
                var finishEnergy = this.energySystem_.totalEnergy().a;
                var energyDiff = Math.abs(startEnergy - finishEnergy);
                if (this.secondDiff_) {
                    if (!firstTime) {
                        value = Math.abs(energyDiff - lastEnergyDiff);
                    }
                }
                else {
                    value = energyDiff;
                }
                lastEnergyDiff = energyDiff;
                firstTime = false;
            } while (value > this.tolerance_);
            this.totSteps_ += steps;
        };
        Object.defineProperty(AdaptiveStepSolver.prototype, "secondDiff", {
            get: function () {
                return this.secondDiff_;
            },
            set: function (value) {
                this.secondDiff_ = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AdaptiveStepSolver.prototype, "tolerance", {
            get: function () {
                return this.tolerance_;
            },
            set: function (value) {
                this.tolerance_ = value;
            },
            enumerable: true,
            configurable: true
        });
        return AdaptiveStepSolver;
    }());
    exports.AdaptiveStepSolver = AdaptiveStepSolver;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AdaptiveStepSolver;
});

define('davinci-newton/view/AlignH',["require", "exports"], function (require, exports) {
    "use strict";
    var AlignH;
    (function (AlignH) {
        AlignH[AlignH["LEFT"] = 0] = "LEFT";
        AlignH[AlignH["MIDDLE"] = 1] = "MIDDLE";
        AlignH[AlignH["RIGHT"] = 2] = "RIGHT";
        AlignH[AlignH["FULL"] = 3] = "FULL";
    })(AlignH = exports.AlignH || (exports.AlignH = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AlignH;
});

define('davinci-newton/view/AlignV',["require", "exports"], function (require, exports) {
    "use strict";
    var AlignV;
    (function (AlignV) {
        AlignV[AlignV["TOP"] = 0] = "TOP";
        AlignV[AlignV["MIDDLE"] = 1] = "MIDDLE";
        AlignV[AlignV["BOTTOM"] = 2] = "BOTTOM";
        AlignV[AlignV["FULL"] = 3] = "FULL";
    })(AlignV = exports.AlignV || (exports.AlignV = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AlignV;
});

define('davinci-newton/graph/AxisChoice',["require", "exports"], function (require, exports) {
    "use strict";
    var AxisChoice;
    (function (AxisChoice) {
        AxisChoice[AxisChoice["HORIZONTAL"] = 1] = "HORIZONTAL";
        AxisChoice[AxisChoice["VERTICAL"] = 2] = "VERTICAL";
        AxisChoice[AxisChoice["BOTH"] = 3] = "BOTH";
    })(AxisChoice = exports.AxisChoice || (exports.AxisChoice = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AxisChoice;
});

define('davinci-newton/math/approx',["require", "exports"], function (require, exports) {
    "use strict";
    function approx(coords, n) {
        var max = 0;
        var iLen = coords.length;
        for (var i = 0; i < iLen; i++) {
            max = Math.max(max, Math.abs(coords[i]));
        }
        var threshold = max * Math.pow(10, -n);
        for (var i = 0; i < iLen; i++) {
            if (Math.abs(coords[i]) < threshold) {
                coords[i] = 0;
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = approx;
});

define('davinci-newton/checks/isDefined',["require", "exports"], function (require, exports) {
    "use strict";
    function isDefined(arg) {
        return (typeof arg !== 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isDefined;
});

define('davinci-newton/checks/isNull',["require", "exports"], function (require, exports) {
    "use strict";
    function default_1(x) {
        return x === null;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-newton/checks/isUndefined',["require", "exports"], function (require, exports) {
    "use strict";
    function isUndefined(arg) {
        return (typeof arg === 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isUndefined;
});

define('davinci-newton/math/arraysEQ',["require", "exports", "../checks/isDefined", "../checks/isNull", "../checks/isUndefined"], function (require, exports, isDefined_1, isNull_1, isUndefined_1) {
    "use strict";
    function default_1(a, b) {
        if (isDefined_1.default(a)) {
            if (isDefined_1.default(b)) {
                if (!isNull_1.default(a)) {
                    if (!isNull_1.default(b)) {
                        var aLen = a.length;
                        var bLen = b.length;
                        if (aLen === bLen) {
                            for (var i = 0; i < aLen; i++) {
                                if (a[i] !== b[i]) {
                                    return false;
                                }
                            }
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return isNull_1.default(b);
                }
            }
            else {
                return false;
            }
        }
        else {
            return isUndefined_1.default(b);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-newton/math/dotVectorE3',["require", "exports"], function (require, exports) {
    "use strict";
    function dotVectorE3(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = dotVectorE3;
});

define('davinci-newton/math/compG3Get',["require", "exports"], function (require, exports) {
    "use strict";
    var COORD_W = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_XYZ = 7;
    function compG3Get(m, index) {
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
    exports.default = compG3Get;
});

define('davinci-newton/math/extE3',["require", "exports"], function (require, exports) {
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

define('davinci-newton/math/compG3Set',["require", "exports"], function (require, exports) {
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
            case COORD_W: {
                m.a = value;
                break;
            }
            case COORD_X: {
                m.x = value;
                break;
            }
            case COORD_Y: {
                m.y = value;
                break;
            }
            case COORD_Z: {
                m.z = value;
                break;
            }
            case COORD_XY: {
                m.xy = value;
                break;
            }
            case COORD_YZ: {
                m.yz = value;
                break;
            }
            case COORD_ZX: {
                m.zx = value;
                break;
            }
            case COORD_XYZ: {
                m.b = value;
                break;
            }
            default:
                throw new Error("index => " + index);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = compG3Set;
});

define('davinci-newton/math/DimensionsSummary',["require", "exports"], function (require, exports) {
    "use strict";
    var DimensionsSummary;
    (function (DimensionsSummary) {
        DimensionsSummary[DimensionsSummary["Unknown"] = -1] = "Unknown";
        DimensionsSummary[DimensionsSummary["INV_MOMENT_OF_INERTIA"] = 0] = "INV_MOMENT_OF_INERTIA";
        DimensionsSummary[DimensionsSummary["INV_MASS"] = 1] = "INV_MASS";
        DimensionsSummary[DimensionsSummary["INV_TIME"] = 2] = "INV_TIME";
        DimensionsSummary[DimensionsSummary["ONE"] = 3] = "ONE";
        DimensionsSummary[DimensionsSummary["TIME_SQUARED"] = 4] = "TIME_SQUARED";
        DimensionsSummary[DimensionsSummary["LENGTH"] = 5] = "LENGTH";
        DimensionsSummary[DimensionsSummary["RATE_OF_CHANGE_OF_AREA"] = 6] = "RATE_OF_CHANGE_OF_AREA";
        DimensionsSummary[DimensionsSummary["AREA"] = 7] = "AREA";
        DimensionsSummary[DimensionsSummary["STIFFNESS"] = 8] = "STIFFNESS";
        DimensionsSummary[DimensionsSummary["FORCE"] = 9] = "FORCE";
        DimensionsSummary[DimensionsSummary["MOMENTUM"] = 10] = "MOMENTUM";
        DimensionsSummary[DimensionsSummary["ENERGY_OR_TORQUE"] = 11] = "ENERGY_OR_TORQUE";
        DimensionsSummary[DimensionsSummary["ANGULAR_MOMENTUM"] = 12] = "ANGULAR_MOMENTUM";
        DimensionsSummary[DimensionsSummary["MOMENT_OF_INERTIA"] = 13] = "MOMENT_OF_INERTIA";
        DimensionsSummary[DimensionsSummary["MOMENTUM_SQUARED"] = 14] = "MOMENTUM_SQUARED";
        DimensionsSummary[DimensionsSummary["MASS"] = 15] = "MASS";
        DimensionsSummary[DimensionsSummary["TIME"] = 16] = "TIME";
        DimensionsSummary[DimensionsSummary["CHARGE"] = 17] = "CHARGE";
        DimensionsSummary[DimensionsSummary["CURRENT"] = 18] = "CURRENT";
        DimensionsSummary[DimensionsSummary["TEMPERATURE"] = 19] = "TEMPERATURE";
        DimensionsSummary[DimensionsSummary["AMOUNT"] = 20] = "AMOUNT";
        DimensionsSummary[DimensionsSummary["INTENSITY"] = 21] = "INTENSITY";
        DimensionsSummary[DimensionsSummary["INV_LENGTH"] = 22] = "INV_LENGTH";
        DimensionsSummary[DimensionsSummary["VELOCITY"] = 23] = "VELOCITY";
        DimensionsSummary[DimensionsSummary["VELOCITY_SQUARED"] = 24] = "VELOCITY_SQUARED";
    })(DimensionsSummary = exports.DimensionsSummary || (exports.DimensionsSummary = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DimensionsSummary;
});

define('davinci-newton/math/QQ',["require", "exports"], function (require, exports) {
    "use strict";
    var QQ = (function () {
        function QQ(n, d) {
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
            this.numer_ = n / g;
            this.denom_ = d / g;
        }
        Object.defineProperty(QQ.prototype, "numer", {
            get: function () {
                return this.numer_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
            get: function () {
                return this.denom_;
            },
            enumerable: true,
            configurable: true
        });
        QQ.prototype.add = function (rhs) {
            return QQ.valueOf(this.numer_ * rhs.denom_ + this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
        };
        QQ.prototype.sub = function (rhs) {
            return QQ.valueOf(this.numer_ * rhs.denom_ - this.denom_ * rhs.numer_, this.denom_ * rhs.denom_);
        };
        QQ.prototype.mul = function (rhs) {
            return QQ.valueOf(this.numer_ * rhs.numer_, this.denom_ * rhs.denom_);
        };
        QQ.prototype.div = function (rhs) {
            var numer = this.numer_ * rhs.denom_;
            var denom = this.denom_ * rhs.numer_;
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
            return this.numer_ === 1 && this.denom_ === 1;
        };
        QQ.prototype.isZero = function () {
            return this.numer_ === 0 && this.denom_ === 1;
        };
        QQ.prototype.hashCode = function () {
            return 37 * this.numer_ + 13 * this.denom_;
        };
        QQ.prototype.inv = function () {
            return QQ.valueOf(this.denom_, this.numer_);
        };
        QQ.prototype.neg = function () {
            return QQ.valueOf(-this.numer_, this.denom_);
        };
        QQ.prototype.equals = function (other) {
            if (this === other) {
                return true;
            }
            else if (other instanceof QQ) {
                return this.numer_ * other.denom_ === this.denom_ * other.numer_;
            }
            else {
                return false;
            }
        };
        QQ.prototype.toString = function (radix) {
            return "" + this.numer_.toString(radix) + "/" + this.denom_.toString(radix) + "";
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
            return new QQ(n, d);
        };
        return QQ;
    }());
    QQ.POS_08_01 = new QQ(8, 1);
    QQ.POS_07_01 = new QQ(7, 1);
    QQ.POS_06_01 = new QQ(6, 1);
    QQ.POS_05_01 = new QQ(5, 1);
    QQ.POS_04_01 = new QQ(4, 1);
    QQ.POS_03_01 = new QQ(3, 1);
    QQ.POS_02_01 = new QQ(2, 1);
    QQ.ONE = new QQ(1, 1);
    QQ.POS_01_02 = new QQ(1, 2);
    QQ.POS_01_03 = new QQ(1, 3);
    QQ.POS_01_04 = new QQ(1, 4);
    QQ.POS_01_05 = new QQ(1, 5);
    QQ.ZERO = new QQ(0, 1);
    QQ.NEG_01_03 = new QQ(-1, 3);
    QQ.NEG_01_01 = new QQ(-1, 1);
    QQ.NEG_02_01 = new QQ(-2, 1);
    QQ.NEG_03_01 = new QQ(-3, 1);
    QQ.POS_02_03 = new QQ(2, 3);
    exports.QQ = QQ;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = QQ;
});

define('davinci-newton/math/detectDimensions',["require", "exports", "./DimensionsSummary"], function (require, exports, DimensionsSummary_1) {
    "use strict";
    function detectDimensions(M, L, T, Q, temperature, amount, intensity) {
        if (M.numer === -1) {
            if (M.denom === 1) {
                if (L.numer === -2) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.INV_MOMENT_OF_INERTIA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 0) {
                    if (L.denom === 1) {
                        if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.INV_MASS;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (M.numer === 0) {
            if (M.denom === 1) {
                if (L.numer === 0) {
                    if (L.denom === 1) {
                        if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.INV_TIME;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (Q.numer === 1) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.CURRENT;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ONE;
                                                            }
                                                        }
                                                        else if (intensity.numer === 1) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.INTENSITY;
                                                            }
                                                        }
                                                    }
                                                }
                                                else if (amount.numer === 1) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.AMOUNT;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        else if (temperature.numer === 1) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.TEMPERATURE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                else if (Q.numer === 1) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.CHARGE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.TIME;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.TIME_SQUARED;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 1) {
                    if (L.denom === 1) {
                        if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.VELOCITY;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.LENGTH;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 2) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.VELOCITY_SQUARED;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.RATE_OF_CHANGE_OF_AREA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.AREA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (M.numer === 1) {
            if (M.denom === 1) {
                if (L.numer === 0) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.STIFFNESS;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.MASS;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 1) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.FORCE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.MOMENTUM;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else if (L.numer === 2) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ENERGY_OR_TORQUE;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === -1) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.ANGULAR_MOMENTUM;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else if (T.numer === 0) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.MOMENT_OF_INERTIA;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        else if (M.numer === 2) {
            if (M.denom === 1) {
                if (L.numer === 2) {
                    if (L.denom === 1) {
                        if (T.numer === -2) {
                            if (T.denom === 1) {
                                if (Q.numer === 0) {
                                    if (Q.denom === 1) {
                                        if (temperature.numer === 0) {
                                            if (temperature.denom === 1) {
                                                if (amount.numer === 0) {
                                                    if (amount.denom === 1) {
                                                        if (intensity.numer === 0) {
                                                            if (intensity.denom === 1) {
                                                                return DimensionsSummary_1.default.MOMENTUM_SQUARED;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return DimensionsSummary_1.default.Unknown;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = detectDimensions;
});

define('davinci-newton/math/Dimensions',["require", "exports", "./DimensionsSummary", "../math/QQ", "./detectDimensions"], function (require, exports, DimensionsSummary_1, QQ_1, detectDimensions_1) {
    "use strict";
    var R0 = QQ_1.default.valueOf(0, 1);
    var R1 = QQ_1.default.valueOf(1, 1);
    var R2 = QQ_1.default.valueOf(2, 1);
    var M1 = QQ_1.default.valueOf(-1, 1);
    var M2 = QQ_1.default.valueOf(-2, 1);
    function assertArgRational(name, arg) {
        if (arg instanceof QQ_1.default) {
            return arg;
        }
        else {
            throw new Error("Argument " + name + " => " + arg + " must be a QQ");
        }
    }
    var Dimensions = (function () {
        function Dimensions(M, L, T, Q, temperature, amount, intensity, summary) {
            this.M = assertArgRational('M', M);
            this.L = assertArgRational('L', L);
            this.T = assertArgRational('T', T);
            this.Q = assertArgRational('Q', Q);
            this.temperature = assertArgRational('temperature', temperature);
            this.amount = assertArgRational('amount', amount);
            this.intensity = assertArgRational('intensity', intensity);
            this.summary_ = summary;
        }
        Object.defineProperty(Dimensions.prototype, "summary", {
            get: function () {
                return this.summary_;
            },
            enumerable: true,
            configurable: true
        });
        Dimensions.prototype.compatible = function (rhs) {
            if (this.summary_ !== DimensionsSummary_1.default.Unknown && this.summary_ === rhs.summary_) {
                return this;
            }
            else if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
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
        Dimensions.prototype.equals = function (rhs) {
            if (this === rhs) {
                return true;
            }
            else {
                return this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity);
            }
        };
        Dimensions.prototype.mul = function (rhs) {
            return Dimensions.valueOf(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        Dimensions.prototype.div = function (rhs) {
            return Dimensions.valueOf(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        Dimensions.prototype.pow = function (exponent) {
            return Dimensions.valueOf(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        Dimensions.prototype.sqrt = function () {
            return Dimensions.valueOf(this.M.div(R2), this.L.div(R2), this.T.div(R2), this.Q.div(R2), this.temperature.div(R2), this.amount.div(R2), this.intensity.div(R2));
        };
        Dimensions.prototype.isOne = function () {
            if (this === Dimensions.ONE) {
                return true;
            }
            else {
                return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
            }
        };
        Dimensions.prototype.inv = function () {
            return Dimensions.valueOf(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
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
        Dimensions.valueOf = function (M, L, T, Q, temperature, amount, intensity) {
            var summary = detectDimensions_1.default(M, L, T, Q, temperature, amount, intensity);
            switch (summary) {
                case DimensionsSummary_1.default.ANGULAR_MOMENTUM: return Dimensions.ANGULAR_MOMENTUM;
                case DimensionsSummary_1.default.AREA: return Dimensions.AREA;
                case DimensionsSummary_1.default.ENERGY_OR_TORQUE: return Dimensions.ENERGY_OR_TORQUE;
                case DimensionsSummary_1.default.FORCE: return Dimensions.FORCE;
                case DimensionsSummary_1.default.INV_MOMENT_OF_INERTIA: return Dimensions.INV_MOMENT_OF_INERTIA;
                case DimensionsSummary_1.default.INV_MASS: return Dimensions.INV_MASS;
                case DimensionsSummary_1.default.INV_TIME: return Dimensions.INV_TIME;
                case DimensionsSummary_1.default.LENGTH: return Dimensions.LENGTH;
                case DimensionsSummary_1.default.MOMENTUM: return Dimensions.MOMENTUM;
                case DimensionsSummary_1.default.MOMENTUM_SQUARED: return Dimensions.MOMENTUM_SQUARED;
                case DimensionsSummary_1.default.MOMENT_OF_INERTIA: return Dimensions.MOMENT_OF_INERTIA;
                case DimensionsSummary_1.default.ONE: return Dimensions.ONE;
                case DimensionsSummary_1.default.RATE_OF_CHANGE_OF_AREA: return Dimensions.RATE_OF_CHANGE_OF_AREA;
                case DimensionsSummary_1.default.STIFFNESS: return Dimensions.STIFFNESS;
                case DimensionsSummary_1.default.TIME_SQUARED: return Dimensions.TIME_SQUARED;
                case DimensionsSummary_1.default.VELOCITY: return Dimensions.VELOCITY;
                case DimensionsSummary_1.default.VELOCITY_SQUARED: return Dimensions.VELOCITY_SQUARED;
                default: return new Dimensions(M, L, T, Q, temperature, amount, intensity, summary);
            }
        };
        return Dimensions;
    }());
    Dimensions.ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0, DimensionsSummary_1.default.ONE);
    Dimensions.MASS = new Dimensions(R1, R0, R0, R0, R0, R0, R0, DimensionsSummary_1.default.MASS);
    Dimensions.LENGTH = new Dimensions(R0, R1, R0, R0, R0, R0, R0, DimensionsSummary_1.default.LENGTH);
    Dimensions.AREA = new Dimensions(R0, R2, R0, R0, R0, R0, R0, DimensionsSummary_1.default.AREA);
    Dimensions.INV_LENGTH = new Dimensions(R0, M1, R0, R0, R0, R0, R0, DimensionsSummary_1.default.INV_LENGTH);
    Dimensions.TIME = new Dimensions(R0, R0, R1, R0, R0, R0, R0, DimensionsSummary_1.default.TIME);
    Dimensions.CHARGE = new Dimensions(R0, R0, R0, R1, R0, R0, R0, DimensionsSummary_1.default.CHARGE);
    Dimensions.CURRENT = new Dimensions(R0, R0, M1, R1, R0, R0, R0, DimensionsSummary_1.default.CURRENT);
    Dimensions.TEMPERATURE = new Dimensions(R0, R0, R0, R0, R1, R0, R0, DimensionsSummary_1.default.TEMPERATURE);
    Dimensions.AMOUNT = new Dimensions(R0, R0, R0, R0, R0, R1, R0, DimensionsSummary_1.default.AMOUNT);
    Dimensions.INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, R1, DimensionsSummary_1.default.INTENSITY);
    Dimensions.ANGULAR_MOMENTUM = new Dimensions(R1, R2, M1, R0, R0, R0, R0, DimensionsSummary_1.default.ANGULAR_MOMENTUM);
    Dimensions.RATE_OF_CHANGE_OF_AREA = new Dimensions(R0, R2, M1, R0, R0, R0, R0, DimensionsSummary_1.default.RATE_OF_CHANGE_OF_AREA);
    Dimensions.ENERGY_OR_TORQUE = new Dimensions(R1, R2, M2, R0, R0, R0, R0, DimensionsSummary_1.default.ENERGY_OR_TORQUE);
    Dimensions.FORCE = new Dimensions(R1, R1, M2, R0, R0, R0, R0, DimensionsSummary_1.default.FORCE);
    Dimensions.INV_MASS = new Dimensions(M1, R0, R0, R0, R0, R0, R0, DimensionsSummary_1.default.INV_MASS);
    Dimensions.INV_MOMENT_OF_INERTIA = new Dimensions(M1, M2, R0, R0, R0, R0, R0, DimensionsSummary_1.default.INV_MOMENT_OF_INERTIA);
    Dimensions.INV_TIME = new Dimensions(R0, R0, M1, R0, R0, R0, R0, DimensionsSummary_1.default.INV_TIME);
    Dimensions.MOMENT_OF_INERTIA = new Dimensions(R1, R2, R0, R0, R0, R0, R0, DimensionsSummary_1.default.MOMENT_OF_INERTIA);
    Dimensions.MOMENTUM = new Dimensions(R1, R1, M1, R0, R0, R0, R0, DimensionsSummary_1.default.MOMENTUM);
    Dimensions.MOMENTUM_SQUARED = new Dimensions(R2, R2, M2, R0, R0, R0, R0, DimensionsSummary_1.default.MOMENTUM_SQUARED);
    Dimensions.STIFFNESS = new Dimensions(R1, R0, M2, R0, R0, R0, R0, DimensionsSummary_1.default.STIFFNESS);
    Dimensions.TIME_SQUARED = new Dimensions(R0, R0, R2, R0, R0, R0, R0, DimensionsSummary_1.default.TIME_SQUARED);
    Dimensions.VELOCITY = new Dimensions(R0, R1, M1, R0, R0, R0, R0, DimensionsSummary_1.default.VELOCITY);
    Dimensions.VELOCITY_SQUARED = new Dimensions(R0, R2, M2, R0, R0, R0, R0, DimensionsSummary_1.default.VELOCITY_SQUARED);
    exports.Dimensions = Dimensions;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Dimensions;
});

define('davinci-newton/math/Unit',["require", "exports", "../math/Dimensions", "../math/DimensionsSummary", "../checks/isUndefined"], function (require, exports, Dimensions_1, DimensionsSummary_1, isUndefined_1) {
    "use strict";
    var SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];
    var patterns = [
        [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [-1, 1, +3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, -2, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [+0, 1, -1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
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
        [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],
        [1, 1, 3, 1, -2, 1, -2, 1, 0, 1, 0, 1, 0, 1]
    ];
    var decodes = [
        ["F/m or C**2/N·m**2"],
        ["S or A/V"],
        ["F or C/V"],
        ["C/kg"],
        ["N·m·m/kg·kg"],
        ["C/m**3"],
        ["C/m**2"],
        ["C/m"],
        ["J/kg"],
        ["Hz"],
        ["A"],
        ["m/s**2"],
        ["m/s"],
        ["kg·m/s"],
        ["Pa or N/m**2 or J/m**3"],
        ["Pa·s"],
        ["W/m**2"],
        ["N/m"],
        ["T or Wb/m**2"],
        ["W/(m·K)"],
        ["V/m"],
        ["N"],
        ["H/m"],
        ["J/K"],
        ["J/(kg·K)"],
        ["J/(mol·K)"],
        ["J/mol"],
        ["J or N·m"],
        ["J·s"],
        ["W or J/s"],
        ["V or W/A"],
        ["Ω or V/A"],
        ["H or Wb/A"],
        ["Wb"],
        ["N·m**2/C**2"]
    ];
    var dumbString = function (multiplier, formatted, dimensions, labels, compact) {
        var stringify = function (rational, label) {
            if (rational.numer === 0) {
                return null;
            }
            else if (rational.denom === 1) {
                if (rational.numer === 1) {
                    if (compact) {
                        return label;
                    }
                    else {
                        return label;
                    }
                }
                else {
                    return label + "**" + rational.numer;
                }
            }
            else {
                return label + "**" + rational;
            }
        };
        var operatorStr = multiplier === 1 || dimensions.isOne() ? (compact ? "" : " ") : " ";
        var scaleString = multiplier === 1 ? (compact ? "" : formatted) : formatted;
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
        return dumbString(multiplier, formatted, dimensions, labels, compact);
    };
    function add(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function sub(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
    }
    function mul(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
    }
    function scale(α, unit) {
        return Unit.valueOf(α * unit.multiplier, unit.dimensions, unit.labels);
    }
    function div(lhs, rhs) {
        return Unit.valueOf(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
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
        Unit.prototype.isCompatible = function (rhs) {
            if (rhs instanceof Unit) {
                return this.dimensions.equals(rhs.dimensions);
            }
            else {
                throw new Error("Illegal Argument for Unit.compatible: " + rhs);
            }
        };
        Unit.prototype.__add__ = function (rhs) {
            if (rhs instanceof Unit) {
                return add(this, rhs);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Unit) {
                return add(lhs, this);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.__sub__ = function (rhs) {
            if (rhs instanceof Unit) {
                return sub(this, rhs);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Unit) {
                return sub(lhs, this);
            }
            else {
                return void 0;
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
                return void 0;
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
                return void 0;
            }
        };
        Unit.prototype.div = function (rhs) {
            return div(this, rhs);
        };
        Unit.prototype.__div__ = function (rhs) {
            if (rhs instanceof Unit) {
                return div(this, rhs);
            }
            else if (typeof rhs === 'number') {
                return Unit.valueOf(this.multiplier / rhs, this.dimensions, this.labels);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Unit) {
                return div(lhs, this);
            }
            else if (typeof lhs === 'number') {
                return Unit.valueOf(lhs / this.multiplier, this.dimensions.inv(), this.labels);
            }
            else {
                return void 0;
            }
        };
        Unit.prototype.pow = function (exponent) {
            return Unit.valueOf(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
        };
        Unit.prototype.inv = function () {
            return Unit.valueOf(1 / this.multiplier, this.dimensions.inv(), this.labels);
        };
        Unit.prototype.neg = function () {
            return Unit.valueOf(-this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.isOne = function () {
            return this.dimensions.isOne() && (this.multiplier === 1);
        };
        Unit.prototype.sqrt = function () {
            return Unit.valueOf(Math.sqrt(this.multiplier), this.dimensions.sqrt(), this.labels);
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
                throw new Error("uom " + uom + " must be dimensionless.");
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
        Unit.isCompatible = function (lhs, rhs) {
            if (lhs) {
                if (rhs) {
                    return lhs.isCompatible(rhs);
                }
                else {
                    if (lhs.isOne()) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            else {
                if (rhs) {
                    if (rhs.isOne()) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
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
                    return Unit.ONE;
                }
            }
        };
        Unit.inv = function (uom) {
            if (uom instanceof Unit) {
                if (uom.isOne()) {
                    return Unit.ONE;
                }
                else {
                    return uom.inv();
                }
            }
            else {
                return Unit.ONE;
            }
        };
        Unit.mustBeUnit = function (name, uom) {
            if (uom instanceof Unit) {
                return uom;
            }
            else if (isUndefined_1.default(uom)) {
                return Unit.ONE;
            }
            else {
                throw new Error(name + " must be a Unit or undefined (meaning 1).");
            }
        };
        Unit.pow = function (uom, exponent) {
            if (uom instanceof Unit) {
                if (uom.isOne()) {
                    return void 0;
                }
                else {
                    if (exponent.isZero()) {
                        return void 0;
                    }
                    else {
                        return uom.pow(exponent);
                    }
                }
            }
            else {
                return void 0;
            }
        };
        Unit.sqrt = function (uom) {
            if (uom instanceof Unit) {
                if (uom.isOne()) {
                    return void 0;
                }
                else {
                    return uom.sqrt();
                }
            }
            else {
                return void 0;
            }
        };
        Unit.valueOf = function (multiplier, dimensions, labels) {
            if (multiplier === 1) {
                switch (dimensions.summary) {
                    case DimensionsSummary_1.default.AMOUNT: return Unit.MOLE;
                    case DimensionsSummary_1.default.ANGULAR_MOMENTUM: return Unit.JOULE_SECOND;
                    case DimensionsSummary_1.default.AREA: return Unit.METER_SQUARED;
                    case DimensionsSummary_1.default.CHARGE: return Unit.COULOMB;
                    case DimensionsSummary_1.default.CURRENT: return Unit.AMPERE;
                    case DimensionsSummary_1.default.ENERGY_OR_TORQUE: return Unit.JOULE;
                    case DimensionsSummary_1.default.FORCE: return Unit.NEWTON;
                    case DimensionsSummary_1.default.INTENSITY: return Unit.CANDELA;
                    case DimensionsSummary_1.default.INV_LENGTH: return Unit.INV_METER;
                    case DimensionsSummary_1.default.INV_MASS: return Unit.INV_KILOGRAM;
                    case DimensionsSummary_1.default.INV_MOMENT_OF_INERTIA: return Unit.INV_KILOGRAM_METER_SQUARED;
                    case DimensionsSummary_1.default.INV_TIME: return Unit.INV_SECOND;
                    case DimensionsSummary_1.default.LENGTH: return Unit.METER;
                    case DimensionsSummary_1.default.MASS: return Unit.KILOGRAM;
                    case DimensionsSummary_1.default.MOMENT_OF_INERTIA: return Unit.KILOGRAM_METER_SQUARED;
                    case DimensionsSummary_1.default.MOMENTUM: return Unit.KILOGRAM_METER_PER_SECOND;
                    case DimensionsSummary_1.default.MOMENTUM_SQUARED: return Unit.KILOGRAM_SQUARED_METER_SQUARED_PER_SECOND_SQUARED;
                    case DimensionsSummary_1.default.ONE: return Unit.ONE;
                    case DimensionsSummary_1.default.RATE_OF_CHANGE_OF_AREA: return Unit.METER_SQUARED_PER_SECOND;
                    case DimensionsSummary_1.default.STIFFNESS: return Unit.STIFFNESS;
                    case DimensionsSummary_1.default.TEMPERATURE: return Unit.KELVIN;
                    case DimensionsSummary_1.default.TIME: return Unit.SECOND;
                    case DimensionsSummary_1.default.TIME_SQUARED: return Unit.SECOND_SQUARED;
                    case DimensionsSummary_1.default.VELOCITY: return Unit.METER_PER_SECOND;
                    case DimensionsSummary_1.default.VELOCITY_SQUARED: return Unit.METER_SQUARED_PER_SECOND_SQUARED;
                    default: {
                    }
                }
            }
            return new Unit(multiplier, dimensions, labels);
        };
        return Unit;
    }());
    Unit.ONE = new Unit(1, Dimensions_1.default.ONE, SYMBOLS_SI);
    Unit.KILOGRAM = new Unit(1, Dimensions_1.default.MASS, SYMBOLS_SI);
    Unit.METER = new Unit(1, Dimensions_1.default.LENGTH, SYMBOLS_SI);
    Unit.SECOND = new Unit(1, Dimensions_1.default.TIME, SYMBOLS_SI);
    Unit.COULOMB = new Unit(1, Dimensions_1.default.CHARGE, SYMBOLS_SI);
    Unit.AMPERE = new Unit(1, Dimensions_1.default.CURRENT, SYMBOLS_SI);
    Unit.KELVIN = new Unit(1, Dimensions_1.default.TEMPERATURE, SYMBOLS_SI);
    Unit.MOLE = new Unit(1, Dimensions_1.default.AMOUNT, SYMBOLS_SI);
    Unit.CANDELA = new Unit(1, Dimensions_1.default.INTENSITY, SYMBOLS_SI);
    Unit.NEWTON = new Unit(1, Dimensions_1.default.FORCE, SYMBOLS_SI);
    Unit.JOULE = new Unit(1, Dimensions_1.default.ENERGY_OR_TORQUE, SYMBOLS_SI);
    Unit.JOULE_SECOND = new Unit(1, Dimensions_1.default.ANGULAR_MOMENTUM, SYMBOLS_SI);
    Unit.METER_SQUARED = new Unit(1, Dimensions_1.default.AREA, SYMBOLS_SI);
    Unit.SECOND_SQUARED = new Unit(1, Dimensions_1.default.TIME_SQUARED, SYMBOLS_SI);
    Unit.INV_KILOGRAM = new Unit(1, Dimensions_1.default.INV_MASS, SYMBOLS_SI);
    Unit.INV_METER = new Unit(1, Dimensions_1.default.INV_LENGTH, SYMBOLS_SI);
    Unit.INV_SECOND = new Unit(1, Dimensions_1.default.INV_TIME, SYMBOLS_SI);
    Unit.KILOGRAM_METER_SQUARED = new Unit(1, Dimensions_1.default.MOMENT_OF_INERTIA, SYMBOLS_SI);
    Unit.KILOGRAM_METER_PER_SECOND = new Unit(1, Dimensions_1.default.MOMENTUM, SYMBOLS_SI);
    Unit.KILOGRAM_SQUARED_METER_SQUARED_PER_SECOND_SQUARED = new Unit(1, Dimensions_1.default.MOMENTUM_SQUARED, SYMBOLS_SI);
    Unit.INV_KILOGRAM_METER_SQUARED = new Unit(1, Dimensions_1.default.INV_MOMENT_OF_INERTIA, SYMBOLS_SI);
    Unit.STIFFNESS = new Unit(1, Dimensions_1.default.STIFFNESS, SYMBOLS_SI);
    Unit.METER_PER_SECOND = new Unit(1, Dimensions_1.default.VELOCITY, SYMBOLS_SI);
    Unit.METER_SQUARED_PER_SECOND = new Unit(1, Dimensions_1.default.RATE_OF_CHANGE_OF_AREA, SYMBOLS_SI);
    Unit.METER_SQUARED_PER_SECOND_SQUARED = new Unit(1, Dimensions_1.default.VELOCITY_SQUARED, SYMBOLS_SI);
    exports.Unit = Unit;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Unit;
});

define('davinci-newton/math/extG3',["require", "exports", "./compG3Get", "./extE3", "./compG3Set", "./Unit"], function (require, exports, compG3Get_1, extE3_1, compG3Set_1, Unit_1) {
    "use strict";
    function extG3(a, b, out) {
        out.uom = Unit_1.default.mul(a.uom, b.uom);
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

define('davinci-newton/math/gauss',["require", "exports"], function (require, exports) {
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

define('davinci-newton/math/isScalarG3',["require", "exports"], function (require, exports) {
    "use strict";
    function isScalarG3(m) {
        return m.x === 0 && m.y === 0 && m.z === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isScalarG3;
});

define('davinci-newton/checks/isNumber',["require", "exports"], function (require, exports) {
    "use strict";
    function isNumber(x) {
        return (typeof x === 'number');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isNumber;
});

define('davinci-newton/checks/isObject',["require", "exports"], function (require, exports) {
    "use strict";
    function isObject(x) {
        return (typeof x === 'object');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isObject;
});

define('davinci-newton/math/isVectorE3',["require", "exports", "../checks/isNull", "../checks/isNumber", "../checks/isObject"], function (require, exports, isNull_1, isNumber_1, isObject_1) {
    "use strict";
    function isVectorE3(v) {
        if (isObject_1.default(v) && !isNull_1.default(v)) {
            return isNumber_1.default(v.x) && isNumber_1.default(v.y) && isNumber_1.default(v.z);
        }
        else {
            return false;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isVectorE3;
});

define('davinci-newton/math/isVectorG3',["require", "exports"], function (require, exports) {
    "use strict";
    function isVectorG3(m) {
        return m.a === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isVectorG3;
});

define('davinci-newton/math/isZeroBivectorE3',["require", "exports"], function (require, exports) {
    "use strict";
    function isZeroBivectorE3(m) {
        return m.yz === 0 && m.zx === 0 && m.xy === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isZeroBivectorE3;
});

define('davinci-newton/math/isZeroVectorE3',["require", "exports"], function (require, exports) {
    "use strict";
    function isZeroVectorE3(v) {
        return v.x === 0 && v.y === 0 && v.z === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isZeroVectorE3;
});

define('davinci-newton/math/isZeroGeometricE3',["require", "exports", "./isZeroBivectorE3", "./isZeroVectorE3"], function (require, exports, isZeroBivectorE3_1, isZeroVectorE3_1) {
    "use strict";
    function isZeroGeometricE3(m) {
        return isZeroVectorE3_1.default(m) && isZeroBivectorE3_1.default(m) && m.a === 0 && m.b === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isZeroGeometricE3;
});

define('davinci-newton/math/lcoE3',["require", "exports"], function (require, exports) {
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

define('davinci-newton/math/lcoG3',["require", "exports", "./compG3Get", "./lcoE3", "./compG3Set", "./Unit"], function (require, exports, compG3Get_1, lcoE3_1, compG3Set_1, Unit_1) {
    "use strict";
    function lcoG3(a, b, out) {
        out.uom = Unit_1.default.mul(a.uom, b.uom);
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

define('davinci-newton/math/maskG3',["require", "exports", "../checks/isNumber", "../checks/isObject", "./Unit"], function (require, exports, isNumber_1, isObject_1, Unit_1) {
    "use strict";
    var ONE = void 0;
    var scratch = { a: 0, x: 0, y: 0, z: 0, yz: 0, zx: 0, xy: 0, b: 0, uom: ONE };
    function maskG3(arg) {
        if (isObject_1.default(arg) && 'maskG3' in arg) {
            var duck = arg;
            var g = arg;
            if (duck.maskG3 & 0x1) {
                scratch.a = g.a;
            }
            else {
                scratch.a = 0;
            }
            if (duck.maskG3 & 0x2) {
                scratch.x = g.x;
                scratch.y = g.y;
                scratch.z = g.z;
            }
            else {
                scratch.x = 0;
                scratch.y = 0;
                scratch.z = 0;
            }
            if (duck.maskG3 & 0x4) {
                scratch.yz = g.yz;
                scratch.zx = g.zx;
                scratch.xy = g.xy;
            }
            else {
                scratch.yz = 0;
                scratch.zx = 0;
                scratch.xy = 0;
            }
            if (duck.maskG3 & 0x8) {
                scratch.b = g.b;
            }
            else {
                scratch.b = 0;
            }
            scratch.uom = Unit_1.default.mustBeUnit('g.uom', g.uom);
            return scratch;
        }
        else if (isNumber_1.default(arg)) {
            scratch.a = arg;
            scratch.x = 0;
            scratch.y = 0;
            scratch.z = 0;
            scratch.yz = 0;
            scratch.zx = 0;
            scratch.xy = 0;
            scratch.b = 0;
            scratch.uom = ONE;
            return scratch;
        }
        else {
            return void 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = maskG3;
});

define('davinci-newton/math/mulE3',["require", "exports"], function (require, exports) {
    "use strict";
    function mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
        switch (index) {
            case 0: {
                return a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7;
            }
            case 1: {
                return a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5;
            }
            case 2: {
                return a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6;
            }
            case 3: {
                return a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4;
            }
            case 4: {
                return a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3;
            }
            case 5: {
                return a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1;
            }
            case 6: {
                return a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2;
            }
            case 7: {
                return a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0;
            }
            default: {
                throw new Error("index must be in the range [0..7]");
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mulE3;
});

define('davinci-newton/math/randomRange',["require", "exports"], function (require, exports) {
    "use strict";
    function default_1(a, b) {
        return (b - a) * Math.random() + a;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-newton/checks/mustSatisfy',["require", "exports"], function (require, exports) {
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

define('davinci-newton/checks/isString',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(s) {
        return (typeof s === 'string');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isString;
});

define('davinci-newton/checks/mustBeString',["require", "exports", "../checks/mustSatisfy", "../checks/isString"], function (require, exports, mustSatisfy_1, isString_1) {
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

define('davinci-newton/i18n/readOnly',["require", "exports", "../checks/mustBeString"], function (require, exports, mustBeString_1) {
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

define('davinci-newton/math/rcoE3',["require", "exports"], function (require, exports) {
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

define('davinci-newton/math/rcoG3',["require", "exports", "./compG3Get", "./rcoE3", "./compG3Set", "./Unit"], function (require, exports, compG3Get_1, rcoE3_1, compG3Set_1, Unit_1) {
    "use strict";
    function rcoG3(a, b, out) {
        out.uom = Unit_1.default.mul(a.uom, b.uom);
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

define('davinci-newton/math/quadVectorE3',["require", "exports"], function (require, exports) {
    "use strict";
    function quadVectorE3(vector) {
        var x = vector.x;
        var y = vector.y;
        var z = vector.z;
        return x * x + y * y + z * z;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = quadVectorE3;
});

define('davinci-newton/math/wedgeXY',["require", "exports"], function (require, exports) {
    "use strict";
    function wedgeXY(ax, ay, az, bx, by, bz) {
        return ax * by - ay * bx;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeXY;
});

define('davinci-newton/math/wedgeYZ',["require", "exports"], function (require, exports) {
    "use strict";
    function wedgeYZ(ax, ay, az, bx, by, bz) {
        return ay * bz - az * by;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeYZ;
});

define('davinci-newton/math/wedgeZX',["require", "exports"], function (require, exports) {
    "use strict";
    function wedgeZX(ax, ay, az, bx, by, bz) {
        return az * bx - ax * bz;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = wedgeZX;
});

define('davinci-newton/math/rotorFromDirectionsE3',["require", "exports", "./dotVectorE3", "./quadVectorE3", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function (require, exports, dotVectorE3_1, quadVectorE3_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    "use strict";
    var sqrt = Math.sqrt;
    var cosPIdiv4 = Math.cos(Math.PI / 4);
    var sinPIdiv4 = Math.sin(Math.PI / 4);
    function rotorFromDirectionsE3(a, b, B, m) {
        if (a.x === b.x && a.y === b.y && a.z === b.z) {
            m.one();
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = -sinPIdiv4;
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
            m.zero();
            m.a = cosPIdiv4;
            m.yz = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 1 && b.y === 0 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.yz = sinPIdiv4;
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = sinPIdiv4;
            return;
        }
        if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = -sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === -1) {
            m.zero();
            m.a = cosPIdiv4;
            m.yz = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === -1 && b.y === 0 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = sinPIdiv4;
            return;
        }
        if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === -1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.yz = -sinPIdiv4;
            return;
        }
        if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 1 && b.z === 0) {
            m.zero();
            m.a = cosPIdiv4;
            m.xy = sinPIdiv4;
            return;
        }
        if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 0 && b.y === 0 && b.z === 1) {
            m.zero();
            m.a = cosPIdiv4;
            m.zx = -sinPIdiv4;
            return;
        }
        if (typeof B === 'undefined') {
            if (a.x === 1 && a.y === 0 && a.z === 0 && b.x === -1 && b.y === 0 && b.z === 0) {
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === -1 && a.y === 0 && a.z === 0 && b.x === 1 && b.y === 0 && b.z === 0) {
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === 0 && a.y === 1 && a.z === 0 && b.x === 0 && b.y === -1 && b.z === 0) {
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === 0 && a.y === -1 && a.z === 0 && b.x === 0 && b.y === +1 && b.z === 0) {
                m.zero();
                m.xy = -1;
                return;
            }
            if (a.x === 0 && a.y === 0 && a.z === 1 && b.x === 0 && b.y === 0 && b.z === -1) {
                m.zero();
                m.zx = -1;
                return;
            }
            if (a.x === 0 && a.y === 0 && a.z === -1 && b.x === 0 && b.y === 0 && b.z === +1) {
                m.zero();
                m.zx = -1;
                return;
            }
        }
        var quadA = quadVectorE3_1.default(a);
        var absA = sqrt(quadA);
        var quadB = quadVectorE3_1.default(b);
        var absB = sqrt(quadB);
        var BA = absB * absA;
        var dotBA = dotVectorE3_1.default(b, a);
        var denom = sqrt(2 * (quadB * quadA + BA * dotBA));
        if (denom !== 0) {
            m = m.versor(b, a);
            m = m.addScalar(BA);
            m = m.divByScalar(denom);
        }
        else {
            if (B) {
                m.rotorFromGeneratorAngle(B, Math.PI);
            }
            else {
                var rx = Math.random();
                var ry = Math.random();
                var rz = Math.random();
                m.zero();
                m.yz = wedgeYZ_1.default(rx, ry, rz, a.x, a.y, a.z);
                m.zx = wedgeZX_1.default(rx, ry, rz, a.x, a.y, a.z);
                m.xy = wedgeXY_1.default(rx, ry, rz, a.x, a.y, a.z);
                m.direction();
                m.rotorFromGeneratorAngle(m, Math.PI);
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = rotorFromDirectionsE3;
});

define('davinci-newton/math/scpG3',["require", "exports", "../math/compG3Get", "../math/mulE3", "../math/compG3Set", "../math/Unit"], function (require, exports, compG3Get_1, mulE3_1, compG3Set_1, Unit_1) {
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
        out.uom = Unit_1.default.mul(a.uom, b.uom);
        return out;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = scpG3;
});

define('davinci-newton/math/squaredNormG3',["require", "exports"], function (require, exports) {
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

define('davinci-newton/checks/isArray',["require", "exports"], function (require, exports) {
    "use strict";
    function isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isArray;
});

define('davinci-newton/checks/mustBeArray',["require", "exports", "../checks/mustSatisfy", "../checks/isArray"], function (require, exports, mustSatisfy_1, isArray_1) {
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

define('davinci-newton/math/stringFromCoordinates',["require", "exports", "../checks/isDefined", "../checks/mustBeArray", "./Unit"], function (require, exports, isDefined_1, mustBeArray_1, Unit_1) {
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
    function stringFromCoordinates(coordinates, numberToString, labels, uom) {
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
        if (Unit_1.default.isOne(uom)) {
            return sb.length > 0 ? sb.join("") : "0";
        }
        else {
            return sb.length > 0 ? sb.join("") + " " + uom.toString(10, true) : "0";
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = stringFromCoordinates;
});

define('davinci-newton/math/Geometric3',["require", "exports", "./approx", "./arraysEQ", "./dotVectorE3", "./extG3", "./gauss", "../checks/isDefined", "./isScalarG3", "./isVectorE3", "./isVectorG3", "./isZeroGeometricE3", "./isZeroVectorE3", "./lcoG3", "./maskG3", "./mulE3", "./QQ", "./randomRange", "../i18n/readOnly", "./rcoG3", "./rotorFromDirectionsE3", "./scpG3", "./squaredNormG3", "./stringFromCoordinates", "./Unit", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function (require, exports, approx_1, arraysEQ_1, dotVectorE3_1, extG3_1, gauss_1, isDefined_1, isScalarG3_1, isVectorE3_1, isVectorG3_1, isZeroGeometricE3_1, isZeroVectorE3_1, lcoG3_1, maskG3_1, mulE3_1, QQ_1, randomRange_1, readOnly_1, rcoG3_1, rotorFromDirectionsE3_1, scpG3_1, squaredNormG3_1, stringFromCoordinates_1, Unit_1, wedgeXY_1, wedgeYZ_1, wedgeZX_1) {
    "use strict";
    var COORD_SCALAR = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_PSEUDO = 7;
    var BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
    BASIS_LABELS[COORD_SCALAR] = '1';
    BASIS_LABELS[COORD_X] = 'e1';
    BASIS_LABELS[COORD_Y] = 'e2';
    BASIS_LABELS[COORD_Z] = 'e3';
    var zero = function zero() {
        return [0, 0, 0, 0, 0, 0, 0, 0];
    };
    var scalar = function scalar(a) {
        var coords = zero();
        coords[COORD_SCALAR] = a;
        return coords;
    };
    var vector = function vector(x, y, z) {
        var coords = zero();
        coords[COORD_X] = x;
        coords[COORD_Y] = y;
        coords[COORD_Z] = z;
        return coords;
    };
    var bivector = function bivector(yz, zx, xy) {
        var coords = zero();
        coords[COORD_YZ] = yz;
        coords[COORD_ZX] = zx;
        coords[COORD_XY] = xy;
        return coords;
    };
    var spinor = function spinor(a, yz, zx, xy) {
        var coords = zero();
        coords[COORD_SCALAR] = a;
        coords[COORD_YZ] = yz;
        coords[COORD_ZX] = zx;
        coords[COORD_XY] = xy;
        return coords;
    };
    var multivector = function multivector(a, x, y, z, yz, zx, xy, b) {
        var coords = zero();
        coords[COORD_SCALAR] = a;
        coords[COORD_X] = x;
        coords[COORD_Y] = y;
        coords[COORD_Z] = z;
        coords[COORD_YZ] = yz;
        coords[COORD_ZX] = zx;
        coords[COORD_XY] = xy;
        coords[COORD_PSEUDO] = b;
        return coords;
    };
    var pseudo = function pseudo(b) {
        var coords = zero();
        coords[COORD_PSEUDO] = b;
        return coords;
    };
    var coordinates = function coordinates(m) {
        var coords = zero();
        coords[COORD_SCALAR] = m.a;
        coords[COORD_X] = m.x;
        coords[COORD_Y] = m.y;
        coords[COORD_Z] = m.z;
        coords[COORD_YZ] = m.yz;
        coords[COORD_ZX] = m.zx;
        coords[COORD_XY] = m.xy;
        coords[COORD_PSEUDO] = m.b;
        return coords;
    };
    function cosVectorVector(a, b) {
        function scp(a, b) {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }
        function norm(v) {
            return Math.sqrt(scp(v, v));
        }
        return scp(a, b) / (norm(a) * norm(b));
    }
    function lock(m) {
        m.lock();
        return m;
    }
    function compatibleUnit(a, b) {
        if (Unit_1.default.isCompatible(a.uom, b.uom)) {
            return Unit_1.default.compatible(a.uom, b.uom);
        }
        else {
            try {
                return Unit_1.default.compatible(a.uom, b.uom);
            }
            catch (e) {
                throw new Error(Geometric3.copy(a) + " and " + Geometric3.copy(b) + " must have compatible units of measure. Cause: " + e);
            }
        }
    }
    var cosines = [];
    var UNLOCKED = -1 * Math.random();
    var Geometric3 = (function () {
        function Geometric3(coords, uom) {
            if (coords === void 0) { coords = zero(); }
            this.lock_ = UNLOCKED;
            if (coords.length !== 8) {
                throw new Error("coords.length must be 8");
            }
            this.coords_ = coords;
            this.uom_ = uom;
            this.modified_ = false;
        }
        Geometric3.prototype.isLocked = function () {
            return this.lock_ !== UNLOCKED;
        };
        Geometric3.prototype.lock = function () {
            if (this.lock_ !== UNLOCKED) {
                throw new Error("already locked");
            }
            else {
                this.lock_ = Math.random();
                return this.lock_;
            }
        };
        Geometric3.prototype.unlock = function (token) {
            if (this.lock_ === UNLOCKED) {
                throw new Error("not locked");
            }
            else if (this.lock_ === token) {
                this.lock_ = UNLOCKED;
            }
            else {
                throw new Error("unlock denied");
            }
        };
        Geometric3.prototype.setCoordinate = function (index, newValue, name) {
            if (this.lock_ === UNLOCKED) {
                var coords = this.coords_;
                var previous = coords[index];
                if (newValue !== previous) {
                    coords[index] = newValue;
                    this.modified_ = true;
                }
            }
            else {
                throw new Error(readOnly_1.default(name).message);
            }
        };
        Object.defineProperty(Geometric3.prototype, "a", {
            get: function () {
                return this.coords_[COORD_SCALAR];
            },
            set: function (a) {
                this.setCoordinate(COORD_SCALAR, a, 'a');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "b", {
            get: function () {
                return this.coords_[COORD_PSEUDO];
            },
            set: function (b) {
                this.setCoordinate(COORD_PSEUDO, b, 'b');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "maskG3", {
            get: function () {
                var coords = this.coords_;
                var α = coords[COORD_SCALAR];
                var x = coords[COORD_X];
                var y = coords[COORD_Y];
                var z = coords[COORD_Z];
                var yz = coords[COORD_YZ];
                var zx = coords[COORD_ZX];
                var xy = coords[COORD_XY];
                var β = coords[COORD_PSEUDO];
                var mask = 0x0;
                if (α !== 0) {
                    mask += 0x1;
                }
                if (x !== 0 || y !== 0 || z !== 0) {
                    mask += 0x2;
                }
                if (yz !== 0 || zx !== 0 || xy !== 0) {
                    mask += 0x4;
                }
                if (β !== 0) {
                    mask += 0x8;
                }
                return mask;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "uom", {
            get: function () {
                return this.uom_;
            },
            set: function (uom) {
                if (this.lock_ === UNLOCKED) {
                    this.uom_ = Unit_1.default.mustBeUnit('uom', uom);
                }
                else {
                    throw new Error(readOnly_1.default('uom').message);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "x", {
            get: function () {
                return this.coords_[COORD_X];
            },
            set: function (x) {
                this.setCoordinate(COORD_X, x, 'x');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "y", {
            get: function () {
                return this.coords_[COORD_Y];
            },
            set: function (y) {
                this.setCoordinate(COORD_Y, y, 'y');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "z", {
            get: function () {
                return this.coords_[COORD_Z];
            },
            set: function (z) {
                this.setCoordinate(COORD_Z, z, 'z');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "yz", {
            get: function () {
                return this.coords_[COORD_YZ];
            },
            set: function (yz) {
                this.setCoordinate(COORD_YZ, yz, 'yz');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "zx", {
            get: function () {
                return this.coords_[COORD_ZX];
            },
            set: function (zx) {
                this.setCoordinate(COORD_ZX, zx, 'zx');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Geometric3.prototype, "xy", {
            get: function () {
                return this.coords_[COORD_XY];
            },
            set: function (xy) {
                this.setCoordinate(COORD_XY, xy, 'xy');
            },
            enumerable: true,
            configurable: true
        });
        Geometric3.prototype.add = function (M, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().add(M, α));
            }
            else {
                if (this.isZero()) {
                    this.a = M.a * α;
                    this.x = M.x * α;
                    this.y = M.y * α;
                    this.z = M.z * α;
                    this.yz = M.yz * α;
                    this.zx = M.zx * α;
                    this.xy = M.xy * α;
                    this.b = M.b * α;
                    this.uom = M.uom;
                    return this;
                }
                else if (isZeroGeometricE3_1.default(M)) {
                    return this;
                }
                else {
                    this.a += M.a * α;
                    this.x += M.x * α;
                    this.y += M.y * α;
                    this.z += M.z * α;
                    this.yz += M.yz * α;
                    this.zx += M.zx * α;
                    this.xy += M.xy * α;
                    this.b += M.b * α;
                    this.uom = compatibleUnit(this, M);
                    return this;
                }
            }
        };
        Geometric3.prototype.add2 = function (a, b) {
            if (isZeroGeometricE3_1.default(a)) {
                this.uom = b.uom;
            }
            else if (isZeroGeometricE3_1.default(b)) {
                this.uom = a.uom;
            }
            else {
                this.uom = compatibleUnit(a, b);
            }
            this.a = a.a + b.a;
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.yz = a.yz + b.yz;
            this.zx = a.zx + b.zx;
            this.xy = a.xy + b.xy;
            this.b = a.b + b.b;
            return this;
        };
        Geometric3.prototype.addPseudo = function (β, uom) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().addPseudo(β, uom));
            }
            else {
                if (this.isZero()) {
                    this.uom = uom;
                }
                else if (β === 0) {
                    return this;
                }
                else {
                    this.uom = Unit_1.default.compatible(this.uom, uom);
                }
                this.b += β;
                return this;
            }
        };
        Geometric3.prototype.addScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().addScalar(α, uom));
            }
            else {
                if (this.isZero()) {
                    this.uom = uom;
                }
                else if (α === 0) {
                    return this;
                }
                else {
                    this.uom = Unit_1.default.compatible(this.uom, uom);
                }
                this.a += α;
                return this;
            }
        };
        Geometric3.prototype.addVector = function (v, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().addVector(v, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = v.uom;
                }
                else if (isZeroVectorE3_1.default(v)) {
                    return this;
                }
                else {
                    this.uom = Unit_1.default.compatible(this.uom, v.uom);
                }
                this.x += v.x * α;
                this.y += v.y * α;
                this.z += v.z * α;
                return this;
            }
        };
        Geometric3.prototype.angle = function () {
            return this.log().grade(2);
        };
        Geometric3.prototype.approx = function (n) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().approx(n));
            }
            else {
                approx_1.default(this.coords_, n);
                return this;
            }
        };
        Geometric3.prototype.clone = function () {
            return Geometric3.copy(this);
        };
        Geometric3.prototype.conj = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().conj());
            }
            else {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
                this.yz = -this.yz;
                this.zx = -this.zx;
                this.xy = -this.xy;
                return this;
            }
        };
        Geometric3.prototype.copyCoordinates = function (coordinates) {
            this.a = coordinates[COORD_SCALAR];
            this.x = coordinates[COORD_X];
            this.y = coordinates[COORD_Y];
            this.z = coordinates[COORD_Z];
            this.yz = coordinates[COORD_YZ];
            this.zx = coordinates[COORD_ZX];
            this.xy = coordinates[COORD_XY];
            this.b = coordinates[COORD_PSEUDO];
            return this;
        };
        Geometric3.prototype.copy = function (M) {
            this.a = M.a;
            this.x = M.x;
            this.y = M.y;
            this.z = M.z;
            this.yz = M.yz;
            this.zx = M.zx;
            this.xy = M.xy;
            this.b = M.b;
            this.uom = M.uom;
            return this;
        };
        Geometric3.prototype.copyBivector = function (B) {
            this.setCoordinate(COORD_SCALAR, 0, 'a');
            this.setCoordinate(COORD_X, 0, 'x');
            this.setCoordinate(COORD_Y, 0, 'y');
            this.setCoordinate(COORD_Z, 0, 'z');
            this.setCoordinate(COORD_YZ, B.yz, 'yz');
            this.setCoordinate(COORD_ZX, B.zx, 'zx');
            this.setCoordinate(COORD_XY, B.xy, 'xy');
            this.setCoordinate(COORD_PSEUDO, 0, 'b');
            this.uom = B.uom;
            return this;
        };
        Geometric3.prototype.copyScalar = function (α, uom) {
            this.setCoordinate(COORD_SCALAR, α, 'a');
            this.setCoordinate(COORD_X, 0, 'x');
            this.setCoordinate(COORD_Y, 0, 'y');
            this.setCoordinate(COORD_Z, 0, 'z');
            this.setCoordinate(COORD_YZ, 0, 'yz');
            this.setCoordinate(COORD_ZX, 0, 'zx');
            this.setCoordinate(COORD_XY, 0, 'xy');
            this.setCoordinate(COORD_PSEUDO, 0, 'b');
            this.uom = uom;
            return this;
        };
        Geometric3.prototype.copySpinor = function (spinor) {
            this.setCoordinate(COORD_SCALAR, spinor.a, 'a');
            this.setCoordinate(COORD_X, 0, 'x');
            this.setCoordinate(COORD_Y, 0, 'y');
            this.setCoordinate(COORD_Z, 0, 'z');
            this.setCoordinate(COORD_YZ, spinor.yz, 'yz');
            this.setCoordinate(COORD_ZX, spinor.zx, 'zx');
            this.setCoordinate(COORD_XY, spinor.xy, 'xy');
            this.setCoordinate(COORD_PSEUDO, 0, 'b');
            this.uom = spinor.uom;
            return this;
        };
        Geometric3.prototype.copyVector = function (vector) {
            this.setCoordinate(COORD_SCALAR, 0, 'a');
            this.setCoordinate(COORD_X, vector.x, 'x');
            this.setCoordinate(COORD_Y, vector.y, 'y');
            this.setCoordinate(COORD_Z, vector.z, 'z');
            this.setCoordinate(COORD_YZ, 0, 'yz');
            this.setCoordinate(COORD_ZX, 0, 'zx');
            this.setCoordinate(COORD_XY, 0, 'xy');
            this.setCoordinate(COORD_PSEUDO, 0, 'b');
            this.uom = vector.uom;
            return this;
        };
        Geometric3.prototype.cross = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().cross(m));
            }
            else {
                this.ext(m);
                this.dual(this).neg();
                return this;
            }
        };
        Geometric3.prototype.direction = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().direction());
            }
            else {
                var norm = this.magnitudeSansUnits();
                if (norm !== 0) {
                    this.a = this.a / norm;
                    this.x = this.x / norm;
                    this.y = this.y / norm;
                    this.z = this.z / norm;
                    this.yz = this.yz / norm;
                    this.zx = this.zx / norm;
                    this.xy = this.xy / norm;
                    this.b = this.b / norm;
                }
                this.uom = void 0;
                return this;
            }
        };
        Geometric3.prototype.div = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().div(m));
            }
            else {
                if (isScalarG3_1.default(m)) {
                    this.divByScalar(m.a, m.uom);
                    return this;
                }
                else if (isVectorG3_1.default(m)) {
                    return this.divByVector(m);
                }
                else {
                    this.uom = Unit_1.default.div(this.uom, m.uom);
                    var α = m.a;
                    var x = m.x;
                    var y = m.y;
                    var z = m.z;
                    var xy = m.xy;
                    var yz = m.yz;
                    var zx = m.zx;
                    var β = m.b;
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
                    var a0 = this.a;
                    var a1 = this.x;
                    var a2 = this.y;
                    var a3 = this.z;
                    var a4 = this.xy;
                    var a5 = this.yz;
                    var a6 = this.zx;
                    var a7 = this.b;
                    var b0 = X[0];
                    var b1 = X[1];
                    var b2 = X[2];
                    var b3 = X[3];
                    var b4 = X[4];
                    var b5 = X[5];
                    var b6 = X[6];
                    var b7 = X[7];
                    var c0 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                    var c1 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                    var c2 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                    var c3 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                    var c4 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                    var c5 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                    var c6 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                    var c7 = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
                    this.a = c0;
                    this.x = c1;
                    this.y = c2;
                    this.z = c3;
                    this.xy = c4;
                    this.yz = c5;
                    this.zx = c6;
                    this.b = c7;
                }
                return this;
            }
        };
        Geometric3.prototype.divByNumber = function (α) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().divByNumber(α));
            }
            else {
                this.a /= α;
                this.x /= α;
                this.y /= α;
                this.z /= α;
                this.yz /= α;
                this.zx /= α;
                this.xy /= α;
                this.b /= α;
                return this;
            }
        };
        Geometric3.prototype.divByScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().divByScalar(α, uom));
            }
            else {
                this.uom = Unit_1.default.div(this.uom, uom);
                this.a /= α;
                this.x /= α;
                this.y /= α;
                this.z /= α;
                this.yz /= α;
                this.zx /= α;
                this.xy /= α;
                this.b /= α;
                return this;
            }
        };
        Geometric3.prototype.divByVector = function (v) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().divByVector(v));
            }
            else {
                var x = v.x;
                var y = v.y;
                var z = v.z;
                var uom2 = Unit_1.default.pow(v.uom, QQ_1.default.valueOf(2, 1));
                var squaredNorm = x * x + y * y + z * z;
                return this.mulByVector(v).divByScalar(squaredNorm, uom2);
            }
        };
        Geometric3.prototype.div2 = function (a, b) {
            this.uom = Unit_1.default.div(a.uom, b.uom);
            var a0 = a.a;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.a;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        };
        Geometric3.prototype.dual = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().dual(m));
            }
            else {
                if (isDefined_1.default(m)) {
                    var w = -m.b;
                    var x = -m.yz;
                    var y = -m.zx;
                    var z = -m.xy;
                    var yz = m.x;
                    var zx = m.y;
                    var xy = m.z;
                    var β = m.a;
                    this.a = w;
                    this.x = x;
                    this.y = y;
                    this.z = z;
                    this.yz = yz;
                    this.zx = zx;
                    this.xy = xy;
                    this.b = β;
                    this.uom = m.uom;
                    return this;
                }
                else {
                    return this.dual(this);
                }
            }
        };
        Geometric3.prototype.equals = function (other) {
            if (other instanceof Geometric3) {
                return arraysEQ_1.default(this.coords_, other.coords_);
            }
            else {
                return false;
            }
        };
        Geometric3.prototype.exp = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().exp());
            }
            else {
                Unit_1.default.assertDimensionless(this.uom);
                var expW = Math.exp(this.a);
                var yz = this.yz;
                var zx = this.zx;
                var xy = this.xy;
                var φ = Math.sqrt(yz * yz + zx * zx + xy * xy);
                var s = φ !== 0 ? Math.sin(φ) / φ : 1;
                var cosφ = Math.cos(φ);
                this.a = cosφ;
                this.yz = yz * s;
                this.zx = zx * s;
                this.xy = xy * s;
                return this.mulByNumber(expW);
            }
        };
        Geometric3.prototype.inv = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().inv());
            }
            else {
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
                this.a = X[0];
                this.x = X[1];
                this.y = X[2];
                this.z = X[3];
                this.xy = X[4];
                this.yz = X[5];
                this.zx = X[6];
                this.b = X[7];
                this.uom = Unit_1.default.inv(this.uom);
                return this;
            }
        };
        Geometric3.prototype.isOne = function () {
            if (Unit_1.default.isOne(this.uom)) {
                return this.a === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
            }
            else {
                return false;
            }
        };
        Geometric3.prototype.isZero = function () {
            return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
        };
        Geometric3.prototype.lco = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().lco(m));
            }
            else {
                return this.lco2(this, m);
            }
        };
        Geometric3.prototype.lco2 = function (a, b) {
            return lcoG3_1.default(a, b, this);
        };
        Geometric3.prototype.lerp = function (target, α) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().lerp(target, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = target.uom;
                }
                else if (isZeroGeometricE3_1.default(target)) {
                }
                else {
                    this.uom = compatibleUnit(this, target);
                }
                this.a += (target.a - this.a) * α;
                this.x += (target.x - this.x) * α;
                this.y += (target.y - this.y) * α;
                this.z += (target.z - this.z) * α;
                this.yz += (target.yz - this.yz) * α;
                this.zx += (target.zx - this.zx) * α;
                this.xy += (target.xy - this.xy) * α;
                this.b += (target.b - this.b) * α;
                return this;
            }
        };
        Geometric3.prototype.lerp2 = function (a, b, α) {
            this.copy(a).lerp(b, α);
            return this;
        };
        Geometric3.prototype.log = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().log());
            }
            else {
                Unit_1.default.assertDimensionless(this.uom);
                var α = this.a;
                var x = this.yz;
                var y = this.zx;
                var z = this.xy;
                var BB = x * x + y * y + z * z;
                var B = Math.sqrt(BB);
                var f = Math.atan2(B, α) / B;
                this.a = Math.log(Math.sqrt(α * α + BB));
                this.yz = x * f;
                this.zx = y * f;
                this.xy = z * f;
                return this;
            }
        };
        Geometric3.prototype.magnitude = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().magnitude());
            }
            else {
                this.a = Math.sqrt(this.squaredNormSansUnits());
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.xy = 0;
                this.yz = 0;
                this.zx = 0;
                this.b = 0;
                return this;
            }
        };
        Geometric3.prototype.magnitudeSansUnits = function () {
            return Math.sqrt(this.squaredNormSansUnits());
        };
        Geometric3.prototype.mul = function (rhs) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mul(rhs));
            }
            else {
                return this.mul2(this, rhs);
            }
        };
        Geometric3.prototype.mulByBivector = function (B) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mulByBivector(B));
            }
            else {
                this.uom = Unit_1.default.mul(this.uom, B.uom);
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.z;
                var a4 = this.xy;
                var a5 = this.yz;
                var a6 = this.zx;
                var a7 = this.b;
                var b4 = B.xy;
                var b5 = B.yz;
                var b6 = B.zx;
                this.a = -a4 * b4 - a5 * b5 - a6 * b6;
                this.x = -a2 * b4 + a3 * b6 - a7 * b5;
                this.y = +a1 * b4 - a3 * b5 - a7 * b6;
                this.z = -a1 * b6 + a2 * b5 - a7 * b4;
                this.xy = a0 * b4 - a5 * b6 + a6 * b5;
                this.yz = a0 * b5 + a4 * b6 - a6 * b4;
                this.zx = a0 * b6 - a4 * b5 + a5 * b4;
                this.b = +a1 * b5 + a2 * b6 + a3 * b4;
                return this;
            }
        };
        Geometric3.prototype.mulByVector = function (v) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mulByVector(v));
            }
            else {
                this.uom = Unit_1.default.mul(this.uom, v.uom);
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.z;
                var a4 = this.xy;
                var a5 = this.yz;
                var a6 = this.zx;
                var a7 = this.b;
                var b1 = v.x;
                var b2 = v.y;
                var b3 = v.z;
                this.a = a1 * b1 + a2 * b2 + a3 * b3;
                this.x = a0 * b1 + a4 * b2 - a6 * b3;
                this.y = a0 * b2 - a4 * b1 + a5 * b3;
                this.z = a0 * b3 - a5 * b2 + a6 * b1;
                this.xy = a1 * b2 - a2 * b1 + a7 * b3;
                this.yz = a2 * b3 - a3 * b2 + a7 * b1;
                this.zx = -a1 * b3 + a3 * b1 + a7 * b2;
                this.b = a4 * b3 + a5 * b1 + a6 * b2;
                return this;
            }
        };
        Geometric3.prototype.mul2 = function (a, b) {
            if (this.lock_ !== UNLOCKED) {
                throw new Error("TODO");
            }
            var a0 = a.a;
            var a1 = a.x;
            var a2 = a.y;
            var a3 = a.z;
            var a4 = a.xy;
            var a5 = a.yz;
            var a6 = a.zx;
            var a7 = a.b;
            var b0 = b.a;
            var b1 = b.x;
            var b2 = b.y;
            var b3 = b.z;
            var b4 = b.xy;
            var b5 = b.yz;
            var b6 = b.zx;
            var b7 = b.b;
            this.a = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
            this.x = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
            this.y = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
            this.z = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
            this.xy = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
            this.yz = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
            this.zx = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
            this.b = mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
            this.uom = Unit_1.default.mul(a.uom, b.uom);
            return this;
        };
        Geometric3.prototype.neg = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().neg());
            }
            else {
                this.a = -this.a;
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
                this.yz = -this.yz;
                this.zx = -this.zx;
                this.xy = -this.xy;
                this.b = -this.b;
                return this;
            }
        };
        Geometric3.prototype.norm = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().norm());
            }
            else {
                this.a = this.magnitudeSansUnits();
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
                return this;
            }
        };
        Geometric3.prototype.one = function () {
            this.a = 1;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            this.uom = void 0;
            return this;
        };
        Geometric3.prototype.quaditude = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().quaditude());
            }
            else {
                this.a = this.squaredNormSansUnits();
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
                this.uom = Unit_1.default.mul(this.uom, this.uom);
                return this;
            }
        };
        Geometric3.prototype.rco = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().rco(m));
            }
            else {
                return this.rco2(this, m);
            }
        };
        Geometric3.prototype.rco2 = function (a, b) {
            return rcoG3_1.default(a, b, this);
        };
        Geometric3.prototype.squaredNorm = function () {
            return this.quaditude();
        };
        Geometric3.prototype.squaredNormSansUnits = function () {
            return squaredNormG3_1.default(this);
        };
        Geometric3.prototype.reflect = function (n) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().reflect(n));
            }
            else {
                Unit_1.default.assertDimensionless(n.uom);
                var n1 = n.x;
                var n2 = n.y;
                var n3 = n.z;
                var n11 = n1 * n1;
                var n22 = n2 * n2;
                var n33 = n3 * n3;
                var nn = n11 + n22 + n33;
                var f1 = 2 * n2 * n3;
                var f2 = 2 * n3 * n1;
                var f3 = 2 * n1 * n2;
                var t1 = n22 + n33 - n11;
                var t2 = n33 + n11 - n22;
                var t3 = n11 + n22 - n33;
                var cs = this.coords_;
                var a = cs[COORD_SCALAR];
                var x1 = cs[COORD_X];
                var x2 = cs[COORD_Y];
                var x3 = cs[COORD_Z];
                var B3 = cs[COORD_XY];
                var B1 = cs[COORD_YZ];
                var B2 = cs[COORD_ZX];
                var b = cs[COORD_PSEUDO];
                this.setCoordinate(COORD_SCALAR, -nn * a, 'a');
                this.setCoordinate(COORD_X, x1 * t1 - x2 * f3 - x3 * f2, 'x');
                this.setCoordinate(COORD_Y, x2 * t2 - x3 * f1 - x1 * f3, 'y');
                this.setCoordinate(COORD_Z, x3 * t3 - x1 * f2 - x2 * f1, 'z');
                this.setCoordinate(COORD_XY, B3 * t3 - B1 * f2 - B2 * f1, 'xy');
                this.setCoordinate(COORD_YZ, B1 * t1 - B2 * f3 - B3 * f2, 'yz');
                this.setCoordinate(COORD_ZX, B2 * t2 - B3 * f1 - B1 * f3, 'zx');
                this.setCoordinate(COORD_PSEUDO, -nn * b, 'b');
                return this;
            }
        };
        Geometric3.prototype.rev = function () {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().rev());
            }
            else {
                this.a = +this.a;
                this.x = +this.x;
                this.y = +this.y;
                this.z = +this.z;
                this.yz = -this.yz;
                this.zx = -this.zx;
                this.xy = -this.xy;
                this.b = -this.b;
                return this;
            }
        };
        Geometric3.prototype.rotate = function (R) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().rotate(R));
            }
            else {
                Unit_1.default.assertDimensionless(R.uom);
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var a = R.xy;
                var b = R.yz;
                var c = R.zx;
                var α = R.a;
                var ix = α * x - c * z + a * y;
                var iy = α * y - a * x + b * z;
                var iz = α * z - b * y + c * x;
                var iα = b * x + c * y + a * z;
                this.x = ix * α + iα * b + iy * a - iz * c;
                this.y = iy * α + iα * c + iz * b - ix * a;
                this.z = iz * α + iα * a + ix * c - iy * b;
                return this;
            }
        };
        Geometric3.prototype.rotorFromAxisAngle = function (axis, θ) {
            Unit_1.default.assertDimensionless(axis.uom);
            var x = axis.x;
            var y = axis.y;
            var z = axis.z;
            var squaredNorm = x * x + y * y + z * z;
            if (squaredNorm === 1) {
                return this.rotorFromGeneratorAngle({ yz: x, zx: y, xy: z, uom: void 0 }, θ);
            }
            else {
                var norm = Math.sqrt(squaredNorm);
                var yz = x / norm;
                var zx = y / norm;
                var xy = z / norm;
                return this.rotorFromGeneratorAngle({ yz: yz, zx: zx, xy: xy, uom: void 0 }, θ);
            }
        };
        Geometric3.prototype.rotorFromDirections = function (a, b) {
            var B = void 0;
            return this.rotorFromVectorToVector(a, b, B);
        };
        Geometric3.prototype.rotorFromTwoVectors = function (e1, f1, e2, f2) {
            var R1 = Geometric3.rotorFromDirections(e1, f1);
            var f = Geometric3.fromVector(e2).rotate(R1);
            var B = Geometric3.dualOfVector(f1);
            var R2 = Geometric3.rotorFromVectorToVector(f, f2, B);
            return this.mul2(R2, R1);
        };
        Geometric3.prototype.rotorFromFrameToFrame = function (es, fs) {
            var biggestValue = -1;
            var firstVector;
            for (var i = 0; i < 3; i++) {
                cosines[i] = cosVectorVector(es[i], fs[i]);
                if (cosines[i] > biggestValue) {
                    firstVector = i;
                    biggestValue = cosines[i];
                }
            }
            var secondVector = (firstVector + 1) % 3;
            return this.rotorFromTwoVectors(es[firstVector], fs[firstVector], es[secondVector], fs[secondVector]);
        };
        Geometric3.prototype.rotorFromGeneratorAngle = function (B, θ) {
            Unit_1.default.assertDimensionless(B.uom);
            var φ = θ / 2;
            var yz = B.yz;
            var zx = B.zx;
            var xy = B.xy;
            var absB = Math.sqrt(yz * yz + zx * zx + xy * xy);
            var mφ = absB * φ;
            var sinDivAbsB = Math.sin(mφ) / absB;
            this.a = Math.cos(mφ);
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = -yz * sinDivAbsB;
            this.zx = -zx * sinDivAbsB;
            this.xy = -xy * sinDivAbsB;
            this.b = 0;
            return this;
        };
        Geometric3.prototype.rotorFromVectorToVector = function (a, b, B) {
            rotorFromDirectionsE3_1.default(a, b, B, this);
            return this;
        };
        Geometric3.prototype.scp = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().scp(m));
            }
            else {
                return this.scp2(this, m);
            }
        };
        Geometric3.prototype.scp2 = function (a, b) {
            return scpG3_1.default(a, b, this);
        };
        Geometric3.prototype.mulByNumber = function (α) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mulByNumber(α));
            }
            else {
                this.a *= α;
                this.x *= α;
                this.y *= α;
                this.z *= α;
                this.yz *= α;
                this.zx *= α;
                this.xy *= α;
                this.b *= α;
                return this;
            }
        };
        Geometric3.prototype.mulByScalar = function (α, uom) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().mulByScalar(α, uom));
            }
            else {
                this.a *= α;
                this.x *= α;
                this.y *= α;
                this.z *= α;
                this.yz *= α;
                this.zx *= α;
                this.xy *= α;
                this.b *= α;
                this.uom = Unit_1.default.mul(this.uom, uom);
                return this;
            }
        };
        Geometric3.prototype.stress = function (σ) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().stress(σ));
            }
            else {
                this.x *= σ.x;
                this.y *= σ.y;
                this.z *= σ.z;
                this.uom = Unit_1.default.mul(σ.uom, this.uom);
                return this;
            }
        };
        Geometric3.prototype.versor = function (a, b) {
            this.uom = Unit_1.default.mul(a.uom, b.uom);
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            this.zero();
            this.a = dotVectorE3_1.default(a, b);
            this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return this;
        };
        Geometric3.prototype.writeVector = function (vector) {
            vector.x = this.x;
            vector.y = this.y;
            vector.z = this.z;
            vector.uom = this.uom;
        };
        Geometric3.prototype.sub = function (M, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().sub(M, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = M.uom;
                }
                else if (isZeroGeometricE3_1.default(M)) {
                    return this;
                }
                else {
                    this.uom = compatibleUnit(this, M);
                }
                this.a -= M.a * α;
                this.x -= M.x * α;
                this.y -= M.y * α;
                this.z -= M.z * α;
                this.yz -= M.yz * α;
                this.zx -= M.zx * α;
                this.xy -= M.xy * α;
                this.b -= M.b * α;
                return this;
            }
        };
        Geometric3.prototype.subScalar = function (M, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().subScalar(M, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = M.uom;
                }
                else {
                    this.uom = Unit_1.default.compatible(this.uom, M.uom);
                }
                this.a -= M.a * α;
                return this;
            }
        };
        Geometric3.prototype.subVector = function (v, α) {
            if (α === void 0) { α = 1; }
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().subVector(v, α));
            }
            else {
                if (this.isZero()) {
                    this.uom = v.uom;
                }
                else if (isZeroVectorE3_1.default(v)) {
                    return this;
                }
                else {
                    this.uom = Unit_1.default.compatible(this.uom, v.uom);
                }
                this.x -= v.x * α;
                this.y -= v.y * α;
                this.z -= v.z * α;
                return this;
            }
        };
        Geometric3.prototype.sub2 = function (a, b) {
            if (isZeroGeometricE3_1.default(a)) {
                this.a = -b.a;
                this.x = -b.x;
                this.y = -b.y;
                this.z = -b.z;
                this.yz = -b.yz;
                this.zx = -b.zx;
                this.xy = -b.xy;
                this.b = -b.b;
                this.uom = b.uom;
            }
            else if (isZeroGeometricE3_1.default(b)) {
                this.a = a.a;
                this.x = a.x;
                this.y = a.y;
                this.z = a.z;
                this.yz = a.yz;
                this.zx = a.zx;
                this.xy = a.xy;
                this.b = a.b;
                this.uom = a.uom;
            }
            else {
                this.a = a.a - b.a;
                this.x = a.x - b.x;
                this.y = a.y - b.y;
                this.z = a.z - b.z;
                this.yz = a.yz - b.yz;
                this.zx = a.zx - b.zx;
                this.xy = a.xy - b.xy;
                this.b = a.b - b.b;
                this.uom = compatibleUnit(a, b);
            }
            return this;
        };
        Geometric3.prototype.toExponential = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS, this.uom);
        };
        Geometric3.prototype.toFixed = function (fractionDigits) {
            var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS, this.uom);
        };
        Geometric3.prototype.toPrecision = function (precision) {
            var coordToString = function (coord) { return coord.toPrecision(precision); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS, this.uom);
        };
        Geometric3.prototype.toString = function (radix) {
            var coordToString = function (coord) { return coord.toString(radix); };
            return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS, this.uom);
        };
        Geometric3.prototype.grade = function (n) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().grade(n));
            }
            else {
                switch (n) {
                    case 0: {
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.b = 0;
                        break;
                    }
                    case 1: {
                        this.a = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.b = 0;
                        break;
                    }
                    case 2: {
                        this.a = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.b = 0;
                        break;
                    }
                    case 3: {
                        this.a = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        break;
                    }
                    default: {
                        this.a = 0;
                        this.x = 0;
                        this.y = 0;
                        this.z = 0;
                        this.yz = 0;
                        this.zx = 0;
                        this.xy = 0;
                        this.b = 0;
                    }
                }
                return this;
            }
        };
        Geometric3.prototype.ext = function (m) {
            if (this.lock_ !== UNLOCKED) {
                return lock(this.clone().ext(m));
            }
            else {
                return this.ext2(this, m);
            }
        };
        Geometric3.prototype.ext2 = function (a, b) {
            return extG3_1.default(a, b, this);
        };
        Geometric3.prototype.zero = function () {
            this.a = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            return this;
        };
        Geometric3.prototype.__add__ = function (rhs) {
            var duckR = maskG3_1.default(rhs);
            if (duckR) {
                return lock(this.clone().add(duckR));
            }
            else if (isVectorE3_1.default(rhs)) {
                return lock(this.clone().addVector(rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__div__ = function (rhs) {
            var duckR = maskG3_1.default(rhs);
            if (duckR) {
                return lock(this.clone().div(duckR));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).div(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs, void 0).div(this));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__mul__ = function (rhs) {
            var duckR = maskG3_1.default(rhs);
            if (duckR) {
                return lock(this.clone().mul(duckR));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).mul(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.copy(this).mulByNumber(lhs));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).add(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).add(this));
            }
            else if (isVectorE3_1.default(lhs)) {
                return lock(Geometric3.fromVector(lhs).add(this));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__sub__ = function (rhs) {
            var duckR = maskG3_1.default(rhs);
            if (duckR) {
                return lock(this.clone().sub(duckR));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).sub(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).sub(this));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__tilde__ = function () {
            return lock(Geometric3.copy(this).rev());
        };
        Geometric3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return lock(Geometric3.copy(this).ext(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock(Geometric3.copy(this).mulByNumber(rhs));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).ext(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.copy(this).mulByNumber(lhs));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return lock(Geometric3.copy(this).lco(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock(Geometric3.copy(this).lco(Geometric3.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).lco(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).lco(this));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return lock(Geometric3.copy(this).rco(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock(Geometric3.copy(this).rco(Geometric3.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).rco(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).rco(this));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof Geometric3) {
                return lock(Geometric3.copy(this).scp(rhs));
            }
            else if (typeof rhs === 'number') {
                return lock(Geometric3.copy(this).scp(Geometric3.scalar(rhs)));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof Geometric3) {
                return lock(Geometric3.copy(lhs).scp(this));
            }
            else if (typeof lhs === 'number') {
                return lock(Geometric3.scalar(lhs).scp(this));
            }
            else {
                return void 0;
            }
        };
        Geometric3.prototype.__bang__ = function () {
            return lock(Geometric3.copy(this).inv());
        };
        Geometric3.prototype.__pos__ = function () {
            return lock(Geometric3.copy(this));
        };
        Geometric3.prototype.__neg__ = function () {
            return lock(Geometric3.copy(this).neg());
        };
        Geometric3.bivector = function (yz, zx, xy, uom) {
            return Geometric3.spinor(0, yz, zx, xy, uom);
        };
        Geometric3.copy = function (mv) {
            return new Geometric3(coordinates(mv), mv.uom);
        };
        Geometric3.dual = function (m) {
            return new Geometric3(zero(), m.uom).dual(m);
        };
        Geometric3.dualOfBivector = function (B) {
            return new Geometric3(vector(-B.yz, -B.zx, -B.xy), B.uom);
        };
        Geometric3.dualOfVector = function (v) {
            return new Geometric3(bivector(v.x, v.y, v.z), v.uom);
        };
        Geometric3.fromBivector = function (B) {
            return new Geometric3(bivector(B.yz, B.zx, B.xy), B.uom);
        };
        Geometric3.fromScalar = function (alpha) {
            return new Geometric3(scalar(alpha.a), alpha.uom);
        };
        Geometric3.fromSpinor = function (R) {
            return new Geometric3(spinor(R.a, R.yz, R.zx, R.xy), R.uom);
        };
        Geometric3.fromVector = function (v) {
            return new Geometric3(vector(v.x, v.y, v.z), v.uom);
        };
        Geometric3.lerp = function (A, B, α) {
            return Geometric3.copy(A).lerp(B, α);
        };
        Geometric3.pseudo = function (b, uom) {
            return new Geometric3(pseudo(b), uom);
        };
        Geometric3.random = function () {
            var lowerBound = -1;
            var upperBound = +1;
            var a = randomRange_1.default(lowerBound, upperBound);
            var x = randomRange_1.default(lowerBound, upperBound);
            var y = randomRange_1.default(lowerBound, upperBound);
            var z = randomRange_1.default(lowerBound, upperBound);
            var yz = randomRange_1.default(lowerBound, upperBound);
            var zx = randomRange_1.default(lowerBound, upperBound);
            var xy = randomRange_1.default(lowerBound, upperBound);
            var b = randomRange_1.default(lowerBound, upperBound);
            return new Geometric3(multivector(a, x, y, z, yz, zx, xy, b), void 0);
        };
        Geometric3.rotorFromDirections = function (a, b) {
            return new Geometric3(zero(), void 0).rotorFromDirections(a, b);
        };
        Geometric3.rotorFromFrameToFrame = function (es, fs) {
            return new Geometric3(zero(), void 0).rotorFromFrameToFrame(es, fs);
        };
        Geometric3.rotorFromVectorToVector = function (a, b, B) {
            return new Geometric3(zero(), void 0).rotorFromVectorToVector(a, b, B);
        };
        Geometric3.scalar = function (a, uom) {
            return new Geometric3(scalar(a), uom);
        };
        Geometric3.spinor = function (a, yz, zx, xy, uom) {
            return new Geometric3(spinor(a, yz, zx, xy), uom);
        };
        Geometric3.vector = function (x, y, z, uom) {
            return new Geometric3(vector(x, y, z), uom);
        };
        Geometric3.wedge = function (a, b) {
            var ax = a.x;
            var ay = a.y;
            var az = a.z;
            var bx = b.x;
            var by = b.y;
            var bz = b.z;
            var yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
            var zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
            var xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
            return Geometric3.spinor(0, yz, zx, xy, Unit_1.default.mul(a.uom, b.uom));
        };
        return Geometric3;
    }());
    Geometric3.zero = lock(new Geometric3(zero(), void 0));
    Geometric3.one = lock(new Geometric3(scalar(1), void 0));
    Geometric3.e1 = lock(new Geometric3(vector(1, 0, 0), void 0));
    Geometric3.e2 = lock(new Geometric3(vector(0, 1, 0), void 0));
    Geometric3.e3 = lock(new Geometric3(vector(0, 0, 1), void 0));
    Geometric3.I = lock(new Geometric3(pseudo(1), void 0));
    Geometric3.meter = lock(new Geometric3(scalar(1), Unit_1.default.METER));
    Geometric3.kilogram = lock(new Geometric3(scalar(1), Unit_1.default.KILOGRAM));
    Geometric3.second = lock(new Geometric3(scalar(1), Unit_1.default.SECOND));
    Geometric3.ampere = lock(new Geometric3(scalar(1), Unit_1.default.AMPERE));
    Geometric3.kelvin = lock(new Geometric3(scalar(1), Unit_1.default.KELVIN));
    Geometric3.mole = lock(new Geometric3(scalar(1), Unit_1.default.MOLE));
    Geometric3.candela = lock(new Geometric3(scalar(1), Unit_1.default.CANDELA));
    exports.Geometric3 = Geometric3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Geometric3;
});

define('davinci-newton/checks/mustBeDefined',["require", "exports", "../checks/mustSatisfy", "../checks/isDefined"], function (require, exports, mustSatisfy_1, isDefined_1) {
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

define('davinci-newton/checks/isInteger',["require", "exports", "../checks/isNumber"], function (require, exports, isNumber_1) {
    "use strict";
    function isInteger(x) {
        return isNumber_1.default(x) && x % 1 === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isInteger;
});

define('davinci-newton/checks/mustBeInteger',["require", "exports", "../checks/mustSatisfy", "../checks/isInteger"], function (require, exports, mustSatisfy_1, isInteger_1) {
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

define('davinci-newton/checks/mustBeNumber',["require", "exports", "../checks/mustSatisfy", "../checks/isNumber"], function (require, exports, mustSatisfy_1, isNumber_1) {
    "use strict";
    function beANumber() {
        return "be a `number`";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isNumber_1.default(value), beANumber, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-newton/checks/expectArg',["require", "exports", "../checks/isUndefined", "../checks/mustBeNumber"], function (require, exports, isUndefined_1, mustBeNumber_1) {
    "use strict";
    function message(standard, override) {
        return isUndefined_1.default(override) ? standard : override();
    }
    function expectArg(name, value) {
        var arg = {
            toSatisfy: function (condition, message) {
                if (isUndefined_1.default(condition)) {
                    throw new Error("condition must be specified");
                }
                if (isUndefined_1.default(message)) {
                    throw new Error("message must be specified");
                }
                if (!condition) {
                    throw new Error(message);
                }
                return arg;
            },
            toBeBoolean: function (override) {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'boolean') {
                    throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a boolean.", override));
                }
                return arg;
            },
            toBeDefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue === 'undefined') {
                    var message_1 = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
                    throw new Error(message_1);
                }
                return arg;
            },
            toBeInClosedInterval: function (lower, upper) {
                var something = value;
                var x = something;
                mustBeNumber_1.default('x', x);
                if (x >= lower && x <= upper) {
                    return arg;
                }
                else {
                    var message_2 = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
                    throw new Error(message_2);
                }
            },
            toBeFunction: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'function') {
                    var message_3 = "Expecting argument " + name + ": " + typeOfValue + " to be a function.";
                    throw new Error(message_3);
                }
                return arg;
            },
            toBeNumber: function (override) {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'number') {
                    throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a number.", override));
                }
                return arg;
            },
            toBeObject: function (override) {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'object') {
                    throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be an object.", override));
                }
                return arg;
            },
            toBeString: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'string') {
                    var message_4 = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
                    throw new Error(message_4);
                }
                return arg;
            },
            toBeUndefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'undefined') {
                    var message_5 = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
                    throw new Error(message_5);
                }
                return arg;
            },
            toNotBeNull: function () {
                if (value === null) {
                    var message_6 = "Expecting argument " + name + " to not be null.";
                    throw new Error(message_6);
                }
                else {
                    return arg;
                }
            },
            get value() {
                return value;
            }
        };
        return arg;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = expectArg;
});

define('davinci-newton/math/AbstractMatrix',["require", "exports", "../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/expectArg", "./Unit"], function (require, exports, mustBeDefined_1, mustBeInteger_1, expectArg_1, Unit_1) {
    "use strict";
    var AbstractMatrix = (function () {
        function AbstractMatrix(elements, dimensions, uom) {
            this._elements = mustBeDefined_1.default('elements', elements);
            this._dimensions = mustBeInteger_1.default('dimensions', dimensions);
            this._length = dimensions * dimensions;
            expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
            this.modified = false;
            this.uom = Unit_1.default.mustBeUnit('uom', uom);
        }
        Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
            get: function () {
                return this._dimensions;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "elements", {
            get: function () {
                return this._elements;
            },
            set: function (elements) {
                expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
                this._elements = elements;
            },
            enumerable: true,
            configurable: true
        });
        AbstractMatrix.prototype.copy = function (source) {
            var N = this.dimensions;
            for (var i = 0; i < N; i++) {
                for (var j = 0; j < N; j++) {
                    var value = source.getElement(i, j);
                    this.setElement(i, j, value);
                }
            }
            this.uom = source.uom;
            return this;
        };
        AbstractMatrix.prototype.getElement = function (row, column) {
            return this.elements[row + column * this._dimensions];
        };
        AbstractMatrix.prototype.isOne = function () {
            for (var i = 0; i < this._dimensions; i++) {
                for (var j = 0; j < this._dimensions; j++) {
                    var value = this.getElement(i, j);
                    if (i === j) {
                        if (value !== 1) {
                            return false;
                        }
                    }
                    else {
                        if (value !== 0) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };
        AbstractMatrix.prototype.setElement = function (row, column, value) {
            this.elements[row + column * this._dimensions] = value;
        };
        return AbstractMatrix;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractMatrix;
});

define('davinci-newton/math/det3x3',["require", "exports"], function (require, exports) {
    "use strict";
    function det3x3(m) {
        var m00 = m[0x0], m01 = m[0x3], m02 = m[0x6];
        var m10 = m[0x1], m11 = m[0x4], m12 = m[0x7];
        var m20 = m[0x2], m21 = m[0x5], m22 = m[0x8];
        return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = det3x3;
});

define('davinci-newton/math/inv3x3',["require", "exports", "../math/det3x3"], function (require, exports, det3x3_1) {
    "use strict";
    function inv3x3(m, te) {
        var det = det3x3_1.default(m);
        var m11 = m[0x0], m12 = m[0x3], m13 = m[0x6];
        var m21 = m[0x1], m22 = m[0x4], m23 = m[0x7];
        var m31 = m[0x2], m32 = m[0x5], m33 = m[0x8];
        var o11 = m22 * m33 - m23 * m32;
        var o12 = m13 * m32 - m12 * m33;
        var o13 = m12 * m23 - m13 * m22;
        var o21 = m23 * m31 - m21 * m33;
        var o22 = m11 * m33 - m13 * m31;
        var o23 = m13 * m21 - m11 * m23;
        var o31 = m21 * m32 - m22 * m31;
        var o32 = m12 * m31 - m11 * m32;
        var o33 = m11 * m22 - m12 * m21;
        var α = 1 / det;
        te[0x0] = o11 * α;
        te[0x3] = o12 * α;
        te[0x6] = o13 * α;
        te[0x1] = o21 * α;
        te[0x4] = o22 * α;
        te[0x7] = o23 * α;
        te[0x2] = o31 * α;
        te[0x5] = o32 * α;
        te[0x8] = o33 * α;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = inv3x3;
});

define('davinci-newton/math/mul3x3',["require", "exports"], function (require, exports) {
    "use strict";
    function mul3x3(a, b, c) {
        var a11 = a[0x0], a12 = a[0x3], a13 = a[0x6];
        var a21 = a[0x1], a22 = a[0x4], a23 = a[0x7];
        var a31 = a[0x2], a32 = a[0x5], a33 = a[0x8];
        var b11 = b[0x0], b12 = b[0x3], b13 = b[0x6];
        var b21 = b[0x1], b22 = b[0x4], b23 = b[0x7];
        var b31 = b[0x2], b32 = b[0x5], b33 = b[0x8];
        c[0x0] = a11 * b11 + a12 * b21 + a13 * b31;
        c[0x3] = a11 * b12 + a12 * b22 + a13 * b32;
        c[0x6] = a11 * b13 + a12 * b23 + a13 * b33;
        c[0x1] = a21 * b11 + a22 * b21 + a23 * b31;
        c[0x4] = a21 * b12 + a22 * b22 + a23 * b32;
        c[0x7] = a21 * b13 + a22 * b23 + a23 * b33;
        c[0x2] = a31 * b11 + a32 * b21 + a33 * b31;
        c[0x5] = a31 * b12 + a32 * b22 + a33 * b32;
        c[0x8] = a31 * b13 + a32 * b23 + a33 * b33;
        return c;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mul3x3;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/math/Matrix3',["require", "exports", "./AbstractMatrix", "./inv3x3", "./mul3x3"], function (require, exports, AbstractMatrix_1, inv3x3_1, mul3x3_1) {
    "use strict";
    var Matrix3 = (function (_super) {
        __extends(Matrix3, _super);
        function Matrix3(elements, uom) {
            return _super.call(this, elements, 3, uom) || this;
        }
        Matrix3.prototype.inv = function () {
            inv3x3_1.default(this.elements, this.elements);
            return this;
        };
        Matrix3.prototype.mul = function (rhs) {
            return this.mul2(this, rhs);
        };
        Matrix3.prototype.rmul = function (lhs) {
            mul3x3_1.default(lhs.elements, this.elements, this.elements);
            return this;
        };
        Matrix3.prototype.mul2 = function (a, b) {
            mul3x3_1.default(a.elements, b.elements, this.elements);
            return this;
        };
        Matrix3.prototype.rotation = function (spinor) {
            var x = -spinor.yz;
            var y = -spinor.zx;
            var z = -spinor.xy;
            var α = spinor.a;
            var x2 = x + x;
            var y2 = y + y;
            var z2 = z + z;
            var xx = x * x2;
            var xy = x * y2;
            var xz = x * z2;
            var yy = y * y2;
            var yz = y * z2;
            var zz = z * z2;
            var wx = α * x2;
            var wy = α * y2;
            var wz = α * z2;
            this.set(1 - yy - zz, xy - wz, xz + wy, xy + wz, 1 - xx - zz, yz - wx, xz - wy, yz + wx, 1 - xx - yy);
            return this;
        };
        Matrix3.prototype.row = function (i) {
            var te = this.elements;
            return [te[0 + i], te[3 + i], te[6 + i]];
        };
        Matrix3.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
            var te = this.elements;
            te[0] = n11;
            te[3] = n12;
            te[6] = n13;
            te[1] = n21;
            te[4] = n22;
            te[7] = n23;
            te[2] = n31;
            te[5] = n32;
            te[8] = n33;
            return this;
        };
        Matrix3.prototype.toString = function (radix) {
            var text = [];
            for (var i = 0; i < this.dimensions; i++) {
                text.push(this.row(i).map(function (element, index) { return element.toString(radix); }).join(' '));
            }
            return text.join('\n');
        };
        Matrix3.prototype.transpose = function () {
            var tmp;
            var m = this.elements;
            tmp = m[1];
            m[1] = m[3];
            m[3] = tmp;
            tmp = m[2];
            m[2] = m[6];
            m[6] = tmp;
            tmp = m[5];
            m[5] = m[7];
            m[7] = tmp;
            return this;
        };
        Matrix3.one = function () {
            return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        Matrix3.zero = function () {
            return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        return Matrix3;
    }(AbstractMatrix_1.default));
    exports.Matrix3 = Matrix3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Matrix3;
});

define('davinci-newton/objects/AbstractSimObject',["require", "exports"], function (require, exports) {
    "use strict";
    var AbstractSimObject = (function () {
        function AbstractSimObject() {
            this.expireTime_ = Number.POSITIVE_INFINITY;
        }
        Object.defineProperty(AbstractSimObject.prototype, "expireTime", {
            get: function () {
                return this.expireTime_;
            },
            set: function (expireTime) {
                this.expireTime_ = expireTime;
            },
            enumerable: true,
            configurable: true
        });
        return AbstractSimObject;
    }());
    exports.AbstractSimObject = AbstractSimObject;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractSimObject;
});

define('davinci-newton/math/isBivectorE3',["require", "exports", "../checks/isNull", "../checks/isNumber", "../checks/isObject"], function (require, exports, isNull_1, isNumber_1, isObject_1) {
    "use strict";
    function isBivectorE3(v) {
        if (isObject_1.default(v) && !isNull_1.default(v)) {
            return isNumber_1.default(v.xy) && isNumber_1.default(v.yz) && isNumber_1.default(v.zx);
        }
        else {
            return false;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isBivectorE3;
});

define('davinci-newton/math/mustBeBivectorE3',["require", "exports"], function (require, exports) {
    "use strict";
    function mustBeBivectorE3(name, B) {
        if (isNaN(B.yz) || isNaN(B.zx) || isNaN(B.xy)) {
            throw new Error(name + ", (" + B.yz + ", " + B.zx + ", " + B.xy + "), must be a BivectorE3.");
        }
        return B;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeBivectorE3;
});

define('davinci-newton/math/mustBeVectorE3',["require", "exports"], function (require, exports) {
    "use strict";
    function mustBeVectorE3(name, v) {
        if (isNaN(v.x) || isNaN(v.y) || isNaN(v.z)) {
            throw new Error(name + ", (" + v.x + ", " + v.y + ", " + v.z + "), must be a VectorE3.");
        }
        return v;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeVectorE3;
});

define('davinci-newton/math/wedge3',["require", "exports"], function (require, exports) {
    "use strict";
    function wedgeYZ(a, b) {
        return a.y * b.z - a.z * b.y;
    }
    exports.wedgeYZ = wedgeYZ;
    function wedgeZX(a, b) {
        return a.z * b.x - a.x * b.z;
    }
    exports.wedgeZX = wedgeZX;
    function wedgeXY(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    exports.wedgeXY = wedgeXY;
});

define('davinci-newton/math/Bivector3',["require", "exports", "./isBivectorE3", "../checks/isNumber", "./isVectorE3", "./mustBeBivectorE3", "../checks/mustBeNumber", "./mustBeVectorE3", "./Unit", "./wedge3"], function (require, exports, isBivectorE3_1, isNumber_1, isVectorE3_1, mustBeBivectorE3_1, mustBeNumber_1, mustBeVectorE3_1, Unit_1, wedge3_1) {
    "use strict";
    var Bivector3 = (function () {
        function Bivector3(yz, zx, xy, uom) {
            this.yz = mustBeNumber_1.default('yz', yz);
            this.zx = mustBeNumber_1.default('zx', zx);
            this.xy = mustBeNumber_1.default('xy', xy);
            this.uom = Unit_1.default.mustBeUnit('uom', uom);
        }
        Bivector3.prototype.add = function (B) {
            mustBeBivectorE3_1.default('B', B);
            this.yz += B.yz;
            this.zx += B.zx;
            this.xy += B.xy;
            this.uom = Unit_1.default.compatible(this.uom, B.uom);
            return this;
        };
        Bivector3.prototype.applyMatrix = function (σ) {
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var n11 = σ.getElement(0, 0), n12 = σ.getElement(0, 1), n13 = σ.getElement(0, 2);
            var n21 = σ.getElement(1, 0), n22 = σ.getElement(1, 1), n23 = σ.getElement(1, 2);
            var n31 = σ.getElement(2, 0), n32 = σ.getElement(2, 1), n33 = σ.getElement(2, 2);
            this.yz = n11 * x + n12 * y + n13 * z;
            this.zx = n21 * x + n22 * y + n23 * z;
            this.xy = n31 * x + n32 * y + n33 * z;
            return this;
        };
        Bivector3.prototype.copy = function (B) {
            mustBeBivectorE3_1.default('B', B);
            this.yz = B.yz;
            this.zx = B.zx;
            this.xy = B.xy;
            return this;
        };
        Bivector3.prototype.isZero = function () {
            return this.xy === 0 && this.yz === 0 && this.zx === 0;
        };
        Bivector3.prototype.rev = function () {
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            return this;
        };
        Bivector3.prototype.rotate = function (R) {
            if (R.a === 1 && R.xy === 0 && R.yz === 0 && R.zx === 0) {
                return this;
            }
            else {
                var yz = this.yz;
                var zx = this.zx;
                var xy = this.xy;
                var Rxy = R.xy;
                var Ryz = R.yz;
                var Rzx = R.zx;
                var Ra = R.a;
                var Syz = Ra * yz - Rzx * xy + Rxy * zx;
                var Szx = Ra * zx - Rxy * yz + Ryz * xy;
                var Sxy = Ra * xy - Ryz * zx + Rzx * yz;
                var Sa = Ryz * yz + Rzx * zx + Rxy * xy;
                this.yz = Syz * Ra + Sa * Ryz + Szx * Rxy - Sxy * Rzx;
                this.zx = Szx * Ra + Sa * Rzx + Sxy * Ryz - Syz * Rxy;
                this.xy = Sxy * Ra + Sa * Rxy + Syz * Rzx - Szx * Ryz;
                return this;
            }
        };
        Bivector3.prototype.sub = function (B) {
            mustBeBivectorE3_1.default('B', B);
            this.yz -= B.yz;
            this.zx -= B.zx;
            this.xy -= B.xy;
            return this;
        };
        Bivector3.prototype.toExponential = function (fractionDigits) {
            return "new Bivector3(yz: " + this.yz.toExponential(fractionDigits) + ", zx: " + this.zx.toExponential(fractionDigits) + ", xy: " + this.xy.toExponential(fractionDigits) + ")";
        };
        Bivector3.prototype.toFixed = function (fractionDigits) {
            return "new Bivector3(yz: " + this.yz.toFixed(fractionDigits) + ", zx: " + this.zx.toFixed(fractionDigits) + ", xy: " + this.xy.toFixed(fractionDigits) + ")";
        };
        Bivector3.prototype.toPrecision = function (precision) {
            return "new Bivector3(yz: " + this.yz.toPrecision(precision) + ", zx: " + this.zx.toPrecision(precision) + ", xy: " + this.xy.toPrecision(precision) + ")";
        };
        Bivector3.prototype.toString = function (radix) {
            return "new Bivector3(yz: " + this.yz.toString(radix) + ", zx: " + this.zx.toString(radix) + ", xy: " + this.xy.toString(radix) + ")";
        };
        Bivector3.prototype.wedge = function (a, b) {
            mustBeVectorE3_1.default('a', a);
            mustBeVectorE3_1.default('b', b);
            this.yz = wedge3_1.wedgeYZ(a, b);
            this.zx = wedge3_1.wedgeZX(a, b);
            this.xy = wedge3_1.wedgeXY(a, b);
            this.uom = Unit_1.default.mul(a.uom, b.uom);
            return this;
        };
        Bivector3.prototype.write = function (B) {
            B.xy = this.xy;
            B.yz = this.yz;
            B.zx = this.zx;
            B.uom = this.uom;
            return this;
        };
        Bivector3.prototype.zero = function () {
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        Bivector3.prototype.__add__ = function (rhs) {
            if (isBivectorE3_1.default(rhs) && !isVectorE3_1.default(rhs)) {
                var yz = this.yz + rhs.yz;
                var zx = this.zx + rhs.zx;
                var xy = this.xy + rhs.xy;
                var uom = Unit_1.default.compatible(this.uom, rhs.uom);
                return new Bivector3(yz, zx, xy, uom);
            }
            else {
                return void 0;
            }
        };
        Bivector3.prototype.__mul__ = function (rhs) {
            if (isNumber_1.default(rhs)) {
                var yz = this.yz * rhs;
                var zx = this.zx * rhs;
                var xy = this.xy * rhs;
                return new Bivector3(yz, zx, xy, this.uom);
            }
            else {
                return void 0;
            }
        };
        Bivector3.prototype.__rmul__ = function (lhs) {
            if (isNumber_1.default(lhs)) {
                var yz = lhs * this.yz;
                var zx = lhs * this.zx;
                var xy = lhs * this.xy;
                return new Bivector3(yz, zx, xy, this.uom);
            }
            else {
                return void 0;
            }
        };
        Bivector3.prototype.__sub__ = function (rhs) {
            if (isBivectorE3_1.default(rhs) && !isVectorE3_1.default(rhs)) {
                var yz = this.yz - rhs.yz;
                var zx = this.zx - rhs.zx;
                var xy = this.xy - rhs.xy;
                var uom = Unit_1.default.compatible(this.uom, rhs.uom);
                return new Bivector3(yz, zx, xy, uom);
            }
            else {
                return void 0;
            }
        };
        Bivector3.wedge = function (a, b) {
            return new Bivector3(0, 0, 0).wedge(a, b);
        };
        return Bivector3;
    }());
    exports.Bivector3 = Bivector3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Bivector3;
});

define('davinci-newton/math/Mat3',["require", "exports", "./Matrix3", "./Unit"], function (require, exports, Matrix3_1, Unit_1) {
    "use strict";
    var Mat3 = (function () {
        function Mat3(source) {
            this.data = Matrix3_1.default.one();
            var n11 = source.getElement(0, 0);
            var n12 = source.getElement(0, 1);
            var n13 = source.getElement(0, 2);
            var n21 = source.getElement(1, 0);
            var n22 = source.getElement(1, 1);
            var n23 = source.getElement(1, 2);
            var n31 = source.getElement(2, 0);
            var n32 = source.getElement(2, 1);
            var n33 = source.getElement(2, 2);
            this.data.set(n11, n12, n13, n21, n22, n23, n31, n32, n33);
            this.uom = Unit_1.default.mustBeUnit('uom', source.uom);
        }
        Object.defineProperty(Mat3.prototype, "dimensions", {
            get: function () {
                return 3;
            },
            enumerable: true,
            configurable: true
        });
        Mat3.prototype.getElement = function (row, column) {
            return this.data.getElement(row, column);
        };
        Mat3.prototype.row = function (i) {
            return this.data.row(i);
        };
        Mat3.prototype.toString = function (radix) {
            return this.data.toString(radix);
        };
        return Mat3;
    }());
    exports.Mat3 = Mat3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Mat3;
});

define('davinci-newton/checks/isFunction',["require", "exports"], function (require, exports) {
    "use strict";
    function isFunction(x) {
        return (typeof x === 'function');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isFunction;
});

define('davinci-newton/checks/mustBeFunction',["require", "exports", "../checks/mustSatisfy", "../checks/isFunction"], function (require, exports, mustSatisfy_1, isFunction_1) {
    "use strict";
    function beFunction() {
        return "be a function";
    }
    function mustBeFunction(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isFunction_1.default(value), beFunction, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeFunction;
});

define('davinci-newton/checks/mustBeNonNullObject',["require", "exports", "../checks/mustSatisfy", "../checks/isNull", "../checks/isObject"], function (require, exports, mustSatisfy_1, isNull_1, isObject_1) {
    "use strict";
    function beObject() {
        return "be a non-null `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isObject_1.default(value) && !isNull_1.default(value), beObject, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeObject;
});

define('davinci-newton/math/Scalar3',["require", "exports"], function (require, exports) {
    "use strict";
    var Scalar3 = (function () {
        function Scalar3(a, uom) {
            this.a_ = a;
            this.uom_ = uom;
        }
        Object.defineProperty(Scalar3.prototype, "a", {
            get: function () {
                return this.a_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scalar3.prototype, "uom", {
            get: function () {
                return this.uom_;
            },
            enumerable: true,
            configurable: true
        });
        Scalar3.prototype.mulByNumber = function (alpha) {
            return new Scalar3(alpha * this.a, this.uom);
        };
        return Scalar3;
    }());
    exports.Scalar3 = Scalar3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Scalar3;
});

define('davinci-newton/util/veryDifferent',["require", "exports"], function (require, exports) {
    "use strict";
    function veryDifferent(arg1, arg2, epsilon, magnitude) {
        if (epsilon === void 0) { epsilon = 1E-14; }
        if (magnitude === void 0) { magnitude = 1; }
        if (epsilon <= 0) {
            throw new Error("epsilon (" + epsilon + ") must be positive.");
        }
        if (magnitude <= 0) {
            throw new Error("magnitude (" + magnitude + ") must be positive.");
        }
        var maxArg = Math.max(Math.abs(arg1), Math.abs(arg2));
        var max = maxArg > magnitude ? maxArg : magnitude;
        return Math.abs(arg1 - arg2) > max * epsilon;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = veryDifferent;
});

define('davinci-newton/math/Vec3',["require", "exports", "../checks/mustBeNumber", "./Scalar3", "./Unit", "../util/veryDifferent"], function (require, exports, mustBeNumber_1, Scalar3_1, Unit_1, veryDifferent_1) {
    "use strict";
    var Vec3 = (function () {
        function Vec3(x, y, z, uom) {
            this.x_ = mustBeNumber_1.default('x', x);
            this.y_ = mustBeNumber_1.default('y', y);
            this.z_ = mustBeNumber_1.default('z', z);
            this.uom_ = Unit_1.default.mustBeUnit('uom', uom);
            if (this.uom_ && this.uom_.multiplier !== 1) {
                var multiplier = this.uom_.multiplier;
                this.x_ *= multiplier;
                this.y_ *= multiplier;
                this.z_ *= multiplier;
                this.uom_ = Unit_1.default.valueOf(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(Vec3.prototype, "x", {
            get: function () {
                return this.x_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "y", {
            get: function () {
                return this.y_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "z", {
            get: function () {
                return this.z_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3.prototype, "uom", {
            get: function () {
                return this.uom_;
            },
            enumerable: true,
            configurable: true
        });
        Vec3.prototype.add = function (rhs) {
            var uom = Unit_1.default.compatible(this.uom_, rhs.uom);
            return new Vec3(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z, uom);
        };
        Vec3.prototype.divByScalar = function (alpha) {
            return new Vec3(this.x / alpha, this.y / alpha, this.z / alpha, this.uom_);
        };
        Vec3.prototype.lco = function (B) {
            var ax = B.yz;
            var ay = B.zx;
            var az = B.xy;
            var bx = this.x;
            var by = this.y;
            var bz = this.z;
            var x = ay * bz - az * by;
            var y = az * bx - ax * bz;
            var z = ax * by - ay * bx;
            return new Vec3(x, y, z, Unit_1.default.mul(this.uom_, B.uom));
        };
        Vec3.prototype.subtract = function (rhs) {
            var uom = Unit_1.default.compatible(this.uom_, rhs.uom);
            return new Vec3(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z, uom);
        };
        Vec3.prototype.mulByScalar = function (alpha) {
            return new Vec3(alpha * this.x, alpha * this.y, alpha * this.z, this.uom_);
        };
        Vec3.prototype.cross = function (rhs) {
            var ax = this.x;
            var ay = this.y;
            var az = this.z;
            var bx = rhs.x;
            var by = rhs.y;
            var bz = rhs.z;
            var x = ay * bz - az * by;
            var y = az * bx - ax * bz;
            var z = ax * by - ay * bx;
            return new Vec3(x, y, z, Unit_1.default.mul(this.uom_, rhs.uom));
        };
        Vec3.prototype.distanceTo = function (point) {
            var Δx = this.x - point.x;
            var Δy = this.y - point.y;
            var Δz = this.z - point.z;
            var a = Math.sqrt(Δx * Δx + Δy * Δy + Δz * Δz);
            var uom = Unit_1.default.compatible(this.uom_, point.uom);
            return new Scalar3_1.default(a, uom);
        };
        Vec3.prototype.dot = function (v) {
            var a = this.x * v.x + this.y * v.y + this.z * v.z;
            var uom = Unit_1.default.mul(this.uom_, v.uom);
            return new Scalar3_1.default(a, uom);
        };
        Vec3.prototype.magnitude = function () {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return Math.sqrt(x * x + y * y + z * z);
        };
        Vec3.prototype.nearEqual = function (v, tolerance) {
            if (veryDifferent_1.default(this.x_, v.x, tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.y_, v.y, tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.z_, v.z, tolerance)) {
                return false;
            }
            return true;
        };
        Vec3.prototype.direction = function () {
            var magnitude = this.magnitude();
            if (magnitude !== 1) {
                if (magnitude === 0) {
                    throw new Error("direction is undefined.");
                }
                else {
                    return this.divByScalar(magnitude);
                }
            }
            else {
                return this;
            }
        };
        Vec3.prototype.rotate = function (R) {
            if (R.a === 1 && R.xy === 0 && R.yz === 0 && R.zx === 0) {
                return this;
            }
            else {
                var x = this.x;
                var y = this.y;
                var z = this.z;
                var a = R.xy;
                var b = R.yz;
                var c = R.zx;
                var w = R.a;
                var ix = w * x - c * z + a * y;
                var iy = w * y - a * x + b * z;
                var iz = w * z - b * y + c * x;
                var iw = b * x + c * y + a * z;
                var xPrimed = ix * w + iw * b + iy * a - iz * c;
                var yPrimed = iy * w + iw * c + iz * b - ix * a;
                var zPrimed = iz * w + iw * a + ix * c - iy * b;
                return new Vec3(xPrimed, yPrimed, zPrimed, this.uom_);
            }
        };
        Vec3.prototype.toString = function (radix) {
            return "new Vec3(" + this.x_.toString(radix) + ", " + this.y_.toString(radix) + ", " + this.z_.toString(radix) + ")";
        };
        Vec3.prototype.__add__ = function (rhs) {
            return this.add(rhs);
        };
        Vec3.prototype.__div__ = function (rhs) {
            return this.divByScalar(rhs);
        };
        Vec3.prototype.__mul__ = function (rhs) {
            return this.mulByScalar(rhs);
        };
        Vec3.prototype.__rmul__ = function (lhs) {
            return this.mulByScalar(lhs);
        };
        Vec3.prototype.__sub__ = function (rhs) {
            return this.subtract(rhs);
        };
        Vec3.fromVector = function (v) {
            return new Vec3(v.x, v.y, v.z, v.uom);
        };
        return Vec3;
    }());
    Vec3.e1 = new Vec3(1, 0, 0);
    Vec3.e2 = new Vec3(0, 1, 0);
    Vec3.e3 = new Vec3(0, 0, 1);
    Vec3.zero = new Vec3(0, 0, 0);
    exports.Vec3 = Vec3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vec3;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/RigidBody3',["require", "exports", "../objects/AbstractSimObject", "../math/Bivector3", "../math/Geometric3", "../math/Mat3", "../math/Matrix3", "../checks/mustBeFunction", "../checks/mustBeNonNullObject", "../checks/mustBeNumber", "../math/Unit", "../math/Vec3"], function (require, exports, AbstractSimObject_1, Bivector3_1, Geometric3_1, Mat3_1, Matrix3_1, mustBeFunction_1, mustBeNonNullObject_1, mustBeNumber_1, Unit_1, Vec3_1) {
    "use strict";
    function assertConsistentUnits(aName, A, bName, B) {
        if (!A.isZero() && !B.isZero()) {
            if (Unit_1.default.isOne(A.uom)) {
                if (!Unit_1.default.isOne(B.uom)) {
                    throw new Error(aName + " => " + A + " must have dimensions if " + bName + " => " + B + " has dimensions.");
                }
            }
            else {
                if (Unit_1.default.isOne(B.uom)) {
                    throw new Error(bName + " => " + B + " must have dimensions if " + aName + " => " + A + " has dimensions.");
                }
            }
        }
    }
    var RigidBody3 = (function (_super) {
        __extends(RigidBody3, _super);
        function RigidBody3() {
            var _this = _super.call(this) || this;
            _this.mass_ = Geometric3_1.default.scalar(1);
            _this.massLock_ = _this.mass_.lock();
            _this.charge_ = Geometric3_1.default.scalar(0);
            _this.chargeLock_ = _this.charge_.lock();
            _this.inertiaTensorInverse_ = new Mat3_1.default(Matrix3_1.default.one());
            _this.varsIndex_ = -1;
            _this.position_ = Geometric3_1.default.zero.clone();
            _this.attitude_ = Geometric3_1.default.one.clone();
            _this.linearMomentum_ = Geometric3_1.default.zero.clone();
            _this.angularMomentum_ = Geometric3_1.default.zero.clone();
            _this.Ω_ = new Bivector3_1.default(0, 0, 0);
            _this.Ω = Geometric3_1.default.bivector(0, 0, 0);
            _this.centerOfMassLocal_ = Vec3_1.default.zero;
            _this.rotationalEnergy_ = Geometric3_1.default.zero.clone();
            _this.rotationalEnergyLock_ = _this.rotationalEnergy_.lock();
            _this.translationalEnergy_ = Geometric3_1.default.zero.clone();
            _this.translationalEnergyLock_ = _this.translationalEnergy_.lock();
            _this.worldPoint_ = Geometric3_1.default.vector(0, 0, 0);
            return _this;
        }
        Object.defineProperty(RigidBody3.prototype, "centerOfMassLocal", {
            get: function () {
                return this.centerOfMassLocal_;
            },
            set: function (centerOfMassLocal) {
                this.centerOfMassLocal_ = Vec3_1.default.fromVector(centerOfMassLocal);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody3.prototype, "M", {
            get: function () {
                return this.mass_;
            },
            set: function (M) {
                this.mass_.unlock(this.massLock_);
                this.mass_.copy(M);
                this.massLock_ = this.mass_.lock();
                this.updateInertiaTensor();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody3.prototype, "Q", {
            get: function () {
                return this.charge_;
            },
            set: function (Q) {
                this.charge_.unlock(this.chargeLock_);
                this.charge_.copy(Q);
                this.chargeLock_ = this.charge_.lock();
            },
            enumerable: true,
            configurable: true
        });
        RigidBody3.prototype.updateAngularVelocity = function () {
            this.Ω.copy(this.L);
            this.Ω.rotate(this.R.rev());
            this.Ω_.copy(this.Ω);
            this.Ω_.applyMatrix(this.Iinv);
            this.Ω.copyBivector(this.Ω_);
            this.Ω.rotate(this.R.rev());
        };
        RigidBody3.prototype.updateInertiaTensor = function () {
        };
        Object.defineProperty(RigidBody3.prototype, "I", {
            get: function () {
                var I = Matrix3_1.default.zero().copy(this.inertiaTensorInverse_).inv();
                return new Mat3_1.default(I);
            },
            set: function (I) {
                var Iinv = Matrix3_1.default.zero().copy(I).inv();
                this.inertiaTensorInverse_ = new Mat3_1.default(Iinv);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody3.prototype, "Iinv", {
            get: function () {
                return this.inertiaTensorInverse_;
            },
            set: function (source) {
                mustBeNonNullObject_1.default('Iinv', source);
                mustBeNumber_1.default('dimensions', source.dimensions);
                mustBeFunction_1.default('getElement', source.getElement);
                this.inertiaTensorInverse_ = new Mat3_1.default(source);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody3.prototype, "X", {
            get: function () {
                return this.position_;
            },
            set: function (position) {
                this.position_.copy(position);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody3.prototype, "R", {
            get: function () {
                return this.attitude_;
            },
            set: function (attitude) {
                this.attitude_.copy(attitude);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody3.prototype, "P", {
            get: function () {
                return this.linearMomentum_;
            },
            set: function (momentum) {
                this.linearMomentum_.copy(momentum);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody3.prototype, "L", {
            get: function () {
                return this.angularMomentum_;
            },
            set: function (angularMomentum) {
                this.angularMomentum_.copy(angularMomentum);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody3.prototype, "expireTime", {
            get: function () {
                return Number.POSITIVE_INFINITY;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody3.prototype, "varsIndex", {
            get: function () {
                return this.varsIndex_;
            },
            set: function (index) {
                this.varsIndex_ = index;
            },
            enumerable: true,
            configurable: true
        });
        RigidBody3.prototype.rotationalEnergy = function () {
            assertConsistentUnits('Ω', this.Ω, 'L', this.L);
            this.rotationalEnergy_.unlock(this.rotationalEnergyLock_);
            this.rotationalEnergy_.copyBivector(this.Ω).rev().scp(this.L).mulByNumber(0.5);
            this.rotationalEnergyLock_ = this.rotationalEnergy_.lock();
            return this.rotationalEnergy_;
        };
        RigidBody3.prototype.translationalEnergy = function () {
            assertConsistentUnits('M', this.M, 'P', this.P);
            this.translationalEnergy_.unlock(this.translationalEnergyLock_);
            this.translationalEnergy_.copyVector(this.P).mulByVector(this.P).divByScalar(this.M.a, this.M.uom).mulByNumber(0.5);
            this.translationalEnergyLock_ = this.translationalEnergy_.lock();
            return this.translationalEnergy_;
        };
        RigidBody3.prototype.localPointToWorldPoint = function (localPoint, worldPoint) {
            this.worldPoint_.copyVector(localPoint).subVector(this.centerOfMassLocal_);
            this.worldPoint_.rotate(this.attitude_).addVector(this.position_);
            this.worldPoint_.writeVector(worldPoint);
        };
        return RigidBody3;
    }(AbstractSimObject_1.default));
    exports.RigidBody3 = RigidBody3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RigidBody3;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/Block3',["require", "exports", "../math/Geometric3", "../math/Matrix3", "./RigidBody3", "../math/Unit"], function (require, exports, Geometric3_1, Matrix3_1, RigidBody3_1, Unit_1) {
    "use strict";
    var Block3 = (function (_super) {
        __extends(Block3, _super);
        function Block3(width, height, depth) {
            if (width === void 0) { width = Geometric3_1.default.one; }
            if (height === void 0) { height = Geometric3_1.default.one; }
            if (depth === void 0) { depth = Geometric3_1.default.one; }
            var _this = _super.call(this) || this;
            _this.width_ = Geometric3_1.default.copy(width);
            _this.widthLock_ = _this.width_.lock();
            _this.height_ = Geometric3_1.default.copy(height);
            _this.heightLock_ = _this.height_.lock();
            _this.depth_ = Geometric3_1.default.copy(depth);
            _this.depthLock_ = _this.depth_.lock();
            _this.updateInertiaTensor();
            return _this;
        }
        Object.defineProperty(Block3.prototype, "width", {
            get: function () {
                return this.width_;
            },
            set: function (width) {
                this.width_.unlock(this.widthLock_);
                this.width_.copy(width);
                this.widthLock_ = this.width_.lock();
                this.updateInertiaTensor();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block3.prototype, "height", {
            get: function () {
                return this.height_;
            },
            set: function (height) {
                this.height_.unlock(this.heightLock_);
                this.height_.copy(height);
                this.heightLock_ = this.height_.lock();
                this.updateInertiaTensor();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Block3.prototype, "depth", {
            get: function () {
                return this.depth_;
            },
            set: function (depth) {
                this.depth_.unlock(this.depthLock_);
                this.depth_.copy(depth);
                this.depthLock_ = this.depth_.lock();
                this.updateInertiaTensor();
            },
            enumerable: true,
            configurable: true
        });
        Block3.prototype.updateAngularVelocity = function () {
            var w = this.width_;
            var h = this.height_;
            var d = this.depth_;
            var ww = w.a * w.a;
            var hh = h.a * h.a;
            var dd = d.a * d.a;
            var k = 12 / this.M.a;
            this.Ω.yz = k * this.L.yz / (hh + dd);
            this.Ω.zx = k * this.L.zx / (ww + dd);
            this.Ω.xy = k * this.L.xy / (ww + hh);
            this.Ω.uom = Unit_1.default.div(Unit_1.default.div(this.L.uom, this.M.uom), Unit_1.default.mul(w.uom, w.uom));
        };
        Block3.prototype.updateInertiaTensor = function () {
            var w = this.width_;
            var h = this.height_;
            var d = this.depth_;
            var ww = w.a * w.a;
            var hh = h.a * h.a;
            var dd = d.a * d.a;
            var s = this.M.a / 12;
            var I = Matrix3_1.default.zero();
            I.setElement(0, 0, s * (hh + dd));
            I.setElement(1, 1, s * (dd + ww));
            I.setElement(2, 2, s * (ww + hh));
            I.uom = Unit_1.default.mul(this.M.uom, Unit_1.default.mul(w.uom, w.uom));
            this.I = I;
        };
        return Block3;
    }(RigidBody3_1.default));
    exports.Block3 = Block3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Block3;
});

define('davinci-newton/util/UtilityCore',["require", "exports"], function (require, exports) {
    "use strict";
    var UtilityCore = (function () {
        function UtilityCore() {
        }
        return UtilityCore;
    }());
    UtilityCore.MAX_INTEGER = Math.pow(2, 53);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UtilityCore;
});

define('davinci-newton/util/CircularList',["require", "exports", "./UtilityCore"], function (require, exports, UtilityCore_1) {
    "use strict";
    var MAX_INDEX_ERROR = 'exceeded max int';
    var CircularList = (function () {
        function CircularList(capacity) {
            if (capacity === void 0) { capacity = 3000; }
            this.size_ = 0;
            this.cycles_ = 0;
            this.nextPtr_ = 0;
            this.lastPtr_ = -1;
            this.capacity_ = capacity || 3000;
            if (this.capacity_ < 2) {
                throw new Error();
            }
            this.size_ = 0;
            this.cycles_ = 0;
            this.nextPtr_ = 0;
            this.lastPtr_ = -1;
            this.values_ = new Array(this.capacity_);
            this.lastValue_ = null;
        }
        CircularList.prototype.causeMaxIntError = function () {
            this.size_ = this.capacity_;
            this.cycles_ = Math.floor(UtilityCore_1.default.MAX_INTEGER / this.capacity_) - 1;
        };
        CircularList.prototype.getEndIndex = function () {
            if (this.size_ === 0) {
                return -1;
            }
            var idx;
            if (this.nextPtr_ === 0)
                idx = this.pointerToIndex(this.size_ - 1);
            else
                idx = this.pointerToIndex(this.nextPtr_ - 1);
            return idx;
        };
        CircularList.prototype.getEndValue = function () {
            var idx = this.getEndIndex();
            return idx === -1 ? null : this.values_[this.indexToPointer_(idx)];
        };
        CircularList.prototype.getIterator = function (index) {
            return new CircularListIterator(this, index);
        };
        CircularList.prototype.getSize = function () {
            return this.size_;
        };
        CircularList.prototype.getStartIndex = function () {
            var idx = (this.size_ < this.capacity_) ? 0 : this.pointerToIndex(this.nextPtr_);
            return idx;
        };
        CircularList.prototype.getValue = function (index) {
            var i = this.indexToPointer_(index);
            return this.values_[i];
        };
        CircularList.prototype.indexToPointer_ = function (index) {
            if (this.size_ < this.capacity_)
                return index;
            var p = index % this.capacity_;
            var idx = index - (this.cycles_ - (p < this.nextPtr_ ? 0 : 1)) * this.capacity_;
            return idx;
        };
        CircularList.prototype.pointerToIndex = function (pointer) {
            if (this.size_ < this.capacity_)
                return pointer;
            var idx = pointer +
                (this.cycles_ - (pointer < this.nextPtr_ ? 0 : 1)) * this.capacity_;
            if (idx >= UtilityCore_1.default.MAX_INTEGER)
                throw new Error(MAX_INDEX_ERROR);
            return idx;
        };
        CircularList.prototype.reset = function () {
            this.nextPtr_ = this.size_ = 0;
            this.cycles_ = 0;
            this.lastPtr_ = -1;
        };
        CircularList.prototype.store = function (value) {
            this.lastPtr_ = this.nextPtr_;
            this.values_[this.nextPtr_] = value;
            this.nextPtr_++;
            if (this.size_ < this.capacity_)
                this.size_++;
            if (this.nextPtr_ >= this.capacity_) {
                this.cycles_++;
                this.nextPtr_ = 0;
            }
            return this.pointerToIndex(this.lastPtr_);
        };
        return CircularList;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CircularList;
    var CircularListIterator = (function () {
        function CircularListIterator(cList, startIndex) {
            this.cList = cList;
            this.first_ = cList.size_ > 0;
            this.cList_ = cList;
            if (startIndex === undefined || startIndex < 0) {
                startIndex = cList.getStartIndex();
            }
            if (cList.size_ > 0 &&
                (startIndex < cList.getStartIndex() || startIndex > cList.getEndIndex())) {
                throw new Error('out of range startIndex=' + startIndex);
            }
            this.index_ = startIndex;
            this.pointer_ = cList.indexToPointer_(startIndex);
        }
        CircularListIterator.prototype.getIndex = function () {
            if (this.cList_.size_ === 0) {
                throw new Error('no data');
            }
            return this.index_;
        };
        CircularListIterator.prototype.getValue = function () {
            if (this.cList_.size_ === 0) {
                throw new Error('no data');
            }
            return this.cList_.values_[this.pointer_];
        };
        CircularListIterator.prototype.hasNext = function () {
            return this.first_ || this.index_ < this.cList_.getEndIndex();
        };
        CircularListIterator.prototype.hasPrevious = function () {
            return this.first_ || this.index_ > this.cList_.getStartIndex();
        };
        CircularListIterator.prototype.nextValue = function () {
            if (this.cList_.size_ === 0)
                throw new Error('no data');
            if (this.first_) {
                this.first_ = false;
            }
            else {
                if (this.index_ + 1 > this.cList_.getEndIndex()) {
                    throw new Error('cannot iterate past end of list');
                }
                this.index_++;
                this.pointer_ = this.cList_.indexToPointer_(this.index_);
            }
            return this.cList_.values_[this.pointer_];
        };
        CircularListIterator.prototype.previousValue = function () {
            if (this.cList_.size_ === 0)
                throw new Error('no data');
            if (this.first_) {
                this.first_ = false;
            }
            else {
                if (this.index_ - 1 < this.cList_.getStartIndex()) {
                    throw new Error('cannot iterate prior to start of list');
                }
                this.index_--;
                this.pointer_ = this.cList_.indexToPointer_(this.index_);
            }
            return this.cList_.values_[this.pointer_];
        };
        return CircularListIterator;
    }());
});

define('davinci-newton/config',["require", "exports"], function (require, exports) {
    "use strict";
    var Newton = (function () {
        function Newton() {
            this.GITHUB = 'https://github.com/geometryzen/davinci-newton';
            this.LAST_MODIFIED = '2017-02-16';
            this.NAMESPACE = 'NEWTON';
            this.VERSION = '0.0.35';
        }
        Newton.prototype.log = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.log(message);
        };
        Newton.prototype.info = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.log(message);
        };
        Newton.prototype.warn = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.warn(message);
        };
        Newton.prototype.error = function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            console.error(message);
        };
        return Newton;
    }());
    var config = new Newton();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = config;
});

define('davinci-newton/solvers/ConstantEnergySolver',["require", "exports"], function (require, exports) {
    "use strict";
    var ConstantEnergySolver = (function () {
        function ConstantEnergySolver(simulation, energySystem, solverMethod) {
            this.stepUpperBound = 1;
            this.stepLowerBound = 1E-5;
            this.tolerance_ = 1E-6;
            this.simulation_ = simulation;
            this.energySystem_ = energySystem;
            this.solverMethod_ = solverMethod;
            this.totSteps_ = 0;
        }
        ConstantEnergySolver.prototype.step = function (Δt, uomTime) {
            this.savedState = this.simulation_.getState();
            var startTime = this.simulation_.time;
            var adaptedStepSize = Δt;
            var steps = 0;
            this.simulation_.epilog();
            var startEnergy = this.energySystem_.totalEnergy().a;
            var lastEnergyDiff = Number.POSITIVE_INFINITY;
            var value = Number.POSITIVE_INFINITY;
            var firstTime = true;
            if (Δt < this.stepLowerBound) {
                return;
            }
            do {
                var t = startTime;
                if (!firstTime) {
                    this.simulation_.setState(this.savedState);
                    this.simulation_.epilog();
                    adaptedStepSize = adaptedStepSize / 5;
                    if (adaptedStepSize < this.stepLowerBound) {
                        throw new Error("Unable to achieve tolerance " + this.tolerance + " with stepLowerBound " + this.stepLowerBound);
                    }
                }
                steps = 0;
                while (t < startTime + Δt) {
                    var h = adaptedStepSize;
                    if (t + h > startTime + Δt - 1E-10) {
                        h = startTime + Δt - t;
                    }
                    steps++;
                    this.solverMethod_.step(h, uomTime);
                    this.simulation_.epilog();
                    t += h;
                }
                var finishEnergy = this.energySystem_.totalEnergy().a;
                var energyDiff = Math.abs(startEnergy - finishEnergy);
                value = energyDiff;
                lastEnergyDiff = energyDiff;
                firstTime = false;
            } while (value > this.tolerance_);
            this.totSteps_ += steps;
        };
        Object.defineProperty(ConstantEnergySolver.prototype, "tolerance", {
            get: function () {
                return this.tolerance_;
            },
            set: function (value) {
                this.tolerance_ = value;
            },
            enumerable: true,
            configurable: true
        });
        return ConstantEnergySolver;
    }());
    exports.ConstantEnergySolver = ConstantEnergySolver;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConstantEnergySolver;
});

define('davinci-newton/model/CoordType',["require", "exports"], function (require, exports) {
    "use strict";
    var CoordType;
    (function (CoordType) {
        CoordType[CoordType["LOCAL"] = 0] = "LOCAL";
        CoordType[CoordType["WORLD"] = 1] = "WORLD";
    })(CoordType = exports.CoordType || (exports.CoordType = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CoordType;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/Force3',["require", "exports", "../objects/AbstractSimObject", "../math/Bivector3", "../model/CoordType", "../math/Geometric3"], function (require, exports, AbstractSimObject_1, Bivector3_1, CoordType_1, Geometric3_1) {
    "use strict";
    var Force3 = (function (_super) {
        __extends(Force3, _super);
        function Force3(body_) {
            var _this = _super.call(this) || this;
            _this.body_ = body_;
            _this.location = Geometric3_1.default.vector(0, 0, 0);
            _this.vector = Geometric3_1.default.vector(0, 0, 0);
            _this.position_ = Geometric3_1.default.vector(0, 0, 0);
            _this.force_ = Geometric3_1.default.vector(0, 0, 0);
            _this.torque_ = new Bivector3_1.default(0, 0, 0);
            return _this;
        }
        Force3.prototype.getBody = function () {
            return this.body_;
        };
        Force3.prototype.computeForce = function (force) {
            switch (this.vectorCoordType) {
                case CoordType_1.default.LOCAL: {
                    this.force_.copyVector(this.vector);
                    this.force_.rotate(this.body_.R);
                    this.force_.writeVector(force);
                    break;
                }
                case CoordType_1.default.WORLD: {
                    this.force_.copyVector(this.vector);
                    this.force_.writeVector(force);
                    break;
                }
            }
        };
        Object.defineProperty(Force3.prototype, "F", {
            get: function () {
                this.computeForce(this.force_);
                return this.force_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Force3.prototype, "x", {
            get: function () {
                this.computePosition(this.position_);
                return this.position_;
            },
            enumerable: true,
            configurable: true
        });
        Force3.prototype.computePosition = function (position) {
            switch (this.locationCoordType) {
                case CoordType_1.default.LOCAL: {
                    this.position_.copyVector(this.location);
                    this.position_.rotate(this.body_.R);
                    this.position_.addVector(this.body_.X);
                    this.position_.writeVector(position);
                    break;
                }
                case CoordType_1.default.WORLD: {
                    this.position_.copyVector(this.location);
                    this.position_.writeVector(position);
                    break;
                }
            }
        };
        Force3.prototype.computeTorque = function (torque) {
            this.computePosition(this.position_);
            this.computeForce(this.force_);
            this.torque_.wedge(this.position_.subVector(this.body_.X), this.force_);
            this.torque_.write(torque);
        };
        return Force3;
    }(AbstractSimObject_1.default));
    exports.Force3 = Force3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Force3;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/ConstantForceLaw3',["require", "exports", "../objects/AbstractSimObject", "../model/CoordType", "./Force3", "../math/Geometric3"], function (require, exports, AbstractSimObject_1, CoordType_1, Force3_1, Geometric3_1) {
    "use strict";
    var ConstantForceLaw3 = (function (_super) {
        __extends(ConstantForceLaw3, _super);
        function ConstantForceLaw3(body_, vector, vectorCoordType) {
            if (vectorCoordType === void 0) { vectorCoordType = CoordType_1.default.WORLD; }
            var _this = _super.call(this) || this;
            _this.body_ = body_;
            _this.forces = [];
            _this.potentialEnergy_ = Geometric3_1.default.scalar(0);
            _this.potentialEnergyLock_ = _this.potentialEnergy_.lock();
            _this.force_ = new Force3_1.default(_this.body_);
            _this.force_.locationCoordType = CoordType_1.default.LOCAL;
            _this.force_.vector.copyVector(vector);
            _this.force_.vectorCoordType = vectorCoordType;
            _this.forces = [_this.force_];
            return _this;
        }
        Object.defineProperty(ConstantForceLaw3.prototype, "location", {
            get: function () {
                return this.force_.location;
            },
            set: function (location) {
                this.force_.location.copyVector(location);
            },
            enumerable: true,
            configurable: true
        });
        ConstantForceLaw3.prototype.updateForces = function () {
            return this.forces;
        };
        ConstantForceLaw3.prototype.disconnect = function () {
        };
        ConstantForceLaw3.prototype.potentialEnergy = function () {
            this.potentialEnergy_.unlock(this.potentialEnergyLock_);
            this.potentialEnergy_.a = 0;
            this.potentialEnergyLock_ = this.potentialEnergy_.lock();
            return this.potentialEnergy_;
        };
        return ConstantForceLaw3;
    }(AbstractSimObject_1.default));
    exports.ConstantForceLaw3 = ConstantForceLaw3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConstantForceLaw3;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/CoulombLaw3',["require", "exports", "../objects/AbstractSimObject", "../model/CoordType", "./Force3", "../math/Geometric3"], function (require, exports, AbstractSimObject_1, CoordType_1, Force3_1, Geometric3_1) {
    "use strict";
    var CoulombLaw3 = (function (_super) {
        __extends(CoulombLaw3, _super);
        function CoulombLaw3(body1_, body2_, k) {
            if (k === void 0) { k = Geometric3_1.default.scalar(1); }
            var _this = _super.call(this) || this;
            _this.body1_ = body1_;
            _this.body2_ = body2_;
            _this.forces = [];
            _this.potentialEnergy_ = Geometric3_1.default.scalar(0);
            _this.potentialEnergyLock_ = _this.potentialEnergy_.lock();
            _this.F1 = new Force3_1.default(_this.body1_);
            _this.F1.locationCoordType = CoordType_1.default.WORLD;
            _this.F1.vectorCoordType = CoordType_1.default.WORLD;
            _this.F2 = new Force3_1.default(_this.body2_);
            _this.F2.locationCoordType = CoordType_1.default.WORLD;
            _this.F2.vectorCoordType = CoordType_1.default.WORLD;
            _this.k = k;
            _this.forces = [_this.F1, _this.F2];
            return _this;
        }
        CoulombLaw3.prototype.updateForces = function () {
            var numer = this.F1.location;
            var denom = this.F2.location;
            numer.copyVector(this.body1_.X).subVector(this.body2_.X);
            denom.copyVector(numer).quaditude();
            numer.direction().mulByScalar(this.k.a, this.k.uom).mulByScalar(this.body1_.Q.a, this.body1_.Q.uom).mulByScalar(this.body2_.Q.a, this.body2_.Q.uom);
            this.F1.vector.copyVector(numer).divByScalar(denom.a, denom.uom);
            this.F2.vector.copyVector(this.F1.vector).neg();
            this.F1.location.copyVector(this.body1_.X);
            this.F2.location.copyVector(this.body2_.X);
            return this.forces;
        };
        CoulombLaw3.prototype.disconnect = function () {
        };
        CoulombLaw3.prototype.potentialEnergy = function () {
            this.potentialEnergy_.unlock(this.potentialEnergyLock_);
            var numer = this.F1.location;
            var denom = this.F2.location;
            numer.copyScalar(this.k.a, this.k.uom).mulByScalar(this.body1_.Q.a, this.body1_.Q.uom).mulByScalar(this.body2_.Q.a, this.body2_.Q.uom);
            denom.copyVector(this.body1_.X).subVector(this.body2_.X).magnitude();
            this.potentialEnergy_.copyScalar(numer.a, numer.uom).divByScalar(denom.a, denom.uom);
            this.F1.location.copyVector(this.body1_.X);
            this.F2.location.copyVector(this.body2_.X);
            this.potentialEnergyLock_ = this.potentialEnergy_.lock();
            return this.potentialEnergy_;
        };
        return CoulombLaw3;
    }(AbstractSimObject_1.default));
    exports.CoulombLaw3 = CoulombLaw3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CoulombLaw3;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/Cylinder3',["require", "exports", "../math/Geometric3", "../math/Matrix3", "./RigidBody3", "../math/Unit"], function (require, exports, Geometric3_1, Matrix3_1, RigidBody3_1, Unit_1) {
    "use strict";
    var Cylinder3 = (function (_super) {
        __extends(Cylinder3, _super);
        function Cylinder3(radius, height) {
            if (radius === void 0) { radius = Geometric3_1.default.one; }
            if (height === void 0) { height = Geometric3_1.default.one; }
            var _this = _super.call(this) || this;
            _this.radius_ = Geometric3_1.default.copy(radius);
            _this.radiusLock_ = _this.radius_.lock();
            _this.height_ = Geometric3_1.default.copy(height);
            _this.heightLock_ = _this.height_.lock();
            _this.updateInertiaTensor();
            return _this;
        }
        Object.defineProperty(Cylinder3.prototype, "radius", {
            get: function () {
                return this.radius_;
            },
            set: function (radius) {
                this.radius_.unlock(this.radiusLock_);
                this.radius_.copy(radius);
                this.radiusLock_ = this.radius_.lock();
                this.updateInertiaTensor();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cylinder3.prototype, "height", {
            get: function () {
                return this.height_;
            },
            set: function (height) {
                this.height.unlock(this.heightLock_);
                this.height_.copy(height);
                this.heightLock_ = this.height_.lock();
                this.updateInertiaTensor();
            },
            enumerable: true,
            configurable: true
        });
        Cylinder3.prototype.updateInertiaTensor = function () {
            var r = this.radius_;
            var h = this.height_;
            var rr = r.a * r.a;
            var hh = h.a * h.a;
            var Irr = this.M.a * (3 * rr + hh) / 12;
            var Ihh = this.M.a * rr / 2;
            var I = Matrix3_1.default.zero();
            I.setElement(0, 0, Irr);
            I.setElement(1, 1, Ihh);
            I.setElement(2, 2, Irr);
            I.uom = Unit_1.default.mul(this.M.uom, Unit_1.default.mul(r.uom, h.uom));
            this.I = I;
        };
        return Cylinder3;
    }(RigidBody3_1.default));
    exports.Cylinder3 = Cylinder3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Cylinder3;
});

define('davinci-newton/strategy/DefaultAdvanceStrategy',["require", "exports", "../checks/mustBeNonNullObject"], function (require, exports, mustBeNonNullObject_1) {
    "use strict";
    var DefaultAdvanceStrategy = (function () {
        function DefaultAdvanceStrategy(simulation, solver) {
            this.simulation_ = mustBeNonNullObject_1.default('simulation', simulation);
            this.solver_ = mustBeNonNullObject_1.default('solver', solver);
        }
        DefaultAdvanceStrategy.prototype.advance = function (stepSize, uomStep) {
            this.simulation_.prolog();
            this.solver_.step(stepSize, uomStep);
            this.simulation_.epilog();
        };
        return DefaultAdvanceStrategy;
    }());
    exports.DefaultAdvanceStrategy = DefaultAdvanceStrategy;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DefaultAdvanceStrategy;
});

define('davinci-newton/util/contains',["require", "exports"], function (require, exports) {
    "use strict";
    function contains(xs, x) {
        var N = xs.length;
        for (var i = 0; i < N; i++) {
            if (xs[i] === x) {
                return true;
            }
        }
        return false;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = contains;
});

define('davinci-newton/view/DrawingMode',["require", "exports"], function (require, exports) {
    "use strict";
    var DrawingMode;
    (function (DrawingMode) {
        DrawingMode[DrawingMode["DOTS"] = 0] = "DOTS";
        DrawingMode[DrawingMode["LINES"] = 1] = "LINES";
    })(DrawingMode = exports.DrawingMode || (exports.DrawingMode = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawingMode;
});

define('davinci-newton/util/clone',["require", "exports"], function (require, exports) {
    "use strict";
    function clone(xs) {
        var length = xs.length;
        var rv = new Array(length);
        for (var i = 0; i < length; i++) {
            rv[i] = xs[i];
        }
        return rv;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = clone;
});

define('davinci-newton/util/findIndex',["require", "exports"], function (require, exports) {
    "use strict";
    function findIndex(xs, test) {
        var N = xs.length;
        for (var i = 0; i < N; i++) {
            var x = xs[i];
            if (test(x, i)) {
                return i;
            }
        }
        return -1;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = findIndex;
});

define('davinci-newton/util/find',["require", "exports", "./findIndex"], function (require, exports, findIndex_1) {
    "use strict";
    function find(xs, test) {
        var i = findIndex_1.default(xs, test);
        return i < 0 ? null : xs[i];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = find;
});

define('davinci-newton/util/toName',["require", "exports"], function (require, exports) {
    "use strict";
    function toName(text) {
        return text.toUpperCase().replace(/[ -]/g, '_');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = toName;
});

define('davinci-newton/util/validName',["require", "exports"], function (require, exports) {
    "use strict";
    function validName(text) {
        if (!text.match(/^[A-Z_][A-Z_0-9]*$/)) {
            throw new Error('not a valid name: ' + text);
        }
        return text;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = validName;
});

define('davinci-newton/util/ParameterBoolean',["require", "exports", "./toName", "./validName"], function (require, exports, toName_1, validName_1) {
    "use strict";
    var ParameterBoolean = (function () {
        function ParameterBoolean(subject, name, getter, setter, choices, values) {
            this.subject_ = subject;
            this.name_ = validName_1.default(toName_1.default(name));
            this.getter_ = getter;
            this.setter_ = setter;
            this.isComputed_ = false;
            this.choices_ = [];
            this.values_ = [];
        }
        Object.defineProperty(ParameterBoolean.prototype, "name", {
            get: function () {
                return this.name_;
            },
            enumerable: true,
            configurable: true
        });
        ParameterBoolean.prototype.getSubject = function () {
            return this.subject_;
        };
        ParameterBoolean.prototype.nameEquals = function (name) {
            return this.name_ === toName_1.default(name);
        };
        ParameterBoolean.prototype.setComputed = function (value) {
            this.isComputed_ = value;
        };
        return ParameterBoolean;
    }());
    exports.ParameterBoolean = ParameterBoolean;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ParameterBoolean;
});

define('davinci-newton/util/ParameterNumber',["require", "exports", "./toName", "./validName"], function (require, exports, toName_1, validName_1) {
    "use strict";
    var ParameterNumber = (function () {
        function ParameterNumber(subject, name, getter, setter, choices, values) {
            this.subject_ = subject;
            this.name_ = validName_1.default(toName_1.default(name));
            this.getter_ = getter;
            this.setter_ = setter;
            this.isComputed_ = false;
            this.signifDigits_ = 3;
            this.decimalPlaces_ = -1;
            this.lowerLimit_ = 0;
            this.upperLimit_ = Number.POSITIVE_INFINITY;
            this.choices_ = [];
            this.values_ = [];
        }
        Object.defineProperty(ParameterNumber.prototype, "name", {
            get: function () {
                return this.name_;
            },
            enumerable: true,
            configurable: true
        });
        ParameterNumber.prototype.getSubject = function () {
            return this.subject_;
        };
        ParameterNumber.prototype.getValue = function () {
            return this.getter_();
        };
        ParameterNumber.prototype.nameEquals = function (name) {
            return this.name_ === toName_1.default(name);
        };
        ParameterNumber.prototype.setComputed = function (value) {
            this.isComputed_ = value;
        };
        ParameterNumber.prototype.setLowerLimit = function (lowerLimit) {
            if (lowerLimit > this.getValue() || lowerLimit > this.upperLimit_)
                throw new Error('out of range');
            this.lowerLimit_ = lowerLimit;
            return this;
        };
        ParameterNumber.prototype.setSignifDigits = function (signifDigits) {
            this.signifDigits_ = signifDigits;
            return this;
        };
        return ParameterNumber;
    }());
    exports.ParameterNumber = ParameterNumber;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ParameterNumber;
});

define('davinci-newton/util/ParameterString',["require", "exports", "./toName", "./validName"], function (require, exports, toName_1, validName_1) {
    "use strict";
    var ParameterString = (function () {
        function ParameterString(subject, name, getter, setter, choices, values) {
            this.subject_ = subject;
            this.name_ = validName_1.default(toName_1.default(name));
            this.getter_ = getter;
            this.setter_ = setter;
            this.isComputed_ = false;
            this.suggestedLength_ = 20;
            this.maxLength_ = Number.POSITIVE_INFINITY;
            this.choices_ = [];
            this.values_ = [];
            this.inputFunction_ = null;
        }
        Object.defineProperty(ParameterString.prototype, "name", {
            get: function () {
                return this.name_;
            },
            enumerable: true,
            configurable: true
        });
        ParameterString.prototype.getSubject = function () {
            return this.subject_;
        };
        ParameterString.prototype.getValue = function () {
            return this.getter_();
        };
        ParameterString.prototype.nameEquals = function (name) {
            return this.name_ === toName_1.default(name);
        };
        ParameterString.prototype.setComputed = function (value) {
            this.isComputed_ = value;
        };
        return ParameterString;
    }());
    exports.ParameterString = ParameterString;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ParameterString;
});

define('davinci-newton/util/removeAt',["require", "exports"], function (require, exports) {
    "use strict";
    function removeAt(xs, index) {
        return Array.prototype.splice.call(xs, index, 1).length === 1;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = removeAt;
});

define('davinci-newton/util/remove',["require", "exports", "./removeAt"], function (require, exports, removeAt_1) {
    "use strict";
    function remove(xs, x) {
        var i = xs.indexOf(x);
        var rv;
        if ((rv = i >= 0)) {
            removeAt_1.default(xs, i);
        }
        return rv;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = remove;
});

define('davinci-newton/util/AbstractSubject',["require", "exports", "./clone", "./contains", "./find", "./ParameterBoolean", "./ParameterNumber", "./ParameterString", "./remove", "../util/toName"], function (require, exports, clone_1, contains_1, find_1, ParameterBoolean_1, ParameterNumber_1, ParameterString_1, remove_1, toName_1) {
    "use strict";
    var AbstractSubject = (function () {
        function AbstractSubject() {
            this.doBroadcast_ = true;
            this.observers_ = [];
            this.paramList_ = [];
        }
        AbstractSubject.prototype.addObserver = function (observer) {
            if (!contains_1.default(this.observers_, observer)) {
                this.observers_.push(observer);
            }
        };
        AbstractSubject.prototype.removeObserver = function (observer) {
            remove_1.default(this.observers_, observer);
        };
        AbstractSubject.prototype.addParameter = function (parameter) {
            var name = parameter.name;
            var p = this.getParam(name);
            if (p != null) {
                throw new Error('parameter ' + name + ' already exists: ' + p);
            }
            this.paramList_.push(parameter);
        };
        AbstractSubject.prototype.getParam = function (name) {
            name = toName_1.default(name);
            return find_1.default(this.paramList_, function (p) {
                return p.name === name;
            });
        };
        AbstractSubject.prototype.getParameter = function (name) {
            var p = this.getParam(name);
            if (p != null) {
                return p;
            }
            throw new Error('Parameter not found ' + name);
        };
        AbstractSubject.prototype.getParameterBoolean = function (name) {
            var p = this.getParam(name);
            if (p instanceof ParameterBoolean_1.default) {
                return p;
            }
            throw new Error('ParameterBoolean not found ' + name);
        };
        AbstractSubject.prototype.getParameterNumber = function (name) {
            var p = this.getParam(name);
            if (p instanceof ParameterNumber_1.default) {
                return p;
            }
            throw new Error('ParameterNumber not found ' + name);
        };
        AbstractSubject.prototype.getParameterString = function (name) {
            var p = this.getParam(name);
            if (p instanceof ParameterString_1.default) {
                return p;
            }
            throw new Error('ParameterString not found ' + name);
        };
        AbstractSubject.prototype.getParameters = function () {
            return clone_1.default(this.paramList_);
        };
        AbstractSubject.prototype.broadcast = function (event) {
            if (this.doBroadcast_) {
                var len = this.observers_.length;
                for (var i = 0; i < len; i++) {
                    this.observers_[i].observe(event);
                }
            }
        };
        AbstractSubject.prototype.broadcastParameter = function (name) {
            var p = this.getParam(name);
            if (p === null) {
                throw new Error('unknown Parameter ' + name);
            }
            this.broadcast(p);
        };
        AbstractSubject.prototype.getBroadcast = function () {
            return this.doBroadcast_;
        };
        AbstractSubject.prototype.getObservers = function () {
            return clone_1.default(this.observers_);
        };
        return AbstractSubject;
    }());
    exports.AbstractSubject = AbstractSubject;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractSubject;
});

define('davinci-newton/util/GenericEvent',["require", "exports", "./toName", "./validName"], function (require, exports, toName_1, validName_1) {
    "use strict";
    var GenericEvent = (function () {
        function GenericEvent(subject_, name, value_) {
            this.subject_ = subject_;
            this.value_ = value_;
            this.name_ = validName_1.default(toName_1.default(name));
        }
        Object.defineProperty(GenericEvent.prototype, "name", {
            get: function () {
                return this.name_;
            },
            enumerable: true,
            configurable: true
        });
        GenericEvent.prototype.getSubject = function () {
            return this.subject_;
        };
        GenericEvent.prototype.nameEquals = function (name) {
            return this.name_ === toName_1.default(name);
        };
        return GenericEvent;
    }());
    exports.GenericEvent = GenericEvent;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GenericEvent;
});

define('davinci-newton/graph/GraphPoint',["require", "exports"], function (require, exports) {
    "use strict";
    var GraphPoint = (function () {
        function GraphPoint(x, y, seqX, seqY) {
            this.x = x;
            this.y = y;
            this.seqX = seqX;
            this.seqY = seqY;
        }
        GraphPoint.prototype.equals = function (other) {
            return this.x === other.x && this.y === other.y && this.seqX === other.seqX && this.seqY === other.seqY;
        };
        return GraphPoint;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphPoint;
});

define('davinci-newton/graph/GraphStyle',["require", "exports"], function (require, exports) {
    "use strict";
    var GraphStyle = (function () {
        function GraphStyle(index_, drawingMode, color_, lineWidth) {
            this.index_ = index_;
            this.drawingMode = drawingMode;
            this.color_ = color_;
            this.lineWidth = lineWidth;
        }
        return GraphStyle;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphStyle;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/graph/GraphLine',["require", "exports", "../util/AbstractSubject", "../util/CircularList", "../view/DrawingMode", "../util/GenericEvent", "./GraphPoint", "./GraphStyle", "../checks/isObject", "../util/ParameterNumber", "../util/ParameterString", "../util/veryDifferent"], function (require, exports, AbstractSubject_1, CircularList_1, DrawingMode_1, GenericEvent_1, GraphPoint_1, GraphStyle_1, isObject_1, ParameterNumber_1, ParameterString_1, veryDifferent_1) {
    "use strict";
    var GraphLine = (function (_super) {
        __extends(GraphLine, _super);
        function GraphLine(varsList, capacity) {
            var _this = _super.call(this) || this;
            _this.lineWidth_ = 1.0;
            _this.hotspotColor_ = 'red';
            _this.styles_ = [];
            _this.varsList_ = varsList;
            varsList.addObserver(_this);
            _this.xVar_ = -1;
            _this.yVar_ = -1;
            _this.xVarParam_ = new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_X_VARIABLE, function () { return _this.hCoordIndex; }, function (hCoordIndex) { return _this.hCoordIndex = hCoordIndex; });
            _this.xVarParam_.setLowerLimit(-1);
            _this.addParameter(_this.xVarParam_);
            _this.yVarParam_ = new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_Y_VARIABLE, function () { return _this.vCoordIndex; }, function (vCoordIndex) { return _this.vCoordIndex = vCoordIndex; });
            _this.yVarParam_.setLowerLimit(-1);
            _this.addParameter(_this.yVarParam_);
            _this.dataPoints_ = new CircularList_1.default(capacity || 100000);
            _this.drawColor_ = 'lime';
            _this.drawingMode_ = DrawingMode_1.default.LINES;
            _this.addGraphStyle();
            _this.xTransform = function (x, y) { return x; };
            _this.yTransform = function (x, y) { return y; };
            _this.addParameter(new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_LINE_WIDTH, function () { return _this.lineWidth; }, function (lineWidth) { return _this.lineWidth = lineWidth; }));
            _this.addParameter(new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_DRAWING_MODE, function () { return _this.drawingMode; }, function (drawingMode) { return _this.drawingMode = drawingMode; }));
            _this.addParameter(new ParameterString_1.default(_this, GraphLine.PARAM_NAME_COLOR, function () { return _this.color; }, function (color) { return _this.color = color; }));
            return _this;
        }
        GraphLine.prototype.addGraphStyle = function () {
            this.styles_.push(new GraphStyle_1.default(this.dataPoints_.getEndIndex() + 1, this.drawingMode_, this.drawColor_, this.lineWidth_));
        };
        GraphLine.isDuckType = function (obj) {
            if (obj instanceof GraphLine) {
                return true;
            }
            return isObject_1.default(obj) && obj.setXVariable !== undefined
                && obj.setYVariable !== undefined
                && obj.color !== undefined
                && obj.lineWidth !== undefined
                && obj.setAxes !== undefined
                && obj.varsList !== undefined
                && obj.reset !== undefined
                && obj.getGraphStyle !== undefined;
        };
        Object.defineProperty(GraphLine.prototype, "color", {
            get: function () {
                return this.drawColor_;
            },
            set: function (color) {
                if (this.drawColor_ !== color) {
                    this.drawColor_ = color;
                    this.addGraphStyle();
                    this.broadcastParameter(GraphLine.PARAM_NAME_COLOR);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphLine.prototype, "drawingMode", {
            get: function () {
                return this.drawingMode_;
            },
            set: function (drawingMode) {
                if (this.drawingMode_ !== drawingMode) {
                    this.drawingMode_ = drawingMode;
                    this.addGraphStyle();
                }
                this.broadcastParameter(GraphLine.PARAM_NAME_DRAWING_MODE);
            },
            enumerable: true,
            configurable: true
        });
        GraphLine.prototype.getGraphPoints = function () {
            return this.dataPoints_;
        };
        GraphLine.prototype.getGraphStyle = function (index) {
            var styles = this.styles_;
            if (styles.length === 0) {
                throw new Error('graph styles list is empty');
            }
            var last = styles[0];
            for (var i = 1, len = styles.length; i < len; i++) {
                var s = styles[i];
                if (s.index_ > index) {
                    break;
                }
                last = s;
            }
            return last;
        };
        Object.defineProperty(GraphLine.prototype, "hotspotColor", {
            get: function () {
                return this.hotspotColor_;
            },
            set: function (color) {
                this.hotspotColor_ = color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphLine.prototype, "lineWidth", {
            get: function () {
                return this.lineWidth_;
            },
            set: function (lineWidth) {
                if (veryDifferent_1.default(lineWidth, this.lineWidth_)) {
                    this.lineWidth_ = lineWidth;
                    this.addGraphStyle();
                    this.broadcastParameter(GraphLine.PARAM_NAME_LINE_WIDTH);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphLine.prototype, "varsList", {
            get: function () {
                return this.varsList_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphLine.prototype, "hCoordIndex", {
            get: function () {
                return this.xVar_;
            },
            set: function (xVar) {
                this.checkVarIndex(GraphLine.PARAM_NAME_X_VARIABLE, xVar);
                if (xVar !== this.xVar_) {
                    this.xVar_ = xVar;
                    this.reset();
                    this.broadcastParameter(GraphLine.PARAM_NAME_X_VARIABLE);
                }
            },
            enumerable: true,
            configurable: true
        });
        GraphLine.prototype.getXVarName = function () {
            return this.xVar_ > -1 ? this.varsList_.getName(this.xVar_) : '';
        };
        Object.defineProperty(GraphLine.prototype, "vCoordIndex", {
            get: function () {
                return this.yVar_;
            },
            set: function (yVar) {
                this.checkVarIndex(GraphLine.PARAM_NAME_Y_VARIABLE, yVar);
                if (yVar !== this.yVar_) {
                    this.yVar_ = yVar;
                    this.reset();
                    this.broadcastParameter(GraphLine.PARAM_NAME_Y_VARIABLE);
                }
            },
            enumerable: true,
            configurable: true
        });
        GraphLine.prototype.getYVarName = function () {
            return this.yVar_ > -1 ? this.varsList_.getName(this.yVar_) : '';
        };
        GraphLine.prototype.memorize = function () {
            if (this.xVar_ > -1 && this.yVar_ > -1) {
                var varsList = this.varsList_;
                var x = varsList.getValue(this.xVar_);
                var y = varsList.getValue(this.yVar_);
                var nextX = this.xTransform(x, y);
                var nextY = this.yTransform(x, y);
                var seqX = varsList.getSequence(this.xVar_);
                var seqY = varsList.getSequence(this.xVar_);
                var newPoint = new GraphPoint_1.default(nextX, nextY, seqX, seqY);
                var last = this.dataPoints_.getEndValue();
                if (last == null || !last.equals(newPoint)) {
                    this.dataPoints_.store(newPoint);
                }
            }
        };
        GraphLine.prototype.observe = function (event) {
        };
        GraphLine.prototype.reset = function () {
            this.dataPoints_.reset();
            this.resetStyle();
            this.broadcast(new GenericEvent_1.default(this, GraphLine.RESET));
        };
        GraphLine.prototype.resetStyle = function () {
            this.styles_ = [];
            this.addGraphStyle();
        };
        GraphLine.prototype.checkVarIndex = function (name, index) {
            if (index < -1 || index > this.varsList_.numVariables() - 1) {
                throw new Error(name + " bad index: " + index);
            }
        };
        return GraphLine;
    }(AbstractSubject_1.default));
    GraphLine.PARAM_NAME_X_VARIABLE = 'X variable';
    GraphLine.PARAM_NAME_Y_VARIABLE = 'Y variable';
    GraphLine.PARAM_NAME_LINE_WIDTH = 'line width';
    GraphLine.PARAM_NAME_COLOR = 'color';
    GraphLine.PARAM_NAME_DRAWING_MODE = 'drawing mode';
    GraphLine.RESET = 'RESET';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphLine;
});

define('davinci-newton/util/repeat',["require", "exports"], function (require, exports) {
    "use strict";
    function repeat(value, N) {
        var xs = [];
        for (var i = 0; i < N; i++) {
            xs[i] = value;
        }
        return xs;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = repeat;
});

define('davinci-newton/view/ScreenRect',["require", "exports", "../checks/isFunction", "../util/veryDifferent"], function (require, exports, isFunction_1, veryDifferent_1) {
    "use strict";
    var ScreenRect = (function () {
        function ScreenRect(left, top_, width, height) {
            if (width < 0 || height < 0) {
                throw new Error();
            }
            this.left_ = left;
            this.top_ = top_;
            this.width_ = width;
            this.height_ = height;
        }
        ScreenRect.clone = function (rect) {
            return new ScreenRect(rect.left_, rect.top_, rect.width_, rect.height_);
        };
        ScreenRect.prototype.equals = function (otherRect) {
            return this.left_ === otherRect.left_ &&
                this.top_ === otherRect.top_ &&
                this.width_ === otherRect.width_ &&
                this.height_ === otherRect.height_;
        };
        ScreenRect.isDuckType = function (obj) {
            if (obj instanceof ScreenRect) {
                return true;
            }
            return obj.getLeft !== undefined
                && obj.getTop !== undefined
                && obj.getWidth !== undefined
                && obj.getHeight !== undefined
                && obj.isEmpty !== undefined
                && obj.equals !== undefined
                && obj.nearEqual !== undefined;
        };
        ScreenRect.prototype.getCenterX = function () {
            return this.left_ + this.width_ / 2;
        };
        ScreenRect.prototype.getCenterY = function () {
            return this.top_ + this.height_ / 2;
        };
        ScreenRect.prototype.getHeight = function () {
            return this.height_;
        };
        ScreenRect.prototype.getLeft = function () {
            return this.left_;
        };
        ScreenRect.prototype.getTop = function () {
            return this.top_;
        };
        ScreenRect.prototype.getWidth = function () {
            return this.width_;
        };
        ScreenRect.prototype.isEmpty = function (tolerance) {
            if (tolerance === void 0) { tolerance = 1E-14; }
            return this.width_ < tolerance || this.height_ < tolerance;
        };
        ScreenRect.prototype.makeOval = function (context) {
            var w = this.width_ / 2;
            var h = this.height_ / 2;
            if (isFunction_1.default(context.ellipse)) {
                context.beginPath();
                context.moveTo(this.left_ + this.width_, this.top_ + h);
                context.ellipse(this.left_ + w, this.top_ + h, w, h, 0, 0, 2 * Math.PI, false);
            }
            else {
                var min = Math.min(w, h);
                context.beginPath();
                context.moveTo(this.left_ + this.width_, this.top_);
                context.arc(this.left_ + w, this.top_ + h, min, 0, 2 * Math.PI, false);
                context.closePath();
            }
        };
        ScreenRect.prototype.makeRect = function (context) {
            context.rect(this.left_, this.top_, this.width_, this.height_);
        };
        ScreenRect.prototype.nearEqual = function (otherRect, opt_tolerance) {
            if (veryDifferent_1.default(this.left_, otherRect.left_, opt_tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.top_, otherRect.top_, opt_tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.width_, otherRect.width_, opt_tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.height_, otherRect.height_, opt_tolerance)) {
                return false;
            }
            return true;
        };
        return ScreenRect;
    }());
    ScreenRect.EMPTY_RECT = new ScreenRect(0, 0, 0, 0);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScreenRect;
});

define('davinci-newton/graph/DisplayGraph',["require", "exports", "../util/contains", "../view/DrawingMode", "./GraphLine", "../checks/isDefined", "../util/removeAt", "../util/repeat", "../view/ScreenRect"], function (require, exports, contains_1, DrawingMode_1, GraphLine_1, isDefined_1, removeAt_1, repeat_1, ScreenRect_1) {
    "use strict";
    var DisplayGraph = (function () {
        function DisplayGraph() {
            this.graphLines_ = [];
            this.memDraw_ = repeat_1.default(-1, this.graphLines_.length);
            this.offScreen_ = null;
            this.lastMap_ = null;
            this.screenRect_ = ScreenRect_1.default.EMPTY_RECT;
            this.needRedraw_ = false;
            this.useBuffer_ = false;
            this.zIndex = 0;
        }
        DisplayGraph.prototype.draw = function (context, map) {
            if (this.screenRect_.isEmpty()) {
                return;
            }
            var graphLines = this.graphLines_;
            var N = graphLines.length;
            context.save();
            if (this.lastMap_ == null || this.lastMap_ !== map) {
                this.lastMap_ = map;
                this.needRedraw_ = true;
            }
            for (var i = 0; i < N; i++) {
                if (this.memDraw_[i] > graphLines[i].getGraphPoints().getEndIndex()) {
                    this.reset();
                    break;
                }
            }
            if (!this.useBuffer_) {
                this.needRedraw_ = true;
                if (this.needRedraw_) {
                    this.fullDraw(context, map);
                    this.needRedraw_ = false;
                }
                else {
                    this.incrementalDraw(context, map);
                }
            }
            else {
                var w = this.screenRect_.getWidth();
                var h = this.screenRect_.getHeight();
                if (this.offScreen_ == null) {
                    this.offScreen_ = document.createElement('canvas');
                    this.offScreen_.width = w;
                    this.offScreen_.height = h;
                    this.needRedraw_ = true;
                }
                var osb = this.offScreen_.getContext('2d');
                if (this.needRedraw_) {
                    osb.clearRect(0, 0, w, h);
                    this.fullDraw(osb, map);
                    this.needRedraw_ = false;
                }
                else {
                    this.incrementalDraw(osb, map);
                }
                context.drawImage(this.offScreen_, 0, 0, w, h);
            }
            for (var i = 0; i < N; i++) {
                this.drawHotSpot(context, map, graphLines[i]);
            }
            context.restore();
        };
        DisplayGraph.prototype.drawHotSpot = function (context, coordMap, graphLine) {
            var p = graphLine.getGraphPoints().getEndValue();
            if (p != null) {
                var x = coordMap.simToScreenX(p.x);
                var y = coordMap.simToScreenY(p.y);
                var color = graphLine.hotspotColor;
                if (color) {
                    context.fillStyle = color;
                    context.fillRect(x - 2, y - 2, 5, 5);
                }
            }
        };
        DisplayGraph.prototype.drawPoints = function (context, coordMap, from, graphLine) {
            var simRect = coordMap.screenToSimRect(this.screenRect_);
            var iter = graphLine.getGraphPoints().getIterator(from);
            if (!iter.hasNext()) {
                return from;
            }
            var next = iter.nextValue();
            var style = graphLine.getGraphStyle(iter.getIndex());
            if (style.drawingMode === DrawingMode_1.default.DOTS) {
                var x = coordMap.simToScreenX(next.x);
                var y = coordMap.simToScreenY(next.y);
                var w = style.lineWidth;
                context.fillStyle = style.color_;
                context.fillRect(x, y, w, w);
            }
            while (iter.hasNext()) {
                var last = next;
                next = iter.nextValue();
                if (next.x === last.x && next.y === last.y) {
                    continue;
                }
                var style_1 = graphLine.getGraphStyle(iter.getIndex());
                var continuous = next.seqX === last.seqX && next.seqY === last.seqY;
                if (style_1.drawingMode === DrawingMode_1.default.DOTS || !continuous) {
                    if (!simRect.contains(next)) {
                        continue;
                    }
                    var x = coordMap.simToScreenX(next.x);
                    var y = coordMap.simToScreenY(next.y);
                    var w = style_1.lineWidth;
                    context.fillStyle = style_1.color_;
                    context.fillRect(x, y, w, w);
                }
                else {
                    if (!simRect.maybeVisible(last, next)) {
                        continue;
                    }
                    var x1 = coordMap.simToScreenX(last.x);
                    var y1 = coordMap.simToScreenY(last.y);
                    var x2 = coordMap.simToScreenX(next.x);
                    var y2 = coordMap.simToScreenY(next.y);
                    context.strokeStyle = style_1.color_;
                    context.lineWidth = style_1.lineWidth;
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.stroke();
                }
            }
            return iter.getIndex();
        };
        DisplayGraph.prototype.fullDraw = function (context, coordMap) {
            this.memDraw_ = repeat_1.default(-1, this.graphLines_.length);
            this.incrementalDraw(context, coordMap);
        };
        DisplayGraph.prototype.getZIndex = function () {
            return this.zIndex;
        };
        DisplayGraph.prototype.setZIndex = function (zIndex) {
            this.zIndex = isDefined_1.default(zIndex) ? zIndex : 0;
        };
        DisplayGraph.prototype.incrementalDraw = function (context, coordMap) {
            for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                this.memDraw_[i] = this.drawPoints(context, coordMap, this.memDraw_[i], this.graphLines_[i]);
            }
        };
        DisplayGraph.prototype.isDragable = function () {
            return false;
        };
        DisplayGraph.prototype.addGraphLine = function (graphLine) {
            if (GraphLine_1.default.isDuckType(graphLine)) {
                if (!contains_1.default(this.graphLines_, graphLine)) {
                    this.graphLines_.push(graphLine);
                    this.memDraw_.push(-1);
                }
            }
            else {
                throw new Error('not a GraphLine ' + graphLine);
            }
        };
        DisplayGraph.prototype.removeGraphLine = function (graphLine) {
            if (GraphLine_1.default.isDuckType(graphLine)) {
                var idx = this.graphLines_.indexOf(graphLine);
                removeAt_1.default(this.graphLines_, idx);
                removeAt_1.default(this.memDraw_, idx);
                this.needRedraw_ = true;
            }
            else {
                throw new Error('not a GraphLine ' + graphLine);
            }
        };
        DisplayGraph.prototype.setDragable = function (dragable) {
        };
        DisplayGraph.prototype.setScreenRect = function (screenRect) {
            this.screenRect_ = screenRect;
            this.offScreen_ = null;
        };
        DisplayGraph.prototype.setUseBuffer = function (value) {
            this.useBuffer_ = value;
            if (!this.useBuffer_) {
                this.offScreen_ = null;
            }
        };
        DisplayGraph.prototype.reset = function () {
            var graphLines = this.graphLines_;
            var N = graphLines.length;
            this.memDraw_ = repeat_1.default(-1, N);
            for (var i = 0; i < N; i++) {
                graphLines[i].reset();
            }
            this.needRedraw_ = true;
        };
        return DisplayGraph;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DisplayGraph;
});

define('davinci-newton/view/Point',["require", "exports"], function (require, exports) {
    "use strict";
    var Point = (function () {
        function Point(x_, y_) {
            this.x_ = x_;
            this.y_ = y_;
        }
        Object.defineProperty(Point.prototype, "x", {
            get: function () {
                return this.x_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "y", {
            get: function () {
                return this.y_;
            },
            enumerable: true,
            configurable: true
        });
        return Point;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Point;
});

define('davinci-newton/view/DoubleRect',["require", "exports", "./Point", "../util/veryDifferent"], function (require, exports, Point_1, veryDifferent_1) {
    "use strict";
    var DoubleRect = (function () {
        function DoubleRect(left, bottom, right, top) {
            this.left_ = left;
            this.right_ = right;
            this.bottom_ = bottom;
            this.top_ = top;
            if (left > right) {
                throw new Error('DoubleRect: left > right ' + left + ' > ' + right);
            }
            if (bottom > top) {
                throw new Error('DoubleRect: bottom > top ' + bottom + ' > ' + top);
            }
        }
        DoubleRect.clone = function (rect) {
            return new DoubleRect(rect.getLeft(), rect.getBottom(), rect.getRight(), rect.getTop());
        };
        DoubleRect.isDuckType = function (obj) {
            if (obj instanceof DoubleRect) {
                return true;
            }
            return obj.getLeft !== undefined
                && obj.getRight !== undefined
                && obj.getTop !== undefined
                && obj.getBottom !== undefined
                && obj.translate !== undefined
                && obj.scale !== undefined;
        };
        DoubleRect.make = function (point1, point2) {
            var left = Math.min(point1.x, point2.x);
            var right = Math.max(point1.x, point2.x);
            var bottom = Math.min(point1.y, point2.y);
            var top_ = Math.max(point1.y, point2.y);
            return new DoubleRect(left, bottom, right, top_);
        };
        DoubleRect.makeCentered = function (center, width, height) {
            var x = center.x;
            var y = center.y;
            return new DoubleRect(x - width / 2, y - height / 2, x + width / 2, y + height / 2);
        };
        ;
        DoubleRect.makeCentered2 = function (center, size) {
            var x = center.x;
            var y = center.y;
            var w = size.x;
            var h = size.y;
            return new DoubleRect(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
        };
        DoubleRect.prototype.contains = function (point) {
            return point.x >= this.left_ &&
                point.x <= this.right_ &&
                point.y >= this.bottom_ &&
                point.y <= this.top_;
        };
        DoubleRect.prototype.equals = function (obj) {
            if (obj === this)
                return true;
            if (obj instanceof DoubleRect) {
                return obj.getLeft() === this.left_ && obj.getRight() === this.right_ &&
                    obj.getBottom() === this.bottom_ && obj.getTop() === this.top_;
            }
            else {
                return false;
            }
        };
        DoubleRect.prototype.expand = function (marginX, marginY) {
            marginY = (marginY === undefined) ? marginX : marginY;
            return new DoubleRect(this.getLeft() - marginX, this.getBottom() - marginY, this.getRight() + marginX, this.getTop() + marginX);
        };
        DoubleRect.prototype.getBottom = function () {
            return this.bottom_;
        };
        DoubleRect.prototype.getCenter = function () {
            return new Point_1.default(this.getCenterX(), this.getCenterY());
        };
        DoubleRect.prototype.getCenterX = function () {
            return (this.left_ + this.right_) / 2.0;
        };
        DoubleRect.prototype.getCenterY = function () {
            return (this.bottom_ + this.top_) / 2.0;
        };
        DoubleRect.prototype.getHeight = function () {
            return this.top_ - this.bottom_;
        };
        DoubleRect.prototype.getLeft = function () {
            return this.left_;
        };
        DoubleRect.prototype.getRight = function () {
            return this.right_;
        };
        DoubleRect.prototype.getTop = function () {
            return this.top_;
        };
        DoubleRect.prototype.getWidth = function () {
            return this.right_ - this.left_;
        };
        DoubleRect.prototype.isEmpty = function (tolerance) {
            if (tolerance === void 0) { tolerance = 1E-16; }
            return this.getWidth() < tolerance || this.getHeight() < tolerance;
        };
        DoubleRect.prototype.maybeVisible = function (p1, p2) {
            if (this.contains(p1) || this.contains(p2)) {
                return true;
            }
            var p1x = p1.x;
            var p1y = p1.y;
            var p2x = p2.x;
            var p2y = p2.y;
            var d = this.left_;
            if (p1x < d && p2x < d) {
                return false;
            }
            d = this.right_;
            if (p1x > d && p2x > d) {
                return false;
            }
            d = this.bottom_;
            if (p1y < d && p2y < d) {
                return false;
            }
            d = this.top_;
            if (p1y > d && p2y > d) {
                return false;
            }
            return true;
        };
        DoubleRect.prototype.nearEqual = function (rect, opt_tolerance) {
            if (veryDifferent_1.default(this.left_, rect.getLeft(), opt_tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.bottom_, rect.getBottom(), opt_tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.right_, rect.getRight(), opt_tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.top_, rect.getTop(), opt_tolerance)) {
                return false;
            }
            return true;
        };
        DoubleRect.prototype.scale = function (factorX, factorY) {
            factorY = (factorY === undefined) ? factorX : factorY;
            var x0 = this.getCenterX();
            var y0 = this.getCenterY();
            var w = this.getWidth();
            var h = this.getHeight();
            return new DoubleRect(x0 - (factorX * w) / 2, y0 - (factorY * h) / 2, x0 + (factorX * w) / 2, y0 + (factorY * h) / 2);
        };
        DoubleRect.prototype.translate = function (x, y) {
            return new DoubleRect(this.left_ + x, this.bottom_ + y, this.right_ + x, this.top_ + y);
        };
        DoubleRect.prototype.union = function (rect) {
            return new DoubleRect(Math.min(this.left_, rect.getLeft()), Math.min(this.bottom_, rect.getBottom()), Math.max(this.right_, rect.getRight()), Math.max(this.top_, rect.getTop()));
        };
        DoubleRect.prototype.unionPoint = function (point) {
            return new DoubleRect(Math.min(this.left_, point.x), Math.min(this.bottom_, point.y), Math.max(this.right_, point.x), Math.max(this.top_, point.y));
        };
        return DoubleRect;
    }());
    DoubleRect.EMPTY_RECT = new DoubleRect(0, 0, 0, 0);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DoubleRect;
});

define('davinci-newton/view/AffineTransform',["require", "exports", "./Point"], function (require, exports, Point_1) {
    "use strict";
    var AffineTransform = (function () {
        function AffineTransform(m11, m12, m21, m22, dx, dy) {
            this.m11_ = m11;
            this.m12_ = m12;
            this.m21_ = m21;
            this.m22_ = m22;
            this.dx_ = dx;
            this.dy_ = dy;
        }
        AffineTransform.prototype.applyTransform = function (context) {
            context.transform(this.m11_, this.m12_, this.m21_, this.m22_, this.dx_, this.dy_);
            return this;
        };
        AffineTransform.prototype.concatenate = function (at) {
            var m11 = this.m11_ * at.m11_ + this.m21_ * at.m12_;
            var m12 = this.m12_ * at.m11_ + this.m22_ * at.m12_;
            var m21 = this.m11_ * at.m21_ + this.m21_ * at.m22_;
            var m22 = this.m12_ * at.m21_ + this.m22_ * at.m22_;
            var dx = this.m11_ * at.dx_ + this.m21_ * at.dy_ + this.dx_;
            var dy = this.m12_ * at.dx_ + this.m22_ * at.dy_ + this.dy_;
            return new AffineTransform(m11, m12, m21, m22, dx, dy);
        };
        AffineTransform.prototype.lineTo = function (x, y, context) {
            var p = this.transform(x, y);
            context.lineTo(p.x, p.y);
            return this;
        };
        AffineTransform.prototype.moveTo = function (x, y, context) {
            var p = this.transform(x, y);
            context.moveTo(p.x, p.y);
            return this;
        };
        AffineTransform.prototype.rotate = function (angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            var m11 = c * this.m11_ + s * this.m21_;
            var m12 = c * this.m12_ + s * this.m22_;
            var m21 = -s * this.m11_ + c * this.m21_;
            var m22 = -s * this.m12_ + c * this.m22_;
            return new AffineTransform(m11, m12, m21, m22, this.dx_, this.dy_);
        };
        AffineTransform.prototype.scale = function (x, y) {
            var m11 = this.m11_ * x;
            var m12 = this.m12_ * x;
            var m21 = this.m21_ * y;
            var m22 = this.m22_ * y;
            return new AffineTransform(m11, m12, m21, m22, this.dx_, this.dy_);
        };
        AffineTransform.prototype.setTransform = function (context) {
            context.setTransform(this.m11_, this.m12_, this.m21_, this.m22_, this.dx_, this.dy_);
            return this;
        };
        AffineTransform.prototype.transform = function (x, y) {
            var x2 = this.m11_ * x + this.m21_ * y + this.dx_;
            var y2 = this.m12_ * x + this.m22_ * y + this.dy_;
            return new Point_1.default(x2, y2);
        };
        AffineTransform.prototype.translate = function (x, y) {
            var dx = this.dx_ + this.m11_ * x + this.m21_ * y;
            var dy = this.dy_ + this.m12_ * x + this.m22_ * y;
            return new AffineTransform(this.m11_, this.m12_, this.m21_, this.m22_, dx, dy);
        };
        return AffineTransform;
    }());
    AffineTransform.IDENTITY = new AffineTransform(1, 0, 0, 1, 0, 0);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AffineTransform;
});

define('davinci-newton/checks/mustBeFinite',["require", "exports"], function (require, exports) {
    "use strict";
    function mustBeFinite(value) {
        if (typeof value !== 'number' || !isFinite(value)) {
            throw new Error('not a finite number ' + value);
        }
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeFinite;
});

define('davinci-newton/view/CoordMap',["require", "exports", "./AffineTransform", "./AlignH", "./AlignV", "./DoubleRect", "../checks/mustBeFinite", "./Point", "./ScreenRect"], function (require, exports, AffineTransform_1, AlignH_1, AlignV_1, DoubleRect_1, mustBeFinite_1, Point_1, ScreenRect_1) {
    "use strict";
    var MIN_SIZE = 1E-15;
    var CoordMap = (function () {
        function CoordMap(screen_left, screen_bottom, sim_left, sim_bottom, pixel_per_unit_x, pixel_per_unit_y) {
            this.screen_left_ = mustBeFinite_1.default(screen_left);
            this.screen_bottom_ = mustBeFinite_1.default(screen_bottom);
            this.sim_left_ = mustBeFinite_1.default(sim_left);
            this.sim_bottom_ = mustBeFinite_1.default(sim_bottom);
            this.pixel_per_unit_x_ = mustBeFinite_1.default(pixel_per_unit_x);
            this.pixel_per_unit_y_ = mustBeFinite_1.default(pixel_per_unit_y);
            var at = AffineTransform_1.default.IDENTITY;
            at = at.translate(this.screen_left_, this.screen_bottom_);
            at = at.scale(this.pixel_per_unit_x_, -this.pixel_per_unit_y_);
            at = at.translate(-this.sim_left_, -this.sim_bottom_);
            this.transform_ = at;
        }
        CoordMap.make = function (screenRect, simRect, horizAlign, verticalAlign, aspectRatio) {
            if (horizAlign === void 0) { horizAlign = AlignH_1.default.MIDDLE; }
            if (verticalAlign === void 0) { verticalAlign = AlignV_1.default.MIDDLE; }
            if (aspectRatio === void 0) { aspectRatio = 1; }
            if (aspectRatio < MIN_SIZE || !isFinite(aspectRatio)) {
                throw new Error('bad aspectRatio ' + aspectRatio);
            }
            var simLeft = simRect.getLeft();
            var simBottom = simRect.getBottom();
            var sim_width = simRect.getRight() - simLeft;
            var sim_height = simRect.getTop() - simBottom;
            if (sim_width < MIN_SIZE || sim_height < MIN_SIZE) {
                throw new Error('simRect cannot be empty ' + simRect);
            }
            var screen_top = screenRect.getTop();
            var screen_left = screenRect.getLeft();
            var screen_width = screenRect.getWidth();
            var screen_height = screenRect.getHeight();
            var offset_x = 0;
            var offset_y = 0;
            var pixel_per_unit_x = 0;
            var pixel_per_unit_y = 0;
            if (horizAlign === AlignH_1.default.FULL) {
                pixel_per_unit_x = screen_width / sim_width;
                offset_x = 0;
            }
            if (verticalAlign === AlignV_1.default.FULL) {
                pixel_per_unit_y = screen_height / sim_height;
                offset_y = 0;
            }
            if (horizAlign !== AlignH_1.default.FULL || verticalAlign !== AlignV_1.default.FULL) {
                var horizFull = void 0;
                if (horizAlign === AlignH_1.default.FULL) {
                    pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                    horizFull = true;
                }
                else if (verticalAlign === AlignV_1.default.FULL) {
                    pixel_per_unit_x = pixel_per_unit_y / aspectRatio;
                    horizFull = false;
                }
                else {
                    pixel_per_unit_x = screen_width / sim_width;
                    pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                    horizFull = true;
                    var ideal_height = Math.floor(0.5 + pixel_per_unit_y * sim_height);
                    if (screen_height < ideal_height) {
                        pixel_per_unit_y = screen_height / sim_height;
                        pixel_per_unit_x = pixel_per_unit_y / aspectRatio;
                        horizFull = false;
                    }
                }
                if (!horizFull) {
                    offset_y = 0;
                    var ideal_width = Math.floor(0.5 + sim_width * pixel_per_unit_x);
                    switch (horizAlign) {
                        case AlignH_1.default.LEFT:
                            offset_x = 0;
                            break;
                        case AlignH_1.default.MIDDLE:
                            offset_x = (screen_width - ideal_width) / 2;
                            break;
                        case AlignH_1.default.RIGHT:
                            offset_x = screen_width - ideal_width;
                            break;
                        default: throw new Error();
                    }
                }
                else {
                    offset_x = 0;
                    var ideal_height = Math.floor(0.5 + sim_height * pixel_per_unit_y);
                    switch (verticalAlign) {
                        case AlignV_1.default.BOTTOM:
                            offset_y = 0;
                            break;
                        case AlignV_1.default.MIDDLE:
                            offset_y = (screen_height - ideal_height) / 2;
                            break;
                        case AlignV_1.default.TOP:
                            offset_y = screen_height - ideal_height;
                            break;
                        default: {
                            throw new Error();
                        }
                    }
                }
            }
            var coordMap = new CoordMap(screen_left, screen_top + screen_height, simLeft - offset_x / pixel_per_unit_x, simBottom - offset_y / pixel_per_unit_y, pixel_per_unit_x, pixel_per_unit_y);
            return coordMap;
        };
        CoordMap.isDuckType = function (obj) {
            if (obj instanceof CoordMap) {
                return true;
            }
            return obj.getAffineTransform !== undefined
                && obj.simToScreenX !== undefined
                && obj.simToScreenY !== undefined
                && obj.screenToSimX !== undefined
                && obj.screenToSimY !== undefined
                && obj.getScaleX !== undefined
                && obj.getScaleY !== undefined;
        };
        CoordMap.prototype.getAffineTransform = function () {
            return this.transform_;
        };
        CoordMap.prototype.getScaleX = function () {
            return this.pixel_per_unit_x_;
        };
        CoordMap.prototype.getScaleY = function () {
            return this.pixel_per_unit_y_;
        };
        CoordMap.prototype.screenToSim = function (scr_x, scr_y) {
            return new Point_1.default(this.screenToSimX(scr_x), this.screenToSimY(scr_y));
        };
        CoordMap.prototype.screenToSimRect = function (rect) {
            return new DoubleRect_1.default(this.screenToSimX(rect.getLeft()), this.screenToSimY(rect.getTop() + rect.getHeight()), this.screenToSimX(rect.getLeft() + rect.getWidth()), this.screenToSimY(rect.getTop()));
        };
        CoordMap.prototype.screenToSimScaleX = function (scr_x) {
            return scr_x / this.pixel_per_unit_x_;
        };
        CoordMap.prototype.screenToSimScaleY = function (scr_y) {
            return scr_y / this.pixel_per_unit_y_;
        };
        CoordMap.prototype.screenToSimX = function (scr_x) {
            return this.sim_left_ + (scr_x - this.screen_left_) / this.pixel_per_unit_x_;
        };
        CoordMap.prototype.screenToSimY = function (scr_y) {
            return this.sim_bottom_ + (this.screen_bottom_ - scr_y) / this.pixel_per_unit_y_;
        };
        CoordMap.prototype.simToScreen = function (p_sim) {
            return new Point_1.default(this.simToScreenX(p_sim.x), this.simToScreenY(p_sim.y));
        };
        CoordMap.prototype.simToScreenRect = function (r) {
            return new ScreenRect_1.default(this.simToScreenX(r.getLeft()), this.simToScreenY(r.getTop()), this.simToScreenScaleX(r.getWidth()), this.simToScreenScaleY(r.getHeight()));
        };
        CoordMap.prototype.simToScreenScaleX = function (length_x) {
            return length_x * this.pixel_per_unit_x_;
        };
        CoordMap.prototype.simToScreenScaleY = function (length_y) {
            return length_y * this.pixel_per_unit_y_;
        };
        CoordMap.prototype.simToScreenX = function (sim_x) {
            return this.screen_left_ + (sim_x - this.sim_left_) * this.pixel_per_unit_x_;
        };
        CoordMap.prototype.simToScreenY = function (sim_y) {
            return this.screen_bottom_ - (sim_y - this.sim_bottom_) * this.pixel_per_unit_y_;
        };
        return CoordMap;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CoordMap;
});

define('davinci-newton/util/insertAt',["require", "exports"], function (require, exports) {
    "use strict";
    function slice(xs, start, opt_end) {
        if (arguments.length <= 2) {
            return Array.prototype.slice.call(xs, start);
        }
        else {
            return Array.prototype.slice.call(xs, start, opt_end);
        }
    }
    function splice(xs, index, howMany, var_args) {
        return Array.prototype.splice.apply(xs, slice(arguments, 1));
    }
    function insertAt(xs, x, index) {
        if (index === void 0) { index = 0; }
        splice(xs, index, 0, x);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = insertAt;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/view/DisplayList',["require", "exports", "../util/AbstractSubject", "../util/GenericEvent", "../util/insertAt", "../checks/isObject"], function (require, exports, AbstractSubject_1, GenericEvent_1, insertAt_1, isObject_1) {
    "use strict";
    var DisplayList = (function (_super) {
        __extends(DisplayList, _super);
        function DisplayList() {
            var _this = _super.call(this) || this;
            _this.drawables_ = [];
            return _this;
        }
        DisplayList.prototype.add = function (dispObj) {
            if (!isObject_1.default(dispObj)) {
                throw new Error('non-object passed to DisplayList.add');
            }
            var zIndex = dispObj.getZIndex();
            this.sort();
            var iLen = this.drawables_.length;
            var i = 0;
            for (i = 0; i < iLen; i++) {
                var z = this.drawables_[i].getZIndex();
                if (zIndex < z) {
                    break;
                }
            }
            insertAt_1.default(this.drawables_, dispObj, i);
            this.broadcast(new GenericEvent_1.default(this, DisplayList.OBJECT_ADDED, dispObj));
        };
        DisplayList.prototype.draw = function (context, coordMap) {
            this.sort();
            var ds = this.drawables_;
            var N = ds.length;
            for (var i = 0; i < N; i++) {
                ds[i].draw(context, coordMap);
            }
        };
        DisplayList.prototype.prepend = function (dispObj) {
            if (!isObject_1.default(dispObj)) {
                throw new Error('non-object passed to DisplayList.add');
            }
            var zIndex = dispObj.getZIndex();
            this.sort();
            var N = this.drawables_.length;
            var i = N;
            for (i = N; i > 0; i--) {
                var z = this.drawables_[i - 1].getZIndex();
                if (zIndex > z) {
                    break;
                }
            }
            insertAt_1.default(this.drawables_, dispObj, i);
            this.broadcast(new GenericEvent_1.default(this, DisplayList.OBJECT_ADDED, dispObj));
        };
        DisplayList.prototype.sort = function () {
        };
        return DisplayList;
    }(AbstractSubject_1.default));
    DisplayList.OBJECT_ADDED = 'OBJECT_ADDED';
    DisplayList.OBJECT_REMOVED = 'OBJECT_REMOVED';
    exports.DisplayList = DisplayList;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DisplayList;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/view/SimView',["require", "exports", "../util/AbstractSubject", "./AlignH", "./AlignV", "../util/clone", "../util/contains", "./CoordMap", "./DisplayList", "./DoubleRect", "../util/GenericEvent", "../util/ParameterBoolean", "../util/ParameterNumber", "../util/remove", "./ScreenRect", "../util/veryDifferent"], function (require, exports, AbstractSubject_1, AlignH_1, AlignV_1, clone_1, contains_1, CoordMap_1, DisplayList_1, DoubleRect_1, GenericEvent_1, ParameterBoolean_1, ParameterNumber_1, remove_1, ScreenRect_1, veryDifferent_1) {
    "use strict";
    var SimView = (function (_super) {
        __extends(SimView, _super);
        function SimView(simRect) {
            var _this = _super.call(this) || this;
            _this.panX = 0.05;
            _this.panY = 0.05;
            _this.zoom = 1.1;
            _this.screenRect_ = new ScreenRect_1.default(0, 0, 800, 600);
            _this.horizAlign_ = AlignH_1.default.MIDDLE;
            _this.verticalAlign_ = AlignV_1.default.MIDDLE;
            _this.aspectRatio_ = 1.0;
            _this.displayList_ = new DisplayList_1.default();
            _this.scaleTogether_ = true;
            _this.opaqueness = 1.0;
            _this.memorizables_ = [];
            if (!(simRect instanceof DoubleRect_1.default) || simRect.isEmpty()) {
                throw new Error('bad simRect: ' + simRect);
            }
            _this.simRect_ = simRect;
            _this.coordMap_ = CoordMap_1.default.make(_this.screenRect_, _this.simRect_, _this.horizAlign_, _this.verticalAlign_, _this.aspectRatio_);
            _this.width_ = simRect.getWidth();
            _this.height_ = simRect.getHeight();
            _this.centerX_ = simRect.getCenterX();
            _this.centerY_ = simRect.getCenterY();
            _this.ratio_ = _this.height_ / _this.width_;
            _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_WIDTH, function () { return _this.getWidth(); }, function (width) { return _this.setWidth(width); }));
            _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_HEIGHT, function () { return _this.getHeight(); }, function (height) { return _this.setHeight(height); }));
            _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_CENTER_X, function () { return _this.getCenterX(); }, function (centerX) { return _this.setCenterX(centerX); }).setLowerLimit(Number.NEGATIVE_INFINITY));
            _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_CENTER_Y, function () { return _this.getCenterY(); }, function (centerY) { return _this.setCenterY(centerY); }).setLowerLimit(Number.NEGATIVE_INFINITY));
            _this.addParameter(new ParameterBoolean_1.default(_this, SimView.PARAM_NAME_SCALE_TOGETHER, function () { return _this.getScaleTogether(); }, function (scaleTogether) { return _this.setScaleTogether(scaleTogether); }));
            _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_VERTICAL_ALIGN, function () { return _this.vAxisAlign; }, function (vAxisAlign) { return _this.vAxisAlign = vAxisAlign; }));
            _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_HORIZONTAL_ALIGN, function () { return _this.hAxisAlign; }, function (hAxisAlign) { return _this.hAxisAlign = hAxisAlign; }));
            _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_ASPECT_RATIO, function () { return _this.getAspectRatio(); }, function (aspectRatio) { return _this.setAspectRatio(aspectRatio); }));
            return _this;
        }
        ;
        SimView.prototype.addMemo = function (memorizable) {
            if (!contains_1.default(this.memorizables_, memorizable)) {
                this.memorizables_.push(memorizable);
            }
        };
        SimView.prototype.gainFocus = function () {
        };
        SimView.prototype.getAspectRatio = function () {
            return this.aspectRatio_;
        };
        SimView.prototype.getCenterX = function () {
            return this.centerX_;
        };
        SimView.prototype.getCenterY = function () {
            return this.centerY_;
        };
        SimView.prototype.getCoordMap = function () {
            return this.coordMap_;
        };
        SimView.prototype.getDisplayList = function () {
            return this.displayList_;
        };
        SimView.prototype.getHeight = function () {
            return this.height_;
        };
        Object.defineProperty(SimView.prototype, "hAxisAlign", {
            get: function () {
                return this.horizAlign_;
            },
            set: function (alignHoriz) {
                this.horizAlign_ = alignHoriz;
                this.realign();
                this.broadcastParameter(SimView.PARAM_NAME_HORIZONTAL_ALIGN);
            },
            enumerable: true,
            configurable: true
        });
        SimView.prototype.getMemos = function () {
            return clone_1.default(this.memorizables_);
        };
        SimView.prototype.getScaleTogether = function () {
            return this.scaleTogether_;
        };
        SimView.prototype.getScreenRect = function () {
            return this.screenRect_;
        };
        SimView.prototype.getSimRect = function () {
            return this.simRect_;
        };
        Object.defineProperty(SimView.prototype, "vAxisAlign", {
            get: function () {
                return this.verticalAlign_;
            },
            set: function (alignVert) {
                this.verticalAlign_ = alignVert;
                this.realign();
                this.broadcastParameter(SimView.PARAM_NAME_VERTICAL_ALIGN);
            },
            enumerable: true,
            configurable: true
        });
        SimView.prototype.getWidth = function () {
            return this.width_;
        };
        SimView.prototype.loseFocus = function () {
        };
        SimView.prototype.paint = function (context) {
            context.save();
            context.globalAlpha = this.opaqueness;
            this.displayList_.draw(context, this.coordMap_);
            context.restore();
        };
        SimView.prototype.setCoordMap = function (map) {
            if (!CoordMap_1.default.isDuckType(map))
                throw new Error('not a CoordMap: ' + map);
            this.coordMap_ = map;
            this.broadcast(new GenericEvent_1.default(this, SimView.COORD_MAP_CHANGED));
        };
        SimView.prototype.setScreenRect = function (screenRect) {
            if (!ScreenRect_1.default.isDuckType(screenRect))
                throw new Error('not a ScreenRect: ' + screenRect);
            if (screenRect.isEmpty()) {
                throw new Error('empty screenrect');
            }
            if (!this.screenRect_.equals(screenRect)) {
                this.screenRect_ = screenRect;
                this.realign();
                this.broadcast(new GenericEvent_1.default(this, SimView.SCREEN_RECT_CHANGED));
            }
        };
        SimView.prototype.setSimRect = function (simRect) {
            if (!DoubleRect_1.default.isDuckType(simRect))
                throw new Error('not a DoubleRect: ' + simRect);
            if (!simRect.equals(this.simRect_)) {
                this.simRect_ = simRect;
                this.realign();
                this.broadcastParameter(SimView.PARAM_NAME_WIDTH);
                this.broadcastParameter(SimView.PARAM_NAME_HEIGHT);
                this.broadcastParameter(SimView.PARAM_NAME_CENTER_X);
                this.broadcastParameter(SimView.PARAM_NAME_CENTER_Y);
                this.broadcast(new GenericEvent_1.default(this, SimView.SIM_RECT_CHANGED));
            }
        };
        SimView.prototype.memorize = function () {
            for (var i = 0, n = this.memorizables_.length; i < n; i++) {
                this.memorizables_[i].memorize();
            }
        };
        SimView.prototype.realign = function () {
            this.setCoordMap(CoordMap_1.default.make(this.screenRect_, this.simRect_, this.horizAlign_, this.verticalAlign_, this.aspectRatio_));
            this.width_ = this.simRect_.getWidth();
            this.height_ = this.simRect_.getHeight();
            this.centerX_ = this.simRect_.getCenterX();
            this.centerY_ = this.simRect_.getCenterY();
            this.ratio_ = this.height_ / this.width_;
        };
        SimView.prototype.modifySimRect = function () {
            var left = this.centerX_ - this.width_ / 2.0;
            var bottom = this.centerY_ - this.height_ / 2.0;
            var r = new DoubleRect_1.default(left, bottom, left + this.width_, bottom + this.height_);
            this.setSimRect(r);
        };
        SimView.prototype.panDown = function () {
            this.setCenterY(this.centerY_ - this.panY * this.height_);
        };
        SimView.prototype.panLeft = function () {
            this.setCenterX(this.centerX_ - this.panX * this.width_);
        };
        SimView.prototype.panRight = function () {
            this.setCenterX(this.centerX_ + this.panX * this.width_);
        };
        SimView.prototype.panUp = function () {
            this.setCenterY(this.centerY_ + this.panY * this.height_);
        };
        SimView.prototype.removeMemo = function (memorizable) {
            remove_1.default(this.memorizables_, memorizable);
        };
        SimView.prototype.setAspectRatio = function (aspectRatio) {
            if (veryDifferent_1.default(this.aspectRatio_, aspectRatio)) {
                this.aspectRatio_ = aspectRatio;
                this.realign();
                this.broadcastParameter(SimView.PARAM_NAME_ASPECT_RATIO);
            }
        };
        SimView.prototype.setCenterX = function (centerX) {
            if (veryDifferent_1.default(this.centerX_, centerX)) {
                this.centerX_ = centerX;
                this.modifySimRect();
            }
        };
        SimView.prototype.setCenterY = function (value) {
            if (veryDifferent_1.default(this.centerY_, value)) {
                this.centerY_ = value;
                this.modifySimRect();
            }
        };
        SimView.prototype.setHeight = function (value) {
            if (veryDifferent_1.default(this.height_, value)) {
                this.height_ = value;
                if (this.scaleTogether_) {
                    this.width_ = this.height_ / this.ratio_;
                }
                this.modifySimRect();
            }
        };
        SimView.prototype.setScaleTogether = function (value) {
            if (this.scaleTogether_ !== value) {
                this.scaleTogether_ = value;
                if (this.scaleTogether_) {
                    this.ratio_ = this.height_ / this.width_;
                }
                this.broadcastParameter(SimView.PARAM_NAME_SCALE_TOGETHER);
            }
        };
        SimView.prototype.setWidth = function (value) {
            if (veryDifferent_1.default(this.width_, value)) {
                this.width_ = value;
                if (this.scaleTogether_) {
                    this.height_ = this.width_ * this.ratio_;
                }
                this.modifySimRect();
            }
        };
        SimView.prototype.zoomIn = function () {
            this.setHeight(this.height_ / this.zoom);
        };
        SimView.prototype.zoomOut = function () {
            this.setHeight(this.height_ * this.zoom);
        };
        return SimView;
    }(AbstractSubject_1.default));
    SimView.PARAM_NAME_WIDTH = 'width';
    SimView.PARAM_NAME_HEIGHT = 'height';
    SimView.PARAM_NAME_CENTER_X = 'center-x';
    SimView.PARAM_NAME_CENTER_Y = 'center-y';
    SimView.PARAM_NAME_HORIZONTAL_ALIGN = 'horizontal-align';
    SimView.PARAM_NAME_VERTICAL_ALIGN = 'vertical-align';
    SimView.PARAM_NAME_ASPECT_RATIO = 'aspect-ratio';
    SimView.PARAM_NAME_SCALE_TOGETHER = 'scale X-Y together';
    SimView.COORD_MAP_CHANGED = 'COORD_MAP_CHANGED';
    SimView.SCREEN_RECT_CHANGED = 'SCREEN_RECT_CHANGED';
    SimView.SIM_RECT_CHANGED = 'SIM_RECT_CHANGED';
    exports.SimView = SimView;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimView;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/graph/AutoScale',["require", "exports", "../util/AbstractSubject", "./AxisChoice", "../util/contains", "../view/DoubleRect", "../util/GenericEvent", "./GraphLine", "../util/removeAt", "../util/ParameterNumber", "../util/repeat", "../view/SimView", "../util/veryDifferent"], function (require, exports, AbstractSubject_1, AxisChoice_1, contains_1, DoubleRect_1, GenericEvent_1, GraphLine_1, removeAt_1, ParameterNumber_1, repeat_1, SimView_1, veryDifferent_1) {
    "use strict";
    var AutoScale = (function (_super) {
        __extends(AutoScale, _super);
        function AutoScale(simView) {
            var _this = _super.call(this) || this;
            _this.graphLines_ = [];
            _this.enabled_ = true;
            _this.isActive_ = true;
            _this.ownEvent_ = false;
            _this.rangeSetX_ = false;
            _this.rangeSetY_ = false;
            _this.rangeXHi_ = 0;
            _this.rangeXLo_ = 0;
            _this.rangeYHi_ = 0;
            _this.rangeYLo_ = 0;
            _this.timeWindow_ = 10;
            _this.extraMargin = 0.01;
            _this.minSize = 1E-14;
            _this.axisChoice_ = AxisChoice_1.default.BOTH;
            _this.simView_ = simView;
            simView.addMemo(_this);
            simView.addObserver(_this);
            _this.lastIndex_ = repeat_1.default(-1, _this.graphLines_.length);
            _this.addParameter(new ParameterNumber_1.default(_this, AutoScale.TIME_WINDOW, function () { return _this.timeWindow; }, function (timeWindow) { return _this.timeWindow = timeWindow; }).setSignifDigits(3));
            var choiceNames = ['VERTICAL', 'HORIZONTAL', 'BOTH'];
            var choices = [AxisChoice_1.default.VERTICAL, AxisChoice_1.default.HORIZONTAL, AxisChoice_1.default.BOTH];
            _this.addParameter(new ParameterNumber_1.default(_this, AutoScale.AXIS, function () { return _this.axisChoice; }, function (axisChoice) { return _this.axisChoice = axisChoice; }, choiceNames, choices));
            _this.setComputed(_this.isActive_);
            return _this;
        }
        AutoScale.prototype.addGraphLine = function (graphLine) {
            if (GraphLine_1.default.isDuckType(graphLine)) {
                if (!contains_1.default(this.graphLines_, graphLine)) {
                    this.graphLines_.push(graphLine);
                    graphLine.addObserver(this);
                    this.lastIndex_.push(-1);
                }
            }
            else {
                throw new Error('not a GraphLine ' + graphLine);
            }
        };
        AutoScale.prototype.clearRange = function () {
            this.rangeXLo_ = 0;
            this.rangeXHi_ = 0;
            this.rangeSetX_ = false;
            this.rangeYLo_ = 0;
            this.rangeYHi_ = 0;
            this.rangeSetY_ = false;
        };
        Object.defineProperty(AutoScale.prototype, "active", {
            get: function () {
                return this.isActive_;
            },
            set: function (value) {
                if (this.isActive_ !== value) {
                    if (value) {
                        if (this.enabled_) {
                            this.reset();
                            this.simView_.addMemo(this);
                            this.setComputed(true);
                            this.isActive_ = true;
                            this.broadcast(new GenericEvent_1.default(this, AutoScale.ACTIVE, this.isActive_));
                        }
                    }
                    else {
                        this.simView_.removeMemo(this);
                        this.setComputed(false);
                        this.isActive_ = false;
                        this.broadcast(new GenericEvent_1.default(this, AutoScale.ACTIVE, this.isActive_));
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AutoScale.prototype, "axisChoice", {
            get: function () {
                return this.axisChoice_;
            },
            set: function (value) {
                if (value === AxisChoice_1.default.VERTICAL || value === AxisChoice_1.default.HORIZONTAL || value === AxisChoice_1.default.BOTH) {
                    this.axisChoice_ = value;
                    this.broadcastParameter(AutoScale.AXIS);
                }
                else {
                    throw new Error('unknown ' + value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AutoScale.prototype, "enabled", {
            get: function () {
                return this.enabled_;
            },
            set: function (enabled) {
                if (this.enabled_ !== enabled) {
                    this.enabled_ = enabled;
                    this.active = enabled;
                    this.broadcast(new GenericEvent_1.default(this, AutoScale.ENABLED, this.enabled_));
                }
            },
            enumerable: true,
            configurable: true
        });
        AutoScale.prototype.getRangeRect = function () {
            return new DoubleRect_1.default(this.rangeXLo_, this.rangeYLo_, this.rangeXHi_, this.rangeYHi_);
        };
        Object.defineProperty(AutoScale.prototype, "timeWindow", {
            get: function () {
                return this.timeWindow_;
            },
            set: function (timeWindow) {
                if (veryDifferent_1.default(timeWindow, this.timeWindow_)) {
                    this.timeWindow_ = timeWindow;
                    this.reset();
                    this.active = true;
                    this.broadcastParameter(AutoScale.TIME_WINDOW);
                }
            },
            enumerable: true,
            configurable: true
        });
        AutoScale.prototype.memorize = function () {
            for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                var graphPts = this.graphLines_[i].getGraphPoints();
                if (this.lastIndex_[i] > graphPts.getEndIndex()) {
                    this.reset();
                }
            }
            for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                var graphPts = this.graphLines_[i].getGraphPoints();
                var iter = graphPts.getIterator(this.lastIndex_[i]);
                while (iter.hasNext()) {
                    var gp = iter.nextValue();
                    this.updateRange_(this.graphLines_[i], gp.x, gp.y);
                    this.lastIndex_[i] = iter.getIndex();
                }
            }
            this.rangeCheck_();
        };
        AutoScale.prototype.observe = function (event) {
            if (event.getSubject() === this.simView_) {
                if (event.nameEquals(SimView_1.default.SIM_RECT_CHANGED)) {
                    if (!this.ownEvent_) {
                        this.active = false;
                    }
                }
            }
            else if (contains_1.default(this.graphLines_, event.getSubject())) {
                if (event.nameEquals(GraphLine_1.default.PARAM_NAME_X_VARIABLE) || event.nameEquals(GraphLine_1.default.PARAM_NAME_Y_VARIABLE)) {
                    this.reset();
                }
                else if (event.nameEquals(GraphLine_1.default.RESET)) {
                    this.active = true;
                }
            }
        };
        AutoScale.prototype.rangeCheck_ = function () {
            var e = this.minSize;
            if (this.rangeXHi_ - this.rangeXLo_ < e) {
                var avg = (this.rangeXHi_ + this.rangeXLo_) / 2;
                var incr = Math.max(avg * e, e);
                this.rangeXHi_ = avg + incr;
                this.rangeXLo_ = avg - incr;
            }
            if (this.rangeYHi_ - this.rangeYLo_ < e) {
                var avg = (this.rangeYHi_ + this.rangeYLo_) / 2;
                var incr = Math.max(avg * e, e);
                this.rangeYHi_ = avg + incr;
                this.rangeYLo_ = avg - incr;
            }
            var nr = this.getRangeRect();
            var sr = this.simView_.getSimRect();
            if (this.axisChoice_ === AxisChoice_1.default.VERTICAL) {
                nr = new DoubleRect_1.default(sr.getLeft(), nr.getBottom(), sr.getRight(), nr.getTop());
            }
            else if (this.axisChoice_ === AxisChoice_1.default.HORIZONTAL) {
                nr = new DoubleRect_1.default(nr.getLeft(), sr.getBottom(), nr.getRight(), sr.getTop());
            }
            if (this.isActive_ && !nr.nearEqual(sr)) {
                this.ownEvent_ = true;
                this.simView_.setSimRect(nr);
                this.ownEvent_ = false;
                this.broadcast(new GenericEvent_1.default(this, AutoScale.AUTO_SCALE, nr));
            }
        };
        AutoScale.prototype.removeGraphLine = function (graphLine) {
            if (GraphLine_1.default.isDuckType(graphLine)) {
                var idx = this.graphLines_.indexOf(graphLine);
                removeAt_1.default(this.graphLines_, idx);
                removeAt_1.default(this.lastIndex_, idx);
                this.reset();
            }
            else {
                throw new Error('not a GraphLine ' + graphLine);
            }
        };
        AutoScale.prototype.reset = function () {
            this.clearRange();
            for (var i = 0, n = this.lastIndex_.length; i < n; i++) {
                this.lastIndex_[i] = -1;
            }
        };
        AutoScale.prototype.setComputed = function (value) {
            var _this = this;
            var names = [SimView_1.default.PARAM_NAME_WIDTH, SimView_1.default.PARAM_NAME_HEIGHT, SimView_1.default.PARAM_NAME_CENTER_X, SimView_1.default.PARAM_NAME_CENTER_Y];
            names.forEach(function (name) {
                var p = _this.simView_.getParameter(name);
                p.setComputed(value);
            });
        };
        AutoScale.prototype.updateRange_ = function (line, nowX, nowY) {
            if (!isFinite(nowX)) {
                if (nowX === Number.POSITIVE_INFINITY) {
                    nowX = 1e308;
                }
                else if (nowX === Number.NEGATIVE_INFINITY) {
                    nowX = -1e308;
                }
            }
            if (!isFinite(nowY)) {
                if (nowY === Number.POSITIVE_INFINITY) {
                    nowY = 1e308;
                }
                else if (nowY === Number.NEGATIVE_INFINITY) {
                    nowY = -1e308;
                }
            }
            var timeIdx = line.varsList.timeIndex();
            var xIsTimeVar = line.hCoordIndex === timeIdx;
            var yIsTimeVar = line.vCoordIndex === timeIdx;
            if (!this.rangeSetX_) {
                this.rangeXLo_ = nowX;
                this.rangeXHi_ = nowX + (xIsTimeVar ? this.timeWindow_ : 0);
                this.rangeSetX_ = true;
            }
            else {
                if (nowX < this.rangeXLo_) {
                    if (xIsTimeVar) {
                        this.rangeXLo_ = nowX;
                        this.rangeXHi_ = nowX + this.timeWindow_;
                    }
                    else {
                        this.rangeXLo_ = nowX - this.extraMargin * (this.rangeXHi_ - this.rangeXLo_);
                    }
                }
                if (xIsTimeVar) {
                    if (nowX > this.rangeXHi_ - this.extraMargin * this.timeWindow_) {
                        this.rangeXHi_ = nowX + this.extraMargin * this.timeWindow_;
                        this.rangeXLo_ = this.rangeXHi_ - this.timeWindow_;
                    }
                }
                else {
                    if (nowX > this.rangeXHi_) {
                        this.rangeXHi_ = nowX + this.extraMargin * (this.rangeXHi_ - this.rangeXLo_);
                    }
                }
            }
            if (!this.rangeSetY_) {
                this.rangeYLo_ = nowY;
                this.rangeYHi_ = nowY + (yIsTimeVar ? this.timeWindow_ : 0);
                this.rangeSetY_ = true;
            }
            else {
                if (nowY < this.rangeYLo_) {
                    if (yIsTimeVar) {
                        this.rangeYLo_ = nowY;
                        this.rangeYHi_ = nowY + this.timeWindow_;
                    }
                    else {
                        this.rangeYLo_ = nowY - this.extraMargin * (this.rangeYHi_ - this.rangeYLo_);
                    }
                }
                if (yIsTimeVar) {
                    if (nowY > this.rangeYHi_ - this.extraMargin * this.timeWindow_) {
                        this.rangeYHi_ = nowY + this.extraMargin * this.timeWindow_;
                        this.rangeYLo_ = this.rangeYHi_ - this.timeWindow_;
                    }
                }
                else {
                    if (nowY > this.rangeYHi_) {
                        this.rangeYHi_ = nowY + this.extraMargin * (this.rangeYHi_ - this.rangeYLo_);
                    }
                }
            }
        };
        return AutoScale;
    }(AbstractSubject_1.default));
    AutoScale.AXIS = 'AXIS';
    AutoScale.TIME_WINDOW = 'TIME_WINDOW';
    AutoScale.ACTIVE = 'ACTIVE';
    AutoScale.AUTO_SCALE = 'AUTO_SCALE';
    AutoScale.ENABLED = 'ENABLED';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AutoScale;
});

define('davinci-newton/graph/DisplayAxes',["require", "exports", "../view/AlignH", "../view/AlignV", "../view/DoubleRect", "../math/Unit", "../checks/isDefined"], function (require, exports, AlignH_1, AlignV_1, DoubleRect_1, Unit_1, isDefined_1) {
    "use strict";
    function makeLabelScale(label, scale) {
        if (Unit_1.default.isOne(scale)) {
            return label;
        }
        else {
            return label + " / (" + scale + ")";
        }
    }
    var DisplayAxes = (function () {
        function DisplayAxes(simRect, font, color) {
            if (simRect === void 0) { simRect = DoubleRect_1.default.EMPTY_RECT; }
            if (font === void 0) { font = '14pt sans-serif'; }
            if (color === void 0) { color = 'gray'; }
            this.simRect_ = simRect;
            this.numFont_ = font;
            this.drawColor_ = color;
            this.fontDescent = 8;
            this.fontAscent = 12;
            this.hAxisAlign_ = AlignV_1.default.BOTTOM;
            this.vAxisAlign_ = AlignH_1.default.LEFT;
            this.numDecimal_ = 0;
            this.needRedraw_ = true;
            this.hLabel_ = 'x';
            this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
            this.vLabel_ = 'y';
            this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
            this.zIndex_ = 100;
        }
        DisplayAxes.prototype.draw = function (context, map) {
            context.save();
            context.strokeStyle = this.drawColor_;
            context.fillStyle = this.drawColor_;
            context.font = this.numFont_;
            context.textAlign = 'start';
            context.textBaseline = 'alphabetic';
            var x0;
            var y0;
            var r = this.simRect_;
            var sim_x1 = r.getLeft();
            var sim_x2 = r.getRight();
            var sim_y1 = r.getBottom();
            var sim_y2 = r.getTop();
            switch (this.vAxisAlign_) {
                case AlignH_1.default.RIGHT:
                    x0 = map.simToScreenX(sim_x2 - 0.05 * (sim_x2 - sim_x1));
                    break;
                case AlignH_1.default.LEFT:
                    x0 = map.simToScreenX(sim_x1 + 0.05 * (sim_x2 - sim_x1));
                    break;
                default:
                    x0 = map.simToScreenX(r.getCenterX());
            }
            switch (this.hAxisAlign_) {
                case AlignV_1.default.TOP:
                    y0 = map.simToScreenY(sim_y2) + (10 + this.fontDescent + this.fontAscent);
                    break;
                case AlignV_1.default.BOTTOM:
                    y0 = map.simToScreenY(sim_y1) - (10 + this.fontDescent + this.fontAscent);
                    break;
                default:
                    y0 = map.simToScreenY(r.getCenterY());
            }
            context.beginPath();
            context.moveTo(map.simToScreenX(sim_x1), y0);
            context.lineTo(map.simToScreenX(sim_x2), y0);
            context.stroke();
            this.drawHorizTicks(y0, context, map, this.simRect_);
            context.beginPath();
            context.moveTo(x0, map.simToScreenY(sim_y1));
            context.lineTo(x0, map.simToScreenY(sim_y2));
            context.stroke();
            this.drawVertTicks(x0, context, map, this.simRect_);
            context.restore();
            this.needRedraw_ = false;
        };
        DisplayAxes.prototype.drawHorizTicks = function (y0, context, map, r) {
            var y1 = y0 - 4;
            var y2 = y1 + 8;
            var sim_x1 = r.getLeft();
            var sim_x2 = r.getRight();
            var graphDelta = this.getNiceIncrement(sim_x2 - sim_x1);
            var x_sim = DisplayAxes.getNiceStart(sim_x1, graphDelta);
            while (x_sim < sim_x2) {
                var x_screen = map.simToScreenX(x_sim);
                context.beginPath();
                context.moveTo(x_screen, y1);
                context.lineTo(x_screen, y2);
                context.stroke();
                var next_x_sim = x_sim + graphDelta;
                if (next_x_sim > x_sim) {
                    var s = x_sim.toFixed(this.numDecimal_);
                    var textWidth = context.measureText(s).width;
                    context.fillText(s, x_screen - textWidth / 2, y2 + this.fontAscent);
                }
                else {
                    context.fillText('scale is too small', x_screen, y2 + this.fontAscent);
                    break;
                }
                x_sim = next_x_sim;
            }
            var hLabel = this.hLabelScaleCache_;
            var w = context.measureText(hLabel).width;
            context.fillText(hLabel, map.simToScreenX(sim_x2) - w - 5, y0 - 8);
        };
        DisplayAxes.prototype.drawVertTicks = function (x0, context, map, r) {
            var x1 = x0 - 4;
            var x2 = x1 + 8;
            var sim_y1 = r.getBottom();
            var sim_y2 = r.getTop();
            var graphDelta = this.getNiceIncrement(sim_y2 - sim_y1);
            var y_sim = DisplayAxes.getNiceStart(sim_y1, graphDelta);
            while (y_sim < sim_y2) {
                var y_screen = map.simToScreenY(y_sim);
                context.beginPath();
                context.moveTo(x1, y_screen);
                context.lineTo(x2, y_screen);
                context.stroke();
                var next_y_sim = y_sim + graphDelta;
                if (next_y_sim > y_sim) {
                    var s = y_sim.toFixed(this.numDecimal_);
                    var textWidth = context.measureText(s).width;
                    if (this.vAxisAlign_ === AlignH_1.default.RIGHT) {
                        context.fillText(s, x2 - (textWidth + 10), y_screen + (this.fontAscent / 2));
                    }
                    else {
                        context.fillText(s, x2 + 5, y_screen + (this.fontAscent / 2));
                    }
                }
                else {
                    context.fillText('scale is too small', x2, y_screen);
                    break;
                }
                y_sim = next_y_sim;
            }
            var vLabel = this.vLabelScaleCache_;
            var w = context.measureText(vLabel).width;
            if (this.vAxisAlign_ === AlignH_1.default.RIGHT) {
                context.fillText(vLabel, x0 - (w + 6), map.simToScreenY(sim_y2) + 13);
            }
            else {
                context.fillText(vLabel, x0 + 6, map.simToScreenY(sim_y2) + 13);
            }
        };
        Object.defineProperty(DisplayAxes.prototype, "color", {
            get: function () {
                return this.drawColor_;
            },
            set: function (color) {
                this.drawColor_ = color;
                this.needRedraw_ = true;
            },
            enumerable: true,
            configurable: true
        });
        DisplayAxes.prototype.getFont = function () {
            return this.numFont_;
        };
        Object.defineProperty(DisplayAxes.prototype, "hAxisLabel", {
            get: function () {
                return this.hLabel_;
            },
            set: function (hAxisLabel) {
                this.hLabel_ = hAxisLabel;
                this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
                this.needRedraw_ = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayAxes.prototype, "hAxisScale", {
            get: function () {
                return this.hScale_;
            },
            set: function (hAxisScale) {
                this.hScale_ = hAxisScale;
                this.hLabelScaleCache_ = makeLabelScale(this.hLabel_, this.hScale_);
                this.needRedraw_ = true;
            },
            enumerable: true,
            configurable: true
        });
        DisplayAxes.prototype.getNiceIncrement = function (range) {
            var power = Math.pow(10, Math.floor(Math.log(range) / Math.LN10));
            var logTot = range / power;
            var incr;
            if (logTot >= 8)
                incr = 2;
            else if (logTot >= 5)
                incr = 1;
            else if (logTot >= 3)
                incr = 0.5;
            else if (logTot >= 2)
                incr = 0.4;
            else
                incr = 0.2;
            incr *= power;
            var dlog = Math.log(incr) / Math.LN10;
            this.numDecimal_ = (dlog < 0) ? Math.ceil(-dlog) : 0;
            return incr;
        };
        DisplayAxes.getNiceStart = function (start, incr) {
            return Math.ceil(start / incr) * incr;
        };
        DisplayAxes.prototype.getSimRect = function () {
            return this.simRect_;
        };
        Object.defineProperty(DisplayAxes.prototype, "vAxisLabel", {
            get: function () {
                return this.vLabel_;
            },
            set: function (vAxisLabel) {
                this.vLabel_ = vAxisLabel;
                this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
                this.needRedraw_ = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayAxes.prototype, "vAxisScale", {
            get: function () {
                return this.vScale_;
            },
            set: function (vAxisScale) {
                this.vScale_ = vAxisScale;
                this.vLabelScaleCache_ = makeLabelScale(this.vLabel_, this.vScale_);
                this.needRedraw_ = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayAxes.prototype, "hAxisAlign", {
            get: function () {
                return this.hAxisAlign_;
            },
            set: function (alignment) {
                this.hAxisAlign_ = alignment;
                this.needRedraw_ = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DisplayAxes.prototype, "vAxisAlign", {
            get: function () {
                return this.vAxisAlign_;
            },
            set: function (alignment) {
                this.vAxisAlign_ = alignment;
                this.needRedraw_ = true;
            },
            enumerable: true,
            configurable: true
        });
        DisplayAxes.prototype.getZIndex = function () {
            return this.zIndex_;
        };
        DisplayAxes.prototype.isDragable = function () {
            return false;
        };
        DisplayAxes.prototype.needsRedraw = function () {
            return this.needRedraw_;
        };
        DisplayAxes.prototype.setDragable = function (dragable) {
        };
        DisplayAxes.prototype.setFont = function (font) {
            this.numFont_ = font;
            this.needRedraw_ = true;
        };
        DisplayAxes.prototype.setSimRect = function (simRect) {
            this.simRect_ = simRect;
            this.needRedraw_ = true;
        };
        DisplayAxes.prototype.setZIndex = function (zIndex) {
            if (isDefined_1.default(zIndex)) {
                this.zIndex_ = zIndex;
            }
        };
        return DisplayAxes;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DisplayAxes;
});

define('davinci-newton/util/GenericObserver',["require", "exports"], function (require, exports) {
    "use strict";
    var GenericObserver = (function () {
        function GenericObserver(subject, observeFn) {
            this.subject_ = subject;
            subject.addObserver(this);
            this.observeFn_ = observeFn;
        }
        GenericObserver.prototype.disconnect = function () {
            this.subject_.removeObserver(this);
        };
        GenericObserver.prototype.observe = function (event) {
            this.observeFn_(event);
        };
        return GenericObserver;
    }());
    exports.GenericObserver = GenericObserver;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GenericObserver;
});

define('davinci-newton/util/isEmpty',["require", "exports"], function (require, exports) {
    "use strict";
    function isEmpty(xs) {
        return xs.length === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isEmpty;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/view/LabCanvas',["require", "exports", "../util/AbstractSubject", "../util/clone", "../util/contains", "../util/GenericEvent", "../util/isEmpty", "../checks/isNumber", "../checks/mustBeNonNullObject", "../util/remove", "./ScreenRect", "../util/veryDifferent"], function (require, exports, AbstractSubject_1, clone_1, contains_1, GenericEvent_1, isEmpty_1, isNumber_1, mustBeNonNullObject_1, remove_1, ScreenRect_1, veryDifferent_1) {
    "use strict";
    var WIDTH = 'width';
    var HEIGHT = 'height';
    var ALPHA = 'alpha';
    var BACKGROUND = 'background';
    var LabCanvas = (function (_super) {
        __extends(LabCanvas, _super);
        function LabCanvas(canvas) {
            var _this = _super.call(this) || this;
            _this.labViews_ = [];
            _this.memorizables_ = [];
            _this.focusView_ = null;
            _this.alpha_ = 1;
            _this.background_ = '';
            _this.canvas_ = canvas;
            canvas.contentEditable = 'false';
            return _this;
        }
        LabCanvas.prototype.addMemo = function (memorizable) {
            if (!contains_1.default(this.memorizables_, memorizable)) {
                this.memorizables_.push(memorizable);
            }
        };
        LabCanvas.prototype.addView = function (view) {
            mustBeNonNullObject_1.default('view', view);
            if (this.getWidth() > 0 && this.getHeight() > 0) {
                var screenRect = new ScreenRect_1.default(0, 0, this.getWidth(), this.getHeight());
                view.setScreenRect(screenRect);
            }
            this.labViews_.push(view);
            this.addMemo(view);
            this.broadcast(new GenericEvent_1.default(this, LabCanvas.VIEW_ADDED, view));
            this.broadcast(new GenericEvent_1.default(this, LabCanvas.VIEW_LIST_MODIFIED));
            if (this.focusView_ == null) {
                this.setFocusView(view);
            }
        };
        LabCanvas.prototype.focus = function () {
            this.canvas_.focus();
        };
        LabCanvas.prototype.getAlpha = function () {
            return this.alpha_;
        };
        LabCanvas.prototype.getBackground = function () {
            return this.background_;
        };
        LabCanvas.prototype.getCanvas = function () {
            return this.canvas_;
        };
        LabCanvas.prototype.getContext = function () {
            return this.canvas_.getContext('2d');
        };
        LabCanvas.prototype.getFocusView = function () {
            return this.focusView_;
        };
        LabCanvas.prototype.getHeight = function () {
            return this.canvas_.height;
        };
        LabCanvas.prototype.getMemos = function () {
            return clone_1.default(this.memorizables_);
        };
        LabCanvas.prototype.getScreenRect = function () {
            return new ScreenRect_1.default(0, 0, this.canvas_.width, this.canvas_.height);
        };
        LabCanvas.prototype.getViews = function () {
            return clone_1.default(this.labViews_);
        };
        LabCanvas.prototype.getWidth = function () {
            return this.canvas_.width;
        };
        LabCanvas.prototype.memorize = function () {
            for (var i = 0, n = this.memorizables_.length; i < n; i++) {
                this.memorizables_[i].memorize();
            }
        };
        LabCanvas.prototype.notifySizeChanged = function () {
            var r = this.getScreenRect();
            this.labViews_.forEach(function (view) {
                view.setScreenRect(r);
            });
            this.broadcast(new GenericEvent_1.default(this, LabCanvas.SIZE_CHANGED));
        };
        LabCanvas.prototype.paint = function () {
            if (this.canvas_.offsetParent != null) {
                var context = this.canvas_.getContext('2d');
                context.save();
                if (this.background_ !== '') {
                    context.globalAlpha = this.alpha_;
                    context.fillStyle = this.background_;
                    context.fillRect(0, 0, this.canvas_.width, this.canvas_.height);
                    context.globalAlpha = 1;
                }
                else {
                    context.clearRect(0, 0, this.canvas_.width, this.canvas_.height);
                }
                var vs = this.labViews_;
                var N = vs.length;
                for (var i = 0; i < N; i++) {
                    vs[i].paint(context);
                }
                context.restore();
            }
        };
        LabCanvas.prototype.removeMemo = function (memorizable) {
            remove_1.default(this.memorizables_, memorizable);
        };
        LabCanvas.prototype.removeView = function (view) {
            mustBeNonNullObject_1.default('view', view);
            remove_1.default(this.labViews_, view);
            this.removeMemo(view);
            if (this.focusView_ === view) {
                this.setFocusView(isEmpty_1.default(this.labViews_) ? null : this.labViews_[0]);
            }
            this.broadcast(new GenericEvent_1.default(this, LabCanvas.VIEW_REMOVED, view));
            this.broadcast(new GenericEvent_1.default(this, LabCanvas.VIEW_LIST_MODIFIED));
        };
        LabCanvas.prototype.setAlpha = function (value) {
            if (veryDifferent_1.default(this.alpha_, value)) {
                this.alpha_ = value;
                if (veryDifferent_1.default(value, 1) && this.background_ === '') {
                    this.setBackground('white');
                }
                this.broadcastParameter(ALPHA);
            }
        };
        LabCanvas.prototype.setBackground = function (value) {
            if (this.background_ !== value) {
                this.background_ = value;
                this.broadcastParameter(BACKGROUND);
            }
        };
        LabCanvas.prototype.setFocusView = function (view) {
            if (view != null && !contains_1.default(this.labViews_, view))
                throw new Error('cannot set focus to unknown view ' + view);
            if (this.focusView_ !== view) {
                if (this.focusView_ != null) {
                    this.focusView_.loseFocus();
                }
                this.focusView_ = view;
                if (view != null) {
                    view.gainFocus();
                }
                this.broadcast(new GenericEvent_1.default(this, LabCanvas.FOCUS_VIEW_CHANGED, view));
            }
        };
        LabCanvas.prototype.setHeight = function (value) {
            if (veryDifferent_1.default(value, this.canvas_.height)) {
                this.canvas_.height = value;
            }
            this.notifySizeChanged();
            this.broadcastParameter(HEIGHT);
        };
        LabCanvas.prototype.setScreenRect = function (sr) {
            if (!ScreenRect_1.default.isDuckType(sr)) {
                throw new Error('not a ScreenRect ' + sr);
            }
            if (sr.getTop() !== 0 || sr.getLeft() !== 0) {
                throw new Error('top left must be 0,0, was: ' + sr);
            }
            this.setSize(sr.getWidth(), sr.getHeight());
        };
        LabCanvas.prototype.setSize = function (width, height) {
            if (!isNumber_1.default(width) || width <= 0 || !isNumber_1.default(height) || height <= 0) {
                throw new Error('bad size ' + width + ', ' + height);
            }
            this.canvas_.width = width;
            this.canvas_.height = height;
            this.notifySizeChanged();
            this.broadcastParameter(WIDTH);
            this.broadcastParameter(HEIGHT);
        };
        ;
        LabCanvas.prototype.setWidth = function (value) {
            if (veryDifferent_1.default(value, this.canvas_.width)) {
                this.canvas_.width = value;
            }
            this.notifySizeChanged();
            this.broadcastParameter(WIDTH);
        };
        return LabCanvas;
    }(AbstractSubject_1.default));
    LabCanvas.FOCUS_VIEW_CHANGED = 'FOCUS_VIEW_CHANGED';
    LabCanvas.SIZE_CHANGED = 'SIZE_CHANGED';
    LabCanvas.VIEW_LIST_MODIFIED = 'VIEW_LIST_MODIFIED';
    LabCanvas.VIEW_ADDED = 'VIEW_ADDED';
    LabCanvas.VIEW_REMOVED = 'VIEW_REMOVED';
    exports.LabCanvas = LabCanvas;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LabCanvas;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/graph/Graph',["require", "exports", "../util/AbstractSubject", "../view/AlignH", "../view/AlignV", "./AutoScale", "./DisplayAxes", "./DisplayGraph", "../view/DoubleRect", "../util/GenericObserver", "./GraphLine", "../view/LabCanvas", "../checks/mustBeNumber", "../checks/mustBeString", "../view/SimView"], function (require, exports, AbstractSubject_1, AlignH_1, AlignV_1, AutoScale_1, DisplayAxes_1, DisplayGraph_1, DoubleRect_1, GenericObserver_1, GraphLine_1, LabCanvas_1, mustBeNumber_1, mustBeString_1, SimView_1) {
    "use strict";
    var Graph = (function (_super) {
        __extends(Graph, _super);
        function Graph(canvasId, varsList) {
            var _this = _super.call(this) || this;
            _this.varsList = varsList;
            _this.view = new SimView_1.default(new DoubleRect_1.default(0, 0, 1, 1));
            _this.autoScale = new AutoScale_1.default(_this.view);
            var canvas = document.getElementById(canvasId);
            _this.labCanvas = new LabCanvas_1.default(canvas);
            _this.view.hAxisAlign = AlignH_1.default.FULL;
            _this.view.vAxisAlign = AlignV_1.default.FULL;
            _this.labCanvas.addView(_this.view);
            _this.displayGraph = new DisplayGraph_1.default();
            _this.displayGraph.setScreenRect(_this.view.getScreenRect());
            _this.view.getDisplayList().prepend(_this.displayGraph);
            _this.timeIdx_ = varsList.timeIndex();
            _this.axes = new DisplayAxes_1.default(_this.view.getSimRect());
            new GenericObserver_1.default(_this.view, function (event) {
                if (event.nameEquals(SimView_1.default.COORD_MAP_CHANGED)) {
                    var simRect = _this.view.getCoordMap().screenToSimRect(_this.view.getScreenRect());
                    _this.axes.setSimRect(simRect);
                }
            });
            _this.view.getDisplayList().add(_this.axes);
            _this.autoScale.extraMargin = 0.05;
            return _this;
        }
        Graph.prototype.addGraphLine = function (hCoordIndex, vCoordIndex, color) {
            if (color === void 0) { color = 'black'; }
            mustBeNumber_1.default('hCoordIndex', hCoordIndex);
            mustBeNumber_1.default('vCoordIndex', vCoordIndex);
            mustBeString_1.default('color', color);
            var graphLine = new GraphLine_1.default(this.varsList);
            this.view.addMemo(graphLine);
            graphLine.hCoordIndex = hCoordIndex;
            graphLine.vCoordIndex = vCoordIndex;
            graphLine.color = color;
            graphLine.hotspotColor = color;
            this.displayGraph.addGraphLine(graphLine);
            this.displayGraph.setUseBuffer(graphLine.hCoordIndex !== this.timeIdx_);
            return graphLine;
        };
        Graph.prototype.removeGraphLine = function (graphLine) {
            this.displayGraph.removeGraphLine(graphLine);
        };
        Graph.prototype.memorize = function () {
            this.labCanvas.memorize();
        };
        Graph.prototype.render = function () {
            this.labCanvas.paint();
        };
        Graph.prototype.reset = function () {
            this.autoScale.reset();
            this.displayGraph.reset();
        };
        return Graph;
    }(AbstractSubject_1.default));
    exports.Graph = Graph;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Graph;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/core/SimList',["require", "exports", "../util/AbstractSubject", "../util/contains", "../util/GenericEvent", "../checks/mustBeNonNullObject", "../util/remove"], function (require, exports, AbstractSubject_1, contains_1, GenericEvent_1, mustBeNonNullObject_1, remove_1) {
    "use strict";
    var SimList = (function (_super) {
        __extends(SimList, _super);
        function SimList() {
            var _this = _super.call(this) || this;
            _this.elements_ = [];
            return _this;
        }
        SimList.prototype.add = function (simObject) {
            for (var i = 0; i < arguments.length; i++) {
                var element = arguments[i];
                mustBeNonNullObject_1.default('element', element);
                if (!contains_1.default(this.elements_, element)) {
                    this.elements_.push(element);
                    this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_ADDED, element));
                }
            }
        };
        SimList.prototype.forEach = function (callBack) {
            return this.elements_.forEach(callBack);
        };
        SimList.prototype.remove = function (simObject) {
            if (remove_1.default(this.elements_, simObject)) {
                this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_REMOVED, simObject));
            }
        };
        SimList.prototype.removeTemporary = function (time) {
            for (var i = this.elements_.length - 1; i >= 0; i--) {
                var simobj = this.elements_[i];
                if (simobj.expireTime < time) {
                    this.elements_.splice(i, 1);
                    this.broadcast(new GenericEvent_1.default(this, SimList.OBJECT_REMOVED, simobj));
                }
            }
        };
        return SimList;
    }(AbstractSubject_1.default));
    SimList.OBJECT_ADDED = 'OBJECT_ADDED';
    SimList.OBJECT_REMOVED = 'OBJECT_REMOVED';
    exports.SimList = SimList;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimList;
});

define('davinci-newton/model/ConcreteVariable',["require", "exports", "../util/toName", "../util/validName"], function (require, exports, toName_1, validName_1) {
    "use strict";
    var ConcreteVariable = (function () {
        function ConcreteVariable(varsList_, name) {
            this.varsList_ = varsList_;
            this.value_ = 0;
            this.seq_ = 0;
            this.isComputed_ = false;
            this.doesBroadcast_ = false;
            this.name_ = validName_1.default(toName_1.default(name));
        }
        ConcreteVariable.prototype.getBroadcast = function () {
            return this.doesBroadcast_;
        };
        Object.defineProperty(ConcreteVariable.prototype, "name", {
            get: function () {
                return this.name_;
            },
            enumerable: true,
            configurable: true
        });
        ConcreteVariable.prototype.getSequence = function () {
            return this.seq_;
        };
        ConcreteVariable.prototype.getSubject = function () {
            return this.varsList_;
        };
        ConcreteVariable.prototype.getValue = function () {
            return this.value_;
        };
        ConcreteVariable.prototype.nameEquals = function (name) {
            return this.name_ === toName_1.default(name);
        };
        ConcreteVariable.prototype.setBroadcast = function (value) {
            this.doesBroadcast_ = value;
        };
        ConcreteVariable.prototype.setComputed = function (value) {
            this.isComputed_ = value;
        };
        ConcreteVariable.prototype.setValue = function (value) {
            if (this.value_ !== value) {
                this.value_ = value;
                this.seq_++;
                if (this.doesBroadcast_) {
                    this.varsList_.broadcast(this);
                }
            }
        };
        ConcreteVariable.prototype.setValueSmooth = function (value) {
            this.value_ = value;
        };
        ConcreteVariable.prototype.incrSequence = function () {
            this.seq_++;
        };
        return ConcreteVariable;
    }());
    exports.ConcreteVariable = ConcreteVariable;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ConcreteVariable;
});

define('davinci-newton/util/extendArray',["require", "exports", "../checks/isArray"], function (require, exports, isArray_1) {
    "use strict";
    function extendArray(array, quantity, value) {
        if (quantity === 0) {
            return;
        }
        if (quantity < 0) {
            throw new Error();
        }
        var startIdx = array.length;
        array.length = startIdx + quantity;
        if (isArray_1.default(value)) {
            var vs = value;
            if (vs.length !== quantity) {
                throw new Error();
            }
            for (var i = startIdx, n = array.length; i < n; i++) {
                array[i] = value[i - startIdx];
            }
        }
        else {
            for (var i = startIdx, n = array.length; i < n; i++) {
                array[i] = value;
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = extendArray;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/core/VarsList',["require", "exports", "../util/AbstractSubject", "../util/clone", "../model/ConcreteVariable", "../util/extendArray", "../util/find", "../util/findIndex", "../util/GenericEvent", "../checks/isNumber", "../checks/isString", "../util/toName", "../util/validName"], function (require, exports, AbstractSubject_1, clone_1, ConcreteVariable_1, extendArray_1, find_1, findIndex_1, GenericEvent_1, isNumber_1, isString_1, toName_1, validName_1) {
    "use strict";
    var VarsList = (function (_super) {
        __extends(VarsList, _super);
        function VarsList(names) {
            var _this = _super.call(this) || this;
            _this.timeIdx_ = -1;
            _this.varList_ = [];
            _this.history_ = true;
            _this.histArray_ = [];
            var howMany = names.length;
            if (howMany !== 0) {
                _this.addVariables(names);
            }
            return _this;
        }
        VarsList.prototype.findOpenSlot_ = function (quantity) {
            var found = 0;
            var startIdx = -1;
            for (var i = 0, n = this.varList_.length; i < n; i++) {
                if (this.varList_[i].name === VarsList.DELETED) {
                    if (startIdx === -1) {
                        startIdx = i;
                    }
                    found++;
                    if (found >= quantity) {
                        return startIdx;
                    }
                }
                else {
                    startIdx = -1;
                    found = 0;
                }
            }
            var expand;
            if (found > 0) {
                expand = quantity - found;
            }
            else {
                startIdx = this.varList_.length;
                expand = quantity;
            }
            var newVars = [];
            for (var i = 0; i < expand; i++) {
                newVars.push(new ConcreteVariable_1.default(this, VarsList.DELETED));
            }
            extendArray_1.default(this.varList_, expand, newVars);
            return startIdx;
        };
        VarsList.prototype.addVariables = function (names) {
            var howMany = names.length;
            if (howMany === 0) {
                throw new Error();
            }
            var position = this.findOpenSlot_(howMany);
            for (var i = 0; i < howMany; i++) {
                var name_1 = validName_1.default(toName_1.default(names[i]));
                if (name_1 === VarsList.DELETED) {
                    throw new Error("variable cannot be named '" + VarsList.DELETED + "'");
                }
                var idx = position + i;
                this.varList_[idx] = new ConcreteVariable_1.default(this, name_1);
                if (name_1 === VarsList.TIME) {
                    this.timeIdx_ = idx;
                }
            }
            this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
            return position;
        };
        VarsList.prototype.deleteVariables = function (index, howMany) {
            if (howMany === 0) {
                return;
            }
            if (howMany < 0 || index < 0 || index + howMany > this.varList_.length) {
                throw new Error('deleteVariables');
            }
            for (var i = index; i < index + howMany; i++) {
                this.varList_[i] = new ConcreteVariable_1.default(this, VarsList.DELETED);
            }
            this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
        };
        VarsList.prototype.incrSequence = function () {
            var indexes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                indexes[_i] = arguments[_i];
            }
            if (arguments.length === 0) {
                for (var i = 0, n = this.varList_.length; i < n; i++) {
                    this.varList_[i].incrSequence();
                }
            }
            else {
                for (var i = 0, n = arguments.length; i < n; i++) {
                    var idx = arguments[i];
                    this.checkIndex_(idx);
                    this.varList_[idx].incrSequence();
                }
            }
        };
        VarsList.prototype.getValue = function (index) {
            this.checkIndex_(index);
            return this.varList_[index].getValue();
        };
        VarsList.prototype.getName = function (index) {
            this.checkIndex_(index);
            return this.varList_[index].name;
        };
        VarsList.prototype.getSequence = function (index) {
            this.checkIndex_(index);
            return this.varList_[index].getSequence();
        };
        VarsList.prototype.getValues = function () {
            return this.varList_.map(function (v) { return v.getValue(); });
        };
        VarsList.prototype.setValues = function (vars, continuous) {
            if (continuous === void 0) { continuous = false; }
            var N = this.varList_.length;
            var n = vars.length;
            if (n > N) {
                throw new Error("setValues bad length n = " + n + " > N = " + N);
            }
            for (var i = 0; i < N; i++) {
                if (i < n) {
                    this.setValue(i, vars[i], continuous);
                }
            }
        };
        VarsList.prototype.setValue = function (index, value, continuous) {
            if (continuous === void 0) { continuous = false; }
            this.checkIndex_(index);
            var variable = this.varList_[index];
            if (isNaN(value)) {
                throw new Error('cannot set variable ' + variable.name + ' to NaN');
            }
            if (continuous) {
                variable.setValueSmooth(value);
            }
            else {
                variable.setValue(value);
            }
        };
        VarsList.prototype.checkIndex_ = function (index) {
            if (index < 0 || index >= this.varList_.length) {
                throw new Error('bad variable index=' + index + '; numVars=' + this.varList_.length);
            }
        };
        VarsList.prototype.addVariable = function (variable) {
            var name = variable.name;
            if (name === VarsList.DELETED) {
                throw new Error("variable cannot be named '" + VarsList.DELETED + "'");
            }
            var position = this.findOpenSlot_(1);
            this.varList_[position] = variable;
            if (name === VarsList.TIME) {
                this.timeIdx_ = position;
            }
            this.broadcast(new GenericEvent_1.default(this, VarsList.VARS_MODIFIED));
            return position;
        };
        VarsList.prototype.getHistory = function () {
            return this.history_;
        };
        VarsList.prototype.getParameter = function (name) {
            name = toName_1.default(name);
            var p = find_1.default(this.varList_, function (p) {
                return p.name === name;
            });
            if (p != null) {
                return p;
            }
            throw new Error('Parameter not found ' + name);
        };
        VarsList.prototype.getParameters = function () {
            return clone_1.default(this.varList_);
        };
        VarsList.prototype.getTime = function () {
            if (this.timeIdx_ < 0) {
                throw new Error('no time variable');
            }
            return this.getValue(this.timeIdx_);
        };
        VarsList.prototype.getVariable = function (id) {
            var index;
            if (isNumber_1.default(id)) {
                index = id;
            }
            else if (isString_1.default(id)) {
                id = toName_1.default(id);
                index = findIndex_1.default(this.varList_, function (v) { return v.name === id; });
                if (index < 0) {
                    throw new Error('unknown variable name ' + id);
                }
            }
            else {
                throw new Error();
            }
            this.checkIndex_(index);
            return this.varList_[index];
        };
        VarsList.prototype.numVariables = function () {
            return this.varList_.length;
        };
        VarsList.prototype.saveHistory = function () {
            if (this.history_) {
                var v = this.getValues();
                v.push(this.getTime());
                this.histArray_.push(v);
                if (this.histArray_.length > 20) {
                    this.histArray_.shift();
                }
            }
        };
        VarsList.prototype.setComputed = function () {
            var indexes = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                indexes[_i] = arguments[_i];
            }
            for (var i = 0, n = arguments.length; i < n; i++) {
                var idx = arguments[i];
                this.checkIndex_(idx);
                this.varList_[idx].setComputed(true);
            }
        };
        VarsList.prototype.setHistory = function (value) {
            this.history_ = value;
        };
        VarsList.prototype.setTime = function (time) {
            this.setValue(this.timeIdx_, time);
        };
        VarsList.prototype.timeIndex = function () {
            return this.timeIdx_;
        };
        VarsList.prototype.toArray = function () {
            return clone_1.default(this.varList_);
        };
        return VarsList;
    }(AbstractSubject_1.default));
    VarsList.DELETED = 'DELETED';
    VarsList.TIME = 'TIME';
    VarsList.VARS_MODIFIED = 'VARS_MODIFIED';
    exports.VarsList = VarsList;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VarsList;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/Physics3',["require", "exports", "../util/AbstractSubject", "../util/contains", "../math/Geometric3", "../math/isZeroBivectorE3", "../math/isZeroVectorE3", "../util/remove", "../core/SimList", "../math/Unit", "../core/VarsList", "../math/wedge3"], function (require, exports, AbstractSubject_1, contains_1, Geometric3_1, isZeroBivectorE3_1, isZeroVectorE3_1, remove_1, SimList_1, Unit_1, VarsList_1, wedge3_1) {
    "use strict";
    var var_names = [
        VarsList_1.default.TIME,
        "translational kinetic energy",
        "rotational kinetic energy",
        "potential energy",
        "total energy",
        "total linear momentum - x",
        "total linear momentum - y",
        "total linear momentum - z",
        "total angular momentum - yz",
        "total angular momentum - zx",
        "total angular momentum - xy"
    ];
    function getVarName(index) {
        switch (index) {
            case Physics3.OFFSET_POSITION_X: return "position x";
            case Physics3.OFFSET_POSITION_Y: return "position y";
            case Physics3.OFFSET_POSITION_Z: return "position z";
            case Physics3.OFFSET_ATTITUDE_A: return "attitude a";
            case Physics3.OFFSET_ATTITUDE_YZ: return "attitude yz";
            case Physics3.OFFSET_ATTITUDE_ZX: return "attitude zx";
            case Physics3.OFFSET_ATTITUDE_XY: return "attitude xy";
            case Physics3.OFFSET_LINEAR_MOMENTUM_X: return "linear momentum x";
            case Physics3.OFFSET_LINEAR_MOMENTUM_Y: return "linear momentum y";
            case Physics3.OFFSET_LINEAR_MOMENTUM_Z: return "linear momentum z";
            case Physics3.OFFSET_ANGULAR_MOMENTUM_YZ: return "angular momentum yz";
            case Physics3.OFFSET_ANGULAR_MOMENTUM_ZX: return "angular momentum zx";
            case Physics3.OFFSET_ANGULAR_MOMENTUM_XY: return "angular momentum xy";
        }
        throw new Error("getVarName(" + index + ")");
    }
    var NUM_VARIABLES_PER_BODY = 13;
    var Physics3 = (function (_super) {
        __extends(Physics3, _super);
        function Physics3() {
            var _this = _super.call(this) || this;
            _this.simList_ = new SimList_1.default();
            _this.bodies_ = [];
            _this.forceLaws_ = [];
            _this.showForces_ = false;
            _this.potentialOffset_ = Geometric3_1.default.scalar(0);
            _this.force_ = Geometric3_1.default.vector(0, 0, 0);
            _this.torque_ = Geometric3_1.default.bivector(0, 0, 0);
            _this.totalEnergy_ = Geometric3_1.default.scalar(0);
            _this.totalEnergyLock_ = _this.totalEnergy_.lock();
            _this.varsList_ = new VarsList_1.default(var_names);
            return _this;
        }
        Object.defineProperty(Physics3.prototype, "showForces", {
            get: function () {
                return this.showForces_;
            },
            set: function (showForces) {
                this.showForces_ = showForces;
            },
            enumerable: true,
            configurable: true
        });
        Physics3.prototype.addBody = function (body) {
            if (!contains_1.default(this.bodies_, body)) {
                var names = [];
                for (var k = 0; k < NUM_VARIABLES_PER_BODY; k++) {
                    names.push(getVarName(k));
                }
                body.varsIndex = this.varsList_.addVariables(names);
                this.bodies_.push(body);
                this.simList_.add(body);
            }
            this.updateFromBody(body);
            this.discontinuosChangeToEnergy();
        };
        Physics3.prototype.removeBody = function (body) {
            if (contains_1.default(this.bodies_, body)) {
                this.varsList_.deleteVariables(body.varsIndex, NUM_VARIABLES_PER_BODY);
                remove_1.default(this.bodies_, body);
                body.varsIndex = -1;
            }
            this.simList_.remove(body);
            this.discontinuosChangeToEnergy();
        };
        Physics3.prototype.addForceLaw = function (forceLaw) {
            if (!contains_1.default(this.forceLaws_, forceLaw)) {
                this.forceLaws_.push(forceLaw);
            }
            this.discontinuosChangeToEnergy();
        };
        Physics3.prototype.removeForceLaw = function (forceLaw) {
            forceLaw.disconnect();
            this.discontinuosChangeToEnergy();
            remove_1.default(this.forceLaws_, forceLaw);
        };
        Physics3.prototype.discontinuosChangeToEnergy = function () {
            this.varsList_.incrSequence(Physics3.INDEX_TRANSLATIONAL_KINETIC_ENERGY, Physics3.INDEX_ROTATIONAL_KINETIC_ENERGY, Physics3.INDEX_POTENTIAL_ENERGY, Physics3.INDEX_TOTAL_ENERGY, Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_X, Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Y, Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Z, Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_XY);
        };
        Physics3.prototype.updateBodies = function (vars) {
            var bodies = this.bodies_;
            var N = bodies.length;
            for (var i = 0; i < N; i++) {
                var body = bodies[i];
                var idx = body.varsIndex;
                if (idx < 0) {
                    return;
                }
                body.X.x = vars[idx + Physics3.OFFSET_POSITION_X];
                body.X.y = vars[idx + Physics3.OFFSET_POSITION_Y];
                body.X.z = vars[idx + Physics3.OFFSET_POSITION_Z];
                body.R.a = vars[idx + Physics3.OFFSET_ATTITUDE_A];
                body.R.xy = vars[idx + Physics3.OFFSET_ATTITUDE_XY];
                body.R.yz = vars[idx + Physics3.OFFSET_ATTITUDE_YZ];
                body.R.zx = vars[idx + Physics3.OFFSET_ATTITUDE_ZX];
                var R = body.R;
                var magR = Math.sqrt(R.a * R.a + R.xy * R.xy + R.yz * R.yz + R.zx * R.zx);
                body.R.a = body.R.a / magR;
                body.R.xy = body.R.xy / magR;
                body.R.yz = body.R.yz / magR;
                body.R.zx = body.R.zx / magR;
                body.P.x = vars[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X];
                body.P.y = vars[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y];
                body.P.z = vars[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z];
                body.L.xy = vars[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_XY];
                body.L.yz = vars[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_YZ];
                body.L.zx = vars[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_ZX];
                body.updateAngularVelocity();
            }
        };
        Physics3.prototype.prolog = function () {
            this.simList.removeTemporary(this.varsList.getTime());
        };
        Physics3.prototype.getState = function () {
            return this.varsList_.getValues();
        };
        Physics3.prototype.setState = function (state) {
            this.varsList.setValues(state, true);
        };
        Physics3.prototype.evaluate = function (state, rateOfChange, Δt, uomTime) {
            this.updateBodies(state);
            var bodies = this.bodies_;
            var Nb = bodies.length;
            for (var bodyIndex = 0; bodyIndex < Nb; bodyIndex++) {
                var body = bodies[bodyIndex];
                var idx = body.varsIndex;
                if (idx < 0) {
                    return;
                }
                var mass = body.M.a;
                if (mass === Number.POSITIVE_INFINITY) {
                    for (var k = 0; k < NUM_VARIABLES_PER_BODY; k++) {
                        rateOfChange[idx + k] = 0;
                    }
                }
                else {
                    var P = body.P;
                    rateOfChange[idx + Physics3.OFFSET_POSITION_X] = P.x / mass;
                    rateOfChange[idx + Physics3.OFFSET_POSITION_Y] = P.y / mass;
                    rateOfChange[idx + Physics3.OFFSET_POSITION_Z] = P.z / mass;
                    var R = body.R;
                    var Ω = body.Ω;
                    rateOfChange[idx + Physics3.OFFSET_ATTITUDE_A] = +0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
                    rateOfChange[idx + Physics3.OFFSET_ATTITUDE_YZ] = -0.5 * (Ω.yz * R.a + Ω.xy * R.zx - Ω.zx * R.xy);
                    rateOfChange[idx + Physics3.OFFSET_ATTITUDE_ZX] = -0.5 * (Ω.zx * R.a + Ω.yz * R.xy - Ω.xy * R.yz);
                    rateOfChange[idx + Physics3.OFFSET_ATTITUDE_XY] = -0.5 * (Ω.xy * R.a + Ω.zx * R.yz - Ω.yz * R.zx);
                    rateOfChange[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X] = 0;
                    rateOfChange[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y] = 0;
                    rateOfChange[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z] = 0;
                    rateOfChange[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_XY] = 0;
                    rateOfChange[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_YZ] = 0;
                    rateOfChange[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_ZX] = 0;
                }
            }
            var forceLaws = this.forceLaws_;
            var Nlaws = forceLaws.length;
            for (var lawIndex = 0; lawIndex < Nlaws; lawIndex++) {
                var forceLaw = forceLaws[lawIndex];
                var forces = forceLaw.updateForces();
                var Nforces = forces.length;
                for (var forceIndex = 0; forceIndex < Nforces; forceIndex++) {
                    this.applyForce(rateOfChange, forces[forceIndex], Δt, uomTime);
                }
            }
            rateOfChange[this.varsList_.timeIndex()] = 1;
            return null;
        };
        Physics3.prototype.applyForce = function (rateOfChange, forceApp, Δt, uomTime) {
            var body = forceApp.getBody();
            if (!(contains_1.default(this.bodies_, body))) {
                return;
            }
            var idx = body.varsIndex;
            if (idx < 0) {
                return;
            }
            forceApp.computeForce(this.force_);
            var F = this.force_;
            if (Unit_1.default.isOne(body.P.uom) && isZeroVectorE3_1.default(body.P)) {
                body.P.uom = Unit_1.default.mul(F.uom, uomTime);
            }
            rateOfChange[idx + Physics3.OFFSET_LINEAR_MOMENTUM_X] += F.x;
            rateOfChange[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Y] += F.y;
            rateOfChange[idx + Physics3.OFFSET_LINEAR_MOMENTUM_Z] += F.z;
            forceApp.computeTorque(this.torque_);
            var T = this.torque_;
            if (Unit_1.default.isOne(body.L.uom) && isZeroBivectorE3_1.default(body.L)) {
                body.L.uom = Unit_1.default.mul(T.uom, uomTime);
            }
            rateOfChange[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_YZ] += T.yz;
            rateOfChange[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_ZX] += T.zx;
            rateOfChange[idx + Physics3.OFFSET_ANGULAR_MOMENTUM_XY] += T.xy;
            if (this.showForces_) {
                forceApp.expireTime = this.varsList_.getTime();
                this.simList_.add(forceApp);
            }
        };
        Object.defineProperty(Physics3.prototype, "time", {
            get: function () {
                return this.varsList_.getTime();
            },
            enumerable: true,
            configurable: true
        });
        Physics3.prototype.updateFromBodies = function () {
            var bodies = this.bodies_;
            var N = bodies.length;
            for (var i = 0; i < N; i++) {
                this.updateFromBody(bodies[i]);
            }
            this.discontinuosChangeToEnergy();
        };
        Physics3.prototype.updateFromBody = function (body) {
            var idx = body.varsIndex;
            if (idx > -1) {
                var va = this.varsList_;
                va.setValue(Physics3.OFFSET_POSITION_X + idx, body.X.x);
                va.setValue(Physics3.OFFSET_POSITION_Y + idx, body.X.y);
                va.setValue(Physics3.OFFSET_POSITION_Z + idx, body.X.z);
                va.setValue(Physics3.OFFSET_ATTITUDE_A + idx, body.R.a);
                va.setValue(Physics3.OFFSET_ATTITUDE_XY + idx, body.R.xy);
                va.setValue(Physics3.OFFSET_ATTITUDE_YZ + idx, body.R.yz);
                va.setValue(Physics3.OFFSET_ATTITUDE_ZX + idx, body.R.zx);
                va.setValue(Physics3.OFFSET_LINEAR_MOMENTUM_X + idx, body.P.x);
                va.setValue(Physics3.OFFSET_LINEAR_MOMENTUM_Y + idx, body.P.y);
                va.setValue(Physics3.OFFSET_LINEAR_MOMENTUM_Z + idx, body.P.z);
                va.setValue(Physics3.OFFSET_ANGULAR_MOMENTUM_XY + idx, body.L.xy);
                va.setValue(Physics3.OFFSET_ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
                va.setValue(Physics3.OFFSET_ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
            }
        };
        Physics3.prototype.epilog = function () {
            var varsList = this.varsList_;
            var vars = varsList.getValues();
            this.updateBodies(vars);
            var pe = this.potentialOffset_.a;
            var re = 0;
            var te = 0;
            var Px = 0;
            var Py = 0;
            var Pz = 0;
            var Lyz = 0;
            var Lzx = 0;
            var Lxy = 0;
            var bs = this.bodies_;
            var Nb = bs.length;
            for (var i = 0; i < Nb; i++) {
                var b = bs[i];
                if (isFinite(b.M.a)) {
                    re += b.rotationalEnergy().a;
                    te += b.translationalEnergy().a;
                    Px += b.P.x;
                    Py += b.P.y;
                    Pz += b.P.z;
                    Lyz += wedge3_1.wedgeYZ(b.X, b.P);
                    Lzx += wedge3_1.wedgeZX(b.X, b.P);
                    Lxy += wedge3_1.wedgeXY(b.X, b.P);
                    Lyz += b.L.yz;
                    Lzx += b.L.zx;
                    Lxy += b.L.xy;
                }
            }
            var fs = this.forceLaws_;
            var Nf = fs.length;
            for (var i = 0; i < Nf; i++) {
                pe += fs[i].potentialEnergy().a;
            }
            varsList.setValue(Physics3.INDEX_TRANSLATIONAL_KINETIC_ENERGY, te, true);
            varsList.setValue(Physics3.INDEX_ROTATIONAL_KINETIC_ENERGY, re, true);
            varsList.setValue(Physics3.INDEX_POTENTIAL_ENERGY, pe, true);
            varsList.setValue(Physics3.INDEX_TOTAL_ENERGY, te + re + pe, true);
            varsList.setValue(Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_X, Px, true);
            varsList.setValue(Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Y, Py, true);
            varsList.setValue(Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Z, Pz, true);
            varsList.setValue(Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ, Lyz, true);
            varsList.setValue(Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX, Lzx, true);
            varsList.setValue(Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_XY, Lxy, true);
        };
        Object.defineProperty(Physics3.prototype, "simList", {
            get: function () {
                return this.simList_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Physics3.prototype, "varsList", {
            get: function () {
                return this.varsList_;
            },
            enumerable: true,
            configurable: true
        });
        Physics3.prototype.totalEnergy = function () {
            this.totalEnergy_.unlock(this.totalEnergyLock_);
            this.totalEnergy_.zero();
            this.totalEnergy_.add(this.potentialOffset_);
            var bs = this.bodies_;
            var Nb = bs.length;
            for (var i = 0; i < Nb; i++) {
                var body = bs[i];
                if (isFinite(body.M.a)) {
                    this.totalEnergy_.add(body.rotationalEnergy());
                    this.totalEnergy_.add(body.translationalEnergy());
                }
            }
            var fs = this.forceLaws_;
            var Nf = fs.length;
            for (var i = 0; i < Nf; i++) {
                this.totalEnergy_.add(fs[i].potentialEnergy());
            }
            this.totalEnergyLock_ = this.totalEnergy_.lock();
            return this.totalEnergy_;
        };
        return Physics3;
    }(AbstractSubject_1.default));
    Physics3.INDEX_TIME = 0;
    Physics3.INDEX_TRANSLATIONAL_KINETIC_ENERGY = 1;
    Physics3.INDEX_ROTATIONAL_KINETIC_ENERGY = 2;
    Physics3.INDEX_POTENTIAL_ENERGY = 3;
    Physics3.INDEX_TOTAL_ENERGY = 4;
    Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_X = 5;
    Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Y = 6;
    Physics3.INDEX_TOTAL_LINEAR_MOMENTUM_Z = 7;
    Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_YZ = 8;
    Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_ZX = 9;
    Physics3.INDEX_TOTAL_ANGULAR_MOMENTUM_XY = 10;
    Physics3.OFFSET_POSITION_X = 0;
    Physics3.OFFSET_POSITION_Y = 1;
    Physics3.OFFSET_POSITION_Z = 2;
    Physics3.OFFSET_ATTITUDE_A = 3;
    Physics3.OFFSET_ATTITUDE_YZ = 4;
    Physics3.OFFSET_ATTITUDE_ZX = 5;
    Physics3.OFFSET_ATTITUDE_XY = 6;
    Physics3.OFFSET_LINEAR_MOMENTUM_X = 7;
    Physics3.OFFSET_LINEAR_MOMENTUM_Y = 8;
    Physics3.OFFSET_LINEAR_MOMENTUM_Z = 9;
    Physics3.OFFSET_ANGULAR_MOMENTUM_YZ = 10;
    Physics3.OFFSET_ANGULAR_MOMENTUM_ZX = 11;
    Physics3.OFFSET_ANGULAR_MOMENTUM_XY = 12;
    exports.Physics3 = Physics3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Physics3;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/graph/EnergyTimeGraph',["require", "exports", "../view/AlignH", "../view/AlignV", "./Graph", "../engine3D/Physics3"], function (require, exports, AlignH_1, AlignV_1, Graph_1, Physics3_1) {
    "use strict";
    var EnergyTimeGraph = (function (_super) {
        __extends(EnergyTimeGraph, _super);
        function EnergyTimeGraph(canvasId, varsList) {
            var _this = _super.call(this, canvasId, varsList) || this;
            _this.translationalEnergyGraphLine = _this.addGraphLine(Physics3_1.default.INDEX_TIME, Physics3_1.default.INDEX_TRANSLATIONAL_KINETIC_ENERGY, 'red');
            _this.rotationalEnergyGraphLine = _this.addGraphLine(Physics3_1.default.INDEX_TIME, Physics3_1.default.INDEX_ROTATIONAL_KINETIC_ENERGY, 'yellow');
            _this.potentialEnergyGraphLine = _this.addGraphLine(Physics3_1.default.INDEX_TIME, Physics3_1.default.INDEX_POTENTIAL_ENERGY, 'blue');
            _this.totalEnergyGraphLine = _this.addGraphLine(Physics3_1.default.INDEX_TIME, Physics3_1.default.INDEX_TOTAL_ENERGY, 'white');
            _this.autoScale.timeWindow = 5;
            _this.autoScale.addGraphLine(_this.translationalEnergyGraphLine);
            _this.autoScale.addGraphLine(_this.rotationalEnergyGraphLine);
            _this.autoScale.addGraphLine(_this.potentialEnergyGraphLine);
            _this.autoScale.addGraphLine(_this.totalEnergyGraphLine);
            _this.axes.hAxisAlign = AlignV_1.default.BOTTOM;
            _this.axes.vAxisAlign = AlignH_1.default.LEFT;
            _this.axes.hAxisLabel = 'time';
            _this.axes.vAxisLabel = 'energy';
            return _this;
        }
        return EnergyTimeGraph;
    }(Graph_1.default));
    exports.EnergyTimeGraph = EnergyTimeGraph;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EnergyTimeGraph;
});

define('davinci-newton/util/zeroArray',["require", "exports"], function (require, exports) {
    "use strict";
    function zeroArray(xs) {
        var length = xs.length;
        for (var i = 0; i < length; i++) {
            xs[i] = 0;
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = zeroArray;
});

define('davinci-newton/solvers/EulerMethod',["require", "exports", "../util/zeroArray"], function (require, exports, zeroArray_1) {
    "use strict";
    var EulerMethod = (function () {
        function EulerMethod(sim_) {
            this.sim_ = sim_;
            this.inp_ = [];
            this.k1_ = [];
        }
        EulerMethod.prototype.step = function (stepSize, uomStep) {
            var vars = this.sim_.getState();
            var N = vars.length;
            if (this.inp_.length !== N) {
                this.inp_ = new Array(N);
                this.k1_ = new Array(N);
            }
            var inp = this.inp_;
            var k1 = this.k1_;
            for (var i = 0; i < N; i++) {
                inp[i] = vars[i];
            }
            zeroArray_1.default(k1);
            this.sim_.evaluate(inp, k1, 0, uomStep);
            for (var i = 0; i < N; i++) {
                vars[i] += k1[i] * stepSize;
            }
            this.sim_.setState(vars);
        };
        return EulerMethod;
    }());
    exports.EulerMethod = EulerMethod;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EulerMethod;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/GravitationLaw3',["require", "exports", "../objects/AbstractSimObject", "../model/CoordType", "./Force3", "../math/Geometric3"], function (require, exports, AbstractSimObject_1, CoordType_1, Force3_1, Geometric3_1) {
    "use strict";
    var GravitationLaw3 = (function (_super) {
        __extends(GravitationLaw3, _super);
        function GravitationLaw3(body1_, body2_, G) {
            if (G === void 0) { G = Geometric3_1.default.scalar(1); }
            var _this = _super.call(this) || this;
            _this.body1_ = body1_;
            _this.body2_ = body2_;
            _this.forces = [];
            _this.potentialEnergy_ = Geometric3_1.default.scalar(0);
            _this.potentialEnergyLock_ = _this.potentialEnergy_.lock();
            _this.F1 = new Force3_1.default(_this.body1_);
            _this.F1.locationCoordType = CoordType_1.default.WORLD;
            _this.F1.vectorCoordType = CoordType_1.default.WORLD;
            _this.F2 = new Force3_1.default(_this.body2_);
            _this.F2.locationCoordType = CoordType_1.default.WORLD;
            _this.F2.vectorCoordType = CoordType_1.default.WORLD;
            _this.G = G;
            _this.forces = [_this.F1, _this.F2];
            return _this;
        }
        GravitationLaw3.prototype.updateForces = function () {
            var numer = this.F1.location;
            var denom = this.F2.location;
            numer.copyVector(this.body2_.X).subVector(this.body1_.X);
            denom.copyVector(numer).quaditude();
            numer.direction().mulByScalar(this.G.a, this.G.uom).mulByScalar(this.body1_.M.a, this.body1_.M.uom).mulByScalar(this.body2_.M.a, this.body2_.M.uom);
            this.F1.vector.copyVector(numer).divByScalar(denom.a, denom.uom);
            this.F2.vector.copyVector(this.F1.vector).neg();
            this.F1.location.copyVector(this.body1_.X);
            this.F2.location.copyVector(this.body2_.X);
            return this.forces;
        };
        GravitationLaw3.prototype.disconnect = function () {
        };
        GravitationLaw3.prototype.potentialEnergy = function () {
            this.potentialEnergy_.unlock(this.potentialEnergyLock_);
            var numer = this.F1.location;
            var denom = this.F2.location;
            numer.copyScalar(this.G.a, this.G.uom).mulByScalar(this.body1_.M.a, this.body1_.M.uom).mulByScalar(this.body2_.M.a, this.body2_.M.uom).neg();
            denom.copyVector(this.body1_.X).subVector(this.body2_.X).magnitude();
            this.potentialEnergy_.copyScalar(numer.a, numer.uom).divByScalar(denom.a, denom.uom);
            this.F1.location.copyVector(this.body1_.X);
            this.F2.location.copyVector(this.body2_.X);
            this.potentialEnergyLock_ = this.potentialEnergy_.lock();
            return this.potentialEnergy_;
        };
        return GravitationLaw3;
    }(AbstractSimObject_1.default));
    exports.GravitationLaw3 = GravitationLaw3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GravitationLaw3;
});

define('davinci-newton/solvers/ModifiedEuler',["require", "exports", "../util/zeroArray"], function (require, exports, zeroArray_1) {
    "use strict";
    var ModifiedEuler = (function () {
        function ModifiedEuler(sim_) {
            this.sim_ = sim_;
            this.inp_ = [];
            this.k1_ = [];
            this.k2_ = [];
        }
        ModifiedEuler.prototype.step = function (stepSize, uomStep) {
            var vars = this.sim_.getState();
            var N = vars.length;
            if (this.inp_.length !== N) {
                this.inp_ = new Array(N);
                this.k1_ = new Array(N);
                this.k2_ = new Array(N);
            }
            var inp = this.inp_;
            var k1 = this.k1_;
            var k2 = this.k2_;
            for (var i = 0; i < N; i++) {
                inp[i] = vars[i];
            }
            zeroArray_1.default(k1);
            this.sim_.evaluate(inp, k1, 0, uomStep);
            for (var i = 0; i < N; i++) {
                inp[i] = vars[i] + k1[i] * stepSize;
            }
            zeroArray_1.default(k2);
            this.sim_.evaluate(inp, k2, stepSize, uomStep);
            for (var i = 0; i < N; i++) {
                vars[i] += (k1[i] + k2[i]) * stepSize / 2;
            }
            this.sim_.setState(vars);
        };
        return ModifiedEuler;
    }());
    exports.ModifiedEuler = ModifiedEuler;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ModifiedEuler;
});

define('davinci-newton/solvers/RungeKutta',["require", "exports", "../util/zeroArray"], function (require, exports, zeroArray_1) {
    "use strict";
    var RungeKutta = (function () {
        function RungeKutta(simulation) {
            this.inp_ = [];
            this.k1_ = [];
            this.k2_ = [];
            this.k3_ = [];
            this.k4_ = [];
            this.sim_ = simulation;
        }
        RungeKutta.prototype.step = function (stepSize, uomStep) {
            var vars = this.sim_.getState();
            var N = vars.length;
            if (this.inp_.length < N) {
                this.inp_ = new Array(N);
                this.k1_ = new Array(N);
                this.k2_ = new Array(N);
                this.k3_ = new Array(N);
                this.k4_ = new Array(N);
            }
            var inp = this.inp_;
            var k1 = this.k1_;
            var k2 = this.k2_;
            var k3 = this.k3_;
            var k4 = this.k4_;
            for (var i = 0; i < N; i++) {
                inp[i] = vars[i];
            }
            zeroArray_1.default(k1);
            this.sim_.evaluate(inp, k1, 0, uomStep);
            for (var i = 0; i < N; i++) {
                inp[i] = vars[i] + k1[i] * stepSize / 2;
            }
            zeroArray_1.default(k2);
            this.sim_.evaluate(inp, k2, stepSize / 2, uomStep);
            for (var i = 0; i < N; i++) {
                inp[i] = vars[i] + k2[i] * stepSize / 2;
            }
            zeroArray_1.default(k3);
            this.sim_.evaluate(inp, k3, stepSize / 2, uomStep);
            for (var i = 0; i < N; i++) {
                inp[i] = vars[i] + k3[i] * stepSize;
            }
            zeroArray_1.default(k4);
            this.sim_.evaluate(inp, k4, stepSize, uomStep);
            for (var i = 0; i < N; i++) {
                vars[i] += (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * stepSize / 6;
            }
            this.sim_.setState(vars);
        };
        return RungeKutta;
    }());
    exports.RungeKutta = RungeKutta;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RungeKutta;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/Sphere3',["require", "exports", "../math/Geometric3", "../math/Matrix3", "./RigidBody3", "../math/Unit"], function (require, exports, Geometric3_1, Matrix3_1, RigidBody3_1, Unit_1) {
    "use strict";
    var Sphere3 = (function (_super) {
        __extends(Sphere3, _super);
        function Sphere3(radius) {
            if (radius === void 0) { radius = Geometric3_1.default.one; }
            var _this = _super.call(this) || this;
            _this.radius_ = Geometric3_1.default.fromScalar(radius);
            _this.radiusLock_ = _this.radius_.lock();
            _this.updateInertiaTensor();
            return _this;
        }
        Object.defineProperty(Sphere3.prototype, "radius", {
            get: function () {
                return this.radius_;
            },
            set: function (radius) {
                this.radius_.unlock(this.radiusLock_);
                this.radius_.copyScalar(radius.a, radius.uom);
                this.radiusLock_ = this.radius_.lock();
                this.updateInertiaTensor();
            },
            enumerable: true,
            configurable: true
        });
        Sphere3.prototype.updateAngularVelocity = function () {
            this.Ω.copyScalar(this.radius_.a, this.radius_.uom);
            this.Ω.quaditude();
            this.Ω.mulByScalar(this.M.a, this.M.uom);
            this.Ω.mulByNumber(2 / 5);
            this.Ω.inv();
            this.Ω.mulByBivector(this.L);
        };
        Sphere3.prototype.updateInertiaTensor = function () {
            var r = this.radius_;
            var s = 2 * this.M.a * r.a * r.a / 5;
            var I = Matrix3_1.default.zero();
            I.setElement(0, 0, s);
            I.setElement(1, 1, s);
            I.setElement(2, 2, s);
            I.uom = Unit_1.default.mul(this.M.uom, Unit_1.default.mul(r.uom, r.uom));
            this.I = I;
        };
        return Sphere3;
    }(RigidBody3_1.default));
    exports.Sphere3 = Sphere3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Sphere3;
});

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('davinci-newton/engine3D/Spring3',["require", "exports", "../objects/AbstractSimObject", "../model/CoordType", "./Force3", "../math/Geometric3", "../math/Vec3", "../math/Unit"], function (require, exports, AbstractSimObject_1, CoordType_1, Force3_1, Geometric3_1, Vec3_1, Unit_1) {
    "use strict";
    function assertConsistentUnits(aName, A, bName, B) {
        if (!A.isZero() && !B.isZero()) {
            if (Unit_1.default.isOne(A.uom)) {
                if (!Unit_1.default.isOne(B.uom)) {
                    throw new Error(aName + " => " + A + " must have dimensions if " + bName + " => " + B + " has dimensions.");
                }
            }
            else {
                if (Unit_1.default.isOne(B.uom)) {
                    throw new Error(bName + " => " + B + " must have dimensions if " + aName + " => " + A + " has dimensions.");
                }
            }
        }
    }
    var Spring3 = (function (_super) {
        __extends(Spring3, _super);
        function Spring3(body1_, body2_) {
            var _this = _super.call(this) || this;
            _this.body1_ = body1_;
            _this.body2_ = body2_;
            _this.restLength = Geometric3_1.default.one;
            _this.stiffness = Geometric3_1.default.one;
            _this.attach1_ = Vec3_1.default.zero;
            _this.attach2_ = Vec3_1.default.zero;
            _this.forces = [];
            _this.end1_ = Geometric3_1.default.vector(0, 0, 0);
            _this.end1Lock_ = _this.end1_.lock();
            _this.end2_ = Geometric3_1.default.vector(0, 0, 0);
            _this.end2Lock_ = _this.end2_.lock();
            _this.potentialEnergy_ = Geometric3_1.default.scalar(0);
            _this.potentialEnergyLock_ = _this.potentialEnergy_.lock();
            _this.F1 = new Force3_1.default(_this.body1_);
            _this.F1.locationCoordType = CoordType_1.default.WORLD;
            _this.F1.vectorCoordType = CoordType_1.default.WORLD;
            _this.F2 = new Force3_1.default(_this.body2_);
            _this.F2.locationCoordType = CoordType_1.default.WORLD;
            _this.F2.vectorCoordType = CoordType_1.default.WORLD;
            _this.forces = [_this.F1, _this.F2];
            return _this;
        }
        Spring3.prototype.computeBody1AttachPointInWorldCoords = function (x) {
            if (this.attach1_ == null || this.body1_ == null) {
                throw new Error();
            }
            this.body1_.localPointToWorldPoint(this.attach1_, x);
        };
        Spring3.prototype.computeBody2AttachPointInWorldCoords = function (x) {
            if (this.attach2_ == null || this.body2_ == null) {
                throw new Error();
            }
            this.body2_.localPointToWorldPoint(this.attach2_, x);
        };
        Object.defineProperty(Spring3.prototype, "attach1", {
            get: function () {
                return this.attach1_;
            },
            set: function (attach1) {
                this.attach1_ = Vec3_1.default.fromVector(attach1);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spring3.prototype, "attach2", {
            get: function () {
                return this.attach2_;
            },
            set: function (attach2) {
                this.attach2_ = Vec3_1.default.fromVector(attach2);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spring3.prototype, "end1", {
            get: function () {
                this.end1.unlock(this.end1Lock_);
                this.computeBody1AttachPointInWorldCoords(this.end1_);
                this.end1Lock_ = this.end1.lock();
                return this.end1_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spring3.prototype, "end2", {
            get: function () {
                this.end2.unlock(this.end2Lock_);
                this.computeBody2AttachPointInWorldCoords(this.end2_);
                this.end2Lock_ = this.end2.lock();
                return this.end2_;
            },
            enumerable: true,
            configurable: true
        });
        Spring3.prototype.updateForces = function () {
            this.computeBody1AttachPointInWorldCoords(this.F1.location);
            this.computeBody2AttachPointInWorldCoords(this.F2.location);
            this.F2.vector.copyVector(this.F2.location).subVector(this.F1.location).direction();
            this.F1.vector.copyVector(this.F1.location).subVector(this.F2.location).magnitude().subScalar(this.restLength);
            this.F1.vector.mulByScalar(this.stiffness.a, this.stiffness.uom);
            this.F1.vector.mulByVector(this.F2.vector);
            this.F2.vector.copyVector(this.F1.vector).neg();
            return this.forces;
        };
        Spring3.prototype.disconnect = function () {
        };
        Spring3.prototype.potentialEnergy = function () {
            this.computeBody1AttachPointInWorldCoords(this.F1.location);
            this.computeBody2AttachPointInWorldCoords(this.F2.location);
            this.potentialEnergy_.unlock(this.potentialEnergyLock_);
            assertConsistentUnits('F1.location', this.F1.location, 'F2.location', this.F2.location);
            this.potentialEnergy_.copyVector(this.F2.location).subVector(this.F1.location).magnitude();
            assertConsistentUnits('length', this.potentialEnergy_, 'restLength', this.restLength);
            this.potentialEnergy_.sub(this.restLength);
            this.potentialEnergy_.quaditude();
            this.potentialEnergy_.mulByScalar(this.stiffness.a, this.stiffness.uom);
            this.potentialEnergy_.mulByNumber(0.5);
            this.potentialEnergyLock_ = this.potentialEnergy_.lock();
            return this.potentialEnergy_;
        };
        return Spring3;
    }(AbstractSimObject_1.default));
    exports.Spring3 = Spring3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spring3;
});

define('davinci-newton',["require", "exports", "./davinci-newton/solvers/AdaptiveStepSolver", "./davinci-newton/view/AlignH", "./davinci-newton/view/AlignV", "./davinci-newton/graph/AxisChoice", "./davinci-newton/engine3D/Block3", "./davinci-newton/util/CircularList", "./davinci-newton/config", "./davinci-newton/solvers/ConstantEnergySolver", "./davinci-newton/engine3D/ConstantForceLaw3", "./davinci-newton/model/CoordType", "./davinci-newton/engine3D/CoulombLaw3", "./davinci-newton/engine3D/Cylinder3", "./davinci-newton/strategy/DefaultAdvanceStrategy", "./davinci-newton/math/Dimensions", "./davinci-newton/graph/DisplayGraph", "./davinci-newton/view/DrawingMode", "./davinci-newton/graph/EnergyTimeGraph", "./davinci-newton/solvers/EulerMethod", "./davinci-newton/engine3D/Force3", "./davinci-newton/math/Geometric3", "./davinci-newton/graph/Graph", "./davinci-newton/graph/GraphLine", "./davinci-newton/engine3D/GravitationLaw3", "./davinci-newton/view/LabCanvas", "./davinci-newton/math/Matrix3", "./davinci-newton/solvers/ModifiedEuler", "./davinci-newton/math/QQ", "./davinci-newton/engine3D/RigidBody3", "./davinci-newton/engine3D/Physics3", "./davinci-newton/solvers/RungeKutta", "./davinci-newton/view/SimView", "./davinci-newton/engine3D/Sphere3", "./davinci-newton/engine3D/Spring3", "./davinci-newton/math/Unit", "./davinci-newton/core/VarsList", "./davinci-newton/math/Vec3"], function (require, exports, AdaptiveStepSolver_1, AlignH_1, AlignV_1, AxisChoice_1, Block3_1, CircularList_1, config_1, ConstantEnergySolver_1, ConstantForceLaw3_1, CoordType_1, CoulombLaw3_1, Cylinder3_1, DefaultAdvanceStrategy_1, Dimensions_1, DisplayGraph_1, DrawingMode_1, EnergyTimeGraph_1, EulerMethod_1, Force3_1, Geometric3_1, Graph_1, GraphLine_1, GravitationLaw3_1, LabCanvas_1, Matrix3_1, ModifiedEuler_1, QQ_1, RigidBody3_1, Physics3_1, RungeKutta_1, SimView_1, Sphere3_1, Spring3_1, Unit_1, VarsList_1, Vec3_1) {
    "use strict";
    var newton = {
        get LAST_MODIFIED() { return config_1.default.LAST_MODIFIED; },
        get VERSION() { return config_1.default.VERSION; },
        get AdaptiveStepSolver() { return AdaptiveStepSolver_1.default; },
        get AlignH() { return AlignH_1.default; },
        get AlignV() { return AlignV_1.default; },
        get AxisChoice() { return AxisChoice_1.default; },
        get Block3() { return Block3_1.default; },
        get CircularList() { return CircularList_1.default; },
        get ConstantEnergySolver() { return ConstantEnergySolver_1.default; },
        get ConstantForceLaw3() { return ConstantForceLaw3_1.default; },
        get CoordType() { return CoordType_1.default; },
        get CoulombLaw3() { return CoulombLaw3_1.default; },
        get Cylinder3() { return Cylinder3_1.default; },
        get DefaultAdvanceStrategy() { return DefaultAdvanceStrategy_1.default; },
        get Dimensions() { return Dimensions_1.default; },
        get DisplayGraph() { return DisplayGraph_1.default; },
        get DrawingMode() { return DrawingMode_1.default; },
        get EnergyTimeGraph() { return EnergyTimeGraph_1.default; },
        get EulerMethod() { return EulerMethod_1.default; },
        get Force3() { return Force3_1.default; },
        get Geometric3() { return Geometric3_1.default; },
        get Graph() { return Graph_1.default; },
        get GraphLine() { return GraphLine_1.default; },
        get GravitationLaw3() { return GravitationLaw3_1.default; },
        get LabCanvas() { return LabCanvas_1.default; },
        get Matrix3() { return Matrix3_1.default; },
        get ModifiedEuler() { return ModifiedEuler_1.default; },
        get QQ() { return QQ_1.default; },
        get Physics3() { return Physics3_1.default; },
        get RigidBody3() { return RigidBody3_1.default; },
        get RungeKutta() { return RungeKutta_1.default; },
        get SimView() { return SimView_1.default; },
        get Sphere3() { return Sphere3_1.default; },
        get Spring3() { return Spring3_1.default; },
        get Unit() { return Unit_1.default; },
        get VarsList() { return VarsList_1.default; },
        get Vec3() { return Vec3_1.default; }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = newton;
});

  var library = require('davinci-newton').default;
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['NEWTON'] = library;
  }
}(this));
