System.register(["../language/formatter/abstractFormatter", "../utils"], function (exports_1, context_1) {
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
    var abstractFormatter_1, Utils, Formatter, _a;
    return {
        setters: [
            function (abstractFormatter_1_1) {
                abstractFormatter_1 = abstractFormatter_1_1;
            },
            function (Utils_1) {
                Utils = Utils_1;
            }
        ],
        execute: function () {
            Formatter = (function (_super) {
                __extends(Formatter, _super);
                function Formatter() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Formatter.prototype.format = function (failures) {
                    var failuresJSON = failures.map(function (failure) { return failure.toJson(); });
                    return JSON.stringify(failuresJSON);
                };
                Formatter.metadata = {
                    formatterName: "json",
                    description: "Formats errors as simple JSON.",
                    sample: (_a = ["\n        [\n            {\n                \"endPosition\": {\n                    \"character\": 13,\n                    \"line\": 0,\n                    \"position\": 13\n                },\n                \"failure\": \"Missing semicolon\",\n                \"fix\": {\n                    \"innerRuleName\": \"semicolon\",\n                    \"innerReplacements\": [\n                        {\n                            \"innerStart\": 13,\n                            \"innerLength\": 0,\n                            \"innerText\": \";\"\n                        }\n                    ]\n                },\n                \"name\": \"myFile.ts\",\n                \"ruleName\": \"semicolon\",\n                \"startPosition\": {\n                    \"character\": 13,\n                    \"line\": 0,\n                    \"position\": 13\n                }\n            }\n        ]"], _a.raw = ["\n        [\n            {\n                \"endPosition\": {\n                    \"character\": 13,\n                    \"line\": 0,\n                    \"position\": 13\n                },\n                \"failure\": \"Missing semicolon\",\n                \"fix\": {\n                    \"innerRuleName\": \"semicolon\",\n                    \"innerReplacements\": [\n                        {\n                            \"innerStart\": 13,\n                            \"innerLength\": 0,\n                            \"innerText\": \";\"\n                        }\n                    ]\n                },\n                \"name\": \"myFile.ts\",\n                \"ruleName\": \"semicolon\",\n                \"startPosition\": {\n                    \"character\": 13,\n                    \"line\": 0,\n                    \"position\": 13\n                }\n            }\n        ]"], Utils.dedent(_a)),
                    consumer: "machine",
                };
                return Formatter;
            }(abstractFormatter_1.AbstractFormatter));
            exports_1("Formatter", Formatter);
        }
    };
});
