//
// This file is shared between ace-workers and any consumer (such as STEMCstudio).
//
export const EVENT_APPLY_DELTA = 'applyDelta';
export const EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';
export const EVENT_ENSURE_MODULE_MAPPING = 'ensureModuleMapping';
export const EVENT_ENSURE_SCRIPT = 'ensureScript';
export const EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition';
export const EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT = 'getFormattingEditsForDocument';
export const EVENT_GET_OUTPUT_FILES = 'getOutputFiles';
export const EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors';
export const EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors';
export const EVENT_GET_LINT_ERRORS = 'getLintErrors';
export const EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition';
export const EVENT_REMOVE_MODULE_MAPPING = 'removeModuleMapping';
export const EVENT_REMOVE_SCRIPT = 'removeScript';
export const EVENT_SET_MODULE_KIND = 'setModuleKind';
export const EVENT_SET_OPERATOR_OVERLOADING = 'setOperatorOverloading';
export const EVENT_SET_SCRIPT_TARGET = 'setScriptTarget';
export const EVENT_SET_TRACE = 'setTrace';
export const EVENT_SET_TS_CONFIG = 'setTsConfig';

export interface EnsureScriptRequest {
    fileName: string;
    content: string;
    callbackId: number;
}

export interface RemoveScriptRequest {
    fileName: string;
    callbackId: number;
}

export interface EnsureModuleMappingRequest {
    moduleName: string;
    fileName: string;
    callbackId: number;
}

export interface RemoveModuleMappingRequest {
    moduleName: string;
    callbackId: number;
}

export interface GetOutputFilesRequest {
    fileName: string;
    callbackId: number;
}

export interface SetModuleKindRequest {
    moduleKind: ModuleKind;
    callbackId: number;
}

export interface SetOperatorOverloadingRequest {
    operatorOverloading: boolean;
    callbackId: number;
}

export interface SetScriptTargetRequest {
    scriptTarget: ScriptTarget;
    callbackId: number;
}

export interface SetTraceRequest {
    trace: boolean;
    callbackId: number;
}

/**
 * Lowercase string constants corresponding to the Language Service ScriptTarget enumeration.
 */
export type JsxEmit = 'none' | 'preserve' | 'react' | 'react-native';

/**
 * Lowercase string constants corresponding to the Language Service ScriptTarget enumeration.
 */
export type ScriptTarget = 'es2015' | 'es2016' | 'es2017' | 'es3' | 'es5' | 'esnext' | 'latest';

/**
 * Lowercase string constants corresponding to the Language Service ModuleKind enumeration.
 */
export type ModuleKind = 'amd' | 'commonjs' | 'es2015' | 'none' | 'system' | 'umd';

/**
 * The format used for tsconfig.json and for the inter-thread communication.
 */
export interface TsConfigSettings {
    allowJs?: boolean;
    declaration?: boolean;
    emitDecoratorMetadata?: boolean;
    experimentalDecorators: boolean;
    jsx?: JsxEmit;
    module?: ModuleKind;
    noImplicitAny?: boolean;
    noImplicitReturns?: boolean;
    noImplicitThis?: boolean;
    noUnusedLocals?: boolean;
    noUnusedParameters?: boolean;
    operatorOverloading?: boolean;
    preserveConstEnums?: boolean;
    removeComments?: boolean;
    sourceMap?: boolean;
    strictNullChecks?: boolean;
    suppressImplicitAnyIndexErrors?: boolean;
    target?: ScriptTarget;
    traceResolution?: boolean;
}

export interface SetTsConfigRequest {
    settings: TsConfigSettings;
    callbackId: number;
}
