/**
 * 
 */
export interface ITemplateFile {
    content: string;
    language: string;
}
/**
 * 
 */
export interface TemplateOptions {
    mainJs: string;
    mainTs: string;
    tab: string;
}

export interface ITemplateFileBuilder {
    (options: TemplateOptions): ITemplateFile;
}

export interface ITemplate {
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
