import Diff from './Diff';
import DMP from './DMP';
import isChanged from './isChanged';
import { MwActionType } from './MwAction';
import MwBroadcast from './MwBroadcast';
import MwChange from './MwChange';
import MwEdits from './MwEdits';
import MwEditor from './MwEditor';
import { MwOptions } from './MwOptions';
import MwShadow from './MwShadow';
import FzRemote from './ds/FzRemote';
import FzSerializable from './ds/FzSerializable';

const dmp = new DMP();

/**
 * Maintains a snapshot of remote documents
 */
export default class MwRemote implements FzSerializable<FzRemote> {
    /**
     * Every node (client or server) will have a shadow document.
     */
    shadow: MwShadow | undefined;

    /**
     * Backup Shadow may be maintained by a Server for guaranteed delivery.
     */
    backup: MwShadow | undefined;

    /**
     * The edits (changes) by destination node identifier.
     */
    private edits: MwBroadcast = {};

    /**
     * 
     */
    constructor(private readonly options: MwOptions) {
        // Do nothing.
    }

    /**
     * Returns the stack of edits for a specified destination node.
     * This method has no side-effects.
     */
    getEdits(nodeId: string): MwEdits {
        return this.edits[nodeId];
    }

    /**
     * Push the change onto the stack of outbound edits corresponding to the specified nodeId.
     */
    addChange(nodeId: string, change: MwChange): void {
        const edit = this.edits[nodeId];
        if (!edit) {
            this.edits[nodeId] = { x: [] };
        }
        this.edits[nodeId].x.push(change);
    }

