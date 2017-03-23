import ITemplate from '../../services/templates/ITemplate';

/**
 * The chosen values for creating a new project.
 */
export interface NewProjectSettings {
    /**
     * The description entered by the user.
     */
    description: string;
    /**
     * The template chosen by the user.
     */
    template: ITemplate;
    /**
     * 
     */
    version: string;
}

export default NewProjectSettings;
