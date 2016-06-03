import Diff from './Diff';
import DMP from './DMP';
import isChanged from './isChanged';
import MwChange from './MwChange';
import MwEdit from './MwEdit';
import MwEditor from './MwEditor';
import MwShadow from './MwShadow';
import FzSerializable from './ds/FzSerializable';
import FzLink from './ds/FzLink';
import FzShadow from './ds/FzShadow';
import dehydrateMap from './ds/dehydrateMap';

const dmp = new DMP();

/**
 * This is where the shadowTexts are kept.
 * It may be useful to subclass MwLink in order to maintain connection information?
 */
export default class MwLink implements FzSerializable<FzLink> {

    /**
     * 
     */
    shadows: { [fileId: string]: MwShadow } = {};

    /**
     * Backup Shadows may be maintained by a Server for guaranteed delivery.
     */
    backups: { [fileId: string]: MwShadow } = {};

    /**
     *
     */
    edits: MwEdit[] = [];

    rehydrate(value: FzLink): void {
        const mapShadows = (shadows: { [fileId: string]: FzShadow }): { [fileId: string]: MwShadow } => {
            const result: { [fileId: string]: MwShadow } = {};
            const fileIds = Object.keys(shadows);
            for (let i = 0; i < fileIds.length; i++) {
                const fileId = fileIds[i];
                const value = shadows[fileId];
                // TODO: It's looking like the constructor could take the frozen value?
                // And the construction should be done using an injector?
                const shadow = new MwShadow();
                shadow.rehydrate(value);
                result[fileId] = shadow;
            }
            return result;
        };
        this.shadows = mapShadows(value.s);
        this.backups = mapShadows(value.b);
        this.edits = value.e;
    }

    dehydrate(): FzLink {
        const value: FzLink = {
            s: dehydrateMap(this.shadows),
            b: dehydrateMap(this.backups),
            e: this.edits
        };
        this.shadows = void 0;
        this.backups = void 0;
        this.edits = void 0;
        return value;
    }

    /**
     * We're looking to purge actions for a specified file based upon the action (local) version.
     * TODO: Rename to reflect the local nature of the version parameter.
     * @param filename
     * @param version
     */
    discardActionsLe(filename: string, version: number) {
        // console.log(`discardActionsLe(${filename}, ${version})`);
        const edits = this.edits;
        for (let i = 0; i < edits.length; i++) {
            const edit = this.edits[i];
            const changes = edit.x;
            // Care! The length of the changes may change in the body of the loop,
            // so check the length each iteration.
            for (let j = 0; j < changes.length; j++) {
                const change = changes[j];
                if (change.f === filename) {
                    const action = change.a;
                    if (action && action.n <= version) {
                        changes.splice(j, 1);
                        j--;
                    }
                }
            }
            if (changes.length === 0) {
                edits.splice(i, 1);
                i--;
            }
        }
    }

    discardFileChanges(fileId: string) {
        const edits = this.edits;
        for (let i = 0; i < edits.length; i++) {
            const edit = edits[i];
            const changes = edit.x;
            // Care! The length of the changes may change in the body of the loop,
            // so check the length each iteration.
            for (let j = 0; j < changes.length; j++) {
                if (changes[j].f === fileId) {
                    changes.splice(j, 1);
                    j--;
                }
            }
            /*
            if (changes.length === 0) {
                edits.splice(i, 1);
                i--;
            }
            */
        }
    }

    ensureShadow(fileId: string): MwShadow {
        const existing = this.shadows[fileId];
        if (!existing) {
            const shadow = new MwShadow();
            this.shadows[fileId] = shadow;
            const backup = new MwShadow();
            this.backups[fileId] = backup;
            return shadow;
        }
        else {
            return existing;
        }
    }

    getShadow(fileId): MwShadow {
        const shadow = this.shadows[fileId];
        if (shadow) {
            return shadow;
        }
        else {
            throw new Error(`Missing shadow for file '${fileId}'.`);
        }
    }

    getBackup(fileId): MwShadow {
        const backup = this.backups[fileId];
        if (backup) {
            return backup;
        }
        else {
            // We don't always have a backup.
            return void 0;
        }
    }
    /**
     * Converts the delta to a Diff[] using the shadow text.
     * Increments the remote version number.
     * Applies the patch to the editor.
     *
     * @param fileId 
     * @param editor
     * @param code
     * @param delta The encoded differences.
     * @param localVersion This comes from the File change.
     * @param remoteVersion This comes from the Delta change.
     */
    patchDelta(fileId: string, editor: MwEditor, code: string, delta: string[], localVersion: number, remoteVersion: number) {
        const shadow = this.getShadow(fileId);
        const backup = this.getBackup(fileId);
        // The server offers a compressed delta of changes to be applied.
        // Handle the case where one party initiates with a Raw message and other party acknowledges with a Delta.
        if (typeof shadow.m !== 'number') {
            shadow.m = remoteVersion;
        }
        if (localVersion !== shadow.n) {
            if (backup && localVersion === backup.n) {
                // The previous response must have been lost.
                this.discardFileChanges(fileId);
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
            let diffs: Diff[];
            try {
                diffs = dmp.deltaArrayToDiffs(shadow.text, delta);
                shadow.m++;
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
                        const serverResult: (string | boolean[])[] = dmp.patch_apply(patches, shadow.text);
                        shadow.text = <string>serverResult[0];
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
    removeFile(fileId: string): MwChange {
        const change: MwChange = {
            f: fileId,
            m: this.getShadow(fileId).m,
            a: {
                c: 'N',
                n: void 0,
                x: void 0
            }
        };
        delete this.shadows[fileId];
        delete this.backups[fileId];
        return change;
    }
}
