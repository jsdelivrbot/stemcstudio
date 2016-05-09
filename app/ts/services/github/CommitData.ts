interface CommitData {
    message: string;
    author?: {
        name: string;
        email: string;
        data: string;
    };
    committer?: {
        name: string;
        email: string;
        data: string;
    };
    parents: string[];
    tree: string;
}

export default CommitData;
