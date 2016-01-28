import displayPartsToHtml from './displayPartsToHtml';
import Editor from '../Editor';
import EditorPosition from './EditorPosition';
import escapeHTML from "../lib/escapeHTML";
import Tooltip from '../Tooltip';
import Workspace from './Workspace';
import Position from '../Position';
import QuickInfo from './QuickInfo';

function getDocumentPositionFromScreenOffset(editor: Editor, x: number, y: number): Position {

    var renderer = editor.renderer;
    // var offset = (x + r.scrollLeft - r.$padding) / r.characterWidth;
    var offset = (x - renderer.getPadding()) / renderer.characterWidth;

    // @BUG: Quickfix for strange issue with top
    var correction = renderer.scrollTop ? 7 : 0;

    var row = Math.floor((y + renderer.scrollTop - correction) / renderer.lineHeight);
    var col = Math.round(offset);

    return editor.getSession().screenToDocumentPosition(row, col);
}

/**
 * @class QuickInfoTooltip
 * @extends Tooltip
 */
export default class QuickInfoTooltip extends Tooltip {
    private fileName: string;
    private editor: Editor;
    private workspace: Workspace;
    private mouseHandler: (event: MouseEvent) => void;
    private mouseMoveTimer: number;

    /**
     * @class QuickInfoTooltip
     * @constructor
     * @param fileName {string}
     * @param editor {Editor}
     * @param workspace {Workspace}
     */
    constructor(fileName: string, editor: Editor, workspace: Workspace) {
        super(editor.container);
        this.fileName = fileName;
        this.editor = editor;
        this.workspace = workspace;

        this.mouseHandler = (event: MouseEvent) => {

            this.hide();

            clearTimeout(this.mouseMoveTimer);

            if (event.srcElement['className'] === 'ace_content') {

                this.mouseMoveTimer = setTimeout(() => {

                    var documentPosition = getDocumentPositionFromScreenOffset(this.editor, event.offsetX, event.offsetY);
                    var position: number = EditorPosition.getPositionChars(this.editor, documentPosition);
                    this.workspace.getQuickInfoAtPosition(this.fileName, position)
                        .then((quickInfo: QuickInfo) => {
                            if (quickInfo) {
                                var tip = `<b>${displayPartsToHtml(quickInfo.displayParts)}</b>`;
                                if (quickInfo.documentation) {
                                  tip += `<br/><i>${displayPartsToHtml(quickInfo.documentation)}</i>`;

                                }
                                if (tip.length > 0) {
                                    this.setHtml(tip);
                                    this.setPosition(event.x, event.y + 10);
                                    this.show();
                                }
                            }
                        })
                        .catch(function(err) {
                            // console.warn(`err => ${err}`)
                        });
                }, 800);
            }
        }
    }

    /**
     * @method init
     * @return {void}
     */
    init(): void {
        this.editor.container.addEventListener('mousemove', this.mouseHandler);
    }

    /**
     * @method terminate
     * @return {void}
     */
    terminate(): void {
        this.editor.container.removeEventListener('mousemove', this.mouseHandler);
    }
}