System.register(['./ParentNode', './NodeType'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var ParentNode_1, NodeType_1;
    var DTD;
    return {
        setters:[
            function (ParentNode_1_1) {
                ParentNode_1 = ParentNode_1_1;
            },
            function (NodeType_1_1) {
                NodeType_1 = NodeType_1_1;
            }],
        execute: function() {
            DTD = (function (_super) {
                __extends(DTD, _super);
                function DTD(locator, name, publicIdentifier, systemIdentifier) {
                    _super.call(this, locator);
                    this.name = name;
                    this.publicIdentifier = publicIdentifier;
                    this.systemIdentifier = systemIdentifier;
                    this.nodeType = NodeType_1.default.DTD;
                }
                DTD.prototype.visit = function (treeParser) {
                    treeParser.startDTD(this.name, this.publicIdentifier, this.systemIdentifier, this);
                };
                DTD.prototype.revisit = function (treeParser) {
                    treeParser.endDTD();
                };
                return DTD;
            })(ParentNode_1.default);
            exports_1("default", DTD);
        }
    }
});
