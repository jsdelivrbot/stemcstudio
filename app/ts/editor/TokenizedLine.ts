import { BasicToken } from './Token';

/**
 *
 */
interface TokenizedLine {

    /**
     *
     */
    state: string | string[];

    /**
     *
     */
    tokens: BasicToken[];
}

export default TokenizedLine;
