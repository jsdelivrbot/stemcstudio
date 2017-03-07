interface PropertiesSettings {
    /**
     * project name (a packageName)
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
     * packageName(s)
     */
    dependencies: string[];
}

export default PropertiesSettings;
