import * as ng from 'angular';
import * as uib from 'angular-bootstrap';
import Base64Service from '../base64/Base64Service';
import BlobKey from '../github/BlobKey';
import CommitData from '../github/CommitData';
import ChooseGistOrRepoOptions from './ChooseGistOrRepoOptions';
import CommitMessageOptions from './CommitMessageOptions';
import CloudService from './CloudService';
import Doodle from '../doodles/Doodle';
import workspaceToGistData from '../cloud/workspaceToGistData';
import FlowService from '../flow/FlowService';
import Gist from '../github/Gist';
import GistData from '../github/GistData';
import GitHubReason from '../github/GitHubReason';
import GitHubService from '../github/GitHubService';
import isString from '../../utils/isString';
import IOptionManager from '../options/IOptionManager';
import gistFilesToDoodleFiles from './gistFilesToDoodleFiles';
import hyphenate from '../../utils/hyphenate';
import PathContents from '../github/PathContents';
import ReferenceUpdateData from '../github/ReferenceUpdateData';
import RepoData from '../github/RepoData';
import RepoKey from '../github/RepoKey';
import RepoDataOptions from './RepoDataOptions';
import RepoElement from '../github/RepoElement';
import TreeData from '../github/TreeData';
import TreeKey from '../github/TreeKey';
import UploadToRepoFacts from './UploadToRepoFacts';
import WsModel from '../../wsmodel/services/WsModel';

const LEGACY_META = 'doodle.json';

export default class GitHubCloudService implements CloudService {
    public static $inject: string[] = [
        '$q',
        '$uibModal',
        'base64',
        'flow',
        'GitHub',
        'FILENAME_META',
        'options'
    ];
    constructor(
        private $q: ng.IQService,
        private $uibModal: uib.IModalService,
        private base64: Base64Service,
        private flow: FlowService,
        private github: GitHubService,
        private FILENAME_META: string,
        private options: IOptionManager) {
        // Do nothing.
    }

    downloadGist(gistId: string, callback: (reason: any, doodle: Doodle) => void) {
        this.github.getGist(gistId)
            .then((http) => {
                const gist = http.data;
                // console.lg(`gist => ${JSON.stringify(gist, null, 2)}`);
                const doodle = new Doodle(this.options);
                doodle.gistId = gistId;
                doodle.description = gist.description;
                doodle.files = gistFilesToDoodleFiles(gist.files, []);

                // Convert the legacy doodle.json file to package.json.
                if (doodle.existsFile(LEGACY_META)) {
                    if (!doodle.existsFile(this.FILENAME_META)) {
                        doodle.renameFile(LEGACY_META, this.FILENAME_META);
                        // Ensure that the package.json file gets the name and version properties.
                        if (typeof doodle.name !== 'string') {
                            doodle.name = hyphenate(gist.description).toLowerCase();
                        }
                        if (typeof doodle.version !== 'string') {
                            doodle.version = "0.1.0";
                        }
                    }
                    else {
                        // If both doodle.json and package.json exists then we have a problem.
                        // We try to recover by simply deleting the doodle.json.
                        doodle.deleteFile(LEGACY_META);
                    }
                }
                callback(undefined, doodle);
            })
            .catch((reason) => {
                callback(reason, void 0);
            });
    }

    /**
     * TODO: This method does not let me specify a commit/branch/tag name but the underlying API does.
     */
    downloadRepo(owner: string, repo: string, callback: (reason: any, doodle: Doodle) => void) {
        this.github.getRepoContents(owner, repo, (err: any, contents: RepoElement[]) => {
            if (!err) {
                const doodle = new Doodle(this.options);
                doodle.owner = owner;
                doodle.repo = repo;
                doodle.gistId = void 0;
                const promises: ng.IPromise<PathContents>[] = [];
                for (let c = 0; c < contents.length; c++) {
                    const element = contents[c];
                    promises.push(this.github.getPathContents(owner, repo, element.path));
                }
                const xs = this.$q.all(promises);
                xs.then((repoFiles: PathContents[]) => {
                    for (let fileIdx = 0; fileIdx < repoFiles.length; fileIdx++) {
                        const repoFile = repoFiles[fileIdx];
                        // TODO: Use the encoding property to select the decoder.
                        // TODO: We're not using the size and type.
                        // The type should be 'file'.
                        // The size should match the decoded length.
                        // The path is probably what we should use for the key to the map.
                        // The encoding will usually be 'base64'.
                        const fileContent = this.base64.decode(repoFile.content);
                        const file = doodle.newFile(repoFile.path);
                        file.content = fileContent;
                        // The sha is needed in order to perform an update?
                    }
                    callback(void 0, doodle);
                    // doodles.unshift(doodle);
                    // doodles.updateStorage();
                    // this.onInitDoodle(doodles.current())
                }).catch((reason) => {
                    callback(new Error(`Error attempting to download File`), void 0);
                });
            }
            else {
                callback(new Error(`Error attempting to download Repo`), void 0);
            }
        });
    }

