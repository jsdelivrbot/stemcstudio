System.register(["../utils", "./ruleWalker"], function (exports_1, context_1) {
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
    var utils_1, ruleWalker_1, ScopeAwareRuleWalker;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (ruleWalker_1_1) {
                ruleWalker_1 = ruleWalker_1_1;
            }
        ],
        execute: function () {
            ScopeAwareRuleWalker = (function (_super) {
                __extends(ScopeAwareRuleWalker, _super);
                function ScopeAwareRuleWalker(sourceFile, options) {
                    var _this = _super.call(this, sourceFile, options) || this;
                    _this.scopeStack = ts.isExternalModule(sourceFile) ? [] : [_this.createScope(sourceFile)];
                    return _this;
                }
                ScopeAwareRuleWalker.prototype.getCurrentScope = function () {
                    return this.scopeStack[this.scopeStack.length - 1];
                };
                ScopeAwareRuleWalker.prototype.getAllScopes = function () {
                    return this.scopeStack;
                };
                ScopeAwareRuleWalker.prototype.getCurrentDepth = function () {
                    return this.scopeStack.length;
                };
                ScopeAwareRuleWalker.prototype.onScopeStart = function () {
                    return;
                };
                ScopeAwareRuleWalker.prototype.onScopeEnd = function () {
                    return;
                };
                ScopeAwareRuleWalker.prototype.visitNode = function (node) {
                    var isNewScope = this.isScopeBoundary(node);
                    if (isNewScope) {
                        this.scopeStack.push(this.createScope(node));
                        this.onScopeStart();
                    }
                    _super.prototype.visitNode.call(this, node);
                    if (isNewScope) {
                        this.onScopeEnd();
                        this.scopeStack.pop();
                    }
                };
                ScopeAwareRuleWalker.prototype.isScopeBoundary = function (node) {
                    return utils_1.isScopeBoundary(node);
                };
                return ScopeAwareRuleWalker;
            }(ruleWalker_1.RuleWalker));
            exports_1("ScopeAwareRuleWalker", ScopeAwareRuleWalker);
        }
    };
});
