import AppScope from '../AppScope';
import Doodle from '../services/doodles/Doodle';

interface NewScope extends AppScope {
    description: string;
    template: Doodle;
    templates: Doodle[];
    doOK: () => void;
    doCancel: () => void;
}

export default NewScope;
