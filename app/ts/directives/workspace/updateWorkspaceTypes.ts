import { IHttpService, ILocationService } from 'angular';
// import closure from './closure';
// import IOption from '../../services/options/IOption';
import { IOptionManager } from '../../services/options/IOptionManager';
// import { packageNamesToOptions } from './packageNamesToOptions';
// import { moduleNamesToOptions } from './moduleNamesToOptions';
import scriptURL from './scriptURL';
import WsModel from '../../modules/wsmodel/WsModel';
import { AmbientResolutions, ModuleResolutions } from '../../modules/wsmodel/WsModel';

interface ModularUnit {
    moduleName: string;
    URL: string;
}

interface AmbientUnit {
    globalName: string;
    URL: string;
}

/*
function optionsToPackageNames(options: IOption[]): string[] {
    return options.map(function (option: IOption) { return option.packageName; });
}
*/

function updateModules(
    wsModel: WsModel,
    optionManager: IOptionManager,
    /**
     * The old dependencies (module names).
     */
    modulars: ModuleResolutions,
    $http: IHttpService,
    $location: ILocationService,
    VENDOR_FOLDER_MARKER: string
): Promise<string[]> {
    return new Promise<string[]>(function (resolve, reject) {
        //
        // TODO: This needs revising now that we can change almost any part of the mapping.
        //

        /**
         * A mapping from moduleName to d.ts URL.
         */
        const moduleResolutions = wsModel.getModuleResolutions();
        //     const ambientResolutions = wsModel.getAmbientResolutions();

        // Load the wokspace with the appropriate TypeScript definitions.
        /**
         * The new module dependencies (module names).
         */
        const news: string[] = Object.keys(moduleResolutions);
        const olds: string[] = Object.keys(modulars);

        // Determine what we need to add and remove from the workspace.
        //
        // We must add what we need if it doesn't already exist in the workspace.
        // We must remove those things in the workspace that are no longer needed.

        /**
         * The modules that we need to add to the workspace.
         */
        const adds: string[] = news.filter((moduleName) => { return olds.indexOf(moduleName) < 0; });

        /**
         * The modules that we need to remove from the workspace.
         */
        const rmvs: string[] = olds.filter(function (moduleName) { return news.indexOf(moduleName) < 0; });

        // TODO: Optimize so that we don't keep loading `lib`.
        let addUnits: ModularUnit[] = adds.map(function (moduleName) { return { moduleName, URL: moduleResolutions[moduleName] }; });

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
            wsModel.removeModuleMapping(moduleName)
                .then(function (moduleURL) {
                    if (typeof moduleURL === 'string') {
                        wsModel.removeScript(moduleURL, (err) => {
                            if (!err) {
                                const index = olds.indexOf(moduleName);
                                if (index >= 0) {
                                    delete modulars[moduleName];
                                }
                                else {
                                    console.warn(`olds.indexOf(${moduleName}) returned ${index}`);
                                }
                            }
                            else {
                                console.warn(`removeScript(${moduleURL}) failed. ${err}`);
                            }
                        });
                    }
                    else {
                        console.warn(`removeModuleMapping(${moduleName}) did not return a mapped URL.`);
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
                            //
                            // d.ts file content is provided to the workspace with the path being the URL.
                            //
                            wsModel.ensureScript(addUnit.URL, content.replace(/\r\n?/g, '\n'), (err) => {
                                if (!err) {
                                    modulars[addUnit.moduleName] = addUnit.URL;
                                    //
                                    // This crucial step provides the mapping from the module name to the URL.
                                    //
                                    wsModel.ensureModuleMapping(addUnit.moduleName, addUnit.URL)
                                        .then(function (previousURL) {
                                            if (typeof previousURL === 'string') {
                                                console.warn(`ensureModuleMapping(${addUnit.moduleName},${addUnit.URL}) when ${addUnit.moduleName}is already mapped to ${previousURL}.`);
                                            }
                                        })
                                        .catch(function (err) {
                                            console.warn(`ensureModuleMapping(${addUnit.moduleName}) failed. ${err}`);
                                        });
                                }
                                else {
                                    console.warn(`ensureScript(${addUnit.URL}) failed. ${err}`);
                                }
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

function updateAmbients(
    wsModel: WsModel,
    optionManager: IOptionManager,
    /**
     * The old dependencies (global names).
     */
    ambients: AmbientResolutions,
    FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
    $http: IHttpService,
    $location: ILocationService,
    VENDOR_FOLDER_MARKER: string
): Promise<string[]> {
    return new Promise<string[]>(function (resolve, reject) {
        //
        // TODO: This needs revising now that we can change almost any part of the mapping.
        //

        /**
         * A mapping from globalName to d.ts URL.
         */
        const ambientResolutions = wsModel.getAmbientResolutions();

        // Load the wokspace with the appropriate TypeScript definitions.
        /**
         * The new ambient dependencies (global names).
         */
        const news: string[] = Object.keys(ambientResolutions);
        const olds: string[] = Object.keys(ambients);

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

        // The following is not essential, as `lib` is not an option, it's always there.
        // TODO: Dead code because dependency changes cause a page reload.
        // In future, dependency changes will not cause a page reload.
        if (rmvs.indexOf(FILENAME_TYPESCRIPT_CURRENT_LIB_DTS) >= 0) {
            // By removing it from the list, we will keep the 'lib' in the workspace and save an unload/load cycle.
            rmvs.splice(rmvs.indexOf(FILENAME_TYPESCRIPT_CURRENT_LIB_DTS), 1);
        }

        // TODO: Optimize so that we don't keep loading `lib`.
        let addUnits: AmbientUnit[] = adds.map(function (globalName) { return { globalName, URL: ambientResolutions[globalName] }; });

        // Ensure that the TypeScript ambient type definitions are present.
        if (olds.indexOf(FILENAME_TYPESCRIPT_CURRENT_LIB_DTS) < 0) {
            addUnits = addUnits.concat({ globalName: FILENAME_TYPESCRIPT_CURRENT_LIB_DTS, URL: FILENAME_TYPESCRIPT_CURRENT_LIB_DTS });
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

        rmvs.forEach((globalName) => {
            const ambientURL = ambients[globalName];
            if (typeof ambientURL === 'string') {
                wsModel.removeScript(ambientURL, (err) => {
                    if (!err) {
                        const index = olds.indexOf(ambientURL);
                        if (index >= 0) {
                            delete ambients[globalName];
                        }
                        else {
                            console.warn(`olds.indexOf(${ambientURL}) returned ${index}`);
                        }
                    }
                    else {
                        console.warn(`removeScript(${ambientURL}) failed. ${err}`);
                    }
                });
            }
            else {
                console.warn(`ambients['${globalName}'] did not return a mapped URL.`);
            }
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
                            wsModel.ensureScript(addUnit.URL, content.replace(/\r\n?/g, '\n'), (err) => {
                                if (!err) {
                                    ambients[addUnit.globalName] = addUnit.URL;
                                }
                                else {
                                    console.warn(`ensureScript(${addUnit.URL}) failed. ${err}`);
                                }
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
    optionManager: IOptionManager,
    ambients: AmbientResolutions,
    modulars: ModuleResolutions,
    FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
    $http: IHttpService,
    $location: ILocationService,
    VENDOR_FOLDER_MARKER: string,
    callback: (err?: any) => void
) {
    const doneAmbients = updateAmbients(wsModel, optionManager, ambients, FILENAME_TYPESCRIPT_CURRENT_LIB_DTS, $http, $location, VENDOR_FOLDER_MARKER);
    const doneModules = updateModules(wsModel, optionManager, modulars, $http, $location, VENDOR_FOLDER_MARKER);
    Promise.all([doneAmbients, doneModules])
        .then(() => {
            callback();
        })
        .catch((reason) => {
            callback(reason);
        });
}
