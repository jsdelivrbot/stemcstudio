export const GITHUB_AUTH_MANAGER = "GitHubAuthManager";

interface IGitHubAuthManager {
    clientId(): string | null;
    handleGitHubLoginCallback(callback: (err: Error, token: string) => void): void;
    handleLoginCallback(callback: (err: Error, token: string) => void): void;
    isSignedIn(): boolean;
    userLogin(): string | undefined | null;
}

export default IGitHubAuthManager;
