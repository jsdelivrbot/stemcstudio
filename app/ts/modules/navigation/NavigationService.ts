import INavigationService from './INavigationService';
// Names of routing states.
// WARNING: Changing state names can break ui-sref directives.

/**
 * 
 */
export const STATE_ABOUT = 'about';

/**
 * 
 */
export const STATE_COOKBOOK = 'cookbook';

/**
 * 
 */
export const STATE_COPY = 'copy';

/**
 * 
 */
export const STATE_DASHBOARD = 'dashboard';

/**
 * 
 */
export const STATE_DOODLE = 'doodle';

/**
 * 
 */
export const STATE_DOWNLOAD = 'download';

/**
 * 
 */
export const STATE_EXAMPLES = 'examples';

/**
 * 
 */
export const STATE_GIST = 'gist';

/**
 * 
 */
export const STATE_HOME = 'home';

/**
 * 
 */
export const STATE_REPO = 'repo';

/**
 * 
 */
export const STATE_ROOM = 'room';

/**
 * 
 */
export const STATE_TUTORIALS = 'tutorials';

/**
 * 
 */
export default class NavigationService implements INavigationService {
    public static $inject: string[] = ['$state', 'ga'];
    constructor(private $state: angular.ui.IStateService, private ga: UniversalAnalytics.ga) {
        // Do nothing.
    }

    public gotoAbout(label?: string, value?: number) {
        return this.navigateTo(STATE_ABOUT, void 0, void 0, label, value);
    }

    public gotoCookbook(label?: string, value?: number) {
        return this.navigateTo(STATE_COOKBOOK, void 0, void 0, label, value);
    }

    public gotoCopy(label?: string, value?: number) {
        return this.navigateTo(STATE_COPY, void 0, void 0, label, value);
    }

    public gotoDashboard(label?: string, value?: number) {
        return this.navigateTo(STATE_DASHBOARD, void 0, void 0, label, value);
    }

    public gotoDoodle(label?: string, value?: number) {
        return this.navigateTo(STATE_DOODLE, void 0, void 0, label, value);
    }

    public gotoDownload(label?: string, value?: number) {
        return this.navigateTo(STATE_DOWNLOAD, void 0, void 0, label, value);
    }

    public gotoExamples(label?: string, value?: number) {
        return this.navigateTo(STATE_EXAMPLES, void 0, void 0, label, value);
    }

    public gotoGist(gistId: string) {
        return this.navigateTo(STATE_GIST, { gistId });
    }

    public gotoHome(label?: string, value?: number) {
        return this.navigateTo(STATE_HOME, void 0, void 0, label, value);
    }

    public gotoRepo(owner: string, repo: string) {
        return this.navigateTo(STATE_REPO, { owner, repo });
    }

    public gotoRoom(roomId: string) {
        return this.navigateTo(STATE_ROOM, { roomId });
    }

    public gotoTutorials(label?: string, value?: number) {
        return this.navigateTo(STATE_TUTORIALS, void 0, void 0, label, value);
    }

    private navigateTo(to: string, params?: {}, options?: angular.ui.IStateOptions, label?: string, value?: number): angular.IPromise<any> {
        this.ga('send', 'event', 'navigateTo', to, label, value);
        return this.$state.go(to, params, options);
    }
}
