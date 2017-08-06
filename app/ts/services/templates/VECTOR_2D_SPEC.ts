const NEWLINE = '\n';

export function VECTOR_2D_SPEC(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("import { vec } from './vector'");
    lines.push("// Run these specifications by selecting 'tests.html' from the 'Choose Program' toolbar menu.");
    lines.push('// For a complete list of examples, please see the Jasmine DOCS.');
    lines.push('export function vectorSpec() {');
    lines.push(_ + 'describe("constructor", function() {');
    lines.push(_ + _ + 'const x = Math.random()');
    lines.push(_ + _ + 'const y = Math.random()');
    lines.push(_ + _ + 'const v = vec(x, y)');
    lines.push(_ + _ + 'it("should preserve x coordinate", function() {');
    lines.push(_ + _ + _ + 'expect(v.x).toBe(x)');
    lines.push(_ + _ + '})');
    lines.push(_ + _ + 'it("should preserve y coordinate", function() {');
    lines.push(_ + _ + _ + 'expect(v.y).toBe(y)');
    lines.push(_ + _ + '})');
    lines.push(_ + '})');
    lines.push(_ + 'describe("addition, +", function() {');
    lines.push(_ + _ + 'const a = vec(1, 2)');
    lines.push(_ + _ + 'const b = vec(3, 4)');
    lines.push(_ + _ + 'const c = a + b');
    lines.push(_ + _ + 'it("should compute the x coordinate", function() {');
    lines.push(_ + _ + _ + 'expect(c.x).toBe(4)');
    lines.push(_ + _ + '})');
    lines.push(_ + _ + 'it("should compute the y coordinate", function() {');
    lines.push(_ + _ + _ + 'expect(c.y).toBe(6)');
    lines.push(_ + _ + '})');
    lines.push(_ + _ + 'it("should not return this", function() {');
    lines.push(_ + _ + _ + 'expect(c !== a).toBe(true)');
    lines.push(_ + _ + '})');
    lines.push(_ + _ + 'it("should leave rhs unchanged", function() {');
    lines.push(_ + _ + _ + 'expect(b.x).toBe(3)');
    lines.push(_ + _ + _ + 'expect(b.y).toBe(4)');
    lines.push(_ + _ + '})');
    lines.push(_ + '})');
    lines.push('}');
    return lines.join(NEWLINE).concat(NEWLINE);
}
