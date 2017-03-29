//
// This file is shared between ace-workers and any consumer (such as STEMCstudio).
//
export const EVENT_APPLY_DELTA = 'applyDelta';
export const EVENT_DEFAULT_LIB_CONTENT = 'defaultLibContent';
export const EVENT_ENSURE_SCRIPT = 'ensureScript';
export const EVENT_GET_COMPLETIONS_AT_POSITION = 'getCompletionsAtPosition';
export const EVENT_GET_FORMATTING_EDITS_FOR_DOCUMENT = 'getFormattingEditsForDocument';
export const EVENT_GET_OUTPUT_FILES = 'getOutputFiles';
export const EVENT_GET_SEMANTIC_ERRORS = 'getSemanticErrors';
export const EVENT_GET_SYNTAX_ERRORS = 'getSyntaxErrors';
export const EVENT_GET_LINT_ERRORS = 'getLintErrors';
export const EVENT_GET_QUICK_INFO_AT_POSITION = 'getQuickInfoAtPosition';
export const EVENT_REMOVE_SCRIPT = 'removeScript';
export const EVENT_SET_MODULE_KIND = 'setModuleKind';
export const EVENT_SET_OPERATOR_OVERLOADING = 'setOperatorOverloading';
export const EVENT_SET_SCRIPT_TARGET = 'setScriptTarget';
export const EVENT_SET_TRACE = 'setTrace';

export interface EnsureScriptRequest {
    fileName: string;
    content: string;
    callbackId: number;
}

export interface GetOutputFilesRequest {
    fileName: string;
    callbackId: number;
}

export interface SetModuleKindRequest {
    moduleKind: string;
    callbackId: number;
}

export interface SetOperatorOverloadingRequest {
    operatorOverloading: boolean;
    callbackId: number;
}

export interface SetTraceRequest {
    trace: boolean;
    callbackId: number;
}
