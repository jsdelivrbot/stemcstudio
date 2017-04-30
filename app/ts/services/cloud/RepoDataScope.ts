import { RepoData } from '../github/RepoData';
import RepoDataOptions from './RepoDataOptions';

interface RepoDataScope {
    data: RepoData;
    options: RepoDataOptions;
    ok(): void;
    cancel(): void;
}

export default RepoDataScope;
