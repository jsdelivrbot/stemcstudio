import { IScope } from 'angular';

/**
 * 
 */
interface GoogleSignInScope extends IScope {
    options: () => any;
}

export default GoogleSignInScope;
