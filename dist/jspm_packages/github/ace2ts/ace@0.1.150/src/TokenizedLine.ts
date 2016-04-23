import Token from './Token';

/**
 * @class TokenizedLine
 */
interface TokenizedLine {

  /**
   * @property state
   * @type string | string[]
   */
  state: string | string[];

  /**
   * @property tokens
   * @type Token[]
   */
  tokens: Token[];
}

export default TokenizedLine;