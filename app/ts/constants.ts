/**
 * The application version is used for cache busting the jspm.config.js file.
 * This files is used to load the application and the workers.
 */
export const APP_VERSION = '2.36.6';

/**
 * Web Workers supporting Language Modes.
 * The versioning is required for cache busting.
 * It must be synchronized with the build process.
 */
const STEMCSTUDIO_WORKERS_VERSION = '2.15.4';
export const STEMCSTUDIO_WORKERS_MODULE_NAME = 'stemcstudio-workers.js';
export const STEMCSTUDIO_WORKERS_PATH = `/js/stemcstudio-workers@${STEMCSTUDIO_WORKERS_VERSION}/${STEMCSTUDIO_WORKERS_MODULE_NAME}`;

/**
 * Web Worker supporting the Workspace (Language Service).
 * The versioning is required for cache busting.
 * It must be synchronized with the build process.
 */
const STEMCSTUDIO_WORKSPACE_VERSION = '1.0.0';
export const STEMCSTUDIO_WORKSPACE_MODULE_NAME = 'stemcstudio-workspace.js';
export const STEMCSTUDIO_WORKSPACE_PATH = `/js/stemcstudio-workspace@${STEMCSTUDIO_WORKSPACE_VERSION}/${STEMCSTUDIO_WORKSPACE_MODULE_NAME}`;

export const TYPESCRIPT_SERVICES_VERSION = '2.3.4';
export const TYPESCRIPT_SERVICES_MODULE_NAME = 'typescriptServices.js';
export const TYPESCRIPT_SERVICES_PATH = `/js/typescript@${TYPESCRIPT_SERVICES_VERSION}/${TYPESCRIPT_SERVICES_MODULE_NAME}`;

export const GITHUB_TOKEN_COOKIE_NAME = 'github-token';
