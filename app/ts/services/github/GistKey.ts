interface GistKey {
    url: string;
    forks_url: string;
    commits_url: string;
    id: string;
    description: string;
    public: boolean;
    owner: {
        login: string;
        id: number;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        // more ...
    };
    git_pull_url: string;
    git_push_url: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    comments: number;
    user: string;
    comments_url: string;
    forks: any[];
    history: {

    }[];
    truncated: boolean;
}

export default GistKey;
