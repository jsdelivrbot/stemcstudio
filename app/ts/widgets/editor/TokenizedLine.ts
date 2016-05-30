import Token from './Token';

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
    tokens: Token[];
}

export default TokenizedLine;
