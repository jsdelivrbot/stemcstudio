import ChooseGistOrRepoOptions from './ChooseGistOrRepoOptions';

interface CommitMessageScope {
    options: ChooseGistOrRepoOptions;
    gist(): void;
    repo(): void;
    cancel(): void;
}

export default CommitMessageScope;
