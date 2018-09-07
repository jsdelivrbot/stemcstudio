/**
 * The application version is used for cache busting the jspm.config.js file.
 * This file is used to load the application and the workers.
 * DON'T FORGET TO CHANGE THE VERSION IN views/index.pug !!!
 * Keep synchronized with package.json and bower.json.
 */
export const APP_VERSION = '2.51.1';

/**
 * Web Worker supporting TypeScript Mode.
 * The versioning is required for cache busting.
 * It must be synchronized with the build process.
 */
const STEMCSTUDIO_WORKER_TS_VERSION = '1.0.0';
const STEMCSTUDIO_WORKER_TS_MODULE_NAME = 'stemcstudio-worker-ts.js';
export const STEMCSTUDIO_WORKER_TS_PATH = `/js/stemcstudio-worker-ts@${STEMCSTUDIO_WORKER_TS_VERSION}/${STEMCSTUDIO_WORKER_TS_MODULE_NAME}`;

/**
 * Web Workers supporting Language Modes.
 * The versioning is required for cache busting.
 * It must be synchronized with the build process.
 */
const STEMCSTUDIO_WORKERS_VERSION = '2.15.4';
const STEMCSTUDIO_WORKERS_MODULE_NAME = 'stemcstudio-workers.js';
/**
 *  
 */
export const STEMCSTUDIO_WORKERS_PATH = `/js/stemcstudio-workers@${STEMCSTUDIO_WORKERS_VERSION}/${STEMCSTUDIO_WORKERS_MODULE_NAME}`;

/**
 * Web Worker supporting the Workspace (Language Service).
 * The versioning is required for cache busting.
 * It must be synchronized with the build process.
 */
const STEMCSTUDIO_WORKSPACE_VERSION = '1.0.0';
export const STEMCSTUDIO_WORKSPACE_MODULE_NAME = 'stemcstudio-workspace.js';
export const STEMCSTUDIO_WORKSPACE_PATH = `/js/stemcstudio-workspace@${STEMCSTUDIO_WORKSPACE_VERSION}/${STEMCSTUDIO_WORKSPACE_MODULE_NAME}`;

export const TYPESCRIPT_SERVICES_VERSION = '3.0.3';
export const TYPESCRIPT_SERVICES_MODULE_NAME = 'typescriptServices.js';
export const TYPESCRIPT_SERVICES_PATH = `/js/typescript@${TYPESCRIPT_SERVICES_VERSION}/${TYPESCRIPT_SERVICES_MODULE_NAME}`;

export const GITHUB_TOKEN_COOKIE_NAME = 'github-token';

// Special files in a typical project.
export const PACKAGE_DOT_JSON = 'package.json';
export const SYSTEM_DOT_CONFIG_DOT_JS = 'system.config.js';
export const TYPES_DOT_CONFIG_DOT_JSON = 'types.config.json';

/**
 * The current (closed) list of configuration files.
 */
export const configFiles = [
    'package.json',
    'tsconfig.json',
    SYSTEM_DOT_CONFIG_DOT_JS,
    'system.config.json',
    'tslint.json',
    TYPES_DOT_CONFIG_DOT_JSON
];

export const EMBEDDING_PARAM_EMBED = 'embed';
export const EMBEDDING_PARAM_FILE = 'file';
export const EMBEDDING_PARAM_HIDE_CODE = 'hideCode';
export const EMBEDDING_PARAM_HIDE_EXPLORER = 'hideExplorer';
export const EMBEDDING_PARAM_HIDE_README = 'hideREADME';
