/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : (factory());
  }(this, (function() {
    'use strict';
    var Zone$1 = (function(global) {
      var FUNCTION = 'function';
      var performance = global['performance'];
      function mark(name) {
        performance && performance['mark'] && performance['mark'](name);
      }
      function performanceMeasure(name, label) {
        performance && performance['measure'] && performance['measure'](name, label);
      }
      mark('Zone');
      if (global['Zone']) {
        throw new Error('Zone already loaded.');
      }
      var Zone = (function() {
        function Zone(parent, zoneSpec) {
          this._properties = null;
          this._parent = parent;
          this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
          this._properties = zoneSpec && zoneSpec.properties || {};
          this._zoneDelegate = new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone.assertZonePatched = function() {
          if (global['Promise'] !== patches['ZoneAwarePromise']) {
            throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' + 'has been overwritten.\n' + 'Most likely cause is that a Promise polyfill has been loaded ' + 'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' + 'If you must load one, do so before loading zone.js.)');
          }
        };
        Object.defineProperty(Zone, "root", {
          get: function() {
            var zone = Zone.current;
            while (zone.parent) {
              zone = zone.parent;
            }
            return zone;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Zone, "current", {
          get: function() {
            return _currentZoneFrame.zone;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Zone, "currentTask", {
          get: function() {
            return _currentTask;
          },
          enumerable: true,
          configurable: true
        });
        Zone.__load_patch = function(name, fn) {
          if (patches.hasOwnProperty(name)) {
            throw Error('Already loaded patch: ' + name);
          } else if (!global['__Zone_disable_' + name]) {
            var perfName = 'Zone:' + name;
            mark(perfName);
            patches[name] = fn(global, Zone, _api);
            performanceMeasure(perfName, perfName);
          }
        };
        Object.defineProperty(Zone.prototype, "parent", {
          get: function() {
            return this._parent;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
          get: function() {
            return this._name;
          },
          enumerable: true,
          configurable: true
        });
        Zone.prototype.get = function(key) {
          var zone = this.getZoneWith(key);
          if (zone)
            return zone._properties[key];
        };
        Zone.prototype.getZoneWith = function(key) {
          var current = this;
          while (current) {
            if (current._properties.hasOwnProperty(key)) {
              return current;
            }
            current = current._parent;
          }
          return null;
        };
        Zone.prototype.fork = function(zoneSpec) {
          if (!zoneSpec)
            throw new Error('ZoneSpec required!');
          return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone.prototype.wrap = function(callback, source) {
          if (typeof callback !== FUNCTION) {
            throw new Error('Expecting function got: ' + callback);
          }
          var _callback = this._zoneDelegate.intercept(this, callback, source);
          var zone = this;
          return function() {
            return zone.runGuarded(_callback, this, arguments, source);
          };
        };
        Zone.prototype.run = function(callback, applyThis, applyArgs, source) {
          if (applyThis === void 0) {
            applyThis = undefined;
          }
          if (applyArgs === void 0) {
            applyArgs = null;
          }
          if (source === void 0) {
            source = null;
          }
          _currentZoneFrame = {
            parent: _currentZoneFrame,
            zone: this
          };
          try {
            return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
          } finally {
            _currentZoneFrame = _currentZoneFrame.parent;
          }
        };
        Zone.prototype.runGuarded = function(callback, applyThis, applyArgs, source) {
          if (applyThis === void 0) {
            applyThis = null;
          }
          if (applyArgs === void 0) {
            applyArgs = null;
          }
          if (source === void 0) {
            source = null;
          }
          _currentZoneFrame = {
            parent: _currentZoneFrame,
            zone: this
          };
          try {
            try {
              return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            } catch (error) {
              if (this._zoneDelegate.handleError(this, error)) {
                throw error;
              }
            }
          } finally {
            _currentZoneFrame = _currentZoneFrame.parent;
          }
        };
        Zone.prototype.runTask = function(task, applyThis, applyArgs) {
          if (task.zone != this) {
            throw new Error('A task can only be run in the zone of creation! (Creation: ' + (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
          }
          var isNotScheduled = task.state === notScheduled;
          if (isNotScheduled && task.type === eventTask) {
            return;
          }
          var reEntryGuard = task.state != running;
          reEntryGuard && task._transitionTo(running, scheduled);
          task.runCount++;
          var previousTask = _currentTask;
          _currentTask = task;
          _currentZoneFrame = {
            parent: _currentZoneFrame,
            zone: this
          };
          try {
            if (task.type == macroTask && task.data && !task.data.isPeriodic) {
              task.cancelFn = null;
            }
            try {
              return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
            } catch (error) {
              if (this._zoneDelegate.handleError(this, error)) {
                throw error;
              }
            }
          } finally {
            if (task.state !== notScheduled && task.state !== unknown) {
              if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                reEntryGuard && task._transitionTo(scheduled, running);
              } else {
                task.runCount = 0;
                this._updateTaskCount(task, -1);
                reEntryGuard && task._transitionTo(notScheduled, running, notScheduled);
              }
            }
            _currentZoneFrame = _currentZoneFrame.parent;
            _currentTask = previousTask;
          }
        };
        Zone.prototype.scheduleTask = function(task) {
          if (task.zone && task.zone !== this) {
            var newZone = this;
            while (newZone) {
              if (newZone === task.zone) {
                throw Error("can not reschedule task to " + this.name + " which is descendants of the original zone " + task.zone.name);
              }
              newZone = newZone.parent;
            }
          }
          task._transitionTo(scheduling, notScheduled);
          var zoneDelegates = [];
          task._zoneDelegates = zoneDelegates;
          task._zone = this;
          try {
            task = this._zoneDelegate.scheduleTask(this, task);
          } catch (err) {
            task._transitionTo(unknown, scheduling, notScheduled);
            this._zoneDelegate.handleError(this, err);
            throw err;
          }
          if (task._zoneDelegates === zoneDelegates) {
            this._updateTaskCount(task, 1);
          }
          if (task.state == scheduling) {
            task._transitionTo(scheduled, scheduling);
          }
          return task;
        };
        Zone.prototype.scheduleMicroTask = function(source, callback, data, customSchedule) {
          return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, null));
        };
        Zone.prototype.scheduleMacroTask = function(source, callback, data, customSchedule, customCancel) {
          return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.scheduleEventTask = function(source, callback, data, customSchedule, customCancel) {
          return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.cancelTask = function(task) {
          if (task.zone != this)
            throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' + (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
          task._transitionTo(canceling, scheduled, running);
          try {
            this._zoneDelegate.cancelTask(this, task);
          } catch (err) {
            task._transitionTo(unknown, canceling);
            this._zoneDelegate.handleError(this, err);
            throw err;
          }
          this._updateTaskCount(task, -1);
          task._transitionTo(notScheduled, canceling);
          task.runCount = 0;
          return task;
        };
        Zone.prototype._updateTaskCount = function(task, count) {
          var zoneDelegates = task._zoneDelegates;
          if (count == -1) {
            task._zoneDelegates = null;
          }
          for (var i = 0; i < zoneDelegates.length; i++) {
            zoneDelegates[i]._updateTaskCount(task.type, count);
          }
        };
        return Zone;
      }());
      Zone.__symbol__ = __symbol__;
      var DELEGATE_ZS = {
        name: '',
        onHasTask: function(delegate, _, target, hasTaskState) {
          return delegate.hasTask(target, hasTaskState);
        },
        onScheduleTask: function(delegate, _, target, task) {
          return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function(delegate, _, target, task, applyThis, applyArgs) {
          return delegate.invokeTask(target, task, applyThis, applyArgs);
        },
        onCancelTask: function(delegate, _, target, task) {
          return delegate.cancelTask(target, task);
        }
      };
      var ZoneDelegate = (function() {
        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
          this._taskCounts = {
            'microTask': 0,
            'macroTask': 0,
            'eventTask': 0
          };
          this.zone = zone;
          this._parentDelegate = parentDelegate;
          this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
          this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
          this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
          this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
          this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
          this._interceptCurrZone = zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
          this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
          this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
          this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
          this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
          this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
          this._handleErrorCurrZone = zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
          this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
          this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
          this._scheduleTaskCurrZone = zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
          this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
          this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
          this._invokeTaskCurrZone = zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
          this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
          this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
          this._cancelTaskCurrZone = zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
          this._hasTaskZS = null;
          this._hasTaskDlgt = null;
          this._hasTaskDlgtOwner = null;
          this._hasTaskCurrZone = null;
          var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
          var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
          if (zoneSpecHasTask || parentHasTask) {
            this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
            this._hasTaskDlgt = parentDelegate;
            this._hasTaskDlgtOwner = this;
            this._hasTaskCurrZone = zone;
            if (!zoneSpec.onScheduleTask) {
              this._scheduleTaskZS = DELEGATE_ZS;
              this._scheduleTaskDlgt = parentDelegate;
              this._scheduleTaskCurrZone = this.zone;
            }
            if (!zoneSpec.onInvokeTask) {
              this._invokeTaskZS = DELEGATE_ZS;
              this._invokeTaskDlgt = parentDelegate;
              this._invokeTaskCurrZone = this.zone;
            }
            if (!zoneSpec.onCancelTask) {
              this._cancelTaskZS = DELEGATE_ZS;
              this._cancelTaskDlgt = parentDelegate;
              this._cancelTaskCurrZone = this.zone;
            }
          }
        }
        ZoneDelegate.prototype.fork = function(targetZone, zoneSpec) {
          return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new Zone(targetZone, zoneSpec);
        };
        ZoneDelegate.prototype.intercept = function(targetZone, callback, source) {
          return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) : callback;
        };
        ZoneDelegate.prototype.invoke = function(targetZone, callback, applyThis, applyArgs, source) {
          return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) : callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.handleError = function(targetZone, error) {
          return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) : true;
        };
        ZoneDelegate.prototype.scheduleTask = function(targetZone, task) {
          var returnTask = task;
          if (this._scheduleTaskZS) {
            if (this._hasTaskZS) {
              returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
            }
            returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
            if (!returnTask)
              returnTask = task;
          } else {
            if (task.scheduleFn) {
              task.scheduleFn(task);
            } else if (task.type == microTask) {
              scheduleMicroTask(task);
            } else {
              throw new Error('Task is missing scheduleFn.');
            }
          }
          return returnTask;
        };
        ZoneDelegate.prototype.invokeTask = function(targetZone, task, applyThis, applyArgs) {
          return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.cancelTask = function(targetZone, task) {
          var value;
          if (this._cancelTaskZS) {
            value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
          } else {
            if (!task.cancelFn) {
              throw Error('Task is not cancelable');
            }
            value = task.cancelFn(task);
          }
          return value;
        };
        ZoneDelegate.prototype.hasTask = function(targetZone, isEmpty) {
          try {
            return this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
          } catch (err) {
            this.handleError(targetZone, err);
          }
        };
        ZoneDelegate.prototype._updateTaskCount = function(type, count) {
          var counts = this._taskCounts;
          var prev = counts[type];
          var next = counts[type] = prev + count;
          if (next < 0) {
            throw new Error('More tasks executed then were scheduled.');
          }
          if (prev == 0 || next == 0) {
            var isEmpty = {
              microTask: counts['microTask'] > 0,
              macroTask: counts['macroTask'] > 0,
              eventTask: counts['eventTask'] > 0,
              change: type
            };
            this.hasTask(this.zone, isEmpty);
          }
        };
        return ZoneDelegate;
      }());
      var ZoneTask = (function() {
        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
          this._zone = null;
          this.runCount = 0;
          this._zoneDelegates = null;
          this._state = 'notScheduled';
          this.type = type;
          this.source = source;
          this.data = options;
          this.scheduleFn = scheduleFn;
          this.cancelFn = cancelFn;
          this.callback = callback;
          var self = this;
          if (type === eventTask && options && options.useG) {
            this.invoke = ZoneTask.invokeTask;
          } else {
            this.invoke = function() {
              return ZoneTask.invokeTask.call(global, self, this, arguments);
            };
          }
        }
        ZoneTask.invokeTask = function(task, target, args) {
          if (!task) {
            task = this;
          }
          _numberOfNestedTaskFrames++;
          try {
            task.runCount++;
            return task.zone.runTask(task, target, args);
          } finally {
            if (_numberOfNestedTaskFrames == 1) {
              drainMicroTaskQueue();
            }
            _numberOfNestedTaskFrames--;
          }
        };
        Object.defineProperty(ZoneTask.prototype, "zone", {
          get: function() {
            return this._zone;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ZoneTask.prototype, "state", {
          get: function() {
            return this._state;
          },
          enumerable: true,
          configurable: true
        });
        ZoneTask.prototype.cancelScheduleRequest = function() {
          this._transitionTo(notScheduled, scheduling);
        };
        ZoneTask.prototype._transitionTo = function(toState, fromState1, fromState2) {
          if (this._state === fromState1 || this._state === fromState2) {
            this._state = toState;
            if (toState == notScheduled) {
              this._zoneDelegates = null;
            }
          } else {
            throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ? ' or \'' + fromState2 + '\'' : '') + ", was '" + this._state + "'.");
          }
        };
        ZoneTask.prototype.toString = function() {
          if (this.data && typeof this.data.handleId !== 'undefined') {
            return this.data.handleId;
          } else {
            return Object.prototype.toString.call(this);
          }
        };
        ZoneTask.prototype.toJSON = function() {
          return {
            type: this.type,
            state: this.state,
            source: this.source,
            zone: this.zone.name,
            runCount: this.runCount
          };
        };
        return ZoneTask;
      }());
      var symbolSetTimeout = __symbol__('setTimeout');
      var symbolPromise = __symbol__('Promise');
      var symbolThen = __symbol__('then');
      var _microTaskQueue = [];
      var _isDrainingMicrotaskQueue = false;
      var nativeMicroTaskQueuePromise;
      function scheduleMicroTask(task) {
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
          if (!nativeMicroTaskQueuePromise) {
            if (global[symbolPromise]) {
              nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
            }
          }
          if (nativeMicroTaskQueuePromise) {
            nativeMicroTaskQueuePromise[symbolThen](drainMicroTaskQueue);
          } else {
            global[symbolSetTimeout](drainMicroTaskQueue, 0);
          }
        }
        task && _microTaskQueue.push(task);
      }
      function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
          _isDrainingMicrotaskQueue = true;
          while (_microTaskQueue.length) {
            var queue = _microTaskQueue;
            _microTaskQueue = [];
            for (var i = 0; i < queue.length; i++) {
              var task = queue[i];
              try {
                task.zone.runTask(task, null, null);
              } catch (error) {
                _api.onUnhandledError(error);
              }
            }
          }
          _api.microtaskDrainDone();
          _isDrainingMicrotaskQueue = false;
        }
      }
      var NO_ZONE = {name: 'NO ZONE'};
      var notScheduled = 'notScheduled',
          scheduling = 'scheduling',
          scheduled = 'scheduled',
          running = 'running',
          canceling = 'canceling',
          unknown = 'unknown';
      var microTask = 'microTask',
          macroTask = 'macroTask',
          eventTask = 'eventTask';
      var patches = {};
      var _api = {
        symbol: __symbol__,
        currentZoneFrame: function() {
          return _currentZoneFrame;
        },
        onUnhandledError: noop,
        microtaskDrainDone: noop,
        scheduleMicroTask: scheduleMicroTask,
        showUncaughtError: function() {
          return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')];
        },
        patchEventTarget: function() {
          return [];
        },
        patchOnProperties: noop,
        patchMethod: function() {
          return noop;
        },
        bindArguments: function() {
          return null;
        },
        setNativePromise: function(NativePromise) {
          if (NativePromise && typeof NativePromise.resolve === FUNCTION) {
            nativeMicroTaskQueuePromise = NativePromise.resolve(0);
          }
        }
      };
      var _currentZoneFrame = {
        parent: null,
        zone: new Zone(null, null)
      };
      var _currentTask = null;
      var _numberOfNestedTaskFrames = 0;
      function noop() {}
      function __symbol__(name) {
        return '__zone_symbol__' + name;
      }
      performanceMeasure('Zone', 'Zone');
      return global['Zone'] = Zone;
    })(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);
    Zone.__load_patch('ZoneAwarePromise', function(global, Zone, api) {
      var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
      var ObjectDefineProperty = Object.defineProperty;
      function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
          var className = obj.constructor && obj.constructor.name;
          return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
      }
      var __symbol__ = api.symbol;
      var _uncaughtPromiseErrors = [];
      var symbolPromise = __symbol__('Promise');
      var symbolThen = __symbol__('then');
      var creationTrace = '__creationTrace__';
      api.onUnhandledError = function(e) {
        if (api.showUncaughtError()) {
          var rejection = e && e.rejection;
          if (rejection) {
            console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
          } else {
            console.error(e);
          }
        }
      };
      api.microtaskDrainDone = function() {
        while (_uncaughtPromiseErrors.length) {
          var _loop_1 = function() {
            var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
            try {
              uncaughtPromiseError.zone.runGuarded(function() {
                throw uncaughtPromiseError;
              });
            } catch (error) {
              handleUnhandledRejection(error);
            }
          };
          while (_uncaughtPromiseErrors.length) {
            _loop_1();
          }
        }
      };
      var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
      function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
          var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
          if (handler && typeof handler === 'function') {
            handler.call(this, e);
          }
        } catch (err) {}
      }
      function isThenable(value) {
        return value && value.then;
      }
      function forwardResolution(value) {
        return value;
      }
      function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
      }
      var symbolState = __symbol__('state');
      var symbolValue = __symbol__('value');
      var source = 'Promise.then';
      var UNRESOLVED = null;
      var RESOLVED = true;
      var REJECTED = false;
      var REJECTED_NO_CATCH = 0;
      function makeResolver(promise, state) {
        return function(v) {
          try {
            resolvePromise(promise, state, v);
          } catch (err) {
            resolvePromise(promise, false, err);
          }
        };
      }
      var once = function() {
        var wasCalled = false;
        return function wrapper(wrappedFunction) {
          return function() {
            if (wasCalled) {
              return;
            }
            wasCalled = true;
            wrappedFunction.apply(null, arguments);
          };
        };
      };
      var TYPE_ERROR = 'Promise resolved with itself';
      var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
      function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
          throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
          var then = null;
          try {
            if (typeof value === 'object' || typeof value === 'function') {
              then = value && value.then;
            }
          } catch (err) {
            onceWrapper(function() {
              resolvePromise(promise, false, err);
            })();
            return promise;
          }
          if (state !== REJECTED && value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
            clearRejectedNoCatch(value);
            resolvePromise(promise, value[symbolState], value[symbolValue]);
          } else if (state !== REJECTED && typeof then === 'function') {
            try {
              then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
            } catch (err) {
              onceWrapper(function() {
                resolvePromise(promise, false, err);
              })();
            }
          } else {
            promise[symbolState] = state;
            var queue = promise[symbolValue];
            promise[symbolValue] = value;
            if (state === REJECTED && value instanceof Error) {
              var trace = Zone.currentTask && Zone.currentTask.data && Zone.currentTask.data[creationTrace];
              if (trace) {
                ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, {
                  configurable: true,
                  enumerable: false,
                  writable: true,
                  value: trace
                });
              }
            }
            for (var i = 0; i < queue.length; ) {
              scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
            }
            if (queue.length == 0 && state == REJECTED) {
              promise[symbolState] = REJECTED_NO_CATCH;
              try {
                throw new Error('Uncaught (in promise): ' + readableObjectToString(value) + (value && value.stack ? '\n' + value.stack : ''));
              } catch (err) {
                var error_1 = err;
                error_1.rejection = value;
                error_1.promise = promise;
                error_1.zone = Zone.current;
                error_1.task = Zone.currentTask;
                _uncaughtPromiseErrors.push(error_1);
                api.scheduleMicroTask();
              }
            }
          }
        }
        return promise;
      }
      var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
      function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
          try {
            var handler = Zone[REJECTION_HANDLED_HANDLER];
            if (handler && typeof handler === 'function') {
              handler.call(this, {
                rejection: promise[symbolValue],
                promise: promise
              });
            }
          } catch (err) {}
          promise[symbolState] = REJECTED;
          for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
            if (promise === _uncaughtPromiseErrors[i].promise) {
              _uncaughtPromiseErrors.splice(i, 1);
            }
          }
        }
      }
      function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var delegate = promise[symbolState] ? (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution : (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function() {
          try {
            resolvePromise(chainPromise, true, zone.run(delegate, undefined, [promise[symbolValue]]));
          } catch (error) {
            resolvePromise(chainPromise, false, error);
          }
        });
      }
      var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
      var ZoneAwarePromise = (function() {
        function ZoneAwarePromise(executor) {
          var promise = this;
          if (!(promise instanceof ZoneAwarePromise)) {
            throw new Error('Must be an instanceof Promise.');
          }
          promise[symbolState] = UNRESOLVED;
          promise[symbolValue] = [];
          try {
            executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
          } catch (error) {
            resolvePromise(promise, false, error);
          }
        }
        ZoneAwarePromise.toString = function() {
          return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function(value) {
          return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function(error) {
          return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function(values) {
          var resolve;
          var reject;
          var promise = new this(function(res, rej) {
            resolve = res;
            reject = rej;
          });
          function onResolve(value) {
            promise && (promise = null || resolve(value));
          }
          function onReject(error) {
            promise && (promise = null || reject(error));
          }
          for (var _i = 0,
              values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            if (!isThenable(value)) {
              value = this.resolve(value);
            }
            value.then(onResolve, onReject);
          }
          return promise;
        };
        ZoneAwarePromise.all = function(values) {
          var resolve;
          var reject;
          var promise = new this(function(res, rej) {
            resolve = res;
            reject = rej;
          });
          var count = 0;
          var resolvedValues = [];
          for (var _i = 0,
              values_2 = values; _i < values_2.length; _i++) {
            var value = values_2[_i];
            if (!isThenable(value)) {
              value = this.resolve(value);
            }
            value.then((function(index) {
              return function(value) {
                resolvedValues[index] = value;
                count--;
                if (!count) {
                  resolve(resolvedValues);
                }
              };
            })(count), reject);
            count++;
          }
          if (!count)
            resolve(resolvedValues);
          return promise;
        };
        ZoneAwarePromise.prototype.then = function(onFulfilled, onRejected) {
          var chainPromise = new this.constructor(null);
          var zone = Zone.current;
          if (this[symbolState] == UNRESOLVED) {
            this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
          } else {
            scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
          }
          return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function(onRejected) {
          return this.then(null, onRejected);
        };
        return ZoneAwarePromise;
      }());
      ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
      ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
      ZoneAwarePromise['race'] = ZoneAwarePromise.race;
      ZoneAwarePromise['all'] = ZoneAwarePromise.all;
      var NativePromise = global[symbolPromise] = global['Promise'];
      var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
      var desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
      if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
          desc = {
            configurable: true,
            enumerable: true
          };
        }
        desc.get = function() {
          return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function(NewNativePromise) {
          if (NewNativePromise === ZoneAwarePromise) {
            global[ZONE_AWARE_PROMISE] = NewNativePromise;
          } else {
            global[symbolPromise] = NewNativePromise;
            if (!NewNativePromise.prototype[symbolThen]) {
              patchThen(NewNativePromise);
            }
            api.setNativePromise(NewNativePromise);
          }
        };
        ObjectDefineProperty(global, 'Promise', desc);
      }
      global['Promise'] = ZoneAwarePromise;
      var symbolThenPatched = __symbol__('thenPatched');
      function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var originalThen = proto.then;
        proto[symbolThen] = originalThen;
        var prop = ObjectGetOwnPropertyDescriptor(Ctor.prototype, 'then');
        if (prop && prop.writable === false && prop.configurable) {
          ObjectDefineProperty(Ctor.prototype, 'then', {writable: true});
        }
        Ctor.prototype.then = function(onResolve, onReject) {
          var _this = this;
          var wrapped = new ZoneAwarePromise(function(resolve, reject) {
            originalThen.call(_this, resolve, reject);
          });
          return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
      }
      function zoneify(fn) {
        return function() {
          var resultPromise = fn.apply(this, arguments);
          if (resultPromise instanceof ZoneAwarePromise) {
            return resultPromise;
          }
          var ctor = resultPromise.constructor;
          if (!ctor[symbolThenPatched]) {
            patchThen(ctor);
          }
          return resultPromise;
        };
      }
      if (NativePromise) {
        patchThen(NativePromise);
        var fetch_1 = global['fetch'];
        if (typeof fetch_1 == 'function') {
          global['fetch'] = zoneify(fetch_1);
        }
      }
      Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
      return ZoneAwarePromise;
    });
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectDefineProperty = Object.defineProperty;
    var ObjectGetPrototypeOf = Object.getPrototypeOf;
    var ArraySlice = Array.prototype.slice;
    var ADD_EVENT_LISTENER_STR = 'addEventListener';
    var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
    var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
    var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
    var TRUE_STR = 'true';
    var FALSE_STR = 'false';
    var ZONE_SYMBOL_PREFIX = '__zone_symbol__';
    function wrapWithCurrentZone(callback, source) {
      return Zone.current.wrap(callback, source);
    }
    function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
      return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
    }
    var zoneSymbol = Zone.__symbol__;
    var isWindowExists = typeof window !== 'undefined';
    var internalWindow = isWindowExists ? window : undefined;
    var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
    var REMOVE_ATTRIBUTE = 'removeAttribute';
    var NULL_ON_PROP_VALUE = [null];
    function bindArguments(args, source) {
      for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
          args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
        }
      }
      return args;
    }
    function isPropertyWritable(propertyDesc) {
      if (!propertyDesc) {
        return true;
      }
      if (propertyDesc.writable === false) {
        return false;
      }
      return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
    }
    var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
    var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' && {}.toString.call(_global.process) === '[object process]');
    var isMix = typeof _global.process !== 'undefined' && {}.toString.call(_global.process) === '[object process]' && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
    var zoneSymbolEventNames = {};
    var wrapFn = function(event) {
      event = event || _global.event;
      if (!event) {
        return;
      }
      var eventNameSymbol = zoneSymbolEventNames[event.type];
      if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
      }
      var target = this || event.target || _global;
      var listener = target[eventNameSymbol];
      var result = listener && listener.apply(this, arguments);
      if (result != undefined && !result) {
        event.preventDefault();
      }
      return result;
    };
    function patchProperty(obj, prop, prototype) {
      var desc = ObjectGetOwnPropertyDescriptor(obj, prop);
      if (!desc && prototype) {
        var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
          desc = {
            enumerable: true,
            configurable: true
          };
        }
      }
      if (!desc || !desc.configurable) {
        return;
      }
      delete desc.writable;
      delete desc.value;
      var originalDescGet = desc.get;
      var originalDescSet = desc.set;
      var eventName = prop.substr(2);
      var eventNameSymbol = zoneSymbolEventNames[eventName];
      if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
      }
      desc.set = function(newValue) {
        var target = this;
        if (!target && obj === _global) {
          target = _global;
        }
        if (!target) {
          return;
        }
        var previousValue = target[eventNameSymbol];
        if (previousValue) {
          target.removeEventListener(eventName, wrapFn);
        }
        if (originalDescSet) {
          originalDescSet.apply(target, NULL_ON_PROP_VALUE);
        }
        if (typeof newValue === 'function') {
          target[eventNameSymbol] = newValue;
          target.addEventListener(eventName, wrapFn, false);
        } else {
          target[eventNameSymbol] = null;
        }
      };
      desc.get = function() {
        var target = this;
        if (!target && obj === _global) {
          target = _global;
        }
        if (!target) {
          return null;
        }
        var listener = target[eventNameSymbol];
        if (listener) {
          return listener;
        } else if (originalDescGet) {
          var value = originalDescGet && originalDescGet.call(this);
          if (value) {
            desc.set.call(this, value);
            if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
              target.removeAttribute(prop);
            }
            return value;
          }
        }
        return null;
      };
      ObjectDefineProperty(obj, prop, desc);
    }
    function patchOnProperties(obj, properties, prototype) {
      if (properties) {
        for (var i = 0; i < properties.length; i++) {
          patchProperty(obj, 'on' + properties[i], prototype);
        }
      } else {
        var onProperties = [];
        for (var prop in obj) {
          if (prop.substr(0, 2) == 'on') {
            onProperties.push(prop);
          }
        }
        for (var j = 0; j < onProperties.length; j++) {
          patchProperty(obj, onProperties[j], prototype);
        }
      }
    }
    var originalInstanceKey = zoneSymbol('originalInstance');
    function patchMethod(target, name, patchFn) {
      var proto = target;
      while (proto && !proto.hasOwnProperty(name)) {
        proto = ObjectGetPrototypeOf(proto);
      }
      if (!proto && target[name]) {
        proto = target;
      }
      var delegateName = zoneSymbol(name);
      var delegate;
      if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
          var patchDelegate_1 = patchFn(delegate, delegateName, name);
          proto[name] = function() {
            return patchDelegate_1(this, arguments);
          };
          attachOriginToPatched(proto[name], delegate);
        }
      }
      return delegate;
    }
    function patchMacroTask(obj, funcName, metaCreator) {
      var setNative = null;
      function scheduleTask(task) {
        var data = task.data;
        data.args[data.cbIdx] = function() {
          task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
      }
      setNative = patchMethod(obj, funcName, function(delegate) {
        return function(self, args) {
          var meta = metaCreator(self, args);
          if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask, null);
          } else {
            return delegate.apply(self, args);
          }
        };
      });
    }
    function patchMicroTask(obj, funcName, metaCreator) {
      var setNative = null;
      function scheduleTask(task) {
        var data = task.data;
        data.args[data.cbIdx] = function() {
          task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
      }
      setNative = patchMethod(obj, funcName, function(delegate) {
        return function(self, args) {
          var meta = metaCreator(self, args);
          if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return Zone.current.scheduleMicroTask(meta.name, args[meta.cbIdx], meta, scheduleTask);
          } else {
            return delegate.apply(self, args);
          }
        };
      });
    }
    function attachOriginToPatched(patched, original) {
      patched[zoneSymbol('OriginalDelegate')] = original;
    }
    Zone.__load_patch('toString', function(global, Zone) {
      var originalFunctionToString = Zone['__zone_symbol__originalToString'] = Function.prototype.toString;
      var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
      var PROMISE_SYMBOL = zoneSymbol('Promise');
      var ERROR_SYMBOL = zoneSymbol('Error');
      Function.prototype.toString = function() {
        if (typeof this === 'function') {
          var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
          if (originalDelegate) {
            if (typeof originalDelegate === 'function') {
              return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
            } else {
              return Object.prototype.toString.call(originalDelegate);
            }
          }
          if (this === Promise) {
            var nativePromise = global[PROMISE_SYMBOL];
            if (nativePromise) {
              return originalFunctionToString.apply(nativePromise, arguments);
            }
          }
          if (this === Error) {
            var nativeError = global[ERROR_SYMBOL];
            if (nativeError) {
              return originalFunctionToString.apply(nativeError, arguments);
            }
          }
        }
        return originalFunctionToString.apply(this, arguments);
      };
      var originalObjectToString = Object.prototype.toString;
      var PROMISE_OBJECT_TO_STRING = '[object Promise]';
      Object.prototype.toString = function() {
        if (this instanceof Promise) {
          return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
      };
    });
    var OPTIMIZED_ZONE_EVENT_TASK_DATA = {useG: true};
    var zoneSymbolEventNames$1 = {};
    var globalSources = {};
    var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
    var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
    function patchEventTarget(_global, apis, patchOptions) {
      var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
      var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
      var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
      var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
      var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
      var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
      var PREPEND_EVENT_LISTENER = 'prependListener';
      var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
      var invokeTask = function(task, target, event) {
        if (task.isRemoved) {
          return;
        }
        var delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
          task.callback = function(event) {
            return delegate.handleEvent(event);
          };
          task.originalDelegate = delegate;
        }
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
          var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
          target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
        }
      };
      var globalZoneAwareCallback = function(event) {
        event = event || _global.event;
        if (!event) {
          return;
        }
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
        if (tasks) {
          if (tasks.length === 1) {
            invokeTask(tasks[0], target, event);
          } else {
            var copyTasks = tasks.slice();
            for (var i = 0; i < copyTasks.length; i++) {
              if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                break;
              }
              invokeTask(copyTasks[i], target, event);
            }
          }
        }
      };
      var globalZoneAwareCaptureCallback = function(event) {
        event = event || _global.event;
        if (!event) {
          return;
        }
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
        if (tasks) {
          if (tasks.length === 1) {
            invokeTask(tasks[0], target, event);
          } else {
            var copyTasks = tasks.slice();
            for (var i = 0; i < copyTasks.length; i++) {
              if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                break;
              }
              invokeTask(copyTasks[i], target, event);
            }
          }
        }
      };
      function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
          return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
          useGlobalCallback = patchOptions.useG;
        }
        var validateHandler = patchOptions && patchOptions.vh;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
          checkDuplicate = patchOptions.chkDup;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
          returnTarget = patchOptions.rt;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
          proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
          proto = obj;
        }
        if (!proto) {
          return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
          return false;
        }
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] = proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] = proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] = proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
          nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] = proto[patchOptions.prepend];
        }
        var customScheduleGlobal = function() {
          if (taskData.isExisting) {
            return;
          }
          return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        var customCancelGlobal = function(task) {
          if (!task.isRemoved) {
            var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
            var symbolEventName = void 0;
            if (symbolEventNames) {
              symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = symbolEventName && task.target[symbolEventName];
            if (existingTasks) {
              for (var i = 0; i < existingTasks.length; i++) {
                var existingTask = existingTasks[i];
                if (existingTask === task) {
                  existingTasks.splice(i, 1);
                  task.isRemoved = true;
                  if (existingTasks.length === 0) {
                    task.allRemoved = true;
                    task.target[symbolEventName] = null;
                  }
                  break;
                }
              }
            }
          }
          if (!task.allRemoved) {
            return;
          }
          return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
        };
        var customScheduleNonGlobal = function(task) {
          return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customSchedulePrepend = function(task) {
          return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customCancelNonGlobal = function(task) {
          return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function(task, delegate) {
          var typeOfDelegate = typeof delegate;
          return (typeOfDelegate === 'function' && task.callback === delegate) || (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        var blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        var makeAddListener = function(nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
          if (returnTarget === void 0) {
            returnTarget = false;
          }
          if (prepend === void 0) {
            prepend = false;
          }
          return function() {
            var target = this || _global;
            var delegate = arguments[1];
            if (!delegate) {
              return nativeListener.apply(this, arguments);
            }
            var isHandleEvent = false;
            if (typeof delegate !== 'function') {
              if (!delegate.handleEvent) {
                return nativeListener.apply(this, arguments);
              }
              isHandleEvent = true;
            }
            if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
              return;
            }
            var eventName = arguments[0];
            var options = arguments[2];
            if (blackListedEvents) {
              for (var i = 0; i < blackListedEvents.length; i++) {
                if (eventName === blackListedEvents[i]) {
                  return nativeListener.apply(this, arguments);
                }
              }
            }
            var capture;
            var once = false;
            if (options === undefined) {
              capture = false;
            } else if (options === true) {
              capture = true;
            } else if (options === false) {
              capture = false;
            } else {
              capture = options ? !!options.capture : false;
              once = options ? !!options.once : false;
            }
            var zone = Zone.current;
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            var symbolEventName;
            if (!symbolEventNames) {
              var falseEventName = eventName + FALSE_STR;
              var trueEventName = eventName + TRUE_STR;
              var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
              var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
              zoneSymbolEventNames$1[eventName] = {};
              zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
              zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
              symbolEventName = capture ? symbolCapture : symbol;
            } else {
              symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = target[symbolEventName];
            var isExisting = false;
            if (existingTasks) {
              isExisting = true;
              if (checkDuplicate) {
                for (var i = 0; i < existingTasks.length; i++) {
                  if (compare(existingTasks[i], delegate)) {
                    return;
                  }
                }
              }
            } else {
              existingTasks = target[symbolEventName] = [];
            }
            var source;
            var constructorName = target.constructor['name'];
            var targetSource = globalSources[constructorName];
            if (targetSource) {
              source = targetSource[eventName];
            }
            if (!source) {
              source = constructorName + addSource + eventName;
            }
            taskData.options = options;
            if (once) {
              taskData.options.once = false;
            }
            taskData.target = target;
            taskData.capture = capture;
            taskData.eventName = eventName;
            taskData.isExisting = isExisting;
            var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : null;
            if (data) {
              data.taskData = taskData;
            }
            var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
            taskData.target = null;
            if (data) {
              data.taskData = null;
            }
            if (once) {
              options.once = true;
            }
            task.options = options;
            task.target = target;
            task.capture = capture;
            task.eventName = eventName;
            if (isHandleEvent) {
              task.originalDelegate = delegate;
            }
            if (!prepend) {
              existingTasks.push(task);
            } else {
              existingTasks.unshift(task);
            }
            if (returnTarget) {
              return target;
            }
          };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
          proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function() {
          var target = this || _global;
          var eventName = arguments[0];
          var options = arguments[2];
          var capture;
          if (options === undefined) {
            capture = false;
          } else if (options === true) {
            capture = true;
          } else if (options === false) {
            capture = false;
          } else {
            capture = options ? !!options.capture : false;
          }
          var delegate = arguments[1];
          if (!delegate) {
            return nativeRemoveEventListener.apply(this, arguments);
          }
          if (validateHandler && !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
            return;
          }
          var symbolEventNames = zoneSymbolEventNames$1[eventName];
          var symbolEventName;
          if (symbolEventNames) {
            symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
          }
          var existingTasks = symbolEventName && target[symbolEventName];
          if (existingTasks) {
            for (var i = 0; i < existingTasks.length; i++) {
              var existingTask = existingTasks[i];
              if (compare(existingTask, delegate)) {
                existingTasks.splice(i, 1);
                existingTask.isRemoved = true;
                if (existingTasks.length === 0) {
                  existingTask.allRemoved = true;
                  target[symbolEventName] = null;
                }
                existingTask.zone.cancelTask(existingTask);
                return;
              }
            }
          }
          return nativeRemoveEventListener.apply(this, arguments);
        };
        proto[LISTENERS_EVENT_LISTENER] = function() {
          var target = this || _global;
          var eventName = arguments[0];
          var listeners = [];
          var tasks = findEventTasks(target, eventName);
          for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
            listeners.push(delegate);
          }
          return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function() {
          var target = this || _global;
          var eventName = arguments[0];
          if (!eventName) {
            var keys = Object.keys(target);
            for (var i = 0; i < keys.length; i++) {
              var prop = keys[i];
              var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
              var evtName = match && match[1];
              if (evtName && evtName !== 'removeListener') {
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
              }
            }
            this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
          } else {
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            if (symbolEventNames) {
              var symbolEventName = symbolEventNames[FALSE_STR];
              var symbolCaptureEventName = symbolEventNames[TRUE_STR];
              var tasks = target[symbolEventName];
              var captureTasks = target[symbolCaptureEventName];
              if (tasks) {
                var removeTasks = tasks.slice();
                for (var i = 0; i < removeTasks.length; i++) {
                  var task = removeTasks[i];
                  var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                  this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                }
              }
              if (captureTasks) {
                var removeTasks = captureTasks.slice();
                for (var i = 0; i < removeTasks.length; i++) {
                  var task = removeTasks[i];
                  var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                  this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                }
              }
            }
          }
        };
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
          attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
          attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
      }
      var results = [];
      for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
      }
      return results;
    }
    function findEventTasks(target, eventName) {
      var foundTasks = [];
      for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
          var tasks = target[prop];
          if (tasks) {
            for (var i = 0; i < tasks.length; i++) {
              foundTasks.push(tasks[i]);
            }
          }
        }
      }
      return foundTasks;
    }
    Zone.__load_patch('EventEmitter', function(global) {
      var EE_ADD_LISTENER = 'addListener';
      var EE_PREPEND_LISTENER = 'prependListener';
      var EE_REMOVE_LISTENER = 'removeListener';
      var EE_REMOVE_ALL_LISTENER = 'removeAllListeners';
      var EE_LISTENERS = 'listeners';
      var EE_ON = 'on';
      var compareTaskCallbackVsDelegate = function(task, delegate) {
        return task.callback === delegate || task.callback.listener === delegate;
      };
      function patchEventEmitterMethods(obj) {
        var result = patchEventTarget(global, [obj], {
          useG: false,
          add: EE_ADD_LISTENER,
          rm: EE_REMOVE_LISTENER,
          prepend: EE_PREPEND_LISTENER,
          rmAll: EE_REMOVE_ALL_LISTENER,
          listeners: EE_LISTENERS,
          chkDup: false,
          rt: true,
          diff: compareTaskCallbackVsDelegate
        });
        if (result && result[0]) {
          obj[EE_ON] = obj[EE_ADD_LISTENER];
        }
      }
      var events;
      try {
        events = require('events');
      } catch (err) {}
      if (events && events.EventEmitter) {
        patchEventEmitterMethods(events.EventEmitter.prototype);
      }
    });
    Zone.__load_patch('fs', function() {
      var fs;
      try {
        fs = require('fs');
      } catch (err) {}
      var TO_PATCH_MACROTASK_METHODS = ['access', 'appendFile', 'chmod', 'chown', 'close', 'exists', 'fchmod', 'fchown', 'fdatasync', 'fstat', 'fsync', 'ftruncate', 'futimes', 'lchmod', 'lchown', 'link', 'lstat', 'mkdir', 'mkdtemp', 'open', 'read', 'readdir', 'readFile', 'readlink', 'realpath', 'rename', 'rmdir', 'stat', 'symlink', 'truncate', 'unlink', 'utimes', 'write', 'writeFile'];
      if (fs) {
        TO_PATCH_MACROTASK_METHODS.filter(function(name) {
          return !!fs[name] && typeof fs[name] === 'function';
        }).forEach(function(name) {
          patchMacroTask(fs, name, function(self, args) {
            return {
              name: 'fs.' + name,
              args: args,
              cbIdx: args.length > 0 ? args.length - 1 : -1,
              target: self
            };
          });
        });
      }
    });
    var taskSymbol = zoneSymbol('zoneTask');
    function patchTimer(window, setName, cancelName, nameSuffix) {
      var setNative = null;
      var clearNative = null;
      setName += nameSuffix;
      cancelName += nameSuffix;
      var tasksByHandleId = {};
      function scheduleTask(task) {
        var data = task.data;
        function timer() {
          try {
            task.invoke.apply(this, arguments);
          } finally {
            if (!(task.data && task.data.isPeriodic)) {
              if (typeof data.handleId === 'number') {
                delete tasksByHandleId[data.handleId];
              } else if (data.handleId) {
                data.handleId[taskSymbol] = null;
              }
            }
          }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
      }
      function clearTask(task) {
        return clearNative(task.data.handleId);
      }
      setNative = patchMethod(window, setName, function(delegate) {
        return function(self, args) {
          if (typeof args[0] === 'function') {
            var options = {
              handleId: null,
              isPeriodic: nameSuffix === 'Interval',
              delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 : null,
              args: args
            };
            var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
            if (!task) {
              return task;
            }
            var handle = task.data.handleId;
            if (typeof handle === 'number') {
              tasksByHandleId[handle] = task;
            } else if (handle) {
              handle[taskSymbol] = task;
            }
            if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' && typeof handle.unref === 'function') {
              task.ref = handle.ref.bind(handle);
              task.unref = handle.unref.bind(handle);
            }
            if (typeof handle === 'number' || handle) {
              return handle;
            }
            return task;
          } else {
            return delegate.apply(window, args);
          }
        };
      });
      clearNative = patchMethod(window, cancelName, function(delegate) {
        return function(self, args) {
          var id = args[0];
          var task;
          if (typeof id === 'number') {
            task = tasksByHandleId[id];
          } else {
            task = id && id[taskSymbol];
            if (!task) {
              task = id;
            }
          }
          if (task && typeof task.type === 'string') {
            if (task.state !== 'notScheduled' && (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
              if (typeof id === 'number') {
                delete tasksByHandleId[id];
              } else if (id) {
                id[taskSymbol] = null;
              }
              task.zone.cancelTask(task);
            }
          } else {
            delegate.apply(window, args);
          }
        };
      });
    }
    var set = 'set';
    var clear = 'clear';
    Zone.__load_patch('node_util', function(global, Zone, api) {
      api.patchOnProperties = patchOnProperties;
      api.patchMethod = patchMethod;
      api.bindArguments = bindArguments;
    });
    Zone.__load_patch('node_timers', function(global, Zone) {
      var globalUseTimeoutFromTimer = false;
      try {
        var timers = require('timers');
        var globalEqualTimersTimeout = global.setTimeout === timers.setTimeout;
        if (!globalEqualTimersTimeout && !isMix) {
          var originSetTimeout_1 = timers.setTimeout;
          timers.setTimeout = function() {
            globalUseTimeoutFromTimer = true;
            return originSetTimeout_1.apply(this, arguments);
          };
          var detectTimeout = global.setTimeout(function() {}, 100);
          clearTimeout(detectTimeout);
          timers.setTimeout = originSetTimeout_1;
        }
        patchTimer(timers, set, clear, 'Timeout');
        patchTimer(timers, set, clear, 'Interval');
        patchTimer(timers, set, clear, 'Immediate');
      } catch (error) {}
      if (isMix) {
        return;
      }
      if (!globalUseTimeoutFromTimer) {
        patchTimer(global, set, clear, 'Timeout');
        patchTimer(global, set, clear, 'Interval');
        patchTimer(global, set, clear, 'Immediate');
      } else {
        global[Zone.__symbol__('setTimeout')] = global.setTimeout;
        global[Zone.__symbol__('setInterval')] = global.setInterval;
        global[Zone.__symbol__('setImmediate')] = global.setImmediate;
      }
    });
    Zone.__load_patch('nextTick', function() {
      patchMicroTask(process, 'nextTick', function(self, args) {
        return {
          name: 'process.nextTick',
          args: args,
          cbIdx: (args.length > 0 && typeof args[0] === 'function') ? 0 : -1,
          target: process
        };
      });
    });
    Zone.__load_patch('handleUnhandledPromiseRejection', function(global, Zone, api) {
      Zone[api.symbol('unhandledPromiseRejectionHandler')] = findProcessPromiseRejectionHandler('unhandledRejection');
      Zone[api.symbol('rejectionHandledHandler')] = findProcessPromiseRejectionHandler('rejectionHandled');
      function findProcessPromiseRejectionHandler(evtName) {
        return function(e) {
          var eventTasks = findEventTasks(process, evtName);
          eventTasks.forEach(function(eventTask) {
            if (evtName === 'unhandledRejection') {
              eventTask.invoke(e.rejection, e.promise);
            } else if (evtName === 'rejectionHandled') {
              eventTask.invoke(e.promise);
            }
          });
        };
      }
    });
    Zone.__load_patch('crypto', function() {
      var crypto;
      try {
        crypto = require('crypto');
      } catch (err) {}
      if (crypto) {
        var methodNames = ['randomBytes', 'pbkdf2'];
        methodNames.forEach(function(name) {
          patchMacroTask(crypto, name, function(self, args) {
            return {
              name: 'crypto.' + name,
              args: args,
              cbIdx: (args.length > 0 && typeof args[args.length - 1] === 'function') ? args.length - 1 : -1,
              target: crypto
            };
          });
        });
      }
    });
    Zone.__load_patch('console', function(global, Zone) {
      var consoleMethods = ['dir', 'log', 'info', 'error', 'warn', 'assert', 'debug', 'timeEnd', 'trace'];
      consoleMethods.forEach(function(m) {
        var originalMethod = console[Zone.__symbol__(m)] = console[m];
        if (originalMethod) {
          console[m] = function() {
            var args = ArraySlice.call(arguments);
            if (Zone.current === Zone.root) {
              return originalMethod.apply(this, args);
            } else {
              return Zone.root.run(originalMethod, this, args);
            }
          };
        }
      });
    });
    var NEWLINE = '\n';
    var IGNORE_FRAMES = {};
    var creationTrace = '__creationTrace__';
    var ERROR_TAG = 'STACKTRACE TRACKING';
    var SEP_TAG = '__SEP_TAG__';
    var sepTemplate = SEP_TAG + '@[native]';
    var LongStackTrace = (function() {
      function LongStackTrace() {
        this.error = getStacktrace();
        this.timestamp = new Date();
      }
      return LongStackTrace;
    }());
    function getStacktraceWithUncaughtError() {
      return new Error(ERROR_TAG);
    }
    function getStacktraceWithCaughtError() {
      try {
        throw getStacktraceWithUncaughtError();
      } catch (err) {
        return err;
      }
    }
    var error$1 = getStacktraceWithUncaughtError();
    var caughtError = getStacktraceWithCaughtError();
    var getStacktrace = error$1.stack ? getStacktraceWithUncaughtError : (caughtError.stack ? getStacktraceWithCaughtError : getStacktraceWithUncaughtError);
    function getFrames(error) {
      return error.stack ? error.stack.split(NEWLINE) : [];
    }
    function addErrorStack(lines, error) {
      var trace = getFrames(error);
      for (var i = 0; i < trace.length; i++) {
        var frame = trace[i];
        if (!IGNORE_FRAMES.hasOwnProperty(frame)) {
          lines.push(trace[i]);
        }
      }
    }
    function renderLongStackTrace(frames, stack) {
      var longTrace = [stack ? stack.trim() : ''];
      if (frames) {
        var timestamp = new Date().getTime();
        for (var i = 0; i < frames.length; i++) {
          var traceFrames = frames[i];
          var lastTime = traceFrames.timestamp;
          var separator = "____________________Elapsed " + (timestamp - lastTime.getTime()) + " ms; At: " + lastTime;
          separator = separator.replace(/[^\w\d]/g, '_');
          longTrace.push(sepTemplate.replace(SEP_TAG, separator));
          addErrorStack(longTrace, traceFrames.error);
          timestamp = lastTime.getTime();
        }
      }
      return longTrace.join(NEWLINE);
    }
    Zone['longStackTraceZoneSpec'] = {
      name: 'long-stack-trace',
      longStackTraceLimit: 10,
      getLongStackTrace: function(error) {
        if (!error) {
          return undefined;
        }
        var trace = error[Zone.__symbol__('currentTaskTrace')];
        if (!trace) {
          return error.stack;
        }
        return renderLongStackTrace(trace, error.stack);
      },
      onScheduleTask: function(parentZoneDelegate, currentZone, targetZone, task) {
        if (Error.stackTraceLimit > 0) {
          var currentTask = Zone.currentTask;
          var trace = currentTask && currentTask.data && currentTask.data[creationTrace] || [];
          trace = [new LongStackTrace()].concat(trace);
          if (trace.length > this.longStackTraceLimit) {
            trace.length = this.longStackTraceLimit;
          }
          if (!task.data)
            task.data = {};
          task.data[creationTrace] = trace;
        }
        return parentZoneDelegate.scheduleTask(targetZone, task);
      },
      onHandleError: function(parentZoneDelegate, currentZone, targetZone, error) {
        if (Error.stackTraceLimit > 0) {
          var parentTask = Zone.currentTask || error.task;
          if (error instanceof Error && parentTask) {
            var longStack = renderLongStackTrace(parentTask.data && parentTask.data[creationTrace], error.stack);
            try {
              error.stack = error.longStack = longStack;
            } catch (err) {}
          }
        }
        return parentZoneDelegate.handleError(targetZone, error);
      }
    };
    function captureStackTraces(stackTraces, count) {
      if (count > 0) {
        stackTraces.push(getFrames((new LongStackTrace()).error));
        captureStackTraces(stackTraces, count - 1);
      }
    }
    function computeIgnoreFrames() {
      if (Error.stackTraceLimit <= 0) {
        return;
      }
      var frames = [];
      captureStackTraces(frames, 2);
      var frames1 = frames[0];
      var frames2 = frames[1];
      for (var i = 0; i < frames1.length; i++) {
        var frame1 = frames1[i];
        if (frame1.indexOf(ERROR_TAG) == -1) {
          var match = frame1.match(/^\s*at\s+/);
          if (match) {
            sepTemplate = match[0] + SEP_TAG + ' (http://localhost)';
            break;
          }
        }
      }
      for (var i = 0; i < frames1.length; i++) {
        var frame1 = frames1[i];
        var frame2 = frames2[i];
        if (frame1 === frame2) {
          IGNORE_FRAMES[frame1] = true;
        } else {
          break;
        }
      }
    }
    computeIgnoreFrames();
    var ProxyZoneSpec = (function() {
      function ProxyZoneSpec(defaultSpecDelegate) {
        if (defaultSpecDelegate === void 0) {
          defaultSpecDelegate = null;
        }
        this.defaultSpecDelegate = defaultSpecDelegate;
        this.name = 'ProxyZone';
        this.properties = {'ProxyZoneSpec': this};
        this.propertyKeys = null;
        this.setDelegate(defaultSpecDelegate);
      }
      ProxyZoneSpec.get = function() {
        return Zone.current.get('ProxyZoneSpec');
      };
      ProxyZoneSpec.isLoaded = function() {
        return ProxyZoneSpec.get() instanceof ProxyZoneSpec;
      };
      ProxyZoneSpec.assertPresent = function() {
        if (!this.isLoaded()) {
          throw new Error("Expected to be running in 'ProxyZone', but it was not found.");
        }
        return ProxyZoneSpec.get();
      };
      ProxyZoneSpec.prototype.setDelegate = function(delegateSpec) {
        var _this = this;
        this._delegateSpec = delegateSpec;
        this.propertyKeys && this.propertyKeys.forEach(function(key) {
          return delete _this.properties[key];
        });
        this.propertyKeys = null;
        if (delegateSpec && delegateSpec.properties) {
          this.propertyKeys = Object.keys(delegateSpec.properties);
          this.propertyKeys.forEach(function(k) {
            return _this.properties[k] = delegateSpec.properties[k];
          });
        }
      };
      ProxyZoneSpec.prototype.getDelegate = function() {
        return this._delegateSpec;
      };
      ProxyZoneSpec.prototype.resetDelegate = function() {
        this.setDelegate(this.defaultSpecDelegate);
      };
      ProxyZoneSpec.prototype.onFork = function(parentZoneDelegate, currentZone, targetZone, zoneSpec) {
        if (this._delegateSpec && this._delegateSpec.onFork) {
          return this._delegateSpec.onFork(parentZoneDelegate, currentZone, targetZone, zoneSpec);
        } else {
          return parentZoneDelegate.fork(targetZone, zoneSpec);
        }
      };
      ProxyZoneSpec.prototype.onIntercept = function(parentZoneDelegate, currentZone, targetZone, delegate, source) {
        if (this._delegateSpec && this._delegateSpec.onIntercept) {
          return this._delegateSpec.onIntercept(parentZoneDelegate, currentZone, targetZone, delegate, source);
        } else {
          return parentZoneDelegate.intercept(targetZone, delegate, source);
        }
      };
      ProxyZoneSpec.prototype.onInvoke = function(parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) {
        if (this._delegateSpec && this._delegateSpec.onInvoke) {
          return this._delegateSpec.onInvoke(parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source);
        } else {
          return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
        }
      };
      ProxyZoneSpec.prototype.onHandleError = function(parentZoneDelegate, currentZone, targetZone, error) {
        if (this._delegateSpec && this._delegateSpec.onHandleError) {
          return this._delegateSpec.onHandleError(parentZoneDelegate, currentZone, targetZone, error);
        } else {
          return parentZoneDelegate.handleError(targetZone, error);
        }
      };
      ProxyZoneSpec.prototype.onScheduleTask = function(parentZoneDelegate, currentZone, targetZone, task) {
        if (this._delegateSpec && this._delegateSpec.onScheduleTask) {
          return this._delegateSpec.onScheduleTask(parentZoneDelegate, currentZone, targetZone, task);
        } else {
          return parentZoneDelegate.scheduleTask(targetZone, task);
        }
      };
      ProxyZoneSpec.prototype.onInvokeTask = function(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
        if (this._delegateSpec && this._delegateSpec.onFork) {
          return this._delegateSpec.onInvokeTask(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs);
        } else {
          return parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
        }
      };
      ProxyZoneSpec.prototype.onCancelTask = function(parentZoneDelegate, currentZone, targetZone, task) {
        if (this._delegateSpec && this._delegateSpec.onCancelTask) {
          return this._delegateSpec.onCancelTask(parentZoneDelegate, currentZone, targetZone, task);
        } else {
          return parentZoneDelegate.cancelTask(targetZone, task);
        }
      };
      ProxyZoneSpec.prototype.onHasTask = function(delegate, current, target, hasTaskState) {
        if (this._delegateSpec && this._delegateSpec.onHasTask) {
          this._delegateSpec.onHasTask(delegate, current, target, hasTaskState);
        } else {
          delegate.hasTask(target, hasTaskState);
        }
      };
      return ProxyZoneSpec;
    }());
    Zone['ProxyZoneSpec'] = ProxyZoneSpec;
    var SyncTestZoneSpec = (function() {
      function SyncTestZoneSpec(namePrefix) {
        this.runZone = Zone.current;
        this.name = 'syncTestZone for ' + namePrefix;
      }
      SyncTestZoneSpec.prototype.onScheduleTask = function(delegate, current, target, task) {
        switch (task.type) {
          case 'microTask':
          case 'macroTask':
            throw new Error("Cannot call " + task.source + " from within a sync test.");
          case 'eventTask':
            task = delegate.scheduleTask(target, task);
            break;
        }
        return task;
      };
      return SyncTestZoneSpec;
    }());
    Zone['SyncTestZoneSpec'] = SyncTestZoneSpec;
    (function() {
      var __extends = function(d, b) {
        for (var p in b)
          if (b.hasOwnProperty(p))
            d[p] = b[p];
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
      if (!Zone)
        throw new Error('Missing: zone.js');
      if (typeof jasmine == 'undefined')
        throw new Error('Missing: jasmine.js');
      if (jasmine['__zone_patch__'])
        throw new Error('\'jasmine\' has already been patched with \'Zone\'.');
      jasmine['__zone_patch__'] = true;
      var SyncTestZoneSpec = Zone['SyncTestZoneSpec'];
      var ProxyZoneSpec = Zone['ProxyZoneSpec'];
      if (!SyncTestZoneSpec)
        throw new Error('Missing: SyncTestZoneSpec');
      if (!ProxyZoneSpec)
        throw new Error('Missing: ProxyZoneSpec');
      var ambientZone = Zone.current;
      var syncZone = ambientZone.fork(new SyncTestZoneSpec('jasmine.describe'));
      var testProxyZone = null;
      var jasmineEnv = jasmine.getEnv();
      ['describe', 'xdescribe', 'fdescribe'].forEach(function(methodName) {
        var originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[methodName] = function(description, specDefinitions) {
          return originalJasmineFn.call(this, description, wrapDescribeInZone(specDefinitions));
        };
      });
      ['it', 'xit', 'fit'].forEach(function(methodName) {
        var originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[Zone.__symbol__(methodName)] = originalJasmineFn;
        jasmineEnv[methodName] = function(description, specDefinitions, timeout) {
          arguments[1] = wrapTestInZone(specDefinitions);
          return originalJasmineFn.apply(this, arguments);
        };
      });
      ['beforeEach', 'afterEach'].forEach(function(methodName) {
        var originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[Zone.__symbol__(methodName)] = originalJasmineFn;
        jasmineEnv[methodName] = function(specDefinitions, timeout) {
          arguments[0] = wrapTestInZone(specDefinitions);
          return originalJasmineFn.apply(this, arguments);
        };
      });
      function wrapDescribeInZone(describeBody) {
        return function() {
          return syncZone.run(describeBody, this, arguments);
        };
      }
      function wrapTestInZone(testBody) {
        return testBody && (testBody.length ? function(done) {
          return testProxyZone.run(testBody, this, [done]);
        } : function() {
          return testProxyZone.run(testBody, this);
        });
      }
      var QueueRunner = jasmine.QueueRunner;
      jasmine.QueueRunner = (function(_super) {
        __extends(ZoneQueueRunner, _super);
        function ZoneQueueRunner(attrs) {
          attrs.onComplete = (function(fn) {
            return function() {
              testProxyZone = null;
              ambientZone.scheduleMicroTask('jasmine.onComplete', fn);
            };
          })(attrs.onComplete);
          _super.call(this, attrs);
        }
        ZoneQueueRunner.prototype.execute = function() {
          var _this = this;
          if (Zone.current !== ambientZone)
            throw new Error('Unexpected Zone: ' + Zone.current.name);
          testProxyZone = ambientZone.fork(new ProxyZoneSpec());
          if (!Zone.currentTask) {
            Zone.current.scheduleMicroTask('jasmine.execute().forceTask', function() {
              return QueueRunner.prototype.execute.call(_this);
            });
          } else {
            _super.prototype.execute.call(this);
          }
        };
        return ZoneQueueRunner;
      }(QueueRunner));
    })();
    var AsyncTestZoneSpec = (function() {
      function AsyncTestZoneSpec(finishCallback, failCallback, namePrefix) {
        this._pendingMicroTasks = false;
        this._pendingMacroTasks = false;
        this._alreadyErrored = false;
        this.runZone = Zone.current;
        this._finishCallback = finishCallback;
        this._failCallback = failCallback;
        this.name = 'asyncTestZone for ' + namePrefix;
      }
      AsyncTestZoneSpec.prototype._finishCallbackIfDone = function() {
        var _this = this;
        if (!(this._pendingMicroTasks || this._pendingMacroTasks)) {
          this.runZone.run(function() {
            setTimeout(function() {
              if (!_this._alreadyErrored && !(_this._pendingMicroTasks || _this._pendingMacroTasks)) {
                _this._finishCallback();
              }
            }, 0);
          });
        }
      };
      AsyncTestZoneSpec.prototype.onInvoke = function(parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) {
        try {
          return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
        } finally {
          this._finishCallbackIfDone();
        }
      };
      AsyncTestZoneSpec.prototype.onHandleError = function(parentZoneDelegate, currentZone, targetZone, error) {
        var result = parentZoneDelegate.handleError(targetZone, error);
        if (result) {
          this._failCallback(error);
          this._alreadyErrored = true;
        }
        return false;
      };
      AsyncTestZoneSpec.prototype.onHasTask = function(delegate, current, target, hasTaskState) {
        delegate.hasTask(target, hasTaskState);
        if (hasTaskState.change == 'microTask') {
          this._pendingMicroTasks = hasTaskState.microTask;
          this._finishCallbackIfDone();
        } else if (hasTaskState.change == 'macroTask') {
          this._pendingMacroTasks = hasTaskState.macroTask;
          this._finishCallbackIfDone();
        }
      };
      return AsyncTestZoneSpec;
    }());
    Zone['AsyncTestZoneSpec'] = AsyncTestZoneSpec;
    (function(global) {
      var Scheduler = (function() {
        function Scheduler() {
          this.nextId = 0;
          this._schedulerQueue = [];
          this._currentTime = 0;
        }
        Scheduler.prototype.scheduleFunction = function(cb, delay, args, isPeriodic, isRequestAnimationFrame, id) {
          if (args === void 0) {
            args = [];
          }
          if (isPeriodic === void 0) {
            isPeriodic = false;
          }
          if (isRequestAnimationFrame === void 0) {
            isRequestAnimationFrame = false;
          }
          if (id === void 0) {
            id = -1;
          }
          var currentId = id < 0 ? this.nextId++ : id;
          var endTime = this._currentTime + delay;
          var newEntry = {
            endTime: endTime,
            id: currentId,
            func: cb,
            args: args,
            delay: delay,
            isPeriodic: isPeriodic,
            isRequestAnimationFrame: isRequestAnimationFrame
          };
          var i = 0;
          for (; i < this._schedulerQueue.length; i++) {
            var currentEntry = this._schedulerQueue[i];
            if (newEntry.endTime < currentEntry.endTime) {
              break;
            }
          }
          this._schedulerQueue.splice(i, 0, newEntry);
          return currentId;
        };
        Scheduler.prototype.removeScheduledFunctionWithId = function(id) {
          for (var i = 0; i < this._schedulerQueue.length; i++) {
            if (this._schedulerQueue[i].id == id) {
              this._schedulerQueue.splice(i, 1);
              break;
            }
          }
        };
        Scheduler.prototype.tick = function(millis, doTick) {
          if (millis === void 0) {
            millis = 0;
          }
          var finalTime = this._currentTime + millis;
          var lastCurrentTime = 0;
          if (this._schedulerQueue.length === 0 && doTick) {
            doTick(millis);
            return;
          }
          while (this._schedulerQueue.length > 0) {
            var current = this._schedulerQueue[0];
            if (finalTime < current.endTime) {
              break;
            } else {
              var current_1 = this._schedulerQueue.shift();
              lastCurrentTime = this._currentTime;
              this._currentTime = current_1.endTime;
              if (doTick) {
                doTick(this._currentTime - lastCurrentTime);
              }
              var retval = current_1.func.apply(global, current_1.args);
              if (!retval) {
                break;
              }
            }
          }
          this._currentTime = finalTime;
        };
        Scheduler.prototype.flush = function(limit, flushPeriodic, doTick) {
          if (limit === void 0) {
            limit = 20;
          }
          if (flushPeriodic === void 0) {
            flushPeriodic = false;
          }
          if (flushPeriodic) {
            return this.flushPeriodic(doTick);
          } else {
            return this.flushNonPeriodic(limit, doTick);
          }
        };
        Scheduler.prototype.flushPeriodic = function(doTick) {
          if (this._schedulerQueue.length === 0) {
            return 0;
          }
          var startTime = this._currentTime;
          var lastTask = this._schedulerQueue[this._schedulerQueue.length - 1];
          this.tick(lastTask.endTime - startTime, doTick);
          return this._currentTime - startTime;
        };
        Scheduler.prototype.flushNonPeriodic = function(limit, doTick) {
          var startTime = this._currentTime;
          var lastCurrentTime = 0;
          var count = 0;
          while (this._schedulerQueue.length > 0) {
            count++;
            if (count > limit) {
              throw new Error('flush failed after reaching the limit of ' + limit + ' tasks. Does your code use a polling timeout?');
            }
            if (this._schedulerQueue.filter(function(task) {
              return !task.isPeriodic && !task.isRequestAnimationFrame;
            }).length === 0) {
              break;
            }
            var current = this._schedulerQueue.shift();
            lastCurrentTime = this._currentTime;
            this._currentTime = current.endTime;
            if (doTick) {
              doTick(this._currentTime - lastCurrentTime);
            }
            var retval = current.func.apply(global, current.args);
            if (!retval) {
              break;
            }
          }
          return this._currentTime - startTime;
        };
        return Scheduler;
      }());
      var FakeAsyncTestZoneSpec = (function() {
        function FakeAsyncTestZoneSpec(namePrefix, trackPendingRequestAnimationFrame, macroTaskOptions) {
          if (trackPendingRequestAnimationFrame === void 0) {
            trackPendingRequestAnimationFrame = false;
          }
          this.trackPendingRequestAnimationFrame = trackPendingRequestAnimationFrame;
          this.macroTaskOptions = macroTaskOptions;
          this._scheduler = new Scheduler();
          this._microtasks = [];
          this._lastError = null;
          this._uncaughtPromiseErrors = Promise[Zone.__symbol__('uncaughtPromiseErrors')];
          this.pendingPeriodicTimers = [];
          this.pendingTimers = [];
          this.properties = {'FakeAsyncTestZoneSpec': this};
          this.name = 'fakeAsyncTestZone for ' + namePrefix;
          if (!this.macroTaskOptions) {
            this.macroTaskOptions = global[Zone.__symbol__('FakeAsyncTestMacroTask')];
          }
        }
        FakeAsyncTestZoneSpec.assertInZone = function() {
          if (Zone.current.get('FakeAsyncTestZoneSpec') == null) {
            throw new Error('The code should be running in the fakeAsync zone to call this function');
          }
        };
        FakeAsyncTestZoneSpec.prototype._fnAndFlush = function(fn, completers) {
          var _this = this;
          return function() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            fn.apply(global, args);
            if (_this._lastError === null) {
              if (completers.onSuccess != null) {
                completers.onSuccess.apply(global);
              }
              _this.flushMicrotasks();
            } else {
              if (completers.onError != null) {
                completers.onError.apply(global);
              }
            }
            return _this._lastError === null;
          };
        };
        FakeAsyncTestZoneSpec._removeTimer = function(timers, id) {
          var index = timers.indexOf(id);
          if (index > -1) {
            timers.splice(index, 1);
          }
        };
        FakeAsyncTestZoneSpec.prototype._dequeueTimer = function(id) {
          var _this = this;
          return function() {
            FakeAsyncTestZoneSpec._removeTimer(_this.pendingTimers, id);
          };
        };
        FakeAsyncTestZoneSpec.prototype._requeuePeriodicTimer = function(fn, interval, args, id) {
          var _this = this;
          return function() {
            if (_this.pendingPeriodicTimers.indexOf(id) !== -1) {
              _this._scheduler.scheduleFunction(fn, interval, args, true, false, id);
            }
          };
        };
        FakeAsyncTestZoneSpec.prototype._dequeuePeriodicTimer = function(id) {
          var _this = this;
          return function() {
            FakeAsyncTestZoneSpec._removeTimer(_this.pendingPeriodicTimers, id);
          };
        };
        FakeAsyncTestZoneSpec.prototype._setTimeout = function(fn, delay, args, isTimer) {
          if (isTimer === void 0) {
            isTimer = true;
          }
          var removeTimerFn = this._dequeueTimer(this._scheduler.nextId);
          var cb = this._fnAndFlush(fn, {
            onSuccess: removeTimerFn,
            onError: removeTimerFn
          });
          var id = this._scheduler.scheduleFunction(cb, delay, args, false, !isTimer);
          if (isTimer) {
            this.pendingTimers.push(id);
          }
          return id;
        };
        FakeAsyncTestZoneSpec.prototype._clearTimeout = function(id) {
          FakeAsyncTestZoneSpec._removeTimer(this.pendingTimers, id);
          this._scheduler.removeScheduledFunctionWithId(id);
        };
        FakeAsyncTestZoneSpec.prototype._setInterval = function(fn, interval) {
          var args = [];
          for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
          }
          var id = this._scheduler.nextId;
          var completers = {
            onSuccess: null,
            onError: this._dequeuePeriodicTimer(id)
          };
          var cb = this._fnAndFlush(fn, completers);
          completers.onSuccess = this._requeuePeriodicTimer(cb, interval, args, id);
          this._scheduler.scheduleFunction(cb, interval, args, true);
          this.pendingPeriodicTimers.push(id);
          return id;
        };
        FakeAsyncTestZoneSpec.prototype._clearInterval = function(id) {
          FakeAsyncTestZoneSpec._removeTimer(this.pendingPeriodicTimers, id);
          this._scheduler.removeScheduledFunctionWithId(id);
        };
        FakeAsyncTestZoneSpec.prototype._resetLastErrorAndThrow = function() {
          var error = this._lastError || this._uncaughtPromiseErrors[0];
          this._uncaughtPromiseErrors.length = 0;
          this._lastError = null;
          throw error;
        };
        FakeAsyncTestZoneSpec.prototype.tick = function(millis, doTick) {
          if (millis === void 0) {
            millis = 0;
          }
          FakeAsyncTestZoneSpec.assertInZone();
          this.flushMicrotasks();
          this._scheduler.tick(millis, doTick);
          if (this._lastError !== null) {
            this._resetLastErrorAndThrow();
          }
        };
        FakeAsyncTestZoneSpec.prototype.flushMicrotasks = function() {
          var _this = this;
          FakeAsyncTestZoneSpec.assertInZone();
          var flushErrors = function() {
            if (_this._lastError !== null || _this._uncaughtPromiseErrors.length) {
              _this._resetLastErrorAndThrow();
            }
          };
          while (this._microtasks.length > 0) {
            var microtask = this._microtasks.shift();
            microtask.func.apply(microtask.target, microtask.args);
          }
          flushErrors();
        };
        FakeAsyncTestZoneSpec.prototype.flush = function(limit, flushPeriodic, doTick) {
          FakeAsyncTestZoneSpec.assertInZone();
          this.flushMicrotasks();
          var elapsed = this._scheduler.flush(limit, flushPeriodic, doTick);
          if (this._lastError !== null) {
            this._resetLastErrorAndThrow();
          }
          return elapsed;
        };
        FakeAsyncTestZoneSpec.prototype.onScheduleTask = function(delegate, current, target, task) {
          switch (task.type) {
            case 'microTask':
              var args = task.data && task.data.args;
              var additionalArgs = void 0;
              if (args) {
                var callbackIndex = task.data.cbIdx;
                if (typeof args.length === 'number' && args.length > callbackIndex + 1) {
                  additionalArgs = Array.prototype.slice.call(args, callbackIndex + 1);
                }
              }
              this._microtasks.push({
                func: task.invoke,
                args: additionalArgs,
                target: task.data && task.data.target
              });
              break;
            case 'macroTask':
              switch (task.source) {
                case 'setTimeout':
                  task.data['handleId'] = this._setTimeout(task.invoke, task.data['delay'], task.data['args']);
                  break;
                case 'setInterval':
                  task.data['handleId'] = this._setInterval(task.invoke, task.data['delay'], task.data['args']);
                  break;
                case 'XMLHttpRequest.send':
                  throw new Error('Cannot make XHRs from within a fake async test. Request URL: ' + task.data['url']);
                case 'requestAnimationFrame':
                case 'webkitRequestAnimationFrame':
                case 'mozRequestAnimationFrame':
                  task.data['handleId'] = this._setTimeout(task.invoke, 16, task.data['args'], this.trackPendingRequestAnimationFrame);
                  break;
                default:
                  var macroTaskOption = this.findMacroTaskOption(task);
                  if (macroTaskOption) {
                    var args_1 = task.data && task.data['args'];
                    var delay = args_1 && args_1.length > 1 ? args_1[1] : 0;
                    var callbackArgs = macroTaskOption.callbackArgs ? macroTaskOption.callbackArgs : args_1;
                    if (!!macroTaskOption.isPeriodic) {
                      task.data['handleId'] = this._setInterval(task.invoke, delay, callbackArgs);
                      task.data.isPeriodic = true;
                    } else {
                      task.data['handleId'] = this._setTimeout(task.invoke, delay, callbackArgs);
                    }
                    break;
                  }
                  throw new Error('Unknown macroTask scheduled in fake async test: ' + task.source);
              }
              break;
            case 'eventTask':
              task = delegate.scheduleTask(target, task);
              break;
          }
          return task;
        };
        FakeAsyncTestZoneSpec.prototype.onCancelTask = function(delegate, current, target, task) {
          switch (task.source) {
            case 'setTimeout':
            case 'requestAnimationFrame':
            case 'webkitRequestAnimationFrame':
            case 'mozRequestAnimationFrame':
              return this._clearTimeout(task.data['handleId']);
            case 'setInterval':
              return this._clearInterval(task.data['handleId']);
            default:
              var macroTaskOption = this.findMacroTaskOption(task);
              if (macroTaskOption) {
                var handleId = task.data['handleId'];
                return macroTaskOption.isPeriodic ? this._clearInterval(handleId) : this._clearTimeout(handleId);
              }
              return delegate.cancelTask(target, task);
          }
        };
        FakeAsyncTestZoneSpec.prototype.findMacroTaskOption = function(task) {
          if (!this.macroTaskOptions) {
            return null;
          }
          for (var i = 0; i < this.macroTaskOptions.length; i++) {
            var macroTaskOption = this.macroTaskOptions[i];
            if (macroTaskOption.source === task.source) {
              return macroTaskOption;
            }
          }
          return null;
        };
        FakeAsyncTestZoneSpec.prototype.onHandleError = function(parentZoneDelegate, currentZone, targetZone, error) {
          this._lastError = error;
          return false;
        };
        return FakeAsyncTestZoneSpec;
      }());
      Zone['FakeAsyncTestZoneSpec'] = FakeAsyncTestZoneSpec;
    })(typeof window === 'object' && window || typeof self === 'object' && self || global);
  })));
})(require('process'));
