import * as ng from 'angular';
import HtmlMode from '../../editor/mode/HtmlMode';
import JavaScriptMode from '../../editor/mode/JavaScriptMode';
import JsonMode from '../../editor/mode/JsonMode';
import PythonMode from '../../editor/mode/PythonMode';
import TextMode from '../../editor/mode/TextMode';
import TypeScriptMode from '../../editor/mode/TypeScriptMode';
import createCssMode from '../../editor/mode/createCssMode';
import createMarkdownMode from '../../editor/mode/createMarkdownMode';
import EditSession from '../../editor/EditSession';
import Renderer from '../../editor/Renderer';
import UndoManager from '../../editor/UndoManager';
import Editor from '../../editor/Editor';
import EditorScope from './EditorScope';
import ISettingsService from '../../services/settings/ISettingsService';
import ITextService from '../../services/text/ITextService';
import ThemeManager from '../../services/themes/ThemeManager';
import ThemeManagerEvent from '../../services/themes/ThemeManagerEvent';
import {currentTheme} from '../../services/themes/ThemeManagerEvent';
import WorkspaceMixin from '../../directives/editor/WorkspaceMixin';
import {LANGUAGE_CSS} from '../../languages/modes';
import {LANGUAGE_HTML} from '../../languages/modes';
import {LANGUAGE_JSON} from '../../languages/modes';
import {LANGUAGE_JAVA_SCRIPT} from '../../languages/modes';
import {LANGUAGE_LESS} from '../../languages/modes';
import {LANGUAGE_MARKDOWN} from '../../languages/modes';
import {LANGUAGE_PYTHON} from '../../languages/modes';
import {LANGUAGE_TYPE_SCRIPT} from '../../languages/modes';
import {LANGUAGE_TEXT} from '../../languages/modes';

/**
 * Factory for the editor (attribute) directive.
 * This directive turns an HTMLElement into a container for an Editor.
 * The EditSession for the Editor is injected using the ng-model directive.
 * 
 * When changing the parameters to this function, be sure to update the $inject property.
 */
