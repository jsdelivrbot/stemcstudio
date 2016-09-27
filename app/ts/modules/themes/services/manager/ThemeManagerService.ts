import * as ng from 'angular';
import themes from './manifest';
import Theme from '../../Theme';
import ThemeManager from '../../ThemeManager';
import ThemeManagerEvent from '../../ThemeManagerEvent';
import {currentTheme} from '../../ThemeManagerEvent';

const themeNames: string[] = themes.map(theme => theme.name);

interface ThemeManagerCallback {
    (event: ThemeManagerEvent): any;
}

export default class DefaultThemeManager implements ThemeManager {
    public static $inject: string[] = ['$q'];
    private callbacksByEventName: { [eventName: string]: ThemeManagerCallback[] } = {};
    private currentTheme: Theme;
    constructor(private $q: ng.IQService) {
        // Do nothing yet.
        this.currentTheme = getThemeByName("Twilight");
    }
    addEventListener(eventName: string, callback: ThemeManagerCallback) {
        this.ensureCallbacks(eventName).push(callback);
        const theme = this.currentTheme;
        callback({ cssClass: theme.cssClass, href: `/themes/${theme.fileName}`, isDark: theme.isDark });
    }
    removeEventListener(eventName: string, callback: ThemeManagerCallback) {
        const cbs = this.ensureCallbacks(eventName);
        const index = cbs.indexOf(callback);
        if (index >= 0) {
            cbs.splice(index, 1);
        }
    }
    getThemes(): ng.IPromise<Theme[]> {
        const deferred: ng.IDeferred<Theme[]> = this.$q.defer<Theme[]>();
        deferred.resolve(themes);
        return deferred.promise;
    }
    getThemeNames(): ng.IPromise<string[]> {
        const deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
        deferred.resolve(themeNames);
        return deferred.promise;
    }
    getCurrentTheme(): Theme {
        return this.currentTheme;
    }
    setCurrentThemeByName(themeName: string): void {
        const index = themeNames.indexOf(themeName);
        if (index >= 0) {
            const theme: Theme = themes[index];
            const cbs = this.ensureCallbacks(currentTheme);
            for (let i = 0; i < cbs.length; i++) {
                const cb = cbs[i];
                cb({ cssClass: theme.cssClass, href: `/themes/${theme.fileName}`, isDark: theme.isDark });
            }
            this.currentTheme = theme;
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

function getThemeByName(name: string): Theme {
    const index = themeNames.indexOf(name);
    if (index >= 0) {
        return themes[index];
    }
    else {
        return void 0;
    }
}
