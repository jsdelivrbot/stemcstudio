/**
 * The versioning is required for cache busting.
 * It must be synchronized with the build process.
 */
export const ACE_WORKER_VERSION = '2.9.30';
export const ACE_WORKER_MODULE_NAME = 'ace-workers.js';
export const ACE_WORKER_PATH = `/js/ace-workers@${ACE_WORKER_VERSION}/${ACE_WORKER_MODULE_NAME}`;

export const TYPESCRIPT_SERVICES_VERSION = '2.3.1';
export const TYPESCRIPT_SERVICES_MODULE_NAME = 'typescriptServices.js';
export const TYPESCRIPT_SERVICES_PATH = `/js/typescript@${TYPESCRIPT_SERVICES_VERSION}/${TYPESCRIPT_SERVICES_MODULE_NAME}`;

export const GITHUB_TOKEN_COOKIE_NAME = 'github-token';
