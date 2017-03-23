import * as angular from 'angular';

import { WORKSPACE_MODEL, WSMODEL_MODULE } from './constants';

import WsModel from './services/WsModel';

const wsmodel: angular.IModule = angular.module(WSMODEL_MODULE, []);

wsmodel.service(WORKSPACE_MODEL, WsModel);

wsmodel.config([function () {
    // console.lg(`${wsmodel.name}.config(...)`);
}]);

wsmodel.run([function () {
    // console.lg(`${wsmodel.name}.run(...)`);
}]);

export default wsmodel;
