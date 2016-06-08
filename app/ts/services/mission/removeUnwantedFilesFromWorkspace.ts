import MwEdits from '../../synchronization/MwEdits';
import WsModel from '../../wsmodel/services/WsModel';

/**
 * @param slave The doodle that must conform to the master.
 * @param master A map containing fileNames as the key.
 */
export default function removeUnwantedFilesFromWorkspace(slave: WsModel, master: { [fileName: string]: MwEdits }) {
    const fileNames = slave.files.keys;
    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        if (fileName in master) {
            // May need to verify that the action is not a delete!
        }
        else {
            slave.deleteFile(fileName);
        }
    }
}
