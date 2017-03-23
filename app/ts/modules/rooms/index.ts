import * as angular from 'angular';

import RoomsController from './controllers/RoomsController';
import RoomsService from './services/RoomsService';
import { ROOMS_SERVICE_UUID } from './api';

//
// How we name this module is not so important because we will
// use the name property in the application. It should, however,
// be reasonably unique. I'm using a reverse-domain convention.
//
const rooms: angular.IModule = angular.module('com.stemcstudio.rooms', []);

rooms.controller('rooms-controller', RoomsController);
rooms.service(ROOMS_SERVICE_UUID, RoomsService);

rooms.config([function () {
    // console.log(`${rooms.name}.config(...)`);
}]);

rooms.run([function () {
    // console.log(`${rooms.name}.run(...)`);
}]);

export default rooms;
