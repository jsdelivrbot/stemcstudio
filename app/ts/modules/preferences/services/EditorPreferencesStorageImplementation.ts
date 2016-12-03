import EditorPreferencesStorage from '../EditorPreferencesStorage';

interface Preferences {
    theme?: string;
    showInvisibles?: boolean;
}

function mixin(obj: Preferences, base: Preferences) {
    for (var key in base) {
        if (typeof obj[key] === 'undefined') {
            obj[key] = base[key];
        }
    }
    return obj;
}

const PREFERENCES_KEY = 'com.stemcstudio.preferences';

const DEFAULTS: Preferences = {
    theme: "Eclipse",
    showInvisibles: false
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

    get showInvisibles(): boolean {
        return this.cache.showInvisibles;
    }
    set showInvisibles(value: boolean) {
        this.cache.showInvisibles = value;
        this.updateStorage();
    }

    get theme(): string {
        return this.cache.theme;
    }
    set theme(value: string) {
        this.cache.theme = value;
        this.updateStorage();
    }

    private updateStorage(): void {
        this.$window.localStorage[PREFERENCES_KEY] = JSON.stringify(this.cache);
    }
}
