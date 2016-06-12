import app from '../app';
import CopyScope from '../scopes/CopyScope';
import IDoodleManager from '../services/doodles/IDoodleManager';
import ITemplate from '../services/templates/ITemplate';
import ITemplateFile from '../services/templates/ITemplateFile';
import WsModel from '../wsmodel/services/WsModel';
import WsFile from '../wsmodel/services/WsFile';

function mapWorkspaceFileToTemplateFile(wsFile: WsFile): ITemplateFile {
    const result: ITemplateFile = {
        content: wsFile.getText(),
        language: wsFile.mode
    };
    return result;
}

function mapDoodleFilesToTemplateFiles(wsModel: WsModel): { [path: string]: ITemplateFile } {
    const result: { [path: string]: ITemplateFile } = {};
    const paths: string[] = wsModel.getFileDocumentPaths();
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const file = wsModel.getFileWeakRef(path);
            result[path] = mapWorkspaceFileToTemplateFile(file);
    }
    return result;
}

app.controller('copy-controller', [
    '$scope',
    '$state',
    'doodles',
    'STATE_DOODLE',
    'wsModel',
    function(
        $scope: CopyScope,
        $state: angular.ui.IStateService,
        doodles: IDoodleManager,
        STATE_DOODLE: string,
        wsModel: WsModel
    ) {

        $scope.description = doodles.suggestName();

        const copySource = wsModel;

        const template: ITemplate = {
            description: copySource.description,
            files: mapDoodleFilesToTemplateFiles(wsModel),
            dependencies: copySource.dependencies,
            operatorOverloading: copySource.operatorOverloading
        };

        $scope.template = template;

        $scope.doOK = function() {

            // FIXME: Instead, we use the template to push a new doodle.
            /*
            wsModel.description = $scope.description;
            wsModel.dependencies = $scope.template.dependencies;
            wsModel.operatorOverloading = $scope.template.operatorOverloading;
            const paths = Object.keys($scope.template.files);
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i];
                const templateFile = $scope.template.files[path];
                const wsFile = wsModel.newFile(path);
                wsFile.setText(templateFile.content);
                wsFile.mode = templateFile.language;
                wsModel.files.putWeakRef(path, wsFile);
            }
            */

            // TODO: Persist the workspace to Local Storage (doodles) in a decoupled way.
            throw new Error("TODO: CopyController.doOK");
            // doodles.createDoodle($scope.template, $scope.description);
            // doodles.updateStorage();
            // TODO: Go back to the DUDE state.
            // $state.go(STATE_DOODLE);
        };

        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };

    }]);
