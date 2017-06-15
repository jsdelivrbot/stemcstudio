System.register(["./isWhitespace"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function CharacterBuffer(characters) {
        this.characters = characters;
        this.current = 0;
        this.end = this.characters.length;
    }
    exports_1("CharacterBuffer", CharacterBuffer);
    var isWhitespace_1;
    return {
        setters: [
            function (isWhitespace_1_1) {
                isWhitespace_1 = isWhitespace_1_1;
            }
        ],
        execute: function () {
            CharacterBuffer.prototype.skipAtMostOneLeadingNewline = function () {
                if (this.characters[this.current] === '\n')
                    this.current++;
            };
            CharacterBuffer.prototype.skipLeadingWhitespace = function () {
                while (isWhitespace_1.isWhitespace(this.characters[this.current])) {
                    if (++this.current === this.end)
                        return;
                }
            };
            CharacterBuffer.prototype.skipLeadingNonWhitespace = function () {
                while (!isWhitespace_1.isWhitespace(this.characters[this.current])) {
                    if (++this.current === this.end)
                        return;
                }
            };
            CharacterBuffer.prototype.takeRemaining = function () {
                return this.characters.substring(this.current);
            };
            CharacterBuffer.prototype.takeLeadingWhitespace = function () {
                var start = this.current;
                this.skipLeadingWhitespace();
                if (start === this.current)
                    return "";
                return this.characters.substring(start, this.current - start);
            };
            Object.defineProperty(CharacterBuffer.prototype, 'length', {
                get: function () {
                    return this.end - this.current;
                }
            });
        }
    };
});
