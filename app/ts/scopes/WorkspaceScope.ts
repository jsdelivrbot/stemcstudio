import { DoodleScope } from './DoodleScope';
import { WsModel } from '../modules/wsmodel/WsModel';
import { WsFile } from '../modules/wsmodel/WsFile';

export interface WorkspaceScope extends DoodleScope {
    /**
     * Reflects the URL parameter indicating whether we are running in embedded mode. 
     */
    embed: boolean;

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

    isCodeVisible: boolean;

    isViewVisible: boolean;
    toggleView: () => void;

    comments: { type: string; msg: string }[];
    isCommentsVisible: boolean;
    toggleCommentsVisible(): void;
    githubGistPageURL(): string;

    isMarkdownVisible: boolean;
    toggleMarkdownVisible(): void;

    /**
     * Label the project with a title, description, keywords, and license.
     */
    doLabelsAndTags(): void;

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

    // We can probably kill this in refactoring cleanup.
    updatePreview(delay: number): void;

    /**
     * 
     */
    // We can probably kill this in refactoring cleanup.
    previewIFrame: HTMLIFrameElement | undefined;
}
