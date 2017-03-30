import controller from './WorkspaceController';

function factory() {

    function link($scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: {}, transclude: ng.ITranscludeFunction) {
        // Do nothing.
    }

    const directive: ng.IDirective = {
        require: [],
        restrict: 'E',
        controller,
        link: link
    };

    return directive;
}

factory.$inject = [];

export default factory;
