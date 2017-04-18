import TsLintSettingsService from '../TsLintSettingsService';
import { WORKSPACE_MODEL_UUID } from '../../wsmodel/IWorkspaceModel';
import IWorkspaceModel from '../../wsmodel/IWorkspaceModel';

export class TsLintSettingsJsonFileService implements TsLintSettingsService {
    public static $inject: string[] = [
        WORKSPACE_MODEL_UUID
    ];
    constructor(wsModel: IWorkspaceModel) {
        // Do nothing yet.
    }
}

export default TsLintSettingsJsonFileService;
