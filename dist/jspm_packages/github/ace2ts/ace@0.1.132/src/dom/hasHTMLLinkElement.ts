export default function hasHTMLLinkElement(id: string, doc: Document) {
    var index = 0;
    var links = doc.getElementsByTagName('link');

    if (links) {
        while (index < links.length) {
            if (links[index++].id === id) {
                return true;
            }
        }
    }
    return false;
}