    /**
     * This method may be used to download a repository.
     * It using the Git Trees API, which has the advantage of supporting an arbitray number of files for a directory.
     * It also naturally deals with different kinds of references.
     * 
     * The implementation challenge will be to do the recursive tree fetch and callback (or promise update).
     */
    downloadTree(owner: string, repo: string, ref: string): ng.IPromise<Doodle> {
        const deferred = this.$q.defer<Doodle>();
        const github = this.github;
        const base64 = this.base64;

        let todoCount = 0;
        let doneCount = 0;
        function state() {
            return { doneCount, todoCount };
        }

        todoCount++;
        deferred.notify(state());
        github.getReference(owner, repo, ref)
            .then((response) => {
                doneCount++;
                // Now seems like a good time to start building the Doodle.
                // If we move this any deeper we may have to deal with commit/branch/tag differences.
                // And as we go deeper we may use (recursion or) a stack to build our tree.
                const doodle = new Doodle(this.options);
                doodle.owner = owner;
                doodle.repo = repo;
                doodle.gistId = void 0;
                const reference = response.data;
                if (reference.object.type === 'commit') {
                    const commitSHA = reference.object.sha;
                    todoCount++;
                    deferred.notify(state());
                    github.getCommit(owner, repo, commitSHA).then((response) => {
                        doneCount++;

                        const commit = response.data;
                        const treeSHA = commit.tree.sha;

                        todoCount++;
                        deferred.notify(state());
                        github.getTree(owner, repo, treeSHA).then((response) => {
                            doneCount++;
                            const tree = response.data;
                            for (let i = 0; i < tree.tree.length; i++) {
                                const child = tree.tree[i];
                                const path = child.path;
                                switch (child.type) {
                                    case 'blob': {
                                        todoCount++;
                                        deferred.notify(state());
                                        github.getBlob(owner, repo, child.sha).then(function(response) {
                                            doneCount++;
                                            const blob = response.data;
                                            switch (blob.encoding) {
                                                case 'base64': {
                                                    const content = base64.decode(blob.content);
                                                    const file = doodle.newFile(child.path);
                                                    file.content = content;
                                                    break;
                                                }
                                                default: {
                                                    deferred.notify(state());
                                                    deferred.reject(`Expecting blob.encoding for '${path}', was ${blob.encoding}.`);
                                                }
                                            }
                                            if (doneCount === todoCount) {
                                                deferred.notify(state());
                                                deferred.resolve(doodle);
                                            }
                                        }).catch(function(reason) {
                                            doneCount++;
                                            deferred.notify(state());
                                            deferred.reject(`Unable to get blob because ${JSON.stringify(reason)}.`);
                                        });
                                        break;
                                    }
                                    default: {
                                        deferred.notify(state());
                                        deferred.reject(`Expecting child '${path}' to be a blob, but was ${child.type}.`);
                                    }
                                }
                            }

                        }).catch(function(reason) {
                            doneCount++;
                            deferred.notify(state());
                            deferred.reject(`Unable to get tree '${treeSHA}' because ${JSON.stringify(reason)}.`);
                        });
                    }).catch(function(reason) {
                        doneCount++;
                        deferred.notify(state());
                        deferred.reject(`Unable to get commit '${commitSHA}' because ${JSON.stringify(reason)}.`);
                    });
                }
                else {
                    deferred.notify(state());
                    deferred.reject(`Expecting reference '${ref}' to be for a commit, but was ${reference.object.type}.`);
                }
            })
            .catch(function(reason) {
                doneCount++;
                deferred.notify(state());
                deferred.reject(`Unable to get reference '${ref}' because ${JSON.stringify(reason)}.`);
            });
        return deferred.promise;
    }

    createGist(workspace: WsModel): ng.IHttpPromise<Gist> {
        const data: GistData = workspaceToGistData(workspace, this.options);
        return this.github.createGist(data);
    }

    updateGist(workspace: WsModel, gistId: string): ng.IHttpPromise<Gist> {
        const data: GistData = workspaceToGistData(workspace, this.options);
        return this.github.updateGist(gistId, data);
    }

    createRepo(data: RepoData): ng.IHttpPromise<RepoKey> {
        return this.github.createRepo(data);
    }

