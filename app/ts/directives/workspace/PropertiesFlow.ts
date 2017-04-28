import { IHttpService, ILocationService } from 'angular';
import FlowService from '../../services/flow/FlowService';
import PropertiesDialog from '../../modules/properties/PropertiesDialog';
import PropertiesFacts from './PropertiesFacts';
import PropertiesSettings from '../../modules/properties/PropertiesSettings';
import { IOptionManager } from '../../services/options/IOptionManager';
import { updateWorkspaceTypes } from './updateWorkspaceTypes';
import WsModel from '../../modules/wsmodel/WsModel';
import { AmbientResolutions, ModuleResolutions } from '../../modules/wsmodel/WsModel';
import dependenciesMap from './dependenciesMap';
import dependencyNames from './dependencyNames';

/**
 * 
 */
export default class PropertiesFlow {
    constructor(
        private optionManager: IOptionManager,
        private ambients: AmbientResolutions,
        private modulars: ModuleResolutions,
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
                    linting: this.wsModel.linting,
                    noLoopCheck: this.wsModel.noLoopCheck,
                    operatorOverloading: this.wsModel.isOperatorOverloadingEnabled(),
                    dependencies: dependencyNames(this.wsModel.getPackageDependencies())
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
                    this.wsModel.linting = value.linting;
                    this.wsModel.noLoopCheck = value.noLoopCheck;
                    this.wsModel.setOperatorOverloading(value.operatorOverloading);
                    this.wsModel.setPackageDependencies(dependenciesMap(value.dependencies, this.optionManager));
                }
                else {
                    console.warn("Why are settings not defined?");
                }

                //
                // TODO: Is this really required now that we have events when the model changes?
                //
                updateWorkspaceTypes(
                    this.wsModel,
                    this.optionManager,
                    this.ambients,
                    this.modulars,
                    this.FILENAME_TYPESCRIPT_CURRENT_LIB_DTS,
                    this.$http,
                    this.$location,
                    this.VENDOR_FOLDER_MARKER, () => {
                        const promises: Promise<any>[] = [];
                        promises.push(this.wsModel.synchOperatorOverloading());
                        const tsconfig = this.wsModel.tsconfigSettings;
                        if (tsconfig) {
                            promises.push(this.wsModel.synchTsConfig(tsconfig));
                        }
                        else {
                            console.warn("tsconfig will not be used");
                        }
                        Promise.all(promises)
                            .then(() => {
                                this.wsModel.refreshDiagnostics()
                                    .then(function () {
                                        callback(void 0);
                                    })
                                    .catch(function (err) {
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
