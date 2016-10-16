System.register(["../worker/Mirror"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Mirror_1;
    var CssWorker;
    return {
        setters:[
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            }],
        execute: function() {
            CssWorker = (function (_super) {
                __extends(CssWorker, _super);
                function CssWorker(host) {
                    _super.call(this, host, 500);
                    this.setOptions();
                }
                CssWorker.prototype.setOptions = function (options) {
                    this.doc.getValue() && this.deferredUpdate.schedule(100);
                };
                CssWorker.prototype.onUpdate = function () {
                    var value = this.doc.getValue();
                    var annotations = [];
                    this.emitAnnotations(annotations);
                };
                return CssWorker;
            }(Mirror_1.default));
            exports_1("default", CssWorker);
        }
    }
});
