System.register(["./name-stack"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var name_stack_1, state;
    return {
        setters: [
            function (name_stack_1_1) {
                name_stack_1 = name_stack_1_1;
            }
        ],
        execute: function () {
            exports_1("state", state = {
                option: {},
                cache: {},
                condition: void 0,
                directive: {},
                esVersion: 6,
                forinifcheckneeded: false,
                forinifchecks: void 0,
                funct: null,
                ignored: {},
                tab: "",
                lines: [],
                syntax: {},
                jsonMode: false,
                jsonWarnings: void 0,
                nameStack: new name_stack_1.NameStack(),
                tokens: { prev: null, next: null, curr: null },
                inClassBody: false,
                ignoredLines: {},
                isStrict: function () {
                    return this.directive["use strict"] || this.inClassBody ||
                        this.option.module || this.option.strict === "implied";
                },
                stmtMissingStrict: function () {
                    if (this.option.strict === "global") {
                        return true;
                    }
                    if (this.option.strict === false) {
                        return false;
                    }
                    if (this.option.globalstrict) {
                        return true;
                    }
                    return false;
                },
                allowsGlobalUsd: function () {
                    return this.option.strict === "global" || this.option.globalstrict ||
                        this.option.module || this.impliedClosure();
                },
                impliedClosure: function () {
                    return this.option.node || this.option.phantom || this.option.browserify;
                },
                inMoz: function () {
                    return this.option.moz;
                },
                inES6: function (strict) {
                    if (strict) {
                        return this.option.esversion === 6;
                    }
                    return this.option.moz || this.option.esversion >= 6;
                },
                inES5: function (strict) {
                    if (strict) {
                        return (!this.option.esversion || this.option.esversion === 5) && !this.option.moz;
                    }
                    return !this.option.esversion || this.option.esversion >= 5 || this.option.moz;
                },
                inferEsVersion: function () {
                    var badOpt = null;
                    if (this.option.esversion) {
                        if (this.option.es3) {
                            badOpt = "es3";
                        }
                        else if (this.option.es5) {
                            badOpt = "es5";
                        }
                        else if (this.option.esnext) {
                            badOpt = "esnext";
                        }
                        if (badOpt) {
                            return badOpt;
                        }
                        if (this.option.esversion === 2015) {
                            this.esVersion = 6;
                        }
                        else {
                            this.esVersion = this.option.esversion;
                        }
                    }
                    else if (this.option.es3) {
                        this.esVersion = 3;
                    }
                    else if (this.option.esnext) {
                        this.esVersion = 6;
                    }
                    return null;
                },
                reset: function () {
                    this.tokens = {
                        prev: null,
                        next: null,
                        curr: null
                    };
                    this.option = {};
                    this.funct = null;
                    this.ignored = {};
                    this.directive = {};
                    this.jsonMode = false;
                    this.jsonWarnings = [];
                    this.lines = [];
                    this.tab = "";
                    this.cache = {};
                    this.ignoredLines = {};
                    this.forinifcheckneeded = false;
                    this.nameStack = new name_stack_1.NameStack();
                    this.inClassBody = false;
                }
            });
        }
    };
});
