import { IHttpService, ILocationService } from 'angular';
import { scriptURL } from './scriptURL';
import { WsModel } from '../../modules/wsmodel/WsModel';

/**
 * TODO: Refactor.
 * 
 * oldResolutions refers to the module resolutions that are loaded (mirror).
 * oldResolutions thus mirrors the current state of the cache in the language service.
 */
function updateModules(wsModel: WsModel, $http: IHttpService, $location: ILocationService, VENDOR_FOLDER_MARKER: string): Promise<string[]> {
    return new Promise<string[]>(function (resolve, reject) {
        //
        // TODO: This needs revising now that we can change almost any part of the mapping.
        //

        /**
         * A mapping from moduleName to d.ts URL.
         */
        const newResolutions = wsModel.getModuleResolutions();
        const modules = wsModel.getModulesLoaded();

        // Load the wokspace with the appropriate TypeScript definitions.
        /**
         * The new module dependencies (module names).
         */
        const news = Object.keys(newResolutions);
        const olds = modules.names();

        // Determine what we need to add and remove from the workspace.
        //
        // We must add what we need if it doesn't already exist in the workspace.
        // We must remove those things in the workspace that are no longer needed.

        /**
         * The modules that we need to add to the workspace.
         */
        const adds = news.filter((moduleName) => { return olds.indexOf(moduleName) < 0; });

        /**
         * The modules that we need to remove from the workspace.
         */
        const rmvs = olds.filter(function (moduleName) { return news.indexOf(moduleName) < 0; });

        // TODO: Optimize so that we don't keep loading `lib`.
        let addUnits = adds.map(function (moduleName) { return { moduleName, URL: newResolutions[moduleName] }; });

        /**
         * The domain on which we are running. e.g., `https://www.stemcstudio.com` or `localhost:8080`.
         * We determine this dynamically in order to access files in known locations on our server.
         * Current usage is for JavaScript files, TypeScript d.ts files, and paths to gists.
         * TODO: JavaScript and TypeScript to come from external repos.
         */
        const FWD_SLASH = '/';
        const DOMAIN = $location.protocol() + ':' + FWD_SLASH + FWD_SLASH + $location.host() + ":" + $location.port();

        // We're loading d.ts files here. Why don't we cache them so that we don't need the HTTP request?
        const readFile = (fileName: string, callback: (err: any, data?: string) => void) => {
            const url = scriptURL(DOMAIN, fileName, VENDOR_FOLDER_MARKER);
            $http.get<string>(url)
                .then(function successCallback(arg) {
                    callback(null, arg.data);
                })
                .catch(function errorCallback(e) {
                    callback(new Error(`Unable to wrangle ${fileName}. Cause: ${e}`), void 0);
                });
        };

        rmvs.forEach((moduleName) => {
            wsModel.removeModule(moduleName)
                .then(({ previous, removed }) => {
                    if (typeof previous === 'undefined' || !removed) {
                        console.warn(`removeModuleMapping(${moduleName}) returned previous ${previous} and removed ${removed}`);
                    }
                })
                .catch(function (err) {
                    console.warn(`removeModuleMapping(${moduleName}) failed. ${err}`);
                });
        });

        // Make sure that the callback gets called, even when adding no files.
        // TODO: Optimize when there are no changes.
        if (addUnits.length > 0) {
            /**
             * Keeps track of all the asynchronous requests to read file contents.
             */
            let inFlightCount = 0;
            for (const addUnit of addUnits) {
                inFlightCount++;
                readFile(addUnit.URL, (err, content) => {
                    inFlightCount--;
                    if (!err) {
                        if (content) {
                            wsModel.addModule(addUnit.moduleName, addUnit.URL, content.replace(/\r\n?/g, '\n'))
                                .catch((err) => {
                                    console.warn(`ensureScript(${addUnit.URL}) failed. ${err}`);
                                });
                        }
                    }
                    if (0 === inFlightCount) {
                        resolve(olds);
                    }
                });
            }
        }
        else {
            resolve(olds);
        }
    });
}

/**
 * TODO: Refactor.
 */
