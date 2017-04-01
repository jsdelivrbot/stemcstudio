import { IAttributes, IAugmentedJQuery, IDirective, IScope, ITranscludeFunction } from 'angular';
import controller from './WorkspaceController';

function factory() {

    function link($scope: IScope, element: IAugmentedJQuery, attrs: IAttributes, controllers: {}, transclude: ITranscludeFunction) {
        // Do nothing.
    }

    const directive: IDirective = {
        require: [],
        restrict: 'E',
        controller,
        link: link
    };

    return directive;
}

factory.$inject = [];

export default factory;
