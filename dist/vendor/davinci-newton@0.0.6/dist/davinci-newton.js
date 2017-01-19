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
            this.LAST_MODIFIED = '2017-01-19';
            this.NAMESPACE = 'NEWTON';
            this.VERSION = '0.0.6';
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
    var DrawingMode = (function () {
        function DrawingMode() {
        }
        return DrawingMode;
    }());
    DrawingMode.DOTS = 'dots';
    DrawingMode.LINES = 'lines';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DrawingMode;
});

define('davinci-newton/util/clone',["require", "exports"], function (require, exports) {
    "use strict";
    function clone(xs) {
        throw new Error("TODO: clone");
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

define('davinci-newton/util/AbstractSubject',["require", "exports", "./clone", "./contains", "./find", "./remove", "../util/toName", "../util/validName"], function (require, exports, clone_1, contains_1, find_1, remove_1, toName_1, validName_1) {
    "use strict";
    var AbstractSubject = (function () {
        function AbstractSubject(name) {
            this.doBroadcast_ = true;
            this.observers_ = [];
            this.paramList_ = [];
            if (!name) {
                throw new Error('no name');
            }
            this.name_ = validName_1.default(toName_1.default(name));
        }
        AbstractSubject.prototype.getName = function () {
            return this.name_;
        };
        AbstractSubject.prototype.addObserver = function (observer) {
            if (!contains_1.default(this.observers_, observer)) {
                this.observers_.push(observer);
            }
        };
        AbstractSubject.prototype.removeObserver = function (observer) {
            remove_1.default(this.observers_, observer);
        };
        AbstractSubject.prototype.addParameter = function (parameter) {
            var name = parameter.getName();
            var p = this.getParam(name);
            if (p != null) {
                throw new Error('parameter ' + name + ' already exists: ' + p);
            }
            this.paramList_.push(parameter);
        };
        AbstractSubject.prototype.getParam = function (name) {
            name = toName_1.default(name);
            return find_1.default(this.paramList_, function (p) {
                return p.getName() === name;
            });
        };
        AbstractSubject.prototype.getParameter = function (name) {
            var p = this.getParam(name);
            if (p != null) {
                return p;
            }
            throw new Error('Parameter not found ' + name);
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
        GenericEvent.prototype.getName = function (localized) {
            return this.name_;
        };
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
        function GraphStyle(index_, drawMode, color_, lineWidth) {
            this.index_ = index_;
            this.drawMode = drawMode;
            this.color_ = color_;
            this.lineWidth = lineWidth;
        }
        return GraphStyle;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GraphStyle;
});

define('davinci-newton/checks/isObject',["require", "exports"], function (require, exports) {
    "use strict";
    function isObject(x) {
        return (typeof x === 'object');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isObject;
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

define('davinci-newton/checks/isLE',["require", "exports"], function (require, exports) {
    "use strict";
    function default_1(value, limit) {
        return value <= limit;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-newton/checks/mustBeLE',["require", "exports", "../checks/mustSatisfy", "../checks/isLE"], function (require, exports, mustSatisfy_1, isLE_1) {
    "use strict";
    function default_1(name, value, limit, contextBuilder) {
        mustSatisfy_1.default(name, isLE_1.default(value, limit), function () { return "be less than or equal to " + limit; }, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});

define('davinci-newton/checks/mustBeObject',["require", "exports", "../checks/mustSatisfy", "../checks/isObject"], function (require, exports, mustSatisfy_1, isObject_1) {
    "use strict";
    function beObject() {
        return "be an `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isObject_1.default(value), beObject, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeObject;
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
        ParameterNumber.prototype.getName = function () {
            return this.name_;
        };
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
        ParameterString.prototype.getName = function () {
            return this.name_;
        };
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/graph/GraphLine',["require", "exports", "../util/AbstractSubject", "../util/CircularList", "../view/DrawingMode", "../util/GenericEvent", "./GraphPoint", "./GraphStyle", "../checks/isObject", "../checks/mustBeLE", "../checks/mustBeObject", "../util/ParameterNumber", "../util/ParameterString", "../util/veryDifferent"], function (require, exports, AbstractSubject_1, CircularList_1, DrawingMode_1, GenericEvent_1, GraphPoint_1, GraphStyle_1, isObject_1, mustBeLE_1, mustBeObject_1, ParameterNumber_1, ParameterString_1, veryDifferent_1) {
    "use strict";
    var GraphLine = (function (_super) {
        __extends(GraphLine, _super);
        function GraphLine(name, varsList, capacity) {
            var _this = _super.call(this, name) || this;
            _this.lineWidth_ = 1.0;
            _this.hotSpotColor_ = 'red';
            _this.styles_ = [];
            _this.varsList_ = varsList;
            varsList.addObserver(_this);
            _this.xVar_ = -1;
            _this.yVar_ = -1;
            _this.xVarParam_ = new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_X_VARIABLE, function () { return _this.getXVariable(); }, function (index) { return _this.setXVariable(index); });
            _this.xVarParam_.setLowerLimit(-1);
            _this.addParameter(_this.xVarParam_);
            _this.yVarParam_ = new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_Y_VARIABLE, function () { return _this.getYVariable(); }, function (index) { return _this.setYVariable(index); });
            _this.yVarParam_.setLowerLimit(-1);
            _this.addParameter(_this.yVarParam_);
            _this.dataPoints_ = new CircularList_1.default(capacity || 100000);
            _this.drawColor_ = 'lime';
            _this.drawMode_ = DrawingMode_1.default.LINES;
            _this.addGraphStyle();
            _this.xTransform = function (x, y) { return x; };
            _this.yTransform = function (x, y) { return y; };
            _this.addParameter(new ParameterNumber_1.default(_this, GraphLine.PARAM_NAME_LINE_WIDTH, function () { return _this.getLineWidth(); }, function (lineWidth) { return _this.setLineWidth(lineWidth); }));
            _this.addParameter(new ParameterString_1.default(_this, GraphLine.PARAM_NAME_DRAWING_MODE, function () { return _this.getDrawingMode(); }, function (drawingMode) { return _this.setDrawingMode(drawingMode); }));
            _this.addParameter(new ParameterString_1.default(_this, GraphLine.PARAM_NAME_COLOR, function () { return _this.getColor(); }, function (color) { return _this.setColor(color); }));
            return _this;
        }
        GraphLine.prototype.addGraphStyle = function () {
            this.styles_.push(new GraphStyle_1.default(this.dataPoints_.getEndIndex() + 1, this.drawMode_, this.drawColor_, this.lineWidth_));
        };
        GraphLine.isDuckType = function (obj) {
            if (obj instanceof GraphLine) {
                return true;
            }
            return isObject_1.default(obj) && obj.setXVariable !== undefined
                && obj.setYVariable !== undefined
                && obj.setColor !== undefined
                && obj.setLineWidth !== undefined
                && obj.setAxes !== undefined
                && obj.getVarsList !== undefined
                && obj.reset !== undefined
                && obj.getGraphStyle !== undefined;
        };
        GraphLine.prototype.getColor = function () {
            return this.drawColor_;
        };
        GraphLine.prototype.getDrawingMode = function () {
            return this.drawMode_;
        };
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
                mustBeLE_1.default('', last.index_, s.index_);
                if (s.index_ > index)
                    break;
                last = s;
            }
            mustBeObject_1.default('last', last);
            return last;
        };
        GraphLine.prototype.getHotSpotColor = function () {
            return this.hotSpotColor_;
        };
        GraphLine.prototype.getLineWidth = function () {
            return this.lineWidth_;
        };
        GraphLine.prototype.getVarsList = function () {
            return this.varsList_;
        };
        GraphLine.prototype.getXVariable = function () {
            return this.xVar_;
        };
        GraphLine.prototype.getXVarName = function () {
            return this.xVar_ > -1 ? this.varsList_.getVariable(this.xVar_).getName() : '';
        };
        GraphLine.prototype.getYVariable = function () {
            return this.yVar_;
        };
        GraphLine.prototype.getYVarName = function () {
            return this.yVar_ > -1 ? this.varsList_.getVariable(this.yVar_).getName() : '';
        };
        GraphLine.prototype.memorize = function () {
            if (this.xVar_ > -1 && this.yVar_ > -1) {
                var xVar = this.varsList_.getVariable(this.xVar_);
                var yVar = this.varsList_.getVariable(this.yVar_);
                var x = xVar.getValue();
                var y = yVar.getValue();
                var nextX = this.xTransform(x, y);
                var nextY = this.yTransform(x, y);
                var seqX = xVar.getSequence();
                var seqY = yVar.getSequence();
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
        GraphLine.prototype.setColor = function (color) {
            if (this.drawColor_ !== color) {
                this.drawColor_ = color;
                this.addGraphStyle();
                this.broadcastParameter(GraphLine.PARAM_NAME_COLOR);
            }
        };
        GraphLine.prototype.setDrawingMode = function (dm) {
            if (this.drawMode_ !== dm) {
                this.drawMode_ = dm;
                this.addGraphStyle();
            }
            this.broadcastParameter(GraphLine.PARAM_NAME_DRAWING_MODE);
        };
        GraphLine.prototype.setHotSpotColor = function (color) {
            this.hotSpotColor_ = color;
        };
        GraphLine.prototype.setLineWidth = function (value) {
            if (veryDifferent_1.default(value, this.lineWidth_)) {
                this.lineWidth_ = value;
                this.addGraphStyle();
                this.broadcastParameter(GraphLine.PARAM_NAME_LINE_WIDTH);
            }
        };
        GraphLine.prototype.setXVariable = function (xVar) {
            if (xVar < -1 || xVar > this.varsList_.numVariables() - 1) {
                throw new Error('setXVariable bad index ' + xVar);
            }
            if (xVar !== this.xVar_) {
                this.xVar_ = xVar;
                this.reset();
                this.broadcastParameter(GraphLine.PARAM_NAME_X_VARIABLE);
            }
        };
        GraphLine.prototype.setYVariable = function (yVar) {
            if (yVar < -1 || yVar > this.varsList_.numVariables() - 1) {
                throw new Error('setYVariable bad index ' + yVar);
            }
            if (yVar !== this.yVar_) {
                this.yVar_ = yVar;
                this.reset();
                this.broadcastParameter(GraphLine.PARAM_NAME_Y_VARIABLE);
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

define('davinci-newton/checks/isFunction',["require", "exports"], function (require, exports) {
    "use strict";
    function isFunction(x) {
        return (typeof x === 'function');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isFunction;
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

define('davinci-newton/graph/DisplayGraph',["require", "exports", "../util/contains", "../view/DrawingMode", "./GraphLine", "../checks/isDefined", "../checks/mustBeNonNullObject", "../util/removeAt", "../util/repeat", "../view/ScreenRect"], function (require, exports, contains_1, DrawingMode_1, GraphLine_1, isDefined_1, mustBeNonNullObject_1, removeAt_1, repeat_1, ScreenRect_1) {
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
            context.save();
            if (this.lastMap_ == null || this.lastMap_ !== map) {
                this.lastMap_ = map;
                this.needRedraw_ = true;
            }
            for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                if (this.memDraw_[i] > this.graphLines_[i].getGraphPoints().getEndIndex()) {
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
                    this.offScreen_ =
                        (document.createElement('canvas'));
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
            for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                this.drawHotSpot(context, map, this.graphLines_[i]);
            }
            context.restore();
        };
        DisplayGraph.prototype.drawHotSpot = function (context, coordMap, graphLine) {
            var p = graphLine.getGraphPoints().getEndValue();
            if (p != null) {
                var x = coordMap.simToScreenX(p.x);
                var y = coordMap.simToScreenY(p.y);
                var color = graphLine.getHotSpotColor();
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
            mustBeNonNullObject_1.default('first', next);
            var style = graphLine.getGraphStyle(iter.getIndex());
            if (style.drawMode === DrawingMode_1.default.DOTS) {
                var x = coordMap.simToScreenX(next.x);
                var y = coordMap.simToScreenY(next.y);
                var w = style.lineWidth;
                context.fillStyle = style.color_;
                context.fillRect(x, y, w, w);
            }
            while (iter.hasNext()) {
                var last = next;
                next = iter.nextValue();
                mustBeNonNullObject_1.default('next', next);
                if (next.x === last.x && next.y === last.y) {
                    continue;
                }
                var style_1 = graphLine.getGraphStyle(iter.getIndex());
                var continuous = next.seqX === last.seqX && next.seqY === last.seqY;
                if (style_1.drawMode === DrawingMode_1.default.DOTS || !continuous) {
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
            this.memDraw_ = repeat_1.default(-1, this.graphLines_.length);
            this.needRedraw_ = true;
        };
        return DisplayGraph;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DisplayGraph;
});

define('davinci-newton/objects/AbstractSimObject',["require", "exports", "../util/toName", "../util/validName"], function (require, exports, toName_1, validName_1) {
    "use strict";
    var AbstractSimObject = (function () {
        function AbstractSimObject(name) {
            this.expireTime_ = Number.POSITIVE_INFINITY;
            this.name_ = validName_1.default(toName_1.default(name || "SIM_OBJ" + AbstractSimObject.ID++));
        }
        AbstractSimObject.prototype.getExpireTime = function () {
            return this.expireTime_;
        };
        AbstractSimObject.prototype.setExpireTime = function (expireTime) {
            this.expireTime_ = expireTime;
        };
        AbstractSimObject.prototype.getName = function () {
            return this.name_;
        };
        return AbstractSimObject;
    }());
    AbstractSimObject.ID = 1;
    exports.AbstractSimObject = AbstractSimObject;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractSimObject;
});

define('davinci-newton/math/wedge',["require", "exports"], function (require, exports) {
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

define('davinci-newton/math/Bivector3',["require", "exports", "./wedge"], function (require, exports, wedge_1) {
    "use strict";
    var Bivector3 = (function () {
        function Bivector3() {
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
        }
        Bivector3.prototype.copy = function (B) {
            this.yz = B.yz;
            this.zx = B.zx;
            this.xy = B.xy;
            return this;
        };
        Bivector3.prototype.dual = function (v) {
            this.yz = v.x;
            this.zx = v.y;
            this.xy = v.z;
            return this;
        };
        Bivector3.prototype.wedge = function (a, b) {
            this.yz = wedge_1.wedgeYZ(a, b);
            this.zx = wedge_1.wedgeZX(a, b);
            this.xy = wedge_1.wedgeXY(a, b);
            return this;
        };
        Bivector3.prototype.zero = function () {
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            return this;
        };
        return Bivector3;
    }());
    exports.Bivector3 = Bivector3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Bivector3;
});

define('davinci-newton/model/CoordType',["require", "exports"], function (require, exports) {
    "use strict";
    var CoordType;
    (function (CoordType) {
        CoordType[CoordType["BODY"] = 0] = "BODY";
        CoordType[CoordType["WORLD"] = 1] = "WORLD";
    })(CoordType = exports.CoordType || (exports.CoordType = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CoordType;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/model/ForceApp',["require", "exports", "../objects/AbstractSimObject", "../math/Bivector3", "./CoordType"], function (require, exports, AbstractSimObject_1, Bivector3_1, CoordType_1) {
    "use strict";
    var ForceApp = (function (_super) {
        __extends(ForceApp, _super);
        function ForceApp(name, body_, location_, locationCoordType_, direction_, directionCoordType_) {
            var _this = _super.call(this, name) || this;
            _this.body_ = body_;
            _this.location_ = location_;
            _this.locationCoordType_ = locationCoordType_;
            _this.direction_ = direction_;
            _this.directionCoordType_ = directionCoordType_;
            _this.torque_ = new Bivector3_1.default();
            return _this;
        }
        ForceApp.prototype.getBody = function () {
            return this.body_;
        };
        Object.defineProperty(ForceApp.prototype, "F", {
            get: function () {
                return this.directionCoordType_ === CoordType_1.default.BODY ? this.body_.rotateBodyToWorld(this.direction_) : this.direction_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ForceApp.prototype, "x", {
            get: function () {
                return this.locationCoordType_ === CoordType_1.default.BODY ? this.body_.bodyToWorld(this.location_) : this.location_;
            },
            enumerable: true,
            configurable: true
        });
        ForceApp.prototype.getTorqueAboutCenterOfMass = function () {
            var r = this.x.subtract(this.body_.X);
            return this.torque_.wedge(r, this.F);
        };
        Object.defineProperty(ForceApp.prototype, "\u0393", {
            get: function () {
                return this.getTorqueAboutCenterOfMass();
            },
            enumerable: true,
            configurable: true
        });
        return ForceApp;
    }(AbstractSimObject_1.default));
    exports.ForceApp = ForceApp;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ForceApp;
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

define('davinci-newton/view/HorizAlign',["require", "exports"], function (require, exports) {
    "use strict";
    var HorizAlign;
    (function (HorizAlign) {
        HorizAlign[HorizAlign["LEFT"] = 0] = "LEFT";
        HorizAlign[HorizAlign["MIDDLE"] = 1] = "MIDDLE";
        HorizAlign[HorizAlign["RIGHT"] = 2] = "RIGHT";
        HorizAlign[HorizAlign["FULL"] = 3] = "FULL";
    })(HorizAlign = exports.HorizAlign || (exports.HorizAlign = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HorizAlign;
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

define('davinci-newton/view/VerticalAlign',["require", "exports"], function (require, exports) {
    "use strict";
    var VerticalAlign;
    (function (VerticalAlign) {
        VerticalAlign[VerticalAlign["TOP"] = 0] = "TOP";
        VerticalAlign[VerticalAlign["MIDDLE"] = 1] = "MIDDLE";
        VerticalAlign[VerticalAlign["BOTTOM"] = 2] = "BOTTOM";
        VerticalAlign[VerticalAlign["FULL"] = 3] = "FULL";
    })(VerticalAlign = exports.VerticalAlign || (exports.VerticalAlign = {}));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VerticalAlign;
});

define('davinci-newton/view/CoordMap',["require", "exports", "./AffineTransform", "./DoubleRect", "./HorizAlign", "../checks/mustBeFinite", "./Point", "./ScreenRect", "./VerticalAlign"], function (require, exports, AffineTransform_1, DoubleRect_1, HorizAlign_1, mustBeFinite_1, Point_1, ScreenRect_1, VerticalAlign_1) {
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
            if (horizAlign === void 0) { horizAlign = HorizAlign_1.default.MIDDLE; }
            if (verticalAlign === void 0) { verticalAlign = VerticalAlign_1.default.MIDDLE; }
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
            if (horizAlign === HorizAlign_1.default.FULL) {
                pixel_per_unit_x = screen_width / sim_width;
                offset_x = 0;
            }
            if (verticalAlign === VerticalAlign_1.default.FULL) {
                pixel_per_unit_y = screen_height / sim_height;
                offset_y = 0;
            }
            if (horizAlign !== HorizAlign_1.default.FULL || verticalAlign !== VerticalAlign_1.default.FULL) {
                var horizFull;
                if (horizAlign === HorizAlign_1.default.FULL) {
                    pixel_per_unit_y = pixel_per_unit_x * aspectRatio;
                    horizFull = true;
                }
                else if (verticalAlign === VerticalAlign_1.default.FULL) {
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
                        case HorizAlign_1.default.LEFT:
                            offset_x = 0;
                            break;
                        case HorizAlign_1.default.MIDDLE:
                            offset_x = (screen_width - ideal_width) / 2;
                            break;
                        case HorizAlign_1.default.RIGHT:
                            offset_x = screen_width - ideal_width;
                            break;
                        default: throw new Error();
                    }
                }
                else {
                    offset_x = 0;
                    var ideal_height = Math.floor(0.5 + sim_height * pixel_per_unit_y);
                    switch (verticalAlign) {
                        case VerticalAlign_1.default.BOTTOM:
                            offset_y = 0;
                            break;
                        case VerticalAlign_1.default.MIDDLE:
                            offset_y = (screen_height - ideal_height) / 2;
                            break;
                        case VerticalAlign_1.default.TOP:
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/view/DisplayList',["require", "exports", "../util/AbstractSubject", "../util/GenericEvent", "../util/insertAt", "../checks/isObject"], function (require, exports, AbstractSubject_1, GenericEvent_1, insertAt_1, isObject_1) {
    "use strict";
    var DisplayList = (function (_super) {
        __extends(DisplayList, _super);
        function DisplayList(name) {
            var _this = _super.call(this, name || 'DISPLAY_LIST_' + (DisplayList.NAME_ID++)) || this;
            _this.drawables_ = [];
            return _this;
        }
        DisplayList.prototype.add = function (dispObj) {
            if (!isObject_1.default(dispObj)) {
                throw new Error('non-object passed to DisplayList.add');
            }
            var zIndex = dispObj.getZIndex();
            this.sort();
            for (var i = 0, n = this.drawables_.length; i < n; i++) {
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
            for (var i = N; i > 0; i--) {
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
    DisplayList.NAME_ID = 1;
    DisplayList.OBJECT_ADDED = 'OBJECT_ADDED';
    DisplayList.OBJECT_REMOVED = 'OBJECT_REMOVED';
    exports.DisplayList = DisplayList;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DisplayList;
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
        ParameterBoolean.prototype.getName = function () {
            return this.name_;
        };
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/view/SimView',["require", "exports", "../util/AbstractSubject", "../util/clone", "../util/contains", "./CoordMap", "./DisplayList", "./DoubleRect", "../util/GenericEvent", "./HorizAlign", "../util/ParameterBoolean", "../util/ParameterNumber", "../util/remove", "./ScreenRect", "./VerticalAlign", "../util/veryDifferent"], function (require, exports, AbstractSubject_1, clone_1, contains_1, CoordMap_1, DisplayList_1, DoubleRect_1, GenericEvent_1, HorizAlign_1, ParameterBoolean_1, ParameterNumber_1, remove_1, ScreenRect_1, VerticalAlign_1, veryDifferent_1) {
    "use strict";
    var COORD_MAP_CHANGED = 'COORD_MAP_CHANGED';
    var SCREEN_RECT_CHANGED = 'SCREEN_RECT_CHANGED';
    var SimView = (function (_super) {
        __extends(SimView, _super);
        function SimView(name, simRect) {
            var _this = _super.call(this, name) || this;
            _this.panX = 0.05;
            _this.panY = 0.05;
            _this.zoom = 1.1;
            _this.screenRect_ = new ScreenRect_1.default(0, 0, 800, 600);
            _this.horizAlign_ = HorizAlign_1.default.MIDDLE;
            _this.verticalAlign_ = VerticalAlign_1.default.MIDDLE;
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
            _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_VERTICAL_ALIGN, function () { return _this.getVerticalAlign(); }, function (verticalAlign) { return _this.setVerticalAlign(verticalAlign); }));
            _this.addParameter(new ParameterNumber_1.default(_this, SimView.PARAM_NAME_HORIZONTAL_ALIGN, function () { return _this.getHorizAlign(); }, function (horizAlign) { return _this.setHorizAlign(horizAlign); }));
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
        SimView.prototype.getHorizAlign = function () {
            return this.horizAlign_;
        };
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
        SimView.prototype.getVerticalAlign = function () {
            return this.verticalAlign_;
        };
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
            this.broadcast(new GenericEvent_1.default(this, COORD_MAP_CHANGED));
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
                this.broadcast(new GenericEvent_1.default(this, SCREEN_RECT_CHANGED));
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
        SimView.prototype.setHorizAlign = function (alignHoriz) {
            this.horizAlign_ = alignHoriz;
            this.realign();
            this.broadcastParameter(SimView.PARAM_NAME_HORIZONTAL_ALIGN);
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
        SimView.prototype.setVerticalAlign = function (alignVert) {
            this.verticalAlign_ = alignVert;
            this.realign();
            this.broadcastParameter(SimView.PARAM_NAME_VERTICAL_ALIGN);
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
    SimView.SIM_RECT_CHANGED = 'SIM_RECT_CHANGED';
    exports.SimView = SimView;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimView;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/graph/AutoScale',["require", "exports", "../util/AbstractSubject", "../util/contains", "../view/DoubleRect", "../util/GenericEvent", "./GraphLine", "../util/removeAt", "../checks/isDefined", "../util/repeat", "../view/SimView", "../util/veryDifferent"], function (require, exports, AbstractSubject_1, contains_1, DoubleRect_1, GenericEvent_1, GraphLine_1, removeAt_1, isDefined_1, repeat_1, SimView_1, veryDifferent_1) {
    "use strict";
    var AutoScale = (function (_super) {
        __extends(AutoScale, _super);
        function AutoScale(name, graphLine, simView) {
            var _this = _super.call(this, name) || this;
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
            _this.axis_ = AutoScale.BOTH_AXES;
            if (isDefined_1.default(graphLine) && !GraphLine_1.default.isDuckType(graphLine)) {
                throw new Error('not a GraphLine ' + graphLine);
            }
            if (GraphLine_1.default.isDuckType(graphLine)) {
                _this.graphLines_.push(graphLine);
                graphLine.addObserver(_this);
            }
            _this.simView_ = simView;
            simView.addMemo(_this);
            simView.addObserver(_this);
            _this.lastIndex_ = repeat_1.default(-1, _this.graphLines_.length);
            _this.setComputed(_this.isActive_);
            return _this;
        }
        AutoScale.prototype.addGraphLine = function (graphLine) {
            if (GraphLine_1.default.isDuckType(graphLine)) {
                if (!contains_1.default(this.graphLines_, graphLine)) {
                    this.graphLines_.push(graphLine);
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
        AutoScale.prototype.getActive = function () {
            return this.isActive_;
        };
        AutoScale.prototype.getAxis = function () {
            return this.axis_;
        };
        AutoScale.prototype.getEnabled = function () {
            return this.enabled_;
        };
        AutoScale.prototype.getRangeRect = function () {
            return new DoubleRect_1.default(this.rangeXLo_, this.rangeYLo_, this.rangeXHi_, this.rangeYHi_);
        };
        AutoScale.prototype.getTimeWindow = function () {
            return this.timeWindow_;
        };
        AutoScale.prototype.memorize = function () {
            for (var i = 0, n = this.graphLines_.length; i < n; i++) {
                var graphPts = this.graphLines_[i].getGraphPoints();
                if (this.lastIndex_[i] > graphPts.getEndIndex()) {
                    this.reset();
                }
            }
            for (i = 0, n = this.graphLines_.length; i < n; i++) {
                graphPts = this.graphLines_[i].getGraphPoints();
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
                        this.setActive(false);
                    }
                }
            }
            else if (contains_1.default(this.graphLines_, event.getSubject())) {
                if (event.nameEquals(GraphLine_1.default.PARAM_NAME_X_VARIABLE) || event.nameEquals(GraphLine_1.default.PARAM_NAME_Y_VARIABLE)) {
                    this.reset();
                }
                else if (event.nameEquals(GraphLine_1.default.RESET)) {
                    this.setActive(true);
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
            if (this.axis_ === AutoScale.VERTICAL) {
                nr = new DoubleRect_1.default(sr.getLeft(), nr.getBottom(), sr.getRight(), nr.getTop());
            }
            else if (this.axis_ === AutoScale.HORIZONTAL) {
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
        AutoScale.prototype.setActive = function (value) {
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
        };
        AutoScale.prototype.setAxis = function (value) {
            if (value === AutoScale.VERTICAL || value === AutoScale.HORIZONTAL || value === AutoScale.BOTH_AXES) {
                this.axis_ = value;
                this.broadcastParameter(AutoScale.AXIS);
            }
            else {
                throw new Error('unknown ' + value);
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
        AutoScale.prototype.setEnabled = function (value) {
            if (this.enabled_ !== value) {
                this.enabled_ = value;
                this.setActive(value);
                this.broadcast(new GenericEvent_1.default(this, AutoScale.ENABLED, this.enabled_));
            }
        };
        AutoScale.prototype.setTimeWindow = function (value) {
            if (veryDifferent_1.default(value, this.timeWindow_)) {
                this.timeWindow_ = value;
                this.reset();
                this.setActive(true);
                this.broadcastParameter(AutoScale.TIME_WINDOW);
            }
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
            var timeIdx = line.getVarsList().timeIndex();
            var xIsTimeVar = line.getXVariable() === timeIdx;
            var yIsTimeVar = line.getYVariable() === timeIdx;
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
    AutoScale.BOTH_AXES = 'BOTH_AXES';
    AutoScale.ENABLED = 'ENABLED';
    AutoScale.HORIZONTAL = 'HORIZONTAL';
    AutoScale.VERTICAL = 'VERTICAL';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AutoScale;
});

define('davinci-newton/util/isEmpty',["require", "exports"], function (require, exports) {
    "use strict";
    function isEmpty(xs) {
        return xs.length === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isEmpty;
});

define('davinci-newton/checks/isNumber',["require", "exports"], function (require, exports) {
    "use strict";
    function isNumber(x) {
        return (typeof x === 'number');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isNumber;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/view/LabCanvas',["require", "exports", "../util/AbstractSubject", "../util/clone", "../util/contains", "../util/GenericEvent", "../util/isEmpty", "../checks/isNumber", "../checks/mustBeNonNullObject", "../util/remove", "./ScreenRect", "../util/veryDifferent"], function (require, exports, AbstractSubject_1, clone_1, contains_1, GenericEvent_1, isEmpty_1, isNumber_1, mustBeNonNullObject_1, remove_1, ScreenRect_1, veryDifferent_1) {
    "use strict";
    var WIDTH = 'width';
    var HEIGHT = 'height';
    var ALPHA = 'alpha';
    var BACKGROUND = 'background';
    var LabCanvas = (function (_super) {
        __extends(LabCanvas, _super);
        function LabCanvas(canvas, name) {
            var _this = _super.call(this, name) || this;
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
                var sr = new ScreenRect_1.default(0, 0, this.getWidth(), this.getHeight());
                view.setScreenRect(sr);
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/graph/Graph',["require", "exports", "../util/AbstractSubject", "./AutoScale", "./DisplayGraph", "../view/DoubleRect", "./GraphLine", "../view/HorizAlign", "../view/LabCanvas", "../view/SimView", "../view/VerticalAlign"], function (require, exports, AbstractSubject_1, AutoScale_1, DisplayGraph_1, DoubleRect_1, GraphLine_1, HorizAlign_1, LabCanvas_1, SimView_1, VerticalAlign_1) {
    "use strict";
    var Graph = (function (_super) {
        __extends(Graph, _super);
        function Graph(canvasId, varsList) {
            var _this = _super.call(this, 'TIME_GRAPH_LAYOUT') || this;
            _this.varsList = varsList;
            _this.view = new SimView_1.default('TIME_GRAPH_VIEW', new DoubleRect_1.default(0, 0, 1, 1));
            var canvas = document.getElementById(canvasId);
            _this.labCanvas = new LabCanvas_1.default(canvas, 'GRAPH_CANVAS');
            _this.view.setHorizAlign(HorizAlign_1.default.FULL);
            _this.view.setVerticalAlign(VerticalAlign_1.default.FULL);
            _this.labCanvas.addView(_this.view);
            _this.displayGraph = new DisplayGraph_1.default();
            _this.displayGraph.setScreenRect(_this.view.getScreenRect());
            _this.view.getDisplayList().prepend(_this.displayGraph);
            _this.timeIdx_ = varsList.timeIndex();
            return _this;
        }
        Graph.prototype.addTrace = function (name) {
            var trace = new GraphLine_1.default(name, this.varsList);
            this.view.addMemo(trace);
            trace.setColor('black');
            this.displayGraph.addGraphLine(trace);
            this.displayGraph.setUseBuffer(trace.getXVariable() !== this.timeIdx_);
            return trace;
        };
        Graph.prototype.memorize = function () {
            this.labCanvas.memorize();
        };
        Graph.prototype.render = function () {
            this.labCanvas.paint();
        };
        Graph.prototype.setAutoScale = function (trace) {
            this.autoScale = new AutoScale_1.default('TIME_GRAPH_AUTO_SCALE', trace, this.view);
            this.autoScale.extraMargin = 0.05;
        };
        return Graph;
    }(AbstractSubject_1.default));
    exports.Graph = Graph;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Graph;
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

define('davinci-newton/checks/isUndefined',["require", "exports"], function (require, exports) {
    "use strict";
    function isUndefined(arg) {
        return (typeof arg === 'undefined');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isUndefined;
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

define('davinci-newton/math/AbstractMatrix',["require", "exports", "../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/expectArg"], function (require, exports, mustBeDefined_1, mustBeInteger_1, expectArg_1) {
    "use strict";
    var AbstractMatrix = (function () {
        function AbstractMatrix(elements, dimensions) {
            this._elements = mustBeDefined_1.default('elements', elements);
            this._dimensions = mustBeInteger_1.default('dimensions', dimensions);
            this._length = dimensions * dimensions;
            expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
            this.modified = false;
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
        AbstractMatrix.prototype.copy = function (m) {
            this.elements.set(m.elements);
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/math/Matrix3',["require", "exports", "./AbstractMatrix"], function (require, exports, AbstractMatrix_1) {
    "use strict";
    var Matrix3 = (function (_super) {
        __extends(Matrix3, _super);
        function Matrix3(elements) {
            return _super.call(this, elements, 3) || this;
        }
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
        Matrix3.one = function () {
            return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        return Matrix3;
    }(AbstractMatrix_1.default));
    exports.Matrix3 = Matrix3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Matrix3;
});

define('davinci-newton/math/Spinor3',["require", "exports"], function (require, exports) {
    "use strict";
    var Spinor3 = (function () {
        function Spinor3(a, xy, yz, zx) {
            if (a === void 0) { a = 1; }
            if (xy === void 0) { xy = 0; }
            if (yz === void 0) { yz = 0; }
            if (zx === void 0) { zx = 0; }
            this.a = a;
            this.xy = xy;
            this.yz = yz;
            this.zx = zx;
        }
        Spinor3.prototype.copy = function (spinor) {
            this.a = spinor.a;
            this.xy = spinor.xy;
            this.yz = spinor.yz;
            this.zx = spinor.zx;
            return this;
        };
        Spinor3.prototype.one = function () {
            this.a = 1;
            this.xy = 0;
            this.yz = 0;
            this.zx = 0;
            return this;
        };
        return Spinor3;
    }());
    exports.Spinor3 = Spinor3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spinor3;
});

define('davinci-newton/math/Vector',["require", "exports", "../util/veryDifferent"], function (require, exports, veryDifferent_1) {
    "use strict";
    var Vector = (function () {
        function Vector(x_, y_, z_) {
            this.x_ = x_;
            this.y_ = y_;
            this.z_ = z_;
        }
        Object.defineProperty(Vector.prototype, "x", {
            get: function () {
                return this.x_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "y", {
            get: function () {
                return this.y_;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector.prototype, "z", {
            get: function () {
                return this.z_;
            },
            enumerable: true,
            configurable: true
        });
        Vector.prototype.add = function (rhs) {
            return new Vector(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z);
        };
        Vector.prototype.subtract = function (rhs) {
            return new Vector(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z);
        };
        Vector.prototype.multiply = function (alpha) {
            return new Vector(alpha * this.x, alpha * this.y, alpha * this.z);
        };
        Vector.prototype.cross = function (rhs) {
            var ax = this.x;
            var ay = this.y;
            var az = this.z;
            var bx = rhs.x;
            var by = rhs.y;
            var bz = rhs.z;
            var x = ay * bz - az * by;
            var y = az * bx - ax * bz;
            var z = ax * by - ay * bx;
            return new Vector(x, y, z);
        };
        Vector.prototype.distanceTo = function (rhs) {
            var Δx = this.x - rhs.x;
            var Δy = this.y - rhs.y;
            var Δz = this.z - rhs.z;
            return Math.sqrt(Δx * Δx + Δy * Δy + Δz * Δz);
        };
        Vector.prototype.immutable = function () {
            return this;
        };
        Vector.prototype.magnitude = function () {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            return Math.sqrt(x * x + y * y + z * z);
        };
        Vector.prototype.nearEqual = function (vector, tolerance) {
            if (veryDifferent_1.default(this.x_, vector.x, tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.y_, vector.y, tolerance)) {
                return false;
            }
            if (veryDifferent_1.default(this.z_, vector.z, tolerance)) {
                return false;
            }
            return true;
        };
        Vector.prototype.direction = function () {
            var magnitude = this.magnitude();
            if (magnitude !== 1) {
                if (magnitude === 0) {
                    throw new Error("direction is undefined.");
                }
                else {
                    return this.multiply(1 / magnitude);
                }
            }
            else {
                return this;
            }
        };
        Vector.prototype.rotate = function (spinor) {
            if (spinor.a === 1 && spinor.xy === 0 && spinor.yz === 0 && spinor.zx === 0) {
                return this;
            }
            else {
                throw new Error("TODO: rotate(spinor)");
            }
        };
        Vector.dual = function (B) {
            return new Vector(-B.yz, -B.zx, -B.xy);
        };
        Vector.fromVector = function (v) {
            return new Vector(v.x, v.y, v.z);
        };
        return Vector;
    }());
    Vector.ORIGIN = new Vector(0, 0, 0);
    exports.Vector = Vector;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector;
});

define('davinci-newton/math/Vector3',["require", "exports"], function (require, exports) {
    "use strict";
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.prototype.applyMatrix = function (σ) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var e = σ.elements;
            this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
            this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
            this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;
            return this;
        };
        Vector3.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        };
        Vector3.prototype.dual = function (B) {
            this.x = -B.yz;
            this.y = -B.zx;
            this.z = -B.xy;
            return this;
        };
        Vector3.prototype.divByScalar = function (alpha) {
            this.x /= alpha;
            this.y /= alpha;
            this.z /= alpha;
            return this;
        };
        Vector3.prototype.mulByScalar = function (alpha) {
            this.x *= alpha;
            this.y *= alpha;
            this.z *= alpha;
            return this;
        };
        Vector3.prototype.neg = function () {
            return this.mulByScalar(-1);
        };
        Vector3.dual = function (B) {
            return new Vector3().dual(B);
        };
        return Vector3;
    }());
    exports.Vector3 = Vector3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Vector3;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/engine/RigidBody',["require", "exports", "../objects/AbstractSimObject", "../math/Bivector3", "../math/Matrix3", "../math/Spinor3", "../math/Vector", "../math/Vector3"], function (require, exports, AbstractSimObject_1, Bivector3_1, Matrix3_1, Spinor3_1, Vector_1, Vector3_1) {
    "use strict";
    var RigidBody = (function (_super) {
        __extends(RigidBody, _super);
        function RigidBody(name) {
            var _this = _super.call(this, name) || this;
            _this.mass_ = 1;
            _this.Ibody = Matrix3_1.default.one();
            _this.Ibodyinv = Matrix3_1.default.one();
            _this.varsIndex_ = -1;
            _this.position_ = new Vector3_1.default();
            _this.attitude_ = new Spinor3_1.default();
            _this.linearMomentum_ = new Vector3_1.default();
            _this.angularMomentum_ = new Bivector3_1.default();
            _this.V = new Vector3_1.default();
            _this.Iinv = Matrix3_1.default.one();
            _this.ω = new Vector3_1.default();
            _this.Ω = new Bivector3_1.default();
            _this.cm_body_ = Vector_1.default.ORIGIN;
            return _this;
        }
        Object.defineProperty(RigidBody.prototype, "X", {
            get: function () {
                return this.position_;
            },
            set: function (position) {
                this.position_.copy(position);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "R", {
            get: function () {
                return this.attitude_;
            },
            set: function (attitude) {
                this.attitude_.copy(attitude);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "P", {
            get: function () {
                return this.linearMomentum_;
            },
            set: function (momentum) {
                this.linearMomentum_.copy(momentum);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "L", {
            get: function () {
                return this.angularMomentum_;
            },
            set: function (angularMomentum) {
                this.angularMomentum_.copy(angularMomentum);
            },
            enumerable: true,
            configurable: true
        });
        RigidBody.prototype.getExpireTime = function () {
            return Number.POSITIVE_INFINITY;
        };
        RigidBody.prototype.getVarsIndex = function () {
            return this.varsIndex_;
        };
        RigidBody.prototype.setVarsIndex = function (index) {
            this.varsIndex_ = index;
        };
        Object.defineProperty(RigidBody.prototype, "M", {
            get: function () {
                return this.mass_;
            },
            set: function (mass) {
                this.mass_ = mass;
            },
            enumerable: true,
            configurable: true
        });
        RigidBody.prototype.momentAboutCM = function () {
            return 1;
        };
        RigidBody.prototype.rotationalEnergy = function () {
            return 0;
        };
        RigidBody.prototype.translationalEnergy = function () {
            return 0;
        };
        RigidBody.prototype.bodyToWorld = function (bodyPoint) {
            var r = Vector_1.default.fromVector(bodyPoint).subtract(this.cm_body_);
            return r.rotate(this.R).add(this.X);
        };
        RigidBody.prototype.worldVelocityOfBodyPoint = function (bodyPoint) {
            var r = this.rotateBodyToWorld(Vector_1.default.fromVector(bodyPoint).subtract(this.cm_body_));
            return Vector_1.default.fromVector(this.ω).cross(r).add(this.V);
        };
        RigidBody.prototype.rotateBodyToWorld = function (bodyPoint) {
            return Vector_1.default.fromVector(bodyPoint).rotate(this.R);
        };
        return RigidBody;
    }(AbstractSimObject_1.default));
    exports.RigidBody = RigidBody;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RigidBody;
});

define('davinci-newton/model/EnergyInfo',["require", "exports"], function (require, exports) {
    "use strict";
    var EnergyInfo = (function () {
        function EnergyInfo(potential, translational, rotational) {
        }
        EnergyInfo.prototype.getPotential = function () {
            return 0;
        };
        EnergyInfo.prototype.getTranslational = function () {
            return 0;
        };
        EnergyInfo.prototype.getRotational = function () {
            return 0;
        };
        EnergyInfo.prototype.getTotalEnergy = function () {
            return 0;
        };
        return EnergyInfo;
    }());
    exports.EnergyInfo = EnergyInfo;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EnergyInfo;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/core/SimList',["require", "exports", "../util/AbstractSubject", "../util/contains", "../util/GenericEvent", "../checks/mustBeNonNullObject"], function (require, exports, AbstractSubject_1, contains_1, GenericEvent_1, mustBeNonNullObject_1) {
    "use strict";
    var SimList = (function (_super) {
        __extends(SimList, _super);
        function SimList() {
            var _this = _super.call(this, 'SIM_LIST') || this;
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
            throw new Error("TODO");
        };
        SimList.prototype.removeTemporary = function (time) {
            for (var i = this.elements_.length - 1; i >= 0; i--) {
                var simobj = this.elements_[i];
                if (simobj.getExpireTime() < time) {
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
        function ConcreteVariable(varsList_, name, localName_) {
            this.varsList_ = varsList_;
            this.localName_ = localName_;
            this.value_ = 0;
            this.seq_ = 0;
            this.isComputed_ = false;
            this.doesBroadcast_ = false;
            this.name_ = validName_1.default(toName_1.default(name));
        }
        ConcreteVariable.prototype.getBroadcast = function () {
            return this.doesBroadcast_;
        };
        ConcreteVariable.prototype.getName = function (localized) {
            return localized ? this.localName_ : this.name_;
        };
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

define('davinci-newton/checks/isArray',["require", "exports"], function (require, exports) {
    "use strict";
    function isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isArray;
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

define('davinci-newton/checks/isString',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(s) {
        return (typeof s === 'string');
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isString;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/core/VarsList',["require", "exports", "../util/AbstractSubject", "../util/clone", "../model/ConcreteVariable", "../util/extendArray", "../util/find", "../util/findIndex", "../util/GenericEvent", "../checks/isNumber", "../checks/isString", "../util/toName", "../util/validName"], function (require, exports, AbstractSubject_1, clone_1, ConcreteVariable_1, extendArray_1, find_1, findIndex_1, GenericEvent_1, isNumber_1, isString_1, toName_1, validName_1) {
    "use strict";
    var VarsList = (function (_super) {
        __extends(VarsList, _super);
        function VarsList(varNames, localNames, name) {
            if (name === void 0) { name = 'VARIABLES'; }
            var _this = _super.call(this, name) || this;
            _this.timeIdx_ = -1;
            _this.varList_ = [];
            _this.history_ = true;
            _this.histArray_ = [];
            if (varNames.length !== localNames.length) {
                throw new Error('varNames and localNames are different lengths');
            }
            for (var i = 0, n = varNames.length; i < n; i++) {
                var s = varNames[i];
                if (!isString_1.default(s)) {
                    throw new Error('variable name ' + s + ' is not a string i=' + i);
                }
                s = validName_1.default(toName_1.default(s));
                varNames[i] = s;
                if (s === VarsList.TIME) {
                    _this.timeIdx_ = i;
                }
            }
            for (var i = 0, n = varNames.length; i < n; i++) {
                _this.varList_.push(new ConcreteVariable_1.default(_this, varNames[i], localNames[i]));
            }
            return _this;
        }
        VarsList.prototype.findOpenSlot_ = function (quantity) {
            var found = 0;
            var startIdx = -1;
            for (var i = 0, n = this.varList_.length; i < n; i++) {
                if (this.varList_[i].getName() === VarsList.DELETED) {
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
            for (i = 0; i < expand; i++) {
                newVars.push(new ConcreteVariable_1.default(this, VarsList.DELETED, VarsList.DELETED));
            }
            extendArray_1.default(this.varList_, expand, newVars);
            return startIdx;
        };
        VarsList.prototype.addVariables = function (names, localNames) {
            var howMany = names.length;
            if (howMany === 0) {
                throw new Error();
            }
            if (names.length !== localNames.length) {
                throw new Error('names and localNames are different lengths');
            }
            var position = this.findOpenSlot_(howMany);
            for (var i = 0; i < howMany; i++) {
                var name_1 = validName_1.default(toName_1.default(names[i]));
                if (name_1 === VarsList.DELETED) {
                    throw new Error("variable cannot be named ''+VarsList.DELETED+''");
                }
                var idx = position + i;
                this.varList_[idx] = new ConcreteVariable_1.default(this, name_1, localNames[i]);
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
                this.varList_[i] = new ConcreteVariable_1.default(this, VarsList.DELETED, VarsList.DELETED);
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
                throw new Error('cannot set variable ' + variable.getName() + ' to NaN');
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
            var name = variable.getName();
            if (name === VarsList.DELETED) {
                throw new Error('variable cannot be named "' + VarsList.DELETED + '"');
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
                return p.getName() === name;
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
                index = findIndex_1.default(this.varList_, function (v) { return v.getName() === id; });
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/engine/RigidBodySim',["require", "exports", "../util/AbstractSubject", "../util/contains", "../model/EnergyInfo", "../util/remove", "../core/SimList", "../core/VarsList"], function (require, exports, AbstractSubject_1, contains_1, EnergyInfo_1, remove_1, SimList_1, VarsList_1) {
    "use strict";
    var var_names = [
        'time',
        'kinetic enetry',
        'potential energy',
        'total energy'
    ];
    var i18n_names = [
        'time',
        'kinetic enetry',
        'potential energy',
        'total energy'
    ];
    var Offset;
    (function (Offset) {
        Offset[Offset["POSITION_X"] = 0] = "POSITION_X";
        Offset[Offset["POSITION_Y"] = 1] = "POSITION_Y";
        Offset[Offset["POSITION_Z"] = 2] = "POSITION_Z";
        Offset[Offset["ATTITUDE_A"] = 3] = "ATTITUDE_A";
        Offset[Offset["ATTITUDE_YZ"] = 4] = "ATTITUDE_YZ";
        Offset[Offset["ATTITUDE_ZX"] = 5] = "ATTITUDE_ZX";
        Offset[Offset["ATTITUDE_XY"] = 6] = "ATTITUDE_XY";
        Offset[Offset["LINEAR_MOMENTUM_X"] = 7] = "LINEAR_MOMENTUM_X";
        Offset[Offset["LINEAR_MOMENTUM_Y"] = 8] = "LINEAR_MOMENTUM_Y";
        Offset[Offset["LINEAR_MOMENTUM_Z"] = 9] = "LINEAR_MOMENTUM_Z";
        Offset[Offset["ANGULAR_MOMENTUM_YZ"] = 10] = "ANGULAR_MOMENTUM_YZ";
        Offset[Offset["ANGULAR_MOMENTUM_ZX"] = 11] = "ANGULAR_MOMENTUM_ZX";
        Offset[Offset["ANGULAR_MOMENTUM_XY"] = 12] = "ANGULAR_MOMENTUM_XY";
    })(Offset || (Offset = {}));
    function getVarName(index, localized) {
        switch (index) {
            case Offset.POSITION_X: return "position x";
            case Offset.POSITION_Y: return "position y";
            case Offset.POSITION_Z: return "position z";
            case Offset.ATTITUDE_A: return "attitude a";
            case Offset.ATTITUDE_YZ: return "attitude yz";
            case Offset.ATTITUDE_ZX: return "attitude zx";
            case Offset.ATTITUDE_XY: return "attitude xy";
            case Offset.LINEAR_MOMENTUM_X: return "momentum x";
            case Offset.LINEAR_MOMENTUM_Y: return "momentum y";
            case Offset.LINEAR_MOMENTUM_Z: return "momentum z";
            case Offset.ANGULAR_MOMENTUM_YZ: return "angular momentum yz";
            case Offset.ANGULAR_MOMENTUM_ZX: return "angular momentum zx";
            case Offset.ANGULAR_MOMENTUM_XY: return "angular momentum xy";
        }
        throw new Error("getVarName(" + index + ")");
    }
    var NUM_VARS_IN_STATE = 13;
    var RigidBodySim = (function (_super) {
        __extends(RigidBodySim, _super);
        function RigidBodySim(name) {
            if (name === void 0) { name = 'SIM'; }
            var _this = _super.call(this, name) || this;
            _this.simList_ = new SimList_1.default();
            _this.bodies_ = [];
            _this.forceLaws_ = [];
            _this.showForces_ = false;
            _this.varsList_ = new VarsList_1.default(var_names, i18n_names, _this.getName() + '_VARS');
            return _this;
        }
        Object.defineProperty(RigidBodySim.prototype, "showForces", {
            get: function () {
                return this.showForces_;
            },
            set: function (showForces) {
                this.showForces_ = showForces;
            },
            enumerable: true,
            configurable: true
        });
        RigidBodySim.prototype.addBody = function (body) {
            if (!contains_1.default(this.bodies_, body)) {
                var names = [];
                for (var k = 0; k < NUM_VARS_IN_STATE; k++) {
                    names.push(getVarName(k, false));
                }
                var localNames = [];
                for (var k = 0; k < NUM_VARS_IN_STATE; k++) {
                    localNames.push(getVarName(k, true));
                }
                var idx = this.varsList_.addVariables(names, localNames);
                body.setVarsIndex(idx);
                this.bodies_.push(body);
                this.getSimList().add(body);
            }
            this.initializeFromBody(body);
            this.bodies_.forEach(function (b) {
            });
        };
        RigidBodySim.prototype.removeBody = function (body) {
            if (contains_1.default(this.bodies_, body)) {
                this.varsList_.deleteVariables(body.getVarsIndex(), NUM_VARS_IN_STATE);
                remove_1.default(this.bodies_, body);
                body.setVarsIndex(-1);
            }
            this.getSimList().remove(body);
            this.getVarsList().incrSequence(1, 2, 3);
        };
        RigidBodySim.prototype.addForceLaw = function (forceLaw) {
            if (!contains_1.default(this.forceLaws_, forceLaw)) {
                this.forceLaws_.push(forceLaw);
            }
            this.getVarsList().incrSequence(1, 2, 3);
        };
        RigidBodySim.prototype.removeForceLaw = function (forceLaw) {
            forceLaw.disconnect();
            this.getVarsList().incrSequence(1, 2, 3);
            return remove_1.default(this.forceLaws_, forceLaw);
        };
        ;
        RigidBodySim.prototype.moveObjects = function (vars) {
            this.bodies_.forEach(function (body) {
                var idx = body.getVarsIndex();
                if (idx < 0) {
                    return;
                }
                body.X.x = vars[idx + Offset.POSITION_X];
                body.X.y = vars[idx + Offset.POSITION_Y];
                body.X.z = vars[idx + Offset.POSITION_Z];
                body.R.a = vars[idx + Offset.ATTITUDE_A];
                body.R.xy = vars[idx + Offset.ATTITUDE_XY];
                body.R.yz = vars[idx + Offset.ATTITUDE_YZ];
                body.R.zx = vars[idx + Offset.ATTITUDE_ZX];
                body.P.x = vars[idx + Offset.LINEAR_MOMENTUM_X];
                body.P.y = vars[idx + Offset.LINEAR_MOMENTUM_Y];
                body.P.z = vars[idx + Offset.LINEAR_MOMENTUM_Z];
                body.L.xy = vars[idx + Offset.ANGULAR_MOMENTUM_XY];
                body.L.yz = vars[idx + Offset.ANGULAR_MOMENTUM_YZ];
                body.L.zx = vars[idx + Offset.ANGULAR_MOMENTUM_ZX];
                body.V.copy(body.P).divByScalar(body.M);
                body.ω.dual(body.L).neg().applyMatrix(body.Iinv);
                body.Ω.dual(body.ω);
            });
        };
        RigidBodySim.prototype.evaluate = function (vars, change, time) {
            var _this = this;
            this.moveObjects(vars);
            this.bodies_.forEach(function (body) {
                var idx = body.getVarsIndex();
                if (idx < 0) {
                    return;
                }
                var mass = body.M;
                if (mass === Number.POSITIVE_INFINITY) {
                    for (var k = 0; k < NUM_VARS_IN_STATE; k++)
                        change[idx + k] = 0;
                }
                else {
                    change[idx + Offset.POSITION_X] = vars[idx + Offset.LINEAR_MOMENTUM_X] / mass;
                    change[idx + Offset.POSITION_Y] = vars[idx + Offset.LINEAR_MOMENTUM_Y] / mass;
                    change[idx + Offset.POSITION_Z] = vars[idx + Offset.LINEAR_MOMENTUM_Z] / mass;
                    var R = body.R;
                    var Ω = body.Ω;
                    change[idx + Offset.ATTITUDE_A] = -0.5 * (Ω.xy * R.xy + Ω.yz * R.yz + Ω.zx * R.zx);
                    change[idx + Offset.ATTITUDE_XY] = 0.5 * Ω.xy * R.a;
                    change[idx + Offset.ATTITUDE_YZ] = 0.5 * Ω.yz * R.a;
                    change[idx + Offset.ATTITUDE_ZX] = 0.5 * Ω.zx * R.a;
                    change[idx + Offset.LINEAR_MOMENTUM_X] = 0;
                    change[idx + Offset.LINEAR_MOMENTUM_Y] = 0;
                    change[idx + Offset.LINEAR_MOMENTUM_Z] = 0;
                    change[idx + Offset.ANGULAR_MOMENTUM_XY] = 0;
                    change[idx + Offset.ANGULAR_MOMENTUM_YZ] = 0;
                    change[idx + Offset.ANGULAR_MOMENTUM_ZX] = 0;
                }
            });
            this.forceLaws_.forEach(function (forceLaw) {
                var forces = forceLaw.calculateForces();
                forces.forEach(function (force) {
                    _this.applyForce(change, force);
                });
            });
            change[this.varsList_.timeIndex()] = 1;
            return null;
        };
        RigidBodySim.prototype.applyForce = function (change, forceApp) {
            var body = forceApp.getBody();
            if (!(contains_1.default(this.bodies_, body))) {
                return;
            }
            var idx = body.getVarsIndex();
            if (idx < 0) {
                return;
            }
            var F = forceApp.F, Γ = forceApp.Γ;
            change[idx + Offset.LINEAR_MOMENTUM_X] += F.x;
            change[idx + Offset.LINEAR_MOMENTUM_Y] += F.y;
            change[idx + Offset.LINEAR_MOMENTUM_Z] += F.z;
            change[idx + Offset.ANGULAR_MOMENTUM_YZ] += Γ.yz;
            change[idx + Offset.ANGULAR_MOMENTUM_ZX] += Γ.zx;
            change[idx + Offset.ANGULAR_MOMENTUM_XY] += Γ.xy;
            if (this.showForces_) {
                forceApp.setExpireTime(this.getTime());
                this.getSimList().add(forceApp);
            }
        };
        RigidBodySim.prototype.getTime = function () {
            return this.varsList_.getTime();
        };
        RigidBodySim.prototype.initializeFromBody = function (body) {
            var idx = body.getVarsIndex();
            if (idx > -1) {
                var va = this.varsList_;
                va.setValue(Offset.POSITION_X + idx, body.X.x);
                va.setValue(Offset.POSITION_Y + idx, body.X.y);
                va.setValue(Offset.POSITION_Z + idx, body.X.z);
                va.setValue(Offset.ATTITUDE_A + idx, body.R.a);
                va.setValue(Offset.ATTITUDE_XY + idx, body.R.xy);
                va.setValue(Offset.ATTITUDE_YZ + idx, body.R.yz);
                va.setValue(Offset.ATTITUDE_ZX + idx, body.R.zx);
                va.setValue(Offset.LINEAR_MOMENTUM_X + idx, body.P.x);
                va.setValue(Offset.LINEAR_MOMENTUM_Y + idx, body.P.y);
                va.setValue(Offset.LINEAR_MOMENTUM_Z + idx, body.P.z);
                va.setValue(Offset.ANGULAR_MOMENTUM_XY + idx, body.L.xy);
                va.setValue(Offset.ANGULAR_MOMENTUM_YZ + idx, body.L.yz);
                va.setValue(Offset.ANGULAR_MOMENTUM_ZX + idx, body.L.zx);
            }
            this.getVarsList().incrSequence(1, 2, 3);
        };
        RigidBodySim.prototype.modifyObjects = function () {
            var va = this.varsList_;
            var vars = va.getValues();
            this.moveObjects(vars);
            var einfo = this.getEnergyInfo_(vars);
            va.setValue(1, einfo.getTranslational() + einfo.getRotational(), true);
            va.setValue(2, einfo.getPotential(), true);
            va.setValue(3, einfo.getTotalEnergy(), true);
        };
        RigidBodySim.prototype.getSimList = function () {
            return this.simList_;
        };
        RigidBodySim.prototype.getVarsList = function () {
            return this.varsList_;
        };
        RigidBodySim.prototype.getEnergyInfo_ = function (vars) {
            var pe = 0;
            var re = 0;
            var te = 0;
            this.bodies_.forEach(function (b) {
                if (isFinite(b.M)) {
                    re += b.rotationalEnergy();
                    te += b.translationalEnergy();
                }
            });
            this.forceLaws_.forEach(function (forceLaw) {
                pe += forceLaw.getPotentialEnergy();
            });
            return new EnergyInfo_1.default(pe + this.potentialOffset_, te, re);
        };
        RigidBodySim.prototype.saveState = function () {
            this.recentState_ = this.varsList_.getValues();
            this.bodies_.forEach(function (b) {
            });
        };
        RigidBodySim.prototype.restoreState = function () {
            if (this.recentState_ != null) {
                this.varsList_.setValues(this.recentState_, true);
            }
            this.bodies_.forEach(function (b) {
            });
        };
        RigidBodySim.prototype.findCollisions = function (collisions, vars, stepSize) {
            throw new Error("TODO: findCollisions");
        };
        return RigidBodySim;
    }(AbstractSubject_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RigidBodySim;
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

define('davinci-newton/model/RungeKutta',["require", "exports", "../util/zeroArray"], function (require, exports, zeroArray_1) {
    "use strict";
    var RungeKutta = (function () {
        function RungeKutta(ode_) {
            this.ode_ = ode_;
            this.inp_ = [];
            this.k1_ = [];
            this.k2_ = [];
            this.k3_ = [];
            this.k4_ = [];
        }
        RungeKutta.prototype.step = function (stepSize) {
            var error, i;
            var va = this.ode_.getVarsList();
            var vars = va.getValues();
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
            for (i = 0; i < N; i++) {
                inp[i] = vars[i];
            }
            zeroArray_1.default(k1);
            error = this.ode_.evaluate(inp, k1, 0);
            if (error !== null) {
                return error;
            }
            for (i = 0; i < N; i++) {
                inp[i] = vars[i] + k1[i] * stepSize / 2;
            }
            zeroArray_1.default(k2);
            error = this.ode_.evaluate(inp, k2, stepSize / 2);
            if (error !== null) {
                return error;
            }
            for (i = 0; i < N; i++) {
                inp[i] = vars[i] + k2[i] * stepSize / 2;
            }
            zeroArray_1.default(k3);
            error = this.ode_.evaluate(inp, k3, stepSize / 2);
            if (error !== null) {
                return error;
            }
            for (i = 0; i < N; i++) {
                inp[i] = vars[i] + k3[i] * stepSize;
            }
            zeroArray_1.default(k4);
            error = this.ode_.evaluate(inp, k4, stepSize);
            if (error !== null) {
                return error;
            }
            for (i = 0; i < N; i++) {
                vars[i] += (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]) * stepSize / 6;
            }
            va.setValues(vars, true);
            return null;
        };
        return RungeKutta;
    }());
    exports.RungeKutta = RungeKutta;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RungeKutta;
});

define('davinci-newton/strategy/SimpleAdvance',["require", "exports"], function (require, exports) {
    "use strict";
    var SimpleAdvance = (function () {
        function SimpleAdvance(sim_, odeSolver_) {
            this.sim_ = sim_;
            this.odeSolver_ = odeSolver_;
            this.timeStep_ = 0.025;
        }
        SimpleAdvance.prototype.advance = function (timeStep, memoList) {
            this.sim_.getSimList().removeTemporary(this.sim_.getTime());
            var err = this.odeSolver_.step(timeStep);
            if (err != null) {
                throw new Error("error during advance " + err);
            }
            this.sim_.modifyObjects();
            if (memoList !== undefined) {
                memoList.memorize();
            }
        };
        SimpleAdvance.prototype.getTime = function () {
            return this.sim_.getTime();
        };
        SimpleAdvance.prototype.getTimeStep = function () {
            return this.timeStep_;
        };
        return SimpleAdvance;
    }());
    exports.SimpleAdvance = SimpleAdvance;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimpleAdvance;
});

define('davinci-newton/util/getSystemTime',["require", "exports"], function (require, exports) {
    "use strict";
    function getSystemTime() {
        return Date.now() * 1E-3;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getSystemTime;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/runner/Clock',["require", "exports", "../util/AbstractSubject", "../util/GenericEvent", "../util/getSystemTime"], function (require, exports, AbstractSubject_1, GenericEvent_1, getSystemTime_1) {
    "use strict";
    var Clock = (function (_super) {
        __extends(Clock, _super);
        function Clock(name) {
            if (name === void 0) { name = 'CLOCK'; }
            var _this = _super.call(this, name) || this;
            _this.clockStart_sys_secs_ = getSystemTime_1.default();
            _this.isRunning_ = false;
            _this.saveTime_secs_ = 0;
            _this.saveRealTime_secs_ = 0;
            _this.stepMode_ = false;
            _this.tasks_ = [];
            _this.timeRate_ = 1;
            _this.realStart_sys_secs_ = _this.clockStart_sys_secs_;
            return _this;
        }
        Clock.prototype.clearStepMode = function () {
            this.stepMode_ = false;
        };
        Clock.prototype.getTime = function () {
            if (this.isRunning_) {
                return (getSystemTime_1.default() - this.clockStart_sys_secs_) * this.timeRate_;
            }
            else {
                return this.saveTime_secs_;
            }
        };
        Clock.prototype.resume = function () {
            this.clearStepMode();
            if (!this.isRunning_) {
                this.isRunning_ = true;
                this.setTimePrivate(this.saveTime_secs_);
                this.setRealTime(this.saveRealTime_secs_);
                this.broadcast(new GenericEvent_1.default(this, Clock.CLOCK_RESUME));
            }
        };
        Clock.prototype.setTime = function (time_secs) {
            this.setTimePrivate(time_secs);
            this.broadcast(new GenericEvent_1.default(this, Clock.CLOCK_SET_TIME));
        };
        Clock.prototype.setTimePrivate = function (time_secs) {
            if (this.isRunning_) {
                this.clockStart_sys_secs_ = getSystemTime_1.default() - time_secs / this.timeRate_;
                this.scheduleAllClockTasks();
            }
            else {
                this.saveTime_secs_ = time_secs;
            }
        };
        Clock.prototype.scheduleAllClockTasks = function () {
            var _this = this;
            this.tasks_.forEach(function (task) { _this.scheduleTask(task); });
        };
        Clock.prototype.scheduleTask = function (task) {
            task.cancel();
            if (this.isRunning_) {
                var nowTime = this.clockToSystem(this.getTime());
                var taskTime = this.clockToSystem(task.getTime());
                if (taskTime >= nowTime) {
                    task.schedule(taskTime - nowTime);
                }
            }
        };
        Clock.prototype.setRealTime = function (time_secs) {
            if (this.isRunning_) {
                this.realStart_sys_secs_ = getSystemTime_1.default() - time_secs / this.timeRate_;
            }
            else {
                this.saveRealTime_secs_ = time_secs;
            }
        };
        Clock.prototype.clockToSystem = function (clockTime) {
            return clockTime / this.timeRate_ + this.clockStart_sys_secs_;
        };
        return Clock;
    }(AbstractSubject_1.default));
    Clock.CLOCK_RESUME = 'CLOCK_RESUME';
    Clock.CLOCK_SET_TIME = 'CLOCK_SET_TIME';
    exports.Clock = Clock;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Clock;
});

define('davinci-newton/runner/SimRunner',["require", "exports", "./Clock"], function (require, exports, Clock_1) {
    "use strict";
    var SimRunner = (function () {
        function SimRunner(advanceStrategy_, name) {
            this.advanceStrategy_ = advanceStrategy_;
            this.clock_ = new Clock_1.default();
            this.timeStep_ = advanceStrategy_.getTimeStep();
        }
        SimRunner.prototype.getClock = function () {
            return this.clock_;
        };
        SimRunner.prototype.advanceToTargetTime = function (strategy, targetTime) {
            var simTime = strategy.getTime();
            while (simTime < targetTime) {
                strategy.advance(this.timeStep_, this);
                var lastSimTime = simTime;
                simTime = strategy.getTime();
                if (simTime - lastSimTime <= 1e-15) {
                    throw new Error('SimRunner time did not advance');
                }
            }
        };
        SimRunner.prototype.update = function () {
            var clockTime = this.clock_.getTime();
            var simTime = this.advanceStrategy_.getTime();
            if (clockTime > simTime + 1 || clockTime < simTime - 1) {
                var t = simTime + this.timeStep_;
                this.clock_.setTime(t);
                this.clock_.setRealTime(t);
                clockTime = t;
            }
            var startTime = clockTime;
            var targetTime = startTime - this.timeStep_ / 10;
            this.advanceToTargetTime(this.advanceStrategy_, targetTime);
        };
        SimRunner.prototype.memorize = function () {
        };
        return SimRunner;
    }());
    exports.SimRunner = SimRunner;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SimRunner;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('davinci-newton/objects/Spring',["require", "exports", "./AbstractSimObject", "../model/CoordType", "../model/ForceApp", "../math/Vector"], function (require, exports, AbstractSimObject_1, CoordType_1, ForceApp_1, Vector_1) {
    "use strict";
    var Spring = (function (_super) {
        __extends(Spring, _super);
        function Spring(name, body1_, body2_) {
            var _this = _super.call(this, name) || this;
            _this.body1_ = body1_;
            _this.body2_ = body2_;
            _this.damping_ = 0;
            _this.compressOnly_ = false;
            _this.restLength_ = 1;
            _this.stiffness_ = 1;
            _this.attach1_ = Vector_1.default.ORIGIN;
            _this.attach2_ = Vector_1.default.ORIGIN;
            return _this;
        }
        Spring.prototype.getStartPoint = function () {
            if (this.attach1_ == null || this.body1_ == null) {
                throw new Error();
            }
            return this.body1_.bodyToWorld(this.attach1_);
        };
        Spring.prototype.getEndPoint = function () {
            if (this.attach2_ == null || this.body2_ == null) {
                throw new Error();
            }
            var p2 = this.body2_.bodyToWorld(this.attach2_);
            if (this.compressOnly_) {
                var p1 = this.getStartPoint();
                var dist = p1.distanceTo(p2);
                var rlen = this.restLength_;
                if (dist <= rlen) {
                    return p2;
                }
                else {
                    var n = p2.subtract(p1).direction();
                    return p1.add(n.multiply(rlen));
                }
            }
            else {
                return p2;
            }
        };
        Spring.prototype.calculateForces = function () {
            var point1 = this.getStartPoint();
            var point2 = this.getEndPoint();
            var v = point2.subtract(point1);
            var len = v.magnitude();
            var sf = -this.stiffness_ * (len - this.restLength_);
            var fx = -sf * (v.x / len);
            var fy = -sf * (v.y / len);
            var fz = -sf * (v.z / len);
            var f = new Vector_1.default(fx, fy, fz);
            if (this.damping_ !== 0) {
                if (!this.compressOnly_ || len < this.restLength_ - 1E-10) {
                    var v1 = this.body1_.worldVelocityOfBodyPoint(this.attach1_);
                    var v2 = this.body2_.worldVelocityOfBodyPoint(this.attach2_);
                    var df = v1.subtract(v2).multiply(-this.damping_);
                    f = f.add(df);
                }
            }
            return [
                new ForceApp_1.default('spring', this.body1_, point1, CoordType_1.default.WORLD, f, CoordType_1.default.WORLD),
                new ForceApp_1.default('spring', this.body2_, point2, CoordType_1.default.WORLD, f.multiply(-1), CoordType_1.default.WORLD)
            ];
        };
        Spring.prototype.disconnect = function () {
        };
        Spring.prototype.getPotentialEnergy = function () {
            return 0;
        };
        Spring.prototype.getVector = function () {
            return this.getEndPoint().subtract(this.getStartPoint());
        };
        return Spring;
    }(AbstractSimObject_1.default));
    exports.Spring = Spring;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spring;
});

define('davinci-newton',["require", "exports", "./davinci-newton/util/CircularList", "./davinci-newton/config", "./davinci-newton/graph/DisplayGraph", "./davinci-newton/model/ForceApp", "./davinci-newton/graph/Graph", "./davinci-newton/view/LabCanvas", "./davinci-newton/engine/RigidBody", "./davinci-newton/engine/RigidBodySim", "./davinci-newton/model/RungeKutta", "./davinci-newton/strategy/SimpleAdvance", "./davinci-newton/runner/SimRunner", "./davinci-newton/view/SimView", "./davinci-newton/objects/Spring", "./davinci-newton/math/Vector"], function (require, exports, CircularList_1, config_1, DisplayGraph_1, ForceApp_1, Graph_1, LabCanvas_1, RigidBody_1, RigidBodySim_1, RungeKutta_1, SimpleAdvance_1, SimRunner_1, SimView_1, Spring_1, Vector_1) {
    "use strict";
    var newton = {
        get LAST_MODIFIED() { return config_1.default.LAST_MODIFIED; },
        get VERSION() { return config_1.default.VERSION; },
        get CircularList() { return CircularList_1.default; },
        get DisplayGraph() { return DisplayGraph_1.default; },
        get ForceApp() { return ForceApp_1.default; },
        get Graph() { return Graph_1.default; },
        get LabCanvas() { return LabCanvas_1.default; },
        get RigidBody() { return RigidBody_1.default; },
        get RigidBodySim() { return RigidBodySim_1.default; },
        get RungeKutta() { return RungeKutta_1.default; },
        get SimpleAdvance() { return SimpleAdvance_1.default; },
        get SimRunner() { return SimRunner_1.default; },
        get SimView() { return SimView_1.default; },
        get Spring() { return Spring_1.default; },
        get Vector() { return Vector_1.default; },
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
