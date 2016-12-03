import * as angular from 'angular';
import Theme from './Theme';
import EditorPreferencesEvent from './EditorPreferencesEvent';

interface EditorPreferencesService {
    /**
     * Returns the available list of themes as identifiers. 
     */
    getThemes(): angular.IPromise<Theme[]>;
    /**
     * Returns the available list of themes as identifiers. 
     */
    getThemeNames(): angular.IPromise<string[]>;
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
    getShowInvisibles(): boolean;
    /**
     * 
     */
    setShowInvisibles(showInvisibles: boolean): void;
    /**
     * Adds a listener for changes in the theme.
     */
    addEventListener(eventName: string, callback: (event: EditorPreferencesEvent) => any): void;
    /**
     * Removes a listener for changes in the theme.
     */
    removeEventListener(eventName: string, callback: (event: EditorPreferencesEvent) => any): void;
}

export default EditorPreferencesService;
