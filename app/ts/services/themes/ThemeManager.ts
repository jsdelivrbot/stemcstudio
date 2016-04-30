import * as angular from 'angular';
import ThemeManagerEvent from './ThemeManagerEvent';

interface ThemeManager {
    getThemeNames(): angular.IPromise<string[]>
    setTheme(name: string);
    addEventListener(eventName: string, callback: (event: ThemeManagerEvent) => any);
    removeEventListener(eventName: string, callback: (event: ThemeManagerEvent) => any);
}

export default ThemeManager;
