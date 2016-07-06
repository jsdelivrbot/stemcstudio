const NEWLINE = '\n';

export default function(options: {} = {}): string {
    const lines: string[] = [];
    lines.push('export default function() {');
    lines.push('    describe("...", function() {');
    lines.push('        it("should ...", function() {');
    lines.push('            expect(true).toBeTruthy()');
    lines.push('        })');
    lines.push('    })');
    lines.push('}');
    return lines.join(NEWLINE).concat(NEWLINE);
}
