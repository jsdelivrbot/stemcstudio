// FIXME: Wierd coupling.
import OutputFile from '../../editor/workspace/OutputFile';

export interface IWorkspaceModel {

}

export default IWorkspaceModel;

export const outputFilesTopic = 'outputFiles';
export const renamedFileTopic = 'renamedFile';

export class OutputFilesMessage {
    constructor(public files: OutputFile[]) {
    }
}
export class RenamedFileMessage {
    constructor(public oldPath: string, public newPath: string) {
    }
}

