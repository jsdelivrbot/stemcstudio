import { Delta } from 'editor-document';
import { DeltaGroup } from './DeltaGroup';
import { EditSession } from './EditSession';
import { Fold } from './Fold';
import { Position } from 'editor-document';
import { Range } from './Range';

interface DeltaLight {
    action: 'insert' | 'remove';
    start: Position;
    end: Position;
    lines: string[];
    text: string;
}

/**
 * {action: 'removeFolds', folds: Fold[]} is a possible delta, so lines is actually optional!
 */
function $serializeDelta(delta: Delta): DeltaLight {
    return {
        action: delta.action,
        start: delta.start,
        end: delta.end,
        lines: delta.lines ? (delta.lines.length === 1 ? null : delta.lines) : null,
        text: delta.lines ? (delta.lines.length === 1 ? delta.lines[0] : null) : null
    } as DeltaLight;
}

function $deserializeDelta(delta: DeltaLight): Delta {
    return {
        action: delta.action,
        start: delta.start,
        end: delta.end,
        lines: delta.lines || [delta.text]
    };
}

function cloneDeltaSetsObj<S, T>(deltaSets_old: { group: 'doc'; deltas: S[] }[], fnGetModifiedDelta: (delta: S) => T) {
    const deltaSets_new = new Array<{ group: 'doc'; deltas: T[] }>(deltaSets_old.length);
    for (let i = 0; i < deltaSets_old.length; i++) {
        const deltaSet_old = deltaSets_old[i];
        const deltaSet_new = { group: deltaSet_old.group, deltas: new Array<T>(deltaSet_old.deltas.length) };

        for (let j = 0; j < deltaSet_old.deltas.length; j++) {
            const delta_old = deltaSet_old.deltas[j];
            deltaSet_new.deltas[j] = fnGetModifiedDelta(delta_old);
        }

        deltaSets_new[i] = deltaSet_new;
    }
    return deltaSets_new;
}

/**
 * Serializes deltaSets to reduce memory usage.
 */
function serializeDeltaSets(deltaSets: { group: 'doc'; deltas: Delta[] }[]) {
    return cloneDeltaSetsObj<Delta, DeltaLight>(deltaSets, $serializeDelta);
}

/**
 * Deserializes deltaSets to allow application to the document.
 */
function deserializeDeltaSets(deltaSets: { group: 'doc', deltas: DeltaLight[] }[]): DeltaGroup[] {
    return cloneDeltaSetsObj<DeltaLight, Delta>(deltaSets, $deserializeDelta);
}

/**
 * This object maintains the undo stack for an <code>EditSession</code>.
 */
export class UndoManager {

    /**
     *
     */
    private editSession: EditSession;

    /**
     *
     */
    private dirtyCounter = 0;

    /**
     *
     */
    private undoStack: { group: 'doc'; deltas: DeltaLight[] }[][] = [];

    /**
     *
     */
    private redoStack: { group: 'doc'; deltas: DeltaLight[] }[][] = [];

    /**
     * Provides a means for implementing your own undo manager. `options` has one property, `args`, an [[Array `Array`]], with two elements:
     *
     * - `args[0]` is an array of deltas
     * - `args[1]` is the editSession to associate with
     *
     * @param options Contains additional properties.
     */
    execute(options: { action?: string; args: ({ group: ('doc' | 'fold'); deltas: Delta[] | { action: string; folds: Fold[] }[] }[] | EditSession)[]; merge: boolean }): void {
        // FIXME: Notice that we have cast away the other possibility.
        // We should use a guard or the API should be more restrictive.
        const arg0 = <DeltaGroup[]>options.args[0];
        // Normalize deltas for storage.
        let deltaSets = serializeDeltaSets(arg0);
        this.editSession = <EditSession>options.args[1];
        if (options.merge && this.hasUndo()) {
            this.dirtyCounter--;
            const popped = this.undoStack.pop();
            if (popped) {
                deltaSets = popped.concat(deltaSets);
            }
        }
        this.undoStack.push(deltaSets);

        // Reset redo stack.
        this.redoStack = [];

        if (this.dirtyCounter < 0) {
            // The user has made a change after undoing past the last clean state.
            // We can never get back to a clean state now until markClean() is called.
            this.dirtyCounter = NaN;
        }
        this.dirtyCounter++;
    }

    /**
     * Perform an undo operation on the document, reverting the last change.
     *
     * @param dontSelect
     * @returns The range of the undo.
     */
    undo(dontSelect?: boolean): Range | null | undefined {
        const deltaSets = this.undoStack.pop();
        let undoSelectionRange: Range | null | undefined = null;
        if (deltaSets) {
            undoSelectionRange = this.editSession.undoChanges(deserializeDeltaSets(deltaSets), dontSelect);
            this.redoStack.push(deltaSets);
            this.dirtyCounter--;
        }
        return undoSelectionRange;
    }

    /**
     * Perform a redo operation on the document, reimplementing the last change.
     *
     * @param dontSelect
     * @returns The range of the redo.
     */
    redo(dontSelect?: boolean): Range | null | undefined {
        const deltaSets = this.redoStack.pop();
        let redoSelectionRange: Range | null | undefined = null;
        if (deltaSets) {
            redoSelectionRange = this.editSession.redoChanges(deserializeDeltaSets(deltaSets), dontSelect);
            this.undoStack.push(deltaSets);
            this.dirtyCounter++;
        }
        return redoSelectionRange;
    }

    /**
     * Destroys the stack of undo and redo redo operations and marks the manager as clean.
     */
    reset(): void {
        this.undoStack = [];
        this.redoStack = [];
        this.markClean();
    }

    /**
     * Returns `true` if there are undo operations left to perform.
     */
    hasUndo(): boolean {
        return this.undoStack.length > 0;
    }

    /**
     * Returns `true` if there are redo operations left to perform.
     */
    hasRedo(): boolean {
        return this.redoStack.length > 0;
    }

    /**
     * Marks the current status clean.
     */
    markClean(): void {
        this.dirtyCounter = 0;
    }

    /**
     * Determines whether the current status is clean.
     */
    isClean(): boolean {
        return this.dirtyCounter === 0;
    }
}