    /**
     * Determines whether the outbound stack contains the raw action with the specified text.
     */
    containsRawAction(nodeId: string, text: string): boolean {
        const edits = this.getEdits(nodeId);
        const changes = edits.x;
        if (changes.length === 1) {
            const change = changes[0];
            const action = change.a;
            // BUG: action is undefined? Cannot read property 'x'
            // But why does it not fail acessing 'c'?
            // if (action && typeof action === 'undefined') {
            // }
            if (action && action.c === 'R' && action.x === text) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    dehydrate(): FzRemote {
        const value: FzRemote = {
            s: this.shadow ? this.shadow.dehydrate() : void 0,
            b: this.backup ? this.backup.dehydrate() : void 0,
            e: this.edits
        };
        return value;
    }

    rehydrate(value: FzRemote): void {
        this.shadow = value.s ? new MwShadow(this.options).rehydrate(value.s) : void 0;
        this.backup = value.b ? new MwShadow(this.options).rehydrate(value.b) : void 0;
        this.edits = value.e;
    }

    /**
     * 
     */
    ensureShadow(): MwShadow {
        if (!this.shadow) {
            this.shadow = new MwShadow(this.options);
            this.backup = new MwShadow(this.options);
        }
        return this.shadow;
    }

    /**
     * We're looking to purge actions for a specified file based upon the action (local) version.
     * TODO: Rename to reflect the local nature of the version parameter.
     * 
     * @param The target node identifier.
     * @param fileId
     * @param version
     */
    discardActionsLe(nodeId: string, version: number) {
        // console.lg(`discardActionsLe(${filename}, ${version})`);
        const edits = this.edits[nodeId];
        if (edits) {
            const changes = edits.x;
            // Care! The length of the changes may change in the body of the loop,
            // so check the length each iteration.
            for (let j = 0; j < changes.length; j++) {
                const change = changes[j];
                const action = change.a;
                if (action && <number>action.n <= version) {
                    changes.splice(j, 1);
                    j--;
                }
            }
            if (changes.length === 0) {
                delete this.edits[nodeId];
            }
        }
    }

    /**
     * @param nodeId The target node identifier.
     */
    discardChanges(nodeId: string) {
        delete this.edits[nodeId];
    }

    /**
     * Converts the delta to a Diff[] using the shadow text.
     * Increments the remote version number (m) on the shadow.
     * Applies the patch to the editor.
     *
     * @param nodeId The target node identifier.
     * @param editor
     * @param code The action type is expected to be 'D' or 'd'.
     * @param delta The encoded differences.
     * @param localVersion This comes from the File change.
     * @param remoteVersion This comes from the Delta change.
     */
    patchDelta(nodeId: string, editor: MwEditor, code: MwActionType, delta: string[], localVersion: number, remoteVersion: number): void {
        const shadow = this.shadow as MwShadow;
        const backup = this.backup;
        // The server offers a compressed delta of changes to be applied.
        // Handle the case where one party initiates with a Raw message and other party acknowledges with a Delta.
        if (typeof shadow.m !== 'number') {
            console.log(`Setting shadow remote version (m) to server remote version = ${remoteVersion}`);
            shadow.m = remoteVersion;
        }
        if (localVersion !== shadow.n) {
            if (backup && localVersion === backup.n) {
                // The previous response must have been lost.
                this.discardChanges(nodeId);
                shadow.copy(backup);
                shadow.happy = true;
            }
            else {
                // Can't apply a delta on a mismatched this version.
                shadow.happy = false;
                console.warn(`handleDelta(...) this.localVersion=${shadow.n}, localVersion=${localVersion}`);
            }
        }
        else if (remoteVersion > shadow.m) {
            // Remote has a version in the future?
            shadow.happy = false;
            console.warn('Remote version in future.\n' + 'Expected: ' + shadow.m + ' Got: ' + remoteVersion);
        }
        else if (remoteVersion < shadow.m) {
            // We've already seen this delta.
            // This happens when one side sends but the other side does not acknowledge often enough?
            // TODO: Send this to some other log.
            // console.warn(`Ignoring duplicate packet. m => ${remoteVersion}, this.m => ${this.m}`);
        }
        else {
            // Expand the delta into a diff using the shadow text.
            let diffs: Diff[] | null;
            try {
                diffs = dmp.deltaArrayToDiffs(shadow.text, delta);
                const m = shadow.m;
                console.log(`Incrementing shadow remote version number (m) from ${m} to ${m + 1}`);
                shadow.m++;
                console.log(`(n, m) => (${shadow.n}, ${shadow.m})`);
            }
            catch (e) {
                // The delta the server supplied does not fit on our copy of thisText.
                diffs = null;
                // Set k to false so that on the next sync we send
                // a complete dump to get back in sync.
                shadow.happy = false;
                // Do the next sync soon because the user will lose any changes.
                // this.syncInterval = 0;
                console.warn('Delta mismatch.\n' + encodeURI(shadow.text));
            }
            if (diffs) {
                if (isChanged(diffs)) {
                    // Compute and apply the patches.
                    if (code === 'D') {
                        // Overwrite text.
                        shadow.text = dmp.resultText(diffs);
                        editor.setText(shadow.text);
                        shadow.happy = true;
                    }
                    else {
                        // Merge text.
                        const patches = dmp.computePatches(shadow.text, diffs);
                        // First thisText.  Should be guaranteed to work.
                        const serverResult = dmp.patch_apply(patches, shadow.text);
                        // TODO: Why aren't we looking at the boolean[]?
                        shadow.text = serverResult[0];
                        shadow.happy = true;
                        // Second the user's text.
                        editor.patch(patches);
                    }
                    // Server-side activity.
                    // this.serverChange_ = true;
                }
                else {
                    // Don't apply a diff which does not contain changes.
                    shadow.happy = true;
                }
            }
            else {
                // delta supplied does not fit in shadow text.
            }
        }
    }

    /**
     * Constructs a nullify change incorporating the remote version of the shadow.
     * Removes the shadow and backup for the specified file.
     * @returns The nullify change for incorporation into the edits.
     */
    removeFile(): MwChange | undefined {
        if (this.shadow) {
            const change: MwChange = {
                m: this.shadow.m,
                a: {
                    c: 'N',
                    n: void 0,
                    x: void 0
                }
            };
            this.shadow = void 0;
            this.backup = void 0;
            return change;
        }
        else {
            return void 0;
        }
    }
}
