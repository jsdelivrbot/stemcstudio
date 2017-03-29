System.register(["src/mode/glsl/parse", "src/mode/glsl/parser"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var parse_1, parser_1;
    return {
        setters: [
            function (parse_1_1) {
                parse_1 = parse_1_1;
            },
            function (parser_1_1) {
                parser_1 = parser_1_1;
            }
        ],
        execute: function () {
            describe("glsl/parse", function () {
                describe("basic", function () {
                    var node = parse_1.default('void main(void) {gl_Position = vec4(0.0, 0.0, 0.0, 1.0);}');
                    it("(program)", function () {
                        expect(node.mode).toBe(parser_1.STMTLIST);
                        expect(node.type).toBe('stmtlist');
                        expect(node.children.length).toBe(1);
                        expect(node.token.data).toBe('(program)');
                        expect(node.token.type).toBe('(program)');
                    });
                });
                describe("attribute", function () {
                    var node = parse_1.default('attribute vec3 aVertexPosition; void main(void) {gl_Position = aVertexPosition;}');
                    it("(program)", function () {
                        expect(node.mode).toBe(2);
                        expect(node.type).toBe('stmtlist');
                        expect(node.children.length).toBe(2);
                        expect(node.token.data).toBe('(program)');
                        expect(node.token.type).toBe('(program)');
                    });
                    it("(program)/stmt", function () {
                        expect(node.children[0].mode).toBe(1);
                        expect(node.children[0].type).toBe('stmt');
                        expect(node.children[0].children.length).toBe(1);
                        expect(node.children[0].token.data).toBe('attribute');
                        expect(node.children[0].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl", function () {
                        expect(node.children[0].children[0].mode).toBe(6);
                        expect(node.children[0].children[0].type).toBe('decl');
                        expect(node.children[0].children[0].children.length).toBe(6);
                        expect(node.children[0].children[0].token.data).toBe('attribute');
                        expect(node.children[0].children[0].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[0].children[0].children[0].mode).toBe(22);
                        expect(node.children[0].children[0].children[0].type).toBe('placeholder');
                        expect(node.children[0].children[0].children[0].children.length).toBe(0);
                        expect(node.children[0].children[0].children[0].token.data).toBe('');
                        expect(node.children[0].children[0].children[0].token.type).toBe(undefined);
                    });
                    it("(program)/stmt/decl/keyword", function () {
                        expect(node.children[0].children[0].children[1].mode).toBe(15);
                        expect(node.children[0].children[0].children[1].type).toBe('keyword');
                        expect(node.children[0].children[0].children[1].children.length).toBe(0);
                        expect(node.children[0].children[0].children[1].token.data).toBe('attribute');
                        expect(node.children[0].children[0].children[1].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[0].children[0].children[2].mode).toBe(22);
                        expect(node.children[0].children[0].children[2].type).toBe('placeholder');
                        expect(node.children[0].children[0].children[2].children.length).toBe(0);
                        expect(node.children[0].children[0].children[2].token.data).toBe('');
                        expect(node.children[0].children[0].children[2].token.type).toBe(undefined);
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[0].children[0].children[3].mode).toBe(22);
                        expect(node.children[0].children[0].children[3].type).toBe('placeholder');
                        expect(node.children[0].children[0].children[3].children.length).toBe(0);
                        expect(node.children[0].children[0].children[3].token.data).toBe('');
                        expect(node.children[0].children[0].children[3].token.type).toBe(undefined);
                    });
                    it("(program)/stmt/decl/keyword", function () {
                        expect(node.children[0].children[0].children[4].mode).toBe(15);
                        expect(node.children[0].children[0].children[4].type).toBe('keyword');
                        expect(node.children[0].children[0].children[4].children.length).toBe(0);
                        expect(node.children[0].children[0].children[4].token.data).toBe('vec3');
                        expect(node.children[0].children[0].children[4].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/decllist", function () {
                        expect(node.children[0].children[0].children[5].mode).toBe(7);
                        expect(node.children[0].children[0].children[5].type).toBe('decllist');
                        expect(node.children[0].children[0].children[5].children.length).toBe(1);
                        expect(node.children[0].children[0].children[5].token.data).toBe(';');
                    });
                    it("(program)/stmt/decl/decllist/ident", function () {
                        expect(node.children[0].children[0].children[5].children[0].mode).toBe(0);
                        expect(node.children[0].children[0].children[5].children[0].type).toBe('ident');
                        expect(node.children[0].children[0].children[5].children[0].children.length).toBe(0);
                        expect(node.children[0].children[0].children[5].children[0].token.data).toBe('aVertexPosition');
                    });
                    it("(program)/stmt", function () {
                        expect(node.children[1].mode).toBe(1);
                        expect(node.children[1].type).toBe('stmt');
                        expect(node.children[1].children.length).toBe(1);
                        expect(node.children[1].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl", function () {
                        expect(node.children[1].children[0].mode).toBe(6);
                        expect(node.children[1].children[0].type).toBe('decl');
                        expect(node.children[1].children[0].children.length).toBe(6);
                        expect(node.children[1].children[0].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[0].mode).toBe(22);
                        expect(node.children[1].children[0].children[0].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[0].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[1].mode).toBe(22);
                        expect(node.children[1].children[0].children[1].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[1].children.length).toBe(0);
                        expect(node.children[1].children[0].children[1].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[2].mode).toBe(22);
                        expect(node.children[1].children[0].children[2].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[2].children.length).toBe(0);
                        expect(node.children[1].children[0].children[2].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[3].mode).toBe(22);
                        expect(node.children[1].children[0].children[3].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[3].children.length).toBe(0);
                        expect(node.children[1].children[0].children[3].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/keyword", function () {
                        expect(node.children[1].children[0].children[4].mode).toBe(15);
                        expect(node.children[1].children[0].children[4].type).toBe('keyword');
                        expect(node.children[1].children[0].children[4].children.length).toBe(0);
                        expect(node.children[1].children[0].children[4].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/function", function () {
                        expect(node.children[1].children[0].children[5].mode).toBe(4);
                        expect(node.children[1].children[0].children[5].type).toBe('function');
                        expect(node.children[1].children[0].children[5].children.length).toBe(3);
                        expect(node.children[1].children[0].children[5].token.data).toBe('(');
                    });
                    it("(program)/stmt/decl/function/ident", function () {
                        expect(node.children[1].children[0].children[5].children[0].mode).toBe(0);
                        expect(node.children[1].children[0].children[5].children[0].type).toBe('ident');
                        expect(node.children[1].children[0].children[5].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[0].token.data).toBe('main');
                    });
                    it("(program)/stmt/decl/function/functionargs", function () {
                        expect(node.children[1].children[0].children[5].children[1].mode).toBe(5);
                        expect(node.children[1].children[0].children[5].children[1].type).toBe('functionargs');
                        expect(node.children[1].children[0].children[5].children[1].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[1].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/function/functionargs/keyword", function () {
                        expect(node.children[1].children[0].children[5].children[1].children[0].mode).toBe(15);
                        expect(node.children[1].children[0].children[5].children[1].children[0].type).toBe('keyword');
                        expect(node.children[1].children[0].children[5].children[1].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[1].children[0].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/function/stmtlist", function () {
                        expect(node.children[1].children[0].children[5].children[2].mode).toBe(2);
                        expect(node.children[1].children[0].children[5].children[2].type).toBe('stmtlist');
                        expect(node.children[1].children[0].children[5].children[2].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].mode).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].children[0].type).toBe('stmt');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].children[0].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].mode).toBe(11);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].type).toBe('expr');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr/assign", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].mode).toBe(undefined);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].type).toBe('assign');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children.length).toBe(2);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].token.data).toBe('=');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr/assign/builtin", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].mode).toBe(undefined);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].type).toBe('builtin');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr/assign/ident", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].mode).toBe(0);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].type).toBe('ident');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].token.data).toBe('aVertexPosition');
                    });
                });
                describe("uniform", function () {
                    var node = parse_1.default('uniform mat4 projectionMatrix; void main(void) {gl_Position = aVertexPosition;}');
                    it("(program)", function () {
                        expect(node.mode).toBe(2);
                        expect(node.type).toBe('stmtlist');
                        expect(node.children.length).toBe(2);
                        expect(node.token.data).toBe('(program)');
                        expect(node.token.type).toBe('(program)');
                    });
                    it("(program)/stmt", function () {
                        expect(node.children[0].mode).toBe(1);
                        expect(node.children[0].type).toBe('stmt');
                        expect(node.children[0].children.length).toBe(1);
                        expect(node.children[0].token.data).toBe('uniform');
                        expect(node.children[0].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl", function () {
                        expect(node.children[0].children[0].mode).toBe(6);
                        expect(node.children[0].children[0].type).toBe('decl');
                        expect(node.children[0].children[0].children.length).toBe(6);
                        expect(node.children[0].children[0].token.data).toBe('uniform');
                        expect(node.children[0].children[0].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[0].children[0].children[0].mode).toBe(22);
                        expect(node.children[0].children[0].children[0].type).toBe('placeholder');
                        expect(node.children[0].children[0].children[0].children.length).toBe(0);
                        expect(node.children[0].children[0].children[0].token.data).toBe('');
                        expect(node.children[0].children[0].children[0].token.type).toBe(undefined);
                    });
                    it("(program)/stmt/decl/keyword", function () {
                        expect(node.children[0].children[0].children[1].mode).toBe(15);
                        expect(node.children[0].children[0].children[1].type).toBe('keyword');
                        expect(node.children[0].children[0].children[1].children.length).toBe(0);
                        expect(node.children[0].children[0].children[1].token.data).toBe('uniform');
                        expect(node.children[0].children[0].children[1].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[0].children[0].children[2].mode).toBe(22);
                        expect(node.children[0].children[0].children[2].type).toBe('placeholder');
                        expect(node.children[0].children[0].children[2].children.length).toBe(0);
                        expect(node.children[0].children[0].children[2].token.data).toBe('');
                        expect(node.children[0].children[0].children[2].token.type).toBe(undefined);
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[0].children[0].children[3].mode).toBe(22);
                        expect(node.children[0].children[0].children[3].type).toBe('placeholder');
                        expect(node.children[0].children[0].children[3].children.length).toBe(0);
                        expect(node.children[0].children[0].children[3].token.data).toBe('');
                        expect(node.children[0].children[0].children[3].token.type).toBe(undefined);
                    });
                    it("(program)/stmt/decl/keyword", function () {
                        expect(node.children[0].children[0].children[4].mode).toBe(15);
                        expect(node.children[0].children[0].children[4].type).toBe('keyword');
                        expect(node.children[0].children[0].children[4].children.length).toBe(0);
                        expect(node.children[0].children[0].children[4].token.data).toBe('mat4');
                        expect(node.children[0].children[0].children[4].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/decllist", function () {
                        expect(node.children[0].children[0].children[5].mode).toBe(7);
                        expect(node.children[0].children[0].children[5].type).toBe('decllist');
                        expect(node.children[0].children[0].children[5].children.length).toBe(1);
                        expect(node.children[0].children[0].children[5].token.data).toBe(';');
                    });
                    it("(program)/stmt/decl/decllist/ident", function () {
                        expect(node.children[0].children[0].children[5].children[0].mode).toBe(0);
                        expect(node.children[0].children[0].children[5].children[0].type).toBe('ident');
                        expect(node.children[0].children[0].children[5].children[0].children.length).toBe(0);
                        expect(node.children[0].children[0].children[5].children[0].token.data).toBe('projectionMatrix');
                    });
                    it("(program)/stmt", function () {
                        expect(node.children[1].mode).toBe(1);
                        expect(node.children[1].type).toBe('stmt');
                        expect(node.children[1].children.length).toBe(1);
                        expect(node.children[1].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl", function () {
                        expect(node.children[1].children[0].mode).toBe(6);
                        expect(node.children[1].children[0].type).toBe('decl');
                        expect(node.children[1].children[0].children.length).toBe(6);
                        expect(node.children[1].children[0].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[0].mode).toBe(22);
                        expect(node.children[1].children[0].children[0].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[0].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[1].mode).toBe(22);
                        expect(node.children[1].children[0].children[1].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[1].children.length).toBe(0);
                        expect(node.children[1].children[0].children[1].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[2].mode).toBe(22);
                        expect(node.children[1].children[0].children[2].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[2].children.length).toBe(0);
                        expect(node.children[1].children[0].children[2].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[3].mode).toBe(22);
                        expect(node.children[1].children[0].children[3].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[3].children.length).toBe(0);
                        expect(node.children[1].children[0].children[3].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/keyword", function () {
                        expect(node.children[1].children[0].children[4].mode).toBe(15);
                        expect(node.children[1].children[0].children[4].type).toBe('keyword');
                        expect(node.children[1].children[0].children[4].children.length).toBe(0);
                        expect(node.children[1].children[0].children[4].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/function", function () {
                        expect(node.children[1].children[0].children[5].mode).toBe(4);
                        expect(node.children[1].children[0].children[5].type).toBe('function');
                        expect(node.children[1].children[0].children[5].children.length).toBe(3);
                        expect(node.children[1].children[0].children[5].token.data).toBe('(');
                    });
                    it("(program)/stmt/decl/function/ident", function () {
                        expect(node.children[1].children[0].children[5].children[0].mode).toBe(0);
                        expect(node.children[1].children[0].children[5].children[0].type).toBe('ident');
                        expect(node.children[1].children[0].children[5].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[0].token.data).toBe('main');
                    });
                    it("(program)/stmt/decl/function/functionargs", function () {
                        expect(node.children[1].children[0].children[5].children[1].mode).toBe(5);
                        expect(node.children[1].children[0].children[5].children[1].type).toBe('functionargs');
                        expect(node.children[1].children[0].children[5].children[1].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[1].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/function/functionargs/keyword", function () {
                        expect(node.children[1].children[0].children[5].children[1].children[0].mode).toBe(15);
                        expect(node.children[1].children[0].children[5].children[1].children[0].type).toBe('keyword');
                        expect(node.children[1].children[0].children[5].children[1].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[1].children[0].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/function/stmtlist", function () {
                        expect(node.children[1].children[0].children[5].children[2].mode).toBe(2);
                        expect(node.children[1].children[0].children[5].children[2].type).toBe('stmtlist');
                        expect(node.children[1].children[0].children[5].children[2].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].mode).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].children[0].type).toBe('stmt');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].children[0].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].mode).toBe(11);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].type).toBe('expr');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr/assign", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].mode).toBe(undefined);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].type).toBe('assign');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children.length).toBe(2);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].token.data).toBe('=');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr/assign/builtin", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].mode).toBe(undefined);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].type).toBe('builtin');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr/assign/ident", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].mode).toBe(0);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].type).toBe('ident');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].token.data).toBe('aVertexPosition');
                    });
                });
                describe("varying", function () {
                    var node = parse_1.default('varying highp vec4 vColor; void main(void) {gl_Position = aVertexPosition;}');
                    it("(program)", function () {
                        expect(node.mode).toBe(2);
                        expect(node.type).toBe('stmtlist');
                        expect(node.children.length).toBe(2);
                        expect(node.token.data).toBe('(program)');
                        expect(node.token.type).toBe('(program)');
                    });
                    it("(program)/stmt", function () {
                        expect(node.children[0].mode).toBe(1);
                        expect(node.children[0].type).toBe('stmt');
                        expect(node.children[0].children.length).toBe(1);
                        expect(node.children[0].token.data).toBe('varying');
                        expect(node.children[0].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl", function () {
                        expect(node.children[0].children[0].mode).toBe(6);
                        expect(node.children[0].children[0].type).toBe('decl');
                        expect(node.children[0].children[0].children.length).toBe(6);
                        expect(node.children[0].children[0].token.data).toBe('varying');
                        expect(node.children[0].children[0].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[0].children[0].children[0].mode).toBe(22);
                        expect(node.children[0].children[0].children[0].type).toBe('placeholder');
                        expect(node.children[0].children[0].children[0].children.length).toBe(0);
                        expect(node.children[0].children[0].children[0].token.data).toBe('');
                        expect(node.children[0].children[0].children[0].token.type).toBe(undefined);
                    });
                    it("(program)/stmt/decl/keyword", function () {
                        expect(node.children[0].children[0].children[1].mode).toBe(15);
                        expect(node.children[0].children[0].children[1].type).toBe('keyword');
                        expect(node.children[0].children[0].children[1].children.length).toBe(0);
                        expect(node.children[0].children[0].children[1].token.data).toBe('varying');
                        expect(node.children[0].children[0].children[1].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[0].children[0].children[2].mode).toBe(22);
                        expect(node.children[0].children[0].children[2].type).toBe('placeholder');
                        expect(node.children[0].children[0].children[2].children.length).toBe(0);
                        expect(node.children[0].children[0].children[2].token.data).toBe('');
                        expect(node.children[0].children[0].children[2].token.type).toBe(undefined);
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[0].children[0].children[3].mode).toBe(15);
                        expect(node.children[0].children[0].children[3].type).toBe('keyword');
                        expect(node.children[0].children[0].children[3].children.length).toBe(0);
                        expect(node.children[0].children[0].children[3].token.data).toBe('highp');
                        expect(node.children[0].children[0].children[3].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/keyword", function () {
                        expect(node.children[0].children[0].children[4].mode).toBe(15);
                        expect(node.children[0].children[0].children[4].type).toBe('keyword');
                        expect(node.children[0].children[0].children[4].children.length).toBe(0);
                        expect(node.children[0].children[0].children[4].token.data).toBe('vec4');
                        expect(node.children[0].children[0].children[4].token.type).toBe('keyword');
                    });
                    it("(program)/stmt/decl/decllist", function () {
                        expect(node.children[0].children[0].children[5].mode).toBe(7);
                        expect(node.children[0].children[0].children[5].type).toBe('decllist');
                        expect(node.children[0].children[0].children[5].children.length).toBe(1);
                        expect(node.children[0].children[0].children[5].token.data).toBe(';');
                    });
                    it("(program)/stmt/decl/decllist/ident", function () {
                        expect(node.children[0].children[0].children[5].children[0].mode).toBe(0);
                        expect(node.children[0].children[0].children[5].children[0].type).toBe('ident');
                        expect(node.children[0].children[0].children[5].children[0].children.length).toBe(0);
                        expect(node.children[0].children[0].children[5].children[0].token.data).toBe('vColor');
                    });
                    it("(program)/stmt", function () {
                        expect(node.children[1].mode).toBe(1);
                        expect(node.children[1].type).toBe('stmt');
                        expect(node.children[1].children.length).toBe(1);
                        expect(node.children[1].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl", function () {
                        expect(node.children[1].children[0].mode).toBe(6);
                        expect(node.children[1].children[0].type).toBe('decl');
                        expect(node.children[1].children[0].children.length).toBe(6);
                        expect(node.children[1].children[0].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[0].mode).toBe(22);
                        expect(node.children[1].children[0].children[0].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[0].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[1].mode).toBe(22);
                        expect(node.children[1].children[0].children[1].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[1].children.length).toBe(0);
                        expect(node.children[1].children[0].children[1].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[2].mode).toBe(22);
                        expect(node.children[1].children[0].children[2].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[2].children.length).toBe(0);
                        expect(node.children[1].children[0].children[2].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/placeholder", function () {
                        expect(node.children[1].children[0].children[3].mode).toBe(22);
                        expect(node.children[1].children[0].children[3].type).toBe('placeholder');
                        expect(node.children[1].children[0].children[3].children.length).toBe(0);
                        expect(node.children[1].children[0].children[3].token.data).toBe('');
                    });
                    it("(program)/stmt/decl/keyword", function () {
                        expect(node.children[1].children[0].children[4].mode).toBe(15);
                        expect(node.children[1].children[0].children[4].type).toBe('keyword');
                        expect(node.children[1].children[0].children[4].children.length).toBe(0);
                        expect(node.children[1].children[0].children[4].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/function", function () {
                        expect(node.children[1].children[0].children[5].mode).toBe(4);
                        expect(node.children[1].children[0].children[5].type).toBe('function');
                        expect(node.children[1].children[0].children[5].children.length).toBe(3);
                        expect(node.children[1].children[0].children[5].token.data).toBe('(');
                    });
                    it("(program)/stmt/decl/function/ident", function () {
                        expect(node.children[1].children[0].children[5].children[0].mode).toBe(0);
                        expect(node.children[1].children[0].children[5].children[0].type).toBe('ident');
                        expect(node.children[1].children[0].children[5].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[0].token.data).toBe('main');
                    });
                    it("(program)/stmt/decl/function/functionargs", function () {
                        expect(node.children[1].children[0].children[5].children[1].mode).toBe(5);
                        expect(node.children[1].children[0].children[5].children[1].type).toBe('functionargs');
                        expect(node.children[1].children[0].children[5].children[1].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[1].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/function/functionargs/keyword", function () {
                        expect(node.children[1].children[0].children[5].children[1].children[0].mode).toBe(15);
                        expect(node.children[1].children[0].children[5].children[1].children[0].type).toBe('keyword');
                        expect(node.children[1].children[0].children[5].children[1].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[1].children[0].token.data).toBe('void');
                    });
                    it("(program)/stmt/decl/function/stmtlist", function () {
                        expect(node.children[1].children[0].children[5].children[2].mode).toBe(2);
                        expect(node.children[1].children[0].children[5].children[2].type).toBe('stmtlist');
                        expect(node.children[1].children[0].children[5].children[2].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].mode).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].children[0].type).toBe('stmt');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].children[0].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].mode).toBe(11);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].type).toBe('expr');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children.length).toBe(1);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr/assign", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].mode).toBe(undefined);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].type).toBe('assign');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children.length).toBe(2);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].token.data).toBe('=');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr/assign/builtin", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].mode).toBe(undefined);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].type).toBe('builtin');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[0].token.data).toBe('gl_Position');
                    });
                    it("(program)/stmt/decl/function/stmtlist/stmt/expr/assign/ident", function () {
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].mode).toBe(0);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].type).toBe('ident');
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].children.length).toBe(0);
                        expect(node.children[1].children[0].children[5].children[2].children[0].children[0].children[0].children[1].token.data).toBe('aVertexPosition');
                    });
                });
                xdescribe("syntax", function () {
                    it("", function () {
                        try {
                            parse_1.default('vary ing highp vec4 vColor; void main(void) {gl_Position = aVertexPosition;}');
                        }
                        catch (e) {
                            expect(e.message).toBe("did not use all tokens");
                            expect(e.line).toBe(90);
                            expect(e.column).toBe(undefined);
                        }
                    });
                });
            });
        }
    };
});
