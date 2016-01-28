import * as angular from 'angular';

interface IResizableScope extends angular.IScope {
    rWidth: number;
    rHeight: number;
    rDirections: string[];
    rCenteredX: boolean;
    rCenteredY: boolean;
    rFlex: boolean;
    rGrabber: string;
}

export default IResizableScope;