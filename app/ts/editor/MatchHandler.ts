import MatchOffset from './lib/MatchOffset';
import Range from './Range';

interface MatchHandler {
    (offsetOrRange: MatchOffset | Range, row?: number, startIndex?: number): boolean;
}

export default MatchHandler;
