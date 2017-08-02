const NEWLINE = '\n';

export function EIGHT_MODEL(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("import { Vector } from './vector'");
    lines.push("");
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export class Body {");
    lines.push(_ + "readonly position = new Vector(0, 0, 0)");
    lines.push(_ + "width: number");
    lines.push(_ + "height: number");
    lines.push(_ + "depth: number");
    lines.push(_ + "constructor(width: number, height: number, depth: number) {");
    lines.push(_ + _ + "this.width = width");
    lines.push(_ + _ + "this.height = height");
    lines.push(_ + _ + "this.depth = depth");
    lines.push(_ + "}");
    lines.push("}");
    lines.push("");
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export class Model {");
    lines.push(_ + "readonly body = new Body(1, 1, 1)");
    lines.push(_ + "timestamp = 0");
    lines.push(_ + "constructor() {");
    lines.push(_ + "}");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
