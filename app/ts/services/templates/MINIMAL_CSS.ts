const NEWLINE = '\n';

export function MINIMAL_CSS(tabString: string, options: { hideOverflow: boolean }): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("body {");
    lines.push(_ + "background-color: white;");
    lines.push(_ + "font-family: Roboto, Arial, sans-serif;");
    lines.push(_ + "color: #333333;");
    if (options.hideOverflow) {
        lines.push(_ + "overflow: hidden;");
    }
    lines.push("}");
    /*
    lines.push("");
    lines.push("h1 {");
    lines.push(_ + "font-family: Arial, sans-serif;");
    lines.push(_ + "color: #333333;");
    lines.push("}");
    lines.push("");
    lines.push("h2 {");
    lines.push(_ + "font-family: Arial, sans-serif;");
    lines.push(_ + "color: #333333;");
    lines.push("}");
    lines.push("");
    lines.push("h3 {");
    lines.push(_ + "font-family: Arial, sans-serif;");
    lines.push(_ + "color: #333333;");
    lines.push("}");
    lines.push("");
    lines.push("h4 {");
    lines.push(_ + "font-family: Arial, sans-serif;");
    lines.push(_ + "color: #333333;");
    lines.push("}");
    lines.push("");
    lines.push("h5 {");
    lines.push(_ + "font-family: Arial, sans-serif;");
    lines.push(_ + "color: #333333;");
    lines.push("}");
    */
    /*
    lines.push("");
    lines.push("#errors {");
    lines.push(_ + "background: #ff99bb;");
    lines.push(_ + "color: #333333;");
    lines.push(_ + "display: 'none';");
    lines.push(_ + "margin: -20px -20px 20px;");
    lines.push(_ + "padding: 20px;");
    lines.push(_ + "white-space: 'pre-wrap';");
    lines.push("}");
    lines.push("");
    lines.push("#warnings {");
    lines.push(_ + "background: #ffffb3;");
    lines.push(_ + "color: #333333;");
    lines.push(_ + "display: 'none';");
    lines.push(_ + "margin: -20px -20px 20px;");
    lines.push(_ + "padding: 20px;");
    lines.push(_ + "white-space: 'pre-wrap';");
    lines.push("}");
    lines.push("");
    lines.push("#infos {");
    lines.push(_ + "background: #99ff99;");
    lines.push(_ + "color: #333333;");
    lines.push(_ + "display: 'none';");
    lines.push(_ + "margin: -20px -20px 20px;");
    lines.push(_ + "padding: 20px;");
    lines.push(_ + "white-space: 'pre-wrap';");
    lines.push("}");
    */
    return lines.join(NEWLINE).concat(NEWLINE);
}
