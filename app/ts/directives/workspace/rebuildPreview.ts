import { ILocationService, IWindowService } from 'angular';
import { bubbleIframeMouseMove } from './bubbleIframeMouseMove';
import { closure } from './closure';
import { csvTypeFromContent } from './csvTypeFromContent';
import { fileContent } from './fileContent';
import { fileExists } from './fileExists';
import { isLanguageServiceScript } from '../../utils/isLanguageServiceScript';
import { isString } from '../../utils/isString';
import { IOption, isGlobalOrUMDLibrary, isModularOrUMDLibrary } from '../../services/options/IOption';
import { IOptionManager } from '../../services/options/IOptionManager';
import { currentJavaScript } from './currentJavaScript';
import { detect1x } from './detect1x';
import { detectMarker } from './detectMarker';
import { LANGUAGE_CSV } from '../../languages/modes';
import { LANGUAGE_GLSL } from '../../languages/modes';
import { LANGUAGE_SCHEME } from '../../languages/modes';
import { replaceMarker } from './replaceMarker';
import { scriptURL } from './scriptURL';
import { schemeTypeFromContent } from './schemeTypeFromContent';
import { shaderTypeFromContent } from './shaderTypeFromContent';
import { WorkspaceScope } from '../../scopes/WorkspaceScope';
import { JsModel } from '../../modules/jsmodel/JsModel';
import { WsModel } from '../../modules/wsmodel/WsModel';
import mathscript from 'davinci-mathscript';
import { CODE_MARKER, CSV_FILES_MARKER, SCHEMES_MARKER, SCRIPTS_MARKER, SHADERS_MARKER, STYLE_MARKER, SYSTEM_SHIM_MARKER } from '../../features/preview/index';

const NEWLINE = '\n';

const SYSTEM_CONFIG_JS = 'system.config.js';
const SYSTEM_CONFIG_JSON = 'system.config.json';

/**
 * Synthesize the argument object to System.config for libraries that should be loaded as modules.
 * Before upgrading to SystemJS 0.20.x, run 0.19.x and fix warnings.
 */
function systemConfigArg(closureOpts: IOption[], vendorFolderMarker: string): SystemJsConfigArg {
    // Build the System.config for libraries that should be loaded as modules.
    // Before upgrading to SystemJS 0.20.x, run 0.19.x and fix warnings.
    const config: SystemJsConfigArg = {
        warnings: false
    };
    const importModules = closureOpts.filter(isModularOrUMDLibrary);
    config.map = {};
    for (const importModule of importModules) {
        const moduleName = importModule.moduleName;
        if (typeof moduleName === 'string') {
            // Using the un-minified version because of issue with react.
            const fileNames = importModule.js;
            for (const fileName of fileNames) {
                // Be sure to use moduleName, not packageName here.
                config.map[moduleName] = fileName.replace(vendorFolderMarker, './vendor');
            }
        }
    }
    return config;
}

/**
 * The argument to a System.config() call.
 */
interface SystemJsConfigArg {
    /**
     * A mapping from the module name to the URL of the JavaScript library.
     */
    map?: { [moduleName: string]: string };
    /**
     * https://github.com/systemjs/systemjs/issues/812
     * An alternative is `System.defaultJSExtensions = true`.
     */
    packages?: { [folder: string]: { defaultExtension?: string } };
    /**
     * Use to discover deprecation warnings.
     */
    warnings?: boolean;
}

