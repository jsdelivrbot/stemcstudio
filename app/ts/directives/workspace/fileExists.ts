import WsModel from '../../wsmodel/services/WsModel';

/**
 * Determines whether the doodle contains the specified file by name.
 */
export default function fileExists(fileName: string, doodle: WsModel): boolean {
    const file = doodle.files.exists(fileName);
    if (file) {
        return true;
    }
    else {
        return false;
    }
}
