import * as angular from 'angular';
import { ITranslateService, TRANSLATE_SERVICE_UUID } from '../api';
import TranslateScope from '../scopes/TranslateScope';

/**
 * Directive Definition Factory
 * Usage <div translate>Hello</div> or <translate>Hello</translate>
 */
function factory(
    $interpolate: angular.IInterpolateService,
    $rootScope: angular.IRootScopeService,
    $parse: angular.IParseService,
    $compile: angular.ICompileService,
    translateService: ITranslateService): ng.IDirective {

    return {
        restrict: 'AE',
        scope: true,
        priority: translateService.directivePriority,
        compile(tElement: angular.IAugmentedJQuery, tAttr: angular.IAttributes) {

            const interpolateRegExp = '^(.*)(' + $interpolate.startSymbol() + '.*' + $interpolate.endSymbol() + ')(.*)';
            const watcherRegExp = '^(.*)' + $interpolate.startSymbol() + '(.*)' + $interpolate.endSymbol() + '(.*)';

            return function linkFn(scope: TranslateScope, iElement: angular.IAugmentedJQuery, iAttr: angular.IAttributes) {

                scope.preText = '';
                scope.postText = '';
                const translationIds: { [key: string]: string | undefined } = {};

                /**
                 * Applies the translation to the HTML.
                 */
                const applyTranslation = function (value: string, scope: TranslateScope, successful: boolean, translateAttr: string) {
                    if (translateAttr === 'translate') {
                        // default translate into innerHTML
                        if (successful || (!successful && !translateService.isKeepContent() && typeof iAttr.translateKeepContent === 'undefined')) {
                            iElement.empty().append(scope.preText + value + scope.postText);
                        }
                        const globallyEnabled = translateService.isPostCompilingEnabled();
                        const locallyDefined = typeof tAttr.translateCompile !== 'undefined';
                        const locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
                        if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
                            $compile(iElement.contents())(scope);
                        }
                    }
                    else {
                        // translate attribute
                        let attributeName = iAttr.$attr[translateAttr];
                        if (attributeName.substr(0, 5) === 'data-') {
                            // ensure html5 data prefix is stripped
                            attributeName = attributeName.substr(5);
                        }
                        attributeName = attributeName.substr(15);
                        iElement.attr(attributeName, value);
                    }
                };

                /**
                 * Translates the input and applies it to the HTML.
                 */
                const updateTranslation = function (translateAttr: string, input: string, scope: TranslateScope): void {
                    if (input) {
                        translateService.translate(input)
                            .then(function resolveCallback(translation) {
                                applyTranslation(translation, scope, true, translateAttr);
                            })
                            .catch(function rejectCallback(reason) {
                                // FIXME: This is wierd since it is the error case.
                                applyTranslation(reason, scope, false, translateAttr);
                            });
                    }
                    else {
                        // as an empty string cannot be translated, we can solve this using successful=false
                        applyTranslation(input, scope, false, translateAttr);
                    }
                };

                /**
                 * Updates all the translations.
                 */
                const updateTranslations = function () {
                    for (const key in translationIds) {
                        if (translationIds.hasOwnProperty(key) && translationIds[key] !== undefined) {
                            const input = translationIds[key];
                            if (typeof input === 'string') {
                                updateTranslation(key, input, scope);
                            }
                        }
                    }
                };

                // Ensures any change of the attribute "translate" containing the id will
                // be re-stored to the scope's "translationId".
                // If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
                let unwatchOld: (() => void) | undefined = void 0;
                const observeElementTranslation = function (translationId: string) {

                    // Remove any old watcher
                    if (typeof unwatchOld === 'function') {
                        unwatchOld();
                        unwatchOld = void 0;
                    }

                    if (angular.equals(translationId, '') || !angular.isDefined(translationId)) {
                        const iElementText = iElement.text().trim();

                        // Resolve translation id by inner html if required
                        const interpolateMatches = iElementText.match(interpolateRegExp);
                        // Interpolate translation id if required
                        if (interpolateMatches && angular.isArray(interpolateMatches)) {
                            scope.preText = interpolateMatches[1];
                            scope.postText = interpolateMatches[3];
                            translationIds.translate = $interpolate(interpolateMatches[2])(scope.$parent);
                            const watcherMatches = iElementText.match(watcherRegExp);
                            if (watcherMatches && angular.isArray(watcherMatches) && watcherMatches[2] && watcherMatches[2].length) {
                                unwatchOld = scope.$watch<string>(watcherMatches[2], function (newValue) {
                                    translationIds.translate = newValue;
                                    updateTranslations();
                                });
                            }
                        }
                        else {
                            // do not assign the translation id if it is empty.
                            translationIds.translate = !iElementText ? undefined : iElementText;
                        }
                    }
                    else {
                        translationIds.translate = translationId;
                    }
                    updateTranslations();
                };

                const observeAttributeTranslation = function (translateAttr: string) {
                    iAttr.$observe<string>(translateAttr, function (translationId) {
                        translationIds[translateAttr] = translationId;
                        updateTranslations();
                    });
                };

                let firstAttributeChangedEvent = true;
                iAttr.$observe<string>('translate', function (translationId) {
                    if (typeof translationId === 'undefined') {
                        // case of element "<translate>xyz</translate>"
                        observeElementTranslation('');
                    }
                    else {
                        // case of regular attribute
                        if (translationId !== '' || !firstAttributeChangedEvent) {
                            translationIds['translate'] = translationId;
                            updateTranslations();
                        }
                    }
                    firstAttributeChangedEvent = false;
                });

                for (const translateAttr in iAttr) {
                    if (iAttr.hasOwnProperty(translateAttr) && translateAttr.substr(0, 13) === 'translateAttr' && translateAttr.length > 13) {
                        observeAttributeTranslation(translateAttr);
                    }
                }

                iAttr.$observe('translateDefault', function (value) {
                    scope.defaultText = value;
                    updateTranslations();
                });

                // Replaced watcher on translateLanguage with event listener
                scope.$on('translateLanguageChanged', updateTranslations);

                // Ensures the text will be refreshed after the current language was changed
                // w/ $translate.use(...)
                const unbind = $rootScope.$on('$translateChangeSuccess', updateTranslations);

                // ensure translation will be looked up at least one
                if (iElement.text().length) {
                    if (iAttr.translate) {
                        observeElementTranslation(iAttr.translate);
                    }
                    else {
                        observeElementTranslation('');
                    }
                }
                else if (iAttr.translate) {
                    // ensure attribute will be not skipped
                    observeElementTranslation(iAttr.translate);
                }
                updateTranslations();
                scope.$on('$destroy', unbind);
            };
        }
    };
}

factory.$inject = ['$interpolate', '$rootScope', '$parse', '$compile', TRANSLATE_SERVICE_UUID];

export default factory;
