System.register([], function (exports_1, context_1) {
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
    function parseLine(text) {
        var multilineErrorMatch = text.match(multilineErrorRegex);
        if (multilineErrorMatch != null) {
            var startErrorCol = text.indexOf("~");
            return new MultilineErrorLine(startErrorCol);
        }
        var endErrorMatch = text.match(endErrorRegex);
        if (endErrorMatch != null) {
            var squiggles = endErrorMatch[1], message = endErrorMatch[2];
            var startErrorCol = text.indexOf("~");
            var zeroLengthError = (squiggles === ZERO_LENGTH_ERROR);
            var endErrorCol = zeroLengthError ? startErrorCol : text.lastIndexOf("~") + 1;
            return new EndErrorLine(startErrorCol, endErrorCol, message);
        }
        var messageSubstitutionMatch = text.match(messageSubstitutionRegex);
        if (messageSubstitutionMatch != null) {
            var key = messageSubstitutionMatch[1], message = messageSubstitutionMatch[2];
            return new MessageSubstitutionLine(key, message);
        }
        return new CodeLine(text);
    }
    exports_1("parseLine", parseLine);
    function printLine(line, code) {
        if (line instanceof ErrorLine) {
            if (code == null) {
                throw new Error("Must supply argument for code parameter when line is an ErrorLine");
            }
            var leadingSpaces = " ".repeat(line.startCol);
            if (line instanceof MultilineErrorLine) {
                if (code.length === 0 && line.startCol === 0) {
                    return ZERO_LENGTH_ERROR;
                }
                var tildes = "~".repeat(code.length - leadingSpaces.length);
                return "" + leadingSpaces + tildes;
            }
            else if (line instanceof EndErrorLine) {
                var tildes = "~".repeat(line.endCol - line.startCol);
                var endSpaces = " ".repeat(code.length - line.endCol);
                if (tildes.length === 0) {
                    tildes = ZERO_LENGTH_ERROR;
                    endSpaces = endSpaces.substring(0, Math.max(endSpaces.length - 4, 1));
                }
                return "" + leadingSpaces + tildes + endSpaces + " [" + line.message + "]";
            }
        }
        else if (line instanceof MessageSubstitutionLine) {
            return "[" + line.key + "]: " + line.message;
        }
        else if (line instanceof CodeLine) {
            return line.contents;
        }
        return null;
    }
    exports_1("printLine", printLine);
    var Line, CodeLine, MessageSubstitutionLine, ErrorLine, MultilineErrorLine, EndErrorLine, multilineErrorRegex, endErrorRegex, messageSubstitutionRegex, ZERO_LENGTH_ERROR;
    return {
        setters: [],
        execute: function () {
            Line = (function () {
                function Line() {
                }
                return Line;
            }());
            exports_1("Line", Line);
            CodeLine = (function (_super) {
                __extends(CodeLine, _super);
                function CodeLine(contents) {
                    var _this = _super.call(this) || this;
                    _this.contents = contents;
                    return _this;
                }
                return CodeLine;
            }(Line));
            exports_1("CodeLine", CodeLine);
            MessageSubstitutionLine = (function (_super) {
                __extends(MessageSubstitutionLine, _super);
                function MessageSubstitutionLine(key, message) {
                    var _this = _super.call(this) || this;
                    _this.key = key;
                    _this.message = message;
                    return _this;
                }
                return MessageSubstitutionLine;
            }(Line));
            exports_1("MessageSubstitutionLine", MessageSubstitutionLine);
            ErrorLine = (function (_super) {
                __extends(ErrorLine, _super);
                function ErrorLine(startCol) {
                    var _this = _super.call(this) || this;
                    _this.startCol = startCol;
                    return _this;
                }
                return ErrorLine;
            }(Line));
            exports_1("ErrorLine", ErrorLine);
            MultilineErrorLine = (function (_super) {
                __extends(MultilineErrorLine, _super);
                function MultilineErrorLine(startCol) {
                    return _super.call(this, startCol) || this;
                }
                return MultilineErrorLine;
            }(ErrorLine));
            exports_1("MultilineErrorLine", MultilineErrorLine);
            EndErrorLine = (function (_super) {
                __extends(EndErrorLine, _super);
                function EndErrorLine(startCol, endCol, message) {
                    var _this = _super.call(this, startCol) || this;
                    _this.endCol = endCol;
                    _this.message = message;
                    return _this;
                }
                return EndErrorLine;
            }(ErrorLine));
            exports_1("EndErrorLine", EndErrorLine);
            multilineErrorRegex = /^\s*(~+|~nil)$/;
            endErrorRegex = /^\s*(~+|~nil)\s*\[(.+)\]\s*$/;
            messageSubstitutionRegex = /^\[([\w\-\_]+?)]: \s*(.+?)\s*$/;
            exports_1("ZERO_LENGTH_ERROR", ZERO_LENGTH_ERROR = "~nil");
        }
    };
});
