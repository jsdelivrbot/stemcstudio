import Editor from './Editor';
import EditSession from './EditSession';
import Fold from './Fold';

/**
 *
 */
interface LineWidget {
    html: string;
    row: number;
    rowCount: number;
    coverLine: boolean;
    coverGutter: boolean;
    session: EditSession;
    editor: Editor;
    h: number;
    w: number;
    el: HTMLElement;
    pixelHeight: number;
    fixedWidth: boolean;
    fullWidth: boolean;
    screenWidth: number;
    hidden: boolean;
    _inDocument: boolean;
    $oldWidget: LineWidget;
    $fold: Fold;
}

export default LineWidget;
