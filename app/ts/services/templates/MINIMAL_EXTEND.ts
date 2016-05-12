const NEWLINE = '\n';

export default function(options: {} = {}): string {
    const lines: string[] = [];
    lines.push("/*");
    lines.push(" * Helper function for extending the properties on objects.");
    lines.push(" */");
    lines.push("export default function extend<T>(destination: T, source: any): T {");
    lines.push("    for (let property in source) {");
    lines.push("        destination[property] = source[property]");
    lines.push("    }");
    lines.push("    return destination");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}

