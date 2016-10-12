System.register(['./Node', './NodeType'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var Node_1, NodeType_1;
    var Comment;
    return {
        setters:[
            function (Node_1_1) {
                Node_1 = Node_1_1;
            },
            function (NodeType_1_1) {
                NodeType_1 = NodeType_1_1;
            }],
        execute: function() {
            Comment = (function (_super) {
                __extends(Comment, _super);
                function Comment(locator, data) {
                    _super.call(this, locator);
                    this.data = data;
                    this.nodeType = NodeType_1.default.COMMENT;
                }
                Comment.prototype.visit = function (treeParser) {
                    treeParser.comment(this.data, 0, this.data.length, this);
                };
                return Comment;
            }(Node_1.default));
            exports_1("default", Comment);
        }
    }
});
