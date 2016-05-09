import ChooseGistOrRepoOptions from './ChooseGistOrRepoOptions';

interface CommitMessageScope {
    options: ChooseGistOrRepoOptions;
    gist();
    repo();
    cancel();
}

export default CommitMessageScope;
