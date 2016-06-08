import * as angular from 'angular';

import WsModel from './services/WsModel';

const wsmodel: angular.IModule = angular.module('com.stemcstudio.wsmodel', []);

wsmodel.service('wsModel', WsModel);

wsmodel.config([function() {
    // console.lg(`${wsmodel.name}.config(...)`);
}]);

wsmodel.run([function() {
    // console.lg(`${wsmodel.name}.run(...)`);
}]);

export default wsmodel;
