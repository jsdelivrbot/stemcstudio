System.register(["./SAXTreeBuilder", "./Tokenizer", "./TreeParser"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var SAXTreeBuilder_1, Tokenizer_1, TreeParser_1, SAXParser;
    return {
        setters: [
            function (SAXTreeBuilder_1_1) {
                SAXTreeBuilder_1 = SAXTreeBuilder_1_1;
            },
            function (Tokenizer_1_1) {
                Tokenizer_1 = Tokenizer_1_1;
            },
            function (TreeParser_1_1) {
                TreeParser_1 = TreeParser_1_1;
            }
        ],
        execute: function () {
            SAXParser = (function () {
                function SAXParser() {
                    this.contentHandler = null;
                    this._errorHandler = null;
                    this._treeBuilder = new SAXTreeBuilder_1.default();
                    this._tokenizer = new Tokenizer_1.default(this._treeBuilder);
                    this._scriptingEnabled = false;
                }
                SAXParser.prototype.parseFragment = function (source, context) {
                    this._treeBuilder.setFragmentContext(context);
                    this._tokenizer.tokenize(source);
                    var fragment = this._treeBuilder.getFragment();
                    if (fragment) {
                        new TreeParser_1.default(this.contentHandler).parse(fragment);
                    }
                };
                SAXParser.prototype.parse = function (source) {
                    this._tokenizer.tokenize(source);
                    var document = this._treeBuilder.document;
                    if (document) {
                        new TreeParser_1.default(this.contentHandler).parse(document);
                    }
                };
                Object.defineProperty(SAXParser.prototype, "scriptingEnabled", {
                    get: function () {
                        return this._scriptingEnabled;
                    },
                    set: function (scriptingEnabled) {
                        this._scriptingEnabled = scriptingEnabled;
                        this._treeBuilder.scriptingEnabled = scriptingEnabled;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SAXParser.prototype, "errorHandler", {
                    get: function () {
                        return this._errorHandler;
                    },
                    set: function (errorHandler) {
                        this._errorHandler = errorHandler;
                        this._treeBuilder.errorHandler = errorHandler;
                    },
                    enumerable: true,
                    configurable: true
                });
                return SAXParser;
            }());
            exports_1("default", SAXParser);
        }
    };
});
