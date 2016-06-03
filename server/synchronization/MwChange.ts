import MwAction from './MwAction';

/**
 * The actions to be applied to a particular file.
 */
interface MwChange {

    /**
     * TODO: This could be the path of the file.
     */
    f: string;

    /**
     * remote version, if we know it from last receive.
     */
    m: number;

    /**
     * TODO: This should probably be actions.
     */
    a: MwAction;
}

export default MwChange;
