import JavaScriptHighlightRules from "./JavaScriptHighlightRules";
import Rule from '../Rule';

export default class TypeScriptHighlightRules extends JavaScriptHighlightRules {

    constructor(options?: { jsx?: boolean }) {
        super(options);
        const tsRules: Rule<string>[] = [
            // Match stuff like: module name {...}
            {
                token: ["keyword.operator.ts", "text", "variable.parameter.function.ts", "text"],
                regex: "\\b(module)(\\s*)([a-zA-Z0-9_?.$][\\w?.$]*)(\\s*\\{)"
            },
            // Match stuff like: super(argument, list)
            {
                token: ["storage.type.variable.ts", "text", "keyword.other.ts", "text"],
                regex: "(super)(\\s*\\()([a-zA-Z0-9,_?.$\\s]+\\s*)(\\))"
            },
            // Match stuff like: function() {...}
            {
                token: ["entity.name.function.ts", "paren.lparen", "paren.rparen"],
                regex: "([a-zA-Z_?.$][\\w?.$]*)(\\()(\\))"
            },
            // Match stuff like: (function: return type)
            {
                token: ["variable.parameter.function.ts", "text", "variable.parameter.function.ts"],
                regex: "([a-zA-Z0-9_?.$][\\w?.$]*)(\\s*:\\s*)([a-zA-Z0-9_?.$][\\w?.$]*)"
            },
            {
                token: ["keyword.operator.ts"],
                regex: "(?:\\b(constructor|declare|interface|as|AS|public|private|readonly|class|extends|export|super)\\b)"
            },
            {
                token: ["storage.type.variable.ts"],
                regex: "(?:\\b(this\\.|string\\b|bool\\b|number)\\b)"
            },
            {
                token: ["keyword.operator.ts", "storage.type.variable.ts", "keyword.operator.ts", "storage.type.variable.ts"],
                regex: "(class)(\\s+[a-zA-Z0-9_?.$][\\w?.$]*\\s+)(extends)(\\s+[a-zA-Z0-9_?.$][\\w?.$]*\\s+)?"
            },
            {
                token: "keyword",
                regex: "(?:super|export|class|extends|import)\\b"
            }
        ];

        const JSRules = new JavaScriptHighlightRules({ jsx: (options && options.jsx) === true }).getRules();
        const startRules: Rule<string>[] = JSRules['start'];

        JSRules['start'] = tsRules.concat(startRules);
        this.$rules = JSRules;
    }
}
