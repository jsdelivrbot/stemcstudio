/**
 * A data structure used by the GutterLayer.
 */
interface GutterCell {
    element: HTMLDivElement;
    textNode: Text;
    foldWidget: HTMLSpanElement;
}

export default GutterCell;
