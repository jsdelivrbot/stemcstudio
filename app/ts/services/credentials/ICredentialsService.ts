/**
 * 
 */
export interface ICredentialsService {
    /**
     * 
     */
    credentials: { [identityProviderName: string]: string };
    initialize(): void;
    googleSignIn(token: string | undefined): void;
}

export const CREDENTIALS_SERVICE_UUID = 'credentialsService';
