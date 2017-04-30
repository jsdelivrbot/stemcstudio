import { IAttributes, IAugmentedJQuery, IDirective, IScope, ITranscludeFunction } from 'angular';
import { WorkspaceController } from './WorkspaceController';

/**
 * 
 */
export function workspace() {

    function link($scope: IScope, element: IAugmentedJQuery, attrs: IAttributes, controllers: {}, transclude: ITranscludeFunction) {
        // Do nothing.
    }

    const directive: IDirective = {
        require: [],
        restrict: 'E',
        controller: WorkspaceController,
        link: link
    };

    return directive;
}

workspace.$inject = [];
