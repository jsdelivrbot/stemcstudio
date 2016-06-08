import * as angular from 'angular';
import FlowService from '../../services/flow/FlowService';
import UploadFacts from './UploadFacts';
import ModalDialog from '../../services/modalService/ModalDialog';
import CloudService from '../../services/cloud/CloudService';
import GitHubReason from '../../services/github/GitHubReason';
import GitHubService from '../../services/github/GitHubService';
import PromptOptions from '../../services/modalService/PromptOptions';
import RepoData from '../../services/github/RepoData';
import isNumber from '../../utils/isNumber';
import Method from './Method';
import WsModel from '../../wsmodel/services/WsModel';

const FEATURE_GIST_ENABLED = true;
const FEATURE_REPO_ENABLED = false;
const STATE_GIST = 'gist';
const STATE_REPO = 'repo';

export default class UploadFlow {
    constructor(
        private owner: string,
        private $state: angular.ui.IStateService,
        private flowService: FlowService,
        private modalDialog: ModalDialog,
        private cloud: CloudService,
        private github: GitHubService,
        private wsModel: WsModel
    ) {
        // Do nothing.
    }
    execute() {
        /**
         * The tile of the flow that will provide context in any dialogs.
         */
        const title = "Upload";

        const flow = this.flowService.createFlow<UploadFacts>(title);

        flow.rule("Commit Message", {},
            (facts) => {
                return facts.canAskForCommitMessage();
            },
            (facts, session, next) => {
                this.cloud.commitMessage(`${title}`).then((commitMessage) => {
                    facts.commitMessage.resolve(commitMessage);
                    next();
                }, (reason) => {
                    facts.commitMessage.reject(reason);
                    next(reason);
                });
            });

        flow.rule("Choose Gist or Repo", {},
            (facts) => {
                return facts.canAskToChooseGistOrRepo();
            },
            (facts, session, next) => {
                this.cloud.chooseGistOrRepo(title).then((storage) => {
                    facts.storage.resolve(storage);
                    next();
                }, (reason) => {
                    facts.storage.reject(reason);
                    next(reason);
                });
            });

        flow.rule("Create Gist", {},
            (facts) => {
                return facts.canCreateGist();
            },
            (facts, session, next) => {
                this.cloud.createGist(this.wsModel)
                    .then((http) => {
                        const status = http.status;
                        facts.status.resolve(status);
                        facts.statusText.resolve(http.statusText);
                        switch (status) {
                            case 201: {
                                const gist = http.data;
                                facts.gistId.resolve(gist.id);
                                facts.uploadedAt.resolve(gist.created_at);
                                facts.redirect.resolve(true);
                                facts.uploadMessage.resolve(`Your project was successfully uploaded and associated with a new Gist.`);

                                this.wsModel.gistId = gist.id;
                                this.wsModel.created_at = gist.created_at;
                                this.wsModel.updated_at = gist.updated_at;

                                this.wsModel.updateStorage();

                                next();
                                break;
                            }
                            default: {
                                const reason = `Unexpected HTTP status (${status})`;
                                facts.uploadedAt.reject(reason);
                                next(reason);
                            }
                        }
                    })
                    .catch((reason) => {
                        facts.uploadedAt.reject(reason);
                        next(reason);
                    });
            });

        flow.rule("Update Gist", {},
            (facts) => {
                return facts.canUpdateGist();
            },
            (facts, session, next) => {
                this.cloud.updateGist(this.wsModel, this.wsModel.gistId)
                    .then((http) => {
                        const status = http.status;
                        const statusText = http.statusText;
                        facts.status.resolve(status);
                        facts.statusText.resolve(statusText);
                        switch (status) {
                            case 200: {
                                const gist = http.data;
                                // console.lg(JSON.stringify(gist, null, 2));
                                facts.uploadedAt.resolve(gist.updated_at);
                                facts.uploadMessage.resolve(`Your project was successfully uploaded and patched the existing Gist.`);
                                this.wsModel.emptyTrash();
                                this.wsModel.updated_at = gist.updated_at;
                                this.wsModel.updateStorage();
                                next();
                                break;
                            }
                            case 404: {
                                // The Gist no longer exists on GitHub
                                // TODO: Test this we may end up down in the catch.
                                this.wsModel.gistId = void 0;
                                facts.gistId.reset();
                                this.wsModel.updateStorage();
                                next();
                                break;
                            }
                            default: {
                                const reason = `Unexpected HTTP status (${status})`;
                                facts.uploadedAt.reject(reason);
                                next(reason);
                            }
                        }
                    })
                    .catch((reason: GitHubReason) => {
                        switch (reason.status) {
                            case 404: {
                                // The Gist no longer exists on GitHub.
                                // More likely the  case that the user does not have authority to update someone else's Gist. 
                                facts.gistExists.resolve(false);
                                facts.uploadedAt.reject(reason.statusText);
                                next(reason.statusText);
                                break;
                            }
                            default: {
                                facts.uploadedAt.reject(reason.statusText);
                                next(reason.statusText);
                            }
                        }
                    });
            });

        flow.rule("Prompt for repository name", {},
            (facts) => {
                return facts.canAskForRepoName();
            },
            (facts, session, next) => {
                const message = "Please enter the name of the repository that you would like to upload to.";
                const options: PromptOptions = { title, message, text: '', placeholder: 'my-repository' };
                this.modalDialog.prompt(options)
                    .then((repo) => {
                        facts.repo.resolve(repo);
                        next();
                    })
                    .catch((reason) => {
                        next(reason);
                    });
            });

        flow.rule("Determine whether repository exists", {},
            (facts) => {
                return facts.canDetermineRepoExists();
            },
            (facts, session, next) => {
                this.github.getRepo(facts.userLogin.value, facts.repo.value)
                    .then((http) => {
                        const status = http.status;
                        facts.status.resolve(status);
                        facts.statusText.resolve(http.statusText);
                        switch (status) {
                            case 404: {
                                facts.repoExists.resolve(false);
                                next();
                                break;
                            }
                            case 200: {
                                facts.repoExists.resolve(true);
                                const repo = http.data;
                                facts.repoId.resolve(repo.id);
                                next();
                                break;
                            }
                            default: {
                                const reason = `Unexpected HTTP status (${status})`;
                                facts.uploadedAt.reject(reason);
                                next(reason);
                            }
                        }
                    })
                    .catch((reason) => {
                        if (isNumber(reason.status)) {
                            const status: number = reason.status;
                            switch (status) {
                                case 404: {
                                    facts.repoExists.resolve(false);
                                    next();
                                    break;
                                }
                                default: {
                                    const reason = `Unexpected HTTP status (${status})`;
                                    facts.uploadedAt.reject(reason);
                                    next(reason);
                                }
                            }
                        }
                        else {
                            facts.repoExists.reject(reason);
                            next(reason);
                        }
                    });
            });

        flow.rule("Prompt for repository data", {},
            (facts) => {
                return facts.canAskForRepoData();
            },
            (facts, session, next) => {
                const defaults: RepoData = { name: '' };
                defaults.auto_init = true;
                this.cloud.repoData(title, defaults)
                    .then((repoData) => {
                        facts.repoData.resolve(repoData);
                        next();
                    })
                    .catch((reason) => {
                        facts.repoData.reject(reason);
                        next(reason);
                    });
            });

        flow.rule("Create Repo", {},
            (facts) => {
                return facts.canCreateRepo();
            },
            (facts, session, next) => {
                this.cloud.createRepo(facts.repoData.value)
                    .then((http) => {
                        const status = http.status;
                        facts.status.resolve(status);
                        facts.statusText.resolve(http.statusText);
                        const repository = http.data;
                        facts.repoId.resolve(repository.id);
                        facts.repo.resolve(repository.name);
                        facts.repoExists.resolve(true);
                        facts.owner.resolve(repository.owner.login);
                        facts.ref.resolve('heads/master');
                        next();
                    })
                    .catch((reason: GitHubReason) => {
                        facts.status.resolve(reason.status);
                        facts.statusText.resolve(reason.statusText);
                        switch (reason.status) {
                            case 422: {
                                // It already exists. We didn't learn anything about the repository
                                // other than that it exists.
                                facts.repoExists.resolve(true);
                                // FIXME: There's some duplication here in the repo name.
                                facts.repo.resolve(facts.repoData.value.name);
                                // Change our strategy to perform an update.
                                facts.method.resolve(Method.Update);
                                facts.owner.resolve(facts.userLogin.value);
                                facts.ref.resolve('heads/master');
                                next();
                                break;
                            }
                            default: {
                                next(reason);
                            }
                        }
                    });
            });

        flow.rule("Upload to Repo", {},
            (facts) => {
                return facts.canUploadToRepo();
            },
            (facts, session, next) => {
                const owner = facts.owner.value;
                const repo = facts.repo.value;
                const ref = facts.ref.value;
                const commitMessage = facts.commitMessage.value;
                this.cloud.uploadToRepo(this.wsModel, owner, repo, ref, commitMessage, (err, details) => {
                    if (!err) {
                        if (details.refUpdate.isResolved()) {
                            this.wsModel.owner = owner;
                            this.wsModel.repo = repo;
                            // doodle.ref = ref;
                            facts.uploadMessage.resolve("Your project was successfully uploaded to GitHub.");
                        }
                        else {
                            facts.uploadMessage.resolve("Your project didn't make it to GitHub!");
                        }
                    }
                    else {
                        facts.uploadMessage.reject(err);
                    }
                    next(err);
                });
            });

        flow.rule("Update Index", {},
            (facts) => {
                // console.lg(JSON.stringify(facts, null, 2));
                return false;
            },
            (facts, session, next) => {
                // Do nothing yet.
            });

        const facts = new UploadFacts();

        facts.gistId.resolve(this.wsModel.gistId);
        facts.repo.resolve(this.wsModel.repo);
        facts.owner.resolve(this.wsModel.owner);
        facts.userLogin.resolve(this.owner);
        if (FEATURE_GIST_ENABLED) {
            if (FEATURE_REPO_ENABLED) {
                if (facts.gistId.isResolved()) {
                    facts.storage.resolve('gist');
                }
                if (facts.repo.isResolved()) {
                    facts.storage.resolve('repo');
                    facts.ref.resolve('heads/master');
                    facts.repoExists.resolve(true);
                }
            }
            else {
                facts.storage.resolve('gist');
            }
        }
        else {
            if (FEATURE_REPO_ENABLED) {
                facts.storage.resolve('repo');
                facts.ref.resolve('heads/master');
            }
            else {
                // Do nothing.
            }
        }
        if (facts.gistId.isUndefined() && facts.repo.isUndefined()) {
            facts.method.resolve(Method.Create);
        }
        else {
            facts.method.resolve(Method.Update);
        }

        const session = flow.createSession(facts);
        session.execute((reason: any, facts: UploadFacts) => {
            if (reason) {
                this.modalDialog.alert({ title, message: `The upload was aborted because of ${JSON.stringify(reason, null, 2)}.` });
            }
            else {
                if (facts.uploadMessage.isResolved()) {
                    this.modalDialog.alert({ title, message: facts.uploadMessage.value });
                    if (facts.redirect.isResolved()) {
                        if (facts.gistId.isResolved()) {
                            this.$state.go(STATE_GIST, { gistId: this.wsModel.gistId });
                        }
                        else if (facts.owner.isResolved() && facts.repo.isResolved()) {
                            this.$state.go(STATE_REPO, { owner: this.wsModel.owner, repo: this.wsModel.repo });
                        }
                        else {
                            // FIXME: redirect should contain it's own instructions.
                        }
                    }
                }
                else {
                    this.modalDialog.alert({ title, message: `Apologies, the upload was not completed because of a system error.` });
                }
            }
        });
    };
}
