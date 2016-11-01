declare module Showdown {

    interface Replace {
        /**
         * This is just the replacer function argument to String.prototype.replace, signature from lib.d.ts
         */
        replace(substring: string, ...args: any[]): string;
    }

    interface Extension {
        /**
         * Describes what type of extension - language ext or output modifier.
         * If absent, 'output modifier' type is assumed (contrary to comments in source).
         */
        type?: string;
    }

    interface LangExtension extends Extension {
        filter?(text: string): string;
    }

    interface OutputModifier extends Extension {
        /** Used to build a Regex */
        regex?: string;
        /** Similar to arg to String.prototype.replace (which is in fact called under the hood) */
        replace?: string | Replace;
    }

    interface ShowdownExtension extends LangExtension, OutputModifier {
    }

    interface Plugin {
        (converter: Converter): ShowdownExtension[];
    }

    interface ConverterOptions {
        extensions?: (string | Plugin)[];
        tables?: boolean;
    }

    class Converter {
        constructor(options?: ConverterOptions);
        makeHtml(html: string): string;
    }
}

declare module "showdown" {
    export = Showdown;
}