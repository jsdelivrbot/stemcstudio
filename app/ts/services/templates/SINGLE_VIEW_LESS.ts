export default function(width: number, height: number): string {
  const lines = "" +
    "body { margin: 0; }\n" +
    `canvas { width: ${width}px; height: ${height}px }\n` +
    "#stats { position: absolute; top: 0; left: 0; }\n";
  return lines;
}
