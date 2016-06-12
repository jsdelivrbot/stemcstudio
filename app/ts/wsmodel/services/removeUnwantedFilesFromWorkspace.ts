import MwEdits from '../../synchronization/MwEdits';
import WsModel from '../../wsmodel/services/WsModel';

/**
 * @param slave The workspace that must conform to the master.
 * @param master A map containing paths as the key.
 */
export default function removeUnwantedFilesFromWorkspace(slave: WsModel, master: { [path: string]: MwEdits }) {
    const paths = slave.getFileDocumentPaths();
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        if (path in master) {
            // May need to verify that the action is not a delete!
        }
        else {
            slave.deleteFile(path);
        }
    }
}
