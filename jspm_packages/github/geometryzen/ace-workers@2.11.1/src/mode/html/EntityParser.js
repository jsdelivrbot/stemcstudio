System.register(["./entities", "./InputStream", "./isAlphaNumeric", "./isDecimalDigit", "./isHexDigit"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var entities_1, InputStream_1, isAlphaNumeric_1, isDecimalDigit_1, isHexDigit_1, namedEntityPrefixes, EntityParserClass, EntityParser;
    return {
        setters: [
            function (entities_1_1) {
                entities_1 = entities_1_1;
            },
            function (InputStream_1_1) {
                InputStream_1 = InputStream_1_1;
            },
            function (isAlphaNumeric_1_1) {
                isAlphaNumeric_1 = isAlphaNumeric_1_1;
            },
            function (isDecimalDigit_1_1) {
                isDecimalDigit_1 = isDecimalDigit_1_1;
            },
            function (isHexDigit_1_1) {
                isHexDigit_1 = isHexDigit_1_1;
            }
        ],
        execute: function () {
            namedEntityPrefixes = {};
            Object.keys(entities_1.entities).forEach(function (entityKey) {
                for (var i = 0; i < entityKey.length; i++) {
                    namedEntityPrefixes[entityKey.substring(0, i + 1)] = true;
                }
            });
            EntityParserClass = (function () {
                function EntityParserClass() {
                }
                EntityParserClass.prototype.consumeEntity = function (buffer, tokenizer, additionalAllowedCharacter) {
                    var decodedCharacter = '';
                    var consumedCharacters = '';
                    var ch = buffer.char();
                    if (typeof ch === 'string') {
                        consumedCharacters += ch;
                        if (ch === '\t' || ch === '\n' || ch === '\v' || ch === ' ' || ch === '<' || ch === '&') {
                            buffer.unget(consumedCharacters);
                            return false;
                        }
                        if (additionalAllowedCharacter === ch) {
                            buffer.unget(consumedCharacters);
                            return false;
                        }
                        if (ch === '#') {
                            ch = buffer.shift(1);
                            if (ch === InputStream_1.InputStream.EOF) {
                                tokenizer._parseError("expected-numeric-entity-but-got-eof");
                                buffer.unget(consumedCharacters);
                                return false;
                            }
                            consumedCharacters += ch;
                            var radix = 10;
                            var isDigit = isDecimalDigit_1.isDecimalDigit;
                            if (ch === 'x' || ch === 'X') {
                                radix = 16;
                                isDigit = isHexDigit_1.isHexDigit;
                                ch = buffer.shift(1);
                                if (ch === InputStream_1.InputStream.EOF) {
                                    tokenizer._parseError("expected-numeric-entity-but-got-eof");
                                    buffer.unget(consumedCharacters);
                                    return false;
                                }
                                consumedCharacters += ch;
                            }
                            if (typeof ch === 'string' && isDigit(ch)) {
                                var code = '';
                                while (ch !== InputStream_1.InputStream.EOF && isDigit(ch)) {
                                    code += ch;
                                    ch = buffer.char();
                                }
                                code = parseInt(code, radix);
                                var replacement = this.replaceEntityNumbers(code);
                                if (replacement) {
                                    tokenizer._parseError("invalid-numeric-entity-replaced");
                                    code = replacement;
                                }
                                if (code > 0xFFFF && code <= 0x10FFFF) {
                                    code -= 0x10000;
                                    var first = ((0xffc00 & code) >> 10) + 0xD800;
                                    var second = (0x3ff & code) + 0xDC00;
                                    decodedCharacter = String.fromCharCode(first, second);
                                }
                                else
                                    decodedCharacter = String.fromCharCode(code);
                                if (ch !== ';') {
                                    tokenizer._parseError("numeric-entity-without-semicolon");
                                    buffer.unget(ch);
                                }
                                return decodedCharacter;
                            }
                            buffer.unget(consumedCharacters);
                            tokenizer._parseError("expected-numeric-entity");
                            return false;
                        }
                        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
                            var mostRecentMatch = '';
                            while (namedEntityPrefixes[consumedCharacters]) {
                                if (entities_1.entities[consumedCharacters]) {
                                    mostRecentMatch = consumedCharacters;
                                }
                                if (ch === ';')
                                    break;
                                ch = buffer.char();
                                if (ch === InputStream_1.InputStream.EOF)
                                    break;
                                consumedCharacters += ch;
                            }
                            if (!mostRecentMatch) {
                                tokenizer._parseError("expected-named-entity");
                                buffer.unget(consumedCharacters);
                                return false;
                            }
                            decodedCharacter = entities_1.entities[mostRecentMatch];
                            if (ch === ';' || !additionalAllowedCharacter || !((typeof ch === 'string' && isAlphaNumeric_1.isAlphaNumeric(ch)) || ch === '=')) {
                                if (consumedCharacters.length > mostRecentMatch.length) {
                                    buffer.unget(consumedCharacters.substring(mostRecentMatch.length));
                                }
                                if (ch !== ';') {
                                    tokenizer._parseError("named-entity-without-semicolon");
                                }
                                return decodedCharacter;
                            }
                            buffer.unget(consumedCharacters);
                            return false;
                        }
                    }
                    else if (typeof ch === 'number') {
                        if (ch === InputStream_1.InputStream.EOF)
                            return false;
                    }
                    else {
                        throw new TypeError("InputStream.char() must return string or m=number");
                    }
                };
                EntityParserClass.prototype.replaceEntityNumbers = function (c) {
                    switch (c) {
                        case 0x00: return 0xFFFD;
                        case 0x13: return 0x0010;
                        case 0x80: return 0x20AC;
                        case 0x81: return 0x0081;
                        case 0x82: return 0x201A;
                        case 0x83: return 0x0192;
                        case 0x84: return 0x201E;
                        case 0x85: return 0x2026;
                        case 0x86: return 0x2020;
                        case 0x87: return 0x2021;
                        case 0x88: return 0x02C6;
                        case 0x89: return 0x2030;
                        case 0x8A: return 0x0160;
                        case 0x8B: return 0x2039;
                        case 0x8C: return 0x0152;
                        case 0x8D: return 0x008D;
                        case 0x8E: return 0x017D;
                        case 0x8F: return 0x008F;
                        case 0x90: return 0x0090;
                        case 0x91: return 0x2018;
                        case 0x92: return 0x2019;
                        case 0x93: return 0x201C;
                        case 0x94: return 0x201D;
                        case 0x95: return 0x2022;
                        case 0x96: return 0x2013;
                        case 0x97: return 0x2014;
                        case 0x98: return 0x02DC;
                        case 0x99: return 0x2122;
                        case 0x9A: return 0x0161;
                        case 0x9B: return 0x203A;
                        case 0x9C: return 0x0153;
                        case 0x9D: return 0x009D;
                        case 0x9E: return 0x017E;
                        case 0x9F: return 0x0178;
                        default: {
                            if ((c >= 0xD800 && c <= 0xDFFF) || c > 0x10FFFF) {
                                return 0xFFFD;
                            }
                            else if ((c >= 0x0001 && c <= 0x0008) || (c >= 0x000E && c <= 0x001F) ||
                                (c >= 0x007F && c <= 0x009F) || (c >= 0xFDD0 && c <= 0xFDEF) ||
                                c === 0x000B || c === 0xFFFE || c === 0x1FFFE || c === 0x2FFFFE ||
                                c === 0x2FFFF || c === 0x3FFFE || c === 0x3FFFF || c === 0x4FFFE ||
                                c === 0x4FFFF || c === 0x5FFFE || c === 0x5FFFF || c === 0x6FFFE ||
                                c === 0x6FFFF || c === 0x7FFFE || c === 0x7FFFF || c === 0x8FFFE ||
                                c === 0x8FFFF || c === 0x9FFFE || c === 0x9FFFF || c === 0xAFFFE ||
                                c === 0xAFFFF || c === 0xBFFFE || c === 0xBFFFF || c === 0xCFFFE ||
                                c === 0xCFFFF || c === 0xDFFFE || c === 0xDFFFF || c === 0xEFFFE ||
                                c === 0xEFFFF || c === 0xFFFFE || c === 0xFFFFF || c === 0x10FFFE ||
                                c === 0x10FFFF) {
                                return c;
                            }
                        }
                    }
                };
                return EntityParserClass;
            }());
            exports_1("EntityParserClass", EntityParserClass);
            exports_1("EntityParser", EntityParser = new EntityParserClass());
        }
    };
});
