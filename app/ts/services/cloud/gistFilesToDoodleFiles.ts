import DoodleFile from '../doodles/DoodleFile';
import GistFile from '../github/GistFile';
import { modeFromName } from '../../utils/modeFromName';

/**
 * Maps the GistFile(s) onto the DoodleFile(s).
 * 
 * This is an opportunity to add, remove, rename or transform files.
 */
export default function gistFilesToDoodleFiles(gFiles: { [gName: string]: GistFile }, excludes: string[]): { [dName: string]: DoodleFile } {
    const dFiles: { [dName: string]: DoodleFile } = {};
    const gNames = Object.keys(gFiles);
    const iLen = gNames.length;
    for (let i = 0; i < iLen; i++) {
        const gName = gNames[i];
        if (excludes.indexOf(gName) < 0) {
            const gFile = gFiles[gName];
            const dFile: DoodleFile = new DoodleFile();
            dFile.content = gFile.content;
            dFile.isOpen = false;
            dFile.language = modeFromName(gName);
            dFile.htmlChoice = false;
            dFile.markdownChoice = false;
            dFile.raw_url = gFile.raw_url;
            dFile.selected = false;
            // This line shows that we are using the Gist file names as the Doodle file names.
            // It would be dangerous to attempt to rename here because it would not account
            // for the need to logically delete files in order to physically delete on GitHub.
            dFiles[gName] = dFile;
        }
    }
    return dFiles;
}
