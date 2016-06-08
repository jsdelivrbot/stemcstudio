/**
 * @class ThemeLink
 */
export default class ThemeLink {

    /**
     * @property isDark
     * @type boolean
     */
    isDark: boolean;

    /**
     * @property id
     * @type string
     */
    id: string;

    /**
     * @property rel
     * @type string
     */
    rel: string;

    /**
     * @property type
     * @type string
     */
    type: string;

    /**
     * @property href
     * @type string
     */
    href: string;

    /**
     * @property padding
     * @type number
     */
    padding: number;

    /**
     * @class ThemeLink
     * @constructor
     * @param isDark {boolean}
     * @param id {string}
     * @param rel {string}
     * @param href {string}
     * @param padding {number}
     */
    constructor(isDark: boolean, id: string, rel: string, type: string, href: string, padding: number) {
        if (typeof padding !== 'number') {
            throw new TypeError("padding must be a number");
        }
        this.isDark = isDark;
        this.id = id;
        this.rel = rel;
        this.type = type;
        this.href = href;
        this.padding = padding;
    }
}
