System.register([], function(exports_1) {
    var Node;
    return {
        setters:[],
        execute: function() {
            Node = (function () {
                function Node(locator) {
                    this.attributes = [];
                    if (!locator) {
                        this.columnNumber = -1;
                        this.lineNumber = -1;
                    }
                    else {
                        this.columnNumber = locator.columnNumber;
                        this.lineNumber = locator.lineNumber;
                    }
                    this.parentNode = null;
                    this.nextSibling = null;
                    this.firstChild = null;
                }
                Node.prototype.visit = function (treeParser) {
                    throw new Error("Not Implemented");
                };
                Node.prototype.revisit = function (treeParser) {
                    return;
                };
                Node.prototype.detach = function () {
                    if (this.parentNode !== null) {
                        this.parentNode.removeChild(this);
                        this.parentNode = null;
                    }
                };
                Object.defineProperty(Node.prototype, "previousSibling", {
                    get: function () {
                        var prev = null;
                        var next = this.parentNode.firstChild;
                        for (;;) {
                            if (this == next) {
                                return prev;
                            }
                            prev = next;
                            next = next.nextSibling;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                return Node;
            })();
            exports_1("default", Node);
        }
    }
});
