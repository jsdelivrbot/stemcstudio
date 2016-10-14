/**
 * This is mixed in to the DoodleScope, so it is essentially a contribution to the workspace.
 */
interface ExplorerMixin {
    toggleExplorer(): void;
    isExplorerVisible: boolean;
}

export default ExplorerMixin;
