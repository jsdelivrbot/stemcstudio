System.register(["./walkContext"], function (exports_1, context_1) {
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
    var walkContext_1, AbstractWalker;
    return {
        setters: [
            function (walkContext_1_1) {
                walkContext_1 = walkContext_1_1;
            }
        ],
        execute: function () {
            AbstractWalker = (function (_super) {
                __extends(AbstractWalker, _super);
                function AbstractWalker() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                AbstractWalker.prototype.getSourceFile = function () {
                    return this.sourceFile;
                };
                AbstractWalker.prototype.getFailures = function () {
                    return this.failures;
                };
                return AbstractWalker;
            }(walkContext_1.WalkContext));
            exports_1("AbstractWalker", AbstractWalker);
        }
    };
});
