const NEWLINE = '\n';

export default function (options: {}, tabString: string): string {
    const _ = tabString;
    const lines: string[] = [];
    lines.push("<!DOCTYPE html>");
    lines.push("<html>");
    lines.push(_ + "<head>");
    lines.push(_ + _ + "<!-- STYLES-MARKER -->");
    lines.push(_ + _ + "<style>");
    lines.push(_ + _ + "/* STYLE-MARKER */");
    lines.push(_ + _ + "</style>");
    lines.push(_ + _ + "<script src='https://jspm.io/system.js'></script>");
    lines.push(_ + _ + "<!-- SHADERS-MARKER -->");
    lines.push(_ + _ + "<!-- SCRIPTS-MARKER -->");
    lines.push(_ + "</head>");
    lines.push(_ + "<body>");
    lines.push(_ + _ + "<canvas id='canvas3D'></canvas>");
    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + "// CODE-MARKER");
    lines.push(_ + _ + "</script>");
    lines.push(_ + _ + "<script>");
    lines.push(_ + _ + "System.import('./index.js')");
    lines.push(_ + _ + "</script>");
    lines.push(_ + "</body>");
    lines.push("</html>");
    return lines.join(NEWLINE).concat(NEWLINE);
}
