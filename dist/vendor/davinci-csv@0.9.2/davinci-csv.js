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

define('davinci-csv/config',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Config = (function () {
        function Config() {
            this.GITHUB = 'https://github.com/geometryzen/davinci-csv';
            this.LAST_MODIFIED = '2017-03-07';
            this.NAMESPACE = 'CSV';
            this.VERSION = '0.9.2';
        }
        return Config;
    }());
    var config = new Config();
    exports.default = config;
});

define('davinci-csv/core/CSV',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var rxIsInt = /^\d+$/;
    var rxIsFloat = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
    var rxNeedsQuoting = /^\s|\s$|,|"|\n/;
    var trim = (function () {
        if (String.prototype.trim) {
            return function (s) {
                return s.trim();
            };
        }
        else {
            return function (s) {
                return s.replace(/^\s*/, '').replace(/\s*$/, '');
            };
        }
    }());
    function chomp(s, lineterminator) {
        if (s.charAt(s.length - lineterminator.length) !== lineterminator) {
            return s;
        }
        else {
            return s.substring(0, s.length - lineterminator.length);
        }
    }
    function normalizeLineTerminator(csvString, dialect) {
        if (dialect === void 0) { dialect = {}; }
        if (!dialect.lineTerminator) {
            return csvString.replace(/(\r\n|\n|\r)/gm, '\n');
        }
        return csvString;
    }
    function dataToArrays(data) {
        var arrays = [];
        var fieldNames = [];
        for (var ii = 0; ii < data.fields.length; ii++) {
            fieldNames.push(data.fields[ii].id);
        }
        arrays.push(fieldNames);
        for (var ii = 0; ii < data.records.length; ii++) {
            var tmp = [];
            var record = data.records[ii];
            for (var jj = 0; jj < fieldNames.length; jj++) {
                tmp.push(record[fieldNames[jj]]);
            }
            arrays.push(tmp);
        }
        return arrays;
    }
    exports.dataToArrays = dataToArrays;
    function normalizeDialectOptions(dialect) {
        var options = {
            delim: ',',
            escape: true,
            lineTerm: '\n',
            quoteChar: '"',
            skipRows: 0,
            trim: true
        };
        if (dialect) {
            if (typeof dialect.fieldDelimiter === 'string') {
                options.delim = dialect.fieldDelimiter;
            }
            if (typeof dialect.escapeEmbeddedQuotes === 'boolean') {
                options.escape = dialect.escapeEmbeddedQuotes;
            }
            if (typeof dialect.lineTerminator === 'string') {
                options.lineTerm = dialect.lineTerminator;
            }
            if (typeof dialect.quoteChar === 'string') {
                options.quoteChar = dialect.quoteChar;
            }
            if (typeof dialect.skipInitialRows === 'number') {
                options.skipRows = dialect.skipInitialRows;
            }
            if (typeof dialect.trimFields === 'boolean') {
                options.trim = dialect.trimFields;
            }
        }
        return options;
    }
    function serialize(data, dialect) {
        var a = (data instanceof Array) ? data : dataToArrays(data);
        var options = normalizeDialectOptions(dialect);
        var fieldToString = function fieldToString(field) {
            if (field === null) {
                field = '';
            }
            else if (typeof field === "string" && rxNeedsQuoting.test(field)) {
                if (options.escape) {
                    field = field.replace(/"/g, '""');
                }
                field = options.quoteChar + field + options.quoteChar;
            }
            else if (typeof field === "number") {
                field = field.toString(10);
            }
            return field;
        };
        var outBuffer = '';
        for (var i = 0; i < a.length; i += 1) {
            var fields = a[i];
            var rowBuffer = '';
            for (var j = 0; j < fields.length; j += 1) {
                var fieldBuffer = fieldToString(fields[j]);
                if (j === (fields.length - 1)) {
                    rowBuffer += fieldBuffer;
                    outBuffer += rowBuffer + options.lineTerm;
                    rowBuffer = '';
                }
                else {
                    rowBuffer += fieldBuffer + options.delim;
                }
            }
        }
        return outBuffer;
    }
    exports.serialize = serialize;
    function normalizeInputString(csvText, dialect) {
        if (!dialect || (dialect && !dialect.lineTerminator)) {
            csvText = normalizeLineTerminator(csvText, dialect);
        }
        var options = normalizeDialectOptions(dialect);
        return { s: chomp(csvText, options.lineTerm), options: options };
    }
    function parse(csvText, dialect) {
        var _a = normalizeInputString(csvText, dialect), s = _a.s, options = _a.options;
        var sLength = s.length;
        var ch = '';
        var inQuote = false;
        var fieldQuoted = false;
        var field = '';
        var row = [];
        var out = [];
        var parseField = function parseField(fieldAsString) {
            if (fieldQuoted) {
                return fieldAsString;
            }
            else {
                if (fieldAsString === '') {
                    return null;
                }
                else if (options.trim) {
                    fieldAsString = trim(fieldAsString);
                }
                if (rxIsInt.test(fieldAsString)) {
                    return parseInt(fieldAsString, 10);
                }
                else if (rxIsFloat.test(fieldAsString)) {
                    return parseFloat(fieldAsString);
                }
                else {
                    return fieldAsString;
                }
            }
        };
        for (var i = 0; i < sLength; i += 1) {
            ch = s.charAt(i);
            if (inQuote === false && (ch === options.delim || ch === options.lineTerm)) {
                field = parseField(field);
                row.push(field);
                if (ch === options.lineTerm) {
                    out.push(row);
                    row = [];
                }
                field = '';
                fieldQuoted = false;
            }
            else {
                if (ch !== options.quoteChar) {
                    field += ch;
                }
                else {
                    if (!inQuote) {
                        inQuote = true;
                        fieldQuoted = true;
                    }
                    else {
                        if (s.charAt(i + 1) === options.quoteChar) {
                            field += options.quoteChar;
                            i += 1;
                        }
                        else {
                            inQuote = false;
                        }
                    }
                }
            }
        }
        field = parseField(field);
        row.push(field);
        out.push(row);
        if (options.skipRows)
            out = out.slice(options.skipRows);
        return out;
    }
    exports.parse = parse;
});

define('davinci-csv',["require", "exports", "./davinci-csv/config", "./davinci-csv/core/CSV"], function (require, exports, config_1, CSV_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var csv = {
        get LAST_MODIFIED() { return config_1.default.LAST_MODIFIED; },
        get VERSION() { return config_1.default.VERSION; },
        get dataToArrays() { return CSV_1.dataToArrays; },
        get parse() { return CSV_1.parse; },
        get serialize() { return CSV_1.serialize; }
    };
    exports.default = csv;
});

  var library = require('davinci-csv').default;
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define(function () { return library; });
    }(globalDefine));
  } else {
    global['CSV'] = library;
  }
}(this));
