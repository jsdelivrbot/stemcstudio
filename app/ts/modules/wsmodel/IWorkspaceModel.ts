// FIXME: Wierd coupling.
import OutputFile from '../../editor/workspace/OutputFile';

export interface IWorkspaceModel {

}

export default IWorkspaceModel;

export const changedOperatorOverloadingTopic = 'changedOperatorOverloading';
export const outputFilesTopic = 'outputFiles';
export const renamedFileTopic = 'renamedFile';

export class ChangedOperatorOverloadingMessage {
    constructor(public oldValue: boolean, public newValue: boolean) {
    }
}

export class OutputFilesMessage {
    constructor(public files: OutputFile[]) {
    }
}

export class RenamedFileMessage {
    constructor(public oldPath: string, public newPath: string) {
    }
}

