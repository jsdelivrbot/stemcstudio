import DoodleScope from './DoodleScope';
import WsModel from '../modules/wsmodel/services/WsModel';
import WsFile from '../modules/wsmodel/services/WsFile';

interface WorkspaceScope extends DoodleScope {

    /**
     * 
     */
    FEATURE_ROOM_ENABLED: boolean;

    /**
     * 
     */
    workspace: WsModel;

    /**
     * The files in the workspace organized as a map.
     */
    files(): { [path: string]: WsFile };

    /**
     * The doodle is loaded when it has been loaded from GitHub or Local Storage.
     */
    doodleLoaded: boolean;

    /**
     * Determines whether we can, for example, click the brand icon to go home.
     * When application is embedded, we prevent such navigation.
     */
    isGoHomeEnabled: boolean;

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

    comments: { type: string; msg: string }[];
    isCommentsVisible: boolean;
    toggleCommentsVisible(): void;

    isMarkdownVisible: boolean;
    toggleMarkdownVisible(): void;

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
     * View the specified HTML (.html) file in the Viewer.
     */
    doChooseHtml(name: string): void;

    /**
     * View the specified Markdown (.md) file in the Viewer.
     */
    doChooseMarkdown(name: string): void;

    // We can probably kill these in refactoring cleanup.
    updatePreview(delay: number): void;
    previewIFrame: HTMLIFrameElement | undefined;
}

export default WorkspaceScope;
