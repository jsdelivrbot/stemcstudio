import { createDelayedCall } from '../lib/lang/createDelayedCall';
import { DelayedCall } from '../lib/lang/DelayedCall';
import { setCssClass } from '../lib/dom';
import { keyCodeToString } from '../lib/keys';
import { addListener, addCommandKeyListener, stopEvent, stopPropagation } from '../lib/event';
import { KeyboardHandler } from '../keyboard/KeyboardHandler';
import { Range } from '../Range';
import { Editor } from '../../editor/Editor';

// TODO: Need to negotiate with Editor to install (disposable) extension.
const SEARCH_EXTENSION = "searchBox";

const html = '<div class="ace_search right">\
    <button type="button" action="hide" class="ace_searchbtn_close" title="Close (Esc)"></button>\
    <div class="ace_search_form">\
        <input class="ace_search_field" placeholder="Find" spellcheck="false"></input>\
        <button type="button" action="findPrev" class="ace_searchbtn prev" title="Previous match (Shift+F3)"></button>\
        <button type="button" action="findNext" class="ace_searchbtn next" title="Next match (F3)"></button>\
    </div>\
    <div class="ace_replace_form">\
        <input class="ace_search_field" placeholder="Replace" spellcheck="false"></input>\
        <button type="button" action="replaceAndFindPrev" class="ace_replacebtn prev" title="Replace and Find Previous"></button>\
        <button type="button" action="replaceAndFindNext" class="ace_replacebtn next" title="Replace and Find Next"></button>\
        <!--button type="button" action="replaceAll"         class="ace_replacebtn all"  title="Replace All"></button-->\
    </div>\
    <div class="ace_search_options">\
        <span action="toggleCaseSensitive" class="ace_button" title="Match Case (Alt+C)">Aa</span>\
        <span action="toggleWholeWords" class="ace_button" title="Match Whole Word (Alt+W)">Word</span>\
        <span action="toggleRegexpMode" class="ace_button" title="Use Regular Expression (Alt+R)">.*</span>\
    </div>\
</div>'.replace(/>\s+/g, ">");

class SearchBox {
    private editor: Editor;
    private element: HTMLDivElement;
    private searchForm: HTMLDivElement;
    private replaceForm: HTMLDivElement;
    public searchOptions: Element;
    private regExpOption: HTMLInputElement;
    private caseSensitiveOption: HTMLInputElement;
    private wholeWordOption: HTMLInputElement;
    private searchInput: HTMLInputElement;
    private replaceInput: HTMLInputElement;
    /**
     * 
     */
    private activeInput: HTMLInputElement;
    private $closeSearchBarKb: KeyboardHandler<Editor>;
    private $searchBarKb: KeyboardHandler<Editor>;
    public isReplace: boolean;
    private $onChange: DelayedCall;
    /**
     * 
     */
    constructor(editor: Editor, unused?: Range, showReplaceForm?: boolean) {
        const div = document.createElement("div");
        div.innerHTML = html;
        // The cast is allowed because of the way the html variable is defined above.
        this.element = <HTMLDivElement>div.firstChild;

        this.$init(editor);
        this.setEditor(editor);

        this.$closeSearchBarKb = new KeyboardHandler([{
            bindKey: "Esc",
            name: "closeSearchBar",
            exec: function (editor: Editor) {
                // FIXME
                editor[SEARCH_EXTENSION].hide();
            }
        }]);

        this.$searchBarKb = new KeyboardHandler<Editor>();
        this.$searchBarKb.bindKeys({
            "Ctrl-F|Command-F": () => {
                // const isReplace = sb.isReplace = !sb.isReplace;
                // sb.replaceForm.style.display = isReplace ? "" : "none";
                this.searchInput.focus();
            },
            "Ctrl-H|Command-H": () => {
                this.replaceForm.style.display = "";
                this.replaceInput.focus();
            },
            "F3|Ctrl-G|Command-G": () => {
                this.findNext();
            },
            "Shift-F3|Ctrl-Shift-G|Command-Shift-G": () => {
                this.findPrev();
            },
            "esc": () => {
                setTimeout(() => { this.hide(); });
            },
            "Return": () => {
                if (this.activeInput === this.replaceInput) {
                    this.replace();
                }
                this.findNext();
            },
            "Shift-Return": () => {
                if (this.activeInput === this.replaceInput) {
                    this.replace();
                }
                this.findPrev();
            },
            "Alt-Return": () => {
                if (this.activeInput === this.replaceInput) {
                    this.replaceAll();
                }
                this.findAll();
            },
            "Tab": () => {
                (this.activeInput === this.replaceInput ? this.searchInput : this.replaceInput).focus();
            }
        });
        this.$searchBarKb.addCommands([
            {
                name: "toggleRegexpMode",
                bindKey: { win: "Alt-R|Alt-/", mac: "Ctrl-Alt-R|Ctrl-Alt-/" },
                exec: () => {
                    this.regExpOption.checked = !this.regExpOption.checked;
                    this.$syncOptions();
                }
            },
            {
                name: "toggleCaseSensitive",
                bindKey: { win: "Alt-C|Alt-I", mac: "Ctrl-Alt-R|Ctrl-Alt-I" },
                exec: () => {
                    this.caseSensitiveOption.checked = !this.caseSensitiveOption.checked;
                    this.$syncOptions();
                }
            },
            {
                name: "toggleWholeWords",
                bindKey: { win: "Alt-B|Alt-W", mac: "Ctrl-Alt-B|Ctrl-Alt-W" },
                exec: () => {
                    this.wholeWordOption.checked = !this.wholeWordOption.checked;
                    this.$syncOptions();
                }
            }
        ]);
    }
    setEditor(editor: Editor) {
        // FIXME
        editor[SEARCH_EXTENSION] = this;
        editor.getContainer().appendChild(this.element);
        this.editor = editor;
    }
    $initElements(sb: HTMLDivElement) {
        this.searchForm = <HTMLDivElement>sb.querySelector(".ace_search_form");
        this.replaceForm = <HTMLDivElement>sb.querySelector(".ace_replace_form");
        this.searchOptions = sb.querySelector(".ace_search_options") as Element;
        this.regExpOption = <HTMLInputElement>sb.querySelector("[action=toggleRegexpMode]");
        this.caseSensitiveOption = <HTMLInputElement>sb.querySelector("[action=toggleCaseSensitive]");
        this.wholeWordOption = <HTMLInputElement>sb.querySelector("[action=toggleWholeWords]");
        this.searchInput = <HTMLInputElement>this.searchForm.querySelector(".ace_search_field");
        this.replaceInput = <HTMLInputElement>this.replaceForm.querySelector(".ace_search_field");
    }
    $init(editor: Editor) {
        /**
         * The SearchBox element.
         */
        const sb = this.element;

        this.$initElements(sb);

        addListener(sb, "mousedown", (e) => {
            setTimeout(() => {
                this.activeInput.focus();
            }, 0);
            stopPropagation(e);
        });
        addListener(sb, "click", (e: MouseEvent) => {
            const t = e.srcElement;
            if (t) {
                const action = t.getAttribute("action");
                if (action && this[action]) {
                    this[action]();
                }
                else if (action && this.$searchBarKb.commands[action]) {
                    const command = this.$searchBarKb.commands[action];
                    if (command.exec) {
                        command.exec(editor);
                    }
                }
            }
            stopPropagation(e);
        });

        addCommandKeyListener(sb, (e: Event, hashId: number, keyCode: number) => {
            const keyString = keyCodeToString(keyCode);
            const command = this.$searchBarKb.findKeyCommand(hashId, keyString);
            if (command && command.exec) {
                command.exec(editor);
                stopEvent(e);
            }
        });

        this.$onChange = createDelayedCall(() => {
            this.find(false, false);
        });

        addListener(this.searchInput, "input", () => {
            this.$onChange.schedule(20);
        });

        addListener(this.searchInput, "focus", () => {
            this.activeInput = this.searchInput;
            if (this.searchInput.value) {
                this.highlight();
            }
        });

        addListener(this.replaceInput, "focus", () => {
            this.activeInput = this.replaceInput;
            if (this.searchInput.value) {
                this.highlight();
            }
        });
    }

