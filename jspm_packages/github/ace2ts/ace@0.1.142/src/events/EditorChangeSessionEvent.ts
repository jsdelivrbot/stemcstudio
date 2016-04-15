import EditSession from '../EditSession';

/**
 * @class SessionChangeEvent
 */
interface SessionChangeEvent {

    /**
     * @property session
     * @type EditSession
     */
    session: EditSession;

    /**
     * @property oldSession
     * @type EditSession
     */
    oldSession: EditSession;
}

export default SessionChangeEvent;