import { Editor } from './Editor';
import { Range } from './Range';
import { Renderer } from './Renderer';
import { Token } from './Token';
import { Tooltip } from './Tooltip';
import { addListener, removeListener } from './lib/event';

interface TokenEx extends Token {
    state?: string;
    merge?: any;
    stateTransitions?: string[];
}

/**
 *
 */
interface RendererEx extends Renderer {
    rect?: ClientRect;
    timeStamp?: number;
}

/**
 * This class may be useful for developing highlighters.
 * 
 * bindCheckbox("highlight_token", function(checked) {
 *     if (editor.tokenTooltip && !checked) {
 *         editor.tokenTooltip.destroy();
 *         delete editor.tokenTooltip;
 *     }
 *     else if (checked) {
 *         editor.tokenTooltip = new TokenTooltip(editor);
 *     }
 * });
 */
export class TokenTooltip extends Tooltip {
    private editor: Editor;
    private x: number;
    private y: number;
    private lastT: number;
    private $timer: number;
    private token: TokenEx;
    private range: Range;
    private marker: number;
    private maxHeight: number;
    private maxWidth: number;
    private height: number;
    private width: number;
    private tokenText: string;
    private onMouseMove: (e: MouseEvent) => any;
    private onMouseOut: (e: MouseEvent) => any;
    constructor(editor: Editor) {
        super(editor.container);
        if (editor['tokenTooltip'])
            return;
        editor['tokenTooltip'] = this;
        this.editor = editor;

        const update = () => {
            this.$timer = null;

            const r: RendererEx = this.editor.renderer;
            if (this.lastT - (r.timeStamp || 0) > 1000) {
                r.rect = null;
                r.timeStamp = this.lastT;
                this.maxHeight = window.innerHeight;
                this.maxWidth = window.innerWidth;
            }

            const canvasPos: ClientRect = r.rect || (r.rect = r.scroller.getBoundingClientRect());
            const offset = (this.x + r.scrollLeft - canvasPos.left - r.$padding) / r.characterWidth;
            const row = Math.floor((this.y + r.scrollTop - canvasPos.top) / r.lineHeight);
            const col = Math.round(offset);

            const screenPos = { row: row, column: col, side: offset - col > 0 ? 1 : -1 };
            const session = this.editor.session;
            const docPos = session.screenToDocumentPosition(screenPos.row, screenPos.column);
            let token: TokenEx = session.getTokenAt(docPos.row, docPos.column);

            if (!token && !session.getLine(docPos.row)) {
                token = {
                    type: "",
                    value: "",
                    state: session.bgTokenizer.getState(0)
                };
            }
            if (!token) {
                session.removeMarker(this.marker);
                this.hide();
                return;
            }

            let tokenText = token.type;
            if (token.state)
                tokenText += "|" + token.state;
            if (token.merge)
                tokenText += "\n  merge";
            if (token.stateTransitions)
                tokenText += "\n  " + token.stateTransitions.join("\n  ");

            if (this.tokenText !== tokenText) {
                this.setText(tokenText);
                this.width = this.getWidth();
                this.height = this.getHeight();
                this.tokenText = tokenText;
            }

            this.show();

            this.token = token;
            session.removeMarker(this.marker);
            this.range = new Range(docPos.row, token.start, docPos.row, token.start + token.value.length);
            this.marker = session.addMarker(this.range, "ace_bracket", "text");
        };

        this.onMouseMove = (e: MouseEvent) => {
            this.x = e.clientX;
            this.y = e.clientY;
            if (this.isOpen) {
                this.lastT = e.timeStamp;
                this.setPosition(this.x, this.y);
            }
            if (!this.$timer) {
                this.$timer = window.setTimeout(update, 100);
            }
        };

        this.onMouseOut = (e: MouseEvent) => {
            // if (e && e.currentTarget.contains(e.relatedTarget)) {
            //     return;
            // }
            this.hide();
            this.editor.session.removeMarker(this.marker);
            clearTimeout(this.$timer);
            this.$timer = void 0;
        };

        addListener(editor.renderer.scroller, "mousemove", this.onMouseMove);
        addListener(editor.renderer.content, "mouseout", this.onMouseOut);
    }
    setPosition(x: number, y: number) {
        if (x + 10 + this.width > this.maxWidth)
            x = window.innerWidth - this.width - 10;
        if (y > window.innerHeight * 0.75 || y + 20 + this.height > this.maxHeight)
            y = y - this.height - 30;

        super.setPosition.call(this, x + 10, y + 20);
    }

    destroy() {
        this.onMouseOut(void 0);
        removeListener(this.editor.renderer.scroller, "mousemove", this.onMouseMove);
        removeListener(this.editor.renderer.content, "mouseout", this.onMouseOut);
        delete this.editor['tokenTooltip'];
    }
}
