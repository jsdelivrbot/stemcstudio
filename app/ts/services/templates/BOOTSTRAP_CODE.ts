export default function(
    canvasId: string,
    options: {
        stats?: boolean
    } = {}
): string {
    const lines = [
        "//",
        "// Using the bootstrap utility function for rapid development.",
        "//",
        `const world = EIGHT.bootstrap('${canvasId}', animate)`,
        "",
        "const arrow = world.arrow()",
        "",
        "const cube = world.cuboid({width: 0.1})",
        "cube.X = 1.3 * e1",
        "",
        "const ball = world.sphere({radius: 0.1})",
        "ball.trail.enabled = true",
        "",
        "const rod = world.cylinder({radius: 0.1})",
        "rod.X = -1.3 * e1",
        "",
        "const stats = new Stats()",
        "stats.setMode(0)",
        "document.body.appendChild(stats.domElement)",
        "",
        "/**",
        " * The rotational velocity vector.",
        " */",
        "const ω = 2 * Math.PI * (1/10) * e1",
        "/**",
        " * The rotational velocity bivector.",
        " */",
        "const Ω = dual(ω)",
        "",
        "/**",
        " * Animates the scene.",
        " */",
        "function animate(timestamp: number) {",
        "  stats.begin()",
        "",
        "  const t = timestamp * 0.001",
        "",
        "  ball.X = 2 * (cos(t) * e1 + sin(t) * e3)",
        "",
        "  cube.R = exp(-Ω * t/2)",
        "  rod.R = exp(Ω * t/2)",
        "",
        "  arrow.axis = ball.X - arrow.X",
        "",
        "  stats.end()",
        "}",
        ""
    ]
    return lines.join('\n')
}