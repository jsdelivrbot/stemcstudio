import * as ng from 'angular';

interface GoogleSignInScope extends ng.IScope {
    options: () => any;
}

export default GoogleSignInScope;
