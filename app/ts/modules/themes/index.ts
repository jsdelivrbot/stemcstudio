import * as angular from 'angular';

import {THEMES_DIALOG, THEME_MANAGER, THEMES_MODULE} from './constants';
import ThemesController from './controllers/ThemesController';
import ThemesDialogService from './services/dialog/ThemesDialogService';
import ThemeManagerService from './services/manager/ThemeManagerService';

//
// How we name this module is not so important because we will
// use the name property in the application. It should, however,
// be reasonably unique. I'm using a reverse-domain convention.
//
const m: angular.IModule = angular.module(THEMES_MODULE, []);

// Use a lower-case-dashed name because the controller will be used from HTML.
// Beacause this is used from HTML, we don't declare a symbolic constant for it.
m.controller('themes-controller', ThemesController);
m.service(THEMES_DIALOG, ThemesDialogService);
m.service(THEME_MANAGER, ThemeManagerService);

m.config([function () {
    console.log(`${m.name}.config(...)`);
}]);

m.run([function () {
    console.log(`${m.name}.run(...)`);
}]);

export default m;
