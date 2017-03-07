interface PropertiesSettings {
    /**
     * project name
     */
    name: string;
    /**
     * project version
     */
    version: string;
    /**
     * operator overloading enabled
     */
    operatorOverloading: boolean;
    /**
     * moduleName(s)
     */
    dependencies: string[];
}

export default PropertiesSettings;
