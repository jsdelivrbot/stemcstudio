import { IHttpService, ILocationService } from 'angular';
import FlowService from '../../services/flow/FlowService';
import PropertiesDialog from '../../modules/properties/PropertiesDialog';
import PropertiesFacts from './PropertiesFacts';
import PropertiesSettings from '../../modules/properties/PropertiesSettings';
import { IOptionManager } from '../../services/options/IOptionManager';
import updateWorkspaceTypings from './updateWorkspaceTypings';
import WsModel from '../../modules/wsmodel/WsModel';
import dependenciesMap from './dependenciesMap';
import dependencyNames from './dependencyNames';

export default class PropertiesFlow {
    constructor(
        private optionManager: IOptionManager,
        private olds: string[],
        private FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
        private $http: IHttpService,
        private $location: ILocationService,
        private VENDOR_FOLDER_MARKER: string,
        private flowService: FlowService,
        private propertiesDialog: PropertiesDialog,
        private wsModel: WsModel
    ) {
        // Do nothing.
    }
    execute(callback: (err: any) => any): void {
        const flow = this.flowService.createFlow<PropertiesFacts>("Properties");

        flow.rule("Settings", {},
            (facts) => {
                return facts.settings.isUndefined();
            },
            (facts, session, next) => {
                const defaults: PropertiesSettings = {
                    name: this.wsModel.name as string,
                    version: this.wsModel.version as string,
                    noLoopCheck: this.wsModel.noLoopCheck,
                    operatorOverloading: this.wsModel.operatorOverloading,
                    dependencies: dependencyNames(this.wsModel.dependencies)
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
                const value = facts.settings.value;
                if (value) {
                    this.wsModel.name = value.name;
                    this.wsModel.version = value.version;
                    this.wsModel.noLoopCheck = value.noLoopCheck;
                    this.wsModel.operatorOverloading = value.operatorOverloading;
                    this.wsModel.dependencies = dependenciesMap(value.dependencies, this.optionManager);
                }
                else {
                    console.warn("Why are settings not defined?");
                }

                updateWorkspaceTypings(
                    this.wsModel,
                    this.optionManager,
                    this.olds,
                    this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS,
                    this.$http,
                    this.$location,
                    this.VENDOR_FOLDER_MARKER, () => {
                        // TODO: 
                        this.wsModel.synchOperatorOverloading()
                            .then(() => {
                                this.wsModel.refreshDiagnostics(function (err) {
                                    callback(err);
                                });
                            })
                            .catch((reason: any) => {
                                console.warn(JSON.stringify(reason, null, 2));
                                callback(reason);
                            });
                    });
            }
            else {
                switch (err) {
                    case 'cancel click':
                    case 'escape key press': {
                        callback(err);
                        break;
                    }
                    default: {
                        console.warn(JSON.stringify(err, null, 2));
                        callback(err);
                    }
                }
            }
        });
    }
}
