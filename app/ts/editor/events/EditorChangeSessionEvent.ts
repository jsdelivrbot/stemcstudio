import { EditSession } from '../EditSession';

/**
 *
 */
interface SessionChangeEvent {

    /**
     *
     */
    session: EditSession | undefined;

    /**
     *
     */
    oldSession: EditSession | undefined;
}

export default SessionChangeEvent;
