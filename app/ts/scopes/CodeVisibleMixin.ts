/**
 * This is mixed in to the DoodleScope, so it is essentially a contribution to the workspace.
 */
export interface CodeVisibleMixin {
    /**
     * 
     */
    toggleCodeVisible(): void;
    /**
     * 
     */
    isCodeVisible: boolean;
    /**
     * 
     */
    isExplorerVisible: boolean;
}
