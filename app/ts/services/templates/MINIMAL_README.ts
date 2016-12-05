const NEWLINE = '\n';

export default function (options: {}, tabString: string): string {
    // const _ = tabString;
    const lines: string[] = [];
    lines.push("# Getting Started with STEMCstudio");
    lines.push("");
    lines.push("## Overview");
    lines.push("");
    lines.push("This brief example demonstrates some *Best Practices* for developing your programs:");
    lines.push("");
    lines.push("- Modularity,");
    lines.push("- Documentation, and");
    lines.push("- Unit Testing.");
    lines.push("");
    lines.push("It also explains how the various files work together.");
    lines.push("");
    lines.push("*For information on specific libraries, e.g. WebGL Graphics and Geometric Algebra, please see the examples and consult the links in the Properties menu.*");
    lines.push("");
    lines.push("## Modularity");
    lines.push("");
    lines.push([
        "It is extremely beneficial to be able to split your application or library into multiple files, ",
        "each with a cohesive purpose. Up until recently, re-assembling them in JavaScript ",
        "was error prone because of the need to manually manage file dependencies. ",
        "But no more! The *ES6 modules* specification allows you to easily describe the dependencies between ",
        "the modules that comprise your application so that the system-wide module loader, `System` ",
        "can load them strictly according to their dependencies."].join(''));
    lines.push("");
    lines.push("## Documentaion");
    lines.push("");
    lines.push([
        "Documentation of your software can take many forms. STEMCstudio supports the *Markdown* format ",
        "making it easy to create application- or library-level documentation. ",
        "The contents of the `README.md` file, transpiled to HTML, are displayed while ",
        "your application is *not* running. The `README.md` file is also a prominent artifact in GitHub."].join(''));
    lines.push("");
    lines.push("## Unit Testing");
    lines.push("");
    lines.push("Unit Testing is supported using Jasmine.");
    lines.push("");
    lines.push("# How It Works");
    lines.push("");
    lines.push("## index.html");
    lines.push("");
    lines.push("You may define many views in one project, but this file is recognized by name as the default view.");
    lines.push("");
    lines.push("Your ES6 modules are inserted at the ```// CODE-MARKER```.");
    lines.push("");
    lines.push("Importing your top-level module, e.g. index.js using");
    lines.push("");
    lines.push("```");
    lines.push("System.import('./index.js')");
    lines.push("```");
    lines.push("");
    lines.push("will begin the execution of your program.");
    lines.push("");
    lines.push("The System module loader will manage dependencies for you through `import` and `export` statements.");
    lines.push("");
    lines.push("## index.ts");
    lines.push("");
    lines.push("Notice how it `import`s its dependencies and how they are `export`ed from other files.");
    lines.push("");
    lines.push("## style.css");
    lines.push("");
    lines.push("The contents of this file are inserted into index.html at the ```/* STYLE-MARKER */```.");
    lines.push("");
    lines.push("## Dependencies");
    lines.push("");
    lines.push([
        "External dependencies are defined using the *Properties* menu and are included ",
        "as &lt;script&gt; elements at the ```<!--- SCRIPTS-MARKER -->```."].join(''));
    lines.push("");
    lines.push("You may add other external dependencies directly to the `index.html` file.");
    lines.push("");
    lines.push("## README.md");
    lines.push("");
    lines.push("Refer to the `README.md` file to see how the following HTML was created.");
    lines.push("");
    lines.push("#h1");
    lines.push("##h2");
    lines.push("###h3");
    lines.push("####h4");
    lines.push("");
    lines.push("*emphasis*");
    lines.push("");
    lines.push("**bold**");
    lines.push("");
    lines.push("```");
    lines.push("code");
    lines.push("```");
    lines.push("");
    lines.push("MathJax: \\\\[\\nabla M \\ne 0\\\\]");
    lines.push("");
    lines.push("Copyright (c) 2016 David Geo Holmes.");
    lines.push("");
    return lines.join(NEWLINE).concat(NEWLINE);
}
