System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var InputStream;
    return {
        setters: [],
        execute: function () {
            InputStream = (function () {
                function InputStream() {
                    this.data = '';
                    this.start = 0;
                    this.committed = 0;
                    this.eof = false;
                    this.lastLocation = { line: 0, column: 0 };
                }
                InputStream.prototype.slice = function () {
                    if (this.start >= this.data.length) {
                        if (!this.eof)
                            throw InputStream.DRAIN;
                        return InputStream.EOF;
                    }
                    return this.data.slice(this.start, this.data.length);
                };
                InputStream.prototype.char = function () {
                    if (!this.eof && this.start >= this.data.length - 1)
                        throw InputStream.DRAIN;
                    if (this.start >= this.data.length) {
                        return InputStream.EOF;
                    }
                    var ch = this.data[this.start++];
                    if (ch === '\r')
                        ch = '\n';
                    return ch;
                };
                InputStream.prototype.advance = function (amount) {
                    this.start += amount;
                    if (this.start >= this.data.length) {
                        if (!this.eof)
                            throw InputStream.DRAIN;
                        return InputStream.EOF;
                    }
                    else {
                        if (this.committed > this.data.length / 2) {
                            this.lastLocation = this.location();
                            this.data = this.data.slice(this.committed);
                            this.start = this.start - this.committed;
                            this.committed = 0;
                        }
                    }
                };
                InputStream.prototype.matchWhile = function (re) {
                    if (this.eof && this.start >= this.data.length)
                        return '';
                    var r = new RegExp("^" + re + "+");
                    var m = r.exec(this.slice());
                    if (m) {
                        if (!this.eof && m[0].length === this.data.length - this.start)
                            throw InputStream.DRAIN;
                        this.advance(m[0].length);
                        return m[0];
                    }
                    else {
                        return '';
                    }
                };
                InputStream.prototype.matchUntil = function (re) {
                    var m, s;
                    s = this.slice();
                    if (s === InputStream.EOF) {
                        return '';
                    }
                    else if (m = new RegExp(re + (this.eof ? "|$" : "")).exec(s)) {
                        var t = this.data.slice(this.start, this.start + m.index);
                        this.advance(m.index);
                        return t.replace(/\r/g, '\n').replace(/\n{2,}/g, '\n');
                    }
                    else {
                        throw InputStream.DRAIN;
                    }
                };
                InputStream.prototype.append = function (data) {
                    this.data += data;
                };
                InputStream.prototype.shift = function (n) {
                    if (!this.eof && this.start + n >= this.data.length)
                        throw InputStream.DRAIN;
                    if (this.eof && this.start >= this.data.length)
                        return InputStream.EOF;
                    var d = this.data.slice(this.start, this.start + n).toString();
                    this.advance(Math.min(n, this.data.length - this.start));
                    return d;
                };
                InputStream.prototype.peek = function (n) {
                    if (!this.eof && this.start + n >= this.data.length)
                        throw InputStream.DRAIN;
                    if (this.eof && this.start >= this.data.length)
                        return InputStream.EOF;
                    return this.data.slice(this.start, Math.min(this.start + n, this.data.length)).toString();
                };
                InputStream.prototype.length = function () {
                    return this.data.length - this.start - 1;
                };
                InputStream.prototype.unget = function (d) {
                    if (d === InputStream.EOF)
                        return;
                    if (typeof d === 'string') {
                        this.start -= (d.length);
                    }
                    else {
                        throw new Error("Cannot unget(d = " + d + ")");
                    }
                };
                InputStream.prototype.undo = function () {
                    this.start = this.committed;
                };
                InputStream.prototype.commit = function () {
                    this.committed = this.start;
                };
                InputStream.prototype.location = function () {
                    var lastLine = this.lastLocation.line;
                    var lastColumn = this.lastLocation.column;
                    var read = this.data.slice(0, this.committed);
                    var newlines = read.match(/\n/g);
                    var line = newlines ? lastLine + newlines.length : lastLine;
                    var column = newlines ? read.length - read.lastIndexOf('\n') - 1 : lastColumn + read.length;
                    return { line: line, column: column };
                };
                return InputStream;
            }());
            InputStream.EOF = -1;
            InputStream.DRAIN = -2;
            exports_1("InputStream", InputStream);
        }
    };
});
