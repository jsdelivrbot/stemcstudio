import { LanguageModeId } from '../../editor/LanguageMode';

/**
 * 
 */
export interface ITemplateFile {
    content: string;
    language: LanguageModeId;
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
    /**
     * The identifier for the template.
     */
    name: string;
    /**
     * The text presented to the user.
     */
    description: string;
    /**
     * The GitHub Gist identifier that provides the template.
     */
    gistId: string;
}
