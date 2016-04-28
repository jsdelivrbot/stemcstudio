import createAnchor from "./createAnchor";
import createDocument from "./createDocument";
import createEditor from "./createEditor";
import createEditSession from "./createEditSession";
import createFold from "./createFold";
import createFoldLine from "./createFoldLine";
import createRange from "./createRange";
import createRenderer from "./createRenderer";
import createTokenizer from "./createTokenizer";
import createUndoManager from "./createUndoManager";
import createWorkerClient from "./createWorkerClient";
import Workspace from "./workspace/Workspace";

import createCssMode from "./mode/createCssMode";
import createHtmlMode from "./mode/createHtmlMode";
import createJavaScriptMode from "./mode/createJavaScriptMode";
import createMarkdownMode from "./mode/createMarkdownMode";
import createTextMode from "./mode/createTextMode";
import createTypeScriptMode from "./mode/createTypeScriptMode";
import createXmlMode from "./mode/createXmlMode";

import edit from "./edit";

/**
 * @module ace
 */
const ace = {

    /**
     * @property createAnchor
     * @type (doc: Document, row: number, column: number) => Anchor
     * @readOnly
     */
    get createAnchor() { return createAnchor; },

    /**
     * @property createDocument
     * @type (textOrLines: string | string[]) => Document
     * @readOnly
     */
    get createDocument() { return createDocument; },

    /**
     * @property createEditor
     * @type (renderer: Renderer, session: EditSession) => Editor
     * @readOnly
     */
    get createEditor() { return createEditor; },

    /**
     * @property createEditSession
     * @type (doc: Document) => EditSession
     * @readOnly
     */
    get createEditSession() { return createEditSession; },

    /**
     * @property createFold
     * @type (range: Range, placeholder: string) => Fold
     * @readOnly
     */
    get createFold() { return createFold; },

    /**
     * @property createFoldLine
     * @type (foldData: any, folds: Fold[]) => FoldLine
     * @readOnly
     */
    get createFoldLine() { return createFoldLine; },

    /**
     * @property createRange
     * @type (startRow: number, startColumn: number, endRow: number, endColumn: number) => Range
     * @readOnly
     */
    get createRange() { return createRange; },

    /**
     * @property createRenderer
     * @type (container: HTMLElement) => Renderer
     * @readOnly
     */
    get createRenderer() { return createRenderer; },

    /**
     * @property createTokenizer
     * @type (rules: { [name: string]: Rule[] }) => Tokenizer
     * @readOnly
     */
    get createTokenizer() { return createTokenizer; },

    /**
     * @property createUndoManager
     * @type () => UndoManager
     * @readOnly
     */
    get createUndoManager() { return createUndoManager; },

    /**
     * @property createWorkerClient
     * @type (workerUrl: string) => WorkerClient
     * @readOnly
     */
    get createWorkerClient() { return createWorkerClient; },

    /**
     * @property Workspace
     * @type new() => Workspace
     * @readOnly
     */
    get Workspace() { return Workspace; },

    /**
     * @property edit
     * @type (container: HTMLElement) => Editor
     * @readOnly
     */
    get edit() { return edit; },

    get createCssMode() { return createCssMode; },
    get createHtmlMode() { return createHtmlMode; },
    get createJavaScriptMode() { return createJavaScriptMode; },
    get createMarkdownMode() { return createMarkdownMode; },
    get createTextMode() { return createTextMode; },
    get createTypeScriptMode() { return createTypeScriptMode; },
    get createXmlMode() { return createXmlMode; }
};

export default ace;