function updateAmbients(
    wsModel: WsModel,
    FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
    FILENAME_TYPESCRIPT_ES2015_CORE_DTS: string,
    FILENAME_TYPESCRIPT_PROMISE_LIB_DTS: string,
    $http: IHttpService,
    $location: ILocationService,
    VENDOR_FOLDER_MARKER: string): Promise<string[]> {
    return new Promise<string[]>(function (resolve, reject) {
        //
        // TODO: This needs revising now that we can change almost any part of the mapping.
        //

        /**
         * A mapping from globalName to d.ts URL.
         */
        const ambientResolutions = wsModel.getAmbientResolutions();
        const ambients = wsModel.getAmbientsLoaded();

        // Load the wokspace with the appropriate TypeScript definitions.
        /**
         * The new ambient dependencies (global names).
         */
        const news = Object.keys(ambientResolutions);
        /**
         * The existing ambient dependencies (global names).
         */
        const olds = ambients.names();

        // Determine what we need to add and remove from the workspace.
        //
        // We must add what we need if it doesn't already exist in the workspace.
        // We must remove those things in the workspace that are no longer needed.

        /**
         * The ambients that we need to add to the workspace.
         */
        const adds: string[] = news.filter((globalName) => { return olds.indexOf(globalName) < 0; });

        /**
         * The ambients that we need to remove from the workspace.
         */
        const rmvs: string[] = olds.filter(function (globalName) { return news.indexOf(globalName) < 0; });

        if (rmvs.indexOf(FILENAME_TYPESCRIPT_CURRENT_LIB_DTS) >= 0) {
            // By removing it from the list, we will keep the 'lib' in the workspace and save an unload/load cycle.
            rmvs.splice(rmvs.indexOf(FILENAME_TYPESCRIPT_CURRENT_LIB_DTS), 1);
        }
        if (rmvs.indexOf(FILENAME_TYPESCRIPT_ES2015_CORE_DTS) >= 0) {
            // By removing it from the list, we will keep the 'lib' in the workspace and save an unload/load cycle.
            rmvs.splice(rmvs.indexOf(FILENAME_TYPESCRIPT_ES2015_CORE_DTS), 1);
        }
        if (rmvs.indexOf(FILENAME_TYPESCRIPT_PROMISE_LIB_DTS) >= 0) {
            // By removing it from the list, we will keep the 'lib' in the workspace and save an unload/load cycle.
            rmvs.splice(rmvs.indexOf(FILENAME_TYPESCRIPT_PROMISE_LIB_DTS), 1);
        }

        // TODO: Optimize so that we don't keep loading `lib`.
        let addUnits = adds.map(function (globalName) { return { globalName, URL: ambientResolutions[globalName] }; });

        // Ensure that the TypeScript ambient type definitions are present.
        if (olds.indexOf(FILENAME_TYPESCRIPT_CURRENT_LIB_DTS) < 0) {
            addUnits = addUnits.concat({ globalName: FILENAME_TYPESCRIPT_CURRENT_LIB_DTS, URL: FILENAME_TYPESCRIPT_CURRENT_LIB_DTS });
        }
        if (olds.indexOf(FILENAME_TYPESCRIPT_ES2015_CORE_DTS) < 0) {
            addUnits = addUnits.concat({ globalName: FILENAME_TYPESCRIPT_ES2015_CORE_DTS, URL: FILENAME_TYPESCRIPT_ES2015_CORE_DTS });
        }
        if (olds.indexOf(FILENAME_TYPESCRIPT_PROMISE_LIB_DTS) < 0) {
            addUnits = addUnits.concat({ globalName: FILENAME_TYPESCRIPT_PROMISE_LIB_DTS, URL: FILENAME_TYPESCRIPT_PROMISE_LIB_DTS });
        }

        /**
         * The domain on which we are running. e.g., `https://www.stemcstudio.com` or `localhost:8080`.
         * We determine this dynamically in order to access files in known locations on our server.
         * Current usage is for JavaScript files, TypeScript d.ts files, and paths to gists.
         * TODO: JavaScript and TypeScript to come from external repos.
         */
        const FWD_SLASH = '/';
        const DOMAIN = $location.protocol() + ':' + FWD_SLASH + FWD_SLASH + $location.host() + ":" + $location.port();

        // We're loading d.ts files here. Why don't we cache them so that we don't need the HTTP request?
        const readFile = (fileName: string, callback: (err: any, data?: string) => void) => {
            const url = scriptURL(DOMAIN, fileName, VENDOR_FOLDER_MARKER);
            $http.get<string>(url)
                .then(function successCallback(arg) {
                    callback(null, arg.data);
                })
                .catch(function errorCallback(e) {
                    callback(new Error(`Unable to wrangle ${fileName}. Cause: ${e}`), void 0);
                });
        };

        // TODO: We could now wait until this resolves.
        rmvs.forEach((globalName) => {
            wsModel.removeAmbient(globalName);
        });

        // Make sure that the callback gets called, even when adding no files.
        // TODO: Optimize when there are no changes.
        if (addUnits.length > 0) {
            /**
             * Keeps track of all the asynchronous requests to read file contents.
             */
            let inFlightCount = 0;
            for (const addUnit of addUnits) {
                inFlightCount++;
                readFile(addUnit.URL, (err, content) => {
                    inFlightCount--;
                    if (!err) {
                        if (content) {
                            //
                            // d.ts file content is provided to the workspace with the path being the URL.
                            //
                            wsModel.addAmbient(addUnit.globalName, addUnit.URL, content.replace(/\r\n?/g, '\n'))
                                .catch((err) => {
                                    console.warn(`addAmbientensureScript(${addUnit.URL}) failed. ${err}`);
                                });
                        }
                    }
                    if (0 === inFlightCount) {
                        resolve(olds);
                    }
                });
            }
        }
        else {
            resolve(olds);
        }
    });
}

/**
 * Computes the delta of files additions and removals and calls ensureScript or removeScript accordingly.
 * The additions require HTTP requests to fetch the file contents to be added.
 * This function does NOT trigger semantic validation.
 * Not worrying about callback right now - this will be re-written!
 */
export function updateWorkspaceTypes(
    wsModel: WsModel,
    FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
    FILENAME_TYPESCRIPT_ES2015_CORE_DTS: string,
    FILENAME_TYPESCRIPT_PROMISE_LIB_DTS: string,
    $http: IHttpService,
    $location: ILocationService,
    VENDOR_FOLDER_MARKER: string,
    callback: (err?: any) => void
) {
    // console.lg("updateWorkspaceTypes(...)");
    const doneAmbients = updateAmbients(wsModel, FILENAME_TYPESCRIPT_CURRENT_LIB_DTS, FILENAME_TYPESCRIPT_ES2015_CORE_DTS, FILENAME_TYPESCRIPT_PROMISE_LIB_DTS, $http, $location, VENDOR_FOLDER_MARKER);
    const doneModules = updateModules(wsModel, $http, $location, VENDOR_FOLDER_MARKER);
    Promise.all([doneAmbients, doneModules])
        .then(() => {
            callback();
        })
        .catch((reason) => {
            callback(reason);
        });
}
