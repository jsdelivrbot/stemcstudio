import AmazonLoginsService from '../../services/amazonLogins/AmazonLoginsService';
import FlowService from '../../services/flow/FlowService';
import PublishDialog from '../../modules/publish/PublishDialog';
import PublishFacts from './PublishFacts';
import IDoodleManager from '../../services/doodles/IDoodleManager';
import putDoodleRef from './putDoodleRef';

/**
 * @class PublishFlow
 */
export default class PublishFlow {
    constructor(
        // FIXME: Make this a service.
        private owner: string,
        private doodles: IDoodleManager,
        private flowService: FlowService,
        private publishDialog: PublishDialog,
        private amazonLogins: AmazonLoginsService
    ) {
        // Do nothing.
    }
    execute() {

        const doodle = this.doodles.current();
        doodle.owner = this.owner;
        const flow = this.flowService.createFlow<PublishFacts>("Publish");

        flow.rule("Google Sign-In", {},
            (facts) => {
                return facts.id_token.isUndefined();
            },
            (facts, session, next) => {
                const options = new gapi.auth2.SigninOptionsBuilder({
                    scope: 'profile'
                });
                const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
                googleUser.grant(options).then(
                    (success) => {
                        const id_token = googleUser.getAuthResponse().id_token;
                        this.amazonLogins.googleSignIn(id_token);
                        facts.id_token.resolve(id_token);
                        console.log(JSON.stringify({ message: "success", value: success }));
                        next();
                    },
                    (fail: any) => {
                        this.amazonLogins.googleSignIn(void 0);
                        facts.id_token.reject(fail);
                        alert(JSON.stringify({ message: "fail", value: fail }));
                        next(fail);
                    });
            });

        flow.rule("DynamoDB", {},
            (facts) => {
                return facts.id_token.isResolved() && facts.indexed.isUndefined() && facts.owner.isResolved();
            },
            (facts, session, next) => {
                putDoodleRef(doodle, function(err: AWS.Reason) {
                    if (!err) {
                        facts.indexed.resolve(true);
                    }
                    else {
                        facts.indexed.reject(err);
                        console.warn(err);
                    }
                    next(err);
                });
            });

        const facts = new PublishFacts();
        // If we can find an id_token that we can use for the AWS credentials then
        // we can get the rule engine to skip the Sign-In step.
        const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
        facts.owner.resolve(this.owner);
        if (googleUser) {
            const response = googleUser.getAuthResponse();
            if (response) {
                const id_token = googleUser.getAuthResponse().id_token;
                if (id_token) {
                    facts.id_token.resolve(id_token);
                }
            }
            else {
                throw new Error("response");
            }
        }
        else {
            throw new Error("googleUser");
        }

        const session = flow.createSession(facts);

        session.execute((err: any, data: PublishFacts) => {
            if (!err) {
                // console.log(JSON.stringify(data, null, 2));
            }
            else {
                console.warn(JSON.stringify(err, null, 2));
            }
        });
    }
}
