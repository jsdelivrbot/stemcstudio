import themes from './manifest';
import { Theme } from '../../Theme';
import { EditorPreferencesService } from '../../EditorPreferencesService';
import { EditorPreferencesEvent } from '../../EditorPreferencesEvent';
import { currentTheme } from '../../EditorPreferencesEvent';
import { EDITOR_PREFERENCES_STORAGE } from '../../../preferences/constants';
import { IDeferred, IPromise, IQService } from 'angular';
import { EditorPreferencesStorage } from '../../../preferences/EditorPreferencesStorage';

const fontSizes: string[] = [10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36].map(function (fontSize) { return `${fontSize}px`; });
const tabSizes: number[] = [2, 3, 4];
const themeNames: string[] = themes.map(theme => theme.name);

export interface EditorPreferencesCallback {
    (event: EditorPreferencesEvent): void;
}

export class DefaultEditorPreferencesService implements EditorPreferencesService {
    public static $inject: string[] = ['$q', EDITOR_PREFERENCES_STORAGE];
    private callbacksByEventName: { [eventName: string]: EditorPreferencesCallback[] } = {};
    private currentTheme: Theme;
    constructor(private $q: IQService, private storage: EditorPreferencesStorage) {
        // Do nothing yet.
        this.currentTheme = getThemeByName(storage.theme);
    }
    addEventListener(eventName: string, callback: EditorPreferencesCallback) {
        this.ensureCallbacks(eventName).push(callback);
        const theme = this.currentTheme;
        callback({
            displayIndentGuides: this.storage.displayIndentGuides,
            fontSize: this.storage.fontSize,
            cssClass: theme.cssClass,
            href: `/themes/${theme.fileName}`,
            isDark: theme.isDark,
            showFoldWidgets: this.storage.showFoldWidgets,
            showGutter: this.storage.showGutter,
            showInvisibles: this.storage.showInvisibles,
            showLineNumbers: this.storage.showLineNumbers,
            showPrintMargin: this.storage.showPrintMargin,
            tabSize: this.storage.tabSize,
            useSoftTabs: this.storage.useSoftTabs
        });
    }
    removeEventListener(eventName: string, callback: EditorPreferencesCallback) {
        const cbs = this.ensureCallbacks(eventName);
        const index = cbs.indexOf(callback);
        if (index >= 0) {
            cbs.splice(index, 1);
        }
    }

    /**
     * 
     */
    getDisplayIndentGuides(): boolean {
        return this.storage.displayIndentGuides;
    }

    /**
     * 
     */
    setDisplayIndentGuides(displayIndentGuides: boolean): void {
        this.storage.displayIndentGuides = displayIndentGuides;
        this.broadcast();
    }

    /**
     * 
     */
    getFontSize(): string {
        return this.storage.fontSize;
    }

    /**
     * 
     */
    setFontSize(fontSize: string): void {
        this.storage.fontSize = fontSize;
        this.broadcast();
    }

    /**
     * 
     */
    getFontSizes(): IPromise<string[]> {
        const deferred: IDeferred<string[]> = this.$q.defer<string[]>();
        deferred.resolve(fontSizes);
        return deferred.promise;
    }

    /**
     * 
     */
    getTabSize(): number {
        return this.storage.tabSize;
    }

    /**
     * 
     */
    setTabSize(tabSize: number): void {
        this.storage.tabSize = tabSize;
        this.broadcast();
    }

    /**
     * 
     */
    getTabSizes(): IPromise<number[]> {
        const deferred: IDeferred<number[]> = this.$q.defer<number[]>();
        deferred.resolve(tabSizes);
        return deferred.promise;
    }

    /**
     * 
     */
    getThemes(): IPromise<Theme[]> {
        const deferred: IDeferred<Theme[]> = this.$q.defer<Theme[]>();
        deferred.resolve(themes);
        return deferred.promise;
    }

    /**
     * 
     */
    getThemeNames(): IPromise<string[]> {
        const deferred: IDeferred<string[]> = this.$q.defer<string[]>();
        deferred.resolve(themeNames);
        return deferred.promise;
    }

    /**
     * 
     */
    getCurrentTheme(): Theme {
        return this.currentTheme;
    }

    /**
     * 
     */
    setCurrentThemeByName(themeName: string): void {
        const index = themeNames.indexOf(themeName);
        if (index >= 0) {
            const theme: Theme = themes[index];
            this.currentTheme = theme;
            this.storage.theme = theme.name;
            this.broadcast();
        }
    }

    /**
     * 
     */
    getShowFoldWidgets(): boolean {
        return this.storage.showFoldWidgets;
    }

    /**
     * 
     */
    setShowFoldWidgets(showFoldWidgets: boolean): void {
        this.storage.showFoldWidgets = showFoldWidgets;
        this.broadcast();
    }

    /**
     * 
     */
    getShowGutter(): boolean {
        return this.storage.showGutter;
    }

    /**
     * 
     */
    setShowGutter(showGutter: boolean): void {
        this.storage.showGutter = showGutter;
        this.broadcast();
    }

    /**
     * 
     */
    getShowInvisibles(): boolean {
        return this.storage.showInvisibles;
    }

    /**
     * 
     */
    setShowInvisibles(showInvisibles: boolean): void {
        this.storage.showInvisibles = showInvisibles;
        this.broadcast();
    }

    /**
     * 
     */
    getShowLineNumbers(): boolean {
        return this.storage.showLineNumbers;
    }

    /**
     * 
     */
    setShowLineNumbers(showLineNumbers: boolean): void {
        this.storage.showLineNumbers = showLineNumbers;
        this.broadcast();
    }

    /**
     * 
     */
    getShowPrintMargin(): boolean {
        return this.storage.showPrintMargin;
    }

    /**
     * 
     */
    setShowPrintMargin(showPrintMargin: boolean): void {
        this.storage.showPrintMargin = showPrintMargin;
        this.broadcast();
    }

    /**
     * 
     */
    getUseSoftTabs(): boolean {
        return this.storage.useSoftTabs;
    }

    /**
     * 
     */
    setUseSoftTabs(useSoftTabs: boolean): void {
        this.storage.useSoftTabs = useSoftTabs;
        this.broadcast();
    }

    /**
     * 
     */
    private broadcast() {
        const theme: Theme = this.currentTheme;
        const callbacks = this.ensureCallbacks(currentTheme);
        for (const callback of callbacks) {
            callback({
                displayIndentGuides: this.storage.displayIndentGuides,
                fontSize: this.storage.fontSize,
                cssClass: theme.cssClass,
                href: `/themes/${theme.fileName}`,
                isDark: theme.isDark,
                showFoldWidgets: this.storage.showFoldWidgets,
                showGutter: this.storage.showGutter,
                showInvisibles: this.storage.showInvisibles,
                showLineNumbers: this.storage.showLineNumbers,
                showPrintMargin: this.storage.showPrintMargin,
                tabSize: this.storage.tabSize,
                useSoftTabs: this.storage.useSoftTabs
            });
        }
    }

    /**
     * 
     */
    private ensureCallbacks(eventName: string): EditorPreferencesCallback[] {
        const map = this.callbacksByEventName;
        if (!Array.isArray(map[eventName])) {
            map[eventName] = [];
        }
        return map[eventName];
    }
}

function getThemeByName(themeName: string): Theme {
    const index = themeNames.indexOf(themeName);
    if (index >= 0) {
        return themes[index];
    }
    else {
        throw new Error(`themeName => ${themeName}`);
    }
}
