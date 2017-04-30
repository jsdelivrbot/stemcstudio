import GistFile from './GistFile';
import GitHubOwner from './GitHubOwner';

export interface Gist {
    url: string;
    forks_url: string;
    commits_url: string;
    id: string;
    git_pull_url: string;
    git_push_url: string;
    html_url: string;
    files: { [name: string]: GistFile };
    description: string;
    public: boolean;
    created_at: string;
    updated_at: string;
    comments: number;
    owner: GitHubOwner;
    user: string;
    comments_url: string;
    forks: any[];
    history: {
        user: GitHubOwner;
        version: string;
        committed_at: string;
        change_status: {
            total: number;
            additions: number;
            deletions: number;
        };
        url: string;
    }[];
    truncated: boolean;
}
