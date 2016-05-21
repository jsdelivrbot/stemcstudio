import * as angular from 'angular';
import FlowService from '../../services/flow/FlowService';
import PropertiesDialog from '../../modules/properties/PropertiesDialog';
import PropertiesFacts from './PropertiesFacts';
import PropertiesSettings from '../../modules/properties/PropertiesSettings';
import IDoodleManager from '../../services/doodles/IDoodleManager';
import IOptionManager from '../../services/options/IOptionManager';
import updateWorkspaceTypings from './updateWorkspaceTypings';
import Workspace from '../../services/workspace/Workspace';

export default class PropertiesFlow {
    constructor(
        private workspace: Workspace,
        private owner: string,
        private doodles: IDoodleManager,
        private options: IOptionManager,
        private olds: string[],
        private FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
        private $http: angular.IHttpService,
        private $location: angular.ILocationService,
        private VENDOR_FOLDER_MARKER: string,
        private flowService: FlowService,
        private propertiesDialog: PropertiesDialog
    ) {
        // Do nothing.
    }
    execute(): void {
        const doodle = this.doodles.current();
        const flow = this.flowService.createFlow<PropertiesFacts>("Properties");
        flow.rule("Settings", {},
            (facts) => {
                return facts.settings.isUndefined();
            },
            (facts, session, next) => {
                const defaults = {
                    name: doodle.name,
                    version: doodle.version,
                    operatorOverloading: doodle.operatorOverloading,
                    dependencies: doodle.dependencies
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
                doodle.name = facts.settings.value.name;
                doodle.version = facts.settings.value.version;
                doodle.operatorOverloading = facts.settings.value.operatorOverloading;
                doodle.dependencies = facts.settings.value.dependencies;
                // TODO: Break out more rules to remove the nesting.
                updateWorkspaceTypings(
                    this.workspace,
                    doodle,
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
