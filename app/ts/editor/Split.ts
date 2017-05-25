import Editor from './Editor';
import EditSession from './EditSession';
import KeyboardHandler from './keyboard/KeyboardHandler';
import { Renderer } from './Renderer';
import { UndoManager } from './UndoManager';
/**
 * FIXME: Cloning appears to be used by the Split feature.
 * This implementation looks wierd.
 */
function $cloneFoldData(): FoldLine[] {
    let fd: FoldLine[] = [];
    fd = this.foldLines_.map(function (foldLine) {
        const folds = foldLine.folds.map(function (fold) {
            return fold.clone();
        });
        return new FoldLine(fd, folds);
    });

    return fd;
}

export class Split {
    private BELOW: number;
    private BESIDE: number;
    private $orientation: number;
    private $fontSize = "";
    private $editorCSS: string;
    private $editors: Editor[];
    private $cEditor: Editor;
    private $splits: number;
    private $container: HTMLDivElement;
    constructor(container: HTMLDivElement, theme, splits) {
        this.BELOW = 1;
        this.BESIDE = 0;

        this.$container = container;
        this.$theme = theme;
        this.$splits = 0;
        this.$editorCSS = "";
        this.$editors = [];
        this.$orientation = this.BESIDE;

        this.setSplits(splits || 1);
        this.$cEditor = this.$editors[0];


        this.on("focus", function (editor) {
            this.$cEditor = editor;
        }.bind(this));
    }

    $createEditor() {
        const el = document.createElement("div");
        el.className = this.$editorCSS;
        el.style.cssText = "position: absolute; top:0px; bottom:0px";
        this.$container.appendChild(el);
        const editor = new Editor(new Renderer(el/*, this.$theme*/), void 0);

        editor.on("focus", function () {
            this._emit("focus", editor);
        }.bind(this));

        this.$editors.push(editor);
        editor.setFontSize(this.$fontSize);
        return editor;
    }

    setSplits(splits: number) {
        if (splits < 1) {
            throw new Error("The number of splits must be greater than zero.");
        }

        if (splits === this.$splits) {
            return;
        }
        else if (splits > this.$splits) {
            while (this.$splits < this.$editors.length && this.$splits < splits) {
                const editor = this.$editors[this.$splits];
                this.$container.appendChild(editor.container);
                editor.setFontSize(this.$fontSize);
                this.$splits++;
            }
            while (this.$splits < splits) {
                this.$createEditor();
                this.$splits++;
            }
        }
        else {
            while (this.$splits > splits) {
                const editor = this.$editors[this.$splits - 1];
                this.$container.removeChild(editor.container);
                this.$splits--;
            }
        }
        this.resize();
    }

    /**
     * Returns the number of splits.
     */
    getSplits(): number {
        return this.$splits;
    }

    /**
     * Returns the editor identified by the index `idx`.
     * @param idx The index of the editor you want
     */
    getEditor(idx: number) {
        return this.$editors[idx];
    }

    /** 
     * Returns the current editor.
     */
    getCurrentEditor(): Editor {
        return this.$cEditor;
    }

    /** 
     * Focuses the current editor.
     */
    focus(): void {
        this.$cEditor.focus();
    }

    /** 
     * Blurs the current editor.
     */
    blur(): void {
        this.$cEditor.blur();
    }

    /** 
     * Sets a theme for each of the available editors.
     * @param theme The name of the theme to set
     */
    setTheme(themeId: string, href?: string) {
        this.$editors.forEach(function (editor) {
            editor.setThemeCss(themeId, href);
        });
    }

    /** 
     * Sets the keyboard handler for the editor.
     * @param keybinding 
     * 
     */
    setKeyboardHandler(keyboardHandler: KeyboardHandler) {
        this.$editors.forEach(function (editor) {
            editor.setKeyboardHandler(keyboardHandler);
        });
    }

    /** 
     * Executes `callback` on all of the available editors.
     * @param {Function} callback A callback function to execute.
     * @param {String} scope The default scope for the callback.
     */
    forEach(callback, scope?) {
        this.$editors.forEach(callback, scope);
    }


    /** 
     * Sets the font size, in pixels, for all the available editors.
     * @param size The new font size.
     */
    setFontSize(fontSize: string) {
        this.$fontSize = fontSize;
        this.$editors.forEach(function (editor) {
            editor.setFontSize(fontSize);
        });
    }

