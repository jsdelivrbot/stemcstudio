import { createElement } from "../lib/dom";
import { stringRepeat } from "../lib/lang";
import { AbstractLayer } from './AbstractLayer';
import { Disposable } from '../Disposable';
import { EditSession } from "../EditSession";
import { EventBus } from "../EventBus";
import { EventEmitterClass } from "../lib/EventEmitterClass";
import { FoldLine } from "../FoldLine";
import { FontMetrics } from "../layer/FontMetrics";
import { changeCharacterSize } from '../layer/FontMetrics';
import { refChange } from '../refChange';
import { TextConfig } from './TextConfig';
import { Token } from "../Token";

const EOF_CHAR = "\xB6";
const EOL_CHAR_LF = "\xAC";
const EOL_CHAR_CRLF = "\xa4";
const TAB_CHAR = "\u2192";
const SPACE_CHAR = "\xB7";

export type TextLayerEventName = 'changeCharacterSize';

/**
 *
 */
export class TextLayer extends AbstractLayer implements Disposable, EventBus<TextLayerEventName, any, TextLayer> {
    public allowBoldFonts = false;
    public $padding = 0;
    private EOL_CHAR: string;

    private fontMetrics: FontMetrics | undefined;
    /**
     * Used to remove the handler for when the character size changes.
     */
    private removeChangeCharacterSizeHandler: (() => void) | undefined;

    private session: EditSession;
    private $pollSizeChangesTimer = 0;
    private showInvisibles = false;
    private displayIndentGuides = true;
    /**
     *
     */
    private $tabStrings: string[] = [];
    private $textToken = { "text": true, "rparen": true, "lparen": true };
    private tabSize: number;
    private $indentGuideRe: RegExp;
    public config: TextConfig;
    /**
     *
     */
    private $measureNode: Node;
    /**
     * 
     */
    private readonly eventBus: EventEmitterClass<TextLayerEventName, any, TextLayer>;
    public selectedNode: HTMLElement;

    constructor(parent: HTMLElement) {
        super(parent, "ace_layer ace_text-layer");
        refChange(this.uuid, 'TextLayer', +1);
        this.eventBus = new EventEmitterClass<TextLayerEventName, any, TextLayer>(this);
        this.EOL_CHAR = EOL_CHAR_LF;
    }

    /**
     *
     */
    public dispose(): void {
        if (this.removeChangeCharacterSizeHandler) {
            this.removeChangeCharacterSizeHandler();
            this.removeChangeCharacterSizeHandler = void 0;
        }
        if (this.fontMetrics) {
            this.fontMetrics.release();
            this.fontMetrics = void 0;
        }
        clearInterval(this.$pollSizeChangesTimer);
        if (this.$measureNode && this.$measureNode.parentNode) {
            this.$measureNode.parentNode.removeChild(this.$measureNode);
        }
        delete this.$measureNode;
        refChange(this.uuid, 'TextLayer', -1);
        super.dispose();
    }

