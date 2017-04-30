import { IHttpPromise, IHttpService, IQService } from 'angular';
import { AbstractGitHubService } from './AbstractGitHubService';
import Blob from './Blob';
import BlobData from './BlobData';
import BlobKey from './BlobKey';
import Commit from './Commit';
import CommitData from './CommitData';
import CommitKey from './CommitKey';
import { IGitHubService } from './IGitHubService';
import { COOKIE_SERVICE_UUID, ICookieService } from '../cookie/ICookieService';
import PutFileResponse from './PutFileResponse';
import Reference from './Reference';
import ReferenceCreateData from './ReferenceCreateData';
import ReferenceUpdateData from './ReferenceUpdateData';
import Tree from './Tree';
import TreeData from './TreeData';
import TreeKey from './TreeKey';

/**
 * All access is over HTTPS, and accessed from https://api/github.com
 * 
 * https://developer.github.com/v3/#schema
 */
const GITHUB_PROTOCOL = 'https';
const GITHUB_DOMAIN = 'api.github.com';
const HTTP_METHOD_DELETE = 'DELETE';
const HTTP_METHOD_GET = 'GET';
const HTTP_METHOD_PATCH = 'PATCH';
const HTTP_METHOD_POST = 'POST';
const HTTP_METHOD_PUT = 'PUT';

export class GitHubService extends AbstractGitHubService implements IGitHubService {
    static $inject = ['$http', '$q', COOKIE_SERVICE_UUID];
    constructor(private $http: IHttpService, $q: IQService, cookieService: ICookieService) {
        super(cookieService);
    }

    /*
    The GitHub API uses the same method (PUT) and URL (/repos/:owner/:repo/contents/:path)
    for creating a file as for updating a file. The key difference is that the update
    requires the blob SHA of the file being replaced. In effect, the existence of the sha
    determines whether the intention is to create a new file or update an existing one.
    */
    putFile(owner: string, repo: string, path: string, message: string, content: string, sha: string): IHttpPromise<PutFileResponse> {
        const method = HTTP_METHOD_PUT;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/contents/${path}`;
        const data = { message, content, sha };
        const headers = this.requestHeaders();
        return this.$http<PutFileResponse>({ method, url, data, headers });
    }

    deleteFile(owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response: any) => any) {
        const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo + "/contents/" + path;
        const data = {
            message: message,
            sha: sha
        };
        return this.$http({
            method: HTTP_METHOD_DELETE,
            url: url,
            data: data,
            headers: this.requestHeaders()
        }).then(function (file) {
            return done(null, file);
        }).catch(function (response) {
            return done(new Error(response.message), response);
        });
    }

    deleteRepo(owner: string, repo: string, done: (reason: Error | null, value: any) => void) {
        const url = "" + GITHUB_PROTOCOL + "://" + GITHUB_DOMAIN + "/repos/" + owner + "/" + repo;
        return this.$http({
            method: HTTP_METHOD_DELETE,
            url: url,
            headers: this.requestHeaders()
        }).then(function (repo) {
            return done(null, repo);
        }).catch(function (response) {
            return done(new Error(response.message), response);
        });
    }
    getReference(owner: string, repo: string, ref: string): IHttpPromise<Reference> {
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/refs/${ref}`;
        const headers = this.requestHeaders();
        return this.$http<Reference>({ method, url, headers });
    }
    getCommit(owner: string, repo: string, sha: string): IHttpPromise<Commit> {
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/commits/${sha}`;
        const headers = this.requestHeaders();
        return this.$http<Commit>({ method, url, headers });
    }
    getTree(owner: string, repo: string, sha: string): IHttpPromise<Tree> {
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/trees/${sha}`;
        const headers = this.requestHeaders();
        return this.$http<Tree>({ method, url, headers });
    }
    getBlob(owner: string, repo: string, sha: string): IHttpPromise<Blob> {
        const method = HTTP_METHOD_GET;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/blobs/${sha}`;
        const headers = this.requestHeaders();
        return this.$http<Blob>({ method, url, headers });
    }
    createBlob(owner: string, repo: string, data: BlobData): IHttpPromise<BlobKey> {
        const method = HTTP_METHOD_POST;
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/blobs`;
        const headers = this.requestHeaders();
        return this.$http({ method, url, data, headers });
    }
    createTree(owner: string, repo: string, data: TreeData): IHttpPromise<TreeKey> {
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/trees`;
        return this.$http({
            method: HTTP_METHOD_POST,
            url: url,
            data: data,
            headers: this.requestHeaders()
        });
    }
    createCommit(owner: string, repo: string, data: CommitData): IHttpPromise<CommitKey> {
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/commits`;
        return this.$http({
            method: HTTP_METHOD_POST,
            url: url,
            data: data,
            headers: this.requestHeaders()
        });
    }
    createReference(owner: string, repo: string, data: ReferenceCreateData): IHttpPromise<Reference> {
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/refs`;
        return this.$http({
            method: HTTP_METHOD_POST,
            url: url,
            data: data,
            headers: this.requestHeaders()
        });
    }
    updateReference(owner: string, repo: string, ref: string, data: ReferenceUpdateData): IHttpPromise<Reference> {
        const url = `${this.gitHub()}/repos/${owner}/${repo}/git/refs/${ref}`;
        return this.$http({
            method: HTTP_METHOD_PATCH,
            url: url,
            data: data,
            headers: this.requestHeaders()
        });
    }
}
