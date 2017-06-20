/**
 * 
 */
export interface PropertiesSettings {
    /**
     * project name (a packageName).
     * TODO: Rename.
     */
    name: string;
    /**
     * project version.
     */
    version: string;
    /**
     * hide configuration files such as package.json, tsconfig.json, and tslint.json.
     */
    hideConfigFiles: boolean;
    /**
     * disable infinite looping detection.
     */
    noLoopCheck: boolean;
    /**
     * operator overloading enabled.
     */
    operatorOverloading: boolean;
    /**
     * linting enabled.
     */
    linting: boolean;
    /**
     * packageName(s) only, no semantic version.
     */
    dependencies: string[];
}
