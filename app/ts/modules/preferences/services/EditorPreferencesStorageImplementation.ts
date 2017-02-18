import EditorPreferencesStorage from '../EditorPreferencesStorage';

/**
 * 
 */
interface Preferences {
    /**
     * 
     */
    displayIndentGuides?: boolean;
    /**
     * 
     */
    fontSize?: string;
    /**
     * 
     */
    showFoldWidgets?: boolean;
    /**
     * 
     */
    showInvisibles?: boolean;
    /**
     * 
     */
    showLineNumbers?: boolean;
    /**
     * 
     */
    showPrintMargin?: boolean;
    /**
     * 
     */
    tabSize?: number;
    /**
     * 
     */
    theme?: string;
    /**
     * 
     */
    useSoftTabs?: boolean;
}

function mixin(obj: Preferences, base: Preferences) {
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
    showInvisibles: false,
    showLineNumbers: true,
    showPrintMargin: false,
    tabSize: 4,
    theme: "Eclipse",
    useSoftTabs: true
};

export default class PreferencesManagerService implements EditorPreferencesStorage {
    public static $inject: string[] = ['$window'];
    private cache: Preferences = {};
    constructor(private $window: angular.IWindowService) {
        const value = this.$window.localStorage[PREFERENCES_KEY];
        if (value) {
            this.cache = JSON.parse(value);
        }
        mixin(this.cache, DEFAULTS);
    }

    get displayIndentGuides(): boolean {
        return this.cache.displayIndentGuides;
    }
    set displayIndentGuides(value: boolean) {
        this.cache.displayIndentGuides = value;
        this.updateStorage();
    }

    get fontSize(): string {
        return this.cache.fontSize;
    }
    set fontSize(value: string) {
        this.cache.fontSize = value;
        this.updateStorage();
    }

    get showFoldWidgets(): boolean {
        return this.cache.showFoldWidgets;
    }
    set showFoldWidgets(value: boolean) {
        this.cache.showFoldWidgets = value;
        this.updateStorage();
    }

    get showInvisibles(): boolean {
        return this.cache.showInvisibles;
    }
    set showInvisibles(value: boolean) {
        this.cache.showInvisibles = value;
        this.updateStorage();
    }

    get showLineNumbers(): boolean {
        return this.cache.showLineNumbers;
    }
    set showLineNumbers(value: boolean) {
        this.cache.showLineNumbers = value;
        this.updateStorage();
    }

    get showPrintMargin(): boolean {
        return this.cache.showPrintMargin;
    }
    set showPrintMargin(value: boolean) {
        this.cache.showPrintMargin = value;
        this.updateStorage();
    }

    get tabSize(): number {
        return this.cache.tabSize;
    }
    set tabSize(value: number) {
        this.cache.tabSize = value;
        this.updateStorage();
    }

    get theme(): string {
        return this.cache.theme;
    }
    set theme(value: string) {
        this.cache.theme = value;
        this.updateStorage();
    }

    get useSoftTabs(): boolean {
        return this.cache.useSoftTabs;
    }
    set useSoftTabs(value: boolean) {
        this.cache.useSoftTabs = value;
        this.updateStorage();
    }

    private updateStorage(): void {
        this.$window.localStorage[PREFERENCES_KEY] = JSON.stringify(this.cache);
    }
}
