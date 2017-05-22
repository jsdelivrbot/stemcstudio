import { Document } from '../../editor/Document';
import { Editor } from '../../editor/Editor';
import { EditSession } from '../../editor/EditSession';
import { IAttributes, IAugmentedJQuery, IDirective, IDirectivePrePost, INgModelController, ITimeoutService, ITranscludeFunction } from 'angular';
import { ProblemsScope } from './ProblemsScope';
import Renderer from '../../editor/Renderer';
import { EDITOR_PREFERENCES_SERVICE } from '../../modules/editors/constants';
import { EditorPreferencesService } from '../../modules/editors/EditorPreferencesService';
import { EditorPreferencesEvent } from '../../modules/editors/EditorPreferencesEvent';
import { currentTheme } from '../../modules/editors/EditorPreferencesEvent';
import { WsModel } from '../../modules/wsmodel/WsModel';

const noop = function () { /* Do nothing. */ };

/**
 * interface for the DOM attributes.
 */
interface ProblemsAttributes extends IAttributes {

}

/**
 * The 'problems' directive.
 */
export function problems($timeout: ITimeoutService, editorPreferencesService: EditorPreferencesService): IDirective {
    function compile(tElem: IAugmentedJQuery, tAttrs: IAttributes): IDirectivePrePost {
        return {
            /**
             * The preLink step always takes place from top to bottom in the DOM hierarchy.
             */
            pre: function ($scope: ProblemsScope, iElem: IAugmentedJQuery, iAttrs: ProblemsAttributes, controller: {}, transclude: ITranscludeFunction) {
                const ngModel: INgModelController = controller[0];
                ngModel.$formatters.push(function (modelValue: WsModel) {
                    if (modelValue) {
                        if (modelValue instanceof WsModel) {
                            return modelValue;
                        }
                        else {
                            console.warn("modelValue is not a WsModel");
                            return {};
                        }
                    }
                    else {
                        return {};
                    }
                });
                ngModel.$parsers.push(function (viewValue: WsModel) {
                    ngModel.$setValidity('yadda', true); // We passed the yadda test.
                    return viewValue;
                });
                // In Angular 1.3+ we have the $validators pipeline.
                // We don't need to set validation states because we have an object, not an array.
                /*
                ngModel.$validators['foo'] = function (modelValue: WsModel, viewValue: WsModel): boolean {
                    // This will add 'ng-valid-foo' to the directive 'class' property.
                    return true;
                };
                ngModel.$validators['bar'] = function (modelValue: WsModel, viewValue: WsModel): boolean {
                    // This will add 'ng-invalid' and 'ng-invalid-bar' to the directive 'class' property.
                    return false;
                };
                */
            },
            /**
             * The postLink step always takes place from bottom to top in the DOM hierarchy.
             */
            post: function ($scope: ProblemsScope, element: IAugmentedJQuery, attrs: ProblemsAttributes, controller: {}, transclude: ITranscludeFunction) {

                const ngModel: INgModelController = controller[0];

                const container: HTMLElement = element[0];
                const renderer: Renderer = new Renderer(container);

                renderer.content.style.cursor = "default";
                // renderer.setStyle("ace_autocomplete");
                renderer.cursorLayer.restartTimer = noop;
                renderer.cursorLayer.element.style.opacity = "0";
                renderer.maxLines = 8;
                renderer.$keepTextAreaAtCursor = false;

                const doc = new Document("");
                const editSession = new EditSession(doc);
                const editor: Editor = new Editor(renderer, editSession);

                editSession.setLanguage('Text')
                    .catch(function (err) {
                        console.warn(`setLanguageMode('Text') failed. ${err}`);
                    });

                const editorPreferencesEventListener = function (event: EditorPreferencesEvent) {
                    setTimeout(function () {
                        editor.setThemeCss(event.cssClass, event.href);
                        editor.setThemeDark(event.isDark);
                        editor.setShowInvisibles(event.showInvisibles);
                    }, 0);
                };

                // This event listener gets removed in onDestroyScope
                editorPreferencesService.addEventListener(currentTheme, editorPreferencesEventListener);

                ngModel.$render = function () {
                    const viewValue = <WsModel>ngModel.$viewValue;
                    if (viewValue instanceof WsModel) {
                        $timeout(function () {
                            resizeEditor();
                            // The resize event appears to happen AFTER a session is injected.
                            // If it did not happen that way, the following line would blow up.
                            // TODO: Maybe this should be guarded by an EditSession check in order
                            // to be more fault-tolerant?
                            editor.gotoLine(0, 0);
                        });
                    }
                    else {
                        console.warn("viewValue is not a WsModel");
                    }
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
                const unregisterWatchNgShow = $scope.$watch('ngShow'/*attrs['ngShow']*/, function (newShowing: boolean, oldShowing: boolean) {
                    if (newShowing) {
                        resizeEditorNextTick();
                    }
                });

                function resizeEditorNextTick() {
                    $timeout(function () { resizeEditor(); }, 0, /* No delay. */ false /* Don't trigger a digest. */);
                }

                function resizeEditor() {
                    editor.resize(true);
                    editor.renderer.updateFull();
                }

                // Both the scope and the element receive '$destroy' events, but the scope is called first.
                // It's probably also the more consistent place to release non-AngularJS resources allocated for the scope.
                function onDestroyScope() {
                    unregisterWatchNgShow();

                    editorPreferencesService.removeEventListener(currentTheme, editorPreferencesEventListener);

                    if (editor) {
                        editor.dispose();
                    }
                }

                // We can hook both the scope and the element '$destroy' event.
                // However, the scope event is probably the Best Practice.
                // The scope event also happens before the element event.
                $scope.$on('$destroy', onDestroyScope);
            }
        };
    }

    /**
     * 
     */
    const directive: IDirective = {
        require: ['ngModel'],
        restrict: 'E',
        priority: 1,
        compile
    };
    return directive;
}

problems.$inject = ['$timeout', EDITOR_PREFERENCES_SERVICE];
