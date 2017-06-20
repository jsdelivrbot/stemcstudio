import { Fold } from './Fold';

export interface FoldEvent {
    /**
     *
     */
    action: 'add' | 'remove';

    /**
     *
     */
    data: Fold;
}
