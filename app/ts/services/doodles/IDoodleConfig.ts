/**
 * This is the schema for the package.json file.
 * TODO: Rename to say PackageInfo and move to a more common location.
 */
interface IDoodleConfig {
    name: string;
    version: string;
    description?: string;
    author?: string;
    dependencies: { [key: string]: string };
    operatorOverloading: boolean;
    keywords: string[];
}

export default IDoodleConfig;
