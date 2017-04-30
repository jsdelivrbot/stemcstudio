import { AbstractGitHubService } from './AbstractGitHubService';
import { CookieService } from '../cookie/cookie.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { IGitHubRepoService } from './IGitHubRepoService';
import { PathContents } from './PathContents';
import { Repo } from './Repo';
import { RepoData } from './RepoData';
import { RepoElement } from './RepoElement';
import { RepoKey } from './RepoKey';

//
// Funky stuff to get Observable typing and for map, toPromise methods to be defined.
//
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GitHubRepoService extends AbstractGitHubService implements IGitHubRepoService {
    constructor(private http: Http, cookieService: CookieService) {
        super(cookieService);
    }
    private repoURL(owner: string, repo: string): string {
        return `${this.repos()}/${owner}/${repo}`;
    }

    createRepo(data: RepoData): Promise<RepoKey> {
        return this.http.post(this.repos(), data, this.options())
            .map(function (response) { return response.json() as RepoKey; })
            .toPromise();
    }

    getRepo(owner: string, repo: string): Promise<Repo> {
        return this.http.get(this.repoURL(owner, repo), this.options())
            .map(function (response) { return response.json() as Repo; })
            .toPromise();
    }
    /**
     * We're using this method in the GitHubCloudService to download a Repo
     */
    getPathContents(owner: string, repo: string, path: string): Promise<PathContents> {
        // TODO: The GitHUb v3 API lets us specify the name of the commit/branch/tag.
        // The default is the repository default branch, usually master.
        return this.http.get(`${this.repoURL(owner, repo)}/contents/${path}`, this.options())
            .map(function (response) { return response.json() as PathContents; })
            .toPromise();
    }

    getRepoContents(owner: string, repo: string): Promise<RepoElement[]> {
        // TODO: The GitHUb v3 API lets us specify the name of the commit/branch/tag.
        // The default is the repository default branch, usually master.
        return this.http.get(`${this.repoURL(owner, repo)}/contents`, this.options())
            .map(function (response) { return response.json() as RepoElement[]; })
            .toPromise();
    }

    getUserRepos(): Promise<Repo[]> {
        return this.http.get(`${this.gitHub()}/user/repos`, this.options())
            .map(function (response) { return response.json() as Repo[]; })
            .toPromise();
    }
}
