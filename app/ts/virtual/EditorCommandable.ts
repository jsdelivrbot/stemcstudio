import { EditorChangeable } from './EditorChangeable';
import { EditorConfigurable } from './EditorConfigurable';
import { EditorController } from './EditorController';
import { EditorExtensible } from './EditorExtensible';
import { EditorFocusable } from './EditorFocusable';
import { EditorFoldable } from './EditorFoldable';
import { EditorKeyable } from './EditorKeyable';
import { EditorMarkable } from './EditorMarkable';
import { EditorNavigable } from './EditorNavigable';
import { EditorRecordable } from './EditorRecordable';
import { EditorScrollable } from './EditorScrollable';
import { EditorSearchable } from './EditorSearchable';
import { EditorSelectable } from './EditorSelectable';
import { EditorSortable } from './EditorSortable';
import { EditorUndoable } from './EditorUndoable';
import { EditorWithPointer } from './EditorWithPointer';
import { EditorWithSnippets } from './EditorWithSnippets';
import { EditorWithStatus } from './EditorWithStatus';
import { EditorWithTabStops } from './EditorWithTabStops';
import { EditorWithLineWidgets } from './EditorWithLineWidgets';

export interface EditorCommandable
    extends
    EditorChangeable,
    EditorConfigurable,
    EditorController,
    EditorExtensible,
    EditorFocusable,
    EditorFoldable,
    EditorKeyable,
    EditorMarkable,
    EditorNavigable,
    EditorRecordable,
    EditorScrollable,
    EditorSearchable,
    EditorSelectable,
    EditorSortable,
    EditorUndoable,
    EditorWithPointer,
    EditorWithSnippets,
    EditorWithStatus,
    EditorWithTabStops,
    EditorWithLineWidgets {
    getReadOnly(): boolean;
}
