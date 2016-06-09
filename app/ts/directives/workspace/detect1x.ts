import WsFile from '../../wsmodel/services/WsFile';
import WsModel from '../../wsmodel/services/WsModel';

/**
 * Existence check of a file (by name).
 */
function exists(fileName: string, workspace: WsModel): boolean {
    if (typeof fileName !== 'string') {
        throw new Error("fileName must be a string");
    }
    if (!(workspace instanceof WsModel)) {
        throw new Error("workspace must be a WsModel");
    }
    if (typeof workspace.files !== 'object') {
        throw new Error("workspace.files must be an object");
    }
    const file: WsFile = workspace.files.getWeakRef(fileName);
    return typeof file === 'object';
}

/**
 * Detects that the program is a 1.x version.
 * 
 * A 1.x program has exactly four working files with fixed names.
 */
export default function detect1x(workspace: WsModel): boolean {
    // It's OK to have these file name constants because we are detecting fixed 1.x characteristics.
    if (exists('index.html', workspace) && exists('script.ts', workspace) && exists('extras.ts', workspace) && exists('style.less', workspace)) {
        // It MAY be a 1.x project, but 2.x migrated projects may use the same file names as 1.x.
        // Look for the LIBS-MARKER (which exists in 1.x and is removed for 2.x and above).
        const indexFile: WsFile = workspace.files.getWeakRef('index.html');
        return indexFile.getText().indexOf("// LIBS-MARKER") >= 0;
    }
    else {
        // It's definitely not a 1.x project.
        return false;
    }
}
