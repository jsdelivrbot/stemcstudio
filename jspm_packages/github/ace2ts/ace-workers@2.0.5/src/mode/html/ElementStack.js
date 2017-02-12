System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function isScopeMarker(node) {
        if (node.namespaceURI === "http://www.w3.org/1999/xhtml") {
            return node.localName === "applet"
                || node.localName === "caption"
                || node.localName === "marquee"
                || node.localName === "object"
                || node.localName === "table"
                || node.localName === "td"
                || node.localName === "th";
        }
        if (node.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
            return node.localName === "mi"
                || node.localName === "mo"
                || node.localName === "mn"
                || node.localName === "ms"
                || node.localName === "mtext"
                || node.localName === "annotation-xml";
        }
        if (node.namespaceURI === "http://www.w3.org/2000/svg") {
            return node.localName === "foreignObject"
                || node.localName === "desc"
                || node.localName === "title";
        }
    }
    function isListItemScopeMarker(node) {
        return isScopeMarker(node)
            || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'ol')
            || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'ul');
    }
    function isTableScopeMarker(node) {
        return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'table')
            || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
    }
    function isTableBodyScopeMarker(node) {
        return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tbody')
            || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tfoot')
            || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'thead')
            || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
    }
    function isTableRowScopeMarker(node) {
        return (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'tr')
            || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'html');
    }
    function isButtonScopeMarker(node) {
        return isScopeMarker(node)
            || (node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'button');
    }
    function isSelectScopeMarker(node) {
        return !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'optgroup')
            && !(node.namespaceURI === "http://www.w3.org/1999/xhtml" && node.localName === 'option');
    }
    var ElementStack;
    return {
        setters: [],
        execute: function () {
            ElementStack = (function () {
                function ElementStack() {
                    this.elements = [];
                    this.rootNode = null;
                    this.headElement = null;
                    this.bodyElement = null;
                }
                ElementStack.prototype._inScope = function (localName, isMarker) {
                    for (var i = this.elements.length - 1; i >= 0; i--) {
                        var node = this.elements[i];
                        if (node.localName === localName)
                            return true;
                        if (isMarker(node))
                            return false;
                    }
                };
                ElementStack.prototype.push = function (item) {
                    this.elements.push(item);
                };
                ElementStack.prototype.pushHtmlElement = function (item) {
                    this.rootNode = item.node;
                    this.push(item);
                };
                ElementStack.prototype.pushHeadElement = function (item) {
                    this.headElement = item.node;
                    this.push(item);
                };
                ElementStack.prototype.pushBodyElement = function (item) {
                    this.bodyElement = item.node;
                    this.push(item);
                };
                ElementStack.prototype.pop = function () {
                    return this.elements.pop();
                };
                ElementStack.prototype.remove = function (item) {
                    this.elements.splice(this.elements.indexOf(item), 1);
                };
                ElementStack.prototype.popUntilPopped = function (localName) {
                    var element;
                    do {
                        element = this.pop();
                    } while (element.localName != localName);
                };
                ElementStack.prototype.popUntilTableScopeMarker = function () {
                    while (!isTableScopeMarker(this.top))
                        this.pop();
                };
                ElementStack.prototype.popUntilTableBodyScopeMarker = function () {
                    while (!isTableBodyScopeMarker(this.top))
                        this.pop();
                };
                ElementStack.prototype.popUntilTableRowScopeMarker = function () {
                    while (!isTableRowScopeMarker(this.top))
                        this.pop();
                };
                ElementStack.prototype.item = function (index) {
                    return this.elements[index];
                };
                ElementStack.prototype.contains = function (element) {
                    return this.elements.indexOf(element) !== -1;
                };
                ElementStack.prototype.inScope = function (localName) {
                    return this._inScope(localName, isScopeMarker);
                };
                ElementStack.prototype.inListItemScope = function (localName) {
                    return this._inScope(localName, isListItemScopeMarker);
                };
                ElementStack.prototype.inTableScope = function (localName) {
                    return this._inScope(localName, isTableScopeMarker);
                };
                ElementStack.prototype.inButtonScope = function (localName) {
                    return this._inScope(localName, isButtonScopeMarker);
                };
                ElementStack.prototype.inSelectScope = function (localName) {
                    return this._inScope(localName, isSelectScopeMarker);
                };
                ElementStack.prototype.hasNumberedHeaderElementInScope = function () {
                    for (var i = this.elements.length - 1; i >= 0; i--) {
                        var node = this.elements[i];
                        if (node.isNumberedHeader())
                            return true;
                        if (isScopeMarker(node))
                            return false;
                    }
                };
                ElementStack.prototype.furthestBlockForFormattingElement = function (element) {
                    var furthestBlock = null;
                    for (var i = this.elements.length - 1; i >= 0; i--) {
                        var node = this.elements[i];
                        if (node.node === element)
                            break;
                        if (node.isSpecial())
                            furthestBlock = node;
                    }
                    return furthestBlock;
                };
                ElementStack.prototype.findIndex = function (localName) {
                    for (var i = this.elements.length - 1; i >= 0; i--) {
                        if (this.elements[i].localName == localName)
                            return i;
                    }
                    return -1;
                };
                ElementStack.prototype.remove_openElements_until = function (callback) {
                    var finished = false;
                    var element;
                    while (!finished) {
                        element = this.elements.pop();
                        finished = callback(element);
                    }
                    return element;
                };
                Object.defineProperty(ElementStack.prototype, "top", {
                    get: function () {
                        return this.elements[this.elements.length - 1];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ElementStack.prototype, "length", {
                    get: function () {
                        return this.elements.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ElementStack;
            }());
            exports_1("default", ElementStack);
        }
    };
});
