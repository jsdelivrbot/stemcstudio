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
    var ParentNode_1, NodeType_1, Document;
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
            Document = (function (_super) {
                __extends(Document, _super);
                function Document(locator) {
                    var _this = _super.call(this, locator) || this;
                    _this.nodeType = NodeType_1.NodeType.DOCUMENT;
                    return _this;
                }
                Document.prototype.visit = function (treeParser) {
                    treeParser.startDocument(this);
                };
                Document.prototype.revisit = function (treeParser) {
                    treeParser.endDocument(this.endLocator);
                };
                return Document;
            }(ParentNode_1.ParentNode));
            exports_1("Document", Document);
        }
    };
});
