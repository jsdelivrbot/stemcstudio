declare module Showdown {
    class Converter {
        constructor();
        makeHtml(html:string): string;
    }
}

declare module "showdown" {
    export = Showdown;
}