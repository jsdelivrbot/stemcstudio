import { IHttpService, ILocationService } from 'angular';
import closure from './closure';
import IOption from '../../services/options/IOption';
import { IOptionManager } from '../../services/options/IOptionManager';
import namesToOptions from './namesToOptions';
import scriptURL from './scriptURL';
import WsModel from '../../modules/wsmodel/WsModel';

interface Unit {
    /**
     * The package name is usedfor uniqueness.
     */
    packageName: string;
    /**
     * The module name ties the name used by JSPM to that used by the Language Service.
     */
    moduleName: string;
    /**
     * The vendor folder path or a full URL.
     * This is important because we want to fetch the contents.
     */
    dts: string;
}

function optionsToPackageNames(options: IOption[]): string[] {
    return options.map(function (option: IOption) { return option.packageName; });
}

/**
 * Computes the delta of files additions and removals and calls ensureScript or removeScript accordingly.
 * The additions require HTTP requests to fetch the file contents to be added.
 * This function does NOT trigger semantic validation.
 * Not worrying about callback right now - this will be re-written.
 */
export default function updateWorkspaceTypings(
    wsModel: WsModel,
    optionManager: IOptionManager,
    /**
     * The old dependencies (package names).
     */
    olds: string[],
    FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
    $http: IHttpService,
    $location: ILocationService,
    VENDOR_FOLDER_MARKER: string,
    callback: () => any
) {
    // Load the wokspace with the appropriate TypeScript definitions.
    /**
     * The new dependencies (package names).
     */
    const news: string[] = optionsToPackageNames(closure(namesToOptions(Object.keys(wsModel.dependencies), optionManager), optionManager));

    // Determine what we need to add and remove from the workspace.
    //
    // We must add what we need if it doesn't already exist in the workspace.
    // We must remove those things in the workspace that are no longer needed.
    /**
     * The things that we need to add to the workspace.
     */
    const adds: string[] = news.filter((dep) => { return olds.indexOf(dep) < 0; });
    /**
     * The things that we need to remove from the workspace.
     */
    const rmvs: string[] = olds.filter(function (dep) { return news.indexOf(dep) < 0; });

    // The following is not essential, as `lib` is not an option, it's always there.
    // TODO: Dead code because dependency changes cause a page reload.
    // In future, dependency changes will not cause a page reload.
    if (rmvs.indexOf('lib') >= 0) {
        // By removing it from the list, we will keep the 'lib' in the workspace and save an unload/load cycle.
        rmvs.splice(rmvs.indexOf('lib'), 1);
    }

    const rmvOpts: IOption[] = namesToOptions(rmvs, optionManager);

    const rmvUnits: Unit[] = rmvOpts.map(function (option) { return { packageName: option.packageName, moduleName: option.moduleName as string, dts: option.dts }; });

    const addOpts: IOption[] = namesToOptions(adds, optionManager);

    // TODO: Optimize so that we don't keep loading `lib`.
    let addUnits: Unit[] = addOpts.map(function (option) { return { packageName: option.packageName, moduleName: option.moduleName as string, dts: option.dts }; });

    // Ensure that the TypeScript ambient type definitions are present.
    if (olds.indexOf('lib') < 0) {
        addUnits = addUnits.concat({ packageName: 'lib', moduleName: FILENAME_TYPESCRIPT_CURRENT_LIB_DTS, dts: FILENAME_TYPESCRIPT_CURRENT_LIB_DTS });
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

    rmvUnits.forEach((rmvUnit) => {
        wsModel.removeScript(rmvUnit.dts, (err) => {
            if (!err) {
                const index = olds.indexOf(rmvUnit.packageName);
                if (index >= 0) {
                    olds.splice(index, 1);
                }
            }
            else {
                console.warn(`removeScript(${rmvUnit.dts}) failed. ${err}`);
            }
        });
        wsModel.removeModuleMapping(rmvUnit.moduleName);
    });

    // Make sure that the callback gets called, even when adding no files.
    // TODO: Optimize when there are no changes.
    const names = Object.keys(addUnits);
    const iLen = names.length;
    if (iLen > 0) {
        /**
         * Keeps track of all the asynchronous requests to read file contents.
         */
        let inFlightCount = 0;
        for (let i = 0; i < iLen; i++) {
            const name = names[i];
            const addUnit: Unit = addUnits[name];
            inFlightCount++;
            readFile(addUnit.dts, (err, content) => {
                if (!err) {
                    if (content) {
                        wsModel.ensureScript(addUnit.dts, content.replace(/\r\n?/g, '\n'), (err) => {
                            if (!err) {
                                olds.unshift(addUnit.packageName);
                            }
                            else {
                                console.warn(`ensureScript(${addUnit.dts}) failed. ${err}`);
                            }
                        });
                        wsModel.ensureModuleMapping(addUnit.moduleName, addUnit.dts);
                    }
                }
                inFlightCount--;
                if (0 === inFlightCount) {
                    callback();
                }
            });
        }
    }
    else {
        callback();
    }
}
