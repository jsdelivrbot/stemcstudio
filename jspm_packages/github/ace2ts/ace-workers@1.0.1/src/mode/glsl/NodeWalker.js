System.register(['./DefaultNodeEventHandler'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var DefaultNodeEventHandler_1;
    var DeclarationBuilder, NodeWalker;
    return {
        setters:[
            function (DefaultNodeEventHandler_1_1) {
                DefaultNodeEventHandler_1 = DefaultNodeEventHandler_1_1;
            }],
        execute: function() {
            DeclarationBuilder = (function (_super) {
                __extends(DeclarationBuilder, _super);
                function DeclarationBuilder(next) {
                    _super.call(this);
                    this.modifiers = [];
                    this.names = [];
                    this.next = next;
                }
                DeclarationBuilder.prototype.beginDeclaration = function () {
                    this.kind = void 0;
                    this.type = void 0;
                    this.modifiers = [];
                    this.names = [];
                };
                DeclarationBuilder.prototype.endDeclaration = function () {
                    if (this.kind) {
                        this.next.declaration(this.kind, this.modifiers, this.type, this.names);
                    }
                    else {
                    }
                };
                DeclarationBuilder.prototype.identifier = function (name) {
                    this.names.push(name);
                };
                DeclarationBuilder.prototype.keyword = function (word) {
                    switch (word) {
                        case 'attribute':
                        case 'const':
                        case 'uniform':
                        case 'varying':
                            {
                                this.kind = word;
                            }
                            break;
                        case 'float':
                        case 'int':
                        case 'mat2':
                        case 'mat3':
                        case 'mat4':
                        case 'vec2':
                        case 'vec3':
                        case 'vec4':
                        case 'void':
                            {
                                this.type = word;
                            }
                            break;
                        case 'highp':
                        case 'precision':
                            {
                                this.modifiers.push(word);
                            }
                            break;
                        default: {
                            throw new Error("Unexpected keyword: " + word);
                        }
                    }
                };
                return DeclarationBuilder;
            }(DefaultNodeEventHandler_1.default));
            NodeWalker = (function () {
                function NodeWalker() {
                }
                NodeWalker.prototype.walk = function (node, handler) {
                    var _this = this;
                    switch (node.type) {
                        case 'assign':
                            {
                                handler.beginAssign();
                                node.children.forEach(function (child) {
                                    _this.walk(child, handler);
                                });
                                handler.endAssign();
                            }
                            break;
                        case 'builtin':
                            {
                                handler.builtin(node.token.data);
                            }
                            break;
                        case 'binary':
                            {
                            }
                            break;
                        case 'call':
                            {
                            }
                            break;
                        case 'decl':
                            {
                                var builder_1 = new DeclarationBuilder(handler);
                                builder_1.beginDeclaration();
                                node.children.forEach(function (child) {
                                    _this.walk(child, builder_1);
                                });
                                builder_1.endDeclaration();
                            }
                            break;
                        case 'decllist':
                            {
                                handler.beginDeclarationList();
                                node.children.forEach(function (child) {
                                    _this.walk(child, handler);
                                });
                                handler.endDeclarationList();
                            }
                            break;
                        case 'expr':
                            {
                                handler.beginExpression();
                                node.children.forEach(function (child) {
                                    _this.walk(child, handler);
                                });
                                handler.endExpression();
                            }
                            break;
                        case 'forloop':
                            {
                            }
                            break;
                        case 'function':
                            {
                                handler.beginFunction();
                                node.children.forEach(function (child) {
                                    _this.walk(child, handler);
                                });
                                handler.endFunction();
                            }
                            break;
                        case 'functionargs':
                            {
                                handler.beginFunctionArgs();
                                node.children.forEach(function (child) {
                                    _this.walk(child, handler);
                                });
                                handler.endFunctionArgs();
                            }
                            break;
                        case 'ident':
                            {
                                handler.identifier(node.token.data);
                            }
                            break;
                        case 'keyword':
                            {
                                handler.keyword(node.token.data);
                            }
                            break;
                        case 'literal':
                            {
                            }
                            break;
                        case 'placeholder':
                            {
                            }
                            break;
                        case 'precision':
                            {
                            }
                            break;
                        case 'stmt':
                            {
                                handler.beginStatement();
                                node.children.forEach(function (child) {
                                    _this.walk(child, handler);
                                });
                                handler.endStatement();
                            }
                            break;
                        case 'stmtlist':
                            {
                                handler.beginStatementList();
                                node.children.forEach(function (child) {
                                    _this.walk(child, handler);
                                });
                                handler.endStatementList();
                            }
                            break;
                        default: {
                            throw new Error("type: " + node.type);
                        }
                    }
                };
                return NodeWalker;
            }());
            exports_1("default", NodeWalker);
        }
    }
});
