export default function(options: { geometry?: string, dimensions?: number } = {}): string {

    const lines: string[] = []

    if (options.geometry) {
        lines.push(`const zero = EIGHT.${options.geometry}${options.dimensions}.zero`)
        lines.push(`const one = EIGHT.${options.geometry}${options.dimensions}.one`)
        lines.push(`const e1 = EIGHT.${options.geometry}${options.dimensions}.e1`)
        lines.push(`const e2 = EIGHT.${options.geometry}${options.dimensions}.e2`)

        if (options.dimensions >= 3) {
            lines.push(`const e3 = EIGHT.${options.geometry}${options.dimensions}.e3`)
        }

        lines.push("")
        lines.push("/**")
        lines.push(` * The pseudoscalar for the ${options.geometry} Space.`)
        lines.push(" */")
        if (options.dimensions >= 3) {
            lines.push("const I  = e1 ^ e2 ^ e3")
        }
        else {
            lines.push("const I  = e1 ^ e2")
        }
        lines.push("")
        lines.push("const exp = EIGHT.exp")
        lines.push("const log = EIGHT.log")
        lines.push("const cos = EIGHT.cos")
        lines.push("const sin = EIGHT.sin")
        lines.push("")
        lines.push("/**")
        lines.push(" * dual(m), sign depends on who you talk to.")
        lines.push(" */")
        lines.push(`function dual(m: EIGHT.${options.geometry}${options.dimensions}): EIGHT.${options.geometry}${options.dimensions} {`)
        lines.push("  // return m << (I / (I * I)) // Dorst, Fontijne, Mann")
        lines.push("  return I * m // Hestenes, Doran, Lasenby")
        lines.push("}")
    }
    lines.push("")

    return lines.join('\n');
}
