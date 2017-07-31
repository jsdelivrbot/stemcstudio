const NEWLINE = '\n';

export function VECTOR_3D_SPEC(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("import { Vector } from './vector'");
    lines.push("// Run these specifications by selecting 'tests.html' from the 'Choose Program' toolbar menu.");
    lines.push('// For a complete list of examples, please see the Jasmine DOCS.');
    lines.push('export function vectorSpec() {');
    lines.push(_ + 'describe("constructor", function() {');
    lines.push(_ + _ + 'const x = Math.random()');
    lines.push(_ + _ + 'const y = Math.random()');
    lines.push(_ + _ + 'const z = Math.random()');
    lines.push(_ + _ + 'const v = new Vector(x, y, z)');
    lines.push(_ + _ + 'it("should preserve x coordinate", function() {');
    lines.push(_ + _ + _ + 'expect(v.x).toBe(x)');
    lines.push(_ + _ + '})');
    lines.push(_ + _ + 'it("should preserve y coordinate", function() {');
    lines.push(_ + _ + _ + 'expect(v.y).toBe(y)');
    lines.push(_ + _ + '})');
    lines.push(_ + _ + 'it("should preserve z coordinate", function() {');
    lines.push(_ + _ + _ + 'expect(v.z).toBe(z)');
    lines.push(_ + _ + '})');
    lines.push(_ + '})');
    lines.push('}');
    return lines.join(NEWLINE).concat(NEWLINE);
}
