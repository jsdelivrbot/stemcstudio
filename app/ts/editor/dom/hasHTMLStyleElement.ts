export function hasHTMLStyleElement(id: string, doc: Document) {
    let index = 0;
    const styles = doc.getElementsByTagName('style');

    if (styles) {
        while (index < styles.length) {
            if (styles[index++].id === id) {
                return true;
            }
        }
    }
    return false;
}
