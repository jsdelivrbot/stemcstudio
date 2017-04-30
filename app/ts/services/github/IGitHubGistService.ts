import { Gist } from './Gist';
import { GistComment } from './GistComment';
import { GistData } from './GistData';
import { Links } from './Links';

/**
 * The GitHub v3 API.
 */
export interface IGitHubGistService {
    getGist(gistId: string): Promise<Gist>;
    getGistComments(gistId: string): Promise<GistComment[]>;
    getGists(): Promise<{ gists: Gist[]; links: Links }>;
    getGistsPage(url: string): Promise<{ gists: Gist[]; links: Links }>;
    createGist(data: GistData): Promise<Gist>;
    updateGist(gistId: string, data: GistData): Promise<Gist>;
    deleteGist(gistId: string, done: (err: any, response: any) => void): void;
}

/**
 * (AngularJS)
 */
export const GITHUB_GIST_SERVICE_UUID = 'GitHubGistService';
