import { WsFile } from '../../modules/wsmodel/WsFile';
import { WsModel } from '../../modules/wsmodel/WsModel';
import { fileExists } from './fileExists';

/**
 * Detects that the program contains the specified marker string.
 */
export function detectMarker(marker: string, workspace: WsModel, path: string): boolean {
    if (fileExists(path, workspace)) {
        const indexFile = workspace.getFileWeakRef(path) as WsFile;
        return indexFile.getText().indexOf(marker) >= 0;
    }
    else {
        return false;
    }
}
