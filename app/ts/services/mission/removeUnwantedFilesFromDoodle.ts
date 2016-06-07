import Doodle from '../../services/doodles/Doodle';
import MwEdits from '../../synchronization/MwEdits';

/**
 * @param slave The doodle that must conform to the master.
 * @param master A map containing fileNames as the key.
 */
export default function removeUnwantedFilesFromDoodle(slave: Doodle, master: { [fileName: string]: MwEdits }) {
    const fileNames = Object.keys(slave.files);
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
