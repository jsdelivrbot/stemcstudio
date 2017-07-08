/* */ 
"format cjs";
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('./platform-browser.umd')) : typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/platform-browser'], factory) : (factory((global.ng = global.ng || {}, global.ng.platformBrowser = global.ng.platformBrowser || {}, global.ng.platformBrowser.testing = global.ng.platformBrowser.testing || {}), global.ng.core, global.ng.platformBrowser));
}(this, (function(exports, _angular_core, _angular_platformBrowser) {
  'use strict';
  var browserDetection;
  var BrowserDetection = (function() {
    function BrowserDetection(ua) {
      this._overrideUa = ua;
    }
    Object.defineProperty(BrowserDetection.prototype, "_ua", {
      get: function() {
        if (typeof this._overrideUa === 'string') {
          return this._overrideUa;
        }
        return _angular_platformBrowser.ɵgetDOM() ? _angular_platformBrowser.ɵgetDOM().getUserAgent() : '';
      },
      enumerable: true,
      configurable: true
    });
    BrowserDetection.setup = function() {
      browserDetection = new BrowserDetection(null);
    };
    Object.defineProperty(BrowserDetection.prototype, "isFirefox", {
      get: function() {
        return this._ua.indexOf('Firefox') > -1;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isAndroid", {
      get: function() {
        return this._ua.indexOf('Mozilla/5.0') > -1 && this._ua.indexOf('Android') > -1 && this._ua.indexOf('AppleWebKit') > -1 && this._ua.indexOf('Chrome') == -1 && this._ua.indexOf('IEMobile') == -1;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isEdge", {
      get: function() {
        return this._ua.indexOf('Edge') > -1;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isIE", {
      get: function() {
        return this._ua.indexOf('Trident') > -1;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isWebkit", {
      get: function() {
        return this._ua.indexOf('AppleWebKit') > -1 && this._ua.indexOf('Edge') == -1 && this._ua.indexOf('IEMobile') == -1;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isIOS7", {
      get: function() {
        return (this._ua.indexOf('iPhone OS 7') > -1 || this._ua.indexOf('iPad OS 7') > -1) && this._ua.indexOf('IEMobile') == -1;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isSlow", {
      get: function() {
        return this.isAndroid || this.isIE || this.isIOS7;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "supportsNativeIntlApi", {
      get: function() {
        return !!_angular_core.ɵglobal.Intl && _angular_core.ɵglobal.Intl !== _angular_core.ɵglobal.IntlPolyfill;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isChromeDesktop", {
      get: function() {
        return this._ua.indexOf('Chrome') > -1 && this._ua.indexOf('Mobile Safari') == -1 && this._ua.indexOf('Edge') == -1;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BrowserDetection.prototype, "isOldChrome", {
      get: function() {
        return this._ua.indexOf('Chrome') > -1 && this._ua.indexOf('Chrome/3') > -1 && this._ua.indexOf('Edge') == -1;
      },
      enumerable: true,
      configurable: true
    });
    return BrowserDetection;
  }());
  BrowserDetection.setup();
  function createNgZone() {
    return new _angular_core.NgZone({enableLongStackTrace: true});
  }
  function initBrowserTests() {
    _angular_platformBrowser.ɵBrowserDomAdapter.makeCurrent();
    BrowserDetection.setup();
  }
  var _TEST_BROWSER_PLATFORM_PROVIDERS = [{
    provide: _angular_core.PLATFORM_INITIALIZER,
    useValue: initBrowserTests,
    multi: true
  }];
  var platformBrowserTesting = _angular_core.createPlatformFactory(_angular_core.platformCore, 'browserTesting', _TEST_BROWSER_PLATFORM_PROVIDERS);
  var BrowserTestingModule = (function() {
    function BrowserTestingModule() {}
    return BrowserTestingModule;
  }());
  BrowserTestingModule.decorators = [{
    type: _angular_core.NgModule,
    args: [{
      exports: [_angular_platformBrowser.BrowserModule],
      providers: [{
        provide: _angular_core.APP_ID,
        useValue: 'a'
      }, _angular_platformBrowser.ɵELEMENT_PROBE_PROVIDERS, {
        provide: _angular_core.NgZone,
        useFactory: createNgZone
      }]
    }]
  }];
  BrowserTestingModule.ctorParameters = function() {
    return [];
  };
  exports.platformBrowserTesting = platformBrowserTesting;
  exports.BrowserTestingModule = BrowserTestingModule;
  Object.defineProperty(exports, '__esModule', {value: true});
})));
