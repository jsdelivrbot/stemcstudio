const NEWLINE = '\n';

export function EIGHT_MODEL(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("import { vec, Vector } from './vector'");
    lines.push("");
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export class Body {");
    lines.push(_ + "position: Vector = vec(0, 0, 0)");
    lines.push(_ + "constructor() {");
    lines.push(_ + "}");
    lines.push("}");
    lines.push("");
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export class Model {");
    lines.push(_ + "readonly body = new Body()");
    lines.push(_ + "timestamp = 0");
    lines.push(_ + "constructor() {");
    lines.push(_ + "}");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
