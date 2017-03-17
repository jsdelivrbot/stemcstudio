const NEWLINE = '\n';

export interface HtmlOptions {
    canvasId?: string;
}

/**
 * tabString is supplied from the editor settings.
 * bootstrap is the System.import method argument, usually './index.js' for the 'index.ts' entry point.
 */
export function HTML(tabString: string, bootstrap: string, systemJsUrl: string, options: Partial<HtmlOptions> = {}): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("<!DOCTYPE html>");
    lines.push("<!--");
    lines.push(_ + "STEMCstudio HTML file template.");
    lines.push(_ + "The marker below comments define the locations for CSS, CSV, GLSL,");
    lines.push(_ + "JavaScript and transpiled TypeScript insertion.");
    lines.push(_ + "You may make changes to this file, but these markers should be preseved.");
    lines.push(_ + "Please refer to the User Guide for more details.");
    lines.push("-->");
    lines.push("<html>");
    lines.push(_ + "<head>");
    lines.push(_ + _ + "<!-- STYLES-MARKER -->");
    lines.push(_ + _ + "<style>");
    lines.push(_ + _ + "/* STYLE-MARKER */");
    lines.push(_ + _ + "</style>");
    lines.push(_ + _ + `<script src='${systemJsUrl}'></script>`);
    lines.push(_ + _ + "<!-- CSV-FILES-MARKER -->");
    lines.push(_ + _ + "<!-- SHADERS-MARKER -->");
    lines.push(_ + _ + "<!-- SCRIPTS-MARKER -->");
    lines.push(_ + "</head>");
    lines.push(_ + "<body>");
    if (typeof options.canvasId === 'string') {
        lines.push(_ + _ + `<canvas id='${options.canvasId}'></canvas>`);
    }
    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + "// CODE-MARKER");
    lines.push(_ + _ + "</script>");
    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + `SystemJS.import('${bootstrap}')`);
    lines.push(_ + _ + "</script>");
    lines.push(_ + "</body>");
    lines.push("</html>");
    return lines.join(NEWLINE).concat(NEWLINE);
}
