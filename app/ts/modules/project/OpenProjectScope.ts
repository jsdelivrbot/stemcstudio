import * as angular from 'angular';
import Doodle from '../../services/doodles/Doodle';

/**
 * 
 */
export interface OpenProjectScope extends angular.IRootScopeService {

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
}

export default OpenProjectScope;
