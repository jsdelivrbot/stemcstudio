System.register([], function(exports_1) {
    "use strict";
    var NameStack;
    return {
        setters:[],
        execute: function() {
            NameStack = (function () {
                function NameStack() {
                    this.pop = function () {
                        this._stack.pop();
                    };
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
                NameStack.prototype.set = function (token) {
                    this._stack[this.length - 1] = token;
                };
                NameStack.prototype.infer = function () {
                    var nameToken = this._stack[this.length - 1];
                    var prefix = "";
                    var type;
                    if (!nameToken || nameToken.type === "class") {
                        nameToken = this._stack[this.length - 2];
                    }
                    if (!nameToken) {
                        return "(empty)";
                    }
                    type = nameToken.type;
                    if (type !== "(string)" && type !== "(number)" && type !== "(identifier)" && type !== "default") {
                        return "(expression)";
                    }
                    if (nameToken.accessorType) {
                        prefix = nameToken.accessorType + " ";
                    }
                    return prefix + nameToken.value;
                };
                return NameStack;
            })();
            exports_1("default", NameStack);
        }
    }
});
