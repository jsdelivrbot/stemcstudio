interface IGitHubAuthManager {
    handleGitHubLoginCallback(callback: (err: any, token: string) => void): void;
    handleLoginCallback(callback: (err: any, token: string) => void): void;
}

export default IGitHubAuthManager;
