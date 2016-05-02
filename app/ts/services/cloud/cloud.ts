import app from '../../app';
import CookieService from '../cookie/CookieService';
import Doodle from '../doodles/Doodle';
import GetGistResponse from '../github/GetGistResponse';
import GitHubService from '../github/GitHubService';
import ICloud from './ICloud';
import IDoodle from '../doodles/IDoodle';
import IOptionManager from '../options/IOptionManager';
import gistFilesToDoodleFiles from './gistFilesToDoodleFiles';
import hyphenate from '../../utils/hyphenate';

const LEGACY_META = 'doodle.json';

//
// The 'cloud' service is a slightly higher abstration over e.g., GitHub
//
app.factory('cloud', [
    'cookie',
    'GitHub',
    'FILENAME_META',
    'GITHUB_TOKEN_COOKIE_NAME',
    'options',
    function(
        cookie: CookieService,
        github: GitHubService,
        FILENAME_META: string,
        GITHUB_TOKEN_COOKIE_NAME: string,
        options: IOptionManager
    ): ICloud {

        const cloud: ICloud = {
            downloadGist: function(gistId: string, callback: (err, doodle?: IDoodle) => void) {
                const token = cookie.getItem(GITHUB_TOKEN_COOKIE_NAME);
                github.getGist(token, gistId, function(err: any, gist: GetGistResponse) {
                    if (!err) {
                        const doodle = new Doodle(options)
                        doodle.gistId = gistId
                        doodle.description = gist.description
                        doodle.files = gistFilesToDoodleFiles(gist.files, [])

                        // Convert the legacy doodle.json file to package.json.
                        if (doodle.existsFile(LEGACY_META)) {
                            if (!doodle.existsFile(FILENAME_META)) {
                                doodle.renameFile(LEGACY_META, FILENAME_META)
                                // Ensure that the package.json file gets the name and version properties.
                                if (typeof doodle.name !== 'string') {
                                    doodle.name = hyphenate(gist.description).toLowerCase()
                                }
                                if (typeof doodle.version !== 'string') {
                                    doodle.version = "0.1.0"
                                }
                            }
                            else {
                                // If both doodle.json and package.json exists then we have a problem.
                                // We try to recover by simply deleting the doodle.json.
                                doodle.deleteFile(LEGACY_META)
                            }
                        }

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
