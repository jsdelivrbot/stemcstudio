export default function(options: { geometry?: string, dimensions?: number } = {}): string {

    const lines: string[] = []

    if (options.geometry) {
        lines.push("")
        lines.push("//////////////////////////////////////////////////")
        lines.push("// Shortcuts")
        // Multivector constants zero and one
        lines.push(`const zero = EIGHT.${options.geometry}${options.dimensions}.zero`)
        lines.push(`const one = EIGHT.${options.geometry}${options.dimensions}.one`)
        // Basis vectors
        if (options.dimensions >= 1) {
            lines.push(`const e1 = EIGHT.${options.geometry}${options.dimensions}.e1`)
        }
        if (options.dimensions >= 2) {
            lines.push(`const e2 = EIGHT.${options.geometry}${options.dimensions}.e2`)
        }
        if (options.dimensions >= 3) {
            lines.push(`const e3 = EIGHT.${options.geometry}${options.dimensions}.e3`)
        }
        lines.push(`const kilogram = EIGHT.${options.geometry}${options.dimensions}.kilogram`)
        lines.push(`const meter = EIGHT.${options.geometry}${options.dimensions}.meter`)
        lines.push(`const second = EIGHT.${options.geometry}${options.dimensions}.second`)

        lines.push("")
        lines.push("/**")
        lines.push(` * The pseudoscalar for the space.`)
        lines.push(" */")
        if (options.dimensions >= 3) {
            lines.push("const I  = e1 ^ e2 ^ e3")
        }
        else if (options.dimensions >= 2) {
            lines.push("const I  = e1 ^ e2")
        }
        else if (options.dimensions >= 1) {
            lines.push("const I  = e1")
        }

        lines.push("")
        lines.push("const exp = EIGHT.exp")
        lines.push("const log = EIGHT.log")
        lines.push("const cos = EIGHT.cos")
        lines.push("const sin = EIGHT.sin")
        lines.push("const pi = Math.PI")
        lines.push("")
        lines.push("/**")
        lines.push(" * dual(m), sign depends on who you talk to.")
        lines.push(" */")
        lines.push(`function dual(m: EIGHT.${options.geometry}${options.dimensions}): EIGHT.${options.geometry}${options.dimensions} {`)
        lines.push("  // return m << (I / (I * I)) // Dorst, Fontijne, Mann")
        lines.push("  return I * m // Hestenes, Doran, Lasenby")
        lines.push("}")

        lines.push("")
        lines.push("//////////////////////////////////////////////////")
        lines.push("// VPython-like functions")
        lines.push("")
        lines.push("/**")
        lines.push(" * Constructs a vector from Cartesian coordinates with the standard basis [e1, e2, e3]")
        lines.push(" */")
        lines.push(`const vec = EIGHT.${options.geometry}${options.dimensions}.vector`)

        lines.push("")
        lines.push("/**")
        lines.push(" * Constructs a scalar from a number and optional unit of measure")
        lines.push(" */")
        lines.push(`const scalar = EIGHT.${options.geometry}${options.dimensions}.scalar`)

        lines.push("")
        lines.push("/**")
        lines.push(" * Logs to the system console (Ctrl+Shift+J)")
        lines.push(" */")
        lines.push("function print(arg: any): void {")
        lines.push("  console.log(`${arg}`)")
        lines.push("}")
    }
    lines.push("")

    return lines.join('\n');
}
