import MwChange from '../../modules/synchronization/MwChange';
import MwEdits from '../../modules/synchronization/MwEdits';

/**
 * Determines whether all of the edits in this workspace are Raw.
 * This is a sanity check for a download from the server.
 */
export default function allEditsRaw(files: { [fileName: string]: MwEdits }): boolean {
    const fileNames = Object.keys(files);
    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        const edits = files[fileName];
        const changes: MwChange[] = edits.x;
        for (let j = 0; j < changes.length; j++) {
            const change = changes[j];
            const action = change.a;
            if (action.c !== 'R') {
                return false;
            }
        }
    }
    return true;
}
