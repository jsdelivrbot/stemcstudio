import { getMatchOffsets } from "./lib/lang";
import { Marker, MarkerType } from "./Marker";
import { Range } from "./Range";
import { MarkerLayer } from "./layer/MarkerLayer";
import { MarkerConfig } from "./layer/MarkerConfig";
import { EditSession } from "../editor/EditSession";

// needed to prevent long lines from freezing the browser
const MAX_RANGES = 500;

/**
 *
 */
export class SearchHighlight implements Marker {
    private regExp: RegExp | null | undefined;
    public clazz: string;
    public type: MarkerType;
    private cache: Range[][];
    private _range: Range;

    /**
     *
     */
    constructor(regExp: RegExp | null, clazz: string, type: MarkerType) {
        this.setRegexp(regExp);
        this.clazz = clazz;
        this.type = type || "text";
    }

    /**
     *
     */
    setRegexp(regExp: RegExp | null | undefined): void {
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
     *
     */
    update(html: (number | string)[], markerLayer: MarkerLayer, session: EditSession, config: MarkerConfig): void {
        if (!this.regExp) {
            return;
        }

        const start = config.firstRow;
        const end = config.lastRow;

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
