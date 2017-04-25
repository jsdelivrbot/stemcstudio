export type JsxEmit = 'none' | 'preserve' | 'react' | 'react-native';
export type ScriptTarget = 'es2015' | 'es2016' | 'es2017' | 'es3' | 'es5' | 'esnext' | 'latest';
export type ModuleKind = 'amd' | 'commonjs' | 'es2015' | 'none' | 'system' | 'umd';

/**
 * This format is used for the tsconfig.json file.
 */
export interface TsConfigSettings {
    allowJs: boolean;
    declaration: boolean;
    emitDecoratorMetadata: boolean;
    experimentalDecorators: boolean;
    jsx: JsxEmit;
    module: ModuleKind;
    noImplicitAny: boolean;
    noImplicitReturns: boolean;
    noImplicitThis: boolean;
    noUnusedLocals: boolean;
    noUnusedParameters: boolean;
    operatorOverloading: boolean;
    preserveConstEnums: boolean;
    removeComments: false;
    sourceMap: boolean;
    strictNullChecks: boolean;
    suppressImplicitAnyIndexErrors: boolean;
    target: ScriptTarget;
    traceResolution: boolean;
}
