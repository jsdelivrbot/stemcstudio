System.register(["./Node", "./NodeType"], function (exports_1, context_1) {
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
    var Node_1, NodeType_1, Comment;
    return {
        setters: [
            function (Node_1_1) {
                Node_1 = Node_1_1;
            },
            function (NodeType_1_1) {
                NodeType_1 = NodeType_1_1;
            }
        ],
        execute: function () {
            Comment = (function (_super) {
                __extends(Comment, _super);
                function Comment(locator, data) {
                    var _this = _super.call(this, locator) || this;
                    _this.data = data;
                    _this.nodeType = NodeType_1.NodeType.COMMENT;
                    return _this;
                }
                Comment.prototype.visit = function (treeParser) {
                    treeParser.comment(this.data, 0, this.data.length, this);
                };
                return Comment;
            }(Node_1.Node));
            exports_1("Comment", Comment);
        }
    };
});
