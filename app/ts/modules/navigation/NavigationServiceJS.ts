import { IStateOptions, IStateService } from 'angular-ui-router';
import { INavigationService } from './INavigationService';
import { GOOGLE_ANALYTICS_UUID } from '../../fugly/ga/ga';
// Names of routing states.
// WARNING: Changing state names can break ui-sref directives.

/**
 * Used for Google Analytics.
 * TODO: These belong in a different module.
 */
export const CATEGORY_NAVIGATION = 'navigation';
export const CATEGORY_WORKSPACE = 'workspace';

/**
 * 
 */
export const STATE_DASHBOARD = 'dashboard';

/**
 * 
 */
export const STATE_WORKSPACE = 'workspace';

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
 * NavigationService implementation using IStateService (ui.router module).
 */
export class NavigationServiceJS implements INavigationService {
    /**
     * 
     */
    public static $inject: string[] = ['$state', GOOGLE_ANALYTICS_UUID];
    /**
     * 
     */
    constructor(private $state: IStateService, private ga: UniversalAnalytics.ga) {
        // Do nothing.
    }

    public gotoDash() {
        this.ga('send', 'event', CATEGORY_NAVIGATION, STATE_DASHBOARD);
        return this.navigateTo(STATE_DASHBOARD);
    }

    public gotoWork() {
        this.ga('send', 'event', CATEGORY_NAVIGATION, STATE_WORKSPACE);
        return this.navigateTo(STATE_WORKSPACE);
    }

    public gotoDownload() {
        this.ga('send', 'event', CATEGORY_NAVIGATION, STATE_DOWNLOAD);
        return this.navigateTo(STATE_DOWNLOAD);
    }

    public gotoExamples() {
        this.ga('send', 'event', CATEGORY_NAVIGATION, STATE_EXAMPLES);
        return this.navigateTo(STATE_EXAMPLES);
    }

    public gotoGist(gistId: string) {
        this.ga('send', 'event', CATEGORY_NAVIGATION, STATE_GIST, gistId);
        return this.navigateTo(STATE_GIST, { gistId });
    }

    public gotoHome() {
        this.ga('send', 'event', CATEGORY_NAVIGATION, STATE_HOME);
        return this.navigateTo(STATE_HOME);
    }

    public gotoRepo(owner: string, repo: string) {
        this.ga('send', 'event', CATEGORY_NAVIGATION, STATE_REPO, `${owner}/${repo}`);
        return this.navigateTo(STATE_REPO, { owner, repo });
    }

    public gotoRoom(roomId: string) {
        this.ga('send', 'event', CATEGORY_NAVIGATION, STATE_ROOM, roomId);
        return this.navigateTo(STATE_ROOM, { roomId });
    }

    private navigateTo(to: string, params?: {}, options?: IStateOptions) {
        return this.$state.go(to, params, options);
    }
}
