import * as angular from 'angular';
import FlowService from '../../services/flow/FlowService';
import PropertiesDialog from '../../modules/properties/PropertiesDialog';
import PropertiesFacts from './PropertiesFacts';
import PropertiesSettings from '../../modules/properties/PropertiesSettings';
import IOptionManager from '../../services/options/IOptionManager';
import updateWorkspaceTypings from './updateWorkspaceTypings';
import Workspace from '../../services/workspace/Workspace';
import WsModel from '../../wsmodel/services/WsModel';

export default class PropertiesFlow {
    constructor(
        private workspace: Workspace,
        private owner: string,
        private options: IOptionManager,
        private olds: string[],
        private FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
        private $http: angular.IHttpService,
        private $location: angular.ILocationService,
        private VENDOR_FOLDER_MARKER: string,
        private flowService: FlowService,
        private propertiesDialog: PropertiesDialog,
        private wsModel: WsModel
    ) {
        // Do nothing.
    }
    execute(): void {
        const flow = this.flowService.createFlow<PropertiesFacts>("Properties");
        flow.rule("Settings", {},
            (facts) => {
                return facts.settings.isUndefined();
            },
            (facts, session, next) => {
                const defaults = {
                    name: this.wsModel.name,
                    version: this.wsModel.version,
                    operatorOverloading: this.wsModel.operatorOverloading,
                    dependencies: this.wsModel.dependencies
                };
                this.propertiesDialog.open(defaults)
                    .then((settings: PropertiesSettings) => {
                        facts.settings.resolve(settings);
                        next();
                    })
                    .catch((reason: any) => {
                        facts.settings.reject(reason);
                        next(reason);
                    });
            });

        const facts = new PropertiesFacts();

        const session = flow.createSession(facts);

        session.execute((err: any, facts: PropertiesFacts) => {
            if (!err) {
                this.wsModel.name = facts.settings.value.name;
                this.wsModel.version = facts.settings.value.version;
                this.wsModel.operatorOverloading = facts.settings.value.operatorOverloading;
                this.wsModel.dependencies = facts.settings.value.dependencies;
                // TODO: Break out more rules to remove the nesting.
                updateWorkspaceTypings(
                    this.workspace,
                    this.wsModel,
                    this.options,
                    this.olds,
                    this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS,
                    this.$http,
                    this.$location,
                    this.VENDOR_FOLDER_MARKER, () => {
                        this.workspace.semanticDiagnostics();
                    });
            }
            else {
                switch (err) {
                    case 'cancel click':
                    case 'escape key press': {
                        break;
                    }
                    default: {
                        console.warn(JSON.stringify(err, null, 2));
                    }
                }
            }
        });
    }
}
