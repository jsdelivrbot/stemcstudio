import Document from '../editor/Document';
import Doodle from '../services/doodles/Doodle';
import DoodleFile from '../services/doodles/DoodleFile';
import StringShareableMap from '../collections/StringShareableMap';
import WsFile from '../wsmodel/services/WsFile';
import WsModel from '../wsmodel/services/WsModel';

/**
 * 
 */
function copyDoodleFilesToWorkspace(dudeFiles: { [path: string]: DoodleFile }, wsFiles: StringShareableMap<WsFile>): void {
    const paths = Object.keys(dudeFiles);
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const dudeFile = dudeFiles[path];
        const wsFile = new WsFile(dudeFile.document);
        // FIXME: Some of these properties are a bit unreliable and could be dropped on the DoodleFile. 
        // wsFile.isOpen = dudeFile.isOpen;
        wsFile.language = dudeFile.language;
        // wsFile.preview = dudeFile.preview;
        // wsFile.raw_url = dudeFile.raw_url;
        // wsFile.selected = dudeFile.selected;
        // wsFile.sha = dudeFile.sha;
        // wsFile.size = dudeFile.size;
        // wsFile.truncated = dudeFile.truncated;
        // wsFile.type = dudeFile.type;
        wsFiles.putWeakRef(path, wsFile);
    }
}

/**
 * 
 */
export default function copyDoodleToWorkspace(doodle: Doodle, wsModel: WsModel): void {

    copyDoodleFilesToWorkspace(doodle.files, wsModel.files);
    copyDoodleFilesToWorkspace(doodle.trash, wsModel.trash);

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