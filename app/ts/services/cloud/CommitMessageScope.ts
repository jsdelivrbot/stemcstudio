import CommitMessageOptions from './CommitMessageOptions';

interface CommitMessageScope {
    options: CommitMessageOptions;
    ok(): void;
    cancel(): void;
}

export default CommitMessageScope;
