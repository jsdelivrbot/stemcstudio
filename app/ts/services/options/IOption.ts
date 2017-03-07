/**
 * The implementation of a JavaScript library dictates how it may be loaded.
 */
export enum LibraryKind {
    /**
     * The library provides a property in the global namespace.
     * The library must be loaded using a script tag. 
     */
    Global = 1,
    /**
     * The library must be loaded using a module loader.
     */
    Modular = 2,
    /**
     * The library may be loaded using a module loader.
     * It may also be loaded without a module loader (a script tag), in which case
     * it will provide a property in the global namespace.
     */
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
     */
    packageName: string;

    /**
     * Determines how the library should be loaded.
     * Global libraries are loaded using a <script> tag in the HTML.
     * Modular libraries are loaded using a Map Config.
     * UMD libraries may be loaded in both ways.
     */
    libraryKind: LibraryKind;

    /**
     * The name that is used for ES6 imports if the library is Modular or UMD.
     * This name is not fixed by the library implementation and may be changed
     * for convenience.
     */
    moduleName?: string;

    /**
     * The name that applies when the library becomes a property on the global namespace.
     * If the library is exposed as a property of the global namespace, then the name is
     * fixed by the library implementation.
     */
    globalName?: string;

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
     * TypeScript definition file.
     */
    dts: string;

    /**
     * JavaScript.
     */
    js: string[];

    /**
     * JavaScript - minified.
     */
    minJs: string[];

    /**
     * The dependencies expressed as packageName => semantic version dependency map.
     */
    dependencies: { [packageName: string]: string };
}

export default IOption;
