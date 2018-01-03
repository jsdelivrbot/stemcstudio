/* */ 
"format cjs";
(function(process) {
  (function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory() : typeof define === 'function' && define.amd ? define(factory) : (factory());
  }(this, (function() {
    'use strict';
    Zone.__load_patch('electron', function(global, Zone, api) {
      var FUNCTION = 'function';
      var _a = require('electron'),
          desktopCapturer = _a.desktopCapturer,
          shell = _a.shell,
          CallbackRegistry = _a.CallbackRegistry;
      if (desktopCapturer) {
        api.patchArguments(desktopCapturer, 'getSources', 'electron.desktopCapturer.getSources');
      }
      if (shell) {
        api.patchArguments(shell, 'openExternal', 'electron.shell.openExternal');
      }
      if (!CallbackRegistry) {
        return;
      }
      api.patchArguments(CallbackRegistry.prototype, 'add', 'CallbackRegistry.add');
    });
  })));
})(require('process'));
