System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var NameStack;
    return {
        setters: [],
        execute: function () {
            NameStack = (function () {
                function NameStack() {
                    this._stack = [];
                }
                Object.defineProperty(NameStack.prototype, "length", {
                    get: function () {
                        return this._stack.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                NameStack.prototype.push = function () {
                    this._stack.push(null);
                };
                NameStack.prototype.pop = function () {
                    this._stack.pop();
                };
                NameStack.prototype.set = function (token) {
                    this._stack[this.length - 1] = token;
                };
                NameStack.prototype.infer = function () {
                    var nameToken = this._stack[this.length - 1];
                    if (!nameToken || nameToken.type === "class") {
                        nameToken = this._stack[this.length - 2];
                    }
                    if (!nameToken) {
                        return "(empty)";
                    }
                    var type = nameToken.type;
                    if (type !== "(string)" && type !== "(number)" && type !== "(identifier)" && type !== "default") {
                        return "(expression)";
                    }
                    var prefix = "";
                    if (nameToken.accessorType) {
                        prefix = nameToken.accessorType + " ";
                    }
                    return prefix + nameToken.value;
                };
                return NameStack;
            }());
            exports_1("NameStack", NameStack);
        }
    };
});
