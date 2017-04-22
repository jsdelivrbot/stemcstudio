const NEWLINE = '\n';

export default function REACT_BOOTSTRAP(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("import * as React from 'react'");
    lines.push("import {render} from 'react-dom'");
    lines.push("");
    lines.push("render(");
    lines.push(_ + "<h1>Hello, world!</h1>,");
    lines.push(_ + "document.getElementById('container')");
    lines.push(")");
    return lines.join(NEWLINE).concat(NEWLINE);
}
