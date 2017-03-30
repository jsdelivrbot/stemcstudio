import * as uib from 'angular-bootstrap';
import isString from '../../utils/isString';
import ITemplate from '../../services/templates/ITemplate';
import NewProjectScope from './NewProjectScope';
import NewProjectSettings from './NewProjectSettings';
import { ITranslateService, TRANSLATE_SERVICE_UUID } from '../translate/api';

function defaultTemplate(template: ITemplate, templates: ITemplate[]): ITemplate {
    if (template) {
        return template;
    }
    else if (Array.isArray(templates) && templates.length > 0) {
        return templates[0];
    }
    else {
        throw new Error("There must be at least one template available in order to provide a default template.");
    }
}

/**
 * The controller for the NewProjectScope.
 */
export default class NewProjectController {

    public static $inject: string[] = [
        '$scope',
        '$uibModalInstance',
        'templates',
        TRANSLATE_SERVICE_UUID,
        'pkgInfo'];

    constructor(
        $scope: NewProjectScope,
        $uibModalInstance: uib.IModalServiceInstance,
        templates: ITemplate[],
        translateService: ITranslateService,
        pkgInfo: NewProjectSettings) {

        $scope.project = {
            description: isString(pkgInfo.description) ? pkgInfo.description : "",
            template: defaultTemplate(pkgInfo.template, templates),
            version: isString(pkgInfo.version) ? pkgInfo.version : "0.9.0"
        };
        $scope.templates = templates;

        $scope.ok = function () {
            // The reality is that the input data and output data have the same data type.
            pkgInfo.description = $scope.project.description;
            pkgInfo.template = $scope.project.template;
            $uibModalInstance.close(pkgInfo);
        };
        $scope.cancel = function () {
            // Important that this string be consistent with workflow.
            $uibModalInstance.dismiss('cancel click');
        };
        $scope.reset = function (form: ng.IFormController) {
            // This code demonstrates a technique for future development.
            // The Reset button is currently disabled.
            form.$setPristine();
            form.$setUntouched();
        };
    }

    /**
     * 
     */
    $onInit(): void {
        //
        // Note that when $onInit is called, we are already inside a digest loop.
        // We must not call apply on the scope.
        //
    }
    $onDestroy(): void {
        // This is NOT called. Don't know why.
    }
}
