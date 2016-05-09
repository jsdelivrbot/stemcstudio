import IDoodle from '../doodles/IDoodle';
import GistData from '../github/GistData';
import IOptionManager from '../options/IOptionManager';
import doodleFilesToGistFiles from './doodleFilesToGistFiles';

export default function doodleToGist(doodle: IDoodle, options: IOptionManager): GistData {
    const gist: GistData = {
        description: doodle.description,
        public: true,
        files: doodleFilesToGistFiles(doodle.files, doodle.trash)
    }
    return gist
}
