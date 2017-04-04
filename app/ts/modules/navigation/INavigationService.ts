import { IPromise } from 'angular';

export interface INavigationService {
    gotoCookbook(label?: string, value?: number): IPromise<any>;
    gotoDashboard(label?: string, value?: number): IPromise<any>;
    gotoDownload(label?: string, value?: number): IPromise<any>;
    gotoExamples(label?: string, value?: number): IPromise<any>;
    gotoHome(label?: string, value?: number): IPromise<any>;
    gotoDoodle(label?: string, value?: number): IPromise<any>;
    gotoGist(gistId: string, label?: string, value?: number): IPromise<any>;
    gotoRepo(owner: string, repo: string, label?: string, value?: number): IPromise<any>;
    gotoRoom(roomId: string): IPromise<any>;
    gotoTutorials(label?: string, value?: number): IPromise<any>;
}

export const NAVIGATION_SERVICE_UUID = 'navigationService';

export default INavigationService;
