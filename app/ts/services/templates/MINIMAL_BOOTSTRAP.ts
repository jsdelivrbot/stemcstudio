const NEWLINE = '\n'

export default function(options: {} = {}): string {
    const lines: string[] = []
    lines.push("import greeting from './greeting'")
    lines.push("")
    lines.push('greeting("World")')
    return lines.join(NEWLINE).concat(NEWLINE)
}
