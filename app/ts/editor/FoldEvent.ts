import { Fold } from './Fold';

interface FoldEvent {
    /**
     *
     */
    action: 'add' | 'remove';

    /**
     *
     */
    data: Fold;
}

export default FoldEvent;
