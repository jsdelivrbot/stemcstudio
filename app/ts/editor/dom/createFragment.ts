/**
 * Creates a document fragment that is owned by the same document as the specified element.
 */
export function createFragment(element: HTMLDivElement): DocumentFragment {
    const doc = element ? element.ownerDocument : document;
    return doc.createDocumentFragment();
}
