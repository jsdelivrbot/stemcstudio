const NEWLINE = '\n';

export default function (options: {}, tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("body {");
    lines.push(_ + "background-color: white;");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
