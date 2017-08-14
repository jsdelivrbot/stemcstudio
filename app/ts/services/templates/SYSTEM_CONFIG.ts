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
    const moduleNames = Object.keys(moduleMap);
    const L = moduleNames.length;
    const uBound = L - 1;
    for (let i = 0; i < L; i++) {
        const moduleName = moduleNames[i];
        const maybeComma = (i < uBound) ? ',' : '';
        lines.push(_ + _ + `"${moduleName}": "${moduleMap[moduleName]}"${maybeComma}`);
    }
    lines.push(_ + '}');
    lines.push('});');
    return lines.join(NEWLINE).concat(NEWLINE);
}
