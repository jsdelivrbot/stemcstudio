import * as ng from 'angular';

/**
 * Isolate scope for the editor component.
 */
interface EditorScope extends ng.IScope {
    id: string;
    mode: string;
}

export default EditorScope;
