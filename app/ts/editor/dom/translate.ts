export function translate(element: HTMLDivElement, tx: number, ty: number) {
    element.style.top = Math.round(ty) + "px";
    element.style.left = Math.round(tx) + "px";
}