    $syncOptions() {
        setCssClass(this.regExpOption, "checked", this.regExpOption.checked);
        setCssClass(this.wholeWordOption, "checked", this.wholeWordOption.checked);
        setCssClass(this.caseSensitiveOption, "checked", this.caseSensitiveOption.checked);
        this.find(false, false);
    }

    highlight(re?: RegExp): void {
        this.editor.highlight(re);
    }

    find(skipCurrent?: boolean, backwards?: boolean): void {
        const range = this.editor.find(this.searchInput.value, {
            skipCurrent: skipCurrent,
            backwards: backwards,
            wrap: true,
            regExp: this.regExpOption.checked,
            caseSensitive: this.caseSensitiveOption.checked,
            wholeWord: this.wholeWordOption.checked
        });
        const noMatch: boolean = !range && !!this.searchInput.value;
        setCssClass(this.searchForm, "ace_nomatch", noMatch);
        this.editor.findSearchBox(!noMatch);
        this.highlight();
    }
    findNext() {
        this.find(true, false);
    }
    findPrev() {
        this.find(true, true);
    }
    findAll() {
        const range = this.editor.findAll(this.searchInput.value, {
            regExp: this.regExpOption.checked,
            caseSensitive: this.caseSensitiveOption.checked,
            wholeWord: this.wholeWordOption.checked
        });
        const noMatch = !range && !!this.searchInput.value;
        setCssClass(this.searchForm, "ace_nomatch", noMatch);
        this.editor.findSearchBox(!noMatch);
        this.highlight();
        this.hide();
    }
    replace() {
        if (!this.editor.readOnly) {
            this.editor.replace(this.replaceInput.value);
        }
    }
    replaceAndFindPrev() {
        if (!this.editor.readOnly) {
            this.editor.replace(this.replaceInput.value);
            this.findPrev();
        }
    }
    replaceAndFindNext() {
        if (!this.editor.readOnly) {
            this.editor.replace(this.replaceInput.value);
            this.findNext();
        }
    }
    replaceAll() {
        if (!this.editor.readOnly) {
            this.editor.replaceAll(this.replaceInput.value);
        }
    }
    hide() {
        this.element.style.display = "none";
        this.editor.removeKeyboardHandler(this.$closeSearchBarKb);
        this.editor.focus();
    }
    show(value?: string, isReplace = false) {
        this.element.style.display = "";
        this.replaceForm.style.display = isReplace ? "" : "none";

        this.isReplace = isReplace;

        if (value) {
            this.searchInput.value = value;
        }
        this.searchInput.focus();
        this.searchInput.select();

        this.editor.addKeyboardHandler(this.$closeSearchBarKb);
    }
    isFocused() {
        const el = document.activeElement;
        return el === this.searchInput || el === this.replaceInput;
    }
}

/**
 * This function is called from the editor directive.
 */
export function showFindReplace(editor: Editor, isReplace?: boolean): void {
    const searchBox = editor[SEARCH_EXTENSION] as SearchBox;
    const sb = searchBox || new SearchBox(editor);
    sb.show(editor.getTextRange(), isReplace);
}
