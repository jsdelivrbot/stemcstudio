import { Completion } from "../Completion";
import { Position } from "editor-document";
import { Token } from "../Token";
import { TokenIterator } from "../TokenIterator";
import { EditSession } from "../EditSession";

const commonAttributes = [
    "accesskey",
    "class",
    "contenteditable",
    "contextmenu",
    "dir",
    "draggable",
    "dropzone",
    "hidden",
    "id",
    "inert",
    "itemid",
    "itemprop",
    "itemref",
    "itemscope",
    "itemtype",
    "lang",
    "spellcheck",
    "style",
    "tabindex",
    "title",
    "translate"
];

const eventAttributes = [
    "onabort",
    "onblur",
    "oncancel",
    "oncanplay",
    "oncanplaythrough",
    "onchange",
    "onclick",
    "onclose",
    "oncontextmenu",
    "oncuechange",
    "ondblclick",
    "ondrag",
    "ondragend",
    "ondragenter",
    "ondragleave",
    "ondragover",
    "ondragstart",
    "ondrop",
    "ondurationchange",
    "onemptied",
    "onended",
    "onerror",
    "onfocus",
    "oninput",
    "oninvalid",
    "onkeydown",
    "onkeypress",
    "onkeyup",
    "onload",
    "onloadeddata",
    "onloadedmetadata",
    "onloadstart",
    "onmousedown",
    "onmousemove",
    "onmouseout",
    "onmouseover",
    "onmouseup",
    "onmousewheel",
    "onpause",
    "onplay",
    "onplaying",
    "onprogress",
    "onratechange",
    "onreset",
    "onscroll",
    "onseeked",
    "onseeking",
    "onselect",
    "onshow",
    "onstalled",
    "onsubmit",
    "onsuspend",
    "ontimeupdate",
    "onvolumechange",
    "onwaiting"
];

const globalAttributes = commonAttributes.concat(eventAttributes);

const attributeMap: { [name: string]: string[] } = {
    "html": ["manifest"],
    "head": [],
    "title": [],
    "base": ["href", "target"],
    "link": ["href", "hreflang", "rel", "media", "type", "sizes"],
    "meta": ["http-equiv", "name", "content", "charset"],
    "style": ["type", "media", "scoped"],
    "script": ["charset", "type", "src", "defer", "async"],
    "noscript": ["href"],
    "body": ["onafterprint", "onbeforeprint", "onbeforeunload", "onhashchange", "onmessage", "onoffline", "onpopstate", "onredo", "onresize", "onstorage", "onundo", "onunload"],
    "section": [],
    "nav": [],
    "article": ["pubdate"],
    "aside": [],
    "h1": [],
    "h2": [],
    "h3": [],
    "h4": [],
    "h5": [],
    "h6": [],
    "header": [],
    "footer": [],
    "address": [],
    "main": [],
    "p": [],
    "hr": [],
    "pre": [],
    "blockquote": ["cite"],
    "ol": ["start", "reversed"],
    "ul": [],
    "li": ["value"],
    "dl": [],
    "dt": [],
    "dd": [],
    "figure": [],
    "figcaption": [],
    "div": [],
    "a": ["href", "target", "ping", "rel", "media", "hreflang", "type"],
    "em": [],
    "strong": [],
    "small": [],
    "s": [],
    "cite": [],
    "q": ["cite"],
    "dfn": [],
    "abbr": [],
    "data": [],
    "time": ["datetime"],
    "code": [],
    "var": [],
    "samp": [],
    "kbd": [],
    "sub": [],
    "sup": [],
    "i": [],
    "b": [],
    "u": [],
    "mark": [],
    "ruby": [],
    "rt": [],
    "rp": [],
    "bdi": [],
    "bdo": [],
    "span": [],
    "br": [],
    "wbr": [],
    "ins": ["cite", "datetime"],
    "del": ["cite", "datetime"],
    "img": ["alt", "src", "height", "width", "usemap", "ismap"],
    "iframe": ["name", "src", "height", "width", "sandbox", "seamless"],
    "embed": ["src", "height", "width", "type"],
    "object": ["param", "data", "type", "height", "width", "usemap", "name", "form", "classid"],
    "param": ["name", "value"],
    "video": ["src", "autobuffer", "autoplay", "loop", "controls", "width", "height", "poster"],
    "audio": ["src", "autobuffer", "autoplay", "loop", "controls"],
    "source": ["src", "type", "media"],
    "track": ["kind", "src", "srclang", "label", "default"],
    "canvas": ["width", "height"],
    "map": ["name"],
    "area": ["shape", "coords", "href", "hreflang", "alt", "target", "media", "rel", "ping", "type"],
    "svg": [],
    "math": [],
    "table": ["summary"],
    "caption": [],
    "colgroup": ["span"],
    "col": ["span"],
    "tbody": [],
    "thead": [],
    "tfoot": [],
    "tr": [],
    "td": ["headers", "rowspan", "colspan"],
    "th": ["headers", "rowspan", "colspan", "scope"],
    "form": ["accept-charset", "action", "autocomplete", "enctype", "method", "name", "novalidate", "target"],
    "fieldset": ["disabled", "form", "name"],
    "legend": [],
    "label": ["form", "for"],
    "input": ["type", "accept", "alt", "autocomplete", "checked", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "height", "list", "max", "maxlength", "min", "multiple", "pattern", "placeholder", "readonly", "required", "size", "src", "step", "width", "files", "value"],
    "button": ["autofocus", "disabled", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "name", "value", "type"],
    "select": ["autofocus", "disabled", "form", "multiple", "name", "size"],
    "datalist": [],
    "optgroup": ["disabled", "label"],
    "option": ["disabled", "selected", "label", "value"],
    "textarea": ["autofocus", "disabled", "form", "maxlength", "name", "placeholder", "readonly", "required", "rows", "cols", "wrap"],
    "keygen": ["autofocus", "challenge", "disabled", "form", "keytype", "name"],
    "output": ["for", "form", "name"],
    "progress": ["value", "max"],
    "meter": ["value", "min", "max", "low", "high", "optimum"],
    "details": ["open"],
    "summary": [],
    "command": ["type", "label", "icon", "disabled", "checked", "radiogroup", "command"],
    "menu": ["type", "label"],
    "dialog": ["open"]
};

