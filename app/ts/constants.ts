/**
 * The application version is used for cache busting the jspm.config.js file.
 * This files is used to load the application and the workers.
 */
export const APP_VERSION = '2.28.0';

/**
 * The versioning is required for cache busting.
 * It must be synchronized with the build process.
 */
const STEMCSTUDIO_WORKERS_VERSION = '2.12.17';
export const STEMCSTUDIO_WORKERS_MODULE_NAME = 'stemcstudio-workers.js';
export const STEMCSTUDIO_WORKERS_PATH = `/js/stemcstudio-workers@${STEMCSTUDIO_WORKERS_VERSION}/${STEMCSTUDIO_WORKERS_MODULE_NAME}`;

export const TYPESCRIPT_SERVICES_VERSION = '2.3.1';
export const TYPESCRIPT_SERVICES_MODULE_NAME = 'typescriptServices.js';
export const TYPESCRIPT_SERVICES_PATH = `/js/typescript@${TYPESCRIPT_SERVICES_VERSION}/${TYPESCRIPT_SERVICES_MODULE_NAME}`;

export const GITHUB_TOKEN_COOKIE_NAME = 'github-token';
