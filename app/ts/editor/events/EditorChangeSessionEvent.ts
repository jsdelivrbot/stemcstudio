import EditSession from '../EditSession';

/**
 *
 */
interface SessionChangeEvent {

    /**
     *
     */
    session: EditSession;

    /**
     *
     */
    oldSession: EditSession;
}

export default SessionChangeEvent;
