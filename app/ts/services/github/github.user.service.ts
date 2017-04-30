import { AbstractGitHubService } from './AbstractGitHubService';
import { CookieService } from '../cookie/cookie.service';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { IGitHubUserService } from './IGitHubUserService';
import { GitHubUser } from './GitHubUser';
//
// Funky stuff to get Observable typing and for map, toPromise methods to be defined.
//
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GitHubUserService extends AbstractGitHubService implements IGitHubUserService {
    constructor(private http: Http, cookieService: CookieService) {
        super(cookieService);
    }
    /**
     * 
     */
    getUser(): Promise<GitHubUser> {
        return this.http.get(`${this.gitHub()}/user`, this.options())
            .map(function (response) { return response.json() as GitHubUser; })
            .toPromise();
    }
}
