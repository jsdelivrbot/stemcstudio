import Doodle from '../services/doodles/Doodle';
import DoodleFile from '../services/doodles/DoodleFile';
import WsModel from '../wsmodel/services/WsModel';

/**
 * 
 */
function copyFilesToWorkspace(dudeFiles: { [path: string]: DoodleFile }, workspace: WsModel): void {
    const paths = Object.keys(dudeFiles);
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const dudeFile = dudeFiles[path];
        const wsFile = workspace.newFile(path);
        try {
            wsFile.setText(dudeFile.content);
            // Later we will remember which files are open.
            wsFile.isOpen = false; // dudeFile.isOpen;
            wsFile.mode = dudeFile.language;
            wsFile.preview = dudeFile.preview;
            wsFile.raw_url = dudeFile.raw_url;
            wsFile.selected = dudeFile.selected;
            // FIXME: Some of these properties are a bit unreliable and could be dropped on the DoodleFile. 
            // wsFile.sha = dudeFile.sha;
            // wsFile.size = dudeFile.size;
            // wsFile.truncated = dudeFile.truncated;
            // wsFile.type = dudeFile.type;
        }
        finally {
            wsFile.release();
        }
    }
}

function copyTrashToWorkspace(dudeFiles: { [path: string]: DoodleFile }, workspace: WsModel): void {
    const paths = Object.keys(dudeFiles);
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const dudeFile = dudeFiles[path];
        const wsFile = workspace.newFile(path);
        try {
            wsFile.setText(dudeFile.content);
            wsFile.isOpen = false;
            wsFile.mode = dudeFile.language;
            wsFile.preview = dudeFile.preview;
            wsFile.raw_url = dudeFile.raw_url;
            wsFile.selected = dudeFile.selected;
            // FIXME: Some of these properties are a bit unreliable and could be dropped on the DoodleFile. 
            // wsFile.sha = dudeFile.sha;
            // wsFile.size = dudeFile.size;
            // wsFile.truncated = dudeFile.truncated;
            // wsFile.type = dudeFile.type;
            workspace.deleteFile(path);
        }
        finally {
            wsFile.release();
        }
    }
}

/**
 * 
 */
export default function copyDoodleToWorkspace(doodle: Doodle, wsModel: WsModel): void {

    copyFilesToWorkspace(doodle.files, wsModel);
    copyTrashToWorkspace(doodle.trash, wsModel);

    // Ignore properties which are maintained in package.json and so do not need to be copied.
    // This includes 'author', 'dependencies', 'description', 'keywords', 'name', 'operatorOverloading', and 'version'.
    wsModel.created_at = doodle.created_at;
    wsModel.gistId = doodle.gistId;
    wsModel.isCodeVisible = doodle.isCodeVisible;
    wsModel.isViewVisible = doodle.isViewVisible;
    wsModel.lastKnownJs = doodle.lastKnownJs;
    wsModel.owner = doodle.owner;
    wsModel.repo = doodle.repo;
    wsModel.updated_at = doodle.updated_at;
}
