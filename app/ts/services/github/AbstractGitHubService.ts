import { CookieService } from '../cookie/cookie.service';
import { Headers, RequestOptions } from '@angular/http';
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

/**
 * 
 */
export abstract class AbstractGitHubService {
    /**
     * TODO: cookieService to become private when refactoring complete.
     */
    constructor(protected cookieService: CookieService) {
        // Do nothing yet.
    }

    /**
     * api.github.com over HTTPS protocol.
     * i.e. 'https://api.hithub.com'
     */
    protected gitHub(): string {
        return `${GITHUB_PROTOCOL}://${GITHUB_DOMAIN}`;
    }

    /**
     * 'https://api.github.com/gists'
     */
    protected gists(): string {
        return `${this.gitHub()}/gists`;
    }

    protected repos(): string {
        return `${this.gitHub()}/user/repos`;
    }

    protected options() {
        const headers = this.requestHeaders();
        return new RequestOptions({ headers });
    }

    /**
     * Returns the 'Accept' and 'Authorization' Headers.
     * The GitHub token is included only if available.
     */
    protected requestHeaders(): Headers {
        const token = this.cookieService.getItem(GITHUB_TOKEN_COOKIE_NAME);
        const headers: { 'Accept': string; 'Authorization'?: string; } = {
            Accept: ACCEPT_HEADER
        };
        if (token) {
            headers.Authorization = `token ${token}`;
        }
        return new Headers(headers);
    }
}
