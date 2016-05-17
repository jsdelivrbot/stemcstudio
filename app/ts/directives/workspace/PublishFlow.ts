import FlowService from '../../services/flow/FlowService';
import PublishDialog from '../../modules/publish/PublishDialog';
import PublishFacts from './PublishFacts';
import PublishSettings from '../../modules/publish/PublishSettings';
import IDoodleManager from '../../services/doodles/IDoodleManager';

/**
 * @class PublishFlow
 */
export default class PublishFlow {
    constructor(
        // FIXME: Make this a service.
        private owner: string,
        private doodles: IDoodleManager,
        private flowService: FlowService,
        private publishDialog: PublishDialog
    ) {
        // Do nothing.
    }
    execute() {

        const doodle = this.doodles.current();
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
                    function(success) {
                        const id_token = googleUser.getAuthResponse().id_token;
                        facts.id_token.resolve(id_token);
                        console.log(JSON.stringify({ message: "success", value: success }));
                        next();
                    },
                    function(fail) {
                        facts.id_token.reject(fail);
                        alert(JSON.stringify({ message: "fail", value: fail }));
                        next(fail);
                    });
            });

        flow.rule("Settings", {},
            (facts) => {
                return facts.settings.isUndefined();
            },
            (facts, session, next) => {
                this.publishDialog.open()
                    .then((settings: PublishSettings) => {
                        facts.settings.resolve(settings);
                        next();
                    })
                    .catch((reason: any) => {
                        facts.settings.reject(reason);
                        next(reason);
                    });
            });

        flow.rule("DynamoDB", {},
            (facts) => {
                return facts.id_token.isResolved() && facts.indexed.isUndefined() && facts.owner.isResolved();
            },
            (facts, session, next) => {
                AWS.config.region = 'us-east-1';
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:b419a8b6-2753-4af4-a76b-41a451eb2278',
                    Logins: {
                        'accounts.google.com': facts.id_token.value
                    }
                });
                const db = new AWS.DynamoDB();
                db.putItem(
                    {
                        TableName: 'Doodle',
                        Item: {
                            'owner': { S: facts.owner.value },
                            'resource': { S: doodle.gistId },
                            'type': { S: 'Gist' },
                            'description': { S: doodle.description }
                        }
                    },
                    function(err, data) {
                        if (!err) {
                            facts.indexed.resolve(true);
                        }
                        else {
                            facts.indexed.reject(err);
                            console.warn(err, err.stack);
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
