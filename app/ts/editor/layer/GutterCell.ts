/**
 * A data structure used by the GutterLayer.
 */
export interface GutterCell {
    element: HTMLDivElement;
    textNode: Text;
    foldWidget: HTMLSpanElement | null;
}
