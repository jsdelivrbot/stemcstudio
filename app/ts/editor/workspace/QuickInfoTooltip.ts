import displayPartsToHtml from './displayPartsToHtml';
import Editor from '../Editor';
import EditorPosition from './EditorPosition';
// import escapeHTML from "../lib/escapeHTML";
import Tooltip from '../Tooltip';
import Position from '../Position';
import QuickInfo from './QuickInfo';
import QuickInfoTooltipHost from './QuickInfoTooltipHost';

/**
 * Returns the document position based upon the MouseEvent offset.
 * If the Editor no longer has an EditSession, it returns undefined.
 */
function getDocumentPositionFromScreenOffset(editor: Editor, x: number, y: number): Position {

    const renderer = editor.renderer;
    // var offset = (x + r.scrollLeft - r.$padding) / r.characterWidth;
    const offset = (x - renderer.getPadding()) / renderer.characterWidth;

    // @BUG: Quickfix for strange issue with top
    const correction = renderer.scrollTop ? 7 : 0;

    const row = Math.floor((y + renderer.scrollTop - correction) / renderer.lineHeight);
    const col = Math.round(offset);

    const session = editor.getSession();
    if (session) {
        return session.screenToDocumentPosition(row, col);
    }
    else {
        return void 0;
    }
}

/**
 *
 */
export default class QuickInfoTooltip extends Tooltip {
    private path: string;
    private editor: Editor;
    private host: QuickInfoTooltipHost;
    private mouseHandler: (event: MouseEvent) => void;
    private mouseMoveTimer: number;

    /**
     * @param path
     * @param editor
     * @param workspace
     */
    constructor(path: string, editor: Editor, workspace: QuickInfoTooltipHost) {
        super(editor.container);
        this.path = path;
        this.editor = editor;
        this.host = workspace;

        this.mouseHandler = (event: MouseEvent) => {

            this.hide();

            clearTimeout(this.mouseMoveTimer);

            if (event.srcElement['className'] === 'ace_content') {

                this.mouseMoveTimer = setTimeout(() => {
                    const documentPosition = getDocumentPositionFromScreenOffset(this.editor, event.offsetX, event.offsetY);
                    if (documentPosition) {
                        const position: number = EditorPosition.getPositionChars(this.editor, documentPosition);
                        this.host.getQuickInfoAtPosition(this.path, position, (err: any, quickInfo: QuickInfo) => {
                            if (!err) {
                                if (quickInfo) {
                                    // The displayParts and documentation are tokenized according to TypeScript conventions.
                                    // TODO: This information could be used to popup a syntax highlighted editor.
                                    let tip = `<b>${displayPartsToHtml(quickInfo.displayParts)}</b>`;
                                    if (quickInfo.documentation) {
                                        tip += `<br/><i>${displayPartsToHtml(quickInfo.documentation)}</i>`;
                                    }
                                    if (tip.length > 0) {
                                        this.setHtml(tip);
                                        this.setPosition(event.x, event.y + 10);
                                        this.show();
                                    }
                                }
                            }
                        });
                    }
                }, 800);
            }
        };
    }

    /**
     *
     */
    init() {
        this.editor.container.addEventListener('mousemove', this.mouseHandler);
    }

    /**
     *
     */
    terminate(): void {
        this.editor.container.removeEventListener('mousemove', this.mouseHandler);
    }
}
