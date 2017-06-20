import { Match } from '../Match';

export function bucketCounter<T>(a: Match<T>, b: Match<T>): number {
    return a.counter - b.counter;
}
