/**
 *
 */
interface TokenizedLine<T> {

    /**
     *
     */
    state: string | string[];

    /**
     *
     */
    tokens: T[];
}

export default TokenizedLine;
