/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : (factory());
  }(this, (function() {
    'use strict';
    Zone.__load_patch('electron', function(global, Zone, api) {
      function patchArguments(target, name, source) {
        return api.patchMethod(target, name, function(delegate) {
          return function(self, args) {
            return delegate && delegate.apply(self, api.bindArguments(args, source));
          };
        });
      }
      var _a = require('electron'),
          desktopCapturer = _a.desktopCapturer,
          shell = _a.shell,
          CallbacksRegistry = _a.CallbacksRegistry;
      if (desktopCapturer) {
        patchArguments(desktopCapturer, 'getSources', 'electron.desktopCapturer.getSources');
      }
      if (shell) {
        patchArguments(shell, 'openExternal', 'electron.shell.openExternal');
      }
      if (!CallbacksRegistry) {
        return;
      }
      patchArguments(CallbacksRegistry.prototype, 'add', 'CallbackRegistry.add');
    });
  })));
})(require('process'));
