export interface GitHubUser {
    avatar_url: string | undefined;
    bio: any;
    blog: string;
    collaborators: number;
    company: string;
    created_at: string;
    disk_usage: number;
    email: string;
    events_url: string;
    followers: number;
    followers_url: string;
    following: number;
    following_url: string;
    gists_url: string;
    gravatar_id: string;
    hireable: boolean;
    html_url: string;
    id: string;
    location: any;
    login: string;
    name: string;
    organizations_url: string;
    owned_private_repos: number;
    plan: {
        name: string;
        space: number;
        collaborators: number;
        private_repos: number;
    };
    private_gists: number;
    public_repos: number;
    public_gists: number;
    received_events_url: string;
    repos_url: string;
    site_admin: boolean;
    starred_url: string;
    subscriptions_url: string;
    total_private_repos: number;
    type: string;
    updated_at: string;
    url: string;
}

export default GitHubUser;
