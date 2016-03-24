export default function(
  styleMarker: () => string,
  scriptsMarker: () => string,
  libsMarker: () => string,
  codeMarker: () => string,
  width: number,
  height: number,
  canvasId): string {
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
    `    <canvas id='${canvasId}'></canvas>\n` +
    "  </body>\n" +
    "</html>\n";
  return lines;
}
