import OutputFile from '../../editor/workspace/OutputFile';

/**
 *
 */
interface OutputFileHandler<T> {
    (event: { data: OutputFile[] }, source: T): any;
}

export default OutputFileHandler;
