export interface GitHubReason {
    data: {
        message: string;
        documentation_ul: string;
    };
    status: number;
    statusText: string;
}