const elements = Object.keys(attributeMap);

function is(token: Token, type: string): boolean {
    return token.type.lastIndexOf(type + ".xml") > -1;
}

function findTagName(session: EditSession, pos: Position): string | undefined {
    const iterator = new TokenIterator(session, pos.row, pos.column);
    let token = iterator.getCurrentToken();
    while (token && !is(token, "tag-name")) {
        token = iterator.stepBackward();
    }
    if (token) {
        return token.value;
    }
    return void 0;
}

function findAttributeName(session: EditSession, pos: Position): string | undefined {
    const iterator = new TokenIterator(session, pos.row, pos.column);
    let token = iterator.getCurrentToken();
    while (token && !is(token, "attribute-name")) {
        token = iterator.stepBackward();
    }
    if (token) {
        return token.value;
    }
    return void 0;
}

export class HtmlCompletions {
    /**
     * 
     */
    constructor() {
        // Do nothing.
    }

    getCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
        const token = session.getTokenAt(pos.row, pos.column);

        if (!token) {
            return [];
        }

        // tag name
        if (is(token, "tag-name") || is(token, "tag-open") || is(token, "end-tag-open")) {
            return this.getTagCompletions(state, session, pos, prefix);
        }

        // tag attribute
        if (is(token, "tag-whitespace") || is(token, "attribute-name")) {
            return this.getAttributeCompetions(state, session, pos, prefix);
        }
        // tag attribute values
        if (is(token, "attribute-value"))
            return this.getAttributeValueCompletions(state, session, pos, prefix);

