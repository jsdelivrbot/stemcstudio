import GistData from '../github/GistData';
import IOptionManager from '../options/IOptionManager';
import doodleFilesToGistFiles from './doodleFilesToGistFiles';
import WsModel from '../../wsmodel/services/WsModel';

export default function(workspace: WsModel, options: IOptionManager): GistData {
    const gist: GistData = {
        description: workspace.description,
        public: true,
        files: doodleFilesToGistFiles(workspace.files, workspace.trash)
    };
    return gist;
}