    /**
     *
     */
    updateEolChar(): boolean {
        const EOL_CHAR = this.session.docOrThrow().getNewLineCharacter() === "\n" ? EOL_CHAR_LF : EOL_CHAR_CRLF;
        if (this.EOL_CHAR !== EOL_CHAR) {
            this.EOL_CHAR = EOL_CHAR;
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @param padding
     */
    public setPadding(padding: number): void {
        this.$padding = padding;
        this.element.style.padding = "0 " + padding + "px";
    }

    /**
     *
     */
    public getLineHeight(): number {
        if (this.fontMetrics) {
            return this.fontMetrics.$characterSize.height || 0;
        }
        else {
            throw new Error("Must set font metrics before calling getLineHeight.");
        }
    }

    /**
     *
     */
    public getCharacterWidth(): number {
        if (this.fontMetrics) {
            return this.fontMetrics.$characterSize.width || 0;
        }
        else {
            throw new Error("Must set font metrics before calling getCharacterWidth.");
        }
    }

    /**
     * @param fontMetrics
     */
    public setFontMetrics(fontMetrics: FontMetrics): void {
        this.fontMetrics = fontMetrics;
        this.fontMetrics.addRef();
        // TODO: Make sure off is called when fontMetrics are released
        this.removeChangeCharacterSizeHandler = this.fontMetrics.on(changeCharacterSize, (e) => {
            this.eventBus._signal(changeCharacterSize, e);
        });
        this.$pollSizeChanges();
    }

    /**
     *
     */
    public checkForSizeChanges(): void {
        if (this.fontMetrics) {
            this.fontMetrics.checkForSizeChanges();
        }
        else {
            throw new Error("Must set font metrics before calling checkForSizeChanges.");
        }
    }

    private $pollSizeChanges(): number {
        if (this.fontMetrics) {
            return this.$pollSizeChangesTimer = this.fontMetrics.$pollSizeChanges();
        }
        else {
            throw new Error();
        }
    }

    public setSession(session: EditSession): void {
        this.session = session;
        this.$computeTabString();
    }

    public getShowInvisibles(): boolean {
        return this.showInvisibles;
    }

    /**
     * This method required a session to be in effect.
     */
    public setShowInvisibles(showInvisibles: boolean) {
        if (this.showInvisibles === showInvisibles) {
            return false;
        }
        else {
            this.showInvisibles = showInvisibles;
            this.$computeTabString();
            return true;
        }
    }

    public getDisplayIndentGuides(): boolean {
        return this.displayIndentGuides;
    }

    /**
     * This method requires a session to be in effect.
     */
    public setDisplayIndentGuides(displayIndentGuides: boolean): boolean {
        if (this.displayIndentGuides === displayIndentGuides) {
            return false;
        }
        else {
            this.displayIndentGuides = displayIndentGuides;
            this.$computeTabString();
            return true;
        }
    }

    /**
     * Returns a function that when called will remove the callback for the specified event.
     */
    on(eventName: TextLayerEventName, callback: (event: any, source: TextLayer) => any): () => void {
        this.eventBus.on(eventName, callback, false);
        return () => {
            this.eventBus.off(eventName, callback);
        };
    }

    off(eventName: TextLayerEventName, callback: (event: any, source: TextLayer) => any): void {
        this.eventBus.off(eventName, callback);
    }

    // FIXME: DGH Check that this is consistent with ACE
    public onChangeTabSize(): void {
        this.$computeTabString();
    }

    /**
     * Recomputes the tabSize, and $tabStrings properties.
     * This method required a session to be defined.
     */
    private $computeTabString(): void {
        if (this.session) {
            const tabSize = this.session.getTabSize();
            this.tabSize = tabSize;
            const tabStr = this.$tabStrings = ["0"];
            for (let i = 1; i < tabSize + 1; i++) {
                if (this.showInvisibles) {
                    tabStr.push("<span class='ace_invisible ace_invisible_tab'>"
                        + TAB_CHAR
                        + stringRepeat("\xa0", i - 1)
                        + "</span>");
                }
                else {
                    tabStr.push(stringRepeat("\xa0", i));
                }
            }
            if (this.displayIndentGuides) {
                this.$indentGuideRe = /\s\S| \t|\t |\s$/;
                let className = "ace_indent-guide";
                let spaceClass = "";
                let tabClass = "";
                let spaceContent: string;
                let tabContent: string;
                if (this.showInvisibles) {
                    className += " ace_invisible";
                    spaceClass = " ace_invisible_space";
                    tabClass = " ace_invisible_tab";
                    spaceContent = stringRepeat(SPACE_CHAR, this.tabSize);
                    tabContent = TAB_CHAR + stringRepeat("\xa0", this.tabSize - 1);
                }
                else {
                    spaceContent = stringRepeat("\xa0", this.tabSize);
                    tabContent = spaceContent;
                }

                this.$tabStrings[" "] = "<span class='" + className + spaceClass + "'>" + spaceContent + "</span>";
                this.$tabStrings["\t"] = "<span class='" + className + tabClass + "'>" + tabContent + "</span>";
            }
        }
        else {
            // Ignoring, but could equally well throw an exception.
        }
    }

    /**
     * @param config
     * @param firstRow
     * @param lastRow
     */
    public updateLines(config: TextConfig, firstRow: number, lastRow: number): void {
        // Due to wrap line changes there can be new lines if e.g.
        // the line to updated wrapped in the meantime.
        if (this.config.lastRow !== config.lastRow ||
            this.config.firstRow !== config.firstRow) {
            this.scrollLines(config);
        }
        this.config = config;

        let first = Math.max(firstRow, config.firstRow);
        const last = Math.min(lastRow, config.lastRow);

        const lineElements = this.element.childNodes;
        let lineElementsIdx = 0;

        for (let row = config.firstRow; row < first; row++) {
            const foldLine = this.session.getFoldLine(row);
            if (foldLine) {
                if (foldLine.containsRow(first)) {
                    first = foldLine.start.row;
                    break;
                } else {
                    row = foldLine.end.row;
                }
            }
            lineElementsIdx++;
        }

        let row = first;
        let foldLine = this.session.getNextFoldLine(row);
        let foldStart = foldLine ? foldLine.start.row : Infinity;

        // TODO: strictNullChecks says foldLine may be null
        while (true) {
            if (row > foldStart) {
                if (foldLine) {
                    row = foldLine.end.row + 1;
                    foldLine = this.session.getNextFoldLine(row, foldLine);
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }
            }
            if (row > last)
                break;

            const lineElement: HTMLElement = <HTMLElement>lineElements[lineElementsIdx++];
            if (lineElement) {
                const html: string[] = [];
                this.$renderLine(
                    html, row, !this.$useLineGroups(), row === foldStart ? foldLine : false
                );
                lineElement.style.height = config.lineHeight * this.session.getRowLength(row) + "px";
                lineElement.innerHTML = html.join("");
            }
            row++;
        }
    }

    /**
     * @param config
     */
    public scrollLines(config: TextConfig): void {
        const oldConfig = this.config;
        this.config = config;

        if (!oldConfig || oldConfig.lastRow < config.firstRow)
            return this.update(config);

        if (config.lastRow < oldConfig.firstRow)
            return this.update(config);

        const el = this.element;
        if (oldConfig.firstRow < config.firstRow) {
            for (let row = this.session.getFoldedRowCount(oldConfig.firstRow, config.firstRow - 1); row > 0; row--) {
                if (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
            }
        }

        if (oldConfig.lastRow > config.lastRow) {
            for (let row = this.session.getFoldedRowCount(config.lastRow + 1, oldConfig.lastRow); row > 0; row--) {
                if (el.lastChild) {
                    el.removeChild(el.lastChild);
                }
            }
        }

        if (config.firstRow < oldConfig.firstRow) {
            const fragment = this.$renderLinesFragment(config, config.firstRow, oldConfig.firstRow - 1);
            if (el.firstChild)
                el.insertBefore(fragment, el.firstChild);
            else
                el.appendChild(fragment);
        }

        if (config.lastRow > oldConfig.lastRow) {
            const fragment = this.$renderLinesFragment(config, oldConfig.lastRow + 1, config.lastRow);
            el.appendChild(fragment);
        }
    }

    private $renderLinesFragment(config: TextConfig, firstRow: number, lastRow: number) {
        const fragment = this.element.ownerDocument.createDocumentFragment();
        let row = firstRow;
        let foldLine = this.session.getNextFoldLine(row);
        let foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                if (foldLine) {
                    row = foldLine.end.row + 1;
                    foldLine = this.session.getNextFoldLine(row, foldLine);
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }
            }
            if (row > lastRow)
                break;

            const container = <HTMLDivElement>createElement("div");

            const html: (number | string)[] = [];
            // Get the tokens per line as there might be some lines in between
            // beeing folded.
            this.$renderLine(html, row, false, row === foldStart ? foldLine : false);

            // don't use setInnerHtml since we are working with an empty DIV
            container.innerHTML = html.join("");
            if (this.$useLineGroups()) {
                container.className = 'ace_line_group';
                fragment.appendChild(container);
                container.style.height = config.lineHeight * this.session.getRowLength(row) + "px";

            }
            else {
                while (container.firstChild)
                    fragment.appendChild(container.firstChild);
            }

            row++;
        }
        return fragment;
    }

    /**
     * @param config
     */
    public update(config: TextConfig): void {

        this.config = config;

        const html: (number | string)[] = [];
        const firstRow = config.firstRow;
        const lastRow = config.lastRow;

        let row = firstRow;
        let foldLine = this.session.getNextFoldLine(row);
        let foldStart = foldLine ? foldLine.start.row : Infinity;

        while (true) {
            if (row > foldStart) {
                if (foldLine) {
                    row = foldLine.end.row + 1;
                    foldLine = this.session.getNextFoldLine(row, foldLine);
                    foldStart = foldLine ? foldLine.start.row : Infinity;
                }
            }
            if (row > lastRow) {
                break;
            }

            if (this.$useLineGroups()) {
                html.push("<div class='ace_line_group' style='height:", config.lineHeight * this.session.getRowLength(row), "px'>");
            }

            this.$renderLine(html, row, false, row === foldStart ? foldLine : false);

            if (this.$useLineGroups()) {
                html.push("</div>"); // end the line group
            }

            row++;
        }
        this.element.innerHTML = html.join("");
    }


    private $renderToken(stringBuilder: (number | string)[], screenColumn: number, token: Token, value: string): number {
        const replaceReg = /\t|&|<|( +)|([\x00-\x1f\x80-\xa0\u1680\u180E\u2000-\u200f\u2028\u2029\u202F\u205F\u3000\uFEFF])|[\u1100-\u115F\u11A3-\u11A7\u11FA-\u11FF\u2329-\u232A\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3000-\u303E\u3041-\u3096\u3099-\u30FF\u3105-\u312D\u3131-\u318E\u3190-\u31BA\u31C0-\u31E3\u31F0-\u321E\u3220-\u3247\u3250-\u32FE\u3300-\u4DBF\u4E00-\uA48C\uA490-\uA4C6\uA960-\uA97C\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFAFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF60\uFFE0-\uFFE6]/g;
        const replaceFunc = (c: string, a: any, b: any, tabIdx: number, idx4: any) => {
            if (a) {
                return this.showInvisibles ?
                    "<span class='ace_invisible ace_invisible_space'>" + stringRepeat(SPACE_CHAR, c.length) + "</span>" :
                    stringRepeat("\xa0", c.length);
            }
            else if (c === "&") {
                return "&#38;";
            }
            else if (c === "<") {
                return "&#60;";
            }
            else if (c === "\t") {
                const tabSize = this.session.getScreenTabSize(screenColumn + tabIdx);
                screenColumn += tabSize - 1;
                return this.$tabStrings[tabSize];
            }
            else if (c === "\u3000") {
                // U+3000 is both invisible AND full-width, so must be handled uniquely
                const classToUse = this.showInvisibles ? "ace_cjk ace_invisible ace_invisible_space" : "ace_cjk";
                const space = this.showInvisibles ? SPACE_CHAR : "";
                screenColumn += 1;
                return "<span class='" + classToUse + "' style='width:" +
                    (this.config.characterWidth * 2) +
                    "px'>" + space + "</span>";
            }
            else if (b) {
                return "<span class='ace_invisible ace_invisible_space ace_invalid'>" + SPACE_CHAR + "</span>";
            }
            else {
                screenColumn += 1;
                return "<span class='ace_cjk' style='width:" +
                    (this.config.characterWidth * 2) +
                    "px'>" + c + "</span>";
            }
        };

        const output = value.replace(replaceReg, replaceFunc);

        if (!this.$textToken[token.type]) {
            const classes = "ace_" + token.type.replace(/\./g, " ace_");
            let style = "";
            if (token.type === "fold")
                style = " style='width:" + (token.value.length * this.config.characterWidth) + "px;' ";
            stringBuilder.push("<span class='", classes, "'", style, ">", output, "</span>");
        }
        else {
            stringBuilder.push(output);
        }
        return screenColumn + value.length;
    }

    // FIXME; How can max be optional if it is always used?
    private renderIndentGuide(stringBuilder: (number | string)[], value: string, max?: number): string {
        let cols = value.search(this.$indentGuideRe);
        if (cols <= 0 || cols >= (max as number)) {
            return value;
        }
        if (value[0] === " ") {
            cols -= cols % this.tabSize;
            stringBuilder.push(stringRepeat(this.$tabStrings[" "], cols / this.tabSize));
            return value.substr(cols);
        } else if (value[0] === "\t") {
            stringBuilder.push(stringRepeat(this.$tabStrings["\t"], cols));
            return value.substr(cols);
        }
        return value;
    }

    private $renderWrappedLine(stringBuilder: (number | string)[], tokens: Token[], splits: number[], onlyContents: boolean) {
        let chars = 0;
        let split = 0;
        let splitChars = splits[0];
        let screenColumn = 0;

        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            let value = token.value;
            if (i === 0 && this.displayIndentGuides) {
                chars = value.length;
                value = this.renderIndentGuide(stringBuilder, value, splitChars);
                if (!value)
                    continue;
                chars -= value.length;
            }

            if (chars + value.length < splitChars) {
                screenColumn = this.$renderToken(stringBuilder, screenColumn, token, value);
                chars += value.length;
            } else {
                while (chars + value.length >= splitChars) {
                    screenColumn = this.$renderToken(
                        stringBuilder, screenColumn,
                        token, value.substring(0, splitChars - chars)
                    );
                    value = value.substring(splitChars - chars);
                    chars = splitChars;

                    if (!onlyContents) {
                        stringBuilder.push("</div>",
                            "<div class='ace_line' style='height:",
                            this.config.lineHeight, "px'>"
                        );
                    }

                    split++;
                    screenColumn = 0;
                    splitChars = splits[split] || Number.MAX_VALUE;
                }
                if (value.length !== 0) {
                    chars += value.length;
                    screenColumn = this.$renderToken(
                        stringBuilder, screenColumn, token, value
                    );
                }
            }
        }
    }

