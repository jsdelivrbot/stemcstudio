export default function(): string {
    const lines: string[] = [
        "const zero = EIGHT.Geometric3.zero()",
        "const one = EIGHT.Geometric3.one()",
        "const e1 = EIGHT.Geometric3.e1()",
        "const e2 = EIGHT.Geometric3.e2()",
        "const e3 = EIGHT.Geometric3.e3()",
        "",
        "/**",
        " * The pseudoscalar for the Euclidean 3D Geometric Space.",
        " */",
        "const I  = e1 ^ e2 ^ e3",
        "",
        "const exp = EIGHT.exp",
        "const log = EIGHT.log",
        "const cos = EIGHT.cos",
        "const sin = EIGHT.sin",
        "",
        "/**",
        " * dual(m), sign depends on who you talk to.",
        " */",
        "function dual(m: EIGHT.Geometric3): EIGHT.Geometric3 {",
        "  // return m << (I / (I * I)) // Dorst, Fontijne, Mann",
        "  return I * m // Hestenes, Doran, Lasenby",
        "}",
        ""
        ]
    return lines.join('\n');
}
