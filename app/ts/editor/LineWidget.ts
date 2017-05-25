import { Editor } from './Editor';
import { EditSession } from './EditSession';
import { Fold } from './Fold';

/**
 *
 */
export interface LineWidget {
    html?: string;
    row: number;
    rowCount?: number;
    coverLine?: boolean;
    coverGutter: boolean;
    session?: EditSession | null;
    editor?: Editor;
    h?: number;
    w?: number;
    el: HTMLDivElement;
    pixelHeight?: number;
    fixedWidth?: boolean;
    fullWidth?: boolean;
    screenWidth?: number;
    type?: 'errorMarker';
    hidden?: boolean;
    _inDocument?: boolean;
    $oldWidget?: LineWidget;
    $fold?: Fold | null;
    destroy?: () => any;
}
