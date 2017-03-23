import GistData from '../github/GistData';
import doodleFilesToGistFiles from './doodleFilesToGistFiles';
import WsModel from '../../modules/wsmodel/services/WsModel';

export default function (workspace: WsModel): GistData {
    const gist: GistData = {
        description: workspace.description,
        public: true,
        files: doodleFilesToGistFiles(workspace.filesByPath, workspace.trashByPath)
    };
    return gist;
}
