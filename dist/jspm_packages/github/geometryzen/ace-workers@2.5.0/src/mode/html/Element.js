System.register(["./ParentNode", "./NodeType"], function (exports_1, context_1) {
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
    var ParentNode_1, NodeType_1, Element;
    return {
        setters: [
            function (ParentNode_1_1) {
                ParentNode_1 = ParentNode_1_1;
            },
            function (NodeType_1_1) {
                NodeType_1 = NodeType_1_1;
            }
        ],
        execute: function () {
            Element = (function (_super) {
                __extends(Element, _super);
                function Element(locator, uri, localName, qName, atts, prefixMappings) {
                    var _this = _super.call(this, locator) || this;
                    _this.uri = uri;
                    _this.localName = localName;
                    _this.qName = qName;
                    _this.attributes = atts;
                    _this.prefixMappings = prefixMappings;
                    _this.nodeType = NodeType_1.default.ELEMENT;
                    return _this;
                }
                Element.prototype.visit = function (treeParser) {
                    if (this.prefixMappings) {
                        for (var key in this.prefixMappings) {
                            if (this.prefixMappings.hasOwnProperty(key)) {
                                var mapping = this.prefixMappings[key];
                                treeParser.startPrefixMapping(mapping.getPrefix(), mapping.getUri(), this);
                            }
                        }
                    }
                    treeParser.startElement(this.uri, this.localName, this.qName, this.attributes, this);
                };
                Element.prototype.revisit = function (treeParser) {
                    treeParser.endElement(this.uri, this.localName, this.qName, this.endLocator);
                    if (this.prefixMappings) {
                        for (var key in this.prefixMappings) {
                            if (this.prefixMappings.hasOwnProperty(key)) {
                                var mapping = this.prefixMappings[key];
                                treeParser.endPrefixMapping(mapping.getPrefix(), this.endLocator);
                            }
                        }
                    }
                };
                return Element;
            }(ParentNode_1.default));
            exports_1("default", Element);
        }
    };
});
