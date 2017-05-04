/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : (factory());
  }(this, (function() {
    'use strict';
    Zone.__load_patch('Error', function(global, Zone, api) {
      var blacklistedStackFramesSymbol = api.symbol('blacklistedStackFrames');
      var NativeError = global[api.symbol('Error')] = global['Error'];
      var blackListedStackFrames = {};
      var zoneAwareFrame1;
      var zoneAwareFrame2;
      global['Error'] = ZoneAwareError;
      var stackRewrite = 'stackRewrite';
      function ZoneAwareError() {
        var _this = this;
        var error = NativeError.apply(this, arguments);
        var originalStack = error['originalStack'] = error.stack;
        if (ZoneAwareError[stackRewrite] && originalStack) {
          var frames_1 = originalStack.split('\n');
          var zoneFrame = api.currentZoneFrame();
          var i = 0;
          while (!(frames_1[i] === zoneAwareFrame1 || frames_1[i] === zoneAwareFrame2) && i < frames_1.length) {
            i++;
          }
          for (; i < frames_1.length && zoneFrame; i++) {
            var frame = frames_1[i];
            if (frame.trim()) {
              switch (blackListedStackFrames[frame]) {
                case 0:
                  frames_1.splice(i, 1);
                  i--;
                  break;
                case 1:
                  if (zoneFrame.parent) {
                    zoneFrame = zoneFrame.parent;
                  } else {
                    zoneFrame = null;
                  }
                  frames_1.splice(i, 1);
                  i--;
                  break;
                default:
                  frames_1[i] += " [" + zoneFrame.zone.name + "]";
              }
            }
          }
          try {
            error.stack = error.zoneAwareStack = frames_1.join('\n');
          } catch (e) {}
        }
        if (this instanceof NativeError && this.constructor != NativeError) {
          Object.keys(error).concat('stack', 'message').forEach(function(key) {
            if (error[key] !== undefined) {
              try {
                _this[key] = error[key];
              } catch (e) {}
            }
          });
          return this;
        }
        return error;
      }
      ZoneAwareError.prototype = NativeError.prototype;
      ZoneAwareError[blacklistedStackFramesSymbol] = blackListedStackFrames;
      ZoneAwareError[stackRewrite] = false;
      var specialPropertyNames = ['stackTraceLimit', 'captureStackTrace', 'prepareStackTrace'];
      var nativeErrorProperties = Object.keys(NativeError);
      if (nativeErrorProperties) {
        nativeErrorProperties.forEach(function(prop) {
          if (specialPropertyNames.filter(function(sp) {
            return sp === prop;
          }).length === 0) {
            Object.defineProperty(ZoneAwareError, prop, {
              get: function() {
                return NativeError[prop];
              },
              set: function(value) {
                NativeError[prop] = value;
              }
            });
          }
        });
      }
      if (NativeError.hasOwnProperty('stackTraceLimit')) {
        NativeError.stackTraceLimit = Math.max(NativeError.stackTraceLimit, 15);
        Object.defineProperty(ZoneAwareError, 'stackTraceLimit', {
          get: function() {
            return NativeError.stackTraceLimit;
          },
          set: function(value) {
            return NativeError.stackTraceLimit = value;
          }
        });
      }
      if (NativeError.hasOwnProperty('captureStackTrace')) {
        Object.defineProperty(ZoneAwareError, 'captureStackTrace', {value: function zoneCaptureStackTrace(targetObject, constructorOpt) {
            NativeError.captureStackTrace(targetObject, constructorOpt);
          }});
      }
      Object.defineProperty(ZoneAwareError, 'prepareStackTrace', {
        get: function() {
          return NativeError.prepareStackTrace;
        },
        set: function(value) {
          if (!value || typeof value !== 'function') {
            return NativeError.prepareStackTrace = value;
          }
          return NativeError.prepareStackTrace = function(error, structuredStackTrace) {
            if (structuredStackTrace) {
              for (var i = 0; i < structuredStackTrace.length; i++) {
                var st = structuredStackTrace[i];
                if (st.getFunctionName() === 'zoneCaptureStackTrace') {
                  structuredStackTrace.splice(i, 1);
                  break;
                }
              }
            }
            return value.apply(this, [error, structuredStackTrace]);
          };
        }
      });
      var detectZone = Zone.current.fork({
        name: 'detect',
        onHandleError: function(parentZD, current, target, error) {
          if (error.originalStack && Error === ZoneAwareError) {
            var frames_2 = error.originalStack.split(/\n/);
            var runFrame = false,
                runGuardedFrame = false,
                runTaskFrame = false;
            while (frames_2.length) {
              var frame = frames_2.shift();
              if (/:\d+:\d+/.test(frame)) {
                var fnName = frame.split('(')[0].split('@')[0];
                var frameType = 1;
                if (fnName.indexOf('ZoneAwareError') !== -1) {
                  zoneAwareFrame1 = frame;
                  zoneAwareFrame2 = frame.replace('Error.', '');
                  blackListedStackFrames[zoneAwareFrame2] = 0;
                }
                if (fnName.indexOf('runGuarded') !== -1) {
                  runGuardedFrame = true;
                } else if (fnName.indexOf('runTask') !== -1) {
                  runTaskFrame = true;
                } else if (fnName.indexOf('run') !== -1) {
                  runFrame = true;
                } else {
                  frameType = 0;
                }
                blackListedStackFrames[frame] = frameType;
                if (runFrame && runGuardedFrame && runTaskFrame) {
                  ZoneAwareError[stackRewrite] = true;
                  break;
                }
              }
            }
          }
          return false;
        }
      });
      var childDetectZone = detectZone.fork({
        name: 'child',
        onScheduleTask: function(delegate, curr, target, task) {
          return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function(delegate, curr, target, task, applyThis, applyArgs) {
          return delegate.invokeTask(target, task, applyThis, applyArgs);
        },
        onCancelTask: function(delegate, curr, target, task) {
          return delegate.cancelTask(target, task);
        },
        onInvoke: function(delegate, curr, target, callback, applyThis, applyArgs, source) {
          return delegate.invoke(target, callback, applyThis, applyArgs, source);
        }
      });
      var originalStackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 100;
      childDetectZone.run(function() {
        childDetectZone.runGuarded(function() {
          var fakeTransitionTo = function(toState, fromState1, fromState2) {};
          childDetectZone.scheduleEventTask(blacklistedStackFramesSymbol, function() {
            childDetectZone.scheduleMacroTask(blacklistedStackFramesSymbol, function() {
              childDetectZone.scheduleMicroTask(blacklistedStackFramesSymbol, function() {
                throw new ZoneAwareError(ZoneAwareError, NativeError);
              }, null, function(t) {
                t._transitionTo = fakeTransitionTo;
                t.invoke();
              });
            }, null, function(t) {
              t._transitionTo = fakeTransitionTo;
              t.invoke();
            }, function() {});
          }, null, function(t) {
            t._transitionTo = fakeTransitionTo;
            t.invoke();
          }, function() {});
        });
      });
      Error.stackTraceLimit = originalStackTraceLimit;
    });
  })));
})(require('process'));
