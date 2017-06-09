/**
 * The versioning is required for cache busting.
 * It must be synchronized with the build process.
 */
const STEMCSTUDIO_WORKERS_VERSION = '2.12.3';
export const STEMCSTUDIO_WORKERS_MODULE_NAME = 'ace-workers.js';
export const STEMCSTUDIO_WORKERS_PATH = `/js/ace-workers@${STEMCSTUDIO_WORKERS_VERSION}/${STEMCSTUDIO_WORKERS_MODULE_NAME}`;

export const TYPESCRIPT_SERVICES_VERSION = '2.3.1';
export const TYPESCRIPT_SERVICES_MODULE_NAME = 'typescriptServices.js';
export const TYPESCRIPT_SERVICES_PATH = `/js/typescript@${TYPESCRIPT_SERVICES_VERSION}/${TYPESCRIPT_SERVICES_MODULE_NAME}`;

export const GITHUB_TOKEN_COOKIE_NAME = 'github-token';
