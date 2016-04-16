const NEWLINE = '\n'

export default function(options: {} = {}): string {
    const lines: string[] = []
    lines.push("# Getting Started")
    lines.push("")
    lines.push("")
    return lines.join(NEWLINE).concat(NEWLINE)
}