    /**
     * FIXME: Clone should be a standalone function, not a method. 
     */
    $cloneSession(session: EditSession) {
        const s = new EditSession(session.getDocument()/*, session.getMode()*/);

        const undoManager = session.getUndoManager();
        if (undoManager) {
            const undoManagerProxy = new UndoManagerProxy(undoManager, s);
            s.setUndoManager(undoManagerProxy);
        }

        // Overwrite the default $informUndoManager function such that new delas
        // aren't added to the undo manager from the new and the old session.
        s.$informUndoManager = lang.delayedCall(function () { s.$deltas = []; });

        // Copy values from the session.
        s.setTabSize(session.getTabSize());
        s.setUseSoftTabs(session.getUseSoftTabs());
        s.setOverwrite(session.getOverwrite());
        s.setBreakpoints(session.getBreakpoints());
        s.setUseWrapMode(session.getUseWrapMode());
        s.setUseWorker(session.getUseWorker());

        const wrapLimitRange = session.getWrapLimitRange();
        s.setWrapLimitRange(wrapLimitRange.min, wrapLimitRange.max);

        s.$foldData = session.$cloneFoldData();

        return s;
    }

    /** 
     * Sets a new EditSession for the indicated editor.
     * @param session The new edit session
     * @param idx The editor's index you're interested in
     */
    setSession(session: EditSession, idx: number): EditSession {
        let editor;
        if (idx == null) {
            editor = this.$cEditor;
        }
        else {
            editor = this.$editors[idx];
        }

        // Check if the session is used already by any of the editors in the
        // split. If it is, we have to clone the session as two editors using
        // the same session can cause terrible side effects (e.g. UndoQueue goes
        // wrong). This also gives the user of Split the possibility to treat
        // each session on each split editor different.
        const isUsed = this.$editors.some(function (editor) {
            return editor.session === session;
        });

        if (isUsed) {
            session = this.$cloneSession(session);
        }
        editor.setSession(session);

        // Return the session set on the editor. This might be a cloned one.
        return session;
    }

    /** 
     * 
     * Returns the orientation.
     */
    getOrientation(): number {
        return this.$orientation;
    }

    /** 
     * Sets the orientation.
     * @param orientation The new orientation value.
     */
    setOrientation(orientation: number) {
        if (this.$orientation === orientation) {
            return;
        }
        this.$orientation = orientation;
        this.resize();
    }

    /**  
     * Resizes the editor.
     */
    resize() {
        const width = this.$container.clientWidth;
        const height = this.$container.clientHeight;

        if (this.$orientation === this.BESIDE) {
            const editorWidth = width / this.$splits;
            for (let i = 0; i < this.$splits; i++) {
                const editor = this.$editors[i];
                editor.container.style.width = editorWidth + "px";
                editor.container.style.top = "0px";
                editor.container.style.left = i * editorWidth + "px";
                editor.container.style.height = height + "px";
                editor.resize();
            }
        }
        else {
            const editorHeight = height / this.$splits;
            for (let i = 0; i < this.$splits; i++) {
                const editor = this.$editors[i];
                editor.container.style.width = width + "px";
                editor.container.style.top = i * editorHeight + "px";
                editor.container.style.left = "0px";
                editor.container.style.height = editorHeight + "px";
                editor.resize();
            }
        }
    }
}

class UndoManagerProxy {
    private $u: UndoManager;
    private $doc: EditSession;
    constructor(undoManager: UndoManager, session: EditSession) {
        this.$u = undoManager;
        this.$doc = session;
    }

    execute(options) {
        this.$u.execute(options);
    }

    undo(dontSelect?: boolean) {
        const selectionRange = this.$u.undo(true);
        if (selectionRange) {
            this.$doc.selection.setSelectionRange(selectionRange);
        }
    }

    redo(dontSelect?: boolean) {
        const selectionRange = this.$u.redo(true);
        if (selectionRange) {
            this.$doc.selection.setSelectionRange(selectionRange);
        }
    }

    reset() {
        this.$u.reset();
    }

    hasUndo() {
        return this.$u.hasUndo();
    }

    hasRedo() {
        return this.$u.hasRedo();
    }
}