    private $renderSimpleLine(stringBuilder: (number | string)[], tokens: Token[]): void {
        let screenColumn = 0;
        let token = tokens[0];
        let value = token.value;
        if (this.displayIndentGuides) {
            value = this.renderIndentGuide(stringBuilder, value);
        }
        if (value) {
            screenColumn = this.$renderToken(stringBuilder, screenColumn, token, value);
        }
        for (let i = 1; i < tokens.length; i++) {
            token = tokens[i];
            value = token.value;
            screenColumn = this.$renderToken(stringBuilder, screenColumn, token, value);
        }
    }

    // row is either first row of foldline or not in fold
    private $renderLine(stringBuilder: (number | string)[], row: number, onlyContents: boolean, foldLine: FoldLine | boolean | null) {
        if (!foldLine && foldLine !== false) {
            foldLine = this.session.getFoldLine(row);
        }

        const tokens = foldLine ? this.$getFoldLineTokens(row, <FoldLine>foldLine) : this.session.getTokens(row);

        if (!onlyContents) {
            stringBuilder.push(
                "<div class='ace_line' style='height:",
                this.config.lineHeight * (
                    this.$useLineGroups() ? 1 : this.session.getRowLength(row)
                ), "px'>"
            );
        }

        // We may not get tokens if there is no language mode.
        if (tokens && tokens.length) {
            const splits = this.session.getRowSplitData(row);
            if (splits && splits.length)
                this.$renderWrappedLine(stringBuilder, tokens, splits, onlyContents);
            else
                this.$renderSimpleLine(stringBuilder, tokens);
        }

        if (this.showInvisibles) {
            if (foldLine)
                row = (<FoldLine>foldLine).end.row;

            stringBuilder.push(
                "<span class='ace_invisible ace_invisible_eol'>",
                row === this.session.getLength() - 1 ? EOF_CHAR : this.EOL_CHAR,
                "</span>"
            );
        }
        if (!onlyContents)
            stringBuilder.push("</div>");
    }

