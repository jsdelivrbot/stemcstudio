export function removeHTMLLinkElement(id: string, dom: Document): void {
    const element = dom.getElementById(id);
    if (element) {
        element.parentNode.removeChild(element);
    }
}
