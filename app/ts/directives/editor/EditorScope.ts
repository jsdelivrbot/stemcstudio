import * as ng from 'angular';

/**
 * Isolate scope for the editor component.
 */
interface EditorScope extends ng.IScope {
    path: string;
}

export default EditorScope;
