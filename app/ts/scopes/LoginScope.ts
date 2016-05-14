import BodyScope from './BodyScope';

export interface LoginScope extends BodyScope {

    FEATURE_GITHUB_SIGNIN_ENABLED: boolean;
    FEATURE_GOOGLE_SIGNIN_ENABLED: boolean;
    FEATURE_TWITTER_SIGNIN_ENABLED: boolean;
    FEATURE_FACEBOOK_SIGNIN_ENABLED: boolean;

    googleSignInOptions: gapi.SignIn2Options;

}

export default LoginScope;
