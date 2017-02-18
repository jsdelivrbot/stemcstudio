import { getMatchOffsets } from "./lib/lang";
import Marker from "./Marker";
import Range from "./Range";
import EditSession from "./EditSession";
import MarkerLayer from "./layer/MarkerLayer";
import MarkerConfig from "./layer/MarkerConfig";

// needed to prevent long lines from freezing the browser
const MAX_RANGES = 500;

/**
 *
 */
export default class SearchHighlight implements Marker {
    private regExp: RegExp;
    public clazz: string;
    public type: string;
    private cache: Range[][];
    private _range: Range;

    /**
     * @param regExpr
     * @param clazz
     * @param type
     */
    constructor(regExp: RegExp, clazz: string, type: string) {
        this.setRegexp(regExp);
        this.clazz = clazz;
        this.type = type || "text";
    }

    /**
     * @param regExp
     */
    setRegexp(regExp: RegExp): void {
        if (this.regExp + "" === regExp + "") {
            return;
        }
        this.regExp = regExp;
        this.cache = [];
    }

    get range(): Range {
        return this._range;
    }

    set range(range: Range) {
        this._range = range;
    }

    /**
     * @param html
     * @param markerLayer
     * @param session
     * @param config
     */
    update(html: (number | string)[], markerLayer: MarkerLayer, session: EditSession, config: MarkerConfig): void {
        if (!this.regExp) {
            return;
        }

        const start = config.firstRow, end = config.lastRow;

        for (let i = start; i <= end; i++) {
            let ranges = this.cache[i];
            if (ranges == null) {
                let matches = getMatchOffsets(session.getLine(i), this.regExp);
                if (matches.length > MAX_RANGES) {
                    matches = matches.slice(0, MAX_RANGES);
                }
                ranges = matches.map(function (match) {
                    return new Range(i, match.offset, i, match.offset + match.length);
                });
                // TODO: The zero-length case was the empty string, but that does not pass the compiler.
                this.cache[i] = ranges.length ? ranges : [];
            }

            for (let j = ranges.length; j--;) {
                markerLayer.drawSingleLineMarker(html, session.documentToScreenRange(ranges[j]), this.clazz, config);
            }
        }
    }
}