    createBlobsInRepo(workspace: WsModel, owner: string, repo: string, paths: string[]): ng.IHttpPromise<BlobKey>[] {
        const blobs: ng.IHttpPromise<BlobKey>[] = [];
        for (let p = 0; p < paths.length; p++) {
            const path = paths[p];
            const file = workspace.getFileWeakRef(path);
            const content = this.base64.encode(file.getText());
            const encoding = 'base64';
            blobs.push(this.github.createBlob(owner, repo, { content, encoding }));
        }
        return blobs;
    }

    createTreeInRepo(blobs: ng.IHttpPromise<BlobKey>[], paths: string[], treeSHA: string, owner: string, repo: string): ng.IPromise<TreeKey> {
        const deferred = this.$q.defer<TreeKey>();
        const treeData: TreeData = { base_tree: treeSHA, tree: [] };
        this.$q.all(blobs)
            .then((promiseValue) => {
                for (let p = 0; p < paths.length; p++) {
                    const prom = promiseValue[p];
                    const blobSHA = prom.data.sha;
                    treeData.tree.push({
                        path: paths[p],
                        mode: '100644',
                        type: 'blob',
                        sha: blobSHA
                    });
                }
                this.github.createTree(owner, repo, treeData)
                    .then(function(response) {
                        const treeKey = response.data;
                        deferred.resolve(treeKey);
                    })
                    .catch(function(reason: GitHubReason) {
                        deferred.reject(`Unable to create tree because ${reason.data.message}.`);
                    });
            })
            .catch(function(reason: GitHubReason) {
                deferred.reject(`Unable to create blobs because ${reason.data.message}.`);
            });
        return deferred.promise;
    }

    uploadToRepo(workspace: WsModel, owner: string, repo: string, ref: string, commitMessage: string, callback: (reason: any, facts: UploadToRepoFacts) => any): void {
        if (!isString(owner)) {
            throw new TypeError("owner must be a string");
        }
        if (!isString(repo)) {
            throw new TypeError("repo must be a string");
        }
        if (!isString(commitMessage)) {
            throw new TypeError("commitMessage must be a string");
        }

        const flow = this.flow.createFlow<UploadToRepoFacts>('uploadToRepo');

        flow.rule("Get Reference", {},
            (facts) => {
                return facts.refInitial.isUndefined() && facts.refMissing.value !== true;
            },
            (facts, session, next) => {
                this.github.getReference(owner, repo, ref)
                    .then((response) => {

                        facts.status.resolve(response.status);
                        facts.statusText.resolve(response.statusText);
                        facts.refMissing.resolve(false);

                        const reference = response.data;
                        if (reference.object.type === 'commit') {
                            facts.refInitial.resolve(reference);
                            next();
                        }
                        else {
                            const reason = `Expecting reference '${ref}' to be for a commit, but was ${reference.object.type}.`;
                            facts.refInitial.reject(reason);
                            next(reason);
                        }
                    })
                    .catch(function(reason: GitHubReason) {

                        facts.status.resolve(reason.status);
                        facts.statusText.resolve(reason.statusText);

                        switch (reason.status) {
                            case 409: {
                                // GitHub warns that this can happen.
                                // In our case we suspect that the repository is simply empty.
                                // I'm going to use null as the sentinel for there being no reference.
                                facts.refInitial.reject(reason.data.message);
                                facts.refMissing.resolve(true);
                                // But this is not an error.
                                next();
                                break;
                            }
                            default: {
                                console.warn("Getting Reference Failed");
                                console.warn(JSON.stringify(reason, null, 2));
                                facts.refInitial.reject(reason);
                                facts.refMissing.reject(reason);
                                next(reason);
                            }
                        }
                    });
            }
        );

        flow.rule("Get Base Commit", {},
            (facts) => {
                return facts.refInitial.isResolved() && facts.baseCommit.isUndefined();
            },
            (facts, session, next) => {
                const commitSHA = facts.refInitial.value.object.sha;
                this.github.getCommit(owner, repo, commitSHA)
                    .then((response) => {
                        const commit = response.data;
                        facts.baseCommit.resolve(commit);
                        next();
                    })
                    .catch(function(reason) {
                        facts.baseCommit.reject(reason);
                        next(`Unable to get commit '${commitSHA}' because ${JSON.stringify(reason)}.`);
                    });
            }
        );

        flow.rule("Create Tree", {},
            (facts) => {
                // There may not be a base tree, bit we should not allow our tree to be created
                // util the base tree has been established either way.
                if (facts.tree.isUndefined()) {
                    if (facts.refMissing.value === true) {
                        return true;
                    }
                    else {
                        return facts.baseCommit.isDefined();
                    }
                }
                else {
                    return false;
                }
            },
            (facts, session, next) => {
                const paths = workspace.getFileDocumentPaths();
                const blobs = this.createBlobsInRepo(workspace, owner, repo, paths);
                const baseTreeSHA = facts.baseCommit.isResolved() ? facts.baseCommit.value.tree.sha : void 0;
                this.createTreeInRepo(blobs, paths, baseTreeSHA, owner, repo)
                    .then((treeKey) => {
                        facts.tree.resolve(treeKey);
                        next();
                    })
                    .catch((reason: GitHubReason) => {
                        switch (reason.status) {
                            case 409: {
                                break;
                            }
                        }
                        facts.tree.reject(reason);
                        next(`Unable to create tree because ${JSON.stringify(reason)}.`);
                    });
            }
        );

        flow.rule("Create Commit", {},
            (facts) => {
                return facts.tree.isResolved() && facts.commit.isUndefined();
            },
            (facts, session, next) => {
                const commit: CommitData = {
                    message: commitMessage,
                    parents: [facts.baseCommit.value.sha],
                    tree: facts.tree.value.sha
                };

                this.github.createCommit(owner, repo, commit)
                    .then(function(response) {
                        facts.commit.resolve(response.data);
                        next();
                    })
                    .catch(function(reason) {
                        facts.commit.reject(reason);
                        next(`Unable to create commit because ${JSON.stringify(reason)}.`);
                    });
            }
        );

        flow.rule("Update Reference", {},
            (facts) => {
                return facts.commit.isResolved() && facts.refUpdate.isUndefined();
            },
            (facts, session, next) => {
                const data: ReferenceUpdateData = {
                    sha: facts.commit.value.sha,
                    force: false
                };
                this.github.updateReference(owner, repo, ref, data)
                    .then(function(response) {
                        facts.status.resolve(response.status);
                        facts.statusText.resolve(response.statusText);
                        facts.refUpdate.resolve(response.data);
                        next();
                    })
                    .catch(function(reason: GitHubReason) {
                        facts.refUpdate.reject(reason);
                        next(`Unable to update reference ${ref} because ${JSON.stringify(reason)}.`);
                    });
            }
        );

        const facts = new UploadToRepoFacts();

        const session = flow.createSession(facts);

        session.execute((err, facts) => {
            if (!err) {
                callback(void 0, facts);
            }
            else {
                callback(err, void 0);
            }
        });
    }

