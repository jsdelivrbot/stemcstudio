import { NameStack } from "./name-stack";
import { IToken } from './IToken';
import { JSHintOptions } from "./JSHintOptions";

export interface IState {
    option: JSHintOptions;
    cache: {};
    condition: boolean;
    directive: { [name: string]: boolean };
    esVersion: number;
    funct: any;
    ignored: { [line: string]: boolean };
    tab: string;
    lines: string[];
    syntax: { [name: string]: IToken };
    forinifcheckneeded: boolean;
    forinifchecks: any[];
    isStrict(): boolean;
    stmtMissingStrict(): boolean;
    allowsGlobalUsd(): boolean;
    impliedClosure(): boolean;
    inMoz(): boolean;
    inES6(strict?: boolean): boolean;
    inES5(strict?: boolean): boolean;
    inClassBody: boolean;
    ignoredLines: { [line: number]: boolean };
    jsonMode: boolean;
    jsonWarnings: any[];
    nameStack: NameStack;
    inferEsVersion(): string | null;
    reset(): void;
    tokens: { prev: IToken; next: IToken; curr: IToken };
}

export const state: IState = {
    option: {},
    cache: {},
    condition: void 0,
    directive: {},
    esVersion: 6,
    forinifcheckneeded: false,
    forinifchecks: void 0,
    funct: null,
    ignored: {},
    tab: "",
    lines: [],
    syntax: {},
    jsonMode: false,
    jsonWarnings: void 0,
    nameStack: new NameStack(),
    tokens: { prev: null, next: null, curr: null },
    inClassBody: false,
    ignoredLines: {},

    /**
     * Determine if the code currently being linted is strict mode code.
     */
    isStrict: function (this: IState): boolean {
        return this.directive["use strict"] || this.inClassBody ||
            this.option.module || this.option.strict === "implied";
    },

    /**
     * Determine if the current state warrants a warning for statements outside
     * of strict mode code.
     *
     * While emitting warnings based on function scope would be more intuitive
     * (and less noisy), JSHint observes statement-based semantics in order to
     * preserve legacy behavior.
     *
     * This method does not take the state of the parser into account, making no
     * distinction between global code and function code. Because the "missing
     * 'use strict'" warning is *also* reported at function boundaries, this
     * function interprets `strict` option values `true` and `undefined` as
     * equivalent.
     */
    stmtMissingStrict: function () {
        if (this.option.strict === "global") {
            return true;
        }

        if (this.option.strict === false) {
            return false;
        }

        if (this.option.globalstrict) {
            return true;
        }

        return false;
    },

    allowsGlobalUsd() {
        return this.option.strict === "global" || this.option.globalstrict ||
            this.option.module || this.impliedClosure();
    },

    /**
     * Determine if the current configuration describes an environment that is
     * wrapped in an immediately-invoked function expression prior to evaluation.
     *
     * @returns {boolean}
     */
    impliedClosure(this: IState): boolean {
        return this.option.node || this.option.phantom || this.option.browserify;
    },
    // Assumption: chronologically ES3 < ES5 < ES6 < Moz

    inMoz: function (this: IState): boolean {
        return this.option.moz;
    },

    /**
     * @param {boolean} strict - When `true`, only consider ES6 when in
     *                           "esversion: 6" code.
     */
    inES6: function (this: IState, strict?: boolean): boolean {
        if (strict) {
            return this.option.esversion === 6;
        }
        return this.option.moz || this.option.esversion >= 6;
    },

    /**
     * @param {boolean} strict - When `true`, return `true` only when
     *                           esversion is exactly 5
     */
    inES5: function (this: IState, strict?: boolean): boolean {
        if (strict) {
            return (!this.option.esversion || this.option.esversion === 5) && !this.option.moz;
        }
        return !this.option.esversion || this.option.esversion >= 5 || this.option.moz;
    },

    /**
     * Determine the current version of the input language by inspecting the
     * value of all ECMAScript-version-related options. This logic is necessary
     * to ensure compatibility with deprecated options `es3`, `es5`, and
     * `esnext`, and it may be drastically simplified when those options are
     * removed.
     *
     * @returns {string|null} - the name of any incompatible option detected,
     *                          `null` otherwise
     */
    inferEsVersion(this: IState) {
        var badOpt = null;

        if (this.option.esversion) {
            if (this.option.es3) {
                badOpt = "es3";
            } else if (this.option.es5) {
                badOpt = "es5";
            } else if (this.option.esnext) {
                badOpt = "esnext";
            }

            if (badOpt) {
                return badOpt;
            }

            if (this.option.esversion === 2015) {
                this.esVersion = 6;
            } else {
                this.esVersion = this.option.esversion;
            }
        } else if (this.option.es3) {
            this.esVersion = 3;
        } else if (this.option.esnext) {
            this.esVersion = 6;
        }

        return null;
    },
    reset: function (this: IState): void {
        this.tokens = {
            prev: null,
            next: null,
            curr: null
        };

        this.option = {};
        this.funct = null;
        this.ignored = {};
        this.directive = {};
        this.jsonMode = false;
        this.jsonWarnings = [];
        this.lines = [];
        this.tab = "";
        this.cache = {}; // Node.JS doesn't have Map. Sniff.
        this.ignoredLines = {};
        this.forinifcheckneeded = false;
        this.nameStack = new NameStack();
        this.inClassBody = false;
    }
};
