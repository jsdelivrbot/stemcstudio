import { IScope } from 'angular';
/**
 * Isolate scope for the editor component.
 */
interface EditorScope extends IScope {
    path: string;
}

export default EditorScope;
