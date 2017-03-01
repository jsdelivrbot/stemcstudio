import CredentialsService from '../../services/credentials/CredentialsService';
import FlowService from '../../services/flow/FlowService';
import PublishFacts from './PublishFacts';
import ModalDialog from '../../services/modalService/ModalDialog';
import StemcArXiv from '../../stemcArXiv/StemcArXiv';
import SubmitParams from '../../stemcArXiv/SubmitParams';
import WsModel from '../../wsmodel/services/WsModel';

/**
 *
 */
export default class PublishFlow {
    constructor(
        // FIXME: Make this a service.
        private owner: string | null | undefined,
        private flowService: FlowService,
        private modalDialog: ModalDialog,
        private credentialsService: CredentialsService,
        private stemcArXiv: StemcArXiv,
        private wsModel: WsModel
    ) {
        // Do nothing.
    }
    execute() {
        /**
         * The tile of the flow that will provide context in any dialogs.
         */
        const title = "Publish";

        this.wsModel.owner = this.owner;
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
                        this.credentialsService.googleSignIn(id_token);
                        facts.id_token.resolve(id_token);
                        next();
                    },
                    (fail: any) => {
                        this.credentialsService.googleSignIn(void 0);
                        facts.id_token.reject(fail);
                        alert(JSON.stringify({ message: "fail", value: fail }));
                        next(fail);
                    });
            });

        flow.rule("Submit to STEMCarXiv", {},
            (facts) => {
                return facts.id_token.isResolved() && facts.indexed.isUndefined() && facts.owner.isResolved();
            },
            (facts, session, next) => {
                const params: SubmitParams = {
                    owner: this.wsModel.owner,
                    gistId: this.wsModel.gistId,
                    repo: this.wsModel.repo,
                    title: this.wsModel.description,
                    author: this.wsModel.author,
                    keywords: this.wsModel.keywords,
                    credentials: this.credentialsService.credentials
                };
                this.stemcArXiv.submit(params).then((response) => {
                    facts.indexed.resolve(true);
                    facts.completionMessage.resolve("Your project was successfully received for publishing! Please allow 10 minutes for it to be searchable.");
                    next();
                }).catch((err) => {
                    facts.completionMessage.resolve("We're sorry, your project cannot be accepted at this time. Please try again later.");
                    facts.indexed.reject(err);
                    console.warn(err);
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

        session.execute((err: { data: AWS.Reason }, data: PublishFacts) => {
            if (!err) {
                if (facts.completionMessage.isResolved()) {
                    this.modalDialog.alert({ title, message: facts.completionMessage.value });
                }
                else {
                    this.modalDialog.alert({ title, message: `Apologies, the publish was not completed because of a system error.` });
                    console.warn(JSON.stringify(err, null, 2));
                }
            }
            else {
                const reason = err.data;
                switch (reason.statusCode) {
                    case 400: {
                        if (!this.wsModel.gistId) {
                            // TODO: Detect documents not in GitHub before allowing submissions.
                            this.modalDialog.alert({ title, message: `Please upload your document to GitHub before submitting it for publishing.` });
                        }
                        else {
                            console.warn(JSON.stringify(err, null, 2));
                            this.modalDialog.alert({ title, message: `The publish was aborted because of ${JSON.stringify(reason.message, null, 2)}.` });
                        }
                        break;
                    }
                    default: {
                        console.warn(JSON.stringify(err, null, 2));
                        this.modalDialog.alert({ title, message: `The publish was aborted because of ${JSON.stringify(reason.message, null, 2)}.` });
                    }
                }
            }
        });
    }
}
