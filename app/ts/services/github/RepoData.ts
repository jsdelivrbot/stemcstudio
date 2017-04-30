/**
 * 
 */
export interface RepoData {

    /**
     * The name of the repository.
     */
    name: string;

    /**
     * A short description of the repository.
     */
    description?: string;

    /**
     * A URL with more information about the repository
     */
    homepage?: string;

    /**
     * Either true to create a private repository, or false to create a public one.
     * Creating private repositories requires a paid GitHub account.
     * Default: false
     */
    private?: boolean;

    /**
     * Either true to enable issues for this repository, false to disable them.
     * Default: true
     */
    has_issues?: boolean;

    /**
     * Either true to enable the wiki for this repository, false to disable it.
     * Default: true
     */
    has_wiki?: boolean;

    /**
     * Either true to enable downloads for this repository, false to disable them.
     * Default: true
     */
    has_downloads?: boolean;

    /**
     * The id of the team that will be granted access to this repository.
     * This is only valid when creating a repository in an organization.
     */
    team_id?: number;

    /**
     * Pass true to create an initial commit with empty README.
     * Default: false
     */
    auto_init?: boolean;

    /**
     * Desired language or platform .gitignore template to apply.
     * Use the name of the template without the extension.
     * For example, "Haskell".
     */
    gitignore_template?: string;

    /**
     * Desired LICENSE template to apply.
     * Use the name of the template without the extension.
     * For example, "mit" or "mozilla".
     */
    license_template?: string;
}
