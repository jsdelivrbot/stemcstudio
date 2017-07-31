const NEWLINE = '\n';

export function CANVAS_MAIN(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("import { Model } from './model'");
    lines.push("import { View } from './view'");
    lines.push("");
    lines.push("const model = new Model()");
    lines.push("");
    lines.push("model.rectangle.fillStyle = 'blue'");
    lines.push("model.rectangle.pos.x = 50");
    lines.push("model.rectangle.pos.y = 100");
    lines.push("");
    lines.push("model.square.fillStyle = 'red'");
    lines.push("model.square.pos.x = 0");
    lines.push("model.square.pos.y = 0");
    lines.push("");
    lines.push("const view = new View(model, document.getElementById('container') as HTMLElement)");
    lines.push("");
    lines.push("const animate = function(_timestamp: number) {");
    lines.push("");
    lines.push(_ + "view.draw()");
    lines.push("");
    lines.push(_ + "requestAnimationFrame(animate)");
    lines.push("}");
    lines.push("");
    lines.push("requestAnimationFrame(animate)");
    return lines.join(NEWLINE).concat(NEWLINE);
}
