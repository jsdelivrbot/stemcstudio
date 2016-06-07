import DoodleFile from '../doodles/DoodleFile';
import ensureFileContent from './ensureFileContent';

/**
 * Converts the doodle files into the files required for the Gist.
 * 
 * The trash files represent files that are known to exist in GitHub and must be physically deleted.
 * This is done by including a mapping from filename to null.
 */
export default function doodleFilesToGistFiles(dFiles: { [dName: string]: DoodleFile }, trash: { [dName: string]: DoodleFile }): { [gName: string]: { content: string } } {
    const gFiles: { [gName: string]: { content: string } } = {};

    const dNames = Object.keys(dFiles);
    const iLen = dNames.length;
    for (let i = 0; i < iLen; i++) {
        const dName = dNames[i];
        const dFile: DoodleFile = dFiles[dName];
        const gFile: { content: string } = { content: ensureFileContent(dName, dFile.document.getValue()) };
        gFiles[dName] = gFile;
    }

    const trashNames = Object.keys(trash);
    const jLen = trashNames.length;
    for (let j = 0; j < jLen; j++) {
        const name = trashNames[j];
        // Deletes are performed by including a filename with a null object.
        gFiles[name] = null;
    }
    return gFiles;
}
