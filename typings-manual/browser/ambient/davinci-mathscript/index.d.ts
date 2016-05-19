//
// davinci-mathscript.d.ts
//
// This file was created manually in order to support the davinci-mathscript library.
//
declare module Ms {
    export var VERSION: string;
    export function transpile(code: string): string;
}

declare module 'davinci-mathscript' {
  export default Ms;
}
