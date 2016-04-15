import app from '../../app';
import Doodle from '../doodles/Doodle';
import DoodleFile from '../doodles/DoodleFile';
import GistFile from '../github/GistFile';
import GetGistResponse from '../github/GetGistResponse';
import GitHubService from '../github/GitHubService';
import ICloud from './ICloud';
import IDoodle from '../doodles/IDoodle';
import IDoodleConfig from './IDoodleConfig';
import modeFromName from '../../utils/modeFromName'

function mapFiles(gFiles: { [name: string]: GistFile }, excludes: string[]): { [name: string]: DoodleFile } {
    const dFiles: { [name: string]: DoodleFile } = {}
    const names = Object.keys(gFiles)
    const iLen = names.length
    for (let i = 0; i < iLen; i++) {
        const name = names[i]
        if (excludes.indexOf(name) < 0) {
            const gFile = gFiles[name]
            const dFile: DoodleFile = new DoodleFile()
            dFile.content = gFile.content
            dFile.language = modeFromName(name)
            dFiles[name] = dFile
        }
    }
    return dFiles
}

//
// The 'cloud' service is a slightly higher abstration over e.g., GitHub
//
app.factory('cloud', [
    'GitHub',
    'FILENAME_META',
    'FILENAME_HTML',
    'FILENAME_CODE',
    'FILENAME_LIBS',
    'FILENAME_LESS',
    function(
        github: GitHubService,
        FILENAME_META: string,
        FILENAME_HTML: string,
        FILENAME_CODE: string,
        FILENAME_LIBS: string,
        FILENAME_LESS: string
    ): ICloud {

        // Temporary to ensure correct Gist deserialization.
        function depArray(deps: { [key: string]: string }): string[] {
            const ds: string[] = [];
            for (let prop in deps) {
                if (deps.hasOwnProperty(prop)) {
                    ds.push(prop);
                }
            }
            return ds;
        }

        const cloud: ICloud = {
            downloadGist: function(token: string, gistId: string, callback: (err, doodle?: IDoodle) => void) {
                github.getGist(token, gistId, function(err: any, gist: GetGistResponse) {
                    if (!err) {
                        const metaInfo: IDoodleConfig = JSON.parse(gist.files[FILENAME_META].content);

                        const doodle = new Doodle()
                        doodle.gistId = gistId
                        doodle.uuid = metaInfo.uuid
                        doodle.description = gist.description
                        doodle.operatorOverloading = metaInfo.operatorOverloading
                        doodle.files = mapFiles(gist.files, [FILENAME_META])
                        doodle.dependencies = depArray(metaInfo.dependencies)
                        callback(undefined, doodle);
                    }
                    else {
                        callback(err);
                    }
                });
            }
        }
        return cloud;
    }]);
