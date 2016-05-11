import * as angular from 'angular';
import ITranslateService from '../ITranslateService';

/**
   <example module="ngView">
    <file name="index.html">
      <div ng-controller="TranslateCtrl">

        <pre>{{ 'TRANSLATION_ID' | translate }}</pre>
        <pre>{{ translationId | translate }}</pre>
        <pre>{{ 'WITH_VALUES' | translate:'{value: 5}' }}</pre>
        <pre>{{ 'WITH_VALUES' | translate:values }}</pre>

      </div>
    </file>
    <file name="script.js">
      angular.module('ngView', ['pascalprecht.translate'])

      .config(function ($translateProvider) {

        $translateProvider.translations('en', {
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}'
        });
        $translateProvider.preferredLanguage('en');

      });

      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';

        $scope.values = {
          value: 78
        };
      });
    </file>
   </example>
 */
function translateFilterFactory($parse: angular.IParseService, $translate: ITranslateService) {

    const translateFilter = function(translationId: string, interpolateParams: any, interpolation: string, forceLanguage: boolean) {
        if (!angular.isObject(interpolateParams)) {
            interpolateParams = $parse(interpolateParams)(this);
        }

        return $translate.instant(translationId, interpolateParams, interpolation, forceLanguage);
    };

    return translateFilter;
}

translateFilterFactory['$inject'] = ['$parse', '$translate'];

export default translateFilterFactory;
