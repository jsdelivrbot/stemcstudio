import WsFile from '../../wsmodel/services/WsFile';
import WsModel from '../../wsmodel/services/WsModel';
import fileExists from './fileExists';

/**
 * Detects that the program is using a CODE-MARKER.
 */
export default function detectMarker(marker: string, workspace: WsModel, path: string): boolean {
    if (fileExists(path, workspace)) {
        const indexFile: WsFile = workspace.getFileWeakRef(path);
        return indexFile.getText().indexOf(marker) >= 0;
    }
    else {
        return false;
    }
}
