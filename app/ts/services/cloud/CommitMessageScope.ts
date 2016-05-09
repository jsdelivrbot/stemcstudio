import CommitMessageOptions from './CommitMessageOptions';

interface CommitMessageScope {
    options: CommitMessageOptions;
    ok();
    cancel();
}

export default CommitMessageScope;
