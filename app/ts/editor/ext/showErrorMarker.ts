import { createHTMLDivElement } from '../lib/dom';
import Annotation from '../Annotation';
import Editor from '../Editor';
import EditSession from '../EditSession';
import KeyboardHandler from '../keyboard/KeyboardHandler';
import KeyboardResponse from '../keyboard/KeyboardResponse';
import LineWidget from '../LineWidget';
import LineWidgetManager from '../LineWidgetManager';

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
    return p1.row - p2.row || p1.column - p2.column;
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

function findAnnotations(session: EditSession, row: number, direction: number): Annotation[] {
    const annotations = session.getAnnotations().sort(comparePoints);
    if (!annotations.length)
        return;

    let i = binarySearch(annotations, { row: row, column: -1 }, comparePoints);
    if (i < 0)
        i = -i - 1;

    if (i >= annotations.length - 1)
        i = direction > 0 ? 0 : annotations.length - 1;
    else if (i === 0 && direction < 0)
        i = annotations.length - 1;

    let annotation = annotations[i];
    if (!annotation || !direction)
        return;

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
    return matched.length && matched;
}

/**
 * The purpose of this function is to scroll the editor such that it displays the next or previous error marker.
 * 
 * @param editor
 * @param direction +1 for the next error, -1 for the previous error.
 */
export default function showErrorMarker(editor: Editor, direction: number): void {
    const session = editor.session;
    if (!session.widgetManager) {
        session.widgetManager = new LineWidgetManager(session);
        session.widgetManager.attach(editor);
    }

    const pos = editor.getCursorPosition();
    let row = pos.row;
    const oldWidget = session.widgetManager.getWidgetsAtRow(row).filter(function (w) { return w.type === 'errorMarker'; })[0];
    if (oldWidget) {
        oldWidget.destroy();
    } else {
        row -= direction;
    }
    const annotations = findAnnotations(session, row, direction);
    let gutterAnno: { className: string, text: string[] };
    if (annotations) {
        const annotation = annotations[0];
        // FIXME
        // pos.column = (annotation.pos && typeof annotation.column != "number" ? annotation.pos.sc : annotation.column) || 0;
        pos.column = typeof annotation.column === 'number' ? annotation.column : 0;
        pos.row = annotation.row;
        gutterAnno = editor.renderer.$gutterLayer.$annotations[pos.row];
    }
    else if (oldWidget) {
        return;
    }
    else {
        gutterAnno = { text: ["Looks good! Press Esc key to cancel."], className: "ace_ok" };
    }
    editor.session.unfold(pos.row);
    editor.selection.moveToPosition(pos);

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
    arrow.className = "error_widget_arrow " + gutterAnno.className;

    const left = editor.renderer.cursorLayer.getPixelPosition(pos).left;
    arrow.style.left = left + editor.renderer.gutterWidth - 5 + "px";

    w.el.className = "error_widget_wrapper";
    errorWidget.className = "error_widget " + gutterAnno.className;
    errorWidget.innerHTML = gutterAnno.text.join("<br>");

    errorWidget.appendChild(createHTMLDivElement());

    const kb = new KeyboardHandler();
    kb.handleKeyboard = function (data: any, hashId: number, keyString: string): KeyboardResponse {
        if (hashId === 0 && (keyString === "esc" || keyString === "return")) {
            w.destroy();
            return { command: null };
        }
    };

    w.destroy = function () {
        if (editor.$mouseHandler.isMousePressed) {
            return;
        }
        editor.keyBinding.removeKeyboardHandler(kb);
        session.widgetManager.removeLineWidget(w);
        editor.off("changeSelection", w.destroy);
        editor.off("changeSession", w.destroy);
        editor.off("mouseup", w.destroy);
        editor.off("change", w.destroy);
    };

    editor.keyBinding.addKeyboardHandler(kb);
    editor.on("changeSelection", w.destroy);
    editor.on("changeSession", w.destroy);
    editor.on("mouseup", w.destroy);
    editor.on("change", w.destroy);

    editor.session.widgetManager.addLineWidget(w);

    w.el.onmousedown = editor.focus.bind(editor);

    editor.renderer.scrollCursorIntoView(null, 0.5, { bottom: w.el.offsetHeight });
}
