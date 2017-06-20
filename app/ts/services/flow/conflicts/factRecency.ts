import { Match } from '../Match';

export function factRecency<T>(a: Match<T>, b: Match<T>): number {
    let i = 0;
    const aMatchRecency = a.match.recency;
    const bMatchRecency = b.match.recency;
    const aLength = aMatchRecency.length - 1;
    const bLength = bMatchRecency.length - 1;
    while (aMatchRecency[i] === bMatchRecency[i] && i < aLength && i < bLength && i++) {
        // Do nothing, just let i increment each pass.
    }
    let ret = aMatchRecency[i] - bMatchRecency[i];
    if (!ret) {
        ret = aLength - bLength;
    }
    return ret;
}
