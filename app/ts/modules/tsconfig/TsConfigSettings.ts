/**
 * Lowercase string constants corresponding to the Language Service ScriptTarget enumeration.
 */
export type ScriptTarget = 'es2015' | 'es2016' | 'es2017' | 'es3' | 'es5' | 'esnext' | 'latest';
export type ModuleKind = 'amd' | 'commonjs' | 'es2015' | 'none' | 'system' | 'umd';

export interface TsConfigSettings {
    /**
     * default: true
     */
    allowJs: boolean;
    /**
     * default: true
     */
    declaration: boolean;
    /**
     * default: true
     */
    emitDecoratorMetadata: boolean;
    /**
     * default: true
     */
    experimentalDecorators: boolean;
    module: ModuleKind;
    noImplicitAny: boolean;
    noImplicitReturns: boolean;
    noImplicitThis: boolean;
    noUnusedLocals: boolean;
    noUnusedParameters: boolean;
    /**
     * default: true
     */
    operatorOverloading: boolean;
    preserveConstEnums: boolean;
    /**
     * default: false
     */
    removeComments: false;
    sourceMap: boolean;
    strictNullChecks: boolean;
    suppressImplicitAnyIndexErrors: boolean;
    /**
     * default: 'es5'
     */
    target: ScriptTarget;
    traceResolution: boolean;
}
