import { IPromise } from 'angular';
import { Theme } from './Theme';
import { EditorPreferencesEvent } from './EditorPreferencesEvent';

export interface EditorPreferencesService {
    /**
     * 
     */
    getDisplayIndentGuides(): boolean;
    /**
     * 
     */
    setDisplayIndentGuides(displayIndentGuides: boolean): void;
    /**
     * 
     */
    getFontSize(): string;
    /**
     * 
     */
    setFontSize(fontSize: string): void;
    /**
     * Returns the available list of fontSizes. 
     */
    getFontSizes(): IPromise<string[]>;
    /**
     * 
     */
    getTabSize(): number;
    /**
     * 
     */
    setTabSize(tabSize: number): void;
    /**
     * Returns the available list of tabSizes. 
     */
    getTabSizes(): IPromise<number[]>;
    /**
     * Returns the available list of themes as identifiers. 
     */
    getThemes(): IPromise<Theme[]>;
    /**
     * Returns the available list of themes as identifiers. 
     */
    getThemeNames(): IPromise<string[]>;
    /**
     * Returns the identifier for the current theme.
     */
    getCurrentTheme(): Theme;
    /**
     * Sets the current theme using the theme name.
     * The theme should be known to the theme manager.
     */
    setCurrentThemeByName(themeName: string): void;
    /**
     * 
     */
    getShowFoldWidgets(): boolean;
    /**
     * 
     */
    setShowFoldWidgets(showFoldWidgets: boolean): void;
    /**
     * 
     */
    getShowGutter(): boolean;
    /**
     * 
     */
    setShowGutter(showGutter: boolean): void;
    /**
     * 
     */
    getShowInvisibles(): boolean;
    /**
     * 
     */
    setShowInvisibles(showInvisibles: boolean): void;
    /**
     * 
     */
    getShowLineNumbers(): boolean;
    /**
     * 
     */
    setShowLineNumbers(showLineNumbers: boolean): void;
    /**
     * 
     */
    getShowPrintMargin(): boolean;
    /**
     * 
     */
    setShowPrintMargin(showPrintMargin: boolean): void;
    /**
     * 
     */
    getUseSoftTabs(): boolean;
    /**
     * 
     */
    setUseSoftTabs(useSoftTabs: boolean): void;
    /**
     * Adds a listener for changes in the theme.
     */
    addEventListener(eventName: string, callback: (event: EditorPreferencesEvent) => any): void;
    /**
     * Removes a listener for changes in the theme.
     */
    removeEventListener(eventName: string, callback: (event: EditorPreferencesEvent) => any): void;
}
