import AppScope from '../scopes/AppScope';
import GitHubUser from '../services/github/GitHubUser';
import Repo from '../services/github/Repo';

interface GitHubAccountScope extends AppScope {
    user: GitHubUser;
    repos: Repo[];
}

export default GitHubAccountScope;
