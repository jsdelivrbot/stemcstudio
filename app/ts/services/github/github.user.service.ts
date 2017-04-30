import { CookieService } from '../cookie/cookie.service';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { IGitHubUserService } from './IGitHubUserService';
import { GitHubUser } from './GitHubUser';
import { GITHUB_TOKEN_COOKIE_NAME } from '../../constants';
//
// Funky stuff to get Observable typing and for map, toPromise methods to be defined.
//
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

/**
 * Explicity request the v3 version of the API
 * 
 * https://developer.github.com/v3/#current-version
 */
const ACCEPT_HEADER = "application/vnd.github.v3+json";

/**
 * All access is over HTTPS, and accessed from https://api/github.com
 * 
 * https://developer.github.com/v3/#schema
 */
const GITHUB_PROTOCOL = 'https';
const GITHUB_DOMAIN = 'api.github.com';
// const HTTP_METHOD_DELETE = 'DELETE';
// const HTTP_METHOD_GET = 'GET';
// const HTTP_METHOD_PATCH = 'PATCH';
// const HTTP_METHOD_POST = 'POST';
// const HTTP_METHOD_PUT = 'PUT';

@Injectable()
export class GitHubUserService implements IGitHubUserService {
    constructor(private http: Http, private cookieService: CookieService) {
        // Do nothing yet.
    }
    private gitHub(): string {
        return `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}`;
    }
    private requestHeaders(): Headers {
        const token = this.cookieService.getItem(GITHUB_TOKEN_COOKIE_NAME);
        const headers: { 'Accept': string; 'Authorization'?: string; } = {
            Accept: ACCEPT_HEADER
        };
        if (token) {
            headers.Authorization = `token ${token}`;
        }
        return new Headers(headers);
    }
    /**
     * 
     */
    getUser(): Promise<GitHubUser> {
        const url = `${this.gitHub()}/user`;
        const headers = this.requestHeaders();
        const options = new RequestOptions({ headers });
        return this.http.get(url, options)
            .map(function (response) { return response.json() as GitHubUser; })
            .toPromise();
    }
}
