import { IPromise } from 'angular';
import { LabelSettings } from './LabelSettings';

/**
 * Dialog used to edit Labels (title, author) and Tags (keywords) for a package. 
 */
export interface LabelDialog {
    open(defaults: LabelSettings): IPromise<LabelSettings>;
}
