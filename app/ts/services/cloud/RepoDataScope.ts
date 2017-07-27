import { RepoData } from '../github/RepoData';
import { RepoDataOptions } from './RepoDataOptions';

export interface RepoDataScope {
    data: RepoData;
    options: RepoDataOptions;
    ok(): void;
    cancel(): void;
}
