System.register(["../worker/Mirror"], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Mirror_1;
    var ExampleWorker;
    return {
        setters:[
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            }],
        execute: function() {
            ExampleWorker = (function (_super) {
                __extends(ExampleWorker, _super);
                function ExampleWorker(host) {
                    _super.call(this, host, 500);
                    this.setOptions();
                }
                ExampleWorker.prototype.setOptions = function (options) {
                    this.doc.getValue() && this.deferredUpdate.schedule(100);
                };
                ExampleWorker.prototype.changeOptions = function (options) {
                    this.doc.getValue() && this.deferredUpdate.schedule(100);
                };
                ExampleWorker.prototype.onUpdate = function () {
                    var value = this.doc.getValue();
                    var annotations = [];
                    this.emitAnnotations(annotations);
                };
                return ExampleWorker;
            })(Mirror_1.default);
            exports_1("default", ExampleWorker);
        }
    }
});
