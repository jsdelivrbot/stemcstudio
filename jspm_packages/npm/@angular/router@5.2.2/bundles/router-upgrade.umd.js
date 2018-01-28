/* */ 
"format cjs";
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('./router.umd'), require('@angular/upgrade/static')) : typeof define === 'function' && define.amd ? define('@angular/router/upgrade', ['exports', '@angular/core', '@angular/router', '@angular/upgrade/static'], factory) : (factory((global.ng = global.ng || {}, global.ng.router = global.ng.router || {}, global.ng.router.upgrade = {}), global.ng.core, global.ng.router, global.ng.upgrade.static));
}(this, (function(exports, _angular_core, _angular_router, _angular_upgrade_static) {
  'use strict';
  var RouterUpgradeInitializer = {
    provide: _angular_core.APP_BOOTSTRAP_LISTENER,
    multi: true,
    useFactory: locationSyncBootstrapListener,
    deps: [_angular_upgrade_static.UpgradeModule]
  };
  function locationSyncBootstrapListener(ngUpgrade) {
    return function() {
      setUpLocationSync(ngUpgrade);
    };
  }
  function setUpLocationSync(ngUpgrade) {
    if (!ngUpgrade.$injector) {
      throw new Error("\n        RouterUpgradeInitializer can be used only after UpgradeModule.bootstrap has been called.\n        Remove RouterUpgradeInitializer and call setUpLocationSync after UpgradeModule.bootstrap.\n      ");
    }
    var router = ngUpgrade.injector.get(_angular_router.Router);
    var url = document.createElement('a');
    ngUpgrade.$injector.get('$rootScope').$on('$locationChangeStart', function(_, next, __) {
      url.href = next;
      router.navigateByUrl(url.pathname + url.search + url.hash);
    });
  }
  exports.RouterUpgradeInitializer = RouterUpgradeInitializer;
  exports.locationSyncBootstrapListener = locationSyncBootstrapListener;
  exports.setUpLocationSync = setUpLocationSync;
  Object.defineProperty(exports, '__esModule', {value: true});
})));
