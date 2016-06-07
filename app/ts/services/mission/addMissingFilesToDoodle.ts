import Doodle from '../../services/doodles/Doodle';
// import DoodleFile from '../../services/doodles/DoodleFile';
import MwEdits from '../../synchronization/MwEdits';

/**
 * @param slave The doodle that must conform to the master.
 * @param master A map containing fileNames as the key.
 */
export default function addMissingFilesToDoodle(doodle: Doodle, master: { [fileName: string]: MwEdits }) {
    const fileNames = Object.keys(master);
    for (let i = 0; i < fileNames.length; i++) {
        const fileName = fileNames[i];
        if (!doodle.existsFile(fileName)) {
            doodle.newFile(fileName);
        }
        else {
            // Will need updating.
        }
    }
}
