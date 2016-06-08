import MwEdits from '../../synchronization/MwEdits';
import WsModel from '../../wsmodel/services/WsModel';

/**
 * @param slave The doodle that must conform to the master.
 * @param master A map containing fileNames as the key.
 */
export default function addMissingFilesToWorkspace(workspace: WsModel, master: { [fileName: string]: MwEdits }) {
    const fileNames = Object.keys(master);
    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        if (!workspace.existsFile(fileName)) {
            workspace.newFile(fileName);
        }
        else {
            // Will need updating.
        }
    }
}
