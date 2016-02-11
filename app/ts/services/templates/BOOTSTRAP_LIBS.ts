export default function(): string {
    const lines = "" +
        "const zero = EIGHT.G3.zero\n" +
        "const one = EIGHT.G3.one\n" +
        "const e1 = EIGHT.G3.e1\n" +
        "const e2 = EIGHT.G3.e2\n" +
        "const e3 = EIGHT.G3.e3\n" +
        "\n" +
        "/**\n" +
        " * The pseudoscalar for the Euclidean 3D Geometric Space, I = e1 * e2 * e3.\n" +
        " */\n" +
        "const I  = e1 * e2 * e3\n" +
        "\n" +
        "const exp = EIGHT.exp\n" +
        "const log = EIGHT.log\n" +
        "const cos = EIGHT.cos\n" +
        "const sin = EIGHT.sin\n" +
        "\n" +
        "/**\n" +
        " * dual(m), sign depends on who you talk to.\n" +
        " */\n" +
        "function dual(m: EIGHT.G3): EIGHT.G3 {\n" +
        "  // return m << (I / (I * I)) // Dorst, Fontijne, Mann\n" +
        "  return I * m // Hestenes, Doran, Lasenby\n" +
        "  // return m * (I / (I * I)) // Hestenes, Doran, Lasenby\n" +
        "}\n"
    return lines;
}