export default function(styleMarker: () => string, scriptsMarker: () => string, libsMarker: () => string, codeMarker: () => string): string {
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
        "    <canvas id='my-canvas'></canvas>\n" +
        "  </body>\n" +
        "</html>\n";
    return lines;
}