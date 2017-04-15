// import Diff from './Diff';
import DMP from './DMP';
// import isChanged from './isChanged';
import MwAction from './MwAction';
// import MwEditor from './MwEditor';
import MwChange from './MwChange';
import FzSerializable from './ds/FzSerializable';
import FzShadow from './ds/FzShadow';

const INITIAL_VERSION = 1;

const dmp = new DMP();

export default class MwShadow implements FzSerializable<FzShadow> {

    /**
     * The local version number of the shadow document.
     * The use of 'n' follows the convention for naming the `client` or `local` version number.
     * The order of updating is as follows:
     * A diff is computed based upon the shadow text and the edit is tagged with this local version number.
     * The shadow text is then updated from the editor text and this local version number is incremented.
     */
    public n: number;

    /**
     * The remote version number of the shadow document.
     * The version number from the previously received Delta or Raw command.
     * This will initially be undefined which should serialize as an empty string (MobWrite).
     */
    public m: number;

    /**
     * The shadow text.
     */
    public text: string;

    /**
     * Did the receiver understand the senders' delta in the previous heartbeat?
     * Initialize false because the sender and receiver are out of sync initially.
     */
    public happy = false;

    /**
     * Determines the strategy for synchronization.
     * This is usually fixed. For text use `true`, for numeric/enum use `false`.
     */
    private merge: boolean;

    constructor() {
        // We'll assume that we are synchronizing text and not numeric/enum content.
        this.merge = true;
    }

    /**
     * Copies the contents of the other shadow into this shadow.
     * This is useful for Backup Shadow operations in guaranteed delivery.
     */
    copy(other: MwShadow): void {
        this.n = other.n;
        this.m = other.m;
        this.text = other.text;
        this.happy = other.happy;
        this.merge = other.merge;
    }

    rehydrate(value: FzShadow): MwShadow {
        this.n = value.n;
        this.m = value.m;
        this.text = value.t;
        this.happy = value.h;
        this.merge = value.g;
        return this;
    }

    dehydrate(): FzShadow {
        const value: FzShadow = {
            n: this.n,
            m: this.m,
            t: this.text,
            h: this.happy,
            g: this.merge
        };
        this.n = void 0;
        this.m = void 0;
        this.text = void 0;
        this.happy = void 0;
        this.merge = void 0;
        return value;
    }

    /**
     * Diffs the text against this shadow and tags the changes with the local version number.
     * Updates the shadow text and increments the local version number.
     * @returns The file change containing the ack
     */
    public createDiffTextChange(text: string): MwChange {
        const action = this.diffAndTagWithLocalVersion(text);
        // Notice that updating the shadow text happens AFTER.
        this.updateTextAndIncrementLocalVersion(text);
        return this.createFileChange(action);

    }

    public createFullTextChange(text: string, overwrite: boolean): MwChange {
        if (typeof text !== 'string') {
            throw new TypeError("text must be a string");
        }
        if (typeof overwrite !== 'boolean') {
            throw new TypeError("overwrite must be a boolean");
        }
        this.updateTextAndIncrementLocalVersion(text);
        const action = this.createRawAction(overwrite);
        return this.createFileChange(action);
    }

    /**
     * Sets the properties specified and deltaOk to true. 
     */
    public updateRaw(text: string, remoteVersion: number): void {
        console.log(`shadow.updateRaw()`);
        this.updateTextAndIncrementLocalVersion(text);
        console.log(`Setting shadow remote version (m) to remoteVersion = ${remoteVersion}`);
        this.m = remoteVersion;
        // Sending a raw dump will put us back in sync.
        // Set deltaOk to true in case this sync fails to connect, in which case
        // the following sync(s) should be a delta, not more raw dumps.
        // We received the data. Next time we will only send a delta.
        this.happy = true;
        this.logState();
    }

    private logState(): void {
        console.log(`(n, m) happy => (${this.n}, ${this.m}) ${this.happy}`);
    }

    /**
     * Updates the text of the shadow and increments the local version number.
     */
    private updateTextAndIncrementLocalVersion(text: string): void {
        this.text = text;
        if (typeof this.n === 'number') {
            const n = this.n;
            console.log(`Incrementing shadow local version number (n) from ${n} to ${n + 1}`);
            this.n++;
        }
        else {
            console.log(`Setting shadow local version (n) to INITIAL_VERSION = ${INITIAL_VERSION}`);
            this.n = INITIAL_VERSION;
        }
        this.logState();
    }

    /**
     * Encapsulates the rule that the file change acknowledges by providing
     * the remote version number.
     */
    private createFileChange(action: MwAction): MwChange {
        return { m: this.m, a: action };
    }

    /**
     * Creates a Raw action based upon the shadow's local version number and text.
     *
     * @param overwrite Determines whether the action will overwrite the user's editor, or just the shadow.
     */
    private createRawAction(overwrite: boolean): MwAction {
        // It should be clear here that we are sending the state of the shadow.
        return { c: overwrite ? 'R' : 'r', n: this.n, x: encodeURI(this.text).replace(/%20/g, ' ') };
    }

    /**
     * A diff is computed between the editor and this shadow to obtain a set of edits made by the user.
     * These edits are tagged with the local version number of this shadow from which they were created.
     * The shadow text is updated from the editor and the local version is incremented.
     */
    private diffAndTagWithLocalVersion(text: string): MwAction {
        if (this.happy) {
            // The last delta postback from the server to this shareObj was successful.
            // Send a compressed delta.
            const diffs = dmp.diff_main(this.text, text, true);
            if (diffs.length > 2) {
                dmp.diff_cleanupSemantic(diffs);
                dmp.diff_cleanupEfficiency(diffs);
            }
            // const changed = isChanged(diffs);
            // Don't bother appending a no-change diff onto the stack if the stack already contains something.
            // But if the stack is empty for this file, do append something because we should ack the remote version.
            //            if (changed /* || !shadow.edits.length */) {
            // Convert the diffs into an action and tag with the local version of the shadow they were created from.
            const action: MwAction = {
                c: this.merge ? 'd' : 'D',
                n: this.n,
                x: dmp.diffsToDeltaArray(diffs)
            };
            return action;
            //            }
            //            else {
            // The edit stack stays the same, and the shadow document is unchanged.
            // Using undefined rather than null makes the serialized form a bit more compact.
            // In the end we are left with an acknowledgement of the 
            //                return void 0;
            //            }
        }
        else {
            throw new Error("Attempting to create diff when the last postback failed.");
        }
    }
}
