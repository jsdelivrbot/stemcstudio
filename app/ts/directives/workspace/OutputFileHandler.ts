import { OutputFilesMessage } from '../../wsmodel/IWorkspaceModel';

/**
 *
 */
interface OutputFileHandler<T> {
    (message: OutputFilesMessage, source: T): any;
}

export default OutputFileHandler;
