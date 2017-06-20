import { Rule } from './Rule';

export interface Match<T> {
    name: string;
    hashCode: number;
    rule: Rule<T>;
    counter: number;
    recency: number;
    match: {
        recency: number[];
    };
}
