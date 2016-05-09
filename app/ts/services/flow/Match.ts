import Rule from './Rule';

interface Match<T> {
    name: string;
    hashCode: number;
    rule: Rule<T>;
    counter: number;
    recency: number;
    match: {
        recency: number[];
    };
}

export default Match;
