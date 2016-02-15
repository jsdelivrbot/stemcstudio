export default function(
    styleMarker: () => string,
    scriptsMarker: () => string,
    libsMarker: () => string,
    codeMarker: () => string,
    width: number,
    height: number,
    canvasId: string
): string {
    const lines = "" +
        "<!doctype html>\n" +
        "<html>\n" +
        "  <head>\n" +
        styleMarker() +
        scriptsMarker() +
        "  </head>\n" +
        "  <body>\n" +
        libsMarker() +
        codeMarker() +
        "    <div id='container'>\n" +
        `      <canvas id='${canvasId}' width='${width}' height='${height}'></canvas>\n` +
        "      <div id='overlay'></div>\n" +
        "    </div>\n" +
        "  </body>\n" +
        "</html>\n";
    return lines;
}