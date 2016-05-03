import AppScope from '../scopes/AppScope';
import User from '../services/github/User';
import Repo from '../services/github/Repo';

interface GitHubAccountScope extends AppScope {
    user: User;
    repos: Repo[];
}

export default GitHubAccountScope;
