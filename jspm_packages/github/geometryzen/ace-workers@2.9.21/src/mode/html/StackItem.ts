import { Attr } from "./Attr";

const SpecialElements = {
    "http://www.w3.org/1999/xhtml": [
        'address',
        'applet',
        'area',
        'article',
        'aside',
        'base',
        'basefont',
        'bgsound',
        'blockquote',
        'body',
        'br',
        'button',
        'caption',
        'center',
        'col',
        'colgroup',
        'dd',
        'details',
        'dir',
        'div',
        'dl',
        'dt',
        'embed',
        'fieldset',
        'figcaption',
        'figure',
        'footer',
        'form',
        'frame',
        'frameset',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'head',
        'header',
        'hgroup',
        'hr',
        'html',
        'iframe',
        'img',
        'input',
        'isindex',
        'li',
        'link',
        'listing',
        'main',
        'marquee',
        'menu',
        'menuitem',
        'meta',
        'nav',
        'noembed',
        'noframes',
        'noscript',
        'object',
        'ol',
        'p',
        'param',
        'plaintext',
        'pre',
        'script',
        'section',
        'select',
        'source',
        'style',
        'summary',
        'table',
        'tbody',
        'td',
        'textarea',
        'tfoot',
        'th',
        'thead',
        'title',
        'tr',
        'track',
        'ul',
        'wbr',
        'xmp'
    ],
    "http://www.w3.org/1998/Math/MathML": [
        'mi',
        'mo',
        'mn',
        'ms',
        'mtext',
        'annotation-xml'
    ],
    "http://www.w3.org/2000/svg": [
        'foreignObject',
        'desc',
        'title'
    ]
};

export class StackItem {
    localName: string;
    namespaceURI: string;
    attributes: Attr[];
    node: any;
    constructor(namespaceURI: string, localName: string, attributes: Attr[], node: any) {
        this.localName = localName;
        this.namespaceURI = namespaceURI;
        this.attributes = attributes;
        this.node = node;
    }
    isSpecial() {
        return this.namespaceURI in SpecialElements &&
            SpecialElements[this.namespaceURI].indexOf(this.localName) > -1;
    }

    // http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#special
    isFosterParenting() {
        if (this.namespaceURI === "http://www.w3.org/1999/xhtml") {
            return this.localName === 'table' ||
                this.localName === 'tbody' ||
                this.localName === 'tfoot' ||
                this.localName === 'thead' ||
                this.localName === 'tr';
        }
        return false;
    }

    isNumberedHeader() {
        if (this.namespaceURI === "http://www.w3.org/1999/xhtml") {
            return this.localName === 'h1' ||
                this.localName === 'h2' ||
                this.localName === 'h3' ||
                this.localName === 'h4' ||
                this.localName === 'h5' ||
                this.localName === 'h6';
        }
        return false;
    }
    isForeign() {
        return this.namespaceURI !== "http://www.w3.org/1999/xhtml";
    }

    isHtmlIntegrationPoint() {
        if (this.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
            if (this.localName !== "annotation-xml")
                return false;
            var encoding = getAttribute(this, 'encoding');
            if (!encoding)
                return false;
            encoding = encoding.toLowerCase();
            return encoding === "text/html" || encoding === "application/xhtml+xml";
        }
        if (this.namespaceURI === "http://www.w3.org/2000/svg") {
            return this.localName === "foreignObject"
                || this.localName === "desc"
                || this.localName === "title";
        }
        return false;
    }

    isMathMLTextIntegrationPoint() {
        if (this.namespaceURI === "http://www.w3.org/1998/Math/MathML") {
            return this.localName === "mi"
                || this.localName === "mo"
                || this.localName === "mn"
                || this.localName === "ms"
                || this.localName === "mtext";
        }
        return false;
    }
}

function getAttribute(item: StackItem, name: string) {
    const attributes = item.attributes;
    for (const attribute of attributes) {
        if (attribute.nodeName === name) {
            return attribute.nodeValue;
        }
    }
    return null;
}