        // HTML entities
        const line = session.getLine(pos.row).substr(0, pos.column);
        if (/&[a-z]*$/i.test(line))
            return this.getHTMLEntityCompletions(state, session, pos, prefix);
        return [];
    }

    getTagCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
        return elements.map(function (element: string) {
            return {
                caption: element,
                value: element,
                meta: "tag",
                score: Number.MAX_VALUE
            };
        });
    }

    getAttributeCompetions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
        const tagName = findTagName(session, pos);
        if (!tagName) {
            return [];
        }
        let attributes = globalAttributes;
        if (tagName in attributeMap) {
            attributes = attributes.concat(attributeMap[tagName]);
        }
        return attributes.map(function (attribute: string) {
            return {
                caption: attribute,
                meta: "attribute",
                score: Number.MAX_VALUE
            };
        });
    }

    getAttributeValueCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {

        const tagName = findTagName(session, pos);
        if (!tagName) {
            return [];
        }

        const attributeName = findAttributeName(session, pos);
        if (!attributeName) {
            return [];
        }

        let values: string[] = [];
        if (tagName in attributeMap && attributeName in attributeMap[tagName] && typeof attributeMap[tagName][attributeName] === "object") {
            values = Object.keys(attributeMap[tagName][attributeName]);
        }
        return values.map(function (value) {
            return {
                caption: value,
                meta: "attribute value",
                score: Number.MAX_VALUE
            };
        });
    }

    getHTMLEntityCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
        const values = ['Aacute;', 'aacute;', 'Acirc;', 'acirc;', 'acute;', 'AElig;', 'aelig;', 'Agrave;', 'agrave;', 'alefsym;', 'Alpha;', 'alpha;', 'amp;', 'and;', 'ang;', 'Aring;', 'aring;', 'asymp;', 'Atilde;', 'atilde;', 'Auml;', 'auml;', 'bdquo;', 'Beta;', 'beta;', 'brvbar;', 'bull;', 'cap;', 'Ccedil;', 'ccedil;', 'cedil;', 'cent;', 'Chi;', 'chi;', 'circ;', 'clubs;', 'cong;', 'copy;', 'crarr;', 'cup;', 'curren;', 'Dagger;', 'dagger;', 'dArr;', 'darr;', 'deg;', 'Delta;', 'delta;', 'diams;', 'divide;', 'Eacute;', 'eacute;', 'Ecirc;', 'ecirc;', 'Egrave;', 'egrave;', 'empty;', 'emsp;', 'ensp;', 'Epsilon;', 'epsilon;', 'equiv;', 'Eta;', 'eta;', 'ETH;', 'eth;', 'Euml;', 'euml;', 'euro;', 'exist;', 'fnof;', 'forall;', 'frac12;', 'frac14;', 'frac34;', 'frasl;', 'Gamma;', 'gamma;', 'ge;', 'gt;', 'hArr;', 'harr;', 'hearts;', 'hellip;', 'Iacute;', 'iacute;', 'Icirc;', 'icirc;', 'iexcl;', 'Igrave;', 'igrave;', 'image;', 'infin;', 'int;', 'Iota;', 'iota;', 'iquest;', 'isin;', 'Iuml;', 'iuml;', 'Kappa;', 'kappa;', 'Lambda;', 'lambda;', 'lang;', 'laquo;', 'lArr;', 'larr;', 'lceil;', 'ldquo;', 'le;', 'lfloor;', 'lowast;', 'loz;', 'lrm;', 'lsaquo;', 'lsquo;', 'lt;', 'macr;', 'mdash;', 'micro;', 'middot;', 'minus;', 'Mu;', 'mu;', 'nabla;', 'nbsp;', 'ndash;', 'ne;', 'ni;', 'not;', 'notin;', 'nsub;', 'Ntilde;', 'ntilde;', 'Nu;', 'nu;', 'Oacute;', 'oacute;', 'Ocirc;', 'ocirc;', 'OElig;', 'oelig;', 'Ograve;', 'ograve;', 'oline;', 'Omega;', 'omega;', 'Omicron;', 'omicron;', 'oplus;', 'or;', 'ordf;', 'ordm;', 'Oslash;', 'oslash;', 'Otilde;', 'otilde;', 'otimes;', 'Ouml;', 'ouml;', 'para;', 'part;', 'permil;', 'perp;', 'Phi;', 'phi;', 'Pi;', 'pi;', 'piv;', 'plusmn;', 'pound;', 'Prime;', 'prime;', 'prod;', 'prop;', 'Psi;', 'psi;', 'quot;', 'radic;', 'rang;', 'raquo;', 'rArr;', 'rarr;', 'rceil;', 'rdquo;', 'real;', 'reg;', 'rfloor;', 'Rho;', 'rho;', 'rlm;', 'rsaquo;', 'rsquo;', 'sbquo;', 'Scaron;', 'scaron;', 'sdot;', 'sect;', 'shy;', 'Sigma;', 'sigma;', 'sigmaf;', 'sim;', 'spades;', 'sub;', 'sube;', 'sum;', 'sup;', 'sup1;', 'sup2;', 'sup3;', 'supe;', 'szlig;', 'Tau;', 'tau;', 'there4;', 'Theta;', 'theta;', 'thetasym;', 'thinsp;', 'THORN;', 'thorn;', 'tilde;', 'times;', 'trade;', 'Uacute;', 'uacute;', 'uArr;', 'uarr;', 'Ucirc;', 'ucirc;', 'Ugrave;', 'ugrave;', 'uml;', 'upsih;', 'Upsilon;', 'upsilon;', 'Uuml;', 'uuml;', 'weierp;', 'Xi;', 'xi;', 'Yacute;', 'yacute;', 'yen;', 'Yuml;', 'yuml;', 'Zeta;', 'zeta;', 'zwj;', 'zwnj;'];

        return values.map(function (value) {
            return {
                caption: value,
                meta: "html entity",
                score: Number.MAX_VALUE
            };
        });
    }
}
