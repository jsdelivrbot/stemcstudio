import * as ng from 'angular';
import PropertiesSettings from './PropertiesSettings';

interface PropertiesDialog {
    open(defaults: PropertiesSettings): ng.IPromise<PropertiesSettings>;
}

export default PropertiesDialog;
