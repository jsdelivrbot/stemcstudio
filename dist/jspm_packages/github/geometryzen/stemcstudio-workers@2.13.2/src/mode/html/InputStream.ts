// FIXME convert CR to LF http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#input-stream
export class InputStream {
    data: string;
    start: number;
    committed: number;
    eof: boolean;
    lastLocation: { line: number; column: number };
    constructor() {
        this.data = '';
        this.start = 0;
        this.committed = 0;
        this.eof = false;
        this.lastLocation = { line: 0, column: 0 };
    }
    slice(): number | string {
        if (this.start >= this.data.length) {
            if (!this.eof) throw InputStream.DRAIN;
            return InputStream.EOF;
        }
        return this.data.slice(this.start, this.data.length);
    }
    char(): number | string {
        if (!this.eof && this.start >= this.data.length - 1) throw InputStream.DRAIN;
        if (this.start >= this.data.length) {
            return InputStream.EOF;
        }
        var ch = this.data[this.start++];
        if (ch === '\r')
            ch = '\n';
        return ch;
    }
    advance(amount: number): number {
        this.start += amount;
        if (this.start >= this.data.length) {
            if (!this.eof) throw InputStream.DRAIN;
            return InputStream.EOF;
        }
        else {
            if (this.committed > this.data.length / 2) {
                // Sliiiide
                this.lastLocation = this.location();
                this.data = this.data.slice(this.committed);
                this.start = this.start - this.committed;
                this.committed = 0;
            }
        }
    }
    matchWhile(re: string): string {
        if (this.eof && this.start >= this.data.length) return '';
        const r = new RegExp("^" + re + "+");
        const m = r.exec(this.slice() as string);
        if (m) {
            if (!this.eof && m[0].length === this.data.length - this.start) throw InputStream.DRAIN;
            this.advance(m[0].length);
            return m[0];
        }
        else {
            return '';
        }
    }
    matchUntil(re: string): string {
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
    }
    append(data: string): void {
        this.data += data;
    }
    shift(n: number): number | string {
        if (!this.eof && this.start + n >= this.data.length) throw InputStream.DRAIN;
        if (this.eof && this.start >= this.data.length) return InputStream.EOF;
        const d = this.data.slice(this.start, this.start + n).toString();
        this.advance(Math.min(n, this.data.length - this.start));
        return d;
    }
    peek(n: number): number | string {
        if (!this.eof && this.start + n >= this.data.length) throw InputStream.DRAIN;
        if (this.eof && this.start >= this.data.length) return InputStream.EOF;
        return this.data.slice(this.start, Math.min(this.start + n, this.data.length)).toString();
    }
    length(): number {
        return this.data.length - this.start - 1;
    }
    unget(d: number | string): void {
        if (d === InputStream.EOF) return;
        if (typeof d === 'string') {
            this.start -= (d.length);
        }
        else {
            throw new Error(`Cannot unget(d = ${d})`);
        }
    }
    undo(): void {
        this.start = this.committed;
    }
    commit(): void {
        this.committed = this.start;
    }
    location() {
        const lastLine = this.lastLocation.line;
        const lastColumn = this.lastLocation.column;
        const read = this.data.slice(0, this.committed);
        const newlines = read.match(/\n/g);
        const line = newlines ? lastLine + newlines.length : lastLine;
        const column = newlines ? read.length - read.lastIndexOf('\n') - 1 : lastColumn + read.length;
        return { line: line, column: column };
    }
    static EOF = -1;
    static DRAIN = -2;
}
