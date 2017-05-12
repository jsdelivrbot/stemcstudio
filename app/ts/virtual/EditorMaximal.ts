import { EditorChangeable } from './EditorChangeable';
import { EditorCommandable } from './EditorCommandable';
import { EditorConfigurable } from './EditorConfigurable';
import { EditorController } from './EditorController';
import { EditorExtensible } from './EditorExtensible';
import { EditorFocusable } from './EditorFocusable';
import { EditorFoldable } from './EditorFoldable';
import { EditorKeyable } from './EditorKeyable';
import { EditorMarkable } from './EditorMarkable';
import { EditorMinimal } from './EditorMinimal';
import { EditorNavigable } from './EditorNavigable';
import { EditorRecordable } from './EditorRecordable';
import { EditorScrollable } from './EditorScrollable';
import { EditorSearchable } from './EditorSearchable';
import { EditorSelectable } from './EditorSelectable';
import { EditorSortable } from './EditorSortable';
import { EditorTypeAware } from './EditorTypeAware';
import { EditorUndoable } from './EditorUndoable';
import { EditorWithPointer } from './EditorWithPointer';
import { EditorWithSnippets } from './EditorWithSnippets';
import { EditorWithStatus } from './EditorWithStatus';
import { EditorWithTabStops } from './EditorWithTabStops';
import { EditorWithLineWidgets } from './EditorWithLineWidgets';

export interface EditorMaximal
    extends
    EditorChangeable,
    EditorCommandable,
    EditorConfigurable,
    EditorController,
    EditorExtensible,
    EditorFocusable,
    EditorFoldable,
    EditorKeyable,
    EditorMarkable,
    EditorMinimal,
    EditorNavigable,
    EditorRecordable,
    EditorScrollable,
    EditorSearchable,
    EditorSelectable,
    EditorSortable,
    EditorTypeAware,
    EditorUndoable,
    EditorWithPointer,
    EditorWithSnippets,
    EditorWithStatus,
    EditorWithTabStops,
    EditorWithLineWidgets {
}
