import { AbstractLayer } from './AbstractLayer';
import { LayerConfig } from "./LayerConfig";
import { MarkerConfig } from "./MarkerConfig";
import { Range } from "../Range";
import { RangeBasic } from "../RangeBasic";
import { clipRows, isEmpty, isMultiLine } from "../RangeHelpers";
import { refChange } from '../refChange';
import { EditSession } from '../EditSession';
import { Marker } from '../Marker';

export interface IMarkerLayer {

}

/**
 * The MarkerLayer is used for highlighting parts of the code.
 */
export class MarkerLayer extends AbstractLayer implements IMarkerLayer {

    private session: EditSession;
    private markers: { [id: number]: Marker };
    private config: MarkerConfig;
    private $padding = 0;

    /**
     *
     */
    constructor(parent: HTMLDivElement) {
        super(parent, "ace_layer ace_marker-layer");
        refChange(this.uuid, 'MarkerLayer', +1);
    }

    dispose(): void {
        refChange(this.uuid, 'MarkerLayer', -1);
        super.dispose();
    }

    public setPadding(padding: number) {
        this.$padding = padding;
    }

    public setSession(session: EditSession) {
        this.session = session;
    }

    public setMarkers(markers: { [id: number]: Marker }) {
        // If the markers are not defined then we'll have problems in the update method.
        if (typeof markers === 'object') {
            this.markers = markers;
        }
        else {
            throw new Error(`markers must be an object, was ${typeof markers}`);
        }
    }

    public update(config: MarkerConfig) {
        config = config || this.config;
        if (!config) {
            return;
        }

        this.config = config;

        // #3143
        this.element.innerHTML = '';

        const html: (number | string)[] = [];

        if (typeof this.markers === 'object') {
            const ids = Object.keys(this.markers);
            const iLen = ids.length;
            for (let i = 0; i < iLen; i++) {
                const id = parseInt(ids[i], 10);

                const marker: Marker = this.markers[id];

                if (!marker.range) {
                    if (marker.update) {
                        marker.update(html, this, this.session, config);
                    }
                    continue;
                }

                if (typeof marker.range.start.row !== 'number') {
                    throw new TypeError();
                }
                if (typeof marker.range.start.column !== 'number') {
                    throw new TypeError();
                }
                if (typeof marker.range.end.row !== 'number') {
                    throw new TypeError();
                }
                if (typeof marker.range.end.row !== 'number') {
                    throw new TypeError();
                }

                let rangeClipRows = clipRows(marker.range, config.firstRow, config.lastRow);
                if (isEmpty(rangeClipRows)) continue;

                const range = this.session.documentToScreenRange(rangeClipRows);
                if (marker.renderer) {
                    const top = this.$getTop(range.start.row, config);
                    const left = this.$padding + range.start.column * config.characterWidth;
                    marker.renderer(html, range, left, top, config);
                }
                else if (marker.type === "fullLine") {
                    this.drawFullLineMarker(html, range, marker.clazz, config);
                }
                else if (marker.type === "screenLine") {
                    this.drawScreenLineMarker(html, range, marker.clazz, config);
                }
                else if (isMultiLine(range)) {
                    if (marker.type === "text") {
                        this.drawTextMarker(html, range, marker.clazz, config);
                    }
                    else {
                        this.drawMultiLineMarker(html, range, marker.clazz, config);
                    }
                }
                else {
                    this.drawSingleLineMarker(html, range, marker.clazz + " ace_start ace_br15", config);
                }
            }
        }

        // #3143
        // this.element.innerHTML = html.join("");

        // Visualization of position names.
        // <!-- beforebegin -->
        // <div this.element>
        //   <!-- afterbegin -->
        //   foo
        //   <!-- beforeend -->
        // </div this.element>
        // <!-- afterend -->
        this.element.insertAdjacentHTML('afterbegin', html.join(""));
    }

    private $getTop(row: number, layerConfig: LayerConfig): number {
        return (row - layerConfig.firstRowScreen) * layerConfig.lineHeight;
    }

