import { createHTMLDivElement } from '../lib/dom';
import { createDelayedCall } from '../lib/lang/createDelayedCall';
import { Editor } from '../Editor';

export class StatusBar {
    private element: HTMLDivElement;
    constructor(editor: Editor, parentNode: HTMLElement) {
        this.element = createHTMLDivElement();
        this.element.className = "ace_status-indicator";
        this.element.style.cssText = "display: inline-block;";
        parentNode.appendChild(this.element);

        const statusUpdate = createDelayedCall(() => {
            this.updateStatus(editor);
        });

        editor.on("changeStatus", function () {
            statusUpdate.schedule(100);
        });

        editor.on("changeSelection", function () {
            statusUpdate.schedule(100);
        });
    }

    private updateStatus(editor: Editor) {
        const status: string[] = [];

        function add(str: string, separator = "|") {
            if (str) {
                if (status.length > 0) {
                    status.push(str, separator);
                }
                else {
                    status.push(str);
                }
            }
        }

        if (editor['$vimModeHandler']) {
            add(editor['$vimModeHandler'].getStatusText());
        }
        else if (editor.commands.recording) {
            add("REC");
        }

        const lead = editor.selection.lead;
        add((lead.row + 1) + ":" + lead.column, " ");
        if (!editor.selection.isEmpty()) {
            const range = editor.getSelectionRange();
            add("(" + (range.end.row - range.start.row) + ":" + (range.end.column - range.start.column) + ")");
        }
        status.pop();
        this.element.textContent = status.join("");
    }
}
