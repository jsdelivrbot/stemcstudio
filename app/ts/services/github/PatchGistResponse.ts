import GistFile from './GistFile';

interface PatchGistResponse {
  url: string;
  forks_url: string;
  commits_url: string;
  id: string;
  git_pull_url: string;
  git_push_url: string;
  html_url: string;
  files: { [name: string]: GistFile };
  public: boolean;
  created_at: string;
  updated_at: string;
  description: string;
  comments: number;
  owner: any;
  forks: any[];
  history: any[];
  truncated: boolean;
}

export default PatchGistResponse;
