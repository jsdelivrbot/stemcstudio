import { IModule, module } from 'angular';
import { EDITOR_PREFERENCES_DIALOG, EDITOR_PREFERENCES_SERVICE, EDITORS_MODULE } from './constants';
import EditorPreferencesController from './controllers/EditorPreferencesController';
import EditorPreferencesDialogService from './services/dialog/EditorPreferencesDialogService';
import EditorPreferencesService from './services/manager/DefaultEditorPreferencesService';

//
// How we name this module is not so important because we will
// use the name property in the application. It should, however,
// be reasonably unique. I'm using a reverse-domain convention.
//
const m: IModule = module(EDITORS_MODULE, []);

// Use a lower-case-dashed name because the controller will be used from HTML.
// Beacause this is used from HTML, we don't declare a symbolic constant for it.
m.controller('editor-preferences-controller', EditorPreferencesController);
m.service(EDITOR_PREFERENCES_DIALOG, EditorPreferencesDialogService);
m.service(EDITOR_PREFERENCES_SERVICE, EditorPreferencesService);

m.config([function () {
    // console.lg(`${m.name}.config(...)`);
}]);

m.run([function () {
    // console.lg(`${m.name}.run(...)`);
}]);

export default m;
