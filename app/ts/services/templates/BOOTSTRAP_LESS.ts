const NEWLINE = '\n'

export default function(
  width: number,
  height: number,
  options: {
    stats?: boolean
  } = {}): string {
  const lines: string[] = []

  lines.push("body { margin: 0; }")
  lines.push(`canvas { width: ${width}px; height: ${height}px }`)

  if (options.stats) {
    lines.push("#stats { position: absolute; top: 0; left: 0; }")
  }

  return lines.join(NEWLINE).concat(NEWLINE)
}
