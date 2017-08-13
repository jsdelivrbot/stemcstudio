const NEWLINE = '\n';

export function SYSTEM_CONFIG(tabString: string, moduleMap: { [moduleName: string]: string }): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push('//');
    lines.push('// Configuration of the System module loader.');
    lines.push('//');
    lines.push('System.config({');
    lines.push(_ + 'defaultJSExtensions: true,');
    lines.push(_ + 'map: {');
    for (const moduleName of Object.keys(moduleMap)) {
        lines.push(_ + _ + `"${moduleName}": "${moduleMap[moduleName]}"`);
    }
    lines.push(_ + '}');
    lines.push('});');
    return lines.join(NEWLINE).concat(NEWLINE);
}
