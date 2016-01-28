export default function hasHTMLStyleElement(id: string, doc: Document) {
    var index = 0;
    var styles = doc.getElementsByTagName('style');

    if (styles) {
        while (index < styles.length) {
            if (styles[index++].id === id) {
                return true;
            }
        }
    }
    return false;
}
