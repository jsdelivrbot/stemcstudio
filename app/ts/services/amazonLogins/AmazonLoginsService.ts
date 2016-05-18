const PROVIDER_NAME_GOOGLE_PLUS = 'accounts.google.com';

/**
 *
 */
export default class AmazonLoginService {
    public static $inject: string[] = [];
    private Logins: { [provideName: string]: string } = {};
    constructor() {
        // Do nothing.
    }
    public initialize(): void {
        // Amazon Cognito, unauthenticated credentials
        this.updateCredentials();

        // Google API must be initialized.
        // Once we have done so, we can listen for comings and goings.
        // That's useful for maintaining the Amazon Cognito credentials.
        gapi.load('auth2', () => {
            const auth2 = gapi.auth2.init({
                client_id: '54406425322-nv10ri5f0p6vl3i2nrkbhv8mv9pmb4r1.apps.googleusercontent.com',
                fetch_basic_profile: true,  // affects getBasicProfile() on GoogleUser.
                scope: 'profile'
            });

            // Listen for sign-in state changes.
            auth2.isSignedIn.listen((direction: boolean) => {
                console.log('Signin state changed to ', direction);
            });

            // I don't think we have to wait for the init outcome to hook up the listeners.
            auth2.then(() => {
                // const auth2 = gapi.auth2.getAuthInstance();
                // return auth2.isSignedIn.get();

                // See if we already have a signed in Google User.
                const googleUser = auth2.currentUser.get();
                if (googleUser) {
                    const response = googleUser.getAuthResponse();
                    if (response) {
                        this.googleSignIn(response.id_token);
                    }
                    else {
                        console.warn("No AuthResponse");
                    }
                }
                else {
                    console.warn("No GoogleUser");
                }

                // Listen for changes to current user.
                auth2.currentUser.listen((googleUser: gapi.auth2.GoogleUser) => {
                    const id_token = googleUser.getAuthResponse().id_token;
                    this.googleSignIn(id_token);
                    console.log("GoogleUser changed!");
                });
                // Do nothing.
            }, (reason: any) => {
                console.warn(`gapi.auth2.init failed because ${reason}`);
            });
        });
    }
    private updateCredentials(): void {
        console.log(`updateCredentials() with providers ${JSON.stringify(Object.keys(this.Logins), null, 2)}`);
        AWS.config.region = 'us-east-1';
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            // This identifier comes from looking at the generated sample code for
            // the identity provider called STEMCstudio for the JavaScript platform.
            // It can also be seen by "Edit identity pool".
            IdentityPoolId: 'us-east-1:b419a8b6-2753-4af4-a76b-41a451eb2278',
            Logins: this.Logins
        });
    }

    /**
     * Google Sign-In.
     */
    googleSignIn(token: string): void {
        if (token) {
            this.Logins[PROVIDER_NAME_GOOGLE_PLUS] = token;
        }
        else {
            if (this.Logins[PROVIDER_NAME_GOOGLE_PLUS]) {
                delete this.Logins[PROVIDER_NAME_GOOGLE_PLUS];
            }
        }
        this.updateCredentials();
    }
}
