const NEWLINE = '\n';

export default function MINIMAL_BOOTSTRAP(): string {
    const lines: string[] = [];
    lines.push("/**");
    lines.push(" * At least one import or export statement is required");
    lines.push(" * in order that this file be transpiled as a module.");
    lines.push(" */");
    lines.push("export const anything = true");
    lines.push("");
    lines.push("// The console has been hooked in the index.html file");
    lines.push("");
    lines.push("console.error('console.error(...)')");
    lines.push("console.warn('console.warn(...)')");
    lines.push("console.info('console.info(...)')");
    lines.push("console.log('console.log(...)')");
    return lines.join(NEWLINE).concat(NEWLINE);
}
