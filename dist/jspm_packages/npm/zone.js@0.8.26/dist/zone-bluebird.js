/* */ 
"format cjs";
/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('bluebird', function (global, Zone, api) {
    // TODO: @JiaLiPassion, we can automatically patch bluebird
    // if global.Promise = Bluebird, but sometimes in nodejs,
    // global.Promise is not Bluebird, and Bluebird is just be
    // used by other libraries such as sequelize, so I think it is
    // safe to just expose a method to patch Bluebird explicitly
    var BLUEBIRD = 'bluebird';
    Zone[Zone.__symbol__(BLUEBIRD)] = function patchBluebird(Bluebird) {
        // patch method of Bluebird.prototype which not using `then` internally
        var bluebirdApis = ['then', 'spread', 'finally'];
        bluebirdApis.forEach(function (bapi) {
            api.patchMethod(Bluebird.prototype, bapi, function (delegate) { return function (self, args) {
                var zone = Zone.current;
                var _loop_1 = function (i) {
                    var func = args[i];
                    if (typeof func === 'function') {
                        args[i] = function () {
                            var argSelf = this;
                            var argArgs = arguments;
                            zone.scheduleMicroTask('Promise.then', function () {
                                return func.apply(argSelf, argArgs);
                            });
                        };
                    }
                };
                for (var i = 0; i < args.length; i++) {
                    _loop_1(i);
                }
                return delegate.apply(self, args);
            }; });
        });
        // override global promise
        global[api.symbol('ZoneAwarePromise')] = Bluebird;
    };
});

})));
