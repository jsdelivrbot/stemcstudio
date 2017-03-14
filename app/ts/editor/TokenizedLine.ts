import { BasicToken } from './Token';
/**
 *
 */
interface TokenizedLine<T extends BasicToken, E, S extends Array<string | E>> {

    /**
     *
     */
    state: string | S;

    /**
     *
     */
    tokens: T[];
}

export default TokenizedLine;
