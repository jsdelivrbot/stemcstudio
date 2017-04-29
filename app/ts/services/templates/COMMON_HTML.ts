const NEWLINE = '\n';

export interface HtmlOptions {
    canvasId?: string;
    containerId?: string;
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
    lines.push(_ + "tsCodeHub HTML file template.");
    lines.push(_ + "The marker below comments define the locations for CSS, CSV, GLSL,");
    lines.push(_ + "JavaScript and transpiled TypeScript insertion.");
    lines.push(_ + "You may make changes to this file, but these markers should be preseved.");
    lines.push(_ + "Please refer to the User Guide for more details.");
    lines.push("-->");
    lines.push("<html>");
    lines.push(_ + "<head>");
    lines.push(_ + _ + "<base href='/'>");
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

    lines.push(_ + _ + "<div id='errors' style='display: none;'></div>");
    lines.push(_ + _ + "<div id='warnings' style='display: none;'></div>");
    lines.push(_ + _ + "<div id='infos' style='display: none;'></div>");
    lines.push(_ + _ + "<div id='logs' style='display: none;'></div>");

    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + "console.error = (function(old) {");
    lines.push(_ + _ + _ + "return function error() {");
    lines.push(_ + _ + _ + _ + "errors.textContent += Array.prototype.slice.call(arguments).join(' ') + '\\n'");
    lines.push(_ + _ + _ + _ + "errors.style.display = ''");
    lines.push(_ + _ + _ + _ + "old.apply(this, arguments)");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "})(console.error)");
    lines.push(_ + _ + "</script>");

    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + "console.warn = (function(old) {");
    lines.push(_ + _ + _ + "return function warn() {");
    lines.push(_ + _ + _ + _ + "warnings.textContent += Array.prototype.slice.call(arguments).join(' ') + '\\n'");
    lines.push(_ + _ + _ + _ + "warnings.style.display = ''");
    lines.push(_ + _ + _ + _ + "old.apply(this, arguments)");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "})(console.warn)");
    lines.push(_ + _ + "</script>");

    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + "console.info = (function(old) {");
    lines.push(_ + _ + _ + "return function info() {");
    lines.push(_ + _ + _ + _ + "infos.textContent += Array.prototype.slice.call(arguments).join(' ') + '\\n'");
    lines.push(_ + _ + _ + _ + "infos.style.display = ''");
    lines.push(_ + _ + _ + _ + "old.apply(this, arguments)");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "})(console.info)");
    lines.push(_ + _ + "</script>");

    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + "console.log = (function(old) {");
    lines.push(_ + _ + _ + "return function log() {");
    lines.push(_ + _ + _ + _ + "logs.textContent += Array.prototype.slice.call(arguments).join(' ') + '\\n'");
    lines.push(_ + _ + _ + _ + "logs.style.display = ''");
    lines.push(_ + _ + _ + _ + "old.apply(this, arguments)");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "})(console.log)");
    lines.push(_ + _ + "</script>");

    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + "window.onerror = function(message, source, line, col, error) {");
    lines.push(_ + _ + _ + "var text = error ? error.stack || error : message + ' (at ' + source + ':' + line + ':' + col + ')'");
    lines.push(_ + _ + _ + "errors.textContent += text + '\\n'");
    lines.push(_ + _ + _ + "errors.style.display = ''");
    lines.push(_ + _ + "}");
    lines.push(_ + _ + "</script>");

    if (typeof options.canvasId === 'string') {
        lines.push(_ + _ + `<canvas id='${options.canvasId}'></canvas>`);
    }

    if (typeof options.containerId === 'string') {
        lines.push(_ + _ + `<div id='${options.containerId}'></div>`);
    }

    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + "// CODE-MARKER");
    lines.push(_ + _ + "</script>");
    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + `System.import('${bootstrap}').catch((e) => {console.error(e)})`);
    lines.push(_ + _ + "</script>");
    lines.push(_ + "</body>");
    lines.push("</html>");
    return lines.join(NEWLINE).concat(NEWLINE);
}
