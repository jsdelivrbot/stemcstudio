import { PathContents } from './PathContents';
import { Repo } from './Repo';
import { RepoData } from './RepoData';
import { RepoElement } from './RepoElement';
import { RepoKey } from './RepoKey';

/**
 * The GitHub v3 API.
 */
export interface IGitHubRepoService {
    createRepo(data: RepoData): Promise<RepoKey>;
    getPathContents(owner: string, repo: string, path: string): Promise<PathContents>;
    getRepo(owner: string, repo: string): Promise<Repo>;
    getRepoContents(owner: string, repo: string): Promise<RepoElement[]>;
    getUserRepos(): Promise<Repo[]>;
}

/**
 * (AngularJS)
 */
export const GITHUB_REPO_SERVICE_UUID = 'GitHubRepoService';
