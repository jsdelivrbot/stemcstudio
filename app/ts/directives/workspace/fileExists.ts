import { WsModel } from '../../modules/wsmodel/WsModel';

/**
 * Determines whether the workspace contains the specified file by path.
 * 
 * This is really just an assertive way of calling workspace.extstsFile(path).
 * 
 * Throws an Error if the `path` argument is not a string.
 * Throws an Error if the `workspace` argument is not a WsModel.
 */
export function fileExists(path: string, workspace: WsModel): boolean {
    if (typeof path !== 'string') {
        throw new Error("path must be a string");
    }
    if (!(workspace instanceof WsModel)) {
        throw new Error("workspace must be a WsModel");
    }
    return workspace.existsFile(path);
}
