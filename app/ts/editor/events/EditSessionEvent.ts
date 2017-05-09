import { EditSession } from '../EditSession';

export interface EditSessionEvent<T> {
    (event: T, session: EditSession): void;
}
