import { Match } from '../Match';

export function salience<T>(a: Match<T>, b: Match<T>): number {
    return a.rule.priority - b.rule.priority;
}
