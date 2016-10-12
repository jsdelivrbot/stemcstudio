System.register(['./Node'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Node_1;
    var ParentNode;
    return {
        setters:[
            function (Node_1_1) {
                Node_1 = Node_1_1;
            }],
        execute: function() {
            ParentNode = (function (_super) {
                __extends(ParentNode, _super);
                function ParentNode(locator) {
                    _super.call(this, locator);
                    this.lastChild = null;
                    this._endLocator = null;
                }
                ParentNode.prototype.insertBefore = function (child, sibling) {
                    if (!sibling) {
                        return this.appendChild(child);
                    }
                    child.detach();
                    child.parentNode = this;
                    if (this.firstChild == sibling) {
                        child.nextSibling = sibling;
                        this.firstChild = child;
                    }
                    else {
                        var prev = this.firstChild;
                        var next = this.firstChild.nextSibling;
                        while (next != sibling) {
                            prev = next;
                            next = next.nextSibling;
                        }
                        prev.nextSibling = child;
                        child.nextSibling = next;
                    }
                    return child;
                };
                ParentNode.prototype.insertBetween = function (child, prev, next) {
                    if (!next) {
                        return this.appendChild(child);
                    }
                    child.detach();
                    child.parentNode = this;
                    child.nextSibling = next;
                    if (!prev) {
                        this.firstChild = child;
                    }
                    else {
                        prev.nextSibling = child;
                    }
                    return child;
                };
                ParentNode.prototype.appendChild = function (child) {
                    child.detach();
                    child.parentNode = this;
                    if (!this.firstChild) {
                        this.firstChild = child;
                    }
                    else {
                        this.lastChild.nextSibling = child;
                    }
                    this.lastChild = child;
                    return child;
                };
                ParentNode.prototype.appendChildren = function (parent) {
                    var child = parent.firstChild;
                    if (!child) {
                        return;
                    }
                    var another = parent;
                    if (!this.firstChild) {
                        this.firstChild = child;
                    }
                    else {
                        this.lastChild.nextSibling = child;
                    }
                    this.lastChild = another.lastChild;
                    do {
                        child.parentNode = this;
                    } while ((child = child.nextSibling));
                    another.firstChild = null;
                    another.lastChild = null;
                };
                ParentNode.prototype.removeChild = function (node) {
                    if (this.firstChild == node) {
                        this.firstChild = node.nextSibling;
                        if (this.lastChild == node) {
                            this.lastChild = null;
                        }
                    }
                    else {
                        var prev = this.firstChild;
                        var next = this.firstChild.nextSibling;
                        while (next != node) {
                            prev = next;
                            next = next.nextSibling;
                        }
                        prev.nextSibling = node.nextSibling;
                        if (this.lastChild == node) {
                            this.lastChild = prev;
                        }
                    }
                    node.parentNode = null;
                    return node;
                };
                Object.defineProperty(ParentNode.prototype, "endLocator", {
                    get: function () {
                        return this._endLocator;
                    },
                    set: function (endLocator) {
                        this._endLocator = {
                            lineNumber: endLocator.lineNumber,
                            columnNumber: endLocator.columnNumber
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                return ParentNode;
            }(Node_1.default));
            exports_1("default", ParentNode);
        }
    }
});
