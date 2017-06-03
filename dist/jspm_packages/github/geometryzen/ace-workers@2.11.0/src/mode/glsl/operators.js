System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var operators;
    return {
        setters: [],
        execute: function () {
            operators = [
                '<<=',
                '>>=',
                '++',
                '--',
                '<<',
                '>>',
                '<=',
                '>=',
                '==',
                '!=',
                '&&',
                '||',
                '+=',
                '-=',
                '*=',
                '/=',
                '%=',
                '&=',
                '^^',
                '^=',
                '|=',
                '(',
                ')',
                '[',
                ']',
                '.',
                '!',
                '~',
                '*',
                '/',
                '%',
                '+',
                '-',
                '<',
                '>',
                '&',
                '^',
                '|',
                '?',
                ':',
                '=',
                ',',
                ';',
                '{',
                '}'
            ];
            exports_1("default", operators);
        }
    };
});
