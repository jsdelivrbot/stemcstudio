import { IWindowService } from 'angular';
import { EditorPreferencesStorage } from '../EditorPreferencesStorage';
import { DEFAULT_THEME_NAME } from '../../editors/services/manager/manifest';

/**
 * 
 */
interface Preferences {
    /**
     * 
     */
    displayIndentGuides: boolean;
    /**
     * 
     */
    fontSize: string;
    /**
     * 
     */
    showFoldWidgets: boolean;
    /**
     * 
     */
    showGutter: boolean;
    /**
     * 
     */
    showInvisibles: boolean;
    /**
     * 
     */
    showLineNumbers: boolean;
    /**
     * 
     */
    showPrintMargin: boolean;
    /**
     * 
     */
    tabSize: number;
    /**
     * 
     */
    theme: string;
    /**
     * 
     */
    useSoftTabs: boolean;
}

function mixin(obj: Partial<Preferences>, base: Preferences) {
    for (const key in base) {
        if (typeof obj[key] === 'undefined') {
            obj[key] = base[key];
        }
    }
    return obj;
}

const PREFERENCES_KEY = 'com.stemcstudio.preferences';

const DEFAULTS: Preferences = {
    displayIndentGuides: false,
    fontSize: '14px',
    showFoldWidgets: true,
    showGutter: true,
    showInvisibles: false,
    showLineNumbers: true,
    showPrintMargin: false,
    tabSize: 4,
    theme: DEFAULT_THEME_NAME,
    useSoftTabs: true
};

export class PreferencesManagerService implements EditorPreferencesStorage {
    public static $inject: string[] = ['$window'];
    private cache: Partial<Preferences> = {};
    constructor(private $window: IWindowService) {
        const value = this.$window.localStorage[PREFERENCES_KEY];
        if (value) {
            this.cache = JSON.parse(value);
        }
        mixin(this.cache, DEFAULTS);
    }

    get displayIndentGuides(): boolean {
        if (typeof this.cache.displayIndentGuides === 'boolean') {
            return this.cache.displayIndentGuides;
        }
        else {
            return DEFAULTS.displayIndentGuides;
        }
    }
    set displayIndentGuides(value: boolean) {
        this.cache.displayIndentGuides = value;
        this.updateStorage();
    }

    get fontSize(): string {
        if (typeof this.cache.fontSize === 'string') {
            return this.cache.fontSize;
        }
        else {
            return DEFAULTS.fontSize;
        }
    }
    set fontSize(value: string) {
        this.cache.fontSize = value;
        this.updateStorage();
    }

    get showFoldWidgets(): boolean {
        if (typeof this.cache.showFoldWidgets === 'boolean') {
            return this.cache.showFoldWidgets;
        }
        else {
            return DEFAULTS.showFoldWidgets;
        }
    }
    set showFoldWidgets(value: boolean) {
        this.cache.showFoldWidgets = value;
        this.updateStorage();
    }

    get showGutter(): boolean {
        if (typeof this.cache.showGutter === 'boolean') {
            return this.cache.showGutter;
        }
        else {
            return DEFAULTS.showGutter;
        }
    }
    set showGutter(value: boolean) {
        this.cache.showGutter = value;
        this.updateStorage();
    }

    get showInvisibles(): boolean {
        if (typeof this.cache.showInvisibles === 'boolean') {
            return this.cache.showInvisibles;
        }
        else {
            return DEFAULTS.showInvisibles;
        }
    }
    set showInvisibles(value: boolean) {
        this.cache.showInvisibles = value;
        this.updateStorage();
    }

    get showLineNumbers(): boolean {
        return this.cache.showLineNumbers as boolean;
    }
    set showLineNumbers(value: boolean) {
        this.cache.showLineNumbers = value;
        this.updateStorage();
    }

    get showPrintMargin(): boolean {
        return this.cache.showPrintMargin as boolean;
    }
    set showPrintMargin(value: boolean) {
        this.cache.showPrintMargin = value;
        this.updateStorage();
    }

    get tabSize(): number {
        return this.cache.tabSize as number;
    }
    set tabSize(value: number) {
        this.cache.tabSize = value;
        this.updateStorage();
    }

    get theme(): string {
        return this.cache.theme as string;
    }
    set theme(value: string) {
        this.cache.theme = value;
        this.updateStorage();
    }

    get useSoftTabs(): boolean {
        return this.cache.useSoftTabs as boolean;
    }
    set useSoftTabs(value: boolean) {
        this.cache.useSoftTabs = value;
        this.updateStorage();
    }

    private updateStorage(): void {
        this.$window.localStorage[PREFERENCES_KEY] = JSON.stringify(this.cache);
    }
}
