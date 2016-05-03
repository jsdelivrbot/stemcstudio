import AppScope from './AppScope';
import ITemplate from '../services/templates/ITemplate';

interface NewScope extends AppScope {
    description: string;
    template: ITemplate;
    templates: ITemplate[];
    doOK: () => void;
    doCancel: () => void;
}

export default NewScope;
