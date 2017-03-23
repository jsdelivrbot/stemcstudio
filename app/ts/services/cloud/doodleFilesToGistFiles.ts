import ensureFileContent from './ensureFileContent';
import WsFile from '../../modules/wsmodel/services/WsFile';

/**
 * Converts the workspace files into the files required for the Gist.
 * 
 * The trash files represent files that are known to exist in GitHub and must be physically deleted.
 * This is done by including a mapping from path to null.
 */
export default function doodleFilesToGistFiles(files: { [path: string]: WsFile }, trash: { [path: string]: WsFile }): { [gName: string]: { content: string } | null } {
    const gFiles: { [path: string]: { content: string } | null } = {};

    const filesPaths: string[] = Object.keys(files);
    // console.lg(`filesPaths => ${filesPaths}`);
    const iLen = filesPaths.length;
    for (let i = 0; i < iLen; i++) {
        const path: string = filesPaths[i];
        const file: WsFile = files[path];
        const gFile: { content: string } = { content: ensureFileContent(path, file.getText()) };
        gFiles[path] = gFile;
    }

    const trashPaths: string[] = Object.keys(trash);
    // console.lg(`trashPaths => ${trashPaths}`);
    const jLen = trashPaths.length;
    for (let j = 0; j < jLen; j++) {
        // Deletes are performed by including a path key with a null value.
        gFiles[trashPaths[j]] = null;
    }
    return gFiles;
}
