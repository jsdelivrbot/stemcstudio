import Fold from './Fold';

interface FoldEvent {
    /**
     * 'add', 'remove'
     *
     * @property action
     * @type string
     */
    action: string;

    /**
     * @property data
     * @type Fold
     */
    data: Fold;
}

export default FoldEvent;