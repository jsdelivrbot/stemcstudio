const NEWLINE = '\n';

export default function(options: {} = {}): string {
    const lines: string[] = [];
    lines.push("export default function greeting(name: string) {");
    lines.push("    const text = document.createTextNode(`Hello, ${name}!`)");
    lines.push("    document.body.appendChild(text)");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
