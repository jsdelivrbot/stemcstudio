interface IGitHubItem {
    oauth: {
        pending: string;
        code?: string;
        state?: string;
    };
}

export default IGitHubItem;
