const NEWLINE = '\n';

export function EIGHT_MAIN(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("import { Model } from './model'");
    lines.push("import { View } from './view'");
    lines.push("");
    lines.push("const model = new Model()");
    lines.push("");
    lines.push("const view = new View(model, 'canvas3D')");
    lines.push("");
    lines.push("const animate = function(timestamp: number) {");
    lines.push("");
    lines.push(_ + "model.timestamp = timestamp");
    lines.push("");
    lines.push(_ + "view.render()");
    lines.push("");
    lines.push(_ + "requestAnimationFrame(animate)");
    lines.push("}");
    lines.push("");
    lines.push("requestAnimationFrame(animate)");
    return lines.join(NEWLINE).concat(NEWLINE);
}
