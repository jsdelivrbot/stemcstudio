interface Repo {
    id: number;
    owner: {
        login: string;
        id: number;
        // more ...
    };
    name: string;
    full_name: string;
    description: string;
    private: boolean;
    fork: boolean;
    // more ...
}

export default Repo;
