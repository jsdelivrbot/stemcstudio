import * as angular from 'angular';
import bubbleIframeMouseMove from './bubbleIframeMouseMove';
import closure from './closure';
import csvTypeFromContent from './csvTypeFromContent';
import fileContent from './fileContent';
import fileExists from './fileExists';
import isString from '../../utils/isString';
import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';
import currentJavaScript from './currentJavaScript';
import detect1x from './detect1x';
import detectMarker from './detectMarker';
import { LANGUAGE_CSV } from '../../languages/modes';
import { LANGUAGE_GLSL } from '../../languages/modes';
import { LANGUAGE_SCHEME } from '../../languages/modes';
import replaceMarker from './replaceMarker';
import scriptURL from './scriptURL';
import schemeTypeFromContent from './schemeTypeFromContent';
import shaderTypeFromContent from './shaderTypeFromContent';
import WorkspaceScope from '../../scopes/WorkspaceScope';
import WsModel from '../../wsmodel/services/WsModel';
import mathscript from 'davinci-mathscript';
import { CODE_MARKER, CSV_FILES_MARKER, SCHEMES_MARKER, SCRIPTS_MARKER, SHADERS_MARKER, STYLE_MARKER } from '../../features/preview/index';

export default function rebuildPreview(
    workspace: WsModel,
    options: IOptionManager,
    $scope: WorkspaceScope,
    $location: angular.ILocationService,
    $window: angular.IWindowService,
    FILENAME_CODE: string,
    FILENAME_LESS: string,
    FILENAME_LIBS: string,
    FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS: string,
    LIBS_MARKER: string,
    STYLES_MARKER: string,
    VENDOR_FOLDER_MARKER: string
) {
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
                preview.removeChild(preview.firstChild);
            }
            if (workspace && !workspace.isZombie()) {
                /**
                 * The HTML file that will be used for insertion.
                 */
                const bestFile: string = workspace.getHtmlFileChoiceOrBestAvailable();
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
                    let html: string = fileContent(bestFile, workspace);
                    if (isString(html)) {

                        const selOpts: IOption[] = options.filter((option: IOption, index: number, array: IOption[]) => {
                            return workspace.dependencies.indexOf(option.name) > -1;
                        });

                        const closureOpts: IOption[] = closure(selOpts, options);

                        const chosenCssFileNames: string[] = closureOpts.map(function (option: IOption) { return option.css; }).reduce(function (previousValue, currentValue) { return previousValue.concat(currentValue); }, []);
                        const stylesTags = chosenCssFileNames.map((fileName: string) => {
                            return "<link rel='stylesheet' href='" + scriptURL(DOMAIN, fileName, VENDOR_FOLDER_MARKER) + "'></link>\n";
                        });

                        if (detectMarker(STYLES_MARKER, workspace, bestFile)) {
                            html = html.replace(STYLES_MARKER, stylesTags.join(""));
                        }
                        else {
                            if (stylesTags.length > 0) {
                                console.warn(`Unable to find '${STYLES_MARKER}' in ${bestFile} file.`);
                            }
                        }

                        const chosenJsFileNames: string[] = closureOpts.map(function (option: IOption) { return option.minJs; }).reduce(function (previousValue, currentValue) { return previousValue.concat(currentValue); }, []);
                        // TODO: We will later want to make operator overloading configurable for speed.

                        const scriptFileNames: string[] = workspace.operatorOverloading ? chosenJsFileNames.concat(FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS) : chosenJsFileNames;
                        // TOOD: Don't fix the location of the JavaScript here.
                        const scriptTags = scriptFileNames.map((fileName: string) => {
                            return `<script src='${scriptURL(DOMAIN, fileName, VENDOR_FOLDER_MARKER)}'></script>\n`;
                        });

                        if (detectMarker(SCRIPTS_MARKER, workspace, bestFile)) {
                            html = html.replace(SCRIPTS_MARKER, scriptTags.join(""));
                        }
                        else {
                            if (scriptTags.length > 0) {
                                console.warn(`Unable to find '${SCRIPTS_MARKER}' in ${bestFile} file.`);
                            }
                        }

                        html = replaceMarker(CSV_FILES_MARKER, LANGUAGE_CSV, csvTypeFromContent, html, workspace, bestFile);
                        html = replaceMarker(SHADERS_MARKER, LANGUAGE_GLSL, shaderTypeFromContent, html, workspace, bestFile);
                        html = replaceMarker(SCHEMES_MARKER, LANGUAGE_SCHEME, schemeTypeFromContent, html, workspace, bestFile);

                        // TODO: It would be nice to have a more flexible way to define stylesheet imports.
                        // TODO: We should then be able to move away from symbolic constants for the stylesheet file name.
                        if (fileExists('style.css', workspace)) {
                            if (detectMarker(STYLE_MARKER, workspace, bestFile)) {
                                html = html.replace(STYLE_MARKER, [fileContent('style.css', workspace)].join(""));
                            }
                            else {
                                console.warn(`Unable to find '${STYLE_MARKER}' in ${bestFile} file.`);
                            }
                        }
                        else if (fileExists(FILENAME_LESS, workspace)) {
                            if (detectMarker(STYLE_MARKER, workspace, bestFile)) {
                                html = html.replace(STYLE_MARKER, [fileContent(FILENAME_LESS, workspace)].join(""));
                            }
                            else {
                                console.warn(`Unable to find '${STYLE_MARKER}' in ${bestFile} file.`);
                            }
                        }

                        if (detect1x(workspace)) {
                            // code is for backwards compatibility only, now that we support ES6 modules.
                            console.warn("Support for programs not using ES6 modules is deprecated. Please convert your program to use ES6 module loading.");
                            html = html.replace(LIBS_MARKER, currentJavaScript(FILENAME_LIBS, workspace));
                            html = html.replace(CODE_MARKER, currentJavaScript(FILENAME_CODE, workspace));
                            // For backwards compatibility (less than 1.x) ...
                            html = html.replace('<!-- STYLE-MARKER -->', ['<style>', fileContent(FILENAME_LESS, workspace), '</style>'].join(""));
                            html = html.replace('<!-- CODE-MARKER -->', currentJavaScript(FILENAME_CODE, workspace));
                        }
                        else if (detectMarker(CODE_MARKER, workspace, bestFile)) {
                            const modulesJs: string[] = [];
                            const names: string[] = Object.keys(workspace.lastKnownJs);
                            const iLen: number = names.length;
                            for (let i = 0; i < iLen; i++) {
                                const name = names[i];
                                const moduleJs = workspace.lastKnownJs[name];
                                try {
                                    const moduleMs = workspace.operatorOverloading ? mathscript.transpile(moduleJs) : moduleJs;
                                    modulesJs.push(moduleMs);
                                }
                                catch (e) {
                                    console.warn(`Error applying operator overloading: ${e}`);
                                }
                            }
                            html = html.replace(CODE_MARKER, modulesJs.join('\n'));
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
