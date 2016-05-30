import Rule from './Rule';
import Tokenizer from './Tokenizer';

export default function createTokenizer(rules: { [name: string]: Rule[] }): Tokenizer {
    return new Tokenizer(rules);
}