    /**
     *
     */
    chooseGistOrRepo(title: string): ng.IPromise<string> {
        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: 'ChooseGistOrRepoController',
            templateUrl: 'choose-gist-or-repo-modal.html'
        };

        const message = "Please specify whether you would like a Gist or a Repository.";

        const options: ChooseGistOrRepoOptions = {
            title,
            message,
            cancelButtonText: 'Cancel',
            gistButtonText: 'Gist',
            repoButtonText: 'Repository'
        };

        settings.resolve = {
            options: function() {
                return options;
            }
        };

        // How do we ensure that the result promiseValue is a string?
        // We just have to trust that the controller will do the right thing!
        return this.$uibModal.open(settings).result;
    }

    /**
     *
     */
    repoData(title: string, data: RepoData): ng.IPromise<RepoData> {
        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: 'RepoDataController',
            templateUrl: 'repo-data-modal.html'
        };

        const message = "Please specify how you would like to create the Repository.";

        const options: RepoDataOptions = {
            title,
            message,
            cancelButtonText: 'Cancel',
            actionButtonText: 'Create'
        };

        settings.resolve = {
            options: function() {
                return options;
            },
            data: function() {
                return data;
            }
        };

        return this.$uibModal.open(settings).result;
    }

    /**
     *
     */
    commitMessage(title: string): ng.IPromise<string> {
        const settings: uib.IModalSettings = {
            backdrop: 'static',
            controller: 'CommitMessageController',
            templateUrl: 'commit-message-modal.html'
        };

        const message = "Please enter the commit message for your changes, an empty message aborts the commit.";

        const options: CommitMessageOptions = {
            title,
            message,
            text: '',
            placeholder: '',
            cancelButtonText: 'Cancel',
            actionButtonText: 'Commit changes'
        };

        settings.resolve = {
            options: function() {
                return options;
            }
        };

        // How do we ensure that the result promiseValue is a string?
        // We just have to trust that the controller will do the right thing!
        return this.$uibModal.open(settings).result;
    }
}
