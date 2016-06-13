import * as ng from 'angular';
import app from '../../../app';
import CopyScope from '../../../scopes/CopyScope';
import IDoodleManager from '../../../services/doodles/IDoodleManager';
import ITemplate from '../../../services/templates/ITemplate';
import ITemplateFile from '../../../services/templates/ITemplateFile';
import WsModel from '../../../wsmodel/services/WsModel';
import WsFile from '../../../wsmodel/services/WsFile';
import copyDoodleToDoodle from '../../../mappings/copyDoodleToDoodle';

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

export default class CopyController {
    public static $inject: string[] = [
        '$scope',
        '$state',
        'doodles',
        'STATE_DOODLE'
    ];
    constructor(
        $scope: CopyScope,
        $state: ng.ui.IStateService,
        doodles: IDoodleManager,
        STATE_DOODLE: string
    ) {
        //
        // The user can change the description.
        //
        $scope.description = doodles.current().description;

        //
        // Copy the current doodle into a new doodle.
        //
        $scope.doOK = function() {
            const doodle = doodles.createDoodle();
            copyDoodleToDoodle(doodles.current(), doodle);
            doodle.description = $scope.description;
            doodles.unshift(doodle);
            doodles.updateStorage();
            $state.go(STATE_DOODLE);
        };

        //
        // Go back to whatever is the current project.
        //
        $scope.doCancel = function() {
            $state.go(STATE_DOODLE);
        };
    }
}
