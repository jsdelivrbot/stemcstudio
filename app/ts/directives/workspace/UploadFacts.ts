import { Method } from './Method';
import { Fuzzy } from '../../utils/Fuzzy';
import { RepoData } from '../../services/github/RepoData';

export class UploadFacts {

    /**
     * The commit message for a Repository commit.
     */
    public commitMessage: Fuzzy<string> = new Fuzzy<string>();

    /**
     * Indicates the response to a question about the storage kind.
     * This question need to be asked if the gistId or repo are
     * 'gist' or 'repo'
     */
    public storage: Fuzzy<string> = new Fuzzy<string>();

    /**
     * 
     */
    public method: Fuzzy<Method> = new Fuzzy<Method>();

    public gistId: Fuzzy<string> = new Fuzzy<string>();
    public gistExists: Fuzzy<boolean> = new Fuzzy<boolean>();
    /**
     * The repository id indicates the existence of the repository.
     */
    public repoId: Fuzzy<number> = new Fuzzy<number>();
    public repo: Fuzzy<string> = new Fuzzy<string>();
    public repoData: Fuzzy<RepoData> = new Fuzzy<RepoData>();
    public repoExists: Fuzzy<boolean> = new Fuzzy<boolean>();
    public owner: Fuzzy<string> = new Fuzzy<string>();
    public userLogin: Fuzzy<string> = new Fuzzy<string>();
    /**
     * The reference pointing to a commit.
     */
    public ref: Fuzzy<string> = new Fuzzy<string>();

    public uploadedAt: Fuzzy<string> = new Fuzzy<string>();

    public status: Fuzzy<number> = new Fuzzy<number>();
    public statusText: Fuzzy<string> = new Fuzzy<string>();

    /**
     * The variable that determines whether the flow has completed.
     */
    public uploadMessage: Fuzzy<string> = new Fuzzy<string>();

    /**
     * An instruction that we need to redirect.
     */
    public redirect: Fuzzy<boolean> = new Fuzzy<boolean>();

    constructor() {
        // Do nothing.
    }
    canAskForCommitMessage(): boolean {
        return this.commitMessage.isUndefined() && this.repoExists.isResolved();
    }
    canAskForRepoName(): boolean {
        // No. We're doing an upload whuch is either a create or an update.
        // If we are creating then we ask for the full repo data.
        // If we are updating then we don't need any more information.
        return false;
    }
    canAskForRepoData(): boolean {
        return (this.storage.value === 'repo') &&
            this.repoData.isUndefined() &&
            this.method.isResolved && this.method.value === Method.Create;
    }
    canAskToChooseGistOrRepo(): boolean {
        if (this.gistId.isResolved()) {
            // We already know that we are associated with a Gist.
            return false;
        }
        else if (this.repo.isResolved()) {
            // We already know that we are associated with a Repository.
            return false;
        }
        // We can ask the question if it has not been asked.
        return this.storage.isUndefined();
    }
    canCreateGist(): boolean {
        return (this.storage.value === 'gist') && this.gistId.isUndefined() && this.uploadedAt.isUndefined();
    }
    canDetermineRepoExists(): boolean {
        if (this.repoExists.isUndefined()) {
            if (this.storage.value === 'repo') {
                return this.repo.isResolved();
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    canUpdateGist(): boolean {
        return this.gistId.isResolved() && this.uploadedAt.isUndefined();
    }
    canCreateRepo(): boolean {
        // Is this consistent with our goals?
        if (this.storage.value === 'repo' && this.method.value === Method.Create) {
            if (this.repoExists.value === true) {
                // Don't try to create it if it already exists
                return false;
            }
            else {
                // Do it if we satsify the preconditions.
                return this.repoData.isResolved();
            }
        }
        else {
            // Don't create the repo because that's not our goal.
            return false;
        }
    }
    canUploadToRepo(): boolean {
        return (
            this.storage.value === 'repo') &&
            this.owner.isResolved() &&
            this.repo.isResolved() &&
            this.repoExists.isResolved && this.repoExists.value === true &&
            this.commitMessage.isResolved() &&
            this.ref.isResolved() &&
            this.uploadMessage.isUndefined();
    }
}
