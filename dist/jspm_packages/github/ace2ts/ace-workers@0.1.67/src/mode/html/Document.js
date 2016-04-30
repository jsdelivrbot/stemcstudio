System.register(['./ParentNode', './NodeType'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ParentNode_1, NodeType_1;
    var Document;
    return {
        setters:[
            function (ParentNode_1_1) {
                ParentNode_1 = ParentNode_1_1;
            },
            function (NodeType_1_1) {
                NodeType_1 = NodeType_1_1;
            }],
        execute: function() {
            Document = (function (_super) {
                __extends(Document, _super);
                function Document(locator) {
                    _super.call(this, locator);
                    this.nodeType = NodeType_1.default.DOCUMENT;
                }
                Document.prototype.visit = function (treeParser) {
                    treeParser.startDocument(this);
                };
                Document.prototype.revisit = function (treeParser) {
                    treeParser.endDocument(this.endLocator);
                };
                return Document;
            })(ParentNode_1.default);
            exports_1("default", Document);
        }
    }
});
