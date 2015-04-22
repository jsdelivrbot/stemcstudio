/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/deuce/deuce.d.ts" />
var app = angular.module('app');

app.controller('EditorController', ['$scope', '$http', '$location' , function($scope, $http, $location) {

    var DOMAIN = $location.protocol() + "://" + $location.host() + ":" + $location.port();

    ace.config.set('workerPath', '/js')

    var workspace = ace.workspace();

    var fileNames = ['lib.d.ts'];

    var readFile = function(fileName, callback) {
        var url = DOMAIN + "/ts/" + fileName;
        $http.get(url)
        .success(function(data, status, headers, config) {
            callback(null, data)
        })
        .error(function(data, status, headers, config) {
            callback(new Error("Unable to wrangle #{fileName}."));
        })
    }


    var editor = ace.edit('editor', workspace);

    editor.setTheme('ace/theme/textmate');
    editor.getSession().setMode('ace/mode/typescript');
    editor.getSession().setTabSize(2);
    editor.setShowInvisibles(true);
    editor.setFontSize('18px');
    editor.setShowPrintMargin(false);
    editor.setDisplayIndentGuides(false);

    fileNames.forEach(function(fileName) {
        readFile(fileName, function(err, content) {
            if (!err) {
                if (workspace) {
                    workspace.ensureScript(fileName, content.replace(/\r\n?/g, '\n'), true);
                }
                else {
                    console.log("#{err}");
                }
            }
        });
    });
    editor.getSession().on('initAfter', function(event) { console.log("Received initAfter event"); });
    editor.getSession().on('syntaxErrors', function(event) { console.log("Received syntaxErrors event"); });
    editor.getSession().on('change', function(event) { console.log("Received change event"); });
    editor.getSession().on('outputFiles', function(event) { console.log("Received outputFiles event"); });

    // We must supply a (dummy) fileName for the editor in order for the TypeScript processing to work.
    editor.changeFile('', 'whatever.ts');

}]);