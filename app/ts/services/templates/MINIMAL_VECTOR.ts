const NEWLINE = '\n';

export default function(options: {} = {}): string {
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export default class Vector {");
    lines.push("");
    lines.push("    /**");
    lines.push("     *");
    lines.push("     */");
    lines.push("    constructor(public x: number, public y: number) {");
    lines.push("    }");
    lines.push("");
    lines.push("    /**");
    lines.push("     *");
    lines.push("     */");
    lines.push("    get magnitude(): number {");
    lines.push("        return Math.sqrt(this.x * this.x + this.y * this.y)");
    lines.push("    }");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
