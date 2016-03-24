export default function(options: { geometry?: string, dimensions?: number } = {}): string {

  const lines: string[] = []

  if (options.geometry) {
    lines.push("")
    lines.push("//////////////////////////////////////////////////")
    lines.push("// Standard Basis")
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
    lines.push("//////////////////////////////////////////////////")
    lines.push("// Units of Measure")
    lines.push(`const kilogram = EIGHT.${options.geometry}${options.dimensions}.kilogram`)
    lines.push(`const meter = EIGHT.${options.geometry}${options.dimensions}.meter`)
    lines.push(`const second = EIGHT.${options.geometry}${options.dimensions}.second`)
  }

  lines.push("")
  lines.push("//////////////////////////////////////////////////")
  lines.push("// Universal Mathematical Functions")
  lines.push("const exp = EIGHT.exp")
  lines.push("const log = EIGHT.log")
  lines.push("const cos = EIGHT.cos")
  lines.push("const sin = EIGHT.sin")

  lines.push("")
  lines.push("//////////////////////////////////////////////////")
  lines.push("// Constants")
  lines.push("/**")
  lines.push(" * ")
  lines.push(" */")
  lines.push("const pi = Math.PI")

  lines.push("")
  lines.push("//////////////////////////////////////////////////")
  lines.push("// Colors")
  lines.push("")
  lines.push('const black = EIGHT.Color.black')
  lines.push('const blue = EIGHT.Color.blue')
  lines.push('const cyan = EIGHT.Color.cyan')
  lines.push('const green = EIGHT.Color.green')
  lines.push('const magenta = EIGHT.Color.magenta')
  lines.push('const red = EIGHT.Color.red')
  lines.push('const white = EIGHT.Color.white')
  lines.push('const yellow = EIGHT.Color.yellow')

  if (options.geometry) {
    lines.push("")
    lines.push("//////////////////////////////////////////////////")
    lines.push("// VPython compatibility")
    lines.push("")
    lines.push("/**")
    lines.push(" * Constructs a vector from Cartesian coordinates with the standard basis [e1, e2, e3]")
    lines.push(" */")
    lines.push(`const vector = EIGHT.${options.geometry}${options.dimensions}.vector`)

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

  // This last empty line ensure that the file ends with a newline.
  lines.push("")

  return lines.join('\n');
}
