import FlowService from '../../services/flow/FlowService';
import { LabelDialog } from '../../modules/labelsAndTags/LabelDialog';
import LabelFacts from './LabelFacts';
import { LabelSettings } from '../../modules/labelsAndTags/LabelSettings';
import { WsModel } from '../../modules/wsmodel/WsModel';

export default class LabelFlow {
    constructor(
        private flowService: FlowService,
        private labelDialog: LabelDialog,
        private wsModel: WsModel
    ) {
        // Do nothing.
    }
    execute(): void {
        const flow = this.flowService.createFlow<LabelFacts>("Label");
        flow.rule("Settings", {},
            (facts) => {
                return facts.settings.isUndefined();
            },
            (facts, session, next) => {
                const defaults: LabelSettings = {
                    title: this.wsModel.description as string,
                    author: this.wsModel.author as string,
                    keywords: this.wsModel.keywords
                };
                this.labelDialog.open(defaults)
                    .then((settings: LabelSettings) => {
                        facts.settings.resolve(settings);
                        next();
                    })
                    .catch((reason: any) => {
                        facts.settings.reject(reason);
                        next(reason);
                    });
            });

        const facts = new LabelFacts();

        const session = flow.createSession(facts);

        session.execute((err: any, facts: LabelFacts) => {
            if (!err) {
                const settings = facts.settings.value;
                if (settings) {
                    this.wsModel.description = settings.title;
                    this.wsModel.author = settings.author;
                    this.wsModel.keywords = settings.keywords;
                }
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
