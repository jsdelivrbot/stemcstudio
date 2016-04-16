const NEWLINE = '\n'

export default function(options: {} = {}): string {
    const lines: string[] = []
    lines.push("body {")
    lines.push("    background-color: orange;")
    lines.push("}")
    return lines.join(NEWLINE).concat(NEWLINE)
}
