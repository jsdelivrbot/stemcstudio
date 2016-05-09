import Match from '../Match';

export default function bucketCounter<T>(a: Match<T>, b: Match<T>): number {
    return a.counter - b.counter;
}