export function rebuildPreview(
    wsModel: WsModel,
    jsModel: JsModel,
    optionManager: IOptionManager,
    $scope: WorkspaceScope,
    $location: ILocationService,
    $window: IWindowService,
    FILENAME_CODE: string,
    FILENAME_LESS: string,
    FILENAME_LIBS: string,
    FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS: string,
    LIBS_MARKER: string,
    STYLES_MARKER: string,
    VENDOR_FOLDER_MARKER: string
): void {
    // Synchronize the JavaScript model (transpile status) with the workspace (source) model.
    jsModel.watchFiles(wsModel.getFileSessionPaths().filter(isLanguageServiceScript));
    // If any Language Service source files have changed but not yet transpiled, initiate a refresh of the output files.
    const dirtyFiles = jsModel.dirtyFiles();
    if (dirtyFiles.length > 0) {
        // We could put up a spinner here instead of presenting a dirty file.
        // Experiment with returning to see if it improves apparent performance.
        console.log(`Changed files detected ${JSON.stringify(dirtyFiles)}.`);
        for (const dirtyFile of dirtyFiles) {
            wsModel.outputFilesForPath(dirtyFile);
        }
        return;
    }
    else {
        console.log("All files transpiled.");
    }

    /**
     * The domain on which we are running. e.g., `https://www.stemcstudio.com` or `localhost:8080`.
     * We determine the domain dynamically in order to access files in known locations on our server.
     * Current usage is for JavaScript files, TypeScript d.ts files, and paths to gists.
     * TODO: JavaScript and TypeScript to come from external repos.
     */
    const FWD_SLASH = '/';
    const DOMAIN = $location.protocol() + ':' + FWD_SLASH + FWD_SLASH + $location.host() + ":" + $location.port();
    try {
        // Kill any existing frames.
        $scope.previewIFrame = undefined;
        const elementId = 'output';
        const preview = $window.document.getElementById(elementId);
        if (preview) {
            while (preview.children.length > 0) {
                if (preview.firstChild) {
                    preview.removeChild(preview.firstChild);
                }
            }
            if (wsModel && !wsModel.isZombie()) {
                /**
                 * The HTML file that will be used for insertion.
                 */
                const bestFile = wsModel.getHtmlFileChoiceOrBestAvailable();
                if (bestFile && $scope.isViewVisible) {

                    $scope.previewIFrame = document.createElement('iframe');
                    // Let's not change any more styles than we have to. 
                    $scope.previewIFrame.style.width = '100%';
                    $scope.previewIFrame.style.height = '100%';
                    $scope.previewIFrame.style.border = '0';
                    $scope.previewIFrame.style.backgroundColor = '#ffffff';

                    preview.appendChild($scope.previewIFrame);

                    const content: Document = $scope.previewIFrame.contentDocument || $scope.previewIFrame.contentWindow.document;

                    /**
                     * The string that becomes the content of the IFrame's HTML file.
                     */
                    let html = fileContent(bestFile, wsModel);
                    if (isString(html)) {

                        const selOpts: IOption[] = optionManager.filter((option: IOption, index: number, array: IOption[]) => {
                            return wsModel.getPackageDependencies().hasOwnProperty(option.packageName);
                        });

                        const closureOpts: IOption[] = closure(selOpts, optionManager);

                        const chosenCssFileNames: string[] = closureOpts.map(function (option: IOption) { return option.css; }).reduce(function (previousValue, currentValue) { return previousValue.concat(currentValue); }, []);
                        const stylesTags = chosenCssFileNames.map((fileName: string) => {
                            return `<link rel='stylesheet' href='${scriptURL(DOMAIN, fileName, VENDOR_FOLDER_MARKER)}'></link>${NEWLINE}`;
                        });

                        if (detectMarker(STYLES_MARKER, wsModel, bestFile)) {
                            html = html.replace(STYLES_MARKER, stylesTags.join(""));
                        }
                        else {
                            if (stylesTags.length > 0) {
                                console.warn(`Unable to find '${STYLES_MARKER}' in ${bestFile} file.`);
                            }
                        }

                        /**
                         * Libraries that are Global must be included using <script> tags.
                         * TODO: While transitioning to UMD and Modular from Global we load UMD both ways (<script> and System).
                         */
                        const globalJsFileNames: string[] = closureOpts.filter(isGlobalOrUMDLibrary).map(function (option: IOption) { return option.minJs; }).reduce(function (previousValue, currentValue) { return previousValue.concat(currentValue); }, []);
                        // TODO: We will later want to make operator overloading configurable for speed.

                        const scriptFileNames: string[] = wsModel.isOperatorOverloadingEnabled() ? globalJsFileNames.concat(FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS) : globalJsFileNames;
                        // TOOD: Don't fix the location of the JavaScript here.
                        const scriptTags = scriptFileNames.map((fileName: string) => {
                            return `<script src='${scriptURL(DOMAIN, fileName, VENDOR_FOLDER_MARKER)}'></script>${NEWLINE}`;
                        });

                        if (detectMarker(SCRIPTS_MARKER, wsModel, bestFile)) {
                            html = html.replace(SCRIPTS_MARKER, scriptTags.join(""));
                        }
                        else {
                            if (scriptTags.length > 0) {
                                console.warn(`Unable to find '${SCRIPTS_MARKER}' in ${bestFile} file.`);
                            }
                        }
                        if (detectMarker(SYSTEM_SHIM_MARKER, wsModel, bestFile)) {
                            const systemJsUrl = 'https://unpkg.com/systemjs@0.19.34/dist/system.src.js';
                            html = html.replace(SYSTEM_SHIM_MARKER, `<script src='${systemJsUrl}'></script>`);
                        }
                        // The following line may be omitted when System is natively supported in browsers.
                        else {
                            console.warn(`Unable to find '${SYSTEM_SHIM_MARKER}' in ${bestFile} file.`);
                        }

                        html = replaceMarker(CSV_FILES_MARKER, LANGUAGE_CSV, csvTypeFromContent, html, wsModel, bestFile);
                        html = replaceMarker(SHADERS_MARKER, LANGUAGE_GLSL, shaderTypeFromContent, html, wsModel, bestFile);
                        html = replaceMarker(SCHEMES_MARKER, LANGUAGE_SCHEME, schemeTypeFromContent, html, wsModel, bestFile);

                        // TODO: It would be nice to have a more flexible way to define stylesheet imports.
                        // TODO: We should then be able to move away from symbolic constants for the stylesheet file name.
                        if (fileExists('style.css', wsModel)) {
                            if (detectMarker(STYLE_MARKER, wsModel, bestFile)) {
                                html = html.replace(STYLE_MARKER, [fileContent('style.css', wsModel)].join(""));
                            }
                            else {
                                console.warn(`Unable to find '${STYLE_MARKER}' in ${bestFile} file.`);
                            }
                        }
                        else if (fileExists(FILENAME_LESS, wsModel)) {
                            if (detectMarker(STYLE_MARKER, wsModel, bestFile)) {
                                html = html.replace(STYLE_MARKER, [fileContent(FILENAME_LESS, wsModel)].join(""));
                            }
                            else {
                                console.warn(`Unable to find '${STYLE_MARKER}' in ${bestFile} file.`);
                            }
                        }

                        if (detect1x(wsModel)) {
                            // code is for backwards compatibility only, now that we support ES6 modules.
                            console.warn("Support for programs not using ES6 modules is deprecated. Please convert your program to use ES6 module loading.");
                            html = html.replace(LIBS_MARKER, currentJavaScript(FILENAME_LIBS, wsModel));
                            html = html.replace(CODE_MARKER, currentJavaScript(FILENAME_CODE, wsModel));
                            // For backwards compatibility (less than 1.x) ...
                            html = html.replace('<!-- STYLE-MARKER -->', ['<style>', fileContent(FILENAME_LESS, wsModel), '</style>'].join(""));
                            html = html.replace('<!-- CODE-MARKER -->', currentJavaScript(FILENAME_CODE, wsModel));
                        }
                        else if (detectMarker(CODE_MARKER, wsModel, bestFile)) {
                            const modulesJs: string[] = [];
                            const paths: string[] = Object.keys(wsModel.lastKnownJs);
                            for (const path of paths) {
                                const moduleJs = wsModel.lastKnownJs[path];
                                try {
                                    const options: mathscript.TranspileOptions = {
                                        timeout: 1000,
                                        noLoopCheck: wsModel.noLoopCheck,
                                        operatorOverloading: wsModel.isOperatorOverloadingEnabled()
                                    };
                                    /**
                                     * The JavaScript code with operators replaced by function calls and infinite loop detection.
                                     */
                                    const moduleMs = mathscript.transpile(moduleJs, options);
                                    modulesJs.push(moduleMs);
                                }
                                catch (e) {
                                    console.warn(`Error applying operator overloading: ${e}`);
                                }
                            }

                            /**
                             * The "System.config({...})" string.
                             * The presence of a jspm.config.js file overrides the synthesis of the argument object.
                             * In time we will deprecate the sythesis approach in favor of explicit specification
                             * through the jspm.config.js file as this opens up the use of external modules.
                             */
                            const systemJsConfig = fileExists(SYSTEM_CONFIG_JS, wsModel) ?
                                fileContent(SYSTEM_CONFIG_JS, wsModel) as string :
                                fileExists(SYSTEM_CONFIG_JSON, wsModel) ?
                                    `System.config(${fileContent(SYSTEM_CONFIG_JSON, wsModel) as string});${NEWLINE}` :
                                    `System.config(${JSON.stringify(systemConfigArg(closureOpts, VENDOR_FOLDER_MARKER), null, 2)});${NEWLINE}`;

                            html = html.replace(CODE_MARKER, modulesJs.join(NEWLINE).concat(NEWLINE).concat(systemJsConfig));
                        }
                        else {
                            console.warn(`Unable to find '${CODE_MARKER}' in index.html file.`);
                        }

                        content.open();
                        content.write(html);
                        content.close();

                        bubbleIframeMouseMove($scope.previewIFrame);
                    }
                    else {
                        console.warn(`bestFile => ${bestFile}`);
                    }
                }
            }
        }
        else {
            // can happen if we use ng-if to kill the element entirely, which we do.
        }
    }
    catch (e) {
        console.warn(e);
    }
}
