import AppScope from '../AppScope';
import IDoodle from '../services/doodles/IDoodle';

interface NewScope extends AppScope {
    description: string;
    template: IDoodle;
    templates: IDoodle[];
    doOK: () => void;
    doCancel: () => void;
}

export default NewScope;
