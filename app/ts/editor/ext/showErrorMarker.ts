import { createHTMLDivElement } from '../lib/dom';
import { EditorEventHandler } from '../../editor/Editor';
import { LineWidget } from '../../editor/LineWidget';
import { KeyboardResponse } from '../../editor/keyboard/KeyboardResponse';
//
// TODO: Less restrictive dependency.
//
import { Editor } from '../../editor/Editor';

/**
 * The purpose of this function is to scroll the editor such that it displays the next or previous error marker.
 * 
 * @param editor
 * @param direction +1 for the next error, -1 for the previous error.
 */
export function showErrorMarker(editor: Editor, direction: number): void {

    editor.enableLineWidgets();

    const pos = editor.getCursorPosition();
    let row = pos.row;
    const oldWidget = editor.getLineWidgetsAtRow(row).filter(function (w) { return w.type === 'errorMarker'; })[0];
    if (oldWidget && oldWidget.destroy) {
        oldWidget.destroy();
        oldWidget.destroy = void 0;
    }
    else {
        row -= direction;
    }
    const annotations = editor.findAnnotations(row, direction);
    let gutterAnno: { className: string | undefined, text: string[] } | null;
    if (annotations) {
        const annotation = annotations[0];
        // FIXME
        // pos.column = (annotation.pos && typeof annotation.column != "number" ? annotation.pos.sc : annotation.column) || 0;
        pos.column = typeof annotation.column === 'number' ? annotation.column : 0;
        pos.row = annotation.row;
        gutterAnno = editor.getGutterAnnotations()[pos.row];
    }
    else if (oldWidget) {
        return;
    }
    else {
        gutterAnno = { text: ["Looks good! Press Esc key to cancel."], className: "ace_ok" };
    }
    editor.unfold(pos.row);
    editor.moveSelectionToPosition(pos);

    const w: LineWidget = {
        row: pos.row,
        fixedWidth: true,
        coverGutter: true,
        el: createHTMLDivElement(),
        type: "errorMarker",
        destroy: void 0
    };
    const errorWidget = createHTMLDivElement();
    w.el.appendChild(errorWidget);
    const arrow = createHTMLDivElement();
    w.el.appendChild(arrow);
    if (gutterAnno) {
        arrow.className = "error_widget_arrow " + gutterAnno.className;
    }

    const left = editor.getCursorPixelPosition(pos).left;
    arrow.style.left = left + editor.getGutterWidth() - 5 + "px";

    w.el.className = "error_widget_wrapper";
    if (gutterAnno) {
        errorWidget.className = "error_widget " + gutterAnno.className;
        errorWidget.innerHTML = gutterAnno.text.join("<br>");
    }

    errorWidget.appendChild(createHTMLDivElement());

    const kb = editor.createKeyboardHandler();
    kb.handleKeyboard = function (data: any, hashId: number, keyString: string): KeyboardResponse<Editor> | undefined {
        if (hashId === 0 && (keyString === "esc" || keyString === "return")) {
            if (w.destroy) {
                w.destroy();
                w.destroy = void 0;
            }
            return { command: null };
        }
        return void 0;
    };

    w.destroy = function () {
        if (editor.isMousePressed()) {
            return;
        }
        editor.removeKeyboardHandler(kb);
        editor.removeLineWidget(w);
        editor.off("changeSelection", w.destroy as EditorEventHandler);
        editor.off("changeSession", w.destroy as EditorEventHandler);
        editor.off("mouseup", w.destroy as EditorEventHandler);
        editor.off("change", w.destroy as EditorEventHandler);
    };

    editor.addKeyboardHandler(kb);
    editor.on("changeSelection", w.destroy);
    editor.on("changeSession", w.destroy);
    editor.on("mouseup", w.destroy);
    editor.on("change", w.destroy);

    editor.addLineWidget(w);

    w.el.onmousedown = editor.focus.bind(editor);

    editor.scrollCursorIntoView(null, 0.5, { bottom: w.el.offsetHeight });
}
