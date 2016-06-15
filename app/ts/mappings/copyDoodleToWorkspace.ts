import Doodle from '../services/doodles/Doodle';
import DoodleFile from '../services/doodles/DoodleFile';
import WsModel from '../wsmodel/services/WsModel';

/**
 * 
 */
function copyFilesToWorkspace(dudeFiles: { [path: string]: DoodleFile }, workspace: WsModel): void {
    if (dudeFiles) {
        const paths = Object.keys(dudeFiles);
        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];
            const dudeFile = dudeFiles[path];
            const wsFile = workspace.newFile(path);
            try {
                wsFile.setText(dudeFile.content);
                wsFile.isOpen = dudeFile.isOpen;
                wsFile.mode = dudeFile.language;
                wsFile.preview = dudeFile.preview;
                wsFile.existsInGitHub = !!dudeFile.raw_url;
                wsFile.selected = dudeFile.selected;
            }
            finally {
                wsFile.release();
            }
        }
    }
}

function copyTrashToWorkspace(dudeFiles: { [path: string]: DoodleFile }, workspace: WsModel): void {
    const paths = Object.keys(dudeFiles);
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        workspace.trashPut(path);
    }
}

/**
 * 
 */
export default function copyDoodleToWorkspace(doodle: Doodle, workspace: WsModel): void {

    // console.lg("copyDoodleToWorkspace");
    // console.lg(`files => ${doodle.files ? Object.keys(doodle.files) : []}`);
    // console.lg(`trash => ${doodle.trash ? Object.keys(doodle.trash) : []}`);
    workspace.emptyTrash();

    copyFilesToWorkspace(doodle.files, workspace);

    copyTrashToWorkspace(doodle.trash, workspace);

    // Ignore properties which are maintained in package.json and so do not need to be copied.
    // This includes 'author', 'dependencies', 'description', 'keywords', 'name', 'operatorOverloading', and 'version'.
    workspace.created_at = doodle.created_at;
    workspace.gistId = doodle.gistId;
    workspace.isCodeVisible = doodle.isCodeVisible;
    workspace.isViewVisible = doodle.isViewVisible;
    workspace.lastKnownJs = doodle.lastKnownJs;
    workspace.owner = doodle.owner;
    workspace.repo = doodle.repo;
    workspace.updated_at = doodle.updated_at;
}
