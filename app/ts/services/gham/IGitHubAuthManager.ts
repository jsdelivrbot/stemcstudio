interface IGitHubAuthManager {
    handleGitHubLoginCallback(callback: (err, token) => void): void;
    handleLoginCallback(callback: (err, token) => void): void;
}

export default IGitHubAuthManager;
