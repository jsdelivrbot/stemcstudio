import ace from 'ace.js';

/**
 * TODO: This could be an ACE interfaceinterface
 */
interface ChangeHandler {
    (delta: ace.Delta, session: ace.EditSession): any
}

export default ChangeHandler;
