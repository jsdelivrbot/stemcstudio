import { RenamedFileMessage } from '../../wsmodel/IWorkspaceModel';

/**
 *
 */
interface RenamedFileHandler<T> {
    (message: RenamedFileMessage, source: T): any;
}

export default RenamedFileHandler;
