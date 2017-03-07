export enum LibraryKind {
    Global = 1,
    Modular = 2,
    UMD = 3
}

// Removing until transition to Modular and UMD is complete.
/*
export function isGlobalLibrary(option: IOption): boolean {
    return option.libraryKind === LibraryKind.Global;
}
*/

export function isGlobalOrUMDLibrary(option: IOption): boolean {
    return option.libraryKind === LibraryKind.Global || option.libraryKind === LibraryKind.UMD;
}

export function isModularOrUMDLibrary(option: IOption): boolean {
    return option.libraryKind === LibraryKind.Modular || option.libraryKind === LibraryKind.UMD;
}


/**
 *
 */
export interface IOption {

    /**
     * The name is the unique identifier and correlates with the NPM or Bower name.
     * It is the name that is used for ES6 imports if the library is Modular or UMD.
     */
    moduleName: string;

    /**
     * The name that applies when the library becomes a property on the global namespace.
     */
    globalName: string;

    /**
     *
     */
    description: string;

    /**
     *
     */
    homepage: string;

    /**
     * The semantic version.
     */
    version: string;

    /**
     * Determines whether the option is visible to the user.
     */
    visible: boolean;

    /**
     * Cascading Style Sheets.
     */
    css: string[];

    /**
     * TypeScript definitions.
     */
    dts: string[];

    /**
     * JavaScript.
     */
    js: string[];

    /**
     * JavaScript - minified.
     */
    minJs: string[];

    /**
     * Determines how the library should be loaded.
     * Global libraries are loaded using a <script> tag in the HTML.
     * Modular libraries are loaded using a Map Config.
     * UMD libraries may be loaded in both ways.
     */
    libraryKind: LibraryKind;

    /**
     * The dependencies expressed as moduleName => semantic version dependency map.
     */
    dependencies: { [moduleName: string]: string };
}

export default IOption;
