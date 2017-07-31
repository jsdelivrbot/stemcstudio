const NEWLINE = '\n';

export function VECTOR_3D(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export class Vector {");
    lines.push(_ + "x: number");
    lines.push(_ + "y: number");
    lines.push(_ + "z: number");
    lines.push(_ + "constructor(x: number, y: number, z: number) {");
    lines.push(_ + _ + "this.x = x");
    lines.push(_ + _ + "this.y = y");
    lines.push(_ + _ + "this.z = z");
    lines.push(_ + "}");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
