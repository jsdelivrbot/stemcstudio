interface PutFileResponse {
    content: {
        name: string;
        path: string;
        sha: string;
        size: number;
        url: string;
        html_url: string;
        git_url: string;
        download_url: string;
        type: string;
        _links: {
            self: string;
            git: string;
            html: string;
        }
    };
    commit: {
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
    };
}

export default PutFileResponse;
