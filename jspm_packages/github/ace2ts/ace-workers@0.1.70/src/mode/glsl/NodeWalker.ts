import Node from './Node'
import NodeEventHandler from './NodeEventHandler'
import DebugNodeEventHandler from './DebugNodeEventHandler'
import DefaultNodeEventHandler from './DefaultNodeEventHandler'
class DeclarationBuilder extends DefaultNodeEventHandler {
    private kind: string;
    private modifiers: string[] = [];
    private type: string;
    private names: string[] = [];
    private next: NodeEventHandler;
    constructor(next: NodeEventHandler) {
        super();
        this.next = next;
    }
    beginDeclaration() {
        this.kind = void 0;
        this.type = void 0;
        this.modifiers = [];
        this.names = [];
    }
    endDeclaration() {
        if (this.kind) {
            this.next.declaration(this.kind, this.modifiers, this.type, this.names);
        }
        else {
            // TODO: e.g. void main(void) {}
        }
    }
    identifier(name: string) {
        this.names.push(name);
    }
    keyword(word: string) {
        switch (word) {
            case 'attribute':
            case 'const':
            case 'uniform':
            case 'varying': {
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
            case 'void': {
                this.type = word;
            }
                break;
            case 'highp':
            case 'precision': {
                this.modifiers.push(word);
            }
                break;
            default: {
                throw new Error("Unexpected keyword: " + word);
            }
        }
    }
}
export default class NodeWalker {
    constructor() {

    }
    walk(node: Node, handler: NodeEventHandler) {
        var walker = this;
        switch (node.type) {
            case 'assign': {
                handler.beginAssign();
                node.children.forEach(function(child) {
                    walker.walk(child, handler);
                });
                handler.endAssign();
            }
                break;
            case 'builtin': {
                handler.builtin(node.token.data);
            }
                break;
            case 'binary': {
                // TODO
            }
                break;
            case 'call': {
                // TODO
            }
                break;
            case 'decl': {
                let builder = new DeclarationBuilder(handler);
                builder.beginDeclaration();
                node.children.forEach(function(child) {
                    walker.walk(child, builder);
                });
                builder.endDeclaration();
            }
                break;
            case 'decllist': {
                handler.beginDeclarationList();
                node.children.forEach(function(child) {
                    walker.walk(child, handler);
                });
                handler.endDeclarationList();
            }
                break;
            case 'expr': {
                handler.beginExpression();
                node.children.forEach(function(child) {
                    walker.walk(child, handler);
                });
                handler.endExpression();
            }
                break;
            case 'forloop': {
                // TODO
            }
                break;
            case 'function': {
                handler.beginFunction();
                node.children.forEach(function(child) {
                    walker.walk(child, handler);
                });
                handler.endFunction();
            }
                break;
            case 'functionargs': {
                handler.beginFunctionArgs();
                node.children.forEach(function(child) {
                    walker.walk(child, handler);
                });
                handler.endFunctionArgs();
            }
                break;
            case 'ident': {
                handler.identifier(node.token.data);
            }
                break;
            case 'keyword': {
                handler.keyword(node.token.data);
            }
                break;
            case 'literal': {
                // TODO
            }
                break;
            case 'placeholder': {
            }
                break;
            case 'precision': {
            }
                break;
            case 'stmt': {
                handler.beginStatement();
                node.children.forEach(function(child) {
                    walker.walk(child, handler);
                });
                handler.endStatement();
            }
                break;
            case 'stmtlist': {
                handler.beginStatementList();
                node.children.forEach(function(child) {
                    walker.walk(child, handler);
                });
                handler.endStatementList();
            }
                break;
            default: {
                throw new Error("type: " + node.type);
            }
        }
    }
}
