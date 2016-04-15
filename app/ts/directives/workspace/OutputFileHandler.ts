import ace from 'ace.js';

/**
 * TODO: This could be an ACE interfaceinterface
 */
interface OutputFileHandler {
    (event: { data: ace.OutputFile[] }, session: ace.EditSession): any
}

export default OutputFileHandler;
