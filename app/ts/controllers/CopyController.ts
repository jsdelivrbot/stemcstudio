import app from '../app';
import CopyScope from '../scopes/CopyScope';
import DoodleFile from '../services/doodles/DoodleFile';
import IDoodleManager from '../services/doodles/IDoodleManager';
import ITemplate from '../services/templates/ITemplate';
import ITemplateFile from '../services/templates/ITemplateFile';

function mapDoodleFileToTemplateFile(doodleFile: DoodleFile): ITemplateFile {
    const result: ITemplateFile = {
        content: doodleFile.document.getValue(),
        language: doodleFile.language
    };
    return result;
}

function mapDoodleFilesToTemplateFiles(doodleFiles: { [path: string]: DoodleFile }): { [path: string]: ITemplateFile } {
    const result: { [path: string]: ITemplateFile } = {};
    const paths = Object.keys(doodleFiles);
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        result[path] = mapDoodleFileToTemplateFile(doodleFiles[path]);
    }
    return result;
}

app.controller('copy-controller', [
    '$scope',
    '$state',
    'doodles',
    'STATE_DOODLE',
    function(
        $scope: CopyScope,
        $state: angular.ui.IStateService,
        doodles: IDoodleManager,
        STATE_DOODLE: string
    ) {

        $scope.description = doodles.suggestName();

        const copySource = doodles.current();

        const template: ITemplate = {
            description: copySource.description,
            files: mapDoodleFilesToTemplateFiles(copySource.files),
            dependencies: copySource.dependencies,
            operatorOverloading: copySource.operatorOverloading
        };

        $scope.template = template;

        $scope.doOK = function() {
            doodles.createDoodle($scope.template, $scope.description);
            doodles.updateStorage();
            $state.go(STATE_DOODLE);
        };

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };

    }]);
