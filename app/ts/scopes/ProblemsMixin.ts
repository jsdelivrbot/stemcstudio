/**
 * This is mixed in to the DoodleScope, so it is essentially a contribution to the workspace.
 */
export interface ProblemsMixin {
    toggleProblems(): void;
    isProblemsVisible: boolean;
}
