import FlowService from '../../services/flow/FlowService';
import LabelDialog from '../../modules/publish/LabelDialog';
import LabelFacts from './LabelFacts';
import LabelSettings from '../../modules/publish/LabelSettings';
import IDoodleManager from '../../services/doodles/IDoodleManager';

export default class LabelFlow {
    constructor(
        private owner: string,
        private doodles: IDoodleManager,
        private flowService: FlowService,
        private labelDialog: LabelDialog
    ) {
        // Do nothing.
    }
    execute(): void {
        const doodle = this.doodles.current();
        const flow = this.flowService.createFlow<LabelFacts>("Label");
        flow.rule("Settings", {},
            (facts) => {
                return facts.settings.isUndefined();
            },
            (facts, session, next) => {
                const defaults = { title: doodle.description, author: doodle.author, keywords: doodle.keywords };
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
                doodle.description = facts.settings.value.title;
                doodle.author = facts.settings.value.author;
                doodle.keywords = facts.settings.value.keywords;
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
