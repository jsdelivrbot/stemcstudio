import { IHttpPromise } from 'angular';
import { Blob } from './Blob';
import { BlobData } from './BlobData';
import { BlobKey } from './BlobKey';

import { Commit } from './Commit';
import { CommitData } from './CommitData';
import { CommitKey } from './CommitKey';

import { PutFileResponse } from './PutFileResponse';

import { Reference } from './Reference';
import { ReferenceCreateData } from './ReferenceCreateData';
import { ReferenceUpdateData } from './ReferenceUpdateData';

import { Tree } from './Tree';
import { TreeData } from './TreeData';
import { TreeKey } from './TreeKey';

// import GitHubUser from './GitHubUser';
// import { IGitHubUserService } from './IGitHubUserService';

/**
 * The GitHub v3 API.
 * The return type is always (TODO) IHttpPromise because this API runs over HTTPS (AnhgularJS).
 * (The IHttpPromise maintains, status, statusText, headers and config in addition to the payload).
 * This service is the aggregation of smaller services.
 */
export interface IGitHubService /* extends IGitHubUserService */ {
    deleteFile(owner: string, repo: string, path: string, message: string, sha: string, done: (err: any, response: any) => any): void;
    deleteRepo(owner: string, repo: string, done: (err: any, response: any) => any): void;

    putFile(owner: string, repo: string, path: string, message: string, content: string, sha: string): IHttpPromise<PutFileResponse>;

    /**
     * Get a Blob
     * The content in the response will always be Base64 encoded.
     * This API supports blobs up to 100 megabytes in size.
     */
    getBlob(owner: string, repo: string, sha: string): IHttpPromise<Blob>;

    /**
     * Create a Blob
     */
    createBlob(owner: string, repo: string, data: BlobData): IHttpPromise<BlobKey>;

    /**
     * 
     */
    getTree(owner: string, repo: string, sha: string): IHttpPromise<Tree>;

    /**
     * 
     */
    createTree(owner: string, repo: string, tree: TreeData): IHttpPromise<TreeKey>;

    /**
     * 
     */
    getCommit(owner: string, repo: string, sha: string): IHttpPromise<Commit>;

    /**
     * 
     */
    createCommit(owner: string, repo: string, commit: CommitData): IHttpPromise<CommitKey>;

    /**
     * The ref must be formatted as 'heads/branch', not just 'branch'.
     */
    getReference(owner: string, repo: string, ref: string): IHttpPromise<Reference>;

    /**
     * 
     */
    createReference(owner: string, repo: string, data: ReferenceCreateData): IHttpPromise<Reference>;

    /**
     * 
     */
    updateReference(owner: string, repo: string, ref: string, data: ReferenceUpdateData): IHttpPromise<Reference>;
}

/**
 * (AngularJS)
 */
export const GITHUB_SERVICE_UUID = 'GitHubService';
