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

define('lib/EventEmitterClass',["require", "exports"], function (require, exports) {
    "use strict";
    var stopPropagation = function () { this.propagationStopped = true; };
    var preventDefault = function () { this.defaultPrevented = true; };
    var EventEmitterClass = (function () {
        function EventEmitterClass(owner) {
            this.owner = owner;
        }
        EventEmitterClass.prototype._dispatchEvent = function (eventName, event) {
            this._eventRegistry || (this._eventRegistry = {});
            this._defaultHandlers || (this._defaultHandlers = {});
            var listeners = this._eventRegistry[eventName] || [];
            var defaultHandler = this._defaultHandlers[eventName];
            if (!listeners.length && !defaultHandler)
                return;
            if (typeof event !== "object" || !event) {
                event = {};
            }
            if (!event.type) {
                event.type = eventName;
            }
            if (!event.stopPropagation) {
                event.stopPropagation = stopPropagation;
            }
            if (!event.preventDefault) {
                event.preventDefault = preventDefault;
            }
            listeners = listeners.slice();
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](event, this.owner);
                if (event['propagationStopped']) {
                    break;
                }
            }
            if (defaultHandler && !event.defaultPrevented) {
                return defaultHandler(event, this.owner);
            }
        };
        EventEmitterClass.prototype.hasListeners = function (eventName) {
            var registry = this._eventRegistry;
            var listeners = registry && registry[eventName];
            return listeners && listeners.length > 0;
        };
        EventEmitterClass.prototype._emit = function (eventName, event) {
            return this._dispatchEvent(eventName, event);
        };
        EventEmitterClass.prototype._signal = function (eventName, e) {
            var listeners = (this._eventRegistry || {})[eventName];
            if (!listeners) {
                return;
            }
            listeners = listeners.slice();
            for (var i = 0, iLength = listeners.length; i < iLength; i++) {
                listeners[i](e, this.owner);
            }
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
            if (!handlers) {
                handlers = this._defaultHandlers = { _disabled_: {} };
            }
            if (handlers[eventName]) {
                var existingHandler = handlers[eventName];
                var disabled = handlers._disabled_[eventName];
                if (!disabled) {
                    handlers._disabled_[eventName] = disabled = [];
                }
                disabled.push(existingHandler);
                var i = disabled.indexOf(callback);
                if (i != -1)
                    disabled.splice(i, 1);
            }
            handlers[eventName] = callback;
        };
        EventEmitterClass.prototype.removeDefaultHandler = function (eventName, callback) {
            var handlers = this._defaultHandlers;
            if (!handlers) {
                return;
            }
            var disabled = handlers._disabled_[eventName];
            if (handlers[eventName] === callback) {
                var unused = handlers[eventName];
                if (disabled)
                    this.setDefaultHandler(eventName, disabled.pop());
            }
            else if (disabled) {
                var i = disabled.indexOf(callback);
                if (i != -1)
                    disabled.splice(i, 1);
            }
        };
        EventEmitterClass.prototype.addEventListener = function (eventName, callback, capturing) {
            this._eventRegistry = this._eventRegistry || {};
            var listeners = this._eventRegistry[eventName];
            if (!listeners) {
                listeners = this._eventRegistry[eventName] = [];
            }
            if (listeners.indexOf(callback) === -1) {
                if (capturing) {
                    listeners.unshift(callback);
                }
                else {
                    listeners.push(callback);
                }
            }
            return callback;
        };
        EventEmitterClass.prototype.on = function (eventName, callback, capturing) {
            this.addEventListener(eventName, callback, capturing);
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EventEmitterClass;
});

define('Anchor',["require", "exports", './lib/EventEmitterClass'], function (require, exports, EventEmitterClass_1) {
    "use strict";
    function pointsInOrder(point1, point2, equalPointsInOrder) {
        var bColIsAfter = equalPointsInOrder ? point1.column <= point2.column : point1.column < point2.column;
        return (point1.row < point2.row) || (point1.row === point2.row && bColIsAfter);
    }
    function getTransformedPoint(delta, point, moveIfEqual) {
        var deltaIsInsert = delta.action === "insert";
        var deltaRowShift = (deltaIsInsert ? 1 : -1) * (delta.end.row - delta.start.row);
        var deltaColShift = (deltaIsInsert ? 1 : -1) * (delta.end.column - delta.start.column);
        var deltaStart = delta.start;
        var deltaEnd = deltaIsInsert ? deltaStart : delta.end;
        if (pointsInOrder(point, deltaStart, moveIfEqual)) {
            return { column: point.column, row: point.row };
        }
        if (pointsInOrder(deltaEnd, point, !moveIfEqual)) {
            return {
                column: point.column + (point.row === deltaEnd.row ? deltaColShift : 0),
                row: point.row + deltaRowShift
            };
        }
        return { column: deltaStart.column, row: deltaStart.row };
    }
    var Anchor = (function () {
        function Anchor(doc, row, column) {
            var _this = this;
            this.eventBus = new EventEmitterClass_1.default(this);
            this.documentChangeHandler = function (delta, doc) {
                if (delta.start.row === delta.end.row && delta.start.row !== _this.row) {
                    return;
                }
                if (delta.start.row > _this.row) {
                    return;
                }
                var point = getTransformedPoint(delta, { row: _this.row, column: _this.column }, _this.insertRight);
                _this.setPosition(point.row, point.column, true);
            };
            this.attach(doc);
            this.setPosition(row, column);
            this.insertRight = false;
        }
        Anchor.prototype.getPosition = function () {
            return this.clipPositionToDocument(this.row, this.column);
        };
        Anchor.prototype.getDocument = function () {
            return this.document;
        };
        Anchor.prototype.setPosition = function (row, column, noClip) {
            var pos;
            if (noClip) {
                pos = { row: row, column: column };
            }
            else {
                pos = this.clipPositionToDocument(row, column);
            }
            if (this.row === pos.row && this.column === pos.column) {
                return;
            }
            else {
                var old = { row: this.row, column: this.column };
                this.row = pos.row;
                this.column = pos.column;
                var event_1 = { oldPosition: old, position: pos };
                this.eventBus._signal("change", event_1);
            }
        };
        Anchor.prototype.detach = function () {
            this.document.removeChangeListener(this.documentChangeHandler);
        };
        Anchor.prototype.attach = function (doc) {
            this.document = doc || this.document;
            this.document.addChangeListener(this.documentChangeHandler);
        };
        Anchor.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        Anchor.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        Anchor.prototype.clipPositionToDocument = function (row, column) {
            var pos = { column: 0, row: 0 };
            if (row >= this.document.getLength()) {
                pos.row = Math.max(0, this.document.getLength() - 1);
                pos.column = this.document.getLine(pos.row).length;
            }
            else if (row < 0) {
                pos.row = 0;
                pos.column = 0;
            }
            else {
                pos.row = row;
                pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
            }
            if (column < 0) {
                pos.column = 0;
            }
            return pos;
        };
        return Anchor;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Anchor;
});

define('createAnchor',["require", "exports", './Anchor'], function (require, exports, Anchor_1) {
    function createAnchor(doc, row, column) {
        return new Anchor_1.default(doc, row, column);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createAnchor;
});

define('applyDelta',["require", "exports"], function (require, exports) {
    function throwDeltaError(delta, errorText) {
        throw "Invalid Delta: " + errorText;
    }
    function positionInDocument(docLines, position) {
        return position.row >= 0 && position.row < docLines.length &&
            position.column >= 0 && position.column <= docLines[position.row].length;
    }
    function validateDelta(docLines, delta) {
        var action = delta.action;
        if (action !== "insert" && action !== "remove")
            throwDeltaError(delta, "delta.action must be 'insert' or 'remove'");
        if (!(delta.lines instanceof Array))
            throwDeltaError(delta, "delta.lines must be an Array");
        if (!delta.start || !delta.end)
            throwDeltaError(delta, "delta.start/end must be an present");
        var start = delta.start;
        if (!positionInDocument(docLines, delta.start))
            throwDeltaError(delta, "delta.start must be contained in document");
        var end = delta.end;
        if (action === "remove" && !positionInDocument(docLines, end))
            throwDeltaError(delta, "delta.end " + JSON.stringify(end) + " must be contained in document for 'remove' actions");
        var numRangeRows = end.row - start.row;
        var numRangeLastLineChars = (end.column - (numRangeRows === 0 ? start.column : 0));
        if (numRangeRows !== delta.lines.length - 1 || delta.lines[numRangeRows].length !== numRangeLastLineChars)
            throwDeltaError(delta, "delta.range must match delta lines");
    }
    function applyDelta(docLines, delta, doNotValidate) {
        if (!doNotValidate && false) {
            validateDelta(docLines, delta);
        }
        var row = delta.start.row;
        var startColumn = delta.start.column;
        var line = docLines[row] || "";
        switch (delta.action) {
            case "insert":
                var lines = delta.lines;
                if (lines.length === 1) {
                    docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
                }
                else {
                    var args = [row, 1];
                    args = args.concat(delta.lines);
                    docLines.splice.apply(docLines, args);
                    docLines[row] = line.substring(0, startColumn) + docLines[row];
                    docLines[row + delta.lines.length - 1] += line.substring(startColumn);
                }
                break;
            case "remove":
                var endColumn = delta.end.column;
                var endRow = delta.end.row;
                if (row === endRow) {
                    docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
                }
                else {
                    docLines.splice(row, endRow - row + 1, line.substring(0, startColumn) + docLines[endRow].substring(endColumn));
                }
                break;
            default: {
            }
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = applyDelta;
});

define('Range',["require", "exports"], function (require, exports) {
    "use strict";
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
            return this.start.row === range.start.row &&
                this.end.row === range.end.row &&
                this.start.column === range.start.column &&
                this.end.column === range.end.column;
        };
        Range.prototype.toString = function () {
            return ("Range: [" + this.start.row + "/" + this.start.column +
                "] -> [" + this.end.row + "/" + this.end.column + "]");
        };
        Range.prototype.contains = function (row, column) {
            return this.compare(row, column) === 0;
        };
        Range.prototype.compareRange = function (range) {
            var cmp;
            var end = range.end;
            var start = range.start;
            cmp = this.compare(end.row, end.column);
            if (cmp === 1) {
                cmp = this.compare(start.row, start.column);
                if (cmp === 1) {
                    return 2;
                }
                else if (cmp === 0) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
            else if (cmp === -1) {
                return -2;
            }
            else {
                cmp = this.compare(start.row, start.column);
                if (cmp === -1) {
                    return -1;
                }
                else if (cmp === 1) {
                    return 42;
                }
                else {
                    return 0;
                }
            }
        };
        Range.prototype.comparePoint = function (point) {
            return this.compare(point.row, point.column);
        };
        Range.prototype.containsRange = function (range) {
            return this.comparePoint(range.start) === 0 && this.comparePoint(range.end) === 0;
        };
        Range.prototype.intersects = function (range) {
            var cmp = this.compareRange(range);
            return (cmp === -1 || cmp === 0 || cmp === 1);
        };
        Range.prototype.isEnd = function (row, column) {
            return this.end.row === row && this.end.column === column;
        };
        Range.prototype.isStart = function (row, column) {
            return this.start.row === row && this.start.column === column;
        };
        Range.prototype.setStart = function (row, column) {
            this.start.row = row;
            this.start.column = column;
        };
        Range.prototype.setEnd = function (row, column) {
            this.end.row = row;
            this.end.column = column;
        };
        Range.prototype.inside = function (row, column) {
            if (this.compare(row, column) === 0) {
                if (this.isEnd(row, column) || this.isStart(row, column)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            return false;
        };
        Range.prototype.insideStart = function (row, column) {
            if (this.compare(row, column) === 0) {
                if (this.isEnd(row, column)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            return false;
        };
        Range.prototype.insideEnd = function (row, column) {
            if (this.compare(row, column) === 0) {
                if (this.isStart(row, column)) {
                    return false;
                }
                else {
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
            if (this.start.row === row && this.start.column === column) {
                return -1;
            }
            else {
                return this.compare(row, column);
            }
        };
        Range.prototype.compareEnd = function (row, column) {
            if (this.end.row === row && this.end.column === column) {
                return 1;
            }
            else {
                return this.compare(row, column);
            }
        };
        Range.prototype.compareInside = function (row, column) {
            if (this.end.row === row && this.end.column === column) {
                return 1;
            }
            else if (this.start.row === row && this.start.column === column) {
                return -1;
            }
            else {
                return this.compare(row, column);
            }
        };
        Range.prototype.clipRows = function (firstRow, lastRow) {
            if (typeof firstRow !== 'number') {
                throw new TypeError("clipRows() firstRow must be a number.");
            }
            if (typeof lastRow !== 'number') {
                throw new TypeError("clipRows() lastRow must be a number.");
            }
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
            if (cmp === 0) {
                return this;
            }
            else if (cmp === -1) {
                var start = { row: row, column: column };
            }
            else {
                var end = { row: row, column: column };
            }
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
            if (this.end.column === 0) {
                return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row - 1), 0);
            }
            else {
                return new Range(this.start.row, 0, this.end.row, 0);
            }
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Range;
});

define('Document',["require", "exports", './applyDelta', './lib/EventEmitterClass', './Range'], function (require, exports, applyDelta_1, EventEmitterClass_1, Range_1) {
    "use strict";
    var $split = (function () {
        function foo(text) {
            return text.replace(/\r\n|\r/g, "\n").split("\n");
        }
        function bar(text) {
            return text.split(/\r\n|\r|\n/);
        }
        if ("aaa".split(/a/).length === 0) {
            return foo;
        }
        else {
            return bar;
        }
    })();
    var CHANGE = 'change';
    var CHANGE_NEW_LINE_MODE = 'changeNewLineMode';
    var Document = (function () {
        function Document(textOrLines) {
            this._lines = [];
            this._autoNewLine = "";
            this._newLineMode = "auto";
            this._lines = [""];
            this._eventBus = new EventEmitterClass_1.default(this);
            if (textOrLines.length === 0) {
                this._lines = [""];
            }
            else if (Array.isArray(textOrLines)) {
                this.insertMergedLines({ row: 0, column: 0 }, textOrLines);
            }
            else {
                this.insert({ row: 0, column: 0 }, textOrLines);
            }
        }
        Document.prototype.setValue = function (text) {
            var row = this.getLength() - 1;
            this.remove(new Range_1.default(0, 0, row, this.getLine(row).length));
            this.insert({ row: 0, column: 0 }, text);
        };
        Document.prototype.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter());
        };
        Document.prototype.$detectNewLine = function (text) {
            var match = text.match(/^.*?(\r\n|\r|\n)/m);
            this._autoNewLine = match ? match[1] : "\n";
            this._eventBus._signal(CHANGE_NEW_LINE_MODE);
        };
        Document.prototype.getNewLineCharacter = function () {
            switch (this._newLineMode) {
                case "windows":
                    return "\r\n";
                case "unix":
                    return "\n";
                default:
                    return this._autoNewLine || "\n";
            }
        };
        Document.prototype.setNewLineMode = function (newLineMode) {
            if (this._newLineMode === newLineMode) {
                return;
            }
            this._newLineMode = newLineMode;
            this._eventBus._signal(CHANGE_NEW_LINE_MODE);
        };
        Document.prototype.getNewLineMode = function () {
            return this._newLineMode;
        };
        Document.prototype.isNewLine = function (text) {
            return (text === "\r\n" || text === "\r" || text === "\n");
        };
        Document.prototype.getLine = function (row) {
            return this._lines[row] || "";
        };
        Document.prototype.getLines = function (firstRow, lastRow) {
            return this._lines.slice(firstRow, lastRow + 1);
        };
        Document.prototype.getAllLines = function () {
            return this.getLines(0, this.getLength());
        };
        Document.prototype.getLength = function () {
            return this._lines.length;
        };
        Document.prototype.getTextRange = function (range) {
            return this.getLinesForRange(range).join(this.getNewLineCharacter());
        };
        Document.prototype.getLinesForRange = function (range) {
            var lines;
            if (range.start.row === range.end.row) {
                lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
            }
            else {
                lines = this.getLines(range.start.row, range.end.row);
                lines[0] = (lines[0] || "").substring(range.start.column);
                var l = lines.length - 1;
                if (range.end.row - range.start.row === l) {
                    lines[l] = lines[l].substring(0, range.end.column);
                }
            }
            return lines;
        };
        Document.prototype.insert = function (position, text) {
            if (this.getLength() <= 1) {
                this.$detectNewLine(text);
            }
            return this.insertMergedLines(position, $split(text));
        };
        ;
        Document.prototype.insertInLine = function (position, text) {
            var start = this.clippedPos(position.row, position.column);
            var end = this.pos(position.row, position.column + text.length);
            this.applyDelta({
                start: start,
                end: end,
                action: "insert",
                lines: [text]
            }, true);
            return this.clonePos(end);
        };
        Document.prototype.clippedPos = function (row, column) {
            var length = this.getLength();
            if (row === void 0) {
                row = length;
            }
            else if (row < 0) {
                row = 0;
            }
            else if (row >= length) {
                row = length - 1;
                column = void 0;
            }
            var line = this.getLine(row);
            if (column === void 0)
                column = line.length;
            column = Math.min(Math.max(column, 0), line.length);
            return { row: row, column: column };
        };
        Document.prototype.clonePos = function (pos) {
            return { row: pos.row, column: pos.column };
        };
        Document.prototype.pos = function (row, column) {
            return { row: row, column: column };
        };
        Document.prototype.addChangeListener = function (callback) {
            this._eventBus.on(CHANGE, callback, false);
        };
        Document.prototype.addChangeNewLineModeListener = function (callback) {
            this._eventBus.on(CHANGE_NEW_LINE_MODE, callback, false);
        };
        Document.prototype.removeChangeListener = function (callback) {
            this._eventBus.off(CHANGE, callback);
        };
        Document.prototype.removeChangeNewLineModeListener = function (callback) {
            this._eventBus.off(CHANGE_NEW_LINE_MODE, callback);
        };
        Document.prototype.insertFullLines = function (row, lines) {
            row = Math.min(Math.max(row, 0), this.getLength());
            var column = 0;
            if (row < this.getLength()) {
                lines = lines.concat([""]);
                column = 0;
            }
            else {
                lines = [""].concat(lines);
                row--;
                column = this._lines[row].length;
            }
            return this.insertMergedLines({ row: row, column: column }, lines);
        };
        Document.prototype.insertMergedLines = function (position, lines) {
            var start = this.clippedPos(position.row, position.column);
            var end = {
                row: start.row + lines.length - 1,
                column: (lines.length === 1 ? start.column : 0) + lines[lines.length - 1].length
            };
            this.applyDelta({
                start: start,
                end: end,
                action: "insert",
                lines: lines
            });
            return this.clonePos(end);
        };
        Document.prototype.remove = function (range) {
            var start = this.clippedPos(range.start.row, range.start.column);
            var end = this.clippedPos(range.end.row, range.end.column);
            this.applyDelta({
                start: start,
                end: end,
                action: "remove",
                lines: this.getLinesForRange({ start: start, end: end })
            });
            return this.clonePos(start);
        };
        Document.prototype.removeInLine = function (row, startColumn, endColumn) {
            var start = this.clippedPos(row, startColumn);
            var end = this.clippedPos(row, endColumn);
            this.applyDelta({
                start: start,
                end: end,
                action: "remove",
                lines: this.getLinesForRange({ start: start, end: end })
            }, true);
            return this.clonePos(start);
        };
        Document.prototype.removeFullLines = function (firstRow, lastRow) {
            firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
            lastRow = Math.min(Math.max(0, lastRow), this.getLength() - 1);
            var deleteFirstNewLine = lastRow === this.getLength() - 1 && firstRow > 0;
            var deleteLastNewLine = lastRow < this.getLength() - 1;
            var startRow = (deleteFirstNewLine ? firstRow - 1 : firstRow);
            var startCol = (deleteFirstNewLine ? this.getLine(startRow).length : 0);
            var endRow = (deleteLastNewLine ? lastRow + 1 : lastRow);
            var endCol = (deleteLastNewLine ? 0 : this.getLine(endRow).length);
            var range = new Range_1.default(startRow, startCol, endRow, endCol);
            var deletedLines = this._lines.slice(firstRow, lastRow + 1);
            this.applyDelta({
                start: range.start,
                end: range.end,
                action: "remove",
                lines: this.getLinesForRange(range)
            });
            return deletedLines;
        };
        ;
        Document.prototype.removeNewLine = function (row) {
            if (row < this.getLength() - 1 && row >= 0) {
                this.applyDelta({
                    start: this.pos(row, this.getLine(row).length),
                    end: this.pos(row + 1, 0),
                    action: "remove",
                    lines: ["", ""]
                });
            }
        };
        Document.prototype.replace = function (range, text) {
            if (text.length === 0 && range.isEmpty()) {
                return range.start;
            }
            if (text === this.getTextRange(range)) {
                return range.end;
            }
            this.remove(range);
            if (text) {
                var end = this.insert(range.start, text);
            }
            else {
                end = range.start;
            }
            return end;
        };
        Document.prototype.applyDeltas = function (deltas) {
            for (var i = 0; i < deltas.length; i++) {
                this.applyDelta(deltas[i]);
            }
        };
        Document.prototype.revertDeltas = function (deltas) {
            for (var i = deltas.length - 1; i >= 0; i--) {
                this.revertDelta(deltas[i]);
            }
        };
        Document.prototype.applyDelta = function (delta, doNotValidate) {
            var isInsert = delta.action === "insert";
            if (isInsert ? delta.lines.length <= 1 && !delta.lines[0]
                : !Range_1.default.comparePoints(delta.start, delta.end)) {
                return;
            }
            if (isInsert && delta.lines.length > 20000)
                this.$splitAndapplyLargeDelta(delta, 20000);
            applyDelta_1.default(this._lines, delta, doNotValidate);
            this._eventBus._signal(CHANGE, delta);
        };
        Document.prototype.$splitAndapplyLargeDelta = function (delta, MAX) {
            var lines = delta.lines;
            var l = lines.length;
            var row = delta.start.row;
            var column = delta.start.column;
            var from = 0, to = 0;
            do {
                from = to;
                to += MAX - 1;
                var chunk = lines.slice(from, to);
                if (to > l) {
                    delta.lines = chunk;
                    delta.start.row = row + from;
                    delta.start.column = column;
                    break;
                }
                chunk.push("");
                this.applyDelta({
                    start: this.pos(row + from, column),
                    end: this.pos(row + to, column = 0),
                    action: delta.action,
                    lines: chunk
                }, true);
            } while (true);
        };
        Document.prototype.revertDelta = function (delta) {
            this.applyDelta({
                start: this.clonePos(delta.start),
                end: this.clonePos(delta.end),
                action: (delta.action === "insert" ? "remove" : "insert"),
                lines: delta.lines.slice()
            });
        };
        ;
        Document.prototype.indexToPosition = function (index, startRow) {
            var lines = this._lines || this.getAllLines();
            var newlineLength = this.getNewLineCharacter().length;
            for (var i = startRow || 0, l = lines.length; i < l; i++) {
                index -= lines[i].length + newlineLength;
                if (index < 0)
                    return { row: i, column: index + lines[i].length + newlineLength };
            }
            return { row: l - 1, column: lines[l - 1].length };
        };
        Document.prototype.positionToIndex = function (pos, startRow) {
            var lines = this._lines || this.getAllLines();
            var newlineLength = this.getNewLineCharacter().length;
            var index = 0;
            var row = Math.min(pos.row, lines.length);
            for (var i = startRow || 0; i < row; ++i)
                index += lines[i].length + newlineLength;
            return index + pos.column;
        };
        return Document;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Document;
});

define('createDocument',["require", "exports", './Document'], function (require, exports, Document_1) {
    function createDocument(textOrLines) {
        return new Document_1.default(textOrLines);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createDocument;
});

define('lib/oop',["require", "exports"], function (require, exports) {
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
        mixin(proto, base);
    }
    exports.implement = implement;
});

define('lib/dom',["require", "exports"], function (require, exports) {
    var XHTML_NS = "http://www.w3.org/1999/xhtml";
    function getDocumentBody(doc) {
        if (doc === void 0) { doc = document; }
        return (doc.body || doc.getElementsByTagName("body")[0]);
    }
    exports.getDocumentBody = getDocumentBody;
    function createHTMLDivElement(namespaceURI) {
        return document.createElementNS ?
            document.createElementNS(namespaceURI || XHTML_NS, 'div') :
            document.createElement('div');
    }
    exports.createHTMLDivElement = createHTMLDivElement;
    function createElement(tagName, namespaceURI) {
        return document.createElementNS ?
            document.createElementNS(namespaceURI || XHTML_NS, tagName) :
            document.createElement(tagName);
    }
    exports.createElement = createElement;
    function hasCssClass(element, name) {
        var classes = element.className.split(/\s+/g);
        return classes.indexOf(name) !== -1;
    }
    exports.hasCssClass = hasCssClass;
    function addCssClass(element, name) {
        if (!hasCssClass(element, name)) {
            element.className += " " + name;
        }
    }
    exports.addCssClass = addCssClass;
    function removeCssClass(element, name) {
        var classes = element.className.split(/\s+/g);
        while (true) {
            var index = classes.indexOf(name);
            if (index === -1) {
                break;
            }
            classes.splice(index, 1);
        }
        element.className = classes.join(" ");
    }
    exports.removeCssClass = removeCssClass;
    function toggleCssClass(element, name) {
        var classes = element.className.split(/\s+/g);
        var add = true;
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
        element.className = classes.join(" ");
        return add;
    }
    exports.toggleCssClass = toggleCssClass;
    function setCssClass(node, className, include) {
        if (include) {
            addCssClass(node, className);
        }
        else {
            removeCssClass(node, className);
        }
    }
    exports.setCssClass = setCssClass;
    function makeComputedStyle() {
        if (window.getComputedStyle) {
            return function (element, style) {
                return (window.getComputedStyle(element, "") || {})[style] || "";
            };
        }
        else {
            return function (element, style) {
                if (style) {
                    return element['currentStyle'][style];
                }
                return element['currentStyle'];
            };
        }
    }
    exports.computedStyle = makeComputedStyle();
    function scrollbarWidth(document) {
        var inner = createElement("ace_inner");
        inner.style.width = "100%";
        inner.style.minWidth = "0px";
        inner.style.height = "200px";
        inner.style.display = "block";
        var outer = createElement("ace_outer");
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
        if (noScrollbar === withScrollbar) {
            withScrollbar = outer.clientWidth;
        }
        body.removeChild(outer);
        return noScrollbar - withScrollbar;
    }
    exports.scrollbarWidth = scrollbarWidth;
    function setInnerHtml(element, innerHTML) {
        var clonedElement = element.cloneNode(false);
        clonedElement.innerHTML = innerHTML;
        element.parentNode.replaceChild(clonedElement, element);
        return clonedElement;
    }
    exports.setInnerHtml = setInnerHtml;
    function makeGetInnerText() {
        if ("textContent" in document.documentElement) {
            return function (el) {
                return el.textContent;
            };
        }
        else {
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
        }
        else {
            return function (el, innerText) {
                el.innerText = innerText;
            };
        }
    }
    exports.getInnerText = makeGetInnerText();
    exports.setInnerText = makeSetInnerText();
    function getParentWindow(document) {
        return document.defaultView;
    }
    exports.getParentWindow = getParentWindow;
});

define('lib/lang/createDelayedCall',["require", "exports"], function (require, exports) {
    function createDelayedCall(fcn, defaultTimeout) {
        var timer = null;
        var callback = function () {
            timer = null;
            fcn();
        };
        var _self = function (timeout) {
            if (timer == null) {
                timer = window.setTimeout(callback, timeout || defaultTimeout);
            }
        };
        _self.delay = function (timeout) {
            if (timer) {
                window.clearTimeout(timer);
            }
            timer = window.setTimeout(callback, timeout || defaultTimeout);
        };
        _self.schedule = _self;
        _self.call = function () {
            this.cancel();
            fcn();
        };
        _self.cancel = function () {
            if (timer) {
                window.clearTimeout(timer);
            }
            timer = null;
        };
        _self.isPending = function () {
            return !!timer;
        };
        return _self;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createDelayedCall;
});

define('lib/lang',["require", "exports"], function (require, exports) {
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
                copy[key] = deepCopy(obj[key]);
            }
            else {
                copy[key] = obj[key];
            }
        }
        return copy;
    }
    exports.deepCopy = deepCopy;
    function arrayToMap(xs, value) {
        var map = {};
        for (var i = 0, iLength = xs.length; i < iLength; i++) {
            map[xs[i]] = value;
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
});

define('lib/useragent',["require", "exports"], function (require, exports) {
    "use strict";
    exports.OS = {
        LINUX: "LINUX",
        MAC: "MAC",
        WINDOWS: "WINDOWS"
    };
    function getOS() {
        if (exports.isMac) {
            return exports.OS.MAC;
        }
        else if (exports.isLinux) {
            return exports.OS.LINUX;
        }
        else {
            return exports.OS.WINDOWS;
        }
    }
    exports.getOS = getOS;
    var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
    var ua = navigator.userAgent;
    exports.isWin = (os == "win");
    exports.isMac = (os == "mac");
    exports.isLinux = (os == "linux");
    exports.isIE = (navigator.appName == "Microsoft Internet Explorer" || navigator.appName.indexOf("MSAppHost") >= 0)
        ? parseFloat((ua.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1])
        : parseFloat((ua.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/) || [])[1]);
    exports.isOldIE = exports.isIE && exports.isIE < 9;
    exports.isGecko = (('Controllers' in window) || ('controllers' in window)) && window.navigator.product === "Gecko";
    exports.isMozilla = exports.isGecko;
    exports.isOldGecko = exports.isGecko && parseInt((ua.match(/rv\:(\d+)/) || [])[1], 10) < 4;
    exports.isOpera = ('opera' in window) && Object.prototype.toString.call(window['opera']) == "[object Opera]";
    exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;
    exports.isChrome = parseFloat(ua.split(" Chrome/")[1]) || undefined;
    exports.isChromeOS = ua.indexOf(" CrOS ") >= 0;
    exports.isAIR = ua.indexOf("AdobeAIR") >= 0;
    exports.isAndroid = ua.indexOf("Android") >= 0;
    exports.isIPad = ua.indexOf("iPad") >= 0;
    exports.isTouchPad = ua.indexOf("TouchPad") >= 0;
    exports.isMobile = exports.isAndroid || exports.isIPad || exports.isTouchPad;
});

define('lib/keys',["require", "exports", './oop'], function (require, exports, oop_1) {
    "use strict";
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
    oop_1.mixin(Keys, Keys.MODIFIER_KEYS);
    oop_1.mixin(Keys, Keys.PRINTABLE_KEYS);
    oop_1.mixin(Keys, Keys.FUNCTION_KEYS);
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
    function keyCodeToString(keyCode) {
        var keyString = Keys[keyCode];
        if (typeof keyString !== "string") {
            keyString = String.fromCharCode(keyCode);
        }
        return keyString.toLowerCase();
    }
    exports.keyCodeToString = keyCodeToString;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Keys;
});

define('keyboard/KeyboardHandler',["require", "exports", "../lib/keys", "../lib/keys", "../lib/useragent"], function (require, exports, keys_1, keys_2, useragent_1) {
    "use strict";
    var KeyboardHandler = (function () {
        function KeyboardHandler(commands, platform) {
            this.platform = platform || (useragent_1.isMac ? "mac" : "win");
            this.commands = {};
            this.commandKeyBinding = {};
            if (commands) {
                this.addCommands(commands);
            }
        }
        KeyboardHandler.prototype.addCommand = function (command) {
            if (this.commands[command.name]) {
                this.removeCommand(command);
            }
            this.commands[command.name] = command;
            if (command.bindKey) {
                this._buildKeyHash(command);
            }
        };
        KeyboardHandler.prototype.removeCommand = function (command) {
            var name = (typeof command === 'string' ? command : command.name);
            command = this.commands[name];
            delete this.commands[name];
            var ckb = this.commandKeyBinding;
            for (var hashId in ckb) {
                if (ckb.hasOwnProperty(hashId)) {
                    for (var key in ckb[hashId]) {
                        if (ckb[hashId][key] === command) {
                            delete ckb[hashId][key];
                        }
                    }
                }
            }
        };
        KeyboardHandler.prototype.bindKey = function (key, action) {
            if (!key) {
                throw new TypeError("key must be a string.");
            }
            this.addCommand({ exec: action, bindKey: key, name: key });
        };
        KeyboardHandler.prototype.bindCommand = function (key, command) {
            var self = this;
            if (!key) {
                return;
            }
            var ckb = this.commandKeyBinding;
            key.split("|").forEach(function (keyPart) {
                var binding = self.parseKeys(keyPart);
                var hashId = binding.hashId;
                (ckb[hashId] || (ckb[hashId] = {}))[binding.key] = command;
            }, self);
        };
        KeyboardHandler.prototype.addCommands = function (commands) {
            for (var i = 0, iLength = commands.length; i < iLength; i++) {
                this.addCommand(commands[i]);
            }
        };
        KeyboardHandler.prototype.removeCommands = function (commands) {
            var _this = this;
            Object.keys(commands).forEach(function (name) {
                _this.removeCommand(commands[name]);
            });
        };
        KeyboardHandler.prototype.bindKeys = function (keyList) {
            var self = this;
            Object.keys(keyList).forEach(function (key) {
                self.bindKey(key, keyList[key]);
            }, self);
        };
        KeyboardHandler.prototype._buildKeyHash = function (command) {
            var binding = command.bindKey;
            if (!binding)
                return;
            var key = typeof binding === "string" ? binding : binding[this.platform];
            this.bindCommand(key, command);
        };
        KeyboardHandler.prototype.parseKeys = function (keys) {
            if (keys.indexOf(" ") !== -1)
                keys = keys.split(/\s+/).pop();
            var parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function (x) { return x; });
            var key = parts.pop();
            var keyCode = keys_2.default[key];
            if (keys_1.FUNCTION_KEYS[keyCode])
                key = keys_1.FUNCTION_KEYS[keyCode].toLowerCase();
            else if (!parts.length)
                return { key: key, hashId: -1 };
            else if (parts.length === 1 && parts[0] === "shift")
                return { key: key.toUpperCase(), hashId: -1 };
            var hashId = 0;
            for (var i = parts.length; i--;) {
                var modifier = keys_1.KEY_MODS[parts[i]];
                if (modifier === null) {
                    throw new Error("invalid modifier " + parts[i] + " in " + keys);
                }
                hashId |= modifier;
            }
            return { key: key, hashId: hashId };
        };
        KeyboardHandler.prototype.findKeyCommand = function (hashId, keyString) {
            var ckbr = this.commandKeyBinding;
            return ckbr[hashId] && ckbr[hashId][keyString];
        };
        KeyboardHandler.prototype.handleKeyboard = function (data, hashId, keyString, keyCode, e) {
            var response = {
                command: this.findKeyCommand(hashId, keyString)
            };
            return response;
        };
        KeyboardHandler.prototype.attach = function (editor) {
        };
        KeyboardHandler.prototype.detach = function (editor) {
        };
        return KeyboardHandler;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KeyboardHandler;
});

define('lib/event',["require", "exports", './keys', './useragent'], function (require, exports, keys_1, useragent_1) {
    function addListener(target, type, callback, useCapture) {
        if (target.addEventListener) {
            return target.addEventListener(type, callback, false);
        }
    }
    exports.addListener = addListener;
    function removeListener(target, type, callback, useCapture) {
        if (target.removeEventListener) {
            return target.removeEventListener(type, callback, false);
        }
    }
    exports.removeListener = removeListener;
    function stopEvent(e) {
        stopPropagation(e);
        preventDefault(e);
        return false;
    }
    exports.stopEvent = stopEvent;
    function stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            e.cancelBubble = true;
        }
    }
    exports.stopPropagation = stopPropagation;
    function preventDefault(e) {
        var RETURN_VALUE_DEPRECATED = 'returnValue';
        if (e.preventDefault) {
            e.preventDefault();
        }
        else if (e[RETURN_VALUE_DEPRECATED]) {
            e[RETURN_VALUE_DEPRECATED] = false;
        }
    }
    exports.preventDefault = preventDefault;
    function getButton(e) {
        if (e.type == "dblclick")
            return 0;
        if (e.type == "contextmenu" || (useragent_1.isMac && (e.ctrlKey && !e.altKey && !e.shiftKey)))
            return 2;
        if (e.preventDefault) {
            return e.button;
        }
        else {
            return { 1: 0, 2: 2, 4: 1 }[e.button];
        }
    }
    exports.getButton = getButton;
    function capture(unused, acquireCaptureHandler, releaseCaptureHandler) {
        var element = document;
        function releaseMouse(e) {
            acquireCaptureHandler && acquireCaptureHandler(e);
            releaseCaptureHandler && releaseCaptureHandler(e);
            removeListener(element, "mousemove", acquireCaptureHandler, true);
            removeListener(element, "mouseup", releaseMouse, true);
            removeListener(element, "dragstart", releaseMouse, true);
        }
        addListener(element, "mousemove", acquireCaptureHandler, true);
        addListener(element, "mouseup", releaseMouse, true);
        addListener(element, "dragstart", releaseMouse, true);
        return releaseMouse;
    }
    exports.capture = capture;
    function addMouseWheelListener(element, callback) {
        if ("onmousewheel" in element) {
            addListener(element, "mousewheel", function (e) {
                var factor = 8;
                if (e['wheelDeltaX'] !== undefined) {
                    e['wheelX'] = -e['wheelDeltaX'] / factor;
                    e['wheelY'] = -e['wheelDeltaY'] / factor;
                }
                else {
                    e['wheelX'] = 0;
                    e['wheelY'] = -e.wheelDelta / factor;
                }
                callback(e);
            });
        }
        else if ("onwheel" in element) {
            addListener(element, "wheel", function (e) {
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
        }
        else {
            addListener(element, "DOMMouseScroll", function (e) {
                if (e.axis && e.axis == e.HORIZONTAL_AXIS) {
                    e.wheelX = (e.detail || 0) * 5;
                    e.wheelY = 0;
                }
                else {
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
        addListener(el, "mousedown", function (e) {
            if (getButton(e) !== 0) {
                clicks = 0;
            }
            else if (e.detail > 1) {
                clicks++;
                if (clicks > 4)
                    clicks = 1;
            }
            else {
                clicks = 1;
            }
            if (useragent_1.isIE) {
                var isNewClick = Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5;
                if (!timer || isNewClick)
                    clicks = 1;
                if (timer)
                    clearTimeout(timer);
                timer = setTimeout(function () { timer = null; }, timeouts[clicks - 1] || 600);
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
        if (useragent_1.isOldIE) {
            addListener(el, "dblclick", function (e) {
                clicks = 2;
                if (timer)
                    clearTimeout(timer);
                timer = setTimeout(function () { timer = null; }, timeouts[clicks - 1] || 600);
                eventHandler[callbackName]("mousedown", e);
                eventHandler[callbackName](eventNames[clicks], e);
            });
        }
    }
    exports.addMultiMouseDownListener = addMultiMouseDownListener;
    var getModifierHash = useragent_1.isMac && useragent_1.isOpera && !("KeyboardEvent" in window)
        ? function (e) {
            return 0 | (e.metaKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.ctrlKey ? 8 : 0);
        }
        : function (e) {
            return 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
        };
    function getModifierString(e) {
        return keys_1.KEY_MODS[getModifierHash(e)];
    }
    exports.getModifierString = getModifierString;
    function normalizeCommandKeys(callback, e, keyCode) {
        var hashId = getModifierHash(e);
        if (!useragent_1.isMac && pressedKeys) {
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
                }
                else if (keyCode === 18 && hashId === 3 && e.location === 2) {
                    var dt = -ts;
                    ts = e.timeStamp;
                    dt += ts;
                    if (dt < 3)
                        pressedKeys.altGr = true;
                }
            }
        }
        if (keyCode in keys_1.MODIFIER_KEYS) {
            switch (keys_1.MODIFIER_KEYS[keyCode]) {
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
        if (useragent_1.isChromeOS && hashId & 8) {
            callback(e, hashId, keyCode);
            if (e.defaultPrevented)
                return;
            else
                hashId &= ~8;
        }
        if (!hashId && !(keyCode in keys_1.FUNCTION_KEYS) && !(keyCode in keys_1.PRINTABLE_KEYS)) {
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
        if (useragent_1.isOldGecko || (useragent_1.isOpera && !("KeyboardEvent" in window))) {
            var lastKeyDownKeyCode = null;
            addListener(el, "keydown", function (e) {
                lastKeyDownKeyCode = e.keyCode;
            });
            addListener(el, "keypress", function (e) {
                return normalizeCommandKeys(callback, e, lastKeyDownKeyCode);
            });
        }
        else {
            var lastDefaultPrevented = null;
            addListener(el, "keydown", function (e) {
                pressedKeys[e.keyCode] = true;
                var result = normalizeCommandKeys(callback, e, e.keyCode);
                lastDefaultPrevented = e.defaultPrevented;
                return result;
            });
            addListener(el, 'keypress', function (e) {
                if (lastDefaultPrevented && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
                    stopEvent(e);
                    lastDefaultPrevented = null;
                }
            });
            addListener(el, 'keyup', function (e) {
                pressedKeys[e.keyCode] = null;
            });
            if (!pressedKeys) {
                pressedKeys = Object.create(null);
                addListener(window, 'focus', resetPressedKeys);
            }
        }
    }
    exports.addCommandKeyListener = addCommandKeyListener;
    var nextFrameCandidate = window.requestAnimationFrame ||
        window['mozRequestAnimationFrame'] ||
        window['webkitRequestAnimationFrame'] ||
        window.msRequestAnimationFrame ||
        window['oRequestAnimationFrame'];
    if (nextFrameCandidate) {
        nextFrameCandidate = nextFrameCandidate.bind(window);
    }
    else {
        nextFrameCandidate = function (callback) {
            setTimeout(callback, 17);
        };
    }
    exports.requestAnimationFrame = nextFrameCandidate;
});

define('editor_protocol',["require", "exports"], function (require, exports) {
    exports.COMMAND_NAME_AUTO_COMPLETE = "autoComplete";
    exports.COMMAND_NAME_INSERT_STRING = "insertstring";
    exports.COMMAND_NAME_BACKSPACE = "backspace";
    exports.COMMAND_NAME_DEL = "del";
});

define('keyboard/KeyBinding',["require", "exports", "../lib/keys", "../lib/event", "../editor_protocol"], function (require, exports, keys_1, event_1, editor_protocol_1) {
    "use strict";
    var KeyBinding = (function () {
        function KeyBinding(editor) {
            this.editor = editor;
            this.$data = { editor: editor };
            this.$handlers = [];
            this.setDefaultHandler(editor.commands.hashHandler);
        }
        KeyBinding.prototype.setDefaultHandler = function (kb) {
            this.removeKeyboardHandler(this.$defaultHandler);
            this.$defaultHandler = kb;
            this.addKeyboardHandler(kb, 0);
        };
        KeyBinding.prototype.setKeyboardHandler = function (kb) {
            var h = this.$handlers;
            if (h[h.length - 1] === kb)
                return;
            while (h[h.length - 1] && h[h.length - 1] !== this.$defaultHandler)
                this.removeKeyboardHandler(h[h.length - 1]);
            this.addKeyboardHandler(kb, 1);
        };
        KeyBinding.prototype.addKeyboardHandler = function (kb, pos) {
            if (!kb) {
                return;
            }
            var i = this.$handlers.indexOf(kb);
            if (i !== -1) {
                this.$handlers.splice(i, 1);
            }
            if (pos === void 0) {
                this.$handlers.push(kb);
            }
            else {
                this.$handlers.splice(pos, 0, kb);
            }
            if (i === -1 && kb.attach) {
                kb.attach(this.editor);
            }
        };
        KeyBinding.prototype.removeKeyboardHandler = function (kb) {
            var i = this.$handlers.indexOf(kb);
            if (i === -1) {
                return false;
            }
            this.$handlers.splice(i, 1);
            if (kb.detach) {
                kb.detach(this.editor);
            }
            return true;
        };
        KeyBinding.prototype.getKeyboardHandler = function () {
            return this.$handlers[this.$handlers.length - 1];
        };
        KeyBinding.prototype.$callKeyboardHandlers = function (hashId, keyString, keyCode, e) {
            var toExecute;
            var success = false;
            var commands = this.editor.commands;
            for (var i = this.$handlers.length; i--;) {
                toExecute = this.$handlers[i].handleKeyboard(this.$data, hashId, keyString, keyCode, e);
                if (!toExecute || !toExecute.command)
                    continue;
                if (toExecute.command === null) {
                    success = true;
                }
                else {
                    success = commands.exec(toExecute.command, this.editor, toExecute.args);
                }
                if (success && e && hashId !== -1 && toExecute.passEvent !== true && toExecute.command.passEvent !== true) {
                    event_1.stopEvent(e);
                }
                if (success)
                    break;
            }
            return success;
        };
        KeyBinding.prototype.onCommandKey = function (e, hashId, keyCode) {
            var keyString = keys_1.keyCodeToString(keyCode);
            this.$callKeyboardHandlers(hashId, keyString, keyCode, e);
        };
        KeyBinding.prototype.onTextInput = function (text) {
            var success = this.$callKeyboardHandlers(-1, text);
            if (!success) {
                var command = this.editor.commands.getCommandByName(editor_protocol_1.COMMAND_NAME_INSERT_STRING);
                this.editor.commands.exec(command, this.editor, text);
            }
        };
        return KeyBinding;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = KeyBinding;
});

define('keyboard/TextInput',["require", "exports", "../lib/event", "../lib/useragent", "../lib/dom", "../lib/lang/createDelayedCall", '../editor_protocol', '../editor_protocol'], function (require, exports, event_1, useragent_1, dom_1, createDelayedCall_1, editor_protocol_1, editor_protocol_2) {
    "use strict";
    var BROKEN_SETDATA = useragent_1.isChrome < 18;
    var USE_IE_MIME_TYPE = useragent_1.isIE;
    var PLACEHOLDER = "\x01\x01";
    var TextInput = (function () {
        function TextInput(container, editor) {
            var _this = this;
            this.editor = editor;
            this.tempStyle = '';
            this.afterContextMenu = false;
            this.inComposition = false;
            this.text = dom_1.createElement("textarea");
            this.text.className = "ace_text-input";
            if (useragent_1.isTouchPad) {
                this.text.setAttribute("x-palm-disable-auto-cap", 'true');
            }
            this.text.wrap = "off";
            this.text['autocorrect'] = "off";
            this.text['autocapitalize'] = "off";
            this.text.spellcheck = false;
            this.text.style.opacity = "0";
            container.insertBefore(this.text, container.firstChild);
            var copied = false;
            this.pasted = false;
            var isSelectionEmpty = true;
            try {
                this._isFocused = document.activeElement === this.text;
            }
            catch (e) { }
            event_1.addListener(this.text, "blur", function () {
                editor.onBlur();
                _this._isFocused = false;
            });
            event_1.addListener(this.text, "focus", function () {
                _this._isFocused = true;
                editor.onFocus();
                _this.resetSelection();
            });
            var syncSelection = createDelayedCall_1.default(function () {
                _this._isFocused && _this.resetSelection(isSelectionEmpty);
            });
            this.syncValue = createDelayedCall_1.default(function () {
                if (!_this.inComposition) {
                    _this.text.value = PLACEHOLDER;
                    _this._isFocused && _this.resetSelection();
                }
            });
            useragent_1.isWebKit || editor.on('changeSelection', function (event, editor) {
                if (editor.selection.isEmpty() !== isSelectionEmpty) {
                    isSelectionEmpty = !isSelectionEmpty;
                    syncSelection.schedule();
                }
            });
            this.resetValue();
            if (this._isFocused) {
                editor.onFocus();
            }
            var isAllSelected = function (text) {
                return text.selectionStart === 0 && text.selectionEnd === text.value.length;
            };
            if (!this.text.setSelectionRange && this.text.createTextRange) {
                this.text.setSelectionRange = function (selectionStart, selectionEnd) {
                    var range = this.createTextRange();
                    range.collapse(true);
                    range.moveStart('character', selectionStart);
                    range.moveEnd('character', selectionEnd);
                    range.select();
                };
                isAllSelected = function (text) {
                    try {
                        var range = text.ownerDocument['selection'].createRange();
                    }
                    catch (e) {
                    }
                    if (!range || range.parentElement() !== text)
                        return false;
                    return range.text === text.value;
                };
            }
            if (useragent_1.isOldIE) {
                var inPropertyChange = false;
                var onPropertyChange = function (e) {
                    if (inPropertyChange)
                        return;
                    var data = _this.text.value;
                    if (_this.inComposition || !data || data === PLACEHOLDER)
                        return;
                    if (e && data === PLACEHOLDER[0])
                        return syncProperty.schedule();
                    _this.sendText(data);
                    inPropertyChange = true;
                    _this.resetValue();
                    inPropertyChange = false;
                };
                var syncProperty = createDelayedCall_1.default(onPropertyChange);
                event_1.addListener(this.text, "propertychange", onPropertyChange);
                var keytable = { 13: 1, 27: 1 };
                event_1.addListener(this.text, "keyup", function (e) {
                    if (_this.inComposition && (!_this.text.value || keytable[e.keyCode]))
                        setTimeout(onCompositionEnd, 0);
                    if ((_this.text.value.charCodeAt(0) || 0) < 129) {
                        return syncProperty.call();
                    }
                    _this.inComposition ? onCompositionUpdate() : onCompositionStart();
                });
                event_1.addListener(this.text, "keydown", function (e) {
                    syncProperty.schedule(50);
                });
            }
            var onSelect = function (e) {
                if (copied) {
                    copied = false;
                }
                else if (isAllSelected(_this.text)) {
                    editor.selectAll();
                    _this.resetSelection();
                }
                else if (_this.inputHandler) {
                    _this.resetSelection(editor.selection.isEmpty());
                }
            };
            var onInput = function (e) {
                if (_this.inComposition) {
                    return;
                }
                var data = _this.text.value;
                _this.sendText(data);
                _this.resetValue();
            };
            var handleClipboardData = function (e, data) {
                var clipboardData = e.clipboardData || window['clipboardData'];
                if (!clipboardData || BROKEN_SETDATA)
                    return;
                var mime = USE_IE_MIME_TYPE ? "Text" : "text/plain";
                if (data) {
                    return clipboardData.setData(mime, data) !== false;
                }
                else {
                    return clipboardData.getData(mime);
                }
            };
            var doCopy = function (e, isCut) {
                var data = editor.getSelectedText();
                if (!data)
                    return event_1.preventDefault(e);
                if (handleClipboardData(e, data)) {
                    isCut ? editor.onCut() : editor.onCopy();
                    event_1.preventDefault(e);
                }
                else {
                    copied = true;
                    _this.text.value = data;
                    _this.text.select();
                    setTimeout(function () {
                        copied = false;
                        _this.resetValue();
                        _this.resetSelection();
                        isCut ? editor.onCut() : editor.onCopy();
                    });
                }
            };
            var onCut = function (e) {
                doCopy(e, true);
            };
            var onCopy = function (e) {
                doCopy(e, false);
            };
            var onPaste = function (e) {
                var data = handleClipboardData(e);
                if (typeof data === "string") {
                    if (data)
                        editor.onPaste(data);
                    if (useragent_1.isIE)
                        setTimeout(function () { _this.resetSelection(); });
                    event_1.preventDefault(e);
                }
                else {
                    _this.text.value = "";
                    _this.pasted = true;
                }
            };
            event_1.addCommandKeyListener(this.text, editor.onCommandKey.bind(editor));
            event_1.addListener(this.text, "select", onSelect);
            event_1.addListener(this.text, "input", onInput);
            event_1.addListener(this.text, "cut", onCut);
            event_1.addListener(this.text, "copy", onCopy);
            event_1.addListener(this.text, "paste", onPaste);
            if (!('oncut' in this.text) || !('oncopy' in this.text) || !('onpaste' in this.text)) {
                event_1.addListener(container, "keydown", function (e) {
                    if ((useragent_1.isMac && !e.metaKey) || !e.ctrlKey)
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
                        default: {
                        }
                    }
                });
            }
            var onCompositionStart = function () {
                if (_this.inComposition || !editor.onCompositionStart || editor.$readOnly)
                    return;
                _this.inComposition = {};
                editor.onCompositionStart();
                setTimeout(onCompositionUpdate, 0);
                editor.on("mousedown", onCompositionEnd);
                if (!editor.selection.isEmpty()) {
                    editor.insert("", false);
                    editor.getSession().markUndoGroup();
                    editor.selection.clearSelection();
                }
                editor.getSession().markUndoGroup();
            };
            var onCompositionUpdate = function () {
                if (!_this.inComposition || !editor.onCompositionUpdate || editor.$readOnly)
                    return;
                var val = _this.text.value.replace(/\x01/g, "");
                if (_this.inComposition.lastValue === val)
                    return;
                editor.onCompositionUpdate(val);
                if (_this.inComposition.lastValue)
                    editor.undo();
                _this.inComposition.lastValue = val;
                if (_this.inComposition.lastValue) {
                    var r = editor.selection.getRange();
                    editor.insert(_this.inComposition.lastValue, false);
                    editor.getSession().markUndoGroup();
                    _this.inComposition.range = editor.selection.getRange();
                    editor.selection.setRange(r);
                    editor.selection.clearSelection();
                }
            };
            var onCompositionEnd = function (e, editor) {
                if (!editor.onCompositionEnd || editor.$readOnly)
                    return;
                var c = _this.inComposition;
                _this.inComposition = false;
                var timer = setTimeout(function () {
                    timer = null;
                    var str = _this.text.value.replace(/\x01/g, "");
                    if (_this.inComposition)
                        return;
                    else if (str === c.lastValue)
                        _this.resetValue();
                    else if (!c.lastValue && str) {
                        _this.resetValue();
                        _this.sendText(str);
                    }
                });
                _this.inputHandler = function compositionInputHandler(str) {
                    if (timer)
                        clearTimeout(timer);
                    str = str.replace(/\x01/g, "");
                    if (str === c.lastValue)
                        return "";
                    if (c.lastValue && timer)
                        editor.undo();
                    return str;
                };
                editor.onCompositionEnd();
                editor.off("mousedown", onCompositionEnd);
                if (e.type === "compositionend" && c.range) {
                    editor.selection.setRange(c.range);
                }
            };
            var syncComposition = createDelayedCall_1.default(onCompositionUpdate, 50);
            event_1.addListener(this.text, "compositionstart", onCompositionStart);
            if (useragent_1.isGecko) {
                event_1.addListener(this.text, "text", function () { syncComposition.schedule(); });
            }
            else {
                event_1.addListener(this.text, "keyup", function () { syncComposition.schedule(); });
                event_1.addListener(this.text, "keydown", function () { syncComposition.schedule(); });
            }
            event_1.addListener(this.text, "compositionend", onCompositionEnd);
            var onContextMenu = function (e) {
                editor.textInput.onContextMenu(e);
                _this.onContextMenuClose();
            };
            event_1.addListener(editor.renderer.scroller, "contextmenu", onContextMenu);
            event_1.addListener(this.text, "contextmenu", onContextMenu);
        }
        TextInput.prototype.getElement = function () {
            return this.text;
        };
        TextInput.prototype.isFocused = function () {
            return this._isFocused;
        };
        TextInput.prototype.moveToMouse = function (e, bringToFront) {
            var _this = this;
            if (!this.tempStyle) {
                this.tempStyle = this.text.style.cssText;
            }
            this.text.style.cssText = (bringToFront ? "z-index:100000;" : "")
                + "height:" + this.text.style.height + ";"
                + (useragent_1.isIE ? "opacity:0.1;" : "");
            var rect = this.editor.container.getBoundingClientRect();
            var style = window.getComputedStyle(this.editor.container);
            var top = rect.top + (parseInt(style.borderTopWidth) || 0);
            var left = rect.left + (parseInt(style.borderLeftWidth) || 0);
            var maxTop = rect.bottom - top - this.text.clientHeight - 2;
            var move = function (e) {
                _this.text.style.left = e.clientX - left - 2 + "px";
                _this.text.style.top = Math.min(e.clientY - top - 2, maxTop) + "px";
            };
            move(e);
            if (e.type !== "mousedown")
                return;
            if (this.editor.renderer.$keepTextAreaAtCursor) {
                this.editor.renderer.$keepTextAreaAtCursor = null;
            }
            if (useragent_1.isWin) {
                event_1.capture(this.editor.container, move, function () { _this.onContextMenuClose(); });
            }
        };
        TextInput.prototype.setReadOnly = function (readOnly) {
            this.text.readOnly = readOnly;
        };
        TextInput.prototype.focus = function () {
            return this.text.focus();
        };
        TextInput.prototype.blur = function () {
            return this.text.blur();
        };
        TextInput.prototype.onContextMenuClose = function () {
            var _this = this;
            setTimeout(function () {
                if (_this.tempStyle) {
                    _this.text.style.cssText = _this.tempStyle;
                    _this.tempStyle = '';
                }
                if (_this.editor.renderer.$keepTextAreaAtCursor == null) {
                    _this.editor.renderer.$keepTextAreaAtCursor = true;
                    _this.editor.renderer.$moveTextAreaToCursor();
                }
            }, 0);
        };
        TextInput.prototype.onContextMenu = function (e) {
            this.afterContextMenu = true;
            this.resetSelection(this.editor.selection.isEmpty());
            this.editor._emit("nativecontextmenu", { target: this.editor, domEvent: e });
            this.moveToMouse(e, true);
        };
        TextInput.prototype.sendText = function (data) {
            if (this.inputHandler) {
                data = this.inputHandler(data);
                this.inputHandler = null;
            }
            if (this.pasted) {
                this.resetSelection();
                if (data) {
                    this.editor.onPaste(data);
                }
                this.pasted = false;
            }
            else if (data === PLACEHOLDER.charAt(0)) {
                if (this.afterContextMenu) {
                    var delCommand = this.editor.commands.getCommandByName(editor_protocol_2.COMMAND_NAME_DEL);
                    this.editor.execCommand(delCommand, { source: "ace" });
                }
                else {
                    var backCommand = this.editor.commands.getCommandByName(editor_protocol_1.COMMAND_NAME_BACKSPACE);
                    this.editor.execCommand(backCommand, { source: "ace" });
                }
            }
            else {
                if (data.substring(0, 2) === PLACEHOLDER)
                    data = data.substr(2);
                else if (data.charAt(0) === PLACEHOLDER.charAt(0))
                    data = data.substr(1);
                else if (data.charAt(data.length - 1) === PLACEHOLDER.charAt(0))
                    data = data.slice(0, -1);
                if (data.charAt(data.length - 1) === PLACEHOLDER.charAt(0))
                    data = data.slice(0, -1);
                if (data) {
                    this.editor.onTextInput(data);
                }
            }
            if (this.afterContextMenu) {
                this.afterContextMenu = false;
            }
        };
        TextInput.prototype.resetSelection = function (isEmpty) {
            if (this.inComposition) {
                return;
            }
            if (this.inputHandler) {
                this.selectionStart = 0;
                this.selectionEnd = isEmpty ? 0 : this.text.value.length - 1;
            }
            else {
                this.selectionStart = isEmpty ? 2 : 1;
                this.selectionEnd = 2;
            }
            try {
                this.text.setSelectionRange(this.selectionStart, this.selectionEnd);
            }
            catch (e) {
            }
        };
        TextInput.prototype.setInputHandler = function (inputHandler) {
            this.inputHandler = inputHandler;
        };
        TextInput.prototype.getInputHandler = function () {
            return this.inputHandler;
        };
        TextInput.prototype.resetValue = function () {
            if (this.inComposition) {
                return;
            }
            this.text.value = PLACEHOLDER;
            if (useragent_1.isWebKit)
                this.syncValue.schedule();
        };
        return TextInput;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextInput;
});

define('Search',["require", "exports", "./lib/lang", "./lib/oop", "./Range"], function (require, exports, lang_1, oop_1, Range_1) {
    "use strict";
    var Search = (function () {
        function Search() {
            this.$options = {};
        }
        Search.prototype.set = function (options) {
            oop_1.mixin(this.$options, options);
            return this;
        };
        Search.prototype.getOptions = function () {
            return lang_1.copyObject(this.$options);
        };
        Search.prototype.setOptions = function (options) {
            this.$options = options;
        };
        Search.prototype.find = function (session) {
            var iterator = this.$matchIterator(session, this.$options);
            if (!iterator) {
                return void 0;
            }
            var firstRange = null;
            iterator.forEach(function (range, row, offset) {
                if (!range.start) {
                    var column = range.offset + (offset || 0);
                    firstRange = new Range_1.default(row, column, row, column + range.length);
                }
                else {
                    firstRange = range;
                }
                return true;
            });
            return firstRange;
        };
        Search.prototype.findAll = function (session) {
            var options = this.$options;
            if (!options.needle) {
                return [];
            }
            this.$assembleRegExp(options);
            var range = options.range;
            var lines = range
                ? session.getLines(range.start.row, range.end.row)
                : session.doc.getAllLines();
            var ranges = [];
            if (options.$isMultiLine) {
                var re = options.re;
                var len = re.length;
                var maxRow = lines.length - len;
                var prevRange;
                outer: for (var row = re['offset'] || 0; row <= maxRow; row++) {
                    for (var j = 0; j < len; j++)
                        if (lines[row + j].search(re[j]) == -1)
                            continue outer;
                    var startLine = lines[row];
                    var line = lines[row + len - 1];
                    var startIndex = startLine.length - startLine.match(re[0])[0].length;
                    var endIndex = line.match(re[len - 1])[0].length;
                    if (prevRange && prevRange.end.row === row && prevRange.end.column > startIndex) {
                        continue;
                    }
                    ranges.push(prevRange = new Range_1.default(row, startIndex, row + len - 1, endIndex));
                    if (len > 2)
                        row = row + len - 2;
                }
            }
            else {
                var re = options.re;
                for (var i = 0; i < lines.length; i++) {
                    var matches = lang_1.getMatchOffsets(lines[i], re);
                    for (var j = 0; j < matches.length; j++) {
                        var match = matches[j];
                        ranges.push(new Range_1.default(i, match.offset, i, match.offset + match.length));
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
        Search.prototype.replace = function (input, replacement) {
            var options = this.$options;
            var re = this.$assembleRegExp(options);
            if (options.$isMultiLine) {
                return replacement;
            }
            if (!re) {
                return;
            }
            var match = re.exec(input);
            if (!match || match[0].length !== input.length) {
                return null;
            }
            replacement = input.replace(re, replacement);
            if (options.preserveCase) {
                var parts = replacement.split("");
                for (var i = Math.min(input.length, input.length); i--;) {
                    var ch = input[i];
                    if (ch && ch.toLowerCase() != ch)
                        parts[i] = parts[i].toUpperCase();
                    else
                        parts[i] = parts[i].toLowerCase();
                }
                replacement = parts.join("");
            }
            return replacement;
        };
        Search.prototype.$matchIterator = function (session, options) {
            var re = this.$assembleRegExp(options);
            if (!re) {
                return false;
            }
            var self = this, callback, backwards = options.backwards;
            if (options.$isMultiLine) {
                var len = re.length;
                var matchIterator = function (line, row, offset) {
                    var startIndex = line.search(re[0]);
                    if (startIndex == -1)
                        return;
                    for (var i = 1; i < len; i++) {
                        line = session.getLine(row + i);
                        if (line.search(re[i]) == -1)
                            return;
                    }
                    var endIndex = line.match(re[len - 1])[0].length;
                    var range = new Range_1.default(row, startIndex, row + len - 1, endIndex);
                    if (re['offset'] == 1) {
                        range.start.row--;
                        range.start.column = Number.MAX_VALUE;
                    }
                    else if (offset)
                        range.start.column += offset;
                    if (callback(range))
                        return true;
                };
            }
            else if (backwards) {
                var matchIterator = function (line, row, startIndex) {
                    var matches = lang_1.getMatchOffsets(line, re);
                    for (var i = matches.length - 1; i >= 0; i--)
                        if (callback(matches[i], row, startIndex))
                            return true;
                };
            }
            else {
                var matchIterator = function (line, row, startIndex) {
                    var matches = lang_1.getMatchOffsets(line, re);
                    for (var i = 0; i < matches.length; i++)
                        if (callback(matches[i], row, startIndex))
                            return true;
                };
            }
            return {
                forEach: function (_callback) {
                    callback = _callback;
                    self.$lineIterator(session, options).forEach(matchIterator);
                }
            };
        };
        Search.prototype.$assembleRegExp = function (options, $disableFakeMultiline) {
            if (!options.needle) {
                options.re = false;
            }
            else if (options.needle instanceof RegExp) {
                options.re = options.needle;
            }
            else if (typeof options.needle === 'string') {
                var needleString = options.needle;
                if (!options.regExp) {
                    needleString = lang_1.escapeRegExp(needleString);
                }
                if (options.wholeWord) {
                    needleString = "\\b" + needleString + "\\b";
                }
                var modifier = options.caseSensitive ? "g" : "gi";
                options.$isMultiLine = !$disableFakeMultiline && /[\n\r]/.test(needleString);
                if (options.$isMultiLine)
                    return options.re = this.$assembleMultilineRegExp(needleString, modifier);
                try {
                    options.re = new RegExp(needleString, modifier);
                }
                catch (e) {
                    options.re = false;
                }
            }
            else {
                throw new Error("typeof options.needle => " + typeof options.needle);
            }
            return options.re;
        };
        Search.prototype.$assembleMultilineRegExp = function (needle, modifier) {
            var parts = needle.replace(/\r\n|\r|\n/g, "$\n^").split("\n");
            var re = [];
            for (var i = 0; i < parts.length; i++) {
                try {
                    re.push(new RegExp(parts[i], modifier));
                }
                catch (e) {
                    return void 0;
                }
            }
            if (parts[0] === "") {
                re.shift();
                re['offset'] = 1;
            }
            else {
                re['offset'] = 0;
            }
            return re;
        };
        Search.prototype.$lineIterator = function (session, options) {
            var backwards = options.backwards == true;
            var skipCurrent = options.skipCurrent != false;
            var range = options.range;
            var start = options.start;
            if (!start) {
                if (range) {
                    start = backwards ? range.end : range.start;
                }
                else {
                    var x = session.getSelection().getRange();
                    start = (skipCurrent !== backwards) ? x.end : x.start;
                }
            }
            var firstRow = range ? range.start.row : 0;
            var lastRow = range ? range.end.row : session.getLength() - 1;
            var forEach = backwards ? function (callback) {
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
            } : function (callback) {
                var row = start.row;
                var line = session.getLine(row).substr(start.column);
                if (callback(line, row, start.column))
                    return;
                for (row = row + 1; row <= lastRow; row++)
                    if (callback(session.getLine(row), row))
                        return;
                if (options.wrap == false)
                    return;
                for (row = firstRow, lastRow = start.row; row <= lastRow; row++)
                    if (callback(session.getLine(row), row))
                        return;
            };
            return { forEach: forEach };
        };
        return Search;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Search;
});

define('lib/mix',["require", "exports"], function (require, exports) {
    function applyMixins(derivedCtor, baseCtors) {
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
    exports.applyMixins = applyMixins;
});

define('commands/CommandManager',["require", "exports", "../lib/mix", "../keyboard/KeyboardHandler", "../lib/EventEmitterClass"], function (require, exports, mix_1, KeyboardHandler_1, EventEmitterClass_1) {
    "use strict";
    var CommandManager = (function () {
        function CommandManager(platform, commands) {
            this.eventBus = new EventEmitterClass_1.default(this);
            this.hashHandler = new KeyboardHandler_1.default(commands, platform);
            this.eventBus.setDefaultHandler("exec", function (e) {
                return e.command.exec(e.editor, e.args || {});
            });
        }
        CommandManager.prototype.setDefaultHandler = function (eventName, callback) {
            this.eventBus.setDefaultHandler(eventName, callback);
        };
        CommandManager.prototype.removeDefaultHandler = function (eventName, callback) {
            this.eventBus.removeDefaultHandler(eventName, callback);
        };
        Object.defineProperty(CommandManager.prototype, "platform", {
            get: function () {
                return this.hashHandler.platform;
            },
            enumerable: true,
            configurable: true
        });
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
        CommandManager.prototype.getCommandByName = function (name) {
            return this.hashHandler.commands[name];
        };
        CommandManager.prototype.exec = function (command, editor, args) {
            if (typeof command === 'string') {
                throw new TypeError("command must not be a string.");
            }
            if (!command) {
                return false;
            }
            if (editor && editor.$readOnly && !command.readOnly) {
                return false;
            }
            var e = { editor: editor, command: command, args: args };
            var retvalue = this.eventBus._emit("exec", e);
            this.eventBus._signal("afterExec", e);
            return retvalue === false ? false : true;
        };
        CommandManager.prototype.toggleRecording = function (editor) {
            if (this.$inReplay)
                return;
            editor && editor._emit("changeStatus");
            if (this.recording) {
                this.macro.pop();
                this.eventBus.off("exec", this.$addCommandToMacro);
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
            this.eventBus.on("exec", this.$addCommandToMacro);
            return this.recording = true;
        };
        CommandManager.prototype.replay = function (editor) {
            if (this.$inReplay || !this.macro)
                return;
            if (this.recording)
                return this.toggleRecording(editor);
            try {
                this.$inReplay = true;
                this.macro.forEach(function (x) {
                    if (typeof x == "string")
                        this.exec(x, editor);
                    else
                        this.exec(x[0], editor, x[1]);
                }, this);
            }
            finally {
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
        CommandManager.prototype.on = function (eventName, callback, capturing) {
            this.eventBus.on(eventName, callback, capturing);
        };
        CommandManager.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        return CommandManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CommandManager;
    mix_1.applyMixins(CommandManager, [KeyboardHandler_1.default]);
});

define('dom/getDocumentHead',["require", "exports"], function (require, exports) {
    function getDocumentHead(doc) {
        return (doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getDocumentHead;
});

define('lib/net',["require", "exports", '../dom/getDocumentHead'], function (require, exports, getDocumentHead_1) {
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
    function loadScript(src, callback, doc) {
        var head = getDocumentHead_1.default(doc);
        var s = doc.createElement('script');
        s.src = src;
        head.appendChild(s);
        s.onload = s['onreadystatechange'] = function (_, isAbort) {
            if (isAbort || !s['readyState'] || s['readyState'] === "loaded" || s['readyState'] === "complete") {
                s = s.onload = s['onreadystatechange'] = null;
                if (!isAbort) {
                    callback();
                }
            }
        };
    }
    exports.loadScript = loadScript;
    function qualifyURL(url) {
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    }
    exports.qualifyURL = qualifyURL;
});

define('config',["require", "exports", "./lib/lang", "./lib/oop", "./lib/net"], function (require, exports, lang_1, oop_1, net_1) {
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
        if (!options.hasOwnProperty(key)) {
            throw new Error("Unknown config key: " + key);
        }
        return options[key];
    }
    exports.get = get;
    function set(key, value) {
        if (!options.hasOwnProperty(key)) {
            throw new Error("Unknown config key: " + key);
        }
        options[key] = value;
    }
    exports.set = set;
    function all() {
        return lang_1.copyObject(options);
    }
    exports.all = all;
    function moduleUrl(moduleName, component) {
        if (options.$moduleUrls[moduleName]) {
            return options.$moduleUrls[moduleName];
        }
        var parts = moduleName.split("/");
        component = component || parts[parts.length - 2] || "";
        var sep = component === "snippets" ? "/" : "-";
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
        }
        else if (sep == "/") {
            component = sep = "";
        }
        if (path && path.slice(-1) != "/") {
            path += "/";
        }
        return path + component + sep + base + get("suffix");
    }
    exports.moduleUrl = moduleUrl;
    function setModuleUrl(name, subst) {
        return options.$moduleUrls[name] = subst;
    }
    exports.setModuleUrl = setModuleUrl;
    exports.$loading = {};
    function loadModule(what, onLoad, doc) {
        if (doc === void 0) { doc = document; }
        var module;
        var moduleName;
        var moduleType;
        if (Array.isArray(what)) {
            moduleType = what[0];
            moduleName = what[1];
        }
        else {
            moduleName = what;
        }
        try {
        }
        catch (e) { }
        if (module && !exports.$loading[moduleName])
            return onLoad && onLoad(module);
        if (!exports.$loading[moduleName]) {
            exports.$loading[moduleName] = [];
        }
        exports.$loading[moduleName].push(onLoad);
        if (exports.$loading[moduleName].length > 1)
            return;
        var afterLoad = function () {
        };
        if (!get("packaged")) {
            return afterLoad();
        }
        net_1.loadScript(moduleUrl(moduleName, moduleType), afterLoad, doc);
    }
    exports.loadModule = loadModule;
    function init(packaged) {
        options.packaged = packaged || module.packaged;
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
            if (m) {
                scriptUrl = m[1];
            }
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
                set(key, scriptOptions[key]);
    }
    exports.init = init;
    ;
    function deHyphenate(str) {
        return str.replace(/-(.)/g, function (m, m1) { return m1.toUpperCase(); });
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
            }
            else if (!Array.isArray(optionNames)) {
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
        if (!obj.$options) {
            defaultOptions[path] = obj.$options = {};
        }
        Object.keys(options).forEach(function (key) {
            var opt = options[key];
            if (typeof opt === "string") {
                opt = { forwardTo: opt };
            }
            opt.name || (opt.name = key);
            obj.$options[opt.name] = opt;
            if ("initialValue" in opt) {
                obj["$" + opt.name] = opt.initialValue;
            }
        });
        oop_1.implement(obj, optionsProvider);
        return this;
    }
    exports.defineOptions = defineOptions;
    function resetOptions(obj) {
        Object.keys(obj.$options).forEach(function (key) {
            var opt = obj.$options[key];
            if ("value" in opt) {
                obj.setOption(key, opt.value);
            }
        });
    }
    exports.resetOptions = resetOptions;
    function setDefaultValue(path, name, value) {
        var opts = defaultOptions[path] || (defaultOptions[path] = {});
        if (opts[name]) {
            if (opts.forwardTo)
                setDefaultValue(opts.forwardTo, name, value);
            else
                opts[name].value = value;
        }
    }
    exports.setDefaultValue = setDefaultValue;
    function setDefaultValues(path, optionHash) {
        Object.keys(optionHash).forEach(function (key) {
            setDefaultValue(path, key, optionHash[key]);
        });
    }
    exports.setDefaultValues = setDefaultValues;
});

define('commands/default_commands',["require", "exports", "../lib/lang", "../config", "../Range", '../editor_protocol', '../editor_protocol', "../editor_protocol"], function (require, exports, lang_1, config_1, Range_1, editor_protocol_1, editor_protocol_2, editor_protocol_3) {
    "use strict";
    function bindKey(win, mac) {
        return { win: win, mac: mac };
    }
    var commands = [{
            name: "showSettingsMenu",
            bindKey: bindKey("Ctrl-,", "Command-,"),
            exec: function (editor) {
                config_1.loadModule("ace/ext/settings_menu", function (module) {
                    module.init(editor);
                });
            },
            readOnly: true
        }, {
            name: "goToNextError",
            bindKey: bindKey("Alt-E", "Ctrl-E"),
            exec: function (editor) {
                config_1.loadModule("ace/ext/error_marker", function (module) {
                    module.showErrorMarker(editor, 1);
                });
            },
            scrollIntoView: "animate",
            readOnly: true
        }, {
            name: "goToPreviousError",
            bindKey: bindKey("Alt-Shift-E", "Ctrl-Shift-E"),
            exec: function (editor) {
                config_1.loadModule("ace/ext/error_marker", function (module) {
                    module.showErrorMarker(editor, -1);
                });
            },
            scrollIntoView: "animate",
            readOnly: true
        }, {
            name: "selectall",
            bindKey: bindKey("Ctrl-A", "Command-A"),
            exec: function (editor) { editor.selectAll(); },
            readOnly: true
        }, {
            name: "centerselection",
            bindKey: bindKey(null, "Ctrl-L"),
            exec: function (editor) { editor.centerSelection(); },
            readOnly: true
        }, {
            name: "gotoline",
            bindKey: bindKey("Ctrl-L", "Command-L"),
            exec: function (editor) {
                var line = parseInt(prompt("Enter line number:"), 10);
                if (!isNaN(line)) {
                    editor.gotoLine(line);
                }
            },
            readOnly: true
        }, {
            name: "fold",
            bindKey: bindKey("Alt-L|Ctrl-F1", "Command-Alt-L|Command-F1"),
            exec: function (editor) { editor.getSession().toggleFold(false); },
            scrollIntoView: "center",
            readOnly: true
        }, {
            name: "unfold",
            bindKey: bindKey("Alt-Shift-L|Ctrl-Shift-F1", "Command-Alt-Shift-L|Command-Shift-F1"),
            exec: function (editor) { editor.getSession().toggleFold(true); },
            scrollIntoView: "center",
            readOnly: true
        }, {
            name: "toggleFoldWidget",
            bindKey: bindKey("F2", "F2"),
            exec: function (editor) { editor.getSession().toggleFoldWidget(); },
            scrollIntoView: "center",
            readOnly: true
        }, {
            name: "toggleParentFoldWidget",
            bindKey: bindKey("Alt-F2", "Alt-F2"),
            exec: function (editor) { editor.getSession().toggleFoldWidget(true); },
            scrollIntoView: "center",
            readOnly: true
        }, {
            name: "foldall",
            bindKey: bindKey("Ctrl-Alt-0", "Ctrl-Command-Option-0"),
            exec: function (editor) { editor.getSession().foldAll(); },
            scrollIntoView: "center",
            readOnly: true
        }, {
            name: "foldOther",
            bindKey: bindKey("Alt-0", "Command-Option-0"),
            exec: function (editor) {
                editor.getSession().foldAll();
            },
            scrollIntoView: "center",
            readOnly: true
        }, {
            name: "unfoldall",
            bindKey: bindKey("Alt-Shift-0", "Command-Option-Shift-0"),
            exec: function (editor) { editor.getSession().unfold(); },
            scrollIntoView: "center",
            readOnly: true
        }, {
            name: "findnext",
            bindKey: bindKey("Ctrl-K", "Command-G"),
            exec: function (editor) { editor.findNext(); },
            multiSelectAction: "forEach",
            scrollIntoView: "center",
            readOnly: true
        }, {
            name: "findprevious",
            bindKey: bindKey("Ctrl-Shift-K", "Command-Shift-G"),
            exec: function (editor) { editor.findPrevious(); },
            multiSelectAction: "forEach",
            scrollIntoView: "center",
            readOnly: true
        }, {
            name: "selectOrFindNext",
            bindKey: bindKey("Alt-K", "Ctrl-G"),
            exec: function (editor) {
                if (editor.selection.isEmpty()) {
                    editor.selection.selectWord();
                }
                else {
                    editor.findNext();
                }
            },
            readOnly: true
        }, {
            name: "selectOrFindPrevious",
            bindKey: bindKey("Alt-Shift-K", "Ctrl-Shift-G"),
            exec: function (editor) {
                if (editor.selection.isEmpty()) {
                    editor.selection.selectWord();
                }
                else {
                    editor.findPrevious();
                }
            },
            readOnly: true
        }, {
            name: "find",
            bindKey: bindKey("Ctrl-F", "Command-F"),
            exec: function (editor) {
                config_1.loadModule("ace/ext/searchbox", function (e) { e.Search(editor); });
            },
            readOnly: true
        }, {
            name: "overwrite",
            bindKey: bindKey("Insert", "Insert"),
            exec: function (editor) { editor.toggleOverwrite(); },
            readOnly: true
        }, {
            name: "selecttostart",
            bindKey: bindKey("Ctrl-Shift-Home", "Command-Shift-Up"),
            exec: function (editor) { editor.getSelection().selectFileStart(); },
            multiSelectAction: "forEach",
            readOnly: true,
            scrollIntoView: "animate",
            aceCommandGroup: "fileJump"
        }, {
            name: "gotostart",
            bindKey: bindKey("Ctrl-Home", "Command-Home|Command-Up"),
            exec: function (editor) { editor.navigateFileStart(); },
            multiSelectAction: "forEach",
            readOnly: true,
            scrollIntoView: "animate",
            aceCommandGroup: "fileJump"
        }, {
            name: "selectup",
            bindKey: bindKey("Shift-Up", "Shift-Up"),
            exec: function (editor) { editor.getSelection().selectUp(); },
            multiSelectAction: "forEach",
            readOnly: true
        }, {
            name: "golineup",
            bindKey: bindKey("Up", "Up|Ctrl-P"),
            exec: function (editor, args) { editor.navigateUp(args.times); },
            multiSelectAction: "forEach",
            readOnly: true
        }, {
            name: "selecttoend",
            bindKey: bindKey("Ctrl-Shift-End", "Command-Shift-Down"),
            exec: function (editor) { editor.getSelection().selectFileEnd(); },
            multiSelectAction: "forEach",
            readOnly: true,
            scrollIntoView: "animate",
            aceCommandGroup: "fileJump"
        }, {
            name: "gotoend",
            bindKey: bindKey("Ctrl-End", "Command-End|Command-Down"),
            exec: function (editor) { editor.navigateFileEnd(); },
            multiSelectAction: "forEach",
            readOnly: true,
            scrollIntoView: "animate",
            aceCommandGroup: "fileJump"
        }, {
            name: "selectdown",
            bindKey: bindKey("Shift-Down", "Shift-Down"),
            exec: function (editor) { editor.getSelection().selectDown(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "golinedown",
            bindKey: bindKey("Down", "Down|Ctrl-N"),
            exec: function (editor, args) { editor.navigateDown(args.times); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "selectwordleft",
            bindKey: bindKey("Ctrl-Shift-Left", "Option-Shift-Left"),
            exec: function (editor) { editor.getSelection().selectWordLeft(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "gotowordleft",
            bindKey: bindKey("Ctrl-Left", "Option-Left"),
            exec: function (editor) { editor.navigateWordLeft(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "selecttolinestart",
            bindKey: bindKey("Alt-Shift-Left", "Command-Shift-Left"),
            exec: function (editor) { editor.getSelection().selectLineStart(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "gotolinestart",
            bindKey: bindKey("Alt-Left|Home", "Command-Left|Home|Ctrl-A"),
            exec: function (editor) { editor.navigateLineStart(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "selectleft",
            bindKey: bindKey("Shift-Left", "Shift-Left"),
            exec: function (editor) { editor.getSelection().selectLeft(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "gotoleft",
            bindKey: bindKey("Left", "Left|Ctrl-B"),
            exec: function (editor, args) { editor.navigateLeft(args.times); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "selectwordright",
            bindKey: bindKey("Ctrl-Shift-Right", "Option-Shift-Right"),
            exec: function (editor) { editor.getSelection().selectWordRight(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "gotowordright",
            bindKey: bindKey("Ctrl-Right", "Option-Right"),
            exec: function (editor) { editor.navigateWordRight(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "selecttolineend",
            bindKey: bindKey("Alt-Shift-Right", "Command-Shift-Right"),
            exec: function (editor) { editor.getSelection().selectLineEnd(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "gotolineend",
            bindKey: bindKey("Alt-Right|End", "Command-Right|End|Ctrl-E"),
            exec: function (editor) { editor.navigateLineEnd(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "selectright",
            bindKey: bindKey("Shift-Right", "Shift-Right"),
            exec: function (editor) { editor.getSelection().selectRight(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "gotoright",
            bindKey: bindKey("Right", "Right|Ctrl-F"),
            exec: function (editor, args) { editor.navigateRight(args.times); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "selectpagedown",
            bindKey: "Shift-PageDown",
            exec: function (editor) { editor.selectPageDown(); },
            readOnly: true
        }, {
            name: "pagedown",
            bindKey: bindKey(null, "Option-PageDown"),
            exec: function (editor) { editor.scrollPageDown(); },
            readOnly: true
        }, {
            name: "gotopagedown",
            bindKey: bindKey("PageDown", "PageDown|Ctrl-V"),
            exec: function (editor) { editor.gotoPageDown(); },
            readOnly: true
        }, {
            name: "selectpageup",
            bindKey: "Shift-PageUp",
            exec: function (editor) { editor.selectPageUp(); },
            readOnly: true
        }, {
            name: "pageup",
            bindKey: bindKey(null, "Option-PageUp"),
            exec: function (editor) { editor.scrollPageUp(); },
            readOnly: true
        }, {
            name: "gotopageup",
            bindKey: "PageUp",
            exec: function (editor) { editor.gotoPageUp(); },
            readOnly: true
        }, {
            name: "scrollup",
            bindKey: bindKey("Ctrl-Up", null),
            exec: function (e) { e.renderer.scrollBy(0, -2 * e.renderer.layerConfig.lineHeight); },
            readOnly: true
        }, {
            name: "scrolldown",
            bindKey: bindKey("Ctrl-Down", null),
            exec: function (e) { e.renderer.scrollBy(0, 2 * e.renderer.layerConfig.lineHeight); },
            readOnly: true
        }, {
            name: "selectlinestart",
            bindKey: "Shift-Home",
            exec: function (editor) { editor.getSelection().selectLineStart(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "selectlineend",
            bindKey: "Shift-End",
            exec: function (editor) { editor.getSelection().selectLineEnd(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor",
            readOnly: true
        }, {
            name: "togglerecording",
            bindKey: bindKey("Ctrl-Alt-E", "Command-Option-E"),
            exec: function (editor) { editor.commands.toggleRecording(editor); },
            readOnly: true
        }, {
            name: "replaymacro",
            bindKey: bindKey("Ctrl-Shift-E", "Command-Shift-E"),
            exec: function (editor) { editor.commands.replay(editor); },
            readOnly: true
        }, {
            name: "jumptomatching",
            bindKey: bindKey("Ctrl-P", "Ctrl-P"),
            exec: function (editor) { editor.jumpToMatching(); },
            multiSelectAction: "forEach",
            readOnly: true
        }, {
            name: "selecttomatching",
            bindKey: bindKey("Ctrl-Shift-P", "Ctrl-Shift-P"),
            exec: function (editor) { editor.jumpToMatching(true); },
            multiSelectAction: "forEach",
            readOnly: true
        }, {
            name: "passKeysToBrowser",
            bindKey: bindKey("null", "null"),
            exec: function () { },
            passEvent: true,
            readOnly: true
        },
        {
            name: "cut",
            exec: function (editor) {
                var range = editor.getSelectionRange();
                editor._emit("cut", range);
                if (!editor.selection.isEmpty()) {
                    editor.getSession().remove(range);
                    editor.clearSelection();
                }
            },
            scrollIntoView: "cursor",
            multiSelectAction: "forEach"
        }, {
            name: "removeline",
            bindKey: bindKey("Ctrl-D", "Command-D"),
            exec: function (editor) { editor.removeLines(); },
            scrollIntoView: "cursor",
            multiSelectAction: "forEachLine"
        }, {
            name: "duplicateSelection",
            bindKey: bindKey("Ctrl-Shift-D", "Command-Shift-D"),
            exec: function (editor) { editor.duplicateSelection(); },
            scrollIntoView: "cursor",
            multiSelectAction: "forEach"
        }, {
            name: "sortlines",
            bindKey: bindKey("Ctrl-Alt-S", "Command-Alt-S"),
            exec: function (editor) { editor.sortLines(); },
            scrollIntoView: "selection",
            multiSelectAction: "forEachLine"
        }, {
            name: "togglecomment",
            bindKey: bindKey("Ctrl-/", "Command-/"),
            exec: function (editor) { editor.toggleCommentLines(); },
            multiSelectAction: "forEachLine",
            scrollIntoView: "selectionPart"
        }, {
            name: "toggleBlockComment",
            bindKey: bindKey("Ctrl-Shift-/", "Command-Shift-/"),
            exec: function (editor) { editor.toggleBlockComment(); },
            multiSelectAction: "forEach",
            scrollIntoView: "selectionPart"
        }, {
            name: "modifyNumberUp",
            bindKey: bindKey("Ctrl-Shift-Up", "Alt-Shift-Up"),
            exec: function (editor) { editor.modifyNumber(1); },
            multiSelectAction: "forEach"
        }, {
            name: "modifyNumberDown",
            bindKey: bindKey("Ctrl-Shift-Down", "Alt-Shift-Down"),
            exec: function (editor) { editor.modifyNumber(-1); },
            multiSelectAction: "forEach"
        }, {
            name: "replace",
            bindKey: bindKey("Ctrl-H", "Command-Option-F"),
            exec: function (editor) {
                config_1.loadModule("ace/ext/searchbox", function (e) { e.Search(editor, true); });
            }
        }, {
            name: "undo",
            bindKey: bindKey("Ctrl-Z", "Command-Z"),
            exec: function (editor) { editor.undo(); }
        }, {
            name: "redo",
            bindKey: bindKey("Ctrl-Shift-Z|Ctrl-Y", "Command-Shift-Z|Command-Y"),
            exec: function (editor) { editor.redo(); }
        }, {
            name: "copylinesup",
            bindKey: bindKey("Alt-Shift-Up", "Command-Option-Up"),
            exec: function (editor) { editor.copyLinesUp(); },
            scrollIntoView: "cursor"
        }, {
            name: "movelinesup",
            bindKey: bindKey("Alt-Up", "Option-Up"),
            exec: function (editor) { editor.moveLinesUp(); },
            scrollIntoView: "cursor"
        }, {
            name: "copylinesdown",
            bindKey: bindKey("Alt-Shift-Down", "Command-Option-Down"),
            exec: function (editor) { editor.copyLinesDown(); },
            scrollIntoView: "cursor"
        }, {
            name: "movelinesdown",
            bindKey: bindKey("Alt-Down", "Option-Down"),
            exec: function (editor) { editor.moveLinesDown(); },
            scrollIntoView: "cursor"
        }, {
            name: editor_protocol_2.COMMAND_NAME_DEL,
            bindKey: bindKey("Delete", "Delete|Ctrl-D|Shift-Delete"),
            exec: function (editor) { editor.remove("right"); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: editor_protocol_1.COMMAND_NAME_BACKSPACE,
            bindKey: bindKey("Shift-Backspace|Backspace", "Ctrl-Backspace|Shift-Backspace|Backspace|Ctrl-H"),
            exec: function (editor) { editor.remove("left"); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "cut_or_delete",
            bindKey: bindKey("Shift-Delete", null),
            exec: function (editor) {
                if (editor.selection.isEmpty()) {
                    editor.remove("left");
                }
                else {
                    return false;
                }
            },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "removetolinestart",
            bindKey: bindKey("Alt-Backspace", "Command-Backspace"),
            exec: function (editor) { editor.removeToLineStart(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "removetolineend",
            bindKey: bindKey("Alt-Delete", "Ctrl-K"),
            exec: function (editor) { editor.removeToLineEnd(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "removewordleft",
            bindKey: bindKey("Ctrl-Backspace", "Alt-Backspace|Ctrl-Alt-Backspace"),
            exec: function (editor) { editor.removeWordLeft(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "removewordright",
            bindKey: bindKey("Ctrl-Delete", "Alt-Delete"),
            exec: function (editor) { editor.removeWordRight(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "outdent",
            bindKey: bindKey("Shift-Tab", "Shift-Tab"),
            exec: function (editor) { editor.blockOutdent(); },
            multiSelectAction: "forEach",
            scrollIntoView: "selectionPart"
        }, {
            name: "indent",
            bindKey: bindKey("Tab", "Tab"),
            exec: function (editor) { editor.indent(); },
            multiSelectAction: "forEach",
            scrollIntoView: "selectionPart"
        }, {
            name: "blockoutdent",
            bindKey: bindKey("Ctrl-[", "Ctrl-["),
            exec: function (editor) { editor.blockOutdent(); },
            multiSelectAction: "forEachLine",
            scrollIntoView: "selectionPart"
        }, {
            name: "blockindent",
            bindKey: bindKey("Ctrl-]", "Ctrl-]"),
            exec: function (editor) { editor.blockIndent(); },
            multiSelectAction: "forEachLine",
            scrollIntoView: "selectionPart"
        }, {
            name: editor_protocol_3.COMMAND_NAME_INSERT_STRING,
            exec: function (editor, str) { editor.insert(str); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "inserttext",
            exec: function (editor, args) {
                editor.insert(lang_1.stringRepeat(args.text || "", args.times || 1));
            },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "splitline",
            bindKey: bindKey(null, "Ctrl-O"),
            exec: function (editor) { editor.splitLine(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "transposeletters",
            bindKey: bindKey("Ctrl-T", "Ctrl-T"),
            exec: function (editor) { editor.transposeLetters(); },
            multiSelectAction: function (editor) { editor.transposeLetters(); },
            scrollIntoView: "cursor"
        }, {
            name: "touppercase",
            bindKey: bindKey("Ctrl-U", "Ctrl-U"),
            exec: function (editor) { editor.toUpperCase(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "tolowercase",
            bindKey: bindKey("Ctrl-Shift-U", "Ctrl-Shift-U"),
            exec: function (editor) { editor.toLowerCase(); },
            multiSelectAction: "forEach",
            scrollIntoView: "cursor"
        }, {
            name: "expandtoline",
            bindKey: bindKey("Ctrl-Shift-L", "Command-Shift-L"),
            exec: function (editor) {
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
            exec: function (editor) {
                var isBackwards = editor.selection.isBackwards();
                var selectionStart = isBackwards ? editor.selection.getSelectionLead() : editor.selection.getSelectionAnchor();
                var selectionEnd = isBackwards ? editor.selection.getSelectionAnchor() : editor.selection.getSelectionLead();
                var firstLineEndCol = editor.session.doc.getLine(selectionStart.row).length;
                var selectedText = editor.session.doc.getTextRange(editor.selection.getRange());
                var selectedCount = selectedText.replace(/\n\s*/, " ").length;
                var insertLine = editor.session.doc.getLine(selectionStart.row);
                for (var i = selectionStart.row + 1; i <= selectionEnd.row + 1; i++) {
                    var curLine = lang_1.stringTrimLeft(lang_1.stringTrimRight(editor.session.doc.getLine(i)));
                    if (curLine.length !== 0) {
                        curLine = " " + curLine;
                    }
                    insertLine += curLine;
                }
                ;
                if (selectionEnd.row + 1 < (editor.session.doc.getLength() - 1)) {
                    insertLine += editor.session.doc.getNewLineCharacter();
                }
                editor.clearSelection();
                editor.session.doc.replace(new Range_1.default(selectionStart.row, 0, selectionEnd.row + 2, 0), insertLine);
                if (selectedCount > 0) {
                    editor.selection.moveCursorTo(selectionStart.row, selectionStart.column);
                    editor.selection.selectTo(selectionStart.row, selectionStart.column + selectedCount);
                }
                else {
                    firstLineEndCol = editor.session.doc.getLine(selectionStart.row).length > firstLineEndCol ? (firstLineEndCol + 1) : firstLineEndCol;
                    editor.selection.moveCursorTo(selectionStart.row, firstLineEndCol);
                }
            },
            multiSelectAction: "forEach",
            readOnly: true
        }, {
            name: "invertSelection",
            bindKey: bindKey(null, null),
            exec: function (editor) {
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
                            newRanges.push(new Range_1.default(ranges[i].end.row, ranges[i].end.column, endRow, endCol));
                        }
                    }
                    if (i === 0) {
                        if (!(ranges[i].start.row === 0 && ranges[i].start.column === 0)) {
                            newRanges.push(new Range_1.default(0, 0, ranges[i].start.row, ranges[i].start.column));
                        }
                    }
                    else {
                        newRanges.push(new Range_1.default(ranges[i - 1].end.row, ranges[i - 1].end.column, ranges[i].start.row, ranges[i].start.column));
                    }
                }
                editor.exitMultiSelectMode();
                editor.clearSelection();
                for (var i = 0; i < newRanges.length; i++) {
                    editor.selection.addRange(newRanges[i], false);
                }
            },
            readOnly: true,
            scrollIntoView: "none"
        }];
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = commands;
});

define('TokenIterator',["require", "exports"], function (require, exports) {
    "use strict";
    var TokenIterator = (function () {
        function TokenIterator(session, initialRow, initialColumn) {
            this.session = session;
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
                this.$rowTokens = this.session.getTokens(this.$row);
                this.$tokenIndex = this.$rowTokens.length - 1;
            }
            return this.$rowTokens[this.$tokenIndex];
        };
        TokenIterator.prototype.stepForward = function () {
            if (this.$rowTokens) {
                this.$tokenIndex += 1;
                var rowCount;
                while (this.$tokenIndex >= this.$rowTokens.length) {
                    this.$row += 1;
                    if (!rowCount) {
                        rowCount = this.session.getLength();
                    }
                    if (this.$row >= rowCount) {
                        this.$row = rowCount - 1;
                        return null;
                    }
                    this.$rowTokens = this.session.getTokens(this.$row);
                    this.$tokenIndex = 0;
                }
                return this.$rowTokens[this.$tokenIndex];
            }
            else {
                return void 0;
            }
        };
        TokenIterator.prototype.getCurrentToken = function () {
            if (this.$rowTokens) {
                return this.$rowTokens[this.$tokenIndex];
            }
            else {
                return void 0;
            }
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TokenIterator;
});

define('comparePoints',["require", "exports"], function (require, exports) {
    "use strict";
    function comparePoints(p1, p2) {
        return p1.row - p2.row || p1.column - p2.column;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = comparePoints;
});

define('RangeList',["require", "exports", "./comparePoints"], function (require, exports, comparePoints_1) {
    var RangeList = (function () {
        function RangeList() {
            this.ranges = [];
        }
        RangeList.prototype.pointIndex = function (pos, excludeEdges, startIndex) {
            var list = this.ranges;
            for (var i = startIndex || 0; i < list.length; i++) {
                var range = list[i];
                var cmpEnd = comparePoints_1.default(pos, range.end);
                if (cmpEnd > 0) {
                    continue;
                }
                var cmpStart = comparePoints_1.default(pos, range.start);
                if (cmpEnd === 0) {
                    return excludeEdges && cmpStart !== 0 ? -i - 2 : i;
                }
                if (cmpStart > 0 || (cmpStart === 0 && !excludeEdges)) {
                    return i;
                }
                return -i - 1;
            }
            return -i - 1;
        };
        RangeList.prototype.add = function (range) {
            var excludeEdges = !range.isEmpty();
            var startIndex = this.pointIndex(range.start, excludeEdges);
            if (startIndex < 0)
                startIndex = -startIndex - 1;
            var endIndex = this.pointIndex(range.end, excludeEdges, startIndex);
            if (endIndex < 0) {
                endIndex = -endIndex - 1;
            }
            else {
                endIndex++;
            }
            return this.ranges.splice(startIndex, endIndex - startIndex, range);
        };
        RangeList.prototype.addList = function (list) {
            var removed = [];
            for (var i = list.length; i--;) {
                removed.push.call(removed, this.add(list[i]));
            }
            return removed;
        };
        RangeList.prototype.substractPoint = function (pos) {
            var i = this.pointIndex(pos);
            if (i >= 0) {
                return this.ranges.splice(i, 1);
            }
        };
        RangeList.prototype.merge = function () {
            var removed = [];
            var list = this.ranges;
            list = list.sort(function (a, b) {
                return comparePoints_1.default(a.start, b.start);
            });
            var next = list[0], range;
            for (var i = 1; i < list.length; i++) {
                range = next;
                next = list[i];
                var cmp = comparePoints_1.default(range.end, next.start);
                if (cmp < 0)
                    continue;
                if (cmp == 0 && !range.isEmpty() && !next.isEmpty())
                    continue;
                if (comparePoints_1.default(range.end, next.end) < 0) {
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
        RangeList.prototype.contains = function (row, column) {
            return this.pointIndex({ row: row, column: column }) >= 0;
        };
        RangeList.prototype.containsPoint = function (pos) {
            return this.pointIndex(pos) >= 0;
        };
        RangeList.prototype.rangeAtPoint = function (pos) {
            var i = this.pointIndex(pos);
            if (i >= 0) {
                return this.ranges[i];
            }
        };
        RangeList.prototype.clipRows = function (startRow, endRow) {
            var list = this.ranges;
            if (list[0].start.row > endRow || list[list.length - 1].start.row < startRow) {
                return [];
            }
            var startIndex = this.pointIndex({ row: startRow, column: 0 });
            if (startIndex < 0) {
                startIndex = -startIndex - 1;
            }
            var excludeEdges = true;
            var endIndex = this.pointIndex({ row: endRow, column: 0 }, excludeEdges, startIndex);
            if (endIndex < 0) {
                endIndex = -endIndex - 1;
            }
            var clipped = [];
            for (var i = startIndex; i < endIndex; i++) {
                clipped.push(list[i]);
            }
            return clipped;
        };
        RangeList.prototype.removeAll = function () {
            return this.ranges.splice(0, this.ranges.length);
        };
        RangeList.prototype.attach = function (session) {
            if (this.session) {
                this.detach();
            }
            this.session = session;
            this.onChange = this.$onChange.bind(this);
            this.session.on('change', this.onChange);
        };
        RangeList.prototype.detach = function () {
            if (!this.session) {
                return;
            }
            this.session.off('change', this.onChange);
            this.session = null;
        };
        RangeList.prototype.$onChange = function (e, session) {
            var changeRange = e.data.range;
            if (e.data.action[0] == "i") {
                var start = changeRange.start;
                var end = changeRange.end;
            }
            else {
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
                if (r.end.row < startRow) {
                    continue;
                }
                if (r.start.row > startRow) {
                    break;
                }
                if (r.start.row == startRow && r.start.column >= start.column) {
                    if (r.start.column == start.column && this['$insertRight']) {
                    }
                    else {
                        r.start.column += colDiff;
                        r.start.row += lineDif;
                    }
                }
                if (r.end.row == startRow && r.end.column >= start.column) {
                    if (r.end.column == start.column && this['$insertRight']) {
                        continue;
                    }
                    if (r.end.column == start.column && colDiff > 0 && i < n - 1) {
                        if (r.end.column > r.start.column && r.end.column == ranges[i + 1].start.column) {
                            r.end.column -= colDiff;
                        }
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
        return RangeList;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RangeList;
});

define('Selection',["require", "exports", "./lib/lang", "./lib/EventEmitterClass", "./Range", "./RangeList", "./Anchor"], function (require, exports, lang_1, EventEmitterClass_1, Range_1, RangeList_1, Anchor_1) {
    "use strict";
    var Selection = (function () {
        function Selection(session) {
            var _this = this;
            this.rangeCount = 0;
            this.ranges = [];
            this.rangeList = new RangeList_1.default();
            this.eventBus = new EventEmitterClass_1.default(this);
            this.session = session;
            this.doc = session.getDocument();
            this.clearSelection();
            this.lead = this.selectionLead = new Anchor_1.default(this.doc, 0, 0);
            this.anchor = this.selectionAnchor = new Anchor_1.default(this.doc, 0, 0);
            this.lead.on("change", function (event, source) {
                _this.eventBus._emit("changeCursor");
                if (!_this.$isEmpty) {
                    _this.eventBus._emit("changeSelection");
                }
                if (!_this.$keepDesiredColumnOnChange && event.oldPosition.column !== event.position.column) {
                    _this.$desiredColumn = null;
                }
            });
            this.selectionAnchor.on("change", function (event, source) {
                if (!_this.$isEmpty) {
                    _this.eventBus._emit("changeSelection");
                }
            });
        }
        Selection.prototype.$initRangeList = function () {
            if (this.rangeList)
                return;
            this.rangeList = new RangeList_1.default();
            this.ranges = [];
            this.rangeCount = 0;
        };
        ;
        Selection.prototype.substractPoint = function (pos) {
            var removed = this.rangeList.substractPoint(pos);
            if (removed) {
                this.$onRemoveRange(removed);
                return removed[0];
            }
        };
        ;
        Selection.prototype.getAllRanges = function () {
            return this.rangeCount ? this.rangeList.ranges.concat() : [this.getRange()];
        };
        Selection.prototype.splitIntoLines = function () {
            var _this = this;
            if (this.rangeCount > 1) {
                var ranges = this.rangeList.ranges;
                var lastRange = ranges[ranges.length - 1];
                var range = Range_1.default.fromPoints(ranges[0].start, lastRange.end);
                this.toSingleRange();
                this.setSelectionRange(range, lastRange.cursor === lastRange.start);
            }
            else {
                var range = this.getRange();
                var isBackwards = this.isBackwards();
                var startRow = range.start.row;
                var endRow = range.end.row;
                if (startRow === endRow) {
                    if (isBackwards)
                        var start = range.end, end = range.start;
                    else
                        var start = range.start, end = range.end;
                    this.addRange(Range_1.default.fromPoints(end, end));
                    this.addRange(Range_1.default.fromPoints(start, start));
                    return;
                }
                var rectSel = [];
                var r = this.getLineRange(startRow, true);
                r.start.column = range.start.column;
                rectSel.push(r);
                for (var i = startRow + 1; i < endRow; i++) {
                    rectSel.push(this.getLineRange(i, true));
                }
                r = this.getLineRange(endRow, true);
                r.end.column = range.end.column;
                rectSel.push(r);
                rectSel.forEach(function (range) { _this.addRange(range); });
            }
        };
        ;
        Selection.prototype.isEmpty = function () {
            return (this.$isEmpty || (this.anchor.row === this.lead.row &&
                this.anchor.column === this.lead.column));
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
            if (typeof row !== 'number') {
                throw new TypeError("row must be a number");
            }
            if (typeof column !== 'number') {
                throw new TypeError("column must be a number");
            }
            this.anchor.setPosition(row, column);
            if (this.$isEmpty) {
                this.$isEmpty = false;
                this.eventBus._emit("changeSelection");
            }
        };
        Selection.prototype.getSelectionAnchor = function () {
            if (this.$isEmpty) {
                return this.getSelectionLead();
            }
            else {
                return this.anchor.getPosition();
            }
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
            return (anchor.row > lead.row || (anchor.row === lead.row && anchor.column > lead.column));
        };
        Selection.prototype.getRange = function () {
            var anchor = this.anchor;
            var lead = this.lead;
            if (typeof anchor.row !== 'number') {
                throw new TypeError();
            }
            if (typeof anchor.column !== 'number') {
                throw new TypeError();
            }
            if (typeof lead.row !== 'number') {
                throw new TypeError();
            }
            if (typeof lead.column !== 'number') {
                throw new TypeError();
            }
            if (this.isEmpty())
                return Range_1.default.fromPoints(lead, lead);
            if (this.isBackwards()) {
                return Range_1.default.fromPoints(lead, anchor);
            }
            else {
                return Range_1.default.fromPoints(anchor, lead);
            }
        };
        Selection.prototype.clearSelection = function () {
            if (!this.$isEmpty) {
                this.$isEmpty = true;
                this.eventBus._emit("changeSelection");
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
            }
            else {
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
        Selection.prototype.selectToPosition = function (position) {
            var self = this;
            this.$moveSelection(function () {
                self.moveCursorToPosition(position);
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
            if (typeof column === "undefined") {
                var cursor = this.lead;
                row = cursor.row;
                column = cursor.column;
            }
            return this.session.getWordRange(row, column);
        };
        Selection.prototype.selectWord = function () {
            this.setSelectionRange(this.getWordRange(this.lead.row, this.lead.column));
        };
        Selection.prototype.selectAWord = function () {
            var cursor = this.getCursor();
            var range = this.session.getAWordRange(cursor.row, cursor.column);
            this.setSelectionRange(range);
        };
        Selection.prototype.getLineRange = function (row, excludeLastChar) {
            var rowStart = typeof row === "number" ? row : this.lead.row;
            var rowEnd;
            var foldLine = this.session.getFoldLine(rowStart);
            if (foldLine) {
                rowStart = foldLine.start.row;
                rowEnd = foldLine.end.row;
            }
            else {
                rowEnd = rowStart;
            }
            if (excludeLastChar) {
                return new Range_1.default(rowStart, 0, rowEnd, this.session.getLine(rowEnd).length);
            }
            else {
                return new Range_1.default(rowStart, 0, rowEnd + 1, 0);
            }
        };
        Selection.prototype.selectLine = function () {
            this.setSelectionRange(this.getLineRange());
        };
        Selection.prototype.mergeOverlappingRanges = function () {
            var removed = this.rangeList.merge();
            if (removed.length) {
                this.$onRemoveRange(removed);
            }
            else if (this.ranges[0]) {
                this.fromOrientedRange(this.ranges[0]);
            }
        };
        ;
        Selection.prototype.moveCursorUp = function () {
            this.moveCursorBy(-1, 0);
        };
        Selection.prototype.moveCursorDown = function () {
            this.moveCursorBy(1, 0);
        };
        Selection.prototype.moveCursorLeft = function () {
            var cursor = this.lead.getPosition();
            var fold;
            if (fold = this.session.getFoldAt(cursor.row, cursor.column, -1)) {
                this.moveCursorTo(fold.start.row, fold.start.column);
            }
            else if (cursor.column === 0) {
                if (cursor.row > 0) {
                    this.moveCursorTo(cursor.row - 1, this.doc.getLine(cursor.row - 1).length);
                }
            }
            else {
                var tabSize = this.session.getTabSize();
                if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column - tabSize, cursor.column).split(" ").length - 1 === tabSize)
                    this.moveCursorBy(0, -tabSize);
                else
                    this.moveCursorBy(0, -1);
            }
        };
        Selection.prototype.moveCursorRight = function () {
            var pos = this.lead.getPosition();
            var fold = this.session.getFoldAt(pos.row, pos.column, 1);
            if (fold) {
                this.moveCursorTo(fold.end.row, fold.end.column);
            }
            else if (this.lead.column === this.doc.getLine(this.lead.row).length) {
                if (this.lead.row < this.doc.getLength() - 1) {
                    this.moveCursorTo(this.lead.row + 1, 0);
                }
            }
            else {
                var tabSize = this.session.getTabSize();
                var cursor = this.lead;
                if (this.session.isTabStop(cursor) && this.doc.getLine(cursor.row).slice(cursor.column, cursor.column + tabSize).split(" ").length - 1 === tabSize) {
                    this.moveCursorBy(0, tabSize);
                }
                else {
                    this.moveCursorBy(0, 1);
                }
            }
        };
        Selection.prototype.moveCursorLineStart = function () {
            var row = this.lead.row;
            var column = this.lead.column;
            var screenRow = this.session.documentToScreenRow(row, column);
            var firstColumnPosition = this.session.screenToDocumentPosition(screenRow, 0);
            var beforeCursor = this.session.getDisplayLine(row, null, firstColumnPosition.row, firstColumnPosition.column);
            var leadingSpace = beforeCursor.match(/^\s*/);
            if (leadingSpace[0].length !== column && !this.session.$useEmacsStyleLineStart)
                firstColumnPosition.column += leadingSpace[0].length;
            this.moveCursorToPosition(firstColumnPosition);
        };
        Selection.prototype.moveCursorLineEnd = function () {
            var lead = this.lead;
            var lineEnd = this.session.getDocumentLastRowColumnPosition(lead.row, lead.column);
            if (this.lead.column === lineEnd.column) {
                var line = this.session.getLine(lineEnd.row);
                if (lineEnd.column === line.length) {
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
            var leftOfCursor = lang_1.stringReverse(str);
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
            var match;
            var index = 0;
            var ch;
            var whitespaceRe = /\s/;
            var tokenRe = this.session.tokenRe;
            tokenRe.lastIndex = 0;
            if (match = this.session.tokenRe.exec(rightOfCursor)) {
                index = this.session.tokenRe.lastIndex;
            }
            else {
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
                            }
                            else {
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
            if (column === line.length) {
                var l = this.doc.getLength();
                do {
                    row++;
                    rightOfCursor = this.doc.getLine(row);
                } while (row < l && /^\s*$/.test(rightOfCursor));
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
            if (column === 0) {
                do {
                    row--;
                    line = this.doc.getLine(row);
                } while (row > 0 && /^\s*$/.test(line));
                column = line.length;
                if (!/\s+$/.test(line))
                    line = "";
            }
            var leftOfCursor = lang_1.stringReverse(line);
            var index = this.$shortWordEndIndex(leftOfCursor);
            return this.moveCursorTo(row, column - index);
        };
        Selection.prototype.moveCursorWordRight = function () {
            if (this.session.$selectLongWords) {
                this.moveCursorLongWordRight();
            }
            else {
                this.moveCursorShortWordRight();
            }
        };
        Selection.prototype.moveCursorWordLeft = function () {
            if (this.session.$selectLongWords) {
                this.moveCursorLongWordLeft();
            }
            else {
                this.moveCursorShortWordLeft();
            }
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
        Selection.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        Selection.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        Selection.prototype.detach = function () {
            this.lead.detach();
            this.anchor.detach();
            this.session = this.doc = null;
        };
        Selection.prototype.fromOrientedRange = function (range) {
            this.setSelectionRange(range, range.cursor === range.start);
            this.$desiredColumn = range.desiredColumn || this.$desiredColumn;
        };
        Selection.prototype.toOrientedRange = function (range) {
            var r = this.getRange();
            if (range) {
                range.start.column = r.start.column;
                range.start.row = r.start.row;
                range.end.column = r.end.column;
                range.end.row = r.end.row;
            }
            else {
                range = r;
            }
            range.cursor = this.isBackwards() ? range.start : range.end;
            range.desiredColumn = this.$desiredColumn;
            return range;
        };
        Selection.prototype.getRangeOfMovements = function (func) {
            var start = this.getCursor();
            try {
                func.call(null, this);
                var end = this.getCursor();
                return Range_1.default.fromPoints(start, end);
            }
            catch (e) {
                return Range_1.default.fromPoints(start, start);
            }
            finally {
                this.moveCursorToPosition(start);
            }
        };
        Selection.prototype.toJSON = function () {
            if (this.rangeCount) {
                var ranges = this.ranges.map(function (r) {
                    var r1 = r.clone();
                    r1.isBackwards = r.cursor === r.start;
                    return r1;
                });
                return ranges;
            }
            else {
                var range = this.getRange();
                range.isBackwards = this.isBackwards();
                return [range];
            }
        };
        Selection.prototype.toSingleRange = function (range) {
            range = range || this.ranges[0];
            var removed = this.rangeList.removeAll();
            if (removed.length) {
                this.$onRemoveRange(removed);
            }
            if (range) {
                this.fromOrientedRange(range);
            }
        };
        Selection.prototype.addRange = function (range, $blockChangeEvents) {
            if (!range) {
                return;
            }
            if (!this.inMultiSelectMode && this.rangeCount === 0) {
                var oldRange = this.toOrientedRange();
                this.rangeList.add(oldRange);
                this.rangeList.add(range);
                if (this.rangeList.ranges.length !== 2) {
                    this.rangeList.removeAll();
                    return $blockChangeEvents || this.fromOrientedRange(range);
                }
                this.rangeList.removeAll();
                this.rangeList.add(oldRange);
                this.$onAddRange(oldRange);
            }
            if (!range.cursor) {
                range.cursor = range.end;
            }
            var removed = this.rangeList.add(range);
            this.$onAddRange(range);
            if (removed.length)
                this.$onRemoveRange(removed);
            if (this.rangeCount > 1 && !this.inMultiSelectMode) {
                this.eventBus._signal("multiSelect");
                this.inMultiSelectMode = true;
                this.session.$undoSelect = false;
                this.rangeList.attach(this.session);
            }
            return $blockChangeEvents || this.fromOrientedRange(range);
        };
        Selection.prototype.$onAddRange = function (range) {
            this.rangeCount = this.rangeList.ranges.length;
            this.ranges.unshift(range);
            var event = { range: range };
            this.eventBus._signal("addRange", event);
        };
        ;
        Selection.prototype.$onRemoveRange = function (removed) {
            this.rangeCount = this.rangeList.ranges.length;
            if (this.rangeCount === 1 && this.inMultiSelectMode) {
                var lastRange = this.rangeList.ranges.pop();
                removed.push(lastRange);
                this.rangeCount = 0;
            }
            for (var i = removed.length; i--;) {
                var index = this.ranges.indexOf(removed[i]);
                this.ranges.splice(index, 1);
            }
            var event = { ranges: removed };
            this.eventBus._signal("removeRange", event);
            if (this.rangeCount === 0 && this.inMultiSelectMode) {
                this.inMultiSelectMode = false;
                this.eventBus._signal("singleSelect");
                this.session.$undoSelect = true;
                this.rangeList.detach();
            }
            lastRange = lastRange || this.ranges[0];
            if (lastRange && !lastRange.isEqual(this.getRange())) {
                this.fromOrientedRange(lastRange);
            }
        };
        ;
        Selection.prototype.fromJSON = function (data) {
            if (data.start === void 0) {
                if (this.rangeList) {
                    this.toSingleRange(data[0]);
                    for (var i = data.length; i--;) {
                        var r = Range_1.default.fromPoints(data[i].start, data[i].end);
                        if (data.isBackwards)
                            r.cursor = r.start;
                        this.addRange(r, true);
                    }
                    return;
                }
                else
                    data = data[0];
            }
            if (this.rangeList)
                this.toSingleRange(data);
            this.setSelectionRange(data, data.isBackwards);
        };
        Selection.prototype.isEqual = function (data) {
            if ((data.length || this.rangeCount) && data.length !== this.rangeCount)
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
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Selection;
});

define('Tokenizer',["require", "exports"], function (require, exports) {
    "use strict";
    var MAX_TOKEN_COUNT = 1000;
    var Tokenizer = (function () {
        function Tokenizer(rules) {
            var _this = this;
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
                        }
                        else if (matchcount - 1 != rule.token.length) {
                            throw new Error("number of classes and regexp groups in '" +
                                rule.token + "'\n'" + rule.regex + "' doesn't match\n"
                                + (matchcount - 1) + "!=" + rule.token.length);
                        }
                        else {
                            rule.tokenArray = rule.token;
                            rule.token = null;
                            rule.onMatch = this.$arrayTokens;
                        }
                    }
                    else if (typeof rule.token === "function" && !rule.onMatch) {
                        if (matchcount > 1) {
                            rule.onMatch = this.$applyToken;
                        }
                        else {
                            rule.onMatch = rule.token;
                        }
                    }
                    if (matchcount > 1) {
                        if (/\\\d/.test(rule.regex)) {
                            adjustedregex = rule.regex.replace(/\\([0-9]+)/g, function (match, digit) {
                                return "\\" + (parseInt(digit, 10) + matchTotal + 1);
                            });
                        }
                        else {
                            matchcount = 1;
                            adjustedregex = this.removeCapturingGroups(rule.regex);
                        }
                        if (!rule.splitRegex && typeof rule.token != "string")
                            splitterRules.push(rule);
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
                    rule.splitRegex = _this.createSplitterRegexp(rule.regex, flag);
                });
                this.regExps[key] = new RegExp("(" + ruleRegExps.join(")|(") + ")|($)", flag);
            }
        }
        Tokenizer.prototype.$setMaxTokenCount = function (m) {
            MAX_TOKEN_COUNT = m | 0;
        };
        Tokenizer.prototype.$applyToken = function (str) {
            var values = this.splitRegex.exec(str).slice(1);
            var types = this.token.apply(this, values);
            if (typeof types === "string") {
                return [{ type: types, value: str }];
            }
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
            if (!str) {
                return [];
            }
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
            var r = src.replace(/\[(?:\\.|[^\]])*?\]|\\.|\(\?[:=!]|(\()/g, function (x, y) { return y ? "(?:" : x; });
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
                    }
                    else if (square) {
                        inChClass = true;
                    }
                    else if (parenClose) {
                        if (stack == lastCapture.stack) {
                            lastCapture.end = index + 1;
                            lastCapture.stack = -1;
                        }
                        stack--;
                    }
                    else if (parenOpen) {
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
            }
            else {
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
            var match;
            var tokens = [];
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
                    }
                    else {
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
                        }
                        else {
                            currentState = rule.next(currentState, stack);
                        }
                        state = this.states[currentState];
                        if (!state) {
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
                        }
                        else {
                            if (token.type)
                                tokens.push(token);
                            token = { type: type, value: value };
                        }
                    }
                    else if (type) {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Tokenizer;
});

define('TabstopManager',["require", "exports", "./comparePoints", "./lib/lang/createDelayedCall", "./keyboard/KeyboardHandler", "./Range"], function (require, exports, comparePoints_1, createDelayedCall_1, KeyboardHandler_1, Range_1) {
    var TabstopManager = (function () {
        function TabstopManager(editor) {
            var _this = this;
            this.keyboardHandler = new KeyboardHandler_1.default();
            this.$onChange = this.onChange.bind(this);
            this.$onChangeSelection = createDelayedCall_1.default(this.onChangeSelection.bind(this)).schedule;
            this.$onChangeSession = this.onChangeSession.bind(this);
            this.$onAfterExec = this.onAfterExec.bind(this);
            this.attach(editor);
            this.keyboardHandler.bindKeys({
                "Tab": function (editor) {
                    if (editor.snippetManager && editor.snippetManager.expandWithTab(editor)) {
                        return;
                    }
                    else {
                        _this.tabNext(1);
                    }
                },
                "Shift-Tab": function (editor) {
                    _this.tabNext(-1);
                },
                "Esc": function (editor) {
                    _this.detach();
                },
                "Return": function (editor) {
                    editor.tabstopManager.tabNext(1);
                    return false;
                }
            });
        }
        TabstopManager.prototype.attach = function (editor) {
            editor.tabstopManager = this;
            this.index = 0;
            this.ranges = [];
            this.tabstops = [];
            this.$openTabstops = null;
            this.selectedTabstop = null;
            this.editor = editor;
            this.editor.on("change", this.$onChange);
            this.editor.on("changeSelection", this.$onChangeSelection);
            this.editor.on("changeSession", this.$onChangeSession);
            this.editor.commands.on("afterExec", this.$onAfterExec);
            this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
        };
        TabstopManager.prototype.detach = function () {
            this.tabstops.forEach(this.removeTabstopMarkers, this);
            this.ranges = null;
            this.tabstops = null;
            this.selectedTabstop = null;
            this.editor.off("change", this.$onChange);
            this.editor.off("changeSelection", this.$onChangeSelection);
            this.editor.off("changeSession", this.$onChangeSession);
            this.editor.commands.off("afterExec", this.$onAfterExec);
            this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
            this.editor.tabstopManager = null;
            this.editor = null;
        };
        TabstopManager.prototype.onChange = function (delta, editor) {
            var isRemove = delta.action === "remove";
            var start = delta.start;
            var end = delta.end;
            var startRow = start.row;
            var endRow = end.row;
            var lineDif = endRow - startRow;
            var colDiff = end.column - start.column;
            if (isRemove) {
                lineDif = -lineDif;
                colDiff = -colDiff;
            }
            if (!this.$inChange && isRemove) {
                var ts = this.selectedTabstop;
                var changedOutside = ts && !ts.some(function (range) {
                    return comparePoints_1.default(range.start, start) <= 0 && comparePoints_1.default(range.end, end) >= 0;
                });
                if (changedOutside)
                    return this.detach();
            }
            var ranges = this.ranges;
            for (var i = 0; i < ranges.length; i++) {
                var r = ranges[i];
                if (r.end.row < start.row)
                    continue;
                if (isRemove && comparePoints_1.default(start, r.start) < 0 && comparePoints_1.default(end, r.end) > 0) {
                    this.removeRange(r);
                    i--;
                    continue;
                }
                if (r.start.row === startRow && r.start.column > start.column)
                    r.start.column += colDiff;
                if (r.end.row === startRow && r.end.column >= start.column)
                    r.end.column += colDiff;
                if (r.start.row >= startRow)
                    r.start.row += lineDif;
                if (r.end.row >= startRow)
                    r.end.row += lineDif;
                if (comparePoints_1.default(r.start, r.end) > 0)
                    this.removeRange(r);
            }
            if (!ranges.length)
                this.detach();
        };
        TabstopManager.prototype.updateLinkedFields = function () {
            var ts = this.selectedTabstop;
            if (!ts || !ts.hasLinkedRanges) {
                return;
            }
            this.$inChange = true;
            var session = this.editor.getSession();
            var text = session.getTextRange(ts.firstNonLinked);
            for (var i = ts.length; i--;) {
                var range = ts[i];
                if (!range.linked) {
                    continue;
                }
                var fmt = this.editor.snippetManager.tmStrFormat(text, range.original);
                session.replace(range, fmt);
            }
            this.$inChange = false;
        };
        TabstopManager.prototype.onAfterExec = function (e) {
            if (e.command && !e.command.readOnly)
                this.updateLinkedFields();
        };
        TabstopManager.prototype.onChangeSelection = function (event, editor) {
            if (!this.editor)
                return;
            var lead = this.editor.selection.lead;
            var anchor = this.editor.selection.anchor;
            var isEmpty = this.editor.selection.isEmpty();
            for (var i = this.ranges.length; i--;) {
                if (this.ranges[i].linked)
                    continue;
                var containsLead = this.ranges[i].contains(lead.row, lead.column);
                var containsAnchor = isEmpty || this.ranges[i].contains(anchor.row, anchor.column);
                if (containsLead && containsAnchor)
                    return;
            }
            this.detach();
        };
        TabstopManager.prototype.onChangeSession = function (event, editor) {
            this.detach();
        };
        TabstopManager.prototype.tabNext = function (dir) {
            var max = this.tabstops.length;
            var index = this.index + (dir || 1);
            index = Math.min(Math.max(index, 1), max);
            if (index === max) {
                index = 0;
            }
            this.selectTabstop(index);
            if (index === 0) {
                this.detach();
            }
        };
        TabstopManager.prototype.selectTabstop = function (index) {
            this.$openTabstops = null;
            var ts = this.tabstops[this.index];
            if (ts) {
                this.addTabstopMarkers(ts);
            }
            this.index = index;
            ts = this.tabstops[this.index];
            if (!ts || !ts.length) {
                return;
            }
            this.selectedTabstop = ts;
            if (!this.editor.inVirtualSelectionMode) {
                var sel = this.editor.multiSelect;
                sel.toSingleRange(ts.firstNonLinked.clone());
                for (var i = ts.length; i--;) {
                    if (ts.hasLinkedRanges && ts[i].linked) {
                        continue;
                    }
                    sel.addRange(ts[i].clone(), true);
                }
                if (sel.ranges[0])
                    sel.addRange(sel.ranges[0].clone());
            }
            else {
                this.editor.selection.setRange(ts.firstNonLinked);
            }
            this.editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
        };
        TabstopManager.prototype.addTabstops = function (tabstops, start, end, selectionIndex) {
            var _this = this;
            if (!this.$openTabstops) {
                this.$openTabstops = [];
            }
            if (!tabstops[0]) {
                var p = Range_1.default.fromPoints(end, end);
                moveRelative(p.start, start);
                moveRelative(p.end, start);
                tabstops[0] = [p];
                tabstops[0].index = 0;
            }
            var i = this.index;
            var arg = [i + 1, 0];
            var ranges = this.ranges;
            tabstops.forEach(function (ts, index) {
                var dest = _this.$openTabstops[index] || ts;
                for (var i = ts.length; i--;) {
                    var originalRange = ts[i];
                    var range = Range_1.default.fromPoints(originalRange.start, originalRange.end || originalRange.start);
                    movePoint(range.start, start);
                    movePoint(range.end, start);
                    range.original = originalRange;
                    range.tabstop = dest;
                    ranges.push(range);
                    if (dest !== ts)
                        dest.unshift(range);
                    else
                        dest[i] = range;
                    if (originalRange.fmtString) {
                        range.linked = true;
                        dest.hasLinkedRanges = true;
                    }
                    else if (!dest.firstNonLinked) {
                        dest.firstNonLinked = range;
                    }
                }
                if (!dest.firstNonLinked)
                    dest.hasLinkedRanges = false;
                if (dest === ts) {
                    arg.push(dest);
                    _this.$openTabstops[index] = dest;
                }
                _this.addTabstopMarkers(dest);
            });
            if (arg.length > 2) {
                if (this.tabstops.length)
                    arg.push(arg.splice(2, 1)[0]);
                this.tabstops.splice.apply(this.tabstops, arg);
            }
        };
        TabstopManager.prototype.addTabstopMarkers = function (ts) {
            var session = this.editor.session;
            ts.forEach(function (range) {
                if (!range.markerId) {
                    range.markerId = session.addMarker(range, "ace_snippet-marker", "text");
                }
            });
        };
        TabstopManager.prototype.removeTabstopMarkers = function (ts) {
            var session = this.editor.session;
            ts.forEach(function (range) {
                session.removeMarker(range.markerId);
                range.markerId = null;
            });
        };
        TabstopManager.prototype.removeRange = function (range) {
            var i = range.tabstop.indexOf(range);
            range.tabstop.splice(i, 1);
            i = this.ranges.indexOf(range);
            this.ranges.splice(i, 1);
            this.editor.session.removeMarker(range.markerId);
            if (!range.tabstop.length) {
                i = this.tabstops.indexOf(range.tabstop);
                if (i != -1)
                    this.tabstops.splice(i, 1);
                if (!this.tabstops.length)
                    this.detach();
            }
        };
        return TabstopManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TabstopManager;
    var movePoint = function (point, diff) {
        if (point.row === 0)
            point.column += diff.column;
        point.row += diff.row;
    };
    var moveRelative = function (point, start) {
        if (point.row == start.row)
            point.column -= start.column;
        point.row -= start.row;
    };
});

define('SnippetManager',["require", "exports", "./lib/EventEmitterClass", "./lib/lang", "./Tokenizer", "./TabstopManager"], function (require, exports, EventEmitterClass_1, lang_1, Tokenizer_1, TabstopManager_1) {
    var INCLUDE_SCOPES = 'includeScopes';
    function escape(ch) {
        return "(?:[^\\\\" + ch + "]|\\\\.)";
    }
    function tabstopTokenArray(str, _, stack) {
        str = str.substr(1);
        if (/^\d+$/.test(str) && !stack.inFormatString) {
            return [{ tabstopId: parseInt(str, 10) }];
        }
        return [{ text: str }];
    }
    var SnippetManager = (function () {
        function SnippetManager() {
            this.snippetMap = {};
            this.snippetNameMap = {};
            this.variables = {};
            this.eventBus = new EventEmitterClass_1.default(this);
        }
        SnippetManager.prototype.getTokenizer = function () {
            SnippetManager.prototype.getTokenizer = function () {
                return SnippetManager.$tokenizer;
            };
            return SnippetManager.$tokenizer;
        };
        SnippetManager.prototype.tokenizeTmSnippet = function (str, startState) {
            return this.getTokenizer().getLineTokens(str, startState).tokens.map(function (x) {
                return x.value || x;
            });
        };
        SnippetManager.prototype.$getDefaultValue = function (editor, name) {
            if (/^[A-Z]\d+$/.test(name)) {
                var i = name.substr(1);
                return (this.variables[name[0] + "__"] || {})[i];
            }
            if (/^\d+$/.test(name)) {
                return (this.variables['__'] || {})[name];
            }
            name = name.replace(/^TM_/, "");
            if (!editor)
                return;
            var s = editor.session;
            switch (name) {
                case "CURRENT_WORD":
                    var r = s.getWordRange(editor.getCursorPosition().row, editor.getCursorPosition().column);
                case "SELECTION":
                case "SELECTED_TEXT":
                    return s.getTextRange(r);
                case "CURRENT_LINE":
                    return s.getLine(editor.getCursorPosition().row);
                case "PREV_LINE":
                    return s.getLine(editor.getCursorPosition().row - 1);
                case "LINE_INDEX":
                    return editor.getCursorPosition().column;
                case "LINE_NUMBER":
                    return editor.getCursorPosition().row + 1;
                case "SOFT_TABS":
                    return s.getUseSoftTabs() ? "YES" : "NO";
                case "TAB_SIZE":
                    return s.getTabSize();
                case "FILENAME":
                case "FILEPATH":
                    return "";
                case "FULLNAME":
                    return "Ace";
            }
        };
        SnippetManager.prototype.getVariableValue = function (editor, varName) {
            if (this.variables.hasOwnProperty(varName))
                return this.variables[varName](editor, varName) || "";
            return this.$getDefaultValue(editor, varName) || "";
        };
        SnippetManager.prototype.tmStrFormat = function (str, ch, editor) {
            var flag = ch.flag || "";
            var re = new RegExp(ch.guard, flag.replace(/[^gi]/, ""));
            var fmtTokens = this.tokenizeTmSnippet(ch.fmt, "formatString");
            var self = this;
            var formatted = str.replace(re, function () {
                self.variables['__'] = arguments;
                var fmtParts = self.resolveVariables(fmtTokens, editor);
                var gChangeCase = "E";
                for (var i = 0; i < fmtParts.length; i++) {
                    var ch = fmtParts[i];
                    if (typeof ch === "object") {
                        fmtParts[i] = "";
                        if (ch.changeCase && ch.local) {
                            var next = fmtParts[i + 1];
                            if (next && typeof next == "string") {
                                if (ch.changeCase === "u")
                                    fmtParts[i] = next[0].toUpperCase();
                                else
                                    fmtParts[i] = next[0].toLowerCase();
                                fmtParts[i + 1] = next.substr(1);
                            }
                        }
                        else if (ch.changeCase) {
                            gChangeCase = ch.changeCase;
                        }
                    }
                    else if (gChangeCase === "U") {
                        fmtParts[i] = ch.toUpperCase();
                    }
                    else if (gChangeCase === "L") {
                        fmtParts[i] = ch.toLowerCase();
                    }
                }
                return fmtParts.join("");
            });
            self.variables['__'] = null;
            return formatted;
        };
        SnippetManager.prototype.resolveVariables = function (snippet, editor) {
            var result = [];
            for (var i = 0; i < snippet.length; i++) {
                var ch = snippet[i];
                if (typeof ch == "string") {
                    result.push(ch);
                }
                else if (typeof ch != "object") {
                    continue;
                }
                else if (ch.skip) {
                    gotoNext(ch);
                }
                else if (ch.processed < i) {
                    continue;
                }
                else if (ch.text) {
                    var value = this.getVariableValue(editor, ch.text);
                    if (value && ch.fmtString)
                        value = this.tmStrFormat(value, ch);
                    ch.processed = i;
                    if (ch.expectIf == null) {
                        if (value) {
                            result.push(value);
                            gotoNext(ch);
                        }
                    }
                    else {
                        if (value) {
                            ch.skip = ch.elseBranch;
                        }
                        else
                            gotoNext(ch);
                    }
                }
                else if (ch.tabstopId != null) {
                    result.push(ch);
                }
                else if (ch.changeCase != null) {
                    result.push(ch);
                }
            }
            function gotoNext(ch) {
                var i1 = snippet.indexOf(ch, i + 1);
                if (i1 != -1)
                    i = i1;
            }
            return result;
        };
        SnippetManager.prototype.insertSnippetForSelection = function (editor, snippetText) {
            var cursor = editor.getCursorPosition();
            var session = editor.getSession();
            var line = session.getLine(cursor.row);
            var tabString = session.getTabString();
            var indentString = line.match(/^\s*/)[0];
            if (cursor.column < indentString.length)
                indentString = indentString.slice(0, cursor.column);
            var tokens = this.tokenizeTmSnippet(snippetText);
            tokens = this.resolveVariables(tokens, editor);
            tokens = tokens.map(function (x) {
                if (x == "\n") {
                    return x + indentString;
                }
                if (typeof x === "string") {
                    return x.replace(/\t/g, tabString);
                }
                return x;
            });
            var tabstops = [];
            tokens.forEach(function (p, i) {
                if (typeof p != "object")
                    return;
                var id = p.tabstopId;
                var ts = tabstops[id];
                if (!ts) {
                    ts = tabstops[id] = [];
                    ts.index = id;
                    ts.value = "";
                }
                if (ts.indexOf(p) !== -1)
                    return;
                ts.push(p);
                var i1 = tokens.indexOf(p, i + 1);
                if (i1 === -1)
                    return;
                var value = tokens.slice(i + 1, i1);
                var isNested = value.some(function (t) { return typeof t === "object"; });
                if (isNested && !ts.value) {
                    ts.value = value;
                }
                else if (value.length && (!ts.value || typeof ts.value !== "string")) {
                    ts.value = value.join("");
                }
            });
            tabstops.forEach(function (ts) { ts.length = 0; });
            var expanding = {};
            function copyValue(val) {
                var copy = [];
                for (var i = 0; i < val.length; i++) {
                    var p = val[i];
                    if (typeof p === "object") {
                        if (expanding[p.tabstopId])
                            continue;
                        var j = val.lastIndexOf(p, i - 1);
                        p = copy[j] || { tabstopId: p.tabstopId };
                    }
                    copy[i] = p;
                }
                return copy;
            }
            for (var i = 0; i < tokens.length; i++) {
                var p = tokens[i];
                if (typeof p !== "object")
                    continue;
                var id = p.tabstopId;
                var i1 = tokens.indexOf(p, i + 1);
                if (expanding[id]) {
                    if (expanding[id] === p)
                        expanding[id] = null;
                    continue;
                }
                var ts = tabstops[id];
                var arg = (typeof ts.value === "string") ? [ts.value] : copyValue(ts.value);
                arg.unshift(i + 1, Math.max(0, i1 - i));
                arg.push(p);
                expanding[id] = p;
                tokens.splice.apply(tokens, arg);
                if (ts.indexOf(p) === -1)
                    ts.push(p);
            }
            var row = 0, column = 0;
            var text = "";
            tokens.forEach(function (t) {
                if (typeof t === "string") {
                    if (t[0] === "\n") {
                        column = t.length - 1;
                        row++;
                    }
                    else
                        column += t.length;
                    text += t;
                }
                else {
                    if (!t.start)
                        t.start = { row: row, column: column };
                    else
                        t.end = { row: row, column: column };
                }
            });
            var range = editor.getSelectionRange();
            var end = editor.getSession().replace(range, text);
            var tsManager = editor.tabstopManager ? editor.tabstopManager : new TabstopManager_1.default(editor);
            var selectionId = editor.inVirtualSelectionMode && editor.selection.index;
            tsManager.addTabstops(tabstops, range.start, end, selectionId);
        };
        SnippetManager.prototype.insertSnippet = function (editor, snippetText, options) {
            var _this = this;
            if (editor.inVirtualSelectionMode) {
                return this.insertSnippetForSelection(editor, snippetText);
            }
            editor.forEachSelection(function () { _this.insertSnippetForSelection(editor, snippetText); }, null, { keepOrder: true });
            if (editor.tabstopManager) {
                editor.tabstopManager.tabNext();
            }
        };
        SnippetManager.prototype.$getScope = function (editor) {
            var session = editor.getSession();
            var scope = session.$mode.$id || "";
            scope = scope.split("/").pop();
            if (scope === "html" || scope === "php") {
                if (scope === "php" && !session.$mode['inlinePhp'])
                    scope = "html";
                var c = editor.getCursorPosition();
                var state = session.getState(c.row);
                if (typeof state === "object") {
                    state = state[0];
                }
                if (state.substring) {
                    if (state.substring(0, 3) == "js-")
                        scope = "javascript";
                    else if (state.substring(0, 4) == "css-")
                        scope = "css";
                    else if (state.substring(0, 4) == "php-")
                        scope = "php";
                }
            }
            return scope;
        };
        SnippetManager.prototype.getActiveScopes = function (editor) {
            var scope = this.$getScope(editor);
            var scopes = [scope];
            var snippetMap = this.snippetMap;
            if (snippetMap[scope] && snippetMap[scope][INCLUDE_SCOPES]) {
                scopes.push.apply(scopes, snippetMap[scope][INCLUDE_SCOPES]);
            }
            scopes.push("_");
            return scopes;
        };
        SnippetManager.prototype.expandWithTab = function (editor, options) {
            var _this = this;
            var result = editor.forEachSelection(function () { return _this.expandSnippetForSelection(editor, options); }, null, { keepOrder: true });
            if (result && editor.tabstopManager) {
                editor.tabstopManager.tabNext();
            }
            return result;
        };
        SnippetManager.prototype.expandSnippetForSelection = function (editor, options) {
            var _this = this;
            var cursor = editor.getCursorPosition();
            var session = editor.getSession();
            var line = session.getLine(cursor.row);
            var before = line.substring(0, cursor.column);
            var after = line.substr(cursor.column);
            var snippetMap = this.snippetMap;
            var snippet;
            var scopes = this.getActiveScopes(editor);
            scopes.some(function (scope) {
                var snippets = snippetMap[scope];
                if (snippets) {
                    snippet = _this.findMatchingSnippet(snippets, before, after);
                }
                return !!snippet;
            });
            if (!snippet) {
                return false;
            }
            if (options && options.dryRun) {
                return true;
            }
            session.doc.removeInLine(cursor.row, cursor.column - snippet.replaceBefore.length, cursor.column + snippet.replaceAfter.length);
            this.variables['M__'] = snippet.matchBefore;
            this.variables['T__'] = snippet.matchAfter;
            this.insertSnippetForSelection(editor, snippet.content);
            this.variables['M__'] = this.variables['T__'] = null;
            return true;
        };
        SnippetManager.prototype.findMatchingSnippet = function (snippetList, before, after) {
            for (var i = snippetList.length; i--;) {
                var s = snippetList[i];
                if (s.startRe && !s.startRe.test(before))
                    continue;
                if (s.endRe && !s.endRe.test(after))
                    continue;
                if (!s.startRe && !s.endRe)
                    continue;
                s.matchBefore = s.startRe ? s.startRe.exec(before) : [""];
                s.matchAfter = s.endRe ? s.endRe.exec(after) : [""];
                s.replaceBefore = s.triggerRe ? s.triggerRe.exec(before)[0] : "";
                s.replaceAfter = s.endTriggerRe ? s.endTriggerRe.exec(after)[0] : "";
                return s;
            }
        };
        SnippetManager.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        SnippetManager.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        SnippetManager.prototype.register = function (snippets, scope) {
            var snippetMap = this.snippetMap;
            var snippetNameMap = this.snippetNameMap;
            var self = this;
            function wrapRegexp(src) {
                if (src && !/^\^?\(.*\)\$?$|^\\b$/.test(src))
                    src = "(?:" + src + ")";
                return src || "";
            }
            function guardedRegexp(re, guard, opening) {
                re = wrapRegexp(re);
                guard = wrapRegexp(guard);
                if (opening) {
                    re = guard + re;
                    if (re && re[re.length - 1] != "$")
                        re = re + "$";
                }
                else {
                    re = re + guard;
                    if (re && re[0] != "^")
                        re = "^" + re;
                }
                return new RegExp(re);
            }
            function addSnippet(s) {
                if (!s.scope)
                    s.scope = scope || "_";
                scope = s.scope;
                if (!snippetMap[scope]) {
                    snippetMap[scope] = [];
                    snippetNameMap[scope] = {};
                }
                var map = snippetNameMap[scope];
                if (s.name) {
                    var existingSnippet = map[s.name];
                    if (existingSnippet) {
                        self.unregister([existingSnippet]);
                    }
                    map[s.name] = s;
                }
                snippetMap[scope].push(s);
                if (s.tabTrigger && !s.trigger) {
                    if (!s.guard && /^\w/.test(s.tabTrigger))
                        s.guard = "\\b";
                    s.trigger = lang_1.escapeRegExp(s.tabTrigger);
                }
                s.startRe = guardedRegexp(s.trigger, s.guard, true);
                s.triggerRe = new RegExp(s.trigger, "");
                s.endRe = guardedRegexp(s.endTrigger, s.endGuard, true);
                s.endTriggerRe = new RegExp(s.endTrigger, "");
            }
            if (Array.isArray(snippets)) {
                snippets.forEach(addSnippet);
            }
            else {
                throw new TypeError("snippets must be an array of Snippet.");
            }
            this.eventBus._signal("registerSnippets", { scope: scope });
        };
        SnippetManager.prototype.unregister = function (snippets, scope) {
            var snippetMap = this.snippetMap;
            var snippetNameMap = this.snippetNameMap;
            function removeSnippet(s) {
                var nameMap = snippetNameMap[s.scope || scope];
                if (nameMap && nameMap[s.name]) {
                    delete nameMap[s.name];
                    var map = snippetMap[s.scope || scope];
                    var i = map && map.indexOf(s);
                    if (i >= 0)
                        map.splice(i, 1);
                }
            }
            if (Array.isArray(snippets)) {
                snippets.forEach(removeSnippet);
            }
            else {
                throw new TypeError("snippets must be an array of Snippet.");
            }
        };
        SnippetManager.prototype.parseSnippetFile = function (str) {
            str = str.replace(/\r/g, "");
            var list = [];
            var snippet = {};
            var re = /^#.*|^({[\s\S]*})\s*$|^(\S+) (.*)$|^((?:\n*\t.*)+)/gm;
            var m;
            while (m = re.exec(str)) {
                if (m[1]) {
                    try {
                        snippet = JSON.parse(m[1]);
                        list.push(snippet);
                    }
                    catch (e) {
                    }
                }
                if (m[4]) {
                    snippet.content = m[4].replace(/^\t/gm, "");
                    list.push(snippet);
                    snippet = {};
                }
                else {
                    var key = m[2];
                    var val = m[3];
                    if (typeof key === 'string') {
                        if (key === "regex") {
                            var guardRe = /\/((?:[^\/\\]|\\.)*)|$/g;
                            snippet.guard = guardRe.exec(val)[1];
                            snippet.trigger = guardRe.exec(val)[1];
                            snippet.endTrigger = guardRe.exec(val)[1];
                            snippet.endGuard = guardRe.exec(val)[1];
                        }
                        else if (key === "snippet") {
                            snippet.tabTrigger = val.match(/^\S*/)[0];
                            if (!snippet.name) {
                                snippet.name = val;
                            }
                        }
                        else {
                            snippet[key] = val;
                        }
                    }
                    else {
                    }
                }
            }
            return list;
        };
        SnippetManager.prototype.getSnippetByName = function (name, editor) {
            var _this = this;
            var snippet;
            this.getActiveScopes(editor).some(function (scope) {
                var snippets = _this.snippetNameMap[scope];
                if (snippets) {
                    snippet = snippets[name];
                }
                return !!snippet;
            }, this);
            return snippet;
        };
        SnippetManager.$tokenizer = new Tokenizer_1.default({
            start: [
                {
                    regex: /:/,
                    onMatch: function (value, state, stack) {
                        if (stack.length && stack[0].expectIf) {
                            stack[0].expectIf = false;
                            stack[0].elseBranch = stack[0];
                            return [stack[0]];
                        }
                        return ":";
                    }
                },
                {
                    regex: /\\./,
                    onMatch: function (value, state, stack) {
                        var ch = value[1];
                        if (ch == "}" && stack.length) {
                            return [ch];
                        }
                        else if ("`$\\".indexOf(ch) != -1) {
                            return [ch];
                        }
                        else if (stack.inFormatString) {
                            if (ch == "n")
                                return ["\n"];
                            else if (ch == "t")
                                return ["\n"];
                            else if ("ulULE".indexOf(ch) != -1) {
                                return [{ changeCase: ch, local: ch > "a" }];
                            }
                        }
                        else {
                            return [value];
                        }
                    }
                },
                {
                    regex: /}/,
                    onMatch: function (val, state, stack) {
                        return [stack.length ? stack.shift() : val];
                    }
                },
                {
                    regex: /\$(?:\d+|\w+)/,
                    onMatch: tabstopTokenArray
                },
                {
                    regex: /\$\{[\dA-Z_a-z]+/,
                    onMatch: function (value, state, stack) {
                        var tokens = tabstopTokenArray(value.substr(1), state, stack);
                        stack.unshift(tokens[0]);
                        return tokens;
                    },
                    next: "snippetVar"
                },
                {
                    regex: /\n/,
                    token: "newline",
                    merge: false
                }
            ],
            snippetVar: [
                {
                    regex: "\\|" + escape("\\|") + "*\\|", onMatch: function (val, state, stack) {
                        stack[0].choices = val.slice(1, -1).split(",");
                    }, next: "start"
                },
                {
                    regex: "/(" + escape("/") + "+)/(?:(" + escape("/") + "*)/)(\\w*):?",
                    onMatch: function (value, state, stack) {
                        var ts = stack[0];
                        ts.fmtString = value;
                        value = this.splitRegex.exec(value);
                        ts.guard = value[1];
                        ts.fmt = value[2];
                        ts.flag = value[3];
                        return "";
                    }, next: "start"
                },
                {
                    regex: "`" + escape("`") + "*`", onMatch: function (value, state, stack) {
                        stack[0].code = value.splice(1, -1);
                        return "";
                    }, next: "start"
                },
                {
                    regex: "\\?", onMatch: function (val, state, stack) {
                        if (stack[0])
                            stack[0].expectIf = true;
                    }, next: "start"
                },
                { regex: "([^:}\\\\]|\\\\.)*:?", token: "", next: "start" }
            ],
            formatString: [
                { regex: "/(" + escape("/") + "+)/", token: "regex" },
                {
                    regex: "", onMatch: function (val, state, stack) {
                        stack.inFormatString = true;
                    }, next: "start"
                }
            ]
        });
        return SnippetManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SnippetManager;
});

define('hammer/utils',["require", "exports"], function (require, exports) {
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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('hammer/hammer',["require", "exports", './utils'], function (require, exports, utils_1) {
    "use strict";
    exports.TOUCH_ACTION_COMPUTE = 'compute';
    exports.TOUCH_ACTION_AUTO = 'auto';
    exports.TOUCH_ACTION_MANIPULATION = 'manipulation';
    exports.TOUCH_ACTION_NONE = 'none';
    exports.TOUCH_ACTION_PAN_X = 'pan-x';
    exports.TOUCH_ACTION_PAN_Y = 'pan-y';
    var STOP = 1;
    var FORCED_STOP = 2;
    var VectorE2 = (function () {
        function VectorE2(x, y) {
            this.x = x;
            this.y = y;
        }
        VectorE2.prototype.add = function (other) {
            return new VectorE2(this.x + other.x, this.y + other.y);
        };
        VectorE2.prototype.sub = function (other) {
            return new VectorE2(this.x - other.x, this.y - other.y);
        };
        VectorE2.prototype.div = function (other) {
            return new VectorE2(this.x / other, this.y / other);
        };
        VectorE2.prototype.dot = function (other) {
            return this.x * other.x + this.y * other.y;
        };
        VectorE2.prototype.norm = function () {
            return Math.sqrt(this.quadrance());
        };
        VectorE2.prototype.quadrance = function () {
            return this.x * this.x + this.y * this.y;
        };
        VectorE2.prototype.toString = function () {
            return 'VectorE2(' + this.x + ', ' + this.y + ')';
        };
        return VectorE2;
    })();
    exports.VectorE2 = VectorE2;
    var ClientLocation = (function () {
        function ClientLocation(clientX, clientY) {
            this.clientX = clientX;
            this.clientY = clientY;
        }
        ClientLocation.prototype.moveTo = function (clientX, clientY) {
            this.clientX = clientX;
            this.clientY = clientY;
        };
        ClientLocation.prototype.sub = function (other) {
            return new VectorE2(this.clientX - other.clientX, this.clientY - other.clientY);
        };
        ClientLocation.fromTouch = function (touch) {
            return new ClientLocation(touch.clientX, touch.clientY);
        };
        ClientLocation.prototype.toString = function () {
            return 'ClientLocation(' + this.clientX + ', ' + this.clientY + ')';
        };
        return ClientLocation;
    })();
    exports.ClientLocation = ClientLocation;
    var Session = (function () {
        function Session() {
            this.compEvents = [];
            this.reset();
        }
        Session.prototype.reset = function () {
            this.startTime = Date.now();
            this.compEvents = [];
            this.curRecognizer = undefined;
        };
        Session.prototype.push = function (compEvent) {
            this.compEvents.push(compEvent);
        };
        Session.prototype.computeMovement = function (center) {
            if (center) {
                if (this.compEvents.length > 0) {
                    var prev = this.compEvents[this.compEvents.length - 1];
                    return center.sub(prev.center);
                }
                else {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        };
        Session.prototype.computeVelocity = function (center, deltaTime) {
            if (center) {
                if (this.compEvents.length > 0) {
                    var prev = this.compEvents[this.compEvents.length - 1];
                    return center.sub(prev.center).div(deltaTime - prev.deltaTime);
                }
                else {
                    return undefined;
                }
            }
            else {
                return undefined;
            }
        };
        return Session;
    })();
    exports.Session = Session;
    var Manager = (function () {
        function Manager(element) {
            this.handlers = {};
            this.session = new Session();
            this.recognizers = [];
            this.domEvents = false;
            this.enable = true;
            this.cssProps = {};
            this.element = element;
            this.inputTarget = element;
            this.input = new TouchInput(this, inputHandler);
            this.touchAction = new TouchAction(this, exports.TOUCH_ACTION_COMPUTE);
            this.toggleCssProps(true);
        }
        Manager.prototype.stop = function (force) {
            this.session.stopped = force ? FORCED_STOP : STOP;
        };
        Manager.prototype.recognize = function (inputData, touchEvent) {
            var session = this.session;
            if (session.stopped) {
                return;
            }
            this.touchAction.preventDefaults(inputData, touchEvent);
            var recognizer;
            var recognizers = this.recognizers;
            var curRecognizer = session.curRecognizer;
            if (!curRecognizer || (curRecognizer && curRecognizer.state & exports.STATE_RECOGNIZED)) {
                curRecognizer = session.curRecognizer = null;
            }
            var i = 0;
            while (i < recognizers.length) {
                recognizer = recognizers[i];
                if (session.stopped !== FORCED_STOP && (!curRecognizer || recognizer == curRecognizer ||
                    recognizer.canRecognizeWith(curRecognizer))) {
                    recognizer.recognize(inputData);
                }
                else {
                    recognizer.reset();
                }
                if (!curRecognizer && recognizer.state & (exports.STATE_BEGAN | exports.STATE_CHANGED | exports.STATE_RECOGNIZED)) {
                    curRecognizer = session.curRecognizer = recognizer;
                }
                i++;
            }
        };
        Manager.prototype.get = function (eventName) {
            var recognizers = this.recognizers;
            for (var i = 0; i < recognizers.length; i++) {
                if (recognizers[i].eventName === eventName) {
                    return recognizers[i];
                }
            }
            return null;
        };
        Manager.prototype.add = function (recognizer) {
            var existing = this.get(recognizer.eventName);
            if (existing) {
                this.remove(existing);
            }
            this.recognizers.push(recognizer);
            recognizer.manager = this;
            this.touchAction.update();
            return recognizer;
        };
        Manager.prototype.remove = function (recognizer) {
            var recognizers = this.recognizers;
            recognizer = this.get(recognizer.eventName);
            recognizers.splice(utils_1.inArray(recognizers, recognizer), 1);
            this.touchAction.update();
            return this;
        };
        Manager.prototype.on = function (events, handler) {
            var handlers = this.handlers;
            utils_1.each(utils_1.splitStr(events), function (event) {
                handlers[event] = handlers[event] || [];
                handlers[event].push(handler);
            });
            return this;
        };
        Manager.prototype.off = function (events, handler) {
            var handlers = this.handlers;
            utils_1.each(utils_1.splitStr(events), function (event) {
                if (!handler) {
                    delete handlers[event];
                }
                else {
                    handlers[event].splice(utils_1.inArray(handlers[event], handler), 1);
                }
            });
            return this;
        };
        Manager.prototype.emit = function (eventName, data) {
            if (this.domEvents) {
                triggerDomEvent(event, data);
            }
            var handlers = this.handlers[eventName] && this.handlers[eventName].slice();
            if (!handlers || !handlers.length) {
                return;
            }
            var i = 0;
            while (i < handlers.length) {
                handlers[i](data);
                i++;
            }
        };
        Manager.prototype.updateTouchAction = function () {
            this.touchAction.update();
        };
        Manager.prototype.destroy = function () {
            this.element && this.toggleCssProps(false);
            this.handlers = {};
            this.session = undefined;
            this.input.destroy();
            this.element = null;
        };
        Manager.prototype.toggleCssProps = function (add) {
            if (!this.element.style) {
                return;
            }
            var element = this.element;
            utils_1.each(this.cssProps, function (value, name) {
                element.style[utils_1.prefixed(element.style, name)] = add ? value : '';
            });
        };
        Manager.prototype.cancelContextMenu = function () {
        };
        return Manager;
    })();
    exports.Manager = Manager;
    function triggerDomEvent(event, data) {
        var gestureEvent = document.createEvent('Event');
        gestureEvent.initEvent(event, true, true);
        gestureEvent['gesture'] = data;
        data.target.dispatchEvent(gestureEvent);
    }
    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
    var SUPPORT_TOUCH = ('ontouchstart' in window);
    var SUPPORT_POINTER_EVENTS = utils_1.prefixed(window, 'PointerEvent') !== undefined;
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
    var PREFIXED_TOUCH_ACTION = utils_1.prefixed(utils_1.TEST_ELEMENT.style, 'touchAction');
    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;
    var TouchAction = (function () {
        function TouchAction(manager, value) {
            this.manager = manager;
            this.set(value);
        }
        TouchAction.prototype.set = function (value) {
            if (value === exports.TOUCH_ACTION_COMPUTE) {
                value = this.compute();
            }
            if (NATIVE_TOUCH_ACTION && this.manager.element.style) {
                this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
            }
            this.actions = value.toLowerCase().trim();
        };
        TouchAction.prototype.update = function () {
            this.set(exports.TOUCH_ACTION_COMPUTE);
        };
        TouchAction.prototype.compute = function () {
            var actions = [];
            utils_1.each(this.manager.recognizers, function (recognizer) {
                if (recognizer.enabled) {
                    actions = actions.concat(recognizer.getTouchAction());
                }
            });
            return cleanTouchActions(actions.join(' '));
        };
        TouchAction.prototype.preventDefaults = function (input, touchEvent) {
            if (NATIVE_TOUCH_ACTION) {
                return;
            }
            if (this.prevented) {
                touchEvent.preventDefault();
                return;
            }
        };
        TouchAction.prototype.preventSrc = function (srcEvent) {
            this.prevented = true;
            srcEvent.preventDefault();
        };
        return TouchAction;
    })();
    function cleanTouchActions(actions) {
        if (utils_1.inStr(actions, exports.TOUCH_ACTION_NONE)) {
            return exports.TOUCH_ACTION_NONE;
        }
        var hasPanX = utils_1.inStr(actions, exports.TOUCH_ACTION_PAN_X);
        var hasPanY = utils_1.inStr(actions, exports.TOUCH_ACTION_PAN_Y);
        if (hasPanX && hasPanY) {
            return exports.TOUCH_ACTION_PAN_X + ' ' + exports.TOUCH_ACTION_PAN_Y;
        }
        if (hasPanX || hasPanY) {
            return hasPanX ? exports.TOUCH_ACTION_PAN_X : exports.TOUCH_ACTION_PAN_Y;
        }
        if (utils_1.inStr(actions, exports.TOUCH_ACTION_MANIPULATION)) {
            return exports.TOUCH_ACTION_MANIPULATION;
        }
        return exports.TOUCH_ACTION_AUTO;
    }
    exports.INPUT_TYPE_TOUCH = 'touch';
    exports.INPUT_TYPE_PEN = 'pen';
    exports.INPUT_TYPE_MOUSE = 'mouse';
    exports.INPUT_TYPE_KINECT = 'kinect';
    var COMPUTE_INTERVAL = 25;
    exports.INPUT_START = 1;
    exports.INPUT_MOVE = 2;
    exports.INPUT_END = 4;
    exports.INPUT_CANCEL = 8;
    function decodeEventType(eventType) {
        switch (eventType) {
            case exports.INPUT_START: {
                return "START";
            }
            case exports.INPUT_MOVE: {
                return "MOVE";
            }
            case exports.INPUT_END: {
                return "END";
            }
            case exports.INPUT_CANCEL: {
                return "CANCEL";
            }
            default: {
                return "eventType=" + eventType;
            }
        }
    }
    exports.decodeEventType = decodeEventType;
    exports.DIRECTION_UNDEFINED = 0;
    exports.DIRECTION_LEFT = 1;
    exports.DIRECTION_RIGHT = 2;
    exports.DIRECTION_UP = 4;
    exports.DIRECTION_DOWN = 8;
    exports.DIRECTION_HORIZONTAL = exports.DIRECTION_LEFT | exports.DIRECTION_RIGHT;
    exports.DIRECTION_VERTICAL = exports.DIRECTION_UP | exports.DIRECTION_DOWN;
    exports.DIRECTION_ALL = exports.DIRECTION_HORIZONTAL | exports.DIRECTION_VERTICAL;
    var PROPS_XY = ['x', 'y'];
    var PROPS_CLIENT_XY = ['clientX', 'clientY'];
    var Input = (function () {
        function Input(manager, touchElementEvents, touchTargetEvents, touchWindowEvents) {
            var self = this;
            this.manager = manager;
            this.evEl = touchElementEvents;
            this.evTarget = touchTargetEvents;
            this.evWin = touchWindowEvents;
            this.element = manager.element;
            this.target = manager.inputTarget;
            this.domHandler = function (event) {
                if (manager.enable) {
                    self.handler(event);
                }
            };
            this.init();
        }
        Input.prototype.handler = function (event) { };
        Input.prototype.init = function () {
            this.evEl && utils_1.addEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && utils_1.addEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && utils_1.addEventListeners(utils_1.getWindowForElement(this.element), this.evWin, this.domHandler);
        };
        Input.prototype.destroy = function () {
            this.evEl && utils_1.removeEventListeners(this.element, this.evEl, this.domHandler);
            this.evTarget && utils_1.removeEventListeners(this.target, this.evTarget, this.domHandler);
            this.evWin && utils_1.removeEventListeners(utils_1.getWindowForElement(this.element), this.evWin, this.domHandler);
        };
        return Input;
    })();
    function inputHandler(manager, eventType, touchEvent) {
        var compEvent = computeIComputedEvent(manager, eventType, touchEvent);
        manager.recognize(compEvent, touchEvent);
        manager.session.push(compEvent);
    }
    function computeIComputedEvent(manager, eventType, touchEvent) {
        var touchesLength = touchEvent.touches.length;
        var changedPointersLen = touchEvent.changedTouches.length;
        var isFirst = (eventType & exports.INPUT_START && (touchesLength - changedPointersLen === 0));
        var isFinal = (eventType & (exports.INPUT_END | exports.INPUT_CANCEL) && (touchesLength - changedPointersLen === 0));
        if (isFirst) {
            manager.session.reset();
        }
        var session = manager.session;
        var center = computeCenter(touchEvent.touches);
        var movement = session.computeMovement(center);
        var timeStamp = Date.now();
        var movementTime = timeStamp - session.startTime;
        var distance = movement ? movement.norm() : 0;
        var direction = getDirection(movement);
        var velocity = session.computeVelocity(center, movementTime);
        var compEvent = {
            center: center,
            movement: movement,
            deltaTime: movementTime,
            direction: direction,
            distance: distance,
            eventType: eventType,
            rotation: 0,
            timeStamp: timeStamp,
            touchesLength: touchEvent.touches.length,
            scale: 1,
            velocity: velocity
        };
        return compEvent;
    }
    function computeCenter(touches) {
        var touchesLength = touches.length;
        if (touchesLength === 1) {
            return ClientLocation.fromTouch(touches[0]);
        }
        else if (touchesLength === 0) {
            return undefined;
        }
        else {
            var x = 0, y = 0, i = 0;
            while (i < touchesLength) {
                x += touches[i].clientX;
                y += touches[i].clientY;
                i++;
            }
            return new ClientLocation(Math.round(x / touchesLength), Math.round(y / touchesLength));
        }
    }
    function getVelocity(deltaTime, x, y) {
        return { x: x / deltaTime || 0, y: y / deltaTime || 0 };
    }
    function getDirection(movement) {
        var N = new VectorE2(0, -1);
        var S = new VectorE2(0, +1);
        var E = new VectorE2(+1, 0);
        var W = new VectorE2(-1, 0);
        var cosineThreshold = Math.cos(7 * Math.PI / 16);
        if (movement) {
            var unit = movement.div(movement.norm());
            var direction = exports.DIRECTION_UNDEFINED;
            if (unit.dot(N) > cosineThreshold) {
                direction |= exports.DIRECTION_UP;
            }
            if (unit.dot(S) > cosineThreshold) {
                direction |= exports.DIRECTION_DOWN;
            }
            if (unit.dot(E) > cosineThreshold) {
                direction |= exports.DIRECTION_RIGHT;
            }
            if (unit.dot(W) > cosineThreshold) {
                direction |= exports.DIRECTION_LEFT;
            }
            return direction;
        }
        else {
            return exports.DIRECTION_UNDEFINED;
        }
    }
    function getDistance(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
        return Math.sqrt((x * x) + (y * y));
    }
    exports.getDistance = getDistance;
    function getAngle(p1, p2, props) {
        if (!props) {
            props = PROPS_XY;
        }
        var x = p2[props[0]] - p1[props[0]], y = p2[props[1]] - p1[props[1]];
        return Math.atan2(y, x) * 180 / Math.PI;
    }
    function getRotation(start, end) {
        return getAngle(end[1], end[0], PROPS_CLIENT_XY) - getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }
    function getScale(start, end) {
        return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }
    var TOUCH_INPUT_MAP = {
        touchstart: exports.INPUT_START,
        touchmove: exports.INPUT_MOVE,
        touchend: exports.INPUT_END,
        touchcancel: exports.INPUT_CANCEL
    };
    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';
    var TouchInput = (function (_super) {
        __extends(TouchInput, _super);
        function TouchInput(manager, callback) {
            _super.call(this, manager, undefined, TOUCH_TARGET_EVENTS, undefined);
            this.targetIds = {};
            this.callback = callback;
        }
        TouchInput.prototype.handler = function (event) {
            var eventType = TOUCH_INPUT_MAP[event.type];
            this.callback(this.manager, eventType, event);
        };
        return TouchInput;
    })(Input);
    function getTouches(event, type) {
        var allTouches = utils_1.toArray(event.touches);
        var targetIds = this.targetIds;
        if (type & (exports.INPUT_START | exports.INPUT_MOVE) && allTouches.length === 1) {
            targetIds[allTouches[0].identifier] = true;
            return [allTouches, allTouches];
        }
        var i, targetTouches, changedTouches = utils_1.toArray(event.changedTouches), changedTargetTouches = [], target = this.target;
        targetTouches = allTouches.filter(function (touch) {
            return utils_1.hasParent(touch.target, target);
        });
        if (type === exports.INPUT_START) {
            i = 0;
            while (i < targetTouches.length) {
                targetIds[targetTouches[i].identifier] = true;
                i++;
            }
        }
        i = 0;
        while (i < changedTouches.length) {
            if (targetIds[changedTouches[i].identifier]) {
                changedTargetTouches.push(changedTouches[i]);
            }
            if (type & (exports.INPUT_END | exports.INPUT_CANCEL)) {
                delete targetIds[changedTouches[i].identifier];
            }
            i++;
        }
        if (!changedTargetTouches.length) {
            return;
        }
        return [
            utils_1.uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
            changedTargetTouches
        ];
    }
    exports.STATE_UNDEFINED = 0;
    exports.STATE_POSSIBLE = 1;
    exports.STATE_BEGAN = 2;
    exports.STATE_CHANGED = 4;
    exports.STATE_RECOGNIZED = 8;
    exports.STATE_CANCELLED = 16;
    exports.STATE_FAILED = 32;
    var Recognizer = (function () {
        function Recognizer(eventName, enabled) {
            this.simultaneous = {};
            this.requireFail = [];
            this.eventName = eventName;
            this.enabled = enabled;
            this.id = utils_1.uniqueId();
            this.manager = null;
            this.state = exports.STATE_POSSIBLE;
        }
        Recognizer.prototype.set = function (options) {
            this.manager && this.manager.updateTouchAction();
            return this;
        };
        Recognizer.prototype.recognizeWith = function (otherRecognizer) {
            var simultaneous = this.simultaneous;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
            if (!simultaneous[otherRecognizer.id]) {
                simultaneous[otherRecognizer.id] = otherRecognizer;
                otherRecognizer.recognizeWith(this);
            }
            return this;
        };
        Recognizer.prototype.dropRecognizeWith = function (otherRecognizer) {
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
            delete this.simultaneous[otherRecognizer.id];
            return this;
        };
        Recognizer.prototype.requireFailure = function (otherRecognizer) {
            var requireFail = this.requireFail;
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
            if (utils_1.inArray(requireFail, otherRecognizer) === -1) {
                requireFail.push(otherRecognizer);
                otherRecognizer.requireFailure(this);
            }
            return this;
        };
        Recognizer.prototype.dropRequireFailure = function (otherRecognizer) {
            otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this.manager);
            var index = utils_1.inArray(this.requireFail, otherRecognizer);
            if (index > -1) {
                this.requireFail.splice(index, 1);
            }
            return this;
        };
        Recognizer.prototype.hasRequireFailures = function () {
            return this.requireFail.length > 0;
        };
        Recognizer.prototype.canRecognizeWith = function (otherRecognizer) {
            return !!this.simultaneous[otherRecognizer.id];
        };
        Recognizer.prototype.emit = function () {
            var self = this;
            var state = this.state;
            function emit(withState) {
                var eventName = self.eventName + (withState ? stateStr(state) : '');
                self.manager.emit(eventName, undefined);
            }
            if (state < exports.STATE_RECOGNIZED) {
                emit(true);
            }
            emit(false);
            if (state >= exports.STATE_RECOGNIZED) {
                emit(true);
            }
        };
        Recognizer.prototype.tryEmit = function () {
            if (this.canEmit()) {
                return this.emit();
            }
            else {
            }
            this.state = exports.STATE_FAILED;
        };
        Recognizer.prototype.canEmit = function () {
            var i = 0;
            while (i < this.requireFail.length) {
                if (!(this.requireFail[i].state & (exports.STATE_FAILED | exports.STATE_POSSIBLE))) {
                    return false;
                }
                i++;
            }
            return true;
        };
        Recognizer.prototype.recognize = function (compEvent) {
            if (!this.enabled) {
                this.reset();
                this.state = exports.STATE_FAILED;
                return;
            }
            if (this.state & (exports.STATE_RECOGNIZED | exports.STATE_CANCELLED | exports.STATE_FAILED)) {
                this.state = exports.STATE_POSSIBLE;
            }
            this.state = this.process(compEvent);
            if (this.state & (exports.STATE_BEGAN | exports.STATE_CHANGED | exports.STATE_RECOGNIZED | exports.STATE_CANCELLED)) {
                this.tryEmit();
            }
        };
        Recognizer.prototype.process = function (inputData) {
            return exports.STATE_UNDEFINED;
        };
        Recognizer.prototype.getTouchAction = function () { return []; };
        Recognizer.prototype.reset = function () { };
        return Recognizer;
    })();
    exports.Recognizer = Recognizer;
    function stateStr(state) {
        if (state & exports.STATE_CANCELLED) {
            return 'cancel';
        }
        else if (state & exports.STATE_RECOGNIZED) {
            return 'end';
        }
        else if (state & exports.STATE_CHANGED) {
            return 'move';
        }
        else if (state & exports.STATE_BEGAN) {
            return 'start';
        }
        return '';
    }
    exports.stateStr = stateStr;
    function stateDecode(state) {
        var states = [];
        if (state & exports.STATE_POSSIBLE) {
            states.push('STATE_POSSIBLE');
        }
        else if (state & exports.STATE_CANCELLED) {
            states.push('STATE_CANCELLED');
        }
        else if (state & exports.STATE_RECOGNIZED) {
            states.push('STATE_RECOGNIZED');
        }
        else if (state & exports.STATE_CHANGED) {
            states.push('STATE_CHANGED');
        }
        else if (state & exports.STATE_BEGAN) {
            states.push('STATE_BEGAN');
        }
        else if (state & exports.STATE_UNDEFINED) {
            states.push('STATE_UNDEFINED');
        }
        else if (state & exports.STATE_FAILED) {
            states.push('STATE_FAILED');
        }
        else {
            states.push('' + state);
        }
        return states.join(' ');
    }
    exports.stateDecode = stateDecode;
    function directionStr(direction) {
        var ds = [];
        if (direction & exports.DIRECTION_DOWN) {
            ds.push('down');
        }
        if (direction & exports.DIRECTION_UP) {
            ds.push('up');
        }
        if (direction & exports.DIRECTION_LEFT) {
            ds.push('left');
        }
        if (direction & exports.DIRECTION_RIGHT) {
            ds.push('right');
        }
        return ds.join(' ');
    }
    exports.directionStr = directionStr;
    function getRecognizerByNameIfManager(recognizer, manager) {
        if (manager) {
            return manager.get(recognizer.eventName);
        }
        return recognizer;
    }
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('hammer/recognizers/attribute',["require", "exports", '../hammer'], function (require, exports, hammer_1) {
    "use strict";
    var ContinuousRecognizer = (function (_super) {
        __extends(ContinuousRecognizer, _super);
        function ContinuousRecognizer(eventName, enabled, pointers) {
            _super.call(this, eventName, enabled);
            this.pointers = pointers;
        }
        ContinuousRecognizer.prototype.attributeTest = function (input) {
            switch (input.eventType) {
                case hammer_1.INPUT_START:
                    {
                        return input.touchesLength === this.pointers;
                    }
                    break;
                case hammer_1.INPUT_MOVE:
                    {
                        return input.touchesLength === this.pointers;
                    }
                    break;
                case hammer_1.INPUT_END:
                    {
                        return input.touchesLength === this.pointers - 1;
                    }
                    break;
                case hammer_1.INPUT_CANCEL:
                    {
                        return true;
                    }
                    break;
                default: {
                    throw new Error(hammer_1.decodeEventType(input.eventType));
                }
            }
        };
        ContinuousRecognizer.prototype.process = function (input) {
            var state = this.state;
            var eventType = input.eventType;
            var isRecognized = state & (hammer_1.STATE_BEGAN | hammer_1.STATE_CHANGED);
            var isValid = this.attributeTest(input);
            if (isRecognized && (eventType & hammer_1.INPUT_CANCEL || !isValid)) {
                return state | hammer_1.STATE_CANCELLED;
            }
            else if (isRecognized || isValid) {
                if (eventType & hammer_1.INPUT_END) {
                    return state | hammer_1.STATE_RECOGNIZED;
                }
                else if (!(state & hammer_1.STATE_BEGAN)) {
                    return hammer_1.STATE_BEGAN;
                }
                else {
                    return state | hammer_1.STATE_CHANGED;
                }
            }
            return hammer_1.STATE_FAILED;
        };
        return ContinuousRecognizer;
    })(hammer_1.Recognizer);
    exports.ContinuousRecognizer = ContinuousRecognizer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('hammer/recognizers/pan',["require", "exports", './attribute', '../hammer'], function (require, exports, attribute_1, hammer_1) {
    "use strict";
    var PanRecognizer = (function (_super) {
        __extends(PanRecognizer, _super);
        function PanRecognizer(eventName, enabled) {
            _super.call(this, eventName, enabled, 1);
            this.direction = hammer_1.DIRECTION_ALL;
            this.threshold = 10;
        }
        PanRecognizer.prototype.setDirection = function (direction) {
            this.direction = direction;
            return this;
        };
        PanRecognizer.prototype.setThreshold = function (threshold) {
            this.threshold = threshold;
            return this;
        };
        PanRecognizer.prototype.getTouchAction = function () {
            var actions = [];
            if (this.direction & hammer_1.DIRECTION_HORIZONTAL) {
                actions.push(hammer_1.TOUCH_ACTION_PAN_Y);
            }
            if (this.direction & hammer_1.DIRECTION_VERTICAL) {
                actions.push(hammer_1.TOUCH_ACTION_PAN_X);
            }
            return actions;
        };
        PanRecognizer.prototype.directionTest = function (input) {
            var hasMoved = true;
            var distance = input.distance;
            var direction = input.direction;
            var x = input.movement.x;
            var y = input.movement.y;
            if (!(direction & this.direction)) {
                if (this.direction & hammer_1.DIRECTION_HORIZONTAL) {
                    direction = (x === 0) ? hammer_1.DIRECTION_UNDEFINED : (x < 0) ? hammer_1.DIRECTION_LEFT : hammer_1.DIRECTION_RIGHT;
                    hasMoved = x != this.pX;
                    distance = Math.abs(input.movement.x);
                }
                else {
                    direction = (y === 0) ? hammer_1.DIRECTION_UNDEFINED : (y < 0) ? hammer_1.DIRECTION_UP : hammer_1.DIRECTION_DOWN;
                    hasMoved = y != this.pY;
                    distance = Math.abs(input.movement.y);
                }
            }
            var directionAllowed = (direction & this.direction) > 0;
            return hasMoved && distance > this.threshold && directionAllowed;
        };
        PanRecognizer.prototype.attributeTest = function (input) {
            this.movement = input.movement;
            if (input.movement) {
                var directionOK = this.directionTest(input);
                var began = (this.state & hammer_1.STATE_BEGAN) > 0;
                return _super.prototype.attributeTest.call(this, input) && (began || (!began && directionOK));
            }
            else {
                return true;
            }
        };
        PanRecognizer.prototype.emit = function () {
            if (this.movement) {
                this.manager.emit(this.eventName, this.movement);
            }
        };
        return PanRecognizer;
    })(attribute_1.ContinuousRecognizer);
    exports.PanRecognizer = PanRecognizer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('hammer/recognizers/tap',["require", "exports", '../hammer', '../utils'], function (require, exports, hammer_1, utils_1) {
    "use strict";
    function isCorrectTouchCount(input) {
        switch (input.eventType) {
            case hammer_1.INPUT_START:
                {
                    return input.touchesLength === 1;
                }
                break;
            case hammer_1.INPUT_MOVE:
                {
                    return input.touchesLength === 1;
                }
                break;
            case hammer_1.INPUT_END:
                {
                    return input.touchesLength === 0;
                }
                break;
            case hammer_1.INPUT_CANCEL:
                {
                    return true;
                }
                break;
            default: {
                throw new Error(hammer_1.decodeEventType(input.eventType));
            }
        }
    }
    var TapRecognizer = (function (_super) {
        __extends(TapRecognizer, _super);
        function TapRecognizer(eventName, enabled) {
            _super.call(this, eventName ? eventName : 'tap', enabled);
            this.count = 0;
            this.taps = 1;
            this.pointers = 1;
            this.time = 250;
            this.threshold = 6;
            this.interval = 300;
            this.posThreshold = 10;
        }
        TapRecognizer.prototype.getTouchAction = function () {
            return [hammer_1.TOUCH_ACTION_MANIPULATION];
        };
        TapRecognizer.prototype.process = function (input) {
            this.reset();
            if (!isCorrectTouchCount(input)) {
                return hammer_1.STATE_FAILED;
            }
            if ((input.eventType & hammer_1.INPUT_START) && (this.count === 0)) {
                this.center = input.center;
                return this.failTimeout();
            }
            if (input.distance >= this.threshold) {
                return hammer_1.STATE_FAILED;
            }
            if (input.deltaTime >= this.time) {
                return hammer_1.STATE_FAILED;
            }
            if (input.eventType !== hammer_1.INPUT_END) {
                this.center = input.center;
                return this.failTimeout();
            }
            else {
            }
            var validInterval = this.pTime ? (input.timeStamp - this.pTime < this.interval) : true;
            var validMultiTap = !this.pCenter || hammer_1.getDistance(this.pCenter, input.center) < this.posThreshold;
            this.pTime = input.timeStamp;
            this.pCenter = input.center;
            if (!validMultiTap || !validInterval) {
                this.count = 1;
            }
            else {
                this.count += 1;
            }
            var tapCount = this.count % this.taps;
            if (tapCount === 0) {
                if (!this.hasRequireFailures()) {
                    return hammer_1.STATE_RECOGNIZED;
                }
                else {
                    this._timer = utils_1.setTimeoutContext(function () {
                        this.state = hammer_1.STATE_RECOGNIZED;
                        this.tryEmit();
                    }, this.interval, this);
                    return hammer_1.STATE_BEGAN;
                }
            }
            return hammer_1.STATE_FAILED;
        };
        TapRecognizer.prototype.failTimeout = function () {
            this._timer = utils_1.setTimeoutContext(function () {
                this.state = hammer_1.STATE_FAILED;
            }, this.interval, this);
            return hammer_1.STATE_FAILED;
        };
        TapRecognizer.prototype.reset = function () {
            clearTimeout(this._timer);
        };
        TapRecognizer.prototype.emit = function () {
            if (this.state === hammer_1.STATE_RECOGNIZED) {
                this.manager.emit(this.eventName, this.center);
            }
        };
        return TapRecognizer;
    })(hammer_1.Recognizer);
    exports.TapRecognizer = TapRecognizer;
});

define('touch/touch',["require", "exports", '../hammer/hammer', '../hammer/recognizers/pan', '../hammer/recognizers/tap'], function (require, exports, hammer_1, pan_1, tap_1) {
    function touchManager(editor) {
        var target = editor.renderer.getMouseEventTarget();
        var manager = new hammer_1.Manager(target);
        manager.add(new pan_1.PanRecognizer('pan', true).setDirection(hammer_1.DIRECTION_VERTICAL).setThreshold(20));
        manager.add(new tap_1.TapRecognizer('tap', true));
        manager.on('pan', function (movement) {
            editor.renderer.scrollBy(-movement.x, -movement.y);
        });
        manager.on('tap', function (event) {
            var pos = editor.renderer.screenToTextCoordinates(event.clientX, event.clientY);
            pos.row = Math.max(0, Math.min(pos.row, editor.getSession().getLength() - 1));
            editor.moveCursorToPosition(pos);
            editor.renderer.scrollCursorIntoView();
            editor.focus();
        });
        return manager;
    }
    exports.touchManager = touchManager;
});

define('Tooltip',["require", "exports", "./lib/dom"], function (require, exports, dom_1) {
    "use strict";
    var Tooltip = (function () {
        function Tooltip(parentElement) {
            this.isOpen = false;
            this.$element = null;
            this.$parentElement = parentElement;
        }
        Tooltip.prototype.$init = function () {
            this.$element = dom_1.createElement('div');
            this.$element.className = "ace_tooltip";
            this.$element.style.display = "none";
            this.$parentElement.appendChild(this.$element);
            return this.$element;
        };
        Tooltip.prototype.getElement = function () {
            return this.$element || this.$init();
        };
        Tooltip.prototype.setText = function (text) {
            dom_1.setInnerText(this.getElement(), text);
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
            dom_1.addCssClass(this.getElement(), className);
        };
        Tooltip.prototype.show = function () {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Tooltip;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('Editor',["require", "exports", "./lib/oop", "./lib/dom", './lib/lang/createDelayedCall', "./lib/lang", "./lib/useragent", "./keyboard/KeyboardHandler", "./keyboard/KeyBinding", "./keyboard/TextInput", "./Search", "./Range", "./lib/EventEmitterClass", "./commands/CommandManager", "./commands/default_commands", "./config", "./TokenIterator", './editor_protocol', './editor_protocol', './editor_protocol', './editor_protocol', './Selection', './SnippetManager', "./lib/event", './touch/touch', "./Tooltip"], function (require, exports, oop_1, dom_1, createDelayedCall_1, lang_1, useragent_1, KeyboardHandler_1, KeyBinding_1, TextInput_1, Search_1, Range_1, EventEmitterClass_1, CommandManager_1, default_commands_1, config_1, TokenIterator_1, editor_protocol_1, editor_protocol_2, editor_protocol_3, editor_protocol_4, Selection_1, SnippetManager_1, event_1, touch_1, Tooltip_1) {
    "use strict";
    var search = new Search_1.default();
    function find(session, needle, dir) {
        search.$options.wrap = true;
        search.$options.needle = needle;
        search.$options.backwards = dir == -1;
        return search.find(session);
    }
    var Editor = (function () {
        function Editor(renderer, session) {
            var _this = this;
            this.completers = [];
            this.snippetManager = new SnippetManager_1.default();
            this.eventBus = new EventEmitterClass_1.default(this);
            this.curOp = null;
            this.prevOp = {};
            this.$mergeableCommands = [editor_protocol_2.COMMAND_NAME_BACKSPACE, editor_protocol_3.COMMAND_NAME_DEL, editor_protocol_4.COMMAND_NAME_INSERT_STRING];
            this.commands = new CommandManager_1.default(useragent_1.isMac ? "mac" : "win", default_commands_1.default);
            this.container = renderer.getContainerElement();
            this.renderer = renderer;
            this.textInput = new TextInput_1.default(renderer.getTextAreaContainer(), this);
            this.renderer.textarea = this.textInput.getElement();
            this.keyBinding = new KeyBinding_1.default(this);
            if (useragent_1.isMobile) {
                this.$touchHandler = touch_1.touchManager(this);
                this.$mouseHandler = new MouseHandler(this);
            }
            else {
                this.$touchHandler = touch_1.touchManager(this);
                this.$mouseHandler = new MouseHandler(this);
            }
            new FoldHandler(this);
            this.$blockScrolling = 0;
            this.$search = new Search_1.default().set({ wrap: true });
            this.$historyTracker = this.$historyTracker.bind(this);
            this.commands.on("exec", this.$historyTracker);
            this.$initOperationListeners();
            this._$emitInputEvent = createDelayedCall_1.default(function () {
                _this._signal("input", {});
                _this.session.bgTokenizer && _this.session.bgTokenizer.scheduleStart();
            });
            this.on("change", function () {
                _this._$emitInputEvent.schedule(31);
            });
            this.on("changeSession", function (e, editor) {
                var session = _this.session;
                if (session && !session.multiSelect) {
                    session.$selectionMarkers = [];
                    session.selection.$initRangeList();
                    session.multiSelect = session.selection;
                }
                _this.multiSelect = session && session.multiSelect;
                var onAddRange = function (event, selection) {
                    _this.addSelectionMarker(event.range);
                    _this.renderer.updateCursor();
                    _this.renderer.updateBackMarkers();
                };
                var onRemoveRange = function (event, selection) {
                    _this.removeSelectionMarkers(event.ranges);
                    _this.renderer.updateCursor();
                    _this.renderer.updateBackMarkers();
                };
                var keyboardMultiSelect = new KeyboardHandler_1.default([{
                        name: "singleSelection",
                        bindKey: "esc",
                        exec: function (editor) { editor.exitMultiSelectMode(); },
                        scrollIntoView: "cursor",
                        readOnly: true,
                        isAvailable: function (editor) { return editor && editor.inMultiSelectMode; }
                    }]);
                var onMultiSelect = function (unused, selection) {
                    if (_this.inMultiSelectMode) {
                        return;
                    }
                    _this.inMultiSelectMode = true;
                    _this.setStyle("ace_multiselect");
                    _this.keyBinding.addKeyboardHandler(keyboardMultiSelect);
                    _this.commands.setDefaultHandler("exec", onMultiSelectExec);
                    _this.renderer.updateCursor();
                    _this.renderer.updateBackMarkers();
                };
                var onSingleSelect = function (unused, selection) {
                    if (_this.session.multiSelect.inVirtualMode) {
                        return;
                    }
                    _this.inMultiSelectMode = false;
                    _this.unsetStyle("ace_multiselect");
                    _this.keyBinding.removeKeyboardHandler(keyboardMultiSelect);
                    _this.commands.removeDefaultHandler("exec", onMultiSelectExec);
                    _this.renderer.updateCursor();
                    _this.renderer.updateBackMarkers();
                    _this._emit("changeSelection");
                };
                var onMultiSelectExec = function (e) {
                    var command = e.command;
                    var editor = e.editor;
                    if (!editor.multiSelect)
                        return;
                    if (!command.multiSelectAction) {
                        var result = command.exec(editor, e.args || {});
                        editor.multiSelect.addRange(editor.multiSelect.toOrientedRange());
                        editor.multiSelect.mergeOverlappingRanges();
                    }
                    else if (command.multiSelectAction === "forEach") {
                        result = editor.forEachSelection(command.exec, e.args);
                    }
                    else if (command.multiSelectAction === "forEachLine") {
                        result = editor.forEachSelection(command.exec, e.args, { $byLines: true });
                    }
                    else if (command.multiSelectAction === "single") {
                        editor.exitMultiSelectMode();
                        result = command.exec(editor, e.args || {});
                    }
                    else {
                        if (typeof command.multiSelectAction === 'function') {
                            var action = command.multiSelectAction;
                            result = action(editor, e.args || {});
                        }
                        else {
                            throw new TypeError("multiSelectAction");
                        }
                    }
                    return result;
                };
                var checkMultiselectChange = function (unused, anchor) {
                    if (_this.inMultiSelectMode && !_this.inVirtualSelectionMode) {
                        var range = _this.multiSelect.ranges[0];
                        if (_this.multiSelect.isEmpty() && anchor == _this.multiSelect.anchor)
                            return;
                        var pos = anchor == _this.multiSelect.anchor
                            ? range.cursor == range.start ? range.end : range.start
                            : range.cursor;
                        if (pos.row != anchor.row
                            || _this.session.$clipPositionToDocument(pos.row, pos.column).column != anchor.column)
                            _this.multiSelect.toSingleRange(_this.multiSelect.toOrientedRange());
                    }
                };
                var oldSession = e.oldSession;
                if (oldSession) {
                    oldSession.multiSelect.off("addRange", onAddRange);
                    oldSession.multiSelect.off("removeRange", onRemoveRange);
                    oldSession.multiSelect.off("multiSelect", onMultiSelect);
                    oldSession.multiSelect.off("singleSelect", onSingleSelect);
                    oldSession.multiSelect.lead.off("change", checkMultiselectChange);
                    oldSession.multiSelect.anchor.off("change", checkMultiselectChange);
                }
                if (session) {
                    session.multiSelect.on("addRange", onAddRange);
                    session.multiSelect.on("removeRange", onRemoveRange);
                    session.multiSelect.on("multiSelect", onMultiSelect);
                    session.multiSelect.on("singleSelect", onSingleSelect);
                    session.multiSelect.lead.on("change", checkMultiselectChange);
                    session.multiSelect.anchor.on("change", checkMultiselectChange);
                }
                if (session && _this.inMultiSelectMode != session.selection.inMultiSelectMode) {
                    if (session.selection.inMultiSelectMode) {
                        onMultiSelect(void 0, session.selection);
                    }
                    else {
                        onSingleSelect(void 0, session.selection);
                    }
                }
            });
            this.setSession(session);
            config_1.resetOptions(this);
        }
        Editor.prototype.cancelMouseContextMenu = function () {
            this.$mouseHandler.cancelContextMenu();
        };
        Object.defineProperty(Editor.prototype, "selection", {
            get: function () {
                return this.session.getSelection();
            },
            set: function (selection) {
                this.session.setSelection(selection);
            },
            enumerable: true,
            configurable: true
        });
        Editor.prototype.addSelectionMarker = function (orientedRange) {
            if (!orientedRange.cursor) {
                orientedRange.cursor = orientedRange.end;
            }
            var style = this.getSelectionStyle();
            orientedRange.markerId = this.session.addMarker(orientedRange, "ace_selection", style);
            this.session.$selectionMarkers.push(orientedRange);
            this.session.selectionMarkerCount = this.session.$selectionMarkers.length;
            return orientedRange;
        };
        Editor.prototype.removeSelectionMarkers = function (ranges) {
            var markerList = this.session.$selectionMarkers;
            for (var i = ranges.length; i--;) {
                var range = ranges[i];
                if (!range.markerId) {
                    continue;
                }
                this.session.removeMarker(range.markerId);
                var index = markerList.indexOf(range);
                if (index !== -1) {
                    markerList.splice(index, 1);
                }
            }
            this.session.selectionMarkerCount = markerList.length;
        };
        Editor.prototype.forEachSelection = function (action, args, options) {
            if (this.inVirtualSelectionMode) {
                return;
            }
            var keepOrder = options && options.keepOrder;
            var $byLines = options && options.$byLines;
            var session = this.session;
            var selection = this.selection;
            var rangeList = selection.rangeList;
            var ranges = (keepOrder ? selection.ranges : rangeList.ranges);
            var result;
            if (!ranges.length) {
                return action(this, args || {});
            }
            var reg = selection._eventRegistry;
            selection._eventRegistry = {};
            var tmpSel = new Selection_1.default(session);
            this.inVirtualSelectionMode = true;
            for (var i = ranges.length; i--;) {
                if ($byLines) {
                    while (i > 0 && ranges[i].start.row == ranges[i - 1].end.row)
                        i--;
                }
                tmpSel.fromOrientedRange(ranges[i]);
                tmpSel.index = i;
                this.selection = session.selection = tmpSel;
                var actionResult = action(this, args || {});
                if (!result && actionResult !== undefined) {
                    result = actionResult;
                }
                tmpSel.toOrientedRange(ranges[i]);
            }
            tmpSel.detach();
            this.selection = session.selection = selection;
            this.inVirtualSelectionMode = false;
            selection._eventRegistry = reg;
            selection.mergeOverlappingRanges();
            var anim = this.renderer.$scrollAnimation;
            this.onCursorChange(void 0, this.session);
            this.onSelectionChange(void 0, this.selection);
            if (anim && anim.from === anim.to) {
                this.renderer.animateScrolling(anim.from);
            }
            return result;
        };
        Editor.prototype.selectMoreLines = function (dir, skip) {
            var range = this.selection.toOrientedRange();
            var isBackwards = range.cursor == range.end;
            var screenLead = this.session.documentToScreenPosition(range.cursor.row, range.cursor.column);
            if (this.selection.$desiredColumn)
                screenLead.column = this.selection.$desiredColumn;
            var lead = this.session.screenToDocumentPosition(screenLead.row + dir, screenLead.column);
            var anchor;
            if (!range.isEmpty()) {
                var row = isBackwards ? range.end.row : range.start.row;
                var column = isBackwards ? range.end.column : range.start.column;
                var screenAnchor = this.session.documentToScreenPosition(row, column);
                anchor = this.session.screenToDocumentPosition(screenAnchor.row + dir, screenAnchor.column);
            }
            else {
                anchor = lead;
            }
            var newRange;
            if (isBackwards) {
                newRange = Range_1.default.fromPoints(lead, anchor);
                newRange.cursor = newRange.start;
            }
            else {
                newRange = Range_1.default.fromPoints(anchor, lead);
                newRange.cursor = newRange.end;
            }
            newRange.desiredColumn = screenLead.column;
            if (!this.selection.inMultiSelectMode) {
                this.selection.addRange(range);
            }
            else {
                if (skip) {
                    var toRemove = range.cursor;
                }
            }
            this.selection.addRange(newRange);
            if (toRemove) {
                this.selection.substractPoint(toRemove);
            }
        };
        Editor.prototype.selectMore = function (dir, skip, stopAtFirst) {
            var session = this.session;
            var sel = session.multiSelect;
            var range = sel.toOrientedRange();
            if (range.isEmpty()) {
                range = session.getWordRange(range.start.row, range.start.column);
                range.cursor = dir === -1 ? range.start : range.end;
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
            if (skip) {
                this.multiSelect.substractPoint(range.cursor);
            }
        };
        Editor.prototype.alignCursors = function () {
            var session = this.session;
            var sel = session.multiSelect;
            var ranges = sel.ranges;
            var row = -1;
            var sameRowRanges = ranges.filter(function (r) {
                if (r.cursor.row == row)
                    return true;
                row = r.cursor.row;
            });
            if (!ranges.length || sameRowRanges.length === ranges.length - 1) {
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
                    if (fr < 0)
                        fr = 0;
                    if (lr >= max)
                        lr = max - 1;
                }
                var lines = this.session.removeFullLines(fr, lr);
                lines = this.$reAlignText(lines, guessRange);
                this.session.insert({ row: fr, column: 0 }, lines.join("\n") + "\n");
                if (!guessRange) {
                    range.start.column = 0;
                    range.end.column = lines[lines.length - 1].length;
                }
                this.selection.setRange(range);
            }
            else {
                sameRowRanges.forEach(function (r) {
                    sel.substractPoint(r.cursor);
                });
                var maxCol = 0;
                var minSpace = Infinity;
                var spaceOffsets = ranges.map(function (r) {
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
                ranges.forEach(function (r, i) {
                    var p = r.cursor;
                    var l = maxCol - p.column;
                    var d = spaceOffsets[i] - minSpace;
                    if (l > d)
                        session.insert(p, lang_1.stringRepeat(" ", l - d));
                    else
                        session.remove(new Range_1.default(p.row, p.column, p.row, p.column - l + d));
                    r.start.column = r.end.column = maxCol;
                    r.start.row = r.end.row = p.row;
                    r.cursor = r.end;
                });
                sel.fromOrientedRange(ranges[0]);
                this.renderer.updateCursor();
                this.renderer.updateBackMarkers();
            }
        };
        Editor.prototype.$reAlignText = function (lines, forceLeft) {
            var isLeftAligned = true;
            var isRightAligned = true;
            var startW;
            var textW;
            var endW;
            return lines.map(function (line) {
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
                return lang_1.stringRepeat(" ", n);
            }
            function alignLeft(m) {
                return !m[2] ? m[0] : spaces(startW) + m[2]
                    + spaces(textW - m[2].length + endW)
                    + m[4].replace(/^([=:])\s+/, "$1 ");
            }
            function alignRight(m) {
                return !m[2] ? m[0] : spaces(startW + textW - m[2].length) + m[2]
                    + spaces(endW)
                    + m[4].replace(/^([=:])\s+/, "$1 ");
            }
            function unAlign(m) {
                return !m[2] ? m[0] : spaces(startW) + m[2]
                    + spaces(endW)
                    + m[4].replace(/^([=:])\s+/, "$1 ");
            }
        };
        Editor.prototype.$initOperationListeners = function () {
            var _this = this;
            function last(a) { return a[a.length - 1]; }
            this.selections = [];
            this.commands.on("exec", function (e) {
                _this.startOperation(e);
                var command = e.command;
                if (command.aceCommandGroup === "fileJump") {
                    var prev = _this.prevOp;
                    if (!prev || prev.command.aceCommandGroup !== "fileJump") {
                        _this.lastFileJumpPos = last(_this.selections);
                    }
                }
                else {
                    _this.lastFileJumpPos = null;
                }
            }, true);
            this.commands.on("afterExec", function (e, cm) {
                var command = e.command;
                if (command.aceCommandGroup === "fileJump") {
                    if (_this.lastFileJumpPos && !_this.curOp.selectionChanged) {
                        _this.selection.fromJSON(_this.lastFileJumpPos);
                    }
                }
                _this.endOperation(e);
            }, true);
            this.$opResetTimer = createDelayedCall_1.default(this.endOperation.bind(this));
            this.eventBus.on("change", function () {
                _this.curOp || _this.startOperation();
                _this.curOp.docChanged = true;
            }, true);
            this.eventBus.on("changeSelection", function () {
                _this.curOp || _this.startOperation();
                _this.curOp.selectionChanged = true;
            }, true);
        };
        Editor.prototype.startOperation = function (commandEvent) {
            var _this = this;
            if (this.curOp) {
                if (!commandEvent || this.curOp.command)
                    return;
                this.prevOp = this.curOp;
            }
            if (!commandEvent) {
                this.previousCommand = null;
                commandEvent = {};
            }
            this.$opResetTimer.schedule();
            this.curOp = {
                command: commandEvent.command || {},
                args: commandEvent.args,
                scrollTop: this.renderer.scrollTop
            };
            var command = this.curOp.command;
            if (command && command.scrollIntoView) {
                this.$blockScrolling++;
            }
            this.selection.toJSON().forEach(function (range) {
                _this.selections.push(range);
            });
        };
        Editor.prototype.endOperation = function (unused) {
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
            if (e.command.name === editor_protocol_4.COMMAND_NAME_INSERT_STRING) {
                var text = e.args;
                if (this.mergeNextCommand === undefined)
                    this.mergeNextCommand = true;
                shouldMerge = shouldMerge
                    && this.mergeNextCommand
                    && (!/\s/.test(text) || /\s/.test(prev.args));
                this.mergeNextCommand = true;
            }
            else {
                shouldMerge = shouldMerge
                    && mergeableCommands.indexOf(e.command.name) !== -1;
            }
            if (this.$mergeUndoDeltas != "always"
                && Date.now() - this.sequenceStartTime > 2000) {
                shouldMerge = false;
            }
            if (shouldMerge)
                this.session.mergeUndoDeltas = true;
            else if (mergeableCommands.indexOf(e.command.name) !== -1)
                this.sequenceStartTime = Date.now();
        };
        Editor.prototype.setKeyboardHandler = function (keyboardHandler) {
            if (!keyboardHandler) {
                this.keyBinding.setKeyboardHandler(null);
            }
            else if (typeof keyboardHandler === "string") {
                this.$keybindingId = keyboardHandler;
                var _self = this;
                config_1.loadModule(["keybinding", keyboardHandler], function (module) {
                    if (_self.$keybindingId == keyboardHandler)
                        _self.keyBinding.setKeyboardHandler(module && module.handler);
                }, this.container.ownerDocument);
            }
            else {
                this.$keybindingId = null;
                this.keyBinding.setKeyboardHandler(keyboardHandler);
            }
        };
        Editor.prototype.getKeyboardHandler = function () {
            return this.keyBinding.getKeyboardHandler();
        };
        Editor.prototype.setSession = function (session) {
            if (this.session === session) {
                return;
            }
            var oldSession = this.session;
            if (oldSession) {
                this.session.off("change", this.$onDocumentChange);
                this.session.off("changeMode", this.$onChangeMode);
                this.session.off("tokenizerUpdate", this.$onTokenizerUpdate);
                this.session.off("changeTabSize", this.$onChangeTabSize);
                this.session.off("changeWrapLimit", this.$onChangeWrapLimit);
                this.session.off("changeWrapMode", this.$onChangeWrapMode);
                this.session.off("onChangeFold", this.$onChangeFold);
                this.session.off("changeFrontMarker", this.$onChangeFrontMarker);
                this.session.off("changeBackMarker", this.$onChangeBackMarker);
                this.session.off("changeBreakpoint", this.$onChangeBreakpoint);
                this.session.off("changeAnnotation", this.$onChangeAnnotation);
                this.session.off("changeOverwrite", this.$onCursorChange);
                this.session.off("changeScrollTop", this.$onScrollTopChange);
                this.session.off("changeScrollLeft", this.$onScrollLeftChange);
                var selection = this.session.getSelection();
                selection.off("changeCursor", this.$onCursorChange);
                selection.off("changeSelection", this.$onSelectionChange);
            }
            this.session = session;
            if (session) {
                this.$onDocumentChange = this.onDocumentChange.bind(this);
                session.on("change", this.$onDocumentChange);
                this.renderer.setSession(session);
                this.$onChangeMode = this.onChangeMode.bind(this);
                session.on("changeMode", this.$onChangeMode);
                this.$onTokenizerUpdate = this.onTokenizerUpdate.bind(this);
                session.on("tokenizerUpdate", this.$onTokenizerUpdate);
                this.$onChangeTabSize = this.renderer.onChangeTabSize.bind(this.renderer);
                session.on("changeTabSize", this.$onChangeTabSize);
                this.$onChangeWrapLimit = this.onChangeWrapLimit.bind(this);
                session.on("changeWrapLimit", this.$onChangeWrapLimit);
                this.$onChangeWrapMode = this.onChangeWrapMode.bind(this);
                session.on("changeWrapMode", this.$onChangeWrapMode);
                this.$onChangeFold = this.onChangeFold.bind(this);
                session.on("changeFold", this.$onChangeFold);
                this.$onChangeFrontMarker = this.onChangeFrontMarker.bind(this);
                session.on("changeFrontMarker", this.$onChangeFrontMarker);
                this.$onChangeBackMarker = this.onChangeBackMarker.bind(this);
                session.on("changeBackMarker", this.$onChangeBackMarker);
                this.$onChangeBreakpoint = this.onChangeBreakpoint.bind(this);
                session.on("changeBreakpoint", this.$onChangeBreakpoint);
                this.$onChangeAnnotation = this.onChangeAnnotation.bind(this);
                session.on("changeAnnotation", this.$onChangeAnnotation);
                this.$onCursorChange = this.onCursorChange.bind(this);
                session.on("changeOverwrite", this.$onCursorChange);
                this.$onScrollTopChange = this.onScrollTopChange.bind(this);
                session.on("changeScrollTop", this.$onScrollTopChange);
                this.$onScrollLeftChange = this.onScrollLeftChange.bind(this);
                session.on("changeScrollLeft", this.$onScrollLeftChange);
                this.selection = session.getSelection();
                this.selection.on("changeCursor", this.$onCursorChange);
                this.$onSelectionChange = this.onSelectionChange.bind(this);
                this.selection.on("changeSelection", this.$onSelectionChange);
                this.onChangeMode(void 0, this.session);
                this.$blockScrolling += 1;
                this.onCursorChange(void 0, this.session);
                this.$blockScrolling -= 1;
                this.onScrollTopChange(void 0, this.session);
                this.onScrollLeftChange(void 0, this.session);
                this.onSelectionChange(void 0, this.selection);
                this.onChangeFrontMarker(void 0, this.session);
                this.onChangeBackMarker(void 0, this.session);
                this.onChangeBreakpoint(void 0, this.session);
                this.onChangeAnnotation(void 0, this.session);
                session.getUseWrapMode() && this.renderer.adjustWrapLimit();
                this.renderer.updateFull();
            }
            var changeSessionEvent = { session: session, oldSession: oldSession };
            this.eventBus._signal("changeSession", changeSessionEvent);
            if (oldSession) {
                var changeEditorEvent = { oldEditor: this };
                oldSession._signal("changeEditor", changeEditorEvent);
            }
            if (session) {
                var changeEditorEvent = { editor: this };
                session._signal("changeEditor", changeEditorEvent);
            }
        };
        Editor.prototype.getSession = function () {
            return this.session;
        };
        Editor.prototype.setLanguageMode = function (mode) {
            return this.session.setLanguageMode(mode);
        };
        Editor.prototype.setPadding = function (padding) {
            return this.renderer.setPadding(padding);
        };
        Editor.prototype.setTabSize = function (tabSize) {
            return this.session.setTabSize(tabSize);
        };
        Editor.prototype.setThemeCss = function (themeId, href) {
            return this.renderer.setThemeCss(themeId, href);
        };
        Editor.prototype.setThemeDark = function (isDark) {
            return this.renderer.setThemeDark(isDark);
        };
        Editor.prototype.setValue = function (text, cursorPos) {
            if (this.session) {
                this.session.setValue(text);
            }
            else {
                console.warn("session is missing for Editor");
                return;
            }
            if (!cursorPos) {
                this.selectAll();
            }
            else if (cursorPos === +1) {
                this.navigateFileEnd();
            }
            else if (cursorPos === -1) {
                this.navigateFileStart();
            }
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
            return this.getOption("fontSize") || dom_1.computedStyle(this.container, "fontSize");
        };
        Editor.prototype.setFontSize = function (fontSize) {
            this.setOption("fontSize", fontSize);
        };
        Editor.prototype.insertSnippet = function (content, options) {
            return this.snippetManager.insertSnippet(this, content, options);
        };
        Editor.prototype.expandSnippet = function (options) {
            return this.snippetManager.expandWithTab(this, options);
        };
        Editor.prototype.$highlightBrackets = function () {
            if (this.session.$bracketHighlight) {
                this.session.removeMarker(this.session.$bracketHighlight);
                this.session.$bracketHighlight = void 0;
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
                    var range = new Range_1.default(pos.row, pos.column, pos.row, pos.column + 1);
                }
                else if (self.session.$mode && self.session.$mode.getMatching) {
                    var range = self.session.$mode.getMatching(self.session);
                }
                if (range) {
                    self.session.$bracketHighlight = self.session.addMarker(range, "ace_bracket", "text");
                }
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
                var iterator = new TokenIterator_1.default(self.session, pos.row, pos.column);
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
                            }
                            else if (prevToken.value === '</') {
                                depth--;
                            }
                        }
                    } while (token && depth >= 0);
                }
                else {
                    do {
                        token = prevToken;
                        prevToken = iterator.stepBackward();
                        if (token && token.value === tag && token.type.indexOf('tag-name') !== -1) {
                            if (prevToken.value === '<') {
                                depth++;
                            }
                            else if (prevToken.value === '</') {
                                depth--;
                            }
                        }
                    } while (prevToken && depth <= 0);
                    iterator.stepForward();
                }
                if (!token) {
                    session.removeMarker(session.$tagHighlight);
                    session.$tagHighlight = null;
                    return;
                }
                var row = iterator.getCurrentTokenRow();
                var column = iterator.getCurrentTokenColumn();
                var range = new Range_1.default(row, column, row, column + token.value.length);
                if (session.$tagHighlight && range.compareRange(session.$backMarkers[session.$tagHighlight].range) !== 0) {
                    session.removeMarker(session.$tagHighlight);
                    session.$tagHighlight = null;
                }
                if (range && !session.$tagHighlight)
                    session.$tagHighlight = session.addMarker(range, "ace_bracket", "text");
            }, 50);
        };
        Editor.prototype.focus = function () {
            var _this = this;
            setTimeout(function () { _this.textInput.focus(); });
            this.textInput.focus();
        };
        Editor.prototype.isFocused = function () {
            return this.textInput.isFocused();
        };
        Editor.prototype.blur = function () {
            this.textInput.blur();
        };
        Editor.prototype.onFocus = function () {
            if (this.$isFocused) {
                return;
            }
            this.$isFocused = true;
            this.renderer.showCursor();
            this.renderer.visualizeFocus();
            this.eventBus._emit("focus");
        };
        Editor.prototype.onBlur = function () {
            if (!this.$isFocused) {
                return;
            }
            this.$isFocused = false;
            this.renderer.hideCursor();
            this.renderer.visualizeBlur();
            this.eventBus._emit("blur");
        };
        Editor.prototype.$cursorChange = function () {
            this.renderer.updateCursor();
        };
        Editor.prototype.onDocumentChange = function (delta, session) {
            var wrap = this.session.$useWrapMode;
            var lastRow = (delta.start.row === delta.end.row ? delta.end.row : Infinity);
            this.renderer.updateLines(delta.start.row, lastRow, wrap);
            this.eventBus._signal("change", delta);
            this.$cursorChange();
            this.$updateHighlightActiveLine();
        };
        Editor.prototype.onTokenizerUpdate = function (event, session) {
            var rows = event.data;
            this.renderer.updateLines(rows.first, rows.last);
        };
        Editor.prototype.onScrollTopChange = function (event, session) {
            this.renderer.scrollToY(session.getScrollTop());
        };
        Editor.prototype.onScrollLeftChange = function (event, session) {
            this.renderer.scrollToX(session.getScrollLeft());
        };
        Editor.prototype.onCursorChange = function (event, session) {
            this.$cursorChange();
            if (!this.$blockScrolling) {
                this.renderer.scrollCursorIntoView();
            }
            this.$highlightBrackets();
            this.$highlightTags();
            this.$updateHighlightActiveLine();
            this.eventBus._signal("changeSelection");
        };
        Editor.prototype.$updateHighlightActiveLine = function () {
            var session = this.session;
            var renderer = this.renderer;
            var highlight;
            if (this.$highlightActiveLine) {
                if ((this.$selectionStyle !== "line" || !this.selection.isMultiLine())) {
                    highlight = this.getCursorPosition();
                }
                if (renderer.$maxLines && session.getLength() === 1 && !(renderer.$minLines > 1)) {
                    highlight = false;
                }
            }
            if (session.$highlightLineMarker && !highlight) {
                session.removeMarker(session.$highlightLineMarker.markerId);
                session.$highlightLineMarker = null;
            }
            else if (!session.$highlightLineMarker && highlight) {
                var range = new Range_1.default(highlight.row, highlight.column, highlight.row, Infinity);
                range.markerId = session.addMarker(range, "ace_active-line", "screenLine");
                session.$highlightLineMarker = range;
            }
            else if (highlight) {
                session.$highlightLineMarker.start.row = highlight.row;
                session.$highlightLineMarker.end.row = highlight.row;
                session.$highlightLineMarker.start.column = highlight.column;
                session._signal("changeBackMarker");
            }
        };
        Editor.prototype.onSelectionChange = function (unused, selection) {
            var session = this.session;
            if (typeof session.$selectionMarker === 'number') {
                session.removeMarker(session.$selectionMarker);
                session.$selectionMarker = null;
            }
            if (!this.selection.isEmpty()) {
                var range = this.selection.getRange();
                var style = this.getSelectionStyle();
                session.$selectionMarker = session.addMarker(range, "ace_selection", style);
            }
            else {
                this.$updateHighlightActiveLine();
            }
            var re = this.$highlightSelectedWord && this.$getSelectionHighLightRegexp();
            this.session.highlight(re);
            this.eventBus._signal("changeSelection");
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
            if ((startOuter >= 0 && /^[\w\d]/.test(needle)) ||
                (endOuter <= lineCols && /[\w\d]$/.test(needle)))
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
        Editor.prototype.onChangeFrontMarker = function (event, session) {
            this.updateFrontMarkers();
        };
        Editor.prototype.updateFrontMarkers = function () {
            this.renderer.updateFrontMarkers();
        };
        Editor.prototype.onChangeBackMarker = function (event, session) {
            this.renderer.updateBackMarkers();
        };
        Editor.prototype.updateBackMarkers = function () {
            this.renderer.updateBackMarkers();
        };
        Editor.prototype.onChangeBreakpoint = function (event, editSession) {
            this.renderer.updateBreakpoints();
            this.eventBus._emit("changeBreakpoint", event);
        };
        Editor.prototype.onChangeAnnotation = function (event, session) {
            this.renderer.setAnnotations(session.getAnnotations());
            this.eventBus._emit("changeAnnotation", event);
        };
        Editor.prototype.onChangeMode = function (event, session) {
            this.renderer.updateText();
            this.eventBus._emit("changeMode", event);
        };
        Editor.prototype.onChangeWrapLimit = function (event, session) {
            this.renderer.updateFull();
        };
        Editor.prototype.onChangeWrapMode = function (event, session) {
            this.renderer.onResize(true);
        };
        Editor.prototype.onChangeFold = function (event, session) {
            this.$updateHighlightActiveLine();
            this.renderer.updateFull();
        };
        Editor.prototype.getSelectedText = function () {
            return this.session.getTextRange(this.getSelectionRange());
        };
        Editor.prototype.getCopyText = function () {
            var text = this.getSelectedText();
            this.eventBus._signal("copy", text);
            return text;
        };
        Editor.prototype.onCopy = function () {
            var copyCommand = this.commands.getCommandByName("copy");
            if (copyCommand) {
                this.commands.exec(copyCommand, this);
            }
        };
        Editor.prototype.onCut = function () {
            var cutCommand = this.commands.getCommandByName("cut");
            if (cutCommand) {
                this.commands.exec(cutCommand, this);
            }
        };
        Editor.prototype.onPaste = function (text) {
            if (this.$readOnly)
                return;
            var e = { text: text };
            this.eventBus._signal("paste", e);
            this.insert(e.text, true);
        };
        Editor.prototype.execCommand = function (command, args) {
            this.commands.exec(command, this, args);
        };
        Editor.prototype.insert = function (text, pasted) {
            var session = this.session;
            var mode = session.getMode();
            var cursor = this.getCursorPosition();
            var transform;
            if (this.getBehavioursEnabled() && !pasted) {
                transform = mode && mode.transformAction(session.getState(cursor.row), 'insertion', this, session, text);
                if (transform) {
                    if (text !== transform.text) {
                        this.session.mergeUndoDeltas = false;
                        this.$mergeNextCommand = false;
                    }
                    text = transform.text;
                }
            }
            if (text === "\t") {
                text = this.session.getTabString();
            }
            if (!this.selection.isEmpty()) {
                var range = this.getSelectionRange();
                cursor = this.session.remove(range);
                this.clearSelection();
            }
            else if (this.session.getOverwrite()) {
                var range = Range_1.default.fromPoints(cursor, cursor);
                range.end.column += text.length;
                this.session.remove(range);
            }
            if (text === "\n" || text === "\r\n") {
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
                if (transform.selection.length === 2) {
                    this.selection.setSelectionRange(new Range_1.default(cursor.row, start + transform.selection[0], cursor.row, start + transform.selection[1]));
                }
                else {
                    this.selection.setSelectionRange(new Range_1.default(cursor.row + transform.selection[0], transform.selection[1], cursor.row + transform.selection[2], transform.selection[3]));
                }
            }
            if (session.getDocument().isNewLine(text)) {
                var lineIndent = mode.getNextLineIndent(lineState, line.slice(0, cursor.column), session.getTabString());
                session.insert({ row: cursor.row + 1, column: 0 }, lineIndent);
            }
            if (shouldOutdent) {
                mode.autoOutdent(lineState, session, cursor.row);
            }
        };
        Editor.prototype.on = function (eventName, callback, capturing) {
            this.eventBus.on(eventName, callback, capturing);
        };
        Editor.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        Editor.prototype.setDefaultHandler = function (eventName, callback) {
            this.eventBus.setDefaultHandler(eventName, callback);
        };
        Editor.prototype._emit = function (eventName, event) {
            this.eventBus._emit(eventName, event);
        };
        Editor.prototype._signal = function (eventName, event) {
            this.eventBus._signal(eventName, event);
        };
        Editor.prototype.hasListeners = function (eventName) {
            return this.eventBus.hasListeners(eventName);
        };
        Editor.prototype.onTextInput = function (text) {
            this.keyBinding.onTextInput(text);
            if (text === '.') {
                var command = this.commands.getCommandByName(editor_protocol_1.COMMAND_NAME_AUTO_COMPLETE);
                if (command) {
                    this.commands.exec(command, this);
                }
            }
            else if (this.getSession().getDocument().isNewLine(text)) {
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
        Editor.prototype.setSelectionStyle = function (selectionStyle) {
            this.setOption("selectionStyle", selectionStyle);
        };
        Editor.prototype.getSelectionStyle = function () {
            return this.getOption("selectionStyle");
        };
        Editor.prototype.setHighlightActiveLine = function (highlightActiveLine) {
            this.setOption("highlightActiveLine", highlightActiveLine);
        };
        Editor.prototype.getHighlightActiveLine = function () {
            return this.getOption("highlightActiveLine");
        };
        Editor.prototype.setHighlightGutterLine = function (highlightGutterLine) {
            this.setOption("highlightGutterLine", highlightGutterLine);
        };
        Editor.prototype.getHighlightGutterLine = function () {
            return this.getOption("highlightGutterLine");
        };
        Editor.prototype.setHighlightSelectedWord = function (highlightSelectedWord) {
            this.setOption("highlightSelectedWord", highlightSelectedWord);
        };
        Editor.prototype.getHighlightSelectedWord = function () {
            return this.$highlightSelectedWord;
        };
        Editor.prototype.setAnimatedScroll = function (animatedScroll) {
            this.renderer.setAnimatedScroll(animatedScroll);
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
        Editor.prototype.setPrintMarginColumn = function (printMarginColumn) {
            this.renderer.setPrintMarginColumn(printMarginColumn);
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
        Editor.prototype.setBehavioursEnabled = function (behavioursEnabled) {
            this.setOption("behavioursEnabled", behavioursEnabled);
        };
        Editor.prototype.getBehavioursEnabled = function () {
            return this.getOption("behavioursEnabled");
        };
        Editor.prototype.setWrapBehavioursEnabled = function (wrapBehavioursEnabled) {
            this.setOption("wrapBehavioursEnabled", wrapBehavioursEnabled);
        };
        Editor.prototype.getWrapBehavioursEnabled = function () {
            return this.getOption("wrapBehavioursEnabled");
        };
        Editor.prototype.setShowFoldWidgets = function (showFoldWidgets) {
            this.setOption("showFoldWidgets", showFoldWidgets);
        };
        Editor.prototype.getShowFoldWidgets = function () {
            return this.getOption("showFoldWidgets");
        };
        Editor.prototype.setFadeFoldWidgets = function (fadeFoldWidgets) {
            this.setOption("fadeFoldWidgets", fadeFoldWidgets);
        };
        Editor.prototype.getFadeFoldWidgets = function () {
            return this.getOption("fadeFoldWidgets");
        };
        Editor.prototype.remove = function (direction) {
            if (this.selection.isEmpty()) {
                if (direction === "left")
                    this.selection.selectLeft();
                else
                    this.selection.selectRight();
            }
            var selectionRange = this.getSelectionRange();
            if (this.getBehavioursEnabled()) {
                var session = this.session;
                var state = session.getState(selectionRange.start.row);
                var newRange = session.getMode().transformAction(state, 'deletion', this, session, selectionRange);
                if (selectionRange.end.column === 0) {
                    var text = session.getTextRange(selectionRange);
                    if (text[text.length - 1] === "\n") {
                        var line = session.getLine(selectionRange.end.row);
                        if (/^\s+$/.test(line)) {
                            selectionRange.end.column = line.length;
                        }
                    }
                }
                if (newRange) {
                    selectionRange = newRange;
                }
            }
            this.session.remove(selectionRange);
            this.clearSelection();
        };
        Editor.prototype.removeWordRight = function () {
            if (this.selection.isEmpty()) {
                this.selection.selectWordRight();
            }
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
            if (range.start.column === range.end.column && range.start.row === range.end.row) {
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
            this.insert("\n", false);
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
                range = new Range_1.default(cursor.row, column - 1, cursor.row, column + 1);
            }
            else {
                swap = line.charAt(column - 1) + line.charAt(column - 2);
                range = new Range_1.default(cursor.row, column - 2, cursor.row, column);
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
            }
            else if (range.start.column < range.end.column) {
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
                var indentString = lang_1.stringRepeat(" ", count);
            }
            else {
                var count = column % size;
                while (line[range.start.column] === " " && count) {
                    range.start.column--;
                    count--;
                }
                this.selection.setSelectionRange(range);
                indentString = "\t";
            }
            return this.insert(indentString, false);
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
            var deleteRange = new Range_1.default(0, 0, 0, 0);
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
                    var retval = {
                        value: m[0],
                        start: m.index,
                        end: m.index + m[0].length
                    };
                    return retval;
                }
            }
            return null;
        };
        Editor.prototype.modifyNumber = function (amount) {
            var row = this.selection.getCursor().row;
            var column = this.selection.getCursor().column;
            var charRange = new Range_1.default(row, column - 1, row, column);
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
                    }
                    else {
                        amount *= Math.pow(10, nr.end - column);
                    }
                    t += amount;
                    t /= Math.pow(10, decimals);
                    var nnr = t.toFixed(decimals);
                    var replaceRange = new Range_1.default(row, nr.start, row, nr.end);
                    this.session.replace(replaceRange, nnr);
                    this.moveCursorTo(row, Math.max(nr.start + 1, column + nnr.length - nr.value.length));
                }
            }
        };
        Editor.prototype.removeLines = function () {
            var rows = this.$getSelectedRows();
            var range;
            if (rows.first === 0 || rows.last + 1 < this.session.getLength())
                range = new Range_1.default(rows.first, 0, rows.last + 1, 0);
            else
                range = new Range_1.default(rows.first - 1, this.session.getLine(rows.first - 1).length, rows.last, this.session.getLine(rows.last).length);
            this.session.remove(range);
            this.clearSelection();
        };
        Editor.prototype.duplicateSelection = function () {
            var selection = this.selection;
            var session = this.session;
            var range = selection.getRange();
            var reverse = selection.isBackwards();
            if (range.isEmpty()) {
                var row = range.start.row;
                session.duplicateLines(row, row);
            }
            else {
                var point = reverse ? range.start : range.end;
                var endPoint = session.insert(point, session.getTextRange(range));
                range.start = point;
                range.end = endPoint;
                selection.setSelectionRange(range, reverse);
            }
        };
        Editor.prototype.moveLinesDown = function () {
            var _this = this;
            this.$moveLines(function (firstRow, lastRow) {
                return _this.session.moveLinesDown(firstRow, lastRow);
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
                var selectedRows = this.$getSelectedRows();
                var linesMoved = mover.call(this, selectedRows.first, selectedRows.last);
                range.moveBy(linesMoved, 0);
                selection.fromOrientedRange(range);
            }
            else {
                var ranges = selection.rangeList.ranges;
                selection.rangeList.detach();
                for (var i = ranges.length; i--;) {
                    var rangeIndex = i;
                    var collapsedRows = ranges[i].collapseRows();
                    var last = collapsedRows.end.row;
                    var first = collapsedRows.start.row;
                    while (i--) {
                        collapsedRows = ranges[i].collapseRows();
                        if (first - collapsedRows.end.row <= 1)
                            first = collapsedRows.end.row;
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
        Editor.prototype.$moveByPage = function (direction, select) {
            var renderer = this.renderer;
            var config = this.renderer.layerConfig;
            var rows = direction * Math.floor(config.height / config.lineHeight);
            this.$blockScrolling++;
            if (select === true) {
                this.selection.$moveSelection(function () {
                    this.moveCursorBy(rows, 0);
                });
            }
            else if (select === false) {
                this.selection.moveCursorBy(rows, 0);
                this.selection.clearSelection();
            }
            this.$blockScrolling--;
            var scrollTop = renderer.scrollTop;
            renderer.scrollBy(0, rows * config.lineHeight);
            if (select != null) {
                renderer.scrollCursorIntoView(null, 0.5);
            }
            renderer.animateScrolling(scrollTop);
        };
        Editor.prototype.selectPageDown = function () {
            this.$moveByPage(+1, true);
        };
        Editor.prototype.selectPageUp = function () {
            this.$moveByPage(-1, true);
        };
        Editor.prototype.gotoPageDown = function () {
            this.$moveByPage(+1, false);
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
        Editor.prototype.moveCursorToPosition = function (position) {
            return this.selection.moveCursorToPosition(position);
        };
        Editor.prototype.jumpToMatching = function (select) {
            var cursor = this.getCursorPosition();
            var iterator = new TokenIterator_1.default(this.session, cursor.row, cursor.column);
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
                }
                else if (token && token.type.indexOf('tag-name') !== -1) {
                    if (isNaN(depth[token.value])) {
                        depth[token.value] = 0;
                    }
                    if (prevToken.value === '<') {
                        depth[token.value]++;
                    }
                    else if (prevToken.value === '</') {
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
            } while (token && !found);
            if (!matchType) {
                return;
            }
            var range;
            if (matchType === 'bracket') {
                range = this.session.getBracketRange(cursor);
                if (!range) {
                    range = new Range_1.default(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + i - 1, iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() + i - 1);
                    if (!range)
                        return;
                    var pos = range.start;
                    if (pos.row === cursor.row && Math.abs(pos.column - cursor.column) < 2)
                        range = this.session.getBracketRange(pos);
                }
            }
            else if (matchType === 'tag') {
                if (token && token.type.indexOf('tag-name') !== -1)
                    var tag = token.value;
                else
                    return;
                var range = new Range_1.default(iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() - 2, iterator.getCurrentTokenRow(), iterator.getCurrentTokenColumn() - 2);
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
                                }
                                else if (prevToken.value === '</') {
                                    depth[tag]--;
                                }
                                if (depth[tag] === 0)
                                    found = true;
                            }
                        }
                    } while (prevToken && !found);
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
                }
                else {
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
            if (!this.isRowFullyVisible(lineNumber - 1)) {
                this.scrollToLine(lineNumber - 1, true, animate);
            }
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
            }
            else {
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
            }
            else {
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
            }
            else {
                return null;
            }
        };
        Editor.prototype.getLastSearchOptions = function () {
            return this.$search.getOptions();
        };
        Editor.prototype.findAll = function (needle, options, additive) {
            if (options === void 0) { options = {}; }
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
            for (var i = ranges.length; i--;)
                selection.addRange(ranges[i], true);
            if (range && selection.rangeList.rangeAtPoint(range.start)) {
                selection.addRange(range, true);
            }
            this.$blockScrolling -= 1;
            return ranges.length;
        };
        ;
        Editor.prototype.find = function (needle, options, animate) {
            if (options === void 0) { options = {}; }
            if (typeof needle === "string" || needle instanceof RegExp) {
                options.needle = needle;
            }
            else if (typeof needle == "object") {
                oop_1.mixin(options, needle);
            }
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
            if (!options.start) {
                this.$search.set({ start: range.start });
            }
            var newRange = this.$search.find(this.session);
            if (options.preventScroll) {
                return newRange;
            }
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
        Editor.prototype.findNext = function (needle, animate) {
            this.find(needle, { skipCurrent: true, backwards: false }, animate);
        };
        Editor.prototype.findPrevious = function (needle, animate) {
            this.find(needle, { skipCurrent: true, backwards: true }, animate);
        };
        Editor.prototype.revealRange = function (range, animate) {
            this.$blockScrolling += 1;
            this.session.unfold(range);
            this.selection.setSelectionRange(range);
            this.$blockScrolling -= 1;
            var scrollTop = this.renderer.scrollTop;
            this.renderer.scrollSelectionIntoView(range.start, range.end, 0.5);
            if (animate !== false) {
                this.renderer.animateScrolling(scrollTop);
            }
        };
        Editor.prototype.undo = function () {
            this.$blockScrolling++;
            this.session.getUndoManager().undo();
            this.$blockScrolling--;
            this.renderer.scrollCursorIntoView(void 0, 0.5);
        };
        Editor.prototype.redo = function () {
            this.$blockScrolling++;
            this.session.getUndoManager().redo();
            this.$blockScrolling--;
            this.renderer.scrollCursorIntoView(void 0, 0.5);
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
                    }
                    else if (pos.top < config.height &&
                        pos.top + rect.top + config.lineHeight > window.innerHeight) {
                        shouldScroll = false;
                    }
                    else {
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
            if (!cursorLayer) {
                return;
            }
            cursorLayer.setSmoothBlinking(/smooth/.test(style));
            cursorLayer.isBlinking = !this.$readOnly && style !== "wide";
            cursorLayer.setCssClass("ace_slim-cursors", /slim/.test(style));
        };
        return Editor;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Editor;
    config_1.defineOptions(Editor.prototype, "editor", {
        selectionStyle: {
            set: function (style) {
                var that = this;
                that.$onSelectionChange(void 0, that.selection);
                that._signal("changeSelectionStyle", { data: style });
            },
            initialValue: "line"
        },
        highlightActiveLine: {
            set: function () {
                var that = this;
                that.$updateHighlightActiveLine();
            },
            initialValue: true
        },
        highlightSelectedWord: {
            set: function (shouldHighlight) {
                var that = this;
                that.$onSelectionChange(void 0, that.selection);
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
                var that = this;
                that.$resetCursorStyle();
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
            set: function (enable) {
                var that = this;
                that.setAutoScrollEditorIntoView(enable);
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
                var session = editor.getSession();
                var fold = session.getFoldAt(position.row, position.column, 1);
                if (fold) {
                    if (e.getAccelKey()) {
                        session.removeFold(fold);
                    }
                    else {
                        session.expandFold(fold);
                    }
                    e.stop();
                }
                else {
                }
            });
            editor.on('gutterclick', function (e) {
                var gutterRegion = editor.renderer.$gutterLayer.getRegion(e);
                if (gutterRegion === 'foldWidgets') {
                    var row = e.getDocumentPosition().row;
                    var session = editor.getSession();
                    if (session['foldWidgets'] && session['foldWidgets'][row]) {
                        session['onFoldWidgetClick'](row, e);
                    }
                    if (!editor.isFocused()) {
                        editor.focus();
                    }
                    e.stop();
                }
            });
            editor.on('gutterdblclick', function (e) {
                var gutterRegion = editor.renderer.$gutterLayer.getRegion(e);
                if (gutterRegion == 'foldWidgets') {
                    var row = e.getDocumentPosition().row;
                    var session = editor.getSession();
                    var data = session['getParentFoldRangeData'](row, true);
                    var range = data.range || data.firstRange;
                    if (range) {
                        row = range.start.row;
                        var fold = session.getFoldAt(row, session.getLine(row).length, 1);
                        if (fold) {
                            session.removeFold(fold);
                        }
                        else {
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
            this.$tooltipFollowsMouse = true;
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
            new GutterHandler(this);
            var onMouseDown = function (e) {
                if (!editor.isFocused() && editor.textInput) {
                    editor.textInput.moveToMouse(e);
                }
                editor.focus();
            };
            var mouseTarget = editor.renderer.getMouseEventTarget();
            event_1.addListener(mouseTarget, "click", this.onMouseEvent.bind(this, "click"));
            event_1.addListener(mouseTarget, "mousemove", this.onMouseMove.bind(this, "mousemove"));
            event_1.addMultiMouseDownListener(mouseTarget, [400, 300, 250], this, "onMouseEvent");
            if (editor.renderer.scrollBarV) {
                event_1.addMultiMouseDownListener(editor.renderer.scrollBarV.inner, [400, 300, 250], this, "onMouseEvent");
                event_1.addMultiMouseDownListener(editor.renderer.scrollBarH.inner, [400, 300, 250], this, "onMouseEvent");
                if (useragent_1.isIE) {
                    event_1.addListener(editor.renderer.scrollBarV.element, "mousedown", onMouseDown);
                    event_1.addListener(editor.renderer.scrollBarH.element, "mousemove", onMouseDown);
                }
            }
            event_1.addMouseWheelListener(editor.container, this.emitEditorMouseWheelEvent.bind(this, "mousewheel"));
            var gutterEl = editor.renderer.$gutter;
            event_1.addListener(gutterEl, "mousedown", this.onMouseEvent.bind(this, "guttermousedown"));
            event_1.addListener(gutterEl, "click", this.onMouseEvent.bind(this, "gutterclick"));
            event_1.addListener(gutterEl, "dblclick", this.onMouseEvent.bind(this, "gutterdblclick"));
            event_1.addListener(gutterEl, "mousemove", this.onMouseEvent.bind(this, "guttermousemove"));
            event_1.addListener(mouseTarget, "mousedown", onMouseDown);
            event_1.addListener(gutterEl, "mousedown", function (e) {
                editor.focus();
                return event_1.preventDefault(e);
            });
            editor.on('mousemove', function (e) {
                if (_self.state || _self.$dragDelay || !_self.$dragEnabled) {
                    return;
                }
                var char = editor.renderer.screenToTextCoordinates(e.x, e.y);
                var range = editor.getSession().getSelection().getRange();
                var renderer = editor.renderer;
                if (!range.isEmpty() && range.insideStart(char.row, char.column)) {
                    renderer.setCursorStyle('default');
                }
                else {
                    renderer.setCursorStyle("");
                }
            });
        }
        MouseHandler.prototype.onMouseEvent = function (name, e) {
            this.editor._emit(name, new EditorMouseEvent(e, this.editor));
        };
        MouseHandler.prototype.onMouseMove = function (name, e) {
            if (this.editor.hasListeners('mousemove')) {
                this.editor._emit(name, new EditorMouseEvent(e, this.editor));
            }
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
            return this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
        };
        MouseHandler.prototype.captureMouse = function (ev, mouseMoveHandler) {
            this.clientX = ev.clientX;
            this.clientY = ev.clientY;
            this.isMousePressed = true;
            var renderer = this.editor.renderer;
            if (renderer.$keepTextAreaAtCursor) {
                renderer.$keepTextAreaAtCursor = null;
            }
            var onMouseMove = (function (editor, mouseHandler) {
                return function (mouseEvent) {
                    if (!mouseEvent)
                        return;
                    if (useragent_1.isWebKit && !mouseEvent.which && mouseHandler.releaseMouse) {
                        return mouseHandler.releaseMouse(undefined);
                    }
                    mouseHandler.clientX = mouseEvent.clientX;
                    mouseHandler.clientY = mouseEvent.clientY;
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
            if (useragent_1.isOldIE && ev.domEvent.type == "dblclick") {
                return setTimeout(function () { onCaptureEnd(ev); });
            }
            this.$onCaptureMouseMove = onMouseMove;
            this.releaseMouse = event_1.capture(this.editor.container, onMouseMove, onCaptureEnd);
            var timerId = setInterval(onCaptureInterval, 20);
        };
        MouseHandler.prototype.cancelContextMenu = function () {
            var stop = function (e) {
                if (e && e.domEvent && e.domEvent.type != "contextmenu") {
                    return;
                }
                this.editor.off("nativecontextmenu", stop);
                if (e && e.domEvent) {
                    event_1.stopEvent(e.domEvent);
                }
            }.bind(this);
            setTimeout(stop, 10);
            this.editor.on("nativecontextmenu", stop);
        };
        MouseHandler.prototype.select = function () {
            var anchor;
            var cursor = this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
            if (this.$clickSelection) {
                var cmp = this.$clickSelection.comparePoint(cursor);
                if (cmp == -1) {
                    anchor = this.$clickSelection.end;
                }
                else if (cmp == 1) {
                    anchor = this.$clickSelection.start;
                }
                else {
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
            if (this.editor.renderer.scroller['releaseCapture']) {
                this.editor.renderer.scroller['releaseCapture']();
            }
        };
        MouseHandler.prototype.startSelect = function (pos, waitForClickSelection) {
            pos = pos || this.editor.renderer.screenToTextCoordinates(this.clientX, this.clientY);
            var editor = this.editor;
            if (this.mousedownEvent.getShiftKey()) {
                editor.selection.selectToPosition(pos);
            }
            else if (!waitForClickSelection) {
                editor.selection.moveToPosition(pos);
            }
            if (!waitForClickSelection) {
                this.select();
            }
            if (this.editor.renderer.scroller['setCapture']) {
                this.editor.renderer.scroller['setCapture']();
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
            var distance = calcDistance(this.mousedownEvent.clientX, this.mousedownEvent.clientY, this.clientX, this.clientY);
            var time = Date.now();
            if (distance > DRAG_OFFSET || time - this.mousedownEvent.time > this.$focusTimout) {
                this.startSelect(this.mousedownEvent.getDocumentPosition());
            }
        };
        return MouseHandler;
    })();
    config_1.defineOptions(MouseHandler.prototype, "mouseHandler", {
        scrollSpeed: { initialValue: 2 },
        dragDelay: { initialValue: (useragent_1.isMac ? 150 : 0) },
        dragEnabled: { initialValue: true },
        focusTimout: { initialValue: 0 },
        tooltipFollowsMouse: { initialValue: true }
    });
    var EditorMouseEvent = (function () {
        function EditorMouseEvent(domEvent, editor) {
            this.propagationStopped = false;
            this.defaultPrevented = false;
            this.getAccelKey = useragent_1.isMac ? function () { return this.domEvent.metaKey; } : function () { return this.domEvent.ctrlKey; };
            this.domEvent = domEvent;
            this.editor = editor;
            this.clientX = domEvent.clientX;
            this.clientY = domEvent.clientY;
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
            event_1.stopPropagation(this.domEvent);
            this.propagationStopped = true;
        };
        EditorMouseEvent.prototype.preventDefault = function () {
            event_1.preventDefault(this.domEvent);
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
            return event_1.getButton(this.domEvent);
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
            var session = editor.getSession();
            var range = session.getBracketRange(pos);
            if (range) {
                if (range.isEmpty()) {
                    range.start.column--;
                    range.end.column++;
                }
                mouseHandler.setState("select");
            }
            else {
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
            }
            else {
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
                }
                else if (cmpEnd == 1 && cmpStart >= 0) {
                    anchor = mouseHandler.$clickSelection.start;
                    if (range.start.row != cursor.row || range.start.column != cursor.column)
                        cursor = range.end;
                }
                else if (cmpStart == -1 && cmpEnd == 1) {
                    cursor = range.end;
                    anchor = range.start;
                }
                else {
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
        }
        else if (range.start.row == range.end.row - 1 && !range.start.column && !range.end.column) {
            var cmp = cursor.column - 4;
        }
        else {
            var cmp = 2 * cursor.row - range.start.row - range.end.row;
        }
        if (cmp < 0) {
            return { cursor: range.start, anchor: range.end };
        }
        else {
            return { cursor: range.end, anchor: range.start };
        }
    }
    var GutterHandler = (function () {
        function GutterHandler(mouseHandler) {
            var editor = mouseHandler.editor;
            var gutter = editor.renderer.$gutterLayer;
            var tooltip = new GutterTooltip(editor.container);
            mouseHandler.editor.setDefaultHandler("guttermousedown", function (e) {
                if (!editor.isFocused() || e.getButton() != 0) {
                    return;
                }
                var gutterRegion = gutter.getRegion(e);
                if (gutterRegion === "foldWidgets") {
                    return;
                }
                var row = e.getDocumentPosition().row;
                var selection = editor.getSession().getSelection();
                if (e.getShiftKey()) {
                    selection.selectTo(row, 0);
                }
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
            var tooltipTimeout;
            var mouseEvent;
            var tooltipAnnotation;
            function showTooltip() {
                var row = mouseEvent.getDocumentPosition().row;
                var annotation = gutter.$annotations[row];
                if (!annotation) {
                    return hideTooltip(void 0, editor);
                }
                var session = editor.getSession();
                var maxRow = session.getLength();
                if (row == maxRow) {
                    var screenRow = editor.renderer.pixelToScreenCoordinates(0, mouseEvent.clientY).row;
                    var pos = mouseEvent.getDocumentPosition();
                    if (screenRow > session.documentToScreenRow(pos.row, pos.column)) {
                        return hideTooltip(void 0, editor);
                    }
                }
                if (tooltipAnnotation == annotation) {
                    return;
                }
                tooltipAnnotation = annotation.text.join("<br/>");
                tooltip.setHtml(tooltipAnnotation);
                tooltip.show();
                editor.on("mousewheel", hideTooltip);
                if (mouseHandler.$tooltipFollowsMouse) {
                    moveTooltip(mouseEvent);
                }
                else {
                    var gutterElement = gutter.$cells[editor.getSession().documentToScreenRow(row, 0)].element;
                    var rect = gutterElement.getBoundingClientRect();
                    var style = tooltip.getElement().style;
                    style.left = rect.right + "px";
                    style.top = rect.bottom + "px";
                }
            }
            function hideTooltip(event, editor) {
                if (tooltipTimeout) {
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = undefined;
                }
                if (tooltipAnnotation) {
                    tooltip.hide();
                    tooltipAnnotation = null;
                    editor.off("mousewheel", hideTooltip);
                }
            }
            function moveTooltip(event) {
                tooltip.setPosition(event.clientX, event.clientY);
            }
            mouseHandler.editor.setDefaultHandler("guttermousemove", function (e) {
                var target = e.domEvent.target || e.domEvent.srcElement;
                if (dom_1.hasCssClass(target, "ace_fold-widget")) {
                    return hideTooltip(void 0, editor);
                }
                if (tooltipAnnotation && mouseHandler.$tooltipFollowsMouse) {
                    moveTooltip(e);
                }
                mouseEvent = e;
                if (tooltipTimeout) {
                    return;
                }
                tooltipTimeout = setTimeout(function () {
                    tooltipTimeout = null;
                    if (mouseEvent && !mouseHandler.isMousePressed)
                        showTooltip();
                    else
                        hideTooltip(void 0, editor);
                }, 50);
            });
            event_1.addListener(editor.renderer.$gutter, "mouseout", function (e) {
                mouseEvent = null;
                if (!tooltipAnnotation || tooltipTimeout)
                    return;
                tooltipTimeout = setTimeout(function () {
                    tooltipTimeout = null;
                    hideTooltip(void 0, editor);
                }, 50);
            });
            editor.on("changeSession", hideTooltip);
        }
        return GutterHandler;
    })();
    var GutterTooltip = (function (_super) {
        __extends(GutterTooltip, _super);
        function GutterTooltip(parent) {
            _super.call(this, parent);
        }
        GutterTooltip.prototype.setPosition = function (x, y) {
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
            _super.prototype.setPosition.call(this, x, y);
        };
        return GutterTooltip;
    })(Tooltip_1.default);
    function addAltCursorListeners(editor) {
        var el = editor.textInput.getElement();
        var altCursor = false;
        event_1.addListener(el, "keydown", function (e) {
            var altDown = e.keyCode == 18 && !(e.ctrlKey || e.shiftKey || e.metaKey);
            if (editor.$blockSelectEnabled && altDown) {
                if (!altCursor) {
                    editor.renderer.setMouseCursor("crosshair");
                    altCursor = true;
                }
            }
            else if (altCursor) {
                reset();
            }
        });
        event_1.addListener(el, "keyup", reset);
        event_1.addListener(el, "blur", reset);
        function reset() {
            if (altCursor) {
                editor.renderer.setMouseCursor("");
                altCursor = false;
            }
        }
    }
});

define('createEditor',["require", "exports", './Editor'], function (require, exports, Editor_1) {
    function createEditor(renderer, session) {
        return new Editor_1.default(renderer, session);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createEditor;
});

define('FoldLine',["require", "exports", "./Range"], function (require, exports, Range_1) {
    "use strict";
    var FoldLine = (function () {
        function FoldLine(foldData, folds) {
            this.foldData = foldData;
            if (Array.isArray(folds)) {
                this.folds = folds;
            }
            else {
                throw new Error("folds must have type Fold[]");
            }
            var last = folds[folds.length - 1];
            this.range = new Range_1.default(folds[0].start.row, folds[0].start.column, last.end.row, last.end.column);
            this.start = this.range.start;
            this.end = this.range.end;
            this.folds.forEach(function (fold) {
                fold.setFoldLine(this);
            }, this);
        }
        FoldLine.prototype.shiftRow = function (shift) {
            this.start.row += shift;
            this.end.row += shift;
            this.folds.forEach(function (fold) {
                fold.start.row += shift;
                fold.end.row += shift;
            });
        };
        FoldLine.prototype.addFold = function (fold) {
            if (fold.sameRow) {
                if (fold.start.row < this.startRow || fold.endRow > this.endRow) {
                    throw new Error("Can't add a fold to this FoldLine as it has no connection");
                }
                this.folds.push(fold);
                this.folds.sort(function (a, b) {
                    return -a.range.compareEnd(b.start.row, b.start.column);
                });
                if (this.range.compareEnd(fold.start.row, fold.start.column) > 0) {
                    this.end.row = fold.end.row;
                    this.end.column = fold.end.column;
                }
                else if (this.range.compareStart(fold.end.row, fold.end.column) < 0) {
                    this.start.row = fold.start.row;
                    this.start.column = fold.start.column;
                }
            }
            else if (fold.start.row == this.end.row) {
                this.folds.push(fold);
                this.end.row = fold.end.row;
                this.end.column = fold.end.column;
            }
            else if (fold.end.row == this.start.row) {
                this.folds.unshift(fold);
                this.start.row = fold.start.row;
                this.start.column = fold.start.column;
            }
            else {
                throw new Error("Trying to add fold to FoldRow that doesn't have a matching row");
            }
            fold.foldLine = this;
        };
        FoldLine.prototype.containsRow = function (row) {
            return row >= this.start.row && row <= this.end.row;
        };
        FoldLine.prototype.walk = function (callback, endRow, endColumn) {
            var lastEnd = 0, folds = this.folds, fold, cmp, stop, isNewRow = true;
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
        FoldLine.prototype.getNextFoldTo = function (row, column) {
            var fold;
            var cmp;
            for (var i = 0; i < this.folds.length; i++) {
                fold = this.folds[i];
                cmp = fold.range.compareEnd(row, column);
                if (cmp == -1) {
                    return {
                        fold: fold,
                        kind: "after"
                    };
                }
                else if (cmp === 0) {
                    return {
                        fold: fold,
                        kind: "inside"
                    };
                }
            }
            return null;
        };
        FoldLine.prototype.addRemoveChars = function (row, column, len) {
            var ret = this.getNextFoldTo(row, column);
            var fold;
            var folds;
            if (ret) {
                fold = ret.fold;
                if (ret.kind === "inside"
                    && fold.start.column !== column
                    && fold.start.row !== row) {
                    window.console && window.console.warn(row, column, fold);
                }
                else if (fold.start.row == row) {
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
        FoldLine.prototype.split = function (row, column) {
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
        FoldLine.prototype.merge = function (foldLineNext) {
            var folds = foldLineNext.folds;
            for (var i = 0; i < folds.length; i++) {
                this.addFold(folds[i]);
            }
            var foldData = this.foldData;
            foldData.splice(foldData.indexOf(foldLineNext), 1);
        };
        FoldLine.prototype.toString = function () {
            var ret = [this.range.toString() + ": ["];
            this.folds.forEach(function (fold) {
                ret.push("  " + fold.toString());
            });
            ret.push("]");
            return ret.join("\n");
        };
        FoldLine.prototype.idxToPosition = function (idx) {
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
        return FoldLine;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FoldLine;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('Fold',["require", "exports", "./RangeList"], function (require, exports, RangeList_1) {
    "use strict";
    var Fold = (function (_super) {
        __extends(Fold, _super);
        function Fold(range, placeholder) {
            _super.call(this);
            this.foldLine = null;
            this.placeholder = placeholder;
            this.range = range;
            this.start = range.start;
            this.end = range.end;
            this.sameRow = range.start.row === range.end.row;
            this.subFolds = this.ranges = [];
        }
        Fold.prototype.toString = function () {
            return '"' + this.placeholder + '" ' + this.range.toString();
        };
        Fold.prototype.setFoldLine = function (foldLine) {
            this.foldLine = foldLine;
            this.subFolds.forEach(function (fold) {
                fold.setFoldLine(foldLine);
            });
        };
        Fold.prototype.clone = function () {
            var range = this.range.clone();
            var fold = new Fold(range, this.placeholder);
            this.subFolds.forEach(function (subFold) {
                fold.subFolds.push(subFold.clone());
            });
            fold.collapseChildren = this.collapseChildren;
            return fold;
        };
        Fold.prototype.addSubFold = function (fold) {
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
        Fold.prototype.restoreRange = function (range) {
            return restoreRange(range, this.start);
        };
        return Fold;
    })(RangeList_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Fold;
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

define('BackgroundTokenizer',["require", "exports", "./lib/EventEmitterClass"], function (require, exports, EventEmitterClass_1) {
    "use strict";
    var BackgroundTokenizer = (function () {
        function BackgroundTokenizer(tokenizer, session) {
            this.running = 0;
            this.lines = [];
            this.states = [];
            this.currentLine = 0;
            this.eventBus = new EventEmitterClass_1.default(this);
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
                while (self.lines[currentLine]) {
                    currentLine++;
                }
                var startLine = currentLine;
                var len = doc.getLength();
                var processedLines = 0;
                self.running = 0;
                while (currentLine < len) {
                    self.tokenizeRow(currentLine);
                    endLine = currentLine;
                    do {
                        currentLine++;
                    } while (self.lines[currentLine]);
                    processedLines++;
                    if ((processedLines % 5 === 0) && (new Date().getTime() - workerStart.getTime()) > 20) {
                        self.running = setTimeout(self.$worker, 20);
                        break;
                    }
                }
                self.currentLine = currentLine;
                if (startLine <= endLine) {
                    self.fireUpdateEvent(startLine, endLine);
                }
            };
        }
        BackgroundTokenizer.prototype.fireUpdateEvent = function (firstRow, lastRow) {
            var data = { first: firstRow, last: lastRow };
            this.eventBus._signal("update", { data: data });
        };
        BackgroundTokenizer.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        BackgroundTokenizer.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        BackgroundTokenizer.prototype.getState = function (row) {
            if (this.currentLine === row) {
                this.tokenizeRow(row);
            }
            return this.states[row] || "start";
        };
        BackgroundTokenizer.prototype.getTokens = function (row) {
            return this.lines[row] || this.tokenizeRow(row);
        };
        BackgroundTokenizer.prototype.setDocument = function (doc) {
            this.doc = doc;
            this.lines = [];
            this.states = [];
            this.stop();
        };
        BackgroundTokenizer.prototype.setTokenizer = function (tokenizer) {
            this.tokenizer = tokenizer;
            this.lines = [];
            this.states = [];
            this.start(0);
        };
        BackgroundTokenizer.prototype.start = function (startRow) {
            this.currentLine = Math.min(startRow || 0, this.currentLine, this.doc.getLength());
            this.lines.splice(this.currentLine, this.lines.length);
            this.states.splice(this.currentLine, this.states.length);
            this.stop();
            this.running = setTimeout(this.$worker, 700);
        };
        BackgroundTokenizer.prototype.stop = function () {
            if (this.running) {
                clearTimeout(this.running);
            }
            this.running = 0;
        };
        BackgroundTokenizer.prototype.scheduleStart = function () {
            if (!this.running) {
                this.running = setTimeout(this.$worker, 700);
            }
        };
        BackgroundTokenizer.prototype.updateOnChange = function (delta) {
            var startRow = delta.start.row;
            var len = delta.end.row - startRow;
            if (len === 0) {
                this.lines[startRow] = null;
            }
            else if (delta.action === "remove") {
                this.lines.splice(startRow, len + 1, null);
                this.states.splice(startRow, len + 1, null);
            }
            else {
                var args = Array(len + 1);
                args.unshift(startRow, 1);
                this.lines.splice.apply(this.lines, args);
                this.states.splice.apply(this.states, args);
            }
            this.currentLine = Math.min(startRow, this.currentLine, this.doc.getLength());
            this.stop();
        };
        BackgroundTokenizer.prototype.tokenizeRow = function (row) {
            var line = this.doc.getLine(row);
            var state = this.states[row - 1];
            var data = this.tokenizer.getLineTokens(line, state);
            if (this.states[row] + "" !== data.state + "") {
                this.states[row] = data.state;
                this.lines[row + 1] = null;
                if (this.currentLine > row + 1) {
                    this.currentLine = row + 1;
                }
            }
            else if (this.currentLine === row) {
                this.currentLine = row + 1;
            }
            return this.lines[row] = data.tokens;
        };
        return BackgroundTokenizer;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BackgroundTokenizer;
});

define('SearchHighlight',["require", "exports", "./lib/lang", "./Range"], function (require, exports, lang_1, Range_1) {
    "use strict";
    var MAX_RANGES = 500;
    var SearchHighlight = (function () {
        function SearchHighlight(regExp, clazz, type) {
            this.setRegexp(regExp);
            this.clazz = clazz;
            this.type = type || "text";
        }
        SearchHighlight.prototype.setRegexp = function (regExp) {
            if (this.regExp + "" == regExp + "") {
                return;
            }
            this.regExp = regExp;
            this.cache = [];
        };
        Object.defineProperty(SearchHighlight.prototype, "range", {
            get: function () {
                return this._range;
            },
            set: function (range) {
                this._range = range;
            },
            enumerable: true,
            configurable: true
        });
        SearchHighlight.prototype.update = function (html, markerLayer, session, config) {
            if (!this.regExp)
                return;
            var start = config.firstRow, end = config.lastRow;
            for (var i = start; i <= end; i++) {
                var ranges = this.cache[i];
                if (ranges == null) {
                    var matches = lang_1.getMatchOffsets(session.getLine(i), this.regExp);
                    if (matches.length > MAX_RANGES) {
                        matches = matches.slice(0, MAX_RANGES);
                    }
                    ranges = matches.map(function (match) {
                        return new Range_1.default(i, match.offset, i, match.offset + match.length);
                    });
                    this.cache[i] = ranges.length ? ranges : [];
                }
                for (var j = ranges.length; j--;) {
                    markerLayer.drawSingleLineMarker(html, session.documentToScreenRange(ranges[j]), this.clazz, config);
                }
            }
        };
        return SearchHighlight;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = SearchHighlight;
});

define('BracketMatch',["require", "exports", "./TokenIterator", "./Range"], function (require, exports, TokenIterator_1, Range_1) {
    "use strict";
    var $brackets = {
        ")": "(",
        "(": ")",
        "]": "[",
        "[": "]",
        "{": "}",
        "}": "{"
    };
    var BracketMatch = (function () {
        function BracketMatch(editSession) {
            this.editSession = editSession;
        }
        BracketMatch.prototype.findMatchingBracket = function (position, chr) {
            if (position.column === 0)
                return null;
            var charBeforeCursor = chr || this.editSession.getLine(position.row).charAt(position.column - 1);
            if (charBeforeCursor === "")
                return null;
            var match = charBeforeCursor.match(/([\(\[\{])|([\)\]\}])/);
            if (!match)
                return null;
            if (match[1])
                return this.findClosingBracket(match[1], position);
            else
                return this.findOpeningBracket(match[2], position);
        };
        BracketMatch.prototype.getBracketRange = function (pos) {
            var line = this.editSession.getLine(pos.row);
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
                var closingPos = this.findClosingBracket(match[1], pos);
                if (!closingPos)
                    return null;
                range = Range_1.default.fromPoints(pos, closingPos);
                if (!before) {
                    range.end.column++;
                    range.start.column--;
                }
                range.cursor = range.end;
            }
            else {
                var openingPos = this.findOpeningBracket(match[2], pos);
                if (!openingPos)
                    return null;
                range = Range_1.default.fromPoints(openingPos, pos);
                if (!before) {
                    range.start.column++;
                    range.end.column--;
                }
                range.cursor = range.start;
            }
            return range;
        };
        BracketMatch.prototype.findOpeningBracket = function (bracket, position, typeRe) {
            var openBracket = $brackets[bracket];
            var depth = 1;
            var iterator = new TokenIterator_1.default(this.editSession, position.row, position.column);
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
                    if (chr === openBracket) {
                        depth -= 1;
                        if (depth === 0) {
                            return {
                                row: iterator.getCurrentTokenRow(),
                                column: valueIndex + iterator.getCurrentTokenColumn()
                            };
                        }
                    }
                    else if (chr === bracket) {
                        depth += 1;
                    }
                    valueIndex -= 1;
                }
                do {
                    token = iterator.stepBackward();
                } while (token && !typeRe.test(token.type));
                if (token === null)
                    break;
                value = token.value;
                valueIndex = value.length - 1;
            }
            return null;
        };
        BracketMatch.prototype.findClosingBracket = function (bracket, position, typeRe) {
            var closingBracket = $brackets[bracket];
            var depth = 1;
            var iterator = new TokenIterator_1.default(this.editSession, position.row, position.column);
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
                    if (chr === closingBracket) {
                        depth -= 1;
                        if (depth === 0) {
                            return {
                                row: iterator.getCurrentTokenRow(),
                                column: valueIndex + iterator.getCurrentTokenColumn()
                            };
                        }
                    }
                    else if (chr === bracket) {
                        depth += 1;
                    }
                    valueIndex += 1;
                }
                do {
                    token = iterator.stepForward();
                } while (token && !typeRe.test(token.type));
                if (token === null)
                    break;
                valueIndex = 0;
            }
            return null;
        };
        return BracketMatch;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = BracketMatch;
});

define('mode/TextHighlightRules',["require", "exports", "../lib/lang"], function (require, exports, lang_1) {
    "use strict";
    var TextHighlightRules = (function () {
        function TextHighlightRules() {
            this.$rules = {
                "start": [
                    {
                        token: "empty_line",
                        regex: '^$'
                    },
                    {
                        defaultToken: "text"
                    }]
            };
        }
        TextHighlightRules.prototype.addRules = function (rules, prefix) {
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
                        }
                        else {
                            if (rule.next.indexOf(prefix) !== 0)
                                rule.next = prefix + rule.next;
                        }
                    }
                }
                this.$rules[prefix + key] = state;
            }
        };
        TextHighlightRules.prototype.getRules = function () {
            return this.$rules;
        };
        TextHighlightRules.prototype.embedRules = function (HighlightRules, prefix, escapeRules, states, append) {
            var embedRules = (typeof HighlightRules === "function") ? new HighlightRules().getRules() : HighlightRules;
            if (states) {
                for (var i = 0; i < states.length; i++)
                    states[i] = prefix + states[i];
            }
            else {
                states = [];
                for (var key in embedRules)
                    states.push(prefix + key);
            }
            this.addRules(embedRules, prefix);
            if (escapeRules) {
                var addRules = Array.prototype[append ? "push" : "unshift"];
                for (var i = 0; i < states.length; i++)
                    addRules.apply(this.$rules[states[i]], lang_1.deepCopy(escapeRules));
            }
            if (!this.$embeds)
                this.$embeds = [];
            this.$embeds.push(prefix);
        };
        TextHighlightRules.prototype.getEmbeds = function () {
            return this.$embeds;
        };
        TextHighlightRules.prototype.normalizeRules = function () {
            var pushState = function (currentState, stack) {
                if (currentState != "start" || stack.length)
                    stack.unshift(this.nextState, currentState);
                return this.nextState;
            };
            var popState = function (currentState, stack) {
                stack.shift();
                return stack.shift() || "start";
            };
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
                        if (!stateName) {
                            stateName = rule.token;
                            if (typeof stateName != "string")
                                stateName = stateName[0] || "";
                            if (rules[stateName])
                                stateName += id++;
                        }
                        rules[stateName] = next;
                        rule.next = stateName;
                        processState(stateName);
                    }
                    else if (next == "pop") {
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
                            }
                            else {
                                rules[r] = rule.rules[r];
                            }
                        }
                    }
                    if (rule.include || typeof rule === "string") {
                        var includeName = rule.include || rule;
                        var toInsert = rules[includeName];
                    }
                    else if (Array.isArray(rule))
                        toInsert = rule;
                    if (toInsert) {
                        var args = [i, 1].concat(toInsert);
                        if (rule.noEscape) {
                            args = args.filter(function (x) { return !x['next']; });
                        }
                        state.splice.apply(state, args);
                        i--;
                        toInsert = null;
                    }
                    if (rule.keywordMap) {
                        rule.token = this.createKeywordMapper(rule.keywordMap, rule.defaultToken || "text", rule.caseInsensitive);
                        delete rule.defaultToken;
                    }
                }
            }
            Object.keys(rules).forEach(processState, this);
        };
        TextHighlightRules.prototype.createKeywordMapper = function (map, defaultToken, ignoreCase, splitChar) {
            var keywords = Object.create(null);
            Object.keys(map).forEach(function (className) {
                var a = map[className];
                if (ignoreCase)
                    a = a.toLowerCase();
                var list = a.split(splitChar || "|");
                for (var i = list.length; i--;)
                    keywords[list[i]] = className;
            });
            if (Object.getPrototypeOf(keywords)) {
                keywords.__proto__ = null;
            }
            this.$keywordList = Object.keys(keywords);
            map = null;
            return ignoreCase
                ? function (value) { return keywords[value.toLowerCase()] || defaultToken; }
                : function (value) { return keywords[value] || defaultToken; };
        };
        TextHighlightRules.prototype.getKeywords = function () {
            return this.$keywordList;
        };
        return TextHighlightRules;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextHighlightRules;
});

define('mode/Behaviour',["require", "exports"], function (require, exports) {
    "use strict";
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
        Behaviour.prototype.inherit = function (base, filter) {
            var behaviours = base.getBehaviours(filter);
            this.addBehaviours(behaviours);
        };
        Behaviour.prototype.getBehaviours = function (filter) {
            if (!filter) {
                return this.$behaviours;
            }
            else {
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
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Behaviour;
});

define('unicode',["require", "exports"], function (require, exports) {
    "use strict";
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

define('mode/TextMode',["require", "exports", "../Tokenizer", "./TextHighlightRules", "./Behaviour", "../unicode", "../lib/lang", "../TokenIterator", "../Range"], function (require, exports, Tokenizer_1, TextHighlightRules_1, Behaviour_1, unicode_1, lang_1, TokenIterator_1, Range_1) {
    "use strict";
    var TextMode = (function () {
        function TextMode(workerUrl, scriptImports) {
            this.HighlightRules = TextHighlightRules_1.default;
            this.$behaviour = new Behaviour_1.default();
            this.tokenRe = new RegExp("^["
                + unicode_1.packages.L
                + unicode_1.packages.Mn + unicode_1.packages.Mc
                + unicode_1.packages.Nd
                + unicode_1.packages.Pc + "\\$_]+", "g");
            this.nonTokenRe = new RegExp("^(?:[^"
                + unicode_1.packages.L
                + unicode_1.packages.Mn + unicode_1.packages.Mc
                + unicode_1.packages.Nd
                + unicode_1.packages.Pc + "\\$_]|\\s])+", "g");
            this.lineCommentStart = "";
            this.$id = "ace/mode/text";
            this.scriptImports = [];
            if (typeof workerUrl === 'string') {
                this.workerUrl = workerUrl;
            }
            else {
                throw new TypeError("workerUrl must be a string.");
            }
            this.scriptImports = scriptImports;
        }
        TextMode.prototype.getTokenizer = function () {
            if (!this.$tokenizer) {
                this.$highlightRules = this.$highlightRules || new this.HighlightRules();
                this.$tokenizer = new Tokenizer_1.default(this.$highlightRules.getRules());
            }
            return this.$tokenizer;
        };
        TextMode.prototype.toggleCommentLines = function (state, session, startRow, endRow) {
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
                var regexpStart = new RegExp("^(\\s*)(?:" + lang_1.escapeRegExp(lineCommentStart) + ")");
                var regexpEnd = new RegExp("(?:" + lang_1.escapeRegExp(lineCommentEnd) + ")\\s*$");
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
            }
            else {
                if (Array.isArray(this.lineCommentStart)) {
                    var regexpStartString = this.lineCommentStart.map(lang_1.escapeRegExp).join("|");
                    lineCommentStart = this.lineCommentStart[0];
                }
                else {
                    var regexpStartString = lang_1.escapeRegExp(this.lineCommentStart);
                    lineCommentStart = this.lineCommentStart;
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
                }
                else if (minEmptyLength > line.length) {
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
        TextMode.prototype.toggleBlockComment = function (state, session, range, cursor) {
            var comment = this.blockComment;
            if (!comment)
                return;
            if (!comment.start && comment[0])
                comment = comment[0];
            var iterator = new TokenIterator_1.default(session, cursor.row, cursor.column);
            var token = iterator.getCurrentToken();
            var selection = session.getSelection();
            var initialRange = selection.toOrientedRange();
            var startRow, colDiff;
            if (token && /comment/.test(token.type)) {
                var startRange, endRange;
                while (token && /comment/.test(token.type)) {
                    var i = token.value.indexOf(comment.start);
                    if (i != -1) {
                        var row = iterator.getCurrentTokenRow();
                        var column = iterator.getCurrentTokenColumn() + i;
                        startRange = new Range_1.default(row, column, row, column + comment.start.length);
                        break;
                    }
                    token = iterator.stepBackward();
                }
                var iterator = new TokenIterator_1.default(session, cursor.row, cursor.column);
                var token = iterator.getCurrentToken();
                while (token && /comment/.test(token.type)) {
                    var i = token.value.indexOf(comment.end);
                    if (i != -1) {
                        var row = iterator.getCurrentTokenRow();
                        var column = iterator.getCurrentTokenColumn() + i;
                        endRange = new Range_1.default(row, column, row, column + comment.end.length);
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
            }
            else {
                colDiff = comment.start.length;
                startRow = range.start.row;
                session.insert(range.end, comment.end);
                session.insert(range.start, comment.start);
            }
            if (initialRange.start.row == startRow)
                initialRange.start.column += colDiff;
            if (initialRange.end.row == startRow)
                initialRange.end.column += colDiff;
            session.getSelection().fromOrientedRange(initialRange);
        };
        TextMode.prototype.getNextLineIndent = function (state, line, tab) {
            return this.$getIndent(line);
        };
        TextMode.prototype.checkOutdent = function (state, line, text) {
            return false;
        };
        TextMode.prototype.autoOutdent = function (state, session, row) {
            return 0;
        };
        TextMode.prototype.$getIndent = function (line) {
            return line.match(/^\s*/)[0];
        };
        TextMode.prototype.createWorker = function (session) {
            return void 0;
        };
        TextMode.prototype.createModeDelegates = function (mapping) {
            this.$embeds = [];
            this.$modes = {};
            for (var p in mapping) {
                if (mapping[p]) {
                    this.$embeds.push(p);
                    this.$modes[p] = new mapping[p](this.workerUrl, this.scriptImports);
                }
            }
            var delegations = ['toggleBlockComment', 'toggleCommentLines', 'getNextLineIndent',
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
        TextMode.prototype.$delegator = function (method, args, defaultHandler) {
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
        TextMode.prototype.transformAction = function (state, action, editor, session, param) {
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
        TextMode.prototype.getKeywords = function (append) {
            if (!this.completionKeywords) {
                var rules = this.$tokenizer.states;
                var completionKeywords = [];
                for (var rule in rules) {
                    var ruleItr = rules[rule];
                    for (var r = 0, l = ruleItr.length; r < l; r++) {
                        if (typeof ruleItr[r].token === "string") {
                            if (/keyword|support|storage/.test(ruleItr[r].token))
                                completionKeywords.push(ruleItr[r].regex);
                        }
                        else if (typeof ruleItr[r].token === "object") {
                            for (var a = 0, aLength = ruleItr[r].token.length; a < aLength; a++) {
                                if (/keyword|support|storage/.test(ruleItr[r].token[a])) {
                                    var matched = ruleItr[r].regex.match(/\(.+?\)/g)[a];
                                    completionKeywords.push(matched.substr(1, matched.length - 2));
                                }
                            }
                        }
                    }
                }
                this.completionKeywords = completionKeywords;
            }
            if (!append) {
                return this.$keywordList;
            }
            return completionKeywords.concat(this.$keywordList || []);
        };
        TextMode.prototype.$createKeywordList = function () {
            if (!this.$highlightRules)
                this.getTokenizer();
            return this.$keywordList = this.$highlightRules.$keywordList || [];
        };
        TextMode.prototype.getCompletions = function (state, session, pos, prefix) {
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
        return TextMode;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextMode;
});

define('EditSession',["require", "exports", './lib/lang/createDelayedCall', "./lib/lang", "./config", "./lib/EventEmitterClass", "./FoldLine", "./Fold", "./Selection", "./Range", "./Document", "./BackgroundTokenizer", "./SearchHighlight", "./BracketMatch", './TokenIterator', "./mode/TextMode"], function (require, exports, createDelayedCall_1, lang_1, config_1, EventEmitterClass_1, FoldLine_1, Fold_1, Selection_1, Range_1, Document_1, BackgroundTokenizer_1, SearchHighlight_1, BracketMatch_1, TokenIterator_1, TextMode_1) {
    var CHAR = 1, CHAR_EXT = 2, PLACEHOLDER_START = 3, PLACEHOLDER_BODY = 4, PUNCTUATION = 9, SPACE = 10, TAB = 11, TAB_SPACE = 12;
    function isFullWidth(c) {
        if (c < 0x1100)
            return false;
        return c >= 0x1100 && c <= 0x115F ||
            c >= 0x11A3 && c <= 0x11A7 ||
            c >= 0x11FA && c <= 0x11FF ||
            c >= 0x2329 && c <= 0x232A ||
            c >= 0x2E80 && c <= 0x2E99 ||
            c >= 0x2E9B && c <= 0x2EF3 ||
            c >= 0x2F00 && c <= 0x2FD5 ||
            c >= 0x2FF0 && c <= 0x2FFB ||
            c >= 0x3000 && c <= 0x303E ||
            c >= 0x3041 && c <= 0x3096 ||
            c >= 0x3099 && c <= 0x30FF ||
            c >= 0x3105 && c <= 0x312D ||
            c >= 0x3131 && c <= 0x318E ||
            c >= 0x3190 && c <= 0x31BA ||
            c >= 0x31C0 && c <= 0x31E3 ||
            c >= 0x31F0 && c <= 0x321E ||
            c >= 0x3220 && c <= 0x3247 ||
            c >= 0x3250 && c <= 0x32FE ||
            c >= 0x3300 && c <= 0x4DBF ||
            c >= 0x4E00 && c <= 0xA48C ||
            c >= 0xA490 && c <= 0xA4C6 ||
            c >= 0xA960 && c <= 0xA97C ||
            c >= 0xAC00 && c <= 0xD7A3 ||
            c >= 0xD7B0 && c <= 0xD7C6 ||
            c >= 0xD7CB && c <= 0xD7FB ||
            c >= 0xF900 && c <= 0xFAFF ||
            c >= 0xFE10 && c <= 0xFE19 ||
            c >= 0xFE30 && c <= 0xFE52 ||
            c >= 0xFE54 && c <= 0xFE66 ||
            c >= 0xFE68 && c <= 0xFE6B ||
            c >= 0xFF01 && c <= 0xFF60 ||
            c >= 0xFFE0 && c <= 0xFFE6;
    }
    var EditSession = (function () {
        function EditSession(doc) {
            this.$breakpoints = [];
            this.$decorations = [];
            this.$frontMarkers = {};
            this.$backMarkers = {};
            this.$markerId = 1;
            this.$undoSelect = true;
            this.$defaultUndoManager = { undo: function () { }, redo: function () { }, reset: function () { } };
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
            this.$onChange = this.onChange.bind(this);
            this.lineWidgets = null;
            this.$selectionMarker = null;
            this.$bracketMatcher = new BracketMatch_1.default(this);
            this.$foldStyles = {
                "manual": 1,
                "markbegin": 1,
                "markbeginend": 1
            };
            this.$foldStyle = "markbegin";
            if (!(doc instanceof Document_1.default)) {
                throw new TypeError('doc must be an Document');
            }
            this.$breakpoints = [];
            this.eventBus = new EventEmitterClass_1.default(this);
            this.$foldData = [];
            this.$foldData.toString = function () {
                return this.join("\n");
            };
            this.eventBus.on("changeFold", this.onChangeFold.bind(this));
            this.setDocument(doc);
            this.selection = new Selection_1.default(this);
            config_1.resetOptions(this);
            this.setLanguageMode(new TextMode_1.default('', []));
            this.eventBus._signal("session", this);
        }
        EditSession.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        EditSession.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        EditSession.prototype._emit = function (eventName, event) {
            this.eventBus._emit(eventName, event);
        };
        EditSession.prototype._signal = function (eventName, event) {
            this.eventBus._signal(eventName, event);
        };
        EditSession.prototype.setDocument = function (doc) {
            if (!(doc instanceof Document_1.default)) {
                throw new Error("doc must be a Document");
            }
            if (this.doc) {
                this.doc.removeChangeListener(this.$onChange);
            }
            this.doc = doc;
            this.doc.addChangeListener(this.$onChange);
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
                if (val > c) {
                    low = mid + 1;
                }
                else if (val < c) {
                    hi = mid - 1;
                }
                else {
                    return mid;
                }
            }
            return low - 1;
        };
        EditSession.prototype.resetCaches = function () {
            this.$modified = true;
            this.$wrapData = [];
            this.$rowLengthCache = [];
            this.$resetRowCache(0);
            if (this.bgTokenizer) {
                this.bgTokenizer.start(0);
            }
        };
        EditSession.prototype.onChangeFold = function (event) {
            var fold = event.data;
            this.$resetRowCache(fold.start.row);
        };
        EditSession.prototype.onChange = function (delta, doc) {
            this.$modified = true;
            this.$resetRowCache(delta.start.row);
            var removedFolds = this.$updateInternalDataOnChange(delta);
            if (!this.$fromUndo && this.$undoManager && !delta.ignore) {
                this.$deltasDoc.push(delta);
                if (removedFolds && removedFolds.length !== 0) {
                    this.$deltasFold.push({
                        action: "removeFolds",
                        folds: removedFolds
                    });
                }
                this.$informUndoManager.schedule();
            }
            if (this.bgTokenizer) {
                this.bgTokenizer.updateOnChange(delta);
            }
            this.eventBus._signal("change", delta);
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
        EditSession.prototype.setSelection = function (selection) {
            this.selection = selection;
        };
        EditSession.prototype.getState = function (row) {
            if (this.bgTokenizer) {
                return this.bgTokenizer.getState(row);
            }
            else {
                return void 0;
            }
        };
        EditSession.prototype.getTokens = function (row) {
            if (this.bgTokenizer) {
                return this.bgTokenizer.getTokens(row);
            }
            else {
                return void 0;
            }
        };
        EditSession.prototype.getTokenAt = function (row, column) {
            if (this.bgTokenizer) {
                var tokens = this.bgTokenizer.getTokens(row);
                var token;
                var c = 0;
                if (column == null) {
                    i = tokens.length - 1;
                    c = this.getLine(row).length;
                }
                else {
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
            }
            else {
                return void 0;
            }
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
                this.$informUndoManager = createDelayedCall_1.default(this.$syncInformUndoManager);
            }
        };
        EditSession.prototype.markUndoGroup = function () {
            if (this.$syncInformUndoManager) {
                this.$syncInformUndoManager();
            }
        };
        EditSession.prototype.getUndoManager = function () {
            return this.$undoManager || this.$defaultUndoManager;
        };
        EditSession.prototype.getTabString = function () {
            if (this.getUseSoftTabs()) {
                return lang_1.stringRepeat(" ", this.getTabSize());
            }
            else {
                return "\t";
            }
        };
        EditSession.prototype.setUseSoftTabs = function (useSoftTabs) {
            this.setOption("useSoftTabs", useSoftTabs);
            return this;
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
            if (!this.$decorations[row]) {
                this.$decorations[row] = "";
            }
            this.$decorations[row] += " " + className;
            this.eventBus._signal("changeBreakpoint", {});
        };
        EditSession.prototype.removeGutterDecoration = function (row, className) {
            this.$decorations[row] = (this.$decorations[row] || "").replace(" " + className, "");
            this.eventBus._signal("changeBreakpoint", {});
        };
        EditSession.prototype.getBreakpoints = function () {
            return this.$breakpoints;
        };
        EditSession.prototype.setBreakpoints = function (rows) {
            this.$breakpoints = [];
            for (var i = 0; i < rows.length; i++) {
                this.$breakpoints[rows[i]] = "ace_breakpoint";
            }
            this.eventBus._signal("changeBreakpoint", {});
        };
        EditSession.prototype.clearBreakpoints = function () {
            this.$breakpoints = [];
            this.eventBus._signal("changeBreakpoint", {});
        };
        EditSession.prototype.setBreakpoint = function (row, className) {
            if (className === undefined)
                className = "ace_breakpoint";
            if (className)
                this.$breakpoints[row] = className;
            else
                delete this.$breakpoints[row];
            this.eventBus._signal("changeBreakpoint", {});
        };
        EditSession.prototype.clearBreakpoint = function (row) {
            delete this.$breakpoints[row];
            this.eventBus._signal("changeBreakpoint", {});
        };
        EditSession.prototype.addMarker = function (range, clazz, type, renderer, inFront) {
            if (type === void 0) { type = 'line'; }
            var id = this.$markerId++;
            if (range) {
                if (typeof range.start.row !== 'number') {
                    throw new TypeError();
                }
                if (typeof range.start.column !== 'number') {
                    throw new TypeError();
                }
                if (typeof range.end.row !== 'number') {
                    throw new TypeError();
                }
                if (typeof range.end.column !== 'number') {
                    throw new TypeError();
                }
            }
            var marker = {
                range: range,
                type: type || "line",
                renderer: renderer,
                clazz: clazz,
                inFront: !!inFront,
                id: id
            };
            if (inFront) {
                this.$frontMarkers[id] = marker;
                this.eventBus._signal("changeFrontMarker");
            }
            else {
                this.$backMarkers[id] = marker;
                this.eventBus._signal("changeBackMarker");
            }
            return id;
        };
        EditSession.prototype.addDynamicMarker = function (marker, inFront) {
            if (!marker.update) {
                return;
            }
            var id = this.$markerId++;
            marker.id = id;
            marker.inFront = !!inFront;
            if (inFront) {
                this.$frontMarkers[id] = marker;
                this.eventBus._signal("changeFrontMarker");
            }
            else {
                this.$backMarkers[id] = marker;
                this.eventBus._signal("changeBackMarker");
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
                this.eventBus._signal(marker.inFront ? "changeFrontMarker" : "changeBackMarker");
            }
        };
        EditSession.prototype.getMarkers = function (inFront) {
            return inFront ? this.$frontMarkers : this.$backMarkers;
        };
        EditSession.prototype.highlight = function (re) {
            if (!this.$searchHighlight) {
                var highlight = new SearchHighlight_1.default(null, "ace_selected-word", "text");
                this.addDynamicMarker(highlight);
                this.$searchHighlight = highlight;
            }
            this.$searchHighlight.setRegexp(re);
        };
        EditSession.prototype.highlightLines = function (startRow, endRow, clazz, inFront) {
            if (clazz === void 0) { clazz = "ace_step"; }
            var range = new Range_1.default(startRow, 0, endRow, Infinity);
            range.markerId = this.addMarker(range, clazz, "fullLine", null, inFront);
            return range;
        };
        EditSession.prototype.setAnnotations = function (annotations) {
            this.$annotations = annotations;
            this.eventBus._signal("changeAnnotation", {});
        };
        EditSession.prototype.getAnnotations = function () {
            return this.$annotations || [];
        };
        EditSession.prototype.clearAnnotations = function () {
            this.setAnnotations([]);
        };
        EditSession.prototype.$detectNewLine = function (text) {
            var match = text.match(/^.*?(\r?\n)/m);
            if (match) {
                this.$autoNewLine = match[1];
            }
            else {
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
                } while (start >= 0 && line.charAt(start).match(re));
                start++;
            }
            var end = column;
            while (end < line.length && line.charAt(end).match(re)) {
                end++;
            }
            return new Range_1.default(row, start, row, end);
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
        EditSession.prototype.getUseWorker = function () { return this.$useWorker; };
        EditSession.prototype.onReloadTokenizer = function (e) {
            var rows = e.data;
            this.bgTokenizer.start(rows.first);
            this.eventBus._signal("tokenizerUpdate", e);
        };
        EditSession.prototype.setLanguageMode = function (mode) {
            return this.$onChangeMode(mode, false);
        };
        EditSession.prototype.setMode = function (modeName) {
            var _this = this;
            this.importMode(modeName)
                .then(function (mode) { return _this.setLanguageMode(mode); })
                .catch(function (reason) {
                throw new Error("setMode failed. Reason: " + reason);
            });
        };
        EditSession.prototype.importMode = function (modeName, options) {
            if (typeof modeName !== 'string') {
                throw new TypeError("modeName must be a string");
            }
            if (!this.$mode) {
                this.$onChangeMode(new TextMode_1.default('', []), true);
            }
            var self = this;
            return new Promise(function (success, fail) {
                if (self.$modes[modeName] && !options) {
                    success(self.$modes[modeName]);
                }
                else {
                    if (self.$modes[modeName] && !options) {
                        success(self.$modes[modeName]);
                    }
                    System.import(modeName)
                        .then(function (m) {
                        if (m && m.default) {
                            var newMode = new m.default(options);
                            success(newMode);
                        }
                        else {
                            fail(new Error(modeName + " does not define a default export (a LanguageMode class)."));
                        }
                    }).catch(function (reason) {
                        fail(reason);
                    });
                }
            });
        };
        EditSession.prototype.$onChangeMode = function (mode, isPlaceholder) {
            var _this = this;
            if (!isPlaceholder) {
                this.$modeId = mode.$id;
            }
            if (this.$mode === mode) {
                return;
            }
            this.$mode = mode;
            this.$stopWorker();
            if (this.$useWorker) {
                this.$startWorker();
            }
            var tokenizer = mode.getTokenizer();
            if (tokenizer['addEventListener'] !== undefined) {
                var onReloadTokenizer = this.onReloadTokenizer.bind(this);
                tokenizer['addEventListener']("update", onReloadTokenizer);
            }
            if (!this.bgTokenizer) {
                this.bgTokenizer = new BackgroundTokenizer_1.default(tokenizer, this);
                this.bgTokenizer.on("update", function (event, bg) {
                    _this.eventBus._signal("tokenizerUpdate", event);
                });
            }
            else {
                this.bgTokenizer.setTokenizer(tokenizer);
            }
            this.bgTokenizer.setDocument(this.getDocument());
            this.tokenRe = mode.tokenRe;
            this.nonTokenRe = mode.nonTokenRe;
            if (!isPlaceholder) {
                this.$options.wrapMethod.set.call(this, this.$wrapMethod);
                this.$setFolding(mode.foldingRules);
                this.bgTokenizer.start(0);
                this.eventBus._emit("changeMode");
            }
        };
        EditSession.prototype.$stopWorker = function () {
            if (this.$worker) {
                this.$worker.terminate();
            }
            this.$worker = null;
        };
        EditSession.prototype.$startWorker = function () {
            try {
                this.$worker = this.$mode.createWorker(this);
            }
            catch (e) {
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
            this.eventBus._signal("changeScrollTop", scrollTop);
        };
        EditSession.prototype.getScrollTop = function () {
            return this.$scrollTop;
        };
        EditSession.prototype.setScrollLeft = function (scrollLeft) {
            if (this.$scrollLeft === scrollLeft || isNaN(scrollLeft))
                return;
            this.$scrollLeft = scrollLeft;
            this.eventBus._signal("changeScrollLeft", scrollLeft);
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
                if (this.$useWrapMode) {
                    return this.screenWidth = this.$wrapLimit;
                }
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
        EditSession.prototype.removeFullLines = function (firstRow, lastRow) {
            return this.doc.removeFullLines(firstRow, lastRow);
        };
        EditSession.prototype.undoChanges = function (deltas, dontSelect) {
            var _this = this;
            if (!deltas.length)
                return;
            this.$fromUndo = true;
            var lastUndoRange = null;
            for (var i = deltas.length - 1; i != -1; i--) {
                var delta = deltas[i];
                if (delta.group === "doc") {
                    this.doc.revertDeltas(delta.deltas);
                    lastUndoRange = this.$getUndoSelection(delta.deltas, true, lastUndoRange);
                }
                else {
                    delta.deltas.forEach(function (foldDelta) {
                        _this.addFolds(foldDelta.folds);
                    }, this);
                }
            }
            this.$fromUndo = false;
            lastUndoRange &&
                this.$undoSelect &&
                !dontSelect &&
                this.selection.setSelectionRange(lastUndoRange);
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
                    lastUndoRange =
                        this.$getUndoSelection(delta.deltas, false, lastUndoRange);
                }
            }
            this.$fromUndo = false;
            lastUndoRange &&
                this.$undoSelect &&
                !dontSelect &&
                this.selection.setSelectionRange(lastUndoRange);
            return lastUndoRange;
        };
        EditSession.prototype.setUndoSelect = function (enable) {
            this.$undoSelect = enable;
        };
        EditSession.prototype.$getUndoSelection = function (deltas, isUndo, lastUndoRange) {
            function isInsert(delta) {
                return isUndo ? delta.action !== "insert" : delta.action === "insert";
            }
            var delta = deltas[0];
            var range;
            var point;
            var lastDeltaIsInsert = false;
            if (isInsert(delta)) {
                range = Range_1.default.fromPoints(delta.start, delta.end);
                lastDeltaIsInsert = true;
            }
            else {
                range = Range_1.default.fromPoints(delta.start, delta.start);
                lastDeltaIsInsert = false;
            }
            for (var i = 1; i < deltas.length; i++) {
                delta = deltas[i];
                if (isInsert(delta)) {
                    point = delta.start;
                    if (range.compare(point.row, point.column) == -1) {
                        range.setStart(point.row, point.column);
                    }
                    point = delta.end;
                    if (range.compare(point.row, point.column) == 1) {
                        range.setEnd(point.row, point.column);
                    }
                    lastDeltaIsInsert = true;
                }
                else {
                    point = delta.start;
                    if (range.compare(point.row, point.column) == -1) {
                        range = Range_1.default.fromPoints(delta.start, delta.start);
                    }
                    lastDeltaIsInsert = false;
                }
            }
            if (lastUndoRange != null) {
                if (Range_1.default.comparePoints(lastUndoRange.start, range.start) === 0) {
                    lastUndoRange.start.column += range.end.column - range.start.column;
                    lastUndoRange.end.column += range.end.column - range.start.column;
                }
                var cmp = lastUndoRange.compareRange(range);
                if (cmp == 1) {
                    range.setStart(lastUndoRange.start.row, lastUndoRange.start.column);
                }
                else if (cmp == -1) {
                    range.setEnd(lastUndoRange.end.row, lastUndoRange.end.column);
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
            var toRange = Range_1.default.fromPoints(toPosition, toPosition);
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
            var deleteRange = new Range_1.default(0, 0, 0, 0);
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
                }
                else {
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
            }
            else if (dir > 0) {
                var row = this.getRowFoldEnd(lastRow + dir);
                if (row > this.doc.getLength() - 1)
                    return 0;
                var diff = row - lastRow;
            }
            else {
                firstRow = this.$clipRowToDocument(firstRow);
                lastRow = this.$clipRowToDocument(lastRow);
                var diff = lastRow - firstRow + 1;
            }
            var range = new Range_1.default(firstRow, 0, lastRow, Number.MAX_VALUE);
            var folds = this.getFoldsInRange(range).map(function (x) {
                x = x.clone();
                x.start.row += diff;
                x.end.row += diff;
                return x;
            });
            var lines = dir == 0
                ? this.doc.getLines(firstRow, lastRow)
                : this.doc.removeFullLines(firstRow, lastRow);
            this.doc.insertFullLines(firstRow + diff, lines);
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
            }
            else {
                var len = this.doc.getLength();
                if (row >= len) {
                    row = len - 1;
                    column = this.doc.getLine(len - 1).length;
                }
                else {
                    column = Math.min(this.doc.getLine(row).length, column);
                }
            }
            return { row: row, column: column };
        };
        EditSession.prototype.$clipRangeToDocument = function (range) {
            if (range.start.row < 0) {
                range.start.row = 0;
                range.start.column = 0;
            }
            else {
                range.start.column = this.$clipColumnToRow(range.start.row, range.start.column);
            }
            var len = this.doc.getLength() - 1;
            if (range.end.row > len) {
                range.end.row = len;
                range.end.column = this.doc.getLine(len).length;
            }
            else {
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
                this.eventBus._signal("changeWrapMode");
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
                this.eventBus._signal("changeWrapMode");
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
                    this.eventBus._signal("changeWrapLimit");
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
        EditSession.prototype.$updateInternalDataOnChange = function (delta) {
            var useWrapMode = this.$useWrapMode;
            var action = delta.action;
            var start = delta.start;
            var end = delta.end;
            var firstRow = start.row;
            var lastRow = end.row;
            var len = lastRow - firstRow;
            var removedFolds = null;
            this.$updating = true;
            if (len != 0) {
                if (action === "remove") {
                    this[useWrapMode ? "$wrapData" : "$rowLengthCache"].splice(firstRow, len);
                    var foldLines = this.$foldData;
                    removedFolds = this.getFoldsInRange(delta);
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
                }
                else {
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
                            if (foldLine) {
                                foldLine.shiftRow(len);
                                foldLine.addRemoveChars(lastRow, 0, end.column - start.column);
                            }
                        }
                        else if (cmp == -1) {
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
            }
            else {
                len = Math.abs(delta.start.column - delta.end.column);
                if (action === "remove") {
                    removedFolds = this.getFoldsInRange(delta);
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
                }
                else {
                    tokens = [];
                    foldLine.walk(function (placeholder, row, column, lastColumn) {
                        var walkTokens;
                        if (placeholder != null) {
                            walkTokens = this.$getDisplayTokens(placeholder, tokens.length);
                            walkTokens[0] = PLACEHOLDER_START;
                            for (var i = 1; i < walkTokens.length; i++) {
                                walkTokens[i] = PLACEHOLDER_BODY;
                            }
                        }
                        else {
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
                displayed.join("").
                    replace(/12/g, function () {
                    len -= 1;
                    return void 0;
                }).
                    replace(/2/g, function () {
                    len -= 1;
                    return void 0;
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
                }
                else {
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
                }
                else if (c == 32) {
                    arr.push(SPACE);
                }
                else if ((c > 39 && c < 48) || (c > 57 && c < 64)) {
                    arr.push(PUNCTUATION);
                }
                else if (c >= 0x1100 && isFullWidth(c)) {
                    arr.push(CHAR, CHAR_EXT);
                }
                else {
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
            var c;
            var column;
            for (column = 0; column < str.length; column++) {
                c = str.charCodeAt(column);
                if (c == 9) {
                    screenColumn += this.getScreenTabSize(screenColumn);
                }
                else if (c >= 0x1100 && isFullWidth(c)) {
                    screenColumn += 2;
                }
                else {
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
            }
            else {
                return this.$wrapData[row].length + 1 + h;
            }
        };
        EditSession.prototype.getRowLineCount = function (row) {
            if (!this.$useWrapMode || !this.$wrapData[row]) {
                return 1;
            }
            else {
                return this.$wrapData[row].length + 1;
            }
        };
        EditSession.prototype.getRowWrapIndent = function (screenRow) {
            if (this.$useWrapMode) {
                var pos = this.screenToDocumentPosition(screenRow, Number.MAX_VALUE);
                var splits = this.$wrapData[pos.row];
                return splits.length && splits[0] < pos.column ? splits['indent'] : 0;
            }
            else {
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
            }
            else {
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
            }
            else {
                var doCache = !l;
            }
            var maxRow = this.getLength() - 1;
            var foldLine = this.getNextFoldLine(docRow);
            var foldStart = foldLine ? foldLine.start.row : Infinity;
            while (row <= screenRow) {
                rowLength = this.getRowLength(docRow);
                if (row + rowLength > screenRow || docRow >= maxRow) {
                    break;
                }
                else {
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
            }
            else if (row + rowLength <= screenRow || docRow > maxRow) {
                return {
                    row: maxRow,
                    column: this.getLine(maxRow).length
                };
            }
            else {
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
            if (typeof docRow !== 'number') {
                throw new TypeError("docRow must be a number");
            }
            if (typeof docColumn !== 'number') {
                throw new TypeError("docColumn must be a number");
            }
            var pos = this.$clipPositionToDocument(docRow, docColumn);
            docRow = pos.row;
            docColumn = pos.column;
            if (typeof docRow !== 'number') {
                throw new TypeError("docRow must be a number");
            }
            if (typeof docColumn !== 'number') {
                throw new TypeError("docColumn must be a number");
            }
            var screenRow = 0;
            var foldStartRow = null;
            var fold = null;
            fold = this.getFoldAt(docRow, docColumn, 1);
            if (fold) {
                docRow = fold.start.row;
                docColumn = fold.start.column;
            }
            var rowEnd;
            var row = 0;
            var rowCache = this.$docRowCache;
            var i = this.$getRowCacheIndex(rowCache, docRow);
            var l = rowCache.length;
            if (l && i >= 0) {
                row = rowCache[i];
                screenRow = this.$screenRowCache[i];
                var doCache = docRow > rowCache[l - 1];
            }
            else {
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
                }
                else {
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
            }
            else {
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
        EditSession.prototype.documentToScreenRange = function (range) {
            var screenPosStart = this.documentToScreenPosition(range.start.row, range.start.column);
            var screenPosEnd = this.documentToScreenPosition(range.end.row, range.end.column);
            return new Range_1.default(screenPosStart.row, screenPosStart.column, screenPosEnd.row, screenPosEnd.column);
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
            }
            else {
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
        EditSession.prototype.findOpeningBracket = function (bracket, position, typeRe) {
            return this.$bracketMatcher.findOpeningBracket(bracket, position, typeRe);
        };
        EditSession.prototype.findClosingBracket = function (bracket, position, typeRe) {
            return this.$bracketMatcher.findClosingBracket(bracket, position, typeRe);
        };
        EditSession.prototype.getFoldAt = function (row, column, side) {
            var foldLine = this.getFoldLine(row);
            if (!foldLine)
                return null;
            var folds = foldLine.folds;
            for (var i = 0; i < folds.length; i++) {
                var fold = folds[i];
                if (fold.range.contains(row, column)) {
                    if (side === 1 && fold.range.isEnd(row, column)) {
                        continue;
                    }
                    else if (side === -1 && fold.range.isStart(row, column)) {
                        continue;
                    }
                    return fold;
                }
            }
        };
        EditSession.prototype.getFoldsInRange = function (range) {
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
                    }
                    else if (cmp == 2) {
                        continue;
                    }
                    else if (cmp == 42) {
                        break;
                    }
                    foundFolds.push(fold);
                }
            }
            start.column -= 1;
            end.column += 1;
            return foundFolds;
        };
        EditSession.prototype.getFoldsInRangeList = function (ranges) {
            var _this = this;
            var folds = [];
            if (Array.isArray(ranges)) {
                ranges.forEach(function (range) {
                    folds = folds.concat(_this.getFoldsInRange(range));
                });
            }
            else {
                throw new TypeError("ranges must be a RangeBasic[]");
            }
            return folds;
        };
        EditSession.prototype.getAllFolds = function () {
            var folds = [];
            var foldLines = this.$foldData;
            for (var i = 0; i < foldLines.length; i++)
                for (var j = 0; j < foldLines[i].folds.length; j++)
                    folds.push(foldLines[i].folds[j]);
            return folds;
        };
        EditSession.prototype.getFoldStringAt = function (row, column, trim, foldLine) {
            foldLine = foldLine || this.getFoldLine(row);
            if (!foldLine)
                return null;
            var lastFold = {
                end: { column: 0 }
            };
            var str;
            var fold;
            for (var i = 0; i < foldLine.folds.length; i++) {
                fold = foldLine.folds[i];
                var cmp = fold.range.compareEnd(row, column);
                if (cmp == -1) {
                    str = this.getLine(fold.start.row).substring(lastFold.end.column, fold.start.column);
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
        EditSession.prototype.getFoldLine = function (docRow, startFoldLine) {
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
                }
                else if (foldLine.end.row > docRow) {
                    return null;
                }
            }
            return null;
        };
        EditSession.prototype.getNextFoldLine = function (docRow, startFoldLine) {
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
        EditSession.prototype.getFoldedRowCount = function (first, last) {
            var foldData = this.$foldData;
            var rowCount = last - first + 1;
            for (var i = 0; i < foldData.length; i++) {
                var foldLine = foldData[i], end = foldLine.end.row, start = foldLine.start.row;
                if (end >= last) {
                    if (start < last) {
                        if (start >= first)
                            rowCount -= last - start;
                        else
                            rowCount = 0;
                    }
                    break;
                }
                else if (end >= first) {
                    if (start >= first)
                        rowCount -= end - start;
                    else
                        rowCount -= end - first + 1;
                }
            }
            return rowCount;
        };
        EditSession.prototype.$addFoldLine = function (foldLine) {
            this.$foldData.push(foldLine);
            this.$foldData.sort(function (a, b) {
                return a.start.row - b.start.row;
            });
            return foldLine;
        };
        EditSession.prototype.addFold = function (placeholder, range) {
            var foldData = this.$foldData;
            var added = false;
            var fold;
            if (placeholder instanceof Fold_1.default)
                fold = placeholder;
            else if (typeof placeholder === 'string') {
                fold = new Fold_1.default(range, placeholder);
                fold.collapseChildren = range.collapseChildren;
            }
            else {
                throw new Error("placeholder must be a string or a Fold.");
            }
            fold.range = this.$clipRangeToDocument(fold.range);
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
            if ((startFold && !startFold.range.isStart(startRow, startColumn))
                || (endFold && !endFold.range.isEnd(endRow, endColumn))) {
                throw new Error("A fold can't intersect already existing fold" + fold.range + startFold.range);
            }
            var folds = this.getFoldsInRange(fold.range);
            if (folds.length > 0) {
                this.removeFolds(folds);
                folds.forEach(function (subFold) {
                    fold.addSubFold(subFold);
                });
            }
            for (var i = 0; i < foldData.length; i++) {
                var foldLine = foldData[i];
                if (endRow == foldLine.start.row) {
                    foldLine.addFold(fold);
                    added = true;
                    break;
                }
                else if (startRow == foldLine.end.row) {
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
                }
                else if (endRow <= foldLine.start.row) {
                    break;
                }
            }
            if (!added)
                foldLine = this.$addFoldLine(new FoldLine_1.default(this.$foldData, [fold]));
            if (this.$useWrapMode)
                this.$updateWrapData(foldLine.start.row, foldLine.start.row);
            else
                this.$updateRowLengthCache(foldLine.start.row, foldLine.start.row);
            this.setModified(true);
            var foldEvent = { data: fold, action: "add" };
            this.eventBus._emit("changeFold", foldEvent);
            return fold;
        };
        EditSession.prototype.setModified = function (modified) {
        };
        EditSession.prototype.addFolds = function (folds) {
            folds.forEach(function (fold) {
                this.addFold(fold);
            }, this);
        };
        EditSession.prototype.removeFold = function (fold) {
            var foldLine = fold.foldLine;
            var startRow = foldLine.start.row;
            var endRow = foldLine.end.row;
            var foldLines = this.$foldData;
            var folds = foldLine.folds;
            if (folds.length === 1) {
                foldLines.splice(foldLines.indexOf(foldLine), 1);
            }
            else if (foldLine.range.isEnd(fold.end.row, fold.end.column)) {
                folds.pop();
                foldLine.end.row = folds[folds.length - 1].end.row;
                foldLine.end.column = folds[folds.length - 1].end.column;
            }
            else if (foldLine.range.isStart(fold.start.row, fold.start.column)) {
                folds.shift();
                foldLine.start.row = folds[0].start.row;
                foldLine.start.column = folds[0].start.column;
            }
            else if (fold.sameRow) {
                folds.splice(folds.indexOf(fold), 1);
            }
            else {
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
            this.setModified(true);
            var foldEvent = { data: fold, action: "remove" };
            this.eventBus._emit("changeFold", foldEvent);
        };
        EditSession.prototype.removeFolds = function (folds) {
            var cloneFolds = [];
            for (var i = 0; i < folds.length; i++) {
                cloneFolds.push(folds[i]);
            }
            cloneFolds.forEach(function (fold) {
                this.removeFold(fold);
            }, this);
            this.setModified(true);
        };
        EditSession.prototype.expandFold = function (fold) {
            this.removeFold(fold);
            fold.subFolds.forEach(function (subFold) {
                fold.restoreRange(subFold);
                this.addFold(subFold);
            }, this);
            if (fold.collapseChildren > 0) {
                this.foldAll(fold.start.row + 1, fold.end.row, fold.collapseChildren - 1);
            }
            fold.subFolds = [];
        };
        EditSession.prototype.expandFolds = function (folds) {
            folds.forEach(function (fold) {
                this.expandFold(fold);
            }, this);
        };
        EditSession.prototype.unfold = function (location, expandInner) {
            var range;
            var folds;
            if (location == null) {
                range = new Range_1.default(0, 0, this.getLength(), 0);
                expandInner = true;
            }
            else if (typeof location === "number")
                range = new Range_1.default(location, 0, location, this.getLine(location).length);
            else if ("row" in location)
                range = Range_1.default.fromPoints(location, location);
            else if (location instanceof Range_1.default) {
                range = location;
            }
            else {
                throw new TypeError("location must be one of number | Position | Range");
            }
            folds = this.getFoldsInRangeList([range]);
            if (expandInner) {
                this.removeFolds(folds);
            }
            else {
                var subFolds = folds;
                while (subFolds.length) {
                    this.expandFolds(subFolds);
                    subFolds = this.getFoldsInRangeList([range]);
                }
            }
            if (folds.length)
                return folds;
        };
        EditSession.prototype.isRowFolded = function (docRow, startFoldRow) {
            return !!this.getFoldLine(docRow, startFoldRow);
        };
        EditSession.prototype.getRowFoldEnd = function (docRow, startFoldRow) {
            var foldLine = this.getFoldLine(docRow, startFoldRow);
            return foldLine ? foldLine.end.row : docRow;
        };
        EditSession.prototype.getRowFoldStart = function (docRow, startFoldRow) {
            var foldLine = this.getFoldLine(docRow, startFoldRow);
            return foldLine ? foldLine.start.row : docRow;
        };
        EditSession.prototype.getFoldDisplayLine = function (foldLine, endRow, endColumn, startRow, startColumn) {
            if (startRow == null)
                startRow = foldLine.start.row;
            if (startColumn == null)
                startColumn = 0;
            if (endRow == null)
                endRow = foldLine.end.row;
            if (endColumn == null)
                endColumn = this.getLine(endRow).length;
            var self = this;
            var textLine = "";
            foldLine.walk(function (placeholder, row, column, lastColumn) {
                if (row < startRow)
                    return;
                if (row == startRow) {
                    if (column < startColumn)
                        return;
                    lastColumn = Math.max(startColumn, lastColumn);
                }
                if (placeholder != null) {
                    textLine += placeholder;
                }
                else {
                    textLine += self.getLine(row).substring(lastColumn, column);
                }
            }, endRow, endColumn);
            return textLine;
        };
        EditSession.prototype.getDisplayLine = function (row, endColumn, startRow, startColumn) {
            var foldLine = this.getFoldLine(row);
            if (!foldLine) {
                var line;
                line = this.getLine(row);
                return line.substring(startColumn || 0, endColumn || line.length);
            }
            else {
                return this.getFoldDisplayLine(foldLine, row, endColumn, startRow, startColumn);
            }
        };
        EditSession.prototype.$cloneFoldData = function () {
            var fd = [];
            fd = this.$foldData.map(function (foldLine) {
                var folds = foldLine.folds.map(function (fold) {
                    return fold.clone();
                });
                return new FoldLine_1.default(fd, folds);
            });
            return fd;
        };
        EditSession.prototype.toggleFold = function (tryToUnfold) {
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
                }
                else if (bracketPos = this.findMatchingBracket(cursor)) {
                    if (range.comparePoint(bracketPos) == 1) {
                        range.end = bracketPos;
                    }
                    else {
                        range.start = bracketPos;
                        range.start.column++;
                        range.end.column--;
                    }
                }
                else if (bracketPos = this.findMatchingBracket({ row: cursor.row, column: cursor.column + 1 })) {
                    if (range.comparePoint(bracketPos) === 1)
                        range.end = bracketPos;
                    else
                        range.start = bracketPos;
                    range.start.column++;
                }
                else {
                    range = this.getCommentFoldRange(cursor.row, cursor.column) || range;
                }
            }
            else {
                var folds = this.getFoldsInRange(range);
                if (tryToUnfold && folds.length) {
                    this.expandFolds(folds);
                    return;
                }
                else if (folds.length == 1) {
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
                if (placeholder.length < 4)
                    return;
                placeholder = placeholder.trim().substring(0, 2) + "..";
            }
            this.addFold(placeholder, range);
        };
        EditSession.prototype.getCommentFoldRange = function (row, column, dir) {
            var iterator = new TokenIterator_1.default(this, row, column);
            var token = iterator.getCurrentToken();
            if (token && /^comment|string/.test(token.type)) {
                var range = new Range_1.default(0, 0, 0, 0);
                var re = new RegExp(token.type.replace(/\..*/, "\\."));
                if (dir != 1) {
                    do {
                        token = iterator.stepBackward();
                    } while (token && re.test(token.type));
                    iterator.stepForward();
                }
                range.start.row = iterator.getCurrentTokenRow();
                range.start.column = iterator.getCurrentTokenColumn() + 2;
                iterator = new TokenIterator_1.default(this, row, column);
                if (dir != -1) {
                    do {
                        token = iterator.stepForward();
                    } while (token && re.test(token.type));
                    token = iterator.stepBackward();
                }
                else
                    token = iterator.getCurrentToken();
                range.end.row = iterator.getCurrentTokenRow();
                range.end.column = iterator.getCurrentTokenColumn() + token.value.length - 2;
                return range;
            }
        };
        EditSession.prototype.foldAll = function (startRow, endRow, depth) {
            if (depth === void 0) {
                depth = 100000;
            }
            var foldWidgets = this.foldWidgets;
            if (!foldWidgets) {
                return;
            }
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
                    && range.start.row >= startRow) {
                    row = range.end.row;
                    try {
                        var fold = this.addFold("...", range);
                        if (fold)
                            fold.collapseChildren = depth;
                    }
                    catch (e) { }
                }
            }
        };
        EditSession.prototype.setFoldStyle = function (style) {
            if (!this.$foldStyles[style])
                throw new Error("invalid fold style: " + style + "[" + Object.keys(this.$foldStyles).join(", ") + "]");
            if (this.$foldStyle === style)
                return;
            this.$foldStyle = style;
            if (style === "manual")
                this.unfold();
            var mode = this.$foldMode;
            this.$setFolding(null);
            this.$setFolding(mode);
        };
        EditSession.prototype.$setFolding = function (foldMode) {
            if (this.$foldMode == foldMode)
                return;
            this.$foldMode = foldMode;
            this.eventBus.off('change', this.$updateFoldWidgets);
            this.eventBus._emit("changeAnnotation");
            if (!foldMode || this.$foldStyle === "manual") {
                this.foldWidgets = null;
                return;
            }
            this.foldWidgets = [];
            this.getFoldWidget = foldMode.getFoldWidget.bind(foldMode, this, this.$foldStyle);
            this.getFoldWidgetRange = foldMode.getFoldWidgetRange.bind(foldMode, this, this.$foldStyle);
            this.$updateFoldWidgets = this.updateFoldWidgets.bind(this);
            this.eventBus.on('change', this.$updateFoldWidgets);
        };
        EditSession.prototype.getParentFoldRangeData = function (row, ignoreCurrent) {
            var fw = this.foldWidgets;
            if (!fw || (ignoreCurrent && fw[row])) {
                return {};
            }
            var i = row - 1;
            var firstRange;
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
        };
        EditSession.prototype.onFoldWidgetClick = function (row, e) {
            e = e.domEvent;
            var options = {
                children: e.shiftKey,
                all: e.ctrlKey || e.metaKey,
                siblings: e.altKey
            };
            var range = this.$toggleFoldWidget(row, options);
            if (!range) {
                var el = (e.target || e.srcElement);
                if (el && /ace_fold-widget/.test(el.className))
                    el.className += " ace_invalid";
            }
        };
        EditSession.prototype.$toggleFoldWidget = function (row, options) {
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
            }
            else if (options.children) {
                endRow = range ? range.end.row : this.getLength();
                this.foldAll(row + 1, range.end.row, options.all ? 10000 : 0);
            }
            else if (range) {
                if (options.all) {
                    range.collapseChildren = 10000;
                }
                this.addFold("...", range);
            }
            return range;
        };
        EditSession.prototype.toggleFoldWidget = function (toggleParent) {
            var row = this.selection.getCursor().row;
            row = this.getRowFoldStart(row);
            var range = this.$toggleFoldWidget(row, {});
            if (range) {
                return;
            }
            var data = this.getParentFoldRangeData(row, true);
            range = data.range || data.firstRange;
            if (range) {
                row = range.start.row;
                var fold = this.getFoldAt(row, this.getLine(row).length, 1);
                if (fold) {
                    this.removeFold(fold);
                }
                else {
                    this.addFold("...", range);
                }
            }
        };
        EditSession.prototype.updateFoldWidgets = function (delta, editSession) {
            var firstRow = delta.start.row;
            var len = delta.end.row - firstRow;
            if (len === 0) {
                this.foldWidgets[firstRow] = null;
            }
            else if (delta.action === "remove") {
                this.foldWidgets.splice(firstRow, len + 1, null);
            }
            else {
                var args = Array(len + 1);
                args.unshift(firstRow, 1);
                this.foldWidgets.splice.apply(this.foldWidgets, args);
            }
        };
        return EditSession;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EditSession;
    config_1.defineOptions(EditSession.prototype, "session", {
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
                }
                else {
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
                val = val == "auto"
                    ? this.$mode.type != "text"
                    : val != "text";
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
            set: function () { this._signal("changeBreakpoint"); },
            initialValue: 1
        },
        useWorker: {
            set: function (useWorker) {
                this.$useWorker = useWorker;
                this.$stopWorker();
                if (useWorker) {
                    this.$startWorker();
                }
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
            set: function (val) { this._signal("changeOverwrite"); },
            initialValue: false
        },
        newLineMode: {
            set: function (val) { this.doc.setNewLineMode(val); },
            get: function () { return this.doc.getNewLineMode(); },
            handlesSet: true
        },
        mode: {
            set: function (val) { this.setMode(val); },
            get: function () { return this.$modeId; }
        }
    });
});

define('createEditSession',["require", "exports", './EditSession'], function (require, exports, EditSession_1) {
    function createEditSession(doc) {
        return new EditSession_1.default(doc);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createEditSession;
});

define('createFold',["require", "exports", './Fold'], function (require, exports, Fold_1) {
    function createFold(range, placeholder) {
        return new Fold_1.default(range, placeholder);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createFold;
});

define('createFoldLine',["require", "exports", './FoldLine'], function (require, exports, FoldLine_1) {
    function createFoldLine(foldData, folds) {
        return new FoldLine_1.default(foldData, folds);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createFoldLine;
});

define('createRange',["require", "exports", './Range'], function (require, exports, Range_1) {
    function createRange(startRow, startColumn, endRow, endColumn) {
        return new Range_1.default(startRow, startColumn, endRow, endColumn);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createRange;
});

define('dom/appendHTMLLinkElement',["require", "exports", './getDocumentHead'], function (require, exports, getDocumentHead_1) {
    function appendHTMLLinkElement(id, rel, type, href, doc) {
        var link = doc.createElement('link');
        link.id = id;
        link.rel = rel;
        if (typeof type === 'string') {
            link.type = type;
        }
        link.href = href;
        getDocumentHead_1.default(doc).appendChild(link);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = appendHTMLLinkElement;
});

define('dom/hasHTMLStyleElement',["require", "exports"], function (require, exports) {
    function hasHTMLStyleElement(id, doc) {
        var index = 0;
        var styles = doc.getElementsByTagName('style');
        if (styles) {
            while (index < styles.length) {
                if (styles[index++].id === id) {
                    return true;
                }
            }
        }
        return false;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = hasHTMLStyleElement;
});

define('dom/ensureHTMLStyleElement',["require", "exports", './getDocumentHead', './hasHTMLStyleElement'], function (require, exports, getDocumentHead_1, hasHTMLStyleElement_1) {
    function ensureHTMLStyleElement(cssText, id, doc) {
        if (id && hasHTMLStyleElement_1.default(id, doc)) {
            return;
        }
        else {
            var style = doc.createElement('style');
            style.appendChild(doc.createTextNode(cssText));
            if (id) {
                style.id = id;
            }
            getDocumentHead_1.default(doc).appendChild(style);
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ensureHTMLStyleElement;
});

define('dom/hasHTMLLinkElement',["require", "exports"], function (require, exports) {
    function hasHTMLLinkElement(id, doc) {
        var index = 0;
        var links = doc.getElementsByTagName('link');
        if (links) {
            while (index < links.length) {
                if (links[index++].id === id) {
                    return true;
                }
            }
        }
        return false;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = hasHTMLLinkElement;
});

define('layer/AbstractLayer',["require", "exports", "../lib/dom"], function (require, exports, dom_1) {
    "use strict";
    var AbstractLayer = (function () {
        function AbstractLayer(parent, className) {
            this.element = dom_1.createElement('div');
            this.element.className = className;
            parent.appendChild(this.element);
        }
        AbstractLayer.prototype.setCssClass = function (className, include) {
            dom_1.setCssClass(this.element, className, include);
        };
        return AbstractLayer;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AbstractLayer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('layer/CursorLayer',["require", "exports", "../lib/dom", './AbstractLayer'], function (require, exports, dom_1, AbstractLayer_1) {
    "use strict";
    var IE8;
    var CursorLayer = (function (_super) {
        __extends(CursorLayer, _super);
        function CursorLayer(parent) {
            _super.call(this, parent, "ace_layer ace_cursor-layer");
            this.isVisible = false;
            this.isBlinking = true;
            this.blinkInterval = 1000;
            this.smoothBlinking = false;
            this.cursors = [];
            this.$padding = 0;
            if (IE8 === void 0) {
                IE8 = "opacity" in this.element;
            }
            this.cursor = this.addCursor();
            dom_1.addCssClass(this.element, "ace_hidden-cursors");
            this.$updateCursors = this.$updateVisibility.bind(this);
        }
        CursorLayer.prototype.$updateVisibility = function (visible) {
            var cursors = this.cursors;
            for (var i = cursors.length; i--;) {
                cursors[i].style.visibility = visible ? "" : "hidden";
            }
        };
        CursorLayer.prototype.$updateOpacity = function (opaque) {
            var cursors = this.cursors;
            for (var i = cursors.length; i--;) {
                cursors[i].style.opacity = opaque ? "" : "0";
            }
        };
        CursorLayer.prototype.setPadding = function (padding) {
            if (typeof padding === 'number') {
                this.$padding = padding;
            }
            else {
                throw new TypeError("padding must be a number");
            }
        };
        CursorLayer.prototype.setSession = function (session) {
            this.session = session;
        };
        CursorLayer.prototype.setBlinking = function (blinking) {
            if (blinking !== this.isBlinking) {
                this.isBlinking = blinking;
                this.restartTimer();
            }
        };
        CursorLayer.prototype.setBlinkInterval = function (blinkInterval) {
            if (blinkInterval !== this.blinkInterval) {
                this.blinkInterval = blinkInterval;
                this.restartTimer();
            }
        };
        CursorLayer.prototype.setSmoothBlinking = function (smoothBlinking) {
            if (smoothBlinking !== this.smoothBlinking && !IE8) {
                this.smoothBlinking = smoothBlinking;
                dom_1.setCssClass(this.element, "ace_smooth-blinking", smoothBlinking);
                this.$updateCursors(true);
                this.$updateCursors = (smoothBlinking
                    ? this.$updateOpacity
                    : this.$updateVisibility).bind(this);
                this.restartTimer();
            }
        };
        CursorLayer.prototype.addCursor = function () {
            var cursor = dom_1.createElement("div");
            cursor.className = "ace_cursor";
            this.element.appendChild(cursor);
            this.cursors.push(cursor);
            return cursor;
        };
        CursorLayer.prototype.removeCursor = function () {
            if (this.cursors.length > 1) {
                var cursor = this.cursors.pop();
                cursor.parentNode.removeChild(cursor);
                return cursor;
            }
        };
        CursorLayer.prototype.hideCursor = function () {
            this.isVisible = false;
            dom_1.addCssClass(this.element, "ace_hidden-cursors");
            this.restartTimer();
        };
        CursorLayer.prototype.showCursor = function () {
            this.isVisible = true;
            dom_1.removeCssClass(this.element, "ace_hidden-cursors");
            this.restartTimer();
        };
        CursorLayer.prototype.restartTimer = function () {
            var update = this.$updateCursors;
            clearInterval(this.intervalId);
            clearTimeout(this.timeoutId);
            if (this.smoothBlinking) {
                dom_1.removeCssClass(this.element, "ace_smooth-blinking");
            }
            update(true);
            if (!this.isBlinking || !this.blinkInterval || !this.isVisible)
                return;
            if (this.smoothBlinking) {
                setTimeout(function () {
                    dom_1.addCssClass(this.element, "ace_smooth-blinking");
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
        CursorLayer.prototype.getPixelPosition = function (position, onScreen) {
            if (!this.config || !this.session) {
                return { left: 0, top: 0 };
            }
            if (!position) {
                position = this.session.getSelection().getCursor();
            }
            var pos = this.session.documentToScreenPosition(position.row, position.column);
            var cursorLeft = this.$padding + pos.column * this.config.characterWidth;
            var cursorTop = (pos.row - (onScreen ? this.config.firstRowScreen : 0)) * this.config.lineHeight;
            return { left: cursorLeft, top: cursorTop };
        };
        CursorLayer.prototype.update = function (config) {
            this.config = config;
            var selections = this.session.$selectionMarkers;
            var i = 0, cursorIndex = 0;
            if (selections === undefined || selections.length === 0) {
                selections = [{ cursor: null }];
            }
            for (var i = 0, n = selections.length; i < n; i++) {
                var pixelPos = this.getPixelPosition(selections[i].cursor, true);
                if ((pixelPos.top > config.height + config.offset ||
                    pixelPos.top < 0) && i > 1) {
                    continue;
                }
                var style = (this.cursors[cursorIndex++] || this.addCursor()).style;
                style.left = pixelPos.left + "px";
                style.top = pixelPos.top + "px";
                style.width = config.characterWidth + "px";
                style.height = config.lineHeight + "px";
            }
            while (this.cursors.length > cursorIndex) {
                this.removeCursor();
            }
            var overwrite = this.session.getOverwrite();
            this.$setOverwrite(overwrite);
            this.$pixelPos = pixelPos;
            this.restartTimer();
        };
        CursorLayer.prototype.$setOverwrite = function (overwrite) {
            if (overwrite !== this.overwrite) {
                this.overwrite = overwrite;
                if (overwrite)
                    dom_1.addCssClass(this.element, "ace_overwrite-cursors");
                else
                    dom_1.removeCssClass(this.element, "ace_overwrite-cursors");
            }
        };
        CursorLayer.prototype.destroy = function () {
            clearInterval(this.intervalId);
            clearTimeout(this.timeoutId);
        };
        return CursorLayer;
    })(AbstractLayer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CursorLayer;
});

define('layer/FontMetrics',["require", "exports", "../lib/dom", "../lib/lang", "../lib/useragent", "../lib/EventEmitterClass"], function (require, exports, dom_1, lang_1, useragent_1, EventEmitterClass_1) {
    "use strict";
    var CHAR_COUNT = 0;
    var FontMetrics = (function () {
        function FontMetrics(parent, pollingInterval) {
            this.$characterSize = { width: 0, height: 0 };
            this.eventBus = new EventEmitterClass_1.default(this);
            this.el = dom_1.createElement("div");
            this.$setMeasureNodeStyles(this.el.style, true);
            this.$main = dom_1.createElement("div");
            this.$setMeasureNodeStyles(this.$main.style);
            this.$measureNode = dom_1.createElement("div");
            this.$setMeasureNodeStyles(this.$measureNode.style);
            this.el.appendChild(this.$main);
            this.el.appendChild(this.$measureNode);
            parent.appendChild(this.el);
            if (!CHAR_COUNT) {
                this.$testFractionalRect();
            }
            this.$measureNode.innerHTML = lang_1.stringRepeat("X", CHAR_COUNT);
            this.$characterSize = { width: 0, height: 0 };
            this.checkForSizeChanges();
        }
        FontMetrics.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        FontMetrics.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        FontMetrics.prototype.$testFractionalRect = function () {
            var el = dom_1.createElement("div");
            this.$setMeasureNodeStyles(el.style);
            el.style.width = "0.2px";
            document.documentElement.appendChild(el);
            var w = el.getBoundingClientRect().width;
            if (w > 0 && w < 1) {
                CHAR_COUNT = 1;
            }
            else {
                CHAR_COUNT = 100;
            }
            el.parentNode.removeChild(el);
        };
        FontMetrics.prototype.$setMeasureNodeStyles = function (style, isRoot) {
            style.width = style.height = "auto";
            style.left = style.top = "-100px";
            style.visibility = "hidden";
            style.position = "fixed";
            style.whiteSpace = "pre";
            if (useragent_1.isIE < 8) {
                style["font-family"] = "inherit";
            }
            else {
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
                this.eventBus._emit("changeCharacterSize", { data: size });
            }
        };
        FontMetrics.prototype.$pollSizeChanges = function () {
            if (this.$pollSizeChangesTimer) {
                return this.$pollSizeChangesTimer;
            }
            var self = this;
            return this.$pollSizeChangesTimer = setInterval(function () {
                self.checkForSizeChanges();
            }, 500);
        };
        FontMetrics.prototype.setPolling = function (val) {
            if (val) {
                this.$pollSizeChanges();
            }
            else {
                if (this.$pollSizeChangesTimer) {
                    this.$pollSizeChangesTimer;
                }
            }
        };
        FontMetrics.prototype.$measureSizes = function () {
            if (CHAR_COUNT === 1) {
                var rect = null;
                try {
                    rect = this.$measureNode.getBoundingClientRect();
                }
                catch (e) {
                    rect = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 };
                }
                var size = { height: rect.height, width: rect.width };
            }
            else {
                var size = { height: this.$measureNode.clientHeight, width: this.$measureNode.clientWidth / CHAR_COUNT };
            }
            if (size.width === 0 || size.height === 0) {
                return null;
            }
            return size;
        };
        FontMetrics.prototype.$measureCharWidth = function (ch) {
            this.$main.innerHTML = lang_1.stringRepeat(ch, CHAR_COUNT);
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
            if (this.el && this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        };
        return FontMetrics;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FontMetrics;
});

define('lib/escapeHTML',["require", "exports"], function (require, exports) {
    function escapeHTML(str) {
        return str.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = escapeHTML;
    ;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('layer/GutterLayer',["require", "exports", "../lib/dom", './AbstractLayer', "../lib/escapeHTML", "../lib/EventEmitterClass"], function (require, exports, dom_1, AbstractLayer_1, escapeHTML_1, EventEmitterClass_1) {
    "use strict";
    var GutterLayer = (function (_super) {
        __extends(GutterLayer, _super);
        function GutterLayer(parent) {
            _super.call(this, parent, "ace_layer ace_gutter-layer");
            this.gutterWidth = 0;
            this.$annotations = [];
            this.$cells = [];
            this.$fixedWidth = false;
            this.$showLineNumbers = true;
            this.$renderer = "";
            this.$showFoldWidgets = true;
            this.eventBus = new EventEmitterClass_1.default(this);
            this.setShowFoldWidgets(this.$showFoldWidgets);
            this.$updateAnnotations = this.$updateAnnotations.bind(this);
        }
        GutterLayer.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        GutterLayer.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        GutterLayer.prototype.setSession = function (session) {
            if (this.session) {
                this.session.off("change", this.$updateAnnotations);
            }
            this.session = session;
            session.on("change", this.$updateAnnotations);
        };
        GutterLayer.prototype.setAnnotations = function (annotations) {
            this.$annotations = [];
            for (var i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                var row = annotation.row;
                var rowInfo = this.$annotations[row];
                if (!rowInfo) {
                    rowInfo = this.$annotations[row] = { text: [] };
                }
                var annoText = annotation.text;
                annoText = annoText ? escapeHTML_1.default(annoText) : annotation.html || "";
                if (rowInfo.text.indexOf(annoText) === -1)
                    rowInfo.text.push(annoText);
                var type = annotation.type;
                if (type === "error")
                    rowInfo.className = " ace_error";
                else if (type === "warning" && rowInfo.className != " ace_error")
                    rowInfo.className = " ace_warning";
                else if (type === "info" && (!rowInfo.className))
                    rowInfo.className = " ace_info";
            }
        };
        GutterLayer.prototype.$updateAnnotations = function (delta, session) {
            if (!this.$annotations.length) {
                return;
            }
            var firstRow = delta.start.row;
            var len = delta.end.row - firstRow;
            if (len === 0) {
            }
            else if (delta.action === "remove") {
                this.$annotations.splice(firstRow, len + 1, null);
            }
            else {
                var args = new Array(len + 1);
                args.unshift(firstRow, 1);
                this.$annotations.splice.apply(this.$annotations, args);
            }
        };
        GutterLayer.prototype.update = function (config) {
            var session = this.session;
            var firstRow = config.firstRow;
            var lastRow = Math.min(config.lastRow + config.gutterOffset, session.getLength() - 1);
            var fold = session.getNextFoldLine(firstRow);
            var foldStart = fold ? fold.start.row : Infinity;
            var foldWidgets = this.$showFoldWidgets && session['foldWidgets'];
            var breakpoints = session.$breakpoints;
            var decorations = session.$decorations;
            var firstLineNumber = session['$firstLineNumber'];
            var lastLineNumber = 0;
            var gutterRenderer = session['gutterRenderer'] || this.$renderer;
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
                    cell.element = dom_1.createElement("div");
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
                        cell.foldWidget = dom_1.createElement("span");
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
                }
                else {
                    if (cell.foldWidget) {
                        cell.element.removeChild(cell.foldWidget);
                        cell.foldWidget = null;
                    }
                }
                var text = lastLineNumber = gutterRenderer
                    ? gutterRenderer.getText(session, row)
                    : row + firstLineNumber;
                if (text != cell.textNode.data)
                    cell.textNode.data = text;
                row++;
            }
            this.element.style.height = config.minHeight + "px";
            if (this.$fixedWidth || session.$useWrapMode)
                lastLineNumber = session.getLength() + firstLineNumber;
            var gutterWidth = gutterRenderer
                ? gutterRenderer.getWidth(session, lastLineNumber, config)
                : lastLineNumber.toString().length * config.characterWidth;
            var padding = this.$padding || this.$computePadding();
            gutterWidth += padding.left + padding.right;
            if (gutterWidth !== this.gutterWidth && !isNaN(gutterWidth)) {
                this.gutterWidth = gutterWidth;
                this.element.style.width = Math.ceil(this.gutterWidth) + "px";
                this.eventBus._emit("changeGutterWidth", gutterWidth);
            }
        };
        GutterLayer.prototype.setShowLineNumbers = function (show) {
            this.$renderer = !show && {
                getWidth: function () { return ""; },
                getText: function () { return ""; }
            };
        };
        GutterLayer.prototype.getShowLineNumbers = function () {
            return this.$showLineNumbers;
        };
        GutterLayer.prototype.setShowFoldWidgets = function (show) {
            if (show)
                dom_1.addCssClass(this.element, "ace_folding-enabled");
            else
                dom_1.removeCssClass(this.element, "ace_folding-enabled");
            this.$showFoldWidgets = show;
            this.$padding = null;
        };
        GutterLayer.prototype.getShowFoldWidgets = function () {
            return this.$showFoldWidgets;
        };
        GutterLayer.prototype.$computePadding = function () {
            if (!this.element.firstChild) {
                return { left: 0, right: 0 };
            }
            var style = window.getComputedStyle(this.element.firstChild);
            this.$padding = {};
            this.$padding.left = parseInt(style.paddingLeft) + 1 || 0;
            this.$padding.right = parseInt(style.paddingRight) || 0;
            return this.$padding;
        };
        GutterLayer.prototype.getRegion = function (point) {
            var padding = this.$padding || this.$computePadding();
            var rect = this.element.getBoundingClientRect();
            if (point.clientX < padding.left + rect.left) {
                return "markers";
            }
            if (this.$showFoldWidgets && point.clientX > rect.right - padding.right) {
                return "foldWidgets";
            }
        };
        return GutterLayer;
    })(AbstractLayer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GutterLayer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('layer/MarkerLayer',["require", "exports", './AbstractLayer', "../Range"], function (require, exports, AbstractLayer_1, Range_1) {
    "use strict";
    var MarkerLayer = (function (_super) {
        __extends(MarkerLayer, _super);
        function MarkerLayer(parent) {
            _super.call(this, parent, "ace_layer ace_marker-layer");
            this.$padding = 0;
        }
        MarkerLayer.prototype.setPadding = function (padding) {
            this.$padding = padding;
        };
        MarkerLayer.prototype.setSession = function (session) {
            this.session = session;
        };
        MarkerLayer.prototype.setMarkers = function (markers) {
            this.markers = markers;
        };
        MarkerLayer.prototype.update = function (config) {
            var config = config || this.config;
            if (!config) {
                return;
            }
            this.config = config;
            var html = [];
            for (var id in this.markers) {
                var marker = this.markers[id];
                if (!marker.range) {
                    marker.update(html, this, this.session, config);
                    continue;
                }
                if (typeof marker.range.start.row !== 'number') {
                    throw new TypeError();
                }
                if (typeof marker.range.start.column !== 'number') {
                    throw new TypeError();
                }
                if (typeof marker.range.end.row !== 'number') {
                    throw new TypeError();
                }
                if (typeof marker.range.end.row !== 'number') {
                    throw new TypeError();
                }
                var range = marker.range.clipRows(config.firstRow, config.lastRow);
                if (range.isEmpty())
                    continue;
                range = this.session.documentToScreenRange(range);
                if (marker.renderer) {
                    var top = this.$getTop(range.start.row, config);
                    var left = this.$padding + range.start.column * config.characterWidth;
                    marker.renderer(html, range, left, top, config);
                }
                else if (marker.type === "fullLine") {
                    this.drawFullLineMarker(html, range, marker.clazz, config);
                }
                else if (marker.type === "screenLine") {
                    this.drawScreenLineMarker(html, range, marker.clazz, config);
                }
                else if (range.isMultiLine()) {
                    if (marker.type === "text")
                        this.drawTextMarker(html, range, marker.clazz, config);
                    else
                        this.drawMultiLineMarker(html, range, marker.clazz, config);
                }
                else {
                    this.drawSingleLineMarker(html, range, marker.clazz + " ace_start ace_br15", config);
                }
            }
            this.element.innerHTML = html.join("");
        };
        MarkerLayer.prototype.$getTop = function (row, layerConfig) {
            return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
        };
        MarkerLayer.prototype.drawTextMarker = function (stringBuilder, range, clazz, layerConfig, extraStyle) {
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
            var lineRange = new Range_1.default(row, range.start.column, row, curr);
            for (; row <= end; row++) {
                lineRange.start.row = lineRange.end.row = row;
                lineRange.start.column = row === start ? range.start.column : session.getRowWrapIndent(row);
                lineRange.end.column = next;
                prev = curr;
                curr = next;
                next = row + 1 < end ? session.getScreenLastRowColumn(row + 1) : row === end ? 0 : range.end.column;
                this.drawSingleLineMarker(stringBuilder, lineRange, clazz + (row === start ? " ace_start" : "") + " ace_br" + getBorderClass(row === start || row === start + 1 && range.start.column !== 0, prev < curr, curr > next, row === end), layerConfig, row == end ? 0 : 1, extraStyle);
            }
        };
        MarkerLayer.prototype.drawMultiLineMarker = function (stringBuilder, range, clazz, config, extraStyle) {
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
        MarkerLayer.prototype.drawSingleLineMarker = function (stringBuilder, range, clazz, config, extraLength, extraStyle) {
            var height = config.lineHeight;
            var width = (range.end.column + (extraLength || 0) - range.start.column) * config.characterWidth;
            var top = this.$getTop(range.start.row, config);
            var left = this.$padding + range.start.column * config.characterWidth;
            stringBuilder.push("<div class='", clazz, "' style='", "height:", height, "px;", "width:", width, "px;", "top:", top, "px;", "left:", left, "px;", extraStyle || "", "'></div>");
        };
        MarkerLayer.prototype.drawFullLineMarker = function (stringBuilder, range, clazz, config, extraStyle) {
            var top = this.$getTop(range.start.row, config);
            var height = config.lineHeight;
            if (range.start.row !== range.end.row) {
                height += this.$getTop(range.end.row, config) - top;
            }
            stringBuilder.push("<div class='", clazz, "' style='", "height:", height, "px;", "top:", top, "px;", "left:0;right:0;", extraStyle || "", "'></div>");
        };
        MarkerLayer.prototype.drawScreenLineMarker = function (stringBuilder, range, clazz, config, extraStyle) {
            var top = this.$getTop(range.start.row, config);
            var height = config.lineHeight;
            stringBuilder.push("<div class='", clazz, "' style='", "height:", height, "px;", "top:", top, "px;", "left:0;right:0;", extraStyle || "", "'></div>");
        };
        return MarkerLayer;
    })(AbstractLayer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MarkerLayer;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('layer/TextLayer',["require", "exports", "../lib/dom", "../lib/lang", './AbstractLayer', "../lib/EventEmitterClass"], function (require, exports, dom_1, lang_1, AbstractLayer_1, EventEmitterClass_1) {
    "use strict";
    var TextLayer = (function (_super) {
        __extends(TextLayer, _super);
        function TextLayer(parent) {
            _super.call(this, parent, "ace_layer ace_text-layer");
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
            this.eventBus = new EventEmitterClass_1.default(this);
            this.EOL_CHAR = this.EOL_CHAR_LF;
        }
        TextLayer.prototype.updateEolChar = function () {
            var EOL_CHAR = this.session.doc.getNewLineCharacter() === "\n"
                ? this.EOL_CHAR_LF
                : this.EOL_CHAR_CRLF;
            if (this.EOL_CHAR != EOL_CHAR) {
                this.EOL_CHAR = EOL_CHAR;
                return true;
            }
            else {
                return false;
            }
        };
        TextLayer.prototype.setPadding = function (padding) {
            this.$padding = padding;
            this.element.style.padding = "0 " + padding + "px";
        };
        TextLayer.prototype.getLineHeight = function () {
            return this.$fontMetrics.$characterSize.height || 0;
        };
        TextLayer.prototype.getCharacterWidth = function () {
            return this.$fontMetrics.$characterSize.width || 0;
        };
        TextLayer.prototype.$setFontMetrics = function (measure) {
            var _this = this;
            this.$fontMetrics = measure;
            this.$fontMetrics.on("changeCharacterSize", function (e) {
                _this.eventBus._signal("changeCharacterSize", e);
            });
            this.$pollSizeChanges();
        };
        TextLayer.prototype.checkForSizeChanges = function () {
            this.$fontMetrics.checkForSizeChanges();
        };
        TextLayer.prototype.$pollSizeChanges = function () {
            return this.$pollSizeChangesTimer = this.$fontMetrics.$pollSizeChanges();
        };
        TextLayer.prototype.setSession = function (session) {
            this.session = session;
            this.$computeTabString();
        };
        TextLayer.prototype.setShowInvisibles = function (showInvisibles) {
            if (this.showInvisibles === showInvisibles) {
                return false;
            }
            else {
                this.showInvisibles = showInvisibles;
                this.$computeTabString();
                return true;
            }
        };
        TextLayer.prototype.setDisplayIndentGuides = function (displayIndentGuides) {
            if (this.displayIndentGuides === displayIndentGuides) {
                return false;
            }
            else {
                this.displayIndentGuides = displayIndentGuides;
                this.$computeTabString();
                return true;
            }
        };
        TextLayer.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        TextLayer.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        TextLayer.prototype.onChangeTabSize = function () {
            this.$computeTabString();
        };
        TextLayer.prototype.$computeTabString = function () {
            var tabSize = this.session.getTabSize();
            this.tabSize = tabSize;
            var tabStr = this.$tabStrings = ["0"];
            for (var i = 1; i < tabSize + 1; i++) {
                if (this.showInvisibles) {
                    tabStr.push("<span class='ace_invisible ace_invisible_tab'>"
                        + this.TAB_CHAR
                        + lang_1.stringRepeat("\xa0", i - 1)
                        + "</span>");
                }
                else {
                    tabStr.push(lang_1.stringRepeat("\xa0", i));
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
                    var spaceContent = lang_1.stringRepeat(this.SPACE_CHAR, this.tabSize);
                    var tabContent = this.TAB_CHAR + lang_1.stringRepeat("\xa0", this.tabSize - 1);
                }
                else {
                    var spaceContent = lang_1.stringRepeat("\xa0", this.tabSize);
                    var tabContent = spaceContent;
                }
                this.$tabStrings[" "] = "<span class='" + className + spaceClass + "'>" + spaceContent + "</span>";
                this.$tabStrings["\t"] = "<span class='" + className + tabClass + "'>" + tabContent + "</span>";
            }
        };
        TextLayer.prototype.updateLines = function (config, firstRow, lastRow) {
            if (this.config.lastRow != config.lastRow ||
                this.config.firstRow != config.firstRow) {
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
                    }
                    else {
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
        TextLayer.prototype.scrollLines = function (config) {
            var oldConfig = this.config;
            this.config = config;
            if (!oldConfig || oldConfig.lastRow < config.firstRow)
                return this.update(config);
            if (config.lastRow < oldConfig.firstRow)
                return this.update(config);
            var el = this.element;
            if (oldConfig.firstRow < config.firstRow) {
                for (var row = this.session['getFoldedRowCount'](oldConfig.firstRow, config.firstRow - 1); row > 0; row--) {
                    el.removeChild(el.firstChild);
                }
            }
            if (oldConfig.lastRow > config.lastRow) {
                for (var row = this.session['getFoldedRowCount'](config.lastRow + 1, oldConfig.lastRow); row > 0; row--) {
                    el.removeChild(el.lastChild);
                }
            }
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
        TextLayer.prototype.$renderLinesFragment = function (config, firstRow, lastRow) {
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
                var container = dom_1.createElement("div");
                var html = [];
                this.$renderLine(html, row, false, row == foldStart ? foldLine : false);
                container.innerHTML = html.join("");
                if (this.$useLineGroups()) {
                    container.className = 'ace_line_group';
                    fragment.appendChild(container);
                    container.style.height = config.lineHeight * this.session.getRowLength(row) + "px";
                }
                else {
                    while (container.firstChild)
                        fragment.appendChild(container.firstChild);
                }
                row++;
            }
            return fragment;
        };
        TextLayer.prototype.update = function (config) {
            this.config = config;
            var html = [];
            var firstRow = config.firstRow;
            var lastRow = config.lastRow;
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
                    html.push("</div>");
                row++;
            }
            this.element.innerHTML = html.join("");
        };
        TextLayer.prototype.$renderToken = function (stringBuilder, screenColumn, token, value) {
            var self = this;
            var replaceReg = /\t|&|<|( +)|([\x00-\x1f\x80-\xa0\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\u3000\uFEFF])|[\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]/g;
            var replaceFunc = function (c, a, b, tabIdx, idx4) {
                if (a) {
                    return self.showInvisibles ?
                        "<span class='ace_invisible ace_invisible_space'>" + lang_1.stringRepeat(self.SPACE_CHAR, c.length) + "</span>" :
                        lang_1.stringRepeat("\xa0", c.length);
                }
                else if (c == "&") {
                    return "&#38;";
                }
                else if (c == "<") {
                    return "&#60;";
                }
                else if (c == "\t") {
                    var tabSize = self.session.getScreenTabSize(screenColumn + tabIdx);
                    screenColumn += tabSize - 1;
                    return self.$tabStrings[tabSize];
                }
                else if (c == "\u3000") {
                    var classToUse = self.showInvisibles ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                    var space = self.showInvisibles ? self.SPACE_CHAR : "";
                    screenColumn += 1;
                    return "<span class='" + classToUse + "' style='width:" +
                        (self.config.characterWidth * 2) +
                        "px'>" + space + "</span>";
                }
                else if (b) {
                    return "<span class='ace_invisible ace_invisible_space ace_invalid'>" + self.SPACE_CHAR + "</span>";
                }
                else {
                    screenColumn += 1;
                    return "<span class='ace_cjk' style='width:" +
                        (self.config.characterWidth * 2) +
                        "px'>" + c + "</span>";
                }
            };
            var output = value.replace(replaceReg, replaceFunc);
            if (!this.$textToken[token.type]) {
                var classes = "ace_" + token.type.replace(/\./g, " ace_");
                var style = "";
                if (token.type == "fold")
                    style = " style='width:" + (token.value.length * this.config.characterWidth) + "px;' ";
                stringBuilder.push("<span class='", classes, "'", style, ">", output, "</span>");
            }
            else {
                stringBuilder.push(output);
            }
            return screenColumn + value.length;
        };
        TextLayer.prototype.renderIndentGuide = function (stringBuilder, value, max) {
            var cols = value.search(this.$indentGuideRe);
            if (cols <= 0 || cols >= max)
                return value;
            if (value[0] === " ") {
                cols -= cols % this.tabSize;
                stringBuilder.push(lang_1.stringRepeat(this.$tabStrings[" "], cols / this.tabSize));
                return value.substr(cols);
            }
            else if (value[0] == "\t") {
                stringBuilder.push(lang_1.stringRepeat(this.$tabStrings["\t"], cols));
                return value.substr(cols);
            }
            return value;
        };
        TextLayer.prototype.$renderWrappedLine = function (stringBuilder, tokens, splits, onlyContents) {
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
                }
                else {
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
        TextLayer.prototype.$renderSimpleLine = function (stringBuilder, tokens) {
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
        TextLayer.prototype.$renderLine = function (stringBuilder, row, onlyContents, foldLine) {
            if (!foldLine && foldLine != false) {
                foldLine = this.session.getFoldLine(row);
            }
            if (foldLine)
                var tokens = this.$getFoldLineTokens(row, foldLine);
            else
                var tokens = this.session.getTokens(row);
            if (!onlyContents) {
                stringBuilder.push("<div class='ace_line' style='height:", this.config.lineHeight * (this.$useLineGroups() ? 1 : this.session.getRowLength(row)), "px'>");
            }
            if (tokens && tokens.length) {
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
        TextLayer.prototype.$getFoldLineTokens = function (row, foldLine) {
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
                    }
                    else
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
                }
                else {
                    if (isNewRow)
                        tokens = session.getTokens(row);
                    if (tokens.length)
                        addTokens(tokens, lastColumn, column);
                }
            }, foldLine.end.row, this.session.getLine(foldLine.end.row).length);
            return renderTokens;
        };
        TextLayer.prototype.$useLineGroups = function () {
            return this.session.getUseWrapMode();
        };
        TextLayer.prototype.destroy = function () {
            clearInterval(this.$pollSizeChangesTimer);
            if (this.$measureNode) {
                this.$measureNode.parentNode.removeChild(this.$measureNode);
            }
            delete this.$measureNode;
        };
        return TextLayer;
    })(AbstractLayer_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TextLayer;
});

define('ScrollBar',["require", "exports", "./lib/dom", "./lib/event", "./lib/EventEmitterClass"], function (require, exports, dom_1, event_1, EventEmitterClass_1) {
    "use strict";
    var ScrollBar = (function () {
        function ScrollBar(parent, classSuffix) {
            this.eventBus = new EventEmitterClass_1.default(this);
            this.element = dom_1.createElement("div");
            this.element.className = "ace_scrollbar ace_scrollbar" + classSuffix;
            this.inner = dom_1.createElement("div");
            this.inner.className = "ace_scrollbar-inner";
            this.element.appendChild(this.inner);
            parent.appendChild(this.element);
            this.setVisible(false);
            this.skipEvent = false;
            event_1.addListener(this.element, "mousedown", event_1.preventDefault);
        }
        ScrollBar.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        ScrollBar.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        ScrollBar.prototype.setVisible = function (isVisible) {
            this.element.style.display = isVisible ? "" : "none";
            this.isVisible = isVisible;
            return this;
        };
        return ScrollBar;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ScrollBar;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('VScrollBar',["require", "exports", "./lib/event", './ScrollBar', "./lib/dom"], function (require, exports, event_1, ScrollBar_1, dom_1) {
    "use strict";
    var VScrollBar = (function (_super) {
        __extends(VScrollBar, _super);
        function VScrollBar(parent, renderer) {
            _super.call(this, parent, '-v');
            this._scrollTop = 0;
            renderer.$scrollbarWidth = this._width = dom_1.scrollbarWidth(parent.ownerDocument);
            this.inner.style.width = this.element.style.width = (this._width || 15) + 5 + "px";
            event_1.addListener(this.element, "scroll", this.onScroll.bind(this));
        }
        VScrollBar.prototype.onScroll = function () {
            if (!this.skipEvent) {
                this._scrollTop = this.element.scrollTop;
                this.eventBus._emit("scroll", { data: this._scrollTop });
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
    })(ScrollBar_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = VScrollBar;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('HScrollBar',["require", "exports", "./lib/event", './ScrollBar'], function (require, exports, event_1, ScrollBar_1) {
    "use strict";
    var HScrollBar = (function (_super) {
        __extends(HScrollBar, _super);
        function HScrollBar(parent, renderer) {
            _super.call(this, parent, '-h');
            this._scrollLeft = 0;
            this._height = renderer.$scrollbarWidth;
            this.inner.style.height = this.element.style.height = (this._height || 15) + 5 + "px";
            event_1.addListener(this.element, "scroll", this.onScroll.bind(this));
        }
        HScrollBar.prototype.onScroll = function () {
            if (!this.skipEvent) {
                this._scrollLeft = this.element.scrollLeft;
                this.eventBus._emit("scroll", { data: this._scrollLeft });
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
    })(ScrollBar_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HScrollBar;
});

define('RenderLoop',["require", "exports", './lib/event'], function (require, exports, event_1) {
    "use strict";
    var RenderLoop = (function () {
        function RenderLoop(onRender, $window) {
            if ($window === void 0) { $window = window; }
            this.pending = false;
            this.changes = 0;
            this.onRender = onRender;
            this.$window = $window;
        }
        RenderLoop.prototype.schedule = function (change) {
            this.changes = this.changes | change;
            if (!this.pending && this.changes) {
                this.pending = true;
                var self = this;
                event_1.requestAnimationFrame(function () {
                    self.pending = false;
                    var changes;
                    while (changes = self.changes) {
                        self.changes = 0;
                        self.onRender(changes);
                    }
                }, this.$window);
            }
        };
        return RenderLoop;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RenderLoop;
});

define('Renderer',["require", "exports", "./lib/dom", './dom/appendHTMLLinkElement', './dom/ensureHTMLStyleElement', './dom/hasHTMLLinkElement', "./config", "./lib/useragent", "./layer/CursorLayer", "./layer/FontMetrics", "./layer/GutterLayer", "./layer/MarkerLayer", "./layer/TextLayer", "./VScrollBar", "./HScrollBar", "./RenderLoop", "./lib/EventEmitterClass"], function (require, exports, dom_1, appendHTMLLinkElement_1, ensureHTMLStyleElement_1, hasHTMLLinkElement_1, config_1, useragent_1, CursorLayer_1, FontMetrics_1, GutterLayer_1, MarkerLayer_1, TextLayer_1, VScrollBar_1, HScrollBar_1, RenderLoop_1, EventEmitterClass_1) {
    "use strict";
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
    var Renderer = (function () {
        function Renderer(container) {
            var _this = this;
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
            this.eventBus = new EventEmitterClass_1.default(this);
            this.container = container || dom_1.createElement("div");
            this.$keepTextAreaAtCursor = !useragent_1.isOldIE;
            dom_1.addCssClass(this.container, "ace_editor");
            this.$gutter = dom_1.createElement("div");
            this.$gutter.className = "ace_gutter";
            this.container.appendChild(this.$gutter);
            this.scroller = dom_1.createElement("div");
            this.scroller.className = "ace_scroller";
            this.container.appendChild(this.scroller);
            this.content = dom_1.createElement("div");
            this.content.className = "ace_content";
            this.scroller.appendChild(this.content);
            this.$gutterLayer = new GutterLayer_1.default(this.$gutter);
            this.$gutterLayer.on("changeGutterWidth", this.onGutterResize.bind(this));
            this.$markerBack = new MarkerLayer_1.default(this.content);
            var textLayer = this.$textLayer = new TextLayer_1.default(this.content);
            this.canvas = textLayer.element;
            this.$markerFront = new MarkerLayer_1.default(this.content);
            this.$cursorLayer = new CursorLayer_1.default(this.content);
            this.$horizScroll = false;
            this.$vScroll = false;
            this.scrollBarV = new VScrollBar_1.default(this.container, this);
            this.scrollBarH = new HScrollBar_1.default(this.container, this);
            this.scrollBarV.on("scroll", function (event, scrollBar) {
                if (!_this.$scrollAnimation) {
                    _this.session.setScrollTop(event.data - _this.scrollMargin.top);
                }
            });
            this.scrollBarH.on("scroll", function (event, scrollBar) {
                if (!_this.$scrollAnimation) {
                    _this.session.setScrollLeft(event.data - _this.scrollMargin.left);
                }
            });
            this.cursorPos = {
                row: 0,
                column: 0
            };
            this.$fontMetrics = new FontMetrics_1.default(this.container, 500);
            this.$textLayer.$setFontMetrics(this.$fontMetrics);
            this.$textLayer.on("changeCharacterSize", function (event, text) {
                _this.updateCharacterSize();
                _this.onResize(true, _this.gutterWidth, _this.$size.width, _this.$size.height);
                _this.eventBus._signal("changeCharacterSize", event);
            });
            this.$size = {
                width: 0,
                height: 0,
                scrollerHeight: 0,
                scrollerWidth: 0,
                $dirty: true
            };
            this.$loop = new RenderLoop_1.default(this.$renderChanges.bind(this), this.container.ownerDocument.defaultView);
            this.$loop.schedule(CHANGE_FULL);
            this.updateCharacterSize();
            this.setPadding(4);
            config_1.resetOptions(this);
        }
        Renderer.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        Renderer.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        Object.defineProperty(Renderer.prototype, "maxLines", {
            set: function (maxLines) {
                this.$maxLines = maxLines;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Renderer.prototype, "keepTextAreaAtCursor", {
            set: function (keepTextAreaAtCursor) {
                this.$keepTextAreaAtCursor = keepTextAreaAtCursor;
            },
            enumerable: true,
            configurable: true
        });
        Renderer.prototype.setDefaultCursorStyle = function () {
            this.content.style.cursor = "default";
        };
        Renderer.prototype.setCursorLayerOff = function () {
            var noop = function () { };
            this.$cursorLayer.restartTimer = noop;
            this.$cursorLayer.element.style.opacity = "0";
        };
        Renderer.prototype.updateCharacterSize = function () {
            if (this.$textLayer['allowBoldFonts'] !== this.$allowBoldFonts) {
                this.$allowBoldFonts = this.$textLayer['allowBoldFonts'];
                this.setStyle("ace_nobold", !this.$allowBoldFonts);
            }
            this.layerConfig.characterWidth = this.characterWidth = this.$textLayer.getCharacterWidth();
            this.layerConfig.lineHeight = this.lineHeight = this.$textLayer.getLineHeight();
            this.$updatePrintMargin();
        };
        Renderer.prototype.setSession = function (session) {
            if (this.session) {
                this.session.doc.removeChangeNewLineModeListener(this.onChangeNewLineMode);
            }
            this.session = session;
            if (!session) {
                return;
            }
            if (this.scrollMargin.top && session.getScrollTop() <= 0) {
                session.setScrollTop(-this.scrollMargin.top);
            }
            this.$cursorLayer.setSession(session);
            this.$markerBack.setSession(session);
            this.$markerFront.setSession(session);
            this.$gutterLayer.setSession(session);
            this.$textLayer.setSession(session);
            this.$loop.schedule(CHANGE_FULL);
            this.session.$setFontMetrics(this.$fontMetrics);
            this.onChangeNewLineMode = this.onChangeNewLineMode.bind(this);
            this.onChangeNewLineMode();
            this.session.doc.addChangeNewLineModeListener(this.onChangeNewLineMode);
        };
        Renderer.prototype.updateLines = function (firstRow, lastRow, force) {
            if (lastRow === undefined) {
                lastRow = Infinity;
            }
            if (!this.$changedLines) {
                this.$changedLines = { firstRow: firstRow, lastRow: lastRow };
            }
            else {
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
                }
                else {
                    return;
                }
            }
            if (this.$changedLines.firstRow > this.layerConfig.lastRow) {
                return;
            }
            this.$loop.schedule(CHANGE_LINES);
        };
        Renderer.prototype.onChangeNewLineMode = function () {
            this.$loop.schedule(CHANGE_TEXT);
            this.$textLayer.updateEolChar();
        };
        Renderer.prototype.onChangeTabSize = function () {
            if (this.$loop) {
                if (this.$loop.schedule) {
                    this.$loop.schedule(CHANGE_TEXT | CHANGE_MARKER);
                }
            }
            if (this.$textLayer) {
                if (this.$textLayer.onChangeTabSize) {
                    this.$textLayer.onChangeTabSize();
                }
            }
        };
        Renderer.prototype.updateText = function () {
            this.$loop.schedule(CHANGE_TEXT);
        };
        Renderer.prototype.updateFull = function (force) {
            if (force)
                this.$renderChanges(CHANGE_FULL, true);
            else
                this.$loop.schedule(CHANGE_FULL);
        };
        Renderer.prototype.updateFontSize = function () {
            this.$textLayer.checkForSizeChanges();
        };
        Renderer.prototype.$updateSizeAsync = function () {
            if (this.$loop.pending) {
                this.$size.$dirty = true;
            }
            else {
                this.onResize();
            }
        };
        Renderer.prototype.onResize = function (force, gutterWidth, width, height) {
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
        Renderer.prototype.$updateCachedSize = function (force, gutterWidth, width, height) {
            height -= (this.$extraHeight || 0);
            var changes = 0;
            var size = this.$size;
            var oldSize = {
                width: size.width,
                height: size.height,
                scrollerHeight: size.scrollerHeight,
                scrollerWidth: size.scrollerWidth
            };
            if (height && (force || size.height !== height)) {
                size.height = height;
                changes |= CHANGE_SIZE;
                size.scrollerHeight = size.height;
                if (this.$horizScroll)
                    size.scrollerHeight -= this.scrollBarH.height;
                this.scrollBarV.element.style.bottom = this.scrollBarH.height + "px";
                changes = changes | CHANGE_SCROLL;
            }
            if (width && (force || size.width !== width)) {
                changes |= CHANGE_SIZE;
                size.width = width;
                if (gutterWidth == null)
                    gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;
                this.gutterWidth = gutterWidth;
                this.scrollBarH.element.style.left =
                    this.scroller.style.left = gutterWidth + "px";
                size.scrollerWidth = Math.max(0, width - gutterWidth - this.scrollBarV.width);
                this.scrollBarH.element.style.right =
                    this.scroller.style.right = this.scrollBarV.width + "px";
                this.scroller.style.bottom = this.scrollBarH.height + "px";
                if (this.session && this.session.getUseWrapMode() && this.adjustWrapLimit() || force)
                    changes |= CHANGE_FULL;
            }
            size.$dirty = !width || !height;
            if (changes) {
                this.eventBus._signal("resize", oldSize);
            }
            return changes;
        };
        Renderer.prototype.onGutterResize = function () {
            var gutterWidth = this.$showGutter ? this.$gutter.offsetWidth : 0;
            if (gutterWidth !== this.gutterWidth)
                this.$changes |= this.$updateCachedSize(true, gutterWidth, this.$size.width, this.$size.height);
            if (this.session.getUseWrapMode() && this.adjustWrapLimit()) {
                this.$loop.schedule(CHANGE_FULL);
            }
            else if (this.$size.$dirty) {
                this.$loop.schedule(CHANGE_FULL);
            }
            else {
                this.$computeLayerConfig();
                this.$loop.schedule(CHANGE_MARKER);
            }
        };
        Renderer.prototype.adjustWrapLimit = function () {
            var availableWidth = this.$size.scrollerWidth - this.$padding * 2;
            var limit = Math.floor(availableWidth / this.characterWidth);
            return this.session.adjustWrapLimit(limit, this.$showPrintMargin && this.$printMarginColumn);
        };
        Renderer.prototype.setAnimatedScroll = function (animatedScroll) {
            this.setOption("animatedScroll", animatedScroll);
        };
        Renderer.prototype.getAnimatedScroll = function () {
            return this.$animatedScroll;
        };
        Renderer.prototype.setShowInvisibles = function (showInvisibles) {
            this.setOption("showInvisibles", showInvisibles);
        };
        Renderer.prototype.getShowInvisibles = function () {
            return this.getOption("showInvisibles");
        };
        Renderer.prototype.getDisplayIndentGuides = function () {
            return this.getOption("displayIndentGuides");
        };
        Renderer.prototype.setDisplayIndentGuides = function (displayIndentGuides) {
            this.setOption("displayIndentGuides", displayIndentGuides);
        };
        Renderer.prototype.setShowPrintMargin = function (showPrintMargin) {
            this.setOption("showPrintMargin", showPrintMargin);
        };
        Renderer.prototype.getShowPrintMargin = function () {
            return this.getOption("showPrintMargin");
        };
        Renderer.prototype.setPrintMarginColumn = function (printMarginColumn) {
            this.setOption("printMarginColumn", printMarginColumn);
        };
        Renderer.prototype.getPrintMarginColumn = function () {
            return this.getOption("printMarginColumn");
        };
        Renderer.prototype.getShowGutter = function () {
            return this.getOption("showGutter");
        };
        Renderer.prototype.setShowGutter = function (showGutter) {
            return this.setOption("showGutter", showGutter);
        };
        Renderer.prototype.getFadeFoldWidgets = function () {
            return this.getOption("fadeFoldWidgets");
        };
        Renderer.prototype.setFadeFoldWidgets = function (fadeFoldWidgets) {
            this.setOption("fadeFoldWidgets", fadeFoldWidgets);
        };
        Renderer.prototype.setHighlightGutterLine = function (highlightGutterLine) {
            this.setOption("highlightGutterLine", highlightGutterLine);
        };
        Renderer.prototype.getHighlightGutterLine = function () {
            return this.getOption("highlightGutterLine");
        };
        Renderer.prototype.getPixelPosition = function (position, onScreen) {
            return this.$cursorLayer.getPixelPosition(position, onScreen);
        };
        Renderer.prototype.$updateGutterLineHighlight = function () {
            var pos = this.$cursorLayer.$pixelPos;
            var height = this.layerConfig.lineHeight;
            if (this.session.getUseWrapMode()) {
                var cursor = this.session.getSelection().getCursor();
                cursor.column = 0;
                pos = this.getPixelPosition(cursor, true);
                height *= this.session.getRowLength(cursor.row);
            }
            this.$gutterLineHighlight.style.top = pos.top - this.layerConfig.offset + "px";
            this.$gutterLineHighlight.style.height = height + "px";
        };
        Renderer.prototype.$updatePrintMargin = function () {
            if (!this.$showPrintMargin && !this.$printMarginEl)
                return;
            if (!this.$printMarginEl) {
                var containerEl = dom_1.createElement("div");
                containerEl.className = "ace_layer ace_print-margin-layer";
                this.$printMarginEl = dom_1.createElement("div");
                this.$printMarginEl.className = "ace_print-margin";
                containerEl.appendChild(this.$printMarginEl);
                this.content.insertBefore(containerEl, this.content.firstChild);
            }
            var style = this.$printMarginEl.style;
            style.left = ((this.characterWidth * this.$printMarginColumn) + this.$padding) + "px";
            style.visibility = this.$showPrintMargin ? "visible" : "hidden";
            if (this.session && this.session['$wrap'] === -1)
                this.adjustWrapLimit();
        };
        Renderer.prototype.getContainerElement = function () {
            return this.container;
        };
        Renderer.prototype.getMouseEventTarget = function () {
            return this.content;
        };
        Renderer.prototype.getTextAreaContainer = function () {
            return this.container;
        };
        Renderer.prototype.$moveTextAreaToCursor = function () {
            if (!this.$keepTextAreaAtCursor) {
                return;
            }
            var config = this.layerConfig;
            if (!this.$cursorLayer.$pixelPos) {
                console.warn("moveTextAreaToCursor bypassed because cursor layer is not working.");
                return;
            }
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
        Renderer.prototype.getFirstVisibleRow = function () {
            return this.layerConfig.firstRow;
        };
        Renderer.prototype.getFirstFullyVisibleRow = function () {
            return this.layerConfig.firstRow + (this.layerConfig.offset === 0 ? 0 : 1);
        };
        Renderer.prototype.getLastFullyVisibleRow = function () {
            var flint = Math.floor((this.layerConfig.height + this.layerConfig.offset) / this.layerConfig.lineHeight);
            return this.layerConfig.firstRow - 1 + flint;
        };
        Renderer.prototype.getLastVisibleRow = function () {
            return this.layerConfig.lastRow;
        };
        Renderer.prototype.getPadding = function () {
            return this.$padding;
        };
        Renderer.prototype.setPadding = function (padding) {
            if (typeof padding !== 'number') {
                throw new TypeError("padding must be a number");
            }
            this.$padding = padding;
            this.$textLayer.setPadding(padding);
            this.$cursorLayer.setPadding(padding);
            this.$markerFront.setPadding(padding);
            this.$markerBack.setPadding(padding);
            this.$loop.schedule(CHANGE_FULL);
            this.$updatePrintMargin();
        };
        Renderer.prototype.setScrollMargin = function (top, bottom, left, right) {
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
        Renderer.prototype.getHScrollBarAlwaysVisible = function () {
            return this.$hScrollBarAlwaysVisible;
        };
        Renderer.prototype.setHScrollBarAlwaysVisible = function (hScrollBarAlwaysVisible) {
            this.setOption("hScrollBarAlwaysVisible", hScrollBarAlwaysVisible);
        };
        Renderer.prototype.getVScrollBarAlwaysVisible = function () {
            return this.$vScrollBarAlwaysVisible;
        };
        Renderer.prototype.setVScrollBarAlwaysVisible = function (alwaysVisible) {
            this.setOption("vScrollBarAlwaysVisible", alwaysVisible);
        };
        Renderer.prototype.$updateScrollBarV = function () {
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
        Renderer.prototype.$updateScrollBarH = function () {
            this.scrollBarH.setScrollWidth(this.layerConfig.width + 2 * this.$padding + this.scrollMargin.h);
            this.scrollBarH.setScrollLeft(this.scrollLeft + this.scrollMargin.left);
        };
        Renderer.prototype.freeze = function () {
            this.$frozen = true;
        };
        Renderer.prototype.unfreeze = function () {
            this.$frozen = false;
        };
        Renderer.prototype.$renderChanges = function (changes, force) {
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
            this.eventBus._signal("beforeRender");
            var config = this.layerConfig;
            if (changes & CHANGE_FULL ||
                changes & CHANGE_SIZE ||
                changes & CHANGE_TEXT ||
                changes & CHANGE_LINES ||
                changes & CHANGE_SCROLL ||
                changes & CHANGE_H_SCROLL) {
                changes |= this.$computeLayerConfig();
                if (config.firstRow !== this.layerConfig.firstRow && config.firstRowScreen === this.layerConfig.firstRowScreen) {
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
                if (this.$showGutter) {
                    this.$gutterLayer.update(config);
                }
                this.$markerBack.update(config);
                this.$markerFront.update(config);
                this.$cursorLayer.update(config);
                this.$moveTextAreaToCursor();
                if (this.$highlightGutterLine) {
                    this.$updateGutterLineHighlight();
                }
                this.eventBus._signal("afterRender");
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
                if (this.$highlightGutterLine) {
                    this.$updateGutterLineHighlight();
                }
                this.$moveTextAreaToCursor();
                this.eventBus._signal("afterRender");
                return;
            }
            if (changes & CHANGE_TEXT) {
                this.$textLayer.update(config);
                if (this.$showGutter)
                    this.$gutterLayer.update(config);
            }
            else if (changes & CHANGE_LINES) {
                if (this.$updateLines() || (changes & CHANGE_GUTTER) && this.$showGutter)
                    this.$gutterLayer.update(config);
            }
            else if (changes & CHANGE_TEXT || changes & CHANGE_GUTTER) {
                if (this.$showGutter)
                    this.$gutterLayer.update(config);
            }
            if (changes & CHANGE_CURSOR) {
                this.$cursorLayer.update(config);
                this.$moveTextAreaToCursor();
                if (this.$highlightGutterLine) {
                    this.$updateGutterLineHighlight();
                }
            }
            if (changes & (CHANGE_MARKER | CHANGE_MARKER_FRONT)) {
                this.$markerFront.update(config);
            }
            if (changes & (CHANGE_MARKER | CHANGE_MARKER_BACK)) {
                this.$markerBack.update(config);
            }
            this.eventBus._signal("afterRender");
        };
        Renderer.prototype.$autosize = function () {
            var height = this.session.getScreenLength() * this.lineHeight;
            var maxHeight = this.$maxLines * this.lineHeight;
            var desiredHeight = Math.max((this.$minLines || 1) * this.lineHeight, Math.min(maxHeight, height)) + this.scrollMargin.v + (this.$extraHeight || 0);
            var vScroll = height > maxHeight;
            if (desiredHeight !== this.desiredHeight ||
                this.$size.height !== this.desiredHeight || vScroll !== this.$vScroll) {
                if (vScroll !== this.$vScroll) {
                    this.$vScroll = vScroll;
                    this.scrollBarV.setVisible(vScroll);
                }
                var w = this.container.clientWidth;
                this.container.style.height = desiredHeight + "px";
                this.$updateCachedSize(true, this.$gutterWidth, w, desiredHeight);
                this.desiredHeight = desiredHeight;
            }
        };
        Renderer.prototype.$computeLayerConfig = function () {
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
            var horizScroll = !hideScrollbars && (this.$hScrollBarAlwaysVisible ||
                size.scrollerWidth - longestLine - 2 * this.$padding < 0);
            var hScrollChanged = this.$horizScroll !== horizScroll;
            if (hScrollChanged) {
                this.$horizScroll = horizScroll;
                this.scrollBarH.setVisible(horizScroll);
            }
            if (!this.$maxLines && this.$scrollPastEnd) {
                maxHeight += (size.scrollerHeight - this.lineHeight) * this.$scrollPastEnd;
            }
            var vScroll = !hideScrollbars && (this.$vScrollBarAlwaysVisible ||
                size.scrollerHeight - maxHeight < 0);
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
            minHeight = size.scrollerHeight + session.getRowLength(lastRow) * lineHeight +
                firstRowHeight;
            offset = this.scrollTop - firstRowScreen * lineHeight;
            var changes = 0;
            if (this.layerConfig.width !== longestLine)
                changes = CHANGE_H_SCROLL;
            if (hScrollChanged || vScrollChanged) {
                changes = this.$updateCachedSize(true, this.gutterWidth, size.width, size.height);
                this.eventBus._signal("scrollbarVisibilityChanged");
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
        Renderer.prototype.$updateLines = function () {
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
        Renderer.prototype.$getLongestLine = function () {
            var charCount = this.session.getScreenWidth();
            if (this.showInvisibles && !this.session.$useWrapMode)
                charCount += 1;
            return Math.max(this.$size.scrollerWidth - 2 * this.$padding, Math.round(charCount * this.characterWidth));
        };
        Renderer.prototype.updateFrontMarkers = function () {
            this.$markerFront.setMarkers(this.session.getMarkers(true));
            this.$loop.schedule(CHANGE_MARKER_FRONT);
        };
        Renderer.prototype.updateBackMarkers = function () {
            this.$markerBack.setMarkers(this.session.getMarkers(false));
            this.$loop.schedule(CHANGE_MARKER_BACK);
        };
        Renderer.prototype.updateBreakpoints = function () {
            this.$loop.schedule(CHANGE_GUTTER);
        };
        Renderer.prototype.setAnnotations = function (annotations) {
            this.$gutterLayer.setAnnotations(annotations);
            this.$loop.schedule(CHANGE_GUTTER);
        };
        Renderer.prototype.updateCursor = function () {
            this.$loop.schedule(CHANGE_CURSOR);
        };
        Renderer.prototype.hideCursor = function () {
            this.$cursorLayer.hideCursor();
        };
        Renderer.prototype.showCursor = function () {
            this.$cursorLayer.showCursor();
        };
        Renderer.prototype.scrollSelectionIntoView = function (anchor, lead, offset) {
            this.scrollCursorIntoView(anchor, offset);
            this.scrollCursorIntoView(lead, offset);
        };
        Renderer.prototype.scrollCursorIntoView = function (cursor, offset, $viewMargin) {
            if (this.$size.scrollerHeight === 0)
                return;
            var pos = this.getPixelPosition(cursor, false);
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
            }
            else if (scrollTop + this.$size.scrollerHeight - bottomMargin < top + this.lineHeight) {
                if (offset)
                    top += offset * this.$size.scrollerHeight;
                this.session.setScrollTop(top + this.lineHeight - this.$size.scrollerHeight);
            }
            var scrollLeft = this.scrollLeft;
            if (scrollLeft > left) {
                if (left < this.$padding + 2 * this.layerConfig.characterWidth)
                    left = -this.scrollMargin.left;
                this.session.setScrollLeft(left);
            }
            else if (scrollLeft + this.$size.scrollerWidth < left + this.characterWidth) {
                this.session.setScrollLeft(Math.round(left + this.characterWidth - this.$size.scrollerWidth));
            }
            else if (scrollLeft <= this.$padding && left - scrollLeft < this.characterWidth) {
                this.session.setScrollLeft(0);
            }
        };
        Renderer.prototype.getScrollTop = function () {
            return this.session.getScrollTop();
        };
        Renderer.prototype.getScrollLeft = function () {
            return this.session.getScrollLeft();
        };
        Renderer.prototype.getScrollTopRow = function () {
            return this.scrollTop / this.lineHeight;
        };
        Renderer.prototype.getScrollBottomRow = function () {
            return Math.max(0, Math.floor((this.scrollTop + this.$size.scrollerHeight) / this.lineHeight) - 1);
        };
        Renderer.prototype.scrollToRow = function (row) {
            this.session.setScrollTop(row * this.lineHeight);
        };
        Renderer.prototype.alignCursor = function (cursor, alignment) {
            if (typeof cursor === "number")
                cursor = { row: cursor, column: 0 };
            var pos = this.getPixelPosition(cursor, false);
            var h = this.$size.scrollerHeight - this.lineHeight;
            var offset = pos.top - h * (alignment || 0);
            this.session.setScrollTop(offset);
            return offset;
        };
        Renderer.prototype.$calcSteps = function (fromValue, toValue) {
            var i = 0;
            var l = this.STEPS;
            var steps = [];
            var func = function (t, x_min, dx) {
                return dx * (Math.pow(t - 1, 3) + 1) + x_min;
            };
            for (i = 0; i < l; ++i) {
                steps.push(func(i / this.STEPS, fromValue, toValue - fromValue));
            }
            return steps;
        };
        Renderer.prototype.scrollToLine = function (line, center, animate, callback) {
            var pos = this.getPixelPosition({ row: line, column: 0 }, false);
            var offset = pos.top;
            if (center) {
                offset -= this.$size.scrollerHeight / 2;
            }
            var initialScroll = this.scrollTop;
            this.session.setScrollTop(offset);
            if (animate !== false) {
                this.animateScrolling(initialScroll, callback);
            }
        };
        Renderer.prototype.animateScrolling = function (fromValue, callback) {
            var toValue = this.scrollTop;
            if (!this.$animatedScroll) {
                return;
            }
            var _self = this;
            if (fromValue === toValue)
                return;
            if (this.$scrollAnimation) {
                var oldSteps = this.$scrollAnimation.steps;
                if (oldSteps.length) {
                    fromValue = oldSteps[0];
                    if (fromValue === toValue)
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
                }
                else if (toValue != null) {
                    _self.session.$scrollTop = -1;
                    _self.session.setScrollTop(toValue);
                    toValue = null;
                }
                else {
                    _self.$timer = clearInterval(_self.$timer);
                    _self.$scrollAnimation = null;
                    if (callback) {
                        callback();
                    }
                }
            }, 10);
        };
        Renderer.prototype.scrollToY = function (scrollTop) {
            if (this.scrollTop !== scrollTop) {
                this.scrollTop = scrollTop;
                this.$loop.schedule(CHANGE_SCROLL);
            }
        };
        Renderer.prototype.scrollToX = function (scrollLeft) {
            if (this.scrollLeft !== scrollLeft) {
                this.scrollLeft = scrollLeft;
                this.$loop.schedule(CHANGE_H_SCROLL);
            }
        };
        Renderer.prototype.scrollTo = function (x, y) {
            this.session.setScrollTop(y);
            this.session.setScrollLeft(y);
        };
        Renderer.prototype.scrollBy = function (deltaX, deltaY) {
            if (deltaY) {
                this.session.setScrollTop(this.session.getScrollTop() + deltaY);
            }
            if (deltaX) {
                this.session.setScrollLeft(this.session.getScrollLeft() + deltaX);
            }
        };
        Renderer.prototype.isScrollableBy = function (deltaX, deltaY) {
            if (deltaY < 0 && this.session.getScrollTop() >= 1 - this.scrollMargin.top)
                return true;
            if (deltaY > 0 && this.session.getScrollTop() + this.$size.scrollerHeight
                - this.layerConfig.maxHeight < -1 + this.scrollMargin.bottom)
                return true;
            if (deltaX < 0 && this.session.getScrollLeft() >= 1 - this.scrollMargin.left)
                return true;
            if (deltaX > 0 && this.session.getScrollLeft() + this.$size.scrollerWidth
                - this.layerConfig.width < -1 + this.scrollMargin.right)
                return true;
        };
        Renderer.prototype.pixelToScreenCoordinates = function (x, y) {
            var canvasPos = this.scroller.getBoundingClientRect();
            var offset = (x + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth;
            var row = Math.floor((y + this.scrollTop - canvasPos.top) / this.lineHeight);
            var col = Math.round(offset);
            return { row: row, column: col, side: offset - col > 0 ? 1 : -1 };
        };
        Renderer.prototype.screenToTextCoordinates = function (clientX, clientY) {
            var canvasPos = this.scroller.getBoundingClientRect();
            var column = Math.round((clientX + this.scrollLeft - canvasPos.left - this.$padding) / this.characterWidth);
            var row = (clientY + this.scrollTop - canvasPos.top) / this.lineHeight;
            return this.session.screenToDocumentPosition(row, Math.max(column, 0));
        };
        Renderer.prototype.textToScreenCoordinates = function (row, column) {
            var canvasPos = this.scroller.getBoundingClientRect();
            var pos = this.session.documentToScreenPosition(row, column);
            var x = this.$padding + Math.round(pos.column * this.characterWidth);
            var y = pos.row * this.lineHeight;
            return {
                pageX: canvasPos.left + x - this.scrollLeft,
                pageY: canvasPos.top + y - this.scrollTop
            };
        };
        Renderer.prototype.visualizeFocus = function () {
            dom_1.addCssClass(this.container, "ace_focus");
        };
        Renderer.prototype.visualizeBlur = function () {
            dom_1.removeCssClass(this.container, "ace_focus");
        };
        Renderer.prototype.showComposition = function (position) {
            if (!this.$composition)
                this.$composition = {
                    keepTextAreaAtCursor: this.$keepTextAreaAtCursor,
                    cssText: this.textarea.style.cssText
                };
            this.$keepTextAreaAtCursor = true;
            dom_1.addCssClass(this.textarea, "ace_composition");
            this.textarea.style.cssText = "";
            this.$moveTextAreaToCursor();
        };
        Renderer.prototype.setCompositionText = function (text) {
            this.$moveTextAreaToCursor();
        };
        Renderer.prototype.hideComposition = function () {
            if (!this.$composition) {
                return;
            }
            dom_1.removeCssClass(this.textarea, "ace_composition");
            this.$keepTextAreaAtCursor = this.$composition.keepTextAreaAtCursor;
            this.textarea.style.cssText = this.$composition.cssText;
            this.$composition = null;
        };
        Renderer.prototype.setTheme = function (modJs) {
            if (!modJs.cssClass) {
                return;
            }
            ensureHTMLStyleElement_1.default(modJs.cssText, modJs.cssClass, this.container.ownerDocument);
            if (this.theme) {
                dom_1.removeCssClass(this.container, this.theme.cssClass);
            }
            var padding = "padding" in modJs ? modJs.padding : "padding" in (this.theme || {}) ? 4 : this.$padding;
            if (this.$padding && padding !== this.$padding) {
                this.setPadding(padding);
            }
            this.theme = modJs;
            this.addCssClass(modJs.cssClass);
            this.setCssClass("ace_dark", modJs.isDark);
            if (this.$size) {
                this.$size.width = 0;
                this.$updateSizeAsync();
            }
            this.eventBus._emit('themeLoaded', { theme: modJs });
        };
        Renderer.prototype.addCssClass = function (cssClass) {
            dom_1.addCssClass(this.container, cssClass);
        };
        Renderer.prototype.setCssClass = function (className, include) {
            dom_1.setCssClass(this.container, className, include);
        };
        Renderer.prototype.setThemeCss = function (themeId, href) {
            if (href) {
                if (!hasHTMLLinkElement_1.default(themeId, this.container.ownerDocument)) {
                    appendHTMLLinkElement_1.default(themeId, 'stylesheet', 'text/css', href, this.container.ownerDocument);
                }
            }
            this.addCssClass(themeId);
            this.themeId = themeId;
        };
        Renderer.prototype.setThemeDark = function (isDark) {
            this.setCssClass("ace_dark", isDark);
        };
        Renderer.prototype.getTheme = function () {
            return this.themeId;
        };
        Renderer.prototype.setStyle = function (style, include) {
            dom_1.setCssClass(this.container, style, include !== false);
        };
        Renderer.prototype.unsetStyle = function (style) {
            dom_1.removeCssClass(this.container, style);
        };
        Renderer.prototype.setCursorStyle = function (style) {
            if (this.content.style.cursor !== style) {
                this.content.style.cursor = style;
            }
        };
        Renderer.prototype.setMouseCursor = function (cursorStyle) {
            this.content.style.cursor = cursorStyle;
        };
        Renderer.prototype.destroy = function () {
            this.$textLayer.destroy();
            this.$cursorLayer.destroy();
        };
        return Renderer;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Renderer;
    config_1.defineOptions(Renderer.prototype, "renderer", {
        animatedScroll: { initialValue: false },
        showInvisibles: {
            set: function (value) {
                if (this.$textLayer.setShowInvisibles(value))
                    this.$loop.schedule(this.CHANGE_TEXT);
            },
            initialValue: false
        },
        showPrintMargin: {
            set: function () { this.$updatePrintMargin(); },
            initialValue: true
        },
        printMarginColumn: {
            set: function () { this.$updatePrintMargin(); },
            initialValue: 80
        },
        printMargin: {
            set: function (value) {
                if (typeof value === "number")
                    this.$printMarginColumn = value;
                this.$showPrintMargin = !!value;
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
                dom_1.setCssClass(this.$gutter, "ace_fade-fold-widgets", show);
            },
            initialValue: false
        },
        showFoldWidgets: {
            set: function (show) { this.$gutterLayer.setShowFoldWidgets(show); },
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
                    this.$gutterLineHighlight = dom_1.createElement("div");
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
            set: function (fontSize) {
                var that = this;
                that.container.style.fontSize = fontSize;
                that.updateFontSize();
            },
            initialValue: "12px"
        },
        fontFamily: {
            set: function (fontFamily) {
                var that = this;
                that.container.style.fontFamily = fontFamily;
                that.updateFontSize();
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
            set: function (value) {
                value = +value || 0;
                if (this.$scrollPastEnd === value)
                    return;
                this.$scrollPastEnd = value;
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
            set: function (val) { this.setTheme(val); },
            get: function () { return this.themeId || this.theme; },
            initialValue: "./theme/textmate",
            handlesSet: true
        }
    });
});

define('createRenderer',["require", "exports", './Renderer'], function (require, exports, Renderer_1) {
    function createRenderer(container) {
        return new Renderer_1.default(container);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createRenderer;
});

define('createTokenizer',["require", "exports", './Tokenizer'], function (require, exports, Tokenizer_1) {
    function createTokenizer(rules) {
        return new Tokenizer_1.default(rules);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createTokenizer;
});

define('UndoManager',["require", "exports"], function (require, exports) {
    "use strict";
    var UndoManager = (function () {
        function UndoManager() {
            this.reset();
        }
        UndoManager.prototype.execute = function (options) {
            var deltas = options.args[0];
            this._editSession = options.args[1];
            if (options.merge && this.hasUndo()) {
                this._dirtyCounter--;
                deltas = this.$undoStack.pop().concat(deltas);
            }
            this.$undoStack.push(deltas);
            this.$redoStack = [];
            if (this._dirtyCounter < 0) {
                this._dirtyCounter = NaN;
            }
            this._dirtyCounter++;
        };
        UndoManager.prototype.undo = function (dontSelect) {
            var deltas = this.$undoStack.pop();
            var undoSelectionRange = null;
            if (deltas) {
                undoSelectionRange = this._editSession.undoChanges(deltas, dontSelect);
                this.$redoStack.push(deltas);
                this._dirtyCounter--;
            }
            return undoSelectionRange;
        };
        UndoManager.prototype.redo = function (dontSelect) {
            var deltas = this.$redoStack.pop();
            var redoSelectionRange = null;
            if (deltas) {
                redoSelectionRange = this._editSession.redoChanges(deltas, dontSelect);
                this.$undoStack.push(deltas);
                this._dirtyCounter++;
            }
            return redoSelectionRange;
        };
        UndoManager.prototype.reset = function () {
            this.$undoStack = [];
            this.$redoStack = [];
            this.markClean();
        };
        UndoManager.prototype.hasUndo = function () {
            return this.$undoStack.length > 0;
        };
        UndoManager.prototype.hasRedo = function () {
            return this.$redoStack.length > 0;
        };
        UndoManager.prototype.markClean = function () {
            this._dirtyCounter = 0;
        };
        UndoManager.prototype.isClean = function () {
            return this._dirtyCounter === 0;
        };
        return UndoManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UndoManager;
});

define('createUndoManager',["require", "exports", './UndoManager'], function (require, exports, UndoManager_1) {
    function createUndoManager() {
        return new UndoManager_1.default();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createUndoManager;
});

define('worker/WorkerClient',["require", "exports", '../lib/net', '../lib/EventEmitterClass'], function (require, exports, net_1, EventEmitterClass_1) {
    "use strict";
    var WorkerClient = (function () {
        function WorkerClient(workerUrl) {
            this.callbacks = {};
            this.callbackId = 1;
            this.eventBus = new EventEmitterClass_1.default(this);
            this.sendDeltaQueue = this.sendDeltaQueue.bind(this);
            this.changeListener = this.changeListener.bind(this);
            this.onMessage = this.onMessage.bind(this);
            var workerUrl = net_1.qualifyURL(workerUrl);
            try {
                this.$worker = new Worker(workerUrl);
            }
            catch (e) {
                if (e instanceof window['DOMException']) {
                    var blob = this.$workerBlob(workerUrl);
                    var URL = window['URL'] || window['webkitURL'];
                    var blobURL = URL.createObjectURL(blob);
                    this.$worker = new Worker(blobURL);
                    URL.revokeObjectURL(blobURL);
                }
                else {
                    throw e;
                }
            }
            this.$worker.onmessage = this.onMessage;
        }
        WorkerClient.prototype.init = function (scriptImports, moduleName, className) {
            this.$worker.postMessage({
                init: true,
                scriptImports: scriptImports,
                moduleName: moduleName,
                className: className
            });
        };
        WorkerClient.prototype.onMessage = function (event) {
            var origin = event.origin;
            var source = event.source;
            var msg = event.data;
            switch (msg.type) {
                case "log":
                    window.console && console.log && console.log.apply(console, msg.data);
                    break;
                case "event":
                    this.eventBus._signal(msg.name, { data: msg.data });
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
            return net_1.qualifyURL(path);
        };
        WorkerClient.prototype.terminate = function () {
            this.eventBus._signal("terminate", {});
            this.deltaQueue = void 0;
            this.$worker.terminate();
            this.$worker = void 0;
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
        WorkerClient.prototype.invoke = function (cmd, args) {
            var workerClient = this;
            return new Promise(function (resolve, reject) {
                workerClient.call(cmd, args, function (retval) {
                    if (retval.err) {
                        reject(retval.err);
                    }
                    else {
                        resolve(retval.data);
                    }
                });
            });
        };
        WorkerClient.prototype.emit = function (event, data) {
            try {
                if (this.$worker) {
                    this.$worker.postMessage({ event: event, data: { data: data.data } });
                }
            }
            catch (e) {
                console.error(e.stack);
            }
        };
        WorkerClient.prototype.attachToDocument = function (doc) {
            if (this.$doc) {
                if (this.$doc === doc) {
                    return;
                }
                else {
                    this.detachFromDocument();
                }
            }
            this.$doc = doc;
            this.call("setValue", [doc.getValue()]);
            doc.addChangeListener(this.changeListener);
        };
        WorkerClient.prototype.detachFromDocument = function () {
            if (this.$doc) {
                this.$doc.removeChangeListener(this.changeListener);
                this.$doc = null;
            }
        };
        WorkerClient.prototype.changeListener = function (delta, doc) {
            if (!this.deltaQueue) {
                this.deltaQueue = [delta];
                setTimeout(this.sendDeltaQueue, 0);
            }
            else {
                this.deltaQueue.push(delta);
            }
        };
        WorkerClient.prototype.on = function (eventName, callback) {
            this.eventBus.on(eventName, callback, false);
        };
        WorkerClient.prototype.off = function (eventName, callback) {
            this.eventBus.off(eventName, callback);
        };
        WorkerClient.prototype.sendDeltaQueue = function () {
            var doc = this.$doc;
            var queue = this.deltaQueue;
            if (!queue)
                return;
            this.deltaQueue = void 0;
            if (queue.length > 20 && queue.length > doc.getLength() >> 1) {
                this.call("setValue", [doc.getValue()]);
            }
            else {
                this.emit("change", { data: queue });
            }
        };
        WorkerClient.prototype.$workerBlob = function (workerUrl) {
            var script = "importScripts('" + net_1.qualifyURL(workerUrl) + "');";
            try {
                return new Blob([script], { "type": "application/javascript" });
            }
            catch (e) {
                var BlobBuilder = window['BlobBuilder'] || window['WebKitBlobBuilder'] || window['MozBlobBuilder'];
                var blobBuilder = new BlobBuilder();
                blobBuilder.append(script);
                return blobBuilder.getBlob("application/javascript");
            }
        };
        return WorkerClient;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WorkerClient;
});

define('createWorkerClient',["require", "exports", './worker/WorkerClient'], function (require, exports, WorkerClient_1) {
    function createWorkerClient(workerUrl) {
        return new WorkerClient_1.default(workerUrl);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createWorkerClient;
});

define('CompletionList',["require", "exports"], function (require, exports) {
    "use strict";
    var CompletionList = (function () {
        function CompletionList(all, filterText) {
            this.all = all;
            this.filtered = all;
            this.filterText = filterText || "";
        }
        CompletionList.prototype.setFilter = function (filterText) {
            var matches;
            if (filterText.length > this.filterText.length && filterText.lastIndexOf(this.filterText, 0) === 0) {
                matches = this.filtered;
            }
            else {
                matches = this.all;
            }
            this.filterText = filterText;
            matches = this.filterCompletions(matches, this.filterText);
            matches = matches.sort(function (a, b) {
                return b.exactMatch - a.exactMatch || b.score - a.score;
            });
            var prev = null;
            matches = matches.filter(function (item) {
                var caption = item.value || item.caption || item.snippet;
                if (caption === prev)
                    return false;
                prev = caption;
                return true;
            });
            this.filtered = matches;
        };
        CompletionList.prototype.filterCompletions = function (items, needle) {
            var results = [];
            var upper = needle.toUpperCase();
            var lower = needle.toLowerCase();
            loop: for (var i = 0, length = items.length; i < length; i++) {
                var item = items[i];
                var caption = item.value || item.caption || item.snippet;
                if (!caption)
                    continue;
                var lastIndex = -1;
                var matchMask = 0;
                var penalty = 0;
                var index;
                var distance;
                for (var j = 0; j < needle.length; j++) {
                    var i1 = caption.indexOf(lower[j], lastIndex + 1);
                    var i2 = caption.indexOf(upper[j], lastIndex + 1);
                    index = (i1 >= 0) ? ((i2 < 0 || i1 < i2) ? i1 : i2) : i2;
                    if (index < 0)
                        continue loop;
                    distance = index - lastIndex - 1;
                    if (distance > 0) {
                        if (lastIndex === -1)
                            penalty += 10;
                        penalty += distance;
                    }
                    matchMask = matchMask | (1 << index);
                    lastIndex = index;
                }
                item.matchMask = matchMask;
                item.exactMatch = penalty ? 0 : 1;
                item.score = (item.score || 0) - penalty;
                results.push(item);
            }
            return results;
        };
        return CompletionList;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CompletionList;
});

define('autocomplete/retrievePrecedingIdentifier',["require", "exports"], function (require, exports) {
    'use strict';
    var ID_REGEX = /[a-zA-Z_0-9\$\-\u00A2-\uFFFF]/;
    function retrievePrecedingIdentifier(text, pos, regex) {
        regex = regex || ID_REGEX;
        var buf = [];
        for (var i = pos - 1; i >= 0; i--) {
            if (regex.test(text[i]))
                buf.push(text[i]);
            else
                break;
        }
        return buf.reverse().join("");
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = retrievePrecedingIdentifier;
});

define('autocomplete/getCompletionPrefix',["require", "exports", './retrievePrecedingIdentifier'], function (require, exports, retrievePrecedingIdentifier_1) {
    function getCompletionPrefix(editor) {
        var pos = editor.getCursorPosition();
        var line = editor.session.getLine(pos.row);
        var prefix;
        editor.completers.forEach(function (completer) {
            if (completer.identifierRegexps) {
                completer.identifierRegexps.forEach(function (identifierRegex) {
                    if (!prefix && identifierRegex)
                        prefix = retrievePrecedingIdentifier_1.default(line, pos.column, identifierRegex);
                });
            }
        });
        return prefix || retrievePrecedingIdentifier_1.default(line, pos.column);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getCompletionPrefix;
});

define('autocomplete/ListViewPopup',["require", "exports", '../createEditSession', "../Document", "../Renderer", "../Editor", "../Range", "../lib/event", "../lib/lang", "../lib/dom"], function (require, exports, createEditSession_1, Document_1, Renderer_1, Editor_1, Range_1, event_1, lang_1, dom_1) {
    var noop = function () { };
    var ListViewPopup = (function () {
        function ListViewPopup(container) {
            var _this = this;
            this.$borderSize = 1;
            this.imageSize = 0;
            this.hoverMarker = new Range_1.default(-1, 0, -1, Infinity);
            this.selectionMarker = new Range_1.default(-1, 0, -1, Infinity);
            this.isOpen = false;
            this.isTopdown = false;
            this.data = [];
            function createEditor(el) {
                var renderer = new Renderer_1.default(el);
                renderer.content.style.cursor = "default";
                renderer.setStyle("ace_autocomplete");
                renderer.$cursorLayer.restartTimer = noop;
                renderer.$cursorLayer.element.style.opacity = "0";
                renderer.$maxLines = 8;
                renderer.$keepTextAreaAtCursor = false;
                var doc = new Document_1.default("");
                var editSession = createEditSession_1.default(doc);
                var editor = new Editor_1.default(renderer, editSession);
                editor.setHighlightActiveLine(false);
                editor.setShowPrintMargin(false);
                editor.renderer.setShowGutter(false);
                editor.renderer.setHighlightGutterLine(false);
                editor.setOption("displayIndentGuides", false);
                editor.setOption("dragDelay", 150);
                editor.focus = noop;
                editor.$isFocused = true;
                editor.setHighlightActiveLine(false);
                editor.getSession().$searchHighlight.clazz = "ace_highlight-marker";
                return editor;
            }
            var el = dom_1.createElement("div");
            this.editor = createEditor(el);
            if (container) {
                container.appendChild(el);
            }
            el.style.display = "none";
            this.editor.on("mousedown", function (e) {
                var pos = e.getDocumentPosition();
                _this.editor.selection.moveToPosition(pos);
                _this.selectionMarker.start.row = _this.selectionMarker.end.row = pos.row;
                e.stop();
            });
            this.selectionMarkerId = this.editor.getSession().addMarker(this.selectionMarker, "ace_active-line", "fullLine");
            this.setSelectOnHover(false);
            this.editor.on("mousemove", function (e) {
                if (!_this.lastMouseEvent) {
                    _this.lastMouseEvent = e;
                    return;
                }
                if (_this.lastMouseEvent.x === e.x && _this.lastMouseEvent.y === e.y) {
                    return;
                }
                _this.lastMouseEvent = e;
                _this.lastMouseEventScrollTop = _this.editor.renderer.scrollTop;
                var row = _this.lastMouseEvent.getDocumentPosition().row;
                if (_this.hoverMarker.start.row !== row) {
                    if (!_this.hoverMarkerId) {
                        _this.setRow(row);
                    }
                    _this.setHoverMarker(row);
                }
            });
            this.editor.renderer.on("beforeRender", function () {
                if (_this.lastMouseEvent && _this.hoverMarker.start.row !== -1) {
                    _this.lastMouseEvent.$pos = null;
                    var row = _this.lastMouseEvent.getDocumentPosition().row;
                    if (!_this.hoverMarkerId) {
                        _this.setRow(row);
                    }
                    _this.setHoverMarker(row, true);
                }
            });
            this.editor.renderer.on("afterRender", function () {
                var row = _this.getRow();
                var t = _this.editor.renderer.$textLayer;
                var selected = t.element.childNodes[row - t.config.firstRow];
                if (selected === t.selectedNode)
                    return;
                if (t.selectedNode)
                    dom_1.removeCssClass(t.selectedNode, "ace_selected");
                t.selectedNode = selected;
                if (selected)
                    dom_1.addCssClass(selected, "ace_selected");
            });
            var hideHoverMarker = function () { _this.setHoverMarker(-1); };
            event_1.addListener(this.editor.container, "mouseout", hideHoverMarker);
            this.editor.on("hide", hideHoverMarker);
            this.editor.on("changeSelection", hideHoverMarker);
            this.editor.getSession().doc.getLength = function () {
                return _this.data.length;
            };
            this.editor.getSession().doc.getLine = function (i) {
                var data = _this.data[i];
                return (data && data.value) || "";
            };
            var bgTokenizer = this.editor.getSession().bgTokenizer;
            bgTokenizer.tokenizeRow = function (row) {
                var data = _this.data[row];
                var tokens = [];
                if (!data)
                    return tokens;
                if (!data.caption) {
                    data.caption = data.value || data.name;
                }
                var last = -1;
                var flag;
                var c;
                for (var cIndex = 0, length = data.caption.length; cIndex < length; cIndex++) {
                    c = data.caption[cIndex];
                    flag = data.matchMask & (1 << cIndex) ? 1 : 0;
                    if (last !== flag) {
                        tokens.push({ type: data.className || "" + (flag ? "completion-highlight" : ""), value: c });
                        last = flag;
                    }
                    else {
                        tokens[tokens.length - 1].value += c;
                    }
                }
                if (data.meta) {
                    var maxW = _this.editor.renderer.$size.scrollerWidth / _this.editor.renderer.layerConfig.characterWidth;
                    if (data.meta.length + data.caption.length < maxW - 2) {
                        tokens.push({ type: "rightAlignedText", value: data.meta });
                    }
                }
                return tokens;
            };
            bgTokenizer.updateOnChange = noop;
            bgTokenizer.start = noop;
            this.editor.getSession().$computeWidth = function () {
                return _this.screenWidth = 0;
            };
            this.editor.on("changeSelection", function () {
                if (this.isOpen) {
                    this.setRow(this.popup.selection.lead.row);
                }
            });
        }
        ListViewPopup.prototype.show = function (pos, lineHeight, topdownOnly) {
            var el = this.editor.container;
            var screenHeight = window.innerHeight;
            var screenWidth = window.innerWidth;
            var renderer = this.editor.renderer;
            var maxH = renderer.$maxLines * lineHeight * 1.4;
            var top = pos.top + this.$borderSize;
            if (top + maxH > screenHeight - lineHeight && !topdownOnly) {
                el.style.top = "";
                el.style.bottom = screenHeight - top + "px";
                this.isTopdown = false;
            }
            else {
                top += lineHeight;
                el.style.top = top + "px";
                el.style.bottom = "";
                this.isTopdown = true;
            }
            el.style.display = "";
            renderer.$textLayer.checkForSizeChanges();
            var left = pos.left;
            if (left + el.offsetWidth > screenWidth) {
                left = screenWidth - el.offsetWidth;
            }
            el.style.left = left + "px";
            this.editor._signal("show");
            this.lastMouseEvent = null;
            this.isOpen = true;
        };
        ListViewPopup.prototype.hide = function () {
            this.editor.container.style.display = "none";
            this.editor._signal("hide");
            this.isOpen = false;
        };
        ListViewPopup.prototype.setData = function (items) {
            this.editor.setValue(lang_1.stringRepeat("\n", items.length), -1);
            this.data = items || [];
            this.setRow(0);
        };
        ListViewPopup.prototype.getData = function (row) {
            return this.data[row];
        };
        ListViewPopup.prototype.on = function (eventName, callback, capturing) {
            return this.editor.on(eventName, callback, capturing);
        };
        ListViewPopup.prototype.off = function (eventName, callback) {
            return this.editor.off(eventName, callback);
        };
        ListViewPopup.prototype.getTextLeftOffset = function () {
            return this.$borderSize + this.editor.renderer.getPadding() + this.imageSize;
        };
        ListViewPopup.prototype.setSelectOnHover = function (selectOnHover) {
            if (!selectOnHover) {
                this.hoverMarkerId = this.editor.getSession().addMarker(this.hoverMarker, "ace_line-hover", "fullLine");
            }
            else if (this.hoverMarkerId) {
                this.editor.getSession().removeMarker(this.hoverMarkerId);
                this.hoverMarkerId = null;
            }
        };
        ListViewPopup.prototype.setHoverMarker = function (row, suppressRedraw) {
            if (row !== this.hoverMarker.start.row) {
                this.hoverMarker.start.row = this.hoverMarker.end.row = row;
                if (!suppressRedraw) {
                    this.editor.getSession()._emit("changeBackMarker");
                }
                this.editor._emit("changeHoverMarker");
            }
        };
        ListViewPopup.prototype.getHoveredRow = function () {
            return this.hoverMarker.start.row;
        };
        ListViewPopup.prototype.getRow = function () {
            return this.selectionMarker.start.row;
        };
        ListViewPopup.prototype.setRow = function (row) {
            row = Math.max(-1, Math.min(this.data.length, row));
            if (this.selectionMarker.start.row !== row) {
                this.editor.selection.clearSelection();
                this.selectionMarker.start.row = this.selectionMarker.end.row = row || 0;
                this.editor.getSession()._emit("changeBackMarker");
                this.editor.moveCursorTo(row || 0, 0);
                if (this.isOpen) {
                    this.editor._signal("select");
                }
            }
        };
        ListViewPopup.prototype.setThemeCss = function (themeId, href) {
            this.editor.renderer.setThemeCss(themeId, href);
        };
        ListViewPopup.prototype.setThemeDark = function (isDark) {
            this.editor.renderer.setThemeDark(isDark);
        };
        ListViewPopup.prototype.setFontSize = function (fontSize) {
            this.editor.setFontSize(fontSize);
        };
        ListViewPopup.prototype.focus = function () {
            this.editor.focus();
        };
        ListViewPopup.prototype.getLength = function () {
            return this.editor.getSession().getLength();
        };
        Object.defineProperty(ListViewPopup.prototype, "container", {
            get: function () {
                return this.editor.container;
            },
            enumerable: true,
            configurable: true
        });
        return ListViewPopup;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ListViewPopup;
});

define('autocomplete/CompletionManager',["require", "exports", '../Anchor', '../CompletionList', '../lib/lang/createDelayedCall', './getCompletionPrefix', '../keyboard/KeyboardHandler', './ListViewPopup', '../Range', '../editor_protocol'], function (require, exports, Anchor_1, CompletionList_1, createDelayedCall_1, getCompletionPrefix_1, KeyboardHandler_1, ListViewPopup_1, Range_1, editor_protocol_1) {
    var CompletionManager = (function () {
        function CompletionManager() {
            var _this = this;
            this.keyboardHandler = new KeyboardHandler_1.default();
            this.gatherCompletionsId = 0;
            this.autoInsert = false;
            this.autoSelect = true;
            this.exactMatch = false;
            var DETACH = function (editor) { _this.detach(); };
            var DOWN = function (editor) { _this.down(); };
            this.commands = {
                "Up": function (editor) { _this.goTo("up"); },
                "Ctrl-Up|Ctrl-Home": function (editor) { _this.goTo("start"); },
                "Ctrl-Down|Ctrl-End": function (editor) { _this.goTo("end"); },
                "Space": function (editor) { _this.detach(); editor.insert(" ", false); },
                "Return": function (editor) { return _this.insertMatch(); },
                "Shift-Return": function (editor) { _this.insertMatch(true); },
                "Tab": function (editor) {
                    var result = _this.insertMatch();
                    if (!result && !editor.tabstopManager) {
                        _this.goTo("down");
                    }
                    else
                        return result;
                },
                "PageUp": function (editor) { _this.goTo('pageUp'); },
                "PageDown": function (editor) { _this.goTo('pageDown'); }
            };
            this.keyboardHandler.bindKey("Down", DOWN);
            this.keyboardHandler.bindKey("Esc", DETACH);
            this.keyboardHandler.bindKeys(this.commands);
            this.blurListener = function () {
            };
            this.blurListener = this.blurListener.bind(this);
            this.editorChangeSelectionListener = this.editorChangeSelectionListener.bind(this);
            this.mousedownListener = this.mousedownListener.bind(this);
            this.mousewheelListener = this.mousewheelListener.bind(this);
            this.changeTimer = createDelayedCall_1.default(function () {
                _this.updateCompletions(true);
            });
            this.tooltipTimer = createDelayedCall_1.default(function () {
                _this.updateDocTooltip();
            }, 50);
        }
        CompletionManager.prototype.attach = function (editor) {
            if (this.editor) {
                this.detach();
            }
            this.activated = true;
            this.editor = editor;
            if (editor.completionManager !== this) {
                if (editor.completionManager) {
                    editor.completionManager.detach();
                }
                editor.completionManager = this;
            }
            editor.keyBinding.addKeyboardHandler(this.keyboardHandler);
            editor.on("changeSelection", this.editorChangeSelectionListener);
            editor.on("blur", this.blurListener);
            editor.on("mousedown", this.mousedownListener);
            editor.on("mousewheel", this.mousewheelListener);
            this.updateCompletions(false);
        };
        CompletionManager.prototype.detach = function () {
            this.editor.keyBinding.removeKeyboardHandler(this.keyboardHandler);
            this.editor.off("changeSelection", this.editorChangeSelectionListener);
            this.editor.off("blur", this.blurListener);
            this.editor.off("mousedown", this.mousedownListener);
            this.editor.off("mousewheel", this.mousewheelListener);
            this.changeTimer.cancel();
            this.hideDocTooltip();
            this.gatherCompletionsId += 1;
            if (this.popup && this.popup.isOpen) {
                this.popup.hide();
            }
            if (this.base) {
                this.base.detach();
                this.base = null;
            }
            this.activated = false;
            this.completions = null;
        };
        CompletionManager.prototype.insertMatch = function (data) {
            if (!data) {
                data = this.popup.getData(this.popup.getRow());
            }
            if (!data) {
                return;
            }
            if (data.completer && data.completer.insertMatch) {
                data.completer.insertMatch(this.editor);
            }
            else {
                if (this.completions.filterText) {
                    var ranges = this.editor.selection.getAllRanges();
                    for (var i = 0, iLength = ranges.length; i < iLength; i++) {
                        var range = ranges[i];
                        range.start.column -= this.completions.filterText.length;
                        this.editor.getSession().remove(range);
                    }
                }
                if (data.snippet) {
                }
                else {
                    var insertstringCommand = this.editor.commands.getCommandByName(editor_protocol_1.COMMAND_NAME_INSERT_STRING);
                    this.editor.execCommand(insertstringCommand, data.value || data);
                }
            }
            this.detach();
        };
        CompletionManager.prototype.goTo = function (where) {
            var row = this.popup.getRow();
            var max = this.popup.getLength() - 1;
            switch (where) {
                case "up":
                    row = row <= 0 ? max : row - 1;
                    break;
                case "down":
                    row = row >= max ? -1 : row + 1;
                    break;
                case "start":
                    row = 0;
                    break;
                case "end":
                    row = max;
                    break;
                default: {
                }
            }
            this.popup.setRow(row);
        };
        CompletionManager.prototype.down = function () {
            var row = this.popup.getRow();
            var max = this.popup.getLength() - 1;
            row = row >= max ? -1 : row + 1;
            this.popup.setRow(row);
        };
        CompletionManager.prototype.gatherCompletions = function (editor, pos, prefix, callback) {
            var session = editor.getSession();
            this.base = new Anchor_1.default(session.doc, pos.row, pos.column - prefix.length);
            this.base.insertRight = true;
            var matches = [];
            var total = editor.completers.length;
            editor.completers.forEach(function (completer, index) {
                completer.getCompletions(editor, session, pos, prefix, function (err, results) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        if (results) {
                            matches = matches.concat(results);
                        }
                        callback(null, {
                            prefix: prefix,
                            matches: matches,
                            finished: (--total === 0)
                        });
                    }
                });
            });
            return true;
        };
        CompletionManager.prototype.updateCompletions = function (keepPopupPosition) {
            var _this = this;
            var editor = this.editor;
            var pos = editor.getCursorPosition();
            if (keepPopupPosition && this.base && this.completions) {
                var range = new Range_1.default(this.base.row, this.base.column, pos.row, pos.column);
                var prefix = editor.getSession().getTextRange(range);
                if (prefix === this.completions.filterText) {
                    return;
                }
                this.completions.setFilter(prefix);
                if (!this.completions.filtered.length)
                    return this.detach();
                if (this.completions.filtered.length === 1 && this.completions.filtered[0].value === prefix && !this.completions.filtered[0].snippet) {
                    return this.detach();
                }
                this.openPopup(editor, prefix, keepPopupPosition);
            }
            else {
                var _id = this.gatherCompletionsId;
                var prefix = getCompletionPrefix_1.default(editor);
                this.gatherCompletions(editor, pos, prefix, function (err, results) {
                    if (err) {
                        console.warn("gatherCompletions => " + err);
                    }
                    else {
                        var detachIfFinished = function () {
                            if (!results.finished)
                                return;
                            return _this.detach();
                        };
                        var prefix_1 = results.prefix;
                        var matches = results && results.matches;
                        if (!matches || !matches.length)
                            return detachIfFinished();
                        if (prefix_1.indexOf(results.prefix) !== 0 || _id !== _this.gatherCompletionsId) {
                            return;
                        }
                        _this.completions = new CompletionList_1.default(matches);
                        _this.completions.setFilter(prefix_1);
                        var filtered = _this.completions.filtered;
                        if (!filtered.length)
                            return detachIfFinished();
                        if (filtered.length === 1 && filtered[0].value === prefix_1 && !filtered[0].snippet)
                            return detachIfFinished();
                        if (_this.autoInsert && filtered.length === 1) {
                            return _this.insertMatch(filtered[0]);
                        }
                        _this.openPopup(editor, prefix_1, keepPopupPosition);
                    }
                });
            }
        };
        CompletionManager.prototype.openPopup = function (editor, prefix, keepPopupPosition) {
            var _this = this;
            if (!this.popup) {
                this.popup = new ListViewPopup_1.default(document.body || document.documentElement);
                this.popup.on("click", function (e) {
                    _this.insertMatch();
                    e.stop();
                });
                this.popup.focus = this.editor.focus.bind(this.editor);
                this.popup.on('show', this.tooltipTimer.bind(null, null));
                this.popup.on('select', this.tooltipTimer.bind(null, null));
                this.popup.on('changeHoverMarker', this.tooltipTimer.bind(null, null));
            }
            this.popup.setData(this.completions.filtered);
            this.popup.setRow(this.autoSelect ? 0 : -1);
            var renderer = editor.renderer;
            if (!keepPopupPosition) {
                this.popup.setThemeCss(editor.getTheme(), void 0);
                this.popup.setThemeDark(true);
                this.popup.setFontSize(editor.getFontSize());
                var lineHeight = renderer.layerConfig.lineHeight;
                var pos = renderer.getPixelPosition(this.base, true);
                pos.left -= this.popup.getTextLeftOffset();
                var rect = editor.container.getBoundingClientRect();
                pos.top += rect.top - renderer.layerConfig.offset;
                pos.left += rect.left - renderer.scrollLeft;
                pos.left += renderer.gutterWidth;
                this.popup.show(pos, lineHeight);
            }
            else if (keepPopupPosition && !prefix) {
                this.detach();
            }
        };
        CompletionManager.prototype.editorChangeSelectionListener = function (e) {
            var cursor = this.editor.selection.lead;
            if (cursor.row !== this.base.row || cursor.column < this.base.column) {
                this.detach();
            }
            if (this.activated) {
                this.changeTimer.schedule();
            }
            else {
                this.detach();
            }
        };
        CompletionManager.prototype.blurListener = function (e) {
            var el = document.activeElement;
            var textArea = this.editor.textInput.getElement();
            var fromTooltip = e.relatedTarget && e.relatedTarget === this.tooltipNode;
            var container = this.popup && this.popup.container;
            if (el !== textArea && el.parentNode !== container && !fromTooltip && el !== this.tooltipNode && e.relatedTarget !== textArea) {
                this.detach();
            }
        };
        CompletionManager.prototype.mousedownListener = function (e) {
            this.detach();
        };
        CompletionManager.prototype.mousewheelListener = function (e) {
            this.detach();
        };
        CompletionManager.prototype.cancelContextMenu = function () {
            this.editor.cancelMouseContextMenu();
        };
        CompletionManager.prototype.updateDocTooltip = function () {
            var popup = this.popup;
            var all = popup.data;
            var selected = all && (all[popup.getHoveredRow()] || all[popup.getRow()]);
            var doc = null;
            if (!selected || !this.editor || !this.popup.isOpen)
                return this.hideDocTooltip();
            this.editor.completers.some(function (completer) {
                if (completer.getDocTooltip) {
                    doc = completer.getDocTooltip(selected);
                }
                return doc;
            });
            if (!doc)
                doc = selected;
            if (typeof doc === "string") {
                doc = { docText: doc };
            }
            if (!doc || !(doc.docHTML || doc.docText)) {
                return this.hideDocTooltip();
            }
            this.showDocTooltip(doc);
        };
        CompletionManager.prototype.showDocTooltip = function (item) {
            if (!this.tooltipNode) {
                this.tooltipNode = this.editor.container.ownerDocument.createElement('div');
                this.tooltipNode.className = "ace_tooltip ace_doc-tooltip";
                this.tooltipNode.style.margin = '0';
                this.tooltipNode.style.pointerEvents = "auto";
                this.tooltipNode.tabIndex = -1;
                this.tooltipNode.onblur = this.blurListener.bind(this);
            }
            var tooltipNode = this.tooltipNode;
            if (item.docHTML) {
                tooltipNode.innerHTML = item.docHTML;
            }
            else if (item.docText) {
                tooltipNode.textContent = item.docText;
            }
            if (!tooltipNode.parentNode) {
                document.body.appendChild(tooltipNode);
            }
            var popup = this.popup;
            var rect = popup.container.getBoundingClientRect();
            tooltipNode.style.top = popup.container.style.top;
            tooltipNode.style.bottom = popup.container.style.bottom;
            if (window.innerWidth - rect.right < 320) {
                tooltipNode.style.right = window.innerWidth - rect.left + "px";
                tooltipNode.style.left = "";
            }
            else {
                tooltipNode.style.left = (rect.right + 1) + "px";
                tooltipNode.style.right = "";
            }
            tooltipNode.style.display = "block";
        };
        CompletionManager.prototype.hideDocTooltip = function () {
            this.tooltipTimer.cancel();
            if (!this.tooltipNode)
                return;
            var el = this.tooltipNode;
            if (!this.editor.isFocused() && document.activeElement === el) {
                this.editor.focus();
            }
            this.tooltipNode = null;
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        };
        return CompletionManager;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CompletionManager;
});

define('autocomplete/AutoCompleteCommand',["require", "exports", './CompletionManager', '../editor_protocol'], function (require, exports, CompletionManager_1, editor_protocol_1) {
    var AutoCompleteCommand = (function () {
        function AutoCompleteCommand(name) {
            if (name === void 0) { name = editor_protocol_1.COMMAND_NAME_AUTO_COMPLETE; }
            this.name = name;
            this.bindKey = 'Ctrl-Space|Ctrl-Shift-Space|Alt-Space';
            this.exec = function (editor) {
                var manager = editor.completionManager;
                if (!manager) {
                    manager = new CompletionManager_1.default();
                    editor.completionManager = manager;
                }
                manager.autoInsert = true;
                manager.autoSelect = true;
                manager.attach(editor);
                manager.cancelContextMenu();
            };
        }
        return AutoCompleteCommand;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AutoCompleteCommand;
});

define('workspace/getPosition',["require", "exports"], function (require, exports) {
    function getPosition(doc, chars) {
        var lines = doc.getAllLines();
        var count = 0;
        var row = 0;
        for (var i = 0, iLength = lines.length; i < iLength; i++) {
            var line = lines[i];
            if (chars < (count + (line.length + 1))) {
                return { column: chars - count, row: row };
            }
            count += line.length + 1;
            row += 1;
        }
        return { column: chars - count, row: row };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getPosition;
});

define('workspace/LanguageServiceProxy',["require", "exports", '../worker/WorkerClient'], function (require, exports, WorkerClient_1) {
    var LanguageServiceProxy = (function () {
        function LanguageServiceProxy(workerUrl) {
            var _this = this;
            this.callbacks = {};
            this.callbackId = 1;
            this.worker = new WorkerClient_1.default(workerUrl);
            this.worker.on('initAfter', function () {
            });
            this.worker.on('syntaxErrors', function (response) {
                var data = response.data;
                var errors = data.errors;
                var id = data.callbackId;
                var callback = _this.callbacks[id];
                delete _this.callbacks[id];
                callback(null, errors);
            });
            this.worker.on('semanticErrors', function (response) {
                var data = response.data;
                var errors = data.errors;
                var id = data.callbackId;
                var callback = _this.callbacks[id];
                delete _this.callbacks[id];
                callback(null, errors);
            });
            this.worker.on('completions', function (response) {
                var data = response.data;
                var id = data.callbackId;
                var callback = _this.callbacks[id];
                delete _this.callbacks[id];
                if ('err' in data) {
                    callback(data.err);
                }
                else {
                    callback(void 0, data.completions);
                }
            });
            this.worker.on('quickInfo', function (response) {
                var data = response.data;
                var id = data.callbackId;
                var callback = _this.callbacks[id];
                delete _this.callbacks[id];
                if ('err' in data) {
                    callback(data.err);
                }
                else {
                    callback(void 0, data.quickInfo);
                }
            });
            this.worker.on('outputFiles', function (response) {
                var data = response.data;
                var id = data.callbackId;
                var callback = _this.callbacks[id];
                delete _this.callbacks[id];
                if ('err' in data) {
                    callback(data.err);
                }
                else {
                    callback(void 0, data.outputFiles);
                }
            });
        }
        LanguageServiceProxy.prototype.init = function (scriptImports) {
            this.worker.init(scriptImports, 'ace-workers.js', 'LanguageServiceWorker');
        };
        LanguageServiceProxy.prototype.terminate = function () {
            this.worker.terminate();
        };
        LanguageServiceProxy.prototype.setDefaultLibContent = function (content) {
            var message = { data: { 'content': content.replace(/\r\n?/g, '\n') } };
            this.worker.emit("defaultLibContent", message);
        };
        LanguageServiceProxy.prototype.ensureScript = function (fileName, content) {
            var message = { data: { 'fileName': fileName, 'content': content.replace(/\r\n?/g, '\n') } };
            this.worker.emit("ensureScript", message);
        };
        LanguageServiceProxy.prototype.applyDelta = function (fileName, delta) {
            var message = { data: { 'fileName': fileName, 'delta': delta } };
            this.worker.emit("applyDelta", message);
        };
        LanguageServiceProxy.prototype.removeScript = function (fileName) {
            this.worker.emit("removeScript", { data: { 'fileName': fileName } });
        };
        LanguageServiceProxy.prototype.getSyntaxErrors = function (fileName, callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            var message = { data: { fileName: fileName, callbackId: id } };
            this.worker.emit("getSyntaxErrors", message);
        };
        LanguageServiceProxy.prototype.getSemanticErrors = function (fileName, callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            var message = { data: { fileName: fileName, callbackId: id } };
            this.worker.emit("getSemanticErrors", message);
        };
        LanguageServiceProxy.prototype._getCompletionsAtPosition = function (fileName, position, prefix, callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            var message = { data: { fileName: fileName, position: position, prefix: prefix, callbackId: id } };
            this.worker.emit("getCompletionsAtPosition", message);
        };
        LanguageServiceProxy.prototype.getCompletionsAtPosition = function (fileName, position, prefix) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._getCompletionsAtPosition(fileName, position, prefix, function (err, completions) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(completions);
                    }
                });
            });
        };
        LanguageServiceProxy.prototype._getQuickInfoAtPosition = function (fileName, position, callback) {
            var id = this.callbackId++;
            this.callbacks[id] = callback;
            var message = { data: { fileName: fileName, position: position, callbackId: id } };
            this.worker.emit("getQuickInfoAtPosition", message);
        };
        LanguageServiceProxy.prototype.getQuickInfoAtPosition = function (fileName, position) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this._getQuickInfoAtPosition(fileName, position, function (err, quickInfo) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(quickInfo);
                    }
                });
            });
        };
        LanguageServiceProxy.prototype.getOutputFiles = function (fileName) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var id = _this.callbackId++;
                _this.callbacks[id] = function (err, outputFiles) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(outputFiles);
                    }
                };
                var message = { data: { fileName: fileName, callbackId: id } };
                _this.worker.emit("getOutputFiles", message);
            });
        };
        return LanguageServiceProxy;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LanguageServiceProxy;
});

define('workspace/displayPartsToHtml',["require", "exports", "../lib/escapeHTML"], function (require, exports, escapeHTML_1) {
    function replaceNewLine(text) {
        return text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
    }
    function displayPartsToHtml(displayParts) {
        if (displayParts) {
            return displayParts.map(function (displayPart) { return replaceNewLine(escapeHTML_1.default(displayPart.text)); }).join("");
        }
        else {
            return "";
        }
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = displayPartsToHtml;
});

define('workspace/EditorPosition',["require", "exports", '../Range', './getPosition'], function (require, exports, Range_1, getPosition_1) {
    "use strict";
    var EditorPosition = (function () {
        function EditorPosition(editor) {
            this.editor = editor;
        }
        EditorPosition.prototype.getPositionChars = function (pos) {
            var doc = this.editor.getSession().getDocument();
            return EditorPosition.getChars(doc, pos);
        };
        EditorPosition.prototype.getPositionFromChars = function (chars) {
            var doc = this.editor.getSession().getDocument();
            return getPosition_1.default(doc, chars);
        };
        EditorPosition.prototype.getCurrentPositionChars = function () {
            return this.getPositionChars(this.editor.getCursorPosition());
        };
        EditorPosition.prototype.getCurrentLeftChar = function () {
            return this.getPositionLeftChar(this.editor.getCursorPosition());
        };
        EditorPosition.prototype.getTextAtCursorPosition = function (cursor) {
            var range = new Range_1.default(cursor.row, cursor.column, cursor.row, cursor.column + 1);
            return this.editor.getSession().getDocument().getTextRange(range);
        };
        EditorPosition.prototype.getPositionLeftChar = function (cursor) {
            var range = new Range_1.default(cursor.row, cursor.column, cursor.row, cursor.column - 1);
            return this.editor.getSession().getDocument().getTextRange(range);
        };
        EditorPosition.getChars = function (doc, pos) {
            return EditorPosition.getLinesChars(doc.getLines(0, pos.row - 1)) + pos.column;
        };
        EditorPosition.getLinesChars = function (lines) {
            var count = 0;
            lines.forEach(function (line) {
                return count += line.length + 1;
            });
            return count;
        };
        EditorPosition.getPositionChars = function (editor, pos) {
            var doc = editor.getSession().getDocument();
            return EditorPosition.getChars(doc, pos);
        };
        return EditorPosition;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = EditorPosition;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('workspace/QuickInfoTooltip',["require", "exports", './displayPartsToHtml', './EditorPosition', '../Tooltip'], function (require, exports, displayPartsToHtml_1, EditorPosition_1, Tooltip_1) {
    function getDocumentPositionFromScreenOffset(editor, x, y) {
        var renderer = editor.renderer;
        var offset = (x - renderer.getPadding()) / renderer.characterWidth;
        var correction = renderer.scrollTop ? 7 : 0;
        var row = Math.floor((y + renderer.scrollTop - correction) / renderer.lineHeight);
        var col = Math.round(offset);
        return editor.getSession().screenToDocumentPosition(row, col);
    }
    var QuickInfoTooltip = (function (_super) {
        __extends(QuickInfoTooltip, _super);
        function QuickInfoTooltip(fileName, editor, workspace) {
            var _this = this;
            _super.call(this, editor.container);
            this.fileName = fileName;
            this.editor = editor;
            this.workspace = workspace;
            this.mouseHandler = function (event) {
                _this.hide();
                clearTimeout(_this.mouseMoveTimer);
                if (event.srcElement['className'] === 'ace_content') {
                    _this.mouseMoveTimer = setTimeout(function () {
                        var documentPosition = getDocumentPositionFromScreenOffset(_this.editor, event.offsetX, event.offsetY);
                        var position = EditorPosition_1.default.getPositionChars(_this.editor, documentPosition);
                        _this.workspace.getQuickInfoAtPosition(_this.fileName, position)
                            .then(function (quickInfo) {
                            if (quickInfo) {
                                var tip = "<b>" + displayPartsToHtml_1.default(quickInfo.displayParts) + "</b>";
                                if (quickInfo.documentation) {
                                    tip += "<br/><i>" + displayPartsToHtml_1.default(quickInfo.documentation) + "</i>";
                                }
                                if (tip.length > 0) {
                                    _this.setHtml(tip);
                                    _this.setPosition(event.x, event.y + 10);
                                    _this.show();
                                }
                            }
                        })
                            .catch(function (err) {
                        });
                    }, 800);
                }
            };
        }
        QuickInfoTooltip.prototype.init = function () {
            this.editor.container.addEventListener('mousemove', this.mouseHandler);
        };
        QuickInfoTooltip.prototype.terminate = function () {
            this.editor.container.removeEventListener('mousemove', this.mouseHandler);
        };
        return QuickInfoTooltip;
    })(Tooltip_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = QuickInfoTooltip;
});

define('workspace/WorkspaceCompleter',["require", "exports", './EditorPosition'], function (require, exports, EditorPosition_1) {
    "use strict";
    var WorkspaceCompleter = (function () {
        function WorkspaceCompleter(fileName, workspace) {
            this.fileName = fileName;
            this.workspace = workspace;
        }
        WorkspaceCompleter.prototype.getCompletionsAtPosition = function (editor, position, prefix) {
            var _this = this;
            var offset = EditorPosition_1.default.getPositionChars(editor, position);
            return new Promise(function (resolve, reject) {
                _this.workspace.getCompletionsAtPosition(_this.fileName, offset, prefix)
                    .then(function (entries) {
                    resolve(entries.map(function (entry) {
                        return {
                            caption: entry.name,
                            value: entry.name,
                            score: 0,
                            meta: entry.kind
                        };
                    }));
                })
                    .catch(function (err) {
                    reject(err);
                });
            });
        };
        WorkspaceCompleter.prototype.getCompletions = function (editor, session, position, prefix, callback) {
            return this.getCompletionsAtPosition(editor, position, prefix)
                .then(function (completions) {
                callback(void 0, completions);
            })
                .catch(function (err) {
                callback(err);
            });
        };
        return WorkspaceCompleter;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WorkspaceCompleter;
});

define('workspace/Workspace',["require", "exports", '../autocomplete/AutoCompleteCommand', './getPosition', './LanguageServiceProxy', './QuickInfoTooltip', '../Range', './WorkspaceCompleter', '../lib/net'], function (require, exports, AutoCompleteCommand_1, getPosition_1, LanguageServiceProxy_1, QuickInfoTooltip_1, Range_1, WorkspaceCompleter_1, net_1) {
    function diagnosticToAnnotation(doc, diagnostic) {
        var minChar = diagnostic.start;
        var pos = getPosition_1.default(doc, minChar);
        return { row: pos.row, column: pos.column, text: diagnostic.message, type: 'error' };
    }
    var Workspace = (function () {
        function Workspace() {
            this.editors = {};
            this.quickin = {};
            this.mousedn = {};
            this.command = {};
            this.annotationHandlers = {};
            this.changeHandlers = {};
            this.refMarkers = [];
            this.errorMarkerIds = [];
        }
        Workspace.prototype.init = function (workerUrl, scriptImports) {
            this.workerProxy = new LanguageServiceProxy_1.default(workerUrl);
            this.workerProxy.init(scriptImports);
        };
        Workspace.prototype.terminate = function () {
            this.detachEditors();
            this.workerProxy.terminate();
            this.workerProxy = void 0;
        };
        Workspace.prototype.setDefaultLibrary = function (url) {
            var _this = this;
            net_1.get(url, function (sourceCode) {
                if (_this.workerProxy) {
                    _this.workerProxy.setDefaultLibContent(sourceCode);
                }
            });
        };
        Workspace.prototype.attachEditor = function (fileName, editor) {
            var _this = this;
            this.editors[fileName] = editor;
            this.workerProxy.ensureScript(fileName, editor.getValue());
            var changeHandler = function (delta, source) {
                _this.workerProxy.applyDelta(fileName, delta);
                _this.updateMarkerModels(fileName, delta);
            };
            editor.on('change', changeHandler);
            this.changeHandlers[fileName] = changeHandler;
            var annotationsHandler = function (event) {
                _this.semanticDiagnostics();
                _this.outputFiles();
            };
            editor.session.on('annotations', annotationsHandler);
            this.annotationHandlers[fileName] = annotationsHandler;
            editor.commands.addCommand(new AutoCompleteCommand_1.default());
            editor.completers.push(new WorkspaceCompleter_1.default(fileName, this));
            var quickInfo = new QuickInfoTooltip_1.default(fileName, editor, this);
            quickInfo.init();
            this.quickin[fileName] = quickInfo;
        };
        Workspace.prototype.detachEditor = function (fileName, editor) {
            if (this.editors[fileName]) {
                var quickInfo = this.quickin[fileName];
                quickInfo.terminate();
                quickInfo = void 0;
                delete this.quickin[fileName];
                var mousedownHandler = this.mousedn[fileName];
                editor.off("mousedown", mousedownHandler);
                delete this.mousedn[fileName];
                var completeCommand = this.command[fileName];
                editor.commands.removeCommand(completeCommand.name);
                delete this.command[fileName];
                var annotationHandler = this.annotationHandlers[fileName];
                editor.session.off('annotations', annotationHandler);
                delete this.annotationHandlers[fileName];
                var changeHandler = this.changeHandlers[fileName];
                editor.off('change', changeHandler);
                delete this.changeHandlers[fileName];
                this.workerProxy.removeScript(fileName);
                delete this.editors[fileName];
            }
        };
        Workspace.prototype.detachEditors = function () {
            var fileNames = Object.keys(this.editors);
            for (var i = 0, iLength = fileNames.length; i < iLength; i++) {
                var fileName = fileNames[i];
                var editor = this.editors[fileName];
                this.detachEditor(fileName, editor);
            }
        };
        Workspace.prototype.ensureScript = function (fileName, content) {
            return this.workerProxy.ensureScript(fileName, content);
        };
        Workspace.prototype.semanticDiagnostics = function () {
            var fileNames = Object.keys(this.editors);
            for (var i = 0; i < fileNames.length; i++) {
                var fileName = fileNames[i];
                var editor = this.editors[fileName];
                this.semanticDiagnosticsForEditor(fileName, editor);
            }
        };
        Workspace.prototype.updateEditor = function (errors, editor) {
            var _this = this;
            var session = editor.getSession();
            var doc = session.getDocument();
            var annotations = errors.map(function (error) {
                return diagnosticToAnnotation(editor.getSession().getDocument(), error);
            });
            session.setAnnotations(annotations);
            this.errorMarkerIds.forEach(function (markerId) { session.removeMarker(markerId); });
            errors.forEach(function (error) {
                var minChar = error.start;
                var limChar = minChar + error.length;
                var start = getPosition_1.default(doc, minChar);
                var end = getPosition_1.default(doc, limChar);
                var range = new Range_1.default(start.row, start.column, end.row, end.column);
                _this.errorMarkerIds.push(session.addMarker(range, "typescript-error", "text", null, true));
            });
        };
        Workspace.prototype.semanticDiagnosticsForEditor = function (fileName, editor) {
            var _this = this;
            this.workerProxy.getSyntaxErrors(fileName, function (err, syntaxErrors) {
                if (err) {
                    console.warn("getSyntaxErrors(" + fileName + ") => " + err);
                }
                else {
                    _this.updateEditor(syntaxErrors, editor);
                    if (syntaxErrors.length === 0) {
                        _this.workerProxy.getSemanticErrors(fileName, function (err, semanticErrors) {
                            if (err) {
                                console.warn("getSemanticErrors(" + fileName + ") => " + err);
                            }
                            else {
                                _this.updateEditor(semanticErrors, editor);
                            }
                        });
                    }
                }
            });
        };
        Workspace.prototype.outputFiles = function () {
            var fileNames = Object.keys(this.editors);
            for (var i = 0; i < fileNames.length; i++) {
                var fileName = fileNames[i];
                var editor = this.editors[fileName];
                this.outputFilesForEditor(fileName, editor);
            }
        };
        Workspace.prototype.outputFilesForEditor = function (fileName, editor) {
            var session = editor.getSession();
            this.workerProxy.getOutputFiles(fileName)
                .then(function (outputFiles) {
                session._emit("outputFiles", { data: outputFiles });
            })
                .catch(function (err) {
                console.warn("getOutputFiles(" + fileName + ") => " + err);
            });
        };
        Workspace.prototype.getCompletionsAtPosition = function (fileName, position, prefix) {
            return this.workerProxy.getCompletionsAtPosition(fileName, position, prefix);
        };
        Workspace.prototype.getQuickInfoAtPosition = function (fileName, position) {
            return this.workerProxy.getQuickInfoAtPosition(fileName, position);
        };
        Workspace.prototype.removeScript = function (fileName) {
            return this.workerProxy.removeScript(fileName);
        };
        Workspace.prototype.updateMarkerModels = function (fileName, delta) {
            var editor = this.editors[fileName];
            var action = delta.action;
            var markers = editor.getSession().getMarkers(true);
            var line_count = 0;
            if (action === "insert") {
                line_count = delta.lines.length;
            }
            else if (action === "remove") {
                line_count = -delta.lines.length;
            }
            else {
                console.warn("updateMarkerModels(" + fileName + ", " + JSON.stringify(delta) + ")");
            }
            if (line_count !== 0) {
                var markerUpdate = function (markerId) {
                    var marker = markers[markerId];
                    var row = delta.start.row;
                    if (line_count > 0) {
                        row = +1;
                    }
                    if (marker && marker.range.start.row > row) {
                        marker.range.start.row += line_count;
                        marker.range.end.row += line_count;
                    }
                };
                this.errorMarkerIds.forEach(markerUpdate);
                this.refMarkers.forEach(markerUpdate);
                editor.updateFrontMarkers();
            }
        };
        return Workspace;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Workspace;
});

define('workspace/createWorkspace',["require", "exports", './Workspace'], function (require, exports, Workspace_1) {
    function createWorkspace() {
        return new Workspace_1.default();
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createWorkspace;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/CssHighlightRules',["require", "exports", "./TextHighlightRules"], function (require, exports, TextHighlightRules_1) {
    "use strict";
    exports.supportType = "animation-fill-mode|alignment-adjust|alignment-baseline|animation-delay|animation-direction|animation-duration|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|animation|appearance|azimuth|backface-visibility|background-attachment|background-break|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|background|baseline-shift|binding|bleed|bookmark-label|bookmark-level|bookmark-state|bookmark-target|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|border|bottom|box-align|box-decoration-break|box-direction|box-flex-group|box-flex|box-lines|box-ordinal-group|box-orient|box-pack|box-shadow|box-sizing|break-after|break-before|break-inside|caption-side|clear|clip|color-profile|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|crop|cue-after|cue-before|cue|cursor|direction|display|dominant-baseline|drop-initial-after-adjust|drop-initial-after-align|drop-initial-before-adjust|drop-initial-before-align|drop-initial-size|drop-initial-value|elevation|empty-cells|fit|fit-position|float-offset|float|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|font|grid-columns|grid-rows|hanging-punctuation|height|hyphenate-after|hyphenate-before|hyphenate-character|hyphenate-lines|hyphenate-resource|hyphens|icon|image-orientation|image-rendering|image-resolution|inline-box-align|left|letter-spacing|line-height|line-stacking-ruby|line-stacking-shift|line-stacking-strategy|line-stacking|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|margin|mark-after|mark-before|mark|marks|marquee-direction|marquee-play-count|marquee-speed|marquee-style|max-height|max-width|min-height|min-width|move-to|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|orphans|outline-color|outline-offset|outline-style|outline-width|outline|overflow-style|overflow-x|overflow-y|overflow|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page-policy|page|pause-after|pause-before|pause|perspective-origin|perspective|phonemes|pitch-range|pitch|play-during|pointer-events|position|presentation-level|punctuation-trim|quotes|rendering-intent|resize|rest-after|rest-before|rest|richness|right|rotation-point|rotation|ruby-align|ruby-overhang|ruby-position|ruby-span|size|speak-header|speak-numeral|speak-punctuation|speak|speech-rate|stress|string-set|table-layout|target-name|target-new|target-position|target|text-align-last|text-align|text-decoration|text-emphasis|text-height|text-indent|text-justify|text-outline|text-shadow|text-transform|text-wrap|top|transform-origin|transform-style|transform|transition-delay|transition-duration|transition-property|transition-timing-function|transition|unicode-bidi|vertical-align|visibility|voice-balance|voice-duration|voice-family|voice-pitch-range|voice-pitch|voice-rate|voice-stress|voice-volume|volume|white-space-collapse|white-space|widows|width|word-break|word-spacing|word-wrap|z-index";
    exports.supportFunction = "rgb|rgba|url|attr|counter|counters";
    exports.supportConstant = "absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|fill|fixed|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero";
    exports.supportConstantColor = "aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow";
    exports.supportConstantFonts = "arial|century|comic|courier|garamond|georgia|helvetica|impact|lucida|symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|serif|monospace";
    exports.numRe = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))";
    exports.pseudoElements = "(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b";
    exports.pseudoClasses = "(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b";
    var CssHighlightRules = (function (_super) {
        __extends(CssHighlightRules, _super);
        function CssHighlightRules() {
            _super.call(this);
            var keywordMapper = this.createKeywordMapper({
                "support.function": exports.supportFunction,
                "support.constant": exports.supportConstant,
                "support.type": exports.supportType,
                "support.constant.color": exports.supportConstantColor,
                "support.constant.fonts": exports.supportConstantFonts
            }, "text", true);
            this.$rules = {
                "start": [{
                        token: "comment",
                        regex: "\\/\\*",
                        push: "comment"
                    }, {
                        token: "paren.lparen",
                        regex: "\\{",
                        push: "ruleset"
                    }, {
                        token: "string",
                        regex: "@.*?{",
                        push: "media"
                    }, {
                        token: "keyword",
                        regex: "#[a-z0-9-_]+"
                    }, {
                        token: "variable",
                        regex: "\\.[a-z0-9-_]+"
                    }, {
                        token: "string",
                        regex: ":[a-z0-9-_]+"
                    }, {
                        token: "constant",
                        regex: "[a-z0-9-_]+"
                    }, {
                        caseInsensitive: true
                    }],
                "media": [{
                        token: "comment",
                        regex: "\\/\\*",
                        push: "comment"
                    }, {
                        token: "paren.lparen",
                        regex: "\\{",
                        push: "ruleset"
                    }, {
                        token: "string",
                        regex: "\\}",
                        next: "pop"
                    }, {
                        token: "keyword",
                        regex: "#[a-z0-9-_]+"
                    }, {
                        token: "variable",
                        regex: "\\.[a-z0-9-_]+"
                    }, {
                        token: "string",
                        regex: ":[a-z0-9-_]+"
                    }, {
                        token: "constant",
                        regex: "[a-z0-9-_]+"
                    }, {
                        caseInsensitive: true
                    }],
                "comment": [{
                        token: "comment",
                        regex: "\\*\\/",
                        next: "pop"
                    }, {
                        defaultToken: "comment"
                    }],
                "ruleset": [
                    {
                        token: "paren.rparen",
                        regex: "\\}",
                        next: "pop"
                    }, {
                        token: "comment",
                        regex: "\\/\\*",
                        push: "comment"
                    }, {
                        token: "string",
                        regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
                    }, {
                        token: "string",
                        regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
                    }, {
                        token: ["constant.numeric", "keyword"],
                        regex: "(" + exports.numRe + ")(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vw|%)"
                    }, {
                        token: "constant.numeric",
                        regex: exports.numRe
                    }, {
                        token: "constant.numeric",
                        regex: "#[a-f0-9]{6}"
                    }, {
                        token: "constant.numeric",
                        regex: "#[a-f0-9]{3}"
                    }, {
                        token: ["punctuation", "entity.other.attribute-name.pseudo-element.css"],
                        regex: exports.pseudoElements
                    }, {
                        token: ["punctuation", "entity.other.attribute-name.pseudo-class.css"],
                        regex: exports.pseudoClasses
                    }, {
                        token: ["support.function", "string", "support.function"],
                        regex: "(url\\()(.*)(\\))"
                    }, {
                        token: keywordMapper,
                        regex: "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*"
                    }, {
                        caseInsensitive: true
                    }]
            };
            this.normalizeRules();
        }
        return CssHighlightRules;
    })(TextHighlightRules_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CssHighlightRules;
});

define('mode/MatchingBraceOutdent',["require", "exports", "../Range"], function (require, exports, Range_1) {
    "use strict";
    var MatchingBraceOutdent = (function () {
        function MatchingBraceOutdent() {
        }
        MatchingBraceOutdent.prototype.checkOutdent = function (line, text) {
            if (!/^\s+$/.test(line)) {
                return false;
            }
            return /^\s*\}/.test(text);
        };
        MatchingBraceOutdent.prototype.autoOutdent = function (session, row) {
            var line = session.getLine(row);
            var match = line.match(/^(\s*\})/);
            if (!match)
                return 0;
            var column = match[1].length;
            var openBracePos = session.findMatchingBracket({ row: row, column: column });
            if (!openBracePos || openBracePos.row == row)
                return 0;
            var indent = this.$getIndent(session.getLine(openBracePos.row));
            session.replace(new Range_1.default(row, 0, row, column - 1), indent);
        };
        MatchingBraceOutdent.prototype.$getIndent = function (line) {
            return line.match(/^\s*/)[0];
        };
        return MatchingBraceOutdent;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MatchingBraceOutdent;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/behaviour/CstyleBehaviour',["require", "exports", "../Behaviour", "../../TokenIterator", "../../lib/lang"], function (require, exports, Behaviour_1, TokenIterator_1, lang_1) {
    "use strict";
    var SAFE_INSERT_IN_TOKENS = ["text", "paren.rparen", "punctuation.operator"];
    var SAFE_INSERT_BEFORE_TOKENS = ["text", "paren.rparen", "punctuation.operator", "comment"];
    var context;
    var contextCache = {};
    var initContext = function (editor) {
        var id = -1;
        if (editor.multiSelect) {
            id = editor.selection['id'];
            if (contextCache.rangeCount != editor.multiSelect.rangeCount) {
                contextCache = { rangeCount: editor.multiSelect.rangeCount };
            }
        }
        if (contextCache[id]) {
            return context = contextCache[id];
        }
        context = contextCache[id] = {
            autoInsertedBrackets: 0,
            autoInsertedRow: -1,
            autoInsertedLineEnd: "",
            maybeInsertedBrackets: 0,
            maybeInsertedRow: -1,
            maybeInsertedLineStart: "",
            maybeInsertedLineEnd: ""
        };
    };
    var CstyleBehaviour = (function (_super) {
        __extends(CstyleBehaviour, _super);
        function CstyleBehaviour() {
            _super.call(this);
            this.add("braces", "insertion", function (state, action, editor, session, text) {
                var cursor = editor.getCursorPosition();
                var line = session.doc.getLine(cursor.row);
                if (text === '{') {
                    initContext(editor);
                    var selection = editor.getSelectionRange();
                    var selected = session.doc.getTextRange(selection);
                    if (selected !== "" && selected !== "{" && editor.getWrapBehavioursEnabled()) {
                        return {
                            text: '{' + selected + '}',
                            selection: void 0
                        };
                    }
                    else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                        if (/[\]\}\)]/.test(line[cursor.column]) || editor.inMultiSelectMode) {
                            CstyleBehaviour.recordAutoInsert(editor, session, "}");
                            return {
                                text: '{}',
                                selection: [1, 1]
                            };
                        }
                        else {
                            CstyleBehaviour.recordMaybeInsert(editor, session, "{");
                            return {
                                text: '{',
                                selection: [1, 1]
                            };
                        }
                    }
                }
                else if (text === '}') {
                    initContext(editor);
                    var rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar === '}') {
                        var matching = session.findOpeningBracket('}', { column: cursor.column + 1, row: cursor.row });
                        if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                            CstyleBehaviour.popAutoInsertedClosing();
                            return { text: '', selection: [1, 1] };
                        }
                    }
                }
                else if (text === "\n" || text === "\r\n") {
                    initContext(editor);
                    var closing = "";
                    if (CstyleBehaviour.isMaybeInsertedClosing(cursor, line)) {
                        closing = lang_1.stringRepeat("}", context.maybeInsertedBrackets);
                        CstyleBehaviour.clearMaybeInsertedClosing();
                    }
                    var rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar === '}') {
                        var openBracePos = session.findMatchingBracket({ row: cursor.row, column: cursor.column + 1 }, '}');
                        if (!openBracePos)
                            return null;
                        var next_indent = this.$getIndent(session.getLine(openBracePos.row));
                    }
                    else if (closing) {
                        var next_indent = this.$getIndent(line);
                    }
                    else {
                        CstyleBehaviour.clearMaybeInsertedClosing();
                        return;
                    }
                    var indent = next_indent + session.getTabString();
                    return {
                        text: '\n' + indent + '\n' + next_indent + closing,
                        selection: [1, indent.length, 1, indent.length]
                    };
                }
                else {
                    CstyleBehaviour.clearMaybeInsertedClosing();
                }
            });
            this.add("braces", "deletion", function (state, action, editor, session, range) {
                var selected = session.doc.getTextRange(range);
                if (!range.isMultiLine() && selected === '{') {
                    initContext(editor);
                    var line = session.doc.getLine(range.start.row);
                    var rightChar = line.substring(range.end.column, range.end.column + 1);
                    if (rightChar === '}') {
                        range.end.column++;
                        return range;
                    }
                    else {
                        context.maybeInsertedBrackets--;
                    }
                }
            });
            this.add("parens", "insertion", function (state, action, editor, session, text) {
                if (text === '(') {
                    initContext(editor);
                    var selectionRange = editor.getSelectionRange();
                    var selected = session.doc.getTextRange(selectionRange);
                    if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                        return { text: '(' + selected + ')', selection: void 0 };
                    }
                    else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                        CstyleBehaviour.recordAutoInsert(editor, session, ")");
                        return { text: '()', selection: [1, 1] };
                    }
                }
                else if (text === ')') {
                    initContext(editor);
                    var cursor = editor.getCursorPosition();
                    var line = session.doc.getLine(cursor.row);
                    var rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar === ')') {
                        var matching = session.findOpeningBracket(')', { column: cursor.column + 1, row: cursor.row });
                        if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                            CstyleBehaviour.popAutoInsertedClosing();
                            return { text: '', selection: [1, 1] };
                        }
                    }
                }
            });
            this.add("parens", "deletion", function (state, action, editor, session, range) {
                var selected = session.doc.getTextRange(range);
                if (!range.isMultiLine() && selected === '(') {
                    initContext(editor);
                    var line = session.doc.getLine(range.start.row);
                    var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                    if (rightChar === ')') {
                        range.end.column++;
                        return range;
                    }
                }
            });
            this.add("brackets", "insertion", function (state, action, editor, session, text) {
                if (text === '[') {
                    initContext(editor);
                    var selectionRange = editor.getSelectionRange();
                    var selected = session.doc.getTextRange(selectionRange);
                    if (selected !== "" && editor.getWrapBehavioursEnabled()) {
                        return { text: '[' + selected + ']', selection: void 0 };
                    }
                    else if (CstyleBehaviour.isSaneInsertion(editor, session)) {
                        CstyleBehaviour.recordAutoInsert(editor, session, "]");
                        return { text: '[]', selection: [1, 1] };
                    }
                }
                else if (text === ']') {
                    initContext(editor);
                    var cursor = editor.getCursorPosition();
                    var line = session.doc.getLine(cursor.row);
                    var rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar == ']') {
                        var matching = session.findOpeningBracket(']', { column: cursor.column + 1, row: cursor.row });
                        if (matching !== null && CstyleBehaviour.isAutoInsertedClosing(cursor, line, text)) {
                            CstyleBehaviour.popAutoInsertedClosing();
                            return { text: '', selection: [1, 1] };
                        }
                    }
                }
            });
            this.add("brackets", "deletion", function (state, action, editor, session, range) {
                var selected = session.doc.getTextRange(range);
                if (!range.isMultiLine() && selected === '[') {
                    initContext(editor);
                    var line = session.doc.getLine(range.start.row);
                    var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                    if (rightChar === ']') {
                        range.end.column++;
                        return range;
                    }
                }
            });
            this.add("string_dquotes", "insertion", function (state, action, editor, session, text) {
                if (text === '"' || text === "'") {
                    initContext(editor);
                    var quote = text;
                    var selection = editor.getSelectionRange();
                    var selected = session.doc.getTextRange(selection);
                    if (selected !== "" && selected !== "'" && selected !== '"' && editor.getWrapBehavioursEnabled()) {
                        return { text: quote + selected + quote, selection: void 0 };
                    }
                    else {
                        var cursor = editor.getCursorPosition();
                        var line = session.doc.getLine(cursor.row);
                        var leftChar = line.substring(cursor.column - 1, cursor.column);
                        if (leftChar === '\\') {
                            return null;
                        }
                        var tokens = session.getTokens(selection.start.row);
                        var col = 0;
                        var token;
                        var quotepos = -1;
                        for (var x = 0; x < tokens.length; x++) {
                            token = tokens[x];
                            if (token.type === "string") {
                                quotepos = -1;
                            }
                            else if (quotepos < 0) {
                                quotepos = token.value.indexOf(quote);
                            }
                            if ((token.value.length + col) > selection.start.column) {
                                break;
                            }
                            col += tokens[x].value.length;
                        }
                        if (!token || (quotepos < 0 && token.type !== "comment" && (token.type !== "string" || ((selection.start.column !== token.value.length + col - 1) && token.value.lastIndexOf(quote) === token.value.length - 1)))) {
                            if (!CstyleBehaviour.isSaneInsertion(editor, session))
                                return;
                            return { text: quote + quote, selection: [1, 1] };
                        }
                        else if (token && token.type === "string") {
                            var rightChar = line.substring(cursor.column, cursor.column + 1);
                            if (rightChar == quote) {
                                return { text: '', selection: [1, 1] };
                            }
                        }
                    }
                }
            });
            this.add("string_dquotes", "deletion", function (state, action, editor, session, range) {
                var selected = session.doc.getTextRange(range);
                if (!range.isMultiLine() && (selected === '"' || selected === "'")) {
                    initContext(editor);
                    var line = session.doc.getLine(range.start.row);
                    var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                    if (rightChar == selected) {
                        range.end.column++;
                        return range;
                    }
                }
            });
        }
        CstyleBehaviour.isSaneInsertion = function (editor, session) {
            var cursor = editor.getCursorPosition();
            var iterator = new TokenIterator_1.default(session, cursor.row, cursor.column);
            if (!this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
                var iterator2 = new TokenIterator_1.default(session, cursor.row, cursor.column + 1);
                if (!this.$matchTokenType(iterator2.getCurrentToken() || "text", SAFE_INSERT_IN_TOKENS)) {
                    return false;
                }
            }
            iterator.stepForward();
            return iterator.getCurrentTokenRow() !== cursor.row ||
                this.$matchTokenType(iterator.getCurrentToken() || "text", SAFE_INSERT_BEFORE_TOKENS);
        };
        CstyleBehaviour.$matchTokenType = function (token, types) {
            if (typeof token === 'string') {
                return types.indexOf(token) > -1;
            }
            else {
                return types.indexOf(token.type) > -1;
            }
        };
        CstyleBehaviour.recordAutoInsert = function (editor, session, bracket) {
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            if (!this.isAutoInsertedClosing(cursor, line, context.autoInsertedLineEnd[0])) {
                context.autoInsertedBrackets = 0;
            }
            context.autoInsertedRow = cursor.row;
            context.autoInsertedLineEnd = bracket + line.substr(cursor.column);
            context.autoInsertedBrackets++;
        };
        CstyleBehaviour.recordMaybeInsert = function (editor, session, bracket) {
            var cursor = editor.getCursorPosition();
            var line = session.doc.getLine(cursor.row);
            if (!this.isMaybeInsertedClosing(cursor, line)) {
                context.maybeInsertedBrackets = 0;
            }
            context.maybeInsertedRow = cursor.row;
            context.maybeInsertedLineStart = line.substr(0, cursor.column) + bracket;
            context.maybeInsertedLineEnd = line.substr(cursor.column);
            context.maybeInsertedBrackets++;
        };
        CstyleBehaviour.isAutoInsertedClosing = function (cursor, line, bracket) {
            return context.autoInsertedBrackets > 0 &&
                cursor.row === context.autoInsertedRow &&
                bracket === context.autoInsertedLineEnd[0] &&
                line.substr(cursor.column) === context.autoInsertedLineEnd;
        };
        CstyleBehaviour.isMaybeInsertedClosing = function (cursor, line) {
            return context.maybeInsertedBrackets > 0 &&
                cursor.row === context.maybeInsertedRow &&
                line.substr(cursor.column) === context.maybeInsertedLineEnd &&
                line.substr(0, cursor.column) == context.maybeInsertedLineStart;
        };
        CstyleBehaviour.popAutoInsertedClosing = function () {
            context.autoInsertedLineEnd = context.autoInsertedLineEnd.substr(1);
            context.autoInsertedBrackets--;
        };
        CstyleBehaviour.clearMaybeInsertedClosing = function () {
            if (context) {
                context.maybeInsertedBrackets = 0;
                context.maybeInsertedRow = -1;
            }
        };
        return CstyleBehaviour;
    })(Behaviour_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CstyleBehaviour;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/behaviour/CssBehaviour',["require", "exports", "./CstyleBehaviour", "../../TokenIterator"], function (require, exports, CstyleBehaviour_1, TokenIterator_1) {
    "use strict";
    var CssBehavior = (function (_super) {
        __extends(CssBehavior, _super);
        function CssBehavior() {
            _super.call(this);
            this.inherit(new CstyleBehaviour_1.default());
            this.add("colon", "insertion", function (state, action, editor, session, text) {
                if (text === ':') {
                    var cursor = editor.getCursorPosition();
                    var iterator = new TokenIterator_1.default(session, cursor.row, cursor.column);
                    var token = iterator.getCurrentToken();
                    if (token && token.value.match(/\s+/)) {
                        token = iterator.stepBackward();
                    }
                    if (token && token.type === 'support.type') {
                        var line = session.doc.getLine(cursor.row);
                        var rightChar = line.substring(cursor.column, cursor.column + 1);
                        if (rightChar === ':') {
                            return {
                                text: '',
                                selection: [1, 1]
                            };
                        }
                        if (!line.substring(cursor.column).match(/^\s*;/)) {
                            return {
                                text: ':;',
                                selection: [1, 1]
                            };
                        }
                    }
                }
            });
            this.add("colon", "deletion", function (state, action, editor, session, range) {
                var selected = session.doc.getTextRange(range);
                if (!range.isMultiLine() && selected === ':') {
                    var cursor = editor.getCursorPosition();
                    var iterator = new TokenIterator_1.default(session, cursor.row, cursor.column);
                    var token = iterator.getCurrentToken();
                    if (token && token.value.match(/\s+/)) {
                        token = iterator.stepBackward();
                    }
                    if (token && token.type === 'support.type') {
                        var line = session.doc.getLine(range.start.row);
                        var rightChar = line.substring(range.end.column, range.end.column + 1);
                        if (rightChar === ';') {
                            range.end.column++;
                            return range;
                        }
                    }
                }
            });
            this.add("semicolon", "insertion", function (state, action, editor, session, text) {
                if (text === ';') {
                    var cursor = editor.getCursorPosition();
                    var line = session.doc.getLine(cursor.row);
                    var rightChar = line.substring(cursor.column, cursor.column + 1);
                    if (rightChar === ';') {
                        return {
                            text: '',
                            selection: [1, 1]
                        };
                    }
                }
            });
        }
        return CssBehavior;
    })(CstyleBehaviour_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CssBehavior;
});

define('mode/folding/FoldMode',["require", "exports", "../../Range"], function (require, exports, Range_1) {
    "use strict";
    var FoldMode = (function () {
        function FoldMode() {
            this.foldingStartMarker = null;
            this.foldingStopMarker = null;
        }
        FoldMode.prototype.getFoldWidget = function (session, foldStyle, row) {
            var line = session.getLine(row);
            if (this.foldingStartMarker.test(line)) {
                return "start";
            }
            if (foldStyle === "markbeginend" && this.foldingStopMarker && this.foldingStopMarker.test(line)) {
                return "end";
            }
            return "";
        };
        FoldMode.prototype.getFoldWidgetRange = function (session, foldStyle, row) {
            return null;
        };
        FoldMode.prototype.indentationBlock = function (session, row, column) {
            var re = /\S/;
            var line = session.getLine(row);
            var startLevel = line.search(re);
            if (startLevel === -1) {
                return;
            }
            var startColumn = column || line.length;
            var maxRow = session.getLength();
            var startRow = row;
            var endRow = row;
            while (++row < maxRow) {
                var level = session.getLine(row).search(re);
                if (level === -1) {
                    continue;
                }
                if (level <= startLevel) {
                    break;
                }
                endRow = row;
            }
            if (endRow > startRow) {
                var endColumn = session.getLine(endRow).length;
                return new Range_1.default(startRow, startColumn, endRow, endColumn);
            }
        };
        FoldMode.prototype.openingBracketBlock = function (session, bracket, row, column, typeRe) {
            var start = { row: row, column: column + 1 };
            var end = session.findClosingBracket(bracket, start, typeRe);
            if (!end)
                return;
            var fw = session.foldWidgets[end.row];
            if (fw == null)
                fw = session.getFoldWidget(end.row);
            if (fw == "start" && end.row > start.row) {
                end.row--;
                end.column = session.getLine(end.row).length;
            }
            return Range_1.default.fromPoints(start, end);
        };
        FoldMode.prototype.closingBracketBlock = function (session, bracket, row, column, typeRe) {
            var end = { row: row, column: column };
            var start = session.findOpeningBracket(bracket, end);
            if (!start) {
                return;
            }
            start.column++;
            end.column--;
            return Range_1.default.fromPoints(start, end);
        };
        return FoldMode;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FoldMode;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/folding/CstyleFoldMode',["require", "exports", "../../Range", "./FoldMode"], function (require, exports, Range_1, FoldMode_1) {
    "use strict";
    var CstyleFoldMode = (function (_super) {
        __extends(CstyleFoldMode, _super);
        function CstyleFoldMode(commentRegex) {
            _super.call(this);
            this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/;
            this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/;
            if (commentRegex) {
                this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start));
                this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end));
            }
        }
        CstyleFoldMode.prototype.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
            var line = session.getLine(row);
            var match = line.match(this.foldingStartMarker);
            if (match) {
                var i = match.index;
                if (match[1])
                    return this.openingBracketBlock(session, match[1], row, i);
                var range = session.getCommentFoldRange(row, i + match[0].length, 1);
                if (range && !range.isMultiLine()) {
                    if (forceMultiline) {
                        range = this.getSectionRange(session, row);
                    }
                    else if (foldStyle != "all")
                        range = null;
                }
                return range;
            }
            if (foldStyle === "markbegin")
                return;
            var match = line.match(this.foldingStopMarker);
            if (match) {
                var i = match.index + match[0].length;
                if (match[1])
                    return this.closingBracketBlock(session, match[1], row, i);
                return session.getCommentFoldRange(row, i, -1);
            }
        };
        CstyleFoldMode.prototype.getSectionRange = function (session, row) {
            var line = session.getLine(row);
            var startIndent = line.search(/\S/);
            var startRow = row;
            var startColumn = line.length;
            row = row + 1;
            var endRow = row;
            var maxRow = session.getLength();
            while (++row < maxRow) {
                line = session.getLine(row);
                var indent = line.search(/\S/);
                if (indent === -1)
                    continue;
                if (startIndent > indent)
                    break;
                var subRange = this.getFoldWidgetRange(session, "all", row);
                if (subRange) {
                    if (subRange.start.row <= startRow) {
                        break;
                    }
                    else if (subRange.isMultiLine()) {
                        row = subRange.end.row;
                    }
                    else if (startIndent == indent) {
                        break;
                    }
                }
                endRow = row;
            }
            return new Range_1.default(startRow, startColumn, endRow, session.getLine(endRow).length);
        };
        return CstyleFoldMode;
    })(FoldMode_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CstyleFoldMode;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/CssMode',["require", "exports", "./TextMode", "./CssHighlightRules", "./MatchingBraceOutdent", "../worker/WorkerClient", "./behaviour/CssBehaviour", "./folding/CstyleFoldMode"], function (require, exports, TextMode_1, CssHighlightRules_1, MatchingBraceOutdent_1, WorkerClient_1, CssBehaviour_1, CstyleFoldMode_1) {
    "use strict";
    var CssMode = (function (_super) {
        __extends(CssMode, _super);
        function CssMode(workerUrl, scriptImports) {
            _super.call(this, workerUrl, scriptImports);
            this.$id = "ace/mode/css";
            this.blockComment = { start: "/*", end: "*/" };
            this.HighlightRules = CssHighlightRules_1.default;
            this.$outdent = new MatchingBraceOutdent_1.default();
            this.$behaviour = new CssBehaviour_1.default();
            this.foldingRules = new CstyleFoldMode_1.default();
        }
        CssMode.prototype.getNextLineIndent = function (state, line, tab) {
            var indent = this.$getIndent(line);
            var tokens = this.getTokenizer().getLineTokens(line, state).tokens;
            if (tokens.length && tokens[tokens.length - 1].type == "comment") {
                return indent;
            }
            var match = line.match(/^.*\{\s*$/);
            if (match) {
                indent += tab;
            }
            return indent;
        };
        CssMode.prototype.checkOutdent = function (state, line, text) {
            return this.$outdent.checkOutdent(line, text);
        };
        CssMode.prototype.autoOutdent = function (state, session, row) {
            return this.$outdent.autoOutdent(session, row);
        };
        CssMode.prototype.createWorker = function (session) {
            var workerUrl = this.workerUrl;
            var scriptImports = this.scriptImports;
            var worker = new WorkerClient_1.default(workerUrl);
            worker.on("initAfter", function () {
                worker.attachToDocument(session.getDocument());
            });
            worker.on("initFail", function (message) {
            });
            worker.on('annotations', function (event) {
                var annotations = event.data;
                if (annotations.length > 0) {
                    session.setAnnotations(annotations);
                }
                else {
                    session.clearAnnotations();
                }
                session._emit("annotations", { data: annotations });
            });
            worker.on("terminate", function () {
                worker.detachFromDocument();
                session.clearAnnotations();
            });
            worker.init(scriptImports, 'ace-workers.js', 'CssWorker');
            return worker;
        };
        return CssMode;
    })(TextMode_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CssMode;
});

define('mode/createCssMode',["require", "exports", './CssMode'], function (require, exports, CssMode_1) {
    function createCssMode(workerUrl, scriptImports) {
        return new CssMode_1.default(workerUrl, scriptImports);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createCssMode;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/DocCommentHighlightRules',["require", "exports", "./TextHighlightRules"], function (require, exports, TextHighlightRules_1) {
    "use strict";
    var DocCommentHighlightRules = (function (_super) {
        __extends(DocCommentHighlightRules, _super);
        function DocCommentHighlightRules() {
            _super.call(this);
            this.$rules = {
                "start": [{
                        token: "comment.doc.tag",
                        regex: "@[\\w\\d_]+"
                    }, {
                        token: "comment.doc.tag",
                        regex: "\\bTODO\\b"
                    }, {
                        defaultToken: "comment.doc"
                    }]
            };
        }
        DocCommentHighlightRules.getStartRule = function (start) {
            return {
                token: "comment.doc",
                regex: "\\/\\*(?=\\*)",
                next: start
            };
        };
        DocCommentHighlightRules.getEndRule = function (start) {
            return {
                token: "comment.doc",
                regex: "\\*\\/",
                next: start
            };
        };
        return DocCommentHighlightRules;
    })(TextHighlightRules_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DocCommentHighlightRules;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/JavaScriptHighlightRules',["require", "exports", "./DocCommentHighlightRules", "./TextHighlightRules"], function (require, exports, DocCommentHighlightRules_1, TextHighlightRules_1) {
    "use strict";
    var JavaScriptHighlightRules = (function (_super) {
        __extends(JavaScriptHighlightRules, _super);
        function JavaScriptHighlightRules(options) {
            _super.call(this);
            var keywordMapper = this.createKeywordMapper({
                "variable.language": "Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|" +
                    "Namespace|QName|XML|XMLList|" +
                    "ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|" +
                    "Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|" +
                    "Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|" +
                    "SyntaxError|TypeError|URIError|" +
                    "decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|" +
                    "isNaN|parseFloat|parseInt|" +
                    "JSON|Math|" +
                    "this|arguments|prototype|window|document",
                "keyword": "const|yield|import|get|set|" +
                    "break|case|catch|continue|default|delete|do|else|finally|for|function|" +
                    "if|in|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|debugger|" +
                    "__parent__|__count__|escape|unescape|with|__proto__|" +
                    "class|enum|extends|super|export|implements|private|public|interface|package|protected|static",
                "storage.type": "const|let|var|function",
                "constant.language": "null|Infinity|NaN|undefined",
                "support.function": "alert",
                "constant.language.boolean": "true|false"
            }, "identifier");
            var kwBeforeRe = "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield|void";
            var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*\\b";
            var escapedRe = "\\\\(?:x[0-9a-fA-F]{2}|" +
                "u[0-9a-fA-F]{4}|" +
                "[0-2][0-7]{0,2}|" +
                "3[0-6][0-7]?|" +
                "37[0-7]?|" +
                "[4-7][0-7]?|" +
                ".)";
            this.$rules = {
                "no_regex": [
                    {
                        token: "comment",
                        regex: "\\/\\/",
                        next: "line_comment"
                    },
                    DocCommentHighlightRules_1.default.getStartRule("doc-start"),
                    {
                        token: "comment",
                        regex: /\/\*/,
                        next: "comment"
                    }, {
                        token: "string",
                        regex: "'(?=.)",
                        next: "qstring"
                    }, {
                        token: "string",
                        regex: '"(?=.)',
                        next: "qqstring"
                    }, {
                        token: "constant.numeric",
                        regex: /0[xX][0-9a-fA-F]+\b/
                    }, {
                        token: "constant.numeric",
                        regex: /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/
                    }, {
                        token: [
                            "storage.type", "punctuation.operator", "support.function",
                            "punctuation.operator", "entity.name.function", "text", "keyword.operator"
                        ],
                        regex: "(" + identifierRe + ")(\\.)(prototype)(\\.)(" + identifierRe + ")(\\s*)(=)",
                        next: "function_arguments"
                    }, {
                        token: [
                            "storage.type", "punctuation.operator", "entity.name.function", "text",
                            "keyword.operator", "text", "storage.type", "text", "paren.lparen"
                        ],
                        regex: "(" + identifierRe + ")(\\.)(" + identifierRe + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                        next: "function_arguments"
                    }, {
                        token: [
                            "entity.name.function", "text", "keyword.operator", "text", "storage.type",
                            "text", "paren.lparen"
                        ],
                        regex: "(" + identifierRe + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                        next: "function_arguments"
                    }, {
                        token: [
                            "storage.type", "punctuation.operator", "entity.name.function", "text",
                            "keyword.operator", "text",
                            "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                        ],
                        regex: "(" + identifierRe + ")(\\.)(" + identifierRe + ")(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()",
                        next: "function_arguments"
                    }, {
                        token: [
                            "storage.type", "text", "entity.name.function", "text", "paren.lparen"
                        ],
                        regex: "(function)(\\s+)(" + identifierRe + ")(\\s*)(\\()",
                        next: "function_arguments"
                    }, {
                        token: [
                            "entity.name.function", "text", "punctuation.operator",
                            "text", "storage.type", "text", "paren.lparen"
                        ],
                        regex: "(" + identifierRe + ")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",
                        next: "function_arguments"
                    }, {
                        token: [
                            "text", "text", "storage.type", "text", "paren.lparen"
                        ],
                        regex: "(:)(\\s*)(function)(\\s*)(\\()",
                        next: "function_arguments"
                    }, {
                        token: "keyword",
                        regex: "(?:" + kwBeforeRe + ")\\b",
                        next: "start"
                    }, {
                        token: ["punctuation.operator", "support.function"],
                        regex: /(\.)(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:op|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/
                    }, {
                        token: ["punctuation.operator", "support.function.dom"],
                        regex: /(\.)(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/
                    }, {
                        token: ["punctuation.operator", "support.constant"],
                        regex: /(\.)(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/
                    }, {
                        token: ["support.constant"],
                        regex: /that\b/
                    }, {
                        token: ["storage.type", "punctuation.operator", "support.function.firebug"],
                        regex: /(console)(\.)(warn|info|log|error|time|trace|timeEnd|assert)\b/
                    }, {
                        token: keywordMapper,
                        regex: identifierRe
                    }, {
                        token: "keyword.operator",
                        regex: /--|\+\+|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|[!$%&*+\-~\/^]=?/,
                        next: "start"
                    }, {
                        token: "punctuation.operator",
                        regex: /[?:,;.]/,
                        next: "start"
                    }, {
                        token: "paren.lparen",
                        regex: /[\[({]/,
                        next: "start"
                    }, {
                        token: "paren.rparen",
                        regex: /[\])}]/
                    }, {
                        token: "comment",
                        regex: /^#!.*$/
                    }
                ],
                "start": [
                    DocCommentHighlightRules_1.default.getStartRule("doc-start"),
                    {
                        token: "comment",
                        regex: "\\/\\*",
                        next: "comment_regex_allowed"
                    }, {
                        token: "comment",
                        regex: "\\/\\/",
                        next: "line_comment_regex_allowed"
                    }, {
                        token: "string.regexp",
                        regex: "\\/",
                        next: "regex"
                    }, {
                        token: "text",
                        regex: "\\s+|^$",
                        next: "start"
                    }, {
                        token: "empty",
                        regex: "",
                        next: "no_regex"
                    }
                ],
                "regex": [
                    {
                        token: "regexp.keyword.operator",
                        regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
                    }, {
                        token: "string.regexp",
                        regex: "/[sxngimy]*",
                        next: "no_regex"
                    }, {
                        token: "invalid",
                        regex: /\{\d+\b,?\d*\}[+*]|[+*$^?][+*]|[$^][?]|\?{3,}/
                    }, {
                        token: "constant.language.escape",
                        regex: /\(\?[:=!]|\)|\{\d+\b,?\d*\}|[+*]\?|[()$^+*?.]/
                    }, {
                        token: "constant.language.delimiter",
                        regex: /\|/
                    }, {
                        token: "constant.language.escape",
                        regex: /\[\^?/,
                        next: "regex_character_class"
                    }, {
                        token: "empty",
                        regex: "$",
                        next: "no_regex"
                    }, {
                        defaultToken: "string.regexp"
                    }
                ],
                "regex_character_class": [
                    {
                        token: "regexp.charclass.keyword.operator",
                        regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)"
                    }, {
                        token: "constant.language.escape",
                        regex: "]",
                        next: "regex"
                    }, {
                        token: "constant.language.escape",
                        regex: "-"
                    }, {
                        token: "empty",
                        regex: "$",
                        next: "no_regex"
                    }, {
                        defaultToken: "string.regexp.charachterclass"
                    }
                ],
                "function_arguments": [
                    {
                        token: "variable.parameter",
                        regex: identifierRe
                    }, {
                        token: "punctuation.operator",
                        regex: "[, ]+"
                    }, {
                        token: "punctuation.operator",
                        regex: "$"
                    }, {
                        token: "empty",
                        regex: "",
                        next: "no_regex"
                    }
                ],
                "comment_regex_allowed": [
                    { token: "comment", regex: "\\*\\/", next: "start" },
                    { defaultToken: "comment" }
                ],
                "comment": [
                    { token: "comment", regex: "\\*\\/", next: "no_regex" },
                    { defaultToken: "comment" }
                ],
                "line_comment_regex_allowed": [
                    { token: "comment", regex: "$|^", next: "start" },
                    { defaultToken: "comment" }
                ],
                "line_comment": [
                    { token: "comment", regex: "$|^", next: "no_regex" },
                    { defaultToken: "comment" }
                ],
                "qqstring": [
                    {
                        token: "constant.language.escape",
                        regex: escapedRe
                    }, {
                        token: "string",
                        regex: "\\\\$",
                        next: "qqstring"
                    }, {
                        token: "string",
                        regex: '"|$',
                        next: "no_regex"
                    }, {
                        defaultToken: "string"
                    }
                ],
                "qstring": [
                    {
                        token: "constant.language.escape",
                        regex: escapedRe
                    }, {
                        token: "string",
                        regex: "\\\\$",
                        next: "qstring"
                    }, {
                        token: "string",
                        regex: "'|$",
                        next: "no_regex"
                    }, {
                        defaultToken: "string"
                    }
                ]
            };
            if (!options || !options.noES6) {
                this.$rules.no_regex.unshift({
                    regex: "[{}]", onMatch: function (val, state, stack) {
                        this.next = val == "{" ? this.nextState : "";
                        if (val == "{" && stack.length) {
                            stack.unshift("start", state);
                            return "paren";
                        }
                        if (val == "}" && stack.length) {
                            stack.shift();
                            this.next = stack.shift();
                            if (this.next.indexOf("string") != -1)
                                return "paren.quasi.end";
                        }
                        return val == "{" ? "paren.lparen" : "paren.rparen";
                    },
                    nextState: "start"
                }, {
                    token: "string.quasi.start",
                    regex: /`/,
                    push: [{
                            token: "constant.language.escape",
                            regex: escapedRe
                        }, {
                            token: "paren.quasi.start",
                            regex: /\${/,
                            push: "start"
                        }, {
                            token: "string.quasi.end",
                            regex: /`/,
                            next: "pop"
                        }, {
                            defaultToken: "string.quasi"
                        }]
                });
            }
            this.embedRules(DocCommentHighlightRules_1.default, "doc-", [DocCommentHighlightRules_1.default.getEndRule("no_regex")]);
            this.normalizeRules();
        }
        return JavaScriptHighlightRules;
    })(TextHighlightRules_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = JavaScriptHighlightRules;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/JavaScriptMode',["require", "exports", "./TextMode", "./JavaScriptHighlightRules", "./MatchingBraceOutdent", "../worker/WorkerClient", "./behaviour/CstyleBehaviour", "./folding/CstyleFoldMode"], function (require, exports, TextMode_1, JavaScriptHighlightRules_1, MatchingBraceOutdent_1, WorkerClient_1, CstyleBehaviour_1, CstyleFoldMode_1) {
    "use strict";
    var JavaScriptMode = (function (_super) {
        __extends(JavaScriptMode, _super);
        function JavaScriptMode(workerUrl, scriptImports) {
            _super.call(this, workerUrl, scriptImports);
            this.HighlightRules = JavaScriptHighlightRules_1.default;
            this.$outdent = new MatchingBraceOutdent_1.default();
            this.$behaviour = new CstyleBehaviour_1.default();
            this.foldingRules = new CstyleFoldMode_1.default();
            this.lineCommentStart = "//";
            this.blockComment = { start: "/*", end: "*/" };
            this.$id = "ace/mode/javascript";
        }
        JavaScriptMode.prototype.getNextLineIndent = function (state, line, tab) {
            var indent = this.$getIndent(line);
            var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
            var tokens = tokenizedLine.tokens;
            var endState = tokenizedLine.state;
            if (tokens.length && tokens[tokens.length - 1].type === "comment") {
                return indent;
            }
            if (state === "start" || state === "no_regex") {
                var match = line.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
                if (match) {
                    indent += tab;
                }
            }
            else if (state === "doc-start") {
                if (endState == "start" || endState == "no_regex") {
                    return "";
                }
                var match = line.match(/^\s*(\/?)\*/);
                if (match) {
                    if (match[1]) {
                        indent += " ";
                    }
                    indent += "* ";
                }
            }
            return indent;
        };
        JavaScriptMode.prototype.checkOutdent = function (state, line, text) {
            return this.$outdent.checkOutdent(line, text);
        };
        ;
        JavaScriptMode.prototype.autoOutdent = function (state, session, row) {
            return this.$outdent.autoOutdent(session, row);
        };
        ;
        JavaScriptMode.prototype.createWorker = function (session) {
            var worker = new WorkerClient_1.default(this.workerUrl);
            worker.on("initAfter", function () {
                worker.attachToDocument(session.getDocument());
            });
            worker.on("initFailed", function (event) {
            });
            worker.on('annotations', function (event) {
                var annotations = event.data;
                if (annotations.length > 0) {
                    session.setAnnotations(annotations);
                }
                else {
                    session.clearAnnotations();
                }
                session._emit("annotations", { data: annotations });
            });
            worker.on("terminate", function () {
                worker.detachFromDocument();
                session.clearAnnotations();
            });
            worker.init(this.scriptImports, 'ace-workers.js', 'JavaScriptWorker');
            return worker;
        };
        return JavaScriptMode;
    })(TextMode_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = JavaScriptMode;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/XmlHighlightRules',["require", "exports", "./TextHighlightRules"], function (require, exports, TextHighlightRules_1) {
    "use strict";
    var XmlHighlightRules = (function (_super) {
        __extends(XmlHighlightRules, _super);
        function XmlHighlightRules(normalize) {
            _super.call(this);
            this.$rules = {
                start: [
                    { token: "string.cdata.xml", regex: "<\\!\\[CDATA\\[", next: "cdata" },
                    {
                        token: ["punctuation.xml-decl.xml", "keyword.xml-decl.xml"],
                        regex: "(<\\?)(xml)(?=[\\s])", next: "xml_decl", caseInsensitive: true
                    },
                    {
                        token: ["punctuation.instruction.xml", "keyword.instruction.xml"],
                        regex: "(<\\?)([-_a-zA-Z0-9]+)", next: "processing_instruction",
                    },
                    { token: "comment.xml", regex: "<\\!--", next: "comment" },
                    {
                        token: ["xml-pe.doctype.xml", "xml-pe.doctype.xml"],
                        regex: "(<\\!)(DOCTYPE)(?=[\\s])", next: "doctype", caseInsensitive: true
                    },
                    { include: "tag" },
                    { token: "text.end-tag-open.xml", regex: "</" },
                    { token: "text.tag-open.xml", regex: "<" },
                    { include: "reference" },
                    { defaultToken: "text.xml" }
                ],
                xml_decl: [{
                        token: "entity.other.attribute-name.decl-attribute-name.xml",
                        regex: "(?:[-_a-zA-Z0-9]+:)?[-_a-zA-Z0-9]+"
                    }, {
                        token: "keyword.operator.decl-attribute-equals.xml",
                        regex: "="
                    }, {
                        include: "whitespace"
                    }, {
                        include: "string"
                    }, {
                        token: "punctuation.xml-decl.xml",
                        regex: "\\?>",
                        next: "start"
                    }],
                processing_instruction: [
                    { token: "punctuation.instruction.xml", regex: "\\?>", next: "start" },
                    { defaultToken: "instruction.xml" }
                ],
                doctype: [
                    { include: "whitespace" },
                    { include: "string" },
                    { token: "xml-pe.doctype.xml", regex: ">", next: "start" },
                    { token: "xml-pe.xml", regex: "[-_a-zA-Z0-9:]+" },
                    { token: "punctuation.int-subset", regex: "\\[", push: "int_subset" }
                ],
                int_subset: [{
                        token: "text.xml",
                        regex: "\\s+"
                    }, {
                        token: "punctuation.int-subset.xml",
                        regex: "]",
                        next: "pop"
                    }, {
                        token: ["punctuation.markup-decl.xml", "keyword.markup-decl.xml"],
                        regex: "(<\\!)([-_a-zA-Z0-9]+)",
                        push: [{
                                token: "text",
                                regex: "\\s+"
                            },
                            {
                                token: "punctuation.markup-decl.xml",
                                regex: ">",
                                next: "pop"
                            },
                            { include: "string" }]
                    }],
                cdata: [
                    { token: "string.cdata.xml", regex: "\\]\\]>", next: "start" },
                    { token: "text.xml", regex: "\\s+" },
                    { token: "text.xml", regex: "(?:[^\\]]|\\](?!\\]>))+" }
                ],
                comment: [
                    { token: "comment.xml", regex: "-->", next: "start" },
                    { defaultToken: "comment.xml" }
                ],
                reference: [{
                        token: "constant.language.escape.reference.xml",
                        regex: "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
                    }],
                attr_reference: [{
                        token: "constant.language.escape.reference.attribute-value.xml",
                        regex: "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)"
                    }],
                tag: [{
                        token: ["meta.tag.punctuation.tag-open.xml", "meta.tag.punctuation.end-tag-open.xml", "meta.tag.tag-name.xml"],
                        regex: "(?:(<)|(</))((?:[-_a-zA-Z0-9]+:)?[-_a-zA-Z0-9]+)",
                        next: [
                            { include: "attributes" },
                            { token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: "start" }
                        ]
                    }],
                tag_whitespace: [
                    { token: "text.tag-whitespace.xml", regex: "\\s+" }
                ],
                whitespace: [
                    { token: "text.whitespace.xml", regex: "\\s+" }
                ],
                string: [{
                        token: "string.xml",
                        regex: "'",
                        push: [
                            { token: "string.xml", regex: "'", next: "pop" },
                            { defaultToken: "string.xml" }
                        ]
                    }, {
                        token: "string.xml",
                        regex: '"',
                        push: [
                            { token: "string.xml", regex: '"', next: "pop" },
                            { defaultToken: "string.xml" }
                        ]
                    }],
                attributes: [{
                        token: "entity.other.attribute-name.xml",
                        regex: "(?:[-_a-zA-Z0-9]+:)?[-_a-zA-Z0-9]+"
                    }, {
                        token: "keyword.operator.attribute-equals.xml",
                        regex: "="
                    }, {
                        include: "tag_whitespace"
                    }, {
                        include: "attribute_value"
                    }],
                attribute_value: [{
                        token: "string.attribute-value.xml",
                        regex: "'",
                        push: [
                            { token: "string.attribute-value.xml", regex: "'", next: "pop" },
                            { include: "attr_reference" },
                            { defaultToken: "string.attribute-value.xml" }
                        ]
                    }, {
                        token: "string.attribute-value.xml",
                        regex: '"',
                        push: [
                            { token: "string.attribute-value.xml", regex: '"', next: "pop" },
                            { include: "attr_reference" },
                            { defaultToken: "string.attribute-value.xml" }
                        ]
                    }]
            };
            if (this.constructor === XmlHighlightRules)
                this.normalizeRules();
        }
        XmlHighlightRules.prototype.embedTagRules = function (HighlightRules, prefix, tag) {
            this.$rules.tag.unshift({
                token: ["meta.tag.punctuation.tag-open.xml", "meta.tag." + tag + ".tag-name.xml"],
                regex: "(<)(" + tag + "(?=\\s|>|$))",
                next: [
                    { include: "attributes" },
                    { token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: prefix + "start" }
                ]
            });
            this.$rules[tag + "-end"] = [
                { include: "attributes" },
                {
                    token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: "start",
                    onMatch: function (value, currentState, stack) {
                        stack.splice(0);
                        return this.token;
                    }
                }
            ];
            this.embedRules(HighlightRules, prefix, [{
                    token: ["meta.tag.punctuation.end-tag-open.xml", "meta.tag." + tag + ".tag-name.xml"],
                    regex: "(</)(" + tag + "(?=\\s|>|$))",
                    next: tag + "-end"
                }, {
                    token: "string.cdata.xml",
                    regex: "<\\!\\[CDATA\\["
                }, {
                    token: "string.cdata.xml",
                    regex: "\\]\\]>"
                }]);
        };
        return XmlHighlightRules;
    })(TextHighlightRules_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = XmlHighlightRules;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/HtmlHighlightRules',["require", "exports", "../lib/lang", "./CssHighlightRules", "./JavaScriptHighlightRules", "./XmlHighlightRules"], function (require, exports, lang_1, CssHighlightRules_1, JavaScriptHighlightRules_1, XmlHighlightRules_1) {
    "use strict";
    var tagMap = lang_1.createMap({
        a: 'anchor',
        button: 'form',
        form: 'form',
        img: 'image',
        input: 'form',
        label: 'form',
        option: 'form',
        script: 'script',
        select: 'form',
        textarea: 'form',
        style: 'style',
        table: 'table',
        tbody: 'table',
        td: 'table',
        tfoot: 'table',
        th: 'table',
        tr: 'table'
    });
    var HtmlHighlightRules = (function (_super) {
        __extends(HtmlHighlightRules, _super);
        function HtmlHighlightRules() {
            _super.call(this);
            this.addRules({
                attributes: [{
                        include: "tag_whitespace"
                    }, {
                        token: "entity.other.attribute-name.xml",
                        regex: "[-_a-zA-Z0-9:]+"
                    }, {
                        token: "keyword.operator.attribute-equals.xml",
                        regex: "=",
                        push: [{
                                include: "tag_whitespace"
                            }, {
                                token: "string.unquoted.attribute-value.html",
                                regex: "[^<>='\"`\\s]+",
                                next: "pop"
                            }, {
                                token: "empty",
                                regex: "",
                                next: "pop"
                            }]
                    }, {
                        include: "attribute_value"
                    }],
                tag: [{
                        token: function (start, tag) {
                            var group = tagMap[tag];
                            return ["meta.tag.punctuation." + (start == "<" ? "" : "end-") + "tag-open.xml",
                                "meta.tag" + (group ? "." + group : "") + ".tag-name.xml"];
                        },
                        regex: "(</?)([-_a-zA-Z0-9:]+)",
                        next: "tag_stuff"
                    }],
                tag_stuff: [
                    { include: "attributes" },
                    { token: "meta.tag.punctuation.tag-close.xml", regex: "/?>", next: "start" }
                ],
            });
            this.embedTagRules(CssHighlightRules_1.default, "css-", "style");
            this.embedTagRules(JavaScriptHighlightRules_1.default, "js-", "script");
            if (this.constructor === HtmlHighlightRules)
                this.normalizeRules();
        }
        return HtmlHighlightRules;
    })(XmlHighlightRules_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HtmlHighlightRules;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/behaviour/XmlBehaviour',["require", "exports", "../Behaviour", "../../TokenIterator"], function (require, exports, Behaviour_1, TokenIterator_1) {
    "use strict";
    function is(token, type) {
        return token.type.lastIndexOf(type + ".xml") > -1;
    }
    var XmlBehaviour = (function (_super) {
        __extends(XmlBehaviour, _super);
        function XmlBehaviour() {
            _super.call(this);
            this.add("string_dquotes", "insertion", function (state, action, editor, session, text) {
                if (text === '"' || text === "'") {
                    var quote = text;
                    var selected = session.doc.getTextRange(editor.getSelectionRange());
                    if (selected !== "" && selected !== "'" && selected !== '"' && editor.getWrapBehavioursEnabled()) {
                        return {
                            text: quote + selected + quote,
                            selection: void 0
                        };
                    }
                    var cursor = editor.getCursorPosition();
                    var line = session.doc.getLine(cursor.row);
                    var rightChar = line.substring(cursor.column, cursor.column + 1);
                    var iterator = new TokenIterator_1.default(session, cursor.row, cursor.column);
                    var token = iterator.getCurrentToken();
                    if (rightChar === quote && (is(token, "attribute-value") || is(token, "string"))) {
                        return {
                            text: "",
                            selection: [1, 1]
                        };
                    }
                    if (!token)
                        token = iterator.stepBackward();
                    if (!token)
                        return;
                    while (is(token, "tag-whitespace") || is(token, "whitespace")) {
                        token = iterator.stepBackward();
                    }
                    var rightSpace = !rightChar || rightChar.match(/\s/);
                    if (is(token, "attribute-equals") && (rightSpace || rightChar === '>') || (is(token, "decl-attribute-equals") && (rightSpace || rightChar == '?'))) {
                        return {
                            text: quote + quote,
                            selection: [1, 1]
                        };
                    }
                }
            });
            this.add("string_dquotes", "deletion", function (state, action, editor, session, range) {
                var selected = session.doc.getTextRange(range);
                if (!range.isMultiLine() && (selected === '"' || selected === "'")) {
                    var line = session.doc.getLine(range.start.row);
                    var rightChar = line.substring(range.start.column + 1, range.start.column + 2);
                    if (rightChar == selected) {
                        range.end.column++;
                        return range;
                    }
                }
            });
            this.add("autoclosing", "insertion", function (state, action, editor, session, text) {
                if (text === '>') {
                    var position = editor.getCursorPosition();
                    var iterator = new TokenIterator_1.default(session, position.row, position.column);
                    var token = iterator.getCurrentToken() || iterator.stepBackward();
                    if (!token || !(is(token, "tag-name") || is(token, "tag-whitespace") || is(token, "attribute-name") || is(token, "attribute-equals") || is(token, "attribute-value")))
                        return;
                    if (is(token, "reference.attribute-value"))
                        return;
                    if (is(token, "attribute-value")) {
                        var firstChar = token.value.charAt(0);
                        if (firstChar == '"' || firstChar == "'") {
                            var lastChar = token.value.charAt(token.value.length - 1);
                            var tokenEnd = iterator.getCurrentTokenColumn() + token.value.length;
                            if (tokenEnd > position.column || tokenEnd == position.column && firstChar != lastChar)
                                return;
                        }
                    }
                    while (!is(token, "tag-name")) {
                        token = iterator.stepBackward();
                    }
                    var tokenRow = iterator.getCurrentTokenRow();
                    var tokenColumn = iterator.getCurrentTokenColumn();
                    if (is(iterator.stepBackward(), "end-tag-open"))
                        return;
                    var element = token.value;
                    if (tokenRow == position.row)
                        element = element.substring(0, position.column - tokenColumn);
                    if (this.voidElements.hasOwnProperty(element.toLowerCase()))
                        return;
                    return {
                        text: '>' + '</' + element + '>',
                        selection: [1, 1]
                    };
                }
            });
            this.add('autoindent', 'insertion', function (state, action, editor, session, text) {
                if (text === "\n") {
                    var cursor = editor.getCursorPosition();
                    var line = session.getLine(cursor.row);
                    var rightChars = line.substring(cursor.column, cursor.column + 2);
                    if (rightChars == '</') {
                        var next_indent = this.$getIndent(line);
                        var indent = next_indent + session.getTabString();
                        return {
                            text: '\n' + indent + '\n' + next_indent,
                            selection: [1, indent.length, 1, indent.length]
                        };
                    }
                }
            });
        }
        return XmlBehaviour;
    })(Behaviour_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = XmlBehaviour;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/behaviour/HtmlBehaviour',["require", "exports", "../behaviour/XmlBehaviour"], function (require, exports, XmlBehaviour_1) {
    "use strict";
    var HtmlBehaviour = (function (_super) {
        __extends(HtmlBehaviour, _super);
        function HtmlBehaviour() {
            _super.call(this);
        }
        return HtmlBehaviour;
    })(XmlBehaviour_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HtmlBehaviour;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/folding/MixedFoldMode',["require", "exports", "./FoldMode"], function (require, exports, FoldMode_1) {
    "use strict";
    var MixedFoldMode = (function (_super) {
        __extends(MixedFoldMode, _super);
        function MixedFoldMode(defaultMode, subModes) {
            _super.call(this);
            this.defaultMode = defaultMode;
            this.subModes = subModes;
        }
        MixedFoldMode.prototype.$getMode = function (state) {
            if (typeof state !== "string") {
                state = state[0];
            }
            for (var key in this.subModes) {
                if (state.indexOf(key) === 0)
                    return this.subModes[key];
            }
            return null;
        };
        MixedFoldMode.prototype.$tryMode = function (state, session, foldStyle, row) {
            var mode = this.$getMode(state);
            return (mode ? mode.getFoldWidget(session, foldStyle, row) : "");
        };
        MixedFoldMode.prototype.getFoldWidget = function (session, foldStyle, row) {
            return (this.$tryMode(session.getState(row - 1), session, foldStyle, row) ||
                this.$tryMode(session.getState(row), session, foldStyle, row) ||
                this.defaultMode.getFoldWidget(session, foldStyle, row));
        };
        MixedFoldMode.prototype.getFoldWidgetRange = function (session, foldStyle, row) {
            var mode = this.$getMode(session.getState(row - 1));
            if (!mode || !mode.getFoldWidget(session, foldStyle, row)) {
                mode = this.$getMode(session.getState(row));
            }
            if (!mode || !mode.getFoldWidget(session, foldStyle, row)) {
                mode = this.defaultMode;
            }
            return mode.getFoldWidgetRange(session, foldStyle, row);
        };
        return MixedFoldMode;
    })(FoldMode_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MixedFoldMode;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/folding/XmlFoldMode',["require", "exports", "../../lib/oop", "../../Range", "./FoldMode", "../../TokenIterator"], function (require, exports, oop_1, Range_1, FoldMode_1, TokenIterator_1) {
    "use strict";
    var XmlFoldMode = (function (_super) {
        __extends(XmlFoldMode, _super);
        function XmlFoldMode(voidElements, optionalEndTags) {
            _super.call(this);
            this.voidElements = voidElements || {};
            this.optionalEndTags = oop_1.mixin({}, this.voidElements);
            if (optionalEndTags) {
                oop_1.mixin(this.optionalEndTags, optionalEndTags);
            }
        }
        XmlFoldMode.prototype.getFoldWidget = function (session, foldStyle, row) {
            var tag = this._getFirstTagInLine(session, row);
            if (!tag)
                return "";
            if (tag.closing || (!tag.tagName && tag.selfClosing))
                return foldStyle === "markbeginend" ? "end" : "";
            if (!tag.tagName || tag.selfClosing || this.voidElements.hasOwnProperty(tag.tagName.toLowerCase()))
                return "";
            if (this._findEndTagInLine(session, row, tag.tagName, tag.end.column))
                return "";
            return "start";
        };
        XmlFoldMode.prototype._getFirstTagInLine = function (session, row) {
            var tokens = session.getTokens(row);
            var tag = new Tag();
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                if (is(token, "tag-open")) {
                    tag.end.column = tag.start.column + token.value.length;
                    tag.closing = is(token, "end-tag-open");
                    token = tokens[++i];
                    if (!token)
                        return null;
                    tag.tagName = token.value;
                    tag.end.column += token.value.length;
                    for (i++; i < tokens.length; i++) {
                        token = tokens[i];
                        tag.end.column += token.value.length;
                        if (is(token, "tag-close")) {
                            tag.selfClosing = token.value == '/>';
                            break;
                        }
                    }
                    return tag;
                }
                else if (is(token, "tag-close")) {
                    tag.selfClosing = token.value == '/>';
                    return tag;
                }
                tag.start.column += token.value.length;
            }
            return null;
        };
        XmlFoldMode.prototype._findEndTagInLine = function (session, row, tagName, startColumn) {
            var tokens = session.getTokens(row);
            var column = 0;
            for (var i = 0; i < tokens.length; i++) {
                var token = tokens[i];
                column += token.value.length;
                if (column < startColumn)
                    continue;
                if (is(token, "end-tag-open")) {
                    token = tokens[i + 1];
                    if (token && token.value == tagName)
                        return true;
                }
            }
            return false;
        };
        XmlFoldMode.prototype._readTagForward = function (iterator) {
            var token = iterator.getCurrentToken();
            if (!token)
                return null;
            var tag = new Tag();
            do {
                if (is(token, "tag-open")) {
                    tag.closing = is(token, "end-tag-open");
                    tag.start.row = iterator.getCurrentTokenRow();
                    tag.start.column = iterator.getCurrentTokenColumn();
                }
                else if (is(token, "tag-name")) {
                    tag.tagName = token.value;
                }
                else if (is(token, "tag-close")) {
                    tag.selfClosing = token.value == "/>";
                    tag.end.row = iterator.getCurrentTokenRow();
                    tag.end.column = iterator.getCurrentTokenColumn() + token.value.length;
                    iterator.stepForward();
                    return tag;
                }
            } while (token = iterator.stepForward());
            return null;
        };
        XmlFoldMode.prototype._readTagBackward = function (iterator) {
            var token = iterator.getCurrentToken();
            if (!token)
                return null;
            var tag = new Tag();
            do {
                if (is(token, "tag-open")) {
                    tag.closing = is(token, "end-tag-open");
                    tag.start.row = iterator.getCurrentTokenRow();
                    tag.start.column = iterator.getCurrentTokenColumn();
                    iterator.stepBackward();
                    return tag;
                }
                else if (is(token, "tag-name")) {
                    tag.tagName = token.value;
                }
                else if (is(token, "tag-close")) {
                    tag.selfClosing = token.value == "/>";
                    tag.end.row = iterator.getCurrentTokenRow();
                    tag.end.column = iterator.getCurrentTokenColumn() + token.value.length;
                }
            } while (token = iterator.stepBackward());
            return null;
        };
        XmlFoldMode.prototype._pop = function (stack, tag) {
            while (stack.length) {
                var top = stack[stack.length - 1];
                if (!tag || top.tagName == tag.tagName) {
                    return stack.pop();
                }
                else if (this.optionalEndTags.hasOwnProperty(tag.tagName)) {
                    return;
                }
                else if (this.optionalEndTags.hasOwnProperty(top.tagName)) {
                    stack.pop();
                    continue;
                }
                else {
                    return null;
                }
            }
        };
        XmlFoldMode.prototype.getFoldWidgetRange = function (session, foldStyle, row) {
            var firstTag = this._getFirstTagInLine(session, row);
            if (!firstTag) {
                return null;
            }
            var isBackward = firstTag.closing || firstTag.selfClosing;
            var stack = [];
            var tag;
            if (!isBackward) {
                var iterator = new TokenIterator_1.default(session, row, firstTag.start.column);
                var start = {
                    row: row,
                    column: firstTag.start.column + firstTag.tagName.length + 2
                };
                while (tag = this._readTagForward(iterator)) {
                    if (tag.selfClosing) {
                        if (!stack.length) {
                            tag.start.column += tag.tagName.length + 2;
                            tag.end.column -= 2;
                            return Range_1.default.fromPoints(tag.start, tag.end);
                        }
                        else
                            continue;
                    }
                    if (tag.closing) {
                        this._pop(stack, tag);
                        if (stack.length == 0)
                            return Range_1.default.fromPoints(start, tag.start);
                    }
                    else {
                        stack.push(tag);
                    }
                }
            }
            else {
                var iterator = new TokenIterator_1.default(session, row, firstTag.end.column);
                var end = {
                    row: row,
                    column: firstTag.start.column
                };
                while (tag = this._readTagBackward(iterator)) {
                    if (tag.selfClosing) {
                        if (!stack.length) {
                            tag.start.column += tag.tagName.length + 2;
                            tag.end.column -= 2;
                            return Range_1.default.fromPoints(tag.start, tag.end);
                        }
                        else {
                            continue;
                        }
                    }
                    if (!tag.closing) {
                        this._pop(stack, tag);
                        if (stack.length === 0) {
                            tag.start.column += tag.tagName.length + 2;
                            return Range_1.default.fromPoints(tag.start, end);
                        }
                    }
                    else {
                        stack.push(tag);
                    }
                }
            }
        };
        return XmlFoldMode;
    })(FoldMode_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = XmlFoldMode;
    var Tag = (function () {
        function Tag() {
            this.tagName = "";
            this.closing = false;
            this.selfClosing = false;
            this.start = { row: 0, column: 0 };
            this.end = { row: 0, column: 0 };
        }
        return Tag;
    })();
    exports.Tag = Tag;
    function is(token, type) {
        return token.type.lastIndexOf(type + ".xml") > -1;
    }
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/folding/HtmlFoldMode',["require", "exports", "./MixedFoldMode", "./XmlFoldMode", "./CstyleFoldMode"], function (require, exports, MixedFoldMode_1, XmlFoldMode_1, CstyleFoldMode_1) {
    "use strict";
    var HtmlFoldMode = (function (_super) {
        __extends(HtmlFoldMode, _super);
        function HtmlFoldMode(voidElements, optionalTags) {
            _super.call(this, new XmlFoldMode_1.default(voidElements, optionalTags), { "js-": new CstyleFoldMode_1.default(), "css-": new CstyleFoldMode_1.default() });
        }
        return HtmlFoldMode;
    })(MixedFoldMode_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HtmlFoldMode;
});

define('mode/HtmlCompletions',["require", "exports", "../TokenIterator"], function (require, exports, TokenIterator_1) {
    "use strict";
    var commonAttributes = [
        "accesskey",
        "class",
        "contenteditable",
        "contextmenu",
        "dir",
        "draggable",
        "dropzone",
        "hidden",
        "id",
        "inert",
        "itemid",
        "itemprop",
        "itemref",
        "itemscope",
        "itemtype",
        "lang",
        "spellcheck",
        "style",
        "tabindex",
        "title",
        "translate"
    ];
    var eventAttributes = [
        "onabort",
        "onblur",
        "oncancel",
        "oncanplay",
        "oncanplaythrough",
        "onchange",
        "onclick",
        "onclose",
        "oncontextmenu",
        "oncuechange",
        "ondblclick",
        "ondrag",
        "ondragend",
        "ondragenter",
        "ondragleave",
        "ondragover",
        "ondragstart",
        "ondrop",
        "ondurationchange",
        "onemptied",
        "onended",
        "onerror",
        "onfocus",
        "oninput",
        "oninvalid",
        "onkeydown",
        "onkeypress",
        "onkeyup",
        "onload",
        "onloadeddata",
        "onloadedmetadata",
        "onloadstart",
        "onmousedown",
        "onmousemove",
        "onmouseout",
        "onmouseover",
        "onmouseup",
        "onmousewheel",
        "onpause",
        "onplay",
        "onplaying",
        "onprogress",
        "onratechange",
        "onreset",
        "onscroll",
        "onseeked",
        "onseeking",
        "onselect",
        "onshow",
        "onstalled",
        "onsubmit",
        "onsuspend",
        "ontimeupdate",
        "onvolumechange",
        "onwaiting"
    ];
    var globalAttributes = commonAttributes.concat(eventAttributes);
    var attributeMap = {
        "html": ["manifest"],
        "head": [],
        "title": [],
        "base": ["href", "target"],
        "link": ["href", "hreflang", "rel", "media", "type", "sizes"],
        "meta": ["http-equiv", "name", "content", "charset"],
        "style": ["type", "media", "scoped"],
        "script": ["charset", "type", "src", "defer", "async"],
        "noscript": ["href"],
        "body": ["onafterprint", "onbeforeprint", "onbeforeunload", "onhashchange", "onmessage", "onoffline", "onpopstate", "onredo", "onresize", "onstorage", "onundo", "onunload"],
        "section": [],
        "nav": [],
        "article": ["pubdate"],
        "aside": [],
        "h1": [],
        "h2": [],
        "h3": [],
        "h4": [],
        "h5": [],
        "h6": [],
        "header": [],
        "footer": [],
        "address": [],
        "main": [],
        "p": [],
        "hr": [],
        "pre": [],
        "blockquote": ["cite"],
        "ol": ["start", "reversed"],
        "ul": [],
        "li": ["value"],
        "dl": [],
        "dt": [],
        "dd": [],
        "figure": [],
        "figcaption": [],
        "div": [],
        "a": ["href", "target", "ping", "rel", "media", "hreflang", "type"],
        "em": [],
        "strong": [],
        "small": [],
        "s": [],
        "cite": [],
        "q": ["cite"],
        "dfn": [],
        "abbr": [],
        "data": [],
        "time": ["datetime"],
        "code": [],
        "var": [],
        "samp": [],
        "kbd": [],
        "sub": [],
        "sup": [],
        "i": [],
        "b": [],
        "u": [],
        "mark": [],
        "ruby": [],
        "rt": [],
        "rp": [],
        "bdi": [],
        "bdo": [],
        "span": [],
        "br": [],
        "wbr": [],
        "ins": ["cite", "datetime"],
        "del": ["cite", "datetime"],
        "img": ["alt", "src", "height", "width", "usemap", "ismap"],
        "iframe": ["name", "src", "height", "width", "sandbox", "seamless"],
        "embed": ["src", "height", "width", "type"],
        "object": ["param", "data", "type", "height", "width", "usemap", "name", "form", "classid"],
        "param": ["name", "value"],
        "video": ["src", "autobuffer", "autoplay", "loop", "controls", "width", "height", "poster"],
        "audio": ["src", "autobuffer", "autoplay", "loop", "controls"],
        "source": ["src", "type", "media"],
        "track": ["kind", "src", "srclang", "label", "default"],
        "canvas": ["width", "height"],
        "map": ["name"],
        "area": ["shape", "coords", "href", "hreflang", "alt", "target", "media", "rel", "ping", "type"],
        "svg": [],
        "math": [],
        "table": ["summary"],
        "caption": [],
        "colgroup": ["span"],
        "col": ["span"],
        "tbody": [],
        "thead": [],
        "tfoot": [],
        "tr": [],
        "td": ["headers", "rowspan", "colspan"],
        "th": ["headers", "rowspan", "colspan", "scope"],
        "form": ["accept-charset", "action", "autocomplete", "enctype", "method", "name", "novalidate", "target"],
        "fieldset": ["disabled", "form", "name"],
        "legend": [],
        "label": ["form", "for"],
        "input": ["type", "accept", "alt", "autocomplete", "checked", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "list", "max", "maxlength", "min", "multiple", "pattern", "placeholder", "readonly", "required", "size", "src", "step", "width", "files", "value"],
        "button": ["autofocus", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "name", "value", "type"],
        "select": ["autofocus", "disabled", "form", "multiple", "name", "size"],
        "datalist": [],
        "optgroup": ["disabled", "label"],
        "option": ["disabled", "selected", "label", "value"],
        "textarea": ["autofocus", "disabled", "form", "maxlength", "name", "placeholder", "readonly", "required", "rows", "cols", "wrap"],
        "keygen": ["autofocus", "challenge", "disabled", "form", "keytype", "name"],
        "output": ["for", "form", "name"],
        "progress": ["value", "max"],
        "meter": ["value", "min", "max", "low", "high", "optimum"],
        "details": ["open"],
        "summary": [],
        "command": ["type", "label", "icon", "disabled", "checked", "radiogroup", "command"],
        "menu": ["type", "label"],
        "dialog": ["open"]
    };
    var elements = Object.keys(attributeMap);
    function is(token, type) {
        return token.type.lastIndexOf(type + ".xml") > -1;
    }
    function findTagName(session, pos) {
        var iterator = new TokenIterator_1.default(session, pos.row, pos.column);
        var token = iterator.getCurrentToken();
        while (token && !is(token, "tag-name")) {
            token = iterator.stepBackward();
        }
        if (token)
            return token.value;
    }
    var HtmlCompletions = (function () {
        function HtmlCompletions() {
        }
        HtmlCompletions.prototype.getCompletions = function (state, session, pos, prefix) {
            var token = session.getTokenAt(pos.row, pos.column);
            if (!token)
                return [];
            if (is(token, "tag-name") || is(token, "tag-open") || is(token, "end-tag-open"))
                return this.getTagCompletions(state, session, pos, prefix);
            if (is(token, "tag-whitespace") || is(token, "attribute-name"))
                return this.getAttributeCompetions(state, session, pos, prefix);
            return [];
        };
        HtmlCompletions.prototype.getTagCompletions = function (state, session, pos, prefix) {
            return elements.map(function (element) {
                return {
                    value: element,
                    meta: "tag",
                    score: Number.MAX_VALUE
                };
            });
        };
        HtmlCompletions.prototype.getAttributeCompetions = function (state, session, pos, prefix) {
            var tagName = findTagName(session, pos);
            if (!tagName)
                return [];
            var attributes = globalAttributes;
            if (tagName in attributeMap) {
                attributes = attributes.concat(attributeMap[tagName]);
            }
            return attributes.map(function (attribute) {
                return {
                    caption: attribute,
                    snippet: attribute + '="$0"',
                    meta: "attribute",
                    score: Number.MAX_VALUE
                };
            });
        };
        return HtmlCompletions;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HtmlCompletions;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/HtmlMode',["require", "exports", "../lib/lang", "./TextMode", "./JavaScriptMode", "./CssMode", "./HtmlHighlightRules", "./behaviour/HtmlBehaviour", "./folding/HtmlFoldMode", "./HtmlCompletions", "../worker/WorkerClient"], function (require, exports, lang_1, TextMode_1, JavaScriptMode_1, CssMode_1, HtmlHighlightRules_1, HtmlBehaviour_1, HtmlFoldMode_1, HtmlCompletions_1, WorkerClient_1) {
    "use strict";
    var voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
    var optionalEndTags = ["li", "dt", "dd", "p", "rt", "rp", "optgroup", "option", "colgroup", "td", "th"];
    var HtmlMode = (function (_super) {
        __extends(HtmlMode, _super);
        function HtmlMode(workerUrl, scriptImports, options) {
            _super.call(this, workerUrl, scriptImports);
            this.blockComment = { start: "<!--", end: "-->" };
            this.voidElements = lang_1.arrayToMap(voidElements, 1);
            this.$id = "ace/mode/html";
            this.fragmentContext = options && options.fragmentContext;
            this.HighlightRules = HtmlHighlightRules_1.default;
            this.$behaviour = new HtmlBehaviour_1.default();
            this.$completer = new HtmlCompletions_1.default();
            var X = JavaScriptMode_1.default;
            this.createModeDelegates({
                "js-": JavaScriptMode_1.default,
                "css-": CssMode_1.default
            });
            this.foldingRules = new HtmlFoldMode_1.default(this.voidElements, lang_1.arrayToMap(optionalEndTags, 1));
        }
        HtmlMode.prototype.getNextLineIndent = function (state, line, tab) {
            return this.$getIndent(line);
        };
        HtmlMode.prototype.checkOutdent = function (state, line, text) {
            return false;
        };
        HtmlMode.prototype.getCompletions = function (state, session, pos, prefix) {
            return this.$completer.getCompletions(state, session, pos, prefix);
        };
        HtmlMode.prototype.createWorker = function (session) {
            var workerUrl = this.workerUrl;
            var scriptImports = this.scriptImports;
            var mode = this;
            var worker = new WorkerClient_1.default(workerUrl);
            worker.on("initAfter", function () {
                worker.attachToDocument(session.getDocument());
                if (mode.fragmentContext) {
                    worker.call("setOptions", [{ context: mode.fragmentContext }]);
                }
            });
            worker.on("initFail", function (message) {
            });
            worker.on('annotations', function (event) {
                var annotations = event.data;
                if (annotations.length > 0) {
                    session.setAnnotations(annotations);
                }
                else {
                    session.clearAnnotations();
                }
                session._emit("annotations", { data: annotations });
            });
            worker.on("terminate", function () {
                worker.detachFromDocument();
                session.clearAnnotations();
            });
            worker.init(scriptImports, 'ace-workers.js', 'HtmlWorker');
            return worker;
        };
        ;
        return HtmlMode;
    })(TextMode_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = HtmlMode;
});

define('mode/createHtmlMode',["require", "exports", './HtmlMode'], function (require, exports, HtmlMode_1) {
    function createCssMode(workerUrl, scriptImports) {
        return new HtmlMode_1.default(workerUrl, scriptImports);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createCssMode;
});

define('mode/createTextMode',["require", "exports", './TextMode'], function (require, exports, TextMode_1) {
    function createCssMode(workerUrl, scriptImports) {
        return new TextMode_1.default(workerUrl, scriptImports);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createCssMode;
});

define('mode/createJavaScriptMode',["require", "exports", './JavaScriptMode'], function (require, exports, JavaScriptMode_1) {
    function createCssMode(workerUrl, scriptImports) {
        return new JavaScriptMode_1.default(workerUrl, scriptImports);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createCssMode;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/TypeScriptHighlightRules',["require", "exports", "./JavaScriptHighlightRules"], function (require, exports, JavaScriptHighlightRules_1) {
    "use strict";
    var TypeScriptHighlightRiles = (function (_super) {
        __extends(TypeScriptHighlightRiles, _super);
        function TypeScriptHighlightRiles(options) {
            _super.call(this, options);
            var tsRules = [
                {
                    token: ["keyword.operator.ts", "text", "variable.parameter.function.ts", "text"],
                    regex: "\\b(module)(\\s*)([a-zA-Z0-9_?.$][\\w?.$]*)(\\s*\\{)"
                },
                {
                    token: ["storage.type.variable.ts", "text", "keyword.other.ts", "text"],
                    regex: "(super)(\\s*\\()([a-zA-Z0-9,_?.$\\s]+\\s*)(\\))"
                },
                {
                    token: ["entity.name.function.ts", "paren.lparen", "paren.rparen"],
                    regex: "([a-zA-Z_?.$][\\w?.$]*)(\\()(\\))"
                },
                {
                    token: ["variable.parameter.function.ts", "text", "variable.parameter.function.ts"],
                    regex: "([a-zA-Z0-9_?.$][\\w?.$]*)(\\s*:\\s*)([a-zA-Z0-9_?.$][\\w?.$]*)"
                },
                {
                    token: ["keyword.operator.ts"],
                    regex: "(?:\\b(constructor|declare|interface|as|AS|public|private|class|extends|export|super)\\b)"
                },
                {
                    token: ["storage.type.variable.ts"],
                    regex: "(?:\\b(this\\.|string\\b|bool\\b|number)\\b)"
                },
                {
                    token: ["keyword.operator.ts", "storage.type.variable.ts", "keyword.operator.ts", "storage.type.variable.ts"],
                    regex: "(class)(\\s+[a-zA-Z0-9_?.$][\\w?.$]*\\s+)(extends)(\\s+[a-zA-Z0-9_?.$][\\w?.$]*\\s+)?"
                },
                {
                    token: "keyword",
                    regex: "(?:super|export|class|extends|import)\\b"
                }
            ];
            var JSRules = new JavaScriptHighlightRules_1.default().getRules();
            JSRules.start = tsRules.concat(JSRules.start);
            this.$rules = JSRules;
        }
        return TypeScriptHighlightRiles;
    })(JavaScriptHighlightRules_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TypeScriptHighlightRiles;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('mode/TypeScriptMode',["require", "exports", "./JavaScriptMode", "./TypeScriptHighlightRules", "./behaviour/CstyleBehaviour", "./folding/CstyleFoldMode", "./MatchingBraceOutdent", "../worker/WorkerClient"], function (require, exports, JavaScriptMode_1, TypeScriptHighlightRules_1, CstyleBehaviour_1, CstyleFoldMode_1, MatchingBraceOutdent_1, WorkerClient_1) {
    "use strict";
    var TypeScriptMode = (function (_super) {
        __extends(TypeScriptMode, _super);
        function TypeScriptMode(workerUrl, scriptImports) {
            _super.call(this, workerUrl, scriptImports);
            this.$id = "ace/mode/typescript";
            this.HighlightRules = TypeScriptHighlightRules_1.default;
            this.$outdent = new MatchingBraceOutdent_1.default();
            this.$behaviour = new CstyleBehaviour_1.default();
            this.foldingRules = new CstyleFoldMode_1.default();
        }
        TypeScriptMode.prototype.createWorker = function (session) {
            var workerUrl = this.workerUrl;
            var scriptImports = this.scriptImports;
            var worker = new WorkerClient_1.default(workerUrl);
            worker.on("initAfter", function (event) {
                worker.attachToDocument(session.getDocument());
            });
            worker.on("initFail", function (message) {
            });
            worker.on("terminate", function () {
                worker.detachFromDocument();
                session.clearAnnotations();
            });
            worker.on('annotations', function (event) {
                var annotations = event.data;
                if (annotations.length > 0) {
                }
                else {
                }
                session._emit("annotations", { data: annotations });
            });
            worker.on("getFileNames", function (event) {
                session._emit("getFileNames", { data: event.data });
            });
            worker.init(scriptImports, 'ace-workers.js', 'TypeScriptWorker');
            return worker;
        };
        ;
        return TypeScriptMode;
    })(JavaScriptMode_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TypeScriptMode;
});

define('mode/createTypeScriptMode',["require", "exports", './TypeScriptMode'], function (require, exports, TypeScriptMode_1) {
    function createTypeScriptMode(workerUrl, scriptImports) {
        return new TypeScriptMode_1.default(workerUrl, scriptImports);
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = createTypeScriptMode;
});

define('edit',["require", "exports", './createDocument', './createEditor', './createEditSession', './createRenderer', './createUndoManager'], function (require, exports, createDocument_1, createEditor_1, createEditSession_1, createRenderer_1, createUndoManager_1) {
    function edit(container) {
        var text = "";
        if (container && /input|textarea/i.test(container.tagName)) {
            var oldNode = container;
            text = oldNode.value;
            container = container.ownerDocument.createElement('pre');
            oldNode.parentNode.replaceChild(container, oldNode);
        }
        else if (container) {
            text = container.innerHTML;
            container.innerHTML = "";
        }
        var doc = createDocument_1.default(text);
        var session = createEditSession_1.default(doc);
        var renderer = createRenderer_1.default(container);
        var editor = createEditor_1.default(renderer, session);
        var undoManager = createUndoManager_1.default();
        editor.getSession().setUndoManager(undoManager);
        return editor;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = edit;
});

define('ace',["require", "exports", "./createAnchor", "./createDocument", "./createEditor", "./createEditSession", "./createFold", "./createFoldLine", "./createRange", "./createRenderer", "./createTokenizer", "./createUndoManager", "./createWorkerClient", "./workspace/createWorkspace", "./mode/createCssMode", "./mode/createHtmlMode", "./mode/createTextMode", "./mode/createJavaScriptMode", "./mode/createTypeScriptMode", "./edit"], function (require, exports, createAnchor_1, createDocument_1, createEditor_1, createEditSession_1, createFold_1, createFoldLine_1, createRange_1, createRenderer_1, createTokenizer_1, createUndoManager_1, createWorkerClient_1, createWorkspace_1, createCssMode_1, createHtmlMode_1, createTextMode_1, createJavaScriptMode_1, createTypeScriptMode_1, edit_1) {
    'use strict';
    var ace = {
        get createAnchor() { return createAnchor_1.default; },
        get createDocument() { return createDocument_1.default; },
        get createEditor() { return createEditor_1.default; },
        get createEditSession() { return createEditSession_1.default; },
        get createFold() { return createFold_1.default; },
        get createFoldLine() { return createFoldLine_1.default; },
        get createRange() { return createRange_1.default; },
        get createRenderer() { return createRenderer_1.default; },
        get createTokenizer() { return createTokenizer_1.default; },
        get createUndoManager() { return createUndoManager_1.default; },
        get createWorkerClient() { return createWorkerClient_1.default; },
        get createWorkspace() { return createWorkspace_1.default; },
        get edit() { return edit_1.default; },
        get createCssMode() { return createCssMode_1.default; },
        get createHtmlMode() { return createHtmlMode_1.default; },
        get createTextMode() { return createTextMode_1.default; },
        get createJavaScriptMode() { return createJavaScriptMode_1.default; },
        get createTypeScriptMode() { return createTypeScriptMode_1.default; }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ace;
});

  var library = require('ace').default;
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['ace'] = library;
  }
}(this));
