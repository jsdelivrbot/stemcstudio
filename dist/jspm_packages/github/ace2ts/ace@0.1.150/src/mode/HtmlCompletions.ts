import Completion from "../Completion";
import EditSession from "../EditSession";
import Position from "../Position";
import Token from "../Token";
import TokenIterator from "../TokenIterator";

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

const attributeMap = {
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

function findTagName(session: EditSession, pos: Position): string {
    const iterator = new TokenIterator(session, pos.row, pos.column);
    let token: Token = iterator.getCurrentToken();
    while (token && !is(token, "tag-name")) {
        token = iterator.stepBackward();
    }
    if (token)
        return token.value;
}

/**
 * @class HtmlCompletions
 */
export default class HtmlCompletions {
    /**
     * @class HtmlCompletions
     * @constructor
     */
    constructor() {
        // Do nothing.
    }

    /**
     * @method getCompletions
     * @param state {string}
     * @param session {EditSession}
     * @param pos {Position}
     * @param prefix {string}
     * @return {Completion[]} An array of Completion(s).
     */
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

        return [];
    }

    /**
     * @method getTagCompletions
     * @param state {string}
     * @param session {EditSession}
     * @param pos {Position}
     * @param prefix {string}
     * @return {Completion[]} An array of Completion(s).
     */
    getTagCompletions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
        return elements.map(function(element: string) {
            return {
                value: element,
                meta: "tag",
                score: Number.MAX_VALUE
            };
        });
    }

    /**
     * @method getAttributeCompletions
     * @param state {string}
     * @param session {EditSession}
     * @param pos {Position}
     * @param prefix {string}
     * @return {Completion[]} An array of Completion(s).
     */
    getAttributeCompetions(state: string, session: EditSession, pos: Position, prefix: string): Completion[] {
        const tagName = findTagName(session, pos);
        if (!tagName) {
            return [];
        }
        let attributes = globalAttributes;
        if (tagName in attributeMap) {
            attributes = attributes.concat(attributeMap[tagName]);
        }
        return attributes.map(function(attribute: string) {
            return {
                caption: attribute,
                snippet: attribute + '="$0"',
                meta: "attribute",
                score: Number.MAX_VALUE
            };
        });
    }
}
