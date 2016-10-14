/**
 * This is mixed in to the DoodleScope, so it is essentially a contribution to the workspace.
 */
interface ProblemsMixin {
    toggleProblems(): void;
    isProblemsVisible: boolean;
}

export default ProblemsMixin;
