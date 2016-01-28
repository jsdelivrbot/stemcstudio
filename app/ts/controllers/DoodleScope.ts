import BodyScope from './BodyScope';
import IDoodle from '../services/doodles/IDoodle';

interface DoodleScope extends BodyScope {
    /**
     * @param label Used by Universal Analytics to categorize events.
     * @param value Values must be non-negative. Useful to pass counts.
     */
    showHTML: (label?: string, value?: number) => void;
    /**
     * @param label Used by Universal Analytics to categorize events.
     * @param value Values must be non-negative. Useful to pass counts.
     */
    showCode: (label?: string, value?: number) => void;
    /**
     * @param label Used by Universal Analytics to categorize events.
     * @param value Values must be non-negative. Useful to pass counts.
     */
    showLibs: (label?: string, value?: number) => void;
    /**
     * @param label Used by Universal Analytics to categorize events.
     * @param value Values must be non-negative. Useful to pass counts.
     */
    showLess: (label?: string, value?: number) => void;

    isShowingHTML: boolean;
    isShowingCode: boolean;
    isShowingLibs: boolean;
    isShowingLess: boolean;

    isEditMode: boolean;
    toggleText: string;
    toggleMode: () => void;

    isViewVisible: boolean;
    toggleView: () => void;

    doNew: () => void;
    doOpen: () => void;
    doCopy: () => void;
    doProperties(): void;
    doHelp: () => void;

    doUpload(): void;

    goHome: () => void;

    templates: IDoodle[];

    updateView(): void;
    updatePreview(delay: number): void;
    previewIFrame: HTMLIFrameElement;
}

export default DoodleScope;
