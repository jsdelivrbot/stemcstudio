export function hasHTMLLinkElement(id: string, doc: Document) {
    let index = 0;
    const links = doc.getElementsByTagName('link');

    if (links) {
        while (index < links.length) {
            if (links[index++].id === id) {
                return true;
            }
        }
    }
    return false;
}
