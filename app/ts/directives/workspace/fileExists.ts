import WsModel from '../../wsmodel/services/WsModel';

/**
 * Determines whether the workspace contains the specified file by path.
 */
export default function fileExists(path: string, workspace: WsModel): boolean {
    return workspace.existsFile(path);
}
