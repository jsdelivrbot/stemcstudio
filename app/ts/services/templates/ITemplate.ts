import ITemplateFile from './ITemplateFile';

interface ITemplate {
    name: string;
    description: string;
    files: { [path: string]: ITemplateFile };
    /**
     * A map from package name to semantic version.
     */
    dependencies: { [packageName: string]: string };
    /**
     * Determines whether Linting will be enabled by default.
     */
    linting: boolean;
    noLoopCheck: boolean;
    operatorOverloading: boolean;
}

export default ITemplate;
