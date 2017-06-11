import { displayPartsToHtml } from './displayPartsToHtml';
import { Editor } from '../Editor';
import { Tooltip } from '../Tooltip';
import { Position } from '../Position';
import { QuickInfoTooltipHost } from './QuickInfoTooltipHost';

/**
 * Returns the document position based upon the MouseEvent offset.
 * If the Editor no longer has an EditSession, it returns undefined.
 */
function getDocumentPositionFromScreenOffset(editor: Editor, x: number, y: number): Position | undefined {

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
 * Determines (with a guard) whether the target is an HTMLDivElement.
 */
function isHTMLDivElement(target: EventTarget): target is HTMLDivElement {
    return target instanceof HTMLDivElement;
}

/**
 * Determines whether the target is the editor content.
 */
function isEditorContent(target: EventTarget): boolean {
    if (isHTMLDivElement(target)) {
        return target.className === 'ace_content';
    }
    else {
        return false;
    }
}

/**
 *
 */
export class QuickInfoTooltip extends Tooltip {
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

        // Binding to `this` is allows us to use the mouseHandler method as a mouse event callback.
        this.mouseHandler = (event: MouseEvent) => {

            this.hide();

            clearTimeout(this.mouseMoveTimer);

            if (isEditorContent(event.target)) {

                this.mouseMoveTimer = window.setTimeout(() => {
                    const documentPosition = getDocumentPositionFromScreenOffset(this.editor, event.offsetX, event.offsetY);
                    if (documentPosition) {
                        const session = this.editor.getSession();
                        if (session) {
                            const document = session.getDocument();
                            if (document) {
                                const documentIndex = document.positionToIndex(documentPosition);
                                this.host.getQuickInfoAtPosition(this.path, documentIndex)
                                    .then((quickInfo) => {
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
                                    })
                                    .catch((reason) => {
                                        console.warn(`Unable to get quick information for '${this.path}' at position ${JSON.stringify(documentPosition)}. Reason: ${reason}`);
                                    });
                            }
                        }
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
