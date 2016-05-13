import EditSession from '../../widgets/editor/EditSession';
import OutputFile from '../../widgets/editor/workspace/OutputFile';

/**
 * TODO: This could be an ACE interface?
 */
interface OutputFileHandler {
    (event: { data: OutputFile[] }, session: EditSession): any;
}

export default OutputFileHandler;
