import GistFile from './GistFile';

interface GetGistResponse {
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
        // More... 
    };
    files: { [name: string]: GistFile };
    truncated: boolean;
    comments: number;
    comments_url: string;
    created_at: string;
    updated_at: string;
    forks: {}[];
    history: {}[];
}

export default GetGistResponse;
