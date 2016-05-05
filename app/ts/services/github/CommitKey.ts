interface CommitKey {
    sha: string;
    url: string;
    author: {
        date: string;
        name: string;
        email: string;
    };
    committer: {
        date: string;
        name: string;
        email: string;
    };
    message: string;
    tree: {
        url: string;
        sha: string;
    };
    parents: {
        url: string;
        sha: string;
    }[];
}

export default CommitKey;
