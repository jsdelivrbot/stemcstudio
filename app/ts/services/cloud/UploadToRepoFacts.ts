import { Fuzzy } from '../../utils/Fuzzy';
import { Commit } from '../github/Commit';
import { CommitKey } from '../github/CommitKey';
import { Reference } from '../github/Reference';
import { TreeKey } from '../github/TreeKey';

export class UploadToRepoFacts {
    /**
     * The initial reference that we will finally update.
     * This may not exist if the repository is empty and has no commits.
     */
    public refInitial = new Fuzzy<Reference>();
    public refMissing = new Fuzzy<boolean>();
    /**
     * The parent commit for the new commit.
     * This may not exist.
     */
    public baseCommit = new Fuzzy<Commit>();
    /**
     * The tree created for the upload.
     */
    public tree = new Fuzzy<TreeKey>();

    /**
     * The commit created for the upload.
     */
    public commit = new Fuzzy<CommitKey>();

    /**
     * The final reference update response.
     */
    public refUpdate = new Fuzzy<Reference>();

    /**
     * The HTTP status of the last call.
     */
    public status = new Fuzzy<number>();

    /**
     * The HTTP statusText of the last call.
     */
    public statusText = new Fuzzy<string>();

    /**
     * headers('X-RateLimit-Limit')
     */
    public rateLimitTotal: number;

    /**
     * headers('X-RateLimit-Remaining')
     */
    public rateLimitRemaining: number;
}

