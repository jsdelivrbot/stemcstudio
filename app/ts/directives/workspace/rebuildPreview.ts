import * as angular from 'angular';
import bubbleIframeMouseMove from './bubbleIframeMouseMove';
import closure from './closure';
import fileContent from './fileContent';
import fileExists from './fileExists';
import isString from '../../utils/isString';
import IOption from '../../services/options/IOption';
import IOptionManager from '../../services/options/IOptionManager';
import currentJavaScript from './currentJavaScript';
import detect1x from './detect1x';
import Doodle from '../../services/doodles/Doodle';
import scriptURL from './scriptURL';
import WorkspaceScope from '../../scopes/WorkspaceScope';
import mathscript from 'davinci-mathscript';

export default function rebuildPreview(
    doodle: Doodle,
    options: IOptionManager,
    $scope: WorkspaceScope,
    $location: angular.ILocationService,
    $window: angular.IWindowService,
    CODE_MARKER: string,
    FILENAME_CODE: string,
    FILENAME_LESS: string,
    FILENAME_LIBS: string,
    FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS: string,
    LIBS_MARKER: string,
    SCRIPTS_MARKER: string,
    STYLE_MARKER: string,
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
            if (doodle) {
                const bestFile: string = doodle.getPreviewFileOrBestAvailable();
                if (bestFile && $scope.isViewVisible) {

                    $scope.previewIFrame = document.createElement('iframe');
                    // Let's not change any more styles than we have to. 
                    $scope.previewIFrame.style.width = '100%';
                    $scope.previewIFrame.style.height = '100%';
                    $scope.previewIFrame.style.border = '0';
                    $scope.previewIFrame.style.backgroundColor = '#ffffff';

                    preview.appendChild($scope.previewIFrame);

                    const content: Document = $scope.previewIFrame.contentDocument || $scope.previewIFrame.contentWindow.document;

                    let html: string = fileContent(bestFile, doodle);
                    if (isString(html)) {

                        const selOpts: IOption[] = options.filter((option: IOption, index: number, array: IOption[]) => {
                            return doodle.dependencies.indexOf(option.name) > -1;
                        });

                        const closureOpts: IOption[] = closure(selOpts, options);

                        const chosenCssFileNames: string[] = closureOpts.map(function(option: IOption) { return option.css; }).reduce(function(previousValue, currentValue) { return previousValue.concat(currentValue); }, []);
                        const stylesTags = chosenCssFileNames.map((fileName: string) => {
                            return "<link rel='stylesheet' href='" + scriptURL(DOMAIN, fileName, VENDOR_FOLDER_MARKER) + "'></link>\n";
                        });
                        html = html.replace(STYLES_MARKER, stylesTags.join(""));

                        const chosenJsFileNames: string[] = closureOpts.map(function(option: IOption) { return option.minJs; }).reduce(function(previousValue, currentValue) { return previousValue.concat(currentValue); }, []);
                        // TODO: We will later want to make operator overloading configurable for speed.

                        const scriptFileNames: string[] = doodle.operatorOverloading ? chosenJsFileNames.concat(FILENAME_MATHSCRIPT_CURRENT_LIB_MIN_JS) : chosenJsFileNames;
                        // TOOD: Don't fix the location of the JavaScript here.
                        const scriptTags = scriptFileNames.map((fileName: string) => {
                            return "<script src='" + scriptURL(DOMAIN, fileName, VENDOR_FOLDER_MARKER) + "'></script>\n";
                        });

                        html = html.replace(SCRIPTS_MARKER, scriptTags.join(""));

                        // TODO: It would be nice to have a more flexible way to define stylesheet imports.
                        // TODO: We should then be able to move away from symbolic constants for the stylesheet file name.
                        if (fileExists('style.css', doodle)) {
                            html = html.replace(STYLE_MARKER, [fileContent('style.css', doodle)].join(""));
                        }
                        else if (fileExists(FILENAME_LESS, doodle)) {
                            html = html.replace(STYLE_MARKER, [fileContent(FILENAME_LESS, doodle)].join(""));
                        }

                        if (detect1x(doodle)) {
                            // code is for backwards compatibility only, now that we support ES6 modules.
                            console.warn("Support for programs not using ES6 modules is deprecated. Please convert your program to use ES6 module loading.");
                            html = html.replace(LIBS_MARKER, currentJavaScript(FILENAME_LIBS, doodle));
                            html = html.replace(CODE_MARKER, currentJavaScript(FILENAME_CODE, doodle));
                            // For backwards compatibility (less than 1.x) ...
                            html = html.replace('<!-- STYLE-MARKER -->', ['<style>', fileContent(FILENAME_LESS, doodle), '</style>'].join(""));
                            html = html.replace('<!-- CODE-MARKER -->', currentJavaScript(FILENAME_CODE, doodle));
                        }
                        else {
                            const modulesJs: string[] = [];
                            const names: string[] = Object.keys(doodle.lastKnownJs);
                            const iLen: number = names.length;
                            for (let i = 0; i < iLen; i++) {
                                const name = names[i];
                                const moduleJs = doodle.lastKnownJs[name];
                                const moduleMs = doodle.operatorOverloading ? mathscript.transpile(moduleJs) : moduleJs;
                                modulesJs.push(moduleMs);
                            }
                            html = html.replace(CODE_MARKER, modulesJs.join('\n'));
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
