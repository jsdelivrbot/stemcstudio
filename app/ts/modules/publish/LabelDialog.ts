import * as ng from 'angular';
import LabelSettings from './LabelSettings';

interface LabelDialog {
    open(defaults: LabelSettings): ng.IPromise<LabelSettings>;
}

export default LabelDialog;
