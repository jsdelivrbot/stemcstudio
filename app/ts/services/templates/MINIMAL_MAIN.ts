const NEWLINE = '\n';

export function MINIMAL_MAIN(tabString: string): string {
    // const _ = tabString;
    const lines: string[] = [];
    lines.push("import { Model } from './model'");
    lines.push("import { View } from './view'");
    lines.push("");
    lines.push("const model = new Model()");
    lines.push("");
    lines.push('model.name = "World"');
    lines.push("");
    lines.push("const view = new View(model, document.getElementById('container') as HTMLElement)");
    lines.push("");
    lines.push("view.draw()");
    return lines.join(NEWLINE).concat(NEWLINE);
}
