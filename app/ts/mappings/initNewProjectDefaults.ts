import NewProjectDefaults from '../modules/project/NewProjectDefaults';

export default function initNewProjectDefaults(description: string): NewProjectDefaults {
    const defaults: NewProjectDefaults = {
        description,
        version: "0.9.0"
    };
    return defaults;
}
