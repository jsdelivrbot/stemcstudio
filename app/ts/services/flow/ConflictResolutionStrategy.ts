import { Match } from './Match';

export interface ConflictResolutionStrategy<T> {
    (a: Match<T>, b: Match<T>): number;
}
