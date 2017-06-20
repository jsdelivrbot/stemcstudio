import { MatchOffset } from './lib/MatchOffset';
import { Range } from './Range';

export interface MatchHandler {
    (offsetOrRange: MatchOffset | Range, row?: number, startIndex?: number): boolean;
}
