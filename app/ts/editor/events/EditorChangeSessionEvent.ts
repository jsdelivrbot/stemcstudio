import { EditSession } from '../EditSession';

/**
 *
 */
export interface EditorChangeSessionEvent {

    /**
     *
     */
    session: EditSession | undefined;

    /**
     *
     */
    oldSession: EditSession | undefined;
}
