import Doodle from '../services/doodles/Doodle';
import DoodleFile from '../services/doodles/DoodleFile';
import WsModel from '../wsmodel/services/WsModel';

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

export default function copyWorkspaceToDoodle(workspace: WsModel, doodle: Doodle): void {

    removeUnwantedFilesFromDoodle(workspace, doodle);

    const paths = workspace.getFileDocumentPaths();
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const doodleFile = ensureDoodleFile(doodle, path);
        const wsFile = workspace.findFileByPath(path);
        try {
            doodleFile.content = wsFile.getText();
            doodleFile.language = wsFile.mode;
            doodleFile.isOpen = wsFile.isOpen;
            doodleFile.preview = wsFile.preview;
            doodleFile.raw_url = wsFile.raw_url;
            doodleFile.selected = wsFile.selected;
            // FIXME: Remove the following properties from the DoodleFile.
            // doodleFile.sha = wsFile.sha;
            // doodleFile.size = wsFile.size;
            // doodleFile.truncated = wsFile.truncated;
            // doodleFile.type = wsFile.type;
        }
        finally {
            wsFile.release();
        }
    }
}
