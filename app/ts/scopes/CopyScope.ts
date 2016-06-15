import BodyScope from './BodyScope';

interface CopyScope extends BodyScope {

    /**
     * The description of the source project.
     */
    oldDescription: string;

    /**
     * The description of the project copy.
     */
    newDescription: string;

    /**
     * 
     */
    doOK: () => void;

    /**
     * 
     */
    doCancel: () => void;
}
export default CopyScope;