    /**
     * Draws a marker, which spans a range of text on multiple lines
     */
    private drawTextMarker(stringBuilder: (number | string)[], range: RangeBasic, clazz: string, layerConfig: MarkerConfig, extraStyle?: string): void {

        function getBorderClass(tl: boolean, tr: boolean, br: boolean, bl: boolean): number {
            return (tl ? 1 : 0) | (tr ? 2 : 0) | (br ? 4 : 0) | (bl ? 8 : 0);
        }

        const session = this.session;
        const start = range.start.row;
        const end = range.end.row;
        let row = start;
        let prev = 0;
        let curr = 0;
        let next = session.getScreenLastRowColumn(row);
        const lineRange = new Range(row, range.start.column, row, curr);
        for (; row <= end; row++) {
            lineRange.start.row = lineRange.end.row = row;
            lineRange.start.column = row === start ? range.start.column : session.getRowWrapIndent(row);
            lineRange.end.column = next;
            prev = curr;
            curr = next;
            next = row + 1 < end ? session.getScreenLastRowColumn(row + 1) : row === end ? 0 : range.end.column;
            this.drawSingleLineMarker(
                stringBuilder,
                lineRange,
                clazz + (row === start ? " ace_start" : "") + " ace_br" + getBorderClass(row === start || row === start + 1 && range.start.column !== 0, prev < curr, curr > next, row === end),
                layerConfig,
                row === end ? 0 : 1,
                extraStyle);
        }
    }

    /**
     * Draws a multi line marker, where lines span the full width
     */
    private drawMultiLineMarker(stringBuilder: (number | string)[], range: RangeBasic, clazz: string, config: MarkerConfig, extraStyle = ""): void {
        // from selection start to the end of the line
        const padding = this.$padding;
        let height = config.lineHeight;
        let top = this.$getTop(range.start.row, config);
        const left = padding + range.start.column * config.characterWidth;

        stringBuilder.push(
            "<div class='", clazz, " ace_br1 ace_start' style='",
            "height:", height, "px;",
            "right:0;",
            "top:", top, "px;",
            "left:", left, "px;", extraStyle, "'></div>"
        );

        // from start of the last line to the selection end
        top = this.$getTop(range.end.row, config);
        const width = range.end.column * config.characterWidth;

        stringBuilder.push(
            "<div class='", clazz, " ace_br12' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", padding, "px;", extraStyle, "'></div>"
        );

        // all the complete lines
        height = (range.end.row - range.start.row - 1) * config.lineHeight;
        if (height < 0) {
            return;
        }
        top = this.$getTop(range.start.row + 1, config);

        const radiusClass = (range.start.column ? 1 : 0) | (range.end.column ? 0 : 8);

        stringBuilder.push(
            "<div class='", clazz, (radiusClass ? " ace_br" + radiusClass : ""), "' style='",
            "height:", height, "px;",
            "right:0;",
            "top:", top, "px;",
            "left:", padding, "px;", extraStyle, "'></div>"
        );
    }

    /**
     * Draws a marker which covers part or whole width of a single screen line.
     */
    public drawSingleLineMarker(stringBuilder: (number | string)[], range: RangeBasic, clazz: string, config: MarkerConfig, extraLength = 0, extraStyle = ""): void {
        const height = config.lineHeight;
        const width = (range.end.column + extraLength - range.start.column) * config.characterWidth;

        const top = this.$getTop(range.start.row, config);
        const left = this.$padding + range.start.column * config.characterWidth;

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "width:", width, "px;",
            "top:", top, "px;",
            "left:", left, "px;", extraStyle, "'></div>"
        );
    }

    /**
     *
     */
    private drawFullLineMarker(stringBuilder: (number | string)[], range: RangeBasic, clazz: string, config: MarkerConfig, extraStyle = ""): void {
        const top = this.$getTop(range.start.row, config);
        let height = config.lineHeight;
        if (range.start.row !== range.end.row) {
            height += this.$getTop(range.end.row, config) - top;
        }

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "top:", top, "px;",
            "left:0;right:0;", extraStyle, "'></div>"
        );
    }

    private drawScreenLineMarker(stringBuilder: (number | string)[], range: RangeBasic, clazz: string, config: MarkerConfig, extraStyle = ""): void {
        const top = this.$getTop(range.start.row, config);
        const height = config.lineHeight;

        stringBuilder.push(
            "<div class='", clazz, "' style='",
            "height:", height, "px;",
            "top:", top, "px;",
            "left:0;right:0;", extraStyle, "'></div>"
        );
    }
}
