import { LanguageModeId } from '../../virtual/editor';

/**
 *
 */
export class DoodleFile {

    /**
     * The text content of the file, unencoded.
     */
    public content: string;

    /**
     * The file is open for editing.
     */
    public isOpen: boolean;
    /**
     * The mode of the file refers to the computing language canonical name.
     */
    public language: LanguageModeId | undefined;
    public htmlChoice: boolean;
    public markdownChoice: boolean;
    public raw_url: string | undefined;
    public selected: boolean;

    /**
     *
     */
    constructor() {
        this.content = "";
        this.isOpen = true;
        this.htmlChoice = false;
        this.markdownChoice = false;
        this.selected = false;
    }

    /**
     *
     */
    clone(): DoodleFile {
        const copy = new DoodleFile();
        copy.content = this.content;
        copy.isOpen = this.isOpen;
        copy.language = this.language;
        copy.raw_url = this.raw_url;
        copy.selected = this.selected;
        return copy;
    }
}
