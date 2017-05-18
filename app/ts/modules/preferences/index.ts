import { module } from 'angular';
import { EDITOR_PREFERENCES_STORAGE, PREFERENCES_MODULE } from './constants';
import EditorPreferencesStorageImplementation from './services/EditorPreferencesStorageImplementation';

//
// How we name this module is not so important because we will
// use the name property in the application. It should, however,
// be reasonably unique. I'm using a reverse-domain convention.
//
export const editorStorageModule = module(PREFERENCES_MODULE, []);

editorStorageModule.service(EDITOR_PREFERENCES_STORAGE, EditorPreferencesStorageImplementation);

editorStorageModule.config([function () {
    // console.lg(`${m.name}.config(...)`);
}]);

editorStorageModule.run([function () {
    // console.lg(`${m.name}.run(...)`);
}]);
