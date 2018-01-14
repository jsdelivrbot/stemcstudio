/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : (factory());
  }(this, (function() {
    'use strict';
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
    var error = getStacktraceWithUncaughtError();
    var caughtError = getStacktraceWithCaughtError();
    var getStacktrace = error.stack ? getStacktraceWithUncaughtError : (caughtError.stack ? getStacktraceWithCaughtError : getStacktraceWithUncaughtError);
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
