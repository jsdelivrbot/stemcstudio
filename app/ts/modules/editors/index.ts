import { IModule, module } from 'angular';
import { EDITOR_PREFERENCES_DIALOG, EDITOR_PREFERENCES_SERVICE, EDITORS_MODULE } from './constants';
import EditorPreferencesController from './controllers/EditorPreferencesController';
import EditorPreferencesDialogService from './services/dialog/EditorPreferencesDialogService';
import { DefaultEditorPreferencesService } from './services/manager/DefaultEditorPreferencesService';

//
// How we name this module is not so important because we will
// use the name property in the application. It should, however,
// be reasonably unique. I'm using a reverse-domain convention.
//
export const editorDialogModule: IModule = module(EDITORS_MODULE, []);

// Use a lower-case-dashed name because the controller will be used from HTML.
// Because this is used from HTML, we don't declare a symbolic constant for it.
editorDialogModule.controller('editor-preferences-controller', EditorPreferencesController);
editorDialogModule.service(EDITOR_PREFERENCES_DIALOG, EditorPreferencesDialogService);
editorDialogModule.service(EDITOR_PREFERENCES_SERVICE, DefaultEditorPreferencesService);

editorDialogModule.config([function () {
    // console.lg(`${m.name}.config(...)`);
}]);

editorDialogModule.run([function () {
    // console.lg(`${m.name}.run(...)`);
}]);
