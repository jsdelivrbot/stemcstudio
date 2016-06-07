import Doodle from '../doodles/Doodle';
import GistData from '../github/GistData';
import IOptionManager from '../options/IOptionManager';
import doodleFilesToGistFiles from './doodleFilesToGistFiles';

export default function doodleToGist(doodle: Doodle, options: IOptionManager): GistData {
    const gist: GistData = {
        description: doodle.description,
        public: true,
        files: doodleFilesToGistFiles(doodle.files, doodle.trash)
    };
    return gist;
}
