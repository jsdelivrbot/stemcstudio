export const GITHUB_AUTH_MANAGER = "GitHubAuthManager";

interface IGitHubAuthManager {
    clientId(): string | null;
    /**
     * Register a handler for the callback from GitHub authentication.
     */
    onLoginCallback(callback: (err: Error | null, token?: string) => void): void;
    isSignedIn(): boolean;
    userLogin(): string | undefined | null;
}

export default IGitHubAuthManager;
