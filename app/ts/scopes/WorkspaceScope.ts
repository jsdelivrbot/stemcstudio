import DoodleScope from './DoodleScope';

interface WorkspaceScope extends DoodleScope {

    isEditMode: boolean;
    toggleMode: () => void;

    toggleText: string;

    isViewVisible: boolean;
    toggleView: () => void;

    updateView(): void;
    updatePreview(delay: number): void;
    previewIFrame: HTMLIFrameElement;
}

export default WorkspaceScope;
