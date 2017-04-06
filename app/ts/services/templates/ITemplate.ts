import ITemplateFile from './ITemplateFile';

interface ITemplate {
    name: string;
    description: string;
    files: { [path: string]: ITemplateFile };
    /**
     * A map from package name to semantic version.
     */
    dependencies: { [packageName: string]: string };
    noLoopCheck: boolean;
    operatorOverloading: boolean;
}

export default ITemplate;
