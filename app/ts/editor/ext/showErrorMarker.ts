import { createHTMLDivElement } from '../lib/dom';
import { Annotation } from '../../virtual/editor';
import { Direction } from '../../virtual/editor';
import { Editor } from '../../virtual/editor';
import { EditorEventHandler } from '../../virtual/editor';
import { EditSession } from '../../virtual/editor';
import { LineWidget } from '../../virtual/editor';
import { KeyboardResponse } from '../../virtual/editor';
// import LineWidgetManager from '../LineWidgetManager';

/**
 * A modified Position with an optional column (like Annotation).
 */
interface Position {
    /**
     *
     */
    row: number;
    /**
     *
     */
    column?: number;
}

function comparePoints(p1: Annotation, p2: Annotation): number {
    return p1.row - p2.row || (p1.column as number) - (p2.column as number);
}

function binarySearch(array: Annotation[], needle: { row: number; column: number }, comparator: (lhs: Position, rhs: Position) => number) {
    let first = 0;
    let last = array.length - 1;

    while (first <= last) {
        const mid = (first + last) >> 1;
        const c = comparator(needle, array[mid]);
        if (c > 0) {
            first = mid + 1;
        }
        else if (c < 0) {
            last = mid - 1;
        }
        else {
            return mid;
        }
    }

    // Return the nearest lesser index, "-1" means "0, "-2" means "1", etc.
    return -(first + 1);
}

function findAnnotations(session: EditSession, row: number, direction: Direction): Annotation[] | undefined {
    const annotations = session.getAnnotations().sort(comparePoints);
    if (!annotations.length) {
        return void 0;
    }

    let i = binarySearch(annotations, { row: row, column: -1 }, comparePoints);
    if (i < 0)
        i = -i - 1;

    if (i >= annotations.length - 1)
        i = direction > 0 ? 0 : annotations.length - 1;
    else if (i === 0 && direction < 0)
        i = annotations.length - 1;

    let annotation = annotations[i];
    if (!annotation || !direction)
        return void 0;

    if (annotation.row === row) {
        do {
            annotation = annotations[i += direction];
        } while (annotation && annotation.row === row);
        if (!annotation)
            return annotations.slice();
    }


    const matched: Annotation[] = [];
    row = annotation.row;
    do {
        if (direction < 0) {
            matched.unshift(annotation);
        }
        else {
            matched.push(annotation);
        }
        annotation = annotations[i += direction];
    } while (annotation && annotation.row === row);
    if (matched.length) {
        return matched;
    }
    else {
        return void 0;
    }
}

/**
 * The purpose of this function is to scroll the editor such that it displays the next or previous error marker.
 * 
 * @param editor
 * @param direction +1 for the next error, -1 for the previous error.
 */
export default function showErrorMarker(editor: Editor, direction: number): void {

    if (!editor.getSession()) {
        return;
    }
    const session = editor.getSession() as EditSession;

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
    const annotations = findAnnotations(session, row, direction);
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
    session.unfold(pos.row);
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
    kb.handleKeyboard = function (data: any, hashId: number, keyString: string): KeyboardResponse | undefined {
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
