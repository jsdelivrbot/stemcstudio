import getDocumentHead from './getDocumentHead';

export default function appendHTMLLinkElement(id: string, rel: string, type: string, href: string, doc: Document) {
    var link = doc.createElement('link');
    link.id = id;
    link.rel = rel;
    if (typeof type === 'string') {
        link.type = type;
    }
    link.href = href;
    getDocumentHead(doc).appendChild(link);
}
