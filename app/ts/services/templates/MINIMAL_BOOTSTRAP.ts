const NEWLINE = '\n';

export function MINIMAL_BOOTSTRAP(): string {
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" * At least one import or export statement is required");
    lines.push(" * in order that this file be transpiled as a module.");
    lines.push(" *");
    lines.push(" * The following line may be removed when using your own modules.");
    lines.push(" */");
    lines.push("export const anything = true");
    lines.push("");
    lines.push(`document.writeln("<h1>Hello, World!</h1>")`);
    return lines.join(NEWLINE).concat(NEWLINE);
}
