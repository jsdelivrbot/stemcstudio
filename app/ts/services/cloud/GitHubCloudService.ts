import * as ng from 'angular';
import Base64Service from '../base64/Base64Service';
import BlobKey from '../github/BlobKey';
import CommitArg from '../github/CommitArg';
import CloudService from './CloudService';
import Doodle from '../doodles/Doodle';
import doodleToGist from '../cloud/doodleToGist';
import Gist from '../github/Gist';
import GistData from '../gist/GistData';
import GitHubService from '../github/GitHubService';
import IOptionManager from '../options/IOptionManager';
import gistFilesToDoodleFiles from './gistFilesToDoodleFiles';
import hyphenate from '../../utils/hyphenate';
import PathContents from '../github/PathContents';
import PatchGistResponse from '../github/PatchGistResponse';
import PostGistResponse from '../github/PostGistResponse';
import ReferenceData from '../github/ReferenceData';
import RepoElement from '../github/RepoElement';
import TreeArg from '../github/TreeArg';

const LEGACY_META = 'doodle.json';

export default class GitHubCloudService implements CloudService {
    public static $inject: string[] = [
        '$q',
        'base64',
        'GitHub',
        'FILENAME_META',
        'options'
    ];
    constructor(
        private $q: ng.IQService,
        private base64: Base64Service,
        private github: GitHubService,
        private FILENAME_META: string,
        private options: IOptionManager) {
        // Do nothing.
    }

    downloadGist(gistId: string, callback: (reason: any, doodle: Doodle) => void) {
        // TODO: Upgrade GitHub API to propagate IHttpPromise
        this.github.getGist(gistId, (err: any, gist: Gist) => {
            if (!err) {
                const doodle = new Doodle(this.options)
                doodle.gistId = gistId
                doodle.description = gist.description
                doodle.files = gistFilesToDoodleFiles(gist.files, [])

                // Convert the legacy doodle.json file to package.json.
                if (doodle.existsFile(LEGACY_META)) {
                    if (!doodle.existsFile(this.FILENAME_META)) {
                        doodle.renameFile(LEGACY_META, this.FILENAME_META)
                        // Ensure that the package.json file gets the name and version properties.
                        if (typeof doodle.name !== 'string') {
                            doodle.name = hyphenate(gist.description).toLowerCase()
                        }
                        if (typeof doodle.version !== 'string') {
                            doodle.version = "0.1.0"
                        }
                    }
                    else {
                        // If both doodle.json and package.json exists then we have a problem.
                        // We try to recover by simply deleting the doodle.json.
                        doodle.deleteFile(LEGACY_META)
                    }
                }
                callback(undefined, doodle);
            }
            else {
                callback(err, void 0);
            }
        });
    }

