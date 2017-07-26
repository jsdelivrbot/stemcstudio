export interface SubmitParams {

    /**
     * The owner of the GitHub Gist or Repository.
     */
    owner: string;
    gistId: string;

    /**
     * The name of the GitHub Repository.
     */
    repo: string;
    title: string;
    author: string;
    keywords: string[];

    /**
     * 
     */
    credentials: { [identityProviderName: string]: string };
}
