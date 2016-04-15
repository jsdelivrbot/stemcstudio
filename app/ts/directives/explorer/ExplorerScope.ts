import * as ng from 'angular';
// import DoodleScope from '../../scopes/DoodleScope';

/**
 * This interface documents part of the contract between the directive code and the presentation logic.
 * The part of the contract that it documents is the model.
 *
 * The file-navigator component has an isolate scope, so this interface is local to the directive?
 * But it may also be useful in the controller?
 */
interface ExplorerScope extends ng.IScope {
  files: {name: string, isOpen: boolean, selected: boolean}[];
}

export default ExplorerScope;