    downloadRepo(owner: string, repo: string, callback: (reason: any, doodle: Doodle) => void) {
        this.github.getRepoContents(owner, repo, (err: any, contents: RepoElement[]) => {
            if (!err) {
                const doodle = new Doodle(this.options)
                doodle.userId = owner
                doodle.repoId = repo
                doodle.gistId = void 0
                const promises: ng.IPromise<PathContents>[] = [];
                for (let c = 0; c < contents.length; c++) {
                    const element = contents[c]
                    promises.push(this.github.getPathContents(owner, repo, element.path))
                }
                const xs = this.$q.all(promises)
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
                        const file = doodle.newFile(repoFile.path)
                        file.content = fileContent
                        // The sha is needed in order to perform an update.
                        file.sha = repoFile.sha
                    }
                    callback(void 0, doodle)
                    // doodles.unshift(doodle);
                    // doodles.updateStorage();
                    // this.onInitDoodle(doodles.current())
                }).catch((reason) => {
                    callback(new Error(`Error attempting to download File`), void 0)
                })
            }
            else {
                callback(new Error(`Error attempting to download Repo`), void 0)
            }
        })
    }

    createGist(doodle: Doodle, callback: (err: any, response: PostGistResponse) => any) {
        const data: GistData = doodleToGist(doodle, this.options);
        this.github.postGist(data, function(err: any, response: PostGistResponse) {
            if (err) {
                callback(new Error(`Unable to post your Gist at this time because ${err}.`), void 0)
            }
            else {
                callback(void 0, response)
            }
        });
    }

    updateGist(doodle: Doodle, gistId: string, callback: (err: any, response: PatchGistResponse, status: number) => any) {
        const data: GistData = doodleToGist(doodle, this.options);
        this.github.patchGist(gistId, data, function(err: any, response: PatchGistResponse, status: number) {
            if (err) {
                callback(err, response, status)
            }
            else {
                callback(err, response, status)
            }
        });
    }

    uploadToRepo(doodle: Doodle, owner: string, repo: string, ref: string): void {
        const github = this.github;
        const base64 = this.base64;
        const $q = this.$q;
        github.getReference(owner, repo, ref).then(function(response) {
            const reference = response.data
            if (reference.object.type === 'commit') {
                const commitSHA = reference.object.sha;
                github.getCommit(owner, repo, commitSHA).then(function(response) {
                    const commit = response.data
                    const treeSHA = commit.tree.sha;
                    // Let's create blobs for ALL our files!
                    const blobs: ng.IHttpPromise<BlobKey>[] = []
                    const paths = Object.keys(doodle.files)
                    for (let p = 0; p < paths.length; p++) {
                        const path = paths[p]
                        const file = doodle.files[path]
                        const encoded = base64.encode(file.content)
                        blobs.push(github.createBlob(owner, repo, encoded, 'base64'))
                    }
                    const data: TreeArg = { base_tree: treeSHA, tree: [] }
                    $q.all(blobs).then(function(promiseValue) {
                        for (let p = 0; p < paths.length; p++) {
                            const prom = promiseValue[p]
                            const blobSHA = prom.data.sha
                            data.tree.push({
                                path: paths[p],
                                mode: '100644',
                                type: 'blob',
                                sha: blobSHA
                            })
                        }
                        github.createTree(owner, repo, data).then(function(response) {
                            const treeKey = response.data
                            const commit: CommitArg = {
                                message: "Hello",
                                parents: [commitSHA],
                                tree: treeKey.sha
                            }
                            github.createCommit(owner, repo, commit).then(function(response) {
                                const commitKey = response.data
                                const data: ReferenceData = {
                                    sha: commitKey.sha,
                                    force: false
                                };
                                github.updateReference(owner, repo, ref, data).then(function(response) {
                                    const status = response.status
                                    console.log(`status => ${status}`) // 200
                                    console.log(`statusText => ${response.statusText}`) // OK
                                    const headers = response.headers
                                    console.log(`X-RateLimit-Limit => ${headers('X-RateLimit-Limit')}`) // 5000
                                    console.log(`X-RateLimit-Remaining => ${headers('X-RateLimit-Remaining')}`) // 4999
                                    const reference = response.data
                                    console.log(JSON.stringify(reference, null, 2))
                                }).catch(function(reason) {
                                    console.warn(`Unable to update reference ${ref} because ${JSON.stringify(reason)}.`)
                                })
                            }).catch(function(reason) {
                                console.warn(`Unable to create commit because ${JSON.stringify(reason)}.`)
                            })
                        }).catch(function(reason) {
                            console.warn(`Unable to create tree because ${JSON.stringify(reason)}.`)
                        })
                    }).catch(function(reason) {
                        console.warn(`Unable to create blobs because ${JSON.stringify(reason)}.`)
                    })
                    // We don't really need to get the tree!
                    /*
                    github.getTree(owner, repo, treeSHA).then(function(response) {
                        const tree = response.data
                        for (let i = 0; i < tree.tree.length; i++) {
                            const child = tree.tree[i];
                            const path = child.path;
                            switch (child.type) {
                                case 'blob': {
                                    github.getBlob(owner, repo, child.sha).then(function(response) {
                                        // const status = response.status
                                        // console.log(`status => ${status}`) // 200
                                        // console.log(`statusText => ${response.statusText}`) // OK
                                        // const headers = response.headers
                                        // console.log(`X-RateLimit-Limit => ${headers('X-RateLimit-Limit')}`) // 5000
                                        // console.log(`X-RateLimit-Remaining => ${headers('X-RateLimit-Remaining')}`) // 4999
                                        const blob = response.data;
                                        switch (blob.encoding) {
                                            case 'base64': {
                                                const content = base64.decode(blob.content);
                                                console.log(child.path)
                                                console.log(content)
                                                break;
                                            }
                                            default: {
                                                console.warn(`Expecting blob.encoding for '${path}', was ${blob.encoding}.`)
                                            }
                                        }
                                    }).catch(function(reason) {
                                        console.warn(`Unable to get blob because ${JSON.stringify(reason)}.`)
                                    })
                                    break;
                                }
                                default: {
                                    console.warn(`Expecting child '${path}' to be a blob, but was ${child.type}.`)
                                }
                            }
                        }

                    }).catch(function(reason) {
                        console.warn(`Unable to get tree '${treeSHA}' because ${JSON.stringify(reason)}.`)
                    })
                    */
                }).catch(function(reason) {
                    console.warn(`Unable to get commit '${commitSHA}' because ${JSON.stringify(reason)}.`)
                })
            }
            else {
                console.warn(`Expecting reference '${ref}' to be for a commit, but was ${reference.object.type}.`)
            }
        }).catch(function(reason) {
            console.warn(`Unable to get reference '${ref}' because ${JSON.stringify(reason)}.`)
        })
    }
}
