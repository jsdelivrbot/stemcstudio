const NEWLINE = '\n';

export function REACT_BOOTSTRAP(tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("import * as React from 'react'");
    lines.push("import { Component } from 'react'");
    lines.push("import { render } from 'react-dom'");
    lines.push("");
    lines.push("interface AppProps {");
    lines.push(_ + "greeting: string");
    lines.push("}");
    lines.push("");
    lines.push("interface AppSpec {");
    lines.push(_ + "name: string");
    lines.push("}");
    lines.push("");
    lines.push("class AppComponent extends Component<AppProps, AppSpec> {");
    lines.push(_ + "constructor(props: AppProps) {");
    lines.push(_ + _ + "super(props)");
    lines.push(_ + _ + "this.state = { name: 'World' }");
    lines.push(_ + "}");
    lines.push("");
    lines.push(_ + "render() {");
    lines.push(_ + _ + "return (");
    lines.push(_ + _ + _ + "<h1>{`${this.props.greeting}, ${this.state.name}!`}</h1>");
    lines.push(_ + _ + ")");
    lines.push(_ + "}");
    lines.push("}");
    lines.push("");
    lines.push("render(");
    lines.push(_ + "<AppComponent greeting='Hello' />,");
    lines.push(_ + "document.getElementById('container')");
    lines.push(")");
    return lines.join(NEWLINE).concat(NEWLINE);
}
