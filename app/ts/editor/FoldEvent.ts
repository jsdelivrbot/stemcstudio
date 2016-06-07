import Fold from './Fold';

interface FoldEvent {
    /**
     * 'add', 'remove'
     */
    action: string;

    /**
     *
     */
    data: Fold;
}

export default FoldEvent;
