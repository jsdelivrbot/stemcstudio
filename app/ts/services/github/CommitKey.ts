export interface CommitKey {
    sha: string;
    url: string;
    html_url: string;
    author: {
        name: string;
        email: string;
        date: string;
    };
    committer: {
        name: string;
        email: string;
        date: string;
    };
    message: string;
    tree: {
        sha: string;
        url: string;
    };
    parents: {
        url: string;
        sha: string;
        html_url: string;
    }[];
}
