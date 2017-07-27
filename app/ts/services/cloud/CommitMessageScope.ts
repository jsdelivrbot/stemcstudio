import { CommitMessageOptions } from './CommitMessageOptions';

export interface CommitMessageScope {
    options: CommitMessageOptions;
    ok(): void;
    cancel(): void;
}
