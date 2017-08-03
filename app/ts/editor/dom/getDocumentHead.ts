/**
 *
 */
export function getDocumentHead(doc: Document): HTMLHeadElement {
    return <HTMLHeadElement>(doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement);
}
