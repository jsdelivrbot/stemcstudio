declare module "js-beautify" {

    interface JSFormatCodeOptions {
        /**
         * 
         */
        indent_size?: number; // (4) — indentation size,
        /**
         * 
         */
        indent_char?: string; // (space) — character to indent with,
        preserve_newlines?: boolean;
        max_preserve_newlines?: number;
        jslint_happy?: boolean;
        brace_style?: string;
        space_before_conditional?: boolean;
        unescape_strings?: boolean;
        wrap_line_length?: number;
        /**
         * 
         */
        selector_separator_newline?: boolean; // (true) - separate selectors with newline or not (e.g. "a,\nbr" or "a, br")
        /**
         * 
         */
        end_with_newline?: boolean; // (false) - end with a newline
        /**
         * 
         */
        newline_between_rules?: boolean; // (true) - add a new line after every css rule
    }

    interface CSSFormatCodeOptions {
        /**
         * Indentation size [4]
         */
        indent_size?: number;
        /**
         * Indentation character [" "]
         */
        indent_char?: string;
        /**
         * Indent with tabs 
         */
        indent_with_tabs?: boolean;
        /**
         * Character(s) to use as line terminators. ["\n"] 
         */
        eol?: string;
        /**
         * End output with newline [false]
         */
        end_with_newline?: boolean;
        /**
         * Add a newline between multiple selectors [true]
         */
        selector_separator_newline?: boolean;
        /**
         * Add a newline between CSS rules [true]
         */
        newline_between_rules?: boolean;
    }

    interface HTMLFormatCodeOptions {
        /**
         * Indentation size [4]
         */
        indent_size?: number;
        /**
         * Indentation character [" "]
         */
        indent_char?: string;
        /**
         * Indent with tabs 
         */
        indent_with_tabs?: boolean;
        /**
         * Character(s) to use as line terminators. ["\n"] 
         */
        eol?: string;
        /**
         * End output with newline [false]
         */
        end_with_newline?: boolean;
        /**
         * Preserve existing linebreaks 
         */
        preserve_newlines?: boolean;
        /**
         * Maximum number of line-breaks to be preserved in one chunk [10] 
         */
        max_preserve_newlines?: number;
        /**
         * Indent <head> and <body> sections [false] 
         */
        indent_inner_html?: boolean;
        /**
         * 
         */
        brace_style?: string;

        /**
         * 
         */
        indent_scripts?: 'keep' | 'separate' | 'normal';
        /**
         * Maximum characters per line (0 disables) [250]
         */
        wrap_line_length?: number;
        /**
         * ["auto"] 
         */
        wrap_attributes?: 'auto' | 'force' | 'force-aligned' | 'force-expand-multiline';
    }

    interface BeautifyCSS {
        (text: string, options: CSSFormatCodeOptions): string;
    }

    interface BeautifyJS {
        (text: string, options: JSFormatCodeOptions): string;
    }

    interface BeautifyHTML {
        (text: string, options: HTMLFormatCodeOptions): string;
    }

    export const css: BeautifyCSS;
    export const js: BeautifyJS;
    export const html: BeautifyHTML;
}
