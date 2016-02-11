const NEWLINE = '\n'

export default function(options: { stats?: boolean } = {}): string {
    const lines: string[] = []
    lines.push("body { margin: 0; }")
    lines.push("canvas { width: 600px; height: 600px }")
    lines.push("#stats { position: absolute; top: 0; left: 0; }")
    return lines.join(NEWLINE).concat(NEWLINE)
}
