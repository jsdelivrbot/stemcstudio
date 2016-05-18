import * as angular from 'angular';
import closure from './closure';
import Doodle from '../../services/doodles/Doodle';
import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';
import namesToOptions from './namesToOptions';
import scriptURL from './scriptURL';
import Workspace from '../../services/workspace/Workspace';

function optionsToNames(options: IOption[]): string[] {
    return options.map(function(option: IOption) { return option.name; });
}

export default function updateWorkspace(
    workspace: Workspace,
    doodle: Doodle,
    options: IOptionManager,
    olds: string[],
    FILENAME_TYPESCRIPT_CURRENT_LIB_DTS: string,
    $http: angular.IHttpService,
    $location: angular.ILocationService,
    VENDOR_FOLDER_MARKER: string
) {
    // Load the wokspace with the appropriate TypeScript definitions.
    const news: string[] = optionsToNames(closure(namesToOptions(doodle.dependencies, options), options));

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
    const rmvs: string[] = olds.filter(function(dep) { return news.indexOf(dep) < 0; });

    // The following is not essential, as `lib` is not an option, it's always there.
    // TODO: Dead code because dependency changes cause a page reload.
    // In future, dependency changes will not cause a page reload.
    if (rmvs.indexOf('lib') >= 0) {
        // By removing it from the list, we will keep the 'lib' in the workspace and save an unload/load cycle.
        rmvs.splice(rmvs.indexOf('lib'), 1);
    }

    const rmvOpts: IOption[] = namesToOptions(rmvs, options);

    const rmvUnits: { name: string; fileName: string }[] = rmvOpts.map(function(option) { return { name: option.name, fileName: option.dts }; });

    const addOpts: IOption[] = namesToOptions(adds, options);

    // TODO: Optimize so that we don't keep loading `lib`.
    let addUnits: { name: string; fileName: string }[] = addOpts.map(function(option) { return { name: option.name, fileName: option.dts }; });

    // Ensure that the TypeScript ambient type definitions are present.
    if (olds.indexOf('lib') < 0) {
        addUnits = addUnits.concat({ name: 'lib', fileName: FILENAME_TYPESCRIPT_CURRENT_LIB_DTS });
    }

    /**
     * The domain on which we are running. e.g., `https://www.stemcstudio.com` or `localhost:8080`.
     * We determine this dynamically in order to access files in known locations on our server.
     * Current usage is for JavaScript files, TypeScript d.ts files, and paths to gists.
     * TODO: JavaScript and TypeScript to come from external repos.
     */
    const FWD_SLASH = '/';
    const DOMAIN = $location.protocol() + ':' + FWD_SLASH + FWD_SLASH + $location.host() + ":" + $location.port();

    const readFile = (fileName: string, callback: (err, data?) => void) => {
        const url = scriptURL(DOMAIN, fileName, VENDOR_FOLDER_MARKER);
        $http.get(url)
            .success(function(data, status: number, headers, config) {
                callback(null, data);
            })
            .error(function(data, status: number, headers, config) {
                callback(new Error("Unable to wrangle #{fileName}."));
            });
    };

    rmvUnits.forEach((rmvUnit) => {
        workspace.removeScript(rmvUnit.fileName);
        olds.splice(olds.indexOf(rmvUnit.name), 1);
    });

    addUnits.forEach((addUnit) => {
        readFile(addUnit.fileName, (err, content) => {
            if (!err) {
                workspace.ensureScript(addUnit.fileName, content.replace(/\r\n?/g, '\n'));
                olds.unshift(addUnit.name);
            }
        });
    });
}
