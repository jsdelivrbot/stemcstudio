interface RepoKey {
    id: number;
    owner: {
        login: string;
        id: number;
        // more ...
    };
    name: string;
    full_name: string;
    description: string;
    // more ...
    created_at: string;
    updated_at: string;
}

export default RepoKey;
