import { FlowService } from '../../services/flow/FlowService';
import { UploadFacts } from './UploadFacts';
import { ModalDialog } from '../../services/modalService/ModalDialog';
import { INavigationService } from '../../modules/navigation/INavigationService';
import { ICloudService } from '../../services/cloud/ICloudService';
import { GitHubReason } from '../../services/github/GitHubReason';
import { IGitHubRepoService } from '../../services/github/IGitHubRepoService';
import { PromptOptions } from '../../services/modalService/PromptOptions';
import { RepoData } from '../../services/github/RepoData';
import { isNumber } from '../../utils/isNumber';
import { Method } from './Method';
import { WsModel } from '../../modules/wsmodel/WsModel';

const FEATURE_GIST_ENABLED = true;
const FEATURE_REPO_ENABLED = false;

/**
 * TODO: Avoid asymmetry in use of cloud service versus GitHub Repo service.
 */
export class UploadFlow {
    constructor(
        private owner: string | null | undefined,
        private flowService: FlowService,
        private modalDialog: ModalDialog,
        private navigation: INavigationService,
        private cloudService: ICloudService,
        private githubRepoService: IGitHubRepoService,
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
                this.cloudService.commitMessage(`${title}`).then((commitMessage) => {
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
                this.cloudService.chooseGistOrRepo(title).then((storage) => {
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
                this.cloudService.createGist(this.wsModel)
                    .then((gist) => {
                        facts.gistId.resolve(gist.id);
                        facts.uploadedAt.resolve(gist.created_at);
                        facts.redirect.resolve(true);
                        facts.uploadMessage.resolve(`Your project was successfully uploaded and associated with a new Gist.`);

                        this.wsModel.gistId = gist.id;
                        this.wsModel.created_at = gist.created_at;
                        this.wsModel.updated_at = gist.updated_at;
                        this.wsModel.updateStorage();
                        next();
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
                this.cloudService.updateGist(this.wsModel, this.wsModel.gistId as string)
                    .then((gist) => {
                        facts.uploadedAt.resolve(gist.updated_at);
                        facts.uploadMessage.resolve(`Your project was successfully uploaded and patched the existing Gist.`);
                        try {
                            this.wsModel.markAllFilesAsInGitHub();
                            this.wsModel.emptyTrash();
                            this.wsModel.updated_at = gist.updated_at;
                            this.wsModel.updateStorage();
                            next();
                        }
                        catch (reason) {
                            console.warn(`reason => ${JSON.stringify(reason, null, 2)}`);
                            next(reason);
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
                this.githubRepoService.getRepo(facts.userLogin.value as string, facts.repo.value as string)
                    .then((repo) => {
                        facts.repoExists.resolve(true);
                        facts.repoId.resolve(repo.id);
                        next();
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
                this.cloudService.repoData(title, defaults)
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
                this.cloudService.createRepo(facts.repoData.value as RepoData)
                    .then((repository) => {
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
                                const repoData = facts.repoData.value as RepoData;
                                facts.repo.resolve(repoData.name);
                                // Change our strategy to perform an update.
                                facts.method.resolve(Method.Update);
                                facts.owner.resolve(facts.userLogin.value as string);
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
                const owner = facts.owner.value as string;
                const repo = facts.repo.value as string;
                const ref = facts.ref.value as string;
                const commitMessage = facts.commitMessage.value as string;
                this.cloudService.uploadToRepo(this.wsModel, owner, repo, ref, commitMessage, (err, details) => {
                    if (!err) {
                        if (details && details.refUpdate.isResolved()) {
                            this.wsModel.owner = owner;
                            this.wsModel.repo = repo;
                            this.wsModel.updateStorage();
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
                return false;
            },
            (facts, session, next) => {
                // Do nothing yet.
            });

        const facts = new UploadFacts();

        facts.gistId.resolve(this.wsModel.gistId as string);
        facts.repo.resolve(this.wsModel.repo as string);
        facts.owner.resolve(this.wsModel.owner as string);
        facts.userLogin.resolve(this.owner as string);
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
                    this.modalDialog.alert({ title, message: facts.uploadMessage.value as string });
                    if (facts.redirect.isResolved()) {
                        if (facts.gistId.isResolved()) {
                            this.navigation.gotoGist(this.wsModel.gistId as string);
                        }
                        else if (facts.owner.isResolved() && facts.repo.isResolved()) {
                            this.navigation.gotoRepo(this.wsModel.owner as string, this.wsModel.repo as string);
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
    }
}
