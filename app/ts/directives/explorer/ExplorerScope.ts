import { IScope } from 'angular';
import { WsModel } from '../../modules/wsmodel/WsModel';

/**
 * This interface documents part of the contract between the directive code and the presentation logic.
 * The part of the contract that it documents is the model.
 */
export interface ExplorerScope extends IScope {
    workspace: WsModel;
}
