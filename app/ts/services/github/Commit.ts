interface Commit {
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
    tree: {
        sha: string;
        url: string;
    };
    message: string;
    parents: {
        sha: string;
        url: string;
        html_url: string;
    }[];
}

export default Commit;
