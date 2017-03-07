System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var DefaultNodeEventHandler;
    return {
        setters: [],
        execute: function () {
            DefaultNodeEventHandler = (function () {
                function DefaultNodeEventHandler() {
                }
                DefaultNodeEventHandler.prototype.beginStatementList = function () {
                };
                DefaultNodeEventHandler.prototype.endStatementList = function () {
                };
                DefaultNodeEventHandler.prototype.beginStatement = function () {
                };
                DefaultNodeEventHandler.prototype.endStatement = function () {
                };
                DefaultNodeEventHandler.prototype.beginDeclaration = function () {
                };
                DefaultNodeEventHandler.prototype.endDeclaration = function () {
                };
                DefaultNodeEventHandler.prototype.declaration = function (kind, modifiers, type, names) {
                };
                DefaultNodeEventHandler.prototype.beginDeclarationList = function () {
                };
                DefaultNodeEventHandler.prototype.endDeclarationList = function () {
                };
                DefaultNodeEventHandler.prototype.beginFunction = function () {
                };
                DefaultNodeEventHandler.prototype.endFunction = function () {
                };
                DefaultNodeEventHandler.prototype.beginFunctionArgs = function () {
                };
                DefaultNodeEventHandler.prototype.endFunctionArgs = function () {
                };
                DefaultNodeEventHandler.prototype.beginExpression = function () {
                };
                DefaultNodeEventHandler.prototype.endExpression = function () {
                };
                DefaultNodeEventHandler.prototype.beginAssign = function () {
                };
                DefaultNodeEventHandler.prototype.endAssign = function () {
                };
                DefaultNodeEventHandler.prototype.identifier = function (name) {
                };
                DefaultNodeEventHandler.prototype.keyword = function (word) {
                };
                DefaultNodeEventHandler.prototype.builtin = function (name) {
                };
                return DefaultNodeEventHandler;
            }());
            exports_1("default", DefaultNodeEventHandler);
        }
    };
});
