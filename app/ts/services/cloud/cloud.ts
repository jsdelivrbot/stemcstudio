import app from '../../app';
import GetGistResponse from '../github/GetGistResponse';
import GitHubService from '../github/GitHubService';
import ICloud from './ICloud';
import IDoodle from '../doodles/IDoodle';
import IDoodleConfig from './IDoodleConfig';

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

            const doodle: IDoodle = {
              gistId: gistId,
              uuid: metaInfo.uuid,
              description: gist.description,
              isCodeVisible: true,
              isViewVisible: false,
              focusEditor: FILENAME_CODE,
              lastKnownJs: {},
              operatorOverloading: metaInfo.operatorOverloading,
              html: gist.files[FILENAME_HTML] ? gist.files[FILENAME_HTML].content : "",
              code: gist.files[FILENAME_CODE] ? gist.files[FILENAME_CODE].content : "",
              libs: gist.files[FILENAME_LIBS] ? gist.files[FILENAME_LIBS].content : "",
              less: gist.files[FILENAME_LESS] ? gist.files[FILENAME_LESS].content : "",
              dependencies: depArray(metaInfo.dependencies)
            };
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
