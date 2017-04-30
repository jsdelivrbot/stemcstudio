import { GitHubUser } from './GitHubUser';

/**
 * The GitHub v3 API.
 */
export interface IGitHubUserService {
    /**
     * 
     */
    getUser(): Promise<GitHubUser>;
}

/**
 * (AngularJS)
 */
export const GITHUB_USER_SERVICE_UUID = 'GitHubUserService';
