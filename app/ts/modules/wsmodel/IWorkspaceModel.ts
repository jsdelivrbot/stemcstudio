// FIXME: Wierd coupling.
import { OutputFile } from '../../editor/workspace/OutputFile';

export interface IWorkspaceModel {

}

export const WORKSPACE_MODEL_UUID = 'workspaceModel';

export default IWorkspaceModel;

export const changedLinting = 'changedLinting';
export const changedOperatorOverloading = 'changedOperatorOverloading';
export const outputFilesTopic = 'outputFiles';
export const renamedFileTopic = 'renamedFile';

/**
 * 
 */
export class ChangedLintingMessage {
    constructor(public oldValue: boolean, public newValue: boolean) {
    }
}

/**
 *
 */
export interface ChangedLintingHandler<T> {
    (message: ChangedLintingMessage, source: T): any;
}

/**
 * 
 */
export class ChangedOperatorOverloadingMessage {
    constructor(public oldValue: boolean, public newValue: boolean) {
    }
}

/**
 *
 */
export interface ChangedOperatorOverloadingHandler<T> {
    (message: ChangedOperatorOverloadingMessage, source: T): any;
}

/**
 * 
 */
export class OutputFilesMessage {
    constructor(public files: OutputFile[]) {
    }
}

/**
 * 
 */
export class RenamedFileMessage {
    constructor(public oldPath: string, public newPath: string) {
    }
}

