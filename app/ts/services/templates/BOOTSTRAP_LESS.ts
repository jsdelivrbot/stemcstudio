export default function(options: { stats?: boolean } = {}): string {
    const lines: string[] = []
    lines.push("body { margin: 0; }")
    lines.push("canvas { width: 600px; height: 600px }")
    if (options.stats) {
        lines.push("#stats { position: absolute; top: 0; left: 0; }")
    }
    lines.push("")
    return lines.join('\n');
}
