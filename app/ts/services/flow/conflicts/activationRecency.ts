import Match from '../Match';

export default function activationRecency<T>(a: Match<T>, b: Match<T>): number {
    return a.recency - b.recency;
}
