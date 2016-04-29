define(["require", "exports"], function (require, exports) {
    "use strict";
    var Behaviour = (function () {
        function Behaviour() {
            this.$behaviours = {};
        }
        Behaviour.prototype.add = function (name, action, callback) {
            switch (undefined) {
                case this.$behaviours:
                    this.$behaviours = {};
                case this.$behaviours[name]:
                    this.$behaviours[name] = {};
            }
            this.$behaviours[name][action] = callback;
        };
        Behaviour.prototype.addBehaviours = function (behaviours) {
            for (var key in behaviours) {
                for (var action in behaviours[key]) {
                    this.add(key, action, behaviours[key][action]);
                }
            }
        };
        Behaviour.prototype.remove = function (name) {
            if (this.$behaviours && this.$behaviours[name]) {
                delete this.$behaviours[name];
            }
        };
        Behaviour.prototype.inherit = function (base, filter) {
            var behaviours = base.getBehaviours(filter);
            this.addBehaviours(behaviours);
        };
        Behaviour.prototype.getBehaviours = function (filter) {
            if (!filter) {
                return this.$behaviours;
            }
            else {
                var ret = {};
                for (var i = 0; i < filter.length; i++) {
                    if (this.$behaviours[filter[i]]) {
                        ret[filter[i]] = this.$behaviours[filter[i]];
                    }
                }
                return ret;
            }
        };
        return Behaviour;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Behaviour;
});
