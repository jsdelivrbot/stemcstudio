import WsModel from '../../modules/wsmodel/services/WsModel';

/**
 * Determines whether the workspace contains the specified file by path.
 */
export default function fileExists(path: string, workspace: WsModel): boolean {
    if (typeof path !== 'string') {
        throw new Error("path must be a string");
    }
    if (!(workspace instanceof WsModel)) {
        throw new Error("workspace must be a WsModel");
    }
    return workspace.existsFile(path);
}
