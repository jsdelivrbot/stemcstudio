const NEWLINE = '\n';

export function VECTOR(tabString: string, dims: number): string {
    const coords = ['x', 'y', 'z', 'w'].filter((value, index) => { return index < dims; });
    const _ = tabString;
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export class Vector {");
    for (const coord of coords) {
        lines.push(_ + `${coord}: number`);
    }
    const args = coords.map((coord) => `${coord}: number`).join(', ');
    lines.push(_ + `constructor(${args}) {`);
    for (const coord of coords) {
        lines.push(_ + _ + `this.${coord} = ${coord}`);
    }
    lines.push(_ + "}");
    lines.push(_ + "/**");
    lines.push(_ + " * Adds the rhs vector to this vector.");
    lines.push(_ + " * This corresponds to the assignment...");
    lines.push(_ + " * this := this + rhs");
    lines.push(_ + " * Returns this in order to support method chaining.");
    lines.push(_ + " */");
    lines.push(_ + "add(rhs: Vector): this {");
    for (const coord of coords) {
        lines.push(_ + _ + `this.${coord} += rhs.${coord}`);
    }
    lines.push(_ + _ + "return this");
    lines.push(_ + "}");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
