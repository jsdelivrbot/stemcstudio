import Doodle from '../services/doodles/Doodle';
import DoodleFile from '../services/doodles/DoodleFile';
import { WsModel } from '../modules/wsmodel/WsModel';

function ensureDoodleFile(doodle: Doodle, path: string): DoodleFile {
    const doodleFile = doodle.findFileByName(path);
    if (doodleFile) {
        return doodleFile;
    }
    else {
        return doodle.newFile(path);
    }
}

function removeUnwantedFilesFromDoodle(workspace: WsModel, doodle: Doodle): void {
    if (doodle.files) {
        const paths = Object.keys(doodle.files);
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            if (!workspace.existsFile(path)) {
                doodle.deleteFile(path);
            }
        }
    }
}

function copyFiles(workspace: WsModel, doodle: Doodle) {
    const paths = workspace.getFileDocumentPaths();
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const doodleFile = ensureDoodleFile(doodle, path);
        const wsFile = workspace.findFileByPath(path);
        if (wsFile) {
            try {
                doodleFile.content = wsFile.getText();
                doodleFile.language = wsFile.mode;
                doodleFile.isOpen = wsFile.isOpen;
                doodleFile.htmlChoice = wsFile.htmlChoice;
                doodleFile.markdownChoice = wsFile.markdownChoice;
                doodleFile.raw_url = wsFile.existsInGitHub ? "bogusURL" : void 0;
                doodleFile.selected = wsFile.selected;
            }
            finally {
                wsFile.release();
            }
        }
    }
}

function copyTrash(workspace: WsModel, doodle: Doodle) {
    // We now need to ensure that the workspace trash is reflected in the doodle trash.
    // If we don't do this then we won't be able to delete Gist files after a serialize-deserialize cycle.
    const trashMap = workspace.trashByPath;
    const paths = Object.keys(trashMap);
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const doodleFile = ensureDoodleFile(doodle, path);
        const wsFile = trashMap[path];
        doodleFile.raw_url = wsFile.existsInGitHub ? "bogusURL" : void 0;
        if (!doodleFile.raw_url) {
            // If we don't perform this check then deleting the file from the Doodle will
            // physically delete the file rather than moving it to Doodle trash.
            console.warn("Expecting file in trash to be marked as having come from GitHub.");
        }
        doodle.deleteFile(path);
    }
}

/**
 * Used for serializing the workspace to the (intermediate) Doodle representation.
 */
export default function copyWorkspaceToDoodle(workspace: WsModel, doodle: Doodle): void {

    // Try to reduce thrashing by only removing the files we don't want.
    removeUnwantedFilesFromDoodle(workspace, doodle);

    // Removing unwanted files may create some trash, or maybe there was trash already.
    doodle.emptyTrash();

    copyFiles(workspace, doodle);

    copyTrash(workspace, doodle);

    // Ignore properties which are maintained in package.json and so do not need to be copied.
    // This includes 'author', 'dependencies', 'description', 'keywords', 'name', 'noLoopCheck', 'operatorOverloading', and 'version'.
    doodle.created_at = workspace.created_at;
    doodle.gistId = workspace.gistId;
    doodle.isCodeVisible = workspace.isCodeVisible;
    doodle.isViewVisible = workspace.isViewVisible;
    doodle.lastKnownJs = workspace.lastKnownJs;
    doodle.lastKnownJsMap = workspace.lastKnownJsMap;
    doodle.owner = workspace.owner;
    doodle.repo = workspace.repo;
    doodle.updated_at = workspace.updated_at;
}
