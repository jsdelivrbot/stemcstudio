const NEWLINE = '\n';

export default function(options: {} = {}): string {
    const lines: string[] = [];
    lines.push("import Vector from './Vector'");
    lines.push("");
    lines.push("export default function() {");
    lines.push("    describe(\"constructor\", function() {");
    lines.push("        it(\"should initialize coordinates\", function() {");
    lines.push("            const v = new Vector(2, 3)");
    lines.push("            expect(v).toBeDefined()");
    lines.push("            expect(v.x).toBe(2)");
    lines.push("            expect(v.y).toBe(3)");
    lines.push("        })");
    lines.push("    })");
    lines.push("    describe(\"magnitude (3, 4)\", function() {");
    lines.push("        it(\"should be 5\", function() {");
    lines.push("            const v = new Vector(3, 4)");
    lines.push("            expect(v.magnitude).toBe(5)");
    lines.push("        })");
    lines.push("    })");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
