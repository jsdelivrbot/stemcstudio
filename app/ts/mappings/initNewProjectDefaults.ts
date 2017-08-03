import { NewProjectDefaults } from '../modules/project/NewProjectDefaults';

export function initNewProjectDefaults(description: string): NewProjectDefaults {
    const defaults: NewProjectDefaults = {
        description,
        version: "1.0.0"
    };
    return defaults;
}
