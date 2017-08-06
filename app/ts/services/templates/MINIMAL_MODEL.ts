const NEWLINE = '\n';

export function MINIMAL_MODEL(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export class Model {");
    lines.push(_ + "name: string");
    lines.push(_ + "constructor() {");
    lines.push(_ + "}");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
