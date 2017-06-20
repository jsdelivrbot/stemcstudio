import { RenamedFileMessage } from '../../modules/wsmodel/IWorkspaceModel';

/**
 *
 */
export interface RenamedFileHandler<T> {
    (message: RenamedFileMessage, source: T): any;
}