    private $getFoldLineTokens(row: number, foldLine: FoldLine): Token[] {
        const session = this.session;
        const renderTokens: Token[] = [];

        function addTokens(tokens: Token[], from: number, to: number): void {
            let idx = 0;
            let col = 0;
            while ((col + tokens[idx].value.length) < from) {
                col += tokens[idx].value.length;
                idx++;

                if (idx === tokens.length)
                    return;
            }
            if (col !== from) {
                let value = tokens[idx].value.substring(from - col);
                // Check if the token value is longer then the from...to spacing.
                if (value.length > (to - from))
                    value = value.substring(0, to - from);

                renderTokens.push({
                    type: tokens[idx].type,
                    value: value
                });

                col = from + value.length;
                idx += 1;
            }

            while (col < to && idx < tokens.length) {
                let value = tokens[idx].value;
                if (value.length + col > to) {
                    renderTokens.push({
                        type: tokens[idx].type,
                        value: value.substring(0, to - col)
                    });
                } else
                    renderTokens.push(tokens[idx]);
                col += value.length;
                idx += 1;
            }
        }

        let tokens = session.getTokens(row);
        foldLine.walk(function (placeholder, row, column, lastColumn, isNewRow) {
            if (placeholder != null) {
                renderTokens.push({
                    type: "fold",
                    value: placeholder
                });
            }
            else {
                if (isNewRow)
                    tokens = session.getTokens(row);

                if (tokens.length)
                    addTokens(tokens, lastColumn, column);
            }
        }, foldLine.end.row, this.session.getLine(foldLine.end.row).length);

        return renderTokens;
    }

    private $useLineGroups(): boolean {
        // For the updateLines function to work correctly, it's important that the
        // child nodes of this.element correspond on a 1-to-1 basis to rows in the
        // document (as distinct from lines on the screen). For sessions that are
        // wrapped, this means we need to add a layer to the node hierarchy (tagged
        // with the class name ace_line_group).
        return this.session.getUseWrapMode();
    }
}
