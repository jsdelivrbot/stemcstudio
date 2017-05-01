import { WsModel } from '../../modules/wsmodel/WsModel';

/**
 * Returns the contents of the file providing that the fileName exists on the Doodle.
 * If the file does not exits, a warning is logged to the console and we return undefined.
 */
export default function fileContent(path: string, workspace: WsModel): string | undefined {
    const file = workspace.getFileWeakRef(path);
    if (file) {
        return file.getText();
    }
    else {
        console.warn(`fileContent(${path}), path ${path} does not exist.`);
        return void 0;
    }
}
