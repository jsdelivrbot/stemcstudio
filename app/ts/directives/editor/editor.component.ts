import * as ng from 'angular';
import createJavaScriptMode from '../../widgets/editor/mode/createJavaScriptMode';
import createTypeScriptMode from '../../widgets/editor/mode/createTypeScriptMode';
import HtmlMode from '../../widgets/editor/mode/HtmlMode';
import JsonMode from '../../widgets/editor/mode/JsonMode';
import createCssMode from '../../widgets/editor/mode/createCssMode';
import createMarkdownMode from '../../widgets/editor/mode/createMarkdownMode';
import Delta from '../../widgets/editor/Delta';
import edit from '../../widgets/editor/edit';
import Editor from '../../widgets/editor/Editor';
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
import {LANGUAGE_TYPE_SCRIPT} from '../../languages/modes';

function factory(
    $timeout: ng.ITimeoutService,
    settings: ISettingsService,
    textService: ITextService,
    themeManager: ThemeManager) {

    /**
     * @param $scope {IScope} Used to monitor $onDestroy and support transclude.
     * @param element
     * @param attrs
     * @param controllers
     * @param transclude {ITranscludeFunction} This parameter will only be set if we set the transclude option to true.
     */
    function link($scope: EditorScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: {}, transclude: ng.ITranscludeFunction) {

        // Maybe these should be constants?
        const systemImports: string[] = ['/jspm_packages/system.js', '/jspm.config.js'];
        const workerImports: string[] = systemImports.concat(['/js/ace-workers.js']);

        const ngModel: ng.INgModelController = controllers[0]
        const workspace: WorkspaceMixin = controllers[1]

        const container: HTMLElement = element[0]
        const editor: Editor = edit(container)

        const themeEventHandler = function(event: ThemeManagerEvent) {
            editor.setThemeCss(event.cssClass, event.href)
            editor.setThemeDark(event.isDark)
        }
        themeManager.addEventListener(currentTheme, themeEventHandler)

        // The following are starting to look very similar!
        switch ($scope.mode) {
            case LANGUAGE_JAVA_SCRIPT: {
                editor.setLanguageMode(createJavaScriptMode('/js/worker.js', workerImports), function(err: any) {
                    if (err) {
                        console.warn(`${$scope.mode} => ${err}`)
                    }
                })
                break
            }
            case LANGUAGE_TYPE_SCRIPT: {
                editor.setLanguageMode(createTypeScriptMode('/js/worker.js', workerImports), function(err: any) {
                    if (err) {
                        console.warn(`${$scope.mode} => ${err}`)
                    }
                })
                break
            }
            case LANGUAGE_HTML: {
                editor.setLanguageMode(new HtmlMode('/js/worker.js', workerImports), function(err: any) {
                    if (err) {
                        console.warn(`${$scope.mode} => ${err}`)
                    }
                })
                break
            }
            case LANGUAGE_JSON: {
                editor.getSession().setUseWorker(false);
                editor.setLanguageMode(new JsonMode('/js/worker.js', workerImports), function(err: any) {
                    if (err) {
                        console.warn(`${$scope.mode} => ${err}`)
                    }
                })
                break
            }
            case LANGUAGE_CSS:
            case LANGUAGE_LESS: {
                // If we don't use the worker then we don't get a confirmation.
                editor.getSession().setUseWorker(false);
                editor.setLanguageMode(createCssMode('/js/worker.js', workerImports), function(err: any) {
                    if (err) {
                        console.warn(`${$scope.mode} => ${err}`)
                    }
                })
                break
            }
            case LANGUAGE_MARKDOWN: {
                editor.getSession().setUseWrapMode(true)
                editor.setWrapBehavioursEnabled(true)
                editor.setLanguageMode(createMarkdownMode('/js/worker.js', workerImports), function(err: any) {
                    if (err) {
                        console.warn(`${$scope.mode} => ${err}`)
                    }
                })
                break
            }
            default: {
                console.warn(`Unrecognized mode => ${$scope.mode}`)
            }
        }
        editor.setThemeDark(true)
        editor.setPadding(4)
        editor.setShowInvisibles(settings.showInvisibles)
        editor.setFontSize(settings.fontSize)
        editor.setShowPrintMargin(settings.showPrintMargin)
        editor.setDisplayIndentGuides(settings.displayIndentGuides)
        editor.getSession().setTabSize(2)
        editor.getSession().setUseSoftTabs(true)

        attrs.$observe<boolean>('readonly', function(readOnly: boolean) {
            editor.setReadOnly(readOnly)
        })

        /**
         * When the editor changes, propagate back to the model.
         */
        function onEditorChange(event: Delta, source: Editor) {
            const viewValue: string = editor.getValue()
            ngModel.$setViewValue(viewValue)
        }

        // formatters update the viewValue from the modelValue
        ngModel.$formatters.push(function(modelValue: string) {
            if (ng.isUndefined(modelValue) || modelValue === null) {
                return void 0
            }
            // We are returning the viewValue. We could make an object literal here.
            // It should then match other usages of $viewValue.
            // We keep it simple by simply returning the string.
            return modelValue
        })

        // parsers update the modelValue from the viewValue
        // This is how it is done prior to AngularJs 1.3
        ngModel.$parsers.push(function(viewValue: string) {
            ngModel.$setValidity('yadda', true)
            return viewValue
        })

        // In Angular 1.3+ we have the $validators pipeline.
        // We don't need to set validation states because we have an object, not an array.
        ngModel.$validators['foo'] = function(modelValue: string, viewValue: string): boolean {
            return true
        }

        // The basic idea here is to set the $render callback function that will be used to take
        // the model value and use it to update the view (editor).
        // An 'improvement' is to wrap this inside a $timeout in order to delay the handling of changes.
        // I'm not sure why, but wrapping seems to break things!
        //      $timeout(function() {
        ngModel.$render = function() {
            const viewValue: string = ngModel.$viewValue
            if (typeof viewValue === 'string') {
                editor.off('change', onEditorChange)
                editor.setValue(viewValue, -1)
                editor.on('change', onEditorChange)
            }
            else {
                console.warn(`$render: Expecting typeof ngModel.$viewValue => '${typeof viewValue}' to be 'string'.`)
            }
            $timeout(function() {
                resizeEditor();
                editor.gotoLine(0, 0)
            })
        }

        // We use the transclude function to manually handle the placement of the contents.
        // We take any text and apply it to the editor.
        if (transclude) {
            transclude($scope, function(clonedElement: JQuery) {
                // We set the initial text on the editor before listening to change events.
                const initialText = textService.normalizeWhitespace(clonedElement.text())
                editor.setValue(initialText, -1)

                // FIXME: This is a bit dubious...
                if (initialText && !ngModel.$viewValue) {
                    const viewValue: string = initialText
                    ngModel.$setViewValue(viewValue)
                }
            })
        }
        else {
            // If the transclude option is not set then we can't suck in text contained in the element.
            console.warn("The transclude option is not set to true")
        }

        editor.on('change', onEditorChange)

        // Handle movements of the resizable grabber.
        /*
        $scope.$watch(function() {
            return [container.offsetWidth, container.offsetHeight]
        }, function() {
            editor.resize(true)
            editor.renderer.updateFull()
        }, true)
        */

        const unregisterWatchNgShow = $scope.$watch('ngShow'/*attrs['ngShow']*/, function(newShowing: boolean, oldShowing: boolean) {
            // Since the default $animate service is adding and removing the
            // ng-hide class in the $$postDigest phase, we need to resize
            // AFTER that happens, which would be in the next
            // tick of the event-loop. We'll use $timeout to do this in the
            // next tick.
            if (newShowing) {
                resizeEditorNextTick()
            }
        })

        function resizeEditorNextTick() {
            $timeout(function() { resizeEditor() }, 0, /* No delay. */ false /* Don't trigger a digest. */)
        }

        function resizeEditor() {
            editor.resize(true)
            editor.renderer.updateFull()
        }

        // Both the scope and the element receive '$destroy' events, but the scope is called first.
        // It's probably also the more consistent place to release non-AngularJS resources allocated for the scope.
        function onDestroyScope() {
            unregisterWatchNgShow()
            workspace.detachEditor($scope.id, $scope.mode, editor)
            // Interestingly, there is no $off function, so assume Angular will handle the unhook.
            // editorsController.removeEditor(scope)
            editor.off('change', onEditorChange)

            themeManager.removeEventListener(currentTheme, themeEventHandler)

            // What about stopping the worker?
            editor.destroy()
        }

        // We can hook both the scope and the element '$destroy' event.
        // However, the scope event is probably the Best Practice.
        // The scope event also happens before the element event.
        $scope.$on('$destroy', onDestroyScope)

        workspace.attachEditor($scope.id, $scope.mode, editor)
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
        transclude: true,
        /**
         * The link function is used for DOM manipulation.
         */
        link: link
    }
    return directive
}

factory.$inject = ['$timeout', 'settings', 'textService', 'themeManager']

export default factory
