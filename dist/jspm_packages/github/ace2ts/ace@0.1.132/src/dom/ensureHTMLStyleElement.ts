import getDocumentHead from './getDocumentHead';
import hasHTMLStyleElement from './hasHTMLStyleElement';
/**
 *
 */
export default function ensureHTMLStyleElement(cssText: string, id: string, doc: Document): void {
    // If style is already imported return immediately.
    if (id && hasHTMLStyleElement(id, doc)) {
        return;
    }
    else {
        let style = doc.createElement('style');
        style.appendChild(doc.createTextNode(cssText));
        if (id) {
            style.id = id;
        }
        getDocumentHead(doc).appendChild(style);
    }
}
