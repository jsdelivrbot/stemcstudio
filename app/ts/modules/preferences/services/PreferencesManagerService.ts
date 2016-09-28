import PreferencesManager from '../PreferencesManager';

interface Preferences {
    theme?: string;
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
    theme: "Eclipse"
};

export default class PreferencesManagerService implements PreferencesManager {
    public static $inject: string[] = ['$window'];
    private cache: Preferences = {};
    constructor(private $window: angular.IWindowService) {
        const value = this.$window.localStorage[PREFERENCES_KEY];
        if (value) {
            this.cache = JSON.parse(value);
        }
        mixin(this.cache, DEFAULTS);
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
