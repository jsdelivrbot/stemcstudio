export const GITHUB_AUTH_MANAGER_UUID = "GitHubAuthManager";

export interface IGitHubAuthManager {
    clientId(): string | null;
    /**
     * Register a handler for the callback from GitHub authentication.
     */
    onLoginCallback(callback: (err: Error | null, token?: string) => void): void;
    isSignedIn(): boolean;
    userLogin(): string | undefined | null;
}
