const NEWLINE = '\n';

export function VECTOR(tabString: string, dims: number): string {
    const coords = ['x', 'y', 'z', 'w'].filter((value, index) => { return index < dims; });
    const _ = tabString;
    const lines: string[] = [];
    const args = coords.map((coord) => `${coord}`).join(', ');
    const params = coords.map((coord) => `${coord}: number`).join(', ');
    // 
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export interface Vector {");
    for (const coord of coords) {
        lines.push(_ + `readonly ${coord}: number`);
    }
    // lines.push(_ + "dot(rhs: Vector): number");
    // lines.push(_ + "direction(): Vector");
    lines.push(_ + "magnitude(): number");
    lines.push("}");
    //
    lines.push("");
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("export function isVector(arg: any): arg is Vector {");
    lines.push(_ + "return isCartesianVector(arg)");
    lines.push("}");
    // 
    lines.push("");
    lines.push("/**");
    lines.push(" *");
    lines.push(" */");
    lines.push("interface CartesianVector extends Vector {");
    for (const coord of coords) {
        lines.push(_ + `readonly ${coord}: number`);
    }
    lines.push(_ + "__add__(rhs: any): Vector | undefined");
    lines.push(_ + "__radd__(lhs: any): Vector | undefined");
    lines.push(_ + "__sub__(rhs: any): Vector | undefined");
    lines.push(_ + "__rsub__(lhs: any): Vector | undefined");
    lines.push(_ + "__mul__(rhs: any): Vector | undefined");
    lines.push(_ + "__rmul__(lhs: any): Vector | undefined");
    lines.push(_ + "__div__(rhs: any): Vector | undefined");
    lines.push(_ + "__rdiv__(lhs: any): Vector | undefined");
    lines.push("}");
    //
    lines.push("");
    lines.push("function isCartesianVector(arg: any): arg is CartesianVector {");
    lines.push(_ + "return arg.hasOwnProperty('x') && arg.hasOwnProperty('y')");
    lines.push("}");
    //
    lines.push("");
    lines.push(`export function vec(${params}): Vector {`);
    lines.push(_ + `return cvec(${args})`);
    lines.push("}");
    //
    lines.push("");
    lines.push(`function cvec(${params}): CartesianVector {`);
    lines.push(_ + "const that: CartesianVector = {");
    for (const coord of coords) {
        lines.push(_ + _ + `get ${coord}(): number {`);
        lines.push(_ + _ + _ + `return ${coord}`);
        lines.push(_ + _ + "},");
    }
    lines.push(_ + _ + "__add__(rhs: any): Vector | undefined {");
    lines.push(_ + _ + _ + "if (isCartesianVector(rhs)) {");
    lines.push(_ + _ + _ + _ + `return cvec(${coords.map((coord) => `${coord} + rhs.${coord}`).join(', ')})`);
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + _ + "else {");
    lines.push(_ + _ + _ + _ + "return void 0");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "},");
    lines.push(_ + _ + "__radd__(lhs: any): Vector | undefined {");
    lines.push(_ + _ + _ + "if (isCartesianVector(lhs)) {");
    lines.push(_ + _ + _ + _ + `return cvec(${coords.map((coord) => `lhs.${coord} + ${coord}`).join(', ')})`);
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + _ + "else {");
    lines.push(_ + _ + _ + _ + "return void 0");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "},");
    lines.push(_ + _ + "__sub__(rhs: any): Vector | undefined {");
    lines.push(_ + _ + _ + "if (isCartesianVector(rhs)) {");
    lines.push(_ + _ + _ + _ + `return cvec(${coords.map((coord) => `${coord} - rhs.${coord}`).join(', ')})`);
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + _ + "else {");
    lines.push(_ + _ + _ + _ + "return void 0");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "},");
    lines.push(_ + _ + "__rsub__(lhs: any): Vector | undefined {");
    lines.push(_ + _ + _ + "if (isCartesianVector(lhs)) {");
    lines.push(_ + _ + _ + _ + `return cvec(${coords.map((coord) => `lhs.${coord} - ${coord}`).join(', ')})`);
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + _ + "else {");
    lines.push(_ + _ + _ + _ + "return void 0");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "},");
    lines.push(_ + _ + "__mul__(rhs: any): Vector | undefined {");
    lines.push(_ + _ + _ + "if (typeof rhs === 'number') {");
    lines.push(_ + _ + _ + _ + `return cvec(${coords.map((coord) => `${coord} * rhs`).join(', ')})`);
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + _ + "else {");
    lines.push(_ + _ + _ + _ + "return void 0");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "},");
    lines.push(_ + _ + "__rmul__(lhs: any): Vector | undefined {");
    lines.push(_ + _ + _ + "if (typeof lhs === 'number') {");
    lines.push(_ + _ + _ + _ + `return cvec(${coords.map((coord) => `lhs * ${coord}`).join(', ')})`);
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + _ + "else {");
    lines.push(_ + _ + _ + _ + "return void 0");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "},");
    lines.push(_ + _ + "__div__(rhs: any): Vector | undefined {");
    lines.push(_ + _ + _ + "if (typeof rhs === 'number') {");
    lines.push(_ + _ + _ + _ + `return cvec(${coords.map((coord) => `${coord} / rhs`).join(', ')})`);
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + _ + "else {");
    lines.push(_ + _ + _ + _ + "return void 0");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "},");
    lines.push(_ + _ + "__rdiv__(lhs: any): Vector | undefined {");
    lines.push(_ + _ + _ + "if (typeof lhs === 'number') {");
    lines.push(_ + _ + _ + _ + `return cvec(${coords.map((coord) => `lhs / ${coord}`).join(', ')})`);
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + _ + "else {");
    lines.push(_ + _ + _ + _ + "return void 0");
    lines.push(_ + _ + _ + "}");
    lines.push(_ + _ + "},");
    lines.push(_ + _ + "magnitude(): number {");
    lines.push(_ + _ + _ + `return Math.sqrt(${coords.map((coord) => `${coord} * ${coord}`).join(' + ')})`);
    lines.push(_ + _ + "}");
    lines.push(_ + "}");
    lines.push(_ + "return that");
    lines.push("}");
    lines.push("");
    for (let i = 0; i < coords.length; i++) {
        lines.push(`export const e${i + 1} = vec(${coords.map((coord, index) => (index === i) ? '1' : '0').join(', ')})`);
    }
    lines.push(`export const zero = vec(${coords.map((coord) => `0`).join(', ')})`);
    return lines.join(NEWLINE).concat(NEWLINE);
}
