import Doodle from '../../services/doodles/Doodle';

/**
 * 
 */
export interface OpenProjectScope extends ng.IRootScopeService {

    /**
     * The doodle that the user wants to open from Local Storage.
     */
    doodle: Doodle;
    /**
     * The doodles available in Local Storage.
     */
    doodles(): Doodle[];
    /**
     * 
     */
    doOpen(doodle: Doodle): void;
    /**
     * 
     */
    doClose(): void;
    /**
     * 
     */
    cancel(): void;
}

export default OpenProjectScope;
