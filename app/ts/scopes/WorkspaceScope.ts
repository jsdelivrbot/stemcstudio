import DoodleScope from './DoodleScope';

interface WorkspaceScope extends DoodleScope {

    isEditMode: boolean;
    toggleMode: () => void;

    isViewVisible: boolean;
    toggleView: () => void;

    isReadMeVisible: boolean;
    toggleReadMeVisible: () => void;

    /**
     * View the specified (HTML) file in the Viewer.
     */
    doView(name: string): void;

    // We can probably kill these in refactoring cleanup.
    updateView(): void;
    updatePreview(delay: number): void;
    previewIFrame: HTMLIFrameElement;
}

export default WorkspaceScope;
