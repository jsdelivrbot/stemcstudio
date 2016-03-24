export default function(
  styleMarker: () => string,
  scriptsMarker: () => string,
  libsMarker: () => string,
  codeMarker: () => string,
  width: number,
  height: number,
  canvasId: string
): string {

  const lines: string[] = []

  lines.push("<!doctype html>\n")
  lines.push("<html>\n")
  lines.push("  <head>\n")
  lines.push(styleMarker())
  lines.push(scriptsMarker())
  lines.push("  </head>\n")
  lines.push("  <body>\n")
  lines.push(libsMarker())
  lines.push(codeMarker())
  lines.push(`    <canvas id='${canvasId}' width='${width}' height='${height}'></canvas>\n`)
  lines.push("  </body>\n")
  lines.push("</html>\n")

  return lines.join('')
}