function factory(
    $timeout: ng.ITimeoutService,
    settings: ISettingsService,
    textService: ITextService,
    themeManager: ThemeManager): ng.IDirective {

    /**
     * @param $scope Used to monitor $onDestroy and support transclude.
     * @param element
     * @param attrs
     * @param controllers
     * @param transclude This parameter will only be set if we set the transclude option to true.
     */
    function link($scope: EditorScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: {}, transclude: ng.ITranscludeFunction) {

        // Maybe these should be constants?
        const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js'];
        const workerImports: string[] = systemImports.concat(['/js/ace-workers.js']);

        const ngModel: ng.INgModelController = controllers[0];
        const workspace: WorkspaceMixin = controllers[1];

        const container: HTMLElement = element[0];
        // Experiment with creating an Editor without an EditSession, which is injected later.
        const renderer: Renderer = new Renderer(container);
        const editor: Editor = new Editor(renderer, void 0);

        const themeEventHandler = function(event: ThemeManagerEvent) {
            editor.setThemeCss(event.cssClass, event.href);
            editor.setThemeDark(event.isDark);
        };
        // This event listener gets removed in onDestroyScope
        themeManager.addEventListener(currentTheme, themeEventHandler);

        // Set properties that pertain to rendering.
        // Don't set session attributes here!
        editor.setThemeDark(true);
        editor.setPadding(4);
        editor.setShowInvisibles(settings.showInvisibles);
        editor.setFontSize(settings.fontSize);
        editor.setShowPrintMargin(settings.showPrintMargin);

        attrs.$observe<boolean>('readonly', function(readOnly: boolean) {
            editor.setReadOnly(readOnly);
        });

        // formatters update the viewValue from the modelValue
        ngModel.$formatters.push(function(modelValue: string) {
            if (ng.isUndefined(modelValue) || modelValue === null) {
                return void 0;
            }
            // We are returning the viewValue. We could make an object literal here.
            // It should then match other usages of $viewValue.
            // We keep it simple by simply returning the string.
            return modelValue;
        });

        // parsers update the modelValue from the viewValue
        // This is how it is done prior to AngularJs 1.3
        ngModel.$parsers.push(function(viewValue: string) {
            ngModel.$setValidity('yadda', true);
            return viewValue;
        });

        // In Angular 1.3+ we have the $validators pipeline.
        // We don't need to set validation states because we have an object, not an array.
        ngModel.$validators['foo'] = function(modelValue: string, viewValue: string): boolean {
            return true;
        };

        // The basic idea here is to set the $render callback function that will be used to take
        // the model value and use it to update the view (editor).
        ngModel.$render = function() {
            const editSession: EditSession = ngModel.$viewValue;
            if (editSession instanceof EditSession) {
                editor.setSession(editSession);
                const undoManager = new UndoManager();
                editSession.setUndoManager(undoManager);
                editSession.setTabSize(2);
                editSession.setUseSoftTabs(true);
                // Setting displayIndentGuides requires an editSession.
                editor.setDisplayIndentGuides(settings.displayIndentGuides);
                // We must wait for the $render function to be called so that we have a session.
                switch ($scope.mode) {
                    case LANGUAGE_PYTHON: {
                        editSession.setUseWorker(false);
                        editSession.setLanguageMode(new PythonMode('/js/worker.js', workerImports), function(err: any) {
                            if (err) {
                                console.warn(`${$scope.mode} => ${err}`);
                            }
                            workspace.attachEditor($scope.id, $scope.mode, editor);
                        });
                        break;
                    }
                    case LANGUAGE_JAVA_SCRIPT: {
                        editSession.setLanguageMode(new JavaScriptMode('/js/worker.js', workerImports), function(err: any) {
                            if (err) {
                                console.warn(`${$scope.mode} => ${err}`);
                            }
                            workspace.attachEditor($scope.id, $scope.mode, editor);
                        });
                        break;
                    }
                    case LANGUAGE_TYPE_SCRIPT: {
                        editSession.setLanguageMode(new TypeScriptMode('/js/worker.js', workerImports), function(err: any) {
                            if (err) {
                                console.warn(`${$scope.mode} => ${err}`);
                            }
                            workspace.attachEditor($scope.id, $scope.mode, editor);
                        });
                        break;
                    }
                    case LANGUAGE_HTML: {
                        editSession.setLanguageMode(new HtmlMode('/js/worker.js', workerImports), function(err: any) {
                            if (err) {
                                console.warn(`${$scope.mode} => ${err}`);
                            }
                            workspace.attachEditor($scope.id, $scope.mode, editor);
                        });
                        break;
                    }
                    case LANGUAGE_JSON: {
                        editSession.setLanguageMode(new JsonMode('/js/worker.js', workerImports), function(err: any) {
                            if (err) {
                                console.warn(`${$scope.mode} => ${err}`);
                            }
                            workspace.attachEditor($scope.id, $scope.mode, editor);
                        });
                        break;
                    }
                    case LANGUAGE_CSS:
                    case LANGUAGE_LESS: {
                        // If we don't use the worker then we don't get a confirmation.
                        editSession.setUseWorker(false);
                        editSession.setLanguageMode(createCssMode('/js/worker.js', workerImports), function(err: any) {
                            if (err) {
                                console.warn(`${$scope.mode} => ${err}`);
                            }
                            workspace.attachEditor($scope.id, $scope.mode, editor);
                        });
                        break;
                    }
                    case LANGUAGE_MARKDOWN: {
                        editSession.setUseWrapMode(true);
                        editor.setWrapBehavioursEnabled(true);
                        editSession.setLanguageMode(createMarkdownMode('/js/worker.js', workerImports), function(err: any) {
                            if (err) {
                                console.warn(`${$scope.mode} => ${err}`);
                            }
                            workspace.attachEditor($scope.id, $scope.mode, editor);
                        });
                        break;
                    }
                    case LANGUAGE_TEXT: {
                        editSession.setLanguageMode(new TextMode('/js/worker.js', workerImports), function(err: any) {
                            if (err) {
                                console.warn(`${$scope.mode} => ${err}`);
                            }
                            workspace.attachEditor($scope.id, $scope.mode, editor);
                        });
                        break;
                    }
                    default: {
                        console.warn(`Unrecognized mode => ${$scope.mode}`);
                    }
                }
            }
            else {
                console.warn(`$render: ng-model (ngModel.$viewValue) must be an EditSession.`);
            }
            $timeout(function() {
                resizeEditor();
                // The resize event appears to happen AFTER a session is injected.
                // If it did not happen that way, the following line would blow up.
                // TODO: Maybe this should be guarded by an EditSession check in order
                // to be more fault-tolerant?
                editor.gotoLine(0, 0);
            });
        };

        /**
         * Since the default $animate service is adding and removing the
         * ng-hide class in the $$postDigest phase, we need to resize
         * AFTER that happens, which would be in the next
         * tick of the event-loop. We'll use $timeout to do this in the
         * next tick.
         * 
         * This $watch is cancelled on onDestroyScope.
         */
        const unregisterWatchNgShow = $scope.$watch('ngShow'/*attrs['ngShow']*/, function(newShowing: boolean, oldShowing: boolean) {
            if (newShowing) {
                resizeEditorNextTick();
            }
        });

        function resizeEditorNextTick() {
            $timeout(function() { resizeEditor(); }, 0, /* No delay. */ false /* Don't trigger a digest. */);
        }

        function resizeEditor() {
            editor.resize(true);
            editor.renderer.updateFull();
        }

        // Both the scope and the element receive '$destroy' events, but the scope is called first.
        // It's probably also the more consistent place to release non-AngularJS resources allocated for the scope.
        function onDestroyScope() {
            unregisterWatchNgShow();
            // TODO: Since we only attach the editor after its thread has started and has been initialized,
            // should we only stop the thread after it has been detached?
            workspace.detachEditor($scope.id, $scope.mode, editor);
            // Interestingly, there is no $off function, so assume Angular will handle the unhook.
            // editorsController.removeEditor(scope)
            // editor.off('change', onEditorChange);

            themeManager.removeEventListener(currentTheme, themeEventHandler);

            // What about stopping the worker?
            editor.dispose();
        }

        // We can hook both the scope and the element '$destroy' event.
        // However, the scope event is probably the Best Practice.
        // The scope event also happens before the element event.
        $scope.$on('$destroy', onDestroyScope);
    }

    const directive: ng.IDirective = {
        require: ['ngModel', '^^workspace'],
        // NOTE: Using priority 1 to make sure that this link function (post-link),
        // is executed after the ng-show link function (priority 0 - they are
        // linked in reverse order). That way, the ng-show $watch() bindings are
        // bound first, which means that our $watch() handler will execute after
        // the ng-show $watch() handler.
        priority: 1,
        restrict: 'A',
        scope: {
            id: '@',
            mode: '@',
            ngShow: '<'
        },
        /**
         * Make the transclude function available in the link functions and manually perform the inclusion because
         * the text node has to go into the editor itself (we don't actually use this feature).
         */
        transclude: false,
        /**
         * The link function is used for DOM manipulation.
         */
        link: link
    };
    return directive;
}

factory.$inject = ['$timeout', 'settings', 'textService', 'themeManager'];

export default factory;
