import { IPromise } from 'angular';
import LabelSettings from './LabelSettings';

interface LabelDialog {
    open(defaults: LabelSettings): IPromise<LabelSettings>;
}

export default LabelDialog;
