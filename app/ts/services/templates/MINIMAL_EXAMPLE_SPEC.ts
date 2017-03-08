const NEWLINE = '\n';

export default function MINIMAL_EXAMPLE_SPEC(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("// Run these specifications by selecting 'tests.html' from the 'Choose Program' toolbar menu.");
    lines.push('// For a complete list of examples, please see the Jasmine DOCS.');
    lines.push('export default function() {');
    lines.push(_ + 'describe("A suite", function() {');
    lines.push(_ + _ + 'it("contains spec with an expectation", function() {');
    lines.push(_ + _ + _ + 'expect(true).toBe(true)');
    lines.push(_ + _ + '})');
    lines.push(_ + '})');
    lines.push('');
    lines.push(_ + 'describe("A suite is just a function", function() {');
    lines.push(_ + _ + 'let a: boolean');
    lines.push(_ + _ + 'it("and so is a spec", function() {');
    lines.push(_ + _ + _ + 'a = true');
    lines.push(_ + _ + _ + 'expect(a).toBe(true)');
    lines.push(_ + _ + '})');
    lines.push(_ + '})');
    lines.push('');
    lines.push(_ + `describe("The 'toBe' matcher compares with ===", function() {`);
    lines.push(_ + _ + 'it("and has a positive test case", function() {');
    lines.push(_ + _ + _ + 'expect(true).toBe(true)');
    lines.push(_ + _ + '})');
    lines.push(_ + _ + 'it("and can have a negative case", function() {');
    lines.push(_ + _ + _ + 'expect(false).not.toBe(true)');
    lines.push(_ + _ + '})');
    lines.push(_ + '})');
    lines.push('}');
    return lines.join(NEWLINE).concat(NEWLINE);
}
