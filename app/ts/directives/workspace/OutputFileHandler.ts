import ace from 'ace.js';

/**
 * TODO: This could be an ACE interface?
 */
interface OutputFileHandler {
    (event: { data: ace.OutputFile[] }, session: ace.EditSession): any
}

export default OutputFileHandler;
