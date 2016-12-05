const NEWLINE = '\n';

export default function (options: {}, tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push('export default function() {');
    lines.push(_ + 'describe("...", function() {');
    lines.push(_ + _ + 'it("should ...", function() {');
    lines.push(_ + _ + _ + 'expect(true).toBeTruthy()');
    lines.push(_ + _ + '})');
    lines.push(_ + '})');
    lines.push('}');
    return lines.join(NEWLINE).concat(NEWLINE);
}
