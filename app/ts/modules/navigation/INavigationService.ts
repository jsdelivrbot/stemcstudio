import { IPromise } from 'angular';

export interface INavigationService {
    gotoDash(): IPromise<any>;
    gotoDownload(): IPromise<any>;
    gotoExamples(): IPromise<any>;
    gotoHome(): IPromise<any>;
    gotoWork(): IPromise<any>;
    gotoGist(gistId: string): IPromise<any>;
    gotoRepo(owner: string, repo: string): IPromise<any>;
    gotoRoom(roomId: string): IPromise<any>;
}

export const NAVIGATION_SERVICE_UUID = 'navigationService';
