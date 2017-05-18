import Doodle from '../services/doodles/Doodle';
import DoodleFile from '../services/doodles/DoodleFile';
import { WsModel } from '../modules/wsmodel/WsModel';

/**
 * 
 */
function copyFilesToWorkspace(dudeFiles: { [path: string]: DoodleFile }, workspace: WsModel, callback: (reason: Error | null | undefined) => any): void {
    if (dudeFiles) {
        const paths = Object.keys(dudeFiles);
        const iLen = paths.length;
        let outstanding = iLen;
        if (iLen > 0) {
            for (let i = 0; i < iLen; i++) {
                const path = paths[i];
                const dudeFile = dudeFiles[path];
                const wsFile = workspace.newFileUnmonitored(path, false);
                try {
                    wsFile.setText(dudeFile.content);
                    wsFile.isOpen = dudeFile.isOpen;
                    wsFile.mode = dudeFile.language;
                    wsFile.htmlChoice = dudeFile.htmlChoice;
                    wsFile.markdownChoice = dudeFile.markdownChoice;
                    wsFile.existsInGitHub = !!dudeFile.raw_url;
                    wsFile.selected = dudeFile.selected;
                    workspace.beginDocumentMonitoring(path, function (beginMonitoringError) {
                        if (!beginMonitoringError) {
                            // Do nothing.
                        }
                        else {
                            console.warn(`Failed to begin monitoring for ${path}`);
                        }
                        outstanding--;
                        if (outstanding === 0) {
                            // TODO: Error propagation.
                            callback(void 0);
                        }
                    });
                }
                finally {
                    wsFile.release();
                }
            }
        }
        else {
            // We can only callback if we treat zero paths as a special case.
            window.setTimeout(function () {
                callback(void 0);
            });
        }
    }
}

function copyTrashToWorkspace(dudeFiles: { [path: string]: DoodleFile }, workspace: WsModel): void {
    const paths = Object.keys(dudeFiles);
    for (const path of paths) {
        workspace.trashPut(path);
    }
}

/**
 * Copies from the doodle to the workspace.
 * The callback is use to report that monitoring of all files has completed.
 */
export default function copyDoodleToWorkspace(doodle: Doodle, workspace: WsModel, callback: (reason: Error) => any): void {

    workspace.emptyTrash();

    copyFilesToWorkspace(doodle.files, workspace, callback);

    copyTrashToWorkspace(doodle.trash, workspace);

    // Ignore properties which are maintained in package.json and so do not need to be copied.
    // This includes 'author', 'dependencies', 'description', 'keywords', 'name', 'noLoopCheck', 'operatorOverloading', and 'version'.
    workspace.created_at = doodle.created_at as string;
    workspace.gistId = doodle.gistId as string;
    workspace.isCodeVisible = doodle.isCodeVisible;
    workspace.isViewVisible = doodle.isViewVisible;
    workspace.lastKnownJs = doodle.lastKnownJs;
    workspace.lastKnownJsMap = doodle.lastKnownJsMap;
    workspace.owner = doodle.owner as string;
    workspace.repo = doodle.repo as string;
    workspace.updated_at = doodle.updated_at as string;
}
