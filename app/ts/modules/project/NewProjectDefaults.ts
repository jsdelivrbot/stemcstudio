import { ITemplate } from '../../services/templates/template';

/**
 * The defaults for creating a new project.
 */
interface NewProjectDefaults {
    /**
     * The description suggested to the user.
     */
    description?: string;
    /**
     * The template suggested to the user.
     */
    template?: ITemplate;
    /**
     * The version suggested to the user.
     */
    version?: string;
}

export default NewProjectDefaults;
