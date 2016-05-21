import DoodleScope from './DoodleScope';
import Doodle from '../services/doodles/Doodle';

interface WorkspaceScope extends DoodleScope {

    /**
     * 
     */
    currentDoodle(): Doodle;

    /**
     * The doodle is loaded when it has been loaded from GitHub or Local Storage.
     */
    doodleLoaded: boolean;

    /**
     * HTML files determine the applications that can be viewed.
     */
    htmlFileCount(): number;

    /**
     * HTML files determine the applications that can be viewed.
     */
    markdownFileCount(): number;

    /**
     * The workspace is loaded when it has all the file content, and compiler settings.
     */
    workspaceLoaded: boolean;

    isEditMode: boolean;
    toggleMode: () => void;

    isViewVisible: boolean;
    toggleView: () => void;

    isReadMeVisible: boolean;
    toggleReadMeVisible: () => void;

    /**
     * Label the project with a title, description, keywords, and license.
     */
    doLabel(): void;

    /**
     * 
     */
    doProperties(): void;

    /**
     * Publish
     */
    doPublish(): void;

    /**
     * Upload
     */
    doUpload(): void;

    /**
     * View the specified (HTML) file in the Viewer.
     */
    doView(name: string): void;

    // We can probably kill these in refactoring cleanup.
    updatePreview(delay: number): void;
    previewIFrame: HTMLIFrameElement;
}

export default WorkspaceScope;
