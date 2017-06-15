System.register(["../fp/mixin", "./Mirror", "../mode/javascript/jshint"], function (exports_1, context_1) {
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
    function isValidJS(str) {
        try {
            eval("throw 0;" + str);
        }
        catch (e) {
            if (e === 0)
                return true;
        }
        return false;
    }
    function startRegex(arr) {
        return RegExp("^(" + arr.join("|") + ")");
    }
    var mixin_1, Mirror_1, jshint_1, disabledWarningsRe, errorsRe, infoRe, JavaScriptWorker;
    return {
        setters: [
            function (mixin_1_1) {
                mixin_1 = mixin_1_1;
            },
            function (Mirror_1_1) {
                Mirror_1 = Mirror_1_1;
            },
            function (jshint_1_1) {
                jshint_1 = jshint_1_1;
            }
        ],
        execute: function () {
            disabledWarningsRe = startRegex([
                "Bad for in variable '(.+)'.",
                'Missing "use strict"'
            ]);
            errorsRe = startRegex([
                "Unexpected",
                "Expected ",
                "Confusing (plus|minus)",
                "\\{a\\} unterminated regular expression",
                "Unclosed ",
                "Unmatched ",
                "Unbegun comment",
                "Bad invocation",
                "Missing space after",
                "Missing operator at"
            ]);
            infoRe = startRegex([
                "Expected an assignment",
                "Bad escapement of EOL",
                "Unexpected comma",
                "Unexpected space",
                "Missing radix parameter.",
                "A leading decimal point can",
                "\\['{a}'\\] is better written in dot notation.",
                "'{a}' used out of scope"
            ]);
            JavaScriptWorker = (function (_super) {
                __extends(JavaScriptWorker, _super);
                function JavaScriptWorker(host) {
                    var _this = _super.call(this, host, 500) || this;
                    _this.setOptions();
                    return _this;
                }
                JavaScriptWorker.prototype.setOptions = function (options) {
                    this.options = options || {
                        esnext: true,
                        moz: true,
                        devel: true,
                        browser: true,
                        node: true,
                        laxcomma: true,
                        laxbreak: true,
                        lastsemic: true,
                        onevar: false,
                        passfail: false,
                        maxerr: 100,
                        expr: true,
                        multistr: true,
                        globalstrict: true
                    };
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                JavaScriptWorker.prototype.changeOptions = function (options) {
                    mixin_1.mixin(this.options, options);
                    if (this.doc.getValue()) {
                        this.deferredUpdate.schedule(100);
                    }
                };
                JavaScriptWorker.prototype.onUpdate = function () {
                    var value = this.doc.getValue();
                    value = value.replace(/^#!.*\n/, "\n");
                    if (!value) {
                        this.emitAnnotations([]);
                        return;
                    }
                    var annotations = [];
                    var maxErrorLevel = isValidJS(value) ? "warning" : "error";
                    jshint_1.JSHINT(value, this.options);
                    var errors = jshint_1.JSHINT.errors;
                    var errorAdded = false;
                    for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
                        var error = errors_1[_i];
                        if (!error) {
                            continue;
                        }
                        var raw = error.raw;
                        var type = "warning";
                        if (raw === "Missing semicolon.") {
                            var str = error.evidence.substr(error.character);
                            str = str.charAt(str.search(/\S/));
                            if (maxErrorLevel === "error" && str && /[\w\d{(['"]/.test(str)) {
                                error.reason = 'Missing ";" before statement';
                                type = "error";
                            }
                            else {
                                type = "info";
                            }
                        }
                        else if (disabledWarningsRe.test(raw)) {
                            continue;
                        }
                        else if (infoRe.test(raw)) {
                            type = "info";
                        }
                        else if (errorsRe.test(raw)) {
                            errorAdded = true;
                            type = maxErrorLevel;
                        }
                        else if (raw === "'{a}' is not defined.") {
                            type = "warning";
                        }
                        else if (raw === "'{a}' is defined but never used.") {
                            type = "info";
                        }
                        annotations.push({
                            row: error.line - 1,
                            column: error.character - 1,
                            text: error.reason,
                            type: type
                        });
                        if (errorAdded) {
                        }
                    }
                    this.emitAnnotations(annotations);
                };
                return JavaScriptWorker;
            }(Mirror_1.Mirror));
            exports_1("JavaScriptWorker", JavaScriptWorker);
        }
    };
});
