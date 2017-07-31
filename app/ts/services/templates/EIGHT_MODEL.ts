const NEWLINE = '\n';

export function EIGHT_MODEL(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export class Model {");
    lines.push(_ + "timestamp: number");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
