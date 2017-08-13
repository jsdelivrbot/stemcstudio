const NEWLINE = '\n';

export function TYPES_CONFIG(tabString: string, moduleMap: { [moduleName: string]: string }): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push('{');
    lines.push(_ + '"map": {');
    for (const moduleName of Object.keys(moduleMap)) {
        lines.push(_ + _ + `"${moduleName}": "${moduleMap[moduleName]}"`);
    }
    lines.push(_ + '}');
    lines.push('}');
    return lines.join(NEWLINE).concat(NEWLINE);
}
