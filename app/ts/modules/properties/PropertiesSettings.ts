/**
 * 
 */
interface PropertiesSettings {
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
     * disable infinite looping detection.
     */
    noLoopCheck: boolean;
    /**
     * operator overloading enabled.
     */
    operatorOverloading: boolean;
    /**
     * packageName(s) only, no semantic version.
     */
    dependencies: string[];
}

export default PropertiesSettings;
