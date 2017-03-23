import FlowService from '../../services/flow/FlowService';
import LabelDialog from '../../modules/publish/LabelDialog';
import LabelFacts from './LabelFacts';
import LabelSettings from '../../modules/publish/LabelSettings';
import WsModel from '../../modules/wsmodel/services/WsModel';

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
                const defaults: LabelSettings = { title: this.wsModel.description, author: this.wsModel.author, keywords: this.wsModel.keywords };
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
                this.wsModel.description = facts.settings.value.title;
                this.wsModel.author = facts.settings.value.author;
                this.wsModel.keywords = facts.settings.value.keywords;
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
