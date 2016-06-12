import ensureFileContent from './ensureFileContent';
import WsFile from '../../wsmodel/services/WsFile';

/**
 * Converts the doodle files into the files required for the Gist.
 * 
 * The trash files represent files that are known to exist in GitHub and must be physically deleted.
 * This is done by including a mapping from filename to null.
 */
export default function doodleFilesToGistFiles(files: { [path: string]: WsFile }, trash: { [path: string]: WsFile }): { [gName: string]: { content: string } } {
    const gFiles: { [gName: string]: { content: string } } = {};

    const paths: string[] = Object.keys(files);
    const iLen = paths.length;
    for (let i = 0; i < iLen; i++) {
        const path: string = paths[i];
        const file: WsFile = files[path];
        const gFile: { content: string } = { content: ensureFileContent(path, file.getText()) };
        gFiles[path] = gFile;
    }

    const trashPaths: string[] = Object.keys(trash);
    const jLen = trashPaths.length;
    for (let j = 0; j < jLen; j++) {
        // Deletes are performed by including a filename with a null object.
        gFiles[trashPaths[j]] = null;
    }
    return gFiles;
}
