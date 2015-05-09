/// <reference path="../../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../services/doodles/doodles.ts" />
module mathdoodle {
  /**
   * This is the structure of the JSON file that is sent to GitHub.
   */
  export interface IDoodleConfig {
    uuid: string;
    description?: string;
    dependencies: {[key:string]:string};
  }
  export interface ICloud {
    downloadGist(token: string, gistId: string, callback: (err, doodle?: IDoodle) => void);
  }
}
angular.module('app').factory('cloud',[
  'GitHub',
  'FILENAME_META',
  'FILENAME_HTML',
  'FILENAME_CODE',
  'FILENAME_LESS',
  function(
    github,
    FILENAME_META,
    FILENAME_HTML,
    FILENAME_CODE,
    FILENAME_LESS
  ): mathdoodle.ICloud {

  // Temporary to ensure correct Gist deserialization.
  function depArray(deps: {[key:string]:string}): string[] {
    var ds: string[] = [];
    for (var prop in deps) {
      ds.push(prop);
    }
    return ds;
  }

  var cloud: mathdoodle.ICloud = {
    downloadGist: function(token: string, gistId: string, callback: (err, doodle?: mathdoodle.IDoodle) => void) {
      github.getGist(token, gistId, function(err, gist) {
        if (!err) {
          var metaInfo: mathdoodle.IDoodleConfig = JSON.parse(gist.files[FILENAME_META].content);

          var doodle: mathdoodle.IDoodle = {
            gistId: gistId,
            uuid: metaInfo.uuid,
            description: gist.description,
            isCodeVisible: true,
            isViewVisible: false,
            focusEditor: FILENAME_CODE,
            lastKnownJs: undefined,
            html: gist.files[FILENAME_HTML] ? gist.files[FILENAME_HTML].content : "",
            code: gist.files[FILENAME_CODE] ? gist.files[FILENAME_CODE].content : "",
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