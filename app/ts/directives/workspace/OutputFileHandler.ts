import { OutputFilesMessage } from '../../modules/wsmodel/IWorkspaceModel';

/**
 *
 */
export interface OutputFileHandler<T> {
    (message: OutputFilesMessage, source: T): any;
}
