import Match from './Match';
interface ConflictResolutionStrategy<T> {
    (a: Match<T>, b: Match<T>): number
}

export default ConflictResolutionStrategy;
