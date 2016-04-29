var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./TextMode", "./CssHighlightRules", "./MatchingBraceOutdent", "../worker/WorkerClient", "./behaviour/CssBehaviour", "./folding/CstyleFoldMode"], function (require, exports, TextMode_1, CssHighlightRules_1, MatchingBraceOutdent_1, WorkerClient_1, CssBehaviour_1, CstyleFoldMode_1) {
    "use strict";
    var CssMode = (function (_super) {
        __extends(CssMode, _super);
        function CssMode(workerUrl, scriptImports) {
            _super.call(this, workerUrl, scriptImports);
            this.$id = "ace/mode/css";
            this.blockComment = { start: "/*", end: "*/" };
            this.HighlightRules = CssHighlightRules_1.default;
            this.$outdent = new MatchingBraceOutdent_1.default();
            this.$behaviour = new CssBehaviour_1.default();
            this.foldingRules = new CstyleFoldMode_1.default();
        }
        CssMode.prototype.getNextLineIndent = function (state, line, tab) {
            var indent = this.$getIndent(line);
            var tokens = this.getTokenizer().getLineTokens(line, state).tokens;
            if (tokens.length && tokens[tokens.length - 1].type == "comment") {
                return indent;
            }
            var match = line.match(/^.*\{\s*$/);
            if (match) {
                indent += tab;
            }
            return indent;
        };
        CssMode.prototype.checkOutdent = function (state, line, text) {
            return this.$outdent.checkOutdent(line, text);
        };
        CssMode.prototype.autoOutdent = function (state, session, row) {
            return this.$outdent.autoOutdent(session, row);
        };
        CssMode.prototype.createWorker = function (session) {
            var workerUrl = this.workerUrl;
            var scriptImports = this.scriptImports;
            var worker = new WorkerClient_1.default(workerUrl);
            worker.on("initAfter", function () {
                worker.attachToDocument(session.getDocument());
            });
            worker.on("initFail", function (message) {
            });
            worker.on('annotations', function (event) {
                var annotations = event.data;
                if (annotations.length > 0) {
                    session.setAnnotations(annotations);
                }
                else {
                    session.clearAnnotations();
                }
                session._emit("annotations", { data: annotations });
            });
            worker.on("terminate", function () {
                worker.detachFromDocument();
                session.clearAnnotations();
            });
            worker.init(scriptImports, 'ace-workers.js', 'CssWorker');
            return worker;
        };
        return CssMode;
    })(TextMode_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CssMode;
});
