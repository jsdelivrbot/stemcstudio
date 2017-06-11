System.register([], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    function isError(possibleError) {
        return possibleError != null && possibleError.message !== undefined;
    }
    exports_1("isError", isError);
    function showWarningOnce(message) {
        if (!shownWarnings.has(message)) {
            console.warn(message);
            shownWarnings.add(message);
        }
    }
    exports_1("showWarningOnce", showWarningOnce);
    var shownWarnings, FatalError;
    return {
        setters: [],
        execute: function () {
            shownWarnings = new Set();
            FatalError = (function (_super) {
                __extends(FatalError, _super);
                function FatalError(message, innerError) {
                    var _this = _super.call(this, message) || this;
                    _this.message = message;
                    _this.innerError = innerError;
                    _this.name = FatalError.NAME;
                    _this.stack = new Error().stack;
                    return _this;
                }
                return FatalError;
            }(Error));
            FatalError.NAME = "FatalError";
            exports_1("FatalError", FatalError);
        }
    };
});
