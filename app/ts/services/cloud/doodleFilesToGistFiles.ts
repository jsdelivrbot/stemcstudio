import ensureFileContent from './ensureFileContent';
import StringShareableMap from '../../collections/StringShareableMap';
import WsFile from '../../wsmodel/services/WsFile';

/**
 * Converts the doodle files into the files required for the Gist.
 * 
 * The trash files represent files that are known to exist in GitHub and must be physically deleted.
 * This is done by including a mapping from filename to null.
 */
export default function doodleFilesToGistFiles(dFiles: StringShareableMap<WsFile>, trash: StringShareableMap<WsFile>): { [gName: string]: { content: string } } {
    const gFiles: { [gName: string]: { content: string } } = {};

    const dNames: string[] = dFiles.keys;
    const iLen = dNames.length;
    for (let i = 0; i < iLen; i++) {
        const dName: string = dNames[i];
        const dFile: WsFile = dFiles.getWeakRef(dName);
        const gFile: { content: string } = { content: ensureFileContent(dName, dFile.editSession.getValue()) };
        gFiles[dName] = gFile;
    }

    const trashNames: string[] = trash.keys;
    const jLen = trashNames.length;
    for (let j = 0; j < jLen; j++) {
        const name = trashNames[j];
        // Deletes are performed by including a filename with a null object.
        gFiles[name] = null;
    }
    return gFiles;
}
