/* */ 
(function(process) {
  var _amdLoaderGlobal = this;
  var AMDLoader;
  (function(AMDLoader) {
    AMDLoader.global = _amdLoaderGlobal;
    AMDLoader.isNode = (typeof module !== 'undefined' && !!module.exports);
    AMDLoader.isWindows = (function _isWindows() {
      if (typeof navigator !== 'undefined') {
        if (navigator.userAgent && navigator.userAgent.indexOf('Windows') >= 0) {
          return true;
        }
      }
      if (typeof process !== 'undefined') {
        return (process.platform === 'win32');
      }
      return false;
    })();
    AMDLoader.isWebWorker = (typeof AMDLoader.global.importScripts === 'function');
    AMDLoader.isElectronRenderer = (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined' && process.type === 'renderer');
    AMDLoader.isElectronMain = (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.electron !== 'undefined' && process.type === 'browser');
    AMDLoader.hasPerformanceNow = (AMDLoader.global.performance && typeof AMDLoader.global.performance.now === 'function');
  })(AMDLoader || (AMDLoader = {}));
  var AMDLoader;
  (function(AMDLoader) {
    var LoaderEventType;
    (function(LoaderEventType) {
      LoaderEventType[LoaderEventType["LoaderAvailable"] = 1] = "LoaderAvailable";
      LoaderEventType[LoaderEventType["BeginLoadingScript"] = 10] = "BeginLoadingScript";
      LoaderEventType[LoaderEventType["EndLoadingScriptOK"] = 11] = "EndLoadingScriptOK";
      LoaderEventType[LoaderEventType["EndLoadingScriptError"] = 12] = "EndLoadingScriptError";
      LoaderEventType[LoaderEventType["BeginInvokeFactory"] = 21] = "BeginInvokeFactory";
      LoaderEventType[LoaderEventType["EndInvokeFactory"] = 22] = "EndInvokeFactory";
      LoaderEventType[LoaderEventType["NodeBeginEvaluatingScript"] = 31] = "NodeBeginEvaluatingScript";
      LoaderEventType[LoaderEventType["NodeEndEvaluatingScript"] = 32] = "NodeEndEvaluatingScript";
      LoaderEventType[LoaderEventType["NodeBeginNativeRequire"] = 33] = "NodeBeginNativeRequire";
      LoaderEventType[LoaderEventType["NodeEndNativeRequire"] = 34] = "NodeEndNativeRequire";
    })(LoaderEventType = AMDLoader.LoaderEventType || (AMDLoader.LoaderEventType = {}));
    function getHighPerformanceTimestamp() {
      return (AMDLoader.hasPerformanceNow ? AMDLoader.global.performance.now() : Date.now());
    }
    AMDLoader.getHighPerformanceTimestamp = getHighPerformanceTimestamp;
    var LoaderEvent = (function() {
      function LoaderEvent(type, detail, timestamp) {
        this.type = type;
        this.detail = detail;
        this.timestamp = timestamp;
      }
      return LoaderEvent;
    }());
    AMDLoader.LoaderEvent = LoaderEvent;
    var LoaderEventRecorder = (function() {
      function LoaderEventRecorder(loaderAvailableTimestamp) {
        this._events = [new LoaderEvent(LoaderEventType.LoaderAvailable, '', loaderAvailableTimestamp)];
      }
      LoaderEventRecorder.prototype.record = function(type, detail) {
        this._events.push(new LoaderEvent(type, detail, getHighPerformanceTimestamp()));
      };
      LoaderEventRecorder.prototype.getEvents = function() {
        return this._events;
      };
      return LoaderEventRecorder;
    }());
    AMDLoader.LoaderEventRecorder = LoaderEventRecorder;
    var NullLoaderEventRecorder = (function() {
      function NullLoaderEventRecorder() {}
      NullLoaderEventRecorder.prototype.record = function(type, detail) {};
      NullLoaderEventRecorder.prototype.getEvents = function() {
        return [];
      };
      return NullLoaderEventRecorder;
    }());
    NullLoaderEventRecorder.INSTANCE = new NullLoaderEventRecorder();
    AMDLoader.NullLoaderEventRecorder = NullLoaderEventRecorder;
  })(AMDLoader || (AMDLoader = {}));
  var AMDLoader;
  (function(AMDLoader) {
    var Utilities = (function() {
      function Utilities() {}
      Utilities.fileUriToFilePath = function(uri) {
        uri = decodeURI(uri);
        if (AMDLoader.isWindows) {
          if (/^file:\/\/\//.test(uri)) {
            return uri.substr(8);
          }
          if (/^file:\/\//.test(uri)) {
            return uri.substr(5);
          }
        } else {
          if (/^file:\/\//.test(uri)) {
            return uri.substr(7);
          }
        }
        return uri;
      };
      Utilities.startsWith = function(haystack, needle) {
        return haystack.length >= needle.length && haystack.substr(0, needle.length) === needle;
      };
      Utilities.endsWith = function(haystack, needle) {
        return haystack.length >= needle.length && haystack.substr(haystack.length - needle.length) === needle;
      };
      Utilities.containsQueryString = function(url) {
        return /^[^\#]*\?/gi.test(url);
      };
      Utilities.isAbsolutePath = function(url) {
        return /^((http:\/\/)|(https:\/\/)|(file:\/\/)|(\/))/.test(url);
      };
      Utilities.forEachProperty = function(obj, callback) {
        if (obj) {
          var key = void 0;
          for (key in obj) {
            if (obj.hasOwnProperty(key)) {
              callback(key, obj[key]);
            }
          }
        }
      };
      Utilities.isEmpty = function(obj) {
        var isEmpty = true;
        Utilities.forEachProperty(obj, function() {
          isEmpty = false;
        });
        return isEmpty;
      };
      Utilities.recursiveClone = function(obj) {
        if (!obj || typeof obj !== 'object') {
          return obj;
        }
        var result = Array.isArray(obj) ? [] : {};
        Utilities.forEachProperty(obj, function(key, value) {
          if (value && typeof value === 'object') {
            result[key] = Utilities.recursiveClone(value);
          } else {
            result[key] = value;
          }
        });
        return result;
      };
      Utilities.generateAnonymousModule = function() {
        return '===anonymous' + (Utilities.NEXT_ANONYMOUS_ID++) + '===';
      };
      Utilities.isAnonymousModule = function(id) {
        return /^===anonymous/.test(id);
      };
      return Utilities;
    }());
    Utilities.NEXT_ANONYMOUS_ID = 1;
    AMDLoader.Utilities = Utilities;
  })(AMDLoader || (AMDLoader = {}));
  var AMDLoader;
  (function(AMDLoader) {
    var ConfigurationOptionsUtil = (function() {
      function ConfigurationOptionsUtil() {}
      ConfigurationOptionsUtil.validateConfigurationOptions = function(options) {
        function defaultOnError(err) {
          if (err.errorCode === 'load') {
            console.error('Loading "' + err.moduleId + '" failed');
            console.error('Detail: ', err.detail);
            if (err.detail && err.detail.stack) {
              console.error(err.detail.stack);
            }
            console.error('Here are the modules that depend on it:');
            console.error(err.neededBy);
            return;
          }
          if (err.errorCode === 'factory') {
            console.error('The factory method of "' + err.moduleId + '" has thrown an exception');
            console.error(err.detail);
            if (err.detail && err.detail.stack) {
              console.error(err.detail.stack);
            }
            return;
          }
        }
        options = options || {};
        if (typeof options.baseUrl !== 'string') {
          options.baseUrl = '';
        }
        if (typeof options.isBuild !== 'boolean') {
          options.isBuild = false;
        }
        if (typeof options.paths !== 'object') {
          options.paths = {};
        }
        if (typeof options.config !== 'object') {
          options.config = {};
        }
        if (typeof options.catchError === 'undefined') {
          options.catchError = AMDLoader.isWebWorker;
        }
        if (typeof options.urlArgs !== 'string') {
          options.urlArgs = '';
        }
        if (typeof options.onError !== 'function') {
          options.onError = defaultOnError;
        }
        if (typeof options.ignoreDuplicateModules !== 'object' || !Array.isArray(options.ignoreDuplicateModules)) {
          options.ignoreDuplicateModules = [];
        }
        if (options.baseUrl.length > 0) {
          if (!AMDLoader.Utilities.endsWith(options.baseUrl, '/')) {
            options.baseUrl += '/';
          }
        }
        if (!Array.isArray(options.nodeModules)) {
          options.nodeModules = [];
        }
        if (typeof options.nodeCachedDataWriteDelay !== 'number' || options.nodeCachedDataWriteDelay < 0) {
          options.nodeCachedDataWriteDelay = 1000 * 7;
        }
        if (typeof options.onNodeCachedDataError !== 'function') {
          options.onNodeCachedDataError = function(err) {
            if (err.errorCode === 'cachedDataRejected') {
              console.warn('Rejected cached data from file: ' + err.path);
            } else if (err.errorCode === 'unlink' || err.errorCode === 'writeFile') {
              console.error('Problems writing cached data file: ' + err.path);
              console.error(err.detail);
            }
          };
        }
        return options;
      };
      ConfigurationOptionsUtil.mergeConfigurationOptions = function(overwrite, base) {
        if (overwrite === void 0) {
          overwrite = null;
        }
        if (base === void 0) {
          base = null;
        }
        var result = AMDLoader.Utilities.recursiveClone(base || {});
        AMDLoader.Utilities.forEachProperty(overwrite, function(key, value) {
          if (key === 'ignoreDuplicateModules' && typeof result.ignoreDuplicateModules !== 'undefined') {
            result.ignoreDuplicateModules = result.ignoreDuplicateModules.concat(value);
          } else if (key === 'paths' && typeof result.paths !== 'undefined') {
            AMDLoader.Utilities.forEachProperty(value, function(key2, value2) {
              return result.paths[key2] = value2;
            });
          } else if (key === 'config' && typeof result.config !== 'undefined') {
            AMDLoader.Utilities.forEachProperty(value, function(key2, value2) {
              return result.config[key2] = value2;
            });
          } else {
            result[key] = AMDLoader.Utilities.recursiveClone(value);
          }
        });
        return ConfigurationOptionsUtil.validateConfigurationOptions(result);
      };
      return ConfigurationOptionsUtil;
    }());
    AMDLoader.ConfigurationOptionsUtil = ConfigurationOptionsUtil;
    var Configuration = (function() {
      function Configuration(options) {
        this.options = ConfigurationOptionsUtil.mergeConfigurationOptions(options);
        this._createIgnoreDuplicateModulesMap();
        this._createNodeModulesMap();
        this._createSortedPathsRules();
        if (this.options.baseUrl === '') {
          if (AMDLoader.isNode && this.options.nodeRequire && this.options.nodeRequire.main && this.options.nodeRequire.main.filename) {
            var nodeMain = this.options.nodeRequire.main.filename;
            var dirnameIndex = Math.max(nodeMain.lastIndexOf('/'), nodeMain.lastIndexOf('\\'));
            this.options.baseUrl = nodeMain.substring(0, dirnameIndex + 1);
          }
          if (AMDLoader.isNode && this.options.nodeMain) {
            var nodeMain = this.options.nodeMain;
            var dirnameIndex = Math.max(nodeMain.lastIndexOf('/'), nodeMain.lastIndexOf('\\'));
            this.options.baseUrl = nodeMain.substring(0, dirnameIndex + 1);
          }
        }
      }
      Configuration.prototype._createIgnoreDuplicateModulesMap = function() {
        this.ignoreDuplicateModulesMap = {};
        for (var i = 0; i < this.options.ignoreDuplicateModules.length; i++) {
          this.ignoreDuplicateModulesMap[this.options.ignoreDuplicateModules[i]] = true;
        }
      };
      Configuration.prototype._createNodeModulesMap = function() {
        this.nodeModulesMap = Object.create(null);
        for (var _i = 0,
            _a = this.options.nodeModules; _i < _a.length; _i++) {
          var nodeModule = _a[_i];
          this.nodeModulesMap[nodeModule] = true;
        }
      };
      Configuration.prototype._createSortedPathsRules = function() {
        var _this = this;
        this.sortedPathsRules = [];
        AMDLoader.Utilities.forEachProperty(this.options.paths, function(from, to) {
          if (!Array.isArray(to)) {
            _this.sortedPathsRules.push({
              from: from,
              to: [to]
            });
          } else {
            _this.sortedPathsRules.push({
              from: from,
              to: to
            });
          }
        });
        this.sortedPathsRules.sort(function(a, b) {
          return b.from.length - a.from.length;
        });
      };
      Configuration.prototype.cloneAndMerge = function(options) {
        return new Configuration(ConfigurationOptionsUtil.mergeConfigurationOptions(options, this.options));
      };
      Configuration.prototype.getOptionsLiteral = function() {
        return this.options;
      };
      Configuration.prototype._applyPaths = function(moduleId) {
        var pathRule;
        for (var i = 0,
            len = this.sortedPathsRules.length; i < len; i++) {
          pathRule = this.sortedPathsRules[i];
          if (AMDLoader.Utilities.startsWith(moduleId, pathRule.from)) {
            var result = [];
            for (var j = 0,
                lenJ = pathRule.to.length; j < lenJ; j++) {
              result.push(pathRule.to[j] + moduleId.substr(pathRule.from.length));
            }
            return result;
          }
        }
        return [moduleId];
      };
      Configuration.prototype._addUrlArgsToUrl = function(url) {
        if (AMDLoader.Utilities.containsQueryString(url)) {
          return url + '&' + this.options.urlArgs;
        } else {
          return url + '?' + this.options.urlArgs;
        }
      };
      Configuration.prototype._addUrlArgsIfNecessaryToUrl = function(url) {
        if (this.options.urlArgs) {
          return this._addUrlArgsToUrl(url);
        }
        return url;
      };
      Configuration.prototype._addUrlArgsIfNecessaryToUrls = function(urls) {
        if (this.options.urlArgs) {
          for (var i = 0,
              len = urls.length; i < len; i++) {
            urls[i] = this._addUrlArgsToUrl(urls[i]);
          }
        }
        return urls;
      };
      Configuration.prototype.moduleIdToPaths = function(moduleId) {
        if (this.nodeModulesMap[moduleId] === true) {
          if (this.isBuild()) {
            return ['empty:'];
          } else {
            return ['node|' + moduleId];
          }
        }
        var result = moduleId;
        var results;
        if (!AMDLoader.Utilities.endsWith(result, '.js') && !AMDLoader.Utilities.isAbsolutePath(result)) {
          results = this._applyPaths(result);
          for (var i = 0,
              len = results.length; i < len; i++) {
            if (this.isBuild() && results[i] === 'empty:') {
              continue;
            }
            if (!AMDLoader.Utilities.isAbsolutePath(results[i])) {
              results[i] = this.options.baseUrl + results[i];
            }
            if (!AMDLoader.Utilities.endsWith(results[i], '.js') && !AMDLoader.Utilities.containsQueryString(results[i])) {
              results[i] = results[i] + '.js';
            }
          }
        } else {
          if (!AMDLoader.Utilities.endsWith(result, '.js') && !AMDLoader.Utilities.containsQueryString(result)) {
            result = result + '.js';
          }
          results = [result];
        }
        return this._addUrlArgsIfNecessaryToUrls(results);
      };
      Configuration.prototype.requireToUrl = function(url) {
        var result = url;
        if (!AMDLoader.Utilities.isAbsolutePath(result)) {
          result = this._applyPaths(result)[0];
          if (!AMDLoader.Utilities.isAbsolutePath(result)) {
            result = this.options.baseUrl + result;
          }
        }
        return this._addUrlArgsIfNecessaryToUrl(result);
      };
      Configuration.prototype.isBuild = function() {
        return this.options.isBuild;
      };
      Configuration.prototype.isDuplicateMessageIgnoredFor = function(moduleId) {
        return this.ignoreDuplicateModulesMap.hasOwnProperty(moduleId);
      };
      Configuration.prototype.getConfigForModule = function(moduleId) {
        if (this.options.config) {
          return this.options.config[moduleId];
        }
      };
      Configuration.prototype.shouldCatchError = function() {
        return this.options.catchError;
      };
      Configuration.prototype.shouldRecordStats = function() {
        return this.options.recordStats;
      };
      Configuration.prototype.onError = function(err) {
        this.options.onError(err);
      };
      return Configuration;
    }());
    AMDLoader.Configuration = Configuration;
  })(AMDLoader || (AMDLoader = {}));
  var AMDLoader;
  (function(AMDLoader) {
    var OnlyOnceScriptLoader = (function() {
      function OnlyOnceScriptLoader(actualScriptLoader) {
        this.actualScriptLoader = actualScriptLoader;
        this.callbackMap = {};
      }
      OnlyOnceScriptLoader.prototype.load = function(moduleManager, scriptSrc, callback, errorback) {
        var _this = this;
        var scriptCallbacks = {
          callback: callback,
          errorback: errorback
        };
        if (this.callbackMap.hasOwnProperty(scriptSrc)) {
          this.callbackMap[scriptSrc].push(scriptCallbacks);
          return;
        }
        this.callbackMap[scriptSrc] = [scriptCallbacks];
        this.actualScriptLoader.load(moduleManager, scriptSrc, function() {
          return _this.triggerCallback(scriptSrc);
        }, function(err) {
          return _this.triggerErrorback(scriptSrc, err);
        });
      };
      OnlyOnceScriptLoader.prototype.triggerCallback = function(scriptSrc) {
        var scriptCallbacks = this.callbackMap[scriptSrc];
        delete this.callbackMap[scriptSrc];
        for (var i = 0; i < scriptCallbacks.length; i++) {
          scriptCallbacks[i].callback();
        }
      };
      OnlyOnceScriptLoader.prototype.triggerErrorback = function(scriptSrc, err) {
        var scriptCallbacks = this.callbackMap[scriptSrc];
        delete this.callbackMap[scriptSrc];
        for (var i = 0; i < scriptCallbacks.length; i++) {
          scriptCallbacks[i].errorback(err);
        }
      };
      return OnlyOnceScriptLoader;
    }());
    var BrowserScriptLoader = (function() {
      function BrowserScriptLoader() {}
      BrowserScriptLoader.prototype.attachListeners = function(script, callback, errorback) {
        var unbind = function() {
          script.removeEventListener('load', loadEventListener);
          script.removeEventListener('error', errorEventListener);
        };
        var loadEventListener = function(e) {
          unbind();
          callback();
        };
        var errorEventListener = function(e) {
          unbind();
          errorback(e);
        };
        script.addEventListener('load', loadEventListener);
        script.addEventListener('error', errorEventListener);
      };
      BrowserScriptLoader.prototype.load = function(moduleManager, scriptSrc, callback, errorback) {
        var script = document.createElement('script');
        script.setAttribute('async', 'async');
        script.setAttribute('type', 'text/javascript');
        this.attachListeners(script, callback, errorback);
        script.setAttribute('src', scriptSrc);
        document.getElementsByTagName('head')[0].appendChild(script);
      };
      return BrowserScriptLoader;
    }());
    var WorkerScriptLoader = (function() {
      function WorkerScriptLoader() {}
      WorkerScriptLoader.prototype.load = function(moduleManager, scriptSrc, callback, errorback) {
        try {
          importScripts(scriptSrc);
          callback();
        } catch (e) {
          errorback(e);
        }
      };
      return WorkerScriptLoader;
    }());
    var NodeScriptLoader = (function() {
      function NodeScriptLoader() {
        this._initialized = false;
      }
      NodeScriptLoader.prototype._init = function(nodeRequire) {
        if (this._initialized) {
          return;
        }
        this._initialized = true;
        this._fs = nodeRequire('fs');
        this._vm = nodeRequire('vm');
        this._path = nodeRequire('path');
        this._crypto = nodeRequire('crypto');
      };
      NodeScriptLoader.prototype.load = function(moduleManager, scriptSrc, callback, errorback) {
        var _this = this;
        var opts = moduleManager.getConfig().getOptionsLiteral();
        var nodeRequire = (opts.nodeRequire || AMDLoader.global.nodeRequire);
        var nodeInstrumenter = (opts.nodeInstrumenter || function(c) {
          return c;
        });
        this._init(nodeRequire);
        var recorder = moduleManager.getRecorder();
        if (/^node\|/.test(scriptSrc)) {
          var pieces = scriptSrc.split('|');
          var moduleExports_1 = null;
          try {
            moduleExports_1 = nodeRequire(pieces[1]);
          } catch (err) {
            errorback(err);
            return;
          }
          moduleManager.enqueueDefineAnonymousModule([], function() {
            return moduleExports_1;
          });
          callback();
        } else {
          scriptSrc = AMDLoader.Utilities.fileUriToFilePath(scriptSrc);
          this._fs.readFile(scriptSrc, {encoding: 'utf8'}, function(err, data) {
            if (err) {
              errorback(err);
              return;
            }
            var vmScriptSrc = _this._path.normalize(scriptSrc);
            if (AMDLoader.isElectronRenderer) {
              var driveLetterMatch = vmScriptSrc.match(/^([a-z])\:(.*)/i);
              if (driveLetterMatch) {
                vmScriptSrc = driveLetterMatch[1].toUpperCase() + ':' + driveLetterMatch[2];
              }
              vmScriptSrc = 'file:///' + vmScriptSrc.replace(/\\/g, '/');
            }
            var contents,
                prefix = '(function (require, define, __filename, __dirname) { ',
                suffix = '\n});';
            if (data.charCodeAt(0) === NodeScriptLoader._BOM) {
              contents = prefix + data.substring(1) + suffix;
            } else {
              contents = prefix + data + suffix;
            }
            contents = nodeInstrumenter(contents, vmScriptSrc);
            if (!opts.nodeCachedDataDir) {
              _this._loadAndEvalScript(scriptSrc, vmScriptSrc, contents, {filename: vmScriptSrc}, recorder);
              callback();
            } else {
              var cachedDataPath_1 = _this._getCachedDataPath(opts.nodeCachedDataDir, scriptSrc);
              _this._fs.readFile(cachedDataPath_1, function(err, data) {
                var scriptOptions = {
                  filename: vmScriptSrc,
                  produceCachedData: typeof data === 'undefined',
                  cachedData: data
                };
                var script = _this._loadAndEvalScript(scriptSrc, vmScriptSrc, contents, scriptOptions, recorder);
                callback();
                if (script.cachedDataRejected) {
                  opts.onNodeCachedDataError({
                    errorCode: 'cachedDataRejected',
                    path: cachedDataPath_1
                  });
                  NodeScriptLoader._runSoon(function() {
                    return _this._fs.unlink(cachedDataPath_1, function(err) {
                      if (err) {
                        moduleManager.getConfig().getOptionsLiteral().onNodeCachedDataError({
                          errorCode: 'unlink',
                          path: cachedDataPath_1,
                          detail: err
                        });
                      }
                    });
                  }, opts.nodeCachedDataWriteDelay);
                } else if (script.cachedDataProduced) {
                  NodeScriptLoader._runSoon(function() {
                    return _this._fs.writeFile(cachedDataPath_1, script.cachedData, function(err) {
                      if (err) {
                        moduleManager.getConfig().getOptionsLiteral().onNodeCachedDataError({
                          errorCode: 'writeFile',
                          path: cachedDataPath_1,
                          detail: err
                        });
                      }
                    });
                  }, opts.nodeCachedDataWriteDelay);
                }
              });
            }
          });
        }
      };
      NodeScriptLoader.prototype._loadAndEvalScript = function(scriptSrc, vmScriptSrc, contents, options, recorder) {
        recorder.record(AMDLoader.LoaderEventType.NodeBeginEvaluatingScript, scriptSrc);
        var script = new this._vm.Script(contents, options);
        var r = script.runInThisContext(options);
        r.call(AMDLoader.global, AMDLoader.RequireFunc, AMDLoader.DefineFunc, vmScriptSrc, this._path.dirname(scriptSrc));
        recorder.record(AMDLoader.LoaderEventType.NodeEndEvaluatingScript, scriptSrc);
        return script;
      };
      NodeScriptLoader.prototype._getCachedDataPath = function(baseDir, filename) {
        var hash = this._crypto.createHash('md5').update(filename, 'utf8').digest('hex');
        var basename = this._path.basename(filename).replace(/\.js$/, '');
        return this._path.join(baseDir, hash + "-" + basename + ".code");
      };
      NodeScriptLoader._runSoon = function(callback, minTimeout) {
        var timeout = minTimeout + Math.ceil(Math.random() * minTimeout);
        setTimeout(callback, timeout);
      };
      return NodeScriptLoader;
    }());
    NodeScriptLoader._BOM = 0xFEFF;
    AMDLoader.scriptLoader = new OnlyOnceScriptLoader(AMDLoader.isWebWorker ? new WorkerScriptLoader() : AMDLoader.isNode ? new NodeScriptLoader() : new BrowserScriptLoader());
  })(AMDLoader || (AMDLoader = {}));
  var AMDLoader;
  (function(AMDLoader) {
    var ModuleIdResolver = (function() {
      function ModuleIdResolver(fromModuleId) {
        var lastSlash = fromModuleId.lastIndexOf('/');
        if (lastSlash !== -1) {
          this.fromModulePath = fromModuleId.substr(0, lastSlash + 1);
        } else {
          this.fromModulePath = '';
        }
      }
      ModuleIdResolver._normalizeModuleId = function(moduleId) {
        var r = moduleId,
            pattern;
        pattern = /\/\.\//;
        while (pattern.test(r)) {
          r = r.replace(pattern, '/');
        }
        r = r.replace(/^\.\//g, '');
        pattern = /\/(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//;
        while (pattern.test(r)) {
          r = r.replace(pattern, '/');
        }
        r = r.replace(/^(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//, '');
        return r;
      };
      ModuleIdResolver.prototype.resolveModule = function(moduleId) {
        var result = moduleId;
        if (!AMDLoader.Utilities.isAbsolutePath(result)) {
          if (AMDLoader.Utilities.startsWith(result, './') || AMDLoader.Utilities.startsWith(result, '../')) {
            result = ModuleIdResolver._normalizeModuleId(this.fromModulePath + result);
          }
        }
        return result;
      };
      return ModuleIdResolver;
    }());
    ModuleIdResolver.ROOT = new ModuleIdResolver('');
    AMDLoader.ModuleIdResolver = ModuleIdResolver;
    var Module = (function() {
      function Module(id, strId, dependencies, callback, errorback, moduleIdResolver) {
        this.id = id;
        this.strId = strId;
        this.dependencies = dependencies;
        this._callback = callback;
        this._errorback = errorback;
        this.moduleIdResolver = moduleIdResolver;
        this.exports = {};
        this.exportsPassedIn = false;
        this.unresolvedDependenciesCount = this.dependencies.length;
        this._isComplete = false;
      }
      Module._safeInvokeFunction = function(callback, args) {
        try {
          return {
            returnedValue: callback.apply(AMDLoader.global, args),
            producedError: null
          };
        } catch (e) {
          return {
            returnedValue: null,
            producedError: e
          };
        }
      };
      Module._invokeFactory = function(config, strModuleId, callback, dependenciesValues) {
        if (config.isBuild() && !AMDLoader.Utilities.isAnonymousModule(strModuleId)) {
          return {
            returnedValue: null,
            producedError: null
          };
        }
        if (config.shouldCatchError()) {
          return this._safeInvokeFunction(callback, dependenciesValues);
        }
        return {
          returnedValue: callback.apply(AMDLoader.global, dependenciesValues),
          producedError: null
        };
      };
      Module.prototype.complete = function(recorder, config, dependenciesValues) {
        this._isComplete = true;
        var producedError = null;
        if (this._callback) {
          if (typeof this._callback === 'function') {
            recorder.record(AMDLoader.LoaderEventType.BeginInvokeFactory, this.strId);
            var r = Module._invokeFactory(config, this.strId, this._callback, dependenciesValues);
            producedError = r.producedError;
            recorder.record(AMDLoader.LoaderEventType.EndInvokeFactory, this.strId);
            if (!producedError && typeof r.returnedValue !== 'undefined' && (!this.exportsPassedIn || AMDLoader.Utilities.isEmpty(this.exports))) {
              this.exports = r.returnedValue;
            }
          } else {
            this.exports = this._callback;
          }
        }
        if (producedError) {
          config.onError({
            errorCode: 'factory',
            moduleId: this.strId,
            detail: producedError
          });
        }
        this.dependencies = null;
        this._callback = null;
        this._errorback = null;
        this.moduleIdResolver = null;
      };
      Module.prototype.onDependencyError = function(err) {
        if (this._errorback) {
          this._errorback(err);
          return true;
        }
        return false;
      };
      Module.prototype.isComplete = function() {
        return this._isComplete;
      };
      return Module;
    }());
    AMDLoader.Module = Module;
    var ModuleIdProvider = (function() {
      function ModuleIdProvider() {
        this._nextId = 0;
        this._strModuleIdToIntModuleId = new Map();
        this._intModuleIdToStrModuleId = [];
        this.getModuleId('exports');
        this.getModuleId('module');
        this.getModuleId('require');
      }
      ModuleIdProvider.prototype.getMaxModuleId = function() {
        return this._nextId;
      };
      ModuleIdProvider.prototype.getModuleId = function(strModuleId) {
        var id = this._strModuleIdToIntModuleId.get(strModuleId);
        if (typeof id === 'undefined') {
          id = this._nextId++;
          this._strModuleIdToIntModuleId.set(strModuleId, id);
          this._intModuleIdToStrModuleId[id] = strModuleId;
        }
        return id;
      };
      ModuleIdProvider.prototype.getStrModuleId = function(moduleId) {
        return this._intModuleIdToStrModuleId[moduleId];
      };
      return ModuleIdProvider;
    }());
    var RegularDependency = (function() {
      function RegularDependency(id) {
        this.id = id;
      }
      return RegularDependency;
    }());
    RegularDependency.EXPORTS = new RegularDependency(0);
    RegularDependency.MODULE = new RegularDependency(1);
    RegularDependency.REQUIRE = new RegularDependency(2);
    AMDLoader.RegularDependency = RegularDependency;
    var PluginDependency = (function() {
      function PluginDependency(id, pluginId, pluginParam) {
        this.id = id;
        this.pluginId = pluginId;
        this.pluginParam = pluginParam;
      }
      return PluginDependency;
    }());
    AMDLoader.PluginDependency = PluginDependency;
    var ModuleManager = (function() {
      function ModuleManager(scriptLoader, loaderAvailableTimestamp) {
        if (loaderAvailableTimestamp === void 0) {
          loaderAvailableTimestamp = 0;
        }
        this._recorder = null;
        this._loaderAvailableTimestamp = loaderAvailableTimestamp;
        this._moduleIdProvider = new ModuleIdProvider();
        this._config = new AMDLoader.Configuration();
        this._scriptLoader = scriptLoader;
        this._modules2 = [];
        this._knownModules2 = [];
        this._inverseDependencies2 = [];
        this._inversePluginDependencies2 = new Map();
        this._currentAnnonymousDefineCall = null;
        this._buildInfoPath = [];
        this._buildInfoDefineStack = [];
        this._buildInfoDependencies = [];
      }
      ModuleManager._findRelevantLocationInStack = function(needle, stack) {
        var normalize = function(str) {
          return str.replace(/\\/g, '/');
        };
        var normalizedPath = normalize(needle);
        var stackPieces = stack.split(/\n/);
        for (var i = 0; i < stackPieces.length; i++) {
          var m = stackPieces[i].match(/(.*):(\d+):(\d+)\)?$/);
          if (m) {
            var stackPath = m[1];
            var stackLine = m[2];
            var stackColumn = m[3];
            var trimPathOffset = Math.max(stackPath.lastIndexOf(' ') + 1, stackPath.lastIndexOf('(') + 1);
            stackPath = stackPath.substr(trimPathOffset);
            stackPath = normalize(stackPath);
            if (stackPath === normalizedPath) {
              var r = {
                line: parseInt(stackLine, 10),
                col: parseInt(stackColumn, 10)
              };
              if (r.line === 1) {
                r.col -= '(function (require, define, __filename, __dirname) { '.length;
              }
              return r;
            }
          }
        }
        throw new Error('Could not correlate define call site for needle ' + needle);
      };
      ModuleManager.prototype.getBuildInfo = function() {
        if (!this._config.isBuild()) {
          return null;
        }
        var result = [],
            resultLen = 0;
        for (var i = 0,
            len = this._modules2.length; i < len; i++) {
          var m = this._modules2[i];
          if (!m) {
            continue;
          }
          var location_1 = this._buildInfoPath[m.id] || null;
          var defineStack = this._buildInfoDefineStack[m.id] || null;
          var dependencies = this._buildInfoDependencies[m.id];
          result[resultLen++] = {
            id: m.strId,
            path: location_1,
            defineLocation: (location_1 && defineStack ? ModuleManager._findRelevantLocationInStack(location_1, defineStack) : null),
            dependencies: dependencies,
            shim: null,
            exports: m.exports
          };
        }
        return result;
      };
      ModuleManager.prototype.getRecorder = function() {
        if (!this._recorder) {
          if (this._config.shouldRecordStats()) {
            this._recorder = new AMDLoader.LoaderEventRecorder(this._loaderAvailableTimestamp);
          } else {
            this._recorder = AMDLoader.NullLoaderEventRecorder.INSTANCE;
          }
        }
        return this._recorder;
      };
      ModuleManager.prototype.getLoaderEvents = function() {
        return this.getRecorder().getEvents();
      };
      ModuleManager.prototype.enqueueDefineAnonymousModule = function(dependencies, callback) {
        if (this._currentAnnonymousDefineCall !== null) {
          throw new Error('Can only have one anonymous define call per script file');
        }
        var stack = null;
        if (this._config.isBuild()) {
          stack = new Error('StackLocation').stack;
        }
        this._currentAnnonymousDefineCall = {
          stack: stack,
          dependencies: dependencies,
          callback: callback
        };
      };
      ModuleManager.prototype.defineModule = function(strModuleId, dependencies, callback, errorback, stack, moduleIdResolver) {
        var _this = this;
        if (moduleIdResolver === void 0) {
          moduleIdResolver = new ModuleIdResolver(strModuleId);
        }
        var moduleId = this._moduleIdProvider.getModuleId(strModuleId);
        if (this._modules2[moduleId]) {
          if (!this._config.isDuplicateMessageIgnoredFor(strModuleId)) {
            console.warn('Duplicate definition of module \'' + strModuleId + '\'');
          }
          return;
        }
        var m = new Module(moduleId, strModuleId, this._normalizeDependencies(dependencies, moduleIdResolver), callback, errorback, moduleIdResolver);
        this._modules2[moduleId] = m;
        if (this._config.isBuild()) {
          this._buildInfoDefineStack[moduleId] = stack;
          this._buildInfoDependencies[moduleId] = m.dependencies.map(function(dep) {
            return _this._moduleIdProvider.getStrModuleId(dep.id);
          });
        }
        this._resolve(m);
      };
      ModuleManager.prototype._normalizeDependency = function(dependency, moduleIdResolver) {
        if (dependency === 'exports') {
          return RegularDependency.EXPORTS;
        }
        if (dependency === 'module') {
          return RegularDependency.MODULE;
        }
        if (dependency === 'require') {
          return RegularDependency.REQUIRE;
        }
        var bangIndex = dependency.indexOf('!');
        if (bangIndex >= 0) {
          var strPluginId = moduleIdResolver.resolveModule(dependency.substr(0, bangIndex));
          var pluginParam = moduleIdResolver.resolveModule(dependency.substr(bangIndex + 1));
          var dependencyId = this._moduleIdProvider.getModuleId(strPluginId + '!' + pluginParam);
          var pluginId = this._moduleIdProvider.getModuleId(strPluginId);
          return new PluginDependency(dependencyId, pluginId, pluginParam);
        }
        return new RegularDependency(this._moduleIdProvider.getModuleId(moduleIdResolver.resolveModule(dependency)));
      };
      ModuleManager.prototype._normalizeDependencies = function(dependencies, moduleIdResolver) {
        var result = [],
            resultLen = 0;
        for (var i = 0,
            len = dependencies.length; i < len; i++) {
          result[resultLen++] = this._normalizeDependency(dependencies[i], moduleIdResolver);
        }
        return result;
      };
      ModuleManager.prototype._relativeRequire = function(moduleIdResolver, dependencies, callback, errorback) {
        if (typeof dependencies === 'string') {
          return this.synchronousRequire(dependencies, moduleIdResolver);
        }
        this.defineModule(AMDLoader.Utilities.generateAnonymousModule(), dependencies, callback, errorback, null, moduleIdResolver);
      };
      ModuleManager.prototype.synchronousRequire = function(_strModuleId, moduleIdResolver) {
        if (moduleIdResolver === void 0) {
          moduleIdResolver = new ModuleIdResolver(_strModuleId);
        }
        var dependency = this._normalizeDependency(_strModuleId, moduleIdResolver);
        var m = this._modules2[dependency.id];
        if (!m) {
          throw new Error('Check dependency list! Synchronous require cannot resolve module \'' + _strModuleId + '\'. This is the first mention of this module!');
        }
        if (!m.isComplete()) {
          throw new Error('Check dependency list! Synchronous require cannot resolve module \'' + _strModuleId + '\'. This module has not been resolved completely yet.');
        }
        return m.exports;
      };
      ModuleManager.prototype.configure = function(params, shouldOverwrite) {
        var oldShouldRecordStats = this._config.shouldRecordStats();
        if (shouldOverwrite) {
          this._config = new AMDLoader.Configuration(params);
        } else {
          this._config = this._config.cloneAndMerge(params);
        }
        if (this._config.shouldRecordStats() && !oldShouldRecordStats) {
          this._recorder = null;
        }
      };
      ModuleManager.prototype.getConfig = function() {
        return this._config;
      };
      ModuleManager.prototype._onLoad = function(moduleId) {
        if (this._currentAnnonymousDefineCall !== null) {
          var defineCall = this._currentAnnonymousDefineCall;
          this._currentAnnonymousDefineCall = null;
          this.defineModule(this._moduleIdProvider.getStrModuleId(moduleId), defineCall.dependencies, defineCall.callback, null, defineCall.stack);
        }
      };
      ModuleManager.prototype._createLoadError = function(moduleId, err) {
        var _this = this;
        var strModuleId = this._moduleIdProvider.getStrModuleId(moduleId);
        var neededBy = (this._inverseDependencies2[moduleId] || []).map(function(intModuleId) {
          return _this._moduleIdProvider.getStrModuleId(intModuleId);
        });
        return {
          errorCode: 'load',
          moduleId: strModuleId,
          neededBy: neededBy,
          detail: err
        };
      };
      ModuleManager.prototype._onLoadError = function(moduleId, err) {
        var error = this._createLoadError(moduleId, err);
        var seenModuleId = [];
        for (var i = 0,
            len = this._moduleIdProvider.getMaxModuleId(); i < len; i++) {
          seenModuleId[i] = false;
        }
        var someoneNotified = false;
        var queue = [];
        queue.push(moduleId);
        seenModuleId[moduleId] = true;
        while (queue.length > 0) {
          var queueElement = queue.shift();
          var m = this._modules2[queueElement];
          if (m) {
            someoneNotified = m.onDependencyError(error) || someoneNotified;
          }
          var inverseDeps = this._inverseDependencies2[queueElement];
          if (inverseDeps) {
            for (var i = 0,
                len = inverseDeps.length; i < len; i++) {
              var inverseDep = inverseDeps[i];
              if (!seenModuleId[inverseDep]) {
                queue.push(inverseDep);
                seenModuleId[inverseDep] = true;
              }
            }
          }
        }
        if (!someoneNotified) {
          this._config.onError(error);
        }
      };
      ModuleManager.prototype._hasDependencyPath = function(fromId, toId) {
        var from = this._modules2[fromId];
        if (!from) {
          return false;
        }
        var inQueue = [];
        for (var i = 0,
            len = this._moduleIdProvider.getMaxModuleId(); i < len; i++) {
          inQueue[i] = false;
        }
        var queue = [];
        queue.push(from);
        inQueue[fromId] = true;
        while (queue.length > 0) {
          var element = queue.shift();
          var dependencies = element.dependencies;
          if (dependencies) {
            for (var i = 0,
                len = dependencies.length; i < len; i++) {
              var dependency = dependencies[i];
              if (dependency.id === toId) {
                return true;
              }
              var dependencyModule = this._modules2[dependency.id];
              if (dependencyModule && !inQueue[dependency.id]) {
                inQueue[dependency.id] = true;
                queue.push(dependencyModule);
              }
            }
          }
        }
        return false;
      };
      ModuleManager.prototype._findCyclePath = function(fromId, toId, depth) {
        if (fromId === toId || depth === 50) {
          return [fromId];
        }
        var from = this._modules2[fromId];
        if (!from) {
          return null;
        }
        var dependencies = from.dependencies;
        for (var i = 0,
            len = dependencies.length; i < len; i++) {
          var path = this._findCyclePath(dependencies[i].id, toId, depth + 1);
          if (path !== null) {
            path.push(fromId);
            return path;
          }
        }
        return null;
      };
      ModuleManager.prototype._createRequire = function(moduleIdResolver) {
        var _this = this;
        var result = (function(dependencies, callback, errorback) {
          return _this._relativeRequire(moduleIdResolver, dependencies, callback, errorback);
        });
        result.toUrl = function(id) {
          return _this._config.requireToUrl(moduleIdResolver.resolveModule(id));
        };
        result.getStats = function() {
          return _this.getLoaderEvents();
        };
        result.__$__nodeRequire = AMDLoader.global.nodeRequire;
        return result;
      };
      ModuleManager.prototype._loadModule = function(moduleId) {
        var _this = this;
        if (this._modules2[moduleId] || this._knownModules2[moduleId]) {
          return;
        }
        this._knownModules2[moduleId] = true;
        var strModuleId = this._moduleIdProvider.getStrModuleId(moduleId);
        var paths = this._config.moduleIdToPaths(strModuleId);
        if (AMDLoader.isNode && strModuleId.indexOf('/') === -1) {
          paths.push('node|' + strModuleId);
        }
        var lastPathIndex = -1;
        var loadNextPath = function(err) {
          lastPathIndex++;
          if (lastPathIndex >= paths.length) {
            _this._onLoadError(moduleId, err);
          } else {
            var currentPath_1 = paths[lastPathIndex];
            var recorder_1 = _this.getRecorder();
            if (_this._config.isBuild() && currentPath_1 === 'empty:') {
              _this._buildInfoPath[moduleId] = currentPath_1;
              _this.defineModule(_this._moduleIdProvider.getStrModuleId(moduleId), [], null, null, null);
              _this._onLoad(moduleId);
              return;
            }
            recorder_1.record(AMDLoader.LoaderEventType.BeginLoadingScript, currentPath_1);
            _this._scriptLoader.load(_this, currentPath_1, function() {
              if (_this._config.isBuild()) {
                _this._buildInfoPath[moduleId] = currentPath_1;
              }
              recorder_1.record(AMDLoader.LoaderEventType.EndLoadingScriptOK, currentPath_1);
              _this._onLoad(moduleId);
            }, function(err) {
              recorder_1.record(AMDLoader.LoaderEventType.EndLoadingScriptError, currentPath_1);
              loadNextPath(err);
            });
          }
        };
        loadNextPath(null);
      };
      ModuleManager.prototype._loadPluginDependency = function(plugin, pluginDependency) {
        var _this = this;
        if (this._modules2[pluginDependency.id] || this._knownModules2[pluginDependency.id]) {
          return;
        }
        this._knownModules2[pluginDependency.id] = true;
        var load = (function(value) {
          _this.defineModule(_this._moduleIdProvider.getStrModuleId(pluginDependency.id), [], value, null, null);
        });
        load.error = function(err) {
          _this._config.onError(_this._createLoadError(pluginDependency.id, err));
        };
        plugin.load(pluginDependency.pluginParam, this._createRequire(ModuleIdResolver.ROOT), load, this._config.getOptionsLiteral());
      };
      ModuleManager.prototype._resolve = function(module) {
        var _this = this;
        var dependencies = module.dependencies;
        for (var i = 0,
            len = dependencies.length; i < len; i++) {
          var dependency = dependencies[i];
          if (dependency === RegularDependency.EXPORTS) {
            module.exportsPassedIn = true;
            module.unresolvedDependenciesCount--;
            continue;
          }
          if (dependency === RegularDependency.MODULE) {
            module.unresolvedDependenciesCount--;
            continue;
          }
          if (dependency === RegularDependency.REQUIRE) {
            module.unresolvedDependenciesCount--;
            continue;
          }
          var dependencyModule = this._modules2[dependency.id];
          if (dependencyModule && dependencyModule.isComplete()) {
            module.unresolvedDependenciesCount--;
            continue;
          }
          if (this._hasDependencyPath(dependency.id, module.id)) {
            console.warn('There is a dependency cycle between \'' + this._moduleIdProvider.getStrModuleId(dependency.id) + '\' and \'' + this._moduleIdProvider.getStrModuleId(module.id) + '\'. The cyclic path follows:');
            var cyclePath = this._findCyclePath(dependency.id, module.id, 0);
            cyclePath.reverse();
            cyclePath.push(dependency.id);
            console.warn(cyclePath.map(function(id) {
              return _this._moduleIdProvider.getStrModuleId(id);
            }).join(' => \n'));
            module.unresolvedDependenciesCount--;
            continue;
          }
          this._inverseDependencies2[dependency.id] = this._inverseDependencies2[dependency.id] || [];
          this._inverseDependencies2[dependency.id].push(module.id);
          if (dependency instanceof PluginDependency) {
            var plugin = this._modules2[dependency.pluginId];
            if (plugin && plugin.isComplete()) {
              this._loadPluginDependency(plugin.exports, dependency);
              continue;
            }
            var inversePluginDeps = this._inversePluginDependencies2.get(dependency.pluginId);
            if (!inversePluginDeps) {
              inversePluginDeps = [];
              this._inversePluginDependencies2.set(dependency.pluginId, inversePluginDeps);
            }
            inversePluginDeps.push(dependency);
            this._loadModule(dependency.pluginId);
            continue;
          }
          this._loadModule(dependency.id);
        }
        if (module.unresolvedDependenciesCount === 0) {
          this._onModuleComplete(module);
        }
      };
      ModuleManager.prototype._onModuleComplete = function(module) {
        var _this = this;
        var recorder = this.getRecorder();
        if (module.isComplete()) {
          return;
        }
        var dependencies = module.dependencies;
        var dependenciesValues = [];
        for (var i = 0,
            len = dependencies.length; i < len; i++) {
          var dependency = dependencies[i];
          if (dependency === RegularDependency.EXPORTS) {
            dependenciesValues[i] = module.exports;
            continue;
          }
          if (dependency === RegularDependency.MODULE) {
            dependenciesValues[i] = {
              id: module.strId,
              config: function() {
                return _this._config.getConfigForModule(module.strId);
              }
            };
            continue;
          }
          if (dependency === RegularDependency.REQUIRE) {
            dependenciesValues[i] = this._createRequire(module.moduleIdResolver);
            continue;
          }
          var dependencyModule = this._modules2[dependency.id];
          if (dependencyModule) {
            dependenciesValues[i] = dependencyModule.exports;
            continue;
          }
          dependenciesValues[i] = null;
        }
        module.complete(recorder, this._config, dependenciesValues);
        var inverseDeps = this._inverseDependencies2[module.id];
        this._inverseDependencies2[module.id] = null;
        if (inverseDeps) {
          for (var i = 0,
              len = inverseDeps.length; i < len; i++) {
            var inverseDependencyId = inverseDeps[i];
            var inverseDependency = this._modules2[inverseDependencyId];
            inverseDependency.unresolvedDependenciesCount--;
            if (inverseDependency.unresolvedDependenciesCount === 0) {
              this._onModuleComplete(inverseDependency);
            }
          }
        }
        var inversePluginDeps = this._inversePluginDependencies2.get(module.id);
        if (inversePluginDeps) {
          this._inversePluginDependencies2.delete(module.id);
          for (var i = 0,
              len = inversePluginDeps.length; i < len; i++) {
            this._loadPluginDependency(module.exports, inversePluginDeps[i]);
          }
        }
      };
      return ModuleManager;
    }());
    AMDLoader.ModuleManager = ModuleManager;
  })(AMDLoader || (AMDLoader = {}));
  'use strict';
  var define;
  var AMDLoader;
  (function(AMDLoader) {
    var moduleManager;
    var loaderAvailableTimestamp;
    var DefineFunc = (function() {
      function DefineFunc(id, dependencies, callback) {
        if (typeof id !== 'string') {
          callback = dependencies;
          dependencies = id;
          id = null;
        }
        if (typeof dependencies !== 'object' || !Array.isArray(dependencies)) {
          callback = dependencies;
          dependencies = null;
        }
        if (!dependencies) {
          dependencies = ['require', 'exports', 'module'];
        }
        if (id) {
          moduleManager.defineModule(id, dependencies, callback, null, null);
        } else {
          moduleManager.enqueueDefineAnonymousModule(dependencies, callback);
        }
      }
      return DefineFunc;
    }());
    DefineFunc.amd = {jQuery: true};
    AMDLoader.DefineFunc = DefineFunc;
    var RequireFunc = (function() {
      function RequireFunc() {
        if (arguments.length === 1) {
          if ((arguments[0] instanceof Object) && !Array.isArray(arguments[0])) {
            RequireFunc.config(arguments[0]);
            return;
          }
          if (typeof arguments[0] === 'string') {
            return moduleManager.synchronousRequire(arguments[0]);
          }
        }
        if (arguments.length === 2 || arguments.length === 3) {
          if (Array.isArray(arguments[0])) {
            moduleManager.defineModule(AMDLoader.Utilities.generateAnonymousModule(), arguments[0], arguments[1], arguments[2], null);
            return;
          }
        }
        throw new Error('Unrecognized require call');
      }
      RequireFunc.config = function(params, shouldOverwrite) {
        if (shouldOverwrite === void 0) {
          shouldOverwrite = false;
        }
        moduleManager.configure(params, shouldOverwrite);
      };
      RequireFunc.getConfig = function() {
        return moduleManager.getConfig().getOptionsLiteral();
      };
      RequireFunc.reset = function() {
        moduleManager = new AMDLoader.ModuleManager(AMDLoader.scriptLoader, loaderAvailableTimestamp);
      };
      RequireFunc.getBuildInfo = function() {
        return moduleManager.getBuildInfo();
      };
      RequireFunc.getStats = function() {
        return moduleManager.getLoaderEvents();
      };
      return RequireFunc;
    }());
    AMDLoader.RequireFunc = RequireFunc;
    function init() {
      moduleManager = new AMDLoader.ModuleManager(AMDLoader.scriptLoader, loaderAvailableTimestamp);
      if (AMDLoader.isNode) {
        var _nodeRequire = (AMDLoader.global.require || require);
        var nodeRequire = function(what) {
          moduleManager.getRecorder().record(AMDLoader.LoaderEventType.NodeBeginNativeRequire, what);
          try {
            return _nodeRequire(what);
          } finally {
            moduleManager.getRecorder().record(AMDLoader.LoaderEventType.NodeEndNativeRequire, what);
          }
        };
        AMDLoader.global.nodeRequire = nodeRequire;
        RequireFunc.nodeRequire = nodeRequire;
      }
      if (AMDLoader.isNode && !AMDLoader.isElectronRenderer) {
        module.exports = RequireFunc;
        define = function() {
          DefineFunc.apply(null, arguments);
        };
        require = RequireFunc;
      } else {
        if (typeof AMDLoader.global.require !== 'undefined' && typeof AMDLoader.global.require !== 'function') {
          RequireFunc.config(AMDLoader.global.require);
        }
        if (!AMDLoader.isElectronRenderer) {
          AMDLoader.global.define = define = DefineFunc;
        } else {
          define = function() {
            DefineFunc.apply(null, arguments);
          };
        }
        AMDLoader.global.require = RequireFunc;
        AMDLoader.global.require.__$__nodeRequire = nodeRequire;
      }
    }
    if (typeof AMDLoader.global.define !== 'function' || !AMDLoader.global.define.amd) {
      init();
      loaderAvailableTimestamp = AMDLoader.getHighPerformanceTimestamp();
    }
  })(AMDLoader || (AMDLoader = {}));
})(require('process'));
