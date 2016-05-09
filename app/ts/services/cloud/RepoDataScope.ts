import RepoData from '../github/RepoData';
import RepoDataOptions from './RepoDataOptions';

interface RepoDataScope {
    data: RepoData;
    options: RepoDataOptions;
    ok();
    cancel();
}

export default RepoDataScope;
