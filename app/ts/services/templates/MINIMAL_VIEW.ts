const NEWLINE = '\n';

export function MINIMAL_VIEW(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("import { Model } from './model'");
    lines.push("");
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export class View {");
    lines.push(_ + "/**");
    lines.push(_ + " *");
    lines.push(_ + " */");
    lines.push(_ + "constructor(private model: Model, private container: HTMLElement) {");
    lines.push(_ + "}");
    lines.push(_ + "draw() {");
    lines.push(_ + _ + "this.container.innerHTML = `Hello, ${this.model.name}!`");
    lines.push(_ + "}");
    lines.push("}");
    return lines.join(NEWLINE).concat(NEWLINE);
}
