const NEWLINE = '\n';

export default function(options: {} = {}): string {
    const lines: string[] = [];
    return lines.join(NEWLINE).concat(NEWLINE);
}
