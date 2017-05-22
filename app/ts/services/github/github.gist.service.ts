import { AbstractGitHubService } from './AbstractGitHubService';
import { CookieService } from '../cookie/cookie.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { IGitHubGistService } from './IGitHubGistService';
import { Gist } from './Gist';
import { GistComment } from './GistComment';
import { GistData } from './GistData';
import linkToMap from '../../utils/linkToMap';
import { Links } from './Links';

//
// Funky stuff to get Observable typing and for map, toPromise methods to be defined.
//
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GitHubGistService extends AbstractGitHubService implements IGitHubGistService {

    constructor(private http: Http, cookieService: CookieService) {
        super(cookieService);
    }

    private gistURL(gistId: string): string {
        return `${this.gists()}/${gistId}`;
    }

    getGist(gistId: string): Promise<Gist> {
        return this.http.get(this.gistURL(gistId), this.options())
            .map(function (response) { return response.json() as Gist; })
            .toPromise();
    }

    getGistComments(gistId: string): Promise<GistComment[]> {
        return this.http.get(`${this.gistURL(gistId)}/comments`, this.options())
            .map(function (response) { return response.json() as GistComment[]; })
            .toPromise();
    }

    getGists(): Promise<{ gists: Gist[]; links: Links }> {
        return this.http.get(this.gists(), this.options())
            .map(function (response) {
                const links = response.headers ? linkToMap(response.headers.get('link')) : {};
                return { gists: response.json() as Gist[], links };
            })
            .toPromise();
    }

    getGistsPage(url: string): Promise<{ gists: Gist[]; links: Links }> {
        return this.http.get(url, this.options())
            .map(function (response) {
                const links = response.headers ? linkToMap(response.headers.get('link')) : {};
                return { gists: response.json() as Gist[], links };
            })
            .toPromise();
    }

    /**
     * Performs a create Gist request with `post` HTTP method.
     */
    createGist(data: GistData): Promise<Gist> {
        return this.http.post(this.gists(), data, this.options())
            .map(function (response) { return response.json() as Gist; })
            .toPromise();
    }

    /**
     * Performs an update Gist request with `patch` HTTP method.
     */
    updateGist(gistId: string, data: GistData): Promise<Gist> {
        // console.log(`GitHubGistService.updateGist(gistId = ${gistId}, data = ...)`);
        // console.log(JSON.stringify(data, null, 2));
        return this.http.patch(this.gistURL(gistId), data, this.options())
            .map(function (response) { return response.json() as Gist; })
            .toPromise();
    }

    deleteGist(gistId: string, done: (err: any, response: any) => void) {
        return this.http.delete(this.gistURL(gistId), this.options())
            .map(function (response) {
                console.log(JSON.stringify(response));
                return response.json() as Gist;
            })
            .toPromise();
    }
}
