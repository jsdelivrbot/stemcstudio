import * as ng from 'angular';
import WsModel from '../../wsmodel/services/WsModel';

/**
 * This interface documents part of the contract between the directive code and the presentation logic.
 * The part of the contract that it documents is the model.
 */
interface ExplorerScope extends ng.IScope {
    workspace: WsModel;
}

export default ExplorerScope;
