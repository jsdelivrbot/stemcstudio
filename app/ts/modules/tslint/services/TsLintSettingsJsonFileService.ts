import TsLintSettingsService from '../TsLintSettingsService';
import { WORKSPACE_MODEL } from '../../../wsmodel/constants';
import IWorkspaceModel from '../../../wsmodel/IWorkspaceModel';

export class TsLintSettingsJsonFileService implements TsLintSettingsService {
    public static $inject: string[] = [
        WORKSPACE_MODEL
    ];
    constructor(wsModel: IWorkspaceModel) {
        // Do nothing yet.
        console.log("TsLintSettingService.constructor()");
    }
}

export default TsLintSettingsJsonFileService;
