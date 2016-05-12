import * as ng from 'angular';
import themes from './manifest';
import Theme from './Theme';
import ThemeManager from './ThemeManager';
import ThemeManagerEvent from './ThemeManagerEvent';
import {currentTheme} from './ThemeManagerEvent';

const names: string[] = themes.map(theme => theme.name);

interface ThemeManagerCallback {
    (event: ThemeManagerEvent): any;
}

export default class DefaultThemeManager implements ThemeManager {
    public static $inject: string[] = ['$q'];
    private callbacksByEventName: { [eventName: string]: ThemeManagerCallback[] } = {};
    constructor(private $q: ng.IQService) {
        // Do nothing yet.
    }
    addEventListener(eventName: string, callback: ThemeManagerCallback) {
        this.ensureCallbacks(eventName).push(callback);
        const theme = this.getThemeByName("Twilight");
        callback({ cssClass: theme.cssClass, href: `/themes/${theme.fileName}`, isDark: theme.isDark });
    }
    removeEventListener(eventName: string, callback: ThemeManagerCallback) {
        const cbs = this.ensureCallbacks(eventName);
        const index = cbs.indexOf(callback);
        if (index >= 0) {
            cbs.splice(index, 1);
        }
    }
    getThemeNames(): ng.IPromise<string[]> {
        const deferred: ng.IDeferred<any> = this.$q.defer<any>();
        deferred.resolve(names);
        return deferred.promise;
    }
    setTheme(name: string): void {
        const index = names.indexOf(name);
        if (index >= 0) {
            const theme: Theme = themes[index];
            const cbs = this.ensureCallbacks(currentTheme);
            for (let i = 0; i < cbs.length; i++) {
                const cb = cbs[i];
                cb({ cssClass: theme.cssClass, href: `/themes/${theme.fileName}`, isDark: theme.isDark });
            }
        }
    }
    private getThemeByName(name: string): Theme {
        const index = names.indexOf(name);
        if (index >= 0) {
            return themes[index];
        }
        else {
            return void 0;
        }
    }
    private ensureCallbacks(eventName: string): ThemeManagerCallback[] {
        const map = this.callbacksByEventName;
        if (!Array.isArray(map[eventName])) {
            map[eventName] = [];
        }
        return map[eventName];
    }
}
