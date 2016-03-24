import * as angular from 'angular';

interface AboutScope extends angular.IScope {
    doCheckForUpdates(): void;
    doClose(): void;
}

export default AboutScope;
