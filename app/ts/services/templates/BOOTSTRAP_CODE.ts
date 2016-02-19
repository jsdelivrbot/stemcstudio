export default function(
    canvasId: string,
    options: {
        advanced?: boolean;
        comments?: boolean;
        stats?: boolean;
        example?: boolean;
        geometry?: string;
        dimensions?: number
    } = {}
): string {
    const lines: string[] = []

    if (options.comments) {
        lines.push("//")
        lines.push("// Using the bootstrap utility function for rapid development.")
        lines.push("//")
    }

    if (options.advanced) {
        lines.push(`const world = EIGHT.bootstrap('${canvasId}', animate, {`)
        lines.push(`  memcheck: true,`)
        lines.push(`  onload: setUp,`)
        lines.push(`  onunload: tearDown`)
        lines.push(`})`)
    }
    else {
        lines.push(`const world = EIGHT.bootstrap('${canvasId}', animate)`)
    }

    if (options.example) {
        lines.push("")
        lines.push("const arrow = world.arrow()")
    }

    if (options.example) {
        lines.push("")
        lines.push("const cube = world.box({width: 0.1})")
        lines.push("cube.X = 1.3 * e1")
    }
    else {
        lines.push("")
        lines.push("const cube = world.box()")
    }

    if (options.example) {
        lines.push("")
        lines.push("const ball = world.sphere({radius: 0.1})")
        lines.push("ball.trail.enabled = true")
    }

    if (options.example) {
        lines.push("")
        lines.push("const rod = world.cylinder({radius: 0.1})")
        lines.push("rod.X = -1.3 * e1")
    }

    if (options.stats) {
        lines.push("")
        lines.push("let stats: Stats")
    }

    if (options.geometry) {
        lines.push("")
        lines.push("/**")
        lines.push(" * The rotational velocity vector.")
        lines.push(" */")
        lines.push("const ω = 2 * Math.PI * (1/10) * e1")
        lines.push("/**")
        lines.push(" * The rotational velocity bivector.")
        lines.push(" */")
        lines.push("const Ω = dual(ω)")
    }

    lines.push("")
    if (options.comments) {
        lines.push("/**")
        lines.push(" * Animates the scene.")
        lines.push(" */")
    }
    lines.push("function animate(timestamp: number) {")

    if (options.stats) {
        lines.push("  stats.begin()")
    }

    if (options.example) {
      lines.push("")
      lines.push("  const t = timestamp * 0.001")
    }

    if (options.example) {
        lines.push("")
        lines.push("  ball.X = 2 * (cos(t) * e1 + sin(t) * e3)")
    }

    if (options.example) {
        lines.push("")
        lines.push("  cube.R = exp(-Ω * t/2)")
    }

    if (options.example) {
        lines.push("")
        lines.push("  rod.R = exp(Ω * t/2)")
    }

    if (options.example) {
        lines.push("")
        lines.push("  arrow.axis = ball.X - arrow.X")
    }

    if (options.stats) {
        lines.push("")
        lines.push("  stats.end()")
    }

    lines.push("}")

    if (options.advanced) {

        lines.push("")
        if (options.comments) {
            lines.push("/**")
            lines.push(" *")
            lines.push(" */")
        }
        lines.push("function setUp() {")
        lines.push("  stats = new Stats()")
        lines.push("  stats.setMode(0)")
        lines.push("  document.body.appendChild(stats.domElement)")
        lines.push("}")

        lines.push("")
        if (options.comments) {
            lines.push("/**")
            lines.push(" *")
            lines.push(" */")
        }
        lines.push("function tearDown() {")
        lines.push("}")
    }

    lines.push("")

    return lines.join('\n')
}